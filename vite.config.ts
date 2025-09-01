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
        manualChunks: (id) => {
          // Node modules chunking strategy
          if (id.includes("node_modules")) {
            // React core
            if (id.includes("react") || id.includes("react-dom")) {
              return "react";
            }
            // Firebase - keep large but essential
            if (id.includes("firebase")) {
              return "firebase";
            }
            // Router
            if (id.includes("wouter")) {
              return "router";
            }
            // Other vendor libraries get grouped
            return "vendor";
          }
          
          // Data file chunking
          if (id.includes("src/data/")) {
            if (id.includes("races/index.ts")) return "race-data";
            if (id.includes("classes/index.ts")) return "class-data";
            if (id.includes("equipment.json")) return "equipment";
            if (id.includes("spells.json")) return "spells";
            // Let monsters be lazy loaded
            if (id.includes("monsters.json")) return; // Return undefined for dynamic import
          }
          
          // Utility chunking
          if (id.includes("src/utils/")) {
            return "utils";
          }
          
          // UI component chunking for better caching
          if (id.includes("src/components/ui/")) {
            return "ui-components";
          }
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 600,
    // Source maps for debugging in production
    sourcemap: true,
    // Module preload for critical chunks
    modulePreload: {
      polyfill: false, // Don't include polyfill
    },
  },
  // Development optimizations
  server: {
    // Fast refresh
    hmr: true,
  },
});
