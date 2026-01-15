/**
 * JumpToVerseDialog - Quick navigation modal for jumping to any verse
 *
 * Supported formats:
 * - "БГ 2.14" / "BG 2.14" → /veda-reader/bg/2/14
 * - "ШБ 1.1.1" / "SB 1.1.1" → /veda-reader/sb/canto/1/chapter/1/1
 * - "ЧЧ Аді 1.1" / "CC Adi 1.1" → /veda-reader/cc/canto/1/chapter/1/1
 * - "2.14" (within current book) → relative navigation
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { isCantoBookSlug } from "@/contexts/BooksContext";
import { Navigation, ArrowRight, AlertCircle } from "lucide-react";

interface JumpToVerseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentBookId?: string;
  currentCantoNumber?: string;
  isCantoMode?: boolean;
}

// Book slug mappings (Ukrainian → English slugs)
const BOOK_SLUGS: Record<string, string> = {
  // Ukrainian abbreviations
  'бг': 'bg',
  'шб': 'sb',
  'чч': 'cc',
  'нн': 'noi',
  'ішо': 'iso',
  'нв': 'nod',
  // English abbreviations
  'bg': 'bg',
  'sb': 'sb',
  'cc': 'cc',
  'noi': 'noi',
  'iso': 'iso',
  'nod': 'nod',
  // Full names (common)
  'gita': 'bg',
  'bhagavatam': 'sb',
  'caitanya': 'cc',
};

// Books that have cantos/volumes - використовуємо централізовану функцію з BooksContext
// isCantoBookSlug() імпортований з @/contexts/BooksContext

// CC canto name mappings
const CC_CANTO_NAMES: Record<string, number> = {
  // Ukrainian
  'аді': 1,
  'ади': 1,
  'мадг\'я': 2,
  'мадгя': 2,
  'мадхя': 2,
  'антя': 3,
  // English
  'adi': 1,
  'madhya': 2,
  'antya': 3,
};

interface ParsedReference {
  bookSlug: string;
  cantoNumber?: number;
  chapterNumber: number;
  verseNumber: string;
  isValid: boolean;
  error?: string;
}

/**
 * Parse verse reference string into structured data
 */
