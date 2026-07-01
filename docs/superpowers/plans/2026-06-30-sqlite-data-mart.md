# SQLite Data Mart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace in-memory CSV merge with a SQLite Star Schema Data Mart built once via ETL; Streamlit app reads only from `data/olist_mart.db`.

**Architecture:** A separate `src/etl.py` script reads 8 CSVs, computes Haversine distance and delivery delay in Python (numpy vectorized), then writes a Star Schema SQLite file using WAL mode and `executemany` bulk inserts with strategic indexes. `src/loader.py` is replaced with a single SQL query. Analysis gains 3 new KPIs (avg distance, avg delay, late-delivery rate). App guards against missing DB before loading.

**Tech Stack:** Python stdlib `sqlite3`, `pandas`, `numpy` (haversine via vectorized ops), `pytest` with session-scoped `tmp_path` fixtures.

## Global Constraints

- Python stdlib `sqlite3` only — no SQLAlchemy, no external DB driver
- WAL mode: `PRAGMA journal_mode=WAL` on every write connection
- Bulk inserts via `cursor.executemany()` — no row-by-row loops
- `load_data()` public signature change: `data_dir: str` → `db_path: str`; returns same `pd.DataFrame` plus `distance_km` and `delivery_delay_days` columns
- `run_analysis()` signature unchanged: `{"kpis": {...}, "figs": {...}}` shape, additive KPIs only
- No new pip dependencies — `numpy` is already a `pandas` transitive dep
- Fact table covers **delivered orders only**
- Seller and product per order = first item (preserves current simplification)

---

### Task 1: Fixture infrastructure

**Files:**
- Modify: `tests/fixtures/olist_orders_dataset.csv`
- Modify: `tests/fixtures/olist_products_dataset.csv`
- Create: `tests/fixtures/olist_sellers_dataset.csv`
- Create: `tests/fixtures/olist_geolocation_dataset.csv`
- Modify: `tests/conftest.py`

**Interfaces:**
- Produces: `test_db_path` session fixture (`str` — path to SQLite DB built from fixture CSVs, created once per test session)
- Produces: updated `sample_df` with columns `distance_km` and `delivery_delay_days` (one row per order)

- [ ] **Step 1: Update `tests/fixtures/olist_orders_dataset.csv`** — add delivery date columns

```csv
order_id,customer_id,order_status,order_purchase_timestamp,order_delivered_customer_date,order_estimated_delivery_date
o1,c1,delivered,2018-01-15 10:00:00,2018-01-25 10:00:00,2018-01-30 10:00:00
o2,c2,delivered,2018-03-10 14:00:00,2018-03-25 14:00:00,2018-03-20 14:00:00
o3,c3,canceled,2018-06-05 09:00:00,,2018-06-20 09:00:00
```

`o1` delivered 5 days early (delay=-5). `o2` delivered 5 days late (delay=+5). `o3` canceled → excluded from fact table.

- [ ] **Step 2: Update `tests/fixtures/olist_products_dataset.csv`** — add weight/dimension columns

```csv
product_id,product_category_name,product_weight_g,product_length_cm,product_height_cm,product_width_cm
p1,eletronicos,500,20,10,15
p2,moveis_decoracao,2000,80,60,40
```

- [ ] **Step 3: Create `tests/fixtures/olist_sellers_dataset.csv`**

```csv
seller_id,seller_zip_code_prefix,seller_city,seller_state
s1,04557,sao paulo,SP
s2,20040,rio de janeiro,RJ
```

- [ ] **Step 4: Create `tests/fixtures/olist_geolocation_dataset.csv`**

```csv
geolocation_zip_code_prefix,geolocation_lat,geolocation_lng,geolocation_city,geolocation_state
01000,-23.5505,-46.6333,sao paulo,SP
04557,-23.6200,-46.6800,sao paulo,SP
20000,-22.9068,-43.1729,rio de janeiro,RJ
20040,-22.9000,-43.1800,rio de janeiro,RJ
30000,-19.9167,-43.9345,belo horizonte,MG
```

