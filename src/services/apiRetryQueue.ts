/**
 * API Retry Queue - Зберігає та повторює невдалі API запити
 *
 * Функціонал:
 * - Зберігає запити в IndexedDB для persistence
 * - Автоматично повторює при відновленні мережі
 * - Обмеження на кількість спроб
 * - Експоненційний backoff
 */

import { errorLogger } from '@/utils/errorLogger';

export interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  body?: string;
  headers?: Record<string, string>;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  priority: 'high' | 'normal' | 'low';
}

export type QueueEventType = 'added' | 'processed' | 'failed' | 'cleared';

type QueueListener = (event: { type: QueueEventType; queueLength: number }) => void;

class ApiRetryQueue {
  private queue: QueuedRequest[] = [];
  private isProcessing = false;
  private listeners: Set<QueueListener> = new Set();
  private readonly STORAGE_KEY = 'vv_api_retry_queue';
  private readonly DEFAULT_MAX_RETRIES = 3;
  private readonly BACKOFF_BASE_MS = 1000;

  constructor() {
    this.loadFromStorage();
    this.setupEventListeners();
  }

  /**
   * Підписка на зміни черги
   */
  subscribe(listener: QueueListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Отримати поточну довжину черги
   */
  get length(): number {
    return this.queue.length;
  }

  /**
   * Отримати всі елементи черги (readonly)
   */
  getAll(): readonly QueuedRequest[] {
    return [...this.queue];
  }

  /**
   * Додати запит до черги
   */
  add(request: Omit<QueuedRequest, 'id' | 'timestamp' | 'retryCount'>): string {
    const id = crypto.randomUUID();
    const item: QueuedRequest = {
      ...request,
      id,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: request.maxRetries ?? this.DEFAULT_MAX_RETRIES,
      priority: request.priority ?? 'normal',
    };

    // Вставити за пріоритетом
    if (item.priority === 'high') {
      this.queue.unshift(item);
    } else {
      this.queue.push(item);
    }

    this.saveToStorage();
    this.notifyListeners('added');

    // Спробувати обробити якщо онлайн
    if (navigator.onLine) {
      this.processQueue();
    }

    return id;
  }

  /**
   * Видалити запит з черги
   */
  remove(id: string): boolean {
    const index = this.queue.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.queue.splice(index, 1);
    this.saveToStorage();
    this.notifyListeners('processed');
    return true;
  }

  /**
   * Очистити всю чергу
   */
  clear(): void {
    this.queue = [];
    this.saveToStorage();
    this.notifyListeners('cleared');
  }

  /**
   * Обробити чергу
   */
  async processQueue(): Promise<void> {
    if (this.isProcessing || !navigator.onLine || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0 && navigator.onLine) {
      const item = this.queue[0];

      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: item.headers ? new Headers(item.headers) : undefined,
          body: item.body,
        });

        if (response.ok) {
          // Успіх - видалити з черги
          this.queue.shift();
          this.saveToStorage();
          this.notifyListeners('processed');
        } else if (response.status >= 400 && response.status < 500) {
          // Клієнтська помилка - не повторювати
          this.queue.shift();
          this.saveToStorage();
          errorLogger.log(
            new Error(`API request failed with status ${response.status}`),
            { url: item.url, status: response.status, type: 'client_error' }
          );
          this.notifyListeners('failed');
        } else {
          // Серверна помилка - повторити
          item.retryCount++;
          if (item.retryCount >= item.maxRetries) {
            this.queue.shift();
            errorLogger.log(
              new Error(`API request failed after ${item.maxRetries} retries`),
              { url: item.url, status: response.status }
            );
            this.notifyListeners('failed');
          } else {
            this.saveToStorage();
            // Backoff перед наступною спробою
            await this.delay(this.getBackoffDelay(item.retryCount));
          }
        }
      } catch (error) {
        // Мережева помилка
        if (!navigator.onLine) {
          // Вийшли офлайн - зупинити обробку
          break;
        }

        item.retryCount++;
        if (item.retryCount >= item.maxRetries) {
          this.queue.shift();
          errorLogger.log(error as Error, {
            url: item.url,
            context: 'retry_queue_network_error',
          });
          this.notifyListeners('failed');
        } else {
          this.saveToStorage();
          await this.delay(this.getBackoffDelay(item.retryCount));
        }
      }
    }

    this.isProcessing = false;
  }

  private setupEventListeners(): void {
    // Обробити чергу при відновленні мережі
    window.addEventListener('online', () => {
      setTimeout(() => this.processQueue(), 1000); // Невелика затримка для стабілізації
    });

    // Зберегти чергу перед закриттям сторінки
    window.addEventListener('beforeunload', () => {
      this.saveToStorage();
    });
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          // Відфільтрувати застарілі запити (старші 24 годин)
          const maxAge = 24 * 60 * 60 * 1000;
          const now = Date.now();
          this.queue = parsed.filter(
            item => now - item.timestamp < maxAge
          );
        }
      }
    } catch (e) {
      errorLogger.logSilent(e, 'Failed to load retry queue from storage');
      this.queue = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      errorLogger.logSilent(e, 'Failed to save retry queue to storage');
    }
  }

  private notifyListeners(type: QueueEventType): void {
    const event = { type, queueLength: this.queue.length };
    this.listeners.forEach(listener => listener(event));
  }

  private getBackoffDelay(retryCount: number): number {
    // Експоненційний backoff: 1s, 2s, 4s, 8s...
    return this.BACKOFF_BASE_MS * Math.pow(2, retryCount - 1);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const apiRetryQueue = new ApiRetryQueue();
