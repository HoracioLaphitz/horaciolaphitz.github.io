interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  type?: 'app' | 'analysis';
  featured?: boolean;
  technologies?: { name: string }[];
  githubUrl?: string | null;
  htmlUrl?: string | null;
  notebookUrl?: string | null;
}

export function ProjectCard(props: ProjectCardProps) {
  const { title, description, featured, technologies = [], githubUrl, htmlUrl, notebookUrl } = props;
  const hasRepo = Boolean(githubUrl);
  const isCaseStudy = !hasRepo;
  const localUrl = htmlUrl || notebookUrl || null;

  const cardStyle = {
    backgroundColor: 'var(--color-surface)',
    border: featured ? '1px solid var(--color-accent-muted)' : '1px solid var(--color-border)',
    boxShadow: featured ? '0 0 0 1px var(--color-accent-muted)' : 'var(--shadow-sm)',
  };

  const cardContent = (
    <div className="p-md">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="text-sm font-semibold leading-snug flex-1 truncate"
          style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h3>
        {featured && (
          <svg className="w-3 h-3 shrink-0" style={{ color: 'var(--color-accent)' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
      </div>

      <p className="text-xs leading-relaxed line-clamp-1 mb-2" style={{ color: 'var(--color-text-secondary)' }}>
        {description}
      </p>

      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium"
          style={{
            backgroundColor: isCaseStudy ? 'var(--color-accent-muted)' : 'var(--color-surface)',
            color: isCaseStudy ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          {hasRepo ? (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.1-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.41 3-.41s2.04.14 3 .41c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.47 5.93.43.37.82 1.1.82 2.22 0 1.6-.01 2.9-.01 3.3 0 .32.22.7.83.58C20.57 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Repositorio
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Caso de Estudio
            </>
          )}
        </span>
        {technologies.length > 0 && (
          <span className="flex items-center gap-1">
            {technologies.slice(0, 2).map((tech, idx) => (
              <span key={idx} className="tag">{tech.name}</span>
            ))}
            {technologies.length > 2 && (
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                +{technologies.length - 2}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );

  if (hasRepo) {
    return (
      <a
        href={githubUrl!}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        style={cardStyle}
      >
        {cardContent}
      </a>
    );
  }

  // Casos de estudio: renderizar sin link externo
  if (localUrl) {
    return (
      <a
        href={localUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        style={cardStyle}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <div
      className="block relative rounded-xl overflow-hidden"
      style={cardStyle}
    >
      {cardContent}
    </div>
  );
}
