-- Import Saranagati by Bhaktivinoda Thakura
-- Proper structure: books -> cantos -> chapters -> verses
-- Fields: sanskrit_en/ua, transliteration_en/ua, synonyms_en/ua, translation_en/ua, commentary_en/ua

BEGIN;

-- 1. Create/update the book
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos)
VALUES ('saranagati', 'Saranagati', 'Шаранаґаті', true, true)
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
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'saranagati';


  -- Canto 1: Introduction
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 1, E'Introduction', E'Вступ', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 2: Humility
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 2, E'Humility', E'Дайн''я (Смирення)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 3: Self-Surrender
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 3, E'Self-Surrender', E'Атма-нівéдана (Самовіддача)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 4: Embracing the Lord''s Guardianship
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 4, E'Embracing the Lord''s Guardianship', E'Ґоптрітве варана (Прийняття опіки Господа)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 5: Maintaining Faith that Krsna Will Surely Protect
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 5, E'Maintaining Faith that Krsna Will Surely Protect', E'Авашья ракшібе Крішна вішваса палана (Віра в захист Крішни)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 6: Acceptance Only of Activities Favorable to Devotion
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 6, E'Acceptance Only of Activities Favorable to Devotion', E'Бгакті-анукула матра кар''єра свікара (Сприятливе для відданості)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 7: Rejection of Activities Unfavorable to Devotion
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 7, E'Rejection of Activities Unfavorable to Devotion', E'Бгакті-пратікула бгава варджанаңґікара (Несприятливе для відданості)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 8: Longing for Devotional Service
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 8, E'Longing for Devotional Service', E'Бгаджана-лаласа (Прагнення до служіння)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 9: Longing for Spiritual Perfection
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 9, E'Longing for Spiritual Perfection', E'Сіддгі-лаласа (Прагнення до досконалості)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 10: Heartfelt Prayer
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 10, E'Heartfelt Prayer', E'Віджняпті (Молитва від серця)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 11: The Glories of the Holy Name
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 11, E'The Glories of the Holy Name', E'Шрі-нама-махатмья (Слава Святого Імені)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Section 1, Song 1: Sri Krsna Caitanya Prabhu Jive Doya Kori
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Sri Krsna Caitanya Prabhu Jive Doya Kori', E'', 'verses', true)
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
    E'শ্রী-কৃষ্ণ-চৈতন্য প্রভু জীবে দয়া করি''
স্ব-পার্ষদ স্বীয় ধাম সহ অবতরি''', E'শ্রী-কৃষ্ণ-চৈতন্য প্রভু জীবে দয়া করি''
স্ব-পার্ষদ স্বীয় ধাম সহ অবতরি''',
    E'śrī-kṛṣṇa-caitanya
prabhu jīve doyā kori''
swa-pārṣada
swīya dhāma saha avatari''', E'ш́рı̄-кр̣шн̣а-чаітанйа
прабгу джı̄ве дойа̄ корі''
сва-па̄ршада
свı̄йа дга̄ма саха аватарі''',
    E'', E'',
    E'Out of compassion for the fallen souls, Sri Krisna Caitanya came to this world
with His personal associates and divine abode to teach saranagati (the goal of
surrender), surrender to the almighty Godhead, and to freely distribute
ecstatic love of God, which is ordinarily very difficult to obtain. This
saranagati is the very life of the true devotee
3-', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'অত্যন্ত দুর্লভ প্রেম করিবারে দান
শিখায় শরণাগতি ভকতের প্রান', E'অত্যন্ত দুর্লভ প্রেম করিবারে দান
শিখায় শরণাগতি ভকতের প্রান',
    E'atyanta
durlabha prema koribāre dāna
śikhāya
śaraṇāgati bhakatera prāna', E'атйанта
дурлабга према коріба̄ре да̄на
ш́ікха̄йа
ш́аран̣а̄ґаті бгакатера пра̄на',
    E'', E'',
    E'The ways of saranagati are humility, dedication of the self, acceptance of the
Lord as one''s only maintainer, faith that Krishna will surely protect,
execution of only those acts favorable to pure devotion, and renunciation of
conduct adverse to pure devotion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'দৈন্য, আত্ম-নিবেদন, গোপ্তৃত্বে বরণ
''অবশ্য রক্ষীবে কৃষ্ণ''-বিশ্বাস, পালন', E'দৈন্য, আত্ম-নিবেদন, গোপ্তৃত্বে বরণ
''অবশ্য রক্ষীবে কৃষ্ণ''-বিশ্বাস, পালন',
    E'dainya,
