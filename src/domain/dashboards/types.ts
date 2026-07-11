export interface AssociationRule {
    antecedent: string;
    consequent: string;
    /** Percentage 0-100 */
    support: number;
    /** Percentage 0-100 */
    confidence: number;
    lift: number;
}

export interface MonthlyKpi {
    /** YYYY-MM */
    month: string;
    revenue: number;
    orders: number;
    aov: number;
}

export interface CategoryRevenue {
    category: string;
    revenue: number;
}

export type Currency = "usd" | "gbp" | "eur" | "inr";

export interface BankMarketCap {
    name: string;
    /** Market cap in billions per currency */
    usd: number;
    gbp: number;
    eur: number;
    inr: number;
}

export interface PricePoint {
    /** YYYY-MM-DD */
    date: string;
    actual: number;
    predicted: number;
}

export interface FeatureImportanceEntry {
    feature: string;
    importance: number;
}
