## Exploration: Responsive Design Verification

### Current State

The portfolio is built with Astro + React 18 + Tailwind CSS 3, deployed as a static SSG site via Vercel. Responsiveness is handled exclusively through Tailwind's default breakpoint utilities (`sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`), with zero custom `@media` queries in the codebase. The design is Apple-inspired with glassmorphism, CSS custom properties theming, and custom spacing/font scales defined in `tailwind.config.mjs`.

**What works well today:**
- Viewport meta tag is correctly set (`width=device-width, initial-scale=1.0`)
- Base layout uses `overflow-x-hidden` preventing horizontal scroll on mobile
- Container class uses responsive padding (`px-md`→`md:px-lg`→`lg:px-xl`)
- Most grid layouts degrade gracefully to single-column on mobile
- Dark mode is fully implemented and theme-aware
- Touch targets on hero CTAs are adequate (`px-xl py-md`)

**What does NOT use responsive patterns:**
- Several components skip the `sm:` breakpoint entirely, jumping straight from mobile to `md:` (768px)
- The `prose` class used in `ArticleLayout.astro` references `@tailwindcss/typography` which is NOT installed — article content has no styling
- `glass-panel` CSS class is used in `Header.tsx` but NOT defined anywhere — likely a broken style
- `scroll-progress` CSS class is used in `ScrollProgress.tsx` but NOT defined anywhere
- No responsive typography scale beyond explicit `text-* md:text-*` pairs

### Affected Areas

All frontend components and pages are in scope. Specific files:

#### Layout Shell
- `src/presentation/layouts/BaseLayout.astro` — Root shell with background blobs, main slot, Header/Footer
- `src/presentation/layouts/ArticleLayout.astro` — Project detail layout, uses unstyled `prose` class

#### Components
- `src/presentation/components/layout/Header.tsx` — Fixed glassmorphism navbar with mobile hamburger menu; uses undefined `glass-panel` class; menu has no overlay/backdrop
- `src/presentation/components/layout/Footer.astro` — 4-column grid with social links and nav
- `src/presentation/components/sections/Hero.astro` — Full-viewport hero with CTA buttons and animated background blobs
- `src/presentation/components/sections/About.astro` — Avatar + bio + skill badges with grid layout
- `src/presentation/components/sections/Services.astro` — Service cards in responsive grid
- `src/presentation/components/sections/ProjectsGrid.tsx` — Search, category filters, project cards grid (up to 4 columns at xl)
- `src/presentation/components/sections/ProjectCard.tsx` — Individual card with title truncation and line-clamp
- `src/presentation/components/sections/Timeline.astro` — Vertical card list for experience
- `src/presentation/components/sections/Contact.tsx` — Contact form with info cards
- `src/presentation/components/ui/ScrollProgress.tsx` — Uses undefined `scroll-progress` class
- `src/presentation/components/ui/Card.tsx` — Reusable card wrapper with optional hover effect
- `src/presentation/components/atoms/ThemeToggle.tsx` — Theme toggle with framer-motion animation

#### Pages
- `src/pages/index.astro` — Home page composing all sections
- `src/pages/projects.astro` — Full project list page
- `src/pages/notebooks.astro` — Filtered analysis projects
- `src/pages/experience.astro` — Timeline + skills grid
- `src/pages/certificaciones.astro` — Certifications list
- `src/pages/contact.astro` — Contact page with social links
- `src/pages/404.astro` — 404 page
- `src/pages/gracias.astro` — Thank-you page after form submission
- `src/pages/proyectos/[slug].astro` — Dynamic project detail pages

#### Styles
- `src/presentation/styles/tokens.css` — Design tokens (colors, spacing, radii, shadows, transitions)
- `src/presentation/styles/global.css` — Tailwind layers, `.container`, `.glass`, `.chip`, `.tag`, `.section-header`, animations
- `src/presentation/styles/themes/dark.css` — Dark theme overrides
- `tailwind.config.mjs` — Custom spacing/font scales, CSS variable references, breakpoints (default)

### Responsiveness Issues Found

#### 1. Missing CSS Classes (Broken UI)
- **`glass-panel`** used in Header.tsx:36 — the glassmorphism navbar has no explicit styling definition. It likely degrades to no border/background, making it invisible.
- **`scroll-progress`** used in ScrollProgress.tsx:22 — the scroll progress bar has no styling, making it invisible.
- **`prose prose-lg`** used in ArticleLayout.astro:70 — project detail content is unstyled because `@tailwindcss/typography` is not installed.

#### 2. Oversized Spacing on Mobile
- Custom spacing values are very large: `py-4xl` = **121.5px**, `py-5xl` = **182.25px**
- Many sections use `py-4xl md:py-5xl` — 121.5px top/bottom padding on mobile is excessive (roughly 38% of viewport height on a 320px screen)
- Services: `py-3xl md:py-4xl lg:py-5xl` — three tiers of responsive padding, but the base `py-3xl` = 81px is still quite large
- Contact: same 3-tier padding pattern
- This creates excessive scrolling on mobile where vertical space is at a premium

#### 3. Hero Section Mobile Concerns
- `min-h-[90vh]` on mobile leaves only 10% of viewport for scroll hint — users may not realize there's content below
- `text-5xl` (61px) heading on 320px screens is very large relative to screen width
- Background blobs use `w-[90vw] h-[90vw]` which may cause rendering or performance issues on mobile (large blur + large element)
- `py-4xl` (121.5px) on a 90vh section makes the inner spacing disproportionately large

