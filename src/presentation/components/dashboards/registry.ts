import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { DashboardSlug } from "./dashboard-slugs";

type DashboardComponent = LazyExoticComponent<ComponentType>;

// Each entry is uncommented in the task that creates its component
// (Tasks 8-11). Keys must stay in sync with DASHBOARD_SLUGS.
export const dashboardRegistry: Partial<Record<DashboardSlug, DashboardComponent>> = {
    "sano-y-fresco-market-basket": lazy(() => import("./MarketBasketDashboard")),
    "dashboards-ventas-marketing-powerbi": lazy(() => import("./MarketBasketDashboard")),
    "ai-sales-assistant": lazy(() => import("./EcommerceExecutiveDashboard")),
    // "nb-capitalizacion-bancos-etl": lazy(() => import("./BancosFinancieroDashboard")),
    // "predice-precio-acciones": lazy(() => import("./AccionesFinancieroDashboard")),
};
