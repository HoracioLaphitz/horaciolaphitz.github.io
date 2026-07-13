# Estructura del proyecto

Sitio estático construido con Astro + React (islas) + Tailwind CSS. Este documento describe la organización de carpetas, el flujo de datos y las notas de persistencia.

## Arquitectura de carpetas

```
src/
├── data/                      # Datos estáticos tipados (fuente de verdad de contenido)
│   ├── experience.ts          # Experiencia laboral (EXPERIENCE_ITEMS)
│   ├── certifications.ts      # Certificaciones + badges Credly/Tango
│   └── profile-data.ts        # Datos de perfil
├── content/                   # Content Collections de Astro
│   ├── config.ts              # Esquema de la colección
│   └── proyectos/*.md         # Proyectos y notebooks (frontmatter + markdown)
├── presentation/
│   ├── components/
│   │   ├── layout/            # Navigation, Footer
│   │   ├── sections/          # Hero, ProjectCategories, Skills, Experience,
│   │   │                      #   Certifications, CertificateModal, Contact
│   │   ├── ui/                # Logo, ThemeToggle, Icons
│   │   ├── proyectos/         # ProjectCard, ProjectFilters, ResourceDownload
│   │   └── dashboards/        # ProjectDashboard + registry, dashboards por
│   │                          #   proyecto y piezas shared (shell, cards, states)
│   ├── hooks/                 # useScrollAnimation, useTheme
│   ├── layouts/               # Layout.astro, PageLayout.astro, ArticleLayout.astro
│   └── styles/                # global.css (variables de tema), fonts.css,
│                              #   markdown.css
├── infrastructure/
│   ├── github/                # github-raw (fetch), cache, parsers (+ tests)
│   ├── mappers/               # project.mapper (+ tests)
│   └── types/                 # Tipos de soporte para contenido Astro
└── pages/
    ├── index.astro            # Página principal (composición de secciones)
    ├── projects.astro         # Listado de proyectos
    ├── gracias.astro          # Confirmación de contacto
    └── proyectos/
        ├── [slug].astro       # Detalle de proyecto
        └── [slug]/notebook/[notebook].astro  # Visor de notebooks
```

Alias de imports: `@presentation`, `@infrastructure` (ver `tsconfig.json`).

## Flujo de datos

1. **Contenido de secciones**: los módulos de `src/data/*.ts` exportan constantes tipadas (`ExperienceItem[]`, `Certification[]`, etc.). Los componentes de `sections/` los importan directamente; no hay fetching en runtime para este contenido.
2. **Proyectos**: `index.astro` y las páginas de `proyectos/` leen la colección con `getCollection("proyectos")`, transforman con `ProjectMapper` y serializan props hacia las islas React.
3. **Hidratación**: `index.astro` compone las secciones con directivas de cliente — `Hero` y `ProjectCategories` con `client:load`; `Skills`, `Experience`, `Certifications` y `Contact` con `client:visible`.
4. **Dashboards**: los componentes de `dashboards/` obtienen datasets vía `useGithubData` → `infrastructure/github` (fetch de raw de GitHub con capa de caché y parsers). `registry.ts` + `dashboard-slugs.ts` resuelven qué dashboard corresponde a cada proyecto.

## Notas de persistencia

- **Sin backend**: todo el contenido se versiona en el repositorio y se compila a estático (`pnpm build` → `dist/`).
- **Tema**: `useTheme` persiste la preferencia claro/oscuro en `localStorage` (clave `theme`) y alterna la clase `dark` en el documento.
- **Certificados**: los PDF se sirven desde `public/Certificaciones/`; los badges Credly se referencian por URL (`https://www.credly.com/badges/...`) y los de Tango desde `public/Certificaciones/Tango_*.png`.
- **Caché de dashboards**: `infrastructure/github/cache.ts` guarda las respuestas en `sessionStorage` con un TTL de 15 minutos para evitar refetch entre navegaciones; no hay almacenamiento del lado servidor.
