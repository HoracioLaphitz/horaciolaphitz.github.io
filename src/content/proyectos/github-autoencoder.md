---
title: "Autoencoder — Restauración de imágenes"
description: "Red neuronal que reconstruye dígitos a partir de imágenes borrosas."
pubDate: "2024-07-22T16:18:03.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: ["machine-learning-algorithms","python"]
github: "https://github.com/HoracioLaphitz/Autoencoder"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-autoencoder -->

## Situación

El proyecto estudia la restauración de imágenes mediante un autoencoder entrenado con MNIST. Parte de dígitos de 28 × 28 píxeles, incorpora ruido a las entradas y compara las imágenes alteradas con reconstrucciones producidas por una red neuronal.

## El desafío

La tarea exige aprender una representación que descarte parte del ruido sin perder la forma del dígito. La evaluación disponible corresponde al propio entrenamiento y a una inspección de 15 reconstrucciones; no constituye una prueba independiente de reconocimiento ni de generalización. Además, el código reutiliza `imagen_ejemplo` al aplicar ruido, una limitación que puede distorsionar esa demostración puntual.

## La solución

La implementación usa TensorFlow y Keras con capas convolucionales, pooling, upsampling y convoluciones transpuestas. La salida sigmoide se optimiza con entropía cruzada binaria y Adam. El modelo suma 2.561 parámetros y se entrena durante 10 épocas con lotes de 200 ejemplos.

## Impacto

El experimento documenta un pipeline compacto de eliminación de ruido y alcanza una pérdida de entrenamiento de 0,2643 y una exactitud por píxel de 0,8016. Esas cifras describen el ajuste observado sobre el proceso de entrenamiento, no precisión de clasificación ni rendimiento en datos externos. El repositorio resulta útil como ejercicio controlado de representación convolucional y visualización de reconstrucciones.
