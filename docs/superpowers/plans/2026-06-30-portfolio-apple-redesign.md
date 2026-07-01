# Portfolio Apple Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar el portfolio con filosofía Apple — paleta limpia, tipografía dominante, espaciado generoso — para consolidar el perfil "Applied GenAI Data Analyst" y maximizar conversión recruiter → contacto.

**Architecture:** Se reemplazan CSS custom properties y componentes de presentación. La arquitectura Clean/Hexagonal (domain/application/infrastructure) permanece intacta. Todos los cambios son en `src/presentation/` y `src/data/` exclusivamente.

**Tech Stack:** Astro 5, React 18, TypeScript, Tailwind CSS 3, Inter (Google Fonts, ya cargado).

## Global Constraints

- Container max-width: `980px` en todas las secciones (apple.com standard)
- Secciones padding vertical: `py-[120px]` desktop, `py-20` mobile
- Font: Inter (ya importado en `global.css` y `Layout.astro`) — no agregar nuevas fuentes
- H1 hero: `clamp(56px, 8vw, 96px)`, weight 700, `letter-spacing: -0.02em`
- Transiciones: `duration-200` máximo — nada más lento
- Accent light: `#0071E3` / dark: `#2997FF`
- Copy: Rioplatense, natural, sin formato AI
- No tocar: `src/domain/`, `src/application/`, `src/infrastructure/`, `src/shared/`
- Theme toggle: `prefers-color-scheme` como default, manual toggle guarda en `localStorage`
- Las variables CSS que Tailwind consume vía `skin-*` y `brand-*` son: `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent-primary`, `--accent-secondary`, `--border-light`, `--border-medium`, `--md-accent`

---

### Task 1: Apple CSS Tokens

**Files:**
- Modify: `src/presentation/styles/global.css` (`:root` y `.dark` blocks)

**Interfaces:**
- Produces: variables CSS que todos los demás tasks consumen vía clases Tailwind `skin-*` y `brand-*`

- [ ] **Step 1: Reemplazar variables `:root` con paleta Apple light**

En `src/presentation/styles/global.css`, localizar el bloque `:root { ... }` y reemplazar SOLO las siguientes variables (dejar el resto intacto):

```css
:root {
  /* === APPLE LIGHT PALETTE === */
  --md-primary: #0071E3;
  --md-on-primary: #FFFFFF;
  --md-primary-container: #F5F5F7;
  --md-on-primary-container: #1D1D1F;

  --md-secondary: #6E6E73;
  --md-on-secondary: #FFFFFF;
  --md-secondary-container: #F5F5F7;
  --md-on-secondary-container: #1D1D1F;

  --md-accent: #0071E3;
  --md-on-accent: #FFFFFF;

  --md-surface: #FFFFFF;
  --md-on-surface: #1D1D1F;
  --md-surface-variant: #F5F5F7;
  --md-on-surface-variant: #6E6E73;

  --md-outline: #C7C7CC;
  --md-outline-variant: #D2D2D7;

  --md-background: #FFFFFF;
  --md-on-background: #1D1D1F;

  --md-elevation-1: 0px 1px 3px rgba(0,0,0,0.06);
  --md-elevation-2: 0px 2px 8px rgba(0,0,0,0.08);
  --md-elevation-3: 0px 4px 16px rgba(0,0,0,0.10);
  --md-elevation-4: 0px 8px 24px rgba(0,0,0,0.12);
  --md-elevation-5: 0px 16px 40px rgba(0,0,0,0.14);

  --color-text: #1D1D1F;
  --color-muted: #6E6E73;
  --color-accent: #0071E3;
  --color-accent-hover: #0077ED;
  --color-border: #D2D2D7;
  --color-surface: #F5F5F7;

  --color-primary: #FFFFFF;
  --color-secondary: #F5F5F7;
  --color-tertiary: #F0F0F2;

  --text-primary: #1D1D1F;
  --text-secondary: #3D3D3F;
  --text-muted: #6E6E73;
  --text-accent: #0071E3;

  --border-light: #D2D2D7;
  --border-medium: #C7C7CC;

  --accent-primary: #0071E3;
  --accent-secondary: #0077ED;

  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F7;
  --bg-tertiary: #F0F0F2;

  --success: #34C759;
  --warning: #FF9500;
  --error: #FF3B30;
}
```

