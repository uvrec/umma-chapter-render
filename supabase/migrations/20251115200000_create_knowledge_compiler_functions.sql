-- =====================================================
-- Spiritual Knowledge Compiler - Database Functions
-- =====================================================
-- This migration creates functions for full-text search
-- and intelligent compilation of spiritual knowledge.

-- Function 1: Search verses with full-text search
-- =====================================================
-- Searches verses using PostgreSQL full-text search capabilities
-- Returns verses with relevance ranking and full metadata
CREATE OR REPLACE FUNCTION public.search_verses_fulltext(
  search_query TEXT,
  language_code TEXT DEFAULT 'ua',
  include_sanskrit BOOLEAN DEFAULT TRUE,
  include_transliteration BOOLEAN DEFAULT TRUE,
  include_synonyms BOOLEAN DEFAULT TRUE,
  include_translation BOOLEAN DEFAULT TRUE,
  include_commentary BOOLEAN DEFAULT TRUE,
  book_ids UUID[] DEFAULT NULL,
  limit_count INTEGER DEFAULT 100
)
RETURNS TABLE (
  verse_id UUID,
  verse_number TEXT,
  chapter_id UUID,
  chapter_number INTEGER,
  chapter_title TEXT,
  book_id UUID,
  book_title TEXT,
  book_slug TEXT,
  canto_id UUID,
  canto_number INTEGER,
  canto_title TEXT,
  -- Verse content
  sanskrit TEXT,
  transliteration TEXT,
  synonyms TEXT,
  translation TEXT,
  commentary TEXT,
  -- Search metadata
  relevance_rank REAL,
  matched_in TEXT[], -- Array showing which fields matched (e.g., ['translation', 'commentary'])
  search_snippet TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ts_query tsquery;
  search_config regconfig;
BEGIN
  -- Determine search configuration based on language
  IF language_code = 'en' THEN
    search_config := 'english';
  ELSE
    search_config := 'simple'; -- Use simple for Ukrainian or default
  END IF;

  -- Create tsquery from search terms
  -- Using plainto_tsquery to handle user-friendly queries
  ts_query := plainto_tsquery(search_config, search_query);

  RETURN QUERY
  SELECT
    v.id AS verse_id,
    v.verse_number,
    c.id AS chapter_id,
    c.chapter_number,
    CASE
      WHEN language_code = 'en' THEN c.title_en
      ELSE c.title_ua
    END AS chapter_title,
    b.id AS book_id,
    CASE
      WHEN language_code = 'en' THEN b.title_en
      ELSE b.title_ua
    END AS book_title,
    b.slug AS book_slug,
    ca.id AS canto_id,
    ca.canto_number,
    CASE
      WHEN language_code = 'en' THEN ca.title_en
      ELSE ca.title_ua
    END AS canto_title,
    -- Verse content (return based on language preference)
    COALESCE(
      CASE WHEN language_code = 'en' THEN v.sanskrit_en ELSE v.sanskrit_ua END,
      v.sanskrit
    ) AS sanskrit,
    COALESCE(
      CASE WHEN language_code = 'en' THEN v.transliteration_en ELSE v.transliteration_ua END,
      v.transliteration
    ) AS transliteration,
    CASE
      WHEN language_code = 'en' THEN v.synonyms_en
      ELSE v.synonyms_ua
    END AS synonyms,
    CASE
      WHEN language_code = 'en' THEN v.translation_en
      ELSE v.translation_ua
    END AS translation,
    CASE
      WHEN language_code = 'en' THEN v.commentary_en
      ELSE v.commentary_ua
    END AS commentary,
    -- Relevance ranking using ts_rank
    ts_rank(v.search_vector, ts_query) AS relevance_rank,
    -- Determine which fields matched
    ARRAY(
      SELECT unnest(ARRAY[
        CASE WHEN include_translation AND v.search_vector @@ ts_query THEN 'translation' END,
        CASE WHEN include_commentary AND v.search_vector @@ ts_query THEN 'commentary' END,
        CASE WHEN include_synonyms AND v.search_vector @@ ts_query THEN 'synonyms' END
      ])
      WHERE unnest IS NOT NULL
    ) AS matched_in,
    -- Create a search snippet
    ts_headline(
      search_config,
      COALESCE(
        CASE
          WHEN language_code = 'en' THEN v.translation_en
          ELSE v.translation_ua
        END,
        ''
      ),
      ts_query,
      'MaxWords=30, MinWords=15, ShortWord=3, HighlightAll=FALSE, MaxFragments=1'
    ) AS search_snippet
  FROM
    public.verses v
  INNER JOIN public.chapters c ON v.chapter_id = c.id
  INNER JOIN public.books b ON c.book_id = b.id
  LEFT JOIN public.cantos ca ON c.canto_id = ca.id
  WHERE
    -- Search vector match
    v.search_vector @@ ts_query
    -- Filter by book if specified
    AND (book_ids IS NULL OR b.id = ANY(book_ids))
    -- Only published verses
    AND v.is_published = TRUE
    AND b.is_published = TRUE
  ORDER BY
    relevance_rank DESC,
    b.display_order ASC,
    ca.canto_number ASC NULLS FIRST,
    c.chapter_number ASC,
    v.verse_number_sort ASC
  LIMIT limit_count;
END;
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.search_verses_fulltext TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_verses_fulltext TO anon;

-- Add comment
COMMENT ON FUNCTION public.search_verses_fulltext IS
'Full-text search function for verses. Searches across translation, commentary, and synonyms using PostgreSQL tsvector. Returns results ranked by relevance with metadata about matched fields.';


-- Function 2: Get related verses by topic
-- =====================================================
-- Finds verses related to a given verse based on shared terms
-- Useful for building themed compilations
CREATE OR REPLACE FUNCTION public.find_related_verses(
  source_verse_id UUID,
  language_code TEXT DEFAULT 'ua',
  similarity_threshold REAL DEFAULT 0.1,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  verse_id UUID,
  verse_number TEXT,
  chapter_title TEXT,
  book_title TEXT,
  translation TEXT,
  similarity_score REAL
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH source_verse AS (
    SELECT search_vector
    FROM public.verses
    WHERE id = source_verse_id
  )
  SELECT
    v.id AS verse_id,
    v.verse_number,
    CASE
      WHEN language_code = 'en' THEN c.title_en
      ELSE c.title_ua
    END AS chapter_title,
    CASE
      WHEN language_code = 'en' THEN b.title_en
      ELSE b.title_ua
    END AS book_title,
    CASE
      WHEN language_code = 'en' THEN v.translation_en
      ELSE v.translation_ua
    END AS translation,
    -- Calculate similarity using ts_rank with source verse vector
    ts_rank(v.search_vector, (SELECT search_vector::text::tsquery FROM source_verse)) AS similarity_score
  FROM
    public.verses v
  INNER JOIN public.chapters c ON v.chapter_id = c.id
  INNER JOIN public.books b ON c.book_id = b.id
  CROSS JOIN source_verse sv
  WHERE
    v.id != source_verse_id
    AND v.is_published = TRUE
    AND b.is_published = TRUE
    -- Basic similarity check
    AND ts_rank(v.search_vector, sv.search_vector::text::tsquery) > similarity_threshold
  ORDER BY
    similarity_score DESC
  LIMIT limit_count;
END;
$$;

-- Grant access
GRANT EXECUTE ON FUNCTION public.find_related_verses TO authenticated;
GRANT EXECUTE ON FUNCTION public.find_related_verses TO anon;

COMMENT ON FUNCTION public.find_related_verses IS
'Finds verses thematically related to a given verse using vector similarity. Useful for building themed compilations and discovering connected teachings.';


-- Function 3: Get verse statistics by topic
-- =====================================================
-- Analyzes how many verses discuss a topic across different books
CREATE OR REPLACE FUNCTION public.get_topic_statistics(
  search_query TEXT,
  language_code TEXT DEFAULT 'ua'
)
RETURNS TABLE (
  book_id UUID,
  book_title TEXT,
  book_slug TEXT,
  verse_count BIGINT,
  sample_verses TEXT[] -- Array of verse references (e.g., "BG 2.13")
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ts_query tsquery;
  search_config regconfig;
BEGIN
  -- Determine search configuration
  IF language_code = 'en' THEN
    search_config := 'english';
  ELSE
    search_config := 'simple';
  END IF;

  ts_query := plainto_tsquery(search_config, search_query);

  RETURN QUERY
  SELECT
    b.id AS book_id,
    CASE
      WHEN language_code = 'en' THEN b.title_en
      ELSE b.title_ua
    END AS book_title,
    b.slug AS book_slug,
    COUNT(v.id) AS verse_count,
    ARRAY_AGG(
      c.chapter_number::TEXT || '.' || v.verse_number
      ORDER BY c.chapter_number, v.verse_number_sort
    ) FILTER (WHERE v.id IS NOT NULL) AS sample_verses
  FROM
    public.books b
  INNER JOIN public.chapters c ON c.book_id = b.id
  INNER JOIN public.verses v ON v.chapter_id = c.id
  WHERE
    v.search_vector @@ ts_query
    AND v.is_published = TRUE
    AND b.is_published = TRUE
  GROUP BY
    b.id, b.title_en, b.title_ua, b.slug, b.display_order
  HAVING
    COUNT(v.id) > 0
  ORDER BY
    verse_count DESC,
    b.display_order ASC;
END;
$$;

-- Grant access
GRANT EXECUTE ON FUNCTION public.get_topic_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_topic_statistics TO anon;

COMMENT ON FUNCTION public.get_topic_statistics IS
'Provides statistics on how many verses discuss a topic across different books. Useful for understanding topic distribution in the knowledge base.';


-- =====================================================
-- Search Vector Maintenance
-- =====================================================
-- Ensure search_vector column exists and create triggers
-- to automatically update it when verse content changes

-- Add search_vector column if it doesn't exist
ALTER TABLE public.verses
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create index on search_vector for fast full-text search
CREATE INDEX IF NOT EXISTS idx_verses_search_vector
ON public.verses USING gin(search_vector);

-- Function to update search_vector for verses
-- Combines content from multiple fields (translation, commentary, synonyms)
CREATE OR REPLACE FUNCTION public.update_verse_search_vector()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Build search vector from Ukrainian and English content
  -- Weight: A = most important (translation), B = important (commentary), C = synonyms
  NEW.search_vector :=
    setweight(to_tsvector('simple', COALESCE(NEW.translation_ua, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.translation_en, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.commentary_ua, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.commentary_en, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.synonyms_ua, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(NEW.synonyms_en, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(NEW.transliteration, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(NEW.transliteration_ua, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(NEW.transliteration_en, '')), 'C');

  RETURN NEW;
END;
$$;

-- Create trigger to automatically update search_vector
DROP TRIGGER IF EXISTS verses_search_vector_update ON public.verses;

CREATE TRIGGER verses_search_vector_update
  BEFORE INSERT OR UPDATE OF
    translation_ua, translation_en,
    commentary_ua, commentary_en,
    synonyms_ua, synonyms_en,
    transliteration, transliteration_ua, transliteration_en
  ON public.verses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_verse_search_vector();

-- Populate search_vector for existing verses
-- This may take a while for large datasets
UPDATE public.verses
SET search_vector =
  setweight(to_tsvector('simple', COALESCE(translation_ua, '')), 'A') ||
  setweight(to_tsvector('simple', COALESCE(translation_en, '')), 'A') ||
  setweight(to_tsvector('simple', COALESCE(commentary_ua, '')), 'B') ||
  setweight(to_tsvector('simple', COALESCE(commentary_en, '')), 'B') ||
  setweight(to_tsvector('simple', COALESCE(synonyms_ua, '')), 'C') ||
  setweight(to_tsvector('simple', COALESCE(synonyms_en, '')), 'C') ||
  setweight(to_tsvector('simple', COALESCE(transliteration, '')), 'C') ||
  setweight(to_tsvector('simple', COALESCE(transliteration_ua, '')), 'C') ||
  setweight(to_tsvector('simple', COALESCE(transliteration_en, '')), 'C')
WHERE search_vector IS NULL OR search_vector = to_tsvector('simple', '');

COMMENT ON TRIGGER verses_search_vector_update ON public.verses IS
'Automatically updates the search_vector column when verse content changes. The search vector includes translation (weight A), commentary (weight B), and synonyms/transliteration (weight C) in both Ukrainian and English.';
