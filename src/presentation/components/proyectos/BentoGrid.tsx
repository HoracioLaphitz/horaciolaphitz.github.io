import { useState } from 'react';
import type { ReactNode } from 'react';

/**
 * TÉCNICA 1: BENTO GRID 2.0
 * Sistema modular de bloques de distintos tamaños para organizar proyectos,
 * tecnologías y estadísticas con jerarquía visual clara.
 */

type GridSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type GridVariant = 'primary' | 'secondary' | 'accent' | 'muted';

interface BentoItemProps {
    size?: GridSize;
    variant?: GridVariant;
    children: ReactNode;
    className?: string;
    interactive?: boolean;
}

interface BentoGridProps {
    children: ReactNode;
    columns?: 2 | 3 | 4;
    gap?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses: Record<GridSize, string> = {
    sm: 'col-span-1 row-span-1',
    md: 'col-span-1 md:col-span-2 row-span-1',
    lg: 'col-span-1 md:col-span-2 row-span-2',
    xl: 'col-span-1 md:col-span-3 row-span-2',
    full: 'col-span-full row-span-1',
};

const variantClasses: Record<GridVariant, string> = {
    primary: 'bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 border-brand-primary/20',
    secondary: 'bg-skin-surface border-skin-border',
    accent: 'bg-gradient-to-br from-accent-primary/10 to-accent-primary/5 border-accent-primary/20',
    muted: 'bg-skin-secondary/50 border-skin-border/50',
};

export function BentoItem({
    size = 'sm',
    variant = 'secondary',
    children,
    className = '',
    interactive = false,
}: BentoItemProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        border rounded-2xl p-lg
        transition-all duration-300
        ${interactive ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg' : ''}
        ${className}
      `}
            onMouseEnter={() => interactive && setIsHovered(true)}
            onMouseLeave={() => interactive && setIsHovered(false)}
            style={{
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
            }}
        >
            {children}
        </div>
    );
}

export function BentoGrid({
    children,
    columns = 4,
    gap = 'md',
    className = '',
}: BentoGridProps) {
    const gapClasses = {
        sm: 'gap-sm',
        md: 'gap-md',
        lg: 'gap-lg',
    };

    return (
        <div
            className={`
        grid
        grid-cols-1
        md:grid-cols-${columns}
        ${gapClasses[gap]}
        auto-rows-[minmax(200px,auto)]
        ${className}
      `}
        >
            {children}
        </div>
    );
}

// Componentes especializados para el Bento Grid

interface ProjectHighlightProps {
    title: string;
    description: string;
    category: string;
    tags: string[];
    metrics?: { label: string; value: string }[];
    image?: string;
    href: string;
}

export function ProjectHighlight({
    title,
    description,
    category,
    tags,
    metrics,

    href,
}: ProjectHighlightProps) {
    return (
        <BentoItem size="xl" variant="primary" interactive>
            <a href={href} className="block h-full flex flex-col">
                {/* Etiqueta técnica */}
                <div className="flex items-center justify-between mb-md">
                    <span className="text-xs font-mono text-skin-muted uppercase tracking-wider">
                        SEC_01 // FEATURED
                    </span>
                    <span className="text-xs font-medium text-brand-primary uppercase tracking-wide">
                        {category}
                    </span>
                </div>

                {/* Título */}
                <h3 className="text-2xl font-bold text-skin-primary mb-sm leading-tight">
                    {title}
                </h3>

                {/* Descripción */}
                <p className="text-sm text-skin-muted mb-md leading-relaxed flex-grow">
                    {description}
                </p>

                {/* Métricas */}
                {metrics && metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-sm mb-md">
                        {metrics.map((metric, idx) => (
                            <div key={idx} className="bg-skin-surface/50 rounded-lg p-sm">
                                <div className="text-xs text-skin-muted mb-xs">{metric.label}</div>
                                <div className="text-lg font-bold text-brand-primary">{metric.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-xs">
                    {tags.slice(0, 4).map((tag, idx) => (
                        <span
                            key={idx}
                            className="text-xs px-sm py-xs bg-brand-primary/10 text-brand-primary rounded-md font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </a>
        </BentoItem>
    );
}

interface TechStackBlockProps {
    title: string;
    technologies: string[];
    icon?: ReactNode;
}

export function TechStackBlock({ title, technologies, icon }: TechStackBlockProps) {
    return (
        <BentoItem size="sm" variant="muted">
            <div className="flex flex-col h-full">
                {/* Header con icono */}
                <div className="flex items-center gap-sm mb-md">
                    {icon && <div className="text-brand-primary">{icon}</div>}
                    <h4 className="text-sm font-bold text-skin-primary uppercase tracking-wide">
                        {title}
                    </h4>
                </div>

                {/* Lista de tecnologías */}
                <ul className="space-y-xs flex-grow">
                    {technologies.map((tech, idx) => (
                        <li key={idx} className="text-xs text-skin-muted flex items-center gap-xs">
                            <span className="w-1 h-1 bg-brand-primary rounded-full"></span>
                            {tech}
                        </li>
                    ))}
                </ul>
            </div>
        </BentoItem>
    );
}

interface StatBlockProps {
    label: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export function StatBlock({ label, value, change, trend }: StatBlockProps) {
    const trendColors = {
        up: 'text-green-500',
        down: 'text-red-500',
        neutral: 'text-skin-muted',
    };

    return (
        <BentoItem size="sm" variant="accent">
            <div className="flex flex-col justify-between h-full">
                <div className="text-xs text-skin-muted uppercase tracking-wide mb-sm">
                    {label}
                </div>
                <div className="text-3xl font-bold text-skin-primary mb-xs">{value}</div>
                {change && trend && (
                    <div className={`text-xs font-medium ${trendColors[trend]}`}>
                        {trend === 'up' && '↑ '}
                        {trend === 'down' && '↓ '}
                        {change}
                    </div>
                )}
            </div>
        </BentoItem>
    );
}

interface QuickLinkBlockProps {
    title: string;
    description: string;
    href: string;
    icon?: ReactNode;
}

export function QuickLinkBlock({ title, description, href, icon }: QuickLinkBlockProps) {
    return (
        <BentoItem size="md" variant="secondary" interactive>
            <a href={href} className="block h-full flex flex-col">
                {icon && <div className="text-brand-primary mb-md">{icon}</div>}
                <h4 className="text-lg font-bold text-skin-primary mb-sm">{title}</h4>
                <p className="text-sm text-skin-muted leading-relaxed flex-grow">
                    {description}
                </p>
                <div className="flex items-center gap-xs text-brand-primary text-sm font-medium mt-md">
                    Ver más
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </a>
        </BentoItem>
    );
}
