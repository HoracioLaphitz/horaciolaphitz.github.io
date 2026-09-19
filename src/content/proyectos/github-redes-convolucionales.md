---
title: "Redes convolucionales"
description: "Dos redes neuronales: una reconoce dígitos manuscritos y otra clasifica imágenes de perros y gatos."
pubDate: "2024-02-13T19:01:08.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: ["python","redes-neuronales"]
github: "https://github.com/HoracioLaphitz/Redes-Convolucionales"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-redes-convolucionales -->

## Situación

El repositorio reúne dos ejercicios de clasificación con redes convolucionales: reconocimiento de dígitos MNIST y separación de imágenes de gatos y perros. El objetivo es practicar el recorrido desde preparación de imágenes hasta entrenamiento de modelos convolucionales en problemas de distinta complejidad.

## El desafío

MNIST ofrece 60.000 ejemplos pequeños y diez clases, mientras el segundo caso trabaja con fotografías convertidas a escala de grises y 100 × 100 píxeles. La diferencia obliga a adaptar entradas y arquitectura. El repositorio conserva exactitud de entrenamiento para MNIST, pero no una evaluación final de test; para gatos y perros tampoco publica una métrica final, por lo que no puede afirmarse generalización.

## La solución

La implementación utiliza TensorFlow, Keras y TensorFlow Datasets. Capas `Conv2D` y pooling extraen rasgos espaciales, seguidas por capas densas para clasificación. Cada notebook prepara su fuente, ajusta dimensiones y entrena el modelo correspondiente, permitiendo comparar un conjunto canónico con imágenes naturales.

## Impacto

El experimento de MNIST registra 99,76 % de exactitud de entrenamiento. Esa medición describe ajuste sobre las 60.000 muestras y no reemplaza una prueba separada. El segundo ejercicio documenta el pipeline sin un resultado cuantitativo final. En conjunto, el repositorio aporta práctica concreta sobre convolución, reducción espacial y cambio de dominio, pero no evidencia suficiente para uso productivo.
