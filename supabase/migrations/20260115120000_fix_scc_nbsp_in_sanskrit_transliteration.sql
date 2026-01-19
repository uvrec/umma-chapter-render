-- Migration: Fix &nbsp; remnants in sanskrit and transliteration fields
-- Date: 2026-01-15
-- Description: Clean &nbsp; HTML entities from sanskrit/bengali and transliteration fields
-- These show as literal "&nbsp;" text in the SCC (Chaitanya Charitamrita) verses

-- =========================================
-- STEP 1: Extended diagnostic function for sanskrit/transliteration
-- =========================================

CREATE OR REPLACE FUNCTION find_nbsp_in_verse_text()
RETURNS TABLE (
  column_name TEXT,
  affected_count BIGINT,
  sample_id UUID,
  sample_verse_number TEXT,
  sample_text TEXT
) AS $$
BEGIN
  -- Check sanskrit_uk field
  RETURN QUERY
  SELECT
    'sanskrit_uk'::TEXT as column_name,
    COUNT(*)::BIGINT as affected_count,
    (ARRAY_AGG(v.id))[1] as sample_id,
    (ARRAY_AGG(v.verse_number))[1]::TEXT as sample_verse_number,
    LEFT((ARRAY_AGG(v.sanskrit_uk))[1], 200) as sample_text
  FROM verses v
  WHERE v.sanskrit_uk LIKE '%&nbsp;%'
  HAVING COUNT(*) > 0;

  -- Check sanskrit_en field
  RETURN QUERY
  SELECT
    'sanskrit_en'::TEXT as column_name,
    COUNT(*)::BIGINT as affected_count,
    (ARRAY_AGG(v.id))[1] as sample_id,
    (ARRAY_AGG(v.verse_number))[1]::TEXT as sample_verse_number,
    LEFT((ARRAY_AGG(v.sanskrit_en))[1], 200) as sample_text
  FROM verses v
  WHERE v.sanskrit_en LIKE '%&nbsp;%'
  HAVING COUNT(*) > 0;

  -- Check transliteration_en field
  RETURN QUERY
  SELECT
    'transliteration_en'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(v.id))[1],
    (ARRAY_AGG(v.verse_number))[1]::TEXT,
    LEFT((ARRAY_AGG(v.transliteration_en))[1], 200)
  FROM verses v
  WHERE v.transliteration_en LIKE '%&nbsp;%'
  HAVING COUNT(*) > 0;

  -- Check transliteration_uk field
  RETURN QUERY
  SELECT
    'transliteration_uk'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(v.id))[1],
    (ARRAY_AGG(v.verse_number))[1]::TEXT,
    LEFT((ARRAY_AGG(v.transliteration_uk))[1], 200)
  FROM verses v
  WHERE v.transliteration_uk LIKE '%&nbsp;%'
  HAVING COUNT(*) > 0;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION find_nbsp_in_verse_text() TO authenticated;

-- =========================================
-- STEP 2: Fix function for sanskrit/transliteration
-- =========================================

CREATE OR REPLACE FUNCTION fix_nbsp_in_verse_text()
RETURNS TABLE (
  column_name TEXT,
  fixed_count BIGINT
) AS $$
DECLARE
  fixed_count_var BIGINT;
