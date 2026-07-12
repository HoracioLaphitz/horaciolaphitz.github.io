/**
 * Per-project visual identity. Chart marks need literal colors
 * (SVG attributes do not resolve CSS var()); all values below are
 * legible on both light and dark backgrounds.
 */
export interface DashboardTheme {
    accent: string;
    accentSoft: string;
    series: string[];
    positive: string;
    negative: string;
    axis: string;
    grid: string;
}

const NEUTRAL_AXIS = "#8b95a5";
const NEUTRAL_GRID = "rgba(148, 163, 184, 0.25)";

/** SanoYFresco grocery — fresh produce greens. */
export const marketBasketTheme: DashboardTheme = {
    accent: "#16a34a",
    accentSoft: "rgba(22, 163, 74, 0.12)",
    series: ["#16a34a", "#65a30d", "#0d9488", "#84cc16", "#15803d"],
    positive: "#16a34a",
    negative: "#dc2626",
    axis: NEUTRAL_AXIS,
    grid: NEUTRAL_GRID,
};

/** Olist executive reporting — deep teal/blue corporate. */
export const ecommerceTheme: DashboardTheme = {
    accent: "#0e7490",
    accentSoft: "rgba(14, 116, 144, 0.12)",
    series: ["#0e7490", "#0f766e", "#2563eb", "#06b6d4", "#1e40af"],
    positive: "#0f766e",
    negative: "#dc2626",
    axis: NEUTRAL_AXIS,
    grid: NEUTRAL_GRID,
};

/** Banking — navy + gold, institutional. */
export const bancosTheme: DashboardTheme = {
    accent: "#1e3a8a",
    accentSoft: "rgba(30, 58, 138, 0.10)",
    series: ["#1e3a8a", "#d97706", "#475569", "#92400e", "#64748b"],
    positive: "#1e3a8a",
    negative: "#b45309",
    axis: NEUTRAL_AXIS,
    grid: NEUTRAL_GRID,
};

/** Stock market — green/red on dark terminal surface. */
export const accionesTheme: DashboardTheme = {
    accent: "#22c55e",
    accentSoft: "rgba(34, 197, 94, 0.12)",
    series: ["#22c55e", "#ef4444", "#eab308", "#38bdf8", "#a78bfa"],
    positive: "#22c55e",
    negative: "#ef4444",
    axis: "#64748b",
    grid: "rgba(100, 116, 139, 0.25)",
};

/** Terminal surface used by the Acciones dashboard chart cards. */
export const TERMINAL_SURFACE = "#0b1220";
