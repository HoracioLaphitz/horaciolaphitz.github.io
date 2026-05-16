"""
Módulo de entrenamiento de modelos
Gestiona el ciclo de entrenamiento, evaluación y guardado
"""

import tensorflow as tf
import json
import logging
from pathlib import Path
from typing import Tuple, Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)


class ModelTrainer:
    """Entrenador de modelos con logging y checkpoints"""
    
    def __init__(self, model: tf.keras.Model, config: Any):
        """
        Inicializa el entrenador
        
        Args:
            model: Modelo a entrenar
            config: Configuración del modelo
        """
        self.model = model
        self.config = config
        self.history = None
        self.best_epoch = 0
        
    def train(self,
              train_data: Any,
              val_data: Any = None,
              **fit_kwargs) -> Dict:
        """
        Entrena el modelo
        
        Args:
            train_data: Datos de entrenamiento
            val_data: Datos de validación (opcional)
            **fit_kwargs: Argumentos adicionales para model.fit()
            
        Returns:
            Diccionario con historial de entrenamiento
        """
        logger.info(f"Iniciando entrenamiento por {self.config.epochs} épocas...")
        
        callbacks = self._build_callbacks()
        
        self.history = self.model.fit(
            train_data,
            validation_data=val_data,
            epochs=self.config.epochs,
            callbacks=callbacks,
            verbose=self.config.verbose if hasattr(self.config, 'verbose') else 1,
            **fit_kwargs
        )
        
        logger.info("Entrenamiento completado")
        return self.history.history
    
    def _build_callbacks(self) -> list:
        """Construye callbacks para el entrenamiento"""
        callbacks = []
        
        # Early stopping (si está configurado)
        if hasattr(self.config, 'early_stopping_patience'):
            callbacks.append(
                tf.keras.callbacks.EarlyStopping(
                    monitor='val_loss',
                    patience=self.config.early_stopping_patience,
                    restore_best_weights=True,
                    verbose=1
                )
            )
        
        # Model checkpoint
        checkpoint_path = Path(self.config.model_path)
        checkpoint_path.parent.mkdir(parents=True, exist_ok=True)
        
        callbacks.append(
            tf.keras.callbacks.ModelCheckpoint(
                str(checkpoint_path),
                monitor='val_accuracy' if 'val_accuracy' in self.history.model.metrics_names 
                        else 'val_loss',
                save_best_only=True,
                verbose=1
            )
        )
        
        # Tensorboard
        log_dir = Path(self.config.logs_dir) / "tensorboard" / datetime.now().strftime("%Y%m%d_%H%M%S")
        log_dir.mkdir(parents=True, exist_ok=True)
        
        callbacks.append(
            tf.keras.callbacks.TensorBoard(
                log_dir=str(log_dir),
                histogram_freq=1,
                profile_batch=0
            )
        )
        
        return callbacks
    
    def evaluate(self, test_data: Any) -> Dict:
        """
        Evalúa el modelo
        
        Args:
            test_data: Datos de prueba
            
        Returns:
            Diccionario con métricas de evaluación
        """
        logger.info("Evaluando modelo...")
        
        results = self.model.evaluate(test_data, verbose=0)
        
        # Construir diccionario de resultados
        metrics_names = self.model.metrics_names
        evaluation_results = {
            name: float(value)
            for name, value in zip(metrics_names, 
                                   results if isinstance(results, list) else [results])
        }
        
        logger.info(f"Resultados de evaluación: {evaluation_results}")
        
        return evaluation_results
    
    def save_history(self):
        """Guarda el historial de entrenamiento en JSON"""
        if self.history is None:
            logger.warning("No hay historial para guardar")
            return
        
        history_path = Path(self.config.history_path)
        history_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(history_path, 'w') as f:
            json.dump(self.history.history, f, indent=2)
        
        logger.info(f"Historial guardado en {history_path}")
    
    def save_model(self):
        """Guarda el modelo"""
        model_path = Path(self.config.model_path)
        model_path.parent.mkdir(parents=True, exist_ok=True)
        
        self.model.save(str(model_path))
        logger.info(f"Modelo guardado en {model_path}")
    
    def load_model(self):
        """Carga un modelo guardado"""
        model_path = Path(self.config.model_path)
        
        if not model_path.exists():
            logger.error(f"Modelo no encontrado en {model_path}")
            return None
        
        self.model = tf.keras.models.load_model(str(model_path))
        logger.info(f"Modelo cargado desde {model_path}")
        return self.model
