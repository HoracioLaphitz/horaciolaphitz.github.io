# Seller Churn Intelligence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn ai-sales-assistant into a portable, offline Seller Churn Intelligence product: ELT with SQL cleaning + data-quality gate feeding an OOP scikit-learn/XGBoost churn pipeline, surfaced through a rebuilt Streamlit app (no LLM chatbot).

**Architecture:** ELT — load 9 CSVs into `raw_*` tables, clean in versioned `.sql` (`stg_*`), enrich distance in Python (numpy Haversine), build the Star Schema in SQL, gate on SQL data-quality checks, expose analytical SQL views. A `SalesMart` repository is the only runtime SQL boundary; OOP churn classes (labeler, feature builder, model, drift, recommendations) consume DataFrames and persist portable artifacts.

**Tech Stack:** Python 3.11, stdlib `sqlite3`, pandas, numpy, scikit-learn, xgboost, ydata-profiling, joblib, Streamlit, plotly, pytest.

## Global Constraints

- Working directory for all commands: `Proyectos/ai-sales-assistant`.
- Run tests with `python -m pytest` (never bare `pytest`).
- Python stdlib `sqlite3` only — no SQLAlchemy.
- WAL mode: `PRAGMA journal_mode=WAL` on the ETL write connection.
- Bulk inserts via `cursor.executemany` — no row-by-row loops.
- Cleaning/transform logic lives in versioned `.sql` files under `sql/`; Python does CSV ingestion, Haversine, and orchestration only.
- Haversine computed in Python (numpy) — never SQL (SQLite math functions not guaranteed).
- ETL fails loud: any data-quality check returning rows raises `DataQualityError`.
- Star Schema: `fact_orders` + `dim_customers` + `dim_sellers` + `dim_products` + `dim_date`; delivered orders only.
- Cohort churn label: cutoff `T = max_order_date − 90 days`; `churned = 1` iff seller has ≥1 order on/before `T` and 0 orders in `(T, T+90d]`.
- No LLM chatbot: `src/agent.py`, `tests/test_agent.py`, and `langchain*` deps removed; app is 100% offline (no `NVAPI`).
- Portable artifacts committed: `models/model.pkl`, `models/metrics.json`, `models/feature_importance.json`, `models/drift_reference.json`.
- `reports/` gitignored; `data/*.db` already gitignored globally.
- OOP: each churn concern is one class, single responsibility, tested in isolation.

## Shared Interfaces (authoritative signatures — keep consistent across tasks)

```python
# src/errors.py
class DataQualityError(Exception): ...

# src/mart.py
class SalesMart:
    def __init__(self, db_path: str = "data/olist_mart.db") -> None
    @property
    def max_order_date(self) -> pd.Timestamp
    def orders(self) -> pd.DataFrame            # order-level (loader compat)
    def seller_orders(self) -> pd.DataFrame     # order rows + seller_id + review_score + purchase ts
    def seller_features(self) -> pd.DataFrame   # reads v_seller_features view

# src/churn/labeling.py
class ChurnLabeler:
    def __init__(self, horizon_days: int = 90) -> None
    def cutoff(self, mart: SalesMart) -> pd.Timestamp
    def label(self, mart: SalesMart) -> pd.DataFrame   # cols: seller_id, churned

# src/churn/features.py
class SellerFeatureBuilder:
    FEATURES: list[str]                                 # ordered feature column names
    def build(self, mart: SalesMart, cutoff: pd.Timestamp) -> pd.DataFrame  # index seller_id

# src/churn/model.py
class ChurnModel:
    def __init__(self, estimator: str = "xgboost") -> None   # "logreg" | "xgboost"
    def fit(self, X: pd.DataFrame, y: pd.Series) -> "ChurnModel"
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray    # P(churn), shape (n,)
    def evaluate(self, X: pd.DataFrame, y: pd.Series) -> dict
    def feature_importance(self) -> dict
    def save(self, path: str) -> None
    @classmethod
    def load(cls, path: str) -> "ChurnModel"

# src/churn/drift.py
class DriftMonitor:
    def __init__(self, reference: pd.DataFrame) -> None
    def psi(self, current: pd.DataFrame) -> dict
    def save_reference(self, path: str) -> None
    @classmethod
    def from_reference_file(cls, path: str) -> "DriftMonitor"

# src/churn/recommendations.py
class RecommendationEngine:
    def recommend(self, seller_features: pd.Series) -> list[str]

# src/churn/predict.py
class ChurnScorer:
    def __init__(self, model: ChurnModel, engine: RecommendationEngine) -> None
    def at_risk(self, mart: SalesMart, cutoff: pd.Timestamp) -> pd.DataFrame
    # cols: seller_id, churn_probability, recommendations (list[str])
```

---

## Phase 1 — Data Foundation (ELT + SQL cleaning)

### Task 1: Reviews fixture, dirty-data fixtures, scaffolding

**Files:**
- Create: `Proyectos/ai-sales-assistant/tests/fixtures/olist_order_reviews_dataset.csv`
- Create: `Proyectos/ai-sales-assistant/.gitignore`
- Create: `Proyectos/ai-sales-assistant/sql/.gitkeep`
- Create: `Proyectos/ai-sales-assistant/models/.gitkeep`

**Interfaces:**
- Produces: reviews fixture with `review_id,order_id,review_score`; scaffolding dirs.

- [ ] **Step 1: Create reviews fixture**

`tests/fixtures/olist_order_reviews_dataset.csv`:
```csv
review_id,order_id,review_score
rv1,o1,5
rv2,o1,5
rv3,o2,2
rv4,o3,4
```
(o1 has two review rows → mean 5.0 tests the dedup-to-mean cleaning.)

- [ ] **Step 2: Create project `.gitignore`**

`.gitignore`:
```
reports/
*.db-wal
*.db-shm
__pycache__/
.pytest_cache/
```

- [ ] **Step 3: Create scaffolding placeholders**

`sql/.gitkeep` and `models/.gitkeep`: empty files.

- [ ] **Step 4: Commit**

```bash
git add tests/fixtures/olist_order_reviews_dataset.csv .gitignore sql/.gitkeep models/.gitkeep
git commit -m "chore: add reviews fixture and project scaffolding for churn pivot"
```

---

### Task 2: SQL cleaning layer + raw ingestion (ELT restructure)

**Files:**
- Create: `Proyectos/ai-sales-assistant/sql/clean.sql`
- Create: `Proyectos/ai-sales-assistant/src/errors.py`
- Modify: `Proyectos/ai-sales-assistant/src/etl.py` (restructure to raw→stg)
- Test: `Proyectos/ai-sales-assistant/tests/test_etl_clean.py`

**Interfaces:**
- Produces: `build_mart(data_dir, db_path)` ingests 9 CSVs into `raw_*` and runs `sql/clean.sql` producing `stg_*`. `DataQualityError` defined.
- `stg_geolocation(zip, lat, lng)`; `stg_customers(customer_id, customer_state, customer_city, lat, lng)`; `stg_sellers(seller_id, seller_state, seller_city, lat, lng)`; `stg_products(product_id, product_category_name_english, weight_g, volume_cm3)`; `stg_orders(order_id, customer_id, order_status, order_purchase_timestamp, delivery_delay_days)`; `stg_order_items(order_id, seller_id, product_id, price, freight_value)`; `stg_payments(order_id, payment_value)`; `stg_reviews(order_id, review_score)`.

- [ ] **Step 1: Write failing test** — `tests/test_etl_clean.py`

```python
import os
import sqlite3
import pytest

FIXTURES = os.path.join(os.path.dirname(__file__), "fixtures")


@pytest.fixture
def tmp_db(tmp_path):
    return str(tmp_path / "mart.db")


def _tables(db):
    conn = sqlite3.connect(db)
    t = {r[0] for r in conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table'").fetchall()}
    conn.close()
    return t


def test_raw_tables_loaded(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    t = _tables(tmp_db)
    for name in ("raw_orders", "raw_reviews", "raw_geolocation"):
        assert name in t


def test_stg_geolocation_dedup_to_centroid(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    rows = conn.execute("SELECT COUNT(*) FROM stg_geolocation").fetchone()[0]
    distinct_zip = conn.execute(
        "SELECT COUNT(DISTINCT zip) FROM stg_geolocation").fetchone()[0]
    conn.close()
    assert rows == distinct_zip  # one centroid per ZIP


def test_stg_reviews_mean_per_order(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    score = conn.execute(
        "SELECT review_score FROM stg_reviews WHERE order_id='o1'").fetchone()[0]
    conn.close()
    assert score == pytest.approx(5.0)  # mean of rv1,rv2


def test_stg_orders_delivery_delay_in_sql(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    rows = {r[0]: r[1] for r in conn.execute(
        "SELECT order_id, delivery_delay_days FROM stg_orders ORDER BY order_id").fetchall()}
    conn.close()
    assert rows["o1"] == pytest.approx(-5.0)
    assert rows["o2"] == pytest.approx(5.0)


def test_data_quality_error_exists():
    from src.errors import DataQualityError
    assert issubclass(DataQualityError, Exception)
```

- [ ] **Step 2: Run to verify FAIL**

Run: `python -m pytest tests/test_etl_clean.py -v`
Expected: FAIL — `stg_*` tables/`src.errors` missing.

- [ ] **Step 3: Create `src/errors.py`**

```python
class DataQualityError(Exception):
    """Raised when the ELT data-quality gate finds violating rows."""
```

- [ ] **Step 4: Create `sql/clean.sql`**

