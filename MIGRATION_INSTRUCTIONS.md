# Інструкції по застосуванню міграції для лекцій

## Проблема

TypeScript помилки вказують, що таблиці `lectures` та `lecture_paragraphs` не існують у базі даних, хоча міграційний файл створено:

```
Argument of type '"lectures"' is not assignable to parameter of type [існуючі таблиці]
```

## Причина

Міграція `20251107000001_create_lectures_tables.sql` створена, але **НЕ застосована** до бази даних.

## Рішення

### Варіант 1: Через Supabase Dashboard (рекомендовано)

1. Відкрийте [Supabase Dashboard](https://app.supabase.com)
2. Оберіть ваш проєкт
3. Перейдіть в розділ **SQL Editor** (ліва панель)
4. Натисніть **New Query**
5. Скопіюйте вміст файлу `supabase/migrations/20251107000001_create_lectures_tables.sql`
6. Вставте в SQL Editor
7. Натисніть **Run** (або `Cmd/Ctrl + Enter`)

### Варіант 2: Через Supabase CLI

Якщо у вас встановлено Supabase CLI:

```bash
# 1. Переконайтесь, що CLI підключено до проєкту
supabase login
supabase link --project-ref [YOUR_PROJECT_REF]

# 2. Застосуйте міграції
supabase db push
```

### Варіант 3: Вручну через SQL

1. Підключіться до вашої Supabase бази даних
2. Виконайте SQL з файлу:

```bash
psql postgresql://[CONNECTION_STRING] -f supabase/migrations/20251107000001_create_lectures_tables.sql
```

## Що створює міграція

### Таблиці

1. **`public.lectures`** - метадані лекцій
   - id (UUID, PRIMARY KEY)
   - slug (TEXT, UNIQUE) - vedabase ID
   - title_en, title_uk (TEXT)
   - lecture_date (DATE)
   - location_en, location_uk (TEXT)
   - lecture_type (TEXT)
   - audio_url (TEXT, nullable)
   - book_slug, chapter_number, verse_number (nullable)
   - created_at, updated_at (TIMESTAMP)

2. **`public.lecture_paragraphs`** - параграфи лекцій
   - id (UUID, PRIMARY KEY)
   - lecture_id (UUID, FOREIGN KEY → lectures)
   - paragraph_number (INTEGER)
   - content_en, content_uk (TEXT)
   - audio_timecode (INTEGER, nullable)
   - created_at (TIMESTAMP)

### Індекси

- `idx_lectures_date` - швидкий пошук за датою
- `idx_lectures_type` - фільтрація по типу лекції
- `idx_lectures_location` - фільтрація по локації
- `idx_lectures_book` - пошук за книгою/розділом/віршем
- `idx_lecture_paragraphs_lecture_id` - швидкий доступ до параграфів

### RLS Policies

- **Public read** - всі можуть читати лекції
- **Admin write** - тільки адміністратори можуть створювати/редагувати/видаляти

### Тригери

- Автоматичне оновлення `updated_at` при зміні лекції

## Перевірка успішності міграції

### 1. Через Supabase Dashboard

Перейдіть в **Table Editor** і перевірте наявність таблиць:
- `lectures`
- `lecture_paragraphs`

### 2. Через SQL

Виконайте запит:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('lectures', 'lecture_paragraphs');
```

Має повернути 2 рядки.

### 3. Перевірка TypeScript типів

Після застосування міграції:

1. Lovable/Supabase **автоматично регенерує** типи в `src/integrations/supabase/types.ts`
2. Перезавантажте TypeScript сервер у вашій IDE
3. Помилки `Argument of type '"lectures"'` мають зникнути

Файл `types.ts` міститиме:

```typescript
export type Database = {
  public: {
    Tables: {
      // ... існуючі таблиці ...
      lectures: {
        Row: {
          id: string;
          slug: string;
          title_en: string;
          title_uk: string | null;
          // ... інші поля
        };
        Insert: { /* ... */ };
        Update: { /* ... */ };
      };
      lecture_paragraphs: {
        Row: {
          id: string;
          lecture_id: string;
          paragraph_number: number;
          content_en: string;
          content_uk: string | null;
          // ... інші поля
        };
        Insert: { /* ... */ };
        Update: { /* ... */ };
      };
    };
  };
};
```

## Після застосування міграції

### 1. Збірка проєкту

TypeScript збірка пройде успішно:

```bash
npm run build
# або
npm run dev
```

### 2. Доступ до сторінок

Сторінки стануть доступними:
- `/library/lectures` - список лекцій
- `/library/lectures/:slug` - окрема лекція
- `/admin/lecture-import` - admin панель імпорту

### 3. Імпорт тестової лекції

```bash
# Завантажити лекцію з vedabase
python tools/lectures_importer.py --slug 660307bg-new-york

# Перекласти на українську
python tools/lecture_translator.py \
    --input tools/outputs/lectures/660307bg-new-york.json

# Імпортувати через admin панель
# Відкрийте /admin/lecture-import та завантажте JSON
```

### 4. Перегляд лекції

Відкрийте `/library/lectures/660307bg-new-york` в браузері

## Troubleshooting

### Проблема: "Permission denied for table lectures"

**Рішення:** Перевірте RLS політики. Запустіть:

```sql
SELECT * FROM pg_policies WHERE tablename IN ('lectures', 'lecture_paragraphs');
```

### Проблема: "TypeScript помилки не зникли"

**Рішення:**
1. Перезапустіть TypeScript сервер у IDE
2. Закрийте і відкрийте заново проєкт
3. Видаліть `.next` або `dist` директорію та перезберіть

### Проблема: "Міграція не застосовується"

**Рішення:**
1. Перевірте права доступу до бази даних
2. Перевірте синтаксис SQL (може бути помилка в файлі)
3. Перевірте логи Supabase Dashboard в розділі **Logs**

## Наступні кроки

Після успішного застосування міграції:

1. ✅ **Імпортуйте тестові лекції** через admin панель
2. ✅ **Налаштуйте індексацію термінів** для глосарія
3. ✅ **Інтегруйте з TermHighlighter** для підсвітки санскритських слів
4. ✅ **Створіть batch-імпорт** для масового завантаження лекцій
5. ✅ **Додайте пошук** по тексту лекцій (full-text search)

## Контакти

Якщо виникли проблеми або питання:
- Перегляньте `tools/LECTURES_IMPORT_README.md`
- Перевірте логи в Supabase Dashboard
- Створіть issue в репозиторії проєкту
