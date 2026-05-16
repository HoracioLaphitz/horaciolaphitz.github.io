/**
 * Input Sanitization and Validation Utilities
 * Protección contra XSS, injection attacks y spam
 */

import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitiza input de usuario de forma robusta
 */
export const sanitizeInput = (
  input: string,
  maxLength: number = 5000
): string => {
  if (!input || typeof input !== "string") return "";

  // 1. Trim whitespace
  let sanitized = input.trim();

  // 2. Limitar longitud
  sanitized = sanitized.slice(0, maxLength);

  // 3. Normalizar Unicode (prevenir ataques de homógrafos)
  sanitized = sanitized.normalize("NFC");

  // 4. Sanitizar con DOMPurify (eliminar HTML/scripts)
  sanitized = DOMPurify.sanitize(sanitized, {
    ALLOWED_TAGS: [], // No permitir ningún tag HTML
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  // 5. Escapar caracteres especiales adicionales
  sanitized = sanitized
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "");

  // 6. Remover caracteres de control
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, "");

  return sanitized;
};

/**
 * Valida nombre de persona
 */
export const validateName = (name: string): boolean => {
  if (!name || typeof name !== "string") return false;

  // Solo letras, espacios, guiones, apóstrofes y caracteres acentuados
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,100}$/;

  if (!nameRegex.test(name)) return false;

  // No permitir espacios dobles o múltiples
  if (name.includes("  ")) return false;

  // No permitir solo espacios o caracteres especiales
  if (!/[a-zA-ZÀ-ÿ]/.test(name)) return false;

  return true;
};

/**
 * Valida email con protección contra temporales
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") return false;

  // RFC 5322 compliant (simplificado pero robusto)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) return false;

  // Validar longitud total
  if (email.length > 254) return false;

  // Validar partes
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return false;
  if (localPart.length > 64) return false;

  // Bloquear dominios de email temporal conocidos
  const tempDomains = [
    "tempmail.com",
    "guerrillamail.com",
    "10minutemail.com",
    "mailinator.com",
    "throwaway.email",
    "temp-mail.org",
    "maildrop.cc",
    "yopmail.com",
    "trashmail.com",
    "getnada.com",
  ];

  const emailDomain = domain.toLowerCase();
  if (tempDomains.some((temp) => emailDomain.includes(temp))) {
    return false;
  }

  return true;
};

/**
 * Valida mensaje con detección de spam
 */
export const validateMessage = (message: string): boolean => {
  if (!message || typeof message !== "string") return false;

  // Validar longitud
  if (message.length < 10 || message.length > 5000) return false;

  // Detectar spam patterns comunes
  const spamPatterns = [
    /viagra/gi,
    /cialis/gi,
    /casino/gi,
    /\b(buy|cheap|discount)\s+(now|today)\b/gi,
    /click\s+here/gi,
    /\b(earn|make)\s+\$?\d+/gi,
    /\b(winner|congratulations|claim|prize)\b/gi,
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(message)) return false;
  }

  // Limitar número de URLs (máximo 2)
  const urlMatches = message.match(/(http|https):\/\/[^\s]+/g);
  if (urlMatches && urlMatches.length > 2) return false;

  // Detectar repetición excesiva de caracteres
  if (/(.)\1{10,}/.test(message)) return false;

  // Detectar mayúsculas excesivas (más del 50%)
  const upperCaseCount = (message.match(/[A-Z]/g) || []).length;
  const letterCount = (message.match(/[a-zA-Z]/g) || []).length;
  if (letterCount > 0 && upperCaseCount / letterCount > 0.5) return false;

  return true;
};

/**
 * Valida asunto del mensaje
 */
export const validateSubject = (subject: string): boolean => {
  if (!subject || typeof subject !== "string") return false;

  // Longitud entre 3 y 200 caracteres
  if (subject.length < 3 || subject.length > 200) return false;

  // No permitir solo espacios o caracteres especiales
  if (!/[a-zA-ZÀ-ÿ0-9]/.test(subject)) return false;

  return true;
};

/**
 * Valida tiempo de llenado del formulario (anti-bot)
 */
export const validateFormTiming = (
  startTime: number
): {
  isValid: boolean;
  error?: string;
} => {
  const fillTime = Date.now() - startTime;
  const MIN_FILL_TIME = 3000; // 3 segundos mínimo
  const MAX_FILL_TIME = 3600000; // 1 hora máximo

  if (fillTime < MIN_FILL_TIME) {
    return {
      isValid: false,
      error: "Por favor, tómate tu tiempo para completar el formulario.",
    };
  }

  if (fillTime > MAX_FILL_TIME) {
    return {
      isValid: false,
      error: "La sesión ha expirado. Por favor, recarga la página.",
    };
  }

  return { isValid: true };
};

/**
 * Genera un token simple de sesión (anti-CSRF básico)
 */
export const generateSessionToken = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return btoa(`${timestamp}-${random}`);
};

/**
 * Valida token de sesión
 */
export const validateSessionToken = (token: string): boolean => {
  try {
    const decoded = atob(token);
    const [timestamp] = decoded.split("-");
    const tokenAge = Date.now() - parseInt(timestamp, 10);

    // Token válido por 1 hora
    return tokenAge < 3600000;
  } catch {
    return false;
  }
};
