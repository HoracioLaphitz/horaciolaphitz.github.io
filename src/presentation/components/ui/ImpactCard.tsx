/**
 * ImpactCard Component
 * Visualiza métricas de impacto de proyectos
 * Nueva Identidad: Data & Strategy
 */

interface ImpactCardProps {
  label: string;
  value: string;
  icon?: string;
  variant?: "primary" | "accent" | "secondary";
}

export function ImpactCard({
  label,
  value,
  icon = "📊",
  variant = "primary",
}: ImpactCardProps) {
  const valueColor = {
    primary: "text-accent-primary",
    accent: "text-skin-text",
    secondary: "text-skin-text",
  };

  return (
    <div
      className="
        bg-skin-primary
        border border-skin-border
        rounded-xl p-lg
        transition-all duration-200
        hover:border-skin-border-medium
        flex flex-col items-center justify-center
        min-h-[120px]
      "
    >
      <div className="text-2xl mb-sm text-skin-muted">{icon}</div>
      <div className={`text-3xl font-bold font-display mb-xs ${valueColor[variant]}`}>{value}</div>
      <div className="text-sm font-medium text-skin-muted text-center">{label}</div>
    </div>
  );
}
