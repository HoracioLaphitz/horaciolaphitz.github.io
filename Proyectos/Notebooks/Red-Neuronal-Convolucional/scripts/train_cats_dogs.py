"""
Script de entrenamiento para Cats vs Dogs
Ejecutar: python -m scripts.train_cats_dogs
"""

import sys
from pathlib import Path

# Agregar raíz del proyecto al path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.config import cats_dogs_config
from src.data import CatsVsDogsDataLoader
from src.models import build_cats_dogs_model, ModelTrainer
from src.utils import setup_logging, Visualizer
from sklearn.model_selection import train_test_split
import logging

# Configurar logging
logger = setup_logging(cats_dogs_config)


def main():
    """Función principal de entrenamiento"""
    
    logger.info("=" * 80)
    logger.info("INICIANDO ENTRENAMIENTO CATS VS DOGS")
    logger.info("=" * 80)
    
    # 1. Cargar datos
    logger.info("\n1. CARGANDO Y PREPROCESANDO DATOS...")
    data_loader = CatsVsDogsDataLoader(image_size=cats_dogs_config.image_shape[0])
    X, y, metadatos = data_loader.load()
    
    logger.info(f"Dataset cargado:")
    logger.info(f"  - X shape: {X.shape}")
    logger.info(f"  - y shape: {y.shape}")
    logger.info(f"  - Distribución: Gatos={sum(y==0)}, Perros={sum(y==1)}")
    
    # 2. Dividir en entrenamiento/validación
    logger.info("\n2. DIVIDIENDO DATOS...")
    X_train, X_val, y_train, y_val = train_test_split(
        X, y,
        test_size=cats_dogs_config.validation_split,
        random_state=cats_dogs_config.seed
    )
    
    logger.info(f"  - Entrenamiento: {X_train.shape[0]} muestras")
    logger.info(f"  - Validación: {X_val.shape[0]} muestras")
    
    # 3. Construir modelo
    logger.info("\n3. CONSTRUYENDO MODELO...")
    model = build_cats_dogs_model(cats_dogs_config)
    logger.info("Modelo construido exitosamente")
    logger.info(f"\nArquitectura del modelo:")
    model.summary(print_fn=logger.info)
    
    # 4. Entrenar
    logger.info("\n4. ENTRENANDO MODELO...")
    trainer = ModelTrainer(model, cats_dogs_config)
    
    history = trainer.train(
        X_train, y_train,
        validation_data=(X_val, y_val),
        batch_size=cats_dogs_config.batch_size
    )
    
    # 5. Evaluar
    logger.info("\n5. EVALUANDO MODELO...")
    eval_results = trainer.evaluate((X_val, y_val))
    
    for metric, value in eval_results.items():
        logger.info(f"  {metric}: {value:.4f}")
    
    # 6. Guardar
    logger.info("\n6. GUARDANDO MODELO...")
    trainer.save_model()
    trainer.save_history()
    
    # 7. Visualizar
    logger.info("\n7. GENERANDO VISUALIZACIONES...")
    viz = Visualizer()
    
    # Gráfico del historial
    if trainer.history:
        history_plot_path = Path(cats_dogs_config.logs_dir) / "cats_dogs_training_history.png"
        viz.plot_training_history(trainer.history.history, history_plot_path)
    
    logger.info("\n" + "=" * 80)
    logger.info("ENTRENAMIENTO COMPLETADO EXITOSAMENTE")
    logger.info("=" * 80)
    logger.info(f"Modelo guardado en: {cats_dogs_config.model_path}")
    logger.info(f"Historial guardado en: {cats_dogs_config.history_path}")


if __name__ == "__main__":
    main()
