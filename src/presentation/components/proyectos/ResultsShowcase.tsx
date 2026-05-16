interface ResultItemProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

function ResultItem({ label, value, change, trend }: ResultItemProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-skin-muted',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <div className="p-md bg-skin-surface border border-skin-border rounded-lg">
      <p className="text-sm text-skin-muted mb-xs">{label}</p>
      <div className="flex items-baseline gap-xs">
        <span className="text-2xl font-bold text-skin-primary">{value}</span>
        {change && trend && (
          <span className={`text-sm font-medium ${trendColors[trend]}`}>
            {trendIcons[trend]} {change}
          </span>
        )}
      </div>
    </div>
  );
}

interface ResultsShowcaseProps {
  title?: string;
  results: Array<{
    label: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }>;
}

export function ResultsShowcase({ title = 'Resultados', results }: ResultsShowcaseProps) {
  return (
    <div className="my-lg">
      <h3 className="text-lg font-semibold text-skin-primary mb-md">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {results.map((result, index) => (
          <ResultItem key={index} {...result} />
        ))}
      </div>
    </div>
  );
}
