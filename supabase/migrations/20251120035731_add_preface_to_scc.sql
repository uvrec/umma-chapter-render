-- Add Preface intro chapter to Sri Chaitanya-charitamrita (scc)
DO $$
DECLARE
  v_book_id uuid;
BEGIN
  -- Find the scc book
  SELECT id INTO v_book_id FROM books WHERE slug = 'scc';

  IF v_book_id IS NOT NULL THEN
    -- Insert Preface intro chapter
    INSERT INTO intro_chapters (
      book_id,
      title_uk,
      title_en,
      content_uk,
      content_en,
      slug,
      display_order
    ) VALUES (
      v_book_id,
      'Передмова',
      'Preface',
      '<p>Тут буде текст передмови українською мовою.</p>',
      '<p>Here will be the preface text in English.</p>',
      'preface',
      1
    )
    ON CONFLICT (book_id, slug) DO UPDATE SET
      title_uk = EXCLUDED.title_uk,
      title_en = EXCLUDED.title_en,
      display_order = EXCLUDED.display_order;

    RAISE NOTICE 'Added/updated Preface intro chapter for scc';
  ELSE
    RAISE WARNING 'Book scc not found';
  END IF;
END $$;
