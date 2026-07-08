# Portfolio - Horacio Laphitz

Portfolio profesional desplegado en Vercel.

## 👋 Sobre mí

Soy **Horacio Laphitz**, Data Analyst especializado en Python, SQL y Machine Learning. Construyo pipelines de datos y modelos evaluados con métricas. Mis proyectos incluyen tests y arquitectura documentada, no solo notebooks.

**Proyectos para empezar:**
- [Data Analysis Ecommerce](https://github.com/HoracioLaphitz/Data-Analysis-Ecommerce) — pipeline de datos + agente conversacional sobre 100k+ órdenes de e-commerce, con tests en cada capa.
- [Redes Convolucionales](https://github.com/HoracioLaphitz/Redes-Convolucionales) — dos CNN (MNIST + clasificador perros/gatos), 99.76% accuracy de entrenamiento.
- [Predicción con Imágenes](https://github.com/HoracioLaphitz/PrediccionImagenes) — transfer learning aplicado a clasificación de imágenes.

Este sitio está construido con Clean Architecture (ver sección Arquitectura más abajo). El código del portfolio muestra cómo estructuro software.

## 🚀 Deployment

Este proyecto se despliega automáticamente en Vercel.

### Workflow CI/CD

Vercel se encarga de:
- Build automático en cada push a `main`
- Preview deployments en cada Pull Request
- Deploy automático a producción al mergear a `main`

### URL del Sitio

🌐 **https://horaciolaphitz.vercel.app**

## 📦 Tecnologías

- **Framework**: Astro 5.x
- **UI**: React 18 + Tailwind CSS
- **Lenguaje**: TypeScript
- **Build**: Vite
- **Deploy**: Vercel

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
