/**
 * ReadingModeExitButton - Глобальна кнопка виходу з режимів читання
 *
 * Показується коли активний будь-який режим:
 * - Zen mode
 * - Presentation mode
 * - Fullscreen mode
 *
 * Також обробляє Escape для виходу з режимів.
 * Синхронізує стан через localStorage + подію vv-reader-prefs-changed,
 * щоб useReaderSettings підхоплював зміни.
 */

import { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';

type ReadingMode = 'zen' | 'presentation' | 'fullscreen' | null;

// localStorage ключі — мають збігатися з useReaderSettings
const LS_KEYS = {
  fullscreenMode: 'vv_reader_fullscreenMode',
  zenMode: 'vv_reader_zenMode',
  presentationMode: 'vv_reader_presentationMode',
};

export function ReadingModeExitButton() {
  const [activeMode, setActiveMode] = useState<ReadingMode>(null);

  // Перевіряємо активний режим
  const checkActiveMode = useCallback(() => {
    const root = document.documentElement;
    if (root.getAttribute('data-presentation-mode') === 'true') {
      setActiveMode('presentation');
    } else if (root.getAttribute('data-zen-mode') === 'true') {
      setActiveMode('zen');
    } else if (root.getAttribute('data-fullscreen-reading') === 'true') {
      setActiveMode('fullscreen');
    } else {
      setActiveMode(null);
    }
  }, []);

  // Вихід з режиму — синхронізуємо DOM, localStorage та React стан через подію
  const exitMode = useCallback(() => {
    const root = document.documentElement;

    // 1. Скидаємо DOM атрибути
    root.setAttribute('data-presentation-mode', 'false');
    root.setAttribute('data-zen-mode', 'false');
    root.setAttribute('data-fullscreen-reading', 'false');

    // 2. Скидаємо localStorage (щоб useReaderSettings підхопив при наступній ініціалізації)
    try {
      localStorage.setItem(LS_KEYS.presentationMode, 'false');
      localStorage.setItem(LS_KEYS.zenMode, 'false');
      localStorage.setItem(LS_KEYS.fullscreenMode, 'false');
    } catch {
      // localStorage may not be available
    }

    // 3. Сповіщаємо useReaderSettings через кастомну подію
    window.dispatchEvent(new Event('vv-reader-prefs-changed'));

    setActiveMode(null);
  }, []);

  // Слухаємо зміни атрибутів
  useEffect(() => {
    checkActiveMode();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName?.startsWith('data-')) {
          checkActiveMode();
          break;
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-presentation-mode', 'data-zen-mode', 'data-fullscreen-reading']
    });

    return () => observer.disconnect();
  }, [checkActiveMode]);

  // Обробка Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeMode) {
        e.preventDefault();
        exitMode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeMode, exitMode]);

  // Не показуємо якщо немає активного режиму
  if (!activeMode) return null;

  const getTitle = () => {
    switch (activeMode) {
      case 'presentation':
        return 'Вийти з презентації (Esc)';
      case 'zen':
        return 'Вийти з Zen режиму (Esc)';
      case 'fullscreen':
        return 'Вийти з повноекранного режиму (Esc)';
      default:
        return 'Вийти (Esc)';
    }
  };

  const getClassName = () => {
    switch (activeMode) {
      case 'presentation':
        return 'presentation-exit-btn';
      case 'zen':
        return 'zen-exit-btn';
      case 'fullscreen':
        return 'fullscreen-exit-btn';
      default:
        return 'reading-mode-exit-btn';
    }
  };

  return (
    <button
      onClick={exitMode}
      className={getClassName()}
      title={getTitle()}
      aria-label={getTitle()}
    >
      <X className="h-5 w-5" />
    </button>
  );
}
