-- Import Gitavali by Bhaktivinoda Thakura
-- Proper structure: books -> cantos -> chapters -> verses
-- Fields: sanskrit_en/ua, transliteration_en/ua, synonyms_en/ua, translation_en/ua, commentary_en/ua

BEGIN;

-- 1. Create/update the book
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos)
VALUES ('gitavali', 'Gitavali', 'Ґітавалі', true, true)
ON CONFLICT (slug) DO UPDATE SET
  title_ua = EXCLUDED.title_ua,
  has_cantos = EXCLUDED.has_cantos;

-- Get book ID
DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'gitavali';


  -- Canto 1: Songs of the Early Morning
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 1, E'Songs of the Early Morning', E'Арунодая-кіртана (Ранкові пісні)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 2: Songs for Arati
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 2, E'Songs for Arati', E'Араті-кіртана (Пісні для Араті)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 3: Songs for Honoring Prasadam
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 3, E'Songs for Honoring Prasadam', E'Прасада-севайа (Пісні для прасаду)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 4: Songs for Sankirtana in the Towns
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 4, E'Songs for Sankirtana in the Towns', E'Шрі Наґара-кіртана (Пісні для санкіртани)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 5: The Hundred Names of Sri Caitanya Mahaprabhu
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 5, E'The Hundred Names of Sri Caitanya Mahaprabhu', E'Шріман Махапрабгур Шата Нама (Сто імен Шрі Чайтан''ї)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 6: The Hundred-Twenty Names of Sri Krsna
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 6, E'The Hundred-Twenty Names of Sri Krsna', E'Шрі Крішнаер Вімшоттара Шата Нама (Сто двадцять імен Шрі Крішни)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 7: Songs Glorifying the Holy Name
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 7, E'Songs Glorifying the Holy Name', E'Шрі Нама-кіртана (Пісні про Святе Ім''я)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 8: Ascertaining the Supreme Goal
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 8, E'Ascertaining the Supreme Goal', E'Шрейо Нірная (Визначення найвищої мети)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 9: Songs of Worship
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 9, E'Songs of Worship', E'Бгаджана-ґіта (Пісні поклоніння)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 10: Prayers of Love
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 10, E'Prayers of Love', E'Према-дгвані (Молитви любові)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 11: Eight Prayers to the Holy Name
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 11, E'Eight Prayers to the Holy Name', E'Шрі Намаштака (Вісім молитов до Святого Імені)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 12: Eight Prayers to Srimati Radharani
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 12, E'Eight Prayers to Srimati Radharani', E'Шрі Радгікаштака (Вісім молитов до Шріматі Радгарані)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 13: Appendix
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 13, E'Appendix', E'Парішішта (Додаток)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 14: Eight Instructions
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 14, E'Eight Instructions', E'Шрі Шікшаштака (Вісім настанов)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 15: Concluding Prayers of Love
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 15, E'Concluding Prayers of Love', E'Завершальні Према-дгвані (Завершальні молитви)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Section 1, Song 1: Udilo Aruna
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Udilo Aruna', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'উদিল অরুণ পূরব-ভাগে,
দ্বিজ-মণি গোরা অমনি জাগে,
ভকত-সমূহ লৈয়া সাথে,
গেলা নগর-ব্রাজে', E'উদিল অরুণ পূরব-ভাগে,
দ্বিজ-মণি গোরা অমনি জাগে,
ভকত-সমূহ লৈয়া সাথে,
গেলা নগর-ব্রাজে',
    E'', E'',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'''তাথঈ তাথঈ'' বাজল খোল,
ঘন ঘন তাহে ঝাজের রোল,
প্রেমে ঢল ঢল সোণার অঙ্গ,
চরণে নূপুর বাজে', E'''তাথঈ তাথঈ'' বাজল খোল,
ঘন ঘন তাহে ঝাজের রোল,
প্রেমে ঢল ঢল সোণার অঙ্গ,
চরণে নূপুর বাজে',
    E'', E'',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'মুকুন্দ মাধব যাদব হরি,
বলেন বল রে বদন ভরি'',
মিছে নিদ-বশে গেল রে রাতি,
দিবস শরীর-সাজে', E'মুকুন্দ মাধব যাদব হরি,
বলেন বল রে বদন ভরি'',
মিছে নিদ-বশে গেল রে রাতি,
দিবস শরীর-সাজে',
    E'', E'',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'এমন দুর্লভ মানব-দেহ,
পাইয়া কি কর ভাব না কেহ,
এবে না ভজিলে যশোদা-সুত,
চরমে পড়িবে লাজে', E'এমন দুর্লভ মানব-দেহ,
পাইয়া কি কর ভাব না কেহ,
এবে না ভজিলে যশোদা-সুত,
চরমে পড়িবে লাজে',
    E'', E'',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'উদিত তপন হৈলে অস্ত,
দিন গেল বলি'' হৈবে ব্য়স্ত,
তবে ক্য়ানো এবে অলস হয়,
না ভজ হৃদয়-রাজে', E'উদিত তপন হৈলে অস্ত,
দিন গেল বলি'' হৈবে ব্য়স্ত,
তবে ক্য়ানো এবে অলস হয়,
না ভজ হৃদয়-রাজে',
    E'', E'',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'জীবন অনিত্য় জানহ সার,
তাহে নানা-বিধ বিপদ-ভার,
নামাশ্রয় করি'' জতনে তুমি,
থাকহ আপন কাজে', E'জীবন অনিত্য় জানহ সার,
তাহে নানা-বিধ বিপদ-ভার,
নামাশ্রয় করি'' জতনে তুমি,
থাকহ আপন কাজে',
    E'', E'',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'জীবের কল্য়ান-সাধন-কাম,
জগতে আসি'' এ মধুর নাম,
অবিদ্য়া-তিমির-তপন-রূপে,
হৃদ-গগনে বিরাজে', E'জীবের কল্য়ান-সাধন-কাম,
জগতে আসি'' এ মধুর নাম,
অবিদ্য়া-তিমির-তপন-রূপে,
হৃদ-গগনে বিরাজে',
    E'', E'',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'কৃষ্ণ-নাম-সুধা করিয়া পান,
জুড়াও ভকতিবিনোদ-প্রাণ,
নাম বিনা কিছু নাহিক আর,
চৌদ্দ-ভুবন-মাঝে', E'কৃষ্ণ-নাম-সুধা করিয়া পান,
জুড়াও ভকতিবিনোদ-প্রাণ,
নাম বিনা কিছু নাহিক আর,
চৌদ্দ-ভুবন-মাঝে',
    E'', E'',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 2: Jiv Jago
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Jiv Jago', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'জীব
জাগ, জীব জাগ, গৌরচান্দ
বলে
কত
নিদ্রা যাও মায়া-পিশাচীর
কোলে', E'জীব
জাগ, জীব জাগ, গৌরচান্দ
বলে
কত
নিদ্রা যাও মায়া-পিশাচীর
কোলে',
    E'Song
Name: Jiv Jago Jiv Jago
Official
Name: Arunodaya Kirtana Song 2
Author:
Bhaktivinoda Thakura
Book
Name: Gitavali
Language:
Bengali
অ
ଅ', E'Сонґ
Наме: Джів Джаґо Джів Джаґо
Оffічіал
Наме: Арунодайа Кіртана Сонґ 2
Аутхор:
Бхактівінода Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ
ଅ',
    E'', E'',
    E'Jago Jiv Jago', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'ভজিব
বলিয়া এসে সংসার-ভিতরে
ভুলিয়া
রহিলে তুমি অবিদ্যার
ভরে', E'ভজিব
বলিয়া এসে সংসার-ভিতরে
ভুলিয়া
রহিলে তুমি অবিদ্যার
ভরে',
    E'jīv
jāgo, jīv jāgo, gauracānda bole
kota nidrā jāo māyā-piśācīra kole', E'джı̄в
джа̄ґо, джı̄в джа̄ґо, ґаурача̄нда боле
кота нідра̄ джа̄о ма̄йа̄-піш́а̄чı̄ра коле',
    E'', E'',
    E'Lord Gauranga is calling, "Wake up, sleeping souls! Wake up, sleeping
souls! How long will you sleep in the lap of the witch called Maya?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'তোমারে
লইতে আমি হৈনু
অবতার
আমি
বিনা বন্ধু আর
কে আছে তোমার', E'তোমারে
লইতে আমি হৈনু
অবতার
আমি
বিনা বন্ধু আর
কে আছে তোমার',
    E'bhajibo
boliyā ese saḿsāra-bhitare
bhuliyā rohile tumi avidyāra bhare', E'бгаджібо
болійа̄ есе саḿса̄ра-бгітаре
бгулійа̄ рохіле тумі авідйа̄ра бгаре',
    E'', E'',
    E'You have forgotten the way of devotional service and are lost in the world of
birth and death.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'এনেছি
ঔষধি মায়া নাশিবার
লাগি''
হরি-নাম
মহা-মন্ত্র লও
তুমি মাগি''', E'এনেছি
ঔষধি মায়া নাশিবার
লাগি''
হরি-নাম
মহা-মন্ত্র লও
তুমি মাগি''',
    E'tomāre
loite āmi hoinu avatāra
āmi
binā bandhu āra ke āche tomāra', E'тома̄ре
лоіте а̄мі хоіну авата̄ра
а̄мі
біна̄ бандгу а̄ра ке а̄чхе тома̄ра',
    E'', E'',
    E'I have descended just to save you; other than Myself you have no friend in this
world.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'ভকতিবিনোদ
প্রভু-চরণে পড়িয়া
সেই
হরি-নাম-মন্ত্র
লৈল মাগিয়া', E'ভকতিবিনোদ
প্রভু-চরণে পড়িয়া
সেই
হরি-নাম-মন্ত্র
লৈল মাগিয়া',
    E'enechi
auṣadhi māyā nāśibāro lāgi''
hari-nāma mahā-mantra lao tumi māgi''', E'енечхі
аушадгі ма̄йа̄ на̄ш́іба̄ро ла̄ґі''
харі-на̄ма маха̄-мантра лао тумі ма̄ґі''',
    E'', E'',
    E'I have brought the medicine that will wipe out the disease of illusion from
which you are suffering. Take this maha-mantra-Hare Krsna, Hare Krsna, Krsna
Krsna, Hare Hare/Hare Rama, Hare Rama Rama Rama, Hare Hare."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'', E'',
    E'bhakativinoda
prabhu-caraṇe pariyā
sei hari-nāma-mantra loilo māgiyā
WORD', E'бгакатівінода
прабгу-чаран̣е парійа̄
сеі харі-на̄ма-мантра лоіло ма̄ґійа̄
ВОРД',
    E'', E'',
    E'Srila Bhaktivinoda Thakura says: "I fall at the Lord''s feet, having taken
this mahā-mantra."
Remarks/ Extra Information:
This
song can be sung in either Raga Jhinjhoti in Kaherva Tala or the Bengali
morning raga (Raga Bangala) in Dadra Tala.
PURPORT:
By A.C.
Bhaktivedanta Swami Prabhupada
MUSICAL
NOTATION:
♫
Jiv Jago', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 2, Song 1: Bhale Gaura Gadadharer
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Bhale Gaura Gadadharer', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'ভালে গোরা-গদাধরের আরতি নেহারি
নদীয়া-পূরব-ভাবে যাঁউ বলিহারী', E'ভালে গোরা-গদাধরের আরতি নেহারি
নদীয়া-পূরব-ভাবে যাঁউ বলিহারী',
    E'Song
Name: Bhale Gaura Gadadharer Arati
Official
Name: Sri Surabhi Kunjer Gaura Gadadhara Aratik (Arati-Kirtan Song 1)
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Бхале Ґаура Ґададгарер Араті
Оffічіал
Наме: Срі Сурабгі Кунджер Ґаура Ґададгара Аратік (Араті-Кіртан Сонґ 1)
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) As
I behold the wondrous arati of my Lords Gaura and Gadadhara, I enter into the
mood of Their existence previous to appearing in Nadiya (Their Vrndavana lila
as Sri Sri Radha and Krsna). It is simply indescribable.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'কল্পতরু-তলে রত্ন-সিংহাসনোপরি
সবু সখী-বেষ্টিত কিশোর-কিশোরী', E'কল্পতরু-তলে রত্ন-সিংহাসনোপরি
সবু সখী-বেষ্টিত কিশোর-কিশোরী',
    E'bhāle
gorā-gadādharer ārati nehāri
nadīyā-pūraba-bhāve
jāu balihārī', E'бга̄ле
ґора̄-ґада̄дгарер а̄раті неха̄рі
надı̄йа̄-пӯраба-бга̄ве
джа̄у баліха̄рı̄',
    E'', E'',
    E'Underneath a desire-tree, seated upon a jeweled throne, the ever-youthful
couple named Kisora and Kisori are surrounded by all of Their gopi friends.
3) Sri
Radhika and Lord Govindaji are decorated with many shining jewels and pearls
inlaid with gold artwork, enhancing the sparkling splendor of each and every
limb of Their transcendental forms.
4) The
meeting of Their two bodily forms has generated a luster that brightens all the
worlds, and may be compared to a garland of lightning (Radha) fixed upon a dark
blue raincloud (Krsna).
5) On
the occasion of Their meeting there is a concert produced by the sounding of
conchshells, bells, karatalas and mrdangas. Such kirtana is supremely sweet and
relishable to hear.
6) The
cowherd damsels of Vrndavana led by Visakha Devi sing the glories of the Divine
Couple while the priya-narma-sakhis cool Their Lordships by waving camara fans.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'পুরট-জড়িত কত মণি-গজমতি
ঝমকি'' ঝমকি'' লভে প্রতি-অঙ্গ-জ্যোতিঃ', E'পুরট-জড়িত কত মণি-গজমতি
ঝমকি'' ঝমকি'' লভে প্রতি-অঙ্গ-জ্যোতিঃ',
    E'kalpataru-tale
ratna-siḿhāsanopari
sabu
sakhī-beṣṭita kiśora-kiśorī', E'калпатару-тале
ратна-сіḿха̄санопарі
сабу
сакхı̄-бешт̣іта кіш́ора-кіш́орı̄',
    E'', E'',
    E'Ananga Manjari offers Them sandalwood pulp scented with cuwa while Rupa Manjari
places a garland of jasmine flowers about Their necks.
8) The
beautiful Lalita Sundari holds a lamp of five flames scented with camphor and
waves it aloft, offering arati to the Divine Couple.
9) Parvati, Laksmi, and the personified Vedas cry in great happiness while
rolling on the ground and singing of the fortunate position of the damsels of
Vraja-bhumi.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'নীল নীরদ লাগি'' বিদ্যুত-মালা
দুহুঁ অঙ্গ মিলি'' শোভা ভুবন-উজালা', E'নীল নীরদ লাগি'' বিদ্যুত-মালা
দুহুঁ অঙ্গ মিলি'' শোভা ভুবন-উজালা',
    E'puraṭa-jaḍita
kota maṇi-gajamati
jhamaki''
jhamaki'' labhe prati-ańga-jyotiḥ', E'пурат̣а-джад̣іта
кота ман̣і-ґаджаматі
джхамакі''
джхамакі'' лабге праті-аńґа-джйотіх̣',
    E'', E'',
    E'Bhaktivinoda resides at Surabhi Kunja in the land of Godruma-dwipa, relishing
the joy of divine love at the sight of this beautiful arati.
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'শঙ্খ বাজে, ঘন্টা বাজে, বাজে করতাল
মধুর মৃদঙ্গ বাজে পরম রসাল', E'শঙ্খ বাজে, ঘন্টা বাজে, বাজে করতাল
মধুর মৃদঙ্গ বাজে পরম রসাল',
    E'nīla
nīrada lāgi'' vidyut-mālā
duhuń
ańga mili'' śobhā bhuvana-ujālā', E'нı̄ла
нı̄рада ла̄ґі'' відйут-ма̄ла̄
духуń
аńґа мілі'' ш́обга̄ бгувана-уджа̄ла̄',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'বিশাখাদি সখী-বৃন্দ দুহুঁ গুন গাওয়ে
প্রিয়-নর্ম-সখী-গণ চামর ধুলাওয়ে', E'বিশাখাদি সখী-বৃন্দ দুহুঁ গুন গাওয়ে
প্রিয়-নর্ম-সখী-গণ চামর ধুলাওয়ে',
    E'śańkha
bāje, ghanṭā bāje, bāje karatāla
madhura
mṛdańga bāje parama rasāla', E'ш́аńкха
ба̄дже, ґгант̣а̄ ба̄дже, ба̄дже карата̄ла
мадгура
мр̣даńґа ба̄дже парама раса̄ла',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'অনঙ্গ মঞ্জরী চুয়া-চন্দন দেওয়ে
মালতীর মালা রূপ মঞ্জরী লাগাওয়ে', E'অনঙ্গ মঞ্জরী চুয়া-চন্দন দেওয়ে
মালতীর মালা রূপ মঞ্জরী লাগাওয়ে',
    E'viśākhādi
sakhī-vṛnda duhuń guna gāowe
priya-narma-sakhī-gaṇa
cāmara dhulāowe', E'віш́а̄кха̄ді
сакхı̄-вр̣нда духуń ґуна ґа̄ове
прійа-нарма-сакхı̄-ґан̣а
ча̄мара дгула̄ове',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'পঞ্চ-প্রদীপে ধরি'' কর্পূর-বাতি
ললিতা-সুন্দরী করে যুগল-আরতি', E'পঞ্চ-প্রদীপে ধরি'' কর্পূর-বাতি
ললিতা-সুন্দরী করে যুগল-আরতি',
    E'anańga
mañjarī cuyā-candana deowe
mālatīra
mālā rūpa mañjarī lāgāowe', E'анаńґа
ман̃джарı̄ чуйа̄-чандана деове
ма̄латı̄ра
ма̄ла̄ рӯпа ман̃джарı̄ ла̄ґа̄ове',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'দেবী-লক্ষ্মী-শ্রুতি-গণ ধরণী লোটাওয়ে
গোপী-জন-অধিকার রওয়ত গাওয়ে', E'দেবী-লক্ষ্মী-শ্রুতি-গণ ধরণী লোটাওয়ে
গোপী-জন-অধিকার রওয়ত গাওয়ে',
    E'pañca-pradīpe
dhori'' karpūra-bāti
lalitā-sundarī
kore jugala-ārati', E'пан̃ча-прадı̄пе
дгорі'' карпӯра-ба̄ті
лаліта̄-сундарı̄
коре джуґала-а̄раті',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 10
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10', 10,
    E'ভকতিবিনোদ রহি'' সুরভীকি কুঞ্জে
আরতি-দরশনে প্রেম-সুখ ভুঞ্জে', E'ভকতিবিনোদ রহি'' সুরভীকি কুঞ্জে
আরতি-দরশনে প্রেম-সুখ ভুঞ্জে',
    E'devī-lakṣmī-śruti-gaṇa
dharaṇī loṭāowe
gopī-jana-adhikāra
raowata gāowe', E'девı̄-лакшмı̄-ш́руті-ґан̣а
дгаран̣ı̄ лот̣а̄ове
ґопı̄-джана-адгіка̄ра
раовата ґа̄ове',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 11
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11', 11,
    E'', E'',
    E'bhakativinoda
rohi'' surabhīki kuñje
ārati-daraśane
prema-sukha bhuñje', E'бгакатівінода
рохі'' сурабгı̄кі кун̃дже
а̄раті-дараш́ане
према-сукха бгун̃дже',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 2, Song 2: Jaya Jaya Gora Cander
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Jaya Jaya Gora Cander', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'(কিব) জয় জয় গোরাচাঁদের আরতিক শোভা
জাহ্নবী-তট-বনে জগ-মন-লোভা
জগ-জন-মন-লোভা
(অন্তরা ১)
(গৌরাঙ্গের আরতিক শোভা
জগ-জন-মন-লোভা)', E'(কিব) জয় জয় গোরাচাঁদের আরতিক শোভা
জাহ্নবী-তট-বনে জগ-মন-লোভা
জগ-জন-মন-লোভা
(অন্তরা ১)
(গৌরাঙ্গের আরতিক শোভা
জগ-জন-মন-লোভা)',
    E'⇒ J
Song
Name: Jaya Jaya Goracander Arotik
Official
Name: Arati Kirtana Song 2 (Gaura Arotik)
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ
ଅ', E'⇒ Дж
Сонґ
Наме: Джайа Джайа Ґорачандер Аротік
Оffічіал
Наме: Араті Кіртана Сонґ 2 (Ґаура Аротік)
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ
ଅ',
    E'', E'',
    E'Goracander Arotika Sobha', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'দক্শিণে নিতাইচাঁদ, বামে গদাধর
নিকটে অদ্বৈত, শ্রীনিবাস ছত্র-ধর
(অন্তরা ২)
(গৌরাঙ্গের আরতি করে)
(ব্রহ্মা আদি-দেব গণে গৌরাঙ্গের আরতি করে)
(গৌর কৃপা পাব বলে গৌরাঙ্গের আরতি করে)
(গৌর কৃপ পাব বলে গৌরাঙ্গের আরতি করে)
(নিতাই গৌর হরি বোল)', E'দক্শিণে নিতাইচাঁদ, বামে গদাধর
নিকটে অদ্বৈত, শ্রীনিবাস ছত্র-ধর
(অন্তরা ২)
(গৌরাঙ্গের আরতি করে)
(ব্রহ্মা আদি-দেব গণে গৌরাঙ্গের আরতি করে)
(গৌর কৃপা পাব বলে গৌরাঙ্গের আরতি করে)
(গৌর কৃপ পাব বলে গৌরাঙ্গের আরতি করে)
(নিতাই গৌর হরি বোল)',
    E'(kiba)
jaya jaya gorācāńder āratiko śobhā
jāhnavī-taṭa-vane jaga-mana-lobhā
jaga-jana-mana-lobhā
(Refrain', E'(кіба)
джайа джайа ґора̄ча̄ńдер а̄ратіко ш́обга̄
джа̄хнавı̄-тат̣а-ване джаґа-мана-лобга̄
джаґа-джана-мана-лобга̄
(Реfраін',
    E'', E'',
    E'All glories, all glories to the beautiful arati ceremony of Lord Caitanya. This
Gaura-arati is taking place in a grove on the banks of the Jahnavi (Ganges) and
is attracting the minds of all living entities in the universe.
(Refrain
1): The splendor of Lord Gauranga''s (Caitanya) arati attracts the minds of all
living entities of the universe!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'বসিয়াছে গোরাচাঁদ রত্ন-সিংহাসনে
আরতি করেন ব্রহ্মা-আদি দেব-গণে', E'বসিয়াছে গোরাচাঁদ রত্ন-সিংহাসনে
আরতি করেন ব্রহ্মা-আদি দেব-গণে',
    E'(gaurāńger
ārotik śobhā jaga-janer-mana-lobhā)', E'(ґаура̄ńґер
а̄ротік ш́обга̄ джаґа-джанер-мана-лобга̄)',
    E'', E'',
    E'On Lord Caitanya''s right side is Lord Nityananda and on His left is Sri
Gadadhara. Nearby stands Sri Advaita, and Srivasa Thakura is holding an
umbrella over Lord Caitanya''s head.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'নরহরি-আদি করি'' চামর ধুলায়
সঞ্জয়-মুকুন্দ-বাসু-ঘোষ-আদি গায়', E'নরহরি-আদি করি'' চামর ধুলায়
সঞ্জয়-মুকুন্দ-বাসু-ঘোষ-আদি গায়',
    E'dakhiṇe
nitāicāńd, bāme gadādhara
nikaṭe advaita, śrīnivāsa chatra-dhara', E'дакхін̣е
ніта̄іча̄ńд, ба̄ме ґада̄дгара
нікат̣е адваіта, ш́рı̄ніва̄са чхатра-дгара',
    E'', E'',
    E'Lord Caitanya has sat down on a jeweled throne, and the demigods, headed by
Lord Brahma, perform the arati ceremony', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'শঙ্খ বাজে ঘণ্টা বাজে বাজে করতাল
মধুর মৃদঙ্গ বাজে পরম রসাল
(অন্তরা ৩)
(শন্খ বাজে ঘণ্টা বাজে মধুর মধুর মধুর বাজে)
(গৌরাঙ্গের আরতি কালে, মধুর মধুর মধুর বাজে)
(গৌরাঙ্গের আরতি কালে, মধুর মধুর মধুর বাজে)
(মধুর মৃদঙ্গ বাজে মধুর মধুর মধুর বাজে)', E'শঙ্খ বাজে ঘণ্টা বাজে বাজে করতাল
মধুর মৃদঙ্গ বাজে পরম রসাল
(অন্তরা ৩)
(শন্খ বাজে ঘণ্টা বাজে মধুর মধুর মধুর বাজে)
(গৌরাঙ্গের আরতি কালে, মধুর মধুর মধুর বাজে)
(গৌরাঙ্গের আরতি কালে, মধুর মধুর মধুর বাজে)
(মধুর মৃদঙ্গ বাজে মধুর মধুর মধুর বাজে)',
    E'bosiyāche
gorācāńd ratna-siḿhāsane
ārati koren brahmā-ādi deva-gaṇe', E'босійа̄чхе
ґора̄ча̄ńд ратна-сіḿха̄сане
а̄раті корен брахма̄-а̄ді дева-ґан̣е',
    E'', E'',
    E'Narahari Sarakara and other associates of Lord Caitanya fan Him with camaras,
and devotees headed by Sanjaya Pandita, Mukunda Datta, and Vasu Ghosa sing
sweet kirtana.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'বহু-কোটি চন্দ্র জিনি'' বদন উজ্জ্বল
গল-দেশে বন-মালা করে ঝলমল', E'বহু-কোটি চন্দ্র জিনি'' বদন উজ্জ্বল
গল-দেশে বন-মালা করে ঝলমল',
    E'narahari-ādi
kori'' cāmara dhulāya
sañjaya-mukunda-bāsu-ghoṣ-ādi gāya', E'нарахарі-а̄ді
корі'' ча̄мара дгула̄йа
сан̃джайа-мукунда-ба̄су-ґгош-а̄ді ґа̄йа',
    E'', E'',
    E'Conchshells, bells, and karatalas resound, and the mrdangas play very sweetly.
This kirtana music is supremely sweet and relish able to hear.
(Refrain
2): Conchsells resound! bell resound! Sweetness, sweetness, and sweetness
resounds!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'শিব-শুক-নারদ প্রেমে গদ-গদ
ভকতিবিনোদ দেখে গৌরার সম্পদ
(অন্তরা ৪)
(ভজ গৌর প্রেমে গদ গদরে শিব-শুক-নারদ প্রেমে গদ-গদ)
(ভজ গৌর প্রেমে গদ গদরে শিব-শুক-নারদ প্রেমে গদ-গদ)
(ঠাকুর) ভকতিবিনোদ দেখে গৌরার সম্পদ
(অন্তরা ৫)
(এই বার আমায় দয়া কর)
(ঠাকুর শ্রী ভক্তিবিনোদ এই বার আমায় দয়া কর)
(ঠাকুর শ্রী সরস্বতী এই বার আমায় দয়া কর)
(পতিত-পাবন শ্রী গুরুদেব এই বার আমায় দয়া কর)
(সপার্শ্শদ গৌর হরি এই বার আমায় দয়া কর)
(নিতাই গৌর হরি বোল)', E'শিব-শুক-নারদ প্রেমে গদ-গদ
ভকতিবিনোদ দেখে গৌরার সম্পদ
(অন্তরা ৪)
(ভজ গৌর প্রেমে গদ গদরে শিব-শুক-নারদ প্রেমে গদ-গদ)
(ভজ গৌর প্রেমে গদ গদরে শিব-শুক-নারদ প্রেমে গদ-গদ)
(ঠাকুর) ভকতিবিনোদ দেখে গৌরার সম্পদ
(অন্তরা ৫)
(এই বার আমায় দয়া কর)
(ঠাকুর শ্রী ভক্তিবিনোদ এই বার আমায় দয়া কর)
(ঠাকুর শ্রী সরস্বতী এই বার আমায় দয়া কর)
(পতিত-পাবন শ্রী গুরুদেব এই বার আমায় দয়া কর)
(সপার্শ্শদ গৌর হরি এই বার আমায় দয়া কর)
(নিতাই গৌর হরি বোল)',
    E'śańkha
bāje ghaṇṭā bāje bāje karatāla
madhura mṛdańga bāje parama rasāla
(Refrain', E'ш́аńкха
ба̄дже ґган̣т̣а̄ ба̄дже ба̄дже карата̄ла
мадгура мр̣даńґа ба̄дже парама раса̄ла
(Реfраін',
    E'', E'',
    E'The brilliance of Lord Caitanya''s face conquers millions upon millions of
moons, and the garland of forest flowers around His neck shines.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'', E'',
    E'(śankha
bāje ghaṇṭā bāje madhur madhur madhur bāje)', E'(ш́анкха
ба̄дже ґган̣т̣а̄ ба̄дже мадгур мадгур мадгур ба̄дже)',
    E'', E'',
    E'Lord Siva, Sukadeva Gosvami, and Narada Muni are all there, and their voices
are choked with the ecstasy of transcendental love. Thus Thakura Bhaktivinoda
envisions the glory of Lord Sri Caitanya.
Remarks/ Extra Information:
There
are other alankaras that are sung in the Gaura Arati, albeit less frequently.
They are
(Between
Verses 2 and 3)
(gaurāńger
āroti kore)
(brahmā
ādi-deva gaṇe gaurāńger āroti kore)
(gaur
kṛpa pābo bole gaurāńger āroti kore)
(gaur
kṛpa pābo bole gaurāńger āroti kore)
(nitāi
gaura hari bol)
The
arati of Lord Gauranga is performed by Lord Brahma and the demigods. I will
attain the mercy of Lord Caitanya by doing the arati of Lord Caitanya.
(Sung
with Refrain 2)
(gourāńger
āroti kāle madhur madhur madhur bāje)
(gourāńger
āroti kāle madhur madhur madhur bāje)
(madhura
mṛdańga bāje madhur madhur madhur bāje)
Sweetness,
sweetness, and sweetness resounds during the time of Gauranga''s arati!
Sweetness, sweetness, and sweetness resounds as the sweet mridanga resounds!
(Between
Verses 6 and 7):
(mālā)
(jhalmol jhalmol jhalmol kore)
(gour
gole bono phuler mālā jhalmol jhalmol jhalmol kore)
(gour
gole bono phuler mālā jhalmol jhalmol jhalmol kore)
(nitāi
goura hari bol)
The
garland, shines, shines, and shines! The garland of forest-flowers around Lord
Caitanya''s neck shines, shines, and shines!
(At
the end of the arati)
(bhaja
gour preme gada gadare śiva-śuka-nārada preme gada-gada)
(bhaja
gour preme gada gadare śiva-śuka-nārada preme gada-gada)
(ṭhākur)
bhakativinoda dekhe gorāra sampada
Worship
Lord Caitanya, with throats choked in love! Lord Siva''s, Sukadeva Goswami''s,
and Narada Muni''s throats are choked with love! Bhaktivinoda Thakura sees Lord
Caitanya''s glories!
(ei
bār āmāy doya koro)
(ṭhākura
śrī bhaktivinod ei bar āmāy doyā koro)
(ṭhākura
śrī sarasvatī ei bar āmāy doyā koro)
(patit-pāvan
śrī gurudev ei bar āmāy doyā koro)
(sapārṣada
gaur hari ei bar āmāy doyā koro)
(nitāi
goura hari bol)
Please
be merciful upon me, this time. Srila Bhaktivinoda Thakura, please be merciful
upon me. Srila Bhaktisiddhanta Sarasvati Thakura, please be merciful upon me.
Oh redeemer of fallen souls, Oh spiritual master, please be merciful upon me.
Oh associates of Sri Gauranga, please be merciful upon me! Speak the names of
Nitai Gaurahari!
PURPORT:
By
A.C. Bhaktivedanta Swami Prabhupada
MUSICAL
NOTATION:
♫
Jaya Jaya
Goracander Arotika Sobha (Major Key)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'', E'',
    E'bahu-koṭi
candra jini'' vadana ujjvala
gala-deśe bana-mālā kore jhalamala', E'баху-кот̣і
чандра джіні'' вадана уджджвала
ґала-деш́е бана-ма̄ла̄ коре джхаламала',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 10
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10', 10,
    E'', E'',
    E'śiva-śuka-nārada
preme gada-gada
bhakativinoda dekhe gorāra sampada
WORD', E'ш́іва-ш́ука-на̄рада
преме ґада-ґада
бгакатівінода декхе ґора̄ра сампада
ВОРД',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 2, Song 3: Jaya Jaya Radha Krsna
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Jaya Jaya Radha Krsna', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'জয় জয় রাধা-কৃষ্ণ যুগল-মিলন
আরতি করোয়ে ললিতাদি সখী-গণ', E'জয় জয় রাধা-কৃষ্ণ যুগল-মিলন
আরতি করোয়ে ললিতাদি সখী-গণ',
    E'⇒ J
Song
Name: Jaya Jaya Radha Krsna (I)
Official
Name: Arati Kirtana Song 3 (Sri Yugala Arotik)
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'⇒ Дж
Сонґ
Наме: Джайа Джайа Радга Крсна (І)
Оffічіал
Наме: Араті Кіртана Сонґ 3 (Срі Йуґала Аротік)
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) All
glories, all glories to the meeting of the transcendental pair, Sri Sri Radha
and Krsna! The gopis, headed by Lalita, perform the arati ceremony for Their
pleasure.
2) The
three-fold bending form of Krsna, the attractor of Cupid, dressed in yellow
silk dhoti and wearing a crown decorated with peacock feathers, is simply
captivating to the mind.
3) Sitting
to the left of the charming Lord Madhava is the daughter of King Vrsabhanu,
dressed in a lovely deep blue sari. Her complexion is the color of molten gold,
and all characteristics of Her beauty and qualities are highly praiseworthy.
4) She
is decorated with various shimmering, sparkling ornaments. Her face is so
splendorous that it enchants the mind of Lord Hari.
5) The
gopis of Visakha''s group sing many enchanting songs in various tunes, while the
topmost class of gopis, known as the priya-narma-sakhis, soothes Radha and
Krsna by waving camara fans.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'মদন-মোহন রূপ ত্রি-ভঙ্গ-সুন্দর
পীতম্বর শিখি-পুচ্ছ-চূডা-মনোহর', E'মদন-মোহন রূপ ত্রি-ভঙ্গ-সুন্দর
পীতম্বর শিখি-পুচ্ছ-চূডা-মনোহর',
    E'jaya
jaya rādhā-kṛṣṇa yugala-milana
ārati
karowe lalitādi sakhī-gaṇa', E'джайа
джайа ра̄дга̄-кр̣шн̣а йуґала-мілана
а̄раті
карове лаліта̄ді сакхı̄-ґан̣а',
    E'', E'',
    E'Hoping to attain the lotus feet of Radhika and Madhava, Bhaktivinoda happily
swims in the ocean of bliss found at the feet of the damsels of Vraja Dham.
Remarks/ Extra Information:
This
song is usually rendered in Raga Durga in Kaherva Tala.
MUSICAL
NOTATIONS:
♫ Jaya Jaya Radha
Krsna Yugala Milana (I)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'ললিত-মাধব-বামে বৃষভানু-কন্যা
সুনীল-বসনা গৌরী রূপে গুনে ধন্যা', E'ললিত-মাধব-বামে বৃষভানু-কন্যা
সুনীল-বসনা গৌরী রূপে গুনে ধন্যা',
    E'madana-mohana
rūpa tri-bhańga-sundara
pītambara
śikhi-puccha-cūḍā-manohara', E'мадана-мохана
рӯпа трі-бгаńґа-сундара
пı̄тамбара
ш́ікхі-пуччха-чӯд̣а̄-манохара',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'নানা-বিধ অলঙ্কার কোরে ঝলমল
হরি-মনো-বিমোহন বদন উজ্জ্বল', E'নানা-বিধ অলঙ্কার কোরে ঝলমল
হরি-মনো-বিমোহন বদন উজ্জ্বল',
    E'lalita-mādhava-vāme
bṛṣabhānu-kanyā
sunīla-vasanā
gaurī rūpe gune dhanyā', E'лаліта-ма̄дгава-ва̄ме
бр̣шабга̄ну-канйа̄
сунı̄ла-васана̄
ґаурı̄ рӯпе ґуне дганйа̄',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'বিশাখাদি সখী-গণ নানা রাগে গায়
প্রিয়-নর্ম-সখী যত চামর ঢুলায়', E'বিশাখাদি সখী-গণ নানা রাগে গায়
প্রিয়-নর্ম-সখী যত চামর ঢুলায়',
    E'nānā-vidha
alańkāra kore jhalamala
hari-mano-vimohana
vadana ujjvala', E'на̄на̄-відга
алаńка̄ра коре джхаламала
харі-мано-вімохана
вадана уджджвала',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'শ্রী-রাধা-মাধব-পদ-সরসিজ-আশে
ভকতিবিনোদ সখী-পদে সুখে ভাসে', E'শ্রী-রাধা-মাধব-পদ-সরসিজ-আশে
ভকতিবিনোদ সখী-পদে সুখে ভাসে',
    E'viśākhādi
sakhī-gaṇa nānā rāge gāya
priya-narma-sakhī
jata cāmara ḍhulāya', E'віш́а̄кха̄ді
сакхı̄-ґан̣а на̄на̄ ра̄ґе ґа̄йа
прійа-нарма-сакхı̄
джата ча̄мара д̣хула̄йа',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'', E'',
    E'śrī-rādhā-mādhava-pada-sarasija-āśe
bhakativinoda
sakhī-pade sukhe bhāse', E'ш́рı̄-ра̄дга̄-ма̄дгава-пада-сарасіджа-а̄ш́е
бгакатівінода
сакхı̄-паде сукхе бга̄се',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 2, Song 4: Bhaja Bhakata
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Bhaja Bhakata', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'', E'',
    E'⇒ B
Song
Name: Bhaja Bhakata Vatsala
Official
Name: Sri Surabhi Kunjer Bhoga Arotik (Arati Kirtan Song 4)
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ
ଅ', E'⇒ Б
Сонґ
Наме: Бхаджа Бхаката Ватсала
Оffічіал
Наме: Срі Сурабгі Кунджер Бхоґа Аротік (Араті Кіртан Сонґ 4)
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ
ଅ',
    E'', E'',
    E'Vatsala Sri Gaurahari', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'', E'',
    E'bhaja bhakata-vatsala
śrī-gaurahari
śrī-gaurahari sohi goṣṭha-bihārī
nanda-jaśomatī-citta-hari
(bhaja
govinda govinda gopāla)', E'бгаджа бгаката-ватсала
ш́рı̄-ґаурахарі
ш́рı̄-ґаурахарі сохі ґошт̣ха-біха̄рı̄
нанда-джаш́оматı̄-чітта-харі
(бгаджа
ґовінда ґовінда ґопа̄ла)',
    E'', E'',
    E'Just worship Sri Gaurahari, who is always affectionate toward His devotees. He
is the same Supreme Godhead, Krsna, who sported in the cowherd pastures of
Vraja and stole the hearts of Nanda and Yasoda. Just worship Govinda, Govinda,
Gopala!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'', E'',
    E'belā
ho''lo dāmodara āisa ekhano
bhoga-mandire bosi'' koraho bhojana', E'бела̄
хо''ло да̄модара а̄іса екхано
бгоґа-мандіре босі'' корахо бгоджана',
    E'', E'',
    E'Mother Yasoda calls to Krsna, "My dear Damodara, it is very late. Please
come right now, sit down in the dining hall, and take Your lunch."
3) On
the direction of Nanda Maharaja, Krsna, the holder of Govardhana Hill, sits
down, and then all the cowherd boys, along with Krsna''s elder brother, Sri
Baladeva, sit down in rows to take their lunch.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'', E'',
    E'nandera
nideśe baise giri-bara-dhārī
baladeva-saha sakhā baise sāri sāri', E'нандера
нідеш́е баісе ґірі-бара-дга̄рı̄
баладева-саха сакха̄ баісе са̄рі са̄рі',
    E'', E'',
    E'They are then served a feast of sukta and various kinds of green leafy
vegetables, then nice fried things, and a salad made of the green leaves of the
jute plant. They are also served pumpkin, baskets of fruit, small square cakes
made of lentils and cooked down milk, then thick yogurt, squash cooked in milk,
and vegetable preparations made from the tower of the banana tree.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'', E'',
    E'śuktā-śākādi
bhāji nālitā kuṣmāṇḍa
dāli dālnā dugdha-tumbī dadhi mocā-khaṇḍa', E'ш́укта̄-ш́а̄ка̄ді
бга̄джі на̄літа̄ кушма̄н̣д̣а
да̄лі да̄лна̄ дуґдга-тумбı̄ дадгі моча̄-кхан̣д̣а',
    E'', E'',
    E'Then they receive fried squares of mung dahl patties, and urad dahl patties,
capatis, and rice with ghee. Next, sweets made with milk, sugar and sesamum,
rice flour cakes; thick cooked-down milk; cakes floating in milk; and sweet
rice.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'', E'',
    E'mudga-borā
māṣa-borā roṭikā ghṛtānna
śaṣkulī piṣṭaka khīr puli pāyasānna', E'мудґа-бора̄
ма̄ша-бора̄ рот̣іка̄ ґгр̣та̄нна
ш́ашкулı̄ пішт̣ака кхı̄р пулі па̄йаса̄нна',
    E'', E'',
    E'There is also sweet rice that tastes just like nectar due to its being mixed
with camphor. There are bananas, and cheese which is nectarean and delicious.
They are also served twelve kinds of sour preparations made with tamarinds,
limes, lemons, oranges, and pomegranates.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'', E'',
    E'karpūra
amṛta-keli rambhā khīra-sāra
amṛta rasālā, amla dwādaśa prakāra', E'карпӯра
амр̣та-келі рамбга̄ кхı̄ра-са̄ра
амр̣та раса̄ла̄, амла два̄даш́а прака̄ра',
    E'', E'',
    E'There are puns made with white flour and sugar; puns filled with cream; laddus;
and dahl patties boiled in sugared rice. Krsna eagerly eats all of the food.
8) In
great ecstasy and joy Krsna eats the rice, curried vegetables, sweets, and
pastries cooked by Srimati Radharani.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'', E'',
    E'luci
cini sarpurī lāḍḍu rasābalī
bhojana korena kṛṣṇa ho''ye kutūhalī', E'лучі
чіні сарпурı̄ ла̄д̣д̣у раса̄балı̄
бгоджана корена кр̣шн̣а хо''йе кутӯхалı̄',
    E'', E'',
    E'Krsna''s funny brahmana friend Madhumangala, who is very fond of Laddus, gets
them by hook or by crook. Eating the laddus he shouts, "Haribol!
Haribol!~'' and makes a funny sound by swapping his sides under his armpits with
his hands.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'', E'',
    E'rādhikāra
pakka anna vividha byañjana
parama ānande kṛṣṇa korena bhojana', E'ра̄дгіка̄ра
пакка анна вівідга бйан̃джана
парама а̄нанде кр̣шн̣а корена бгоджана',
    E'', E'',
    E'Beholding Radharani and Her gopifriends out of the courters of His eyes, Krsna
eats at the house of mother Yasoda with great satisfaction.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 10
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10', 10,
    E'', E'',
    E'chale-bale
lāḍḍu khāy śrī-madhumaṅgala
bagala bājāy āra deya hari-bolo', E'чхале-бале
ла̄д̣д̣у кха̄й ш́рı̄-мадгуман̇ґала
баґала ба̄джа̄й а̄ра дейа харі-боло',
    E'', E'',
    E'After lunch, Krsna drinks rose-scented water. Then all of the boys, standing in
lines, wash their mouths.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 11
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11', 11,
    E'', E'',
    E'rādhikādi
gaṇe heri'' nayanera koṇe
tṛpta ho''ye khāy kṛṣṇa jaśodā-bhavane', E'ра̄дгіка̄ді
ґан̣е хері'' найанера кон̣е
тр̣пта хо''йе кха̄й кр̣шн̣а джаш́ода̄-бгаване',
    E'', E'',
    E'After all the cowherd boys wash their hands and mouths; in great bliss they
take rest with Lord Balarama.
13) The
two cowherd boys Jambula and Rasala then bring Krsna pan made with betel nuts,
fancy spices, and catechu. After eating that pin, Sri Krsnacandra then happily
goes to sleep.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 12
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '12', 12,
    E'', E'',
    E'bhojanānte
piye kṛṣṇa subāsita bāri
sabe mukha prakhāloy ho''ye sāri sāri', E'бгоджана̄нте
пійе кр̣шн̣а суба̄сіта ба̄рі
сабе мукха пракха̄лой хо''йе са̄рі са̄рі',
    E'', E'',
    E'While Krsna happily takes His rest on an excellent bedstead, His servant
Visalaksa cools Him with a fan of peacock feathers.
15) At
mother Yasoda''s request the gopi, Dhanistha, brings remnants of food left on
Krsna''s plate to Srimati Radharani, who eats them with great delight', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 13
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '13', 13,
    E'', E'',
    E'hasta-mukha
prakhāliyā jata sakhā-gaṇe
ānande biśrāma kore baladeva-sane', E'хаста-мукха
пракха̄лійа̄ джата сакха̄-ґан̣е
а̄нанде біш́ра̄ма коре баладева-сане',
    E'', E'',
    E'Lalita-devi and the other gopis then receive the remnants, and within their
hearts they sing the glories of Radharani and Krsna with great joy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 14
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '14', 14,
    E'', E'',
    E'jambula
rasāla āne tāmbūla-masālā
tāhā kheye kṛṣṇa-candra sukhe nidrā gelā', E'джамбула
раса̄ла а̄не та̄мбӯла-маса̄ла̄
та̄ха̄ кхейе кр̣шн̣а-чандра сукхе нідра̄ ґела̄',
    E'', E'',
    E'Thakura Bhaktivinoda, whose one and only Joy is the pastimes of Lord Hari,
sings this Bhoga-arati song
Remarks/ Extra Information:
This
is the Bhoga Arotik which was greatly popularized by the 1970 album The Radha
Krsna Temple produced by the late George Harrison.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 15
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '15', 15,
    E'', E'',
    E'biśālākha
śikhi-puccha-cāmara ḍhulāya
apūrba śayyāya kṛṣṇa sukhe nidrā
jāya.', E'біш́а̄ла̄кха
ш́ікхі-пуччха-ча̄мара д̣хула̄йа
апӯрба ш́аййа̄йа кр̣шн̣а сукхе нідра̄
джа̄йа.',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 16
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '16', 16,
    E'', E'',
    E'jaśomatī-ājñā
pe''ye dhaniṣṭhā-ānīto
śrī-kṛṣṇa-prasāda rādhā bhuñje ho''ye
prīto', E'джаш́оматı̄-а̄джн̃а̄
пе''йе дганішт̣ха̄-а̄нı̄то
ш́рı̄-кр̣шн̣а-праса̄да ра̄дга̄ бгун̃дже хо''йе
прı̄то',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 17
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '17', 17,
    E'', E'',
    E'lalitādi
sakhī-gaṇa avaśeṣa pāya
mane mane sukhe rādhā-kṛṣṇa-guṇa gāya', E'лаліта̄ді
сакхı̄-ґан̣а аваш́еша па̄йа
мане мане сукхе ра̄дга̄-кр̣шн̣а-ґун̣а ґа̄йа',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 18
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '18', 18,
    E'', E'',
    E'hari-līlā
ek-mātra jāhāra pramoda
bhogārati gāy ṭhākur bhakativinoda
WORD', E'харі-лı̄ла̄
ек-ма̄тра джа̄ха̄ра прамода
бгоґа̄раті ґа̄й т̣ха̄кур бгакатівінода
ВОРД',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 1: Sarira Avidya Jal
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Sarira Avidya Jal', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'', E'',
    E'Song
Name: Sarira Avidya Jala
Official
Name: Prasada Sevaya Song 1
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Саріра Авідйа Джала
Оffічіал
Наме: Прасада Севайа Сонґ 1
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'O brothers! This material body is a network of ignorance, and the senses are
one''s deadly enemies, for they throw the soul into the ocean of material sense
enjoyment. Among the senses, the tongue is the most voracious and verily
wicked; it is very difficult to conquer the tongue in this world.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'', E'',
    E'bhāi-re!
śarīra abidyā-jāl, joḍendriya tāhe kāl,
jīve phele viṣaya-sāgore
tā''ra madhye jihwā ati, lobhamoy sudurmati,
tā''ke jetā kaṭhina saḿsāre', E'бга̄і-ре!
ш́арı̄ра абідйа̄-джа̄л, джод̣ендрійа та̄хе ка̄л,
джı̄ве пхеле вішайа-са̄ґоре
та̄''ра мадгйе джіхва̄ аті, лобгамой судурматі,
та̄''ке джета̄ кат̣хіна саḿса̄ре',
    E'', E'',
    E'O brothers, Lord Krsna is very merciful. Just to control the tongue, He has
given us the remnants of His own food! Now, please eat these nectarean grains
while singing the glories of Their Lordships Sri Sri Radha and Krsna, and in
love call out "Caitanya! Nitai!"
Remarks/ Extra Information:
ISKCON
devotees sing this set of prayers before eating prasadam, in conjunction of the
verse (Maha
Prasade Govinde).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'', E'',
    E'kṛṣṇa
boro doyāmoy, koribāre jihwā jay,
swa-prasād-anna dilo bhāi
sei annāmṛta pāo,
rādhā-kṛṣṇa-guṇa gāo,
preme ḍāko caitanya-nitāi', E'кр̣шн̣а
боро дойа̄мой, коріба̄ре джіхва̄ джай,
сва-праса̄д-анна діло бга̄і
сеі анна̄мр̣та па̄о,
ра̄дга̄-кр̣шн̣а-ґун̣а ґа̄о,
преме д̣а̄ко чаітанйа-ніта̄і',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 2: Ek Din Santi Pure
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Ek Din Santi Pure', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'ভাই-রে!
এক-দিন শান্তিপুরে, প্রভু অদ্বৈতের ঘরে,
দুই প্রভু ভোজনে বসিল
শাক করি'' আস্বাদন, প্রভু বলে ভক্ত-গণ,
এই শাক কৃষ্ণ আস্বাদিল', E'ভাই-রে!
এক-দিন শান্তিপুরে, প্রভু অদ্বৈতের ঘরে,
দুই প্রভু ভোজনে বসিল
শাক করি'' আস্বাদন, প্রভু বলে ভক্ত-গণ,
এই শাক কৃষ্ণ আস্বাদিল',
    E'Song
Name: Ek Din Santipure
Official
Name: Prasad-Sevaya Song 2
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Ек Дін Сантіпуре
Оffічіал
Наме: Прасад-Севайа Сонґ 2
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
brothers! One day at Sri Advaita''s house in santipura, the two Lords-Caitanya
and Nityananda-were seated for lunch. Lord Caitanya tasted the green leafy
vegetable preparation and addressed the assembly of His devotees, "This
sak is so delicious! Lord Krsna has definitely tasted it.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'হেন শাক-আস্বাদনে, কৃষ্ণ-প্রেম ঐসে মনে,
সেই প্রেমে কর আস্বাদন
জড়-বুদ্ধি পরিহরি'', প্রসাদ ভোজন করি'',
''হরি হরি'' বল সর্ব জন', E'হেন শাক-আস্বাদনে, কৃষ্ণ-প্রেম ঐসে মনে,
সেই প্রেমে কর আস্বাদন
জড়-বুদ্ধি পরিহরি'', প্রসাদ ভোজন করি'',
''হরি হরি'' বল সর্ব জন',
    E'bhāi-re!
eka-dina śāntipure, prabhu adwaitera ghare,
dui prabhu bhojane bosilo
śāk kori'' āswādana, prabhu bole bhakta-gaṇa,
ei śāk kṛṣṇa āswādilo', E'бга̄і-ре!
ека-діна ш́а̄нтіпуре, прабгу адваітера ґгаре,
дуі прабгу бгоджане босіло
ш́а̄к корі'' а̄сва̄дана, прабгу боле бгакта-ґан̣а,
еі ш́а̄к кр̣шн̣а а̄сва̄діло',
    E'', E'',
    E'"At the taste of sak like this, love of Krsna arises in the heart. In such
love you should taste these remnants. Giving up all materialistic conceptions
and taking the Lord''s prasad, all of you just chant `Hari! Hari!''"
Remarks/ Extra Information:
For
more details of this pastime in Verse 2, please see Caitanya Bhagavata
[Antya 4.234-299] Santipure Ailen Sri Gaurasundara.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'', E'',
    E'heno
śāk-āswādane, kṛṣṇa-prema aise mane,
sei preme koro āswādana
jaḍa-buddhi parihari'', prasād bhojana kori'',
`hari hari'' bolo sarva jan', E'хено
ш́а̄к-а̄сва̄дане, кр̣шн̣а-према аісе мане,
сеі преме коро а̄сва̄дана
джад̣а-буддгі паріхарі'', праса̄д бгоджана корі'',
`харі харі'' боло сарва джан',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 3: Sacira Anga Nekabhu
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Sacira Anga Nekabhu', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'ভাই-রে!
শচীর অঙ্গনে কভু, মাধবেন্দ্র-পুরী প্রভু,
প্রসাদান্ন করেন ভোজন
খাইতে খাইতে তা''র, আইল প্রেম সুদুর্বার,
বলে, শুন সন্ন্যাসীর গণ', E'ভাই-রে!
শচীর অঙ্গনে কভু, মাধবেন্দ্র-পুরী প্রভু,
প্রসাদান্ন করেন ভোজন
খাইতে খাইতে তা''র, আইল প্রেম সুদুর্বার,
বলে, শুন সন্ন্যাসীর গণ',
    E'Song
Name: Sacira Angane Kabhu
Official
Name: Prasad Sevaya Song 3
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Сачіра Анґане Кабгу
Оffічіал
Наме: Прасад Севайа Сонґ 3
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
brothers! Madhavendra Puri Prabhu sometimes honored prasad in the courtyard of
Mother Saci. While eating and eating he would become overwhelmed by symptoms of
ecstatic love of God. Once he addressed the renunciates who were accompanying
him, "O assembled sannyasis! Just listen to this:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'মোচা-ঘন্ট ফুল-বড়ি, দালি-দাল্না-চচ্চড়ি,
শচী-মাতা করিল রন্ধন
তা''র শুদ্ধা ভক্তি হেরি'', ভোজন করিল হরি,
সুধা-সম এ অন্ন-ব্যঞ্জন', E'মোচা-ঘন্ট ফুল-বড়ি, দালি-দাল্না-চচ্চড়ি,
শচী-মাতা করিল রন্ধন
তা''র শুদ্ধা ভক্তি হেরি'', ভোজন করিল হরি,
সুধা-সম এ অন্ন-ব্যঞ্জন',
    E'bhāi-re!
śacīr
ańgane kabhu, mādhavendra-purī prabhu,
prasādānna
korena bhojan
khāite
khāite tā''ra, āilo prema sudurbār,
bole,
śuno sannyāsīra gaṇ', E'бга̄і-ре!
ш́ачı̄р
аńґане кабгу, ма̄дгавендра-пурı̄ прабгу,
праса̄да̄нна
корена бгоджан
кха̄іте
кха̄іте та̄''ра, а̄іло према судурба̄р,
боле,
ш́уно саннйа̄сı̄ра ґан̣',
    E'', E'',
    E'"Mother Saci has cooked many varieties of prasad, such as semi-solid
delicacies made with banana flower, a special dahl preparation, baskets of
fruits, small square cakes made of lentils and cooked-down milk, among others.
Seeing her pure devotion, Lord Krsna personally ate all these preparations,
which are just like nectar.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'যোগে যোগী পায় যাহা, ভোগে আজ হ''বে তাহা,
হরি'' বলি'' খাও সবে ভাই
কৃষ্ণএর প্রসাদ-অন্ন, ত্রি-জগত করে ধন্য,
ত্রিপুরারি নাচে যাহা পাই''', E'যোগে যোগী পায় যাহা, ভোগে আজ হ''বে তাহা,
হরি'' বলি'' খাও সবে ভাই
কৃষ্ণএর প্রসাদ-অন্ন, ত্রি-জগত করে ধন্য,
ত্রিপুরারি নাচে যাহা পাই''',
    E'mocā-ghanṭa
phula-baḍi, dāli-dālnā-caccaḍi,
śacī-mātā
korilo randhan
tā''ra
śuddhā bhakti heri'', bhojana korilo hari,
sudhā-sama
e anna-byañjan', E'моча̄-ґгант̣а
пхула-бад̣і, да̄лі-да̄лна̄-чаччад̣і,
ш́ачı̄-ма̄та̄
коріло рандган
та̄''ра
ш́уддга̄ бгакті хері'', бгоджана коріло харі,
судга̄-сама
е анна-бйан̃джан',
    E'', E'',
    E'"O brothers! All the results that the mystic yogis obtain by the diligent
practice of yoga will be obtained today by taking these remnants of the Lord.
Everyone come and eat the prasad of Lord Hari and shout His holy name! The
three worlds are made glorious by the presence of the food-grains left by Lord
Krsna. Even Lord Tripurari (Lord Siva) dances in great joy on obtaining that
prasad.
REMARKS/EXTRA
INFORMATION:
Prasad
at Mother Saci''s is confirmed in the Caitanya-caritamrta, Madhya Lila Chapter 9 Verses 295 through
298.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'', E'',
    E'yoge
yogī pāy jāhā, bhoge āj ha''be tāhā,
`hari''
boli'' khāo sabe bhāi
kṛṣṇaera
prasād-anna, tri-jagat kore dhanya,
tripurāri
nāce jāhā pāi''', E'йоґе
йоґı̄ па̄й джа̄ха̄, бгоґе а̄дж ха''бе та̄ха̄,
`харі''
болі'' кха̄о сабе бга̄і
кр̣шн̣аера
праса̄д-анна, трі-джаґат коре дганйа,
тріпура̄рі
на̄че джа̄ха̄ па̄і''',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 4: Sri Caitanya Nityananda Sri
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Sri Caitanya Nityananda Sri', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'ভাই-রে!
শ্রী-চৈতন্য নিত্যানন্দ, শ্রীবাসাদি ভক্ত-বৃন্দ,
গৌরীদাস পন্ডিতের ঘরে
লুচি, চিনি, খীর, সার, মিঠাই, পায়স আর,
পিঠা-পান আস্বাদন করে', E'ভাই-রে!
শ্রী-চৈতন্য নিত্যানন্দ, শ্রীবাসাদি ভক্ত-বৃন্দ,
গৌরীদাস পন্ডিতের ঘরে
লুচি, চিনি, খীর, সার, মিঠাই, পায়স আর,
পিঠা-পান আস্বাদন করে',
    E'Song
Name: Sri Caitanya Nityananda Srivasadi Bhakta Vrnda
Official
Name: Prasada Sevaya Song 4
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Срі Чаітанйа Нітйананда Срівасаді Бхакта Врнда
Оffічіал
Наме: Прасада Севайа Сонґ 4
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'O brothers! Lord Caitanya, Lord Nityananda, and Their devotees headed by
Srivasa Thakura relish different varieties of prasad at the house of Gauridasa
Pandita. They ate luci (white flour puris), cini (sugar), sweet rice in
condensed milk (khir), a yogurt dessert (sar), sweets (mithai), and sweet rice
(payas).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'মহাপ্রভু ভক্ত-গণে, পরম-আনন্দ-মনে,
আজ্ঞা দিল করিতে ভোজন
কৃষ্ণএর প্রসাদ-অন্ন, ভোজনে হ‍ইয়া ধন্য,
কৃষ্ণ'' বলি'' ডাকে সর্ব-জন', E'মহাপ্রভু ভক্ত-গণে, পরম-আনন্দ-মনে,
আজ্ঞা দিল করিতে ভোজন
কৃষ্ণএর প্রসাদ-অন্ন, ভোজনে হ‍ইয়া ধন্য,
কৃষ্ণ'' বলি'' ডাকে সর্ব-জন',
    E'bhāi-re!
śrī-caitanya
nityānanda, śrīvāsādi bhakta-vṛnda,
gaurīdāsa
panḍiter ghare
luci,
cini, khīr, sār, miṭhāi, pāyas āra,
piṭhā-pāna
āsvādan kore', E'бга̄і-ре!
ш́рı̄-чаітанйа
нітйа̄нанда, ш́рı̄ва̄са̄ді бгакта-вр̣нда,
ґаурı̄да̄са
панд̣ітер ґгаре
лучі,
чіні, кхı̄р, са̄р, міт̣ха̄і, па̄йас а̄ра,
піт̣ха̄-па̄на
а̄сва̄дан коре',
    E'', E'',
    E'Sri Caitanya Mahaprabhu, in great ecstasy, gave the order to all of His
devotees to eat. Becoming very fortunate by taking the prasad of Lord Krsna,
everyone chants aloud, "Krsna! Krsna!"
REMARKS/EXTRA
INFORMATION:
This
song is to be sung before partaking sweet (dessert) prasadam.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'', E'',
    E'mahāprabhu
bhakta-gaṇe, parama-ānanda-mane,
ājñā
dilo korite bhojan
kṛṣṇaera
prasād-anna, bhojane hoiyā dhanya,
`kṛṣṇa''
boli'' ḍāke sarva-jan', E'маха̄прабгу
бгакта-ґан̣е, парама-а̄нанда-мане,
а̄джн̃а̄
діло коріте бгоджан
кр̣шн̣аера
праса̄д-анна, бгоджане хоійа̄ дганйа,
`кр̣шн̣а''
болі'' д̣а̄ке сарва-джан',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 5: Ek Din Nila Cale
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Ek Din Nila Cale', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'ভাই-রে!
এক-দিন নীলাচলে, প্রসাদ-সেবন-কালে,
মহাপ্রভু শ্রী-কৃষ্ণ-চৈতন্য
বলিলেন ভক্ত-গণে, খেচরান্ন শুদ্ধ-মনে,
সেবা করি'' হও আজ ধন্য', E'ভাই-রে!
এক-দিন নীলাচলে, প্রসাদ-সেবন-কালে,
মহাপ্রভু শ্রী-কৃষ্ণ-চৈতন্য
বলিলেন ভক্ত-গণে, খেচরান্ন শুদ্ধ-মনে,
সেবা করি'' হও আজ ধন্য',
    E'Song
Name: Ek Dina Nilacale
Official
Name: Prasad-Sevaya Song 5
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Ек Діна Нілачале
Оffічіал
Наме: Прасад-Севайа Сонґ 5
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'O brothers! One day in Jagannatha Puri, at the time of honoring the Lord''s
prasad, Mahaprabhu Sri Krsna Caitanya said to all the devotees, "May you
become blessed on this day by honoring the khicari of the Lord in a pure state
of mind.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'খেচরান্ন পিঠা-পানা, অপূর্ব প্রসাদ নানা,
জগন্নাথ দিল তোমা সবে
আকন্ঠ ভোজন করি'', বল মুখে হরি হরি'',
অবিদ্যা-দুরিত নাহি রবে', E'খেচরান্ন পিঠা-পানা, অপূর্ব প্রসাদ নানা,
জগন্নাথ দিল তোমা সবে
আকন্ঠ ভোজন করি'', বল মুখে হরি হরি'',
অবিদ্যা-দুরিত নাহি রবে',
    E'bhāi-re!
eka-dina
nīlācale, prasād-sevana-kāle,
mahāprabhu
śrī-kṛṣṇa-caitanya
bolilen
bhakta-gaṇe, khecarānna śuddha-mane,
sevā
kori'' hao āj dhanya', E'бга̄і-ре!
ека-діна
нı̄ла̄чале, праса̄д-севана-ка̄ле,
маха̄прабгу
ш́рı̄-кр̣шн̣а-чаітанйа
болілен
бгакта-ґан̣е, кхечара̄нна ш́уддга-мане,
сева̄
корі'' хао а̄дж дганйа',
    E'', E'',
    E'"Lord Jagannatha has given you varieties of extraordinary and wonderful
prasad, such as khicuri and pitha-pana (a type of cake and condensed-milk
preparation). Therefore, take all of this prasad until you are filled up to the
neck, and with your voices chant `Hari! Hari!'' In such a transcendental
atmosphere, ignorance and sin cannot remain.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'জগন্নাথ-প্রসাদান্ন, বিরিঞ্চি-শম্ভুর মান্য,
খাইলে প্রেম হ‍ইবে উদয়
এমন দুর্লভ ধন, পাইয়াছ সর্ব-জন,
জয় জয় জগন্নাথ যয়', E'জগন্নাথ-প্রসাদান্ন, বিরিঞ্চি-শম্ভুর মান্য,
খাইলে প্রেম হ‍ইবে উদয়
এমন দুর্লভ ধন, পাইয়াছ সর্ব-জন,
জয় জয় জগন্নাথ যয়',
    E'khecarānna
piṭhā-pānā, apūrva prasāda nānā,
jagannātha
dilo tomā sabe
ākanṭha
bhojana kori'', bolo mukhe `hari hari'',
avidyā-durita
nāhi robe', E'кхечара̄нна
піт̣ха̄-па̄на̄, апӯрва праса̄да на̄на̄,
джаґанна̄тха
діло тома̄ сабе
а̄кант̣ха
бгоджана корі'', боло мукхе `харі харі'',
авідйа̄-дуріта
на̄хі робе',
    E'', E'',
    E'"These prasad food-grains of Lord Jagannatha are worshipable even by Lord
Brahma and Lord Siva. Upon the eating of it, love of God arises within the
heart. All of you have obtained such a rare treasure. All glories! All glories!
All glories to Lord Jagannatha!"
Remarks/ Extra Information:
This
song is sung while honoring khicari prasadam.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'', E'',
    E'jagannātha-prasādānna,
viriñci-śambhura mānya,
khāile
prema hoibe udoy
emona
durlabha dhana, pāiyācho sarva-jana,
jaya
jaya jagannātha jay', E'джаґанна̄тха-праса̄да̄нна,
вірін̃чі-ш́амбгура ма̄нйа,
кха̄іле
према хоібе удой
емона
дурлабга дгана, па̄ійа̄чхо сарва-джана,
джайа
джайа джаґанна̄тха джай',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 6: Rama Krsna Go Carane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Rama Krsna Go Carane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'ভাই-রে!
রাম-কৃষ্ণ গোচারণে, যৈবেন দূর বনে,
এত চিন্তি'' যশোদা-রোহিণী
খীর, সার, ছানা, ননী, দু''জনে খাওয়ান আনি'',
বাত্সল্যে আনন্দ মনে গণি''', E'ভাই-রে!
রাম-কৃষ্ণ গোচারণে, যৈবেন দূর বনে,
এত চিন্তি'' যশোদা-রোহিণী
খীর, সার, ছানা, ননী, দু''জনে খাওয়ান আনি'',
বাত্সল্যে আনন্দ মনে গণি''',
    E'Song
Name: Rama Krsna Go Carane
Official
Name: Prasad Sevaya Song 6
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Рама Крсна Ґо Чаране
Оffічіал
Наме: Прасад Севайа Сонґ 6
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'O brothers! Mother Yasoda and Mother Rohini were thinking, "Today our two
boys, Balarama and Krsna, will go to a distant forest to tend Their cows."
Contemplating thus in the ecstasy of parental affection, they prepared a
wonderful feast for the two boys, consisting of khira, solid cream, curd, and
fresh yellow butter.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'বয়স্য রাখাল-গণে, খায় রাম-কৃষ্ণ-সনে,
নাচে গায় আনন্দ-অন্তরে
কৃষ্ণএর প্রসাদ খায়, উদর ভরিয়া যায়,
''আর দেও'' ''আর দেও'' করে', E'বয়স্য রাখাল-গণে, খায় রাম-কৃষ্ণ-সনে,
নাচে গায় আনন্দ-অন্তরে
কৃষ্ণএর প্রসাদ খায়, উদর ভরিয়া যায়,
''আর দেও'' ''আর দেও'' করে',
    E'bhāi-re!
rāma-kṛṣṇa
gocāraṇe, jaibena dūra vane,
eto
cinti'' yaśodā-rohiṇī
khīr,
sār, chānā, nanī, du''jane khāowāno
āni'',
vātsalye
ānanda mane gaṇi''', E'бга̄і-ре!
ра̄ма-кр̣шн̣а
ґоча̄ран̣е, джаібена дӯра ване,
ето
чінті'' йаш́ода̄-рохін̣ı̄
кхı̄р,
са̄р, чха̄на̄, нанı̄, ду''джане кха̄ова̄но
а̄ні'',
ва̄тсалйе
а̄нанда мане ґан̣і''',
    E'', E'',
    E'All the cowherd boyfriends take lunch with Balarama and Krsna while dancing and
singing in ecstasy. They eat the remnants of Krsna''s meal until their bellies
are full, and still exclaim, "Give us more! Give us more!"
REMARKS/EXTRA
INFORMATION:
This
sung is to be sung when offering to the child forms of Krsna (bāla-bhoga).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'', E'',
    E'vayasya
rākhāla-gaṇe, khāy
rāma-kṛṣṇa-sane,
nāce
gāy ānanda-antare
kṛṣṇaera
prasāda khāy, udara bhoriyā jāy,
`āra
deo'' `āra deo'' kore', E'вайасйа
ра̄кха̄ла-ґан̣е, кха̄й
ра̄ма-кр̣шн̣а-сане,
на̄че
ґа̄й а̄нанда-антаре
кр̣шн̣аера
праса̄да кха̄й, удара бгорійа̄ джа̄й,
`а̄ра
део'' `а̄ра део'' коре',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 1: Nadiya Godrume
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Nadiya Godrume', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'নদীয়া-গোদ্রুমে নিত্য়ানন্দ মহাজন
পতিয়াছে নাম-হট্ট জীবের কারণ', E'নদীয়া-গোদ্রুমে নিত্য়ানন্দ মহাজন
পতিয়াছে নাম-হট্ট জীবের কারণ',
    E'Song
Name: Nadiya Godrume Nityananda Mahajana
Official
Name: Nagara Kirtana Song 1; Ajna Tahal
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Надійа Ґодруме Нітйананда Махаджана
Оffічіал
Наме: Наґара Кіртана Сонґ 1; Аджна Тахал
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) In
the land of Nadiya, on the island of Godruma, the magnanimous Lord Nityananda
has opened up the Marketplace of the Holy Name, meant for the deliverance of
all fallen souls.
2) O
people of faith! O people of faith! By the order of Lord Gauranga, O brothers,
I beg these three requests of you: Chant "Krsna!", worship Krsna, and
teach others about Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'(শ্রদ্ধাবান জন হে, শ্রদ্ধাবান জন হে)
প্রভুর আজ্ঞায়, ভাই, মাগি এই ভিক্ষা
বল কৃষ্ণ,'' ভজ কৃষ্ণ, কর কৃষ্ণ-শিক্ষা', E'(শ্রদ্ধাবান জন হে, শ্রদ্ধাবান জন হে)
প্রভুর আজ্ঞায়, ভাই, মাগি এই ভিক্ষা
বল কৃষ্ণ,'' ভজ কৃষ্ণ, কর কৃষ্ণ-শিক্ষা',
    E'nadīyā-godrume
nityānanda mahājana
patiyāche
nām-haṭṭa jīvera kāraṇa', E'надı̄йа̄-ґодруме
нітйа̄нанда маха̄джана
патійа̄чхе
на̄м-хат̣т̣а джı̄вера ка̄ран̣а',
    E'', E'',
    E'Being careful to remain free of offenses; just take the holy name of Lord
Krsna. Krsna is your mother, Krsna is your father, and Krsna is the treasure of
your life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'অপরাধ-শূন্য় হ''য়ে লহো কৃষ্ণ-নাম
কৃষ্ণ মাতা, কৃষ্ণ পিতা, কৃষ্ণ ধন-প্রান', E'অপরাধ-শূন্য় হ''য়ে লহো কৃষ্ণ-নাম
কৃষ্ণ মাতা, কৃষ্ণ পিতা, কৃষ্ণ ধন-প্রান',
    E'(śraddhāvān
jan he, śraddhāvān jan he)
prabhura
ājñāy, bhāi, māgi ei bhikṣā
bolo
`kṛṣṇa,'' bhajo kṛṣṇa, koro
kṛṣṇa-śikṣā', E'(ш́раддга̄ва̄н
джан хе, ш́раддга̄ва̄н джан хе)
прабгура
а̄джн̃а̄й, бга̄і, ма̄ґі еі бгікша̄
боло
`кр̣шн̣а,'' бгаджо кр̣шн̣а, коро
кр̣шн̣а-ш́ікша̄',
    E'', E'',
    E'Giving up all sinful activities, carry on your worldly duties only in relation
to Lord Krsna. The showing of compassion to other souls by loudly chanting the
holy name of Krsna is the essence of all forms of religion.
REMARKS/EXTRA
INFORMATION:
Bhaktivinoda
Thakura has written two purports for this song. Please visit his page to find
the purports. The raga is based on a Mand style in dadra tala.
PURPORTS:
By Bhaktivinoda
Thakura', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'কৃষ্ণএর সংসার কর ছাড়ি'' অনাচার
জীবে দয়া, কৃষ্ণ-নাম-সর্ব্ব-ধর্ম্ম-সার', E'কৃষ্ণএর সংসার কর ছাড়ি'' অনাচার
জীবে দয়া, কৃষ্ণ-নাম-সর্ব্ব-ধর্ম্ম-সার',
    E'aparādha-śūnya
ho''ye loho kṛṣṇa-nām
kṛṣṇa
mātā, kṛṣṇa pitā, kṛṣṇa
dhana-prān', E'апара̄дга-ш́ӯнйа
хо''йе лохо кр̣шн̣а-на̄м
кр̣шн̣а
ма̄та̄, кр̣шн̣а піта̄, кр̣шн̣а
дгана-пра̄н',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'', E'',
    E'kṛṣṇaera
saḿsāra koro chāḍi'' anācār
jīve
doyā, kṛṣṇa-nāmsarva-dharma-sār', E'кр̣шн̣аера
саḿса̄ра коро чха̄д̣і'' ана̄ча̄р
джı̄ве
дойа̄, кр̣шн̣а-на̄мсарва-дгарма-са̄р',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 2: Gay Gora Madhur
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Gay Gora Madhur', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'', E'',
    E'Song
Name: Gay Gora Madhura Sware
Official
Name: Sri Nagara Kirtana Sri Nama Song 2
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Ґай Ґора Мадгура Сваре
Оffічіал
Наме: Срі Наґара Кіртана Срі Нама Сонґ 2
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Sware', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'', E'',
    E'gāy
gorā madhur sware
hare kṛṣṇa hare kṛṣṇa
kṛṣṇa kṛṣṇa hare hare
hare rāma hare rāma rāma rāma hare hare', E'ґа̄й
ґора̄ мадгур сваре
харе кр̣шн̣а харе кр̣шн̣а
кр̣шн̣а кр̣шн̣а харе харе
харе ра̄ма харе ра̄ма ра̄ма ра̄ма харе харе',
    E'', E'',
    E'Lord Gaurasundara sings in a very sweet voice, Hare Krsna, Hare Krsna, Krsna
Krsna, Hare Hare, Hare Rama, Hare Rama, Rama Rama, Hare Hare.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'', E'',
    E'gṛhe
thāko, vane thāko, sadā ''hari'' bole'' ḍāko,
sukhe duḥkhe bhulo nā''ko, vadane hari-nām koro re', E'ґр̣хе
тха̄ко, ване тха̄ко, сада̄ ''харі'' боле'' д̣а̄ко,
сукхе дух̣кхе бгуло на̄''ко, вадане харі-на̄м коро ре',
    E'', E'',
    E'Whether you are a householder or a sannyasi, constantly chant "Hari!
Hari!" Do not forget this chanting, whether you are in a happy condition
or a distressful one. Just fill your lips with the hari-nama.
3) You
are bound up in the network of Maya and are forced to toil fruitlessly. Now you
have obtained full consciousness in the human form of life, so chant the names
of Radha-Madhava.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'', E'',
    E'māyā-jāle
baddha ho ''ye, ācho miche kāja lo ''ye,
ekhona cetana pe''ye, ''rādhā-mādhav'' nām bolo re', E'ма̄йа̄-джа̄ле
баддга хо ''йе, а̄чхо мічхе ка̄джа ло ''йе,
екхона четана пе''йе, ''ра̄дга̄-ма̄дгав'' на̄м боло ре',
    E'', E'',
    E'Your life may end at any moment, and you have not served the Lord of the senses,
Hrsikesa. Take this advice of Bhaktivinoda Thakura: "Just once, relish the
nectar of the holy name!"
Remarks/ Extra Information:
This
song is heard in Raga Jhinjhoti or Raga Bangala in Dadra Tala or Lopha Tala,
respectively.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'', E'',
    E'jīvana
hoilo śeṣa, nā bhajile hṛṣīkeśa
bhaktivinodopadeśa, ekbār nām-rase māto re
WORD', E'джı̄вана
хоіло ш́еша, на̄ бгаджіле хр̣шı̄кеш́а
бгактівінодопадеш́а, екба̄р на̄м-расе ма̄то ре
ВОРД',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 3: Ek Bar Bhavo Mane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Ek Bar Bhavo Mane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'এক
বার ভাব মনে,
আশা-বশে
ভ্রমি'' হেথা পা''বে
কি সুখ জীবনে
কে
তুমি, কোথায় ছিলে,
কি করিতে হেথা
এলে,
কিবা
কাজ করে'' গেলে, যা''বে
কোথা শরীর-পতনে', E'এক
বার ভাব মনে,
আশা-বশে
ভ্রমি'' হেথা পা''বে
কি সুখ জীবনে
কে
তুমি, কোথায় ছিলে,
কি করিতে হেথা
এলে,
কিবা
কাজ করে'' গেলে, যা''বে
কোথা শরীর-পতনে',
    E'Song
Name: Ekbar Bhavo Mane
Official
Name: Sri Nagara Kirtana Sri Nama Song 3
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Екбар Бхаво Мане
Оffічіал
Наме: Срі Наґара Кіртана Срі Нама Сонґ 3
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Consider this just once! While you wander in this world, under the control of
material desires, what happiness will you achieve in this mundane life? Who are
you? Where have you come from? How did you come here? What have you done? And
where will you go at the time of death when your body drops?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'কেনো
সুখ, দুঃখ, ভয়, অহংতা-মমতা-ময়,
তুচ্ছ
জয়-পরাজয়, ক্রোধ-হিংসা,
দ্বেষ অন্য-জনে
ভকতিবিনোদ
কয়, করি'' গোরা-পদাশ্রয়,
চিদ-আনন্দ-রস-ময়
হও রাধা-কৃষ্ণ-নাম-গানে', E'কেনো
সুখ, দুঃখ, ভয়, অহংতা-মমতা-ময়,
তুচ্ছ
জয়-পরাজয়, ক্রোধ-হিংসা,
দ্বেষ অন্য-জনে
ভকতিবিনোদ
কয়, করি'' গোরা-পদাশ্রয়,
চিদ-আনন্দ-রস-ময়
হও রাধা-কৃষ্ণ-নাম-গানে',
    E'ekbār
bhāvo mane,
āśā-baśe
bhrami'' hethā pā''be ki sukha jīvane
ke
tumi, kothāy chile, ki korite hethā ele,
kibā
kāj kore'' gele, jā''be kothā śarīra-patane', E'екба̄р
бга̄во мане,
а̄ш́а̄-баш́е
бграмі'' хетха̄ па̄''бе кі сукха джı̄ване
ке
тумі, котха̄й чхіле, кі коріте хетха̄ еле,
кіба̄
ка̄дж коре'' ґеле, джа̄''бе котха̄ ш́арı̄ра-патане',
    E'', E'',
    E'What is the use of so much worldly happiness, distress and fear, which arise
from the false egotism of "I" and "mine"? And what is the
use of insignificant victory and defeat, anger, violence, and envy toward other
living beings? Bhaktivinoda says, "Just take shelter at the lotus feet of
Lord Gaurasundara and sing the names of Radha and Krsna, and you will become
saturated with the mellows of pure spiritual bliss."
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'', E'',
    E'keno
sukha, duḥkha, bhoy, ahaḿtā-mamatā-moy,
tuccha
jay-parājay, krodha-hiḿsā, dveṣa anya-jane
bhakativinoda
koy, kori'' gorā-padāśroy,
cid-ānanda-rasa-moy
hao rādhā-kṛṣṇa-nāma-gāne', E'кено
сукха, дух̣кха, бгой, ахаḿта̄-мамата̄-мой,
туччха
джай-пара̄джай, кродга-хіḿса̄, двеша анйа-джане
бгакатівінода
кой, корі'' ґора̄-пада̄ш́рой,
чід-а̄нанда-раса-мой
хао ра̄дга̄-кр̣шн̣а-на̄ма-ґа̄не',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 4: Radha Krsna Bol
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Radha Krsna Bol', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'''রাধা-কৃষ্ণ'' বল বল বল রে সবাই
(এই) শিক্ষা দিয়া, সব নদীয়া
ফিরছে নেচে'' গৌর-নিতাই', E'''রাধা-কৃষ্ণ'' বল বল বল রে সবাই
(এই) শিক্ষা দিয়া, সব নদীয়া
ফিরছে নেচে'' গৌর-নিতাই',
    E'Song
Name: Radha Krsna Bol Bol
Official
Name: Nagara Kirtana Song 4; Sri Nama
Author:
Bhaktivinoda Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Радга Крсна Бол Бол
Оffічіал
Наме: Наґара Кіртана Сонґ 4; Срі Нама
Аутхор:
Бхактівінода Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Krsna Bol', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'(মিছে) মায়ার বশে, যাচ্ছো ভেসে'',
খাচ্ছো হাবুডুবু, ভাই', E'(মিছে) মায়ার বশে, যাচ্ছো ভেসে'',
খাচ্ছো হাবুডুবু, ভাই',
    E'''rādhā-kṛṣṇa''
bol bol bolo re sobāi
(ei) śikṣā diyā, sab nadīyā
phirche nece'' gaura-nitāi
(miche) māyār bośe, jāccho bhese'',
khāccho hābuḍubu, bhāi', E'''ра̄дга̄-кр̣шн̣а''
бол бол боло ре соба̄і
(еі) ш́ікша̄ дійа̄, саб надı̄йа̄
пхірчхе нече'' ґаура-ніта̄і
(мічхе) ма̄йа̄р бош́е, джа̄ччхо бгесе'',
кха̄ччхо ха̄буд̣убу, бга̄і',
    E'', E'',
    E'Chant, chant "Radha-Krsna!" Everyone chant! When Lord Caitanya and
Lord Nityananda came dancing through Nadia, They gave these teachings: Chant,
chant "Radha-Krsna!" Everyone chant! You are caught up in a whirlpool
of senseless action and are sinking lower and lower. Chant, chant
"Radha-Krsna!" Everyone chant!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'(জীব) কৃষ্ণ-দাস, এ বিশ্বাস,
করলে তো'' আর দুঃখো নাই', E'(জীব) কৃষ্ণ-দাস, এ বিশ্বাস,
করলে তো'' আর দুঃখো নাই',
    E'(jīv)
kṛṣṇa-dās, e biśwās,
korle to'' ār duḥkho nāi
(kṛṣṇa) bolbe jabe, pulak ha''be
jhorbe āńkhi, boli tāi', E'(джı̄в)
кр̣шн̣а-да̄с, е біш́ва̄с,
корле то'' а̄р дух̣кхо на̄і
(кр̣шн̣а) болбе джабе, пулак ха''бе
джхорбе а̄ńкхі, болі та̄і',
    E'', E'',
    E'If you just understand that the spirit soul is the eternal servant of Krsna,
you will never have any more sorrows. Chant Hare Krsna and your eyes will fill
with tears and your body will feel transcendental shivering. Chant, chant
"Radha-Krsna!" Everyone chant!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'(কৃষ্ণ) বল্বে জবে, পুলক হ''বে
ঝর্ব্বে আঙ্খি, বলি তাই', E'(কৃষ্ণ) বল্বে জবে, পুলক হ''বে
ঝর্ব্বে আঙ্খি, বলি তাই',
    E'(''rādhā)
kṛṣṇa'' bolo, sańge calo,
ei-mātra bhikhā cāi
(jāy) sakal'' bipod bhaktivinod
bole, jakhon o-nām gāi
WORD', E'(''ра̄дга̄)
кр̣шн̣а'' боло, саńґе чало,
еі-ма̄тра бгікха̄ ча̄і
(джа̄й) сакал'' біпод бгактівінод
боле, джакхон о-на̄м ґа̄і
ВОРД',
    E'', E'',
    E'Simply chant "Radha-Krsna" and join with us. Those are the only alms
we beg. Chant, chant "Radha-Krsna!" Everyone chant! "All dangers
will be gone when that Name is chanted," says Bhaktivinoda Thakura. Chant,
chant "Radha-Krsna!" Everyone chant!
REMARKS/EXTRA
INFORMATION:
This
song can be sung in Raga Mand.
PURPORT:
A.C. Bhaktivedanta
Swami Prabhupada
MUSICAL
NOTATION:
♫
Radha Krsna Bol', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'(''রাধা) কৃষ্ণ'' বল, সঙ্গে চল,
এই-মাত্র ভিক্ষা চাই', E'(''রাধা) কৃষ্ণ'' বল, সঙ্গে চল,
এই-মাত্র ভিক্ষা চাই',
    E'', E'',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'(যায়) সকল''বিপদ ভক্তিবিনোদ
বলে, যখন ও-নাম গাই', E'(যায়) সকল''বিপদ ভক্তিবিনোদ
বলে, যখন ও-নাম গাই',
    E'', E'',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 5: Gay Gora Cand Jiver Tore
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Gay Gora Cand Jiver Tore', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'', E'',
    E'Song
Name: Gay Goracand Jiver Tore
Official
Name: Sri Nagar Kirtana Sri Nama Song 5
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ
ଅ
(refrain)
gāy
gorācānd jīver tore
hare
kṛṣṇa hare', E'Сонґ
Наме: Ґай Ґорачанд Джівер Торе
Оffічіал
Наме: Срі Наґар Кіртана Срі Нама Сонґ 5
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ
ଅ
(реfраін)
ґа̄й
ґора̄ча̄нд джı̄вер торе
харе
кр̣шн̣а харе',
    E'', E'',
    E'Refrain:
Lord Gaurachanda sings the mahamantra for the deliverance of all fallen souls!
Hare Krsna Hare!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'', E'',
    E'hare
kṛṣṇa hare kṛṣṇa kṛṣṇa
kṛṣṇa hare hare,
hare
kṛṣṇa hare
hare
rāma hare rāma rāma rāma hare hare
hare
kṛṣṇa hare', E'харе
кр̣шн̣а харе кр̣шн̣а кр̣шн̣а
кр̣шн̣а харе харе,
харе
кр̣шн̣а харе
харе
ра̄ма харе ра̄ма ра̄ма ра̄ма харе харе
харе
кр̣шн̣а харе',
    E'', E'',
    E'Hare Krsna Hare Krsna Krsna Krsna Hare Hare! Hare Rama Hare Rama Rama Rama Hare
Hare!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'', E'',
    E'ekbār
bol rasanā uccaiḥ-sware
(bolo)
nandera nandan, yaśoda-jīvan,
śrī-rādhā-ramaṇ,
prema-bhare', E'екба̄р
бол расана̄ уччаіх̣-сваре
(боло)
нандера нандан, йаш́ода-джı̄ван,
ш́рı̄-ра̄дга̄-раман̣,
према-бгаре',
    E'', E'',
    E'Fill yourself with divine love by chanting loudly just once all these names of
Krsna, O Nanda-Nandana! O Yasoda Jivana! O Sri Radha Ramana!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'', E'',
    E'(bol)
śrī-madhusūdan, gopī-prāna-dhana,
muralī-vadana,
nṛtya kore''
(bol)
agha-nisūdan, pūtanā-ghātana,
brahma-vimohana,
ūrdhva-kare', E'(бол)
ш́рı̄-мадгусӯдан, ґопı̄-пра̄на-дгана,
муралı̄-вадана,
нр̣тйа коре''
(бол)
аґга-нісӯдан, пӯтана̄-ґга̄тана,
брахма-вімохана,
ӯрдгва-каре',
    E'', E'',
    E'Dancing with your arms in the air, chant O Sri Madhusudana! O Gopi Prana
Dhana! O Murli Vadana! O Agha Nisudana! O Putana-Ghatana! O Brahma-Vimohana!
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 6: Anga Up Anga Astra Parsada
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Anga Up Anga Astra Parsada', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'অঙ্গ-উপাঙ্গ-অস্ত্র-পার্ষদ সঙ্গে
নাচো-ই ভাব-মূরতি গোরা রঙ্গে', E'অঙ্গ-উপাঙ্গ-অস্ত্র-পার্ষদ সঙ্গে
নাচো-ই ভাব-মূরতি গোরা রঙ্গে',
    E'Song
Name: Anga Upanga Astra
Official
Name: Sri Nagar Kirtana Song 6 (Sri-Nama)
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Анґа Упанґа Астра
Оffічіал
Наме: Срі Наґар Кіртана Сонґ 6 (Срі-Нама)
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Lord Gauranga, the personification of ecstatic love of God, dances in the
company of His plenary portions, along with the parts and parcels of His
plenary portions, with His divine weapons, and with His personal associates.
2) The
son of Mother Saci wanders throughout the abode of Nadiya singing the holy
names of Krsna, which are the deliverer of all living beings imprisoned within
the age of Kali, as follows:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'গায়োত কলি-যুগ-পাবন নাম
ভ্রম-ই শচী-সুত নদীয়া ধাম', E'গায়োত কলি-যুগ-পাবন নাম
ভ্রম-ই শচী-সুত নদীয়া ধাম',
    E'ańga-upāńga-astra-pārṣada
sańge
nāco-i
bhāva-mūrati gorā rańge', E'аńґа-упа̄ńґа-астра-па̄ршада
саńґе
на̄чо-і
бга̄ва-мӯраті ґора̄ раńґе',
    E'', E'',
    E'"O Lord Hari! Obeisances unto Hari, who is Krsna, the best of the Yadus,
the herder of the cows, the pleasure of the cows, the supreme enjoyer, and the
blessed killer of the demon named Madhu."
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'(হরে) হরয়ে নমঃ কৃষ্ণ যাদবায় নমঃ
গোপাল গোবিন্দ রাম শ্রী-মধুসূদন', E'(হরে) হরয়ে নমঃ কৃষ্ণ যাদবায় নমঃ
গোপাল গোবিন্দ রাম শ্রী-মধুসূদন',
    E'gāota
kali-yuga-pāvana nām
bhrama-i
śacī-suta nadīyā dhām', E'ґа̄ота
калі-йуґа-па̄вана на̄м
бграма-і
ш́ачı̄-сута надı̄йа̄ дга̄м',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'', E'',
    E'(hare)
haraye namaḥ kṛṣṇa yādavāya namaḥ
gopāla
govinda rāma śrī-madhusūdana', E'(харе)
харайе намах̣ кр̣шн̣а йа̄дава̄йа намах̣
ґопа̄ла
ґовінда ра̄ма ш́рı̄-мадгусӯдана',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 7: Hare Krsna Hare Nitai Iki Namene Che
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Hare Krsna Hare Nitai Iki Namene Che', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'নিতাই কি নাম এনেছে রে
(নিতাই) নাম এনেছে, নামের হাটে,
শ্রদ্ধা-মূল্যে নাম দিতেছে রে', E'নিতাই কি নাম এনেছে রে
(নিতাই) নাম এনেছে, নামের হাটে,
শ্রদ্ধা-মূল্যে নাম দিতেছে রে',
    E'Song
Name: Hare Krsna Hare Nitai Ki Nam Eneche Re
Official
Name: Nagara Kirtana Song 7 Sri Nama
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ
(refrain)
hare
kṛṣṇa hare', E'Сонґ
Наме: Харе Крсна Харе Нітаі Кі Нам Енечхе Ре
Оffічіал
Наме: Наґара Кіртана Сонґ 7 Срі Нама
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ
(реfраін)
харе
кр̣шн̣а харе',
    E'', E'',
    E'(refrain):
Hare Krsna Hare!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'হরে কৃষ্ণ হরে কৃষ্ণ কৃষ্ণ কৃষ্ণ হরে হরে রে
হরে রাম হরে রাম রাম রাম হরে হরে রে', E'হরে কৃষ্ণ হরে কৃষ্ণ কৃষ্ণ কৃষ্ণ হরে হরে রে
হরে রাম হরে রাম রাম রাম হরে হরে রে',
    E'nitāi
ki nām eneche re
(nitāi)
nām eneche, nāmer hāṭe,
śraddhā-mūlye
nām diteche re', E'ніта̄і
кі на̄м енечхе ре
(ніта̄і)
на̄м енечхе, на̄мер ха̄т̣е,
ш́раддга̄-мӯлйе
на̄м дітечхе ре',
    E'', E'',
    E'Oh, what a wonderful name Lord Nityananda has brought! Nitai has brought the
divine name to the Marketplace of the Holy Name, and He is giving away that
name for the mere price of your faith! Oh!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'(নিতাই) জীবের দশা, মলিন দেখে'',
নাম এনেছে ব্রজ থেকে রে
এ নাম শিব জপে পঞ্চ-মুখে রে
(মধুর এ হরিনাম)
এ নাম ব্রহ্মা জপে চতুর-মুখে রে
(মধুর এ হরিনাম)
এ নাম নারদ জপে বীনা-যন্ত্রে রে
(মধুর এ হরিনাম)
এ নামাবসে অজামিল বৈকুণ্ঠে গেল রে
এ নাম বলতে বলতে ব্রজে চল রে
(ভক্তিবিনোদ বলে)', E'(নিতাই) জীবের দশা, মলিন দেখে'',
নাম এনেছে ব্রজ থেকে রে
এ নাম শিব জপে পঞ্চ-মুখে রে
(মধুর এ হরিনাম)
এ নাম ব্রহ্মা জপে চতুর-মুখে রে
(মধুর এ হরিনাম)
এ নাম নারদ জপে বীনা-যন্ত্রে রে
(মধুর এ হরিনাম)
এ নামাবসে অজামিল বৈকুণ্ঠে গেল রে
এ নাম বলতে বলতে ব্রজে চল রে
(ভক্তিবিনোদ বলে)',
    E'hare
kṛṣṇa hare kṛṣṇa kṛṣṇa
kṛṣṇa hare hare re
hare
rāma hare rāma rāma rāma hare hare re', E'харе
кр̣шн̣а харе кр̣шн̣а кр̣шн̣а
кр̣шн̣а харе харе ре
харе
ра̄ма харе ра̄ма ра̄ма ра̄ма харе харе ре',
    E'', E'',
    E'Hare Krsna, Hare Krsna, Krsna Krsna, Hare Hare Oh! Hare Rama, Hare Rama, Rama
Rama, Hare Hare Oh!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'', E'',
    E'(nitāi)
jīvera daśā, malina dekhe'',
nām
eneche braja theke re
e
nām śiva jape pañca-mukhe re
(madhur
e harinām)
e
nām brahmā jape catur-mukhe re
(madhur
e harinām)
e
nām nārada jape vīnā-yantre re
(madhur
e harinām)
e
nāmābase ajāmila vaikuṇṭhe gelo re
e
nām bolte bolte braje calo re
(bhaktivinoda
bole)', E'(ніта̄і)
джı̄вера даш́а̄, маліна декхе'',
на̄м
енечхе браджа тхеке ре
е
на̄м ш́іва джапе пан̃ча-мукхе ре
(мадгур
е харіна̄м)
е
на̄м брахма̄ джапе чатур-мукхе ре
(мадгур
е харіна̄м)
е
на̄м на̄рада джапе вı̄на̄-йантре ре
(мадгур
е харіна̄м)
е
на̄ма̄басе аджа̄міла ваікун̣т̣хе ґело ре
е
на̄м болте болте брадже чало ре
(бгактівінода
боле)',
    E'', E'',
    E'Oh! Seeing the miserable condition of the fallen souls of this world, Nitai has
personally brought the holy name from the transcendental realm of Vraja! Oh!
Lord Siva chants this holy name with his five mouths! (This holy name is so
sweet!) Oh! Lord Brahma chants this holy name with his four mouths! (This holy
name is so sweet!) Oh! Narada Muni chants this holy name while playing on his
vina! (This holy name is so sweet!) Oh! Just by the dim reflection of this holy
name, the sinful Ajamila went to Vaikuntha! "Oh! While continuously
chanting this holy name, go at once to the divine realm of Vraja! This holy
name is so sweet!" (Bhaktivinoda therefore says.)
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 8: Hari Bolo Modera
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Hari Bolo Modera', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 8;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'এল
রে গৌরাঙ্গ-চান্দ
প্রেমে এলথেল
নিতাই-অদ্বৈত-সঙ্গে
গোদ্রুমে পশিল', E'এল
রে গৌরাঙ্গ-চান্দ
প্রেমে এলথেল
নিতাই-অদ্বৈত-সঙ্গে
গোদ্রুমে পশিল',
    E'Song
Name: Hari Bole Modera Gaura Elo
Official
Name: Sri Nagara Kirtana Sri Nama Song 8
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ
(refrain)
hari''
bole'' modera gaura elo', E'Сонґ
Наме: Харі Боле Модера Ґаура Ело
Оffічіал
Наме: Срі Наґара Кіртана Срі Нама Сонґ 8
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ
(реfраін)
харі''
боле'' модера ґаура ело',
    E'', E'',
    E'(Refrain)
Our Lord Gaura came chanting "Hari! Hari!"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'সঙ্কীর্তন-রসে
মেতে নাম বিলাইল
নামের
হাটে এসে প্রেমে
জগত ভাসাইল', E'সঙ্কীর্তন-রসে
মেতে নাম বিলাইল
নামের
হাটে এসে প্রেমে
জগত ভাসাইল',
    E'elo
re gaurāńga-cānda preme elothelo
nitāi-adwaita-sańge
godrume paśilo', E'ело
ре ґаура̄ńґа-ча̄нда преме елотхело
ніта̄і-адваіта-саńґе
ґодруме паш́іло',
    E'', E'',
    E'Lord Gauranga-canda came looking very disheveled, as if mad, due to ecstatic
love of God, and along with Lord Nityananda and Advaita Acarya, He entered the land of Godruma.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'গোদ্রুম-বাসীর
আজ দুঃখ দূরে গেল
ভক্ত-বৃন্দ-সঙ্গে
আসি'' হাট জাগাইল', E'গোদ্রুম-বাসীর
আজ দুঃখ দূরে গেল
ভক্ত-বৃন্দ-সঙ্গে
আসি'' হাট জাগাইল',
    E'sańkīrtana-rase
mete nām bilāilo
nāmera
hāṭe ese preme jagat bhāsāilo', E'саńкı̄ртана-расе
мете на̄м біла̄іло
на̄мера
ха̄т̣е есе преме джаґат бга̄са̄іло',
    E'', E'',
    E'Deeply absorbed in the intoxicating mellows of sankirtan, He distributed the
holy name. Having come to the Marketplace of the Holy Name, He caused the whole
universe to swim in ecstatic love of God.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'নদীয়া
ভ্রমিতে গোরা এল
নামের হাটে
গৌর
এল হাটে, সঙ্গে
নিতাই এল হাটে', E'নদীয়া
ভ্রমিতে গোরা এল
নামের হাটে
গৌর
এল হাটে, সঙ্গে
নিতাই এল হাটে',
    E'godruma-bāsīr
āj duḥkha dūre gelo
bhakta-vṛnda-sańge
āsi'' hāṭa jāgāilo', E'ґодрума-ба̄сı̄р
а̄дж дух̣кха дӯре ґело
бгакта-вр̣нда-саńґе
а̄сі'' ха̄т̣а джа̄ґа̄іло',
    E'', E'',
    E'Today all the miseries of the residents of Godruma-dvipa have gone far away,
for Lord Gauranga, having come here along with all His devotees, caused the
Marketplace of the Holy Name to appear here in Godruma.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'নাচে
মাতোয়ারা নিতাই
গোদ্রুমের মাঠে
জগত
মাতায় নিতাই প্রেমের
মালসাটে', E'নাচে
মাতোয়ারা নিতাই
গোদ্রুমের মাঠে
জগত
মাতায় নিতাই প্রেমের
মালসাটে',
    E'nadīyā
bhramite gorā elo nāmer hāṭe
gaura
elo hāṭe, sańge nitāi elo hāṭe', E'надı̄йа̄
бграміте ґора̄ ело на̄мер ха̄т̣е
ґаура
ело ха̄т̣е, саńґе ніта̄і ело ха̄т̣е',
    E'', E'',
    E'Wandering all over the land of Nadiya, Lord Gaura came to the Marketplace of
the Holy Name. Lord Gaura came to the Marketplace along with Nitai.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'(তোরা
দেখে'' যা'' রে)
অদ্বৈতাদি
ভক্ত-বৃন্দ নাচে
ঘাটে ঘাটে
পলায়
দুরন্ত কলি পড়িয়া
বিভ্রাটে', E'(তোরা
দেখে'' যা'' রে)
অদ্বৈতাদি
ভক্ত-বৃন্দ নাচে
ঘাটে ঘাটে
পলায়
দুরন্ত কলি পড়িয়া
বিভ্রাটে',
    E'nāce
mātoyārā nitāi godrumera māṭhe
jagat
mātāy nitāi premera mālasāṭe', E'на̄че
ма̄тойа̄ра̄ ніта̄і ґодрумера ма̄т̣хе
джаґат
ма̄та̄й ніта̄і премера ма̄ласа̄т̣е',
    E'', E'',
    E'Maddened with ecstasy, Lord Nityananda dances in the fields of Godruma. Due to
ecstatic love of God, He moves His powerful arms like a challenging wrestler
and thus overwhelms the universe in ecstasy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'কি
সুখে ভাসিল জীব
গোরাচান্দের নাটে
দেখিয়া
শুনিয়া পাষণ্ডীর
বুক ফাটে', E'কি
সুখে ভাসিল জীব
গোরাচান্দের নাটে
দেখিয়া
শুনিয়া পাষণ্ডীর
বুক ফাটে',
    E'(torā
dekhe'' jā'' re)
adwaitādi
bhakta-vṛnda nāce ghāṭe ghāṭe
palāya
duranta kali poḍiyā bibhrāṭe', E'(тора̄
декхе'' джа̄'' ре)
адваіта̄ді
бгакта-вр̣нда на̄че ґга̄т̣е ґга̄т̣е
пала̄йа
дуранта калі под̣ійа̄ бібгра̄т̣е',
    E'', E'',
    E'(Oh, all of you please go and see!) The Vaisnavas headed by Advaita Acarya are
dancing along the banks of the Ganga from one bathing ghat to the next! At such
a sight as this, the wicked personality Kali falls into great danger and thus
runs for his life.
7) In
what indescribable happiness did all living beings swim while Lord Gauracandra
was dancing? By seeing and hearing of such pastimes, the hearts of the atheists
break.
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'', E'',
    E'ki
sukhe bhāsilo jīva gorācānder nāṭe
dekhiyā
śuniyā pāṣaṇḍīr buka phāṭe', E'кі
сукхе бга̄сіло джı̄ва ґора̄ча̄ндер на̄т̣е
декхійа̄
ш́унійа̄ па̄шан̣д̣ı̄р бука пха̄т̣е',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 1: Nadiya Nagare Nitai Nece Nece Gayre
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Nadiya Nagare Nitai Nece Nece Gayre', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'জগন্নাথ-সুত মহাপ্রভু বিশ্বম্ভর
মায়াপুর-শশী নবদ্বীপ-সুধাকর', E'জগন্নাথ-সুত মহাপ্রভু বিশ্বম্ভর
মায়াপুর-শশী নবদ্বীপ-সুধাকর',
    E'Song
Name: Nadiya Nagare Nitai Nece Nece Gay Re
Official
Name: Sriman Mahaprabhur Sata-Nama Song 1
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ
(refrain)
nadīyā-nagare
nitāi nece'' nece'' gāy re', E'Сонґ
Наме: Надійа Наґаре Нітаі Нече Нече Ґай Ре
Оffічіал
Наме: Сріман Махапрабгур Сата-Нама Сонґ 1
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ
(реfраін)
надı̄йа̄-наґаре
ніта̄і нече'' нече'' ґа̄й ре',
    E'', E'',
    E'(Refrain:)
Oh! In the towns and villages of Nadiya, Lord Nityananda ecstatically dances
and sings these names of Sri Caitanya Mahaprabhu:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'শচী-সুত গৌরহরি নিমাই-সুন্দর
রাধা-ভাব-কান্তি-আচ্ছাদিত নটবর', E'শচী-সুত গৌরহরি নিমাই-সুন্দর
রাধা-ভাব-কান্তি-আচ্ছাদিত নটবর',
    E'jagannātha-suta
mahāprabhu viśvambhara
māyāpur-śaśī
navadvīpa-sudhākara', E'джаґанна̄тха-сута
маха̄прабгу віш́вамбгара
ма̄йа̄пур-ш́аш́ı̄
навадвı̄па-судга̄кара',
    E'', E'',
    E'Lord Caitanya is the beloved son of Jagannatha Misra. He is Mahaprabhu, the
great master, and maintainer of the whole world. He is the shining moon of
Mayapur, and the source of all nectar for the land of Navadvipa.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'নামানন্দ চপল বালক মাতৃ-ভক্ত
ব্রহ্মাণ্ড-বদন তর্কী কৌতুকানুরক্ত', E'নামানন্দ চপল বালক মাতৃ-ভক্ত
ব্রহ্মাণ্ড-বদন তর্কী কৌতুকানুরক্ত',
    E'śacī-suta
gaurahari nimāi-sundara
rādhā-bhāva-kānti-ācchādita
naṭabara', E'ш́ачı̄-сута
ґаурахарі німа̄і-сундара
ра̄дга̄-бга̄ва-ка̄нті-а̄ччха̄діта
нат̣абара',
    E'', E'',
    E'He is the beloved son of Saci Mata, and is Lord Hari with a fair golden
complexion. As He was born under a nim tree He was called Nimai-sundara
(beautiful Nimai). He is covered by the sentiment and luster of Srimati
Radharani, and He is the best of all dancers.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'বিদ্যার্থি-উড়ুপ চৌর-দ্বয়ের মোহন
তৈর্থিক-সর্বস্ব গ্রাম্য-বালিকা-ক্রীডন', E'বিদ্যার্থি-উড়ুপ চৌর-দ্বয়ের মোহন
তৈর্থিক-সর্বস্ব গ্রাম্য-বালিকা-ক্রীডন',
    E'nāmānanda
capala bālaka mātṛ-bhakta
brahmāṇḍa-vadana
tarkī kautukānurakta', E'на̄ма̄нанда
чапала ба̄лака ма̄тр̣-бгакта
брахма̄н̣д̣а-вадана
таркı̄ каутука̄нуракта',
    E'', E'',
    E'He becomes restless upon hearing the holy names of Lord Hari. In His boyhood
pastimes He is swift and agile, and is devoted to His mother. He displays the
entire universe within His mouth, is a great logician, and is fond of joking
and playing pranks.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'লক্ষ্মী-প্রতি বর-দাতা উদ্ধত বালক
শ্রী-শচীর পতি-পুত্র-শোক-নিবারক', E'লক্ষ্মী-প্রতি বর-দাতা উদ্ধত বালক
শ্রী-শচীর পতি-পুত্র-শোক-নিবারক',
    E'vidyārthi-uḍupa
caura-dvayera mohana
tairthika-sarvasva
grāmya-bālikā-krīḍana', E'відйа̄ртхі-уд̣упа
чаура-двайера мохана
таіртхіка-сарвасва
ґра̄мйа-ба̄ліка̄-крı̄д̣ана',
    E'', E'',
    E'He is the moon among scholarly students, and He bewildered two thieves who
tried to steal His jewels when He was a small child. He is the cynosure of all
philosophers, and He teased and joked with the village girls of Nadiya.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'লক্ষ্মী-পতি পূর্ব-দেশ-সর্ব-ক্লেশ-হর
দিগ্বিজয়ি-দর্প-হারী বিষ্নু-প্রিয়েশ্বর', E'লক্ষ্মী-পতি পূর্ব-দেশ-সর্ব-ক্লেশ-হর
দিগ্বিজয়ি-দর্প-হারী বিষ্নু-প্রিয়েশ্বর',
    E'lakṣmī-prati
bora-dātā uddhata bālaka
śrī-śacīra
pati-putra-śoka-nibāraka', E'лакшмı̄-праті
бора-да̄та̄ уддгата ба̄лака
ш́рı̄-ш́ачı̄ра
паті-путра-ш́ока-ніба̄рака',
    E'', E'',
    E'He is the giver of blessings to Laksmi-priya (His first wife). He is very
mischievous as a child, and is the dispeller of the grief Saci-mata felt after
losing her husband Jagannatha and first son Visvarupa.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'আর্য-ধর্ম-পাল পিতৃ-গয়া পিণ্ড-দাতা
পুরী-শিষ্য মধ্বাচার্য-সম্প্রদায়-পাতা', E'আর্য-ধর্ম-পাল পিতৃ-গয়া পিণ্ড-দাতা
পুরী-শিষ্য মধ্বাচার্য-সম্প্রদায়-পাতা',
    E'lakṣmī-pati
pūrva-deśa-sarva-kleśa-hara
digvijayi-darpa-hārī
viṣnu-priyeśwara', E'лакшмı̄-паті
пӯрва-деш́а-сарва-клеш́а-хара
діґвіджайі-дарпа-ха̄рı̄
вішну-прійеш́вара',
    E'', E'',
    E'He is the Lord and husband of Laksmi-priya. By His sankirtan movement He
removed all the distress of East Bengal. He eradicated the pride of the
conquering pandita named Kesava Kasmiri, and is the beloved Lord of Visnu-priya
(His second wife).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'কৃষ্ণ-নামোন্মত্ত কৃষ্ণ-তত্ত্ব-অধ্যাপক
নাম-সঙ্কীর্তন-যুগ-ধর্ম-প্রবর্তক', E'কৃষ্ণ-নামোন্মত্ত কৃষ্ণ-তত্ত্ব-অধ্যাপক
নাম-সঙ্কীর্তন-যুগ-ধর্ম-প্রবর্তক',
    E'ārya-dharma-pāla
pitṛ-gayā piṇḍa-dātā
purī-śiṣya
madhvācārya-sampradāya-pātā', E'а̄рйа-дгарма-па̄ла
пітр̣-ґайа̄ пін̣д̣а-да̄та̄
пурı̄-ш́ішйа
мадгва̄ча̄рйа-сампрада̄йа-па̄та̄',
    E'', E'',
    E'He is the preserver of sanatana-dharma, and the giver of the pinda oblation at
the holy town of Gaya after the disappearance of His father Jagannath Misra. He
became the disciple of Isvara Puri, and is the protector of the Madhvacarya
Sampradaya.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'অদ্বৈত-বান্ধব শ্রীনিবাস-গৃহ-ধন
নিত্যানন্দ-প্রান গদাধরের জীবন', E'অদ্বৈত-বান্ধব শ্রীনিবাস-গৃহ-ধন
নিত্যানন্দ-প্রান গদাধরের জীবন',
    E'kṛṣṇa-nāmonmatta
kṛṣṇa-tattva-adhyāpaka
nāma-sańkīrtana-yuga-dharma-pravartaka', E'кр̣шн̣а-на̄монматта
кр̣шн̣а-таттва-адгйа̄пака
на̄ма-саńкı̄ртана-йуґа-дгарма-правартака',
    E'', E'',
    E'He becomes madly intoxicated by tasting the holy name of Krsna, and is the
professor of the science of Krsna consciousness. Thus He inaugurated the
religion of the age, nama-sankirtan.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 10
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10', 10,
    E'অন্তর্দ্বীপ-শশধর সীমন্ত-বিজয়
গোদ্রুম-বিহারী মধ্যদ্বীপ-লীলাশ্রয়', E'অন্তর্দ্বীপ-শশধর সীমন্ত-বিজয়
গোদ্রুম-বিহারী মধ্যদ্বীপ-লীলাশ্রয়',
    E'adwaita-bāndhava
śrīnivāsa-gṛha-dhana
nityānanda-prāna
gadādharera jīvana', E'адваіта-ба̄ндгава
ш́рı̄ніва̄са-ґр̣ха-дгана
нітйа̄нанда-пра̄на
ґада̄дгарера джı̄вана',
    E'', E'',
    E'He is the friend of Advaita Acarya, the treasure of Srivasa Thakura''s home, the
life and soul of Nityananda Prabhu, and the very source of life for Gadadhara
Pandita.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 11
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11', 11,
    E'কোলদ্বীপ-পতি ঋতুদ্বীপ-মহেশ্বর
জহ্নু-মোদদ্রুম-রুদ্রদ্বীপের ঈশ্বর', E'কোলদ্বীপ-পতি ঋতুদ্বীপ-মহেশ্বর
জহ্নু-মোদদ্রুম-রুদ্রদ্বীপের ঈশ্বর',
    E'antardwīpa-śaśadhara
sīmanta-vijaya
godruma-bihārī
madhyadwīpa-līlāśraya', E'антардвı̄па-ш́аш́адгара
сı̄манта-віджайа
ґодрума-біха̄рı̄
мадгйадвı̄па-лı̄ла̄ш́райа',
    E'', E'',
    E'He is the moon of Antardvipa, and the triumph of Simantadvipa. He enjoys
wandering and frolicking on the island of Godruma, and is the shelter of
pastimes in Madhyadvipa.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 12
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '12', 12,
    E'নব-খণ্ড-রঙ্গনাথ জাহ্নবী-জীবন
জগাই-মাধাই-আদি দুর্বৃত্ত-তারণ', E'নব-খণ্ড-রঙ্গনাথ জাহ্নবী-জীবন
জগাই-মাধাই-আদি দুর্বৃত্ত-তারণ',
    E'koladwīpa-pati
ṛtudwīpa-maheśwara
jahnu-modadruma-rudradwīpera
īśwara', E'коладвı̄па-паті
р̣тудвı̄па-махеш́вара
джахну-модадрума-рудрадвı̄пера
ı̄ш́вара',
    E'', E'',
    E'He is the Lord of Koladvipa, the great controller of Ritudvipa, and the creator
of Jahnudvipa, Modadrumadvipa, and Rudradvipa.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 13
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '13', 13,
    E'নগর-কীর্তন-সিংহ কাজী-উদ্ধারণ
শুদ্ধ-নাম-প্রচারক ভক্তার্তি-হরণ', E'নগর-কীর্তন-সিংহ কাজী-উদ্ধারণ
শুদ্ধ-নাম-প্রচারক ভক্তার্তি-হরণ',
    E'nava-khaṇḍa-rańganātha
jāhnavī-jīvana
jagāi-mādhāi-ādi
durvṛtta-tāraṇa', E'нава-кхан̣д̣а-раńґана̄тха
джа̄хнавı̄-джı̄вана
джаґа̄і-ма̄дга̄і-а̄ді
дурвр̣тта-та̄ран̣а',
    E'', E'',
    E'He is thus the Supreme Lord of the nine islands of Navadvipa, which serves as the
stage for His wonderful pastimes. He is the life of the River Ganga, and the
deliverer of all sorts of rogues and rascals beginning with Jagai and Madhai.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 14
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '14', 14,
    E'নারায়নী-কৃপা-সিন্ধু জীবের নিয়ন্তা
অধম-পডুয়া-দণ্ডী ভক্ত-দোষ-হন্তা', E'নারায়নী-কৃপা-সিন্ধু জীবের নিয়ন্তা
অধম-পডুয়া-দণ্ডী ভক্ত-দোষ-হন্তা',
    E'nagara-kīrtana-siḿha
kājī-uddhāraṇa
śuddha-nāma-pracāraka
bhaktārti-haraṇa', E'наґара-кı̄ртана-сіḿха
ка̄джı̄-уддга̄ран̣а
ш́уддга-на̄ма-прача̄рака
бгакта̄рті-харан̣а',
    E'', E'',
    E'He is the lion of the village kirtanas, and the deliverer of Chand Kazi. He is
the preacher of the pure holy name, and the remover of the distresses of His
devotees.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 15
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '15', 15,
    E'শ্রী-কৃষ্ণ-চৈতন্য-চন্দ্র ভারতী-তারণ
পরিব্রজ-শিরোমণি উত্কল-পাবন', E'শ্রী-কৃষ্ণ-চৈতন্য-চন্দ্র ভারতী-তারণ
পরিব্রজ-শিরোমণি উত্কল-পাবন',
    E'nārāyanī-kṛpā-sindhu
jīvera niyantā
adhama-paḍuyā-daṇḍī
bhakta-doṣa-hantā', E'на̄ра̄йанı̄-кр̣па̄-сіндгу
джı̄вера нійанта̄
адгама-пад̣уйа̄-дан̣д̣ı̄
бгакта-доша-ханта̄',
    E'', E'',
    E'He is the ocean of mercy for Narayani (the mother of Srila Vrndavana dasa
Thakura), and is the regulator of all souls. He is the chastiser of the fallen
students who criticized His chanting of "gopi! gopi!", and is the
destroyer of the sins of His devotees.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 16
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '16', 16,
    E'অম্বু-লিঙ্গ-ভুবনেশ-কপোতেশ-পতি
খীর-চোর-গোপাল-দর্শন-সুখী যতি', E'অম্বু-লিঙ্গ-ভুবনেশ-কপোতেশ-পতি
খীর-চোর-গোপাল-দর্শন-সুখী যতি',
    E'śrī-kṛṣṇa-caitanya-candra
bhāratī-tāraṇa
parivraja-śiromaṇi
utkala-pāvana', E'ш́рı̄-кр̣шн̣а-чаітанйа-чандра
бга̄ратı̄-та̄ран̣а
парівраджа-ш́іроман̣і
уткала-па̄вана',
    E'', E'',
    E'He was initiated into sannyasa with the name of Sri Krsna Caitanya, and He is
beautiful like the moon. He delivered His sannyasa-guru Kesava Bharati, is
Himself the crest-jewel of all wandering renunciates, and is the savior of the
region of Orissa.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 17
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '17', 17,
    E'নির্দণ্ডি-সন্ন্যাসী সার্বভৌম-কৃপাময়
স্বানন্দ-আস্বাদানন্দী সর্ব-সুখাশ্রয়', E'নির্দণ্ডি-সন্ন্যাসী সার্বভৌম-কৃপাময়
স্বানন্দ-আস্বাদানন্দী সর্ব-সুখাশ্রয়',
    E'ambu-lińga-bhuvaneśa-kapoteśa-pati
khīr-cora-gopāla-darśana-sukhī
yati', E'амбу-ліńґа-бгуванеш́а-капотеш́а-паті
кхı̄р-чора-ґопа̄ла-дарш́ана-сукхı̄
йаті',
    E'', E'',
    E'He is the master of Lord Siva, who is known in three different Saiva tirthas as
Sambu-linga, Bhuvanesvara, and Kapotesvara (visited by Lord Caitanya on His way
to Jagannatha Puri). As a sannyasi He rejoiced at the sight of the Orissan
deities Ksira-cora Gopinatha and Saksi Gopala.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 18
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '18', 18,
    E'পুরট-সুন্দর বাসুদেব-ত্রান-কর্তা
রামানন্দ-সখা ভট্ট-কুল-ক্লেশ-হর্তা', E'পুরট-সুন্দর বাসুদেব-ত্রান-কর্তা
রামানন্দ-সখা ভট্ট-কুল-ক্লেশ-হর্তা',
    E'nirdaṇḍi-sannyāsī
sārvabhauma-kṛpāmoya
swānanda-āswādānandī
sarva-sukhāśroya', E'нірдан̣д̣і-саннйа̄сı̄
са̄рвабгаума-кр̣па̄мойа
сва̄нанда-а̄сва̄да̄нандı̄
сарва-сукха̄ш́ройа',
    E'', E'',
    E'He became a sannyasi without a danda (due to Lord Nityananda''s breaking it in
three parts and throwing it in the Bhargi River), and is full of mercy for
Sarvabhauma Bhattacarya. He is ecstatic by tasting the bliss of Himself in the
form of Krsna, and He is the resting place of all universal happiness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 19
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '19', 19,
    E'বৌদ্ধ-জৈন-মায়াবাদি-কুতর্ক-খণ্ডন
দক্ষিন-পাবন ভক্তি-গ্রন্থ-উদ্ধারণ', E'বৌদ্ধ-জৈন-মায়াবাদি-কুতর্ক-খণ্ডন
দক্ষিন-পাবন ভক্তি-গ্রন্থ-উদ্ধারণ',
    E'puraṭa-sundara
vāsudeva-trāna-kartā
rāmānanda-sakhā
bhaṭṭa-kula-kleśa-hartā', E'пурат̣а-сундара
ва̄судева-тра̄на-карта̄
ра̄ма̄нанда-сакха̄
бгат̣т̣а-кула-клеш́а-харта̄',
    E'', E'',
    E'He is beautiful like molten gold, and He delivered the leper Vasudeva. He is
the intimate friend of Ramananda Ray, and the remover of all miseries from the
family of Vyenkata Bhatta.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 20
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '20', 20,
    E'আলাল-দর্শনানন্দী রথাগ্র-নর্তক
গজপতি-ত্রান দেবানন্দ-উদ্ধারক', E'আলাল-দর্শনানন্দী রথাগ্র-নর্তক
গজপতি-ত্রান দেবানন্দ-উদ্ধারক',
    E'bauddha-jain-māyāvādi-kutarka-khaṇḍana
dakṣina-pāvana
bhakti-grantha-uddhāraṇa', E'бауддга-джаін-ма̄йа̄ва̄ді-кутарка-кхан̣д̣ана
дакшіна-па̄вана
бгакті-ґрантха-уддга̄ран̣а',
    E'', E'',
    E'He is the refuter of the atheistic arguments of the Buddhists, Jains, and
Mayavadis. He is the savior of South India, and He has brought to light the two
devotional literatures, Krsna-karnamrta and Brahma-samhita.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 21
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '21', 21,
    E'কুলিয়া-প্রকাশে দুষ্ট পডুয়ার ত্রান
রূপ-সনান্তন-বন্ধু সর্ব-জীব-প্রান', E'কুলিয়া-প্রকাশে দুষ্ট পডুয়ার ত্রান
রূপ-সনান্তন-বন্ধু সর্ব-জীব-প্রান',
    E'ālāla-darśanānandī
rathāgra-nartaka
gajapati-trāna
devānanda-uddhāraka', E'а̄ла̄ла-дарш́ана̄нандı̄
ратха̄ґра-нартака
ґаджапаті-тра̄на
дева̄нанда-уддга̄рака',
    E'', E'',
    E'He became ecstatic at the sight of the deity Alalanatha, and He danced in front
of the Jagannatha cart during the Ratha-yatra festival. He delivered Gajapati
Pratapa-Rudra, and was the savior of Devananda Pandita.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 22
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '22', 22,
    E'বৃন্দাবনানন্দ-মূর্তি বলভদ্র-সঙ্গী
যবন-উদ্ধারী ভট্ট-বল্লভের রঙ্গী', E'বৃন্দাবনানন্দ-মূর্তি বলভদ্র-সঙ্গী
যবন-উদ্ধারী ভট্ট-বল্লভের রঙ্গী',
    E'kuliyā-prakāśe
duṣṭa paḍuyāra trāna
rūpa-sanāntana-bandhu
sarva-jīva-prāna', E'кулійа̄-прака̄ш́е
душт̣а пад̣уйа̄ра тра̄на
рӯпа-сана̄нтана-бандгу
сарва-джı̄ва-пра̄на',
    E'', E'',
    E'By His appearance at Kuliya He delivered the ill-behaved student community
there. He is the friend of Rupa and Sanatana Goswami, and the life of all
souls.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 23
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '23', 23,
    E'কাশীবাসি-সন্ন্যাসী-উদ্ধারী প্রেম-দাতা
মর্কট-বৈরাগী-দণ্ডী আ-চণ্ডাল-ত্রাতা', E'কাশীবাসি-সন্ন্যাসী-উদ্ধারী প্রেম-দাতা
মর্কট-বৈরাগী-দণ্ডী আ-চণ্ডাল-ত্রাতা',
    E'bṛndābanānanda-mūrti
balabhadra-sańgī
yavana-uddhārī
bhaṭṭa-ballabhera rańgī', E'бр̣нда̄бана̄нанда-мӯрті
балабгадра-саńґı̄
йавана-уддга̄рı̄
бгат̣т̣а-баллабгера раńґı̄',
    E'', E'',
    E'He is the personification of bliss in the transcendental realm of Vrndavana,
and He is the companion and friend of Balabhadra Bhattacarya. On His return
from Vrndavana He delivered many Mohammedans, and He is very fond of intimate
exchanges with Vallabha Bhatta.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 24
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '24', 24,
    E'ভক্তের গৌরব-কারী ভক্ত-প্রান-ধন
হরিদাস-রঘুনাথ-স্বরূপ-জীবন', E'ভক্তের গৌরব-কারী ভক্ত-প্রান-ধন
হরিদাস-রঘুনাথ-স্বরূপ-জীবন',
    E'kāśībāsi-sannyāsī-uddhārī
prema-dātā
markaṭa-vairāgī-daṇḍī
ā-caṇḍāla-trātā', E'ка̄ш́ı̄ба̄сі-саннйа̄сı̄-уддга̄рı̄
према-да̄та̄
маркат̣а-ваіра̄ґı̄-дан̣д̣ı̄
а̄-чан̣д̣а̄ла-тра̄та̄',
    E'', E'',
    E'He delivered the Mayavadi sannyasis of Kasi, and He is the bestower of love of
God. He is the chastiser of the false renunciates (called markata-vairagis for
being like monkeys), and He is the savior of everyone down to the lowest class
of men.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 25
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '25', 25,
    E'গোদ্রুম-পতি গোর নিতাই-জীবন
বৃন্দাবন-ভাব-বিভোর অদ্বৈতের ধন', E'গোদ্রুম-পতি গোর নিতাই-জীবন
বৃন্দাবন-ভাব-বিভোর অদ্বৈতের ধন',
    E'bhaktera
gaurava-kārī bhakta-prāna-dhana
haridāsa-raghunātha-swarūpa-jīvana', E'бгактера
ґаурава-ка̄рı̄ бгакта-пра̄на-дгана
харіда̄са-раґгуна̄тха-сварӯпа-джı̄вана',
    E'', E'',
    E'He is the glorifier of His devotees, and is the treasured wealth of their
lives. He is the very life of such devotees as Haridasa Thakura, Raghunatha
Dasa Goswami, and Svarupa Damodara.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 26
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '26', 26,
    E'গদাধর-প্রাণ, স্রীবাস-শরণ,
কৃষ্ণ-ভক্ত-মানস-চোর কলি-যুগ-পাবন', E'গদাধর-প্রাণ, স্রীবাস-শরণ,
কৃষ্ণ-ভক্ত-মানস-চোর কলি-যুগ-পাবন',
    E'godruma-pati gora nitāi-jīvana
vṛndāvana-bhāva-vibhora advaitera dhana', E'ґодрума-паті ґора ніта̄і-джı̄вана
вр̣нда̄вана-бга̄ва-вібгора адваітера дгана',
    E'', E'',
    E'He is the Supreme Master of the island of Godruma. He possesses a golden
complexion and is the very life of Srila Nityananda Prabhu. He constantly
remains overwhelmed with the ecstatic moods of Vrndavana, and is the supreme
treasure of Srila Advaita Acarya.
26) He is the life-breath of Srila Gadadhara Pandita, the shelter of Srila
Srivasa Pandita, the thief of the hearts of all the devotees of Lord Krsna, and
the supreme purifier of the degraded age of Kali.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 27
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '27', 27,
    E'নদীয়া-নগরে নিতাই নেচে'' নেচে'' গায় রে
ভকতিবিনোদ তা''র পড়ে রঙ্গ-পায় রে', E'নদীয়া-নগরে নিতাই নেচে'' নেচে'' গায় রে
ভকতিবিনোদ তা''র পড়ে রঙ্গ-পায় রে',
    E'gadādhara-prāṇa,
srīvāsa-śaraṇa,
kṛṣṇa-bhakta-mānasa-cora kali-yuga-pāvana', E'ґада̄дгара-пра̄н̣а,
срı̄ва̄са-ш́аран̣а,
кр̣шн̣а-бгакта-ма̄наса-чора калі-йуґа-па̄вана',
    E'', E'',
    E'Oh! In the towns and villages of Nadiya, Lord Nityananda dances and dances
ecstatically while singing these divine names, and Bhaktivinoda falls down at
His reddish lotus feet. Oh!
REMARKS/EXTRA
INFORMATION:
No
Remarks/Extra Information for this song!
CREDITS:
Thank
you to Dennis Prabhu for providing the link and request on the Krsna Kirtana
forum.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 28
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '28', 28,
    E'', E'',
    E'nadīyā-nagare
nitāi nece'' nece'' gāy re
bhakativinoda
tā''r poḍe rańga-pāy re', E'надı̄йа̄-наґаре
ніта̄і нече'' нече'' ґа̄й ре
бгакатівінода
та̄''р под̣е раńґа-па̄й ре',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 2: Jaya Godruma Pati Gora
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Jaya Godruma Pati Gora', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'জয়
গোদ্রুম-পতি গোরা
নিতাই-জীবন,
অদ্বৈতের ধন,
বৃন্দাবন-ভাব-বিভোরা
গদাধর-প্রান,
শ্রীবাস-শরণ,
কৃষ্ণ-ভক্ত-মানস-চোরা', E'জয়
গোদ্রুম-পতি গোরা
নিতাই-জীবন,
অদ্বৈতের ধন,
বৃন্দাবন-ভাব-বিভোরা
গদাধর-প্রান,
শ্রীবাস-শরণ,
কৃষ্ণ-ভক্ত-মানস-চোরা',
    E'Song
Name: Jaya Godruma Pati Gora
Official
Name: Sriman Mahaprabhur Sata-Nama Song 2
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Джайа Ґодрума Паті Ґора
Оffічіал
Наме: Сріман Махапрабгур Сата-Нама Сонґ 2
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'All
glories to Lord Gaura, the master of Godruma! He is the very life of Lord
Nityananda, the treasure of Sri Advaita, and He is always overwhelmed with the
ecstatic moods of Vrndavana. He is the life-breath of Gadadhara Pandita, the
shelter of Srivasa Pandita, and the thief of the hearts of all the devotees of
Lord Krsna.
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'', E'',
    E'jaya
godruma-pati gorā
nitāi-jīvana,
advaitera dhana,
vṛndāvana-bhāva-vibhorā
gadādhara-prāna,
śrīvāsa-śaraṇa,
kṛṣṇa-bhakta-mānasa-corā', E'джайа
ґодрума-паті ґора̄
ніта̄і-джı̄вана,
адваітера дгана,
вр̣нда̄вана-бга̄ва-вібгора̄
ґада̄дгара-пра̄на,
ш́рı̄ва̄са-ш́аран̣а,
кр̣шн̣а-бгакта-ма̄наса-чора̄',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 3: Kaliyuga Pavana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Kaliyuga Pavana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'কলি-যুগ-পাবন
বিশ্বম্ভর
গৌড-চিত্ত-গগণ-শশধর
কীর্তন-বিধাতা,
পর-প্রেম-দাতা,
শচী-সুত
পুরট-সুন্দর', E'কলি-যুগ-পাবন
বিশ্বম্ভর
গৌড-চিত্ত-গগণ-শশধর
কীর্তন-বিধাতা,
পর-প্রেম-দাতা,
শচী-সুত
পুরট-সুন্দর',
    E'Song
Name: Kali Yuga Pavana Visvambhara
Official
Name: Sriman Mahaprabhur Sata-Nama Song 3
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Калі Йуґа Павана Вісвамбгара
Оffічіал
Наме: Сріман Махапрабгур Сата-Нама Сонґ 3
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Lord Visvambhara is the savior of the age of Kali, the full moon in the sky of
the hearts of Bengal, the inaugurator of congregational chanting, the bestower
of transcendental ecstatic love, the beloved son of Mother Saci, and He has a
pure golden complexion.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'', E'',
    E'kali-yuga-pāvana
viśvambhara
gauḍa-citta-gagaṇa-śaśadhara
kīrtana-vidhātā,
para-prema-dātā,
śacī-suta
puraṭa-sundara', E'калі-йуґа-па̄вана
віш́вамбгара
ґауд̣а-чітта-ґаґан̣а-ш́аш́адгара
кı̄ртана-відга̄та̄,
пара-према-да̄та̄,
ш́ачı̄-сута
пурат̣а-сундара',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 4: Krsna Caitanya Advaita Prabhu
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Krsna Caitanya Advaita Prabhu', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'কৃষ্ণ-চৈতন্য
অদ্বৈত প্রভু নিত্যানন্দ
গদাধর
শ্রীনিবাস মুরারি
মুকুন্দ
স্বরূপ-রূপ-সনাতন-পুরী-রামানন্দ', E'কৃষ্ণ-চৈতন্য
অদ্বৈত প্রভু নিত্যানন্দ
গদাধর
শ্রীনিবাস মুরারি
মুকুন্দ
স্বরূপ-রূপ-সনাতন-পুরী-রামানন্দ',
    E'Song
Name: Krsna Caitanya Advaita Prabhu
Official
Name: Sriman Mahaprabhur Sata-Nama Song 4
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Крсна Чаітанйа Адваіта Прабгу
Оffічіал
Наме: Сріман Махапрабгур Сата-Нама Сонґ 4
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'(Please chant these holy names of the Lord and His personal associates):
Krsna-Caitanya, Advaita, Prabhu Nityananda, Gadadhara, Srinivasa, Murari,
Mukunda, Svarupa, Rupa, Sanatana, Puri, and Ramananda.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'', E'',
    E'kṛṣṇa-caitanya
advaita prabhu nityānanda
gadādhara
śrīnivāsa murāri mukunda
svarūpa-rūpa-sanātana-purī-rāmānanda', E'кр̣шн̣а-чаітанйа
адваіта прабгу нітйа̄нанда
ґада̄дгара
ш́рı̄ніва̄са мура̄рі мукунда
сварӯпа-рӯпа-сана̄тана-пурı̄-ра̄ма̄нанда',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 6, Song 1: Nagare Nagare Gora Gay
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Nagare Nagare Gora Gay', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'যশোমতী-স্তন্য-পায়ী শ্রী-নন্দ-নন্দন
ইন্দ্র-নীল-মণি ব্রজ-জনের জীবন', E'যশোমতী-স্তন্য-পায়ী শ্রী-নন্দ-নন্দন
ইন্দ্র-নীল-মণি ব্রজ-জনের জীবন',
    E'Song
Name: Nagare Nagare Gora Gay
Official
Name: Sri Krsnaer Vimsottara-Sata-Nama Song 1
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ
(Refrain:)
nagare
nagare gorā gāy', E'Сонґ
Наме: Наґаре Наґаре Ґора Ґай
Оffічіал
Наме: Срі Крснаер Вімсоттара-Сата-Нама Сонґ 1
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ
(Реfраін:)
наґаре
наґаре ґора̄ ґа̄й',
    E'', E'',
    E'Refrain:
From village to village Lord Gaura sings these names of Sri Krsna:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'শ্রী-গোকুল-নিশাচরী-পূতনা-ঘাতন
দুষ্ট-তৃনাবর্ত-হন্তা শকট-ভঞ্জন', E'শ্রী-গোকুল-নিশাচরী-পূতনা-ঘাতন
দুষ্ট-তৃনাবর্ত-হন্তা শকট-ভঞ্জন',
    E'yaśomatī-stanya-pāyī
śrī-nanda-nandana
indra-nīla-maṇi
braja-janera jīvana', E'йаш́оматı̄-станйа-па̄йı̄
ш́рı̄-нанда-нандана
індра-нı̄ла-ман̣і
браджа-джанера джı̄вана',
    E'', E'',
    E'Krsna is the baby who feeds on the breast milk of Mother Yasoda. He is the son
of Maharaja Nanda, dark blue like an indra-nila gem (sapphire), and the life of
the residents of Vraja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'নবনীত-চোর দধি-হরণ-কুশল
যমল-অর্জুন-ভঞ্জী গোবিন্দ গোপাল', E'নবনীত-চোর দধি-হরণ-কুশল
যমল-অর্জুন-ভঞ্জী গোবিন্দ গোপাল',
    E'śrī-gokula-niśācarī-pūtanā-ghātana
duṣṭa-tṛnāvarta-hantā
śakaṭa-bhañjana', E'ш́рı̄-ґокула-ніш́а̄чарı̄-пӯтана̄-ґга̄тана
душт̣а-тр̣на̄варта-ханта̄
ш́акат̣а-бган̃джана',
    E'', E'',
    E'He destroyed the witch of Gokula named Putana, He killed the wicked whirlwind
demon Trnavarta, and He broke the cart in which the demon Sakatasura was
hiding.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'দামোদর বৃন্দাবন-গো-বত্স-রাখাল
বত্সাসুরান্তক হরি নিজ-জন-পাল', E'দামোদর বৃন্দাবন-গো-বত্স-রাখাল
বত্সাসুরান্তক হরি নিজ-জন-পাল',
    E'navanīta-cora
dadhi-haraṇa-kuśala
yamala-arjuna-bhañjī
govinda gopāla', E'наванı̄та-чора
дадгі-харан̣а-куш́ала
йамала-арджуна-бган̃джı̄
ґовінда ґопа̄ла',
    E'', E'',
    E'He likes to steal butter, and is an expert thief of yogurt. He broke the two
arjuna trees, He is a cowherd boy who always gives pleasure to the cows, and He
is the protector of the cows.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'বক-শত্রু অঘ-হন্তা ব্রহ্ম-বিমোহন
ধেনুক-নাশন কৃষ্ণ কালিয়-দমন', E'বক-শত্রু অঘ-হন্তা ব্রহ্ম-বিমোহন
ধেনুক-নাশন কৃষ্ণ কালিয়-দমন',
    E'dāmodara
bṛndābana-go-vatsa-rākhāla
vatsāsurāntaka
hari nija-jana-pāla', E'да̄модара
бр̣нда̄бана-ґо-ватса-ра̄кха̄ла
ватса̄сура̄нтака
харі ніджа-джана-па̄ла',
    E'', E'',
    E'He is so naughty that His mother bound Him around the waist with ropes, and He
is the keeper of the cows and calves of Vrndavana. He is the destroyer of the
calf-demon Vatsasura, He is the remover of all evils, and is the protector of
His devotees.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'পীতাম্বর শিখি-পিচ্ছ-ধারী বেনু-ধর
ভাণ্ডীর-কানন-লীলা দাবানল-হর', E'পীতাম্বর শিখি-পিচ্ছ-ধারী বেনু-ধর
ভাণ্ডীর-কানন-লীলা দাবানল-হর',
    E'baka-śatru
agha-hantā brahma-vimohana
dhenuka-nāśana
kṛṣṇa kāliya-damana', E'бака-ш́атру
аґга-ханта̄ брахма-вімохана
дгенука-на̄ш́ана
кр̣шн̣а ка̄лійа-дамана',
    E'', E'',
    E'He is the enemy of the stork-demon Bakasura, the slayer of the snake-demon
Aghasura, the One who bewilders Lord Brahma, the destroyer of the donkey-demon
Dhenukasura, He is all-attractive, and the One who subdues Kaliya serpent.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'নটবর গুহাচর শরত-বিহারী
বল্লবী-বল্লভ দেব গোপী-বস্ত্র-হারী', E'নটবর গুহাচর শরত-বিহারী
বল্লবী-বল্লভ দেব গোপী-বস্ত্র-হারী',
    E'pītāmbara
śikhi-piccha-dhārī venu-dhara
bhāṇḍīra-kānana-līlā
dāvānala-hara', E'пı̄та̄мбара
ш́ікхі-піччха-дга̄рı̄ вену-дгара
бга̄н̣д̣ı̄ра-ка̄нана-лı̄ла̄
да̄ва̄нала-хара',
    E'', E'',
    E'He dresses in yellow silk cloth, wears peacock feathers on His head, and He
always holds a flute. He performs pastimes in the Bhandira forest, and He
swallowed a forest fire in order to save the inhabitants of Vraja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'যজ্ঞ-পত্নী-গণ-প্রতি করুনার সিন্ধু
গোবর্ধন-ধৃক মাধব ব্রজ-বাসী-বন্ধু', E'যজ্ঞ-পত্নী-গণ-প্রতি করুনার সিন্ধু
গোবর্ধন-ধৃক মাধব ব্রজ-বাসী-বন্ধু',
    E'naṭabara
guhācara śarata-bihārī
vallabī-vallabha
deva gopī-vastra-hārī', E'нат̣абара
ґуха̄чара ш́арата-біха̄рı̄
валлабı̄-валлабга
дева ґопı̄-вастра-ха̄рı̄',
    E'', E'',
    E'He is the best of dancers, He wanders in the caves of Govardhana Hill, and He
enjoys various amorous pastimes in the autumn season. He is the lover of the
young cowherd maidens, the Supreme Lord of all, and the stealer of the gopis''
garments.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'ইন্দ্র-দর্প-হারী নন্দ-রক্ষিতা মুকুন্দ
শ্রী-গোপী-বল্লভ রস-ক্রীড পূর্নানন্দ', E'ইন্দ্র-দর্প-হারী নন্দ-রক্ষিতা মুকুন্দ
শ্রী-গোপী-বল্লভ রস-ক্রীড পূর্নানন্দ',
    E'yajña-patnī-gaṇa-prati
karunāra sindhu
govardhana-dhṛk
mādhava braja-bāsī-bandhu', E'йаджн̃а-патнı̄-ґан̣а-праті
каруна̄ра сіндгу
ґовардгана-дгр̣к
ма̄дгава браджа-ба̄сı̄-бандгу',
    E'', E'',
    E'He is the ocean of mercy for the wives of the sacrificial brahmanas, He is the
holder of Govardhana Hill, the husband of the goddess of fortune, and the dear
most friend of the inhabitants of Vraja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 10
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10', 10,
    E'শ্রী-রাধা-বল্লভ রাধা-মাধব সুন্দর
ললিতা-বিশাখা-আদি সখী-প্রানেশ্বর', E'শ্রী-রাধা-বল্লভ রাধা-মাধব সুন্দর
ললিতা-বিশাখা-আদি সখী-প্রানেশ্বর',
    E'indra-darpa-hārī
nanda-rakṣitā mukunda
śrī-gopī-vallabha
rasa-krīḍa pūrnānanda', E'індра-дарпа-ха̄рı̄
нанда-ракшіта̄ мукунда
ш́рı̄-ґопı̄-валлабга
раса-крı̄д̣а пӯрна̄нанда',
    E'', E'',
    E'He broke Indra''s pride, and is the protector of His father, Nanda Maharaja. He
is the giver of liberation, the lover of the cowherd maidens of Vraja, the
enjoyer of the rasa dance, and the reservoir of fully complete pleasure.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 11
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11', 11,
    E'নব-জলধর-কান্তি মদন-মোহন
বন-মালী স্মের-মুখ গোপী-প্রান-ধন', E'নব-জলধর-কান্তি মদন-মোহন
বন-মালী স্মের-মুখ গোপী-প্রান-ধন',
    E'śrī-rādhā-vallabha
rādhā-mādhava sundara
lalitā-viśākhā-ādi
sakhī-prāneśwara', E'ш́рı̄-ра̄дга̄-валлабга
ра̄дга̄-ма̄дгава сундара
лаліта̄-віш́а̄кха̄-а̄ді
сакхı̄-пра̄неш́вара',
    E'', E'',
    E'He is the lover of Srimati Radharani, the very springtime of Her life, and is
very handsome. He is the Lord of the lives of all the sakhis of Vrndavana,
headed by Lalita and Visakha.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 12
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '12', 12,
    E'ত্রি-ভঙ্গী মুরলী-ধর যমুনা-নাগর
রাধা-কুণ্ড-রঙ্গ-নেতা রসের সাগর', E'ত্রি-ভঙ্গী মুরলী-ধর যমুনা-নাগর
রাধা-কুণ্ড-রঙ্গ-নেতা রসের সাগর',
    E'nava-jaladhara-kānti
madana-mohana
vana-mālī
smera-mukha gopī-prāna-dhana', E'нава-джаладгара-ка̄нті
мадана-мохана
вана-ма̄лı̄
смера-мукха ґопı̄-пра̄на-дгана',
    E'', E'',
    E'He possesses the lovely complexion of a fresh rain cloud, He is the One who
bewilders Cupid, and is always garlanded with fresh forest flowers. His face is
full of sweet smiles and laughter, and He is the wealth of the lives of all the
young cowherd maidens in Vraja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 13
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '13', 13,
    E'চন্দ্রাবলী-প্রান-নাথ কৌতুকাভিলাষী
রাধা-মান-সুলম্পট মিলন-প্রয়াসী', E'চন্দ্রাবলী-প্রান-নাথ কৌতুকাভিলাষী
রাধা-মান-সুলম্পট মিলন-প্রয়াসী',
    E'tri-bhańgī
muralī-dhara jamunā-nāgara
rādhā-kuṇḍa-rańga-netā
rasera sāgara', E'трі-бгаńґı̄
муралı̄-дгара джамуна̄-на̄ґара
ра̄дга̄-кун̣д̣а-раńґа-нета̄
расера са̄ґара',
    E'', E'',
    E'He possesses a beautiful three-fold bending form, and holds a flute known as
murali. He is the lover of the Yamuna river, the director of all the amorous
love-sports at Radha Kunda, and He is the ocean of sweet devotional mellows.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 14
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '14', 14,
    E'মানস-গঙ্গার দানী প্রসূন-তস্কর
গোপী-সহ হঠ-কারী ব্রজ-বনেশ্বর', E'মানস-গঙ্গার দানী প্রসূন-তস্কর
গোপী-সহ হঠ-কারী ব্রজ-বনেশ্বর',
    E'candrāvalī-prāna-nātha
kautukābhilāṣī
rādhā-māna-sulampaṭa
milana-prayāsī', E'чандра̄валı̄-пра̄на-на̄тха
каутука̄бгіла̄шı̄
ра̄дга̄-ма̄на-сулампат̣а
мілана-прайа̄сı̄',
    E'', E'',
    E'He is the Lord of the life of Candravali, and He is desirous of joking and
playing pranks. He is very anxious to enjoy the moods of His beloved Radhika''s
feigned sulking, and He always endeavors to meet with Her.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 15
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '15', 15,
    E'গোকুল-সম্পদ গোপ-দুঃখ-নিবারণ
দুর্মদ-দমন ভক্ত-সন্তাপ-হরণ', E'গোকুল-সম্পদ গোপ-দুঃখ-নিবারণ
দুর্মদ-দমন ভক্ত-সন্তাপ-হরণ',
    E'mānasa-gańgāra
dānī prasūna-taskara
gopī-saha
haṭha-kārī braja-baneśwara', E'ма̄наса-ґаńґа̄ра
да̄нı̄ прасӯна-таскара
ґопı̄-саха
хат̣ха-ка̄рı̄ браджа-банеш́вара',
    E'', E'',
    E'He is the giver of the Manasa Ganga lake to the inhabitants of Vrndavana, and a
thief of flower blossoms. He acts very outrageously with the maidens of
Vrndavana, not caring for social restrictions, and He is the Lord of the
Vraja-mandala forests.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 16
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '16', 16,
    E'সুদর্শন-মোচন শ্রী-শঙ্খ-চূড়ান্তক
রামানুজ শ্যাম-চান্দ মুরলী-বাদক', E'সুদর্শন-মোচন শ্রী-শঙ্খ-চূড়ান্তক
রামানুজ শ্যাম-চান্দ মুরলী-বাদক',
    E'gokula-sampad
gopa-duḥkha-nivāraṇa
durmada-damana
bhakta-santāpa-haraṇa', E'ґокула-сампад
ґопа-дух̣кха-ніва̄ран̣а
дурмада-дамана
бгакта-санта̄па-харан̣а',
    E'', E'',
    E'He is the wealth of Gokula, and He protects the cowherd boys from all miseries.
He curbs all foolish pride and removes all distress from His devotees.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 17
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '17', 17,
    E'গোপী-গীত-শ্রোতা মধু-সূদন মুরারি
অরিষ্ট-ঘাতক রাধা-কুণ্ডাদি-বিহারী', E'গোপী-গীত-শ্রোতা মধু-সূদন মুরারি
অরিষ্ট-ঘাতক রাধা-কুণ্ডাদি-বিহারী',
    E'sudarśana-mocana
śrī-śańkha-cūḍāntaka
rāmānuja
śyāma-cānda muralī-vādaka', E'сударш́ана-мочана
ш́рı̄-ш́аńкха-чӯд̣а̄нтака
ра̄ма̄нуджа
ш́йа̄ма-ча̄нда муралı̄-ва̄дака',
    E'', E'',
    E'He is the liberator of the demigod Sudarsana, and is the destroyer of the demon
Sankhacuda. He is the younger brother of Lord Baladeva (Rama), He is the
beautiful dark moon of Vrndavana, and the player of the murali flute.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 18
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '18', 18,
    E'ব্যোমান্তক পদ্ম-নেত্র কেশি-নিসূদন
রঙ্গ-ক্রীড কংস-হন্তা মল্ল-প্রহরণ', E'ব্যোমান্তক পদ্ম-নেত্র কেশি-নিসূদন
রঙ্গ-ক্রীড কংস-হন্তা মল্ল-প্রহরণ',
    E'gopī-gīta-śrotā
madhu-sūdana murāri
ariṣṭa-ghātaka
rādhā-kuṇḍādi-bihārī', E'ґопı̄-ґı̄та-ш́рота̄
мадгу-сӯдана мура̄рі
арішт̣а-ґга̄така
ра̄дга̄-кун̣д̣а̄ді-біха̄рı̄',
    E'', E'',
    E'He listens to the devotional songs of the gopis, and is the slayer of the demon
Madhu. He is the enemy of the demon Mura, the killer of the bull-demon
Aristasura, and He regularly enjoys amorous sports at Radha Kunda and other
places in Vraja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 19
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '19', 19,
    E'বসুদেব-সুত বৃষ্ণৈ-বংশ-কীর্তি-ধ্বজ
দীন-নাথ মথুরেশ দেবকী-গর্ভ-জ', E'বসুদেব-সুত বৃষ্ণৈ-বংশ-কীর্তি-ধ্বজ
দীন-নাথ মথুরেশ দেবকী-গর্ভ-জ',
    E'vyomāntaka
padma-netra keśi-nisūdana
rańga-krīḍa
kaḿsa-hantā malla-praharaṇa', E'вйома̄нтака
падма-нетра кеш́і-нісӯдана
раńґа-крı̄д̣а
каḿса-ханта̄ малла-прахаран̣а',
    E'', E'',
    E'He is the destroyer of the sky-demon Vyomasura, His eyes are shaped like lotus
petals, and He is the killer of the horse-demon Kesi. He is fond of frolicsome
pastimes, is the slayer of King Kamsa, and is the conqueror of Kamsa''s
wrestlers named Canura and Mustika.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 20
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '20', 20,
    E'কুব্জা-কৃপাময় বিষ্নু শৌরি নারায়ন
দ্বারকেশ নরক-ঘ্ন শ্রী-যদু-নন্দন', E'কুব্জা-কৃপাময় বিষ্নু শৌরি নারায়ন
দ্বারকেশ নরক-ঘ্ন শ্রী-যদু-নন্দন',
    E'vasudeva-suta
vṛṣṇai-vaḿśa-kīrti-dhvaja
dīna-nātha
mathureśa devakī-garbha-ja', E'васудева-сута
вр̣шн̣аі-ваḿш́а-кı̄рті-дгваджа
дı̄на-на̄тха
матхуреш́а девакı̄-ґарбга-джа',
    E'', E'',
    E'He is the beloved son of Vasudeva, and the emblem of fame for the Vrsni
dynasty. The Lord of the fallen souls, He is the Monarch of Mathura, and He
appears to have taken birth from the womb of Devaki.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 21
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '21', 21,
    E'শ্রী-রুক্মিনী-কান্ত সত্যা-পতি সুর-পাল
পাণ্ডব-বান্ধব শিশুপালাদির কাল', E'শ্রী-রুক্মিনী-কান্ত সত্যা-পতি সুর-পাল
পাণ্ডব-বান্ধব শিশুপালাদির কাল',
    E'kubjā-kṛpāmoya
viṣnu śauri nārāyana
dwārakeśa
naraka-ghna śrī-yadu-nandana', E'кубджа̄-кр̣па̄мойа
вішну ш́аурі на̄ра̄йана
два̄ракеш́а
нарака-ґгна ш́рı̄-йаду-нандана',
    E'', E'',
    E'He is full of mercy for the hunchbacked girl Kubja. He is the maintainer of the
entire creation, the son of Vasudeva, the refuge of all souls, the Lord of
Dvaraka, the slayer of the demon Narakasura, and the beloved descendant of the
Yadu dynasty.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 22
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '22', 22,
    E'জগদীশ জনার্দন কেশবার্ত-ত্রান
সর্ব-অবতার-বীজ বিশ্বের নিদান', E'জগদীশ জনার্দন কেশবার্ত-ত্রান
সর্ব-অবতার-বীজ বিশ্বের নিদান',
    E'śrī-rukminī-kānta
satyā-pati sura-pāla
pāṇḍava-bāndhava
śiśupālādira kāla', E'ш́рı̄-рукмінı̄-ка̄нта
сатйа̄-паті сура-па̄ла
па̄н̣д̣ава-ба̄ндгава
ш́іш́упа̄ла̄діра ка̄ла',
    E'', E'',
    E'He is the lover of Rukmini, the husband of Satya, the protecter of the godly,
the beloved friend of the five Pandava brothers, and the cause of death for
Sisupala and other demonic kings.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 23
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '23', 23,
    E'মায়েশ্বর যোগেশ্বর ব্রহ্ম-তেজাধার
সর্বাত্মার আত্মা প্রভু প্রকৃতির পার', E'মায়েশ্বর যোগেশ্বর ব্রহ্ম-তেজাধার
সর্বাত্মার আত্মা প্রভু প্রকৃতির পার',
    E'jagadīśa
janārdana keśavārta-trāna
sarva-avatāra-bīja
viśvera nidāna', E'джаґадı̄ш́а
джана̄рдана кеш́ава̄рта-тра̄на
сарва-авата̄ра-бı̄джа
віш́вера ніда̄на',
    E'', E'',
    E'He is the Lord of the universe, the maintainer of all living beings, the
possessor of beautiful hair, and the deliverer from all misery. He is the
primordial seed of all His various incarnations, and is the origin of all
universes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 24
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '24', 24,
    E'পতিত-পাবন জগন্নাথ সর্বেশ্বর
বৃন্দাবন-চন্দ্র সর্ব-রসের আকর', E'পতিত-পাবন জগন্নাথ সর্বেশ্বর
বৃন্দাবন-চন্দ্র সর্ব-রসের আকর',
    E'māyeśwara
yogeśwara brahma-tejādhāra
sarvātmāra
ātmā prabhu prakṛtira pāra', E'ма̄йеш́вара
йоґеш́вара брахма-теджа̄дга̄ра
сарва̄тма̄ра
а̄тма̄ прабгу пракр̣тіра па̄ра',
    E'', E'',
    E'He is the Lord of Maya, the master of mysticism, and the proprietor of the
spiritual powers of the brahmanas. The Soul of all souls, He is the Supreme
Lord and master, being the opposite shore of the ocean of material nature.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 25
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '25', 25,
    E'নগরে নগরে গোরা গায়
ভকতিবিনোদ তছু পায়', E'নগরে নগরে গোরা গায়
ভকতিবিনোদ তছু পায়',
    E'patita-pāvana
jagannātha sarveśwara
bṛndābana-candra
sarva-rasera ākara', E'патіта-па̄вана
джаґанна̄тха сарвеш́вара
бр̣нда̄бана-чандра
сарва-расера а̄кара',
    E'', E'',
    E'Lord Krsna is the purifier of the fallen souls, the Lord of the universe, the
controller of all beings, the moon of Vrndavana, and the original reservoir of
all rasas.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 26
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '26', 26,
    E'', E'',
    E'nagare
nagare gorā gāy
bhakativinoda
tachu pāy', E'наґаре
наґаре ґора̄ ґа̄й
бгакатівінода
тачху па̄й',
    E'', E'',
    E'From village to village Lord Gauranga sings these names of Krsna, and
Bhaktivinoda remains at His lotus feet.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 6, Song 2: Krsna Govinda Hare
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Krsna Govinda Hare', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'কৃষ্ণ গোবিন্দ হরে
গোপী-বল্লভ শৌরে', E'কৃষ্ণ গোবিন্দ হরে
গোপী-বল্লভ শৌরে',
    E'Song
Name: Krsna Govinda Hare
Official
Name: Sri Krsnaer Vimsottara-Sata-Nama Song 2
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Крсна Ґовінда Харе
Оffічіал
Наме: Срі Крснаер Вімсоттара-Сата-Нама Сонґ 2
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
Krsna! O Govinda! O Hari! O Gopi-vallabha! O Sauri!
2) O
Srinivasa! O Damodara! O Sri Rama! O Murari! O Nanda-nandana! O Madhava! O
Nrsimha! O Kamsari!
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'শ্রীনিবাস, দামোদর, শ্রী-রাম, মুরারে
নন্দ-নন্দন, মাধব, নৃসিংহ, কংসারে', E'শ্রীনিবাস, দামোদর, শ্রী-রাম, মুরারে
নন্দ-নন্দন, মাধব, নৃসিংহ, কংসারে',
    E'kṛṣṇa
govinda hare
gopī-vallabha
śaure', E'кр̣шн̣а
ґовінда харе
ґопı̄-валлабга
ш́ауре',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'', E'',
    E'śrīnivāsa,
dāmodara, śrī-rāma, murāre
nanda-nandana,
mādhava, nṛsiḿha, kaḿsāre', E'ш́рı̄ніва̄са,
да̄модара, ш́рı̄-ра̄ма, мура̄ре
нанда-нандана,
ма̄дгава, нр̣сіḿха, каḿса̄ре',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 6, Song 3: Radha Vallabha Madhava
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Radha Vallabha Madhava', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'রাধা-বল্লভ, মাধব, শ্রী-পতি, মুকুন্দ
গোপীনাথ, মদন-মোহন, রাস-রসানন্দ
অনঙ্গ-সুখদ-কুঞ্জ-বিহারী গোবিন্দ', E'রাধা-বল্লভ, মাধব, শ্রী-পতি, মুকুন্দ
গোপীনাথ, মদন-মোহন, রাস-রসানন্দ
অনঙ্গ-সুখদ-কুঞ্জ-বিহারী গোবিন্দ',
    E'Song
Name: Radha Vallabha Madhava Sripati
Official
Name: Sri Krsnaer Vimsottara-Sata-Nama Song 3
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ
rādhā-vallabha,
mādhava, śrī-pati, mukunda
gopīnātha,
madana-mohana, rāsa-rasānanda
anańga-sukhada-kuñja-bihārī
govinda', E'Сонґ
Наме: Радга Валлабга Мадгава Сріпаті
Оffічіал
Наме: Срі Крснаер Вімсоттара-Сата-Нама Сонґ 3
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ
ра̄дга̄-валлабга,
ма̄дгава, ш́рı̄-паті, мукунда
ґопı̄на̄тха,
мадана-мохана, ра̄са-раса̄нанда
анаńґа-сукхада-кун̃джа-біха̄рı̄
ґовінда',
    E'', E'',
    E'Krsna
is the lover of Radha, sweet like honey of the springtime, the husband of
Laksmi, the awarder of liberation, the Lord of the gopis, He bewilders of
Cupid, He relishes of the blissful mellows of the rasa dance, the enjoyer of
amorous sports in the grove at Radha Kunda known as Ananga-sukhada-kunja, and
the pleasure of the cows.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 6, Song 4: Jaya Radha Madhava
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Jaya Radha Madhava', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'', E'',
    E'Song
Name: Jaya Radha Madhava
Official
Name: Sri Krsnaer Vimsottara Sata Nama Song 4
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Джайа Радга Мадгава
Оffічіал
Наме: Срі Крснаер Вімсоттара Сата Нама Сонґ 4
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Radha Madhava', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'', E'',
    E'jaya rādhā-mādhava
kuñja-bihārī
gopī-jana-vallabha giri-vara-dhārī', E'джайа ра̄дга̄-ма̄дгава
кун̃джа-біха̄рı̄
ґопı̄-джана-валлабга ґірі-вара-дга̄рı̄',
    E'', E'',
    E'Krsna is the lover of Radha. He displays many amorous pastimes in the groves of
Vrndavana, He is the lover of the cowherd maidens of Vraja, and the holder of
the great hill named Govardhana.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'', E'',
    E'yaśodā-nandana
braja-jana-rañjana
yāmuna-tīra-vana-cārī
WORD', E'йаш́ода̄-нандана
браджа-джана-ран̃джана
йа̄муна-тı̄ра-вана-ча̄рı̄
ВОРД',
    E'', E'',
    E'He is the beloved son of mother Yasoda, the delighter of the inhabitants of
Vraja, and He wanders in the forests along the banks of the River
Yamuna!
Remarks/ Extra Information:
Srila
Prabhupada was very fond of this sort and sang it just before his lectures. In
Allahabad and Gorakhpur, Srila Prabhupada fell into a trance after singing the
first two lines, and after some time he came back into external consciousness
and said, "Now just chant Hare Krsna." Srila Prabhupada said that
this song is "a picture of Vrndavana. Everything is there--Srimati
Radharani, Vrndavana, Govardhana, Yasoda, and all the cowherd boys."
This
song is heard in Raga Kafi, Raga Misra Pilu, and Raga Darbari Kanhada.
PURPORTS:
By
A.C. Bhaktivedanta Swami Prabhupada
By
A.C. Bhaktivedanta Swami Prabhupada
MUSICAL
NOTATION:
♫ Jaya Radha Madhava
(Prabhupada Style)
♫ Jaya Radha Madhava (Semi-Classical
Style)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 6, Song 5: Jaya Radha Vallabha Jaya
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Jaya Radha Vallabha Jaya', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'(জয়) রাধা-বল্লভ, (জয়) রাধা-বিনোদ
(জয়) রাধা-মাধব, (জয়) রাধা-প্রমোদ', E'(জয়) রাধা-বল্লভ, (জয়) রাধা-বিনোদ
(জয়) রাধা-মাধব, (জয়) রাধা-প্রমোদ',
    E'Song
Name: Jaya Radha Vallabha Jaya Radha Vinoda
Official
Name: Sri Krsnaer Vimsottara Sata Nama Song 5
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Джайа Радга Валлабга Джайа Радга Вінода
Оffічіал
Наме: Срі Крснаер Вімсоттара Сата Нама Сонґ 5
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Krsna is the lover of Radha, the pleasure of Radha, the springtime of Radha,
and the delight of Radha.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'রাধা-রমণ, রাধা-নাথ,
রাধা-বরণামোদ
রাধা-রসিক, রাধা-কান্ত,
রাধা-মিলন-মোদ', E'রাধা-রমণ, রাধা-নাথ,
রাধা-বরণামোদ
রাধা-রসিক, রাধা-কান্ত,
রাধা-মিলন-মোদ',
    E'(jaya)
rādhā-vallabha, (jaya) rādhā-vinoda
(jaya)
rādhā-mādhava, (jaya) rādhā-pramoda', E'(джайа)
ра̄дга̄-валлабга, (джайа) ра̄дга̄-вінода
(джайа)
ра̄дга̄-ма̄дгава, (джайа) ра̄дга̄-прамода',
    E'', E'',
    E'Krsna is the lover of Radha, the Lord of Radha, He delights in beholding the
beautiful complexion of Radha, He relishes everything in relation to Radha, He
is the beloved of Radha, and He feels joy in meeting with Radha.
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'', E'',
    E'rādhā-ramaṇa,
rādhā-nātha,
rādhā-varaṇāmoda
rādhā-rasika,
rādhā-kānta,
rādhā-milana-moda', E'ра̄дга̄-раман̣а,
ра̄дга̄-на̄тха,
ра̄дга̄-варан̣а̄мода
ра̄дга̄-расіка,
ра̄дга̄-ка̄нта,
ра̄дга̄-мілана-мода',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 6, Song 6: Jaya Yasoda Nandana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Jaya Yasoda Nandana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'জয় যশোদা-নন্দন কৃষ্ণ গোপাল গোবিন্দ
জয় মদন-মোহন হরে অনন্ত মুকুন্দ', E'জয় যশোদা-নন্দন কৃষ্ণ গোপাল গোবিন্দ
জয় মদন-মোহন হরে অনন্ত মুকুন্দ',
    E'Song
Name: Jaya Yasoda Nandana Krsna Gopala Govinda
Official
Name: Sri Krsnaer Vimsottara Sata Nama Song 6
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Джайа Йасода Нандана Крсна Ґопала Ґовінда
Оffічіал
Наме: Срі Крснаер Вімсоттара Сата Нама Сонґ 6
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) All
glories to Krsna, the son of Mother Yasoda, the cowherd boy and giver of
pleasure to the cows! All glories to the conqueror of Cupid, Lord Hari, who
takes away all inauspiciousness, who is unlimited, and the awarder of
liberation!
2) All
glories to the infallible Lord, husband of the goddess of fortune, the supreme
enjoyer, and the moon of Vrndavana! All glories to Krsna, who always holds a
flute to His mouth, who is the color of a dark blue raincloud, and is the bliss
of the gopis!
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'জয় অচ্যুত মাধব রাম বৃন্দাবন-চন্দ্র
জয় মুরলী-বদন শ্যাম গোপী-জনানন্দ', E'জয় অচ্যুত মাধব রাম বৃন্দাবন-চন্দ্র
জয় মুরলী-বদন শ্যাম গোপী-জনানন্দ',
    E'jaya
yaśodā-nandana kṛṣṇa gopāla govinda
jaya
madana-mohana hare ananta mukunda', E'джайа
йаш́ода̄-нандана кр̣шн̣а ґопа̄ла ґовінда
джайа
мадана-мохана харе ананта мукунда',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'', E'',
    E'jaya
acyuta mādhava rām bṛndābana-candra
jaya
muralī-vadana śyāma gopī-janānanda', E'джайа
ачйута ма̄дгава ра̄м бр̣нда̄бана-чандра
джайа
муралı̄-вадана ш́йа̄ма ґопı̄-джана̄нанда',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 7, Song 1: Yasomati Nandana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 7;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Yasomati Nandana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'যশোমতী-নন্দন, ব্রজ-বর-নাগর,
গোকুল-রঞ্জন কান
গোপী-পরাণ-ধন, মদন-মনোহর,
কালিয়-দমন-বিধান', E'যশোমতী-নন্দন, ব্রজ-বর-নাগর,
গোকুল-রঞ্জন কান
গোপী-পরাণ-ধন, মদন-মনোহর,
কালিয়-দমন-বিধান',
    E'Song
Name: Yasomati Nandana
Official
Name: Nama Kirtana Song 1
Author:
Bhaktivinoda Thakura
Book
Name: Gitavali
Language:
Bengali
অ
ଅ', E'Сонґ
Наме: Йасоматі Нандана
Оffічіал
Наме: Нама Кіртана Сонґ 1
Аутхор:
Бхактівінода Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ
ଅ',
    E'', E'',
    E'Lord Krsna is the beloved son of mother Yasoda; the transcendental lover in the
land of Vraja; the delight of Gokula; Kana [a nickname of Krsna]; the wealth of
the lives of the gopis. He steals the mind of even Cupid and punishes the
Kaliya serpent.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'অমল হরিনাম অমিয়-বিলাসা
বিপিন-পুরন্দর, নবীন নাগর-বর,
বংশী-বদন সুবাসা', E'অমল হরিনাম অমিয়-বিলাসা
বিপিন-পুরন্দর, নবীন নাগর-বর,
বংশী-বদন সুবাসা',
    E'yaśomatī-nandana,
braja-baro-nāgara,
gokula-rañjana kāna
gopī-parāṇa-dhana, madana-manohara,
kāliya-damana-vidhāna', E'йаш́оматı̄-нандана,
браджа-баро-на̄ґара,
ґокула-ран̃джана ка̄на
ґопı̄-пара̄н̣а-дгана, мадана-манохара,
ка̄лійа-дамана-відга̄на',
    E'', E'',
    E'These pure, holy names of Lord Hari are full of sweet, nectarean pastimes.
Krsna is the Lord of the twelve forests of Vraja, He is ever-youthful and is
the best of lovers. He is always playing on a flute, and He is an excellent
dresser.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'ব্রজ-জন-পালন, অসুর-কুল-নাশন
নন্দ-গোধন-রাখওয়ালা
গোবিন্দ মাধব, নবনীত-তস্কর,
সুন্দর নন্দ-গোপালা', E'ব্রজ-জন-পালন, অসুর-কুল-নাশন
নন্দ-গোধন-রাখওয়ালা
গোবিন্দ মাধব, নবনীত-তস্কর,
সুন্দর নন্দ-গোপালা',
    E'amala
harinām amiya-vilāsā
vipina-purandara, navīna nāgara-bora,
baṁśī-badana suvāsā', E'амала
харіна̄м амійа-віла̄са̄
віпіна-пурандара, навı̄на на̄ґара-бора,
бам̇ш́ı̄-бадана сува̄са̄',
    E'', E'',
    E'Krsna is the protector of the inhabitants of Vraja; the destroyer of various
demoniac dynasties; the keeper and tender of Nanda Maharaja''s cows; the giver
of pleasure to the cows, land, and spiritual senses; the husband of the goddess
of fortune; the butter thief; and the beautiful cowherd boy of Nanda Maharaja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'যামুন-তট-চর, গোপী-বসন-হর,
রাস-রসিক, কৃপাময়
শ্রী-রাধা-বল্লভ, বৃন্দাবন-নটবর,
ভকতিবিনোদ-আশ্রয়', E'যামুন-তট-চর, গোপী-বসন-হর,
রাস-রসিক, কৃপাময়
শ্রী-রাধা-বল্লভ, বৃন্দাবন-নটবর,
ভকতিবিনোদ-আশ্রয়',
    E'braja-jana-pālana,
asura-kula-nāśana
nanda-godhana-rākhowālā
govinda mādhava, navanīta-taskara,
sundara nanda-gopālā', E'браджа-джана-па̄лана,
асура-кула-на̄ш́ана
нанда-ґодгана-ра̄кхова̄ла̄
ґовінда ма̄дгава, наванı̄та-таскара,
сундара нанда-ґопа̄ла̄',
    E'', E'',
    E'Krsna wanders along the banks of the River Yamuna. He stole the garments of the
young damsels of Vraja who were bathing there. He delights in the mellows of
the rasa dance; He is very merciful; the lover and beloved of Srimati
Radharani; the great dancer of Vrndavana; and the shelter and only refuge of
Thakura Bhaktivinoda.
REMARKS/EXTRA
INFORMATION:
This
song is sung in Raga Des in Dadra Tala. This can also be sung in Kaherva tala
with Ahir Bhairava raga.
MUSICAL
NOTATION:
♫ Yasomati Nandana', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'', E'',
    E'yāmuna-taṭa-cara,
gopī-basana-hara,
rāsa-rasika, kṛpāmoya
śrī-rādhā-vallabha, bṛndābana-naṭabara,
bhakativinod-āśraya
WORD', E'йа̄муна-тат̣а-чара,
ґопı̄-басана-хара,
ра̄са-расіка, кр̣па̄мойа
ш́рı̄-ра̄дга̄-валлабга, бр̣нда̄бана-нат̣абара,
бгакатівінод-а̄ш́райа
ВОРД',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 7, Song 2: Doyal Nitai Caitanya
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 7;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Doyal Nitai Caitanya', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'দয়াল নিতাই চৈতন্য'' বলে'' নাচ রে আমার মন
নাচ রে আমার মন, নাচ রে আমার মন', E'দয়াল নিতাই চৈতন্য'' বলে'' নাচ রে আমার মন
নাচ রে আমার মন, নাচ রে আমার মন',
    E'⇒ D
Song
Name: Doyal Nitai Caitanya
Official
Name: Sri Nama Kirtana Song 2
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'⇒ Д
Сонґ
Наме: Дойал Нітаі Чаітанйа
Оffічіал
Наме: Срі Нама Кіртана Сонґ 2
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Chanting the holy name Doyal Nitai Caitanya!  O my mind, please dance! O my
mind, please dance! O my mind, please dance!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'(এমন, দয়াল তো নাই হে, মার খেয়ে প্রেম দেয়)
(ওরে) অপরাধ দূরে যাবে, পাবে প্রেম-ধন
(ও নামে অপরাধ-বিচার তো নাই হে)
(তখন) কৃষ্ণ-নামে রুচি হ''বে, ঘুচিবে বন্ধন', E'(এমন, দয়াল তো নাই হে, মার খেয়ে প্রেম দেয়)
(ওরে) অপরাধ দূরে যাবে, পাবে প্রেম-ধন
(ও নামে অপরাধ-বিচার তো নাই হে)
(তখন) কৃষ্ণ-নামে রুচি হ''বে, ঘুচিবে বন্ধন',
    E'`doyāl
nitāi caitanya'' bole'' nāc re āmār man
nāc re
āmār man, nāc re āmāra man', E'`дойа̄л
ніта̄і чаітанйа'' боле'' на̄ч ре а̄ма̄р ман
на̄ч ре
а̄ма̄р ман, на̄ч ре а̄ма̄ра ман',
    E'', E'',
    E'Oh! Such a merciful personality as Nityananda Prabhu is not to be found
anywhere! He suffers a beating from Jagai and Madhai and still gives them the
love of God! Oh! When your offenses are being vanquished, you will obtain the
treasure of love of God! But in these names of Caitanya and Nitai there is no
consideration of offenses! Once you have a taste for the holy name of Krsna,
bondage to this world will come to an end.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'(কৃষ্ণ-নামে অনুরাগ তো হ''বে হে)
(তখন) অনায়াসে সফল হ''বে জীবের জীবন
(কৃষ্ণ-রতি বিনা জীবন তো মিছে হে)
(এসে) বৃন্দাবনে রাধা-শ্যামের প''বে দরশন
(গৌর-কৃপা হ''লে হে)', E'(কৃষ্ণ-নামে অনুরাগ তো হ''বে হে)
(তখন) অনায়াসে সফল হ''বে জীবের জীবন
(কৃষ্ণ-রতি বিনা জীবন তো মিছে হে)
(এসে) বৃন্দাবনে রাধা-শ্যামের প''বে দরশন
(গৌর-কৃপা হ''লে হে)',
    E'(emon,
doyāl to nāi he, mār kheye prema dey)
(ore)
aparādha dūre jābe, pābe prema-dhan
(o
nāme aparādha-vicāra to nāi he)
(takhon)
kṛṣṇa-nāme ruci ha''be, ghucibe bandhan', E'(емон,
дойа̄л то на̄і хе, ма̄р кхейе према дей)
(оре)
апара̄дга дӯре джа̄бе, па̄бе према-дган
(о
на̄ме апара̄дга-віча̄ра то на̄і хе)
(такхон)
кр̣шн̣а-на̄ме ручі ха''бе, ґгучібе бандган',
    E'', E'',
    E'Oh! When there is attachment to the holy name of Krsna, the life of a living
being very easily becomes successful! Oh! Without affection for Krsna, life is
simply useless! At the end of life, you will obtain the beautiful vision of
Radha and Syama in Vrndavana  but only when the mercy of Lord Gaura is first
received! Oh!
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'', E'',
    E'(kṛṣṇa-nāme
anurāg to ha''be he)
(takhon)
anāyāse saphal ha''be jīvera jīvan
(kṛṣṇa-rati
vinā jīvan to miche he)
(ese)
bṛndābane rādhā-śyāmer pa''be daraśan
(gaura-kṛpā
ha''le he)', E'(кр̣шн̣а-на̄ме
анура̄ґ то ха''бе хе)
(такхон)
ана̄йа̄се сапхал ха''бе джı̄вера джı̄ван
(кр̣шн̣а-раті
віна̄ джı̄ван то мічхе хе)
(есе)
бр̣нда̄бане ра̄дга̄-ш́йа̄мер па''бе дараш́ан
(ґаура-кр̣па̄
ха''ле хе)',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 7, Song 3: Hari Bol Hari Bol Hari Bol Bhaire
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 7;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Hari Bol Hari Bol Hari Bol Bhaire', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'''হরি'' বল, হরি'' বল, হরি'' বল, ভাই রে
হরিনাম আনিয়াছে গৌরাঙ্গ-নিতাই রে
(মোদের দুঃখ দেখে'' রে)', E'''হরি'' বল, হরি'' বল, হরি'' বল, ভাই রে
হরিনাম আনিয়াছে গৌরাঙ্গ-নিতাই রে
(মোদের দুঃখ দেখে'' রে)',
    E'Song
Name: Hari Bolo Hari Bolo Hari Bolo Bhai Re
Official
Name: Sri Nama Kirtana Song 3
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Харі Боло Харі Боло Харі Боло Бхаі Ре
Оffічіал
Наме: Срі Нама Кіртана Сонґ 3
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
brothers, chant "Hari!" Chant "Hari!" Chant
"Hari!" Lord Gauranga and Lord Nitai have brought the holy name!
(Seeing our unhappiness!)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'হরিনাম বিনা জীবের অন্য ধন নাই-রে
হরিনামে শুদ্ধ হ''ল জগাই-মাধাই রে
(বড় পাপী ছিল রে)', E'হরিনাম বিনা জীবের অন্য ধন নাই-রে
হরিনামে শুদ্ধ হ''ল জগাই-মাধাই রে
(বড় পাপী ছিল রে)',
    E'`hari''
bolo, `hari'' bolo, `hari'' bolo, bhāi re
harinām
āniyāche gaurāńga-nitāi re
(modera
duḥkha dekhe'' re)', E'`харі''
боло, `харі'' боло, `харі'' боло, бга̄і ре
харіна̄м
а̄нійа̄чхе ґаура̄ńґа-ніта̄і ре
(модера
дух̣кха декхе'' ре)',
    E'', E'',
    E'Except for the holy name, there is no other treasure for the soul! By the
influence of the holy name, even Jagai and Madhai became pure! (They were both
greatly sinful persons!)
3) I
pass my life uselessly bound by Maya! (Always saying "I" and
"mine"!) Wandering here and there under the control of mundane
desires-where shall I go next? (There is no end to worldly desires!)
4) O
brothers, chant "Hari!" while looking directly in the face of
material desire! (Freedom from mundane hankerings is the platform of actual
happiness!) Giving up all desire for mundane enjoyment and liberation, I chant
the holy names of the Supreme Lord! (Having become pure and situated in
transcendence!)
5) I
dance in ecstasy due to the power and divine qualities of the holy name, and
thus I obtain all these results! (Having given up all endeavors for
insignificant material results!) Bhaktivinoda says, "I conquer all
impediments to the pure chanting of the holy name! (Having given up all
offenses to the holy name!)"
Remarks/ Extra Information:
Verse
4 is a purport to Srimad-Bhagavatam Canto 11 Chapter 8 Verse 44: āśā
hi paramaḿ duḥkhaḿ nairāśyaḿ paramaḿ
sukham material
desire is supreme misery, while the state of desireless-ness is supreme
happiness.*', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'মিছে মায়া-বদ্ধ হ''য়ে জীবন কাটাই রে
(আমি, আমার'' বলে'' রে)
আশা-বশে ঘুরে'' ঘুরে'' আর কোথা যাই রে
(আশার শেষ নাই রে)', E'মিছে মায়া-বদ্ধ হ''য়ে জীবন কাটাই রে
(আমি, আমার'' বলে'' রে)
আশা-বশে ঘুরে'' ঘুরে'' আর কোথা যাই রে
(আশার শেষ নাই রে)',
    E'harinām
vinā jīver anya dhana nāi-re
harināme
śuddha ha''lo jagāi-mādhāi re
(baḍo
pāpī chilo re)', E'харіна̄м
віна̄ джı̄вер анйа дгана на̄і-ре
харіна̄ме
ш́уддга ха''ло джаґа̄і-ма̄дга̄і ре
(бад̣о
па̄пı̄ чхіло ре)',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'হরি'' বলে'' দেও ভাই আশার মুখে ছাই রে
(নিরাশ ত'' সুখ রে)
ভোগ-মোক্ষ-বাঞ্ছা ছাড়ি'' হরিনাম গাই রে
(শুদ্ধ-সত্ত্ব হ''য়ে রে)', E'হরি'' বলে'' দেও ভাই আশার মুখে ছাই রে
(নিরাশ ত'' সুখ রে)
ভোগ-মোক্ষ-বাঞ্ছা ছাড়ি'' হরিনাম গাই রে
(শুদ্ধ-সত্ত্ব হ''য়ে রে)',
    E'miche
māyā-baddha ho''ye jīvan kāṭāi re
(`āmi,
āmār'' bole'' re)
āśā-vaśe
ghure'' ghure'' ār kothā jāi re
(āśār
śeṣa nāi re)', E'мічхе
ма̄йа̄-баддга хо''йе джı̄ван ка̄т̣а̄і ре
(`а̄мі,
а̄ма̄р'' боле'' ре)
а̄ш́а̄-ваш́е
ґгуре'' ґгуре'' а̄р котха̄ джа̄і ре
(а̄ш́а̄р
ш́еша на̄і ре)',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'নাচে'' যেও নামের গুনে ও সব ফল পাই রে
(তুচ্ছ ফলে প্রয়াস ছেড়ে'' রে)
বিনোদ বলে যাই ল''য়ে নামের বালাই রে
(নামের বালাই ছেড়ে'' রে)', E'নাচে'' যেও নামের গুনে ও সব ফল পাই রে
(তুচ্ছ ফলে প্রয়াস ছেড়ে'' রে)
বিনোদ বলে যাই ল''য়ে নামের বালাই রে
(নামের বালাই ছেড়ে'' রে)',
    E'`hari''
bole'' deo bhāi āśār mukhe chāi re
(nirāśa
to'' sukho re)
bhoga-mokṣa-vāñchā
chāḍi'' harinām gāi re
(śuddha-sattva
ho''ye re)', E'`харі''
боле'' део бга̄і а̄ш́а̄р мукхе чха̄і ре
(ніра̄ш́а
то'' сукхо ре)
бгоґа-мокша-ва̄н̃чха̄
чха̄д̣і'' харіна̄м ґа̄і ре
(ш́уддга-саттва
хо''йе ре)',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'', E'',
    E'nāce''
jeo nāmer gune o sab phala pāi re
(tuccha
phale prayās cheḍe'' re)
vinod
bole jāi lo''ye nāmer bālāi re
(nāmer
bālāi cheḍe'' re)', E'на̄че''
джео на̄мер ґуне о саб пхала па̄і ре
(туччха
пхале прайа̄с чхед̣е'' ре)
вінод
боле джа̄і ло''йе на̄мер ба̄ла̄і ре
(на̄мер
ба̄ла̄і чхед̣е'' ре)',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 7, Song 4: Bolo Hari Bolo
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 7;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Bolo Hari Bolo', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'বল হরি বল (৩ বার)
মনের আনন্দে, ভাই, বল হরি বল
বল হরি বল (৩ বার)
জনমে জনমে সুখে বল
হরি বল', E'বল হরি বল (৩ বার)
মনের আনন্দে, ভাই, বল হরি বল
বল হরি বল (৩ বার)
জনমে জনমে সুখে বল
হরি বল',
    E'Song
Name: Bolo Hari Bolo
Official
Name: Sri Nama Kirtana Song 4
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Боло Харі Боло
Оffічіал
Наме: Срі Нама Кіртана Сонґ 4
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Chant the name of Hari! O brothers, with blissful minds chant the name of Hari!
Chant the name of Hari! Birth after birth in happiness, chant the name of Hari!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'বল হরি বল (৩ বার)
মানব-জন্ম পে''যে, ভাই, বল হরি বল
বল হরি বল (৩ বার)
সুখে থাকো, দুঃখে থাকো, বল হরি বল', E'বল হরি বল (৩ বার)
মানব-জন্ম পে''যে, ভাই, বল হরি বল
বল হরি বল (৩ বার)
সুখে থাকো, দুঃখে থাকো, বল হরি বল',
    E'bolo hari
bolo (3 times)
maner
ānande, bhāi, bolo hari bolo
bolo hari
bolo (3 times)
janame
janame sukhe bolo hari bolo', E'боло харі
боло (3 тімес)
манер
а̄нанде, бга̄і, боло харі боло
боло харі
боло (3 тімес)
джанаме
джанаме сукхе боло харі боло',
    E'', E'',
    E'Chant the name of Hari! O brothers, you have obtained a human birth, now chant
the name of Hari! Chant the name of Hari! Whether you are in happiness or
distress, chant the name of Hari!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'বল হরি বল (৩ বার)
সম্পদে বিপদে, ভাই, বল হরি বল
বল হরি বল (৩ বার)
গৃহে থাকো, বনে থাকো, বল হরি বল
কৃষ্ণএর সংসারে থাকি'' বল হরি বল', E'বল হরি বল (৩ বার)
সম্পদে বিপদে, ভাই, বল হরি বল
বল হরি বল (৩ বার)
গৃহে থাকো, বনে থাকো, বল হরি বল
কৃষ্ণএর সংসারে থাকি'' বল হরি বল',
    E'bolo hari
bolo (3 times)
mānava-janma
pe''ye, bhāi, bolo hari bolo
bolo hari
bolo (3 times)
sukhe
thāko, duḥkhe thāko, bolo hari bolo', E'боло харі
боло (3 тімес)
ма̄нава-джанма
пе''йе, бга̄і, боло харі боло
боло харі
боло (3 тімес)
сукхе
тха̄ко, дух̣кхе тха̄ко, боло харі боло',
    E'', E'',
    E'Chant the name of Hari! O brothers, whether in prosperity or misfortune, chant the
name of Hari! Chant the name of Hari! Whether you live at home or in the
forest, chant the name of Hari! Remaining in this material world for Krsna''s
purposes, chant the name of Hari!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'বল হরি বল (৩ বার)
অসত্‍-সঙ্গ ছাড়ি'', ভাই, বল হরি বল
বল হরি বল (৩ বার)
বৈষ্ণব-চরণে পড়ি'' বল হরি বল', E'বল হরি বল (৩ বার)
অসত্‍-সঙ্গ ছাড়ি'', ভাই, বল হরি বল
বল হরি বল (৩ বার)
বৈষ্ণব-চরণে পড়ি'' বল হরি বল',
    E'bolo hari
bolo (3 times)
sampade
vipade, bhāi, bolo hari bolo
bolo hari
bolo (3 times)
gṛhe
thāko, vane thāko, bolo hari bolo
kṛṣṇaera
saḿsāre thāki'' bolo hari bolo', E'боло харі
боло (3 тімес)
сампаде
віпаде, бга̄і, боло харі боло
боло харі
боло (3 тімес)
ґр̣хе
тха̄ко, ване тха̄ко, боло харі боло
кр̣шн̣аера
саḿса̄ре тха̄кі'' боло харі боло',
    E'', E'',
    E'Chant the name of Hari! O brothers, give up the association of non-devotees and
chant the name of Hari! Chant the name of Hari! Falling at the feet of the
Vaisnavas, chant the name of Hari!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'বল হরি বল (৩ বার)
গৌর-নিত্যানন্দ বল
(৩ বার)
গৌর-গদাধর বল
(৩ বার)
গৌর-অদ্বৈত বল
(৩ বার)', E'বল হরি বল (৩ বার)
গৌর-নিত্যানন্দ বল
(৩ বার)
গৌর-গদাধর বল
(৩ বার)
গৌর-অদ্বৈত বল
(৩ বার)',
    E'bolo hari
bolo (3 times)
asat-sańga
chāḍi'', bhāi, bolo hari bolo
bolo hari
bolo (3 times)
vaiṣnava-caraṇe
poḍi'' bolo hari bolo', E'боло харі
боло (3 тімес)
асат-саńґа
чха̄д̣і'', бга̄і, боло харі боло
боло харі
боло (3 тімес)
ваішнава-чаран̣е
под̣і'' боло харі боло',
    E'', E'',
    E'Chant the name of Hari! Chant the names of Gaura and Nityananda! Chant the
names of Gaura and Gadadhara! Chant the names of Gaura and Advaita!
Remarks/ Extra Information:
This
song''s last verse is popularized by Visnujana Swami.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'', E'',
    E'bolo hari
bolo (3 times)
gaura-nityānanda
bolo (3 times)
gaura-gadādhara
bolo (3 times)
gaura-advaita
bolo (3 times)', E'боло харі
боло (3 тімес)
ґаура-нітйа̄нанда
боло (3 тімес)
ґаура-ґада̄дгара
боло (3 тімес)
ґаура-адваіта
боло (3 тімес)',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 7, Song 5: Hare Hare Ye Nama Maha Krsna
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 7;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Hare Hare Ye Nama Maha Krsna', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'(হরে) হরয়ে নমঃ কৃষ্ণ যাদবায় নমঃ
যাদবায় মাধবায় কেশবায় নমঃ
গোপাল গোবিন্দ রাম শ্রী-মধুসূদন
রাধা-গোবিন্দ বল (৪ বার)', E'(হরে) হরয়ে নমঃ কৃষ্ণ যাদবায় নমঃ
যাদবায় মাধবায় কেশবায় নমঃ
গোপাল গোবিন্দ রাম শ্রী-মধুসূদন
রাধা-গোবিন্দ বল (৪ বার)',
    E'Song
Name: Hare Haraye Namah
Official
Name: Sri Nama Kirtana Song 5
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Харе Харайе Намах
Оffічіал
Наме: Срі Нама Кіртана Сонґ 5
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) I
offer my respectful obeisances unto Hari, the Supreme Personality of Godhead,
Krsna, the descendant of the Yadu dynasty, husband of the goddess of fortune
and the killer of the demon Kesi, the protector of the cows, the pleaser of the
cows, the supreme enjoyer, and the slayer of the demon Madhu. Chant the holy
names "Radha-Govinda!"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'গোবিন্দ গোবিন্দ গোবিন্দ বল
রাধা-গোবিন্দ বল (৪ বার)
গুরু-কৃপা জলে নাশি'' বিষয়-অনল
রাধা-গোবিন্দ বল (৪ বার)', E'গোবিন্দ গোবিন্দ গোবিন্দ বল
রাধা-গোবিন্দ বল (৪ বার)
গুরু-কৃপা জলে নাশি'' বিষয়-অনল
রাধা-গোবিন্দ বল (৪ বার)',
    E'(hare)
haraye namaḥ kṛṣṇa yādavāya namaḥ
yādavāya
mādhavāya keśavāya namaḥ
gopāla
govinda rām śrī-madhusūdan
rādhā-govinda
bolo (4 times)', E'(харе)
харайе намах̣ кр̣шн̣а йа̄дава̄йа намах̣
йа̄дава̄йа
ма̄дгава̄йа кеш́ава̄йа намах̣
ґопа̄ла
ґовінда ра̄м ш́рı̄-мадгусӯдан
ра̄дга̄-ґовінда
боло (4 тімес)',
    E'', E'',
    E'Chant "Govinda! Govinda! Govinda!" Chant "Radha-Govinda!"
Now that the waters of the spiritual master''s mercy have extinguished the
blazing fire of worldly existence, chant "Radha-Govinda!"
3) Offering
body, home, family and all to Sri Krsna, chant "Radha-Govinda!" In a
mood of unalloyed determination, becoming simple and straightforward in your
heart, chant "Radha-Govinda!"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'কৃষ্ণএতে অর্পিয়া দেহ-গেহাদি সকল
রাধা-গোবিন্দ বল (৪ বার)
অনন্য-ভাবেতে চিত্ত করিয়া সরল
রাধা-গোবিন্দ বল (৪ বার)', E'কৃষ্ণএতে অর্পিয়া দেহ-গেহাদি সকল
রাধা-গোবিন্দ বল (৪ বার)
অনন্য-ভাবেতে চিত্ত করিয়া সরল
রাধা-গোবিন্দ বল (৪ বার)',
    E'govinda
govinda govinda bolo
rādhā-govinda
bolo (4 times)
guru-kṛpā
jale nāśi'' viṣaya-anala
rādhā-govinda
bolo (4 times)', E'ґовінда
ґовінда ґовінда боло
ра̄дга̄-ґовінда
боло (4 тімес)
ґуру-кр̣па̄
джале на̄ш́і'' вішайа-анала
ра̄дга̄-ґовінда
боло (4 тімес)',
    E'', E'',
    E'Drinking the water that has washed the feet of a Vaisnava who follows in the
footsteps of Srila Rupa Goswami, chant "Radha-Govinda!" Giving up the
ten offenses to the holy name, as well as the alluring fruits of material
enjoyment and liberation, chant "Radha-Govinda!"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'রূপানুগ বৈষ্ণবের পিয়া পদ-জল
রাধা-গোবিন্দ বল (৪ বার)
দাশ অপরাধ ত্যজি'' ভুক্তি-মুক্তি-ফল
রাধা-গোবিন্দ বল (৪ বার)', E'রূপানুগ বৈষ্ণবের পিয়া পদ-জল
রাধা-গোবিন্দ বল (৪ বার)
দাশ অপরাধ ত্যজি'' ভুক্তি-মুক্তি-ফল
রাধা-গোবিন্দ বল (৪ বার)',
    E'kṛṣṇaete
arpiyā deha-gehādi sakal
rādhā-govinda
bolo (4 times)
ananya-bhāvete
citta koriyā saral
rādhā-govinda
bolo (4 times)', E'кр̣шн̣аете
арпійа̄ деха-ґеха̄ді сакал
ра̄дга̄-ґовінда
боло (4 тімес)
ананйа-бга̄вете
чітта корійа̄ сарал
ра̄дга̄-ґовінда
боло (4 тімес)',
    E'', E'',
    E'Making the dust from the feet of a gopi your only means of support, chant
"Radha-Govinda!" Feeling relieved by living in Vraja in your eternal
spiritual form, chant "Radha-Govinda!"
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'সখীর চরণ-রেণু করিয়া সম্বল
রাধা-গোবিন্দ বল (৪ বার)
স্বরূপেতে ব্রজ-বাসে হ‌ইয়া শীতল
রাধা-গোবিন্দ বল (৪ বার)', E'সখীর চরণ-রেণু করিয়া সম্বল
রাধা-গোবিন্দ বল (৪ বার)
স্বরূপেতে ব্রজ-বাসে হ‌ইয়া শীতল
রাধা-গোবিন্দ বল (৪ বার)',
    E'rūpānuga
vaiṣṇavera piyā pada-jal
rādhā-govinda
bolo (4 times)
dāśa
aparādha tyaji'' bhukti-mukti-phal
rādhā-govinda
bolo (4 times)', E'рӯпа̄нуґа
ваішн̣авера пійа̄ пада-джал
ра̄дга̄-ґовінда
боло (4 тімес)
да̄ш́а
апара̄дга тйаджі'' бгукті-мукті-пхал
ра̄дга̄-ґовінда
боло (4 тімес)',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'', E'',
    E'sakhīra
caraṇa-reṇu koriyā sambal
rādhā-govinda
bolo (4 times)
swarūpete
braja-bāse hoiyā śītal
rādhā-govinda
bolo (4 times)', E'сакхı̄ра
чаран̣а-рен̣у корійа̄ самбал
ра̄дга̄-ґовінда
боло (4 тімес)
сварӯпете
браджа-ба̄се хоійа̄ ш́ı̄тал
ра̄дга̄-ґовінда
боло (4 тімес)',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 1: Krsna Bhakti Vinak Abhunahi
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Krsna Bhakti Vinak Abhunahi', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'কৃষ্ণ-ভক্তি বিনা কভু নাহি ফলদয়
মিছে সব ধর্মাধর্ম জীবের উপাধিময়', E'কৃষ্ণ-ভক্তি বিনা কভু নাহি ফলদয়
মিছে সব ধর্মাধর্ম জীবের উপাধিময়',
    E'Song
Name: Krsna Bhakti Vina Kabhu
Official
Name: Sreyo Nirnaya Song 1
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Крсна Бхакті Віна Кабгу
Оffічіал
Наме: Срейо Нірнайа Сонґ 1
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'There is no profit in a life devoid of devotional service to Krsna. Therefore
all the so-called religiosity and irreligiosity of a living being who is
bewildered by false worldly designations is simply useless.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'যোগ-যাগ-তপো-ধ্যান, সন্ন্যাসাদি ব্রহ্ম-জ্ঞান,
নানা-কাণ্ড-রূপে জীবের বন্ধন-কারণ হয়', E'যোগ-যাগ-তপো-ধ্যান, সন্ন্যাসাদি ব্রহ্ম-জ্ঞান,
নানা-কাণ্ড-রূপে জীবের বন্ধন-কারণ হয়',
    E'kṛṣṇa-bhakti
vinā kabhu nāhi phalodoy
miche
sab dharmādharma jīver upādhimoy', E'кр̣шн̣а-бгакті
віна̄ кабгу на̄хі пхалодой
мічхе
саб дгарма̄дгарма джı̄вер упа̄дгімой',
    E'', E'',
    E'Mysticism, performance of Vedic sacrifices, severe austerities, meditation,
renunciation of the world, and cultivating knowledge of the impersonal
Brahman-although appearing in the forms of various spiritual paths-are all
causes of the soul''s further bondage to this world.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'বিনোদের বাক্য ধর, নানা কাণ্ড ত্যাগ কর,
নিরুপাধি কৃষ্ণ-প্রেমে হৃদয়ে দেহো আশ্রয়', E'বিনোদের বাক্য ধর, নানা কাণ্ড ত্যাগ কর,
নিরুপাধি কৃষ্ণ-প্রেমে হৃদয়ে দেহো আশ্রয়',
    E'yoga-yāga-tapo-dhyān,
sannyāsādi brahma-jñān,
nānā-kāṇḍa-rūpe
jīver bandhana-kāraṇa hoy', E'йоґа-йа̄ґа-тапо-дгйа̄н,
саннйа̄са̄ді брахма-джн̃а̄н,
на̄на̄-ка̄н̣д̣а-рӯпе
джı̄вер бандгана-ка̄ран̣а хой',
    E'', E'',
    E'Please heed this advice of Bhaktivinoda: Give up all these various paths, and
just keep pure love of Krsna sheltered within your heart, for this alone is
transcendental to all mundane designations.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'', E'',
    E'vinoder
vākya dharo, nānā kānḍa tyāg koro,
nirupādhi
kṛṣṇa-preme hṛdoye deho āśroy', E'вінодер
ва̄кйа дгаро, на̄на̄ ка̄нд̣а тйа̄ґ коро,
нірупа̄дгі
кр̣шн̣а-преме хр̣дойе дехо а̄ш́рой',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 2: Arke No Maya Jale
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Arke No Maya Jale', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'আর
কেন মায়া-জালে
পোড়িতেছো, জীব-মীন
নাহি
জানো বদ্ধ হ''য়ে
রো''বে তুমি চিরো-দিন', E'আর
কেন মায়া-জালে
পোড়িতেছো, জীব-মীন
নাহি
জানো বদ্ধ হ''য়ে
রো''বে তুমি চিরো-দিন',
    E'⇒ A
Song
Name: Ar Keno Maya Jale
Official
Name: Sreyo-Nirnaya Song 2
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'⇒ А
Сонґ
Наме: Ар Кено Майа Джале
Оffічіал
Наме: Срейо-Нірнайа Сонґ 2
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
fish like soul, why have you fallen into the entangling nets of Maya? You have
not understood that being bound up by those nets you will have to remain in
this material world for a long, long time.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'অতি
তুচ্ছ ভোগ-আশে,
বন্দী হ''য়ে মায়া-পাশে
রোহিলে
বিকৃত-ভাবে দণ্ড্য
যথা পরাধীন', E'অতি
তুচ্ছ ভোগ-আশে,
বন্দী হ''য়ে মায়া-পাশে
রোহিলে
বিকৃত-ভাবে দণ্ড্য
যথা পরাধীন',
    E'ār
keno māyā-jāle poḍitecho, jīva-mīn
nāhi
jāno baddha ho''ye ro''be tumi ciro-din', E'а̄р
кено ма̄йа̄-джа̄ле под̣ітечхо, джı̄ва-мı̄н
на̄хі
джа̄но баддга хо''йе ро''бе тумі чіро-дін',
    E'', E'',
    E'After becoming captive in Maya''s snare due to your desires for insignificant
enjoyments, you remain transformed in a spiritually diseased condition,
punishable just like a disobedient servant.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'এখোন
ভকতি-বলে, কৃষ্ণ-প্রেম-সিন্ধু-জলে
ক্রীডা
করি'' অনায়াসে থাক
তুমি কৃষ্ণআধীন', E'এখোন
ভকতি-বলে, কৃষ্ণ-প্রেম-সিন্ধু-জলে
ক্রীডা
করি'' অনায়াসে থাক
তুমি কৃষ্ণআধীন',
    E'ati
tuccha bhoga-āśe, bandī ho''ye māyā-pāśe
rohile
vikṛta-bhāve daṇḍya jathā parādhīn', E'аті
туччха бгоґа-а̄ш́е, бандı̄ хо''йе ма̄йа̄-па̄ш́е
рохіле
вікр̣та-бга̄ве дан̣д̣йа джатха̄ пара̄дгı̄н',
    E'', E'',
    E'Now, by the power of devotional service, always remain subservient to Lord
Krsna, swimming and frolicking freely in the nectarine ocean of Krsna-prema.
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'', E'',
    E'ekhona
bhakati-bale, kṛṣṇa-prema-sindhu-jale
krīḍā
kori'' anāyāse thāko tumi kṛṣṇaādhīna', E'екхона
бгакаті-бале, кр̣шн̣а-према-сіндгу-джале
крı̄д̣а̄
корі'' ана̄йа̄се тха̄ко тумі кр̣шн̣аа̄дгı̄на',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 3: Pirati Saccidananda
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Pirati Saccidananda', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'পীরিতি সচ-চিদ-আনন্দে রূপবতী নারী
দয়া-ধর্ম-আদি গুন অলঙ্কার সব তাঁহারি', E'পীরিতি সচ-চিদ-আনন্দে রূপবতী নারী
দয়া-ধর্ম-আদি গুন অলঙ্কার সব তাঁহারি',
    E'Song
Name: Piriti Saccidananda Rupavati Nari
Official
Name: Sreyo Nirnaya Song 3
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Піріті Саччідананда Рупаваті Нарі
Оffічіал
Наме: Срейо Нірнайа Сонґ 3
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) Love and affection for the nature of eternity, knowledge, and bliss is like
a very beautiful woman whose ornaments are all the good qualities headed by
mercifulness and religiosity.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'জ্ঞান তা''র পট্ট-শাটী, যোগ-গন্ধ-পরিপাটী
এ সবে শোভিতা সতী করে কৃষ্ণ-মন চুরি', E'জ্ঞান তা''র পট্ট-শাটী, যোগ-গন্ধ-পরিপাটী
এ সবে শোভিতা সতী করে কৃষ্ণ-মন চুরি',
    E'pīriti
sac-cid-ānande rūpavatī nārī
dayā-dharma-ādi
guna alańkāra sab tāhāri', E'пı̄ріті
сач-чід-а̄нанде рӯпаватı̄ на̄рı̄
дайа̄-дгарма-а̄ді
ґуна алаńка̄ра саб та̄ха̄рі',
    E'', E'',
    E'The divine wisdom of pure jnana is her silken sari, and the practice of the
yoga of devotional service is her excellent bodily fragrance. Adorned by these
qualities, that beautiful and chaste woman steals away the mind of Krsna
Himself.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'রূপ বিনা অলঙ্কারে, কিবা শোভা এ-সংসারে
পীরিতি-বিহীন গুনে কৃষ্ণএ না তুষিতে পারি', E'রূপ বিনা অলঙ্কারে, কিবা শোভা এ-সংসারে
পীরিতি-বিহীন গুনে কৃষ্ণএ না তুষিতে পারি',
    E'jñāna
tā''r paṭṭa-śāṭī,
yoga-gandha-paripāṭī
e
sabe śobhitā satī kore kṛṣṇa-mana curi', E'джн̃а̄на
та̄''р пат̣т̣а-ш́а̄т̣ı̄,
йоґа-ґандга-паріпа̄т̣ı̄
е
сабе ш́обгіта̄ сатı̄ коре кр̣шн̣а-мана чурі',
    E'', E'',
    E'lf ornaments are worn by one completely devoid of beauty, then is such a person
considered to be beautiful in this world? Similarly, one possessing good
qualities like mercifulness and religiosity is unable to satisfy Lord Krsna if
devoid of love for Him.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'বানরীর অলঙ্কার, শোভা নাহি হয় তা''র
কৃষ্ণ-প্রেম বিনা তথা গুনে না আদর করি', E'বানরীর অলঙ্কার, শোভা নাহি হয় তা''র
কৃষ্ণ-প্রেম বিনা তথা গুনে না আদর করি',
    E'rūpa
vinā alańkāre, kibā śobhā e-saḿsāre
pīriti-vihīna
gune kṛṣṇae nā tuṣite pāri', E'рӯпа
віна̄ алаńка̄ре, кіба̄ ш́обга̄ е-саḿса̄ре
пı̄ріті-віхı̄на
ґуне кр̣шн̣ае на̄ тушіте па̄рі',
    E'', E'',
    E'Just as there is no beauty to an ornament worn on the body of a female monkey,
in the same way I do not hold in very high esteem qualities such as
mercifulness and religiosity if they are devoid of love for Krsna.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'', E'',
    E'vānarīra
alańkāra, śobhā nāhi hoy tā''ra
kṛṣṇa-prem
vinā tathā gune nā ādara kori', E'ва̄нарı̄ра
алаńка̄ра, ш́обга̄ на̄хі хой та̄''ра
кр̣шн̣а-прем
віна̄ татха̄ ґуне на̄ а̄дара корі',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 4: Nirakar Nirakar
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Nirakar Nirakar', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'নিরাকার নিরাকার'', করিয়া চীত্কার
কেনো সাধকের শান্তি ভাঙ্গো, ভাই, বার বার', E'নিরাকার নিরাকার'', করিয়া চীত্কার
কেনো সাধকের শান্তি ভাঙ্গো, ভাই, বার বার',
    E'Song
Name: Nirakar Nikarar Koriya Citkar
Official
Name: Sreyo Nirnaya Song 4
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Ніракар Нікарар Корійа Чіткар
Оffічіал
Наме: Срейо Нірнайа Сонґ 4
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
brothers, by your screaming out again and again, "The Supreme Lord is
formless! The Absolute Truth is a void! why do you so insist on disturbing the
peace of the Vaisnavas?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'তুমি যা'' বুঝেছো ভাল, তাই ল''য়ে কোতো কাল,
ভক্তি বিনা ফলদয় তর্কে নাহি, জানো সার', E'তুমি যা'' বুঝেছো ভাল, তাই ল''য়ে কোতো কাল,
ভক্তি বিনা ফলদয় তর্কে নাহি, জানো সার',
    E'`nirākār
nirākār'', koriyā cītkār
keno
sādhaker śānti bhāńgo, bhāi, bār bār', E'`ніра̄ка̄р
ніра̄ка̄р'', корійа̄ чı̄тка̄р
кено
са̄дгакер ш́а̄нті бга̄ńґо, бга̄і, ба̄р ба̄р',
    E'', E'',
    E'Having accepted this impersonal philosophy, which you consider to be very good,
you are simply wasting so much time. You should understand this essential
truth: Without devotion for the Supreme Lord, no factual gain is brought about
by engaging in mere dry arguments.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'সামান্য তর্কের বলে, ভক্তি নাহি আস্বাদিলে,
জনম হ‍ইল বৃথা, না করিলে সুবিচার', E'সামান্য তর্কের বলে, ভক্তি নাহি আস্বাদিলে,
জনম হ‍ইল বৃথা, না করিলে সুবিচার',
    E'tumi
jā'' bujhecho bhālo, tāi lo''ye koto kāl,
bhakti
vinā phalodoy tarke nāhi, jāno sār', E'тумі
джа̄'' буджхечхо бга̄ло, та̄і ло''йе кото ка̄л,
бгакті
віна̄ пхалодой тарке на̄хі, джа̄но са̄р',
    E'', E'',
    E'Your birth as a human being is useless, for although you are supposed to be great
philosophers, you did not judge rightly in this regard-by the power of mundane
logic and argument you have failed to taste the bliss of pure devotion to the
Supreme Lord.
4) If
I worship Krsna under the shelter of Srila Rupa Goswami, and thereby deeply
immerse myself in divine love for Lord Hari-and you are unable to attain that
state, O brothers, then what will you do? What more will you say?
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'রূপাশ্রয়ে কৃষ্ণ ভজি'', যদি হরি-প্রেমে মজি,
তা'' হ''লে অলভ্য, ভাই, কি করিবে বল আর', E'রূপাশ্রয়ে কৃষ্ণ ভজি'', যদি হরি-প্রেমে মজি,
তা'' হ''লে অলভ্য, ভাই, কি করিবে বল আর',
    E'sāmānya
tarkera bale, bhakti nāhi āsvādile,
janama
hoilo bṛthā, nā korile suvicār', E'са̄ма̄нйа
таркера бале, бгакті на̄хі а̄сва̄діле,
джанама
хоіло бр̣тха̄, на̄ коріле сувіча̄р',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'', E'',
    E'rūpāśraye
kṛṣṇa bhaji'', jadi hari-preme maji,
tā''
ho''le alabhya, bhāi, ki koribe bolo ār', E'рӯпа̄ш́райе
кр̣шн̣а бгаджі'', джаді харі-преме маджі,
та̄''
хо''ле алабгйа, бга̄і, кі корібе боло а̄р',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 5: Keno Arko Rodvesa
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Keno Arko Rodvesa', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'কেনো আর কর দ্বেষ, বিদেশি-জন-ভজনে
ভজনের লিঙ্গ নানা, নানা দেশে নানা জনে', E'কেনো আর কর দ্বেষ, বিদেশি-জন-ভজনে
ভজনের লিঙ্গ নানা, নানা দেশে নানা জনে',
    E'Song
Name: Keno Ar Koro Dvesa
Official
Name: Sreyo Nirnaya Song 5
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Кено Ар Коро Двеса
Оffічіал
Наме: Срейо Нірнайа Сонґ 5
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Why do you continue to hate the way the Lord is worshiped by people of other
lands? There exist a number of authentic ways to worship God, according to the
customs of various peoples living in different countries.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'কেহো মুক্ত-কচ্ছে ভজে, কেহো হাটু গাড়ি'' পূজে
কেহো বা নয়ন মুদি'' থাকে ব্রহ্ম-আরাধানে', E'কেহো মুক্ত-কচ্ছে ভজে, কেহো হাটু গাড়ি'' পূজে
কেহো বা নয়ন মুদি'' থাকে ব্রহ্ম-আরাধানে',
    E'keno
ār koro dveṣa, videśi-jana-bhajane
bhajanera
lińga nānā, nānā deśe nānā jane', E'кено
а̄р коро двеша, відеш́і-джана-бгаджане
бгаджанера
ліńґа на̄на̄, на̄на̄ деш́е на̄на̄ джане',
    E'', E'',
    E'Some people worship the Lord in an untidy or careless manner; some worship Him by
bending down on their knees; still others close their eyes while worshiping His
impersonal Brahman aspect.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'কেহো যোগাসনে পূজে, কেহো সঙ্কীর্তনে মজে
সকলে ভজিছে সেই এক-মাত্র কৃষ্ণ-ধনে', E'কেহো যোগাসনে পূজে, কেহো সঙ্কীর্তনে মজে
সকলে ভজিছে সেই এক-মাত্র কৃষ্ণ-ধনে',
    E'keho
mukta-kacche bhaje, keho hāṭu gāḍi'' pūje
keho
vā nayana mudi'' thāke brahma-ārādhāne', E'кехо
мукта-каччхе бгадже, кехо ха̄т̣у ґа̄д̣і'' пӯдже
кехо
ва̄ найана муді'' тха̄ке брахма-а̄ра̄дга̄не',
    E'', E'',
    E'Some people worship Him by assuming various yoga postures, and some immerse
themselves in the congregational chanting of the Lord''s holy names; but all of
them worship that one and only supreme treasure-Lord Sri Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'অতএব ভ্রাতৃ-ভাবে, থাকো সবে সু-সদ্ভাবে
হরি-ভক্তি সাধো সদা, এ জীবনে বা মরণে', E'অতএব ভ্রাতৃ-ভাবে, থাকো সবে সু-সদ্ভাবে
হরি-ভক্তি সাধো সদা, এ জীবনে বা মরণে',
    E'keho
yogāsane pūje, keho sańkīrtane maje
sakale
bhajiche sei eka-mātra kṛṣṇa-dhane', E'кехо
йоґа̄сане пӯдже, кехо саńкı̄ртане мадже
сакале
бгаджічхе сеі ека-ма̄тра кр̣шн̣а-дгане',
    E'', E'',
    E'Therefore you should all reflect a mood of brotherhood and live together in
transcendental friendship. Always practice devotional service to Lord Hari,
whether in situations of life or death.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'', E'',
    E'ataeva
bhrātṛ-bhāve, thāko sabe su-sadbhāve
hari-bhakti
sādho sadā, e jīvane vā maraṇe', E'атаева
бгра̄тр̣-бга̄ве, тха̄ко сабе су-садбга̄ве
харі-бгакті
са̄дго сада̄, е джı̄ване ва̄ маран̣е',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 9, Song 1: Bhajare Bhajare
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 9;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Bhajare Bhajare', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'ভজ রে ভজ রে আমার মন অতি মন্দ
(ভজন বিনা গতি নাই রে)
(ভজ) ব্রজ-বনে রাধা-কৃষ্ণ-চরণারবিন্দ
(জ্ঞান-কর্ম পরিহরি'' রে)
(ভজ) (ব্রজ-বনে রাধা-কৃষ্ণ)', E'ভজ রে ভজ রে আমার মন অতি মন্দ
(ভজন বিনা গতি নাই রে)
(ভজ) ব্রজ-বনে রাধা-কৃষ্ণ-চরণারবিন্দ
(জ্ঞান-কর্ম পরিহরি'' রে)
(ভজ) (ব্রজ-বনে রাধা-কৃষ্ণ)',
    E'Song
Name: Bhaja Re Bhaja Re Amar
Official
Name: Bhajan Gita Song 1
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Бхаджа Ре Бхаджа Ре Амар
Оffічіал
Наме: Бхаджан Ґіта Сонґ 1
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) My
dear mind, how foolish you are! Oh just worship, oh just worship the lotus feet
of Radha and Krsna in the forests of Vraja! (Oh, without such worship there is
no means of spiritual advancement!) Just worship the lotus feet of Radha and
Krsna in the forests of Vraja! (Oh, giving up all speculative knowledge and
materialistic activities!)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'(ভজ) গৌর-গদাধরাদ্বৈত গুরু-নিত্যানন্দ
(গৌর-কৃষ্ণএ অভেদ জেনে'' রে)
(গুরু কৃষ্ণ-প্রেষ্ঠ জেনে'' রে)
(স্মর) শ্রীনিবাস, হরিদাস, মুরারি, মুকুন্দ
(গৌর-প্রেমে স্মর, স্মর রে)
(স্মর) (শ্রীনিবাস হরিদাসে)', E'(ভজ) গৌর-গদাধরাদ্বৈত গুরু-নিত্যানন্দ
(গৌর-কৃষ্ণএ অভেদ জেনে'' রে)
(গুরু কৃষ্ণ-প্রেষ্ঠ জেনে'' রে)
(স্মর) শ্রীনিবাস, হরিদাস, মুরারি, মুকুন্দ
(গৌর-প্রেমে স্মর, স্মর রে)
(স্মর) (শ্রীনিবাস হরিদাসে)',
    E'bhaja
re bhaja re āmār mana ati manda
(bhajan
vinā gati nāi re)
(bhaja)
braja-bane rādhā-kṛṣṇa-caraṇāravinda
(jñāna-karma
parihari'' re)
(bhaja)
(braja-bane rādhā-kṛṣṇa)', E'бгаджа
ре бгаджа ре а̄ма̄р мана аті манда
(бгаджан
віна̄ ґаті на̄і ре)
(бгаджа)
браджа-бане ра̄дга̄-кр̣шн̣а-чаран̣а̄равінда
(джн̃а̄на-карма
паріхарі'' ре)
(бгаджа)
(браджа-бане ра̄дга̄-кр̣шн̣а)',
    E'', E'',
    E'Just worship Gaura, Gadadhara, Advaita, and Lord Nityananda, the original
spiritual master! (Oh, knowing Lord Gaura and Lord Krsna to be the same!) (Oh,
knowing the spiritual master to be very dear to Krsna!) Just remember the dear
associates of Lord Caitanya, namely Srivasa Thakura, Haridasa Thakura, Murari
Gupta, and Mukunda Datta! (Oh, in deep love for Lord Gaura, you should
remember, just remember!) (Just remember the two great personalities Srivasa
Thakura and Haridasa Thakura!)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'(স্মর) রূপ-সনাতন-জীব-রঘুনাথ-দ্বন্দ্ব
(কৃষ্ণ-ভজন যদি করবে রে)
(রূপ-সনাতনে স্মর)
(স্মর) রাঘব-গোপাল-ভট্ট স্বরূপ-রামানন্দ
(কৃষ্ণ-প্রেম যদি চাও রে)
(স্বরূপ-রামানন্দে স্মর)', E'(স্মর) রূপ-সনাতন-জীব-রঘুনাথ-দ্বন্দ্ব
(কৃষ্ণ-ভজন যদি করবে রে)
(রূপ-সনাতনে স্মর)
(স্মর) রাঘব-গোপাল-ভট্ট স্বরূপ-রামানন্দ
(কৃষ্ণ-প্রেম যদি চাও রে)
(স্বরূপ-রামানন্দে স্মর)',
    E'(bhaja)
gaura-gadādharādwaita guru-nityānanda
(gaura-kṛṣṇae
abheda jene'' re)
(guru
kṛṣṇa-preṣṭha jene'' re)
(smara)
śrīnivās, haridās, murāri, mukunda
(gaura-preme
smara, smara re)
(smara)
(śrīnivās haridāse)', E'(бгаджа)
ґаура-ґада̄дгара̄дваіта ґуру-нітйа̄нанда
(ґаура-кр̣шн̣ае
абгеда джене'' ре)
(ґуру
кр̣шн̣а-прешт̣ха джене'' ре)
(смара)
ш́рı̄ніва̄с, харіда̄с, мура̄рі, мукунда
(ґаура-преме
смара, смара ре)
(смара)
(ш́рı̄ніва̄с харіда̄се)',
    E'', E'',
    E'Just remember Sri Rupa Goswami, Sanatana, Jiva, and the two Raghunathas! (Oh,
if you are engaged in worshiping Lord Krsna!) (Just remember the two great
souls Sri Rupa Goswami and Sanatana Goswami!) Just remember Raghava Pandita,
Gopal Bhatta Goswami, Svarupa Damodara Goswami, and Ramananda Raya! (Oh, if you
really seek love of Krsna!) (Just remember Svarupa Damodara Goswami and
Ramananda Raya!)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'(স্মর) গোষ্ঠি-সহ কর্ণপূর, সেন শিবানন্দ
(অজস্র স্মর, স্মর রে)
(গোষ্ঠি-সহ কর্নপূরে)
(স্মর) রূপানুগ সাধু-জন ভজন-আনন্দ
(ব্রজে বাস যদি চাও রে)
(রূপানুগ সাধু স্মর)', E'(স্মর) গোষ্ঠি-সহ কর্ণপূর, সেন শিবানন্দ
(অজস্র স্মর, স্মর রে)
(গোষ্ঠি-সহ কর্নপূরে)
(স্মর) রূপানুগ সাধু-জন ভজন-আনন্দ
(ব্রজে বাস যদি চাও রে)
(রূপানুগ সাধু স্মর)',
    E'(smara)
rūpa-sanātana-jīva-raghunātha-dvandva
(kṛṣṇa-bhajan
jadi korbe re)
(rūpa-sanātane
smara)
(smara)
rāghava-gopāla-bhaṭṭa swarūpa-rāmānanda
(kṛṣṇa-prema
jadi cāo re)
(swarūpa-rāmānande
smara)', E'(смара)
рӯпа-сана̄тана-джı̄ва-раґгуна̄тха-двандва
(кр̣шн̣а-бгаджан
джаді корбе ре)
(рӯпа-сана̄тане
смара)
(смара)
ра̄ґгава-ґопа̄ла-бгат̣т̣а сварӯпа-ра̄ма̄нанда
(кр̣шн̣а-према
джаді ча̄о ре)
(сварӯпа-ра̄ма̄нанде
смара)',
    E'', E'',
    E'Just remember Srila Kavi Karnapura and all his family members, especially his
father, Sivananda Sena! (Oh, always remember, always remember!) (Sri Kavi
Karnapura and his family!) Just remember all the sadhus who follow the path of
Sri Rupa Goswami and who are absorbed in the ecstasy of bhajan! (Oh, if you
actually want residence in the land of Vraja!) (Just remember the sadhus who
are followers of Srila Rupa Goswami!)
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'', E'',
    E'(smara)
goṣṭhi-saha karṇapūra, sena śivānanda
(ajasra
smara, smara re)
(goṣṭhi-saha
karnapūre)
(smara)
rūpānuga sādhu-jana bhajana-ānanda
(braje
bās jadi cāo re)
(rūpānuga
sādhu smara)', E'(смара)
ґошт̣хі-саха карн̣апӯра, сена ш́іва̄нанда
(аджасра
смара, смара ре)
(ґошт̣хі-саха
карнапӯре)
(смара)
рӯпа̄нуґа са̄дгу-джана бгаджана-а̄нанда
(брадже
ба̄с джаді ча̄о ре)
(рӯпа̄нуґа
са̄дгу смара)',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 9, Song 2: Bhavona Bhavona
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 9;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Bhavona Bhavona', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'ভাবো না ভাবো না, মন, তুমি অতি দুষ্ট
(বিষয়-বিষে আছো হে)
কাম-ক্রোধ-লোভ-মোহ-মদাদি-আবিষ্ট
(রিপুর বশে আছো হে)', E'ভাবো না ভাবো না, মন, তুমি অতি দুষ্ট
(বিষয়-বিষে আছো হে)
কাম-ক্রোধ-লোভ-মোহ-মদাদি-আবিষ্ট
(রিপুর বশে আছো হে)',
    E'Song
Name: Bhavo Na Bhavo Na
Official
Name: Bhajana-Gita Song 2
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Бхаво На Бхаво На
Оffічіал
Наме: Бхаджана-Ґіта Сонґ 2
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) My
dear mind, you have not thought of this! You have not thought of this! You are
very wicked! (Oh, you are deeply sunk in the poison of worldly sense
gratification!) You are overwhelmed by lust, anger, greed, illusion, madness,
and so on! (Oh, you are under the sway of the enemy!)
2) You
are attracted by a thirst for hearing mundane news, enjoying material sense
objects, and seeking liberation! (Oh, you think that nonsensical talk sounds
very pleasant!) You have become crushed by the desire for fame, as well as by
hypocrisy and crooked dealings! (Oh, you are not very simple or
straightforward!) You are completely surrounded, dear brother, by all these
inauspicious signs of death! (Oh, these are indeed your deadly enemies!)
3) If
you do not give up all these things, then how will you attain Radha and Krsna?
(Oh, carefully abandon, just abandon them!) Other than the association of
sadhus, where else is your real benefit to be found? (Oh, just keep the
company, keep the company of saintly devotees!) Just immerse yourself in the
lotus feet of a Vaisnava, and all unwanted things will disappear! (Oh, just
think about all of this for once and see for yourself!)
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'অসদ-বার্তা-ভুক্তি-মুক্তি-পিপাসা-আকৃষ্ট
(অসত-কথা ভাল লাগে হে)
প্রতিষ্ঠাশা-কুটিনাটি-শঠতাদি-পিষ্ট
(সরল তো'' হ''লে না হে)
ঘিরেছে তোমারে, ভাই, এ সব অরিষ্ট
(এ সব তো'' শত্রু হে)', E'অসদ-বার্তা-ভুক্তি-মুক্তি-পিপাসা-আকৃষ্ট
(অসত-কথা ভাল লাগে হে)
প্রতিষ্ঠাশা-কুটিনাটি-শঠতাদি-পিষ্ট
(সরল তো'' হ''লে না হে)
ঘিরেছে তোমারে, ভাই, এ সব অরিষ্ট
(এ সব তো'' শত্রু হে)',
    E'bhāvo
nā bhāvo nā, mana, tumi ati duṣṭa
(viṣaya-viṣe
ācho he)
kāma-krodha-lobha-moha-madādi-āviṣṭa
(ripur
baśe ācho he)', E'бга̄во
на̄ бга̄во на̄, мана, тумі аті душт̣а
(вішайа-віше
а̄чхо хе)
ка̄ма-кродга-лобга-моха-мада̄ді-а̄вішт̣а
(ріпур
баш́е а̄чхо хе)',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'এ সব না ছেড়ে'' কিসে পা''বে রাধা-কৃষ্ণ
(যতনে ছাড়, ছাড় হে)
সাধু-সঙ্গ বিনা আর কোথা তব ইষ্ট
(সাধু-সঙ্গ কর, কর হে)
বৈষ্ণব-চরণে মজ, ঘুচিবে অনিষ্ট
(এক-বার ভেবে'' দেখো হে)', E'এ সব না ছেড়ে'' কিসে পা''বে রাধা-কৃষ্ণ
(যতনে ছাড়, ছাড় হে)
সাধু-সঙ্গ বিনা আর কোথা তব ইষ্ট
(সাধু-সঙ্গ কর, কর হে)
বৈষ্ণব-চরণে মজ, ঘুচিবে অনিষ্ট
(এক-বার ভেবে'' দেখো হে)',
    E'asad-vārtā-bhukti-mukti-pipāsā-ākṛṣṭa
(asat-kathā
bhālo lāge he)
pratiṣṭhāśā-kuṭināṭi-śaṭhatādi-piṣṭa
(sarala
to'' ho''le nā he)
ghireche
tomāre, bhāi, e sab ariṣṭa
(e
sab to'' śatru he)', E'асад-ва̄рта̄-бгукті-мукті-піпа̄са̄-а̄кр̣шт̣а
(асат-катха̄
бга̄ло ла̄ґе хе)
пратішт̣ха̄ш́а̄-кут̣іна̄т̣і-ш́ат̣хата̄ді-пішт̣а
(сарала
то'' хо''ле на̄ хе)
ґгіречхе
тома̄ре, бга̄і, е саб арішт̣а
(е
саб то'' ш́атру хе)',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'', E'',
    E'e
sab nā cheḍe'' kise pā''be
rādhā-kṛṣṇa
(jatane
chāḍo, chāḍo he)
sādhu-sańga
vinā ār kothā tava iṣṭa
(sādhu-sańga
koro, koro he)
vaiṣṇava-caraṇe
maja, ghucibe aniṣṭa
(ek-bār
bheve'' dekho he)', E'е
саб на̄ чхед̣е'' кісе па̄''бе
ра̄дга̄-кр̣шн̣а
(джатане
чха̄д̣о, чха̄д̣о хе)
са̄дгу-саńґа
віна̄ а̄р котха̄ тава ішт̣а
(са̄дгу-саńґа
коро, коро хе)
ваішн̣ава-чаран̣е
маджа, ґгучібе анішт̣а
(ек-ба̄р
бгеве'' декхо хе)',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 10, Song 1: Prem Se Kaho Sri Krsna
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 10;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Prem Se Kaho Sri Krsna', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'', E'',
    E'Song
Name: Premse Kaho Sri Krsna Caitanya
Official
Name: Gitavalir Prema Dhvani
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ
premse koho
śrī kṛṣṇa-caitanya-nityānanda-
advaita-gadādhara-śrīvāsa-panḍita
kī jaya!
śrī
antardvīpa māyāpura, sīmanta, godruma, madhyadvīpa,
koladvīpa, ṛtudvīpa,
jahnudvīpa,
modadruma, rudradvīpātmaka śrī navadvīpa-dhāma
kī jaya!
śrī
rādhā-kṛṣṇa-gopa-gopī-go-govardhana-
vṛndāvana-rādhā-kunḍa-yamunājī
kī jaya!
śrī
tulasī-devī kī jaya!
śrī
gańgājī kī jaya!
śrī
surabhi-kuñja kī jaya!
śrī
nām haṭṭa kī jaya!
śrī
bhakti-devī kī jaya!
śrī
gāyaka, śrotā, bhakta-vṛnda kī jaya!
(pare
sāṣṭāńga-daṇḍavat)', E'Сонґ
Наме: Премсе Кахо Срі Крсна Чаітанйа
Оffічіал
Наме: Ґітавалір Према Дхвані
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ
премсе кохо
ш́рı̄ кр̣шн̣а-чаітанйа-нітйа̄нанда-
адваіта-ґада̄дгара-ш́рı̄ва̄са-панд̣іта
кı̄ джайа!
ш́рı̄
антардвı̄па ма̄йа̄пура, сı̄манта, ґодрума, мадгйадвı̄па,
коладвı̄па, р̣тудвı̄па,
джахнудвı̄па,
модадрума, рудрадвı̄па̄тмака ш́рı̄ навадвı̄па-дга̄ма
кı̄ джайа!
ш́рı̄
ра̄дга̄-кр̣шн̣а-ґопа-ґопı̄-ґо-ґовардгана-
вр̣нда̄вана-ра̄дга̄-кунд̣а-йамуна̄джı̄
кı̄ джайа!
ш́рı̄
туласı̄-девı̄ кı̄ джайа!
ш́рı̄
ґаńґа̄джı̄ кı̄ джайа!
ш́рı̄
сурабгі-кун̃джа кı̄ джайа!
ш́рı̄
на̄м хат̣т̣а кı̄ джайа!
ш́рı̄
бгакті-девı̄ кı̄ джайа!
ш́рı̄
ґа̄йака, ш́рота̄, бгакта-вр̣нда кı̄ джайа!
(паре
са̄шт̣а̄ńґа-дан̣д̣ават)',
    E'', E'',
    E'With
love, say, All glories to Sri Krsna Caitanya, Sri Nityananda, Sri Advaita
Acarya, Sri Gadadhara prabhu, Srivasa Pandita!
All
glories to the nine islands of Navadvipa (Simanta, Godruma, Madhyadvipa, Koladvipa,
Rtudvipa, Jahnudvipa, Modadruma, Rudradvīpātmaka),
and Mayapura!
All
glories to Sri Sri Radha Krsna, the cowherd boys and cowherd girls, the cows, Govardhana
Hill, Vrndavana, Radha Kunda, and the River Yamuna!
All
glories to Tulasi Devi! All Glories to Ganga Devi! All glories to Surabhi
Kunja! All Glories to the Marketplace of the Holy Name! All glories to Bhakti
devi, the deity of devotional service!
All
glories to singers, listeners, and the devotees!
(Fall and
offers humble dandavat obeisances)
REMARKS/EXTRA
INFORMATION:
This
is the specialized Prema Dhvani found in the Gitavali.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 11, Song 1: Sri Rupa Vadane Sri Saci
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 11;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Sri Rupa Vadane Sri Saci', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'শ্রী-রূপ-বদনে শ্রী-শচী-কুমার
স্ব-নাম-মহিমা করল প্রচার', E'শ্রী-রূপ-বদনে শ্রী-শচী-কুমার
স্ব-নাম-মহিমা করল প্রচার',
    E'Song
Name: Sri Rupa Vadane Sri Saci Kumar
Official
Name: Namastakam Song 1
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Срі Рупа Вадане Срі Сачі Кумар
Оffічіал
Наме: Намастакам Сонґ 1
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Through the mouth of Srila Rupa Gosvami, Krsna, in the form of Lord Caitanya,
the son of Mother Saci, preached the glories of His own holy name.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'যো নাম, সো হরি-কছু নাহি ভেদ
সো নাম সত্য-মিতি গায়তি বেদ', E'যো নাম, সো হরি-কছু নাহি ভেদ
সো নাম সত্য-মিতি গায়তি বেদ',
    E'śrī-rūpa-vadane
śrī-śacī-kumār
swa-nām-mahimā
koralo pracār', E'ш́рı̄-рӯпа-вадане
ш́рı̄-ш́ачı̄-кума̄р
сва-на̄м-махіма̄
корало прача̄р',
    E'', E'',
    E'There is no difference between that holy name of Lord Hari and Lord Hari
Himself. The Vedic scriptures sing of the true value and glory of the holy
name.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'সবু উপনিষদ, রত্ন-মালা-দ্যুতি,
ঝকমকি'' চরণ-সমীপে
মঙ্গল-আরতি, কর-ই অনুক্ষন,
দ্বি-গুনিত-পঞ্চ-প্রদীপে', E'সবু উপনিষদ, রত্ন-মালা-দ্যুতি,
ঝকমকি'' চরণ-সমীপে
মঙ্গল-আরতি, কর-ই অনুক্ষন,
দ্বি-গুনিত-পঞ্চ-প্রদীপে',
    E'jo
nām, so harikachu nāhi bheda
so
nām satya-miti gāyati veda', E'джо
на̄м, со харікачху на̄хі бгеда
со
на̄м сатйа-міті ґа̄йаті веда',
    E'', E'',
    E'All the Upanisads are like a necklace of beautifully effulgent jewels shining
before the lotus feet of the holy name.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'চৌদ্দ ভুবন মাহ, দেব-নর-দানব,
ভাগ জাঙ্কর বলবান
নাম-রস-পীয়ুষ, পিবো-ই অনুক্ষন,
ছোড়ত করম-গেয়ান', E'চৌদ্দ ভুবন মাহ, দেব-নর-দানব,
ভাগ জাঙ্কর বলবান
নাম-রস-পীয়ুষ, পিবো-ই অনুক্ষন,
ছোড়ত করম-গেয়ান',
    E'sabu
upaniṣada, ratna-mālā-dyuti,
jhakamaki''
caraṇa-samīpe', E'сабу
упанішада, ратна-ма̄ла̄-дйуті,
джхакамакі''
чаран̣а-самı̄пе',
    E'', E'',
    E'They are perpetually performing mangala arati for the holy name with arati
lamps of ten ghee wicks.
5-7)
Within the fourteen worlds , those demigods, men and demons whose fortune is
very great, perpetually drink the nectar of the sweet mellows of the holy name,
casting aside all kinds of fruitive activities and speculative forms of
knowledge.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'নিত্য-মুক্ত পুনঃ, নাম-উপাসন,
সতত কর-ই সাম-গানে
গোলোকে বৈঠত, গাওয়ে নিরন্তর,
নাম-বিরহ নাহি জানে', E'নিত্য-মুক্ত পুনঃ, নাম-উপাসন,
সতত কর-ই সাম-গানে
গোলোকে বৈঠত, গাওয়ে নিরন্তর,
নাম-বিরহ নাহি জানে',
    E'mańgala-ārati,
koro-i anukṣana,
dvi-gunita-pañca-pradīpe', E'маńґала-а̄раті,
коро-і анукшана,
дві-ґуніта-пан̃ча-прадı̄пе',
    E'', E'',
    E'The eternally liberated souls, however, always worship the holy name in
beautifully composed hymns and songs and sit in Goloka Vrndavana constantly
singing the name. Therefore they do not know any separation from the holy name.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'সবু-রস-আকর, হরি'' ইতি দ্ব্যক্ষর,
সবু-ভাবে করলুঁ আশ্রয়
নাম চরণে প''ড়ি, ভক্তিবিনোদ কোহে,
তুয়া পদে মাগহুঁ নিলয়', E'সবু-রস-আকর, হরি'' ইতি দ্ব্যক্ষর,
সবু-ভাবে করলুঁ আশ্রয়
নাম চরণে প''ড়ি, ভক্তিবিনোদ কোহে,
তুয়া পদে মাগহুঁ নিলয়',
    E'caudda
bhuvana māha, deva-nara-dānava,
bhāga
jāńkara balavān', E'чаудда
бгувана ма̄ха, дева-нара-да̄нава,
бга̄ґа
джа̄ńкара балава̄н',
    E'', E'',
    E'The two syllables ha and ri are a mine of all devotional mellows. All the
ecstasies of devotion have taken shelter in them.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'', E'',
    E'nāma-rasa-pīyuṣa,
pibo-i anukṣana,
choḍata
karama-geyān', E'на̄ма-раса-пı̄йуша,
пібо-і анукшана,
чход̣ата
карама-ґейа̄н',
    E'', E'',
    E'Falling at the lotus feet of the holy name, Thakura Bhaktivinoda says, O
Harinam, I pray for residence at Your lotus feet.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'', E'',
    E'nitya-mukta
punaḥ, nāma-upāsana,
satata
koro-i sāma-gāne', E'нітйа-мукта
пунах̣, на̄ма-упа̄сана,
сатата
коро-і са̄ма-ґа̄не',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'', E'',
    E'goloke
baiṭhata, gāowe nirantara,
nāma-viraha
nāhi jāne', E'ґолоке
баіт̣хата, ґа̄ове нірантара,
на̄ма-віраха
на̄хі джа̄не',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 10
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10', 10,
    E'', E'',
    E'sabu-rasa-ākara,
`hari'' iti dvy-akṣara,
sabu-bhāve
koraluń āśroy', E'сабу-раса-а̄кара,
`харі'' іті двй-акшара,
сабу-бга̄ве
коралуń а̄ш́рой',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 11
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11', 11,
    E'', E'',
    E'nāma
caraṇe pa''ḍi, bhaktivinoda kohe,
tuwā
pade māgahuń niloy', E'на̄ма
чаран̣е па''д̣і, бгактівінода кохе,
тува̄
паде ма̄ґахуń нілой',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 11, Song 2: Jaya Jaya Hari Nam
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 11;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Jaya Jaya Hari Nam', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'জয় জয় হরিনাম, চিদানন্দামৃত-ধাম,
পর-তত্ত্ব অক্ষর-আকার
নিজ-জনে কৃপা করি'', নাম-রূপে অবতরি'',
জীবে দয়া করিলে অপার', E'জয় জয় হরিনাম, চিদানন্দামৃত-ধাম,
পর-তত্ত্ব অক্ষর-আকার
নিজ-জনে কৃপা করি'', নাম-রূপে অবতরি'',
জীবে দয়া করিলে অপার',
    E'Song
Name: Jaya Jaya Harinama
Official
Name: Sri Namastaka Song 2
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Джайа Джайа Харінама
Оffічіал
Наме: Срі Намастака Сонґ 2
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) All
glories, all glories to the holy name, the abode of immortal transcendental
bliss. The Supreme Absolute Truth, who possesses an eternal form, has descended
in the form of the holy name. He shows mercy to His devotees and shows
boundless compassion and kindness to all fallen souls.
2) All
glories to the Supreme Personality of Godhead who is called by different names
such as Hari, Krsna and Rama. He is the auspicious resting place of all living
entities within the universe, and He delights the minds of all souls. Great
sages, honoring His holy name, constantly sing that holy name, filling their
mouths with the sound.
3) O
eternal holy name of Krishna, You possess all powers and bestow auspiciousness
upon the living beings. Without You there is no other friend to deliver us from
the ocean of material existence. You have come for the deliverance of all
fallen souls.
4) For
all souls within this world there is much misery and sorrow. O Harinam, if
someone calls upon You just one time, feeling himself very meek and lowly,
possessing nothing and seeing no other remedy for his relief, You then easily
destroy all his sorrows.
5) If
one simply obtains a slight reflection or glimmer of You, then all sorts of
terrible miseries disappear. Thakura Bhaktivinoda says, All glories, all
glories to the holy name of Lord Hari! O Harinam, I perpetually fall at Your
lotus feet.
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'জয় হরি'', কৃষ্ণ'', রাম'', জগ-জন-সুবিশ্রাম,
সর্ব-জন-মানস-রঞ্জন
মুনি-বৃন্দ নিরন্তর, যে নামের সমাদর,
করি'' গায় ভরিয়া বদন', E'জয় হরি'', কৃষ্ণ'', রাম'', জগ-জন-সুবিশ্রাম,
সর্ব-জন-মানস-রঞ্জন
মুনি-বৃন্দ নিরন্তর, যে নামের সমাদর,
করি'' গায় ভরিয়া বদন',
    E'jaya
jaya harinām, cidānandāmṛta-dhām,
para-tattva
akṣara-ākār
nija-jane
kṛpā kori'', nāma-rūpe avatari'',
jīve
doyā korile apār', E'джайа
джайа харіна̄м, чіда̄нанда̄мр̣та-дга̄м,
пара-таттва
акшара-а̄ка̄р
ніджа-джане
кр̣па̄ корі'', на̄ма-рӯпе аватарі'',
джı̄ве
дойа̄ коріле апа̄р',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'ওহে কৃষ্ণ-নামাক্ষর, তুমি সর্ব-শক্তি-ধর,
জীবের কল্যান-বিতরণে
তোমা বিনা ভব-সিন্ধু, উদ্ধারিতে নাহি বন্ধু,
আসিয়াছো জীব-উদ্ধারণে', E'ওহে কৃষ্ণ-নামাক্ষর, তুমি সর্ব-শক্তি-ধর,
জীবের কল্যান-বিতরণে
তোমা বিনা ভব-সিন্ধু, উদ্ধারিতে নাহি বন্ধু,
আসিয়াছো জীব-উদ্ধারণে',
    E'jaya
`hari'', `kṛṣṇa'', `rām'', jaga-jana-suviśrām,
sarva-jana-mānasa-rañjana
muni-vṛnda
nirantar, je nāmera samādar,
kori''
gāy bhoriyā vadana', E'джайа
`харі'', `кр̣шн̣а'', `ра̄м'', джаґа-джана-сувіш́ра̄м,
сарва-джана-ма̄наса-ран̃джана
муні-вр̣нда
нірантар, дже на̄мера сама̄дар,
корі''
ґа̄й бгорійа̄ вадана',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'আছে তাপ জীবে যত, তুমি সব কর হত,
হেলায় তোমারে এক-বার
ডাকে যদি কোনো জন, হ''য়ে দীন অকিঞ্চন,
নাহি দেখি'' অন্য প্রতিকার', E'আছে তাপ জীবে যত, তুমি সব কর হত,
হেলায় তোমারে এক-বার
ডাকে যদি কোনো জন, হ''য়ে দীন অকিঞ্চন,
নাহি দেখি'' অন্য প্রতিকার',
    E'ohe
kṛṣṇa-nāmākṣar, tumi sarva-śakti-dhar,
jīvera
kalyāna-vitaraṇe
tomā
vinā bhava-sindhu, uddhārite nāhi bandhu,
āsiyācho
jīva-uddhāraṇe', E'охе
кр̣шн̣а-на̄ма̄кшар, тумі сарва-ш́акті-дгар,
джı̄вера
калйа̄на-вітаран̣е
тома̄
віна̄ бгава-сіндгу, уддга̄ріте на̄хі бандгу,
а̄сійа̄чхо
джı̄ва-уддга̄ран̣е',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'তব স্বল্প-স্ফূর্তি পায়, উগ্র-তাপ দূরে যায়,
লিঙ্গ-ভঙ্গ হয় অনায়াসে
ভকতিবিনোদ কয়, জয় হরিনাম জয়,
পড়ে'' থাকি তুয়া পদ-আশে', E'তব স্বল্প-স্ফূর্তি পায়, উগ্র-তাপ দূরে যায়,
লিঙ্গ-ভঙ্গ হয় অনায়াসে
ভকতিবিনোদ কয়, জয় হরিনাম জয়,
পড়ে'' থাকি তুয়া পদ-আশে',
    E'āche
tāpa jīve jata, tumi saba koro hata,
helāya
tomāre eka-bār
ḍāke
jadi kono jan, ho''ye dīn akiñcan,
nāhi
dekhi'' anya pratikār', E'а̄чхе
та̄па джı̄ве джата, тумі саба коро хата,
хела̄йа
тома̄ре ека-ба̄р
д̣а̄ке
джаді коно джан, хо''йе дı̄н акін̃чан,
на̄хі
декхі'' анйа пратіка̄р',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'', E'',
    E'tava
svalpa-sphūrti pāy, ugra-tāpa dūre jāy,
lińga-bhańga
hoy anāyāse
bhakativinoda
koy, jaya harināma jay,
paḍe''
thāki tuwā pada-āśe', E'тава
свалпа-спхӯрті па̄й, уґра-та̄па дӯре джа̄й,
ліńґа-бгаńґа
хой ана̄йа̄се
бгакатівінода
кой, джайа харіна̄ма джай,
пад̣е''
тха̄кі тува̄ пада-а̄ш́е',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 11, Song 3: Visva Udita Nama Tapan
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 11;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Visva Udita Nama Tapan', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'বিশ্বে উদিত, নাম-তপন,
অবিদ্যা-বিনাশ লাগি''
ছোড়ত সব, মায়া-বিভব,
সাধু তাহে অনুরাগী', E'বিশ্বে উদিত, নাম-তপন,
অবিদ্যা-বিনাশ লাগি''
ছোড়ত সব, মায়া-বিভব,
সাধু তাহে অনুরাগী',
    E'Song
Name: Visva Udita Nama Tapan
Official
Name: Namastakam Song 3
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Вісва Удіта Нама Тапан
Оffічіал
Наме: Намастакам Сонґ 3
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) The
sun of the holy name has appeared in the universe to destroy all forms of
ignorance. Casting aside all worldly things, the saintly become devoted to Him
alone.
2) The
sun of the holy name is the remover of the darkness of ignorance. O Harinam,
who actually knows Your greatness? What sort of learned man is capable of
singing all Your glories?
3) O
holy name, from the very moment You first appear on the horizon of the heart,
the darkness of this material world is almost totally devoured.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'হরিনাম-প্রভাকর, অবিদ্যা-তিমির-হর,
তোমার মহিমা কেবা জানে
কে হেনো পণ্ডিত-জন, তোমার মাহাত্ম্য-গণ,
উচ্চৈঃ-স্বরে সকল বাখানে', E'হরিনাম-প্রভাকর, অবিদ্যা-তিমির-হর,
তোমার মহিমা কেবা জানে
কে হেনো পণ্ডিত-জন, তোমার মাহাত্ম্য-গণ,
উচ্চৈঃ-স্বরে সকল বাখানে',
    E'viśve
udita, nāma-tapan,
avidyā-vināśa
lāgi''
choḍata
saba, māyā-vibhava,
sādhu
tāhe anurāgī', E'віш́ве
удіта, на̄ма-тапан,
авідйа̄-віна̄ш́а
ла̄ґі''
чход̣ата
саба, ма̄йа̄-вібгава,
са̄дгу
та̄хе анура̄ґı̄',
    E'', E'',
    E'Quickly destroying all remaining darkness, You bestow divine wisdom upon our
spiritually blinded eyes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'তোমার আভাস পহিলহি ভায়
এ ভব-তিমির কবলিত-প্রায়', E'তোমার আভাস পহিলহি ভায়
এ ভব-তিমির কবলিত-প্রায়',
    E'harināma-prabhākara,
avidyā-timira-hara,
tomār
mahimā kebā jāne
ke
heno paṇḍita-jan, tomāra māhātmya-gaṇ,
uccaiḥ-sware
sakala bākhāne', E'харіна̄ма-прабга̄кара,
авідйа̄-тіміра-хара,
тома̄р
махіма̄ кеба̄ джа̄не
ке
хено пан̣д̣іта-джан, тома̄ра ма̄ха̄тмйа-ґан̣,
уччаіх̣-сваре
сакала ба̄кха̄не',
    E'', E'',
    E'That divine wisdom gives rise within the heart to pure devotion and an
understanding of the transcendental characteristics of Lord Hari.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'অচিরে তিমির নাশিয়া প্রজ্ঞান
তত্ত্বান্ধ-নয়নে করেন বিধান', E'অচিরে তিমির নাশিয়া প্রজ্ঞান
তত্ত্বান্ধ-নয়নে করেন বিধান',
    E'tomāra
ābhās pahilohi bhāy
e
bhava-timira kavalita-prāy', E'тома̄ра
а̄бга̄с пахілохі бга̄й
е
бгава-тіміра каваліта-пра̄й',
    E'', E'',
    E'This wonderful pastime of Yours is eternal and Thakura Bhaktivinoda has
understood its essence.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'সেই তো'' প্রজ্ঞান বিশুদ্ধ ভকতি
উপজায় হরি-বিষয়িনী মতি', E'সেই তো'' প্রজ্ঞান বিশুদ্ধ ভকতি
উপজায় হরি-বিষয়িনী মতি',
    E'acire
timira nāśiyā prajñān
tattvāndha-nayane
korena vidhān', E'ачіре
тіміра на̄ш́ійа̄ праджн̃а̄н
таттва̄ндга-найане
корена відга̄н',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'এ অদ্ভুত-লীলা সতত তোমার
ভকতিবিনোদ জানিয়াছে সার', E'এ অদ্ভুত-লীলা সতত তোমার
ভকতিবিনোদ জানিয়াছে সার',
    E'sei
to'' prajñān viśuddha bhakati
upajāy
hari-viṣayinī mati', E'сеі
то'' праджн̃а̄н віш́уддга бгакаті
упаджа̄й
харі-вішайінı̄ маті',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'', E'',
    E'e
adbhuta-līlā satata tomār
bhakativinoda
jāniyāche sār', E'е
адбгута-лı̄ла̄ сатата тома̄р
бгакатівінода
джа̄нійа̄чхе са̄р',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 11, Song 4: Jnani Jnana Joge
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 11;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Jnani Jnana Joge', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'জ্ঞানী জ্ঞান-যোগে, করিয়া যতনে,
ব্রহ্মের সাক্ষাত করে
ব্রহ্ম-সাক্ষাত্কার, অপ্ররাব্ধ কর্ম,
সম্পূর্ন জ্ঞানেতে হরে', E'জ্ঞানী জ্ঞান-যোগে, করিয়া যতনে,
ব্রহ্মের সাক্ষাত করে
ব্রহ্ম-সাক্ষাত্কার, অপ্ররাব্ধ কর্ম,
সম্পূর্ন জ্ঞানেতে হরে',
    E'Song
Name: Jnani Jnana Yoge Koriya Jatane
Official
Name: Sri Namastaka Song 4
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Джнані Джнана Йоґе Корійа Джатане
Оffічіал
Наме: Срі Намастака Сонґ 4
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'The learned man, endeavoring in the practice of jnana-yoga, eventually sees the
Supreme Brahman. That realization of Brahman, in full knowledge, removes all
the potential sinful reactions lying in his heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'তবু তো'' প্রারব্ধ, নাহি হয় ক্ষয়,
ফল-ভোগ বিনা কভু
ব্রহ্ম-ভূত জীব, ফল-ভোগ লাগি'',
জনম-মরণ লভু', E'তবু তো'' প্রারব্ধ, নাহি হয় ক্ষয়,
ফল-ভোগ বিনা কভু
ব্রহ্ম-ভূত জীব, ফল-ভোগ লাগি'',
জনম-মরণ লভু',
    E'jñānī
jñāna-yoge, koriyā jatane,
brahmera
sākṣāt kore
brahma-sākṣātkār,
aprarābdha karma,
sampūrna
jñānete hare', E'джн̃а̄нı̄
джн̃а̄на-йоґе, корійа̄ джатане,
брахмера
са̄кша̄т коре
брахма-са̄кша̄тка̄р,
апрара̄бдга карма,
сампӯрна
джн̃а̄нете харе',
    E'', E'',
    E'By dint of Brahman realization all such potential sinful reactions are
destroyed; but unless one undergoes the suffering of current sinful reactions,
they will not be destroyed. Therefore, despite being a Brahman realized soul,
even such a learned man must undergo the current reactions to his sins and thus
be implicated in the cycle of birth and death.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'কিন্তু ওহে নাম, তব স্ফূর্তি হ''লে,
একান্তী জনের আর
প্রারব্ধাপ্রারব্ধ, কিছু নাহি থাকে,
বেদে গায় বার বার', E'কিন্তু ওহে নাম, তব স্ফূর্তি হ''লে,
একান্তী জনের আর
প্রারব্ধাপ্রারব্ধ, কিছু নাহি থাকে,
বেদে গায় বার বার',
    E'tabu
to'' prārabdha, nāhi hoy kṣoy,
phala-bhoga
binā kabhu
brahma-bhūta
jīva, phala-bhoga lāgi'',
janama-maraṇa
labhu', E'табу
то'' пра̄рабдга, на̄хі хой кшой,
пхала-бгоґа
біна̄ кабгу
брахма-бгӯта
джı̄ва, пхала-бгоґа ла̄ґі'',
джанама-маран̣а
лабгу',
    E'', E'',
    E'But, O holy name, if You are vibrated on the tongue of Your unalloyed devotee,
then all of his sinful reactions of both past and present lives are completely
destroyed. This truth is sung by the Vedas again and again.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'তোমার উদয়ে, জীবের হৃদয়,
সম্পূর্ন শোধিত হয়
কর্ম-জ্ঞান-বন্ধ, সব দূরে যায়,
অনায়াসে ভব-ক্ষয়', E'তোমার উদয়ে, জীবের হৃদয়,
সম্পূর্ন শোধিত হয়
কর্ম-জ্ঞান-বন্ধ, সব দূরে যায়,
অনায়াসে ভব-ক্ষয়',
    E'kintu
ohe nāma, tava sphūrti ha''le,
ekāntī
janera āro
prārabdhāprārabdha,
kichu nāhi thāke,
vede
gāya bāro bāro', E'кінту
охе на̄ма, тава спхӯрті ха''ле,
ека̄нтı̄
джанера а̄ро
пра̄рабдга̄пра̄рабдга,
кічху на̄хі тха̄ке,
веде
ґа̄йа ба̄ро ба̄ро',
    E'', E'',
    E'O sun of the holy name, when You arise on the horizon of the living being''s
heart, it becomes completely purified, the bondage to materialistic activities
and speculative knowledge disappears and the soul''s worldly existence comes to
an end without any difficulty.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'ভকতিবিনোদ, বাহু তুলে'' কয়,
নামের নিশান ধর
নাম-ডঙ্কা-ধ্বনি, করিয়া যাইবে,
ভেটিবে মুরলীধর', E'ভকতিবিনোদ, বাহু তুলে'' কয়,
নামের নিশান ধর
নাম-ডঙ্কা-ধ্বনি, করিয়া যাইবে,
ভেটিবে মুরলীধর',
    E'tomāra
udaye, jīvera hṛdoya,
sampūrna
śodhita hoy
karma-jñāna-bandha,
saba dūre jāya,
anāyāse
bhava-kṣoy', E'тома̄ра
удайе, джı̄вера хр̣дойа,
сампӯрна
ш́одгіта хой
карма-джн̃а̄на-бандга,
саба дӯре джа̄йа,
ана̄йа̄се
бгава-кшой',
    E'', E'',
    E'Thakura Bhaktivinoda, raising his arms says, Take up the banners of the holy
name and walk along sounding the drum of the holy name. In this way you will
surely obtain the direct audience of Krsna, the holder of the flute.
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'', E'',
    E'bhakativinoda,
bāhu tule'' koy,
nāmera
niśāna dharo
nāma-ḍańkā-dhvani,
koriyā jāibe,
bheṭibe
muralīdharo', E'бгакатівінода,
ба̄ху туле'' кой,
на̄мера
ніш́а̄на дгаро
на̄ма-д̣аńка̄-дгвані,
корійа̄ джа̄ібе,
бгет̣ібе
муралı̄дгаро',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 11, Song 5: Hari Nam Tu Wa Anek
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 11;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Hari Nam Tu Wa Anek', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'হরিনাম, তুয়া অনেক স্বরূপ
যশোদা-নন্দন, আনন্দ-বর্ধন,
নন্দ-তনয় রস-কূপ', E'হরিনাম, তুয়া অনেক স্বরূপ
যশোদা-নন্দন, আনন্দ-বর্ধন,
নন্দ-তনয় রস-কূপ',
    E'Song
Name: Harinama Tuwa Anek Swarupa
Official
Name: Sri Namastaka Song 5
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Харінама Тува Анек Сварупа
Оffічіал
Наме: Срі Намастака Сонґ 5
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'O Harinama, You possess unlimited forms, such as the beloved son of Mother
Yasoda, the increaser of the bliss of Gokula, the son of Nanda, and the
reservoir of all transcendental mellows.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'পূতনা-ঘাতন, তৃনাবর্ত-হন,
শকট-ভঞ্জন গোপাল
মুরলী-বদন, অঘ-বক-মর্দন,
গোবর্ধন-ধারী রাখাল', E'পূতনা-ঘাতন, তৃনাবর্ত-হন,
শকট-ভঞ্জন গোপাল
মুরলী-বদন, অঘ-বক-মর্দন,
গোবর্ধন-ধারী রাখাল',
    E'harinām,
tuwā aneka swarūp
yaśodā-nandana,
ānanda-vardhana,
nanda-tanaya
rasa-kūp', E'харіна̄м,
тува̄ анека сварӯп
йаш́ода̄-нандана,
а̄нанда-вардгана,
нанда-танайа
раса-кӯп',
    E'', E'',
    E'You are the slayer of the demons Putana and Trnavarta, the breaker of the cart,
the protector of the cows, the player of the flute, the destroyer of the demons
Agha and Baka, the holder of Govardhan Hill, and You are a cowherd boy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'কেশী-মর্দন, ব্রহ্ম-বিমোহন,
সুরপতি-দর্প-বিনাশী
অরিষ্ট-পাতন, গোপী-বিমোহন,
যমুনা-পুলিন-বিলাসী', E'কেশী-মর্দন, ব্রহ্ম-বিমোহন,
সুরপতি-দর্প-বিনাশী
অরিষ্ট-পাতন, গোপী-বিমোহন,
যমুনা-পুলিন-বিলাসী',
    E'pūtanā-ghātana,
tṛnāvarta-hana,
śakaṭa-bhañjana
gopāl
muralī-vadana,
agha-baka-mardana,
govardhana-dhārī
rākhāl', E'пӯтана̄-ґга̄тана,
тр̣на̄варта-хана,
ш́акат̣а-бган̃джана
ґопа̄л
муралı̄-вадана,
аґга-бака-мардана,
ґовардгана-дга̄рı̄
ра̄кха̄л',
    E'', E'',
    E'You destroyed the Kesi demon, bewildered Lord Brahma, and broke the pride of
Indra, king of Heaven. You are the destroyer of Aristasura, the enchanter of
all the young girls of Gokula, and You sport along the sandy banks of the river
Yamuna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'রাধিকা-রঞ্জন, রাস-রসায়ন,
রাধা-কুণ্ড-কুঞ্জ-বিহারী
রাম, কৃষ্ণ, হরি, মাধব, নরহরি,
মত্স্যাদি-গণ-অবতারী', E'রাধিকা-রঞ্জন, রাস-রসায়ন,
রাধা-কুণ্ড-কুঞ্জ-বিহারী
রাম, কৃষ্ণ, হরি, মাধব, নরহরি,
মত্স্যাদি-গণ-অবতারী',
    E'keśī-mardana,
brahma-vimohana,
surapati-darpa-vināśī
ariṣṭa-pātana,
gopī-vimohana,
jamunā-pulina-vilāsī', E'кеш́ı̄-мардана,
брахма-вімохана,
сурапаті-дарпа-віна̄ш́ı̄
арішт̣а-па̄тана,
ґопı̄-вімохана,
джамуна̄-пуліна-віла̄сı̄',
    E'', E'',
    E'You delight Srimati Radhika and give life to the rasa dance. You sport in the
groves near Radha Kunda, performing a variety of pastimes. You are the
reservoir of pleasure, attractive to every living being. You remove all
inauspiciousness and are the husband of the goddess of fortune. You are the
source of all incarnations such as Lord Nrsimha, the half-man half-lion
incarnation and Matsya, the fish avatara.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'গোবিন্দ, বামন, শ্রী-মধুসূদন,
যাদব-চন্দ্র, বনমালী
কালিয়-শাতন, গোকুল-রঞ্জন,
রাধা-ভজন-সুখ-শালী', E'গোবিন্দ, বামন, শ্রী-মধুসূদন,
যাদব-চন্দ্র, বনমালী
কালিয়-শাতন, গোকুল-রঞ্জন,
রাধা-ভজন-সুখ-শালী',
    E'rādhikā-rañjana,
rāsa-rasāyana,
rādhā-kuṇḍa-kuñja-bihārī
rāma,
kṛṣṇa, hari, mādhava, narahari,
matsyādi-gaṇa-avatārī', E'ра̄дгіка̄-ран̃джана,
ра̄са-раса̄йана,
ра̄дга̄-кун̣д̣а-кун̃джа-біха̄рı̄
ра̄ма,
кр̣шн̣а, харі, ма̄дгава, нарахарі,
матсйа̄ді-ґан̣а-авата̄рı̄',
    E'', E'',
    E'O Harinam, You are pleasing to the cows, land and senses. You are the dwarf
brahmana incarnation (Vamana) and the slayer of the demon Madhu. You are the
moon of the Yadu dynasty and always wear beautiful garlands of fresh forest
flowers. You are the destroyer of the Kaliya serpent, the delighter of Gokula
and You rejoice in the worship of Srimati Radharani.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'ইত্যাদিক নাম, স্বরূপে প্রকাম,
বাডুক মোর রতি রাগে
রূপ-স্বরূপ-পদ, জানি'' নিজ সম্পদ,
ভক্তিবিনোদ ধরি'' মাগে', E'ইত্যাদিক নাম, স্বরূপে প্রকাম,
বাডুক মোর রতি রাগে
রূপ-স্বরূপ-পদ, জানি'' নিজ সম্পদ,
ভক্তিবিনোদ ধরি'' মাগে',
    E'govinda,
vāmana, śrī-madhusūdana,
yādava-candra,
vanamālī
kāliya-śātana,
gokula-rañjana,
rādhā-bhajana-sukha-śālī', E'ґовінда,
ва̄мана, ш́рı̄-мадгусӯдана,
йа̄дава-чандра,
ванама̄лı̄
ка̄лійа-ш́а̄тана,
ґокула-ран̃джана,
ра̄дга̄-бгаджана-сукха-ш́а̄лı̄',
    E'', E'',
    E'Thakura Bhaktivinoda, understanding Your glories, clasps the lotus feet of Rupa
Goswami and Swarup Damodar Goswami and prays, O Harinam, according to Your
sweet will You are manifest in all these forms and in many others also. Please
let them increase my love and attachment for You.
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'', E'',
    E'ityādika
nām, swarūpe prakām,
bāḍuk
mora rati rāge
rūpa-swarūpa-pada,
jāni'' nija sampada,
bhaktivinoda
dhori'' māge', E'ітйа̄діка
на̄м, сварӯпе прака̄м,
ба̄д̣ук
мора раті ра̄ґе
рӯпа-сварӯпа-пада,
джа̄ні'' ніджа сампада,
бгактівінода
дгорі'' ма̄ґе',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 11, Song 6: Vacya O Vacaka
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 11;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Vacya O Vacaka', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'বাচ্য
ও বাচক-দুই স্বরূপ
তোমার
বাচ্য-তব
শ্রী-বিগ্রহ চিদানন্দাকার', E'বাচ্য
ও বাচক-দুই স্বরূপ
তোমার
বাচ্য-তব
শ্রী-বিগ্রহ চিদানন্দাকার',
    E'Song
Name: Vacya O Vacaka
Official
Name: Namastakam Song 6
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Вачйа О Вачака
Оffічіал
Наме: Намастакам Сонґ 6
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
Lord, You possess two transcendental forms, properly called vacya and vacaka.
The vacya is Your beautiful form full of transcendental knowledge and bliss.
2) The
vacaka forms are Your holy names, such as Sri Krsna, etc. This transcendental
sound form is the resting place of the bliss of all souls.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'বাচক
স্বরূপ তব শ্রী-কৃষ্ণ-আদি''
নাম
বর্ন-রূপী
সর্ব-জীব-আনন্দ-বিশ্রাম', E'বাচক
স্বরূপ তব শ্রী-কৃষ্ণ-আদি''
নাম
বর্ন-রূপী
সর্ব-জীব-আনন্দ-বিশ্রাম',
    E'vācya
o vācakadui swarūp tomār
vācyatava
śrī-vigraha cid-ānandākār', E'ва̄чйа
о ва̄чакадуі сварӯп тома̄р
ва̄чйатава
ш́рı̄-віґраха чід-а̄нанда̄ка̄р',
    E'', E'',
    E'Your unlimited manifestations are found in these two forms. Taking pity and
being very kind, they confer upon the fallen souls entrance to Your divine
pastimes.
4) But
I have understood Your vacaka form to be more merciful than Your vacya form, O
Lord. Thus do I find Your holy name most wonderful.
5) It
is the declaration of the Vedas that the holy name of the Lord and the Lord are
nondifferent, yet still the holy name is more merciful than the Lord Himself.
6-7)
If one is an offender to Lord Krsna but respects His holy name and calls out
with all his heart and soul, Rama! Krsna Hari then all his offenses
depart, and that person then swims without difficulty in the ocean of divine
bliss and transcendental mellows.
8) A
person may commit offenses to the vacya or the transcendental feature and
personality of the Lord; but if he is under the shelter of the pure holy name,
he crosses over all those offenses.
9) At
the lotus feet of Srila Rupa Goswami, Thakura Bhaktivinoda begs for constant
attachment and love for the vacaka or divine holy name of the Supreme Lord.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'এই
দুই স্বরূপে তব
অনন্ত প্রকাশ
দয়া
করি'' দেয় জীবে তোমার
বিলাস', E'এই
দুই স্বরূপে তব
অনন্ত প্রকাশ
দয়া
করি'' দেয় জীবে তোমার
বিলাস',
    E'vācaka
swarūp tava `śrī-kṛṣṇa-ādi'' nām
varna-rūpī
sarva-jīva-ānanda-viśrām', E'ва̄чака
сварӯп тава `ш́рı̄-кр̣шн̣а-а̄ді'' на̄м
варна-рӯпı̄
сарва-джı̄ва-а̄нанда-віш́ра̄м',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'কিন্তু
জানিয়াছি নাথ বাচক-স্বরূপ
বাচ্যাপেক্ষা
দয়ময়, এই অপরূপ', E'কিন্তু
জানিয়াছি নাথ বাচক-স্বরূপ
বাচ্যাপেক্ষা
দয়ময়, এই অপরূপ',
    E'ei
dui swarūpe tava ananta prakāś
doyā
kori'' deya jīve tomāra vilās', E'еі
дуі сварӯпе тава ананта прака̄ш́
дойа̄
корі'' дейа джı̄ве тома̄ра віла̄с',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'নাম
নামী ভেদ নাই, বেদের
বচন
তবু
নাম-নামী হ''তে অধিক
করুন', E'নাম
নামী ভেদ নাই, বেদের
বচন
তবু
নাম-নামী হ''তে অধিক
করুন',
    E'kintu
jāniyāchi nātha vācaka-swarūp
vācyāpekṣā
doyamoy, ei aparūp', E'кінту
джа̄нійа̄чхі на̄тха ва̄чака-сварӯп
ва̄чйа̄пекша̄
дойамой, еі апарӯп',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'কৃষ্ণএ-অপরাধি
যদি নামে শ্রদ্ধা
করি''
প্রান
ভরি'' ডাকে নাম-রম,
কৃষ্ণ, হরি'',', E'কৃষ্ণএ-অপরাধি
যদি নামে শ্রদ্ধা
করি''
প্রান
ভরি'' ডাকে নাম-রম,
কৃষ্ণ, হরি'',',
    E'nāma
nāmī bheda nāi, vedera vacan
tabu
nāmanāmī ho''te adhika korun', E'на̄ма
на̄мı̄ бгеда на̄і, ведера вачан
табу
на̄мана̄мı̄ хо''те адгіка корун',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'অপরাধ
দূরে যায়, আনন্দ-সাগরে
ভাসে
সেই অনায়াসে রসের
পাথারে', E'অপরাধ
দূরে যায়, আনন্দ-সাগরে
ভাসে
সেই অনায়াসে রসের
পাথারে',
    E'kṛṣṇae-aparādhi
jadi nāme śraddhā kori''
prāna
bhori'' ḍāke nām`rama, kṛṣṇa, hari'',', E'кр̣шн̣ае-апара̄дгі
джаді на̄ме ш́раддга̄ корі''
пра̄на
бгорі'' д̣а̄ке на̄м`рама, кр̣шн̣а, харі'',',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'বিগ্রহ-স্বরূপ
বাচ্যে অপরাধ করি''
শুদ্ধ-নামাশ্রয়ে
সেই অপরাধে তরি''', E'বিগ্রহ-স্বরূপ
বাচ্যে অপরাধ করি''
শুদ্ধ-নামাশ্রয়ে
সেই অপরাধে তরি''',
    E'aparādha
dūre jāy, ānanda-sāgare
bhāse
sei anāyāse rasera pāthāre', E'апара̄дга
дӯре джа̄й, а̄нанда-са̄ґаре
бга̄се
сеі ана̄йа̄се расера па̄тха̄ре',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'ভকতিবিনোদ
মাগে শ্রী-রূপ-চরণে
বাচক-স্বরূপ
নামে রতি অনুক্ষনে', E'ভকতিবিনোদ
মাগে শ্রী-রূপ-চরণে
বাচক-স্বরূপ
নামে রতি অনুক্ষনে',
    E'vigraha-swarūp
vācye aparādha kori''
śuddha-nāmāśraye
sei aparādhe tori''', E'віґраха-сварӯп
ва̄чйе апара̄дга корі''
ш́уддга-на̄ма̄ш́райе
сеі апара̄дге торі''',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 10
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10', 10,
    E'', E'',
    E'bhakativinoda
māge śrī-rūpa-caraṇe
vācaka-swarūp
nāme rati anukṣane', E'бгакатівінода
ма̄ґе ш́рı̄-рӯпа-чаран̣е
ва̄чака-сварӯп
на̄ме раті анукшане',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 11, Song 7: O He Hari Nam
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 11;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'O He Hari Nam', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'ওহে হরিনাম, তব মহিমা অপার
তব পদে নতি আমি করি বার বার', E'ওহে হরিনাম, তব মহিমা অপার
তব পদে নতি আমি করি বার বার',
    E'Song
Name: Ohe Harinam Tava Mahima Apar
Official
Name: Namastakam Song 7
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Охе Харінам Тава Махіма Апар
Оffічіал
Наме: Намастакам Сонґ 7
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'O holy name, Your glories are boundless! I therefore bow down at Your lotus
feet again and again', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'গোকুলের মহোত্সব আনন্দ-সাগর!
তোমার চরণে পড়ি'' হ‍ইয়া কাতর', E'গোকুলের মহোত্সব আনন্দ-সাগর!
তোমার চরণে পড়ি'' হ‍ইয়া কাতর',
    E'ohe
harinām, tava mahimā apār
tava
pade nati āmi kori bār bār', E'охе
харіна̄м, тава махіма̄ апа̄р
тава
паде наті а̄мі корі ба̄р ба̄р',
    E'', E'',
    E'O festival of Gokula! O ocean of bliss! I fall down at Your lotus feet, for I
am feeling very distressed and troubled at heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'তুমি কৃষ্ণ, পূর্ন-বপু, রসের নিদান
তব পদে পড়ি'' তব গুন করি গান', E'তুমি কৃষ্ণ, পূর্ন-বপু, রসের নিদান
তব পদে পড়ি'' তব গুন করি গান',
    E'gokuler
mahotsava ānanda-sāgar!
tomār
caraṇe paḍi'' hoiyā kātar', E'ґокулер
махотсава а̄нанда-са̄ґар!
тома̄р
чаран̣е пад̣і'' хоійа̄ ка̄тар',
    E'', E'',
    E'You are Lord Krishna, Your divine form is perfect and You are the origin of all
transcendental mellows. Falling down at Your lotus feet, I sing of Your divine
qualities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'যে করে তোমার পদে একান্ত আশ্রয়
তা''র আর্তি-রাশি নাশ করহ নিশ্চয়', E'যে করে তোমার পদে একান্ত আশ্রয়
তা''র আর্তি-রাশি নাশ করহ নিশ্চয়',
    E'tumi
kṛṣṇa, pūrna-vapu, rasera nidān
tava
pade poḍi'' tava guna kori gān', E'тумі
кр̣шн̣а, пӯрна-вапу, расера ніда̄н
тава
паде под̣і'' тава ґуна корі ґа̄н',
    E'', E'',
    E'You destroy the multitude of afflictions of that person who takes exclusive
shelter at Your holy feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'সর্ব অপরাধ তুমি নাশ কর তা''র
নাম-অপরাধাবধি নাশহো তাঁহার', E'সর্ব অপরাধ তুমি নাশ কর তা''র
নাম-অপরাধাবধি নাশহো তাঁহার',
    E'je
kore tomār pade ekānta āśroy
tā''r
ārti-rāśi nāś koroha niścoy', E'дже
коре тома̄р паде ека̄нта а̄ш́рой
та̄''р
а̄рті-ра̄ш́і на̄ш́ короха ніш́чой',
    E'', E'',
    E'O holy name, you destroy all his offenses, even those he might have committed
to You directly.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'সর্ব-দোষ ধৌত করি'' তাঁহার হৃদয়-
সিংহাসনে বৈস তুমি পরম আশ্রয়', E'সর্ব-দোষ ধৌত করি'' তাঁহার হৃদয়-
সিংহাসনে বৈস তুমি পরম আশ্রয়',
    E'sarva
aparādha tumi nāśa koro tā''r
nāma-aparādhāvadhi
nāśaho tāhār', E'сарва
апара̄дга тумі на̄ш́а коро та̄''р
на̄ма-апара̄дга̄вадгі
на̄ш́ахо та̄ха̄р',
    E'', E'',
    E'Cleansing him of all impurities, You, who are the supreme shelter, sit upon a
throne within his heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'অতি-রম্য চিদ-ঘন-আনন্দ-মূর্তিমান
রসো বৈ সঃ'' বলি'' বেদ করে তুয়া গান', E'অতি-রম্য চিদ-ঘন-আনন্দ-মূর্তিমান
রসো বৈ সঃ'' বলি'' বেদ করে তুয়া গান',
    E'sarva-doṣa
dhauta kori'' tāhāra hṛdoy-
siḿhāsane
baiso tumi parama āśroy', E'сарва-доша
дгаута корі'' та̄ха̄ра хр̣дой-
сіḿха̄сане
баісо тумі парама а̄ш́рой',
    E'', E'',
    E'You are delightful and beautiful, the personification of complete cognizance
and deep ecstasy. The Vedas sing of You, saying, The Supreme Personality of
Godhead is the personification of all transcendental mellows.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'ভক্তিবিনোদ রূপ-গোস্বামী-চরণে
মাগয়ে সর্বদা নাম-স্ফূর্তি সর্ব-ক্ষনে', E'ভক্তিবিনোদ রূপ-গোস্বামী-চরণে
মাগয়ে সর্বদা নাম-স্ফূর্তি সর্ব-ক্ষনে',
    E'ati-ramya
cid-ghana-ānanda-mūrtimān
`raso
vai saḥ'' boli'' veda kore tuwā gān', E'аті-рамйа
чід-ґгана-а̄нанда-мӯртіма̄н
`расо
ваі сах̣'' болі'' веда коре тува̄ ґа̄н',
    E'', E'',
    E'At the lotus feet of Srila Rupa Goswami, Thakura Bhaktivinoda constantly begs
that at every moment there be the transcendental vibration of the holy name.
REMARKS/EXTRA
INFORMATION:
This
song can be sung in Raga Tilak Kamod in Bhajani Tala.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'', E'',
    E'bhaktivinoda
rūpa-goswāmī-caraṇe
māgaye
sarvadā nāma-sphūrti sarva-kṣane', E'бгактівінода
рӯпа-ґосва̄мı̄-чаран̣е
ма̄ґайе
сарвада̄ на̄ма-спхӯрті сарва-кшане',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 11, Song 8: Narada Muni
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 11;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Narada Muni', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 8;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'', E'',
    E'Song
Name: Narada Muni Bajay Vina
Official
Name: Namastakam Song 8
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Нарада Муні Баджай Віна
Оffічіал
Наме: Намастакам Сонґ 8
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Muni Bajay Vina', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'', E'',
    E'nārada
muni, bājāy vīṇā
''rādhikā-ramaṇa''-nāme
nāma amani, udita haya,
bhakata-gītā-sāme', E'на̄рада
муні, ба̄джа̄й вı̄н̣а̄
''ра̄дгіка̄-раман̣а''-на̄ме
на̄ма амані, удіта хайа,
бгаката-ґı̄та̄-са̄ме',
    E'', E'',
    E'When the great soul Narada Muni plays his vina, the holy name, Radhika-raman,
descends and immediately appears amidst the kirtan of the Lord''s devotees.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'', E'',
    E'amiya-dhārā,
bariṣe ghana,
śravaṇa-yugale giyā
bhakata jana, saghane nāce,
bhoriyā āpana hiyā', E'амійа-дга̄ра̄,
баріше ґгана,
ш́раван̣а-йуґале ґійа̄
бгаката джана, саґгане на̄че,
бгорійа̄ а̄пана хійа̄',
    E'', E'',
    E'Like a monsoon cloud, the holy name showers nectar in their ears. All the
devotees, due to great ecstasy, repeatedly dance to their hearts content.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'', E'',
    E'mādhurī-pūra,
āsava paśi'',
mātāya jagata-jane
keho vā kānde, keho vā nāce,
keho māte mane mane', E'ма̄дгурı̄-пӯра,
а̄сава паш́і'',
ма̄та̄йа джаґата-джане
кехо ва̄ ка̄нде, кехо ва̄ на̄че,
кехо ма̄те мане мане',
    E'', E'',
    E'All the people of the universe become maddened upon entering this intoxicating
shower of nectar. Some people cry, some dance and others become fully
intoxicated within their minds.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'', E'',
    E'pañca-vadana,
nārade dhori'',
premera saghana rol
kamalāsana, nāciyā bole,
''bolo bolo hari bolo''', E'пан̃ча-вадана,
на̄раде дгорі'',
премера саґгана рол
камала̄сана, на̄чійа̄ боле,
''боло боло харі боло''',
    E'', E'',
    E'Lord Siva, embracing Narada Muni, repeatedly makes loud screams of ecstatic
joy, and Lord Brahma, dancing very ecstatically, says, All of you kindly
chant, Haribol! Haribol!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'', E'',
    E'sahasrānana,
parama-sukhe,
''hari hari'' boli'' gāya
nāma-prabhāve, mātilo viśva,
nāma-rasa sabe pāya', E'сахасра̄нана,
парама-сукхе,
''харі харі'' болі'' ґа̄йа
на̄ма-прабга̄ве, ма̄тіло віш́ва,
на̄ма-раса сабе па̄йа',
    E'', E'',
    E'In great happiness the thousand-faced Ananta Sesa chants Hari! Hari! By the
influence of the transcendental vibration of the holy name, the whole universe
becomes ecstatically maddened and everyone tastes the mellows of the holy name.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'', E'',
    E'śrī-kṛṣṇa-nāma,
rasane sphuri'',
pūrā''lo āmār āśa
śrī-rūpa-pade, yācaye ihā,
bhakativinoda-dāsa
WORD', E'ш́рı̄-кр̣шн̣а-на̄ма,
расане спхурі'',
пӯра̄''ло а̄ма̄р а̄ш́а
ш́рı̄-рӯпа-паде, йа̄чайе іха̄,
бгакатівінода-да̄са
ВОРД',
    E'', E'',
    E'Thakura Bhaktivinoda, the humble servant of the Lord, says, The holy name of
Krishna has fulfilled all my desires by vibrating on everyone''s tongue.
Bhaktivinoda therefore prays at the feet of Sri Rupa Goswami that the chanting
of harinam may continue like this always.
REMARKS/EXTRA
INFORMATION:
This
song is sung in Raga Misra Khamaj in Dadra Tala.
PURPORTS:
A.C.
Bhaktivedanta Swami Prabhupada', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 12, Song 1: Radhika Carana Padma
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 12;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Radhika Carana Padma', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'রাধিকা-চরণ-পদ্ম, সকল শ্রেয়ের সদ্ম,
যতনে যে নাহি আরাধিল
রাধা-পদ্মাঙ্কিত ধাম, বৃন্দাবন যার নাম,
তাঁহা যে না আশ্রয় করিল', E'রাধিকা-চরণ-পদ্ম, সকল শ্রেয়ের সদ্ম,
যতনে যে নাহি আরাধিল
রাধা-পদ্মাঙ্কিত ধাম, বৃন্দাবন যার নাম,
তাঁহা যে না আশ্রয় করিল',
    E'Song
Name: Radhika Carana Padma
Official
Name: Radhikastakam Song 1
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Радгіка Чарана Падма
Оffічіал
Наме: Радгікастакам Сонґ 1
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'He who has failed to carefully worship the lotus feet of Srimati Radhika, which
are the abode of all auspiciousness; he who has not taken shelter in the
transcendental abode known as Vrndavana, which is decorated with the beautiful
lotus flower named Radha...', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'রাধিকা-ভাব-গম্ভীর, চিত্ত যেবা মহাধীর,
গণ-সঙ্গ না কৈল জীবনে
কেমোনে সে শ্যামানন্দ, রস-সিন্ধু-স্নানানন্দ,
লভিবে বুঝোহ এক-মনে', E'রাধিকা-ভাব-গম্ভীর, চিত্ত যেবা মহাধীর,
গণ-সঙ্গ না কৈল জীবনে
কেমোনে সে শ্যামানন্দ, রস-সিন্ধু-স্নানানন্দ,
লভিবে বুঝোহ এক-মনে',
    E'rādhikā-caraṇa-padma,
sakala śreyera sadma,
jatane
je nāhi ārādhilo
rādhā-padmāńkita
dhāma, bṛndābana jār nāma,
tāhā
je nā āśroy korilo', E'ра̄дгіка̄-чаран̣а-падма,
сакала ш́рейера садма,
джатане
дже на̄хі а̄ра̄дгіло
ра̄дга̄-падма̄ńкіта
дга̄ма, бр̣нда̄бана джа̄р на̄ма,
та̄ха̄
дже на̄ а̄ш́рой коріло',
    E'', E'',
    E'...he who in this life has not associated with the devotees of Radhika, who are
very wise and whose devotion for Radha is very deep  how will such a person
ever experience the bliss of bathing in the ocean of Lord Syama''s sublime
mellows? Please understand this most attentively!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'রাধিকা উজ্জ্বল-রসের আচার্য
রাধা-মাধব-শুদ্ধ-প্রেম বিচার্য', E'রাধিকা উজ্জ্বল-রসের আচার্য
রাধা-মাধব-শুদ্ধ-প্রেম বিচার্য',
    E'rādhikā-bhāva-gambhīr,
citta jebā mahādhīr,
gaṇa-sańga
nā koilo jīvane
kemone
se śyāmānanda, rasa-sindhu-snānānanda,
labhibe
bujhoha eka-mane', E'ра̄дгіка̄-бга̄ва-ґамбгı̄р,
чітта джеба̄ маха̄дгı̄р,
ґан̣а-саńґа
на̄ коіло джı̄ване
кемоне
се ш́йа̄ма̄нанда, раса-сіндгу-сна̄на̄нанда,
лабгібе
буджхоха ека-мане',
    E'', E'',
    E'Srimati Radhika is the exemplary teacher of the brilliant mellows of conjugal
love. This pure love between Radha and Madhava is worthy of discussion and
contemplation.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'যে ধরিল রাধা-পদ পরম যতনে
সে পৈল কৃষ্ণ-পদ অমূল্য-রতনে', E'যে ধরিল রাধা-পদ পরম যতনে
সে পৈল কৃষ্ণ-পদ অমূল্য-রতনে',
    E'rādhikā
ujjvala-raser ācārya
rādhā-mādhava-śuddha-prem
vicārya', E'ра̄дгіка̄
уджджвала-расер а̄ча̄рйа
ра̄дга̄-ма̄дгава-ш́уддга-прем
віча̄рйа',
    E'', E'',
    E'He who has grasped hold of the lotus feet of Radha with great care obtains the
lotus feet of Krsna, which are like priceless jewels.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'রাধা-পদ বিনা কভু কৃষ্ণ নাহি মিলে
রাধার দাসীর কৃষ্ণ সর্ব-বেদে বলে', E'রাধা-পদ বিনা কভু কৃষ্ণ নাহি মিলে
রাধার দাসীর কৃষ্ণ সর্ব-বেদে বলে',
    E'je
dharilo rādhā-pada parama jatane
se
pailo kṛṣṇa-pada amūlya-ratane', E'дже
дгаріло ра̄дга̄-пада парама джатане
се
паіло кр̣шн̣а-пада амӯлйа-ратане',
    E'', E'',
    E'Without taking shelter of the lotus feet of Radha, one can never personally
meet Lord Krsna. The Vedic scriptures declare that Krsna is the property of the
maidservants of Sri Radha.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'ছোড়ত ধন-জন, কলত্র-সুত-মিত,
ছোড়ত করম গেয়ান
রাধা-পদ-পঙ্কজ, মধুরত সেবন,
ভকতিবিনোদ পরমান', E'ছোড়ত ধন-জন, কলত্র-সুত-মিত,
ছোড়ত করম গেয়ান
রাধা-পদ-পঙ্কজ, মধুরত সেবন,
ভকতিবিনোদ পরমান',
    E'rādhā-pada
vinā kabhu kṛṣṇa nāhi mile
rādhār
dāsīr kṛṣṇa sarva-vede bole', E'ра̄дга̄-пада
віна̄ кабгу кр̣шн̣а на̄хі міле
ра̄дга̄р
да̄сı̄р кр̣шн̣а сарва-веде боле',
    E'', E'',
    E'Abandoning wealth, followers, wife, sons, and friends, and giving up
materialistic activities and intellectual knowledge, being absorbed in the
sweetness of service to the lotus feet of Srimati Radharani-this is
Bhaktivinoda''s conviction.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'', E'',
    E'choḍata
dhana-jan, kalatra-suta-mita,
choḍata
karama geyān
rādhā-pada-pańkaja,
madhurata sevan,
bhakativinoda
paramān', E'чход̣ата
дгана-джан, калатра-сута-міта,
чход̣ата
карама ґейа̄н
ра̄дга̄-пада-паńкаджа,
мадгурата севан,
бгакатівінода
парама̄н',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 12, Song 2: Viraj Ar Pure Suddha
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 12;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Viraj Ar Pure Suddha', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'বিরজার পারে শুদ্ধ-পরব্যোম-ধাম
তদ উপরি শ্রী-গোকুল-বৃন্দারণ্য নাম', E'বিরজার পারে শুদ্ধ-পরব্যোম-ধাম
তদ উপরি শ্রী-গোকুল-বৃন্দারণ্য নাম',
    E'Song
Name: Virajar Pare Suddha Paravyoma Dhama
Official
Name: Radhikastakam Song 2
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Віраджар Паре Суддга Паравйома Дхама
Оffічіал
Наме: Радгікастакам Сонґ 2
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Beyond the Viraja River lies the pure spiritual sky, and above that Vaikuntha
realm lies the divine abode known as Sri Goloka Vrndavana.
2) The
land of Vrndavana is made of spiritual gems and is therefore likened to a
mine of fully cognizant and blissful jewels. This transcendentally conscious
realm is certainly a wonderful and extraordinary sight. Within that abode does
the most astonishing presence of Lord Krsna, who is compared to a tamal tree,
the king of trees possess the hue of a dark sapphire.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'বৃন্দাবন চিন্তামণি, চিদ-আনন্দ-রত্ন-খনি,
চিন্ময় অপূর্ব-দরশন
তহি মাঝে চমত্কার, কৃষ্ণ বনস্পতি সার,
নীল-মণি তমাল যেমোন', E'বৃন্দাবন চিন্তামণি, চিদ-আনন্দ-রত্ন-খনি,
চিন্ময় অপূর্ব-দরশন
তহি মাঝে চমত্কার, কৃষ্ণ বনস্পতি সার,
নীল-মণি তমাল যেমোন',
    E'virajār
pāre śuddha-paravyoma-dhām
tad
upari śrī-gokula-bṛndāraṇya nām', E'віраджа̄р
па̄ре ш́уддга-паравйома-дга̄м
тад
упарі ш́рı̄-ґокула-бр̣нда̄ран̣йа на̄м',
    E'', E'',
    E'Entwined upon that blackish tree a beautiful golden creeper has arisen, who is
the conqueror of all realms, being the supreme purifier. Her name is Mahabhava,
being the essence of the supreme pleasure-giving hladini potency. She is the enchantress
of Sri Krsna, who is Himself the enchanter of the three worlds.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'তাহে এক স্বর্ন-ময়ী, লতা সর্ব-ধাম-জয়ী,
উথিয়াছে পরম-পাবনা
হ্লাদিনী-শক্তির সার, মহাভাব'' নাম যার,
ত্রিভুবন-মোহন-মোহিনী', E'তাহে এক স্বর্ন-ময়ী, লতা সর্ব-ধাম-জয়ী,
উথিয়াছে পরম-পাবনা
হ্লাদিনী-শক্তির সার, মহাভাব'' নাম যার,
ত্রিভুবন-মোহন-মোহিনী',
    E'bṛndābana
cintāmaṇi, cid-ānanda-ratna-khani,
cinmoy
apūrva-daraśan
tahi
mājhe camatkār, kṛṣṇa vanaspati sār,
nīla-maṇi
tamāla jemon', E'бр̣нда̄бана
чінта̄ман̣і, чід-а̄нанда-ратна-кхані,
чінмой
апӯрва-дараш́ан
тахі
ма̄джхе чаматка̄р, кр̣шн̣а ванаспаті са̄р,
нı̄ла-ман̣і
тама̄ла джемон',
    E'', E'',
    E'Known by the name of Radha, She remains shining there in great ecstasy, always
engaged in satisfying Govinda''s heart. The leaves and flowers of that creeper
form the assembly of Her girlfriends headed by Lalita. Together She and all Her
friends entwine that blackish tree in a tight embrace.
5) At
the touch of this creeper, the tamal tree blooms; without the embrace of the
creeper, He can no longer exist.
6) The
creeper never desires to leave the company of the tamal tree; the creeper
perpetually craves Their union.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'রাধা-নামে পরিচিত, তুষিয়া গোবিন্দ-চিত,
বিরাজয়ে পরম আনন্দে
সেই লতা-পত্র-ফুল, ললিতাদি সখী-কুল,
সবে মিলি'' বৃক্ষে দৃঢ বান্ধে', E'রাধা-নামে পরিচিত, তুষিয়া গোবিন্দ-চিত,
বিরাজয়ে পরম আনন্দে
সেই লতা-পত্র-ফুল, ললিতাদি সখী-কুল,
সবে মিলি'' বৃক্ষে দৃঢ বান্ধে',
    E'tāhe
eka svarna-mayī, latā sarva-dhāma-jayī,
uthiyāche
parama-pāvanā
hlādinī-śaktir
sār, `mahābhāva'' nām jār,
tribhuvana-mohana-mohinī', E'та̄хе
ека сварна-майı̄, лата̄ сарва-дга̄ма-джайı̄,
утхійа̄чхе
парама-па̄вана̄
хла̄дінı̄-ш́актір
са̄р, `маха̄бга̄ва'' на̄м джа̄р,
трібгувана-мохана-мохінı̄',
    E'', E'',
    E'Other than the meeting of these two, Bhaktivinoda desires nothing, but nothing
else.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'লতার পরশে প্রফুল্ল তমাল
লতা ছাড়ি'' নাহি রহে কোনো কাল', E'লতার পরশে প্রফুল্ল তমাল
লতা ছাড়ি'' নাহি রহে কোনো কাল',
    E'rādhā-nāme
paricita, tuṣiyā govinda-cita,
virājaye
parama ānande
sei
latā-patra-phul, lalitādi sakhī-kul,
sabe
mili'' vṛkṣe dṛḍha bāndhe', E'ра̄дга̄-на̄ме
парічіта, тушійа̄ ґовінда-чіта,
віра̄джайе
парама а̄нанде
сеі
лата̄-патра-пхул, лаліта̄ді сакхı̄-кул,
сабе
мілі'' вр̣кше др̣д̣ха ба̄ндге',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'তমাল ছড়িয়া লতা নাহি বাঞ্চে
সে লতা মিলন সদা-কাল যাচে', E'তমাল ছড়িয়া লতা নাহি বাঞ্চে
সে লতা মিলন সদা-কাল যাচে',
    E'latār
paraśe praphulla tamāl
latā
chāḍi'' nāhi rahe kono kāl', E'лата̄р
параш́е прапхулла тама̄л
лата̄
чха̄д̣і'' на̄хі рахе коно ка̄л',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'ভকতিবিনোদ মিলন দোহার
না চাহে কখোন বিনা কিছু আর', E'ভকতিবিনোদ মিলন দোহার
না চাহে কখোন বিনা কিছু আর',
    E'tamāla
chaḍiyā latā nāhi vāñce
se
latā milan sadā-kāla yāce', E'тама̄ла
чхад̣ійа̄ лата̄ на̄хі ва̄н̃че
се
лата̄ мілан сада̄-ка̄ла йа̄че',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'', E'',
    E'bhakativinoda
milan dohār
nā
cāhe kakhona vinā kichu ār', E'бгакатівінода
мілан доха̄р
на̄
ча̄хе какхона віна̄ кічху а̄р',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 12, Song 3: Ramani Siro Mani
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 12;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Ramani Siro Mani', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'রমণী-শিরোমণি, বৃষভানু-নন্দিনী,
নীল-বসন-পরিধান
ছিন্ন-পুরট যিনি'', বর্ন-বিকাশিনী,
বদ্ধ-কবরী হরি-প্রান', E'রমণী-শিরোমণি, বৃষভানু-নন্দিনী,
নীল-বসন-পরিধান
ছিন্ন-পুরট যিনি'', বর্ন-বিকাশিনী,
বদ্ধ-কবরী হরি-প্রান',
    E'Song
Name: Ramani Siromani
Official
Name: Radhikastakam Song 3
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Рамані Сіромані
Оffічіал
Наме: Радгікастакам Сонґ 3
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'The beloved daughter of King Vrsabhanu is the crest-jewel of all young women.
She is fond of wearing blue garments. Her radiant complexion is very pleasing
and conquers the beauty of freshly cut gold, Her locks of hair are nicely
arranged, and She is the life and soul of Lord Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'আভরণ-মণ্ডিত, হরি-রস-পণ্ডিত,
তিলক-শুসোভিত-ভালা
কঞ্চুলিকাচ্ছাদিতা, স্তন-মণি-মণ্ডিতা,
কজ্জল-নয়নী রসালা', E'আভরণ-মণ্ডিত, হরি-রস-পণ্ডিত,
তিলক-শুসোভিত-ভালা
কঞ্চুলিকাচ্ছাদিতা, স্তন-মণি-মণ্ডিতা,
কজ্জল-নয়নী রসালা',
    E'ramaṇī-śiromaṇi,
bṛṣabhānu-nandinī,
nīla-vasana-paridhāna
chinna-puraṭa
jini'', varna-vikāśinī,
baddha-kabarī
hari-prāna', E'раман̣ı̄-ш́іроман̣і,
бр̣шабга̄ну-нандінı̄,
нı̄ла-васана-парідга̄на
чхінна-пурат̣а
джіні'', варна-віка̄ш́інı̄,
баддга-кабарı̄
харі-пра̄на',
    E'', E'',
    E'She is artfully adorned with jewels, She is very learned in the science of Hari-rasa,
and Her forehead is nicely decorated with tilaka. Her breasts are covered with
a beautiful corset and adorned with valuable gems, and Her eyes are anointed
with black collyrium. Thus She appears to be relishable sweetness personified.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'সকল ত্যজিয়া সে রাধা-চরণে
দাসী হ''য়ে ভজ পরম-যতনে', E'সকল ত্যজিয়া সে রাধা-চরণে
দাসী হ''য়ে ভজ পরম-যতনে',
    E'ābharaṇa-maṇḍita,
hari-rasa-paṇḍita,
tilaka-śusobhita-bhālā
kañculikācchāditā,
stana-maṇi-maṇḍitā,
kajjala-nayanī
rasālā', E'а̄бгаран̣а-ман̣д̣іта,
харі-раса-пан̣д̣іта,
тілака-ш́усобгіта-бга̄ла̄
кан̃чуліка̄ччха̄діта̄,
стана-ман̣і-ман̣д̣іта̄,
каджджала-найанı̄
раса̄ла̄',
    E'', E'',
    E'Giving up everything and becoming a maidservant at the lotus feet of Radha,
just worship and serve Her with great care and attention.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'সৌন্দর্য-কিরন দেখিয়া যাঁহার
রতি-গৌরী-লীলা গর্ব-পরিহার', E'সৌন্দর্য-কিরন দেখিয়া যাঁহার
রতি-গৌরী-লীলা গর্ব-পরিহার',
    E'sakala
tyajiyā se rādhā-caraṇe
dāsī
ho''ye bhaja parama-jatane', E'сакала
тйаджійа̄ се ра̄дга̄-чаран̣е
да̄сı̄
хо''йе бгаджа парама-джатане',
    E'', E'',
    E'Beholding Her effulgent rays of pure beauty, the goddesses Rati, Gauri, and
Lila abandon all their pride.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'শচী-লক্ষ্মী-সত্য সৌভাগ্য বলনে
পরাজিত হয় যাঁহার চরণে', E'শচী-লক্ষ্মী-সত্য সৌভাগ্য বলনে
পরাজিত হয় যাঁহার চরণে',
    E'saundarya-kirana
dekhiyā jāńhār
rati-gaurī-līlā
garva-parihār', E'саундарйа-кірана
декхійа̄ джа̄ńха̄р
раті-ґаурı̄-лı̄ла̄
ґарва-паріха̄р',
    E'', E'',
    E'The good fortune attributed to the goddesses Saci, Laksmi, and Satya is
completely defeated in the presence of Radha''s feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'কৃষ্ণ-বশীকারে চন্দ্রাবলী-আদি
পরাজয় মানে হ‌ইয়া বিবাদী', E'কৃষ্ণ-বশীকারে চন্দ্রাবলী-আদি
পরাজয় মানে হ‌ইয়া বিবাদী',
    E'śacī-lakṣmī-satya
saubhāgya bolane
parājita
hoy jāńhāra caraṇe', E'ш́ачı̄-лакшмı̄-сатйа
саубга̄ґйа болане
пара̄джіта
хой джа̄ńха̄ра чаран̣е',
    E'', E'',
    E'The group of rival gopis led by Candravali is forced to accept their defeat
before Srimati Radharani, for She alone controls Krsna. Thus they always sulk
and simply remain quarrelsome.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'হরি-দয়িত রাধা-চরণ প্রয়াসী
ভকতিবিনোদ শ্রী-গোদ্রুম-বাসী', E'হরি-দয়িত রাধা-চরণ প্রয়াসী
ভকতিবিনোদ শ্রী-গোদ্রুম-বাসী',
    E'kṛṣṇa-vaśīkāre
candrāvalī-ādi
parājay
māne hoiyā vivādī', E'кр̣шн̣а-ваш́ı̄ка̄ре
чандра̄валı̄-а̄ді
пара̄джай
ма̄не хоійа̄ віва̄дı̄',
    E'', E'',
    E'Bhaktivinoda, a resident of Sri Godruma, always endeavors for the lotus feet of
Radha, the most beloved of Lord Hari.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'', E'',
    E'hari-dayita
rādhā-caraṇa prayāsī
bhakativinoda
śrī-godruma-bāsī', E'харі-дайіта
ра̄дга̄-чаран̣а прайа̄сı̄
бгакатівінода
ш́рı̄-ґодрума-ба̄сı̄',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 12, Song 4: Rasika Nagari Gana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 12;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Rasika Nagari Gana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'রসিক নাগরী- গণ-শিরোমণি,
কৃষ্ণ-প্রেমে সরহংসী
বৃষভানু-রাজ, শুদ্ধ কল্প-বল্লী,
সর্ব-লক্ষ্মী-গণ-অংশী', E'রসিক নাগরী- গণ-শিরোমণি,
কৃষ্ণ-প্রেমে সরহংসী
বৃষভানু-রাজ, শুদ্ধ কল্প-বল্লী,
সর্ব-লক্ষ্মী-গণ-অংশী',
    E'Song
Name: Rasika Nagari Gana Siromani
Official
Name: Radhikastakam Song 4
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Расіка Наґарі Ґана Сіромані
Оffічіал
Наме: Радгікастакам Сонґ 4
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Srimati Radharani is the crest jewel of all amorous young maidens who take
pleasure in relishing transcendental mellows. She is a beautiful swan in the
waters of love for Krsna, a transcendental wish-fulfilling creeper on the
family tree of king Vrsabhanu, and the original source of all the goddesses of
fortune.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'রক্ত পট্ট-বস্ত্র, নিতম্ব-উপরি,
ক্ষুদ্র ঘন্টি দুলে তা''য়
কুচ-যুগোপরি, দুলি'' মুক্তা-মালা,
চিত্ত-হারী শোভা পায়', E'রক্ত পট্ট-বস্ত্র, নিতম্ব-উপরি,
ক্ষুদ্র ঘন্টি দুলে তা''য়
কুচ-যুগোপরি, দুলি'' মুক্তা-মালা,
চিত্ত-হারী শোভা পায়',
    E'rasika
nāgarī- gaṇa-śiromaṇi,
kṛṣṇa-preme
sarahaḿsī
bṛṣabhānu-rāja,
śuddha kalpa-ballī,
sarva-lakṣmī-gaṇa-aḿśī', E'расіка
на̄ґарı̄- ґан̣а-ш́іроман̣і,
кр̣шн̣а-преме
сарахаḿсı̄
бр̣шабга̄ну-ра̄джа,
ш́уддга калпа-баллı̄,
сарва-лакшмı̄-ґан̣а-аḿш́ı̄',
    E'', E'',
    E'Upon Her hips She wears red silken cloth on which tiny bells are swinging, and
upon Her breasts sways a lovely necklace of pearls. In this way She looks so
splendorous that She steals the heart of the beholder.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'সরসিজ-বর-কর্নিকা-সমান,
অতিশয় কান্তিমতী
কৈশোর অমৃত, তারুন্য-কর্পূর,
মিশ্র-স্মিতাধরা সতী', E'সরসিজ-বর-কর্নিকা-সমান,
অতিশয় কান্তিমতী
কৈশোর অমৃত, তারুন্য-কর্পূর,
মিশ্র-স্মিতাধরা সতী',
    E'rakta
paṭṭa-vastra, nitamba-upari,
kṣudra
ghanṭi dule tā''y
kuca-yugopari,
duli'' muktā-mālā,
citta-hārī
śobhā pāy', E'ракта
пат̣т̣а-вастра, нітамба-упарі,
кшудра
ґгант̣і дуле та̄''й
куча-йуґопарі,
дулі'' мукта̄-ма̄ла̄,
чітта-ха̄рı̄
ш́обга̄ па̄й',
    E'', E'',
    E'Her bodily luster is exceptionally effulgent, like the golden whorl of the best
of lotus flowers. Her two sweetly smiling lips display the immortal nectar of
adolescence mixed with the fragrant camphor of new youthfulness. She is
completely faithful to Lord Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'বনান্তে আগত, ব্রজ-পতি-সুত,
পরম-চঞ্চল-বরে
হেরি'' শঙ্কাকুল, নয়ন-ভঙ্গিতে,
আদরেতে স্তব করে', E'বনান্তে আগত, ব্রজ-পতি-সুত,
পরম-চঞ্চল-বরে
হেরি'' শঙ্কাকুল, নয়ন-ভঙ্গিতে,
আদরেতে স্তব করে',
    E'sarasija-vara-karnikā-samān,
atiśoy
kāntimatī
kaiśora
amṛta, tārunya-karpūr,
miśra-smitādharā
satī', E'сарасіджа-вара-карніка̄-сама̄н,
атіш́ой
ка̄нтіматı̄
каіш́ора
амр̣та, та̄рунйа-карпӯр,
міш́ра-сміта̄дгара̄
сатı̄',
    E'', E'',
    E'Seeing that the supremely mischievous son of Nanda has arrived on the outskirts
of the Vrndavana forest as He returns from tending the cows, She becomes
stricken with anxiety and affectionately offers prayers to Him by the hints and
signals of Her eyes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'ব্রজের মহিলা-গণের পরান,
যশোমতী-প্রিয়-পাত্রী
ললিত ললিতা-স্নেহেতে প্রফুল্ল-
শরীরা ললিত-গাত্রী', E'ব্রজের মহিলা-গণের পরান,
যশোমতী-প্রিয়-পাত্রী
ললিত ললিতা-স্নেহেতে প্রফুল্ল-
শরীরা ললিত-গাত্রী',
    E'banānte
āgata, braja-pati-suta,
parama-cañcala-bare
heri''
śańkākula, nayana-bhańgite,
ādarete
stava kore', E'бана̄нте
а̄ґата, браджа-паті-сута,
парама-чан̃чала-баре
хері''
ш́аńка̄кула, найана-бгаńґіте,
а̄дарете
става коре',
    E'', E'',
    E'Srimati Radharani is the life and soul of all the elder women of Vraja, and is
especially dear to Mother Yasoda. Basking in the affection of charming
Lalita-devi, Radha''s bodily form has fully blossomed like a lotus, thus
displaying Her beautiful and graceful limbs.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'বিশাখার সনে, বন-ফুল তুলি'',
গাঁথে বৈজয়ন্তী মালা
সকল-শ্রেয়সী, কৃষ্ণ-বক্ষঃ-স্থিত,
পরম-প্রেয়সী বালা', E'বিশাখার সনে, বন-ফুল তুলি'',
গাঁথে বৈজয়ন্তী মালা
সকল-শ্রেয়সী, কৃষ্ণ-বক্ষঃ-স্থিত,
পরম-প্রেয়সী বালা',
    E'brajera
mahilā-gaṇera parān,
yaśomatī-priya-pātrī
lalita
lalitā-snehete praphulla-
śarīrā
lalita-gātrī', E'браджера
махіла̄-ґан̣ера пара̄н,
йаш́оматı̄-прійа-па̄трı̄
лаліта
лаліта̄-снехете прапхулла-
ш́арı̄ра̄
лаліта-ґа̄трı̄',
    E'', E'',
    E'Accompanied by Visakha, Radha picks forest flowers and strings together a
vaijayanti flower garland for Krsna. She is the well-wisher of all, and is
always situated upon the chest of the Lord, being the most beloved young
girlfriend of Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'স্নিগ্ধ বেনু-রবে, দ্রুত-গতি যাই'',
কুঞ্জে পেয়ে নট-বরে
হসিত-নয়নী, নম্র-মুখী সতী,
কর্ণ কণ্ডূয়ন করে', E'স্নিগ্ধ বেনু-রবে, দ্রুত-গতি যাই'',
কুঞ্জে পেয়ে নট-বরে
হসিত-নয়নী, নম্র-মুখী সতী,
কর্ণ কণ্ডূয়ন করে',
    E'viśākhāra
sane, bana-phula tuli'',
gāńthe
vaijayantī mālā
sakala-śreyasī,
kṛṣṇa-vakṣaḥ-sthita,
parama-preyasī
bālā', E'віш́а̄кха̄ра
сане, бана-пхула тулі'',
ґа̄ńтхе
ваіджайантı̄ ма̄ла̄
сакала-ш́рейасı̄,
кр̣шн̣а-вакшах̣-стхіта,
парама-прейасı̄
ба̄ла̄',
    E'', E'',
    E'Hearing the soft sound of the flute, She moves swiftly through the forest, and
finding in the bowers of Vraja the best of dancing actors, the chaste Radha
with smiling eyes turns her face downward in shyness while restlessly
scratching Her ear.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'স্পর্শিয়া কমল, বায়ু সু-শীতল,
করে যবে কুণ্ড-নীর
নিদাঘে তথায়, নিজ-গণ সহ,
তুষয় গোকুল-বীর', E'স্পর্শিয়া কমল, বায়ু সু-শীতল,
করে যবে কুণ্ড-নীর
নিদাঘে তথায়, নিজ-গণ সহ,
তুষয় গোকুল-বীর',
    E'snigdha
venu-rave, druta-gati jāi'',
kuñje
peye naṭa-bare
hasita-nayanī,
namra-mukhī satī,
karṇa
kaṇḍūyana kore', E'сніґдга
вену-раве, друта-ґаті джа̄і'',
кун̃дже
пейе нат̣а-баре
хасіта-найанı̄,
намра-мукхı̄ сатı̄,
карн̣а
кан̣д̣ӯйана коре',
    E'', E'',
    E'When the breeze, which is scented with the fragrance of lotus flowers, makes
the waters of Radha-kunda very cool, then, in the warmth of the summer in those
cooling waters, Radha along with all Her girlfriends satisfies the hero of
Gokula.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'ভকতিবিনোদ, রূপ-রঘুনাথে,
কহয়ে চরণ ধরি''
হেনো রাধা-দাস্য, সুধীর-সম্পদ,
কবে দিবে কৃপা করি''', E'ভকতিবিনোদ, রূপ-রঘুনাথে,
কহয়ে চরণ ধরি''
হেনো রাধা-দাস্য, সুধীর-সম্পদ,
কবে দিবে কৃপা করি''',
    E'sparśiyā
kamala, vāyu su-śītala,
kore
jabe kuṇḍa-nīra
nidāghe
tathāy, nija-gaṇa saha,
tuṣaya
gokula-vīra', E'спарш́ійа̄
камала, ва̄йу су-ш́ı̄тала,
коре
джабе кун̣д̣а-нı̄ра
ніда̄ґге
татха̄й, ніджа-ґан̣а саха,
тушайа
ґокула-вı̄ра',
    E'', E'',
    E'Bhaktivinoda says to Rupa and Raghunatha, clasping their lotus feet, "When
will you bestow your mercy upon me and give me eternal service to such a Radha
as this, for Her service is the wealth of the truly wise."
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 10
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10', 10,
    E'', E'',
    E'bhakativinoda,
rūpa-raghunāthe,
kohaye
caraṇa dhori''
heno
rādhā-dāsya, sudhīra-sampad,
kabe
dibe kṛpā kori''', E'бгакатівінода,
рӯпа-раґгуна̄тхе,
кохайе
чаран̣а дгорі''
хено
ра̄дга̄-да̄сйа, судгı̄ра-сампад,
кабе
дібе кр̣па̄ корі''',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 12, Song 5: Maha Bhava Cinta Mani
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 12;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Maha Bhava Cinta Mani', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'মহাভাব-চিন্তামণি, উদ্ভাবিত তনু-খানি,
সখী-পতি-সজ্জা প্রভাবতী
কারুন্য-তারুন্য আর, লাবন্য-অমৃত-ধার,
তাহে স্নাতা লক্ষ্মী-জয়ী সতী', E'মহাভাব-চিন্তামণি, উদ্ভাবিত তনু-খানি,
সখী-পতি-সজ্জা প্রভাবতী
কারুন্য-তারুন্য আর, লাবন্য-অমৃত-ধার,
তাহে স্নাতা লক্ষ্মী-জয়ী সতী',
    E'Song
Name: Mahabhava Cintamani
Official
Name: Radhikastakam Song 5
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Махабгава Чінтамані
Оffічіал
Наме: Радгікастакам Сонґ 5
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Srimati Radharani''s transcendental bodily form has arisen out of the
mahabhava-cintamani. She is the decoration of the Lord of the sakhis, and is
effulgent with divinely splendorous potency. She takes her first bath in the
shower of the nectar of compassion, Her second bath in the nectar of youth, and
Her third bath in the nectar of bodily luster. She thus conquers the beauty of
even the goddess of fortune, and is endowed with the prominent quality of
chastity.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'লজ্জা পট্ট-বস্ত্র যার, সৌন্দর্য কুঙ্কুম-সার,
কস্তুরী-চিত্রিত কলেবর
কম্পাশ্রু-পুলক-রঙ্গ, স্তম্ভ-স্বেদ-স্বর-ভঙ্গ,
জাড্যোন্মাদ নব-রত্ন-ধর', E'লজ্জা পট্ট-বস্ত্র যার, সৌন্দর্য কুঙ্কুম-সার,
কস্তুরী-চিত্রিত কলেবর
কম্পাশ্রু-পুলক-রঙ্গ, স্তম্ভ-স্বেদ-স্বর-ভঙ্গ,
জাড্যোন্মাদ নব-রত্ন-ধর',
    E'mahābhāva-cintāmaṇi,
udbhāvita tanu-khāni,
sakhī-pati-sajjā
prabhāvatī
kārunya-tārunya
ār, lāvanya-amṛta-dhār,
tāhe
snātā lakṣmī-jayī satī', E'маха̄бга̄ва-чінта̄ман̣і,
удбга̄віта тану-кха̄ні,
сакхı̄-паті-саджджа̄
прабга̄ватı̄
ка̄рунйа-та̄рунйа
а̄р, ла̄ванйа-амр̣та-дга̄р,
та̄хе
сна̄та̄ лакшмı̄-джайı̄ сатı̄',
    E'', E'',
    E'She wears the silken sari of modesty, and on Her forehead She wears the red
kunkum dot of loveliness. Her body is decorated with pictures drawn in musk,
and She wears a necklace that is adorned with the fresh jewels of the ecstatic
symptoms-shivering in the body, flowing of tears from the eyes, standing of
hairs on the body, being stunned, perspiring, faltering of the voice,
inactivity, and madness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'পঞ্চ-বিংশতি গুন, ফুল-মালা সু-শোভন,
ধীরাধীর ভাব-পট্ট-বাসা
পিহিত-মান-ধম্মিল্লা, সৌভাগ্য-তিলকোজ্বলা,
কৃষ্ণ-নাম-যশঃ কর্ণোল্লাসা', E'পঞ্চ-বিংশতি গুন, ফুল-মালা সু-শোভন,
ধীরাধীর ভাব-পট্ট-বাসা
পিহিত-মান-ধম্মিল্লা, সৌভাগ্য-তিলকোজ্বলা,
কৃষ্ণ-নাম-যশঃ কর্ণোল্লাসা',
    E'lajjā
paṭṭa-vastra jār, saundarya kuńkuma-sār,
kasturī-citrita
kalevara
kampāśru-pulaka-rańga,
stambha-sveda-svara-bhańga,
jāḍyonmāda
nava-ratna-dhara', E'ладжджа̄
пат̣т̣а-вастра джа̄р, саундарйа куńкума-са̄р,
кастурı̄-чітріта
калевара
кампа̄ш́ру-пулака-раńґа,
стамбга-сведа-свара-бгаńґа,
джа̄д̣йонма̄да
нава-ратна-дгара',
    E'', E'',
    E'Sri Radha is very much beautified by wearing the flower garland strung with Her
twenty-five transcendental qualities, and She is clothed in the two-part silken
garment of both sober and non-sober emotional ecstasies. Covered indignation
constitutes Her braided and ornamented hair, and She is radiant with the tilak
of auspicious fortune. The name and glories of Krsna are the delight of Her
ears.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'রাগ-তাম্বূলিত ওষ্ঠ, কৌটিল্য-কজ্জল-স্পষ্ট,
স্মিত-কর্পূরিত নর্ম-শীলা
কীর্তি-যশ-অন্তঃপুরে, গর্ব-খট্টোপরি স্ফুরে,
দুলিত প্রেম-বৈচিত্ত্য-মালা', E'রাগ-তাম্বূলিত ওষ্ঠ, কৌটিল্য-কজ্জল-স্পষ্ট,
স্মিত-কর্পূরিত নর্ম-শীলা
কীর্তি-যশ-অন্তঃপুরে, গর্ব-খট্টোপরি স্ফুরে,
দুলিত প্রেম-বৈচিত্ত্য-মালা',
    E'pañca-viḿśati
guna, phula-mālā su-śobhana,
dhīrādhīra
bhāva-paṭṭa-vāsā
pihita-māna-dhammillā,
saubhāgya-tilakojvalā,
kṛṣṇa-nāma-yaśaḥ
karṇollāsā', E'пан̃ча-віḿш́аті
ґуна, пхула-ма̄ла̄ су-ш́обгана,
дгı̄ра̄дгı̄ра
бга̄ва-пат̣т̣а-ва̄са̄
піхіта-ма̄на-дгаммілла̄,
саубга̄ґйа-тілакоджвала̄,
кр̣шн̣а-на̄ма-йаш́ах̣
карн̣олла̄са̄',
    E'', E'',
    E'Srimati Radharani''s lips have become very red from chewing betel nuts, and the
black collyrium of cunningness is clearly visible on Her eyes. Her smile is
like sweet camphor, and she is always fond of joking. She sits upon a bed of
pride in a palace of fame and glory, and a garland of extraordinary
transformations of ecstatic love hangs swinging from around Her neck.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'প্রনয়-রোষ-কঞ্চুলী- পিহিত স্তন-যুগ্মকা,
চন্দ্রা-জয়ী কচ্ছপী রবিনী
সখী-দ্বয়-স্কন্ধে, লীলা-করাম্বুজার্পন-শীলা,
শ্যামা শ্যামামৃত-বিতরণী', E'প্রনয়-রোষ-কঞ্চুলী- পিহিত স্তন-যুগ্মকা,
চন্দ্রা-জয়ী কচ্ছপী রবিনী
সখী-দ্বয়-স্কন্ধে, লীলা-করাম্বুজার্পন-শীলা,
শ্যামা শ্যামামৃত-বিতরণী',
    E'rāga-tāmbūlita
oṣṭha, kauṭilya-kajjala-spaṣṭa,
smita-karpūrita
narma-śīlā
kīrti-yaśa-antaḥpure,
garva-khaṭṭopari sphure,
dulita
prema-vaicittya-mālā', E'ра̄ґа-та̄мбӯліта
ошт̣ха, каут̣ілйа-каджджала-спашт̣а,
сміта-карпӯріта
нарма-ш́ı̄ла̄
кı̄рті-йаш́а-антах̣пуре,
ґарва-кхат̣т̣опарі спхуре,
дуліта
према-ваічіттйа-ма̄ла̄',
    E'', E'',
    E'Her breasts are covered by the bodice of loving anger. She plays on a lute
called kacchapi (turtle-shaped) to announce the conquest of Her rival
Candravali. Radha is always fond of placing Her playful lotus like hands on the
shoulders of two of Her girlfriends. Her youthful form is very graceful and
slender, and She is the exclusive distributor of the nectar of Lord
Syamasundara.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'এ হেনো রাধিকা-পদ, তোমাদের সু-সম্পদ,
দন্তে তৃণ যাচে তব পায়
এ ভক্তিবিনোদ দীন, রাধা-দাস্যামৃত-কন,
রূপ রঘুনাথ! দেহো তায়', E'এ হেনো রাধিকা-পদ, তোমাদের সু-সম্পদ,
দন্তে তৃণ যাচে তব পায়
এ ভক্তিবিনোদ দীন, রাধা-দাস্যামৃত-কন,
রূপ রঘুনাথ! দেহো তায়',
    E'pranaya-roṣa-kañculī-
pihita stana-yugmakā,
candrā-jayī
kacchapī ravinī
sakhī-dwaya-skandhe,
līlā-karāmbujārpana-śīlā,
śyāmā
śyāmāmṛta-vitaraṇī', E'пранайа-роша-кан̃чулı̄-
піхіта стана-йуґмака̄,
чандра̄-джайı̄
каччхапı̄ равінı̄
сакхı̄-двайа-скандге,
лı̄ла̄-кара̄мбуджа̄рпана-ш́ı̄ла̄,
ш́йа̄ма̄
ш́йа̄ма̄мр̣та-вітаран̣ı̄',
    E'', E'',
    E'O Rupa and Raghunatha! Your great treasure is the lotus feet of such a Radhika.
This Bhaktivinoda, who is very fallen and lowly, prays at your lotus feet with
a straw of the street between his teeth. Please bestow upon me a nectarean
particle of eternal service to Srimati Radharani!
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'', E'',
    E'e
heno rādhikā-pada, tomāder su-sampada,
dante
tṛṇa yāce tava pāy
e
bhaktivinoda dīn, rādhā-dāsyāmṛta-kana,
rūpa
raghunātha! deho tāy', E'е
хено ра̄дгіка̄-пада, тома̄дер су-сампада,
данте
тр̣н̣а йа̄че тава па̄й
е
бгактівінода дı̄н, ра̄дга̄-да̄сйа̄мр̣та-кана,
рӯпа
раґгуна̄тха! дехо та̄й',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 12, Song 6: Baraja Vipine
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 12;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Baraja Vipine', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'বরজ-বিপিনেজমুনা-কূলে
মঞ্চ মনোহরশোভিত ফুলে', E'বরজ-বিপিনেজমুনা-কূলে
মঞ্চ মনোহরশোভিত ফুলে',
    E'Song
Name: Baraja Vipine Jamuna Kule
Official
Name: Sri Radhikastaka Song 6
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Бараджа Віпіне Джамуна Куле
Оffічіал
Наме: Срі Радгікастака Сонґ 6
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) In
the forests of Vraja on the banks of the Yamuna there are beautiful thrones
bedecked with flowers.
2) The
creepers and fruit trees give satisfaction to the eyes and upon these trees and
creepers many birds sing sweetly.
3) A
breeze from the Malaya hills blows ever so gently while swarms of bumblebees
fly about in search of honey.
4) The
full glowing moon of the spring season then distributes its cooling rays out of
love and respect.
5) At
such a time as this, the best of relishers begins His rasa dance the holder of
the flute.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'বনস্পতি-লতাতুষয়ে আঁখি
তদ উপরি কত ডাকয়ে পাখী', E'বনস্পতি-লতাতুষয়ে আঁখি
তদ উপরি কত ডাকয়ে পাখী',
    E'baraja-bipinejamunā-kūle
mañca
manoharaśobhita phule', E'бараджа-біпінеджамуна̄-кӯле
ман̃ча
манохараш́обгіта пхуле',
    E'', E'',
    E'Millions of cowherd maidens Lord Hari is in the midst dancing along with Radha
rejoicing in great bliss.
7) The
Enchantress of Madhava singing beautiful songs steals away the minds of all the
three worlds.
8) All
moving and non-moving beings enchanted by chaste Radha who has forcefully
defeated the pride of Candravali.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'মলয় অনিলবহয়ে ধীরে
অলি-কুল মধু-লোভেয়ে ফিরে', E'মলয় অনিলবহয়ে ধীরে
অলি-কুল মধু-লোভেয়ে ফিরে',
    E'banaspati-latātuṣaye
āńkhi
tad
upari kotoḍākaye pākhī', E'банаспаті-лата̄тушайе
а̄ńкхі
тад
упарі котод̣а̄кайе па̄кхı̄',
    E'', E'',
    E'After agitating the mind of youthful Vraja-Kisor Radha oh so suddenly
disappears from the scene.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'বাসন্তীর রাকাউডুপ তদা
কৌমুদী বিতরে আদরে সদা', E'বাসন্তীর রাকাউডুপ তদা
কৌমুদী বিতরে আদরে সদা',
    E'malaya
anilavahaye dhīre
ali-kula
madhu-lobheye phire', E'малайа
анілавахайе дгı̄ре
алі-кула
мадгу-лобгейе пхіре',
    E'', E'',
    E'This Bhaktivinoda perceives some calamity-the rasa dance has now stopped in the
absence of Radha.
Remarks/ Extra Information:
No Extra
Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'এমত সময়েরসিক-বর
আরম্ভিল রাসমুরলী-ধর', E'এমত সময়েরসিক-বর
আরম্ভিল রাসমুরলী-ধর',
    E'bāsantīra
rākāuḍupa tadā
kaumudī
bitoreādare sadā', E'ба̄сантı̄ра
ра̄ка̄уд̣упа тада̄
каумудı̄
бітореа̄даре сада̄',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'শত-কোটী গোপীমাঝেতে হরি
রাধা-সহ নাচেআনন্দ করি', E'শত-কোটী গোপীমাঝেতে হরি
রাধা-সহ নাচেআনন্দ করি',
    E'emata
samayerasika-bara
ārambhilo
rāsamuralī-dhara', E'емата
самайерасіка-бара
а̄рамбгіло
ра̄самуралı̄-дгара',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'মাধব-মোহিনীগাইয়া গীত
হরিল সকলজগত-চিত', E'মাধব-মোহিনীগাইয়া গীত
হরিল সকলজগত-চিত',
    E'śata-koṭī
gopīmājhete hari
rādhā-saha
nāceānanda kori', E'ш́ата-кот̣ı̄
ґопı̄ма̄джхете харі
ра̄дга̄-саха
на̄чеа̄нанда корі',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'স্থাবর-জঙ্গমমোহিলা সতী
হারাওল চন্দ্রা- বলীর মতি', E'স্থাবর-জঙ্গমমোহিলা সতী
হারাওল চন্দ্রা- বলীর মতি',
    E'mādhava-mohinīgāiyā
gīta
harilo
sakalajagata-cita', E'ма̄дгава-мохінı̄ґа̄ійа̄
ґı̄та
харіло
сакаладжаґата-чіта',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'মথিয়া বরজ-কিশোর-মন
অন্তরিত হয় রাধা তখন', E'মথিয়া বরজ-কিশোর-মন
অন্তরিত হয় রাধা তখন',
    E'sthāvara-jańgamamohilā
satī
hārāolo
candrā- valīra mati', E'стха̄вара-джаńґамамохіла̄
сатı̄
ха̄ра̄оло
чандра̄- валı̄ра маті',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 10
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10', 10,
    E'ভকতিবিনোদপরমাদ গণে
রাস ভাঙ্গল (আজি) রাধা বিহনে', E'ভকতিবিনোদপরমাদ গণে
রাস ভাঙ্গল (আজি) রাধা বিহনে',
    E'mathiyā
baraja-kiśora-man
antarita
hoyrādhā takhon', E'матхійа̄
бараджа-кіш́ора-ман
антаріта
хойра̄дга̄ такхон',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 11
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11', 11,
    E'', E'',
    E'bhakativinodaparamāda
gaṇe
rāsa
bhāńgalo (āji) rādhā vihane', E'бгакатівінодапарама̄да
ґан̣е
ра̄са
бга̄ńґало (а̄джі) ра̄дга̄ віхане',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 12, Song 7: Sata Koti Gopi Madhava
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 12;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Sata Koti Gopi Madhava', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'শত-কোটি গোপী
মাধব-মন
রাখিতে নারিল
করি''
যতন', E'শত-কোটি গোপী
মাধব-মন
রাখিতে নারিল
করি''
যতন',
    E'Song
Name: Sata Koti Gopi Madhava
Official
Name: Radhikastakam Song 7
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Сата Коті Ґопі Мадгава
Оffічіал
Наме: Радгікастакам Сонґ 7
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Millions of cowherd damsels are unable to please the mind of Madhava, although
endeavoring to do so.
2) The
flute song calls the name of Radhika, Come here, come here, Radhe! Syama
calls out in the night.
3) When
the Sri-rasa-mandala comes to a halt, in search of Beloved Radha He then
goes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'বেনু-গীতে ডাকে
রাধিকা-নাম
এসো এসো রাধে!''ডাকয়ে শ্যাম', E'বেনু-গীতে ডাকে
রাধিকা-নাম
এসো এসো রাধে!''ডাকয়ে শ্যাম',
    E'śata-koṭi
gopī mādhava-man
rākhite
nārilo kori'' jatan', E'ш́ата-кот̣і
ґопı̄ ма̄дгава-ман
ра̄кхіте
на̄ріло корі'' джатан',
    E'', E'',
    E'"Please appear, O Radhe! Kindly save My life!" calling out while
weeping Kana in the forest.
5) In
a secluded grove embracing Radhika regaining His life and soul Hari is relieved.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'ভাঙ্গিয়া শ্রী-রাস-মণ্ডল তবে
রাধা-অন্বেষনে
চলয়ে যবে', E'ভাঙ্গিয়া শ্রী-রাস-মণ্ডল তবে
রাধা-অন্বেষনে
চলয়ে যবে',
    E'venu-gīte
ḍāke rādhikā-nām
`eso
eso rādhe!'' ḍākoye śyām', E'вену-ґı̄те
д̣а̄ке ра̄дгіка̄-на̄м
`есо
есо ра̄дге!'' д̣а̄койе ш́йа̄м',
    E'', E'',
    E'Saying, "Without You, where is the rasa dance? Only because of You, do I
live in Vraja."
7) At
the lotus feet of such a Radhika, this Bhaktivinoda says weeping,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'দেখা দিয়া রাধে! রাখহ প্রান!''
বলিয়া কাঁদয়ে
কাননে কান', E'দেখা দিয়া রাধে! রাখহ প্রান!''
বলিয়া কাঁদয়ে
কাননে কান',
    E'bhāńgiyā
śrī-rāsa-maṇḍala tabe
rādhā-anveṣane
calaye jabe', E'бга̄ńґійа̄
ш́рı̄-ра̄са-ман̣д̣ала табе
ра̄дга̄-анвешане
чалайе джабе',
    E'', E'',
    E'"Among Your personal associates please count me also; making me Your maidservant
keep me as Your own."
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'নির্জন কাননে
রাধারে ধরি''
মিলিয়া
পরাণ জুড়ায় হরি', E'নির্জন কাননে
রাধারে ধরি''
মিলিয়া
পরাণ জুড়ায় হরি',
    E'`dekhā
diyā rādhe! rākhoha prāṇ!''
boliyā
kāńdaye kānane kān', E'`декха̄
дійа̄ ра̄дге! ра̄кхоха пра̄н̣!''
болійа̄
ка̄ńдайе ка̄нане ка̄н',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'বলে, তুঁহু বিনা
কাহার রাস?
তুঁহু লাগি'' মোর বরজ-বাস''', E'বলে, তুঁহু বিনা
কাহার রাস?
তুঁহু লাগি'' মোর বরজ-বাস''',
    E'nirjana
kānane rādhāre dhori''
miliyā
parāṇ juḍāya hari', E'нірджана
ка̄нане ра̄дга̄ре дгорі''
мілійа̄
пара̄н̣ джуд̣а̄йа харі',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'এ হেন রাধিকা-চরণ-তলে
ভকতিবিনোদ
কাঁদিয়া বলে', E'এ হেন রাধিকা-চরণ-তলে
ভকতিবিনোদ
কাঁদিয়া বলে',
    E'bole,
tuńhu vinā kāhāra rāsa?
tuńhu
lāgi'' mor baraja-bāsa''', E'боле,
туńху віна̄ ка̄ха̄ра ра̄са?
туńху
ла̄ґі'' мор бараджа-ба̄са''',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'তুয়া গণ-মাঝে
আমারে গণি''
কিঙ্কোরী করিয়া
রখ
অপনি''', E'তুয়া গণ-মাঝে
আমারে গণি''
কিঙ্কোরী করিয়া
রখ
অপনি''',
    E'e
heno rādhikā-caraṇa-tale
bhakativinoda
kāńdiyā bole', E'е
хено ра̄дгіка̄-чаран̣а-тале
бгакатівінода
ка̄ńдійа̄ боле',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'', E'',
    E'`tuwā
gaṇa-mājhe āmāre gaṇi''
kińkorī
koriyā rakho apani''', E'`тува̄
ґан̣а-ма̄джхе а̄ма̄ре ґан̣і''
кіńкорı̄
корійа̄ ракхо апані''',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 12, Song 8: Radha Bhajane Jadi
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 12;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Radha Bhajane Jadi', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 8;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'রাধ-ভজনে যদি মতি নাহি ভেলা
কৃষ্ণ-ভজন তব অকারণ গেলা', E'রাধ-ভজনে যদি মতি নাহি ভেলা
কৃষ্ণ-ভজন তব অকারণ গেলা',
    E'Song
Name: Radha Bhajane Jadi Mati
Official
Name: Radhikastakam Song 8
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Радга Бхаджане Джаді Маті
Оffічіал
Наме: Радгікастакам Сонґ 8
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) If
your desire for the worship of Srimati Radharani does not come about, then your
so-called worship of Krsna is completely useless.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'আতপ-রহিত সূরয় নাহি জানি
রাধা-বিরহিত মাধব নাহি মানি', E'আতপ-রহিত সূরয় নাহি জানি
রাধা-বিরহিত মাধব নাহি মানি',
    E'rādha-bhajane
jadi mati nāhi bhelā
kṛṣṇa-bhajana
tava akāraṇa gelā', E'ра̄дга-бгаджане
джаді маті на̄хі бгела̄
кр̣шн̣а-бгаджана
тава ака̄ран̣а ґела̄',
    E'', E'',
    E'Just as I never know the sun to be without sunlight, so I do not care to regard
Madhava without Radha.
3) One
who worships Madhava alone is imperfect in his knowledge, and one who
disrespects Radha is simply conceited and proud.
4) You
should never associate with such a person if you at all desire within your
heart to participate in the eternal sportive pastimes of Vraja.
5) If
one considers oneself to be a humble maidservant of Radhika, then such a person
very quickly meets the Lord of Gokula.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'কেবল মাধব পূজয়ে সো অজ্ঞানী
রাধা অনাদর করই অভিমানী', E'কেবল মাধব পূজয়ে সো অজ্ঞানী
রাধা অনাদর করই অভিমানী',
    E'ātapa-rohita
sūraya nāhi jāni
rādhā-virahita
mādhava nāhi māni', E'а̄тапа-рохіта
сӯрайа на̄хі джа̄ні
ра̄дга̄-вірахіта
ма̄дгава на̄хі ма̄ні',
    E'', E'',
    E'Lord Brahma, Lord Siva, Narada Muni, the personified Vedas, and Laksmi-devi all
honor and worship the dust of Radhika''s lotus feet.
7) The
Vedic scriptures declare that the goddesses Uma, Rama, Satya, Saci, Candra, and
Rukmini are all personal expansions of Srimati Radharani.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'কবঁহি নাহি করবি তাঁহর সঙ্গ
চিত্তে ইচ্ছসি যদি ব্রজ-রস-রঙ্গ', E'কবঁহি নাহি করবি তাঁহর সঙ্গ
চিত্তে ইচ্ছসি যদি ব্রজ-রস-রঙ্গ',
    E'kevala
mādhava pūjaye so ajñānī
rādhā
anādara koro-i abhimānī', E'кевала
ма̄дгава пӯджайе со аджн̃а̄нı̄
ра̄дга̄
ана̄дара коро-і абгіма̄нı̄',
    E'', E'',
    E'Bhaktivinoda, whose only treasure is the service of such a Radha, humbly begs
for Her lotus feet.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'রাধিকা-দাসী যদি হয় অভিমান
শীঘ্রই মিলই তব গোকুল-কান', E'রাধিকা-দাসী যদি হয় অভিমান
শীঘ্রই মিলই তব গোকুল-কান',
    E'kabańhi
nāhi korobi tāńkor sańga
citte
icchasi jadi braja-rasa-rańga', E'кабаńхі
на̄хі коробі та̄ńкор саńґа
чітте
іччхасі джаді браджа-раса-раńґа',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'ব্রহ্মা, শিব, নারদ, শ্রুতি, নারায়নী
রাধিকা-পদ-রজ পূজয়ে মানি''', E'ব্রহ্মা, শিব, নারদ, শ্রুতি, নারায়নী
রাধিকা-পদ-রজ পূজয়ে মানি''',
    E'rādhikā-dāsī
jadi hoy abhimān
śīghra-i
mila-i taba gokula-kān', E'ра̄дгіка̄-да̄сı̄
джаді хой абгіма̄н
ш́ı̄ґгра-і
міла-і таба ґокула-ка̄н',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'উমা, রমা, সত্যা, শচী, চন্দ্রা, রুক্মিনী
রাধ-অবতার সবে,আম্নায়-বানী', E'উমা, রমা, সত্যা, শচী, চন্দ্রা, রুক্মিনী
রাধ-অবতার সবে,আম্নায়-বানী',
    E'brahmā,
śiva, nārada, śruti, nārāyanī
rādhikā-pada-raja
pūjaye māni''', E'брахма̄,
ш́іва, на̄рада, ш́руті, на̄ра̄йанı̄
ра̄дгіка̄-пада-раджа
пӯджайе ма̄ні''',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'হেন রাধা-পরিচর্যা জাঙ্কর ধন
ভকতিবিনোদ তা''র মাগয়ে চরণ', E'হেন রাধা-পরিচর্যা জাঙ্কর ধন
ভকতিবিনোদ তা''র মাগয়ে চরণ',
    E'umā,
ramā, satyā, śacī, candrā, rukminī
rādha-avatāra
sabe,āmnāya-vānī', E'ума̄,
рама̄, сатйа̄, ш́ачı̄, чандра̄, рукмінı̄
ра̄дга-авата̄ра
сабе,а̄мна̄йа-ва̄нı̄',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'', E'',
    E'heno
rādhā-paricaryā jāńkara dhan
bhakativinoda
tā''r māgaye caraṇ', E'хено
ра̄дга̄-парічарйа̄ джа̄ńкара дган
бгакатівінода
та̄''р ма̄ґайе чаран̣',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 13, Song 1: Bhojana Lalase
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 13;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Bhojana Lalase', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'ভোজন-লালসে, রসনে আমার,
শুনহ বিধান মোর
শ্রী-নাম-যুগল-রাগ-সুধা-রস,
খাইয়া থাকহ ভর', E'ভোজন-লালসে, রসনে আমার,
শুনহ বিধান মোর
শ্রী-নাম-যুগল-রাগ-সুধা-রস,
খাইয়া থাকহ ভর',
    E'Song
Name: Bhojana Lalase
Official
Name: Sri Radhikastaka Parisista
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Бходжана Лаласе
Оffічіал
Наме: Срі Радгікастака Парісіста
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
my tongue, you who are overwhelmed with the desire for tasting material
enjoyment, please hear my instructions. Always remain deeply absorbed in
drinking the nectar-like loving mellows of the beautiful names of the divine
couple Radha and Krsna.
2) The
name of Radhika is ever-fresh and lovely, and is pure ambrosia. It is very
sweet, utterly enchanting and is the abode of complete satisfaction.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'নব-সুন্দর পীয়ূষ রাধিকা-নাম
অতি-মিষ্ট মনোহর তর্পন-ধাম', E'নব-সুন্দর পীয়ূষ রাধিকা-নাম
অতি-মিষ্ট মনোহর তর্পন-ধাম',
    E'bhojana-lālase,
rasane āmār,
śunoha
vidhāna mor
śrī-nāma-yugala-rāga-sudhā-rasa,
khāiyā
thākoha bhor', E'бгоджана-ла̄ласе,
расане а̄ма̄р,
ш́уноха
відга̄на мор
ш́рı̄-на̄ма-йуґала-ра̄ґа-судга̄-раса,
кха̄ійа̄
тха̄коха бгор',
    E'', E'',
    E'With great care, you should eagerly blend this ambrosial name of Radhika with
the wonderful sweet condensed milk of the name of Krsna.
4) Now
add into that mixture the sweet fragrance of loving affection, which is both
cool and delightful. Drink this nectar day and night, and you will know what
true happiness is.
5) No
longer will there remain on the tongue a thirst for mundane tastes, for these
wonderful transcendental mellows will fulfill all of your desires.
6) At
the lotus feet of Raghunatha dasa Goswami, Bhaktivinoda begs for ecstatic
rapture in hearing and chanting the divine names of Radha and Krsna.
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'কৃষ্ণ-নাম মধুরাদ্ভুত গাঢ দুগ্ধে
অতীব যতনে কর মিশ্রিত লুব্ধে', E'কৃষ্ণ-নাম মধুরাদ্ভুত গাঢ দুগ্ধে
অতীব যতনে কর মিশ্রিত লুব্ধে',
    E'nava-sundar
pīyūṣa rādhikā-nām
ati-miṣṭa
manohar tarpana-dhām', E'нава-сундар
пı̄йӯша ра̄дгіка̄-на̄м
аті-мішт̣а
манохар тарпана-дга̄м',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'সুরভি রাগ হিম রম্য তঁহি আনি''
অহরহ পান করহ সুখ জানি''', E'সুরভি রাগ হিম রম্য তঁহি আনি''
অহরহ পান করহ সুখ জানি''',
    E'kṛṣṇa-nām
madhurādbhuta gāḍha dugdhe
atīva
jatane koro miśrita lubdhe', E'кр̣шн̣а-на̄м
мадгура̄дбгута ґа̄д̣ха дуґдге
атı̄ва
джатане коро міш́ріта лубдге',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'নাহি রবে রসনে প্রাকৃত পিপাসা
অদ্ভুত রস তুয়া পূরাওব আশা', E'নাহি রবে রসনে প্রাকৃত পিপাসা
অদ্ভুত রস তুয়া পূরাওব আশা',
    E'surabhi
rāga hima ramya tańhi āni''
aharaha
pān koroha sukha jāni''', E'сурабгі
ра̄ґа хіма рамйа таńхі а̄ні''
ахараха
па̄н короха сукха джа̄ні''',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'দাস-রঘুনাথ-পদে ভক্তিবিনোদ
যাচ‌ই রাধা-কৃষ্ণ-নাম প্রমোদ', E'দাস-রঘুনাথ-পদে ভক্তিবিনোদ
যাচ‌ই রাধা-কৃষ্ণ-নাম প্রমোদ',
    E'nāhi
rabe rasane prākṛta pipāsā
adbhuta
rasa tuwā pūrāobo āśā', E'на̄хі
рабе расане пра̄кр̣та піпа̄са̄
адбгута
раса тува̄ пӯра̄обо а̄ш́а̄',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'', E'',
    E'dāsa-raghunātha-pade
bhaktivinod
jāco-i
rādhā-kṛṣṇa-nāma pramod', E'да̄са-раґгуна̄тха-паде
бгактівінод
джа̄чо-і
ра̄дга̄-кр̣шн̣а-на̄ма прамод',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 14, Song 1: Pita Varna Kali Pavana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 14;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Pita Varna Kali Pavana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'পীত-বরণ কলি-পাবন গোরা
গাওয়াই ঐছন ভাব-বিভোরা', E'পীত-বরণ কলি-পাবন গোরা
গাওয়াই ঐছন ভাব-বিভোরা',
    E'Song
Name: Pita Varana Kali Pavana
Official
Name: Siksastakam Song 1
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Піта Варана Калі Павана
Оffічіал
Наме: Сіксастакам Сонґ 1
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Lord Gauranga, whose complexion is golden and who is the deliverer of the
fallen souls of Kali-yuga, sings as follows, overwhelmed with spiritual
ecstasy:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'চিত্ত-দর্পন-পরিমার্জন-কারী
কৃষ্ণ-কীর্তন জয় চিত্ত বিহারী', E'চিত্ত-দর্পন-পরিমার্জন-কারী
কৃষ্ণ-কীর্তন জয় চিত্ত বিহারী',
    E'pīta-varaṇa
kali-pāvana gorā
gāoyāi
aichana bhāva-vibhorā', E'пı̄та-варан̣а
калі-па̄вана ґора̄
ґа̄ойа̄і
аічхана бга̄ва-вібгора̄',
    E'', E'',
    E'"All glories to the chanting of the holy name of Krsna! It thoroughly
cleanses the mirror of the heart. This chanting delights the soul.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'হেলা-ভব-দাব-নির্বাপন-বৃত্তি
কৃষ্ণ-কীর্তন জয় ক্লেশ-নিবৃত্তি', E'হেলা-ভব-দাব-নির্বাপন-বৃত্তি
কৃষ্ণ-কীর্তন জয় ক্লেশ-নিবৃত্তি',
    E'citta-darpana-parimārjana-kārī
kṛṣṇa-kīrtana
jaya citta bihārī', E'чітта-дарпана-паріма̄рджана-ка̄рı̄
кр̣шн̣а-кı̄ртана
джайа чітта біха̄рı̄',
    E'', E'',
    E'"All glories to the chanting of the holy name of Krsna! It extinguishes
the horrible forest fire of material existence. This chanting removes all
material tribulations.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'শ্রেয়ঃ-কুমুদ-বিধু-জ্যোত্স্না-প্রকাশ
কৃষ্ণ-কীর্তন জয় ভক্তি-বিলাস', E'শ্রেয়ঃ-কুমুদ-বিধু-জ্যোত্স্না-প্রকাশ
কৃষ্ণ-কীর্তন জয় ভক্তি-বিলাস',
    E'helā-bhava-dāva-nirvāpana-vṛtti
kṛṣṇa-kīrtana
jaya kleśa-nivṛtti', E'хела̄-бгава-да̄ва-нірва̄пана-вр̣тті
кр̣шн̣а-кı̄ртана
джайа клеш́а-нівр̣тті',
    E'', E'',
    E'"All glories to the chanting of the holy name of Krsna! It appears like
the moon in the heart and distributes its cooling moonlight, thus causing the
white lotus of good fortune to bloom. This chanting is the pastime of devotion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'বিশুদ্ধ-বিদ্যা-বধূ জীবন-রূপ
কৃষ্ণ-কীর্তন জয় সিদ্ধ-স্বরূপ', E'বিশুদ্ধ-বিদ্যা-বধূ জীবন-রূপ
কৃষ্ণ-কীর্তন জয় সিদ্ধ-স্বরূপ',
    E'śreyaḥ-kumuda-vidhu-jyotsnā-prakāś
kṛṣṇa-kīrtana
jaya bhakti-vilās', E'ш́рейах̣-кумуда-відгу-джйотсна̄-прака̄ш́
кр̣шн̣а-кı̄ртана
джайа бгакті-віла̄с',
    E'', E'',
    E'"All glories to the chanting of the holy name of Krsna! It is compared to
a young bride, chaste and devoted to transcendental knowledge itself. This
chanting is the highest perfection of life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'আনন্দ-পয়-নিধি-বর্ধন-কীর্তি
কৃষ্ণ-কীর্তন জয় প্লাবন-মূর্তি', E'আনন্দ-পয়-নিধি-বর্ধন-কীর্তি
কৃষ্ণ-কীর্তন জয় প্লাবন-মূর্তি',
    E'viśuddha-vidyā-vadhū
jīvana-rūp
kṛṣṇa-kīrtana
jaya siddha-swarūp', E'віш́уддга-відйа̄-вадгӯ
джı̄вана-рӯп
кр̣шн̣а-кı̄ртана
джайа сіддга-сварӯп',
    E'', E'',
    E'"All glories to the chanting of the holy name of Krsna! It is glorious, as
it causes the ocean of ecstatic bliss to swell and overflow. This chanting is
an inundation of love of Godhead.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'পদে পদে পীয়ূষ-স্বাদ-প্রদাতা
কৃষ্ণ-কীর্তন জয় প্রেম-বিধাতা', E'পদে পদে পীয়ূষ-স্বাদ-প্রদাতা
কৃষ্ণ-কীর্তন জয় প্রেম-বিধাতা',
    E'ānanda-payo-nidhi-vardhana-kīrti
kṛṣṇa-kīrtana
jaya plāvana-mūrti', E'а̄нанда-пайо-нідгі-вардгана-кı̄рті
кр̣шн̣а-кı̄ртана
джайа пла̄вана-мӯрті',
    E'', E'',
    E'"All glories to the chanting of the holy name of Krsna! It gives one a
taste of fully satisfying nectar at every step. This chanting is the bestower
of ecstatic love of God."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'ভক্তিবিনোদ-স্বাত্ম-স্নপন-বিধান
কৃষ্ণ-কীর্তন জয় প্রেম-নিদান', E'ভক্তিবিনোদ-স্বাত্ম-স্নপন-বিধান
কৃষ্ণ-কীর্তন জয় প্রেম-নিদান',
    E'pade
pade pīyūṣa-swāda-pradātā
kṛṣṇa-kīrtana
jaya prema-vidhātā', E'паде
паде пı̄йӯша-сва̄да-прада̄та̄
кр̣шн̣а-кı̄ртана
джайа према-відга̄та̄',
    E'', E'',
    E'All glories to the chanting of the holy name of Krsna! It bathes the soul of
Bhaktivinoda. This chanting is a storehouse of love of God.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'', E'',
    E'bhaktivinoda-swātma-snapana-vidhān
kṛṣṇa-kīrtana
jaya prema-nidān', E'бгактівінода-сва̄тма-снапана-відга̄н
кр̣шн̣а-кı̄ртана
джайа према-ніда̄н',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 14, Song 2: Tunh Doya Sagara
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 14;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Tunh Doya Sagara', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'তুঁহু দয়া-সাগর তারয়িতে প্রাণী
নাম অনেক তুয়া শিখাওলি আনি''', E'তুঁহু দয়া-সাগর তারয়িতে প্রাণী
নাম অনেক তুয়া শিখাওলি আনি''',
    E'Song
Name: Tunhu Doya Sagara
Official
Name: Siksastakam Song 2
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Тунху Дойа Саґара
Оffічіал
Наме: Сіксастакам Сонґ 2
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
Lord, You are an ocean of mercy. You have brought Your innumerable holy names to
this world and have taught the chanting of them to the fallen living beings
just for their deliverance.
2) You
invest all Your energies in Your own holy name, and for chanting Your holy name
You have not established any rules such as consideration of time or place.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'সকল শকতি দেই নামে তোহারা
গ্রহনে রাখলি নাহি কাল-বিচারা', E'সকল শকতি দেই নামে তোহারা
গ্রহনে রাখলি নাহি কাল-বিচারা',
    E'tuńhu
doyā-sāgara tārayite prāṇī
nām
aneka tuwā śikhāoli āni''', E'туńху
дойа̄-са̄ґара та̄райіте пра̄н̣ı̄
на̄м
анека тува̄ ш́ікха̄олі а̄ні''',
    E'', E'',
    E'Your divine holy name, being non-different from You, is like touchstone. You
have distributed Your holy name throughout the entire creation, and that is the
essence of Your kindness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'শ্রী-নাম-চিন্তামণি তোহারি সমানা
বিশ্বে বিলাওলি করুনা-নিদানা', E'শ্রী-নাম-চিন্তামণি তোহারি সমানা
বিশ্বে বিলাওলি করুনা-নিদানা',
    E'sakala
śakati dei nāme tohārā
grahane
rākholi nāhi kāla-vicārā', E'сакала
ш́акаті деі на̄ме тоха̄ра̄
ґрахане
ра̄кхолі на̄хі ка̄ла-віча̄ра̄',
    E'', E'',
    E'Such is Your mercy, which is supremely magnanimous, O Lord, but I am extremely
unfortunate.
5) My
attraction for the holy name has never come about; therefore the heart of
Bhaktivinoda is overwhelmed with sadness.
REMARKS/EXTRA
INFORMATION:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'তুয়া দয়া ঐছন পরম উদারা
অতিশয় মন্দ নাথ! ভাগ হামারা', E'তুয়া দয়া ঐছন পরম উদারা
অতিশয় মন্দ নাথ! ভাগ হামারা',
    E'śrī-nāma-cintāmaṇi
tohāri samānā
viśve
bilāoli karunā-nidānā', E'ш́рı̄-на̄ма-чінта̄ман̣і
тоха̄рі сама̄на̄
віш́ве
біла̄олі каруна̄-ніда̄на̄',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'নাহি জনমল নামে অনুরাগ মোর
ভকতিবিনোদ-চিত্ত দুঃখে বিভোর', E'নাহি জনমল নামে অনুরাগ মোর
ভকতিবিনোদ-চিত্ত দুঃখে বিভোর',
    E'tuwā
doyā aichana parama udārā
atiśoy
manda nātha! bhāga hāmārā', E'тува̄
дойа̄ аічхана парама уда̄ра̄
атіш́ой
манда на̄тха! бга̄ґа ха̄ма̄ра̄',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'', E'',
    E'nāhi
janamalo nāme anurāga mor
bhakativinoda-citta
duḥkhe vibhor', E'на̄хі
джанамало на̄ме анура̄ґа мор
бгакатівінода-чітта
дух̣кхе вібгор',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 14, Song 3: Sri Krsna Sankirtane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 14;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Sri Krsna Sankirtane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'শ্রী-কৃষ্ণ-কীর্তনে যদি মানস তোহার
পরম যতনে তাহি লভ অধিকার', E'শ্রী-কৃষ্ণ-কীর্তনে যদি মানস তোহার
পরম যতনে তাহি লভ অধিকার',
    E'Song
Name: Sri Krsna Sankirtane Jadi Manasa Tohar
Official
Name: Siksastakam Song 3
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Срі Крсна Санкіртане Джаді Манаса Тохар
Оffічіал
Наме: Сіксастакам Сонґ 3
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) If
your mind is always absorbed in chanting the glories of Lord Krsna with great
care, then by that process of Sri-krsna-kirtana you will attain transcendental
qualification.
2) You
should give up all false pride and always consider yourself to be worthless,
destitute, lower and more humble than a blade of grass.
3) You
should practice forgiveness like that of a tree, and giving up violence toward
other living beings, you should protect and maintain them.
4) In
the course of passing your life, you should never give anxiety to others, but
rather do good to them while forgetting about your own happiness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'তৃনাধিক হীন, দীন, অকিঞ্চন ছার
আপনে মানোবি সদা ছাড়ি'' অহঙ্কার', E'তৃনাধিক হীন, দীন, অকিঞ্চন ছার
আপনে মানোবি সদা ছাড়ি'' অহঙ্কার',
    E'śrī-kṛṣṇa-sańkīrtane
jadi mānasa tohār
parama
jatane tāhi labho adhikār', E'ш́рı̄-кр̣шн̣а-саńкı̄ртане
джаді ма̄наса тоха̄р
парама
джатане та̄хі лабго адгіка̄р',
    E'', E'',
    E'When one has thus become a great soul, possessing all good qualities, one
should abandon all desires for fame and honor and make one''s heart humble.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'বৃক্ষ-সম ক্ষমা-গুন করবি সাধন
প্রতি-হিংসা ত্যজি'' অন্যে করবি পালন', E'বৃক্ষ-সম ক্ষমা-গুন করবি সাধন
প্রতি-হিংসা ত্যজি'' অন্যে করবি পালন',
    E'tṛnādhika
hīna, dīna, akiñcana chār
āpane
mānobi sadā chāḍi'' ahańkār', E'тр̣на̄дгіка
хı̄на, дı̄на, акін̃чана чха̄р
а̄пане
ма̄нобі сада̄ чха̄д̣і'' ахаńка̄р',
    E'', E'',
    E'Knowing that Lord Krsna resides within all living creatures, one should with
great respect consistently show honor to all beings.
7) By
possessing these four qualities-humility, mercifulness, respect toward others,
and the renunciation of desires for prestige-one becomes virtuous. In such a
state you may sing the glories of the Supreme Lord.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'জীবন-নির্বাহে আনে উদ্বেগ না দিবে
পর-উপকারে নিজ-সুখ পাসরিবে', E'জীবন-নির্বাহে আনে উদ্বেগ না দিবে
পর-উপকারে নিজ-সুখ পাসরিবে',
    E'vṛkṣa-sama
kṣamā-guna korobi sādhan
prati-hiḿsā
tyaji'' anye korobi pālan', E'вр̣кша-сама
кшама̄-ґуна коробі са̄дган
праті-хіḿса̄
тйаджі'' анйе коробі па̄лан',
    E'', E'',
    E'Weeping, Bhaktivinoda submits his prayer at the lotus feet of the the
Lord: "O Lord, when will you give me the qualification for possessing
attributes such as these?"
REMARKS/EXTRA
INFORMATION:
No Extra
Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'হ‌ইলে-ও সর্ব-গুনে গুনী মহাশয়
প্রতিষ্ঠাশা ছাড়ি কর অমনি হৃদয়', E'হ‌ইলে-ও সর্ব-গুনে গুনী মহাশয়
প্রতিষ্ঠাশা ছাড়ি কর অমনি হৃদয়',
    E'jīvana-nirvāhe
āne udvega nā dibe
para-upakāre
nija-sukha pāsaribe', E'джı̄вана-нірва̄хе
а̄не удвеґа на̄ дібе
пара-упака̄ре
ніджа-сукха па̄сарібе',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'কৃষ্ণ-অধিষ্ঠান সর্ব-জিবে জানি'' সদা
করবি সম্মান সবে আদরে সর্বদা', E'কৃষ্ণ-অধিষ্ঠান সর্ব-জিবে জানি'' সদা
করবি সম্মান সবে আদরে সর্বদা',
    E'hoile-o
sarva-gune gunī mahāśoy
pratiṣṭhāśā
chāḍi koro amani hṛdoy', E'хоіле-о
сарва-ґуне ґунı̄ маха̄ш́ой
пратішт̣ха̄ш́а̄
чха̄д̣і коро амані хр̣дой',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'দৈন্য, দয়া, অন্যে মান, প্রতিষ্ঠা-বর্জন
চারি গুনে গুনী হ‌ই'' করহ কীর্তন', E'দৈন্য, দয়া, অন্যে মান, প্রতিষ্ঠা-বর্জন
চারি গুনে গুনী হ‌ই'' করহ কীর্তন',
    E'kṛṣṇa-adhiṣṭhāna
sarva-jive jāni'' sadā
korobi
sammāna sabe ādare sarvadā', E'кр̣шн̣а-адгішт̣ха̄на
сарва-джіве джа̄ні'' сада̄
коробі
самма̄на сабе а̄даре сарвада̄',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'ভকতিবিনোদ কাঁদি'', বলে প্রভু-পায়
হেন অধিকার কবে দিবে হে আমায়', E'ভকতিবিনোদ কাঁদি'', বলে প্রভু-পায়
হেন অধিকার কবে দিবে হে আমায়',
    E'dainya,
doyā, anye māna, pratiṣṭhā-varjan
cāri
gune gunī hoi'' koroha kīrtan', E'даінйа,
дойа̄, анйе ма̄на, пратішт̣ха̄-варджан
ча̄рі
ґуне ґунı̄ хоі'' короха кı̄ртан',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'', E'',
    E'bhakativinoda
kāńdi'', bole prabhu-pāy
heno
adhikāra kabe dibe he āmāy', E'бгакатівінода
ка̄ńді'', боле прабгу-па̄й
хено
адгіка̄ра кабе дібе хе а̄ма̄й',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 14, Song 4: Prabhu Tava Padayuge
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 14;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Prabhu Tava Padayuge', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'প্রভু তব পদ-যুগে মোর নিবেদন
নাহি মাগি দেহ-সুখ, বিদ্যা, ধন, জন', E'প্রভু তব পদ-যুগে মোর নিবেদন
নাহি মাগি দেহ-সুখ, বিদ্যা, ধন, জন',
    E'Song
Name: Prabhu Tava Pada Yuge
Official
Name: Siksastakam Song 4
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Прабгу Тава Пада Йуґе
Оffічіал
Наме: Сіксастакам Сонґ 4
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'My Lord: I submit the following prayer at Your holy feet: I do not pray to You
for physical leisure, for learning, wealth, or followers.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'নাহি মাগি স্বর্গ, আর মোক্ষ নাহি মাগি
না করি প্রার্থনা কোন বিভূতির লাগি''', E'নাহি মাগি স্বর্গ, আর মোক্ষ নাহি মাগি
না করি প্রার্থনা কোন বিভূতির লাগি''',
    E'prabhu
tava pada-yuge mora nivedan
nāhi
māgi deha-sukha, vidyā, dhana, jan', E'прабгу
тава пада-йуґе мора ніведан
на̄хі
ма̄ґі деха-сукха, відйа̄, дгана, джан',
    E'', E'',
    E'I do not pray for heaven or salvation. I do not pray for any of these
opulences.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'নিজ-কর্ম-গুন-দোষে যে যে জন্ম পায়
জন্মে জন্মে যেন তব নাম-গুন গায়', E'নিজ-কর্ম-গুন-দোষে যে যে জন্ম পায়
জন্মে জন্মে যেন তব নাম-গুন গায়',
    E'nāhi
māgi swarga, āra mokṣa nāhi māgi
nā
kori prārthanā kono vibhūtira lāgi''', E'на̄хі
ма̄ґі сварґа, а̄ра мокша на̄хі ма̄ґі
на̄
корі пра̄ртхана̄ коно вібгӯтіра ла̄ґі''',
    E'', E'',
    E'In whatever birth I take, wherever my karma leads me, let me sing the glories
of Your Holy Name birth after birth.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'এই মাত্র আশা মম তোমার চরণে
অহৈতুকী ভক্তি হৃদে জাগে অনুক্ষনে', E'এই মাত্র আশা মম তোমার চরণে
অহৈতুকী ভক্তি হৃদে জাগে অনুক্ষনে',
    E'nija-karma-guna-doṣe
je je janma pāi
janme
janme jeno tava nāma-guna gāi', E'ніджа-карма-ґуна-доше
дже дже джанма па̄і
джанме
джанме джено тава на̄ма-ґуна ґа̄і',
    E'', E'',
    E'This alone is my cherished hope, my aspiration, my prayer at your lotus feet:
Let causeless and uninterrupted devotion awaken within my heart and
flow towards You.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'বিষয়ে যে প্রীতি এবে আছয়ে আমার
সেই-মত প্রীতি হৌক চরণে তোমার', E'বিষয়ে যে প্রীতি এবে আছয়ে আমার
সেই-মত প্রীতি হৌক চরণে তোমার',
    E'ei
mātra āśā mama tomār caraṇe
ahoitukī
bhakti hṛde jāge anukṣane', E'еі
ма̄тра а̄ш́а̄ мама тома̄р чаран̣е
ахоітукı̄
бгакті хр̣де джа̄ґе анукшане',
    E'', E'',
    E'Let me love Your lotus feet as much as I now love sense gratification;
transfer my affection from the objects of the senses to Your lotus feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'বিপদে সম্পদে তাহা থাকুক সম-ভাবে
দিনে দিনে বৃদ্ধি হৌক নামের প্রভাবে', E'বিপদে সম্পদে তাহা থাকুক সম-ভাবে
দিনে দিনে বৃদ্ধি হৌক নামের প্রভাবে',
    E'viṣaye
je prīti ebe āchaye āmār
sei-mata
prīti hauk caraṇe tomār', E'вішайе
дже прı̄ті ебе а̄чхайе а̄ма̄р
сеі-мата
прı̄ті хаук чаран̣е тома̄р',
    E'', E'',
    E'In danger or success, good fortune or disaster, let me remain in equipoise. And
let my affection for You increase day by day by the influence of the Holy Name.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'পশু-পক্ষি হ''য়ে থাকি স্বর্গে বা নিরয়ে
তব ভক্তি রহু ভক্তিবিনোদ-হৃদয়ে', E'পশু-পক্ষি হ''য়ে থাকি স্বর্গে বা নিরয়ে
তব ভক্তি রহু ভক্তিবিনোদ-হৃদয়ে',
    E'vipade
sampade tāhā thākuk sama-bhāve
dine
dine vṛddhi hauk nāmera prabhāve', E'віпаде
сампаде та̄ха̄ тха̄кук сама-бга̄ве
діне
діне вр̣ддгі хаук на̄мера прабга̄ве',
    E'', E'',
    E'Whether I live as bird or beast, in heaven or in hell, let the humble
Bhaktivinoda always cherish bhakti in his heart of hearts.
REMARKS/EXTRA
INFORMATION:
Based
on how Bada Haridas sings this song, it is based on Raga Bhairavi in Tintal.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'', E'',
    E'paśu-pakṣi
ho''ye thāki swarge vā niroye
tava
bhakti rahu bhaktivinoda-hṛdoye', E'паш́у-пакші
хо''йе тха̄кі сварґе ва̄ ніройе
тава
бгакті раху бгактівінода-хр̣дойе',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 14, Song 5: Anadi Karam Aphale
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 14;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Anadi Karam Aphale', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'অনাদি'' করম-ফলে, পডি'' ভবার্ণর জলে,
তরিবারে না দেখি উপায়
এই বিষয়-হলাহলে, দিবা-নিশি হিয়া জ্বলে,
মন কভু সুখ নাহি পায়', E'অনাদি'' করম-ফলে, পডি'' ভবার্ণর জলে,
তরিবারে না দেখি উপায়
এই বিষয়-হলাহলে, দিবা-নিশি হিয়া জ্বলে,
মন কভু সুখ নাহি পায়',
    E'⇒ A
Song
Name: Anadi Karama Phale
Official
Name: Sri Siksastakam Song 5
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'⇒ А
Сонґ
Наме: Анаді Карама Пхале
Оffічіал
Наме: Срі Сіксастакам Сонґ 5
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) I
have fallen into the ocean of material existence as a result of my selfish
activities, which are without beginning, and I see no means of deliverance from
this great ocean of nescience. Day and night my heart burns from the poison of
these worldly activities, and on account of this my mind never finds any
satisfaction or happiness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'আশা-পাশ-শত-শত, ক্লেশ দেয় অবিরত,
প্রবৃত্তি-ঊর্মির তাহে খেলা
কাম-ক্রোধ-আদি ছয়, বাটপাডে দেয় ভয়,
অবসান হৈল আসি'' বেলা', E'আশা-পাশ-শত-শত, ক্লেশ দেয় অবিরত,
প্রবৃত্তি-ঊর্মির তাহে খেলা
কাম-ক্রোধ-আদি ছয়, বাটপাডে দেয় ভয়,
অবসান হৈল আসি'' বেলা',
    E'anādi''
karama-phale, poḍi'' bhavārnava-jale,
toribāre
nā dekhi upāy
e-viṣaya-halāhale,
divā-niśi hiyā jwale,
mana
kabhu sukha nāhi pāy', E'ана̄ді''
карама-пхале, под̣і'' бгава̄рнава-джале,
торіба̄ре
на̄ декхі упа̄й
е-вішайа-хала̄хале,
діва̄-ніш́і хійа̄ джвале,
мана
кабгу сукха на̄хі па̄й',
    E'', E'',
    E'Hundreds and thousands of desires, like nooses around my neck, constantly give
me misery and trouble. In that great ocean of nescience play the waves of
materialistic tendency. In this world there are many thieves and rogues, of
whom six are prominent; lust, anger, greed, illusion, and madness. They are
causing me great fear, and in this way my life is coming to an end.
3) The
two highway robbers, mental speculation and fruitive activity, have cheated me
and misled me, and finally they are throwing me into the ocean of misery. At
such a time as this, my dear Krsna, You are the only friend, and You are the
ocean of mercy and compassion. I have no strength to get out of this ocean of
nescience, so I pray to Your lotus feet that You will be kind and by Your
strength uplift me from this ocean of suffering.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'জ্ঞান-কর্ম-ঠগ দুই, মোরে প্রতারীয় লৈ,
অবশেষে ফেলে সিন্ধু-জলে
এ হেন সময়ে, বন্ধু, তুমি কৃষ্ণ কৃপা-সিন্ধু,
কৃপা করি'' তোলো মোরে বলে', E'জ্ঞান-কর্ম-ঠগ দুই, মোরে প্রতারীয় লৈ,
অবশেষে ফেলে সিন্ধু-জলে
এ হেন সময়ে, বন্ধু, তুমি কৃষ্ণ কৃপা-সিন্ধু,
কৃপা করি'' তোলো মোরে বলে',
    E'āśā-pāśa-śata-śata,
kleśa deya avirata,
pravṛtti-ūrmira
tāhe khelā
kāma-krodha-ādi
choy, bāṭapāḍe deya bhoy,
avasāna
hoilo āsi'' belā', E'а̄ш́а̄-па̄ш́а-ш́ата-ш́ата,
клеш́а дейа авірата,
правр̣тті-ӯрміра
та̄хе кхела̄
ка̄ма-кродга-а̄ді
чхой, ба̄т̣апа̄д̣е дейа бгой,
аваса̄на
хоіло а̄сі'' бела̄',
    E'', E'',
    E'Accept this fallen servant and fix me as a particle of dust on Your lotus feet.
Kindly give me shelter to this Bhaktivinoda. O most merciful Lord, actually I
am Your eternal servant, but having forgotten this I have become bound up in
the network of maya.
Remarks/ Extra Information:
No
Extra Information available for this song!
PURPORT:
By A.C.
Bhaktivedanta Swami Prabhupada
October 17,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'পতিত-কিঙ্করে ধরি'', পাদ-পদ্ম-ধুলি করি'',
দেহ ভক্তিবিনোদ আশ্রয়
আমি তব নিত্য-দাস, ভুলিয়া মায়ার পাশ,
বদ্ধ হ''য়ে আছি দয়াময়', E'পতিত-কিঙ্করে ধরি'', পাদ-পদ্ম-ধুলি করি'',
দেহ ভক্তিবিনোদ আশ্রয়
আমি তব নিত্য-দাস, ভুলিয়া মায়ার পাশ,
বদ্ধ হ''য়ে আছি দয়াময়',
    E'jñāna-karmaṭhaga
dui, more pratārīya loi,
avaśeṣe
phele sindhu-jale
e
heno samaye, bandhu, tumi kṛṣṇa kṛpā-sindhu,
kṛpā
kori'' tolo more bale', E'джн̃а̄на-кармат̣хаґа
дуі, море прата̄рı̄йа лоі,
аваш́еше
пхеле сіндгу-джале
е
хено самайе, бандгу, тумі кр̣шн̣а кр̣па̄-сіндгу,
кр̣па̄
корі'' толо море бале',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'', E'',
    E'patita-kińkore
dhori'', pāda-padma-dhuli kori'',
deho
bhaktivinode āśroy
āmi
tava nitya-dās, bhuliyā māyāra pāś,
baddha
ho''ye āchi doyāmoy', E'патіта-кіńкоре
дгорі'', па̄да-падма-дгулі корі'',
дехо
бгактівіноде а̄ш́рой
а̄мі
тава нітйа-да̄с, бгулійа̄ ма̄йа̄ра па̄ш́,
баддга
хо''йе а̄чхі дойа̄мой',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 14, Song 6: Aparadha Phale Mama
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 14;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Aparadha Phale Mama', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'অপরাধ-ফলে মম, চিত্ত ভেল বজ্র-সম,
তুয়া নামে না লভে বিকার
হতাশ হ‌ইয়ে, হরি, তব নাম উচ্চ করি'',
বড় দুঃখে ডাকি বার বার', E'অপরাধ-ফলে মম, চিত্ত ভেল বজ্র-সম,
তুয়া নামে না লভে বিকার
হতাশ হ‌ইয়ে, হরি, তব নাম উচ্চ করি'',
বড় দুঃখে ডাকি বার বার',
    E'⇒ A
Song
Name: Aparadha Phale Mama
Official
Name: Sri Siksastaka Song 6
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'⇒ А
Сонґ
Наме: Апарадга Пхале Мама
Оffічіал
Наме: Срі Сіксастака Сонґ 6
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
Lord Hari, as a result of my offenses incurred in previous lifetimes, my heart
has become hard as a thunderbolt, and feels no change upon chanting Your holy
name. Now in utter hopelessness, O Lord Hari, I loudly sing Your name, and in
great distress I call out to You again and again.
2) O
Lord who is compassionate towards the fallen souls! O origin of all mercy!
Please give to me a drop of divine ecstasy and thereby save my life!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'দীন দয়াময় করুনা-নিদান
ভাব-বিন্ধু দেই রাখহ পরান', E'দীন দয়াময় করুনা-নিদান
ভাব-বিন্ধু দেই রাখহ পরান',
    E'aparādha-phale
mama, citta bhelo vajra-sama,
tuwā
nāme nā labhe vikār
hatāś
hoiye, hari, tava nām ucca kori'',
boro
duḥkhe ḍāki bār bār', E'апара̄дга-пхале
мама, чітта бгело ваджра-сама,
тува̄
на̄ме на̄ лабге віка̄р
хата̄ш́
хоійе, харі, тава на̄м учча корі'',
боро
дух̣кхе д̣а̄кі ба̄р ба̄р',
    E'', E'',
    E'When will an incessant stream of tears flow dripping and dripping from my eyes
at the articulation of Your holy name?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'কবে তুয়া নাম-উচ্চরণে মোর
নয়নে ঝরব দর দর লোর', E'কবে তুয়া নাম-উচ্চরণে মোর
নয়নে ঝরব দর দর লোর',
    E'dīna
doyāmoy karunā-nidān
bhāva-bindhu
dei rākhoha parān', E'дı̄на
дойа̄мой каруна̄-ніда̄н
бга̄ва-біндгу
деі ра̄кхоха пара̄н',
    E'', E'',
    E'When will a faltering voice choked with emotion arise in my throat, and when
will words garbled due to ecstasy come from my mouth?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'গদ-গদ-স্বর কন্ঠে উপজব
মুখে বল আধ আধ বাহিরাব', E'গদ-গদ-স্বর কন্ঠে উপজব
মুখে বল আধ আধ বাহিরাব',
    E'kabe
tuwā nāma-uccaraṇe mor
nayane
jharabo dara dara lor', E'кабе
тува̄ на̄ма-уччаран̣е мор
найане
джхарабо дара дара лор',
    E'', E'',
    E'When will my body be filled with ecstatic rapture, and when will there be
perspiration, trembling, and a stunned sensation again and again?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'পুলকে ভরব শরীর হামার
স্বেদ-কম্প-স্তম্ভ হবে বার বার', E'পুলকে ভরব শরীর হামার
স্বেদ-কম্প-স্তম্ভ হবে বার বার',
    E'gad-gada-swara
kanṭhe upajabo
mukhe
bola ādha ādha bāhirābo', E'ґад-ґада-свара
кант̣хе упаджабо
мукхе
бола а̄дга а̄дга ба̄хіра̄бо',
    E'', E'',
    E'When, out of divine ecstasy, will all consciousness be lost in my pale and
discolored body? And when will I hold onto my very life under the shelter of
Your holy name?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'বিবর্ন-শরীরে হারাওবুঁ জ্ঞান
নাম-সমাশ্রয়ে ধরবুঁ পরান', E'বিবর্ন-শরীরে হারাওবুঁ জ্ঞান
নাম-সমাশ্রয়ে ধরবুঁ পরান',
    E'pulake
bharabo śarīra hāmāra
sweda-kampa-stambha
habe bāra bāra', E'пулаке
бгарабо ш́арı̄ра ха̄ма̄ра
сведа-кампа-стамбга
хабе ба̄ра ба̄ра',
    E'', E'',
    E'This weeping Bhaktivinoda, who is devoid of all good intelligence, sobs,
"O Lord, how will such a day ever be mine?"
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'মিলব হামার কিয়ে ঐছে দিন
রওয়ে ভক্তিবিনোদ মতি হীন', E'মিলব হামার কিয়ে ঐছে দিন
রওয়ে ভক্তিবিনোদ মতি হীন',
    E'vivarna-śarīre
hārāobuń jñāna
nāma-samāśraye
dharobuń parān', E'віварна-ш́арı̄ре
ха̄ра̄обуń джн̃а̄на
на̄ма-сама̄ш́райе
дгаробуń пара̄н',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'', E'',
    E'milabo
hāmāra kiye aiche din
ro-owe
bhaktivinoda mati hīn', E'мілабо
ха̄ма̄ра кійе аічхе дін
ро-ове
бгактівінода маті хı̄н',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 14, Song 7: Gaite Gaite Nama Ki Dasa
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 14;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Gaite Gaite Nama Ki Dasa', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'গাইতে গাইতে নাম কি দশা হ‌ইল
কৃষ্ণ-নিত্য-দাস মুই'' হৃদয়ে স্ফুরিল', E'গাইতে গাইতে নাম কি দশা হ‌ইল
কৃষ্ণ-নিত্য-দাস মুই'' হৃদয়ে স্ফুরিল',
    E'Song
Name: Gaite Gaite Nama Ki Dasa
Official
Name: Sri Siksastaka Song 7
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Ґаіте Ґаіте Нама Кі Даса
Оffічіал
Наме: Срі Сіксастака Сонґ 7
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'What was my condition after repeatedly chanting the holy name? The realization
that "I am the eternal servant of Krsna" spontaneously became
manifest within my heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'জানিলাম মায়া-পাশে এ জড়-জগতে
গোবিন্দ-বিরহে দুঃখ পাই নানা-মতে', E'জানিলাম মায়া-পাশে এ জড়-জগতে
গোবিন্দ-বিরহে দুঃখ পাই নানা-মতে',
    E'gāite
gāite nāma ki daśā hoilo
`kṛṣṇa-nitya-dāsa
mui'' hṛdoye sphurilo', E'ґа̄іте
ґа̄іте на̄ма кі даш́а̄ хоіло
`кр̣шн̣а-нітйа-да̄са
муі'' хр̣дойе спхуріло',
    E'', E'',
    E'I realized that I was ensnared in the noose of maya''s illusion, being trapped
within this dull mundane universe, and that I simply experience misery in
various ways due to separation from Lord Govinda.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'আর যে সংসার মোর নাহি লাগে ভাল
কাহা যাই'' কৃষ্ণ হেরি-এ চিন্তা বিশাল', E'আর যে সংসার মোর নাহি লাগে ভাল
কাহা যাই'' কৃষ্ণ হেরি-এ চিন্তা বিশাল',
    E'jānilām
māyā-pāśe e jaḍa-jagate
govinda-virahe
duḥkha pāi nānā-mate', E'джа̄ніла̄м
ма̄йа̄-па̄ш́е е джад̣а-джаґате
ґовінда-вірахе
дух̣кха па̄і на̄на̄-мате',
    E'', E'',
    E'Furthermore, I realized that I do not like this worldly existence. "Where
can I go to see Krsna?"-this was my great anxiety.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'কাঁদিতে কাঁদিতে মোর আঁখি-বরিশয়
বর্ষা-ধারা হেন চক্ষে হ‍ইল উদয়', E'কাঁদিতে কাঁদিতে মোর আঁখি-বরিশয়
বর্ষা-ধারা হেন চক্ষে হ‍ইল উদয়',
    E'ār
je saḿsāra mor nāhi lāge bhālo
kāhā
jāi'' kṛṣṇa herie cintā viśālo', E'а̄р
дже саḿса̄ра мор на̄хі ла̄ґе бга̄ло
ка̄ха̄
джа̄і'' кр̣шн̣а херіе чінта̄ віш́а̄ло',
    E'', E'',
    E'Crying and crying, tears poured from my eyes, appearing just like torrents of
rain in the monsoon season.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'নিমেষে হ‍ইল মোর শত-যুগ-সম
গোবিন্দ-বিরহ আর সহিতে অক্ষম', E'নিমেষে হ‍ইল মোর শত-যুগ-সম
গোবিন্দ-বিরহ আর সহিতে অক্ষম',
    E'kāńdite
kāńdite mor āńkhi-variśoy
varṣā-dhārā
heno cakṣe hoilo udoy', E'ка̄ńдіте
ка̄ńдіте мор а̄ńкхі-варіш́ой
варша̄-дга̄ра̄
хено чакше хоіло удой',
    E'', E'',
    E'Unable to bear separation from Lord Govinda any longer, for me the passing of a
moment became like a hundred long ages.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'শূন্য ধরা-তল, চৌদিকে দেখিয়ে,
পরান উদাস হয়
কি করি, কি করি, স্থির নাহি হয়,
জীবন নাহিক রয়', E'শূন্য ধরা-তল, চৌদিকে দেখিয়ে,
পরান উদাস হয়
কি করি, কি করি, স্থির নাহি হয়,
জীবন নাহিক রয়',
    E'nimeṣe
hoilo mora śata-yuga-sam
govinda-viraha
ār sahite akṣam', E'німеше
хоіло мора ш́ата-йуґа-сам
ґовінда-віраха
а̄р сахіте акшам',
    E'', E'',
    E'As I look about in all directions, the surface of the earth appears to be void,
and my very life-breath feels empty. What am I doing? What am I doing? I do not
feel at all tranquil, and the life within my body is slipping away.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'ব্রজ-বাসী-গণ, মোর প্রান রাখ,
দেখাও শ্রী-রাধা-নাথে
ভকতিবিনোদ, মিনতি মানিয়া,
লওহে তাঁহারে সাথে', E'ব্রজ-বাসী-গণ, মোর প্রান রাখ,
দেখাও শ্রী-রাধা-নাথে
ভকতিবিনোদ, মিনতি মানিয়া,
লওহে তাঁহারে সাথে',
    E'śūnya
dharā-tala, caudike dekhiye,
parāna
udāsa hoy
ki
kori, ki kori, sthira nāhi hoy,
jīvana
nāhiko roy', E'ш́ӯнйа
дгара̄-тала, чаудіке декхійе,
пара̄на
уда̄са хой
кі
корі, кі корі, стхіра на̄хі хой,
джı̄вана
на̄хіко рой',
    E'', E'',
    E'O residents of Vraja-dhama! Please save my life and show me the Lord of Sri
Radha! Oh, please consider the prayers of this Bhaktivinoda and take him into
His company!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'শ্রী-কৃষ্ণ-বিরহ আর সহিতে না পারি
পরান ছাড়িতে আর দিন দুই চারি', E'শ্রী-কৃষ্ণ-বিরহ আর সহিতে না পারি
পরান ছাড়িতে আর দিন দুই চারি',
    E'braja-bāsī-gaṇ,
mora prāna rākho,
dekhāo
śrī-rādhā-nāthe
bhakativinoda,
minati māniyā,
laohe
tāhāre sāthe', E'браджа-ба̄сı̄-ґан̣,
мора пра̄на ра̄кхо,
декха̄о
ш́рı̄-ра̄дга̄-на̄тхе
бгакатівінода,
мінаті ма̄нійа̄,
лаохе
та̄ха̄ре са̄тхе',
    E'', E'',
    E'I am unable to further tolerate this separation from my Lord Sri Krsna and am
ready to give up my life in two days or four.
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9', 9,
    E'', E'',
    E'śrī-kṛṣṇa-viraha
ār sahite nā pāri
parān
chāḍite ār din dui cāri', E'ш́рı̄-кр̣шн̣а-віраха
а̄р сахіте на̄ па̄рі
пара̄н
чха̄д̣іте а̄р дін дуі ча̄рі',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 14, Song 8: Bandhu Gan Suno Ha
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 14;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Bandhu Gan Suno Ha', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 8;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'বন্ধু-গণ! শুনহ বচন মোর
ভাবেতে বিভোর, থাকিয়ে যখন,
দেখা দেয় চিত্ত-চোর', E'বন্ধু-গণ! শুনহ বচন মোর
ভাবেতে বিভোর, থাকিয়ে যখন,
দেখা দেয় চিত্ত-চোর',
    E'Song
Name: Bandhu Gan Sunoha Vacana
Official
Name: Sri Siksastaka Song 8
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Бандгу Ґан Суноха Вачана
Оffічіал
Наме: Срі Сіксастака Сонґ 8
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
my dear friends! Please hear my words. When the thief of my heart appears to
me, I remain overwhelmed in pure ecstasy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'বিচক্ষন করি'', দেখিতে চাহিলে,
হয় আঁখি-অগোচর
পুনঃ নাহি দেখি'', কাঁদয়ে পরাণ,
দুঃখের নাহি থাকে ওর', E'বিচক্ষন করি'', দেখিতে চাহিলে,
হয় আঁখি-অগোচর
পুনঃ নাহি দেখি'', কাঁদয়ে পরাণ,
দুঃখের নাহি থাকে ওর',
    E'bandhu-gaṇ!
śunoha vacana mor
bhāvete
vibhora, thākiye jakhon,
dekhā
deya citta-cor', E'бандгу-ґан̣!
ш́уноха вачана мор
бга̄вете
вібгора, тха̄кійе джакхон,
декха̄
дейа чітта-чор',
    E'', E'',
    E'When I scheme to see Him more closely, He suddenly becomes invisible. Thus
losing sight of Him again, my soul weeps, and there is no limit to the
unhappiness that I feel.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'জগতের বন্ধু সেই কভু মোরে লয় সাথ
যথা তথা রখু মোরে আমার সেই প্রাণ-নাথ', E'জগতের বন্ধু সেই কভু মোরে লয় সাথ
যথা তথা রখু মোরে আমার সেই প্রাণ-নাথ',
    E'vicakṣana
kori'', dekhite cāhile,
hoy
āńkhi-agocara
punaḥ
nāhi dekhi'', kāńdaye parāṇ,
duḥkhera
nāhi thāke or', E'вічакшана
корі'', декхіте ча̄хіле,
хой
а̄ńкхі-аґочара
пунах̣
на̄хі декхі'', ка̄ńдайе пара̄н̣,
дух̣кхера
на̄хі тха̄ке ор',
    E'', E'',
    E'Sometimes that friend of the universe takes me as one of His associates; but
however He chooses to treat me, He is still the Lord of my life.
4) By
bestowing His blissful audience, He gives happiness to my soul, and He speaks
words of love to me. But again by His absence He burns my heart, and He who is
the treasure of my life gives distress to my soul.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'দর্শন-আনন্দ-দানে, সুখ দেয় মোর প্রাণে,
বলে মোরে প্রনয়-বচন
পুনঃ অদর্শন দিয়া, দগ্ধ করে মোর হিয়া,
প্রাণে মোর মারে প্রাণ-ধন', E'দর্শন-আনন্দ-দানে, সুখ দেয় মোর প্রাণে,
বলে মোরে প্রনয়-বচন
পুনঃ অদর্শন দিয়া, দগ্ধ করে মোর হিয়া,
প্রাণে মোর মারে প্রাণ-ধন',
    E'jagatera
bandhu sei kabhu more loy sātha
jathā
tathā rakhu more āmāra sei prāṇa-nātha', E'джаґатера
бандгу сеі кабгу море лой са̄тха
джатха̄
татха̄ ракху море а̄ма̄ра сеі пра̄н̣а-на̄тха',
    E'', E'',
    E'Whatever His happiness is, that is also my happiness. Therefore I do not care
about my own happiness or distress-they are equal in all ways.
6) In
meeting or in separation, Bhaktivinoda knows only Krsna to be the Lord of his
life and is made happy only by His happiness. He is the Lord of Bhaktivinoda''s
soul, and He will never be looked upon with indifference.
Remarks/ Extra Information:
No
Extra Information available for this song!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'যাহে তা''র সুখ হয়, সেই সুখ মম
নিজ সুখে-দুঃখে মোর সর্বদা-ই সম', E'যাহে তা''র সুখ হয়, সেই সুখ মম
নিজ সুখে-দুঃখে মোর সর্বদা-ই সম',
    E'darśana-ānanda-dāne,
sukha deya mora prāṇe,
bole
more pranaya-vacan
punaḥ
adarśana diyā, dagdha kore mora hiyā,
prāṇe
mora māre prāṇa-dhan', E'дарш́ана-а̄нанда-да̄не,
сукха дейа мора пра̄н̣е,
боле
море пранайа-вачан
пунах̣
адарш́ана дійа̄, даґдга коре мора хійа̄,
пра̄н̣е
мора ма̄ре пра̄н̣а-дган',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'ভকতিবিনোদ, সংযোগে, বিযোগে,
তাহে জানে প্রাণেশ্বর
তা''র সুখে সুখী, সেই প্রাণ-নাথ,
সে কভু না হয় পর', E'ভকতিবিনোদ, সংযোগে, বিযোগে,
তাহে জানে প্রাণেশ্বর
তা''র সুখে সুখী, সেই প্রাণ-নাথ,
সে কভু না হয় পর',
    E'jāhe
tā''r sukha hoy, sei sukha mama
nija
sukhe-duḥkhe mor sarvadā-i sama', E'джа̄хе
та̄''р сукха хой, сеі сукха мама
ніджа
сукхе-дух̣кхе мор сарвада̄-і сама',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'', E'',
    E'bhakativinoda,
saḿyoge, viyoge,
tāhe
jāne prāṇeśvara
tā''ra
sukhe sukhī, sei prāṇa-nāth,
se
kabhu nā hoy para', E'бгакатівінода,
саḿйоґе, війоґе,
та̄хе
джа̄не пра̄н̣еш́вара
та̄''ра
сукхе сукхı̄, сеі пра̄н̣а-на̄тх,
се
кабгу на̄ хой пара',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 15, Song 1: Yoga Pith Opari
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 15;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Yoga Pith Opari', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1', 1,
    E'যোগ-পীঠোপরি-স্থিত, অষ্ট-সখী-সুবেষ্টিত,
বৃন্দারণ্যে কদম্ব-কাননে
রাধা-সহ বংশী-ধারী, বিশ্ব-জন-চিত্ত-হারী,
প্রাণ মোর তাঁহার চরণে', E'যোগ-পীঠোপরি-স্থিত, অষ্ট-সখী-সুবেষ্টিত,
বৃন্দারণ্যে কদম্ব-কাননে
রাধা-সহ বংশী-ধারী, বিশ্ব-জন-চিত্ত-হারী,
প্রাণ মোর তাঁহার চরণে',
    E'Song
Name: Yoga Pithopari Sthita
Official
Name: Siksastakam Song 8 Part 2
Author:
Bhaktivinoda
Thakura
Book
Name: Gitavali
Language:
Bengali
অ', E'Сонґ
Наме: Йоґа Пітхопарі Стхіта
Оffічіал
Наме: Сіксастакам Сонґ 8 Парт 2
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Ґітавалі
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Situated upon the Yoga-Pitha surrounded by the eight chief gopis in a kadamba
tree grove within Vrndavana with His beloved Radha is the holder of the flute
the stealer of the hearts of all living beings in the universe-I lay down my
life at Their lotus feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2', 2,
    E'সখী-আজ্ঞা-মত করি দোঁহার সেবন
পাল্য-দাসী সদা ভাবি দোঁহার চরণ', E'সখী-আজ্ঞা-মত করি দোঁহার সেবন
পাল্য-দাসী সদা ভাবি দোঁহার চরণ',
    E'yoga-pīṭhopari-sthita,
aṣṭa-sakhī-suveṣṭita,
bṛndāraṇye
kadamba-kānane
rādhā-saha
vaḿśī-dhārī, viśva-jana-citta-hārī,
prāṇa
mor tāńhāra caraṇe', E'йоґа-пı̄т̣хопарі-стхіта,
ашт̣а-сакхı̄-сувешт̣іта,
бр̣нда̄ран̣йе
кадамба-ка̄нане
ра̄дга̄-саха
ваḿш́ı̄-дга̄рı̄, віш́ва-джана-чітта-ха̄рı̄,
пра̄н̣а
мор та̄ńха̄ра чаран̣е',
    E'', E'',
    E'According to the directions of my superior sakhi, I render service to the
Divine Couple. I always consider myself a dependent maidservant of the lotus
feet of the Divine Couple.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3', 3,
    E'কভু কৃপা করি, মম হস্ত ধরি'',
মধুর বচন বলে
তাম্বূল ল‌ইয়া, খায় দুই জনে,
মালা লয় কুতূহলে', E'কভু কৃপা করি, মম হস্ত ধরি'',
মধুর বচন বলে
তাম্বূল ল‌ইয়া, খায় দুই জনে,
মালা লয় কুতূহলে',
    E'sakhī-ājñā-mata
kori dońhāra sevan
pālya-dāsī
sadā bhāvi dońhāra caraṇ', E'сакхı̄-а̄джн̃а̄-мата
корі доńха̄ра севан
па̄лйа-да̄сı̄
сада̄ бга̄ві доńха̄ра чаран̣',
    E'', E'',
    E'Sometimes, out of great mercy, my sakhi holds my hand and speaks sweet words to
me. Taking the betel nuts I have prepared she offers them to those two persons
and accepts flower garlands for Them in great delight.
4) By
some deception They periodically disappear from my sight. Not seeing the Divine
Couple of Vraja, my heart burns in agony.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4', 4,
    E'অদর্শন হয় কখন কি ছলে
না দেখিয়া দোঁহে হিয়া জ্বলে', E'অদর্শন হয় কখন কি ছলে
না দেখিয়া দোঁহে হিয়া জ্বলে',
    E'kabhu
kṛpā kori, mama hasta dhori'',
madhura
vacana bole
tāmbūla
loiyā, khāy dui jane,
mālā
loya kutūhale', E'кабгу
кр̣па̄ корі, мама хаста дгорі'',
мадгура
вачана боле
та̄мбӯла
лоійа̄, кха̄й дуі джане,
ма̄ла̄
лойа кутӯхале',
    E'', E'',
    E'Wherever those two may be I am certainly a humble maidservant of Their lotus
feet. I consider the ecstasies of meeting Them and the agonies of separation
from Them to be exactly the same.
6) In
life or death, Radha and Krsna are my life and soul. May They always be happy,
whether They choose to protect me or kill me.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5', 5,
    E'যেখানে সেখানে, থাকুক দু''জনে,
আমি ত'' চরণ-দাসী
মিলনে আনন্দ, বিরহে যাতনা,
সকল সমান বাসি', E'যেখানে সেখানে, থাকুক দু''জনে,
আমি ত'' চরণ-দাসী
মিলনে আনন্দ, বিরহে যাতনা,
সকল সমান বাসি',
    E'adarśana
hoy kakhon ki chale
nā
dekhiyā dońhe hiyā jwale', E'адарш́ана
хой какхон кі чхале
на̄
декхійа̄ доńхе хійа̄ джвале',
    E'', E'',
    E'This Bhaktivinoda knows nothing beyond this. Falling down at the lotus feet of
the sakhi whom he serves and always remaining among the associates of Sri
Radhika he prays for the lotus feet of the Divine Couple of Vraja.
Thus
ends Gitavali by Srila Saccidananda Bhaktivinoda Thakura
Ending
Prema-Dhvani
nṛtya-gīta-samāpti-kāle
jaya
śrī godruma-candra gorā-cāńda kī jaya
jaya
prema-dātā śrī nityānanda kī jaya!
jaya
śrī śāntipura-nātha kī jaya!
jaya
śrī gadādhara paṇḍita goswāmī kī
jaya!
jaya
śrī śrīvāsādi bhakta-vṛnda kī jaya!
jaya
śrī navadvīpa-dhāma kī jaya!
jaya
śrī nāma-haṭṭa kī jaya!
jaya
śrī śrotṛ-varga kī jaya!
śrī
śrī nām haṭṭera parimārjjaka
jhāḍudār
dīna-hīna
śrī kedāranāth bhaktivinoda
When
the dancing and chanting is concluded:
All
glories to the moon of Godruma, Gauracanda!
All
glories to the giver of divine love, Sri Nityananda!
All
glories to the Lord of Santipura!
All
glories to Sri Gadadhara Pandita Gosvami!
All
glories to Srivasa Pandita and the assembly of devotees!
All
glories to the divine abode of Navadvipa!
All
glories to the Marketplace of the Holy Name!
All
glories to the listeners of the Holy Name!
Signed,
the cleaner and sweeper of the Marketplace of the Holy Name, the lowly and
destitute Sri Kedaranath Bhaktivinoda.
REMARKS/EXTRA
INFORMATION:
This
is the final song of the Gitavali.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6', 6,
    E'রাধা-কৃষ্ণ প্রাণ মোর জীবনে মরণে
মোরে রাখি'' মারি'' সুখে থাকুক দু''জনে', E'রাধা-কৃষ্ণ প্রাণ মোর জীবনে মরণে
মোরে রাখি'' মারি'' সুখে থাকুক দু''জনে',
    E'jekhāne
sekhāne, thākuka du''jane,
āmi
to'' caraṇa-dāsī
milane
ānanda, virahe jātanā,
sakala
samāna bāsi', E'джекха̄не
секха̄не, тха̄кука ду''джане,
а̄мі
то'' чаран̣а-да̄сı̄
мілане
а̄нанда, вірахе джа̄тана̄,
сакала
сама̄на ба̄сі',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7', 7,
    E'ভকতিবিনোদ, আন নাহি জানে,
পড়ি'' নিজ-সখী-পায়
রাধিকার গণে, থাকিয়া সতত,
যুগল-চরণ চায়
নৃত্য-গীত-সমাপ্তি-কালে
জয় শ্রী গোদ্রুম-চন্দ্র গোরা-চাঁদ কী জয়
জয় প্রেম-দাতা শ্রী নিত্যানন্দ কী জয়!
জয় শ্রী শান্তিপুর-নাথ কী জয়!
জয় শ্রী গদাধর পণ্ডিত গোস্বামী কী জয়!
জয় শ্রী শ্রীবাসাদি ভক্ত-বৃন্দ কী জয়!
জয় শ্রী নবদ্বীপ-ধাম কী জয়!
জয় শ্রী নাম-হট্ট কী জয়!
জয় শ্রী শ্রোতৃ-বর্গ কী জয়!
শ্রী শ্রী নাম হট্টের পরিমার্জ্জক ঝাড়ুদার
দীন-হীন শ্রী কেদারনাথ ভক্তিবিনোদ', E'ভকতিবিনোদ, আন নাহি জানে,
পড়ি'' নিজ-সখী-পায়
রাধিকার গণে, থাকিয়া সতত,
যুগল-চরণ চায়
নৃত্য-গীত-সমাপ্তি-কালে
জয় শ্রী গোদ্রুম-চন্দ্র গোরা-চাঁদ কী জয়
জয় প্রেম-দাতা শ্রী নিত্যানন্দ কী জয়!
জয় শ্রী শান্তিপুর-নাথ কী জয়!
জয় শ্রী গদাধর পণ্ডিত গোস্বামী কী জয়!
জয় শ্রী শ্রীবাসাদি ভক্ত-বৃন্দ কী জয়!
জয় শ্রী নবদ্বীপ-ধাম কী জয়!
জয় শ্রী নাম-হট্ট কী জয়!
জয় শ্রী শ্রোতৃ-বর্গ কী জয়!
শ্রী শ্রী নাম হট্টের পরিমার্জ্জক ঝাড়ুদার
দীন-হীন শ্রী কেদারনাথ ভক্তিবিনোদ',
    E'rādhā-kṛṣṇa
prāṇa mor jīvane maraṇe
more
rākhi'' māri'' sukhe thākuka du''jane', E'ра̄дга̄-кр̣шн̣а
пра̄н̣а мор джı̄ване маран̣е
море
ра̄кхі'' ма̄рі'' сукхе тха̄кука ду''джане',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8', 8,
    E'', E'',
    E'bhakativinoda,
āna nāhi jāne,
poḍi''
nija-sakhī-pāy
rādhikāra
gaṇe, thākiyā satata,
yugala-caraṇa
cāy', E'бгакатівінода,
а̄на на̄хі джа̄не,
под̣і''
ніджа-сакхı̄-па̄й
ра̄дгіка̄ра
ґан̣е, тха̄кійа̄ сатата,
йуґала-чаран̣а
ча̄й',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


END $$;

COMMIT;
