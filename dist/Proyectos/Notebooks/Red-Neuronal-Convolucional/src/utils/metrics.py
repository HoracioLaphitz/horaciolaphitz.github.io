"""
Cálculo de métricas de clasificación
"""

import numpy as np
from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)
import logging

logger = logging.getLogger(__name__)


class MetricsCalculator:
    """Calcula métricas de clasificación"""
    
    @staticmethod
    def calculate_metrics(y_true: np.ndarray,
                         y_pred: np.ndarray,
                         class_names: list = None) -> dict:
        """
        Calcula métricas de clasificación
        
        Args:
            y_true: Etiquetas verdaderas
            y_pred: Predicciones
            class_names: Nombres de las clases
            
        Returns:
            Diccionario con métricas
        """
        metrics = {
            'accuracy': accuracy_score(y_true, y_pred),
            'precision': precision_score(y_true, y_pred, average='weighted', zero_division=0),
            'recall': recall_score(y_true, y_pred, average='weighted', zero_division=0),
            'f1': f1_score(y_true, y_pred, average='weighted', zero_division=0),
            'confusion_matrix': confusion_matrix(y_true, y_pred)
        }
        
        logger.info(f"Accuracy: {metrics['accuracy']:.4f}")
        logger.info(f"Precision: {metrics['precision']:.4f}")
        logger.info(f"Recall: {metrics['recall']:.4f}")
        logger.info(f"F1-Score: {metrics['f1']:.4f}")
        
        # Reporte detallado
        if class_names:
            report = classification_report(y_true, y_pred,
                                          target_names=class_names,
                                          zero_division=0)
            logger.info(f"\nReporte de Clasificación:\n{report}")
            metrics['classification_report'] = report
        
        return metrics
    
    @staticmethod
    def get_confusion_matrix(y_true: np.ndarray,
                            y_pred: np.ndarray) -> np.ndarray:
        """Obtiene la matriz de confusión"""
        return confusion_matrix(y_true, y_pred)
