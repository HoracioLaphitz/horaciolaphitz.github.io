interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: string;
}

function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-xs p-md bg-skin-surface border border-skin-border rounded-lg hover:border-skin-accent transition-colors">
      {icon && <span className="text-2xl">{icon}</span>}
      <span className="text-sm text-skin-muted">{label}</span>
      <span className="text-xl font-semibold text-skin-primary">{value}</span>
    </div>
  );
}

interface ProjectMetricsProps {
  metrics: Array<{
    label: string;
    value: string | number;
    icon?: string;
  }>;
}

export function ProjectMetrics({ metrics }: ProjectMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-md my-lg">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
