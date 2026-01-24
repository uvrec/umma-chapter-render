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




END $$;

COMMIT;
