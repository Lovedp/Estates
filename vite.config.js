import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://estates-2.onrender.com', // Your Express backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove '/api' prefix
      },
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        // Node.js modules (backend-only)
        'mongoose',
        'bcryptjs',
        'express',
        'crypto',       // Common Node.js modules
        'fs',           // File system (Node-only)
        'path',         // Node.js path module
        'http',         // Node.js HTTP module
        'querystring',   // Node.js querystring module
      ],
    },
  },
});