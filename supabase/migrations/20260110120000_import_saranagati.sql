-- Import Saranagati by Bhaktivinoda Thakura
-- Proper structure: books -> cantos -> chapters -> verses
-- Fields: sanskrit_en/uk, transliteration_en/uk, synonyms_en/uk, translation_en/uk, commentary_en/uk

BEGIN;

-- 0. Ensure partial unique index exists for chapter upserts (canto-based chapters only)
DROP INDEX IF EXISTS public.chapters_canto_chapter_unique;
ALTER TABLE public.chapters DROP CONSTRAINT IF EXISTS ux_chapters_canto_chno;
DROP INDEX IF EXISTS public.ux_chapters_canto_chno;
CREATE UNIQUE INDEX IF NOT EXISTS ux_chapters_canto_chno
  ON public.chapters (canto_id, chapter_number)
  WHERE canto_id IS NOT NULL;

-- 1. Create/update the book
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos)
VALUES ('saranagati', 'Saranagati', 'Шаранаґаті', true, true)
ON CONFLICT (slug) DO UPDATE SET
  title_uk = EXCLUDED.title_uk,
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
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_uk, is_published)
  VALUES (v_book_id, 1, E'Introduction', E'Вступ', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk;


  -- Canto 2: Humility
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_uk, is_published)
  VALUES (v_book_id, 2, E'Humility', E'Дайн''я (Смирення)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk;


  -- Canto 3: Self-Surrender
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_uk, is_published)
  VALUES (v_book_id, 3, E'Self-Surrender', E'Атма-нівéдана (Самовіддача)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk;


  -- Canto 4: Embracing the Lord''s Guardianship
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_uk, is_published)
  VALUES (v_book_id, 4, E'Embracing the Lord''s Guardianship', E'Ґоптрітве варана (Прийняття опіки Господа)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk;


  -- Canto 5: Maintaining Faith that Krsna Will Surely Protect
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_uk, is_published)
  VALUES (v_book_id, 5, E'Maintaining Faith that Krsna Will Surely Protect', E'Авашья ракшібе Крішна вішваса палана (Віра в захист Крішни)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk;


  -- Canto 6: Acceptance Only of Activities Favorable to Devotion
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_uk, is_published)
  VALUES (v_book_id, 6, E'Acceptance Only of Activities Favorable to Devotion', E'Бгакті-анукула матра кар''єра свікара (Сприятливе для відданості)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk;


  -- Canto 7: Rejection of Activities Unfavorable to Devotion
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_uk, is_published)
  VALUES (v_book_id, 7, E'Rejection of Activities Unfavorable to Devotion', E'Бгакті-пратікула бгава варджанаңґікара (Несприятливе для відданості)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk;


  -- Canto 8: Longing for Devotional Service
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_uk, is_published)
  VALUES (v_book_id, 8, E'Longing for Devotional Service', E'Бгаджана-лаласа (Прагнення до служіння)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk;


  -- Canto 9: Longing for Spiritual Perfection
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_uk, is_published)
  VALUES (v_book_id, 9, E'Longing for Spiritual Perfection', E'Сіддгі-лаласа (Прагнення до досконалості)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk;


  -- Canto 10: Heartfelt Prayer
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_uk, is_published)
  VALUES (v_book_id, 10, E'Heartfelt Prayer', E'Віджняпті (Молитва від серця)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk;


  -- Canto 11: The Glories of the Holy Name
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_uk, is_published)
  VALUES (v_book_id, 11, E'The Glories of the Holy Name', E'Шрі-нама-махатмья (Слава Святого Імені)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk;


  -- Section 1, Song 1: Sri Krsna Caitanya Prabhu Jive Doya Kori
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Sri Krsna Caitanya Prabhu Jive Doya Kori', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'শ্রী-কৃষ্ণ-চৈতন্য প্রভু জীবে দয়া করি
স্ব-পার্ষদ স্বীয় ধাম সহ অবতরি', E'শ্রী-কৃষ্ণ-চৈতন্য প্রভু জীবে দয়া করি
স্ব-পার্ষদ স্বীয় ধাম সহ অবতরি',
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
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
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
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
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
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
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
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
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
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'রূপ-সনাতন-পদে দন্তে তৃণ করি
ভকতিবিনোদ পড়ে দুহুঁ পদ ধরি', E'রূপ-সনাতন-পদে দন্তে তৃণ করি
ভকতিবিনোদ পড়ে দুহুঁ পদ ধরি',
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
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'কাঁদিয়া কাঁদিয়া বলে আমি তো অধম
শিখায়ে শরণাগতি কর হে উত্তম', E'কাঁদিয়া কাঁদিয়া বলে আমি তো অধম
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
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 2, Song 1: Bhuliya Tomare
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Bhuliya Tomare', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'ভুলিয়া তোমারে, সংসারে আসিয়া,
পেয়ে নানাবিধ ব্যথা
তোমার চরণে, আসিয়াছি আমি,
বলিব দুঃখের কথা', E'ভুলিয়া তোমারে, সংসারে আসিয়া,
পেয়ে নানাবিধ ব্যথা
তোমার চরণে, আসিয়াছি আমি,
বলিব দুঃখের কথা',
    E'bhuliyā
tomāre, saḿsāre āsiyā,
peye nānā-vidha byathā
tomāra caraṇe, āsiyāchi āmi,
bolibo duḥkhera kathā', E'бгулійа̄
тома̄ре, саḿса̄ре а̄сійа̄,
пейе на̄на̄-відга бйатха̄
тома̄ра чаран̣е, а̄сійа̄чхі а̄мі,
болібо дух̣кхера катха̄',
    E'', E'',
    E'I
forsook You, O Lord, and came to this world of pain and sorrow. Now I submit my
tale of woe at Your lotus feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'জননী-জঠরে, ছিলাম যখন,
বিষম বন্ধনপাশে
একবার প্রভু! দেখা দিয়া মোরে,
বঞ্চিলে এ দীন দাসে', E'জননী-জঠরে, ছিলাম যখন,
বিষম বন্ধনপাশে
একবার প্রভু! দেখা দিয়া মোরে,
বঞ্চিলে এ দীন দাসে',
    E'jananī
jaṭhare, chilāma jakhona,
biṣama bandhana-pāśe
eka-bāra prabhu! dekhā diyā more,
vañcile e dīna dāse', E'джананı̄
джат̣харе, чхіла̄ма джакхона,
бішама бандгана-па̄ш́е
ека-ба̄ра прабгу! декха̄ дійа̄ море,
ван̃чіле е дı̄на да̄се',
    E'', E'',
    E'While still in the unbearable fetters of my mother''s womb, I saw You before me
You revealed Yourself but briefly and then abandoned this poor servant of
Yours.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'তখন ভাবিনু, জনম পাইয়া,
করিব ভজন তব
জনম হৈল, পড়ি'' মায়া-জালে,
না হৈল জ্ঞান লব', E'তখন ভাবিনু, জনম পাইয়া,
করিব ভজন তব
জনম হৈল, পড়ি'' মায়া-জালে,
না হৈল জ্ঞান লব',
    E'takhona
bhāvinu, janama pāiyā,
koribo bhajana tava
janama hoilo, paḍi'' māyā-jāle,
nā hoilo jñāna-lava', E'такхона
бга̄віну, джанама па̄ійа̄,
корібо бгаджана тава
джанама хоіло, пад̣і'' ма̄йа̄-джа̄ле,
на̄ хоіло джн̃а̄на-лава',
    E'', E'',
    E'At
that moment I swore to worship You after taking birth; but birth came, and with
it the network of worldly illusion which robbed me of all good sense.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'আদরের ছেলে, স্বজনের কোলে,
হাসিয়া কাটানু কাল
জনক-জননী-স্নেহেতে ভুলিয়া,
সংসার লাগিল ভাল', E'আদরের ছেলে, স্বজনের কোলে,
হাসিয়া কাটানু কাল
জনক-জননী-স্নেহেতে ভুলিয়া,
সংসার লাগিল ভাল',
    E'ādarera
chele, sva-janera kole,
hāsiyā kāṭānu kāla
janaka jananī-snehete bhuliyā,
saḿsāra lāgilo bhālo', E'а̄дарера
чхеле, сва-джанера коле,
ха̄сійа̄ ка̄т̣а̄ну ка̄ла
джанака джананı̄-снехете бгулійа̄,
саḿса̄ра ла̄ґіло бга̄ло',
    E'', E'',
    E'As
a fondled son in the lap of relatives, I passed my time smiling and laughing.
My parents'' affection helped me to forget the pangs of birth, and I thought the
world was very nice.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'ক্রমে দিন দিন, বালক হৈয়া,
খেলিনু বালক-সহ
আর কিছু দিনে, জ্ঞান উপজিল,
পাঠ পড়ি অহরহঃ', E'ক্রমে দিন দিন, বালক হৈয়া,
খেলিনু বালক-সহ
আর কিছু দিনে, জ্ঞান উপজিল,
পাঠ পড়ি অহরহঃ',
    E'krame
dina dina, bālaka hoiyā,
bhelinu bālaka-saha
āra kichu dine, jnāna upajilo,
pāṭha poḍi ahar-ahaḥ', E'краме
діна діна, ба̄лака хоійа̄,
бгеліну ба̄лака-саха
а̄ра кічху діне, джна̄на упаджіло,
па̄т̣ха под̣і ахар-ахах̣',
    E'', E'',
    E'Day
by day I grew and soon began playing with other boys. Shortly my powers of
understanding emerged. I read and studied my lessons incessantly.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'বিদ্যার গৌরবে, ভ্রমি দেশে দেশে,
ধন উপার্জন করি
স্বজন পালন, করি একমনে,
ভুলিনু তোমারে, হরি!', E'বিদ্যার গৌরবে, ভ্রমি'' দেশে দেশে,
ধন উপার্জন করি
স্বজন পালন, করি একমনে,
ভুলিনু তোমারে, হরি!',
    E'vidyāra
gaurave, bhrami'' deśe deśe,
dhana uparjana kori
sva-jana pālana, kori eka-mane,
bhulinu tomāre, hari!', E'відйа̄ра
ґаураве, бграмі'' деш́е деш́е,
дгана упарджана корі
сва-джана па̄лана, корі ека-мане,
бгуліну тома̄ре, харі!',
    E'', E'',
    E'Travelling from place to place, proud of my education, I grew wealthy and
maintained my family with undivided attention. O Lord Hari, I forgot You!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'বার্ধক্যে এখন, ভকতিবিনোদ,
কাঁদিয়া কাতর অতি
না ভজিয়া তোরে, দিন বৃথা গেল,
এখন কি হবে গতি?', E'বার্ধক্যে এখন, ভকতিবিনোদ,
কাঁদিয়া কাতর অতি
না ভজিয়া তোরে, দিন বৃথা গেল,
এখন কি হবে গতি?',
    E'bārdhakye
ekhona, bhakativinoda,
kāṇdiyā kātara ati
nā bhajiyā tore, dina bṛthā gelo,
ekhona ki habe gati?', E'ба̄рдгакйе
екхона, бгакатівінода,
ка̄н̣дійа̄ ка̄тара аті
на̄ бгаджійа̄ торе, діна бр̣тха̄ ґело,
екхона кі хабе ґаті?',
    E'', E'',
    E'Now
in old age, Bhaktivinoda is sad. He weeps. I failed to worship You, O Lord, and
instead passed my life in vain. What will be my fate now?', E'',
    E'This
is a song sung by Bhaktivinode Thakura
as the surrendering process. We have heard so much about surrender. So here are
some of the songs how one can make surrender. So Bhaktivinode
Thakura says that bhuliya tomare, samsare asiya, My dear Lord, I have come to this material world by
forgetting Lord. And since I have come here, I have suffered so many troubles
since long, long time through different species of life. So, therefore, I have
come to surrender unto You and submit unto You the
story of my sufferings. First thing is that I had to live within the womb of my
mother. Janani jathare, chilama
jakhona. When I was there, compact, packed up
in a airtight bag, hands and legs, I was staying
within the womb of my mother. At that time, I had a glimpse of You. After that time, I could not see You.
At that time I could see You, a glimpse. At that time
I thought, takhona bhavinu, janama paiya, I thought that this time when I get out of this
womb, I shall surely engage cent percent in the service of the Lord, worshiping
the Lord. No more this repetition of birth and death,
is so troublesome. Now I shall engage, this birth I
shall engage myself simply on devotional service to get out of this maya. But unfortunately, exactly after my birth, janama hoilo, padi''
maya-jale, na hoilo jnana-lava, as soon as I
got out of the womb, immediately maya, the illusory
energy, captured me and I forgot that I was in such precarious condition, and I
was crying and praying to the Lord that this time I shall get out and engage
myself in devotional service. But all these senses were lost as soon as I took
my birth. Then the next stage is adarera chele, sva-janera kole. Then I become a very pet child and everyone is
taking me on the lap, and I thought, Life is very nice, everyone loves me.''
Then I thought, This material life is very good.'' Adarera chele,
sva-janera kole, hasiya katanu kala.
Because there is no trouble. As soon as I am little
difficulty, everyone comes forward to give me relief. So I thought my life will
go on like this. So I simply wasted my time simply by smiling, and that smiling
became attractive to my relatives and they patted me. I thought, This is the
life.'' Janaki...janaka janani-snehete
bhuliya, samsara lagilo. At that time, a great deal of affection of
parents. So I thought material life is very nice. Krame
dina dina,
balaka hoiya, khelinu balaka-saha. Then
gradually I grew up and I began to play with my childhood friends, and it was
very nice life. And after some days, when I was little intelligent, then I was
put into school. So I began to study very seriously. Then
after that, vidyara gaurave,
bhrami'' dese dese, dhana uparjana
kori. Then being puffed up... Bhaktivinode Thakura was
magistrate. So he was transferred from one place to another. He is stating his
life, that vidyara gaurave,
Because I was little educated, so I was posted and I was earning decently. So
I was thinking, It is very nice.'' Vidyara gaurave, bhrami''
dese dese, dhana uparjana kori. Swa-jana palana, kori eka-mane, And only duty was how to maintain, how to raise
family members, how to keep them happy. That became my only aims and
object of life. Bardhakye ekhona, bhakativinoda.
Now Bhaktivinode Thakura,
in his old age, kandiya katara ati, Now I am
seeing that I will have to give up all this arrangement, I will have to go away
and take another body. Therefore, I do not know what kind of body I am going to
get. Therefore, I am crying, I am very much aggrieved. Bardhakye
ekhona, bhakativinoda, kandiya katara ati, I am very much aggrieved. Na bhajiya
tore, dina brtha gelo, ekhona
ki. So without worshiping You,
without serving You, I have simply wasted my time in this way. I do not know
what to do. Therefore, I surrender.', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 2, Song 2: Vidyara Vilase Katainu Kala
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Vidyara Vilase Katainu Kala', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'বিদ্যার বিলাসে, কাটাইনু কাল,
পরম সাহসে আমি
তোমার চরণ, না ভজিনু কভু,
এখন শরণ তুমি', E'বিদ্যার বিলাসে, কাটাইনু কাল,
পরম সাহসে আমি
তোমার চরণ, না ভজিনু কভু,
এখন শরণ তুমি',
    E'vidyāra
vilāse, kāṭāinu kāla,
parama sāhase āmi
tomāra caraṇa, nā bhajinu kabhu,
ekhona śaraṇa tumi', E'відйа̄ра
віла̄се, ка̄т̣а̄іну ка̄ла,
парама са̄хасе а̄мі
тома̄ра чаран̣а, на̄ бгаджіну кабгу,
екхона ш́аран̣а тумі',
    E'', E'',
    E'With great enthusiasm I spent my time in the pleasures of mundane learning, and
never worshiped Your lotus feet, O Lord. Now You are my only shelter.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'পড়িতে পড়িতে, ভরসা বারিল,
জ্ঞানে গতি হবে মানি''
সে আশা বিফল, সে জ্ঞান দুর্ব্বল,
সে জ্ঞান অজ্ঞান জানি', E'পড়িতে পড়িতে, ভরসা বারিল,
জ্ঞানে গতি হবে মানি''
সে আশা বিফল, সে জ্ঞান দুর্ব্বল,
সে জ্ঞান অজ্ঞান জানি',
    E'poḍite
poḍite, bharasā bārilo,
jñāne gati habe māni''
se āśā biphala, se jñāna durbala,
se jñāna ajñāna jāni', E'под̣іте
под̣іте, бгараса̄ ба̄ріло,
джн̃а̄не ґаті хабе ма̄ні''
се а̄ш́а̄ біпхала, се джн̃а̄на дурбала,
се джн̃а̄на аджн̃а̄на джа̄ні',
    E'', E'',
    E'Reading on and on, my hopes grew and grew, for I considered the acquisition of
material knowledge to be life''s true goal. How fruitless those hopes turned out
to be, for all my knowledge proved feeble. Now I know that all such erudition
is actually pure ignorance.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'জড-বিদ্যা জত, মাযার বৈভব,
তোমার ভজনে বাধা
মোহ জনমিযা, অনিত্য সংসারে,
জীবকে করযে গাধা', E'জড-বিদ্যা জত, মাযার বৈভব,
তোমার ভজনে বাধা
মোহ জনমিযা, অনিত্য সংসারে,
জীবকে করযে গাধা',
    E'jaḍa-vidyā
jata, māyāra vaibhava,
tomāra bhajane bādhā
moha janamiyā, anitya saḿsāre,
jīvake koraye gādhā', E'джад̣а-відйа̄
джата, ма̄йа̄ра ваібгава,
тома̄ра бгаджане ба̄дга̄
моха джанамійа̄, анітйа саḿса̄ре,
джı̄ваке корайе ґа̄дга̄',
    E'', E'',
    E'All the so-called knowledge of this world is born of the flickering potency of
Your illusory energy (maya). It is an impediment to the execution of devotional
service to You. Indulgence in mundane knowledge verily makes an ass of the
eternal soul by encouraging his infatuation with this temporary world.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'সেই গাধা হযে, সংসারের বোঝা,
বহিনু অনেক কাল
বার্ধক্যে এখন, শক্তির অভাবে,
কিছু নাহি লাগে ভাল', E'সেই গাধা হ''যে, সংসারের বোঝা,
বহিনু অনেক কাল
বার্ধক্যে এখন, শক্তির অভাবে,
কিছু নাহি লাগে ভাল',
    E'sei
gādhā ho''ye, saḿsārera bojhā,
bahinu aneka kāla
bārdhakye ekhona, śaktira abhāve,
kichu nāhi lāge bhālo', E'сеі
ґа̄дга̄ хо''йе, саḿса̄рера боджха̄,
бахіну анека ка̄ла
ба̄рдгакйе екхона, ш́актіра абга̄ве,
кічху на̄хі ла̄ґе бга̄ло',
    E'', E'',
    E'Here is one person who has been turned into such an ass, who for so long has
carried on his back the useless burden of material existence. Now in my old
age, for want of the power to enjoy, I find that nothing at all pleases me.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'জীবন জাতনা, হৈল এখন,
সে বিদ্যা অবিদ্যা ভেল
অবিদ্যার জ্বালা, ঘটিল বিষম,
সে বিদ্যা হৈল শেল', E'জীবন জাতনা, হৈল এখন,
সে বিদ্যা অবিদ্যা ভেল
অবিদ্যার জ্বালা, ঘটিল বিষম,
সে বিদ্যা হৈল শেল',
    E'jīvana
jātanā, hoilo ekhona,
se vidyā avidyā bhelo
avidyāra jwālā, ghaṭilo biṣama,
se vidyā hoilo śelo', E'джı̄вана
джа̄тана̄, хоіло екхона,
се відйа̄ авідйа̄ бгело
авідйа̄ра джва̄ла̄, ґгат̣іло бішама,
се відйа̄ хоіло ш́ело',
    E'', E'',
    E'Life has now become agony, for my so-called erudite knowledge has proven itself
to be worthless ignorance. Material knowledge has now become a pointed shaft
and has pierced my heart with the intolerable, burning pain of ignorance.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'তোমার চরণ, বিনা কিছু ধন,
সংসারে না আছে আর
ভকতিবিনোদ, জড-বিদ্যা ছাড়ি,''
তুয়া পদ করে সার', E'তোমার চরণ, বিনা কিছু ধন,
সংসারে না আছে আর
ভকতিবিনোদ, জড-বিদ্যা ছাড়ি,''
তুয়া পদ করে সার',
    E'tomāra
caraṇa, binā kichu dhana,
saḿsāre nā āche āra
bhakativinoda, jaḍa-vidyā chāḍi,''
tuwā pada kore sāra
WORD
FOR WORD', E'тома̄ра
чаран̣а, біна̄ кічху дгана,
саḿса̄ре на̄ а̄чхе а̄ра
бгакатівінода, джад̣а-відйа̄ чха̄д̣і,''
тува̄ пада коре са̄ра
ВОРД
FОР ВОРД',
    E'', E'',
    E'O Lord, there is no treasure worth seeking in this world other than Your lotus
feet. Bhaktivinoda abandons all his mundane knowledge and makes Your lotus feet
the sum and substance of his life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 2, Song 3: Yauvane Jakhon Dhana Uparjane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Yauvane Jakhon Dhana Uparjane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'যৌবনে যখন, ধন-উপার্জনে,
হৈনু বিপুল কামী
ধরম স্মরিয়া, গৃহিনীর কর,
ধরিনু তখন আমি', E'যৌবনে যখন, ধন-উপার্জনে,
হৈনু বিপুল কামী
ধরম স্মরিয়া, গৃহিনীর কর,
ধরিনু তখন আমি',
    E'yauvane
jakhona, dhana-upārjane,
hoinu
vipula kāmī
dharama
smariyā, gṛhinīra kara,
dhorinu
takhona āmi', E'йауване
джакхона, дгана-упа̄рджане,
хоіну
віпула ка̄мı̄
дгарама
смарійа̄, ґр̣хінı̄ра кара,
дгоріну
такхона а̄мі',
    E'', E'',
    E'When I was young, I greatly desired to earn money. At that time bearing in mind
the codes of religion, I took a wife.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'সংসার পাতায়ে, তাহার সহিত,
কাল-খয় কৈনু কত
বহু সুত-সুতা, জনম লোভিল,
মরমে হৈনু হত', E'সংসার পাতা''য়ে, তাহার সহিত,
কাল-খয় কৈনু কত
বহু সুত-সুতা, জনম লোভিল,
মরমে হৈনু হত',
    E'saḿsāra
pātā''ye, tāhāra sahita,
kāla-khoy
koinu koto
bahu
suta-sutā, janama lobhilo,
marame
hoinu hato', E'саḿса̄ра
па̄та̄''йе, та̄ха̄ра сахіта,
ка̄ла-кхой
коіну кото
баху
сута-сута̄, джанама лобгіло,
мараме
хоіну хато',
    E'', E'',
    E'Together we set up a household, wasted much time, had many sons and daughters;
my heart grew heavy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'সংসারের ভার, বাড়ে দিনে দিনে,
অচল হৈল গতি
বার্ধক্য আসিয়া, ঘেরিল আমারে,
অস্থির হৈল মতি', E'সংসারের ভার, বাড়ে দিনে দিনে,
অচল হৈল গতি
বার্ধক্য আসিয়া, ঘেরিল আমারে,
অস্থির হৈল মতি',
    E'saḿsārera
bhāra, bāḍe dine dine,
acala
hoilo gati
bārdhakya
āsiyā, gherilo āmāre,
asthira
hoilo mati', E'саḿса̄рера
бга̄ра, ба̄д̣е діне діне,
ачала
хоіло ґаті
ба̄рдгакйа
а̄сійа̄, ґгеріло а̄ма̄ре,
астхіра
хоіло маті',
    E'', E'',
    E'The
burden increased day by day, I felt my life at a standstill. Old age came,
grabbed me, and made my mind fickle and disturbed.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'পীড়ায় অস্থির, চিন্তায় জ্বরিত,
অভাবে জ্বলিত চিত
উপায় না দেখি, অন্ধকার-ময়,
এখন হ''য়েছি ভীত', E'পীড়ায় অস্থির, চিন্তায় জ্বরিত,
অভাবে জ্বলিত চিত
উপায় না দেখি, অন্ধকার-ময়,
এখন হ''য়েছি ভীত',
    E'pīḍāya
asthira, cintāya jwarita,
abhāve
jwalita cita
upāya
nā dekhi, andhakāra-moya,
ekhona
ho''yechi bhīta', E'пı̄д̣а̄йа
астхіра, чінта̄йа джваріта,
абга̄ве
джваліта чіта
упа̄йа
на̄ декхі, андгака̄ра-мойа,
екхона
хо''йечхі бгı̄та',
    E'', E'',
    E'Diseases trouble me now, and constant anxiety has made me feverish. My heart
burns from lack of satisfaction, and I see no way out. All is darkness and I am
very much afraid.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'সংসার-তটনী- স্রোত নহে শেষ,
মরণ নিকটে ঘোর
সব সমাপিয়া, ভজিব তোমায়,
এ আশা বিফল মোর', E'সংসার-তটনী- স্রোত নহে শেষ,
মরণ নিকটে ঘোর
সব সমাপিয়া, ভজিব তোমায়,
এ আশা বিফল মোর',
    E'saḿsāra-taṭanī-
srota nahe śeṣa,
maraṇa
nikaṭe ghora
saba
samāpiyā, bhojibo tomāya,
e
āśā biphala mora', E'саḿса̄ра-тат̣анı̄-
срота нахе ш́еша,
маран̣а
нікат̣е ґгора
саба
сама̄пійа̄, бгоджібо тома̄йа,
е
а̄ш́а̄ біпхала мора',
    E'', E'',
    E'The
current of this worldly river is strong and relentless. A frightening, gloomy
death approaches. How I wish I could give up my worldly attachments. I would
worship You, O Lord, but it is a useless hope.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'এবে শুন প্রভু! আমি গতি-হীন,
ভকতিবিনোদ কয়
তব কৃপা বিনা, সকলি নিরাশা,
দেহ'' মোরে পদাশ্রয়', E'এবে শুন প্রভু! আমি গতি-হীন,
ভকতিবিনোদ কয়
তব কৃপা বিনা, সকলি নিরাশা,
দেহ'' মোরে পদাশ্রয়',
    E'ebe
śuno prabhu! āmi gati-hīna,
bhakativinoda
koya
tava
kṛpā binā, sakali nirāśā,
deho''
more padāśroya', E'ебе
ш́уно прабгу! а̄мі ґаті-хı̄на,
бгакатівінода
койа
тава
кр̣па̄ біна̄, сакалі ніра̄ш́а̄,
дехо''
море пада̄ш́ройа',
    E'', E'',
    E'Now
please hear me, O Lord, for I am utterly helpless. Bhaktivinoda says, Without
Your mercy, everything is lost. Please give me the shelter of Your lotus feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 2, Song 4: Amar Jivan
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Amar Jivan', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'আমার জীবন, সদা পাপে রত,
নাহিক পুণ্যের লেষ
পরেরে উদ্বেগ, দিয়াছি যে কত,
দিয়াছি জীবেরে ক্লেশ', E'আমার জীবন, সদা পাপে রত,
নাহিক পুণ্যের লেষ
পরেরে উদ্বেগ, দিয়াছি যে কত,
দিয়াছি জীবেরে ক্লেশ',
    E'āmāra
jīvana, sadā pāpe rata,
nāhiko
punyera leṣa
parere
udvega, diyāchi je koto,
diyāchi
jīvere kleśa', E'а̄ма̄ра
джı̄вана, сада̄ па̄пе рата,
на̄хіко
пунйера леша
парере
удвеґа, дійа̄чхі дже кото,
дійа̄чхі
джı̄вере клеш́а',
    E'', E'',
    E'I am
an impious sinner and have caused others great anxiety and trouble.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'নিজ সুখ লাগি, পাপে নাহি ডোরি,
দয়া-হীন স্বার্থ-পর
পর-সুখে দুঃখী, সদা মিথ্য-ভাষী,
পর-দুঃখ সুখ-কর', E'নিজ সুখ লাগি'', পাপে নাহি ডোরি,
দয়া-হীন স্বার্থ-পর
পর-সুখে দুঃখী, সদা মিথ্য-ভাষী,
পর-দুঃখ সুখ-কর',
    E'nija
sukha lāgi'', pāpe nāhi ḍori,
doyā-hīna
swārtha-paro
para-sukhe
duḥkhī, sadā mithya-bhāṣī,
para-duḥkha
sukha-karo', E'ніджа
сукха ла̄ґі'', па̄пе на̄хі д̣орі,
дойа̄-хı̄на
сва̄ртха-паро
пара-сукхе
дух̣кхı̄, сада̄ мітхйа-бга̄шı̄,
пара-дух̣кха
сукха-каро',
    E'', E'',
    E'I
have never hesitated to perform sinful act for my own enjoyment. Devoid of all
compassion, concerned only with my own selfish interests, I am remorseful
seeing others happy. I am a perpetual liar, and the misery of others is a
source of great pleasure for me.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'আশেষ কামনা, হৃদি মাঝে মোর,
ক্রোধী, দম্ভ-পরায়ণ
মদ-মত্ত সদা, বিষয়ে মোহিত,
হিংসা-গর্ব্ব বিভূষণ', E'আশেষ কামনা, হৃদি মাঝে মোর,
ক্রোধী, দম্ভ-পরায়ণ
মদ-মত্ত সদা, বিষয়ে মোহিত,
হিংসা-গর্ব্ব বিভূষণ',
    E'aśeṣa
kāmanā, hṛdi mājhe mora,
krodhī,
dambha-parāyana
mada-matta
sadā, viṣaye mohita,
hiḿsā-garva
vibhūṣana', E'аш́еша
ка̄мана̄, хр̣ді ма̄джхе мора,
кродгı̄,
дамбга-пара̄йана
мада-матта
сада̄, вішайе мохіта,
хіḿса̄-ґарва
вібгӯшана',
    E'', E'',
    E'The
material desires within the core of my heart are unlimited. I am wrathful,
devoted to false pride and arrogance, intoxicated by vanity, and bewildered by
worldly affairs. Envy and egotism are the ornaments I wear.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'নিদ্রালস্য হত, সুকার্য়্যে বিরত,
অকার্য়্যে উদ্যোগী আমি
প্রতিষ্ঠ লাগিয়া, শাঠ্য-আচরণ,
লোভ-হত সদা কামী', E'নিদ্রালস্য হত, সুকার্য়্যে বিরত,
অকার্য়্যে উদ্যোগী আমি
প্রতিষ্ঠ লাগিয়া, শাঠ্য-আচরণ,
লোভ-হত সদা কামী',
    E'nidrālasya
hata, sukārye virata,
akārye
udyogī āmi
pratiṣṭha
lāgiyā, śāṭhya-ācaraṇa,
lobha-hata
sadā kāmī', E'нідра̄ласйа
хата, сука̄рйе вірата,
ака̄рйе
удйоґı̄ а̄мі
пратішт̣ха
ла̄ґійа̄, ш́а̄т̣хйа-а̄чаран̣а,
лобга-хата
сада̄ ка̄мı̄',
    E'', E'',
    E'Ruined by laziness and sleep, I resist all pious deeds; yet I am very active
and enthusiastic to perform wicked acts. For worldly fame and reputation I
engage in the practice of deceitfulness. Thus I am destroyed by my own greed
and am always lustful.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'এ হেন দুর্জ্জন, সজ-জন-বর্জ্জিত,
অপরাধি নিরন্তর
শুভ-কার্য়্য-শূন্য, সদানর্থ-মনাঃ,
নানা দুঃখে জর জর', E'এ হেন দুর্জ্জন, সজ-জন-বর্জ্জিত,
অপরাধি নিরন্তর
শুভ-কার্য়্য-শূন্য, সদানর্থ-মনাঃ,
নানা দুঃখে জর জর',
    E'e
heno durjana, saj-jana-varjita,
aparādhi
nirantara
śubha-kārya-śūnya,
sadānartha-manāḥ,
nānā
duḥkhe jara jara', E'е
хено дурджана, садж-джана-варджіта,
апара̄дгі
нірантара
ш́убга-ка̄рйа-ш́ӯнйа,
сада̄нартха-мана̄х̣,
на̄на̄
дух̣кхе джара джара',
    E'', E'',
    E'A
vile, wicked man such as this, rejected by godly people, is a constant
offender. I am such a person, devoid of all good works, forever inclined toward
evil, worn out and wasted by various miseries.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'বার্ধক্যে এখন, উপায়-বিহীন,
তা''তে দীন অকিঞ্চন
ভকতিবিনোদ, প্রভুর চরণে,
করে দুঃখ নিবেদন', E'বার্ধক্যে এখন, উপায়-বিহীন,
তা''তে দীন অকিঞ্চন
ভকতিবিনোদ, প্রভুর চরণে,
করে দুঃখ নিবেদন',
    E'bārdhakye
ekhona, upāya-vihīna,
tā''te
dīna akiñcana
bhakativinoda,
prabhura caraṇe,
kore
duḥkha nivedana
WORD
FOR WORD', E'ба̄рдгакйе
екхона, упа̄йа-віхı̄на,
та̄''те
дı̄на акін̃чана
бгакатівінода,
прабгура чаран̣е,
коре
дух̣кха ніведана
ВОРД
FОР ВОРД',
    E'', E'',
    E'Now
in old age, deprived of all means of success, humbled and poor, Bhaktivinoda
submits his tale of grief at the feet of the Supreme Lord.', E'',
    E'Amara jivana sada pape rata nahiko punyera lesa. This
is a song sung by Bhaktivinoda Thakura
in Vaisnava humbleness. A Vaisnava
is always meek and humble. So he is describing the life of the people in
general, taking himself to be one of them. He says that My life is always
engaged in sinful activities, and if you try to find out, you will not find
even a trace of pious activitiesonly sinful activities. And parere udvega, diyachi ye koto, diyachi jivere klesa: I am always inclined to give trouble to
other living entities. That is my business. I want to see that others are
suffering, and then I enjoy. Nija sukha lagi'', pape
nahi dori: For my
personal sense gratification, I accept any kind of sinful activity. Daya-hina svartha-paro:
I am not at all merciful, and I see only to my personal interest. Para-sukhe duhkhi, sada
mithya-bhasi: As such, when others are
suffering I become very happy, and I am always speaking lies. Even for ordinary
tbings I am accustomed to speaking lies. Para-duhkha sukha-karo: And if
someone is suffering, that is very pleasant to me. Asesa
kamana, hrdi majhe mora: I have
got lots of desires within my heart, and I am always angry and falsely
prestigious, always puffed up with false pride. Mada-matta
sada visaye mohita: I am captivated by subject matters of
sense gratification, and I am almost crazy. Himsa-garva
vibhusana: My ornaments are enviousness and
false pride. Nidralasya hata, sukarye virata:
I am conquered by sleep and laziness, and I am always averse to pious
activities. Akarye udyogi
ami: And I am very enthusiastic to perform
impious activities. Pratistha lagiya sathya-acarana: I
always cheat others for my prestige. Lobha-hata
sada kami: I am
conquered by greediness and always lusty. E heno durjana saj-jana-varjita: I
am so fallen, and I have no association with devotees. Aparadhi
nirantara: I am an offender always. Subha-karya-sunya: In my life there is not a
bit of auspicious activity; sadanartha manah: and my mind is always attracted by something
mischievous. Nana duhkhe jara
jara: Therefore, at the fag end of my life I am
almost invalid by all such sufferings. Bardhakye
ekhona upaya-vihina:
Now in my old age I have no alternative; ta''te
dina akincana:
therefore by force I have now become very humble and meek. Bhakativinoda prabhura carane, kore duhkha
nivedana: Thus Bhaktivinoda
Thakura is offering his sad statement of his life''s
activities at the lotus feet of the Supreme Lord.', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 2, Song 5: Suno Mor Duhkher Kahini
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Suno Mor Duhkher Kahini', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'(প্রভু হে!) শুন মোর দুঃখের কাহিনী
বিষয়-হলাহল, সুধা-ভানে পিয়লুঁ,
আব অবসান দিনমণি', E'(প্রভু হে!) শুন মোর দুঃখের কাহিনী
বিষয়-হলাহল, সুধা-ভানে পিয়লুঁ,
আব অবসান দিনমণি',
    E'(prabhu
he!) śuno mor duḥkher kāhinī
viṣaya-halāhala,
sudhā-bhāne piyaluń,
āb
avasāna dinamaṇi', E'(прабгу
хе!) ш́уно мор дух̣кхер ка̄хінı̄
вішайа-хала̄хала,
судга̄-бга̄не пійалуń,
а̄б
аваса̄на дінаман̣і',
    E'', E'',
    E'Hear, O Lord, my story of sadness. I drank the deadly poison of worldliness,
