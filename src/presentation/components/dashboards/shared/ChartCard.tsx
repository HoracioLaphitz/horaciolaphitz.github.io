import type { ReactNode } from "react";

interface ChartCardProps {
    title: string;
    children: ReactNode;
    className?: string;
}

export function ChartCard({ title, children, className = "" }: ChartCardProps) {
    return (
        <div
            className={`rounded-sm border border-skin-border bg-skin-secondary p-md ${className}`}
        >
            <h3 className="mb-sm font-display text-base font-semibold text-skin-text">
                {title}
            </h3>
            <div className="h-72 w-full">{children}</div>
        </div>
    );
}
