/**
 * Design Tokens - Sistema de diseño elegante
 * Paleta inspirada en ColorHunt: Beige/Cream (Light) y Teal/Green (Dark)
 */

export const tokens = {
  // Colores principales
  colors: {
    // Light Mode - Elegant Beige/Cream
    light: {
      primary: "#B6AE9F", // Warm Beige
      secondary: "#C5C7BC", // Soft Gray
      tertiary: "#DEDED1", // Light Sage
      accent: "#FBF3D1", // Cream
      background: "#FDFDFB", // Off White
      surface: "#FFFFFF", // Pure White
      text: "#2C2C2C", // Dark Gray
      textMuted: "#6B6B65", // Medium Gray
      border: "#D8D8D2", // Light Border
      success: "#7FA87F", // Sage Green
      warning: "#D4A574", // Warm Tan
      error: "#D4756E", // Soft Red
    },

    // Dark Mode - Elegant Teal/Green
    dark: {
      primary: "#285A48", // Deep Teal
      secondary: "#408A71", // Forest Green
      tertiary: "#B0E4CC", // Mint
      accent: "#091413", // Dark Sage
      background: "#091413", // Deep Dark
      surface: "#0D1A17", // Dark Surface
      text: "#D4E4DF", // Light Text (reducido brillo)
      textMuted: "#9BAAA4", // Muted Text (reducido brillo)
      border: "#3A4A45", // Dark Border
      success: "#7FA87F", // Sage Green
      warning: "#D4A574", // Warm Tan
      error: "#E88B7F", // Soft Coral
    },
  },

  // Tipografía optimizada
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      mono: ["JetBrains Mono", "Consolas", "monospace"],
    },

    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.025em" }],
      sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.025em" }],
      base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
      lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.011em" }],
      xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.011em" }],
      "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.011em" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.011em" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.011em" }],
      "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.011em" }],
      "6xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.011em" }],
      "7xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.011em" }],
      "8xl": ["6rem", { lineHeight: "1.1", letterSpacing: "-0.011em" }],
    },

    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },
  },

  // Espaciado consistente
  spacing: {
    xs: "0.5rem", // 8px
    sm: "0.75rem", // 12px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "6rem", // 96px
    "5xl": "8rem", // 128px
  },

  // Bordes y radios
  borderRadius: {
    none: "0",
    sm: "0.25rem", // 4px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    full: "9999px",
  },

  // Sombras elegantes
  shadows: {
    sm: "0 1px 2px rgba(44, 44, 44, 0.04), 0 1px 3px rgba(44, 44, 44, 0.03)",
    md: "0 2px 4px rgba(44, 44, 44, 0.05), 0 3px 6px rgba(44, 44, 44, 0.04)",
    lg: "0 4px 8px rgba(44, 44, 44, 0.06), 0 6px 12px rgba(44, 44, 44, 0.05)",
    xl: "0 8px 16px rgba(44, 44, 44, 0.07), 0 12px 24px rgba(44, 44, 44, 0.06)",
  },

  // Transiciones suaves
  transitions: {
    fast: "all 0.15s ease-out",
    normal: "all 0.2s ease-out",
    slow: "all 0.3s ease-out",
  },

  // Breakpoints responsivos
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// Utilidades para componentes
export const componentStyles = {
  button: {
    base: "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
    primary:
      "bg-accent-primary text-white hover:opacity-90 focus:ring-accent-primary",
    secondary:
      "bg-transparent border border-skin-border text-skin-text hover:bg-skin-secondary focus:ring-accent-primary",
    ghost: "text-skin-text hover:bg-skin-secondary focus:ring-accent-primary",
  },

  card: {
    base: "bg-skin-secondary border border-skin-border transition-all duration-200 rounded-xl",
    elevated:
      "bg-skin-secondary shadow-md hover:shadow-lg border border-skin-border rounded-xl",
    interactive:
      "bg-skin-secondary border border-skin-border hover:border-accent-primary cursor-pointer rounded-xl",
  },

  input: {
    base: "w-full bg-skin-secondary border border-skin-border text-skin-text placeholder-skin-muted focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-colors duration-200 rounded-lg",
  },
} as const;

// Exportar tipos para TypeScript
export type ColorToken = keyof typeof tokens.colors;
export type SpacingToken = keyof typeof tokens.spacing;
export type TypographyToken = keyof typeof tokens.typography.fontSize;
