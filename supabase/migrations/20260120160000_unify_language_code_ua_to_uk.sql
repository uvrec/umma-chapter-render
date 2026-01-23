-- ============================================================================
-- Migration: Unify language code from 'ua' to 'uk'
-- ============================================================================
-- This migration updates all language code references from 'ua' (country code)
-- to 'uk' (language code) for consistency with ISO 639-1.
--
-- Changes:
-- 1. Function parameters: DEFAULT 'uk' → DEFAULT 'uk'
-- 2. Comparisons: = 'ua' → = 'uk'
-- 3. CHECK constraints: ('ua', 'en') → ('uk', 'en')
-- 4. Backward compatibility: accepts 'ua' and maps to 'uk'
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. UPDATE user_sadhana_config CHECK CONSTRAINT
-- ============================================================================

-- Drop the old constraint
ALTER TABLE public.user_sadhana_config
  DROP CONSTRAINT IF EXISTS user_sadhana_config_language_check;

-- Add new constraint with 'uk' and backward-compatible 'ua'
ALTER TABLE public.user_sadhana_config
  ADD CONSTRAINT user_sadhana_config_language_check
  CHECK (language IN ('uk', 'en', 'ua')); -- 'ua' temporary for migration

-- Update existing 'ua' values to 'uk'
UPDATE public.user_sadhana_config
SET language = 'uk'
WHERE language = 'ua';

-- Now restrict to only 'uk' and 'en'
ALTER TABLE public.user_sadhana_config
  DROP CONSTRAINT user_sadhana_config_language_check;

ALTER TABLE public.user_sadhana_config
  ADD CONSTRAINT user_sadhana_config_language_check
  CHECK (language IN ('uk', 'en'));

-- Update default
ALTER TABLE public.user_sadhana_config
  ALTER COLUMN language SET DEFAULT 'uk';

-- ============================================================================
-- 2. HELPER FUNCTION: Normalize language code
-- ============================================================================
-- Use this in all search functions for backward compatibility

