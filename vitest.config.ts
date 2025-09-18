import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    // Include test files
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    // Exclude e2e tests
    exclude: ["e2e/**/*", "node_modules/**/*"],
  },
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
});
