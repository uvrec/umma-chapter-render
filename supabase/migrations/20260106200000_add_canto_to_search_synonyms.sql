-- ============================================================================
-- ОНОВЛЕННЯ ФУНКЦІЇ search_synonyms - додаємо canto_number для ШБ
-- ============================================================================

-- Видаляємо стару функцію (через зміну типу повернення)
DROP FUNCTION IF EXISTS search_synonyms(TEXT, TEXT, TEXT, INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION search_synonyms(
  search_term TEXT,
  search_language TEXT DEFAULT 'ua',
  search_mode TEXT DEFAULT 'contains', -- contains, starts_with, exact
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  verse_id UUID,
  book_slug TEXT,
  book_title TEXT,
  chapter_number INTEGER,
  verse_number TEXT,
  canto_number INTEGER,  -- Додано для Шрімад-Бгаватам
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
  tsconfig regconfig;
BEGIN
  -- Визначаємо мову та колонки
  IF search_language = 'ua' THEN
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

  -- Виконуємо пошук залежно від режиму
  RETURN QUERY EXECUTE format($query$
    SELECT
      v.id AS verse_id,
      b.slug AS book_slug,
      CASE WHEN $2 = 'ua' THEN b.title_uk ELSE b.title_en END AS book_title,
      c.chapter_number,
      v.verse_number,
      ca.canto_number,  -- Додано для Шрімад-Бгаватам
      v.sanskrit,
      v.%I AS transliteration,
      v.%I AS synonyms,
      v.%I AS translation,
      CASE
        WHEN $3 = 'exact' THEN
          ts_rank(to_tsvector($4, COALESCE(v.%I, '')), plainto_tsquery($4, $1))
        WHEN $3 = 'starts_with' THEN
          similarity(lower($1), lower(regexp_replace(COALESCE(v.%I, ''), '.*?([а-яґєіїa-z]+).*', '\1', 'i')))
        ELSE -- contains
          ts_rank(to_tsvector($4, COALESCE(v.%I, '')), plainto_tsquery($4, $1))
      END AS match_rank
    FROM verses v
    INNER JOIN chapters c ON v.chapter_id = c.id
    INNER JOIN books b ON c.book_id = b.id
    LEFT JOIN cantos ca ON c.canto_id = ca.id  -- LEFT JOIN для книг без canto
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
          ELSE -- contains
            v.%I ILIKE ('%%' || $1 || '%%')
        END
      )
    ORDER BY match_rank DESC, ca.canto_number NULLS FIRST, c.chapter_number, v.verse_number_sort
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
