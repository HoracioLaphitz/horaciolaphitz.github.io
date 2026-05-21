import { ProjectCard } from './ProjectCard';

interface Project {
    slug: string;
    title: string;
    description: string;
    category: string;
    featured?: boolean;
    status?: string;
    technologies?: { name: string }[];
}

interface Props {
    posts: Project[];
}

export function ProjectCategories({ posts }: Props) {
    const categories = Array.from(new Set(posts.map(p => p.category))).sort();

    if (!posts || posts.length === 0) {
        return (
            <section id="proyectos" className="py-4xl px-4">
                <div className="container text-center">
                    <h2 className="text-4xl font-bold mb-4xl text-text-primary">Proyectos</h2>
                    <p className="text-text-secondary">Próximamente…</p>
                </div>
            </section>
        );
    }

    return (
        <section id="proyectos" className="py-4xl px-4 relative overflow-hidden"
            style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
            <div className="container relative">
                <div className="mb-4xl text-center">
                    <h2 className="text-4xl font-bold mb-md text-text-primary">Proyectos</h2>
                    <p className="text-text-secondary text-sm max-w-lg mx-auto">
                        Una selección de proyectos que reflejan mi experiencia en datos, desarrollo y diseño.
                    </p>
                </div>

                {categories.map((category, catIdx) => {
                    const categoryProjects = posts.filter(p => p.category === category);
                    return (
                        <div key={category} className="mb-4xl last:mb-0">
                            <div className="flex items-center gap-3 mb-lg">
                                <h3 className="text-lg font-semibold capitalize text-text-primary">{category}</h3>
                                <span className="text-xs text-text-tertiary bg-border/30 px-2 py-0.5 rounded-full">
                                    {categoryProjects.length}
                                </span>
                                <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                                {categoryProjects.map((project, idx) => (
                                    <div
                                        key={project.slug}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <ProjectCard
                                            slug={project.slug}
                                            title={project.title}
                                            description={project.description}
                                            category={project.category}
                                            featured={project.featured}
                                            status={project.status}
                                            technologies={project.technologies}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}