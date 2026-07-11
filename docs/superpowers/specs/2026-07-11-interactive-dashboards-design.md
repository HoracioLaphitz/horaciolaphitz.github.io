# Interactive Dashboards — Design

**Date:** 2026-07-11
**Status:** Approved (pending spec review)

## Overview

Add four interactive dashboards to the portfolio (https://horaciolaphitz.vercel.app/), embedded in existing project detail pages. Dashboards are React islands that fetch **real data at runtime from the GitHub repository of each project** (`raw.githubusercontent.com`), so updating a repo updates its dashboard without redeploying the portfolio.

## Goals

- Professional, functional, interactive dashboards backed by real repo data (no screenshots, no synthetic data).
- Zero cost for projects without dashboards (islands hydrate only when visible, only on mapped slugs).
- Follow the existing clean architecture (domain / infrastructure / presentation).

## Non-Goals

- No HR/team or OKR dashboards (no real data exists; user confirmed those were examples only).
- No Power BI embedding.
- No build-time data snapshots (contradicts the "live data" requirement).
- No new portfolio projects; only enrich existing ones.

## Verified Data Sources

| Repo | Branch | Fetchable data today | Action needed |
|---|---|---|---|
| `HoracioLaphitz/MarketBasketAnalytics` | `main` | `reglas.csv` (~25 KB, association rules) | None |
| `HoracioLaphitz/Data-Analysis-Ecommerce` | `analytics-v2` | `models/metrics.json`, `models/feature_importance.json`, `models/drift_reference.json` (small). SQLite mart is 50 MB — not fetchable client-side | Commit `dashboard-data/kpis_mensuales.csv` (monthly revenue/orders/AOV + top categories aggregated from the Olist mart) |
| `HoracioLaphitz/Capitalizacion-del-Mercado-de-los-Bancos-mas-Grandes` | `main` | None (data lives inside notebook outputs) | Commit `dashboard-data/bancos_market_cap.csv` (bank, MC_USD, MC_GBP, MC_EUR, MC_INR) extracted from the notebook |
| `HoracioLaphitz/PredicePrecioAcciones` | `main` | None (notebook only) | Commit `dashboard-data/precios_pred.csv` (date, actual, predicted) extracted from the notebook |

Note: `raw.githubusercontent.com` serves with open CORS and does not count against the authenticated GitHub API rate limit.

## Architecture

New dependencies: `recharts` (charts), `d3-dsv` (CSV parsing — handles quoted fields).

```
src/domain/dashboards/
  types.ts                  → row types per data source, KPI/series types
  aggregations.ts           → pure functions: derive KPIs and chart series from parsed rows

src/infrastructure/github/
  github-raw.ts             → fetchGithubRaw(repo, branch, path): fetch + 10s timeout
  parsers.ts                → CSV (d3-dsv) and JSON parsing + shape validation guards
  cache.ts                  → sessionStorage cache, 15 min TTL

src/presentation/components/dashboards/
  shared/                   → DashboardShell, KpiCard, ChartCard, LoadingSkeleton, ErrorState
  MarketBasketDashboard.tsx
  EcommerceExecutiveDashboard.tsx
  BancosFinancieroDashboard.tsx
  AccionesFinancieroDashboard.tsx
  registry.ts               → slug → lazy dashboard component map
  ProjectDashboard.tsx      → looks up registry by slug, renders match or null
  useGithubData.ts          → hook: cache → fetch → parse → validate → state (loading/error/data)
```

Mounting: `src/pages/proyectos/[slug].astro` renders `<ProjectDashboard client:visible slug={proyecto.slug} />`. No content schema changes; the registry maps slugs to dashboards.

### Slug → dashboard mapping

| Slug | Dashboard |
|---|---|
| `sano-y-fresco-market-basket` | MarketBasketDashboard |
| `dashboards-ventas-marketing-powerbi` | MarketBasketDashboard (reused) |
| `ai-sales-assistant` | EcommerceExecutiveDashboard |
| `nb-capitalizacion-bancos-etl` | BancosFinancieroDashboard |
| `predice-precio-acciones` | AccionesFinancieroDashboard |

## Data Flow

1. Island scrolls into view → hydrates (`client:visible`).
2. `useGithubData` checks sessionStorage cache (15 min TTL).
3. On miss: fetch from `raw.githubusercontent.com/<repo>/<branch>/<path>` with 10 s timeout.
4. Parse (d3-dsv / JSON) → validate expected columns/keys → on mismatch treat as error.
5. Aggregate via pure domain functions → render charts.
6. Error → `ErrorState` with retry button + link to the source repo. Loading → skeleton matching final layout.

## Dashboard Contents

1. **Ventas & Marketing** (Market Basket, `reglas.csv`): KPI row (rule count, max lift, avg confidence), top-10 rules by lift (bar), support × confidence scatter (point size/color = lift), product-filterable rules table.
2. **Ejecutivo Ecommerce** (`kpis_mensuales.csv` + model JSONs): KPI row (total revenue, orders, AOV, churn rate), monthly revenue line, top categories bar, churn feature importance bar, model accuracy + drift status.
3. **Financiero Bancos** (`bancos_market_cap.csv`): top-10 market cap ranking bar with currency selector (USD/GBP/EUR/INR), KPI row (leader, top-10 total).
4. **Financiero Acciones** (`precios_pred.csv`): actual vs predicted price lines with zoom/brush, KPI row (RMSE, last price).

Visual design follows the `dataviz` skill at implementation time (accessible palette, light/dark consistency, one visual system across all four).

## Error Handling

- Loading, error, and empty states in every dashboard.
- Fetch timeout 10 s; retry available from `ErrorState`.
- Shape validation failures render `ErrorState` (never a broken chart).
- A dashboard failure never breaks the article page (island is isolated below `<Content />`).

## Testing

- Vitest unit tests for parsers (valid CSV, quoted fields, malformed input) and domain aggregation functions (KPIs, series derivation) — pure functions, no mocks needed beyond fixtures.
- `useGithubData` cache behavior test (hit/miss/TTL) with mocked fetch.
- Final verification: dev server + visual check of all four dashboards (run-portfolio-astro skill).

## Implementation Phases

- **Phase 0 — repo prework:** generate and commit the three `dashboard-data/*.csv` files to their external repos (scripts/exports from existing notebooks and mart).
- **Phase 1 — foundation:** deps, infrastructure (fetch/parse/cache), domain types + aggregations, shared UI, registry + mount point, tests.
- **Phase 2 — dashboards:** the four dashboard components, wired to real data.
- **Phase 3 — verification:** tests green, `pnpm validate`, visual verification, deploy.