- [ ] **Step 2: Reemplazar variables `.dark` con paleta Apple dark**

Localizar el bloque `.dark { ... }` y reemplazarlo completo:

```css
.dark {
  /* === APPLE DARK PALETTE === */
  --md-primary: #2997FF;
  --md-on-primary: #000000;
  --md-primary-container: #1C1C1E;
  --md-on-primary-container: #F5F5F7;

  --md-secondary: #86868B;
  --md-on-secondary: #000000;
  --md-secondary-container: #2C2C2E;
  --md-on-secondary-container: #F5F5F7;

  --md-accent: #2997FF;
  --md-on-accent: #000000;

  --md-surface: #1C1C1E;
  --md-on-surface: #F5F5F7;
  --md-surface-variant: #2C2C2E;
  --md-on-surface-variant: #86868B;

  --md-outline: #48484A;
  --md-outline-variant: #38383A;

  --md-background: #000000;
  --md-on-background: #F5F5F7;

  --md-elevation-1: 0px 1px 3px rgba(0,0,0,0.5);
  --md-elevation-2: 0px 2px 8px rgba(0,0,0,0.6);
  --md-elevation-3: 0px 4px 16px rgba(0,0,0,0.7);
  --md-elevation-4: 0px 8px 24px rgba(0,0,0,0.8);
  --md-elevation-5: 0px 16px 40px rgba(0,0,0,0.9);

  --color-text: #F5F5F7;
  --color-muted: #86868B;
  --color-accent: #2997FF;
  --color-accent-hover: #147CE5;
  --color-border: #38383A;
  --color-surface: #2C2C2E;

  --color-primary: #1C1C1E;
  --color-secondary: #2C2C2E;
  --color-tertiary: #3A3A3C;

  --text-primary: #F5F5F7;
  --text-secondary: #AEAEB2;
  --text-muted: #86868B;
  --text-accent: #2997FF;

  --border-light: #38383A;
  --border-medium: #48484A;

  --accent-primary: #2997FF;
  --accent-secondary: #147CE5;

  --bg-primary: #000000;
  --bg-secondary: #1C1C1E;
  --bg-tertiary: #2C2C2E;

  --success: #30D158;
  --warning: #FF9F0A;
  --error: #FF453A;
}
```

- [ ] **Step 3: Iniciar dev server y verificar colores**

```bash
cd C:/Users/Horacio/Desktop/proyectos/Portfolio-26
node node_modules/.pnpm/astro@5.17.3_jiti@1.21.7_ro_5c899ca32fcdf2e785ef25a7b9dae2af/node_modules/astro/astro.js dev --host &
sleep 18
curl -s -o /dev/null -w "HTTP %{http_code}" http://localhost:4321/
```

Esperado: `HTTP 200`. Abrir navegador en http://localhost:4321 — fondo debe ser blanco puro (light mode), sin cálido beige/navy anterior.

- [ ] **Step 4: Commit**

```bash
pkill -f astro
git add src/presentation/styles/global.css
git commit -m "style: apply Apple color palette to CSS custom properties"
```

---

### Task 2: Theme Hook — System Preference

**Files:**
- Modify: `src/presentation/hooks/useTheme.ts`

**Interfaces:**
- Consumes: `localStorage.getItem('theme')`, `window.matchMedia('(prefers-color-scheme: dark)')`
- Produces: `{ theme: Theme, toggleTheme: () => void }` — misma firma, sin breaking change

- [ ] **Step 1: Reemplazar `useTheme.ts` completo**

```typescript
import { useState, useEffect } from "react";

export type Theme = "light" | "dark";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme = saved ?? (systemDark ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const applyTheme = (next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  };

  return { theme, toggleTheme };
};
```

- [ ] **Step 2: Verificar en dev server**

```bash
cd C:/Users/Horacio/Desktop/proyectos/Portfolio-26
node node_modules/.pnpm/astro@5.17.3_jiti@1.21.7_ro_5c899ca32fcdf2e785ef25a7b9dae2af/node_modules/astro/astro.js dev &
sleep 18
curl -s http://localhost:4321/ | grep -o '<title>[^<]*</title>'
```

