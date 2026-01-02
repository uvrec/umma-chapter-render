import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// Версія білда - ISO timestamp
const BUILD_TIME = new Date().toISOString();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    '__BUILD_TIME__': JSON.stringify(BUILD_TIME),
  },
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
        // registerType: 'prompt' — SW чекає дозволу користувача через PWAUpdatePrompt
        skipWaiting: false,
        clientsClaim: false,
        cleanupOutdatedCaches: true,

        // КРИТИЧНО: НЕ precache-имо js/css - вони мають хеші в іменах
        // Precache тільки статичні ресурси без хешів
        globPatterns: ['**/*.{ico,png,svg,woff2}'],

        // Виключаємо великі файли та assets з хешами
        globIgnores: ['**/assets/**', '**/node_modules/**'],

        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        navigateFallback: null,
        navigateFallbackDenylist: [/^\/api/, /^\/supabase/, /^\/functions/],

        runtimeCaching: [
          // 1. Документи (HTML) - мережа першою, кеш як fallback для офлайн
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache-v2',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 // 1 година
              },
              // Без networkTimeoutSeconds — чекаємо мережу без обмежень
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // 2. JS/CSS assets - StaleWhileRevalidate (показуємо кеш, оновлюємо в фоні)
          {
            urlPattern: /\/assets\/.*\.(js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache-v2',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 днів
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // 3. Зображення - CacheFirst (вони рідко змінюються)
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache-v2',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 днів
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // 4. Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
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
                maxAgeSeconds: 60 * 60 * 24 * 365
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
