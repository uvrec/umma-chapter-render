-- Migration: Copy legacy 'sanskrit' field to language-specific fields
-- This copies data from the legacy 'sanskrit' field (which contains Bengali/Sanskrit text)
-- to 'sanskrit_uk' and 'sanskrit_en' fields for verses that don't have language-specific data yet.
-- This is especially important for Sri Chaitanya-charitamrita verses.

-- Copy to sanskrit_uk where it's empty but sanskrit has data
UPDATE verses
SET sanskrit_uk = sanskrit
WHERE sanskrit IS NOT NULL
  AND sanskrit != ''
  AND (sanskrit_uk IS NULL OR sanskrit_uk = '');

-- Copy to sanskrit_en where it's empty but sanskrit has data
UPDATE verses
SET sanskrit_en = sanskrit
WHERE sanskrit IS NOT NULL
  AND sanskrit != ''
  AND (sanskrit_en IS NULL OR sanskrit_en = '');

-- Log the update count
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM verses
  WHERE sanskrit IS NOT NULL AND sanskrit != '';

  RAISE NOTICE 'Sanskrit data copied for % verses', updated_count;
END $$;
