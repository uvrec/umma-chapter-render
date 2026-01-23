-- ============================================================================
-- ПІДТРИМКА ФРАЗОВОГО ПОШУКУ ТА BOOLEAN ОПЕРАТОРІВ
-- ============================================================================
-- Цей migration оновлює функції пошуку для підтримки:
-- 1. Фразовий пошук: "exact phrase"
-- 2. Boolean OR: word1 word2 (пробіл = OR)
-- 3. Boolean AND: word1 AND word2 або +word
-- 4. Boolean NOT: -word (виключити)
--
-- Приклади:
--   "чисте віддане служіння"     - точна фраза
--   крішна арджуна               - крішна OR арджуна
--   крішна AND арджуна           - обов'язково обидва
--   крішна -арджуна              - крішна але НЕ арджуна
--   "Supreme Lord" AND devotion  - комбінація
-- ============================================================================

-- ============================================================================
-- DROP EXISTING FUNCTIONS (required when changing return types)
-- ============================================================================
-- PostgreSQL cannot change return type with CREATE OR REPLACE, must drop first
DROP FUNCTION IF EXISTS public.search_verses_fulltext(TEXT, TEXT, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, UUID[], INTEGER);
DROP FUNCTION IF EXISTS public.unified_search(TEXT, TEXT, TEXT[], INTEGER, INTEGER);

-- ============================================================================
-- 1. ДОПОМІЖНА ФУНКЦІЯ ДЛЯ ПАРСИНГУ ЗАПИТУ
-- ============================================================================
-- websearch_to_tsquery може викидати помилки при некоректному синтаксисі
-- Ця функція обробляє помилки та fallback на plainto_tsquery

CREATE OR REPLACE FUNCTION public.safe_websearch_to_tsquery(
  config regconfig,
  query_text text
)
RETURNS tsquery
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  result tsquery;
BEGIN
  -- Спочатку пробуємо websearch_to_tsquery (підтримує фрази та boolean)
  BEGIN
    result := websearch_to_tsquery(config, query_text);
    RETURN result;
  EXCEPTION WHEN OTHERS THEN
    -- Якщо помилка синтаксису, fallback на plainto_tsquery
    BEGIN
      result := plainto_tsquery(config, query_text);
      RETURN result;
    EXCEPTION WHEN OTHERS THEN
      -- Крайній випадок - повертаємо порожній запит
      RETURN ''::tsquery;
    END;
  END;
END;
$$;

COMMENT ON FUNCTION public.safe_websearch_to_tsquery IS
'Безпечний парсинг пошукового запиту з підтримкою фраз та boolean операторів.
При помилці синтаксису fallback на plainto_tsquery.';

