-- ============================================================================
-- СИСТЕМА ПОШУКУ СИНОНІМІВ (як на vedabase.io/en/search/synonyms)
-- ============================================================================

-- Включаємо розширення pg_trgm якщо ще не включено
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. СТВОРЮЄМО ІНДЕКСИ для повнотекстового пошуку по синонімах
CREATE INDEX IF NOT EXISTS idx_verses_synonyms_uk_gin
  ON verses USING gin(to_tsvector('simple', COALESCE(synonyms_uk, '')));

CREATE INDEX IF NOT EXISTS idx_verses_synonyms_en_gin
  ON verses USING gin(to_tsvector('english', COALESCE(synonyms_en, '')));

-- Індекси для швидкого LIKE пошуку (для точних збігів)
CREATE INDEX IF NOT EXISTS idx_verses_synonyms_uk_pattern
  ON verses USING gin(synonyms_uk gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_verses_synonyms_en_pattern
  ON verses USING gin(synonyms_en gin_trgm_ops);

-- ============================================================================
-- ФУНКЦІЯ ПОШУКУ СИНОНІМІВ
-- ============================================================================

CREATE OR REPLACE FUNCTION search_synonyms(
  search_term TEXT,
  search_language TEXT DEFAULT 'uk',
  search_mode TEXT DEFAULT 'contains',
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  verse_id UUID,
  book_slug TEXT,
  book_title TEXT,
  chapter_number INTEGER,
  verse_number TEXT,
  sanskrit TEXT,
  transliteration TEXT,
  synonyms TEXT,
  translation TEXT,
  match_rank REAL
) AS $$
DECLARE
  synonyms_column TEXT;
  translation_column TEXT;
  transliteration_column TEXT;
  tsconfig TEXT;
BEGIN
  IF search_language = 'uk' THEN
    synonyms_column := 'synonyms_uk';
    translation_column := 'translation_uk';
    transliteration_column := 'transliteration_uk';
    tsconfig := 'simple';
  ELSE
    synonyms_column := 'synonyms_en';
    translation_column := 'translation_en';
    transliteration_column := 'transliteration_en';
    tsconfig := 'english';
  END IF;

  RETURN QUERY EXECUTE format($query$
    SELECT
      v.id AS verse_id,
      b.slug AS book_slug,
      CASE WHEN $2 = 'uk' THEN b.title_uk ELSE b.title_en END AS book_title,
      c.chapter_number,
      v.verse_number,
      v.sanskrit,
      v.%I AS transliteration,
      v.%I AS synonyms,
      v.%I AS translation,
      CASE
        WHEN $3 = 'exact' THEN
          ts_rank(to_tsvector($4, COALESCE(v.%I, '')), plainto_tsquery($4, $1))
        WHEN $3 = 'starts_with' THEN
          similarity(lower($1), lower(regexp_replace(COALESCE(v.%I, ''), '.*?([а-яґєіїa-z]+).*', '\1', 'i')))
        ELSE
          ts_rank(to_tsvector($4, COALESCE(v.%I, '')), plainto_tsquery($4, $1))
      END AS match_rank
    FROM verses v
    INNER JOIN chapters c ON v.chapter_id = c.id
    INNER JOIN books b ON c.book_id = b.id
    WHERE
      v.is_published = true
      AND v.deleted_at IS NULL
      AND v.%I IS NOT NULL
      AND v.%I != ''
      AND (
        CASE
          WHEN $3 = 'exact' THEN
            to_tsvector($4, COALESCE(v.%I, '')) @@ plainto_tsquery($4, $1)
          WHEN $3 = 'starts_with' THEN
            v.%I ILIKE ($1 || '%%')
          ELSE
            v.%I ILIKE ('%%' || $1 || '%%')
        END
      )
    ORDER BY match_rank DESC, b.display_order, c.chapter_number, v.sort_key
    LIMIT $5 OFFSET $6
  $query$,
  transliteration_column,
  synonyms_column,
  translation_column,
  synonyms_column,
  synonyms_column,
  synonyms_column,
  synonyms_column,
  synonyms_column,
  synonyms_column,
  synonyms_column,
  synonyms_column
  )
  USING search_term, search_language, search_mode, tsconfig, limit_count, offset_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- ФУНКЦІЯ для отримання всіх унікальних термінів (для автокомпліту)
-- ============================================================================

CREATE OR REPLACE FUNCTION get_unique_synonym_terms(
  search_language TEXT DEFAULT 'uk',
  prefix_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 100
)
RETURNS TABLE (
  term TEXT,
  frequency INTEGER
) AS $$
DECLARE
  synonyms_column TEXT;
BEGIN
  IF search_language = 'uk' THEN
    synonyms_column := 'synonyms_uk';
  ELSE
    synonyms_column := 'synonyms_en';
  END IF;

  RETURN QUERY EXECUTE format($query$
    WITH split_synonyms AS (
      SELECT
        TRIM(regexp_split_to_table(
          regexp_replace(COALESCE(v.%I, ''), '[—;]', ',', 'g'),
          ','
        )) AS term
      FROM verses v
      WHERE
        v.is_published = true
        AND v.deleted_at IS NULL
        AND v.%I IS NOT NULL
        AND v.%I != ''
        %s
    )
    SELECT
      term,
      COUNT(*)::INTEGER AS frequency
    FROM split_synonyms
    WHERE
      term != ''
      AND length(term) > 2
    GROUP BY term
    ORDER BY frequency DESC, term
    LIMIT $1
  $query$,
  synonyms_column,
  synonyms_column,
  synonyms_column,
  CASE
    WHEN prefix_filter IS NOT NULL THEN
      format('AND v.%I ILIKE ($2 || ''%%'')', synonyms_column)
    ELSE
      ''
  END
  )
  USING limit_count, prefix_filter;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- VIEW для зручного доступу до синонімів
-- ============================================================================

DROP VIEW IF EXISTS verses_with_synonyms;
CREATE VIEW verses_with_synonyms AS
SELECT
  v.id,
  b.slug AS book_slug,
  b.title_uk,
  b.title_en,
  c.chapter_number,
  v.verse_number,
  v.sanskrit,
  v.transliteration,
  v.synonyms_uk,
  v.synonyms_en,
  v.translation_uk,
  v.translation_en
FROM verses v
INNER JOIN chapters c ON v.chapter_id = c.id
INNER JOIN books b ON c.book_id = b.id
WHERE v.synonyms_uk IS NOT NULL OR v.synonyms_en IS NOT NULL;