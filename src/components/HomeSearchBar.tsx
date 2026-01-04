/**
 * HomeSearchBar - Красиве поле пошуку для головної сторінки
 *
 * При кліку або Enter відкриває глобальний UnifiedSearch (Cmd+K)
 * Показує feature chips та популярні запити
 */

import { useState, useRef } from 'react';
import { Search, BookOpen, Headphones, Book, Wrench, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface HomeSearchBarProps {
  className?: string;
  onOpenSearch?: () => void;
}

// Feature категорії для chips
const FEATURES = [
  { id: 'verses', icon: BookOpen, label_ua: 'Священні тексти', label_en: 'Sacred Texts' },
  { id: 'audio', icon: Headphones, label_ua: 'Аудіокниги', label_en: 'Audiobooks' },
  { id: 'glossary', icon: Book, label_ua: 'Глосарій', label_en: 'Glossary' },
  { id: 'tools', icon: Wrench, label_ua: 'Інструменти', label_en: 'Tools' },
];

// Популярні запити
const POPULAR_SEARCHES = [
  { query: 'Кришна', href: '/search?q=Кришна' },
  { query: 'Бгаґавад-ґіта', href: '/veda-reader/bg' },
  { query: 'Прабгупада', href: '/search?q=Прабгупада' },
  { query: 'медитація', href: '/search?q=медитація' },
  { query: 'карма', href: '/glossary?q=карма' },
];

export function HomeSearchBar({ className, onOpenSearch }: HomeSearchBarProps) {
  const { language, t } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Відкрити глобальний пошук
  const openGlobalSearch = () => {
    // Dispatch Cmd+K event для відкриття UnifiedSearch
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      code: 'KeyK',
      metaKey: true,
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
    onOpenSearch?.();
  };

  const handleClick = () => {
    openGlobalSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      openGlobalSearch();
    }
  };

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Поле пошуку */}
      <div
        onClick={handleClick}
        className={cn(
          'relative flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4',
          'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm',
          'border-2 border-white/20 rounded-xl sm:rounded-2xl',
          'cursor-pointer transition-all duration-200',
          'hover:bg-white dark:hover:bg-gray-900',
          'hover:border-primary/30 hover:shadow-lg',
          isFocused && 'ring-2 ring-primary/50 border-primary/30'
        )}
      >
        <Search className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground flex-shrink-0" />

        <input
          ref={inputRef}
          type="text"
          readOnly
          placeholder={t('Шукати вірші, аудіо, глосарій...', 'Search verses, audio, glossary...')}
          className={cn(
            'flex-1 bg-transparent border-none outline-none',
            'text-sm sm:text-base text-foreground placeholder:text-muted-foreground',
            'cursor-pointer'
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
        />

        {/* Keyboard shortcut hint */}
        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 rounded bg-muted/50 font-mono">⌘</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-muted/50 font-mono">K</kbd>
        </div>
      </div>

      {/* Feature Chips */}
      <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-2">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={handleClick}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5',
                'text-xs sm:text-sm font-medium min-h-[40px]',
                'bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm',
                'text-white/90 hover:text-white active:scale-95',
                'rounded-full border border-white/20',
                'hover:bg-white/30 dark:hover:bg-gray-700/50',
                'transition-all duration-200 hover:scale-105'
              )}
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{language === 'ua' ? feature.label_ua : feature.label_en}</span>
            </button>
          );
        })}
      </div>

      {/* Популярні запити */}
      <div className="mt-4 sm:mt-5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs text-white/70">
            {t('Популярні запити', 'Popular searches')}
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_SEARCHES.map((item) => (
            <a
              key={item.query}
              href={item.href}
              className={cn(
                'px-3 sm:px-4 py-2 text-xs sm:text-sm min-h-[36px]',
                'text-white/80 hover:text-white active:scale-95',
                'bg-white/10 hover:bg-white/20',
                'rounded-lg border border-white/10',
                'transition-all duration-200 inline-flex items-center'
              )}
            >
              {item.query}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
