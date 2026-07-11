import type { DashboardTheme } from "../themes";

interface KpiCardProps {
    label: string;
    value: string;
    hint?: string;
    theme: DashboardTheme;
}

export function KpiCard({ label, value, hint, theme }: KpiCardProps) {
    return (
        <div
            className="rounded-sm border border-skin-border bg-skin-secondary p-md"
            style={{ borderLeft: `3px solid ${theme.accent}` }}
        >
            <p className="text-sm text-skin-muted">{label}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-skin-text">
                {value}
            </p>
            {hint ? (
                <p className="mt-1 text-xs text-skin-text-secondary">{hint}</p>
            ) : null}
        </div>
    );
}
