import { useScrollAnimation } from "@presentation/hooks/useScrollAnimation";
import { PROFILE_DATA } from "@data/profile-data";

const CREDLY_BADGES = [
  { id: "78a917fc-2fee-416b-a3c4-d14f3cd09541", label: "Python for Data Engineering – IBM" },
  { id: "57d36636-8b10-4218-a641-7cd6fcf9d8fe", label: "Python for Data Science – IBM" },
];

const SKILL_GROUPS: { label: string; names: string[] }[] = [
  {
    label: "GenAI & IA",
    names: ["LangChain", "LlamaIndex", "RAG (Retrieval-Augmented Generation)", "Vector Databases", "OpenAI API", "Prompt Engineering"],
  },
  {
    label: "Análisis de Datos",
    names: ["Python", "SQL", "Pandas", "NumPy", "Scikit-learn", "R", "Power BI", "Tableau", "Excel Avanzado"],
  },
  {
    label: "Bases de Datos & Cloud",
    names: ["PostgreSQL", "MySQL", "MongoDB", "Databricks"],
  },
  {
    label: "Dev & Herramientas",
    names: ["JavaScript", "TypeScript", "Git", "Docker"],
  },
  {
    label: "Soft Skills",
    names: ["Resolución de Problemas", "Pensamiento Analítico", "Comunicación", "Trabajo en Equipo"],
  },
  {
    label: "Sistemas de Gestión (ERP)",
    names: ["Tango Gestión", "Parametrización Contable", "Gestión de Datos Maestros", "Gestión de Stock", "Procesos de Ventas", "Tesorería", "Gestión de Compras"],
  },
];

const Skills = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const skillMap = new Map(PROFILE_DATA.skills.map((s: { name: string }) => [s.name, s]));

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      id="skills"
      className="bg-skin-primary py-20 md:py-28"
    >
      <div className="mx-auto max-w-[980px] px-6">
        <div
          className={`mb-16 transition-all duration-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <h2
            className="font-bold text-skin-text tracking-tight"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.02em" }}
          >
            Stack
          </h2>
        </div>

        <div className="space-y-12">
          {SKILL_GROUPS.map((group, gi) => (
            <div
              key={group.label}
              className={`transition-all duration-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{ transitionDelay: `${gi * 80}ms` }}
            >
              <h3 className="text-xs font-semibold text-skin-muted uppercase tracking-widest mb-4">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.names.map((name) => {
                  const skill = skillMap.get(name);
                  if (!skill) return null;
                  return (
                    <span
                      key={name}
                      className="px-3 py-1.5 text-sm font-medium text-skin-text bg-skin-secondary border border-skin-border rounded-lg hover:border-skin-border-medium transition-colors duration-200"
                    >
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Credly Badges */}
        <div
          className={`mt-16 pt-12 border-t border-skin-border transition-all duration-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
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
