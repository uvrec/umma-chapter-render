/**
 * PWA Update Prompt - показує повідомлення коли доступна нова версія сайту
 *
 * Працює з registerType: 'prompt' в vite-plugin-pwa
 * Дає користувачу контроль над оновленням замість "тихого" autoUpdate
 */

import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
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
      console.log('[PWA] Доступна нова версія!');
      setShowPrompt(true);
    },
    onOfflineReady() {
      console.log('[PWA] Додаток готовий для офлайн використання');
    },
  });

  // Показуємо prompt коли є оновлення
  useEffect(() => {
    if (needRefresh) {
      setShowPrompt(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    // Оновлюємо Service Worker і перезавантажуємо сторінку
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setNeedRefresh(false);
  };

  if (!showPrompt) return null;

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
      <Download className="h-5 w-5 flex-shrink-0 animate-bounce" />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">Доступна нова версія!</p>
        <p className="text-xs text-white/80 truncate">
          Оновіть для найкращого досвіду
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          onClick={handleUpdate}
          size="sm"
          variant="secondary"
          className="bg-white text-amber-700 hover:bg-white/90 font-medium"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Оновити
        </Button>

        <button
          onClick={handleDismiss}
          className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Закрити"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
