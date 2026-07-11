import { Suspense } from "react";
import { dashboardRegistry } from "./registry";
import type { DashboardSlug } from "./dashboard-slugs";
import { LoadingSkeleton } from "./shared/LoadingSkeleton";

export function ProjectDashboard({ slug }: { slug: string }) {
    const Dashboard =
        slug in dashboardRegistry
            ? dashboardRegistry[slug as DashboardSlug]
            : null;
    if (!Dashboard) return null;
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <Dashboard />
        </Suspense>
    );
}
