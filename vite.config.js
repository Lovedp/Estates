import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your Express backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  build: {
    // Exclude backend dependencies from frontend bundle
    rollupOptions: {
      external: ['bcryptjs', 'mongoose', 'express'], // Add other Node.js modules
    },
  },
});