Customer `c1` ZIP `01000` (SP) → seller `s1` ZIP `04557` (SP) ≈ 9 km.  
Customer `c2` ZIP `20000` (RJ) → seller `s1` ZIP `04557` (SP) ≈ 368 km.

- [ ] **Step 5: Replace `tests/conftest.py`**

```python
import os
import tempfile
import pytest
import pandas as pd
from datetime import datetime

FIXTURES = os.path.join(os.path.dirname(__file__), "fixtures")


@pytest.fixture
def sample_df():
    """One row per order — matches load_data() output after SQLite refactor.

    payment_value sum = 638, order_id.nunique() = 3 — matches previous fixture totals.
    """
    return pd.DataFrame({
        "order_id": ["o1", "o2", "o3"],
        "order_purchase_timestamp": [
            datetime(2018, 1, 15),
            datetime(2018, 3, 10),
            datetime(2018, 6, 5),
        ],
        "order_status": ["delivered", "delivered", "delivered"],
        "price": [150.0, 280.0, 150.0],
        "freight_value": [15.0, 28.0, 15.0],
        "payment_value": [165.0, 308.0, 165.0],
        "product_category_name_english": ["electronics", "electronics", "books"],
        "customer_state": ["SP", "RJ", "MG"],
        "distance_km": [9.0, 368.0, 430.0],
        "delivery_delay_days": [-5.0, 5.0, 0.0],
    })


@pytest.fixture(scope="session")
def test_db_path():
    """SQLite Data Mart built from fixture CSVs — created once per test session."""
    from src.etl import build_mart

    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as f:
        db = f.name
    build_mart(data_dir=FIXTURES, db_path=db)
    yield db
    os.unlink(db)
```

- [ ] **Step 6: Run existing tests to confirm sample_df change is backward-compatible**

```bash
python -m pytest tests/test_analysis.py tests/test_agent.py -v
```

Expected: all PASS. The `payment_value` sum is still 638; `order_id.nunique()` is still 3.  
(`test_db_path` depends on `src.etl` which doesn't exist yet — that fixture won't be called until Task 3.)

- [ ] **Step 7: Commit**

```bash
git add tests/fixtures/ tests/conftest.py
git commit -m "test: extend fixtures with delivery dates, geolocation, sellers; update sample_df"
```

---

### Task 2: `src/etl.py` — Star Schema ETL

**Files:**
- Create: `src/etl.py`
- Create: `tests/test_etl.py`

**Interfaces:**
- Produces: `build_mart(data_dir: str = "data", db_path: str = "data/olist_mart.db") -> None`
- Produces: `data/olist_mart.db` with tables `fact_orders`, `dim_customers`, `dim_sellers`, `dim_products`, `dim_date` and indexes `idx_fact_seller`, `idx_fact_customer`, `idx_fact_date`, `idx_fact_product`
- Consumes: all 8 CSVs from Task 1 fixture directory

- [ ] **Step 1: Write failing tests** — create `tests/test_etl.py`

