-- HOTFIX: Fix verse_number_sort to handle composite verses correctly
-- Problem: "263-264" was being parsed as "263264" which overflows INTEGER
-- Solution: Extract only the FIRST number from composite verses

-- Drop the existing generated column that causes overflow
ALTER TABLE verses DROP COLUMN IF EXISTS verse_number_sort;

-- Recreate with fixed formula that extracts only the first number
-- For "263-264" this will give: 263 * 1000000 = 263000000 (within BIGINT range)
-- For "48" this will give: 48 * 1000000 = 48000000
ALTER TABLE verses ADD COLUMN verse_number_sort bigint
  GENERATED ALWAYS AS (
    (
      -- Extract first number (before dash or entire number if no dash)
      (regexp_match(verse_number, '^\s*(\d+)'))[1]::bigint * 1000000
    )
    + COALESCE(
      (NULLIF(regexp_replace(split_part(verse_number, '.', 2), '[^0-9]', '', 'g'), ''))::bigint,
      0
    ) * 1000
    + COALESCE(
      (NULLIF(regexp_replace(split_part(verse_number, '.', 3), '[^0-9]', '', 'g'), ''))::bigint,
      0
    )
  ) STORED;

-- Recreate index for sorting performance
CREATE INDEX IF NOT EXISTS idx_verses_verse_number_sort ON verses(chapter_id, verse_number_sort);

COMMENT ON COLUMN verses.verse_number_sort IS
  'Generated column for sorting verses. Extracts FIRST number from verse_number (e.g., "48-49" → 48, "263-264" → 263). Used as fallback; prefer sort_key for composite verse support.';

-- Note: This column is kept for backward compatibility.
-- New code should use sort_key instead (set by the composite verse trigger).
