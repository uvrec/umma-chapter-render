-- ============================================================================
-- ВИПРАВЛЕННЯ: Додаємо is_published до таблиці chapters
-- ============================================================================
-- Проблема: Функції пошуку (search_verses_fulltext, unified_search, etc.)
-- фільтрують по ch.is_published = true, але стовпець не існує в таблиці chapters.
-- Це викликає помилку бази даних і пошук повертає "Нічого не знайдено".
-- ============================================================================

-- Додаємо стовпець is_published до chapters з default true
-- (всі існуючі глави стають опублікованими)
ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Встановлюємо is_published = true для всіх існуючих глав
UPDATE public.chapters SET is_published = true WHERE is_published IS NULL;

-- Створюємо індекс для оптимізації запитів
CREATE INDEX IF NOT EXISTS idx_chapters_is_published
  ON public.chapters (is_published)
  WHERE is_published = true;

-- Коментар до стовпця
COMMENT ON COLUMN public.chapters.is_published IS 'Чи опублікована глава для відображення в пошуку та на сайті';
