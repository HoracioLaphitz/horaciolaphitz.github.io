interface ProjectCardProps {
    slug: string;
    title: string;
    description: string;
    category: string;
    featured?: boolean;
    status?: string;
    highlights?: string[];
    technologies?: { name: string }[];
}

export function ProjectCard({
    slug,
    title,
    description,
    category,
    featured,
    status,
    highlights = [],
    technologies = []
}: ProjectCardProps) {
    return (
        <a
            href={`/proyectos/${slug}`}
            className={`group block relative rounded-2xl overflow-hidden transition-all duration-500 ${
                featured
                    ? 'glass-card ring-1 ring-accent/30 shadow-lg shadow-accent/5'
                    : 'glass-card'
            } hover:shadow-xl hover:-translate-y-1`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="h-1.5 bg-gradient-to-r from-accent/80 via-accent/40 to-accent/10" />

            <div className="p-lg md:p-xl relative">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-lg font-semibold leading-tight flex-1">{title}</h3>
                    {featured && (
                        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            Destacado
                        </span>
                    )}
                </div>

                <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4">
                    {description}
                </p>

                {technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {technologies.slice(0, 4).map((tech, idx) => (
                            <span
                                key={idx}
                                className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-border/50 text-text-secondary group-hover:bg-accent/8 group-hover:text-accent transition-all duration-300"
                            >
                                {tech.name}
                            </span>
                        ))}
                        {technologies.length > 4 && (
                            <span className="inline-flex px-2 py-0.5 text-[11px] text-text-tertiary">
                                +{technologies.length - 4}
                            </span>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-[11px] font-medium capitalize text-text-tertiary group-hover:text-accent transition-colors duration-300">
                        {category}
                    </span>
                    <span className="text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 inline-flex items-center gap-1">
                        Ver proyecto
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </span>
                </div>
            </div>
        </a>
    );
}
