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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - великі бібліотеки
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }

            // Data fetching & state
            if (id.includes('@tanstack') || id.includes('react-query')) {
              return 'vendor-query';
            }

            // Supabase
            if (id.includes('@supabase') || id.includes('supabase')) {
              return 'vendor-supabase';
            }

            // PDF.js - найбільша бібліотека
            if (id.includes('pdfjs-dist')) {
              return 'vendor-pdf';
            }

            // Tiptap editor
            if (id.includes('@tiptap') || id.includes('prosemirror')) {
              return 'vendor-editor';
            }

            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }

            // Lucide icons
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }

            // Інші vendor бібліотеки
            return 'vendor-other';
          }

          // Admin panel - lazy load
          if (id.includes('/src/pages/admin/')) {
            return 'admin-pages';
          }

          // Audio context і player
          if (id.includes('/src/contexts/') && id.includes('Audio')) {
            return 'audio-features';
          }
        },
      },
    },
    // Збільшуємо ліміт для великих chunks (тимчасово)
    chunkSizeWarningLimit: 1000,
  },
}));
