# SanoYFresco - Análisis de Retail y Market Basket Analysis

## Contexto del Negocio

SanoYFresco es un retailer de productos orgánicos que necesitaba optimizar su estrategia de merchandising y aumentar el valor promedio de compra. El negocio enfrentaba dos desafíos principales:

1. Baja efectividad en la ubicación de productos complementarios
2. Oportunidades de cross-selling no identificadas

## Objetivo del Proyecto

Identificar patrones de compra conjunta mediante Market Basket Analysis para:

- Optimizar la ubicación de productos en tienda
- Diseñar estrategias de cross-selling basadas en datos
- Incrementar el ticket promedio de compra

## Datos

**Volumen:** 4,975,718 transacciones  
**Período:** Año 2023 completo  
**Clientes únicos:** 206,209  
**Productos únicos:** 49,688

**Estructura de datos:**

- ID de pedido y cliente
- Timestamp de transacción (fecha y hora)
- Jerarquía de productos (departamento, sección, producto)
- Información de precio y cantidad

## Metodología

### 1. Extracción y Preparación (SQL + Python)

- Carga de base de datos SQLite con 5M+ registros
- Limpieza y transformación con Pandas
- Estructuración de datos transaccionales para análisis de cestas

### 2. Market Basket Analysis

- Algoritmo Apriori para minería de reglas de asociación
- Métricas calculadas: soporte, confianza y lift
- Filtrado de reglas con confianza > 60% y lift > 1.5

### 3. Análisis de Patrones

- Identificación de productos ancla (alta frecuencia)
- Detección de asociaciones fuertes entre categorías
- Segmentación por departamento y sección

## Resultados Clave

### Asociaciones de Alto Impacto

- Identificadas 50+ reglas de asociación con confianza > 60%
- Productos orgánicos muestran fuerte correlación con categorías premium
- Patrones de compra varían significativamente por hora del día

### Insights Accionables

**1. Optimización de Layout**

- Productos con alta asociación deben ubicarse en proximidad física
- Secciones de frutas y verduras orgánicas generan compras complementarias en lácteos

**2. Estrategia de Cross-Selling**

- Bananas orgánicas → Aguacates (lift: 2.3x)
- Productos de panadería → Lácteos orgánicos (lift: 1.8x)

**3. Segmentación Temporal**

- Compras matutinas (6-10am): enfoque en productos de desayuno
- Compras vespertinas (17-20pm): mayor diversidad de categorías

## Impacto de Negocio

- **Potencial de incremento en ticket promedio:** 15-20% mediante bundling estratégico
- **Reducción de stock muerto:** Identificación de productos de baja rotación
- **Mejora en experiencia de cliente:** Layout optimizado reduce tiempo de búsqueda

## Stack Técnico

- **Base de Datos:** SQLite
- **Análisis:** Python (Pandas, NumPy)
- **Market Basket Analysis:** mlxtend (Algoritmo Apriori)
- **Visualización:** Power BI, Matplotlib
- **Entorno:** Jupyter Notebook (Google Colab)

## Estructura del Proyecto

```
Proyecto SanoYFresco/
├── README.md                          # Este archivo
├── DB/
│   └── dump.sqlite.sql               # Schema y datos de la base
├── Notebooks/
│   └── TPE_MarketBasketAnalysis_colab.ipynb  # Análisis completo
├── Desarrollo.pbix                    # Dashboard Power BI
├── DashMarketing.jpg                  # Preview dashboard marketing
└── DASHVentas.jpg                     # Preview dashboard ventas
```

## Dashboards

El proyecto incluye dos dashboards interactivos en Power BI:

**Dashboard de Ventas:**

- KPIs principales: ventas totales, ticket promedio, productos vendidos
- Análisis temporal de ventas
- Top productos y categorías

**Dashboard de Marketing:**

- Análisis de asociaciones de productos
- Segmentación de clientes por comportamiento de compra
- Métricas de cross-selling

## Próximos Pasos

1. Implementar sistema de recomendaciones en tiempo real
2. Análisis de estacionalidad por categoría de producto
3. Segmentación RFM de clientes para marketing personalizado
4. A/B testing de nuevas ubicaciones de productos

## Contacto

**Horacio Laphitz**  
Analista de Datos  
📧 horaciolaphitz99@gmail.com  
💼 [LinkedIn](https://www.linkedin.com/in/horacio-laphitz/)
