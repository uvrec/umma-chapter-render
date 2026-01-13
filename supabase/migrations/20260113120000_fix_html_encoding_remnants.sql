-- Migration: Fix HTML encoding remnants in verses table
-- Date: 2026-01-13
-- Description: Clean HTML entities that were double-encoded (&lt;p&gt; instead of <p>)
-- These show as visible <p> tags in edit mode while rendering correctly in view mode

-- =========================================
-- STEP 1: DIAGNOSTIC FUNCTION - Find all encoded HTML remnants
-- =========================================

CREATE OR REPLACE FUNCTION find_html_encoding_remnants()
RETURNS TABLE (
  table_name TEXT,
  column_name TEXT,
  affected_count BIGINT,
  sample_id UUID,
  sample_verse_number TEXT,
  sample_text TEXT
) AS $$
BEGIN
  -- Check verses table for encoded HTML entities
  RETURN QUERY
  SELECT
    'verses'::TEXT as table_name,
    'synonyms_ua'::TEXT as column_name,
    COUNT(*)::BIGINT as affected_count,
    (ARRAY_AGG(v.id))[1] as sample_id,
    (ARRAY_AGG(v.verse_number))[1]::TEXT as sample_verse_number,
    LEFT((ARRAY_AGG(v.synonyms_ua))[1], 200) as sample_text
  FROM verses v
  WHERE v.synonyms_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  HAVING COUNT(*) > 0;

  RETURN QUERY
  SELECT
    'verses'::TEXT,
    'synonyms_en'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(v.id))[1],
    (ARRAY_AGG(v.verse_number))[1]::TEXT,
    LEFT((ARRAY_AGG(v.synonyms_en))[1], 200)
  FROM verses v
  WHERE v.synonyms_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  HAVING COUNT(*) > 0;

  RETURN QUERY
  SELECT
    'verses'::TEXT,
    'translation_ua'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(v.id))[1],
    (ARRAY_AGG(v.verse_number))[1]::TEXT,
    LEFT((ARRAY_AGG(v.translation_ua))[1], 200)
  FROM verses v
  WHERE v.translation_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  HAVING COUNT(*) > 0;

  RETURN QUERY
  SELECT
    'verses'::TEXT,
    'translation_en'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(v.id))[1],
    (ARRAY_AGG(v.verse_number))[1]::TEXT,
    LEFT((ARRAY_AGG(v.translation_en))[1], 200)
  FROM verses v
  WHERE v.translation_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  HAVING COUNT(*) > 0;

  RETURN QUERY
  SELECT
    'verses'::TEXT,
    'commentary_ua'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(v.id))[1],
    (ARRAY_AGG(v.verse_number))[1]::TEXT,
    LEFT((ARRAY_AGG(v.commentary_ua))[1], 200)
  FROM verses v
  WHERE v.commentary_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  HAVING COUNT(*) > 0;

  RETURN QUERY
  SELECT
    'verses'::TEXT,
    'commentary_en'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(v.id))[1],
    (ARRAY_AGG(v.verse_number))[1]::TEXT,
    LEFT((ARRAY_AGG(v.commentary_en))[1], 200)
  FROM verses v
  WHERE v.commentary_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  HAVING COUNT(*) > 0;

  -- Check chapters table
  RETURN QUERY
  SELECT
    'chapters'::TEXT,
    'content_ua'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(c.id))[1],
    (ARRAY_AGG(c.chapter_number::TEXT))[1],
    LEFT((ARRAY_AGG(c.content_ua))[1], 200)
  FROM chapters c
  WHERE c.content_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  HAVING COUNT(*) > 0;

  RETURN QUERY
  SELECT
    'chapters'::TEXT,
    'content_en'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(c.id))[1],
    (ARRAY_AGG(c.chapter_number::TEXT))[1],
    LEFT((ARRAY_AGG(c.content_en))[1], 200)
  FROM chapters c
  WHERE c.content_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  HAVING COUNT(*) > 0;

  -- Check intro_chapters table
  RETURN QUERY
  SELECT
    'intro_chapters'::TEXT,
    'content_ua'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(ic.id))[1],
    (ARRAY_AGG(ic.title_ua))[1],
    LEFT((ARRAY_AGG(ic.content_ua))[1], 200)
  FROM intro_chapters ic
  WHERE ic.content_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  HAVING COUNT(*) > 0;

  RETURN QUERY
  SELECT
    'intro_chapters'::TEXT,
    'content_en'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(ic.id))[1],
    (ARRAY_AGG(ic.title_en))[1],
    LEFT((ARRAY_AGG(ic.content_en))[1], 200)
  FROM intro_chapters ic
  WHERE ic.content_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  HAVING COUNT(*) > 0;

  -- Check blog_posts table
  RETURN QUERY
  SELECT
    'blog_posts'::TEXT,
    'content_ua'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(bp.id))[1],
    (ARRAY_AGG(bp.title_ua))[1],
    LEFT((ARRAY_AGG(bp.content_ua))[1], 200)
  FROM blog_posts bp
  WHERE bp.content_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  HAVING COUNT(*) > 0;

  RETURN QUERY
  SELECT
    'blog_posts'::TEXT,
    'content_en'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(bp.id))[1],
    (ARRAY_AGG(bp.title_en))[1],
    LEFT((ARRAY_AGG(bp.content_en))[1], 200)
  FROM blog_posts bp
  WHERE bp.content_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  HAVING COUNT(*) > 0;

  -- Check pages table
  RETURN QUERY
  SELECT
    'pages'::TEXT,
    'content_ua'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(p.id))[1],
    (ARRAY_AGG(p.title_ua))[1],
    LEFT((ARRAY_AGG(p.content_ua))[1], 200)
  FROM pages p
  WHERE p.content_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  HAVING COUNT(*) > 0;

  RETURN QUERY
  SELECT
    'pages'::TEXT,
    'content_en'::TEXT,
    COUNT(*)::BIGINT,
    (ARRAY_AGG(p.id))[1],
    (ARRAY_AGG(p.title_en))[1],
    LEFT((ARRAY_AGG(p.content_en))[1], 200)
  FROM pages p
  WHERE p.content_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  HAVING COUNT(*) > 0;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION find_html_encoding_remnants() TO authenticated;

