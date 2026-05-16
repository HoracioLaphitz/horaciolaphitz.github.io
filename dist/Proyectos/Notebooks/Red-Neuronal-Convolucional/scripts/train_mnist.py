"""
Script de entrenamiento para MNIST
Ejecutar: python -m scripts.train_mnist
"""

import sys
import os
from pathlib import Path
import math

# Agregar raíz del proyecto al path
sys.path.insert(0, str(Path(__file__).parent.parent))

import tensorflow as tf
from src.config import mnist_config
from src.data import MNISTDataLoader
from src.models import build_mnist_model, ModelTrainer
from src.utils import setup_logging, Visualizer
import logging

# Configurar logging
logger = setup_logging(mnist_config)


def main():
    """Función principal de entrenamiento"""
    
    logger.info("=" * 80)
    logger.info("INICIANDO ENTRENAMIENTO MNIST")
    logger.info("=" * 80)
    
    # 1. Cargar datos
    logger.info("\n1. CARGANDO DATOS...")
    data_loader = MNISTDataLoader(batch_size=mnist_config.batch_size)
    train_dataset, test_dataset, metadatos = data_loader.load()
    
    logger.info(f"Dataset cargado:")
    logger.info(f"  - Clases: {metadatos.features['label'].names}")
    logger.info(f"  - Shape de imagen: {mnist_config.image_shape}")
    logger.info(f"  - Batch size: {mnist_config.batch_size}")
    
    # 2. Construir modelo
    logger.info("\n2. CONSTRUYENDO MODELO...")
    model = build_mnist_model(mnist_config)
    logger.info("Modelo construido exitosamente")
    logger.info(f"\nArquitectura del modelo:")
    model.summary(print_fn=logger.info)
    
    # 3. Entrenar
    logger.info("\n3. ENTRENANDO MODELO...")
    trainer = ModelTrainer(model, mnist_config)
    
    # Calcular steps per epoch
    steps_per_epoch = math.ceil(mnist_config.total_samples_train / mnist_config.batch_size)
    
    history = trainer.train(
        train_dataset,
        val_data=test_dataset,
        steps_per_epoch=steps_per_epoch
    )
    
    # 4. Evaluar
    logger.info("\n4. EVALUANDO MODELO...")
    eval_results = trainer.evaluate(test_dataset)
    
    for metric, value in eval_results.items():
        logger.info(f"  {metric}: {value:.4f}")
    
    # 5. Guardar
    logger.info("\n5. GUARDANDO MODELO...")
    trainer.save_model()
    trainer.save_history()
    
    # 6. Visualizar
    logger.info("\n6. GENERANDO VISUALIZACIONES...")
    viz = Visualizer()
    
    # Gráfico del historial
    if trainer.history:
        history_plot_path = Path(mnist_config.logs_dir) / "mnist_training_history.png"
        viz.plot_training_history(trainer.history.history, history_plot_path)
    
    logger.info("\n" + "=" * 80)
    logger.info("ENTRENAMIENTO COMPLETADO EXITOSAMENTE")
    logger.info("=" * 80)
    logger.info(f"Modelo guardado en: {mnist_config.model_path}")
    logger.info(f"Historial guardado en: {mnist_config.history_path}")


if __name__ == "__main__":
    main()
