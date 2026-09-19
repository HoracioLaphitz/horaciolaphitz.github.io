---
title: "Agrupamiento de viviendas de California"
description: "Análisis de agrupamiento aplicado a viviendas de California."
pubDate: "2024-02-13T16:52:04.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: ["clustering","python"]
github: "https://github.com/HoracioLaphitz/Clustering"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-clustering -->

## Situación

El notebook aplica agrupamiento no supervisado a datos de viviendas de California para examinar patrones geográficos y socioeconómicos. Trabaja con 20.640 filas y usa ubicación, ingreso mediano, población y hogares como señales para describir zonas con características similares.

## El desafío

Convertir coordenadas y variables de distinta magnitud en segmentos interpretables exige controlar escalas, inicialización y calidad de la partición. En este ejercicio no se conserva el CSV de origen, no se configura una semilla y tampoco se calculan métricas como silhouette. Por eso, los grupos deben leerse como una exploración técnica y no como segmentos comerciales validados o completamente reproducibles.

## La solución

La implementación utiliza pandas para preparar la tabla, Seaborn para inspeccionar distribuciones y scikit-learn para entrenar K-Means con seis clusters. Primero agrupa según latitud, longitud e ingreso mediano; después incorpora población y cantidad de hogares para comparar otra vista de la estructura. Los resultados incluyen la tabla etiquetada y resúmenes por grupo.

## Impacto

El trabajo produce asignaciones para las 20.640 observaciones y facilita contrastar cómo cambian los perfiles al modificar las variables de entrada. Su aporte es didáctico: conecta selección de atributos, clustering y visualización en un caso territorial. No cuantifica estabilidad, capacidad predictiva ni valor de negocio, límites importantes antes de usar esos segmentos para decisiones externas.
