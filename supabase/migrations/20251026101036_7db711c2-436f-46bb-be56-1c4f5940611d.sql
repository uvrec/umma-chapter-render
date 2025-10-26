-- Remove artifact prefixes from verses (correct fields this time!)
-- 1. Remove "Devanagari" prefix from sanskrit field
-- 2. Remove <h2>Purport</h2> HTML heading from commentary_en field

UPDATE verses
SET 
  sanskrit = regexp_replace(sanskrit, '^Devanagari\s*', '', 'i'),
  commentary_en = regexp_replace(
    commentary_en, 
    '<h2[^>]*>Purport</h2>\s*', 
    '', 
    'gi'
  )
WHERE 
  sanskrit ~ '^Devanagari\s*'
  OR commentary_en ~ '<h2[^>]*>Purport</h2>';