function parseVerseReference(input: string, currentBookId?: string): ParsedReference {
  const trimmed = input.trim().toLowerCase();

  if (!trimmed) {
    return { bookSlug: '', chapterNumber: 0, verseNumber: '', isValid: false, error: 'empty' };
  }

  // Pattern 1: Full reference with book "БГ 2.14" or "SB 1.1.1" or "CC Adi 1.1"
  const fullRefMatch = trimmed.match(/^([a-zа-яіїєґ']+)\s*(.+)$/i);

  if (fullRefMatch) {
    const [, bookPart, numbersPart] = fullRefMatch;
    const bookSlug = BOOK_SLUGS[bookPart.toLowerCase()];

    if (bookSlug) {
      return parseNumbersPart(numbersPart, bookSlug);
    }

    // Maybe it's a CC canto name like "Adi 1.1"
    const ccCantoNum = CC_CANTO_NAMES[bookPart.toLowerCase()];
    if (ccCantoNum && currentBookId === 'cc') {
      const numbers = numbersPart.split(/[.\s]+/).filter(Boolean);
      if (numbers.length >= 2) {
        return {
          bookSlug: 'cc',
          cantoNumber: ccCantoNum,
          chapterNumber: parseInt(numbers[0]),
          verseNumber: numbers.slice(1).join('-'),
          isValid: true,
        };
      }
    }
  }

  // Pattern 2: Just numbers "2.14" or "1.1.1" (relative to current book)
  const numbersOnly = trimmed.split(/[.\s]+/).filter(Boolean);

  if (numbersOnly.length >= 2 && numbersOnly.every(n => /^\d+(-\d+)?$/.test(n))) {
    if (currentBookId) {
      const isCanto = isCantoBookSlug(currentBookId);

      if (isCanto && numbersOnly.length >= 3) {
        // Format: canto.chapter.verse
        return {
          bookSlug: currentBookId,
          cantoNumber: parseInt(numbersOnly[0]),
          chapterNumber: parseInt(numbersOnly[1]),
          verseNumber: numbersOnly.slice(2).join('-'),
          isValid: true,
        };
      } else if (numbersOnly.length >= 2) {
        // Format: chapter.verse
        return {
          bookSlug: currentBookId,
          chapterNumber: parseInt(numbersOnly[0]),
          verseNumber: numbersOnly.slice(1).join('-'),
          isValid: true,
        };
      }
    }
  }

  return {
    bookSlug: '',
    chapterNumber: 0,
    verseNumber: '',
    isValid: false,
    error: 'invalid_format'
  };
}

/**
 * Parse the numbers part of a reference (after book abbreviation)
 */
function parseNumbersPart(numbersPart: string, bookSlug: string): ParsedReference {
  const isCanto = isCantoBookSlug(bookSlug);

  // Check for CC canto names like "Adi 1.1"
  if (bookSlug === 'cc') {
    const ccMatch = numbersPart.match(/^([a-zа-яіїєґ']+)\s*(.+)$/i);
    if (ccMatch) {
      const [, cantoName, nums] = ccMatch;
      const cantoNum = CC_CANTO_NAMES[cantoName.toLowerCase()];
      if (cantoNum) {
        const numbers = nums.split(/[.\s]+/).filter(Boolean);
        if (numbers.length >= 2) {
          return {
            bookSlug,
            cantoNumber: cantoNum,
            chapterNumber: parseInt(numbers[0]),
            verseNumber: numbers.slice(1).join('-'),
            isValid: true,
          };
        }
      }
    }
  }

  // Parse numeric format
  const numbers = numbersPart.split(/[.\s]+/).filter(Boolean);

  if (isCanto) {
    // Need at least canto.chapter.verse
    if (numbers.length >= 3) {
      return {
        bookSlug,
        cantoNumber: parseInt(numbers[0]),
        chapterNumber: parseInt(numbers[1]),
        verseNumber: numbers.slice(2).join('-'),
        isValid: true,
      };
    } else if (numbers.length === 2) {
      // Assume first is chapter, second is verse (for current canto)
      return {
        bookSlug,
        chapterNumber: parseInt(numbers[0]),
        verseNumber: numbers[1],
        isValid: true,
      };
    }
  } else {
    // Simple book: chapter.verse
    if (numbers.length >= 2) {
      return {
        bookSlug,
        chapterNumber: parseInt(numbers[0]),
        verseNumber: numbers.slice(1).join('-'),
        isValid: true,
      };
    }
  }

  return {
    bookSlug,
    chapterNumber: 0,
    verseNumber: '',
    isValid: false,
    error: 'incomplete'
  };
}

/**
 * Build URL from parsed reference
 */
function buildUrl(ref: ParsedReference): string {
  if (!ref.isValid) return '';

  if (ref.bookSlug === 'noi') {
    // NOI special case: /veda-reader/noi/{verse}
    return `/veda-reader/noi/${ref.verseNumber}`;
  }

  if (ref.cantoNumber) {
    return `/veda-reader/${ref.bookSlug}/canto/${ref.cantoNumber}/chapter/${ref.chapterNumber}/${ref.verseNumber}`;
  }

  return `/veda-reader/${ref.bookSlug}/${ref.chapterNumber}/${ref.verseNumber}`;
}

export function JumpToVerseDialog({
  isOpen,
  onClose,
  currentBookId,
  currentCantoNumber,
  isCantoMode
}: JumpToVerseDialogProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<ParsedReference | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setInput('');
      setPreview(null);
    }
  }, [isOpen]);

  // Update preview on input change
  useEffect(() => {
    if (input.trim()) {
      const parsed = parseVerseReference(input, currentBookId);
      setPreview(parsed);
    } else {
      setPreview(null);
    }
  }, [input, currentBookId]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();

    if (preview?.isValid) {
      const url = buildUrl(preview);
      if (url) {
        navigate(url);
        onClose();
      }
    }
  }, [preview, navigate, onClose]);

  // Handle Enter key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && preview?.isValid) {
      handleSubmit();
    }
  }, [preview, handleSubmit]);

  // Example formats based on context
  const getExamples = () => {
    const examples: string[] = [];

    if (currentBookId === 'bg' || !currentBookId) {
      examples.push('БГ 2.14', 'BG 18.66');
    }
    if (currentBookId === 'sb' || !currentBookId) {
      examples.push('ШБ 1.1.1', 'SB 3.25.21');
    }
    if (currentBookId === 'cc' || !currentBookId) {
      examples.push('ЧЧ Аді 1.1', 'CC Madhya 8.128');
    }
    if (currentBookId && !['bg', 'sb', 'cc'].includes(currentBookId)) {
      examples.push('2.14', '3.1');
    }

    return examples.slice(0, 3);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            {t("Перейти до вірша", "Jump to Verse")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("Введіть посилання...", "Enter reference...")}
              className="text-lg"
              autoComplete="off"
              spellCheck={false}
            />

            {/* Examples */}
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>{t("Приклади:", "Examples:")}</span>
              {getExamples().map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setInput(ex)}
                  className="px-2 py-0.5 rounded bg-muted hover:bg-muted/80 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className={`p-3 rounded-lg border ${
              preview.isValid
                ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
            }`}>
              {preview.isValid ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="font-mono text-sm">
                      {buildUrl(preview)}
                    </span>
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400">
                    {t("Готово", "Ready")}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    {preview.error === 'incomplete'
                      ? t("Введіть повне посилання", "Enter complete reference")
                      : t("Невідомий формат", "Unknown format")
                    }
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("Скасувати", "Cancel")}
            </Button>
            <Button type="submit" disabled={!preview?.isValid}>
              <Navigation className="h-4 w-4 mr-2" />
              {t("Перейти", "Go")}
            </Button>
          </div>
        </form>

        {/* Keyboard hint */}
        <div className="text-xs text-center text-muted-foreground">
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">Enter</kbd>
          {' '}{t("для переходу", "to navigate")}
          {' • '}
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">Esc</kbd>
          {' '}{t("для закриття", "to close")}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default JumpToVerseDialog;
