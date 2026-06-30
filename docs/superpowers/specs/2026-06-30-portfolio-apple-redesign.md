# Portfolio Apple Redesign — Design Spec

**Date:** 2026-06-30  
**Status:** Approved  
**Goal:** Rediseño completo del portfolio con filosofía Apple para destacar el perfil "Applied GenAI Data Analyst" y maximizar conversión recruiter → contacto.

---

## Contexto

Portfolio actual mezcla señales contradictorias: analista de datos, ingeniero ML, técnico en sistemas y admin ERP en la misma página. El nuevo diseño consolida un perfil claro: **Applied GenAI Data Analyst** con foco en Python, LLMs, Vector Databases y LangChain.

**CTA principal:** Recruiter ve proyectos → entiende capacidad técnica → contacta.  
**CTA secundario:** Descarga CV.

---

## Stack sin cambios

Astro 5 + React + TypeScript + Tailwind 3. No se migra nada. Se reemplazan tokens y componentes.

---

## Estructura de secciones (orden de scroll)

| # | Sección | Descripción |
|---|---|---|
| 1 | Nav | Nombre izq, 3 links der (Proyectos / Stack / Contacto). Transparente, fondo sutil on scroll. |
| 2 | Hero | Full viewport. H1 nombre, subtítulo rol, 2 líneas value prop, CTAs: `Ver proyectos` + `Descargar CV`. Foto derecha. |
| 3 | Stats | 3 números horizontales: años en datos, proyectos reales, year del primer RAG productivo. |
| 4 | Proyectos destacados | 2-3 cards grandes. Estructura: problema → solución → tech. Link "Todos los proyectos →". |
| 5 | Stack | Grilla simple de íconos/nombres. GenAI primero, ERP como sección secundaria "Sistemas de Gestión". |
| 6 | Certificaciones | Todas presentes. Credly badges visibles. Ordenadas: Google/Stanford/IBM arriba, resto abajo. |
| 7 | Experiencia | Timeline mínimo, 3 entradas, reencuadradas hacia componente analítico de cada rol. |
| 8 | Contacto | Texto grande + email + LinkedIn. Sin formulario. |

---

## Paleta de colores

| Token CSS | Light | Dark |
|---|---|---|
| `--color-bg` | `#FFFFFF` | `#000000` |
| `--color-surface` | `#F5F5F7` | `#1C1C1E` |
| `--color-text` | `#1D1D1F` | `#F5F5F7` |
| `--color-text-secondary` | `#6E6E73` | `#86868B` |
| `--color-accent` | `#0071E3` | `#2997FF` |
| `--color-border` | `#D2D2D7` | `#38383A` |

Theme: sistema (`prefers-color-scheme`) como default. Toggle manual guarda en `localStorage`. Refactorizar `useTheme.ts` existente.

---

## Tipografía

- **Font:** Inter (Google Fonts, subset Latin)
- **H1 Hero:** `clamp(56px, 8vw, 96px)`, weight 700, `letter-spacing: -0.02em`
- **H2 secciones:** `clamp(36px, 5vw, 56px)`, weight 700
- **Body:** `17px`, `line-height: 1.7`, weight 400
- **Labels/badges:** `13px`, weight 500, uppercase, `letter-spacing: 0.05em`
- Sin serifa en ningún nivel.

---

## Espaciado

- Container max-width: `980px` (mismo que apple.com)
- Secciones padding vertical: `120px` desktop, `80px` mobile
- Sin borders decorativos, sin box-shadows pesadas, sin gradientes llamativos

---

## Animaciones

- Fade-in + `translateY(20px → 0)` al entrar en viewport
- Reutilizar `useScrollAnimation.ts` existente
- Transiciones interactivas: `200ms ease` máximo
- Sin parallax, sin partículas, sin loaders elaborados

---

## Copy (rioplatense, natural)

### Hero
```
Horacio Laphitz
Applied GenAI Data Analyst | Python, LLMs, Vector Databases & LangChain

Construyo pipelines donde los datos de tu empresa alimentan modelos de lenguaje —
RAG, chatbots internos y reportes que se generan solos.
```

### Stats
```
3+              10+                    2024
Años en datos   Proyectos reales       Primer RAG productivo
```

### Contacto
```
¿Tenés un problema de datos?
Hablemos.
[horaciolaphitz99@gmail.com]   [LinkedIn]
```

---

## Componentes: qué cambia

| Archivo | Cambio |
|---|---|
| `src/presentation/styles/design-tokens.ts` | Reemplazar tokens con paleta Apple |
| `src/presentation/styles/global.css` | Import Inter, reset tipografía, variables CSS |
| `src/presentation/components/sections/Hero.tsx` | Reescritura completa con nuevo copy y layout |
| `src/presentation/components/sections/Skills.tsx` | GenAI primero, ERP sección secundaria, Credly badges siempre visibles |
| `src/presentation/components/sections/Timeline.tsx` | Simplificado a 3 entradas reencuadradas |
| `src/presentation/components/sections/Contact.tsx` | Sin formulario, solo email + LinkedIn |
| `src/presentation/components/layout/Navigation.tsx` | Transparente + scroll behavior |
| `src/presentation/layouts/Layout.astro` | Import Inter via Google Fonts |
| `src/data/profile-data.ts` | Nuevo título, bio actualizada, skills reordenados |
| `src/presentation/components/sections/Stats.tsx` | **Nuevo componente** — 3 números horizontales |

---

## Qué NO cambia

- Arquitectura Clean/Hexagonal (domain/application/infrastructure/presentation) — intacta
- `useTheme.ts`, `useScrollAnimation.ts`, `useDebounce.ts` — refactor mínimo, no reescritura
- Credly badges — siempre visibles en sección certificaciones
- Tango Gestión y skills ERP — presentes en sección secundaria de Stack

---

## Criterios de éxito

1. `prefers-color-scheme` detectado correctamente al cargar (sin flash)
2. Toggle manual persiste en `localStorage`
3. Hero ocupa viewport completo en desktop y mobile
4. Max-width container respeta `980px`
5. Stats section visible entre Hero y Proyectos
6. Credly badges renderizan correctamente en ambos temas
7. Nav se vuelve opaco al hacer scroll (no transparente sobre contenido)
8. CV descargable desde botón en Hero
9. Ruta `/proyectos/` sin 404 o removida de nav
