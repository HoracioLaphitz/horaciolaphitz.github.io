import { useState, useMemo } from "react";
import ProjectCard from "./ProjectCard";
import ProjectFilters from "./ProjectFilters";

interface Project {
    slug: string;
    data: {
        title: string;
        description: string;
        category: string;
        tags: string[];
        pubDate: Date;
        author: string;
        github?: string;
        dashboard?: string;
    };
}

interface ProjectIndexProps {
    projects: Project[];
}

const ProjectIndex = ({ projects }: ProjectIndexProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Extraer categorías únicas
    const categories = useMemo(() => {
        const cats = new Set(projects.map((p) => p.data.category));
        return Array.from(cats).sort();
    }, [projects]);

    // Filtrar proyectos
    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesSearch =
                searchQuery === "" ||
                project.data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.data.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.data.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory =
                selectedCategory === "all" || project.data.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [projects, searchQuery, selectedCategory]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-skin-text mb-4">
                        Proyectos
                    </h1>
                    <div className="w-20 h-1.5 bg-brand-primary mx-auto mb-6 rounded-full"></div>

                </div>

                {/* Filtros */}
                <ProjectFilters
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    categories={categories}
                    onSearchChange={setSearchQuery}
                    onCategoryChange={setSelectedCategory}
                    totalPosts={projects.length}
                    filteredCount={filteredProjects.length}
                />

                {/* Grid de proyectos */}
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project.slug}
                                slug={project.slug}
                                title={project.data.title}
                                description={project.data.description}
                                category={project.data.category}
                                tags={project.data.tags}
                                github={project.data.github}
                                dashboard={project.data.dashboard}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-skin-secondary rounded-full mb-4">
                            <svg className="w-8 h-8 text-skin-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-skin-text mb-2">
                            No se encontraron proyectos
                        </h3>
                        <p className="text-skin-muted mb-6">
                            Ajustá los filtros de búsqueda
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("all");
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-skin-primary rounded-full hover:shadow-lg active:scale-95 transition-all duration-200 font-semibold"
                            style={{ boxShadow: 'var(--md-elevation-1)' }}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectIndex;
