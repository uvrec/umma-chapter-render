-- ==========================================================
-- Розширення таблиці highlights для підтримки листів та лекцій
-- ==========================================================
-- Раніше highlights працювали тільки з книгами (book_id + chapter_id NOT NULL).
-- Тепер додаємо letter_id та lecture_id, а book_id/chapter_id стають nullable,
-- щоб хайлайти можна було створювати у листах та лекціях.

-- 1. Додати нові колонки
ALTER TABLE public.highlights
  ADD COLUMN IF NOT EXISTS letter_id UUID REFERENCES public.letters(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE;

-- 2. Зробити book_id та chapter_id nullable (раніше NOT NULL)
ALTER TABLE public.highlights
  ALTER COLUMN book_id DROP NOT NULL,
  ALTER COLUMN chapter_id DROP NOT NULL;

-- 3. Constraint: хоча б одне джерело має бути вказане
-- (book_id/chapter_id для книг, letter_id для листів, lecture_id для лекцій)
ALTER TABLE public.highlights
  ADD CONSTRAINT highlights_source_check CHECK (
    book_id IS NOT NULL OR letter_id IS NOT NULL OR lecture_id IS NOT NULL
  );

-- 4. Індекси для нових колонок
CREATE INDEX IF NOT EXISTS idx_highlights_letter_id ON public.highlights(letter_id);
CREATE INDEX IF NOT EXISTS idx_highlights_lecture_id ON public.highlights(lecture_id);