```python
import os
import sqlite3
import pytest

FIXTURES = os.path.join(os.path.dirname(__file__), "fixtures")


@pytest.fixture
def tmp_db(tmp_path):
    return str(tmp_path / "test.db")


def test_build_mart_creates_db(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    assert os.path.exists(tmp_db)


def test_build_mart_creates_all_tables(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    tables = {r[0] for r in conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table'"
    ).fetchall()}
    conn.close()
    assert tables == {"fact_orders", "dim_customers", "dim_sellers", "dim_products", "dim_date"}


def test_fact_orders_excludes_canceled(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    count = conn.execute("SELECT COUNT(*) FROM fact_orders").fetchone()[0]
    conn.close()
    assert count == 2  # o1 and o2 only; o3 is canceled


def test_fact_orders_has_distance_km(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    rows = {r[0]: r[1] for r in conn.execute(
        "SELECT order_id, distance_km FROM fact_orders ORDER BY order_id"
    ).fetchall()}
    conn.close()
    assert rows["o1"] is not None and rows["o1"] > 0
    assert rows["o2"] is not None and rows["o2"] > 0
    assert rows["o1"] < rows["o2"]  # SP-to-SP < RJ-to-SP


def test_fact_orders_has_delivery_delay(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    rows = {r[0]: r[1] for r in conn.execute(
        "SELECT order_id, delivery_delay_days FROM fact_orders ORDER BY order_id"
    ).fetchall()}
    conn.close()
    assert rows["o1"] == pytest.approx(-5.0)   # delivered 5 days early
    assert rows["o2"] == pytest.approx(5.0)    # delivered 5 days late


def test_dim_customers_has_lat_lng(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    row = conn.execute(
        "SELECT lat, lng FROM dim_customers WHERE customer_id='c1'"
    ).fetchone()
    conn.close()
    assert row is not None
    assert row[0] == pytest.approx(-23.5505, abs=0.01)
    assert row[1] == pytest.approx(-46.6333, abs=0.01)


def test_indexes_exist(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    indexes = {r[0] for r in conn.execute(
        "SELECT name FROM sqlite_master WHERE type='index'"
    ).fetchall()}
    conn.close()
    assert "idx_fact_seller" in indexes
    assert "idx_fact_date" in indexes
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python -m pytest tests/test_etl.py -v
```

Expected: `ModuleNotFoundError: No module named 'src.etl'`

- [ ] **Step 3: Write `src/etl.py`**

