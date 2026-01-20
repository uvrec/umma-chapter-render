-- Idempotent merge of NOI chapters 1 and 18
-- This merges English translations from chapter 18 into chapter 1, deletes extra verses, and removes chapter 18
-- Idempotency: If chapter 18 doesn't exist, the merge was already completed

DO $$
DECLARE
  noi_book_id UUID;
  chapter_1_id UUID;
  chapter_18_id UUID;
BEGIN
  -- Find NOI book
  SELECT id INTO noi_book_id
  FROM books
  WHERE slug = 'noi';

  IF noi_book_id IS NULL THEN
    RAISE NOTICE 'NOI book not found, skipping merge...';
    RETURN;
  END IF;

  -- Find chapters 1 and 18
  SELECT id INTO chapter_1_id
  FROM chapters
  WHERE book_id = noi_book_id AND chapter_number = 1;

  SELECT id INTO chapter_18_id
  FROM chapters
  WHERE book_id = noi_book_id AND chapter_number = 18;

  -- Idempotency check: if chapter 18 doesn't exist, merge was already done
  IF chapter_18_id IS NULL THEN
    RAISE NOTICE 'NOI chapter 18 not found - merge already completed, skipping...';
    RETURN;
  END IF;

  IF chapter_1_id IS NULL THEN
    RAISE NOTICE 'NOI chapter 1 not found, skipping merge...';
    RETURN;
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
    title_uk = 'Нектар настанов'
  WHERE id = chapter_1_id;

  RAISE NOTICE 'NOI merge completed successfully!';
END $$;