BEGIN
  -- Create backup table if not exists
  CREATE TABLE IF NOT EXISTS nbsp_cleanup_backup (
    id UUID,
    column_name TEXT,
    original_value TEXT,
    cleaned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, column_name)
  );

  -- =========================================
  -- Fix sanskrit_uk field
  -- =========================================

  -- Backup
  INSERT INTO nbsp_cleanup_backup (id, column_name, original_value)
  SELECT id, 'sanskrit_uk', sanskrit_uk
  FROM verses
  WHERE sanskrit_uk LIKE '%&nbsp;%'
  ON CONFLICT DO NOTHING;

  -- Fix: replace &nbsp; with regular space
  UPDATE verses
  SET sanskrit_uk = REPLACE(sanskrit_uk, '&nbsp;', ' ')
  WHERE sanskrit_uk LIKE '%&nbsp;%';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'sanskrit_uk'::TEXT, fixed_count_var;
  END IF;

  -- =========================================
  -- Fix sanskrit_en field
  -- =========================================

  -- Backup
  INSERT INTO nbsp_cleanup_backup (id, column_name, original_value)
  SELECT id, 'sanskrit_en', sanskrit_en
  FROM verses
  WHERE sanskrit_en LIKE '%&nbsp;%'
  ON CONFLICT DO NOTHING;

  -- Fix: replace &nbsp; with regular space
  UPDATE verses
  SET sanskrit_en = REPLACE(sanskrit_en, '&nbsp;', ' ')
  WHERE sanskrit_en LIKE '%&nbsp;%';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'sanskrit_en'::TEXT, fixed_count_var;
  END IF;

  -- =========================================
  -- Fix transliteration_en field
  -- =========================================

  -- Backup
  INSERT INTO nbsp_cleanup_backup (id, column_name, original_value)
  SELECT id, 'transliteration_en', transliteration_en
  FROM verses
  WHERE transliteration_en LIKE '%&nbsp;%'
  ON CONFLICT DO NOTHING;

  -- Fix: replace &nbsp; with regular space
  UPDATE verses
  SET transliteration_en = REPLACE(transliteration_en, '&nbsp;', ' ')
  WHERE transliteration_en LIKE '%&nbsp;%';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'transliteration_en'::TEXT, fixed_count_var;
  END IF;

  -- =========================================
  -- Fix transliteration_uk field
  -- =========================================

  -- Backup
  INSERT INTO nbsp_cleanup_backup (id, column_name, original_value)
  SELECT id, 'transliteration_uk', transliteration_uk
  FROM verses
  WHERE transliteration_uk LIKE '%&nbsp;%'
  ON CONFLICT DO NOTHING;

  -- Fix: replace &nbsp; with regular space
  UPDATE verses
  SET transliteration_uk = REPLACE(transliteration_uk, '&nbsp;', ' ')
  WHERE transliteration_uk LIKE '%&nbsp;%';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'transliteration_uk'::TEXT, fixed_count_var;
  END IF;

  -- Clean up multiple consecutive spaces
  UPDATE verses
  SET sanskrit_uk = REGEXP_REPLACE(sanskrit_uk, ' {2,}', ' ', 'g')
  WHERE sanskrit_uk ~ ' {2,}';

  UPDATE verses
  SET sanskrit_en = REGEXP_REPLACE(sanskrit_en, ' {2,}', ' ', 'g')
  WHERE sanskrit_en ~ ' {2,}';

  UPDATE verses
  SET transliteration_en = REGEXP_REPLACE(transliteration_en, ' {2,}', ' ', 'g')
  WHERE transliteration_en ~ ' {2,}';

  UPDATE verses
  SET transliteration_uk = REGEXP_REPLACE(transliteration_uk, ' {2,}', ' ', 'g')
  WHERE transliteration_uk ~ ' {2,}';

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION fix_nbsp_in_verse_text() TO authenticated;

-- =========================================
-- STEP 3: Run diagnostic
-- =========================================

DO $$
DECLARE
  rec RECORD;
  total_found INTEGER := 0;
BEGIN
  RAISE NOTICE '=== &nbsp; Remnants in Verse Text Diagnostic ===';

  FOR rec IN SELECT * FROM find_nbsp_in_verse_text() LOOP
    RAISE NOTICE 'Column: %, Count: %, Sample verse: %, Text: %',
      rec.column_name, rec.affected_count, rec.sample_verse_number, LEFT(rec.sample_text, 100);
    total_found := total_found + rec.affected_count;
  END LOOP;

  IF total_found = 0 THEN
    RAISE NOTICE 'No &nbsp; remnants found in sanskrit/transliteration fields!';
  ELSE
    RAISE NOTICE 'Total affected records: %', total_found;
    RAISE NOTICE 'Run: SELECT * FROM fix_nbsp_in_verse_text() to fix these issues';
  END IF;
END $$;

-- =========================================
-- STEP 4: Auto-fix the issues
-- =========================================

DO $$
DECLARE
  rec RECORD;
  total_fixed INTEGER := 0;
BEGIN
  RAISE NOTICE '=== Fixing &nbsp; remnants in verse text ===';

  FOR rec IN SELECT * FROM fix_nbsp_in_verse_text() LOOP
    RAISE NOTICE 'Fixed %: % records', rec.column_name, rec.fixed_count;
    total_fixed := total_fixed + rec.fixed_count;
  END LOOP;

  IF total_fixed = 0 THEN
    RAISE NOTICE 'No records needed fixing.';
  ELSE
    RAISE NOTICE 'Total fixed records: %', total_fixed;
  END IF;
END $$;
