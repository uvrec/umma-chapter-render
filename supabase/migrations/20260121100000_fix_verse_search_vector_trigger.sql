-- ============================================================================
-- Fix: Restore correct search vector trigger for verses
-- ============================================================================
-- Migration 20260120100000 accidentally overwrote the trigger function
-- that updates search_vector_uk and search_vector_en columns.
-- This fix restores the correct behavior that updates ALL search vectors.
-- ============================================================================

-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS verses_search_vector_update ON public.verses;
DROP TRIGGER IF EXISTS trg_verses_search_vector ON public.verses;

-- ============================================================================
-- 1. CORRECT TRIGGER FUNCTION - updates ALL search vector columns
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_verse_search_vector()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- ========================================================================
  -- Language-specific vectors (used by advanced search functions)
  -- ========================================================================

  -- Ukrainian vector (simple_unaccent for accent-insensitive Cyrillic search)
  NEW.search_vector_uk :=
    setweight(to_tsvector('public.simple_unaccent', COALESCE(NEW.translation_uk, '')), 'A') ||
    setweight(to_tsvector('public.simple_unaccent', COALESCE(NEW.commentary_uk, '')), 'B') ||
    setweight(to_tsvector('public.simple_unaccent', COALESCE(NEW.synonyms_uk, '')), 'C') ||
    setweight(to_tsvector('public.simple_unaccent', COALESCE(NEW.transliteration_uk, COALESCE(NEW.transliteration, ''))), 'D');

  -- English vector (proper stemming and stop words)
  NEW.search_vector_en :=
    setweight(to_tsvector('english', COALESCE(NEW.translation_en, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.commentary_en, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.synonyms_en, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(NEW.transliteration_en, COALESCE(NEW.transliteration, ''))), 'D') ||
    setweight(to_tsvector('simple', COALESCE(NEW.sanskrit, '')), 'D');

  -- ========================================================================
  -- Combined vector (for backward compatibility with basic search)
  -- ========================================================================
  NEW.search_vector :=
    -- Ukrainian fields (simple config)
    setweight(to_tsvector('simple', COALESCE(NEW.translation_uk, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.commentary_uk, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.synonyms_uk, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(NEW.transliteration_uk, '')), 'C') ||
    -- English fields
    setweight(to_tsvector('english', COALESCE(NEW.translation_en, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.commentary_en, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.synonyms_en, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.transliteration_en, '')), 'C') ||
    -- Transliteration (simple - preserves diacritics)
    setweight(to_tsvector('simple', COALESCE(NEW.transliteration, '')), 'C');

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.update_verse_search_vector() IS
'Updates all search vector columns: search_vector_uk (simple_unaccent), search_vector_en (english), and combined search_vector (simple/english mix).';

-- ============================================================================
-- 2. CREATE UNIFIED TRIGGER
-- ============================================================================

CREATE TRIGGER trg_verses_search_vector
  BEFORE INSERT OR UPDATE OF
    translation_uk, translation_en,
    commentary_uk, commentary_en,
    synonyms_uk, synonyms_en,
    transliteration, transliteration_uk, transliteration_en,
    sanskrit
  ON public.verses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_verse_search_vector();

COMMENT ON TRIGGER trg_verses_search_vector ON public.verses IS
'Automatically updates all search_vector columns when verse content changes.';

-- ============================================================================
-- 3. REFRESH ALL EXISTING VERSES (batch update)
-- ============================================================================
-- This ensures all verses have correct search vectors

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
    setweight(to_tsvector('simple', COALESCE(sanskrit, '')), 'D'),
  search_vector =
    setweight(to_tsvector('simple', COALESCE(translation_uk, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(commentary_uk, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(synonyms_uk, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(transliteration_uk, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(translation_en, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(commentary_en, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(synonyms_en, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(transliteration_en, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(transliteration, '')), 'C');

-- ============================================================================
-- 4. VERIFY INDEXES EXIST
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_verses_search_vector ON public.verses USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_verses_search_vector_uk ON public.verses USING GIN (search_vector_uk);
CREATE INDEX IF NOT EXISTS idx_verses_search_vector_en ON public.verses USING GIN (search_vector_en);

-- ============================================================================
-- SUMMARY:
-- - Trigger now updates: search_vector, search_vector_uk, search_vector_en
-- - Ukrainian: uses 'public.simple_unaccent' for accent-insensitive search
-- - English: uses 'english' config for proper stemming
-- - Combined: uses 'simple' for UK, 'english' for EN (backward compatible)
-- - All existing verses refreshed with correct vectors
-- ============================================================================