Esperado: `<title>Portfolio | Horacio Laphitz</title>` (sitio carga sin error).

Verificación manual: con DevTools → Emulación → `prefers-color-scheme: dark` → recargar → fondo debe ser negro (`#000000`).

- [ ] **Step 3: Commit**

```bash
pkill -f astro
git add src/presentation/hooks/useTheme.ts
git commit -m "feat: detect system color scheme preference as default theme"
```

---

### Task 3: Profile Data — GenAI Title + Skills Reorder

**Files:**
- Modify: `src/data/profile-data.ts` (solo `title`, `bio`, y orden del array `skills`)

**Interfaces:**
- Produces: `PROFILE_DATA.title` = `"Applied GenAI Data Analyst | Python, LLMs, Vector Databases & LangChain"`, skills ordenados GenAI primero

- [ ] **Step 1: Actualizar título y bio en `profile-data.ts`**

Localizar `new ProfileEntity(` y cambiar los dos primeros argumentos:

```typescript
export const PROFILE_DATA = new ProfileEntity(
  "Horacio Laphitz",
  "Applied GenAI Data Analyst | Python, LLMs, Vector Databases & LangChain",
  [
    ".",
    "Trabajo en la intersección entre análisis de datos de negocio y GenAI aplicada: desde ETL y EDA hasta flujos con LangChain, embeddings y Vector Databases.",
  ],
  // ... resto igual
```

- [ ] **Step 2: Reordenar array `skills` — GenAI primero**

Reemplazar el array de skills por este orden (agregar skills GenAI que faltan, mantener todos los existentes):

```typescript
  [
    // === GenAI & LLMs ===
    { name: "Python", category: SkillCategory.Programming, level: SkillLevel.Advanced },
    { name: "LangChain", category: SkillCategory.DataAnalysis, level: SkillLevel.Intermediate },
    { name: "LlamaIndex", category: SkillCategory.DataAnalysis, level: SkillLevel.Intermediate },
    { name: "RAG (Retrieval-Augmented Generation)", category: SkillCategory.DataAnalysis, level: SkillLevel.Intermediate },
    { name: "Vector Databases", category: SkillCategory.Database, level: SkillLevel.Intermediate },
    { name: "OpenAI API", category: SkillCategory.Tools, level: SkillLevel.Intermediate },
    { name: "Prompt Engineering", category: SkillCategory.DataAnalysis, level: SkillLevel.Intermediate },
    // === Data Analysis ===
    { name: "SQL", category: SkillCategory.Database, level: SkillLevel.Advanced },
    { name: "Pandas", category: SkillCategory.DataAnalysis, level: SkillLevel.Advanced },
    { name: "NumPy", category: SkillCategory.DataAnalysis, level: SkillLevel.Advanced },
    { name: "Scikit-learn", category: SkillCategory.DataAnalysis, level: SkillLevel.Intermediate },
    { name: "Power BI", category: SkillCategory.Visualization, level: SkillLevel.Advanced },
    { name: "Tableau", category: SkillCategory.Visualization, level: SkillLevel.Intermediate },
    { name: "R", category: SkillCategory.Programming, level: SkillLevel.Intermediate },
    // === Databases ===
    { name: "PostgreSQL", category: SkillCategory.Database, level: SkillLevel.Advanced },
    { name: "MySQL", category: SkillCategory.Database, level: SkillLevel.Advanced },
    { name: "MongoDB", category: SkillCategory.Database, level: SkillLevel.Intermediate },
    { name: "Databricks", category: SkillCategory.Tools, level: SkillLevel.Intermediate },
    // === Dev Tools ===
    { name: "JavaScript", category: SkillCategory.Programming, level: SkillLevel.Intermediate },
    { name: "TypeScript", category: SkillCategory.Programming, level: SkillLevel.Intermediate },
    { name: "Git", category: SkillCategory.Tools, level: SkillLevel.Advanced },
    { name: "Docker", category: SkillCategory.Tools, level: SkillLevel.Intermediate },
    { name: "Excel Avanzado", category: SkillCategory.Tools, level: SkillLevel.Advanced },
    // === Soft ===
    { name: "Resolución de Problemas", category: SkillCategory.Soft, level: SkillLevel.Expert },
    { name: "Pensamiento Analítico", category: SkillCategory.Soft, level: SkillLevel.Expert },
    { name: "Comunicación", category: SkillCategory.Soft, level: SkillLevel.Advanced },
    { name: "Trabajo en Equipo", category: SkillCategory.Soft, level: SkillLevel.Advanced },
    // === Sistemas de Gestión (ERP) ===
    { name: "Tango Gestión", category: SkillCategory.Tools, level: SkillLevel.Advanced },
    { name: "Parametrización Contable", category: SkillCategory.Tools, level: SkillLevel.Advanced },
    { name: "Gestión de Datos Maestros", category: SkillCategory.Database, level: SkillLevel.Advanced },
    { name: "Gestión de Stock", category: SkillCategory.Tools, level: SkillLevel.Advanced },
    { name: "Procesos de Ventas", category: SkillCategory.Tools, level: SkillLevel.Advanced },
    { name: "Tesorería", category: SkillCategory.Tools, level: SkillLevel.Advanced },
    { name: "Gestión de Compras", category: SkillCategory.Tools, level: SkillLevel.Advanced },
  ]
```

