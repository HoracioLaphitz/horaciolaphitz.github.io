# Responsive Design Specification

## Purpose

Viewport-adaptive layout, touch targets, and typography using Tailwind 3 breakpoints (`sm`/`md`/`lg`/`xl`). Preserves dark mode and visual rhythm.

## Requirements

### R1: Broken CSS classes SHALL be defined

`.glass-panel` and `.scroll-progress` MUST be declared in `global.css` `@layer components`. `@tailwindcss/typography` MUST be installed for `.prose` styling.

#### Scenario: Build without class warnings

- GIVEN plugin registered and classes declared
- WHEN `pnpm build` runs
- THEN no "class does not exist" warnings

#### Scenario: Components render styled

- GIVEN any viewport
- WHEN Header renders → glass background visible
- WHEN ScrollProgress renders → progress bar visible
- WHEN ArticleLayout renders → `.prose` styles content

### R2: Mobile vertical padding MUST be ≤81 px

Section padding on <768 px viewports uses `py-2xl` (54 px) or `py-3xl` (81 px). `py-4xl` (121.5 px) and above reserved for `md:` breakpoint.

#### Scenario: Section padding on 375 px

- GIVEN 375 px viewport
- WHEN rendering Hero, About, or Contact
- THEN each section's vertical padding ≤81 px

#### Scenario: Desktop padding unchanged

- GIVEN 1024 px viewport
- WHEN rendering same sections
- THEN padding uses original `py-4xl`/`py-5xl`

### R3: Touch targets MUST be ≥44 px

All interactive elements (buttons, links, toggles, chips, icons) MUST have bounding box ≥44 px × 44 px on touch devices. 48 px × 48 px recommended.

#### Scenario: Mobile nav meets HIG

- GIVEN viewport <640 px
- WHEN inspecting hamburger, toggle, nav links
- THEN each bounding box ≥44 px both dimensions

#### Scenario: Filters and card links

- GIVEN ProjectsGrid renders
- WHEN inspecting filter buttons and card links
- THEN each ≥44 px × 44 px

### R4: Components MUST include `sm:` breakpoint variants

Layout grids and nav MUST add `sm:` (640 px) where currently only `md:` (768 px) toggles behavior.

#### Scenario: Nav inline at 640 px

- GIVEN viewport = 640 px
- WHEN Header renders
- THEN nav links visible inline (not hamburger-hidden)

#### Scenario: Footer grid adapts at smaller width

- GIVEN viewport <640 px → Footer `grid-cols-1`
- WHEN viewport ≥640 px → Footer uses `sm:grid-cols-2`

### R5: Typography SHALL scale for small viewports

Headings MUST NOT overflow on 320 px screens. Hero h1 uses `text-4xl sm:text-5xl md:text-7xl`. Body line-length <70 ch.

#### Scenario: Hero heading fits 320 px

- GIVEN 320 px viewport
- WHEN Hero `<h1>` renders
- THEN font-size ≤36 px, no horizontal overflow

#### Scenario: Section headers scale

- GIVEN 375 px viewport
- WHEN section `<h2>` renders
- THEN font-size is reduced (e.g., `text-3xl` vs `text-4xl`)

### R6: Mobile menu backdrop and exit animation

Hamburger MUST render backdrop overlay (`fixed inset-0 bg-black/20 z-40`) on open and must play exit animation on close.

#### Scenario: Backdrop visible on open

- GIVEN viewport <640 px
- WHEN user taps hamburger
- THEN backdrop appears and tapping closes menu

#### Scenario: Exit animation on close

- GIVEN mobile menu open
- WHEN user taps link or backdrop
- THEN `animate-fade-in-down` plays before DOM removal

### R7: Animation delays capped at 400 ms on mobile

Staggered delays MUST NOT exceed 400 ms on viewports <768 px.

#### Scenario: Timeline quicker on mobile

- GIVEN viewport <768 px
- WHEN Timeline renders staggered items
- THEN each delay ≤400 ms (was up to 800 ms)

### R8: Dark mode MUST remain functional

All changes must render identically under `data-theme="dark"`. Contrast meets WCAA A.

#### Scenario: Dark mode render

- GIVEN `data-theme="dark"`
- WHEN verifying R1–R5
- THEN all measurements match light mode, no invisible elements

## Risks

| Risk | Mitigation |
|------|------------|
| Desktop regression | Test 320–1920 px before commit |
| Typography plugin conflicts | Verify ArticleLayout matches current render |
| Touch bump shifts 320 px nav | Use flex gap; test Galaxy S8 emulation |

## Dependencies

- `@tailwindcss/typography` — install via `pnpm add -D`, register in config plugins
