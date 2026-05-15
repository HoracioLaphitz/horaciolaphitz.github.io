/**
 * ProjectStoryCard Component
 * Tarjeta de proyecto con Storytelling: Situación → Conflicto → Solución → Impacto
 * Nueva Identidad: Data & Strategy
 */

import { ImpactCard } from "../ui/ImpactCard";

interface ProjectStoryCardProps {
  title: string;
  description: string;
  slug: string;
  category: string;
  tags: string[];
  githubUrl?: string;
  dashboardUrl?: string;
  impact?: {
    label: string;
    value: string;
  };
}

export function ProjectStoryCard({
  title,
  description,
  slug,
  category,
  tags,
  githubUrl,
  dashboardUrl,
  impact,
}: ProjectStoryCardProps) {
  return (
    <article
      className="
      group
      bg-white
      rounded-2xl
      shadow-md
      overflow-hidden
      transform transition-all duration-300
      hover:shadow-xl hover:-translate-y-1
      border border-[#2E2E2E]/10
    "
    >
      {/* Header con Categoría */}
      <div
        className="
        bg-gradient-to-r from-[#0A74DA] to-[#085BB0]
        px-lg py-md
        flex items-center justify-between
      "
      >
        <span className="text-white text-sm font-semibold">{category}</span>
        {impact && (
          <span
            className="
            bg-white/20 
            text-white 
            px-sm py-xs 
            rounded-full 
            text-xs 
            font-medium
          "
          >
            Con Impacto Medible
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-lg">
        {/* Título */}
        <h3
          className="
          text-xl font-bold font-display
          text-[#2E2E2E]
          mb-md
          group-hover:text-[#0A74DA]
          transition-colors
        "
        >
          {title}
        </h3>

        {/* Descripción (Situación + Conflicto) */}
        <p
          className="
          text-[#2E2E2E]/70
          text-sm
          mb-lg
          line-clamp-3
        "
        >
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-xs mb-lg">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="
                px-sm py-xs
                bg-[#0A74DA]/10
                text-[#0A74DA]
                rounded-md
                text-xs
                font-medium
              "
            >
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span
              className="
              px-sm py-xs
              text-[#2E2E2E]/50
              text-xs
              font-medium
            "
            >
              +{tags.length - 4} más
            </span>
          )}
        </div>

        {/* Impacto (si existe) */}
        {impact && (
          <div className="mb-lg">
            <ImpactCard
              label={impact.label}
              value={impact.value}
              variant="primary"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-md pt-lg border-t border-[#2E2E2E]/10">
          <a
            href={`/proyectos/${slug}`}
            className="
              flex-1
              px-md py-sm
              bg-gradient-to-r from-[#0A74DA] to-[#085BB0]
              text-white
              rounded-lg
              text-sm font-semibold
              text-center
              transform transition-all duration-300
              hover:scale-105
            "
          >
            Ver Caso Completo
          </a>

          {(githubUrl || dashboardUrl) && (
            <div className="flex gap-sm">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    p-sm
                    bg-[#2E2E2E]
                    text-white
                    rounded-lg
                    transform transition-all duration-300
                    hover:bg-[#0A74DA]
                  "
                  title="Ver en GitHub"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {dashboardUrl && (
                <a
                  href={dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    p-sm
                    bg-[#FF6B35]
                    text-white
                    rounded-lg
                    transform transition-all duration-300
                    hover:bg-[#E65520]
                  "
                  title="Ver Dashboard"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
