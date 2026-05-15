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
  const variantStyles = {
    primary: "bg-gradient-to-br from-[#0A74DA] to-[#085BB0] text-white",
    accent: "bg-gradient-to-br from-[#FF6B35] to-[#E65520] text-white",
    secondary: "bg-gradient-to-br from-[#2E2E2E] to-[#1A1A1A] text-white",
  };

  return (
    <div
      className={`
        ${variantStyles[variant]}
        rounded-xl p-lg
        shadow-lg
        transform transition-all duration-300
        hover:scale-105 hover:shadow-xl
        flex flex-col items-center justify-center
        min-h-[140px]
      `}
    >
      <div className="text-4xl mb-sm">{icon}</div>
      <div className="text-3xl font-bold font-display mb-xs">{value}</div>
      <div className="text-sm font-medium opacity-90 text-center">{label}</div>
    </div>
  );
}
