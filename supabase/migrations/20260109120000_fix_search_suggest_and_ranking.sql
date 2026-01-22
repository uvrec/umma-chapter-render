-- ============================================================================
-- FIX: search_suggest_terms та unified_search покращення
-- ============================================================================
-- Цей migration виправляє:
-- 1. search_suggest_terms - видаляємо непотрібний EXECUTE, додаємо COALESCE
-- 2. unified_search - уніфікуємо нормалізацію рангу (додаємо factor 32)
-- ============================================================================

-- ============================================================================
-- 1. ВИПРАВЛЕНА ФУНКЦІЯ search_suggest_terms (без EXECUTE, з COALESCE)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.search_suggest_terms(
  search_prefix text,
  language_code text DEFAULT 'uk',
  limit_count integer DEFAULT 10
)
RETURNS TABLE(
  suggestion text,
  frequency integer,
  source text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Повертаємо популярні терміни що починаються з префіксу
  -- Використовуємо COALESCE для безпечної обробки NULL значень
  RETURN QUERY
  WITH all_suggestions AS (
    -- Терміни з глосарію
    SELECT DISTINCT
      LOWER(TRIM(SPLIT_PART(SPLIT_PART(line, '—', 1), ':', 1))) as term,
      'glossary' as src
    FROM public.verses v
    CROSS JOIN LATERAL unnest(
      string_to_array(
        COALESCE(
          CASE
            WHEN language_code = 'uk' THEN v.synonyms_uk
            ELSE v.synonyms_en
          END,
          ''
        ),
        E'\n'
      )
    ) AS line
    WHERE v.deleted_at IS NULL
      AND (
        (language_code = 'uk' AND v.synonyms_uk IS NOT NULL) OR
        (language_code <> 'uk' AND v.synonyms_en IS NOT NULL)
      )
      AND LOWER(line) LIKE LOWER(search_prefix) || '%'
  )
  SELECT
    term as suggestion,
    COUNT(*)::integer as frequency,
    src as source
  FROM all_suggestions
  WHERE term != '' AND LENGTH(term) > 2
  GROUP BY term, src
  ORDER BY frequency DESC, term
  LIMIT limit_count;
END;
$$;

-- ============================================================================
-- 2. ВИПРАВЛЕНА ФУНКЦІЯ unified_search (уніфікована нормалізація рангу)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.unified_search(
  search_query text,
  language_code text DEFAULT 'uk',
  search_types text[] DEFAULT ARRAY['verses', 'blog', 'glossary'],
  limit_per_type integer DEFAULT 10,
  overall_limit integer DEFAULT NULL  -- NULL = no overall limit, uses limit_per_type * types count
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
  search_config text;
  pattern text;
BEGIN
  -- Конфіг для мови (simple_unaccent для accent-insensitive пошуку українською)
  IF language_code = 'uk' THEN
    search_config := 'public.simple_unaccent';
  ELSE
    search_config := 'english';
  END IF;

  ts_query := plainto_tsquery(search_config, search_query);
  pattern := '%' || search_query || '%';

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
    CASE WHEN language_code = 'uk' THEN ch.title_uk ELSE ch.title_en END as subtitle,
    ts_headline(
      search_config,
      COALESCE(
        CASE WHEN language_code = 'uk' THEN v.translation_uk ELSE v.translation_en END,
        ''
      ),
      ts_query,
      'MaxWords=25, MinWords=10'
    ) as snippet,
    CASE
      WHEN ca.canto_number IS NOT NULL THEN
        '/veda-reader/' || b.slug || '/canto/' || ca.canto_number || '/chapter/' || ch.chapter_number || '/' || v.verse_number
      ELSE
        '/veda-reader/' || b.slug || '/' || ch.chapter_number || '/' || v.verse_number
    END as href,
    -- Уніфіковано з search_verses_fulltext: використовуємо нормалізацію 32
    CASE
      WHEN language_code = 'uk' AND v.search_vector_uk IS NOT NULL THEN
        ts_rank_cd(v.search_vector_uk, ts_query, 32)::numeric
      WHEN language_code != 'uk' AND v.search_vector_en IS NOT NULL THEN
        ts_rank_cd(v.search_vector_en, ts_query, 32)::numeric
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
      (language_code = 'uk' AND v.search_vector_uk @@ ts_query)
      OR (language_code != 'uk' AND v.search_vector_en @@ ts_query)
      OR (length(search_query) <= 3 AND (
        (language_code = 'uk' AND v.translation_uk ILIKE pattern) OR
        (language_code != 'uk' AND v.translation_en ILIKE pattern)
      ))
    )
  ORDER BY relevance DESC
  LIMIT limit_per_type)

  UNION ALL

  -- Пошук у блозі
  (SELECT
    'blog'::text as result_type,
    bp.id as result_id,
    CASE WHEN language_code = 'uk' THEN bp.title_uk ELSE bp.title_en END as title,
    CASE WHEN language_code = 'uk' THEN bp.excerpt_uk ELSE bp.excerpt_en END as subtitle,
    ts_headline(
      search_config,
      COALESCE(
        CASE WHEN language_code = 'uk' THEN bp.content_uk ELSE bp.content_en END,
        ''
      ),
      ts_query,
      'MaxWords=25, MinWords=10'
    ) as snippet,
    '/blog/' || bp.slug as href,
    -- Уніфіковано з search_verses_fulltext: використовуємо нормалізацію 32
    CASE
      WHEN language_code = 'uk' AND bp.search_vector_uk IS NOT NULL THEN
        ts_rank_cd(bp.search_vector_uk, ts_query, 32)::numeric
      WHEN language_code != 'uk' AND bp.search_vector_en IS NOT NULL THEN
        ts_rank_cd(bp.search_vector_en, ts_query, 32)::numeric
      ELSE 0.5::numeric
    END as relevance,
    ARRAY['blog']::text[] as matched_in
  FROM public.blog_posts bp
  WHERE bp.is_published = true
    AND 'blog' = ANY(search_types)
    AND (
      (language_code = 'uk' AND bp.search_vector_uk @@ ts_query)
      OR (language_code != 'uk' AND bp.search_vector_en @@ ts_query)
      OR (length(search_query) <= 3 AND (
        (language_code = 'uk' AND (bp.title_uk ILIKE pattern OR bp.content_uk ILIKE pattern)) OR
        (language_code != 'uk' AND (bp.title_en ILIKE pattern OR bp.content_en ILIKE pattern))
      ))
    )
  ORDER BY relevance DESC
  LIMIT limit_per_type)

  ORDER BY relevance DESC
  -- Глобальний ліміт: або вказаний overall_limit, або limit_per_type * кількість типів
  LIMIT COALESCE(overall_limit, limit_per_type * array_length(search_types, 1));
END;
$$;

-- ============================================================================
-- 3. КОМЕНТАРІ
-- ============================================================================

COMMENT ON FUNCTION public.search_suggest_terms IS
'Автокомпліт/підказки для пошукового поля. Виправлено: використовує COALESCE для безпечної обробки NULL.';

COMMENT ON FUNCTION public.unified_search IS
'Уніфікований пошук по всьому сайту (вірші, блог). Виправлено: уніфіковано нормалізацію рангу (32) з search_verses_fulltext.';
