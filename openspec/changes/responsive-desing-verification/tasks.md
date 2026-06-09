# Tasks: Responsive Design Verification

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~81 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Foundation — Setup & CSS

- [ ] 1.1 `frontend/package.json` — add `@tailwindcss/typography` devDependency (`pnpm add -D @tailwindcss/typography`)
- [ ] 1.2 `frontend/tailwind.config.mjs` — register plugin: `plugins: [require('@tailwindcss/typography')]`
- [ ] 1.3 `frontend/src/presentation/styles/global.css` — add `.glass-panel` (`@apply glass p-md rounded-2xl`) and `.scroll-progress` (`fixed top-0 left-0 h-1 z-50 origin-left`) in `@layer components`
- [ ] 1.4 `global.css` — add `@keyframes fadeOutUp` in `@layer utilities` for mobile menu exit animation; update `.section-header h2` to `text-3xl sm:text-4xl md:text-5xl`

## Phase 2: Navigation & Layout

- [ ] 2.1 `Header.tsx` — change `hidden md:flex` to `hidden sm:flex` for inline nav at 640px; add backdrop `div` (`fixed inset-0 bg-black/20 z-40`) on menu open; add exit animation state with `isExiting` + `fadeOutUp`; bump nav link padding to `px-4 py-2` (touch target ≥44px)
- [ ] 2.2 `Footer.astro` — add `sm:grid-cols-2` before `md:grid-cols-4`; bump social icon `p-2.5` → `p-3`

## Phase 3: Section Components — Spacing & Typography

- [ ] 3.1 `Hero.astro` — section spacing `py-2xl md:py-4xl`; heading `text-4xl sm:text-5xl md:text-7xl`; subtitle `text-lg sm:text-xl md:text-2xl`
- [ ] 3.2 `About.astro` — skill badges grid add `sm:grid-cols-2`; chip padding `py-1.5` → `py-2`
- [ ] 3.3 `Services.astro` — spacing `py-2xl md:py-4xl` (drop `lg:py-5xl`); cap stagger delay at `Math.min(index * 100, 400)`
- [ ] 3.4 `Contact.tsx` — section spacing `py-2xl md:py-4xl`; info links bump touch-target padding

## Phase 4: Touch Targets & Animation Caps

- [ ] 4.1 `ProjectsGrid.tsx` — filter buttons `px-3 py-1.5` → `px-4 py-2` (≥44px touch target)
- [ ] 4.2 `ThemeToggle.tsx` — navbar variant `p-2` → `p-3`
- [ ] 4.3 `Timeline.astro` — cap stagger delay at `Math.min(index * 100, 400)`

## Phase 5: Verification

- [ ] 5.1 Run `pnpm build` — confirm zero "class does not exist" warnings and passing astro check
- [ ] 5.2 Visual regression — verify all sections at 320/640/768/1024/1280px in DevTools; confirm no horizontal scroll, padding ≤81px on mobile, desktop padding unchanged
- [ ] 5.3 Dark mode — verify all renders under `data-theme="dark"`, no invisible elements, WCAG AA contrast
- [ ] 5.4 Touch targets — verify interactive elements ≥44×44px on mobile (nav, filters, chips, toggle, social icons)
- [ ] 5.5 Mobile menu — verify backdrop overlay, tap-to-close, exit animation plays
