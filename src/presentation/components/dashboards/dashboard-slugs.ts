export const DASHBOARD_SLUGS = [
    "sano-y-fresco-market-basket",
    "ai-sales-assistant",
    "nb-capitalizacion-bancos-etl",
    "predice-precio-acciones",
] as const;

export type DashboardSlug = (typeof DASHBOARD_SLUGS)[number];
