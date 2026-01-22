-- Fix glossary RPC functions: replace ua -> uk for column names and language defaults

-- ============================================================================
-- 1. Fix get_glossary_terms_grouped function
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_glossary_terms_grouped(
    search_term text DEFAULT ''::text,
    search_language text DEFAULT 'uk'::text,
    result_limit integer DEFAULT 100
)
RETURNS TABLE(
    letter text,
    terms jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    WITH all_synonyms AS (
        SELECT 
            b.title_uk,
            b.title_en,
            b.slug as book_slug,
            b.has_cantos,
            c.chapter_number,
            ca.canto_number,
            v.verse_number,
            v.synonyms_uk,
            v.synonyms_en,
            v.transliteration_uk,
            v.transliteration_en
        FROM verses v
        JOIN chapters c ON v.chapter_id = c.id
        JOIN books b ON c.book_id = b.id
        LEFT JOIN cantos ca ON c.canto_id = ca.id
        WHERE v.deleted_at IS NULL
          AND (
              (search_language = 'uk' AND v.synonyms_uk IS NOT NULL AND v.synonyms_uk != '') OR
              (search_language = 'en' AND v.synonyms_en IS NOT NULL AND v.synonyms_en != '')
          )
    ),
    parsed_terms AS (
        SELECT 
            CASE WHEN search_language = 'uk' THEN title_uk ELSE title_en END as book_title,
            book_slug,
            has_cantos,
            chapter_number,
            canto_number,
            verse_number,
            CASE WHEN search_language = 'uk' THEN transliteration_uk ELSE transliteration_en END as transliteration,
            -- Extract term (before dash) and meaning (after dash)
            trim(split_part(term_line, '—', 1)) as term,
            trim(split_part(term_line, '—', 2)) as meaning
        FROM all_synonyms,
        LATERAL unnest(
            regexp_split_to_array(
                regexp_replace(
                    CASE WHEN search_language = 'uk' THEN synonyms_uk ELSE synonyms_en END,
                    '<[^>]*>', '', 'g'
                ),
                E';\\s*'
            )
        ) AS term_line
        WHERE term_line ~ '—'
    ),
    filtered_terms AS (
        SELECT *
        FROM parsed_terms
        WHERE search_term = '' 
           OR term ILIKE '%' || search_term || '%'
           OR meaning ILIKE '%' || search_term || '%'
    ),
    unique_terms AS (
        SELECT DISTINCT ON (lower(term))
            term,
            meaning,
            book_title,
            book_slug,
            has_cantos,
            chapter_number,
            canto_number,
            verse_number,
            transliteration,
            upper(left(term, 1)) as first_letter
        FROM filtered_terms
        WHERE term IS NOT NULL AND term != ''
        ORDER BY lower(term), book_slug, chapter_number, verse_number
        LIMIT result_limit
    )
    SELECT 
        first_letter as letter,
        jsonb_agg(
            jsonb_build_object(
                'term', unique_terms.term,
                'meaning', unique_terms.meaning,
                'book_title', unique_terms.book_title,
                'book_slug', unique_terms.book_slug,
                'has_cantos', unique_terms.has_cantos,
                'chapter_number', unique_terms.chapter_number,
                'canto_number', unique_terms.canto_number,
                'verse_number', unique_terms.verse_number,
                'transliteration', unique_terms.transliteration
            )
            ORDER BY unique_terms.term
        ) as terms
    FROM unique_terms
    GROUP BY first_letter
    ORDER BY first_letter;
END;
$$;

-- ============================================================================
-- 2. Fix get_glossary_term_details function
-- ============================================================================

DROP FUNCTION IF EXISTS public.get_glossary_term_details(text, text);

CREATE OR REPLACE FUNCTION public.get_glossary_term_details(
    term_to_find text,
    search_language text DEFAULT 'uk'::text
)
RETURNS TABLE(
    term text,
    meaning text,
    book_title text,
    book_slug text,
    has_cantos boolean,
    chapter_number integer,
    canto_number integer,
    verse_number text,
    verse_link text,
    transliteration text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    WITH all_synonyms AS (
        SELECT 
            CASE WHEN search_language = 'uk' THEN b.title_uk ELSE b.title_en END as book_title,
            b.slug as book_slug,
            b.has_cantos,
            c.chapter_number,
            ca.canto_number,
            v.verse_number,
            CASE WHEN search_language = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END as synonyms,
            CASE WHEN search_language = 'uk' THEN v.transliteration_uk ELSE v.transliteration_en END as transliteration
        FROM verses v
        JOIN chapters c ON v.chapter_id = c.id
        JOIN books b ON c.book_id = b.id
        LEFT JOIN cantos ca ON c.canto_id = ca.id
        WHERE v.deleted_at IS NULL
          AND (
              (search_language = 'uk' AND v.synonyms_uk IS NOT NULL AND v.synonyms_uk != '') OR
              (search_language = 'en' AND v.synonyms_en IS NOT NULL AND v.synonyms_en != '')
          )
    ),
    parsed_terms AS (
        SELECT 
            all_synonyms.book_title,
            all_synonyms.book_slug,
            all_synonyms.has_cantos,
            all_synonyms.chapter_number,
            all_synonyms.canto_number,
            all_synonyms.verse_number,
            all_synonyms.transliteration,
            -- Extract term (before dash) and meaning (after dash)
            trim(regexp_replace(split_part(term_line, '—', 1), '<[^>]*>', '', 'g')) as term,
            trim(regexp_replace(split_part(term_line, '—', 2), '<[^>]*>', '', 'g')) as meaning
        FROM all_synonyms,
        LATERAL unnest(
            regexp_split_to_array(
                regexp_replace(synonyms, '<[^>]*>', '', 'g'),
                E';\\s*'
            )
        ) AS term_line
        WHERE term_line ~ '—'
    )
    SELECT 
        parsed_terms.term,
        parsed_terms.meaning,
        parsed_terms.book_title,
        parsed_terms.book_slug,
        parsed_terms.has_cantos,
        parsed_terms.chapter_number,
        parsed_terms.canto_number,
        parsed_terms.verse_number,
        -- Build verse link dynamically
        CASE 
            WHEN parsed_terms.has_cantos THEN
                '/lib/' || parsed_terms.book_slug || '/' || parsed_terms.canto_number || '/' || parsed_terms.chapter_number || '/' || parsed_terms.verse_number
            ELSE
                '/lib/' || parsed_terms.book_slug || '/' || parsed_terms.chapter_number || '/' || parsed_terms.verse_number
        END as verse_link,
        parsed_terms.transliteration
    FROM parsed_terms
    WHERE lower(parsed_terms.term) = lower(term_to_find)
    ORDER BY parsed_terms.book_slug, parsed_terms.canto_number NULLS LAST, parsed_terms.chapter_number, parsed_terms.verse_number;
END;
$$;

-- ============================================================================
-- 3. Grant permissions
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.get_glossary_terms_grouped(text, text, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_glossary_term_details(text, text) TO anon, authenticated;