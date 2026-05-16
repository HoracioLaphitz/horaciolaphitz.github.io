import { GithubIcon, LinkedinIcon, MailIcon } from "../ui/Icons";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-skin-secondary border-t border-skin-border">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Nombre */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-skin-text mb-1">
              Horacio Laphitz
            </h3>
            <a
              href="/cv-horacio-laphitz.pdf"
              download
              className="inline-flex items-center gap-1.5 text-sm text-brand-primary hover:text-brand-primary/80 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Descargar CV
            </a>
          </div>

          {/* Redes Sociales */}
          <div className="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/in/horacio-laphitz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-skin-muted hover:text-skin-accent transition-all duration-200 hover:scale-110"
              aria-label="LinkedIn"
            >
              <LinkedinIcon width="24" height="24" />
            </a>
            <a
              href="https://github.com/horaciolaphitz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-skin-muted hover:text-skin-accent transition-all duration-200 hover:scale-110"
              aria-label="GitHub"
            >
              <GithubIcon width="24" height="24" />
            </a>
            <a
              href="mailto:horaciolaphitz99@gmail.com"
              className="text-skin-muted hover:text-skin-accent transition-all duration-200 hover:scale-110"
              aria-label="Email"
            >
              <MailIcon width="24" height="24" />
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-skin-border/50 w-full">
            <p className="text-sm text-skin-muted text-center">
              © {currentYear}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
