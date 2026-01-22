-- Виправлення логіки у функції get_glossary_terms_grouped (7 параметрів)
-- Проблема: WHERE search_language = 'ua' → має бути 'uk' або перевірка параметра

CREATE OR REPLACE FUNCTION public.get_glossary_terms_grouped(
  search_term text, 
  search_translation text, 
  search_language text, 
  search_mode text, 
  book_filter text, 
  page_number integer, 
  page_size integer
)
RETURNS TABLE(group_key text, items jsonb, total_count bigint)
LANGUAGE plpgsql
STABLE
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  WITH source AS (
    SELECT * FROM (
      -- Якщо мова українська (uk або ua для зворотної сумісності) - беремо з _uk таблиці
      SELECT book_slug, book_title, term 
      FROM public.glossary_stats_cache_uk 
      WHERE search_language IN ('uk', 'ua')
      UNION ALL
      -- Якщо англійська - беремо з _en таблиці
      SELECT book_slug, book_title, term 
      FROM public.glossary_stats_cache_en 
      WHERE search_language NOT IN ('uk', 'ua')
    ) s
  ),
  filtered AS (
    SELECT s.book_slug, s.book_title, s.term
    FROM source s
    WHERE (search_term IS NULL OR s.term ILIKE '%' || search_term || '%')
      AND (book_filter IS NULL OR s.book_slug = book_filter)
  ),
  counted AS (
    SELECT COUNT(*)::bigint AS total_count FROM filtered
  ),
  paged AS (
    SELECT * FROM filtered
    ORDER BY term
    OFFSET GREATEST(COALESCE(page_number,1)-1,0) * GREATEST(COALESCE(page_size,50),1)
    LIMIT GREATEST(COALESCE(page_size,50),1)
  )
  SELECT
    p.book_slug AS group_key,
    jsonb_agg(
      jsonb_build_object(
        'book_slug', p.book_slug,
        'book_title', p.book_title,
        'term', p.term
      )
      ORDER BY p.term
    ) AS items,
    (SELECT total_count FROM counted) AS total_count
  FROM paged p
  GROUP BY p.book_slug;
END;
$function$;