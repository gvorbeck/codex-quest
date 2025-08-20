import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@/components": path.resolve(import.meta.dirname, "./src/components"),
      "@/types": path.resolve(import.meta.dirname, "./src/types"),
      "@/utils": path.resolve(import.meta.dirname, "./src/utils"),
      "@/data": path.resolve(import.meta.dirname, "./src/data"),
      "@/assets": path.resolve(import.meta.dirname, "./src/assets"),
      "@/hooks": path.resolve(import.meta.dirname, "./src/hooks"),
      "@/constants": path.resolve(import.meta.dirname, "./src/constants"),
    },
  },
  build: {
    // Optimize for production
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Core React chunk
          react: ["react", "react-dom"],
          // Router chunk
          router: ["wouter"],
          // Data chunks
          "game-data": [
            "./src/data/classes/index.ts",
            "./src/data/races/index.ts",
            "./src/data/spells.json",
          ],
          // Utility chunks
          utils: [
            "./src/utils/dice.ts",
            "./src/utils/spells.ts",
            "./src/utils/characterValidation.ts",
          ],
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 600,
    // Source maps for debugging in production
    sourcemap: true,
  },
  // Development optimizations
  server: {
    // Fast refresh
    hmr: true,
  },
});
