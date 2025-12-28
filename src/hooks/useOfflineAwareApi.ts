/**
 * useOfflineAwareApi - Hook для API запитів з підтримкою офлайн режиму
 *
 * Функціонал:
 * - Автоматичне визначення офлайн режиму
 * - Додавання невдалих запитів до retry queue
 * - Налаштовувана поведінка при офлайні
 */

import { useCallback, useSyncExternalStore } from 'react';
import { apiRetryQueue, QueuedRequest } from '@/services/apiRetryQueue';
import { useIsOffline } from '@/hooks/useNetworkState';
import { toast } from 'sonner';

/** Помилка офлайн режиму */
export class OfflineError extends Error {
  constructor(message = 'No internet connection') {
    super(message);
    this.name = 'OfflineError';
  }
}

interface FetchWithRetryOptions extends Omit<RequestInit, 'priority'> {
  /** Додати в чергу якщо офлайн (default: false) */
  queueIfOffline?: boolean;
  /** Пріоритет запиту в черзі */
  priority?: 'high' | 'normal' | 'low';
  /** Максимальна кількість спроб */
  maxRetries?: number;
  /** Показати toast при додаванні в чергу */
  showQueuedToast?: boolean;
}

interface UseOfflineAwareApiReturn {
  /** Fetch з підтримкою retry queue */
  fetchWithRetry: (url: string, options?: FetchWithRetryOptions) => Promise<Response>;
  /** Чи зараз офлайн */
  isOffline: boolean;
  /** Кількість запитів в черзі */
  queueLength: number;
  /** Обробити чергу вручну */
  processQueue: () => Promise<void>;
  /** Очистити чергу */
  clearQueue: () => void;
}

/**
 * Hook для підписки на довжину черги
 */
function useQueueLength(): number {
  return useSyncExternalStore(
    (callback) => apiRetryQueue.subscribe(() => callback()),
    () => apiRetryQueue.length,
    () => 0 // Server snapshot
  );
}

export function useOfflineAwareApi(): UseOfflineAwareApiReturn {
  const isOffline = useIsOffline();
  const queueLength = useQueueLength();

  const fetchWithRetry = useCallback(async (
    url: string,
    options: FetchWithRetryOptions = {}
  ): Promise<Response> => {
    const {
      queueIfOffline = false,
      priority = 'normal',
      maxRetries = 3,
      showQueuedToast = true,
      ...fetchOptions
    } = options;

    // Якщо офлайн і дозволено чергування
    if (!navigator.onLine && queueIfOffline) {
      const body = fetchOptions.body;
      apiRetryQueue.add({
        url,
        method: fetchOptions.method || 'GET',
        body: typeof body === 'string' ? body : undefined,
        headers: fetchOptions.headers as Record<string, string> | undefined,
        priority,
        maxRetries,
      });

      if (showQueuedToast) {
        toast.info('Запит збережено для відправки коли буде мережа');
      }

      throw new OfflineError('Request queued for later execution');
    }

    try {
      const response = await fetch(url, fetchOptions);
      return response;
    } catch (error) {
      // Перевірити чи це мережева помилка
      const isNetworkError =
        error instanceof TypeError &&
        (error.message.includes('fetch') ||
          error.message.includes('network') ||
          error.message.includes('Failed to fetch'));

      if (isNetworkError && queueIfOffline) {
        const body = fetchOptions.body;
        apiRetryQueue.add({
          url,
          method: fetchOptions.method || 'GET',
          body: typeof body === 'string' ? body : undefined,
          headers: fetchOptions.headers as Record<string, string> | undefined,
          priority,
          maxRetries,
        });

        if (showQueuedToast) {
          toast.info('Помилка мережі. Запит буде повторено автоматично.');
        }

        throw new OfflineError('Request queued due to network error');
      }

      throw error;
    }
  }, []);

  const processQueue = useCallback(async () => {
    await apiRetryQueue.processQueue();
  }, []);

  const clearQueue = useCallback(() => {
    apiRetryQueue.clear();
  }, []);

  return {
    fetchWithRetry,
    isOffline,
    queueLength,
    processQueue,
    clearQueue,
  };
}

/**
 * Hook для отримання черги запитів
 */
export function useRetryQueue(): readonly QueuedRequest[] {
  return useSyncExternalStore(
    (callback) => apiRetryQueue.subscribe(() => callback()),
    () => apiRetryQueue.getAll(),
    () => [] // Server snapshot
  );
}
