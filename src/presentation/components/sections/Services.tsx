import { useScrollAnimation } from "@presentation/hooks/useScrollAnimation";

const ServerStackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
    </svg>
);

const CircleStackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
);

const ArrowPathIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);

const CpuChipIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
    </svg>
);

const ChartBarSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
);

const WrenchScrewdriverIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>
);

interface Service {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

const SERVICES: readonly Service[] = [
    {
        icon: ServerStackIcon,
        title: "Tango Software",
        description: "Instalación, Parametrización, Migración de datos, Configuración de procesos, Integraciones, Pruebas y puesta en marcha, Soporte y mantenimiento, Cumplimiento normativo."
    },
    {
        icon: CircleStackIcon,
        title: "Migración & Calidad de Datos en SQL",
        description: "Implementación de pipelines ETL/ELT con Databricks: desde extracción, limpieza y normalización hasta procesos empaquetados. Scripts SQL optimizados y análisis de datos."
    },
    {
        icon: ArrowPathIcon,
        title: "Integración & Reporting (BI)",
        description: "Conexión de bases de datos con plataformas BI y sistemas externos: configuración de APIs/ETL, modelos dimensionales y entrega de datasets listos para informes interactivos."
    },
    {
        icon: CpuChipIcon,
        title: "Análisis Avanzado & Machine Learning",
        description: "Proyectos de análisis y modelos supervisados para pronósticos y segmentación, desde prototipo hasta producción."
    },
    {
        icon: ChartBarSquareIcon,
        title: "Visualización y Reportes",
        description: "Definición de KPIs, diseño de dashboards y reportes ejecutivos; recomendaciones tecnológicas y entregables listos para decision-makers."
    },
    {
        icon: WrenchScrewdriverIcon,
        title: "Soporte Post-Implementación",
        description: "Resolución proactiva de incidentes, optimización de procesos, mejoras evolutivas y asistencia remota."
    }
] as const;

const Services = () => {
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.15 });

    return (
        <section
            ref={elementRef as React.RefObject<HTMLElement>}
            id="services"
            className="relative bg-skin-primary py-20 md:py-28"
        >
            <div className="mx-auto px-6 max-w-[980px]">

                <div className={`mb-12 lg:mb-16 transition-all duration-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <h2
                        className="font-bold text-skin-text tracking-tight"
                        style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.02em" }}
                    >
                        Servicios
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {SERVICES.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={service.title}
                                className={`transition-all duration-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                                style={{ transitionDelay: `${(index + 1) * 75}ms` }}
                            >
                                <div className="bg-skin-secondary rounded-xl p-5 border border-skin-border hover:border-skin-border-medium transition-all duration-200 h-full">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="text-skin-muted flex-shrink-0 pt-0.5">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-skin-text pt-0.5">
                                            {service.title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-skin-muted leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Services;
