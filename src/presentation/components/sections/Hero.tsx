import { useState, useEffect } from "react";
import { PROFILE_DATA } from "@data/profile-data";

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center relative pt-14"
    >
      <div
        className={`mx-auto max-w-[760px] w-full px-6 py-20 text-center transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
      >
        <p className="text-sm font-semibold text-brand-primary uppercase tracking-widest mb-6">
          Data | Machine Learning | Systems
        </p>

        <h1
          className="font-bold text-skin-text mb-6 tracking-tight"
          style={{
            fontSize: "clamp(56px, 8vw, 96px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {PROFILE_DATA.name}
        </h1>

        <p className="text-xl text-skin-muted font-medium mb-4 tracking-wide">
          {PROFILE_DATA.title}
        </p>

        <p className="text-lg text-skin-muted max-w-xl mx-auto leading-relaxed mb-10">
          Construyo pipelines de datos y dashboards con Python, SQL, Power BI y Databricks — como el pipeline sobre 100k+ órdenes de e-commerce con tests en cada capa, o los KPIs de ventas en Power BI listos para dirección.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="#proyectos"
            className="px-6 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "var(--accent-primary)" }}
          >
            Ver proyectos
          </a>
          <a
            href="/CV_HoracioLaphitz.pdf"
            download
            className="text-sm font-semibold text-skin-text hover:text-brand-primary transition-colors duration-200"
          >
            Descargar CV ↓
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
