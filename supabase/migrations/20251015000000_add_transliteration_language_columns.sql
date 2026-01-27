-- Add language-specific transliteration columns to verses table
-- Ukrainian uses Cyrillic transliteration with diacritics
-- English uses Latin IAST transliteration with diacritics
-- This migration must run BEFORE triggers that reference these columns

ALTER TABLE public.verses
  ADD COLUMN IF NOT EXISTS transliteration_uk TEXT,
  ADD COLUMN IF NOT EXISTS transliteration_en TEXT;

COMMENT ON COLUMN public.verses.transliteration_uk IS 'Ukrainian Cyrillic transliteration with diacritics';
COMMENT ON COLUMN public.verses.transliteration_en IS 'Latin IAST transliteration with diacritics';
