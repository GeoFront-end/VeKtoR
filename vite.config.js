import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // root directory
  build: {
    outDir: 'dist', // output folder
    rollupOptions: {
      input: './index.html', // main entry
    },
  },
});