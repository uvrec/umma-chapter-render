/**
 * Індикатор офлайн-режиму
 */

import { WifiOff, Download } from 'lucide-react';
import { useIsOffline } from '@/hooks/useNetworkState';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const isOffline = useIsOffline();

  if (!isOffline) return null;

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
    </div>
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
