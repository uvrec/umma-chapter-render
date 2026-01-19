-- ============================================================================
-- Міграція: Додати аудіо-поля у verses, тригер для daily_quotes, RPC функції
-- ============================================================================

-- 1. Додати нові аудіо-поля у таблицю verses
ALTER TABLE public.verses
  ADD COLUMN IF NOT EXISTS full_verse_audio_url TEXT,
  ADD COLUMN IF NOT EXISTS recitation_audio_url TEXT,
  ADD COLUMN IF NOT EXISTS explanation_uk_audio_url TEXT,
  ADD COLUMN IF NOT EXISTS explanation_en_audio_url TEXT;

COMMENT ON COLUMN public.verses.full_verse_audio_url IS 'Повне аудіо вірша (санскрит + переклад + коментар)';
COMMENT ON COLUMN public.verses.recitation_audio_url IS 'Аудіо тільки санскриту (рецитація)';
COMMENT ON COLUMN public.verses.explanation_uk_audio_url IS 'Аудіо українського пояснення';
COMMENT ON COLUMN public.verses.explanation_en_audio_url IS 'Аудіо англійського пояснення';

-- 2. Додати тригер для оновлення updated_at в daily_quotes
DROP TRIGGER IF EXISTS trg_daily_quotes_set_updated_at ON public.daily_quotes;

CREATE TRIGGER trg_daily_quotes_set_updated_at
  BEFORE UPDATE ON public.daily_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_daily_quotes_updated_at();

-- 3. Створити RPC функцію для повнотекстового пошуку віршів
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
  pattern text;
BEGIN
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
    NULL::integer as canto_number,
    NULL::text as canto_title,
    (CASE WHEN include_sanskrit THEN v.sanskrit ELSE NULL END) as sanskrit,
    (CASE WHEN include_transliteration THEN v.transliteration ELSE NULL END) as transliteration,
    (CASE WHEN include_synonyms
          THEN (CASE WHEN language_code = 'ua' THEN v.synonyms_uk ELSE v.synonyms_en END)
          ELSE NULL END) as synonyms,
    (CASE WHEN include_translation
          THEN (CASE WHEN language_code = 'ua' THEN v.translation_uk ELSE v.translation_en END)
          ELSE NULL END) as translation,
    (CASE WHEN include_commentary
          THEN (CASE WHEN language_code = 'ua' THEN v.commentary_uk ELSE v.commentary_en END)
          ELSE NULL END) as commentary,
    1::numeric as relevance_rank,
    ARRAY_REMOVE(ARRAY[
      CASE WHEN include_translation AND ((language_code = 'ua' AND v.translation_uk ILIKE pattern) OR (language_code <> 'ua' AND v.translation_en ILIKE pattern)) THEN 'translation' ELSE NULL END,
      CASE WHEN include_commentary AND ((language_code = 'ua' AND v.commentary_uk ILIKE pattern) OR (language_code <> 'ua' AND v.commentary_en ILIKE pattern)) THEN 'commentary' ELSE NULL END,
      CASE WHEN include_synonyms AND ((language_code = 'ua' AND v.synonyms_uk ILIKE pattern) OR (language_code <> 'ua' AND v.synonyms_en ILIKE pattern)) THEN 'synonyms' ELSE NULL END,
      CASE WHEN include_transliteration AND v.transliteration ILIKE pattern THEN 'transliteration' ELSE NULL END,
      CASE WHEN include_sanskrit AND v.sanskrit ILIKE pattern THEN 'sanskrit' ELSE NULL END
    ], NULL) as matched_in,
    LEFT(
      COALESCE(
        CASE WHEN language_code = 'ua' THEN v.translation_uk ELSE v.translation_en END,
        CASE WHEN language_code = 'ua' THEN v.commentary_uk ELSE v.commentary_en END,
        v.synonyms_uk, v.synonyms_en, v.transliteration, v.sanskrit, ''
      ),
      200
    ) as search_snippet
  FROM public.verses v
  JOIN public.chapters ch ON ch.id = v.chapter_id
  JOIN public.books b ON b.id = ch.book_id
  WHERE ch.is_published = true
    AND v.deleted_at IS NULL
    AND (
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
      OR (include_transliteration AND v.transliteration ILIKE pattern)
      OR (include_sanskrit AND v.sanskrit ILIKE pattern)
    )
    AND (book_ids IS NULL OR ch.book_id = ANY(book_ids))
  ORDER BY b.display_order NULLS LAST, ch.chapter_number, v.sort_key NULLS FIRST, v.verse_number
  LIMIT limit_count;
END;
$$;

-- 4. Створити RPC функцію для статистики за темами
CREATE OR REPLACE FUNCTION public.get_topic_statistics(
  search_query text,
  language_code text,
  book_ids uuid[] DEFAULT NULL
)
RETURNS TABLE(
  book_id uuid,
  book_title text,
  book_slug text,
  verse_count integer,
  sample_verses text[]
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  pattern text;
BEGIN
  pattern := '%' || search_query || '%';

  RETURN QUERY
  WITH matched AS (
    SELECT v.id, ch.book_id
    FROM public.verses v
    JOIN public.chapters ch ON ch.id = v.chapter_id
    WHERE ch.is_published = true
      AND v.deleted_at IS NULL
      AND (
        (language_code = 'ua' AND (v.translation_uk ILIKE pattern OR v.commentary_uk ILIKE pattern OR v.synonyms_uk ILIKE pattern))
        OR (language_code <> 'ua' AND (v.translation_en ILIKE pattern OR v.commentary_en ILIKE pattern OR v.synonyms_en ILIKE pattern))
        OR v.transliteration ILIKE pattern
        OR v.sanskrit ILIKE pattern
      )
      AND (book_ids IS NULL OR ch.book_id = ANY(book_ids))
  )
  SELECT
    b.id as book_id,
    CASE WHEN language_code = 'ua' THEN b.title_uk ELSE b.title_en END as book_title,
    b.slug as book_slug,
    COUNT(m.id)::int as verse_count,
    ARRAY(
      SELECT v.verse_number::text
      FROM public.verses v
      JOIN public.chapters ch2 ON ch2.id = v.chapter_id
      WHERE ch2.book_id = b.id AND v.deleted_at IS NULL
      ORDER BY v.sort_key NULLS FIRST, v.verse_number
      LIMIT 5
    ) as sample_verses
  FROM matched m
  JOIN public.books b ON b.id = m.book_id
  GROUP BY b.id, b.title_uk, b.title_en, b.slug
  ORDER BY verse_count DESC, b.display_order NULLS LAST;
END;
$$;