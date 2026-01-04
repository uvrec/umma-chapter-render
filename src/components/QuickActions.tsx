/**
 * QuickActions - Кнопки швидкого доступу до основних функцій
 *
 * Розміщується після Hero для швидкого старту
 */

import { BookOpen, Headphones, Shuffle, Book, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  className?: string;
}

// Швидкі дії
const QUICK_ACTIONS = [
  {
    id: 'bg',
    icon: BookOpen,
    label_ua: 'Читати Бгаґавад-ґіту',
    label_en: 'Read Bhagavad-gita',
    description_ua: 'Починайте з основ',
    description_en: 'Start with the basics',
    href: '/veda-reader/bg',
    color: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'audio',
    icon: Headphones,
    label_ua: 'Слухати лекції',
    label_en: 'Listen to lectures',
    description_ua: 'Аудіокниги та бесіди',
    description_en: 'Audiobooks and talks',
    href: '/audiobooks',
    color: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'random',
    icon: Shuffle,
    label_ua: 'Випадковий вірш',
    label_en: 'Random verse',
    description_ua: 'Надихніться мудрістю',
    description_en: 'Get inspired',
    href: '/random-verse',
    color: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'glossary',
    icon: Book,
    label_ua: 'Глосарій',
    label_en: 'Glossary',
    description_ua: 'Словник термінів',
    description_en: 'Terms dictionary',
    href: '/glossary',
    color: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
];

export function QuickActions({ className }: QuickActionsProps) {
  const { language, t } = useLanguage();

  return (
    <section className={cn('py-6 sm:py-8', className)}>
      <div className="container mx-auto px-4">
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-4 sm:mb-6 text-muted-foreground">
          {t('Швидкий старт', 'Quick Start')}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.id}
                href={action.href}
                className={cn(
                  'group flex flex-col items-center p-4 sm:p-5 rounded-xl border',
                  'transition-all duration-200 hover:scale-[1.02] hover:shadow-md',
                  'active:scale-95 min-h-[100px] sm:min-h-[120px]',
                  action.color
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-3',
                    'bg-background/50'
                  )}
                >
                  <Icon className={cn('h-5 w-5 sm:h-6 sm:w-6', action.iconColor)} />
                </div>

                <span className="text-sm sm:text-base font-medium text-center leading-tight">
                  {language === 'ua' ? action.label_ua : action.label_en}
                </span>

                <span className="text-xs text-muted-foreground mt-1 text-center hidden sm:block">
                  {language === 'ua' ? action.description_ua : action.description_en}
                </span>

                <ArrowRight
                  className={cn(
                    'h-4 w-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity',
                    action.iconColor
                  )}
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
