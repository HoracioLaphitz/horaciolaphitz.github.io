/**
 * HeroSection Component
 * Sección Hero con nueva identidad: Data & Strategy
 * Propuesta de Valor: "Datos claros, decisiones poderosas"
 */

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className = "" }: HeroSectionProps) {
  return (
    <section
      className={`
        relative overflow-hidden
        py-5xl lg:py-[200px]
        ${className}
      `}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A74DA]/5 via-transparent to-[#FF6B35]/5" />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#0A74DA]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-md lg:px-xl relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <div className="inline-block mb-lg">
            <span
              className="
              px-lg py-sm
              bg-gradient-to-r from-[#0A74DA] to-[#085BB0]
              text-white
              rounded-full
              text-sm font-semibold
              shadow-lg
            "
            >
              Data & Strategy
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="
            text-4xl md:text-5xl lg:text-6xl
            font-display font-bold
            text-[#2E2E2E]
            mb-lg
            leading-tight
          "
          >
            Datos claros,{" "}
            <span
              className="
              bg-gradient-to-r from-[#0A74DA] to-[#FF6B35]
              bg-clip-text text-transparent
            "
            >
              decisiones poderosas
            </span>
          </h1>

          {/* Elevator Pitch */}
          <p
            className="
            text-lg md:text-xl
            text-[#2E2E2E]/80
            font-body
            mb-2xl
            max-w-3xl mx-auto
            leading-relaxed
          "
          >
            Soy <strong className="text-[#0A74DA]">Horacio Laphitz</strong>,
            especialista en análisis de datos y asistencia contable. Con un
            enfoque estratégico y visual, ayudo a empresas a{" "}
            <strong className="text-[#FF6B35]">
              convertir números en decisiones claras
            </strong>
            .
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-md justify-center items-center">
            <a
              href="#proyectos"
              className="
                px-xl py-md
                bg-gradient-to-r from-[#0A74DA] to-[#085BB0]
                text-white
                rounded-xl
                font-semibold
                shadow-lg
                transform transition-all duration-300
                hover:scale-105 hover:shadow-xl
                inline-flex items-center gap-sm
              "
            >
              Ver Proyectos
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>

            <a
              href="#contacto"
              className="
                px-xl py-md
                bg-white
                text-[#0A74DA]
                border-2 border-[#0A74DA]
                rounded-xl
                font-semibold
                transform transition-all duration-300
                hover:bg-[#0A74DA] hover:text-white
                inline-flex items-center gap-sm
              "
            >
              Contactar
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-4xl pt-2xl border-t border-[#2E2E2E]/10">
            <div className="flex flex-wrap justify-center gap-xl text-center">
              <div>
                <div className="text-3xl font-bold text-[#0A74DA] font-display">
                  15+
                </div>
                <div className="text-sm text-[#2E2E2E]/60 mt-xs">
                  Proyectos Completados
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#FF6B35] font-display">
                  +30%
                </div>
                <div className="text-sm text-[#2E2E2E]/60 mt-xs">
                  Mejora Promedio
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#2E2E2E] font-display">
                  100%
                </div>
                <div className="text-sm text-[#2E2E2E]/60 mt-xs">
                  Clientes Satisfechos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
