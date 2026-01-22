import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import { initErrorTracking, errorLogger } from './utils/errorLogger'

// Версія білда для діагностики кешування
// __BUILD_VERSION__ інжектується Vite через define у vite.config.ts
declare const __BUILD_VERSION__: string;
const BUILD_VERSION = typeof __BUILD_VERSION__ !== 'undefined' ? __BUILD_VERSION__ : 'dev';

// Storage keys
const VERSION_KEY = 'vv_build_version';
const LAST_RELOAD_KEY = 'vv_last_reload_time';
const SERVER_VERSION_KEY = 'vv_server_version';
const RELOAD_COOLDOWN_MS = 5 * 60 * 1000; // 5 хвилин між автоматичними reload-ами
const VERSION_CHECK_INTERVAL_MS = 5 * 60 * 1000; // Перевірка версії кожні 5 хвилин

const storedVersion = localStorage.getItem(VERSION_KEY);
const lastReloadTime = parseInt(localStorage.getItem(LAST_RELOAD_KEY) || '0', 10);
const timeSinceLastReload = Date.now() - lastReloadTime;

console.log('[Vedavoice] Build:', BUILD_VERSION);
console.log('[Vedavoice] Збережена версія:', storedVersion || 'немає');
console.log('[Vedavoice] Час з останнього reload:', Math.round(timeSinceLastReload / 1000), 'сек');

/**
 * Безпечний reload з захистом від reload-loop
 * Не дозволяє робити reload частіше ніж раз на 5 хвилин
 */
function safeReload(reason: string): boolean {
  const now = Date.now();
  const lastReload = parseInt(localStorage.getItem(LAST_RELOAD_KEY) || '0', 10);

  if (now - lastReload < RELOAD_COOLDOWN_MS) {
    console.warn(`[Vedavoice] Reload заблоковано (cooldown). Причина: ${reason}. Останній reload: ${Math.round((now - lastReload) / 1000)}сек тому`);
    return false;
  }

  console.log(`[Vedavoice] Виконуємо reload. Причина: ${reason}`);
  localStorage.setItem(LAST_RELOAD_KEY, now.toString());
  location.reload();
  return true;
}

// Перевірка версії та примусове оновлення при зміні білда
if (storedVersion && storedVersion !== BUILD_VERSION) {
  console.log('[Vedavoice] Нова версія виявлена! Очищаємо кеші...');
  console.log('[Vedavoice] Стара версія:', storedVersion);
  console.log('[Vedavoice] Нова версія:', BUILD_VERSION);

  // Нова версія - очистити всі кеші
  if ('caches' in window) {
    caches.keys().then(names => {
      console.log('[Vedavoice] Знайдено кешів:', names.length);
      names.forEach(name => {
        console.log('[Vedavoice] Видаляємо кеш:', name);
        caches.delete(name);
      });
    });
  }
  // Unregister всіх service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log('[Vedavoice] Знайдено SW реєстрацій:', registrations.length);
      registrations.forEach(reg => {
        console.log('[Vedavoice] Unregister SW:', reg.scope);
        reg.unregister();
      });
    });
  }
}
// Зберігаємо поточну версію
localStorage.setItem(VERSION_KEY, BUILD_VERSION);

/**
 * Перевірка чи це preview/dev середовище
 * Preview не має version.json і не повинен використовувати version mismatch reload
 */
function isPreviewEnvironment(): boolean {
  const hostname = location.hostname;
  return (
    hostname.includes('lovable.app') ||
    hostname.includes('lovableproject.com') ||
    hostname.includes('lovable.dev') ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    !import.meta.env.PROD
  );
}

/**
 * Перевірка версії на сервері через version.json
 * Fetch з cache: 'no-store' гарантує свіжі дані з сервера
 *
 * ВАЖЛИВО: В preview середовищі ця функція тільки логує, не робить reload
 * бо version.json може не існувати або повертати HTML
 */