```sql
-- Cleaning layer: raw_* -> stg_*. Idempotent. Assumptions in headers.

-- Geolocation: one centroid (mean lat/lng) per ZIP prefix.
DROP TABLE IF EXISTS stg_geolocation;
CREATE TABLE stg_geolocation AS
SELECT geolocation_zip_code_prefix AS zip,
       AVG(geolocation_lat) AS lat,
       AVG(geolocation_lng) AS lng
FROM raw_geolocation
GROUP BY geolocation_zip_code_prefix;

-- Customers: normalize city, attach centroid.
DROP TABLE IF EXISTS stg_customers;
CREATE TABLE stg_customers AS
SELECT c.customer_id,
       c.customer_state,
       LOWER(TRIM(c.customer_city)) AS customer_city,
       g.lat, g.lng
FROM raw_customers c
LEFT JOIN stg_geolocation g ON c.customer_zip_code_prefix = g.zip
WHERE c.customer_id IS NOT NULL;

-- Sellers: normalize city, attach centroid.
DROP TABLE IF EXISTS stg_sellers;
CREATE TABLE stg_sellers AS
SELECT s.seller_id,
       s.seller_state,
       LOWER(TRIM(s.seller_city)) AS seller_city,
       g.lat, g.lng
FROM raw_sellers s
LEFT JOIN stg_geolocation g ON s.seller_zip_code_prefix = g.zip
WHERE s.seller_id IS NOT NULL;

-- Products: English category, weight, volume.
DROP TABLE IF EXISTS stg_products;
CREATE TABLE stg_products AS
SELECT p.product_id,
       t.product_category_name_english,
       p.product_weight_g AS weight_g,
       (p.product_length_cm * p.product_height_cm * p.product_width_cm) AS volume_cm3
FROM raw_products p
LEFT JOIN raw_category_translation t
       ON p.product_category_name = t.product_category_name
WHERE p.product_id IS NOT NULL;

-- Orders: cast, delivery delay in SQL, delivered only, valid dates.
DROP TABLE IF EXISTS stg_orders;
CREATE TABLE stg_orders AS
SELECT order_id,
       customer_id,
       order_status,
       order_purchase_timestamp,
       (julianday(order_delivered_customer_date)
        - julianday(order_estimated_delivery_date)) AS delivery_delay_days
FROM raw_orders
WHERE order_status = 'delivered'
  AND order_id IS NOT NULL
  AND order_purchase_timestamp IS NOT NULL;

-- Order items: first seller/product per order, summed price/freight; drop negatives.
DROP TABLE IF EXISTS stg_order_items;
CREATE TABLE stg_order_items AS
SELECT order_id,
       MIN(seller_id)  AS seller_id,
       MIN(product_id) AS product_id,
       SUM(price)         AS price,
       SUM(freight_value) AS freight_value
FROM raw_order_items
WHERE price >= 0
GROUP BY order_id;

-- Payments: total per order.
DROP TABLE IF EXISTS stg_payments;
CREATE TABLE stg_payments AS
SELECT order_id, SUM(payment_value) AS payment_value
FROM raw_payments
GROUP BY order_id;

-- Reviews: mean score per order, clamped to 1..5.
DROP TABLE IF EXISTS stg_reviews;
CREATE TABLE stg_reviews AS
SELECT order_id, AVG(review_score) AS review_score
FROM raw_reviews
WHERE review_score BETWEEN 1 AND 5
GROUP BY order_id;
```

- [ ] **Step 5: Restructure `src/etl.py`** (raw ingestion + run clean.sql; keep `_haversine`)

Replace the file with:
```python
import os
import sqlite3
import numpy as np
import pandas as pd

SQL_DIR = os.path.join(os.path.dirname(__file__), "..", "sql")

_CSV_TO_RAW = {
    "olist_orders_dataset.csv": "raw_orders",
    "olist_order_items_dataset.csv": "raw_order_items",
    "olist_products_dataset.csv": "raw_products",
    "product_category_name_translation.csv": "raw_category_translation",
    "olist_order_payments_dataset.csv": "raw_payments",
    "olist_customers_dataset.csv": "raw_customers",
    "olist_sellers_dataset.csv": "raw_sellers",
    "olist_geolocation_dataset.csv": "raw_geolocation",
    "olist_order_reviews_dataset.csv": "raw_reviews",
}


def _haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    a = np.sin(dlat / 2) ** 2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2) ** 2
    return 2 * R * np.arcsin(np.sqrt(a))


def _run_sql(conn: sqlite3.Connection, filename: str) -> None:
    with open(os.path.join(SQL_DIR, filename), "r", encoding="utf-8") as f:
        conn.executescript(f.read())


def _ingest_raw(conn: sqlite3.Connection, data_dir: str) -> None:
    for csv_name, table in _CSV_TO_RAW.items():
        df = pd.read_csv(os.path.join(data_dir, csv_name))
        df.to_sql(table, conn, if_exists="replace", index=False)


def build_mart(data_dir: str = "data", db_path: str = "data/olist_mart.db") -> None:
    parent = os.path.dirname(db_path)
    if parent:
        os.makedirs(parent, exist_ok=True)

    conn = sqlite3.connect(db_path)
    try:
        conn.execute("PRAGMA journal_mode=WAL")
        _ingest_raw(conn, data_dir)
        _run_sql(conn, "clean.sql")
        conn.commit()
    finally:
        conn.close()


if __name__ == "__main__":
    build_mart()
    print("Data mart built: data/olist_mart.db")
```

(Note: this task leaves the mart without the Star Schema — Tasks 3-5 add distance enrichment, `mart.sql`, quality, views. The old `test_etl.py` will fail until Task 5; that is expected and handled in Task 5.)

- [ ] **Step 6: Run clean tests to verify PASS**

Run: `python -m pytest tests/test_etl_clean.py -v`
Expected: 5 PASS.

- [ ] **Step 7: Commit**

```bash
git add sql/clean.sql src/errors.py src/etl.py tests/test_etl_clean.py
git commit -m "feat: ELT restructure — raw ingestion + SQL cleaning layer"
```

---

### Task 3: Haversine enrichment + SQL mart layer

**Files:**
- Create: `Proyectos/ai-sales-assistant/sql/mart.sql`
- Modify: `Proyectos/ai-sales-assistant/src/etl.py` (add distance enrichment + run mart.sql)
- Test: `Proyectos/ai-sales-assistant/tests/test_etl_mart.py`

**Interfaces:**
- Consumes: `stg_*` from Task 2.
- Produces: `stg_order_distance(order_id, distance_km)`; Star Schema `fact_orders(order_id, customer_id, seller_id, product_id, date_id, price, freight_value, payment_value, distance_km, delivery_delay_days, review_score, order_status, order_purchase_timestamp)`, `dim_customers`, `dim_sellers`, `dim_products`, `dim_date`; indexes.

- [ ] **Step 1: Write failing test** — `tests/test_etl_mart.py`

```python
import os
import sqlite3
import pytest

FIXTURES = os.path.join(os.path.dirname(__file__), "fixtures")


@pytest.fixture
def tmp_db(tmp_path):
    return str(tmp_path / "mart.db")


def test_star_schema_tables(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    t = {r[0] for r in conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table'").fetchall()}
    conn.close()
    assert {"fact_orders", "dim_customers", "dim_sellers",
            "dim_products", "dim_date"}.issubset(t)


def test_fact_excludes_canceled(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    n = conn.execute("SELECT COUNT(*) FROM fact_orders").fetchone()[0]
    conn.close()
    assert n == 2  # o1, o2


def test_fact_has_review_score(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    rows = {r[0]: r[1] for r in conn.execute(
        "SELECT order_id, review_score FROM fact_orders ORDER BY order_id").fetchall()}
    conn.close()
    assert rows["o1"] == pytest.approx(5.0)
    assert rows["o2"] == pytest.approx(2.0)


def test_fact_distance_positive_and_ordered(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    rows = {r[0]: r[1] for r in conn.execute(
        "SELECT order_id, distance_km FROM fact_orders ORDER BY order_id").fetchall()}
    conn.close()
    assert rows["o1"] > 0 and rows["o2"] > 0
    assert rows["o1"] < rows["o2"]  # SP-SP < RJ-SP


def test_indexes_exist(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    idx = {r[0] for r in conn.execute(
        "SELECT name FROM sqlite_master WHERE type='index'").fetchall()}
    conn.close()
    for name in ("idx_fact_seller", "idx_fact_customer",
                 "idx_fact_date", "idx_fact_product"):
        assert name in idx
```

- [ ] **Step 2: Run to verify FAIL**

Run: `python -m pytest tests/test_etl_mart.py -v`
Expected: FAIL — no `fact_orders`.

- [ ] **Step 3: Create `sql/mart.sql`**

```sql
-- Mart layer: build Star Schema from stg_* (+ stg_order_distance from Python).

DROP TABLE IF EXISTS dim_customers;
CREATE TABLE dim_customers AS
SELECT customer_id, customer_state, customer_city, lat, lng FROM stg_customers;

DROP TABLE IF EXISTS dim_sellers;
CREATE TABLE dim_sellers AS
SELECT seller_id, seller_state, seller_city, lat, lng FROM stg_sellers;

DROP TABLE IF EXISTS dim_products;
CREATE TABLE dim_products AS
SELECT product_id, product_category_name_english, weight_g, volume_cm3
FROM stg_products;

DROP TABLE IF EXISTS dim_date;
CREATE TABLE dim_date AS
SELECT DISTINCT
    date(order_purchase_timestamp) AS date_id,
    CAST(strftime('%Y', order_purchase_timestamp) AS INTEGER) AS year,
    CAST(strftime('%m', order_purchase_timestamp) AS INTEGER) AS month,
    ((CAST(strftime('%m', order_purchase_timestamp) AS INTEGER) - 1) / 3 + 1) AS quarter,
    CAST(strftime('%w', order_purchase_timestamp) AS INTEGER) AS day_of_week
FROM stg_orders;

DROP TABLE IF EXISTS fact_orders;
CREATE TABLE fact_orders AS
SELECT
    o.order_id,
    o.customer_id,
    i.seller_id,
    i.product_id,
    date(o.order_purchase_timestamp) AS date_id,
    i.price,
    i.freight_value,
    p.payment_value,
    d.distance_km,
    o.delivery_delay_days,
    r.review_score,
    o.order_status,
    o.order_purchase_timestamp
FROM stg_orders o
LEFT JOIN stg_order_items    i ON o.order_id = i.order_id
LEFT JOIN stg_payments       p ON o.order_id = p.order_id
LEFT JOIN stg_order_distance d ON o.order_id = d.order_id
LEFT JOIN stg_reviews        r ON o.order_id = r.order_id;

CREATE INDEX idx_fact_seller   ON fact_orders(seller_id);
CREATE INDEX idx_fact_customer ON fact_orders(customer_id);
CREATE INDEX idx_fact_date     ON fact_orders(date_id);
CREATE INDEX idx_fact_product  ON fact_orders(product_id);
```

- [ ] **Step 4: Add distance enrichment + mart run to `src/etl.py`**