-- ============================================================================
-- 2. ОНОВЛЕНА ФУНКЦІЯ ПОШУКУ ВІРШІВ З ПІДТРИМКОЮ ФРАЗ
-- ============================================================================

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
BEGIN
  -- Визначаємо конфіг для мови
  IF language_code = 'uk' THEN
    search_config := 'public.simple_unaccent'::regconfig;
  ELSE
    search_config := 'english'::regconfig;
  END IF;

  -- Очищаємо запит від зайвих пробілів
  cleaned_query := TRIM(regexp_replace(search_query, '\s+', ' ', 'g'));

  -- Створюємо tsquery з підтримкою фраз та boolean операторів
  -- websearch_to_tsquery підтримує:
  --   "phrase"      -> фразовий пошук
  --   word1 word2   -> OR
  --   word1 AND word2 або +word -> AND
  --   -word         -> NOT
  ts_query := safe_websearch_to_tsquery(search_config, cleaned_query);

  -- Fallback pattern для ILIKE (для коротких запитів або фразового пошуку)
  -- Видаляємо лапки для ILIKE паттерну
  pattern := '%' || regexp_replace(cleaned_query, '"', '', 'g') || '%';

  RETURN QUERY
  SELECT
    v.id as verse_id,
    v.verse_number::text,
    v.chapter_id,
    ch.chapter_number,
    CASE WHEN language_code = 'uk' THEN ch.title_uk ELSE ch.title_en END as chapter_title,
    b.id as book_id,
    CASE WHEN language_code = 'uk' THEN b.title_uk ELSE b.title_en END as book_title,
    b.slug as book_slug,
    ch.canto_id as canto_id,
    ca.canto_number::integer as canto_number,
    CASE WHEN language_code = 'uk' THEN ca.title_uk ELSE ca.title_en END as canto_title,
    (CASE WHEN include_sanskrit THEN v.sanskrit ELSE NULL END) as sanskrit,
    (CASE WHEN include_transliteration THEN COALESCE(
      CASE WHEN language_code = 'uk' THEN v.transliteration_uk ELSE v.transliteration_en END,
      v.transliteration
    ) ELSE NULL END) as transliteration,
    (CASE WHEN include_synonyms
          THEN (CASE WHEN language_code = 'uk' THEN v.synonyms_uk ELSE v.synonyms_en END)
          ELSE NULL END) as synonyms,
    (CASE WHEN include_translation
          THEN (CASE WHEN language_code = 'uk' THEN v.translation_uk ELSE v.translation_en END)
          ELSE NULL END) as translation,
    (CASE WHEN include_commentary
          THEN (CASE WHEN language_code = 'uk' THEN v.commentary_uk ELSE v.commentary_en END)
          ELSE NULL END) as commentary,
    -- Обчислюємо релевантність на основі FTS рангу
    CASE
      WHEN language_code = 'uk' AND v.search_vector_uk IS NOT NULL THEN
        ts_rank_cd(v.search_vector_uk, ts_query, 32)::numeric
      WHEN language_code != 'uk' AND v.search_vector_en IS NOT NULL THEN
        ts_rank_cd(v.search_vector_en, ts_query, 32)::numeric
      ELSE 1::numeric
    END as relevance_rank,
    -- Визначаємо де знайдено
    ARRAY_REMOVE(ARRAY[
      CASE WHEN include_translation AND (
        (language_code = 'uk' AND v.translation_uk ILIKE pattern) OR
        (language_code <> 'uk' AND v.translation_en ILIKE pattern)
      ) THEN 'translation' ELSE NULL END,
      CASE WHEN include_commentary AND (
        (language_code = 'uk' AND v.commentary_uk ILIKE pattern) OR
        (language_code <> 'uk' AND v.commentary_en ILIKE pattern)
      ) THEN 'commentary' ELSE NULL END,
      CASE WHEN include_synonyms AND (
        (language_code = 'uk' AND v.synonyms_uk ILIKE pattern) OR
        (language_code <> 'uk' AND v.synonyms_en ILIKE pattern)
      ) THEN 'synonyms' ELSE NULL END,
      CASE WHEN include_transliteration AND (
        v.transliteration ILIKE pattern OR
        v.transliteration_uk ILIKE pattern OR
        v.transliteration_en ILIKE pattern
      ) THEN 'transliteration' ELSE NULL END,
      CASE WHEN include_sanskrit AND v.sanskrit ILIKE pattern THEN 'sanskrit' ELSE NULL END
    ], NULL) as matched_in,
    -- Snippet з підсвіченням
    ts_headline(
      search_config,
      COALESCE(
        CASE WHEN language_code = 'uk' THEN v.translation_uk ELSE v.translation_en END,
        CASE WHEN language_code = 'uk' THEN v.commentary_uk ELSE v.commentary_en END,
        ''
      ),
      ts_query,
      'MaxWords=30, MinWords=15, StartSel=<mark>, StopSel=</mark>'
    ) as search_snippet
  FROM public.verses v
  JOIN public.chapters ch ON ch.id = v.chapter_id
  JOIN public.books b ON b.id = ch.book_id
  LEFT JOIN public.cantos ca ON ca.id = ch.canto_id
  WHERE ch.is_published = true
    AND v.deleted_at IS NULL
    AND (
      -- FTS пошук з підтримкою фраз та boolean
      (language_code = 'uk' AND v.search_vector_uk @@ ts_query)
      OR (language_code != 'uk' AND v.search_vector_en @@ ts_query)
      -- Fallback на ILIKE для коротких запитів (менше 3 символів)
      OR (length(cleaned_query) <= 3 AND (
        (include_translation AND (
          (language_code = 'uk' AND v.translation_uk ILIKE pattern) OR
          (language_code <> 'uk' AND v.translation_en ILIKE pattern)
        ))
        OR (include_commentary AND (
          (language_code = 'uk' AND v.commentary_uk ILIKE pattern) OR
          (language_code <> 'uk' AND v.commentary_en ILIKE pattern)
        ))
        OR (include_synonyms AND (
          (language_code = 'uk' AND v.synonyms_uk ILIKE pattern) OR
          (language_code <> 'uk' AND v.synonyms_en ILIKE pattern)
        ))
        OR (include_transliteration AND (
          v.transliteration ILIKE pattern OR
          v.transliteration_uk ILIKE pattern OR
          v.transliteration_en ILIKE pattern
        ))
        OR (include_sanskrit AND v.sanskrit ILIKE pattern)
      ))
    )
    AND (book_ids IS NULL OR ch.book_id = ANY(book_ids))
  ORDER BY relevance_rank DESC, b.display_order NULLS LAST, ch.chapter_number, v.sort_key NULLS FIRST, v.verse_number
  LIMIT limit_count;
END;
$$;

COMMENT ON FUNCTION public.search_verses_fulltext IS
'Повнотекстовий пошук по віршах з підтримкою:
- Фразовий пошук: "exact phrase"
- Boolean OR: word1 word2
- Boolean AND: word1 AND word2, +word
- Boolean NOT: -word
Приклади: "чисте служіння", крішна AND арджуна, devotion -material';

