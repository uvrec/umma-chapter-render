/**
 * HomeSearchBar - Просте поле пошуку для головної сторінки
 *
 * При введенні тексту і Enter перенаправляє на /search?q=запит
 * Без діалогів, без складностей
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface HomeSearchBarProps {
  className?: string;
}

export function HomeSearchBar({ className }: HomeSearchBarProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('w-full max-w-xl mx-auto', className)}>
      <div
        className={cn(
          'relative flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4',
          'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm',
          'rounded-xl sm:rounded-2xl',
          'shadow-lg'
        )}
      >
        <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('Шукати по текстах...', 'Search texts...')}
          className={cn(
            'flex-1 bg-transparent border-none outline-none',
            'text-sm sm:text-base text-foreground placeholder:text-muted-foreground'
          )}
        />

        {query.length > 0 && (
          <button
            type="submit"
            className="text-sm text-primary hover:underline"
          >
            {t('Знайти', 'Search')}
          </button>
        )}
      </div>
    </form>
  );
}
