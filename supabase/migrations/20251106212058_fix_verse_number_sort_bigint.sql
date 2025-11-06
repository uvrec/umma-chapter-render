-- Fix verse_number_sort column overflow issue
-- Change from integer to bigint to support verse numbers like "24-25"
-- Integer max: 2,147,483,647
-- Bigint max: 9,223,372,036,854,775,807

-- Drop the existing generated column
ALTER TABLE verses DROP COLUMN IF EXISTS verse_number_sort;

-- Recreate as bigint with the same formula
ALTER TABLE verses ADD COLUMN verse_number_sort bigint
  GENERATED ALWAYS AS (
    (
      (
        (regexp_replace(split_part(verse_number, '.', 1), '[^0-9]', '', 'g'))::bigint * 1000000
      )
      + (COALESCE((NULLIF(regexp_replace(split_part(verse_number, '.', 2), '[^0-9]', '', 'g'), ''))::bigint, 0) * 1000)
    )
    + COALESCE((NULLIF(regexp_replace(split_part(verse_number, '.', 3), '[^0-9]', '', 'g'), ''))::bigint, 0)
  ) STORED;

-- Recreate index for sorting performance
CREATE INDEX IF NOT EXISTS idx_verses_sort ON verses(chapter_id, verse_number_sort);

-- Add comment explaining the formula
COMMENT ON COLUMN verses.verse_number_sort IS
  'Generated column for sorting verses numerically. Formula extracts numbers from verse_number (e.g., "24-25" → 2425000000). Uses bigint to prevent overflow for large verse numbers.';
