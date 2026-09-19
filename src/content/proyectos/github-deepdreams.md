---
title: "DeepDreams — Estudio de redes neuronales"
description: "Modelo de aprendizaje automático creado para estudiar el entrenamiento de redes neuronales."
pubDate: "2024-07-23T20:17:59.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: ["deep-learning","python"]
github: "https://github.com/HoracioLaphitz/DeepDreams"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-deepdreams -->

## Situación

Este repositorio estudia DeepDream como técnica para amplificar patrones aprendidos por una red convolucional. El experimento toma dos imágenes de entrada y aplica ascenso por gradiente sobre activaciones intermedias para producir variaciones visuales que permitan observar qué rasgos excitan al modelo.

## El desafío

La generación exige seleccionar capas, definir una función objetivo y actualizar los píxeles sin perder control numérico sobre el proceso. Sin embargo, el notebook principal pesa alrededor de 55 MB y no puede consultarse actualmente por la cuota de Git LFS. Esa restricción impide verificar desde el repositorio la arquitectura base, las capas elegidas y los resultados exactos; además, `requirements` y `Pipfile` declaran entornos incompatibles entre sí.

## La solución

La evidencia accesible indica un flujo con TensorFlow y NumPy que calcula gradientes respecto de la imagen y modifica la entrada para maximizar activaciones internas. La organización como notebook favorece la inspección paso a paso y la comparación visual de las dos imágenes procesadas.

## Impacto

El proyecto documenta un ejercicio de interpretación visual mediante optimización directa de entradas. No publica métricas cuantitativas ni una evaluación formal de calidad, algo esperable para una técnica principalmente exploratoria. Debido a la indisponibilidad del notebook, el alcance verificable queda limitado a la estructura pública y las dependencias declaradas; cualquier afirmación sobre modelos o imágenes finales requeriría recuperar el objeto LFS.
