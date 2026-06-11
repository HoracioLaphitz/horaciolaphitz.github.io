import { useState, useEffect, useRef } from "react";
import type { FormEvent as ReactFormEvent } from "react";
import {
  MailIcon,
  LinkedinIcon,
  GithubIcon,
  SendIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "../ui/Icons";
import { useScrollAnimation } from "@presentation/hooks/useScrollAnimation";

// Constants
const REDIRECT_DELAY = 2000; // 2 segundos

// Types
type SubmitStatus = "idle" | "success" | "error";

interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
}

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mqaqqynp";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const badgeRef = useRef<HTMLDivElement>(null);

  const contactInfo: ContactInfo = {
    email: "horaciolaphitz99@gmail.com",
    linkedin: "https://www.linkedin.com/in/horacio-laphitz/",
    github: "https://github.com/horaciolaphitz",
  };

  useEffect(() => {
    if (
      badgeRef.current &&
      !document.querySelector('script[src*="linkedin.com/badges"]')
    ) {
      const script = document.createElement("script");
      script.src = "https://platform.linkedin.com/badges/js/profile.js";
      script.async = true;
      script.defer = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }
  }, []);

  const handleSubmit = async (e: ReactFormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setSubmitStatus("success");
        form.reset();

        setTimeout(() => {
          window.location.href = "/gracias";
        }, REDIRECT_DELAY);
      } else {
        const data = await response.json();
        throw new Error(data?.error || "Error al enviar el formulario");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Hubo un error al enviar el mensaje. Por favor, intentá nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      id="contacto"
      className="relative bg-skin-primary py-16 sm:py-20 lg:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-skin-text mb-4">
            Contacto
          </h2>
          <p className="text-lg text-skin-muted max-w-2xl mx-auto">
            ¿Trabajamos Juntos? Acá podés contactarme.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div
            className={`transition-all duration-700 delay-200 ${isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-8"
              }`}
          >
            <form
              onSubmit={handleSubmit}
              action={FORMSPREE_ENDPOINT}
              method="POST"
              className="space-y-6"
            >
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-skin-text mb-2"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  disabled={isSubmitting}
                  className="input px-4 py-3"
                  placeholder="Tu nombre"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-skin-text mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  disabled={isSubmitting}
                  className="input px-4 py-3"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-skin-text mb-2"
                >
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  disabled={isSubmitting}
                  className="input px-4 py-3"
                  placeholder="Asunto del mensaje"
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-skin-text mb-2"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  disabled={isSubmitting}
                  className="input px-4 py-3 resize-none"
                  placeholder="Tu mensaje..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <SendIcon className="w-5 h-5" />
                    Enviar Mensaje
                  </>
                )}
              </button>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="flex items-center gap-2 p-4 bg-status-success/10 border border-status-success rounded-lg text-status-success">
                  <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">
                    ¡Mensaje enviado con éxito! Redirigiendo...
                  </p>
                </div>
              )}

              {submitStatus === "error" && errorMessage && (
                <div className="flex items-center gap-2 p-4 bg-status-error/10 border border-status-error rounded-lg text-status-error">
                  <XCircleIcon className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div
            className={`space-y-8 transition-all duration-700 delay-300 ${isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-8"
              }`}
          >
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-skin-text mb-4">
                Información de Contacto
              </h3>

              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 p-4 bg-skin-secondary rounded-lg hover:bg-skin-tertiary transition-colors group"
              >
                <MailIcon className="w-6 h-6 text-brand-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm text-skin-muted">Email</p>
                  <p className="text-skin-text font-medium">
                    {contactInfo.email}
                  </p>
                </div>
              </a>

              <a
                href={contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-skin-secondary rounded-lg hover:bg-skin-tertiary transition-colors group"
              >
                <LinkedinIcon className="w-6 h-6 text-brand-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm text-skin-muted">LinkedIn</p>
                  <p className="text-skin-text font-medium">Horacio Laphitz</p>
                </div>
              </a>

              <a
                href={contactInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-skin-secondary rounded-lg hover:bg-skin-tertiary transition-colors group"
              >
                <GithubIcon className="w-6 h-6 text-brand-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm text-skin-muted">GitHub</p>
                  <p className="text-skin-text font-medium">@horaciolaphitz</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
