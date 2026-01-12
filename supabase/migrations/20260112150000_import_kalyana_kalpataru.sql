-- Import Kalyana Kalpataru by Bhaktivinoda Thakura (1893)
-- "Desire Tree of Auspiciousness" - 65 songs across 14 sections
-- Structure: books -> cantos (sections) -> chapters (songs) -> verses

BEGIN;

INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos)
VALUES ('kalyana-kalpataru', 'Kalyana Kalpataru', 'Кальяна Калпатару', true, true)
ON CONFLICT (slug) DO UPDATE SET
  title_ua = EXCLUDED.title_ua,
  has_cantos = EXCLUDED.has_cantos;

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'kalyana-kalpataru';


  -- Section 1: Vandanam
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 1, E'Salutation', E'Вандана (Шанування)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;


  -- Song 1: Vande Vrndavati
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Vande Vrndavati', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Vande Vrndatavi
Official Name: Kalyana Kalpataru Introductory Prayer
Author: Bhaktivinoda Thakura
Book Name: Kalyana Kalpataru
Language: Sanskrit', E'Сонґ Наме: Ванде Врндатаві
Оffічіал Наме: Калйана Калпатару Інтродучторй Прайер
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана Калпатару
Ланґуаґе: Санскріт',
    E'', E'',
    E'Those aspirant practitioners who have first had profound meditation on the
purport of great statements like "tattvamasi", etc., and who have
attained unity with the bliss of merging into the Brahmana effulgence,
themselves find that such so-called bliss is put to shame before the completely
ecstatic spiritual relationship between the taster and tasted mellows. I offer
my respectful obeisances unto that most astonishing abode of such totally
blissful mellows, the very moon over Vrndavana: Sri Krsna, Who is the
delightful festival for Sri Radhika''s eyes.', E'',
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
    E'', E'',
    E'vande vrndatavi-candramradhikaksi-mahotsavam
brahmatmananda-dhikkaripurnananda-rasalayam', E'ванде врндатаві-чандрамрадгікаксі-махотсавам
брахматмананда-дгіккаріпурнананда-расалайам',
    E'', E'',
    E'I offer my respectful obeisances unto the lotus feet of Sri Caitanya
Mahaprabhu, which are the only shelter for all of the greatly fortunate devotees
of Lord Krsna. His lotus feet cast out to a distant place the unbearable burden
of the doctrine of undifferentiated monism, as it was propounded by Sripada
Sankaracarya.', E'',
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
    E'', E'',
    E'caitanya-caranam vandekrsna-bhakta-janasrayam
advaita-mata-dhaureyabharapanodanam param', E'чаітанйа-чаранам вандекрсна-бгакта-джанасрайам
адваіта-мата-дгаурейабгарапаноданам парам',
    E'', E'',
    E'I offer my respectful obeisances unto the lotus feet of my most worshipable
Gurudeva, who is the personified form of blissful Krsna consciousness. Jut to
increase his transcendental happiness; I will compose the book known as
"Kalyan Kalpa-taru".', E'',
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
    E'', E'',
    E'gurum vande mahabhagamkrsnananda-svarupakam
yan mude racayisyamikalyana-kalpa-padapam', E'ґурум ванде махабгаґамкрснананда-сварупакам
йан муде рачайісйамікалйана-калпа-падапам',
    E'', E'',
    E'The aggregate of the following 24 elements I called "prakrti": the 5
gross elements, the 5 objects of the senses, the 5 working senses, the 5
knowledge-acquiring senses, mind, intelligence, ego, and mahattattva. The truth
that is above and beyond all these is called "transcendental truth".
That truth although being the original reservoir of all blissful spiritual
mellows, is not appreciated by all persons, indeed, those who have not
developed unalloyed love and attachment to this transcendental truth will not
read this book, which is just like a small jewel box for guarding the most confidential
gems of ecstatic love. Thus they simply remain attached to meditating on
material bodily happiness, becoming completely submerged and drowned in the
insignificant ocean of lust.', E'',
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
    E'aprakrta-rasanandena yasya kevala ratih
tasyedam na samalocyampustakam prema-samputam', E'апракрта-расанандена йасйа кевала ратіх
тасйедам на самалочйампустакам према-сампутам',
    E'', E'',
    E'In the abode of Vaikuntha, within the forest of ultimate good, there is one
special wish-fulfilling desire tree of supreme auspiciousness, conspicuously
present among all the others.', E'',
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
    E'ayam kalpa-taror-namakalyana-padapah subhah
vaikuntha-nilaye bhativane nihsreyasahvake', E'айам калпа-тарор-намакалйана-падапах субгах
ваікунтха-нілайе бгатіване ніхсрейасахваке',
    E'', E'',
    E'This tree is divided into three principle branches known as "Upadesa"
(spiritual advice), "Upalabdhi" (attainment of realization), and
"Ucchvasa" (overflowing spiritual emotions), which increase the joy
of all persons who are actually wise.', E'',
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
    E'tasya skandha-trayamsuddham vartate vidusam mude
upadesas thatha copalabdhistucchvasakah kila', E'тасйа скандга-трайамсуддгам вартате відусам муде
упадесас тхатха чопалабдгістуччхвасаках кіла',
    E'', E'',
    E'The shelter of this special desire-tree produces the attainment of fruits in
the form of auspiciousness. This means eternal servitude to the performance of
Sri-Sri-Radha-Krsna''s pastimes in the realm of the transcendental forest named
Vrndavana, within the innermost secret abode of Vaikuntha.', E'',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'asritya padapam vidvankalyanam labhate phalam
radha-krsna-vilasesudasyam vrndavane vane', E'асрітйа падапам відванкалйанам лабгате пхалам
радга-крсна-віласесудасйам врндаване ване',
    E'', E'',
    E'I now humbly perform the chanting of all the songs which are sheltered under
