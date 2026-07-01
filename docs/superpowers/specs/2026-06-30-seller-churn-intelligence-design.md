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

Three sequential layers, all reading from the SQLite Data Mart:

```
9 CSVs → [etl.py] → olist_mart.db (Star Schema, + reviews)
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
- **Repository pattern** for data access: `SalesMart` is the only class that
  knows SQL. Every downstream consumer receives DataFrames, never a
  connection.
- **No data leakage.** Cohort design guarantees features precede the label
  window in time.
- **Portable artifacts.** Model, metrics, and drift baselines are files
  committed to the repo — a recruiter clones and runs everything offline.

## Phase 1 — Complete the Data Foundation

### 1a. Add the 9th CSV (reviews)

`etl.py` gains `olist_order_reviews_dataset.csv`. Review score is a top churn
signal — a seller with falling ratings is a seller about to leave.

- New column on `fact_orders`: `review_score` (INTEGER, nullable — not every
  order has a review).
- Aggregation: **mean** `review_score` per `order_id` (an order can have
  multiple review rows; mean is more robust than first).

### 1b. EDA report

`src/eda.py` exposes a `profile_mart(db_path, output_path)` function using
`ydata-profiling` to generate an HTML EDA report of the seller feature matrix.
Generated on demand via `python -m src.eda`; output to `reports/eda.html`,
which is gitignored (the HTML is large). This is documentation, not a runtime
dependency of the app.

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

```python
class SellerFeatureBuilder:
    def build(self, mart: SalesMart, cutoff: pd.Timestamp) -> pd.DataFrame:
        # index: seller_id. Columns:
        #   recency_days, frequency, monetary_total, monetary_aov, tenure_days,
        #   avg_delivery_delay_days, pct_late, avg_distance_km,
        #   avg_review_score, pct_low_review, category_diversity
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

- Missing `olist_mart.db` → Streamlit error + stop (existing pattern).
- Missing `models/model.pkl` → Streamlit error directing user to run
  `python -m src.churn.train`.
- Empty cohort (no eligible sellers) → `ChurnLabeler` raises `ValueError` with
  a clear message.
- Sellers with no reviews → `avg_review_score` is NaN → imputed (median) in
  `SellerFeatureBuilder`, flagged with a `has_reviews` indicator.

## Testing

- Keep the 29 existing tests (ETL, loader, analysis, charts) green.
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
