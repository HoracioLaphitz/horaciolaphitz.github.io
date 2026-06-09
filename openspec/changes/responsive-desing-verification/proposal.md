# Proposal: Responsive Design Verification

## Intent

Portfolio responsiveness is inconsistent across mobile/tablet. Three CSS classes are undefined (`glass-panel`, `scroll-progress`, `prose`), critical spacing values consume ~38% viewport height on 320px screens, touch targets fall below 44px HIG minimum, and breakpoint usage skips `sm:` (640px) in key components — leaving tablet users with a mobile-like experience.

## Scope

### In Scope
- Fix 3 broken CSS classes in `global.css` + install `@tailwindcss/typography`
- Reduce vertical spacing on mobile (`py-4xl` → `py-2xl`/`py-3xl`)
- Add `sm:` breakpoint variants to grids, nav, and layout components
- Scale font sizes down on mobile (`text-5xl` → `text-4xl` on Hero, etc.)
- Improve touch targets to ≥44px across nav links, filters, chips, toggles
- Add backdrop overlay + exit animation to mobile menu
- Reduce animation delays on mobile for faster initial paint
- Add responsive font-size utilities in global.css

### Out of Scope
- Adding tests (no frontend test framework exists)
- Full redesign of components or layout architecture
- Adding swipe gestures or advanced mobile interactions
- Performance optimization beyond animation timing

## Capabilities

> No existing spec files in `openspec/specs/`. This change introduces a new spec.

### New Capabilities
- `responsive-design`: Viewport-adaptive layout, touch targets ≥44px, consistent breakpoint strategy (`sm/md/lg/xl`), responsive typography scale, and mobile menu UX requirements.

### Modified Capabilities
None — no existing specs to modify.

## Approach

1. **Fix broken CSS**: Add `.glass-panel` and `.scroll-progress` to `global.css` `@layer components`. Install `@tailwindcss/typography` plugin for `prose` classes.
2. **Reduce mobile spacing**: Halve `py-4xl` → `py-2xl` at mobile, keep `py-5xl` at `md+`. Use responsive padding utilities throughout.
3. **Add `sm:` breakpoints**: Audit all grid/nav components for missing `sm:` variants (Footer, Header, About, skills grid, contact cards).
4. **Responsive typography**: Add `text-[size] sm:text-[size]` pairs. Reduce Hero heading to `text-4xl sm:text-5xl md:text-7xl`. Create responsive type scale in global.css.
5. **Touch targets**: Bump `px-3 py-1.5` → `px-4 py-2` on nav links, filters, chips. Theme toggle `p-2` → `p-3`.
6. **Mobile menu**: Add backdrop overlay (`fixed inset-0 bg-black/20 z-40`), exit animation via `animate-fade-in-down` on close, focus trap via `aria-hidden`.
7. **Animation timing**: Cap delays at 400ms on mobile (`motion-safe:` variant or matchMedia check). Reduce stagger counts on small viewports.
8. **Container audit**: Remove duplicate `px-4` where `.container` already adds padding.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/presentation/styles/global.css` | Modified | Add `.glass-panel`, `.scroll-progress`, responsive type utilities, `sm:` spacing overrides |
| `tailwind.config.mjs` | Modified | Add `@tailwindcss/typography` to plugins |
| `package.json` | Modified | Add `@tailwindcss/typography` dependency |
| `src/presentation/components/layout/Header.tsx` | Modified | Fix `glass-panel`, add backdrop overlay, touch targets, `sm:` nav breakpoint |
| `src/presentation/components/ui/ScrollProgress.tsx` | Modified | Fix `scroll-progress` styling |
| `src/presentation/layouts/ArticleLayout.astro` | Modified | `prose` now works after plugin install |
| `src/presentation/components/sections/Hero.astro` | Modified | Reduce `py-4xl`, responsive font sizes, blob sizing |
| `src/presentation/components/sections/About.astro` | Modified | Add `sm:` grid breakpoint, touch targets on chips |
| `src/presentation/components/sections/Services.astro` | Modified | Reduce spacing, responsive grid |
| `src/presentation/components/sections/ProjectsGrid.tsx` | Modified | Touch targets on filters, responsive search bar |
| `src/presentation/components/sections/ProjectCard.tsx` | Modified | Review truncation, responsive card padding |
| `src/presentation/components/sections/Timeline.astro` | Modified | Reduce animation delays on mobile |
| `src/presentation/components/sections/Contact.tsx` | Modified | Touch targets, responsive spacing |
| `src/presentation/components/atoms/ThemeToggle.tsx` | Modified | Larger touch target |
| `src/presentation/layouts/BaseLayout.astro` | Modified | Container padding audit |
| `src/presentation/components/layout/Footer.astro` | Modified | Add `sm:grid-cols-2`, responsive spacing |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Visual regression on desktop | Medium | Test all breakpoints in browser DevTools before commit |
| Spacing reduction breaks layout rhythm | Low | Keep same ratio at desktop; only reduce mobile base |
| `@tailwindcss/typography` conflicts with existing styles | Low | Scoped under `.prose` class; test article pages |
| Touch target bump shifts nav layout | Low | Use flex gap; verify no overflow on 320px viewport |
| Overflow-x on mobile after changes | Low | Test with narrowest viewport (320px) + content edge cases |

## Rollback Plan

1. Undo spacing changes → revert `py-*` values to original in each file.
2. Uninstall `@tailwindcss/typography` → `pnpm remove @tailwindcss/typography` + remove from `tailwind.config.mjs`.
3. Revert `global.css` → delete added classes (they're new, no prior state to restore).
4. All changes are scoped to CSS and markup — no logic changes, revert is safe.

## Dependencies

- `@tailwindcss/typography` — needs `pnpm add -D @tailwindcss/typography`

## Success Criteria

- [ ] Lighthouse Mobile performance/accessibility ≥90 on portfolio home page
- [ ] No horizontal scroll (overflow-x) on 320px–1280px viewports
- [ ] All touch targets ≥44px on mobile (verified via DevTools overlay)
- [ ] `glass-panel`, `scroll-progress`, `prose` classes render visible styles
- [ ] Section vertical padding on mobile ≤80px total (was 121.5–182.25px)
- [ ] Hero heading ≤36px on 320px screens (was 61px)
- [ ] Header nav shows inline links at ≥640px (was 768px)
- [ ] Mobile menu shows backdrop overlay and exit animation
- [ ] Dark mode unaffected — all style changes use CSS variables
