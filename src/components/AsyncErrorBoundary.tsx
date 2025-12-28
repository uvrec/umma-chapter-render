/**
 * AsyncErrorBoundary - Error Boundary для lazy-loaded компонентів та Suspense
 *
 * Обгортає компоненти, що завантажуються асинхронно,
 * та надає fallback UI при помилках завантаження.
 */

import { Suspense, ReactNode } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2, WifiOff } from 'lucide-react';
import { errorLogger } from '@/utils/errorLogger';

interface AsyncErrorFallbackProps extends FallbackProps {
  compact?: boolean;
}

function AsyncErrorFallback({ error, resetErrorBoundary, compact = false }: AsyncErrorFallbackProps) {
  const isNetworkError = error.message?.toLowerCase().includes('fetch') ||
    error.message?.toLowerCase().includes('network') ||
    error.message?.toLowerCase().includes('loading chunk');

  if (compact) {
    return (
      <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
        {isNetworkError ? (
          <WifiOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <span className="text-sm text-muted-foreground">Помилка завантаження</span>
        )}
        <Button onClick={resetErrorBoundary} variant="outline" size="sm" className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          Повторити
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      {isNetworkError ? (
        <>
          <WifiOff className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">Проблема з мережею</p>
            <p className="text-sm text-muted-foreground mt-1">
              Перевірте інтернет-з'єднання та спробуйте знову
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-lg bg-destructive/10 p-3">
            <p className="text-sm text-destructive">
              {error.message || 'Не вдалося завантажити компонент'}
            </p>
          </div>
        </>
      )}

      <Button onClick={resetErrorBoundary} variant="default" size="sm" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Спробувати знову
      </Button>
    </div>
  );
}

interface LoadingFallbackProps {
  compact?: boolean;
  message?: string;
}

function LoadingFallback({ compact = false, message = 'Завантаження...' }: LoadingFallbackProps) {
  if (compact) {
    return (
      <div className="flex items-center justify-center gap-2 p-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  /** Компактний режим для невеликих секцій */
  compact?: boolean;
  /** Кастомний fallback для Suspense */
  loadingFallback?: ReactNode;
  /** Повідомлення при завантаженні */
  loadingMessage?: string;
  /** Callback при reset */
  onReset?: () => void;
}

export function AsyncErrorBoundary({
  children,
  compact = false,
  loadingFallback,
  loadingMessage,
  onReset,
}: AsyncErrorBoundaryProps) {
  const handleError = (error: Error) => {
    errorLogger.log(error, { type: 'async_loading_error' });
  };

  return (
    <ErrorBoundary
      FallbackComponent={(props) => <AsyncErrorFallback {...props} compact={compact} />}
      onError={handleError}
      onReset={onReset}
    >
      <Suspense fallback={loadingFallback || <LoadingFallback compact={compact} message={loadingMessage} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Експортуємо також LoadingFallback для використання окремо
export { LoadingFallback };
