interface TechStackProps {
  technologies: Array<{
    category: string;
    items: string[];
  }>;
}

export function TechStack({ technologies }: TechStackProps) {
  return (
    <div className="my-lg p-lg bg-skin-surface border border-skin-border rounded-xl">
      <h3 className="text-lg font-semibold text-skin-primary mb-md">Stack Técnico</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {technologies.map((tech, index) => (
          <div key={index} className="space-y-xs">
            <h4 className="text-sm font-medium text-skin-accent">{tech.category}</h4>
            <ul className="space-y-xs">
              {tech.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm text-skin-muted flex items-start gap-xs">
                  <span className="text-skin-accent mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
