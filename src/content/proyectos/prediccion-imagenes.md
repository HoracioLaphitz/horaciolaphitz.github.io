---
title: "Predicción con Imágenes — Clasificación por Píxeles"
description: "Deep learning aplicado a visión por computadora: un modelo con transfer learning que traduce imágenes a píxeles y las clasifica sin entrenar desde cero."
pubDate: 2024-02-13
category: "Análisis de datos"
tags: ["Python", "TensorFlow", "Deep Learning", "Transfer Learning", "Computer Vision"]
github: "https://github.com/HoracioLaphitz/PrediccionImagenes"
draft: false
---

## Situación

Una imagen para una persona es obvia; para una máquina es una matriz de píxeles. El puente entre ambos es un modelo entrenado.

## El desafío

Lograr que un script clasifique correctamente imágenes nuevas, convirtiéndolas a píxeles y reconociendo de qué se trata cada una.

## La solución

Un modelo de deep learning con **transferencia de aprendizaje**: reutilizo features de un modelo preentrenado y afino sobre el set propio. Entrena más rápido y con mejor precisión que una red desde cero.

## Impacto

Clasificación de imágenes funcional que muestra cómo aprovechar modelos preentrenados en lugar de entrenar desde cero. El fine-tuning llevó la **val_accuracy de 79.69% a 100%** (val_loss final: 0.0179) en pocas épocas. Esa progresión muestra el efecto del transfer learning frente a entrenar desde inicialización aleatoria.
