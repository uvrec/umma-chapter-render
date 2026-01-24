-- Import Baul Sangit by Bhaktivinoda Thakura (1893)
-- 12 songs written under pen name "Chand Baul"
-- Structure: books -> cantos (single) -> chapters (songs) -> verses

BEGIN;

INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos)
VALUES ('baul-sangit', 'Baul Sangit', 'Баул Санґіт', true, false)
ON CONFLICT (slug) DO UPDATE SET
  title_ua = EXCLUDED.title_ua,
  has_cantos = EXCLUDED.has_cantos;

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'baul-sangit';

  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 1, 'Songs', 'Пісні', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;


  -- Song 1: Ami Tomar Duhkher Duhkhi
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Ami Tomar Duhkher Duhkhi', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  INSERT INTO public.verses (
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
    E'আমি তোমার দুঃখের দুঃখী সুখের সুখী , তাই তোমারে বলি ভাই রে
নিতাই-এর হাট এ গিয়ে (ওরে ও ভাই) নাম এনেছি তোমার তোরে', E'আমি তোমার দুঃখের দুঃখী সুখের সুখী , তাই তোমারে বলি ভাই রে
নিতাই-এর হাট এ গিয়ে (ওরে ও ভাই) নাম এনেছি তোমার তোরে',
    E'Song
Name: Ami Tomar Duhkher Duhkhi
Official
Name: Song 1
Author:
Bhaktivinoda
Thakura
Book
Name: Baul
Sangit
Language:
Bengali
অ', E'Сонґ
Наме: Амі Томар Духкхер Духкхі
Оffічіал
Наме: Сонґ 1
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Баул
Санґіт
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) I
am your ever well-wisher -- I become sad when you are sad, and I beecome happy
when you are happy. This I sincerely proclaim to you, dear brothers! Having
gone shopping at Lord Nityananda''s Marketplace, O brothers, I have brought back
the holy names of the Lord just for your benefit.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'গৌর-চন্দ্র-মার্কা করা, এ হরি-নাম রসে ভরা
নামে নামী পড়ছে ধরা, লও যদি বদন ভরে''', E'গৌর-চন্দ্র-মার্কা করা, এ হরি-নাম রসে ভরা
নামে নামী পড়ছে ধরা, লও যদি বদন ভরে''',
    E'āmi
tomār duḥkher duḥkhī sukher sukhī, tāi
tomāre boli bhāi re
nitāi-er
hāṭe giye (ore o bhāi) nām enechi tomār tore', E'а̄мі
тома̄р дух̣кхер дух̣кхı̄ сукхер сукхı̄, та̄і
тома̄ре болі бга̄і ре
ніта̄і-ер
ха̄т̣е ґійе (оре о бга̄і) на̄м енечхі тома̄р торе',
    E'', E'',
    E'Being marked with the symbol of Lord Gaura-candra, this Hari-nama is succulent
with divine mellows. If you would please take the holy name and always fill
your mouths with it, then you shall realize that the name fully contains the
Lord who is named.
3) By
chanting the holy name all your sinful reactions and material miseries will be
will be no more fear, and you will be immersed in the ocean of pure joy.
4) I
myself am now quite wretched and indeed destitute, for by arranging to bring
the Lord''s holy name here I have fallen into great debt. Seeing me as a soul
stricken with extreme poverty, please hand over to me the price of your faith.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'পাপ তাপ সব দূরে যা''বে, সার-ময় সংসার হ''বে,
আর কোনো ভয় নাহি রবে, ডুববে সুখের পাথারে', E'পাপ তাপ সব দূরে যা''বে, সার-ময় সংসার হ''বে,
আর কোনো ভয় নাহি রবে, ডুববে সুখের পাথারে',
    E'gaura-candra-mārkā
korā, e hari-nām rase bhorā ,
nāme
nāmī paḍche dhorā, lao yadi vadana bhore''', E'ґаура-чандра-ма̄рка̄
кора̄, е харі-на̄м расе бгора̄ ,
на̄ме
на̄мı̄ пад̣чхе дгора̄, лао йаді вадана бгоре''',
    E'', E'',
    E'Taking your payment, O brothers, I will pass it along to the Mahajana (the
proprietor, Lord Nityananda). Whatever small commission I may earn by
conducting this transaction will be kept in my own storeroom.
6) Living
on the island of Godruma in the district of Nadiya, this person named Chand
Baul shouts and exclaims, "Other than the holy name of the Lord, all else
in this world is simply false, like the illusions of a shadow-theater!"
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'আমি কাঙ্গাল অর্থ-হীন, নাম এনেছি করে'' ঋণ,
দেখে আমায় অতি দী ন, শ্রদ্ধা-মূল্যে দেও ধরে''', E'আমি কাঙ্গাল অর্থ-হীন, নাম এনেছি করে'' ঋণ,
দেখে আমায় অতি দী ন, শ্রদ্ধা-মূল্যে দেও ধরে''',
    E'pāpa
tāpa saba dūre jā''be, sāra-moy saḿsāra ha''be,
ār
kono bhoy nāhi rabe, ḍubbe sukher pāthāre', E'па̄па
та̄па саба дӯре джа̄''бе, са̄ра-мой саḿса̄ра ха''бе,
а̄р
коно бгой на̄хі рабе, д̣уббе сукхер па̄тха̄ре',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'মূল্য ল''য়ে তোমার ঠাই, মহা-জনকে দিব, ভাই
যে কিছু তায় লাভ পাই, রাখ্ব নিজের ভাণ্ডারে', E'মূল্য ল''য়ে তোমার ঠাই, মহা-জনকে দিব, ভাই
যে কিছু তায় লাভ পাই, রাখ্ব নিজের ভাণ্ডারে',
    E'āmi
kāńgāl artha-hīna, nām enechi kore'' ṛṇa,
dekhe
āmāya ati dīna, śraddhā-mūlye deo dhore''', E'а̄мі
ка̄ńґа̄л артха-хı̄на, на̄м енечхі коре'' р̣н̣а,
декхе
а̄ма̄йа аті дı̄на, ш́раддга̄-мӯлйе део дгоре''',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'নদী যা-গোদ্রুমে থাকি, চাঁদ-বাউল বলিছে ডাকি''
নাম বিনা আর সকল ফাঙ্কি, ছায়াবাজী এ সংসারে', E'নদী যা-গোদ্রুমে থাকি, চাঁদ-বাউল বলিছে ডাকি''
নাম বিনা আর সকল ফাঙ্কি, ছায়াবাজী এ সংসারে',
    E'mūlya
lo''ye tomār ṭhāi, mahā-janake dibo, bhāi,
je
kichu tāy lābha pāi, rākhbo nijer
bhāṇḍāre', E'мӯлйа
ло''йе тома̄р т̣ха̄і, маха̄-джанаке дібо, бга̄і,
дже
кічху та̄й ла̄бга па̄і, ра̄кхбо ніджер
бга̄н̣д̣а̄ре',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'nadīyā-godrume
thāki, cāńda-bāul boliche ḍāki'',
nām
vinā ār sakala phāńki, chāyābājī e
saḿsāre', E'надı̄йа̄-ґодруме
тха̄кі, ча̄ńда-ба̄ул болічхе д̣а̄кі'',
на̄м
віна̄ а̄р сакала пха̄ńкі, чха̄йа̄ба̄джı̄ е
саḿса̄ре',
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
    translation_en = EXCLUDED.translation_en;


  -- Song 2: Dharma Pathe Thaki
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Dharma Pathe Thaki', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  INSERT INTO public.verses (
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
    E'ধর্ম-পথে থাকি'' কর জী বন জাপন, ভাই
হরি-নাম কর সদা (ওরে ও ভাই) হরি বিনা বন্ধু নাই', E'ধর্ম-পথে থাকি'' কর জী বন জাপন, ভাই
হরি-নাম কর সদা (ওরে ও ভাই) হরি বিনা বন্ধু নাই',
    E'Song
Name: Dharma Pathe Thaki
Official
Name: Song 2
Author:
Bhaktivinoda
Thakura
Book
Name: Baul Sangit
Language:
Bengali
অ', E'Сонґ
Наме: Дхарма Патхе Тхакі
Оffічіал
Наме: Сонґ 2
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Баул Санґіт
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
my dear brothers! Just pass your lives by adhering to the proper path of
religiosity. Constantly chant Hari-nama, O brothers, for other than Lord Hari
you have no friend.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'যে কোনো ব্যবসা ধরি'', জী বন নির্বাহ করি''
বল মুখে হরি হরি, এই মাত্র ভিক্ষা চাই', E'যে কোনো ব্যবসা ধরি'', জী বন নির্বাহ করি''
বল মুখে হরি হরি, এই মাত্র ভিক্ষা চাই',
    E'dharma-pathe
thāki'' koro jīvana jāpana, bhāi
hari-nām
koro sadā (ore o bhāi) hari vinā bandhu nāi', E'дгарма-патхе
тха̄кі'' коро джı̄вана джа̄пана, бга̄і
харі-на̄м
коро сада̄ (оре о бга̄і) харі віна̄ бандгу на̄і',
    E'', E'',
    E'Accepting whatever livelihood that suits you, just live your life honestly.
