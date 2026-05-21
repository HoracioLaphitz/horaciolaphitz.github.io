import { useState, useMemo } from 'react';
import { NotebookProjectCard } from './NotebookProjectCard';

interface NotebookProject {
  slug: string;
  title: string;
  description: string;
  has_notebook: boolean;
  notebook_url?: string;
  html_url?: string;
  assets: Array<{ name: string; url: string }>;
}

interface NotebooksGridProps {
  projects: NotebookProject[];
  showFilters?: boolean;
}

export function NotebooksGrid({ projects, showFilters = true }: NotebooksGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState<boolean | null>(null);

  // For notebooks, we'll use a default category since they don't have categories in the data
  const categories = useMemo(() => ['Notebooks'], [projects]);

  const filteredProjects = useMemo(() => {
    // For notebooks, we don't apply category filtering since they're all in one category
    // but we keep the filtering logic for consistency
    return projects.filter(project => {
      if (selectedCategory && selectedCategory !== 'Notebooks') {
        return false;
      }
      // No featured filtering for notebooks for now
      return true;
    });
  }, [projects, selectedCategory, showFeaturedOnly]);

  const projectsByCategory = useMemo(() => {
    const grouped: Record<string, NotebookProject[]> = {};
    filteredProjects.forEach(project => {
      const category = selectedCategory || 'Notebooks';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(project);
    });
    return grouped;
  }, [filteredProjects, selectedCategory]);

  const sortedCategories = useMemo(
    () => Object.keys(projectsByCategory).sort(),
    [projectsByCategory]
  );

  return (
    <section className="py-4xl px-4">
      <div className="container">
        <div className="mb-4xl">
          <h2 className="text-4xl font-bold mb-lg">Proyectos de Notebooks Interactivos</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg">
            {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {showFilters && (
          <div className="mb-4xl">
            <h3 className="text-2xl font-semibold mb-lg">Filtros</h3>
            <div className="flex flex-wrap gap-4">
              <button
                className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200 ${
                  !selectedCategory || selectedCategory === 'Notebooks' ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                Todos
              </button>
            </div>
          </div>
        )}

        {filteredProjects.length === 0 ? (
          <div className="text-center py-4xl">
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg">
              No se encontraron proyectos con los filtros seleccionados.
            </p>
          </div>
        ) : (
          sortedCategories.map(category => (
            <div key={category} className="mb-4xl">
              <h3 className="text-2xl font-semibold mb-lg capitalize">
                {category}
                <span className="text-sm font-normal text-light-text-secondary dark:text-dark-text-secondary ml-md">
                  ({projectsByCategory[category].length})
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                {projectsByCategory[category].map(project => (
                  <NotebookProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}