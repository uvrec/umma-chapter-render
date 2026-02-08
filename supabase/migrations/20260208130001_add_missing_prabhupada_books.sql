-- Add major Prabhupada books that may be missing from the books table
-- Uses ON CONFLICT to safely skip books that already exist

BEGIN;

-- Nectar of Devotion (nod) — A summary study of Bhakti-rasamrta-sindhu
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos, display_category, display_order)
VALUES ('nod', 'The Nectar of Devotion', 'Нектар відданості', true, false, 'classics', 10)
ON CONFLICT (slug) DO NOTHING;

-- KRSNA Book (kb) — Summary of 10th Canto of Srimad-Bhagavatam
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos, display_category, display_order)
VALUES ('kb', 'KRSNA, The Supreme Personality of Godhead', 'Крішна, Верховна Особистість Бога', true, false, 'classics', 11)
ON CONFLICT (slug) DO NOTHING;

-- Easy Journey to Other Planets
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos, display_category, display_order)
VALUES ('ejop', 'Easy Journey to Other Planets', 'Подорож до інших планет', true, false, 'small', 30)
ON CONFLICT (slug) DO NOTHING;

-- Raja-vidya: The King of Knowledge
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos, display_category, display_order)
VALUES ('rv', 'Raja-vidya: The King of Knowledge', 'Раджа-відья: Цар знання', true, false, 'small', 31)
ON CONFLICT (slug) DO NOTHING;

-- Perfect Questions, Perfect Answers
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos, display_category, display_order)
VALUES ('pqpa', 'Perfect Questions, Perfect Answers', 'Досконалі запитання, досконалі відповіді', true, false, 'small', 32)
ON CONFLICT (slug) DO NOTHING;

-- Krsna Consciousness: The Topmost Yoga System
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos, display_category, display_order)
VALUES ('tys', 'Krsna Consciousness: The Topmost Yoga System', 'Свідомість Крішни: найвища система йоги', true, false, 'small', 33)
ON CONFLICT (slug) DO NOTHING;

-- Renunciation Through Wisdom
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos, display_category, display_order)
VALUES ('rtw', 'Renunciation Through Wisdom', 'Зречення через мудрість', true, false, 'small', 34)
ON CONFLICT (slug) DO NOTHING;

-- Civilization and Transcendence
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos, display_category, display_order)
VALUES ('ct', 'Civilization and Transcendence', 'Цивілізація та трансцендентність', true, false, 'small', 35)
ON CONFLICT (slug) DO NOTHING;

-- A Second Chance: The Story of a Near-Death Experience
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos, display_category, display_order)
VALUES ('asc', 'A Second Chance', 'Другий шанс', true, false, 'small', 36)
ON CONFLICT (slug) DO NOTHING;

-- The Laws of Nature: An Infallible Justice
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos, display_category, display_order)
VALUES ('lon', 'The Laws of Nature: An Infallible Justice', 'Закони природи: безпомилкове правосуддя', true, false, 'small', 37)
ON CONFLICT (slug) DO NOTHING;

-- Journey of Self-Discovery
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos, display_category, display_order)
VALUES ('jsd', 'The Journey of Self-Discovery', 'Подорож самопізнання', true, false, 'small', 38)
ON CONFLICT (slug) DO NOTHING;

-- Dharma: The Way of Transcendence
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos, display_category, display_order)
VALUES ('dwtot', 'Dharma: The Way of Transcendence', 'Дгарма: шлях трансцендентності', true, false, 'small', 39)
ON CONFLICT (slug) DO NOTHING;

-- Beyond Illusion and Doubt
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos, display_category, display_order)
VALUES ('bid', 'Beyond Illusion and Doubt', 'По той бік ілюзії та сумніву', true, false, 'small', 40)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
