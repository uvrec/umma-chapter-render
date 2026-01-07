-- ============================================================================
-- FIX: Re-create glossary functions after is_published column exists
-- ============================================================================
-- Problem: The original glossary functions migration (20260104120000) was created
-- before the is_published column was added to chapters (20260105120000).
-- This causes runtime errors when calling the functions.
--
-- Solution: Re-create all glossary functions with a later timestamp to ensure
-- they're created after the is_published column exists.
-- ============================================================================

-- 1. Функція для отримання статистики глосарію
CREATE OR REPLACE FUNCTION public.get_glossary_stats(
  search_language text DEFAULT 'ua'
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
DECLARE
  synonyms_col text;
BEGIN
  IF search_language = 'ua' THEN
    synonyms_col := 'synonyms_ua';
  ELSE
    synonyms_col := 'synonyms_en';
  END IF;

  RETURN QUERY EXECUTE format($query$
    WITH parsed_terms AS (
      SELECT
        b.slug as book_slug,
        CASE WHEN $1 = 'ua' THEN b.title_ua ELSE b.title_en END as book_title,
        TRIM(part) as synonym_part
      FROM public.verses v
      JOIN public.chapters ch ON ch.id = v.chapter_id
      JOIN public.books b ON b.id = ch.book_id
      CROSS JOIN LATERAL unnest(
        string_to_array(
          regexp_replace(COALESCE(v.%I, ''), '<[^>]*>', '', 'g'),
          ';'
        )
      ) AS part
      WHERE COALESCE(ch.is_published, true) = true
        AND v.deleted_at IS NULL
        AND v.%I IS NOT NULL
    ),
    extracted_terms AS (
      SELECT
        book_slug,
        book_title,
        LOWER(TRIM(
          CASE
            WHEN synonym_part LIKE '%% — %%' THEN SPLIT_PART(synonym_part, ' — ', 1)
            WHEN synonym_part LIKE '%% – %%' THEN SPLIT_PART(synonym_part, ' – ', 1)
            WHEN synonym_part LIKE '%% - %%' THEN SPLIT_PART(synonym_part, ' - ', 1)
            WHEN synonym_part LIKE '%%—%%' THEN SPLIT_PART(synonym_part, '—', 1)
            WHEN synonym_part LIKE '%%–%%' THEN SPLIT_PART(synonym_part, '–', 1)
            ELSE synonym_part
          END
        )) as term
      FROM parsed_terms
      WHERE synonym_part != '' AND LENGTH(TRIM(synonym_part)) > 1
    ),
    valid_terms AS (
      SELECT * FROM extracted_terms WHERE term != '' AND LENGTH(term) > 0
    ),
    book_aggregates AS (
      SELECT
        book_slug,
        book_title,
        COUNT(*) as term_count,
        COUNT(DISTINCT term) as unique_term_count
      FROM valid_terms
      GROUP BY book_slug, book_title
    )
    SELECT
      (SELECT COUNT(*) FROM valid_terms)::bigint as total_terms,
      (SELECT COUNT(DISTINCT term) FROM valid_terms)::bigint as unique_terms,
      (SELECT COUNT(DISTINCT book_slug) FROM valid_terms)::bigint as books_count,
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
      ) as book_stats
  $query$,
  synonyms_col, synonyms_col
  )
  USING search_language;
END;
$$;