pretending it was nectar, and now the sun is setting on the horizon of my life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'খেলা-রসে শৈশব, পঢ়ৈতে কৈশোর,
গঙাওলুঁ, না ভেল বিবেক
ভোগ-বশে যৌবনে, ঘর পাতি'' বসিলুঁ,
সুত-মিত বাঢ়ল অনেক', E'খেলা-রসে শৈশব, পঢ়ৈতে কৈশোর,
গঙাওলুঁ, না ভেল বিবেক
ভোগ-বশে যৌবনে, ঘর পাতি'' বসিলুঁ,
সুত-মিত বাঢ়ল অনেক',
    E'khelā-rase
śaiśava, poḍhaite kaiśora,
gowāoluń,
nā bhelo vivek
bhoga-baśe
yauvane, ghara pāti'' bosiluń,
suta-mita
bāḍhalo anek', E'кхела̄-расе
ш́аіш́ава, под̣хаіте каіш́ора,
ґова̄олуń,
на̄ бгело вівек
бгоґа-баш́е
йауване, ґгара па̄ті'' босілуń,
сута-міта
ба̄д̣хало анек',
    E'', E'',
    E'I spent my childhood in play, my youth in academic pursuit, and in me there was
no sense of right or wrong. In young manhood I set up a household and settled
down to the spell of material enjoyment. Children and friends quickly
multiplied.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'বৃদ্ধ-কাল আওল, সব সুখ ভাগল,
পীড়া-বশে হৈনু কাতর
সর্বেন্দ্রিয় দুর্বল, ক্ষীন কলেবর,
ভোগাভাবে দুঃখিত অন্তর', E'বৃদ্ধ-কাল আওল, সব সুখ ভাগল,
পীড়া-বশে হৈনু কাতর
সর্বেন্দ্রিয় দুর্বল, ক্ষীন কলেবর,
ভোগাভাবে দুঃখিত অন্তর',
    E'vṛddha-kāla
āolo, saba sukha bhāgalo,
pīḍā-baśe
hoinu kātar
sarvendriya
durbala, kṣīna kalevara,
bhogābhāve
duḥkhita antar', E'вр̣ддга-ка̄ла
а̄оло, саба сукха бга̄ґало,
пı̄д̣а̄-баш́е
хоіну ка̄тар
сарвендрійа
дурбала, кшı̄на калевара,
бгоґа̄бга̄ве
дух̣кхіта антар',
    E'', E'',
    E'Soon old age arrived, and all happiness departed. Subjected to disease, troubled
and weak, all my senses are feeble now, my body racked and exhausted, and my
spirits downcast in the absence of youthful pleasures.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'জ্ঞান-লব-হীন, ভক্তি-রসে বঞ্ছিত,
আর মোর কি হবে উপায়
পতিত-বন্ধু, তুহুঁ, পতিতাধম হাম,
কৃপায় উঠাও তব পায়', E'জ্ঞান-লব-হীন, ভক্তি-রসে বঞ্ছিত,
আর মোর কি হবে উপায়
পতিত-বন্ধু, তুহুঁ, পতিতাধম হাম,
কৃপায় উঠাও তব পায়',
    E'jñāna-lava-hīna,
bhakti-rase vañchita,
āra
mora ki habe upāy
patita-bandhu,
tuhuń, patitādhama hāma,
kṛpāya
uṭhāo tava pāy', E'джн̃а̄на-лава-хı̄на,
бгакті-расе ван̃чхіта,
а̄ра
мора кі хабе упа̄й
патіта-бандгу,
тухуń, патіта̄дгама ха̄ма,
кр̣па̄йа
ут̣ха̄о тава па̄й',
    E'', E'',
    E'Devoid of even a particle of devotion, lacking any enlightenment  what help is
there for me now? Only You, O Lord, friend of the fallen. I am certainly
fallen, the lowest of men. Please, therefore lift me to Your lotus feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'বিচারিতে আবহি, গুন নাহি পাওবি,
কৃপা কর, ছোড়ত বিচার
তব পদ-পঙ্কজ- সীধু পিবাওতো,
ভকতিবিনোদ কর পার', E'বিচারিতে আবহি, গুন নাহি পাওবি,
কৃপা কর, ছোড়ত বিচার
তব পদ-পঙ্কজ- সীধু পিবাওতো,
ভকতিবিনোদ কর পার',
    E'vicārite
ābahi, guna nāhi pāobi,
kṛpā
koro, choḍato vicār
tava
pada-pańkaja- sīdhu pibāoto,
bhakativinoda
karo pār', E'віча̄ріте
а̄бахі, ґуна на̄хі па̄обі,
кр̣па̄
коро, чход̣ато віча̄р
тава
пада-паńкаджа- сı̄дгу піба̄ото,
бгакатівінода
каро па̄р',
    E'', E'',
    E'Were You to judge me now, You would find no good qualities. Have mercy and
judge me not. Cause me to drink the honey of Your lotus feet and thereby
deliver this Bhaktivinoda.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 2, Song 6: Tuwa Pade E Minati Mor
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Tuwa Pade E Minati Mor', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'(প্রভু হে!) তুয়া পদে এ মিনতি মোর
তুয়া পদ-পল্লব, ত্যজত মরু-মন,
বিষম বিষয়ে ভেল ভর', E'(প্রভু হে!) তুয়া পদে এ মিনতি মোর
তুয়া পদ-পল্লব, ত্যজত মরু-মন,
বিষম বিষয়ে ভেল ভর',
    E'(prabhu
he!) tuwā pade e minati mor
tuwā
pada-pallava, tyajato maru-mana,
viṣama
viṣaye bhelo bhor', E'(прабгу
хе!) тува̄ паде е мінаті мор
тува̄
пада-паллава, тйаджато мару-мана,
вішама
вішайе бгело бгор',
    E'', E'',
    E'At
Your feet, soft as new-grown leaves, I offer this humble prayer. Those feet
shelter the fallen souls who burn from the heat of material existence. But I
gave up their shelter, and now my mind scorched by the fire of worldliness, has
dried up like a desert.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'উঠয়িতে তাকত, পুন নাহি মিলো-ই,
অনুদিন করহুঁ হুতাশ
দীন-জন-নাথ, তুহুঁ কহায়সি,
তুমারি চরণ মম আশ', E'উঠয়িতে তাকত, পুন নাহি মিলো-ই,
অনুদিন করহুঁ হুতাশ
দীন-জন-নাথ, তুহুঁ কহায়সি,
তুমারি চরণ মম আশ',
    E'uṭhayite
tākata, puna nāhi milo-i,
anudina
korohuń hutāś
dīna-jana-nātha,
tuhuń kahāyasi,
tumāri
caraṇa mama āś', E'ут̣хайіте
та̄ката, пуна на̄хі міло-і,
анудіна
корохуń хута̄ш́
дı̄на-джана-на̄тха,
тухуń каха̄йасі,
тума̄рі
чаран̣а мама а̄ш́',
    E'', E'',
    E'I
find no strength to go on, and thus I spend my days lamenting. My only desire
now is for Your lotus feet, O Lord of the meek and humble.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'ঐছন দীন-জন, কহি নাহি মিলো-ই,
তুহুঁ মোরে কর পরসাদ
তুয়া জন-সঙ্গে, তুয়া কথা-রঙ্গে,
ছাডহুঁ সকল পরমাদ', E'ঐছন দীন-জন, কহি নাহি মিলো-ই,
তুহুঁ মোরে কর পরসাদ
তুয়া জন-সঙ্গে, তুয়া কথা-রঙ্গে,
ছাডহুঁ সকল পরমাদ',
    E'aichana
dīna-jana, kohi nāhi milo-i,
tuhuń
more koro parasād
tuwā
jana-sańge, tuwā kathā-rańge,
chāḍahuń
sakala paramād', E'аічхана
дı̄на-джана, кохі на̄хі міло-і,
тухуń
море коро параса̄д
тува̄
джана-саńґе, тува̄ катха̄-раńґе,
чха̄д̣ахуń
сакала парама̄д',
    E'', E'',
    E'Has
there ever been a soul as forlorn as me? Please be merciful and award me the
association of Your devotees, for by tasting the pleasure of hearing your
pastimes I shall give up all evils.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'তুয়া ধাম-মাহে, তুয়া নাম গাওত,
গঙায়বুঁ দিবা-নিশি আশ
তুয়া পদ-ছায়া, পরম সুশীতল,
মাগে ভকতিবিনোদ দাস', E'তুয়া ধাম-মাহে, তুয়া নাম গাওত,
গঙায়বুঁ দিবা-নিশি আশ
তুয়া পদ-ছায়া, পরম সুশীতল,
মাগে ভকতিবিনোদ দাস',
    E'tuwā
dhāma-māhe, tuwā nāma gāoto,
gowāyabuń
divā-niśi āś
tuwā
pada-chāyā, parama suśītala,
māge
bhakativinoda dās', E'тува̄
дга̄ма-ма̄хе, тува̄ на̄ма ґа̄ото,
ґова̄йабуń
діва̄-ніш́і а̄ш́
тува̄
пада-чха̄йа̄, парама суш́ı̄тала,
ма̄ґе
бгакатівінода да̄с',
    E'', E'',
    E'One
hope animates my soul: to spend day and night in Your divine abode singing Your
holy name. Your tiny servant Bhaktivinoda begs a place in the delightfully
cooling shade of Your feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 2, Song 7: Emona Durmati
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Emona Durmati', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'(প্রভু হে!)
এমন দুর্মতি, সংসার ভিতরে,
পড়িয়া আছিনু আমি
তব নিজ-জন, কন মহাজনে,
পাঠাইয়া দিলে তুমি', E'(প্রভু হে!)
এমন দুর্মতি, সংসার ভিতরে,
পড়িয়া আছিনু আমি
তব নিজ-জন, কন মহাজনে,
পাঠাইয়া দিলে তুমি',
    E'(prabhu
he!)
emona
durmati, saḿsāra bhitore,
poḍiyā
āchinu āmi
tava
nija-jana, kono mahājane,
pāṭhāiyā
dile tumi', E'(прабгу
хе!)
емона
дурматі, саḿса̄ра бгіторе,
под̣ійа̄
а̄чхіну а̄мі
тава
ніджа-джана, коно маха̄джане,
па̄т̣ха̄ійа̄
діле тумі',
    E'', E'',
    E'Oh
Lord! Such a wicked mind has brought me into this world, but one of Your pure
and elevated devotees has come to bring me out of it.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'দয়া করি মোরে, পতিত দেখিয়া,
কহিল আমারে গিয়া
ওহে দীন-জন, শুন ভাল কথা,
উল্লসিত হ''বে হিয়া', E'দয়া করি'' মোরে, পতিত দেখিয়া,
কহিল আমারে গিয়া
ওহে দীন-জন, শুন ভাল কথা,
উল্লসিত হ''বে হিয়া',
    E'doyā
kori'' more, patita dekhiyā,
kohilo
āmāre giyā
ohe
dīna-jana, śuno bhālo kathā,
ullasita
ha''be hiyā', E'дойа̄
корі'' море, патіта декхійа̄,
кохіло
а̄ма̄ре ґійа̄
охе
дı̄на-джана, ш́уно бга̄ло катха̄,
улласіта
ха''бе хійа̄',
    E'', E'',
    E'He
saw me so fallen and wretched, took pity, and came to me saying, O humbled
soul, please listen to this good tiding, for it will gladden your heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'তোমারে তারিতে, শ্রী-কৃষ্ণ-চৈতন্য,
নবদ্বীপে অবতার
তোমা হেন কত, দীন হীন জনে,
করিলেন ভব-পার', E'তোমারে তারিতে, শ্রী-কৃষ্ণ-চৈতন্য,
নবদ্বীপে অবতার
তোমা হেন কত, দীন হীন জনে,
করিলেন ভব-পার',
    E'tomāre
tārite, śrī-kṛṣṇa-caitanya,
navadwīpe
avatār
tomā
heno koto, dīna hīna jane,
korilena
bhava-pār', E'тома̄ре
та̄ріте, ш́рı̄-кр̣шн̣а-чаітанйа,
навадвı̄пе
авата̄р
тома̄
хено кото, дı̄на хı̄на джане,
корілена
бгава-па̄р',
    E'', E'',
    E'Sri Krsna Caitanya has appeared in the land of Navadvipa to deliver you. He
has safely conducted many miserable souls such as you across the sea of worldly
existence.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'বেদের প্রতিজ্ঞা, রাখিবার তরে,
রুক্ম-বর্ন বিপ্র-সুত
মহাপ্রভু নামে, নদীয়া মাতায়,
সঙ্গে ভাই অবধূত', E'বেদের প্রতিজ্ঞা, রাখিবার তরে,
রুক্ম-বর্ন বিপ্র-সুত
মহাপ্রভু নামে, নদীয়া মাতায়,
সঙ্গে ভাই অবধূত',
    E'vedera
pratijñā, rākhibāra tare,
rukma-varna
vipra-suta
mahāprabhu
nāme, nadīyā mātāya,
sańge
bhāi avadhūta', E'ведера
пратіджн̃а̄, ра̄кхіба̄ра таре,
рукма-варна
віпра-сута
маха̄прабгу
на̄ме, надı̄йа̄ ма̄та̄йа,
саńґе
бга̄і авадгӯта',
    E'', E'',
    E'To
fulfill the promise of the Vedas, the son of a brahmana bearing the name
Mahaprabhu of golden complexion, has descended with His brother the avadhuta
Nityananda. Together They have overwhelmed all of Nadia with divine ecstasy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'নন্দ-সুত যিনি, চৈতন্য গোসাই,
নিজ-নাম করি'' দান
তারিল জগত্‍, তুমি-ও যাইয়া,
লহ নিজ-পরিত্রাণ', E'নন্দ-সুত যিনি, চৈতন্য গোসাই,
নিজ-নাম করি'' দান
তারিল জগত্‍, তুমি-ও যাইয়া,
লহ নিজ-পরিত্রাণ',
    E'nanda-suta
jini, caitanya gosāi,
nija-nāma
kori'' dān
tārilo
jagat, tumi-o jāiyā,
loho
nija-paritrāṇ', E'нанда-сута
джіні, чаітанйа ґоса̄і,
ніджа-на̄ма
корі'' да̄н
та̄ріло
джаґат, тумі-о джа̄ійа̄,
лохо
ніджа-парітра̄н̣',
    E'', E'',
    E'Sri Caitanya, who is Krishna Himself, the son of Nanda, has saved the world by
freely distributing His own holy name. Go also and receive your deliverance.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'সে কথা শুনিয়া, আসিয়াছি, নাথ!
তোমার চরণ-তলে
ভকতিবিনোদ, কাঁদিয়া কাঁদিয়া,
আপন-কাহিনী বলে', E'সে কথা শুনিয়া, আসিয়াছি, নাথ!
তোমার চরণ-তলে
ভকতিবিনোদ, কাঁদিয়া কাঁদিয়া,
আপন-কাহিনী বলে',
    E'se
kathā śuniyā, āsiyāchi, nātha!
tomāra
caraṇa-tale
bhakativinoda,
kāńdiyā kāńdiyā,
āpana-kāhinī
bole
WORD
FOR WORD', E'се
катха̄ ш́унійа̄, а̄сійа̄чхі, на̄тха!
тома̄ра
чаран̣а-тале
бгакатівінода,
ка̄ńдійа̄ ка̄ńдійа̄,
а̄пана-ка̄хінı̄
боле
ВОРД
FОР ВОРД',
    E'', E'',
    E'O
Lord, hearing those words, Bhaktivinoda has come weeping to the soles of Your
lotus feet and tells the story of his life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 3, Song 1: Na Korolun Karama
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Na Korolun Karama', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'না করলুঁ করম, গেয়ান নাহি ভেল,
না সেবিলুঁ চরণ তোহার
জড়-সুখে মাতিয়া, আপনকু বঞ্চ-ই,
পেখহুঁ চৌদিশ আন্ধিয়ার', E'না করলুঁ করম, গেয়ান নাহি ভেল,
না সেবিলুঁ চরণ তোহার
জড়-সুখে মাতিয়া, আপনকু বঞ্চ-ই,
পেখহুঁ চৌদিশ আন্ধিয়ার',
    E'nā
koroluń karama, geyāna nāhi bhelo,
nā
seviluń caraṇa tohār
jaḍa-sukhe
mātiyā, āpanaku vañca-i,
pekhahuń
caudiśa āndhiyār', E'на̄
королуń карама, ґейа̄на на̄хі бгело,
на̄
севілуń чаран̣а тоха̄р
джад̣а-сукхе
ма̄тійа̄, а̄панаку ван̃ча-і,
пекхахуń
чаудіш́а а̄ндгійа̄р',
    E'', E'',
    E'I have earned neither piety nor knowledge. Overwhelmed by sensual pleasures, I
have cheated myself and now see only darkness in all directions.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'তুহুঁ নাথ! করুণা-নিদান
তুয়া পদ-পঙ্কজে, আত্ম সমর্পিলুঁ,
মোরে কৃপা করবি বিধান', E'তুহুঁ নাথ! করুণা-নিদান
তুয়া পদ-পঙ্কজে, আত্ম সমর্পিলুঁ,
মোরে কৃপা করবি বিধান',
    E'tuhuń
nātha! karunā-nidān
tuwā
pada-pańkaje, ātma samarpiluń,
more
kṛpā korobi vidhān', E'тухуń
на̄тха! каруна̄-ніда̄н
тува̄
пада-паńкадже, а̄тма самарпілуń,
море
кр̣па̄ коробі відга̄н',
    E'', E'',
    E'O Lord, are the fountainhead of all mercy. I surrender myself at Your lotus
feet. Kindly show me Your compassion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'প্রতিজ্ঞা তোহার ঐ, যো হি শরণাগত,
নাহি সো জানব পরমাদ
সো হাম দুষ্কৃতি, গতি না হের-ই আন,
আব মাগোঁ তুয়া পরসাদ', E'প্রতিজ্ঞা তোহার ঐ, যো হি শরণাগত,
নাহি সো জানব পরমাদ
সো হাম দুষ্কৃতি, গতি না হের-ই আন,
আব মাগোঁ তুয়া পরসাদ',
    E'pratijñā
tohāra oi, jo hi śaraṇāgata,
nāhi
so jānabo paramād
so
hāma duṣkṛti, gati nā hera-i āna,
āb
māgoń tuwā parasād', E'пратіджн̃а̄
тоха̄ра оі, джо хі ш́аран̣а̄ґата,
на̄хі
со джа̄набо парама̄д
со
ха̄ма душкр̣ті, ґаті на̄ хера-і а̄на,
а̄б
ма̄ґоń тува̄ параса̄д',
    E'', E'',
    E'It is Your promise that one who takes refuge in You will know no dangers or
fear. For a sinner like me there is no other shelter. I beg You now for infinite
grace.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'আন মনো-রথ, নিঃশেষ ছোড়ত,
কব হাম হৌবুঁ তোহারা
নিত্য-সেব্য তুহুঁ, নিত্য-সেবক মুঞি,
ভকতিবিনোদ ভাব সারা', E'আন মনো-রথ, নিঃশেষ ছোড়ত,
কব হাম হৌবুঁ তোহারা
নিত্য-সেব্য তুহুঁ, নিত্য-সেবক মুঞি,
ভকতিবিনোদ ভাব সারা',
    E'āna
mano-ratha, niḥśeṣa choḍato,
kab
hāma haubuń tohārā
nitya-sevya
tuhuń, nitya-sevaka mui,
bhakativinoda
bhāva sārā', E'а̄на
мано-ратха, ніх̣ш́еша чход̣ато,
каб
ха̄ма хаубуń тоха̄ра̄
нітйа-севйа
тухуń, нітйа-севака муі,
бгакатівінода
бга̄ва са̄ра̄',
    E'', E'',
    E'O when will I know freedom from desire and thus become Yours? You are eternally
to be served, I am Your eternal servant, and that is the sum of Bhaktivinoda''s
devotional mood.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 3, Song 2: Kohabun Ki Sarama Ki Bat
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Kohabun Ki Sarama Ki Bat', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'(প্রাণেশ্বর!) কহবুঁ কি শরম কি বাত
ঐছন পাপ নাহি, যো হাম না করলুঁ,
সহস্র সহস্র বেরি নাথ', E'(প্রাণেশ্বর!) কহবুঁ কি শরম কি বাত
ঐছন পাপ নাহি, যো হাম না করলুঁ,
সহস্র সহস্র বেরি নাথ',
    E'(prāṇeśwar!)
kohobuń ki śarama ki bāt
aichana
pāp nāhi, jo hāma nā koraluń,
sahasra
sahasra beri nāth', E'(пра̄н̣еш́вар!)
кохобуń кі ш́арама кі ба̄т
аічхана
па̄п на̄хі, джо ха̄ма на̄ коралуń,
сахасра
сахасра бері на̄тх',
    E'', E'',
    E'How much more shall I tell You of my shameful story? There is no sin which I
have not committed thousands and thousands of times.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'সহি করম-ফল, ভবে মোকে পেশ-ই,
দোখ দেওব আব কাহি
তখনক পরিনাম, কছু না বিচারলুঁ,
আব পছু তরৈতে চাহি', E'সহি করম-ফল, ভবে মোকে পেশ-ই,
দোখ দেওব আব কাহি
তখনক পরিনাম, কছু না বিচারলুঁ,
আব পছু তরৈতে চাহি',
    E'sohi
karama-phala, bhave moke peśa-i,
dokha
deobo āb kāhi
takhonaka
parinām, kachu nā bicāraluń,
āb
pachu taraite cāhi', E'сохі
карама-пхала, бгаве моке пеш́а-і,
докха
деобо а̄б ка̄хі
такхонака
паріна̄м, качху на̄ біча̄ралуń,
а̄б
пачху тараіте ча̄хі',
    E'', E'',
    E'My life in this world has been one of affliction and torment as a result of
those sins. Whom will I blame but myself? At the time I did not consider the
consequences; now, in the aftermath, I seek to be saved.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'দোখ বিচার-ই, তুঁহু দণ্ড দেওবি,
হাম ভোগ করবুঁ সংসার
করত গতাগতি, ভকত-জন-সঙ্গে,
মতি রহু চরণে তোহার', E'দোখ বিচার-ই, তুঁহু দণ্ড দেওবি,
হাম ভোগ করবুঁ সংসার
করত গতাগতি, ভকত-জন-সঙ্গে,
মতি রহু চরণে তোহার',
    E'dokha
vicāra-i, tuńhu danḍa deobi,
hāma
bhoga korabuń saḿsār
karato
gatāgati, bhakata-jana-sańge,
mati
rohu caraṇe tohār', E'докха
віча̄ра-і, туńху данд̣а деобі,
ха̄ма
бгоґа корабуń саḿса̄р
карато
ґата̄ґаті, бгаката-джана-саńґе,
маті
роху чаран̣е тоха̄р',
    E'', E'',
    E'After judging my sins, You should punish me, for I deserve to suffer the pangs
of rebirth in this world. I only pray that, as I wander through repeated births
and deaths, my mind may ever dwell at Your lotus feet in the company of
Vaisnavas.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'আপন চতুর্পন, তুয়া পদে সোঁপলুঁ,
হৃদয়-গরব দূরে গেল
দীন-দয়া-ময়, তুয়া কৃপা নিরমল,
ভকতিবিনোদ আশা ভেল', E'আপন চতুর্পন, তুয়া পদে সোঁপলুঁ,
হৃদয়-গরব দূরে গেল
দীন-দয়া-ময়, তুয়া কৃপা নিরমল,
ভকতিবিনোদ আশা ভেল',
    E'āpana
caturpana, tuwā pade sońpaluń,
hṛdoya-garava
dūre gelo
dīna-doyā-moya,
tuwā kṛpā niramala,
bhakativinoda
āśā bhelo', E'а̄пана
чатурпана, тува̄ паде соńпалуń,
хр̣дойа-ґарава
дӯре ґело
дı̄на-дойа̄-мойа,
тува̄ кр̣па̄ нірамала,
бгакатівінода
а̄ш́а̄ бгело',
    E'', E'',
    E'I offer You this judicious prayer. My heart''s false pride has gone far away. O
You who are so kind to the meek, Your pure mercy has become Bhaktivinoda''s only
hope.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 3, Song 3: Manasa Deho Geho Jo Kichu Mor
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Manasa Deho Geho Jo Kichu Mor', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'মানস, দেহ, গেহ, যো কিছু মোর
অর্পিলূ তুয়া পদে, নন্দ-কিশোর!', E'মানস, দেহ, গেহ, যো কিছু মোর
অর্পিলূ তুয়া পদে, নন্দ-কিশোর!',
    E'mānasa,
deho, geho, jo kichu mor
arpilū tuwā pade, nanda-kiśor!', E'ма̄наса,
дехо, ґехо, джо кічху мор
арпілӯ тува̄ паде, нанда-кіш́ор!',
    E'', E'',
    E'Mind, body, and family, whatever may be mine, I have surrendered at Your lotus feet,
O youthful son of Nanda!', E'',
    E'', E'У своєму поясненні до **«Чайтанья-чарітамріта»**, Мадг''я-ліла 10.55, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Це процес віддання себе. Як співає Шріла Бгактівінод Тхакур: *манаса, деха, ґеха, йо кічху мора / арпілун туйа паде нанда-кішора!* Коли людина віддається лотосним стопам Господа, вона робить це з усім, що має у своєму володінні».',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'সম্পদে বিপদে, জীবনে-মরণে
দায় মম গেলা, তুবা ও-পদ বরণে', E'সম্পদে বিপদে, জীবনে-মরণে
দায় মম গেলা, তুবা ও-পদ বরণে',
    E'sampade
vipade, jīvane-maraṇe
dāy mama gelā, tuwā o-pada baraṇe', E'сампаде
віпаде, джı̄ване-маран̣е
да̄й мама ґела̄, тува̄ о-пада баран̣е',
    E'', E'',
    E'In
good fortune or in bad, in life or at death, all my difficulties have
disappeared by choosing those feet of Yours as my only shelter.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'মারবি রাখবি-যো ইচ্ছা তোহারা
নিত্য-দাস প্রতি তুবা অধিকারা', E'মারবি রাখবি-যো ইচ্ছা তোহারা
নিত্য-দাস প্রতি তুবা অধিকারা',
    E'mārobi
rākhobi-jo icchā tohārā
nitya-dāsa prati tuwā adhikārā', E'ма̄робі
ра̄кхобі-джо іччха̄ тоха̄ра̄
нітйа-да̄са праті тува̄ адгіка̄ра̄',
    E'', E'',
    E'Slay me or protect me as You wish, for You are the master of Your eternal servant.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'জন্মাওবি মোরে ইচ্ছা যদি তোর
ভক্ত-গৃহে জনি জন্ম হৌ মোর', E'জন্মাওবি মোরে ইচ্ছা যদি তোর
ভক্ত-গৃহে জনি জন্ম হৌ মোর',
    E'janmāobi
moe icchā jadi tor
bhakta-gṛhe jani janma hau mor', E'джанма̄обі
мое іччха̄ джаді тор
бгакта-ґр̣хе джані джанма хау мор',
    E'', E'',
    E'If
it is Your will that I be born again, then may it be in the home of Your
devotee.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'কীট-জন্ম হৌ যথা তুবা দাস
বহির-মুখ ব্রহ্ম জন্মে নাহি আশ', E'কীট-জন্ম হৌ যথা তুবা দাস
বহির-মুখ ব্রহ্ম জন্মে নাহি আশ',
    E'kīṭa-janma
hau jathā tuwā dās
bahir-mukha brahma janme nāhi āś', E'кı̄т̣а-джанма
хау джатха̄ тува̄ да̄с
бахір-мукха брахма джанме на̄хі а̄ш́',
    E'', E'',
    E'May
I be born again even as a worm, so long as I may remain Your devotee. I have no
desire to be born as a Brahma averse to You.', E'',
    E'', E'У своєму поясненні до **«Чайтанья-чарітамріта»**, Антья-ліла 1.24, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Шріла Бгактівінод Тхакур також співав: *кіта-джанма ха-у йатха туйа даса* (**«Шаранаґаті»** 11). Немає нічого поганого в тому, щоб народжуватися знову і знову. Наше єдине бажання має бути народитися під опікою вайшнава».',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'ভুক্তি-মুক্তি-স্পৃহা বিহীন যে ভক্ত
লভৈতে তাক সঙ্গ অনুরক্ত', E'ভুক্তি-মুক্তি-স্পৃহা বিহীন যে ভক্ত
লভৈতে তাক সঙ্গ অনুরক্ত',
    E'bhukti-mukti-spṛhā
vihīna je bhakta
labhaite tāko sańga anurakta', E'бгукті-мукті-спр̣ха̄
віхı̄на дже бгакта
лабгаіте та̄ко саńґа ануракта',
    E'', E'',
    E'I yearn
for the company of that devotee who is completely devoid of all desire for
worldly enjoyment or liberation.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'জনক, জননী, দয়িত, তনয়
প্রভু, গুরু, পতি-তুহূ সর্ব-ময়', E'জনক, জননী, দয়িত, তনয়
প্রভু, গুরু, পতি-তুহূ সর্ব-ময়',
    E'janaka,
jananī, dayita, tanay
prabhu, guru, pati-tuhū sarva-moy', E'джанака,
джананı̄, дайіта, танай
прабгу, ґуру, паті-тухӯ сарва-мой',
    E'', E'',
    E'Father, mother, lover, son, Lord, preceptor, and husband; You are everything to
me.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'ভকতিবিনোদ কহে, শুন কান!
রাধা-নাথ! তুহূ হামার পরাণ', E'ভকতিবিনোদ কহে, শুন কান!
রাধা-নাথ! তুহূ হামার পরাণ',
    E'bhakativinoda
kohe, śuno kāna!
rādhā-nātha! tuhū hāmāra parāṇa
WORD
FOR WORD', E'бгакатівінода
кохе, ш́уно ка̄на!
ра̄дга̄-на̄тха! тухӯ ха̄ма̄ра пара̄н̣а
ВОРД
FОР ВОРД',
    E'', E'',
    E'Thakura Bhaktivinoda says, "O Kana, please hear me! O Lord of Radha, You
are my life and soul!"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 3, Song 4: Aham Mama Saba Arthe
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Aham Mama Saba Arthe', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'অহং মম-শব্দ-অর্থে যাহা কিছু হয়
অর্পিলুঙ তোমার পদে, ওহে দয়া-ময়!', E'অহং মম-শব্দ-অর্থে যাহা কিছু হয়
অর্পিলুঙ তোমার পদে, ওহে দয়া-ময়!',
    E'`ahaḿ
mama''-śabda-arthe jāhā kichu hoy
arpiluń
tomāra pade, ohe doyā-moy!', E'`ахаḿ
мама''-ш́абда-артхе джа̄ха̄ кічху хой
арпілуń
тома̄ра паде, охе дойа̄-мой!',
    E'', E'',
    E'Whatever I am, whatever I possess, I offer at Your lotus feet, O merciful Lord.
I no longer belong to myself. Now I am exclusively Yours.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'আমার আমি ত নাথ! না রোহিনু আর
এখন হৈনু আমি কেবল তোমার', E'আমার আমি ত নাথ! না রোহিনু আর
এখন হৈনু আমি কেবল তোমার',
    E'`āmāra''
āmi to'' nātha! nā rohinu ār
ekhona
hoinu āmi kevala tomār', E'`а̄ма̄ра''
а̄мі то'' на̄тха! на̄ рохіну а̄р
екхона
хоіну а̄мі кевала тома̄р',
    E'', E'',
    E'The
soul inhabiting this mortal body has given up the false ego attached to the word
I, and now the eternal, spiritual sense of being Yours has entered his heart.
4-', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'আমি শব্দে দেহী জীব অহংতা ছাড়িল
ত্বদীয়াভিমান আজি হৃদয়ে পশিল', E'আমি শব্দে দেহী জীব অহংতা ছাড়িল
ত্বদীয়াভিমান আজি হৃদয়ে পশিল',
    E'`āmi''
