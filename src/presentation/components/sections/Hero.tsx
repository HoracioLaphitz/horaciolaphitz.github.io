import { useState, useEffect } from "react";
import { GithubIcon, LinkedinIcon, MailIcon } from "../ui/Icons";
import { PROFILE_DATA } from "@data/profile-data";

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center relative pt-14"
    >
      <div className="mx-auto max-w-[980px] w-full px-6 py-20 lg:py-0">
        <div
          className={`grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16 items-center transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Content */}
          <div>
            <h1
              className="font-bold text-skin-text mb-4 tracking-tight"
              style={{
                fontSize: "clamp(56px, 8vw, 96px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              {PROFILE_DATA.name}
            </h1>

            <p className="text-xl text-skin-muted font-medium mb-6 tracking-wide">
              {PROFILE_DATA.title}
            </p>

            <p className="text-lg text-skin-muted max-w-2xl leading-relaxed mb-10">
              Construyo pipelines donde los datos de tu empresa alimentan modelos
              de lenguaje — RAG, chatbots internos y reportes que se generan solos.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#proyectos"
                className="px-6 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "var(--accent-primary)" }}
              >
                Ver proyectos
              </a>
              <a
                href="/CV-HoracioNahuelLaphitz.pdf"
                download
                className="px-6 py-3 text-sm font-semibold text-skin-text bg-transparent border border-skin-border rounded-lg hover:bg-skin-secondary transition-all duration-200"
              >
                Descargar CV
              </a>
            </div>

            <div className="flex gap-3">
              <a
                href={PROFILE_DATA.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 flex items-center justify-center text-skin-muted hover:text-skin-text border border-skin-border rounded-lg hover:border-skin-border-medium transition-all duration-200"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href={PROFILE_DATA.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 flex items-center justify-center text-skin-muted hover:text-skin-text border border-skin-border rounded-lg hover:border-skin-border-medium transition-all duration-200"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${PROFILE_DATA.contact.email}`}
                aria-label="Email"
                className="w-10 h-10 flex items-center justify-center text-skin-muted hover:text-skin-text border border-skin-border rounded-lg hover:border-skin-border-medium transition-all duration-200"
              >
                <MailIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Profile Image */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden border border-skin-border bg-skin-secondary">
              <img
                src="/img/profile.png"
                alt="Horacio Laphitz"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
