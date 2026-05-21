import { useState } from 'react';

interface NotebookProject {
  slug: string;
  title: string;
  description: string;
  has_notebook: boolean;
  notebook_url?: string;
  html_url?: string;
  assets: Array<{ name: string; url: string }>;
}

interface NotebookProjectCardProps {
  project: NotebookProject;
}

export function NotebookProjectCard({ project }: NotebookProjectCardProps) {
  const [showAssets, setShowAssets] = useState(false);

  return (
    <div className="rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-md"
      style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="p-lg">
        <h3 className="text-xl font-bold mb-2 text-text-primary">{project.title}</h3>
        <p className="text-text-secondary text-sm mb-4">
          {project.description}
        </p>

        {project.has_notebook && (
          <div className="mb-4 flex flex-wrap gap-2">
            <a
              href={project.notebook_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium text-text-inverse transition-all duration-200"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              View Notebook
            </a>
            {project.html_url && (
              <a
                href={project.html_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium border border-border text-text-primary hover:bg-accent-muted transition-all duration-200"
              >
                View HTML Export
              </a>
            )}
          </div>
        )}

        {project.assets.length > 0 && (
          <>
            <button
              onClick={() => setShowAssets(!showAssets)}
              className="text-sm font-medium text-accent hover:opacity-80 transition-opacity mb-2"
            >
              {showAssets ? 'Hide Assets' : 'Show Assets'} ({project.assets.length})
            </button>
            {showAssets && (
              <div className="mt-2 space-y-1">
                {project.assets.map((asset, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <svg className="h-4 w-4 mt-0.5 shrink-0 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM12 2a10 10 0 100 20 10 10 0 000-20zm6.5 8.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <a href={asset.url} target="_blank" rel="noopener noreferrer" className="underline text-text-secondary hover:text-text-primary">
                      {asset.name}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}