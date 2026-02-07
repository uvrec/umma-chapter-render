/**
 * PWA Update Prompt Implementation
 * Цей файл імпортується тільки в production режимі
 *
 * Особливості:
 * - Перевіряє SW оновлення кожні 5 хвилин (з proper cleanup)
 * - Автоматично оновлює при виявленні нової версії
 * - Показує індикатор оновлення користувачу
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Інтервал перевірки SW оновлень - 5 хвилин
const SW_UPDATE_INTERVAL_MS = 5 * 60 * 1000;

export default function PWAUpdatePromptImpl() {
  const [updating, setUpdating] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const intervalRef = useRef<number | null>(null);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      registrationRef.current = registration || null;
    },
    onRegisterError(error) {
      console.error('[PWA] Помилка реєстрації SW:', error);
    },
    onNeedRefresh() {
      // Автоматичне оновлення без можливості відхилити
      setUpdating(true);
      // Невелика затримка, щоб показати індикатор користувачу
      setTimeout(() => {
        updateServiceWorker(true);
      }, 1500);
    },
    onOfflineReady() {
      // App is ready for offline use
    },
  });

  // Функція перевірки оновлень SW
  const checkForSWUpdate = useCallback(() => {
    if (registrationRef.current) {
      registrationRef.current.update().catch(() => {
        // Ignore update check errors
      });
    }
  }, []);

  // Встановлюємо інтервал перевірки з proper cleanup
  useEffect(() => {
    // Перевіряємо тільки коли вкладка активна
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Вкладка прихована - зупиняємо інтервал
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Вкладка активна - перевіряємо і запускаємо інтервал
        checkForSWUpdate();
        if (!intervalRef.current) {
          intervalRef.current = window.setInterval(checkForSWUpdate, SW_UPDATE_INTERVAL_MS);
        }
      }
    };

    // Запускаємо інтервал якщо вкладка активна
    if (!document.hidden) {
      intervalRef.current = window.setInterval(checkForSWUpdate, SW_UPDATE_INTERVAL_MS);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup при unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [checkForSWUpdate]);

  // Якщо needRefresh спрацював раніше, ніж onNeedRefresh callback
  useEffect(() => {
    if (needRefresh && !updating) {
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
        'bg-primary text-primary-foreground',
        'animate-in slide-in-from-bottom-4 duration-300',
        'max-w-[calc(100vw-2rem)] sm:max-w-md'
      )}
    >
      <RefreshCw className="h-5 w-5 flex-shrink-0 animate-spin" />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">Оновлення...</p>
        <p className="text-xs opacity-80 truncate">
          Сторінка перезавантажиться автоматично
        </p>
      </div>
    </div>
  );
}
