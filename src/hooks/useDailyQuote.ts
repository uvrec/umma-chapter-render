// src/hooks/useDailyQuote.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export type DailyQuote = {
  id: string;
  quote_type: 'verse' | 'custom';
  
  verse_id?: string;
  verse?: {
    verse_number: string;
    sanskrit_ua?: string;
    transliteration_ua?: string;
    translation_ua?: string;
    translation_en?: string;
    chapter?: {
      chapter_number: number;
      title_ua: string;
      title_en?: string;
      book?: {
        slug: string;
        title_ua: string;
        title_en?: string;
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

  // Завантажуємо поточну цитату
  const { data: quote, isLoading, error } = useQuery({
    queryKey: ["daily_quote", settings?.rotation_mode, settings?.current_index],
    queryFn: async () => {
      console.log('[DailyQuote] Завантаження цитати, settings:', settings);

      if (!settings?.enabled) {
        console.warn('[DailyQuote] Цитати вимкнено в налаштуваннях');
        return null;
      }

      try {
        let query = supabase
          .from("daily_quotes")
          .select(`
            *,
            verse:verses!verse_id (
              verse_number,
              sanskrit_ua,
              transliteration_ua,
              translation_ua,
              translation_en,
              chapter:chapters (
                chapter_number,
                title_ua,
                title_en,
                book:books (
                  slug,
                  title_ua,
                  title_en
                )
              )
            )
          `)
          .eq("is_active", true)
          .order("priority", { ascending: false })
          .order("last_displayed_at", { ascending: true, nullsFirst: true });

        // Застосовуємо режим ротації
        if (settings.rotation_mode === 'random') {
          // Випадковий вибір серед топ-10 з найвищим пріоритетом
          query = query.limit(10);
          const { data, error } = await query;
          if (error) {
            console.error('[DailyQuote] Помилка завантаження цитат (random):', error);
            return null; // Повертаємо null замість throw для більшої стійкості
          }
          if (!data || data.length === 0) {
            console.warn('[DailyQuote] Не знайдено активних цитат');
            return null;
          }

          const randomIndex = Math.floor(Math.random() * data.length);
          console.log('[DailyQuote] Вибрано випадкову цитату:', data[randomIndex]);
          return data[randomIndex] as DailyQuote;
        } else {
          // Sequential або custom - беремо першу
          const { data, error } = await query.limit(1).single();
          if (error) {
            if (error.code === 'PGRST116') {
              console.warn('[DailyQuote] Не знайдено жодної цитати');
              return null;
            }
            console.error('[DailyQuote] Помилка завантаження цитати (sequential):', error);
            return null; // Повертаємо null замість throw
          }
          console.log('[DailyQuote] Завантажено цитату (sequential):', data);
          return data as DailyQuote | null;
        }
      } catch (err) {
        console.error('[DailyQuote] Неочікувана помилка:', err);
        return null;
      }
    },
    enabled: !!settings,
    retry: false, // Не повторюємо запит при помилці
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
    text: language === 'ua'
      ? (quote.quote_type === 'verse' ? quote.verse?.translation_ua : quote.quote_ua)
      : (quote.quote_type === 'verse' ? quote.verse?.translation_en : quote.quote_en),

    author: language === 'ua' ? quote.author_ua : quote.author_en,

    source: quote.quote_type === 'verse'
      ? `${quote.verse?.chapter?.book?.[language === 'ua' ? 'title_ua' : 'title_en']} ${quote.verse?.chapter?.chapter_number}.${quote.verse?.verse_number}`
      : (language === 'ua' ? quote.source_ua : quote.source_en),

    verseNumber: quote.quote_type === 'verse' ? quote.verse?.verse_number : null,
    sanskrit: quote.quote_type === 'verse' ? quote.verse?.sanskrit_ua : null,
    transliteration: quote.quote_type === 'verse' ? quote.verse?.transliteration_ua : null,

    link: quote.quote_type === 'verse' && quote.verse?.chapter?.book
      ? `/veda-reader/${quote.verse.chapter.book.slug}/chapter/${quote.verse.chapter.chapter_number}#verse-${quote.verse.verse_number}`
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
            translation_ua,
            translation_en,
            chapter:chapters (
              chapter_number,
              title_ua,
              title_en,
              book:books (
                slug,
                title_ua,
                title_en
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
