
# План: Додати підтримку Preview Tokens до VedaReaderDB

## Проблема

Компонент `VedaReaderDB.tsx` — основний reader для віршів — не підтримує preview tokens. Він робить прямі запити до таблиць `books`, `cantos`, `chapters`, `verses` через Supabase client. RLS політики блокують неопублікований контент, тому користувачі з валідним preview token бачать порожні сторінки.

### Поточний стан підтримки preview tokens

| Компонент | Підтримка | Статус |
|-----------|-----------|--------|
| BookOverview.tsx | RPC функції | OK |
| CantoOverview.tsx | RPC функції | OK |
| ChapterVersesList.tsx | RPC функції | OK |
| **VedaReaderDB.tsx** | Прямі запити | НЕ ПРАЦЮЄ |

## Рішення

Замінити прямі запити до таблиць на RPC функції з підтримкою preview tokens (вже існують у БД):

| Запит | Поточний метод | Новий метод |
|-------|---------------|-------------|
| Book | `supabase.from("books")` | `get_book_with_preview` |
| Canto | `supabase.from("cantos")` | `get_canto_by_number_with_preview` |
| Chapter | `supabase.from("chapters")` | `get_chapter_by_number_with_preview` |
| Verses | `supabase.from("verses")` | `get_verses_by_chapter_with_preview` |
| All Chapters | `supabase.from("chapters")` | `get_chapters_by_canto_with_preview` |

## Зміни у файлах

### 1. src/components/VedaReaderDB.tsx

#### 1.1 Додати імпорт useSearchParams
```tsx
// Рядок 5
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
```

#### 1.2 Отримати preview token з URL
```tsx
// Після рядка ~78 (після isMobile)
const [searchParams] = useSearchParams();
const previewToken = searchParams.get('preview');
```

#### 1.3 Замінити запит для Book (рядки 173-187)
```tsx
const { data: book } = useQuery({
  queryKey: ["book", bookId, previewToken],
  staleTime: 60_000,
  enabled: !!bookId,
  queryFn: async () => {
    const { data, error } = await (supabase.rpc as any)("get_book_with_preview", {
      p_book_slug: bookId,
      p_token: previewToken
    });
    if (error) {
      console.error('RPC get_book_with_preview error:', error);
      // Fallback для published books
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("books")
        .select("id, slug, title_uk, title_en, has_cantos")
        .eq("slug", bookId)
        .maybeSingle();
      if (fallbackError) throw fallbackError;
      return fallbackData;
    }
    return data && data.length > 0 ? data[0] : null;
  }
});
```

#### 1.4 Замінити запит для Canto (рядки 189-206)
```tsx
const { data: canto, isLoading: isLoadingCanto } = useQuery({
  queryKey: ["canto", book?.id, cantoNumber, previewToken],
  staleTime: 60_000,
  enabled: isCantoMode && !!book?.id && !!cantoNumber,
  queryFn: async () => {
    if (!book?.id || !cantoNumber) return null;
    const { data, error } = await (supabase.rpc as any)("get_canto_by_number_with_preview", {
      p_book_id: book.id,
      p_canto_number: parseInt(cantoNumber),
      p_token: previewToken
    });
    if (error) {
      console.error('RPC get_canto_by_number_with_preview error:', error);
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("cantos")
        .select("id, canto_number, title_uk, title_en")
        .eq("book_id", book.id)
        .eq("canto_number", parseInt(cantoNumber))
        .maybeSingle();
      if (fallbackError) throw fallbackError;
      return fallbackData;
    }
    return data && data.length > 0 ? data[0] : null;
  }
});
```

#### 1.5 Замінити запит для Chapter (рядки 208-227)
```tsx
const { data: chapter, isLoading: isLoadingChapter } = useQuery({
  queryKey: ["chapter", book?.id, canto?.id, effectiveChapterParam, isCantoMode, previewToken],
  staleTime: 60_000,
  enabled: !!effectiveChapterParam && (isCantoMode ? !!canto?.id : !!book?.id),
  queryFn: async () => {
    if (!book?.id || !effectiveChapterParam) return null;
    const { data, error } = await (supabase.rpc as any)("get_chapter_by_number_with_preview", {
      p_book_id: book.id,
      p_canto_id: isCantoMode && canto?.id ? canto.id : null,
      p_chapter_number: parseInt(effectiveChapterParam),
      p_token: previewToken
    });
    if (error) {
      console.error('RPC get_chapter_by_number_with_preview error:', error);
      const base = supabase.from("chapters").select("*").eq("chapter_number", parseInt(effectiveChapterParam));
      const query = isCantoMode && canto?.id ? base.eq("canto_id", canto.id) : base.eq("book_id", book.id);
      const { data: fallbackData, error: fallbackError } = await query.maybeSingle();
      if (fallbackError) throw fallbackError;
      return fallbackData;
    }
    return data && data.length > 0 ? data[0] : null;
  }
});
```

