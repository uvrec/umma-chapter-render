/**
 * Централізована утиліта для логування помилок
 *
 * Забезпечує:
 * - Консистентне логування в development
 * - Можливість розширення для production (Sentry, LogRocket, etc.)
 * - Контекстну інформацію для дебагу
 */

export type ErrorSeverity = 'info' | 'warn' | 'error' | 'critical';

interface ErrorLogEntry {
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  timestamp: Date;
  severity: ErrorSeverity;
  componentName?: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = import.meta.env.DEV;
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * Логує помилку з повним контекстом
   */
  log(
    error: Error | unknown,
    context?: Record<string, unknown>,
    severity: ErrorSeverity = 'error'
  ): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));

    const entry: ErrorLogEntry = {
      message: errorObj.message,
      stack: errorObj.stack,
      context,
      timestamp: new Date(),
      severity,
    };

    // Development: завжди виводимо в консоль
    if (this.isDevelopment) {
      this.logToConsole(entry);
    }

    // Production: можна додати відправку на сервер
    // this.sendToRemote(entry);
  }

  /**
   * Логує помилку без показу тосту (для localStorage, minor errors)
   */
  logSilent(error: unknown, context?: string): void {
    if (this.isDevelopment) {
      console.debug(`[Silent Error] ${context || 'Unknown context'}:`, error);
    }
  }

  /**
   * Логує помилку API
   */
  logApiError(
    error: unknown,
    endpoint: string,
    method: string = 'GET',
    additionalContext?: Record<string, unknown>
  ): void {
    this.log(error, {
      type: 'api_error',
      endpoint,
      method,
      ...additionalContext,
    });
  }

  /**
   * Логує помилку компонента (для ErrorBoundary)
   */
  logComponentError(
    error: Error,
    componentStack: string | null,
    componentName?: string
  ): void {
    const entry: ErrorLogEntry = {
      message: error.message,
      stack: error.stack,
      componentName,
      context: { componentStack },
      timestamp: new Date(),
      severity: 'error',
    };

    if (this.isDevelopment) {
      console.group('🔴 Component Error');
      console.error('Error:', error);
      if (componentStack) {
        console.error('Component Stack:', componentStack);
      }
      console.groupEnd();
    }

    // Production: можна додати відправку на сервер
    // this.sendToRemote(entry);
  }

  /**
   * Логує unhandled promise rejection
   */
  logUnhandledRejection(reason: unknown): void {
    this.log(reason, { type: 'unhandled_rejection' }, 'critical');
  }

  /**
   * Логує global window error
   */
  logGlobalError(
    message: string,
    source?: string,
    lineno?: number,
    colno?: number
  ): void {
    this.log(new Error(message), {
      type: 'global_error',
      source,
      lineno,
      colno,
    }, 'critical');
  }

  private logToConsole(entry: ErrorLogEntry): void {
    const prefix = this.getSeverityPrefix(entry.severity);

    console.group(`${prefix} ${entry.message}`);
    console.log('Timestamp:', entry.timestamp.toISOString());

    if (entry.context) {
      console.log('Context:', entry.context);
    }

    if (entry.stack) {
      console.log('Stack:', entry.stack);
    }

    console.groupEnd();
  }

  private getSeverityPrefix(severity: ErrorSeverity): string {
    switch (severity) {
      case 'info':
        return 'ℹ️';
      case 'warn':
        return '⚠️';
      case 'error':
        return '❌';
      case 'critical':
        return '🔴';
      default:
        return '❓';
    }
  }

  // Placeholder для production logging
  // private async sendToRemote(entry: ErrorLogEntry): Promise<void> {
  //   // Інтеграція з Sentry, LogRocket, тощо
  //   // await fetch('/api/log-error', { method: 'POST', body: JSON.stringify(entry) });
  // }
}

// Експортуємо singleton інстанс
export const errorLogger = ErrorLogger.getInstance();
