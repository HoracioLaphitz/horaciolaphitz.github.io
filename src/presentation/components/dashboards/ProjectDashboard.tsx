import { Suspense } from "react";
import { dashboardRegistry } from "./registry";
import type { DashboardSlug } from "./dashboard-slugs";
import { LoadingSkeleton } from "./shared/LoadingSkeleton";

export function ProjectDashboard({ slug }: { slug: string }) {
    const Dashboard = dashboardRegistry[slug as DashboardSlug];
    if (!Dashboard) return null;
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <Dashboard />
        </Suspense>
    );
}
