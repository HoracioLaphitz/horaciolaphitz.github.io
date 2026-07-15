import { useScrollAnimation } from "@presentation/hooks/useScrollAnimation";
import { PROFILE_DATA } from "@data/profile-data";
import type { Skill } from "@domain/entities/profile.entity";

/**
 * Group configuration — defines which skills appear in each display group.
 *
 * CONTRACT: every name in `names[]` MUST exist in PROFILE_DATA.skills.
 * Skills not found are silently skipped. Add new skills to profile-data.ts first,
 * then reference them here. The source of truth is profile-data.ts, not this list.
 */
const SKILL_GROUPS: { label: string; names: string[] }[] = [
  {
    label: "GenAI & IA",
    names: ["LangChain", "LlamaIndex", "RAG", "Vector Databases", "OpenAI API", "Prompt Engineering"],
  },
  {
    label: "Análisis de Datos",
    names: ["Pandas", "NumPy", "Scikit-learn", "XGBoost", "Deep Learning", "Computer Vision", "Market Basket Analysis", "Matplotlib", "Power BI", "Excel Avanzado"],
  },
  {
    label: "Programación",
    names: ["Python", "R", "TensorFlow"],
  },
  {
    label: "Bases de Datos & Cloud",
    names: ["SQL", "PostgreSQL", "MySQL", "BigQuery", "Databricks"],
  },
  {
    label: "Dev & Herramientas",
    names: ["Git", "Docker", "Streamlit", "Web Scraping", "Testing"],
  },
  {
    label: "Soft Skills",
    names: ["Resolución de Problemas", "Pensamiento Analítico", "Comunicación", "Trabajo en Equipo"],
  },
  {
    label: "Tango Gestión (ERP)",
    names: ["Parametrización Contable", "Gestión de Datos Maestros", "Gestión de Stock", "Procesos de Ventas", "Tesorería", "Gestión de Compras"],
  },
];

const CREDLY_BADGES = [
  { id: "78a917fc-2fee-416b-a3c4-d14f3cd09541", label: "Python for Data Engineering – IBM" },
  { id: "57d36636-8b10-4218-a641-7cd6fcf9d8fe", label: "Python for Data Science – IBM" },
] as const;

const Skills = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const skillMap = new Map<string, Skill>(
    PROFILE_DATA.skills.map((s) => [s.name, s])
  );

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      id="skills"
      className="bg-skin-primary py-16 md:py-20"
    >
      <div className="mx-auto max-w-content px-6">
        <div
          className={`mb-12 transition-all duration-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        >
          <h2
            className="text-display-sm font-bold text-skin-text tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Stack
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {SKILL_GROUPS.map((group, gi) => {
            const visible = group.names.filter((name) => skillMap.has(name));

            return (
              <div
                key={group.label}
                className={`transition-all duration-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                style={{ transitionDelay: `${gi * 60}ms` }}
              >
                <h3 className="text-xs font-semibold text-skin-muted uppercase tracking-widest mb-4">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {visible.map((name) => (
                    <span
                      key={name}
                      className="px-3 py-1.5 text-sm font-medium text-skin-text bg-skin-secondary border border-skin-border rounded-lg hover:border-skin-border-medium transition-colors duration-200"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Credly Badges */}
        <div
          className={`mt-16 pt-12 border-t border-skin-border transition-all duration-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
          style={{ transitionDelay: "600ms" }}
        >
          <h3 className="text-xs font-semibold text-skin-muted uppercase tracking-widest mb-6">
            Badges verificables — Credly
          </h3>
          <div className="flex flex-wrap gap-4">
            {CREDLY_BADGES.map((badge) => (
              <a
                key={badge.id}
                href={`https://www.credly.com/badges/${badge.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-skin-secondary border border-skin-border rounded-lg text-sm font-medium text-skin-text hover:border-skin-border-medium transition-colors duration-200"
              >
                <svg className="w-4 h-4 text-skin-muted" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {badge.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