Fill your mouths with the constant chanting of "Hari! Hari!" This is the
only alms I beg of you!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'গৌরাঙ্গ-চরণে মজ, অন্য অভিলাষ-ত্যজ,
ব্রজেন্দ্র-নন্দনে ভজ, তবে বড় সুখ পাই', E'গৌরাঙ্গ-চরণে মজ, অন্য অভিলাষ-ত্যজ,
ব্রজেন্দ্র-নন্দনে ভজ, তবে বড় সুখ পাই',
    E'je kono
vyavasā dhori'', jīvana nirvāha kori'',
bolo mukhe
hari hari, ei mātra bhikṣā cāi', E'дже коно
вйаваса̄ дгорі'', джı̄вана нірва̄ха корі'',
боло мукхе
харі харі, еі ма̄тра бгікша̄ ча̄і',
    E'', E'',
    E'Remain absorbed in the lotus feet of Lord Gauranga, renounce all other
ambitions, and worship Vrajendra-Nandan. If you would do this much, then I will
experience great pleasure.
4) I
am Cand Baul Das, and I wish only to receive your mercy. I have informed you of
my desires, for I sing as I have been personally ordered by Lord Nityananda.
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'আমি চাঁদ-বাউল-দাস, করি তব কৃপা আশ,
জানাইয়া অভিলাষ, নিত্যানন্দ-আজ্ঞা গাই', E'আমি চাঁদ-বাউল-দাস, করি তব কৃপা আশ,
জানাইয়া অভিলাষ, নিত্যানন্দ-আজ্ঞা গাই',
    E'gaurāńga-caraṇe
majo, anya abhilāṣa-tyajo,
brajendra-nandane
bhajo, tabe boḍo sukha pāi', E'ґаура̄ńґа-чаран̣е
маджо, анйа абгіла̄ша-тйаджо,
браджендра-нандане
бгаджо, табе бод̣о сукха па̄і',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'āmi
cāńda-bāul-dās, kori tava kṛpā āśa,
jānāiyā
abhilāṣa, nityānanda-ājñā gāi', E'а̄мі
ча̄ńда-ба̄ул-да̄с, корі тава кр̣па̄ а̄ш́а,
джа̄на̄ійа̄
абгіла̄ша, нітйа̄нанда-а̄джн̃а̄ ґа̄і',
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
    translation_en = EXCLUDED.translation_en;


  -- Song 3: Asa Loko Tha Bolte
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Asa Loko Tha Bolte', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  INSERT INTO public.verses (
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
    E'আসল কথা বল্তে কি
তোমার কেন্থা-ধরা, কপ্নি-আঁটা-সব ফাঁকি', E'আসল কথা বল্তে কি
তোমার কেন্থা-ধরা, কপ্নি-আঁটা-সব ফাঁকি',
    E'Song
Name: Asalo Katha Bolte
Official
Name: Song 3
Author:
Bhaktivinoda
Thakura
Book
Name: Baul
Sangit
Language:
Bengali
অ', E'Сонґ
Наме: Асало Катха Болте
Оffічіал
Наме: Сонґ 3
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Баул
Санґіт
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
you have so much to say about being genuine! You are seen to be wrapped in an
old tattered blanket and wearing a simple loincloth, just like a renounced
ascetic, but in actuality all of this is simply pretentious.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'ধর্ম-পত্নী ত্যজি'' ঘরে, পর-নারী-সঙ্গ করে,
অর্থ-লোভে দ্বারে দ্বারে ফিরে, রাখ্লে কি বাকী', E'ধর্ম-পত্নী ত্যজি'' ঘরে, পর-নারী-সঙ্গ করে,
অর্থ-লোভে দ্বারে দ্বারে ফিরে, রাখ্লে কি বাকী',
    E'āsalo
kathā bolte ki
tomār
kenthā-dhorā, kapni-āńṭāsaba phāńki', E'а̄сало
катха̄ болте кі
тома̄р
кентха̄-дгора̄, капні-а̄ńт̣а̄саба пха̄ńкі',
    E'', E'',
    E'Leaving your legally married wife at home, you go off and keep the company of
the wives of others. In your greed for acquiring more and more wealth, you
wander like a poor beggar from door to door, and you secretly keep so many
surpluses stored away.
3) You
are quite confident in presenting yourself as a saintly spiritual master, and
thus you are busily engaged in initiating innocent people by reciting
Krishna-nama into their ear -- is this behavior not a great charade?
4) Can
anyone be called a "guru" simply because he gives advice to others? A
cook can never use whey in a recipe that calls for milk. Now think about this
and just see what I see.
5) On
the strength of the true qualities of peacefulness, sense control, and
tolerance, one''s mundane desires are renounced as true spiritual faith arises.
That being the case, the renunciant Cand Baul says, "What will become of
your premature imitation of spiritual perfection?"
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'তুমি গুরু বল্ছ বটে, সাধু-গুরু নিষ্কপটে,
কৃষ্ণ-নাম দেন কর্ণ-পুটে, সে কি এমন হয় মেকি?', E'তুমি গুরু বল্ছ বটে, সাধু-গুরু নিষ্কপটে,
কৃষ্ণ-নাম দেন কর্ণ-পুটে, সে কি এমন হয় মেকি?',
    E'dharma-patnī
tyaji'' ghare, para-nārī-sańga kore,
artha-lobhe
dvāre dvāre phire, rākhle ki bākī', E'дгарма-патнı̄
тйаджі'' ґгаре, пара-на̄рı̄-саńґа коре,
артха-лобге
два̄ре два̄ре пхіре, ра̄кхле кі ба̄кı̄',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'যেবা অন্য শিক্ষা দেয়, তা''কে কি গুরু'' বল্তে হয়?
দুধের ফল ত'' ঘোলে নয়, ভেবে'' চিত্তে দেখ দেখি', E'যেবা অন্য শিক্ষা দেয়, তা''কে কি গুরু'' বল্তে হয়?
দুধের ফল ত'' ঘোলে নয়, ভেবে'' চিত্তে দেখ দেখি',
    E'tumi
guru bolcho vaṭe, sādhu-guru niṣkapaṭe,
kṛṣṇa-nām
deno karṇa-puṭe, se ki emon hoy meki?', E'тумі
ґуру болчхо ват̣е, са̄дгу-ґуру нішкапат̣е,
кр̣шн̣а-на̄м
дено карн̣а-пут̣е, се кі емон хой мекі?',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'শম-দম-তিতিক্ষা-বলে, উপরতি, শ্রদ্ধা হ''লে
তবে ভেক চাঁদ-বাউল, বলে, এঁচড়ে পেকে হবে কি?', E'শম-দম-তিতিক্ষা-বলে, উপরতি, শ্রদ্ধা হ''লে
তবে ভেক চাঁদ-বাউল, বলে, এঁচড়ে পেকে হবে কি?',
    E'jebā
anya śikṣā dey, tā''ke ki `guru'' bolte hoy?
dudher
phal to'' ghole noy, bheve'' citte dekho dekhi', E'джеба̄
анйа ш́ікша̄ дей, та̄''ке кі `ґуру'' болте хой?
дудгер
пхал то'' ґголе ной, бгеве'' чітте декхо декхі',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'śama-dama-titikṣā-bale,
uparati, śraddhā ho''le,
tabe
bheko cāńda-bāul, bole, eńcaḍe peke habe ki?', E'ш́ама-дама-тітікша̄-бале,
упараті, ш́раддга̄ хо''ле,
табе
бгеко ча̄ńда-ба̄ул, боле, еńчад̣е пеке хабе кі?',
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
    translation_en = EXCLUDED.translation_en;


  -- Song 4: Baul Baul Bolche Sabe
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Baul Baul Bolche Sabe', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  INSERT INTO public.verses (
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
    E'বাউল বাউল'' বল্ছে সবে, হচ্ছে বাউল কোন জনা
দাড়ি-চূড়া দেখিয়ে (ও ভাই) কর্ছে জী বকে বঞ্চনা', E'বাউল বাউল'' বল্ছে সবে, হচ্ছে বাউল কোন জনা
দাড়ি-চূড়া দেখিয়ে (ও ভাই) কর্ছে জী বকে বঞ্চনা',
    E'Song
Name: Baul Baul Bolche Sabe
Official
Name: Song 4
Author:
Bhaktivinoda
Thakura
Book
Name: Baul
Sangit
Language:
Bengali
অ', E'Сонґ
Наме: Баул Баул Болчхе Сабе
Оffічіал
Наме: Сонґ 4
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Баул
Санґіт
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Everyone keeps using the word "Baul, Baul" as a cheap label, but who
has actually become a Baul (a pure devotee gone mad in genuine ecstatic love of
God)? By merely exhibiting a long beard and a topknot upon your head, O
brothers, you thus cheat many people.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'দেহ-তত্ত্ব-জড়ের তত্ত্ব, তা''তে কি ছাড়ায় মায়ার গর্ত্ত,
চিদানন্দ পরমার্থ, জান্তে ত তায় পার্বে না', E'দেহ-তত্ত্ব-জড়ের তত্ত্ব, তা''তে কি ছাড়ায় মায়ার গর্ত্ত,
চিদানন্দ পরমার্থ, জান্তে ত তায় পার্বে না',
    E'`bāul
