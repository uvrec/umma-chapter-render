import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

const categoryLabels = {
  navigation: { uk: 'Навігація', en: 'Navigation' },
  display: { uk: 'Відображення', en: 'Display' },
  font: { uk: 'Розмір шрифту', en: 'Font Size' },
  modes: { uk: 'Режими', en: 'Modes' },
  help: { uk: 'Довідка', en: 'Help' },
};

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  shortcuts,
}) => {
  const { language, t } = useLanguage();

  // Групувати shortcuts по категоріях
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'help';
    if (!acc[category]) acc[category] = [];
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  const formatKey = (key: string) => {
    // Відображення спеціальних клавіш
    const keyMap: Record<string, string> = {
      'ArrowLeft': '←',
      'ArrowRight': '→',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'Escape': 'Esc',
      '{': 'Shift + [',
      '}': 'Shift + ]',
    };
    return keyMap[key] || key;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t('Клавіатурні скорочення', 'Keyboard Shortcuts')}
          </DialogTitle>
          <DialogDescription>
            {t(
              'Використовуйте ці комбінації клавіш для швидкої навігації',
              'Use these key combinations for quick navigation'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                {categoryLabels[category as keyof typeof categoryLabels]?.[language] || category}
              </h3>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                  >
                    <span className="text-sm text-foreground">
                      {shortcut.description}
                    </span>
                    <kbd className="px-3 py-1.5 text-xs font-semibold bg-muted text-muted-foreground border border-border rounded">
                      {formatKey(shortcut.key)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-xs text-muted-foreground text-center">
          {t(
            'Натисніть ? щоб показати/сховати це вікно',
            'Press ? to show/hide this window'
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
