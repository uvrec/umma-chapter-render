-- ============================================================================
-- Optimization: Materialized view for glossary stats
-- ============================================================================
-- Problem: get_glossary_stats parses ALL verses on every call, which is slow
-- Solution: Create a materialized view that pre-computes the stats
-- ============================================================================

-- 1. Create materialized view for glossary stats (Ukrainian)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.glossary_stats_cache_uk AS
WITH parsed_terms AS (
  -- Parse terms from synonyms_uk
  SELECT
    b.slug as book_slug,
    b.title_uk as book_title,
    TRIM(part) as synonym_part
  FROM public.verses v
  JOIN public.chapters ch ON ch.id = v.chapter_id
  JOIN public.books b ON b.id = ch.book_id
  CROSS JOIN LATERAL unnest(
    string_to_array(
      regexp_replace(COALESCE(v.synonyms_uk, ''), '<[^>]*>', '', 'g'),
      ';'
    )
  ) AS part
  WHERE COALESCE(ch.is_published, true) = true
    AND v.deleted_at IS NULL
    AND v.synonyms_uk IS NOT NULL

  UNION ALL

  -- Parse terms from synonyms_en
  SELECT
    b.slug as book_slug,
    b.title_uk as book_title,
    TRIM(part) as synonym_part
  FROM public.verses v
  JOIN public.chapters ch ON ch.id = v.chapter_id
  JOIN public.books b ON b.id = ch.book_id
  CROSS JOIN LATERAL unnest(
    string_to_array(
      regexp_replace(COALESCE(v.synonyms_en, ''), '<[^>]*>', '', 'g'),
      ';'
    )
  ) AS part
  WHERE COALESCE(ch.is_published, true) = true
    AND v.deleted_at IS NULL
    AND v.synonyms_en IS NOT NULL
),
extracted_terms AS (
  SELECT
    book_slug,
    book_title,
    LOWER(
      regexp_replace(
        regexp_replace(
          TRIM(
            CASE
              WHEN synonym_part LIKE '% — %' THEN SPLIT_PART(synonym_part, ' — ', 1)
              WHEN synonym_part LIKE '% – %' THEN SPLIT_PART(synonym_part, ' – ', 1)
              WHEN synonym_part LIKE '% - %' THEN SPLIT_PART(synonym_part, ' - ', 1)
              WHEN synonym_part LIKE '%—%' THEN SPLIT_PART(synonym_part, '—', 1)
              WHEN synonym_part LIKE '%–%' THEN SPLIT_PART(synonym_part, '–', 1)
              ELSE synonym_part
            END
          ),
          '/\*.*?\*/', '', 'g'
        ),
        '[\{\}\(\)\[\]<>"\|\\\/\*]', '', 'g'
      )
    ) as term
  FROM parsed_terms
  WHERE synonym_part != '' AND LENGTH(TRIM(synonym_part)) > 1
),
valid_terms AS (
  SELECT DISTINCT book_slug, book_title, term
  FROM extracted_terms
  WHERE term != ''
    AND LENGTH(term) > 0
    AND term ~ '[a-zA-Zа-яА-ЯіїєІЇЄāīūṛṝḷḹēōṃḥśṣṭḍṇñṅĀĪŪṚṜḶḸĒŌṂḤŚṢṬḌṆÑṄ]'
)
SELECT
  book_slug,
  book_title,
  term
FROM valid_terms;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_glossary_stats_cache_uk_term ON public.glossary_stats_cache_uk(term);
CREATE INDEX IF NOT EXISTS idx_glossary_stats_cache_uk_book ON public.glossary_stats_cache_uk(book_slug);