Add this function and extend `build_mart` (insert the enrichment call between `_run_sql(conn, "clean.sql")` and `conn.commit()`):

```python
def _enrich_distance(conn: sqlite3.Connection) -> None:
    orders = pd.read_sql_query(
        "SELECT order_id, customer_id FROM stg_orders", conn)
    items = pd.read_sql_query(
        "SELECT order_id, seller_id FROM stg_order_items", conn)
    cust = pd.read_sql_query(
        "SELECT customer_id, lat AS c_lat, lng AS c_lng FROM stg_customers", conn)
    sell = pd.read_sql_query(
        "SELECT seller_id, lat AS s_lat, lng AS s_lng FROM stg_sellers", conn)

    df = (orders.merge(items, on="order_id", how="left")
                .merge(cust, on="customer_id", how="left")
                .merge(sell, on="seller_id", how="left"))
    df["distance_km"] = _haversine(
        df["c_lat"].values, df["c_lng"].values,
        df["s_lat"].values, df["s_lng"].values)
    df[["order_id", "distance_km"]].to_sql(
        "stg_order_distance", conn, if_exists="replace", index=False)
```

Updated `build_mart` body (the `try` block):
```python
        conn.execute("PRAGMA journal_mode=WAL")
        _ingest_raw(conn, data_dir)
        _run_sql(conn, "clean.sql")
        _enrich_distance(conn)
        _run_sql(conn, "mart.sql")
        conn.commit()
```

- [ ] **Step 5: Run mart tests to verify PASS**

Run: `python -m pytest tests/test_etl_mart.py -v`
Expected: 5 PASS.

- [ ] **Step 6: Commit**

```bash
git add sql/mart.sql src/etl.py tests/test_etl_mart.py
git commit -m "feat: Python Haversine enrichment + SQL Star Schema mart layer"
```

---

### Task 4: Data-quality gate

**Files:**
- Create: `Proyectos/ai-sales-assistant/sql/quality.sql`
- Modify: `Proyectos/ai-sales-assistant/src/etl.py` (run quality checks, raise on violation)
- Test: `Proyectos/ai-sales-assistant/tests/test_etl_quality.py`

**Interfaces:**
- Consumes: Star Schema from Task 3.
- Produces: `build_mart` raises `DataQualityError(check_name)` if any check returns rows; `sql/quality.sql` is a set of `-- CHECK: <name>` labelled `SELECT`s each returning offending rows.

- [ ] **Step 1: Write failing test** — `tests/test_etl_quality.py`

```python
import os
import shutil
import sqlite3
import pytest

FIXTURES = os.path.join(os.path.dirname(__file__), "fixtures")


@pytest.fixture
def tmp_db(tmp_path):
    return str(tmp_path / "mart.db")


def test_clean_fixture_passes_quality(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)  # must not raise
    assert os.path.exists(tmp_db)


def test_duplicate_seller_pk_raises(tmp_path):
    from src.etl import build_mart
    from src.errors import DataQualityError
    dirty = tmp_path / "dirty"
    shutil.copytree(FIXTURES, dirty)
    # inject a duplicate seller_id row
    sellers = dirty / "olist_sellers_dataset.csv"
    with open(sellers, "a", encoding="utf-8") as f:
        f.write("s1,99999,duplicate city,SP\n")
    with pytest.raises(DataQualityError) as exc:
        build_mart(data_dir=str(dirty), db_path=str(tmp_path / "d.db"))
    assert "seller" in str(exc.value).lower()
```

- [ ] **Step 2: Run to verify FAIL**

Run: `python -m pytest tests/test_etl_quality.py -v`
Expected: FAIL — no quality gate; duplicate does not raise.

- [ ] **Step 3: Create `sql/quality.sql`**

```sql
-- Data-quality gate. Each labelled SELECT must return ZERO rows.

-- CHECK: dim_sellers_no_null_pk
SELECT seller_id FROM dim_sellers WHERE seller_id IS NULL;

-- CHECK: dim_customers_no_null_pk
SELECT customer_id FROM dim_customers WHERE customer_id IS NULL;

-- CHECK: dim_sellers_unique_pk
SELECT seller_id FROM dim_sellers GROUP BY seller_id HAVING COUNT(*) > 1;

-- CHECK: dim_customers_unique_pk
SELECT customer_id FROM dim_customers GROUP BY customer_id HAVING COUNT(*) > 1;

-- CHECK: dim_products_unique_pk
SELECT product_id FROM dim_products GROUP BY product_id HAVING COUNT(*) > 1;

-- CHECK: fact_seller_referential_integrity
SELECT f.order_id FROM fact_orders f
LEFT JOIN dim_sellers s ON f.seller_id = s.seller_id
WHERE f.seller_id IS NOT NULL AND s.seller_id IS NULL;

-- CHECK: fact_customer_referential_integrity
SELECT f.order_id FROM fact_orders f
LEFT JOIN dim_customers c ON f.customer_id = c.customer_id
WHERE c.customer_id IS NULL;

-- CHECK: fact_price_non_negative
SELECT order_id FROM fact_orders WHERE price < 0;

-- CHECK: fact_review_score_in_range
SELECT order_id FROM fact_orders
WHERE review_score IS NOT NULL AND (review_score < 1 OR review_score > 5);

-- CHECK: fact_distance_non_negative
SELECT order_id FROM fact_orders WHERE distance_km < 0;

-- CHECK: fact_non_empty
SELECT 1 WHERE (SELECT COUNT(*) FROM fact_orders) = 0;
```

- [ ] **Step 4: Add quality runner to `src/etl.py`**

Add import at top: `from src.errors import DataQualityError`. Add function and call it after `_run_sql(conn, "mart.sql")`, before `conn.commit()`:

```python
def _run_quality_checks(conn: sqlite3.Connection) -> None:
    path = os.path.join(SQL_DIR, "quality.sql")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    checks = []
    name = None
    buf = []
    for line in content.splitlines():
        stripped = line.strip()
        if stripped.startswith("-- CHECK:"):
            if name and buf:
                checks.append((name, "\n".join(buf)))
            name = stripped.replace("-- CHECK:", "").strip()
            buf = []
        elif stripped and not stripped.startswith("--"):
            buf.append(line)
            if stripped.endswith(";"):
                checks.append((name, "\n".join(buf)))
                name, buf = None, []
    for check_name, sql in checks:
        rows = conn.execute(sql).fetchall()
        if rows:
            raise DataQualityError(
                f"Data-quality check failed: {check_name} ({len(rows)} rows)")
```

Insert `_run_quality_checks(conn)` between `_run_sql(conn, "mart.sql")` and `conn.commit()`.

- [ ] **Step 5: Run quality tests to verify PASS**

Run: `python -m pytest tests/test_etl_quality.py -v`
Expected: 2 PASS.

- [ ] **Step 6: Commit**

```bash
git add sql/quality.sql src/etl.py tests/test_etl_quality.py
git commit -m "feat: SQL data-quality gate raising DataQualityError on violation"
```

---

### Task 5: SQL views, data dictionary, retire old test_etl.py

**Files:**
- Create: `Proyectos/ai-sales-assistant/sql/views.sql`
- Create: `Proyectos/ai-sales-assistant/docs/data-dictionary.md`
- Modify: `Proyectos/ai-sales-assistant/src/etl.py` (run views.sql)
- Delete: `Proyectos/ai-sales-assistant/tests/test_etl.py` (superseded by test_etl_clean/mart/quality)
- Test: `Proyectos/ai-sales-assistant/tests/test_etl_views.py`

**Interfaces:**
- Produces: view `v_seller_features` with columns `seller_id, recency_days, frequency, monetary_total, monetary_aov, tenure_days, avg_delivery_delay_days, pct_late, avg_distance_km, avg_review_score, pct_low_review, category_diversity, last_order_ts`; views `v_monthly_revenue(month, revenue)`, `v_state_revenue(customer_state, revenue)`.
- Note: `v_seller_features` aggregates over ALL fact rows; time-cutoff filtering is applied by `SellerFeatureBuilder` (Task 9) via `last_order_ts`. `recency_days`/`tenure_days` are expressed relative to the mart max date.

- [ ] **Step 1: Write failing test** — `tests/test_etl_views.py`

```python
import os
import sqlite3
import pytest

FIXTURES = os.path.join(os.path.dirname(__file__), "fixtures")


@pytest.fixture
def tmp_db(tmp_path):
    return str(tmp_path / "mart.db")


def test_views_exist(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    v = {r[0] for r in conn.execute(
        "SELECT name FROM sqlite_master WHERE type='view'").fetchall()}
    conn.close()
    assert {"v_seller_features", "v_monthly_revenue", "v_state_revenue"}.issubset(v)


def test_seller_features_columns(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    cols = {r[1] for r in conn.execute("PRAGMA table_info(v_seller_features)").fetchall()}
    conn.close()
    for c in ("seller_id", "frequency", "avg_review_score", "pct_late",
              "avg_distance_km", "category_diversity", "last_order_ts"):
        assert c in cols


def test_seller_features_frequency(tmp_db):
    # s1 sold o1+o2 (both delivered) -> frequency 2
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    freq = conn.execute(
        "SELECT frequency FROM v_seller_features WHERE seller_id='s1'").fetchone()[0]
    conn.close()
    assert freq == 2
```

- [ ] **Step 2: Run to verify FAIL**

Run: `python -m pytest tests/test_etl_views.py -v`
Expected: FAIL — views missing.

- [ ] **Step 3: Create `sql/views.sql`**

