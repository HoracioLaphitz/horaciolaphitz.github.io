import type {
    AssociationRule,
    BankMarketCap,
    Currency,
    FeatureImportanceEntry,
    MonthlyKpi,
    PricePoint,
} from "./types";

export function ruleKpis(rules: AssociationRule[]): {
    ruleCount: number;
    maxLift: number;
    avgConfidence: number;
} {
    if (rules.length === 0) {
        return { ruleCount: 0, maxLift: 0, avgConfidence: 0 };
    }
    const maxLift = Math.max(...rules.map((r) => r.lift));
    const avgConfidence =
        rules.reduce((sum, r) => sum + r.confidence, 0) / rules.length;
    return { ruleCount: rules.length, maxLift, avgConfidence };
}

export function topRulesByLift(
    rules: AssociationRule[],
    limit = 10
): AssociationRule[] {
    return [...rules].sort((a, b) => b.lift - a.lift).slice(0, limit);
}

export function ecommerceKpis(months: MonthlyKpi[]): {
    totalRevenue: number;
    totalOrders: number;
    avgAov: number;
} {
    if (months.length === 0) {
        return { totalRevenue: 0, totalOrders: 0, avgAov: 0 };
    }
    const totalRevenue = months.reduce((sum, m) => sum + m.revenue, 0);
    const totalOrders = months.reduce((sum, m) => sum + m.orders, 0);
    const avgAov = months.reduce((sum, m) => sum + m.aov, 0) / months.length;
    return { totalRevenue, totalOrders, avgAov };
}

export function topFeatures(
    importance: Record<string, number>,
    limit = 8
): FeatureImportanceEntry[] {
    return Object.entries(importance)
        .map(([feature, value]) => ({ feature, importance: value }))
        .sort((a, b) => b.importance - a.importance)
        .slice(0, limit);
}

export function bankRanking(
    banks: BankMarketCap[],
    currency: Currency,
    limit = 10
): BankMarketCap[] {
    return [...banks].sort((a, b) => b[currency] - a[currency]).slice(0, limit);
}

export function bancosKpis(
    banks: BankMarketCap[],
    currency: Currency
): { leaderName: string; leaderValue: number; topTotal: number } {
    const ranked = bankRanking(banks, currency);
    if (ranked.length === 0) {
        return { leaderName: "", leaderValue: 0, topTotal: 0 };
    }
    const leader = ranked[0];
    const topTotal = ranked.reduce((sum, b) => sum + b[currency], 0);
    return { leaderName: leader.name, leaderValue: leader[currency], topTotal };
}

export function accionesKpis(points: PricePoint[]): {
    rmse: number;
    lastActual: number;
    lastPredicted: number;
} {
    if (points.length === 0) {
        return { rmse: 0, lastActual: 0, lastPredicted: 0 };
    }
    const mse =
        points.reduce((sum, p) => sum + (p.actual - p.predicted) ** 2, 0) /
        points.length;
    const last = points[points.length - 1];
    return {
        rmse: Math.sqrt(mse),
        lastActual: last.actual,
        lastPredicted: last.predicted,
    };
}
