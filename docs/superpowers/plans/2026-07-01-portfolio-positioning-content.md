# Portfolio Positioning & Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposicionar el portfolio Astro hacia Data Scientist / ML Engineer con capacidad de arquitectura de software, reemplazar contenido genérico por case studies con hechos reales, y aplicar 3 rediseños visuales acotados (Hero, Stack, Trayectoria) dentro del sistema de tokens existente.

**Architecture:** Cambios de contenido (Markdown frontmatter/body) y componentes React dentro de Astro (Clean Architecture ya establecida: `presentation/components`). No se tocan `domain`, `application`, ni `infrastructure` excepto el rename Factory→Facade en `main/factories`.

**Tech Stack:** Astro 5, React 18, Tailwind CSS, TypeScript, content collections (`astro:content`).

## Global Constraints

- No modificar paleta ni escala tipográfica — usar `design-tokens.ts` / `tailwind.config.mjs` existentes.
- No tocar `src/domain`, `src/application`, `src/infrastructure` salvo el rename de la Fase 6.
- No restaurar ni tocar `Proyectos/ai-sales-assistant/` (churn pipeline) — permanece borrado.
- Cada task termina con `pnpm astro check` limpio; tasks que tocan componentes visuales terminan además con verificación manual en `pnpm dev`.

---

### Task 1: Reposicionamiento — Hero + metadata de homepage

**Files:**
- Modify: `src/data/profile-data.ts:14`
- Modify: `src/presentation/components/sections/Hero.tsx`
- Modify: `src/pages/index.astro:34-35`

**Interfaces:**
- Consumes: `PROFILE_DATA.title`, `PROFILE_DATA.name`, `PROFILE_DATA.contact.{github,linkedin,email}` (sin cambios de tipo, solo de valor).
- Produces: ninguna interfaz nueva — cambios de contenido y layout puro.

- [ ] **Step 1: Actualizar `PROFILE_DATA.title`**

En `src/data/profile-data.ts:14`, reemplazar:

```ts
"Spec Driven Development Data Analyst | Python + LLMs + SQL",
```

por:

```ts
"Data Scientist & ML Engineer | Python, Arquitectura de Software & Machine Learning",
```

- [ ] **Step 2: Reescribir el Hero — layout centrado + copy reposicionado**

Reemplazar el contenido completo de `src/presentation/components/sections/Hero.tsx` por:

