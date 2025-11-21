-- Переносимо gita chapter -3 в intro_chapters як "preface"
-- Це дозволить використовувати URL /veda-reader/gita/intro/preface

DO $$
DECLARE
  v_book_id UUID;
  v_chapter_id UUID;
  v_title_ua TEXT;
  v_title_en TEXT;
  v_content_ua TEXT;
  v_content_en TEXT;
BEGIN
  -- Знаходимо книгу gita
  SELECT id INTO v_book_id
  FROM books
  WHERE slug = 'gita';

  IF v_book_id IS NULL THEN
    RAISE NOTICE 'Book "gita" not found, skipping migration';
    RETURN;
  END IF;

  -- Знаходимо главу з chapter_number = -3
  SELECT id, title_ua, title_en, content_ua, content_en
  INTO v_chapter_id, v_title_ua, v_title_en, v_content_ua, v_content_en
  FROM chapters
  WHERE book_id = v_book_id
    AND chapter_number = -3;

  IF v_chapter_id IS NULL THEN
    RAISE NOTICE 'Chapter -3 for gita not found, skipping migration';
    RETURN;
  END IF;

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
    COALESCE(v_title_ua, 'Передмова'),
    COALESCE(v_title_en, 'Preface'),
    v_content_ua,
    v_content_en,
    0,  -- перший в списку
    'preface'
  )
  ON CONFLICT (book_id, slug) DO UPDATE SET
    title_ua = EXCLUDED.title_ua,
    title_en = EXCLUDED.title_en,
    content_ua = EXCLUDED.content_ua,
    content_en = EXCLUDED.content_en,
    updated_at = now();

  -- Видаляємо стару главу -3 (опціонально)
  -- Якщо хочете залишити для сумісності, закоментуйте цей рядок
  DELETE FROM chapters WHERE id = v_chapter_id;

  RAISE NOTICE 'Successfully moved gita chapter -3 to intro_chapters as "preface"';
END $$;
