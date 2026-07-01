# Seller Churn Intelligence — Design

**Date:** 2026-06-30
**Project:** `Proyectos/ai-sales-assistant`
**Status:** Approved design, pending implementation plan

## Goal

Pivot the ai-sales-assistant from a generic LLM-chat dashboard into a
**Seller Churn Intelligence** product, fully aligned with `Desarrollar.md`:
a portable SQLite Data Mart feeding a scikit-learn/XGBoost churn model, with a
Streamlit frontend that surfaces at-risk sellers and actionable business
recommendations. The project runs 100% offline — no external API keys.

## Non-Goals

- No LLM chatbot. The generic chat (`agent.py`, LangChain, NVIDIA NIM/`NVAPI`)
  is removed entirely.
- No external observability SaaS (Datadog). ML observability is portable and
  file-based.
- No real-time serving. This is a batch analytics + batch scoring product.

## Architecture

ELT pipeline (load raw, clean in SQL, model in Python), all reading from the
SQLite Data Mart:

```
9 CSVs → [ingest] → raw_* staging tables (verbatim dumps)
                          ↓
        sql/clean/*.sql   ── SQL cleaning: dedup, cast, coalesce, normalize, filter
                          ↓
        stg_* cleaned tables  +  Python enrichment (Haversine distance)
                          ↓
        sql/mart/*.sql    ── build Star Schema (fact_orders + dims) via INSERT…SELECT
                          ↓
        sql/quality/*.sql ── data-quality assertions (fail loud)  +  sql/views/*.sql
                          ↓
        olist_mart.db (Star Schema, + reviews, + analytical views)
                          ↓
        SalesMart (repository)  ── data access boundary
                          ↓
        ChurnLabeler → SellerFeatureBuilder → ChurnModel → metrics.json + model.pkl
                          ↓
        ChurnScorer → at-risk sellers + RecommendationEngine
                          ↓
        Streamlit app.py  ── 3 tabs: Analytics · Churn Model · Recommendations
```

### Design principles

- **OOP with single responsibility.** Each churn concern is a class with a
  clear interface, testable in isolation.
- **SQL-first cleaning (ELT).** Cleaning and transformation logic lives in
  versioned `.sql` files, not buried in pandas. A reviewer opens the `.db` in
  DB Browser and reads exactly how the data was cleaned. Python is used only
  for CSV ingestion and what SQL can't do portably (Haversine — SQLite math
  functions aren't guaranteed across builds).
- **Repository pattern** for data access: `SalesMart` is the only class that
  knows SQL at runtime. Every downstream consumer receives DataFrames, never a
  connection.
- **Data quality is a gate, not an afterthought.** ETL fails loud on quality
  violations (nulls in keys, duplicate PKs, broken referential integrity,
  out-of-range values). A serious analyst validates before trusting.
- **No data leakage.** Cohort design guarantees features precede the label
  window in time.
- **Portable & reproducible.** Model, metrics, drift baselines, and every
  transformation `.sql` are committed to the repo — a recruiter clones and
  runs everything offline, and can audit the cleaning end to end.

## Phase 1 — Data Foundation (ELT with SQL cleaning)

`etl.py` is restructured from ETL (pandas cleaning) to ELT: load raw, clean in
SQL, build the mart in SQL. Python orchestrates and does only CSV ingestion
and Haversine.

### 1a. Raw staging layer

Load all 9 CSVs verbatim into `raw_*` tables (`raw_orders`, `raw_order_items`,
`raw_products`, `raw_customers`, `raw_sellers`, `raw_geolocation`,
`raw_payments`, `raw_reviews`, `raw_category_translation`). No transformation —
the raw layer is the auditable source of truth.

### 1b. SQL cleaning layer (`sql/clean/`)

Versioned `.sql` scripts transform `raw_*` → `stg_*` cleaned tables. Each
script is idempotent (`DROP … IF EXISTS` then rebuild) and documents its
assumptions in a header comment. Cleaning responsibilities handled in SQL:

- **Type casting** — dates via `julianday`/`datetime`, numerics.
- **Deduplication** — `raw_geolocation` collapsed to one centroid per ZIP
  prefix (`AVG(lat)`, `AVG(lng)`, `GROUP BY zip`); reviews to mean score per
  order.
- **Null handling** — `COALESCE` and explicit rules; rows with null keys
  filtered.
- **String normalization** — `LOWER(TRIM(city))`, standardized states.
- **Invalid-row filtering** — orders without a valid status, negative prices,
  impossible dates.
- **`delivery_delay_days`** computed in SQL:
  `julianday(order_delivered_customer_date) - julianday(order_estimated_delivery_date)`.

**Haversine stays in Python** (numpy) — SQLite math functions (`sin`, `cos`,
`radians`) require a build flag not guaranteed across environments; computing
in Python preserves the spec's portability guarantee. The Python step reads
`stg_customers`/`stg_sellers` centroids and writes `stg_order_distance`.

