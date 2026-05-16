/**
 * Logger utility for production-safe logging
 * Only logs in development mode with sanitization of sensitive data
 */

const isDevelopment = import.meta.env.DEV;

// Lista de campos sensibles que nunca deben loggearse
const SENSITIVE_FIELDS = [
  "password",
  "token",
  "api_key",
  "apikey",
  "secret",
  "email",
  "phone",
  "access_key",
  "authorization",
];

/**
 * Sanitiza datos antes de loggear para evitar exposición de información sensible
 */
const sanitizeLogData = (data: any): any => {
  if (typeof data === "string") {
    // Redactar emails
    let sanitized = data.replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      "[EMAIL_REDACTED]"
    );

    // Redactar tokens/keys (patrones comunes)
    sanitized = sanitized.replace(
      /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
      "[TOKEN_REDACTED]"
    );

    return sanitized;
  }

  if (typeof data === "object" && data !== null) {
    const sanitized: any = Array.isArray(data) ? [] : {};

    for (const key in data) {
      const lowerKey = key.toLowerCase();

      // Redactar campos sensibles
      if (SENSITIVE_FIELDS.some((field) => lowerKey.includes(field))) {
        sanitized[key] = "[REDACTED]";
      } else {
        sanitized[key] = sanitizeLogData(data[key]);
      }
    }

    return sanitized;
  }

  return data;
};

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args.map(sanitizeLogData));
    }
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args.map(sanitizeLogData));
    }
  },

  error: (...args: any[]) => {
    // En producción, solo loggear errores genéricos
    if (isDevelopment) {
      console.error(...args.map(sanitizeLogData));
    } else {
      console.error("[ERROR]", "An error occurred. Please contact support.");
    }
  },

  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args.map(sanitizeLogData));
    }
  },

  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args.map(sanitizeLogData));
    }
  },
};
