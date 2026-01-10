-- Add unique constraint for chapters with canto_id (no book_id)
-- This constraint is required for ON CONFLICT in Saranagati import

-- Drop the old index-based constraint if it exists (migration cleanup)
DROP INDEX IF EXISTS public.chapters_canto_chapter_unique;

-- Create the named unique index that can be referenced in ON CONFLICT
CREATE UNIQUE INDEX IF NOT EXISTS ux_chapters_canto_chno
  ON public.chapters (canto_id, chapter_number)
  WHERE book_id IS NULL;
