/**
 * QuickActions - Кнопки швидкого доступу до основних функцій
 *
 * Простий ряд кнопок без карток, відповідає стилю сайту
 */

import { BookOpen, Headphones, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const { t, getLocalizedPath } = useLanguage();

  return (
    <section className={cn('py-6 sm:py-8', className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to={getLocalizedPath("/lib/bg")}>
              <BookOpen className="h-4 w-4 mr-2" />
              {t('Бгаґавад-ґіта', 'Bhagavad-gita')}
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link to="/audiobooks">
              <Headphones className="h-4 w-4 mr-2" />
              {t('Аудіокниги', 'Audiobooks')}
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link to="/library">
              <BookOpen className="h-4 w-4 mr-2" />
              {t('Бібліотека', 'Library')}
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link to="/glossary">
              <Book className="h-4 w-4 mr-2" />
              {t('Глосарій', 'Glossary')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