śabde dehī jīva ahaḿtā chāḍilo
twadīyābhimāna
āji hṛdoye paśilo', E'`а̄мі''
ш́абде дехı̄ джı̄ва ахаḿта̄ чха̄д̣іло
твадı̄йа̄бгіма̄на
а̄джі хр̣дойе паш́іло',
    E'', E'',
    E'All my possessions - body, brothers, friends, and followers, wife, sons,
personal belongings, house and home- all of these I give You, for I have become
Your servant. Now I dwell in Your house.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'আমার সর্বস্ব-দেহ, গেহ অনুচর
ভাই, বন্ধু, দারা, সুত, দ্রব্য, দ্বার, ঘর', E'আমার সর্বস্ব-দেহ, গেহ অনুচর
ভাই, বন্ধু, দারা, সুত, দ্রব্য, দ্বার, ঘর',
    E'āmār
sarvasvadeho, geho anucar
bhāi,
bandhu, dārā, suta, dravya, dwāra, ghar', E'а̄ма̄р
сарвасвадехо, ґехо анучар
бга̄і,
бандгу, да̄ра̄, сута, дравйа, два̄ра, ґгар',
    E'', E'',
    E'You
are the Lord of my house, and I Your most obedient servant. Your happiness is
my only endeavor now.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'সে সব হৈল তব, আমি হৈনু দাস
তোমার গৃহেতে এবে আমি করি বাস', E'সে সব হৈল তব, আমি হৈনু দাস
তোমার গৃহেতে এবে আমি করি বাস',
    E'se
saba hoilo tava, āmi hoinu dās
tomāra
gṛhete ebe āmi kori bās', E'се
саба хоіло тава, а̄мі хоіну да̄с
тома̄ра
ґр̣хете ебе а̄мі корі ба̄с',
    E'', E'',
    E'Whatever piety or sins were done by me, by mind or deed, are no longer mine,
for I am redeemed', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'তুমি গৃহ-স্বামী, আমি সেবক তোমার
তোমার সুখেতে চেষ্টা এখন আমার', E'তুমি গৃহ-স্বামী, আমি সেবক তোমার
তোমার সুখেতে চেষ্টা এখন আমার',
    E'tumi
gṛha-swāmī, āmi sevaka tomār
tomāra
sukhete ceṣṭā ekhona āmār', E'тумі
ґр̣ха-сва̄мı̄, а̄мі севака тома̄р
тома̄ра
сукхете чешт̣а̄ екхона а̄ма̄р',
    E'', E'',
    E'My desire
has become one with Yours. From this day Bhaktivinoda has no other identity.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'স্থূল-লিঙ্গ-দেহে মোর সুকৃত দুষ্কৃত
আর মোর নহে, প্রভু! আমি তো'' নিষ্কৃত', E'স্থূল-লিঙ্গ-দেহে মোর সুকৃত দুষ্কৃত
আর মোর নহে, প্রভু! আমি তো'' নিষ্কৃত',
    E'sthūla-lińga-dehe
mora sukṛta duṣkṛta
āra
mora nahe, prabhu! āmi to'' niṣkṛta', E'стхӯла-ліńґа-дехе
мора сукр̣та душкр̣та
а̄ра
мора нахе, прабгу! а̄мі то'' нішкр̣та',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'তোমার ইচ্ছায় মোর ইচ্ছা মিশাইল
ভকতিবিনোদ আজ আপনে ভুলিল', E'তোমার ইচ্ছায় মোর ইচ্ছা মিশাইল
ভকতিবিনোদ আজ আপনে ভুলিল',
    E'tomāra
icchāya mora icchā miśāilo
bhakativinoda
āja āpane bhulilo', E'тома̄ра
іччха̄йа мора іччха̄ міш́а̄іло
бгакатівінода
а̄джа а̄пане бгуліло',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 3, Song 5: Amar Bolite Prabhu
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Amar Bolite Prabhu', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'আমার বলিতে প্রভু! আরে কিছু নাই
তুমি-ই আমার মাত্র পিতা-বন্ধু-ভাই', E'আমার বলিতে প্রভু! আরে কিছু নাই
তুমি-ই আমার মাত্র পিতা-বন্ধু-ভাই',
    E'`āmāra''
