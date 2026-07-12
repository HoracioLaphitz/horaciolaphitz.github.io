import {
    ruleKpis,
    topRulesByLift,
    ecommerceKpis,
    topFeatures,
    bankRanking,
    bancosKpis,
    accionesKpis,
} from "../aggregations";
import type {
    AssociationRule,
    MonthlyKpi,
    BankMarketCap,
    PricePoint,
} from "../types";

const rules: AssociationRule[] = [
    { antecedent: "A", consequent: "B", support: 3.4, confidence: 12.8, lift: 3.6 },
    { antecedent: "C", consequent: "D", support: 5.5, confidence: 20.1, lift: 3.5 },
    { antecedent: "E", consequent: "F", support: 3.4, confidence: 12.0, lift: 3.3 },
];

const months: MonthlyKpi[] = [
    { month: "2017-01", revenue: 1000, orders: 10, aov: 100 },
    { month: "2017-02", revenue: 3000, orders: 20, aov: 150 },
];

const banks: BankMarketCap[] = [
    { name: "Alpha Bank", usd: 100, gbp: 80, eur: 90, inr: 8000 },
    { name: "Beta Bank", usd: 300, gbp: 240, eur: 270, inr: 24000 },
    { name: "Gamma Bank", usd: 200, gbp: 160, eur: 180, inr: 16000 },
];

const points: PricePoint[] = [
    { date: "2024-01-01", actual: 100, predicted: 110 },
    { date: "2024-01-02", actual: 200, predicted: 190 },
];

describe("ruleKpis", () => {
    it("derives count, max lift and average confidence", () => {
        const kpis = ruleKpis(rules);
        expect(kpis.ruleCount).toBe(3);
        expect(kpis.maxLift).toBeCloseTo(3.6, 5);
        expect(kpis.avgConfidence).toBeCloseTo(14.9667, 3);
    });

    it("returns zeros for empty input", () => {
        expect(ruleKpis([])).toEqual({ ruleCount: 0, maxLift: 0, avgConfidence: 0 });
    });
});

describe("topRulesByLift", () => {
    it("sorts descending by lift and limits", () => {
        const top = topRulesByLift(rules, 2);
        expect(top.map((r) => r.lift)).toEqual([3.6, 3.5]);
    });

    it("does not mutate the input array", () => {
        const copy = [...rules];
        topRulesByLift(rules, 2);
        expect(rules).toEqual(copy);
    });
});

describe("ecommerceKpis", () => {
    it("totals revenue and orders and averages AOV", () => {
        const kpis = ecommerceKpis(months);
        expect(kpis.totalRevenue).toBe(4000);
        expect(kpis.totalOrders).toBe(30);
        expect(kpis.avgAov).toBeCloseTo(125, 5);
    });
});

describe("topFeatures", () => {
    it("sorts descending by importance and limits", () => {
        const result = topFeatures({ a: 0.5, b: 0.1, c: 0.3 }, 2);
        expect(result).toEqual([
            { feature: "a", importance: 0.5 },
            { feature: "c", importance: 0.3 },
        ]);
    });
});

describe("bankRanking", () => {
    it("ranks by selected currency descending", () => {
        const ranked = bankRanking(banks, "usd", 2);
        expect(ranked.map((b) => b.name)).toEqual(["Beta Bank", "Gamma Bank"]);
    });
});

describe("bancosKpis", () => {
    it("derives leader and top total for a currency", () => {
        const kpis = bancosKpis(banks, "gbp");
        expect(kpis.leaderName).toBe("Beta Bank");
        expect(kpis.leaderValue).toBe(240);
        expect(kpis.topTotal).toBe(480);
    });
});

describe("accionesKpis", () => {
    it("computes RMSE and last actual/predicted", () => {
        const kpis = accionesKpis(points);
        expect(kpis.rmse).toBeCloseTo(10, 5);
        expect(kpis.lastActual).toBe(200);
        expect(kpis.lastPredicted).toBe(190);
    });
});
