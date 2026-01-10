-- Add partial unique index for chapters with canto_id (for canto-based books)
-- This index is required for ON CONFLICT in Saranagati import
-- Note: Can't use full CONSTRAINT because there are chapters with canto_id=NULL (book-based chapters)

-- Drop old constraints/indexes if they exist
DROP INDEX IF EXISTS public.chapters_canto_chapter_unique;
ALTER TABLE public.chapters DROP CONSTRAINT IF EXISTS ux_chapters_canto_chno;
DROP INDEX IF EXISTS public.ux_chapters_canto_chno;

-- Create partial unique index for canto-based chapters only
CREATE UNIQUE INDEX IF NOT EXISTS ux_chapters_canto_chno
  ON public.chapters (canto_id, chapter_number)
  WHERE canto_id IS NOT NULL;
