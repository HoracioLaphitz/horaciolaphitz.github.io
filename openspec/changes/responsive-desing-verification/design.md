# Design: Responsive Design Verification

## Overview

Fix broken CSS, add missing `sm:` breakpoints, scale typography for mobile, ensure touch targets ≥44px, and add mobile menu backdrop/exit animation — all using Tailwind 3 utilities and the existing `data-theme` dark-mode system. No custom media queries. Total ~80 lines changed.

## Design Decisions

### D1: CSS Class Definitions

| Class | `@layer components` in `global.css` | Depends on |
|-------|--------------------------------------|------------|
| `.glass-panel` | Extends `.glass` + `p-md` + `rounded-2xl`. Uses existing CSS vars. | — |
| `.scroll-progress` | `fixed top-0 left-0 h-1` bg `var(--color-accent)`, `z-50`, `origin-left` | — |
| `.prose` | Provided by `@tailwindcss/typography` (v0.5.x), scoped to `.prose` | Plugin installed + registered |

### D2: Breakpoint Strategy

Only Tailwind's default breakpoints (`sm:640`/`md:768`/`lg:1024`/`xl:1280`). Zero custom `@media`. Current code uses `hidden md:flex` for desktop nav — change to `hidden sm:flex` so inline nav appears at 640px instead of 768px. Footer `md:grid-cols-4` gets `sm:grid-cols-2` intermediate step. About grid `lg:grid-cols-[320px_1fr]` adds `sm:grid-cols-2` for the skill badges column.

### D3: Touch Targets

| Component | Current px | Target px | Change in className |
|-----------|-----------|-----------|---------------------|
| Nav links (desktop) | `px-3 py-1.5` (12×12) | `px-4 py-2` (16×16*) | Bump padding |
| Filter buttons | `px-3 py-1.5` (12×12) | `px-4 py-2` (16×16*) | Bump padding |
| `.chip` in About | `px-3 py-1.5` (12×12) | `px-3 py-2` (12×16*) | Bump y-padding |
| Theme toggle (navbar) | `p-2` (8px radius) | `p-3` (12px radius) | Bump padding |
| Nav links (mobile) | `px-3 py-2` (12×16) | `px-4 py-3` (16×24*) | Bump padding |
| Social icons (Footer) | `p-2.5` (10px radius) | `p-3` (12px radius) | Bump padding |

*Actual bounding box = padding + content + line-height. `px-4 py-2` on a text-sm element yields ~44×44px with line-height.

### D4: Responsive Typography

| Element | Mobile (<640) | `sm:` (640+) | `md:` (768+) |
|---------|--------------|--------------|--------------|
| Hero h1 | `text-4xl` (~49px) | `text-5xl` | `text-7xl` (default Tailwind) |
| Section h2 | `text-3xl` (~39px) | — | `text-4xl` (48.83px) |
| Hero subtitle | `text-lg` (20px) | `text-xl` | `text-2xl` |

Existing `.section-header h2` in `global.css` updated: `text-4xl md:text-5xl` → `text-3xl sm:text-4xl md:text-5xl`.

### D5: Mobile Spacing

Replace `py-4xl` (121.5px) with `py-2xl` (54px) or `py-3xl` (81px) on mobile, preserve `md:py-4xl`/`md:py-5xl` for desktop. Affected: Hero, About, Timeline, Services, Contact. Services `py-3xl md:py-4xl lg:py-5xl` reduces to `py-2xl md:py-4xl` (3-tier → 2-tier).

### D6: Mobile Menu UX

- **Backdrop**: `<div>` with `fixed inset-0 bg-black/20 z-40` rendered when `isMenuOpen`, onClick closes menu
- **Exit animation**: Wrap mobile menu div with conditional render using `animate-fade-in-down` on open, CSS transition-out on close. Define `@keyframes fadeOutUp` in `global.css` for exit; apply during close via a short `isExiting` boolean state with `setTimeout` matching animation duration (350ms).

### D7: Animation Delays

