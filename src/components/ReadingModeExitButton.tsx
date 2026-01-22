/**
 * ReadingModeExitButton - Глобальна кнопка виходу з режимів читання
 *
 * Показується коли активний будь-який режим:
 * - Zen mode
 * - Presentation mode
 * - Fullscreen mode
 *
 * Також обробляє Escape для виходу з режимів
 */

import { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';

type ReadingMode = 'zen' | 'presentation' | 'fullscreen' | null;

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

  // Вихід з режиму
  const exitMode = useCallback(() => {
    const root = document.documentElement;
    root.setAttribute('data-presentation-mode', 'false');
    root.setAttribute('data-zen-mode', 'false');
    root.setAttribute('data-fullscreen-reading', 'false');
    setActiveMode(null);
  }, []);

  // Слухаємо зміни атрибутів
  useEffect(() => {
    checkActiveMode();

    // MutationObserver для відстеження змін атрибутів
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName?.startsWith('data-')) {
          checkActiveMode();
        }
      });
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

  // Визначаємо стиль та текст залежно від режиму
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
