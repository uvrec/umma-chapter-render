-- Migration: Clean HTML tags (<p>, </p>) from verses table
-- Date: 2024-12-30
-- Description: Remove paragraph HTML tags that were incorrectly imported from source texts
-- These tags appear in edit mode and on the hero banner (daily quote)

-- =========================================
-- STEP 1: BACKUP - Create a backup of affected rows
-- =========================================

-- Create backup table if not exists
CREATE TABLE IF NOT EXISTS verses_html_cleanup_backup (
  id UUID PRIMARY KEY,
  cleaned_at TIMESTAMPTZ DEFAULT NOW(),

  -- Original values before cleanup
  original_synonyms_uk TEXT,
  original_synonyms_en TEXT,
  original_translation_uk TEXT,
  original_translation_en TEXT,
  original_commentary_uk TEXT,
  original_commentary_en TEXT
);

-- Insert backup of affected rows
INSERT INTO verses_html_cleanup_backup (
  id,
  original_synonyms_uk,
  original_synonyms_en,
  original_translation_uk,
  original_translation_en,
  original_commentary_uk,
  original_commentary_en
)
SELECT
  id,
  synonyms_uk,
  synonyms_en,
  translation_uk,
  translation_en,
  commentary_uk,
  commentary_en
FROM verses
WHERE
  synonyms_uk LIKE '%<p>%' OR synonyms_uk LIKE '%</p>%'
  OR synonyms_en LIKE '%<p>%' OR synonyms_en LIKE '%</p>%'
  OR translation_uk LIKE '%<p>%' OR translation_uk LIKE '%</p>%'
  OR translation_en LIKE '%<p>%' OR translation_en LIKE '%</p>%'
  OR commentary_uk LIKE '%<p>%' OR commentary_uk LIKE '%</p>%'
  OR commentary_en LIKE '%<p>%' OR commentary_en LIKE '%</p>%'
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- STEP 2: REPORT - Count affected rows
-- =========================================

DO $$
DECLARE
  affected_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO affected_count
  FROM verses
  WHERE
    synonyms_uk LIKE '%<p>%' OR synonyms_uk LIKE '%</p>%'
    OR synonyms_en LIKE '%<p>%' OR synonyms_en LIKE '%</p>%'
    OR translation_uk LIKE '%<p>%' OR translation_uk LIKE '%</p>%'
    OR translation_en LIKE '%<p>%' OR translation_en LIKE '%</p>%'
    OR commentary_uk LIKE '%<p>%' OR commentary_uk LIKE '%</p>%'
    OR commentary_en LIKE '%<p>%' OR commentary_en LIKE '%</p>%';

  RAISE NOTICE 'Found % verses with <p> tags to clean', affected_count;
END $$;

-- =========================================
-- STEP 3: CLEANUP - Remove <p> and </p> tags
-- =========================================

-- Clean synonyms_uk
UPDATE verses
SET synonyms_uk = TRIM(
  REGEXP_REPLACE(
    REGEXP_REPLACE(synonyms_uk, '<p[^>]*>', '', 'gi'),
    '</p>', ' ', 'gi'
  )
)
WHERE synonyms_uk LIKE '%<p>%' OR synonyms_uk LIKE '%</p>%';

-- Clean synonyms_en
UPDATE verses
SET synonyms_en = TRIM(
  REGEXP_REPLACE(
    REGEXP_REPLACE(synonyms_en, '<p[^>]*>', '', 'gi'),
    '</p>', ' ', 'gi'
  )
)
WHERE synonyms_en LIKE '%<p>%' OR synonyms_en LIKE '%</p>%';

-- Clean translation_uk
UPDATE verses
SET translation_uk = TRIM(
  REGEXP_REPLACE(
    REGEXP_REPLACE(translation_uk, '<p[^>]*>', '', 'gi'),
    '</p>', ' ', 'gi'
  )
)
WHERE translation_uk LIKE '%<p>%' OR translation_uk LIKE '%</p>%';

