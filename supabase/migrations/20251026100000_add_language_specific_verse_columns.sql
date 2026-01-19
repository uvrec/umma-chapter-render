-- Add language-specific Sanskrit columns to verses table
-- Sanskrit text (Devanagari/Bengali script) is the same for both UA and EN interfaces
-- NOTE: transliteration_uk and transliteration_en already exist and contain DIFFERENT data:
--   - transliteration_uk: Ukrainian Cyrillic transliteration with diacritics
--   - transliteration_en: Latin IAST transliteration with diacritics

BEGIN;

ALTER TABLE public.verses
  ADD COLUMN IF NOT EXISTS sanskrit_uk TEXT,
  ADD COLUMN IF NOT EXISTS sanskrit_en TEXT;

-- Copy existing Sanskrit data from legacy column to new language-specific columns
-- Sanskrit (Devanagari script) is identical for both language contexts
-- Using separate UPDATEs to avoid overwriting existing data in either column

-- Copy to sanskrit_uk only where it's empty
UPDATE public.verses
SET sanskrit_uk = sanskrit
WHERE sanskrit IS NOT NULL
  AND sanskrit != ''
  AND (sanskrit_uk IS NULL OR sanskrit_uk = '');

-- Copy to sanskrit_en only where it's empty
UPDATE public.verses
SET sanskrit_en = sanskrit
WHERE sanskrit IS NOT NULL
  AND sanskrit != ''
  AND (sanskrit_en IS NULL OR sanskrit_en = '');

-- Cross-copy between language columns (Sanskrit is identical for both languages)
-- Copy sanskrit_en to sanskrit_uk where sanskrit_uk is still empty
UPDATE public.verses
SET sanskrit_uk = sanskrit_en
WHERE sanskrit_en IS NOT NULL
  AND sanskrit_en != ''
  AND (sanskrit_uk IS NULL OR sanskrit_uk = '');

-- Copy sanskrit_uk to sanskrit_en where sanskrit_en is still empty
UPDATE public.verses
SET sanskrit_en = sanskrit_uk
WHERE sanskrit_uk IS NOT NULL
  AND sanskrit_uk != ''
  AND (sanskrit_en IS NULL OR sanskrit_en = '');

COMMENT ON COLUMN public.verses.sanskrit_uk IS 'Sanskrit/Bengali text in Devanagari script (Ukrainian interface)';
COMMENT ON COLUMN public.verses.sanskrit_en IS 'Sanskrit/Bengali text in Devanagari script (English interface)';

COMMIT;
