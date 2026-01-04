/**
 * GettingStarted - Секція для нових користувачів
 *
 * Показує можливості сайту та з чого почати
 */

import {
  BookOpen,
  Headphones,
  Search,
  Languages,
  Bookmark,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface GettingStartedProps {
  className?: string;
}

const FEATURES = [
  {
    icon: BookOpen,
    title_ua: 'Читайте священні тексти',
    title_en: 'Read sacred texts',
    description_ua: 'Бгаґавад-ґіта, Шрімад-Бгаґаватам та інші тексти з коментарями українською',
    description_en: 'Bhagavad-gita, Srimad-Bhagavatam and other texts with commentaries in Ukrainian',
    href: '/library',
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
  },
  {
    icon: Headphones,
    title_ua: 'Слухайте аудіокниги',
    title_en: 'Listen to audiobooks',
    description_ua: 'Лекції та аудіозаписи для прослуховування в дорозі або вдома',
    description_en: 'Lectures and audio recordings to listen on the go or at home',
    href: '/audiobooks',
    color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: Search,
    title_ua: 'Шукайте по текстах',
    title_en: 'Search through texts',
    description_ua: 'Повнотекстовий пошук по віршах, коментарях та синонімах',
    description_en: 'Full-text search across verses, commentaries and synonyms',
    href: '/search',
    color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30',
  },
  {
    icon: Languages,
    title_ua: 'Вивчайте санскрит',
    title_en: 'Learn Sanskrit',
    description_ua: 'Інструменти для транслітерації та вивчення ведичних мов',
    description_en: 'Tools for transliteration and learning Vedic languages',
    href: '/tools/transliteration',
    color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30',
  },
  {
    icon: Bookmark,
    title_ua: 'Зберігайте закладки',
    title_en: 'Save bookmarks',
    description_ua: 'Створюйте нотатки, виділення та закладки для важливих місць',
    description_en: 'Create notes, highlights and bookmarks for important passages',
    href: '/library',
    color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30',
  },
  {
    icon: Lightbulb,
    title_ua: 'Досліджуйте глосарій',
    title_en: 'Explore glossary',
    description_ua: 'Словник санскритських термінів з поясненнями',
    description_en: 'Dictionary of Sanskrit terms with explanations',
    href: '/glossary',
    color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30',
  },
];

export function GettingStarted({ className }: GettingStartedProps) {
  const { language, t } = useLanguage();

  return (
    <section className={cn('py-10 sm:py-14', className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold mb-2">
            {t('Що тут можна робити', 'What you can do here')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t(
              'Vedavoice — це цифрова бібліотека ведичної мудрості українською мовою',
              'Vedavoice is a digital library of Vedic wisdom in Ukrainian'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <a
                key={feature.href + feature.title_ua}
                href={feature.href}
                className={cn(
                  'group block p-5 sm:p-6 rounded-xl',
                  'border border-border/50 bg-card',
                  'hover:border-primary/30 hover:shadow-lg',
                  'transition-all duration-200'
                )}
              >
                <div
                  className={cn(
                    'inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg mb-4',
                    feature.color
                  )}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <h3 className="font-semibold text-base sm:text-lg mb-2 group-hover:text-primary transition-colors">
                  {language === 'ua' ? feature.title_ua : feature.title_en}
                </h3>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {language === 'ua' ? feature.description_ua : feature.description_en}
                </p>

                <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{t('Перейти', 'Go')}</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
