import { useState, useMemo, useEffect } from "react";
import ProjectCard from "../proyectos/ProjectCard";
import ProjectFilters from "../proyectos/ProjectFilters";
import { SearchIcon, FolderIcon } from "../ui/Icons";
import { DATA_ANALYSIS_CATEGORIES } from "@shared/constants/projects.config";

interface SerializedProject {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
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

  // Filter projects by search and category
  const applyFilters = (projects: SerializedProject[]) => {
    let filtered = [...projects];

    // Filter by category (if not "all")
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
  };

  // Split into two sections
  const { dataAnalysis, others } = useMemo(() => {
    const da: SerializedProject[] = [];
    const ot: SerializedProject[] = [];

    for (const project of posts) {
      if (DATA_ANALYSIS_CATEGORIES.has(project.category)) {
        da.push(project);
      } else {
        ot.push(project);
      }
    }

    return {
      dataAnalysis: applyFilters(da),
      others: applyFilters(ot),
    };
  }, [posts, searchQuery, selectedCategory]);

  const totalFiltered = dataAnalysis.length + others.length;

  const getAnimationClass = (index: number) =>
    `transition-all duration-700 delay-${index * 100} ${
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`;

  const renderSection = (
    title: string,
    projects: SerializedProject[],
    index: number
  ) => {
    if (projects.length === 0) return null;

    return (
      <div className={`mb-16 ${getAnimationClass(index)}`}>
        <div className="flex items-center gap-3 mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-skin-text">
            {title}
          </h3>
          <span className="text-sm px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full font-medium">
            {projects.length}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
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
    );
  };

  return (
    <section
      id="proyectos"
      className="min-h-screen bg-skin-secondary py-16 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header
          className={`mb-12 lg:mb-16 text-center ${getAnimationClass(0)}`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-skin-text mb-6">
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
            filteredCount={totalFiltered}
          />
        </div>

        {/* Sections */}
        {totalFiltered > 0 ? (
          <>
            {renderSection("Análisis de Datos", dataAnalysis, 2)}
            {renderSection("Otros", others, 3)}
          </>
        ) : (
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
                : "No se encontraron proyectos"}
            </h3>
            <p className="text-skin-muted mb-6">
              {searchQuery
                ? "Probá con otros términos de búsqueda"
                : "Ajustá los filtros de búsqueda"}
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
