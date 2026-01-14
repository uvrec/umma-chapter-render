-- Add English books from iskconpress/books repository
-- These are Prabhupada's smaller books available in English
-- Source: https://github.com/iskconpress/books

BEGIN;

-- Ensure unique index exists for book-based chapters (no canto)
CREATE UNIQUE INDEX IF NOT EXISTS ux_chapters_book_chno
  ON public.chapters (book_id, chapter_number)
  WHERE canto_id IS NULL;

-- 1. Beyond Birth and Death (bbd) - 5 chapters
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos, display_category)
VALUES ('bbd', 'Beyond Birth and Death', 'По той бік народження і смерті', true, false, 'small')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ua = EXCLUDED.title_ua,
  display_category = EXCLUDED.display_category;

-- 2. Elevation to Krsna Consciousness (ekc) - 6 chapters
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos, display_category)
VALUES ('ekc', 'Elevation to Krsna Consciousness', 'Підняття до свідомості Крішни', true, false, 'small')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ua = EXCLUDED.title_ua,
  display_category = EXCLUDED.display_category;

-- 4. Life Comes From Life (lcfl) - 16 chapters (morning walk conversations)
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos, display_category)
VALUES ('lcfl', 'Life Comes From Life', 'Життя походить від життя', true, false, 'small')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ua = EXCLUDED.title_ua,
  display_category = EXCLUDED.display_category;

-- 5. Light of the Bhagavata (lob) - 48 texts with paintings
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos, display_category)
VALUES ('lob', 'Light of the Bhagavata', 'Світло Бгаґаватам', true, false, 'small')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ua = EXCLUDED.title_ua,
  display_category = EXCLUDED.display_category;

-- 6. The Matchless Gift (mg) - 8 chapters
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos, display_category)
VALUES ('mg', 'The Matchless Gift', 'Неперевершений дар', true, false, 'small')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ua = EXCLUDED.title_ua,
  display_category = EXCLUDED.display_category;

-- 7. Mukunda-mala-stotra (mm) - prayers by King Kulasekhara
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos, display_category)
VALUES ('mm', 'Mukunda-mala-stotra', 'Мукунда-мала-стотра', true, false, 'small')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ua = EXCLUDED.title_ua,
  display_category = EXCLUDED.display_category;

-- 8. Message of Godhead (mog) - early Prabhupada writing
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos, display_category)
VALUES ('mog', 'Message of Godhead', 'Послання Бога', true, false, 'small')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ua = EXCLUDED.title_ua,
  display_category = EXCLUDED.display_category;

-- 9. Narada-bhakti-sutra (nbs) - 84 sutras on devotion
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos, display_category)
VALUES ('nbs', 'Narada-bhakti-sutra', 'Нарада-бгакті-сутра', true, false, 'small')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ua = EXCLUDED.title_ua,
  display_category = EXCLUDED.display_category;

-- 10. On the Way to Krsna (owk) - 5 chapters
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos, display_category)
VALUES ('owk', 'On the Way to Krsna', 'На шляху до Крішни', true, false, 'small')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ua = EXCLUDED.title_ua,
  display_category = EXCLUDED.display_category;

-- 11. The Path of Perfection (pop) - based on BG chapter 6
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos, display_category)
VALUES ('pop', 'The Path of Perfection', 'Шлях досконалості', true, false, 'small')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ua = EXCLUDED.title_ua,
  display_category = EXCLUDED.display_category;

-- 12. The Science of Self-Realization (ssr) - interviews and essays
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos, display_category)
VALUES ('ssr', 'The Science of Self-Realization', 'Наука самоусвідомлення', true, false, 'small')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ua = EXCLUDED.title_ua,
  display_category = EXCLUDED.display_category;

-- 15. Teachings of Lord Caitanya (tlc) - 32 chapters
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos, display_category)
VALUES ('tlc', 'Teachings of Lord Caitanya', E'Вчення Господа Чайтан''ї', true, false, 'classics')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ua = EXCLUDED.title_ua,
  display_category = EXCLUDED.display_category;

-- 16. Teachings of Queen Kunti (tqk) - 26 chapters
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos, display_category)
VALUES ('tqk', 'Teachings of Queen Kunti', 'Вчення цариці Кунті', true, false, 'small')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ua = EXCLUDED.title_ua,
  display_category = EXCLUDED.display_category;

-- 17. Teachings of Prahlada Maharaja (ttp) - 6 chapters
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos, display_category)
VALUES ('ttp', 'Teachings of Prahlada Maharaja', 'Вчення Прахлади Махараджа', true, false, 'small')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ua = EXCLUDED.title_ua,
  display_category = EXCLUDED.display_category;

COMMIT;