```sql
-- Analytical views. Auditable in DB Browser.

DROP VIEW IF EXISTS v_monthly_revenue;
CREATE VIEW v_monthly_revenue AS
SELECT strftime('%Y-%m', order_purchase_timestamp) AS month,
       SUM(payment_value) AS revenue
FROM fact_orders
GROUP BY month
ORDER BY month;

DROP VIEW IF EXISTS v_state_revenue;
CREATE VIEW v_state_revenue AS
SELECT c.customer_state, SUM(f.payment_value) AS revenue
FROM fact_orders f
JOIN dim_customers c ON f.customer_id = c.customer_id
GROUP BY c.customer_state;

DROP VIEW IF EXISTS v_seller_features;
CREATE VIEW v_seller_features AS
WITH maxd AS (SELECT MAX(order_purchase_timestamp) AS m FROM fact_orders)
SELECT
    f.seller_id,
    julianday((SELECT m FROM maxd)) - julianday(MAX(f.order_purchase_timestamp))
        AS recency_days,
    COUNT(*) AS frequency,
    SUM(f.payment_value) AS monetary_total,
    AVG(f.payment_value) AS monetary_aov,
    julianday(MAX(f.order_purchase_timestamp))
        - julianday(MIN(f.order_purchase_timestamp)) AS tenure_days,
    AVG(f.delivery_delay_days) AS avg_delivery_delay_days,
    AVG(CASE WHEN f.delivery_delay_days > 0 THEN 1.0 ELSE 0.0 END) AS pct_late,
    AVG(f.distance_km) AS avg_distance_km,
    AVG(f.review_score) AS avg_review_score,
    AVG(CASE WHEN f.review_score <= 2 THEN 1.0 ELSE 0.0 END) AS pct_low_review,
    COUNT(DISTINCT p.product_category_name_english) AS category_diversity,
    MAX(f.order_purchase_timestamp) AS last_order_ts
FROM fact_orders f
LEFT JOIN dim_products p ON f.product_id = p.product_id
GROUP BY f.seller_id;
```

- [ ] **Step 4: Run views.sql in `src/etl.py`**

Insert `_run_sql(conn, "views.sql")` after `_run_quality_checks(conn)` and before `conn.commit()`.

- [ ] **Step 5: Create `docs/data-dictionary.md`**

```markdown
# Data Dictionary — olist_mart.db

## fact_orders (grain: one delivered order)
| column | type | source | cleaning | nullable |
|--------|------|--------|----------|----------|
| order_id | TEXT | raw_orders | delivered only | no |
| customer_id | TEXT | raw_orders | — | no |
| seller_id | TEXT | raw_order_items | first per order | yes |
| product_id | TEXT | raw_order_items | first per order | yes |
| date_id | TEXT | derived | date(purchase ts) | no |
| price | REAL | raw_order_items | sum, ≥0 | yes |
| freight_value | REAL | raw_order_items | sum | yes |
| payment_value | REAL | raw_payments | sum per order | yes |
| distance_km | REAL | Python Haversine | seller↔customer centroid | yes |
| delivery_delay_days | REAL | SQL julianday diff | delivered − estimated | yes |
| review_score | REAL | raw_reviews | mean per order, 1–5 | yes |
| order_status | TEXT | raw_orders | = 'delivered' | no |
| order_purchase_timestamp | TEXT | raw_orders | — | no |

## dim_sellers / dim_customers
| column | type | cleaning |
|--------|------|----------|
| *_id | TEXT | PK, not null, unique |
| *_state | TEXT | — |
| *_city | TEXT | LOWER(TRIM()) |
| lat, lng | REAL | ZIP centroid (mean) |

## dim_products
| column | type | cleaning |
|--------|------|----------|
| product_id | TEXT | PK |
| product_category_name_english | TEXT | translated |
| weight_g | REAL | — |
| volume_cm3 | REAL | length×height×width |

## dim_date
year, month, quarter, day_of_week derived from purchase timestamp.

## Views
- **v_seller_features** — seller × churn feature aggregates.
- **v_monthly_revenue**, **v_state_revenue** — analytics.
```

- [ ] **Step 6: Delete superseded `tests/test_etl.py`**

```bash
git rm tests/test_etl.py
```

- [ ] **Step 7: Run views tests + full suite**

Run: `python -m pytest tests/test_etl_views.py -v`
Expected: 3 PASS.
Run: `python -m pytest -v`
Expected: all PASS (test_loader/test_analysis still green — loader still works via old fact schema until Task 6; if any loader test references removed columns it will be updated in Task 6).

- [ ] **Step 8: Commit**

```bash
git add sql/views.sql docs/data-dictionary.md src/etl.py
git rm --cached tests/test_etl.py 2>/dev/null; true
git commit -m "feat: SQL analytical views + data dictionary; retire monolithic test_etl"
```

---

### Task 6: SalesMart repository + loader wrapper

**Files:**
- Create: `Proyectos/ai-sales-assistant/src/mart.py`
- Modify: `Proyectos/ai-sales-assistant/src/loader.py` (delegate to SalesMart)
- Test: `Proyectos/ai-sales-assistant/tests/test_mart.py`

**Interfaces:**
- Consumes: mart DB from Tasks 3-5; `test_db_path` fixture (conftest).
- Produces: `SalesMart` per Shared Interfaces. `loader.load_data(db_path)` returns the same columns as before plus `review_score` (order-level).

- [ ] **Step 1: Write failing test** — `tests/test_mart.py`

```python
import pandas as pd
import pytest
from src.mart import SalesMart


def test_orders_columns(test_db_path):
    df = SalesMart(test_db_path).orders()
    required = {"order_id", "order_purchase_timestamp", "order_status",
                "price", "freight_value", "payment_value",
                "product_category_name_english", "customer_state",
                "distance_km", "delivery_delay_days", "review_score"}
    assert required.issubset(df.columns)


def test_max_order_date_is_timestamp(test_db_path):
    d = SalesMart(test_db_path).max_order_date
    assert isinstance(d, pd.Timestamp)


def test_seller_orders_has_seller_and_ts(test_db_path):
    df = SalesMart(test_db_path).seller_orders()
    assert {"seller_id", "order_purchase_timestamp", "review_score"}.issubset(df.columns)


def test_seller_features_indexed(test_db_path):
    df = SalesMart(test_db_path).seller_features()
    assert "seller_id" in df.columns
    assert "frequency" in df.columns
```

- [ ] **Step 2: Run to verify FAIL**

Run: `python -m pytest tests/test_mart.py -v`
Expected: FAIL — `src.mart` missing.

- [ ] **Step 3: Create `src/mart.py`**

```python
import sqlite3
import pandas as pd


class SalesMart:
    """Repository — the only runtime SQL boundary. Returns DataFrames."""

    def __init__(self, db_path: str = "data/olist_mart.db") -> None:
        self._db_path = db_path

    def _read(self, sql: str, parse_dates=None) -> pd.DataFrame:
        conn = sqlite3.connect(self._db_path)
        try:
            return pd.read_sql_query(sql, conn, parse_dates=parse_dates)
        finally:
            conn.close()

    @property
    def max_order_date(self) -> pd.Timestamp:
        df = self._read(
            "SELECT MAX(order_purchase_timestamp) AS m FROM fact_orders")
        return pd.Timestamp(df["m"].iloc[0])

    def orders(self) -> pd.DataFrame:
        return self._read(
            """
            SELECT f.order_id, f.order_purchase_timestamp, f.order_status,
                   f.price, f.freight_value, f.payment_value,
                   f.distance_km, f.delivery_delay_days, f.review_score,
                   p.product_category_name_english, c.customer_state
            FROM fact_orders f
            JOIN dim_products  p ON f.product_id  = p.product_id
            JOIN dim_customers c ON f.customer_id = c.customer_id
            """,
            parse_dates=["order_purchase_timestamp"],
        )

    def seller_orders(self) -> pd.DataFrame:
        return self._read(
            """
            SELECT order_id, seller_id, order_purchase_timestamp,
                   payment_value, price, freight_value,
                   distance_km, delivery_delay_days, review_score
            FROM fact_orders
            WHERE seller_id IS NOT NULL
            """,
            parse_dates=["order_purchase_timestamp"],
        )

    def seller_features(self) -> pd.DataFrame:
        return self._read(
            "SELECT * FROM v_seller_features",
            parse_dates=["last_order_ts"],
        )
```

- [ ] **Step 4: Update `src/loader.py` to delegate**

```python
import pandas as pd
from src.mart import SalesMart


def load_data(db_path: str = "data/olist_mart.db") -> pd.DataFrame:
    return SalesMart(db_path).orders()
```

- [ ] **Step 5: Run mart + loader + full suite**

Run: `python -m pytest tests/test_mart.py tests/test_loader.py -v`
Expected: PASS. `test_loader` still green (orders() is a superset — required columns still present).
Run: `python -m pytest -v`
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add src/mart.py src/loader.py tests/test_mart.py
git commit -m "feat: SalesMart repository; loader delegates to it"
```

---

### Task 7: EDA profiling

**Files:**
- Create: `Proyectos/ai-sales-assistant/src/eda.py`
- Modify: `Proyectos/ai-sales-assistant/requirements.txt` (add ydata-profiling)
- Test: `Proyectos/ai-sales-assistant/tests/test_eda.py`

**Interfaces:**
- Produces: `profile_mart(db_path: str, output_path: str) -> str` — writes an HTML report of `v_seller_features`, returns the output path.

- [ ] **Step 1: Add dependency** — append to `requirements.txt`: `ydata-profiling>=4.6.0`

- [ ] **Step 2: Write failing test** — `tests/test_eda.py`

```python
import os
import pytest


def test_profile_mart_writes_html(test_db_path, tmp_path):
    ydp = pytest.importorskip("ydata_profiling")  # skip if heavy dep absent
    from src.eda import profile_mart
    out = str(tmp_path / "eda.html")
    result = profile_mart(test_db_path, out)
    assert result == out
    assert os.path.exists(out)
    assert os.path.getsize(out) > 0
```

- [ ] **Step 3: Run to verify FAIL/skip**

Run: `python -m pytest tests/test_eda.py -v`
Expected: FAIL (`src.eda` missing) or SKIP if ydata-profiling not installed. Install it: `pip install ydata-profiling`.

- [ ] **Step 4: Create `src/eda.py`**

```python
import os
from src.mart import SalesMart


def profile_mart(db_path: str = "data/olist_mart.db",
                 output_path: str = "reports/eda.html") -> str:
    from ydata_profiling import ProfileReport

    df = SalesMart(db_path).seller_features()
    parent = os.path.dirname(output_path)
    if parent:
        os.makedirs(parent, exist_ok=True)
    report = ProfileReport(df, title="Olist Seller Features EDA", minimal=True)
    report.to_file(output_path)
    return output_path


if __name__ == "__main__":
    path = profile_mart()
    print(f"EDA report: {path}")
```

- [ ] **Step 5: Run EDA test to verify PASS**

Run: `python -m pytest tests/test_eda.py -v`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/eda.py requirements.txt tests/test_eda.py
git commit -m "feat: ydata-profiling EDA report of seller features"
```

---

