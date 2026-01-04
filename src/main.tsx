import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import { initErrorTracking, errorLogger } from './utils/errorLogger'

// Версія білда для діагностики кешування
const BUILD_VERSION = '__BUILD_TIME__';
console.log('[Vedavoice] Build:', BUILD_VERSION);

// Примусове очищення старих кешів Service Worker
async function cleanupOldCaches() {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      // Видаляємо всі старі кеші, які не є поточними версіями
      // Поточні версії: pages-cache-v2, assets-cache-v3, images-cache-v2
      const oldCaches = cacheNames.filter(name =>
        (name.includes('pages-cache') && name !== 'pages-cache-v2') ||
        (name.includes('assets-cache') && name !== 'assets-cache-v3') ||
        (name.includes('images-cache') && name !== 'images-cache-v2') ||
        name.includes('workbox-precache') // Старий precache
      );

      if (oldCaches.length > 0) {
        console.log('[Vedavoice] Очищення старих кешів:', oldCaches);
        await Promise.all(oldCaches.map(name => caches.delete(name)));
      }
    } catch (e) {
      console.warn('[Vedavoice] Помилка очищення кешів:', e);
    }
  }
}

// Запускаємо очищення старих кешів при завантаженні
// (оновлення SW обробляється через PWAUpdatePrompt)
cleanupOldCaches();

// Ініціалізація error tracking (Sentry в production якщо налаштовано)
initErrorTracking();

// Global error handlers to prevent blank pages
window.addEventListener('error', (event) => {
  errorLogger.logGlobalError(
    event.message,
    event.filename,
    event.lineno,
    event.colno
  );
});

window.addEventListener('unhandledrejection', (event) => {
  errorLogger.logUnhandledRejection(event.reason);
  event.preventDefault(); // Prevent default browser behavior
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
