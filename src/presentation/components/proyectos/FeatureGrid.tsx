interface FeatureItemProps {
  title: string;
  description: string;
}

function FeatureItem({ title, description }: FeatureItemProps) {
  return (
    <div className="p-md bg-skin-surface border border-skin-border rounded-lg hover:border-skin-accent transition-colors">
      <h4 className="text-base font-semibold text-skin-primary mb-xs">{title}</h4>
      <p className="text-sm text-skin-muted">{description}</p>
    </div>
  );
}

interface FeatureGridProps {
  title?: string;
  features: Array<{
    title: string;
    description: string;
  }>;
  columns?: 1 | 2 | 3;
}

export function FeatureGrid({ title, features, columns = 2 }: FeatureGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className="my-lg">
      {title && <h3 className="text-lg font-semibold text-skin-primary mb-md">{title}</h3>}
      <div className={`grid ${gridCols[columns]} gap-md`}>
        {features.map((feature, index) => (
          <FeatureItem key={index} {...feature} />
        ))}
      </div>
    </div>
  );
}