## Phase 2 — Churn Pipeline (OOP)

### Task 8: ChurnLabeler (cohort labeling)

**Files:**
- Create: `Proyectos/ai-sales-assistant/src/churn/__init__.py`
- Create: `Proyectos/ai-sales-assistant/src/churn/labeling.py`
- Modify: `Proyectos/ai-sales-assistant/tests/conftest.py` (add `churn_mart` fixture)
- Test: `Proyectos/ai-sales-assistant/tests/test_churn_labeling.py`

**Interfaces:**
- Consumes: `SalesMart.seller_orders()`, `SalesMart.max_order_date`.
- Produces: `ChurnLabeler` per Shared Interfaces; conftest `churn_mart` fixture → `SalesMart` over a purpose-built DB with controlled seller timelines.

- [ ] **Step 1: Add `churn_mart` fixture to `tests/conftest.py`** (append)

```python
@pytest.fixture
def churn_mart(tmp_path):
    """SalesMart over a hand-built mart with controlled seller timelines.

    max_order_date = 2018-08-01. cutoff (horizon 90) = 2018-05-03.
      sA: orders before and after cutoff  -> churned 0
      sB: orders only before cutoff       -> churned 1
      sC: orders only after cutoff        -> excluded (not eligible)
    """
    import sqlite3
    from src.mart import SalesMart
    db = str(tmp_path / "churn.db")
    conn = sqlite3.connect(db)
    conn.executescript(
        """
        CREATE TABLE fact_orders (
            order_id TEXT, customer_id TEXT, seller_id TEXT, product_id TEXT,
            date_id TEXT, price REAL, freight_value REAL, payment_value REAL,
            distance_km REAL, delivery_delay_days REAL, review_score REAL,
            order_status TEXT, order_purchase_timestamp TEXT);
        """
    )
    rows = [
        # sA before + after cutoff
        ("a1", "c1", "sA", "p1", "2018-02-01", 100, 10, 110, 50, -2, 5, "delivered", "2018-02-01 10:00:00"),
        ("a2", "c2", "sA", "p1", "2018-07-01", 120, 12, 132, 60,  3, 4, "delivered", "2018-07-01 10:00:00"),
        # sB only before cutoff -> churned
        ("b1", "c3", "sB", "p2", "2018-01-10", 200, 20, 220, 80,  5, 2, "delivered", "2018-01-10 10:00:00"),
        ("b2", "c4", "sB", "p2", "2018-03-15", 150, 15, 165, 90,  1, 3, "delivered", "2018-03-15 10:00:00"),
        # sC only after cutoff -> excluded
        ("d1", "c5", "sC", "p1", "2018-07-20", 300, 30, 330, 40, -1, 5, "delivered", "2018-07-20 10:00:00"),
        # anchor max date
        ("z1", "c6", "sA", "p1", "2018-08-01", 100, 10, 110, 50,  0, 5, "delivered", "2018-08-01 10:00:00"),
    ]
    conn.executemany(
        "INSERT INTO fact_orders VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", rows)
    conn.commit()
    conn.close()
    return SalesMart(db)
```

- [ ] **Step 2: Write failing test** — `tests/test_churn_labeling.py`

```python
import pandas as pd
from src.churn.labeling import ChurnLabeler


def test_cutoff_is_max_minus_horizon(churn_mart):
    cutoff = ChurnLabeler(horizon_days=90).cutoff(churn_mart)
    assert cutoff == pd.Timestamp("2018-08-01 00:00:00") - pd.Timedelta(days=90)


def test_labels(churn_mart):
    labels = ChurnLabeler(horizon_days=90).label(churn_mart)
    m = dict(zip(labels["seller_id"], labels["churned"]))
    assert m["sA"] == 0            # active after cutoff
    assert m["sB"] == 1            # silent after cutoff
    assert "sC" not in m           # not eligible (no orders <= cutoff)


def test_label_columns(churn_mart):
    labels = ChurnLabeler().label(churn_mart)
    assert list(labels.columns) == ["seller_id", "churned"]
```

- [ ] **Step 3: Run to verify FAIL**

Run: `python -m pytest tests/test_churn_labeling.py -v`
Expected: FAIL — `src.churn.labeling` missing.

- [ ] **Step 4: Create `src/churn/__init__.py`** (empty file)

- [ ] **Step 5: Create `src/churn/labeling.py`**

```python
import pandas as pd


class ChurnLabeler:
    """Cohort labeling: features precede the label window (no leakage)."""

    def __init__(self, horizon_days: int = 90) -> None:
        self.horizon_days = horizon_days

    def cutoff(self, mart) -> pd.Timestamp:
        return mart.max_order_date.normalize() - pd.Timedelta(days=self.horizon_days)

    def label(self, mart) -> pd.DataFrame:
        orders = mart.seller_orders()
        cutoff = self.cutoff(mart)
        window_end = cutoff + pd.Timedelta(days=self.horizon_days)

        ts = orders["order_purchase_timestamp"]
        before = orders[ts <= cutoff]
        future = orders[(ts > cutoff) & (ts <= window_end)]

        eligible = set(before["seller_id"].unique())
        if not eligible:
            raise ValueError("No eligible sellers in the observation window.")
        active_future = set(future["seller_id"].unique())

        records = [
            {"seller_id": s, "churned": 0 if s in active_future else 1}
            for s in sorted(eligible)
        ]
        return pd.DataFrame(records, columns=["seller_id", "churned"])
```

- [ ] **Step 6: Run labeling tests to verify PASS**

Run: `python -m pytest tests/test_churn_labeling.py -v`
Expected: 3 PASS.

- [ ] **Step 7: Commit**

```bash
git add src/churn/__init__.py src/churn/labeling.py tests/conftest.py tests/test_churn_labeling.py
git commit -m "feat: ChurnLabeler cohort labeling + churn_mart fixture"
```

---

### Task 9: SellerFeatureBuilder

**Files:**
- Create: `Proyectos/ai-sales-assistant/src/churn/features.py`
- Test: `Proyectos/ai-sales-assistant/tests/test_churn_features.py`

**Interfaces:**
- Consumes: `SalesMart.seller_orders()` (filtered to `<= cutoff`); `cutoff` from ChurnLabeler.
- Produces: `SellerFeatureBuilder` per Shared Interfaces. `FEATURES` = ordered list. Output indexed by `seller_id`, columns = `FEATURES`. NaN `avg_review_score` median-imputed; `has_reviews` flag (1/0).

- [ ] **Step 1: Write failing test** — `tests/test_churn_features.py`

```python
import pandas as pd
from src.churn.features import SellerFeatureBuilder
from src.churn.labeling import ChurnLabeler


def test_feature_columns(churn_mart):
    cutoff = ChurnLabeler().cutoff(churn_mart)
    X = SellerFeatureBuilder().build(churn_mart, cutoff)
    assert list(X.columns) == SellerFeatureBuilder.FEATURES
    assert X.index.name == "seller_id"


def test_only_pre_cutoff_orders_used(churn_mart):
    # sA has a2 (2018-07-01, after cutoff) that must be EXCLUDED from features
    cutoff = ChurnLabeler().cutoff(churn_mart)
    X = SellerFeatureBuilder().build(churn_mart, cutoff)
    # sA pre-cutoff orders: a1 only -> frequency 1
    assert X.loc["sA", "frequency"] == 1
    # sB pre-cutoff: b1, b2 -> frequency 2
    assert X.loc["sB", "frequency"] == 2


def test_no_nan_in_features(churn_mart):
    cutoff = ChurnLabeler().cutoff(churn_mart)
    X = SellerFeatureBuilder().build(churn_mart, cutoff)
    assert not X.isna().any().any()
```

- [ ] **Step 2: Run to verify FAIL**

Run: `python -m pytest tests/test_churn_features.py -v`
Expected: FAIL — module missing.

- [ ] **Step 3: Create `src/churn/features.py`**

```python
import numpy as np
import pandas as pd


class SellerFeatureBuilder:
    """Seller × feature matrix as-of a cutoff. Uses only orders <= cutoff."""

    FEATURES = [
        "recency_days", "frequency", "monetary_total", "monetary_aov",
        "tenure_days", "avg_delivery_delay_days", "pct_late",
        "avg_distance_km", "avg_review_score", "pct_low_review",
        "category_diversity", "has_reviews",
    ]

    def build(self, mart, cutoff: pd.Timestamp) -> pd.DataFrame:
        orders = mart.seller_orders()
        orders = orders[orders["order_purchase_timestamp"] <= cutoff]
        if orders.empty:
            raise ValueError("No orders on/before cutoff to build features.")

        g = orders.groupby("seller_id")
        last = g["order_purchase_timestamp"].max()
        first = g["order_purchase_timestamp"].min()

        feats = pd.DataFrame(index=last.index)
        feats.index.name = "seller_id"
        feats["recency_days"] = (cutoff - last).dt.days.astype(float)
        feats["frequency"] = g.size().astype(float)
        feats["monetary_total"] = g["payment_value"].sum()
        feats["monetary_aov"] = g["payment_value"].mean()
        feats["tenure_days"] = (last - first).dt.days.astype(float)
        feats["avg_delivery_delay_days"] = g["delivery_delay_days"].mean()
        feats["pct_late"] = g["delivery_delay_days"].apply(lambda s: (s > 0).mean())
        feats["avg_distance_km"] = g["distance_km"].mean()
        feats["avg_review_score"] = g["review_score"].mean()
        feats["pct_low_review"] = g["review_score"].apply(
            lambda s: (s <= 2).mean() if s.notna().any() else 0.0)
        # category_diversity: not in seller_orders; approximate by distinct products
        feats["category_diversity"] = orders.groupby("seller_id")["order_id"].nunique().astype(float)

        feats["has_reviews"] = feats["avg_review_score"].notna().astype(float)
        median_score = feats["avg_review_score"].median()
        if np.isnan(median_score):
            median_score = 3.0
        feats["avg_review_score"] = feats["avg_review_score"].fillna(median_score)
        feats = feats.fillna(0.0)
        return feats[self.FEATURES]
```

(Note: `category_diversity` here uses distinct orders as a proxy because `seller_orders()` does not carry category. If true category diversity is needed later, extend `seller_orders()` to join `product_category_name_english` — deferred, YAGNI for the model.)

- [ ] **Step 4: Run feature tests to verify PASS**

