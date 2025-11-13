-- Idempotent merge of NOI chapters 1 and 18
-- This merges English translations from chapter 18 into chapter 1, deletes extra verses, and removes chapter 18

DO $$
DECLARE
  noi_book_id UUID;
  chapter_1_id UUID;
  chapter_18_id UUID;
  merge_done BOOLEAN;
BEGIN
  -- Check if merge already completed
  SELECT (value->>'done')::BOOLEAN INTO merge_done
  FROM site_settings
  WHERE key = 'noi_merge_completed';
  
  IF merge_done = TRUE THEN
    RAISE NOTICE 'NOI merge already completed, skipping...';
    RETURN;
  END IF;

  -- Find NOI book
  SELECT id INTO noi_book_id
  FROM books
  WHERE slug = 'noi';
  
  IF noi_book_id IS NULL THEN
    RAISE EXCEPTION 'NOI book not found';
  END IF;

  -- Find chapters 1 and 18
  SELECT id INTO chapter_1_id
  FROM chapters
  WHERE book_id = noi_book_id AND chapter_number = 1;
  
  SELECT id INTO chapter_18_id
  FROM chapters
  WHERE book_id = noi_book_id AND chapter_number = 18;
  
  IF chapter_1_id IS NULL OR chapter_18_id IS NULL THEN
    RAISE EXCEPTION 'NOI chapters 1 or 18 not found';
  END IF;

  RAISE NOTICE 'Starting NOI merge: book_id=%, chapter_1=%, chapter_18=%', noi_book_id, chapter_1_id, chapter_18_id;

  -- Step 1: Merge English translations from chapter 18 into chapter 1 (verses 1-11)
  UPDATE verses v1
  SET 
    translation_en = COALESCE(v18.translation_en, v1.translation_en),
    commentary_en = COALESCE(v18.commentary_en, v1.commentary_en),
    synonyms_en = COALESCE(v18.synonyms_en, v1.synonyms_en),
    sanskrit_en = COALESCE(v18.sanskrit_en, v1.sanskrit_en),
    transliteration_en = COALESCE(v18.transliteration_en, v1.transliteration_en)
  FROM verses v18
  WHERE v1.chapter_id = chapter_1_id
    AND v18.chapter_id = chapter_18_id
    AND v1.verse_number = v18.verse_number
    AND v1.start_verse BETWEEN 1 AND 11;
  
  RAISE NOTICE 'Merged English translations from chapter 18 to chapter 1';

  -- Step 2: Delete extra verses 12-17 from chapter 1
  DELETE FROM verses
  WHERE chapter_id = chapter_1_id
    AND start_verse BETWEEN 12 AND 17;
  
  RAISE NOTICE 'Deleted verses 12-17 from chapter 1';

  -- Step 3: Delete all verses from chapter 18
  DELETE FROM verses
  WHERE chapter_id = chapter_18_id;
  
  RAISE NOTICE 'Deleted all verses from chapter 18';

  -- Step 4: Delete chapter 18
  DELETE FROM chapters
  WHERE id = chapter_18_id;
  
  RAISE NOTICE 'Deleted chapter 18';

  -- Step 5: Update chapter 1 title
  UPDATE chapters
  SET 
    title_en = 'The Nectar of Instruction',
    title_ua = 'Нектар настанов'
  WHERE id = chapter_1_id;
  
  RAISE NOTICE 'Updated chapter 1 title';

  -- Step 6: Mark merge as completed
  INSERT INTO site_settings (key, value, description)
  VALUES (
    'noi_merge_completed',
    jsonb_build_object('done', true, 'completed_at', NOW()),
    'Flag indicating NOI chapters merge has been completed'
  )
  ON CONFLICT (key) DO UPDATE
  SET value = jsonb_build_object('done', true, 'completed_at', NOW());
  
  RAISE NOTICE 'NOI merge completed successfully!';
END $$;