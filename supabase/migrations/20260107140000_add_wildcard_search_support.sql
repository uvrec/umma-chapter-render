-- ============================================================================
-- ПІДТРИМКА WILDCARD ПОШУКУ (* та ?)
-- ============================================================================
-- Цей migration додає підтримку wildcards:
-- 1. Prefix wildcard: hari* -> знайде hari, harinama, haridasa
-- 2. Single character: te?t -> знайде text, test
-- 3. Infix wildcard: ha*i -> знайде hari, harikatha
--
-- PostgreSQL native FTS підтримує тільки prefix (:*), тому:
-- - word* -> використовує tsquery з :* (швидко, використовує індекс)
-- - *word, wo*rd, te?t -> fallback на ILIKE (повільніше, але працює)
-- ============================================================================

-- ============================================================================
-- 1. ФУНКЦІЯ ДЛЯ ПАРСИНГУ ЗАПИТУ З WILDCARDS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.parse_wildcard_query(
  query_text text,
  config regconfig
)
RETURNS TABLE(
  ts_query tsquery,
  has_complex_wildcard boolean,
  ilike_pattern text
)
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  cleaned_query text;
  words text[];
  word text;
  ts_parts text[] := '{}';
  has_wildcard boolean := false;
  has_complex boolean := false;
  ilike_pat text;
BEGIN
  -- Очищаємо запит
  cleaned_query := TRIM(regexp_replace(query_text, '\s+', ' ', 'g'));

  -- Перевіряємо чи є wildcards
  has_wildcard := cleaned_query ~ '[*?]';

  IF NOT has_wildcard THEN
    -- Немає wildcards - використовуємо звичайний websearch_to_tsquery
    RETURN QUERY SELECT
      public.safe_websearch_to_tsquery(config, cleaned_query),
      false,
      '%' || cleaned_query || '%';
    RETURN;
  END IF;

  -- Перевіряємо чи є складні wildcards (не тільки prefix)
  -- Складні: *word (suffix), wo*rd (infix), te?t (single char)
  has_complex := cleaned_query ~ '(\*[^\s]|[^\s]\*[^\s]|\?)';

  -- Розбиваємо на слова
  words := regexp_split_to_array(cleaned_query, '\s+');

  FOREACH word IN ARRAY words LOOP
    IF word ~ '\*$' AND NOT word ~ '^\*' AND NOT word ~ '\*.*\*' THEN
      -- Простий prefix wildcard: word* -> 'word':*
      ts_parts := array_append(ts_parts,
        '''' || regexp_replace(word, '\*$', '') || ''':*'
      );
    ELSIF word ~ '[*?]' THEN
      -- Складний wildcard - пропускаємо для tsquery, використаємо ILIKE
      has_complex := true;
    ELSE
      -- Звичайне слово
      ts_parts := array_append(ts_parts,
        '''' || word || ''''
      );
    END IF;
  END LOOP;

  -- Формуємо ILIKE pattern
  -- Замінюємо * на % та ? на _
  ilike_pat := '%' || regexp_replace(
    regexp_replace(cleaned_query, '\*', '%', 'g'),
    '\?', '_', 'g'
  ) || '%';

  -- Формуємо tsquery
  IF array_length(ts_parts, 1) > 0 THEN
    BEGIN
      RETURN QUERY SELECT
        to_tsquery(config::text, array_to_string(ts_parts, ' | ')),
        has_complex,
        ilike_pat;
    EXCEPTION WHEN OTHERS THEN
      -- Fallback якщо tsquery не вдалося
      RETURN QUERY SELECT
        public.safe_websearch_to_tsquery(config, regexp_replace(cleaned_query, '[*?]', '', 'g')),
        true,
        ilike_pat;
    END;
  ELSE
    RETURN QUERY SELECT
      ''::tsquery,
      true,
      ilike_pat;
  END IF;
END;
$$;

COMMENT ON FUNCTION public.parse_wildcard_query IS
'Парсить пошуковий запит з wildcards (* та ?).
Повертає tsquery для FTS та ILIKE pattern для складних wildcards.
- word* -> prefix search через tsquery :*
- *word, wo*rd, te?t -> ILIKE fallback';

-- ============================================================================
-- 2. ОНОВЛЕНА ФУНКЦІЯ ПОШУКУ З WILDCARDS
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
  has_wildcard boolean;
  has_complex_wildcard boolean;
  wildcard_result RECORD;