- [ ] **Step 3: Commit**

```bash
git add src/data/profile-data.ts
git commit -m "feat: update profile title to Applied GenAI Data Analyst, reorder skills"
```

---

### Task 4: Navigation — Transparent + Scroll Behavior

**Files:**
- Modify: `src/presentation/components/layout/Navigation.tsx`

**Interfaces:**
- Consumes: `window.scrollY`, `useEffect`
- Produces: nav transparente al top, opaco + blur al hacer scroll. Links: Proyectos / Stack / Contacto (eliminar Servicios e Inicio).

- [ ] **Step 1: Reemplazar `Navigation.tsx` completo**

```tsx
import { useState, useEffect } from "react";
import Logo from "../ui/Logo";
import ThemeToggle from "../ui/ThemeToggle";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "Proyectos", path: "#proyectos" },
    { name: "Stack", path: "#skills" },
    { name: "Contacto", path: "#contacto" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith("#")) {
      e.preventDefault();
      if (window.location.pathname === "/") {
        const el = document.querySelector(path);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset - 56;
          window.scrollTo({ top, behavior: "smooth" });
        }
      } else {
        window.location.href = `/${path}`;
      }
      setIsMenuOpen(false);
    }
  };

  const navClass = scrolled
    ? "bg-skin-primary/95 backdrop-blur-xl border-b border-skin-border shadow-sm"
    : "bg-transparent border-b border-transparent";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}>
      <div className="mx-auto px-6 max-w-[980px]">
        <div className="flex items-center justify-between h-14">
          <a
            href="/"
            className="flex items-center gap-2 text-skin-text hover:opacity-70 transition-opacity duration-200"
          >
            <Logo size="sm" />
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                className="px-4 py-2 text-sm font-medium text-skin-muted hover:text-skin-text transition-colors duration-200 rounded-lg"
              >
                {item.name}
              </a>
            ))}
            <div className="ml-3 pl-3 border-l border-skin-border">
              <ThemeToggle />
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-skin-muted hover:text-skin-text transition-colors duration-200 rounded-lg"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-skin-border">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className="px-4 py-2.5 text-sm font-medium text-skin-muted hover:text-skin-text hover:bg-skin-secondary transition-all duration-200 rounded-lg"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
```

- [ ] **Step 2: Verificar en dev server**

```bash
cd C:/Users/Horacio/Desktop/proyectos/Portfolio-26
node node_modules/.pnpm/astro@5.17.3_jiti@1.21.7_ro_5c899ca32fcdf2e785ef25a7b9dae2af/node_modules/astro/astro.js dev &
sleep 18
curl -s http://localhost:4321/ | grep -c "Proyectos"
```

Esperado: ≥ 1. En el navegador: nav transparente al top, se vuelve opaco con blur al bajar scroll.

- [ ] **Step 3: Commit**

```bash
pkill -f astro
git add src/presentation/components/layout/Navigation.tsx
git commit -m "feat: nav transparent on top, opaque on scroll, updated links"
```

