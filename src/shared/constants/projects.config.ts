/**
 * Project Filter Configuration
 * Define qué proyectos ocultar y cómo agruparlos en la UI.
 *
 * Los slugs se generan desde los nombres de los repos de GitHub:
 * slugify(name) = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
 *
 * Proyectos a ocultar (triviales / sin contexto de negocio):
 *   - Regresion_Lineal → regresion-lineal
 *   - Analisis-Datos-2  → analisis-datos-2
 *   - Warriors-Games    → warriors-games
 *   - DeepDreams        → deepdreams
 *   - Redes-Convolucionales → redes-convolucionales
 *
 * Proyectos visibles:
 *   Análisis de Datos: MarketBasketAnalytics, EDA_IBM, Capitalizacion..., PredicePrecioAcciones, cancer_issue
 *   Otros: Clustering, Redes-Generativas-Adversariales
 */

/**
 * Set de slugs a ocultar de la grilla visible.
 * Son proyectos triviales, sin contexto de negocio o ejercicios académicos.
 */
export const HIDDEN_PROJECT_SLUGS: ReadonlySet<string> = new Set([
  "regresion-lineal",
  "analisis-datos-2",
  "warriors-games",
  "deepdreams",
  "redes-convolucionales",
]);

/**
 * Categorías del sistema para el split "Análisis de Datos" vs "Otros".
 */
export const DATA_ANALYSIS_CATEGORIES: ReadonlySet<string> = new Set([
  "Análisis de datos",
  "Business Intelligence",
]);

export const OTHER_CATEGORIES: ReadonlySet<string> = new Set([
  "Machine Learning",
  "Data Visualization",
]);
