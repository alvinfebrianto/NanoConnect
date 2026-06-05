import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("react-dom") || id.includes("react/")) return "vendor-react";
            if (id.includes("react-router") || id.includes("remix-run")) return "vendor-router";
            if (id.includes("tanstack")) return "vendor-query";
            if (id.includes("lucide-react") || id.includes("phosphor")) return "vendor-icons";
            if (id.includes("supabase")) return "vendor-supabase";
            return "vendor-other";
          }
        },
      },
    },
  },
  test: {
    environment: "jsdom",
  },
});
