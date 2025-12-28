/**
 * Індикатор офлайн-режиму з підтримкою retry queue
 */

import { WifiOff, Download, RefreshCw, Loader2 } from 'lucide-react';
import { useIsOffline } from '@/hooks/useNetworkState';
import { useOfflineAwareApi } from '@/hooks/useOfflineAwareApi';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const isOffline = useIsOffline();
  const { queueLength, processQueue } = useOfflineAwareApi();

  // Нічого не показуємо якщо онлайн і черга пуста
  if (!isOffline && queueLength === 0) return null;

  // Показуємо офлайн індикатор
  if (isOffline) {
    return (
      <div
        className={cn(
          'fixed top-16 left-1/2 -translate-x-1/2 z-50',
          'flex items-center gap-2 px-4 py-2 rounded-full',
          'bg-amber-500/90 text-white text-sm font-medium',
          'shadow-lg animate-in slide-in-from-top-2 duration-300',
          className
        )}
      >
        <WifiOff className="h-4 w-4" />
        <span>Офлайн режим</span>
        {queueLength > 0 && (
          <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
            {queueLength}
          </span>
        )}
      </div>
    );
  }

  // Показуємо індикатор синхронізації черги (онлайн, але є запити в черзі)
  return (
    <button
      onClick={() => processQueue()}
      className={cn(
        'fixed top-16 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-2 px-4 py-2 rounded-full',
        'bg-blue-500/90 text-white text-sm font-medium',
        'shadow-lg animate-in slide-in-from-top-2 duration-300',
        'hover:bg-blue-600/90 transition-colors cursor-pointer',
        className
      )}
    >
      <RefreshCw className="h-4 w-4 animate-spin" />
      <span>Синхронізація ({queueLength})</span>
    </button>
  );
}

interface CachedBadgeProps {
  isCached: boolean;
  className?: string;
}

export function CachedBadge({ isCached, className }: CachedBadgeProps) {
  if (!isCached) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-full',
        'bg-green-500/20 text-green-600 dark:text-green-400 text-xs',
        className
      )}
    >
      <Download className="h-3 w-3" />
      <span>Доступно офлайн</span>
    </div>
  );
}
