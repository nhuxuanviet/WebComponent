// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2017",
    lib: {
      entry: "src/main.ts",
      formats: ["iife"],
      name: "ReactDataTableWC",
      fileName: () => "react-data-table.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },

  // 🔥 BẮT BUỘC: chặn process
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
