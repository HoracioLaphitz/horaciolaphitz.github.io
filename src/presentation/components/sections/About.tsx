import {
  ChartBarIcon,
  CheckCircleIcon,
  RobotIcon,
} from "@presentation/components/ui/Icons";

const areas = [
  {
    status: "Experiencia",
    title: "Datos y automatización",
    description:
      "Preparo y valido datos, automatizo tareas repetitivas y traduzco hallazgos en tableros para la toma de decisiones.",
    Icon: ChartBarIcon,
  },
  {
    status: "En desarrollo",
    title: "Flujos con agentes",
    description:
      "Desarrollo pruebas propias con RAG y agentes para automatizar, validar y ejecutar procesos de forma controlada.",
    Icon: RobotIcon,
  },
  {
    status: "Práctica",
    title: "Evaluación de resultados",
    description:
      "Comparo respuestas, registro errores y ajusto las pruebas cuando un resultado no se sostiene con la evidencia.",
    Icon: CheckCircleIcon,
  },
] as const;

const About = () => (
  <section
    id="about"
    aria-labelledby="about-title"
    className="scroll-mt-20 border-y border-skin-border/40 bg-skin-secondary/60 py-16 md:py-20"
  >
    <div className="mx-auto grid max-w-content gap-12 px-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16">
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
        <div className="mt-6 max-w-2xl space-y-4 text-sm leading-7 text-skin-muted md:text-base">
          <p>
            Trabajo con Python y SQL para preparar información, validar datos y
            automatizar procesos. La experiencia en soporte corporativo me
            enseñó a diagnosticar fallas, documentar lo observado y acompañar a
            usuarios. En la implementación de R.I.S.mi coordiné capacitaciones,
            relevé requerimientos técnicos y seguí el trabajo del equipo.
          </p>
          <p>
            Mi próximo paso es consolidar esta experiencia en un rol de análisis
            de datos con foco en automatización. RAG y los flujos con agentes
            siguen siendo un área de estudio y práctica en proyectos propios.
          </p>
        </div>
      </div>

      <ol className="border-l border-brand-primary/40">
        {areas.map(({ status, title, description, Icon }) => (
          <li
            key={title}
            className="relative border-b border-skin-border/50 py-6 pl-7 last:border-b-0 md:pl-9"
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
