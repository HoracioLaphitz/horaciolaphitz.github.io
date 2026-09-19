---
title: "Predicción con imágenes"
description: "Modelo de aprendizaje automático que convierte imágenes en píxeles y clasifica ejemplos similares a los usados durante el entrenamiento."
pubDate: "2024-02-13T14:45:11.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: ["aprendizaje-automatico","python"]
github: "https://github.com/HoracioLaphitz/PrediccionImagenes"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-prediccionimagenes -->

## Situación

El proyecto entrena un clasificador de imágenes para distinguir tres categorías mediante transferencia de aprendizaje. Parte de un conjunto reducido y busca reutilizar representaciones visuales de una red preentrenada en lugar de ajustar desde cero un modelo grande.

## El desafío

La muestra contiene 586 imágenes de entrenamiento y 146 de validación, una escala propensa al sobreajuste. Aunque la validación alcanza un resultado alto, no constituye una evaluación independiente ni demuestra desempeño fuera de esa partición. El tamaño del dataset exige interpretar con cautela cualquier conclusión sobre generalización.

## La solución

La implementación usa TensorFlow, Keras y TensorFlow Hub con MobileNetV2 congelada como extractor de características. Redimensiona las entradas a 224 × 224, aplica aumento de datos y entrena una cabeza softmax de tres clases. Al mantener fija la base, el ajuste se concentra en 3.843 parámetros entrenables y reduce el costo del experimento.

## Impacto

En la época 10, el entrenamiento registra exactitud de 0,9932 y la validación interna llega a 1,0. Esas cifras describen las particiones utilizadas y no prueban robustez ante imágenes nuevas, cambios de dominio o clases desbalanceadas. El aporte verificable es un pipeline compacto de transferencia de aprendizaje con preparación, aumento y clasificación; una evaluación independiente sería necesaria antes de usarlo en un escenario real.
