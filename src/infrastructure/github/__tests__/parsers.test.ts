import {
    ParseError,
    parseReglas,
    parseKpisMensuales,
    parseTopCategorias,
    parseBancos,
    parsePrecios,
    parseJsonRecord,
} from "../parsers";

describe("parseReglas", () => {
    const header =
        "antecedente;consecuente;soporte_a;confianza;lift;id_producto_a;id_seccion_a;id_departamento_a";

    it("parses semicolon-delimited rows with decimal commas", () => {
        const text = `${header}\nCebolla Roja Orgánica;Cilantro Orgánico;3,4;12,8;3,6;8518;83;4`;
        expect(parseReglas(text)).toEqual([
            {
                antecedent: "Cebolla Roja Orgánica",
                consequent: "Cilantro Orgánico",
                support: 3.4,
                confidence: 12.8,
                lift: 3.6,
            },
        ]);
    });

    it("handles quoted fields containing the delimiter", () => {
        const text = `${header}\n"Apio; en Rama";Zanahorias;3,4;12,0;3,3;1;2;3`;
        expect(parseReglas(text)[0].antecedent).toBe("Apio; en Rama");
    });

    it("throws ParseError when required columns are missing", () => {
        expect(() => parseReglas("foo;bar\n1;2")).toThrow(ParseError);
    });

    it("throws ParseError on non-numeric values", () => {
        const text = `${header}\nA;B;abc;12,8;3,6;1;2;3`;
        expect(() => parseReglas(text)).toThrow(ParseError);
    });
});

describe("parseKpisMensuales", () => {
    it("parses comma-delimited rows with dot decimals", () => {
        const text = "mes,ingresos,pedidos,aov\n2017-01,1500.5,12,125.04";
        expect(parseKpisMensuales(text)).toEqual([
            { month: "2017-01", revenue: 1500.5, orders: 12, aov: 125.04 },
        ]);
    });
});

describe("parseTopCategorias", () => {
    it("parses category revenue rows", () => {
        const text = "categoria,ingresos\ncama_mesa_banho,1036988.68";
        expect(parseTopCategorias(text)).toEqual([
            { category: "cama_mesa_banho", revenue: 1036988.68 },
        ]);
    });
});

describe("parseBancos", () => {
    it("parses the Banks_Project final DataFrame export", () => {
        const text =
            "Name,MC_USD_Billion,MC_GBP_Billion,MC_EUR_Billion,MC_INR_Billion\n" +
            "JPMorgan Chase,432.92,346.34,402.62,35910.71";
        expect(parseBancos(text)).toEqual([
            {
                name: "JPMorgan Chase",
                usd: 432.92,
                gbp: 346.34,
                eur: 402.62,
                inr: 35910.71,
            },
        ]);
    });
});

describe("parsePrecios", () => {
    it("parses actual vs predicted price rows", () => {
        const text = "fecha,real,prediccion\n2024-01-02,187.15,185.9";
        expect(parsePrecios(text)).toEqual([
            { date: "2024-01-02", actual: 187.15, predicted: 185.9 },
        ]);
    });
});

describe("parseJsonRecord", () => {
    it("parses a valid JSON object and validates required keys", () => {
        const result = parseJsonRecord<{ churn_rate: number }>(
            '{"churn_rate": 0.48}',
            ["churn_rate"]
        );
        expect(result.churn_rate).toBeCloseTo(0.48, 5);
    });

    it("sanitizes bare Infinity tokens (drift_reference.json format)", () => {
        const text = '{"edges": {"recency_days": [-Infinity, 2.0, Infinity]}}';
        const result = parseJsonRecord<{ edges: Record<string, unknown> }>(
            text,
            ["edges"]
        );
        expect(Object.keys(result.edges)).toEqual(["recency_days"]);
    });

    it("throws ParseError when required keys are missing", () => {
        expect(() => parseJsonRecord("{}", ["edges"])).toThrow(ParseError);
    });

    it("throws ParseError on invalid JSON", () => {
        expect(() => parseJsonRecord("not json", [])).toThrow(ParseError);
    });
});
