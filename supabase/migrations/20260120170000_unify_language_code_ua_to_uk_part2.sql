-- ============================================================================
-- Migration: Unify language code from 'ua' to 'uk' - Part 2
-- ============================================================================
-- Continues updating remaining functions from 'ua' to 'uk'
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. GLOSSARY FUNCTIONS (from 20260104120000, 20260107120000)
-- ============================================================================

-- get_glossary_term_by_name
CREATE OR REPLACE FUNCTION get_glossary_term_by_name(
  term_name TEXT,
  search_language TEXT DEFAULT 'uk'
)
RETURNS TABLE (
  id UUID,
  term TEXT,
  devanagari TEXT,
  transliteration TEXT,
  translation TEXT,
  definition TEXT,
  etymology TEXT,
  usage_examples JSONB,
  related_terms TEXT[],
  categories TEXT[]
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
    g.transliteration,
    CASE WHEN normalized_lang = 'uk' THEN g.translation_uk ELSE g.translation_en END,
    CASE WHEN normalized_lang = 'uk' THEN g.definition_uk ELSE g.definition_en END,
    CASE WHEN normalized_lang = 'uk' THEN g.etymology_uk ELSE g.etymology_en END,
    g.usage_examples,
    g.related_terms,
    g.categories
  FROM glossary_terms g
  WHERE lower(g.term) = lower(term_name)
  LIMIT 1;
END;
$$;

-- search_glossary_by_translation
CREATE OR REPLACE FUNCTION search_glossary_by_translation(
  search_text TEXT,
  search_language TEXT DEFAULT 'uk',
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  term TEXT,
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
    g.id,
    g.term,
    CASE WHEN normalized_lang = 'uk' THEN g.translation_uk ELSE g.translation_en END AS translation,
    similarity(
      lower(CASE WHEN normalized_lang = 'uk' THEN g.translation_uk ELSE g.translation_en END),
      lower(search_text)
    ) AS rank
  FROM glossary_terms g
  WHERE
    (normalized_lang = 'uk' AND g.translation_uk ILIKE '%' || search_text || '%')
    OR (normalized_lang != 'uk' AND g.translation_en ILIKE '%' || search_text || '%')
  ORDER BY rank DESC
  LIMIT limit_count;
END;
$$;

-- get_glossary_stats (optimized version using materialized views)
-- Must match signature from 20260114220000_optimize_glossary_stats.sql
CREATE OR REPLACE FUNCTION get_glossary_stats(
  search_language TEXT DEFAULT 'uk'
)
RETURNS TABLE (
  total_terms BIGINT,
  unique_terms BIGINT,
  books_count BIGINT,
  book_stats JSONB
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  normalized_lang TEXT;
BEGIN
  normalized_lang := normalize_language_code(search_language);

  IF normalized_lang = 'uk' THEN
    RETURN QUERY
      WITH book_aggregates AS (
        SELECT
          g.book_slug,
          g.book_title,
          COUNT(*) as term_count,
          COUNT(DISTINCT g.term) as unique_term_count
        FROM public.glossary_stats_cache_uk g
        GROUP BY g.book_slug, g.book_title
      )
      SELECT
        (SELECT COUNT(*) FROM public.glossary_stats_cache_uk)::bigint as total_terms,
        (SELECT COUNT(DISTINCT term) FROM public.glossary_stats_cache_uk)::bigint as unique_terms,
        (SELECT COUNT(DISTINCT book_slug) FROM public.glossary_stats_cache_uk)::bigint as books_count,
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'slug', ba.book_slug,
              'title', ba.book_title,
              'total', ba.term_count,
              'unique', ba.unique_term_count
            ) ORDER BY ba.term_count DESC
          )
          FROM book_aggregates ba
        ) as book_stats;
  ELSE
    RETURN QUERY
      WITH book_aggregates AS (
        SELECT
          g.book_slug,
          g.book_title,
          COUNT(*) as term_count,
          COUNT(DISTINCT g.term) as unique_term_count
        FROM public.glossary_stats_cache_en g
        GROUP BY g.book_slug, g.book_title
      )
      SELECT
        (SELECT COUNT(*) FROM public.glossary_stats_cache_en)::bigint as total_terms,
        (SELECT COUNT(DISTINCT term) FROM public.glossary_stats_cache_en)::bigint as unique_terms,
        (SELECT COUNT(DISTINCT book_slug) FROM public.glossary_stats_cache_en)::bigint as books_count,
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'slug', ba.book_slug,
              'title', ba.book_title,
              'total', ba.term_count,
              'unique', ba.unique_term_count
            ) ORDER BY ba.term_count DESC
          )
          FROM book_aggregates ba
        ) as book_stats;
  END IF;