CREATE OR REPLACE FUNCTION normalize_language_code(lang TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Map 'ua' to 'uk' for backward compatibility
  IF lang = 'ua' THEN
    RETURN 'uk';
  END IF;
  RETURN COALESCE(lang, 'uk');
END;
$$;

-- ============================================================================
-- 3. UPDATE SEARCH FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 3.1 search_synonyms (from 20251116120000)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION search_synonyms(
  search_term TEXT,
  search_language TEXT DEFAULT 'uk',  -- Changed from 'ua'
  limit_results INTEGER DEFAULT 50,
  book_filter TEXT DEFAULT NULL,
  canto_filter INTEGER DEFAULT NULL
)
RETURNS TABLE (
  verse_id UUID,
  book_id TEXT,
  canto_number INTEGER,
  chapter_number INTEGER,
  verse_number TEXT,
  synonyms TEXT,
  translation TEXT,
  rank REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  normalized_lang TEXT;
BEGIN
  normalized_lang := normalize_language_code(search_language);

  RETURN QUERY
  SELECT
    v.id AS verse_id,
    v.book_id,
    v.canto_number,
    v.chapter_number,
    v.verse_number,
    CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END AS synonyms,
    CASE WHEN normalized_lang = 'uk' THEN v.translation_uk ELSE v.translation_en END AS translation,
    ts_rank(
      to_tsvector('simple', COALESCE(
        CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END,
        ''
      )),
      plainto_tsquery('simple', search_term)
    ) AS rank
  FROM verses v
  WHERE
    (book_filter IS NULL OR v.book_id = book_filter)
    AND (canto_filter IS NULL OR v.canto_number = canto_filter)
    AND to_tsvector('simple', COALESCE(
      CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END,
      ''
    )) @@ plainto_tsquery('simple', search_term)
  ORDER BY rank DESC
  LIMIT limit_results;
END;
$$;

-- ----------------------------------------------------------------------------
-- 3.2 search_verses_fulltext (from 20251228120000)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION search_verses_fulltext(
  search_term TEXT,
  language_code TEXT DEFAULT 'uk',  -- Changed from 'ua'
  book_filter TEXT DEFAULT NULL,
  canto_filter INTEGER DEFAULT NULL,
  chapter_filter INTEGER DEFAULT NULL,
  limit_results INTEGER DEFAULT 50,
  offset_results INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  book_id TEXT,
  canto_number INTEGER,
  chapter_number INTEGER,
  verse_number TEXT,
  devanagari TEXT,
  verse_text TEXT,
  synonyms TEXT,
  translation TEXT,
  purport TEXT,
  rank REAL,
  headline_text TEXT,
  headline_translation TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  normalized_lang TEXT;
  search_query tsquery;
BEGIN
  normalized_lang := normalize_language_code(language_code);
  search_query := plainto_tsquery('simple', search_term);

  RETURN QUERY
  SELECT
    v.id,
    v.book_id,
    v.canto_number,
    v.chapter_number,
    v.verse_number,
    v.devanagari,
    v.verse_text,
    CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END,
    CASE WHEN normalized_lang = 'uk' THEN v.translation_uk ELSE v.translation_en END,
    CASE WHEN normalized_lang = 'uk' THEN v.purport_uk ELSE v.purport_en END,
    GREATEST(
      ts_rank(COALESCE(v.search_vector_uk, ''::tsvector), search_query),
      ts_rank(COALESCE(v.search_vector_en, ''::tsvector), search_query)
    ) AS rank,
    ts_headline(
      'simple',
      COALESCE(v.verse_text, ''),
      search_query,
      'MaxWords=50, MinWords=20, StartSel=<mark>, StopSel=</mark>'
    ),
    ts_headline(
      'simple',
      CASE WHEN normalized_lang = 'uk' THEN COALESCE(v.translation_uk, '') ELSE COALESCE(v.translation_en, '') END,
      search_query,
      'MaxWords=50, MinWords=20, StartSel=<mark>, StopSel=</mark>'
    )
  FROM verses v
  WHERE
    (book_filter IS NULL OR v.book_id = book_filter)
    AND (canto_filter IS NULL OR v.canto_number = canto_filter)
    AND (chapter_filter IS NULL OR v.chapter_number = chapter_filter)
    AND (
      v.search_vector_uk @@ search_query
      OR v.search_vector_en @@ search_query
    )
  ORDER BY rank DESC
  LIMIT limit_results
  OFFSET offset_results;
END;
$$;

-- ----------------------------------------------------------------------------
-- 3.3 search_glossary_terms (from 20260104120000 / 20260107120000)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION search_glossary_terms(
  search_text TEXT,
  search_language TEXT DEFAULT 'uk',  -- Changed from 'ua'
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  term TEXT,
  devanagari TEXT,
  translation TEXT,
  definition TEXT,
  rank REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  normalized_lang TEXT;
BEGIN
  normalized_lang := normalize_language_code(search_language);

  RETURN QUERY
  SELECT
    g.id,
    g.term,
    g.devanagari,
    CASE WHEN normalized_lang = 'uk' THEN g.translation_uk ELSE g.translation_en END AS translation,
    CASE WHEN normalized_lang = 'uk' THEN g.definition_uk ELSE g.definition_en END AS definition,
    similarity(lower(g.term), lower(search_text)) AS rank
  FROM glossary_terms g
  WHERE
    g.term ILIKE '%' || search_text || '%'
    OR g.devanagari ILIKE '%' || search_text || '%'
    OR (normalized_lang = 'uk' AND g.translation_uk ILIKE '%' || search_text || '%')
    OR (normalized_lang != 'uk' AND g.translation_en ILIKE '%' || search_text || '%')
  ORDER BY rank DESC, g.term ASC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- ----------------------------------------------------------------------------
-- 3.4 get_unique_synonym_terms (from 20251116120000)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_unique_synonym_terms(
  search_language TEXT DEFAULT 'uk',  -- Changed from 'ua'
  book_filter TEXT DEFAULT NULL,
  canto_filter INTEGER DEFAULT NULL
)
RETURNS TABLE (
  term TEXT,
  count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  normalized_lang TEXT;
BEGIN
  normalized_lang := normalize_language_code(search_language);

  RETURN QUERY
  SELECT
    unnest(regexp_split_to_array(
      CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END,
      '[;,\n]+'
    )) AS term,
    COUNT(*) AS count
  FROM verses v
  WHERE
    (book_filter IS NULL OR v.book_id = book_filter)
    AND (canto_filter IS NULL OR v.canto_number = canto_filter)
    AND CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END IS NOT NULL
  GROUP BY term
  HAVING LENGTH(TRIM(unnest(regexp_split_to_array(
    CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END,
    '[;,\n]+'
  )))) > 2
  ORDER BY count DESC;
END;
$$;

-- ----------------------------------------------------------------------------
-- 3.5 compile_verse_knowledge (from 20251115200000)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION compile_verse_knowledge(
  p_verse_id UUID,
  language_code TEXT DEFAULT 'uk'  -- Changed from 'ua'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  normalized_lang TEXT;
  result JSONB;
  v_record RECORD;
BEGIN
  normalized_lang := normalize_language_code(language_code);

  SELECT
    v.book_id,
    v.canto_number,
    v.chapter_number,
    v.verse_number,
    v.devanagari,
    v.verse_text,
    CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END AS synonyms,
    CASE WHEN normalized_lang = 'uk' THEN v.translation_uk ELSE v.translation_en END AS translation,
    CASE WHEN normalized_lang = 'uk' THEN v.purport_uk ELSE v.purport_en END AS purport
  INTO v_record
  FROM verses v
  WHERE v.id = p_verse_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  result := jsonb_build_object(
    'book_id', v_record.book_id,
    'canto_number', v_record.canto_number,
    'chapter_number', v_record.chapter_number,
    'verse_number', v_record.verse_number,
    'devanagari', v_record.devanagari,
    'verse_text', v_record.verse_text,
    'synonyms', v_record.synonyms,
    'translation', v_record.translation,
    'purport', v_record.purport,
    'language', normalized_lang
  );

  RETURN result;
END;
$$;

-- ============================================================================
-- 4. GRANT EXECUTE ON FUNCTIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION normalize_language_code(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_synonyms(TEXT, TEXT, INTEGER, TEXT, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_verses_fulltext(TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_glossary_terms(TEXT, TEXT, INTEGER, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_unique_synonym_terms(TEXT, TEXT, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compile_verse_knowledge(UUID, TEXT) TO anon, authenticated;

COMMIT;

-- ============================================================================
-- NOTE: This migration updates the most critical search functions.
-- Additional functions may need similar updates in future migrations.
-- The normalize_language_code() helper ensures backward compatibility.
-- ============================================================================