```tsx
import { useState, useEffect } from "react";
import { PROFILE_DATA } from "@data/profile-data";

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center relative pt-14"
    >
      <div
        className={`mx-auto max-w-[760px] w-full px-6 py-20 text-center transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p className="text-sm font-semibold text-brand-primary uppercase tracking-widest mb-6">
          Data Science & ML Engineering
        </p>

        <h1
          className="font-bold text-skin-text mb-6 tracking-tight"
          style={{
            fontSize: "clamp(56px, 8vw, 96px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {PROFILE_DATA.name}
        </h1>

        <p className="text-xl text-skin-muted font-medium mb-4 tracking-wide">
          {PROFILE_DATA.title}
        </p>

        <p className="text-lg text-skin-muted max-w-xl mx-auto leading-relaxed mb-10">
          Construyo software de producción con arquitectura sólida, no solo notebooks — pipelines de datos, modelos evaluados con rigor, y sistemas que otros pueden mantener.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6">
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
            className="text-sm font-semibold text-skin-text hover:text-brand-primary transition-colors duration-200"
          >
            Descargar CV ↓
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

Nota: los íconos de contacto (GitHub/LinkedIn/mail) que estaban en el Hero se remueven de acá — quedan pendientes de reubicar en `Contact.tsx` o `Navigation.tsx` en un task futuro fuera de este plan si hace falta (hoy `Contact.tsx` ya existe como sección aparte, verificar que ya los tenga antes de darlo por perdido).

- [ ] **Step 3: Verificar que Contact.tsx ya tiene los links de contacto**

```bash
grep -n "github\|linkedin\|mail" "src/presentation/components/sections/Contact.tsx"
```

Expected: matches para los 3 (si no los tiene, agregarlos ahí con el mismo `PROFILE_DATA.contact` usado en Hero — mismo patrón de `<a href={PROFILE_DATA.contact.github}>` que se removió en Step 2).

- [ ] **Step 4: Actualizar título y descripción de la homepage**

En `src/pages/index.astro:34-35`, reemplazar:

```astro
  title="Applied GenAI Data Analyst — Python, LangChain & RAG"
  description="Applied GenAI Data Analyst — Python, LLMs, LangChain, Vector Databases."
```

por:

```astro
  title="Horacio Laphitz — Data Scientist & ML Engineer"
  description="Data Scientist & ML Engineer construyendo pipelines de datos, modelos evaluados con rigor y software de producción con arquitectura limpia."
```

- [ ] **Step 5: Validar build**

```bash
pnpm astro check
```

Expected: 0 errors.

```bash
pnpm dev
```

Abrir `http://localhost:4321` y confirmar visualmente: Hero centrado, headline grande, subtítulo, un CTA + un link, sin fila de 3 botones/iconos.

- [ ] **Step 6: Commit**

```bash
git add src/data/profile-data.ts src/presentation/components/sections/Hero.tsx src/pages/index.astro
git commit -m "feat: reposicionar Hero hacia Data Scientist/ML Engineer, layout estilo Apple"
```

---

### Task 2: Case study `ai-sales-assistant.md` — arquitectura real, encuadre DS/ML

**Files:**
- Modify: `src/content/proyectos/ai-sales-assistant.md`

**Interfaces:**
- Consumes: ninguna — archivo de contenido standalone, validado por el schema de `astro:content` existente (no se modifica el schema).
- Produces: ninguna.

- [ ] **Step 1: Reescribir frontmatter y body**

Reemplazar el contenido completo de `src/content/proyectos/ai-sales-assistant.md` por:

```markdown
---
title: "Data Analysis Ecommerce — Pipeline de Datos + Agente LLM"
description: "Pipeline de datos sobre 100k+ órdenes de e-commerce (Olist Brazil) con capa de análisis, tests automatizados, y una interfaz conversacional como capa de consulta — no como el producto en sí."
pubDate: 2026-06-30
category: "Data Science"
tags: ["Python", "Pandas", "Data Engineering", "Testing", "LangChain", "LLM"]
github: "https://github.com/HoracioLaphitz/Data-Analysis-Ecommerce"
featured: true
draft: false
---

## Situación

El dataset Brazilian E-Commerce de Olist (100k+ órdenes, 5 tablas relacionadas) necesita un pipeline confiable antes de que cualquier análisis o modelo tenga sentido — merge de tablas, filtrado de estados válidos, tipado correcto de fechas y montos.

## Arquitectura

Separación por responsabilidad, cada módulo con una interfaz clara:

- **`loader.py`** — carga los 5 CSVs, mergea por `order_id`/`product_id`/`customer_id`, filtra únicamente órdenes `delivered`, devuelve un DataFrame con schema fijo.
- **`analysis.py`** — calcula KPIs (revenue total, AOV, top categorías, revenue por estado) sobre el DataFrame ya limpio.
- **`charts.py`** — funciones puras que devuelven figuras Plotly, sin lógica de negocio.
- **`agent.py`** — capa de consulta en lenguaje natural sobre el DataFrame vía LangChain, aislada del resto del pipeline.

Cada módulo tiene su propio archivo de test (`test_loader.py`, `test_analysis.py`, `test_charts.py`, `test_agent.py`), con mocks del LLM para no depender de la API externa en CI.

## Decisiones técnicas

- El agente LLM es la capa de interfaz, no el núcleo del proyecto — el valor real está en el pipeline de datos y en que cada capa se puede probar de forma aislada.
- `agent.py` no conoce el origen de los datos (`loader.py`); solo recibe un DataFrame con un schema acordado — esto permite cambiar la fuente de datos sin tocar la capa de consulta.

## Resultado

Pipeline reproducible con cobertura de tests en las 4 capas y separación de responsabilidades que permite extender (nuevas fuentes de datos, nuevos proveedores de LLM) sin reescribir el resto del sistema.
```

- [ ] **Step 2: Validar build**

```bash
pnpm astro check
```

Expected: 0 errors (confirma que el frontmatter sigue matcheando el schema de `proyectos` en `src/content/config.ts`).

- [ ] **Step 3: Commit**

```bash
git add src/content/proyectos/ai-sales-assistant.md
git commit -m "feat: reescribir case study ai-sales-assistant con arquitectura real y encuadre DS/ML"
```

---

### Task 3: Métricas reales en proyectos ML locales

**Files:**
- Modify: `src/content/proyectos/redes-convolucionales.md`
- Modify: `src/content/proyectos/prediccion-imagenes.md`

**Interfaces:** ninguna — archivos de contenido standalone.

- [ ] **Step 1: Enriquecer "Impacto" en `redes-convolucionales.md`**

Reemplazar la sección `## Impacto` (líneas 24-26) por:

```markdown
## Impacto

Dos modelos entrenados que ilustran cómo una CNN aprende features visuales jerárquicas, desde bordes hasta objetos completos. La red de dígitos alcanzó **99.76% de accuracy de entrenamiento** (loss 0.0072) tras 10 épocas, con la curva de loss bajando de forma consistente sin señales de overfitting severo — evidencia de que la arquitectura y el learning rate estaban bien calibrados para el problema.
```

- [ ] **Step 2: Enriquecer "Impacto" en `prediccion-imagenes.md`**

Reemplazar la sección `## Impacto` (líneas 23-25) por:

```markdown
## Impacto

Clasificación de imágenes funcional que muestra cómo aprovechar modelos preentrenados en lugar de entrenar desde cero. El fine-tuning llevó la **val_accuracy de 79.69% a 100%** (val_loss final: 0.0179) en pocas épocas — la progresión rápida es evidencia directa del efecto del transfer learning frente a entrenar una red desde inicialización aleatoria.
```

- [ ] **Step 3: Validar build**

```bash
pnpm astro check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/content/proyectos/redes-convolucionales.md src/content/proyectos/prediccion-imagenes.md
git commit -m "feat: agregar métricas reales a case studies de CNN y transfer learning"
```

---

### Task 4: README raíz — storytelling del autor

**Files:**
- Modify: `README.md`

**Interfaces:** ninguna.

- [ ] **Step 1: Insertar sección introductoria antes de "## 🚀 Deployment"**

En `README.md`, después de la línea 3 (`Portfolio profesional desplegado en GitHub Pages.`) y antes de `## 🚀 Deployment`, insertar:

```markdown

## 👋 Sobre mí

Soy **Horacio Laphitz**, Data Scientist & ML Engineer. Construyo pipelines de datos, modelos evaluados con rigor, y software de producción con arquitectura limpia — no solo notebooks.

**Proyectos para empezar:**
- [Data Analysis Ecommerce](https://github.com/HoracioLaphitz/Data-Analysis-Ecommerce) — pipeline de datos + agente conversacional sobre 100k+ órdenes de e-commerce, con tests en cada capa.
- [Redes Convolucionales](https://github.com/HoracioLaphitz/Redes-Convolucionales) — dos CNN (MNIST + clasificador perros/gatos), 99.76% accuracy de entrenamiento.
- [Predicción con Imágenes](https://github.com/HoracioLaphitz/PrediccionImagenes) — transfer learning aplicado a clasificación de imágenes.

Este mismo sitio está construido con Clean Architecture (ver sección Arquitectura más abajo) — el portfolio es en sí mismo una muestra de cómo estructuro software.
```

- [ ] **Step 2: Validar que el resto del README no se rompió**

```bash
pnpm build
```

Expected: build exitoso (el README no afecta el build de Astro, pero confirma que no se rompió nada en el mismo commit).

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: agregar sección de presentación y proyectos destacados al README raíz"
```

---

### Task 5: Stack — grid de 2-3 columnas

**Files:**
- Modify: `src/presentation/components/sections/Skills.tsx:61-89`

**Interfaces:**
- Consumes: `SKILL_GROUPS`, `PROFILE_DATA.skills` (sin cambios de tipo).
- Produces: ninguna.

- [ ] **Step 1: Reemplazar el layout de `space-y-12` por grid**

En `src/presentation/components/sections/Skills.tsx`, reemplazar el bloque (líneas 61-89):

```tsx
        <div className="space-y-12">
          {SKILL_GROUPS.map((group, gi) => (
            <div
              key={group.label}
              className={`transition-all duration-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
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
```

por:

```tsx
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {SKILL_GROUPS.map((group, gi) => (
            <div
              key={group.label}
              className={`transition-all duration-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{ transitionDelay: `${gi * 60}ms` }}
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
```

- [ ] **Step 2: Validar build y visual**

```bash
pnpm astro check && pnpm dev
```

Confirmar en el navegador (sección `#skills`): 6 grupos en 2-3 columnas según viewport, altura total de la sección notablemente menor que antes.

- [ ] **Step 3: Commit**

```bash
git add src/presentation/components/sections/Skills.tsx
git commit -m "refactor: Stack en grid de columnas para reducir alto de la sección"
```

---

### Task 6: Trayectoria — rediseño minimalista

**Files:**
- Modify: `src/presentation/components/sections/Timeline.tsx`

**Interfaces:**
- Consumes: `TIMELINE_ITEMS`, `activeFilter`, `filteredItems` (sin cambios de tipo/lógica de filtrado).
- Produces: ninguna.

- [ ] **Step 1: Reemplazar el estilo de los botones de filtro**

Reemplazar cada uno de los 3 bloques `<button onClick={() => setActiveFilter(...)}>` (líneas 602-641) — mismo `onClick`, mismo contenido interno, nuevo className. Ejemplo para el botón "Todos" (aplicar el mismo patrón a "work" y "certification"):

```tsx
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-1 pb-2 text-sm font-semibold border-b-2 transition-all duration-300 ${
                activeFilter === "all"
                  ? "border-brand-primary text-skin-text"
                  : "border-transparent text-skin-muted hover:text-skin-text"
              }`}
            >
              <span className="flex items-center gap-2">
                <ListBulletIcon className="w-4 h-4" />
                Todos ({TIMELINE_ITEMS.length})
              </span>
            </button>
```

(Repetir el mismo `className` template para los botones "work" y "certification", cambiando solo `activeFilter === "..."`, el ícono y el label — misma estructura que ya existe hoy.)

- [ ] **Step 2: Reemplazar el diseño de las cards del timeline**

Reemplazar el bloque de renderizado de cada card (líneas 682-769):

```tsx
              {filteredItems.map((item, index) => (
                <div
                  key={`${item.period}-${item.role}-${index}`}
                  className={`relative flex-shrink-0 w-80 transition-all duration-200 hover:scale-105 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: `${Math.min(index * 50, 500)}ms` }}
                >
                  <div className="group bg-skin-primary border border-skin-border p-6 rounded-2xl hover:border-brand-primary transition-all duration-300 h-full">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div
                        className={`p-2.5 rounded-xl ${
                          item.type === "work"
                            ? "bg-brand-primary/10 text-brand-primary"
                            : "bg-brand-accent/10 text-brand-accent"
                        }`}
                      >
                        {item.type === "work" ? (
                          <BriefcaseIcon className="w-5 h-5" />
                        ) : (
                          <BookOpenIcon className="w-5 h-5" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-skin-muted uppercase tracking-wide">
                        {item.type === "work" ? "Experiencia" : "Certificación"}
                      </span>
                    </div>

                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary bg-brand-primary/10 px-3 py-1.5 rounded-lg">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {item.period}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-skin-text mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-brand-primary transition-colors">
                      {item.role}
                    </h3>

                    <p className="text-sm font-semibold text-brand-primary mb-2 flex items-center gap-2">
                      <BuildingOfficeIcon className="w-4 h-4" />
                      {item.company}
                    </p>

                    {item.location && (
                      <p className="text-xs text-skin-muted mb-3 flex items-center gap-1.5 font-medium">
                        <MapPinIcon className="w-4 h-4" />
                        {item.location}
                      </p>
                    )}

                    {item.description && (
                      <p className="text-sm text-skin-muted mt-4 pt-4 border-t border-skin-border/50 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {item.type === "certification" && item.certificateUrl && (
                      <button
                        onClick={() => setSelectedCert(item)}
                        className="mt-5 w-full inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-skin-primary text-sm font-semibold rounded-lg hover:bg-brand-hover transition-all duration-300 justify-center"
                      >
                        <EyeIcon className="w-4 h-4" />
                        Ver Certificado
                      </button>
                    )}
                  </div>

                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
                    <div className="relative">
                      <div
                        className={`absolute inset-0 w-4 h-4 rounded-full animate-ping opacity-20 ${
                          item.type === "work"
                            ? "bg-brand-primary"
                            : "bg-brand-accent"
                        }`}
                      />
                      <div
                        className={`relative w-4 h-4 rounded-full border-4 border-skin-secondary ${
                          item.type === "work"
                            ? "bg-brand-primary"
                            : "bg-brand-accent"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
```

por:

```tsx
              {filteredItems.map((item, index) => (
                <div
                  key={`${item.period}-${item.role}-${index}`}
                  className={`relative flex-shrink-0 w-80 transition-all duration-200 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: `${Math.min(index * 50, 500)}ms` }}
                >
                  <div className="border-t-2 border-skin-border pt-5 h-full">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-skin-muted">
                        {item.period}
                      </span>
                      <span className="text-xs font-medium text-skin-muted uppercase tracking-wide">
                        {item.type === "work" ? "Experiencia" : "Certificación"}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-skin-text mb-1 line-clamp-2 min-h-[3.5rem]">
                      {item.role}
                    </h3>

                    <p className="text-sm text-skin-muted mb-2">
                      {item.company}
                    </p>

                    {item.location && (
                      <p className="text-xs text-skin-muted mb-3">
                        {item.location}
                      </p>
                    )}

                    {item.description && (
                      <p className="text-sm text-skin-muted mt-3 pt-3 border-t border-skin-border/50 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {item.type === "certification" && item.certificateUrl && (
                      <button
                        onClick={() => setSelectedCert(item)}
                        className="mt-4 text-sm font-semibold text-brand-primary hover:underline"
                      >
                        Ver certificado →
                      </button>
                    )}
                  </div>
                </div>
              ))}
```

Nota: `BriefcaseIcon`, `BookOpenIcon` siguen usándose en los botones de filtro (Step 1) — no eliminar sus imports. `AwardIcon`, `CalendarIcon`, `MapPinIcon`, `BuildingOfficeIcon`, `EyeIcon` quedan sin uso tras este cambio salvo `AwardIcon` (sigue usado en la sección de badges, líneas 538-541) — eliminar los imports/definiciones de ícono que queden huérfanos (`CalendarIcon`, `MapPinIcon`, `BuildingOfficeIcon`, `EyeIcon` si ya no aparecen en ningún otro lado del archivo tras el Step 2; `DownloadIcon` y `XMarkIcon` se mantienen, se usan en el modal de certificado que no cambia).

- [ ] **Step 3: Verificar imports huérfanos**

```bash
grep -n "CalendarIcon\|MapPinIcon\|BuildingOfficeIcon\|EyeIcon" "src/presentation/components/sections/Timeline.tsx"
```

Si alguno de los 4 solo aparece en su propia definición (una sola ocurrencia), eliminar esa definición del archivo.

- [ ] **Step 4: Validar build y visual**

```bash
pnpm astro check && pnpm dev
```

Confirmar en `#timeline`: filtros como tabs de texto subrayado, cards sin íconos/colores/animación ping, línea divisoria fina arriba de cada card, scroll horizontal y modal de certificado funcionando igual que antes.

- [ ] **Step 5: Commit**

```bash
git add src/presentation/components/sections/Timeline.tsx
git commit -m "refactor: rediseño minimalista de Trayectoria — sin chips de color ni animaciones decorativas"
```

---

### Task 7: Rename Factory → Facade

**Files:**
- Modify: `src/main/factories/project.factory.ts` (rename a `src/main/factories/project.facade.ts`)
- Modify: cualquier archivo que importe `ProjectFactory`

**Interfaces:**
- Consumes: `container.getProjectService()` (sin cambios).
- Produces: `ProjectFacade` — mismos métodos estáticos que antes tenía `ProjectFactory` (`getService`, `getAllProjects`, `getFeaturedProjects`, `getProjectBySlug`), mismas firmas.

- [ ] **Step 1: Encontrar todos los usos de `ProjectFactory`**

```bash
grep -rn "ProjectFactory" src/
```

Anotar cada archivo que aparezca — se actualizan todos en el Step 3.

- [ ] **Step 2: Crear `project.facade.ts` con el contenido renombrado**

Crear `src/main/factories/project.facade.ts`:

```ts
/**
 * Facade: Project
 * Simplifies access to project-related use cases behind a single entry point
 */

import { container } from "@main/di/container";
import type { ProjectService } from "@application/services/project.service";

export class ProjectFacade {
  static getService(): ProjectService {
    return container.getProjectService();
  }

  static async getAllProjects() {
    const service = this.getService();
    return service.getAllProjects();
  }

  static async getFeaturedProjects() {
    const service = this.getService();
    return service.getFeaturedProjects();
  }

  static async getProjectBySlug(slug: string) {
    const service = this.getService();
    return service.getProjectBySlug(slug);
  }
}
```

- [ ] **Step 3: Borrar el archivo viejo y actualizar imports**

```bash
rm src/main/factories/project.factory.ts
```

Para cada archivo encontrado en el Step 1, reemplazar:

```ts
import { ProjectFactory } from "@main/factories/project.factory";
```

por:

```ts
import { ProjectFacade } from "@main/factories/project.facade";
```

y cada uso de `ProjectFactory.` por `ProjectFacade.` en ese mismo archivo.

- [ ] **Step 4: Validar build**

```bash
pnpm astro check && pnpm build
```

Expected: 0 errors — confirma que no quedó ningún import roto.

- [ ] **Step 5: Commit**

```bash
git add -A src/main/factories/ src/
git commit -m "refactor: renombrar ProjectFactory a ProjectFacade — refleja el patrón real (Facade, no Factory Method)"
```

---

### Task 8: Fuente externa — quitar dependencia no oficial

**Files:**
- Modify: `src/presentation/styles/fonts.css`

**Interfaces:** ninguna.

- [ ] **Step 1: Remover el `@font-face` de SF Pro Display apuntando a `sf.abarba.me`**

`sf.abarba.me` es un mirror no oficial de una fuente propietaria de Apple — además del riesgo de disponibilidad, licenciar SF Pro para uso fuera de plataformas Apple no está permitido, así que vendorizar el `.otf` tampoco es una opción válida. La forma correcta es usar `-apple-system`/`BlinkMacSystemFont` (que resuelve a la SF Pro real y gratis en dispositivos Apple, respetando la licencia) con Inter como fallback ya cargado desde Google Fonts.

Reemplazar el contenido completo de `src/presentation/styles/fonts.css` por:

```css
/* Variable Fonts - Apple-style Typography */

/* Inter - Variable Font, fuente body y fallback de display */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* Font Preload Hints */
:root {
  --font-display: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}

/* Typography Scale - Apple-inspired */
.text-display-large {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.025em;
}

.text-display {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.text-headline {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.015em;
}

.text-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.text-body-large {
  font-family: var(--font-body);
  font-size: clamp(1.125rem, 2vw, 1.25rem);
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0;
}

.text-body {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0;
}

/* Smooth Font Rendering */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

- [ ] **Step 2: Validar build y visual**

```bash
pnpm astro check && pnpm dev
```

Confirmar que la tipografía sigue viéndose bien (Inter en todos los navegadores, SF Pro real en macOS/iOS vía `-apple-system`) y que no hay requests a `sf.abarba.me` en la pestaña Network del navegador.

- [ ] **Step 3: Commit**

```bash
git add src/presentation/styles/fonts.css
git commit -m "fix: remover dependencia de fuente no oficial (sf.abarba.me), usar -apple-system + Inter"
```

---

## Self-Review Notes

- Cobertura de spec: secciones 1-8 del spec (`docs/superpowers/specs/2026-07-01-portfolio-positioning-content-design.md`) mapean 1:1 a Tasks 1-8 de este plan (Task 1 cubre spec §1, Task 2 → §2, Task 3 → §3, Task 4 → §4, Task 5 → §5/Stack, Task 6 → §5/Trayectoria, Task 7 → §6, Task 8 → §7). El §8 (repo externo) se cubre en un plan separado — ver `2026-07-01-data-analysis-ecommerce-hardening.md` en el repo `Data-Analysis-Ecommerce`.
- El Hero de Task 1 remueve los íconos de contacto — Step 3 verifica que `Contact.tsx` los tenga antes de dar el cambio por completo; si no los tiene, es un ajuste de 3 líneas dentro del mismo Step, no un task nuevo.
