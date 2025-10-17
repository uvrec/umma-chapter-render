-- Deduplicate existing verses by (chapter_id, verse_number)
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY chapter_id, verse_number
           ORDER BY created_at NULLS FIRST, id
         ) AS rn
  FROM public.verses
)
DELETE FROM public.verses v
USING ranked r
WHERE v.id = r.id
  AND r.rn > 1;

-- Add unique constraint to prevent future duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'verses_unique_chapter_verse'
  ) THEN
    ALTER TABLE public.verses
      ADD CONSTRAINT verses_unique_chapter_verse UNIQUE (chapter_id, verse_number);
  END IF;
END $$;