---

### Task 5: Hero — Reescritura Completa

**Files:**
- Modify: `src/presentation/components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `PROFILE_DATA.name`, `PROFILE_DATA.title`, `PROFILE_DATA.contact`
- Produces: sección `id="inicio"` con H1 gigante, subtitle, 2 CTAs, foto derecha

- [ ] **Step 1: Reemplazar `Hero.tsx` completo**

```tsx
import { useState, useEffect } from "react";
import { GithubIcon, LinkedinIcon, MailIcon } from "../ui/Icons";
import { PROFILE_DATA } from "@data/profile-data";

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center relative pt-14"
    >
      <div className="mx-auto max-w-[980px] w-full px-6 py-20 lg:py-0">
        <div
          className={`grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16 items-center transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Content */}
          <div>
            <h1
              className="font-bold text-skin-text mb-4 tracking-tight"
              style={{
                fontSize: "clamp(56px, 8vw, 96px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              {PROFILE_DATA.name}
            </h1>

            <p className="text-xl text-skin-muted font-medium mb-6 tracking-wide">
              {PROFILE_DATA.title}
            </p>

            <p className="text-lg text-skin-muted max-w-2xl leading-relaxed mb-10">
              Construyo pipelines donde los datos de tu empresa alimentan modelos
              de lenguaje — RAG, chatbots internos y reportes que se generan solos.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#proyectos"
                className="px-6 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "var(--accent-primary)" }}
              >
                Ver proyectos
              </a>
              <a
                href="/CV-HoracioNahuelLaphitz.pdf"
                download
                className="px-6 py-3 text-sm font-semibold text-skin-text bg-transparent border border-skin-border rounded-lg hover:bg-skin-secondary transition-all duration-200"
              >
                Descargar CV
              </a>
            </div>

            <div className="flex gap-3">
              <a
                href={PROFILE_DATA.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 flex items-center justify-center text-skin-muted hover:text-skin-text border border-skin-border rounded-lg hover:border-skin-border-medium transition-all duration-200"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href={PROFILE_DATA.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 flex items-center justify-center text-skin-muted hover:text-skin-text border border-skin-border rounded-lg hover:border-skin-border-medium transition-all duration-200"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${PROFILE_DATA.contact.email}`}
                aria-label="Email"
                className="w-10 h-10 flex items-center justify-center text-skin-muted hover:text-skin-text border border-skin-border rounded-lg hover:border-skin-border-medium transition-all duration-200"
              >
                <MailIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Profile Image */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden border border-skin-border bg-skin-secondary">
              <img
                src="/img/profile.png"
                alt="Horacio Laphitz"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

- [ ] **Step 2: Verificar en dev server**

```bash
node node_modules/.pnpm/astro@5.17.3_jiti@1.21.7_ro_5c899ca32fcdf2e785ef25a7b9dae2af/node_modules/astro/astro.js dev &
sleep 18
curl -s http://localhost:4321/ | grep -o 'Applied GenAI'
```

Esperado: `Applied GenAI`. En navegador: H1 ocupa ancho completo del container, dos botones visibles bajo el párrafo.

- [ ] **Step 3: Commit**

```bash
pkill -f astro
git add src/presentation/components/sections/Hero.tsx
git commit -m "feat: rewrite Hero with Apple layout and GenAI copy"
```

---

### Task 6: Stats — Nuevo Componente

**Files:**
- Create: `src/presentation/components/sections/Stats.tsx`

**Interfaces:**
- Produces: sección `id="stats"` con 3 stats horizontales: `3+` / `10+` / `Python · SQL · LLMs`

- [ ] **Step 1: Crear `Stats.tsx`**

```tsx
import { useScrollAnimation } from "@presentation/hooks/useScrollAnimation";

const stats = [
  { value: "3+", label: "Años en datos" },
  { value: "10+", label: "Proyectos reales" },
  { value: "Python · SQL · LLMs", label: "Stack principal" },
];

const Stats = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      id="stats"
      className="bg-skin-secondary py-16"
    >
      <div className="mx-auto max-w-[980px] px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-skin-border">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center py-8 px-6 text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span
                className="font-bold text-skin-text mb-2 tracking-tight"
                style={{
                  fontSize: "clamp(32px, 5vw, 52px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span className="text-sm font-medium text-skin-muted uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
```

