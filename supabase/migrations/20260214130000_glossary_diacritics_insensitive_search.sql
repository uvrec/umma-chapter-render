-- ============================================================================
-- Diacritics-insensitive glossary search
-- ============================================================================
-- Problem: Searching "танра" does not find "та̄н̇ра" (Cyrillic with combining
-- diacritical marks U+0300-U+036F). Similarly, "tanra" doesn't find "tāṅra"
-- (IAST Latin precomposed characters).
--
-- Solution: Create a strip_diacritics() helper that:
-- 1. Uses unaccent() for Latin precomposed characters (ā→a, ś→s)
-- 2. Uses regexp_replace() to strip combining marks (Cyrillic а̄→а, н̇→н)
-- Then apply it to both the search pattern and stored terms in ILIKE filters.
-- ============================================================================

-- Helper function: strip all diacritical marks (combining + precomposed)
CREATE OR REPLACE FUNCTION public.strip_diacritics(input_text text)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT regexp_replace(
    unaccent(input_text),
    E'[\u0300-\u036F]', '', 'g'
  );
$$;

COMMENT ON FUNCTION public.strip_diacritics IS
'Strips diacritical marks from text: unaccent for Latin precomposed (ā→a), regexp_replace for combining marks (а̄→а). Used for diacritics-insensitive glossary search.';

-- Grant access
GRANT EXECUTE ON FUNCTION public.strip_diacritics(text) TO anon, authenticated;

