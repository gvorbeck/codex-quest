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
        // Disable manual chunking temporarily to avoid React initialization issues
        manualChunks: undefined,
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
