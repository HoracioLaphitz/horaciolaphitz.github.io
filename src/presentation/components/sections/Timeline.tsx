import { useState, useEffect } from "react";
import { useScrollAnimation } from "@presentation/hooks/useScrollAnimation";
import { BriefcaseIcon, BookOpenIcon } from "../ui/Icons";

interface TimelineItem {
  period: string;
  role: string;
  company: string;
  location: string;
  description?: string;
  type: "work" | "certification";
  sortDate: Date;
  certificateUrl?: string;
  credlyBadgeId?: string;
}

type FilterType = "all" | "work" | "certification";

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const AwardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
    />
  </svg>
);

const ListBulletIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </svg>
);

// Credly Badges destacados - IDs reales de Credly
const CREDLY_BADGE_IDS = [
  "78a917fc-2fee-416b-a3c4-d14f3cd09541", // Python Project for Data Engineering
  "57d36636-8b10-4218-a641-7cd6fcf9d8fe", // Python for Data Science and AI
] as const;

const TIMELINE_ITEMS: readonly TimelineItem[] = [
  {
    period: "Dic 2025 – Mar 2026",
    role: "Data Entry Specialist",
    company: "Ucrop.it",
    location: "Remoto",
    description: "Procesamiento y validación de datos georreferenciados",
    type: "work",
    sortDate: new Date(2025, 11, 1),
  },
  {
    period: "Febrero 2026",
    role: "SQL con Databricks",
    company: "Lovelytics Latam",
    location: "",
    description: "Limpieza y validacion de datos con SQL en Databricks",
    type: "certification",
    sortDate: new Date(2026, 1, 1),
  },
  {
    period: "Ene 2021 – Nov 2025",
    role: "Técnico en Sistemas",
    company: "PcService Posadas",
    location: "Posadas",
    description:
      "Mantenimiento de hardware y servidores, optimización de sistemas",
    type: "work",
    sortDate: new Date(2025, 10, 1),
  },
  {
    period: "Abr 2024 – May 2024",
    role: "Data Entry",
    company: "Ucrop.it",
    location: "Remoto",
    description: "Entrada precisa y eficiente de datos georreferenciados",
    type: "work",
    sortDate: new Date(2024, 4, 1),
  },
  {
    period: "Jul 2019 – Dic 2019",
    role: "Capacitador Técnico en Sistemas",
    company: "Hospital Escuela Dr. Ramón Madariaga",
    location: "Posadas",
    description:
      "Coordinación de capacitación e implementación de sistema R.I.S.mi",
    type: "work",
    sortDate: new Date(2019, 11, 1),
  },
  {
    period: "Mar 2019 – Jun 2019",
    role: "Asistente Administrativo Contable",
    company: "Ministerio de Salud Pública de Misiones",
    location: "",
    description: "Gestión de compras, licitaciones y ERP",
    type: "work",
    sortDate: new Date(2019, 5, 1),
  },
  {
    period: "Mar 2025",
    role: "Business & Operations Management Excellence",
    company: "MTF Institute - Udemy",
    location: "",
    type: "certification",
    sortDate: new Date(2025, 2, 1),
    certificateUrl:
      "/Certificaciones/Certificate in Business & Operations Management Excellence.pdf",
  },
  {
    period: "Mar 2025",
    role: "Sales & Service Data Analysis & Analytics Expert",
    company: "MTF Institute - Udemy",
    location: "",
    type: "certification",
    sortDate: new Date(2025, 2, 1),
    certificateUrl:
      "/Certificaciones/Sales & Service Data Analysis & Analytics Expert.pdf",
  },
  {
    period: "Mar 2025",
    role: "Microsoft Office Mastery",
    company: "Sayman Creative Institute - Udemy",
    location: "",
    type: "certification",
    sortDate: new Date(2025, 2, 1),
    certificateUrl:
      "/Certificaciones/Microsoft Office Mastery Learn Word Excel and PowerPoint.pdf",
  },
  {
    period: "Mar 2025",
    role: "Professional Diploma in Corporate Management",
    company: "MTF Institute - Udemy",
    location: "",
    type: "certification",
    sortDate: new Date(2025, 2, 1),
    certificateUrl:
      "/Certificaciones/Prefesional diploma in corporate managemet.pdf",
  },
  {
    period: "May 2024",
    role: "Supervised Machine Learning",
    company: "Stanford University - Coursera",
    location: "",
    type: "certification",
    sortDate: new Date(2024, 4, 1),
    certificateUrl:
      "/Certificaciones/Supervised Machine Learning_ Regression and Classification.pdf",
  },
  {
    period: "Abr 2024",
    role: "Python for Data Engineering",
    company: "IBM - Coursera",
    location: "",
    type: "certification",
    sortDate: new Date(2024, 3, 1),
    certificateUrl: "/Certificaciones/IBM-python-data-engineering.pdf",
  },
  {
    period: "Mar 2024",
    role: "Certificado Profesional de Análisis de Datos",
    company: "Google Careers - Coursera",
    location: "",
    type: "certification",
    sortDate: new Date(2024, 2, 1),
    certificateUrl: "/Certificaciones/GOOGLE-PYTHON-CERTIFICATE.pdf",
  },
  {
    period: "Mar 2024",
    role: "Fundamentos de Ciencia de Datos",
    company: "Google Careers - Coursera",
    location: "",
    type: "certification",
    sortDate: new Date(2024, 2, 1),
    certificateUrl: "/Certificaciones/Fundamentos de ciencia de datos.pdf",
  },
  {
    period: "Feb 2024",
    role: "Python for Data Science, AI & Development",
    company: "IBM - Coursera",
    location: "",
    type: "certification",
    sortDate: new Date(2024, 1, 1),
    certificateUrl: "/Certificaciones/IBM-DATA SCIENCE - AI - DEVELOPMENT.pdf",
  },
  {
    period: "Feb 2024",
    role: "Análisis computacional de Datos en R",
    company: "Google Careers - Coursera",
    location: "",
    type: "certification",
    sortDate: new Date(2024, 1, 1),
    certificateUrl:
      "/Certificaciones/GOOGLE-Analisis-computacional-de-datos-R.pdf",
  },
  {
    period: "Feb 2024",
    role: "Curso Final de Análisis Computacional de Datos",
    company: "Google Careers - Coursera",
    location: "",
    type: "certification",
    sortDate: new Date(2024, 1, 1),
    certificateUrl:
      "/Certificaciones/Curso final de análisis computacional de datos completa un caso practico.pdf",
  },
  {
    period: "Ene 2024",
    role: "Go Beyond the Numbers: Translate Data into Insights",
    company: "Google Careers - Coursera",
    location: "",
    type: "certification",
    sortDate: new Date(2024, 0, 1),
    certificateUrl: "/Certificaciones/GoBeyondtheNumbersTranslateData.pdf",
  },
  {
    period: "Ene 2024",
    role: "Get Started with Python",
    company: "Google Careers - Coursera",
    location: "",
    type: "certification",
    sortDate: new Date(2024, 0, 1),
    certificateUrl: "/Certificaciones/GOOGLE-PYTHON-CERTIFICATE.pdf",
  },
  {
    period: "Ene 2024",
    role: "Tu Primera Experiencia como Analista de Datos",
    company: "Google Careers - Coursera",
    location: "",
    type: "certification",
    sortDate: new Date(2024, 0, 1),
    certificateUrl:
      "/Certificaciones/certificate-of-completion-for-tu-primera-experiencia-como-analista-de-datos.pdf",
  },
  {
    period: "Dic 2023",
    role: "Python Expertise",
    company: "Nicolas Schurmann - Udemy",
    location: "",
    type: "certification",
    sortDate: new Date(2023, 11, 1),
    certificateUrl: "/Certificaciones/Python-Developer-Udemy.pdf",
  },
  {
    period: "Nov 2023",
    role: "Introducción a Machine Learning",
    company: "Domestika",
    location: "",
    type: "certification",
    sortDate: new Date(2023, 10, 1),
  },
  {
    period: "Jul 2023",
    role: "Bases de Datos desde Cero",
    company: "Silicon Misiones",
    location: "",
    type: "certification",
    sortDate: new Date(2023, 6, 1),
    certificateUrl:
      "/Certificaciones/SILICON MISIONES- Certificado Digital Bases de Datos.pdf",
  },
  {
    period: "Mar 2023",
    role: "Data Analytics Nivel Growth",
    company: "Silicon Misiones",
    location: "",
    type: "certification",
    sortDate: new Date(2023, 2, 1),
    certificateUrl:
      "/Certificaciones/SILICON MISIONES-Certificado de Data & Analytics.pdf",
  },
  {
    period: "Dic 2022",
    role: "Introducción a la Programación",
    company: "Silicon Misiones",
    location: "",
    type: "certification",
    sortDate: new Date(2022, 11, 1),
    certificateUrl:
      "/Certificaciones/SILICON MISIONES- Certificado Laphitz Horacio Intro a la programacion.pdf",
  },
] as const;

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5L8.25 12l7.5-7.5"
    />
  </svg>
);

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
    />
  </svg>
);

