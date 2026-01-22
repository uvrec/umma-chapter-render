-- ============================================================================
-- ПІДТРИМКА PROXIMITY SEARCH (пошук слів на відстані)
-- ============================================================================
-- Цей migration додає підтримку proximity search:
-- "word1 word2"~4 -> знайде word1 та word2 в межах 4 слів одне від одного
--
-- PostgreSQL підтримує це через оператори:
-- <-> : сусідні слова (відстань 1)
-- <N> : слова на відстані до N позицій
--
-- Приклади:
--   "paraphernalia king"~4  -> 'paraphernalia' <4> 'king'
--   "Supreme Lord"~2        -> 'Supreme' <2> 'Lord'
--   "крішна арджуна"~3      -> 'крішна' <3> 'арджуна'
-- ============================================================================

-- ============================================================================
-- 1. ФУНКЦІЯ ДЛЯ ПАРСИНГУ PROXIMITY ЗАПИТІВ
-- ============================================================================

CREATE OR REPLACE FUNCTION public.parse_proximity_query(
  query_text text,
  config regconfig
)
RETURNS tsquery
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  result tsquery;
  proximity_match text[];
  phrase_words text[];
  phrase text;
  distance int;
  word text;
  tsquery_parts text[];
  i int;
BEGIN
  -- Шукаємо патерн "phrase"~N
  -- Regex: "([^"]+)"~(\d+)
  IF query_text ~ '"[^"]+"~\d+' THEN
    -- Знаходимо всі proximity фрази
    FOR proximity_match IN
      SELECT regexp_matches(query_text, '"([^"]+)"~(\d+)', 'g')
    LOOP
      phrase := proximity_match[1];
      distance := proximity_match[2]::int;

      -- Розбиваємо фразу на слова
      phrase_words := regexp_split_to_array(TRIM(phrase), '\s+');

      IF array_length(phrase_words, 1) >= 2 THEN
        -- Будуємо tsquery з proximity операторами
        tsquery_parts := '{}';
        FOR i IN 1..array_length(phrase_words, 1) LOOP
          word := phrase_words[i];
          -- Очищаємо слово від спецсимволів
          word := regexp_replace(word, '[^\w\u0400-\u04FF]', '', 'g');
          IF word != '' THEN
            tsquery_parts := array_append(tsquery_parts, '''' || word || '''');
          END IF;
        END LOOP;

        -- З'єднуємо з proximity оператором <N>
        IF array_length(tsquery_parts, 1) >= 2 THEN
          BEGIN
            result := to_tsquery(config::text,
              array_to_string(tsquery_parts, ' <' || distance || '> ')
            );
            RETURN result;
          EXCEPTION WHEN OTHERS THEN
            -- Fallback на звичайний пошук
            NULL;
          END;
        END IF;
      END IF;
    END LOOP;
  END IF;

  -- Якщо не proximity запит, повертаємо NULL
  RETURN NULL;
END;
$$;

COMMENT ON FUNCTION public.parse_proximity_query IS
'Парсить proximity запити виду "word1 word2"~N.
Конвертує в PostgreSQL tsquery з <N> оператором.
Повертає NULL якщо запит не містить proximity синтаксису.';

-- ============================================================================
-- 2. ОНОВЛЕНА ФУНКЦІЯ ПАРСИНГУ З ПІДТРИМКОЮ ВСІХ ОПЕРАТОРІВ
-- ============================================================================

CREATE OR REPLACE FUNCTION public.parse_advanced_query(
  query_text text,
  config regconfig
)
RETURNS TABLE(
  ts_query tsquery,
  has_complex_wildcard boolean,
  has_proximity boolean,
  ilike_pattern text
)
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  cleaned_query text;
  proximity_query tsquery;
  wildcard_result RECORD;
  has_wildcard boolean;
  has_prox boolean := false;
  final_query tsquery;
  ilike_pat text;
BEGIN
  -- Очищаємо запит
  cleaned_query := TRIM(regexp_replace(query_text, '\s+', ' ', 'g'));

  -- Перевіряємо чи є proximity синтаксис
  IF cleaned_query ~ '"[^"]+"~\d+' THEN
    has_prox := true;
    proximity_query := parse_proximity_query(cleaned_query, config);

    IF proximity_query IS NOT NULL THEN
      -- Формуємо ILIKE pattern (видаляємо ~N)
      ilike_pat := '%' || regexp_replace(
        regexp_replace(cleaned_query, '~\d+', '', 'g'),
        '"', '', 'g'
      ) || '%';

      RETURN QUERY SELECT
        proximity_query,
        false,
        true,
        ilike_pat;
      RETURN;
    END IF;
  END IF;

  -- Перевіряємо wildcards
  has_wildcard := cleaned_query ~ '[*?]';

  IF has_wildcard THEN
    -- Використовуємо існуючу функцію для wildcards
    SELECT * INTO wildcard_result FROM parse_wildcard_query(cleaned_query, config);
    RETURN QUERY SELECT
      wildcard_result.ts_query,
      wildcard_result.has_complex_wildcard,
      false,
      wildcard_result.ilike_pattern;
    RETURN;
  END IF;

  -- Звичайний запит без спецсинтаксису
  ilike_pat := '%' || regexp_replace(cleaned_query, '"', '', 'g') || '%';

  RETURN QUERY SELECT
    safe_websearch_to_tsquery(config, cleaned_query),
    false,
    false,
    ilike_pat;
END;
$$;

COMMENT ON FUNCTION public.parse_advanced_query IS
'Універсальний парсер пошукових запитів з підтримкою:
- Фразовий пошук: "exact phrase"
- Boolean: AND, OR, -word
- Wildcards: word*, te?t
- Proximity: "word1 word2"~N';

-- ============================================================================
-- 3. ОНОВЛЕНА ФУНКЦІЯ ПОШУКУ ВІРШІВ
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
  has_complex_wildcard boolean;
  has_proximity boolean;
  query_result RECORD;
BEGIN
  -- Визначаємо конфіг для мови
  IF language_code = 'uk' THEN
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
    -- Релевантність
    CASE
      WHEN language_code = 'uk' AND v.search_vector_uk IS NOT NULL AND ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(v.search_vector_uk, ts_query, 32)::numeric
      WHEN language_code != 'uk' AND v.search_vector_en IS NOT NULL AND ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(v.search_vector_en, ts_query, 32)::numeric
      ELSE 1::numeric
    END as relevance_rank,
    -- Де знайдено
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
    -- Snippet
    CASE
      WHEN ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_headline(
          search_config,
          COALESCE(
            CASE WHEN language_code = 'uk' THEN v.translation_uk ELSE v.translation_en END,
            CASE WHEN language_code = 'uk' THEN v.commentary_uk ELSE v.commentary_en END,
            ''
          ),
          ts_query,
          'MaxWords=30, MinWords=15, StartSel=<mark>, StopSel=</mark>'
        )
      ELSE
        LEFT(COALESCE(
          CASE WHEN language_code = 'uk' THEN v.translation_uk ELSE v.translation_en END,
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
        (language_code = 'uk' AND v.search_vector_uk @@ ts_query)
        OR (language_code != 'uk' AND v.search_vector_en @@ ts_query)
      ))
      -- ILIKE fallback
      OR (has_complex_wildcard OR length(cleaned_query) <= 3) AND (
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
      )
    )
    AND (book_ids IS NULL OR ch.book_id = ANY(book_ids))
  ORDER BY relevance_rank DESC, b.display_order NULLS LAST, ch.chapter_number, v.sort_key NULLS FIRST, v.verse_number
  LIMIT limit_count;
