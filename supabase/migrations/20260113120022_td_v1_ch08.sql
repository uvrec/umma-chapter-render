-- ============================================
-- TD Volume 1, Chapter 8: Chapter Eight
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Chapter Eight', '', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = 'verses';

END $$;
