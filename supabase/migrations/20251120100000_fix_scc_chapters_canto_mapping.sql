-- Fix SCC (Śrī Caitanya-caritāmṛta) chapters to have proper canto_id mapping
-- Problem: Chapters have book_id but no canto_id, so they don't show up when accessing via /veda-reader/scc/canto/X/chapter/Y/Z
-- Root cause: The constraint chapters_book_or_canto_check is incorrect - it should allow BOTH book_id AND canto_id for multi-canto books

DO $$
DECLARE
  v_book_id uuid;
  v_adi_canto_id uuid;
  v_madhya_canto_id uuid;
  v_antya_canto_id uuid;
  v_chapters_updated integer := 0;
BEGIN
  -- Find the SCC book
  SELECT id INTO v_book_id FROM books WHERE slug = 'scc';

  IF v_book_id IS NULL THEN
    RAISE WARNING 'Book scc not found - skipping migration';
    RETURN;
  END IF;

  -- Step 1: Drop the incorrect constraint that prevents having both book_id and canto_id
  ALTER TABLE chapters DROP CONSTRAINT IF EXISTS chapters_book_or_canto_check;
  RAISE NOTICE 'Dropped incorrect constraint chapters_book_or_canto_check';

  -- Step 2: Add correct constraint - at least one of book_id or canto_id must be set
  ALTER TABLE chapters ADD CONSTRAINT chapters_book_or_canto_check
    CHECK (book_id IS NOT NULL OR canto_id IS NOT NULL);
  RAISE NOTICE 'Added correct constraint allowing both book_id and canto_id';

  -- Ensure book has cantos enabled
  UPDATE books SET has_cantos = true WHERE id = v_book_id;

  -- Create or get Adi-lila canto (Canto 1)
  INSERT INTO cantos (book_id, canto_number, title_uk, title_en, description_uk, description_en)
  VALUES (
    v_book_id,
    1,
    'Аді-ліла',
    'Ādi-līlā',
    'Початкові розваги Господа Чайтаньї',
    'The Early Pastimes of Lord Caitanya'
  )
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_uk = EXCLUDED.title_uk,
    title_en = EXCLUDED.title_en
  RETURNING id INTO v_adi_canto_id;

  -- Create or get Madhya-lila canto (Canto 2)
  INSERT INTO cantos (book_id, canto_number, title_uk, title_en, description_uk, description_en)
  VALUES (
    v_book_id,
    2,
    'Мадг\'я-ліла',
    'Madhya-līlā',
    'Середні розваги Господа Чайтаньї',
    'The Middle Pastimes of Lord Caitanya'
  )
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_uk = EXCLUDED.title_uk,
    title_en = EXCLUDED.title_en
  RETURNING id INTO v_madhya_canto_id;

  -- Create or get Antya-lila canto (Canto 3)
  INSERT INTO cantos (book_id, canto_number, title_uk, title_en, description_uk, description_en)
  VALUES (
    v_book_id,
    3,
    'Антья-ліла',
    'Antya-līlā',
    'Завершальні розваги Господа Чайтаньї',
    'The Final Pastimes of Lord Caitanya'
  )
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_uk = EXCLUDED.title_uk,
    title_en = EXCLUDED.title_en
  RETURNING id INTO v_antya_canto_id;

  -- Fix Adi-lila chapters (chapters 1-17)
  -- Note: We keep book_id and add canto_id (both are needed for proper navigation)
  UPDATE chapters
  SET canto_id = v_adi_canto_id
  WHERE book_id = v_book_id
    AND canto_id IS NULL
    AND chapter_number >= 1
    AND chapter_number <= 17;

  GET DIAGNOSTICS v_chapters_updated = ROW_COUNT;
  RAISE NOTICE 'Updated % Adi-lila chapters', v_chapters_updated;

  -- Fix Madhya-lila chapters (chapters 1-25)
  UPDATE chapters
  SET canto_id = v_madhya_canto_id
  WHERE book_id = v_book_id
    AND canto_id IS NULL
    AND chapter_number >= 1
    AND chapter_number <= 25;

  GET DIAGNOSTICS v_chapters_updated = ROW_COUNT;
  RAISE NOTICE 'Updated % Madhya-lila chapters', v_chapters_updated;

  -- Fix Antya-lila chapters (chapters 1-20)
  UPDATE chapters
  SET canto_id = v_antya_canto_id
  WHERE book_id = v_book_id
    AND canto_id IS NULL
    AND chapter_number >= 1
    AND chapter_number <= 20;

  GET DIAGNOSTICS v_chapters_updated = ROW_COUNT;
  RAISE NOTICE 'Updated % Antya-lila chapters', v_chapters_updated;

  -- Report any remaining orphaned chapters
  SELECT COUNT(*) INTO v_chapters_updated
  FROM chapters
  WHERE book_id = v_book_id
    AND canto_id IS NULL;

  IF v_chapters_updated > 0 THEN
    RAISE WARNING 'There are still % orphaned chapters for SCC that could not be mapped', v_chapters_updated;
  END IF;

  RAISE NOTICE 'SCC chapters migration completed successfully';
END $$;