Run: `python -m pytest tests/test_churn_features.py -v`
Expected: 3 PASS.

- [ ] **Step 5: Commit**

```bash
git add src/churn/features.py tests/test_churn_features.py
git commit -m "feat: SellerFeatureBuilder as-of cutoff (no leakage)"
```

---

### Task 10: ChurnModel (LogReg baseline + XGBoost)

**Files:**
- Create: `Proyectos/ai-sales-assistant/src/churn/model.py`
- Modify: `Proyectos/ai-sales-assistant/requirements.txt` (scikit-learn, xgboost, joblib)
- Test: `Proyectos/ai-sales-assistant/tests/test_churn_model.py`

**Interfaces:**
- Produces: `ChurnModel` per Shared Interfaces. `evaluate` returns keys `auc_roc, pr_auc, precision, recall, f1, confusion_matrix`. `feature_importance` returns `{feature: importance}`.

- [ ] **Step 1: Add deps** — append to `requirements.txt`:
```
scikit-learn>=1.4.0
xgboost>=2.0.0
joblib>=1.3.0
```

- [ ] **Step 2: Write failing test** — `tests/test_churn_model.py`

```python
import numpy as np
import pandas as pd
import pytest
from src.churn.model import ChurnModel


@pytest.fixture
def xy():
    rng = np.random.default_rng(0)
    n = 200
    X = pd.DataFrame({
        "recency_days": rng.uniform(0, 200, n),
        "frequency": rng.integers(1, 20, n).astype(float),
        "monetary_total": rng.uniform(50, 5000, n),
        "monetary_aov": rng.uniform(20, 500, n),
        "tenure_days": rng.uniform(0, 400, n),
        "avg_delivery_delay_days": rng.uniform(-10, 20, n),
        "pct_late": rng.uniform(0, 1, n),
        "avg_distance_km": rng.uniform(0, 1000, n),
        "avg_review_score": rng.uniform(1, 5, n),
        "pct_low_review": rng.uniform(0, 1, n),
        "category_diversity": rng.integers(1, 10, n).astype(float),
        "has_reviews": rng.integers(0, 2, n).astype(float),
    })
    # churn correlates with high recency + high pct_late
    logit = 0.02 * X["recency_days"] + 2.0 * X["pct_late"] - 3
    p = 1 / (1 + np.exp(-logit))
    y = pd.Series((rng.uniform(0, 1, n) < p).astype(int), name="churned")
    return X, y


@pytest.mark.parametrize("estimator", ["logreg", "xgboost"])
def test_fit_predict_proba_shape(xy, estimator):
    X, y = xy
    model = ChurnModel(estimator).fit(X, y)
    p = model.predict_proba(X)
    assert p.shape == (len(X),)
    assert ((p >= 0) & (p <= 1)).all()


def test_evaluate_keys(xy):
    X, y = xy
    metrics = ChurnModel("xgboost").fit(X, y).evaluate(X, y)
    for k in ("auc_roc", "pr_auc", "precision", "recall", "f1", "confusion_matrix"):
        assert k in metrics


def test_feature_importance(xy):
    X, y = xy
    imp = ChurnModel("xgboost").fit(X, y).feature_importance()
    assert set(imp).issubset(set(X.columns))
    assert all(v >= 0 for v in imp.values())


def test_save_load_roundtrip(xy, tmp_path):
    X, y = xy
    model = ChurnModel("xgboost").fit(X, y)
    path = str(tmp_path / "model.pkl")
    model.save(path)
    loaded = ChurnModel.load(path)
    assert np.allclose(loaded.predict_proba(X), model.predict_proba(X))
```

- [ ] **Step 3: Run to verify FAIL**

Run: `python -m pytest tests/test_churn_model.py -v`
Expected: FAIL — module missing.

- [ ] **Step 4: Create `src/churn/model.py`**

```python
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (average_precision_score, confusion_matrix,
                             f1_score, precision_score, recall_score,
                             roc_auc_score)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier


class ChurnModel:
    """Wraps a LogReg baseline or XGBoost estimator behind one interface."""

    def __init__(self, estimator: str = "xgboost") -> None:
        if estimator not in ("logreg", "xgboost"):
            raise ValueError(f"Unknown estimator: {estimator}")
        self.estimator = estimator
        self._features: list[str] | None = None
        if estimator == "logreg":
            self._model = Pipeline([
                ("scale", StandardScaler()),
                ("clf", LogisticRegression(max_iter=1000, class_weight="balanced")),
            ])
        else:
            self._model = XGBClassifier(
                n_estimators=200, max_depth=4, learning_rate=0.1,
                subsample=0.9, eval_metric="logloss", random_state=0)

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "ChurnModel":
        self._features = list(X.columns)
        if self.estimator == "xgboost":
            pos = max(int((y == 1).sum()), 1)
            neg = int((y == 0).sum())
            self._model.set_params(scale_pos_weight=neg / pos)
        self._model.fit(X, y)
        return self

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self._model.predict_proba(X[self._features])[:, 1]

    def evaluate(self, X: pd.DataFrame, y: pd.Series) -> dict:
        p = self.predict_proba(X)
        pred = (p >= 0.5).astype(int)
        return {
            "auc_roc": float(roc_auc_score(y, p)),
            "pr_auc": float(average_precision_score(y, p)),
            "precision": float(precision_score(y, pred, zero_division=0)),
            "recall": float(recall_score(y, pred, zero_division=0)),
            "f1": float(f1_score(y, pred, zero_division=0)),
            "confusion_matrix": confusion_matrix(y, pred).tolist(),
        }

    def feature_importance(self) -> dict:
        if self.estimator == "xgboost":
            vals = self._model.feature_importances_
        else:
            coefs = self._model.named_steps["clf"].coef_[0]
            vals = np.abs(coefs)
        return {f: float(v) for f, v in zip(self._features, vals)}

    def save(self, path: str) -> None:
        joblib.dump(
            {"estimator": self.estimator, "model": self._model,
             "features": self._features}, path)

    @classmethod
    def load(cls, path: str) -> "ChurnModel":
        blob = joblib.load(path)
        obj = cls.__new__(cls)
        obj.estimator = blob["estimator"]
        obj._model = blob["model"]
        obj._features = blob["features"]
        return obj
```

- [ ] **Step 5: Run model tests to verify PASS**

Run: `python -m pytest tests/test_churn_model.py -v`
Expected: PASS (install deps if needed: `pip install scikit-learn xgboost joblib`).

- [ ] **Step 6: Commit**

```bash
git add src/churn/model.py requirements.txt tests/test_churn_model.py
git commit -m "feat: ChurnModel — LogReg baseline + XGBoost with evaluation"
```

---

### Task 11: DriftMonitor (PSI)

**Files:**
- Create: `Proyectos/ai-sales-assistant/src/churn/drift.py`
- Test: `Proyectos/ai-sales-assistant/tests/test_churn_drift.py`

**Interfaces:**
- Produces: `DriftMonitor` per Shared Interfaces. `psi` returns `{feature: psi_value}`. `save_reference`/`from_reference_file` round-trip via JSON.

- [ ] **Step 1: Write failing test** — `tests/test_churn_drift.py`

```python
import numpy as np
import pandas as pd
from src.churn.drift import DriftMonitor


def _frame(seed):
    rng = np.random.default_rng(seed)
    return pd.DataFrame({
        "recency_days": rng.uniform(0, 200, 500),
        "frequency": rng.uniform(1, 20, 500),
    })


def test_psi_zero_for_same_distribution():
    ref = _frame(1)
    psi = DriftMonitor(ref).psi(ref)
    assert all(v < 0.1 for v in psi.values())


def test_psi_flags_shift():
    ref = _frame(1)
    cur = _frame(1).assign(recency_days=lambda d: d["recency_days"] + 500)
    psi = DriftMonitor(ref).psi(cur)
    assert psi["recency_days"] > 0.2


def test_reference_roundtrip(tmp_path):
    ref = _frame(1)
    path = str(tmp_path / "ref.json")
    DriftMonitor(ref).save_reference(path)
    loaded = DriftMonitor.from_reference_file(path)
    psi = loaded.psi(ref)
    assert all(v < 0.1 for v in psi.values())
```

- [ ] **Step 2: Run to verify FAIL**

Run: `python -m pytest tests/test_churn_drift.py -v`
Expected: FAIL — module missing.

- [ ] **Step 3: Create `src/churn/drift.py`**

```python
import json
import numpy as np
import pandas as pd


class DriftMonitor:
    """Population Stability Index per feature. Portable, offline."""

    def __init__(self, reference: pd.DataFrame, bins: int = 10) -> None:
        self.bins = bins
        self._edges: dict[str, list[float]] = {}
        self._ref_pct: dict[str, list[float]] = {}
        for col in reference.columns:
            edges = np.quantile(reference[col], np.linspace(0, 1, bins + 1))
            edges[0], edges[-1] = -np.inf, np.inf
            edges = np.unique(edges)
            counts, _ = np.histogram(reference[col], bins=edges)
            pct = counts / max(counts.sum(), 1)
            self._edges[col] = edges.tolist()
            self._ref_pct[col] = pct.tolist()

    def psi(self, current: pd.DataFrame) -> dict:
        out = {}
        for col, edges in self._edges.items():
            if col not in current.columns:
                continue
            ref_pct = np.array(self._ref_pct[col])
            counts, _ = np.histogram(current[col], bins=np.array(edges))
            cur_pct = counts / max(counts.sum(), 1)
            eps = 1e-6
            ref_pct = np.clip(ref_pct, eps, None)
            cur_pct = np.clip(cur_pct, eps, None)
            out[col] = float(np.sum((cur_pct - ref_pct) * np.log(cur_pct / ref_pct)))
        return out

    def save_reference(self, path: str) -> None:
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"bins": self.bins, "edges": self._edges,
                       "ref_pct": self._ref_pct}, f, indent=2)

    @classmethod
    def from_reference_file(cls, path: str) -> "DriftMonitor":
        with open(path, "r", encoding="utf-8") as f:
            blob = json.load(f)
        obj = cls.__new__(cls)
        obj.bins = blob["bins"]
        obj._edges = blob["edges"]
        obj._ref_pct = blob["ref_pct"]
        return obj
```

- [ ] **Step 4: Run drift tests to verify PASS**

