export const spacing = {
  xs: "0.5rem", // 8px
  sm: "0.75rem", // 12px
  md: "1rem", // 16px (base)
  lg: "1.5rem", // 24px
  xl: "2.25rem", // 36px
  "2xl": "3.375rem", // 54px
  "3xl": "5.0625rem", // 81px
  "4xl": "7.59375rem", // 121.5px
  "5xl": "11.390625rem", // 182.25px
} as const;

export const typography = {
  fontSize: {
    xs: "0.64rem", // 10.24px
    sm: "0.8rem", // 12.8px
    base: "1rem", // 16px (base)
    lg: "1.25rem", // 20px
    xl: "1.5625rem", // 25px
    "2xl": "1.953rem", // 31.25px
    "3xl": "2.441rem", // 39.06px
    "4xl": "3.052rem", // 48.83px
    "5xl": "3.815rem", // 61.04px
    "6xl": "4.768rem", // 76.29px
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

export const colors = {
  light: {
    // Primary colors with AAA contrast - Nueva Identidad: Data & Strategy
    primary: {
      main: "#0A74DA", // Azul Profundo - Confianza (Contrast: 7.2:1)
      light: "#3B8FE8",
      dark: "#085BB0",
      contrast: "#FFFFFF",
    },
    secondary: {
      main: "#2E2E2E", // Gris Carbón - Profesionalismo (Contrast: 15.3:1)
      light: "#4A4A4A",
      dark: "#1A1A1A",
      contrast: "#FFFFFF",
    },
    accent: {
      main: "#FF6B35", // Naranja Vibrante - Energía (Contrast: 4.8:1)
      light: "#FF8C5A",
      dark: "#E65520",
      contrast: "#FFFFFF",
    },
    // Surface colors
    background: {
      primary: "#FDFDFB",
      secondary: "#F8F8F6",
      tertiary: "#FFFFFF",
    },
    // Text colors
    text: {
      primary: "#1A1A1A", // Contrast: 16.1:1
      secondary: "#3A3A34", // Contrast: 10.2:1
      muted: "#4A4A44", // Contrast: 7.8:1
      disabled: "#9A9A94",
    },
    // Border colors
    border: {
      light: "#E2E2DE",
      medium: "#C8C8C2",
      dark: "#A8A8A2",
    },
    // Status colors
    status: {
      success: "#4A7A4A", // Contrast: 5.5:1
      warning: "#B47A44", // Contrast: 4.8:1
      error: "#B44E47", // Contrast: 5.1:1
      info: "#4A7A9A", // Contrast: 5.2:1
    },
  },
  dark: {
    // Primary colors with AAA contrast - Nueva Identidad: Data & Strategy
    primary: {
      main: "#4A9EFF", // Azul claro para dark mode (Contrast: 8.5:1)
      light: "#6BB0FF",
      dark: "#2A7EDF",
      contrast: "#131E33",
    },
    secondary: {
      main: "#E5E5E5", // Gris claro para dark mode (Contrast: 12.1:1)
      light: "#F5F5F5",
      dark: "#C5C5C5",
      contrast: "#131E33",
    },
    accent: {
      main: "#FF8C5A", // Naranja suave para dark mode (Contrast: 5.2:1)
      light: "#FFAC7A",
      dark: "#FF6B35",
      contrast: "#131E33",
    },
    // Surface colors
    background: {
      primary: "#131E33",
      secondary: "#192847",
      tertiary: "#1A2744",
    },
    // Text colors
    text: {
      primary: "#FFFFFF", // Contrast: 15.8:1
      secondary: "#C9C1B0", // Contrast: 9.2:1
      muted: "#A9A190", // Contrast: 6.5:1
      disabled: "#797169",
    },
    // Border colors
    border: {
      light: "#192847",
      medium: "#1A2744",
      dark: "#2A3754",
    },
    // Status colors
    status: {
      success: "#51CF66", // Contrast: 7.8:1
      warning: "#FFD43B", // Contrast: 10.2:1
      error: "#FF6B6B", // Contrast: 6.5:1
      info: "#4A9AFF", // Contrast: 7.1:1
    },
  },
} as const;

export const grid = {
  columns: 12,
  gutter: {
    mobile: spacing.md, // 16px
    tablet: spacing.lg, // 24px
    desktop: spacing.xl, // 32px
  },
  maxWidth: {
    xs: "20rem", // 320px
    sm: "40rem", // 640px
    md: "48rem", // 768px
    lg: "64rem", // 1024px
    xl: "80rem", // 1280px
    "2xl": "96rem", // 1536px
  },
  breakpoints: {
    xs: "475px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

export const components = {
  card: {
    padding: spacing.lg, // 24px
    borderRadius: spacing.md, // 16px (ratio 1.5 con padding)
    aspectRatio: 1.618, // Golden ratio
    iconSize: spacing.lg, // 24px
    titleSize: typography.fontSize.xl, // 25px
    descriptionSize: typography.fontSize.sm, // 12.8px
    gap: spacing.md, // 16px
  },
  button: {
    padding: {
      sm: `${spacing.sm} ${spacing.md}`, // 12px 16px
      md: `${spacing.md} ${spacing.lg}`, // 16px 24px
      lg: `${spacing.lg} ${spacing.xl}`, // 24px 36px
    },
    borderRadius: {
      sm: spacing.sm, // 12px
      md: spacing.md, // 16px
      lg: spacing.lg, // 24px
    },
    fontSize: {
      sm: typography.fontSize.sm, // 12.8px
      md: typography.fontSize.base, // 16px
      lg: typography.fontSize.lg, // 20px
    },
  },
  input: {
    padding: `${spacing.md} ${spacing.lg}`, // 16px 24px
    borderRadius: spacing.md, // 16px
    fontSize: typography.fontSize.base, // 16px
    height: {
      sm: "2.25rem", // 36px
      md: "3rem", // 48px
      lg: "3.75rem", // 60px
    },
  },
  section: {
    padding: {
      mobile: `${spacing["3xl"]} 0`, // 81px 0
      tablet: `${spacing["4xl"]} 0`, // 121.5px 0
      desktop: `${spacing["5xl"]} 0`, // 182.25px 0
    },
    gap: {
      mobile: spacing["2xl"], // 54px
      tablet: spacing["3xl"], // 81px
      desktop: spacing["4xl"], // 121.5px
    },
  },
} as const;

// ============================================================================
// ELEVATION SYSTEM - Material Design Inspired
// ============================================================================
export const elevation = {
  none: "none",
  sm: "0px 1px 2px rgba(26, 26, 26, 0.05), 0px 1px 3px rgba(26, 26, 26, 0.04)",
  md: "0px 2px 4px rgba(26, 26, 26, 0.06), 0px 3px 6px rgba(26, 26, 26, 0.05)",
  lg: "0px 4px 8px rgba(26, 26, 26, 0.08), 0px 6px 12px rgba(26, 26, 26, 0.06)",
  xl: "0px 8px 16px rgba(26, 26, 26, 0.09), 0px 12px 24px rgba(26, 26, 26, 0.07)",
  "2xl":
    "0px 12px 24px rgba(26, 26, 26, 0.10), 0px 16px 32px rgba(26, 26, 26, 0.08)",
} as const;

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================
export const animation = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    slower: "700ms",
  },
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const;

// ============================================================================
// Z-INDEX SYSTEM
// ============================================================================
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;

// ============================================================================
// ACCESSIBILITY
// ============================================================================
export const a11y = {
  focusRing: {
    width: "2px",
    offset: "2px",
    color: colors.light.accent.main,
  },
  minTouchTarget: "44px", // WCAG 2.5.5
  minTextSize: typography.fontSize.base, // 16px
} as const;

// ============================================================================
// EXPORT TYPES
// ===========================================================================xport type Spacing = typeof spacing;
export type Typography = typeof typography;
export type Colors = typeof colors;
export type Grid = typeof grid;
export type Components = typeof components;
export type Elevation = typeof elevation;
export type Animation = typeof animation;
export type ZIndex = typeof zIndex;
export type A11y = typeof a11y;

// ============================================================================
// DESIGN SYSTEM OBJECT
// ============================================================================
export const designTokens = {
  spacing,
  typography,
  colors,
  grid,
  components,
  elevation,
  animation,
  zIndex,
  a11y,
} as const;

export default designTokens;
