// src/hooks/useDailyQuote.ts
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { stripParagraphTags } from "@/utils/import/normalizers";

export type DailyQuote = {
  id: string;
  quote_type: 'verse' | 'custom';

  verse_id?: string;
  verse?: {
    verse_number: string;
    chapter_id?: string;
    sanskrit_ua?: string;
    transliteration_ua?: string;
    translation_ua?: string;
    translation_en?: string;
    chapter?: {
      id: string;
      chapter_number: number;
      title_ua: string;
      title_en?: string;
      canto_id?: string;
      canto?: {
        canto_number: number;
        book?: {
          slug: string;
          title_ua: string;
          title_en?: string;
          has_cantos?: boolean;
        };
      };
      book?: {
        slug: string;
        title_ua: string;
        title_en?: string;
        has_cantos?: boolean;
      };
    };
  };

  quote_ua?: string;
  quote_en?: string;
  author_ua?: string;
  author_en?: string;
  source_ua?: string;
  source_en?: string;

  priority: number;
  display_count: number;
  last_displayed_at?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
};

/**
 * Hook для отримання цитати дня (вірш або кастомна цитата)
 * Автоматично вибирає наступну цитату на основі rotation_mode
 */
export function useDailyQuote() {
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  // Генеруємо унікальний ключ один раз при монтуванні компонента
  const [randomKey] = useState(() => Math.random());

  // Завантажуємо налаштування
  const { data: settings } = useQuery({
    queryKey: ["verse_of_the_day_settings"],
    queryFn: async () => {
      console.log('[DailyQuote] Завантаження налаштувань...');
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "verse_of_the_day")
        .single();

      if (error) {
        console.error('[DailyQuote] Помилка завантаження налаштувань:', error);
        // Повертаємо дефолтні налаштування замість помилки
        console.warn('[DailyQuote] Використовуємо дефолтні налаштування');
        return {
          enabled: true,
          rotation_mode: 'sequential' as const,
          current_index: 0,
          last_updated: null,
        };
      }

      const settingsValue = data?.value as {
        enabled: boolean;
        rotation_mode: 'sequential' | 'random' | 'custom';
        current_index: number;
        last_updated: string | null;
      };

      console.log('[DailyQuote] Налаштування завантажено:', settingsValue);

      // Якщо налаштування не мають enabled поля, встановлюємо true
      if (settingsValue && typeof settingsValue.enabled === 'undefined') {
        settingsValue.enabled = true;
      }

      return settingsValue || {
        enabled: true,
        rotation_mode: 'sequential' as const,
        current_index: 0,
        last_updated: null,
      };
    },
  });

  // Завантажуємо поточну цитату (випадковий вірш з книг)
  const { data: quote, isLoading, error } = useQuery({
    queryKey: ["daily_quote_verse", randomKey], // Унікальний ключ, генерується один раз при монтуванні
    queryFn: async () => {
      console.log('[DailyQuote] Завантаження випадкового вірша...');

      if (!settings?.enabled) {
        console.warn('[DailyQuote] Цитати вимкнено в налаштуваннях');
        return null;
      }

      try {
        // Отримуємо всі ID віршів що мають переклади
        const { data: verseIds, error: idsError } = await supabase
          .from("verses")
          .select("id")
          .not("translation_ua", "is", null)
          .not("translation_en", "is", null);

        if (idsError || !verseIds || verseIds.length === 0) {
          console.error('[DailyQuote] Помилка отримання ID віршів:', idsError);
          return null;
        }

        console.log('[DailyQuote] Знайдено віршів:', verseIds.length);

        // Вибираємо випадковий ID
        const randomIndex = Math.floor(Math.random() * verseIds.length);
        const randomVerseId = verseIds[randomIndex].id;
        console.log('[DailyQuote] Випадковий індекс:', randomIndex, 'ID:', randomVerseId);

        // Завантажуємо повні дані вірша
        const { data: verse, error } = await supabase
          .from("verses")
          .select(`
            id,
            verse_number,
            chapter_id,
            translation_ua,
            translation_en,
            chapter:chapters (
              id,
              chapter_number,
              title_ua,
              title_en,
              canto_id,
              canto:cantos (
                canto_number,
                book:books (
                  slug,
                  title_ua,
                  title_en,
                  has_cantos
                )
              ),
              book:books (
                slug,
                title_ua,
                title_en,
                has_cantos
              )
            )
          `)
          .eq("id", randomVerseId)
          .single();

        if (error) {
          console.error('[DailyQuote] Помилка завантаження вірша:', error);
          return null;
        }

        if (!verse) {
          console.warn('[DailyQuote] Не знайдено вірша за ID', randomVerseId);
          return null;
        }

        console.log('[DailyQuote] Завантажено випадковий вірш:', verse);

        // Перетворюємо вірш у формат DailyQuote
        return {
          id: verse.id,
          quote_type: 'verse' as const,
          verse_id: verse.id,
          verse: {
            verse_number: verse.verse_number,
            chapter_id: verse.chapter_id,
            translation_ua: verse.translation_ua,
            translation_en: verse.translation_en,
            chapter: verse.chapter,
          },
          priority: 100,
          display_count: 0,
          is_active: true,
        } as DailyQuote;
      } catch (err) {
        console.error('[DailyQuote] Неочікувана помилка:', err);
        return null;
      }
    },
    enabled: !!settings,
    retry: false,
    // Кешуємо на весь час життя компонента (щоб не перезавантажувати при ререндерах)
    staleTime: Infinity,
    // При демонтуванні видаляємо кеш (щоб наступного разу був новий вірш)
    gcTime: 0,
  });

  // Оновлюємо статистику показу цитати
  const updateDisplayStats = useMutation({
    mutationFn: async (quoteId: string) => {
      // Отримуємо поточне значення
      const { data: currentQuote } = await supabase
        .from("daily_quotes")
        .select("display_count")
        .eq("id", quoteId)
        .single();

      const newCount = (currentQuote?.display_count || 0) + 1;

      // Оновлюємо
      const { error } = await supabase
        .from("daily_quotes")
        .update({
          display_count: newCount,
          last_displayed_at: new Date().toISOString(),
        })
        .eq("id", quoteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_quote"] });
    },
  });

  // Форматуємо цитату для відображення
  const formattedQuote = quote ? {
    // Очищаємо текст від HTML тегів (<p>, </p> тощо)
    text: stripParagraphTags(language === 'ua'
      ? (quote.quote_type === 'verse' ? quote.verse?.translation_ua : quote.quote_ua) || ''
      : (quote.quote_type === 'verse' ? quote.verse?.translation_en : quote.quote_en) || ''),

    author: language === 'ua' ? quote.author_ua : quote.author_en,

    source: quote.quote_type === 'verse' && quote.verse?.chapter
      ? (() => {
          // Для книг з кантами book доступний через canto, інакше напряму
          const book = quote.verse.chapter.book || quote.verse.chapter.canto?.book;
          const bookTitle = book?.[language === 'ua' ? 'title_ua' : 'title_en'] || book?.title_ua || '';
          const chapterNumber = quote.verse.chapter.chapter_number;
          const verseNumber = quote.verse.verse_number;

          // Якщо є канта, додаємо її номер
          const cantoNumber = quote.verse.chapter.canto?.canto_number;
          if (cantoNumber) {
            return `${bookTitle} ${cantoNumber}.${chapterNumber}.${verseNumber}`;
          }

          return `${bookTitle} ${chapterNumber}.${verseNumber}`;
        })()
      : (language === 'ua' ? quote.source_ua : quote.source_en),

    verseNumber: quote.quote_type === 'verse' ? quote.verse?.verse_number : null,
    sanskrit: quote.quote_type === 'verse' ? quote.verse?.sanskrit_ua : null,
    transliteration: quote.quote_type === 'verse' ? quote.verse?.transliteration_ua : null,

    link: quote.quote_type === 'verse' && quote.verse?.chapter
      ? (() => {
          // Для книг з кантами book доступний через canto, інакше напряму
          const book = quote.verse.chapter.book || quote.verse.chapter.canto?.book;
          if (!book) return null;

          const bookSlug = book.slug;
          const verseNumber = quote.verse.verse_number;
          const hasCantos = book.has_cantos;
          const cantoNumber = quote.verse.chapter.canto?.canto_number;
          const chapterNumber = quote.verse.chapter.chapter_number;

          // Якщо книга має канти і є canto_id
          if (hasCantos && cantoNumber) {
            return `/lib/${bookSlug}/canto/${cantoNumber}/chapter/${chapterNumber}/${verseNumber}`;
          }

          // Інакше використовуємо chapterNumber
          return `/lib/${bookSlug}/${chapterNumber}/${verseNumber}`;
        })()
      : null,
  } : null;

  console.log('[DailyQuote] Форматована цитата:', formattedQuote);
  console.log('[DailyQuote] isLoading:', isLoading, 'error:', error);

  return {
    quote: formattedQuote,
    rawQuote: quote,
    isLoading,
    error,
    settings,
    updateDisplayStats: updateDisplayStats.mutate,
  };
}