Run: `python -m pytest tests/test_churn_drift.py -v`
Expected: 3 PASS.

- [ ] **Step 5: Commit**

```bash
git add src/churn/drift.py tests/test_churn_drift.py
git commit -m "feat: DriftMonitor — PSI drift detection, JSON reference"
```

---

### Task 12: RecommendationEngine

**Files:**
- Create: `Proyectos/ai-sales-assistant/src/churn/recommendations.py`
- Test: `Proyectos/ai-sales-assistant/tests/test_churn_recommendations.py`

**Interfaces:**
- Produces: `RecommendationEngine.recommend(seller_features: pd.Series) -> list[str]`. Rules-based, offline. Empty list when the seller is healthy.

- [ ] **Step 1: Write failing test** — `tests/test_churn_recommendations.py`

```python
import pandas as pd
from src.churn.recommendations import RecommendationEngine


def test_late_deliveries_flagged():
    s = pd.Series({"pct_late": 0.4, "avg_review_score": 4.5,
                   "recency_days": 10, "avg_distance_km": 100})
    recs = RecommendationEngine().recommend(s)
    assert any("logistic" in r.lower() or "late" in r.lower() for r in recs)


def test_low_reviews_flagged():
    s = pd.Series({"pct_late": 0.05, "avg_review_score": 2.5,
                   "recency_days": 10, "avg_distance_km": 100})
    recs = RecommendationEngine().recommend(s)
    assert any("quality" in r.lower() or "satisfaction" in r.lower() for r in recs)


def test_inactive_flagged():
    s = pd.Series({"pct_late": 0.05, "avg_review_score": 4.5,
                   "recency_days": 90, "avg_distance_km": 100})
    recs = RecommendationEngine().recommend(s)
    assert any("re-engage" in r.lower() or "inactive" in r.lower() for r in recs)


def test_healthy_seller_no_recs():
    s = pd.Series({"pct_late": 0.02, "avg_review_score": 4.8,
                   "recency_days": 5, "avg_distance_km": 100})
    assert RecommendationEngine().recommend(s) == []
```

- [ ] **Step 2: Run to verify FAIL**

Run: `python -m pytest tests/test_churn_recommendations.py -v`
Expected: FAIL — module missing.

- [ ] **Step 3: Create `src/churn/recommendations.py`**

```python
import pandas as pd


class RecommendationEngine:
    """Rules-based, offline business recommendations from seller features."""

    LATE_THRESHOLD = 0.3
    LOW_REVIEW_THRESHOLD = 3.0
    INACTIVE_DAYS = 60

    def recommend(self, seller_features: pd.Series) -> list[str]:
        recs: list[str] = []
        if seller_features.get("pct_late", 0) > self.LATE_THRESHOLD:
            recs.append(
                "Improve logistics: over 30% of deliveries are late.")
        if seller_features.get("avg_review_score", 5) < self.LOW_REVIEW_THRESHOLD:
            recs.append(
                "Address quality: low customer satisfaction (avg review < 3).")
        if seller_features.get("recency_days", 0) > self.INACTIVE_DAYS:
            recs.append(
                "Re-engage: seller inactive for 60+ days.")
        return recs
```

- [ ] **Step 4: Run recommendation tests to verify PASS**

Run: `python -m pytest tests/test_churn_recommendations.py -v`
Expected: 4 PASS.

- [ ] **Step 5: Commit**

```bash
git add src/churn/recommendations.py tests/test_churn_recommendations.py
git commit -m "feat: RecommendationEngine — rules-based seller actions"
```

---

### Task 13: Training pipeline + ChurnScorer (artifacts)

**Files:**
- Create: `Proyectos/ai-sales-assistant/src/churn/train.py`
- Create: `Proyectos/ai-sales-assistant/src/churn/predict.py`
- Test: `Proyectos/ai-sales-assistant/tests/test_churn_train_predict.py`

**Interfaces:**
- Consumes: SalesMart, ChurnLabeler, SellerFeatureBuilder, ChurnModel, DriftMonitor.
- Produces: `train_churn(db_path, models_dir) -> dict` writes `model.pkl`, `metrics.json`, `feature_importance.json`, `drift_reference.json`; `ChurnScorer.at_risk(mart, cutoff) -> DataFrame`.

- [ ] **Step 1: Write failing test** — `tests/test_churn_train_predict.py`

```python
import json
import os
import pandas as pd
from src.churn.train import train_churn
from src.churn.predict import ChurnScorer
from src.churn.model import ChurnModel
from src.churn.recommendations import RecommendationEngine
from src.churn.labeling import ChurnLabeler


def test_train_writes_artifacts(churn_mart, tmp_path):
    models_dir = str(tmp_path / "models")
    metrics = train_churn(mart=churn_mart, models_dir=models_dir)
    assert os.path.exists(os.path.join(models_dir, "model.pkl"))
    assert os.path.exists(os.path.join(models_dir, "metrics.json"))
    assert os.path.exists(os.path.join(models_dir, "feature_importance.json"))
    assert os.path.exists(os.path.join(models_dir, "drift_reference.json"))
    with open(os.path.join(models_dir, "metrics.json")) as f:
        saved = json.load(f)
    assert "xgboost" in saved and "baseline_logreg" in saved


def test_scorer_at_risk_shape(churn_mart, tmp_path):
    models_dir = str(tmp_path / "models")
    train_churn(mart=churn_mart, models_dir=models_dir)
    model = ChurnModel.load(os.path.join(models_dir, "model.pkl"))
    scorer = ChurnScorer(model, RecommendationEngine())
    cutoff = ChurnLabeler().cutoff(churn_mart)
    out = scorer.at_risk(churn_mart, cutoff)
    assert {"seller_id", "churn_probability", "recommendations"}.issubset(out.columns)
    assert (out["churn_probability"].between(0, 1)).all()
```

- [ ] **Step 2: Run to verify FAIL**

Run: `python -m pytest tests/test_churn_train_predict.py -v`
Expected: FAIL — modules missing.

- [ ] **Step 3: Create `src/churn/train.py`**

```python
import json
import os
import hashlib
from datetime import datetime, timezone

from src.mart import SalesMart
from src.churn.labeling import ChurnLabeler
from src.churn.features import SellerFeatureBuilder
from src.churn.model import ChurnModel
from src.churn.drift import DriftMonitor


def train_churn(db_path: str = "data/olist_mart.db",
                models_dir: str = "models",
                mart: SalesMart | None = None) -> dict:
    mart = mart or SalesMart(db_path)
    os.makedirs(models_dir, exist_ok=True)

    labeler = ChurnLabeler()
    cutoff = labeler.cutoff(mart)
    labels = labeler.label(mart)
    features = SellerFeatureBuilder().build(mart, cutoff)

    data = features.join(labels.set_index("seller_id"), how="inner")
    X = data[SellerFeatureBuilder.FEATURES]
    y = data["churned"]

    baseline = ChurnModel("logreg").fit(X, y)
    model = ChurnModel("xgboost").fit(X, y)

    metrics = {
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "n_sellers": int(len(X)),
        "churn_rate": float(y.mean()),
        "dataset_hash": hashlib.sha256(
            X.to_csv().encode()).hexdigest()[:16],
        "baseline_logreg": baseline.evaluate(X, y),
        "xgboost": model.evaluate(X, y),
    }

    model.save(os.path.join(models_dir, "model.pkl"))
    with open(os.path.join(models_dir, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    with open(os.path.join(models_dir, "feature_importance.json"), "w",
              encoding="utf-8") as f:
        json.dump(model.feature_importance(), f, indent=2)
    DriftMonitor(X).save_reference(
        os.path.join(models_dir, "drift_reference.json"))
    return metrics


if __name__ == "__main__":
    m = train_churn()
    print(f"XGBoost AUC: {m['xgboost']['auc_roc']:.3f} | "
          f"baseline AUC: {m['baseline_logreg']['auc_roc']:.3f}")
```

- [ ] **Step 4: Create `src/churn/predict.py`**

```python
import pandas as pd

from src.churn.features import SellerFeatureBuilder
from src.churn.model import ChurnModel
from src.churn.recommendations import RecommendationEngine


class ChurnScorer:
    """Scores current sellers and attaches business recommendations."""

    def __init__(self, model: ChurnModel, engine: RecommendationEngine) -> None:
        self._model = model
        self._engine = engine

    def at_risk(self, mart, cutoff: pd.Timestamp) -> pd.DataFrame:
        features = SellerFeatureBuilder().build(mart, cutoff)
        proba = self._model.predict_proba(features)
        out = pd.DataFrame({
            "seller_id": features.index,
            "churn_probability": proba,
        })
        out["recommendations"] = [
            self._engine.recommend(features.loc[sid])
            for sid in features.index
        ]
        return out.sort_values("churn_probability", ascending=False).reset_index(drop=True)
```

- [ ] **Step 5: Run train/predict tests to verify PASS**

Run: `python -m pytest tests/test_churn_train_predict.py -v`
Expected: 2 PASS.

- [ ] **Step 6: Commit**

```bash
git add src/churn/train.py src/churn/predict.py tests/test_churn_train_predict.py
git commit -m "feat: churn training pipeline + ChurnScorer with artifacts"
```

---

## Phase 3 — Streamlit Frontend

### Task 14: Charts, app rebuild, remove chatbot, docs

**Files:**
- Modify: `Proyectos/ai-sales-assistant/src/charts.py` (add importance + confusion charts)
- Modify: `Proyectos/ai-sales-assistant/app.py` (3 tabs, no chatbot)
- Delete: `Proyectos/ai-sales-assistant/src/agent.py`, `Proyectos/ai-sales-assistant/tests/test_agent.py`
- Modify: `Proyectos/ai-sales-assistant/requirements.txt` (remove langchain*, python-dotenv)
- Modify: `Proyectos/ai-sales-assistant/README.md`
- Test: `Proyectos/ai-sales-assistant/tests/test_charts.py` (extend)

**Interfaces:**
- Consumes: `run_analysis`, `SalesMart`, `ChurnModel`, `ChurnScorer`, `RecommendationEngine`, `ChurnLabeler`.
- Produces: `charts.feature_importance_chart(importance: dict) -> Figure`, `charts.confusion_matrix_chart(cm: list[list[int]]) -> Figure`.

- [ ] **Step 1: Write failing test** — extend `tests/test_charts.py` (append)

