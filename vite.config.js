import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Site d'une seule page, publié sur https://maciv.jlgouaho.com
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});
