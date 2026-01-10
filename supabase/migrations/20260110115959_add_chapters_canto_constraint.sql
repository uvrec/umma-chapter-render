-- Add unique constraint for chapters with canto_id
-- This constraint is required for ON CONFLICT ON CONSTRAINT in Saranagati import

-- Drop old index-based constraints if they exist (migration cleanup)
DROP INDEX IF EXISTS public.chapters_canto_chapter_unique;
DROP INDEX IF EXISTS public.ux_chapters_canto_chno;

-- Create proper unique constraint (not index) for ON CONFLICT ON CONSTRAINT to work
DO $constraint$
BEGIN
  ALTER TABLE public.chapters
    ADD CONSTRAINT ux_chapters_canto_chno UNIQUE (canto_id, chapter_number);
EXCEPTION WHEN duplicate_object THEN
  NULL; -- constraint already exists
END $constraint$;
