-- Fix chapter 5 of Srimad-Bhagavatam Canto 1 - change type from 'text' to 'verses'
-- This chapter has 40 verses but was incorrectly marked as text-only

UPDATE chapters 
SET chapter_type = 'verses',
    content_ua = NULL,
    content_en = NULL
WHERE id = 'c3cc6db2-f480-4b7f-a3cd-ba495b38995f'
  AND chapter_type = 'text';

-- Check for other chapters with similar issues (have verses but marked as text)
DO $$
DECLARE
  chapter_record RECORD;
BEGIN
  FOR chapter_record IN 
    SELECT c.id, c.chapter_number, c.title_ua, COUNT(v.id) as verse_count
    FROM chapters c
    LEFT JOIN verses v ON v.chapter_id = c.id
    WHERE c.chapter_type = 'text'
    GROUP BY c.id, c.chapter_number, c.title_ua
    HAVING COUNT(v.id) > 0
  LOOP
    -- Update chapters that have verses but are marked as text
    UPDATE chapters 
    SET chapter_type = 'verses',
        content_ua = NULL,
        content_en = NULL
    WHERE id = chapter_record.id;
    
    RAISE NOTICE 'Fixed chapter % (%) - had % verses but was marked as text', 
      chapter_record.chapter_number, chapter_record.title_ua, chapter_record.verse_count;
  END LOOP;
END $$;