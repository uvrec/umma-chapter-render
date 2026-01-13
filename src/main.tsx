import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import { initErrorTracking, errorLogger } from './utils/errorLogger'

// Версія білда для діагностики кешування
// __BUILD_TIME__ інжектується Vite через define у vite.config.ts
declare const __BUILD_TIME__: string;
const BUILD_VERSION = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : 'dev';
console.log('[Vedavoice] Build:', BUILD_VERSION);

// Перевірка версії та примусове оновлення
const VERSION_KEY = 'vv_build_version';
const storedVersion = localStorage.getItem(VERSION_KEY);

if (storedVersion && storedVersion !== BUILD_VERSION) {
  console.log('[Vedavoice] Нова версія виявлена! Очищаємо кеші...');
  // Нова версія - очистити всі кеші
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        console.log('[Vedavoice] Видаляємо кеш:', name);
        caches.delete(name);
      });
    });
  }
  // Unregister всіх service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(reg => {
        console.log('[Vedavoice] Unregister SW:', reg.scope);
        reg.unregister();
      });
    });
  }
}
// Зберігаємо поточну версію
localStorage.setItem(VERSION_KEY, BUILD_VERSION);

// Примусове очищення старих кешів Service Worker
async function cleanupOldCaches() {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      // Видаляємо старі кеші (v1, v2 для pages — поточна v3)
      // Видаляємо ВСІ assets-cache (тепер NetworkOnly)
      const oldCaches = cacheNames.filter(name =>
        (name.includes('pages-cache') && !name.includes('-v3')) ||
        name.includes('assets-cache') || // Видаляємо всі assets кеші — тепер NetworkOnly
        (name.includes('images-cache') && !name.includes('-v2')) ||
        name.includes('workbox-precache')
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
