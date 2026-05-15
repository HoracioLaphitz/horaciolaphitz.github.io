export const designSystem = {
  colors: {
    // Paleta profesional elegante
    background: {
      primary: "#FFFFFF",
      secondary: "#F8FAFC",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
    },
    brand: {
      primary: "#011627", // Azul muy oscuro - cabeceras, títulos
      secondary: "#2EC4B6", // Turquesa vibrante - detalles proyectos
      accent: "#E63946", // Rojo coral - CTAs críticos
      graphExtra: "#457B9D", // Azul medio - gráficos secundarios
    },
    neutral: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
      950: "#020617",
    },
    semantic: {
      primary: "#011627",
      secondary: "#2EC4B6",
      accent: "#E63946",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      text: "#0F172A",
      textMuted: "#475569",
      border: "#E2E8F0",
      borderMuted: "#CBD5E1",
    },
    interactive: {
      primary: "#011627",
      primaryHover: "#012840",
      secondary: "#2EC4B6",
      secondaryHover: "#26A89D",
      accent: "#E63946",
      accentHover: "#D32F3C",
      focus: "#457B9D",
      disabled: "#94A3B8",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "Consolas", "monospace"],
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
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
  spacing: {
    section: "py-20 lg:py-24",
    container: "max-w-7xl mx-auto px-6 lg:px-8",
    grid: "grid gap-8 lg:gap-12",
    card: "p-6 lg:p-8",
  },
  effects: {
    shadow: {
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg shadow-neutral-200/50 dark:shadow-neutral-900/50",
      xl: "shadow-xl shadow-neutral-200/50 dark:shadow-neutral-900/50",
    },
    transition: {
      fast: "transition-all duration-200 ease-out",
      normal: "transition-all duration-300 ease-out",
      slow: "transition-all duration-500 ease-out",
    },
    hover: {
      scale: "hover:scale-105",
      lift: "hover:-translate-y-1",
      glow: "hover:shadow-lg hover:shadow-neutral-400/25",
    },
  },
  components: {
    button: {
      primary:
        "inline-flex items-center justify-center px-6 py-3 bg-[#011627] hover:bg-[#012840] text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#457B9D] focus:ring-offset-2",
      accent:
        "inline-flex items-center justify-center px-6 py-3 bg-[#E63946] hover:bg-[#D32F3C] text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:ring-offset-2",
      secondary:
        "inline-flex items-center justify-center px-6 py-3 bg-[#2EC4B6] hover:bg-[#26A89D] text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:ring-offset-2",
      ghost:
        "inline-flex items-center justify-center px-6 py-3 text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-medium rounded-lg transition-all duration-200",
    },
    card: {
      base: "bg-white rounded-lg border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#2EC4B6]/30 transition-all duration-300",
      elevated:
        "bg-white rounded-lg shadow-lg border border-[#E2E8F0] hover:shadow-xl hover:border-[#2EC4B6]/40 transition-all duration-300",
    },
    input: {
      base: "w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#457B9D] focus:border-transparent transition-all duration-200",
    },
  },
};

export const commonClasses = {
  heading: {
    h1: "text-4xl lg:text-5xl xl:text-6xl font-bold text-[#011627] tracking-tight",
    h2: "text-3xl lg:text-4xl font-bold text-[#011627] tracking-tight",
    h3: "text-2xl lg:text-3xl font-semibold text-[#011627]",
    h4: "text-xl lg:text-2xl font-semibold text-[#0F172A]",
  },
  text: {
    body: "text-[#475569] leading-relaxed",
    bodyLarge: "text-lg text-[#475569] leading-relaxed",
    caption: "text-sm text-[#64748B]",
    muted: "text-[#94A3B8]",
  },
  container: {
    section: "py-20 lg:py-24",
    content: "max-w-7xl mx-auto px-6 lg:px-8",
    narrow: "max-w-4xl mx-auto px-6 lg:px-8",
  },
  background: {
    primary: "bg-white",
    secondary: "bg-[#F8FAFC]",
    card: "bg-white",
    overlay: "bg-[#011627]/50 backdrop-blur-sm",
  },
};
