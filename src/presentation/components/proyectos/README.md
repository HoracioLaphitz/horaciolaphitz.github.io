# Componentes de Visualización de Proyectos

Componentes React reutilizables para mejorar la presentación visual de los proyectos en markdown.

## Componentes Disponibles

### ProjectMetrics
Muestra métricas clave en tarjetas visuales.

```tsx
<ProjectMetrics
  metrics={[
    { label: 'Transacciones', value: '127,384', icon: '📊' },
    { label: 'Productos', value: '169', icon: '🛒' },
    { label: 'Sucursales', value: '12', icon: '🏪' },
    { label: 'Ticket Promedio', value: '$45.30', icon: '💰' }
  ]}
/>
```

### TechStack
Organiza tecnologías por categoría.

```tsx
<TechStack
  technologies={[
    {
      category: 'Análisis',
      items: ['Python 3.9+', 'Pandas', 'NumPy']
    },
    {
      category: 'Visualización',
      items: ['Power BI', 'Matplotlib']
    }
  ]}
/>
```

### InsightList
Lista de insights con métricas destacadas.

```tsx
<InsightList
  insights={[
    {
      title: 'Pasta → Salsa',
      description: 'La asociación más fuerte encontrada',
      metric: '82.1%',
      variant: 'highlight'
    }
  ]}
/>
```

### ProcessTimeline
Línea de tiempo visual del proceso.

```tsx
<ProcessTimeline
  steps={[
    {
      title: 'Planificación',
      description: 'Definición de objetivos y métricas'
    },
    {
      title: 'Análisis',
      description: 'Exploración de datos y patrones'
    }
  ]}
/>
```

### ResultsShowcase
Muestra resultados con tendencias.

```tsx
<ResultsShowcase
  title="Impacto del Proyecto"
  results={[
    {
      label: 'Ventas',
      value: '+8.2%',
      change: '+3.5%',
      trend: 'up'
    }
  ]}
/>
```

### FeatureGrid
Grid de características o funcionalidades.

```tsx
<FeatureGrid
  title="Características del Dashboard"
  columns={2}
  features={[
    {
      title: 'Visualización en tiempo real',
      description: 'Actualización automática de métricas'
    }
  ]}
/>
```

### CalloutBox
Cajas de llamada de atención.

```tsx
<CalloutBox type="highlight" title="Nota Importante">
  Este análisis se basa en datos reales de 18 meses.
</CalloutBox>
```

### ComparisonTable
Tabla comparativa antes/después.

```tsx
<ComparisonTable
  title="Impacto de las Mejoras"
  beforeLabel="Antes"
  afterLabel="Después"
  rows={[
    { label: 'Ticket Promedio', before: '$45.30', after: '$49.80' },
    { label: 'Ventas', before: '100%', after: '108.2%' }
  ]}
/>
```

### QuoteBlock
Citas destacadas.

```tsx
<QuoteBlock
  quote="Tenemos un tesoro de datos, pero no sabemos qué hacer con él."
  author="Gerente de Operaciones"
  role="Cadena de Supermercados"
/>
```

### ProjectSection
Contenedor para secciones del proyecto.

```tsx
<ProjectSection title="Resultados">
  <ResultsShowcase results={...} />
</ProjectSection>
```

### ProjectHeader
Encabezado del proyecto con metadata.

```tsx
<ProjectHeader
  title="Market Basket Analysis"
  description="Análisis de patrones de compra"
  tags={['python', 'power bi', 'retail']}
  date="2024-10-20"
/>
```

## Uso en Layouts de Astro

```astro
---
import { ProjectHeader, ProjectSection, ProjectMetrics } from '@presentation/components/proyectos/ProjectContent';

const { frontmatter } = Astro.props;
---

<article>
  <ProjectHeader
    title={frontmatter.title}
    description={frontmatter.description}
    tags={frontmatter.tags}
    date={frontmatter.pubDate}
  />

  <ProjectSection title="Métricas Clave">
    <ProjectMetrics client:load metrics={metricsData} />
  </ProjectSection>

  <slot />
</article>
```

## Principios de Diseño

- **Sin emojis**: Los componentes no incluyen emojis por defecto
- **Jerarquía de colores**: Respetan los tokens de color del portfolio
- **Responsive**: Todos los componentes son responsive
- **Accesibilidad**: Siguen las mejores prácticas de accesibilidad
- **Consistencia**: Usan el sistema de diseño del portfolio

## Tokens de Color Utilizados

- `text-skin-primary`: Texto principal
- `text-skin-muted`: Texto secundario
- `text-skin-accent`: Texto de acento/destacado
- `bg-skin-surface`: Fondo de superficie
- `border-skin-border`: Bordes
- `border-skin-accent`: Bordes de acento

## Espaciado

Los componentes usan el sistema de espaciado del portfolio:
- `gap-xs`, `gap-sm`, `gap-md`, `gap-lg`, `gap-xl`
- `p-xs`, `p-sm`, `p-md`, `p-lg`, `p-xl`
- `my-lg`, `my-xl`, `mb-md`, etc.
