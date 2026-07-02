---
title: "Redes Convolucionales — Dígitos y Clasificador Perros/Gatos"
description: "Dos CNN en un mismo proyecto: reconocimiento de dígitos manuscritos (MNIST) y un clasificador de perros vs gatos. Del dato crudo a la predicción, capa por capa."
pubDate: 2024-02-13
category: "Análisis de datos"
tags: ["Python", "TensorFlow", "CNN", "Deep Learning", "MNIST", "Computer Vision"]
github: "https://github.com/HoracioLaphitz/Redes-Convolucionales"
draft: false
---

## Situación

Las redes convolucionales (CNN) son la base de la visión por computadora moderna. La mejor forma de entenderlas es construirlas sobre problemas clásicos.

## El desafío

Implementar y comparar dos arquitecturas de red sobre dos problemas distintos de clasificación de imágenes.

## La solución

- **Red 1** — reconocimiento de dígitos escritos a mano (dataset MNIST).
- **Red 2** — CNN que clasifica perros vs gatos, usando un set de datos de la librería TensorFlow.

## Impacto

Dos modelos entrenados que ilustran cómo una CNN aprende features visuales jerárquicas, desde bordes hasta objetos completos. La red de dígitos alcanzó **99.76% de accuracy de entrenamiento** (loss 0.0072) tras 10 épocas, con la curva de loss bajando de forma consistente y sin señales de overfitting severo. La arquitectura y el learning rate estaban bien calibrados para el problema.
