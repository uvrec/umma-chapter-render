-- Fix chapters uniqueness to be per-canto (or per-book when no canto)
-- 1) Drop old unique constraint that enforced (book_id, chapter_number)
ALTER TABLE public.chapters DROP CONSTRAINT IF EXISTS chapters_book_id_chapter_number_key;

-- 2) Ensure unique per book when canto is NULL (books without cantos)
CREATE UNIQUE INDEX IF NOT EXISTS chapters_book_chapter_unique_no_canto
  ON public.chapters (book_id, chapter_number)
  WHERE canto_id IS NULL;

-- 3) Ensure unique per canto when canto is present (multi-canto books)
CREATE UNIQUE INDEX IF NOT EXISTS chapters_book_canto_chapter_unique
  ON public.chapters (book_id, canto_id, chapter_number)
  WHERE canto_id IS NOT NULL;