```python
def test_feature_importance_chart():
    import plotly.graph_objects as go
    from src.charts import feature_importance_chart
    fig = feature_importance_chart({"pct_late": 0.4, "recency_days": 0.6})
    assert isinstance(fig, go.Figure)


def test_confusion_matrix_chart():
    import plotly.graph_objects as go
    from src.charts import confusion_matrix_chart
    fig = confusion_matrix_chart([[10, 2], [3, 5]])
    assert isinstance(fig, go.Figure)
```

- [ ] **Step 2: Run to verify FAIL**

Run: `python -m pytest tests/test_charts.py -v`
Expected: FAIL — functions missing.

- [ ] **Step 3: Add chart helpers to `src/charts.py`** (append)

```python
def feature_importance_chart(importance: dict) -> Figure:
    items = sorted(importance.items(), key=lambda kv: kv[1])
    labels = [k for k, _ in items]
    values = [v for _, v in items]
    fig = Figure(go.Bar(x=values, y=labels, orientation="h"))
    fig.update_layout(title="Feature Importance", xaxis_title="Importance")
    return fig


def confusion_matrix_chart(cm: list) -> Figure:
    fig = Figure(go.Heatmap(
        z=cm,
        x=["Pred: retained", "Pred: churn"],
        y=["Actual: retained", "Actual: churn"],
        text=cm, texttemplate="%{text}", colorscale="Blues"))
    fig.update_layout(title="Confusion Matrix")
    return fig
```

(Note: `charts.py` already imports `from plotly.graph_objects import Figure`; add `import plotly.graph_objects as go` at the top if not present.)

- [ ] **Step 4: Run chart tests to verify PASS**

Run: `python -m pytest tests/test_charts.py -v`
Expected: PASS.

- [ ] **Step 5: Remove chatbot files and deps**

```bash
git rm src/agent.py tests/test_agent.py
```

Edit `requirements.txt` to the final set:
```
streamlit>=1.35.0
pandas>=2.2.0
numpy>=1.26.0
plotly>=5.22.0
scikit-learn>=1.4.0
xgboost>=2.0.0
joblib>=1.3.0
ydata-profiling>=4.6.0
pytest>=8.2.0
pytest-mock>=3.14.0
```

- [ ] **Step 6: Replace `app.py`**

```python
import os
import streamlit as st
from src.mart import SalesMart
from src.loader import load_data
from src.analysis import run_analysis
from src.charts import feature_importance_chart, confusion_matrix_chart
from src.churn.model import ChurnModel
from src.churn.labeling import ChurnLabeler
from src.churn.predict import ChurnScorer
from src.churn.recommendations import RecommendationEngine
import json

DB_PATH = os.path.join("data", "olist_mart.db")
MODELS_DIR = "models"
MODEL_PATH = os.path.join(MODELS_DIR, "model.pkl")
METRICS_PATH = os.path.join(MODELS_DIR, "metrics.json")

st.set_page_config(page_title="Seller Churn Intelligence", page_icon="📉", layout="wide")
st.title("📉 Seller Churn Intelligence")
st.caption(
    "Olist Brazilian E-Commerce · SQLite Data Mart + XGBoost · "
    "[Code on GitHub](https://github.com/HoracioLaphitz/ai-sales-assistant)")

if not os.path.exists(DB_PATH):
    st.error("❌ Data mart not found. Run `python -m src.etl` to build it.")
    st.stop()


@st.cache_data
def get_data():
    return load_data(DB_PATH)


@st.cache_data
def get_analysis(_df):
    return run_analysis(_df)


df = get_data()
analysis = get_analysis(df)
kpis, figs = analysis["kpis"], analysis["figs"]

tab_analytics, tab_model, tab_recs = st.tabs(
    ["📊 Analytics", "🤖 Churn Model", "💡 Recommendations"])

with tab_analytics:
    c1, c2, c3 = st.columns(3)
    c1.metric("Total Revenue", f"R$ {kpis['total_revenue']:,.0f}")
    c2.metric("Delivered Orders", f"{kpis['total_orders']:,}")
    c3.metric("Average Order Value", f"R$ {kpis['aov']:,.2f}")
    c4, c5, c6 = st.columns(3)
    c4.metric("Avg Distance (km)", f"{kpis['avg_distance_km']:,.1f}")
    delay = kpis["avg_delivery_delay_days"]
    c5.metric("Avg Delivery Delay", f"{'+' if delay > 0 else ''}{delay:.1f} days")
    c6.metric("Late Delivery Rate", f"{kpis['late_delivery_rate']:.1f}%")
    st.divider()
    st.plotly_chart(figs["monthly"], use_container_width=True)
    col_a, col_b = st.columns(2)
    col_a.plotly_chart(figs["categories"], use_container_width=True)
    col_b.plotly_chart(figs["states"], use_container_width=True)

if not os.path.exists(MODEL_PATH):
    with tab_model:
        st.warning("Model not trained. Run `python -m src.churn.train`.")
    with tab_recs:
        st.warning("Model not trained. Run `python -m src.churn.train`.")
    st.stop()


@st.cache_resource
def get_model():
    return ChurnModel.load(MODEL_PATH)


@st.cache_data
def get_metrics():
    with open(METRICS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@st.cache_data
def get_at_risk():
    mart = SalesMart(DB_PATH)
    cutoff = ChurnLabeler().cutoff(mart)
    scorer = ChurnScorer(get_model(), RecommendationEngine())
    return scorer.at_risk(mart, cutoff)


with tab_model:
    metrics = get_metrics()
    xgb = metrics["xgboost"]
    base = metrics["baseline_logreg"]
    m1, m2, m3 = st.columns(3)
    m1.metric("XGBoost AUC-ROC", f"{xgb['auc_roc']:.3f}",
              delta=f"{xgb['auc_roc'] - base['auc_roc']:+.3f} vs baseline")
    m2.metric("Precision", f"{xgb['precision']:.2f}")
    m3.metric("Recall", f"{xgb['recall']:.2f}")
    col_i, col_c = st.columns(2)
    with open(os.path.join(MODELS_DIR, "feature_importance.json")) as f:
        importance = json.load(f)
    col_i.plotly_chart(feature_importance_chart(importance), use_container_width=True)
    col_c.plotly_chart(confusion_matrix_chart(xgb["confusion_matrix"]),
                       use_container_width=True)

with tab_recs:
    st.markdown("**Sellers ranked by churn probability:**")
    at_risk = get_at_risk().copy()
    at_risk["recommendations"] = at_risk["recommendations"].apply(
        lambda r: " · ".join(r) if r else "Healthy")
    at_risk["churn_probability"] = (at_risk["churn_probability"] * 100).round(1)
    st.dataframe(
        at_risk.rename(columns={"churn_probability": "churn %"}),
        use_container_width=True, hide_index=True)
```

- [ ] **Step 7: Update `README.md`** — replace setup/run and stack sections. Add (and remove any GROQ/NVAPI/chatbot text):

```markdown
## Setup

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Get the data
Download the [Olist dataset](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)
and place all 9 CSVs in `data/`.

### 3. Build the Data Mart (once)
```bash
python -m src.etl
```
ELT: raw CSVs → SQL cleaning (`sql/clean.sql`) → Python Haversine → SQL Star
Schema (`sql/mart.sql`) → data-quality gate (`sql/quality.sql`) → views. Open
`data/olist_mart.db` in [DB Browser for SQLite](https://sqlitebrowser.org/) to
audit the cleaning. See `docs/data-dictionary.md`.

### 4. Train the churn model (once)
```bash
python -m src.churn.train
```
Cohort labeling (no leakage) → LogReg baseline + XGBoost → artifacts in `models/`.

### 5. Run the app
```bash
python -m streamlit run app.py
```

## Stack
SQLite Data Mart (Star Schema) · scikit-learn / XGBoost churn model · portable
ML observability (PSI drift, versioned metrics) · Streamlit · Plotly. 100%
offline, no API keys.
```

- [ ] **Step 8: Run full suite**

Run: `python -m pytest -v`
Expected: all PASS (no test_agent; churn + etl + mart + analysis + charts + loader green).

- [ ] **Step 9: Commit**

```bash
git add app.py src/charts.py requirements.txt README.md tests/test_charts.py
git rm --cached src/agent.py tests/test_agent.py 2>/dev/null; true
git commit -m "feat: rebuild Streamlit as churn frontend; remove LLM chatbot"
```

---

## Self-Review

**Spec coverage:**
- ELT raw→clean→mart→quality→views: Tasks 2-5 ✅
- 9th CSV (reviews): Task 1 fixture + Task 2 ingestion + Task 3 fact column ✅
- delivery_delay in SQL, Haversine in Python: Task 2 (SQL), Task 3 (Python) ✅
- Data-quality gate + DataQualityError: Task 4 ✅
- Analytical views + v_seller_features: Task 5 ✅
- Data dictionary: Task 5 ✅
- EDA ydata-profiling: Task 7 ✅
- SalesMart repository + loader wrapper: Task 6 ✅
- ChurnLabeler cohort (3 edge cases): Task 8 ✅
- SellerFeatureBuilder as-of cutoff: Task 9 ✅
- ChurnModel LogReg + XGBoost + metrics + importance + save/load: Task 10 ✅
- DriftMonitor PSI: Task 11 ✅
- RecommendationEngine rules: Task 12 ✅
- train.py artifacts + ChurnScorer: Task 13 ✅
- Streamlit 3 tabs, chatbot removed, deps cleaned: Task 14 ✅
- Error handling (missing db/model guards): Task 14 ✅

**Type consistency:** `build_mart(data_dir, db_path)`, `SalesMart` methods, `ChurnLabeler.cutoff/label`, `SellerFeatureBuilder.FEATURES/build`, `ChurnModel` interface, `ChurnScorer.at_risk` — all match the Shared Interfaces block across tasks.

**Known deferrals (YAGNI, documented in-task):**
- `category_diversity` uses distinct-orders proxy (seller_orders lacks category). Flagged in Task 9.
- `conftest.py` `sample_df` / `test_db_path` already provide fixtures; Task 1 adds reviews CSV so `test_db_path`-built mart includes reviews.

**Cross-task note:** existing `tests/test_analysis.py` (`sample_df`-based) is untouched and stays green — `run_analysis` signature unchanged.