-- Clean translation_en
UPDATE verses
SET translation_en = TRIM(
  REGEXP_REPLACE(
    REGEXP_REPLACE(translation_en, '<p[^>]*>', '', 'gi'),
    '</p>', ' ', 'gi'
  )
)
WHERE translation_en LIKE '%<p>%' OR translation_en LIKE '%</p>%';

-- Clean commentary_uk
UPDATE verses
SET commentary_uk = TRIM(
  REGEXP_REPLACE(
    REGEXP_REPLACE(commentary_uk, '<p[^>]*>', '', 'gi'),
    '</p>', ' ', 'gi'
  )
)
WHERE commentary_uk LIKE '%<p>%' OR commentary_uk LIKE '%</p>%';

-- Clean commentary_en
UPDATE verses
SET commentary_en = TRIM(
  REGEXP_REPLACE(
    REGEXP_REPLACE(commentary_en, '<p[^>]*>', '', 'gi'),
    '</p>', ' ', 'gi'
  )
)
WHERE commentary_en LIKE '%<p>%' OR commentary_en LIKE '%</p>%';

-- =========================================
-- STEP 4: Also clean blog_posts table
-- =========================================

-- Backup blog_posts
CREATE TABLE IF NOT EXISTS blog_posts_html_cleanup_backup (
  id UUID PRIMARY KEY,
  cleaned_at TIMESTAMPTZ DEFAULT NOW(),
  original_synonyms_uk TEXT,
  original_synonyms_en TEXT,
  original_translation_uk TEXT,
  original_translation_en TEXT
);

INSERT INTO blog_posts_html_cleanup_backup (
  id,
  original_synonyms_uk,
  original_synonyms_en,
  original_translation_uk,
  original_translation_en
)
SELECT
  id,
  synonyms_uk,
  synonyms_en,
  translation_uk,
  translation_en
FROM blog_posts
WHERE
  synonyms_uk LIKE '%<p>%' OR synonyms_uk LIKE '%</p>%'
  OR synonyms_en LIKE '%<p>%' OR synonyms_en LIKE '%</p>%'
  OR translation_uk LIKE '%<p>%' OR translation_uk LIKE '%</p>%'
  OR translation_en LIKE '%<p>%' OR translation_en LIKE '%</p>%'
ON CONFLICT (id) DO NOTHING;

-- Clean blog_posts
UPDATE blog_posts
SET synonyms_uk = TRIM(
  REGEXP_REPLACE(
    REGEXP_REPLACE(synonyms_uk, '<p[^>]*>', '', 'gi'),
    '</p>', ' ', 'gi'
  )
)
WHERE synonyms_uk LIKE '%<p>%' OR synonyms_uk LIKE '%</p>%';

UPDATE blog_posts
SET synonyms_en = TRIM(
  REGEXP_REPLACE(
    REGEXP_REPLACE(synonyms_en, '<p[^>]*>', '', 'gi'),
    '</p>', ' ', 'gi'
  )
)
WHERE synonyms_en LIKE '%<p>%' OR synonyms_en LIKE '%</p>%';

UPDATE blog_posts
SET translation_uk = TRIM(
  REGEXP_REPLACE(
    REGEXP_REPLACE(translation_uk, '<p[^>]*>', '', 'gi'),
    '</p>', ' ', 'gi'
  )
)
WHERE translation_uk LIKE '%<p>%' OR translation_uk LIKE '%</p>%';

UPDATE blog_posts
SET translation_en = TRIM(
  REGEXP_REPLACE(
    REGEXP_REPLACE(translation_en, '<p[^>]*>', '', 'gi'),
    '</p>', ' ', 'gi'
  )
)
WHERE translation_en LIKE '%<p>%' OR translation_en LIKE '%</p>%';

-- =========================================
-- VERIFICATION QUERY (run separately to check results)
-- =========================================
-- SELECT
--   id,
--   verse_number,
--   LEFT(synonyms_uk, 100) as synonyms_preview,
--   LEFT(translation_uk, 100) as translation_preview
-- FROM verses
-- WHERE
--   synonyms_uk LIKE '%<p>%' OR synonyms_uk LIKE '%</p>%'
--   OR translation_uk LIKE '%<p>%' OR translation_uk LIKE '%</p>%'
-- LIMIT 10;