Cap at `Math.min(index * 100, 400)` (Timeline) and `Math.min(200 + index * 100, 400)` (Services) on all viewports. Spec R7 says ≤400ms on <768px but the simplest approach uses a single formula that never exceeds 400ms regardless of viewport — no device detection needed.

### D8: Dark Mode

All new CSS classes use existing `--color-*` CSS variables. No hardcoded colors. The `data-theme="dark"` system in `global.css` `@layer base` and `dark.css` continues to work unchanged.

## Implementation Guidance

### File Changes (~80 lines total)

| File | Δ | What |
|------|---|------|
| `frontend/package.json` | +1 | Add `@tailwindcss/typography` dep |
| `frontend/tailwind.config.mjs` | +1 | `plugins: [require('@tailwindcss/typography')]` |
| `frontend/src/presentation/styles/global.css` | +15 | `.glass-panel`, `.scroll-progress`, `@keyframes fadeOutUp`, update `.section-header h2` |
| `frontend/src/presentation/components/layout/Header.tsx` | +20 | `sm:flex`, backdrop overlay, touch targets (px-3→px-4 on nav), exit animation state |
| `frontend/src/presentation/components/sections/Hero.astro` | +8 | `py-2xl md:py-4xl`, `text-4xl sm:text-5xl md:text-7xl`, subtitle responsive |
| `frontend/src/presentation/components/sections/About.astro` | +6 | `sm:grid-cols-2` on badges, chip padding bump |
| `frontend/src/presentation/components/sections/Services.astro` | +4 | `py-2xl md:py-4xl`, cap animation delay |
| `frontend/src/presentation/components/sections/ProjectsGrid.tsx` | +10 | Filter buttons `px-3 py-1.5`→`px-4 py-2` |
| `frontend/src/presentation/components/sections/Timeline.astro` | +4 | Cap delay at 400ms |
| `frontend/src/presentation/components/sections/Contact.tsx` | +6 | Section spacing `py-2xl md:py-4xl`, info link touch targets |
| `frontend/src/presentation/components/atoms/ThemeToggle.tsx` | +2 | `p-2`→`p-3` in navbar variant |
| `frontend/src/presentation/components/layout/Footer.astro` | +4 | `sm:grid-cols-2` on grid, social icon `p-2.5`→`p-3` |

### Integration Notes

- `@tailwindcss/typography` v0.5.x: install with `pnpm add -D @tailwindcss/typography`. Register via `require()` in `tailwind.config.mjs` plugins array. Only affects elements with `.prose` class — no side effects elsewhere.
- No Astro config changes needed (already handled by `@astrojs/tailwind`).
- The `<script>` block in `BaseLayout.astro` that sets `data-theme` is unchanged.
- ArticleLayout's `.prose prose-lg` content will receive typography styles automatically after plugin install; verify visually against current unstyled state.

## Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Desktop visual regression | Medium | Verify all 5 breakpoints (320/640/768/1024/1280) in DevTools before commit |
| `prose` plugin changes article rendering | Low | Review 1 project article page after install; can uninstall if issues |
| Touch target bump breaks nav wrapping | Low | Test 320px viewport with all nav links visible at `sm:` breakpoint |
| Exit animation timing mismatch | Low | Test mobile menu open/close cycle; default 350ms matches existing `--transition-slow` |
| Dark mode contrast after changes | Low | All styles use CSS vars; run WCAG AA check on dark theme |

## Acceptance Criteria

- [ ] `glass-panel`, `scroll-progress`, `.prose` render visible styles
- [ ] Section vertical padding on mobile ≤81px (Hero, About, Timeline, Services, Contact)
- [ ] All interactive elements ≥44×44px touch target on mobile
- [ ] Nav shows inline links at ≥640px (was 768px)
- [ ] Hero h1 ≤49px (text-4xl) on 320px, no overflow
- [ ] Mobile menu has backdrop overlay and exit animation on close
- [ ] Animation delays ≤400ms on mobile (Timeline, Services)
- [ ] Dark mode: all renders identical to light mode, no invisible elements
- [ ] `pnpm build` passes with no "class does not exist" warnings
- [ ] No horizontal scroll on 320–1280px viewports
