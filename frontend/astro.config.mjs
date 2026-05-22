import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  publicDir: '../public',
  integrations: [
    react(),
    tailwind(),
  ],
  output: 'static',
  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    ssr: {
      noExternal: ['@tabler/icons-react', 'framer-motion'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    resolve: {
      alias: {
        '@domain': resolve(__dirname, 'src/domain'),
        '@infrastructure': resolve(__dirname, 'src/infrastructure'),
        '@presentation': resolve(__dirname, 'src/presentation'),
        '@shared': resolve(__dirname, 'src/shared'),
        '@data': resolve(__dirname, 'src/data'),
      },
    },
  },
});
