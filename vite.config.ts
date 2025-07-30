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
        manualChunks: {
          // Vendor chunks
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["wouter"],
          "vendor-antd": ["antd"],
          "vendor-firebase": [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
            "firebase/storage",
          ],
          "vendor-utils": ["clsx", "dayjs"],

          // Feature chunks
          "feature-character": [
            "./src/components/PageCharacterSheet/PageCharacterSheet.tsx",
            "./src/components/PageNewCharacter/PageNewCharacter.tsx",
          ],
          "feature-game": ["./src/components/PageGameSheet/PageGameSheet.tsx"],
          "feature-modals": [
            "./src/components/ModalContainer/ModalContainer.tsx",
            "./src/components/ModalAttack/ModalAttack.tsx",
            "./src/components/ModalCheatSheet/ModalCheatSheet.tsx",
          ],
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
