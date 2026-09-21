# Repository Agent Instructions

## Purpose and Evidence Boundary

- This is Horacio Laphitz's public, Spanish-language portfolio for data analysis, process automation, and evidence-supported Applied AI work.
- Optimize for a recruiter's path: understand the profile, inspect proof, verify experience or credentials, and contact Horacio quickly.
- Treat repository evidence as the boundary of public claims. Never invent clients, testimonials, credentials, metrics, production use, or business impact.
- Keep completed work, prototypes, work in progress, estimates, and active learning explicitly distinct; preserve unrelated changes in this active shared worktree.

## Source Precedence

When documentation conflicts, use this order:

1. Current source, tests, and runtime configuration.
2. `package.json`, lockfile, and active tool configuration.
3. Current product and evidence documents below.
4. Dated audits, plans, roadmaps, changelogs, and generated memory only as historical context.

| Read when | Authority |
| --- | --- |
| Changing product direction or public positioning | `docs/PRODUCT.md`, `docs/product/portfolio-positioning.md` |
| Adding or promoting a skill | `docs/product/skill-evidence-map.md`, `docs/audits/unverified-claims.md` |
| Changing project structure or data flow | `docs/structure.md`, then verify against source |
| Changing visual tokens or section patterns | `docs/design.md`, `tailwind.config.mjs`, `src/presentation/styles/global.css` |
| Changing metadata, SEO, or analytics | Relevant file under `docs/seo/` or `docs/analytics/`, then verify implementation |
| Preparing a release or security-sensitive change | `docs/deploy/`, `docs/CONTRIBUTING.md`, `docs/SECURITY.md` |
| Proposing future portfolio projects | `docs/projects/PROJECT_BACKLOG.md` |

## Stack and Package Manager

- Use **pnpm 11.1.2**; do not switch package managers or regenerate the lockfile unnecessarily.
- Current stack: Astro 7 static generation, React 18 islands, TypeScript strict mode, Tailwind CSS 3.4, Vitest, and Playwright.
- Deployment target: Vercel with `output: "static"`; reuse existing dependencies and platform features before adding code or packages.

## Architecture and Content Authorities

- Keep business logic in `src/domain/`, external data and mapping in `src/infrastructure/`, UI in `src/presentation/`, routes in `src/pages/`, and shared utilities in `src/shared/`.
- Use Astro content collections in `src/content/proyectos/` for project case studies; preserve schema validation and map entries through the existing mapper.
- Use React hydration only for genuine interaction. Prefer static Astro/HTML for presentational content.
- Use configured aliases (`@domain`, `@infrastructure`, `@presentation`, `@shared`, `@data`) instead of long relative imports.
- Current content authorities:
  - positioning and public contact metadata: `src/data/public-positioning.v1.ts`
  - experience: `src/data/experience.ts`
  - certifications: `src/data/certifications.ts`
  - projects: `src/content/proyectos/*.md` plus the collection schema and mapper
  - active visual tokens: `tailwind.config.mjs` and `src/presentation/styles/global.css`
- Keep domain aggregations pure, framework-independent, and covered by focused tests.

## UI, UX, and Accessibility

- Preserve the evidence-first hierarchy and a short path from positioning to proof and contact.
- Use direct, professional Spanish for public copy; avoid generic marketing language and unsupported superlatives.
- Maintain responsive layouts from 320px upward, visible keyboard focus, semantic landmarks and headings, descriptive links, useful alt text, and 44px touch targets.
- Preserve light/dark themes, sufficient contrast, reduced-motion behavior, and content visibility without JavaScript.
- Keep animation functional and restrained; do not hide essential information behind motion or complex interaction. Treat local, browser, deployed, and external-service checks as separate evidence gates.

## Claims and Public Content

- Every displayed skill must have project, experience, or recognized-course evidence.
- Label projections as `estimacion` or `escenario`; quantitative claims require a traceable methodology or source.
- Do not upgrade learning or personal experiments into professional/production experience, or add enterprise-AI claims merely for keyword coverage.
- When evidence is unclear, remove, narrow, or explicitly qualify the claim.

## Validation

Run the smallest applicable check first, then broaden before delivery:

```sh
pnpm vitest run path/to/file.test.ts
pnpm astro check
pnpm test:run
pnpm build
```

- `pnpm build` runs `pnpm sync:github` through `prebuild`; account for its network and credential requirements instead of silently changing generated content.
- For UI work, additionally verify the affected route in a real browser at representative mobile and desktop widths.
- A successful build does not prove responsive behavior, accessibility, hydration, deployed headers, analytics, or Vercel integration.

## Vercel and Deployment

- Keep `vercel.json` security headers and `astro.config.mjs` static-output behavior intact unless the task explicitly changes them.
- Never claim deployment success from a local build. Verify the actual Vercel deployment, routes, headers, and external integrations separately.
- Do not deploy, promote, trigger hooks, rotate credentials, or change Vercel settings without explicit authorization.
- Never expose tokens, environment values, private data, or deploy-hook URLs. Do not commit `.env*` or generated `dist/` output.

## Git and Delivery

- Inspect `git status` before and after work. Do not reset, discard, reformat, or stage unrelated changes.
- Keep changes atomic and use conventional commits only when explicitly asked to commit.
- Never add `Co-Authored-By` or AI attribution.
- Do not push, open a PR, deploy, or sync remote state without explicit authorization.
- Report exactly which checks ran and which browser, deployment, or external validations remain pending.

## Historical or Drift-Prone Documents

- Treat `MEMORY.md` and `docs/MEMORY.md` as generated snapshots, not instructions.
- Treat `docs/superpowers/`, `docs/specs/`, dated audits, `docs/github-sync-roadmap.md`, and `docs/vercel-cron-sync-setup.md` as historical task context unless current code confirms them.
- `docs/HERMES_ENGINEERING_SETUP.md` describes one machine/tool setup and is not a repository contract.
- Known drift: `README.md` still says Astro 5; some architecture/design docs reference inactive token modules, `tailwind.config.ts`, Inter, fixed test/page counts, or GitHub Pages. Verify all such claims against current files before using them.