```python
import os
import sqlite3
import numpy as np
import pandas as pd


def _haversine(lat1: np.ndarray, lon1: np.ndarray, lat2: np.ndarray, lon2: np.ndarray) -> np.ndarray:
    R = 6371.0
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat / 2) ** 2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2) ** 2
    return 2 * R * np.arcsin(np.sqrt(a))


def build_mart(data_dir: str = "data", db_path: str = "data/olist_mart.db") -> None:
    # 1. Read CSVs
    orders = pd.read_csv(
        os.path.join(data_dir, "olist_orders_dataset.csv"),
        parse_dates=[
            "order_purchase_timestamp",
            "order_delivered_customer_date",
            "order_estimated_delivery_date",
        ],
    )
    items = pd.read_csv(os.path.join(data_dir, "olist_order_items_dataset.csv"))
    products = pd.read_csv(os.path.join(data_dir, "olist_products_dataset.csv"))
    translation = pd.read_csv(os.path.join(data_dir, "product_category_name_translation.csv"))
    payments = pd.read_csv(os.path.join(data_dir, "olist_order_payments_dataset.csv"))
    customers = pd.read_csv(os.path.join(data_dir, "olist_customers_dataset.csv"))
    sellers = pd.read_csv(os.path.join(data_dir, "olist_sellers_dataset.csv"))
    geo = pd.read_csv(os.path.join(data_dir, "olist_geolocation_dataset.csv"))

    # 2. Geo centroids: mean lat/lng per ZIP prefix
    geo_centroids = (
        geo.groupby("geolocation_zip_code_prefix")[["geolocation_lat", "geolocation_lng"]]
        .mean()
        .reset_index()
        .rename(columns={
            "geolocation_zip_code_prefix": "zip",
            "geolocation_lat": "lat",
            "geolocation_lng": "lng",
        })
    )

    # 3. Dimension tables
    cust_geo = customers.merge(
        geo_centroids, left_on="customer_zip_code_prefix", right_on="zip", how="left"
    )
    dim_customers = cust_geo[["customer_id", "customer_state", "customer_city", "lat", "lng"]]

    sell_geo = sellers.merge(
        geo_centroids, left_on="seller_zip_code_prefix", right_on="zip", how="left"
    )
    dim_sellers = sell_geo[["seller_id", "seller_state", "seller_city", "lat", "lng"]]

    prods = products.merge(translation, on="product_category_name", how="left")
    has_weight = "product_weight_g" in prods.columns
    if has_weight:
        volume = prods["product_length_cm"] * prods["product_height_cm"] * prods["product_width_cm"]
        dim_products = prods.assign(weight_g=prods["product_weight_g"], volume_cm3=volume)[
            ["product_id", "product_category_name_english", "weight_g", "volume_cm3"]
        ]
    else:
        dim_products = prods[["product_id", "product_category_name_english"]].assign(
            weight_g=None, volume_cm3=None
        )

    # 4. Aggregate items per order (first product/seller, sum price/freight)
    items_agg = (
        items.groupby("order_id")
        .agg(
            price=("price", "sum"),
            freight_value=("freight_value", "sum"),
            product_id=("product_id", "first"),
            seller_id=("seller_id", "first"),
        )
        .reset_index()
    )

    payments_agg = payments.groupby("order_id")["payment_value"].sum().reset_index()

    # 5. Build fact table (delivered orders only)
    delivered = orders[orders["order_status"] == "delivered"].copy()
    fact = (
        delivered
        .merge(items_agg, on="order_id", how="left")
        .merge(payments_agg, on="order_id", how="left")
    )

    # 6. Delivery delay in days (negative = early, positive = late)
    fact["delivery_delay_days"] = (
        (fact["order_delivered_customer_date"] - fact["order_estimated_delivery_date"])
        .dt.total_seconds() / 86400
    )

    # 7. Haversine distance seller → customer
    fact = (
        fact
        .merge(
            cust_geo[["customer_id", "lat", "lng"]].rename(columns={"lat": "c_lat", "lng": "c_lng"}),
            on="customer_id",
            how="left",
        )
        .merge(
            sell_geo[["seller_id", "lat", "lng"]].rename(columns={"lat": "s_lat", "lng": "s_lng"}),
            on="seller_id",
            how="left",
        )
    )
    fact["distance_km"] = _haversine(
        fact["c_lat"].values,
        fact["c_lng"].values,
        fact["s_lat"].values,
        fact["s_lng"].values,
    )

    # 8. dim_date
    ts = delivered["order_purchase_timestamp"].dropna()
    dim_date = pd.DataFrame({
        "date_id": ts.dt.strftime("%Y-%m-%d"),
        "year": ts.dt.year,
        "month": ts.dt.month,
        "quarter": ts.dt.quarter,
        "day_of_week": ts.dt.dayofweek,
    }).drop_duplicates("date_id")

    # 9. Write to SQLite
    parent = os.path.dirname(db_path)
    if parent:
        os.makedirs(parent, exist_ok=True)

    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.executescript("""
        DROP TABLE IF EXISTS fact_orders;
        DROP TABLE IF EXISTS dim_customers;
        DROP TABLE IF EXISTS dim_sellers;
        DROP TABLE IF EXISTS dim_products;
        DROP TABLE IF EXISTS dim_date;

        CREATE TABLE dim_date (
            date_id TEXT PRIMARY KEY,
            year INTEGER,
            month INTEGER,
            quarter INTEGER,
            day_of_week INTEGER
        );
        CREATE TABLE dim_customers (
            customer_id TEXT PRIMARY KEY,
            customer_state TEXT,
            customer_city TEXT,
            lat REAL,
            lng REAL
        );
        CREATE TABLE dim_sellers (
            seller_id TEXT PRIMARY KEY,
            seller_state TEXT,
            seller_city TEXT,
            lat REAL,
            lng REAL
        );
        CREATE TABLE dim_products (
            product_id TEXT PRIMARY KEY,
            product_category_name_english TEXT,
            weight_g REAL,
            volume_cm3 REAL
        );
        CREATE TABLE fact_orders (
            order_id TEXT,
            customer_id TEXT,
            seller_id TEXT,
            product_id TEXT,
            date_id TEXT,
            price REAL,
            freight_value REAL,
            payment_value REAL,
            distance_km REAL,
            delivery_delay_days REAL,
            order_status TEXT,
            order_purchase_timestamp TEXT
        );
        CREATE INDEX idx_fact_seller   ON fact_orders(seller_id);
        CREATE INDEX idx_fact_customer ON fact_orders(customer_id);
        CREATE INDEX idx_fact_date     ON fact_orders(date_id);
        CREATE INDEX idx_fact_product  ON fact_orders(product_id);
    """)

    cur = conn.cursor()

    cur.executemany(
        "INSERT INTO dim_date VALUES (?,?,?,?,?)",
        dim_date[["date_id", "year", "month", "quarter", "day_of_week"]].itertuples(index=False, name=None),
    )
    cur.executemany(
        "INSERT INTO dim_customers VALUES (?,?,?,?,?)",
        dim_customers[["customer_id", "customer_state", "customer_city", "lat", "lng"]].itertuples(index=False, name=None),
    )
    cur.executemany(
        "INSERT INTO dim_sellers VALUES (?,?,?,?,?)",
        dim_sellers[["seller_id", "seller_state", "seller_city", "lat", "lng"]].itertuples(index=False, name=None),
    )
    cur.executemany(
        "INSERT INTO dim_products VALUES (?,?,?,?)",
        dim_products[["product_id", "product_category_name_english", "weight_g", "volume_cm3"]].itertuples(index=False, name=None),
    )

    fact["date_id"] = fact["order_purchase_timestamp"].dt.strftime("%Y-%m-%d")
    fact_rows = fact[[
        "order_id", "customer_id", "seller_id", "product_id", "date_id",
        "price", "freight_value", "payment_value",
        "distance_km", "delivery_delay_days",
        "order_status", "order_purchase_timestamp",
    ]].copy()
    fact_rows["order_purchase_timestamp"] = fact_rows["order_purchase_timestamp"].astype(str)

    cur.executemany(
        "INSERT INTO fact_orders VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        fact_rows.itertuples(index=False, name=None),
    )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    build_mart()
    print("Data mart built: data/olist_mart.db")
```