### 1c. SQL mart layer (`sql/mart/`)

`.sql` scripts build the Star Schema from `stg_*` via `INSERT … SELECT`:
`fact_orders` (+ `review_score` INTEGER nullable, mean per order; +
`distance_km`, `delivery_delay_days`), `dim_customers`, `dim_sellers`,
`dim_products`, `dim_date`. Indexes created here (seller, customer, date,
product). Delivered orders only.

### 1d. Data quality gate (`sql/quality/`)

`checks.sql` runs after the mart is built and **fails the ETL loudly** on
violation. Each check is a query that must return zero offending rows:

- No null primary keys in any dim.
- No duplicate PKs (unique `seller_id`, `customer_id`, `product_id`).
- Referential integrity: every `fact_orders.seller_id` exists in `dim_sellers`
  (same for customer, product, date).
- Value ranges: `price >= 0`, `review_score` in 1–5 or null, `distance_km >= 0`.
- Row-count sanity: `fact_orders` non-empty.

Python runs each check query; any non-empty result raises
`DataQualityError` naming the failed check. This is the analyst's "trust but
verify" gate.

### 1e. Analytical views (`sql/views/`)

SQL views for the analytical/feature layer, so the logic is inspectable in the
`.db` itself:

- `v_seller_features` — the seller × feature matrix as a view (RFM, delivery,
  reviews, geo aggregates). `SellerFeatureBuilder` reads this view rather than
  re-deriving aggregates in pandas.
- `v_monthly_revenue`, `v_state_revenue` — power the Analytics tab.

### 1f. Data dictionary

`docs/data-dictionary.md` documents every mart table and column: name, type,
source, cleaning rule applied, nullability. Standard deliverable of a serious
analyst.

### 1g. EDA report

`src/eda.py` exposes `profile_mart(db_path, output_path)` using
`ydata-profiling` to generate an HTML EDA report of `v_seller_features`.
Generated on demand via `python -m src.eda`; output to `reports/eda.html`,
gitignored (the HTML is large). Documentation, not a runtime dependency.

## Phase 2 — Churn Pipeline (OOP)

Package `src/churn/`. Each module is one class.

### `SalesMart` — repository (`src/mart.py`)

The single data-access boundary. Wraps the SQLite connection; exposes typed
query methods returning DataFrames.

```python
class SalesMart:
    def __init__(self, db_path: str = "data/olist_mart.db") -> None: ...
    @property
    def max_order_date(self) -> pd.Timestamp: ...
    def orders(self) -> pd.DataFrame: ...              # order-level (replaces loader.load_data)
    def seller_orders(self) -> pd.DataFrame: ...        # fact rows joined to seller + review
```

`loader.load_data()` is retained as a thin wrapper delegating to
`SalesMart.orders()` so the existing `analysis.py` and its 29 tests keep
passing unchanged.

### `ChurnLabeler` (`src/churn/labeling.py`)

Cohort labeling. Splits time at a cutoff `T`; labels sellers by future
activity.

```python
class ChurnLabeler:
    def __init__(self, horizon_days: int = 90) -> None: ...
    def cutoff(self, mart: SalesMart) -> pd.Timestamp:
        # T = max_order_date - horizon_days
    def label(self, mart: SalesMart) -> pd.DataFrame:
        # returns columns: seller_id, churned (0/1)
        # eligible = sellers with >=1 order on/before T
        # churned = eligible AND 0 orders in (T, T + horizon_days]
```

Edge cases the tests must cover:
- Seller active only after `T` → excluded (not in observation window).
- Seller with orders both before and after `T` → `churned = 0`.
- Seller active before `T`, silent after → `churned = 1`.

### `SellerFeatureBuilder` (`src/churn/features.py`)

Builds the seller × feature matrix as-of the cutoff. Uses only orders on/before
`T` (no leakage).

Aggregation SQL lives in the `v_seller_features` view; this class reads the
view (filtered to orders on/before `cutoff`) and applies only Python-side
concerns (imputation, `has_reviews` flag).

```python
class SellerFeatureBuilder:
    def build(self, mart: SalesMart, cutoff: pd.Timestamp) -> pd.DataFrame:
        # reads v_seller_features via mart; index: seller_id. Columns:
        #   recency_days, frequency, monetary_total, monetary_aov, tenure_days,
        #   avg_delivery_delay_days, pct_late, avg_distance_km,
        #   avg_review_score, pct_low_review, category_diversity, has_reviews
```

### `ChurnModel` (`src/churn/model.py`)

Wraps training, evaluation, persistence. A baseline and an XGBoost estimator
behind one interface.

```python
class ChurnModel:
    def __init__(self, estimator: str = "xgboost") -> None:
        # "logreg" (baseline) or "xgboost"; handles imbalance
    def fit(self, X: pd.DataFrame, y: pd.Series) -> "ChurnModel": ...
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray: ...
    def evaluate(self, X: pd.DataFrame, y: pd.Series) -> dict:
        # AUC-ROC, PR-AUC, precision, recall, f1, confusion_matrix
    def feature_importance(self) -> dict: ...           # gain + permutation
    def save(self, path: str) -> None: ...              # joblib
    @classmethod
    def load(cls, path: str) -> "ChurnModel": ...
```

