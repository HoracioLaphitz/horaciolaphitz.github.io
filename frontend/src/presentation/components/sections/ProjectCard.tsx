interface ProjectCardProps {
    slug: string;
    title: string;
    description: string;
    category: string;
    featured?: boolean;
    technologies?: { name: string }[];
}

export function ProjectCard({
    slug,
    title,
    description,
    category,
    featured,
    technologies = []
}: ProjectCardProps) {
    return (
        <a
            href={`/proyectos/${slug}`}
            className={`group block relative rounded-xl overflow-hidden transition-all duration-300 ${
                featured
                    ? 'ring-1 ring-[#7ef9b4]/20 shadow-sm shadow-[#7ef9b4]/5'
                    : ''
            } hover:shadow-md hover:-translate-y-0.5`}
            style={{ backgroundColor: 'var(--color-surface)' }}
        >
            <div className="p-3 md:p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-sm font-semibold leading-snug flex-1 truncate">{title}</h3>
                    {featured && (
                        <svg className="w-3 h-3 shrink-0 text-[#7ef9b4]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    )}
                </div>

                <p className="text-xs text-[#c8ffb8] leading-relaxed line-clamp-1 mb-2">
                    {description}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium capitalize text-[#74f1a4]">
                        {category}
                    </span>
                    {technologies.length > 0 && (
                        <span className="flex items-center gap-1">
                            {technologies.slice(0, 2).map((tech, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#1b2838]/40 text-[#74f1a4]"
                                >
                                    {tech.name}
                                </span>
                            ))}
                            {technologies.length > 2 && (
                                <span className="text-[9px] text-[#74f1a4]">+{technologies.length - 2}</span>
                            )}
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
}
