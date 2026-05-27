import { useState, useMemo, useRef, useEffect } from 'react';
import { ProjectCard } from './ProjectCard';

interface Project {
  slug: string;
  title: string;
  description: string;
  category: string;
  type?: 'app' | 'analysis';
  featured?: boolean;
  status?: string;
  technologies?: { name: string }[];
  githubUrl?: string | null;
  htmlUrl?: string | null;
  notebookUrl?: string | null;
}

interface ProjectsGridProps {
  projects: Project[];
  compact?: boolean;
}

export function ProjectsGrid({ projects, compact = false }: ProjectsGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const categories = useMemo(() => {
    const safe = projects || [];
    return Array.from(new Set(safe.map((p) => p.category))).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const safe = projects || [];
    const query = searchQuery.toLowerCase().trim();

    return safe.filter((project) => {
      if (selectedCategory && project.category !== selectedCategory) return false;
      if (!query) return true;

      const techNames = (project.technologies || []).map((t) => t.name.toLowerCase()).join(' ');
      return (
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        techNames.includes(query)
      );
    });
  }, [projects, searchQuery, selectedCategory]);

  return (
    <section id="proyectos" className={`relative ${compact ? 'py-3xl md:py-4xl px-2 sm:px-4' : 'py-4xl md:py-5xl px-2 sm:px-4'}`}>
      <div className="container relative max-w-5xl md:max-w-7xl mx-auto">
        <div className={`${compact ? '' : 'section-header'} animate-fade-in-up`}>
          {compact ? (
            <>
              <span className="chip mb-4">Portfolio</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-md"
                style={{ color: 'var(--color-text-primary)' }}>
                Trabajos recientes
              </h2>
            </>
          ) : (
            <>
              <span className="chip mb-4">Portfolio</span>
              <h2>Proyectos y Análisis</h2>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4 animate-fade-in-up animate-delay-100">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--color-text-tertiary)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, tecnología… (⌘K)"
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                borderColor: 'var(--color-border)',
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 animate-fade-in-up animate-delay-200">
          <button
            onClick={() => setSelectedCategory(null)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              backgroundColor: selectedCategory === null ? 'var(--color-accent)' : 'var(--color-accent-muted)',
              color: selectedCategory === null ? '#ffffff' : 'var(--color-accent)',
            }}
          >
            Todas las áreas
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200"
              style={{
                backgroundColor: selectedCategory === category ? 'var(--color-accent)' : 'var(--color-accent-muted)',
                color: selectedCategory === category ? '#ffffff' : 'var(--color-accent)',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mb-3 animate-fade-in-up animate-delay-200">
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            {filteredProjects.length} resultado{filteredProjects.length !== 1 ? 's' : ''}
            {searchQuery && <> para &ldquo;{searchQuery}&rdquo;</>}
          </p>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-4xl glass rounded-2xl">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              No se encontraron proyectos con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 animate-fade-in-up animate-delay-300">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.slug} {...project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
