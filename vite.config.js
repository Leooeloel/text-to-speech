import { defineConfig } from "vite";
import path from "path";
import pkg from "./package.json";

export default defineConfig(({ mode }) => ({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    sourcemap: mode === "production",
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
        exports: "named",
      },
    },
    minify: mode === "production",
  },
  clearScreen: false,
  server: {
    open: true,
  },
}));