Training discipline: always fit the LogReg baseline first. If XGBoost does not
beat the baseline AUC, that is a red flag surfaced in `metrics.json`, not
hidden.

### `DriftMonitor` (`src/churn/drift.py`)

Portable drift detection via Population Stability Index.

```python
class DriftMonitor:
    def __init__(self, reference: pd.DataFrame) -> None:
        # stores reference feature distributions (training data)
    def psi(self, current: pd.DataFrame) -> dict:
        # PSI per feature; >0.2 flags significant drift
    def save_reference(self, path: str) -> None: ...
```

### `RecommendationEngine` (`src/churn/recommendations.py`)

Rules-based, offline. Maps a seller's feature values to concrete business
actions.

```python
class RecommendationEngine:
    def recommend(self, seller_features: pd.Series) -> list[str]:
        # e.g. pct_late > 0.3 -> "Improve logistics: 30%+ late deliveries"
        #      avg_review_score < 3 -> "Address quality: low satisfaction"
        #      recency_days > 60 -> "Re-engage: inactive 60+ days"
```

### `train.py` — pipeline orchestration

A thin script (or `ChurnPipeline` class) wiring the above: load mart → label →
build features → train baseline + xgboost → evaluate → persist
`models/model.pkl`, `models/metrics.json`, `models/feature_importance.json`,
`models/drift_reference.json`. Runs once, like the ETL.

### `predict.py` — scoring for the app

Loads the persisted model, scores current sellers, returns the at-risk table
(seller_id, churn_probability, top risk features) joined with recommendations.

## Phase 3 — Streamlit Frontend

`app.py` rebuilt into three tabs. Guards for missing `olist_mart.db` and
missing `models/model.pkl` (like the existing DB guard).

- **Analytics** — existing Data Mart KPIs and charts (revenue, categories,
  states, distance, delay). Unchanged logic.
- **Churn Model** — model metrics (AUC, precision/recall, confusion matrix),
  feature importance chart, PSI drift status.
- **Recommendations** — sortable table of at-risk sellers with churn
  probability and per-seller recommended actions.

`charts.py` gains chart helpers for feature importance and confusion matrix.

## Removals

- Delete `src/agent.py` and `tests/test_agent.py`.
- Remove from `requirements.txt`: `langchain`, `langchain-experimental`,
  `langchain-nvidia-ai-endpoints`.
- Remove `NVAPI` handling and the LLM chat tab from `app.py`.
- `python-dotenv` stays only if any env var remains; otherwise removed.

## Dependencies added

`scikit-learn`, `xgboost`, `ydata-profiling`, `joblib`.

## Error Handling

- Data quality violation during ETL → `DataQualityError` naming the failed
  check; ETL aborts (no half-built mart trusted downstream).
- Missing `olist_mart.db` → Streamlit error + stop (existing pattern).
- Missing `models/model.pkl` → Streamlit error directing user to run
  `python -m src.churn.train`.
- Empty cohort (no eligible sellers) → `ChurnLabeler` raises `ValueError` with
  a clear message.
- Sellers with no reviews → `avg_review_score` is NaN → imputed (median) in
  `SellerFeatureBuilder`, flagged with a `has_reviews` indicator.

## Testing

- Keep the existing ETL/loader/analysis/charts tests green (adjusted for the
  ELT restructure and reviews column).
- **SQL cleaning:** fixture with dirty rows (duplicate geolocation ZIP,
  multiple reviews per order, null-key row, negative price) → `stg_*` tables
  cleaned as specified.
- **Data quality gate:** fixture violating a check → ETL raises
  `DataQualityError` naming that check; clean fixture → passes.
- `v_seller_features` view: fixture → expected aggregate values.
- `SalesMart`: query methods return expected columns/shapes from the fixture DB.
- `ChurnLabeler`: the three cohort edge cases above.
- `SellerFeatureBuilder`: known fixture → expected feature values.
- `ChurnModel`: fixture trains, `evaluate` returns all metric keys, `save`/`load`
  round-trip.
- `DriftMonitor`: identical distributions → PSI ≈ 0; shifted → PSI > threshold.
- `RecommendationEngine`: feature thresholds → expected recommendation strings.

## Orthogonal Infrastructure (handled separately, not in this spec's plan)

- **Git reconciliation:** local `main` and `origin/main` are the same Astro
  portfolio with unrelated histories. Reconcile with
  `--allow-unrelated-histories` to preserve the 10 remote portfolio commits
  before any push. Never force-push over the live site.
- **Junk cleanup:** remove stray artifacts (`=2.2.0`, `.atl/`,
  `build-metadata.json`, scratch briefs) and `Desarrollar.md` once consumed.
