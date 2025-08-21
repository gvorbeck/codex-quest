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
          // Firebase chunk - only import what we use for better tree-shaking
          firebase: [
            "firebase/app", 
            "firebase/auth", 
            "firebase/firestore"
          ],
          // Data chunks - split by type for better caching
          "race-data": ["./src/data/races/index.ts"],
          "class-data": ["./src/data/classes/index.ts"],
          // Utility chunks
          utils: ["./src/utils/dice.ts", "./src/utils/characterValidation.ts"],
          // Large data files - separate chunks for lazy loading
          equipment: ["./src/data/equipment.json"],
          spells: ["./src/data/spells.json"],
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
