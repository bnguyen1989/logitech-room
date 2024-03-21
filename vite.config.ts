import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/index.js`, // Фиксирует имя выходного файла для точек входа
        chunkFileNames: `assets/[name].js`, // Управляет именованием неразрезанных частей
        assetFileNames: `assets/[name].[ext]`, // Управляет именованием остальных ресурсов (CSS, картинки и т.д.)
      },
    },
  },
  define: {
    global: "globalThis",
  },
});