-- =========================================
-- STEP 2: CLEANUP FUNCTION - Decode HTML entities
-- =========================================

CREATE OR REPLACE FUNCTION decode_html_entities(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;

  result := input_text;

  -- First pass: decode double-encoded entities (&amp;lt; → &lt;)
  result := REPLACE(result, '&amp;lt;', '&lt;');
  result := REPLACE(result, '&amp;gt;', '&gt;');
  result := REPLACE(result, '&amp;nbsp;', '&nbsp;');
  result := REPLACE(result, '&amp;amp;', '&amp;');
  result := REPLACE(result, '&amp;quot;', '&quot;');

  -- Second pass: decode standard entities (&lt; → <)
  result := REPLACE(result, '&lt;', '<');
  result := REPLACE(result, '&gt;', '>');
  result := REPLACE(result, '&nbsp;', ' ');
  result := REPLACE(result, '&amp;', '&');
  result := REPLACE(result, '&quot;', '"');
  result := REPLACE(result, '&#39;', '''');
  result := REPLACE(result, '&apos;', '''');

  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =========================================
-- STEP 3: Main cleanup function with backup
-- =========================================

CREATE OR REPLACE FUNCTION fix_html_encoding_remnants()
RETURNS TABLE (
  table_name TEXT,
  column_name TEXT,
  fixed_count BIGINT
) AS $$
DECLARE
  fixed_count_var BIGINT;
BEGIN
  -- Create backup table for encoded HTML cleanup
  CREATE TABLE IF NOT EXISTS html_encoding_cleanup_backup (
    id UUID,
    table_name TEXT,
    column_name TEXT,
    original_value TEXT,
    cleaned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, table_name, column_name)
  );

  -- =========================================
  -- VERSES TABLE
  -- =========================================

  -- Backup and fix synonyms_ua
  INSERT INTO html_encoding_cleanup_backup (id, table_name, column_name, original_value)
  SELECT id, 'verses', 'synonyms_ua', synonyms_ua
  FROM verses
  WHERE synonyms_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  ON CONFLICT DO NOTHING;

  UPDATE verses
  SET synonyms_ua = decode_html_entities(synonyms_ua)
  WHERE synonyms_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'verses'::TEXT, 'synonyms_ua'::TEXT, fixed_count_var;
  END IF;

  -- Backup and fix synonyms_en
  INSERT INTO html_encoding_cleanup_backup (id, table_name, column_name, original_value)
  SELECT id, 'verses', 'synonyms_en', synonyms_en
  FROM verses
  WHERE synonyms_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  ON CONFLICT DO NOTHING;

  UPDATE verses
  SET synonyms_en = decode_html_entities(synonyms_en)
  WHERE synonyms_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'verses'::TEXT, 'synonyms_en'::TEXT, fixed_count_var;
  END IF;

  -- Backup and fix translation_ua
  INSERT INTO html_encoding_cleanup_backup (id, table_name, column_name, original_value)
  SELECT id, 'verses', 'translation_ua', translation_ua
  FROM verses
  WHERE translation_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  ON CONFLICT DO NOTHING;

  UPDATE verses
  SET translation_ua = decode_html_entities(translation_ua)
  WHERE translation_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'verses'::TEXT, 'translation_ua'::TEXT, fixed_count_var;
  END IF;

  -- Backup and fix translation_en
  INSERT INTO html_encoding_cleanup_backup (id, table_name, column_name, original_value)
  SELECT id, 'verses', 'translation_en', translation_en
  FROM verses
  WHERE translation_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  ON CONFLICT DO NOTHING;

  UPDATE verses
  SET translation_en = decode_html_entities(translation_en)
  WHERE translation_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'verses'::TEXT, 'translation_en'::TEXT, fixed_count_var;
  END IF;

  -- Backup and fix commentary_ua
  INSERT INTO html_encoding_cleanup_backup (id, table_name, column_name, original_value)
  SELECT id, 'verses', 'commentary_ua', commentary_ua
  FROM verses
  WHERE commentary_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  ON CONFLICT DO NOTHING;

  UPDATE verses
  SET commentary_ua = decode_html_entities(commentary_ua)
  WHERE commentary_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'verses'::TEXT, 'commentary_ua'::TEXT, fixed_count_var;
  END IF;

  -- Backup and fix commentary_en
  INSERT INTO html_encoding_cleanup_backup (id, table_name, column_name, original_value)
  SELECT id, 'verses', 'commentary_en', commentary_en
  FROM verses
  WHERE commentary_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  ON CONFLICT DO NOTHING;

  UPDATE verses
  SET commentary_en = decode_html_entities(commentary_en)
  WHERE commentary_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'verses'::TEXT, 'commentary_en'::TEXT, fixed_count_var;
  END IF;

  -- =========================================
  -- CHAPTERS TABLE
  -- =========================================

  INSERT INTO html_encoding_cleanup_backup (id, table_name, column_name, original_value)
  SELECT id, 'chapters', 'content_ua', content_ua
  FROM chapters
  WHERE content_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  ON CONFLICT DO NOTHING;

  UPDATE chapters
  SET content_ua = decode_html_entities(content_ua)
  WHERE content_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'chapters'::TEXT, 'content_ua'::TEXT, fixed_count_var;
  END IF;

  INSERT INTO html_encoding_cleanup_backup (id, table_name, column_name, original_value)
  SELECT id, 'chapters', 'content_en', content_en
  FROM chapters
  WHERE content_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  ON CONFLICT DO NOTHING;

  UPDATE chapters
  SET content_en = decode_html_entities(content_en)
  WHERE content_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'chapters'::TEXT, 'content_en'::TEXT, fixed_count_var;
  END IF;

  -- =========================================
  -- INTRO_CHAPTERS TABLE
  -- =========================================

  INSERT INTO html_encoding_cleanup_backup (id, table_name, column_name, original_value)
  SELECT id, 'intro_chapters', 'content_ua', content_ua
  FROM intro_chapters
  WHERE content_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  ON CONFLICT DO NOTHING;

  UPDATE intro_chapters
  SET content_ua = decode_html_entities(content_ua)
  WHERE content_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'intro_chapters'::TEXT, 'content_ua'::TEXT, fixed_count_var;
  END IF;

  INSERT INTO html_encoding_cleanup_backup (id, table_name, column_name, original_value)
  SELECT id, 'intro_chapters', 'content_en', content_en
  FROM intro_chapters
  WHERE content_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  ON CONFLICT DO NOTHING;

  UPDATE intro_chapters
  SET content_en = decode_html_entities(content_en)
  WHERE content_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'intro_chapters'::TEXT, 'content_en'::TEXT, fixed_count_var;
  END IF;

  -- =========================================
  -- BLOG_POSTS TABLE
  -- =========================================

  INSERT INTO html_encoding_cleanup_backup (id, table_name, column_name, original_value)
  SELECT id, 'blog_posts', 'content_ua', content_ua
  FROM blog_posts
  WHERE content_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  ON CONFLICT DO NOTHING;

  UPDATE blog_posts
  SET content_ua = decode_html_entities(content_ua)
  WHERE content_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'blog_posts'::TEXT, 'content_ua'::TEXT, fixed_count_var;
  END IF;

  INSERT INTO html_encoding_cleanup_backup (id, table_name, column_name, original_value)
  SELECT id, 'blog_posts', 'content_en', content_en
  FROM blog_posts
  WHERE content_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  ON CONFLICT DO NOTHING;

  UPDATE blog_posts
  SET content_en = decode_html_entities(content_en)
  WHERE content_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'blog_posts'::TEXT, 'content_en'::TEXT, fixed_count_var;
  END IF;

  -- =========================================
  -- PAGES TABLE
  -- =========================================

  INSERT INTO html_encoding_cleanup_backup (id, table_name, column_name, original_value)
  SELECT id, 'pages', 'content_ua', content_ua
  FROM pages
  WHERE content_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  ON CONFLICT DO NOTHING;

  UPDATE pages
  SET content_ua = decode_html_entities(content_ua)
  WHERE content_ua ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'pages'::TEXT, 'content_ua'::TEXT, fixed_count_var;
  END IF;

  INSERT INTO html_encoding_cleanup_backup (id, table_name, column_name, original_value)
  SELECT id, 'pages', 'content_en', content_en
  FROM pages
  WHERE content_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;'
  ON CONFLICT DO NOTHING;

  UPDATE pages
  SET content_en = decode_html_entities(content_en)
  WHERE content_en ~ '&lt;|&gt;|&amp;lt;|&amp;gt;|&amp;nbsp;';

  GET DIAGNOSTICS fixed_count_var = ROW_COUNT;
  IF fixed_count_var > 0 THEN
    RETURN QUERY SELECT 'pages'::TEXT, 'content_en'::TEXT, fixed_count_var;
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION fix_html_encoding_remnants() TO authenticated;

-- =========================================
-- STEP 4: Run diagnostic (results in logs)
-- =========================================

DO $$
DECLARE
  rec RECORD;
  total_found INTEGER := 0;
BEGIN
  RAISE NOTICE '=== HTML Encoding Remnants Diagnostic ===';

  FOR rec IN SELECT * FROM find_html_encoding_remnants() LOOP
    RAISE NOTICE 'Table: %, Column: %, Count: %, Sample: %',
      rec.table_name, rec.column_name, rec.affected_count, LEFT(rec.sample_text, 100);
    total_found := total_found + rec.affected_count;
  END LOOP;

  IF total_found = 0 THEN
    RAISE NOTICE 'No HTML encoding remnants found. Database is clean!';
  ELSE
    RAISE NOTICE 'Total affected records: %', total_found;
    RAISE NOTICE 'Run: SELECT * FROM fix_html_encoding_remnants() to fix these issues';
  END IF;
END $$;
