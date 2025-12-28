/**
 * ErrorDisplay - Універсальний компонент для відображення помилок
 *
 * Підтримує різні варіанти відображення:
 * - card: повноцінна карточка з деталями
 * - inline: компактний inline варіант
 * - banner: горизонтальний банер
 */

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, WifiOff, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ErrorVariant = 'card' | 'inline' | 'banner';

interface ErrorDisplayProps {
  /** Помилка або повідомлення */
  error: Error | string;
  /** Callback для повторної спроби */
  onRetry?: () => void;
  /** Варіант відображення */
  variant?: ErrorVariant;
  /** Заголовок (для card/banner) */
  title?: string;
  /** Чи показувати іконку */
  showIcon?: boolean;
  /** Кастомна іконка */
  icon?: ReactNode;
  /** Додаткові класи */
  className?: string;
  /** Текст кнопки retry */
  retryText?: string;
}

export function ErrorDisplay({
  error,
  onRetry,
  variant = 'card',
  title,
  showIcon = true,
  icon,
  className,
  retryText = 'Спробувати знову',
}: ErrorDisplayProps) {
  const message = typeof error === 'string' ? error : error.message;
  const isNetworkError = message.toLowerCase().includes('fetch') ||
    message.toLowerCase().includes('network') ||
    message.toLowerCase().includes('connection');

  const ErrorIcon = icon ? () => <>{icon}</> : isNetworkError ? WifiOff : AlertCircle;

  if (variant === 'inline') {
    return (
      <div className={cn(
        'flex items-center gap-2 text-sm text-destructive',
        className
      )}>
        {showIcon && <XCircle className="h-4 w-4 flex-shrink-0" />}
        <span className="flex-1 truncate">{message}</span>
        {onRetry && (
          <Button onClick={onRetry} variant="ghost" size="sm" className="h-7 px-2 gap-1">
            <RefreshCw className="h-3 w-3" />
            <span className="sr-only md:not-sr-only">{retryText}</span>
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <Alert variant="destructive" className={className}>
        {showIcon && <ErrorIcon className="h-4 w-4" />}
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription className="flex items-center justify-between gap-4">
          <span>{message}</span>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm" className="flex-shrink-0 gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              {retryText}
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Card variant (default)
  return (
    <Card className={cn('max-w-md', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {showIcon && (
            <div className="rounded-full bg-destructive/10 p-2">
              <ErrorIcon className="h-5 w-5 text-destructive" />
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-lg">
              {title || (isNetworkError ? "Проблема з з'єднанням" : 'Сталася помилка')}
            </CardTitle>
            <CardDescription className="mt-1">
              {isNetworkError
                ? 'Перевірте інтернет-з\'єднання та спробуйте знову.'
                : 'Виникла неочікувана помилка.'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="rounded-md bg-muted px-3 py-2">
          <p className="font-mono text-xs text-muted-foreground break-all">
            {message}
          </p>
        </div>
      </CardContent>

      {onRetry && (
        <CardFooter>
          <Button onClick={onRetry} variant="default" size="sm" className="w-full gap-2">
            <RefreshCw className="h-4 w-4" />
            {retryText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

/**
 * Компактна версія для списків та таблиць
 */
interface CompactErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function CompactError({ message = 'Помилка завантаження', onRetry, className }: CompactErrorProps) {
  return (
    <div className={cn(
      'flex items-center justify-center gap-3 p-4 text-sm text-muted-foreground',
      className
    )}>
      <XCircle className="h-4 w-4 text-destructive" />
      <span>{message}</span>
      {onRetry && (
        <Button onClick={onRetry} variant="ghost" size="sm" className="h-7 gap-1">
          <RefreshCw className="h-3 w-3" />
          Повторити
        </Button>
      )}
    </div>
  );
}
