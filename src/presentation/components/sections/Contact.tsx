import { useScrollAnimation } from "@presentation/hooks/useScrollAnimation";
import { MailIcon, LinkedinIcon, GithubIcon } from "../ui/Icons";
import { PROFILE_DATA } from "@data/profile-data";

const Contact = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      id="contacto"
      className="bg-skin-secondary py-20 md:py-28"
    >
      <div className="mx-auto max-w-[980px] px-6">
        <div
          className={`transition-all duration-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
        >
          <h2
            className="font-bold text-skin-text tracking-tight mb-6"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.02em" }}
          >
            Contacto
          </h2>
          <p className="text-xl text-skin-muted mb-10 max-w-xl leading-relaxed">Disponibilidad Horaria: <span className="font-bold">Lunes a Sábados</span> de <span className="font-bold">08:00 a 18:00hs</span></p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:horaciolaphitz99@gmail.com"
              className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "var(--accent-primary)" }}
            >
              <MailIcon className="w-4 h-4" />
              Correo
            </a>
            <a
              href="https://www.linkedin.com/in/horacio-laphitz/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-skin-text bg-transparent border border-skin-border rounded-lg hover:bg-skin-primary transition-all duration-200"
            >
              <LinkedinIcon className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href={PROFILE_DATA.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-skin-text bg-transparent border border-skin-border rounded-lg hover:bg-skin-primary transition-all duration-200"
            >
              <GithubIcon className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