the mood of Vraja, just to worship all of Lord Krsna''s jiva souls. This
includes all the Vaisnava residents of Vraja-dhama, Ksetra-dhama, and
Navadvipa-dhama, as well as all the brahmanas who are beyond fruitive
activities and speculative knowledge, as well as all the souls from Lord Brahma
down to the untouchable outcastes and dogs.
REMARKS/EXTRA INFORMATION:
This
is the only song in Sanskrit in the Kalyana Kalpataru. (The Kalyana Kalpataru
is composed in Bengali.)', E'',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'sampujya vaisnavan vipransarva-jivamsca nityasah
kirtayami vinito ''hamgitam vraja-rasasritam', E'сампуджйа ваіснаван віпрансарва-джівамсча нітйасах
кіртайамі вініто ''хамґітам враджа-расасрітам',
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


  -- Section 2: Mangalacarana
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 2, E'Auspicious Invocation', E'Манґалачарана (Сприятлива молитва)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;


  -- Song 1: Jaya Jaya Sri Caitanya Patita
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Jaya Jaya Sri Caitanya Patita', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Jaya Jaya Sri Caitanya Patita Pavana
Official Name: Invocation
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Джайа Джайа Срі Чаітанйа Патіта Павана
Оffічіал Наме: Інвочатіон
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) All glories, all glories
to Lord Sri Caitanya Mahaprabhu,
the deliverer of all the fallen soul! All glories to Sri Nityananda
Prabhu, the divine saviour
of those who are lost and helpless in this world!
2) All Glories to Srimad Advaita Acarya, Who is just like an unfathomable ocean of causeless
mercy! All glories to Srila Rupa
Gosvami, Srila Sanatana Gosvami, and to Sri Gadadhara Pandita!
3) All glories to all the
multitudes of Vaisnavas who are residing in the holy
abode of Vraja-dhama, headed by Srila
Jiva Gosvami, Srila Gopala Bhatta
Gosvami, Srila Raghunatha dasa Gosvami and Srila Raghunatha Bhatta Gosvami!
4) All glories to all the
devotees of The Lord who live in Sri Navadvipa-dhama!
I beg all of you together to kindly bestow your combined mercy upon me.
5) I pray to all you
assembled Vaisnavas throughout the entire universe to
please show your compassion by attracting me to the shade of the lotus feet of
Sri Jahnava Devi, my
eternal shelter and the very pleasure potency of Sri Nityananda
Prabhu.
6) I am certainly most
unfortunate, for I cannot realize who is actually a Vaisnava.
Therefore I beg that, if any real Vaisnavas hear my
prayer, then please be merciful to me.
7) Please bestow upon me
devotional service to the lotus feet of Sri Gurudeva.
Simply by the strength of those feet I can find a clue of the real
transcendental truth.
8) I pray to all of the
bona-fide brahmanas to please show your favor to me
by giving me firm devotional determination unto the lotus feet of Vaisnavas.
9) Thus I have taken
shelter at the feet of all the jiva souls, whether
they are highly elevated or even if they are very low-born, for in truth I am
actually the most fallen soul, very lowly and insignificant.
10) All of you Vainsavas, being very merciful towards me, kindly bless me
with the following boon: I pray that all of you will show your soft-hearted
compassion by respecting and appreciating what this book has to say.
11) If all the devotees
thus appreciate this book, then I will receive the causeless mercy that they
will shower upon me. Oh brothers! And by the mercy of all these Vaisnavas, I will attain devotion to the Supreme Lord Sri Krsna.
12) My dear friends! Know
all. Indeed, this is known throughout all the land.
13) In the transcendental
realm of Sri Vaikuntha-dhama there is a forest of the
supreme perfection of life. Existing beautifully within that transcendental
forest are innumerable wish-fulfilling desire-trees.
14) Amongst all the
desire-trees within this transcendental forest, there stands out one special
tree, which is actually the King of them all. This one is named "the
Desire-tree of Auspiciousness", and it conspicuously exists here within
the eternal abode for all of time.
15) What a wonderful sight
is this special desire-tree, as it stands with its three-fold trunk! These
three divisions branch out as "Upadesa"
(spiritual advice), "Upalabdhi" (attainment
of realization) and "Ucchvasa" (overflowing
spiritual emotions).
16) This tree is very
beautifully decorated with flower blossoms of especially sweet devotional
service. Plus there are innumerable fruits which are named `kalyan''
(auspiciousness).
17) Any honest or noble
person who sincerely takes shelter of this transcendental tree get to taste
these fruits of special, supreme auspiciousness, which is devotional service to
Lord Krsna.
18) By utilizing the
strength that I am obtaining from the mercy of the lotus feet of Sri Gurudeva, I have now brought this wonderful Desire-tree of
Auspiciousness here.
19) Oh honest and noble
persons! Please hear what has happened now. When I brought the tree here, I
have pulled it forcibly and handled it very roughly due to my harsh mentality;
therefore it has now lost it''s original splendorous beauty.
20) Now I wish that all of
you should become the gardeners of this transcendental tree and, by regularly
watering it with your faith and devotion, make it beautiful again.
21) By pouring the water of
your faith, the fruits of auspiciousness will fructify into eternal service to
the Divine Couple Sri-Sri-Radha-Krsna, which all of
us together will taste and relish.
22) Just eat all these
sweet fruits of conjugal service while dancing and chanting the holy names! And
on the strength of this devotional service, please extinguish the blazing
forest fire of all the useless arguments that I will now begin to describe one
by one in the first chapter of this book.
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
    E'', E'',
    E'jaya jaya sri-caitanya patita-pavana
jaya nityananda-prabhu anatha-tarana', E'джайа джайа срі-чаітанйа патіта-павана
джайа нітйананда-прабгу анатха-тарана',
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
    E'', E'',
    E'jaya jayadvaita-candra krpar-sagar
jaya rupa-sanatana, jaya gadadhar', E'джайа джайадваіта-чандра крпар-саґар
джайа рупа-санатана, джайа ґададгар',
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
    E'', E'',
    E'sri-jiva gopala-bhatta raghunatha-dvoy
jaya braja-dhamabasi baisnaba-nicoy', E'срі-джіва ґопала-бгатта раґгунатха-двой
джайа браджа-дгамабасі баіснаба-нічой',
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
    E'jaya jaya navadvipa-basi bhakta-gana
sabe mili'' krpa more koro'' bitarana', E'джайа джайа навадвіпа-басі бгакта-ґана
сабе мілі'' крпа море коро'' бітарана',
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
    E'nikhila baisnaba-jana doya prakasiya
sri-jahnava-pade
more rakhaha taniya', E'нікхіла баіснаба-джана дойа пракасійа
срі-джахнава-паде
море ракхаха танійа',
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
    E'ami to'' durbhaga ati, baisnaba
na cini
more krpa koribena
baisnaba apani', E'амі то'' дурбгаґа аті, баіснаба
на чіні
море крпа корібена
баіснаба апані',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'sri-guru-carane
more bhakti koro'' dana
je carana-bale pai tattver sandhana', E'срі-ґуру-чаране
море бгакті коро'' дана
дже чарана-бале паі таттвер сандгана',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'brahmana sakala kori'' krpa
mor prati
baisnaba-carane
more deho drdhamati', E'брахмана сакала корі'' крпа
мор праті
баіснаба-чаране
море дехо дрдгаматі',
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
    v_chapter_id, '10', 10,
    E'', E'',
    E'ucca nica sarva-jiba carane sarane
loilama ami dina hina
akincana', E'учча ніча сарва-джіба чаране саране
лоілама амі діна хіна
акінчана',
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
    v_chapter_id, '11', 11,
    E'', E'',
    E'sakale koriya krpa deho''
more bar
baisnabe koruna ei granther adar', E'сакале корійа крпа дехо''
море бар
баіснабе коруна еі ґрантхер адар',
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
    v_chapter_id, '12', 12,
    E'', E'',
    E'grantha-dvara baisnaba-janer krpa pai
baisnaba-krpay krsna--labha hoy
bhai', E'ґрантха-двара баіснаба-джанер крпа паі
баіснаба-крпай крсна--лабга хой
бгаі',
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
    v_chapter_id, '13', 13,
    E'', E'',
    E'baisnaba-bimukha ja''re, tahar jibana
nirathaka jano'' bhai, prasiddha
bacana', E'баіснаба-бімукха джа''ре, тахар джібана
ніратхака джано'' бгаі, прасіддга
бачана',
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
    v_chapter_id, '14', 14,
    E'', E'',
    E'sri-baikuntha-dhame
ache nihsreya bana
tahe sobha pay kalpa-taru aganana', E'срі-баікунтха-дгаме
ачхе ніхсрейа бана
тахе собга пай калпа-тару аґанана',
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
    v_chapter_id, '15', 15,
    E'', E'',
    E'taha-majhe e kalyan-kalpa-taru-raja
nitya-kala nitya-dhame korena biraja', E'таха-маджхе е калйан-калпа-тару-раджа
нітйа-кала нітйа-дгаме корена біраджа',
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
    v_chapter_id, '16', 16,
    E'', E'',
    E'skhandha-troy ache ta''r apurva darsana
upadesa, upalabdhi, ucchvasa ganana', E'скхандга-трой ачхе та''р апурва дарсана
упадеса, упалабдгі, уччхваса ґанана',
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
    v_chapter_id, '17', 17,
    E'', E'',
    E'subhakti-prasuna tahe ati sobha
pay
`kalian''
namaka phal aganana tay', E'субгакті-прасуна тахе аті собга
пай
`каліан''
намака пхал аґанана тай',
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
    v_chapter_id, '18', 18,
    E'', E'',
    E'je sujana e bitapi korena asroy
krsna-seva-su-kalyan-phal tanra hoy', E'дже суджана е бітапі корена асрой
крсна-сева-су-калйан-пхал танра хой',
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
    v_chapter_id, '19', 19,
    E'', E'',
    E'sri-guru-carana-krpa-samarthya labhiya
e-heno apurva brksa dilam
aniya', E'срі-ґуру-чарана-крпа-самартхйа лабгійа
е-хено апурва бркса ділам
анійа',
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
    v_chapter_id, '20', 20,
    E'', E'',
    E'taniya anite brksa e karkasa
mana
nasilo ihara sobha, suno,
sadhu-jana', E'танійа аніте бркса е каркаса
мана
насіло іхара собга, суно,
садгу-джана',
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
    v_chapter_id, '21', 21,
    E'', E'',
    E'tomara sakale hao e brkser
mali
sraddha-bari diya punah
koro'' rupasali', E'томара сакале хао е брксер
малі
сраддга-барі дійа пунах
коро'' рупасалі',
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
    v_chapter_id, '22', 22,
    E'', E'',
    E'phalibe kalya-phal-jugala-sevana
koribo sakale mili'' taha asvadana', E'пхалібе калйа-пхал-джуґала-севана
корібо сакале мілі'' таха асвадана',
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
    v_chapter_id, '23', 23,
    E'', E'',
    E'nrtya kori'' hari
bolo'', khao seva-phal
bhakti-bale koro'' dura kutarka-anal', E'нртйа корі'' харі
боло'', кхао сева-пхал
бгакті-бале коро'' дура кутарка-анал',
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


  -- Section 3: Upadesa
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 3, E'Spiritual Advice (First Branch)', E'Упадеша (Духовні настанови)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;


  -- Song 1: Diksa Guru Krpa Kori
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Diksa Guru Krpa Kori', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Diksa Guru Krpa Kori
Official Name: Upadesa
Introduction
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Дікса Ґуру Крпа Корі
Оffічіал Наме: Упадеса
Інтродучтіон
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) The initiating spiritual
master shows his causeless mercy by giving his disciples instructions in
chanting the hari-nama mantra. By so doing he points
the disciples towards the direction of the truths pertaining to the Supreme
Lord Sri Krsna.
2) But I consider the
numerous instructing spiritual masters to be more important, for they show
unlimitedly more mercy by training the neophyte devotees in all the essential
aspects of practical, regulative devotional service (sadhana-bhakti).
3) Therefore, offering my
prostrated obeisances unto the lotus feet of all
instructing spiritual masters, I will now narrate this garland of different
types of spiritual advice, which will all be directed towards my own mind.
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
    E'', E'',
    E'diksa-guru-krpa kori mantra-upadesa
koriya dekhan krsna-tattver nirdesa', E'дікса-ґуру-крпа корі мантра-упадеса
корійа декхан крсна-таттвер нірдеса',
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
    E'', E'',
    E'siksa-guru-brnda krpa koriya apar
sadhake sikhan sadhaner anga-sar', E'сікса-ґуру-брнда крпа корійа апар
садгаке сікхан садганер анґа-сар',
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
    E'', E'',
    E'siksa-guru-gana-pade
koriya pranati
upadesa-mala boli nija manah-prati', E'сікса-ґуру-ґана-паде
корійа пранаті
упадеса-мала болі ніджа манах-праті',
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


  -- Song 2: Mana Re Keno Miche Bhajicho
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Mana Re Keno Miche Bhajicho', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Mana Re Keno Miche Bhajicho Asar
Official Name: Upadesa:
Song 1
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Мана Ре Кено Мічхе Бхаджічхо Асар
Оffічіал Наме: Упадеса:
Сонґ 1
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) Oh my dear mind, please tell
me why you uselessly adore and worship such false things in this world? This
material world is simply composed of five gross elements: earth, water, fire,
air and ether, but the pure spirit soul somehow wants to keep him in a most
degraded condition of abject ruination by remaining within this unfathomable
ocean of inauspiciousness.
2) The spirit soul actually
lives beyond these five gross elements, and he is always spotlessly pure,
devoid of material designations, and abounds in auspicious spiritual happiness.
He is certainly a fit receptacle for pure love of Godhead, which is beyond the
range of maya''s illusions. Oh my dear mind, my dear
friend! You are meant to be situated in pure transcendental existence as pure
spirit soul, so I ask you now - why do you become enchanted and captivated
again and again within this dull material universe?
3) Just become a little
introspective for once, and try to keep in mind the fact that pure spirit soul
is actually eternal and full of nectar. Such intelligent judgments are quite
befitting you. Reassuming your real form as pure soul, just remain always in Vrndavana under the shelter of Sri Caitanya
Mahaprabhu.
4) Make the worship of the
Divine Couple your only object of pursuit. And in the company of Their most dear cowherd girlfriends and maidservants, just
perform transcendentally joyful service unto Their pastimes for all of
eternity. I am not able to predict the destination of those foolish souls who
dare to neglect such a treasure as this conjugal service.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'mana re, keno miche bhajicho asar?
bhutha-maya e sansar, jiber paksete
char,
amangala-samudra apar', E'мана ре, кено мічхе бгаджічхо асар?
бгутха-майа е сансар, джібер паксете
чхар,
аманґала-самудра апар',
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
    E'', E'',
    E'bhutatita suddha-jiba, niranjana sadasiba,
mayatita premer adhar
taba suddha-satta tai, e jada-jagate bhai,
keno mugdha hao bar bar?', E'бгутатіта суддга-джіба, ніранджана садасіба,
майатіта премер адгар
таба суддга-сатта таі, е джада-джаґате бгаі,
кено муґдга хао бар бар?',
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
    E'', E'',
    E'phire dekho eka-bara, atma amrter dharo,
ta''te buddhi ucita tomar
tumi atma-rupi ho''ye sri-caitanya-samasraye,
brndabane thako anibar', E'пхіре декхо ека-бара, атма амртер дгаро,
та''те буддгі учіта томар
тумі атма-рупі хо''йе срі-чаітанйа-самасрайе,
брндабане тхако анібар',
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
    E'nitya-kala sakhi-sange, parananda-seba-range,
jugala-bhajana koro'' sar
e heno jugala-dhana,
chare jei murkha jana,
ta''ra gati nahi dekhi
ar', E'нітйа-кала сакхі-санґе, парананда-себа-ранґе,
джуґала-бгаджана коро'' сар
е хено джуґала-дгана,
чхаре джеі муркха джана,
та''ра ґаті нахі декхі
ар',
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


  -- Song 3: Mana Tumi Bhalo Basa
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Mana Tumi Bhalo Basa', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Mana Tumi Bhalobasa Kamer Taranga
Official Name: Upadesa:
Song 2
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Мана Тумі Бхалобаса Камер Таранґа
Оffічіал Наме: Упадеса:
Сонґ 2
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'My dear mind, you are so fondly attached to rolling to and fro upon the waves
of lust. Abandoning your sensual material lust, just render service in pure spiritual
lust and thus extend yourself into the realm of transcendentally uncommon
pastimes.', E'',
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
    E'', E'',
    E'mana, tumi bhalabasa kamer taranga
jada-kama parihari'', suddha-kama seba kori'',
bistaraho aprakrta ranga', E'мана, тумі бгалабаса камер таранґа
джада-кама паріхарі'', суддга-кама себа корі'',
бістарахо апракрта ранґа',
    E'', E'',
    E'It is not possible to quench the thirst of this temporary mundane lust, for its
nature is to continuously create a disturbing situation. Although you desire the
things associated with lust, still you can not always get them. And even if you
do get the things you lust after, you cannot keep them, for such temporary
things will give up your company very soon.', E'',
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
    E'', E'',
    E'anitya jadiya kama, santi-hina
abisrama,
nahi tahe pipasar bhanga
kamer samagri cao, tabu taha
nahi pao,
paileo chare taba sanga', E'анітйа джадійа кама, санті-хіна
абісрама,
нахі тахе піпасар бганґа
камер самаґрі чао, табу таха
нахі пао,
паілео чхаре таба санґа',
    E'', E'',
    E'My dear mind, you faithfully render service to this mundane lust, but I see
that it actually cannot give you anything substantial; rather, it simply burns
my entire body with miserable dissatisfaction. So then just give up all your
false material lust and just accept the true, spiritual lust by worshiping the
Cupid of Vrndavana. Then, He will shoot your
spiritual body full of His flower arrow, and you will thereby become filled to
the brim with eternal ecstatic love for Him.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'tumi seba koro''
ja''re, se toma'' bhajite nare,
dukha jwale binoder
anga
charo tabe micha-kama,
hao tumi satya-kama,
bhajo vrndavaner ananga
janhar kusuma-sare, taba nitya-kalebare,
byapt ha''be prema
antaranga', E'тумі себа коро''
джа''ре, се тома'' бгаджіте наре,
дукха джвале бінодер
анґа
чхаро табе мічха-кама,
хао тумі сатйа-кама,
бгаджо врндаванер ананґа
джанхар кусума-саре, таба нітйа-калебаре,
бйапт ха''бе према
антаранґа',
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


  -- Song 4: Mana Re Tumi Bara Sandigdha
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Mana Re Tumi Bara Sandigdha', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Mana Re Tumi Boro Sandigdha
Antar
Official Name: Upadesa:
Song 3
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Мана Ре Тумі Боро Сандіґдга
Антар
Оffічіал Наме: Упадеса:
Сонґ 3
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'My dear mind, you are most suspicious and doubtful at heart. Having come into
this material world, and becoming conditioned within the prison cell of this
dull material body, you have become stupefied by being attached continuously to
temporary external matter.', E'',
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
    E'', E'',
    E'mana re, tumi boro sandigdha-antar
asiyacho e samsare, baddha ho''ye jaradhare,
jarasakta ho''le nirantar', E'мана ре, тумі боро сандіґдга-антар
асійачхо е самсаре, баддга хо''йе джарадгаре,
джарасакта хо''ле нірантар',
    E'', E'',
    E'Mind, you are forgetting your own eternal home, and you are rendering faithful
service to dull material lust. Thus you cannot perceive anything beyond the
gross inanimate objects which are directly contacted by your senses. Your true
nature as pure spirit soul has become covered over and remains hidden inside
your body.', E'',
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
    E'', E'',
    E'bhuliya avakiya dhama, sebi'' jaragata kama,
jara bina na dekho
apar
tomar tumitva jini, acchadita ho''ye tini,
lupta-praya deher bhitor', E'бгулійа авакійа дгама, себі'' джараґата кама,
джара біна на декхо
апар
томар тумітва джіні, аччхадіта хо''йе тіні,
лупта-прайа дехер бгітор',
    E'', E'',
    E'Dear mind, according to your materialistic knowledge and feeble enlightenment,
you always meditate on so-called scientific subject matters, but all of that is
simply limited to all the moving and non-moving things which are confined
within the jurisdiction of this temporarily created universe. To whom shall I
tell the story of my anguish? I have abandoned my eternal Father simply to rely
on such an unsubstantial and insignificant reality.', E'',
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
    E'', E'',
    E'tumi to'' jariya jnana, sada koritecho
dhyana,
tahe srsti koro''
caracar
e duhkha
kohibo ka''re, nitya-pati-parihari''
tuccha-tattve korile nirbhar', E'тумі то'' джарійа джнана, сада корітечхо
дгйана,
тахе срсті коро''
чарачар
е духкха
кохібо ка''ре, нітйа-паті-паріхарі''
туччха-таттве коріле нірбгар',
    E'', E'',
    E'My dear mind, you are not seeing the truth of the nature of the soul, and thus
you have given up the natural pure goodness of your heart. You have put a stop
to all spiritual activity by taking yourself far away from the soul. You always
maintain the doubt "does the soul exist or not?", and thus in you
so-called scientific meditations you gradually become more and more fond of
such doubting.', E'',
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
    E'nahi dekho'' atma-tattva, chari dile suddha-sattva,
atma ho''te nile
abasar
atma ache ki na ache, sandeha tomar kache,
krame krame pailo
adar', E'нахі декхо'' атма-таттва, чхарі діле суддга-саттва,
атма хо''те ніле
абасар
атма ачхе кі на ачхе, сандеха томар качхе,
краме краме паіло
адар',
    E'', E'',
    E'My dear mind, in this way you are falling into the illusory mistakes of the
insensitive world of matter, and thus your own real self has become transformed
into an entirely different, false personality. Now just take heed of my advice,
dear friend, and don''t cheat your own soul in this way any longer, but from now
on please keep yourself in the company of the devotees of the Lord.', E'',
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
    E'eirupe krame krame,
pariya jarer bhrame,
apana apani ho''le
par
ebe katha rakho
mor, nahi hao atma-cor,
sadhu-sanga koro'' atahpar', E'еірупе краме краме,
парійа джарер бграме,
апана апані хо''ле
пар
ебе катха ракхо
мор, нахі хао атма-чор,
садгу-санґа коро'' атахпар',
    E'', E'',
    E'By the power of the Vaisnavas'' compassion, then all
of your doubts will be long gone, and your soul will become yours once again.
You will attain the transcendental abode of Vrndavana,
my dear mind, and there you will wait upon Radha-Syama
in your eternal spiritual body which abounds in ecstatic shivering and torrents
of joyful tears. Thus the real wealth of Bhaktivinoda
is to keep continuous, intense absorption in the beautiful lotus feet of Sri Radha-Krsna.
REMARKS/EXTRA INFORMATION:
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
    v_chapter_id, '7', 7,
    E'', E'',
    E'baisnaber krpa-bale, sandeha jaibe ca''le,
tumi punah hoibe
tomar
pa''be brndabana-dhama, sevibe sri radha-syama
pulakasru-moy kalebar
bhaktibinoder dhana, radha-krsna-sri-carana
tahe rati rahun
nirantar', E'баіснабер крпа-бале, сандеха джаібе ча''ле,
тумі пунах хоібе
томар
па''бе брндабана-дгама, севібе срі радга-сйама
пулакасру-мой калебар
бгактібінодер дгана, радга-крсна-срі-чарана
тахе раті рахун
нірантар',
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


  -- Song 5: Mana Tumi Barai Pamara
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Mana Tumi Barai Pamara', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Mana Tumi Barai Pamara
Official Name: Upadesa:
Song 4
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Мана Тумі Бараі Памара
Оffічіал Наме: Упадеса:
Сонґ 4
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) My dear mind, you are
certainly most vile and wicked. Your Lord is Sri Hari,
the Supreme Personality of Godhead. So then why are you abandoning Him to
worship the various demigods, following the path of lust?
2) The Supreme Lord is one
absolute truth, above and beyond the Brahman effulgence. Therefore honor Him
only with resolute determination, and completely dedicate the whole of your
life unto Him. As far as all the innumerable demigods are concerned, their power
and authority compared to His is only partial, for they are each the absolute
controller of only one specific type of work within this material world''s
administrative department.
3) Maintaining polite
respect for all these demigods, worship only Lord Hari,
for He is the only Supreme Controller of all these other small controllers.
Incessantly pass your time, my dear mind, by arduously endeavoring for intense,
single-minded devotional service unto Him, Whose total potency of maya is simply His insignificant shadow reflection.
4) By pouring water on the
root of the tree, all the branches and leaves become strong and healthy. It is
useless to try to pour the water on the top part of the tree only. Similarly,
all the demigods are the dear friend of one who has actual devotion to Hari. Indeed, they all show great honor and respect to the
devotee of the Lord.
5) Now Bhaktivinoda
is telling you, dear mind, just worship always, just worship ceaselessly, just
worship eternally the divine lotus feet of Radha and Krsna.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'mana, tumi barai pamara
tomar isvara hari, tanke
keno parihari'',
kama-marge bhajo'' debantara?', E'мана, тумі бараі памара
томар ісвара харі, танке
кено паріхарі'',
кама-марґе бгаджо'' дебантара?',
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
    E'', E'',
    E'parabrahma ek tattva, tanhate
sanpiya sattva,
nista-gune koroho adar
ara jata deba-gana, misra-sattva aganana,
nija nija karyer iswar', E'парабрахма ек таттва, танхате
санпійа саттва,
ніста-ґуне корохо адар
ара джата деба-ґана, місра-саттва аґанана,
ніджа ніджа карйер ісвар',
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
    E'', E'',
    E'se-sabe sammana kori'' bhajo''
ekamatra hari,
jini sarva-iswar-iswar
maya janra chaya-sakti, tante aikantiki bhakti,
sadhi'' kala kato'' nirantar', E'се-сабе саммана корі'' бгаджо''
екаматра харі,
джіні сарва-ісвар-ісвар
майа джанра чхайа-сакті, танте аікантікі бгакті,
садгі'' кала като'' нірантар',
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
    E'mulete sincile jala, sakha-pallaber
bala,
sire bari nahe karyakar
hari-bhakti ache janra, sarva-deba bandhu tanra,
bhakte sabe korena adar', E'мулете сінчіле джала, сакха-паллабер
бала,
сіре барі нахе карйакар
харі-бгакті ачхе джанра, сарва-деба бандгу танра,
бгакте сабе корена адар',
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
    E'binoda kohiche mana, radha-krsna-sri-carana,
bhajo bhajo bhajo nirantar', E'бінода кохічхе мана, радга-крсна-срі-чарана,
бгаджо бгаджо бгаджо нірантар',
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


  -- Song 6: Mana Keno E Samsaya
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Mana Keno E Samsaya', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Mana Keno E Samsaya
Official Name: Upadesa:
Song 5
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Мана Кено Е Самсайа
Оffічіал Наме: Упадеса:
Сонґ 5
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'My dear mind, why do you have all these skeptical doubts? You despise the
material world just to facilitate your merging into Brahman, but you are afraid
to worship Hari, the Lord of ecstatic love, for fear
of perceiving your own eternal, spiritual form.', E'',
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
    E'', E'',
    E'mana, keno e samsaya
jada-prati ghrna kori''
bhajite premer hari,
svarupa laksite koro'' bhoy', E'мана, кено е самсайа
джада-праті ґгрна корі''
бгаджіте премер харі,
сварупа лаксіте коро'' бгой',
    E'', E'',
    E'This fear is due to your thinking that everything is made of Brahman. You imagine
that if you were to meditate on your eternal spiritual form, that sometime
later you may become influenced by forms made of the material energy. Therefore
you are convinced that the Absolute is without any form, spotlessly pure,
all-pervading, eternal and formless.', E'',
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
    E'', E'',
    E'svarupa korite dhyana, pache jada
paya athana,
ei bhoye bhava''
brahma-moy
nirakara niranjana, sarva-vyapi sanatana,
asvarupa koricho niscoy', E'сварупа коріте дгйана, пачхе джада
пайа атхана,
еі бгойе бгава''
брахма-мой
ніракара ніранджана, сарва-вйапі санатана,
асварупа корічхо нісчой',
    E'', E'',
    E'And now, swayed under the influence of this non-ecstatic philosophy, your
actual blissful spiritual nature has not entered your heart. Therefore your
so-called impersonal Brahman realization has actually short-changed you from
your true ecstasy, and thus you simply remain in scarcity for want of true
love. Renouncing this logical jugglery, just take shelter of beautiful
moon-like Krsna, who is the ecstatic manifestation of
supreme bliss.', E'',
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
    E'', E'',
    E'abhava-dharmer base, svabhava na citta pase,
bhaver abhava tahe hoy
tyaja ei tarka-pasa,
parananda-parakasa,
krsna-candra koroho asroy', E'абгава-дгармер басе, свабгава на чітта пасе,
бгавер абгава тахе хой
тйаджа еі тарка-паса,
парананда-паракаса,
крсна-чандра корохо асрой',
    E'', E'',
    E'In comparison to the impersonal Brahman, Lord Krsna''s
original personal form is composed of eternity, knowledge and bliss. He is the
reservoir and source of pleasure and sweetness for all living entities. He is
the complete form of beauty at all places and at all times. These are some of
His special, wonderful characteristics. None of these wonderful qualities can
be found in the impersonal Brahman.', E'',
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
    E'sac-cit-ananda-moy,
krsner svarupa hoy,
sarvananda-madhurya niloy
sarvatra sampurna-rupa, ei ek aparupa,
sarva-byapi brahme taha noy', E'сач-чіт-ананда-мой,
крснер сварупа хой,
сарвананда-мадгурйа нілой
сарватра сампурна-рупа, еі ек апарупа,
сарва-бйапі брахме таха ной',
    E'', E'',
    E'Therefore I now declare that the Brahman effulgence is actually the
transcendental effulgence of Lord Krsna''s body; it is
His extremely vast ant extensive aura. He who is the Brahman, and above that,
the Prabrahman, is the original form of Lord Sri Krsna, for whom Bhaktivinoda has
love and affection.
REMARKS/EXTRA INFORMATION:
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
    E'ataeva brahma ta''r, anga-kanti suvistar,
brhat boliya tanre kay
brahma parabrahma jei, sri-krsna-svarupa sei,
vinoder jahate pranay', E'атаева брахма та''р, анґа-канті сувістар,
брхат болійа танре кай
брахма парабрахма джеі, срі-крсна-сварупа сеі,
вінодер джахате пранай',
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


  -- Song 7: Mana Tumi Parile Ki Char
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Mana Tumi Parile Ki Char', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Mana Tumi Parile Ki
Char
Official Name: Upadesa:
Song 6
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Мана Тумі Паріле Кі
Чхар
Оffічіал Наме: Упадеса:
Сонґ 6
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'My dear mind, what kind of contemptible rubbish have you fallen into now?
Studying intensely in the schools of Navadvipa, you
have been awarded the distinguished title of "nyaya-ratna"
(a jewel of a logician). Then, disguised as a Vaisnava,
you indulge in long, dull arguments based on logic and reasoning, considering
such logic to be your best object of pursuit. However, such time-wasting
wilderness. In other words, such a sound is simply an unnecessary disturbance
to the ears.', E'',
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
    E'', E'',
    E'mana, tumi parile ki
char?
nabadvipe patha kori'', nyaya-ratna
nama dhori'',
bheker kac kaci koile
sar', E'мана, тумі паріле кі
чхар?
набадвіпе патха корі'', нйайа-ратна
нама дгорі'',
бгекер кач качі коіле
сар',
    E'', E'',
    E'To support your deceptive hoax and to get a firm footing on a bogus
intellectual platform for oppressing and defeating others, you deliberate on an
aggregate of materialistic subjects such as knowledge of intrinsic word
universe. However, the ultimate result of all your logical arguments and your
labeling of material objections simply like a dreadful poison, and you never
considered that this poisonous influence is extremely difficult to check.', E'',
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
    E'', E'',
    E'dravyadi padartha-jnana, chaladi nigraha-sthana,
samavaya korile bicar
tarker carama phala, bhoyankara
halahala,
nahi bicarile durnibar', E'дравйаді падартха-джнана, чхаладі ніґраха-стхана,
самавайа коріле бічар
таркер чарама пхала, бгойанкара
халахала,
нахі бічаріле дурнібар',
    E'', E'',
    E'Just see, dear mind, your heart has indeed become as hard as a rock, and the
seed of the creeper of devotion cannot possibly grow in such a barren place. So
then how will you cross over this vast ocean of material existence? In this
position you can only guess about the nature of the Supreme Lord, just as a
clay pot maker will observe the vast creation. When the simple-minded potter
guesses about the Supreme, he thinks that the entire material creation is just
like a larger version of his own simple potter''s wheel, and that the Lord is
the potter. In other words, by seeing a clay pot, you can guess that there must
have been a potter to make it in the first place. This philosophy is very crude
and contains no scope for developing love for the Supreme Lord.', E'',
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
    E'', E'',
    E'hrdoy kathina ho''lo, bhakti-bija na barilo.
kise ho''be bhava-sindhu par?
anumile je isvar, se kulala-cakradhar,
sadhana kemone ho''be ta''r?', E'хрдой катхіна хо''ло, бгакті-біджа на баріло.
кісе хо''бе бгава-сіндгу пар?
ануміле дже ісвар, се кулала-чакрадгар,
садгана кемоне хо''бе та''р?',
    E'', E'',
    E'Renouncing your own natural samadhi, and practically
worshiping that which you can prove by simply guessing (without actual
realization), Your heart has become devoutly attached
to arguing about such useless logic. Oh, to hell with all this rubbish logic!
It has not made a comfortable seat in my heart for Lord Krsna
to sit on.', E'',
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
    E'sahaja-samadhi tyaji'', anumiti mana bhaji,
tarka-nistha hrdoy tomar
se hrdoye krsna-dhana, nahi pana sukhasana,
aho, dhik sei tarka
char', E'сахаджа-самадгі тйаджі'', ануміті мана бгаджі,
тарка-ністха хрдой томар
се хрдойе крсна-дгана, нахі пана сукхасана,
ахо, дгік сеі тарка
чхар',
    E'', E'',
    E'My dear mind, I advice you to constantly kick out such an unreasonable
argumentative mentality, and just worship the moon-like Krsna-candra,
the Topmost Truth.
REMARKS/EXTRA INFORMATION:
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
    E'anyaya nyayer mata, dura
koro abirata,
bhajo krsna-candra saratsar', E'анйайа нйайер мата, дура
коро абірата,
бгаджо крсна-чандра саратсар',
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


  -- Song 8: Mana Jogi Hote Tomar
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Mana Jogi Hote Tomar', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Mana Jogi Ho''te Tomar
Basana
Official Name: Upadesa:
Song 7
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Мана Джоґі Хо''те Томар
Басана
Оffічіал Наме: Упадеса:
Сонґ 7
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) So, my dear mind, now
you want to become a yogi. You read the various scriptures which describe different
routines and techniques of sense control, breathing exercises and sitting
postures.
2) For attaining ultimate samadhi you undertake many difficult practices like
withdrawal of the senses, meditation and perseverance. Tell me, what wonderful
result will be there in exchange for such endeavor? Minimizing your bodily and
mental activities, and making the senses dull and dry, you live by holding the
breath in suspension. Thus you practice the yoga process while contemplating on
the soul''s nature as Brahman.
3) You will get the
eighteen mystic perfections and, mistaking them to be the greatest object of
reality; you will entertain further wishes for still more wonderful opulences. Abandoning the plane of gross matter and
entering into the subtle astral plane, you will simply undergo more troubles
and tribulations all over again.
4) The eternally pure
wealth of the spirit soul is simply to remain as the humble servant of Lord Hari. In comparison to this eternal wealth, what kind of
spiritual result could possibly come from mundane so-called yoga practice? Just
take refuge totally in the yoga of devotional service and you will become
fearless, for then there is all likelihood of attaining you immortal nectar
very easily.
5) Bhaktivinoda''s
humble entreaty is that you just perform the blissful worship of Radha-Krsna, my dear mind, and immediately reject all other
goals of so-called yoga practice.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'mana, jogi ho''te tomar
basana
joga-sastra adhyayana, niyama-yama-sadhana,
pranayama, asana-racana', E'мана, джоґі хо''те томар
басана
джоґа-састра адгйайана, нійама-йама-садгана,
пранайама, асана-рачана',
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
    E'', E'',
    E'pratyahara, dhyana, dhrti samadhite
ho''le brati,
phala kiba hoibe bolo na
deho-mana suska kori'', rohibe
kumbhaka dhori,
brahmatmata koribe bhavana', E'пратйахара, дгйана, дгрті самадгіте
хо''ле браті,
пхала кіба хоібе боло на
дехо-мана суска корі'', рохібе
кумбгака дгорі,
брахматмата корібе бгавана',
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
    E'', E'',
    E'astadasa siddhi pa''be, paramartha
bhule ha''be,
aisvaryadi koribe kamana
sthula jara parihari'', suksmete pravesa kori'',
punaraya bhugibe jatana', E'астадаса сіддгі па''бе, парамартха
бгуле ха''бе,
аісварйаді корібе камана
стхула джара паріхарі'', суксмете правеса корі'',
пунарайа бгуґібе джатана',
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
    E'atma nitya suddha-dhanahari-dasa akincana,
joge ta''r ki phala
ghatana
koro'' bhakti-jogasroy, na thakibe kon bhoy,
sahaja amrta sambhavana', E'атма нітйа суддга-дганахарі-даса акінчана,
джоґе та''р кі пхала
ґгатана
коро'' бгакті-джоґасрой, на тхакібе кон бгой,
сахаджа амрта самбгавана',
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
    E'binoder e minati, chari'' anya joga-gati,
koro'' radha-krsna aradhana', E'бінодер е мінаті, чхарі'' анйа джоґа-ґаті,
коро'' радга-крсна арадгана',
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


  -- Song 9: Ohe Bhai Mana Keno Brahma
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 9, E'Ohe Bhai Mana Keno Brahma', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Ohe Bhai Mana Keno Brahma Ho''te Cay
Official Name: Upadesa:
Song 8
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Охе Бхаі Мана Кено Брахма Хо''те Чай
Оffічіал Наме: Упадеса:
Сонґ 8
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Oh brothers! Why does my rascal mind desire to merge into the Brahman effulgence?
How astonishing it is! And to whom shall I admit it? My dear mind, please tell
me why you want to merge yourself wit that Supreme Brahman, considering it to
be the most worshipable thing?', E'',
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
    E'', E'',
    E'ohe bhai, mana keno brahma ho''te cay
ki ascarya ko''bo ka''ke,
sadopasya bolo'' ja''ke,
ta''te keno apane misay', E'охе бгаі, мана кено брахма хо''те чай
кі асчарйа ко''бо ка''ке,
садопасйа боло'' джа''ке,
та''те кено апане місай',
    E'', E'',
    E'A drop of water certainly has the qualities of the ocean, but is obviously not
the ocean itself in quantity. A small dwarf cannot possibly touch the moon,
despite his best intentions. And a handful of dust can never assume that it has
become a mountain. Alas! Alas! Such a pitiful position is foolishly upheld by
those who advocate the philosophy of merging into the Lord''s bodily effulgence!
The only profit from such doctrines is that it will make one become offensive
towards the Lord, which will hinder one from attaining the supreme objective of
devotion', E'',
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
    E'', E'',
    E'bindu nahi hoy sindhu,bamana
na sparse indu,
renu ki bhudhara-rupa pay?
labha matra aparadha, paramartha hoy badha,
sayujya-badhir
hay hay', E'бінду нахі хой сіндгу,бамана
на спарсе інду,
рену кі бгудгара-рупа пай?
лабга матра апарадга, парамартха хой бадга,
сайуджйа-бадгір
хай хай',
    E'', E'',
    E'Renouncing this mischievous mentality of trying to artificially merge, my dear
mind! Just purify your existence and start searching for the process of getting
real love for Krsna. If you would just try to understand the statements of the
revealed scriptures, you will find that all the conceptions like sayujya (oneness with the Lord), and nirvana (the highest
blissful absorption) are actually different features which are automatically
achieved by devotion, fro these benefits are unconsciously following the
process of service to the Lord.', E'',
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
    E'', E'',
    E'e heno duranta
buddhi, tyaji'' koro'' sattva-suddhi,
anvesaha pritir upay
''sayujya''-''nirbana''-adi, sastre
sabda dekho jadi,
se-sabe bhaktir ange jay', E'е хено дуранта
буддгі, тйаджі'' коро'' саттва-суддгі,
анвесаха прітір упай
''сайуджйа''-''нірбана''-аді, састре
сабда декхо джаді,
се-сабе бгактір анґе джай',
    E'', E'',
    E'Statements like "tat tvam asi"
(you belong to Krsna) are fully permeated with real tangible love for Krsna,
and meditating on such Veda statements helps the aspiring devotee to ultimately
attain the shelter of Krsna''s lotus feet. Then one
will gain residence in Krsna''s transcendental abode
of Vrndavana, which is completely pervaded with
supreme, undivided bliss. Thus one will come to know the original personal form
of Parabrahman, Who is situated far beyond the
impersonal Brahman effulgence.', E'',
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
    E'krsna-priti phalamoy, ''tattvamasi'', adi hoy,
sadhaka carame krsna pay
akhanda anandamoy, brndabana krsnaloy,
parabrahma-svarupa
janay', E'крсна-пріті пхаламой, ''таттвамасі'', аді хой,
садгака чараме крсна пай
акханда анандамой, брндабана крсналой,
парабрахма-сварупа
джанай',
    E'', E'',
    E'The network of transcendental rays emanating from His body form the splendorous
light known as the Brahman effulgence, which is powerful enough to amaze the
entire collection of material universes. If any of the conditioned souls desire
to become content by merging into that glowing light, then that would be just
like being satisfied at night with the glow of lightning bugs in the absence of
the sun. The insignificant light emitted by such insects will certainly never
serve as a replacement for the radiant sun, and similarly the devotees of Krsna
is never content to merge with the Brahman effulgence, which is very feeble in
comparison to the Lord''s original form of bliss.', E'',
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
    E'ta'' ho''te kirana-jala, brahma-rupe sobhe bhalo,
mayika jagat camatkar
maya-baddha jiba tahe, nirbrta
hoite cahe,
suryabhave khadyoter praya', E'та'' хо''те кірана-джала, брахма-рупе собге бгало,
майіка джаґат чаматкар
майа-баддга джіба тахе, нірбрта
хоіте чахе,
сурйабгаве кхадйотер прайа',
    E'', E'',
    E'If ever there is dawning of one''s good fortune, then one will see Vrndavana shining gracefully before his very eyes due to
taking complete shelter of the virtuous devotees and spiritual masters. Then,
becoming irresistibly attracted by Krsna, one runs and chases after His (the Parabrahman). Thus he simply leaves aside the insignificant
realization of merging with the Brahman effulgence, for gets completely
overwhelmed by the slightest contact with Krsna''s
transcendental mellows.', E'',
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
    E'jadi kabhu bhagyodoye, sadhu-guru-samasroye,
brndabana sammukhete bhay
krsnakrsta ho''ye tabe, ksudra-rasa-anubhave,
brahma chari'' parabrahme dhay', E'джаді кабгу бгаґйодойе, садгу-ґуру-самасройе,
брндабана саммукхете бгай
крснакрста хо''йе табе, ксудра-раса-анубгаве,
брахма чхарі'' парабрахме дгай',
    E'', E'',
    E'Discuss and deliberate on this, my friends, make your life successful just like
the great sages like Sukadeva, Narada,
Vyasa etc., who all gave up Brahman realization by
becoming attracted by Krsna, and then this servant Bhaktivinoda
will hold on to your feet.
REMARKS/EXTRA INFORMATION:
No Extra Information available for this song!', E'',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'sukadira su-jibana, koro'' bhai alocana,
e dasa dhoriche
taba pay', E'сукадіра су-джібана, коро'' бгаі алочана,
е даса дгорічхе
таба пай',
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


  -- Song 10: Mana Re Keno Ar Barna
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 10, E'Mana Re Keno Ar Barna', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Mana Re Keno Ar Varna Abhiman
Official Name: Upadesa:
Song 9
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Мана Ре Кено Ар Варна Абгіман
Оffічіал Наме: Упадеса:
Сонґ 9
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Oh my dear mind, why do you still have this vain
egoistic pride due to your family caste? The fact is that when a sinful man
dies, then no matter who he is the Yamadutas
(the agents of Yamaraja, the demigod of death) will
carry away without paying the slightest respect to his caste and family
lineage.', E'',
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
    E'', E'',
    E'mana re, keno ar barna abhiman,
marile pataki ho''ye, jamadute
ja''be lo''ye,
na koribe jatir samman', E'мана ре, кено ар барна абгіман,
маріле патакі хо''йе, джамадуте
джа''бе ло''йе,
на корібе джатір самман',
    E'', E'',
    E'Even if one does good works and enjoys celestial pleasures in the heavenly
planetary systems, he is still not safe, for after his good karma is exhausted
he gets equal treatment along with brahmanas as well
as dog-eating outcastes. In hell both persons will receive equal punishment in
one place, and for their next birth, equal ruling is administered.', E'',
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
    E'', E'',
    E'jadi bhalo karma koro'', svarga-bhoga atahpara,
ta''te bipra candala saman
narakeo dui jane, danda pa''be
ek sane
janmantare samana bidhan', E'джаді бгало карма коро'', сварґа-бгоґа атахпара,
та''те біпра чандала саман
наракео дуі джане, данда па''бе
ек сане
джанмантаре самана бідган',
    E'', E'',
    E'So then why do you maintain such false pride, dear mind? Your insignificant
caste vanity lasts only to up to the time of your death, when it will be taken
away along with your body. My advice to you is that,
please don''t despise any other caste if you have taken a so called high birth
in this present life. Don''t search for suffering in hell by unnecessarily
scorning another''s apparent low-class birth.', E'',
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
    E'', E'',
    E'tabe keno abhiman, lo''ye tuccha barna-man,
marana abadhi ja''r man
ucca barna-pada dhori'' barnantare ghrna kori'',
naraker na koro'' sandhan', E'табе кено абгіман, ло''йе туччха барна-ман,
марана абадгі джа''р ман
учча барна-пада дгорі'' барнантаре ґгрна корі'',
наракер на коро'' сандган',
    E'', E'',
    E'If you have been born into a position of aristocratic social honor, then just live
as a humble, learned brahmana, dear brother, but
don''t ever dare to abuse or insult any Vaisnava. For
a caste brahmana to oppose or challenge a Vaisnava is just like the story of the poor ginger salesman
who sells only a few paisa worth of ginger roots in the market every day. One
day he saw a huge ship laden with very costly cargos moored on the river. He
went over to the ship and started demanding information about the cargo, the
price, the destination, the profit and so on. He is simply insignificant, but
he wants to lord it over such huge business affairs of the sea-going vessel and
after some time the ship''s crew said, "Well, who are you anyway, that you
are interrogating us so?" And he told them, "I just sell a little
ginger in the bazaar." So if a brahmana
tries to dishonor a bona fide Vaisnava, then he
simply makes useless conflict, and he never becomes wise.', E'',
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
    E'samajika man lo''ye, thako bhai
bipra ho''ye,
baisnabe na koro'' apaman
adara byapari ho''ye, bibada jahaja lo''ye,
kabhu nahi hore, buddhiman', E'самаджіка ман ло''йе, тхако бгаі
біпра хо''йе,
баіснабе на коро'' апаман
адара бйапарі хо''йе, бібада джахаджа ло''йе,
кабгу нахі хоре, буддгіман',
    E'', E'',
    E'So if you would just combine devotion to Krsna with
an effort to the best of your ability, my dear mind, then you will be situated
in the perfect combination of spiritual activity. Then, whatever caste or
material position you happen to be situated in, will become really successful,
and you will attain all desirable things in this way. And Bhaktivinoda
will sing the praises of your glories.
REMARKS/EXTRA INFORMATION:
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
    E'tabe jadi krsna-bhakti, sadha'' tumi jathasakti,
sonaya sohaga pa''be sthan
sarthaka hoibe sutra, sarva-labha ihamutra,
binoda koribe stuti-gan', E'табе джаді крсна-бгакті, садга'' тумі джатхасакті,
сонайа сохаґа па''бе стхан
сартхака хоібе сутра, сарва-лабга іхамутра,
бінода корібе стуті-ґан',
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


  -- Song 11: Mana Re Keno Korobi Dyar
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 11, E'Mana Re Keno Korobi Dyar', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Mana Re Keno Koro Vidya
Official Name: Upadesa:
Song 10
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Мана Ре Кено Коро Відйа
Оffічіал Наме: Упадеса:
Сонґ 10
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) Oh mind, why do you give
such importance to mundane knowledge? Your discussion and deliberation on the smrti scriptures, various languages and grammar certainly
increases the sweet fragrant aroma of your own material reputation, name and
fame.
2) But just look here and
consider this for your judgment. If you have not worshiped Lord Hari, then all of you so-called knowledge is just like a
vicious hell. True devotional service actually takes its birth from the seed of
attraction and affection for Krsna. Such a seed is
impossible to get by the cultivation of ordinary worldly knowledge.
3) I feel that the hair-splitting
scrutiny of mundane knowledge is actually harmful. On the other hand, however,
everyone will appreciate the cultivation of that transcendental knowledge which
awakens love and attachment for Krsna within the
mind.
4) Among all the obstacles
to devotion, this mundane knowledge is certainly the foremost. You must
sincerely kick it out, dear mind, for the real understanding is that Mother Sarasvati, the Goddess of learning, is very dear to Lord Krsna, and devotion to Him is her very heart. This very
devotion is indeed the sanctifying grace of Bhaktivinoda.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'mana re, keno koro vidyar gaurava
smrti-sastra, byakarana, nana-bhasa-alocana,
brddhi kore'' jaser saurabha', E'мана ре, кено коро відйар ґаурава
смрті-састра, бйакарана, нана-бгаса-алочана,
брддгі коре'' джасер саурабга',
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
    E'', E'',
    E'kintu dekho cinta kori''
jadi na bhajile
hari,
bidya taba kevala rauraba
krsna prati anurakti, sei bije janme
bhakti,
bidya ho''te taha asambhava', E'кінту декхо чінта корі''
джаді на бгаджіле
харі,
бідйа таба кевала раураба
крсна праті ануракті, сеі бідже джанме
бгакті,
бідйа хо''те таха асамбгава',
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
    E'', E'',
    E'bidyar marjana ta''r, kabhu
kabhu apakar,
jagatete kori anubhava
je bidyar alocane, krsna-rati sphure mane,
tahari adara jano'' saba', E'бідйар марджана та''р, кабгу
кабгу апакар,
джаґатете корі анубгава
дже бідйар алочане, крсна-раті спхуре мане,
тахарі адара джано'' саба',
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
    E'bhakti badha jaha ho''te,
se bidyar mastakete,
padaghata koro'' akaitaba
sarasvati krsna-priya, krsna-bhakti ta''r hiya
binoder sei se baibhava', E'бгакті бадга джаха хо''те,
се бідйар мастакете,
падаґгата коро'' акаітаба
сарасваті крсна-прійа, крсна-бгакті та''р хійа
бінодер сеі се баібгава',
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


  -- Song 12: Ruper Gaurava Keno Bhai
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 12, E'Ruper Gaurava Keno Bhai', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Ruper Gaurava Keno Bhai
Official Name: Upadesa:
Song 11
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Рупер Ґаурава Кено Бхаі
Оffічіал Наме: Упадеса:
Сонґ 11
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Oh mind, my dear friend, why is your bodily beauty such an object of your proud
vanity? This body is temporary, and there is no certainty whatsoever of permanence.
After Yamaraja has paid his visit and taken your soul
away, this body will then become cold. The eyes will remain motionless, and in
the fiery funeral pyre it will simply turn into ashes.', E'',
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
    E'', E'',
    E'ruper gaurava keno bhai
anitya e kalebar, kabhu nahe sthiratar,
samana aile kichu nai
e anga sitala
ho''be, ankhi spanda-hina ro''be,
citar agune ho''be chai', E'рупер ґаурава кено бгаі
анітйа е калебар, кабгу нахе стхіратар,
самана аіле кічху наі
е анґа сітала
хо''бе, анкхі спанда-хіна ро''бе,
чітар аґуне хо''бе чхаі',
    E'', E'',
    E'Mind, you repeatedly behold the lovely handsomeness of this face, which is your
favorite object of constant vanity. It will simply become delicious food for
dogs and jackals. At that time, where will you keep all the decorative
ornaments and valuable clothes which you appreciate with such high esteem?', E'',
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
    E'', E'',
    E'je saundarya hero, darpanete nirantar,
sva-sibar hoibe bhojana
je bastre adara koro'',
jeba abarana para'',
kotha saba rohibe takhan?', E'дже саундарйа херо, дарпанете нірантар,
сва-сібар хоібе бгоджана
дже бастре адара коро'',
джеба абарана пара'',
котха саба рохібе такхан?',
    E'', E'',
    E'Your beloved wife, sons and friends will take you to the crematorium, and after
burning you they will simply return back to their homes. You belong to whom?
And whom belongs to you? Now just try to grasp the
essential significance of all this. That is, the destruction of this temporary
body will definitely come to pass.', E'',
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
    E'', E'',
    E'dara suta bandhu sabe,
smasane tomare lo''be,
dagdha kori'' grhete asibe
tumi ka''r, ke tomar,
ebe bujhi ''dekho sar,
deho-nasa abasya ghatibe', E'дара сута бандгу сабе,
смасане томаре ло''бе,
даґдга корі'' ґрхете асібе
тумі ка''р, ке томар,
ебе буджхі ''декхо сар,
дехо-наса абасйа ґгатібе',
    E'', E'',
    E'My dear mind, if you really want the eternal, auspicious way of life, then just
sing aloud the glories of the Lord always and everywhere. Also, one should
certainly chant Harinama japa
at all times. Abandoning all useless arguments, dear mind, just worship Krsna, for such worship is certainly the only shelter of Bhaktivinoda.
REMARKS/EXTRA INFORMATION:
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
    E'su-nitya-sambala cao, hari-guna sada gao,
harinama japaha sadai
ku-tarka chariya mana, koro''
krsna aradhana,
binoder asroy tahai', E'су-нітйа-самбала чао, харі-ґуна сада ґао,
харінама джапаха садаі
ку-тарка чхарійа мана, коро''
крсна арадгана,
бінодер асрой тахаі',
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


  -- Song 13: Mana Re Dhana Mada
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 13, E'Mana Re Dhana Mada', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 13;


  INSERT INTO public.verses (
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
    E'Song Name: Mana Re Dhana Mada Nitanta
Asar
Official Name: Upadesa:
Song 12
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Мана Ре Дхана Мада Нітанта
Асар
Оffічіал Наме: Упадеса:
Сонґ 12
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Oh my dear mind, you are greatly intoxicated by your wealth and possessions,
but just let me tell you that this is completely useless. When this body is
gone, your wealth, followers, property as well as everything else that depends
on this body will be good for nothing at all.', E'',
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
    E'', E'',
    E'mane re, dhana-mada nitanta asar
dhana jana bitta jata,
e deher anugata,
deho gele se sakala char', E'мане ре, дгана-мада нітанта асар
дгана джана бітта джата,
е дехер ануґата,
дехо ґеле се сакала чхар',
    E'', E'',
    E'Despite all the vast medical knowledge and dexterous efforts of the advising
physician, one will never be able to keep this temporary body. When the life
airs expire, the only thing which will be left behind is the gross body, for
the soul cannot remain trapped within such a dead container for very long.', E'',
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
    E'', E'',
    E'bidyar jateka cesta, cikitsaka
upadesta
keho deho rakhibare nare
ajapa hoile sesa, deha-matra
abasesa,
jiba nahi thakena adhere', E'бідйар джатека честа, чікітсака
упадеста
кехо дехо ракхібаре наре
аджапа хоіле сеса, деха-матра
абасеса,
джіба нахі тхакена адгере',
    E'', E'',
    E'If wealth had the power to prolong life, then a rich king would never have to
die. The demon named Ravana also thought that he
possessed deathlessness, until he was finally killed by Lord Rama. Thus we see that no one to date has ever been able to
protect and keep his body with any amount of money, for no one can prevent his
body from dying. Therefore what is the use of your riches?', E'',
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
    E'', E'',
    E'dhane jadi prana dita,
dhani raja na marita,
dharamar hoit ravana
dhane nahi rakhe deho,
deho gele nahe keho,
ataeva ki koribe dhana?', E'дгане джаді прана діта,
дгані раджа на маріта,
дгарамар хоіт равана
дгане нахі ракхе дехо,
дехо ґеле нахе кехо,
атаева кі корібе дгана?',
    E'', E'',
    E'Dear mind, if you have any excess wealth, then just make yourself lowly and
humble and use that wealth to do something beneficial for the service of the Vaisnavas. Constantly showing compassion to all souls,
worship Radha-Krsna and always make your standard of
behavior clean, saintly and virtuous.
REMARKS/EXTRA INFORMATION:
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
    E'jadi thake bahu dhana,
nije ho''be akincana,
baisnaber koro upakar
jibe doya anuksana,
radha-krsna-aradhana,
koro sada ho''ye sadacar', E'джаді тхаке баху дгана,
нідже хо''бе акінчана,
баіснабер коро упакар
джібе дойа ануксана,
радга-крсна-арадгана,
коро сада хо''йе садачар',
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


  -- Song 14: Mana Tumi Sannyasi Sajite
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 14, E'Mana Tumi Sannyasi Sajite', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 14;


  INSERT INTO public.verses (
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
    E'Song Name: Mana Tumi Sannyasi Sajite
Keno Cao
Official Name: Upadesa:
Song 13
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Мана Тумі Саннйасі Саджіте
Кено Чао
Оffічіал Наме: Упадеса:
Сонґ 13
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'My dear mind, why do you want to disguise yourself as a sannyasi?
As much as you decorate yourself externally with this garb, to that same degree
you deceive yourself internally with this hoax. Worshiping your own false
pride, your simply make a show of your material body by artificially accepting
the dress of the renounced order.', E'',
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
    E'', E'',
    E'mana, tumi sannyasi sajite
keno cao?
bahirer saja jata, antarete
phanki tata,
dambha puji'' sarira nacao', E'мана, тумі саннйасі саджіте
кено чао?
бахірер саджа джата, антарете
пханкі тата,
дамбга пуджі'' саріра начао',
    E'', E'',
    E'Now please try to understand my advice on how to become a true sannyasi. Just make your heart completely pure, and
constantly drink the nectar of Krsna consciousness.
Search for that life-style which allows your spiritual life to be executed
easily and automatically, free from any distracting obstacles to pure devotion.', E'',
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
    E'', E'',
    E'amar bacana dharo, antara
bisuddha koro,
krsnamrta sada koro pana
jibana sahaje jay, bhakti-badha nahi pay,
tadupaya koroho sandhana', E'амар бачана дгаро, антара
бісуддга коро,
крснамрта сада коро пана
джібана сахадже джай, бгакті-бадга нахі пай,
тадупайа корохо сандгана',
    E'', E'',
    E'Just be satisfied with whatever you get easily, and never endeavor for any type
of artificial pomp and grandeur. Even if you do not have proper clothes to
wear, just wear a loin-cloth, dear brother! And in cold weather you can simply
wear an old torn quilt.', E'',
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
    E'', E'',
    E'anayase jaha pao, tahe
tusta hoye jao,
arambare na koro prayas
purna-bastra jadi nai, kaupina
paro he bhai,
sita-bastra kantha bahirbas', E'анайасе джаха пао, тахе
туста хойе джао,
арамбаре на коро прайас
пурна-бастра джаді наі, каупіна
паро хе бгаі,
сіта-бастра кантха бахірбас',
    E'', E'',
    E'There is no need for fancy sandalwood pulp scented with perfume, my dear brother, you can use some ordinary earth or clay to mark
your forehead with tilaka. Your fancy necklaces can
be exchanged for a nice tulasi mala.
Living like this in such a simple state of mind, all the nonsense material
arrangements for so-called happiness will diminish, and you will thus be able
to escape from the burning fever of materialistic existence.', E'',
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
    E'aguru candana nai, mrttika-tilaka
bhai,
harer badale dharo mala
eirupe asa-pas, sukhadir kubilas,
kharbi charo samsarer jvala', E'аґуру чандана наі, мрттіка-тілака
бгаі,
харер бадале дгаро мала
еірупе аса-пас, сукхадір кубілас,
кхарбі чхаро самсарер джвала',
    E'', E'',
    E'In reality it is the strict rule of renunciation that is the wealth of the sannyasa asrama. By following
this rule, one would certainly never look forward to receiving respect from
others. Beware, dear brother! Deliverance from this material world is not
possible for one who wants to get such respect by taking sannyasa.
Instead, he gets ensnared in mundane existence due to constantly maintaining
the conceited pride of subtle profit, adoration and distinction.', E'',
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
    E'sannyasa-bairagya-bidhi, sei asramer nidhi,
tahe kabhu na koro''
adar
se-saba adare bhai, samsare
nistar nai,
dambhiker linga nirantar', E'саннйаса-баіраґйа-бідгі, сеі асрамер нідгі,
тахе кабгу на коро''
адар
се-саба адаре бгаі, самсаре
ністар наі,
дамбгікер лінґа нірантар',
    E'', E'',
    E'You are actually an eternal servant of Lord Caitanya,
and your real interest as such, is devotion to Hari.
What other wonderful thing could you get from the external form of the sannyasa asrama? Casting all
false prestige to a far distant place, just make your residence in the
transcendentally peaceful realm, beyond the varnasrama-dharma
system and just live on the mercy of the Rupanuga Vaisnavas as your only life-giving
substance.', E'',
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
    E'tumi to'' caitanya-das, hari-bhakti taba as,
asramer linge kiba phal?
pratista koroho dura, basa
taba santipura,
sadhu krpa tomar sambal', E'тумі то'' чаітанйа-дас, харі-бгакті таба ас,
асрамер лінґе кіба пхал?
пратіста корохо дура, баса
таба сантіпура,
садгу крпа томар самбал',
    E'', E'',
    E'It is actually not even necessary to introduce oneself a Vaisnava,
and once should never try to make a show of external pomp and grandeur, Bhaktivinoda''s humble submission to you is that you should
constantly sing songs about the glorious qualities of Radha
and Krsna at the top of your lungs.
REMARKS/EXTRA INFORMATION:
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'baisnaber paricoy, abasyaka nahi hoy,
arambare kabhu nahi jao
binoder nebedana, radha-krsna-guna-gana,
phukari'' phukari'' sada gao', E'баіснабер парічой, абасйака нахі хой,
арамбаре кабгу нахі джао
бінодер небедана, радга-крсна-ґуна-ґана,
пхукарі'' пхукарі'' сада ґао',
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


  -- Song 15: Mana Tumi Tirthe Sadarata
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 15, E'Mana Tumi Tirthe Sadarata', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 15;


  INSERT INTO public.verses (
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
    E'Song Name: Mana Tumi Tirthe Sada
Rata
Official Name: Upadesa:
Song 14
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Мана Тумі Тіртхе Сада
Рата
Оffічіал Наме: Упадеса:
Сонґ 14
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'My dear mind, you are always attached to all the different places of pilgrimage
such as Ayodhya, Mathura,
Maya, Kasi (Varanasi), Kancipura, Avantiya, Dvaravati, and so on.', E'',
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
    E'', E'',
    E'mana, tumi tirthe sada
rata
ayodhya, mathura, maya, kasi, kanci, abantiya,
dvarabati, ar ache jata', E'мана, тумі тіртхе сада
рата
айодгйа, матхура, майа, касі, канчі, абантійа,
дварабаті, ар ачхе джата',
    E'', E'',
    E'You want to travel to all these holy places of pilgrimage again and again
simply to the sake of obtaining liberation from the material miseries. But we actually
see that your heart is not becoming resolutely fixed up by going to all these
places; therefore all of you wanderings are simply useless labor for nothing
tangible.', E'',
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
    E'', E'',
    E'tumi caho bhramibare,
e sakala bare bare,
mukti-labha koribara tare
se sakala
taba bhrama, nirarthaka parisrama,
citta sthira tirthe nahi kore', E'тумі чахо бграмібаре,
е сакала баре баре,
мукті-лабга корібара таре
се сакала
таба бграма, нірартхака парісрама,
чітта стхіра тіртхе нахі коре',
    E'', E'',
    E'The ripened fruit and real benefit of any place of pilgrimage is the company of
the pure-hearted devotees of the Lord. Establishing intimate and friendly
relations with such devotees, let your mind be captivated by performing the
charming worship of Lord Krsna in their association.
Actually any place in the entire world becomes a worshipable
place of pilgrimage if devotees are living there. Thus you should immediately
seek out such a place, wherever you happen to be, and you should become fixed
up in Krsna consciousness by constantly remaining in
the company of such devotees.', E'',
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
    E'', E'',
    E'tirtha-phal sadhu-sanga, sadhu-sange antaranga,
sri-krsna-bhajana manohar
jatha sadhu, tatha tirtha, sthira
kori'' nija citta,
sadhu-sanga koro nirantar', E'тіртха-пхал садгу-санґа, садгу-санґе антаранґа,
срі-крсна-бгаджана манохар
джатха садгу, татха тіртха, стхіра
корі'' ніджа чітта,
садгу-санґа коро нірантар',
    E'', E'',
    E'Personally, I never bother to visit any so-called place of pilgrimage which is
devoid of the presence of unalloyed devotees, for what other worthwhile benefit
could possibly be gained by taking the trouble of walking to such faraway
places? Only that place which is graced by the presence of the devotees is
actually Vrndavana, and only at that place can you
come into contact with unlimited spiritual pleasure.', E'',
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
    E'je tirthe baisnaba nai, se tirthe nahi jai,
ki labha hantiya
dura-desa
jathay baisnaba-gana, sei stana brndabana,
sei sthane ananda asesa', E'дже тіртхе баіснаба наі, се тіртхе нахі джаі,
кі лабга хантійа
дура-деса
джатхай баіснаба-ґана, сеі стана брндабана,
сеі стхане ананда асеса',
    E'', E'',
    E'Liberation personified is herself the humble maidservant of that place which is
surcharged with devotion to Krsna. All the water at
that place is the celestial Ganges, every hill there is Giri-govardhana,
and the very earth is indeed Vrndavana. Only such a
place can manifest the appearance of the eternal spiritual joy which is
revealed by the Lord''s pleasure-potency.', E'',
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
    E'krsna-bhakti jei sthane,
mukti dasi seikhane,
salila tathay mandakini
giri tatha govardhana,
bhumi tatha brndabana,
abirbhuta apani hladini', E'крсна-бгакті джеі стхане,
мукті дасі сеікхане,
саліла татхай мандакіні
ґірі татха ґовардгана,
бгумі татха брндабана,
абірбгута апані хладіні',
    E'', E'',
    E'I ask you now, dear brother, what benefit would I get by circumambulating all
of the holy places of pilgrimage? Personally, my vow is to serve the Vaisnavas with firm resolution and untiring endeavor.
REMARKS/EXTRA INFORMATION:
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
    v_chapter_id, '7', 7,
    E'', E'',
    E'binoda kohiche bhai, bhramiya ki phal pai,
baisnaba-sebana mor brata', E'бінода кохічхе бгаі, бграмійа кі пхал паі,
баіснаба-себана мор брата',
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


  -- Song 16: Dekho Mana Brate Je Nan Nahao
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 16, E'Dekho Mana Brate Je Nan Nahao', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 16;


  INSERT INTO public.verses (
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
    E'Song Name: Dekho Mana Brate Jena
Official Name: Upadesa
Song 15
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Декхо Мана Брате Джена
Оffічіал Наме: Упадеса
Сонґ 15
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) Be careful, my dear
mind, that you don''t become bewildered by ritualistic vows. With an aim to
please Radha-Krsna and make Them
favorably disposed to you, you accept various types of austere vows. You
consider that this will be conducive to practicing devotional service.
2) Devotional service is
actually a very simple and easily understood truth, for it is the soul''s
natural, inborn tendency. Your desire is to expand and enrich that devotion
which is already existing in your heart. But you
should be careful to consider that by undertaking unnecessarily difficult vows
and austerities, you don''t destroy the simplicity of the natural bhakti process.
3) The results that you get
from hard labor on Krsna''s behalf are extraordinary
and should never be considered to be commonplace. However, if such service
turns into an unnecessarily difficult austerity, then it becomes an obstacle to
devotion, and it will prevent you from getting the real benefit of devotion.
Instead, you will only get the benefit of the results of the austerity.
4) But just try to understand
this, my dear brother. If one is worshiping Hari,
then there is no need to labor for penances and austerities. If devotional
service does not manifest as the result of some type of austerity, then the
insignificant result of that austerity will never be accepted by a true Vaisnava at any time.
5) From all
this, just try to understand the deep inner significance of the
principles of Vaisnava behavior. That is, according
to differences in receptivity of different persons, there is a definite difference
in their rightful capacity in devotional service. Bhaktivinoda''s
humble submission is that you should just become a sara-grahi
and accept the essence of complete surrender to Krsna, thus becoming freed
from, and transcendental to, all types of scriptural rules and regulations.
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
    E'', E'',
    E'dekho mana, brate jena na hao
acchanna
krsna-bhakti asa kori''acho nana brata dhori'',
radha-krsne korite prasanna', E'декхо мана, брате джена на хао
аччханна
крсна-бгакті аса корі''ачхо нана брата дгорі'',
радга-крсне коріте прасанна',
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
    E'', E'',
    E'bhakti je sahaja tattva,citte
ta''r ache sattva,
tahar samrddhi taba asa
dekhibe bicara kori'',su-katina brata dhori'',
sahajer na koro binasa', E'бгакті дже сахаджа таттва,чітте
та''р ачхе саттва,
тахар самрддгі таба аса
декхібе бічара корі'',су-катіна брата дгорі'',
сахаджер на коро бінаса',
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
    E'', E'',
    E'krsna-arthe kayaklesa,ta''r phal ache sesa
kintu taha samanya na
hoy
bhaktir badhaka ho''le,bhakti ar nahi phale,
tapah-phal hoibe niscoy', E'крсна-артхе кайаклеса,та''р пхал ачхе сеса
кінту таха саманйа на
хой
бгактір бадгака хо''ле,бгакті ар нахі пхале,
тапах-пхал хоібе нісчой',
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
    E'kintu bheve dekho bhai,tapasyar
kaj nai,
jadi hari aradhita hana
bhakti jadi na phalil,tapasyar
tuccha phal,
baisnaba na loy kadacana', E'кінту бгеве декхо бгаі,тапасйар
кадж наі,
джаді харі арадгіта хана
бгакті джаді на пхаліл,тапасйар
туччха пхал,
баіснаба на лой кадачана',
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
    E'ihate je gudha marma,bhujo
baisnaber dharma,
patra-bhede adhikara bhinna
binoder nibedana,bidhi-mukta anuksana,
sara-grahi sri-krsna-prapanna', E'іхате дже ґудга марма,бгуджо
баіснабер дгарма,
патра-бгеде адгікара бгінна
бінодер нібедана,бідгі-мукта ануксана,
сара-ґрахі срі-крсна-прапанна',
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


  -- Song 17: Mana Tumi Barai Cancala
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 17, E'Mana Tumi Barai Cancala', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 17;


  INSERT INTO public.verses (
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
    E'Song Name: Mana Tumi Barai Cancala
Official Name: Upadesa:
Song 16
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Мана Тумі Бараі Чанчала
Оffічіал Наме: Упадеса:
Сонґ 16
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) Oh, my dear mind, you
are certainly most restless and flickering. You are not attracted by unalloyed
devotees of the Lord who are free from crooked complications, but instead you
remain strongly attached to the company of sly, hypocritical cheaters.
2) Those strange, deviant
imposters are considered by you to be sadhus, and you
are dancing merrily in their company. And those who have a cruel and
hard-hearted nature are your most worshipable objects
of reverence. In great devotion you fall down at the feet of such rascals.
3) The real result of
devotion fructifies for one who keeps the company of the true devotees of the
Lord in a peaceful mood devoid of cheating propensities. My dear mind, giving
up your unsteady flickering nature and abandoning the association of sly deceitful
cheaters in a far distant place, just worship the beautiful lotus feet of Krsna.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'mana, tumi barai cancala
ekanta sarala bhakta-jane naha anurakta,
dhurta-jane asakti prabala', E'мана, тумі бараі чанчала
еканта сарала бгакта-джане наха ануракта,
дгурта-джане асакті прабала',
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
    E'', E'',
    E'bujrugi jane jei,taba
sadhu-jana sei,
ta''r sanga tomare
nacay
krura-besa dekho ja''rsraddhaspada
se tomar,
bhakti kori paro
ta''r pay', E'буджруґі джане джеі,таба
садгу-джана сеі,
та''р санґа томаре
начай
крура-беса декхо джа''рсраддгаспада
се томар,
бгакті корі паро
та''р пай',
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
    E'', E'',
    E'bhakta-sanga hoy janra,bhakti-phal
phale ta''r,
akaitave santa-bhava dharo
cancalata chari mana,bhajo
krsna-sri-carana,
dhurta-sanga dure parihara''', E'бгакта-санґа хой джанра,бгакті-пхал
пхале та''р,
акаітаве санта-бгава дгаро
чанчалата чхарі мана,бгаджо
крсна-срі-чарана,
дгурта-санґа дуре паріхара''',
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


  -- Song 18: Mana Tore Boli E Barata
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 18, E'Mana Tore Boli E Barata', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 18;


  INSERT INTO public.verses (
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
    E'Song Name: Mana Tore Boli E Barata
Official Name: Upadesa:
Song 17
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Мана Торе Болі Е Барата
Оffічіал Наме: Упадеса:
Сонґ 17
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) My dear mind, I have
this message to convey to you. Alas, how remorseful it is that you have sold
your own individuality and freedom to choose intelligently, due to being
cheated by other cheaters who dissuade you away from the path of spiritual life
given you by your guru. At your tender immature stage of spiritual realization,
you listen to such cheaters, only to be misled from the true path.
2) You now have a new
talent for finding faults with the society of devotees and the whole disciplic succession as well. Constantly trying to be aware
of these minor faults that you find, you become very careful to try to
"purify" yourself. Wearing neck beads no longer, marking your
forehead with tilaka no longer, you have now made up
your own new set of rules and regulations. You have rejected your initiating
spiritual master (diksa-guru), because you now
imagine his influence to be a burning sensation in your heart.
3) Dear mind, you
artificially, agree with your former opinion, but you really don''t accept or
follow it, and instead you broadcast your own whimsical philosophy just to
establish yourself as some sort of incarnation. Trying to find mistakes in the
spiritual process and activities of the great devotees, you completely toss out
your previous spiritual path as rubbish, neglecting all of your former vows and
practices.
4) You have become most
displeased because you think that tilaka, initiation,
and neck beads are accepted only by sly, cunning cheaters. You become angry
when you find some insignificant fault with the process of the treat souls, and
thus you reject all attachment to the path.
5) Now just see here, dear
brother, your present life as well as your future life are at stake. You have
renounced pure gold simply to take some worthless ashes. Everyone says that you
are bogus. If you don''t accept the process of bona fide devotional service,
then how will you be delivered at the time of your death?
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'mana, tore boli e barata
apakka bayase hay, bancita bancaka-pa''y,
bikaile nija-svatantrata', E'мана, торе болі е барата
апакка байасе хай, банчіта банчака-па''й,
бікаіле ніджа-сватантрата',
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
    E'', E'',
    E'sampradaye dosa-bhuddhi, jani'' tumi atma-suddhi,
koribare hoile sabadhan
na nile tilaka-mala, tyajile diksar jvala
nije koile nabina-bidhan', E'сампрадайе доса-бгуддгі, джані'' тумі атма-суддгі,
корібаре хоіле сабадган
на ніле тілака-мала, тйаджіле діксар джвала
нідже коіле набіна-бідган',
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
    E'', E'',
    E'purva-mate tali diya, nija-mata
pracariya,
nije avatar buddhi dhori''
bratacar na maile, purva-patha
jale dile,
mahajane bhrama-drsti kori''', E'пурва-мате талі дійа, ніджа-мата
прачарійа,
нідже аватар буддгі дгорі''
братачар на маіле, пурва-патха
джале діле,
махаджане бграма-дрсті корі''',
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
    E'phonta, diksa, mala dhori'',
dhurta kore'' su-caturi,
tai tahe tomar
biraga
mahajana-pathe dosa, dekhiya tomar
rosa,
patha-prati charo anuraga', E'пхонта, дікса, мала дгорі'',
дгурта коре'' су-чатурі,
таі тахе томар
біраґа
махаджана-патхе доса, декхійа томар
роса,
патха-праті чхаро анураґа',
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
    E'ekhan dekhaha bhai, svarna chari''
loile chai,
ihakal parakal jay
kapata bolila sabe, bhakati ba
pele kabe,
dehante ba ki
ho''be upay?', E'екхан декхаха бгаі, сварна чхарі''
лоіле чхаі,
іхакал паракал джай
капата боліла сабе, бгакаті ба
пеле кабе,
деханте ба кі
хо''бе упай?',
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


  -- Song 19: Ki Ar Boli Bo Tore Mana
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 19, E'Ki Ar Boli Bo Tore Mana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 19;


  INSERT INTO public.verses (
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
    E'Song Name: Ki Ar Bolibo Tore Mana
Official Name: Upadesa:
Song 18
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Кі Ар Болібо Торе Мана
Оffічіал Наме: Упадеса:
Сонґ 18
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'What more shall I say to you, my dear mind? You are expert at giving
lip-service by always speaking of "love for Krsna,
love for Krsna", but the real fact is that you
are renouncing the real gold simply to tie an empty knot in the border of your
cloth. (In other words, you lose the substance to grasp at something false).', E'',
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
    E'', E'',
    E'ki ar bolibo tore mana?
mukhe bolo "prema prema" bastutah tyajiya hema,
sunya-grantha ancale bandhana', E'кі ар болібо торе мана?
мукхе боло "према према" бастутах тйаджійа хема,
сунйа-ґрантха анчале бандгана',
    E'', E'',
    E'Well-practiced in artificially shedding tears and in suddenly leaping here and
there, you like to fall on the ground and pretend to be unconscious in ecstatic
love for Krsna. You perform such mischievous pranks
only to cheat the innocent public and thereby broadcast and popularize your own
wicked association. This is all such nonsense just so you can attract women and
money.', E'',
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
    E'', E'',
    E'abhysiya asrupata, lampha jhamph akasmat,
murccha-pray thakaha padiya
e loka bancite
ranga, pracariya asat-sanga,
kamini-kancana labha giya', E'абгйсійа асрупата, лампха джхампх акасмат,
мурччха-прай тхакаха падійа
е лока банчіте
ранґа, прачарійа асат-санґа,
каміні-канчана лабга ґійа',
    E'', E'',
    E'The means for attaining pure, ecstatic love for Godhead is called
"devotional service". If you have no inclination or attachment to
this pure devotional process, then how do you expect to factually come into
contact with pure love for Krsna? Carefully avoiding
the ten offences in chanting the holy name, just worship that name incessantly,
and you will attain the highest quality of pure ecstatic love when the mercy
comes to you.', E'',
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
    E'', E'',
    E'premer sadhana-"bhakti", ta''te
noila anurakti,
suddha prema kenome milibe?
dasa-aparadha tyaji'', nirantara nama bhaji'',
krpa hale su-prema paibe', E'премер садгана-"бгакті", та''те
ноіла ануракті,
суддга према кеноме мілібе?
даса-апарадга тйаджі'', нірантара нама бгаджі'',
крпа хале су-према паібе',
    E'', E'',
    E'But your idea, dear mind, is to neglect the best and most auspicious process of
worshiping Krsna, namely the congregational chanting
of His holy names in the association of purified devotees. And you don''t even
bother to try to remember Him in a lonely place. This is just like trying to
pick fruits forcibly from a tree by jumping at them from the ground. Instead of
climbing the tree to properly pick the sweet, ripened fruits from the top of
the tree, you will simply get the sour, unripe fruits by such a jumping
process.', E'',
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
    E'na manile su-bhajana, sadhu-sange sankirtana,
na korile nirjane smarana
na uthiya brksopari, tanatani phal dhori'',
dusta-phal korile arjana', E'на маніле су-бгаджана, садгу-санґе санкіртана,
на коріле нірджане смарана
на утхійа брксопарі, танатані пхал дгорі'',
дуста-пхал коріле арджана',
    E'', E'',
    E'Ecstatic love for Krsna which is completely freed
from the propensity to cheat is just like spotlessly pure gold, and the fruits
of such pure love are rarely found in this world. However, my dear mind, your
cheating process of imitation so-called love is simply a fraud. To get the real
pure love, you have to first make yourself a fit candidate, and then true
transcendental love will become very easily obtainable for you.', E'',
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
    E'akaitaba krsna-prema, jena su-bimala hema,
ei phal nrloke durlabha
kaitabe bancana-matra, hao age jogya-patra,
tabe prema hoibe sulabha', E'акаітаба крсна-према, джена су-бімала хема,
еі пхал нрлоке дурлабга
каітабе банчана-матра, хао аґе джоґйа-патра,
табе према хоібе сулабга',
    E'', E'',
    E'My dear brother, just compare the characteristics of your bogus lust with the
characteristics of true love for Krsna, there is
practically no difference at all in the external symptoms of both.
Nevertheless, this artificial lust is definitely not true love at all. You are
completely covered with lust, but you lie and falsely call it "prema". Therefore how will you be blest with real
spiritual well-being?
REMARKS/EXTRA INFORMATION:
No Extra Information available for this song!', E'',
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
    E'kame-preme dekho bhai, laksanaete
bheda nai,
tabu kama ''prema'' nahi hoy
tumi to'' barile kama, mithya tahe ''prema'' nama,
aropile kise subha hoy?', E'каме-преме декхо бгаі, лаксанаете
бгеда наі,
табу кама ''према'' нахі хой
тумі то'' баріле кама, мітхйа тахе ''према'' нама,
аропіле кісе субга хой?',
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


  -- Song 20: Keno Mana Kamere Nacao
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 20, E'Keno Mana Kamere Nacao', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 20;


  INSERT INTO public.verses (
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
    E'Song Name: Keno Mana Kamere Nacao
Official Name: Upadesa:
Song 19
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Кено Мана Камере Начао
Оffічіал Наме: Упадеса:
Сонґ 19
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) Tell me why, my dear
mind? Why are you forced to dance by lust, and why do you think that such
dancing is Krsna conscious? Your lust is simply
abounding in skin and meat, and you are addicted to non-stop material sense
gratification. Thus you factually spend your time in running here and there,
chasing after worldly sense objects.
2) The soul''s original
eternal nature is pure love within the innermost core of its spiritually
conscious form, and the sole object of repose for that pure love is Lord Hari. Alas, how lamentable it is, that this inherent
ecstatic love is now lying in a dormant, sleeping state due to the artificial
covering of this temporary lust, My dear mind, banishing this lust to a distant
place, just rouse and reawaken your sleeping prema.
3) Only in the following
sequence does pure love for Krsna awaken: First one
develops sraddha (faith) in the process of Krsna Consciousness; then, due to that faith one becomes
enthusiastic for sadhu-sanga (the association of devotees);
then, by performance of bhajana-kriya (devotional
worship) in the company of the devotees there awakens nista
(steadiness in service), then ruci (taste), then asakti (attachment to the Lord); this attachment then gives
rise to bhava (genuine ecstatic emotions), from which
prema (pure love for Krsna)
manifests its re-awakening. Only in this sequence does prema
come into being.
4) One who endeavors for
this bona fide process gets the essence of pure ecstatic love for Krsna. One who neglects the proper order of this procedure
does not experience the reawakening of pure prema. My
dear mind, why are you maintaining the wicked mentality of apprehension and
fear of this bona fide method of devotional practice? By cultivation of your
lust in this mundane sphere, you will never be able to touch upon genuine
ecstatic love for Krsna.
5) So by the likes of your
dramatic performance of dancing in lust, you think that this is indicative of
your prema, but it is actually a deceptive, feigned
imitation of prema. Thus you whole process is simply
gross sense gratification. My dear brother, always reject such degraded,
contemptible sense gratification, casting out this grave offense to the Lord.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'keno mana, kamere
nacao prema-pray?
carma-mamsa-moy kama,jara-sukha abirama,
jara-bisayete sada dhay', E'кено мана, камере
начао према-прай?
чарма-мамса-мой кама,джара-сукха абірама,
джара-бісайете сада дгай',
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
    E'', E'',
    E'jiber svarupa dharma,cit-svarupe prema-marma,
tahar bisaya-matra hari
kama-abarane hay,prema ebe supta-pray,
prema jagao kama dura
kori''', E'джібер сварупа дгарма,чіт-сварупе према-марма,
тахар бісайа-матра харі
кама-абаране хай,према ебе супта-прай,
према джаґао кама дура
корі''',
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
    E'', E'',
    E'sraddha hoite sadhu-sange,
bhajaner kriya-range,
nista-ruci-asakti-udoy
asakti hoite bhava,tahe
prema pradurbhava,
ei krame prema
upajoy', E'сраддга хоіте садгу-санґе,
бгаджанер крійа-ранґе,
ніста-ручі-асакті-удой
асакті хоіте бгава,тахе
према прадурбгава,
еі краме према
упаджой',
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
    E'ihate jatana ja''r,sei pay prema-sar,
krama-tyage prema nahi
jage
e-krama-sadhane
bhoy,keno koro'' durasoy,
kame prema kabhu
nahi lage', E'іхате джатана джа''р,сеі пай према-сар,
крама-тйаґе према нахі
джаґе
е-крама-садгане
бгой,кено коро'' дурасой,
каме према кабгу
нахі лаґе',
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
    E'natakabhinoy pray,sakapata prema bhay,
tahe matra indriya-santosa
indriya-tosana char,sada koro'' parihar,
charo'' bhai aparadha-dosa', E'натакабгіной прай,сакапата према бгай,
тахе матра індрійа-сантоса
індрійа-тосана чхар,сада коро'' паріхар,
чхаро'' бгаі апарадга-доса',
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


  -- Section 4: Upalabdhi - Anatupa Laksana
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 4, E'Attainment - Repentance', E'Упалабдгі - Анатупа-лакшана (Досягнення - Каяття)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;


  -- Song 1: Ami Ati Pamara Durjana
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Ami Ati Pamara Durjana', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Ami Ati Pamara Durjana
Official Name: Upalabdhi: Anutapa-laksana-upalabdhi Song 1
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Амі Аті Памара Дурджана
Оffічіал Наме: Упалабдгі: Анутапа-лаксана-упалабдгі Сонґ 1
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Oh no! Just see my condition now! I must be the most sinful rogue of all! Alas,
alas, what have I done, what have I done? The human for of life is very rare, but
I have passed such a priceless life engaged simply as a slave in the service of
the material energy!', E'',
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
    E'', E'',
    E'ami ati pamara
durjana
ki korinu hay hay, prakrtir dasatay,
katainu amulya jibana', E'амі аті памара
дурджана
кі коріну хай хай, пракртір дасатай,
катаіну амулйа джібана',
    E'', E'',
    E'How much time have I spent being packed up in the womb of my mother? After
being born, my childhood was spent simply playing around frivolously, according
to the nature of children. Then my youth quickly passed by in executing many
different obligations according to social customs. All those days having been
wasted uselessly, I now suffer old age in the end as my only reward.', E'',
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
    E'', E'',
    E'koto-dina garvbhavase, katainu anayase,
balya gelo bala-dharma-base
gramya-dharma e jaubana, miche dinu bisarjana,
brddha-kala elo abasese', E'кото-діна ґарвбгавасе, катаіну анайасе,
балйа ґело бала-дгарма-басе
ґрамйа-дгарма е джаубана, мічхе діну бісарджана,
брддга-кала ело абасесе',
    E'', E'',
    E'I can no longer get any pleasure from sense gratification, for my power to
enjoy has now become reversed. My teeth as well as my whole body have now
become disabled and weak. Various aches and pains make my daily life
unbearable, and I am haunted by continuously hovering fear of death. Due to all
this, I don''t feel as if there is any security or protection from any quarter.
Therefore to what can I possibly remain attached to in this world?', E'',
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
    E'', E'',
    E'bisaye nahiko sukha, bhoga-sakti subaimukha,
anta danta, sarira asakta
jibana jantranamoy, maranete sada bhoy,
bolo kise hoi anurakta', E'бісайе нахіко сукха, бгоґа-сакті субаімукха,
анта данта, саріра асакта
джібана джантранамой, маранете сада бгой,
боло кісе хоі ануракта',
    E'', E'',
    E'My enjoyment of this body was limited to material sense objects coupled with my
drive to enjoy them. But now my attachment and inclination to all this has
faded away. Everything in life having now passed me by, my heart is extremely
worried about how to hold onto this emaciated old life.', E'',
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
    E'bhoga-bastu-bhoga-sakti, ta''te chilo anurakti,
je-paryanta chilo dehe
bala
samasta bigata ho''lo, ki loiya
thaki bolo,
ebe citta sadai
cancala', E'бгоґа-басту-бгоґа-сакті, та''те чхіло ануракті,
дже-парйанта чхіло дехе
бала
самаста біґата хо''ло, кі лоійа
тхакі боло,
ебе чітта садаі
чанчала',
    E'', E'',
    E'Alas! The real problem is that when I was young and fit, I have passed this
life without ever worshiping the Supreme Lord Hari.
Being bereft of the power to hold onto this body, what will I do now that the
final moment is approaching? Oh, to hell with my entire life! I never took
advantage of the actual eternal treasure. Instead, I have abandoned my real
friend (Hari) only to worship my enemy, (this
miserable material energy).
REMARKS/EXTRA INFORMATION:
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
    E'samarthya thakite kay, hari na
bhajinu hay,
asanna kalete kiba kori?
dhik mor e jibane,
na sadhinu nitya-dhane,
mitra chadi'' bhajilam ari', E'самартхйа тхакіте кай, харі на
бгаджіну хай,
асанна калете кіба корі?
дгік мор е джібане,
на садгіну нітйа-дгане,
мітра чхаді'' бгаджілам арі',
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


  -- Song 2: Sadhu Sanga Na Hoilo
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Sadhu Sanga Na Hoilo', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Sadhu Sanga Na Hoilo Hay
Official Name: Upalabdhi: Anutapa-laksana-upalabdhi Song 2
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Садгу Санґа На Хоіло Хай
Оffічіал Наме: Упалабдгі: Анутапа-лаксана-упалабдгі Сонґ 2
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) Alas! Now I realize that
all of my days had passed uselessly, for I never had the great fortune of associating
with the devotees of the Lord. Therefore instead of hearing from them about the
process of attaining the topmost goal of human life, I have wasted my time
simply working hard to earn money.
2) This is such an
unfortunate calamity, for I now consider that I have rejected pure gold simply
to become attached and devoted to a small clod of dirt. In other words, I have
abandoned the bright-faced golden devotees of the Lord to associate with filthy
dirty persons who are averse to Krsna. Thus in their company I have passed my
entire life dazed in madly intoxicated vanity.
3) Whenever I saw someone
decorated with the signs of a Vaisnava like tilaka, neck beads and sikha,
etc., I would laugh at them within my mind, considering them to be completely
insane. Regarding this attitude of mine to be the most highly cultured
behavior, I have thereby robbed myself of the transcendental association of
those touch stone-like devotees. So now in the end I am wondering . . . where
has all this nonsense led me to?
4) On the strength of my
material education, I became puffed up and completely overlooked the most
auspicious form of spiritual life, which is available only by devotional
service. Thus I have completely steered clear of the ultimate goal of life. But
now in my old age, all of this polluted material knowledge I worked so hard for
is dwindling, for my memory is gradually fading away. Just see how I am
captured and tormented in enjoying the fruits of my previous material
activities!
5) Now I have just one last
hope. If only the devotees would be merciful to this sinful rogue by sprinkling
me with one drop from the bhakti-rasamrta-sindhu, the
nectarine ocean of pure devotion, then I will be satisfied. By the sweet
influence of that single drop, I will instantly and effortlessly become
liberated from the strong grip of this material world, and thus I will finally
be able to cross over the ocean of nescience.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'sadhu-sanga na hoilo hay!
gelo dina akarana, kori''artha
uparjana,
paramartha rohilo kothay?', E'садгу-санґа на хоіло хай!
ґело діна акарана, корі''артха
упарджана,
парамартха рохіло котхай?',
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
    E'', E'',
    E'suvarna koriya tyaga, tuccha
lostre anuraga.
durbhagar ei to'' laksana
krsnetar sanga kori'', sadhu-jane
prihari'',
mada-garve katanu jibana', E'суварна корійа тйаґа, туччха
лостре анураґа.
дурбгаґар еі то'' лаксана
крснетар санґа корі'', садгу-джане
пріхарі'',
мада-ґарве катану джібана',
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
    E'', E'',
    E'bhakti-mudra-darasane, hasya koritam
mane,
batulata boliya tahay
je sabhyata sresta gani'', harainu cintamani,
sese taha rohilo kothay?', E'бгакті-мудра-дарасане, хасйа корітам
мане,
батулата болійа тахай
дже сабгйата среста ґані'', хараіну чінтамані,
сесе таха рохіло котхай?',
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
    E'jnaner garima bale, bhakti-rupa susambale,
upeksinu svartha pasariya
dusta jadasrita jnana, ebe ho''lo antardhana,
karma-bhoge amake rakhiya', E'джнанер ґаріма бале, бгакті-рупа сусамбале,
упексіну свартха пасарійа
дуста джадасріта джнана, ебе хо''ло антардгана,
карма-бгоґе амаке ракхійа',
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
    E'ebe jadi sadhu-jane, krpa kori'' e durjane,
dena bhakti-samudrer bindhu
ta'' hoile anayase, mukta ho''ye bhava-pase,
par hoi e samsar sindhu', E'ебе джаді садгу-джане, крпа корі'' е дурджане,
дена бгакті-самудрер біндгу
та'' хоіле анайасе, мукта хо''йе бгава-пасе,
пар хоі е самсар сіндгу',
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


  -- Song 3: Ore Mana Karmer Kuhare
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Ore Mana Karmer Kuhare', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Ore Mana Karmer Kuhare
Gelo Kal
Official Name: Upalabdhi: Anutapa-laksana-upalabdhi Song 3
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Оре Мана Кармер Кухаре
Ґело Кал
Оffічіал Наме: Упалабдгі: Анутапа-лаксана-упалабдгі Сонґ 3
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Oh my dear mind! What shall I say to you now? All my time has been spent inside
the deep pit of fruitive activities. With high hopes
of future happiness in the heavenly planets, I have fallen into the trap of fruitive actions and reaction, which is exactly like the
entangling web of a spider.', E'',
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
    E'', E'',
    E'ore mana, karmer
kuhare gelo kal
svargadi sukher ase,porilam karma-phanse,
urnanabhi-sama
karma-jal', E'оре мана, кармер
кухаре ґело кал
сварґаді сукхер асе,порілам карма-пхансе,
урнанабгі-сама
карма-джал',
    E'', E'',
    E'Observing many different types of austere vows and fasting to achieve some
future heavenly goal, I thus performed such useless physical labor for no real
tangible result. This was just like pouring oblations of ghee onto dry ashes
only. Now I am being strangled within the noose of karma, being destroyed by my
own foolish nonsense. And the only result is that I have not been able to
deliver myself from this predicament.', E'',
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
    E'', E'',
    E'upavasa-brata dhori'',nana kaya-klesa kori'',
bhasme ghrta daliya apar
marilam nija dose,jara-maraner phanse,
hoibare narinu uddhar', E'упаваса-брата дгорі'',нана кайа-клеса корі'',
бгасме ґгрта далійа апар
марілам ніджа досе,джара-маранер пхансе,
хоібаре наріну уддгар',
    E'', E'',
    E'I conducted many sacrifices in honor of many different demigods and goddesses,
as is recommended for householders in the varnasrama-dharma
system. But by doing this I only became so puffed up that I wasted my whole
life in such delirious pride. I never got any peace of mind by doing all this,
for I completely missed out on the golden treasure of spiritual satisfaction.
So much trouble I underwent because I never worshiped the beautiful lotus feet
of Sri Krsna!', E'',
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
    E'', E'',
    E'barnasrama-dharma
yaji'',nana deba-debi bhaji'',
mada-garve katainu jibana
sthira na hoilo mana,na
labhinu santi-dhana,
na bhyajinu sri-krsna-carana', E'барнасрама-дгарма
йаджі'',нана деба-дебі бгаджі'',
мада-ґарве катаіну джібана
стхіра на хоіло мана,на
лабгіну санті-дгана,
на бгйаджіну срі-крсна-чарана',
    E'', E'',
    E'Therefore to hell with my whole life! To hell with all my wealth and followers!
To hell with my caste-pride! To hell with all my so-called dignity of family
prestige! To hell with my studies of the karma-khanda
scriptures, for I have not become fixed up in pure devotion to Lord Hari!
REMARKS/EXTRA INFORMATION:
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
    E'dhik mor e jibane,dhik mor dhana-jane,
dhik mor barna-abhimana
dhik mor kula-mane,dhik sastra adhyayane,
hari-bhakti na pailo sthana', E'дгік мор е джібане,дгік мор дгана-джане,
дгік мор барна-абгімана
дгік мор кула-мане,дгік састра адгйайане,
харі-бгакті на паіло стхана',
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


  -- Song 4: Ore Mana Ki Bipada Hoilo Amar
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Ore Mana Ki Bipada Hoilo Amar', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Ore Mana Ki Bipada
Hoilo Amar
Official Name: Upalabdhi: Anutapa-laksana-upalabdhi Song 4
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Оре Мана Кі Біпада
Хоіло Амар
Оffічіал Наме: Упалабдгі: Анутапа-лаксана-упалабдгі Сонґ 4
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1-2) Oh my dear mind, just see what calamity has befallen me now! My soul
is captured in a perverted delirium due to maya''s
cruel tyrannical treatment, which burns me with material miseries just like
fire. A with a hope of becoming freed from all this, I took to the path of
non-dual monistic mayavada philosophy, which finishes
all of maya''s troubles when one merges with the
"oneness". Thus drinking poison, I have successfully become rid of
the disturbing delirium of maya. But just see what an
unfortunate mishap has arisen now! Although the difficulties caused by the
material world have been eradicated, my life is now being vanquished by the
burning poison of threat deadly mayavada philosophy.', E'',
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
    E'', E'',
    E'ore mana, ki bipada
hoilo amar!
mayar duratmya-jvare, bikar jibere dhore,
taha hoite paite
nistar', E'оре мана, кі біпада
хоіло амар!
майар дуратмйа-джваре, бікар джібере дгоре,
таха хоіте паіте
ністар',
    E'', E'',
    E'By thinking "I am only spirit", one certainly burns up any attachment
to the material body. But is that the real final remedy, oh mind, my dear
brother? Certainly it is good that the disturbance of material tribulations has
been relieved, but the so-called "medicine" of the mayavada philosophy has now become an unwanted burden,
another trouble all over again. So now tell me where you will get the medicine
which will cure this "medicine"?', E'',
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
    E'', E'',
    E'sadhinu advaita mata, jahe maya
hoy hata,
bisa sebi'' bikar
katilo
kintu e durbhagya mor, bikar katilo
ghora,
biser jvalay prana gelo', E'садгіну адваіта мата, джахе майа
хой хата,
біса себі'' бікар
катіло
кінту е дурбгаґйа мор, бікар катіло
ґгора,
бісер джвалай прана ґело',
    E'', E'',
    E'These two dangers: 1) nasty troubles given by maya,
and 2) the poisonous burden of mayavada philosophy,
can be prevented and curbed completely by taking the nice prescription medicine
recommended by the devotee-physicians. And that ecstatic prescription is to
drink with gusto the immortal nectar of harinama at
the divine lotus feet of Sri Krsna Caitanya Mahaprabhu.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'"ami brahma
ekamatra", e jvalay dahe gatra,
ihar upay kiba
bhai?
bikar je chilo
bhalo, ausadha janjal ho''lo,
ausadha-ausadha kotha pay?', E'"амі брахма
екаматра", е джвалай дахе ґатра,
іхар упай кіба
бгаі?
бікар дже чхіло
бгало, аусадга джанджал хо''ло,
аусадга-аусадга котха пай?',
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
    E'maya-datta ku-bikar, mayavada bisa-bhar,
e dui
apada nibarana
hari-namamrta pana, sadhu
baidya-subidhana,
sri-krsna-caitanya sri-carana', E'майа-датта ку-бікар, майавада біса-бгар,
е дуі
апада нібарана
харі-намамрта пана, садгу
баідйа-субідгана,
срі-крсна-чаітанйа срі-чарана',
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


  -- Song 5: Ore Mana Klesa Tapa Dekhi Je
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Ore Mana Klesa Tapa Dekhi Je', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Ore Mana Klesa Tapad
Official Name: Upalabdhi: Anutapa-laksana-upalabdhi Song 5
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Оре Мана Клеса Тапад
Оffічіал Наме: Упалабдгі: Анутапа-лаксана-упалабдгі Сонґ 5
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) My dear mind, all I can
see is unlimited material miseries and difficulties on all sides. Especially
there are these five specific troubles: 1) ignorance, 2) distraction, 3) mis-concentration, 4) mis-directed
love, and 5) impurity.
2) (According to Patanjali''s Yoga-sutra, Sadhana-pada,
third sutra) The affliction of these five miseries
results in continuous degradation in the following ways: 1) avidya:
ignorance makes me completely forgetful of my nature as pure spirit soul 2) asmita: conceited egoistic pride causes me to be distracted
from the real essence of life. 3) abhinivesa:
I have become deeply absorbed in trivial pursuits; 4) raga: I''ve developed love
and attachment to things which are averse to pure God-consciousness; and 5) dvesa: my soul has become filthy and polluted by nasty
qualities.
3) Due to all these
distracting troubles, I am forgetting my real home in the spiritual world, the
eternal land of no anxiety. And I have become completely mad by frantically
trying to enjoy all the so-called enjoyments offered by maya''s
illusions. Thus I surround myself with so many misconceptions of "me, me, me". Oh mind, my dear brother, just see how my heart
has become full of so much anxiety due to constant worries about "this is mine, that is mine".
4) I am searching for the
remedy to cure this material disease of being tortured by Yamaraja,
but oh no! I''ve met a doctor who is no better than Yamaraja
at all. This ''doctor'' has given me the prescription "I am Brahman, maya is false", but now when I see the result of this
so-called medicine, I feel an unbearable anxiety in my conscience.
5) On one side I feel great
difficult and grief from these five material miseries and on the other side
stands the corrupted doctor (the Mayavadi who is just
like another Yamaraja). How will I ever be able to
get freed from being sandwiched in between this tormenting agony? There is only
one remedy, that is: if I would simply take complete shelter of Lord Caitanya, Who is know to be the Most Merciful, then only I
will easily cross over this ghastly calamity.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'ore mana, klesa-tapad
dekhi je asesa
avidya, asmita ar, abhinivesa
durbar,
raga, dvesa --- ei panca klesa', E'оре мана, клеса-тапад
декхі дже асеса
авідйа, асміта ар, абгінівеса
дурбар,
раґа, двеса --- еі панча клеса',
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
    E'', E'',
    E'avidyatma-bismarana,
asmityanya-bhibhavana,
abhinivesanye gadamati
anye priti ragandhata, vidvesatma bisuddhata,
panca klesa sadai durgati', E'авідйатма-бісмарана,
асмітйанйа-бгібгавана,
абгінівесанйе ґадаматі
анйе пріті раґандгата, відвесатма бісуддгата,
панча клеса садаі дурґаті',
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
    E'', E'',
    E'bhuliya baikuntha-tattva, maya-bhoge su-pramatta,
''ami'' ''ami'' koriya bedai
''e
amar, se amar'', e bhavana anibar,
byasta kore'' mor citta
bhai', E'бгулійа баікунтха-таттва, майа-бгоґе су-праматта,
''амі'' ''амі'' корійа бедаі
''е
амар, се амар'', е бгавана анібар,
бйаста коре'' мор чітта
бгаі',
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
    E'e roga-samanopay, anvesiya hay hay,
mile baidya sadya yamopama
ami brahma maya-bhrama'' ei ausadher krama,
dheki'' cinta hoilo bisama', E'е роґа-саманопай, анвесійа хай хай,
міле баідйа садйа йамопама
амі брахма майа-бграма'' еі аусадгер крама,
дгекі'' чінта хоіло бісама',
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
    E'eke to'' roger kasta, yamopama baidya bhrasta,
e jantrana kise jay mor?
sri caitanya doyamoy, koro'' jadi samasroy,
par habe e bipada ghor', E'еке то'' роґер каста, йамопама баідйа бграста,
е джантрана кісе джай мор?
срі чаітанйа дойамой, коро'' джаді самасрой,
пар хабе е біпада ґгор',
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


  -- Section 5: Upalabdhi - Nirveda Laksana
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 5, E'Attainment - Indifference', E'Упалабдгі - Нірведа-лакшана (Досягнення - Відречення)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;


  -- Song 1: Ore Mana Bhalo Nahi La Gee
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Ore Mana Bhalo Nahi La Gee', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Ore Mana Bhalonahi Lage E Samsar
Official Name: Upalabdhi: Nirveda-Laksana-Upalabdhi Song 1
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Оре Мана Бхалонахі Лаґе Е Самсар
Оffічіал Наме: Упалабдгі: Нірведа-Лаксана-Упалабдгі Сонґ 1
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Listen, my dear mind. I don''t like this material world at all. It is simply
filled with the suffering of birth, death, disease and old age. Besides all
this suffering, tell me now that good thing could possibly be found here?', E'',
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
    E'', E'',
    E'ore mana, bhalonahi
lage e samsar
janama-marana-jara,
je samsare ache bhara,
tahe kiba ache bol'' sar', E'оре мана, бгалонахі
лаґе е самсар
джанама-марана-джара,
дже самсаре ачхе бгара,
тахе кіба ачхе бол'' сар',
    E'', E'',
    E'Wealth, followers and family members they can never really belong to anyone.
For a time they are together, and afterwards they all
drift apart. All these relationships which you would love to hold on to, none
or them will remain for long, my dear mind. Oh brother, know it for sure that
all these temporary things are flimsy and perishable.', E'',
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
    E'', E'',
    E'dhana-jana-parivar,
keho nahe kabhu ka''r,
kale mitra, akale apar
jaha raknibare cai, taha nahe thake
bhai,
anitya samasta binasvar', E'дгана-джана-парівар,
кехо нахе кабгу ка''р,
кале мітра, акале апар
джаха ракнібаре чаі, таха нахе тхаке
бгаі,
анітйа самаста бінасвар',
    E'', E'',
    E'The lifespan of one living in this world is extremely short, and even that
gradually decays more and more until one beholds Yamaraja
hovering nearby. Afflicted with continuous diseases and lamenting in
heart-broken grief, his consciousness thus degrades more and more. Finally one
meets his downfall, and he again suffers the calamity of separation from his
dear kinsmen.', E'',
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
    E'', E'',
    E'ayu ati alpa-dina, krame taha hoy
ksina,
samaner nikata darsana
roga-soka anibar, citta kore''
charakhar,
bandhava-bijoga durghatana', E'айу аті алпа-діна, краме таха хой
ксіна,
саманер ніката дарсана
роґа-сока анібар, чітта коре''
чхаракхар,
бандгава-біджоґа дурґгатана',
    E'', E'',
    E'Just see here, my dear brother. Don''t go for this mixed pain and pleasure of
so-called material happiness, for it is actually the source of all your
troubles. If this is the real situation, then why have you become the slave of maya just on account of this miserable so-called happiness?
Do you realize what you''ve done? If you become the slave of maya
then you only rob yourself of the eternal treasure waiting for you, the supreme
goal of life.', E'',
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
    E'bhalo ko''re dekho bhai,
amisra ananda nai,
je ache, se duhkher karana
se sukher tore tabe, keno maya-dasa habe,
haraibe paramartha-dhana', E'бгало ко''ре декхо бгаі,
амісра ананда наі,
дже ачхе, се духкхер карана
се сукхер торе табе, кено майа-даса хабе,
хараібе парамартха-дгана',
    E'', E'',
    E'Just become a little thoughtful for once and reflect back on your own life
story, how many demoniac temptations you were motivated by. Simply to get a
little sense gratification, how many unlimitedly sinful acts have you
committed? So now just see the result, the only gain in the long run is your
certain death.', E'',
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
    E'itihasa-alocane, bheve'' dekho nija
mane,
koto asurika durasoy
indriya-tarpana sar, kori'' koto
duracar,
sese labhe marana niscoy', E'ітіхаса-алочане, бгеве'' декхо ніджа
мане,
кото асуріка дурасой
індрійа-тарпана сар, корі'' кото
дурачар,
сесе лабге марана нісчой',
    E'', E'',
    E'Alas! Never having once considered the purpose or goal of human existence, such
a person wastes his entire life just like a dog or a pig. Then at the time of
death, being bereft and cheated out of any means of deliverance, he laments
bitterly and burning the fire of repentance.', E'',
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
    E'marana-samay ta''ra, upay hoiya
hara,
anutap-anale jvalilo
kukkuradi pasu-pray, jiban katay hay,
paramartha kabhu na cintilo', E'марана-самай та''ра, упай хоійа
хара,
анутап-анале джваліло
куккураді пасу-прай, джібан катай хай,
парамартха кабгу на чінтіло',
    E'', E'',
    E'My dear mind, so tell me why you remain stupefied and unconscious absorbed in
this useless temporary sense gratification? I want you to give it up right now,
and give up all hopes for future sense gratification as well. For the
expectation of this humble servant is that you will be able to conquer over
this miserable material existence by being firmly situated under the protection
offered by the lotus feet of sri guru, your most well-wishing spiritual master.
REMARKS/EXTRA INFORMATION:
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'emon bisaye mana, keno thako acetana,
chado chado bisayer asa
sri-guru-caranasroy,
koro'' sabe bhava joy,
e daser sei
to'' bharasa', E'емон бісайе мана, кено тхако ачетана,
чхадо чхадо бісайер аса
срі-ґуру-чаранасрой,
коро'' сабе бгава джой,
е дасер сеі
то'' бгараса',
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


  -- Song 2: Ore Mana Badi Bara Sa Keno
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Ore Mana Badi Bara Sa Keno', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Ore Mana Badibar Asa
Keno Koro
Official Name: Upalabdhi: Nirveda-Laksana-Upalabdhi Song 2
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Оре Мана Бадібар Аса
Кено Коро
Оffічіал Наме: Упалабдгі: Нірведа-Лаксана-Упалабдгі Сонґ 2
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'My dear mind, why do you want to increase your ambitions unlimitedly? Don''t you
know that as much as one gets elevated to the high position of a king, to that
same degree he meets his down falling the end? So then
calm down, get a grip on yourself and try to catch what I will say to you now.', E'',
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
    E'', E'',
    E'ore mana, badibar
asa keno koro''?
parthiba unnati jata, sese
abanati tata,
santa hao mor bakya
dharo''', E'оре мана, бадібар
аса кено коро''?
партхіба уннаті джата, сесе
абанаті тата,
санта хао мор бакйа
дгаро''',
    E'', E'',
    E'There is no limit to the increase of material desires. This is how it works: if
one obtains a desire, then he gets poked by the thorn of disappointment. By
that he is forced to look forward to still another desire, and in this way one
keeps on continuously moving on and on from one desire to the next. As much as
desires keep on increasing, to that degree there is no cessation, and all such
material hopes and aspirations are not stopped even by death, they will still continue
increasing even if you keep on changing bodies.', E'',
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
    E'', E'',
    E'asar iyatta nai, asa-patha
sada bhai,
nairasya-kantake ruddha ache
bado'' jata asa tata,
asa nahi hoy hata,
asa nahi nityanitya bache', E'асар ійатта наі, аса-патха
сада бгаі,
наірасйа-кантаке руддга ачхе
бадо'' джата аса тата,
аса нахі хой хата,
аса нахі нітйанітйа бачхе',
    E'', E'',
    E'If you get one kingdom today, then tomorrow you will want still another kingdom
to increase your domain, and after that you will want to rule the whole world.
After getting that, still your desires will not be satisfied, until finally you
will be renouncing your post of Lord Indra with high
hopes of obtaining the power and influence of Lord Brahma.', E'',
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
    E'', E'',
    E'ek rajya aj pao,
anya rajya ka''l cao,
sarva-rajya koro'' jadi labha
tabu asa nahe sesa,
indra-pada avasesa,
chadi'' ca''be brahmar parabhava', E'ек раджйа адж пао,
анйа раджйа ка''л чао,
сарва-раджйа коро'' джаді лабга
табу аса нахе сеса,
індра-пада авасеса,
чхаді'' ча''бе брахмар парабгава',
    E'', E'',
    E'If you get the post of Lord Brahma, you will then be constantly plotting how to
usurp the post of Lord Siva. If one attains the post of Siva. If one attains
the post of Siva, then the only thing lift to be attained is the ''oneness'' of
merging in the supreme Brahman effulgence. That kind of desire is especially
cherished by the impersonalist followers of Sri Sankaracarya.', E'',
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
    E'brahmatva chadiya bhai, siva-pada
kise pai,
ei cinta ha''be abirata
sivatva labhiya nara, brahma-samya tadantara,
asa kore'' sankaranugata', E'брахматва чхадійа бгаі, сіва-пада
кісе паі,
еі чінта ха''бе абірата
сіватва лабгійа нара, брахма-самйа тадантара,
аса коре'' санкарануґата',
    E'', E'',
    E'Therefore, my dear mind, knowing that everything is lost within the endless
network of hopes and aspirations, you should keep all
such material desires at the maximum distance from your heart. Taking on the
mood and behavior of a humble servant under the shelter of Lord Caitanya''s lotus feet, you should thus always reside in Vaikuntha, that place which is pervaded with everlasting
transcendental peace.
REMARKS/EXTRA INFORMATION:
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
    E'ataeva asa-pasa, jahehoy sarva-nasa,
hrdoy hoite rakho dure
akincana-bhava lo''ye, caitanya-caranasroye,
basa koro'' sada santipure', E'атаева аса-паса, джахехой сарва-наса,
хрдой хоіте ракхо дуре
акінчана-бгава ло''йе, чаітанйа-чаранасройе,
баса коро'' сада сантіпуре',
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


  -- Song 3: Ore Mana Bhukti Mukti
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Ore Mana Bhukti Mukti', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Ore Mana Bhukti Mukti Sprha
Koro Dura
Official Name: Upalabdhi: Nirveda-Laksana-Upalabdhi Song 3
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Оре Мана Бхукті Мукті Спрха
Коро Дура
Оffічіал Наме: Упалабдгі: Нірведа-Лаксана-Упалабдгі Сонґ 3
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Oh my dear mind, cast out all your desires for material enjoyment and
liberation. There is no end to endeavors for so-called material pleasure,
although there is not one iota of real happiness in it; rather, it abounds in exactly
the opposite of happiness, simply profuse misery.', E'',
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
    E'', E'',
    E'ore mana,
bhukti mukti-sprha koro'' dura
bhoger nahiko sesa, tahe nahi
sukha-lesa,
nirananda tahate pracura', E'оре мана,
бгукті мукті-спрха коро'' дура
бгоґер нахіко сеса, тахе нахі
сукха-леса,
нірананда тахате прачура',
    E'', E'',
    E'Other than merely tingling the senses only, tell me where the actual pleasure
is; in enjoying so many sense objects? This type of so-called pleasure is full
of deficiency and cannot come up to the mark even to be called
"pleasure". Indeed, those who are truly wise will never call that
pleasure; they tell it like it is and call such cheap sense gratification by
its real name: "suffering". And they even fear that kind of suffering.', E'',
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
    E'', E'',
    E'indriya-tarpana bai, bhoge
ar sukha kai,
seo sukha abhava-purana
je sukhete ache bhoy, ta''ke sukha
bola noy,
te''ke duhkha bole'' bijna-jana', E'індрійа-тарпана баі, бгоґе
ар сукха каі,
сео сукха абгава-пурана
дже сукхете ачхе бгой, та''ке сукха
бола ной,
те''ке духкха боле'' біджна-джана',
    E'', E'',
    E'Countless persons who are foolish like asses run madly after the material
enjoyments which are recommended in the karma-khanda
section of the scriptures, becoming intensely greedy to enjoy their material
senses. ;But the wise Vaisnava, knowing all this to
be a cheating process only, thereby rejects such deficient sense gratification
and receives genuine love and attachment to Lord Krsna,
which is the real essence and principle fruit of all the scriptures.', E'',
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
    E'', E'',
    E'phal-sruti jata, sei
lobhe koto sata,
mudha-jana bhoga prati
dhay
se-saba
kaitaba jani'', chadiya baisnaba-jnani,
mukhya-phal krsna-rati pay', E'пхал-сруті джата, сеі
лобге кото сата,
мудга-джана бгоґа праті
дгай
се-саба
каітаба джані'', чхадійа баіснаба-джнані,
мукхйа-пхал крсна-раті пай',
    E'', E'',
    E'The desire fro emancipation from the material world to merge with God is yet
another wicked desire, for such a desire corrupts the righteous mentality of
steadfast devotion to God. The hard labor of one who tries for this type of
impersonal liberation is a fruitless burden, and is the last snare of maya. The trick is that he is unable to give up his
endeavor, and maya''s illusion does not give him up
either.', E'',
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
    E'mukti-banca dusta ati,
nasta kore ''sista-mati,
mukti-sprha kaitaba-pradhana
taha je chadite
nare, maya nahi chade ta''re,
ta''r jatna nahe
phalavan', E'мукті-банча дуста аті,
наста коре ''сіста-маті,
мукті-спрха каітаба-прадгана
таха дже чхадіте
наре, майа нахі чхаде та''ре,
та''р джатна нахе
пхалаван',
    E'', E'',
    E'Therefore, my dear mind, just reject these desires for bhukti
and mukti and cleanse this heart; don''t keep these
lusty desires there. Bhaktivinoda does not want
material enjoyment or liberation at all but instead practices proper devotional
service to obtain the lotus feet of Sri Krsna; that''s
all.
REMARKS/EXTRA INFORMATION:
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
    E'ataeva sprha-dvoy, chadi sodha e hrdoy,
nahi rakho kamer
basana
bhoga-moksa nahi cai,
sri-krsna-carana pai,
binoder ei to'' sadhana', E'атаева спрха-двой, чхаді содга е хрдой,
нахі ракхо камер
басана
бгоґа-мокса нахі чаі,
срі-крсна-чарана паі,
бінодер еі то'' садгана',
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


  -- Song 4: Durlabha Manava Janma
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Durlabha Manava Janma', E'', 'verses', true)
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
    E'দুর্ল্লভ মানব-জন্ম লভিয়া সংসারে
কৃষ্ণ না ভজিনু-দুঃখ কহিব কাহারে', E'দুর্ল্লভ মানব-জন্ম লভিয়া সংসারে
কৃষ্ণ না ভজিনু-দুঃখ কহিব কাহারে',
    E'⇒ D
Song
Name: Durlabha Manava Janma
Official
Name: Nirvedana Laksana Upalabdhi Song 4
Author:
Bhaktivinoda
Thakura
Book
Name: Kalyana
Kalpataru
Language:
Bengali
অ', E'⇒ Д
Сонґ
Наме: Дурлабга Манава Джанма
Оffічіал
Наме: Нірведана Лаксана Упалабдгі Сонґ 4
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Калйана
Калпатару
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'1) The
human form of life is the rarest opportunity for attaining spiritual
perfection. But now I am lamenting, because I''ve somehow or other been born
with such an opportunity, and I wasted it by never worshiping Lord Krsna. Oh,
to whom shall I tell the tale of this misery?', E'',
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
    E'''সংসার'' ''সংসার'' ক''রে মিছে গেল কাল
লাভ না কৈল কিছু, ঘটিল জঞ্জাল', E'''সংসার'' ''সংসার'' ক''রে মিছে গেল কাল
লাভ না কৈল কিছু, ঘটিল জঞ্জাল',
    E'durlabha
mānava-janma labhiyā saḿsāre
kṛṣṇa
nā bhajinu-duḥkha kahibo kāhāre', E'дурлабга
ма̄нава-джанма лабгійа̄ саḿса̄ре
кр̣шн̣а
на̄ бгаджіну-дух̣кха кахібо ка̄ха̄ре',
    E'', E'',
    E'Having married and entered into the entanglements of materialistic family life,
I passed my time in vain. I never got any tangible gain or permanent benefit,
only trouble and botheration.', E'',
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
    E'কিসের সংসার এই ছায়াবাজি প্রায়
ইহাতে মমতা করি'' বৃথা দিন যায়', E'কিসের সংসার এই ছায়াবাজি প্রায়
ইহাতে মমতা করি'' বৃথা দিন যায়',
    E'saḿsār''
saḿsār'' ko''re miche gelo kāl
lābha
nā koilo kichu, ghaṭilo jañjāl', E'саḿса̄р''
саḿса̄р'' ко''ре мічхе ґело ка̄л
ла̄бга
на̄ коіло кічху, ґгат̣іло джан̃джа̄л',
    E'', E'',
    E'What kind of world is this anyway? It seems to be just like a magic lantern
show that I saw at a carnival, wherein so many shadows and optical illusions
dance magically before my eyes. I feel great attachment and identification with
such a world, and thus day after day pass by fruitlessly, without any purpose
whatsoever.', E'',
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
    E'এ দেহ পতন হ''লে কি র''বে আমার
কেহ সুখ নাহি দিবে পুত্র-পরিবার', E'এ দেহ পতন হ''লে কি র''বে আমার
কেহ সুখ নাহি দিবে পুত্র-পরিবার',
    E'kiser saḿsār
ei chāyābāji prāy
ihāte
mamatā kori'' bṛthā dina jāy', E'кісер саḿса̄р
еі чха̄йа̄ба̄джі пра̄й
іха̄те
мамата̄ корі'' бр̣тха̄ діна джа̄й',
    E'', E'',
    E'When this body drops dead on the ground then what will remain mine? At that
moment, all of my sons and dearest loved ones will not be able to give me any
happiness.
5) I
work hard just like an ass everyday and now I am wondering for whom am I
working so hard? I am still surrounded by so many illusions.
6) I
waste every day in useless, insignificant work, and I waste every night
controlled by sleep. And in every 24 hours I never for one second consider that
cruel death is sitting very close by my side.
7) I
live a very carefree life-style, sometimes eating a lot, or eating a little if
I feel like it, sometimes I see nice things around the town, or sometimes I do not
go out at all, sometimes I wear opulent clothing, or if I''m in the mood, I''ll
wear something simple. I live so carefree that I never consider that one day I
will have to give up this body.
8) My
poor heart is plagued by constant anxieties about the maintenance and daily
turmoil created by my body, my house, my wife, my family members and my social
obligations. All these anxieties are pinching me and destroying all my
intelligence.', E'',
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
    E'গর্দভের মত আমি করি পরিশ্রম
কা''র লাগি'' এত করি না ঘুচিল ভ্রম', E'গর্দভের মত আমি করি পরিশ্রম
কা''র লাগি'' এত করি না ঘুচিল ভ্রম',
    E'e deho
patana ho''le ki ro''be āmār
keho sukha
nāhi dibe putra-parivār', E'е дехо
патана хо''ле кі ро''бе а̄ма̄р
кехо сукха
на̄хі дібе путра-паріва̄р',
    E'', E'',
    E'Alas, alas! What a remorseful situation has arisen! I am absorbed in all this
trouble, but I never consider that all these things are temporary and subject
to perish very soon. After I''m dead and gone, where will all of my material
opulences remain?', E'',
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
    E'দিন যায় মিছ কাজে, নিশা নিদ্রা-বশে
নাহি ভাবি-মরণ নিকটে আছে ব''সে', E'দিন যায় মিছ কাজে, নিশা নিদ্রা-বশে
নাহি ভাবি-মরণ নিকটে আছে ব''সে',
    E'gardabher
mata āmi kori pariśram
kā''r
lāgi'' eto kori nā ghucilo bhram', E'ґардабгер
мата а̄мі корі паріш́рам
ка̄''р
ла̄ґі'' ето корі на̄ ґгучіло бграм',
    E'', E'',
    E'When my body will be thrown in the pit at the cremation grounds, it will simply
lie there motionlessly. Then many crows, vultures, ants, and worms will come
and playfully sport there.', E'',
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
    E'ভাল মন্দ খাই, হেরি, পরি, চিন্তা-হীন
নাহি ভাবি, এ দেহ ছাড়িব কোন দিন', E'ভাল মন্দ খাই, হেরি, পরি, চিন্তা-হীন
নাহি ভাবি, এ দেহ ছাড়িব কোন দিন',
    E'dina
jāy micha kāje, niśā nidrā-baśe
nāhi
bhāvi-maraṇa nikaṭe āche bo''se', E'діна
джа̄й мічха ка̄дже, ніш́а̄ нідра̄-баш́е
на̄хі
бга̄ві-маран̣а нікат̣е а̄чхе бо''се',
    E'', E'',
    E'All the stray dogs and jackals will then become very much delighted, and in
great ecstasy they will make a festival ground out of my body and will have a
huge celebration and feast.', E'',
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
    v_chapter_id, '8', 8,
    E'দেহ-গেহ-কলত্রাদি-চিন্তা অবিরত
জাগিছে হৃদয়ে মোর বুদ্ধি করি'' হত', E'দেহ-গেহ-কলত্রাদি-চিন্তা অবিরত
জাগিছে হৃদয়ে মোর বুদ্ধি করি'' হত',
    E'bhālo
manda khāi, heri, pari, cintā-hīna
nāhi
bhāvi, e deho chāḍibo kon dina', E'бга̄ло
манда кха̄і, хері, парі, чінта̄-хı̄на
на̄хі
бга̄ві, е дехо чха̄д̣ібо кон діна',
    E'', E'',
    E'Just see, this is the ultimate destination of this material body. And the most
amazing thing is that all of my material opulences, house, family and friends
have exactly the same destination.', E'',
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
    v_chapter_id, '9', 9,
    E'হায়, হায়! নাহি ভাবি-অনিত্য এ সব
জীবন বিগতে কোথা রোহিবে বৈভব', E'হায়, হায়! নাহি ভাবি-অনিত্য এ সব
জীবন বিগতে কোথা রোহিবে বৈভব',
    E'deho-geho-kalatrādi-cintā
avirata
jāgiche
hṛdoye mor buddhi kori'' hata', E'дехо-ґехо-калатра̄ді-чінта̄
авірата
джа̄ґічхе
хр̣дойе мор буддгі корі'' хата',
    E'', E'',
    E'Therefore I ask of anyone who has any sharp intelligence: please give up all of
these temporary illusions presented by maya, and kindly search after the means
to get pure devotion to Lord Krsna, for this is the only really tangible
eternal truth.
Remarks/ Extra Information:
This
can be sung in the same tune as Sri Krsna Caitanya Prabhu Doya Koro More.
This
song can be sung in Raga Misra Kafi in Bhajani Tala.', E'',
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
    v_chapter_id, '10', 10,
    E'শ্মশানে শরীর মম পড়িয়া রোহিবে
বিহঙ্গ-পতঙ্গ তায় বিহার করিবে', E'শ্মশানে শরীর মম পড়িয়া রোহিবে
বিহঙ্গ-পতঙ্গ তায় বিহার করিবে',
    E'hāy,
hāy! nāhi bhāvi-anitya e saba
jīvana
vigate kothā rohibe vaibhava', E'ха̄й,
ха̄й! на̄хі бга̄ві-анітйа е саба
джı̄вана
віґате котха̄ рохібе ваібгава',
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
    v_chapter_id, '11', 11,
    E'কুক্কুর সৃগাল সব আনন্দিত হ''য়ে
মহোত্সব করিবে আমার দেহ ল''য়ে', E'কুক্কুর সৃগাল সব আনন্দিত হ''য়ে
মহোত্সব করিবে আমার দেহ ল''য়ে',
    E'śmaśāne
śarīr mama poḍiyā rohibe
bihańga-patańga
tāy bihār koribe', E'ш́маш́а̄не
ш́арı̄р мама под̣ійа̄ рохібе
біхаńґа-патаńґа
та̄й біха̄р корібе',
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
    v_chapter_id, '12', 12,
    E'যে দেহের এই গতি, তা''র অনুগত
সংসার-বৈভব আর বন্ধু-জন যত', E'যে দেহের এই গতি, তা''র অনুগত
সংসার-বৈভব আর বন্ধু-জন যত',
    E'kukkur sṛgāl
sab ānandita ho''ye
mahotsava
koribe āmār deho lo''ye', E'куккур ср̣ґа̄л
саб а̄нандіта хо''йе
махотсава
корібе а̄ма̄р дехо ло''йе',
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
    v_chapter_id, '13', 13,
    E'অতএব মায়া-মোহ ছাড়ি'' বুদ্ধিমান
নিত্য-তত্ত্ব কৃষ্ণ-ভক্তি করুন সন্ধান', E'অতএব মায়া-মোহ ছাড়ি'' বুদ্ধিমান
নিত্য-তত্ত্ব কৃষ্ণ-ভক্তি করুন সন্ধান',
    E'je deher ei
gati, tā''r anugata
saḿsār-vaibhava
ār bandhu-jana jata', E'дже дехер еі
ґаті, та̄''р ануґата
саḿса̄р-ваібгава
а̄р бандгу-джана джата',
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
    v_chapter_id, '14', 14,
    E'', E'',
    E'ataeva
māyā-moha chāḍi'' buddhimān
nitya-tattva
kṛṣṇa-bhakti koruna sandhān', E'атаева
ма̄йа̄-моха чха̄д̣і'' буддгіма̄н
нітйа-таттва
кр̣шн̣а-бгакті коруна сандга̄н',
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


  -- Song 5: Sarirer Sukhe Mana Deho
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Sarirer Sukhe Mana Deho', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Sarirer Sukhe Mana Deho
Jalanjali
Official Name: Upalabdhi: Nirveda-Laksana-Upalabdhi Song 5
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Сарірер Сукхе Мана Дехо
Джаланджалі
Оffічіал Наме: Упалабдгі: Нірведа-Лаксана-Упалабдгі Сонґ 5
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'My dear mind, kindly cease from your endeavors to supply artificial
"pleasures" to the material body. This body does not belong to you
for enjoying as you please. Rather, it is the most formidable enemy of one who
is trying to practice devotional service in his siddha-deha,
or spiritual body. But you, my dear mind, always depend on this body and try to
squeeze whatever pleasure you can right up to the limits of its physical
abilities. But what you''re not understanding, dear friend, is that this
material body is insensitive and unconscious, and that it simply drops down on
the ground when your life is finished.', E'',
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
    E'', E'',
    E'sarirer sukhe, mana, deho
jalanjali
e deho tomar
noy, baranca e satru soy,
siddha-deho-sadhana-samaye
sarvada ihar bale rohiyacho bali
kintu nahi jano, mana,
e sarir acetana
po'' de roy jibana-balaye', E'сарірер сукхе, мана, дехо
джаланджалі
е дехо томар
ной, баранча е сатру сой,
сіддга-дехо-садгана-самайе
сарвада іхар бале рохійачхо балі
кінту нахі джано, мана,
е сарір ачетана
по'' де рой джібана-балайе',
    E'', E'',
    E'The handsomeness of this body, as well as its strength and abilities, do not
last for very long. Therefore my earnest request to you is that you please accept
all these truths and don''t become proud. The pure spirit soul in his siddha-deha is eternal and ever-fresh. But such a
transcendental soul meets his downfall when he becomes stupefied within the
cage of the material body. Thus his pure spiritual life is choked as he is
rendered insensitive due to enjoying the results of temporary fruitive activities within the shackles of karma.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'eher saundarya-bala---nahe cirodina
ataeva taha lo''ye, na
thako garvita ho''ye,
stoma'' prati ei anunoy
suddha-jibe siddha-dehe sadai nabina
jadibhuta deho-joga, jibaner karma-bhoga,
jiber patana jadasroy', E'ехер саундарйа-бала---нахе чіродіна
атаева таха ло''йе, на
тхако ґарвіта хо''йе,
стома'' праті еі ануной
суддга-джібе сіддга-дехе садаі набіна
джадібгута дехо-джоґа, джібанер карма-бгоґа,
джібер патана джадасрой',
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


  -- Section 6: Upalabdhi - Sambandha Abhideya Prayojana
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 6, E'Attainment - Philosophical Knowledge', E'Упалабдгі - Самбандга Абгідея Праджйоджана (Філософське знання)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;


  -- Song 1: Ore Mana Boli Suno Tattva
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Ore Mana Boli Suno Tattva', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Ore Mana Boli Suno
Tattva Bibarana
Official Name: Upalabdhi: Sambandha-Abhideya-Prayojana-Vijnana Song 1; Sambandha
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Оре Мана Болі Суно
Таттва Бібарана
Оffічіал Наме: Упалабдгі: Самбандга-Абгідейа-Прайоджана-Віджнана Сонґ 1; Самбандга
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Oh mind! Please listen to me now while I narrate this explanation of the
absolute truth, the forgetfulness of which causes the soul''s bondage to the
material world.', E'',
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
    E'', E'',
    E'ore mana, boli
suno tattva-bibarana
yahar bismrti-janya jiber bandhana', E'оре мана, болі
суно таттва-бібарана
йахар бісмрті-джанйа джібер бандгана',
    E'', E'',
    E'That truth is one without a second, unparalleled, and unfathomable. This truth
is the Parabrahman, supreme above the Brahman
effulgence, the absolute Truth of all truths.', E'',
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
    E'', E'',
    E'tattva ek advitiya atulya
apar
sei tattva parabrahma sarva saratsar', E'таттва ек адвітійа атулйа
апар
сеі таттва парабрахма сарва саратсар',
    E'', E'',
    E'That truth is the energetic source of all energies, and is complete in
transcendental beauty. There is no distinction between the energy and the
energetic; therefore they are eternally inseparable.', E'',
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
    E'', E'',
    E'sei tattva saktiman sampurna sundar
sakti saktiman ek bastu
nirantar', E'сеі таттва сактіман сампурна сундар
сакті сактіман ек басту
нірантар',
    E'', E'',
    E'This eternal potency is supporting and nourishing all the eternal pastimes of
the Lord. For the purpose of executing these varieties of pastimes, the sakti manifests different realms known as Vrndavana, Vaikuntha and Goloka.', E'',
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
    E'nitya-sakti nitya sarva-bilasa-posaka
bilasartha brndabana, baikuntha, goloka', E'нітйа-сакті нітйа сарва-біласа-посака
біласартха брндабана, баікунтха, ґолока',
    E'', E'',
    E'For the purpose of expanding the Lord''s pastimes, this potency manipulates His
name, abode, qualities, associates; all according to transcendental time, place
and circumstances.', E'',
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
    E'bilasartha nama-dhama guna parikar
desa-kala-patra sakti anucar', E'біласартха нама-дгама ґуна парікар
деса-кала-патра сакті анучар',
    E'', E'',
    E'The potency''s powerful influence is meant for performing the Lord''s pastimes.
With Him, the Parabrahman, this sakti
is eternally identical to His personal manifestation.', E'',
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
    E'saktir prabhava ar prabhur
bilasa
parabarahma-sahe nitya ekatma-prakasa', E'сактір прабгава ар прабгур
біласа
парабарахма-сахе нітйа екатма-пракаса',
    E'', E'',
    E'Therefore only a fool in this material world makes the conclusion that first
there is the impersonal Brahman, and after that comes all the activities of
various divine potencies.', E'',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'ataeva brahma age sakti-karya pare
je kore siddhanta sei murkha e samsare', E'атаева брахма аґе сакті-карйа паре
дже коре сіддганта сеі муркха е самсаре',
    E'', E'',
    E'One can understand the existence of the full moon by the obvious presence of
the shining moonbeams. Without the rays, I will never accept the presence of
the moon.', E'',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'purna-candra bolile kirana-saha jani
akirana candra-sattta kabhu nahi mani', E'пурна-чандра боліле кірана-саха джані
акірана чандра-саттта кабгу нахі мані',
    E'', E'',
    E'Brahma is eternally accompanied by the Brahma-sakti.
I henceforth accept both of them to be one and the same eternal truth.', E'',
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
    v_chapter_id, '10', 10,
    E'', E'',
    E'brahma ar brahma-sakti-saha parikar
sama-kala nitya boli'' mani
atahpar', E'брахма ар брахма-сакті-саха парікар
сама-кала нітйа болі'' мані
атахпар',
    E'', E'',
    E'The moon-like Lord Krsna is that very same Parabrahman,
abounding with all varieties of transcendental pastimes within the supreme
realm of Vrndavana.', E'',
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
    v_chapter_id, '11', 11,
    E'', E'',
    E'akhanda bilasa-moy parabrahma jei
aprakrta brndabane krsna-candra sei', E'акханда біласа-мой парабрахма джеі
апракрта брндабане крсна-чандра сеі',
    E'', E'',
    E'He is indeed the non-dual truth and is the supreme source of all spiritual
bliss; and by His own causeless mercy He has so kindly manifested Himself on
the very soil of our India.', E'',
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
    v_chapter_id, '12', 12,
    E'', E'',
    E'sei se advaya-tattva paramanandakar
krpaya prakata hoilo bharate
amar', E'сеі се адвайа-таттва параманандакар
крпайа праката хоіло бгарате
амар',
    E'', E'',
    E'Krsna is that Supreme Absolute Truth existing beyond the material energy. He
eternally performs His daily pastimes within the realm known as Vraja.', E'',
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
    v_chapter_id, '13', 13,
    E'', E'',
    E'krsna se parama-tattva prakrtir par
brajete bilasa krsna kore''
nirantar', E'крсна се парама-таттва пракртір пар
браджете біласа крсна коре''
нірантар',
    E'', E'',
    E'Krsna is the shining sun of this all-cognizant
spiritual abode, and within His effulgence dwell innumerable fine particles of
pure cognizance called jiva.', E'',
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
    v_chapter_id, '14', 14,
    E'', E'',
    E'cid-dhama-bhaskara
krsna, tanra jyotirgata
ananta citkana jiba tisthe
avirata', E'чід-дгама-бгаскара
крсна, танра джйотірґата
ананта чіткана джіба тістхе
авірата',
    E'', E'',
    E'These jiva souls are by very nature full of pure
ecstatic love and are all the dearly beloved of Lord Krsna. Always being
attracted by Krsna, they continuously drink the ambrosial nectar of devotion.', E'',
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
    v_chapter_id, '15', 15,
    E'', E'',
    E'sei jiba prema-dharmi, krsna-gata-prana
sada krsnakrstha, bhakti-sudha kore'' pana', E'сеі джіба према-дгармі, крсна-ґата-прана
сада крснакрстха, бгакті-судга коре'' пана',
    E'', E'',
    E'Enjoying a mixture of various moods in the mellow of servitude, the jivas eternally remain subjugated and controlled by Krsna;s unlimited virtuous
qualities.', E'',
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
    v_chapter_id, '16', 16,
    E'', E'',
    E'nana-bhava-misrita
piya dasya-rasa
krsner ananta-gune sada thake basa', E'нана-бгава-місріта
пійа дасйа-раса
крснер ананта-ґуне сада тхаке баса',
    E'', E'',
    E'They also love Krsna in all the different moods of being related to Him as a
mother, father, friend, or husband.', E'',
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
    v_chapter_id, '17', 17,
    E'', E'',
    E'krsna mata, krsna pita, krsna sahka, pati
ei sab bhinna-bhava krsna kore rati', E'крсна мата, крсна піта, крсна сахка, паті
еі саб бгінна-бгава крсна коре раті',
    E'', E'',
    E'Eternally in Vrndavana Krsna
is the only male purusa), and all the jivas there enjoy pastimes in His company in the role of
females prakrti).', E'',
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
    v_chapter_id, '18', 18,
    E'', E'',
    E'krsna se purusa ek nitya
brndabane
jiba-gana nari-brnda, rame krsna sane', E'крсна се пуруса ек нітйа
брндабане
джіба-ґана нарі-брнда, раме крсна сане',
    E'', E'',
    E'There is no end to all of these blissful pastimes; therefore Krsna''s pastimes are known for being undisputedly supreme
and unlimited.', E'',
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
    v_chapter_id, '19', 19,
    E'', E'',
    E'sei to'' ananda-lila ja''r nai anta
ataeva krsna-lila akhanda ananta', E'сеі то'' ананда-ліла джа''р наі анта
атаева крсна-ліла акханда ананта',
    E'', E'',
    E'All the souls, in whom the desire to enjoy separately awakens, have to enter
into the material world under the false conception of being a male a purusa).', E'',
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
    v_chapter_id, '20', 20,
    E'', E'',
    E'je-sab jiber ''bhoga-banca upajilo
purusa bhavete ta''ra jade paravesilo', E'дже-саб джібер ''бгоґа-банча упаджіло
пуруса бгавете та''ра джаде паравесіло',
    E'', E'',
    E'Illusory material activities as well as maya herself are both the shadow reflections of the eternal
potency. In reality, maya is the eternal maidservant
of Krsna, but her job is to be in charge of operating the prison-house of the
material world.', E'',
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
    v_chapter_id, '21', 21,
    E'', E'',
    E'maya-karya jada maya--nitya-sakti-chaya
krsna-dasi sei satya, kara-kartri
maya', E'майа-карйа джада майа--нітйа-сакті-чхайа
крсна-дасі сеі сатйа, кара-картрі
майа',
    E'', E'',
    E'This illusory energy maya, has created the material universe exactly like an
imitation model of the real spiritual variegatedness,
but with the added feature of being full of various miseries.', E'',
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
    v_chapter_id, '22', 22,
    E'', E'',
    E'sei maya adarser samasta
bisesa
loiya gathilo bisva jahe
purna klesa', E'сеі майа адарсер самаста
бісеса
лоійа ґатхіло бісва джахе
пурна клеса',
    E'', E'',
    E'If by chance a living entity becomes averse to the Supreme Lord Krsna, then Mayadevi''s duty is to voluntarily offer her temptations of
material happiness.', E'',
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
    v_chapter_id, '23', 23,
    E'', E'',
    E'jiba jadi hoilena krsna-bahimukha
mayadevi tabe ta''r jachilena
sukha', E'джіба джаді хоілена крсна-бахімукха
майадеві табе та''р джачхілена
сукха',
    E'', E'',
    E'Intoxicated by maya''s illusory happiness, the living
entity then forgets Krsna. Under the influence of such ignorance, false
egoistic selfishness arises.', E'',
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
    v_chapter_id, '24', 24,
    E'', E'',
    E'maya-sukhe matta jiba sri-krsna
bhulilo
sei se avidya-base asmita janmilo', E'майа-сукхе матта джіба срі-крсна
бгуліло
сеі се авідйа-басе асміта джанміло',
    E'', E'',
    E'From such selfishness she becomes raptly absorbed in illusion, and then she
develops angry grudges and envious hatred towards other living entities.', E'',
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
    v_chapter_id, '25', 25,
    E'', E'',
    E'asmita hoite hoilo maya-bhinivesa
taha hoite jadagata raga ar dvesa', E'асміта хоіте хоіло майа-бгінівеса
таха хоіте джадаґата раґа ар двеса',
    E'', E'',
    E'In this fashion, the living entities are entering the wheel of fruitive activities, oscillating thereupon, and gradually
wandering up and down.', E'',
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
    v_chapter_id, '26', 26,
    E'', E'',
    E'eirupe jiba karma-cakre pravesiya
uccavaca-gatikrame
phirena bhramiya', E'еірупе джіба карма-чакре правесійа
уччавача-ґатікраме
пхірена бграмійа',
    E'', E'',
    E'Where is the supreme eternal spiritual bliss of Vaikuntha,
full of Krsna''s transcendental pastimes? And in
comparison, where is so-called material happiness, in which everything is
spoiled by its actual misery?', E'',
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
    v_chapter_id, '27', 27,
    E'', E'',
    E'kotha se baikunthananda, sri-krsna-bilasa
kotha mayagata sukha, dukha sarva-nasa!!', E'котха се баікунтхананда, срі-крсна-біласа
котха майаґата сукха, дукха сарва-наса!!',
    E'', E'',
    E'Then when the fine particle of cognizant truth becomes
addicted to the illusory energy, she suffers unlimited defeat at the hands of
the very same maya, and thus she is abused and
defamed until she falls into an extremely insignificant position.', E'',
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
    v_chapter_id, '28', 28,
    E'', E'',
    E'cit-tattva hoiya jiber mayabhiramana
ati tuccha jugupsita ananta patana', E'чіт-таттва хоійа джібер майабгірамана
аті туччха джуґупсіта ананта патана',
    E'', E'',
    E'Alas! How wonderfully astonishing it is that the soul, although composed of
transcendental energy, has accepted such difficulty by faithfully serving the
temporary material body in various ways!', E'',
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
    v_chapter_id, '29', 29,
    E'', E'',
    E'mayika deher bhavabhave dasya kori''
paratattva jiber ki kastha
aha mari!!', E'майіка дехер бгавабгаве дасйа корі''
парататтва джібер кі кастха
аха марі!!',
    E'', E'',
    E'Thus wandering and wandering, if by chance the poor soul gets the association
of the devotees of the Lord, then her eternal nature, which has been for so long
covered over, will once again become aroused.', E'',
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
    v_chapter_id, '30', 30,
    E'', E'',
    E'bhramite bhramite jadi sadhu-sanga
hoy
punaraya gupta nitya-dharmer udoy', E'бграміте бграміте джаді садгу-санґа
хой
пунарайа ґупта нітйа-дгармер удой',
    E'', E'',
    E'By discussing topics concerning Krsna in the association of devotees, and thus
awakening her previous mentality of servitude to Krsna, all bondage to maya''s illusion become severed.', E'',
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
    v_chapter_id, '31', 31,
    E'', E'',
    E'sadhu-sange krsna-katha hoy alocana
purva-bhava udi'' kate mayar
bandhan', E'садгу-санґе крсна-катха хой алочана
пурва-бгава уді'' кате майар
бандган',
    E'', E'',
    E'When the conditioned soul thus looks towards Krsna, then by such an act, then
this very same maya, in the form of transcendental
knowledge, severs all of her material bonds.', E'',
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
    v_chapter_id, '32', 32,
    E'', E'',
    E'krsna-prati jiba jabe korena
iksana
bidya-rupa maya kore'' bandhana
chedana', E'крсна-праті джіба джабе корена
іксана
бідйа-рупа майа коре'' бандгана
чхедана',
    E'', E'',
    E'The seat of this transcendental knowledge is present within this very universe
as the eternal Vrndavana-dhama in India. Lord Krsna expands His abode and pastimes at this Vrndavana just to facilitate the conditioned souls''
practice of devotional service.', E'',
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
    v_chapter_id, '33', 33,
    E'', E'',
    E'mayika jagate bidya nitya-brndabana
jiber sadhana-janya kore'' bibhavana', E'майіка джаґате бідйа нітйа-брндабана
джібер садгана-джанйа коре'' бібгавана',
    E'', E'',
    E'When she comes into contact with this Vrndavana, the
living entity becomes overwhelmed and lost in emotional ecstasy. Remaining
under the shelter of Lord Caitanya, she attain s eternal service.', E'',
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
    v_chapter_id, '34', 34,
    E'', E'',
    E'sei brndabane jiba bhavavistha ho''ye
nitya seva labha kore''
caitanya-asraye', E'сеі брндабане джіба бгававістха хо''йе
нітйа сева лабга коре''
чаітанйа-асрайе',
    E'', E'',
    E'The Lord''s pastimes of appearing in this world, as well as His pastimes in Goloka, are one in the same truth. Being
;non-different, they are simply two types of manifestations of the same
pastimes.', E'',
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
    v_chapter_id, '35', 35,
    E'', E'',
    E'prakatita lila, ar goloka-bilasa
ek tattva, bhinna noy, dvividha prakasa', E'пракатіта ліла, ар ґолока-біласа
ек таттва, бгінна ной, двівідга пракаса',
    E'', E'',
    E'The eternal pastimes in Goloka are the abode of all
the eternally liberated servitors, whereas the manifest pastimes in the
material world are the refuge for all of the bound-up conditioned living entities.', E'',
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
    v_chapter_id, '36', 36,
    E'', E'',
    E'nitya-lila nitya-dasa-ganer niloy
e prakata-lila baddha-jiber asroy', E'нітйа-ліла нітйа-даса-ґанер нілой
е праката-ліла баддга-джібер асрой',
    E'', E'',
    E'Therefore Vrndavana is the living entities original
eternal home, manifesting its own eternally true nature within the dead
material world.', E'',
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
    v_chapter_id, '37', 37,
    E'', E'',
    E'ataeva brndabana jiber avasa
asar samsare nitya-tattver prakasa', E'атаева брндабана джібер аваса
асар самсаре нітйа-таттвер пракаса',
    E'', E'',
    E'When the soul takes refuge in the lila
of Vrndavana, then, absorbed in the real self, she
enters into that eternal essence of the most divine principles of love.', E'',
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
    v_chapter_id, '38', 38,
    E'', E'',
    E'brndabana-lila jiba koroho asroy
atmagata rati-tattva jahe nitya hoy', E'брндабана-ліла джіба корохо асрой
атмаґата раті-таттва джахе нітйа хой',
    E'', E'',
    E'When in love with matter, the soul gives off an insignificant light like that
of a small glow-worm; but, when relieved of the material atmosphere, she glows
brilliantly like the sun, being in love with the real self.', E'',
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
    v_chapter_id, '39', 39,
    E'', E'',
    E'jadarati-khadyoter
aloka adhama
atmarati-suryodaye
hoy upasama', E'джадараті-кхадйотер
алока адгама
атмараті-сурйодайе
хой упасама',
    E'', E'',
    E'All good and bad works performed out of love and attachment to matter is all
borne of the temporary designative nature superimposed over the eternal soul.', E'',
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
    v_chapter_id, '40', 40,
    E'', E'',
    E'jadarati-gata jata subhasubha karma
jiber sambandhe sab aupadhika
dharma', E'джадараті-ґата джата субгасубга карма
джібер самбандге саб аупадгіка
дгарма',
    E'', E'',
    E'Due to love of matter people continuously try to enjoy sense gratification
being always attached to the opulence of such material infatuation.', E'',
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
    v_chapter_id, '41', 41,
    E'', E'',
    E'jadarati hoite loka-bhoga avirata
jadarati aisvaryer sada anugata', E'джадараті хоіте лока-бгоґа авірата
джадараті аісварйер сада ануґата',
    E'', E'',
    E'Due to this love of matter, the soul in her material body lives just like an
imitation God, but in reality she is forced to be the puppet of poisonous
material happiness.', E'',
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
    v_chapter_id, '42', 42,
    E'', E'',
    E'jadarati, jadadeha prabhu-sama bhaya
mayika bisaya-sukhe jibake nacaya', E'джадараті, джададеха прабгу-сама бгайа
майіка бісайа-сукхе джібаке начайа',
    E'', E'',
    E'Sometimes the love for matter makes the living entity wander up to the planet
of Brahma-loka, and sometimes it gives her an
inclination to attain the opulences of the eight-fold
mystic yoga system.', E'',
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
    v_chapter_id, '43', 43,
    E'', E'',
    E'kabhu ta''re lo''ye jay brahma-loka jatha
kabhu ta''re siksa deya
yogaisvarya-katha', E'кабгу та''ре ло''йе джай брахма-лока джатха
кабгу та''ре сікса дейа
йоґаісварйа-катха',
    E'', E'',
    E'The opulences of the yoga system, as well as the opulences of material enjoyment are both the causes of
fear. However, the soul becomes completely fearless when she attains real love
of the self in Vrndavana.', E'',
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
    v_chapter_id, '44', 44,
    E'', E'',
    E'yogaisvarya, bhogaisvarya sakali sabhoy
brndabane atmarati jiber abhoy', E'йоґаісварйа, бгоґаісварйа сакалі сабгой
брндабане атмараті джібер абгой',
    E'', E'',
    E'Persons who become averse to Krsna, becoming blinded by desires for material opulences, thus become bound up in illusory material
pleasures within the snare of maya''s trap.', E'',
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
    v_chapter_id, '45', 45,
    E'', E'',
    E'sri-ksrna-bimuka jana aisvaryer ase
mayika jadiya sukhe baddha
maya-pase', E'срі-ксрна-бімука джана аісварйер асе
майіка джадійа сукхе баддга
майа-пасе',
    E'', E'',
    E'But if she somehow becomes humble and firmly established in the self, knowing
the true essence of love for Krsna, the soul then rejects all desires for
material enjoyment and liberation.', E'',
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
    v_chapter_id, '46', 46,
    E'', E'',
    E'akincana atmarata krsna-rati-sar
jani'' bhukti-mukti-asa kore'' parihar', E'акінчана атмарата крсна-раті-сар
джані'' бгукті-мукті-аса коре'' паріхар',
    E'', E'',
    E'Then the journey of life goes on very smoothly and automatically, for Lord Hari bestows upon the jiva
eternal service in an eternal spiritual body, even while still remaining within
this world.', E'',
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
    v_chapter_id, '47', 47,
    E'', E'',
    E'samsare jibana-yatra anayase kori''
nitya-dehe nitya seve atmaparada
hari', E'самсаре джібана-йатра анайасе корі''
нітйа-дехе нітйа севе атмапарада
харі',
    E'', E'',
    E'Relinquishing all mad intoxication due to caste, bodily abilities or beauty,
one becomes attached to the path of devotional service.', E'',
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
    v_chapter_id, '48', 48,
    E'', E'',
    E'barnamada, balamada, rupamada, jata
bisarjana diya bhakti-pathe hana rata', E'барнамада, баламада, рупамада, джата
бісарджана дійа бгакті-патхе хана рата',
    E'', E'',
    E'Knowing devotional service to Krsna to be the only proper path, she remains
situated in the rules of conduct to her particular order of life, devoid of any
kind of anger or envy.', E'',
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
    v_chapter_id, '49', 49,
    E'', E'',
    E'asramadi bidhanete raga-dvesa-hina
ekamatra krsna-bhakti jani'' samicina''', E'асрамаді бідганете раґа-двеса-хіна
екаматра крсна-бгакті джані'' самічіна''',
    E'', E'',
    E'Under the controlling influence of her eternal natural activities, she passes
her time always tasting the mellows of Hari;s pastimes in the association of devotees.', E'',
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
    v_chapter_id, '50', 50,
    E'', E'',
    E'sadhugana-sange sada hari-lila-rase
japana korena kal nitya-dharma-base', E'садгуґана-санґе сада харі-ліла-расе
джапана корена кал нітйа-дгарма-басе',
    E'', E'',
    E'Abandoning anger and envy, she gives due honor and respect the Vedic
injunctions, which are meant to be good instructions for the proper conduct of
life''s journey.', E'',
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
    v_chapter_id, '51', 51,
    E'', E'',
    E'jibana-jatrar janya baidika-bidhana
raga-dvesa bisarjiya korena sammana', E'джібана-джатрар джанйа баідіка-бідгана
раґа-двеса бісарджійа корена саммана',
    E'', E'',
    E'But we see that the general characteristic of the Vedic injunctions is that
they are meant for facilitating the success of economic development and from
such wealth comes the fulfillment of lusty desires for sense gratification,
which is usually the prized treasure of fools.', E'',
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
    v_chapter_id, '52', 52,
    E'', E'',
    E'samanya baidika-dharma artha-phala-prada
artha hoite kama-labha mudher sampada', E'саманйа баідіка-дгарма артха-пхала-прада
артха хоіте кама-лабга мудгер сампада',
    E'', E'',
    E'Thus many souls accept all this religion, economic development and sense
gratification simply as a means of passing the days.', E'',
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
    v_chapter_id, '53', 53,
    E'', E'',
    E'sei dharma, sei artha, sei
kama jata
svikara korena dina-japaner mata', E'сеі дгарма, сеі артха, сеі
кама джата
свікара корена діна-джапанер мата',
    E'', E'',
    E'life is o accept the flowing current of devotional service to Krsna.', E'',
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
    v_chapter_id, '54', 54,
    E'', E'',
    E'tahate jibana-jatra korena nirvana
jibaner artha--krsna-bhaktir pravaha', E'тахате джібана-джатра корена нірвана
джібанер артха--крсна-бгактір праваха',
    E'', E'',
    E'Therefore the devotees of the Lord perform the exclusive worship of Lord Krsna,
being situated above any external system such as van asrama,
etc. Thus they transcend all the dualities of the material body.', E'',
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
    v_chapter_id, '55', 55,
    E'', E'',
    E'ataeva linga-hina sada sadhu-jana
dvandvatita ho''ye korena sri-krsna-bhajana', E'атаева лінґа-хіна сада садгу-джана
двандватіта хо''йе корена срі-крсна-бгаджана',
    E'', E'',
    E'Thus she does not waste any time endeavoring separately for knowledge, for she
automatically realizes eternal knowledge by the strength of her devotional
service.', E'',
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
    v_chapter_id, '56', 56,
    E'', E'',
    E'jnaner prayase kal na
kori'' japana
bhakti-bale nitya-jnana korena sadhana', E'джнанер прайасе кал на
корі'' джапана
бгакті-бале нітйа-джнана корена садгана',
    E'', E'',
    E'Living here and there and anywhere, wearing any available cloth, she maintains
body by taking only that food which is easily obtained.', E'',
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
    v_chapter_id, '57', 57,
    E'', E'',
    E'jatha tatha basa kori'',
je bastra pori''
sulabdha-bhojana-dvara deha raksa kori''', E'джатха татха баса корі'',
дже бастра порі''
сулабдга-бгоджана-двара деха ракса корі''',
    E'', E'',
    E'Thus the devotee of Krsna, being overwhelmingly absorbed in the joy of serving
Krsna, always wanders and roams about in the mellows of pure love for the Lord,
preaching the glories for such love.', E'',
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
    v_chapter_id, '58', 58,
    E'', E'',
    E'krsna-bhakta krsna-seba-anande matiya
sada krsna-prema-rase phirena gahiya', E'крсна-бгакта крсна-себа-ананде матійа
сада крсна-према-расе пхірена ґахійа',
    E'', E'',
    E'Thus Bhaktivinoda is singing about the causeless
mercy of Lord Sri Caitanya Mahaprabhu,
Who has so kindly descended at Navadvipa-dhama.
REMARKS/EXTRA INFORMATION:
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
    v_chapter_id, '59', 59,
    E'', E'',
    E'nabadvipe sri-caitanya-prabhu abatara
bhakatibinoda gay
krpay tanhar', E'набадвіпе срі-чаітанйа-прабгу абатара
бгакатібінода ґай
крпай танхар',
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


  -- Song 2: Apurva Vaisnava Tattva Atmar
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Apurva Vaisnava Tattva Atmar', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Apurva Vaisnava Tattva
Official Name: Upalabdhi:
Sambandha-Abhideya-Prayojana-Vijnana Song 2
Author: Bhaktivinoda Thakura
Book Name: Kalyana Kalpataru
Language: Bengali', E'Сонґ Наме: Апурва Ваіснава Таттва
Оffічіал Наме: Упалабдгі:
Самбандга-Абгідейа-Прайоджана-Віджнана Сонґ 2
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Oh most powerful essential truth of the Vaisnava! Oh gushing
fountain of the bliss of the self! A similar truth to whose there is no equal
within this material world!', E'',
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
    E'', E'',
    E'apurva vaisnava-tattva! atmar
ananda-
prasravana! nahi ja''ra tulana samsare', E'апурва ваіснава-таттва! атмар
ананда-
прасравана! нахі джа''ра тулана самсаре',
    E'', E'',
    E'On account of its own nature and characteristics it is famous in this world!
Please hear the description of the essence of this truth.', E'',
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
    E'', E'',
    E'sva-dharma boliya ja''r ache paricoy
e jagate! e tattver suno
vivarana', E'сва-дгарма болійа джа''р ачхе парічой
е джаґате! е таттвер суно
віварана',
    E'', E'',
    E'The Parabrahman is the original eternal form of bliss, as well as a deep
reservoir of all transcendental mellows.
4-5)
How can any ordinary argument ever be able to touch
this truth? The truth of such transcendental mellows is extremely deep and
grave! It is attained only under the shelter of samadhi! Ah, such a wonderful
treasure is samadhi!', E'',
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
    E'', E'',
    E'parabrahma sanatana ananda-svarupa,
nitya-kal rasa-rupa, raser adhar', E'парабрахма санатана ананда-сварупа,
нітйа-кал раса-рупа, расер адгар',
    E'', E'',
    E'Oh aspiring devotee! Just see the characteristics of samadhi with an unagitated
and peaceful mind. The truth of mellows is complete, absolutely undivided
supreme bliss. However, within that, the dealings between the taster of mellows and that which is tasted have an eternal
principle that is inseparable.', E'',
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
    E'paratpar, advitiya, ananta, apar!
tathapi svarupa-tattva, sakti saktimana;
lila-rasa-parakastha, asraya-svarupa', E'паратпар, адвітійа, ананта, апар!
татхапі сварупа-таттва, сакті сактімана;
ліла-раса-паракастха, асрайа-сварупа',
    E'', E'',
    E'The Supreme Lord is one without a second, and in His original form of Lord
Krsna He is the taster of transcendental mellows, and His object to be tasted
is Sri Radhika. Oh, the joy of the meeting of the Supreme subject and object!
And their transcendentally blissful meeting place is Sri Vrndavana.', E'',
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
    E'tarka ki se tattva kabhu sparsibare pare?
rasa-tattva sugambhira! samadhi-asraye
upalabdha! aha mari, samadhi ki
dhana!', E'тарка кі се таттва кабгу спарсібаре паре?
раса-таттва суґамбгіра! самадгі-асрайе
упалабдга! аха марі, самадгі кі
дгана!',
    E'', E'',
    E'The special manifestation of Sri Vrndavana within the material universe is
revealed directly by Yogamaya. Those aspiring devotees who take the refuge of
This Vrndavana attain the eternal truth of ecstatic love. Indeed, the very name
of this model of Vrndavana here on the earth''s surface is all-auspicious even
within the realm of Vaikuntha!', E'',
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
    E'samadhistha ho''ye dekho, susthira antare,
he sadhaka! rasa-tattva
akhanda ananda;
kintu tahe asvadaka-asvadya-bidhana,
nitya-dharma anusyuta!', E'самадгістха хо''йе декхо, сустхіра антаре,
хе садгака! раса-таттва
акханда ананда;
кінту тахе асвадака-асвадйа-бідгана,
нітйа-дгарма анусйута!',
    E'', E'',
    E'If the living entity ever wants to continuously render service to the flowing
current of eternal bliss, he takes shelter of the feet of a bona fide spiritual
master.', E'',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'advitiya prabhu,
asvadaka krsna-rupa, --- asvadya radhika,
dvaitananda! parananda-pitha
brndabana!', E'адвітійа прабгу,
асвадака крсна-рупа, --- асвадйа радгіка,
дваітананда! парананда-пітха
брндабана!',
    E'', E'',
    E'Then he rejects all types of dry, sapless worship which is devoid of
appreciation for higher sentiments; he reflects deeply on the nature of the
Absolute, and always arduously endeavors with taste to lovingly worship the
circle of the divine rasa dance in Vrndavana (the rasa-mandala).
11) My friend, your false egoistic conception of being
a male is extremely feeble, for you are actually pure spirit soul! And your
real family comprises the beloved objects which are tasted by Krsna, namely the
eternal maidservants of Sri Radhika! Just realize the mellows
of such transcendental ecstasy! The enjoyment of maya is your downfall!!
REMARKS/EXTRA INFORMATION:
This song is originally
composed as on single paragraph of prose-type lines. But it is not poetry, and
not really prose either. Anyway, it has been broken up into smaller sections
reading.', E'',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'prakrta jagate ja''r prakasa-bisesa,
jogamaya prakasita; tanhar asraye
labhiche sadhaka-brnda nitya prema-tattva ---
adarsa, jahar nama baikuntha-kalyan', E'пракрта джаґате джа''р пракаса-бісеса,
джоґамайа пракасіта; танхар асрайе
лабгічхе садгака-брнда нітйа према-таттва ---
адарса, джахар нама баікунтха-калйан',
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
    v_chapter_id, '10', 10,
    E'', E'',
    E'jadi caha nityananda pravaha sevite
abirata, guru-padasraya koro'' jiba', E'джаді чаха нітйананда праваха севіте
абірата, ґуру-падасрайа коро'' джіба',
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
    v_chapter_id, '11', 11,
    E'', E'',
    E'nirasa bhajana samudaya parihari
brahma-cinta adi jata, sada sadha'' rati,
kusumita brndabane sri-rasa-mandale', E'ніраса бгаджана самудайа паріхарі
брахма-чінта аді джата, сада садга'' раті,
кусуміта брндабане срі-раса-мандале',
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
    v_chapter_id, '12', 12,
    E'', E'',
    E'purusatava-ahankara nitanta durbala
taba! tumi suddha jiba! asvadya svajana,
sri-radhikar nitya sakhi! parananda-rasa
anubhavi''! maya-bhoga tomar
patana!!', E'пурусатава-аханкара нітанта дурбала
таба! тумі суддга джіба! асвадйа сваджана,
срі-радгікар нітйа сакхі! парананда-раса
анубгаві''! майа-бгоґа томар
патана!!',
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


  -- Song 3: Cij Jader Dvaita Jini Korena
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Cij Jader Dvaita Jini Korena', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Cijjader Dvaita Jini Korena
Sthapana
Official Name: Upalabdhi: Sambandha-Abhideya-Prayojana-Vijnana Song 3
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Чіджджадер Дваіта Джіні Корена
Стхапана
Оffічіал Наме: Упалабдгі: Самбандга-Абгідейа-Прайоджана-Віджнана Сонґ 3
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Sometime one may foolishly try to establish the difference between spirit and matter
in a manner based only on materialistic speculative theorems; but alas! His
intelligence becomes covered over by a network of illusions, and thus he can
have no real illumination or realized knowledge.', E'',
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
    E'', E'',
    E'cijjader dvaita jini korena
sthapana
jadiya kutrka-bale hay
bhrama-jal ta''r buddhi kore
acchadana
bijnana-aloka nahi tay', E'чіджджадер дваіта джіні корена
стхапана
джадійа кутрка-бале хай
бграма-джал та''р буддгі коре
аччхадана
біджнана-алока нахі тай',
    E'', E'',
    E'That person who understands that matter is simply an imitation model of the
true spiritual ideal achieves realization of the secret mysteries of the
absolute problem. And I would consider such a person to be truly competent.', E'',
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
    E'', E'',
    E'cit-tattve adarsa boli'' jane
jey jane
jade anukrti, boli'' mani
tahar bijnana suddha rahasya sadhane
samartha boliya ami jani', E'чіт-таттве адарса болі'' джане
джей джане
джаде анукрті, болі'' мані
тахар біджнана суддга рахасйа садгане
самартха болійа амі джані',
    E'', E'',
    E'Therefore you can observe that this universe is simply a material imitation of
the supreme Vaikuntha realm. The difference is that
all of the existence in Vaikuntha is spotlessly pure,
without any trace of fault whatsoever, whereas the material sphere is always
full of faults and inebriates.', E'',
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
    E'', E'',
    E'ataeva e jagate jaha laksya
hoy
baikunthera jada anukrti
nirdosa baikuntha-gata-satta-samudoy
`sadosa jadiya parimiti', E'атаева е джаґате джаха лаксйа
хой
баікунтхера джада анукрті
нірдоса баікунтха-ґата-сатта-самудой
`садоса джадійа паріміті',
    E'', E'',
    E'In the abode of Vaikuntha the transcendental love
culminates into the highest limit of super-sweet mahabhava.
In contrast, the insignificant imitative relationship between male and female
in this world, and the resultant so-called pleasure of their association
together, is simply an ocean of complete misery.', E'',
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
    E'baikuntha-nilaye jei aprakrta rati
su madhura mahabahavavadhi
ta''r tuccha anukrti purusa-prakrti
sanga-sukha-samklesa
jaladhi', E'баікунтха-нілайе джеі апракрта раті
су мадгура махабахававадгі
та''р туччха анукрті пуруса-пракрті
санґа-сукха-самклеса
джаладгі',
    E'', E'',
    E'Taking refuge in a transcendentally perfect siddha-deha,
or spiritual body, on the strength of his union with his own natural samadhi, the aspirant thus eternally worships in novel
curiosity the Son of Nanda Maharaja in the mood and
emotions like that of a female.
REMARKS/EXTRA INFORMATION:
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
    E'aprakrta siddha-deha koriya asroy
sahaja-samadhi-yogabale
sadhaka prakrti-bhave sri-nanda-tanoy
bhajena sarvada kautuhale', E'апракрта сіддга-деха корійа асрой
сахаджа-самадгі-йоґабале
садгака пракрті-бгаве срі-нанда-таной
бгаджена сарвада каутухале',
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


  -- Song 4: Jivana Samapt Kale Koribo
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Jivana Samapt Kale Koribo', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Jivana Sampat Kale Koribo
Official Name: Upalabdhi: Sambandha-Abhideya-Prayojana-Vijnana Song 4
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Джівана Сампат Кале Корібо
Оffічіал Наме: Упалабдгі: Самбандга-Абгідейа-Прайоджана-Віджнана Сонґ 4
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) A wise, experienced man
will never say: ''At the end of my life I will worship God, but now I will enjoy
happiness in family life''-- for he knows that this body is tottering and
unstable, about to drop at any second.
2) Death certainly must
come, either today or in about hundred years, so don''t live so carefree,
brothers! Immediately begin worshiping the lotus feet of Krsna,
for there is no fixed certainty of this life.
3) One thinks: ''After
spending my worldly life I shall go to Vrndavana, but
to purify myself of the three debts I am endeavoring very hard now''.
4) This type of idea is not
the ultimate goal of life. By the influence of such a nonsensical desire, your
life will depart in the end without your ever having worshiped the lotus feet
of -dina-bandhu-, the dear
most Friend of the fallen.
5) If you want the topmost
auspiciousness, then just sing always the name of Krsna
whether you live at home or in the forest. All these other arguments described
here are simply aimless excuses.
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
    E'', E'',
    E'jibana-samapt-kale
koribo bhajana,
ebe kori grha-sukha''
kakhan e katha nahi bole bijna-jana,
e deha patanonmukha', E'джібана-самапт-кале
корібо бгаджана,
ебе корі ґрха-сукха''
какхан е катха нахі боле біджна-джана,
е деха патанонмукха',
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
    E'', E'',
    E'aji ba sateka barse
abasya marana,
niscinta na thako bhai
jata sighra para, bhajo
sri-krsna-carana
jibaner thik nai', E'аджі ба сатека барсе
абасйа марана,
нісчінта на тхако бгаі
джата сіґгра пара, бгаджо
срі-крсна-чарана
джібанер тхік наі',
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
    E'', E'',
    E'samsar nirvana kori'' ja''bo ami
brndabana
rna-troy sodhibare koritechi sujatana', E'самсар нірвана корі'' джа''бо амі
брндабана
рна-трой содгібаре корітечхі суджатана',
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
    E'e asay nahi
prayojana
emon durasa base, ja''bo prana abasese,
na hoile dina-bandhucarana-sevana', E'е асай нахі
прайоджана
емон дураса басе, джа''бо прана абасесе,
на хоіле діна-бандгучарана-севана',
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
    E'jadi sumangala cao, sada krsna-nama gao,
grhe thako, bane thako, ithe tarka akarana', E'джаді суманґала чао, сада крсна-нама ґао,
ґрхе тхако, бане тхако, ітхе тарка акарана',
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


  -- Section 7: Ucchvasa - Prarthana Dainyamayi
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 7, E'Ecstasy - Humble Prayers', E'Уччгваса - Прартгана Даіньямайі (Екстаз - Смиренні молитви)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 7;


  -- Song 1: Kabe Sri Caitanya
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Kabe Sri Caitanya', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Kabe Sri Caitanya More Koribena Doya
Official Name: Ucchvasa: Prarthana Dainyamayi Song 1
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Кабе Срі Чаітанйа Море Корібена Дойа
Оffічіал Наме: Уччхваса: Прартхана Даінйамайі Сонґ 1
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) When will Sri Caitanya Mahaprabhu show His
causeless mercy to me by allowing me to attain the shade of the lotus feet of
all the Vaisnavas?
2) When will I be able to
give up this false ego which is so deeply engrossed in sense gratification? And
when will I be able to properly honor the associates of the Lord?
3) I will stand before the Vaisnavas with folded hands, a cloth binding my neck, and a
straw in between my teeth, sincerely awaiting their order.
4) Weeping and weeping, I
will understand the real nature of this abode of misery, and I will beg for
relief from the blazing fire of this material world.
5) Hearing about all of my
miserable sufferings, the Vaisnavas Thakura will submit an appeal unto the Lord Krsna on my behalf.
6) By the prayer of the Vaisnavas the all-merciful Lord Krsna
will then become compassionate towards such a sinner as me.
7) Bhaktivinoda''s
prayer unto the lotus feet of the Vaisnavas is that:
"Please be merciful and take this worthless person into your
association".
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'kabe śrī caitanya more karibena dayā
kabe āmi paiba vaiṣṇava-pada-chāyā', E'кабе ш́рı̄ чаітанйа море карібена дайа̄
кабе а̄мі паіба ваішн̣ава-пада-чха̄йа̄',
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
    E'', E'',
    E'kabe āmi chāḍiba e viṣayābhimāna
kabe viṣṇu-jane āmi kariba sammāna', E'кабе а̄мі чха̄д̣іба е вішайа̄бгіма̄на
кабе вішн̣у-джане а̄мі каріба самма̄на',
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
    E'', E'',
    E'gala-vastra kṛtāñjali vaiṣṇava-nikaṭe
dante tṛṇa kari'' dāḍāiba niṣkapaṭe', E'ґала-вастра кр̣та̄н̃джалі ваішн̣ава-нікат̣е
данте тр̣н̣а карі'' да̄д̣а̄іба нішкапат̣е',
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
    E'kādiyā kādiyā jānāiba
duḥkha-grāma
saḿsāra-anala haite māgiba viśrāma', E'ка̄дійа̄ ка̄дійа̄ джа̄на̄іба
дух̣кха-ґра̄ма
саḿса̄ра-анала хаіте ма̄ґіба віш́ра̄ма',
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
    E'śuniyā āmāra duḥkha vaiṣṇava ṭhākura
āmā'' lāgi'' kṛṣṇe
āvedibena pracura', E'ш́унійа̄ а̄ма̄ра дух̣кха ваішн̣ава т̣ха̄кура
а̄ма̄'' ла̄ґі'' кр̣шн̣е
а̄ведібена прачура',
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
    E'vaiṣṇavera āvedane kṛṣṇa
dayāmaya
e hena pāmara
prati ha''bena sa-daya', E'ваішн̣авера а̄ведане кр̣шн̣а
дайа̄майа
е хена па̄мара
праті ха''бена са-дайа',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'vinodera nivedana vaiṣṇava-caraṇe
kṛpā kari'' sańge laha ei akiñcane', E'вінодера ніведана ваішн̣ава-чаран̣е
кр̣па̄ карі'' саńґе лаха еі акін̃чане',
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


  -- Song 2: Ami To Durjana Ati Sada
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Ami To Durjana Ati Sada', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Ami To'' Durjana
Ati Sada Duracar
Official Name: Ucchvasa: Prarthana Dainyamayi Song 2
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Амі То'' Дурджана
Аті Сада Дурачар
Оffічіал Наме: Уччхваса: Прартхана Даінйамайі Сонґ 2
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) I am certainly the most wicked person, always performing sinful actions. For
millions and millions of births I have not been able to gain release from this
predicament.
2) Who is so merciful within this material universe as to pick such a
sinner up and take me close to Himself?
3) But I have heard about
Sri Caitanya Mahaprabhu,
Who is known as the deliverer of the most fallen. Innumerable sinners have
already been freed by Him.
4) Such an ocean of
compassion He is, Who is distributing His own causeless
mercy! When will He deliver me by bestowing upon me His own Divine Lotus Feet?
5) Oh Lord! Now I will
really understand the extent of Your compassion only
if You are able to deliver this most sinful person.
6) By what means will I get
those lotus feet since I am completely bereft of fruitive
activities, bereft of knowledge, and bereft of any kind of devotion to Krsna?
7) My only hope is Your compassion, for the opinion of all the Vedas is that
Your compassion is causeless.
8) You are the very abode
of purity, and I am most wicked and evil-minded. So how will I attain the
shelter of Your lotus feet?
9) Weeping and weeping,
this fallen and most contemptible person says: "Dear Lord, all I know is
that Your most celebrated name is Patita-Pavana,
the deliverer of the fallen".
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'ami to'' durjana ati sada
duracar
koti koti janme mor
nahiko uddhar', E'амі то'' дурджана аті сада
дурачар
коті коті джанме мор
нахіко уддгар',
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
    E'', E'',
    E'e heno doyalu
kebae jagate ache
emata pamare uddhariya la''be kache?', E'е хено дойалу
кебае джаґате ачхе
емата памаре уддгарійа ла''бе качхе?',
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
    E'', E'',
    E'suniyachi, sri-caitanya patita-pavana
ananta-pataki jane korila mocana', E'сунійачхі, срі-чаітанйа патіта-павана
ананта-патакі джане коріла мочана',
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
    E'emata doyar sindhu krpa
bitariya
kabe uddharibe more sri-caranan diya?', E'емата дойар сіндгу крпа
бітарійа
кабе уддгарібе море срі-чаранан дійа?',
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
    E'eibar bujha ja''be karuna
tomar
jadi e pamara-jane koribe uddhar', E'еібар буджха джа''бе каруна
томар
джаді е памара-джане корібе уддгар',
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
    E'karma nai, jnana
nai, krsna-bhakti nai
tabe bolo'' kirupe o sri-carana pai', E'карма наі, джнана
наі, крсна-бгакті наі
табе боло'' кірупе о срі-чарана паі',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'bharasa amar matra koruna tomar
ahaituki se
koruna beder bicar', E'бгараса амар матра коруна томар
ахаітукі се
коруна бедер бічар',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'tumi to'' pavitra-pada, ami durasoy
kemone tomar pade paibo
asroy?', E'тумі то'' павітра-пада, амі дурасой
кемоне томар паде паібо
асрой?',
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
    v_chapter_id, '10', 10,
    E'', E'',
    E'kandiya kandiya bole'' e patita char
patita-pavana nama prasiddha tomar', E'кандійа кандійа боле'' е патіта чхар
патіта-павана нама прасіддга томар',
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


  -- Song 3: Bhava Arnave Pade
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Bhava Arnave Pade', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Bhavarnave Pade Mor
Official Name: Ucchvasa Prarthana Dainyamayi Song 3
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Бхаварнаве Паде Мор
Оffічіал Наме: Уччхваса Прартхана Даінйамайі Сонґ 3
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) Having fallen into this
vast ocean of material existence, my heart has become extremely worried. I
cannot even find a clue of the means to get some help.
2) I have no strength from fruitive activities or speculative knowledge. Nor do I have
any help from virtues created by sacrifices, yoga practice or austerities.
3) I am extremely feeble,
and I don''t know how to swim. Who will rescue me from this dreadful calamity?
4) I see the horrible
alligator of sense gratification present before me, the waves of lust are
constantly agitating and provoking me.
5) I can no longer cope
with all the urges that are pushing me like a raging wind from my previous
births. I simply weep with an agitated mind, for I do not see any rescuer in
sight.
6) Oh most revered Jahnava Devi! Please show mercy to
this servant today by virtue of your own good qualities, and kindly relieve all
of his afflictions.
7) By taking the shelter of
the boat of Your lotus feet I will certainly be able
to cross over this vast ocean of material existence.
8) You are the very
pleasure potency of Lord Nityananda, and you are the
spiritual master of devotion to Lord Krsna. Kindly bestow upon this servant the
wish-fulfilling desire tree of your lotus feet.
9) Thus this most wretched
and shameful rogue begs at your feet today, for he sees that you are delivering
many other sinners.
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
    E'', E'',
    E'bhavarnave pa''de mor akula
paran
kise kula pa''bo, ta''r
na pai sandhan', E'бгаварнаве па''де мор акула
паран
кісе кула па''бо, та''р
на паі сандган',
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
    E'', E'',
    E'na ache karama-bala, nahi jnana-bala
jaga-joga-tapodharma
-- na ache sambala', E'на ачхе карама-бала, нахі джнана-бала
джаґа-джоґа-таподгарма
-- на ачхе самбала',
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
    E'', E'',
    E'nit nta durbala
ami, na jani
santar
e bipade ke amare koribe
uddhar', E'ніт нта дурбала
амі, на джані
сантар
е біпаде ке амаре корібе
уддгар',
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
    E'bisaya-kubhira tahe bhisana-darsana
kamer taranga sada kore''
uttejana', E'бісайа-кубгіра тахе бгісана-дарсана
камер таранґа сада коре''
уттеджана',
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
    E'prattana-vayur vega sahite na
pari
kandiya asthira mana, na
dekhi kandari', E'праттана-вайур веґа сахіте на
парі
кандійа астхіра мана, на
декхі кандарі',
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
    E'ogo sri jahnava devi!
e dase koruna
koro'' aji nija-gune, ghucao jantrana', E'оґо срі джахнава деві!
е дасе коруна
коро'' аджі ніджа-ґуне, ґгучао джантрана',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'tomar carana-tari koriya asroy
bhavarnava par ha''ba korechi niscoy', E'томар чарана-тарі корійа асрой
бгаварнава пар ха''ба коречхі нісчой',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'tumi nityananda-sakti krsna-bhakti-guru
e dase koroho
dana pada-kalpa-taru', E'тумі нітйананда-сакті крсна-бгакті-ґуру
е дасе корохо
дана пада-калпа-тару',
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
    v_chapter_id, '10', 10,
    E'', E'',
    E'kota kota pamarere ko''recho uddhar
tomar carane aj e kangal
char', E'кота кота памарере ко''речхо уддгар
томар чаране адж е канґал
чхар',
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


  -- Song 4: Visaya Basana Rupa Citter
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Visaya Basana Rupa Citter', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Visaya Basana Rupa Citter
Bikar
Official Name: Ucchvasa: Prarthana Dainyamayi Song 4
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Вісайа Басана Рупа Чіттер
Бікар
Оffічіал Наме: Уччхваса: Прартхана Даінйамайі Сонґ 4
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) The delusion rooted deep
into my heart has taken the shape of desires for sense gratification. Thus in
my heart I am constantly trying to enjoy.
2) Alas! How much endeavor
have I made for such enjoyment? My delusions have not gone away, and I
understand that now in the end my life is departing.
3) This ghastly delusion
has made me extremely restless. I have not achieved any peace, and I am most
disturbed at heart.
4) When will Srila Rupa Gosvami
bestow his mercy upon me? When will he deliver me by bestowing upon me yukta vairagya? (The science of
renunciation which dovetails all favorable things in devotional service.)
5) When will Srila Sanatana Gosvami cause me to give up this materialistic sense
gratification? Being gracious to me, he will offer me in devotion to Lord Nityananda Prabhu.
6) When will Srila Jiva Gosvami
pour the waters of his strong conclusive truths and thereby extinguish the fire
of false arguments that burns my heart?
7) My jubilation will arise
when I hear the chanting of the holy name of Sri Krsna
Caitanya, and by drinking the nectar of Radha-Krsna I will become free from all of my lamentations.
8) This rogue is not only
wicked amongst the wicked, but is the most wretched amongst the wretched.
Therefore he now begs for the shelter of the lotus feet of all the Vaisnavas.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'visaya-basana rupa citter bikar
amar hrdoye bhoga ka''re
anibar', E'вісайа-басана рупа чіттер бікар
амар хрдойе бгоґа ка''ре
анібар',
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
    E'', E'',
    E'je kota jatana ami
korilam hay
na gelo bikar, bujhi
sese prana jay', E'дже кота джатана амі
корілам хай
на ґело бікар, буджхі
сесе прана джай',
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
    E'', E'',
    E'e ghor
bikar more korilo asthira
santi na pailo
sthan, antara adhira', E'е ґгор
бікар море коріло астхіра
санті на паіло
стхан, антара адгіра',
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
    E'sri rupa goswami
more krpa bitariya
uddharibe kabe jukta-bairagya
arpiya', E'срі рупа ґосвамі
море крпа бітарійа
уддгарібе кабе джукта-баіраґйа
арпійа',
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
    E'kabe sanatana more chadaye bisoy
nityanande samarpibe haiya sadoy', E'кабе санатана море чхадайе бісой
нітйананде самарпібе хаійа садой',
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
    E'sri jiba goswami
kabe siddhanta-salile
nivaibe tarkanala, citta jahe jwale', E'срі джіба ґосвамі
кабе сіддганта-саліле
ніваібе тарканала, чітта джахе джвале',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'sri-caitanya-nama sune udibe
pulaka
radha-krsnamrta-pane haibo asoka', E'срі-чаітанйа-нама суне удібе
пулака
радга-крснамрта-пане хаібо асока',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'kangaler sukangal durjana e jana
baisnaba-caransroy jace akincana', E'канґалер суканґал дурджана е джана
баіснаба-чарансрой джаче акінчана',
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


  -- Song 5: Amar Samana Hina Nahi E
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Amar Samana Hina Nahi E', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Amar Saman Hina Nahi
E Samsare
Official Name: Ucchvasa: Prarthana Dainyamayi Song 5
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Амар Саман Хіна Нахі
Е Самсаре
Оffічіал Наме: Уччхваса: Прартхана Даінйамайі Сонґ 5
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) The likes of such a
lowly soul as me is not to be found anywhere else in this world. Thus I have
become most agitated due to falling into this vast ocean of material existence.
2) Oh Yogamaya!
When will you show mercy to me by lifting up the curtain of illusion with which
you shroud the universe in your external form of Mahamaya?
You are known as Kuladevi, the traditional worshipable Goddess of all the Vaisnavas
dynasties.
3) I have heard of your
glories and activities from the Vedic literatures, You
take all those souls who are averse to Krsna and bind
them within the material world.
4) To that
person whose good fortune gradually dawns and allow him to again become
favorably disposed to Krsna, you award him with
liberation and make him free from all grief and fear.
5) Oh my dear Mother!
Showing your causeless mercy to your servant give me a
place in Vrndavana, for you are Yogamaya
Herself. (The internal energy of yoga, or union.)
6) Without complying with
you, no soul at any time can get Krsna, for the
manifestation of Krsna''s pastimes is all enacted only
by your mercy.
7) You are the devoted
follower of Lord Krsna, and you are the mother of the
universe. You have shown to me the transcendental touchstone of Krsna consciousness.
8) My dear Mother, I
sincerely wish that you will let my faith in the Vaisnavas
increase at every moment.
9) Without the lotus feet
of the devotees of the Lord, Bhaktivinoda is not able
to cross to the other side of this ocean of material existence.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'amar saman hina nahi
e samsare
asthira ha''yechi padi'' bhava parabare', E'амар саман хіна нахі
е самсаре
астхіра ха''йечхі паді'' бгава парабаре',
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
    E'', E'',
    E'kuladevi jogamaya more krpa kori''
abarana sambaribe kabe bisvodari', E'куладеві джоґамайа море крпа корі''
абарана самбарібе кабе бісводарі',
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
    E'', E'',
    E'sunechi agame-bede mahima tomar
sri krsna-bimukhe bandhi'' karao samsar', E'сунечхі аґаме-беде махіма томар
срі крсна-бімукхе бандгі'' карао самсар',
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
    E'sri-krsna-sammukhya
ja''r bhagya-krame hoy
ta''re mukti diya koro''
asoka abhoy', E'срі-крсна-саммукхйа
джа''р бгаґйа-краме хой
та''ре мукті дійа коро''
асока абгой',
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
    E'e dase janani!
kori'' akaitava
doya
brndabane deha'' sthana tumi
jogamaya', E'е дасе джанані!
корі'' акаітава
дойа
брндабане деха'' стхана тумі
джоґамайа',
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
    E'tomake langhiya kotha jibe krsna pay
krsna rasa prakatilo tomar krpay', E'томаке ланґгійа котха джібе крсна пай
крсна раса пракатіло томар крпай',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'tumi krsna-sahacari jagata-janani
tumi dekhaile more krsna-cintamani', E'тумі крсна-сахачарі джаґата-джанані
тумі декхаіле море крсна-чінтамані',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'niskapata ho''ye mata cao
mor pane
baisnabe bisvasa brddhi ha''ka prati-ksane', E'ніскапата хо''йе мата чао
мор пане
баіснабе бісваса брддгі ха''ка праті-ксане',
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
    v_chapter_id, '10', 10,
    E'', E'',
    E'baisnaba-carana bina bhava-parabar
bhakativinoda nare hoibare par', E'баіснаба-чарана біна бгава-парабар
бгакатівінода наре хоібаре пар',
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


  -- Section 8: Ucchvasa - Prarthana Lalasamayi
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 8, E'Ecstasy - Longing Prayers', E'Уччгваса - Прартгана Лаласамайі (Екстаз - Молитви прагнення)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;


  -- Song 1: Kabe Mor Subha Dina Hoibe
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Kabe Mor Subha Dina Hoibe', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Kabe Mor Subhadina
Hoibe Udoy
Official Name: Ucchvasa: Prarthana Lalasmayi Song 1
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Кабе Мор Субгадіна
Хоібе Удой
Оffічіал Наме: Уччхваса: Прартхана Лаласмайі Сонґ 1
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) When will that
auspicious day dawn when I will achieve full shelter in the transcendental
abode of Vrndavana?
2) The burning fire of this
material world will cease, as well as all desires for sense gratification, for
by being with the devotees of the Lord, all my longings will be fulfilled.
3) Becoming maddened by
their chanting of the holy name of the Lord, I will fall down and roll in the
grayish dust at the devotees'' feet.
4) When, in a kadamba grove on the bank of the Yamuna
River, will I behold the beauty of the Divine Couple within the eyes of my
heart?
5) When will a sakhi show her gracious mercy to me by engaging me in
conjugal service, keeping me by the side of her own lotus feet?
6) And when will I catch a glimpse
of Their divine conjugal pastimes? Becoming filled with the ecstasy of pure
spiritual love I will lose consciousness.
7) Falling down, I will
remain unconscious for a long time, and I will thus completely forget about my
own body.
8) Getting up I will again
remember that sight which I saw while unconscious -- I saw the pastimes of Krsna while I was swimming in an ocean of tears.
9) Making repeated requests
in the presence of the devotees, I will ask them to give just one drop of the
ocean of devotion to this wicked person.
10) Bhaktivinoda''s
incessant longing is for the shelter of the lotus feet of Sri Ananga Manjari. (Original form of
Sri Jahnava Devi, Lord Nityananda''s consort and pleasure potency.)
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'kabe mor subhadina hoibe
udoy
brndabana-dhama
mama hoibe asroy', E'кабе мор субгадіна хоібе
удой
брндабана-дгама
мама хоібе асрой',
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
    E'', E'',
    E'ghucibe samsara-jvala, bisaya-basana
baisnabe-samsarge
mor puribe kamana', E'ґгучібе самсара-джвала, бісайа-басана
баіснабе-самсарґе
мор пурібе камана',
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
    E'', E'',
    E'dhulaya dhusara ho''ye hari-samkirtane
matta ho''ye pa''de ro''ba
baisnaba-carane', E'дгулайа дгусара хо''йе харі-самкіртане
матта хо''йе па''де ро''ба
баіснаба-чаране',
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
    E'kabe sri jamuna-tire kadamba-kanane
heribo jugala-rupa hrdoya-nayane', E'кабе срі джамуна-тіре кадамба-канане
херібо джуґала-рупа хрдойа-найане',
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
    E'kabe skahi krpa kori''
jugala-sevay
niyukta koribe more rakhi'' nija pa''y', E'кабе скахі крпа корі''
джуґала-севай
нійукта корібе море ракхі'' ніджа па''й',
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
    E'kabe ba jugala-lila ko''ri darasana
premananda-bhare ami ha''ba acetana', E'кабе ба джуґала-ліла ко''рі дарасана
премананда-бгаре амі ха''ба ачетана',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'kataksana acetana padiya rahibo
apan sarir ami kabe
pasaribo?', E'катаксана ачетана падійа рахібо
апан сарір амі кабе
пасарібо?',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'uthiya smaribo punah acetana-kale
ja'' dekhinu krsnalila bhasi'' anhki-jale', E'утхійа смарібо пунах ачетана-кале
джа'' декхіну крсналіла бгасі'' анхкі-джале',
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
    v_chapter_id, '10', 10,
    E'', E'',
    E'kakuti minati kori'' baisnaba-sadane
bolibo bhakati-bindu deha'' e durjane', E'какуті мінаті корі'' баіснаба-садане
болібо бгакаті-бінду деха'' е дурджане',
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
    v_chapter_id, '11', 11,
    E'', E'',
    E'sri ananga manjarir carana sarana
e bhakativinoda asa kore'' anuksana', E'срі ананґа манджарір чарана сарана
е бгакатівінода аса коре'' ануксана',
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


  -- Song 2: Sri Guru Vaisnava Krpa
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Sri Guru Vaisnava Krpa', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Sri Guru Vaisnava
Krpa
Official Name: Ucchvasa: Prarthana Lalasmayi Song 2
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Срі Ґуру Ваіснава
Крпа
Оffічіал Наме: Уччхваса: Прартхана Лаласмайі Сонґ 2
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'After how many days will I get the mercy of the spiritual master and the
devotees, which will awaken pure love devoid of designations, in my heart?', E'',
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
    E'', E'',
    E'sri-guru-baisnaba-krpa kota dine habe
upadhi-rahita-rati
citte upajibe', E'срі-ґуру-баіснаба-крпа кота діне хабе
упадгі-рахіта-раті
чітте упаджібе',
    E'', E'',
    E'When, oh when will my perfect spiritual body become manifest so that a
confidential girlfriend of Sri Radha will show me the
conjugal pastimes of the Divine Couple?', E'',
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
    E'', E'',
    E'kabe siddha-deha mor haibe prakasa
sakhi dekhaibe more jugala-bilasa', E'кабе сіддга-деха мор хаібе пракаса
сакхі декхаібе море джуґала-біласа',
    E'', E'',
    E'In an instant I will take on the form of a mad woman, and will rush to the kadamba forest, renouncing all of my family members.', E'',
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
    E'', E'',
    E'dekhite dekhite rupa hoibo
batula
kadamba-kanane ja''bo tyaji'' jati
kula', E'декхіте декхіте рупа хоібо
батула
кадамба-канане джа''бо тйаджі'' джаті
кула',
    E'', E'',
    E'When will I then experience the awakening of the eight sattvika
ecstatic symptoms such as perspiring, shivering, jubilation, tears, fading away
of bodily color, complete devastation, stupor, and choked voice?', E'',
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
    E'sveda kampa pulakasru baibarnya praloy
stambha swarabheda kabe hoibe udoy', E'сведа кампа пулакасру баібарнйа пралой
стамбга сварабгеда кабе хоібе удой',
    E'', E'',
    E'I will behold that spiritual abode of Vrndavana-dhama
with these very eyes and, becoming the humble maidservant of a sakhi, I will serve those two Persons.', E'',
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
    E'bhavamoy brndabana heribo nayane
sakhira kinkori ho''ye sevibo
du''jane', E'бгавамой брндабана херібо найане
сакхіра кінкорі хо''йе севібо
ду''джане',
    E'', E'',
    E'When will I ever be able to come into the very presence of Srila
Narottama dasa Thakura, and when will the mellows
he expressed in his book "Prarthana" enter
into my heart?', E'',
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
    E'kabe narottama-saha saksat hoibe
kabe ba prarthana-rasa citte prevesibe', E'кабе нароттама-саха саксат хоібе
кабе ба прартхана-раса чітте превесібе',
    E'', E'',
    E'Rejecting any love or attachment for anything else, this servant of the servant
of Lord Caitanya begs the guru and the Vaisnavas for the blessing of devotional inclination
towards Him only.
REMARKS/EXTRA INFORMATION:
No Extra Information available for this song!', E'',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'caitanya-daser das chadi'' anya
rati
karayudi'' mage aj sri-caitanya mati', E'чаітанйа-дасер дас чхаді'' анйа
раті
карайуді'' маґе адж срі-чаітанйа маті',
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


  -- Song 3: Amare Mon Bhagya Kota
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Amare Mon Bhagya Kota', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Amar Emon Bhagya Kota Dine Ha''be
Official Name: Ucchvasa: Prarthana Lalasmayi Song 3
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Амар Емон Бхаґйа Кота Діне Ха''бе
Оffічіал Наме: Уччхваса: Прартхана Лаласмайі Сонґ 3
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'After how may days will my good fortune dawn when a Vaisnava
will consider me to be his very own property?', E'',
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
    E'', E'',
    E'amar emon bhagya
kota dine ha''be
amare apan boli''
janibe baisnabe', E'амар емон бгаґйа
кота діне ха''бе
амаре апан болі''
джанібе баіснабе',
    E'', E'',
    E'By drinking the honey-wine ambrosia that has washed the lotus feet of my Divine
spiritual master, I will become madly intoxicated and will sing wildly about
the glorious qualities of Lord Krsna in Vrndavana.', E'',
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
    E'', E'',
    E'sri-guru-caranamrta-madhvika-sevane
matta
ho''ye krsna-guna gabo brndabane', E'срі-ґуру-чаранамрта-мадгвіка-севане
матта
хо''йе крсна-ґуна ґабо брндабане',
    E'', E'',
    E'I will abandon the company of all fruitive actors,
speculators, those who are envious of Krsna, as well
as those who have turned away from the Lord, despising them as being
insignificant.', E'',
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
    E'', E'',
    E'karmi,
jnani, krsna-dvesi bahirmukha-jana
ghrna
kori'' akincane koribe barjana', E'кармі,
джнані, крсна-двесі бахірмукха-джана
ґгрна
корі'' акінчане корібе барджана',
    E'', E'',
    E'The smarta brahmanas who
are simply after dull, materialistic fruitive results
will conclude that I am a very agitated person and bereft of any proper
behavior.', E'',
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
    E'karma-jada-smarta-gana koribe siddhanta
acara-rohita nitanta asanta', E'карма-джада-смарта-ґана корібе сіддганта
ачара-рохіта нітанта асанта',
    E'', E'',
    E'Such puffed-up scholars, who are actually impersonalist
speculators, will then renounce my association, considering me to be completely
mad.', E'',
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
    E'batula
boliya more panditabhimani
tyajibe
amar sanga mayavadi jnani', E'батула
болійа море пандітабгімані
тйаджібе
амар санґа майаваді джнані',
    E'', E'',
    E'Seeing me thus bereft of all bad association, the most virtuous true devotee of
the Lord will then show his kindness to me by embracing me in great affection.', E'',
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
    E'kusanga-rohita dekhi'' baisnaba-sujana
krpa kori'' amare dibena
alingana', E'кусанґа-рохіта декхі'' баіснаба-суджана
крпа корі'' амаре дібена
алінґана',
    E'', E'',
    E'Thus touching the body of the devotee this most wicked and rejected person will
joyfully experience all the eight transcendental ecstatic sattvika
transformations.
REMARKS/EXTRA INFORMATION:
No
Extra Information available for this song!
10, 2009', E'',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'sparsiya
baisnaba-deha e durjana
char
anande
lobhibe kabe sattvika bikar', E'спарсійа
баіснаба-деха е дурджана
чхар
ананде
лобгібе кабе саттвіка бікар',
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


  -- Song 4: Caitanya Candrer Lila
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Caitanya Candrer Lila', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Caitanya Candrer Lila Samudra Apar
Official Name: Ucchvasa: Prarthana Lalasmayi Song 4
Author: Bhaktivinoda Thakura
Book Name: Kalyana Kalpataru
Language: Bengali', E'Сонґ Наме: Чаітанйа Чандрер Ліла Самудра Апар
Оffічіал Наме: Уччхваса: Прартхана Лаласмайі Сонґ 4
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'The essence of this narration is that no one can possibly have the power to
understand the unfathomable ocean of Lord Caitanya-Candra''s transcendental
pastimes.', E'',
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
    E'', E'',
    E'caitanya-candrer
lila-samudra apar
bujhite sakti nahi, ei
katha sar', E'чаітанйа-чандрер
ліла-самудра апар
буджхіте сакті нахі, еі
катха сар',
    E'', E'',
    E'The incomprehensible truth revealed in the scriptures is my Lord Sri Krsna. Who
has the power to understand the limit of His transcendental pastimes?', E'',
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
    E'', E'',
    E'sastrer agamya tattwa sri
krsna amar
tanra lila-anta bujhe
sakati kahar', E'састрер аґамйа таттва срі
крсна амар
танра ліла-анта буджхе
сакаті кахар',
    E'', E'',
    E'So then why are foolish persons discussing and deliberating the revealed
scriptures? They are not reaching to the end due to the simple reason that they
have not accepted the transcendental pastimes of Lord Gauranga.', E'',
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
    E'', E'',
    E'tabe murkha jana keno sastra
bicariya
gaura-lila nahi mane anta
na paiya', E'табе муркха джана кено састра
бічарійа
ґаура-ліла нахі мане анта
на паійа',
    E'', E'',
    E'Which scripture sings of the limit of the unlimited? I simply laugh when I hear
them say that Krsna is subordinate to and limited by the descriptions of the
sastra.', E'',
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
    E'ananter anta ache, kon
sastre gay?
sastradhina krsna, iha
suni'' hasi pay', E'анантер анта ачхе, кон
састре ґай?
састрадгіна крсна, іха
суні'' хасі пай',
    E'', E'',
    E'The Supreme Lord Krsna has now become fair-complexioned, and according to His
own sweet will has descended along with His Vaikuntha abode in Navadvipa-dhama.', E'',
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
    E'krsna hoibena gora iccha
ho''lo tanra
sabaikuntha nabadvipe hoila
abatara', E'крсна хоібена ґора іччха
хо''ло танра
сабаікунтха набадвіпе хоіла
абатара',
    E'', E'',
    E'When Krsna comes to deliver all the fallen souls, then all of His associates and
followers also come with Him to the surface of the earth.', E'',
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
    E'jakhan asena krsna jiba
uddharite
sange sab sahacar ase
prtivite', E'джакхан асена крсна джіба
уддгаріте
санґе саб сахачар асе
пртівіте',
    E'', E'',
    E'Along with His fair incarnation His own devotees Jaya and Vijaya have also
appeared in Navadvipa in the mood of being the enemy of the Lord.', E'',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'gora abatare tanra sri
jaya-bijaya
nabadvipe satru-bhave hoilo
udoy', E'ґора абатаре танра срі
джайа-біджайа
набадвіпе сатру-бгаве хоіло
удой',
    E'', E'',
    E'In many previous incarnations they had also been born as demons, but the
revealed scriptures say that they have taken birth in a brahmana family in
Gauranga-lila.', E'',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'purve purve abatare asura
achilo
sastre bole pandita hoiya
janamila', E'пурве пурве абатаре асура
ачхіло
састре боле пандіта хоійа
джанаміла',
    E'', E'',
    E'The smrti scriptures say that they become absorbed in a fighting spirit with
Lord Gauracandra, manifesting enmity and hostility.', E'',
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
    v_chapter_id, '10', 10,
    E'', E'',
    E'smrti-tarka-sastre bole
bairi prakasiya
goracandra-saha rana korilo
matiya', E'смрті-тарка-састре боле
баірі пракасійа
ґорачандра-саха рана коріло
матійа',
    E'', E'',
    E'Therefore it is a fact that all the residents of Navadvipa whether friendly or
inimical, are eternally nourishing the development of Lord Caitanya''s pastime.', E'',
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
    v_chapter_id, '11', 11,
    E'', E'',
    E'ataeva nabadvipa-basi jata
jana
sri-caitanya-lila-pusti
kore anuksana', E'атаева набадвіпа-басі джата
джана
срі-чаітанйа-ліла-пусті
коре ануксана',
    E'', E'',
    E'I know that these enemies of Lord Caitanya, coming from brahmana background,
are actually assistants for giving nourishment to Lord Caitanya''s pastime.', E'',
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
    v_chapter_id, '12', 12,
    E'', E'',
    E'ekhon je brahmakule
caitnyer ari
ta''ke jani caitanyer
lila-pustikari', E'екхон дже брахмакуле
чаітнйер арі
та''ке джані чаітанйер
ліла-пустікарі',
    E'', E'',
    E'I have thus prostrated myself at the lotus feet of all of the enemies as well
as friends who are accompanying Lord Caitanya during His lila.', E'',
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
    v_chapter_id, '13', 13,
    E'', E'',
    E'sri-caitanya-anucara
satru-mitra jata
sakaler sri-carane hoilama
nata', E'срі-чаітанйа-анучара
сатру-мітра джата
сакалер срі-чаране хоілама
ната',
    E'', E'',
    E'All of you eternal associates kindly show your mercy to this servant and please
make his devotion to Lord Caitanya become completely fixed up.
REMARKS/EXTRA INFORMATION:
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
    v_chapter_id, '14', 14,
    E'', E'',
    E'tomara koroho krpa e daser
prati
caitanya sudrdha koro
binoder mati', E'томара корохо крпа е дасер
праті
чаітанйа судрдга коро
бінодер маті',
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


  -- Song 5: Kabe Mor Mudha Mana Chadi
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Kabe Mor Mudha Mana Chadi', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Kabe Mor Mudha
Mana Chadi Anya Dhyana
Official Name: Ucchvasa: Prarthana Lalasmayi Song 5
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Кабе Мор Мудга
Мана Чхаді Анйа Дхйана
Оffічіал Наме: Уччхваса: Прартхана Лаласмайі Сонґ 5
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) When, oh when will my
foolish ass-like mind finally attain a place to rest at the lotus feet of Lord Krsna, rejecting all other meditation?
2) When will I finally
understand my own worthlessness? Actually there is not other soul who is lower
than me.
3) When will I offer my
respectful obeisances unto all the untouchables?
Submitting prayers unto them I will humbly beg for a drop of devotion to Lord Krsna.
4) And when will I finally
exhibit real compassion to all living entities? Seeing the degradation of the
conditioned souls I will fall to the ground weeping.
5) Weeping and weeping, I
will sadly go to Sri Vrndavana, and I will take
shelter of a Vaisnava in that abode of Vraja.
6) Standing before a
resident of Vraja I will grasp both of his hands and
will question him intensively about all the holy places of the Lord''s pastimes
there.
7) I will say: "Oh
resident of Vraja! Please exhibit your favor to me
and kindly show me where all the pastimes of Hari had
taken place."
8) Then, with a gracious
heart, some resident of the dhama will personally
take me within the depths of the forest.
9) He will say: "Just
look there! That is the kadamba grove in which the
delightful Son of Maharaja Nanda sported the rasa dance."
10) "Look! Here is Nanda-grama, which is the residence of Nanda
Maharaja. Look! Here is where Lord Balarama sported
His own rasa dance."
11) "Look! Here is
where Lord Krsna stole the clothes of all the gopis as they bathed. And just see this place! It is where
the demon Bakasura met his fate."
12) In this fashion I will
behold all of the places of pastimes in Vrndavana
with my intensely thirsty eyes in the company of the residents of Vraja.
13) I ever I hear the
vibration of a flute upon the banks of the Yamuna river, then becoming ecstatically overwhelmed I will fall
senseless upon the earth.
14) Chanting the holy
names, "Krsna, Krsna"
into my ears, then the all merciful residents of Vraja
will take a palmful of Yamuna
water and make me drink.
15) By hearing the holy
names being vibrated and again becoming conscious, I will then continue
wandering about in the company of the Brijbasis.
16) When, oh when will such
auspicious days be mine? Begging like a bee (madhukori)
I will wander from door to door.
17) I will drink a little
water from the Yamuna, filling my palm. And at night
I will go to sleep by the door of some temple I happen to wander near.
18) Then that time will
come when this material body will become a tasty feast for all of the aquatics.
(When it is thrown into the river at the time of death.)
19) Then, living eternally
in my spiritual body, at the feet of a gopi in her own grove, I will finally serve my greatly treasured
Lord Krsna.
20) Oh Jahnava
Devi! Please show your causeless mercy to me now!
This is all that is prayed for today by this desperate, worthless sinner.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'kabe mor mudha mana
chadi anya dhyana
sri-krsna-carane pabe bisramer sthana', E'кабе мор мудга мана
чхаді анйа дгйана
срі-крсна-чаране пабе бісрамер стхана',
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
    E'', E'',
    E'kabe ami janibo apane
akincana
amar apeksa ksudra nahi
anya jana', E'кабе амі джанібо апане
акінчана
амар апекса ксудра нахі
анйа джана',
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
    E'', E'',
    E'kabe ami acandale koribo
pranati
krsna-bhakti magi
laba koriya minati', E'кабе амі ачандале корібо
пранаті
крсна-бгакті маґі
лаба корійа мінаті',
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
    E'sarva-jibe doya mor kotadine
habe
jiber durgati dekhi lotaka
padipe', E'сарва-джібе дойа мор котадіне
хабе
джібер дурґаті декхі лотака
падіпе',
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
    E'kandite kandite ami jabo
brndabana
brajadhame baisnaber loibo sarana', E'кандіте кандіте амі джабо
брндабана
браджадгаме баіснабер лоібо сарана',
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
    E'brajabasi-sannidhane
judi dui kar
jijnasibo lila-sthana hoiya katar', E'браджабасі-саннідгане
джуді дуі кар
джіджнасібо ліла-стхана хоійа катар',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'ohe brajabasi! more anugraha kori
dekhao kothay lila korilena
hari', E'охе браджабасі! море ануґраха корі
декхао котхай ліла корілена
харі',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'tabe kon braja-jana sakrpa-antare
amare jabena loye bipina-bhitore', E'табе кон браджа-джана сакрпа-антаре
амаре джабена лойе біпіна-бгіторе',
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
    v_chapter_id, '10', 10,
    E'', E'',
    E'bolibena, dekho ei kadamba-kanana
jatha rasalila koila brajendranandana', E'болібена, декхо еі кадамба-канана
джатха расаліла коіла браджендранандана',
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
    v_chapter_id, '11', 11,
    E'', E'',
    E'ai dekho nandagrama nander avasa
ai dekho baladeva jatha koilo rasa', E'аі декхо нандаґрама нандер аваса
аі декхо баладева джатха коіло раса',
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
    v_chapter_id, '12', 12,
    E'', E'',
    E'ai dekho jatha hoilo
dukula-harana
ai sthane bakasura hoilo nidhana', E'аі декхо джатха хоіло
дукула-харана
аі стхане бакасура хоіло нідгана',
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
    v_chapter_id, '13', 13,
    E'', E'',
    E'eirupe braja-jana-saha brndabane
dekhibo lilar sthana satrsna-nayane', E'еірупе браджа-джана-саха брндабане
декхібо лілар стхана сатрсна-найане',
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
    v_chapter_id, '14', 14,
    E'', E'',
    E'kabhu ba jamuna tire suni'' bamsi-dhvani
abasa hoiya labha koribo
dharani', E'кабгу ба джамуна тіре суні'' бамсі-дгвані
абаса хоійа лабга корібо
дгарані',
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
    v_chapter_id, '15', 15,
    E'', E'',
    E'krpamoy braja-jana ''krsna krsna'' boli''
pana koraibe jal puriya
anjali', E'крпамой браджа-джана ''крсна крсна'' болі''
пана кораібе джал пурійа
анджалі',
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
    v_chapter_id, '16', 16,
    E'', E'',
    E'harinama sune punah paiya
cetana
braja-jana-saha ami koribo bhramana', E'харінама суне пунах паійа
четана
браджа-джана-саха амі корібо бграмана',
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
    v_chapter_id, '17', 17,
    E'', E'',
    E'kabe heno subhadina hoibe amar
madhukori kori'' bedaibo dvar
dvar', E'кабе хено субгадіна хоібе амар
мадгукорі корі'' бедаібо двар
двар',
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
    v_chapter_id, '18', 18,
    E'', E'',
    E'jamuna-salila pibo anjali bhariya
devadvare ratri-kale rohibo suiya', E'джамуна-саліла пібо анджалі бгарійа
девадваре ратрі-кале рохібо суійа',
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
    v_chapter_id, '19', 19,
    E'', E'',
    E'jakhan asibe kala e bhautika
pura
jalajantu-mahotsava
hoibe pracura', E'джакхан асібе кала е бгаутіка
пура
джаладжанту-махотсава
хоібе прачура',
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
    v_chapter_id, '20', 20,
    E'', E'',
    E'siddha dehe nija-kunje sakhira carane
nityakala thakiya sevibo krsna-dhane', E'сіддга дехе ніджа-кундже сакхіра чаране
нітйакала тхакійа севібо крсна-дгане',
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
    v_chapter_id, '21', 21,
    E'', E'',
    E'ei se praithana kore'' e pamara char
sri jahnava more doyakoro'' eibar', E'еі се праітхана коре'' е памара чхар
срі джахнава море дойакоро'' еібар',
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


  -- Song 6: Hari Hari (15)
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Hari Hari (15)', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Hari Hari Kabe Mora Hobe Heno Dina
Official Name: Ucchvasa: Prarthana Lalasmayi Song 6
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Харі Харі Кабе Мора Хобе Хено Діна
Оffічіал Наме: Уччхваса: Прартхана Лаласмайі Сонґ 6
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Oh my Lord Hari, when will such a day be mine?
Developing love and attachment for a pure devotee, my material desires will
thereby become weakened and subdued.', E'',
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
    E'', E'',
    E'hari hari kabe mora
ho''be heno dina
bimala baisnabe,rati upajibe,
basana hoihe ksina', E'харі харі кабе мора
хо''бе хено діна
бімала баіснабе,раті упаджібе,
басана хоіхе ксіна',
    E'', E'',
    E'However I feel in the core of my heart, I will behave accordingly, totally free
from duplicity. Without expecting any respect, I will give all honor unto others. I will constantly remain absorbed in
ecstatic remembrance of the Lord by performing the congregational chanting of
His holy names.', E'',
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
    E'', E'',
    E'antara-bahire, sama byavahara,
amani manda ho''bo
krsna-sankirtane,
sri-krsna-smarane,
satata majiya ro''bo', E'антара-бахіре, сама бйавахара,
амані манда хо''бо
крсна-санкіртане,
срі-крсна-смаране,
сатата маджійа ро''бо',
    E'', E'',
    E'Just to pass this life I will perform only whatever minimum activity is
required to maintain this body, and I will become attached only to that which
is favorable for the worship of Lord Krsna.', E'',
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
    E'', E'',
    E'e deher kriya,
abyase koribo,
jibana japana lagi''
sri-krsna-bhajane,anukula jaha,
tahe ho''bo anuragi', E'е дехер крійа,
абйасе корібо,
джібана джапана лаґі''
срі-крсна-бгаджане,анукула джаха,
тахе хо''бо анураґі',
    E'', E'',
    E'I will forcibly reject whatever is unfavorable for His worship. Thus worshiping
and worshiping, the time has come that I have to give up this body.', E'',
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
    E'bhajaner jaha,pratikula taha,
drdhabhave teyagibo
bhajite bhajite,samaya asile,
e deha chadiya
dibo', E'бгаджанер джаха,пратікула таха,
дрдгабгаве тейаґібо
бгаджіте бгаджіте,самайа асіле,
е деха чхадійа
дібо',
    E'', E'',
    E'These are the hopes of Bhaktivinoda while living
within the forest of Godruma. Hiding in secrecy, he continuously weeps with an
extremely eager heart only for the purpose of receiving the causeless mercy of
the Supreme Lord.
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
    v_chapter_id, '6', 6,
    E'', E'',
    E'bhakatibinoda, ei asa kori'',
basiya godruma-bane
prabhu-krpa lagi'',byakula antare,
sada kande sangopane', E'бгакатібінода, еі аса корі'',
басійа ґодрума-бане
прабгу-крпа лаґі'',бйакула антаре,
сада канде санґопане',
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


  -- Song 7: Kabe Mui Vaisnava Cinibo
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Kabe Mui Vaisnava Cinibo', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Kabe Mui Vaisnava Cinibo
Official Name: Ucchvasa: Prarthana Lalasmayi Song 7
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Кабе Муі Ваіснава Чінібо
Оffічіал Наме: Уччхваса: Прартхана Лаласмайі Сонґ 7
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) Oh my Lord Hari, when will I ever be able to realize who is actually a
real Vaisnava, the lotus feet of whom are like a mine
of all-auspiciousness? When will I become madly overwhelmed by holding such
lotus feet within the core of my heart?
2) Such a revered devotee
is always transcendental, free from all faults, and fully joyful in spiritual
bliss. Being lovingly attached to the holy name of the Lord, and always
disinterested and callous towards worldly interests, he is always melted with
compassion for all souls.
3) Devoid of any trace of
false ego, fully experienced and expert in bhajana,
the pure devotee is completely detached from all types of sense objects. He is
always straightforward and sincere both internally and externally, and he is
completely attracted to relishing the eternal pastimes of the Lord.
4) I discriminate between
the three types of Vaisnavas, namely the kanistha (beginning neophyte), the madhyama
(middle class), and the uttama (highest pure
devotee). I respect the kanistha, I offer my
respectful obeisances unto the madhyama,
and I fully submit myself to hearing from the uttama.
5) At that time, when I
learn to properly honor such a pure devotee, recognizing his real quality, then
only i will certainly achieve all spiritual
perfection by his mercy.
6) Bhaktivinoda
always keeps a vow to abstain from speaking any type of envious blasphemy unto
such a pure devotee, whose life and characteristics are in all ways pure.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'kabe mui vaisnava cinibo
hari hari
vaisnava carana, kalyaner khani,
matibo hrdaye dhori''', E'кабе муі ваіснава чінібо
харі харі
ваіснава чарана, калйанер кхані,
матібо хрдайе дгорі''',
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
    E'', E'',
    E'baisnava-thakura aprakrta sada,
nirdosa, anandamoy
krsna-name priti jade udasina,
jibete dayardra hoy', E'баіснава-тхакура апракрта сада,
нірдоса, анандамой
крсна-наме пріті джаде удасіна,
джібете дайардра хой',
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
    E'', E'',
    E'abhimanahina, bhajana
bisayete anasakta
antara-bahire, niskapata sada,
nitya-lila-anurakta', E'абгіманахіна, бгаджана
бісайете анасакта
антара-бахіре, ніскапата сада,
нітйа-ліла-ануракта',
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
    E'kanistha, madhyama, uttama prabhede,
vaisnava trividha gani
kanisthe adara, madhyame pranati,
uttame susrusa suni', E'каністха, мадгйама, уттама прабгеде,
ваіснава трівідга ґані
каністхе адара, мадгйаме пранаті,
уттаме сусруса суні',
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
    E'je jena baisnaba, ciniya loiya,
adara koribo jabe
vaisnaver krpa,j ahe sarva-siddhi,
avasya paibo tabe', E'дже джена баіснаба, чінійа лоійа,
адара корібо джабе
ваіснавер крпа,дж ахе сарва-сіддгі,
авасйа паібо табе',
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
    E'vaisnava caritra, sarvada pavitra,
jei ninde himsa
kori''
bhakativinoda, na'' sambhase
ta''re
thake sada mauna
dhori''', E'ваіснава чарітра, сарвада павітра,
джеі нінде хімса
корі''
бгакатівінода, на'' самбгасе
та''ре
тхаке сада мауна
дгорі''',
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


  -- Song 8: Krpa Koro Vaisnava Thakura
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Krpa Koro Vaisnava Thakura', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Krpa Koro Vaisnava Thakura
Official Name: Ucchvasa: Prarthana Lalasmayi Song 8
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Крпа Коро Ваіснава Тхакура
Оffічіал Наме: Уччхваса: Прартхана Лаласмайі Сонґ 8
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) O Vaisnava
Thakura! Please give me your mercy  knowledge of my
relationship with Bhagavan and the ability to do bhajana, sending my false ego far away.
2) If I think "I am a Vaisnava," then I will never become humble. My heart
will become contaminated with the hope of receiving honor from others, and I
will surely go to hell.
3) Give me the mercy that I
can renounce the false conception of my being guru and can be your servant. Let
me accept without duplicity your remnants and your foot-bath water.
4) By thinking that I am
superior (guru) and giving my remnants to others, I will bring about my destruction.
Let me always identify as your disciple and not accept any worship or praise
from others.
5) In this way I can
renounce the desire for honor for myself and can offer respect to others.
Weeping sincerely at your lotus feet and rolling on the ground, I pray that you
will give me the ability to chant nama
purely.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'kṛpā koro vaiṣṇava ṭhākura, sambandha jāniyā
bhajite bhajite, abhimāna hau dūra', E'кр̣па̄ коро ваішн̣ава т̣ха̄кура, самбандга джа̄нійа̄
бгаджіте бгаджіте, абгіма̄на хау дӯра',
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
    E'', E'',
    E'''āmi to vaiṣṇava'',
e buddhi hoile, amānī nā ho''bo āmi
pratiṣthāśā āsi'', hṛdoya dūṣibe, hoibo niraya-gāmī', E'''а̄мі то ваішн̣ава'',
е буддгі хоіле, ама̄нı̄ на̄ хо''бо а̄мі
пратіштха̄ш́а̄ а̄сі'', хр̣дойа дӯшібе, хоібо нірайа-ґа̄мı̄',
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
    E'', E'',
    E'tomāra kińkora, āpane jānibo, ''guru''-abhimāna
tyaji''
tomāra ucchiṣṭha, pada-jala-reṇu,
sadā niṣkapaṭe
bhaji', E'тома̄ра кіńкора, а̄пане джа̄нібо, ''ґуру''-абгіма̄на
тйаджі''
тома̄ра уччхішт̣ха, пада-джала-рен̣у,
сада̄ нішкапат̣е
бгаджі',
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
    E'''nije śreṣṭha''
jani, ucchiṣṭthādi
dāne, ho''be abhimāna bhāra
tāi śiṣya taba, thākiyā sarvadā, nā loibo pūjā
kā''r', E'''нідже ш́решт̣ха''
джані, уччхішт̣тха̄ді
да̄не, хо''бе абгіма̄на бга̄ра
та̄і ш́ішйа таба, тха̄кійа̄ сарвада̄, на̄ лоібо пӯджа̄
ка̄''р',
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
    E'amānī mānada, hoile kīrtane, adhikāra dibe tumi
tomāra caraṇe, niṣkapaṭe
āmi, kāńdiyā
luṭibo bhūmi', E'ама̄нı̄ ма̄нада, хоіле кı̄ртане, адгіка̄ра дібе тумі
тома̄ра чаран̣е, нішкапат̣е
а̄мі, ка̄ńдійа̄
лут̣ібо бгӯмі',
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


  -- Song 9: Kabe Habe Heno Dasa Mor
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 9, E'Kabe Habe Heno Dasa Mor', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Kabe Habe Heno Dasa
Mor
Official Name: Ucchvasa: Prarthana Lalasmayi Song 9; Navadvipa Bhajana Kutir
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Кабе Хабе Хено Даса
Мор
Оffічіал Наме: Уччхваса: Прартхана Лаласмайі Сонґ 9; Навадвіпа Бхаджана Кутір
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'When, oh when will such a condition be mine? Renouncing all of my mundane desires
which are giving rise to various types of bondage, I will give up this dark,
ghastly material existence.', E'',
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
    E'', E'',
    E'kabe ha''be heno dasa
mor
tyaji'' jada asa, bividha
bandhana,
chadibo samsar ghor', E'кабе ха''бе хено даса
мор
тйаджі'' джада аса, бівідга
бандгана,
чхадібо самсар ґгор',
    E'', E'',
    E'I will build my small hut at Navadvipa-dhama, seeing
the land as being non-different from Vrndavana-dhama.
There I will finally establish my relationship under the shelter of the lotus
feet of the Son of Mother Saci.', E'',
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
    E'', E'',
    E'brndabanabhede, nabaddvipa-dhame,
bandhibo kutirakhani
sacir nandana-carana-asroy
koribo sambandha mani''', E'брндабанабгеде, набаддвіпа-дгаме,
бандгібо кутіракхані
сачір нандана-чарана-асрой
корібо самбандга мані''',
    E'', E'',
    E'Living in a solitary place in a spiritually conscious forest on the banks of
the Ganga, I will incessantly drink the pure nectar of Krsna''s name, and I will loudly shout the name of Gauranga thus:', E'',
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
    E'', E'',
    E'jahnavi-puline, cinmoy-kanane,
basiya bijana-sthale
krsna-namamrta, nirantara pibo,
dakibo ''gauranga'' bo''le', E'джахнаві-пуліне, чінмой-канане,
басійа біджана-стхале
крсна-намамрта, нірантара пібо,
дакібо ''ґауранґа'' бо''ле',
    E'', E'',
    E'"Oh Gaura-Nitai! You two Brothers are the only
true friend of all the fallen souls! I am the lowest of the low, most fallen
and wicked-minded, so kindly bestow Your ocean of
mercy upon me.', E'',
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
    E'ha gaura-nitai, tora du''ti bhai,
patita-janer bandhu
adhama patita, ami he durjana,
hao more krpa sindhu', E'ха ґаура-нітаі, тора ду''ті бгаі,
патіта-джанер бандгу
адгама патіта, амі хе дурджана,
хао море крпа сіндгу',
    E'', E'',
    E'Thus repeatedly sobbing and calling out, I will roam all over the abode of 32
square miles, sometimes on one bank of the Ganga and sometime on the other. And sometimes, while
wandering about, if I ever receive a drop of good fortune, I may suddenly
glance over at the base of a tree (and behold some vision there )', E'',
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
    E'kandite kandite, sola-krosa-dhama,
jahnavi ubhoy kule
bhramite bhramite, kabhu bhagya-phale,
dekhi kuchu taru-mule', E'кандіте кандіте, сола-кроса-дгама,
джахнаві убгой куле
бграміте бграміте, кабгу бгаґйа-пхале,
декхі кучху тару-муле',
    E'', E'',
    E'I will blurt out: "Ha Ha, how wonderful! What
amazing thing have I seen now?!!", and I will faint senseless on the spot.
Regaining consciousness later, I will hide and weep secretly, remembering that
all this ecstasy is due to receiving just a tiny speck of Sri Sri Gaura-Nitai''s mercy.
REMARKS/EXTRA INFORMATION:
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
    v_chapter_id, '7', 7,
    E'', E'',
    E'ha ha manohara,
ki dekhinu ami,
boliya murchita ho''bo
samvit paiya, kandibo gopane,
smari dunhu krpa-laba', E'ха ха манохара,
кі декхіну амі,
болійа мурчхіта хо''бо
самвіт паійа, кандібо ґопане,
смарі дунху крпа-лаба',
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


  -- Song 10: Ha Ha Mora Gaura Kisora
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 10, E'Ha Ha Mora Gaura Kisora', E'', 'verses', true)
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
    E'', E'',
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
    translation_en = EXCLUDED.translation_en;


  -- Song 11: Ha Ha Kabe Gaura Nitai
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 11, E'Ha Ha Kabe Gaura Nitai', E'', 'verses', true)
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
    E'', E'',
    E'ha ha kabe gaura-nitai
e patita-jane,uru krpa
kori''
dekha dibe du''ti bhai', E'ха ха кабе ґаура-нітаі
е патіта-джане,уру крпа
корі''
декха дібе ду''ті бгаі',
    E'', E'',
    E'1) Alas, alas! When, oh
when will the two Brothers Gaura-Nitai show Themselves to this most fallen
person, thus exhibiting Their causeless mercy?
2) By the power of the mercy
of Them both, I will see the transcendental splendor of Vraja at Navadvipa. My
mind being charmed thus at my residence at Ananda-sukhada-kunja, I will behold
such wondrous thing with my very eyes.
3) Just nearby to my kutir
is Lalita-kunda, surrounded by hundreds and thousands of bejewelled altars. At
that place Sri Radha-Krsna can be seen, continuously sporting there as They
expand Their pastimes.
4) All of Their
confidential girlfriends are also there assisting the pastimes by performing
various services for the pleasure of Their Lordships. This maidservant is also
there, busy running here and there on the orders of the sakhis.
5) Stringing a garland of
malati flowers, I will bring it and place it into the hands of a sakhi. She
will place it around the necks of Sri Radha-Krsna, and I will dance, filled
with ecstasy.
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
    E'', E'',
    E'dunhu-krpa-bale,navadvipa-dhame,
dekhibo brajer sobha
ananda-sukhada-kunja
mahohara,
heribo nayana-lobha', E'дунху-крпа-бале,навадвіпа-дгаме,
декхібо браджер собга
ананда-сукхада-кунджа
махохара,
херібо найана-лобга',
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
    E'', E'',
    E'tahar nikate,
sri-lalita-kunda,
ratna-bedi kota sata
jatha radha-krsna,lila
bistariya,
biharena abirata', E'тахар нікате,
срі-лаліта-кунда,
ратна-беді кота сата
джатха радга-крсна,ліла
бістарійа,
біхарена абірата',
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
    E'', E'',
    E'sakhigana jatha,lilar
sahay,
nana seba-sukha pay
e dasi tathay,sakhira
ajnate,
karye iti-uti dhay', E'сакхіґана джатха,лілар
сахай,
нана себа-сукха пай
е дасі татхай,сакхіра
аджнате,
карйе іті-уті дгай',
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
    E'malatir mala,ganthiya
anibo,
dibo tabe sakhi-kare
radha-krsna-gale,sakhi
paraibe,
nacibo ananda-bhare', E'малатір мала,ґантхійа
анібо,
дібо табе сакхі-каре
радга-крсна-ґале,сакхі
параібе,
начібо ананда-бгаре',
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


  -- Song 12: Kabe Aha Gauranga Boliya
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 12, E'Kabe Aha Gauranga Boliya', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Kabe Aha Gauranga Boliya
Official Name: Ucchvasa: Prarthana Lalasmayi Song 12
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Кабе Аха Ґауранґа Болійа
Оffічіал Наме: Уччхваса: Прартхана Лаласмайі Сонґ 12
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Alas what sorrow I am expressing! When will I ever take the name of Gauranga and become disgusted with sense gratification,
giving up all bodily endeavors for eating and sleeping?', E'',
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
    E'', E'',
    E'kabe aha gauranga boliya
bhojane-sayane,deher jatana,
chadibo birakta hana', E'кабе аха ґауранґа болійа
бгоджане-сайане,дехер джатана,
чхадібо біракта хана',
    E'', E'',
    E'And when will ever wander from village to village in Sri Navadvipa-dhama,
completely giving up my false ego? I will beg madhukari
from the homes of dhama-basis, and thus I will fill
my belly.', E'',
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
    E'', E'',
    E'nabadvipa dhame,nagare nagare,
abhiman parihari''
dhamabasi-ghare,madhukari lobo''
khaibo udar bhari''', E'набадвіпа дгаме,наґаре наґаре,
абгіман паріхарі''
дгамабасі-ґгаре,мадгукарі лобо''
кхаібо удар бгарі''',
    E'', E'',
    E'Sometimes I will wander to the bank of the Ganga, and if I feel thirsty, then I will drink that
sacred water that has washed the lotus feet of the Lord, palmful
by palmful. If I fell tired, I will simply fall down
under the nearest tree. When I feel enough strength, i
will give up my idleness and continue wandering here and there.', E'',
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
    E'', E'',
    E'nadi-tate giya,anjali anjali,
pibo prabhu-pada-jala
taru-tale podi''alasya tyajibo,
paibo sarire bala', E'наді-тате ґійа,анджалі анджалі,
пібо прабгу-пада-джала
тару-тале поді''аласйа тйаджібо,
паібо саріре бала',
    E'', E'',
    E'In a mood of humble solicitation I will call out loudly the names of "Gaura-Gadadhara" and ''Sri-Radha-Madhava'',
and thus weeping and weeping I will wander throughout the entire dhama.', E'',
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
    E'kakuti koriya,''gaura-gadadhara'',
''sri-radha-madhava''nama
kandiya kandiya,daki ucca-rabe
bhramibo sakala dhama', E'какуті корійа,''ґаура-ґададгара'',
''срі-радга-мадгава''нама
кандійа кандійа,дакі учча-рабе
бграмібо сакала дгама',
    E'', E'',
    E'Seeing a Vaisnava devotee, I will fall at his lotus
feet, knowing him to be the only true friend of my heart. Accepting me as his
servant, the most revered devotee will then reveal to me the most confidential kirtana used for worshiping the Lord.
REMARKS/EXTRA INFORMATION:
No Extra Information available for this song!', E'',
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
    E'baisnaba dekhiya,padibo carane,
hrdayer bandhu jani''
baisnaba thakura,''prabhur kirtana''
dekhaibe das mani''', E'баіснаба декхійа,падібо чаране,
хрдайер бандгу джані''
баіснаба тхакура,''прабгур кіртана''
декхаібе дас мані''',
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


  -- Section 9: Ucchvasa - Vijnapti
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 9, E'Ecstasy - Supplications', E'Уччгваса - Віджн̃апті (Екстаз - Благання)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 9;


  -- Song 1: Gopinatha (1)
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Gopinatha (1)', E'', 'verses', true)
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
    E'', E'',
    E'Song
Name: Gopinath Mama Nivedana Suno
Official
Name: Upalabdhi Vijnapti Song 1
Author:
Bhaktivinoda
Thakura
Book
Name: Kalyana
Kalpataru
Language:
Bengali
অ', E'Сонґ
Наме: Ґопінатх Мама Ніведана Суно
Оffічіал
Наме: Упалабдгі Віджнапті Сонґ 1
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Калйана
Калпатару
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Mama Nivedana Suno
1) O Gopinatha,
Lord of the gopis, please hear my request. I am a wicked materialist, always
addicted to worldly desires, and no good qualities do I possess.
2) O
Gopinatha, You are my only hope, and therefore I have taken shelter at Your
lotus feet. I am now Your eternal servant.
3) O
Gopinatha, how will You purify me? I do not know what devotion is, and my
materialistic mind is absorbed in fruitive work. I have fallen into this dark
and perilous worldly existence.
4) O
Gopinatha, everything here is Your illusory energy. I have no strength or
transcendental knowledge, and this body of mine is not independent and free
from the control of material nature.
5) O
Gopinatha, this sinner, who is weeping and weeping, begs for an eternal place
at Your divine feet. Please give him Your mercy.', E'',
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
    E'', E'',
    E'gopīnāth,
mama nivedana śuno
viṣayī durjana, sadā kāma-rata,
kichu nāhi mora guṇa', E'ґопı̄на̄тх,
мама ніведана ш́уно
вішайı̄ дурджана, сада̄ ка̄ма-рата,
кічху на̄хі мора ґун̣а',
    E'', E'',
    E'O Gopinatha, You are able to do anything, and therefore You have the power to
deliver all sinners. Who is there that is more of a sinner than myself?', E'',
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
    E'', E'',
    E'gopīnāth,
āmāra bharasā tumi
tomāra caraṇe, loinu śaraṇa,
tomāra kińkora āmi', E'ґопı̄на̄тх,
а̄ма̄ра бгараса̄ тумі
тома̄ра чаран̣е, лоіну ш́аран̣а,
тома̄ра кіńкора а̄мі',
    E'', E'',
    E'O Gopinatha, You are the ocean of mercy. Having come into this phenomenal
world, You expand Your divine pastimes for the sake of the fallen souls.
8) O
Gopinatha, I am so sinful that although all the demons attained Your lotus
feet, Bhaktivinoda has remained in worldly existence.
Remarks/ Extra Information:
This
song is to be sung in Raga Kafi in Dadra Tala.
MUSICAL
NOTATIONS:
♫
Gopinath! Mama Nivedana Suno', E'',
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
    E'', E'',
    E'gopīnāth,
kemone śodhibe more
nā jāni bhakati, karme jaḍa-mati,
porechi soḿsāra-ghore', E'ґопı̄на̄тх,
кемоне ш́одгібе море
на̄ джа̄ні бгакаті, карме джад̣а-маті,
поречхі соḿса̄ра-ґгоре',
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
    E'gopīnāth,
sakali tomāra māyā
nāhi mama bala, jñāna sunirmala,
swādīna nahe e kāyā', E'ґопı̄на̄тх,
сакалі тома̄ра ма̄йа̄
на̄хі мама бала, джн̃а̄на сунірмала,
сва̄дı̄на нахе е ка̄йа̄',
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
    E'gopīnāth,
niyata caraṇe sthāna
māge e pāmara, kāndiyā kāndiyā,
korohe karuṇā dāna', E'ґопı̄на̄тх,
нійата чаран̣е стха̄на
ма̄ґе е па̄мара, ка̄ндійа̄ ка̄ндійа̄,
корохе карун̣а̄ да̄на',
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
    E'gopīnāth,
tumi to'' sakali pāro
durjane tārite, tomāra śakati,
ke āche pāpīra āro', E'ґопı̄на̄тх,
тумі то'' сакалі па̄ро
дурджане та̄ріте, тома̄ра ш́акаті,
ке а̄чхе па̄пı̄ра а̄ро',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'gopīnāth,
tumi kṛpā-pārābāra
jīvera kāraṇe, āsiyā prapañce,
līlā koile subistāra', E'ґопı̄на̄тх,
тумі кр̣па̄-па̄ра̄ба̄ра
джı̄вера ка̄ран̣е, а̄сійа̄ прапан̃че,
лı̄ла̄ коіле субіста̄ра',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'gopīnāth,
āmi ki doṣe doṣī
asura sakala, pāilo caraṇa,
vinodá thākilo bosi''
WORD', E'ґопı̄на̄тх,
а̄мі кі доше дошı̄
асура сакала, па̄іло чаран̣а,
вінодá тха̄кіло босі''
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
    translation_en = EXCLUDED.translation_en;


  -- Song 2: Gopinatha (2)
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Gopinatha (2)', E'', 'verses', true)
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
    E'', E'',
    E'Song
Name: Gopinath Ghucao Samsara
Official
Name: Upalabdhi Vijnapti Song 2
Author:
Bhaktivinoda
Thakura
Book
Name: Kalyana
Kalpataru
Language:
Bengali
অ', E'Сонґ
Наме: Ґопінатх Ґхучао Самсара
Оffічіал
Наме: Упалабдгі Віджнапті Сонґ 2
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Калйана
Калпатару
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Ghucao Samsara Jwala
1) O
Gopinatha, please remove the torment of worldly existence. I can no longer
tolerate the pain of ignorance and the repeated succession of births and
deaths.
2) O
Gopinatha, indeed I am a servant of lust. Worldly desires are awakening in my
heart, and thus the noose of fruitive work is beginning to tighten.
3) O
Gopinatha, when will I wake up and abandon afar this enemy of lust, end when
will You manifest Yourself in my heart?
4) O
Gopinatha, I am Your devotee, but having abandoned You and thus having forgotten
my real treasure, I have worshiped this mundane world.', E'',
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
    E'', E'',
    E'gopināth,
ghucāo saḿsāra jwālā
avidyā-jātanā, āro nāhi sahe,
janama-maraṇa-mālā', E'ґопіна̄тх,
ґгуча̄о саḿса̄ра джва̄ла̄
авідйа̄-джа̄тана̄, а̄ро на̄хі сахе,
джанама-маран̣а-ма̄ла̄',
    E'', E'',
    E'O Gopinatha, You know everything. Now, having punished Your servant, please
give him a place at Your lotus feet.
6) O
Gopinatha, is this Your judgment, that seeing me averse to You, You abandon
Your servant and don''t bestow even a particle of mercy upon him?
7) O
Gopinatha, I am certainly very foolish, and I have never known what is good for
me. Therefore such is my condition.
8) O
Gopinatha, You are indeed the wisest person. Please look for a way to bring
about auspiciousness for this fool, and please do not consider this servant as
an outsider.
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
    E'', E'',
    E'gopīnāth,
āmi to'' kāmera dāsa
viṣaya-bāsanā, jāgiche hṛdoye,
phādiche karama phāsa', E'ґопı̄на̄тх,
а̄мі то'' ка̄мера да̄са
вішайа-ба̄сана̄, джа̄ґічхе хр̣дойе,
пха̄дічхе карама пха̄са',
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
    E'', E'',
    E'gopināth,
kabe vā jāgibo āmi
kāma-rūpa ari, dūre teyāgibo,
hṛdoye sphuribe tumi', E'ґопіна̄тх,
кабе ва̄ джа̄ґібо а̄мі
ка̄ма-рӯпа арі, дӯре тейа̄ґібо,
хр̣дойе спхурібе тумі',
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
    E'gopīnāth,
āmi to'' tomāra jana
tomāre chāriyā, saḿsāra bhajinu,
bhuliyā āpana-dhana', E'ґопı̄на̄тх,
а̄мі то'' тома̄ра джана
тома̄ре чха̄рійа̄, саḿса̄ра бгаджіну,
бгулійа̄ а̄пана-дгана',
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
    E'gopināth,
tumi to'' sakali jāno
āpanāra jane, daṇḍiyā ekhano,
śrī-caraṇe deho sthāno', E'ґопіна̄тх,
тумі то'' сакалі джа̄но
а̄пана̄ра джане, дан̣д̣ійа̄ екхано,
ш́рı̄-чаран̣е дехо стха̄но',
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
    E'gopīnāth,
ei ki vicāra taba
bimukha dekhiyā, chāro nija-jane,
na koro'' karuṇā-laba', E'ґопı̄на̄тх,
еі кі віча̄ра таба
бімукха декхійа̄, чха̄ро ніджа-джане,
на коро'' карун̣а̄-лаба',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'gopīnāth,
āmi to mūrakha ati
kise bhālo hoya, kabhu nā bujhinu,
tāi heno mama gati', E'ґопı̄на̄тх,
а̄мі то мӯракха аті
кісе бга̄ло хойа, кабгу на̄ буджхіну,
та̄і хено мама ґаті',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'gopīnāth,
tumi to'' paṇḍita-bara
mūḍhera mańgala, tumi anveṣibe,
e dāse nā bhāvo'' para
WORD', E'ґопı̄на̄тх,
тумі то'' пан̣д̣іта-бара
мӯд̣хера маńґала, тумі анвешібе,
е да̄се на̄ бга̄во'' пара
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
    translation_en = EXCLUDED.translation_en;


  -- Song 3: Gopinatha (3)
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Gopinatha (3)', E'', 'verses', true)
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
    E'', E'',
    E'Song
Name: Gopinath Amar Upaya
Official
Name: Upalabdhi Vijnapti Song 3
Author:
Bhaktivinoda
Thakura
Book
Name: Kalyana
Kalpataru
Language:
Bengali
অ', E'Сонґ
Наме: Ґопінатх Амар Упайа
Оffічіал
Наме: Упалабдгі Віджнапті Сонґ 3
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Калйана
Калпатару
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Amar Upaya Nai
1) O
Gopinatha, I have no means of success, but if You take me, having bestowed your
mercy upon me, then I will obtain deliverance from this world.
2) O
Gopinatha, I have fallen into the perils of material illusion. Wealth, wife,
and sons have surrounded me, and lust has wasted me away.
3) O
Gopinatha, my mind is crazy and does not care for any authority. It is always
senseless and has remained in the dark pit of worldly affairs.', E'',
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
    E'', E'',
    E'gopīnāth,
āmāra upāya nāi
tumi kṛpā kori'', āmāre loile,
saḿsāre uddhāra pāi', E'ґопı̄на̄тх,
а̄ма̄ра упа̄йа на̄і
тумі кр̣па̄ корі'', а̄ма̄ре лоіле,
саḿса̄ре уддга̄ра па̄і',
    E'', E'',
    E'O Gopinatha, I have accepted my defeat. All of my various endeavors were
useless. Now You are the only hope.
5) O
Gopinatha, how shall I make any advancement when my mind has come under the
control of the powerful senses and does not abandon its attachment to
materialism?
6) O Gopinatha,
after sitting down in the core of my heart and subduing my mind, please wake me
to You. In this way the horrible dangers of this world will disappear.
7) O
Gopinatha, You are Hrsikesa, the Lord of the senses. Seeing me so helpless,
please control these senses of mine and deliver me from this dark and perilous
worldly existence.
8) O
Gopinatha, the noose of materialism has become fixed around my neck. Taking up
the sword of Your mercy and cutting this bondage, make this Bhaktivinoda Your
humble servant.
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
    E'', E'',
    E'gopīnāth,
porechi māyāra phere
dhana, dāra, suta, ghireche āmāre,
kāmete rekheche jere', E'ґопı̄на̄тх,
поречхі ма̄йа̄ра пхере
дгана, да̄ра, сута, ґгіречхе а̄ма̄ре,
ка̄мете рекхечхе джере',
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
    E'', E'',
    E'gopīnāth,
mana je pāgala mora
nā māne śāsana, sadā acetana,
viṣaye ro ''yeche ghora', E'ґопı̄на̄тх,
мана дже па̄ґала мора
на̄ ма̄не ш́а̄сана, сада̄ ачетана,
вішайе ро ''йечхе ґгора',
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
    E'gopināth,
hāra je menechi āmi
aneka jatana, hoilo bifala,
ekhano bharasā tumi', E'ґопіна̄тх,
ха̄ра дже менечхі а̄мі
анека джатана, хоіло біfала,
екхано бгараса̄ тумі',
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
    E'gopīnāth,
kemone hoibe gati
prabala indriya, bośī-bhūta mana,
nā chāre viṣaya-rati', E'ґопı̄на̄тх,
кемоне хоібе ґаті
прабала індрійа, бош́ı̄-бгӯта мана,
на̄ чха̄ре вішайа-раті',
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
    E'gopīnāth,
hṛdoye bosiyā mora
manake śamiyā, laho nija pāne,
ghucibe vipada ghora', E'ґопı̄на̄тх,
хр̣дойе босійа̄ мора
манаке ш́амійа̄, лахо ніджа па̄не,
ґгучібе віпада ґгора',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'gopīnāth,
anātha dekhiyā more
tumi hṛṣīkeśa, hṛṣīka damiyā,
tāro ''he saḿsṛti-ghore', E'ґопı̄на̄тх,
ана̄тха декхійа̄ море
тумі хр̣шı̄кеш́а, хр̣шı̄ка дамійа̄,
та̄ро ''хе саḿср̣ті-ґгоре',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'gopīnāth,
galāya legeche phāsa
kṛpā-asi dhori'', bandhana chediyā,
vinode koroho dāsa
WORD', E'ґопı̄на̄тх,
ґала̄йа леґечхе пха̄са
кр̣па̄-асі дгорі'', бандгана чхедійа̄,
віноде корохо да̄са
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
    translation_en = EXCLUDED.translation_en;


  -- Song 4: Sri Radha Krsna Pada Kamale
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Sri Radha Krsna Pada Kamale', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Sri Radha Krsna Pada Kamale
Mana
Official Name: Ucchvasa: Vijnapti Song 4
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Срі Радга Крсна Пада Камале
Мана
Оffічіал Наме: Уччхваса: Віджнапті Сонґ 4
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) Oh mind, tell me how I
can possibly attain ultimate refuge at the lotus feet of Sri Radha-Krsna?
2) This most fallen servant
has been living for a very long time being desirous of those lotus feet.
3) Oh Radhe,
Oh Krsna-candra, the very life of Your
devotees! Please give devotion unto Yourselves in
charity to this fallen sinner.
4) Please do not neglect me
because I am devoid of devotion. Therefore kindly give Your
most auspicious instructions to this fool.
5) Your servant is very
much diseased with the thirst for material sense gratification, so he''s asking You to kindly give him the capacity to assist in Your divine
conjugal pastimes.
6) This flickering life is
slowly drifting away, flowing onward into the ocean of time. So many days have
gone by; more will not come, so now I am wondering what is the means to get You dear Lord Krsna!
7) Oh Lord! I know that You are the dear most friend of the fallen souls. Indeed You are a veritable ocean of compassion.
8) I am most unfortunate,
backward and inexperienced, for I do not understand even a tiny fraction of
devotion. But by virtue of Your own good qualities, oh
Lord, make me Your very own beloved and thus put an end to all of my worldly
afflictions.
9) Giving me a spiritual
body within the transcendental realm of Vrndavana,
bestow upon me the nectar of Your service. Thus I will
become madly intoxicated with pure love by drinking the nectar of such service.
Just hear this song about Your own divine qualities.
10) Please engage me in
rendering confidential services within the circle of the divine Rasa-mandala. Thus Bhaktivinoda, the
unworthy maidservant of Sri Lalita Sakhi, is catching hold of Your
feet under her guidance.
REMARKS/EXTRA INFORMATION:
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
    E'', E'',
    E'sri-radha-krsna-pada-kamale mana
kemone lobhibe carama sarana', E'срі-радга-крсна-пада-камале мана
кемоне лобгібе чарама сарана',
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
    E'', E'',
    E'cirodina koriya o-carana as
ache he basiya e adhama das', E'чіродіна корійа о-чарана ас
ачхе хе басійа е адгама дас',
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
    E'', E'',
    E'he radhe, he krsna-candra bhakta-pran
pamare jugala-bhakti koro'' dan', E'хе радге, хе крсна-чандра бгакта-пран
памаре джуґала-бгакті коро'' дан',
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
    E'bhakti-hina boli'' na koro''
upeksa
murkha-jane deho'' jnana-susiksa', E'бгакті-хіна болі'' на коро''
упекса
муркха-джане дехо'' джнана-сусікса',
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
    E'bisaya pipasa-prapidita dase
deho'' adhikar jugala-bilase', E'бісайа піпаса-прапідіта дасе
дехо'' адгікар джуґала-біласе',
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
    E'cancala-jibana-srota
pravahiya,
kaler sagare dhay
gelo je dibas,na asibe
ar,
ebe krsna ki upay', E'чанчала-джібана-срота
правахійа,
калер саґаре дгай
ґело дже дібас,на асібе
ар,
ебе крсна кі упай',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'tumi patita-janer bandhu
jani he tomare natha
tumi to'' koruna-jalasindhu', E'тумі патіта-джанер бандгу
джані хе томаре натха
тумі то'' коруна-джаласіндгу',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'ami bhagya-hina,ati arvacina,
na jani bhakati-lesa
nija-gune natha,koro'' atmasat,
ghucaiya bhava-klesa', E'амі бгаґйа-хіна,аті арвачіна,
на джані бгакаті-леса
ніджа-ґуне натха,коро'' атмасат,
ґгучаійа бгава-клеса',
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
    v_chapter_id, '10', 10,
    E'', E'',
    E'siddha-deha diya,brndabana-majhe,
sevamrta koro'' dana
piyaiya prema,matta kori'' more,
suno nija guna-gana', E'сіддга-деха дійа,брндабана-маджхе,
севамрта коро'' дана
пійаійа према,матта корі'' море,
суно ніджа ґуна-ґана',
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
    v_chapter_id, '11', 11,
    E'', E'',
    E'jugala-sevay,sri-rasa-mandale
niyukta koro'' amay
lalita sakhir,ayogya kinkori,
binoda dhoriche pay', E'джуґала-севай,срі-раса-мандале
нійукта коро'' амай
лаліта сакхір,айоґйа кінкорі,
бінода дгорічхе пай',
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


  -- Section 10: Ucchvasa - Nama Kirtana
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 10, E'Ecstasy - Glorifying the Name', E'Уччгваса - Нама-кіртана (Екстаз - Оспівування Імені)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 10;


  -- Song 1: Kali Kukkura Kadan
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Kali Kukkura Kadan', E'', 'verses', true)
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
    E'কলি-কুক্কুর কদন যদি চাও (হে)
কলি-যুগ পাবন, কলি-ভয়-নাশন,
শ্রী শচী-নন্দন গাও (হে)', E'কলি-কুক্কুর কদন যদি চাও (হে)
কলি-যুগ পাবন, কলি-ভয়-নাশন,
শ্রী শচী-নন্দন গাও (হে)',
    E'Song
Name: Kali Kukkura Kadan
Official
Name: Ucchvasa: Ucchvasa Kirtana Nama Kirtana Song 1; Prabhati Giti
Author:
Bhaktivinoda
Thakura
Book
Name: Kalyana
Kalpataru
Language:
Bengali
অ', E'Сонґ
Наме: Калі Куккура Кадан
Оffічіал
Наме: Уччхваса: Уччхваса Кіртана Нама Кіртана Сонґ 1; Прабгаті Ґіті
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Калйана
Калпатару
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'If you want to be rid of the influence of the dog-like personality of kali,
then just sing the glories of the beautiful Son of Mother Saci (Saci-nandana).
He is the Savior of the kali-yuga (Kali-yuga Pavana), and He is
(Kali-bhay-nasana), the destroyer of all fear caused by the age of quarrel.', E'',
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
    E'গদাধর-মাদন, নিতাঞের প্রাণ-ধন,
অদ্বৈতের প্রপূজিত গোরা
নিমাঞি বিশ্বম্ভর, শ্রীনিবাস-ঈশ্বর,
ভকত-সমূহ-চিত-চোরা', E'গদাধর-মাদন, নিতাঞের প্রাণ-ধন,
অদ্বৈতের প্রপূজিত গোরা
নিমাঞি বিশ্বম্ভর, শ্রীনিবাস-ঈশ্বর,
ভকত-সমূহ-চিত-চোরা',
    E'kali-kukkura
kadana yadi cāo (he)
kali-yuga
pāvana, kali-bhaya-nāśana,
śrī
śacī-nandana gāo (he)', E'калі-куккура
кадана йаді ча̄о (хе)
калі-йуґа
па̄вана, калі-бгайа-на̄ш́ана,
ш́рı̄
ш́ачı̄-нандана ґа̄о (хе)',
    E'', E'',
    E'He maddens Sri Gadhadara with His name, (Gadadhara-madana) He is the treasure
of the life of Sri Nityananda Prabhu (Nita''yer Prana-dhana), and He is the most
worshipable object of Sri Advaita Acarya (Advaiter Prapujita). He is affectionately
named Nimai by His mother, due to being born under a Nim tree, and He has been
named Visvambhara by His grandfather. He is the only Lord of Sri Srivasa
(Srinivas-isvar), and He steals the hearts of all the assembled devotees
(Bhakta-samuha-cita-cora).', E'',
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
    E'নদীয়া-শশধর, মায়াপুর-ঈশ্বর,
নাম-প্রবর্তন সুর
গৃহি-জন-শিক্ষক, ন্যাসিকুল-নায়ক,
মাধব রাধা-ভাব-পূর', E'নদীয়া-শশধর, মায়াপুর-ঈশ্বর,
নাম-প্রবর্তন সুর
গৃহি-জন-শিক্ষক, ন্যাসিকুল-নায়ক,
মাধব রাধা-ভাব-পূর',
    E'gadādhara-mādana,
nitā''yera prāṇa-dhana,
advaitera
prapūjita gorā
nimāñi
viśvambhara, śrīnivāsa-īśvara,
bhakata-samūha-cita-corā', E'ґада̄дгара-ма̄дана,
ніта̄''йера пра̄н̣а-дгана,
адваітера
прапӯджіта ґора̄
німа̄н̃і
віш́вамбгара, ш́рı̄ніва̄са-ı̄ш́вара,
бгаката-самӯха-чіта-чора̄',
    E'', E'',
    E'Lord Caitanya is the moon over Nadia (Nadiya-sasadhar), the Lord of Sri
Mayapura-dhama (Mayapura-isvar), and the divine propagator of His own name
(Nama-pravartana Sura). He is the instructor of family men (Grhijana-siksaka),
and He is also the hero of those who are in the renounced order
(Nyasi-kula-nayaka). He is the husband of the Goddess of Fortune (Madhava), and
He is over-flowing with the ecstatic moods and sentiments of Srimati Radharani
(Radha-bhava-pura).', E'',
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
    E'সার্বভৌম-শোধন, গজপতি-তারণ,
রামানন্দ-পোষণ বীর
রূপানন্দ-বর্ধন, সনাতন-পালন,
হরি-দাস-মদন ধীর', E'সার্বভৌম-শোধন, গজপতি-তারণ,
রামানন্দ-পোষণ বীর
রূপানন্দ-বর্ধন, সনাতন-পালন,
হরি-দাস-মদন ধীর',
    E'nadīyā-śaśadhara,
māyāpura-īśvara,
nāma-pravartana
sura
gṛhijana-śikṣaka,
nyāsikula-nāyaka,
mādhava
rādhābhāva-pūra', E'надı̄йа̄-ш́аш́адгара,
ма̄йа̄пура-ı̄ш́вара,
на̄ма-правартана
сура
ґр̣хіджана-ш́ікшака,
нйа̄сікула-на̄йака,
ма̄дгава
ра̄дга̄бга̄ва-пӯра',
    E'', E'',
    E'Lord Caitanya is the corrector and purifier of Sarvabhauma Bhattacarya
(Sarvabhauma-sodhana), and the deliverer of King Prataparudra
(Gajapati-tarana), the source of nourishment of Srila Ramananda Raya
(Ramananda-posana), and He is a great hero (Vira). He increases the ecstasy of
Srila Rupa Gosvami (Rupananda-vardhana), He is the maintainer and protector of
Srila Sanatana Gosvami (Sanatana-palana), He gladdens Haridasa Thakura
(Haridasa-modana) and He is very grave (Dhira).', E'',
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
    E'ব্রজ-রস-ভাবন, দুষ্টমত-শাতন,
কপটী-বিঘাতন কাম
শুদ্ধ ভক্ত-পালন, শুষ্ক-জ্ঞান-তাডন,
ছল-ভক্তি-দূষণ রাম', E'ব্রজ-রস-ভাবন, দুষ্টমত-শাতন,
কপটী-বিঘাতন কাম
শুদ্ধ ভক্ত-পালন, শুষ্ক-জ্ঞান-তাডন,
ছল-ভক্তি-দূষণ রাম',
    E'sārvabhauma-śodhana,
gajapati-tāraṇa,
rāmānanda-poṣaṇa
vīra
rūpānanda-vardhana,
sanātana-pālana,
hari-dāsa-modana
dhīra', E'са̄рвабгаума-ш́одгана,
ґаджапаті-та̄ран̣а,
ра̄ма̄нанда-пошан̣а
вı̄ра
рӯпа̄нанда-вардгана,
сана̄тана-па̄лана,
харі-да̄са-модана
дгı̄ра',
    E'', E'',
    E'Lord Caitanya is the source of all the transcendental mellows of Vraja-dhama
(Braja-rasa Bhavana), He is the destroyer of all mischievous and wicked
mentality (Dustamata-satana), and He dissolves the mundane lust of the
deceitful insincere souls by His causeless mercy (Kapati Vighatana Kama). He
maintains and protects His pure Vaisnava devotees (Suddha-bhakta-palana), and
He chastises dry speculative knowledge (Suskajnana Tadana). He destroys
pretentious and hypocritical devotion (Chala-bhakti-dusana), and He is the
reservoir of pleasure (Rama).
REMARKS/EXTRA
INFORMATION:
This
song can be rendered in the morning Bengali raga, as Bhaktivinoda Thakura
intended this song for morning worship.
Riksaraja
prabhu rendered this song Raga Sindhura Gandhara in his 1978 Golden Avatar
release of Reservoir of Pleasure.', E'',
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
    E'vraja-rasa-bhāvana,
duṣṭamata-śātana,
kapaṭī-vighātana
kāma
śuddha
bhakta-pālana, śuṣka-jñāna-tāḍana,
chala-bhakti-dūṣaṇa
rāma', E'враджа-раса-бга̄вана,
душт̣амата-ш́а̄тана,
капат̣ı̄-віґга̄тана
ка̄ма
ш́уддга
бгакта-па̄лана, ш́ушка-джн̃а̄на-та̄д̣ана,
чхала-бгакті-дӯшан̣а
ра̄ма',
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


  -- Song 2: Vibhavari Sesa
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Vibhavari Sesa', E'', 'verses', true)
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
    E'বিভাবরী শেষ, আলোক-প্রবেশ,
নিদ্রা ছাড়ি'' উঠো জীব
বল হরি হরি, মুকুন্দ মুরারি,
রাম কৃষ্ণ হয়গ্রীব', E'বিভাবরী শেষ, আলোক-প্রবেশ,
নিদ্রা ছাড়ি'' উঠো জীব
বল হরি হরি, মুকুন্দ মুরারি,
রাম কৃষ্ণ হয়গ্রীব',
    E'Song
Name: Vibhavari Sesa
Official
Name: Ucchvasa: Ucchvasa Kirtana Nama Kirtana Song 2
Author:
Bhaktivinoda Thakura
Book
Name: Kalyana Kalpataru
Language:
Bengali
অ
ଅ', E'Сонґ
Наме: Вібгаварі Сеса
Оffічіал
Наме: Уччхваса: Уччхваса Кіртана Нама Кіртана Сонґ 2
Аутхор:
Бхактівінода Тхакура
Боок
Наме: Калйана Калпатару
Ланґуаґе:
Бенґалі
অ
ଅ',
    E'', E'',
    E'Sesa', E'',
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
    E'নৃসিংহ বামন, শ্রী-মধুসূদন,
ব্রজেন্দ্র-নন্দন শ্যাম
পূতনা-ঘাতন, কৈটভ-শাতন,
জয় দাশরথি-রাম', E'নৃসিংহ বামন, শ্রী-মধুসূদন,
ব্রজেন্দ্র-নন্দন শ্যাম
পূতনা-ঘাতন, কৈটভ-শাতন,
জয় দাশরথি-রাম',
    E'vibhāvarī
śeṣa, āloka-praveśa,
nidrā chāri'' uṭho jīva
bolo hari hari, mukunda murāri,
rāma kṛṣṇa hayagrīva', E'вібга̄варı̄
ш́еша, а̄лока-правеш́а,
нідра̄ чха̄рі'' ут̣хо джı̄ва
боло харі харі, мукунда мура̄рі,
ра̄ма кр̣шн̣а хайаґрı̄ва',
    E'', E'',
    E'The night has come to an end and the light of dawn is entering. O jiva soul,
arise and give up your sleep. Chant the holy names of Lord Hari, who is the giver
of liberation; the enemy of the Mura demon; the supreme enjoyer; the
all-attractive one; and the horse-headed incarnation, Hayagriva.', E'',
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
    E'যশোদা দুলাল, গোবিন্দ-গোপাল,
বৃন্দাবন পুরন্দর
গোপী-প্রিয়-জন, রাধিকা-রমণ,
ভুবন -সুন্দর-বর', E'যশোদা দুলাল, গোবিন্দ-গোপাল,
বৃন্দাবন পুরন্দর
গোপী-প্রিয়-জন, রাধিকা-রমণ,
ভুবন -সুন্দর-বর',
    E'nṛsiṁha
vāmana, śrī-madhusūdana,
brajendra-nandana śyāma
pūtanā-ghātana, kaiṭabha-śātana,
jaya dāśarathi-rāma', E'нр̣сім̇ха
ва̄мана, ш́рı̄-мадгусӯдана,
браджендра-нандана ш́йа̄ма
пӯтана̄-ґга̄тана, каіт̣абга-ш́а̄тана,
джайа да̄ш́аратхі-ра̄ма',
    E'', E'',
    E'Lord Hari [Krsna] incarnated as the half-man, half-lion, Nrsimha. He appeared
as a dwarf-brahmana named Upendra and is the killer of the Madhu demon. He is
the beloved son of the King of Vraja, Nanda Maharaja, and is blackish in
complexion. He is the slayer of the Putana witch and the destroyer of the demon
Kaitabha. All glories to Lord Hari, who appeared as Lord Rama, the son of King
Dasaratha.', E'',
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
    E'রাবাণান্তকর, মাখন-তস্কর,
গোপী-জন-বস্ত্র-হারী
ব্রজের রাখাল, গোপ-বৃন্দ-পাল,
চিত্ত-হারী বংশী-ধারী', E'রাবাণান্তকর, মাখন-তস্কর,
গোপী-জন-বস্ত্র-হারী
ব্রজের রাখাল, গোপ-বৃন্দ-পাল,
চিত্ত-হারী বংশী-ধারী',
    E'yaśodā
dulāla, govinda-gopāla,
vṛndāvana purandara
gopī-priya-jana, rādhikā-ramaṇa,
bhuvana -sundara-bara', E'йаш́ода̄
дула̄ла, ґовінда-ґопа̄ла,
вр̣нда̄вана пурандара
ґопı̄-прійа-джана, ра̄дгіка̄-раман̣а,
бгувана -сундара-бара',
    E'', E'',
    E'He is the darling of mother Yasoda; the giver of pleasure to the cows, land,
and spiritual senses; and the protector of the cows. He is the Lord of the
Vrndavana forest; the gopis'' beloved; the lover of Radhika; and the most
beautiful personality in all the worlds.', E'',
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
    E'যোগীন্দ্র-বন্দন, শ্রী-নন্দ-নন্দন,
ব্রজ-জন-ভয়-হারী
নবীন নীরদ, রূপ মনোহর,
মোহন-বংশী-বিহারী', E'যোগীন্দ্র-বন্দন, শ্রী-নন্দ-নন্দন,
ব্রজ-জন-ভয়-হারী
নবীন নীরদ, রূপ মনোহর,
মোহন-বংশী-বিহারী',
    E'rāvāṇāntakara,
mākhana-taskara,
gopī-jana-vastra-hārī
brajera rākhāla, gopa-vṛnda-pāla,
citta-hārī baṁśī-dhārī', E'ра̄ва̄н̣а̄нтакара,
ма̄кхана-таскара,
ґопı̄-джана-вастра-ха̄рı̄
браджера ра̄кха̄ла, ґопа-вр̣нда-па̄ла,
чітта-ха̄рı̄ бам̇ш́ı̄-дга̄рı̄',
    E'', E'',
    E'As Ramacandra He brought about the end of the demoniac King Ravana; as Krsna He
stole the older gopis'' butter; He stole the younger gopis'' clothes while they
were bathing in the Yamuna. He is a cowherd boy of Vraja and the protector of
the cowherd boys. He steals the hearts of all and always holds a flute.', E'',
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
    E'যশোদা-নন্দন, কংস-নিসূদন,
নিকুঞ্জ-রাস-বিলাসী
কদম্ব-কানন, রাস-পরায়ণ,
বৃন্দ-বিপিন-নিবাসী', E'যশোদা-নন্দন, কংস-নিসূদন,
নিকুঞ্জ-রাস-বিলাসী
কদম্ব-কানন, রাস-পরায়ণ,
বৃন্দ-বিপিন-নিবাসী',
    E'yogīndra-bandana,
śrī-nanda-nandana,
braja-jana-bhaya-hārī
navīna nīrada, rūpa manohara,
mohana-baṁśī-bihārī', E'йоґı̄ндра-бандана,
ш́рı̄-нанда-нандана,
браджа-джана-бгайа-ха̄рı̄
навı̄на нı̄рада, рӯпа манохара,
мохана-бам̇ш́ı̄-біха̄рı̄',
    E'', E'',
    E'Lord Krsna is worshiped by the best of yogis and is the son of Nanda. He
removes all the fears of the inhabitants of Vraja. He is the color of a fresh
rain cloud, and His form is enchanting. When He wanders about, playing His
flute, He looks very charming.', E'',
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
    E'আনন্দ-বর্ধন, প্রেম-নিকেতন,
ফুল-শর-জোজক কাম
গোপাঙ্গনা-গণ, চিত্ত-বিনোদন,
সমস্ত-গুণ-গণ-ধাম', E'আনন্দ-বর্ধন, প্রেম-নিকেতন,
ফুল-শর-জোজক কাম
গোপাঙ্গনা-গণ, চিত্ত-বিনোদন,
সমস্ত-গুণ-গণ-ধাম',
    E'yaśodā-nandana,
kaṁsa-nisūdana,
nikuñja-rāsa-vilāsī
kadamba-kānana, rāsa-parāyaṇa,
bṛnda-vipina-nivāsī', E'йаш́ода̄-нандана,
кам̇са-нісӯдана,
нікун̃джа-ра̄са-віла̄сı̄
кадамба-ка̄нана, ра̄са-пара̄йан̣а,
бр̣нда-віпіна-ніва̄сı̄',
    E'', E'',
    E'He is the son of Yasoda and the killer of King Kamsa, and He sports in the rasa
dance among the groves of Vraja. Krsna engages in this rasa dance underneath
the kadamba trees, and He resides in the forest of Vrndavana.', E'',
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
    v_chapter_id, '8', 8,
    E'যামুন-জীবন, কেলি-পরায়ণ,
মানস-চন্দ্র-চকোর
নাম-সুধা-রস, গাও কৃষ্ণ-যশ
রাখো বচন মন মোর', E'যামুন-জীবন, কেলি-পরায়ণ,
মানস-চন্দ্র-চকোর
নাম-সুধা-রস, গাও কৃষ্ণ-যশ
রাখো বচন মন মোর',
    E'ānanda-vardhana,
prema-niketana,
phula-śara-jojaka kāma
gopāṅganā-gaṇa, citta-vinodana,
samasta-guṇa-gaṇa-dhāma', E'а̄нанда-вардгана,
према-нікетана,
пхула-ш́ара-джоджака ка̄ма
ґопа̄н̇ґана̄-ґан̣а, чітта-вінодана,
самаста-ґун̣а-ґан̣а-дга̄ма',
    E'', E'',
    E'He increases the ecstasy of His devotees. He is the reservoir of all love and
is the transcendental Cupid who uses His flowered arrows to increase the loving
desires of the gopis. He is the pleasure of the gopis'' hearts and the abode of
all wonderful qualities.', E'',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'jāmuna-jīvana,
keli-parāyaṇa,
mānasa-candra-cakora
nāma-sudhā-rasa, gāo kṛṣṇa-jaśa
rākho vacana mana mora
WORD', E'джа̄муна-джı̄вана,
келі-пара̄йан̣а,
ма̄наса-чандра-чакора
на̄ма-судга̄-раса, ґа̄о кр̣шн̣а-джаш́а
ра̄кхо вачана мана мора
ВОРД',
    E'', E'',
    E'Lord Krsna is the life of the River Yamuna. He is always absorbed in amorous
pastimes, and He is the moon of the gopis'' minds, which are like the cakora
birds that subsist only upon moonlight. O mind, obey these words of mine and
sing the glories of Sri Krsna in the form of these holy names, which are full
of nectarean mellows.
REMARKS/EXTRA
INFORMATION:
This
song is sung in Mangala Arotik in some temples in Vrndavana. As this is a
morning song, this raga follows the same tune of Samsara Davanala Lidha Loka or
Udilo Aruna.
PURPORTS:
A.C.
Bhaktivedanta Swami Prabhupada
MUSICAL
NOTATION:
♫ Vibhavari Sesa', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;


  -- Section 11: Ucchvasa - Rupa Kirtana
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 11, E'Ecstasy - Glorifying the Form', E'Уччгваса - Рупа-кіртана (Екстаз - Оспівування форми)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 11;


  -- Song 1: Janama Saphalata Ra Krsna
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Janama Saphalata Ra Krsna', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Janama Saphala Tara
Official Name: Ucchvasa: Ucchvasa Kirtana Rupa Kirtana Song 1
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Джанама Сапхала Тара
Оffічіал Наме: Уччхваса: Уччхваса Кіртана Рупа Кіртана Сонґ 1
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) His birth is successful
whose good fortune dawns so as to have the vision of Lord Krsna
just once. When the jiva gives up all delusions of
mind, then only he will see the vision of Krsna
blooming within the eyes of his heart.
2) He sees Krsna there fully decorated with garlands of forest flowers
as the most expert connoisseur of all the amorous love-sports in Vrndavana. His transcendental playing wonderfully on His flute, mellows and is the abode of all form bent in three
different places, He is the reservoir of all relishable
virtuous qualities.
3) By such a beautiful form
He is maddening the entire universe. His complexion is like that of a fresh new
rain cloud, His head is decorated with a big peacock feather, and His
sandalwood tilaka on His forehead is most becoming.
Wearing brilliant yellow-colored garments, He stands with His face decorated by
a wide, sweet smile.
4) Beholding Him standing
thusly at the edge of a kadamba grove, I can see that
Krsna''s beauty is conquering the luster of an entire
mine of sapphires. Seeing this, my mind has become so restless that my feet
will move no longer, and I''ve completely forgotten about my family and home
life in this world.
5) Oh sakhi,
oh dear girlfriend! Seeing that sweet form abounding in nectar, I have fallen
unconscious as a fountain of tears borne of ecstatic love cascades from my
eyes.
6) What a wonderful crown
upon His head! What a wonderful flute He is holding in His hand! What a
wonderfully beautiful form as He stands in His three-fold bending posture! The
nectar of His lotus feet is overflowing with the tinkling sound coming from the
clusters of anklebells which are decorating them.
7) Accepting the form of a
honeybee, I always hope for a residence near His lotus feet. And I will get it
very easily because I always sing the glories of Krsna,
adoring no one else.
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
    E'', E'',
    E'janama saphala tā''ra,
kṛṣṇa-daraśana yā''ra
bhāgye hoiyāche eka-bāra
bikaśiyā hrin-nayana kari'' kṛṣṇa
daraśana
chāḍe jīva citter bikāra', E'джанама сапхала та̄''ра,
кр̣шн̣а-дараш́ана йа̄''ра
бга̄ґйе хоійа̄чхе ека-ба̄ра
бікаш́ійа̄ хрін-найана карі'' кр̣шн̣а
дараш́ана
чха̄д̣е джı̄ва чіттер біка̄ра',
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
    E'', E'',
    E'vṛndavana-keli catur vanamālī
tribhańga-bhańgimārūpa vaḿśī-dharī aparūpa
rasamaya nidhi, guṇa-śālī', E'вр̣ндавана-келі чатур ванама̄лı̄
трібгаńґа-бгаńґіма̄рӯпа ваḿш́ı̄-дгарı̄ апарӯпа
расамайа нідгі, ґун̣а-ш́а̄лı̄',
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
    E'', E'',
    E'varṇa nava jaladhara
śire śikhi piccha
vara
alakā tilaka śobhāpāya
paridhāne
pīta-vāsa vadane madhūra
hāsa
hena rūpa jagat mātāya', E'варн̣а нава джаладгара
ш́іре ш́ікхі піччха
вара
алака̄ тілака ш́обга̄па̄йа
парідга̄не
пı̄та-ва̄са вадане мадгӯра
ха̄са
хена рӯпа джаґат ма̄та̄йа',
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
    E'indranīla jini kṛṣṇa-rūpakhāni
heriyā
kadamba-mūle
mana ucāṭana na cale caraṇa
saḿsāra
gelāma bhūle', E'індранı̄ла джіні кр̣шн̣а-рӯпакха̄ні
херійа̄
кадамба-мӯле
мана уча̄т̣ана на чале чаран̣а
саḿса̄ра
ґела̄ма бгӯле',
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
    E'(sakhī
he) sudhāmaya se rūpa-mādhurī
dekhile nayana, haya acetana,
jhare premamaya bāri', E'(сакхı̄
хе) судга̄майа се рӯпа-ма̄дгурı̄
декхіле найана, хайа ачетана,
джхаре премамайа ба̄рі',
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
    E'kibā cūḍā śire kibā vaḿśī kare
kibā se tribhańga-ṭhāma
caraṇa-kamale,
amiyā uchale,
tāhāte nūpura dāma', E'кіба̄ чӯд̣а̄ ш́іре кіба̄ ваḿш́ı̄ каре
кіба̄ се трібгаńґа-т̣ха̄ма
чаран̣а-камале,
амійа̄ учхале,
та̄ха̄те нӯпура да̄ма',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'sadā āśā kari bhṛńga-rūpa dhari
caraṇa kamale sthāna
anāyāse pāi kṛṣṇa-guṇa
gāi
āra nā bhajiba āna', E'сада̄ а̄ш́а̄ карі бгр̣ńґа-рӯпа дгарі
чаран̣а камале стха̄на
ана̄йа̄се па̄і кр̣шн̣а-ґун̣а
ґа̄і
а̄ра на̄ бгаджіба а̄на',
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


  -- Section 12: Ucchvasa - Guna Kirtana
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 12, E'Ecstasy - Glorifying the Qualities', E'Уччгваса - Ґуна-кіртана (Екстаз - Оспівування якостей)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 12;


  -- Song 1: Bahirmukha Hoye Mayare
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Bahirmukha Hoye Mayare', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Bahirmukha Ho''ye Mayare Bhajiye
Official Name: Ucchvasa: Ucchvasa Kirtana Guna Kirtana Song 1
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Бахірмукха Хо''йе Майаре Бхаджійе
Оffічіал Наме: Уччхваса: Уччхваса Кіртана Ґуна Кіртана Сонґ 1
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) Becoming inimical
towards the Lord, and adoring illusion, I have become madly attached to this
material existence. However, Krsna is so kind for He has arisen like the sun
within this material world just for my sake.
2) Oh sakhi!
My dear, the moon-like Krsna is certainly an unlimited ocean of auspicious
qualities! He distributes His causeless mercy to all the offenders, not
hesitating to purify them and relieve them of their afflictions.
3) I have come into this
false material existence, adoring the material energy as if it is fit form my
enjoyment, and I am seized with the false conception that I am a male (a purusa). But Lord Krsna, showing His compassion, descends
Himself and forcibly steals away all such false conceptions with the
transcendental sound of His flute.
4) My dear girlfriend, just
worship such a jewel-like Krsna with special care and attention. Now Bhaktivinoda admits that he is helplessly bound up to the
wonderful qualities of Sri Krsna''s lotus feet. Thus,
I always bow my head in great awe and reverence before those divine feet.
REMARKS / EXTRA INFORMATION:
No
Extra Information available for this song', E'',
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
    E'', E'',
    E'bahirmukha ho''ye,mayare bhajiye,
samsare hoinu ragi
krsna doyamoy, prapance udoy,
hoila amar lagi', E'бахірмукха хо''йе,майаре бгаджійе,
самсаре хоіну раґі
крсна дойамой, прапанче удой,
хоіла амар лаґі',
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
    E'', E'',
    E'(sakhi he) krsna-candra guner sagar
aparadhi jane,krpa bitarane,
sodhite nahe katar', E'(сакхі хе) крсна-чандра ґунер саґар
апарадгі джане,крпа бітаране,
содгіте нахе катар',
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
    E'', E'',
    E'samsare asiya,prakrti bhajiya,
purusabhimane mari
krsna doya kori'',nije abatari'',
bamsi-rabe nila hari''', E'самсаре асійа,пракрті бгаджійа,
пурусабгімане марі
крсна дойа корі'',нідже абатарі'',
бамсі-рабе ніла харі''',
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
    E'emon ratane,bisesa jatane,
bhajo sakhi abirata
binoda ekhone,sri-krsna-carane,
gune bandha, sada nata', E'емон ратане,бісеса джатане,
бгаджо сакхі абірата
бінода екхоне,срі-крсна-чаране,
ґуне бандга, сада ната',
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


  -- Song 2: Suno He Rasika Jana Krsna
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Suno He Rasika Jana Krsna', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Suno He Rasikajana Krsna Guna Aganana
Official Name: Ucchvasa: Ucchvasa Kirtana Guna Kirtana Song 2
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Суно Хе Расікаджана Крсна Ґуна Аґанана
Оffічіал Наме: Уччхваса: Уччхваса Кіртана Ґуна Кіртана Сонґ 2
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Listen to this, oh wisest relishers of mellows! The
transcendental qualities of Sri Krsna are
innumerable; indeed it is not possible to describe such unlimited divine
attributes. Krsna is the spiritual master of the
entire universe, He is like a wish fulfilling desire-tree, and He is the
helmsman of the boat on the ocean of material existence.', E'',
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
    E'', E'',
    E'śuna, he rasikajana kṛṣṇa
guṇa agaṇana
ananta kahite nāhi pāre
kṛṣṇa jagatera guru kṛṣṇa
vāñcākalpataru
nāvika se bhava-pārābāre', E'ш́уна, хе расікаджана кр̣шн̣а
ґун̣а аґан̣ана
ананта кахіте на̄хі па̄ре
кр̣шн̣а джаґатера ґуру кр̣шн̣а
ва̄н̃ча̄калпатару
на̄віка се бгава-па̄ра̄ба̄ре',
    E'', E'',
    E'Krsna is just like a doctor for those whose hearts
are ailing, as He is very expert at destroying the diseased condition of
material existence. By distributing the nectar of ecstatic love to all the
inimical souls, He gradually takes them back into His own confidential realm.', E'',
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
    E'', E'',
    E'hṛdaya pīṛita jā''ra kṛṣṇa
cikitsaka tā''ra
bhava roga nāśite catura
kṛṣṇa bahirmmukha jane premāmṛta vitaraṇe
krame laya nija antaḥpura', E'хр̣дайа пı̄р̣іта джа̄''ра кр̣шн̣а
чікітсака та̄''ра
бгава роґа на̄ш́іте чатура
кр̣шн̣а бахірммукха джане према̄мр̣та вітаран̣е
краме лайа ніджа антах̣пура',
    E'', E'',
    E'Krsna is an ocean of compassion for those who are
bound up in fruitive reactions, as well as for those
bound up in philosophical speculation, and for those blinded by other human
perplexities. Giving the honey of His lotus feet, and thus relieving the
darkness of such worldliness, He makes one an attendant of His own feet.', E'',
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
    E'', E'',
    E'karmma-bandha jñāna-bandha, āveśe
mānava andha
tā''re kṛṣṇa karuṇā
sāgara
pādapadma madhū diyā, andhabhāva ghucāiyā
caraṇe karena anucara', E'кармма-бандга джн̃а̄на-бандга, а̄веш́е
ма̄нава андга
та̄''ре кр̣шн̣а карун̣а̄
са̄ґара
па̄дападма мадгӯ дійа̄, андгабга̄ва ґгуча̄ійа̄
чаран̣е карена анучара',
    E'', E'',
    E'Krsna eventually bestows the jewel of independence
unto those persons who are attached to the path of rules and regulations,
thereby allowing them entrance into the path of spontaneous loving service.
Becoming influenced by such spontaneity, remaining under the shelter of the mellows of unwedded love (parakiya-bhava),
the soul finally attains all the symptoms of ecstatic love for Krsna.', E'',
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
    E'vidhimārga
rata jane svādhīnatā
ratna dāne
rāgamārge
karāna praveśa
rāga-baśavartti ha''ye pārakīya-bhāvāśraye
labhe jīva kṛṣṇa-premāveśa', E'відгіма̄рґа
рата джане сва̄дгı̄ната̄
ратна да̄не
ра̄ґама̄рґе
кара̄на правеш́а
ра̄ґа-баш́авартті ха''йе па̄ракı̄йа-бга̄ва̄ш́райе
лабге джı̄ва кр̣шн̣а-према̄веш́а',
    E'', E'',
    E'Krsna is the dear most friend and husband of those
who are always attached to drinking the fountain of ecstatic tears of love.
Thus, the goal of this most fallen and lowly Bhaktivinoda
is to be with all such residents of Vraja within the
abode of Supreme auspiciousness.
REMARKS/EXTRA INFORMATION:
No Extra Information available for this song!', E'',
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
    E'premāmṛta-vāri-dhāra sadā pānarata tāń''rā
kṛṣṇa tāń''hādera bandhū pati
sei saba braja-jana sukalyāṇa-niketana
dīnahīna
vinodera gati', E'према̄мр̣та-ва̄рі-дга̄ра сада̄ па̄нарата та̄ń''ра̄
кр̣шн̣а та̄ń''ха̄дера бандгӯ паті
сеі саба браджа-джана сукалйа̄н̣а-нікетана
дı̄нахı̄на
вінодера ґаті',
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


  -- Section 13: Ucchvasa - Lila Kirtana
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 13, E'Ecstasy - Glorifying the Pastimes', E'Уччгваса - Ліла-кіртана (Екстаз - Оспівування ігор)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 13;


  -- Song 1: Jive Krpa Kori Goloker
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Jive Krpa Kori Goloker', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Jive Krpa Kori Goloker Hari
Official Name: Ucchvasa: Ucchvasa Kirtana Lila Kirtana Song 1
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Джіве Крпа Корі Ґолокер Харі
Оffічіал Наме: Уччхваса: Уччхваса Кіртана Ліла Кіртана Сонґ 1
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'Showing His causeless mercy to the fallen souls, the Lord of Goloka has revealed the moods and sentiments of Vraja. He who is the knower of the
mellows of such loving exchanges of Vraja is
fit to enter Vrndavana, as long as he does not
maintain materialistic misconceptions.', E'',
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
    E'', E'',
    E'jibe krpa kori'',goloker
hari,
braja-bhava prakasilo
se bhava-rasajna,brndabana-jogya,
jada-buddhi na hoilo', E'джібе крпа корі'',ґолокер
харі,
браджа-бгава пракасіло
се бгава-расаджна,брндабана-джоґйа,
джада-буддгі на хоіло',
    E'', E'',
    E'The pastimes of Krsna are like an unfathomable ocean.
All of the activities in Vaikuntha can never be
compared to the sweet essence of Krsna''s pastimes in Goloka.', E'',
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
    E'', E'',
    E'krsna-lila-samudra
apar
baikuntha-bihar,samana ihar,
kabhu nahe ja''na sar', E'крсна-ліла-самудра
апар
баікунтха-біхар,самана іхар,
кабгу нахе джа''на сар',
    E'', E'',
    E'Krsna''s pastimes in the form of a two-armed human
being are the reservoir of all transcendental mellows -- especially the
conjugal mellow. The devotee who is following the rules and regulations of Vaikuntha develops only up to the mellow of fraternity, and
is in comparison completely unable to taste any such sweetness as is found in
the conjugal relationship.', E'',
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
    E'', E'',
    E'krsna akar nar,sarva-rasadhar,
srngarer bisesatah
baikuntha-sadhaka,sakhye aparaka,
madhure na hoy rata', E'крсна акар нар,сарва-расадгар,
срнґарер бісесатах
баікунтха-садгака,сакхйе апарака,
мадгуре на хой рата',
    E'', E'',
    E'Krsna in Vraja is just like
an ever-fresh youthful Cupid, abounding in all transcendental ecstatic mellows.
He always performs suitable pastimes with the different jiva
souls. Thus some of the multitude of Krsna''s virtuous qualities is mentioned.
Remarks/
Extra Information:
No Extra Information available for this song!', E'',
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
    E'braje krsna-dhana,nabina-madana,
aprakrta rasamoy
jiber sahita,nitya-lilocita,
krsna-guna-gana hoy', E'брадже крсна-дгана,набіна-мадана,
апракрта расамой
джібер сахіта,нітйа-лілочіта,
крсна-ґуна-ґана хой',
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


  -- Song 2: Ami Jamuna Puline
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Ami Jamuna Puline', E'', 'verses', true)
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
    E'(আমি) যমুনা-পুলিনে, কদম্ব-কাননে, কি হেরিনু সখী! আজ
(আমার) শ্যাম বংশীধারী, মণি-মঞ্চোপরি, করে'' লীলা রসরাজ', E'(আমি) যমুনা-পুলিনে, কদম্ব-কাননে, কি হেরিনু সখী! আজ
(আমার) শ্যাম বংশীধারী, মণি-মঞ্চোপরি, করে'' লীলা রসরাজ',
    E'⇒ A
Song
Name: Ami Jamuna Puline
Official
Name: Lila Kirtana Song 2
Author:
Bhaktivinoda
Thakura
Book
Name: Kalyana
Kalpataru
Language:
Bengali
অ', E'⇒ А
Сонґ
Наме: Амі Джамуна Пуліне
Оffічіал
Наме: Ліла Кіртана Сонґ 2
Аутхор:
Бхактівінода
Тхакура
Боок
Наме: Калйана
Калпатару
Ланґуаґе:
Бенґалі
অ',
    E'', E'',
    E'Oh sakhi! My dear girlfriend! What have I seen today? In a kadamba grove on the
banks of the Yamuna, a beautiful blackish boy holding a long flute (vamsi) is
seated upon a throne of jewels, performing His pastimes as the King of all
transcendental mellows!', E'',
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
    E'কৃষ্ণ-কেলি সুধা-প্রস্রবন
(তার) অষ্ট-দলোপরি, শ্রী রাধা শ্রী হরি, অষ্ট-সখী পরিজন', E'কৃষ্ণ-কেলি সুধা-প্রস্রবন
(তার) অষ্ট-দলোপরি, শ্রী রাধা শ্রী হরি, অষ্ট-সখী পরিজন',
    E'(āmi)
jamunā-puline, kadamba-kānane, ki herinu sakhī! āja
(āmār)
śyāma vaḿśīdhārī, maṇi-mañcopari,
kare'' līlā rasarāja', E'(а̄мі)
джамуна̄-пуліне, кадамба-ка̄нане, кі херіну сакхı̄! а̄джа
(а̄ма̄р)
ш́йа̄ма ваḿш́ı̄дга̄рı̄, ман̣і-ман̃чопарі,
каре'' лı̄ла̄ расара̄джа',
    E'', E'',
    E'Situated upon the eight petals of the jeweled altar is Sri Radha and Sri Hari
surrounded by Their attendants the eight chief gopis. There Krsna performs His
amorous pastimes which are just like a waterfall of nectar.', E'',
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
    E'(তার) সুগীত-নর্ত্তনে, সব সখী-গণে, তুষিচে যুগল-ধনে
(তখোন) কৃষ্ণ-লীলা হেরি'', প্রকৃতি-সুন্দরী, বিস্তারিচে শোভা বনে', E'(তার) সুগীত-নর্ত্তনে, সব সখী-গণে, তুষিচে যুগল-ধনে
(তখোন) কৃষ্ণ-লীলা হেরি'', প্রকৃতি-সুন্দরী, বিস্তারিচে শোভা বনে',
    E'kṛṣṇa-keli
sudhā-prasravana
(tāra)
aṣṭa-dalopari, śrī rādhā śrī hari,
aṣṭa-sakhī parijana', E'кр̣шн̣а-келі
судга̄-прасравана
(та̄ра)
ашт̣а-далопарі, ш́рı̄ ра̄дга̄ ш́рı̄ харі,
ашт̣а-сакхı̄ паріджана',
    E'', E'',
    E'By singing sweet songs and by dancing nicely, all the gopis satisfy the
treasured Divine Couple. Thus I am beholding Krsna''s pastimes with His
beautiful female consorts expanding throughout the splendorous forest.', E'',
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
    E'(আমি) ঘরে না যাইব, বনে প্রবেশিব, ও লীলা-রসের তরে
(আমি) ত্যজি'' কুল-লাজ, ভজ ব্রজ-রাজ, বিনোদ মিনতি করে', E'(আমি) ঘরে না যাইব, বনে প্রবেশিব, ও লীলা-রসের তরে
(আমি) ত্যজি'' কুল-লাজ, ভজ ব্রজ-রাজ, বিনোদ মিনতি করে',
    E'(tāra)
sugīta-nartane, saba sakhī-gaṇe, tuṣiche yugala-dhane
(takhon)
kṛṣṇa-līlā heri'', prakṛti-sundarī,
vistāriche śobhā vane', E'(та̄ра)
суґı̄та-нартане, саба сакхı̄-ґан̣е, тушічхе йуґала-дгане
(такхон)
кр̣шн̣а-лı̄ла̄ хері'', пракр̣ті-сундарı̄,
віста̄річхе ш́обга̄ ване',
    E'', E'',
    E'For the sake of the mellows of such pastimes, I will not go to my home, but I
will instead enter into the forest. Renouncing all shyness due to fear of
family members, just worship the Lord of Vraja. This is the humble submission of
Bhaktivinoda.
Remarks/ Extra Information:
No
Extra Information available for this song!
MUSICAL
NOTATION:
♫
Ami Jamuna Puline
30, 2017', E'',
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
    E'(āmi)
ghare nā jāiba, vane praveśiba, o līlā-rasera tare
(āmi)
tyaji'' kula-lāja, bhaja vraja-rāja, vinoda minati kare
WORD', E'(а̄мі)
ґгаре на̄ джа̄іба, ване правеш́іба, о лı̄ла̄-расера таре
(а̄мі)
тйаджі'' кула-ла̄джа, бгаджа враджа-ра̄джа, вінода мінаті каре
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
    translation_en = EXCLUDED.translation_en;


  -- Section 14: Ucchvasa - Rasa Kirtana
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 14, E'Ecstasy - Glorifying the Rasa', E'Уччгваса - Раса-кіртана (Екстаз - Оспівування раси)', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 14;


  -- Song 1: Krsna Bamsi Gita Suni
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Krsna Bamsi Gita Suni', E'', 'verses', true)
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
    E'', E'',
    E'Song Name: Krsna Bamsi Gita Suni
Official Name: Ucchvasa: Ucchvasa Kirtana Rasa Kirtana Song 1
Author: Bhaktivinoda Thakura
Book Name: Kalyana
Kalpataru
Language: Bengali', E'Сонґ Наме: Крсна Бамсі Ґіта Суні
Оffічіал Наме: Уччхваса: Уччхваса Кіртана Раса Кіртана Сонґ 1
Аутхор: Бхактівінода Тхакура
Боок Наме: Калйана
Калпатару
Ланґуаґе: Бенґалі',
    E'', E'',
    E'1) By hearing the song of Krsna''s flute, seeing His picture, and hearing other
persons describe His wonderful qualities, my heart has
become attacked and afflicted with remembrance of my previous attachment to
Him. Possessed with all the symptoms of madness, I wildly run
here and there seeking the company of the gopis.
2) I have gone to a grove
in the forest bowers for the lovers'' rendezvous. I have paid no heed to the
prohibitions of my family members, I have completely ignored all of my
innumerable household duties, and I have not even considered what religious or
irreligious activity is for me.
3) Going to the bank of the
Yamuna and addressing all the gopis
there, I have inquired from them news about he whereabouts of my most dearly
Beloved. Giving up all fear in my heart, I enter into the forest following the
direction of the flute''s vibration.
4) Just as a river flows
into the sea, I irresistibly run like a very swift current, thus proving my
chastity. Quickly reaching the forest bowers, I finally come into the presence
of Sri Krsna, in my mood of total self-surrender.
5) Oh why is my pen so weak
an feeble? Why won''t it move any further? I cannot
possibly express the inception of the transcendental Lovers'' meeting, which is
causing my heart to tremble and throb.
6) My mind has no
capability to describe the essence of the transcendental Lovers'' meeting, Their enjoyment together, Their separation or any other
pastimes.
7) Only the most unfortunate
persons cannot understand the essence of the truth of the rasa-lila,
just as a hog cannot recognize what is a pearl necklace.
8) Considering for the
benefit of those who have no capacity for hearing about such things, I have
thus ended my kirtan here.
REMARKS/EXTRA INFORMATION:
This
is the final song in Kalyana Kalpataru.
This is also the final song he wrote from his five major songbooks.', E'',
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
    E'', E'',
    E'krsna bamsi-gita suni'', dekhi'' citra-patakhani,
loka-mukhe guna sravaniya
purva-ragakranta cita, unmada-laksananvita,
sakhi-sange calila dhaiya', E'крсна бамсі-ґіта суні'', декхі'' чітра-патакхані,
лока-мукхе ґуна сраванійа
пурва-раґакранта чіта, унмада-лаксананвіта,
сакхі-санґе чаліла дгаійа',
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
    E'', E'',
    E'nikunja-kanane korilo abhisar
na manilo nibarana, grha-karya aganana,
dharmadharma na korilo bicar', E'нікунджа-канане коріло абгісар
на маніло нібарана, ґрха-карйа аґанана,
дгармадгарма на коріло бічар',
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
    E'', E'',
    E'jamuna-puline giya, sakhi-gane sambodhiya,
jijnasilo priyer uddesa
chadilo praner bhoy banete
pravesa hoy,
bamsi-dhvani koriya nirdesa', E'джамуна-пуліне ґійа, сакхі-ґане самбодгійа,
джіджнасіло прійер уддеса
чхаділо пранер бгой банете
правеса хой,
бамсі-дгвані корійа нірдеса',
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
    E'nadi jatha sindhu-prati, dhay ati vegavati,
sei-rupa rasavati sati
ati vege junja-bane, giya krsna-sannidhane,
atma-nibedane koilo mati', E'наді джатха сіндгу-праті, дгай аті веґаваті,
сеі-рупа расаваті саті
аті веґе джунджа-бане, ґійа крсна-саннідгане,
атма-нібедане коіло маті',
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
    E'keno mor durbala
lekhani hami sare?
abhisar arambhiya sakampa antare', E'кено мор дурбала
лекхані хамі саре?
абгісар арамбгійа сакампа антаре',
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
    E'milana, sambhoga, bipralambhadi-barnana
prakasa korite nahi sare
mama mana', E'мілана, самбгоґа, біпраламбгаді-барнана
пракаса коріте нахі саре
мама мана',
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
    v_chapter_id, '8', 8,
    E'', E'',
    E'durbhaga na bujhe rasalila
tattwa-sar
sukara jemana nahi cine mukta har', E'дурбгаґа на буджхе расаліла
таттва-сар
сукара джемана нахі чіне мукта хар',
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
    v_chapter_id, '9', 9,
    E'', E'',
    E'adhikar-hina-jana-mangala cintiya
kirtana korinu sesa kal
vicariya', E'адгікар-хіна-джана-манґала чінтійа
кіртана коріну сеса кал
вічарійа',
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
