import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite"; // ✅ Garante o uso do plugin dedicado do Tailwind para Vite
import tsconfigPaths from "vite-tsconfig-paths"; // ✅ Necessário para resolver aliases de caminhos definidos no tsconfig.json

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
    tsconfigPaths(),
    tsconfigPaths(),
  ],
  
  
  optimizeDeps: {
    exclude: [
      "@radix-ui/react-slot",
      "@radix-ui/react-compose-refs",
    ],
  },

});