- [ ] **Step 2: Commit**

```bash
git add src/presentation/components/sections/Stats.tsx
git commit -m "feat: add Stats section with 3 horizontal metrics"
```

---

### Task 7: Skills — GenAI Primero + ERP Secundario

**Files:**
- Modify: `src/presentation/components/sections/Skills.tsx`

**Interfaces:**
- Consumes: `PROFILE_DATA.skills` (ya reordenado en Task 3)
- Produces: sección `id="skills"` con subsecciones: GenAI & IA / Análisis de Datos / Bases de Datos / Sistemas de Gestión / Soft Skills. Credly badges section al final.

- [ ] **Step 1: Reemplazar `Skills.tsx` completo**

```tsx
import { useScrollAnimation } from "@presentation/hooks/useScrollAnimation";
import { PROFILE_DATA } from "@data/profile-data";

const CREDLY_BADGES = [
  { id: "78a917fc-2fee-416b-a3c4-d14f3cd09541", label: "Python for Data Engineering – IBM" },
  { id: "57d36636-8b10-4218-a641-7cd6fcf9d8fe", label: "Python for Data Science – IBM" },
];

const SKILL_GROUPS: { label: string; names: string[] }[] = [
  {
    label: "GenAI & IA",
    names: ["LangChain", "LlamaIndex", "RAG (Retrieval-Augmented Generation)", "Vector Databases", "OpenAI API", "Prompt Engineering"],
  },
  {
    label: "Análisis de Datos",
    names: ["Python", "SQL", "Pandas", "NumPy", "Scikit-learn", "R", "Power BI", "Tableau", "Excel Avanzado"],
  },
  {
    label: "Bases de Datos & Cloud",
    names: ["PostgreSQL", "MySQL", "MongoDB", "Databricks"],
  },
  {
    label: "Dev & Herramientas",
    names: ["JavaScript", "TypeScript", "Git", "Docker"],
  },
  {
    label: "Soft Skills",
    names: ["Resolución de Problemas", "Pensamiento Analítico", "Comunicación", "Trabajo en Equipo"],
  },
  {
    label: "Sistemas de Gestión (ERP)",
    names: ["Tango Gestión", "Parametrización Contable", "Gestión de Datos Maestros", "Gestión de Stock", "Procesos de Ventas", "Tesorería", "Gestión de Compras"],
  },
];

const Skills = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const skillMap = new Map(PROFILE_DATA.skills.map((s) => [s.name, s]));

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      id="skills"
      className="bg-skin-primary py-[120px]"
    >
      <div className="mx-auto max-w-[980px] px-6">
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2
            className="font-bold text-skin-text tracking-tight"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.02em" }}
          >
            Stack
          </h2>
        </div>

        <div className="space-y-12">
          {SKILL_GROUPS.map((group, gi) => (
            <div
              key={group.label}
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${gi * 80}ms` }}
            >
              <h3 className="text-xs font-semibold text-skin-muted uppercase tracking-widest mb-4">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.names.map((name) => {
                  const skill = skillMap.get(name);
                  if (!skill) return null;
                  return (
                    <span
                      key={name}
                      className="px-3 py-1.5 text-sm font-medium text-skin-text bg-skin-secondary border border-skin-border rounded-lg hover:border-skin-border-medium transition-colors duration-200"
                    >
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Credly Badges */}
        <div
          className={`mt-16 pt-12 border-t border-skin-border transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <h3 className="text-xs font-semibold text-skin-muted uppercase tracking-widest mb-6">
            Badges verificables — Credly
          </h3>
          <div className="flex flex-wrap gap-4">
            {CREDLY_BADGES.map((badge) => (
              <a
                key={badge.id}
                href={`https://www.credly.com/badges/${badge.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-skin-secondary border border-skin-border rounded-lg text-sm font-medium text-skin-text hover:border-skin-border-medium transition-colors duration-200"
              >
                <svg className="w-4 h-4 text-skin-muted" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {badge.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
```

- [ ] **Step 2: Verificar en dev server**

```bash
node node_modules/.pnpm/astro@5.17.3_jiti@1.21.7_ro_5c899ca32fcdf2e785ef25a7b9dae2af/node_modules/astro/astro.js dev &
sleep 18
curl -s http://localhost:4321/ | grep -c "LangChain"
```

Esperado: ≥ 1.

- [ ] **Step 3: Commit**

```bash
pkill -f astro
git add src/presentation/components/sections/Skills.tsx
git commit -m "feat: restructure Skills — GenAI first, ERP secondary, Credly badges"
```

---

### Task 8: Contact — Sin Formulario

**Files:**
- Modify: `src/presentation/components/sections/Contact.tsx`

**Interfaces:**
- Produces: sección `id="contacto"` con texto grande + links de email y LinkedIn. Sin form, sin Web3Forms, sin estados de error.

- [ ] **Step 1: Reemplazar `Contact.tsx` completo**

```tsx
import { useScrollAnimation } from "@presentation/hooks/useScrollAnimation";
import { MailIcon, LinkedinIcon } from "../ui/Icons";

const Contact = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      id="contacto"
      className="bg-skin-secondary py-[120px]"
    >
      <div className="mx-auto max-w-[980px] px-6">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2
            className="font-bold text-skin-text tracking-tight mb-6"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.02em" }}
          >
            ¿Tenés un problema de datos?
          </h2>
          <p className="text-xl text-skin-muted mb-10 max-w-xl leading-relaxed">
            Hablemos.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:horaciolaphitz99@gmail.com"
              className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "var(--accent-primary)" }}
            >
              <MailIcon className="w-4 h-4" />
              horaciolaphitz99@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/horacio-laphitz/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-skin-text bg-transparent border border-skin-border rounded-lg hover:bg-skin-primary transition-all duration-200"
            >
              <LinkedinIcon className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
```

- [ ] **Step 2: Verificar en dev server**

```bash
node node_modules/.pnpm/astro@5.17.3_jiti@1.21.7_ro_5c899ca32fcdf2e785ef25a7b9dae2af/node_modules/astro/astro.js dev &
sleep 18
curl -s http://localhost:4321/ | grep -c "horaciolaphitz99"
```

Esperado: ≥ 1. Formulario NO debe aparecer.

- [ ] **Step 3: Commit**

```bash
pkill -f astro
git add src/presentation/components/sections/Contact.tsx
git commit -m "feat: replace contact form with direct email + LinkedIn links"
```

---

### Task 9: Integration — Wire Stats + SEO Update + Cleanup

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/presentation/layouts/Layout.astro`

**Interfaces:**
- Consumes: `Stats` componente (Task 6)
- Produces: Stats aparece entre Hero y ProjectCategories. JSON-LD actualizado a GenAI. Ruta `/proyectos/` removida del flujo. `getCollection("proyectos")` envuelto en try/catch para no romper en producción.

- [ ] **Step 1: Actualizar `src/pages/index.astro`**

```astro
---
import PageLayout from "@presentation/layouts/PageLayout.astro";
import Hero from "@presentation/components/sections/Hero.tsx";
import Stats from "@presentation/components/sections/Stats.tsx";
import Timeline from "@presentation/components/sections/Timeline.tsx";
import Skills from "@presentation/components/sections/Skills.tsx";
import ProjectCategories from "@presentation/components/sections/ProjectCategories.tsx";
import Contact from "@presentation/components/sections/Contact.tsx";
import { getCollection } from "astro:content";
import { ProjectMapper } from "@infrastructure/mappers/project.mapper";

let proyectosSerializados: object[] = [];
try {
  const proyectosRaw = await getCollection("proyectos");
  const proyectos = ProjectMapper.toDomainArray(proyectosRaw);
  proyectosSerializados = proyectos.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    tags: [...p.tags],
    publishDate: p.publishDate.toISOString(),
    author: p.author,
    githubUrl: p.githubUrl,
    dashboardUrl: p.dashboardUrl,
    status: p.status,
    featured: p.featured,
  }));
} catch {
  // Content collection "proyectos" no existe aún — se muestra vacío
}
---

<PageLayout
  title="Portfolio"
  description="Applied GenAI Data Analyst — Python, LLMs, LangChain, Vector Databases."
  currentPath="/"
>
  <Hero client:load />
  <Stats client:visible />
  <ProjectCategories posts={proyectosSerializados} client:load />
  <Skills client:visible />
  <Timeline client:visible />
  <Contact client:visible />
</PageLayout>
```

- [ ] **Step 2: Actualizar JSON-LD en `Layout.astro`**

Localizar `"jobTitle": "Data Analyst & Business Intelligence Specialist"` y reemplazar:

```json
"jobTitle": "Applied GenAI Data Analyst",
"description": "Applied GenAI Data Analyst especializado en construir pipelines RAG, chatbots internos y flujos LLM sobre datos de empresa. Python, LangChain, Vector Databases, SQL, Power BI.",
```

Localizar `"name": "Data Analyst, Business Intelligence Analyst, Data Scientist"` y reemplazar:

```json
"name": "Applied GenAI Data Analyst, AI Data Engineer, LLM Pipeline Developer",
```

- [ ] **Step 3: Actualizar `keywords` en `Layout.astro`**

Localizar el array `keywords = [...]` en el frontmatter y reemplazarlo:

```typescript
keywords = [
  "Horacio Laphitz",
  "Applied GenAI Data Analyst",
  "AI Data Analytics Argentina",
  "LangChain Developer",
  "RAG Pipeline",
  "Vector Database",
  "LLM Integration",
  "Python Data Analysis",
  "SQL Expert",
  "Power BI Developer",
  "LlamaIndex",
  "Prompt Engineering",
  "Chatbot Empresarial",
  "Automatización de Reportes",
  "ETL Pipelines",
  "Data Visualization",
  "PostgreSQL MySQL",
  "Business Intelligence",
  "Data Science Portfolio",
],
```

- [ ] **Step 4: Verificar build completo**

```bash
cd C:/Users/Horacio/Desktop/proyectos/Portfolio-26
node scripts/prepare-build.mjs && node node_modules/.pnpm/astro@5.17.3_jiti@1.21.7_ro_5c899ca32fcdf2e785ef25a7b9dae2af/node_modules/astro/astro.js build 2>&1 | tail -10
```

Esperado: sin errores fatales. Warning sobre "proyectos collection" es esperado y OK.

- [ ] **Step 5: Verificar dev server end-to-end**

```bash
node node_modules/.pnpm/astro@5.17.3_jiti@1.21.7_ro_5c899ca32fcdf2e785ef25a7b9dae2af/node_modules/astro/astro.js dev &
sleep 18
curl -s -o /dev/null -w "/ → %{http_code}\n" http://localhost:4321/
curl -s -o /dev/null -w "/projects → %{http_code}\n" http://localhost:4321/projects
curl -s http://localhost:4321/ | grep -o 'Applied GenAI'
curl -s http://localhost:4321/ | grep -o 'LangChain'
curl -s http://localhost:4321/ | grep -o 'Proyectos'
```

Esperado:
```
/ → 200
/projects → 200
Applied GenAI
LangChain
Proyectos
```

- [ ] **Step 6: Commit final**

```bash
pkill -f astro
git add src/pages/index.astro src/presentation/layouts/Layout.astro
git commit -m "feat: wire Stats section, update SEO for GenAI profile, handle empty proyectos"
```

---

## Checklist de Criterios de Éxito (verificar post-Task 9)

- [ ] `prefers-color-scheme: dark` → fondo negro `#000000` al cargar
- [ ] Toggle manual cambia tema y persiste en `localStorage`
- [ ] Hero H1 ocupa ancho completo del container (980px)
- [ ] Nav transparente al top, opaco con blur al scroll
- [ ] Stats section visible entre Hero y Proyectos
- [ ] "LangChain", "RAG", "Vector Databases" visibles en Skills
- [ ] Credly badges renderizados como links en Skills
- [ ] ERP skills en sección "Sistemas de Gestión" separada
- [ ] Contact muestra email + LinkedIn sin formulario
- [ ] `/` → HTTP 200, `/projects` → HTTP 200
- [ ] Build (`astro build`) completa sin errores fatales
