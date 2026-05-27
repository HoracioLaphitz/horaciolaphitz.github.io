import { useMemo } from 'react';
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
}

export function NotebooksGrid({ projects }: NotebooksGridProps) {
  const filteredProjects = useMemo(() => projects, [projects]);

  return (
    <section className="py-4xl px-4">
      <div className="container">
        <div className="mb-4xl">
          <h2 className="text-4xl font-bold mb-lg text-[#eeffd2]">Notebooks Interactivos</h2>
          <p className="text-[#c8ffb8] text-base">
            {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-4xl">
            <p className="text-[#c8ffb8] text-base">No se encontraron proyectos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {filteredProjects.map(project => (
              <NotebookProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}