-- 2. Функція для отримання унікальних термінів (згрупованих) з підрахунком
CREATE OR REPLACE FUNCTION public.get_glossary_terms_grouped(
  search_term text DEFAULT NULL,
  search_translation text DEFAULT NULL,
  search_language text DEFAULT 'ua',
  search_mode text DEFAULT 'contains',
  book_filter text DEFAULT NULL,
  page_number integer DEFAULT 1,
  page_size integer DEFAULT 30
)
RETURNS TABLE(
  term text,
  usage_count bigint,
  books text[],
  sample_meanings text[],
  total_unique_terms bigint
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  synonyms_col text;
  term_pattern text;
  meaning_pattern text;
  offset_val integer;
BEGIN
  IF search_language = 'ua' THEN
    synonyms_col := 'synonyms_ua';
  ELSE
    synonyms_col := 'synonyms_en';
  END IF;

  IF search_mode = 'exact' THEN
    term_pattern := COALESCE(search_term, '%');
    meaning_pattern := COALESCE(search_translation, '%');
  ELSIF search_mode = 'starts_with' THEN
    term_pattern := COALESCE(search_term, '') || '%';
    meaning_pattern := COALESCE(search_translation, '') || '%';
  ELSE
    term_pattern := '%' || COALESCE(search_term, '') || '%';
    meaning_pattern := '%' || COALESCE(search_translation, '') || '%';
  END IF;

  offset_val := (page_number - 1) * page_size;

  RETURN QUERY EXECUTE format($query$
    WITH parsed_terms AS (
      SELECT
        CASE WHEN $5 = 'ua' THEN b.title_ua ELSE b.title_en END as book_title,
        TRIM(part) as synonym_part
      FROM public.verses v
      JOIN public.chapters ch ON ch.id = v.chapter_id
      JOIN public.books b ON b.id = ch.book_id
      CROSS JOIN LATERAL unnest(
        string_to_array(
          regexp_replace(COALESCE(v.%I, ''), '<[^>]*>', '', 'g'),
          ';'
        )
      ) AS part
      WHERE COALESCE(ch.is_published, true) = true
        AND v.deleted_at IS NULL
        AND v.%I IS NOT NULL
        AND ($6 IS NULL OR b.slug = $6)
    ),
    extracted_terms AS (
      SELECT
        book_title,
        TRIM(
          CASE
            WHEN synonym_part LIKE '%% — %%' THEN SPLIT_PART(synonym_part, ' — ', 1)
            WHEN synonym_part LIKE '%% – %%' THEN SPLIT_PART(synonym_part, ' – ', 1)
            WHEN synonym_part LIKE '%% - %%' THEN SPLIT_PART(synonym_part, ' - ', 1)
            WHEN synonym_part LIKE '%%—%%' THEN SPLIT_PART(synonym_part, '—', 1)
            WHEN synonym_part LIKE '%%–%%' THEN SPLIT_PART(synonym_part, '–', 1)
            ELSE synonym_part
          END
        ) as term,
        TRIM(
          CASE
            WHEN synonym_part LIKE '%% — %%' THEN SUBSTRING(synonym_part FROM POSITION(' — ' IN synonym_part) + 3)
            WHEN synonym_part LIKE '%% – %%' THEN SUBSTRING(synonym_part FROM POSITION(' – ' IN synonym_part) + 3)
            WHEN synonym_part LIKE '%% - %%' THEN SUBSTRING(synonym_part FROM POSITION(' - ' IN synonym_part) + 3)
            WHEN synonym_part LIKE '%%—%%' THEN SUBSTRING(synonym_part FROM POSITION('—' IN synonym_part) + 1)
            WHEN synonym_part LIKE '%%–%%' THEN SUBSTRING(synonym_part FROM POSITION('–' IN synonym_part) + 1)
            ELSE ''
          END
        ) as meaning
      FROM parsed_terms
      WHERE synonym_part != '' AND LENGTH(TRIM(synonym_part)) > 1
    ),
    filtered_terms AS (
      SELECT * FROM extracted_terms et
      WHERE et.term != ''
        AND ($1 IS NULL OR $1 = '' OR et.term ILIKE $1)
        AND ($2 IS NULL OR $2 = '' OR et.meaning ILIKE $2)
    ),
    grouped AS (
      SELECT
        LOWER(ft.term) as term_lower,
        ft.term as original_term,
        COUNT(*) as usage_count,
        array_agg(DISTINCT ft.book_title) as books,
        array_agg(DISTINCT ft.meaning) FILTER (WHERE ft.meaning != '') as sample_meanings
      FROM filtered_terms ft
      GROUP BY LOWER(ft.term), ft.term
    ),
    total AS (
      SELECT COUNT(DISTINCT term_lower) as cnt FROM grouped
    )
    SELECT
      g.original_term as term,
      g.usage_count,
      g.books,
      (g.sample_meanings)[1:5] as sample_meanings,
      t.cnt as total_unique_terms
    FROM grouped g
    CROSS JOIN total t
    ORDER BY g.usage_count DESC, g.term_lower
    LIMIT $3 OFFSET $4
  $query$,
  synonyms_col, synonyms_col
  )
  USING term_pattern, meaning_pattern, page_size, offset_val, search_language, book_filter;
END;
$$;

-- 3. Функція для отримання деталей конкретного терміну
CREATE OR REPLACE FUNCTION public.get_glossary_term_details(
  term_text text,
  search_language text DEFAULT 'ua'
)
RETURNS TABLE(
  term text,
  meaning text,
  verse_id uuid,
  verse_number text,
  chapter_number integer,
  canto_number integer,
  book_title text,
  book_slug text,
  verse_link text,
  sanskrit text,
  transliteration text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  synonyms_col text;
  translit_col text;
BEGIN
  IF search_language = 'ua' THEN
    synonyms_col := 'synonyms_ua';
    translit_col := 'transliteration_ua';
  ELSE
    synonyms_col := 'synonyms_en';
    translit_col := 'transliteration_en';
  END IF;

  RETURN QUERY EXECUTE format($query$
    WITH parsed_terms AS (
      SELECT
        v.id as verse_id,
        v.verse_number,
        v.sanskrit,
        COALESCE(v.%I, v.transliteration) as transliteration,
        ch.chapter_number,
        ca.canto_number,
        CASE WHEN $2 = 'ua' THEN b.title_ua ELSE b.title_en END as book_title,
        b.slug as book_slug,
        TRIM(part) as synonym_part
      FROM public.verses v
      JOIN public.chapters ch ON ch.id = v.chapter_id
      JOIN public.books b ON b.id = ch.book_id
      LEFT JOIN public.cantos ca ON ca.id = ch.canto_id
      CROSS JOIN LATERAL unnest(
        string_to_array(
          regexp_replace(COALESCE(v.%I, ''), '<[^>]*>', '', 'g'),
          ';'
        )
      ) AS part
      WHERE COALESCE(ch.is_published, true) = true
        AND v.deleted_at IS NULL
        AND v.%I IS NOT NULL
    ),
    extracted AS (
      SELECT
        pt.*,
        TRIM(
          CASE
            WHEN synonym_part LIKE '%% — %%' THEN SPLIT_PART(synonym_part, ' — ', 1)
            WHEN synonym_part LIKE '%% – %%' THEN SPLIT_PART(synonym_part, ' – ', 1)
            WHEN synonym_part LIKE '%% - %%' THEN SPLIT_PART(synonym_part, ' - ', 1)
            WHEN synonym_part LIKE '%%—%%' THEN SPLIT_PART(synonym_part, '—', 1)
            WHEN synonym_part LIKE '%%–%%' THEN SPLIT_PART(synonym_part, '–', 1)
            ELSE synonym_part
          END
        ) as term,
        TRIM(
          CASE
            WHEN synonym_part LIKE '%% — %%' THEN SUBSTRING(synonym_part FROM POSITION(' — ' IN synonym_part) + 3)
            WHEN synonym_part LIKE '%% – %%' THEN SUBSTRING(synonym_part FROM POSITION(' – ' IN synonym_part) + 3)
            WHEN synonym_part LIKE '%% - %%' THEN SUBSTRING(synonym_part FROM POSITION(' - ' IN synonym_part) + 3)
            WHEN synonym_part LIKE '%%—%%' THEN SUBSTRING(synonym_part FROM POSITION('—' IN synonym_part) + 1)
            WHEN synonym_part LIKE '%%–%%' THEN SUBSTRING(synonym_part FROM POSITION('–' IN synonym_part) + 1)
            ELSE ''
          END
        ) as meaning
      FROM parsed_terms pt
    )
    SELECT
      e.term,
      e.meaning,
      e.verse_id,
      e.verse_number,
      e.chapter_number,
      e.canto_number,
      e.book_title,
      e.book_slug,
      CASE
        WHEN e.canto_number IS NOT NULL THEN
          '/veda-reader/' || e.book_slug || '/canto/' || e.canto_number || '/chapter/' || e.chapter_number || '/' || e.verse_number
        ELSE
          '/veda-reader/' || e.book_slug || '/' || e.chapter_number || '/' || e.verse_number
      END as verse_link,
      e.sanskrit,
      e.transliteration
    FROM extracted e
    WHERE LOWER(e.term) = LOWER($1)
    ORDER BY e.book_title, e.chapter_number, e.verse_number
  $query$,
  translit_col, synonyms_col, synonyms_col
  )
  USING term_text, search_language;
END;
$$;

-- 4. Функція для server-side пошуку термінів глосарію з пагінацією
CREATE OR REPLACE FUNCTION public.search_glossary_terms_v2(
  search_term text DEFAULT NULL,
  search_translation text DEFAULT NULL,
  search_language text DEFAULT 'ua',
  search_mode text DEFAULT 'contains',
  book_filter text DEFAULT NULL,
  page_number integer DEFAULT 1,
  page_size integer DEFAULT 50
)
RETURNS TABLE(
  term text,
  meaning text,
  verse_id uuid,
  verse_number text,
  chapter_number integer,
  canto_number integer,
  book_title text,
  book_slug text,
  verse_link text,
  total_count bigint
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  synonyms_col text;
  term_pattern text;
  meaning_pattern text;
  offset_val integer;
BEGIN
  IF search_language = 'ua' THEN
    synonyms_col := 'synonyms_ua';
  ELSE
    synonyms_col := 'synonyms_en';
  END IF;

  IF search_mode = 'exact' THEN
    term_pattern := COALESCE(search_term, '%');
    meaning_pattern := COALESCE(search_translation, '%');
  ELSIF search_mode = 'starts_with' THEN
    term_pattern := COALESCE(search_term, '') || '%';
    meaning_pattern := COALESCE(search_translation, '') || '%';
  ELSE
    term_pattern := '%' || COALESCE(search_term, '') || '%';
    meaning_pattern := '%' || COALESCE(search_translation, '') || '%';
  END IF;

  offset_val := (page_number - 1) * page_size;

  RETURN QUERY EXECUTE format($query$
    WITH parsed_terms AS (
      SELECT
        v.id as verse_id,
        v.verse_number,
        ch.chapter_number,
        ca.canto_number,
        CASE WHEN $5 = 'ua' THEN b.title_ua ELSE b.title_en END as book_title,
        b.slug as book_slug,
        TRIM(part) as synonym_part
      FROM public.verses v
      JOIN public.chapters ch ON ch.id = v.chapter_id
      JOIN public.books b ON b.id = ch.book_id
      LEFT JOIN public.cantos ca ON ca.id = ch.canto_id
      CROSS JOIN LATERAL unnest(
        string_to_array(
          regexp_replace(COALESCE(v.%I, ''), '<[^>]*>', '', 'g'),
          ';'
        )
      ) AS part
      WHERE COALESCE(ch.is_published, true) = true
        AND v.deleted_at IS NULL
        AND v.%I IS NOT NULL
        AND v.%I != ''
        AND ($6 IS NULL OR b.slug = $6)
    ),
    extracted_terms AS (
      SELECT
        verse_id,
        verse_number,
        chapter_number,
        canto_number,
        book_title,
        book_slug,
        TRIM(
          CASE
            WHEN synonym_part LIKE '%% — %%' THEN SPLIT_PART(synonym_part, ' — ', 1)
            WHEN synonym_part LIKE '%% – %%' THEN SPLIT_PART(synonym_part, ' – ', 1)
            WHEN synonym_part LIKE '%% - %%' THEN SPLIT_PART(synonym_part, ' - ', 1)
            WHEN synonym_part LIKE '%%—%%' THEN SPLIT_PART(synonym_part, '—', 1)
            WHEN synonym_part LIKE '%%–%%' THEN SPLIT_PART(synonym_part, '–', 1)
            ELSE synonym_part
          END
        ) as term,
        TRIM(
          CASE
            WHEN synonym_part LIKE '%% — %%' THEN SUBSTRING(synonym_part FROM POSITION(' — ' IN synonym_part) + 3)
            WHEN synonym_part LIKE '%% – %%' THEN SUBSTRING(synonym_part FROM POSITION(' – ' IN synonym_part) + 3)
            WHEN synonym_part LIKE '%% - %%' THEN SUBSTRING(synonym_part FROM POSITION(' - ' IN synonym_part) + 3)
            WHEN synonym_part LIKE '%%—%%' THEN SUBSTRING(synonym_part FROM POSITION('—' IN synonym_part) + 1)
            WHEN synonym_part LIKE '%%–%%' THEN SUBSTRING(synonym_part FROM POSITION('–' IN synonym_part) + 1)
            ELSE ''
          END
        ) as meaning
      FROM parsed_terms
      WHERE synonym_part != ''
        AND LENGTH(TRIM(synonym_part)) > 1
    ),
    filtered_terms AS (
      SELECT
        et.*,
        CASE
          WHEN et.canto_number IS NOT NULL THEN
            '/veda-reader/' || et.book_slug || '/canto/' || et.canto_number || '/chapter/' || et.chapter_number || '/' || et.verse_number
          ELSE
            '/veda-reader/' || et.book_slug || '/' || et.chapter_number || '/' || et.verse_number
        END as verse_link
      FROM extracted_terms et
      WHERE et.term != ''
        AND LENGTH(et.term) > 0
        AND ($1 IS NULL OR $1 = '' OR et.term ILIKE $1)
        AND ($2 IS NULL OR $2 = '' OR et.meaning ILIKE $2)
    ),
    counted AS (
      SELECT COUNT(*) as cnt FROM filtered_terms
    )
    SELECT
      ft.term,
      ft.meaning,
      ft.verse_id,
      ft.verse_number,
      ft.chapter_number,
      ft.canto_number,
      ft.book_title,
      ft.book_slug,
      ft.verse_link,
      c.cnt as total_count
    FROM filtered_terms ft
    CROSS JOIN counted c
    ORDER BY LOWER(ft.term), ft.book_title, ft.chapter_number, ft.verse_number
    LIMIT $3 OFFSET $4
  $query$,
  synonyms_col, synonyms_col, synonyms_col
  )
  USING term_pattern, meaning_pattern, page_size, offset_val, search_language, book_filter;
END;
$$;

-- Comments
COMMENT ON FUNCTION public.get_glossary_stats IS 'Returns glossary statistics: total terms, unique terms, books count, and per-book stats.';
COMMENT ON FUNCTION public.get_glossary_terms_grouped IS 'Returns unique glossary terms grouped with usage counts and associated books.';
COMMENT ON FUNCTION public.get_glossary_term_details IS 'Returns all occurrences of a specific term across verses with context.';
COMMENT ON FUNCTION public.search_glossary_terms_v2 IS 'Server-side glossary term search with pagination and filtering.';
