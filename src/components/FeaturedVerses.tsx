/**
 * FeaturedVerses - Секція з рекомендованими віршами
 *
 * Показує популярні/важливі вірші для початківців
 */

import { useQuery } from '@tanstack/react-query';
import { BookOpen, ArrowRight, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FeaturedVersesProps {
  className?: string;
}

// Важливі вірші для рекомендацій (book_slug, chapter, verse)
const FEATURED_VERSE_REFS = [
  { book: 'bg', chapter: 2, verse: 47, description_ua: 'Про дію без прив\'язаності', description_en: 'On action without attachment' },
  { book: 'bg', chapter: 4, verse: 7, description_ua: 'Про прихід Господа', description_en: 'On the Lord\'s advent' },
  { book: 'bg', chapter: 9, verse: 22, description_ua: 'Про захист відданих', description_en: 'On protecting devotees' },
  { book: 'bg', chapter: 18, verse: 66, description_ua: 'Найвища настанова', description_en: 'The supreme instruction' },
];

interface Verse {
  id: string;
  verse_number: string;
  translation_ua: string;
  translation_en: string;
  chapters: {
    chapter_number: number;
    title_ua: string;
    title_en: string;
    books: {
      slug: string;
      title_ua: string;
      title_en: string;
    };
  };
}

export function FeaturedVerses({ className }: FeaturedVersesProps) {
  const { language, t } = useLanguage();

  const { data: verses = [], isLoading } = useQuery({
    queryKey: ['featured-verses'],
    queryFn: async (): Promise<Verse[]> => {
      // Отримуємо вірші за референсами
      const results: Verse[] = [];

      for (const ref of FEATURED_VERSE_REFS) {
        const { data } = await supabase
          .from('verses')
          .select(`
            id,
            verse_number,
            translation_ua,
            translation_en,
            chapters!inner (
              chapter_number,
              title_ua,
              title_en,
              books!inner (
                slug,
                title_ua,
                title_en
              )
            )
          `)
          .eq('chapters.books.slug', ref.book)
          .eq('chapters.chapter_number', ref.chapter)
          .eq('verse_number', String(ref.verse))
          .single();

        if (data) {
          results.push(data as unknown as Verse);
        }
      }

      return results;
    },
    staleTime: 30 * 60 * 1000, // 30 хвилин
  });

  if (isLoading) {
    return (
      <section className={cn('py-8 sm:py-12', className)}>
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-center mb-6">
            {t('Рекомендовані вірші', 'Featured Verses')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/30 animate-pulse h-32" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (verses.length === 0) {
    return null;
  }

  return (
    <section className={cn('py-8 sm:py-12 bg-muted/20', className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
          <Quote className="h-5 w-5 text-primary" />
          <h2 className="text-xl sm:text-2xl font-serif font-semibold">
            {t('Рекомендовані вірші', 'Featured Verses')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {verses.map((verse, index) => {
            const ref = FEATURED_VERSE_REFS[index];
            const book = verse.chapters.books;
            const chapter = verse.chapters;
            const translation = language === 'ua' ? verse.translation_ua : verse.translation_en;
            const href = `/veda-reader/${book.slug}/${chapter.chapter_number}/${verse.verse_number}`;

            return (
              <a
                key={verse.id}
                href={href}
                className={cn(
                  'group block p-4 sm:p-5 rounded-xl',
                  'bg-background border border-border/50',
                  'hover:border-primary/30 hover:shadow-md',
                  'transition-all duration-200'
                )}
              >
                {/* Референс */}
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {book.slug.toUpperCase()} {chapter.chapter_number}.{verse.verse_number}
                  </span>
                </div>

                {/* Опис */}
                <p className="text-xs text-muted-foreground mb-2">
                  {language === 'ua' ? ref.description_ua : ref.description_en}
                </p>

                {/* Переклад (обрізаний) */}
                <p className="text-sm sm:text-base text-foreground/80 line-clamp-3 mb-3">
                  {translation}
                </p>

                {/* Кнопка */}
                <div className="flex items-center text-sm text-primary group-hover:underline">
                  <span>{t('Читати повністю', 'Read full verse')}</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Кнопка до бібліотеки */}
        <div className="text-center mt-6 sm:mt-8">
          <Button variant="outline" asChild>
            <a href="/library" className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {t('Переглянути всі книги', 'View all books')}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
