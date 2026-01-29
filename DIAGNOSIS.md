# Діагностика проблеми нескінченного завантаження в секції "Бібліотека"

## Дата: 2025-11-24

## Проблема
Секція "Бібліотека" на домашній сторінці (NewHome.tsx) показує нескінченне завантаження.

## Аналіз структури проєкту

### 1. RLS Політики (Row Level Security)
**Файл**: `supabase/migrations/20250929203446_0be1dacd-2aff-4d90-b86f-c58133de65b3.sql`

```sql
CREATE POLICY "Anyone can view books"
  ON public.books FOR SELECT
  USING (true);
```

✅ **Висновок**: RLS дозволяє публічний доступ до читання books. Це НЕ причина проблеми.

### 2. Схема БД books
**Файл**: `src/integrations/supabase/types.ts`

```typescript
books: {
  Row: {
    id: string
    slug: string
    title_uk: string
    title_en: string
    is_published: boolean       // НЕ nullable!
    display_order: number | null // Може бути NULL
    cover_image_url: string | null
    // ... інші поля
  }
}
```

✅ **Висновок**: Поля існують. `is_published` не nullable, `display_order` може бути NULL.

### 3. Порівняння робочих та не робочих компонентів

#### Library.tsx (✅ Працює):
```typescript
const { data: books = [], isLoading } = useQuery({
  queryKey: ['books'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('books')
      .select('id, slug, title_uk, title_en, cover_image_url, has_cantos')
      .eq('is_published', true)
      .order('display_order');
    if (error) throw error;
    return data;
  },
});
```

#### NewHome.tsx FeaturedBooks (❌ Не працює):
```typescript
const { data: books = [], isLoading } = useQuery({
  queryKey: ["featured-books"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("books")
      .select("id, slug, title_uk, title_en, cover_image_url")
      .eq("is_published", true)
      .order("display_order")
      .limit(4);
    if (error) throw error;
    return data;
  }
});
```

**Різниця**:
- `queryKey`: `'books'` vs `'featured-books'` (не критично)
- `.limit(4)` додано в NewHome (не повинно ламати)
- `has_cantos` поле відсутнє в NewHome (не критично)

## Можливі причини

### 1. ❓ Немає книг з `is_published = true`
Якщо в БД немає жодної книги з `is_published = true`, запит поверне порожній масив, але `isLoading` має стати `false`.

### 2. ❓ Проблема з `display_order = NULL`
Якщо всі книги мають `display_order = NULL`, сортування може працювати некоректно. Але це також не повинно призводити до нескінченного завантаження.

### 3. ❓ React Query не завершує запит
Можливо запит падає з помилкою, але без обробки `isError` ми цього не бачимо.

### 4. ❓ Відсутність обробки помилок
NewHome.tsx не обробляє стан `isError`, тому якщо запит падає - користувач бачить нескінченне завантаження.

## Рекомендації

### 1. Додати обробку помилок (КРИТИЧНО)
```typescript
const {
  data: books = [],
  isLoading,
  isError,
  error
} = useQuery({
  queryKey: ["featured-books"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("books")
      .select("id, slug, title_uk, title_en, cover_image_url")
      .eq("is_published", true)
      .order("display_order", { ascending: true, nullsFirst: false })
      .limit(4);

    if (error) {
      console.error("Failed to fetch featured books:", error);
      throw error;
    }

    console.log("Fetched books:", data);
    return data || [];
  }
});

// Додати обробку помилки
if (isError) {
  return <ErrorMessage error={error} />;
}

// Додати обробку порожнього стану
if (!isLoading && books.length === 0) {
  return <EmptyState />;
}
```

### 2. Покращити сортування
Додати `nullsFirst: false` щоб книги з NULL display_order йшли в кінець:
```typescript
.order("display_order", { ascending: true, nullsFirst: false })
```

### 3. Додати логування для діагностики
```typescript
console.log("Fetched books:", data);
console.error("Failed to fetch featured books:", error);
```

### 4. Перевірити дані в БД
Виконати SQL запит:
```sql
SELECT id, slug, title_uk, is_published, display_order
FROM books
WHERE is_published = true
ORDER BY display_order NULLS LAST
LIMIT 4;
```

## Наступні кроки

1. ✅ Аналіз структури проєкту - завершено
2. ✅ Порівняння з робочими компонентами - завершено
3. ✅ Перевірка RLS політик - завершено
4. ⏳ Виправлення коду з обробкою помилок
5. ⏳ Тестування та перевірка результату
