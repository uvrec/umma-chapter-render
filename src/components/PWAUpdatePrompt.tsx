/**
 * PWA Update Prompt - автоматичне оновлення при новій версії
 *
 * Працює з registerType: 'autoUpdate' в vite-plugin-pwa
 * При виявленні нової версії — автоматично перезавантажує сторінку
 * (без кнопки "Закрити", щоб гарантувати свіжий код)
 */

import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PWAUpdatePrompt() {
  const [updating, setUpdating] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('[PWA] Service Worker зареєстровано:', registration);

      // Перевіряємо оновлення кожні 60 секунд
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('[PWA] Помилка реєстрації SW:', error);
    },
    onNeedRefresh() {
      console.log('[PWA] Доступна нова версія! Автоматичне оновлення...');
      // Автоматичне оновлення без можливості відхилити
      setUpdating(true);
      // Невелика затримка, щоб показати індикатор користувачу
      setTimeout(() => {
        updateServiceWorker(true);
      }, 1500);
    },
    onOfflineReady() {
      console.log('[PWA] Додаток готовий для офлайн використання');
    },
  });

  // Якщо needRefresh спрацював раніше, ніж onNeedRefresh callback
  useEffect(() => {
    if (needRefresh && !updating) {
      console.log('[PWA] needRefresh виявлено, оновлюємо...');
      setUpdating(true);
      setTimeout(() => {
        updateServiceWorker(true);
      }, 1500);
    }
  }, [needRefresh, updating, updateServiceWorker]);

  if (!updating) return null;

  return (
    <div
      className={cn(
        'fixed bottom-20 left-1/2 -translate-x-1/2 z-[100]',
        'flex items-center gap-3 px-4 py-3 rounded-xl',
        'bg-gradient-to-r from-amber-600 to-orange-600',
        'text-white shadow-2xl',
        'animate-in slide-in-from-bottom-4 duration-300',
        'max-w-[calc(100vw-2rem)] sm:max-w-md'
      )}
    >
      <RefreshCw className="h-5 w-5 flex-shrink-0 animate-spin" />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">Оновлення...</p>
        <p className="text-xs text-white/80 truncate">
          Сторінка перезавантажиться автоматично
        </p>
      </div>
    </div>
  );
}
