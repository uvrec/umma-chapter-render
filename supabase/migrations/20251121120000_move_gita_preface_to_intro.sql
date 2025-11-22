-- Переносимо всі від'ємні глави gita в intro_chapters
-- Це дозволить використовувати URL /veda-reader/gita/intro/{slug}

DO $$
DECLARE
  v_book_id UUID;
  v_chapter RECORD;
  v_slug TEXT;
  v_order INTEGER;
BEGIN
  -- Знаходимо книгу gita
  SELECT id INTO v_book_id
  FROM books
  WHERE slug = 'gita';

  IF v_book_id IS NULL THEN
    RAISE NOTICE 'Book "gita" not found, skipping migration';
    RETURN;
  END IF;

  -- Обробляємо всі від'ємні глави
  FOR v_chapter IN
    SELECT id, chapter_number, title_ua, title_en, content_ua, content_en
    FROM chapters
    WHERE book_id = v_book_id
      AND chapter_number < 0
    ORDER BY chapter_number DESC  -- -1, -2, -3... -> introduction, preface, ...
  LOOP
    -- Визначаємо slug та порядок на основі chapter_number
    CASE v_chapter.chapter_number
      WHEN -1 THEN
        v_slug := 'introduction';
        v_order := 1;
      WHEN -2 THEN
        v_slug := 'foreword';
        v_order := 2;
      WHEN -3 THEN
        v_slug := 'preface';
        v_order := 3;
      WHEN -4 THEN
        v_slug := 'about-author';
        v_order := 4;
      WHEN -5 THEN
        v_slug := 'acknowledgments';
        v_order := 5;
      ELSE
        v_slug := 'intro-' || ABS(v_chapter.chapter_number)::TEXT;
        v_order := ABS(v_chapter.chapter_number);
    END CASE;

    -- Створюємо intro_chapter з контентом
    INSERT INTO intro_chapters (
      book_id,
      title_ua,
      title_en,
      content_ua,
      content_en,
      display_order,
      slug
    ) VALUES (
      v_book_id,
      COALESCE(v_chapter.title_ua, 'Глава ' || v_chapter.chapter_number),
      COALESCE(v_chapter.title_en, 'Chapter ' || v_chapter.chapter_number),
      v_chapter.content_ua,
      v_chapter.content_en,
      v_order,
      v_slug
    )
    ON CONFLICT (book_id, slug) DO UPDATE SET
      title_ua = EXCLUDED.title_ua,
      title_en = EXCLUDED.title_en,
      content_ua = EXCLUDED.content_ua,
      content_en = EXCLUDED.content_en,
      display_order = EXCLUDED.display_order,
      updated_at = now();

    RAISE NOTICE 'Moved gita chapter % to intro_chapters as "%"', v_chapter.chapter_number, v_slug;

    -- Видаляємо стару главу
    DELETE FROM chapters WHERE id = v_chapter.id;
  END LOOP;

  RAISE NOTICE 'Migration completed for gita intro chapters';
END $$;
