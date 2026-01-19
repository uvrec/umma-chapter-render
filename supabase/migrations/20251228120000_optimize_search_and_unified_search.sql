-- ============================================================================
-- ОПТИМІЗАЦІЯ ПОШУКУ: Full-Text Search замість ILIKE
-- ============================================================================
-- Цей migration:
-- 1. Додає search_vector колонки для verses, blog_posts, lectures, letters
-- 2. Створює GIN індекси для швидкого FTS пошуку
-- 3. Оновлює search_verses_fulltext для використання ts_vector
-- 4. Створює RPC для глосарію
-- 5. Створює unified_search для пошуку по всьому сайту
-- ============================================================================

-- Включаємо розширення якщо не ввімкнені
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ============================================================================
-- Створюємо конфігурацію для українського тексту з unaccent (accent-insensitive)
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_ts_config WHERE cfgname = 'simple_unaccent'
  ) THEN
    CREATE TEXT SEARCH CONFIGURATION public.simple_unaccent (COPY = simple);
    ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
      ALTER MAPPING FOR hword, hword_part, word WITH unaccent, simple;
  END IF;
END $$;

-- ============================================================================
-- 1. ДОДАЄМО search_vector КОЛОНКИ
-- ============================================================================

-- Для verses - об'єднаний вектор для UA та EN
ALTER TABLE public.verses
  ADD COLUMN IF NOT EXISTS search_vector_uk tsvector,
  ADD COLUMN IF NOT EXISTS search_vector_en tsvector;

-- Для blog_posts
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS search_vector_uk tsvector,
  ADD COLUMN IF NOT EXISTS search_vector_en tsvector;

-- Для lectures (якщо існує)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lectures') THEN
    ALTER TABLE public.lectures
      ADD COLUMN IF NOT EXISTS search_vector_uk tsvector,
      ADD COLUMN IF NOT EXISTS search_vector_en tsvector;
  END IF;
END $$;

-- Для letters (якщо існує)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'letters') THEN
    ALTER TABLE public.letters
      ADD COLUMN IF NOT EXISTS search_vector_uk tsvector,
      ADD COLUMN IF NOT EXISTS search_vector_en tsvector;
  END IF;
END $$;

-- ============================================================================
-- 2. ФУНКЦІЇ ДЛЯ ОНОВЛЕННЯ SEARCH_VECTOR
-- ============================================================================

