import { useState, useEffect } from "react";
import { GithubIcon, LinkedinIcon, MailIcon } from "../ui/Icons";
import { PROFILE_DATA } from "@data/profile-data";

// Types
interface SocialLink {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

// Configuration from Profile Entity
const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    href: PROFILE_DATA.contact.github,
    icon: GithubIcon,
    label: "GitHub",
  },
  {
    href: PROFILE_DATA.contact.linkedin,
    icon: LinkedinIcon,
    label: "LinkedIn",
  },
  {
    href: `mailto:${PROFILE_DATA.contact.email}`,
    icon: MailIcon,
    label: "Email",
  },
] as const;

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-32 pb-20 px-6"
    >
      {/* Subtle gradient background - minimal noise */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/[0.02] to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div
          className={`grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16 items-center transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          {/* Content */}
          <div>
            {/* Name - Strong typography */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-skin-text tracking-tight mb-6">
              Horacio Laphitz
            </h1>

            {/* Role - Clean subtitle */}
            <p className="text-xl sm:text-2xl text-skin-muted font-medium mb-8 tracking-wide">
              Data Analyst | BI & Process Automation
            </p>

            {/* Value proposition - Controlled spacing */}
            <p className="text-lg sm:text-xl text-skin-muted max-w-3xl leading-relaxed mb-12">
              Analizo, automatizo y visualizo datos.
              Python | SQL | Power BI | Machine Learning aplicado a problemas reales.
            </p>

            {/* Tech stack - Minimal badges */}
            <div className="flex flex-wrap gap-3 mb-12">
              {["Python", "SQL", "Power BI", "Excel", "Machine Learning"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 text-sm font-medium text-skin-muted bg-skin-secondary/50 border border-skin-border rounded-lg"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>

            {/* CTAs - Strong contrast */}
            <div className="flex flex-wrap gap-4 mb-16">
              <a
                href="#proyectos"
                className="px-6 py-3 bg-skin-accent text-white font-semibold rounded-lg hover:bg-skin-accent/90 transition-colors duration-200"
              >
                Proyectos
              </a>
              <a
                href="/CV-HoracioNahuelLaphitz.pdf"
                download
                className="px-6 py-3 bg-skin-secondary text-skin-text font-semibold border border-skin-border rounded-lg hover:bg-skin-secondary/80 transition-colors duration-200"
              >
                CV
              </a>
            </div>

            {/* Social links - Clean icons only */}
            <div className="flex gap-4">
              {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center text-skin-muted hover:text-skin-accent border border-skin-border rounded-lg hover:border-skin-accent transition-all duration-200"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Profile Image - Subtle on the right */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group">
              {/* Subtle glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-skin-accent/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Image container */}
              <div className="relative w-72 h-72 rounded-2xl overflow-hidden border border-skin-border bg-skin-secondary/30 backdrop-blur-sm">
                <img
                  src="/img/profile.png"
                  alt="Horacio Laphitz"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                />

                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-skin-primary/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
