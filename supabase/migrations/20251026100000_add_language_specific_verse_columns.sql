-- Add language-specific columns to verses table
-- These columns store Ukrainian and English versions of Sanskrit/transliteration content
-- The legacy 'sanskrit' and 'transliteration' columns remain for backwards compatibility

ALTER TABLE public.verses
  ADD COLUMN IF NOT EXISTS sanskrit_ua TEXT,
  ADD COLUMN IF NOT EXISTS sanskrit_en TEXT,
  ADD COLUMN IF NOT EXISTS transliteration_ua TEXT,
  ADD COLUMN IF NOT EXISTS transliteration_en TEXT;

-- Copy existing data from legacy columns to new language-specific columns
-- This preserves existing content (same verse text goes to both UA and EN)
UPDATE public.verses
SET
  sanskrit_ua = sanskrit,
  sanskrit_en = sanskrit
WHERE sanskrit IS NOT NULL
  AND sanskrit != ''
  AND (sanskrit_ua IS NULL OR sanskrit_ua = '');

UPDATE public.verses
SET
  transliteration_ua = transliteration,
  transliteration_en = transliteration
WHERE transliteration IS NOT NULL
  AND transliteration != ''
  AND (transliteration_ua IS NULL OR transliteration_ua = '');

COMMENT ON COLUMN public.verses.sanskrit_ua IS 'Sanskrit/Bengali text in Devanagari script (Ukrainian context)';
COMMENT ON COLUMN public.verses.sanskrit_en IS 'Sanskrit/Bengali text in Devanagari script (English context)';
COMMENT ON COLUMN public.verses.transliteration_ua IS 'IAST transliteration (Ukrainian context)';
COMMENT ON COLUMN public.verses.transliteration_en IS 'IAST transliteration (English context)';
