interface ProjectDetailProps {
    slug: string;
    title: string;
    description: string;
    long_description?: string;
    category: string;
    featured?: boolean;
    status?: string;
    highlights?: string[];
    technologies?: { name: string }[];
}

export function ProjectDetail({
    slug,
    title,
    description,
    long_description,
    category,
    featured,
    status,
    highlights = [],
    technologies = []
}: ProjectDetailProps) {
    return (
        <article className="py-4xl px-4">
            <div className="container max-w-4xl">
                <div className="mb-4xl">
                    <div className="flex items-center gap-md mb-lg">
                        <span className="inline-block px-3 py-1 rounded-lg text-xs font-medium capitalize border border-border text-text-secondary">
                            {category}
                        </span>
                        {featured && (
                            <span className="inline-block px-3 py-1 rounded-lg text-xs font-medium text-accent"
                                style={{ backgroundColor: 'var(--color-accent-muted)' }}>
                                Destacado
                            </span>
                        )}
                        {status && (
                            <span className="inline-block px-3 py-1 rounded-lg text-xs font-medium capitalize"
                                style={{ backgroundColor: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}>
                                {status}
                            </span>
                        )}
                    </div>
                    <h1 className="text-5xl font-bold mb-md text-text-primary">{title}</h1>
                    <p className="text-xl text-text-secondary">{description}</p>
                </div>

                <div className="mb-4xl">
                    <a href="/proyectos" className="text-accent hover:opacity-80 font-semibold transition-opacity">
                        ← Volver a Proyectos
                    </a>
                </div>

                <div className="mb-4xl">
                    {long_description && (
                        <div className="mb-4xl p-lg rounded-xl border border-border"
                            style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                            <h2 className="text-2xl font-bold mb-md text-text-primary">Descripción</h2>
                            <p className="text-text-secondary whitespace-pre-wrap">{long_description}</p>
                        </div>
                    )}
                </div>

                {highlights.length > 0 && (
                    <div className="mb-4xl">
                        <h2 className="text-2xl font-bold mb-lg text-text-primary">Características Destacadas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                            {highlights.map((highlight, idx) => (
                                <div key={idx}
                                    className="p-md rounded-xl border border-border"
                                    style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                                    <div className="flex items-start gap-md">
                                        <span className="text-accent shrink-0">✓</span>
                                        <span className="font-medium text-text-primary">{highlight}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {technologies.length > 0 && (
                    <div className="mb-4xl">
                        <h2 className="text-2xl font-bold mb-lg text-text-primary">Stack Tecnológico</h2>
                        <div className="flex flex-wrap gap-3">
                            {technologies.map((tech, idx) => (
                                <span key={idx}
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-text-inverse"
                                    style={{ backgroundColor: 'var(--color-accent)' }}>
                                    {tech.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-4xl pt-4xl border-t border-border">
                    <div className="p-lg rounded-xl border border-border text-center"
                        style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                        <p className="mb-md text-text-secondary">
                            ¿Te interesa este proyecto o tienes alguna pregunta?
                        </p>
                        <a href="/contacto"
                            className="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-text-inverse bg-accent hover:opacity-90 transition-opacity">
                            Contáctame
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
}