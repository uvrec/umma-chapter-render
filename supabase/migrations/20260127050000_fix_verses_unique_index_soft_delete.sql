-- Fix verses unique index to exclude soft-deleted verses
-- This allows creating new verses with the same verse_number after soft-deleting old ones

-- ============================================================================
-- PRE-CHECK: Verify no duplicates exist among active (non-deleted) verses
-- If this fails, manually resolve duplicates before running the migration
-- ============================================================================
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT chapter_id, verse_number, COUNT(*) as cnt
    FROM public.verses
    WHERE deleted_at IS NULL
    GROUP BY chapter_id, verse_number
    HAVING COUNT(*) > 1
  ) duplicates;

  IF duplicate_count > 0 THEN
    RAISE EXCEPTION 'Found % duplicate verse(s) among active records. Run this query to find them: SELECT chapter_id, verse_number, COUNT(*) FROM verses WHERE deleted_at IS NULL GROUP BY chapter_id, verse_number HAVING COUNT(*) > 1;', duplicate_count;
  END IF;

  RAISE NOTICE 'Pre-check passed: No duplicate verses found among active records.';
END $$;

-- Drop old indexes/constraints that don't account for soft deletes
DROP INDEX IF EXISTS verses_chapter_verse_unique;
DROP INDEX IF EXISTS ux_verses_chapter_verse;

-- Also try dropping as constraint (in case it was created as UNIQUE CONSTRAINT)
ALTER TABLE public.verses DROP CONSTRAINT IF EXISTS ux_verses_chapter_verse;
ALTER TABLE public.verses DROP CONSTRAINT IF EXISTS verses_chapter_verse_unique;

-- Create new partial index that only enforces uniqueness for non-deleted verses
CREATE UNIQUE INDEX verses_chapter_verse_unique
ON public.verses (chapter_id, verse_number)
WHERE deleted_at IS NULL;
