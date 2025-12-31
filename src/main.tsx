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
      // Видаляємо старі кеші (без суфікса -v2)
      const oldCaches = cacheNames.filter(name =>
        (name.includes('pages-cache') && !name.includes('-v2')) ||
        (name.includes('assets-cache') && !name.includes('-v2')) ||
        (name.includes('images-cache') && !name.includes('-v2')) ||
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

// Примусове оновлення Service Worker
async function forceUpdateServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('[Vedavoice] Service Worker оновлено');
      }
    } catch (e) {
      console.warn('[Vedavoice] Помилка оновлення SW:', e);
    }
  }
}

// Запускаємо очищення при завантаженні
cleanupOldCaches();
forceUpdateServiceWorker();

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