/**
 * Hook для адмін-панелі: управління цитатами
 */
export function useDailyQuotesAdmin() {
  const queryClient = useQueryClient();

  // Завантажуємо всі цитати
  const { data: quotes, isLoading } = useQuery({
    queryKey: ["daily_quotes_admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_quotes")
        .select(`
          *,
          verse:verses!verse_id (
            verse_number,
            chapter_id,
            translation_ua,
            translation_en,
            chapter:chapters (
              id,
              chapter_number,
              title_ua,
              title_en,
              canto_id,
              canto:cantos (
                canto_number,
                book:books (
                  slug,
                  title_ua,
                  title_en,
                  has_cantos
                )
              ),
              book:books (
                slug,
                title_ua,
                title_en,
                has_cantos
              )
            )
          )
        `)
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DailyQuote[];
    },
  });

  // Створення нової цитати
  const createQuote = useMutation({
    mutationFn: async (quote: Partial<DailyQuote>) => {
      // Видаляємо nested objects перед вставкою
      const { verse, ...quoteData } = quote;
      
      const { data, error } = await supabase
        .from("daily_quotes")
        .insert(quoteData as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_quotes_admin"] });
      queryClient.invalidateQueries({ queryKey: ["daily_quote"] });
    },
  });

  // Оновлення цитати
  const updateQuote = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DailyQuote> & { id: string }) => {
      const { error } = await supabase
        .from("daily_quotes")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_quotes_admin"] });
      queryClient.invalidateQueries({ queryKey: ["daily_quote"] });
    },
  });

  // Видалення цитати
  const deleteQuote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("daily_quotes")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_quotes_admin"] });
      queryClient.invalidateQueries({ queryKey: ["daily_quote"] });
    },
  });

  // Оновлення налаштувань
  const updateSettings = useMutation({
    mutationFn: async (settings: any) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ value: settings })
        .eq("key", "verse_of_the_day");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verse_of_the_day_settings"] });
    },
  });

  return {
    quotes,
    isLoading,
    createQuote: createQuote.mutate,
    updateQuote: updateQuote.mutate,
    deleteQuote: deleteQuote.mutate,
    updateSettings: updateSettings.mutate,
  };
}
