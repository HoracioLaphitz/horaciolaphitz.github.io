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
                {/* Header */}
                <div className="mb-4xl">
                    <div className="flex items-center gap-md mb-lg">
                        <span className="inline-block px-md py-xs bg-light-border dark:bg-dark-border rounded font-medium capitalize">
                            {category}
                        </span>
                        {featured && (
                            <span className="inline-block px-md py-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded font-medium">
                                ⭐ Featured
                            </span>
                        )}
                        {status && (
                            <span className="inline-block px-md py-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-medium capitalize">
                                {status}
                            </span>
                        )}
                    </div>
                    <h1 className="text-5xl font-bold mb-md">{title}</h1>
                    <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
                        {description}
                    </p>
                </div>

                {/* Navigation */}
                <div className="mb-4xl">
                    <a href="/proyectos" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-semibold">
                        ← Volver a Proyectos
                    </a>
                </div>

                {/* Main Content */}
                <div className="prose prose-invert max-w-none dark:prose-invert mb-4xl">
                    {long_description && (
                        <div className="mb-4xl p-lg bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
                            <h2 className="text-2xl font-bold mb-md">Descripción</h2>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap">
                                {long_description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Highlights */}
                {highlights.length > 0 && (
                    <div className="mb-4xl">
                        <h2 className="text-2xl font-bold mb-lg">Características Destacadas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                            {highlights.map((highlight, idx) => (
                                <div
                                    key={idx}
                                    className="p-md bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border"
                                >
                                    <div className="flex items-start gap-md">
                                        <span className="text-xl">✓</span>
                                        <span className="font-medium">{highlight}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Technologies */}
                {technologies.length > 0 && (
                    <div className="mb-4xl">
                        <h2 className="text-2xl font-bold mb-lg">Stack Tecnológico</h2>
                        <div className="flex flex-wrap gap-md">
                            {technologies.map((tech, idx) => (
                                <div
                                    key={idx}
                                    className="px-lg py-md bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold"
                                >
                                    {tech.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-4xl pt-4xl border-t border-light-border dark:border-dark-border">
                    <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-lg rounded-lg text-center">
                        <p className="mb-md text-light-text-secondary dark:text-dark-text-secondary">
                            ¿Te interesa este proyecto o tienes alguna pregunta?
                        </p>
                        <a href="/contacto" className="inline-block px-lg py-md bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors">
                            Contáctame
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
}
