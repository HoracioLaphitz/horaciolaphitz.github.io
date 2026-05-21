"""
Configuración centralizada del proyecto
Define parámetros para entrenamiento, modelos y rutas
"""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Tuple, Optional

# Rutas base
PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"
MODELS_DIR = PROJECT_ROOT / "models"
LOGS_DIR = PROJECT_ROOT / "logs"

# Crear directorios si no existen
DATA_DIR.mkdir(exist_ok=True)
MODELS_DIR.mkdir(exist_ok=True)
LOGS_DIR.mkdir(exist_ok=True)


@dataclass
class Config:
    """Configuración general del proyecto"""
    
    # Rutas
    project_root: Path = PROJECT_ROOT
    data_dir: Path = DATA_DIR
    models_dir: Path = MODELS_DIR
    logs_dir: Path = LOGS_DIR
    
    # Parámetros generales
    seed: int = 42
    verbose: int = 1
    device: str = "auto"  # 'auto', 'gpu', 'cpu'
    
    # Logging
    log_level: str = "INFO"
    save_logs: bool = True


@dataclass
class MNISTConfig(Config):
    """Configuración específica para MNIST"""
    
    # Datos
    dataset_name: str = "mnist"
    image_shape: Tuple[int, int, int] = (28, 28, 1)
    num_classes: int = 10
    total_samples_train: int = 60000
    total_samples_test: int = 10000
    
    # Modelo
    model_name: str = "mnist_cnn"
    batch_size: int = 32
    epochs: int = 10
    validation_split: float = 0.2
    
    # Optimización
    learning_rate: float = 0.001
    optimizer: str = "adam"
    loss_function: str = "sparse_categorical_crossentropy"
    metrics: Optional[list] = None
    
    # Regularización
    dropout_rate: float = 0.3
    l2_regularization: float = 0.0001
    
    # Rutas específicas
    model_path: str = "mnist_model.h5"
    history_path: str = "mnist_history.json"
    
    def __post_init__(self):
        if self.metrics is None:
            self.metrics = ["accuracy"]
        self.model_path = str(self.models_dir / self.model_path)
        self.history_path = str(self.logs_dir / self.history_path)


@dataclass
class CatsVsDogsConfig(Config):
    """Configuración específica para Cats vs Dogs"""
    
    # Datos
    dataset_name: str = "cats_vs_dogs"
    image_shape: Tuple[int, int, int] = (100, 100, 1)
    num_classes: int = 2
    
    # Modelo
    model_name: str = "cats_dogs_cnn"
    batch_size: int = 32
    epochs: int = 50
    validation_split: float = 0.15
    
    # Optimización
    learning_rate: float = 0.001
    optimizer: str = "adam"
    loss_function: str = "binary_crossentropy"
    metrics: Optional[list] = None
    
    # Regularización
    dropout_rate: float = 0.4
    l2_regularization: float = 0.0001
    early_stopping_patience: int = 5
    
    # Data augmentation
    use_data_augmentation: bool = True
    augmentation_factor: float = 0.3
    
    # Rutas específicas
    model_path: str = "cats_dogs_model.h5"
    history_path: str = "cats_dogs_history.json"
    
    def __post_init__(self):
        if self.metrics is None:
            self.metrics = ["accuracy"]
        self.model_path = str(self.models_dir / self.model_path)
        self.history_path = str(self.logs_dir / self.history_path)


# Instancias de configuración globales
mnist_config = MNISTConfig()
cats_dogs_config = CatsVsDogsConfig()
