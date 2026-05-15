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
import { logger } from "@shared/utils/logger";
import { useScrollAnimation } from "@presentation/hooks/useScrollAnimation";

// Constants
const RATE_LIMIT_KEY = "contact_form_last_submit";
const RATE_LIMIT_DURATION = 60000; // 1 minuto entre envíos
const REQUEST_TIMEOUT = 10000; // 10 segundos
const REDIRECT_DELAY = 2000; // 2 segundos

// Types
type SubmitStatus = "idle" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
}

// Validation functions (Single Responsibility Principle)
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};

const validateName = (name: string): ValidationResult => {
  if (name.length < 2) {
    return {
      isValid: false,
      error: "El nombre debe tener al menos 2 caracteres.",
    };
  }
  if (name.length > 100) {
    return {
      isValid: false,
      error: "El nombre no puede exceder 100 caracteres.",
    };
  }
  return { isValid: true };
};

const validateEmailField = (email: string): ValidationResult => {
  if (!validateEmail(email)) {
    return { isValid: false, error: "Por favor, ingresa un email válido." };
  }
  return { isValid: true };
};

const validateMessage = (message: string): ValidationResult => {
  if (message.length < 10) {
    return {
      isValid: false,
      error: "El mensaje debe tener al menos 10 caracteres.",
    };
  }
  if (message.length > 5000) {
    return {
      isValid: false,
      error: "El mensaje no puede exceder 5000 caracteres.",
    };
  }
  return { isValid: true };
};

// Rate limiting functions
const checkRateLimit = (): boolean => {
  if (typeof window === "undefined") return true;

  const lastSubmit = localStorage.getItem(RATE_LIMIT_KEY);
  if (!lastSubmit) return true;

  const timeSinceLastSubmit = Date.now() - parseInt(lastSubmit, 10);
  return timeSinceLastSubmit >= RATE_LIMIT_DURATION;
};

const saveRateLimitTimestamp = (): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
  }
};

// API configuration
const getApiKey = (): string | undefined => {
  return import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY;
};

const isApiConfigured = (apiKey: string | undefined): boolean => {
  return Boolean(
    apiKey && apiKey.length > 0 && !apiKey.includes("your_web3forms")
  );
};

// Form submission
const createFormData = (
  data: FormData,
  apiKey: string
): globalThis.FormData => {
  const formData = new globalThis.FormData();
  formData.append("access_key", apiKey);
  formData.append("name", sanitizeInput(data.name));
  formData.append("email", sanitizeInput(data.email));
  formData.append("subject", `Portfolio: ${sanitizeInput(data.subject)}`);
  formData.append("message", sanitizeInput(data.message));
  formData.append("from_name", sanitizeInput(data.name));
  formData.append("redirect", window.location.origin + "/gracias");
  formData.append("botcheck", "");
  return formData;
};

const submitToApi = async (
  formData: globalThis.FormData
): Promise<{ success: boolean; message?: string }> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

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

  const apiKey = getApiKey();
  const isConfigured = isApiConfigured(apiKey);

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

    // Early return: Check configuration
    if (!isConfigured) {
      setSubmitStatus("error");
      setErrorMessage("Por favor, contacta directamente por email.");
      return;
    }

    // Early return: Check rate limiting
    if (!checkRateLimit()) {
      setSubmitStatus("error");
      setErrorMessage(
        "Por favor, espera un minuto antes de enviar otro mensaje."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const form = e.currentTarget;
      const formData: FormData = {
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
        message: (form.elements.namedItem("message") as HTMLTextAreaElement)
          .value,
      };

      // Validate all fields with early returns
      const nameValidation = validateName(formData.name);
      if (!nameValidation.isValid) {
        setSubmitStatus("error");
        setErrorMessage(nameValidation.error!);
        return;
      }

      const emailValidation = validateEmailField(formData.email);
      if (!emailValidation.isValid) {
        setSubmitStatus("error");
        setErrorMessage(emailValidation.error!);
        return;
      }

      const messageValidation = validateMessage(formData.message);
      if (!messageValidation.isValid) {
        setSubmitStatus("error");
        setErrorMessage(messageValidation.error!);
        return;
      }

      // Submit form
      const sanitizedFormData = createFormData(formData, apiKey!);
      const result = await submitToApi(sanitizedFormData);

      if (!result.success) {
        throw new Error(result.message || "Error al enviar el formulario");
      }

      // Success
      setSubmitStatus("success");
      form.reset();
      saveRateLimitTimestamp();

      setTimeout(() => {
        window.location.href = "/gracias";
      }, REDIRECT_DELAY);
    } catch (error) {
      logger.error("Error al enviar formulario:", error);
      setSubmitStatus("error");

      if (error instanceof Error && error.name === "AbortError") {
        setErrorMessage(
          "La solicitud tardó demasiado. Por favor, verifica tu conexión e intenta nuevamente."
        );
      } else {
        setErrorMessage(
          "Hubo un error al enviar el mensaje. Por favor, intenta nuevamente o contáctame directamente por email."
        );
      }
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
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-skin-text mb-4">
            Contacto
          </h2>
          <p className="text-lg text-skin-muted max-w-2xl mx-auto">
            ¿alguna pregunta o proyecto en mente? Acá podés contactarme.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
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
                disabled={isSubmitting || !isConfigured}
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

              {!isConfigured && (
                <div className="p-4 bg-status-warning/10 border border-status-warning rounded-lg text-status-warning text-sm">
                  El formulario no está configurado. Por favor, contacta
                  directamente por email.
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div
            className={`space-y-8 transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            {/* Contact Methods */}
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
