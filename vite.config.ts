import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Simplify chunking to avoid cyclic init order issues in production bundles
    rollupOptions: {
      output: {
        // Let Vite/Rollup decide optimal chunking to prevent "lexical declaration before initialization"
      },
    },
    // Keep a higher warning limit but avoid over-splitting
    chunkSizeWarningLimit: 1000,
  },
}));
