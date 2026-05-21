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
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
          {project.description}
        </p>

        {project.has_notebook && (
          <div className="mb-4">
            <a
              href={project.notebook_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 mr-2 mb-2"
            >
              View Notebook
            </a>
            {project.html_url && (
              <a
                href={project.html_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 mr-2 mb-2"
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
              className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 mb-2"
            >
              {showAssets ? 'Hide Assets' : 'Show Assets'} ({project.assets.length})
            </button>
            {showAssets && (
              <div className="mt-2 space-y-1">
                {project.assets.map((asset, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-4 w-4 text-light-text-secondary dark:text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM12 2a10 10 0 100 20 10 10 0 000-20zm6.5 8.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div>
                      <a href={asset.url} target="_blank" rel="noopener noreferrer" className="underline">
                        {asset.name}
                      </a>
                    </div>
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