END;
$$;

-- search_glossary_similar
CREATE OR REPLACE FUNCTION search_glossary_similar(
  search_text TEXT,
  search_language TEXT DEFAULT 'uk',
  similarity_threshold REAL DEFAULT 0.3,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  term TEXT,
  translation TEXT,
  similarity_score REAL
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
    CASE WHEN normalized_lang = 'uk' THEN g.translation_uk ELSE g.translation_en END,
    similarity(lower(g.term), lower(search_text)) AS similarity_score
  FROM glossary_terms g
  WHERE similarity(lower(g.term), lower(search_text)) > similarity_threshold
  ORDER BY similarity_score DESC
  LIMIT limit_count;
END;
$$;

-- ============================================================================
-- 2. KNOWLEDGE COMPILER FUNCTIONS (from 20251115200000)
-- ============================================================================

-- compile_chapter_knowledge
CREATE OR REPLACE FUNCTION compile_chapter_knowledge(
  p_book_id TEXT,
  p_chapter_number INTEGER,
  p_canto_number INTEGER DEFAULT NULL,
  language_code TEXT DEFAULT 'uk'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  normalized_lang TEXT;
  result JSONB;
  chapter_record RECORD;
  verses_array JSONB;
BEGIN
  normalized_lang := normalize_language_code(language_code);

  -- Get chapter info
  SELECT
    c.id,
    c.chapter_number,
    CASE WHEN normalized_lang = 'uk' THEN c.title_uk ELSE c.title_en END AS title,
    CASE WHEN normalized_lang = 'uk' THEN c.summary_uk ELSE c.summary_en END AS summary
  INTO chapter_record
  FROM chapters c
  WHERE c.book_id = (SELECT id FROM books WHERE slug = p_book_id)
    AND c.chapter_number = p_chapter_number
    AND (p_canto_number IS NULL OR c.canto_id = (
      SELECT id FROM cantos WHERE book_id = (SELECT id FROM books WHERE slug = p_book_id)
        AND canto_number = p_canto_number
    ));

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Get verses
  SELECT jsonb_agg(
    jsonb_build_object(
      'verse_number', v.verse_number,
      'devanagari', v.devanagari,
      'verse_text', v.verse_text,
      'synonyms', CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END,
      'translation', CASE WHEN normalized_lang = 'uk' THEN v.translation_uk ELSE v.translation_en END
    ) ORDER BY v.verse_number_sort
  )
  INTO verses_array
  FROM verses v
  WHERE v.chapter_id = chapter_record.id;

  result := jsonb_build_object(
    'book_id', p_book_id,
    'canto_number', p_canto_number,
    'chapter_number', p_chapter_number,
    'title', chapter_record.title,
    'summary', chapter_record.summary,
    'verses', COALESCE(verses_array, '[]'::jsonb),
    'language', normalized_lang
  );

  RETURN result;
END;
$$;

-- compile_canto_knowledge
CREATE OR REPLACE FUNCTION compile_canto_knowledge(
  p_book_id TEXT,
  p_canto_number INTEGER,
  language_code TEXT DEFAULT 'uk'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  normalized_lang TEXT;
  result JSONB;
  canto_record RECORD;
  chapters_array JSONB;
BEGIN
  normalized_lang := normalize_language_code(language_code);

  -- Get canto info
  SELECT
    ca.id,
    ca.canto_number,
    CASE WHEN normalized_lang = 'uk' THEN ca.title_uk ELSE ca.title_en END AS title,
    CASE WHEN normalized_lang = 'uk' THEN ca.description_uk ELSE ca.description_en END AS description
  INTO canto_record
  FROM cantos ca
  JOIN books b ON ca.book_id = b.id
  WHERE b.slug = p_book_id AND ca.canto_number = p_canto_number;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Get chapters summary
  SELECT jsonb_agg(
    jsonb_build_object(
      'chapter_number', c.chapter_number,
      'title', CASE WHEN normalized_lang = 'uk' THEN c.title_uk ELSE c.title_en END,
      'verse_count', (SELECT COUNT(*) FROM verses WHERE chapter_id = c.id)
    ) ORDER BY c.chapter_number
  )
  INTO chapters_array
  FROM chapters c
  WHERE c.canto_id = canto_record.id;

  result := jsonb_build_object(
    'book_id', p_book_id,
    'canto_number', p_canto_number,
    'title', canto_record.title,
    'description', canto_record.description,
    'chapters', COALESCE(chapters_array, '[]'::jsonb),
    'language', normalized_lang
  );

  RETURN result;
END;
$$;

-- ============================================================================
-- 3. SYNONYM SEARCH WITH CANTO (from 20260106200000)
-- ============================================================================

CREATE OR REPLACE FUNCTION search_synonyms_with_canto(
  search_term TEXT,
  search_language TEXT DEFAULT 'uk',
  limit_results INTEGER DEFAULT 50,
  book_filter TEXT DEFAULT NULL,
  canto_filter INTEGER DEFAULT NULL,
  chapter_filter INTEGER DEFAULT NULL
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
    AND (chapter_filter IS NULL OR v.chapter_number = chapter_filter)
    AND to_tsvector('simple', COALESCE(
      CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END,
      ''
    )) @@ plainto_tsquery('simple', search_term)
  ORDER BY rank DESC
  LIMIT limit_results;
END;
$$;

-- ============================================================================
-- 4. GET SYNONYMS FOR TERM (from 20251228120000)
-- ============================================================================

CREATE OR REPLACE FUNCTION get_synonyms_for_term(
  search_term TEXT,
  language_code TEXT DEFAULT 'uk',
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  term TEXT,
  sanskrit TEXT,
  meaning TEXT,
  verse_refs TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  normalized_lang TEXT;
BEGIN
  normalized_lang := normalize_language_code(language_code);

  RETURN QUERY
  WITH synonym_matches AS (
    SELECT
      TRIM(unnest(regexp_split_to_array(
        CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END,
        '[\n;]+'
      ))) AS line,
      v.book_id || ' ' ||
        CASE WHEN v.canto_number IS NOT NULL THEN v.canto_number || '.' ELSE '' END ||
        v.chapter_number || '.' || v.verse_number AS verse_ref
    FROM verses v
    WHERE
      CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END ILIKE '%' || search_term || '%'
  )
  SELECT
    split_part(sm.line, '—', 1) AS term,
    NULL::TEXT AS sanskrit,
    split_part(sm.line, '—', 2) AS meaning,
    array_agg(DISTINCT sm.verse_ref) AS verse_refs
  FROM synonym_matches sm
  WHERE sm.line ILIKE '%' || search_term || '%'
  GROUP BY split_part(sm.line, '—', 1), split_part(sm.line, '—', 2)
  LIMIT limit_count;
END;
$$;

-- ============================================================================
-- 5. SEARCH SUGGEST TERMS (from 20260109120000)
-- ============================================================================

CREATE OR REPLACE FUNCTION search_suggest_terms(
  search_prefix TEXT,
  language_code TEXT DEFAULT 'uk',
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  suggestion TEXT,
  frequency INTEGER,
  source TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  normalized_lang TEXT;
BEGIN
  normalized_lang := normalize_language_code(language_code);

  RETURN QUERY
  (
    -- From glossary terms
    SELECT
      g.term AS suggestion,
      1 AS frequency,
      'glossary' AS source
    FROM glossary_terms g
    WHERE g.term ILIKE search_prefix || '%'
    LIMIT limit_count / 2
  )
  UNION ALL
  (
    -- From verse synonyms - extract terms
    SELECT DISTINCT
      TRIM(split_part(
        unnest(regexp_split_to_array(
          CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END,
          '[\n;,]+'
        )),
        '—', 1
      )) AS suggestion,
      1 AS frequency,
      'synonyms' AS source
    FROM verses v
    WHERE
      CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END ILIKE '%' || search_prefix || '%'
    LIMIT limit_count / 2
  )
  LIMIT limit_count;
END;
$$;

-- ============================================================================
-- 6. UNIFIED SEARCH (from 20251228120000)
-- ============================================================================

CREATE OR REPLACE FUNCTION unified_search(
  search_query TEXT,
  language_code TEXT DEFAULT 'uk',
  search_types TEXT[] DEFAULT ARRAY['verses', 'blog'],
  limit_per_type INTEGER DEFAULT 10
)
RETURNS TABLE (
  result_type TEXT,
  result_id TEXT,
  title TEXT,
  subtitle TEXT,
  snippet TEXT,
  href TEXT,
  relevance REAL,
  matched_in TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  normalized_lang TEXT;
  search_tsquery tsquery;
BEGIN
  normalized_lang := normalize_language_code(language_code);
  search_tsquery := plainto_tsquery('simple', search_query);

  RETURN QUERY
  (
    -- Search verses
    SELECT
      'verse'::TEXT AS result_type,
      v.id::TEXT AS result_id,
      UPPER(v.book_id) || ' ' ||
        CASE WHEN v.canto_number IS NOT NULL THEN v.canto_number || '.' ELSE '' END ||
        v.chapter_number || '.' || v.verse_number AS title,
      CASE WHEN normalized_lang = 'uk' THEN ch.title_uk ELSE ch.title_en END AS subtitle,
      ts_headline(
        'simple',
        CASE WHEN normalized_lang = 'uk' THEN COALESCE(v.translation_uk, '') ELSE COALESCE(v.translation_en, '') END,
        search_tsquery,
        'MaxWords=30, MinWords=15, StartSel=<mark>, StopSel=</mark>'
      ) AS snippet,
      '/' || normalized_lang || '/lib/' || v.book_id || '/' ||
        CASE WHEN v.canto_number IS NOT NULL THEN v.canto_number || '/' ELSE '' END ||
        v.chapter_number || '/' || v.verse_number AS href,
      ts_rank(
        CASE WHEN normalized_lang = 'uk' THEN v.search_vector_uk ELSE v.search_vector_en END,
        search_tsquery
      ) AS relevance,
      ARRAY['verse']::TEXT[] AS matched_in
    FROM verses v
    LEFT JOIN chapters ch ON v.chapter_id = ch.id
    WHERE
      'verses' = ANY(search_types)
      AND (
        v.search_vector_uk @@ search_tsquery
        OR v.search_vector_en @@ search_tsquery
      )
    ORDER BY relevance DESC
    LIMIT limit_per_type
  )
  UNION ALL
  (
    -- Search blog posts
    SELECT
      'blog'::TEXT AS result_type,
      bp.id::TEXT AS result_id,
      CASE WHEN normalized_lang = 'uk' THEN bp.title_uk ELSE bp.title_en END AS title,
      'Blog'::TEXT AS subtitle,
      ts_headline(
        'simple',
        CASE WHEN normalized_lang = 'uk' THEN COALESCE(bp.excerpt_uk, '') ELSE COALESCE(bp.excerpt_en, '') END,
        search_tsquery,
        'MaxWords=30, MinWords=15, StartSel=<mark>, StopSel=</mark>'
      ) AS snippet,
      '/' || normalized_lang || '/blog/' || bp.slug AS href,
      ts_rank(
        CASE WHEN normalized_lang = 'uk' THEN bp.search_vector_uk ELSE bp.search_vector_en END,
        search_tsquery
      ) AS relevance,
      ARRAY['blog']::TEXT[] AS matched_in
    FROM blog_posts bp
    WHERE
      'blog' = ANY(search_types)
      AND bp.is_published = true
      AND (
        bp.search_vector_uk @@ search_tsquery
        OR bp.search_vector_en @@ search_tsquery
      )
    ORDER BY relevance DESC
    LIMIT limit_per_type
  )
  ORDER BY relevance DESC;
END;
$$;

-- ============================================================================
-- 7. GRANT EXECUTE ON ALL FUNCTIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION get_glossary_term_by_name(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_glossary_by_translation(TEXT, TEXT, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_glossary_stats(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_glossary_similar(TEXT, TEXT, REAL, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compile_chapter_knowledge(TEXT, INTEGER, INTEGER, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compile_canto_knowledge(TEXT, INTEGER, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_synonyms_with_canto(TEXT, TEXT, INTEGER, TEXT, INTEGER, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_synonyms_for_term(TEXT, TEXT, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_suggest_terms(TEXT, TEXT, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION unified_search(TEXT, TEXT, TEXT[], INTEGER) TO anon, authenticated;

COMMIT;
