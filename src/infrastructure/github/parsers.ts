import { dsvFormat } from "d3-dsv";
import type {
    AssociationRule,
    BankMarketCap,
    CategoryRevenue,
    MonthlyKpi,
    PricePoint,
} from "@domain/dashboards/types";

export class ParseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ParseError";
    }
}

function parseRows(
    text: string,
    delimiter: string,
    required: string[]
): Record<string, string | undefined>[] {
    const parsed = dsvFormat(delimiter).parse(text.trim());
    const columns = parsed.columns ?? [];
    const missing = required.filter((column) => !columns.includes(column));
    if (missing.length > 0) {
        throw new ParseError(`Missing columns: ${missing.join(", ")}`);
    }
    return parsed;
}

/** Accepts "3,4" (decimal comma) and "3.4" (decimal dot). */
function toNumber(raw: string | undefined): number {
    const value = Number((raw ?? "").replace(",", "."));
    if ((raw ?? "") === "" || Number.isNaN(value)) {
        throw new ParseError(`Invalid number: "${raw ?? ""}"`);
    }
    return value;
}

export function parseReglas(text: string): AssociationRule[] {
    const required = ["antecedente", "consecuente", "soporte_a", "confianza", "lift"];
    return parseRows(text, ";", required).map((row) => ({
        antecedent: row.antecedente ?? "",
        consequent: row.consecuente ?? "",
        support: toNumber(row.soporte_a),
        confidence: toNumber(row.confianza),
        lift: toNumber(row.lift),
    }));
}

export function parseKpisMensuales(text: string): MonthlyKpi[] {
    return parseRows(text, ",", ["mes", "ingresos", "pedidos", "aov"]).map(
        (row) => ({
            month: row.mes ?? "",
            revenue: toNumber(row.ingresos),
            orders: toNumber(row.pedidos),
            aov: toNumber(row.aov),
        })
    );
}

export function parseTopCategorias(text: string): CategoryRevenue[] {
    return parseRows(text, ",", ["categoria", "ingresos"]).map((row) => ({
        category: row.categoria ?? "",
        revenue: toNumber(row.ingresos),
    }));
}

export function parseBancos(text: string): BankMarketCap[] {
    const required = [
        "Name",
        "MC_USD_Billion",
        "MC_GBP_Billion",
        "MC_EUR_Billion",
        "MC_INR_Billion",
    ];
    return parseRows(text, ",", required).map((row) => ({
        name: row.Name ?? "",
        usd: toNumber(row.MC_USD_Billion),
        gbp: toNumber(row.MC_GBP_Billion),
        eur: toNumber(row.MC_EUR_Billion),
        inr: toNumber(row.MC_INR_Billion),
    }));
}

export function parsePrecios(text: string): PricePoint[] {
    return parseRows(text, ",", ["fecha", "real", "prediccion"]).map((row) => ({
        date: row.fecha ?? "",
        actual: toNumber(row.real),
        predicted: toNumber(row.prediccion),
    }));
}

/**
 * Python's json.dump writes bare Infinity/-Infinity/NaN tokens
 * (e.g. models/drift_reference.json) which JSON.parse rejects.
 * Replace them with null before parsing.
 */
export function parseJsonRecord<T extends object>(
    text: string,
    requiredKeys: string[]
): T {
    const sanitized = text
        .replace(/-?Infinity/g, "null")
        .replace(/\bNaN\b/g, "null");
    let value: unknown;
    try {
        value = JSON.parse(sanitized);
    } catch {
        throw new ParseError("Invalid JSON payload");
    }
    if (typeof value !== "object" || value === null) {
        throw new ParseError("Expected a JSON object");
    }
    const missing = requiredKeys.filter((key) => !(key in value));
    if (missing.length > 0) {
        throw new ParseError(`Missing keys: ${missing.join(", ")}`);
    }
    return value as T;
}