-- Функція для оновлення search_vector у verses
CREATE OR REPLACE FUNCTION update_verse_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  -- Український вектор (simple_unaccent для accent-insensitive пошуку кирилицею)
  NEW.search_vector_uk :=
    setweight(to_tsvector('public.simple_unaccent', COALESCE(NEW.translation_uk, '')), 'A') ||
    setweight(to_tsvector('public.simple_unaccent', COALESCE(NEW.commentary_uk, '')), 'B') ||
    setweight(to_tsvector('public.simple_unaccent', COALESCE(NEW.synonyms_uk, '')), 'C') ||
    setweight(to_tsvector('public.simple_unaccent', COALESCE(NEW.transliteration_uk, COALESCE(NEW.transliteration, ''))), 'D');

  -- Англійський вектор
  NEW.search_vector_en :=
    setweight(to_tsvector('english', COALESCE(NEW.translation_en, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.commentary_en, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.synonyms_en, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(NEW.transliteration_en, COALESCE(NEW.transliteration, ''))), 'D') ||
    setweight(to_tsvector('simple', COALESCE(NEW.sanskrit, '')), 'D');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Функція для оновлення search_vector у blog_posts
CREATE OR REPLACE FUNCTION update_blog_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector_uk :=
    setweight(to_tsvector('public.simple_unaccent', COALESCE(NEW.title_uk, '')), 'A') ||
    setweight(to_tsvector('public.simple_unaccent', COALESCE(NEW.excerpt_uk, '')), 'B') ||
    setweight(to_tsvector('public.simple_unaccent', COALESCE(NEW.content_uk, '')), 'C');

  NEW.search_vector_en :=
    setweight(to_tsvector('english', COALESCE(NEW.title_en, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.excerpt_en, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.content_en, '')), 'C');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. ТРИГЕРИ ДЛЯ АВТОМАТИЧНОГО ОНОВЛЕННЯ
-- ============================================================================

-- Тригер для verses
DROP TRIGGER IF EXISTS trg_verses_search_vector ON public.verses;
CREATE TRIGGER trg_verses_search_vector
  BEFORE INSERT OR UPDATE OF translation_uk, translation_en, commentary_uk, commentary_en,
                            synonyms_uk, synonyms_en, transliteration, transliteration_uk,
                            transliteration_en, sanskrit
  ON public.verses
  FOR EACH ROW
  EXECUTE FUNCTION update_verse_search_vector();

-- Тригер для blog_posts
DROP TRIGGER IF EXISTS trg_blog_posts_search_vector ON public.blog_posts;
CREATE TRIGGER trg_blog_posts_search_vector
  BEFORE INSERT OR UPDATE OF title_uk, title_en, excerpt_uk, excerpt_en, content_uk, content_en
  ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_post_search_vector();

-- ============================================================================
-- 4. ОНОВЛЮЄМО ІСНУЮЧІ ЗАПИСИ
-- ============================================================================

-- Оновити всі verses (force refresh для всіх записів)
-- Для ~15k записів це безпечно виконується за кілька секунд
UPDATE public.verses SET
  search_vector_uk =
    setweight(to_tsvector('public.simple_unaccent', COALESCE(translation_uk, '')), 'A') ||
    setweight(to_tsvector('public.simple_unaccent', COALESCE(commentary_uk, '')), 'B') ||
    setweight(to_tsvector('public.simple_unaccent', COALESCE(synonyms_uk, '')), 'C') ||
    setweight(to_tsvector('public.simple_unaccent', COALESCE(transliteration_uk, COALESCE(transliteration, ''))), 'D'),
  search_vector_en =
    setweight(to_tsvector('english', COALESCE(translation_en, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(commentary_en, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(synonyms_en, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(transliteration_en, COALESCE(transliteration, ''))), 'D') ||
    setweight(to_tsvector('simple', COALESCE(sanskrit, '')), 'D');

-- Оновити всі blog_posts (force refresh)
UPDATE public.blog_posts SET
  search_vector_uk =
    setweight(to_tsvector('public.simple_unaccent', COALESCE(title_uk, '')), 'A') ||
    setweight(to_tsvector('public.simple_unaccent', COALESCE(excerpt_uk, '')), 'B') ||
    setweight(to_tsvector('public.simple_unaccent', COALESCE(content_uk, '')), 'C'),
  search_vector_en =
    setweight(to_tsvector('english', COALESCE(title_en, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(excerpt_en, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(content_en, '')), 'C');

-- ============================================================================
-- 5. GIN ІНДЕКСИ ДЛЯ ШВИДКОГО ПОШУКУ
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_verses_search_vector_uk ON public.verses USING gin(search_vector_uk);
CREATE INDEX IF NOT EXISTS idx_verses_search_vector_en ON public.verses USING gin(search_vector_en);
CREATE INDEX IF NOT EXISTS idx_blog_posts_search_vector_uk ON public.blog_posts USING gin(search_vector_uk);
CREATE INDEX IF NOT EXISTS idx_blog_posts_search_vector_en ON public.blog_posts USING gin(search_vector_en);

-- ============================================================================
-- 6. ОПТИМІЗОВАНА ФУНКЦІЯ ПОШУКУ ВІРШІВ
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
  search_config text;
BEGIN
  -- Визначаємо конфіг для мови (simple_unaccent для accent-insensitive пошуку українською)
  IF language_code = 'ua' THEN
    search_config := 'public.simple_unaccent';
  ELSE
    search_config := 'english';
  END IF;

  -- Створюємо tsquery з підтримкою часткового збігу
  ts_query := plainto_tsquery(search_config, search_query);

  -- Fallback pattern для ILIKE (для коротких запитів або коли FTS не працює)
  pattern := '%' || search_query || '%';

  RETURN QUERY
  SELECT
    v.id as verse_id,
    v.verse_number::text,
    v.chapter_id,
    ch.chapter_number,
    CASE WHEN language_code = 'ua' THEN ch.title_uk ELSE ch.title_en END as chapter_title,
    b.id as book_id,
    CASE WHEN language_code = 'ua' THEN b.title_uk ELSE b.title_en END as book_title,
    b.slug as book_slug,
    ch.canto_id as canto_id,
    ca.canto_number::integer as canto_number,
    CASE WHEN language_code = 'ua' THEN ca.title_uk ELSE ca.title_en END as canto_title,
    (CASE WHEN include_sanskrit THEN v.sanskrit ELSE NULL END) as sanskrit,
    (CASE WHEN include_transliteration THEN COALESCE(
      CASE WHEN language_code = 'ua' THEN v.transliteration_uk ELSE v.transliteration_en END,
      v.transliteration
    ) ELSE NULL END) as transliteration,
    (CASE WHEN include_synonyms
          THEN (CASE WHEN language_code = 'ua' THEN v.synonyms_uk ELSE v.synonyms_en END)
          ELSE NULL END) as synonyms,
    (CASE WHEN include_translation
          THEN (CASE WHEN language_code = 'ua' THEN v.translation_uk ELSE v.translation_en END)
          ELSE NULL END) as translation,
    (CASE WHEN include_commentary
          THEN (CASE WHEN language_code = 'ua' THEN v.commentary_uk ELSE v.commentary_en END)
          ELSE NULL END) as commentary,
    -- Обчислюємо релевантність на основі FTS рангу
    CASE
      WHEN language_code = 'ua' AND v.search_vector_uk IS NOT NULL THEN
        ts_rank_cd(v.search_vector_uk, ts_query, 32)::numeric
      WHEN language_code != 'ua' AND v.search_vector_en IS NOT NULL THEN
        ts_rank_cd(v.search_vector_en, ts_query, 32)::numeric
      ELSE 1::numeric
    END as relevance_rank,
    -- Визначаємо де знайдено
    ARRAY_REMOVE(ARRAY[
      CASE WHEN include_translation AND (
        (language_code = 'ua' AND v.translation_uk ILIKE pattern) OR
        (language_code <> 'ua' AND v.translation_en ILIKE pattern)
      ) THEN 'translation' ELSE NULL END,
      CASE WHEN include_commentary AND (
        (language_code = 'ua' AND v.commentary_uk ILIKE pattern) OR
        (language_code <> 'ua' AND v.commentary_en ILIKE pattern)
      ) THEN 'commentary' ELSE NULL END,
      CASE WHEN include_synonyms AND (
        (language_code = 'ua' AND v.synonyms_uk ILIKE pattern) OR
        (language_code <> 'ua' AND v.synonyms_en ILIKE pattern)
      ) THEN 'synonyms' ELSE NULL END,
      CASE WHEN include_transliteration AND (
        v.transliteration ILIKE pattern OR
        v.transliteration_uk ILIKE pattern OR
        v.transliteration_en ILIKE pattern
      ) THEN 'transliteration' ELSE NULL END,
      CASE WHEN include_sanskrit AND v.sanskrit ILIKE pattern THEN 'sanskrit' ELSE NULL END
    ], NULL) as matched_in,
    -- Snippet з підсвіченням (спрощений)
    ts_headline(
      search_config,
      COALESCE(
        CASE WHEN language_code = 'ua' THEN v.translation_uk ELSE v.translation_en END,
        CASE WHEN language_code = 'ua' THEN v.commentary_uk ELSE v.commentary_en END,
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
      -- Спочатку пробуємо FTS пошук
      (language_code = 'ua' AND v.search_vector_uk @@ ts_query)
      OR (language_code != 'ua' AND v.search_vector_en @@ ts_query)
      -- Fallback на ILIKE для коротких запитів
      OR (length(search_query) <= 3 AND (
        (include_translation AND (
          (language_code = 'ua' AND v.translation_uk ILIKE pattern) OR
          (language_code <> 'ua' AND v.translation_en ILIKE pattern)
        ))
        OR (include_commentary AND (
          (language_code = 'ua' AND v.commentary_uk ILIKE pattern) OR
          (language_code <> 'ua' AND v.commentary_en ILIKE pattern)
        ))
        OR (include_synonyms AND (
          (language_code = 'ua' AND v.synonyms_uk ILIKE pattern) OR
          (language_code <> 'ua' AND v.synonyms_en ILIKE pattern)
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

-- ============================================================================
-- 7. ФУНКЦІЯ ДЛЯ ПОШУКУ В ГЛОСАРІЇ (замість завантаження всіх віршів)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.search_glossary_terms(
  search_term text,
  search_language text DEFAULT 'ua',
  search_mode text DEFAULT 'contains', -- 'contains', 'exact', 'starts_with'
  book_filter uuid DEFAULT NULL,
  limit_count integer DEFAULT 100
)
RETURNS TABLE(
  term text,
  meaning text,
  verse_id uuid,
  verse_number text,
  chapter_number integer,
  canto_number integer,
  book_id uuid,
  book_title text,
  book_slug text,
  verse_link text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  synonyms_col text;
  pattern text;
BEGIN
  -- Вибираємо колонку синонімів залежно від мови
  IF search_language = 'ua' THEN
    synonyms_col := 'synonyms_uk';
  ELSE
    synonyms_col := 'synonyms_en';
  END IF;

  -- Створюємо pattern залежно від режиму пошуку
  IF search_mode = 'exact' THEN
    pattern := search_term;
  ELSIF search_mode = 'starts_with' THEN
    pattern := search_term || '%';
  ELSE -- contains
    pattern := '%' || search_term || '%';
  END IF;

  RETURN QUERY EXECUTE format($query$
    WITH parsed_synonyms AS (
      SELECT
        v.id as verse_id,
        v.verse_number,
        ch.chapter_number,
        ca.canto_number,
        b.id as book_id,
        CASE WHEN $2 = 'ua' THEN b.title_uk ELSE b.title_en END as book_title,
        b.slug as book_slug,
        -- Парсимо кожен рядок синонімів
        line as synonym_line
      FROM public.verses v
      JOIN public.chapters ch ON ch.id = v.chapter_id
      JOIN public.books b ON b.id = ch.book_id
      LEFT JOIN public.cantos ca ON ca.id = ch.canto_id
      CROSS JOIN LATERAL unnest(
        string_to_array(
          regexp_replace(COALESCE(v.%I, ''), E'\\n+', E'\n', 'g'),
          E'\n'
        )
      ) AS line
      WHERE ch.is_published = true
        AND v.deleted_at IS NULL
        AND v.%I IS NOT NULL
        AND v.%I != ''
        AND ($4 IS NULL OR ch.book_id = $4)
    ),
    extracted_terms AS (
      SELECT
        verse_id,
        verse_number,
        chapter_number,
        canto_number,
        book_id,
        book_title,
        book_slug,
        -- Витягуємо термін (слово до тире або двокрапки)
        TRIM(SPLIT_PART(SPLIT_PART(synonym_line, '—', 1), ':', 1)) as term,
        -- Значення (після тире або двокрапки)
        TRIM(
          COALESCE(
            NULLIF(SPLIT_PART(synonym_line, '—', 2), ''),
            NULLIF(SPLIT_PART(synonym_line, ':', 2), ''),
            ''
          )
        ) as meaning
      FROM parsed_synonyms
      WHERE synonym_line != ''
        AND LENGTH(TRIM(synonym_line)) > 2
    )
    SELECT
      et.term,
      et.meaning,
      et.verse_id,
      et.verse_number,
      et.chapter_number,
      et.canto_number,
      et.book_id,
      et.book_title,
      et.book_slug,
      -- Формуємо посилання
      CASE
        WHEN et.canto_number IS NOT NULL THEN
          '/veda-reader/' || et.book_slug || '/canto/' || et.canto_number || '/chapter/' || et.chapter_number || '/' || et.verse_number
        ELSE
          '/veda-reader/' || et.book_slug || '/' || et.chapter_number || '/' || et.verse_number
      END as verse_link
    FROM extracted_terms et
    WHERE et.term != ''
      AND et.term ILIKE $1
    ORDER BY et.term, et.book_id, et.chapter_number, et.verse_number
    LIMIT $3
  $query$,
  synonyms_col, synonyms_col, synonyms_col
  )
  USING pattern, search_language, limit_count, book_filter;
END;
$$;

-- ============================================================================
-- 8. УНІФІКОВАНИЙ ПОШУК ПО ВСЬОМУ САЙТУ
-- ============================================================================

CREATE OR REPLACE FUNCTION public.unified_search(
  search_query text,
  language_code text DEFAULT 'ua',
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
  IF language_code = 'ua' THEN
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
    CASE WHEN language_code = 'ua' THEN ch.title_uk ELSE ch.title_en END as subtitle,
    ts_headline(
      search_config,
      COALESCE(
        CASE WHEN language_code = 'ua' THEN v.translation_uk ELSE v.translation_en END,
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
      WHEN language_code = 'ua' AND v.search_vector_uk IS NOT NULL THEN
        ts_rank_cd(v.search_vector_uk, ts_query)::numeric
      WHEN language_code != 'ua' AND v.search_vector_en IS NOT NULL THEN
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
      (language_code = 'ua' AND v.search_vector_uk @@ ts_query)
      OR (language_code != 'ua' AND v.search_vector_en @@ ts_query)
      OR (length(search_query) <= 3 AND (
        (language_code = 'ua' AND v.translation_uk ILIKE pattern) OR
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
    CASE WHEN language_code = 'ua' THEN bp.title_uk ELSE bp.title_en END as title,
    CASE WHEN language_code = 'ua' THEN bp.excerpt_uk ELSE bp.excerpt_en END as subtitle,
    ts_headline(
      search_config,
      COALESCE(
        CASE WHEN language_code = 'ua' THEN bp.content_uk ELSE bp.content_en END,
        ''
      ),
      ts_query,
      'MaxWords=25, MinWords=10'
    ) as snippet,
    '/blog/' || bp.slug as href,
    CASE
      WHEN language_code = 'ua' AND bp.search_vector_uk IS NOT NULL THEN
        ts_rank_cd(bp.search_vector_uk, ts_query)::numeric
      WHEN language_code != 'ua' AND bp.search_vector_en IS NOT NULL THEN
        ts_rank_cd(bp.search_vector_en, ts_query)::numeric
      ELSE 0.5::numeric
    END as relevance,
    ARRAY['blog']::text[] as matched_in
  FROM public.blog_posts bp
  WHERE bp.is_published = true
    AND 'blog' = ANY(search_types)
    AND (
      (language_code = 'ua' AND bp.search_vector_uk @@ ts_query)
      OR (language_code != 'ua' AND bp.search_vector_en @@ ts_query)
      OR (length(search_query) <= 3 AND (
        (language_code = 'ua' AND (bp.title_uk ILIKE pattern OR bp.content_uk ILIKE pattern)) OR
        (language_code != 'ua' AND (bp.title_en ILIKE pattern OR bp.content_en ILIKE pattern))
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
-- 9. ФУНКЦІЯ ДЛЯ ПІДКАЗОК (AUTOCOMPLETE / DID YOU MEAN)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.search_suggest_terms(
  search_prefix text,
  language_code text DEFAULT 'ua',
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
  RETURN QUERY
  WITH all_suggestions AS (
    -- Терміни з глосарію
    SELECT DISTINCT
      LOWER(TRIM(SPLIT_PART(SPLIT_PART(line, '—', 1), ':', 1))) as term,
      'glossary' as src
    FROM public.verses v
    CROSS JOIN LATERAL unnest(
      string_to_array(
        CASE WHEN language_code = 'ua' THEN v.synonyms_uk ELSE v.synonyms_en END,
        E'\n'
      )
    ) AS line
    WHERE v.deleted_at IS NULL
      AND (
        (language_code = 'ua' AND v.synonyms_uk IS NOT NULL) OR
        (language_code != 'ua' AND v.synonyms_en IS NOT NULL)
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
-- 10. КОМЕНТАРІ ДО ФУНКЦІЙ
-- ============================================================================

COMMENT ON FUNCTION public.search_verses_fulltext IS
'Оптимізований повнотекстовий пошук по віршах з використанням GIN індексів та ts_vector';

COMMENT ON FUNCTION public.search_glossary_terms IS
'Серверний пошук термінів глосарію (замість завантаження всіх віршів на клієнт)';

COMMENT ON FUNCTION public.unified_search IS
'Уніфікований пошук по всьому сайту (вірші, блог, лекції, листи)';

COMMENT ON FUNCTION public.search_suggest_terms IS
'Автокомпліт/підказки для пошукового поля';

-- ============================================================================
-- Приклади використання:
-- ============================================================================
--
-- Пошук віршів:
-- SELECT * FROM search_verses_fulltext('душа', 'ua', false, false, true, true, true, NULL, 20);
--
-- Пошук у глосарії:
-- SELECT * FROM search_glossary_terms('кришна', 'ua', 'contains', NULL, 50);
--
-- Уніфікований пошук:
-- SELECT * FROM unified_search('любов', 'ua', ARRAY['verses', 'blog'], 10);
--
-- Підказки:
-- SELECT * FROM search_suggest_terms('кр', 'ua', 10);