- [ ] **Step 4: Run ETL tests to verify they pass**

```bash
python -m pytest tests/test_etl.py -v
```

Expected: all 7 tests PASS

- [ ] **Step 5: Run full suite**

```bash
python -m pytest -v
```

Expected: all PASS

- [ ] **Step 6: Commit**

```bash
git add src/etl.py tests/test_etl.py
git commit -m "feat: add ETL pipeline that builds SQLite Star Schema Data Mart"
```

---

### Task 3: Refactor `src/loader.py` to query SQLite

**Files:**
- Modify: `src/loader.py`
- Modify: `tests/test_loader.py`

**Interfaces:**
- Consumes: `test_db_path` session fixture (str path to SQLite DB built by `build_mart`)
- Produces: `load_data(db_path: str = "data/olist_mart.db") -> pd.DataFrame` with columns: `order_id`, `order_purchase_timestamp`, `order_status`, `price`, `freight_value`, `payment_value`, `product_category_name_english`, `customer_state`, `distance_km`, `delivery_delay_days`

- [ ] **Step 1: Write failing tests** — replace `tests/test_loader.py`

```python
import pytest
import pandas as pd
from src.loader import load_data


def test_load_data_returns_dataframe(test_db_path):
    df = load_data(test_db_path)
    assert df is not None
    assert len(df) > 0


def test_load_data_filters_delivered_only(test_db_path):
    df = load_data(test_db_path)
    assert (df["order_status"] == "delivered").all()


def test_load_data_has_required_columns(test_db_path):
    df = load_data(test_db_path)
    required = {
        "order_id", "order_purchase_timestamp", "order_status",
        "price", "freight_value", "payment_value",
        "product_category_name_english", "customer_state",
        "distance_km", "delivery_delay_days",
    }
    assert required.issubset(set(df.columns))


def test_load_data_parses_timestamps(test_db_path):
    df = load_data(test_db_path)
    assert pd.api.types.is_datetime64_any_dtype(df["order_purchase_timestamp"])


def test_load_data_payment_value_numeric(test_db_path):
    df = load_data(test_db_path)
    assert pd.api.types.is_numeric_dtype(df["payment_value"])


def test_load_data_distance_km_positive(test_db_path):
    df = load_data(test_db_path)
    assert (df["distance_km"] > 0).all()


def test_load_data_delivery_delay_numeric(test_db_path):
    df = load_data(test_db_path)
    assert pd.api.types.is_numeric_dtype(df["delivery_delay_days"])
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python -m pytest tests/test_loader.py -v
```

