import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { DashboardSlug } from "./dashboard-slugs";

type DashboardComponent = LazyExoticComponent<ComponentType>;

export const dashboardRegistry: Record<DashboardSlug, DashboardComponent> = {
    "sano-y-fresco-market-basket": lazy(() => import("./MarketBasketDashboard")),
    "dashboards-ventas-marketing-powerbi": lazy(() => import("./MarketBasketDashboard")),
    "ai-sales-assistant": lazy(() => import("./EcommerceExecutiveDashboard")),
    "nb-capitalizacion-bancos-etl": lazy(() => import("./BancosFinancieroDashboard")),
    "predice-precio-acciones": lazy(() => import("./AccionesFinancieroDashboard")),
};
