/**
 * BuildVersionBadge - показує версію білда та кнопку примусового оновлення
 *
 * Для використання в адмін-панелі:
 * - Показує Build timestamp
 * - Кнопка "Hard Refresh" очищає всі кеші та перезавантажує
 */

import { useState } from 'react';
import { RefreshCw, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Версія білда з Vite define
declare const __BUILD_TIME__: string;
const BUILD_VERSION = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : 'dev';

export function BuildVersionBadge() {
  const [clearing, setClearing] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<string[]>([]);

  // Форматуємо дату для відображення
  const formatBuildTime = (isoString: string) => {
    if (isoString === 'dev') return 'dev';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString.slice(0, 16);
    }
  };

  // Отримати інформацію про кеші
  const loadCacheInfo = async () => {
    if ('caches' in window) {
      const names = await caches.keys();
      setCacheInfo(names);
    } else {
      setCacheInfo(['Caches API недоступний']);
    }
  };

  // Очистити всі кеші та перезавантажити
  const handleHardRefresh = async () => {
    setClearing(true);
    console.log('[HardRefresh] Починаємо очищення...');

    try {
      // 1. Очистити всі кеші
      if ('caches' in window) {
        const names = await caches.keys();
        console.log('[HardRefresh] Видаляємо кеші:', names);
        await Promise.all(names.map(name => caches.delete(name)));
      }

      // 2. Unregister всіх Service Workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log('[HardRefresh] Unregister SW:', registrations.length);
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      // 3. Очистити localStorage версії (щоб спрацювало оновлення)
      localStorage.removeItem('vv_build_version');

      // 4. Перезавантажити сторінку
      console.log('[HardRefresh] Перезавантаження...');
      window.location.reload();
    } catch (e) {
      console.error('[HardRefresh] Помилка:', e);
      setClearing(false);
    }
  };

  return (
    <Popover onOpenChange={(open) => open && loadCacheInfo()}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-md',
            'text-xs text-muted-foreground hover:text-foreground',
            'hover:bg-muted/50 transition-colors',
            'border border-transparent hover:border-border'
          )}
        >
          <Info className="h-3 w-3" />
          <span>Build: {formatBuildTime(BUILD_VERSION)}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-1">Інформація про білд</h4>
            <p className="text-xs text-muted-foreground font-mono break-all">
              {BUILD_VERSION}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-1">Service Worker кеші</h4>
            {cacheInfo.length === 0 ? (
              <p className="text-xs text-muted-foreground">Завантаження...</p>
            ) : (
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {cacheInfo.map((name, i) => (
                  <li key={i} className="font-mono truncate">• {name}</li>
                ))}
                {cacheInfo.length === 0 && <li>Немає кешів</li>}
              </ul>
            )}
          </div>

          <div className="pt-2 border-t">
            <Button
              onClick={handleHardRefresh}
              disabled={clearing}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              {clearing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Очищення...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hard Refresh (очистити всі кеші)
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Видаляє всі кеші, Service Workers і перезавантажує
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