Expected: FAIL — `load_data` still expects a directory string, not a DB path

- [ ] **Step 3: Replace `src/loader.py`**

```python
import sqlite3
import pandas as pd


def load_data(db_path: str = "data/olist_mart.db") -> pd.DataFrame:
    conn = sqlite3.connect(db_path)
    df = pd.read_sql_query(
        """
        SELECT
            f.order_id,
            f.order_purchase_timestamp,
            f.order_status,
            f.price,
            f.freight_value,
            f.payment_value,
            f.distance_km,
            f.delivery_delay_days,
            p.product_category_name_english,
            c.customer_state
        FROM fact_orders f
        JOIN dim_products  p ON f.product_id  = p.product_id
        JOIN dim_customers c ON f.customer_id = c.customer_id
        """,
        conn,
        parse_dates=["order_purchase_timestamp"],
    )
    conn.close()
    return df
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_loader.py -v
```

Expected: all 7 tests PASS

- [ ] **Step 5: Run full suite**

```bash
python -m pytest -v
```

Expected: all PASS

- [ ] **Step 6: Commit**

```bash
git add src/loader.py tests/test_loader.py
git commit -m "refactor: replace CSV merge in loader with SQLite query"
```

---

### Task 4: Enrich `src/analysis.py` with distance and delay KPIs

**Files:**
- Modify: `src/analysis.py`
- Modify: `tests/test_analysis.py`

**Interfaces:**
- Consumes: `sample_df` with `distance_km=[9.0, 368.0, 430.0]` and `delivery_delay_days=[-5.0, 5.0, 0.0]` (Task 1 conftest)
- Produces: `run_analysis(df)["kpis"]` gains keys `avg_distance_km`, `avg_delivery_delay_days`, `late_delivery_rate`

Expected values with Task 1 `sample_df`:
- `avg_distance_km` = round((9+368+430)/3, 1) = 269.0
- `avg_delivery_delay_days` = round((-5+5+0)/3, 1) = 0.0
- `late_delivery_rate` = round(1/3 * 100, 1) = 33.3

- [ ] **Step 1: Write failing tests** — add to `tests/test_analysis.py`

```python
def test_kpis_avg_distance_km(sample_df):
    result = run_analysis(sample_df)
    expected = round(sample_df["distance_km"].mean(), 1)
    assert abs(result["kpis"]["avg_distance_km"] - expected) < 0.1


def test_kpis_avg_delivery_delay(sample_df):
    result = run_analysis(sample_df)
    expected = round(sample_df["delivery_delay_days"].mean(), 1)
    assert abs(result["kpis"]["avg_delivery_delay_days"] - expected) < 0.1


def test_kpis_late_delivery_rate(sample_df):
    result = run_analysis(sample_df)
    expected = round((sample_df["delivery_delay_days"] > 0).mean() * 100, 1)
    assert abs(result["kpis"]["late_delivery_rate"] - expected) < 0.1
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python -m pytest tests/test_analysis.py::test_kpis_avg_distance_km tests/test_analysis.py::test_kpis_avg_delivery_delay tests/test_analysis.py::test_kpis_late_delivery_rate -v
```

Expected: FAIL — `KeyError: 'avg_distance_km'`

- [ ] **Step 3: Update `src/analysis.py`** — add 3 new KPIs; keep all existing logic unchanged

