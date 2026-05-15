import type { ComponentType } from "react";

interface DecorativeIconProps {
  icon: ComponentType<{ className?: string }>;
  size?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
  className?: string;
}

const SIZES = {
  sm: "w-8 h-8 md:w-10 md:h-10",
  md: "w-10 h-10 md:w-12 md:h-12",
  lg: "w-12 h-12 lg:w-14 lg:h-14",
  xl: "w-14 h-14 lg:w-16 lg:h-16",
} as const;

/**
 * Componente para iconos decorativos con tamaños y opacidad consistentes
 * Sigue el sistema de diseño con tokens de espaciado
 */
export const DecorativeIcon = ({
  icon: Icon,
  size = "md",
  opacity = 0.6,
  className = "",
}: DecorativeIconProps) => {
  return (
    <div
      className={`flex-shrink-0 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <Icon className={`${SIZES[size]} text-brand-primary`} />
    </div>
  );
};
