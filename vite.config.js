import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relativa sökvägar så att appen fungerar på GitHub Pages
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
  },
});