```python
import pandas as pd
from src.charts import bar_chart, line_chart, states_bar_chart


def run_analysis(df: pd.DataFrame) -> dict:
    total_revenue = round(df["payment_value"].sum(), 2)
    total_orders = df["order_id"].nunique()
    aov = round(total_revenue / total_orders, 2) if total_orders > 0 else 0.0
    avg_distance_km = round(df["distance_km"].mean(), 1)
    avg_delivery_delay_days = round(df["delivery_delay_days"].mean(), 1)
    late_delivery_rate = round((df["delivery_delay_days"] > 0).mean() * 100, 1)

    monthly_agg = (
        df.assign(month=df["order_purchase_timestamp"].dt.to_period("M").astype(str))
        .groupby("month")["payment_value"].sum()
        .reset_index()
        .rename(columns={"payment_value": "revenue"})
        .sort_values("month")
    )
    fig_monthly = line_chart(monthly_agg, x="month", y="revenue", title="Revenue mensual (R$)")

    top_cats = (
        df.groupby("product_category_name_english")["payment_value"].sum()
        .reset_index()
        .rename(columns={"payment_value": "revenue"})
        .sort_values("revenue", ascending=False)
        .head(10)
    )
    fig_categories = bar_chart(top_cats, x="product_category_name_english", y="revenue",
                               title="Top 10 categorías por revenue (R$)")

    by_state = (
        df.groupby("customer_state")["payment_value"].sum()
        .reset_index()
        .rename(columns={"payment_value": "revenue"})
    )
    fig_states = states_bar_chart(by_state, state_col="customer_state",
                                  value_col="revenue", title="Revenue por estado (R$)")

    return {
        "kpis": {
            "total_revenue": total_revenue,
            "total_orders": total_orders,
            "aov": aov,
            "avg_distance_km": avg_distance_km,
            "avg_delivery_delay_days": avg_delivery_delay_days,
            "late_delivery_rate": late_delivery_rate,
        },
        "figs": {
            "monthly": fig_monthly,
            "categories": fig_categories,
            "states": fig_states,
        },
    }
```

- [ ] **Step 4: Run analysis tests to verify all pass**

```bash
python -m pytest tests/test_analysis.py -v
```

Expected: all 8 tests PASS

- [ ] **Step 5: Run full suite**

```bash
python -m pytest -v
```

Expected: all PASS

- [ ] **Step 6: Commit**

```bash
git add src/analysis.py tests/test_analysis.py
git commit -m "feat: add avg_distance_km, avg_delivery_delay_days, late_delivery_rate KPIs"
```

---

### Task 5: Update `app.py` and README

**Files:**
- Modify: `app.py`
- Modify: `README.md`

**Interfaces:**
- Consumes: `load_data(db_path)` — new signature from Task 3
- Consumes: `run_analysis(df)["kpis"]` — new keys from Task 4

- [ ] **Step 1: Replace `app.py`**

