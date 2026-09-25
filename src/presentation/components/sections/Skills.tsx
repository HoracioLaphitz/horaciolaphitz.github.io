import { PROFILE_DATA } from "@data/profile-data";
import type { Skill } from "@domain/entities/profile.entity";

/**
 * Three-tier skill system:
 * Tier 1: Core (daily use, solid evidence)
 * Tier 2: Data & Automation (project-proven)
 * Tier 3: Applied AI (learning + personal projects)
 *
 * Only skills with demonstrable evidence are shown.
 * Agent frameworks without project evidence are excluded from public display.
 */

export const SKILL_TIERS: {
  label: string;
  description: string;
  names: string[];
}[] = [
  {
    label: "Soporte IT",
    description: "Infraestructura, hardware y asistencia técnica",
    names: [
      "Soporte técnico IT",
      "Mesa de ayuda (Help Desk)",
      "Diagnóstico de hardware",
      "Mantenimiento preventivo y correctivo",
      "Windows 10/11",
      "Windows Server",
      "Linux",
      "Active Directory",
      "Microsoft 365",
      "Microsoft Teams",
      "Redes TCP/IP",
      "VPN",
      "DNS / DHCP",
      "Gestión de tickets",
      "Acceso remoto (RDP/TeamViewer)",
      "Periféricos e impresoras",
      "Backups y recuperación",
      "Resolución de incidencias",
      "Documentación técnica",
      "SCCM",
      "Implementación de sistemas",
    ],
  },
  {
    label: "Datos y automatización",
    description: "Herramientas y métodos aplicados en proyectos",
    names: [
      "Python",
      "SQL",
      "Power BI",
      "Excel avanzado",
      "Pandas",
      "PostgreSQL",
      "MySQL",
      "ETL",
      "Limpieza y preparación de datos",
      "Análisis estadístico",
      "Scikit-learn",
      "Streamlit",
      "Web Scraping",
      "SQLite",
      "Databricks",
      "BigQuery",
      "XGBoost",
      "Docker",
      "Testing",
      "Git",
    ],
  },
  {
    label: "IA aplicada",
    description: "Exploración activa en proyectos propios",
    names: [
      "RAG",
      "LangChain",
      "LangGraph",
      "OpenAI API",
      "Prompt Engineering",
    ],
  },
  {
    label: "Habilidades blandas",
    description: "Competencias interpersonales y profesionales",
    names: [
      "Atención al usuario",
      "Capacitación de usuarios",
      "Comunicación efectiva",
      "Escucha activa",
      "Empatía",
      "Manejo del estrés",
      "Gestión del tiempo",
      "Proactividad",
      "Adaptabilidad",
      "Trabajo en equipo",
      "Aprendizaje continuo",
      "Relevamiento de necesidades",
      "Resolución de problemas",
      "Pensamiento analítico",
      "Comunicación",
    ],
  },
];

export const getAllVisibleSkillNames = (): string[] =>
  SKILL_TIERS.flatMap((tier) => tier.names);

export const getVisibleSkillTiers = (skills: readonly Skill[]) => {
  const skillMap = new Map(skills.map((skill) => [skill.name, skill]));

  return SKILL_TIERS.map(({ label, description, names }) => ({
    label,
    description,
    skills: names
      .map((name) => skillMap.get(name))
      .filter((skill): skill is Skill => skill !== undefined),
  })).filter(({ skills: visibleSkills }) => visibleSkills.length > 0);
};

const Skills = () => {
  const visibleTiers = getVisibleSkillTiers(PROFILE_DATA.skills);

  return (
    <section
      id="skills"
      className="border-b border-skin-border/40 bg-skin-primary py-12 sm:py-14 lg:py-[clamp(3rem,7vh,5rem)]"
    >
      <div className="mx-auto w-full max-w-content px-4 sm:px-6 lg:max-w-container-xl lg:px-8">
        <div className="mb-8 lg:mb-10">
          <h2
            className="text-display-sm font-bold text-skin-text tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Competencias
          </h2>
          <p className="mt-3 text-sm text-skin-muted">
            Tecnologías con evidencia en proyectos propios o experiencia
            laboral.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-4 lg:gap-6">
          {visibleTiers.map(({ label, description, skills }) => (
            <article
              key={label}
              className="self-start rounded-xl bg-skin-secondary p-6"
            >
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-primary">
                {label}
              </h3>
              <p className="mb-4 text-xs text-skin-muted">{description}</p>
              <div className="flex flex-wrap gap-2">
                {skills.map(({ name }) => (
                  <span
                    key={name}
                    className="rounded-full border border-skin-border/40 bg-skin-primary/80 px-3.5 py-1.5 text-xs font-medium text-skin-text transition-colors duration-200 hover:border-skin-border-medium md:text-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
