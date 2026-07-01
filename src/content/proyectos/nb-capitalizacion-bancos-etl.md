---
title: "Capitalización de Bancos — Web Scraping + ETL"
description: "Cuando el dato vive en una web sin API, hay que ir a buscarlo: web scraping de los bancos más grandes del mundo y un pipeline ETL que los deja listos en SQLite y CSV."
pubDate: 2024-03-22
category: "Notebooks Analytics"
tags: ["Python", "Web Scraping", "ETL", "SQLite", "Pandas", "BeautifulSoup"]
github: "https://github.com/HoracioLaphitz/Capitalizacion-del-Mercado-de-los-Bancos-mas-Grandes"
draft: false
---

## Situación

Muchos datos valiosos viven en tablas de páginas web, sin API. Hay que ir a buscarlos.

## Qué hace

Extrae por **web scraping** la tabla de los bancos más grandes del mundo y la pasa por un proceso **ETL**: extracción, transformación (limpieza y normalización) y carga hacia una base **SQLite** y un archivo CSV.

## Stack

Python · BeautifulSoup · Pandas · SQLite

## Qué aprendí

El flujo completo de ingeniería de datos sobre una fuente real, dejando los datos listos para análisis posterior.
