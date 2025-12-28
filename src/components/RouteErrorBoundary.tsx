/**
 * RouteErrorBoundary - Error Boundary для окремих маршрутів
 *
 * Використовується для ізоляції помилок на рівні сторінок,
 * щоб помилка на одній сторінці не руйнувала весь додаток.
 */

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { errorLogger } from '@/utils/errorLogger';

interface RouteErrorFallbackProps extends FallbackProps {
  routeName?: string;
}

function RouteErrorFallback({ error, resetErrorBoundary, routeName }: RouteErrorFallbackProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0" />
            <div>
              <CardTitle className="text-xl">
                Помилка на сторінці
                {routeName && <span className="text-muted-foreground"> ({routeName})</span>}
              </CardTitle>
              <CardDescription className="mt-1">
                Виникла помилка при завантаженні цієї частини додатку.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-3">
            <p className="font-mono text-sm text-muted-foreground break-all">
              {error.message || 'Невідома помилка'}
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Спробуйте:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Оновити сторінку</li>
              <li>Повернутися назад</li>
              <li>Перейти на головну</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2">
          <Button onClick={resetErrorBoundary} variant="default" size="sm" className="gap-1.5">
            <RefreshCw className="h-4 w-4" />
            Спробувати знову
          </Button>
          <Button onClick={handleGoBack} variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
          <Button onClick={handleGoHome} variant="ghost" size="sm" className="gap-1.5">
            <Home className="h-4 w-4" />
            На головну
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

interface RouteErrorBoundaryProps {
  children: ReactNode;
  routeName?: string;
  onReset?: () => void;
}

export function RouteErrorBoundary({ children, routeName, onReset }: RouteErrorBoundaryProps) {
  const handleError = (error: Error, info: { componentStack?: string | null }) => {
    errorLogger.logComponentError(error, info.componentStack ?? null, routeName);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={(props) => <RouteErrorFallback {...props} routeName={routeName} />}
      onError={handleError}
      onReset={handleReset}
    >
      {children}
    </ErrorBoundary>
  );
}
