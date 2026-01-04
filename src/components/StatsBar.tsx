/**
 * StatsBar - Показує статистику сайту
 *
 * Кількість книг, віршів, аудіозаписів
 */

import { useQuery } from '@tanstack/react-query';
import { BookOpen, FileText, Headphones, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface StatsBarProps {
  className?: string;
}

interface Stats {
  books: number;
  verses: number;
  audioTracks: number;
  glossaryTerms: number;
}

export function StatsBar({ className }: StatsBarProps) {
  const { t } = useLanguage();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['site-stats'],
    queryFn: async (): Promise<Stats> => {
      // Паралельно отримуємо всі підрахунки
      const [booksResult, versesResult, audioResult, glossaryResult] = await Promise.all([
        supabase.from('books').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('verses').select('id', { count: 'exact', head: true }),
        supabase.from('audio_tracks').select('id', { count: 'exact', head: true }),
        supabase.from('glossary_terms').select('id', { count: 'exact', head: true }),
      ]);

      return {
        books: booksResult.count || 0,
        verses: versesResult.count || 0,
        audioTracks: audioResult.count || 0,
        glossaryTerms: glossaryResult.count || 0,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 хвилин
    gcTime: 30 * 60 * 1000,
  });

  // Форматування числа з роздільниками
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace('.0', '')}K+`;
    }
    return num.toString();
  };

  const STATS_CONFIG = [
    {
      id: 'books',
      icon: BookOpen,
      value: stats?.books || 0,
      label_ua: 'книг',
      label_en: 'books',
    },
    {
      id: 'verses',
      icon: FileText,
      value: stats?.verses || 0,
      label_ua: 'віршів',
      label_en: 'verses',
    },
    {
      id: 'audio',
      icon: Headphones,
      value: stats?.audioTracks || 0,
      label_ua: 'аудіозаписів',
      label_en: 'audio tracks',
    },
    {
      id: 'glossary',
      icon: Users,
      value: stats?.glossaryTerms || 0,
      label_ua: 'термінів',
      label_en: 'terms',
    },
  ];

  if (isLoading) {
    return (
      <div className={cn('py-4 sm:py-6 bg-muted/30', className)}>
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-6 sm:gap-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="h-6 w-12 bg-muted animate-pulse rounded" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-4 sm:py-6 bg-muted/30 border-y border-border/50', className)}>
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-4 sm:gap-8 md:gap-12 flex-wrap">
          {STATS_CONFIG.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="flex items-center gap-2 sm:gap-3"
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary/70" />
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
                  <span className="text-lg sm:text-xl font-bold text-foreground">
                    {formatNumber(stat.value)}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {t(stat.label_ua, stat.label_en)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
