import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/data": path.resolve(__dirname, "./src/data"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
    },
  },
});
