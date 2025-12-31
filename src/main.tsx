import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import { initErrorTracking, errorLogger } from './utils/errorLogger'

// Версія білда для діагностики кешування
const BUILD_VERSION = '__BUILD_TIME__';
const BUILD_VERSION_LS_KEY = 'vv_build_version';

console.log('[Vedavoice] Build:', BUILD_VERSION);
console.log('[Vedavoice] SW controller:', navigator.serviceWorker?.controller ? 'active' : 'none');

// ============================================================
// KILL-SWITCH: Якщо версія білда змінилась - очищаємо ВСЕ
// ============================================================
async function checkBuildVersionAndCleanup(): Promise<boolean> {
  try {
    const storedVersion = localStorage.getItem(BUILD_VERSION_LS_KEY);

    // Якщо версія змінилась (або це перший запуск)
    if (storedVersion && storedVersion !== BUILD_VERSION) {
      console.log('[Vedavoice] 🔄 Виявлено нову версію білда!');
      console.log('[Vedavoice] Стара:', storedVersion);
      console.log('[Vedavoice] Нова:', BUILD_VERSION);

      // 1. Очищаємо ВСІ кеші (не тільки старі)
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log('[Vedavoice] Видаляємо всі кеші:', cacheNames);
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // 2. Видаляємо всі Service Workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log('[Vedavoice] Видаляємо SW реєстрації:', registrations.length);
        await Promise.all(registrations.map(r => r.unregister()));
      }

      // 3. Зберігаємо нову версію
      localStorage.setItem(BUILD_VERSION_LS_KEY, BUILD_VERSION);

      // 4. Перезавантажуємо сторінку
      console.log('[Vedavoice] Перезавантаження для застосування нової версії...');
      window.location.reload();
      return true; // Сигналізуємо що буде reload
    }

    // Зберігаємо версію якщо це перший запуск
    if (!storedVersion) {
      localStorage.setItem(BUILD_VERSION_LS_KEY, BUILD_VERSION);
      console.log('[Vedavoice] Збережено версію білда (перший запуск)');
    }
  } catch (e) {
    console.warn('[Vedavoice] Помилка перевірки версії:', e);
  }

  return false;
}

// Примусове очищення старих кешів Service Worker (для сумісності)
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

// ============================================================
// Запуск при завантаженні
// ============================================================
(async () => {
  // Спочатку перевіряємо версію - якщо змінилась, буде reload
  const willReload = await checkBuildVersionAndCleanup();
  if (willReload) return; // Не продовжуємо якщо буде reload

  // Інакше - звичайне очищення старих кешів
  cleanupOldCaches();
  forceUpdateServiceWorker();
})();

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
