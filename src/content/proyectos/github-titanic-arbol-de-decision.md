---
title: "Titanic — Árbol de decisión"
description: "Análisis de los pasajeros del Titanic y modelo para estimar la supervivencia de una persona nueva."
pubDate: "2024-02-13T19:28:34.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: ["analisis-de-datos","python"]
github: "https://github.com/HoracioLaphitz/TITANIC-Arbol_de_Decision"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-titanic-arbol-de-decision -->

## Situación

El proyecto analiza 891 pasajeros del Titanic y entrena un árbol de decisión para clasificar supervivencia. La tabla combina datos personales, clase, tarifa y variables con ausencias importantes, entre ellas 177 edades y 687 valores faltantes en cabina.

## El desafío

Preparar el conjunto exige tratar faltantes, codificar categorías y controlar la profundidad para evitar sobreajuste. El notebook explora árboles de profundidad 1 a 14 sobre una división 80/20. Como no fija `random_state`, la partición puede cambiar entre ejecuciones y las métricas publicadas no son completamente reproducibles. Tampoco permiten inferir causas históricas de supervivencia.

## La solución

La implementación usa pandas y Seaborn para explorar y transformar los datos, y scikit-learn para codificación, entrenamiento y evaluación. La comparación de profundidades selecciona un árbol de profundidad 8 y calcula exactitud y F1 por clase sobre 178 observaciones de prueba.

## Impacto

La corrida registrada obtiene 84,8 % de exactitud, con F1 de 0,89 para no supervivencia y 0,78 para supervivencia. Son resultados de una división concreta, no una garantía estable. El trabajo muestra cómo la complejidad del árbol afecta el rendimiento y deja visibles los principales problemas de calidad. Fijar la semilla y repetir la evaluación sería necesario para estimar variabilidad.
