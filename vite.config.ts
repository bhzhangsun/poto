import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target: ["es2021", "chrome100", "safari13"],
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
    rollupOptions: {
      input: {
        home: resolve(__dirname, "src/pages/home/index.html"),
        egg: resolve(__dirname, "src/pages/egg/index.html"),
        setting: resolve(__dirname, "src/pages/settings/index.html"),
      },
      external: ["@babel/runtime/helpers/esm/objectSpread2"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@core": path.resolve("src/core"),
      "@pages": path.resolve("src/pages"),
      "@hooks": path.resolve("src/hooks"),
    },
  },
});
