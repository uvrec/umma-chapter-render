-- =============================================================================
-- FIX SCC (Śrī Caitanya-caritāmṛta) chapters canto mapping - Version 2
-- =============================================================================
-- Problem: Search results for SCC show incorrect links like /veda-reader/scc/4/231
--          instead of /veda-reader/scc/canto/X/chapter/Y/Z
-- Root cause: chapters.canto_id is NULL because the original migration failed
--             to properly identify which lila (canto) each chapter belongs to
--
-- Solution: Identify lila by chapter title (contains 'Adi', 'Madhya', 'Antya')
--           or by chapter_number range if no lila info in title
--
-- Structure of SCC:
--   Adi-lila: 17 chapters (1-17)
--   Madhya-lila: 25 chapters (1-25)
--   Antya-lila: 20 chapters (1-20)
-- =============================================================================

DO $$
DECLARE
  v_book_id uuid;
  v_adi_canto_id uuid;
  v_madhya_canto_id uuid;
  v_antya_canto_id uuid;
  v_updated_count integer := 0;
  v_orphan_count integer := 0;
  v_chapter record;
BEGIN
  -- Find the SCC book
  SELECT id INTO v_book_id FROM books WHERE slug = 'scc';

  IF v_book_id IS NULL THEN
    RAISE WARNING 'Book scc not found - skipping migration';
    RETURN;
  END IF;

  RAISE NOTICE 'Found SCC book: %', v_book_id;

  -- Ensure book has cantos enabled
  UPDATE books SET has_cantos = true WHERE id = v_book_id;

  -- ==========================================================================
  -- Step 1: Create or get cantos for SCC
  -- ==========================================================================

  -- Adi-lila (Canto 1)
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
  RAISE NOTICE 'Adi-lila canto ID: %', v_adi_canto_id;

  -- Madhya-lila (Canto 2)
  INSERT INTO cantos (book_id, canto_number, title_uk, title_en, description_uk, description_en)
  VALUES (
    v_book_id,
    2,
    'Мадг''я-ліла',
    'Madhya-līlā',
    'Середні розваги Господа Чайтаньї',
    'The Middle Pastimes of Lord Caitanya'
  )
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_uk = EXCLUDED.title_uk,
    title_en = EXCLUDED.title_en
  RETURNING id INTO v_madhya_canto_id;
  RAISE NOTICE 'Madhya-lila canto ID: %', v_madhya_canto_id;

  -- Antya-lila (Canto 3)
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
  RAISE NOTICE 'Antya-lila canto ID: %', v_antya_canto_id;

  -- ==========================================================================
  -- Step 2: Update chapters based on title content (Ukrainian or English)
  -- ==========================================================================

  -- First pass: Identify lila from title (most reliable method)
  FOR v_chapter IN
    SELECT id, chapter_number, title_uk, title_en, canto_id
    FROM chapters
    WHERE book_id = v_book_id
  LOOP
    DECLARE
      detected_canto_id uuid := NULL;
      title_combined text;
    BEGIN
      -- Combine titles for search (lowercase)
      title_combined := LOWER(COALESCE(v_chapter.title_uk, '') || ' ' || COALESCE(v_chapter.title_en, ''));

      -- Detect lila from title
      -- Adi-lila patterns: adi, ādi, аді (Ukrainian)
      IF title_combined ~ '(^|\s)(adi|ādi|аді)[\s\-]' OR title_combined ~ '(adi|ādi|аді)[_\-]?l[iі]la' THEN
        detected_canto_id := v_adi_canto_id;
        RAISE NOTICE 'Chapter % (%) detected as Adi-lila from title', v_chapter.chapter_number, v_chapter.title_uk;
      -- Madhya-lila patterns: madhya, мадг'я, мадхья (Ukrainian)
      ELSIF title_combined ~ '(^|\s)(madhya|мадг|мадхья)[\s\-''`]' OR title_combined ~ '(madhya|мадг|мадхья)[_\-]?l[iі]la' THEN
        detected_canto_id := v_madhya_canto_id;
        RAISE NOTICE 'Chapter % (%) detected as Madhya-lila from title', v_chapter.chapter_number, v_chapter.title_uk;
      -- Antya-lila patterns: antya, антья, антя (Ukrainian)
      ELSIF title_combined ~ '(^|\s)(antya|антья|антя)[\s\-]' OR title_combined ~ '(antya|антья|антя)[_\-]?l[iі]la' THEN
        detected_canto_id := v_antya_canto_id;
        RAISE NOTICE 'Chapter % (%) detected as Antya-lila from title', v_chapter.chapter_number, v_chapter.title_uk;
      END IF;

      -- Update if detected
      IF detected_canto_id IS NOT NULL AND (v_chapter.canto_id IS NULL OR v_chapter.canto_id != detected_canto_id) THEN
        UPDATE chapters SET canto_id = detected_canto_id WHERE id = v_chapter.id;
        v_updated_count := v_updated_count + 1;
      END IF;
    END;
  END LOOP;

  RAISE NOTICE 'Updated % chapters based on title detection', v_updated_count;

  -- ==========================================================================
  -- Step 3: For remaining orphan chapters, try to deduce lila from chapter_number
  -- ==========================================================================

  -- Check if chapters are numbered sequentially (1-62)
  -- If so: 1-17 = Adi, 18-42 = Madhya, 43-62 = Antya
  DECLARE
    max_chapter_number integer;
  BEGIN
    SELECT MAX(chapter_number) INTO max_chapter_number
    FROM chapters WHERE book_id = v_book_id AND canto_id IS NULL;

    IF max_chapter_number IS NOT NULL THEN
      IF max_chapter_number > 20 THEN
        -- Chapters seem to be numbered sequentially (not per-lila)
        RAISE NOTICE 'Attempting sequential chapter mapping (max chapter_number = %)', max_chapter_number;

        -- Adi-lila: chapters 1-17
        UPDATE chapters SET canto_id = v_adi_canto_id
        WHERE book_id = v_book_id AND canto_id IS NULL
          AND chapter_number >= 1 AND chapter_number <= 17;

        -- Madhya-lila: chapters 18-42
        UPDATE chapters SET canto_id = v_madhya_canto_id
        WHERE book_id = v_book_id AND canto_id IS NULL
          AND chapter_number >= 18 AND chapter_number <= 42;

        -- Antya-lila: chapters 43-62
        UPDATE chapters SET canto_id = v_antya_canto_id
        WHERE book_id = v_book_id AND canto_id IS NULL
          AND chapter_number >= 43 AND chapter_number <= 62;

        RAISE NOTICE 'Applied sequential chapter mapping';
      ELSE
        -- Chapters seem to be numbered per-lila (1-17, 1-25, 1-20)
        -- We cannot safely map these without title info
        RAISE WARNING 'Chapters numbered per-lila but no title info - cannot auto-map';
      END IF;
    END IF;
  END;

  -- ==========================================================================
  -- Step 4: Report results
  -- ==========================================================================

  SELECT COUNT(*) INTO v_orphan_count
  FROM chapters
  WHERE book_id = v_book_id AND canto_id IS NULL;

  IF v_orphan_count > 0 THEN
    RAISE WARNING 'There are still % SCC chapters without canto_id', v_orphan_count;
    -- List orphan chapters for debugging
    FOR v_chapter IN
      SELECT chapter_number, title_uk, title_en
      FROM chapters
      WHERE book_id = v_book_id AND canto_id IS NULL
      ORDER BY chapter_number
      LIMIT 10
    LOOP
      RAISE WARNING '  - Chapter %: % / %', v_chapter.chapter_number, v_chapter.title_uk, v_chapter.title_en;
    END LOOP;
  ELSE
    RAISE NOTICE 'All SCC chapters now have canto_id assigned!';
  END IF;

  -- Final stats
  RAISE NOTICE '=== SCC Canto Mapping Summary ===';
  SELECT COUNT(*) INTO v_updated_count FROM chapters WHERE book_id = v_book_id AND canto_id = v_adi_canto_id;
  RAISE NOTICE 'Adi-lila chapters: %', v_updated_count;
  SELECT COUNT(*) INTO v_updated_count FROM chapters WHERE book_id = v_book_id AND canto_id = v_madhya_canto_id;
  RAISE NOTICE 'Madhya-lila chapters: %', v_updated_count;
  SELECT COUNT(*) INTO v_updated_count FROM chapters WHERE book_id = v_book_id AND canto_id = v_antya_canto_id;
  RAISE NOTICE 'Antya-lila chapters: %', v_updated_count;
  SELECT COUNT(*) INTO v_orphan_count FROM chapters WHERE book_id = v_book_id AND canto_id IS NULL;
  RAISE NOTICE 'Orphan chapters: %', v_orphan_count;

END $$;