bolite prabhu! āre kichu nāi
tumi-i
āmāra mātra pitā-bandhu-bhāi', E'`а̄ма̄ра''
боліте прабгу! а̄ре кічху на̄і
тумі-і
а̄ма̄ра ма̄тра піта̄-бандгу-бга̄і',
    E'', E'',
    E'Nothing remains mine. Father, friend, brother  You are even these to me.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'বন্ধু, দারা, সুত, সুতা-তব দাসী দাস
সেই তো'' সম্বন্ধে সবে আমার প্রয়াস', E'বন্ধু, দারা, সুত, সুতা-তব দাসী দাস
সেই তো'' সম্বন্ধে সবে আমার প্রয়াস',
    E'bandhu,
dārā, suta, sutātava dāsī dās
sei
to'' sambandhe sabe āmāra prayās', E'бандгу,
да̄ра̄, сута, сута̄тава да̄сı̄ да̄с
сеі
то'' самбандге сабе а̄ма̄ра прайа̄с',
    E'', E'',
    E'Those whom I called friends, wife, sons, and daughters are all Your servants and
maidservants. Whatever care I take for them is only as it relates to You.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'ধন, জন, গৃহ, দার তোমার বলিয়া
রখা করি আমি মাত্র সেবক হৈয়া', E'ধন, জন, গৃহ, দার তোমার বলিয়া
রখা করি আমি মাত্র সেবক হৈয়া',
    E'dhana,
jana, gṛha, dāra `tomāra'' boliyā
rakhā
kori āmi mātro sevaka hoiyā', E'дгана,
джана, ґр̣ха, да̄ра `тома̄ра'' болійа̄
ракха̄
корі а̄мі ма̄тро севака хоійа̄',
    E'', E'',
    E'If
I continue to maintain my wealth, family members, home, and wife, it is because
they are Yours. I am a mere servant.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'তোমার কার্যের তোরে উপর্জিব ধন
তোমার সংসারে-ব্যয় করিব বহন', E'তোমার কার্যের তোরে উপর্জিব ধন
তোমার সংসারে-ব্যয় করিব বহন',
    E'tomāra
kāryera tore uparjibo dhan
tomāra
saḿsāre-vyaya koribo vahan', E'тома̄ра
ка̄рйера торе упарджібо дган
тома̄ра
саḿса̄ре-вйайа корібо вахан',
    E'', E'',
    E'For
Your service I will earn money and bear the expense of Your household.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'ভাল-মন্দ নাহি জানি সেবা মাত্র করি
তোমার সংসারে আমি বিষয়-প্রহরী', E'ভাল-মন্দ নাহি জানি সেবা মাত্র করি
তোমার সংসারে আমি বিষয়-প্রহরী',
    E'bhālo-manda
nāhi jāni sevā mātro kori
tomāra
saḿsāre āmi viṣaya-praharī', E'бга̄ло-манда
на̄хі джа̄ні сева̄ ма̄тро корі
тома̄ра
саḿса̄ре а̄мі вішайа-прахарı̄',
    E'', E'',
    E'I
know neither good nor bad. I merely serve. I am but a watchman who guards the
properties in Your household.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'তোমার ইচ্ছায় মোর ইন্দ্রিয়-চালনা
শ্রবন, দর্শন, ঘ্রান, ভোজন-বাসনা', E'তোমার ইচ্ছায় মোর ইন্দ্রিয়-চালনা
শ্রবন, দর্শন, ঘ্রান, ভোজন-বাসনা',
    E'tomāra
icchāya mora indriya-cālanā
śravana,
darśana, ghrāna, bhojana-vāsanā', E'тома̄ра
іччха̄йа мора індрійа-ча̄лана̄
ш́равана,
дарш́ана, ґгра̄на, бгоджана-ва̄сана̄',
    E'', E'',
    E'The
exercising of my senses  hearing, seeing, smelling, tasting, touching  is
done according to Your desire.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'নিজ-সুখ লাগি কিছু নাহি করি আর
ভকতিবিনোদ বলে, তব সুখ-সার
2017', E'নিজ-সুখ লাগি কিছু নাহি করি আর
ভকতিবিনোদ বলে, তব সুখ-সার
2017',
    E'nija-sukha
lāgi'' kichu nāhi kori ār
bhakativinoda
bole, tava sukha-sār', E'ніджа-сукха
ла̄ґі'' кічху на̄хі корі а̄р
бгакатівінода
боле, тава сукха-са̄р',
    E'', E'',
    E'I
no longer do anything for my own pleasure. Bhaktivinoda says, Your happiness
is the essence of everything.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 3, Song 6: Bastutoh Sakali Tava
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Bastutoh Sakali Tava', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'বস্তুতঃ সকলি তব, জীব কেহ নয়
অহম''-মম''-ভ্রমে ভ্রমি'' ভোগে শোক-ভয়', E'বস্তুতঃ সকলি তব, জীব কেহ নয়
অহম''-মম''-ভ্রমে ভ্রমি'' ভোগে শোক-ভয়',
    E'bastutaḥ
sakali tava, jīva keho noy
`aham''-`mama''-bhrame
bhromi'' bhoge śoka-bhoy', E'бастутах̣
сакалі тава, джı̄ва кехо ной
`ахам''-`мама''-бграме
бгромі'' бгоґе ш́ока-бгой',
    E'', E'',
    E'In
truth, all things belong to You. No jiva is owner of anything. The tiny soul
wanders in this world mistakenly thinking, I am this transitory body, and
everything related to this body is mine. Thus he suffers sorrow and fear.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'অহং-মম-অভিমান এই-মাত্র ধন
বদ্ধ-জীব নিজ বলি'' জানে মনে মন', E'অহং-মম-অভিমান এই-মাত্র ধন
বদ্ধ-জীব নিজ বলি'' জানে মনে মন',
    E'ahaḿ-mama-abhimāna
ei-mātro dhan
baddha-jīva
nija boli'' jāne mane man', E'ахаḿ-мама-абгіма̄на
еі-ма̄тро дган
баддга-джı̄ва
ніджа болі'' джа̄не мане ман',
    E'', E'',
    E'The
conditioned soul is falsely proud and considers everything attached to the
words I and mine to be his treasures alone.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'সেই অভিমানে আমি সংসারে পড়িয়া
হাবুডুবু খাই ভব-সিন্ধু সাঁতারিয়া', E'সেই অভিমানে আমি সংসারে পড়িয়া
হাবুডুবু খাই ভব-সিন্ধু সাঁতারিয়া',
    E'sei
abhimāne āmi saḿsāre poḍiyā
hābuḍubu
khāi bhava-sindhu sāńtāriyā', E'сеі
абгіма̄не а̄мі саḿса̄ре под̣ійа̄
ха̄буд̣убу
кха̄і бгава-сіндгу са̄ńта̄рійа̄',
    E'', E'',
    E'Due
to that same vanity, I fell into this world. Floundering in the ocean of
mundane existence like a drowning man, I suffer the pangs of rising and sinking
in that ocean.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'তোমার অভয়-পদে লৈয়া শরণ
আজি আমি করিলাম আত্ম-নিবেদন', E'তোমার অভয়-পদে লৈয়া শরণ
আজি আমি করিলাম আত্ম-নিবেদন',
    E'tomāra
abhoya-pade loiyā śaraṇ
āji
āmi korilāma ātma-nivedan', E'тома̄ра
абгойа-паде лоійа̄ ш́аран̣
а̄джі
а̄мі коріла̄ма а̄тма-ніведан',
    E'', E'',
    E'I
take shelter at Your lotus feet, which award fearlessness, and dedicate myself
to You on this day.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'অহং-মম-অভিমান ছাড়িল আমায়
আর যেন মম হৃদে স্তান নাহি পায়', E'অহং-মম-অভিমান ছাড়িল আমায়
আর যেন মম হৃদে স্তান নাহি পায়',
    E'`ahaḿ''-`mama''-abhimāna
chāḍilo āmāy
ār
jeno mama hṛde stāna nāhi pāy', E'`ахаḿ''-`мама''-абгіма̄на
чха̄д̣іло а̄ма̄й
а̄р
джено мама хр̣де ста̄на на̄хі па̄й',
    E'', E'',
    E'The
vanity of I and mine has left me now. May it never again find a place
within my heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'এই মাত্র বল প্রভু! দিবে হে আমারে
অহংতা-মমতা দূরে পারি রাখিবারে', E'এই মাত্র বল প্রভু! দিবে হে আমারে
অহংতা-মমতা দূরে পারি রাখিবারে',
    E'ei
mātro bala prabhu! dibe he āmāre
ahaḿtā-mamatā
dūre pāri rākhibāre', E'еі
ма̄тро бала прабгу! дібе хе а̄ма̄ре
ахаḿта̄-мамата̄
дӯре па̄рі ра̄кхіба̄ре',
    E'', E'',
    E'O
Lord, please give me this strength, that I may be able to keep the false
conceptions of I and Mine far away.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'আত্ম-নিবেদন-ভাব হৃদে দৃঢ় রয়
হস্তি-স্নান সম যেন খনিক না হয়', E'আত্ম-নিবেদন-ভাব হৃদে দৃঢ় রয়
হস্তি-স্নান সম যেন খনিক না হয়',
    E'ātma-nivedana-bhāva
hṛde dṛḍha roy
hasti-snāna
sama jeno khanika nā hoy', E'а̄тма-ніведана-бга̄ва
хр̣де др̣д̣ха рой
хасті-сна̄на
сама джено кханіка на̄ хой',
    E'', E'',
    E'May
the mood of self-surrender to the Supreme Lord remain firmly fixed in my heart
and not prove to be like the momentary cleanliness of an elephant after a bath.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'ভকতিবিনোদ প্রভু নিত্যানন্দ পায়
মাগে পরসাদ, জাহে অভিমান যায়', E'ভকতিবিনোদ প্রভু নিত্যানন্দ পায়
মাগে পরসাদ, জাহে অভিমান যায়',
    E'bhakativinoda
prabhu nityānanda pāy
māge
parasāda, jāhe abhimāna jāy', E'бгакатівінода
прабгу нітйа̄нанда па̄й
ма̄ґе
параса̄да, джа̄хе абгіма̄на джа̄й',
    E'', E'',
    E'Bhaktivinoda begs at the lotus feet of Lord Nityananda for the grace which
delivers one from all false pride.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 3, Song 7: Nivedana Kori Prabhu Tomara Carane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Nivedana Kori Prabhu Tomara Carane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'নিবেদন করি প্রভু! তোমার চরণে
পতিত অধম আমি, জানে ত্রি-ভুবনে', E'নিবেদন করি প্রভু! তোমার চরণে
পতিত অধম আমি, জানে ত্রি-ভুবনে',
    E'nivedana
kori prabhu! tomāra caraṇe
patita
adhama āmi, jāne tri-bhuvane', E'ніведана
корі прабгу! тома̄ра чаран̣е
патіта
адгама а̄мі, джа̄не трі-бгуване',
    E'', E'',
    E'I
submit at Your lotus feet, O Lord, that I am fallen and wretched, a fact known
to the three worlds.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'আমা-সম পাপী নাহি জগত-ভিতরে
মম সম অপরাধী নাহিক সংসারে', E'আমা-সম পাপী নাহি জগত-ভিতরে
মম সম অপরাধী নাহিক সংসারে',
    E'āmā-sama
pāpī nāhi jagat-bhitore
mama
sama aparādhī nāhiko saḿsāre', E'а̄ма̄-сама
па̄пı̄ на̄хі джаґат-бгіторе
мама
сама апара̄дгı̄ на̄хіко саḿса̄ре',
    E'', E'',
    E'There is no sinner more sinful than me. In the entire material creation there
is no offender whose offenses equal mine.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'সেই সব পাপ আর অপরাধ, আমি
পরিহারে পাই লজ্জা, সব জান'' তুমি', E'সেই সব পাপ আর অপরাধ, আমি
পরিহারে পাই লজ্জা, সব জান'' তুমি',
    E'sei
saba pāpa āra aparādha, āmi
parihāre
pāi lajjā, saba jāno'' tumi', E'сеі
саба па̄па а̄ра апара̄дга, а̄мі
паріха̄ре
па̄і ладжджа̄, саба джа̄но'' тумі',
    E'', E'',
    E'By
attempting to clear myself of all these sins and offenses I am put to shame and
beg Your forgiveness. All this is understood by You.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'তুমি বিনা কার আমি লৈব শরণ?
তুমি সর্বেশ্বরেশ্বর, ব্রজেন্দ্র-নন্দন!', E'তুমি বিনা কার আমি লৈব শরণ?
তুমি সর্বেশ্বরেশ্বর, ব্রজেন্দ্র-নন্দন!',
    E'tumi
binā kā''ra āmi loibo śaraṇ?
tumi
sarveśvareśvara, brajendra-nandan!', E'тумі
біна̄ ка̄''ра а̄мі лоібо ш́аран̣?
тумі
сарвеш́вареш́вара, браджендра-нандан!',
    E'', E'',
    E'Of
whom will I take shelter except for You? O son of the King of Vraja, You are
the Lord of all lords.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'জগত তোমার নাথ! তুমি সর্ব-ময়
তোমা প্রতি অপরাধ তুমি কর'' ক্ষয়', E'জগত তোমার নাথ! তুমি সর্ব-ময়
তোমা প্রতি অপরাধ তুমি কর'' ক্ষয়',
    E'jagat
tomāra nātha! tumi sarva-moy
tomā
prati aparādha tumi koro'' kṣoy', E'джаґат
тома̄ра на̄тха! тумі сарва-мой
тома̄
праті апара̄дга тумі коро'' кшой',
    E'', E'',
    E'This world is Yours, and You pervade all things in it. You forgive the offenses
committed against You.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'তুমি তো স্খলিত-পদ জনের আশ্রয়
তুমি বিনা আর কিবা আছে, দয়া-ময়!', E'তুমি তো স্খলিত-পদ জনের আশ্রয়
তুমি বিনা আর কিবা আছে, দয়া-ময়!',
    E'tumi
to'' skhalita-pada janera āśroy
tumi
binā āra kibā āche, doyā-moy!', E'тумі
то'' скхаліта-пада джанера а̄ш́рой
тумі
біна̄ а̄ра кіба̄ а̄чхе, дойа̄-мой!',
    E'', E'',
    E'You
alone are the shelter of those who have gone astray. Apart from You, what else
exists, O merciful Lord?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'সেই-রূপ তব অপরাধী জন যত
তোমার শরণাগত হৈবে সতত', E'সেই-রূপ তব অপরাধী জন যত
তোমার শরণাগত হৈবে সতত',
    E'sei-rūpa
tava aparādhī jana jata
tomāra
śaraṇāgata hoibe satata', E'сеі-рӯпа
тава апара̄дгı̄ джана джата
тома̄ра
ш́аран̣а̄ґата хоібе сатата',
    E'', E'',
    E'Those like me who have offended You will know no peace until achieving Your
shelter.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'ভকতিবিনোদ এবে লৈয়া শরণ
তুয়া পদে করে আজ আত্ম-সমর্পণ', E'ভকতিবিনোদ এবে লৈয়া শরণ
তুয়া পদে করে আজ আত্ম-সমর্পণ',
    E'bhakativinoda
ebe loiyā śaraṇ
tuwā
pade kore āj ātma-samarpaṇ', E'бгакатівінода
ебе лоійа̄ ш́аран̣
тува̄
паде коре а̄дж а̄тма-самарпан̣',
    E'', E'',
    E'Bhaktivinoda takes shelter in You and surrenders himself at Your lotus feet on
this very day.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 3, Song 8: Atma Nivedana Tuwa Pade
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Atma Nivedana Tuwa Pade', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 8;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'আত্ম-নিবেদন, তুয়া পদে করি,
হৈনু পরম সুখী
দুঃখ দূরে গেল, চিন্তা না রহিল,
চৌদিকে আনন্দ দেখি', E'আত্ম-নিবেদন, তুয়া পদে করি'',
হৈনু পরম সুখী
দুঃখ দূরে গেল, চিন্তা না রহিল,
চৌদিকে আনন্দ দেখি',
    E'ātma-nivedana,
tuwā pade kori'',
hoinu
parama sukhī
duḥkha
dūre gelo, cintā nā rohilo,
caudike
ānanda dekhi', E'а̄тма-ніведана,
тува̄ паде корі'',
хоіну
парама сукхı̄
дух̣кха
дӯре ґело, чінта̄ на̄ рохіло,
чаудіке
а̄нанда декхі',
    E'', E'',
    E'I
have become supremely joyful by surrendering myself at Your holy feet.
Unhappiness has gone away, and there are no more anxieties. I see joy in all
directions.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'অশোক-অভয়, অমৃত-আধার,
তোমার চরণ-দ্বয়
তাহাতে এখন, বিশ্রাম লভিয়া
ছাড়িনু ভবের ভয়', E'অশোক-অভয়, অমৃত-আধার,
তোমার চরণ-দ্বয়
তাহাতে এখন, বিশ্রাম লভিয়া
ছাড়িনু ভবের ভয়',
    E'aśoka-abhoya,
amṛta-ādhāra,
tomāra
caraṇa-dwaya
tāhāte
ekhona, viśrāma labhiyā
chāḍinu
bhavera bhoya', E'аш́ока-абгойа,
амр̣та-а̄дга̄ра,
тома̄ра
чаран̣а-двайа
та̄ха̄те
екхона, віш́ра̄ма лабгійа̄
чха̄д̣іну
бгавера бгойа',
    E'', E'',
    E'Your two lotus feet are reservoirs of immortal nectar where one may live free
from sorrow and fear. I have found peace there now and have given up the fear
of worldly existence.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'তোমার সংসারে, করিব সেবন,
নাহিব ফলের ভাগী
তব সুখ জাহে, করিব যতন,
হ''য়ে পদে অনুরাগী', E'তোমার সংসারে, করিব সেবন,
নাহিব ফলের ভাগী
তব সুখ জাহে, করিব যতন,
হ''য়ে পদে অনুরাগী',
    E'tomāra
saḿsāre, koribo sevana,
nāhibo
phalera bhāgī
tava
sukha jāhe, koribo jatana,
ho''ye
pade anurāgī', E'тома̄ра
саḿса̄ре, корібо севана,
на̄хібо
пхалера бга̄ґı̄
тава
сукха джа̄хе, корібо джатана,
хо''йе
паде анура̄ґı̄',
    E'', E'',
    E'I
shall render service in Your household and not endeavor to enjoy the fruits of
that service, but rather I shall strive for whatever pleases You, fully devoted
to Your lotus feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'তোমার সেবায়, দুঃখ হয় যত,
সে-ও তো'' পরম সুখ
সেবা-সুখ-দুঃখ, পরম সম্পদ,
নাশয়ে অবিদ্যা-দুঃখ', E'তোমার সেবায়, দুঃখ হয় যত,
সে-ও তো'' পরম সুখ
সেবা-সুখ-দুঃখ, পরম সম্পদ,
নাশয়ে অবিদ্যা-দুঃখ',
    E'tomāra
sevāya, duḥkha hoya jato,
se-o
to'' parama sukha
sevā-sukha-duḥkha,
parama sampada,
nāśaye
avidyā-duḥkha', E'тома̄ра
сева̄йа, дух̣кха хойа джато,
се-о
то'' парама сукха
сева̄-сукха-дух̣кха,
парама сампада,
на̄ш́айе
авідйа̄-дух̣кха',
    E'', E'',
    E'Troubles encountered in Your service shall be the cause of great happiness, for
in Your devotional service joy and sorrow are equally great riches. Both
destroy the misery of ignorance.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'পূর্ব ইতিহাস, ভুলিনু সকল,
সেবা-সুখ পে''য়ে মনে
আমি তো'' তোমার, তুমি তো'' আমার,
কি কাজ অপর ধনে', E'পূর্ব ইতিহাস, ভুলিনু সকল,
সেবা-সুখ পে''য়ে মনে
আমি তো'' তোমার, তুমি তো'' আমার,
কি কাজ অপর ধনে',
    E'pūrva
itihāsa, bhulinu sakala,
sevā-sukha
pe''ye mane
āmi
to'' tomāra, tumi to'' āmāra,
ki
kāja apara dhane', E'пӯрва
ітіха̄са, бгуліну сакала,
сева̄-сукха
пе''йе мане
а̄мі
то'' тома̄ра, тумі то'' а̄ма̄ра,
кі
ка̄джа апара дгане',
    E'', E'',
    E'I
have completely forgotten all past history by feeling great joy in my mind. I
am most certainly Yours, and You are indeed mine. What need is there of any
other treasure?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'ভকতিবিনোদ, আনন্দে ডুবিয়া,
তোমার সেবার তরে
সব চেষ্টা করে, তব ইচ্ছা-মত,
থাকিয়া তোমার ঘরে', E'ভকতিবিনোদ, আনন্দে ডুবিয়া,
তোমার সেবার তরে
সব চেষ্টা করে, তব ইচ্ছা-মত,
থাকিয়া তোমার ঘরে',
    E'bhakativinoda,
ānande ḍubiyā,
tomāra
sevāra tare
saba
ceṣṭā kore, tava icchā-mato,
thākiyā
tomāra ghare', E'бгакатівінода,
а̄нанде д̣убійа̄,
тома̄ра
сева̄ра таре
саба
чешт̣а̄ коре, тава іччха̄-мато,
тха̄кійа̄
тома̄ра ґгаре',
    E'', E'',
    E'Bhaktivinoda, diving into the ocean of bliss, devotes all his efforts for Your
service and dwells in Your house according to Your wishes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 4, Song 1: Ki Jani Ki Bale
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Ki Jani Ki Bale', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'কি জানি কি বলে, তোমার ধামেতে,
হৈনু শরণাগত
তুমি দয়া-ময়, পতিত-পাবন,
পতিত-তারণে রত', E'কি জানি কি বলে, তোমার ধামেতে,
হৈনু শরণাগত
তুমি দয়া-ময়, পতিত-পাবন,
পতিত-তারণে রত',
    E'ki
jāni ki bale, tomāra dhāmete,
hoinu
śaraṇāgata
tumi
doyā-moy, patita-pāvana,
patita-tāraṇe
rata', E'кі
джа̄ні кі бале, тома̄ра дга̄мете,
хоіну
ш́аран̣а̄ґата
тумі
дойа̄-мой, патіта-па̄вана,
патіта-та̄ран̣е
рата',
    E'', E'',
    E'How
has one such as I come to Your shelter? Surely it is by Your mercy alone, for
You are everseeking the purification and deliverance of the fallen souls.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'ভরসা আমার, এই মাত্র নাথ!
তুমি তো'' করুনা-ময়
তব দয়া-পাত্র, নাহি মোর সম,
অবশ্য ঘুচাবে ভয়', E'ভরসা আমার, এই মাত্র নাথ!
তুমি তো'' করুনা-ময়
তব দয়া-পাত্র, নাহি মোর সম,
অবশ্য ঘুচাবে ভয়',
    E'bharasā
āmāra, ei mātra nātha!
tumi
to'' karunā-moy
tava
doyā-pātra, nāhi mora sama,
avaśya
ghucābe bhoy', E'бгараса̄
а̄ма̄ра, еі ма̄тра на̄тха!
тумі
то'' каруна̄-мой
тава
дойа̄-па̄тра, на̄хі мора сама,
аваш́йа
ґгуча̄бе бгой',
    E'', E'',
    E'You
are my only hope, for You are full of compassion and mercy. There is no one who
needs Your mercy more than I. You will surely drive away all fear.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'আমারে তারিতে, কাহার শকতি,
অবনী-ভিতরে নাহি
দয়াল ঠাকুর! ঘোষনা তোমার,
অধম পামরে ত্রাহি', E'আমারে তারিতে, কাহার শকতি,
অবনী-ভিতরে নাহি
দয়াল ঠাকুর! ঘোষনা তোমার,
অধম পামরে ত্রাহি',
    E'āmāre
tārite, kāhāro śakati,
avanī-bhitore
nāhi
doyāla
ṭhākura! ghoṣanā tomāra,
adhama
pāmare trāhi', E'а̄ма̄ре
та̄ріте, ка̄ха̄ро ш́акаті,
аванı̄-бгіторе
на̄хі
дойа̄ла
т̣ха̄кура! ґгошана̄ тома̄ра,
адгама
па̄маре тра̄хі',
    E'', E'',
    E'No
one else has the power to deliver me. O merciful Lord, by Your declaration,
kindly deliver this vile and lowly sinner.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'সকল ছাডিয়া, আসিয়াছি আমি,
তোমার চরণে নাথ!
আমি নিত্য-দাস, তুমি পালয়িতা,
তুমি গোপ্তা, জগন্নাথ!', E'সকল ছাডিয়া, আসিয়াছি আমি,
তোমার চরণে নাথ!
আমি নিত্য-দাস, তুমি পালয়িতা,
তুমি গোপ্তা, জগন্নাথ!',
    E'sakala
chāḍiyā, āsiyāchi āmi,
tomāra
caraṇe nātha!
āmi
nitya-dāsa, tumi pālayitā,
tumi
goptā, jagannātha!', E'сакала
чха̄д̣ійа̄, а̄сійа̄чхі а̄мі,
тома̄ра
чаран̣е на̄тха!
а̄мі
нітйа-да̄са, тумі па̄лайіта̄,
тумі
ґопта̄, джаґанна̄тха!',
    E'', E'',
    E'I
have given up everything and come to Your lotus feet. I am Your eternal
servant, and You are my protector and maintainer, O Lord of the universe!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'তোমার সকল, আমি মাত্র দাস,
আমার তারিবে তুমি
তোমার চরণ, করিনু বরণ,
আমার নাহি তো'' আমি', E'তোমার সকল, আমি মাত্র দাস,
আমার তারিবে তুমি
তোমার চরণ, করিনু বরণ,
আমার নাহি তো'' আমি',
    E'tomāra
sakala, āmi mātra dāsa,
āmāra
tāribe tumi
tomāra
caraṇa, korinu varaṇa,
āmāra
nāhi to'' āmi', E'тома̄ра
сакала, а̄мі ма̄тра да̄са,
а̄ма̄ра
та̄рібе тумі
тома̄ра
чаран̣а, коріну варан̣а,
а̄ма̄ра
на̄хі то'' а̄мі',
    E'', E'',
    E'Everything is Yours. I am merely a servant, certain that You will deliver me. I
have chosen Your lotus feet as my only shelter. I no longer belong to myself.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'ভকতিবিনোদ, কাঁদিয়া শরণ,
ল''য়েছে তোমার পায়
ক্ষমি'' অপরাধ, নামে রুচি দিয়া,
পালন করহে তায়', E'ভকতিবিনোদ, কাঁদিয়া শরণ,
ল''য়েছে তোমার পায়
ক্ষমি'' অপরাধ, নামে রুচি দিয়া,
পালন করহে তায়',
    E'bhakativinoda,
kāńdiyā śaraṇa,
lo''yeche
tomāra pāy
kṣami''
aparādha, nāme ruci diyā,
pālana
korohe tāy', E'бгакатівінода,
ка̄ńдійа̄ ш́аран̣а,
ло''йечхе
тома̄ра па̄й
кшамі''
апара̄дга, на̄ме ручі дійа̄,
па̄лана
корохе та̄й',
    E'', E'',
    E'Weeping, Bhaktivinoda takes shelter at Your feet. Forgive his offenses, afford
him a taste for the holy name, and kindly maintain him.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 4, Song 2: Dara Putra Nijo Deho
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Dara Putra Nijo Deho', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'দারা-পুত্র-নিজ-দেহ-কুটুম্ব-পালনে
সর্বদা ব্যাকুল আমি ছিনু মনে মনে', E'দারা-পুত্র-নিজ-দেহ-কুটুম্ব-পালনে
সর্বদা ব্যাকুল আমি ছিনু মনে মনে',
    E'dārā-putra-nija-deho-kuṭumba-pālane
sarvadā
vyākula āmi chinu mane mane', E'да̄ра̄-путра-ніджа-дехо-кут̣умба-па̄лане
сарвада̄
вйа̄кула а̄мі чхіну мане мане',
    E'', E'',
    E'Within my heart I have always been anxious for the maintenance of my wife and
children, my own body and relatives.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'কেমনে অর্জিব অর্থ, যশ কিসে পাব
কন্যা-পুত্র-বিবাহ কেমনে সম্পাদিব', E'কেমনে অর্জিব অর্থ, যশ কিসে পাব
কন্যা-পুত্র-বিবাহ কেমনে সম্পাদিব',
    E'kemone
arjibo artha, yaśa kise pābo
kanyā-putra-vivāha
kemone sampādibo', E'кемоне
арджібо артха, йаш́а кісе па̄бо
канйа̄-путра-віва̄ха
кемоне сампа̄дібо',
    E'', E'',
    E'How
will I earn money? How will I obtain fame? How will I arrange the marriages of
my sons and daughter?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'এবে আত্ম-সমর্পনে চিন্তা নাহি আর
তুমি নির্বাহিবে প্রভু, সংসার তোমার', E'এবে আত্ম-সমর্পনে চিন্তা নাহি আর
তুমি নির্বাহিবে প্রভু, সংসার তোমার',
    E'ebe
ātma-samarpane cintā nāhi ār
tumi
nirvāhibe prabhu, saḿsāra tomār', E'ебе
а̄тма-самарпане чінта̄ на̄хі а̄р
тумі
нірва̄хібе прабгу, саḿса̄ра тома̄р',
    E'', E'',
    E'Now, through self-surrender, I have been purged of all anxiety. O Lord, surely
You will provide for the maintenance of Your household.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'তুমি তো পালিবে মোরে নিজ-দাস জানি
তোমার সেবায় প্রভু বড় সুখ মানি', E'তুমি তো পালিবে মোরে নিজ-দাস জানি
তোমার সেবায় প্রভু বড় সুখ মানি',
    E'tumi
to'' pālibe more nija-dāsa jāni''
tomāra
sevāya prabhu boḍo sukha māni', E'тумі
то'' па̄лібе море ніджа-да̄са джа̄ні''
тома̄ра
сева̄йа прабгу бод̣о сукха ма̄ні',
    E'', E'',
    E'Surely You will preserve me, knowing me to be Your own servant. O Lord, in Your
devotional service I feel great happiness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'তোমার ইচ্ছয় প্রভু সব কার্য হয়
জীব বলে,-করি আমি'', সে তো'' সত্য নয়', E'তোমার ইচ্ছয় প্রভু সব কার্য হয়
জীব বলে,-করি আমি'', সে তো'' সত্য নয়',
    E'tomāra
icchaya prabhu sab kārya hoy
jīva
bole,`kori āmi'', se to'' satya noy', E'тома̄ра
іччхайа прабгу саб ка̄рйа хой
джı̄ва
боле,`корі а̄мі'', се то'' сатйа ной',
    E'', E'',
    E'All
events take place by Your will, O Lord. The deluded soul of this world
declares, I am the doer, but this is pure folly.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'জীব কি করিতে পরে, তুমি না করিলে?
আশা-মাত্র জীব করে, তব ইচ্ছা-ফলে', E'জীব কি করিতে পরে, তুমি না করিলে?
আশা-মাত্র জীব করে, তব ইচ্ছা-ফলে',
    E'jīva
ki korite pare, tumi nā korile?
āśā-mātra
jīva kore, tava icchā-phale', E'джı̄ва
кі коріте паре, тумі на̄ коріле?
а̄ш́а̄-ма̄тра
джı̄ва коре, тава іччха̄-пхале',
    E'', E'',
    E'If
You do not act first, then what is a tiny soul actually able to do? By Your
will he can only desire to act, and unless You fulfill his desire, he cannot do
anything.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'নিশ্চিন্ত হৈয়া আমি সেবিব তোমায়
গৃহে ভাল-মন্দ হ''লে নাহি মোর দায়', E'নিশ্চিন্ত হৈয়া আমি সেবিব তোমায়
গৃহে ভাল-মন্দ হ''লে নাহি মোর দায়',
    E'niścinta
hoiyā āmi sevibo tomāy
gṛhe
bhālo-manda ho''le nāhi mora dāy', E'ніш́чінта
хоійа̄ а̄мі севібо тома̄й
ґр̣хе
бга̄ло-манда хо''ле на̄хі мора да̄й',
    E'', E'',
    E'I
will serve You free from all anxiety, and at home, if any good or evil should
occur, it will not be my responsibility.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'ভকতিবিনোদ নিজ-স্বাতন্ত্র্য ত্যজিয়া
তোমার চরণ সেবে'' অকিঞ্চন হৈয়া', E'ভকতিবিনোদ নিজ-স্বাতন্ত্র্য ত্যজিয়া
তোমার চরণ সেবে'' অকিঞ্চন হৈয়া',
    E'bhakativinoda
nija-swātantrya tyajiyā
tomāra
caraṇa seve'' akiñcana hoiyā', E'бгакатівінода
ніджа-сва̄тантрйа тйаджійа̄
тома̄ра
чаран̣а севе'' акін̃чана хоійа̄',
    E'', E'',
    E'Bhaktivinoda thus gives up his independence and engages in the exclusive
service of Your lotus feet with no other interest in life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 4, Song 3: Sarvasva Tomar Carane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Sarvasva Tomar Carane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'সর্বস্ব তোমার, চরণে সঁপিয়া,
পড়েছি তোমার ঘরে
তুমি তো'' ঠাকুর, তোমার কুকুর,
বলিয়া জানহ মোরে', E'সর্বস্ব তোমার, চরণে সঁপিয়া,
পড়েছি তোমার ঘরে
তুমি তো'' ঠাকুর, তোমার কুকুর,
বলিয়া জানহ মোরে',
    E'sarvasva
tomār, caraṇe saḿpiyā,
poḍechi
tomāra ghare
tumi
to'' ṭhākur, tomāra kukur,
boliyā
jānaho more', E'сарвасва
тома̄р, чаран̣е саḿпійа̄,
под̣ечхі
тома̄ра ґгаре
тумі
то'' т̣ха̄кур, тома̄ра кукур,
болійа̄
джа̄нахо море',
    E'', E'',
    E'Now
that I have surrendered all I possess, I fall prostrate before Your house. You
are the Supreme Lord. Kindly consider me Your household dog.', E'',
    E'', E'У своєму поясненні до **«Чайтанья-чарітамріта»**, Антья-ліла 1.24, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Тому Шріла Бгактівінод Тхакур співав: *тумі та'' тхакура, томара куккура, баліййа джанаха море*. Так він пропонує стати собакою вайшнава. Є багато інших прикладів, коли домашня тварина вайшнава була повернута додому, до Вайкунтхалоки».',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'বাঙ্ধিয়া নিকটে, আমারে পালিবে,
রহিব তোমার দ্বারে
প্রতীপ-জনেরে, আসিতে না দিব,
রাখিব গড়ের পারে', E'বাঙ্ধিয়া নিকটে, আমারে পালিবে,
রহিব তোমার দ্বারে
প্রতীপ-জনেরে, আসিতে না দিব,
রাখিব গড়ের পারে',
    E'bāńdhiyā
nikaṭe, āmāre pālibe,
rohibo
tomāra dwāre
pratīpa-janere,
āsite nā dibo,
rākhibo
gaḍera pāre', E'ба̄ńдгійа̄
нікат̣е, а̄ма̄ре па̄лібе,
рохібо
тома̄ра два̄ре
пратı̄па-джанере,
а̄сіте на̄ дібо,
ра̄кхібо
ґад̣ера па̄ре',
    E'', E'',
    E'Chain me nearby and maintain me as You will. I shall remain at the doorstep and
allow no enemies to enter Your house. I will keep them at the bounds of the
moat surrounding Your home.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'তব নিজ-জন, প্রসাদ সেবিয়া,
উচ্ছিষ্ট রাখিবে যাহা
আমার ভোজন, পরম-আনন্দে,
প্রতি-দিন হ''বে তাহা', E'তব নিজ-জন, প্রসাদ সেবিয়া,
উচ্ছিষ্ট রাখিবে যাহা
আমার ভোজন, পরম-আনন্দে,
প্রতি-দিন হ''বে তাহা',
    E'tava
nija-jana, prasād seviyā,
ucchiṣṭa
rākhibe jāhā
āmāra
bhojan, parama-ānande,
prati-din
ha''be tāhā', E'тава
ніджа-джана, праса̄д севійа̄,
уччхішт̣а
ра̄кхібе джа̄ха̄
а̄ма̄ра
бгоджан, парама-а̄нанде,
праті-дін
ха''бе та̄ха̄',
    E'', E'',
    E'Whatever remnants Your devotees leave behind after honoring Your prasada will
be my daily sustenance. I will feast on those remnants with great ecstasy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'বসিয়া শুইয়া, তোমার চরণ,
চিন্তিব সতত আমি
নাচিতে নাচিতে, নিকটে যাইব,
যখন ড়াকিবে তুমি', E'বসিয়া শুইয়া, তোমার চরণ,
চিন্তিব সতত আমি
নাচিতে নাচিতে, নিকটে যাইব,
যখন ড়াকিবে তুমি',
    E'bosiyā
śuiyā, tomāra caraṇa,
cintibo
satata āmi
nācite
nācite, nikaṭe jāibo,
jakhona
ḍākibe tumi', E'босійа̄
ш́уійа̄, тома̄ра чаран̣а,
чінтібо
сатата а̄мі
на̄чіте
на̄чіте, нікат̣е джа̄ібо,
джакхона
д̣а̄кібе тумі',
    E'', E'',
    E'While sitting up, while lying down, I will constantly meditate on Your lotus
feet. Whenever You call, I will immediately run to You and dance in rapture.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'নিজের পোষন, কভু না ভাবিব,
রহিব ভাবের ভরে
ভকতিবিনোদ, তোমারে পালক,
বলিয়া বরণ করে', E'নিজের পোষন, কভু না ভাবিব,
রহিব ভাবের ভরে
ভকতিবিনোদ, তোমারে পালক,
বলিয়া বরণ করে',
    E'nijera
poṣana, kabhu nā bhāvibo,
rohibo
bhāvera bhore
bhakativinoda,
tomāre pālaka,
boliyā
varaṇa kore', E'ніджера
пошана, кабгу на̄ бга̄вібо,
рохібо
бга̄вера бгоре
бгакатівінода,
тома̄ре па̄лака,
болійа̄
варан̣а коре',
    E'', E'',
    E'I
will never think of my own maintenance but rather remain transported by a
multitude of ecstasies. Bhaktivinoda accepts You as his only support.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 4, Song 4: Tumi Sarveswareswara Vrajendra Kumar
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Tumi Sarveswareswara Vrajendra Kumar', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'তুমি সর্বেশ্বরেশ্বর, ব্রজেন্দ্র-কুমার!
তোমার ইচ্ছায় বিশ্বে সৃজন সংহার', E'তুমি সর্বেশ্বরেশ্বর, ব্রজেন্দ্র-কুমার!
তোমার ইচ্ছায় বিশ্বে সৃজন সংহার',
    E'tumi
sarveśvareśvara, brajendra-kumāra!
tomāra icchāya viśve sṛjana saḿhāra', E'тумі
сарвеш́вареш́вара, браджендра-кума̄ра!
тома̄ра іччха̄йа віш́ве ср̣джана саḿха̄ра',
    E'', E'',
    E'O
youthful son of the King of Vraja, You are Lord of all lords. According to Your
will, creation and destruction take place in the universe.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'তব ইচ্ছা-মত ব্রহ্মা করেন সৃজন
তব ইচ্ছা-মত বিষ্নু করেন পালন', E'তব ইচ্ছা-মত ব্রহ্মা করেন সৃজন
তব ইচ্ছা-মত বিষ্নু করেন পালন',
    E'tava
icchā-mato brahmā korena sṛjana
tava icchā-mato viṣnu korena pālana', E'тава
іччха̄-мато брахма̄ корена ср̣джана
тава іччха̄-мато вішну корена па̄лана',
    E'', E'',
    E'According to Your will Lord Brahma creates, and according to Your will Lord
Visnu maintains.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'তব ইচ্ছা-মতে শিব করেন সংহার
তব ইচ্ছা-মতে মায়া সৃজে কারাগার', E'তব ইচ্ছা-মতে শিব করেন সংহার
তব ইচ্ছা-মতে মায়া সৃজে কারাগার',
    E'tava
icchā-mate śiva korena saḿhāra
tava icchā-mate māyā sṛje kārāgāra', E'тава
іччха̄-мате ш́іва корена саḿха̄ра
тава іччха̄-мате ма̄йа̄ ср̣дже ка̄ра̄ґа̄ра',
    E'', E'',
    E'According to Your will Lord Siva destroys, and according to Your will Maya
constructs the prison house of this world.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'তব ইচ্ছা-মতে জীবের জনম-মরণ
সমৃদ্ধি-নিপাতে দুঃখ সুখ-সংঘটন', E'তব ইচ্ছা-মতে জীবের জনম-মরণ
সমৃদ্ধি-নিপাতে দুঃখ সুখ-সংঘটন',
    E'tava
icchā-mate jīver janama-maraṇa
samṛddhi-nipāte duḥkha sukha-saḿghaṭana', E'тава
іччха̄-мате джı̄вер джанама-маран̣а
самр̣ддгі-ніпа̄те дух̣кха сукха-саḿґгат̣ана',
    E'', E'',
    E'According to Your will the living beings take birth and die, and according to
Your will they meet with prosperity and ruin, happiness and sorrow.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'মিছে মায়া-বদ্ধ জীব আশা-পাশে ফিরে
তব ইচ্ছা বিনা কিছু করিতে না পারে', E'মিছে মায়া-বদ্ধ জীব আশা-পাশে ফিরে
তব ইচ্ছা বিনা কিছু করিতে না পারে',
    E'miche
māyā-baddha jīva āśā-pāśe phire''
tava icchā binā kichu korite nā pāre', E'мічхе
ма̄йа̄-баддга джı̄ва а̄ш́а̄-па̄ш́е пхіре''
тава іччха̄ біна̄ кічху коріте на̄ па̄ре',
    E'', E'',
    E'The
tiny soul bound up by Maya vainly struggles in the fetters of worldly desire.
Without Your sanction he is unable to do anything.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'তুমি তো রাখক আর পালক আমার
তোমার চরণ বিনা আশা নাহি আর', E'তুমি তো রাখক আর পালক আমার
তোমার চরণ বিনা আশা নাহি আর',
    E'tumi
to'' rākhaka ār pālaka āmāra
tomāra caraṇa binā āśā nāhi āra', E'тумі
то'' ра̄кхака а̄р па̄лака а̄ма̄ра
тома̄ра чаран̣а біна̄ а̄ш́а̄ на̄хі а̄ра',
    E'', E'',
    E'You
are my only protector and maintainer. Except for Your lotus feet there is no
other hope for me.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'নিজ-বল-চেষ্টা-প্রতি ভরসা ছাড়িয়া
তোমার ইচ্ছায় আছি নির্ভর করিয়া', E'নিজ-বল-চেষ্টা-প্রতি ভরসা ছাড়িয়া
তোমার ইচ্ছায় আছি নির্ভর করিয়া',
    E'nija-bala-ceṣṭā-prati
bharasā chāḍiyā
tomāra icchāya āchi nirbhara koriyā', E'ніджа-бала-чешт̣а̄-праті
бгараса̄ чха̄д̣ійа̄
тома̄ра іччха̄йа а̄чхі нірбгара корійа̄',
    E'', E'',
    E'No
longer confident of my own strength and endeavor, I have become solely
dependent on Your will.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'ভকতিবিনোদ অতি দীন অকিঞ্চন
তোমার ইচ্ছায় তা''র জীবন মরণ', E'ভকতিবিনোদ অতি দীন অকিঞ্চন
তোমার ইচ্ছায় তা''র জীবন মরণ',
    E'bhakativinoda
ati dīna akiñcana
tomāra icchāya tā''r jīvana maraṇa', E'бгакатівінода
аті дı̄на акін̃чана
тома̄ра іччха̄йа та̄''р джı̄вана маран̣а',
    E'', E'',
    E'Bhaktivinoda is most poor, and his pride has been leveled. Now in accordance
with Your will he lives and dies.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 5, Song 1: Ekhona Bujhinu
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Ekhona Bujhinu', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'এখোন বুঝিনু প্রভু! তোমার চরণ
অশোকাভয়ামৃত-পূর্ণ সর্ব-ক্ষন', E'এখোন বুঝিনু প্রভু! তোমার চরণ
অশোকাভয়ামৃত-পূর্ণ সর্ব-ক্ষন',
    E'ekhona
bujhinu prabhu! tomāra caraṇa
aśokābhoyāmṛta-pūrṇa
sarva-kṣana', E'екхона
буджхіну прабгу! тома̄ра чаран̣а
аш́ока̄бгойа̄мр̣та-пӯрн̣а
сарва-кшана',
    E'', E'',
    E'I
know now Your divine feet are a refuge free from all sorrow and fear, eternally
full of sweet nectar.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'সকল ছাড়িয়া তুয়া চরণ-কমলে
পড়িয়াছি আমি নাথ! তব পদ-তলে', E'সকল ছাড়িয়া তুয়া চরণ-কমলে
পড়িয়াছি আমি নাথ! তব পদ-তলে',
    E'sakala
chāḍiyā tuwā caraṇa-kamale
poḍiyāchi
āmi nātha! tava pada-tale', E'сакала
чха̄д̣ійа̄ тува̄ чаран̣а-камале
под̣ійа̄чхі
а̄мі на̄тха! тава пада-тале',
    E'', E'',
    E'At
the soles of those lotus feet I surrender myself and all I possess.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'তব পাদ-পদ্ম নাথ! রক্ষিবে আমারে
আর রক্ষা-কর্তা নাহি এ ভব-সংসারে', E'তব পাদ-পদ্ম নাথ! রক্ষিবে আমারে
আর রক্ষা-কর্তা নাহি এ ভব-সংসারে',
    E'tava
pāda-padma nāth! rokṣibe āmāre
ār
rakṣā-kartā nāhi e bhava-saḿsāre', E'тава
па̄да-падма на̄тх! рокшібе а̄ма̄ре
а̄р
ракша̄-карта̄ на̄хі е бгава-саḿса̄ре',
    E'', E'',
    E'O
Lord, there is no other protection but You in this world of birth and death.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'আমি তব নিত্য-দাস-জানিনু এ-বার
আমার পালন-ভার এখোন তোমার', E'আমি তব নিত্য-দাস-জানিনু এ-বার
আমার পালন-ভার এখোন তোমার',
    E'āmi
tava nitya-dāsajāninu e-bāra
āmāra
pālana-bhāra ekhona tomāra', E'а̄мі
тава нітйа-да̄саджа̄ніну е-ба̄ра
а̄ма̄ра
па̄лана-бга̄ра екхона тома̄ра',
    E'', E'',
    E'At
last I know myself to be Your eternal servant, whose maintenance You have
assured.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'বড় দুঃখ পাইয়াছি স্বতন্ত্র জীবনে
দুঃখ দূরে গেল ও পদ-বরণে', E'বড় দুঃখ পাইয়াছি স্বতন্ত্র জীবনে
দুঃখ দূরে গেল ও পদ-বরণে',
    E'baḍo
duḥkha pāiyāchi swatantra jīvane
duḥkha
dūre gelo o pada-varaṇe', E'бад̣о
дух̣кха па̄ійа̄чхі сватантра джı̄ване
дух̣кха
дӯре ґело о пада-варан̣е',
    E'', E'',
    E'Life before, without You, held nothing but sorrow. Now I live free from all
misery', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'যে-পদ লাগিয়া রমা তপস্য করিলা
যে-পদ পাইয়া শিব শিবত্ব লোভিলা', E'যে-পদ লাগিয়া রমা তপস্য করিলা
যে-পদ পাইয়া শিব শিবত্ব লোভিলা',
    E'je-pada
lāgiyā ramā tapasya korilā
je-pada
pāiyā śiva śivatwa lobhilā', E'дже-пада
ла̄ґійа̄ рама̄ тапасйа коріла̄
дже-пада
па̄ійа̄ ш́іва ш́іватва лобгіла̄',
    E'', E'',
    E'Laksmi, desiring such a place at Your lotus feet, executed austerities. Only
after securing a place by Your lotus feet did Lord Siva attain his sivatva, or
quality of auspiciousness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'যে-পদ লভিয়া ব্রহ্মা কৃতার্থ হৈলা
যে-পদ নারদ মুনি হৃদয়ে ধরিলা', E'যে-পদ লভিয়া ব্রহ্মা কৃতার্থ হৈলা
যে-পদ নারদ মুনি হৃদয়ে ধরিলা',
    E'je-pada
labhiyā brahmā kṛtārtha hoilā
je-pada
nārada muni hṛdoye dhorilā', E'дже-пада
лабгійа̄ брахма̄ кр̣та̄ртха хоіла̄
дже-пада
на̄рада муні хр̣дойе дгоріла̄',
    E'', E'',
    E'Upon obtaining those feet Lord Brahma became successful in life, and the great
sage Narada Muni held those two feet to his heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'সেই সে অভয় পদ শিরেতে ধরিয়া
পরম-আনন্দে নাচি পদ-গুন গাইয়া', E'সেই সে অভয় পদ শিরেতে ধরিয়া
পরম-আনন্দে নাচি পদ-গুন গাইয়া',
    E'sei
se abhoya pada śirete dhoriyā
parama-ānande
nāci pada-guna gāiyā', E'сеі
се абгойа пада ш́ірете дгорійа̄
парама-а̄нанде
на̄чі пада-ґуна ґа̄ійа̄',
    E'', E'',
    E'Your lotus feet drive away all fear. Having held them to my head, I dance in
great ecstasy, singing their glories.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'সংসার-বিপদ হতে অবশ্য উদ্ধার
ভকতিবিনোদ, ও-পদ করিবে তোমার', E'সংসার-বিপদ হতে অবশ্য উদ্ধার
ভকতিবিনোদ, ও-পদ করিবে তোমার',
    E'saḿsāra-vipada
ho''te avaśya uddhār
bhakativinoda,
o-pada koribe tomār', E'саḿса̄ра-віпада
хо''те аваш́йа уддга̄р
бгакатівінода,
о-пада корібе тома̄р',
    E'', E'',
    E'Your lotus feet will deliver Bhaktivinoda from the perils of worldly journey.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 5, Song 2: Tumi To Maribe Jare
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Tumi To Maribe Jare', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'তুমি তো মারিবে যারে, কে তারে রাখিতে পারে,
ইচ্ছা-বশ ত্রিভুবন
ব্রহ্মা-আদি দেব-গণ, তব দাস অগনণ,
করে তব আজ্ঞার পালন', E'তুমি তো'' মারিবে যারে, কে তারে রাখিতে পারে,
ইচ্ছা-বশ ত্রিভুবন
ব্রহ্মা-আদি দেব-গণ, তব দাস অগনণ,
করে তব আজ্ঞার পালন',
    E'tumi
to'' māribe jāre, ke tāre rākhite pāre,
icchā-baśa
tribhuvan
brahmā-ādi
deva-gaṇa, tava dāsa aganaṇa,
kore
tava ājñāra pālan', E'тумі
то'' ма̄рібе джа̄ре, ке та̄ре ра̄кхіте па̄ре,
іччха̄-баш́а
трібгуван
брахма̄-а̄ді
дева-ґан̣а, тава да̄са аґанан̣а,
коре
тава а̄джн̃а̄ра па̄лан',
    E'', E'',
    E'Who can protect that person whom You wish to slay? The three worlds are
obedient to Your will. The gods, headed by Brahma, are Your countless servants
and stand ready to execute Your command,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'তব ইচ্ছা-মতে যত, গ্রহ-গণ অবিরত,
শুভাশুভ ফল করে দান
রোগ-শোক-মৃতি-ভয়, তব ইচ্ছা-মতে হয়,
তব আজ্ঞা সদা বলবান', E'তব ইচ্ছা-মতে যত, গ্রহ-গণ অবিরত,
শুভাশুভ ফল করে দান
রোগ-শোক-মৃতি-ভয়, তব ইচ্ছা-মতে হয়,
তব আজ্ঞা সদা বলবান',
    E'tava
icchā-mate jata, graha-gaṇa avirata,
śubhāśubha
phala kore dān
roga-śoka-mṛti-bhoy,
tava icchā-mate hoy,
tava
ājñā sadā balavān', E'тава
іччха̄-мате джата, ґраха-ґан̣а авірата,
ш́убга̄ш́убга
пхала коре да̄н
роґа-ш́ока-мр̣ті-бгой,
тава іччха̄-мате хой,
тава
а̄джн̃а̄ сада̄ балава̄н',
    E'', E'',
    E'By Your will the planets exercise their auspicious or inauspicious influences.
Illness, grief, death, and fear occur by Your will. Your command is
all-powerful.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'তব ভয়ে বায়ু বয়, চন্দ্র সূর্য সমুদয়,
স্ব-স্ব নিয়মিত কর্য করে
তুমি তো'' পরমেশ্বর, পর-ব্রহ্ম পরাত্পর,
তব বাস ভকত-অন্তরে', E'তব ভয়ে বায়ু বয়, চন্দ্র সূর্য সমুদয়,
স্ব-স্ব নিয়মিত কর্য করে
তুমি তো'' পরমেশ্বর, পর-ব্রহ্ম পরাত্পর,
তব বাস ভকত-অন্তরে',
    E'tava
bhoye vāyu boy, candra sūrya samudoy,
swa-swa
niyamita karya kore
tumi
to'' parameśwar, para-brahma parātpar,
tava
bāsa bhakata-antare', E'тава
бгойе ва̄йу бой, чандра сӯрйа самудой,
сва-сва
нійаміта карйа коре
тумі
то'' парамеш́вар, пара-брахма пара̄тпар,
тава
ба̄са бгаката-антаре',
    E'', E'',
    E'In fear of You the wind blows, and the sun, moon, and all others perform their
allotted duties. You are the Supreme Lord, the Supreme Spirit, supreme above
all. Your residence is in the heart of Your loving devotee.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'সদা-শুদ্ধ সিদ্ধ-কাম, ভকত-বত্সল নাম,
ভকত-জনের নিত্য-স্বামী
তুমি তো'' রাখিবে যারে, কে তারে মারিতে পারে,
সকল বিধির বিধি তুমি', E'সদা-শুদ্ধ সিদ্ধ-কাম, ভকত-বত্সল'' নাম,
ভকত-জনের নিত্য-স্বামী
তুমি তো'' রাখিবে যারে, কে তারে মারিতে পারে,
সকল বিধির বিধি তুমি',
    E'sadā-śuddha
siddha-kāma, `bhakata-vatsala'' nāma,
bhakata-janera
nitya-swāmī
tumi
to'' rākhibe jāre, ke tāre mārite pāre,
sakala
vidhira vidhi tumi', E'сада̄-ш́уддга
сіддга-ка̄ма, `бгаката-ватсала'' на̄ма,
бгаката-джанера
нітйа-сва̄мı̄
тумі
то'' ра̄кхібе джа̄ре, ке та̄ре ма̄ріте па̄ре,
сакала
відгіра відгі тумі',
    E'', E'',
    E'You are eternally pure. All Your desires are fulfilled. Your name is
Bhakta-vatsala, for You are very affectionate to the Vaisnavas. You are the eternal
Lord of Your loving devotees. Who can slay that person whom You wish to
protect? You are the law of all laws.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'তোমার চরণে নাথ! করিয়াছে প্রনিপাত,
ভকতিবিনোদ তব দাস
বিপদ হৈতে স্বামী! অবশ্য তাহারে তুমি,
রক্ষিবে,-তাহার এ বিশ্বাস', E'তোমার চরণে নাথ! করিয়াছে প্রনিপাত,
ভকতিবিনোদ তব দাস
বিপদ হৈতে স্বামী! অবশ্য তাহারে তুমি,
রক্ষিবে,-তাহার এ বিশ্বাস',
    E'tomāra
caraṇe nātha! koriyāche pranipāta,
bhakativinoda
tava dās
vipada
hoite swāmī! avaśya tāhāre tumi,
rakṣibe,tāhāra
e viśvās', E'тома̄ра
чаран̣е на̄тха! корійа̄чхе праніпа̄та,
бгакатівінода
тава да̄с
віпада
хоіте сва̄мı̄! аваш́йа та̄ха̄ре тумі,
ракшібе,та̄ха̄ра
е віш́ва̄с',
    E'', E'',
    E'O Lord, Your eternal servant Bhaktivinoda has bowed down at Your lotus feet. O
master, he cherishes the faith that You will surely protect him from all
dangers.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 5, Song 3: Atma Samarpane Gela Abhiman
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Atma Samarpane Gela Abhiman', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'আত্ম-সমর্পনে গেলা অভিমান
নাহি করবুঁ নিজ রখা-বিধান', E'আত্ম-সমর্পনে গেলা অভিমান
নাহি করবুঁ নিজ রখা-বিধান',
    E'ātma-samarpane
gelā abhimān
nāhi
korobuń nija rakhā-vidhān', E'а̄тма-самарпане
ґела̄ абгіма̄н
на̄хі
коробуń ніджа ракха̄-відга̄н',
    E'', E'',
    E'Surrendering to You lifted from me the burden of false pride. No longer will I
try to secure my own well-being.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'তুয়া ধন জানি তুহুঁ রাখবি, নাথ!
পাল্য় গোধন জ্ঞান করি তুয়া সাথ', E'তুয়া ধন জানি তুহুঁ রাখবি, নাথ!
পাল্য় গোধন জ্ঞান করি তুয়া সাথ',
    E'tuwā
dhana jāni'' tuhuń rākhobi, nāth!
pālya
godhana jñāna kori'' tuwā sāth', E'тува̄
дгана джа̄ні'' тухуń ра̄кхобі, на̄тх!
па̄лйа
ґодгана джн̃а̄на корі'' тува̄ са̄тх',
    E'', E'',
    E'O
Lord, I am confident of Your protection, for, like one of Your cows or calves,
I am Your treasured property.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'চরায়বি মাধব! জামুন-তীরে
বংশী বাজায়ত ডাকবি ধীরে', E'চরায়বি মাধব! জামুন-তীরে
বংশী বাজায়ত ডাকবি ধীরে',
    E'carāobi
mādhava! jāmuna-tīre
baḿśī
bājāoto ḍākobi
dhīre', E'чара̄обі
ма̄дгава! джа̄муна-тı̄ре
баḿш́ı̄
ба̄джа̄ото д̣а̄кобі
дгı̄ре',
    E'', E'',
    E'O
Madhava, I see You leading Your herds to pasture on the banks of the Yamuna.
You call to them by gently playing Your flute.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'অঘ-বক মারত রখা-বিধান
করবি সদা তুহুঁ গোকুল-কান!', E'অঘ-বক মারত রখা-বিধান
করবি সদা তুহুঁ গোকুল-কান!',
    E'agha-baka
mārato rakhā-vidhān
korobi
sadā tuhuń gokula-kān!', E'аґга-бака
ма̄рато ракха̄-відга̄н
коробі
сада̄ тухуń ґокула-ка̄н!',
    E'', E'',
    E'By
slaying giant demons such as Agha and Baka You will always provide full
protection, O Gokula Kana!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'রখা করবি তুহুঁ নিশ্চয় জানি
পান করবুঁ হাম জামুন-পানি', E'রখা করবি তুহুঁ নিশ্চয় জানি
পান করবুঁ হাম জামুন-পানি',
    E'rakhā
korobi tuhuń niścoy jāni
pāna
korobuń hāma jāmuna-pāni', E'ракха̄
коробі тухуń ніш́чой джа̄ні
па̄на
коробуń ха̄ма джа̄муна-па̄ні',
    E'', E'',
    E'Fearless and confident of Your protection, I will drink the water of the
Yamuna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'কালিয়-দোখ করবি বিনাশা
শোধোবি নদী-জল, বাড়াওবি আশা', E'কালিয়-দোখ করবি বিনাশা
শোধোবি নদী-জল, বাড়াওবি আশা',
    E'kāliya-dokha
korobi vināśā
śodhobi
nadī-jala, bāḍāobi āśā', E'ка̄лійа-докха
коробі віна̄ш́а̄
ш́одгобі
надı̄-джала, ба̄д̣а̄обі а̄ш́а̄',
    E'', E'',
    E'The
Kaliya serpent''s venom poisoned the Yamuna''s waters, yet that poison will not
act. You will purify the Yamuna and by such heroic deeds enhance our faith.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'পিয়ত দাবানল রাখবি ময়
গোপাল, গোবিন্দ নাম তব হয়', E'পিয়ত দাবানল রাখবি ময়
গোপাল, গোবিন্দ নাম তব হয়',
    E'piyato
dāvānala rākhobi mo''y
`gopāla'',
`govinda'' nāma tava hoy', E'пійато
да̄ва̄нала ра̄кхобі мо''й
`ґопа̄ла'',
`ґовінда'' на̄ма тава хой',
    E'', E'',
    E'You
who are called Govinda and Gopala will surely protect me by swallowing the
forest fire.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'সুর-পতি-দুর্মতি-নাশ বিচারি
রাখবি বর্ষনে, গিরি-বর-ধারি!', E'সুর-পতি-দুর্মতি-নাশ বিচারি
রাখবি বর্ষনে, গিরি-বর-ধারি!',
    E'sura-pati-durmati-nāśa
vicāri''
rākhobi
varṣane, giri-vara-dhāri!', E'сура-паті-дурматі-на̄ш́а
віча̄рі''
ра̄кхобі
варшане, ґірі-вара-дга̄рі!',
    E'', E'',
    E'When Indra, king of the gods, sends torrents of rain, You will counteract his
malice and protect us by lifting the mighty Govardhana Hill!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'চতুর-আনন করব যব চোরি
রখা করবি মুঝে, গোকুল-হরি!', E'চতুর-আনন করব যব চোরি
রখা করবি মুঝে, গোকুল-হরি!',
    E'catur-ānana
korabo jab cori
rakhā
korobi mujhe, gokula-hari!', E'чатур-а̄нана
корабо джаб чорі
ракха̄
коробі муджхе, ґокула-харі!',
    E'', E'',
    E'When the four-headed Brahma steals Your cowherd boyfriends and calves, then,
too, You will surely protect me, O Gokula Hari!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 10
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '10',
    E'ভকতিবিনোদ-তুয়া গোকুল-ধন
রাখবি কেশব! করত যতন', E'ভকতিবিনোদ-তুয়া গোকুল-ধন
রাখবি কেশব! করত যতন',
    E'bhakativinodatuwā
gokula-dhan
rākhobi
keśava! korato jatan', E'бгакатівінодатува̄
ґокула-дган
ра̄кхобі
кеш́ава! корато джатан',
    E'', E'',
    E'Bhakativinoda is now the property of Gokula, Your holy abode, O Kesava, kindly
protect him with care.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 5, Song 4: Chorato Purusa Abhiman
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Chorato Purusa Abhiman', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'ছোড়ত পুরুষ-অভিমান
কিঙ্করী হৈলুঁ আজি, কান!', E'ছোড়ত পুরুষ-অভিমান
কিঙ্করী হৈলুঁ আজি, কান!',
    E'choḍato
puruṣa-abhimān
kińkorī
hoiluń āji, kān!', E'чход̣ато
пуруша-абгіма̄н
кіńкорı̄
хоілуń а̄джі, ка̄н!',
    E'', E'',
    E'Gone is the vanity of male egoism, O Kana. Now I am Your faithful maidservant.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'বরজ-বিপিনে সখী-সাথ
সেবন করবুঁ, রাধা-নাথ!', E'বরজ-বিপিনে সখী-সাথ
সেবন করবুঁ, রাধা-নাথ!',
    E'baraja-bipine
sakhī-sāth
sevana
korobuń, rādhā-nāth!', E'бараджа-біпіне
сакхı̄-са̄тх
севана
коробуń, ра̄дга̄-на̄тх!',
    E'', E'',
    E'O
Lord of Radha, in the groves of Vraja I will perform devotional service as a
follower of one of the sakhis.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'কুসুমে গাঁথোবুঁ হার
তুলসী-মণি-মঞ্জরী তার', E'কুসুমে গাঁথোবুঁ হার
তুলসী-মণি-মঞ্জরী তার',
    E'kusume
gāńthobuń hār
tulasī-maṇi-mañjarī
tār', E'кусуме
ґа̄ńтхобуń ха̄р
туласı̄-ман̣і-ман̃джарı̄
та̄р',
    E'', E'',
    E'I
will string together a necklace of forest flowers, and tulasi buds shall be the
jewels of that necklace.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'যতনে দেওবুঁ সখী-করে
হাতে লওব সখী আদরে', E'যতনে দেওবুঁ সখী-করে
হাতে লওব সখী আদরে',
    E'jatane
deobuń sakhī-kare
hāte
laobo sakhī ādare', E'джатане
деобуń сакхı̄-каре
ха̄те
лаобо сакхı̄ а̄даре',
    E'', E'',
    E'With utmost care I will place the garland in the hands of that confidential
devotee, and she will take it with affection.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'সখী দিব তুয়া দুহুক গলে
দূরত হেরবুঁ কুতূহলে', E'সখী দিব তুয়া দুহুক গলে
দূরত হেরবুঁ কুতূহলে',
    E'sakhī
dibo tuwā duhuk gale
dūrato
herobuń kutūhale', E'сакхı̄
дібо тува̄ духук ґале
дӯрато
херобуń кутӯхале',
    E'', E'',
    E'Then she will place the garland around both Your necks, while I watch in wonder
from afar.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'সখী কহব, শুন সুন্দরী!
রহবি কুঞ্জে মম
কিঙ্করী', E'সখী কহব, শুন সুন্দরী!
রহবি কুঞ্জে মম
কিঙ্করী',
    E'sakhī
kahabo,śuno sundarī!
rahobi
kuñje mama kińkorī', E'сакхı̄
кахабо,ш́уно сундарı̄!
рахобі
кун̃дже мама кіńкорı̄',
    E'', E'',
    E'The
confidant will then say to me, Listen, O beautiful one, you should remain in
this grove as my attendant.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'গাঁথোবি মালা মন-হারিনী
নিতি রাধা-কৃষ্ণ-বিমোহিনী', E'গাঁথোবি মালা মন-হারিনী
নিতি রাধা-কৃষ্ণ-বিমোহিনী',
    E'gāńthobi
mālā mano-hārinī
niti
rādhā-kṛṣṇa-vimohinī', E'ґа̄ńтхобі
ма̄ла̄ мано-ха̄рінı̄
ніті
ра̄дга̄-кр̣шн̣а-вімохінı̄',
    E'', E'',
    E'Daily you shall string together beautiful flower garlands that will enchant
Radha and Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'তুয়া রখন-ভার হামারা
মম কুঞ্জ-কুটীর তোহারা', E'তুয়া রখন-ভার হামারা
মম কুঞ্জ-কুটীর তোহারা',
    E'tuwā
rakhana-bhāra hāmārā
mama
kuñja-kuṭīra tohārā', E'тува̄
ракхана-бга̄ра ха̄ма̄ра̄
мама
кун̃джа-кут̣ı̄ра тоха̄ра̄',
    E'', E'',
    E'The responsibility for your maintenance shall be mine. My cottage in the grove
is yours.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'রাধা-মাধব-সেবন-কালে
রহবি হামার অন্তরালে', E'রাধা-মাধব-সেবন-কালে
রহবি হামার অন্তরালে',
    E'rādhā-mādhava-sevana-kāle
rahobi
hāmāra antarāle', E'ра̄дга̄-ма̄дгава-севана-ка̄ле
рахобі
ха̄ма̄ра антара̄ле',
    E'', E'',
    E'When I serve Radha and Madhava, you will attend behind me.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 10
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '10',
    E'তাম্বুল সাজি কর্পূর আনি
দেওবি মোএ আপন জানি', E'তাম্বুল সাজি কর্পূর আনি
দেওবি মোএ আপন জানি',
    E'tāmbula
sāji'' karpūra āni''
deobi
moe āpana jāni''', E'та̄мбула
са̄джі'' карпӯра а̄ні''
деобі
мое а̄пана джа̄ні''',
    E'', E'',
    E'After preparing tambula and bringing camphor, you will give them to me, knowing
me to be yours.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 11
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '11',
    E'ভকতিবিনোদ শুনি বাত
সখী-পদে করে প্রনিপাত', E'ভকতিবিনোদ শুনি বাত
সখী-পদে করে প্রনিপাত',
    E'bhakativinoda
śuni'' bāt
sakhī-pade
kare pranipāt', E'бгакатівінода
ш́уні'' ба̄т
сакхı̄-паде
каре праніпа̄т',
    E'', E'',
    E'Bhaktivinoda, having heard all these instructions, bows down at the lotus feet
of that confidential sakhi.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 6, Song 1: Tuwa Bhakti Anukula
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Tuwa Bhakti Anukula', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'তুয়া-ভক্তি-অনুকূল যে-যে কার্য হয়
পরম-যতনে তাহা করিব নিশ্চয়', E'তুয়া-ভক্তি-অনুকূল যে-যে কার্য হয়
পরম-যতনে তাহা করিব নিশ্চয়',
    E'tuwā-bhakti-anukūla
je-je kārya hoy
parama-jatane
tāhā koribo niścoy', E'тува̄-бгакті-анукӯла
дже-дже ка̄рйа хой
парама-джатане
та̄ха̄ корібо ніш́чой',
    E'', E'',
    E'I
will surely execute with utmost care those activities favorable to Your pure
devotional service.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'ভক্তি-অনুকূল যত বিষয় সংসারে
করিব তাহাতে রতি ইন্দ্রিয়ের দ্বারে', E'ভক্তি-অনুকূল যত বিষয় সংসারে
করিব তাহাতে রতি ইন্দ্রিয়ের দ্বারে',
    E'bhakti-anukūla
jata viṣaya saḿsāre
koribo
tāhāte rati indriyera dwāre', E'бгакті-анукӯла
джата вішайа саḿса̄ре
корібо
та̄ха̄те раті індрійера два̄ре',
    E'', E'',
    E'I
will feel fondness for those things in this world which are conductive to pure
devotion, and with my senses I will engage them in Your service.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'শুনিব তোমার কথা যতন করিয়া
দেখিব তোমার ধাম নয়ন ভরিয়া', E'শুনিব তোমার কথা যতন করিয়া
দেখিব তোমার ধাম নয়ন ভরিয়া',
    E'śunibo
tomāra kathā jatana koriyā
dekhibo
tomāra dhāma nayana bhoriyā', E'ш́унібо
тома̄ра катха̄ джатана корійа̄
декхібо
тома̄ра дга̄ма найана бгорійа̄',
    E'', E'',
    E'I
will carefully listen to all discussions concerning You, and the satisfaction
of my eyes will be to behold Your divine abode.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'তোমার প্রসাদে দেহ করিব পোষন
নৈবেদ্য-তুলসী-ঘ্রান করিব গ্রহন', E'তোমার প্রসাদে দেহ করিব পোষন
নৈবেদ্য-তুলসী-ঘ্রান করিব গ্রহন',
    E'tomāra
prasāde deho koribo poṣan
naivedya-tulasī-ghrāna
koribo grahan', E'тома̄ра
праса̄де дехо корібо пошан
наіведйа-туласı̄-ґгра̄на
корібо ґрахан',
    E'', E'',
    E'I
will nourish my body with the sacred remnants of Your food and smell the sweet
scent of tulasi leaves adorning those offerings.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'কর-দ্বারে করিব তোমার সেবা সদা
তোমার বসতি-স্থলে বসিব সর্বদা', E'কর-দ্বারে করিব তোমার সেবা সদা
তোমার বসতি-স্থলে বসিব সর্বদা',
    E'kara-dwāre
koribo tomāra sevā sadā
tomāra
vasati-sthale basibo sarvadā', E'кара-два̄ре
корібо тома̄ра сева̄ сада̄
тома̄ра
васаті-стхале басібо сарвада̄',
    E'', E'',
    E'With my hands I will always execute Your service, and I will forever dwell at
that place where You abide.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'তোমার সেবায় কাম নিয়োগ করিব
তোমার বিদ্বেষি-জনে ক্রোধ দেখাইব', E'তোমার সেবায় কাম নিয়োগ করিব
তোমার বিদ্বেষি-জনে ক্রোধ দেখাইব',
    E'tomāra
sevāya kāma niyoga koribo
tomāra
vidveṣi-jane krodha dekhāibo', E'тома̄ра
сева̄йа ка̄ма нійоґа корібо
тома̄ра
відвеші-джане кродга декха̄ібо',
    E'', E'',
    E'I
will employ my desires in Your devotional service and show anger to those who
are envious of You.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'এই-রূপে সর্ব-বৃত্তি আর সর্ব-ভাব
তুয়া অনুকূল হয়ে লভুক প্রভাব', E'এই-রূপে সর্ব-বৃত্তি আর সর্ব-ভাব
তুয়া অনুকূল হয়ে লভুক প্রভাব',
    E'ei-rūpe
sarva-vṛtti āra sarva-bhāva
tuwā
anukūla hoye labhuka prabhāva', E'еі-рӯпе
сарва-вр̣тті а̄ра сарва-бга̄ва
тува̄
анукӯла хойе лабгука прабга̄ва',
    E'', E'',
    E'In
this way may all of my propensities and emotions obtain dignity and glory by
being favorable to You.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'তুয়া ভক্ত-অনুকূল যাহা যাহা করি
তুয়া ভক্তি-অনুকূল বলি'' তাহা ধরি', E'তুয়া ভক্ত-অনুকূল যাহা যাহা করি
তুয়া ভক্তি-অনুকূল বলি'' তাহা ধরি',
    E'tuwā
bhakta-anukūla jāhā jāhā kori
tuwā
bhakti-anukūla boli'' tāhā dhori', E'тува̄
бгакта-анукӯла джа̄ха̄ джа̄ха̄ корі
тува̄
бгакті-анукӯла болі'' та̄ха̄ дгорі',
    E'', E'',
    E'I
will consider as favorable to Your devotional service anything I do which is
favorable to Your devotee.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'ভকতিবিনোদ নাহি জানে ধর্মাধর্ম
ভক্তি-অনুকূল তার হৌ সব কর্ম', E'ভকতিবিনোদ নাহি জানে ধর্মাধর্ম
ভক্তি-অনুকূল তার হৌ সব কর্ম',
    E'bhakativinoda
nāhi jāne dharmādharma
bhakti-anukūla
tāra hau saba karma', E'бгакатівінода
на̄хі джа̄не дгарма̄дгарма
бгакті-анукӯла
та̄ра хау саба карма',
    E'', E'',
    E'Bhaktivinoda knows neither religion nor irreligion. He simply prays that all
his activities be conductive for pure devotion to You.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 6, Song 2: Godruma Dhame Bhajana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Godruma Dhame Bhajana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'গোদ্রুম-ধামে ভজন-অনুকূলে
মাথুর-শ্রী-নন্দীশ্বর-সমতুলে', E'গোদ্রুম-ধামে ভজন-অনুকূলে
মাথুর-শ্রী-নন্দীশ্বর-সমতুলে',
    E'godruma-dhāme
bhajana-anukūle
māthura-śrī-nandīśvara-samatule', E'ґодрума-дга̄ме
бгаджана-анукӯле
ма̄тхура-ш́рı̄-нандı̄ш́вара-саматуле',
    E'', E'',
    E'On the banks of the celestial Ganges River I will dwell in a cottage at
Surabhi-kunj in Godruma-dhama. This land of Godruma is very conductive for
performing devotional worship of the Supreme Lord and is non-different from the
sacred place called Nandagram, located in the holy district of Mathura.
3-', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'তহি মাহ সুরভি-কুঞ্জ-কুটীরে
বৈঠবুঁ হাম সুর-তটিনী-তীরে', E'তহি মাহ সুরভি-কুঞ্জ-কুটীরে
বৈঠবুঁ হাম সুর-তটিনী-তীরে',
    E'tahi
māha surabhi-kuñja-kuṭīre
baiṭhobuń
hāma sura-taṭinī-tīre', E'тахі
ма̄ха сурабгі-кун̃джа-кут̣ı̄ре
баіт̣хобуń
ха̄ма сура-тат̣інı̄-тı̄ре',
    E'', E'',
    E'I will put on the garb that is dear to the devotees of Lord Gaurasundara and
wear the twelve Vaisnava tilaka markings on my body and beautiful beads of
tulasi wood around my neck. Then, by planting flowering trees like Campaka,
Bakula, Kadamba, and Tamala, I will make an extensive grove by my cottage.
(5-', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'গৌর-ভকত-প্রিয়-বেশ দধানা
তিলক-তুলসী-মালা-শোভমানা', E'গৌর-ভকত-প্রিয়-বেশ দধানা
তিলক-তুলসী-মালা-শোভমানা',
    E'gaura-bhakata-priya-veśa
dadhānā
tilaka-tulasī-mālā-śobhamānā', E'ґаура-бгаката-прійа-веш́а
дадга̄на̄
тілака-туласı̄-ма̄ла̄-ш́обгама̄на̄',
    E'', E'',
    E'I will put madhavi and malati creepers on the trees and in this way make a
shady bower. I will sow a variety of flowering forests and different kinds of
jasmine like yuthi, jati and malli. All these will be present there, arrayed in
a charming fashion. I will install the empress tulasi on an elevated throne on
the terrace, then procure all necessary paraphernalia for having kirtana, such
as mrdanga drums, karatalas (hand cymbals), and gongs, and place them there.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'চম্পক, বকুল, কদম্ব, তমাল
রোপত নিরমিব কুঞ্জ বিশাল', E'চম্পক, বকুল, কদম্ব, তমাল
রোপত নিরমিব কুঞ্জ বিশাল',
    E'campaka,
bakula, kadamba, tamāl
ropato
niramibo kuñja viśāl', E'чампака,
бакула, кадамба, тама̄л
ропато
нірамібо кун̃джа віш́а̄л',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'মাধবী মালতী উঠাবুঁ তাহে
ছায়া-মণ্ডপ করবুঁ তঁহি মাহে', E'মাধবী মালতী উঠাবুঁ তাহে
ছায়া-মণ্ডপ করবুঁ তঁহি মাহে',
    E'mādhavī
mālatī uṭhābuń tāhe
chāyā-manḍapa
korobuń tańhi māhe', E'ма̄дгавı̄
ма̄латı̄ ут̣ха̄буń та̄хе
чха̄йа̄-манд̣апа
коробуń таńхі ма̄хе',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'রোপোবুঁ তত্র কুসুম-বন-রাজি
জূথি, জাতি, মল্লী বিরাজব সাজি''', E'রোপোবুঁ তত্র কুসুম-বন-রাজি
জূথি, জাতি, মল্লী বিরাজব সাজি''',
    E'ropobuń
tatra kusuma-vana-rāji
jūthi,
jāti, mallī virājabo sāji''', E'ропобуń
татра кусума-вана-ра̄джі
джӯтхі,
джа̄ті, маллı̄ віра̄джабо са̄джі''',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'মঞ্চে বসাওবুঁ তুলসী-মহারাণী
কীর্তন-সজ্জ তঁহি রাখব আনি''', E'মঞ্চে বসাওবুঁ তুলসী-মহারাণী
কীর্তন-সজ্জ তঁহি রাখব আনি''',
    E'mañce
basāobuń tulasī-mahārāṇī
kīrtana-sajja
tańhi rākhabo āni''', E'ман̃че
баса̄обуń туласı̄-маха̄ра̄н̣ı̄
кı̄ртана-саджджа
таńхі ра̄кхабо а̄ні''',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'বৈষ্ণব-জন-সহ গাওবুঁ নাম
জয় গোদ্রুম জয় গৌর কি ধাম', E'বৈষ্ণব-জন-সহ গাওবুঁ নাম
জয় গোদ্রুম জয় গৌর কি ধাম',
    E'vaiṣṇava-jana-saha
gāobuń nām
jaya
godruma jaya gaura ki dhām', E'ваішн̣ава-джана-саха
ґа̄обуń на̄м
джайа
ґодрума джайа ґаура кі дга̄м',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'ভকতিবিনোদ ভক্তি-অনুকূল
জয় কুঞ্জ, মুঞ্জ, সুর-নদী-কূল', E'ভকতিবিনোদ ভক্তি-অনুকূল
জয় কুঞ্জ, মুঞ্জ, সুর-নদী-কূল',
    E'bhakativinoda
bhakti-anukūl
jaya
kuñja, muñja, sura-nadī-kūl', E'бгакатівінода
бгакті-анукӯл
джайа
кун̃джа, мун̃джа, сура-надı̄-кӯл',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 6, Song 3: Suddha Bhakata Carana Renu
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Suddha Bhakata Carana Renu', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'শুদ্ধ-ভকত-চরণ-রেণু,
ভজন-অনুকূল
ভকত-সেবা, পরম-সিদ্ধি,
প্রেম-লতিকার মূল', E'শুদ্ধ-ভকত-চরণ-রেণু,
ভজন-অনুকূল
ভকত-সেবা, পরম-সিদ্ধি,
প্রেম-লতিকার মূল',
    E'śuddha-bhakata-caraṇa-reṇu,
bhajana-anukūla
bhakata-sevā, parama-siddhi,
prema-latikāra mūla', E'ш́уддга-бгаката-чаран̣а-рен̣у,
бгаджана-анукӯла
бгаката-сева̄, парама-сіддгі,
према-латіка̄ра мӯла',
    E'', E'',
    E'The dust of the lotus feet of pure devotees, enthusiastic devotional service,
and service to the pure devotees of the highest order are the roots of the
creeper of devotion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'মাধব-তিথি, ভক্তি-জননী,
যেতনে পালন করি
কৃষ্ণ-বসতি, বসতি বলি'',
পরম আদরে বরি', E'মাধব-তিথি, ভক্তি-জননী,
যেতনে পালন করি
কৃষ্ণ-বসতি, বসতি বলি'',
পরম আদরে বরি',
    E'mādhava-tithi,
bhakti-jananī,
jetane pālana kori
kṛṣṇa-basati, basati boli'',
parama ādare bori', E'ма̄дгава-тітхі,
бгакті-джананı̄,
джетане па̄лана корі
кр̣шн̣а-басаті, басаті болі'',
парама а̄даре борі',
    E'', E'',
    E'The holy days like Ekadasi and Janmastami are the mother of devotion for those
devotees who respect them. Let the holy places of Krsna''s pastimes be my places
of worship, and bless me.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'গৌর আমার, যে-সব স্থানে,
করল ভ্রমণ রঙ্গে
সে-সব স্থান, হেরিব আমি,
প্রণয়ি-ভকত-সঙ্গে', E'গৌর আমার, যে-সব স্থানে,
করল ভ্রমণ রঙ্গে
সে-সব স্থান, হেরিব আমি,
প্রণয়ি-ভকত-সঙ্গে',
    E'gaur
āmāra, je-saba sthāne,
koralo bhramaṇa rańge
se-saba sthāna, heribo āmi,
praṇayi-bhakata-sańge', E'ґаур
а̄ма̄ра, дже-саба стха̄не,
корало бграман̣а раńґе
се-саба стха̄на, херібо а̄мі,
пран̣айі-бгаката-саńґе',
    E'', E'',
    E'May I always visit all the holy places associated with the lila of Lord
Caitanya and His devotees.', E'',
    E'', E'У своєму поясненні до **«Чайтанья-чарітамріта»**, Антья-ліла 4.211, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Шріла Бгактівінод Тхакур пише в пісні: *ґаура амара, йе саба стхане, карала бграмана ранґе / се-саба стхана, херіба амі, пранайі-бгаката-санґе*. "Нехай я відвідаю всі святі місця, пов''язані з лілами Господа Чайтаньї та Його відданих"».',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'মৃদঙ্গ-বাদ্য, শুনিতে মন,
অবসর সদা যাচে
গৌর-বিহিত, কীর্ত্তন শুনি'',
আনন্দে হৃদয় নাচে', E'মৃদঙ্গ-বাদ্য, শুনিতে মন,
অবসর সদা যাচে
গৌর-বিহিত, কীর্ত্তন শুনি'',
আনন্দে হৃদয় নাচে',
    E'mṛdańga-bādya,
śunite mana,
abasara sadā jāce
gaura-bihita, kīrtana śuni'',
ānande hṛdoya nāce', E'мр̣даńґа-ба̄дйа,
ш́уніте мана,
абасара сада̄ джа̄че
ґаура-біхіта, кı̄ртана ш́уні'',
а̄нанде хр̣дойа на̄че',
    E'', E'',
    E'When I hear the sound of the mrdanga in my heart I always desire to join in
kirtana; and when I hear the bonafide songs describing Lord Caitanya''s
pastimes, my heart dances in ecstasy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'যুগল-মূর্ত্তি, দেখিয়া মোর,
পরম-আনন্দ হয়
প্রসাদ-সেবা করিতে হয়,
সকল প্রপঞ্চ জয়', E'যুগল-মূর্ত্তি, দেখিয়া মোর,
পরম-আনন্দ হয়
প্রসাদ-সেবা করিতে হয়,
সকল প্রপঞ্চ জয়',
    E'jugala-mūrti,
dekhiyā mora,
parama-ānanda hoya
prasāda-sebā korite hoya,
sakala prapañca jaya', E'джуґала-мӯрті,
декхійа̄ мора,
парама-а̄нанда хойа
праса̄да-себа̄ коріте хойа,
сакала прапан̃ча джайа',
    E'', E'',
    E'Whenever I see the transcendental sri-vigrahas of Radha-Krsna I am in bliss,
for by taking Their Lordships'' prasada we can conquer over the material
elements.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'যে-দিন গৃহে, ভজন দেখি,
গৃহেতে গোলোক ভায়
চরণ-সীধু, দেখিয়া গঙ্গা,
সুখ সা সীমা পায়', E'যে-দিন গৃহে, ভজন দেখি,
গৃহেতে গোলোক ভায়
চরণ-সীধু, দেখিয়া গঙ্গা,
সুখ সা সীমা পায়',
    E'je-dina
gṛhe, bhajana dekhi,
gṛhete goloka bhāya
caraṇa-sīdhu, dekhiyā gańgā,
sukha sā sīmā pāya', E'дже-діна
ґр̣хе, бгаджана декхі,
ґр̣хете ґолока бга̄йа
чаран̣а-сı̄дгу, декхійа̄ ґаńґа̄,
сукха са̄ сı̄ма̄ па̄йа',
    E'', E'',
    E'One day while performing devotional practices, I saw my house transformed into
Goloka Vrndavana. When I take the caranamrta of the Deity, I see the holy
Ganges waters that come from the feet of Lord Visnu, and my bliss knows no
bounds.', E'',
    E'', E'У своєму поясненні до **«Чайтанья-чарітамріта»**, Мадг''я-ліла 7.69, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «У своїй книзі **«Шаранаґаті»** Бгактівінод Тхакур стверджує: *йе-діна ґріхе, бгаджана декхі'', ґріхете ґолока бгайа*. Коли сімейна людина прославляє Верховного Господа у своєму домі, її діяльність негайно перетворюється на діяльність Ґолоки Вріндавани».',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'তুলসী দেখি,
জুড়ায় প্রাণ,
মাধব-তোষণী জানি''
গৌর-প্রিয়, শাক-সেবনে,
জীবন সার্থক মানি', E'তুলসী দেখি'',
জুড়ায় প্রাণ,
মাধব-তোষণী জানি''
গৌর-প্রিয়, শাক-সেবনে,
জীবন সার্থক মানি',
    E'tulasī
dekhi'', jurāya prāṇa,
mādhava-toṣaṇī jāni''
gaura-priya, śāka-sevane,
jīvana sārthaka māni', E'туласı̄
декхі'', джура̄йа пра̄н̣а,
ма̄дгава-тошан̣ı̄ джа̄ні''
ґаура-прійа, ш́а̄ка-севане,
джı̄вана са̄ртхака ма̄ні',
    E'', E'',
    E'By seeing the tulasi tree my heart feels joy and Lord Madhava (Krsna) is also
satisfied. When I eat the prasada favored by Lord Caitanya it is a new life''s
experience. (Lord Caitanya was very fond of a green vegetable preparation
called sak, and there is another song in this book that tells of the amazing
effects of this type of prasada.)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'ভকতিবিনোদ, কৃষ্ণ-ভজনে,
অনকূল পায় যাহা
প্রতি-দিবসে, পরম-সুখে,
স্বীকার করয়ে তাহা', E'ভকতিবিনোদ, কৃষ্ণ-ভজনে,
অনকূল পায় যাহা
প্রতি-দিবসে, পরম-সুখে,
স্বীকার করয়ে তাহা',
    E'bhakativinoda,
kṛṣṇa-bhajane,
anakūla pāya jāhā
prati-dibase, parama-sukhe,
swīkāra koroye tāhā
WORD
FOR WORD', E'бгакатівінода,
кр̣шн̣а-бгаджане,
анакӯла па̄йа джа̄ха̄
праті-дібасе, парама-сукхе,
свı̄ка̄ра коройе та̄ха̄
ВОРД
FОР ВОРД',
    E'', E'',
    E'Bhaktivinoda concludes by saying: "Whosoever attains the stage of
enthusiasm for these devotional practices will be supremely blissful wherever
he may be."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 6, Song 4: Radha Kunda Tata Kunja Kutir
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Radha Kunda Tata Kunja Kutir', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'রাধা-কুণ্ড-তট-কুঞ্জ-কুটীর
গোবর্ধন-পর্বত, যামুন-তীর', E'রাধা-কুণ্ড-তট-কুঞ্জ-কুটীর
গোবর্ধন-পর্বত, যামুন-তীর',
    E'rādhā-kunḍa-taṭa-kuñja-kuṭīr
govardhana-parvata,
jāmuna-tīr', E'ра̄дга̄-кунд̣а-тат̣а-кун̃джа-кут̣ı̄р
ґовардгана-парвата,
джа̄муна-тı̄р',
    E'', E'',
    E'The cottage in the grove on the banks of Radha-kunda, the great Govardhana
Hill, the banks of the Yamuna, Kusuma-sarovara, Manasa-ganga, the daughter of
Kalinda (the Yamuna) with her many waves, the Vamsi-vat, Gokula, Dhira-samira,
the trees and creepers and reeds of Vrndavana, the different varieties of
colorful birds, the deer, the cooling breeze from the Malaya Mountains, the
peacocks, the bumblebees, the pastimes with the flute, the flute itself, the
buffalo horn bugle, the footprints of cows in the dust of Vraja, the rows of
blackish rain clouds, springtime, the moon, the conch-shell, and the karatalas
 all these I know to be very conductive for the pastimes of Radha and Krsna. I
recognize in them a transcendental stimulus for making the Lord''s charming
pastimes more intense.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'কুসুম-সরোবর, মানস-গঙ্গা
কলিন্দ-নন্দিনী বিপুল-তরঙ্গ', E'কুসুম-সরোবর, মানস-গঙ্গা
কলিন্দ-নন্দিনী বিপুল-তরঙ্গ',
    E'kusuma-sarovara,
mānasa-gańgā
kalinda-nandinī
vipula-tarańga', E'кусума-саровара,
ма̄наса-ґаńґа̄
калінда-нандінı̄
віпула-тараńґа',
    E'', E'',
    E'I refuse to go anywhere if there stimuli to devotional service are not there,
for to abandon them is to abandon life itself.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'বংশী-বট, গোকুল, ধীর-সমীর
বৃন্দাবন-তরু-লতিকা-বানীর', E'বংশী-বট, গোকুল, ধীর-সমীর
বৃন্দাবন-তরু-লতিকা-বানীর',
    E'vaḿśī-vaṭa,
gokula, dhīra-samīr
bṛndābana-taru-latikā-bānīr', E'ваḿш́ı̄-ват̣а,
ґокула, дгı̄ра-самı̄р
бр̣нда̄бана-тару-латіка̄-ба̄нı̄р',
    E'', E'',
    E'Bhaktivinoda says, Please hear me, O Kana! Your entourage and paraphernalia
stimulate remembrance of You and are the very source of my life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'খগ-মৃগ-কুল, মলয়-বাতাস
ময়ূর, ভ্রমর, মুরলী-বিলাস', E'খগ-মৃগ-কুল, মলয়-বাতাস
ময়ূর, ভ্রমর, মুরলী-বিলাস',
    E'khaga-mṛga-kula,
malaya-bātās
mayūra,
bhramara, muralī-vilās', E'кхаґа-мр̣ґа-кула,
малайа-ба̄та̄с
майӯра,
бграмара, муралı̄-віла̄с',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'বেনু, শৃঙ্গ, পদ-চিহ্ন, মেঘ-মালা
বসন্ত, শশঙ্ক, শঙ্খ, করতাল', E'বেনু, শৃঙ্গ, পদ-চিহ্ন, মেঘ-মালা
বসন্ত, শশঙ্ক, শঙ্খ, করতাল',
    E'venu,
śṛńga, pada-cihna, megha-mālā
vasanta,
śaśańka, śańkha, karatāla', E'вену,
ш́р̣ńґа, пада-чіхна, меґга-ма̄ла̄
васанта,
ш́аш́аńка, ш́аńкха, карата̄ла',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'য়ুগল-বিলাসে অনুকূল জানি
লীলা-বিলাসে-উদ্দীপক মানি', E'য়ুগল-বিলাসে অনুকূল জানি
লীলা-বিলাসে-উদ্দীপক মানি',
    E'yugala-vilāse
anukūla jāni
līlā-vilāse-uddīpaka
māni', E'йуґала-віла̄се
анукӯла джа̄ні
лı̄ла̄-віла̄се-уддı̄пака
ма̄ні',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'এ সব ছোড়ত কঁহি নাহি যাউ
এ সব ছোড়ত পরাণ হারাউ', E'এ সব ছোড়ত কঁহি নাহি যাউ
এ সব ছোড়ত পরাণ হারাউ',
    E'e
saba choḍato kańhi nāhi jāu
e
saba choḍato parāna hārāu', E'е
саба чход̣ато каńхі на̄хі джа̄у
е
саба чход̣ато пара̄на ха̄ра̄у',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'ভকতিবিনোদ কহে, শুন কান!
তুয়া উদ্দীপক হামারা পরাণ', E'ভকতিবিনোদ কহে, শুন কান!
তুয়া উদ্দীপক হামারা পরাণ',
    E'bhakativinoda kohe, śuno kān!
tuwā uddīpaka
hāmārā parān', E'бгакатівінода кохе, ш́уно ка̄н!
тува̄ уддı̄пака
ха̄ма̄ра̄ пара̄н',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 7, Song 1: Kesava Tuwa Jagata Vicitra
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 7;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Kesava Tuwa Jagata Vicitra', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'কেশব! তুয়া জগত বিচিত্র
করম-বিপাকে, ভব-বন ভ্রম-ই,
পেখলুঁ রঙ্গ বহু চিত্র', E'কেশব! তুয়া জগত বিচিত্র
করম-বিপাকে, ভব-বন ভ্রম-ই,
পেখলুঁ রঙ্গ বহু চিত্র',
    E'keśava!
tuwā jagata vicitra
karama-vipāke,
bhava-vana bhrama-i,
pekhaluń
rańga bahu citra', E'кеш́ава!
тува̄ джаґата вічітра
карама-віпа̄ке,
бгава-вана бграма-і,
пекхалуń
раńґа баху чітра',
    E'', E'',
    E'This material creation of Yours, O Kesava, is most strange. I have roamed
throughout the forest of this universe in consequence of my selfish acts, and I
have beheld many strange and curious sights.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'তুয়া পদ-বিস্মৃতি, আ-মর যন্ত্রনা,
ক্লেশ-দহনে দোহি'' যায়
কপিল, পতঞ্জলি, গৌতম, কনভোজী,
জৈমিনি, বৌদ্ধ আওয়ে ধাই''', E'তুয়া পদ-বিস্মৃতি, আ-মর যন্ত্রনা,
ক্লেশ-দহনে দোহি'' যায়
কপিল, পতঞ্জলি, গৌতম, কনভোজী,
জৈমিনি, বৌদ্ধ আওয়ে ধাই''',
    E'tuwā
pada-vismṛti, ā-mara jantranā,
kleśa-dahane
dohi'' jāi
kapila,
patañjali, gautama, kanabhojī,
jaimini,
bauddha āowe dhāi''', E'тува̄
пада-вісмр̣ті, а̄-мара джантрана̄,
клеш́а-дахане
дохі'' джа̄і
капіла,
патан̃джалі, ґаутама, канабгоджı̄,
джаіміні,
бауддга а̄ове дга̄і''',
    E'', E'',
    E'Forgetfulness of Your lotus feet has brought on anguish and grief. As I burn in
this fire of misery, my would-be saviors  Kapila, Gautama, Kanada, Jaimini,
and Buddha  come running to my aid.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'তব কৈ নিজ-মতে, ভুক্তি, মুক্তি যাচত,
পাত-ই নানা-বিধ ফাঁদ
সো-সবু-বঞ্চক, তুয়া ভক্তি বহির-মুখ,
ঘটাওয়ে বিষম পরমাদ', E'তব কৈ নিজ-মতে, ভুক্তি, মুক্তি যাচত,
পাত-ই নানা-বিধ ফাঁদ
সো-সবু-বঞ্চক, তুয়া ভক্তি বহির-মুখ,
ঘটাওয়ে বিষম পরমাদ',
    E'tab
koi nija-mate, bhukti, mukti yācato,
pāta-i
nānā-vidha phāńd
so-sabuvañcaka,
tuwā bhakti bahir-mukha,
ghaṭāowe
viṣama paramād', E'таб
коі ніджа-мате, бгукті, мукті йа̄чато,
па̄та-і
на̄на̄-відга пха̄ńд
со-сабуван̃чака,
тува̄ бгакті бахір-мукха,
ґгат̣а̄ове
вішама парама̄д',
    E'', E'',
    E'Each expounds his particular view, dangling various pleasures and liberation as
bait in their philosophical traps. They are all cheaters, averse to Your
devotional service and thus fatally dangerous.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'বৈমুখ-বঞ্চনে, ভট সো-সবু,
নিরমিল বিবিধ পসার
দণ্ডবত দূরত, ভকতিবিনোদ ভেল,
ভকত-চরণ করি'' সার', E'বৈমুখ-বঞ্চনে, ভট সো-সবু,
নিরমিল বিবিধ পসার
দণ্ডবত দূরত, ভকতিবিনোদ ভেল,
ভকত-চরণ করি'' সার',
    E'vaimukha-vañcane,
bhaṭa so-sabu,
niramilo
vividha pasār
danḍavat
dūrato, bhakativinoda bhelo,
bhakata-caraṇa
kori'' sār', E'ваімукха-ван̃чане,
бгат̣а со-сабу,
ніраміло
вівідга паса̄р
данд̣ават
дӯрато, бгакатівінода бгело,
бгаката-чаран̣а
корі'' са̄р',
    E'', E'',
    E'They are magnates of karma, jnana, and yoga who specialize in opinions and
proofs for cheating the materially inclined. Bhaktivinoda, considering refuge
at the feet of the Vaisnavas as essential, pays his respects to these cheating
philosophers from afar.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 7, Song 2: Tuwa Bhakti Pratikula
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 7;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Tuwa Bhakti Pratikula', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'তুয়া-ভক্তি-প্রতিকূল ধর্ম জাতে রয়
পরম যতনে তাহা ত্যজিব নিশ্চয়', E'তুয়া-ভক্তি-প্রতিকূল ধর্ম জাতে রয়
পরম যতনে তাহা ত্যজিব নিশ্চয়',
    E'tuwā-bhakti-pratikūla
dharma jā''te roy
parama
jatane tāhā tyajibo niścoy', E'тува̄-бгакті-пратікӯла
дгарма джа̄''те рой
парама
джатане та̄ха̄ тйаджібо ніш́чой',
    E'', E'',
    E'I
vow to abandon without compromise all actions contrary to Your devotional
service.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'তুয়া-ভক্তি-বহির-মুখ সঙ্গ না করিব
গৌরাঙ্গ-বিরোধি-জন-মুখ না হেরিব', E'তুয়া-ভক্তি-বহির-মুখ সঙ্গ না করিব
গৌরাঙ্গ-বিরোধি-জন-মুখ না হেরিব',
    E'tuwā-bhakti-bahir-mukha
sańga nā koribo
gaurāńga-virodhi-jana-mukha
nā heribo', E'тува̄-бгакті-бахір-мукха
саńґа на̄ корібо
ґаура̄ńґа-віродгі-джана-мукха
на̄ херібо',
    E'', E'',
    E'I will
keep company with no one opposed to devotional service, nor even look at the
face of a person inimical toward Lord Gauranga.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'ভক্তি-প্রতিকূল স্থানে না করি বসতি
ভক্তির অপ্রিয় কার্যে নাহি করি রতি', E'ভক্তি-প্রতিকূল স্থানে না করি বসতি
ভক্তির অপ্রিয় কার্যে নাহি করি রতি',
    E'bhakti-pratikūla
sthāne nā kori vasati
bhaktira
apriya kārye nāhi kori rati', E'бгакті-пратікӯла
стха̄не на̄ корі васаті
бгактіра
апрійа ка̄рйе на̄хі корі раті',
    E'', E'',
    E'I
shall never reside at a place unfavorable for devotional practices, and may I
never take pleasure in non-devotional works.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'ভক্তির বিরোধী গ্রন্থ পাঠ না করিব
ভক্তির বিরোধী ব্যাখ্যা কভু না শুনিব', E'ভক্তির বিরোধী গ্রন্থ পাঠ না করিব
ভক্তির বিরোধী ব্যাখ্যা কভু না শুনিব',
    E'bhaktira
virodhī grantha pāṭha nā koribo
bhaktira
virodhī vyākhyā kabhu nā śunibo', E'бгактіра
віродгı̄ ґрантха па̄т̣ха на̄ корібо
бгактіра
віродгı̄ вйа̄кхйа̄ кабгу на̄ ш́унібо',
    E'', E'',
    E'I
will read no book opposed to pure devotion, nor listen to any explanation which
disagrees with pure devotional principles.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'গৌরাঙ্গ-বর্জিত স্থান তীর্থ নাহি মানি
ভক্তির বাধক জ্ঞান-কর্ম তুচ্ছ জানি', E'গৌরাঙ্গ-বর্জিত স্থান তীর্থ নাহি মানি
ভক্তির বাধক জ্ঞান-কর্ম তুচ্ছ জানি',
    E'gaurāńga-varjita
sthāna tīrtha nāhi māni
bhaktira
bādhaka jñāna-karma tuccha jāni', E'ґаура̄ńґа-варджіта
стха̄на тı̄ртха на̄хі ма̄ні
бгактіра
ба̄дгака джн̃а̄на-карма туччха джа̄ні',
    E'', E'',
    E'I
will never regard as sacred any place where Lord Gauranga is rejected. Any
knowledge hindering pure devotional service I consider worthless.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'ভক্তির বাধক কালে না করি আদর
ভক্তি বহির-মুখ নিজ-জনে জানি পর', E'ভক্তির বাধক কালে না করি আদর
ভক্তি বহির-মুখ নিজ-জনে জানি পর',
    E'bhaktira
bādhaka kāle nā kori ādar
bhakti
bahir-mukha nija-jane jāni par', E'бгактіра
ба̄дгака ка̄ле на̄ корі а̄дар
бгакті
бахір-мукха ніджа-джане джа̄ні пар',
    E'', E'',
    E'Any
season which poses obstacles to the execution of devotional service shall find
no favor with me, and I will consider all relatives or family members averse to
pure devotion as strangers.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'ভক্তির বাধিকা স্পৃহা করিব বর্জন
অভক্ত-প্রদত্ত অন্ন না করি গ্রহন', E'ভক্তির বাধিকা স্পৃহা করিব বর্জন
অভক্ত-প্রদত্ত অন্ন না করি গ্রহন',
    E'bhaktira
bādhikā spṛhā koribo varjan
abhakta-pradatta
anna nā kori grahan', E'бгактіра
ба̄дгіка̄ спр̣ха̄ корібо варджан
абгакта-прадатта
анна на̄ корі ґрахан',
    E'', E'',
    E'I
will abandon all desires that hinder devotion and never accept food offered to
me by non-devotee atheists.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'জাহা কিছু ভক্তি-প্রতিকূল বলি জানি
ত্যজিব যতনে তাহা, এ নিশ্চয় বানী', E'জাহা কিছু ভক্তি-প্রতিকূল বলি জানি
ত্যজিব যতনে তাহা, এ নিশ্চয় বানী',
    E'jāhā
kichu bhakti-pratikūla boli'' jāni
tyajibo
jatane tāhā, e niścoya vānī', E'джа̄ха̄
кічху бгакті-пратікӯла болі'' джа̄ні
тйаджібо
джатане та̄ха̄, е ніш́чойа ва̄нı̄',
    E'', E'',
    E'I
vow to promptly shun whatever I know to contradict pure devotion. This I
strongly promise.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'ভকতিবিনোদ পড়ি প্রভুর চরণে
মাগয়ে শকতি প্রতিকূল্যের বর্জনে
2017', E'ভকতিবিনোদ পড়ি প্রভুর চরণে
মাগয়ে শকতি প্রতিকূল্যের বর্জনে
2017',
    E'bhakativinoda
poḍi'' prabhura caraṇe
māgaye
śakati pratikūlyera varjane', E'бгакатівінода
под̣і'' прабгура чаран̣е
ма̄ґайе
ш́акаті пратікӯлйера варджане',
    E'', E'',
    E'Bhaktivinoda, falling at the feet of the Lord, begs for the strength to give up
all obstacles to pure devotion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 7, Song 3: Visaya Bimudha Ar Mayavadi
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 7;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Visaya Bimudha Ar Mayavadi', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'বিষয়-বিমূঢ আর মায়াবাদী জন
ভক্তি-শূন্য দুঁহে প্রাণ ধরে অকারণ', E'বিষয়-বিমূঢ আর মায়াবাদী জন
ভক্তি-শূন্য দুঁহে প্রাণ ধরে অকারণ',
    E'viṣaya-vimūḍha
ār māyāvādī jan
bhakti-śūnya
duńhe prāna dhare akāraṇ', E'вішайа-вімӯд̣ха
а̄р ма̄йа̄ва̄дı̄ джан
бгакті-ш́ӯнйа
дуńхе пра̄на дгаре ака̄ран̣',
    E'', E'',
    E'Both the monist philosophers and those bewildered by worldly affairs live in
vain, for both are devoid of devotion to You.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'এই দুই-সঙ্গ নাথ! না হয় আমার
প্রার্থনা করিয়ে আমি চরণে তোমার', E'এই দুই-সঙ্গ নাথ! না হয় আমার
প্রার্থনা করিয়ে আমি চরণে তোমার',
    E'ei
dui-sańga nātha! nā hoy āmār
prārthanā
koriye āmi caraṇe tomār', E'еі
дуі-саńґа на̄тха! на̄ хой а̄ма̄р
пра̄ртхана̄
корійе а̄мі чаран̣е тома̄р',
    E'', E'',
    E'I pray at Your lotus feet, O Lord, that I may be spared the company of them
both.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'সে দুয়ের মধ্যে বিষয়ী তবু ভাল
মায়াবাদী-সঙ্গ নাহি মাগি কন কাল', E'সে দুয়ের মধ্যে বিষয়ী তবু ভাল
মায়াবাদী-সঙ্গ নাহি মাগি কন কাল',
    E'se
duwera madhye viṣayī tabu bhālo
māyāvādī-sańga
nāhi māgi kono kālo', E'се
дувера мадгйе вішайı̄ табу бга̄ло
ма̄йа̄ва̄дı̄-саńґа
на̄хі ма̄ґі коно ка̄ло',
    E'', E'',
    E'Yet of the two the worldly man is better. I ask never to have the company of
mayavadi.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'বিষয়ী-হৃদয় যবে সাধু-সঙ্গ পায়
অনায়াসে লভে ভক্তি ভক্তের কৃপায়', E'বিষয়ী-হৃদয় যবে সাধু-সঙ্গ পায়
অনায়াসে লভে ভক্তি ভক্তের কৃপায়',
    E'viṣayī-hṛdoya
jabe sādhu-sańga pāy
anāyāse
labhe bhakti bhaktera kṛpāy', E'вішайı̄-хр̣дойа
джабе са̄дгу-саńґа па̄й
ана̄йа̄се
лабге бгакті бгактера кр̣па̄й',
    E'', E'',
    E'When the worldly man enters into the company of saintly persons within his
heart he becomes inspired by pure devotion through the mercy of those devotees.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'মায়াবাদ-দোষ যার হৃদয়ে পশিল
কুতর্কে হৃদয় তার বজ্র-সম ভেল', E'মায়াবাদ-দোষ যার হৃদয়ে পশিল
কুতর্কে হৃদয় তার বজ্র-সম ভেল',
    E'māyāvāda-doṣa
jā''ra hṛdoye paśilo
kutarke
hṛdoya tā''ra vajra-sama bhelo', E'ма̄йа̄ва̄да-доша
джа̄''ра хр̣дойе паш́іло
кутарке
хр̣дойа та̄''ра ваджра-сама бгело',
    E'', E'',
    E'But woe to him who has known the offensive presence of impersonalist
philosophy. Such sophistry makes the heart hard as a thunderbolt.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'ভক্তির স্বরূপ, আর বিষয়, আশ্রয়
মায়াবাদী অনিত্য বলিয়া সব কয়', E'ভক্তির স্বরূপ, আর বিষয়, আশ্রয়
মায়াবাদী অনিত্য বলিয়া সব কয়',
    E'bhaktira
swarūpa, āra `viṣaya'', `āśroy''
māyāvādī
`anitya'' boliyā saba koy', E'бгактіра
сварӯпа, а̄ра `вішайа'', `а̄ш́рой''
ма̄йа̄ва̄дı̄
`анітйа'' болійа̄ саба кой',
    E'', E'',
    E'The mayavada philosopher declares that the true form of bhakti, its object (Sri
Krishna), and its possessor (the devotee) are all transitory and thus illusory.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'ধিক তার কৃষ্ণ-সেবা-শ্রবন-কীর্তন
কৃষ্ণ-অঙ্গে বজ্র হানে তাহার স্তবন', E'ধিক তার কৃষ্ণ-সেবা-শ্রবন-কীর্তন
কৃষ্ণ-অঙ্গে বজ্র হানে তাহার স্তবন',
    E'dhik
tā''ra kṛṣṇa-sevā-śravana-kīrtan
kṛṣṇa-ańge
vajra hāne tāhāra stavan', E'дгік
та̄''ра кр̣шн̣а-сева̄-ш́равана-кı̄ртан
кр̣шн̣а-аńґе
ваджра ха̄не та̄ха̄ра ставан',
    E'', E'',
    E'Fie on his pretense of service to Krishna, of hearing and chanting His glories!
His so-called prayers strike the body of Krishna with blows more cruel that a
thunderbolt.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'মায়াবাদ সম ভক্তি-প্রতিকূল নাই
অতএব মায়াবাদী-সঙ্গ নাহি চাই', E'মায়াবাদ সম ভক্তি-প্রতিকূল নাই
অতএব মায়াবাদী-সঙ্গ নাহি চাই',
    E'māyāvāda
sama bhakti-pratikūla nāi
ataeva
māyāvādī-sańga nāhi cāi', E'ма̄йа̄ва̄да
сама бгакті-пратікӯла на̄і
атаева
ма̄йа̄ва̄дı̄-саńґа на̄хі ча̄і',
    E'', E'',
    E'There is no philosophy as antagonistic to devotional service as mayavada
philosophy. Therefore I do not desire the association of the mayavadi.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 9
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'ভকতিবিনোদ মায়াবাদ দূর করি
বৈষ্ণব-সঙ্গেতে বৈসে নামাশ্রয় ধরি''', E'ভকতিবিনোদ মায়াবাদ দূর করি
বৈষ্ণব-সঙ্গেতে বৈসে নামাশ্রয় ধরি''',
    E'bhakativinoda
māyāvāda dūra kori
vaiṣṇava-sańgete
baise nāmāśraya dhori''', E'бгакатівінода
ма̄йа̄ва̄да дӯра корі
ваішн̣ава-саńґете
баісе на̄ма̄ш́райа дгорі''',
    E'', E'',
    E'Bhaktivinoda drives away the philosophy of illusionism and sits safely in the
society of Vaisnavas under the shelter of the holy name.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 7, Song 4: Ami To Swananda Sukhada Vasi
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 7;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Ami To Swananda Sukhada Vasi', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'আমি তো স্বানন্দ-সুখদ-বাসী
রাধিকা-মাধব-চরণ-দাসী', E'আমি তো স্বানন্দ-সুখদ-বাসী
রাধিকা-মাধব-চরণ-দাসী',
    E'āmi
to'' swānanda-sukhada-bāsī
rādhikā-mādhava-caraṇa-dāsī', E'а̄мі
то'' сва̄нанда-сукхада-ба̄сı̄
ра̄дгіка̄-ма̄дгава-чаран̣а-да̄сı̄',
    E'', E'',
    E'I
am a resident of Svananda-sukhada-kunja and a maidservant of the lotus feet of
Radhika and Madhava.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'দুঁহার মিলনে আনন্দ করি
দুঁহার বিয়োগে দুঃখেতে মরি', E'দুঁহার মিলনে আনন্দ করি
দুঁহার বিয়োগে দুঃখেতে মরি',
    E'duńhāra
milane ānanda kori
duńhāra
viyoge duḥkhete mari', E'дуńха̄ра
мілане а̄нанда корі
дуńха̄ра
війоґе дух̣кхете марі',
    E'', E'',
    E'At
the union of the Divine Couple I rejoice, and in Their separation I die in
anguish.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'সখী-স্থলী নাহি হেরি নয়নে
দেখিলে শৈব্যাকে পরয়ে মনে', E'সখী-স্থলী নাহি হেরি নয়নে
দেখিলে শৈব্যাকে পরয়ে মনে',
    E'sakhī-sthalī
nāhi heri nayane
dekhile
śaibyāke paraye mane', E'сакхı̄-стхалı̄
на̄хі хері найане
декхіле
ш́аібйа̄ке парайе мане',
    E'', E'',
    E'I
never look at the place where Candravali and her friends stay. Whenever I see
such a place it reminds me of Candravali''s gopi friend, Saibya.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'যে-যে প্রতিকূল চন্দ্রার সখী
প্রাণে দুঃখ পাই তাহারে দেখি''', E'যে-যে প্রতিকূল চন্দ্রার সখী
প্রাণে দুঃখ পাই তাহারে দেখি''',
    E'je-je
pratikūla candrāra sakhī
prāne
duḥkha pāi tāhāre dekhi''', E'дже-дже
пратікӯла чандра̄ра сакхı̄
пра̄не
дух̣кха па̄і та̄ха̄ре декхі''',
    E'', E'',
    E'I
feel pain in my heart when I catch sight of Candravali''s girl-friends, for they
are opposed to Radha.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'রাধিকা-কুঞ্জ আঁধার করি
লৈতে চাহে সে রাধার হরি', E'রাধিকা-কুঞ্জ আঁধার করি
লৈতে চাহে সে রাধার হরি',
    E'rādhikā-kuñja
āńdhāra kori''
loite
cāhe se rādhāra hari', E'ра̄дгіка̄-кун̃джа
а̄ńдга̄ра корі''
лоіте
ча̄хе се ра̄дга̄ра харі',
    E'', E'',
    E'Candravali wants to take away Radha''s Lord Hari, thus covering the grove of
Radhika with the darkness of gloom.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'শ্রী-রাধা-গোবিন্দ-মিলন-সুখ
প্রতিকূল-জন না হেরি মুখ', E'শ্রী-রাধা-গোবিন্দ-মিলন-সুখ
প্রতিকূল-জন না হেরি মুখ',
    E'śrī-rādhā-govinda-milana-sukha
pratikūla-jana
nā heri mukha', E'ш́рı̄-ра̄дга̄-ґовінда-мілана-сукха
пратікӯла-джана
на̄ хері мукха',
    E'', E'',
    E'I
never look at the faces of those who are opposed to Sri Radha and Govindas
joyous union.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'রাধা-প্রতিকূল যতেক জন-
সম্ভাষনে কভু না হয় মন', E'রাধা-প্রতিকূল যতেক জন-
সম্ভাষনে কভু না হয় মন',
    E'rādhā-pratikūla
jateka jana-
sambhāṣane
kabhu nā hoy mana', E'ра̄дга̄-пратікӯла
джатека джана-
самбга̄шане
кабгу на̄ хой мана',
    E'', E'',
    E'Nor
do I find any pleasure in conversing with those who are opposed to Radha.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'ভকতিবিনোদ শ্রী-রাধা-চরণে
সঁপেছে পরাণ অতীব যতনে', E'ভকতিবিনোদ শ্রী-রাধা-চরণে
সঁপেছে পরাণ অতীব যতনে',
    E'bhakativinoda
śrī-rādhā-caraṇe
sańpeche
parāna atīva jatane', E'бгакатівінода
ш́рı̄-ра̄дга̄-чаран̣е
саńпечхе
пара̄на атı̄ва джатане',
    E'', E'',
    E'Bhaktivinoda has enthusiastically entrusted his soul to the lotus feet of
Srimati Radharani.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 8, Song 1: Prapance Poriya Agati
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Prapance Poriya Agati', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'হরি হে!
প্রপঞ্চে পড়িয়া, অগতি হৈয়া,
না দেখি উপায় আর
অগতির গতি, চরণে শরণ,
তোমায় করিনু সার', E'হরি হে!
প্রপঞ্চে পড়িয়া, অগতি হৈয়া,
না দেখি উপায় আর
অগতির গতি, চরণে শরণ,
তোমায় করিনু সার',
    E'hari
he!
prapañce
poḍiyā, agati hoiyā,
nā
dekhi upāya ār
agatira
gati, caraṇe śaraṇa,
tomāya
korinu sār', E'харі
хе!
прапан̃че
под̣ійа̄, аґаті хоійа̄,
на̄
декхі упа̄йа а̄р
аґатіра
ґаті, чаран̣е ш́аран̣а,
тома̄йа
коріну са̄р',
    E'', E'',
    E'O Lord Hari, having fallen helplessly into the illusion of this world, I see no
other means of deliverance but You. You are the only recourse for the helpless.
I accept the shelter of Your lotus feet as essential.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'করম গেয়ান, কিছু নাহি মোর,
সাধন ভজন নাই
তুমি কৃপা-ময়, আমি তো'' কাঙ্গাল,
অহৈতুকী কৃপা চাই', E'করম গেয়ান, কিছু নাহি মোর,
সাধন ভজন নাই
তুমি কৃপা-ময়, আমি তো'' কাঙ্গাল,
অহৈতুকী কৃপা চাই',
    E'karama
geyāna, kichu nāhi mora,
sādhana
bhajana nāi
tumi
kṛpā-moya, āmi to'' kāńgāla,
ahaitukī
kṛpā cāi', E'карама
ґейа̄на, кічху на̄хі мора,
са̄дгана
бгаджана на̄і
тумі
кр̣па̄-мойа, а̄мі то'' ка̄ńґа̄ла,
ахаітукı̄
кр̣па̄ ча̄і',
    E'', E'',
    E'I have no knowledge, no background of pious activities, nor any history of
strict devotional practice. But You are full of compassion and kindness.
Therefore, although I am certainly destitute, I solicit Your causeless mercy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'বাক্য-মন-বেগ, ক্রোধ-জিহ্বা-বেগ,
উদর-উপস্থ-বেগ
মিলিয়া এ সব, সংসারে ভাসা''য়ে,
দিতেছে পরমোদ্বেগ', E'বাক্য-মন-বেগ, ক্রোধ-জিহ্বা-বেগ,
উদর-উপস্থ-বেগ
মিলিয়া এ সব, সংসারে ভাসা''য়ে,
দিতেছে পরমোদ্বেগ',
    E'vākya-mano-vega,
krodha-jihvā-vega,
udara-upastha-vega
miliyā
e saba, saḿsāre bhāsā''ye,
diteche
paramodvega', E'ва̄кйа-мано-веґа,
кродга-джіхва̄-веґа,
удара-упастха-веґа
мілійа̄
е саба, саḿса̄ре бга̄са̄''йе,
дітечхе
парамодвеґа',
    E'', E'',
    E'The powerful urges of speech, mind, anger, tongue, belly, and genital have
banded together to cast me adrift on the sea of this material world, thus
causing me great anxiety and trouble.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'অনেক যতনে, সে সব দমনে,
ছাড়িয়াছি আশা আমি
অনাথের নাথ! ডাকি তব নাম,
এখন ভরসা তুমি', E'অনেক যতনে, সে সব দমনে,
ছাড়িয়াছি আশা আমি
অনাথের নাথ! ডাকি তব নাম,
এখন ভরসা তুমি',
    E'aneka
jatane, se saba damane,
chāḍiyāchi
āśā āmi
anāthera
nātha! ḍāki tava nāma,
ekhona
bharasā tumi', E'анека
джатане, се саба дамане,
чха̄д̣ійа̄чхі
а̄ш́а̄ а̄мі
ана̄тхера
на̄тха! д̣а̄кі тава на̄ма,
екхона
бгараса̄ тумі',
    E'', E'',
    E'After great endeavor to subdue these material demands, I have completely given
up all hope. O Lord of the destitute, I call upon Your holy name, for now You
are my only shelter.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 8, Song 2: Arthera Sancaye
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Arthera Sancaye', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'হরি হে!
অর্থের সঞ্চয়ে, বিষয়-প্রয়াসে,
আন-কথা-প্রজল্পনে
আন-অধিকার, নিয়ম আগ্রহে,
অসত-সঙ্গ-সংঘটনে', E'হরি হে!
অর্থের সঞ্চয়ে, বিষয়-প্রয়াসে,
আন-কথা-প্রজল্পনে
আন-অধিকার, নিয়ম আগ্রহে,
অসত-সঙ্গ-সংঘটনে',
    E'hari
he!
arthera
sañcaye, viṣaya-prayāse,
āno-kathā-prajalpane
āno-adhikāra,
niyama āgrahe,
asat-sańga-saḿghaṭane', E'харі
хе!
артхера
сан̃чайе, вішайа-прайа̄се,
а̄но-катха̄-праджалпане
а̄но-адгіка̄ра,
нійама а̄ґрахе,
асат-саńґа-саḿґгат̣ане',
    E'', E'',
    E'O Lord Hari, I have become absorbed in accumulating wealth and endeavoring for
material possessions. I am addicted to speaking of topics apart from You and am
always eager to accept practices apart from my own duties. I am in the habit of
meeting with worldly men and am absorbed in speculative thinking. Therefore,
devotion to You has remained distant from me. In this heart of mine dwells only
envy and malice towards others false pride, hypocrisy, deceitfulness, and the
desire for fame and honor.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'অস্থির সিদ্ধান্তে, রহিনু মজিয়া,
হরি-ভক্তি রৈল দূরে
এ হৃদয়ে মাত্র, পর-হিংসা, মদ,
প্রতিষ্ঠা, শঠতা স্ফুরে', E'অস্থির সিদ্ধান্তে, রহিনু মজিয়া,
হরি-ভক্তি রৈল দূরে
এ হৃদয়ে মাত্র, পর-হিংসা, মদ,
প্রতিষ্ঠা, শঠতা স্ফুরে',
    E'asthira
siddhānte, rohinu mojiyā,
hari-bhakti
roilo dūre
e
hṛdoye mātro, para-hiḿsā, mada,
pratiṣṭhā,
śaṭhatā sphure', E'астхіра
сіддга̄нте, рохіну моджійа̄,
харі-бгакті
роіло дӯре
е
хр̣дойе ма̄тро, пара-хіḿса̄, мада,
пратішт̣ха̄,
ш́ат̣хата̄ спхуре',
    E'', E'',
    E'I have not been able to give up any of these attachments. Thus my own faults
have been my down fall. My birth as a human being has been wasted. O Lord Hari,
what am I to do now?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'এ সব আগ্রহ, ছাডিতে নারিনু,
আপন দোষতে মরি
জনম বিফল, হৈল আমার,
এখন কি করি, হরি!', E'এ সব আগ্রহ, ছাডিতে নারিনু,
আপন দোষতে মরি
জনম বিফল, হৈল আমার,
এখন কি করি, হরি!',
    E'e
saba āgraha, chāḍite nārinu,
āpana
doṣate mari
janama
biphala, hoilo āmāra,
ekhona
ki kori, hari!', E'е
саба а̄ґраха, чха̄д̣іте на̄ріну,
а̄пана
дошате марі
джанама
біпхала, хоіло а̄ма̄ра,
екхона
кі корі, харі!',
    E'', E'',
    E'I am indeed fallen; but Your holy name is the savior of the fallen. Clinging to
that holy name, I have taken shelter at Your lotus feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'আমি তো পতিত, পতিত-পাবন,
তোমার পবিত্র নাম
সে সম্বন্ধ ধরি'', তোমার চরণে,
শরণ লৈনু হাম', E'আমি তো'' পতিত, পতিত-পাবন,
তোমার পবিত্র নাম
সে সম্বন্ধ ধরি'', তোমার চরণে,
শরণ লৈনু হাম',
    E'āmi
to'' patita, patita-pāvana,
tomāra
pavitra nāma
se
sambandha dhori'', tomāra caraṇe,
śaraṇa
loinu hāma', E'а̄мі
то'' патіта, патіта-па̄вана,
тома̄ра
павітра на̄ма
се
самбандга дгорі'', тома̄ра чаран̣е,
ш́аран̣а
лоіну ха̄ма',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 8, Song 3: Bhajane Utsaha Bhaktite Visvasa
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Bhajane Utsaha Bhaktite Visvasa', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'হরি হে!
ভজনে উত্সাহ, ভক্তিতে বিশ্বাস,
প্রেম-লভে ধৈর্য-ধন
ভক্তি-অনুকূল, কর্ম-প্রবর্তন,
অসত-সঙ্গ-বিসর্জন', E'হরি হে!
ভজনে উত্সাহ, ভক্তিতে বিশ্বাস,
প্রেম-লভে ধৈর্য-ধন
ভক্তি-অনুকূল, কর্ম-প্রবর্তন,
অসত-সঙ্গ-বিসর্জন',
    E'hari
he!
bhajane
utsāha, bhaktite viśvāsa,
prema-labhe
dhairya-dhana
bhakti-anukūla,
karma-pravartana,
asat-sańga-visarjana', E'харі
хе!
бгаджане
утса̄ха, бгактіте віш́ва̄са,
према-лабге
дгаірйа-дгана
бгакті-анукӯла,
карма-правартана,
асат-саńґа-вісарджана',
    E'', E'',
    E'Enthusiasm in devotional service, faith in the process of devotional service,
the treasure of patience in endeavoring to attain love of God, performing
activities conducive to pure devotion, abandoning the company of worldly
people, performing approved devotional practices  I have never possessed these
six devotional qualities. How, then, shall I give up the association of maya
and worship Your lotus feet, O Lord?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'ভক্তি-সদাচার, এই ছয গুন,
নাহিল আমার নাথ!
কেমনে ভজিব, তোমার চরণ,
ছাড়িয়া মায়ার সাথ', E'ভক্তি-সদাচার, এই ছয গুন,
নাহিল আমার নাথ!
কেমনে ভজিব, তোমার চরণ,
ছাড়িয়া মায়ার সাথ',
    E'bhakti-sadācāra,
ei chaya guna,
nāhilo
āmāra nātha!
kemone
bhojibo, tomāra caraṇa,
chāḍiyā
māyāra sātha', E'бгакті-сада̄ча̄ра,
еі чхайа ґуна,
на̄хіло
а̄ма̄ра на̄тха!
кемоне
бгоджібо, тома̄ра чаран̣а,
чха̄д̣ійа̄
ма̄йа̄ра са̄тха',
    E'', E'',
    E'Absorbed in abominable activities, I never kept company with sadhus. Now I
adopt the garb of the sadhus and instruct others. This is maya''s big joke.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'গর্হিত আচারে, রহিলাম মজি,
না করিনু সাধু-সঙ্গ
ল''য়ে সাধু-বেশ, আনে উপদেশি,
এ বড় মায়ার রঙ্গ', E'গর্হিত আচারে, রহিলাম মজি'',
না করিনু সাধু-সঙ্গ
ল''য়ে সাধু-বেশ, আনে উপদেশি,
এ বড় মায়ার রঙ্গ',
    E'garhita
ācāre, rohilāma moji'',
nā
korinu sādhu-sańga
lo''ye
sādhu-veśa, āne upadeśi,
e
boḍo māyāra rańga', E'ґархіта
а̄ча̄ре, рохіла̄ма моджі'',
на̄
коріну са̄дгу-саńґа
ло''йе
са̄дгу-веш́а, а̄не упадеш́і,
е
бод̣о ма̄йа̄ра раńґа',
    E'', E'',
    E'O
Lord Hari, in such a helpless condition surely I will obtain Your causeless
mercy. O when, under the shelter of my spiritual master, will I call out to You
with humble prayers?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'এ হেন দশায়, অহৈতুকী কৃপা,
তোমার পাইব, হরি!
শ্রী-গুরু-আশ্রয়ে, ডাকিব তোমায়,
কবে বা মিনতি করি''', E'এ হেন দশায়, অহৈতুকী কৃপা,
তোমার পাইব, হরি!
শ্রী-গুরু-আশ্রয়ে, ডাকিব তোমায়,
কবে বা মিনতি করি''',
    E'e
heno daśāya, ahaitukī kṛpā,
tomāra
pāibo, hari!
śrī-guru-āśroye,
ḍākibo tomāya,
kabe
vā minati kori''', E'е
хено даш́а̄йа, ахаітукı̄ кр̣па̄,
тома̄ра
па̄ібо, харі!
ш́рı̄-ґуру-а̄ш́ройе,
д̣а̄кібо тома̄йа,
кабе
ва̄ мінаті корі''',
    E'', E'',
    E'', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 8, Song 4: Dana Pratigraha Mitho
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Dana Pratigraha Mitho', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'হরি হে!
দান, প্রতিগ্রহ, মিথ গুপ্ত-কথা,
ভক্ষন, ভোজন-দান
সঙ্গের লক্ষন, এই ছয় হয়,
ইহাতে ভক্তির প্রান', E'হরি হে!
দান, প্রতিগ্রহ, মিথ গুপ্ত-কথা,
ভক্ষন, ভোজন-দান
সঙ্গের লক্ষন, এই ছয় হয়,
ইহাতে ভক্তির প্রান',
    E'hari
he!
dāna,
pratigraha, mitho gupta-kathā,
bhakṣana,
bhojana-dāna
sańgera
lakṣana, ei chaya hoya,
ihāte
bhaktira prāna', E'харі
хе!
да̄на,
пратіґраха, мітхо ґупта-катха̄,
бгакшана,
бгоджана-да̄на
саńґера
лакшана, еі чхайа хойа,
іха̄те
бгактіра пра̄на',
    E'', E'',
    E'O
Lord Hari, to offer a gift and receive one in return, to give and receive
spiritual food, to reveal one''s confidential thoughts and make confidential
inquiries  these are the six characteristics of loving association, and in
them is found the very soul of devotion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'তত্ত্ব না বুঝিয়ে, জ্ঞানে বা অজ্ঞানে,
অসতে এ সব করি''
ভক্তি হারাইনু, সংসারী হৈনু,
সুদূরে রহিলে হরি', E'তত্ত্ব না বুঝিয়ে, জ্ঞানে বা অজ্ঞানে,
অসতে এ সব করি''
ভক্তি হারাইনু, সংসারী হৈনু,
সুদূরে রহিলে হরি',
    E'tattva
nā bujhiye, jñāne vā ajñāne,
asate
e saba kori''
bhakti
hārāinu, saḿsārī hoinu,
sudūre
rohile hari', E'таттва
на̄ буджхійе, джн̃а̄не ва̄ аджн̃а̄не,
асате
е саба корі''
бгакті
ха̄ра̄іну, саḿса̄рı̄ хоіну,
судӯре
рохіле харі',
    E'', E'',
    E'I
have failed to understand the Absolute Truth, and by practicing these six
activities with non-devotees, either knowingly or unknowingly, I have lost all
devotion. Thus I have become a materialist. For me, You, O Lord, remain afar.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'কৃষ্ণ-ভক্ত-জনে, এই সঙ্গ-লক্ষনে,
আদর করিব যবে
ভক্তি-মহা-দেবী, আমার হৃদয়-
আসনে বসিবে তবে', E'কৃষ্ণ-ভক্ত-জনে, এই সঙ্গ-লক্ষনে,
আদর করিব যবে
ভক্তি-মহা-দেবী, আমার হৃদয়-
আসনে বসিবে তবে',
    E'kṛṣṇa-bhakta-jane,
ei sańga-lakṣane,
ādara
koribo jabe
bhakti-mahā-devī,
āmāra hṛdoya-
āsane
bosibe tabe', E'кр̣шн̣а-бгакта-джане,
еі саńґа-лакшане,
а̄дара
корібо джабе
бгакті-маха̄-девı̄,
а̄ма̄ра хр̣дойа-
а̄сане
босібе табе',
    E'', E'',
    E'The
day I cherish these activities of intimate association with the devotees of Sri
Krsna, that day the great goddess of devotion will ascend the throne of my
heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'যোষিত-সঙ্গী-জন, কৃষ্ণাভক্ত আর,
দুঙ্হু-সঙ্গ-পরিহরি''
তব ভক্ত-জন- সঙ্গ অনুক্ষন,
কবে বা হৈবে হরি!', E'যোষিত-সঙ্গী-জন, কৃষ্ণাভক্ত আর,
দুঙ্হু-সঙ্গ-পরিহরি''
তব ভক্ত-জন- সঙ্গ অনুক্ষন,
কবে বা হৈবে হরি!',
    E'yoṣit-sańgī-jana,
kṛṣṇābhakta āra,
duńhu-sańga-parihari''
tava
bhakta-jana- sańga anukṣana,
kabe
vā hoibe hari!', E'йошіт-саńґı̄-джана,
кр̣шн̣а̄бгакта а̄ра,
дуńху-саńґа-паріхарі''
тава
бгакта-джана- саńґа анукшана,
кабе
ва̄ хоібе харі!',
    E'', E'',
    E'When will I give up the company of those who are addicted to women and those
who are not devoted to You? When will I get the constant association of Your
devotees, O Lord?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 8, Song 5: Sanga Dosa Sunya
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Sanga Dosa Sunya', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'হরি হে!
সঙ্গ-দোষ-শূন্য, দীক্ষিতাদীক্ষিত,
যদি তব নাম গা''য়
মানসে আদর, করিব তাহারে,
জানি'' নিজ-জন তায়', E'হরি হে!
সঙ্গ-দোষ-শূন্য, দীক্ষিতাদীক্ষিত,
যদি তব নাম গা''য়
মানসে আদর, করিব তাহারে,
জানি'' নিজ-জন তায়',
    E'hari
he!
sańga-doṣa-śūnya,
dīkṣitādīkṣita,
jadi
tava nāma gā''ya
mānase
ādara, koribo tāhāre,
jāni''
nija-jana tāya', E'харі
хе!
саńґа-доша-ш́ӯнйа,
дı̄кшіта̄дı̄кшіта,
джаді
тава на̄ма ґа̄''йа
ма̄насе
а̄дара, корібо та̄ха̄ре,
джа̄ні''
ніджа-джана та̄йа',
    E'', E'',
    E'O Lord, I will mentally honor and consider as my brother one who avoids bad
company and sings Your holy name, be he formally initiated or not.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'দীক্ষিত হৈয়া, ভজে তুয়া পদ,
তাহারে প্রনতি করি
অনন্য-ভজনে, বিজ্ঞ যেই জন,
তাহারে সেবিব, হরি!', E'দীক্ষিত হৈয়া, ভজে তুয়া পদ,
তাহারে প্রনতি করি
অনন্য-ভজনে, বিজ্ঞ যেই জন,
তাহারে সেবিব, হরি!',
    E'dīkṣita
hoiyā, bhaje tuwā pada,
tāhāre
pranati kori
ananya-bhajane,
vijña yei jana,
tāhāre
sevibo, hari!', E'дı̄кшіта
хоійа̄, бгадже тува̄ пада,
та̄ха̄ре
пранаті корі
ананйа-бгаджане,
віджн̃а йеі джана,
та̄ха̄ре
севібо, харі!',
    E'', E'',
    E'I offer obeisances to that person who is initiated and worships Your lotus
feet, and I will serve, O Lord, anyone who is fixed in unalloyed devotion to
You.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'সর্ব-ভূতে সম, যে ভক্তের মতি,
তাহার দর্শনে মানি
আপনাকে ধন্য, সে সঙ্গ পাইয়া,
চরিতার্থ হৈলুঁ জানি', E'সর্ব-ভূতে সম, যে ভক্তের মতি,
তাহার দর্শনে মানি
আপনাকে ধন্য, সে সঙ্গ পাইয়া,
চরিতার্থ হৈলুঁ জানি',
    E'sarva-bhūte
sama, ye bhaktera mati,
tāhāra
darśane māni
āpanāke
dhanya, se sańga pāiyā,
caritārtha
hoiluń jāni', E'сарва-бгӯте
сама, йе бгактера маті,
та̄ха̄ра
дарш́ане ма̄ні
а̄пана̄ке
дганйа, се саńґа па̄ійа̄,
чаріта̄ртха
хоілуń джа̄ні',
    E'', E'',
    E'I consider myself greatly fortunate to even see that devotee who looks upon all
living beings equally. By obtaining his association I know that I become
successful in life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'নিষ্কপট-মতি, বৈষ্ণবের প্রতি,
এই ধর্ম কবে পা''ব
কবে সংসার- সিন্ধু-পার হ''য়ে,
তব ব্রজ-পুরে যা''ব', E'নিষ্কপট-মতি, বৈষ্ণবের প্রতি,
এই ধর্ম কবে পা''ব
কবে সংসার- সিন্ধু-পার হ''য়ে,
তব ব্রজ-পুরে যা''ব',
    E'niṣkapaṭa-mati,
vaiṣṇavera prati,
ei
dharma kabe pā''bo
kabe
saḿsāra- sindhu-pāra ho''ye,
tava
braja-pure jā''bo', E'нішкапат̣а-маті,
ваішн̣авера праті,
еі
дгарма кабе па̄''бо
кабе
саḿса̄ра- сіндгу-па̄ра хо''йе,
тава
браджа-пуре джа̄''бо',
    E'', E'',
    E'When will my mind become simple and inoffensive toward the Vaisnavas, and when
will I cross over the ocean of worldly existence to reach Your abode of Vraja?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 8, Song 6: Nira Dharma Gata
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Nira Dharma Gata', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'হরি হে!
নীর-ধর্ম-গত, জাহ্নবী-সলিলে,
পঙ্ক-ফেন দৃষ্ট হয়
তথাপি কখনো, ব্রহ্ম-দ্রব-ধর্ম,
সে সলিল না ছাড়য়', E'হরি হে!
নীর-ধর্ম-গত, জাহ্নবী-সলিলে,
পঙ্ক-ফেন দৃষ্ট হয়
তথাপি কখনো, ব্রহ্ম-দ্রব-ধর্ম,
সে সলিল না ছাড়য়',
    E'hari
he!
nīra-dharma-gata,
jāhnavī-salile,
pańka-phena
dṛṣṭa hoya
tathāpi
kakhona, brahma-drava-dharma,
se
salila nā chāḍoya', E'харі
хе!
нı̄ра-дгарма-ґата,
джа̄хнавı̄-саліле,
паńка-пхена
др̣шт̣а хойа
татха̄пі
какхона, брахма-драва-дгарма,
се
саліла на̄ чха̄д̣ойа',
    E'', E'',
    E'Mud and foam are seen in the waters of the Ganges, for that is the inherent
nature of river water. Yet Ganges water never loses its transcendental nature.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'বৈষ্নব-শরীর, অপ্রাকৃত সদা,
স্বভাব-বপুর ধর্মে
কভু নাহে জড়, তথাপি যে নিন্দে,
পড়ে সে বিষমাধর্মে', E'বৈষ্নব-শরীর, অপ্রাকৃত সদা,
স্বভাব-বপুর ধর্মে
কভু নাহে জড়, তথাপি যে নিন্দে,
পড়ে সে বিষমাধর্মে',
    E'vaiṣnava-śarīra,
aprākṛta sadā,
swabhāva-vapura
dharme
kabhu
nāhe jaḍa, tathāpi ye ninde,
poḍe
se viṣamādharme', E'ваішнава-ш́арı̄ра,
апра̄кр̣та сада̄,
свабга̄ва-вапура
дгарме
кабгу
на̄хе джад̣а, татха̄пі йе нінде,
под̣е
се вішама̄дгарме',
    E'', E'',
    E'One may likewise find defects in the body of a Vaisnava, yet his body is always
spiritual, never material. That person who criticizes the body of a Vaisnava
falls into deadly irreligion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'সেই অপরাধে, যমের যাতনা,
পায় জীব অবিরত
হে নন্দ-নন্দন! সেই অপরাধে,
যেন নাহি হয় হত', E'সেই অপরাধে, যমের যাতনা,
পায় জীব অবিরত
হে নন্দ-নন্দন! সেই অপরাধে,
যেন নাহি হয় হত',
    E'sei
aparādhe, yamera jātanā,
pāya
jīva avirata
he
nanda-nandana! sei aparādhe,
yeno
nāhi hoi hata', E'сеі
апара̄дге, йамера джа̄тана̄,
па̄йа
джı̄ва авірата
хе
нанда-нандана! сеі апара̄дге,
йено
на̄хі хоі хата',
    E'', E'',
    E'For such an offense, the fallen soul continuously suffers the tortures of Yamaraja,
lord of death. O youthful son of Nanda, I pray that I not be destroyed by
committing such an offense.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'তোমার বৈষ্ণব, বৈভব তোমার,
আমারে করুনা দয়া
তবে মোর গতি, হ''বে তব প্রতি,
পা''ব তব পদ-ছায়া', E'তোমার বৈষ্ণব, বৈভব তোমার,
আমারে করুনা দয়া
তবে মোর গতি, হ''বে তব প্রতি,
পা''ব তব পদ-ছায়া',
    E'tomāra
vaiṣṇava, vaibhava tomāra,
āmāre
korunā doyā
tabe
mora gati, ha''be tava prati,
pā''bo
tava pada-chāyā', E'тома̄ра
ваішн̣ава, ваібгава тома̄ра,
а̄ма̄ре
коруна̄ дойа̄
табе
мора ґаті, ха''бе тава праті,
па̄''бо
тава пада-чха̄йа̄',
    E'', E'',
    E'The Vaisnava is Yours, and he is Your glory. May he be merciful to me. Then my
life''s journey will lead to You, and I will obtain shelter in the shade of Your
lotus feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 8, Song 7: Ohe Vaisnava Thakura
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Ohe Vaisnava Thakura', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'ওহে! বৈষ্ণব ঠাকুর, দয়ার সাগর,
এ দাসে করুণা করি''
দিয়া পদ-ছায়া, শোধো হে আমায়,
তোমার চরণ ধরি', E'ওহে! বৈষ্ণব ঠাকুর, দয়ার সাগর,
এ দাসে করুণা করি''
দিয়া পদ-ছায়া, শোধো হে আমায়,
তোমার চরণ ধরি',
    E'ohe!
vaiṣṇaba ṭhākura, doyāra sāgara,
e dāse koruṇā kori''
diyā pada-chāyā, śodho he āmāya,
tomāra caraṇa dhori', E'охе!
ваішн̣аба т̣ха̄кура, дойа̄ра са̄ґара,
е да̄се корун̣а̄ корі''
дійа̄ пада-чха̄йа̄, ш́одго хе а̄ма̄йа,
тома̄ра чаран̣а дгорі',
    E'', E'',
    E'O venerable Vaisnava, devotee of Krsna! O ocean of mercy, be merciful unto your
servant. Give me the shade of your lotus feet and purify me. I hold on to your
lotus feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'ছয় বেগ দমি, ছয় দোষ শোধি,
ছয় গুণ দেহো দাসে
ছয় সত-সঙ্গ, দেহো হে আমারে,
বশেছি সঙ্গের আশে', E'ছয় বেগ দমি, ছয় দোষ শোধি,
ছয় গুণ দেহো দাসে
ছয় সত-সঙ্গ, দেহো হে আমারে,
বশেছি সঙ্গের আশে',
    E'chaya
bega domi'', chaya doṣa śodhi'',
chaya guṇa deho'' dāse
chaya sat-sańga, deho'' he āmāre,
bosechi sańgera āśe', E'чхайа
беґа домі'', чхайа доша ш́одгі'',
чхайа ґун̣а дехо'' да̄се
чхайа сат-саńґа, дехо'' хе а̄ма̄ре,
босечхі саńґера а̄ш́е',
    E'', E'',
    E'Teach me to control my six passions; rectify my six faults, bestow upon me the
six qualities, and offer unto me the six kinds of holy association.*', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'একাকী আমার, নাহি পায় বল,
হরি-নাম-সঙ্কীর্ত্তনে
তুমি কৃপা করি'', শ্রদ্ধা-বিন্দু দিয়া,
দেহো'' কৃষ্ণ-নাম-ধনে', E'একাকী আমার, নাহি পায় বল,
হরি-নাম-সঙ্কীর্ত্তনে
তুমি কৃপা করি'', শ্রদ্ধা-বিন্দু দিয়া,
দেহো'' কৃষ্ণ-নাম-ধনে',
    E'ekākī
āmāra, nāhi pāya bala,
hari-nāma-sańkīrtane
tumi kṛpā kori'', śraddhā-bindu diyā,
deho'' kṛṣṇa-nāma-dhane', E'ека̄кı̄
а̄ма̄ра, на̄хі па̄йа бала,
харі-на̄ма-саńкı̄ртане
тумі кр̣па̄ корі'', ш́раддга̄-бінду дійа̄,
дехо'' кр̣шн̣а-на̄ма-дгане',
    E'', E'',
    E'I do not find the strength to carry on alone the sankirtana of the holy name of
Hari. Please bless me by giving me just one drop of faith with which to obtain
the great treasure of the holy name of Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'কৃষ্ণ সে তোমার, কৃষ্ণ দিতে পার,
তোমার শকতি আছে
আমি তো'' কাঙ্গল, ''কৃষ্ণ'' ''কৃষ্ণ'' বলি'',
ধাই তব পাছে পাছে', E'কৃষ্ণ সে তোমার, কৃষ্ণ দিতে পার,
তোমার শকতি আছে
আমি তো'' কাঙ্গল, ''কৃষ্ণ'' ''কৃষ্ণ'' বলি'',
ধাই তব পাছে পাছে',
    E'kṛṣṇa
se tomāra, kṛṣṇa dīte pāro,
tomāra śakati āche
āmi to'' kāńgāla, ''kṛṣṇa''
''kṛṣṇa'' boli'',
dhāi tava pāche pāche
WORD
FOR WORD', E'кр̣шн̣а
се тома̄ра, кр̣шн̣а дı̄те па̄ро,
тома̄ра ш́акаті а̄чхе
а̄мі то'' ка̄ńґа̄ла, ''кр̣шн̣а''
''кр̣шн̣а'' болі'',
дга̄і тава па̄чхе па̄чхе
ВОРД
FОР ВОРД',
    E'', E'',
    E'Krsna is yours. You have the power to give Him to me. I am simply your servant
running behind you shouting, "Krsna! Krsna!"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 8, Song 8: Tomare Bhuliya
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Tomare Bhuliya', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 8;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'হরি হে!
তোমারে ভুলিয়া, অবিদ্যা-পীড়ায়,
পীড়িত রসনা মোর
কৃষ্ণ-নাম-সুধা, ভাল নাহি লাগে,
বিষয়-সুখতে ভর', E'হরি হে!
তোমারে ভুলিয়া, অবিদ্যা-পীড়ায়,
পীড়িত রসনা মোর
কৃষ্ণ-নাম-সুধা, ভাল নাহি লাগে,
বিষয়-সুখতে ভর',
    E'hari
he!
tomāre
bhuliyā, avidyā-pīḍāya,
pīḍita
rasanā mora
kṛṣṇa-nāma-sudhā,
bhālo nāhi lāge,
viṣaya-sukhate
bhora', E'харі
хе!
тома̄ре
бгулійа̄, авідйа̄-пı̄д̣а̄йа,
пı̄д̣іта
расана̄ мора
кр̣шн̣а-на̄ма-судга̄,
бга̄ло на̄хі ла̄ґе,
вішайа-сукхате
бгора',
    E'', E'',
    E'O
Lord Hari, because I forgot You my tongue has become afflicted with the disease
of ignorance. I cannot relish the nectar of Your holy name, for I have become
addicted to the taste of worldly pleasures.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'প্রতি-দিন যদি, আদর করিয়া,
সে নাম কীর্তন করি
সিতপল যেন, নাশি'' রোগ-মূল,
ক্রমে স্বাদু হয়, হরি!', E'প্রতি-দিন যদি, আদর করিয়া,
সে নাম কীর্তন করি
সিতপল যেন, নাশি'' রোগ-মূল,
ক্রমে স্বাদু হয়, হরি!',
    E'prati-dina
jadi, ādara koriyā,
se
nāma kīrtana kori
sitapala
jeno, nāśi'' roga-mūla,
krame
swādu hoya, hari!', E'праті-діна
джаді, а̄дара корійа̄,
се
на̄ма кı̄ртана корі
сітапала
джено, на̄ш́і'' роґа-мӯла,
краме
сва̄ду хойа, харі!',
    E'', E'',
    E'O
Lord Hari, if I sing Your holy name aloud every day with great respect, then as
sugar candy taken medicinally destroys the very disease which makes it taste
bitter (jaundice), so Your holy name will cure my spiritual disease and allow
me to gradually taste His sweetness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'দুর্দৈব আমার, সে নামে আদর,
না হৈল, দয়াময়!
দশ অপরাধ, আমার দুর্দৈব,
কেমনে হৈবে ক্ষয়', E'দুর্দৈব আমার, সে নামে আদর,
না হৈল, দয়াময়!
দশ অপরাধ, আমার দুর্দৈব,
কেমনে হৈবে ক্ষয়',
    E'durdaiva
āmāra, se nāme ādara,
nā
hoilo, doyāmoya!
daśa
aparādha, āmāra durdaiva,
kemone
hoibe kṣoya', E'дурдаіва
а̄ма̄ра, се на̄ме а̄дара,
на̄
хоіло, дойа̄мойа!
даш́а
апара̄дга, а̄ма̄ра дурдаіва,
кемоне
хоібе кшойа',
    E'', E'',
    E'O
merciful Lord, how great is my misfortune that I feel no appreciation for Your
holy name! In such a lamentable state, how will I be freed from committing the
ten offenses to the holy name?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'অনুদিন যেন, তব নাম গাই,
ক্রমেতে কৃপায় তব
অপরাধ যা''বে, নামে রুচি হ''বে,
আস্বাদিব নামাসব', E'অনুদিন যেন, তব নাম গাই,
ক্রমেতে কৃপায় তব
অপরাধ যা''বে, নামে রুচি হ''বে,
আস্বাদিব নামাসব',
    E'anudina
jeno, tava nāma gāi,
kramete
kṛpāya tava
aparādha
jā''be, nāme ruci ha''be,
āswādibo
nāmāsava', E'анудіна
джено, тава на̄ма ґа̄і,
крамете
кр̣па̄йа тава
апара̄дга
джа̄''бе, на̄ме ручі ха''бе,
а̄сва̄дібо
на̄ма̄сава',
    E'', E'',
    E'If
I sing Your holy name every day, by Your mercy the ten offenses will gradually
disappear. A taste for Your holy name will grow within me, and then I will
taste the intoxicating spirit of the name.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 8, Song 9: Sri Rupa Gosai Sri Guru Rupete
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 9, E'Sri Rupa Gosai Sri Guru Rupete', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 9;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'হরি হে!
শ্রী-রূপ-গোসাঞি, শ্রী-গুরু-রূপেতে,
শিক্ষা দিল মোর কানে
জান মোর কথা, নামের কাঙ্গাল!
রতি পা''বে নাম-গানে', E'হরি হে!
শ্রী-রূপ-গোসাঞি, শ্রী-গুরু-রূপেতে,
শিক্ষা দিল মোর কানে
জান মোর কথা, নামের কাঙ্গাল!
রতি পা''বে নাম-গানে',
    E'hari
he!
śrī-rūpa-gosāi,
śrī-guru-rūpete,
śikṣā
dila mora kāne
jāno
mora kathā, nāmera kāńgāla!
rati
pā''be nāma-gāne', E'харі
хе!
ш́рı̄-рӯпа-ґоса̄і,
ш́рı̄-ґуру-рӯпете,
ш́ікша̄
діла мора ка̄не
джа̄но
мора катха̄, на̄мера ка̄ńґа̄ла!
раті
па̄''бе на̄ма-ґа̄не',
    E'', E'',
    E'O Lord Hari, Sri Rupa Gosvami, in the form of the spiritual master, gave these
instructions to my ears: Try to understand my words, O you who begs for the
gift of the holy name, for by these instructions you will develop attraction
for chanting the holy name.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'কৃষ্ণ-নাম-রূপ- গুন-সুচরিত,
পরম যতনে করি''
রসনা-মানসে, করহ নিয়োগ,
ক্রম-বিধি অনুসরি''', E'কৃষ্ণ-নাম-রূপ- গুন-সুচরিত,
পরম যতনে করি''
রসনা-মানসে, করহ নিয়োগ,
ক্রম-বিধি অনুসরি''',
    E'kṛṣṇa-nāma-rūpa-
guna-sucarita,
parama
jatane kori''
rasanā-mānase,
koraho niyoga,
krama-vidhi
anusari''', E'кр̣шн̣а-на̄ма-рӯпа-
ґуна-сучаріта,
парама
джатане корі''
расана̄-ма̄насе,
корахо нійоґа,
крама-відгі
анусарі''',
    E'', E'',
    E'Follow the scriptural rules and regulations and engage your tongue and mind in
carefully chanting and remembering the holy names, divine forms, qualities, and
wonderful pastimes of Lord Krishna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'ব্রজে করি বাস, রাগানুগা হৈয়া,
স্মরণ কীর্তন কর
এ নিখিল কাল, করহ জাপন,
উপদেশ-সার ধর''', E'ব্রজে করি'' বাস, রাগানুগা হৈয়া,
স্মরণ কীর্তন কর
এ নিখিল কাল, করহ জাপন,
উপদেশ-সার ধর''',
    E'braje
kori'' bāsa, rāgānugā hoiyā,
smaraṇa
kīrtana koro
e
nikhila kāla, koraho jāpana,
upadeśa-sāra
dharo'' ', E'брадже
корі'' ба̄са, ра̄ґа̄нуґа̄ хоійа̄,
смаран̣а
кı̄ртана коро
е
нікхіла ка̄ла, корахо джа̄пана,
упадеш́а-са̄ра
дгаро'' ',
    E'', E'',
    E'Dwell in the holy land of Vraja, cultivate spontaneous loving devotion
(raganuga-bhakti), and spend your every moment chanting and remembering the
glories of Sri Hari. Just accept these as the essence of all instructions.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'হা! রূপ-গোসাঞি, দয়া করি কবে,
দিবে দিনে ব্রজ-বাস
রাগাত্মিক তুমি, তব পদানুগ,
হৈতে দাসের আশা', E'হা! রূপ-গোসাঞি, দয়া করি'' কবে,
দিবে দিনে ব্রজ-বাস
রাগাত্মিক তুমি, তব পদানুগ,
হৈতে দাসের আশা',
    E'hā!
rūpa-gosāi, doyā kori'' kabe,
dibe
dine braja-bāsa
rāgātmika
tumi, tava padānuga,
hoite
dāsera āśā', E'ха̄!
рӯпа-ґоса̄і, дойа̄ корі'' кабе,
дібе
діне браджа-ба̄са
ра̄ґа̄тміка
тумі, тава пада̄нуґа,
хоіте
да̄сера а̄ш́а̄',
    E'', E'',
    E'O Rupa Gosvami, when out of your causeless mercy, will you enable this poor
wretched soul to reside in Vrndavana? You are a ragatmika devotee, an eternally
liberated, intimate associate of Radha and Krsna. This humble servant of yours
desires to become a follower at your lotus feet', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 8, Song 10: Gurudeva Boro Krpa Kori
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 10, E'Gurudeva Boro Krpa Kori', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 10;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'গুরুদেব!
বড় কৃপা করি'', গৌড়-বন মাঝে,
গোদ্রুমে দিয়াছ স্থান
আজ্ঞা দিল মোরে, এই ব্রজে বসি'',
হরি-নাম কর গান', E'গুরুদেব!
বড় কৃপা করি'', গৌড়-বন মাঝে,
গোদ্রুমে দিয়াছ স্থান
আজ্ঞা দিল মোরে, এই ব্রজে বসি'',
হরি-নাম কর গান',
    E'gurudev!
boḍo
kṛpā kori'', gauḍa-vana mājhe,
godrume
diyācho sthāna
ājñā
dila more, ei braje bosi'',
hari-nāma
koro gāna', E'ґурудев!
бод̣о
кр̣па̄ корі'', ґауд̣а-вана ма̄джхе,
ґодруме
дійа̄чхо стха̄на
а̄джн̃а̄
діла море, еі брадже босі'',
харі-на̄ма
коро ґа̄на',
    E'', E'',
    E'Gurudeva! Because you are so merciful, you gave me a place in Godruma amid the woodlands
of Gauda, with this order to fulfill: Dwell here in this Vrndavana and sing
the holy name of Hari.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'কিন্তু কবে প্রভু, যোগ্যতা অর্পিবে,
এ দাসেরে দয়া করি''
চিত্ত স্থির হবে, সকল সহিব,
একান্তে ভজিব হরি', E'কিন্তু কবে প্রভু, যোগ্যতা অর্পিবে,
এ দাসেরে দয়া করি''
চিত্ত স্থির হবে, সকল সহিব,
একান্তে ভজিব হরি',
    E'kintu
kabe prabhu, yogyatā arpibe,
e
dāsere doyā kori''
citta
sthira habe, sakala sohibo,
ekānte
bhajibo hari', E'кінту
кабе прабгу, йоґйата̄ арпібе,
е
да̄сере дойа̄ корі''
чітта
стхіра хабе, сакала сохібо,
ека̄нте
бгаджібо харі',
    E'', E'',
    E'But
when, O master, out of your great mercy, will you bestow upon this servant of
yours the spiritual competence to fulfill that order? When will my mind become
tranquil and fixed? When will I endure all hardships and serve Lord Hari
without distractions?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'শৈশব-যৌবনে, জড়-সুখ-সঙ্গে,
অভ্যাস হৈল মন্দ
নিজ-কর্ম-দোষে, এ দেহ হৈল,
ভজনের প্রতিবন্ধ', E'শৈশব-যৌবনে, জড়-সুখ-সঙ্গে,
অভ্যাস হৈল মন্দ
নিজ-কর্ম-দোষে, এ দেহ হৈল,
ভজনের প্রতিবন্ধ',
    E'śaiśava-yauvane,
jaḍa-sukha-sańge,
abhyāsa
hoilo manda
nija-karma-doṣe,
e deho hoilo,
bhajanera
pratibandha', E'ш́аіш́ава-йауване,
джад̣а-сукха-саńґе,
абгйа̄са
хоіло манда
ніджа-карма-доше,
е дехо хоіло,
бгаджанера
пратібандга',
    E'', E'',
    E'Due
to attachment to worldly pleasures in childhood and youth, I have developed bad
habits. Because of these sinful acts my body has become an impediment to the
service of the Supreme Lord.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'বার্ধক্যে এখন, পঞ্চ-রোগে হত,
কেমনে ভজিব বল''
কাঁদিয়া কাঁদিয়া, তোমার চরণে,
পড়িয়াছি সুবিহ্বল', E'বার্ধক্যে এখন, পঞ্চ-রোগে হত,
কেমনে ভজিব বল''
কাঁদিয়া কাঁদিয়া, তোমার চরণে,
পড়িয়াছি সুবিহ্বল',
    E'vārdhakye
ekhona, pañca-roge hata,
kemone
bhojibo bolo''
kāńdiyā
kāńdiyā, tomāra caraṇe,
poḍiyāchi
suvihvala', E'ва̄рдгакйе
екхона, пан̃ча-роґе хата,
кемоне
бгоджібо боло''
ка̄ńдійа̄
ка̄ńдійа̄, тома̄ра чаран̣е,
под̣ійа̄чхі
сувіхвала',
    E'', E'',
    E'Now, in old age, afflicted by the five-fold illnesses, how will I serve the
Lord? O master, please tell me. I have fallen at your feet weeping, overwhelmed
by anxiety.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 8, Song 11: Gurudeva Krpa Bindu Diya
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 11, E'Gurudeva Krpa Bindu Diya', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 11;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'গুরুদেব!
কৃপা-বিন্দু দিয়া, কর'' এই দাসে,
তৃণাপেখা অতি হীন
সকল সহনে, বল দিয়া কর'',
নিজ-মানে স্পৃহা-হীন', E'গুরুদেব!
কৃপা-বিন্দু দিয়া, কর'' এই দাসে,
তৃণাপেখা অতি হীন
সকল সহনে, বল দিয়া কর'',
নিজ-মানে স্পৃহা-হীন',
    E'gurudev!
kṛpā-bindu diyā, koro'' ei dāse,
tṛṇāpekhā ati hīna
sakala sahane, bala diyā koro'',
nija-māne spṛhā-hīna', E'ґурудев!
кр̣па̄-бінду дійа̄, коро'' еі да̄се,
тр̣н̣а̄пекха̄ аті хı̄на
сакала сахане, бала дійа̄ коро'',
ніджа-ма̄не спр̣ха̄-хı̄на',
    E'', E'',
    E'Gurudeva, O spiritual master! Give to this servant just one drop of mercy. I am
lower than a blade of grass. Give me all help. Give me strength. Let me be as
you are, without desires or aspirations.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'সকলে সম্মান করিতে শকতি,
দেহ'' নাথ! যথাযথ
তবে ত'' গাইব, হরি-নাম-সুখে,
অপরাধ হ ''বে হত', E'সকলে সম্মান করিতে শকতি,
দেহ'' নাথ! যথাযথ
তবে ত'' গাইব, হরি-নাম-সুখে,
অপরাধ হ ''বে হত',
    E'sakale
sammāna korite śakati,
deho'' nātha! jathājatha
tabe to'' gāibo, hari-nāma-sukhe,
aparādha ha ''be hata', E'сакале
самма̄на коріте ш́акаті,
дехо'' на̄тха! джатха̄джатха
табе то'' ґа̄ібо, харі-на̄ма-сукхе,
апара̄дга ха ''бе хата',
    E'', E'',
    E'I
offer you all respects, for thus I may have the energy to know you correctly.
Then, by chanting the holy name in great ecstasy, all my offenses will cease.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'কবে হেন কৃপা, লভিয়া এ জন,
কৃতার্থ হৈবে, নাথ!
শক্তি-বুদ্ধি-হীন, আমি অতি দীন,
কর'' মোরে আত্ম-সাথ', E'কবে হেন কৃপা, লভিয়া এ জন,
কৃতার্থ হৈবে, নাথ!
শক্তি-বুদ্ধি-হীন, আমি অতি দীন,
কর'' মোরে আত্ম-সাথ',
    E'kabe
heno kṛpā, labhiyā e jana,
kṛtārtha hoibe, nātha!
śakti-buddhi-hīna, āmi ati dīna,
koro'' more ātma-sātha', E'кабе
хено кр̣па̄, лабгійа̄ е джана,
кр̣та̄ртха хоібе, на̄тха!
ш́акті-буддгі-хı̄на, а̄мі аті дı̄на,
коро'' море а̄тма-са̄тха',
    E'', E'',
    E'When will such mercy fall to this one who is weak and devoid of intelligence?
Allow me to be with you.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'জোগ্যতা-বিচারে, কিছু নাহি পাই,
তোমার করুণা-সার
করুণা না হৈলে, কান্দিয়া কান্দিয়া,
প্রাণ না রাখিব আর', E'জোগ্যতা-বিচারে, কিছু নাহি পাই,
তোমার করুণা-সার
করুণা না হৈলে, কান্দিয়া কান্দিয়া,
প্রাণ না রাখিব আর',
    E'jogyatā-vicāre,
kichu nāhi pāi,
tomāra karuṇā-sāra
karuṇā nā hoile, kāndiyā kāndiyā,
prāṇa nā rākhibo āra
WORD
FOR WORD', E'джоґйата̄-віча̄ре,
кічху на̄хі па̄і,
тома̄ра карун̣а̄-са̄ра
карун̣а̄ на̄ хоіле, ка̄ндійа̄ ка̄ндійа̄,
пра̄н̣а на̄ ра̄кхібо а̄ра
ВОРД
FОР ВОРД',
    E'', E'',
    E'If
you examine me, you will find no qualities. Your mercy is all that I am made
of. If you are not merciful unto me, I can only weep, and I will not be able to
maintain my life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 8, Song 12: Gurudeva Kabe Mora Sei
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 12, E'Gurudeva Kabe Mora Sei', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 12;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'গুরুদেব!
কবে মোর সেই দিন হ''বে
মন স্থির করি'', নির্জনে বসিয়া,
কৃষ্ণ-নাম গা''ব
যবে
সংসার-ফুকার, কানে না
পষিবে,
দেহ-রোগ দূরে র''বে', E'গুরুদেব!
কবে মোর সেই দিন হ''বে
মন স্থির করি'', নির্জনে বসিয়া,
কৃষ্ণ-নাম গা''ব
যবে
সংসার-ফুকার, কানে না
পষিবে,
দেহ-রোগ দূরে র''বে',
    E'gurudev!
kabe
mora sei din ha''be
mana
sthira kori'', nirjane bosiyā,
kṛṣṇa-nāma
gā''bo jabe
saḿsāra-phukāra,
kāne nā poṣibe,
deho-roga
dūre ro''be', E'ґурудев!
кабе
мора сеі дін ха''бе
мана
стхіра корі'', нірджане босійа̄,
кр̣шн̣а-на̄ма
ґа̄''бо джабе
саḿса̄ра-пхука̄ра,
ка̄не на̄ пошібе,
дехо-роґа
дӯре ро''бе',
    E'', E'',
    E'Gurudeva! O spiritual master! When, with a steady mind in a secluded place,
will I sing the name of Sri Krsna? When will the pandemonium of worldly
existence no longer echo in my ears and the diseases of the body remain far
away? When will that day be mine?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'হরে কৃষ্ণ বলি, গাহিতে গাহিতে,
নয়নে বহিবে লোর
দেহেতে পুলক, উদিত হৈবে,
প্রেমেতে করিবে ভোর', E'হরে কৃষ্ণ'' বলি'', গাহিতে গাহিতে,
নয়নে বহিবে লোর
দেহেতে পুলক, উদিত হৈবে,
প্রেমেতে করিবে ভোর',
    E'`hare
