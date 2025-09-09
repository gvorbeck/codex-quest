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
        // Careful chunking strategy to maintain React initialization fix
        manualChunks: (id) => {
          // Keep React core together in main bundle to prevent initialization issues
          if (id.includes("node_modules")) {
            // Keep React ecosystem in main bundle (critical for initialization)
            if (id.includes("react") || id.includes("react-dom") || id.includes("react/jsx-runtime")) {
              return undefined; // Stay in main bundle
            }
            // Firebase can be separate (loaded after React is ready)
            if (id.includes("firebase")) {
              return "firebase";
            }
            // Router can be separate
            if (id.includes("wouter")) {
              return "router";
            }
            // Other vendor libraries
            return "vendor";
          }
          
          // Data chunking (these can be lazy loaded safely)
          if (id.includes("src/data/")) {
            if (id.includes("spells.json")) return "spells";
            if (id.includes("monsters.json")) return "monsters";
            if (id.includes("equipment.json")) return "equipment";
            // Keep race/class data in main for character creation performance
          }
          
          // Large feature chunks that can load after React
          if (id.includes("src/components/character/sheet/")) {
            return "character-sheet";
          }
          if (id.includes("src/components/character/creation/")) {
            return "character-creation";  
          }
          if (id.includes("src/components/game/")) {
            return "game-features";
          }
          
          // UI components can be separate (used across features)
          if (id.includes("src/components/ui/")) {
            return "ui-components";
          }
          
          // Utils can be separate  
          if (id.includes("src/utils/")) {
            return "utils";
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
