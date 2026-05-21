import { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectFilters } from './ProjectFilters';

interface Project {
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

interface ProjectsGridProps {
    projects: Project[];
    showFilters?: boolean;
}

export function ProjectsGrid({ projects, showFilters = true }: ProjectsGridProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showFeaturedOnly, setShowFeaturedOnly] = useState<boolean | null>(null);

    const categories = useMemo(
        () => {
            const safeProjects = projects || [];
            return Array.from(new Set(safeProjects.map(p => p.category))).sort();
        },
        [projects]
    );

    const filteredProjects = useMemo(() => {
        const safeProjects = projects || [];
        return safeProjects.filter(project => {
            if (selectedCategory && project.category !== selectedCategory) return false;
            if (showFeaturedOnly === true && !project.featured) return false;
            return true;
        });
    }, [projects, selectedCategory, showFeaturedOnly]);

    const projectsByCategory = useMemo(() => {
        const grouped: Record<string, Project[]> = {};
        filteredProjects.forEach(project => {
            if (!grouped[project.category]) grouped[project.category] = [];
            grouped[project.category].push(project);
        });
        return grouped;
    }, [filteredProjects]);

    const sortedCategories = useMemo(
        () => Object.keys(projectsByCategory).sort(),
        [projectsByCategory]
    );

    return (
        <section className="py-4xl px-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 -left-20 w-80 h-80 bg-accent/3 rounded-full blur-[140px]" />
                <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-accent/2 rounded-full blur-[160px]" />
            </div>
            <div className="container relative">
                <div className="mb-4xl">
                    <h2 className="text-4xl font-bold mb-lg">
                        <span className="bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">Mis Proyectos</span>
                    </h2>
                    <p className="text-text-secondary text-sm">
                        {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {showFilters && (
                    <ProjectFilters
                        categories={categories}
                        onCategoryChange={setSelectedCategory}
                        onFeaturedChange={setShowFeaturedOnly}
                    />
                )}

                {filteredProjects.length === 0 ? (
                    <div className="text-center py-4xl">
                        <p className="text-text-secondary text-sm">
                            No se encontraron proyectos con los filtros seleccionados.
                        </p>
                    </div>
                ) : (
                    sortedCategories.map(category => (
                        <div key={category} className="mb-4xl last:mb-0">
                            <div className="flex items-center gap-3 mb-lg">
                                <h3 className="text-lg font-semibold capitalize">{category}</h3>
                                <span className="text-xs text-text-tertiary bg-border/30 px-2 py-0.5 rounded-full">
                                    {projectsByCategory[category].length}
                                </span>
                                <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                                {projectsByCategory[category].map((project, idx) => (
                                    <div
                                        key={project.slug}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <ProjectCard {...project} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