-- 2. Create materialized view for glossary stats (English)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.glossary_stats_cache_en AS
WITH parsed_terms AS (
  SELECT
    b.slug as book_slug,
    b.title_en as book_title,
    TRIM(part) as synonym_part
  FROM public.verses v
  JOIN public.chapters ch ON ch.id = v.chapter_id
  JOIN public.books b ON b.id = ch.book_id
  CROSS JOIN LATERAL unnest(
    string_to_array(
      regexp_replace(COALESCE(v.synonyms_uk, ''), '<[^>]*>', '', 'g'),
      ';'
    )
  ) AS part
  WHERE COALESCE(ch.is_published, true) = true
    AND v.deleted_at IS NULL
    AND v.synonyms_uk IS NOT NULL

  UNION ALL

  SELECT
    b.slug as book_slug,
    b.title_en as book_title,
    TRIM(part) as synonym_part
  FROM public.verses v
  JOIN public.chapters ch ON ch.id = v.chapter_id
  JOIN public.books b ON b.id = ch.book_id
  CROSS JOIN LATERAL unnest(
    string_to_array(
      regexp_replace(COALESCE(v.synonyms_en, ''), '<[^>]*>', '', 'g'),
      ';'
    )
  ) AS part
  WHERE COALESCE(ch.is_published, true) = true
    AND v.deleted_at IS NULL
    AND v.synonyms_en IS NOT NULL
),
extracted_terms AS (
  SELECT
    book_slug,
    book_title,
    LOWER(
      regexp_replace(
        regexp_replace(
          TRIM(
            CASE
              WHEN synonym_part LIKE '% — %' THEN SPLIT_PART(synonym_part, ' — ', 1)
              WHEN synonym_part LIKE '% – %' THEN SPLIT_PART(synonym_part, ' – ', 1)
              WHEN synonym_part LIKE '% - %' THEN SPLIT_PART(synonym_part, ' - ', 1)
              WHEN synonym_part LIKE '%—%' THEN SPLIT_PART(synonym_part, '—', 1)
              WHEN synonym_part LIKE '%–%' THEN SPLIT_PART(synonym_part, '–', 1)
              ELSE synonym_part
            END
          ),
          '/\*.*?\*/', '', 'g'
        ),
        '[\{\}\(\)\[\]<>"\|\\\/\*]', '', 'g'
      )
    ) as term
  FROM parsed_terms
  WHERE synonym_part != '' AND LENGTH(TRIM(synonym_part)) > 1
),
valid_terms AS (
  SELECT DISTINCT book_slug, book_title, term
  FROM extracted_terms
  WHERE term != ''
    AND LENGTH(term) > 0
    AND term ~ '[a-zA-Zа-яА-ЯіїєІЇЄāīūṛṝḷḹēōṃḥśṣṭḍṇñṅĀĪŪṚṜḶḸĒŌṂḤŚṢṬḌṆÑṄ]'
)
SELECT
  book_slug,
  book_title,
  term
FROM valid_terms;

CREATE INDEX IF NOT EXISTS idx_glossary_stats_cache_en_term ON public.glossary_stats_cache_en(term);
CREATE INDEX IF NOT EXISTS idx_glossary_stats_cache_en_book ON public.glossary_stats_cache_en(book_slug);

-- 3. Create optimized get_glossary_stats function using the cached view
CREATE OR REPLACE FUNCTION public.get_glossary_stats(
  search_language text DEFAULT 'uk'
)
RETURNS TABLE(
  total_terms bigint,
  unique_terms bigint,
  books_count bigint,
  book_stats jsonb
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF search_language = 'uk' THEN
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

-- 4. Create function to refresh the materialized views
CREATE OR REPLACE FUNCTION public.refresh_glossary_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.glossary_stats_cache_uk;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.glossary_stats_cache_en;
END;
$$;

-- 5. Add unique index for concurrent refresh
CREATE UNIQUE INDEX IF NOT EXISTS idx_glossary_stats_cache_uk_unique
  ON public.glossary_stats_cache_uk(book_slug, term);
CREATE UNIQUE INDEX IF NOT EXISTS idx_glossary_stats_cache_en_unique
  ON public.glossary_stats_cache_en(book_slug, term);

-- Comments
COMMENT ON MATERIALIZED VIEW public.glossary_stats_cache_uk IS 'Cached glossary terms for Ukrainian language - refresh with refresh_glossary_cache()';
COMMENT ON MATERIALIZED VIEW public.glossary_stats_cache_en IS 'Cached glossary terms for English language - refresh with refresh_glossary_cache()';
COMMENT ON FUNCTION public.refresh_glossary_cache IS 'Refreshes the glossary stats materialized views. Call after importing new verses.';
