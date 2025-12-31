import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'prompt', // Дає контроль користувачу над оновленням
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'Vedavoice — Прабгупада Солов\'їною',
        short_name: 'Vedavoice',
        description: 'Читай і слухай ведичні тексти українською. Бхагавад-Гіта, Шрімад-Бхагаватам з коментарями Шріли Прабгупади.',
        theme_color: '#d97706',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '.',
        lang: 'uk',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        categories: ['education', 'books', 'lifestyle'],
        shortcuts: [
          {
            name: 'Бібліотека',
            short_name: 'Бібліотека',
            url: '/library',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Аудіо',
            short_name: 'Аудіо',
            url: '/audio',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        skipWaiting: false, // Не пропускаємо waiting - даємо користувачу контроль
        clientsClaim: true,
        cleanupOutdatedCaches: true, // Автоматично видаляє старі кеші
        globPatterns: ['**/*.{js,css,ico,png,svg,woff2}'], // БЕЗ html - не кешуємо index.html в precache!
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15 MB
        navigateFallback: null, // Вимикаємо - нехай документи йдуть через runtimeCaching
        navigateFallbackDenylist: [/^\/api/, /^\/supabase/, /^\/functions/],
        runtimeCaching: [
          // КРИТИЧНО: Документи (HTML) - завжди спочатку мережа!
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 день
              },
              networkTimeoutSeconds: 3, // Якщо мережа не відповіла за 3 сек - fallback на кеш
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {},
    },
    chunkSizeWarningLimit: 1000,
  },
}));
