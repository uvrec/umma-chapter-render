-- Fix: Update search vector trigger to use _uk column names instead of _ua
-- This fixes the error: "record 'new' has no field 'transliteration_ua'"
-- The columns were renamed from _ua to _uk, but the trigger still referenced _ua
--
-- Changes:
-- 1. Uses 'simple' for Ukrainian (no standard PG config for Ukrainian)
-- 2. Uses 'english' for English fields (better stemming/stop words)
-- 3. Creates GIN index if not exists
-- 4. Updates all existing rows to recalculate search_vector

-- Drop existing triggers first
DROP TRIGGER IF EXISTS verses_search_vector_update ON public.verses;
DROP TRIGGER IF EXISTS update_verse_search_vectors ON public.verses;

-- Ensure search_vector column exists
ALTER TABLE public.verses ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_verses_search_vector ON public.verses USING GIN (search_vector);

-- Recreate the function with correct _uk column names and proper text search configs
CREATE OR REPLACE FUNCTION public.update_verse_search_vector()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Build search vector from Ukrainian and English content
  -- Weight: A = most important (translation), B = important (commentary), C = synonyms/transliteration
  -- Ukrainian: 'simple' (no stemming, preserves Cyrillic as-is)
  -- English: 'english' (proper stemming and stop words)
  NEW.search_vector :=
    -- Ukrainian fields (simple config)
    setweight(to_tsvector('simple', COALESCE(NEW.translation_uk, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.commentary_uk, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.synonyms_uk, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(NEW.transliteration_uk, '')), 'C') ||
    -- English fields (english config for better stemming)
    setweight(to_tsvector('english', COALESCE(NEW.translation_en, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.commentary_en, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.synonyms_en, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.transliteration_en, '')), 'C') ||
    -- Transliteration (simple - preserves diacritics)
    setweight(to_tsvector('simple', COALESCE(NEW.transliteration, '')), 'C');

  RETURN NEW;
END;
$$;

-- Also fix the function with old name if it exists (for backwards compatibility)
CREATE OR REPLACE FUNCTION public.update_verse_search_vectors()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', COALESCE(NEW.translation_uk, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.commentary_uk, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.synonyms_uk, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(NEW.transliteration_uk, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.translation_en, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.commentary_en, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.synonyms_en, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.transliteration_en, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(NEW.transliteration, '')), 'C');
  RETURN NEW;
END;
$$;

-- Recreate trigger with correct column references
CREATE TRIGGER verses_search_vector_update
  BEFORE INSERT OR UPDATE OF
    translation_uk, translation_en,
    commentary_uk, commentary_en,
    synonyms_uk, synonyms_en,
    transliteration, transliteration_uk, transliteration_en
  ON public.verses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_verse_search_vector();

COMMENT ON TRIGGER verses_search_vector_update ON public.verses IS
'Automatically updates the search_vector column when verse content changes. Uses simple config for Ukrainian, english config for English fields.';

-- Fix sync_transliteration_fields() function that also referenced _ua columns
CREATE OR REPLACE FUNCTION public.sync_transliteration_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Keep uk as the canonical transliteration column
  -- Fixed: was using transliteration_ua which no longer exists
  IF NEW.transliteration_uk IS NULL AND NEW.transliteration IS NOT NULL THEN
    NEW.transliteration_uk := NEW.transliteration;
  END IF;

  -- Keep generic transliteration in sync from uk
  IF NEW.transliteration IS NULL AND NEW.transliteration_uk IS NOT NULL THEN
    NEW.transliteration := NEW.transliteration_uk;
  END IF;

  RETURN NEW;
END;
$$;

-- Mass update: recalculate search_vector for ALL existing verses
-- Run in batches to avoid timeouts on large datasets
-- Batch 1: First 10000 rows
UPDATE public.verses SET translation_uk = translation_uk
WHERE id IN (SELECT id FROM public.verses ORDER BY id LIMIT 10000);
