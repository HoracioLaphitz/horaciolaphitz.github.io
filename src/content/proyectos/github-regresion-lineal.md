---
title: "Regresión lineal: de Celsius a Fahrenheit"
description: "Modelo de regresión lineal que aprende a convertir temperaturas de grados Celsius a Fahrenheit."
pubDate: "2024-02-13T19:35:11.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: ["jupyter-notebook","linear-regression","python"]
github: "https://github.com/HoracioLaphitz/Regresion_Lineal"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-regresion-lineal -->

## Situación

Este notebook usa la relación entre grados Celsius y Fahrenheit como ejercicio introductorio de regresión con redes neuronales. Reúne 40 pares conocidos para mostrar entrenamiento, predicción y exportación de un modelo Keras en un problema cuya función subyacente es lineal.

## El desafío

El caso debe separar aprendizaje sobre los mismos ejemplos de una evaluación real sobre datos no vistos. Aquí se documenta entrenamiento y serialización, pero no una partición de validación ni métricas independientes. Además, una celda predice para 990 °C mientras la etiqueta textual menciona 100 °C; el valor 1814 mostrado corresponde aproximadamente a la entrada efectiva y no debe presentarse como acierto para 100.

## La solución

La implementación combina TensorFlow, Keras y NumPy. Define una red densa con cinco capas ocultas, optimiza error cuadrático medio mediante Adam con tasa 0,01 durante 1.000 épocas y guarda el resultado en formato HDF5. El notebook permite seguir pérdida, inferencia y persistencia en una secuencia breve.

## Impacto

El proyecto demuestra el ciclo técnico mínimo de una regresión neuronal y deja un modelo exportado para reutilización. Su valor es didáctico, no competitivo: una fórmula exacta resuelve el mismo problema con mayor simplicidad. Sin evaluación separada, no corresponde atribuir precisión general; el ejemplo resulta útil para entender la API y detectar cómo una etiqueta incorrecta puede alterar la interpretación de una salida.
