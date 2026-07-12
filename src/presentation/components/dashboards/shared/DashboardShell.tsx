import type { ReactNode } from "react";
import type { DashboardTheme } from "../themes";

interface DashboardShellProps {
    title: string;
    subtitle: string;
    repoUrl: string;
    theme: DashboardTheme;
    children: ReactNode;
}

export function DashboardShell({
    title,
    subtitle,
    repoUrl,
    theme,
    children,
}: DashboardShellProps) {
    return (
        <section
            aria-label={title}
            className="mt-2xl rounded-md border border-skin-border bg-skin-primary p-lg"
            style={{ borderTop: `4px solid ${theme.accent}` }}
        >
            <header className="mb-lg flex flex-wrap items-end justify-between gap-sm">
                <div>
                    <h2 className="font-display text-xl font-bold text-skin-text">
                        {title}
                    </h2>
                    <p className="mt-1 text-sm text-skin-text-secondary">{subtitle}</p>
                </div>
                <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline"
                    style={{ color: theme.accent }}
                >
                    Datos en vivo desde GitHub ↗
                </a>
            </header>
            <div className="flex flex-col gap-lg">{children}</div>
        </section>
    );
}
