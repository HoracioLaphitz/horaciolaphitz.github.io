#!/usr/bin/env node

/**
 * Script para limpiar archivos innecesarios de public/ antes del deploy
 * Elimina: venv, __pycache__, .ipynb_checkpoints, etc.
 */

import { rmSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

const pathsToRemove = [
    // Python virtual environments
    'Proyectos/Notebooks/venv',
    'Proyectos/Notebooks/noteooks/venv',

    // Python cache
    'Proyectos/Notebooks/__pycache__',
    'Proyectos/Notebooks/**/__pycache__',

    // Jupyter checkpoints
    'Proyectos/Notebooks/.ipynb_checkpoints',
    'Proyectos/Notebooks/**/.ipynb_checkpoints',

    // Git folders (no deberían estar aquí)
    'Proyectos/Notebooks/.git',
    'Proyectos/Notebooks/**/.git',

    // Node modules (no deberían estar aquí)
    'Proyectos/Notebooks/node_modules',
    'Proyectos/Notebooks/**/node_modules',
];

console.log('🧹 Limpiando archivos innecesarios de public/...\n');

let removedCount = 0;

pathsToRemove.forEach(relativePath => {
    const fullPath = join(publicDir, relativePath);

    if (existsSync(fullPath)) {
        try {
            rmSync(fullPath, { recursive: true, force: true });
            console.log(`✓ Eliminado: ${relativePath}`);
            removedCount++;
        } catch (error) {
            console.warn(`⚠ No se pudo eliminar ${relativePath}:`, error.message);
        }
    }
});

if (removedCount === 0) {
    console.log('✓ No se encontraron archivos para limpiar');
} else {
    console.log(`\n✅ Limpieza completada: ${removedCount} elementos eliminados`);
}
