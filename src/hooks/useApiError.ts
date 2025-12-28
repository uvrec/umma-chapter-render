/**
 * useApiError - Hook для обробки API помилок
 *
 * Забезпечує:
 * - Консистентну обробку різних типів помилок
 * - Автоматичні toast повідомлення
 * - Логування помилок
 */

import { useCallback } from 'react';
import { toast } from 'sonner';
import { errorLogger } from '@/utils/errorLogger';

interface ApiErrorOptions {
  /** Контекст помилки для логування */
  context?: string;
  /** Показувати toast (default: true) */
  showToast?: boolean;
  /** Кастомне повідомлення для помилки */
  customMessage?: string;
  /** Severity для логування */
  severity?: 'info' | 'warn' | 'error' | 'critical';
}

interface UseApiErrorReturn {
  /** Обробляє помилку з автоматичним toast та логуванням */
  handleError: (error: unknown, options?: ApiErrorOptions) => void;
  /** Обробляє помилку без toast (тільки логування) */
  handleSilentError: (error: unknown, context?: string) => void;
  /** Перевіряє чи помилка є мережевою */
  isNetworkError: (error: unknown) => boolean;
  /** Перевіряє чи помилка є авторизаційною */
  isAuthError: (error: unknown) => boolean;
}

export function useApiError(): UseApiErrorReturn {
  const getErrorMessage = useCallback((error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (typeof error === 'object' && error !== null) {
      // Supabase/PostgrestError style
      if ('message' in error) {
        return String((error as { message: unknown }).message);
      }
      // API response error
      if ('error' in error) {
        return String((error as { error: unknown }).error);
      }
    }
    return 'Невідома помилка';
  }, []);

  const isNetworkError = useCallback((error: unknown): boolean => {
    const message = getErrorMessage(error).toLowerCase();
    return (
      message.includes('fetch') ||
      message.includes('network') ||
      message.includes('connection') ||
      message.includes('timeout') ||
      message.includes('econnrefused') ||
      message.includes('failed to fetch')
    );
  }, [getErrorMessage]);

  const isAuthError = useCallback((error: unknown): boolean => {
    const message = getErrorMessage(error).toLowerCase();
    return (
      message.includes('401') ||
      message.includes('unauthorized') ||
      message.includes('jwt') ||
      message.includes('token') ||
      message.includes('session') ||
      message.includes('auth')
    );
  }, [getErrorMessage]);

  const handleError = useCallback((error: unknown, options: ApiErrorOptions = {}): void => {
    const {
      context,
      showToast = true,
      customMessage,
      severity = 'error',
    } = options;

    const message = getErrorMessage(error);

    // Логуємо помилку
    errorLogger.log(error, { context, type: 'api_error' }, severity);

    // Показуємо toast якщо потрібно
    if (showToast) {
      let toastMessage = customMessage;

      if (!toastMessage) {
        if (isNetworkError(error)) {
          toastMessage = "Помилка з'єднання. Перевірте інтернет.";
        } else if (isAuthError(error)) {
          toastMessage = 'Сесія закінчилась. Увійдіть знову.';
        } else if (message.includes('404') || message.includes('not found')) {
          toastMessage = 'Ресурс не знайдено.';
        } else if (message.includes('500') || message.includes('server')) {
          toastMessage = 'Помилка сервера. Спробуйте пізніше.';
        } else {
          toastMessage = context ? `Помилка: ${context}` : message;
        }
      }

      toast.error(toastMessage);
    }
  }, [getErrorMessage, isNetworkError, isAuthError]);

  const handleSilentError = useCallback((error: unknown, context?: string): void => {
    errorLogger.logSilent(error, context);
  }, []);

  return {
    handleError,
    handleSilentError,
    isNetworkError,
    isAuthError,
  };
}
