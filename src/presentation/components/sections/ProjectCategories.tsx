import { useState, useMemo, useEffect } from "react";
import ProjectCard from "../proyectos/ProjectCard";
import ProjectFilters from "../proyectos/ProjectFilters";
import { SearchIcon, FolderIcon } from "../ui/Icons";

interface SerializedProject {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: readonly string[];
  publishDate: string;
  author: string;
  githubUrl?: string;
  dashboardUrl?: string;
  status: string;
  featured: boolean;
}

interface ProjectCategoriesProps {
  posts: SerializedProject[];
}

const ProjectCategories = ({ posts }: ProjectCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get("category");
      if (categoryParam) {
        setSelectedCategory(categoryParam);
      }
    }
  }, []);

  // Get unique categories
  const projectCategories = useMemo(() => {
    const categories = new Set<string>();
    posts.forEach((project) => {
      categories.add(project.category);
    });
    return Array.from(categories).sort();
  }, [posts]);

  // Filter projects
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        const searchableText = [p.title, p.description, p.category, ...p.tags]
          .join(" ")
          .toLowerCase();
        return searchableText.includes(query);
      });
    }

    return filtered;
  }, [posts, selectedCategory, searchQuery]);

  const getAnimationClass = (index: number) =>
    `transition-all duration-200 delay-${index * 75} ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
    }`;

  return (
    <section
      id="proyectos"
      className="bg-skin-secondary py-20 md:py-28"
    >
      <div className="max-w-[980px] mx-auto px-6">
        {/* Header */}
        <header
          className={`mb-12 lg:mb-16 ${getAnimationClass(0)}`}
        >
          <h2
            className="font-bold text-skin-text tracking-tight"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.02em" }}
          >
            Proyectos
          </h2>
        </header>

        {/* Filters */}
        <div className={getAnimationClass(1)}>
          <ProjectFilters
            categories={projectCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalPosts={posts.length}
            filteredCount={filteredPosts.length}
          />
        </div>

        {/* Projects Grid */}
        {filteredPosts.length > 0 && (
          <div className={`mb-12 ${getAnimationClass(2)}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPosts.map((project) => (
                <ProjectCard
                  key={project.slug}
                  title={project.title}
                  description={project.description}
                  slug={project.slug}
                  category={project.category}
                  tags={project.tags}
                  github={project.githubUrl}
                  dashboard={project.dashboardUrl}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className={`text-center py-16 ${getAnimationClass(2)}`}>
            <div className="text-6xl mb-4 flex justify-center">
              {searchQuery ? (
                <SearchIcon className="w-16 h-16 text-skin-muted" />
              ) : (
                <FolderIcon className="w-16 h-16 text-skin-muted" />
              )}
            </div>
            <h3 className="text-xl font-bold text-skin-text mb-2">
              {searchQuery
                ? `No se encontraron resultados para "${searchQuery}"`
                : "No se encontraron resultados con estos filtros"}
            </h3>
            <p className="text-skin-muted mb-6">
              Probá con otros términos de búsqueda o ajustá los filtros
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-3 bg-skin-secondary border border-skin-border hover:border-skin-accent text-skin-text font-semibold rounded-lg transition-all duration-300"
                >
                  Limpiar búsqueda
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="px-6 py-3 bg-brand-primary hover:bg-brand-hover text-skin-primary font-semibold rounded-lg transition-all duration-300"
              >
                Mostrar todo
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectCategories;
