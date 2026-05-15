"""
Utilidades de visualización
Gráficos para historial de entrenamiento, predicciones, etc.
"""

import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class Visualizer:
    """Clase para visualizaciones de modelos y resultados"""
    
    @staticmethod
    def plot_training_history(history: dict, save_path: Path = None):
        """
        Grafica el historial de entrenamiento
        
        Args:
            history: Diccionario con el historial
            save_path: Ruta para guardar la figura (opcional)
        """
        fig, axes = plt.subplots(1, 2, figsize=(12, 4))
        
        # Accuracy
        if 'accuracy' in history:
            axes[0].plot(history['accuracy'], label='Training')
            if 'val_accuracy' in history:
                axes[0].plot(history['val_accuracy'], label='Validation')
            axes[0].set_title('Accuracy')
            axes[0].set_xlabel('Epoch')
            axes[0].set_ylabel('Accuracy')
            axes[0].legend()
            axes[0].grid(True, alpha=0.3)
        
        # Loss
        if 'loss' in history:
            axes[1].plot(history['loss'], label='Training')
            if 'val_loss' in history:
                axes[1].plot(history['val_loss'], label='Validation')
            axes[1].set_title('Loss')
            axes[1].set_xlabel('Epoch')
            axes[1].set_ylabel('Loss')
            axes[1].legend()
            axes[1].grid(True, alpha=0.3)
        
        plt.tight_layout()
        
        if save_path:
            save_path.parent.mkdir(parents=True, exist_ok=True)
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            logger.info(f"Gráfico de historial guardado en {save_path}")
        
        plt.show()
    
    @staticmethod
    def plot_predictions(images: np.ndarray,
                        predictions: np.ndarray,
                        labels: np.ndarray,
                        class_names: list,
                        num_samples: int = 25,
                        save_path: Path = None):
        """
        Visualiza predicciones en una cuadrícula
        
        Args:
            images: Array de imágenes
            predictions: Array de predicciones
            labels: Labels verdaderos
            class_names: Nombres de las clases
            num_samples: Número de muestras a mostrar
            save_path: Ruta para guardar (opcional)
        """
        num_rows = int(np.sqrt(num_samples))
        num_cols = int(np.sqrt(num_samples))
        
        fig, axes = plt.subplots(num_rows, num_cols, figsize=(12, 12))
        axes = axes.flatten()
        
        for i in range(num_samples):
            # Imagen
            img = images[i].squeeze()
            axes[i].imshow(img, cmap='gray')
            
            # Predicción vs etiqueta
            pred_idx = np.argmax(predictions[i])
            true_idx = int(labels[i])
            
            color = 'green' if pred_idx == true_idx else 'red'
            confidence = np.max(predictions[i])
            
            title = f"Pred: {class_names[pred_idx]}\n"
            title += f"True: {class_names[true_idx]}\n"
            title += f"Conf: {confidence:.2%}"
            
            axes[i].set_title(title, color=color)
            axes[i].axis('off')
        
        plt.tight_layout()
        
        if save_path:
            save_path.parent.mkdir(parents=True, exist_ok=True)
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            logger.info(f"Gráfico de predicciones guardado en {save_path}")
        
        plt.show()
    
    @staticmethod
    def plot_confusion_matrix(cm: np.ndarray,
                             class_names: list,
                             save_path: Path = None):
        """
        Grafica la matriz de confusión
        
        Args:
            cm: Matriz de confusión
            class_names: Nombres de las clases
            save_path: Ruta para guardar (opcional)
        """
        plt.figure(figsize=(10, 8))
        plt.imshow(cm, interpolation='nearest', cmap='Blues')
        plt.title('Matriz de Confusión')
        plt.colorbar()
        
        tick_marks = np.arange(len(class_names))
        plt.xticks(tick_marks, class_names, rotation=45)
        plt.yticks(tick_marks, class_names)
        
        # Anotaciones
        cm_normalized = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
        for i in range(cm.shape[0]):
            for j in range(cm.shape[1]):
                plt.text(j, i, f'{cm[i, j]}\n({cm_normalized[i, j]:.2%})',
                        ha='center', va='center',
                        color='white' if cm_normalized[i, j] > 0.5 else 'black')
        
        plt.ylabel('Etiqueta Verdadera')
        plt.xlabel('Predicción')
        plt.tight_layout()
        
        if save_path:
            save_path.parent.mkdir(parents=True, exist_ok=True)
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            logger.info(f"Matriz de confusión guardada en {save_path}")
        
        plt.show()