-- ============================================================================
-- Update search_glossary_terms_v2: apply strip_diacritics to term filter
-- ============================================================================
CREATE OR REPLACE FUNCTION public.search_glossary_terms_v2(
  search_term text DEFAULT NULL,
  search_translation text DEFAULT NULL,
  search_language text DEFAULT 'uk',
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
  term_pattern text;
  meaning_pattern text;
  offset_val integer;
BEGIN
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

  RETURN QUERY
    WITH parsed_terms AS (
      -- Parse from synonyms_uk
      SELECT
        v.id as p_verse_id,
        v.verse_number as p_verse_number,
        ch.chapter_number as p_chapter_number,
        ca.canto_number as p_canto_number,
        CASE WHEN search_language = 'uk' THEN b.title_uk ELSE b.title_en END as p_book_title,
        b.slug as p_book_slug,
        TRIM(part) as synonym_part
      FROM public.verses v
      JOIN public.chapters ch ON ch.id = v.chapter_id
      JOIN public.books b ON b.id = ch.book_id
      LEFT JOIN public.cantos ca ON ca.id = ch.canto_id
      CROSS JOIN LATERAL unnest(
        string_to_array(
          regexp_replace(COALESCE(v.synonyms_uk, ''), '<[^>]*>', '', 'g'),
          ';'
        )
      ) AS part
      WHERE COALESCE(ch.is_published, true) = true
        AND v.deleted_at IS NULL
        AND v.synonyms_uk IS NOT NULL
        AND v.synonyms_uk != ''
        AND (book_filter IS NULL OR b.slug = book_filter)

      UNION ALL

      -- Parse from synonyms_en
      SELECT
        v.id as p_verse_id,
        v.verse_number as p_verse_number,
        ch.chapter_number as p_chapter_number,
        ca.canto_number as p_canto_number,
        CASE WHEN search_language = 'uk' THEN b.title_uk ELSE b.title_en END as p_book_title,
        b.slug as p_book_slug,
        TRIM(part) as synonym_part
      FROM public.verses v
      JOIN public.chapters ch ON ch.id = v.chapter_id
      JOIN public.books b ON b.id = ch.book_id
      LEFT JOIN public.cantos ca ON ca.id = ch.canto_id
      CROSS JOIN LATERAL unnest(
        string_to_array(
          regexp_replace(COALESCE(v.synonyms_en, ''), '<[^>]*>', '', 'g'),
          ';'
        )
      ) AS part
      WHERE COALESCE(ch.is_published, true) = true
        AND v.deleted_at IS NULL
        AND v.synonyms_en IS NOT NULL
        AND v.synonyms_en != ''
        AND (book_filter IS NULL OR b.slug = book_filter)
    ),
    extracted_terms AS (
      SELECT
        pt.p_verse_id,
        pt.p_verse_number,
        pt.p_chapter_number,
        pt.p_canto_number,
        pt.p_book_title,
        pt.p_book_slug,
        regexp_replace(
          regexp_replace(
            TRIM(
              CASE
                WHEN pt.synonym_part LIKE '% — %' THEN SPLIT_PART(pt.synonym_part, ' — ', 1)
                WHEN pt.synonym_part LIKE '% – %' THEN SPLIT_PART(pt.synonym_part, ' – ', 1)
                WHEN pt.synonym_part LIKE '% - %' THEN SPLIT_PART(pt.synonym_part, ' - ', 1)
                WHEN pt.synonym_part LIKE '%—%' THEN SPLIT_PART(pt.synonym_part, '—', 1)
                WHEN pt.synonym_part LIKE '%–%' THEN SPLIT_PART(pt.synonym_part, '–', 1)
                ELSE pt.synonym_part
              END
            ),
            '/\*.*?\*/', '', 'g'
          ),
          '[\{\}\(\)\[\]<>"\|\\\/\*]', '', 'g'
        ) as p_term,
        TRIM(
          CASE
            WHEN pt.synonym_part LIKE '% — %' THEN SUBSTRING(pt.synonym_part FROM POSITION(' — ' IN pt.synonym_part) + 3)
            WHEN pt.synonym_part LIKE '% – %' THEN SUBSTRING(pt.synonym_part FROM POSITION(' – ' IN pt.synonym_part) + 3)
            WHEN pt.synonym_part LIKE '% - %' THEN SUBSTRING(pt.synonym_part FROM POSITION(' - ' IN pt.synonym_part) + 3)
            WHEN pt.synonym_part LIKE '%—%' THEN SUBSTRING(pt.synonym_part FROM POSITION('—' IN pt.synonym_part) + 1)
            WHEN pt.synonym_part LIKE '%–%' THEN SUBSTRING(pt.synonym_part FROM POSITION('–' IN pt.synonym_part) + 1)
            ELSE ''
          END
        ) as p_meaning
      FROM parsed_terms pt
      WHERE pt.synonym_part != ''
        AND LENGTH(TRIM(pt.synonym_part)) > 1
    ),
    valid_terms AS (
      SELECT DISTINCT et.p_verse_id, et.p_verse_number, et.p_chapter_number, et.p_canto_number, et.p_book_title, et.p_book_slug, et.p_term, et.p_meaning
      FROM extracted_terms et
      WHERE et.p_term != ''
        AND LENGTH(et.p_term) > 0
        AND et.p_term ~ '[a-zA-Zа-яА-ЯіїєІЇЄāīūṛṝḷḹēōṃḥśṣṭḍṇñṅĀĪŪṚṜḶḸĒŌṂḤŚṢṬḌṆÑṄ]'
    ),
    filtered_terms AS (
      SELECT
        vt.p_verse_id,
        vt.p_verse_number,
        vt.p_chapter_number,
        vt.p_canto_number,
        vt.p_book_title,
        vt.p_book_slug,
        vt.p_term,
        vt.p_meaning,
        CASE
          WHEN vt.p_canto_number IS NOT NULL THEN
            '/veda-reader/' || vt.p_book_slug || '/canto/' || vt.p_canto_number || '/chapter/' || vt.p_chapter_number || '/' || vt.p_verse_number
          ELSE
            '/veda-reader/' || vt.p_book_slug || '/' || vt.p_chapter_number || '/' || vt.p_verse_number
        END as p_verse_link
      FROM valid_terms vt
      WHERE (term_pattern = '%' OR term_pattern = '%%'
             OR strip_diacritics(vt.p_term) ILIKE strip_diacritics(term_pattern))
        AND (meaning_pattern = '%' OR meaning_pattern = '%%' OR vt.p_meaning ILIKE meaning_pattern)
    ),
    counted AS (
      SELECT COUNT(*) as cnt FROM filtered_terms
    )
    SELECT
      ft.p_term,
      ft.p_meaning,
      ft.p_verse_id,
      ft.p_verse_number,
      ft.p_chapter_number,
      ft.p_canto_number,
      ft.p_book_title,
      ft.p_book_slug,
      ft.p_verse_link,
      c.cnt as total_count
    FROM filtered_terms ft
    CROSS JOIN counted c
    ORDER BY LOWER(ft.p_term), ft.p_book_title, ft.p_chapter_number, ft.p_verse_number
    LIMIT page_size OFFSET offset_val;
END;
$$;

-- ============================================================================
-- Update get_glossary_terms_grouped: apply strip_diacritics to term filter
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_glossary_terms_grouped(
  search_term text DEFAULT NULL,
  search_translation text DEFAULT NULL,
  search_language text DEFAULT 'uk',
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
  term_pattern text;
  meaning_pattern text;
  offset_val integer;
BEGIN
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

  RETURN QUERY
    WITH parsed_terms AS (
      -- Search in synonyms_uk column
      SELECT
        CASE WHEN search_language = 'uk' THEN b.title_uk ELSE b.title_en END as book_title,
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
        AND (book_filter IS NULL OR b.slug = book_filter)

      UNION ALL

      -- Search in synonyms_en column
      SELECT
        CASE WHEN search_language = 'uk' THEN b.title_uk ELSE b.title_en END as book_title,
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
        AND (book_filter IS NULL OR b.slug = book_filter)
    ),
    extracted_terms AS (
      SELECT
        pt.book_title,
        regexp_replace(
          regexp_replace(
            TRIM(
              CASE
                WHEN pt.synonym_part LIKE '% — %' THEN SPLIT_PART(pt.synonym_part, ' — ', 1)
                WHEN pt.synonym_part LIKE '% – %' THEN SPLIT_PART(pt.synonym_part, ' – ', 1)
                WHEN pt.synonym_part LIKE '% - %' THEN SPLIT_PART(pt.synonym_part, ' - ', 1)
                WHEN pt.synonym_part LIKE '%—%' THEN SPLIT_PART(pt.synonym_part, '—', 1)
                WHEN pt.synonym_part LIKE '%–%' THEN SPLIT_PART(pt.synonym_part, '–', 1)
                ELSE pt.synonym_part
              END
            ),
            '/\*.*?\*/', '', 'g'
          ),
          '[\{\}\(\)\[\]<>"\|\\\/\*]', '', 'g'
        ) as term,
        TRIM(
          CASE
            WHEN pt.synonym_part LIKE '% — %' THEN SUBSTRING(pt.synonym_part FROM POSITION(' — ' IN pt.synonym_part) + 3)
            WHEN pt.synonym_part LIKE '% – %' THEN SUBSTRING(pt.synonym_part FROM POSITION(' – ' IN pt.synonym_part) + 3)
            WHEN pt.synonym_part LIKE '% - %' THEN SUBSTRING(pt.synonym_part FROM POSITION(' - ' IN pt.synonym_part) + 3)
            WHEN pt.synonym_part LIKE '%—%' THEN SUBSTRING(pt.synonym_part FROM POSITION('—' IN pt.synonym_part) + 1)
            WHEN pt.synonym_part LIKE '%–%' THEN SUBSTRING(pt.synonym_part FROM POSITION('–' IN pt.synonym_part) + 1)
            ELSE ''
          END
        ) as meaning
      FROM parsed_terms pt
      WHERE pt.synonym_part != '' AND LENGTH(TRIM(pt.synonym_part)) > 1
    ),
    valid_terms AS (
      SELECT DISTINCT et.book_title, et.term, et.meaning
      FROM extracted_terms et
      WHERE et.term != ''
        AND LENGTH(TRIM(et.term)) > 0
        AND et.term ~ '[a-zA-Zа-яА-ЯіїєІЇЄāīūṛṝḷḹēōṃḥśṣṭḍṇñṅĀĪŪṚṜḶḸĒŌṂḤŚṢṬḌṆÑṄ]'
    ),
    filtered_terms AS (
      SELECT * FROM valid_terms vt
      WHERE (term_pattern = '%' OR term_pattern = '%%'
             OR strip_diacritics(vt.term) ILIKE strip_diacritics(term_pattern))
        AND (meaning_pattern = '%' OR meaning_pattern = '%%' OR vt.meaning ILIKE meaning_pattern)
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
    LIMIT page_size OFFSET offset_val;
END;
$$;

-- Re-grant access (SECURITY DEFINER functions re-created)
GRANT EXECUTE ON FUNCTION public.search_glossary_terms_v2(text, text, text, text, text, integer, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_glossary_terms_grouped(text, text, text, text, text, integer, integer) TO anon, authenticated;