const Timeline = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.15 });
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedCert, setSelectedCert] = useState<TimelineItem | null>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const scrollContainerRef = useState<HTMLDivElement | null>(null)[0];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//cdn.credly.com/assets/utilities/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const filteredItems = [...TIMELINE_ITEMS]
    .filter((item) => activeFilter === "all" || item.type === activeFilter)
    .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

  const workCount = TIMELINE_ITEMS.filter(
    (item) => item.type === "work"
  ).length;
  const certCount = TIMELINE_ITEMS.filter(
    (item) => item.type === "certification"
  ).length;

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("timeline-scroll-container");
    if (!container) return;

    const scrollAmount = 400;
    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  const updateScrollButtons = () => {
    const container = document.getElementById("timeline-scroll-container");
    if (!container) return;

    setShowLeftButton(container.scrollLeft > 10);
    setShowRightButton(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = document.getElementById("timeline-scroll-container");
    if (!container) return;

    updateScrollButtons();
    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [filteredItems]);

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      id="timeline"
      className="relative bg-skin-secondary py-16 sm:py-20 lg:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div
          className={`text-center mb-12 transition-all duration-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-skin-text mb-4">
            Trayectoria Laboral y Académica
          </h2>
        </div>

        <div
          className={`mb-12 transition-all duration-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <AwardIcon className="w-6 h-6 text-brand-accent" />
            <h3 className="text-xl font-bold text-skin-text">Insignias</h3>
            <AwardIcon className="w-6 h-6 text-brand-accent" />
          </div>

          <div className="flex flex-wrap justify-center gap-8 mb-6">
            {CREDLY_BADGE_IDS.map((badgeId) => (
              <div
                key={badgeId}
                className="credly-badge-container"
                data-iframe-width="200"
                data-iframe-height="320"
                data-share-badge-id={badgeId}
                data-share-badge-host="https://www.credly.com"
              />
            ))}

            {/* Insignias de Tango */}
            <div
              className="flex flex-col items-center justify-center"
              style={{ width: "200px", height: "320px" }}
            >
              <img
                src="/Certificaciones/Tango_Trainee.png"
                alt="Tango Trainee Badge"
                className="w-full h-auto object-contain"
                style={{ maxHeight: "200px" }}
              />
              <div className="text-center mt-2">
                <p className="text-sm font-semibold text-skin-text">
                  Tango Trainee
                </p>
                <p className="text-xs text-skin-muted">Tango</p>
              </div>
            </div>

            <div
              className="flex flex-col items-center justify-center"
              style={{ width: "200px", height: "320px" }}
            >
              <img
                src="/Certificaciones/Tango_Starter.png"
                alt="Tango Starter Badge"
                className="w-full h-auto object-contain"
                style={{ maxHeight: "200px" }}
              />
              <div className="text-center mt-2">
                <p className="text-sm font-semibold text-skin-text">
                  Tango Starter
                </p>
                <p className="text-xs text-skin-muted">Tango</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mb-8 transition-all duration-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-1 pb-2 text-sm font-semibold border-b-2 transition-all duration-300 ${
                activeFilter === "all"
                  ? "border-brand-primary text-skin-text"
                  : "border-transparent text-skin-muted hover:text-skin-text"
              }`}
            >
              <span className="flex items-center gap-2">
                <ListBulletIcon className="w-4 h-4" />
                Todos ({TIMELINE_ITEMS.length})
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("work")}
              className={`px-1 pb-2 text-sm font-semibold border-b-2 transition-all duration-300 ${
                activeFilter === "work"
                  ? "border-brand-primary text-skin-text"
                  : "border-transparent text-skin-muted hover:text-skin-text"
              }`}
            >
              <span className="flex items-center gap-2">
                <BriefcaseIcon className="w-4 h-4" />
                Experiencia ({workCount})
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("certification")}
              className={`px-1 pb-2 text-sm font-semibold border-b-2 transition-all duration-300 ${
                activeFilter === "certification"
                  ? "border-brand-primary text-skin-text"
                  : "border-transparent text-skin-muted hover:text-skin-text"
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpenIcon className="w-4 h-4" />
                Certificaciones ({certCount})
              </span>
            </button>
          </div>
        </div>

        <div
          className={`relative transition-all duration-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Botón Izquierdo */}
          {showLeftButton && (
            <button
              onClick={() => handleScroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-brand-primary text-skin-primary p-3 rounded-full shadow-lg hover:bg-brand-hover transition-all duration-300 hover:scale-110"
              aria-label="Desplazar a la izquierda"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
          )}

          {/* Botón Derecho */}
          {showRightButton && (
            <button
              onClick={() => handleScroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-brand-primary text-skin-primary p-3 rounded-full shadow-lg hover:bg-brand-hover transition-all duration-300 hover:scale-110"
              aria-label="Desplazar a la derecha"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          )}

          <div
            id="timeline-scroll-container"
            className="overflow-x-auto pb-8 hide-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="relative inline-flex gap-6 px-4 min-w-full">
              <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />

              {filteredItems.map((item, index) => (
                <div
                  key={`${item.period}-${item.role}-${index}`}
                  className={`relative flex-shrink-0 w-80 transition-all duration-200 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: `${Math.min(index * 50, 500)}ms` }}
                >
                  <div className="border-t-2 border-skin-border pt-5 h-full">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-skin-muted">
                        {item.period}
                      </span>
                      <span className="text-xs font-medium text-skin-muted uppercase tracking-wide">
                        {item.type === "work" ? "Experiencia" : "Certificación"}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-skin-text mb-1 line-clamp-2 min-h-[3.5rem]">
                      {item.role}
                    </h3>

                    <p className="text-sm text-skin-muted mb-2">
                      {item.company}
                    </p>

                    {item.location && (
                      <p className="text-xs text-skin-muted mb-3">
                        {item.location}
                      </p>
                    )}

                    {item.description && (
                      <p className="text-sm text-skin-muted mt-3 pt-3 border-t border-skin-border/50 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {item.type === "certification" && item.certificateUrl && (
                      <button
                        onClick={() => setSelectedCert(item)}
                        className="mt-4 text-sm font-semibold text-brand-primary hover:underline"
                      >
                        Ver certificado →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative bg-skin-primary rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-skin-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-skin-border bg-skin-secondary">
              <div>
                <h3 className="text-lg font-bold text-skin-text">
                  {selectedCert.role}
                </h3>
                <p className="text-sm text-skin-muted">
                  {selectedCert.company}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={selectedCert.certificateUrl}
                  download
                  className="px-4 py-2 bg-brand-primary text-skin-primary rounded-lg hover:bg-brand-hover transition-colors flex items-center gap-2 font-semibold"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Descargar
                </a>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 bg-skin-primary text-skin-text border border-skin-border rounded-lg hover:border-brand-primary transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="h-[calc(90vh-80px)] overflow-auto bg-gray-100">
              <iframe
                src={selectedCert.certificateUrl}
                className="w-full h-full"
                title={`Certificado: ${selectedCert.role}`}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
    </section>
  );
};

export default Timeline;
