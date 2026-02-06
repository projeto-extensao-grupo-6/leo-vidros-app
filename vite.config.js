import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@services': path.resolve(__dirname, './src/services'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
    }
  },
  
  optimizeDeps: {
    exclude: [
      "@radix-ui/react-slot",
      "@radix-ui/react-compose-refs",
    ],
  },

});