```python
import os
import streamlit as st
from dotenv import load_dotenv
from src.loader import load_data
from src.analysis import run_analysis
from src.agent import build_agent, ask

load_dotenv()

DB_PATH = os.path.join("data", "olist_mart.db")

st.set_page_config(
    page_title="AI Sales Assistant",
    page_icon="🫡",
    layout="wide",
)

st.title("🤖 AI Sales Assistant")
st.caption(
    "Olist Brazilian E-Commerce · LangChain + NVIDIA NIM · "
    "[Code on GitHub](https://github.com/HoracioLaphitz/ai-sales-assistant)"
)

if not os.path.exists(DB_PATH):
    st.error(
        "❌ Data mart not found. "
        "Run `python -m src.etl` once to build it before starting the app."
    )
    st.stop()


@st.cache_data
def get_data():
    return load_data(DB_PATH)


@st.cache_data
def get_analysis(_df):
    return run_analysis(_df)


@st.cache_resource
def get_agent(_df, api_key):
    return build_agent(_df, api_key)


api_key = os.environ.get("NVAPI", "")

if not api_key:
    st.error("❌ NVAPI not found. Set the NVAPI environment variable before running the app.")
    st.stop()

with st.spinner("Loading Olist data (~100k orders)..."):
    df = get_data()

analysis = get_analysis(df)
kpis = analysis["kpis"]
figs = analysis["figs"]

tab1, tab2 = st.tabs(["📊 Analysis", "💬 Questions"])

with tab1:
    col1, col2, col3 = st.columns(3)
    col1.metric("Total Revenue", f"R$ {kpis['total_revenue']:,.0f}")
    col2.metric("Delivered Orders", f"{kpis['total_orders']:,}")
    col3.metric("Average Order Value", f"R$ {kpis['aov']:,.2f}")

    col4, col5, col6 = st.columns(3)
    col4.metric("Avg Distance (km)", f"{kpis['avg_distance_km']:,.1f}")
    delay = kpis["avg_delivery_delay_days"]
    col5.metric("Avg Delivery Delay", f"{'+' if delay > 0 else ''}{delay:.1f} days")
    col6.metric("Late Delivery Rate", f"{kpis['late_delivery_rate']:.1f}%")

    st.divider()

    st.plotly_chart(figs["monthly"], use_container_width=True)

    col_a, col_b = st.columns(2)
    with col_a:
        st.plotly_chart(figs["categories"], use_container_width=True)
    with col_b:
        st.plotly_chart(figs["states"], use_container_width=True)

with tab2:
    st.markdown("**Ask the assistant about the sales data:**")

    example_questions = [
        "Which month had the most revenue?",
        "What are the 5 states with the most orders?",
        "What is the average order value per product category?",
        "What percentage of orders had prices above R$ 200?",
    ]
    with st.expander("💡 Example questions"):
        for q in example_questions:
            st.markdown(f"- {q}")

    if "messages" not in st.session_state:
        st.session_state.messages = []

    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    if prompt := st.chat_input("Type your question..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            with st.spinner("Analyzing..."):
                agent = get_agent(df, api_key)
                result = ask(agent, prompt)

            st.markdown(result["answer"])

            if result["intermediate_steps"]:
                with st.expander("🔍 View generated Pandas code"):
                    for action, observation in result["intermediate_steps"]:
                        if hasattr(action, "tool_input"):
                            st.code(action.tool_input, language="python")
                        st.markdown(f"**Result:** `{str(observation)[:200]}`")

        st.session_state.messages.append({"role": "assistant", "content": result["answer"]})
```

- [ ] **Step 2: Update `README.md`** — add ETL step before "Run the app"

Find the setup/run section and insert:

```markdown
### 3. Build the Data Mart (once)

Download the [Olist dataset from Kaggle](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)
and place all CSV files in the `data/` directory, then run:

```bash
python -m src.etl
```

This creates `data/olist_mart.db` (Star Schema SQLite, ~50 MB). Run this once — the app reads only from the DB.
```

- [ ] **Step 3: Run full test suite**

```bash
python -m pytest -v
```

Expected: all PASS

- [ ] **Step 4: Commit**

```bash
git add app.py README.md
git commit -m "feat: add DB existence guard to app and document ETL step in README"
```

---

## Self-Review

**Spec coverage:**
- ✅ ETL runs once as separate script (`src/etl.py`, `python -m src.etl`)
- ✅ App queries SQLite only (`src/loader.py` queries `fact_orders` via JOIN)
- ✅ Star Schema: `fact_orders` + `dim_customers` + `dim_sellers` + `dim_products` + `dim_date`
- ✅ WAL mode: `PRAGMA journal_mode=WAL` in `build_mart`
- ✅ `executemany` for all bulk inserts
- ✅ Strategic indexes: seller, customer, date, product
- ✅ Haversine distance in Python (not PostGIS), stored as `distance_km`
- ✅ `delivery_delay_days` = (actual_delivery - estimated_delivery).days
- ✅ No new pip dependencies

**Type consistency:**
- `build_mart(data_dir, db_path)` used consistently in `test_etl.py` and `conftest.py`
- `load_data(db_path)` used in `test_loader.py` and `app.py`
- `test_db_path` fixture name used in `test_loader.py`

**No placeholders found.**