bāul'' bolche sabe, hocche bāul kon janā
dāḍi-cūḍā
dekhiye (o bhāi) korche jīvake vañcanā', E'`ба̄ул
ба̄ул'' болчхе сабе, хоччхе ба̄ул кон джана̄
да̄д̣і-чӯд̣а̄
декхійе (о бга̄і) корчхе джı̄ваке ван̃чана̄',
    E'', E'',
    E'Your philosophy of deha-tattvadeha-tattva (the material body is supposedly
divine) is simply a philosophy of dull matter (jada-tattva). By maintaining
such a doctrine, is it possible to become freed from the womb of Maya? The
supreme goal of life is the attainment of eternally conscious bliss (cid-ananda).
Although you understand this well, you will still be unable to enter
transcendence!
3) O!
If you really want to become a genuine Baul (a transcendental madman), then
please proceed on the path of religiosity. Oh! Just abandon in all ways the
mind''s craving for the inappropriate company of women!
4) O!
Abandoning the performance of adorning yourself with dramatic clothing and ornaments
in imitation of Lord Krishna, may you become attached to chanting His pure holy
names. May you become the loyal follower of Nitai Canda, thereby renouncing all
evil obsessions.
5) O
my dear brothers! Completely giving up your clever manipulative speech, just
fill your mouths with the chanting of "Hare Krsna!" Cand Baul sees no
means of support other than the abundant resource of the Lord''s holy name.
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'যদি বাউল চাও রে হ''তে, তবে চল ধর্ম-পথে,
যোষিত-সঙ্গ সর্ব-মতে ছাড় রে মনের বাসনা', E'যদি বাউল চাও রে হ''তে, তবে চল ধর্ম-পথে,
যোষিত-সঙ্গ সর্ব-মতে ছাড় রে মনের বাসনা',
    E'deha-tattvajaḍer
tattva,
tā''te
ki chāḍāy māyār gartta,
cidānanda
paramārtha, jānte to tāy pārbe nā', E'деха-таттваджад̣ер
таттва,
та̄''те
кі чха̄д̣а̄й ма̄йа̄р ґартта,
чіда̄нанда
парама̄ртха, джа̄нте то та̄й па̄рбе на̄',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'বেশ-ভূষা-রঙ্গ জত, ছাড়ি'' নামে হও রে রত,
নিতাই-চাঁদের অনুগত, হও ছাড়ি'' সব দুর্বাসনা', E'বেশ-ভূষা-রঙ্গ জত, ছাড়ি'' নামে হও রে রত,
নিতাই-চাঁদের অনুগত, হও ছাড়ি'' সব দুর্বাসনা',
    E'jadi bāul
cāo re ho''te, tabe calo dharma-pathe,
yoṣit-sańga
sarva-mate chāḍo re maner vāsanā', E'джаді ба̄ул
ча̄о ре хо''те, табе чало дгарма-патхе,
йошіт-саńґа
сарва-мате чха̄д̣о ре манер ва̄сана̄',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'মুখে হরে কৃষ্ণ'' বল, ছাড় রে ভাই কথার ছল,
নাম বিনা ত'' সু-সম্বল, চাঁদ-বাউল আর দেখে না', E'মুখে হরে কৃষ্ণ'' বল, ছাড় রে ভাই কথার ছল,
নাম বিনা ত'' সু-সম্বল, চাঁদ-বাউল আর দেখে না',
    E'veśa-bhūṣā-rańga
jata, chāḍi'' nāme hao re rata,
nitāi-cāńder
anugata, hao chāḍi'' sab durvāsanā', E'веш́а-бгӯша̄-раńґа
джата, чха̄д̣і'' на̄ме хао ре рата,
ніта̄і-ча̄ńдер
ануґата, хао чха̄д̣і'' саб дурва̄сана̄',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'mukhe `hare
kṛṣṇa'' bolo, chāḍo re bhāi kathār chala,
nām
vinā to'' su-sambala, cāńda-bāul ār dekhe nā', E'мукхе `харе
кр̣шн̣а'' боло, чха̄д̣о ре бга̄і катха̄р чхала,
на̄м
віна̄ то'' су-самбала, ча̄ńда-ба̄ул а̄р декхе на̄',
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
    translation_en = EXCLUDED.translation_en;


  -- Song 5: Manusa Bhajana Korcho
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Manusa Bhajana Korcho', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  INSERT INTO public.verses (
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
    E'মানুষ-ভজন কর্ছ, ও ভাই, ভাবের গান ধরে''
গুপ্ত করে'' রাখছ ভাল ব্যক্ত হ''বে যমের ঘরে', E'মানুষ-ভজন কর্ছ, ও ভাই, ভাবের গান ধরে''
গুপ্ত করে'' রাখছ ভাল ব্যক্ত হ''বে যমের ঘরে',
    E'Song
Name: Manusa Bhajan Korcho O Bhai
Official
Name: Song 5
Author:
Bhaktivinoda Thakura
Book
Name: Baul
Sangit
Language:
Bengali
অ', E'Сонґ
Наме: Мануса Бхаджан Корчхо О Бхаі
Оffічіал
Наме: Сонґ 5
Аутхор:
Бхактівінода Тхакура
Боок
Наме: Баул
Санґіт
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'O my dear brothers! You devotedly engage in the worship of the material bodies
of human beings, and yet you dare to sing songs about ecstatic spiritual
emotions (bhava). You expertly conceal your own secret activities, but all of
them will be fully exposed in Yamaraja''s court.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'মেয়ে হিজড়ে, পুরুষ খোজা, তবে ত'' হয় কর্ত্তা-ভজা,
এই ছলে কর্ছ মজা, মনের প্রতি চোখ ঠেরে''', E'মেয়ে হিজড়ে, পুরুষ খোজা, তবে ত'' হয় কর্ত্তা-ভজা,
এই ছলে কর্ছ মজা, মনের প্রতি চোখ ঠেরে''',
    E'mānuṣa-bhajan
korcho, o bhāi, bhāver gān dhore''
gupta kore''
rākhcho bhālo vyakta ha''be yamer ghare', E'ма̄нуша-бгаджан
корчхо, о бга̄і, бга̄вер ґа̄н дгоре''
ґупта коре''
ра̄кхчхо бга̄ло вйакта ха''бе йамер ґгаре',
    E'', E'',
    E'Considering women to be hermaphrodites and men to be eunuchs makes one a member
of the Kartta-bhaja sect. On the pretext of this deviant thinking you engage in
mundane sense gratification, thus deluding even your own minds.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'গুরু সত্য'' বলছ মুখে, আছো ত, ভাই, জড়ের সুখে,
সঙ্গ তোমার বহির্মুখে, শুদ্ধ হ''বে ক্যামন করে?', E'গুরু সত্য'' বলছ মুখে, আছো ত, ভাই, জড়ের সুখে,
সঙ্গ তোমার বহির্মুখে, শুদ্ধ হ''বে ক্যামন করে?',
    E'meye
hijḍe, puruṣa khojā, tabe to'' hoy karttā-bhajā,
ei chale
korcho majā, maner prati cokha ṭhere''', E'мейе
хіджд̣е, пуруша кходжа̄, табе то'' хой картта̄-бгаджа̄,
еі чхале
корчхо маджа̄, манер праті чокха т̣хере''',
    E'', E'',
    E'Although your mouths proclaim "the guru is reality," O brothers, you
revel in mundane sense pleasures. You freely associate with envious
non-devotees -- how then will you ever become puriffied?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'যোষিত-সঙ্গ-অর্থ-লোভে, মজে ত'' জীব চিত্ত-ক্ষোভে,
বাউলে কি সে-সব শোভে, আগুন দেখে'' ফড়িং মরে', E'যোষিত-সঙ্গ-অর্থ-লোভে, মজে ত'' জীব চিত্ত-ক্ষোভে,
বাউলে কি সে-সব শোভে, আগুন দেখে'' ফড়িং মরে',
    E'`guru
