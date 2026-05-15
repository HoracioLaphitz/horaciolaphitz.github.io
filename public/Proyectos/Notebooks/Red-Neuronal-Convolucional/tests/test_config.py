"""
Tests unitarios para el proyecto
"""

import sys
from pathlib import Path

# Agregar raíz al path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from src.config import MNISTConfig, CatsVsDogsConfig


class TestConfiguration:
    """Tests para configuración"""
    
    def test_mnist_config_initialization(self):
        """Test inicialización config MNIST"""
        config = MNISTConfig()
        assert config.dataset_name == "mnist"
        assert config.image_shape == (28, 28, 1)
        assert config.num_classes == 10
    
    def test_cats_dogs_config_initialization(self):
        """Test inicialización config Cats vs Dogs"""
        config = CatsVsDogsConfig()
        assert config.dataset_name == "cats_vs_dogs"
        assert config.image_shape == (100, 100, 1)
        assert config.num_classes == 2
    
    def test_mnist_config_paths_exist(self):
        """Test que los directorios existen"""
        config = MNISTConfig()
        assert config.data_dir.exists()
        assert config.models_dir.exists()
        assert config.logs_dir.exists()


class TestDataUtilities:
    """Tests para utilidades de datos"""
    
    def test_data_normalizer_import(self):
        """Test importación de normalizador"""
        from src.data import DataNormalizer
        normalizer = DataNormalizer()
        assert normalizer is not None


class TestModels:
    """Tests para construcción de modelos"""
    
    def test_mnist_model_creation(self):
        """Test creación modelo MNIST"""
        from src.models import build_mnist_model
        from src.config import MNISTConfig
        
        config = MNISTConfig()
        model = build_mnist_model(config)
        
        assert model is not None
        assert len(model.layers) > 0
    
    def test_cats_dogs_model_creation(self):
        """Test creación modelo Cats vs Dogs"""
        from src.models import build_cats_dogs_model
        from src.config import CatsVsDogsConfig
        
        config = CatsVsDogsConfig()
        model = build_cats_dogs_model(config)
        
        assert model is not None
        assert len(model.layers) > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