END;
$$;

COMMENT ON FUNCTION public.search_verses_fulltext IS
'Повнотекстовий пошук по віршах з підтримкою:
- Фразовий пошук: "exact phrase"
- Boolean: AND, OR, -word
- Wildcards: word*, te?t
- Proximity: "word1 word2"~N (слова в межах N позицій)';

-- ============================================================================
-- 4. ОНОВЛЕНА ФУНКЦІЯ УНІФІКОВАНОГО ПОШУКУ
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
  has_complex_wildcard boolean;
  has_proximity boolean;
  query_result RECORD;
BEGIN
  -- Конфіг для мови
  IF language_code = 'uk' THEN
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
    CASE WHEN language_code = 'uk' THEN ch.title_uk ELSE ch.title_en END as subtitle,
    CASE
      WHEN ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_headline(
          search_config,
          COALESCE(
            CASE WHEN language_code = 'uk' THEN v.translation_uk ELSE v.translation_en END,
            ''
          ),
          ts_query,
          'MaxWords=25, MinWords=10'
        )
      ELSE
        LEFT(COALESCE(
          CASE WHEN language_code = 'uk' THEN v.translation_uk ELSE v.translation_en END,
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
      WHEN language_code = 'uk' AND v.search_vector_uk IS NOT NULL AND ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(v.search_vector_uk, ts_query)::numeric
      WHEN language_code != 'uk' AND v.search_vector_en IS NOT NULL AND ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
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
        (language_code = 'uk' AND v.search_vector_uk @@ ts_query)
        OR (language_code != 'uk' AND v.search_vector_en @@ ts_query)
      ))
      OR ((has_complex_wildcard OR length(cleaned_query) <= 3) AND (
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
    CASE
      WHEN ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_headline(
          search_config,
          COALESCE(
            CASE WHEN language_code = 'uk' THEN bp.content_uk ELSE bp.content_en END,
            ''
          ),
          ts_query,
          'MaxWords=25, MinWords=10'
        )
      ELSE
        LEFT(COALESCE(
          CASE WHEN language_code = 'uk' THEN bp.content_uk ELSE bp.content_en END,
          ''
        ), 150)
    END as snippet,
    '/blog/' || bp.slug as href,
    CASE
      WHEN language_code = 'uk' AND bp.search_vector_uk IS NOT NULL AND ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(bp.search_vector_uk, ts_query)::numeric
      WHEN language_code != 'uk' AND bp.search_vector_en IS NOT NULL AND ts_query IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(bp.search_vector_en, ts_query)::numeric
      ELSE 0.5::numeric
    END as relevance,
    ARRAY['blog']::text[] as matched_in
  FROM public.blog_posts bp
  WHERE bp.is_published = true
    AND 'blog' = ANY(search_types)
    AND (
      (ts_query IS NOT NULL AND ts_query != ''::tsquery AND NOT has_complex_wildcard AND (
        (language_code = 'uk' AND bp.search_vector_uk @@ ts_query)
        OR (language_code != 'uk' AND bp.search_vector_en @@ ts_query)
      ))
      OR ((has_complex_wildcard OR length(cleaned_query) <= 3) AND (
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
'Уніфікований пошук з підтримкою фраз, boolean, wildcards та proximity.';

-- ============================================================================
-- ПРИКЛАДИ PROXIMITY SEARCH:
-- ============================================================================
--
-- Базовий proximity (слова в межах N позицій):
-- SELECT * FROM search_verses_fulltext('"Supreme Lord"~3', 'en', false, false, true, true, true, NULL, 20);
-- -- Знайде "Supreme" та "Lord" в межах 3 слів
--
-- SELECT * FROM search_verses_fulltext('"крішна арджуна"~5', 'ua', false, false, true, true, true, NULL, 20);
-- -- Знайде "крішна" та "арджуна" в межах 5 слів
--
-- SELECT * FROM search_verses_fulltext('"devotional service"~2', 'en', false, false, true, true, true, NULL, 20);
-- -- Знайде "devotional" та "service" поруч або через 1 слово
--
-- Комбінація з іншими операторами:
-- SELECT * FROM search_verses_fulltext('"pure devotion"~3 AND krishna', 'en', false, false, true, true, true, NULL, 20);
