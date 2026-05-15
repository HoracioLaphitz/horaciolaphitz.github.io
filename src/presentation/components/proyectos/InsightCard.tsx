interface InsightCardProps {
  title: string;
  description: string;
  metric?: string;
  variant?: 'default' | 'highlight';
}

export function InsightCard({ title, description, metric, variant = 'default' }: InsightCardProps) {
  const variantStyles = {
    default: 'bg-skin-surface border-skin-border',
    highlight: 'bg-skin-accent/5 border-skin-accent',
  };

  return (
    <div className={`p-md border rounded-lg ${variantStyles[variant]} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between gap-md">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-skin-primary mb-xs">{title}</h4>
          <p className="text-sm text-skin-muted">{description}</p>
        </div>
        {metric && (
          <div className="text-right">
            <span className="text-2xl font-bold text-skin-accent">{metric}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface InsightListProps {
  insights: Array<{
    title: string;
    description: string;
    metric?: string;
    variant?: 'default' | 'highlight';
  }>;
}

export function InsightList({ insights }: InsightListProps) {
  return (
    <div className="space-y-md my-lg">
      {insights.map((insight, index) => (
        <InsightCard key={index} {...insight} />
      ))}
    </div>
  );
}
