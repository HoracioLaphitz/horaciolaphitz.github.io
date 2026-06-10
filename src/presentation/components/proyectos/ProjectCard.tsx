import { useState } from "react";
import { RobotIcon, ChartBarIcon, BriefcaseIcon, PresentationChartLineIcon, DocumentIcon } from "../ui/Icons";
import type { ReactElement } from "react";

interface ProjectCardProps {
    title: string;
    description: string;
    slug: string;
    category: string;
    tags: string[];
    github?: string;
    dashboard?: string;
}

const ProjectCard = ({ title, description, slug, category, tags, github, dashboard }: ProjectCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const categoryIcons: Record<string, ReactElement> = {
        "Machine Learning": <RobotIcon className="w-6 h-6" />,
        "Análisis de datos": <ChartBarIcon className="w-6 h-6" />,
        "Business Intelligence": <BriefcaseIcon className="w-6 h-6" />,
        "Data Visualization": <PresentationChartLineIcon className="w-6 h-6" />,
    };

    return (
        <article
            className="group relative bg-skin-secondary border border-skin-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-primary/50"
            style={{ boxShadow: isHovered ? 'var(--md-elevation-3)' : 'var(--md-elevation-1)' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="p-6 flex flex-col h-full">
                {/* Header con categoría */}
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary group-hover:scale-110 transition-transform duration-200">
                        {categoryIcons[category] || <DocumentIcon className="w-5 h-5" />}
                    </div>
                    <span className="text-xs font-medium text-skin-muted uppercase tracking-wide">
                        {category}
                    </span>
                </div>

                {/* Título */}
                <h3 className="text-lg font-bold text-skin-text mb-3 group-hover:text-brand-primary transition-colors duration-200 line-clamp-2">
                    {title}
                </h3>

                {/* Descripción */}
                <p className="text-sm text-skin-muted mb-4 leading-relaxed line-clamp-3 flex-grow">
                    {description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.slice(0, 3).map((tag, idx) => (
                        <span
                            key={idx}
                            className="text-xs px-3 py-1.5 bg-skin-primary text-accent-primary border-2 border-accent-primary/30 rounded-full font-medium hover:border-accent-primary hover:shadow-sm transition-all duration-200"
                        >
                            {tag}
                        </span>
                    ))}
                    {tags.length > 3 && (
                        <span className="text-xs px-3 py-1.5 bg-skin-primary text-accent-primary border-2 border-accent-primary/30 rounded-full font-medium">
                            +{tags.length - 3}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-skin-border/50">
                    {github && (
                        <a
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-skin-text hover:text-brand-primary bg-skin-primary hover:bg-brand-primary/10 rounded-lg transition-all duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            Código
                        </a>
                    )}
                    {dashboard && (
                        <a
                            href={dashboard}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-skin-text hover:text-brand-primary bg-skin-primary hover:bg-brand-primary/10 rounded-lg transition-all duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Dashboard
                        </a>
                    )}
                    <a
                        href={github || `/proyectos/${slug}`}
                        target={github ? "_blank" : undefined}
                        rel={github ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-skin-primary bg-brand-primary hover:bg-brand-hover rounded-lg transition-all duration-200 ml-auto"
                    >
                        Ver más
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-brand-primary/5"></div>
            </div>
        </article>
    );
};

export default ProjectCard;
