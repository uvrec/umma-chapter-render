-- Add language-specific Sanskrit columns to verses table
-- Sanskrit text (Devanagari/Bengali script) is the same for both UA and EN interfaces
-- NOTE: transliteration_ua and transliteration_en already exist and contain DIFFERENT data:
--   - transliteration_ua: Ukrainian Cyrillic transliteration with diacritics
--   - transliteration_en: Latin IAST transliteration with diacritics

ALTER TABLE public.verses
  ADD COLUMN IF NOT EXISTS sanskrit_ua TEXT,
  ADD COLUMN IF NOT EXISTS sanskrit_en TEXT;

-- Copy existing Sanskrit data from legacy column to new language-specific columns
-- Sanskrit (Devanagari script) is identical for both language contexts
UPDATE public.verses
SET
  sanskrit_ua = sanskrit,
  sanskrit_en = sanskrit
WHERE sanskrit IS NOT NULL
  AND sanskrit != ''
  AND (sanskrit_ua IS NULL OR sanskrit_ua = '');

COMMENT ON COLUMN public.verses.sanskrit_ua IS 'Sanskrit/Bengali text in Devanagari script (Ukrainian interface)';
COMMENT ON COLUMN public.verses.sanskrit_en IS 'Sanskrit/Bengali text in Devanagari script (English interface)';
