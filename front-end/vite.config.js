import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': { // Toutes les requêtes qui commencent par /api seront redirigées
        target: 'http://localhost:8000', // URL de votre backend Laravel
        changeOrigin: true, // Change l'origine de la requête pour correspondre au backend
        rewrite: (path) => path.replace(/^\/api/, ''), // Supprime /api de l'URL
      },
    },
  },
});