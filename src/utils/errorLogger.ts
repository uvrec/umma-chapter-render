/**
 * Централізована утиліта для логування помилок
 *
 * Забезпечує:
 * - Консистентне логування в development
 * - Опціональна інтеграція з Sentry в production
 * - Контекстну інформацію для дебагу
 * - Відстеження користувача для персоналізованих звітів
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

interface UserInfo {
  id: string;
  email?: string;
  username?: string;
}

// Sentry module type (optional dependency)
interface SentryModule {
  init: (options: Record<string, unknown>) => void;
  captureException: (error: Error, hint?: Record<string, unknown>) => void;
  captureMessage: (message: string, level?: string) => void;
  setUser: (user: UserInfo | null) => void;
  withScope: (callback: (scope: SentryScope) => void) => void;
  browserTracingIntegration?: () => unknown;
  replayIntegration?: (options?: Record<string, unknown>) => unknown;
}

interface SentryScope {
  setLevel: (level: string) => void;
  setExtra: (key: string, value: unknown) => void;
  setTag: (key: string, value: string) => void;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private isDevelopment: boolean;
  private isProduction: boolean;
  private sentry: SentryModule | null = null;
  private isInitialized = false;
  private currentUser: UserInfo | null = null;

  private constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.isProduction = import.meta.env.PROD;
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * Ініціалізує error tracking (Sentry якщо доступний)
   * Викликати один раз при старті додатку
   *
   * Для активації Sentry:
   * 1. npm install @sentry/react
   * 2. Додати VITE_SENTRY_DSN у .env
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Sentry тільки в production з налаштованим DSN
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

    if (this.isProduction && sentryDsn) {
      // Примітка: Sentry буде ініціалізований тільки якщо пакет встановлений
      // Для активації: npm install @sentry/react
      console.log('[ErrorLogger] Sentry DSN configured, but @sentry/react not installed. To enable Sentry, run: npm install @sentry/react');
    }
  }

  /**
   * Ініціалізація Sentry (виклика ззовні якщо пакет встановлений)
   * Використання:
   * import * as Sentry from '@sentry/react';
   * errorLogger.initializeSentry(Sentry);
   */
  initializeSentry(sentryModule: SentryModule): void {
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    if (!sentryDsn) {
      console.warn('[ErrorLogger] VITE_SENTRY_DSN not configured');
      return;
    }

    try {
      this.sentry = sentryModule;

      const integrations: unknown[] = [];

      if (sentryModule.browserTracingIntegration) {
        integrations.push(sentryModule.browserTracingIntegration());
      }

      if (sentryModule.replayIntegration) {
        integrations.push(
          sentryModule.replayIntegration({
            maskAllText: false,
            blockAllMedia: false,
          })
        );
      }

      sentryModule.init({
        dsn: sentryDsn,
        integrations,
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        environment: import.meta.env.MODE,
      });

      console.log('[ErrorLogger] Sentry initialized');
    } catch (e) {
      console.warn('[ErrorLogger] Failed to initialize Sentry:', e);
    }
  }

  /**
   * Встановити поточного користувача для контексту помилок
   */
  setUser(user: UserInfo | null): void {
    this.currentUser = user;

    if (this.sentry) {
      this.sentry.setUser(user);
    }
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

    // Production: відправляємо в Sentry
    if (this.sentry) {
      this.sendToSentry(errorObj, context, severity);
    }
  }

  /**
   * Логує помилку без показу тосту (для localStorage, minor errors)
   */
  logSilent(error: unknown, context?: string): void {
    if (this.isDevelopment) {
      console.debug(`[Silent Error] ${context || 'Unknown context'}:`, error);
    }
    // Не відправляємо в Sentry - це очікувані minor errors
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

    if (this.sentry) {
      this.sendToSentry(error, { componentStack, componentName }, 'error');
    }
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

  /**
   * Логує повідомлення (не помилку)
   */
  logMessage(message: string, context?: Record<string, unknown>, severity: ErrorSeverity = 'info'): void {
    if (this.isDevelopment) {
      const prefix = this.getSeverityPrefix(severity);
      console.log(`${prefix} ${message}`, context);
    }

    if (this.sentry && severity !== 'info') {
      this.sentry.captureMessage(message, this.mapSeverityToSentryLevel(severity));
    }
  }

  private sendToSentry(
    error: Error,
    context?: Record<string, unknown>,
    severity: ErrorSeverity = 'error'
  ): void {
    if (!this.sentry) return;

    this.sentry.withScope((scope) => {
      scope.setLevel(this.mapSeverityToSentryLevel(severity));

      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }

      // Додати тег для типу помилки
      if (context?.type) {
        scope.setTag('error_type', String(context.type));
      }

      this.sentry!.captureException(error);
    });
  }

  private mapSeverityToSentryLevel(severity: ErrorSeverity): string {
    switch (severity) {
      case 'info':
        return 'info';
      case 'warn':
        return 'warning';
      case 'error':
        return 'error';
      case 'critical':
        return 'fatal';
      default:
        return 'error';
    }
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
}

// Експортуємо singleton інстанс
export const errorLogger = ErrorLogger.getInstance();

/**
 * Функція для ініціалізації error tracking
 * Викликати в main.tsx
 */
export async function initErrorTracking(): Promise<void> {
  await errorLogger.initialize();
}
