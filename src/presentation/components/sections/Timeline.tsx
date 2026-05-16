import { useState, useEffect, useRef, useCallback } from "react";
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

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
    />
  </svg>
);

const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);

const BuildingOfficeIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
    />
  </svg>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

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
  const [visibleIndex, setVisibleIndex] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalTitleId = "cert-modal-title";

  // Credly script — load only once
  useEffect(() => {
    if (document.querySelector('script[src*="credly.com"]')) return;
    const script = document.createElement("script");
    script.src = "//cdn.credly.com/assets/utilities/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const filteredItems = [...TIMELINE_ITEMS]
    .filter((item) => activeFilter === "all" || item.type === activeFilter)
    .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

  const workCount = TIMELINE_ITEMS.filter((item) => item.type === "work").length;
  const certCount = TIMELINE_ITEMS.filter((item) => item.type === "certification").length;

  const handleScroll = useCallback((direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 340;
    container.scrollTo({
      left: direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  }, []);

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setShowLeftButton(container.scrollLeft > 10);
    setShowRightButton(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    // Approximate visible card index (card width ~340px + 24px gap)
    const cardWidth = 364;
    setVisibleIndex(Math.min(Math.floor(container.scrollLeft / cardWidth) + 1, filteredItems.length));
  }, [filteredItems.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState, { passive: true });
    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [filteredItems, updateScrollState]);

  // Keyboard: ArrowLeft/Right scroll carousel when modal is closed
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedCert) return;
      if (e.key === "ArrowLeft") handleScroll("left");
      if (e.key === "ArrowRight") handleScroll("right");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedCert, handleScroll]);

  // Modal: Escape to close + focus close button on open
  useEffect(() => {
    if (!selectedCert) return;
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedCert]);

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      id="timeline"
      className="relative bg-skin-secondary py-16 sm:py-20 lg:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div
          className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-skin-text mb-4">
            Trayectoria Laboral y Académica
          </h2>
        </div>

        <div
          className={`mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
          className={`mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveFilter("all")}
              aria-pressed={activeFilter === "all"}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeFilter === "all"
                  ? "bg-brand-primary text-skin-primary"
                  : "bg-skin-primary text-skin-text border border-skin-border hover:border-brand-primary"
                }`}
            >
              <span className="flex items-center gap-2">
                <ListBulletIcon className="w-4 h-4" />
                Todos ({TIMELINE_ITEMS.length})
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("work")}
              aria-pressed={activeFilter === "work"}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeFilter === "work"
                  ? "bg-brand-primary text-skin-primary"
                  : "bg-skin-primary text-skin-text border border-skin-border hover:border-brand-primary"
                }`}
            >
              <span className="flex items-center gap-2">
                <BriefcaseIcon className="w-4 h-4" />
                Experiencia ({workCount})
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("certification")}
              aria-pressed={activeFilter === "certification"}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeFilter === "certification"
                  ? "bg-brand-primary text-skin-primary"
                  : "bg-skin-primary text-skin-text border border-skin-border hover:border-brand-primary"
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
          className={`relative transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          {/* Scroll progress counter */}
          {filteredItems.length > 0 && (
            <div className="flex justify-end mb-2 pr-2">
              <span className="text-xs font-medium text-skin-muted tabular-nums" aria-live="polite" aria-atomic="true">
                {visibleIndex} / {filteredItems.length}
              </span>
            </div>
          )}

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

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-skin-muted gap-3">
              <BookOpenIcon className="w-10 h-10 opacity-40" />
              <p className="text-sm font-medium">No hay elementos para este filtro.</p>
            </div>
          )}

          <div
            ref={scrollContainerRef}
            className="overflow-x-auto pb-8 hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            aria-label="Carrusel de trayectoria"
          >
            <div className="relative inline-flex gap-6 px-4 min-w-full">
              <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />

              {filteredItems.map((item, index) => {
                const year = item.sortDate.getFullYear();
                return (
                  <div
                    key={`${item.period}-${item.role}-${index}`}
                    className={`relative flex-shrink-0 w-80 transition-all duration-700 hover:scale-105 ${isVisible ? "opacity-100" : "opacity-0"
                      }`}
                    style={{ transitionDelay: `${Math.min(index * 50, 500)}ms` }}
                  >
                    <div className="group bg-skin-primary border border-skin-border p-6 rounded-2xl hover:border-brand-primary transition-all duration-300 h-full">
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <div
                          className={`p-2.5 rounded-xl ${item.type === "work"
                              ? "bg-brand-primary/10 text-brand-primary"
                              : "bg-brand-accent/10 text-brand-accent"
                            }`}
                        >
                          {item.type === "work" ? (
                            <BriefcaseIcon className="w-5 h-5" />
                          ) : (
                            <BookOpenIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Year badge */}
                          <span className="text-xs font-bold text-skin-muted bg-skin-secondary px-2 py-0.5 rounded-md tabular-nums">
                            {year}
                          </span>
                          <span className="text-xs font-medium text-skin-muted uppercase tracking-wide">
                            {item.type === "work" ? "Experiencia" : "Certificación"}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary bg-brand-primary/10 px-3 py-1.5 rounded-lg">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          {item.period}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-skin-text mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-brand-primary transition-colors">
                        {item.role}
                      </h3>

                      <p className="text-sm font-semibold text-brand-primary mb-2 flex items-center gap-2">
                        <BuildingOfficeIcon className="w-4 h-4" />
                        {item.company}
                      </p>

                      {item.location && (
                        <p className="text-xs text-skin-muted mb-3 flex items-center gap-1.5 font-medium">
                          <MapPinIcon className="w-4 h-4" />
                          {item.location}
                        </p>
                      )}

                      {item.description && (
                        <p className="text-sm text-skin-muted mt-4 pt-4 border-t border-skin-border/50 line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {item.type === "certification" && item.certificateUrl && (
                        <button
                          onClick={() => setSelectedCert(item)}
                          className="mt-5 w-full inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-skin-primary text-sm font-semibold rounded-lg hover:bg-brand-hover transition-all duration-300 justify-center"
                        >
                          <EyeIcon className="w-4 h-4" />
                          Ver Certificado
                        </button>
                      )}
                    </div>

                    {/* Timeline dot — static, no animate-ping noise */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
                      <div
                        className={`w-4 h-4 rounded-full border-4 border-skin-secondary ${item.type === "work" ? "bg-brand-primary" : "bg-brand-accent"
                          }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedCert(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
        >
          <div
            className="relative bg-skin-primary rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-skin-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-skin-border bg-skin-secondary">
              <div>
                <h3 id={modalTitleId} className="text-lg font-bold text-skin-text">
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
                  ref={closeButtonRef}
                  onClick={() => setSelectedCert(null)}
                  aria-label="Cerrar certificado"
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
