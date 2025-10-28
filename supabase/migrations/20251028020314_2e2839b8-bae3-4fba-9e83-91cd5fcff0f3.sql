-- Remove legacy unique index causing conflicts during SCC imports
DROP INDEX IF EXISTS public.chapters_book_id_number_uidx;

-- Re-assert desired uniqueness (already added previously, but safe to ensure)
CREATE UNIQUE INDEX IF NOT EXISTS chapters_book_chapter_unique_no_canto
  ON public.chapters (book_id, chapter_number)
  WHERE canto_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS chapters_book_canto_chapter_unique
  ON public.chapters (book_id, canto_id, chapter_number)
  WHERE canto_id IS NOT NULL;