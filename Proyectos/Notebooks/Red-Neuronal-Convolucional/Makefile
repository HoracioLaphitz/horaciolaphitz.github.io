# Makefile - Automatización de tareas comunes

.PHONY: help install train-mnist train-cats train-all predict clean test lint format

help:
	@echo "Red Neuronal Convolucional - Comandos disponibles:"
	@echo ""
	@echo "Instalación:"
	@echo "  make install           - Instala dependencias"
	@echo "  make venv              - Crea entorno virtual"
	@echo ""
	@echo "Entrenamiento:"
	@echo "  make train-mnist       - Entrena modelo MNIST"
	@echo "  make train-cats        - Entrena modelo Cats vs Dogs"
	@echo "  make train-all         - Entrena ambos modelos"
	@echo ""
	@echo "Predicción:"
	@echo "  make predict-mnist IMG=ruta/imagen.png   - Predice dígito"
	@echo "  make predict-cats IMG=ruta/imagen.png    - Predice Gato/Perro"
	@echo ""
	@echo "Desarrollo:"
	@echo "  make lint              - Valida código con flake8"
	@echo "  make format            - Formatea código con black"
	@echo "  make test              - Ejecuta tests"
	@echo "  make clean             - Limpia archivos generados"
	@echo ""

install:
	pip install -r requirements.txt

venv:
	python -m venv venv
	@echo "Entorno virtual creado. Activar con:"
	@echo "Windows: venv\\Scripts\\activate"
	@echo "Unix/Mac: source venv/bin/activate"

train-mnist:
	python -m scripts.train_mnist

train-cats:
	python -m scripts.train_cats_dogs

train-all: train-mnist train-cats
	@echo "Todos los modelos entrenados exitosamente"

predict-mnist:
	ifndef IMG
		@echo "Error: Especificar imagen con IMG=ruta/imagen.png"
	else
		python -m scripts.predict --model mnist --image $(IMG)
	endif

predict-cats:
	ifndef IMG
		@echo "Error: Especificar imagen con IMG=ruta/imagen.png"
	else
		python -m scripts.predict --model cats_dogs --image $(IMG)
	endif

lint:
	flake8 src/ scripts/ --count --select=E9,F63,F7,F82 --show-source --statistics
	flake8 src/ scripts/ --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics

format:
	black src/ scripts/ experiments/ tests/ --line-length 100

test:
	pytest tests/ -v

test-coverage:
	pytest tests/ --cov=src --cov-report=html

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".coverage" -exec rm -rf {} +
	find . -type d -name "htmlcov" -exec rm -rf {} +

show-logs:
	tail -f logs/cnn_project.log

tensorboard:
	tensorboard --logdir logs/tensorboard/

.DEFAULT_GOAL := help
