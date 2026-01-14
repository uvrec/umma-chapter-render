-- Bold Ukrainian book titles in commentary_ua
-- Makes ALL text in guillemets («») bold throughout Ukrainian commentary texts
-- Simple and universal approach - any quoted title becomes bold

BEGIN;

-- ============================================================================
-- MAIN UPDATE: Wrap all text in «» with <strong> tags
-- ============================================================================

-- Update commentary_ua: wrap «text» in <strong>
UPDATE verses
SET commentary_ua = REGEXP_REPLACE(
  commentary_ua,
  '«([^»]+)»',
  '«<strong>\1</strong>»',
  'g'
)
WHERE is_published = true
  AND commentary_ua IS NOT NULL
  AND commentary_ua <> ''
  AND commentary_ua ~ '«[^»]+»'
  AND commentary_ua !~ '«<strong>';  -- Not already processed

COMMIT;
