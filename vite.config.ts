import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// Версія білда - ISO timestamp (генерується один раз при старті білда)
const BUILD_VERSION = new Date().toISOString();

/**
 * Плагін для генерації version.json при білді
 * Цей файл можна fetch з cache: 'no-store' для перевірки версії на сервері
 */
function generateVersionJson(): Plugin {
  return {
    name: 'generate-version-json',
    writeBundle() {
      const versionData = {
        build: BUILD_VERSION,
        timestamp: Date.now()
      };
      const outDir = 'dist';
      const filePath = path.join(outDir, 'version.json');
      fs.writeFileSync(filePath, JSON.stringify(versionData, null, 2));
      console.log(`[version-json] Generated ${filePath} with build: ${BUILD_VERSION}`);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    '__BUILD_VERSION__': JSON.stringify(BUILD_VERSION),
    // Залишаємо __BUILD_TIME__ для сумісності (alias)
    '__BUILD_TIME__': JSON.stringify(BUILD_VERSION),
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Генеруємо version.json при продакшен-білді
    mode === 'production' && generateVersionJson(),
    // PWA тільки в production — в Lovable preview (dev mode) SW викликає проблеми з кешуванням
    mode === 'production' && VitePWA({
      registerType: 'autoUpdate', // Автоматичне оновлення без prompt
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
        // autoUpdate mode — SW оновлюється автоматично
        skipWaiting: true,
        clientsClaim: true,
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
          // ВИКЛЮЧЕННЯ: /admin/* — завжди без кешу (NetworkOnly)
          {
            urlPattern: ({ request, url }) => {
              // Admin routes — завжди свіжі, без кешування
              if (url.pathname.startsWith('/admin')) {
                return false;
              }
              return request.mode === 'navigate';
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache-v3',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 5 // 5 хвилин (замість 1 години)
              },
              // Без networkTimeoutSeconds — чекаємо мережу без обмежень
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // 1b. Admin routes — NetworkOnly (завжди свіжі)
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/admin'),
            handler: 'NetworkOnly',
          },
          // 2. JS/CSS assets - NetworkOnly (браузер кешує через Cache-Control: immutable)
          // НЕ кешуємо в SW, щоб уникнути "stale" ситуацій
          {
            urlPattern: /\/assets\/.*\.(js|css)$/i,
            handler: 'NetworkOnly',
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
      // Mock virtual:pwa-register/react in development (VitePWA is disabled)
      ...(mode !== 'production' && {
        'virtual:pwa-register/react': path.resolve(__dirname, './src/lib/pwa-register-stub.ts'),
      }),
    },
  },
  build: {
    rollupOptions: {
      output: {},
    },
    chunkSizeWarningLimit: 1000,
  },
}));
