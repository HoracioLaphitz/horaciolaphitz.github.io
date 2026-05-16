/**
 * Email Obfuscation Utilities
 * Protección contra scraping de bots y spam
 */

import { useState, useEffect } from "react";

/**
 * Ofusca un email mostrando solo los primeros caracteres
 */
export const obfuscateEmail = (email: string): string => {
  const [user, domain] = email.split("@");
  const visibleChars = 3;
  const obfuscatedUser = user.slice(0, visibleChars) + "***";
  return `${obfuscatedUser}@${domain}`;
};

/**
 * Decodifica el email desde base64
 * Email codificado: horaciolaphitz99@gmail.com
 */
export const decodeEmail = (): string => {
  const encoded = "aG9yYWNpb2xhcGhpdHo5OUBnbWFpbC5jb20=";
  try {
    return atob(encoded);
  } catch {
    return "";
  }
};

/**
 * Hook para obtener el email de forma segura
 * Solo se decodifica en el cliente, no en SSR
 */
export const useSecureEmail = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Pequeño delay para dificultar scraping automatizado
    const timer = setTimeout(() => {
      setEmail(decodeEmail());
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { email, isLoading };
};

/**
 * Componente de link de email con ofuscación
 */
interface EmailLinkProps {
  className?: string;
  showObfuscated?: boolean;
  children?: React.ReactNode;
}

export const EmailLink = ({
  className = "",
  showObfuscated = true,
  children,
}: EmailLinkProps) => {
  const { email, isLoading } = useSecureEmail();

  if (isLoading) {
    return <span className={className}>Cargando...</span>;
  }

  if (!email) {
    return <span className={className}>Email no disponible</span>;
  }

  return (
    <a href={`mailto:${email}`} className={className} rel="noopener noreferrer">
      {children || (showObfuscated ? obfuscateEmail(email) : email)}
    </a>
  );
};
