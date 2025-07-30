/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            if (id.includes("wouter")) {
              return "vendor-router";
            }
            if (id.includes("antd")) {
              return "vendor-antd";
            }
            if (id.includes("firebase")) {
              return "vendor-firebase";
            }
            if (id.includes("clsx") || id.includes("dayjs")) {
              return "vendor-utils";
            }
          }

          // Feature chunks based on file paths
          if (id.includes("src/components")) {
            if (
              id.includes("PageCharacterSheet") ||
              id.includes("PageNewCharacter")
            ) {
              return "feature-character";
            }
            if (id.includes("PageGameSheet")) {
              return "feature-game";
            }
            if (
              id.includes("ModalContainer") ||
              id.includes("ModalAttack") ||
              id.includes("ModalCheatSheet")
            ) {
              return "feature-modals";
            }
          }

          // Default chunk for everything else
          return undefined;
        },
      },
    },
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    coverage: { provider: "v8", reporter: ["text", "json", "html"] },
  },
});
