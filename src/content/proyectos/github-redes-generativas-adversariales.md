---
title: "Redes generativas adversariales"
description: "Algoritmo de aprendizaje no supervisado en el que dos redes compiten para mejorar durante el entrenamiento."
pubDate: "2024-07-25T20:06:39.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: ["aprendizaje-no-supervisado","python"]
github: "https://github.com/HoracioLaphitz/Redes-Generativas-Adversariales"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-redes-generativas-adversariales -->

## Situación

El proyecto implementa una red generativa adversarial para producir imágenes con apariencia de dígitos MNIST. El ejercicio estudia la interacción entre un generador que crea muestras y un discriminador que intenta distinguirlas de 60.000 imágenes reales normalizadas.

## El desafío

El entrenamiento adversarial requiere mantener un equilibrio: si uno de los modelos domina, la señal para el otro deja de ser útil. También es necesario conservar evidencia visual y checkpoints para observar evolución o recuperar estados. El repositorio no incluye FID, evaluación humana ni pruebas de convergencia, por lo que la calidad final no puede reducirse a una métrica validada.

## La solución

La implementación usa TensorFlow y Keras. El generador parte de un vector latente de 100 dimensiones y aplica capas densas y convoluciones transpuestas hasta formar imágenes de 28 × 28. El discriminador combina convoluciones y dropout. Adam optimiza ambos modelos; el entrenamiento está configurado para 30 épocas, lotes de 256, imágenes por época y checkpoints cada 15.

## Impacto

El repositorio entrega un flujo completo para preparar MNIST, alternar actualizaciones adversariales y registrar el progreso de generación. Los artefactos por época permiten una revisión cualitativa sin confundir pérdida con calidad perceptual. No se afirma estabilidad ni realismo generalizado: demostrarlo requeriría métricas comparables, varias semillas y evaluación sobre ejecuciones completas.
