# Regresión Altura-Peso — Modelado Predictivo

Predicción de peso a partir de altura usando regresión lineal y polinómica, con el flujo completo de un proyecto de ML: split train/test, pipelines de `scikit-learn`, validación cruzada y evaluación con métricas estándar (R², MAE, MSE).

## 📊 Qué hace el notebook

`Altura-Peso-Regresion.ipynb` carga y explora los datos, ajusta modelos de regresión lineal y polinómica, compara su desempeño con métricas cuantitativas y encapsula las predicciones en funciones reutilizables — no queda como código suelto en celdas.

## 🎯 Objetivos

1. Flujo completo de modelado de regresión, de datos crudos a predicción.
2. Separación train/test y validación cruzada para evitar overfitting.
3. Pipelines de `scikit-learn` para escalado y transformación polinómica.
4. Visualizaciones comparativas y métricas de rendimiento.
5. Documentación pensada para revisión y reuso por terceros.

## 🛠️ Tecnologías

- Python 3.11+
- pandas 2.x
- matplotlib, seaborn
- scikit-learn 1.0+

## 📦 Instalación

```bash
pip install -r requirements.txt
```

> El archivo `requirements.txt` contiene las dependencias necesarias; puedes instalarlo en un entorno virtual.

## 🚀 Uso

1. Navega a la carpeta `Notebooks`.
2. Abre `Altura-Peso-Regresion.ipynb` con Jupyter o VSCode.
3. Asegúrate de tener el fichero `datos.csv` con las columnas `Altura (m)` y `Peso(kg)` en el mismo directorio.
4. Ejecuta las celdas secuencialmente para reproducir análisis y modelos.

## 📈 Resultados esperados

- Scatterplots de los datos originales.
- Métricas de desempeño para modelos lineal y polinómico.
- Función reutilizable para predicción de peso a partir de la altura.

## 👤 Autor

Horacio Laphitz - [GitHub](https://github.com/HoracioLaphitz)

## 📝 Licencia

MIT License
