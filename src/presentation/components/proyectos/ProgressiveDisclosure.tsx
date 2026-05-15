import { useState } from 'react';
import type { ReactNode } from 'react';

/**
 * TÉCNICA 3: DIVULGACIÓN PROGRESIVA
 * Muestra lo esencial y permite "hacer zoom" para profundidad técnica.
 * Mantiene estética sobria mientras ofrece detalles bajo demanda.
 */

interface ExpandableSectionProps {
    title: string;
    summary: string;
    children: ReactNode;
    defaultExpanded?: boolean;
    variant?: 'default' | 'technical' | 'analysis';
    className?: string;
}

export function ExpandableSection({
    title,
    summary,
    children,
    defaultExpanded = false,
    variant = 'default',
    className = '',
}: ExpandableSectionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const variantStyles = {
        default: 'border-skin-border bg-skin-surface',
        technical: 'border-brand-primary/20 bg-brand-primary/5',
        analysis: 'border-accent-primary/20 bg-accent-primary/5',
    };

    return (
        <div className={`border rounded-xl overflow-hidden ${variantStyles[variant]} ${className}`}>
            {/* Header colapsable */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-lg text-left hover:bg-skin-surface/50 transition-colors"
            >
                <div className="flex items-start justify-between gap-md">
                    <div className="flex-grow">
                        <h3 className="text-lg font-bold text-skin-primary mb-xs">{title}</h3>
                        <p className="text-sm text-skin-muted leading-relaxed">{summary}</p>
                    </div>
                    <div
                        className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-brand-primary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </div>
            </button>

            {/* Contenido expandible */}
            <div
                className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-lg pt-0 border-t border-skin-border/50">{children}</div>
            </div>
        </div>
    );
}

interface TechnicalDeepDiveProps {
    title: string;
    overview: string;
    challenges: string[];
    solutions: string[];
    results?: string[];
    className?: string;
}

export function TechnicalDeepDive({
    title,
    overview,
    challenges,
    solutions,
    results,
    className = '',
}: TechnicalDeepDiveProps) {
    return (
        <ExpandableSection
            title={title}
            summary={overview}
            variant="technical"
            className={className}
        >
            <div className="space-y-lg">
                {/* Retos técnicos */}
                <div>
                    <h4 className="text-sm font-bold text-skin-primary uppercase tracking-wide mb-sm">
                        Retos Técnicos
                    </h4>
                    <ul className="space-y-sm">
                        {challenges.map((challenge, idx) => (
                            <li key={idx} className="flex items-start gap-sm text-sm text-skin-muted">
                                <span className="text-red-500 mt-1">⚠</span>
                                <span>{challenge}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Soluciones implementadas */}
                <div>
                    <h4 className="text-sm font-bold text-skin-primary uppercase tracking-wide mb-sm">
                        Soluciones Implementadas
                    </h4>
                    <ul className="space-y-sm">
                        {solutions.map((solution, idx) => (
                            <li key={idx} className="flex items-start gap-sm text-sm text-skin-muted">
                                <span className="text-green-500 mt-1">✓</span>
                                <span>{solution}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Resultados (opcional) */}
                {results && results.length > 0 && (
                    <div>
                        <h4 className="text-sm font-bold text-skin-primary uppercase tracking-wide mb-sm">
                            Resultados
                        </h4>
                        <ul className="space-y-sm">
                            {results.map((result, idx) => (
                                <li key={idx} className="flex items-start gap-sm text-sm text-skin-muted">
                                    <span className="text-brand-primary mt-1">→</span>
                                    <span>{result}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </ExpandableSection>
    );
}

interface DocumentationLinkProps {
    title: string;
    description: string;
    href: string;
    type?: 'docs' | 'api' | 'guide' | 'reference';
    className?: string;
}

export function DocumentationLink({
    title,
    description,
    href,
    type = 'docs',
    className = '',
}: DocumentationLinkProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const typeIcons = {
        docs: '📄',
        api: '🔌',
        guide: '📖',
        reference: '📚',
    };

    const typeLabels = {
        docs: 'Documentation',
        api: 'API Reference',
        guide: 'Guide',
        reference: 'Reference',
    };

    return (
        <div
            className={`border border-skin-border rounded-lg overflow-hidden hover:border-brand-primary/50 transition-colors ${className}`}
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-md text-left hover:bg-skin-surface/50 transition-colors"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-sm">
                        <span className="text-xl">{typeIcons[type]}</span>
                        <div>
                            <div className="text-xs text-skin-muted uppercase tracking-wide mb-xs">
                                {typeLabels[type]}
                            </div>
                            <div className="text-sm font-medium text-skin-primary">{title}</div>
                        </div>
                    </div>
                    <svg
                        className={`w-5 h-5 text-brand-primary transition-transform ${isExpanded ? 'rotate-180' : ''
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-md pt-0 border-t border-skin-border/50">
                    <p className="text-sm text-skin-muted mb-md">{description}</p>
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-xs text-sm font-medium text-brand-primary hover:underline"
                    >
                        Ver documentación
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}

interface LayeredContentProps {
    layers: {
        level: 'basic' | 'intermediate' | 'advanced';
        title: string;
        content: ReactNode;
    }[];
    className?: string;
}

export function LayeredContent({ layers, className = '' }: LayeredContentProps) {
    const [activeLevel, setActiveLevel] = useState<'basic' | 'intermediate' | 'advanced'>('basic');

    const levelLabels = {
        basic: 'Resumen',
        intermediate: 'Detalles',
        advanced: 'Análisis Técnico',
    };

    const levelColors = {
        basic: 'border-green-500 bg-green-500/10 text-green-600',
        intermediate: 'border-blue-500 bg-blue-500/10 text-blue-600',
        advanced: 'border-purple-500 bg-purple-500/10 text-purple-600',
    };

    return (
        <div className={className}>
            {/* Selector de nivel */}
            <div className="flex gap-sm mb-lg">
                {layers.map((layer) => (
                    <button
                        key={layer.level}
                        onClick={() => setActiveLevel(layer.level)}
                        className={`px-md py-sm text-sm font-medium rounded-lg border-2 transition-all ${activeLevel === layer.level
                                ? levelColors[layer.level]
                                : 'border-skin-border text-skin-muted hover:border-brand-primary/50'
                            }`}
                    >
                        {levelLabels[layer.level]}
                    </button>
                ))}
            </div>

            {/* Contenido por nivel */}
            <div className="bg-skin-surface border border-skin-border rounded-xl p-lg">
                {layers.map(
                    (layer) =>
                        activeLevel === layer.level && (
                            <div key={layer.level}>
                                <h3 className="text-lg font-bold text-skin-primary mb-md">{layer.title}</h3>
                                <div className="prose prose-sm max-w-none">{layer.content}</div>
                            </div>
                        )
                )}
            </div>
        </div>
    );
}