satya'' bolcho mukhe, ācho to, bhāi, jaḍer sukhe,
sańga
tomār bahirmukhe, śuddha ha''be kemon kore?', E'`ґуру
сатйа'' болчхо мукхе, а̄чхо то, бга̄і, джад̣ер сукхе,
саńґа
тома̄р бахірмукхе, ш́уддга ха''бе кемон коре?',
    E'', E'',
    E'The heart of the jiva becomes greatly agitated by absorption in the association
of materialistic women as well as greed for wealth -- does a true Baul become
attracted by the glitter of these worldly things? A cricket is attracted by a
flame and jumps straight into it, thereby meeting death.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'চাঁদ-বাউল মিনতি করি'' বলে,-ও-সব পরিহরি'',
শুদ্ধ-ভাবে বল হরি'', জা''বে ভব-সাগর-পারে', E'চাঁদ-বাউল মিনতি করি'' বলে,-ও-সব পরিহরি'',
শুদ্ধ-ভাবে বল হরি'', জা''বে ভব-সাগর-পারে',
    E'yoṣit-sańga-artha-lobhe,
maje to'' jīva citta-kṣobhe,
bāule
ki se-sab śobhe, āguna dekhe'' phaḍiḿ mare', E'йошіт-саńґа-артха-лобге,
мадже то'' джı̄ва чітта-кшобге,
ба̄уле
кі се-саб ш́обге, а̄ґуна декхе'' пхад̣іḿ маре',
    E'', E'',
    E'Cand Baul very humbly suggests, "Giving up all these degrading things,
please chant the name of Hari in a purified manner. Then you will surely cross
beyond the ocean of material suffering."
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'cāńda-bāul
minati kori'' bole,o-sab parihari'',
śuddha-bhāve
bolo `hari'', jā''be bhava-sāgara-pāre', E'ча̄ńда-ба̄ул
мінаті корі'' боле,о-саб паріхарі'',
ш́уддга-бга̄ве
боло `харі'', джа̄''бе бгава-са̄ґара-па̄ре',
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
    translation_en = EXCLUDED.translation_en;


  -- Song 6: Eo To Eka Kalir Cela
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Eo To Eka Kalir Cela', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  INSERT INTO public.verses (
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
    E'এও ত'' এক কলির চেলা
মাথা নেডা কপনি পরা, তিলক নাকে, গলায় মালা', E'এও ত'' এক কলির চেলা
মাথা নেডা কপনি পরা, তিলক নাকে, গলায় মালা',
    E'Song
Name: Eo To Eka Kalir Cela
Official
Name: Song 6
Author:
Bhaktivinoda
Thakura
Book
Name: Baul
Sangit
Language:
Bengali
অ', E'Сонґ
Наме: Ео То Ека Калір Чела
Оffічіал
Наме: Сонґ 6
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Баул
Санґіт
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Here is just another disciple of Kali-yuga! He keeps his head shaved, wears a
loincloth, tilak on his nose and tulasi beads around his neck.
2) By
looks he appears to be a Vaisnava, but in actuality his conduct is that of a
sakta, one who worships the principle of material energy in order to enjoy her.
He engages in sahaja-bhajan (so-called "natural worship"), but does
so by posing as "uncle" to the children of others, and then
stealthily taking the illicit association of their daughters.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'দেখতে বৈষ্ণবের মত, আসল শাক্ত কাজের বেলা
সহজ-ভজন কর্ছেন মামু, সঙ্গে ল''য়ে পরের বালা', E'দেখতে বৈষ্ণবের মত, আসল শাক্ত কাজের বেলা
সহজ-ভজন কর্ছেন মামু, সঙ্গে ল''য়ে পরের বালা',
    E'eo to'' eka
kalir celā
māthā
neḍā kapni parā, tilak nāke, galāy mālā', E'ео то'' ека
калір чела̄
ма̄тха̄
нед̣а̄ капні пара̄, тілак на̄ке, ґала̄й ма̄ла̄',
    E'', E'',
    E'Accepting these young girls as sakhis (Radha''s gopi friends), he fancies
himself to be the Son of Nanda. By the deceptive lecturing about how everyone
should become Krsna-dasa (the servant of himself as "Krsna"), this
disciple of Kali-yuga thus hurls a sharp spear at the true devotees of the
Lord.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'সখী -ভাবে ভজ্ছেন তা''রে, নিজে হ''য়ে নন্দ-লালা
কৃষ্ণ-দাসের কথার ছলে মহা-জনকে দিচ্ছেন শলা', E'সখী -ভাবে ভজ্ছেন তা''রে, নিজে হ''য়ে নন্দ-লালা
কৃষ্ণ-দাসের কথার ছলে মহা-জনকে দিচ্ছেন শলা',
    E'dekhte
vaiṣṇaver mata, āsalo śākta kājer belā
sahaja-bhajan
korchena māmu,
sańge
lo''ye parer bālā', E'декхте
ваішн̣авер мата, а̄сало ш́а̄кта ка̄джер бела̄
сахаджа-бгаджан
корчхена ма̄му,
саńґе
ло''йе парер ба̄ла̄',
    E'', E'',
    E'Giving artificial recognition to nava-rasika (the nine relishers), he thus eats
and enjoys the bananas of his own mental fabrications. Cand Baul says, "O
my dear brothers! Desist from this bogus imitation of the Lord''s amorous
sports."
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'নব-রসিক আপনে মানি'' খাচ্ছেন আবার মন-কোলা
বাউল বলে দোহাই, ও ভাই, দূর কর এ লী লা-খেলা', E'নব-রসিক আপনে মানি'' খাচ্ছেন আবার মন-কোলা
বাউল বলে দোহাই, ও ভাই, দূর কর এ লী লা-খেলা',
    E'sakhī-bhāve
bhajchena tā''re, nije ho''ye nanda-lālā
kṛṣṇa-dāser
kathār chale mahā-janake dicchena śalā', E'сакхı̄-бга̄ве
бгаджчхена та̄''ре, нідже хо''йе нанда-ла̄ла̄
кр̣шн̣а-да̄сер
катха̄р чхале маха̄-джанаке діччхена ш́ала̄',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'nava-rasika
āpane māni'' khācchena ābār mana-kolā
bāul
bole dohāi, o bhāi, dūra koro e līlā-khelā', E'нава-расіка
а̄пане ма̄ні'' кха̄ччхена а̄ба̄р мана-кола̄
ба̄ул
боле доха̄і, о бга̄і, дӯра коро е лı̄ла̄-кхела̄',
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
    translation_en = EXCLUDED.translation_en;


  -- Song 7: Hunsar Theko Bhulo Nako
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Hunsar Theko Bhulo Nako', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  INSERT INTO public.verses (
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
    E'(মন আমার) হুঁসা''র থেক, ভূল'' নাক,
শুদ্ধ সহজ তত্ত্ব-ধনে নৈলে মায়ার বশে,
অবশেষে, কাঁদ্তে হ''বে চির-দিনে', E'(মন আমার) হুঁসা''র থেক, ভূল'' নাক,
শুদ্ধ সহজ তত্ত্ব-ধনে নৈলে মায়ার বশে,
অবশেষে, কাঁদ্তে হ''বে চির-দিনে',
    E'⇒ H
Song
Name: Hunsar Theko Bhulo Nako
Official
Name: Song 7
Author:
Bhaktivinoda Thakura
Book
Name: Baul
Sangit
Language:
Bengali
অ', E'⇒ Х
Сонґ
Наме: Хунсар Тхеко Бхуло Нако
Оffічіал
Наме: Сонґ 7
Аутхор:
Бхактівінода Тхакура
Боок
Наме: Баул
Санґіт
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
my dear mind! Please be alert and cautious -- do not forget the treasure that
is the principle of suddha sahaja tattva (pure natural truth as opposed to
bogus sahajiya tendency). Otherwise ultimately in the grip of Maya you will
perpetually weep.
2) The
pure spirit soul is not material, O brother -- understand this correctly -- but
is actually a female sakhi living in Vrndavana. When the soul worships her Lord
Krsna-candra in this mood, then she becomes immersed in pure happiness,
incessantly tasting the sweetness of the madhura-rasa.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'শুদ্ধ-জী বে জড় নাই ভাই, ঠিক বুঝ তাই,
নিজে সখী (সে) বৃন্দাবনে
সে যখন কৃষ্ণ-চন্দ্রে ভজে, সুখেতে মজে,
মধুর-রসে অনুক্ষণে', E'শুদ্ধ-জী বে জড় নাই ভাই, ঠিক বুঝ তাই,
নিজে সখী (সে) বৃন্দাবনে
সে যখন কৃষ্ণ-চন্দ্রে ভজে, সুখেতে মজে,
মধুর-রসে অনুক্ষণে',
    E'(mana
āmār) huńsā''r theko, bhūlo'' nāko,
śuddha
sahaja tattva-dhane
noile
māyār vaśe, avaśeṣe, kāńdte ha''be ciro-dine', E'(мана
а̄ма̄р) хуńса̄''р тхеко, бгӯло'' на̄ко,
ш́уддга
сахаджа таттва-дгане
ноіле
ма̄йа̄р ваш́е, аваш́еше, ка̄ńдте ха''бе чіро-діне',
    E'', E'',
    E'While still living within the material body, she engages in sadhana-bhakti
(regulated devotional service), developing detachment through the cultivation
of jnana (transcendental knowledge), and thus passes life in accordance with
religious principles. Such a devotee lives either at home or in the forest, and
remains engrossed in calling out the name "Krsna!" with single-minded
diligence.
4) Verily
this is called sahaja-bhajan, or natural worship. It is conducted with a
purified mind, and is the one and only means for attaining Krsna. Whoever
deviates from this process by imposing their own concocted philosophy indeed
perishes; their activities are not bhajan.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'জদ-দেহে তা''র সাধন-ভক্তি, জ্ঞান-বিরক্তি,
দেহের যাত্রা ধর্ম-ভাবে
সে গৃহে থাকে, বনে বা থাকে, মজিয়ে ডাকে,
(কৃষ্ণ'') বলে'' এক-মনে', E'জদ-দেহে তা''র সাধন-ভক্তি, জ্ঞান-বিরক্তি,
দেহের যাত্রা ধর্ম-ভাবে
সে গৃহে থাকে, বনে বা থাকে, মজিয়ে ডাকে,
(কৃষ্ণ'') বলে'' এক-মনে',
    E'śuddha-jīve
jaḍa nāi bhāi, ṭhika bujho tāi,
nije
sakhī (se) vṛndāvane
se
jakhan kṛṣṇa-candre bhaje, sukhete maje,
madhura-rase
anukṣaṇe', E'ш́уддга-джı̄ве
джад̣а на̄і бга̄і, т̣хіка буджхо та̄і,
нідже
сакхı̄ (се) вр̣нда̄ване
се
джакхан кр̣шн̣а-чандре бгадже, сукхете мадже,
мадгура-расе
анукшан̣е',
    E'', E'',
    E'This is the conviction of Cand Baul. The devotee of Lord Caitanya named Chota
Haridasa somehow embarked on an improper path; by the mercy of the Son of
mother Saci, he was cast away, alas, and did not again attain the lotus feet of
Gauranga.
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'একে-ই ত'' বলি সহজ-ভজন, শুদ্ধ-মন,
কৃষ্ণ পা''বার এক উপায়
ইহা ছাড়ি'' যে আরোপ করে, সেই ত'' মরে,
তা''র ত'' নাহি ভজন হয়', E'একে-ই ত'' বলি সহজ-ভজন, শুদ্ধ-মন,
কৃষ্ণ পা''বার এক উপায়
ইহা ছাড়ি'' যে আরোপ করে, সেই ত'' মরে,
তা''র ত'' নাহি ভজন হয়',
    E'jaḍa-dehe
tā''r sādhana-bhakti, jñāna-virakti,
deher
yātrā dharma-bhāve
se
gṛhe thāke, bane bā thāke, majiye ḍāke,
(`kṛṣṇa'')
bole'' eka-mane', E'джад̣а-дехе
та̄''р са̄дгана-бгакті, джн̃а̄на-віракті,
дехер
йа̄тра̄ дгарма-бга̄ве
се
ґр̣хе тха̄ке, бане ба̄ тха̄ке, маджійе д̣а̄ке,
(`кр̣шн̣а'')
боле'' ека-мане',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'চাঁদ-বাউলের এ বিশ্বাস, ছোট হরিদাস,
একটু কেবল বিপথে চলে''
শচী-সুতের কৃপায়, দূর হ''য়ে, হায়,
না পায় আর গৌর-চরণে', E'চাঁদ-বাউলের এ বিশ্বাস, ছোট হরিদাস,
একটু কেবল বিপথে চলে''
শচী-সুতের কৃপায়, দূর হ''য়ে, হায়,
না পায় আর গৌর-চরণে',
    E'eke-i
to'' boli sahaja-bhajan, śuddha-mana,
kṛṣṇa
pā''bār eka upāya
ihā
chāḍi'' je āropa kore, sei to'' mare,
tā''r
to'' nāhi bhajan hoy', E'еке-і
то'' болі сахаджа-бгаджан, ш́уддга-мана,
кр̣шн̣а
па̄''ба̄р ека упа̄йа
іха̄
чха̄д̣і'' дже а̄ропа коре, сеі то'' маре,
та̄''р
то'' на̄хі бгаджан хой',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'cāńda-bāuler
e viśvās, choṭa haridās,
ekaṭu
kevala vipathe cale''
śacī-suter
kṛpāy, dūra ho''ye, hāy,
nā
pāy ār gaura-caraṇe', E'ча̄ńда-ба̄улер
е віш́ва̄с, чхот̣а харіда̄с,
екат̣у
кевала віпатхе чале''
ш́ачı̄-сутер
кр̣па̄й, дӯра хо''йе, ха̄й,
на̄
па̄й а̄р ґаура-чаран̣е',
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
    translation_en = EXCLUDED.translation_en;


  -- Song 8: Maner Mala Japa Bij Akhon
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Maner Mala Japa Bij Akhon', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 8;


  INSERT INTO public.verses (
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
    E'মনের মালা জপবি যখন, মন,
ক্যান কর্বি বাহ্য় বিসর্জন মনে মনে ভজন যখন হয়,
প্রেম উঠলে পড়ে'' বাহ্য়-দেহে ব্যাপ্ত হ''য়ে রয়;
আবার দেহে চরে, জপায় করে,
ধরায় মালা অনুক্ষণ', E'মনের মালা জপবি যখন, মন,
ক্যান কর্বি বাহ্য় বিসর্জন মনে মনে ভজন যখন হয়,
প্রেম উঠলে পড়ে'' বাহ্য়-দেহে ব্যাপ্ত হ''য়ে রয়;
আবার দেহে চরে, জপায় করে,
ধরায় মালা অনুক্ষণ',
    E'Song
Name: Maner Mala Japbi Jakhon
Official
Name: Song 8
Author:
Bhaktivinoda Thakura
Book
Name: Baul
Sangit
Language:
Bengali
অ', E'Сонґ
Наме: Манер Мала Джапбі Джакхон
Оffічіал
Наме: Сонґ 8
Аутхор:
Бхактівінода Тхакура
Боок
Наме: Баул
Санґіт
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) My
dear mind, when you chant japa on the mala within your mind, why do you cease
the actions of chanting japa externally? When one performs bhajan within the
mind, and prema factually arises internally, then the external body also
becomes pervaded by those symptoms. Therefore the body rocks and sways, while
one incessantly turns their beads in chanting japa.
2) This
improper form of mental chanting is the tendency of the pretentious so-called
renunciants. As displayed in the fables of the crane and cat, such renunciation
is extremely contemptible. Although such a trait is shown externally, whenever
one gains an opportunity to enjoy women and wealth he continually indulges.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'যে ব্যাটা ভণ্ড-তাপস হয়,
বক-বিডাল দেখা''য়ে বাহ্য় নিন্দে অতিশয়;
নিজে যুত পে''লে কামিনী -কনক করে
সদা সংঘটন', E'যে ব্যাটা ভণ্ড-তাপস হয়,
বক-বিডাল দেখা''য়ে বাহ্য় নিন্দে অতিশয়;
নিজে যুত পে''লে কামিনী -কনক করে
সদা সংঘটন',
    E'maner
mālā japbi jakhan, mana,
keno korbi
bāhya visarjana
mane mane
bhajan jakhan hoy,
prema uṭhle
paḍe'' bāhya-dehe vyāpta ho''ye roy;
ābār
dehe care, japāy kore, dharāy mālā anukṣaṇa', E'манер
ма̄ла̄ джапбі джакхан, мана,
кено корбі
ба̄хйа вісарджана
мане мане
бгаджан джакхан хой,
према ут̣хле
пад̣е'' ба̄хйа-дехе вйа̄пта хо''йе рой;
а̄ба̄р
дехе чаре, джапа̄й коре, дгара̄й ма̄ла̄ анукшан̣а',
    E'', E'',
    E'Inside such a man is merely an empty cavity of deceit. What does he have to
express other than direct blasphemy of the process of executing external
sadhana-bhakti? He thus makes a show of his own mental concoctions as being
supposedly "superior" while he openly condemns the activities of the
true sadhus.
4) O
dear brother! Purify yourself both internally and externally. Stay engaged in
chanting Hari-nama, instead of simply babbling stubbornly with controversial
attitudes. When you pass your life consumed with dry arguments, then Cand Baul
becomes very sad.
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'সে ব্যাটার ভিতর ফক্কাকার,
বাহ্য-সাধন-নিন্দা বৈ আর আছে কিবা তা''র;
(নিজের) মন ভাল দেখা-তে গিয়ে নিন্দে সাধু-আচরণ', E'সে ব্যাটার ভিতর ফক্কাকার,
বাহ্য-সাধন-নিন্দা বৈ আর আছে কিবা তা''র;
(নিজের) মন ভাল দেখা-তে গিয়ে নিন্দে সাধু-আচরণ',
    E'je
vyāṭā bhaṇḍa-tāpasa hoy,
baka-biḍāla
dekhā''ye bāhya ninde atiśoy;
nije juta
pe''le kāminī-kanaka kore sadā saḿghaṭana', E'дже
вйа̄т̣а̄ бган̣д̣а-та̄паса хой,
бака-бід̣а̄ла
декха̄''йе ба̄хйа нінде атіш́ой;
нідже джута
пе''ле ка̄мінı̄-канака коре сада̄ саḿґгат̣ана',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'শুদ্ধ করি'' ভিতর বাহির, ভাই,
হরি-নাম কর্তে থাকো, তর্কে কাজ নাই,
(শুষ্ক) তোমার তর্ক কর্তে জীবন জা''বে
চাঁদ-বাউল তায় দুঃখী হ''ন', E'শুদ্ধ করি'' ভিতর বাহির, ভাই,
হরি-নাম কর্তে থাকো, তর্কে কাজ নাই,
(শুষ্ক) তোমার তর্ক কর্তে জীবন জা''বে
চাঁদ-বাউল তায় দুঃখী হ''ন',
    E'se
vyāṭār bhitora phakkākār,
bāhya-sādhana-nindā
boi ār āche kibā tā''r
(nijer)
mana bhālo dekhā-te giye ninde sādhu-ācaraṇa', E'се
вйа̄т̣а̄р бгітора пхакка̄ка̄р,
ба̄хйа-са̄дгана-нінда̄
боі а̄р а̄чхе кіба̄ та̄''р
(ніджер)
мана бга̄ло декха̄-те ґійе нінде са̄дгу-а̄чаран̣а',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'śuddha
kori'' bhitora bāhira, bhāi,
hari-nām
korte thāko, tarke kāj nāi,
(śuṣka)
tomār tarka korte jīvana jā''be
cāńda-bāul
tāy duḥkhī ho''no', E'ш́уддга
корі'' бгітора ба̄хіра, бга̄і,
харі-на̄м
корте тха̄ко, тарке ка̄дж на̄і,
(ш́ушка)
тома̄р тарка корте джı̄вана джа̄''бе
ча̄ńда-ба̄ул
та̄й дух̣кхı̄ хо''но',
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
    translation_en = EXCLUDED.translation_en;


  -- Song 9: Ghore Bose Baul Haore Mon
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 9, E'Ghore Bose Baul Haore Mon', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 9;


  INSERT INTO public.verses (
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
    E'ঘরে বসে'' বাউল হও রে মন,
ক্যান কর্বি দুষ্ট আচরণ', E'ঘরে বসে'' বাউল হও রে মন,
ক্যান কর্বি দুষ্ট আচরণ',
    E'Song
Name: Ghare Bose Baul Hao
Official
Name: Song 9
Author:
Bhaktivinoda Thakura
Book
Name: Baul
Sangit
Language:
Bengali
অ', E'Сонґ
Наме: Ґхаре Босе Баул Хао
Оffічіал
Наме: Сонґ 9
Аутхор:
Бхактівінода Тхакура
Боок
Наме: Баул
Санґіт
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) O
my dear mind! May you become a transcendentally maddened Baul while remaining
at home! Why do you engage in wicked activities?
2) You
may keep the mood of a Baul within your mind, and giving up improper
association you will automatically obtain sense pleasures in accordance with
religious principles. Thus you will pass your life while every moment
experiencing the bliss of Hari-nama.
3) One
who renounces his home while his heart is not yet purified is called a
markata-vairagi ("monkey-like renunciant"). By the heart being full
of offenses, acting under the control of the enemy, one sinks lower and lower
at every step.
4) A
renunciant immature in renunciation is one who swindles the wives of others and
thus remains just like a fat monkey in charge of a harem of female monkeys.
Furthermore,
such a person goes from door to door out of greed to receive monetary
donations. Thus he engages in the so-called worship of even fallen and degraded
souls.
5) May
your own mind become ripened with maturity while remaining at home. And just
perform Hari-nama sankirtan each and every day. Then, in Cand Baul''s company,
you shall utterly renounce the material world.
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'মনে মনে রাখ্বি বাউল-ভাব,
সঙ্গ ছাড়ি'' ধর্ম-ভাবে কর্বি বিষয় লাভ;
জীবন জাপন কর্বি, হরি-নামানন্দে সর্ব-ক্ষণ', E'মনে মনে রাখ্বি বাউল-ভাব,
সঙ্গ ছাড়ি'' ধর্ম-ভাবে কর্বি বিষয় লাভ;
জীবন জাপন কর্বি, হরি-নামানন্দে সর্ব-ক্ষণ',
    E'ghare bose''
bāul hao re mana,
keno korbi
duṣṭa ācaraṇa', E'ґгаре босе''
ба̄ул хао ре мана,
кено корбі
душт̣а а̄чаран̣а',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'যত-দিন হৃদয়-শধন নয়,
ঘর ছাড়্লে পরে মর্কট-বৈরাগী'' তা''রে কয়;
হৃদয়-দোষে রিপুর বশে, পদে পদে তা''র পতন', E'যত-দিন হৃদয়-শধন নয়,
ঘর ছাড়্লে পরে মর্কট-বৈরাগী'' তা''রে কয়;
হৃদয়-দোষে রিপুর বশে, পদে পদে তা''র পতন',
    E'mane mane
rākhbi bāul-bhāva,
sańga
chāḍi'' dharma-bhāve korbi viṣaya lābha
jīvana
jāpana korbi, hari-nāmānande sarva-kṣaṇa', E'мане мане
ра̄кхбі ба̄ул-бга̄ва,
саńґа
чха̄д̣і'' дгарма-бга̄ве корбі вішайа ла̄бга
джı̄вана
джа̄пана корбі, харі-на̄ма̄нанде сарва-кшан̣а',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'এঁচডে-পাকা বৈরাগী যে হয়,
পরের নারী ল''য়ে পালের গদা হ''য়ে রয়;
(আবার) অর্থ-লোভে দ্বারে দ্বারে করে নীচের আরাধন', E'এঁচডে-পাকা বৈরাগী যে হয়,
পরের নারী ল''য়ে পালের গদা হ''য়ে রয়;
(আবার) অর্থ-লোভে দ্বারে দ্বারে করে নীচের আরাধন',
    E'jata-dina
hṛdoy-śodhana noy,
ghara
chāḍle pare `markaṭa-vairāgī'' tā''re koy
hṛdoy-doṣe
ripur bośe, pade pade tā''r patana', E'джата-діна
хр̣дой-ш́одгана ной,
ґгара
чха̄д̣ле паре `маркат̣а-ваіра̄ґı̄'' та̄''ре кой
хр̣дой-доше
ріпур бош́е, паде паде та̄''р патана',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'ঘরে বসে'' পাকাও নিজের মন,
আর সকল-দিন কর হরির নাম-সঙ্কীর্তন;
তবে চাঁদ বাউলের সঙ্গে শেষে কর্বি
সংসার বিসর্জন', E'ঘরে বসে'' পাকাও নিজের মন,
আর সকল-দিন কর হরির নাম-সঙ্কীর্তন;
তবে চাঁদ বাউলের সঙ্গে শেষে কর্বি
সংসার বিসর্জন',
    E'eńcaḍe-pākā
vairāgī je hoy,
parer
nārī lo''ye pāler godā ho''ye roy
(ābār)
artha-lobhe dvāre dvāre kore nīcer ārādhana', E'еńчад̣е-па̄ка̄
ваіра̄ґı̄ дже хой,
парер
на̄рı̄ ло''йе па̄лер ґода̄ хо''йе рой
(а̄ба̄р)
артха-лобге два̄ре два̄ре коре нı̄чер а̄ра̄дгана',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'ghare bose''
pākāo nijer mana,
ār
sakala-dina koro harir nām-sańkīrtana
tabe
cāńd bāuler sańge śeṣe korbi saḿsāra
visarjana', E'ґгаре босе''
па̄ка̄о ніджер мана,
а̄р
сакала-діна коро харір на̄м-саńкı̄ртана
табе
ча̄ńд ба̄улер саńґе ш́еше корбі саḿса̄ра
вісарджана',
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
    translation_en = EXCLUDED.translation_en;


  -- Song 10: Balavan Vairagi Thakura
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 10, E'Balavan Vairagi Thakura', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 10;


  INSERT INTO public.verses (
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
    E'বলবান বৈরাগী ঠাকুর, কিন্তু গৃহীর মধ্যে বাহাদুর
আবার কপনি পড়ে'', মালা ধরে'', বহেন সেবা-দাসীর ধূর', E'বলবান বৈরাগী ঠাকুর, কিন্তু গৃহীর মধ্যে বাহাদুর
আবার কপনি পড়ে'', মালা ধরে'', বহেন সেবা-দাসীর ধূর',
    E'Song
Name: Balavan Vairagi Thakura
Official
Name: Song 10
Author:
Bhaktivinoda
Thakura
Book
Name: Baul
Sangit
Language:
Bengali
অ', E'Сонґ
Наме: Балаван Ваіраґі Тхакура
Оffічіал
Наме: Сонґ 10
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Баул
Санґіт
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) You
call yourself a very great and venerable renunciant, but factually you are even
more of a sense-gratifier than those who are still householders. Furthermore,
you wear a loincloth for show, and carry tulasi beads in your hand, but like a
beast of burden, you bear the load of trying to seduce various women into
rendering your own service as seva-dasis.
2) You
beg alms everywhere you go, proudly advertising yourself as belonging to the
disciplic lineage of the infallible Lord Krsna (acyuta-gotra) -- but in your
show of deep meditation yoou simply concentrate on repeatedly calculating the
total amount of your acquired rupees and milk. You are expert at begging on
behalf of your belly, and you make a hoax of giving spiritual instructions to
others, ultimately exhibiting the behavior of a businessman. You are a
voracious glutton, accustomed to consuming huge quantities of food.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'অচ্যুত-গোত্র-অভিমানে, ভিক্ষা করেন সর্ব-স্থানে,
টাকা-পয়সা গণি'' ধ্যানে ধারণা প্রচুর
করি'' চুট্কী ভিক্ষা, করেন শিক্ষা,
বণিগ-বৃত্তি পিণ্ডীশূর', E'অচ্যুত-গোত্র-অভিমানে, ভিক্ষা করেন সর্ব-স্থানে,
টাকা-পয়সা গণি'' ধ্যানে ধারণা প্রচুর
করি'' চুট্কী ভিক্ষা, করেন শিক্ষা,
বণিগ-বৃত্তি পিণ্ডীশূর',
    E'balavān
vairāgī ṭhākur, kintu gṛhīr madhye
bāhādur
ābār
kapni pore'', mālā dhore'',
bahena
sevā-dāsīr dhūr', E'балава̄н
ваіра̄ґı̄ т̣ха̄кур, кінту ґр̣хı̄р мадгйе
ба̄ха̄дур
а̄ба̄р
капні поре'', ма̄ла̄ дгоре'',
бахена
сева̄-да̄сı̄р дгӯр',
    E'', E'',
    E'Unto those of such nature, Cand Baul advises -- this is the noose about your
neck. Quiickly cast afar these offenses unto other souls. Worship the Lord in
the honest role of a householder, executing your proper occupational duty
according to your own ability, and thus purify yourself internally.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'বলে তা''রে বাউল-চাঁদ, এটা তোমার গলার ফাঁদ,
জীবের এই অপরাধ শীঘ্র কর দূর
যজি'' গৃহীর ধর্ম, সু-স্বধর্ম,
শুদ্ধ কর অন্তঃপুর', E'বলে তা''রে বাউল-চাঁদ, এটা তোমার গলার ফাঁদ,
জীবের এই অপরাধ শীঘ্র কর দূর
যজি'' গৃহীর ধর্ম, সু-স্বধর্ম,
শুদ্ধ কর অন্তঃপুর',
    E'acyuta-gotra-abhimāne,
bhikṣā korena sarva-sthāne,
ṭākā-payasā
gaṇi'' dhyāne dhāraṇā pracur
kori''
cuṭkī bhikṣā, korena śikṣā,
vaṇig-vṛtti piṇḍīśūr', E'ачйута-ґотра-абгіма̄не,
бгікша̄ корена сарва-стха̄не,
т̣а̄ка̄-пайаса̄
ґан̣і'' дгйа̄не дга̄ран̣а̄ прачур
корі''
чут̣кı̄ бгікша̄, корена ш́ікша̄,
ван̣іґ-вр̣тті пін̣д̣ı̄ш́ӯр',
    E'', E'',
    E'Giving up your desire for being honored as a sannyasi, just worship Krsna in a
humble state of mind. By performing your religious occupational duties according
to your own natural propensity, the seedlings of your vices will be destroyed.
Then you will attain Krsna, your unhappiness will go away, and you will become
very intelligent.
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'ন্যাসী-মান-আশা ত্যজি'', দীন-ভাবে কৃষ্ণ ভজি'',
স্বভাব-গত ধর্ম যজি'', নাশ'' দোষাঙ্কুর;
তবে কৃষ্ণ পা''বে, দুঃখ জা''বে
হ''বে তুমি সু-চতুর', E'ন্যাসী-মান-আশা ত্যজি'', দীন-ভাবে কৃষ্ণ ভজি'',
স্বভাব-গত ধর্ম যজি'', নাশ'' দোষাঙ্কুর;
তবে কৃষ্ণ পা''বে, দুঃখ জা''বে
হ''বে তুমি সু-চতুর',
    E'bole
tā''re bāul-cāńda, eṭā tomār galār
phāńda,
jīver
ei aparādha śīghra koro dūr
yaji''
gṛhīr dharma, su-svadharma,
śuddha
koro antaḥpur', E'боле
та̄''ре ба̄ул-ча̄ńда, ет̣а̄ тома̄р ґала̄р
пха̄ńда,
джı̄вер
еі апара̄дга ш́ı̄ґгра коро дӯр
йаджі''
ґр̣хı̄р дгарма, су-свадгарма,
ш́уддга
коро антах̣пур',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'nyāsī-māna-āśā
tyaji'', dīna-bhāve kṛṣṇa bhaji'',
svabhāva-gata
dharma yaji'', nāś'' doṣāńkur;
tabe
kṛṣṇa pā''be, duḥkha jā''be ha''be tumi su-catur', E'нйа̄сı̄-ма̄на-а̄ш́а̄
тйаджі'', дı̄на-бга̄ве кр̣шн̣а бгаджі'',
свабга̄ва-ґата
дгарма йаджі'', на̄ш́'' доша̄ńкур;
табе
кр̣шн̣а па̄''бе, дух̣кха джа̄''бе ха''бе тумі су-чатур',
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
    translation_en = EXCLUDED.translation_en;


  -- Song 11: Keno Bheker Prayas
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 11, E'Keno Bheker Prayas', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 11;


  INSERT INTO public.verses (
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
    E'ক্যান ভেকের প্রয়াস?
হয় অকাল-ভেকে সর্ব-নাশ
হ''লে চিত্ত-শুদ্ধি, তত্ত্ব-বুদ্ধি,
ভেক আপনি এসে'' হয় প্রকাশ', E'ক্যান ভেকের প্রয়াস?
হয় অকাল-ভেকে সর্ব-নাশ
হ''লে চিত্ত-শুদ্ধি, তত্ত্ব-বুদ্ধি,
ভেক আপনি এসে'' হয় প্রকাশ',
    E'Song
Name: Keno Bheker Prayas
Official
Name: Song 11
Author:
Bhaktivinoda Thakura
Book
Name: Baul
Sangit
Language:
Bengali
অ', E'Сонґ
Наме: Кено Бхекер Прайас
Оffічіал
Наме: Сонґ 11
Аутхор:
Бхактівінода Тхакура
Боок
Наме: Баул
Санґіт
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Why do you have so much desire for changing clothes? By prematurely changing
clothes from those of a householder to those of a renunciant, all is destroyed.
Only when one''s consciousness is first purified, then the intelligence
perceives transcendental truth, and finally the change of clothes will
automatically come and be manifest in its time.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'ভেক ধরি'' চেষ্টা করে, ভেকের জ্বালায় শেষে মরে,
নেডানেডী ছড়াছড়ি, আখডা বেঁধে'' বাস;
অকাল-কুষ্মাণ্ড, যত ভণ্ড,
কর্ছে জীবের সর্ব-নাশ', E'ভেক ধরি'' চেষ্টা করে, ভেকের জ্বালায় শেষে মরে,
নেডানেডী ছড়াছড়ি, আখডা বেঁধে'' বাস;
অকাল-কুষ্মাণ্ড, যত ভণ্ড,
কর্ছে জীবের সর্ব-নাশ',
    E'keno bheker
prayās?
hoy
akāla-bheke sarva-nāś
ho''le
citta-śuddhi, tattva-buddhi,
bheka
āpani ese'' hoy prakāś', E'кено бгекер
прайа̄с?
хой
ака̄ла-бгеке сарва-на̄ш́
хо''ле
чітта-ш́уддгі, таттва-буддгі,
бгека
а̄пані есе'' хой прака̄ш́',
    E'', E'',
    E'But when one makes an artificial endeavor to put on the clothes of an ascetic,
then ultimately one perishes in the fever of that improper dress. Thus one
becomes known as a member of the sect called Neda-Nedi, going about the town
begging alms, and living at the meeting place called akhara. Such a worthless
person, just like a pumpkin grown uselessly at an unsuitable time of year,
finally destroys everything that would be good for their own soul.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'শুক, নারদ, চতুঃসন, ভেকের অধিকারী হ''ন,
তাঁ''দের সমান পার্লে হ''তে ভেকে কর্বে আশ
বল তেমন বুদ্ধি, চিত্ত-শুদ্ধি
ক''জন ধরায় কর্ছে বাস?', E'শুক, নারদ, চতুঃসন, ভেকের অধিকারী হ''ন,
তাঁ''দের সমান পার্লে হ''তে ভেকে কর্বে আশ
বল তেমন বুদ্ধি, চিত্ত-শুদ্ধি
ক''জন ধরায় কর্ছে বাস?',
    E'bheka
dhori'' ceṣṭā kore, bheker jvālāya śeṣe
mare,
neḍāneḍī
chaḍāchaḍi, ākhaḍā beńdhe'' vās;
akāla-kuṣmāṇḍa,
jata bhaṇḍa, korche jīver sarva-nāś', E'бгека
дгорі'' чешт̣а̄ коре, бгекер джва̄ла̄йа ш́еше
маре,
нед̣а̄нед̣ı̄
чхад̣а̄чхад̣і, а̄кхад̣а̄ беńдге'' ва̄с;
ака̄ла-кушма̄н̣д̣а,
джата бган̣д̣а, корчхе джı̄вер сарва-на̄ш́',
    E'', E'',
    E'The great sages Sukadeva Goswami, Narada Muni, and the four Kumaras are truly
qualified to wear the dress of renunciants. One may desire to wear a dress
similar to theirs as soon as one becomes as renounced as they are. Tell me --
who can develop the intelligence and purified heart of these great sages merely
by wearing a particular garment?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'আত্মানাত্ম-সুবিবেকে, প্রেম-লতায় চিত্ত-ভেকে,
ভজন-সাধন-বারিসেকে করহ উল্লাস;
চাঁদ-বাউল বলে, এমন হ''লে,
হ''তে পার্বে কৃষ্ণ-দাস', E'আত্মানাত্ম-সুবিবেকে, প্রেম-লতায় চিত্ত-ভেকে,
ভজন-সাধন-বারিসেকে করহ উল্লাস;
চাঁদ-বাউল বলে, এমন হ''লে,
হ''তে পার্বে কৃষ্ণ-দাস',
    E'śuka,
nārada, catuḥsana, bheker adhikārī ha''na,
tāń''der
samān pārle ho''te bheke korbe āś
bolo temana
buddhi, citta-śuddhi
ka''jana
dharāya korche vās?', E'ш́ука,
на̄рада, чатух̣сана, бгекер адгіка̄рı̄ ха''на,
та̄ń''дер
сама̄н па̄рле хо''те бгеке корбе а̄ш́
боло темана
буддгі, чітта-ш́уддгі
ка''джана
дгара̄йа корчхе ва̄с?',
    E'', E'',
    E'In full knowledge of what is the soul and what is not of the soul, wearing the
dress of a renunciant within your heart, just make your creeper of prema bloom
by sprinkling it with the rainfall of bhajan-sadhana. Cand Baul says, when this
occurs, then you will actually become Lord Krsna''s servant.
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'ātmānātma-suviveke,
prema-latāya citta-bheke,
bhajana-sādhana-vāriseke
koroha ullās;
cāńda-bāul
bole, emana ho''le, ho''te pārbe kṛṣṇa-dās', E'а̄тма̄на̄тма-сувівеке,
према-лата̄йа чітта-бгеке,
бгаджана-са̄дгана-ва̄рісеке
короха улла̄с;
ча̄ńда-ба̄ул
боле, емана хо''ле, хо''те па̄рбе кр̣шн̣а-да̄с',
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
    translation_en = EXCLUDED.translation_en;


  -- Song 12: Hoye Visaye Avesa
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 12, E'Hoye Visaye Avesa', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 12;


  INSERT INTO public.verses (
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
    E'হ''য়ে বিষয়ে আবেশ, পে''লে, মন, জাতনা অশেষ
ছাড়ি'' রাধা-শ্যামে ব্রজ-ধামে, ভুগছ হেথা নানা-ক্লেশ', E'হ''য়ে বিষয়ে আবেশ, পে''লে, মন, জাতনা অশেষ
ছাড়ি'' রাধা-শ্যামে ব্রজ-ধামে, ভুগছ হেথা নানা-ক্লেশ',
    E'⇒ H
Song
Name: Hoye Visaye Avesa
Official
Name: Song 12
Author:
Bhaktivinoda Thakura
Book
Name: Baul
Sangit
Language:
Bengali
অ', E'⇒ Х
Сонґ
Наме: Хойе Вісайе Авеса
Оffічіал
Наме: Сонґ 12
Аутхор:
Бхактівінода Тхакура
Боок
Наме: Баул
Санґіт
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) My
dear mind, you have brought unending trouble upon yourself under the sway of
material sense gratification. Leaving the company of Radha-Syama in
Vraja-dhama, you have come to this material world and suffered a host of
painful miseries.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'মায়া-দেবীর কারাগারে, নিজের কর্ম-অনুসারে,
ভূতের বেগার খাট্তে খাট্তে জীবন কর্ছ শেষ;
করি'' আমি-আমার'', দেহে আবার, কর্ছ জড় রাগ-দ্বেষ', E'মায়া-দেবীর কারাগারে, নিজের কর্ম-অনুসারে,
ভূতের বেগার খাট্তে খাট্তে জীবন কর্ছ শেষ;
করি'' আমি-আমার'', দেহে আবার, কর্ছ জড় রাগ-দ্বেষ',
    E'ho''ye
viṣaye āveśa, pe''le, mana, jātanā aśeṣa
chāḍi''
rādhā-śyāme braja-dhāme,
bhugcho
hethā nānā-kleśa', E'хо''йе
вішайе а̄веш́а, пе''ле, мана, джа̄тана̄ аш́еша
чха̄д̣і''
ра̄дга̄-ш́йа̄ме браджа-дга̄ме,
бгуґчхо
хетха̄ на̄на̄-клеш́а',
    E'', E'',
    E'Trapped within the prison-house of Maya-Devi, and tossed helplessly according
to the urges of your past karma, your life has come to an end after slaving and
slaving away at very difficult and mundane labor. Absorbed in the material
body, thinking in terms of "I" and "mine," you experience
only attraction and repulsion for dull material things.
3) You
are actually composed of spiritually conscious bliss, whose only happiness is
found in Krsna-seva. Alas, you have fallen into the hands of the five material
elements (earth, water, fire, air, and ether), and have thus become just like
an ignorant sheep who is helpless within their firm grip. But now your ultimate
means of deliverance is to be found in the company of sadhus, discussing topics
of the eternally conscious nature.
4) The
association of materialistic women, as well as endeavors for accumulating
wealth for the purpose of sense gratification -- O my dear brother! Give up
such insignificant play! Please accept the pure advice of Cand Baul: Rejecting
all deceptive tendencies that are associated with the sects of impure Bauls,
just enter the flow of pure, spiritual mellows of devotion.
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'তুমি শুদ্ধ চিদানন্দ, কৃষ্ণ-সেবা তা''র আনন্দ,
পঞ্চ-ভূতের হাতে পড়ে'' হায়, আছো একটী মেষ;
এখন সাধু-সঙ্গে, চিত-প্রসঙ্গে,
তোমার উপায় অবশেষ', E'তুমি শুদ্ধ চিদানন্দ, কৃষ্ণ-সেবা তা''র আনন্দ,
পঞ্চ-ভূতের হাতে পড়ে'' হায়, আছো একটী মেষ;
এখন সাধু-সঙ্গে, চিত-প্রসঙ্গে,
তোমার উপায় অবশেষ',
    E'māyā-devīr
kārāgāre, nijer karma-anusāre,
bhūter
vegāra khāṭ-te khāṭ-te jīvana korcho
śeṣa;
kori''
`āmi-āmār'', dehe ābār, korcho jaḍa
rāga-dveṣa', E'ма̄йа̄-девı̄р
ка̄ра̄ґа̄ре, ніджер карма-ануса̄ре,
бгӯтер
веґа̄ра кха̄т̣-те кха̄т̣-те джı̄вана корчхо
ш́еша;
корі''
`а̄мі-а̄ма̄р'', дехе а̄ба̄р, корчхо джад̣а
ра̄ґа-двеша',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'কনক-কামিনী-সঙ্গ, ছাড়ি'' ও ভাই মিছে রঙ্গ,
গ্রহণ কর বাউল চাঁদের শুদ্ধ উপদেশ
ত্যজি'' লুকোচুরি, বাউল-গিরি, শুদ্ধ-রসে কর প্রবেশ', E'কনক-কামিনী-সঙ্গ, ছাড়ি'' ও ভাই মিছে রঙ্গ,
গ্রহণ কর বাউল চাঁদের শুদ্ধ উপদেশ
ত্যজি'' লুকোচুরি, বাউল-গিরি, শুদ্ধ-রসে কর প্রবেশ',
    E'tumi
śuddha cidānanda, kṛṣṇa-sevā tā''r
ānanda,
pañca-bhūter
hāte poḍe'' hāy, ācho ekaṭī meṣa;
ekhona
sādhu-sańge, cit-prasańge,
tomār
upāya avaśeṣa', E'тумі
ш́уддга чіда̄нанда, кр̣шн̣а-сева̄ та̄''р
а̄нанда,
пан̃ча-бгӯтер
ха̄те под̣е'' ха̄й, а̄чхо екат̣ı̄ меша;
екхона
са̄дгу-саńґе, чіт-прасаńґе,
тома̄р
упа̄йа аваш́еша',
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    E'kanaka-kāminī-sańga,
chāḍi'' o bhāi miche rańga,
grahaṇa
koro bāul cāńder śuddha upadeśa
tyaji''
lukocuri, bāul-giri, śuddha-rase koro praveśa', E'канака-ка̄мінı̄-саńґа,
чха̄д̣і'' о бга̄і мічхе раńґа,
ґрахан̣а
коро ба̄ул ча̄ńдер ш́уддга упадеш́а
тйаджі''
лукочурі, ба̄ул-ґірі, ш́уддга-расе коро правеш́а',
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
    translation_en = EXCLUDED.translation_en;


END $$;

COMMIT;
