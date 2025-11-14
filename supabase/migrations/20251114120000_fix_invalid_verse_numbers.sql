-- Migration: Fix invalid verse numbers with format "N.N.XXX" → "XXX"
-- Created: 2025-11-14
-- Description: Normalizes verse numbers that have prefixes like "1.1.73-74" to just "73-74"

-- ============================================================================
-- STEP 1: Fix verse numbers with incorrect format "N.N.XXX" → "XXX"
-- ============================================================================

DO $$
DECLARE
  affected_count INTEGER;
BEGIN
  -- Update verses with format "1.1.73-74" → "73-74"
  -- Pattern: starts with digits.digits. followed by digits and optionally -digits
  UPDATE verses
  SET verse_number = regexp_replace(verse_number, '^\d+\.\d+\.', '')
  WHERE verse_number ~ '^\d+\.\d+\.\d+(-\d+)?$';

  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RAISE NOTICE 'Fixed % verses with invalid number format', affected_count;

  -- Log the changes
  IF affected_count > 0 THEN
    RAISE NOTICE 'Examples of fixed verse numbers:';
    RAISE NOTICE '  "1.1.73-74" → "73-74"';
    RAISE NOTICE '  "2.17.48-49" → "48-49"';
  END IF;
END $$;

-- ============================================================================
-- STEP 2: Delete empty duplicate verses
-- ============================================================================

-- Delete verses that:
-- 1. Have no translation (neither UA nor EN)
-- 2. Are simple verses (not composite, e.g., "74" not "73-74")
-- 3. Are part of a composite verse (e.g., "74" exists when "73-74" also exists)

DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM verses v
  WHERE
    -- Only delete verses without any translation
    (v.translation_ua IS NULL OR v.translation_ua = '')
    AND (v.translation_en IS NULL OR v.translation_en = '')
    -- Only simple verses (single number)
    AND v.verse_number ~ '^\d+$'
    -- Must be part of a composite verse
    AND EXISTS (
      SELECT 1 FROM verses v2
      WHERE v2.chapter_id = v.chapter_id
      AND v2.is_composite = true
      AND v.verse_number::integer BETWEEN v2.start_verse AND v2.end_verse
    );

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % empty duplicate verses', deleted_count;
END $$;

-- ============================================================================
-- STEP 3: Add constraint to prevent future invalid verse numbers
-- ============================================================================

-- Add CHECK constraint to prevent verse numbers with format "N.N.XXX"
ALTER TABLE verses
DROP CONSTRAINT IF EXISTS verse_number_format_check;

ALTER TABLE verses
ADD CONSTRAINT verse_number_format_check
CHECK (verse_number !~ '^\d+\.\d+\.');

COMMENT ON CONSTRAINT verse_number_format_check ON verses IS
  'Prevents verse numbers with invalid format like "1.1.73-74".
   Valid formats: "1", "73-74", "108-109".
   Invalid formats: "1.1.73", "2.17.48-49"';

-- ============================================================================
-- STEP 4: Verify the fix
-- ============================================================================

DO $$
DECLARE
  remaining_invalid INTEGER;
BEGIN
  SELECT COUNT(*) INTO remaining_invalid
  FROM verses
  WHERE verse_number ~ '^\d+\.\d+\.';

  IF remaining_invalid > 0 THEN
    RAISE WARNING 'Still have % verses with invalid format!', remaining_invalid;
  ELSE
    RAISE NOTICE 'All verse numbers are now valid ✓';
  END IF;
END $$;
