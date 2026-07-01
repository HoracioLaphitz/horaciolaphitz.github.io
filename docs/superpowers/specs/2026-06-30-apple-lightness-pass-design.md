# Apple Lightness Pass — Design

**Goal:** Reduce visual weight of the portfolio toward Apple's design language — flat minimal cards, unified container width, lighter motion, full responsiveness. Content, domain logic, color palette, and SEO stay untouched.

**Scope:** `src/presentation/` only. No changes to `domain/`, `application/`, `infrastructure/`, `shared/`, profile data, or palette tokens.

## Decisions

- **Card style:** Flat minimal — 1px `skin-border`, no permanent shadow (shadow only on hover via `--md-elevation-1`), no colored icon badge, no overlay, no `scale-110`. Tags are plain `bg-skin-secondary text-skin-muted rounded-md`, no colored 2px border. Card padding `p-5`, radius `rounded-xl`.
- **Grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (was `lg:grid-cols-4`, too cramped inside 980px).

## Global constraints

- **Container:** `max-w-[980px]` in every section (Projects currently `max-w-7xl` → unify).
- **Section padding:** `py-20 md:py-28` consistently.
- **Motion:** `duration-200`, enter offset `translate-y-2` (was `duration-700` + `translate-y-8`). Respect `prefers-reduced-motion`.
- **Type:** keep existing `clamp()` fluid sizing.

## Affected files

- `src/presentation/components/proyectos/ProjectCard.tsx` — flat minimal restyle
- `src/presentation/components/sections/ProjectCategories.tsx` — container `980px`, grid 3-col, padding/motion
- `src/presentation/components/sections/Skills.tsx` — padding/motion sweep
- `src/presentation/components/sections/Contact.tsx` — padding/motion sweep
- `src/presentation/components/sections/Stats.tsx` — motion sweep
- `src/presentation/components/sections/Timeline.tsx` — padding/motion sweep

## Verification

- Dev server `/` → HTTP 200, renders without error.
- Manual: cards flat (no permanent shadow), tags gray (no colored border), grid 3-col on desktop, single container width across sections.
- Responsive sweep: mobile (375px) → tablet (768px) → desktop (1280px), no overflow, no cramped grid.

## Out of scope

Services / ImpactCard cards, content rewrites, new sections, palette changes.
