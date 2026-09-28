import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Site multi-pages : la visite immersive + les pages « dossiers » d'origine
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        histoire: resolve(__dirname, 'html/Présentation/Histoire.html'),
        gastronomie: resolve(__dirname, 'html/Spécialités/Spécialités.html'),
        tourisme: resolve(__dirname, 'html/Visiter/Visiter.html'),
        art: resolve(__dirname, 'html/Art/Art.html'),
      },
    },
  },
});