#### 4. Inconsistent Breakpoint Strategy
- **Header nav**: Desktop links `hidden md:flex` — mobile menu shows below 768px. But `sm:` (640px) breakpoint is never used for the nav, meaning a 680px tablet gets the mobile hamburger menu unnecessarily.
- **ProjectsGrid search bar**: `flex-col sm:flex-row` — uses `sm:` breakpoint (good)
- **About.grid**: `lg:grid-cols-[320px_minmax(0,1fr)]` — only collapses at <1024px, meaning an iPad in portrait (768px) gets stretched single-column with no consideration for the intermediate state
- **Footer grid**: `md:grid-cols-4` — jumps straight from mobile to 4 columns
- **Skills grid (experience page)**: `md:grid-cols-2 lg:grid-cols-3` — skips `sm:grid-cols-2`
- **Contact page cards**: `md:grid-cols-2` — no `sm:` usage

#### 5. Font Size Scaling
- Custom font sizes follow a modular scale but are very large on mobile:
  - `text-4xl` = 48.83px (used for section headers)
  - `text-5xl` = 61.04px (used in Hero)
  - `text-6xl` = 76.29px (used in Gracias page)
  - `text-8xl` = ~97px? (used in 404 page `text-8xl font-bold`)
- Tailwind v3 default `text-4xl` is 36px — this project's custom scale is ~36% larger
- Only Hero has an `md:text-7xl` override. Most sections use a single `text-4xl` with no responsive reduction.
- No `sm:` text-size variants exist anywhere

#### 6. Project Cards — Content Truncation
- `line-clamp-1` on description means only 1 line shown on mobile. Combined with `text-xs` (12.8px) font, this could be insufficient for users to understand the project.
- `truncate` on title — useful but could hide important differentiators
- Tags show max 2 technologies with "+N" overflow — fine for mobile but reduces information density
- In 1-column mode (mobile), card width is full — the truncation may hide too much content that WOULD fit given more width

#### 7. Animation Timing
- Long animation delays (up to 800ms on timeline items, 700ms on skills) mean some content is invisible for nearly a second after page load. On mobile with potentially slower connections, combined with reduced viewport visibility, this creates a poor initial experience.
- Multiple staggered animations on the same viewport (e.g., search bar → filters → count → cards each with their own delay) create a sequential reveal that can feel sluggish

#### 8. Mobile Menu UX
- Hamburger menu is a simple div with `md:hidden` — no backdrop overlay, no swipe gestures, no focus trap
- Menu items use `animate-fade-in` but when closing, there's no exit animation — menu abruptly disappears
- No active/current page indicator in the mobile menu
- On a device that's 768px+ but has poor connectivity, the desktop menu is always shown (good)

#### 9. Touch Targets
- Mobile menu links: `px-3 py-2` = 12px × 16px — below Apple HIG minimum 44pt tap target
- Category filter buttons in ProjectsGrid: `px-3 py-1.5` = 12px × 12px — VERY small for touch
- Skill tags in About: `.chip` has `px-3 py-1.5` = 12px × 12px — too small
- Theme toggle in navbar: `p-2` = 8px radius — minimal touch space
- Desktop nav links: `px-3 py-1.5` = same issue

#### 10. Contact Form Responsiveness
- Input fields have adequate sizing (`px-4 py-3`) but on very small screens (<360px), `px-4` (16px) could be reduced
- Submit button is `w-full` which is correct
- Info cards grid uses `sm:grid-cols-2` at 640px — but the gap `gap-lg` (24px) could be tighter on mobile
- No mobile-specific validation UX (e.g., input mode for email type)

#### 11. Certifications Page
- Uses `flex-wrap items-center justify-between gap-3` for period chip + location — on mobile, the location text wraps below the chip correctly
- Certificate URL link is adequate

#### 12. Inconsistent Container Usage
- Some sections wrap content in `.container` (which centers and constrains to `max-w-7xl`), while others add `px-4` on top of that — creating double horizontal padding on mobile
  - Example: `py-4xl md:py-5xl px-4` + inner `.container` = unnecessary extra padding
- `Hero.astro` does NOT use `.container` — uses `max-w-4xl` directly on the inner div

#### 13. Empty States
- Certifications, timeline, and projects grid have empty state handling with centered glass cards — responsive behavior seems adequate for these

#### 14. Astro Islands (client:* directives)
- `ProjectsGrid` uses `client:visible` for code splitting (good)
- `Contact` uses `client:visible` (good)
- `Header` uses `client:load` — loads immediately regardless of viewport, could use `client:idle` on mobile

### Constraints

1. **Design system**: Apple-inspired aesthetic with glassmorphism, specific Apple-like spacing/font scales. Any responsive fixes must preserve the clean, minimal look.
2. **Dark mode**: Fully implemented dual-theme with CSS variables. Responsive changes must not break theme switching or color contrast.
3. **Existing animations**: Framer-motion and CSS keyframes are used extensively. Any changes must work with or around existing animation patterns.
4. **Frameworks locked**: React 18 (not 19), Tailwind CSS 3 (not 4). The `react-19` and `tailwind-4` skills loaded are mismatched — use React 18 and Tailwind 3 patterns.
5. **No testing**: There are no frontend tests. Changes must be verified manually or via visual inspection.
6. **Static SSG**: No server-side rendering. All responsive logic must work entirely on the client.
7. **Only Tailwind breakpoints**: No custom `@media` queries currently exist. Adding them would be a pattern break — better to either use Tailwind utilities or add a documented exception.

### Ready for Proposal
Yes — the exploration is comprehensive. The orchestrator can proceed to `sdd-propose` with findings categorized into concrete improvement areas.

**Critical fixes** (CSS broken classes) should be prioritized alongside responsive improvements:
1. `glass-panel` — add to `global.css` @layer components
2. `scroll-progress` — add styling
3. `prose` — either install `@tailwindcss/typography` plugin or define custom article styles