ātma-nivedana, goptṛtve varaṇa
avaśya
rakṣībe kṛṣṇa''viśvāsa, pālana', E'даінйа,
а̄тма-ніведана, ґоптр̣тве варан̣а
аваш́йа
ракшı̄бе кр̣шн̣а''віш́ва̄са, па̄лана',
    E'', E'',
    E'The
youthful son of Nanda Maharaja, Sri Krishna, hears the prayers of anyone who
takes refuge in Him by this six-fold practice.
6-', E'',
    E'', E'У своєму поясненні до **«Чайтанья-чарітамріта»**, Мадг''я-ліла 20.135, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Відданий не буде покладатися на свої матеріальні ресурси, а на милість Верховного Бога-Особи, який може дати справжній захист. Це називається *ракшішьяті ті вішвасах*, або "*авашья ракшібе крішна*"—*вішваса палана*».
Під час лекції зі **«Шрімад-Бгаґаватам»** 6.3.16-17 (Ґоракхпур, 10 лютого 1971 року), Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Віддатися означає просто приймати сприятливе служіння Крішні та відкидати все, що несприятливе, а далі йде *авашья ракшібе крішна вішваса-палана*: "І бути твердо переконаним, що Крішна дасть мені весь захист"».',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'ভকি-অনুকূল-মাত্র কার্যের স্বীকর
ভক্তি-প্রতিকূল-ভাব বর্জনাঙ্গিকার', E'ভকি-অনুকূল-মাত্র কার্যের স্বীকর
ভক্তি-প্রতিকূল-ভাব বর্জনাঙ্গিকার',
    E'bhaki-anukūla-mātra
kāryera svīkara
bhakti-pratikūla-bhāva
varjanāńgikāra', E'бгакі-анукӯла-ма̄тра
ка̄рйера свı̄кара
бгакті-пратікӯла-бга̄ва
варджана̄ńґіка̄ра',
    E'', E'',
    E'Bhaktivinoda
places a straw between his teeth, prostrates himself before the two Goswamis,
Sri Rupa and Sri Sanatana, and clasps their lotus feet with his hands. I am
certainly the lowest of men. he tells them weeping, but please make me the
best of men by teaching me the ways of saranagati', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'ষড-অঙ্গ শরণাগতি হৈবে যাহার
তাহার প্রার্থনা শুনে শ্রী-নন্দ-কুমার', E'ষড-অঙ্গ শরণাগতি হৈবে যাহার
তাহার প্রার্থনা শুনে শ্রী-নন্দ-কুমার',
    E'ṣaḍ-ańga
śaraṇāgati hoibe jāhāra
tāhāra
prārthanā śune śrī-nanda-kumāra', E'шад̣-аńґа
ш́аран̣а̄ґаті хоібе джа̄ха̄ра
та̄ха̄ра
пра̄ртхана̄ ш́уне ш́рı̄-нанда-кума̄ра',
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
    E'রূপ-সনাতন-পদে দন্তে তৃণ করি''
ভকতিবিনোদ পড়ে দুহুঁ পদ ধরি''', E'রূপ-সনাতন-পদে দন্তে তৃণ করি''
ভকতিবিনোদ পড়ে দুহুঁ পদ ধরি''',
    E'rūpa-sanātana-pade
dante tṛṇa kori''
bhakativinoda
poḍe duhuń pada dhori''', E'рӯпа-сана̄тана-паде
данте тр̣н̣а корі''
бгакатівінода
под̣е духуń пада дгорі''',
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
    E'কাঁদিয়া কাঁদিয়া বলে আমি তো'' অধম
শিখায়ে শরণাগতি কর হে উত্তম', E'কাঁদিয়া কাঁদিয়া বলে আমি তো'' অধম
শিখায়ে শরণাগতি কর হে উত্তম',
    E'kāńdiyā
kāńdiyā bole āmi to'' adhama
śikhāye
śaraṇāgati koro he uttama', E'ка̄ńдійа̄
ка̄ńдійа̄ боле а̄мі то'' адгама
ш́ікха̄йе
ш́аран̣а̄ґаті коро хе уттама',
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
