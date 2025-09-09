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
        // Balanced chunk splitting - avoid React initialization issues but keep sizes reasonable
        manualChunks: (id) => {
          // Node modules chunking strategy
          if (id.includes("node_modules")) {
            // Keep React and React-DOM together to avoid initialization issues
            if (id.includes("react") || id.includes("react-dom")) {
              return "react";
            }
            // Firebase
            if (id.includes("firebase")) {
              return "firebase";
            }
            // Router
            if (id.includes("wouter")) {
              return "router";
            }
            // Other vendor libraries
            return "vendor";
          }
          
          // Data file chunking (keep these separate for lazy loading)
          if (id.includes("src/data/")) {
            if (id.includes("races/index.ts")) return "race-data";
            if (id.includes("classes/index.ts")) return "class-data";
            if (id.includes("equipment.json")) return "equipment";
            if (id.includes("spells.json")) return "spells";
            if (id.includes("monsters.json")) return "monsters";
          }
          
          // Utility chunking
          if (id.includes("src/utils/")) {
            return "utils";
          }
          
          // UI component chunking
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
      polyfill: true, // Include polyfill for better compatibility
    },
  },
  // Development optimizations
  server: {
    // Fast refresh
    hmr: true,
  },
});