async function checkServerVersion(): Promise<void> {
  // Не перевіряємо в dev режимі
  if (BUILD_VERSION === 'dev') return;

  const isPreview = isPreviewEnvironment();

  if (isPreview) {
    console.log('[Vedavoice] Preview environment detected, skipping version mismatch reload');
    return;
  }

  try {
    const response = await fetch('/version.json', {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (!response.ok) {
      console.warn('[Vedavoice] version.json не знайдено:', response.status);
      return;
    }

    // Перевіряємо що відповідь - це JSON, а не HTML
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('[Vedavoice] version.json має неправильний content-type:', contentType);
      return;
    }

    const data = await response.json();
    const serverVersion = data.build;

    console.log('[Vedavoice] Версія на сервері:', serverVersion);
    console.log('[Vedavoice] Поточна версія:', BUILD_VERSION);

    // Зберігаємо серверну версію для діагностики
    localStorage.setItem(SERVER_VERSION_KEY, serverVersion);

    // Якщо версії різні - потрібне оновлення
    if (serverVersion && serverVersion !== BUILD_VERSION) {
      console.log('[Vedavoice] Версії не збігаються! Потрібне оновлення.');

      // Очищаємо кеші перед reload
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map(name => caches.delete(name)));
        console.log('[Vedavoice] Кеші очищено');
      }

      // Unregister SW
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
        console.log('[Vedavoice] SW відписано');
      }

      // Безпечний reload з захистом від loop
      safeReload('server version mismatch');
    }
  } catch (error) {
    console.warn('[Vedavoice] Помилка перевірки версії:', error);
  }
}

// Перевіряємо версію на сервері при завантаженні
checkServerVersion();

// Періодична перевірка версії (кожні 5 хвилин)
let versionCheckInterval: number | null = null;

function startVersionCheck(): void {
  if (versionCheckInterval) return;

  versionCheckInterval = window.setInterval(() => {
    console.log('[Vedavoice] Періодична перевірка версії...');
    checkServerVersion();
  }, VERSION_CHECK_INTERVAL_MS);
}

// Запускаємо періодичну перевірку тільки якщо вкладка активна
if (!document.hidden) {
  startVersionCheck();
}

// Перевіряємо версію коли користувач повертається на вкладку
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Вкладка прихована - зупиняємо перевірку
    if (versionCheckInterval) {
      clearInterval(versionCheckInterval);
      versionCheckInterval = null;
    }
  } else {
    // Вкладка знову активна - перевіряємо версію
    console.log('[Vedavoice] Вкладка активна, перевіряємо версію...');
    checkServerVersion();
    startVersionCheck();
  }
});

// Експортуємо для діагностики
(window as any).__VEDAVOICE_BUILD__ = {
  version: BUILD_VERSION,
  getServerVersion: () => localStorage.getItem(SERVER_VERSION_KEY),
  getStoredVersion: () => localStorage.getItem(VERSION_KEY),
  getLastReload: () => new Date(parseInt(localStorage.getItem(LAST_RELOAD_KEY) || '0', 10)).toISOString(),
  checkNow: checkServerVersion,
  forceReload: () => safeReload('manual'),
};

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

// Preview-only auto cleanup for Lovable preview environment
// Це прибирає старі service workers та кеші, щоб preview завжди показував актуальний код
async function previewForceCleanup() {
  const isPreview = isPreviewEnvironment();

  if (!isPreview) return;

  console.log('[Vedavoice] Preview mode detected, running force cleanup...');

  // Очищаємо version-related localStorage щоб уникнути неконсистентності
  // Це запобігає ситуації коли preview намагається порівняти версії
  try {
    localStorage.removeItem(VERSION_KEY);
    localStorage.removeItem(SERVER_VERSION_KEY);
    localStorage.removeItem(LAST_RELOAD_KEY);
    console.log('[Vedavoice] Preview: cleared version localStorage keys');
  } catch (e) {
    console.warn('[Vedavoice] Preview: localStorage cleanup error:', e);
  }

  // Unregister all service workers
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(`[Vedavoice] Found ${registrations.length} SW registrations`);
      for (const reg of registrations) {
        console.log('[Vedavoice] Unregistering SW:', reg.scope);
        await reg.unregister();
      }
      console.log(`[Vedavoice] SW registrations after cleanup: 0`);
    } catch (e) {
      console.warn('[Vedavoice] SW cleanup error:', e);
    }
  }

  // Clear ALL caches in preview - не тільки специфічні
  // Це гарантує що preview не використовує ніяких застарілих ресурсів
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      console.log('[Vedavoice] Cache keys before cleanup:', cacheNames);

      // В preview видаляємо ВСІ кеші для гарантії свіжості
      for (const name of cacheNames) {
        console.log('[Vedavoice] Deleting cache:', name);
        await caches.delete(name);
      }

      const remainingCaches = await caches.keys();
      console.log('[Vedavoice] Cache keys after cleanup:', remainingCaches);
    } catch (e) {
      console.warn('[Vedavoice] Cache cleanup error:', e);
    }
  }
}

// Run preview cleanup
previewForceCleanup();

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
