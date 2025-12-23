/**
 * Хук для відстеження стану мережі
 */

import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

interface NetworkState {
  isOnline: boolean;
  effectiveType?: string; // 4g, 3g, 2g, slow-2g
}

export function useNetworkState(): NetworkState {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  const [effectiveType, setEffectiveType] = useState<string | undefined>(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      return (navigator as any).connection?.effectiveType;
    }
    return undefined;
  });

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    console.log('[Network] Online');
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    console.log('[Network] Offline');
  }, []);

  const handleConnectionChange = useCallback(() => {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      setEffectiveType(conn?.effectiveType);
      console.log('[Network] Connection changed:', conn?.effectiveType);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Network Information API (if available)
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      conn?.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        conn?.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [handleOnline, handleOffline, handleConnectionChange]);

  return {
    isOnline,
    effectiveType,
  };
}

/**
 * Хук який повертає true якщо зараз офлайн
 */
export function useIsOffline(): boolean {
  const { isOnline } = useNetworkState();
  return !isOnline;
}
