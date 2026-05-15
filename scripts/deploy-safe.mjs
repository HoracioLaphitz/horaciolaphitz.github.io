#!/usr/bin/env node

/**
 * Script de deploy seguro que evita el error EMFILE
 * Usa gh-pages con opciones optimizadas
 */

import ghpages from 'gh-pages';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

console.log('🚀 Iniciando deploy a GitHub Pages...\n');

const options = {
    branch: 'gh-pages',
    message: 'chore(deploy): update site [skip ci]',
    dotfiles: true,

    // Filtrar archivos innecesarios
    filter: (src) => {
        // Ignorar archivos de Python
        if (src.includes('venv/')) return false;
        if (src.includes('__pycache__')) return false;
        if (src.includes('.pyc')) return false;

        // Ignorar Jupyter checkpoints
        if (src.includes('.ipynb_checkpoints')) return false;

        // Ignorar node_modules si de alguna forma llegaron
        if (src.includes('node_modules')) return false;

        // Ignorar archivos de cache
        if (src.includes('.cache')) return false;

        // Ignorar logs
        if (src.endsWith('.log')) return false;

        return true;
    },

    // Limitar archivos abiertos simultáneamente
    nojekyll: true,

    // Callback para progreso
    history: false,
};

ghpages.publish(distDir, options, (err) => {
    if (err) {
        console.error('❌ Error durante el deploy:', err);
        process.exit(1);
    } else {
        console.log('\n✅ Deploy completado exitosamente!');
        console.log('🌐 Tu sitio estará disponible en unos minutos en GitHub Pages');
    }
});