-- Grant access (required after DROP FUNCTION removed previous grants)
GRANT EXECUTE ON FUNCTION public.search_verses_fulltext(text, text, boolean, boolean, boolean, boolean, boolean, uuid[], integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_verses_fulltext(text, text, boolean, boolean, boolean, boolean, boolean, uuid[], integer) TO anon;

-- ============================================================================
-- 3. ОНОВЛЕНА ФУНКЦІЯ УНІФІКОВАНОГО ПОШУКУ
-- ============================================================================

CREATE OR REPLACE FUNCTION public.unified_search(
  search_query text,
  language_code text DEFAULT 'uk',
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
BEGIN
  -- Конфіг для мови
  IF language_code = 'uk' THEN
    search_config := 'public.simple_unaccent'::regconfig;
  ELSE
    search_config := 'english'::regconfig;
  END IF;

  -- Очищаємо запит
  cleaned_query := TRIM(regexp_replace(search_query, '\s+', ' ', 'g'));

  -- Використовуємо websearch_to_tsquery для підтримки фраз та boolean
  ts_query := safe_websearch_to_tsquery(search_config, cleaned_query);
  pattern := '%' || regexp_replace(cleaned_query, '"', '', 'g') || '%';

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
    CASE
      WHEN language_code = 'uk' AND v.search_vector_uk IS NOT NULL THEN
        ts_rank_cd(v.search_vector_uk, ts_query)::numeric
      WHEN language_code != 'uk' AND v.search_vector_en IS NOT NULL THEN
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
      (language_code = 'uk' AND v.search_vector_uk @@ ts_query)
      OR (language_code != 'uk' AND v.search_vector_en @@ ts_query)
      OR (length(cleaned_query) <= 3 AND (
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
    CASE
      WHEN language_code = 'uk' AND bp.search_vector_uk IS NOT NULL THEN
        ts_rank_cd(bp.search_vector_uk, ts_query)::numeric
      WHEN language_code != 'uk' AND bp.search_vector_en IS NOT NULL THEN
        ts_rank_cd(bp.search_vector_en, ts_query)::numeric
      ELSE 0.5::numeric
    END as relevance,
    ARRAY['blog']::text[] as matched_in
  FROM public.blog_posts bp
  WHERE bp.is_published = true
    AND 'blog' = ANY(search_types)
    AND (
      (language_code = 'uk' AND bp.search_vector_uk @@ ts_query)
      OR (language_code != 'uk' AND bp.search_vector_en @@ ts_query)
      OR (length(cleaned_query) <= 3 AND (
        (language_code = 'uk' AND (bp.title_uk ILIKE pattern OR bp.content_uk ILIKE pattern)) OR
        (language_code != 'uk' AND (bp.title_en ILIKE pattern OR bp.content_en ILIKE pattern))
      ))
    )
  ORDER BY relevance DESC
  LIMIT limit_per_type)

  ORDER BY relevance DESC
  LIMIT COALESCE(overall_limit, limit_per_type * array_length(search_types, 1));
END;
$$;

COMMENT ON FUNCTION public.unified_search IS
'Уніфікований пошук по всьому сайту з підтримкою фраз та boolean операторів.
Підтримує: "phrase", word1 word2 (OR), word1 AND word2, -word (NOT)';

-- Grant access (required after DROP FUNCTION removed previous grants)
GRANT EXECUTE ON FUNCTION public.unified_search(text, text, text[], integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unified_search(text, text, text[], integer, integer) TO anon;

-- ============================================================================
-- ПРИКЛАДИ ВИКОРИСТАННЯ:
-- ============================================================================
--
-- Фразовий пошук (точна фраза):
-- SELECT * FROM search_verses_fulltext('"чисте віддане служіння"', 'ua', false, false, true, true, true, NULL, 20);
-- SELECT * FROM search_verses_fulltext('"Supreme Personality of Godhead"', 'en', false, false, true, true, true, NULL, 20);
--
-- Boolean OR (будь-яке слово):
-- SELECT * FROM search_verses_fulltext('крішна арджуна', 'ua', false, false, true, true, true, NULL, 20);
--
-- Boolean AND (обидва слова):
-- SELECT * FROM search_verses_fulltext('крішна AND арджуна', 'ua', false, false, true, true, true, NULL, 20);
--
-- Boolean NOT (виключити):
-- SELECT * FROM search_verses_fulltext('крішна -арджуна', 'ua', false, false, true, true, true, NULL, 20);
--
-- Комбінований пошук:
-- SELECT * FROM search_verses_fulltext('"Supreme Lord" AND devotion -material', 'en', false, false, true, true, true, NULL, 20);
