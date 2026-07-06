---
title: "Transferencia de Aprendizaje (Transfer Learning)"
description: "Entrenar una red de visión desde cero es caro; reutilizar una preentrenada, inteligente. Transfer learning para clasificar imágenes con buena precisión y poco cómputo."
pubDate: 2024-04-15
category: "Notebooks Analytics"
tags: ["Python", "TensorFlow", "Transfer Learning", "Deep Learning", "Computer Vision"]
github: "https://github.com/HoracioLaphitz/horaciolaphitz.github.io/blob/main/public/Proyectos/Notebooks/TransferenciaAprendizaje/TransferenciaAprendizaje.ipynb"
draft: true
resources:
  notebooks:
    - name: "Transferencia de Aprendizaje"
      path: "/Proyectos/Notebooks/TransferenciaAprendizaje/TransferenciaAprendizaje.ipynb"
---

## El problema

Entrenar una red de visión desde cero exige millones de imágenes y horas de GPU. Para un problema de clasificación acotado, es pagar un costo que otro ya pagó.

## Cómo lo resolví

- Modelo preentrenado descargado de **TensorFlow Hub** como extractor de features congelado: las capas convolucionales ya saben ver bordes, texturas y formas.
- Encima del extractor, una capa `Dense` propia entrenada solo para las clases del problema nuevo.
- Preprocesamiento de imágenes con **PIL** y **OpenCV** para llevarlas al tamaño y formato que el modelo preentrenado espera, y evaluación de accuracy sobre el set de prueba.

## Stack

Python · TensorFlow · TensorFlow Hub · Keras · OpenCV · PIL

## Qué aprendí

Que la transferencia de aprendizaje cambia la economía del deep learning: con una fracción del cómputo y de los datos se llega a precisiones que desde cero serían inalcanzables en el mismo tiempo.
