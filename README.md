# Portfolio - Horacio Laphitz

Portfolio profesional desplegado en GitHub Pages.

## 👋 Sobre mí

Soy **Horacio Laphitz**, Data Scientist & ML Engineer. Construyo pipelines de datos, modelos evaluados con rigor, y software de producción con arquitectura limpia — no solo notebooks.

**Proyectos para empezar:**
- [Data Analysis Ecommerce](https://github.com/HoracioLaphitz/Data-Analysis-Ecommerce) — pipeline de datos + agente conversacional sobre 100k+ órdenes de e-commerce, con tests en cada capa.
- [Redes Convolucionales](https://github.com/HoracioLaphitz/Redes-Convolucionales) — dos CNN (MNIST + clasificador perros/gatos), 99.76% accuracy de entrenamiento.
- [Predicción con Imágenes](https://github.com/HoracioLaphitz/PrediccionImagenes) — transfer learning aplicado a clasificación de imágenes.

Este mismo sitio está construido con Clean Architecture (ver sección Arquitectura más abajo) — el portfolio es en sí mismo una muestra de cómo estructuro software.

## 🚀 Deployment

Este proyecto se despliega automáticamente en GitHub Pages mediante GitHub Actions.

### Configuración del Repositorio

1. **Nombre del repositorio**: `horaciolaphitz.github.io`
2. **Rama principal**: `main`
3. **Rama de deployment**: GitHub Pages usa artifacts (no gh-pages)

### Workflow CI/CD

El proyecto usa GitHub Actions para:
- Build automático en cada push a `main`
- Deploy automático a GitHub Pages
- Caché de dependencias para builds más rápidos

### URL del Sitio

🌐 **https://horaciolaphitz.github.io**

## 📦 Tecnologías

- **Framework**: Astro 5.x
- **UI**: React 18 + Tailwind CSS
- **Lenguaje**: TypeScript
- **Build**: Vite
- **Deploy**: GitHub Pages + GitHub Actions

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev

# Build
pnpm build

# Preview
pnpm preview
```

## 📝 Scripts Disponibles

- `pnpm dev` - Servidor de desarrollo
- `pnpm build` - Build de producción
- `pnpm preview` - Preview del build
- `pnpm fetch-repos` - Actualizar repositorios de GitHub
- `pnpm test` - Ejecutar tests
- `pnpm test:run` - Ejecutar tests una vez

## 🏗️ Arquitectura

El proyecto sigue Clean Architecture:

```
src/
├── domain/          # Lógica de negocio
├── application/     # Casos de uso
├── infrastructure/  # Implementaciones
├── presentation/    # UI Components
└── main/           # DI Container
```

## 📄 Licencia

© 2026 Horacio Laphitz. Todos los derechos reservados.