kṛṣṇa'' boli'', gāhite gāhite,
nayane
bohibe lora
dehete
pulaka, udita hoibe,
premete
koribe bhora', E'`харе
кр̣шн̣а'' болі'', ґа̄хіте ґа̄хіте,
найане
бохібе лора
дехете
пулака, удіта хоібе,
премете
корібе бгора',
    E'', E'',
    E'When I chant Hare Krsna, tears of love will flow from my eyes and ecstatic
rapture will arise within my body, causing my hair to stand on end and my body
to become overwhelmed with divine love.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'গদ-গদ
বানী, মুখে বাহিরিবে,
কাঁপিবে শরীর মম
ঘর্ম মুহুর্মুহুঃ, বির্বর্ন হৈবে,
স্তম্ভিত প্রলয় সম', E'গদ-গদ
বানী, মুখে বাহিরিবে,
কাঁপিবে শরীর মম
ঘর্ম মুহুর্মুহুঃ, বির্বর্ন হৈবে,
স্তম্ভিত প্রলয় সম',
    E'gada-gada
vānī, mukhe bāhiribe,
kāńpibe
śarīra mama
gharma
muhur muhuḥ, virvarna hoibe,
stambhita
pralaya sama', E'ґада-ґада
ва̄нı̄, мукхе ба̄хірібе,
ка̄ńпібе
ш́арı̄ра мама
ґгарма
мухур мухух̣, вірварна хоібе,
стамбгіта
пралайа сама',
    E'', E'',
    E'Faltering words choked with emotion will issue from my mouth. My body will
tremble, constantly perspire, turn pale and discolored, and become stunned. All
of this will be like a devastation of ecstatic love and cause me to fall
unconscious.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'নিষ্কপটে হেন, দশা কবে হবে,
নিরন্তর নাম গাব
আবেশে রহিয়া, দেহ-যাত্রা করি,
তোমার করুনা পাব', E'নিষ্কপটে হেন, দশা কবে হবে,
নিরন্তর নাম গাব
আবেশে রহিয়া, দেহ-যাত্রা করি,
তোমার করুনা পাব',
    E'niṣkapaṭe
heno, daśā kabe ha''be,
nirantara
nāma gā''bo
āveśe
rohiyā, deha-yātrā kori'',
tomāra
karunā pā''bo', E'нішкапат̣е
хено, даш́а̄ кабе ха''бе,
нірантара
на̄ма ґа̄''бо
а̄веш́е
рохійа̄, деха-йа̄тра̄ корі'',
тома̄ра
каруна̄ па̄''бо',
    E'', E'',
    E'When will such a genuine ecstatic condition be mine? I will constantly sing the
holy name and remain absorbed in profound devotion while maintaining the
material body. In this way I will obtain your mercy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 8, Song 13: Gurudeva Kabe Tava Karuna
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 13, E'Gurudeva Kabe Tava Karuna', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 13;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'গুরুদেব!
কবে তব করুনা-প্রকাশে
শ্রী-গৌরাঙ্গ-লীলা, হয় নিত্য-তত্ত্ব,
এই দৃঢ বিশ্বাসে
হরি হরি'' বলি'', গোদ্রুম-কাননে,
ভ্রমিব দর্শন-আশে', E'গুরুদেব!
কবে তব করুনা-প্রকাশে
শ্রী-গৌরাঙ্গ-লীলা, হয় নিত্য-তত্ত্ব,
এই দৃঢ বিশ্বাসে
হরি হরি'' বলি'', গোদ্রুম-কাননে,
ভ্রমিব দর্শন-আশে',
    E'gurudev!
kabe
tava karunā-prakāśe
śrī-gaurāńga-līlā,
hoya nitya-tattwa,
ei
dṛḍha viśvāse
`hari
hari'' boli'', godruma-kānane,
bhromibo
darśana-āśe', E'ґурудев!
кабе
тава каруна̄-прака̄ш́е
ш́рı̄-ґаура̄ńґа-лı̄ла̄,
хойа нітйа-таттва,
еі
др̣д̣ха віш́ва̄се
`харі
харі'' болі'', ґодрума-ка̄нане,
бгромібо
дарш́ана-а̄ш́е',
    E'', E'',
    E'Gurudeva! O spiritual master! Lord Gauranga''s transcendental pastimes are
eternal realities. I wait for the day when, with this firm faith manifested by
your mercy, I will wander through the groves of Godruma, chanting Hari! Hari!
and hoping to behold those pastimes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'নিতাই, গৌরাঙ্গ, অদ্বৈত, শ্রীবাস,
গদাধর,-পঞ্চ-জন
কৃষ্ণ-নাম-রসে, ভাসা''বে জগত,
করি'' মহা-সঙ্কীর্তন', E'নিতাই, গৌরাঙ্গ, অদ্বৈত, শ্রীবাস,
গদাধর,-পঞ্চ-জন
কৃষ্ণ-নাম-রসে, ভাসা''বে জগত,
করি'' মহা-সঙ্কীর্তন',
    E'nitāi,
gaurāńga, adwaita, śrīvāsa,
gadādhara,pañca-jana
kṛṣṇa-nāma-rase,
bhāsā''be jagat,
kori''
mahā-sańkīrtana', E'ніта̄і,
ґаура̄ńґа, адваіта, ш́рı̄ва̄са,
ґада̄дгара,пан̃ча-джана
кр̣шн̣а-на̄ма-расе,
бга̄са̄''бе джаґат,
корі''
маха̄-саńкı̄ртана',
    E'', E'',
    E'The Panca-tattva (Nitai, Gauranga, Advaita, Srivasa and Gadadhara) will flood
the entire universe with the intoxicating nectar of the holy name of Sri Krsna
by performing a maha-sankirtana.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'নর্তন-বিলাস, মৃদঙ্গ-বাদন,
শুনিব আপন-কানে
দেখিয়া দেখিয়া, সে লীলা-মাধুরী,
ভাসিব প্রেমের বানে', E'নর্তন-বিলাস, মৃদঙ্গ-বাদন,
শুনিব আপন-কানে
দেখিয়া দেখিয়া, সে লীলা-মাধুরী,
ভাসিব প্রেমের বানে',
    E'nartana-vilāsa,
mṛdańga-vādana,
śunibo
āpana-kāne
dekhiyā
dekhiyā, se līlā-mādhurī,
bhāsibo
premera bāne', E'нартана-віла̄са,
мр̣даńґа-ва̄дана,
ш́унібо
а̄пана-ка̄не
декхійа̄
декхійа̄, се лı̄ла̄-ма̄дгурı̄,
бга̄сібо
премера ба̄не',
    E'', E'',
    E'In my ears I will hear the sounds of dancing and the playing of the mrdangas.
By constantly beholding the sweetness and beauty of that pastime of Lord
Gauranga''s, I will swim in the flood tide of divine love.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'না দেখি আবার, সে লীলা-রতন,
কাঁদি হা গৌরাঙ্গ! বলি
আমারে বিষয়ী, পাগল বলিয়া,
অঙ্গেতে দিবেক ধূলি', E'না দেখি'' আবার, সে লীলা-রতন,
কাঁদি হা গৌরাঙ্গ! বলি''
আমারে বিষয়ী, পাগল বলিয়া,
অঙ্গেতে দিবেক ধূলি',
    E'nā
dekhi'' ābāra, se līlā-ratana,
kāńdi
hā gaurāńga! boli''
āmāre
viṣayī, pāgala boliyā,
ańgete
dibeka dhūli', E'на̄
декхі'' а̄ба̄ра, се лı̄ла̄-ратана,
ка̄ńді
ха̄ ґаура̄ńґа! болі''
а̄ма̄ре
вішайı̄, па̄ґала болійа̄,
аńґете
дібека дгӯлі',
    E'', E'',
    E'Materialists will throw dirt at my body and proclaim me thoroughly mad. For
being again bereft of seeing the jewel of that pastime, I shall weep and cry
out, O my Lord Gauranga!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 9, Song 1: Kabe Gaura Vane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 9;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Kabe Gaura Vane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'কবে গৌর-বনে, সুরধুনী-তটে,
''হা রাধে হা কৃষ্ণ'' বোলে''
কান্দিয়া বেড়াবো, দেহ-সুখ ছাড়ি'',
নানা লতা-তরু-তলে', E'কবে গৌর-বনে, সুরধুনী-তটে,
''হা রাধে হা কৃষ্ণ'' বোলে''
কান্দিয়া বেড়াবো, দেহ-সুখ ছাড়ি'',
নানা লতা-তরু-তলে',
    E'kabe
gaura-vane, suradhunī-taṭe,
`hā rādhe hā kṛṣṇa'' bole''
kāńdiyā beḍā''bo, deho-sukha chāḍi'',
nānā latā-taru-tale', E'кабе
ґаура-ване, сурадгунı̄-тат̣е,
`ха̄ ра̄дге ха̄ кр̣шн̣а'' боле''
ка̄ńдійа̄ бед̣а̄''бо, дехо-сукха чха̄д̣і'',
на̄на̄ лата̄-тару-тале',
    E'', E'',
    E'When, oh when will I wander here and there, weeping under the shade of the trees
and creepers along the banks of the celestial Ganges River in Navadvipa? I will
cry out "Oh Radhe! Oh Krsna!", and I will completely forget about all
the so-called pleasures of this material body.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'স্ব-পচ-গৃহেতে, মাগিয়া খা‌ইবো,
পিবো সরস্বতী-জল
পুলিনে পুলিনে, গড়াগড়ি দিবো,
করি'' কৃষ্ণ-কোলাহল', E'স্ব-পচ-গৃহেতে, মাগিয়া খা‌ইবো,
পিবো সরস্বতী-জল
পুলিনে পুলিনে, গড়াগড়ি দিবো,
করি'' কৃষ্ণ-কোলাহল',
    E'śwa-paca-gṛhete,
māgiyā khāibo,
pibo saraswatī-jala
puline puline, gaḍā-gaḍi dibo,
kori'' kṛṣṇa-kolāhala', E'ш́ва-пача-ґр̣хете,
ма̄ґійа̄ кха̄ібо,
пібо сарасватı̄-джала
пуліне пуліне, ґад̣а̄-ґад̣і дібо,
корі'' кр̣шн̣а-кола̄хала',
    E'', E'',
    E'When will I be able to live so simply by begging some food from the homes of
the untouchables who live here and there? I will drink the water of the
Sarasvati, and in ecstasy I will roll to and fro on the banks of the river,
raising a loud uproar of "Krsna! Krsna!"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'ধাম-বাসী জনে, প্রণতি করিয়া,
মাগিবো কৃপার লেশ
বৈষ্ণব-চরণ-রেণূ গায় মাখি'',
ধোরি'' অবধূত-বেশ', E'ধাম-বাসী জনে, প্রণতি করিয়া,
মাগিবো কৃপার লেশ
বৈষ্ণব-চরণ-রেণূ গায় মাখি'',
ধোরি'' অবধূত-বেশ',
    E'dhāma-bāsī
jane, pranati koriyā,
māgibo kṛpāra leśa
vaiṣṇava-caraṇa- reṇu gāya mākhi'',
dhori'' avadhūta-veśa', E'дга̄ма-ба̄сı̄
джане, пранаті корійа̄,
ма̄ґібо кр̣па̄ра леш́а
ваішн̣ава-чаран̣а- рен̣у ґа̄йа ма̄кхі'',
дгорі'' авадгӯта-веш́а',
    E'', E'',
    E'When will I bow down to all the inhabitants of the holy land of Navadvipa and
receive a bit of their causeless mercy? I will smear the dust of the Vaisnavas''
lotus feet all over my body, and I will wear the dress of a mad wandering
mendicant.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'গৌড়-ব্রজ-জনে, ভেদ না দেখিব,
হো‌ইবো বরজ-বাসী
ধামের স্বরূপ, স্ফুরিবে নয়নে,
হো‌ইবো রাধার দাসী', E'গৌড়-ব্রজ-জনে, ভেদ না দেখিব,
হো‌ইবো বরজ-বাসী
ধামের স্বরূপ, স্ফুরিবে নয়নে,
হো‌ইবো রাধার দাসী',
    E'gauḍa-braja-jane,
bheda nā dekhibo,
hoibo baraja-bāsī
dhāmera swarūpa, sphuribe nayane,
hoibo rādhāra dāsī
WORD
FOR WORD', E'ґауд̣а-браджа-джане,
бгеда на̄ декхібо,
хоібо бараджа-ба̄сı̄
дга̄мера сварӯпа, спхурібе найане,
хоібо ра̄дга̄ра да̄сı̄
ВОРД
FОР ВОРД',
    E'', E'',
    E'When I factually observe that the transcendental lane of Navadvipa is not
different from Sri Vraja-bhumi, then I shall be transformed into a Vrajabasi
also. Then I will see the true form of the transcendental realm opening up
before my very eyes, and I will thus become one of the maidservants of Srimati
Radharanai.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 9, Song 2: Dekhite Dekhite
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 9;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Dekhite Dekhite', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'দেখিতে দেখিতে, ভুলিব বা কবে,
নিজ-স্থূল-পরিচয়
নয়নে হেরিব, ব্রজ-পুর-শোভা,
নিত্য চিদ-আনন্দ-ময়', E'দেখিতে দেখিতে, ভুলিব বা কবে,
নিজ-স্থূল-পরিচয়
নয়নে হেরিব, ব্রজ-পুর-শোভা,
নিত্য চিদ-আনন্দ-ময়',
    E'dekhite
dekhite, bhulibo vā kabe,
nija-sthūla-paricoya
nayane
heribo, braja-pura-śobhā,
nitya
cid-ānanda-moya', E'декхіте
декхіте, бгулібо ва̄ кабе,
ніджа-стхӯла-парічойа
найане
херібо, браджа-пура-ш́обга̄,
нітйа
чід-а̄нанда-мойа',
    E'', E'',
    E'When will I be able to leave this plane of my gross bodily identity far behind?
Within a split second, I will completely forget about all these false external
affairs and behold the exquisite beauty of the transcendental realm of Vraja,
which is completely paraded with eternal, conscious bliss.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'বৃষভানু-পুরে, জনম লৈব,
যাবটে বিবাহ হ''বে
ব্রজ-গোপী-ভাব, হৈবে স্বভাব,
আনো-ভাব না রহিবে', E'বৃষভানু-পুরে, জনম লৈব,
যাবটে বিবাহ হ''বে
ব্রজ-গোপী-ভাব, হৈবে স্বভাব,
আনো-ভাব না রহিবে',
    E'bṛṣabhānu-pure,
janama loibo,
yāvaṭe
vivāha ha''be
braja-gopī-bhāva,
hoibe swabhāva,
āno-bhāva
nā rohibe', E'бр̣шабга̄ну-пуре,
джанама лоібо,
йа̄ват̣е
віва̄ха ха''бе
браджа-ґопı̄-бга̄ва,
хоібе свабга̄ва,
а̄но-бга̄ва
на̄ рохібе',
    E'', E'',
    E'I shall then take birth in Barsana, the town of King Vrsabhanu, and I will be
married nearby in the town of Yavata. My sole disposition and character shall
be that of a simple cowherd girl, and I shall not know any other mood.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'নিজ-সিদ্ধ-দেহ, নিজ-সিদ্ধ-নাম,
নিজ-রূপ-স্ব-বসন
রাধা-কৃপা-বলে, লোভিব বা কবে,
কৃষ্ণ-প্রেম-প্রকরণ', E'নিজ-সিদ্ধ-দেহ, নিজ-সিদ্ধ-নাম,
নিজ-রূপ-স্ব-বসন
রাধা-কৃপা-বলে, লোভিব বা কবে,
কৃষ্ণ-প্রেম-প্রকরণ',
    E'nija-siddha-deha,
nija-siddha-nāma,
nija-rūpa-swa-vasana
rādhā-kṛpā-bale,
lobhibo vā kabe,
kṛṣṇa-prema-prakaraṇa', E'ніджа-сіддга-деха,
ніджа-сіддга-на̄ма,
ніджа-рӯпа-сва-васана
ра̄дга̄-кр̣па̄-бале,
лобгібо ва̄ кабе,
кр̣шн̣а-према-пракаран̣а',
    E'', E'',
    E'I shall obtain my own eternal spiritual body, transcendental name, and specific
type of beauty and dress for the pleasure of Krsna. And when, by the power of
Sri Radha''s causeless mercy, will I be allowed entrance into the pastimes of
divine love of Krsna?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'যমুনা-সলিল- আহরণে গিয়া,
বুঝিব যুগল-রস
প্রেম-মুগ্ধ হ''য়ে, পাগলিনী-প্রায়,
গাইব রাধার যশ', E'যমুনা-সলিল- আহরণে গিয়া,
বুঝিব যুগল-রস
প্রেম-মুগ্ধ হ''য়ে, পাগলিনী-প্রায়,
গাইব রাধার যশ',
    E'jamunā-salila-
āharaṇe giyā,
bujhibo
yugala-rasa
prema-mugdha
ho''ye, pāgalinī-prāya,
gāibo
rādhāra yaśa', E'джамуна̄-саліла-
а̄харан̣е ґійа̄,
буджхібо
йуґала-раса
према-муґдга
хо''йе, па̄ґалінı̄-пра̄йа,
ґа̄ібо
ра̄дга̄ра йаш́а',
    E'', E'',
    E'As I go with a water pot on my head to draw water from the Yamuna river, I
shall cherish remembrance of the mellows of conjugal love that unite Sri Radha
with Krsna. Thus being enchanted by Their divine love, I will madly sing the
glories of Sri Radha just like a raving lunatic.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 9, Song 3: Vrsabhanu Suta Carana Sevane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 9;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Vrsabhanu Suta Carana Sevane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'বৃষভানু-সুতা- চরণ-সেবনে,
হৈব যে পাল্য-দাসী
শ্রী-রাধার সুখ, সতত সাধনে,
রহিব আমি প্রয়াসী', E'বৃষভানু-সুতা- চরণ-সেবনে,
হৈব যে পাল্য-দাসী
শ্রী-রাধার সুখ, সতত সাধনে,
রহিব আমি প্রয়াসী',
    E'vṛṣabhānu-sutā-
caraṇa-sevane,
hoibo
ye pālya-dāsī
śrī-rādhāra
sukha, satata sādhane,
rohibo
āmi prayāsī', E'вр̣шабга̄ну-сута̄-
чаран̣а-севане,
хоібо
йе па̄лйа-да̄сı̄
ш́рı̄-ра̄дга̄ра
сукха, сатата са̄дгане,
рохібо
а̄мі прайа̄сı̄',
    E'', E'',
    E'For serving the lotus feet of the charming daughter of King Vrsabhanu, I will
become a sheltered maidservant of Her maidservant. Indeed, I will live only for
the happiness of Sri Radha, and I will always endeavor to increase Her joy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'শ্রী-রাধার সুখে, কৃষ্ণএর যে সুখ,
জানিব মনেতে আমি
রাধা-পদ ছাড়ি'', শ্রী-কৃষ্ণ-সঙ্গমে,
কভু না হৈব কামী', E'শ্রী-রাধার সুখে, কৃষ্ণএর যে সুখ,
জানিব মনেতে আমি
রাধা-পদ ছাড়ি'', শ্রী-কৃষ্ণ-সঙ্গমে,
কভু না হৈব কামী',
    E'śrī-rādhāra
sukhe, kṛṣṇaera ye sukha,
jānibo
manete āmi
rādhā-pada
chāḍi'', śrī-kṛṣṇa-sańgame,
kabhu
nā hoibo kāmī', E'ш́рı̄-ра̄дга̄ра
сукхе, кр̣шн̣аера йе сукха,
джа̄нібо
манете а̄мі
ра̄дга̄-пада
чха̄д̣і'', ш́рı̄-кр̣шн̣а-саńґаме,
кабгу
на̄ хоібо ка̄мı̄',
    E'', E'',
    E'I will understand within my heart that Krsna feels happiness only when Radha is
happy. I will thus never, ever dare become desirous of abandoning Radhika''s
lotus feet to be with Krsna myself.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'সখী-গণ মম, পরম-সুহৃত,
যুগল-প্রেমের গুরু
তদ-অনুগা হ''য়ে, সেবিব রাধার,
চরণ-কলপ-তরু', E'সখী-গণ মম, পরম-সুহৃত,
যুগল-প্রেমের গুরু
তদ-অনুগা হ''য়ে, সেবিব রাধার,
চরণ-কলপ-তরু',
    E'sakhī-gaṇa
mama, parama-suhṛt,
yugala-premera
guru
tad-anugā
ho''ye, sevibo rādhāra,
caraṇa-kalapa-taru', E'сакхı̄-ґан̣а
мама, парама-сухр̣т,
йуґала-премера
ґуру
тад-ануґа̄
хо''йе, севібо ра̄дга̄ра,
чаран̣а-калапа-тару',
    E'', E'',
    E'All my associate sakhis are my supreme well-wishers, my best friends, and they
are the teachers of my lessons in conjugal love. Simply by following them, I
will serve the lotus feet of Radha, which are just like desire-fulfilling
trees.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'রাধা-পক্ষ ছাড়ি, যে-জন সে-জন,
যে ভাবে সে ভাবে থাকে
আমি তো'' রাধিকা- পক্ষ-পাতী সদা,
কভু নাহি হেরি তা''কে', E'রাধা-পক্ষ ছাড়ি'', যে-জন সে-জন,
যে ভাবে সে ভাবে থাকে
আমি তো'' রাধিকা- পক্ষ-পাতী সদা,
কভু নাহি হেরি তা''কে',
    E'rādhā-pakṣa
chāḍi'', ye-jana se-jana,
ye
bhāve se bhāve thāke
āmi
to'' rādhikā- pakṣa-pātī sadā,
kabhu
nāhi heri tā''ke', E'ра̄дга̄-пакша
чха̄д̣і'', йе-джана се-джана,
йе
бга̄ве се бга̄ве тха̄ке
а̄мі
то'' ра̄дгіка̄- пакша-па̄тı̄ сада̄,
кабгу
на̄хі хері та̄''ке',
    E'', E'',
    E'I am forever partial and prone to favoring the party of Sri Radhika. I will
never even look upon those persons who have abandoned Her entourage, whoever
they may be and regardless of what they preach.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 10, Song 1: Kabe Ha''be Bolo Sei Dina Amar
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 10;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Kabe Ha''be Bolo Sei Dina Amar', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'কবে হবে বল সে-দিন আমার
(আমার) অপরাধ ঘুচি, শুদ্ধ নামে রুচি,
কৃপা-বলে হবে হৃদয়ে সঞ্চার', E'কবে হবে বল সে-দিন আমার
(আমার) অপরাধ ঘুচি, শুদ্ধ নামে রুচি,
কৃপা-বলে হবে হৃদয়ে সঞ্চার',
    E'kabe
ha''be bolo se-dina āmār
(āmār) aparādha ghuci'', śuddha nāme ruci,
kṛpā-bale ha''be hṛdoye sañcār', E'кабе
ха''бе боло се-діна а̄ма̄р
(а̄ма̄р) апара̄дга ґгучі'', ш́уддга на̄ме ручі,
кр̣па̄-бале ха''бе хр̣дойе сан̃ча̄р',
    E'', E'',
    E'When, O when, will that day be mine? When will you give me your blessings,
erase all my offences and give my heart a taste [ruci] for chanting the Holy
Name in purity?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'তৃণাধিক হীন, কবে নিজে মানি,
সহিষ্ণুতা-গুণ হৃদয়েতে আনি
সকলে মানদ, আপনি অমানী,
হ''য়ে আস্বাদিবো নাম-রস-সার', E'তৃণাধিক হীন, কবে নিজে মানি'',
সহিষ্ণুতা-গুণ হৃদয়েতে আনি''
সকলে মানদ, আপনি অমানী,
হ''য়ে আস্বাদিবো নাম-রস-সার',
    E'tṛṇādhika
hīna, kabe nije māni'',
sahiṣṇutā-guṇa hṛdoyete āni''
sakale mānada, āpani amānī,
ho''ye āswādibo nāma-rasa-sār', E'тр̣н̣а̄дгіка
хı̄на, кабе нідже ма̄ні'',
сахішн̣ута̄-ґун̣а хр̣дойете а̄ні''
сакале ма̄нада, а̄пані ама̄нı̄,
хо''йе а̄сва̄дібо на̄ма-раса-са̄р',
    E'', E'',
    E'When will I taste the essence of the Holy Name, feeling myself to be lower than
the grass, my heart filled with tolerance? When will I give respect to all
others and be free from desire for respect from them?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'ধন জন আর, কবিতা-সুন্দরী,
বলিব না চাহি দেহ-সুখ-করী
জন্মে-জন্মে দাও, ওহে গৌরহরি!
অহৈতুকী ভক্তি চরণে তোমার', E'ধন জন আর, কবিতা-সুন্দরী,
বলিব না চাহি দেহ-সুখ-করী
জন্মে-জন্মে দাও, ওহে গৌরহরি!
অহৈতুকী ভক্তি চরণে তোমার',
    E'dhana
jana āra, kobitā-sundarī,
bolibo nā cāhi deho-sukha-karī
janme-janme dāo, ohe gaurahari!
ahaitukī bhakti caraṇe tomār', E'дгана
джана а̄ра, кобіта̄-сундарı̄,
болібо на̄ ча̄хі дехо-сукха-карı̄
джанме-джанме да̄о, охе ґаурахарі!
ахаітукı̄ бгакті чаран̣е тома̄р',
    E'', E'',
    E'When will I cry out that I have no longer any desire for wealth and followers,
poetry and beautiful women, all of which are meant just for bodily pleasure? O
Gaura Hari! Give me causeless devotional service [bhakti] to your lotus feet,
birth after birth.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'(কবে) করিতে শ্রী-কৃষ্ণ-নাম উচ্চারণ,
পুলকিত দেহ গদ্গদ বচন
বৈবর্ণ্য-বেপথু হ''বে সঙ্ঘটন,
নিরন্তর নেত্রে ব''বে অশ্রু-ধার', E'(কবে) করিতে শ্রী-কৃষ্ণ-নাম উচ্চারণ,
পুলকিত দেহ গদ্গদ বচন
বৈবর্ণ্য-বেপথু হ''বে সঙ্ঘটন,
নিরন্তর নেত্রে ব''বে অশ্রু-ধার',
    E'(kabe)
korite śrī-kṛṣṇa-nāma uccāraṇa,
pulakita deho gadgada bacana
baibarṇya-bepathu ha''be sańghaṭana,
nirantara netre ba''be aśru-dhār', E'(кабе)
коріте ш́рı̄-кр̣шн̣а-на̄ма учча̄ран̣а,
пулакіта дехо ґадґада бачана
баібарн̣йа-бепатху ха''бе саńґгат̣ана,
нірантара нетре ба''бе аш́ру-дга̄р',
    E'', E'',
    E'When will my body be covered with goose bumps and my voice broken with emotion
as I pronounce Krishna''s name? When will my body change color and my eyes flow
with endless tears as I chant?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'কবে নবদ্বীপে, সুরধুনী-তটে,
গৌর-নিত্যানন্দ বলি'' নিষ্কপটে
নাচিয়া গাইয়া, বেরাইব ছুটে,
বাতুলের প্রায় ছারিয়া বিচার', E'কবে নবদ্বীপে, সুরধুনী-তটে,
গৌর-নিত্যানন্দ বলি'' নিষ্কপটে
নাচিয়া গাইয়া, বেরাইব ছুটে,
বাতুলের প্রায় ছারিয়া বিচার',
    E'kabe
navadwīpe, suradhunī-taṭe,
gaura-nityānanda boli'' niṣkapaṭe
nāciyā gāiyā, berāibo chuṭe,
bātulera prāya chāriyā bicār', E'кабе
навадвı̄пе, сурадгунı̄-тат̣е,
ґаура-нітйа̄нанда болі'' нішкапат̣е
на̄чійа̄ ґа̄ійа̄, бера̄ібо чхут̣е,
ба̄тулера пра̄йа чха̄рійа̄ біча̄р',
    E'', E'',
    E'When will I give up all thought of the world and society to run like a madman
along the banks of the Ganges in Navadvipa, singing and dancing and sincerely
calling out the names of Gaura and Nityananda?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'কবে নিত্যানন্দ, মোরে করি দয়া,
ছারাইবে মোর বিষয়ের মায়া
দিয়া মোরে নিজ-চরণের ছায়া,
নামের হাটেতে দিবে অধিকার', E'কবে নিত্যানন্দ, মোরে করি ''দয়া,
ছারাইবে মোর বিষয়ের মায়া
দিয়া মোরে নিজ-চরণের ছায়া,
নামের হাটেতে দিবে অধিকার',
    E'kabe
nityānanda, more kori ''doyā,
chārāibe mora viṣayera māyā
diyā more nija-caraṇera chāyā,
nāmera hāṭete dibe adhikār', E'кабе
нітйа̄нанда, море корі ''дойа̄,
чха̄ра̄ібе мора вішайера ма̄йа̄
дійа̄ море ніджа-чаран̣ера чха̄йа̄,
на̄мера ха̄т̣ете дібе адгіка̄р',
    E'', E'',
    E'When will Nityananda Prabhu be merciful to me and deliver me from the
enchantment [maya] of the sense objects? When will he give me the shade of his
lotus feet and the right to enter the market place [nama-hatta] of the Holy
Name?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'কিনিব, লুটিব, হরি-নাম-রস,
নাম-রসে মাতি'' হৈব বিবশ
রসের রসিক-চরণ পরশ,
করিয়া মোজিব রসে অনিবার', E'কিনিব, লুটিব, হরি-নাম-রস,
নাম-রসে মাতি'' হৈব বিবশ
রসের রসিক-চরণ পরশ,
করিয়া মোজিব রসে অনিবার',
    E'kinibo,
luṭibo, hari-nāma-rasa,
nāma-rase māti'' hoibo bibaśa
rasera rasika-caraṇa paraśa,
koriyā mojibo rase anibār', E'кінібо,
лут̣ібо, харі-на̄ма-раса,
на̄ма-расе ма̄ті'' хоібо бібаш́а
расера расіка-чаран̣а параш́а,
корійа̄ моджібо расе аніба̄р',
    E'', E'',
    E'When will I buy, borrow or steal the ecstasies of the Holy Name? When will I
lose myself in the intoxication of the Holy Name? When will I immerse myself in
the nectar of the Holy Name after grasping the feet of a saint who constantly
relishes the flavors [rasa] of devotion?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'কবে জীবে দয়া, হৈবে উদয়,
নিজ-সুখ ভুলি'' সুদীন-হৃদয়
ভকতিবিনোদ, করিয়া বিনয়,
শ্রী-আজ্ঞা-টহল করিবে প্রচার', E'কবে জীবে দয়া, হৈবে উদয়,
নিজ-সুখ ভুলি'' সুদীন-হৃদয়
ভকতিবিনোদ, করিয়া বিনয়,
শ্রী-আজ্ঞা-টহল করিবে প্রচার',
    E'kabe
jībe doyā, hoibe udoya,
nija-sukha bhuli'' sudīna-hṛdoya
bhakativinoda, koriyā binoya,
śrī-ājñā-ṭahala koribe pracār
WORD
FOR WORD', E'кабе
джı̄бе дойа̄, хоібе удойа,
ніджа-сукха бгулі'' судı̄на-хр̣дойа
бгакатівінода, корійа̄ бінойа,
ш́рı̄-а̄джн̃а̄-т̣ахала корібе прача̄р
ВОРД
FОР ВОРД',
    E'', E'',
    E'When will I feel compassion for all living beings [jivas]? When will I forget
my own pleasure in genuine humility? And when will I, Bhaktivinoda, meekly go
from door to door, preaching your message of love?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Section 11, Song 1: Krsna Nama Dhare Kato Bal
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 11;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Krsna Nama Dhare Kato Bal', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'কৃষ্ণ-নাম ধরে কত বল
বিষয়-বাসনানলে, মোর চিত্ত সদা জ্বলে,
রবি-তপ্ত মরু-ভূমি-সম
কর্ন-রন্ধ্র-পথ দিয়া, হৃদি মাঝে প্রবেশিয়া,
বরিষয় সুধা অনুপম', E'কৃষ্ণ-নাম ধরে কত বল
বিষয়-বাসনানলে, মোর চিত্ত সদা জ্বলে,
রবি-তপ্ত মরু-ভূমি-সম
কর্ন-রন্ধ্র-পথ দিয়া, হৃদি মাঝে প্রবেশিয়া,
বরিষয় সুধা অনুপম',
    E'kṛṣṇa-nāma
dhare koto bal
viṣaya-vāsanānale,
mora citta sadā jwale,
ravi-tapta
maru-bhūmi-sam
karna-randhra-patha
diyā, hṛdi mājhe praveśiyā,
variṣoya
sudhā anupam', E'кр̣шн̣а-на̄ма
дгаре кото бал
вішайа-ва̄сана̄нале,
мора чітта сада̄ джвале,
раві-тапта
мару-бгӯмі-сам
карна-рандгра-патха
дійа̄, хр̣ді ма̄джхе правеш́ійа̄,
варішойа
судга̄ анупам',
    E'', E'',
    E'How much power does the name of Krsna possess? My heart constantly burns in the
fire of worldly desires, like a desert scorched by the sun. The holy name,
entering within my heart through the holes of my ears, showers unparalleled
nectar upon my soul.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 2
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'হৃদয় হৈতে বলে, জিহ্বার অগ্রেতে চলে,
শব্দ-রূপে নাচে অনুক্ষন
কন্ঠে মোর ভঙ্গে স্বর, অঙ্গ কাঁপে থর থর,
স্থির হৈতে না পারে চরণ', E'হৃদয় হৈতে বলে, জিহ্বার অগ্রেতে চলে,
শব্দ-রূপে নাচে অনুক্ষন
কন্ঠে মোর ভঙ্গে স্বর, অঙ্গ কাঁপে থর থর,
স্থির হৈতে না পারে চরণ',
    E'hṛdoya
hoite bole, jihvāra agrete cale,
śabda-rūpe
nāce anukṣan
kanṭhe
mora bhańge swara, ańga kāńpe thara thara,
sthira
hoite nā pāre caraṇ', E'хр̣дойа
хоіте боле, джіхва̄ра аґрете чале,
ш́абда-рӯпе
на̄че анукшан
кант̣хе
мора бгаńґе свара, аńґа ка̄ńпе тхара тхара,
стхіра
хоіте на̄ па̄ре чаран̣',
    E'', E'',
    E'The holy name speaks from within my heart, moves on the tip of my tongue, and
constantly dances on it in the form of transcendental sound.
My
throat becomes choked up, my body violently trembles, and my feet move
uncontrollably.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 3
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'চক্ষে ধারা, দেহে ঘর্ম, পুলকিত সব চর্ম,
বিবর্ন হৈল কলেবর
মূর্ছিত হৈল মন, প্রলয়ের আগমন,
ভাবে সর্ব-দেহ জর জর', E'চক্ষে ধারা, দেহে ঘর্ম, পুলকিত সব চর্ম,
বিবর্ন হৈল কলেবর
মূর্ছিত হৈল মন, প্রলয়ের আগমন,
ভাবে সর্ব-দেহ জর জর',
    E'cakṣe
dhārā, dehe gharma, pulakita saba carma,
vivarna
hoilo kalevara
mūrchita
hoilo man, pralayera āgaman,
bhāve
sarva-deha jara jara', E'чакше
дга̄ра̄, дехе ґгарма, пулакіта саба чарма,
віварна
хоіло калевара
мӯрчхіта
хоіло ман, пралайера а̄ґаман,
бга̄ве
сарва-деха джара джара',
    E'', E'',
    E'Rivers of tears flow from my eyes. Perspiration pours from my
body. My body thrills with rapture, causing my hair to stand on end and my skin
to turn pale and discolored. My mind grows faint, and I begin to experience
devastation. My entire body is shattered in a flood of ecstasies.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'করি এত উপদ্রব, চিত্তে বর্ষে সুধা-দ্রব,
মোরে ডারে প্রেমের সাগরে
কিছু না বুঝিতে দিল, মোরে তো'' বাতুল কৈল,
মোর চিত্ত-বিত্ত সব হরে', E'করি'' এত উপদ্রব, চিত্তে বর্ষে সুধা-দ্রব,
মোরে ডারে প্রেমের সাগরে
কিছু না বুঝিতে দিল, মোরে তো'' বাতুল কৈল,
মোর চিত্ত-বিত্ত সব হরে',
    E'kori''
eto upadrava, citte varṣe sudhā-drava,
more
ḍāre premera sāgare
kichu
nā bujhite dilo, more to'' bātula koilo,
mora
citta-vitta saba hare', E'корі''
ето упадрава, чітте варше судга̄-драва,
море
д̣а̄ре премера са̄ґаре
кічху
на̄ буджхіте діло, море то'' ба̄тула коіло,
мора
чітта-вітта саба харе',
    E'', E'',
    E'While causing such an ecstatic disturbance, the holy name showers liquid nectar
on my heart and drowns me in the ocean of divine love of Godhead. He does not
allow me to understand anything; For He has made me truly mad and has stolen
away my heart and all my wealth.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 5
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'লৈনু আশ্রয় যার, হেন ব্যবহার তার,
বর্নিতে না পারি এ সকল
কৃষ্ণ-নাম ইচ্ছা-ময়, যাহে যাহে সুখী হয়,
সেই মোর সুখের সম্বল', E'লৈনু আশ্রয় যা''র, হেন ব্যবহার তা''র,
বর্নিতে না পারি এ সকল
কৃষ্ণ-নাম ইচ্ছা-ময়, যাহে যাহে সুখী হয়,
সেই মোর সুখের সম্বল',
    E'loinu
āśroya jā''r, heno vyavahāra tā''r,
varnite
nā pāri e sakal
kṛṣṇa-nāma
icchā-moy, jāhe jāhe sukhī hoy,
sei
mora sukhera sambal', E'лоіну
а̄ш́ройа джа̄''р, хено вйаваха̄ра та̄''р,
варніте
на̄ па̄рі е сакал
кр̣шн̣а-на̄ма
іччха̄-мой, джа̄хе джа̄хе сукхı̄ хой,
сеі
мора сукхера самбал',
    E'', E'',
    E'Such is the behavior of Him who is now my only shelter. I am not capable of
describing all this. The holy name of Krsna is independent and thus acts at His
own sweet will. In whatever way He becomes happy, that is also my way of
happiness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'প্রেমের কলিকা নাম, অদ্ভুত রসের ধাম,
হেন বল করয়ে প্রকাশ
ঈষত বিকশি'' পুনঃ, দেখায় নিজ-রূপ-গুন,
চিত্ত হরি'' লয় কৃষ্ণ-পাশ', E'প্রেমের কলিকা নাম, অদ্ভুত রসের ধাম,
হেন বল করয়ে প্রকাশ
ঈষত বিকশি'' পুনঃ, দেখায় নিজ-রূপ-গুন,
চিত্ত হরি'' লয় কৃষ্ণ-পাশ',
    E'premera
kalikā nām, adbhuta rasera dhām,
heno
bala karaye prakāś
īṣat
vikaśi'' punaḥ, dekhāy nija-rūpa-guna,
citta
hari'' loya kṛṣṇa-pāś', E'премера
каліка̄ на̄м, адбгута расера дга̄м,
хено
бала карайе прака̄ш́
ı̄шат
вікаш́і'' пунах̣, декха̄й ніджа-рӯпа-ґуна,
чітта
харі'' лойа кр̣шн̣а-па̄ш́',
    E'', E'',
    E'The holy name is the bud of the flower of divine love, the abode of devotion''s
wonderful mellows. Such is the power that He manifests, that although He
displays His power only slightly, He reveals His own divine form and qualities,
steals my heart and takes it to Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 7
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'পূর্ন বিকশিত হৈয়া, ব্রজে মোরে যায় লৈয়া,
দেখায় মোরে স্বরূপ-বিলাস
মোরে সিদ্ধ-দেহ দিয়া, কৃষ্ণ-পাশে রাখে গিয়া,
এ দেহের করে সর্ব-নাশ', E'পূর্ন বিকশিত হৈয়া, ব্রজে মোরে যায় লৈয়া,
দেখায় মোরে স্বরূপ-বিলাস
মোরে সিদ্ধ-দেহ দিয়া, কৃষ্ণ-পাশে রাখে গিয়া,
এ দেহের করে সর্ব-নাশ',
    E'pūrna
vikaśita hoiyā, braje more jāya loiyā,
dekhāy
more swarūpa-vilās
more
siddha-deha diyā, kṛṣṇa-pāśe rākhe
giyā,
e
dehera kore sarva-nāś', E'пӯрна
вікаш́іта хоійа̄, брадже море джа̄йа лоійа̄,
декха̄й
море сварӯпа-віла̄с
море
сіддга-деха дійа̄, кр̣шн̣а-па̄ш́е ра̄кхе
ґійа̄,
е
дехера коре сарва-на̄ш́',
    E'', E'',
    E'Being fully manifest, the holy name of takes me to Vraja and reveals to me His
own love dalliance. He gives to me my own divine, eternal body, keeps me near
Krsna and completely destroys this mortal frame of mine.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


  -- Verse 8
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'কৃষ্ণ-নাম-চিন্তামণি, অখিল রসের খনি,
নিত্য-মুক্ত শুদ্ধ-রস-ময়
নামের বালাই যত, সব ল''য়ে হয় হত,
তবে মোর সুখের উদয়', E'কৃষ্ণ-নাম-চিন্তামণি, অখিল রসের খনি,
নিত্য-মুক্ত শুদ্ধ-রস-ময়
নামের বালাই যত, সব ল''য়ে হয় হত,
তবে মোর সুখের উদয়',
    E'kṛṣṇa-nāma-cintāmaṇi,
akhila rasera khani,
nitya-mukta
śuddha-rasa-moy
nāmera
bālāi jata, saba lo''ye hoi hata,
tabe
mora sukhera udoy', E'кр̣шн̣а-на̄ма-чінта̄ман̣і,
акхіла расера кхані,
нітйа-мукта
ш́уддга-раса-мой
на̄мера
ба̄ла̄і джата, саба ло''йе хоі хата,
табе
мора сукхера удой',
    E'', E'',
    E'The name of Krsna is touchstone, a mine of all devotional mellows, eternally
liberated, and the embodiment of pure rasa. When all impediments to the pure
chanting of the holy name are taken away and destroyed, then my happiness will
know its true awakening.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;


END $$;

COMMIT;
