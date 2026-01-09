-- Add language-specific columns to verses table
-- These columns store Ukrainian and English versions of Sanskrit/transliteration content
-- The legacy 'sanskrit' and 'transliteration' columns remain for backwards compatibility

ALTER TABLE public.verses
  ADD COLUMN IF NOT EXISTS sanskrit_ua TEXT,
  ADD COLUMN IF NOT EXISTS sanskrit_en TEXT,
  ADD COLUMN IF NOT EXISTS transliteration_ua TEXT,
  ADD COLUMN IF NOT EXISTS transliteration_en TEXT;

COMMENT ON COLUMN public.verses.sanskrit_ua IS 'Sanskrit/Bengali text in Devanagari script (Ukrainian context)';
COMMENT ON COLUMN public.verses.sanskrit_en IS 'Sanskrit/Bengali text in Devanagari script (English context)';
COMMENT ON COLUMN public.verses.transliteration_ua IS 'IAST transliteration (Ukrainian context)';
COMMENT ON COLUMN public.verses.transliteration_en IS 'IAST transliteration (English context)';
