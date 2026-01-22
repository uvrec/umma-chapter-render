-- ============================================================================
-- Migration: Unify language code from 'ua' to 'uk' - Part 3
-- ============================================================================
-- Updates advanced search functions (phrase/wildcard/proximity) to use 'uk'
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ADVANCED search_verses_fulltext (from 20260107150000)
-- ============================================================================
-- This version has 9 parameters and supports phrase/wildcard/proximity search

CREATE OR REPLACE FUNCTION public.search_verses_fulltext(
  search_query text,
  language_code text,
  include_sanskrit boolean,
  include_transliteration boolean,
  include_synonyms boolean,
  include_translation boolean,
  include_commentary boolean,
  book_ids uuid[] DEFAULT NULL,
  limit_count integer DEFAULT 50
)
RETURNS TABLE(
  verse_id uuid,
  verse_number text,
  chapter_id uuid,
  chapter_number integer,
  chapter_title text,
  book_id uuid,
  book_title text,
  book_slug text,
  canto_id uuid,
  canto_number integer,
  canto_title text,
  sanskrit text,
  transliteration text,
  synonyms text,
  translation text,
  commentary text,
  relevance_rank numeric,
  matched_in text[],
  search_snippet text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  ts_query tsquery;
  pattern text;
  search_config regconfig;
  cleaned_query text;
  has_complex_wildcard boolean;
  has_proximity boolean;
  query_result RECORD;
  normalized_lang text;  -- Added for backward compatibility
BEGIN
  -- Normalize language code for backward compatibility (ua -> uk)
  normalized_lang := normalize_language_code(language_code);

  -- Визначаємо конфіг для мови
  IF normalized_lang = 'uk' THEN  -- Changed from 'ua'
    search_config := 'public.simple_unaccent'::regconfig;
  ELSE
    search_config := 'english'::regconfig;
  END IF;

  -- Очищаємо запит
  cleaned_query := TRIM(regexp_replace(search_query, '\s+', ' ', 'g'));

  -- Парсимо запит з усіма операторами
  SELECT * INTO query_result FROM parse_advanced_query(cleaned_query, search_config);
  ts_query := query_result.ts_query;
  has_complex_wildcard := query_result.has_complex_wildcard;
  has_proximity := query_result.has_proximity;
  pattern := query_result.ilike_pattern;

  RETURN QUERY
  SELECT
    v.id as verse_id,
    v.verse_number::text,
    v.chapter_id,
    ch.chapter_number,
    CASE WHEN normalized_lang = 'uk' THEN ch.title_uk ELSE ch.title_en END as chapter_title,
    b.id as book_id,
    CASE WHEN normalized_lang = 'uk' THEN b.title_uk ELSE b.title_en END as book_title,
    b.slug as book_slug,
    ch.canto_id as canto_id,
    ca.canto_number::integer as canto_number,
    CASE WHEN normalized_lang = 'uk' THEN ca.title_uk ELSE ca.title_en END as canto_title,
    (CASE WHEN include_sanskrit THEN v.sanskrit ELSE NULL END) as sanskrit,
    (CASE WHEN include_transliteration THEN COALESCE(
      CASE WHEN normalized_lang = 'uk' THEN v.transliteration_uk ELSE v.transliteration_en END,
      v.transliteration
    ) ELSE NULL END) as transliteration,
    (CASE WHEN include_synonyms
          THEN (CASE WHEN normalized_lang = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END)
          ELSE NULL END) as synonyms,
    (CASE WHEN include_translation
          THEN (CASE WHEN normalized_lang = 'uk' THEN v.translation_uk ELSE v.translation_en END)
          ELSE NULL END) as translation,
    (CASE WHEN include_commentary
          THEN (CASE WHEN normalized_lang = 'uk' THEN v.commentary_uk ELSE v.commentary_en END)
          ELSE NULL END) as commentary,
    -- Релевантність
    CASE
      WHEN normalized_lang = 'uk' AND v.search_vector_uk IS NOT NULL AND ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(v.search_vector_uk, ts_query, 32)::numeric
      WHEN normalized_lang != 'uk' AND v.search_vector_en IS NOT NULL AND ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(v.search_vector_en, ts_query, 32)::numeric
      ELSE 1::numeric
    END as relevance_rank,
    -- Де знайдено
    ARRAY_REMOVE(ARRAY[
      CASE WHEN include_translation AND (
        (normalized_lang = 'uk' AND v.translation_uk ILIKE pattern) OR
        (normalized_lang <> 'uk' AND v.translation_en ILIKE pattern)
      ) THEN 'translation' ELSE NULL END,
      CASE WHEN include_commentary AND (
        (normalized_lang = 'uk' AND v.commentary_uk ILIKE pattern) OR
        (normalized_lang <> 'uk' AND v.commentary_en ILIKE pattern)
      ) THEN 'commentary' ELSE NULL END,
      CASE WHEN include_synonyms AND (
        (normalized_lang = 'uk' AND v.synonyms_uk ILIKE pattern) OR
        (normalized_lang <> 'uk' AND v.synonyms_en ILIKE pattern)
      ) THEN 'synonyms' ELSE NULL END,
      CASE WHEN include_transliteration AND (
        v.transliteration ILIKE pattern OR
        v.transliteration_uk ILIKE pattern OR
        v.transliteration_en ILIKE pattern
      ) THEN 'transliteration' ELSE NULL END,
      CASE WHEN include_sanskrit AND v.sanskrit ILIKE pattern THEN 'sanskrit' ELSE NULL END
    ], NULL) as matched_in,
    -- Snippet
    CASE
      WHEN ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_headline(
          search_config,
          COALESCE(
            CASE WHEN normalized_lang = 'uk' THEN v.translation_uk ELSE v.translation_en END,
            CASE WHEN normalized_lang = 'uk' THEN v.commentary_uk ELSE v.commentary_en END,
            ''
          ),
          ts_query,
          'MaxWords=30, MinWords=15, StartSel=<mark>, StopSel=</mark>'
        )
      ELSE
        LEFT(COALESCE(
          CASE WHEN normalized_lang = 'uk' THEN v.translation_uk ELSE v.translation_en END,
          ''
        ), 200)
    END as search_snippet
  FROM public.verses v
  JOIN public.chapters ch ON ch.id = v.chapter_id
  JOIN public.books b ON b.id = ch.book_id
  LEFT JOIN public.cantos ca ON ca.id = ch.canto_id
  WHERE ch.is_published = true
    AND v.deleted_at IS NULL
    AND (
      -- FTS пошук
      (ts_query IS NOT NULL AND ts_query != ''::tsquery AND NOT has_complex_wildcard AND (
        (normalized_lang = 'uk' AND v.search_vector_uk @@ ts_query)
        OR (normalized_lang != 'uk' AND v.search_vector_en @@ ts_query)
      ))
      -- ILIKE fallback
      OR (has_complex_wildcard OR length(cleaned_query) <= 3) AND (
        (include_translation AND (
          (normalized_lang = 'uk' AND v.translation_uk ILIKE pattern) OR
          (normalized_lang <> 'uk' AND v.translation_en ILIKE pattern)
        ))
        OR (include_commentary AND (
          (normalized_lang = 'uk' AND v.commentary_uk ILIKE pattern) OR
          (normalized_lang <> 'uk' AND v.commentary_en ILIKE pattern)
        ))
        OR (include_synonyms AND (
          (normalized_lang = 'uk' AND v.synonyms_uk ILIKE pattern) OR
          (normalized_lang <> 'uk' AND v.synonyms_en ILIKE pattern)
        ))
        OR (include_transliteration AND (
          v.transliteration ILIKE pattern OR
          v.transliteration_uk ILIKE pattern OR
          v.transliteration_en ILIKE pattern
        ))
        OR (include_sanskrit AND v.sanskrit ILIKE pattern)
      )
    )
    AND (book_ids IS NULL OR ch.book_id = ANY(book_ids))
  ORDER BY relevance_rank DESC, b.display_order NULLS LAST, ch.chapter_number, v.sort_key NULLS FIRST, v.verse_number
  LIMIT limit_count;
END;
$$;

COMMENT ON FUNCTION public.search_verses_fulltext(text, text, boolean, boolean, boolean, boolean, boolean, uuid[], integer) IS
'Advanced full-text verse search with phrase, wildcard, and proximity support.
Uses ''uk'' (ISO 639-1) for Ukrainian, accepts ''ua'' for backward compatibility.';

-- ============================================================================
-- 2. ADVANCED unified_search (from 20260107150000)
-- ============================================================================
-- This version has 5 parameters with overall_limit

CREATE OR REPLACE FUNCTION public.unified_search(
  search_query text,
  language_code text DEFAULT 'uk',  -- Changed from 'ua'
  search_types text[] DEFAULT ARRAY['verses', 'blog', 'glossary'],
  limit_per_type integer DEFAULT 10,
  overall_limit integer DEFAULT NULL
)
RETURNS TABLE(
  result_type text,
  result_id uuid,
  title text,
  subtitle text,
  snippet text,
  href text,
  relevance numeric,
  matched_in text[]
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  ts_query tsquery;
  search_config regconfig;
  pattern text;
  cleaned_query text;
  has_complex_wildcard boolean;
  has_proximity boolean;
  query_result RECORD;
  normalized_lang text;  -- Added for backward compatibility
BEGIN
  -- Normalize language code for backward compatibility (ua -> uk)
  normalized_lang := normalize_language_code(language_code);

  -- Конфіг для мови
  IF normalized_lang = 'uk' THEN  -- Changed from 'ua'
    search_config := 'public.simple_unaccent'::regconfig;
  ELSE
    search_config := 'english'::regconfig;
  END IF;

  -- Очищаємо запит
  cleaned_query := TRIM(regexp_replace(search_query, '\s+', ' ', 'g'));

  -- Парсимо запит
  SELECT * INTO query_result FROM parse_advanced_query(cleaned_query, search_config);
  ts_query := query_result.ts_query;
  has_complex_wildcard := query_result.has_complex_wildcard;
  has_proximity := query_result.has_proximity;
  pattern := query_result.ilike_pattern;

  RETURN QUERY

  -- Пошук у віршах
  (SELECT
    'verse'::text as result_type,
    v.id as result_id,
    b.slug || ' ' ||
      CASE WHEN ca.canto_number IS NOT NULL
        THEN ca.canto_number || '.' || ch.chapter_number || '.' || v.verse_number
        ELSE ch.chapter_number || '.' || v.verse_number
      END as title,
    CASE WHEN normalized_lang = 'uk' THEN ch.title_uk ELSE ch.title_en END as subtitle,
    CASE
      WHEN ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_headline(
          search_config,
          COALESCE(
            CASE WHEN normalized_lang = 'uk' THEN v.translation_uk ELSE v.translation_en END,
            ''
          ),
          ts_query,
          'MaxWords=25, MinWords=10'
        )
      ELSE
        LEFT(COALESCE(
          CASE WHEN normalized_lang = 'uk' THEN v.translation_uk ELSE v.translation_en END,
          ''
        ), 150)
    END as snippet,
    CASE
      WHEN ca.canto_number IS NOT NULL THEN
        '/veda-reader/' || b.slug || '/canto/' || ca.canto_number || '/chapter/' || ch.chapter_number || '/' || v.verse_number
      ELSE
        '/veda-reader/' || b.slug || '/' || ch.chapter_number || '/' || v.verse_number
    END as href,
    CASE
      WHEN normalized_lang = 'uk' AND v.search_vector_uk IS NOT NULL AND ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(v.search_vector_uk, ts_query)::numeric
      WHEN normalized_lang != 'uk' AND v.search_vector_en IS NOT NULL AND ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(v.search_vector_en, ts_query)::numeric
      ELSE 0.5::numeric
    END as relevance,
    ARRAY['verse']::text[] as matched_in
  FROM public.verses v
  JOIN public.chapters ch ON ch.id = v.chapter_id
  JOIN public.books b ON b.id = ch.book_id
  LEFT JOIN public.cantos ca ON ca.id = ch.canto_id
  WHERE ch.is_published = true
    AND v.deleted_at IS NULL
    AND 'verses' = ANY(search_types)
    AND (
      (ts_query IS NOT NULL AND ts_query != ''::tsquery AND NOT has_complex_wildcard AND (
        (normalized_lang = 'uk' AND v.search_vector_uk @@ ts_query)
        OR (normalized_lang != 'uk' AND v.search_vector_en @@ ts_query)
      ))
      OR ((has_complex_wildcard OR length(cleaned_query) <= 3) AND (
        (normalized_lang = 'uk' AND v.translation_uk ILIKE pattern) OR
        (normalized_lang != 'uk' AND v.translation_en ILIKE pattern)
      ))
    )
  ORDER BY relevance DESC
  LIMIT limit_per_type)

  UNION ALL

  -- Пошук у блозі
  (SELECT
    'blog'::text as result_type,
    bp.id as result_id,
    CASE WHEN normalized_lang = 'uk' THEN bp.title_uk ELSE bp.title_en END as title,
    CASE WHEN normalized_lang = 'uk' THEN bp.excerpt_uk ELSE bp.excerpt_en END as subtitle,
    CASE
      WHEN ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_headline(
          search_config,
          COALESCE(
            CASE WHEN normalized_lang = 'uk' THEN bp.content_uk ELSE bp.content_en END,
            ''
          ),
          ts_query,
          'MaxWords=25, MinWords=10'
        )
      ELSE
        LEFT(COALESCE(
          CASE WHEN normalized_lang = 'uk' THEN bp.content_uk ELSE bp.content_en END,
          ''
        ), 150)
    END as snippet,
    '/blog/' || bp.slug as href,
    CASE
      WHEN normalized_lang = 'uk' AND bp.search_vector_uk IS NOT NULL AND ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(bp.search_vector_uk, ts_query)::numeric
      WHEN normalized_lang != 'uk' AND bp.search_vector_en IS NOT NULL AND ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(bp.search_vector_en, ts_query)::numeric
      ELSE 0.5::numeric
    END as relevance,
    ARRAY['blog']::text[] as matched_in
  FROM public.blog_posts bp
  WHERE bp.is_published = true
    AND 'blog' = ANY(search_types)
    AND (
      (ts_query IS NOT NULL AND ts_query != ''::tsquery AND NOT has_complex_wildcard AND (
        (normalized_lang = 'uk' AND bp.search_vector_uk @@ ts_query)
        OR (normalized_lang != 'uk' AND bp.search_vector_en @@ ts_query)
      ))
      OR ((has_complex_wildcard OR length(cleaned_query) <= 3) AND (
        (normalized_lang = 'uk' AND (bp.title_uk ILIKE pattern OR bp.content_uk ILIKE pattern)) OR
        (normalized_lang != 'uk' AND (bp.title_en ILIKE pattern OR bp.content_en ILIKE pattern))
      ))
    )
  ORDER BY relevance DESC
  LIMIT limit_per_type)

  ORDER BY relevance DESC
  LIMIT COALESCE(overall_limit, limit_per_type * array_length(search_types, 1));
END;
$$;

COMMENT ON FUNCTION public.unified_search(text, text, text[], integer, integer) IS
'Advanced unified search with phrase, wildcard, and proximity support.
Uses ''uk'' (ISO 639-1) for Ukrainian, accepts ''ua'' for backward compatibility.';

-- ============================================================================
-- 3. GRANT EXECUTE
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.search_verses_fulltext(text, text, boolean, boolean, boolean, boolean, boolean, uuid[], integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.unified_search(text, text, text[], integer, integer) TO anon, authenticated;

COMMIT;

-- ============================================================================
-- NOTE: This migration updates the advanced search functions with
-- phrase/wildcard/proximity support to use 'uk' instead of 'ua'.
-- The normalize_language_code() helper ensures backward compatibility.
-- ============================================================================
