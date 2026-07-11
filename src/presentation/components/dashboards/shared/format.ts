const compact = new Intl.NumberFormat("es-AR", {
    notation: "compact",
    maximumFractionDigits: 1,
});

const decimal = new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 2,
});

export function formatCompact(value: number): string {
    return compact.format(value);
}

export function formatDecimal(value: number): string {
    return decimal.format(value);
}

export function formatPercent(value: number): string {
    return `${decimal.format(value)}%`;
}
