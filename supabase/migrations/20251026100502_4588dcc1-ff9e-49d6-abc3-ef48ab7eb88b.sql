-- Remove artifact prefixes from English verse fields (from Vedabase import)
-- Only updates verses that have these prefixes

UPDATE verses
SET 
  sanskrit_en = CASE 
    WHEN sanskrit_en ~ '^Devanagari\s*\n?' THEN regexp_replace(sanskrit_en, '^Devanagari\s*\n?', '', 'i')
    ELSE sanskrit_en
  END,
  synonyms_en = CASE 
    WHEN synonyms_en ~ '^Synonyms\s*\n?' THEN regexp_replace(synonyms_en, '^Synonyms\s*\n?', '', 'i')
    ELSE synonyms_en
  END,
  translation_en = CASE 
    WHEN translation_en ~ '^Translation\s*\n?' THEN regexp_replace(translation_en, '^Translation\s*\n?', '', 'i')
    ELSE translation_en
  END,
  commentary_en = CASE 
    WHEN commentary_en ~ '^Purport\s*\n?' THEN regexp_replace(commentary_en, '^Purport\s*\n?', '', 'i')
    ELSE commentary_en
  END
WHERE 
  sanskrit_en ~ '^Devanagari\s*\n?' 
  OR synonyms_en ~ '^Synonyms\s*\n?'
  OR translation_en ~ '^Translation\s*\n?'
  OR commentary_en ~ '^Purport\s*\n?';