#### 1.6 Замінити запит для Fallback Chapter (рядки 229-247)
```tsx
const { data: fallbackChapter } = useQuery({
  queryKey: ["fallback-chapter", book?.id, effectiveChapterParam, previewToken],
  staleTime: 60_000,
  enabled: !!book?.id && !!effectiveChapterParam && (!isCantoMode || (!isLoadingCanto && !canto?.id)),
  queryFn: async () => {
    if (!book?.id || !effectiveChapterParam) return null;
    const { data, error } = await (supabase.rpc as any)("get_chapter_by_number_with_preview", {
      p_book_id: book.id,
      p_canto_id: null,
      p_chapter_number: parseInt(effectiveChapterParam),
      p_token: previewToken
    });
    if (error) {
      console.error('RPC get_chapter_by_number_with_preview fallback error:', error);
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("chapters")
        .select("*")
        .eq("book_id", book.id)
        .eq("chapter_number", parseInt(effectiveChapterParam))
        .is("canto_id", null)
        .maybeSingle();
      if (fallbackError) throw fallbackError;
      return fallbackData;
    }
    return data && data.length > 0 ? data[0] : null;
  }
});
```

#### 1.7 Замінити запит для Verses Main (рядки 249-281)
```tsx
const { data: versesMain = [], isLoading: isLoadingVersesMain } = useQuery({
  queryKey: ["verses", chapter?.id, previewToken],
  enabled: !!chapter?.id,
  queryFn: async () => {
    if (!chapter?.id) return [] as any[];
    const { data, error } = await (supabase.rpc as any)("get_verses_by_chapter_with_preview", {
      p_chapter_id: chapter.id,
      p_token: previewToken
    });
    if (error) {
      console.error('RPC get_verses_by_chapter_with_preview error:', error);
      // Fallback для published verses
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("verses")
        .select(`*, is_composite, start_verse, end_verse, verse_count, sort_key,
          verse_lyrics (lrc_content, timestamps, language, sync_type, audio_type)`)
        .eq("chapter_id", chapter.id)
        .is("deleted_at", null)
        .order("sort_key", { ascending: true });
      if (fallbackError) throw fallbackError;
      return (fallbackData || []) as any[];
    }
    return (data || []) as any[];
  }
});
```

Аналогічно для `versesFallback`.

#### 1.8 Замінити запит для All Chapters (рядки 401-418)
```tsx
const { data: allChapters = [] } = useQuery({
  queryKey: isCantoMode 
    ? ["all-chapters-canto", canto?.id, previewToken] 
    : ["all-chapters-book", book?.id, previewToken],
  staleTime: 60_000,
  enabled: isCantoMode ? !!canto?.id : !!book?.id,
  queryFn: async () => {
    if (isCantoMode && canto?.id) {
      const { data, error } = await (supabase.rpc as any)("get_chapters_by_canto_with_preview", {
        p_canto_id: canto.id,
        p_token: previewToken
      });
      if (error) {
        console.error('RPC get_chapters_by_canto_with_preview error:', error);
        const { data: fallbackData } = await supabase
          .from("chapters")
          .select("id, chapter_number, title_uk, title_en")
          .eq("canto_id", canto.id)
          .order("chapter_number");
        return fallbackData || [];
      }
      return data || [];
    } else if (book?.id) {
      // Для книг без canto — використовуємо прямий запит
      const { data, error } = await supabase
        .from("chapters")
        .select("id, chapter_number, title_uk, title_en")
        .eq("book_id", book.id)
        .order("chapter_number");
      if (error) throw error;
      return data || [];
    }
    return [];
  }
});
```

## Важлива примітка про verse_lyrics

RPC функція `get_verses_by_chapter_with_preview` повертає дані з таблиці `verses`, але не робить JOIN з `verse_lyrics`. Після впровадження preview tokens, якщо потрібна підтримка аудіо-синхронізації для неопублікованих віршів, необхідно буде або:
1. Розширити RPC функцію для включення verse_lyrics
2. Зробити окремий запит для verse_lyrics після отримання verses

Для MVP можна залишити fallback на прямий запит для published verses, який включає verse_lyrics.

## Тестування

1. Створити preview token для неопублікованої глави
2. Відкрити URL з токеном: `/uk/lib/{book}/{chapter}/{verse}?preview={token}`
3. Перевірити що вірші відображаються
4. Перевірити навігацію між віршами
5. Перевірити що без токену сторінка показує "не знайдено"
