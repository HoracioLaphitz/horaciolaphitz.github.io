import {
  MailIcon,
  LinkedinIcon,
  GithubIcon,
  ArrowRightIcon,
  DownloadIcon,
} from "@presentation/components/ui/Icons";
import { PROFILE_DATA } from "@data/profile-data";
import { PUBLIC_POSITIONING } from "@data/public-positioning.v1";

const Contact = () => {
  return (
    <section
      id="contacto"
      className="bg-skin-primary py-12 sm:py-14 lg:py-[clamp(3rem,7vh,5rem)]"
    >
      <div className="mx-auto w-full max-w-content px-4 sm:px-6 lg:max-w-container-xl lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.9fr)] lg:items-end lg:gap-16">
          <div className="max-w-3xl">
            <h2
              className="mb-4 text-display-sm font-bold tracking-tight text-skin-text"
              style={{ letterSpacing: "-0.02em" }}
            >
              ¡Hablemos!
            </h2>
            <p className="text-base font-normal leading-relaxed text-skin-muted">
              Disponible para roles de análisis de datos, automatización e IA
              aplicada. Remoto o híbrido desde Posadas, Argentina.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <a
              href={`mailto:${PUBLIC_POSITIONING.contact.email}`}
              className="focus-ring inline-flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-white bg-brand-primary hover:bg-brand-hover rounded-full transition-all duration-200 shadow-sm hover:shadow"
            >
              <MailIcon className="w-4 h-4" />
              Enviar correo
              <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a
              href="/CV_HoracioLaphitz.pdf"
              download
              className="focus-ring inline-flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-skin-text bg-skin-secondary/70 border border-skin-border/50 rounded-full hover:bg-skin-secondary hover:border-skin-border-medium transition-all duration-200"
            >
              <DownloadIcon className="w-4 h-4" />
              Descargar CV
            </a>
            <a
              href={PUBLIC_POSITIONING.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-skin-text bg-skin-secondary/70 border border-skin-border/50 rounded-full hover:bg-skin-secondary hover:border-skin-border-medium transition-all duration-200"
            >
              <LinkedinIcon className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href={PUBLIC_POSITIONING.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-skin-text bg-skin-secondary/70 border border-skin-border/50 rounded-full hover:bg-skin-secondary hover:border-skin-border-medium transition-all duration-200"
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
