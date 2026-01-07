// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2017",
    emptyOutDir: true,
    minify: true,
    lib: {
      entry: "src/main.ts",
      formats: ["iife"],
      name: "ReactDataTableWC",
      fileName: () => "react-data-table.js",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