BEGIN
  -- Визначаємо конфіг для мови
  IF language_code = 'ua' THEN
    search_config := 'public.simple_unaccent'::regconfig;
  ELSE
    search_config := 'english'::regconfig;
  END IF;

  -- Очищаємо запит від зайвих пробілів
  cleaned_query := TRIM(regexp_replace(search_query, '\s+', ' ', 'g'));

  -- Перевіряємо чи є wildcards
  has_wildcard := cleaned_query ~ '[*?]';

  IF has_wildcard THEN
    -- Парсимо запит з wildcards
    SELECT * INTO wildcard_result FROM parse_wildcard_query(cleaned_query, search_config);
    ts_query := wildcard_result.ts_query;
    has_complex_wildcard := wildcard_result.has_complex_wildcard;
    pattern := wildcard_result.ilike_pattern;
  ELSE
    -- Звичайний запит без wildcards
    ts_query := safe_websearch_to_tsquery(search_config, cleaned_query);
    has_complex_wildcard := false;
    -- Видаляємо лапки для ILIKE паттерну
    pattern := '%' || regexp_replace(cleaned_query, '"', '', 'g') || '%';
  END IF;

  RETURN QUERY
  SELECT
    v.id as verse_id,
    v.verse_number::text,
    v.chapter_id,
    ch.chapter_number,
    CASE WHEN language_code = 'ua' THEN ch.title_ua ELSE ch.title_en END as chapter_title,
    b.id as book_id,
    CASE WHEN language_code = 'ua' THEN b.title_ua ELSE b.title_en END as book_title,
    b.slug as book_slug,
    ch.canto_id as canto_id,
    ca.canto_number::integer as canto_number,
    CASE WHEN language_code = 'ua' THEN ca.title_ua ELSE ca.title_en END as canto_title,
    (CASE WHEN include_sanskrit THEN v.sanskrit ELSE NULL END) as sanskrit,
    (CASE WHEN include_transliteration THEN COALESCE(
      CASE WHEN language_code = 'ua' THEN v.transliteration_ua ELSE v.transliteration_en END,
      v.transliteration
    ) ELSE NULL END) as transliteration,
    (CASE WHEN include_synonyms
          THEN (CASE WHEN language_code = 'ua' THEN v.synonyms_ua ELSE v.synonyms_en END)
          ELSE NULL END) as synonyms,
    (CASE WHEN include_translation
          THEN (CASE WHEN language_code = 'ua' THEN v.translation_ua ELSE v.translation_en END)
          ELSE NULL END) as translation,
    (CASE WHEN include_commentary
          THEN (CASE WHEN language_code = 'ua' THEN v.commentary_ua ELSE v.commentary_en END)
          ELSE NULL END) as commentary,
    -- Обчислюємо релевантність
    CASE
      WHEN language_code = 'ua' AND v.search_vector_ua IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(v.search_vector_ua, ts_query, 32)::numeric
      WHEN language_code != 'ua' AND v.search_vector_en IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(v.search_vector_en, ts_query, 32)::numeric
      ELSE 1::numeric
    END as relevance_rank,
    -- Визначаємо де знайдено
    ARRAY_REMOVE(ARRAY[
      CASE WHEN include_translation AND (
        (language_code = 'ua' AND v.translation_ua ILIKE pattern) OR
        (language_code <> 'ua' AND v.translation_en ILIKE pattern)
      ) THEN 'translation' ELSE NULL END,
      CASE WHEN include_commentary AND (
        (language_code = 'ua' AND v.commentary_ua ILIKE pattern) OR
        (language_code <> 'ua' AND v.commentary_en ILIKE pattern)
      ) THEN 'commentary' ELSE NULL END,
      CASE WHEN include_synonyms AND (
        (language_code = 'ua' AND v.synonyms_ua ILIKE pattern) OR
        (language_code <> 'ua' AND v.synonyms_en ILIKE pattern)
      ) THEN 'synonyms' ELSE NULL END,
      CASE WHEN include_transliteration AND (
        v.transliteration ILIKE pattern OR
        v.transliteration_ua ILIKE pattern OR
        v.transliteration_en ILIKE pattern
      ) THEN 'transliteration' ELSE NULL END,
      CASE WHEN include_sanskrit AND v.sanskrit ILIKE pattern THEN 'sanskrit' ELSE NULL END
    ], NULL) as matched_in,
    -- Snippet з підсвіченням
    CASE
      WHEN ts_query != ''::tsquery THEN
        ts_headline(
          search_config,
          COALESCE(
            CASE WHEN language_code = 'ua' THEN v.translation_ua ELSE v.translation_en END,
            CASE WHEN language_code = 'ua' THEN v.commentary_ua ELSE v.commentary_en END,
            ''
          ),
          ts_query,
          'MaxWords=30, MinWords=15, StartSel=<mark>, StopSel=</mark>'
        )
      ELSE
        LEFT(COALESCE(
          CASE WHEN language_code = 'ua' THEN v.translation_ua ELSE v.translation_en END,
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
      -- FTS пошук (якщо є валідний tsquery)
      (ts_query != ''::tsquery AND NOT has_complex_wildcard AND (
        (language_code = 'ua' AND v.search_vector_ua @@ ts_query)
        OR (language_code != 'ua' AND v.search_vector_en @@ ts_query)
      ))
      -- ILIKE fallback для wildcards та коротких запитів
      OR (has_complex_wildcard OR length(cleaned_query) <= 3) AND (
        (include_translation AND (
          (language_code = 'ua' AND v.translation_ua ILIKE pattern) OR
          (language_code <> 'ua' AND v.translation_en ILIKE pattern)
        ))
        OR (include_commentary AND (
          (language_code = 'ua' AND v.commentary_ua ILIKE pattern) OR
          (language_code <> 'ua' AND v.commentary_en ILIKE pattern)
        ))
        OR (include_synonyms AND (
          (language_code = 'ua' AND v.synonyms_ua ILIKE pattern) OR
          (language_code <> 'ua' AND v.synonyms_en ILIKE pattern)
        ))
        OR (include_transliteration AND (
          v.transliteration ILIKE pattern OR
          v.transliteration_ua ILIKE pattern OR
          v.transliteration_en ILIKE pattern
        ))
        OR (include_sanskrit AND v.sanskrit ILIKE pattern)
      )
      -- Комбінація: prefix wildcard через FTS + решта через ILIKE
      OR (has_wildcard AND NOT has_complex_wildcard AND ts_query != ''::tsquery AND (
        (language_code = 'ua' AND v.search_vector_ua @@ ts_query)
        OR (language_code != 'ua' AND v.search_vector_en @@ ts_query)
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
- Prefix wildcard: word* (знайде word, words, wording)
- Single char wildcard: te?t (знайде text, test)
- Infix wildcard: ha*i (знайде hari, harikatha)';

-- ============================================================================
-- 3. ОНОВЛЕНА ФУНКЦІЯ УНІФІКОВАНОГО ПОШУКУ
-- ============================================================================

CREATE OR REPLACE FUNCTION public.unified_search(
  search_query text,
  language_code text DEFAULT 'ua',
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
  has_wildcard boolean;
  has_complex_wildcard boolean;
  wildcard_result RECORD;
BEGIN
  -- Конфіг для мови
  IF language_code = 'ua' THEN
    search_config := 'public.simple_unaccent'::regconfig;
  ELSE
    search_config := 'english'::regconfig;
  END IF;

  -- Очищаємо запит
  cleaned_query := TRIM(regexp_replace(search_query, '\s+', ' ', 'g'));

  -- Перевіряємо wildcards
  has_wildcard := cleaned_query ~ '[*?]';

  IF has_wildcard THEN
    SELECT * INTO wildcard_result FROM parse_wildcard_query(cleaned_query, search_config);
    ts_query := wildcard_result.ts_query;
    has_complex_wildcard := wildcard_result.has_complex_wildcard;
    pattern := wildcard_result.ilike_pattern;
  ELSE
    ts_query := safe_websearch_to_tsquery(search_config, cleaned_query);
    has_complex_wildcard := false;
    pattern := '%' || regexp_replace(cleaned_query, '"', '', 'g') || '%';
  END IF;

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
    CASE WHEN language_code = 'ua' THEN ch.title_ua ELSE ch.title_en END as subtitle,
    CASE
      WHEN ts_query != ''::tsquery THEN
        ts_headline(
          search_config,
          COALESCE(
            CASE WHEN language_code = 'ua' THEN v.translation_ua ELSE v.translation_en END,
            ''
          ),
          ts_query,
          'MaxWords=25, MinWords=10'
        )
      ELSE
        LEFT(COALESCE(
          CASE WHEN language_code = 'ua' THEN v.translation_ua ELSE v.translation_en END,
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
      WHEN language_code = 'ua' AND v.search_vector_ua IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(v.search_vector_ua, ts_query)::numeric
      WHEN language_code != 'ua' AND v.search_vector_en IS NOT NULL AND ts_query != ''::tsquery THEN
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
      (ts_query != ''::tsquery AND NOT has_complex_wildcard AND (
        (language_code = 'ua' AND v.search_vector_ua @@ ts_query)
        OR (language_code != 'ua' AND v.search_vector_en @@ ts_query)
      ))
      OR ((has_complex_wildcard OR length(cleaned_query) <= 3) AND (
        (language_code = 'ua' AND v.translation_ua ILIKE pattern) OR
        (language_code != 'ua' AND v.translation_en ILIKE pattern)
      ))
    )
  ORDER BY relevance DESC
  LIMIT limit_per_type)

  UNION ALL

  -- Пошук у блозі
  (SELECT
    'blog'::text as result_type,
    bp.id as result_id,
    CASE WHEN language_code = 'ua' THEN bp.title_ua ELSE bp.title_en END as title,
    CASE WHEN language_code = 'ua' THEN bp.excerpt_ua ELSE bp.excerpt_en END as subtitle,
    CASE
      WHEN ts_query != ''::tsquery THEN
        ts_headline(
          search_config,
          COALESCE(
            CASE WHEN language_code = 'ua' THEN bp.content_ua ELSE bp.content_en END,
            ''
          ),
          ts_query,
          'MaxWords=25, MinWords=10'
        )
      ELSE
        LEFT(COALESCE(
          CASE WHEN language_code = 'ua' THEN bp.content_ua ELSE bp.content_en END,
          ''
        ), 150)
    END as snippet,
    '/blog/' || bp.slug as href,
    CASE
      WHEN language_code = 'ua' AND bp.search_vector_ua IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(bp.search_vector_ua, ts_query)::numeric
      WHEN language_code != 'ua' AND bp.search_vector_en IS NOT NULL AND ts_query != ''::tsquery THEN
        ts_rank_cd(bp.search_vector_en, ts_query)::numeric
      ELSE 0.5::numeric
    END as relevance,
    ARRAY['blog']::text[] as matched_in
  FROM public.blog_posts bp
  WHERE bp.is_published = true
    AND 'blog' = ANY(search_types)
    AND (
      (ts_query != ''::tsquery AND NOT has_complex_wildcard AND (
        (language_code = 'ua' AND bp.search_vector_ua @@ ts_query)
        OR (language_code != 'ua' AND bp.search_vector_en @@ ts_query)
      ))
      OR ((has_complex_wildcard OR length(cleaned_query) <= 3) AND (
        (language_code = 'ua' AND (bp.title_ua ILIKE pattern OR bp.content_ua ILIKE pattern)) OR
        (language_code != 'ua' AND (bp.title_en ILIKE pattern OR bp.content_en ILIKE pattern))
      ))
    )
  ORDER BY relevance DESC
  LIMIT limit_per_type)

  ORDER BY relevance DESC
  LIMIT COALESCE(overall_limit, limit_per_type * array_length(search_types, 1));
END;
$$;

COMMENT ON FUNCTION public.unified_search IS
'Уніфікований пошук по всьому сайту з підтримкою фраз, boolean операторів та wildcards.
Підтримує: "phrase", word1 word2 (OR), AND, -word (NOT), word*, te?t';

-- ============================================================================
-- ПРИКЛАДИ ВИКОРИСТАННЯ WILDCARDS:
-- ============================================================================
--
-- Prefix wildcard (швидко, використовує індекс):
-- SELECT * FROM search_verses_fulltext('hari*', 'en', false, false, true, true, true, NULL, 20);
-- -- Знайде: hari, harinama, haridasa, haribol
--
-- SELECT * FROM search_verses_fulltext('крішн*', 'ua', false, false, true, true, true, NULL, 20);
-- -- Знайде: крішна, крішни, крішною
--
-- Single character wildcard (через ILIKE):
-- SELECT * FROM search_verses_fulltext('te?t', 'en', false, false, true, true, true, NULL, 20);
-- -- Знайде: text, test
--
-- Infix wildcard (через ILIKE):
-- SELECT * FROM search_verses_fulltext('bha*ti', 'en', false, false, true, true, true, NULL, 20);
-- -- Знайде: bhakti, bharati
--
-- Комбінація з іншими операторами:
-- SELECT * FROM search_verses_fulltext('hari* AND devotion', 'en', false, false, true, true, true, NULL, 20);
-- SELECT * FROM search_verses_fulltext('"Supreme Lord" AND krsn*', 'en', false, false, true, true, true, NULL, 20);
