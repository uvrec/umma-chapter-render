-- Bold Ukrainian book titles in commentary_uk
-- Makes ALL text in guillemets («») bold throughout Ukrainian commentary texts
-- Simple and universal approach - any quoted title becomes bold

BEGIN;

-- ============================================================================
-- MAIN UPDATE: Wrap all text in «» with <strong> tags
-- ============================================================================

-- Update commentary_uk: wrap «text» in <strong>
UPDATE verses
SET commentary_uk = REGEXP_REPLACE(
  commentary_uk,
  '«([^»]+)»',
  '«<strong>\1</strong>»',
  'g'
)
WHERE is_published = true
  AND commentary_uk IS NOT NULL
  AND commentary_uk <> ''
  AND commentary_uk ~ '«[^»]+»'
  AND commentary_uk !~ '«<strong>';  -- Not already processed

COMMIT;
