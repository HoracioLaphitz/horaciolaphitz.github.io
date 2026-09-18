import {
  ChartBarIcon,
  CheckCircleIcon,
  RobotIcon,
} from "@presentation/components/ui/Icons";

const areas = [
  {
    status: "Experiencia comprobable",
    title: "Análisis de datos",
    description:
      "Python, SQL y Power BI para preparar datos, automatizar procesos y construir tableros que apoyan decisiones.",
    Icon: ChartBarIcon,
  },
  {
    status: "Exploración activa",
    title: "IA aplicada",
    description:
      "Estudio RAG y flujos con agentes para entender cómo automatizar consultas y tareas repetitivas en proyectos propios.",
    Icon: RobotIcon,
  },
  {
    status: "Práctica en desarrollo",
    title: "Evaluación rigurosa",
    description:
      "Comparo resultados, registro errores y ajusto pruebas cuando la evidencia no sostiene una conclusión.",
    Icon: CheckCircleIcon,
  },
] as const;

const About = () => (
  <section
    id="about"
    aria-labelledby="about-title"
    className="scroll-mt-20 border-b border-skin-border/40 bg-skin-primary py-12 sm:py-14 lg:py-[clamp(3rem,7vh,5rem)]"
  >
    <div className="mx-auto grid w-full max-w-content gap-10 px-4 sm:px-6 lg:max-w-container-xl lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16 lg:px-8">
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">
          Sobre mí
        </p>
        <h2
          id="about-title"
          className="max-w-xl text-display-sm font-bold tracking-tight text-skin-text"
          style={{ letterSpacing: "-0.02em" }}
        >
          Datos, procesos y personas
        </h2>
        <div className="mt-5 max-w-2xl space-y-4 text-sm leading-7 text-skin-muted md:text-base">
          <p>
            Mi experiencia comenzó en soporte corporativo e implementación de
            sistemas, donde aprendí a diagnosticar fallas, acompañar usuarios y
            documentar procesos. En la implementación de R.I.S.mi coordiné
            capacitaciones, relevé requerimientos técnicos y seguí el trabajo
            del equipo.
          </p>
          <p>
            Desde ahí me orienté hacia el análisis de datos y la automatización
            con Python, SQL y Power BI. Hoy combino esa base técnica con machine
            learning aplicado a proyectos propios: análisis de mercado,
            predicción de abandono, tableros para toma de decisiones y pipelines
            de datos.
          </p>
        </div>
      </div>

      <ol className="border-l border-brand-primary/40">
        {areas.map(({ status, title, description, Icon }) => (
          <li
            key={title}
            className="relative border-b border-skin-border/50 py-5 pl-7 last:border-b-0 md:pl-9 lg:py-6"
          >
            <span
              aria-hidden="true"
              className="absolute -left-4 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-brand-primary/40 bg-skin-primary text-brand-primary"
            >
              <Icon className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-primary">
              {status}
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-skin-text">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-skin-muted">
              {description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default About;
