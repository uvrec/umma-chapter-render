import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  description: string;
  handler: () => void;
  category?: 'navigation' | 'display' | 'font' | 'modes' | 'help';
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  shortcuts: KeyboardShortcut[];
}

/**
 * Hook для обробки клавіатурних скорочень
 * Ігнорує input/textarea/contenteditable елементи
 */
export function useKeyboardShortcuts({
  enabled = true,
  shortcuts,
}: UseKeyboardShortcutsOptions) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Ігнорувати якщо фокус на полі вводу
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    const isEditable =
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      target.isContentEditable;

    if (isEditable) return;

    // Ігнорувати якщо натиснуто Ctrl, Command (Meta) або Alt
    // Це дозволяє стандартним комбінаціям (Ctrl+C, Cmd+C, Alt+Tab тощо) працювати нормально
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    // Знайти відповідний shortcut
    const shortcut = shortcutsRef.current.find(s => {
      // Підтримка Shift+key (для { і })
      if (event.shiftKey) {
        return s.key === event.key;
      }
      return s.key === event.key;
    });

    if (shortcut) {
      event.preventDefault();
      event.stopPropagation();
      shortcut.handler();
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enabled, handleKeyPress]);

  return shortcutsRef.current;
}
