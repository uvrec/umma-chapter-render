/**
 * QuickActions - Кнопки швидкого доступу до основних функцій
 *
 * Простий ряд кнопок без карток, відповідає стилю сайту
 */

import { BookOpen, Headphones, Shuffle, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const { t } = useLanguage();

  return (
    <section className={cn('py-6 sm:py-8 border-b border-border/50', className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" asChild>
            <a href="/veda-reader/bg">
              <BookOpen className="h-4 w-4 mr-2" />
              {t('Бгаґавад-ґіта', 'Bhagavad-gita')}
            </a>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <a href="/audiobooks">
              <Headphones className="h-4 w-4 mr-2" />
              {t('Аудіокниги', 'Audiobooks')}
            </a>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <a href="/library">
              <BookOpen className="h-4 w-4 mr-2" />
              {t('Бібліотека', 'Library')}
            </a>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <a href="/glossary">
              <Book className="h-4 w-4 mr-2" />
              {t('Глосарій', 'Glossary')}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
