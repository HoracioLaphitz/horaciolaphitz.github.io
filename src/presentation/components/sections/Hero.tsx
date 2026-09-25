import { useRef } from "react";
import { PUBLIC_POSITIONING } from "@data/public-positioning.v1";
import { useScopedMotion } from "@presentation/hooks/useScopedMotion";
import {
  ArrowRightIcon,
  DownloadIcon,
} from "@presentation/components/ui/Icons";

const HERO_MOTION_TARGETS = [
  '[data-motion="hero-eyebrow"]',
  '[data-motion="hero-heading"]',
  '[data-motion="hero-summary"]',
  '[data-motion="hero-actions"]',
] as const;

const capabilities = [
  {
    index: "01",
    title: "Soporte IT y hardware",
    description:
      "Mesa de ayuda, diagnóstico, redes y sistemas. Windows, Linux, Active Directory, Microsoft 365, VPN, TCP/IP y más.",
  },
  {
    index: "02",
    title: "Atención al cliente",
    description:
      "Comunicación efectiva, escucha activa, empatía, gestión del estrés y resolución de incidencias.",
  },
  {
    index: "03",
    title: "Análisis de datos",
    description:
      "Python, SQL y Power BI para preparar datos y responder preguntas concretas.",
  },
  {
    index: "04",
    title: "Automatización e IA",
    description:
      "Procesos, validaciones y agentes de IA para reducir tareas repetitivas.",
  },
] as const;

const Hero = () => {
  const root = useRef<HTMLElement>(null);

  useScopedMotion({ root, targetSelectors: HERO_MOTION_TARGETS });

  return (
    <section
      ref={root}
      id="inicio"
      className="flex min-h-[calc(100svh-3.5rem)] border-b border-skin-border/40 bg-skin-primary text-skin-text"
    >
      <div className="mx-auto flex w-full max-w-content flex-col px-4 py-6 sm:px-6 sm:py-8 lg:max-w-container-xl lg:px-8 lg:py-[clamp(1.5rem,3vh,2.5rem)]">
        <div className="flex items-center justify-between gap-6 border-b border-skin-border/60 pb-5">
          <p
            data-motion="hero-eyebrow"
            className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-skin-muted"
          >
            Soporte IT · Hardware · Análisis de datos
          </p>
        </div>

        <div className="grid flex-1 gap-8 py-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(21rem,0.75fr)] lg:items-stretch lg:gap-12 lg:py-[clamp(2rem,5vh,4rem)]">
          <div className="flex flex-col justify-center">
            <h1
              data-motion="hero-heading"
              className="font-display text-[clamp(3rem,6vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.055em] text-skin-text"
            >
              {PUBLIC_POSITIONING.identity.name}
            </h1>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#895137] dark:text-[#c17d5b]">
              Analista de datos orientado a la automatización de procesos
            </p>

            <p className="mt-4 max-w-3xl font-display text-[clamp(2rem,3.7vw,4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-skin-text-secondary">
              Análisis que explica. Automatización que ejecuta.
            </p>

            <div
              data-motion="hero-actions"
              className="mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap"
            >
              <a
                href="#proyectos"
                className="focus-ring inline-flex min-h-11 items-center justify-between gap-8 bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                Proyectos
                <ArrowRightIcon className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${PUBLIC_POSITIONING.contact.email}`}
                className="focus-ring inline-flex min-h-11 items-center justify-between gap-8 border border-skin-border-medium px-5 text-sm font-semibold text-skin-text transition-colors hover:bg-skin-secondary"
              >
                Contacto
                <ArrowRightIcon className="h-4 w-4" />
              </a>
              <a
                href="/CV_HoracioLaphitz.pdf"
                download
                className="focus-ring inline-flex min-h-11 items-center gap-2 px-5 text-sm font-semibold text-[#895137] transition-colors hover:bg-skin-secondary dark:text-[#c17d5b]"
              >
                <DownloadIcon className="h-4 w-4" />
                Descargar CV
              </a>
            </div>
          </div>

          <aside
            aria-label="Áreas de trabajo"
            className="self-stretch bg-[#171714] px-6 py-6 text-[#f4f1e9] sm:px-8 lg:flex lg:flex-col lg:justify-center lg:px-10"
          >
            <p className="mb-5 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-[#a66545]">
              Áreas de trabajo
            </p>
            <div>
              {capabilities.map(({ index, title, description }) => (
                <article
                  key={title}
                  className="grid grid-cols-[2rem_1fr] gap-4 border-t border-[#34332e] py-5 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <span className="text-xs font-semibold tracking-[0.16em] text-[#a66545]">
                    {index}
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-[#f4f1e9]">
                      {title}
                    </h2>
                    <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-[#96938b]">
                      {description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Hero;
