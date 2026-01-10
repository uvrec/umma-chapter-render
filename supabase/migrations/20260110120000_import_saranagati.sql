-- Import Saranagati by Bhaktivinoda Thakura
-- Proper structure: books -> cantos -> chapters -> verses

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
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'শ্রী-কৃষ্ণ-চৈতন্য প্রভু জীবে দয়া করি
স্ব-পার্ষদ স্বীয় ধাম সহ অবতরি', E'śrī-kṛṣṇa-caitanya
prabhu jīve doyā kori
swa-pārṣada
swīya dhāma saha avatari', E'Out of compassion for the fallen souls, Sri Krisna Caitanya came to this world
with His personal associates and divine abode to teach saranagati (the goal of
surrender), surrender to the almighty Godhead, and to freely distribute
ecstatic love of God, which is ordinarily very difficult to obtain. This
saranagati is the very life of the true devotee
3-', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'অত্যন্ত দুর্লভ প্রেম করিবারে দান
শিখায় শরণাগতি ভকতের প্রান', E'atyanta
durlabha prema koribāre dāna
śikhāya
śaraṇāgati bhakatera prāna', E'The ways of saranagati are humility, dedication of the self, acceptance of the
Lord as ones only maintainer, faith that Krishna will surely protect,
execution of only those acts favorable to pure devotion, and renunciation of
conduct adverse to pure devotion.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'দৈন্য, আত্ম-নিবেদন, গোপ্তৃত্বে বরণ
অবশ্য রক্ষীবে কৃষ্ণ-বিশ্বাস, পালন', E'dainya,
ātma-nivedana, goptṛtve varaṇa
avaśya
rakṣībe kṛṣṇaviśvāsa, pālana', E'The
youthful son of Nanda Maharaja, Sri Krishna, hears the prayers of anyone who
takes refuge in Him by this six-fold practice.
6-', E'', E'У своєму поясненні до **«Чайтанья-чарітамріта»**, Мадг''я-ліла 20.135, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Відданий не буде покладатися на свої матеріальні ресурси, а на милість Верховного Бога-Особи, який може дати справжній захист. Це називається *ракшішьяті ті вішвасах*, або "*авашья ракшібе крішна*"—*вішваса палана*».

Під час лекції зі **«Шрімад-Бгаґаватам»** 6.3.16-17 (Ґоракхпур, 10 лютого 1971 року), Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Віддатися означає просто приймати сприятливе служіння Крішні та відкидати все, що несприятливе, а далі йде *авашья ракшібе крішна вішваса-палана*: "І бути твердо переконаним, що Крішна дасть мені весь захист"».', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'ভকি-অনুকূল-মাত্র কার্যের স্বীকর
ভক্তি-প্রতিকূল-ভাব বর্জনাঙ্গিকার', E'bhaki-anukūla-mātra
kāryera svīkara
bhakti-pratikūla-bhāva
varjanāńgikāra', E'Bhaktivinoda
places a straw between his teeth, prostrates himself before the two Goswamis,
Sri Rupa and Sri Sanatana, and clasps their lotus feet with his hands. I am
certainly the lowest of men. he tells them weeping, but please make me the
best of men by teaching me the ways of saranagati', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'ষড-অঙ্গ শরণাগতি হৈবে যাহার
তাহার প্রার্থনা শুনে শ্রী-নন্দ-কুমার', E'ṣaḍ-ańga
śaraṇāgati hoibe jāhāra
tāhāra
prārthanā śune śrī-nanda-kumāra', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'রূপ-সনাতন-পদে দন্তে তৃণ করি
ভকতিবিনোদ পড়ে দুহুঁ পদ ধরি', E'rūpa-sanātana-pade
dante tṛṇa kori
bhakativinoda
poḍe duhuń pada dhori', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'কাঁদিয়া কাঁদিয়া বলে আমি তো অধম
শিখায়ে শরণাগতি কর হে উত্তম', E'kāńdiyā
kāńdiyā bole āmi to adhama
śikhāye
śaraṇāgati koro he uttama', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 2, Song 1: Bhuliya Tomare
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Bhuliya Tomare', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'ভুলিয়া তোমারে, সংসারে আসিয়া,
পেয়ে নানাবিধ ব্যথা
তোমার চরণে, আসিয়াছি আমি,
বলিব দুঃখের কথা', E'bhuliyā
tomāre, saḿsāre āsiyā,
peye nānā-vidha byathā
tomāra caraṇe, āsiyāchi āmi,
bolibo duḥkhera kathā', E'I
forsook You, O Lord, and came to this world of pain and sorrow. Now I submit my
tale of woe at Your lotus feet.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'জননী-জঠরে, ছিলাম যখন,
বিষম বন্ধনপাশে
একবার প্রভু! দেখা দিয়া মোরে,
বঞ্চিলে এ দীন দাসে', E'jananī
jaṭhare, chilāma jakhona,
biṣama bandhana-pāśe
eka-bāra prabhu! dekhā diyā more,
vañcile e dīna dāse', E'While still in the unbearable fetters of my mothers womb, I saw You before me
You revealed Yourself but briefly and then abandoned this poor servant of
Yours.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'তখন ভাবিনু, জনম পাইয়া,
করিব ভজন তব
জনম হৈল, পড়ি মায়া-জালে,
না হৈল জ্ঞান লব', E'takhona
bhāvinu, janama pāiyā,
koribo bhajana tava
janama hoilo, paḍi'' māyā-jāle,
nā hoilo jñāna-lava', E'At
that moment I swore to worship You after taking birth; but birth came, and with
it the network of worldly illusion which robbed me of all good sense.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'আদরের ছেলে, স্বজনের কোলে,
হাসিয়া কাটানু কাল
জনক-জননী-স্নেহেতে ভুলিয়া,
সংসার লাগিল ভাল', E'ādarera
chele, sva-janera kole,
hāsiyā kāṭānu kāla
janaka jananī-snehete bhuliyā,
saḿsāra lāgilo bhālo', E'As
a fondled son in the lap of relatives, I passed my time smiling and laughing.
My parents affection helped me to forget the pangs of birth, and I thought the
world was very nice.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'ক্রমে দিন দিন, বালক হৈয়া,
খেলিনু বালক-সহ
আর কিছু দিনে, জ্ঞান উপজিল,
পাঠ পড়ি অহরহঃ', E'krame
dina dina, bālaka hoiyā,
bhelinu bālaka-saha
āra kichu dine, jnāna upajilo,
pāṭha poḍi ahar-ahaḥ', E'Day
by day I grew and soon began playing with other boys. Shortly my powers of
understanding emerged. I read and studied my lessons incessantly.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'বিদ্যার গৌরবে, ভ্রমি দেশে দেশে,
ধন উপার্জন করি
স্বজন পালন, করি একমনে,
ভুলিনু তোমারে, হরি!', E'vidyāra
gaurave, bhrami'' deśe deśe,
dhana uparjana kori
sva-jana pālana, kori eka-mane,
bhulinu tomāre, hari!', E'Travelling from place to place, proud of my education, I grew wealthy and
maintained my family with undivided attention. O Lord Hari, I forgot You!', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'বার্ধক্যে এখন, ভকতিবিনোদ,
কাঁদিয়া কাতর অতি
না ভজিয়া তোরে, দিন বৃথা গেল,
এখন কি হবে গতি?', E'bārdhakye
ekhona, bhakativinoda,
kāṇdiyā kātara ati
nā bhajiyā tore, dina bṛthā gelo,
ekhona ki habe gati?', E'Now
in old age, Bhaktivinoda is sad. He weeps. I failed to worship You, O Lord, and
instead passed my life in vain. What will be my fate now?', E'This
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
shall engage myself simply on devotional service to get out of this maya. But unfortunately, exactly after my birth, janama hoilo, padi
maya-jale, na hoilo jnana-lava, as soon as I
got out of the womb, immediately maya, the illusory
energy, captured me and I forgot that I was in such precarious condition, and I
was crying and praying to the Lord that this time I shall get out and engage
myself in devotional service. But all these senses were lost as soon as I took
my birth. Then the next stage is adarera chele, sva-janera kole. Then I become a very pet child and everyone is
taking me on the lap, and I thought, Life is very nice, everyone loves me.
Then I thought, This material life is very good. Adarera chele,
sva-janera kole, hasiya katanu kala.
Because there is no trouble. As soon as I am little
difficulty, everyone comes forward to give me relief. So I thought my life will
go on like this. So I simply wasted my time simply by smiling, and that smiling
became attractive to my relatives and they patted me. I thought, This is the
life. Janaki...janaka janani-snehete
bhuliya, samsara lagilo. At that time, a great deal of affection of
parents. So I thought material life is very nice. Krame
dina dina,
balaka hoiya, khelinu balaka-saha. Then
gradually I grew up and I began to play with my childhood friends, and it was
very nice life. And after some days, when I was little intelligent, then I was
put into school. So I began to study very seriously. Then
after that, vidyara gaurave,
bhrami dese dese, dhana uparjana
kori. Then being puffed up... Bhaktivinode Thakura was
magistrate. So he was transferred from one place to another. He is stating his
life, that vidyara gaurave,
Because I was little educated, so I was posted and I was earning decently. So
I was thinking, It is very nice. Vidyara gaurave, bhrami
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
what to do. Therefore, I surrender.', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 2, Song 2: Vidyara Vilase Katainu Kala
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Vidyara Vilase Katainu Kala', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'বিদ্যার বিলাসে, কাটাইনু কাল,
পরম সাহসে আমি
তোমার চরণ, না ভজিনু কভু,
এখন শরণ তুমি', E'vidyāra
vilāse, kāṭāinu kāla,
parama sāhase āmi
tomāra caraṇa, nā bhajinu kabhu,
ekhona śaraṇa tumi', E'With great enthusiasm I spent my time in the pleasures of mundane learning, and
never worshiped Your lotus feet, O Lord. Now You are my only shelter.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'পড়িতে পড়িতে, ভরসা বারিল,
জ্ঞানে গতি হবে মানি
সে আশা বিফল, সে জ্ঞান দুর্ব্বল,
সে জ্ঞান অজ্ঞান জানি', E'poḍite
poḍite, bharasā bārilo,
jñāne gati habe māni''
se āśā biphala, se jñāna durbala,
se jñāna ajñāna jāni', E'Reading on and on, my hopes grew and grew, for I considered the acquisition of
material knowledge to be life''s true goal. How fruitless those hopes turned out
to be, for all my knowledge proved feeble. Now I know that all such erudition
is actually pure ignorance.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'জড-বিদ্যা জত, মাযার বৈভব,
তোমার ভজনে বাধা
মোহ জনমিযা, অনিত্য সংসারে,
জীবকে করযে গাধা', E'jaḍa-vidyā
jata, māyāra vaibhava,
tomāra bhajane bādhā
moha janamiyā, anitya saḿsāre,
jīvake koraye gādhā', E'All the so-called knowledge of this world is born of the flickering potency of
Your illusory energy (maya). It is an impediment to the execution of devotional
service to You. Indulgence in mundane knowledge verily makes an ass of the
eternal soul by encouraging his infatuation with this temporary world.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'সেই গাধা হযে, সংসারের বোঝা,
বহিনু অনেক কাল
বার্ধক্যে এখন, শক্তির অভাবে,
কিছু নাহি লাগে ভাল', E'sei
gādhā ho''ye, saḿsārera bojhā,
bahinu aneka kāla
bārdhakye ekhona, śaktira abhāve,
kichu nāhi lāge bhālo', E'Here is one person who has been turned into such an ass, who for so long has
carried on his back the useless burden of material existence. Now in my old
age, for want of the power to enjoy, I find that nothing at all pleases me.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'জীবন জাতনা, হৈল এখন,
সে বিদ্যা অবিদ্যা ভেল
অবিদ্যার জ্বালা, ঘটিল বিষম,
সে বিদ্যা হৈল শেল', E'jīvana
jātanā, hoilo ekhona,
se vidyā avidyā bhelo
avidyāra jwālā, ghaṭilo biṣama,
se vidyā hoilo śelo', E'Life has now become agony, for my so-called erudite knowledge has proven itself
to be worthless ignorance. Material knowledge has now become a pointed shaft
and has pierced my heart with the intolerable, burning pain of ignorance.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'তোমার চরণ, বিনা কিছু ধন,
সংসারে না আছে আর
ভকতিবিনোদ, জড-বিদ্যা ছাড়ি,
তুয়া পদ করে সার
2015', E'tomāra
caraṇa, binā kichu dhana,
saḿsāre nā āche āra
bhakativinoda, jaḍa-vidyā chāḍi,''
tuwā pada kore sāra
WORD
FOR WORD', E'O Lord, there is no treasure worth seeking in this world other than Your lotus
feet. Bhaktivinoda abandons all his mundane knowledge and makes Your lotus feet
the sum and substance of his life.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 2, Song 3: Yauvane Jakhon Dhana Uparjane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Yauvane Jakhon Dhana Uparjane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'যৌবনে যখন, ধন-উপার্জনে,
হৈনু বিপুল কামী
ধরম স্মরিয়া, গৃহিনীর কর,
ধরিনু তখন আমি', E'yauvane
jakhona, dhana-upārjane,
hoinu
vipula kāmī
dharama
smariyā, gṛhinīra kara,
dhorinu
takhona āmi', E'When I was young, I greatly desired to earn money. At that time bearing in mind
the codes of religion, I took a wife.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'সংসার পাতায়ে, তাহার সহিত,
কাল-খয় কৈনু কত
বহু সুত-সুতা, জনম লোভিল,
মরমে হৈনু হত', E'saḿsāra
pātāye, tāhāra sahita,
kāla-khoy
koinu koto
bahu
suta-sutā, janama lobhilo,
marame
hoinu hato', E'Together we set up a household, wasted much time, had many sons and daughters;
my heart grew heavy.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'সংসারের ভার, বাড়ে দিনে দিনে,
অচল হৈল গতি
বার্ধক্য আসিয়া, ঘেরিল আমারে,
অস্থির হৈল মতি', E'saḿsārera
bhāra, bāḍe dine dine,
acala
hoilo gati
bārdhakya
āsiyā, gherilo āmāre,
asthira
hoilo mati', E'The
burden increased day by day, I felt my life at a standstill. Old age came,
grabbed me, and made my mind fickle and disturbed.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'পীড়ায় অস্থির, চিন্তায় জ্বরিত,
অভাবে জ্বলিত চিত
উপায় না দেখি, অন্ধকার-ময়,
এখন হয়েছি ভীত', E'pīḍāya
asthira, cintāya jwarita,
abhāve
jwalita cita
upāya
nā dekhi, andhakāra-moya,
ekhona
hoyechi bhīta', E'Diseases trouble me now, and constant anxiety has made me feverish. My heart
burns from lack of satisfaction, and I see no way out. All is darkness and I am
very much afraid.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'সংসার-তটনী- স্রোত নহে শেষ,
মরণ নিকটে ঘোর
সব সমাপিয়া, ভজিব তোমায়,
এ আশা বিফল মোর', E'saḿsāra-taṭanī-
srota nahe śeṣa,
maraṇa
nikaṭe ghora
saba
samāpiyā, bhojibo tomāya,
e
āśā biphala mora', E'The
current of this worldly river is strong and relentless. A frightening, gloomy
death approaches. How I wish I could give up my worldly attachments. I would
worship You, O Lord, but it is a useless hope.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'এবে শুন প্রভু! আমি গতি-হীন,
ভকতিবিনোদ কয়
তব কৃপা বিনা, সকলি নিরাশা,
দেহ মোরে পদাশ্রয়', E'ebe
śuno prabhu! āmi gati-hīna,
bhakativinoda
koya
tava
kṛpā binā, sakali nirāśā,
deho
more padāśroya', E'Now
please hear me, O Lord, for I am utterly helpless. Bhaktivinoda says, Without
Your mercy, everything is lost. Please give me the shelter of Your lotus feet.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 2, Song 4: Amar Jivan
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Amar Jivan', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'আমার জীবন, সদা পাপে রত,
নাহিক পুণ্যের লেষ
পরেরে উদ্বেগ, দিয়াছি যে কত,
দিয়াছি জীবেরে ক্লেশ', E'āmāra
jīvana, sadā pāpe rata,
nāhiko
punyera leṣa
parere
udvega, diyāchi je koto,
diyāchi
jīvere kleśa', E'I am
an impious sinner and have caused others great anxiety and trouble.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'নিজ সুখ লাগি, পাপে নাহি ডোরি,
দয়া-হীন স্বার্থ-পর
পর-সুখে দুঃখী, সদা মিথ্য-ভাষী,
পর-দুঃখ সুখ-কর', E'nija
sukha lāgi, pāpe nāhi ḍori,
doyā-hīna
swārtha-paro
para-sukhe
duḥkhī, sadā mithya-bhāṣī,
para-duḥkha
sukha-karo', E'I
have never hesitated to perform sinful act for my own enjoyment. Devoid of all
compassion, concerned only with my own selfish interests, I am remorseful
seeing others happy. I am a perpetual liar, and the misery of others is a
source of great pleasure for me.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'আশেষ কামনা, হৃদি মাঝে মোর,
ক্রোধী, দম্ভ-পরায়ণ
মদ-মত্ত সদা, বিষয়ে মোহিত,
হিংসা-গর্ব্ব বিভূষণ', E'aśeṣa
kāmanā, hṛdi mājhe mora,
krodhī,
dambha-parāyana
mada-matta
sadā, viṣaye mohita,
hiḿsā-garva
vibhūṣana', E'The
material desires within the core of my heart are unlimited. I am wrathful,
devoted to false pride and arrogance, intoxicated by vanity, and bewildered by
worldly affairs. Envy and egotism are the ornaments I wear.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'নিদ্রালস্য হত, সুকার্য়্যে বিরত,
অকার্য়্যে উদ্যোগী আমি
প্রতিষ্ঠ লাগিয়া, শাঠ্য-আচরণ,
লোভ-হত সদা কামী', E'nidrālasya
hata, sukārye virata,
akārye
udyogī āmi
pratiṣṭha
lāgiyā, śāṭhya-ācaraṇa,
lobha-hata
sadā kāmī', E'Ruined by laziness and sleep, I resist all pious deeds; yet I am very active
and enthusiastic to perform wicked acts. For worldly fame and reputation I
engage in the practice of deceitfulness. Thus I am destroyed by my own greed
and am always lustful.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'এ হেন দুর্জ্জন, সজ-জন-বর্জ্জিত,
অপরাধি নিরন্তর
শুভ-কার্য়্য-শূন্য, সদানর্থ-মনাঃ,
নানা দুঃখে জর জর', E'e
heno durjana, saj-jana-varjita,
aparādhi
nirantara
śubha-kārya-śūnya,
sadānartha-manāḥ,
nānā
duḥkhe jara jara', E'A
vile, wicked man such as this, rejected by godly people, is a constant
offender. I am such a person, devoid of all good works, forever inclined toward
evil, worn out and wasted by various miseries.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'বার্ধক্যে এখন, উপায়-বিহীন,
তাতে দীন অকিঞ্চন
ভকতিবিনোদ, প্রভুর চরণে,
করে দুঃখ নিবেদন', E'bārdhakye
ekhona, upāya-vihīna,
tāte
dīna akiñcana
bhakativinoda,
prabhura caraṇe,
kore
duḥkha nivedana
WORD
FOR WORD', E'Now
in old age, deprived of all means of success, humbled and poor, Bhaktivinoda
submits his tale of grief at the feet of the Supreme Lord.', E'Amara jivana sada pape rata nahiko punyera lesa. This
is a song sung by Bhaktivinoda Thakura
in Vaisnava humbleness. A Vaisnava
is always meek and humble. So he is describing the life of the people in
general, taking himself to be one of them. He says that My life is always
engaged in sinful activities, and if you try to find out, you will not find
even a trace of pious activitiesonly sinful activities. And parere udvega, diyachi ye koto, diyachi jivere klesa: I am always inclined to give trouble to
other living entities. That is my business. I want to see that others are
suffering, and then I enjoy. Nija sukha lagi, pape
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
Now in my old age I have no alternative; tate
dina akincana:
therefore by force I have now become very humble and meek. Bhakativinoda prabhura carane, kore duhkha
nivedana: Thus Bhaktivinoda
Thakura is offering his sad statement of his lifes
activities at the lotus feet of the Supreme Lord.', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 2, Song 5: Suno Mor Duhkher Kahini
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Suno Mor Duhkher Kahini', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'(প্রভু হে!) শুন মোর দুঃখের কাহিনী
বিষয়-হলাহল, সুধা-ভানে পিয়লুঁ,
আব অবসান দিনমণি', E'(prabhu
he!) śuno mor duḥkher kāhinī
viṣaya-halāhala,
sudhā-bhāne piyaluń,
āb
avasāna dinamaṇi', E'Hear, O Lord, my story of sadness. I drank the deadly poison of worldliness,
pretending it was nectar, and now the sun is setting on the horizon of my life.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'খেলা-রসে শৈশব, পঢ়ৈতে কৈশোর,
গঙাওলুঁ, না ভেল বিবেক
ভোগ-বশে যৌবনে, ঘর পাতি বসিলুঁ,
সুত-মিত বাঢ়ল অনেক', E'khelā-rase
śaiśava, poḍhaite kaiśora,
gowāoluń,
nā bhelo vivek
bhoga-baśe
yauvane, ghara pāti bosiluń,
suta-mita
bāḍhalo anek', E'I spent my childhood in play, my youth in academic pursuit, and in me there was
no sense of right or wrong. In young manhood I set up a household and settled
down to the spell of material enjoyment. Children and friends quickly
multiplied.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'বৃদ্ধ-কাল আওল, সব সুখ ভাগল,
পীড়া-বশে হৈনু কাতর
সর্বেন্দ্রিয় দুর্বল, ক্ষীন কলেবর,
ভোগাভাবে দুঃখিত অন্তর', E'vṛddha-kāla
āolo, saba sukha bhāgalo,
pīḍā-baśe
hoinu kātar
sarvendriya
durbala, kṣīna kalevara,
bhogābhāve
duḥkhita antar', E'Soon old age arrived, and all happiness departed. Subjected to disease, troubled
and weak, all my senses are feeble now, my body racked and exhausted, and my
spirits downcast in the absence of youthful pleasures.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'জ্ঞান-লব-হীন, ভক্তি-রসে বঞ্ছিত,
আর মোর কি হবে উপায়
পতিত-বন্ধু, তুহুঁ, পতিতাধম হাম,
কৃপায় উঠাও তব পায়', E'jñāna-lava-hīna,
bhakti-rase vañchita,
āra
mora ki habe upāy
patita-bandhu,
tuhuń, patitādhama hāma,
kṛpāya
uṭhāo tava pāy', E'Devoid of even a particle of devotion, lacking any enlightenment  what help is
there for me now? Only You, O Lord, friend of the fallen. I am certainly
fallen, the lowest of men. Please, therefore lift me to Your lotus feet.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'বিচারিতে আবহি, গুন নাহি পাওবি,
কৃপা কর, ছোড়ত বিচার
তব পদ-পঙ্কজ- সীধু পিবাওতো,
ভকতিবিনোদ কর পার', E'vicārite
ābahi, guna nāhi pāobi,
kṛpā
koro, choḍato vicār
tava
pada-pańkaja- sīdhu pibāoto,
bhakativinoda
karo pār', E'Were You to judge me now, You would find no good qualities. Have mercy and
judge me not. Cause me to drink the honey of Your lotus feet and thereby
deliver this Bhaktivinoda.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 2, Song 6: Tuwa Pade E Minati Mor
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Tuwa Pade E Minati Mor', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'(প্রভু হে!) তুয়া পদে এ মিনতি মোর
তুয়া পদ-পল্লব, ত্যজত মরু-মন,
বিষম বিষয়ে ভেল ভর', E'(prabhu
he!) tuwā pade e minati mor
tuwā
pada-pallava, tyajato maru-mana,
viṣama
viṣaye bhelo bhor', E'At
Your feet, soft as new-grown leaves, I offer this humble prayer. Those feet
shelter the fallen souls who burn from the heat of material existence. But I
gave up their shelter, and now my mind scorched by the fire of worldliness, has
dried up like a desert.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'উঠয়িতে তাকত, পুন নাহি মিলো-ই,
অনুদিন করহুঁ হুতাশ
দীন-জন-নাথ, তুহুঁ কহায়সি,
তুমারি চরণ মম আশ', E'uṭhayite
tākata, puna nāhi milo-i,
anudina
korohuń hutāś
dīna-jana-nātha,
tuhuń kahāyasi,
tumāri
caraṇa mama āś', E'I
find no strength to go on, and thus I spend my days lamenting. My only desire
now is for Your lotus feet, O Lord of the meek and humble.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'ঐছন দীন-জন, কহি নাহি মিলো-ই,
তুহুঁ মোরে কর পরসাদ
তুয়া জন-সঙ্গে, তুয়া কথা-রঙ্গে,
ছাডহুঁ সকল পরমাদ', E'aichana
dīna-jana, kohi nāhi milo-i,
tuhuń
more koro parasād
tuwā
jana-sańge, tuwā kathā-rańge,
chāḍahuń
sakala paramād', E'Has
there ever been a soul as forlorn as me? Please be merciful and award me the
association of Your devotees, for by tasting the pleasure of hearing your
pastimes I shall give up all evils.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'তুয়া ধাম-মাহে, তুয়া নাম গাওত,
গঙায়বুঁ দিবা-নিশি আশ
তুয়া পদ-ছায়া, পরম সুশীতল,
মাগে ভকতিবিনোদ দাস', E'tuwā
dhāma-māhe, tuwā nāma gāoto,
gowāyabuń
divā-niśi āś
tuwā
pada-chāyā, parama suśītala,
māge
bhakativinoda dās', E'One
hope animates my soul: to spend day and night in Your divine abode singing Your
holy name. Your tiny servant Bhaktivinoda begs a place in the delightfully
cooling shade of Your feet.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 2, Song 7: Emona Durmati
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Emona Durmati', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'(প্রভু হে!)
এমন দুর্মতি, সংসার ভিতরে,
পড়িয়া আছিনু আমি
তব নিজ-জন, কন মহাজনে,
পাঠাইয়া দিলে তুমি', E'(prabhu
he!)
emona
durmati, saḿsāra bhitore,
poḍiyā
āchinu āmi
tava
nija-jana, kono mahājane,
pāṭhāiyā
dile tumi', E'Oh
Lord! Such a wicked mind has brought me into this world, but one of Your pure
and elevated devotees has come to bring me out of it.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'দয়া করি মোরে, পতিত দেখিয়া,
কহিল আমারে গিয়া
ওহে দীন-জন, শুন ভাল কথা,
উল্লসিত হবে হিয়া', E'doyā
kori more, patita dekhiyā,
kohilo
āmāre giyā
ohe
dīna-jana, śuno bhālo kathā,
ullasita
habe hiyā', E'He
saw me so fallen and wretched, took pity, and came to me saying, O humbled
soul, please listen to this good tiding, for it will gladden your heart.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'তোমারে তারিতে, শ্রী-কৃষ্ণ-চৈতন্য,
নবদ্বীপে অবতার
তোমা হেন কত, দীন হীন জনে,
করিলেন ভব-পার', E'tomāre
tārite, śrī-kṛṣṇa-caitanya,
navadwīpe
avatār
tomā
heno koto, dīna hīna jane,
korilena
bhava-pār', E'Sri Krsna Caitanya has appeared in the land of Navadvipa to deliver you. He
has safely conducted many miserable souls such as you across the sea of worldly
existence.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'বেদের প্রতিজ্ঞা, রাখিবার তরে,
রুক্ম-বর্ন বিপ্র-সুত
মহাপ্রভু নামে, নদীয়া মাতায়,
সঙ্গে ভাই অবধূত', E'vedera
pratijñā, rākhibāra tare,
rukma-varna
vipra-suta
mahāprabhu
nāme, nadīyā mātāya,
sańge
bhāi avadhūta', E'To
fulfill the promise of the Vedas, the son of a brahmana bearing the name
Mahaprabhu of golden complexion, has descended with His brother the avadhuta
Nityananda. Together They have overwhelmed all of Nadia with divine ecstasy.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'নন্দ-সুত যিনি, চৈতন্য গোসাই,
নিজ-নাম করি দান
তারিল জগত্‍, তুমি-ও যাইয়া,
লহ নিজ-পরিত্রাণ', E'nanda-suta
jini, caitanya gosāi,
nija-nāma
kori dān
tārilo
jagat, tumi-o jāiyā,
loho
nija-paritrāṇ', E'Sri Caitanya, who is Krishna Himself, the son of Nanda, has saved the world by
freely distributing His own holy name. Go also and receive your deliverance.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'সে কথা শুনিয়া, আসিয়াছি, নাথ!
তোমার চরণ-তলে
ভকতিবিনোদ, কাঁদিয়া কাঁদিয়া,
আপন-কাহিনী বলে', E'se
kathā śuniyā, āsiyāchi, nātha!
tomāra
caraṇa-tale
bhakativinoda,
kāńdiyā kāńdiyā,
āpana-kāhinī
bole
WORD
FOR WORD', E'O
Lord, hearing those words, Bhaktivinoda has come weeping to the soles of Your
lotus feet and tells the story of his life.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 1: Na Korolun Karama
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Na Korolun Karama', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'না করলুঁ করম, গেয়ান নাহি ভেল,
না সেবিলুঁ চরণ তোহার
জড়-সুখে মাতিয়া, আপনকু বঞ্চ-ই,
পেখহুঁ চৌদিশ আন্ধিয়ার', E'nā
koroluń karama, geyāna nāhi bhelo,
nā
seviluń caraṇa tohār
jaḍa-sukhe
mātiyā, āpanaku vañca-i,
pekhahuń
caudiśa āndhiyār', E'I have earned neither piety nor knowledge. Overwhelmed by sensual pleasures, I
have cheated myself and now see only darkness in all directions.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'তুহুঁ নাথ! করুণা-নিদান
তুয়া পদ-পঙ্কজে, আত্ম সমর্পিলুঁ,
মোরে কৃপা করবি বিধান', E'tuhuń
nātha! karunā-nidān
tuwā
pada-pańkaje, ātma samarpiluń,
more
kṛpā korobi vidhān', E'O Lord, are the fountainhead of all mercy. I surrender myself at Your lotus
feet. Kindly show me Your compassion.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'প্রতিজ্ঞা তোহার ঐ, যো হি শরণাগত,
নাহি সো জানব পরমাদ
সো হাম দুষ্কৃতি, গতি না হের-ই আন,
আব মাগোঁ তুয়া পরসাদ', E'pratijñā
tohāra oi, jo hi śaraṇāgata,
nāhi
so jānabo paramād
so
hāma duṣkṛti, gati nā hera-i āna,
āb
māgoń tuwā parasād', E'It is Your promise that one who takes refuge in You will know no dangers or
fear. For a sinner like me there is no other shelter. I beg You now for infinite
grace.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'আন মনো-রথ, নিঃশেষ ছোড়ত,
কব হাম হৌবুঁ তোহারা
নিত্য-সেব্য তুহুঁ, নিত্য-সেবক মুঞি,
ভকতিবিনোদ ভাব সারা
2017', E'āna
mano-ratha, niḥśeṣa choḍato,
kab
hāma haubuń tohārā
nitya-sevya
tuhuń, nitya-sevaka mui,
bhakativinoda
bhāva sārā', E'O when will I know freedom from desire and thus become Yours? You are eternally
to be served, I am Your eternal servant, and that is the sum of Bhaktivinodas
devotional mood.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 2: Kohabun Ki Sarama Ki Bat
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Kohabun Ki Sarama Ki Bat', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'(প্রাণেশ্বর!) কহবুঁ কি শরম কি বাত
ঐছন পাপ নাহি, যো হাম না করলুঁ,
সহস্র সহস্র বেরি নাথ', E'(prāṇeśwar!)
kohobuń ki śarama ki bāt
aichana
pāp nāhi, jo hāma nā koraluń,
sahasra
sahasra beri nāth', E'How much more shall I tell You of my shameful story? There is no sin which I
have not committed thousands and thousands of times.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'সহি করম-ফল, ভবে মোকে পেশ-ই,
দোখ দেওব আব কাহি
তখনক পরিনাম, কছু না বিচারলুঁ,
আব পছু তরৈতে চাহি', E'sohi
karama-phala, bhave moke peśa-i,
dokha
deobo āb kāhi
takhonaka
parinām, kachu nā bicāraluń,
āb
pachu taraite cāhi', E'My life in this world has been one of affliction and torment as a result of
those sins. Whom will I blame but myself? At the time I did not consider the
consequences; now, in the aftermath, I seek to be saved.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'দোখ বিচার-ই, তুঁহু দণ্ড দেওবি,
হাম ভোগ করবুঁ সংসার
করত গতাগতি, ভকত-জন-সঙ্গে,
মতি রহু চরণে তোহার', E'dokha
vicāra-i, tuńhu danḍa deobi,
hāma
bhoga korabuń saḿsār
karato
gatāgati, bhakata-jana-sańge,
mati
rohu caraṇe tohār', E'After judging my sins, You should punish me, for I deserve to suffer the pangs
of rebirth in this world. I only pray that, as I wander through repeated births
and deaths, my mind may ever dwell at Your lotus feet in the company of
Vaisnavas.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'আপন চতুর্পন, তুয়া পদে সোঁপলুঁ,
হৃদয়-গরব দূরে গেল
দীন-দয়া-ময়, তুয়া কৃপা নিরমল,
ভকতিবিনোদ আশা ভেল
2017', E'āpana
caturpana, tuwā pade sońpaluń,
hṛdoya-garava
dūre gelo
dīna-doyā-moya,
tuwā kṛpā niramala,
bhakativinoda
āśā bhelo', E'I offer You this judicious prayer. My hearts false pride has gone far away. O
You who are so kind to the meek, Your pure mercy has become Bhaktivinodas only
hope.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 3: Manasa Deho Geho Jo Kichu Mor
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Manasa Deho Geho Jo Kichu Mor', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'মানস, দেহ, গেহ, যো কিছু মোর
অর্পিলূ তুয়া পদে, নন্দ-কিশোর!', E'mānasa,
deho, geho, jo kichu mor
arpilū tuwā pade, nanda-kiśor!', E'Mind, body, and family, whatever may be mine, I have surrendered at Your lotus feet,
O youthful son of Nanda!', E'', E'У своєму поясненні до **«Чайтанья-чарітамріта»**, Мадг''я-ліла 10.55, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Це процес віддання себе. Як співає Шріла Бгактівінод Тхакур: *манаса, деха, ґеха, йо кічху мора / арпілун туйа паде нанда-кішора!* Коли людина віддається лотосним стопам Господа, вона робить це з усім, що має у своєму володінні».', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'সম্পদে বিপদে, জীবনে-মরণে
দায় মম গেলা, তুবা ও-পদ বরণে', E'sampade
vipade, jīvane-maraṇe
dāy mama gelā, tuwā o-pada baraṇe', E'In
good fortune or in bad, in life or at death, all my difficulties have
disappeared by choosing those feet of Yours as my only shelter.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'মারবি রাখবি-যো ইচ্ছা তোহারা
নিত্য-দাস প্রতি তুবা অধিকারা', E'mārobi
rākhobi-jo icchā tohārā
nitya-dāsa prati tuwā adhikārā', E'Slay me or protect me as You wish, for You are the master of Your eternal servant.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'জন্মাওবি মোরে ইচ্ছা যদি তোর
ভক্ত-গৃহে জনি জন্ম হৌ মোর', E'janmāobi
moe icchā jadi tor
bhakta-gṛhe jani janma hau mor', E'If
it is Your will that I be born again, then may it be in the home of Your
devotee.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'কীট-জন্ম হৌ যথা তুবা দাস
বহির-মুখ ব্রহ্ম জন্মে নাহি আশ', E'kīṭa-janma
hau jathā tuwā dās
bahir-mukha brahma janme nāhi āś', E'May
I be born again even as a worm, so long as I may remain Your devotee. I have no
desire to be born as a Brahma averse to You.', E'', E'У своєму поясненні до **«Чайтанья-чарітамріта»**, Антья-ліла 1.24, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Шріла Бгактівінод Тхакур також співав: *кіта-джанма ха-у йатха туйа даса* (**«Шаранаґаті»** 11). Немає нічого поганого в тому, щоб народжуватися знову і знову. Наше єдине бажання має бути народитися під опікою вайшнава».', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'ভুক্তি-মুক্তি-স্পৃহা বিহীন যে ভক্ত
লভৈতে তাক সঙ্গ অনুরক্ত', E'bhukti-mukti-spṛhā
vihīna je bhakta
labhaite tāko sańga anurakta', E'I yearn
for the company of that devotee who is completely devoid of all desire for
worldly enjoyment or liberation.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'জনক, জননী, দয়িত, তনয়
প্রভু, গুরু, পতি-তুহূ সর্ব-ময়', E'janaka,
jananī, dayita, tanay
prabhu, guru, pati-tuhū sarva-moy', E'Father, mother, lover, son, Lord, preceptor, and husband; You are everything to
me.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'ভকতিবিনোদ কহে, শুন কান!
রাধা-নাথ! তুহূ হামার পরাণ', E'bhakativinoda
kohe, śuno kāna!
rādhā-nātha! tuhū hāmāra parāṇa
WORD
FOR WORD', E'Thakura Bhaktivinoda says, "O Kana, please hear me! O Lord of Radha, You
are my life and soul!"', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 4: Aham Mama Saba Arthe
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Aham Mama Saba Arthe', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'অহং মম-শব্দ-অর্থে যাহা কিছু হয়
অর্পিলুঙ তোমার পদে, ওহে দয়া-ময়!', E'`ahaḿ
mama-śabda-arthe jāhā kichu hoy
arpiluń
tomāra pade, ohe doyā-moy!', E'Whatever I am, whatever I possess, I offer at Your lotus feet, O merciful Lord.
I no longer belong to myself. Now I am exclusively Yours.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'আমার আমি ত নাথ! না রোহিনু আর
এখন হৈনু আমি কেবল তোমার', E'`āmāra
āmi to nātha! nā rohinu ār
ekhona
hoinu āmi kevala tomār', E'The
soul inhabiting this mortal body has given up the false ego attached to the word
I, and now the eternal, spiritual sense of being Yours has entered his heart.
4-', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'আমি শব্দে দেহী জীব অহংতা ছাড়িল
ত্বদীয়াভিমান আজি হৃদয়ে পশিল', E'`āmi
śabde dehī jīva ahaḿtā chāḍilo
twadīyābhimāna
āji hṛdoye paśilo', E'All my possessions - body, brothers, friends, and followers, wife, sons,
personal belongings, house and home- all of these I give You, for I have become
Your servant. Now I dwell in Your house.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'আমার সর্বস্ব-দেহ, গেহ অনুচর
ভাই, বন্ধু, দারা, সুত, দ্রব্য, দ্বার, ঘর', E'āmār
sarvasvadeho, geho anucar
bhāi,
bandhu, dārā, suta, dravya, dwāra, ghar', E'You
are the Lord of my house, and I Your most obedient servant. Your happiness is
my only endeavor now.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'সে সব হৈল তব, আমি হৈনু দাস
তোমার গৃহেতে এবে আমি করি বাস', E'se
saba hoilo tava, āmi hoinu dās
tomāra
gṛhete ebe āmi kori bās', E'Whatever piety or sins were done by me, by mind or deed, are no longer mine,
for I am redeemed', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'তুমি গৃহ-স্বামী, আমি সেবক তোমার
তোমার সুখেতে চেষ্টা এখন আমার', E'tumi
gṛha-swāmī, āmi sevaka tomār
tomāra
sukhete ceṣṭā ekhona āmār', E'My desire
has become one with Yours. From this day Bhaktivinoda has no other identity.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'স্থূল-লিঙ্গ-দেহে মোর সুকৃত দুষ্কৃত
আর মোর নহে, প্রভু! আমি তো নিষ্কৃত', E'sthūla-lińga-dehe
mora sukṛta duṣkṛta
āra
mora nahe, prabhu! āmi to niṣkṛta', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'তোমার ইচ্ছায় মোর ইচ্ছা মিশাইল
ভকতিবিনোদ আজ আপনে ভুলিল', E'tomāra
icchāya mora icchā miśāilo
bhakativinoda
āja āpane bhulilo', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 5: Amar Bolite Prabhu
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Amar Bolite Prabhu', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'আমার বলিতে প্রভু! আরে কিছু নাই
তুমি-ই আমার মাত্র পিতা-বন্ধু-ভাই', E'`āmāra
bolite prabhu! āre kichu nāi
tumi-i
āmāra mātra pitā-bandhu-bhāi', E'Nothing remains mine. Father, friend, brother  You are even these to me.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'বন্ধু, দারা, সুত, সুতা-তব দাসী দাস
সেই তো সম্বন্ধে সবে আমার প্রয়াস', E'bandhu,
dārā, suta, sutātava dāsī dās
sei
to sambandhe sabe āmāra prayās', E'Those whom I called friends, wife, sons, and daughters are all Your servants and
maidservants. Whatever care I take for them is only as it relates to You.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'ধন, জন, গৃহ, দার তোমার বলিয়া
রখা করি আমি মাত্র সেবক হৈয়া', E'dhana,
jana, gṛha, dāra `tomāra boliyā
rakhā
kori āmi mātro sevaka hoiyā', E'If
I continue to maintain my wealth, family members, home, and wife, it is because
they are Yours. I am a mere servant.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'তোমার কার্যের তোরে উপর্জিব ধন
তোমার সংসারে-ব্যয় করিব বহন', E'tomāra
kāryera tore uparjibo dhan
tomāra
saḿsāre-vyaya koribo vahan', E'For
Your service I will earn money and bear the expense of Your household.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'ভাল-মন্দ নাহি জানি সেবা মাত্র করি
তোমার সংসারে আমি বিষয়-প্রহরী', E'bhālo-manda
nāhi jāni sevā mātro kori
tomāra
saḿsāre āmi viṣaya-praharī', E'I
know neither good nor bad. I merely serve. I am but a watchman who guards the
properties in Your household.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'তোমার ইচ্ছায় মোর ইন্দ্রিয়-চালনা
শ্রবন, দর্শন, ঘ্রান, ভোজন-বাসনা', E'tomāra
icchāya mora indriya-cālanā
śravana,
darśana, ghrāna, bhojana-vāsanā', E'The
exercising of my senses  hearing, seeing, smelling, tasting, touching  is
done according to Your desire.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'নিজ-সুখ লাগি কিছু নাহি করি আর
ভকতিবিনোদ বলে, তব সুখ-সার
2017', E'nija-sukha
lāgi kichu nāhi kori ār
bhakativinoda
bole, tava sukha-sār', E'I
no longer do anything for my own pleasure. Bhaktivinoda says, Your happiness
is the essence of everything.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 6: Bastutoh Sakali Tava
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Bastutoh Sakali Tava', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'বস্তুতঃ সকলি তব, জীব কেহ নয়
অহম-মম-ভ্রমে ভ্রমি ভোগে শোক-ভয়', E'bastutaḥ
sakali tava, jīva keho noy
`aham-`mama-bhrame
bhromi bhoge śoka-bhoy', E'In
truth, all things belong to You. No jiva is owner of anything. The tiny soul
wanders in this world mistakenly thinking, I am this transitory body, and
everything related to this body is mine. Thus he suffers sorrow and fear.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'অহং-মম-অভিমান এই-মাত্র ধন
বদ্ধ-জীব নিজ বলি জানে মনে মন', E'ahaḿ-mama-abhimāna
ei-mātro dhan
baddha-jīva
nija boli jāne mane man', E'The
conditioned soul is falsely proud and considers everything attached to the
words I and mine to be his treasures alone.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'সেই অভিমানে আমি সংসারে পড়িয়া
হাবুডুবু খাই ভব-সিন্ধু সাঁতারিয়া', E'sei
abhimāne āmi saḿsāre poḍiyā
hābuḍubu
khāi bhava-sindhu sāńtāriyā', E'Due
to that same vanity, I fell into this world. Floundering in the ocean of
mundane existence like a drowning man, I suffer the pangs of rising and sinking
in that ocean.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'তোমার অভয়-পদে লৈয়া শরণ
আজি আমি করিলাম আত্ম-নিবেদন', E'tomāra
abhoya-pade loiyā śaraṇ
āji
āmi korilāma ātma-nivedan', E'I
take shelter at Your lotus feet, which award fearlessness, and dedicate myself
to You on this day.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'অহং-মম-অভিমান ছাড়িল আমায়
আর যেন মম হৃদে স্তান নাহি পায়', E'`ahaḿ-`mama-abhimāna
chāḍilo āmāy
ār
jeno mama hṛde stāna nāhi pāy', E'The
vanity of I and mine has left me now. May it never again find a place
within my heart.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'এই মাত্র বল প্রভু! দিবে হে আমারে
অহংতা-মমতা দূরে পারি রাখিবারে', E'ei
mātro bala prabhu! dibe he āmāre
ahaḿtā-mamatā
dūre pāri rākhibāre', E'O
Lord, please give me this strength, that I may be able to keep the false
conceptions of I and Mine far away.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'আত্ম-নিবেদন-ভাব হৃদে দৃঢ় রয়
হস্তি-স্নান সম যেন খনিক না হয়', E'ātma-nivedana-bhāva
hṛde dṛḍha roy
hasti-snāna
sama jeno khanika nā hoy', E'May
the mood of self-surrender to the Supreme Lord remain firmly fixed in my heart
and not prove to be like the momentary cleanliness of an elephant after a bath.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'ভকতিবিনোদ প্রভু নিত্যানন্দ পায়
মাগে পরসাদ, জাহে অভিমান যায়
2017', E'bhakativinoda
prabhu nityānanda pāy
māge
parasāda, jāhe abhimāna jāy', E'Bhaktivinoda begs at the lotus feet of Lord Nityananda for the grace which
delivers one from all false pride.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 7: Nivedana Kori Prabhu Tomara Carane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Nivedana Kori Prabhu Tomara Carane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'নিবেদন করি প্রভু! তোমার চরণে
পতিত অধম আমি, জানে ত্রি-ভুবনে', E'nivedana
kori prabhu! tomāra caraṇe
patita
adhama āmi, jāne tri-bhuvane', E'I
submit at Your lotus feet, O Lord, that I am fallen and wretched, a fact known
to the three worlds.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'আমা-সম পাপী নাহি জগত-ভিতরে
মম সম অপরাধী নাহিক সংসারে', E'āmā-sama
pāpī nāhi jagat-bhitore
mama
sama aparādhī nāhiko saḿsāre', E'There is no sinner more sinful than me. In the entire material creation there
is no offender whose offenses equal mine.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'সেই সব পাপ আর অপরাধ, আমি
পরিহারে পাই লজ্জা, সব জান তুমি', E'sei
saba pāpa āra aparādha, āmi
parihāre
pāi lajjā, saba jāno tumi', E'By
attempting to clear myself of all these sins and offenses I am put to shame and
beg Your forgiveness. All this is understood by You.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'তুমি বিনা কার আমি লৈব শরণ?
তুমি সর্বেশ্বরেশ্বর, ব্রজেন্দ্র-নন্দন!', E'tumi
binā kāra āmi loibo śaraṇ?
tumi
sarveśvareśvara, brajendra-nandan!', E'Of
whom will I take shelter except for You? O son of the King of Vraja, You are
the Lord of all lords.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'জগত তোমার নাথ! তুমি সর্ব-ময়
তোমা প্রতি অপরাধ তুমি কর ক্ষয়', E'jagat
tomāra nātha! tumi sarva-moy
tomā
prati aparādha tumi koro kṣoy', E'This world is Yours, and You pervade all things in it. You forgive the offenses
committed against You.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'তুমি তো স্খলিত-পদ জনের আশ্রয়
তুমি বিনা আর কিবা আছে, দয়া-ময়!', E'tumi
to skhalita-pada janera āśroy
tumi
binā āra kibā āche, doyā-moy!', E'You
alone are the shelter of those who have gone astray. Apart from You, what else
exists, O merciful Lord?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'সেই-রূপ তব অপরাধী জন যত
তোমার শরণাগত হৈবে সতত', E'sei-rūpa
tava aparādhī jana jata
tomāra
śaraṇāgata hoibe satata', E'Those like me who have offended You will know no peace until achieving Your
shelter.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'ভকতিবিনোদ এবে লৈয়া শরণ
তুয়া পদে করে আজ আত্ম-সমর্পণ
2017', E'bhakativinoda
ebe loiyā śaraṇ
tuwā
pade kore āj ātma-samarpaṇ', E'Bhaktivinoda takes shelter in You and surrenders himself at Your lotus feet on
this very day.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 8: Atma Nivedana Tuwa Pade
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Atma Nivedana Tuwa Pade', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 8;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'আত্ম-নিবেদন, তুয়া পদে করি,
হৈনু পরম সুখী
দুঃখ দূরে গেল, চিন্তা না রহিল,
চৌদিকে আনন্দ দেখি', E'ātma-nivedana,
tuwā pade kori,
hoinu
parama sukhī
duḥkha
dūre gelo, cintā nā rohilo,
caudike
ānanda dekhi', E'I
have become supremely joyful by surrendering myself at Your holy feet.
Unhappiness has gone away, and there are no more anxieties. I see joy in all
directions.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'অশোক-অভয়, অমৃত-আধার,
তোমার চরণ-দ্বয়
তাহাতে এখন, বিশ্রাম লভিয়া
ছাড়িনু ভবের ভয়', E'aśoka-abhoya,
amṛta-ādhāra,
tomāra
caraṇa-dwaya
tāhāte
ekhona, viśrāma labhiyā
chāḍinu
bhavera bhoya', E'Your two lotus feet are reservoirs of immortal nectar where one may live free
from sorrow and fear. I have found peace there now and have given up the fear
of worldly existence.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'তোমার সংসারে, করিব সেবন,
নাহিব ফলের ভাগী
তব সুখ জাহে, করিব যতন,
হয়ে পদে অনুরাগী', E'tomāra
saḿsāre, koribo sevana,
nāhibo
phalera bhāgī
tava
sukha jāhe, koribo jatana,
hoye
pade anurāgī', E'I
shall render service in Your household and not endeavor to enjoy the fruits of
that service, but rather I shall strive for whatever pleases You, fully devoted
to Your lotus feet.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'তোমার সেবায়, দুঃখ হয় যত,
সে-ও তো পরম সুখ
সেবা-সুখ-দুঃখ, পরম সম্পদ,
নাশয়ে অবিদ্যা-দুঃখ', E'tomāra
sevāya, duḥkha hoya jato,
se-o
to parama sukha
sevā-sukha-duḥkha,
parama sampada,
nāśaye
avidyā-duḥkha', E'Troubles encountered in Your service shall be the cause of great happiness, for
in Your devotional service joy and sorrow are equally great riches. Both
destroy the misery of ignorance.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'পূর্ব ইতিহাস, ভুলিনু সকল,
সেবা-সুখ পেয়ে মনে
আমি তো তোমার, তুমি তো আমার,
কি কাজ অপর ধনে', E'pūrva
itihāsa, bhulinu sakala,
sevā-sukha
peye mane
āmi
to tomāra, tumi to āmāra,
ki
kāja apara dhane', E'I
have completely forgotten all past history by feeling great joy in my mind. I
am most certainly Yours, and You are indeed mine. What need is there of any
other treasure?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'ভকতিবিনোদ, আনন্দে ডুবিয়া,
তোমার সেবার তরে
সব চেষ্টা করে, তব ইচ্ছা-মত,
থাকিয়া তোমার ঘরে
2017', E'bhakativinoda,
ānande ḍubiyā,
tomāra
sevāra tare
saba
ceṣṭā kore, tava icchā-mato,
thākiyā
tomāra ghare', E'Bhaktivinoda, diving into the ocean of bliss, devotes all his efforts for Your
service and dwells in Your house according to Your wishes.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 1: Ki Jani Ki Bale
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Ki Jani Ki Bale', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'কি জানি কি বলে, তোমার ধামেতে,
হৈনু শরণাগত
তুমি দয়া-ময়, পতিত-পাবন,
পতিত-তারণে রত', E'ki
jāni ki bale, tomāra dhāmete,
hoinu
śaraṇāgata
tumi
doyā-moy, patita-pāvana,
patita-tāraṇe
rata', E'How
has one such as I come to Your shelter? Surely it is by Your mercy alone, for
You are everseeking the purification and deliverance of the fallen souls.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'ভরসা আমার, এই মাত্র নাথ!
তুমি তো করুনা-ময়
তব দয়া-পাত্র, নাহি মোর সম,
অবশ্য ঘুচাবে ভয়', E'bharasā
āmāra, ei mātra nātha!
tumi
to karunā-moy
tava
doyā-pātra, nāhi mora sama,
avaśya
ghucābe bhoy', E'You
are my only hope, for You are full of compassion and mercy. There is no one who
needs Your mercy more than I. You will surely drive away all fear.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'আমারে তারিতে, কাহার শকতি,
অবনী-ভিতরে নাহি
দয়াল ঠাকুর! ঘোষনা তোমার,
অধম পামরে ত্রাহি', E'āmāre
tārite, kāhāro śakati,
avanī-bhitore
nāhi
doyāla
ṭhākura! ghoṣanā tomāra,
adhama
pāmare trāhi', E'No
one else has the power to deliver me. O merciful Lord, by Your declaration,
kindly deliver this vile and lowly sinner.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'সকল ছাডিয়া, আসিয়াছি আমি,
তোমার চরণে নাথ!
আমি নিত্য-দাস, তুমি পালয়িতা,
তুমি গোপ্তা, জগন্নাথ!', E'sakala
chāḍiyā, āsiyāchi āmi,
tomāra
caraṇe nātha!
āmi
nitya-dāsa, tumi pālayitā,
tumi
goptā, jagannātha!', E'I
have given up everything and come to Your lotus feet. I am Your eternal
servant, and You are my protector and maintainer, O Lord of the universe!', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'তোমার সকল, আমি মাত্র দাস,
আমার তারিবে তুমি
তোমার চরণ, করিনু বরণ,
আমার নাহি তো আমি', E'tomāra
sakala, āmi mātra dāsa,
āmāra
tāribe tumi
tomāra
caraṇa, korinu varaṇa,
āmāra
nāhi to āmi', E'Everything is Yours. I am merely a servant, certain that You will deliver me. I
have chosen Your lotus feet as my only shelter. I no longer belong to myself.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'ভকতিবিনোদ, কাঁদিয়া শরণ,
লয়েছে তোমার পায়
ক্ষমি অপরাধ, নামে রুচি দিয়া,
পালন করহে তায়
September 27,
2016', E'bhakativinoda,
kāńdiyā śaraṇa,
loyeche
tomāra pāy
kṣami
aparādha, nāme ruci diyā,
pālana
korohe tāy', E'Weeping, Bhaktivinoda takes shelter at Your feet. Forgive his offenses, afford
him a taste for the holy name, and kindly maintain him.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 2: Dara Putra Nijo Deho
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Dara Putra Nijo Deho', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'দারা-পুত্র-নিজ-দেহ-কুটুম্ব-পালনে
সর্বদা ব্যাকুল আমি ছিনু মনে মনে', E'dārā-putra-nija-deho-kuṭumba-pālane
sarvadā
vyākula āmi chinu mane mane', E'Within my heart I have always been anxious for the maintenance of my wife and
children, my own body and relatives.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'কেমনে অর্জিব অর্থ, যশ কিসে পাব
কন্যা-পুত্র-বিবাহ কেমনে সম্পাদিব', E'kemone
arjibo artha, yaśa kise pābo
kanyā-putra-vivāha
kemone sampādibo', E'How
will I earn money? How will I obtain fame? How will I arrange the marriages of
my sons and daughter?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'এবে আত্ম-সমর্পনে চিন্তা নাহি আর
তুমি নির্বাহিবে প্রভু, সংসার তোমার', E'ebe
ātma-samarpane cintā nāhi ār
tumi
nirvāhibe prabhu, saḿsāra tomār', E'Now, through self-surrender, I have been purged of all anxiety. O Lord, surely
You will provide for the maintenance of Your household.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'তুমি তো পালিবে মোরে নিজ-দাস জানি
তোমার সেবায় প্রভু বড় সুখ মানি', E'tumi
to pālibe more nija-dāsa jāni
tomāra
sevāya prabhu boḍo sukha māni', E'Surely You will preserve me, knowing me to be Your own servant. O Lord, in Your
devotional service I feel great happiness.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'তোমার ইচ্ছয় প্রভু সব কার্য হয়
জীব বলে,-করি আমি, সে তো সত্য নয়', E'tomāra
icchaya prabhu sab kārya hoy
jīva
bole,`kori āmi, se to satya noy', E'All
events take place by Your will, O Lord. The deluded soul of this world
declares, I am the doer, but this is pure folly.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'জীব কি করিতে পরে, তুমি না করিলে?
আশা-মাত্র জীব করে, তব ইচ্ছা-ফলে', E'jīva
ki korite pare, tumi nā korile?
āśā-mātra
jīva kore, tava icchā-phale', E'If
You do not act first, then what is a tiny soul actually able to do? By Your
will he can only desire to act, and unless You fulfill his desire, he cannot do
anything.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'নিশ্চিন্ত হৈয়া আমি সেবিব তোমায়
গৃহে ভাল-মন্দ হলে নাহি মোর দায়', E'niścinta
hoiyā āmi sevibo tomāy
gṛhe
bhālo-manda hole nāhi mora dāy', E'I
will serve You free from all anxiety, and at home, if any good or evil should
occur, it will not be my responsibility.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'ভকতিবিনোদ নিজ-স্বাতন্ত্র্য ত্যজিয়া
তোমার চরণ সেবে অকিঞ্চন হৈয়া
2017', E'bhakativinoda
nija-swātantrya tyajiyā
tomāra
caraṇa seve akiñcana hoiyā', E'Bhaktivinoda thus gives up his independence and engages in the exclusive
service of Your lotus feet with no other interest in life.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 3: Sarvasva Tomar Carane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Sarvasva Tomar Carane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'সর্বস্ব তোমার, চরণে সঁপিয়া,
পড়েছি তোমার ঘরে
তুমি তো ঠাকুর, তোমার কুকুর,
বলিয়া জানহ মোরে', E'sarvasva
tomār, caraṇe saḿpiyā,
poḍechi
tomāra ghare
tumi
to ṭhākur, tomāra kukur,
boliyā
jānaho more', E'Now
that I have surrendered all I possess, I fall prostrate before Your house. You
are the Supreme Lord. Kindly consider me Your household dog.', E'', E'У своєму поясненні до **«Чайтанья-чарітамріта»**, Антья-ліла 1.24, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Тому Шріла Бгактівінод Тхакур співав: *тумі та'' тхакура, томара куккура, баліййа джанаха море*. Так він пропонує стати собакою вайшнава. Є багато інших прикладів, коли домашня тварина вайшнава була повернута додому, до Вайкунтхалоки».', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'বাঙ্ধিয়া নিকটে, আমারে পালিবে,
রহিব তোমার দ্বারে
প্রতীপ-জনেরে, আসিতে না দিব,
রাখিব গড়ের পারে', E'bāńdhiyā
nikaṭe, āmāre pālibe,
rohibo
tomāra dwāre
pratīpa-janere,
āsite nā dibo,
rākhibo
gaḍera pāre', E'Chain me nearby and maintain me as You will. I shall remain at the doorstep and
allow no enemies to enter Your house. I will keep them at the bounds of the
moat surrounding Your home.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'তব নিজ-জন, প্রসাদ সেবিয়া,
উচ্ছিষ্ট রাখিবে যাহা
আমার ভোজন, পরম-আনন্দে,
প্রতি-দিন হবে তাহা', E'tava
nija-jana, prasād seviyā,
ucchiṣṭa
rākhibe jāhā
āmāra
bhojan, parama-ānande,
prati-din
habe tāhā', E'Whatever remnants Your devotees leave behind after honoring Your prasada will
be my daily sustenance. I will feast on those remnants with great ecstasy.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'বসিয়া শুইয়া, তোমার চরণ,
চিন্তিব সতত আমি
নাচিতে নাচিতে, নিকটে যাইব,
যখন ড়াকিবে তুমি', E'bosiyā
śuiyā, tomāra caraṇa,
cintibo
satata āmi
nācite
nācite, nikaṭe jāibo,
jakhona
ḍākibe tumi', E'While sitting up, while lying down, I will constantly meditate on Your lotus
feet. Whenever You call, I will immediately run to You and dance in rapture.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'নিজের পোষন, কভু না ভাবিব,
রহিব ভাবের ভরে
ভকতিবিনোদ, তোমারে পালক,
বলিয়া বরণ করে', E'nijera
poṣana, kabhu nā bhāvibo,
rohibo
bhāvera bhore
bhakativinoda,
tomāre pālaka,
boliyā
varaṇa kore', E'I
will never think of my own maintenance but rather remain transported by a
multitude of ecstasies. Bhaktivinoda accepts You as his only support.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 4: Tumi Sarveswareswara Vrajendra Kumar
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Tumi Sarveswareswara Vrajendra Kumar', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'তুমি সর্বেশ্বরেশ্বর, ব্রজেন্দ্র-কুমার!
তোমার ইচ্ছায় বিশ্বে সৃজন সংহার', E'tumi
sarveśvareśvara, brajendra-kumāra!
tomāra icchāya viśve sṛjana saḿhāra', E'O
youthful son of the King of Vraja, You are Lord of all lords. According to Your
will, creation and destruction take place in the universe.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'তব ইচ্ছা-মত ব্রহ্মা করেন সৃজন
তব ইচ্ছা-মত বিষ্নু করেন পালন', E'tava
icchā-mato brahmā korena sṛjana
tava icchā-mato viṣnu korena pālana', E'According to Your will Lord Brahma creates, and according to Your will Lord
Visnu maintains.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'তব ইচ্ছা-মতে শিব করেন সংহার
তব ইচ্ছা-মতে মায়া সৃজে কারাগার', E'tava
icchā-mate śiva korena saḿhāra
tava icchā-mate māyā sṛje kārāgāra', E'According to Your will Lord Siva destroys, and according to Your will Maya
constructs the prison house of this world.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'তব ইচ্ছা-মতে জীবের জনম-মরণ
সমৃদ্ধি-নিপাতে দুঃখ সুখ-সংঘটন', E'tava
icchā-mate jīver janama-maraṇa
samṛddhi-nipāte duḥkha sukha-saḿghaṭana', E'According to Your will the living beings take birth and die, and according to
Your will they meet with prosperity and ruin, happiness and sorrow.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'মিছে মায়া-বদ্ধ জীব আশা-পাশে ফিরে
তব ইচ্ছা বিনা কিছু করিতে না পারে', E'miche
māyā-baddha jīva āśā-pāśe phire''
tava icchā binā kichu korite nā pāre', E'The
tiny soul bound up by Maya vainly struggles in the fetters of worldly desire.
Without Your sanction he is unable to do anything.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'তুমি তো রাখক আর পালক আমার
তোমার চরণ বিনা আশা নাহি আর', E'tumi
to'' rākhaka ār pālaka āmāra
tomāra caraṇa binā āśā nāhi āra', E'You
are my only protector and maintainer. Except for Your lotus feet there is no
other hope for me.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'নিজ-বল-চেষ্টা-প্রতি ভরসা ছাড়িয়া
তোমার ইচ্ছায় আছি নির্ভর করিয়া', E'nija-bala-ceṣṭā-prati
bharasā chāḍiyā
tomāra icchāya āchi nirbhara koriyā', E'No
longer confident of my own strength and endeavor, I have become solely
dependent on Your will.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'ভকতিবিনোদ অতি দীন অকিঞ্চন
তোমার ইচ্ছায় তার জীবন মরণ
2017', E'bhakativinoda
ati dīna akiñcana
tomāra icchāya tā''r jīvana maraṇa', E'Bhaktivinoda is most poor, and his pride has been leveled. Now in accordance
with Your will he lives and dies.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 1: Ekhona Bujhinu
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Ekhona Bujhinu', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'এখোন বুঝিনু প্রভু! তোমার চরণ
অশোকাভয়ামৃত-পূর্ণ সর্ব-ক্ষন', E'ekhona
bujhinu prabhu! tomāra caraṇa
aśokābhoyāmṛta-pūrṇa
sarva-kṣana', E'I
know now Your divine feet are a refuge free from all sorrow and fear, eternally
full of sweet nectar.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'সকল ছাড়িয়া তুয়া চরণ-কমলে
পড়িয়াছি আমি নাথ! তব পদ-তলে', E'sakala
chāḍiyā tuwā caraṇa-kamale
poḍiyāchi
āmi nātha! tava pada-tale', E'At
the soles of those lotus feet I surrender myself and all I possess.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'তব পাদ-পদ্ম নাথ! রক্ষিবে আমারে
আর রক্ষা-কর্তা নাহি এ ভব-সংসারে', E'tava
pāda-padma nāth! rokṣibe āmāre
ār
rakṣā-kartā nāhi e bhava-saḿsāre', E'O
Lord, there is no other protection but You in this world of birth and death.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'আমি তব নিত্য-দাস-জানিনু এ-বার
আমার পালন-ভার এখোন তোমার', E'āmi
tava nitya-dāsajāninu e-bāra
āmāra
pālana-bhāra ekhona tomāra', E'At
last I know myself to be Your eternal servant, whose maintenance You have
assured.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'বড় দুঃখ পাইয়াছি স্বতন্ত্র জীবনে
দুঃখ দূরে গেল ও পদ-বরণে', E'baḍo
duḥkha pāiyāchi swatantra jīvane
duḥkha
dūre gelo o pada-varaṇe', E'Life before, without You, held nothing but sorrow. Now I live free from all
misery', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'যে-পদ লাগিয়া রমা তপস্য করিলা
যে-পদ পাইয়া শিব শিবত্ব লোভিলা', E'je-pada
lāgiyā ramā tapasya korilā
je-pada
pāiyā śiva śivatwa lobhilā', E'Laksmi, desiring such a place at Your lotus feet, executed austerities. Only
after securing a place by Your lotus feet did Lord Siva attain his sivatva, or
quality of auspiciousness.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'যে-পদ লভিয়া ব্রহ্মা কৃতার্থ হৈলা
যে-পদ নারদ মুনি হৃদয়ে ধরিলা', E'je-pada
labhiyā brahmā kṛtārtha hoilā
je-pada
nārada muni hṛdoye dhorilā', E'Upon obtaining those feet Lord Brahma became successful in life, and the great
sage Narada Muni held those two feet to his heart.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'সেই সে অভয় পদ শিরেতে ধরিয়া
পরম-আনন্দে নাচি পদ-গুন গাইয়া', E'sei
se abhoya pada śirete dhoriyā
parama-ānande
nāci pada-guna gāiyā', E'Your lotus feet drive away all fear. Having held them to my head, I dance in
great ecstasy, singing their glories.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '9', 9, E'সংসার-বিপদ হতে অবশ্য উদ্ধার
ভকতিবিনোদ, ও-পদ করিবে তোমার', E'saḿsāra-vipada
hote avaśya uddhār
bhakativinoda,
o-pada koribe tomār', E'Your lotus feet will deliver Bhaktivinoda from the perils of worldly journey.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 2: Tumi To Maribe Jare
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Tumi To Maribe Jare', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'তুমি তো মারিবে যারে, কে তারে রাখিতে পারে,
ইচ্ছা-বশ ত্রিভুবন
ব্রহ্মা-আদি দেব-গণ, তব দাস অগনণ,
করে তব আজ্ঞার পালন', E'tumi
to māribe jāre, ke tāre rākhite pāre,
icchā-baśa
tribhuvan
brahmā-ādi
deva-gaṇa, tava dāsa aganaṇa,
kore
tava ājñāra pālan', E'Who can protect that person whom You wish to slay? The three worlds are
obedient to Your will. The gods, headed by Brahma, are Your countless servants
and stand ready to execute Your command,', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'তব ইচ্ছা-মতে যত, গ্রহ-গণ অবিরত,
শুভাশুভ ফল করে দান
রোগ-শোক-মৃতি-ভয়, তব ইচ্ছা-মতে হয়,
তব আজ্ঞা সদা বলবান', E'tava
icchā-mate jata, graha-gaṇa avirata,
śubhāśubha
phala kore dān
roga-śoka-mṛti-bhoy,
tava icchā-mate hoy,
tava
ājñā sadā balavān', E'By Your will the planets exercise their auspicious or inauspicious influences.
Illness, grief, death, and fear occur by Your will. Your command is
all-powerful.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'তব ভয়ে বায়ু বয়, চন্দ্র সূর্য সমুদয়,
স্ব-স্ব নিয়মিত কর্য করে
তুমি তো পরমেশ্বর, পর-ব্রহ্ম পরাত্পর,
তব বাস ভকত-অন্তরে', E'tava
bhoye vāyu boy, candra sūrya samudoy,
swa-swa
niyamita karya kore
tumi
to parameśwar, para-brahma parātpar,
tava
bāsa bhakata-antare', E'In fear of You the wind blows, and the sun, moon, and all others perform their
allotted duties. You are the Supreme Lord, the Supreme Spirit, supreme above
all. Your residence is in the heart of Your loving devotee.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'সদা-শুদ্ধ সিদ্ধ-কাম, ভকত-বত্সল নাম,
ভকত-জনের নিত্য-স্বামী
তুমি তো রাখিবে যারে, কে তারে মারিতে পারে,
সকল বিধির বিধি তুমি', E'sadā-śuddha
siddha-kāma, `bhakata-vatsala nāma,
bhakata-janera
nitya-swāmī
tumi
to rākhibe jāre, ke tāre mārite pāre,
sakala
vidhira vidhi tumi', E'You are eternally pure. All Your desires are fulfilled. Your name is
Bhakta-vatsala, for You are very affectionate to the Vaisnavas. You are the eternal
Lord of Your loving devotees. Who can slay that person whom You wish to
protect? You are the law of all laws.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'তোমার চরণে নাথ! করিয়াছে প্রনিপাত,
ভকতিবিনোদ তব দাস
বিপদ হৈতে স্বামী! অবশ্য তাহারে তুমি,
রক্ষিবে,-তাহার এ বিশ্বাস
2017', E'tomāra
caraṇe nātha! koriyāche pranipāta,
bhakativinoda
tava dās
vipada
hoite swāmī! avaśya tāhāre tumi,
rakṣibe,tāhāra
e viśvās', E'O Lord, Your eternal servant Bhaktivinoda has bowed down at Your lotus feet. O
master, he cherishes the faith that You will surely protect him from all
dangers.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 3: Atma Samarpane Gela Abhiman
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Atma Samarpane Gela Abhiman', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'আত্ম-সমর্পনে গেলা অভিমান
নাহি করবুঁ নিজ রখা-বিধান', E'ātma-samarpane
gelā abhimān
nāhi
korobuń nija rakhā-vidhān', E'Surrendering to You lifted from me the burden of false pride. No longer will I
try to secure my own well-being.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'তুয়া ধন জানি তুহুঁ রাখবি, নাথ!
পাল্য় গোধন জ্ঞান করি তুয়া সাথ', E'tuwā
dhana jāni tuhuń rākhobi, nāth!
pālya
godhana jñāna kori tuwā sāth', E'O
Lord, I am confident of Your protection, for, like one of Your cows or calves,
I am Your treasured property.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'চরায়বি মাধব! জামুন-তীরে
বংশী বাজায়ত ডাকবি ধীরে', E'carāobi
mādhava! jāmuna-tīre
baḿśī
bājāoto ḍākobi
dhīre', E'O
Madhava, I see You leading Your herds to pasture on the banks of the Yamuna.
You call to them by gently playing Your flute.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'অঘ-বক মারত রখা-বিধান
করবি সদা তুহুঁ গোকুল-কান!', E'agha-baka
mārato rakhā-vidhān
korobi
sadā tuhuń gokula-kān!', E'By
slaying giant demons such as Agha and Baka You will always provide full
protection, O Gokula Kana!', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'রখা করবি তুহুঁ নিশ্চয় জানি
পান করবুঁ হাম জামুন-পানি', E'rakhā
korobi tuhuń niścoy jāni
pāna
korobuń hāma jāmuna-pāni', E'Fearless and confident of Your protection, I will drink the water of the
Yamuna.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'কালিয়-দোখ করবি বিনাশা
শোধোবি নদী-জল, বাড়াওবি আশা', E'kāliya-dokha
korobi vināśā
śodhobi
nadī-jala, bāḍāobi āśā', E'The
Kaliya serpents venom poisoned the Yamunas waters, yet that poison will not
act. You will purify the Yamuna and by such heroic deeds enhance our faith.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'পিয়ত দাবানল রাখবি ময়
গোপাল, গোবিন্দ নাম তব হয়', E'piyato
dāvānala rākhobi moy
`gopāla,
`govinda nāma tava hoy', E'You
who are called Govinda and Gopala will surely protect me by swallowing the
forest fire.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'সুর-পতি-দুর্মতি-নাশ বিচারি
রাখবি বর্ষনে, গিরি-বর-ধারি!', E'sura-pati-durmati-nāśa
vicāri
rākhobi
varṣane, giri-vara-dhāri!', E'When Indra, king of the gods, sends torrents of rain, You will counteract his
malice and protect us by lifting the mighty Govardhana Hill!', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '9', 9, E'চতুর-আনন করব যব চোরি
রখা করবি মুঝে, গোকুল-হরি!', E'catur-ānana
korabo jab cori
rakhā
korobi mujhe, gokula-hari!', E'When the four-headed Brahma steals Your cowherd boyfriends and calves, then,
too, You will surely protect me, O Gokula Hari!', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 10
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '10', 10, E'ভকতিবিনোদ-তুয়া গোকুল-ধন
রাখবি কেশব! করত যতন
January
6, 2017', E'bhakativinodatuwā
gokula-dhan
rākhobi
keśava! korato jatan', E'Bhakativinoda is now the property of Gokula, Your holy abode, O Kesava, kindly
protect him with care.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 4: Chorato Purusa Abhiman
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Chorato Purusa Abhiman', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'ছোড়ত পুরুষ-অভিমান
কিঙ্করী হৈলুঁ আজি, কান!', E'choḍato
puruṣa-abhimān
kińkorī
hoiluń āji, kān!', E'Gone is the vanity of male egoism, O Kana. Now I am Your faithful maidservant.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'বরজ-বিপিনে সখী-সাথ
সেবন করবুঁ, রাধা-নাথ!', E'baraja-bipine
sakhī-sāth
sevana
korobuń, rādhā-nāth!', E'O
Lord of Radha, in the groves of Vraja I will perform devotional service as a
follower of one of the sakhis.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'কুসুমে গাঁথোবুঁ হার
তুলসী-মণি-মঞ্জরী তার', E'kusume
gāńthobuń hār
tulasī-maṇi-mañjarī
tār', E'I
will string together a necklace of forest flowers, and tulasi buds shall be the
jewels of that necklace.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'যতনে দেওবুঁ সখী-করে
হাতে লওব সখী আদরে', E'jatane
deobuń sakhī-kare
hāte
laobo sakhī ādare', E'With utmost care I will place the garland in the hands of that confidential
devotee, and she will take it with affection.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'সখী দিব তুয়া দুহুক গলে
দূরত হেরবুঁ কুতূহলে', E'sakhī
dibo tuwā duhuk gale
dūrato
herobuń kutūhale', E'Then she will place the garland around both Your necks, while I watch in wonder
from afar.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'সখী কহব, শুন সুন্দরী!
রহবি কুঞ্জে মম
কিঙ্করী', E'sakhī
kahabo,śuno sundarī!
rahobi
kuñje mama kińkorī', E'The
confidant will then say to me, Listen, O beautiful one, you should remain in
this grove as my attendant.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'গাঁথোবি মালা মন-হারিনী
নিতি রাধা-কৃষ্ণ-বিমোহিনী', E'gāńthobi
mālā mano-hārinī
niti
rādhā-kṛṣṇa-vimohinī', E'Daily you shall string together beautiful flower garlands that will enchant
Radha and Krsna.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'তুয়া রখন-ভার হামারা
মম কুঞ্জ-কুটীর তোহারা', E'tuwā
rakhana-bhāra hāmārā
mama
kuñja-kuṭīra tohārā', E'The responsibility for your maintenance shall be mine. My cottage in the grove
is yours.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '9', 9, E'রাধা-মাধব-সেবন-কালে
রহবি হামার অন্তরালে', E'rādhā-mādhava-sevana-kāle
rahobi
hāmāra antarāle', E'When I serve Radha and Madhava, you will attend behind me.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 10
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '10', 10, E'তাম্বুল সাজি কর্পূর আনি
দেওবি মোএ আপন জানি', E'tāmbula
sāji karpūra āni
deobi
moe āpana jāni', E'After preparing tambula and bringing camphor, you will give them to me, knowing
me to be yours.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 11
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '11', 11, E'ভকতিবিনোদ শুনি বাত
সখী-পদে করে প্রনিপাত', E'bhakativinoda
śuni bāt
sakhī-pade
kare pranipāt', E'Bhaktivinoda, having heard all these instructions, bows down at the lotus feet
of that confidential sakhi.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 6, Song 1: Tuwa Bhakti Anukula
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Tuwa Bhakti Anukula', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'তুয়া-ভক্তি-অনুকূল যে-যে কার্য হয়
পরম-যতনে তাহা করিব নিশ্চয়', E'tuwā-bhakti-anukūla
je-je kārya hoy
parama-jatane
tāhā koribo niścoy', E'I
will surely execute with utmost care those activities favorable to Your pure
devotional service.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'ভক্তি-অনুকূল যত বিষয় সংসারে
করিব তাহাতে রতি ইন্দ্রিয়ের দ্বারে', E'bhakti-anukūla
jata viṣaya saḿsāre
koribo
tāhāte rati indriyera dwāre', E'I
will feel fondness for those things in this world which are conductive to pure
devotion, and with my senses I will engage them in Your service.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'শুনিব তোমার কথা যতন করিয়া
দেখিব তোমার ধাম নয়ন ভরিয়া', E'śunibo
tomāra kathā jatana koriyā
dekhibo
tomāra dhāma nayana bhoriyā', E'I
will carefully listen to all discussions concerning You, and the satisfaction
of my eyes will be to behold Your divine abode.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'তোমার প্রসাদে দেহ করিব পোষন
নৈবেদ্য-তুলসী-ঘ্রান করিব গ্রহন', E'tomāra
prasāde deho koribo poṣan
naivedya-tulasī-ghrāna
koribo grahan', E'I
will nourish my body with the sacred remnants of Your food and smell the sweet
scent of tulasi leaves adorning those offerings.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'কর-দ্বারে করিব তোমার সেবা সদা
তোমার বসতি-স্থলে বসিব সর্বদা', E'kara-dwāre
koribo tomāra sevā sadā
tomāra
vasati-sthale basibo sarvadā', E'With my hands I will always execute Your service, and I will forever dwell at
that place where You abide.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'তোমার সেবায় কাম নিয়োগ করিব
তোমার বিদ্বেষি-জনে ক্রোধ দেখাইব', E'tomāra
sevāya kāma niyoga koribo
tomāra
vidveṣi-jane krodha dekhāibo', E'I
will employ my desires in Your devotional service and show anger to those who
are envious of You.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'এই-রূপে সর্ব-বৃত্তি আর সর্ব-ভাব
তুয়া অনুকূল হয়ে লভুক প্রভাব', E'ei-rūpe
sarva-vṛtti āra sarva-bhāva
tuwā
anukūla hoye labhuka prabhāva', E'In
this way may all of my propensities and emotions obtain dignity and glory by
being favorable to You.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'তুয়া ভক্ত-অনুকূল যাহা যাহা করি
তুয়া ভক্তি-অনুকূল বলি তাহা ধরি', E'tuwā
bhakta-anukūla jāhā jāhā kori
tuwā
bhakti-anukūla boli tāhā dhori', E'I
will consider as favorable to Your devotional service anything I do which is
favorable to Your devotee.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '9', 9, E'ভকতিবিনোদ নাহি জানে ধর্মাধর্ম
ভক্তি-অনুকূল তার হৌ সব কর্ম
2017', E'bhakativinoda
nāhi jāne dharmādharma
bhakti-anukūla
tāra hau saba karma', E'Bhaktivinoda knows neither religion nor irreligion. He simply prays that all
his activities be conductive for pure devotion to You.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 6, Song 2: Godruma Dhame Bhajana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Godruma Dhame Bhajana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'গোদ্রুম-ধামে ভজন-অনুকূলে
মাথুর-শ্রী-নন্দীশ্বর-সমতুলে', E'godruma-dhāme
bhajana-anukūle
māthura-śrī-nandīśvara-samatule', E'On the banks of the celestial Ganges River I will dwell in a cottage at
Surabhi-kunj in Godruma-dhama. This land of Godruma is very conductive for
performing devotional worship of the Supreme Lord and is non-different from the
sacred place called Nandagram, located in the holy district of Mathura.
3-', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'তহি মাহ সুরভি-কুঞ্জ-কুটীরে
বৈঠবুঁ হাম সুর-তটিনী-তীরে', E'tahi
māha surabhi-kuñja-kuṭīre
baiṭhobuń
hāma sura-taṭinī-tīre', E'I will put on the garb that is dear to the devotees of Lord Gaurasundara and
wear the twelve Vaisnava tilaka markings on my body and beautiful beads of
tulasi wood around my neck. Then, by planting flowering trees like Campaka,
Bakula, Kadamba, and Tamala, I will make an extensive grove by my cottage.
(5-', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'গৌর-ভকত-প্রিয়-বেশ দধানা
তিলক-তুলসী-মালা-শোভমানা', E'gaura-bhakata-priya-veśa
dadhānā
tilaka-tulasī-mālā-śobhamānā', E'I will put madhavi and malati creepers on the trees and in this way make a
shady bower. I will sow a variety of flowering forests and different kinds of
jasmine like yuthi, jati and malli. All these will be present there, arrayed in
a charming fashion. I will install the empress tulasi on an elevated throne on
the terrace, then procure all necessary paraphernalia for having kirtana, such
as mrdanga drums, karatalas (hand cymbals), and gongs, and place them there.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'চম্পক, বকুল, কদম্ব, তমাল
রোপত নিরমিব কুঞ্জ বিশাল', E'campaka,
bakula, kadamba, tamāl
ropato
niramibo kuñja viśāl', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'মাধবী মালতী উঠাবুঁ তাহে
ছায়া-মণ্ডপ করবুঁ তঁহি মাহে', E'mādhavī
mālatī uṭhābuń tāhe
chāyā-manḍapa
korobuń tańhi māhe', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'রোপোবুঁ তত্র কুসুম-বন-রাজি
জূথি, জাতি, মল্লী বিরাজব সাজি', E'ropobuń
tatra kusuma-vana-rāji
jūthi,
jāti, mallī virājabo sāji', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'মঞ্চে বসাওবুঁ তুলসী-মহারাণী
কীর্তন-সজ্জ তঁহি রাখব আনি', E'mañce
basāobuń tulasī-mahārāṇī
kīrtana-sajja
tańhi rākhabo āni', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'বৈষ্ণব-জন-সহ গাওবুঁ নাম
জয় গোদ্রুম জয় গৌর কি ধাম', E'vaiṣṇava-jana-saha
gāobuń nām
jaya
godruma jaya gaura ki dhām', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '9', 9, E'ভকতিবিনোদ ভক্তি-অনুকূল
জয় কুঞ্জ, মুঞ্জ, সুর-নদী-কূল
2017', E'bhakativinoda
bhakti-anukūl
jaya
kuñja, muñja, sura-nadī-kūl', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 6, Song 3: Suddha Bhakata Carana Renu
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Suddha Bhakata Carana Renu', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'শুদ্ধ-ভকত-চরণ-রেণু,
ভজন-অনুকূল
ভকত-সেবা, পরম-সিদ্ধি,
প্রেম-লতিকার মূল', E'śuddha-bhakata-caraṇa-reṇu,
bhajana-anukūla
bhakata-sevā, parama-siddhi,
prema-latikāra mūla', E'The dust of the lotus feet of pure devotees, enthusiastic devotional service,
and service to the pure devotees of the highest order are the roots of the
creeper of devotion.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'মাধব-তিথি, ভক্তি-জননী,
যেতনে পালন করি
কৃষ্ণ-বসতি, বসতি বলি,
পরম আদরে বরি', E'mādhava-tithi,
bhakti-jananī,
jetane pālana kori
kṛṣṇa-basati, basati boli'',
parama ādare bori', E'The holy days like Ekadasi and Janmastami are the mother of devotion for those
devotees who respect them. Let the holy places of Krsna''s pastimes be my places
of worship, and bless me.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'গৌর আমার, যে-সব স্থানে,
করল ভ্রমণ রঙ্গে
সে-সব স্থান, হেরিব আমি,
প্রণয়ি-ভকত-সঙ্গে', E'gaur
āmāra, je-saba sthāne,
koralo bhramaṇa rańge
se-saba sthāna, heribo āmi,
praṇayi-bhakata-sańge', E'May I always visit all the holy places associated with the lila of Lord
Caitanya and His devotees.', E'', E'У своєму поясненні до **«Чайтанья-чарітамріта»**, Антья-ліла 4.211, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Шріла Бгактівінод Тхакур пише в пісні: *ґаура амара, йе саба стхане, карала бграмана ранґе / се-саба стхана, херіба амі, пранайі-бгаката-санґе*. "Нехай я відвідаю всі святі місця, пов''язані з лілами Господа Чайтаньї та Його відданих"».', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'মৃদঙ্গ-বাদ্য, শুনিতে মন,
অবসর সদা যাচে
গৌর-বিহিত, কীর্ত্তন শুনি,
আনন্দে হৃদয় নাচে', E'mṛdańga-bādya,
śunite mana,
abasara sadā jāce
gaura-bihita, kīrtana śuni'',
ānande hṛdoya nāce', E'When I hear the sound of the mrdanga in my heart I always desire to join in
kirtana; and when I hear the bonafide songs describing Lord Caitanya''s
pastimes, my heart dances in ecstasy.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'যুগল-মূর্ত্তি, দেখিয়া মোর,
পরম-আনন্দ হয়
প্রসাদ-সেবা করিতে হয়,
সকল প্রপঞ্চ জয়', E'jugala-mūrti,
dekhiyā mora,
parama-ānanda hoya
prasāda-sebā korite hoya,
sakala prapañca jaya', E'Whenever I see the transcendental sri-vigrahas of Radha-Krsna I am in bliss,
for by taking Their Lordships'' prasada we can conquer over the material
elements.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'যে-দিন গৃহে, ভজন দেখি,
গৃহেতে গোলোক ভায়
চরণ-সীধু, দেখিয়া গঙ্গা,
সুখ সা সীমা পায়', E'je-dina
gṛhe, bhajana dekhi,
gṛhete goloka bhāya
caraṇa-sīdhu, dekhiyā gańgā,
sukha sā sīmā pāya', E'One day while performing devotional practices, I saw my house transformed into
Goloka Vrndavana. When I take the caranamrta of the Deity, I see the holy
Ganges waters that come from the feet of Lord Visnu, and my bliss knows no
bounds.', E'', E'У своєму поясненні до **«Чайтанья-чарітамріта»**, Мадг''я-ліла 7.69, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «У своїй книзі **«Шаранаґаті»** Бгактівінод Тхакур стверджує: *йе-діна ґріхе, бгаджана декхі'', ґріхете ґолока бгайа*. Коли сімейна людина прославляє Верховного Господа у своєму домі, її діяльність негайно перетворюється на діяльність Ґолоки Вріндавани».', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'তুলসী দেখি,
জুড়ায় প্রাণ,
মাধব-তোষণী জানি
গৌর-প্রিয়, শাক-সেবনে,
জীবন সার্থক মানি', E'tulasī
dekhi'', jurāya prāṇa,
mādhava-toṣaṇī jāni''
gaura-priya, śāka-sevane,
jīvana sārthaka māni', E'By seeing the tulasi tree my heart feels joy and Lord Madhava (Krsna) is also
satisfied. When I eat the prasada favored by Lord Caitanya it is a new life''s
experience. (Lord Caitanya was very fond of a green vegetable preparation
called sak, and there is another song in this book that tells of the amazing
effects of this type of prasada.)', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'ভকতিবিনোদ, কৃষ্ণ-ভজনে,
অনকূল পায় যাহা
প্রতি-দিবসে, পরম-সুখে,
স্বীকার করয়ে তাহা', E'bhakativinoda,
kṛṣṇa-bhajane,
anakūla pāya jāhā
prati-dibase, parama-sukhe,
swīkāra koroye tāhā
WORD
FOR WORD', E'Bhaktivinoda concludes by saying: "Whosoever attains the stage of
enthusiasm for these devotional practices will be supremely blissful wherever
he may be."', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 6, Song 4: Radha Kunda Tata Kunja Kutir
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 6;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Radha Kunda Tata Kunja Kutir', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'রাধা-কুণ্ড-তট-কুঞ্জ-কুটীর
গোবর্ধন-পর্বত, যামুন-তীর', E'rādhā-kunḍa-taṭa-kuñja-kuṭīr
govardhana-parvata,
jāmuna-tīr', E'The cottage in the grove on the banks of Radha-kunda, the great Govardhana
Hill, the banks of the Yamuna, Kusuma-sarovara, Manasa-ganga, the daughter of
Kalinda (the Yamuna) with her many waves, the Vamsi-vat, Gokula, Dhira-samira,
the trees and creepers and reeds of Vrndavana, the different varieties of
colorful birds, the deer, the cooling breeze from the Malaya Mountains, the
peacocks, the bumblebees, the pastimes with the flute, the flute itself, the
buffalo horn bugle, the footprints of cows in the dust of Vraja, the rows of
blackish rain clouds, springtime, the moon, the conch-shell, and the karatalas
 all these I know to be very conductive for the pastimes of Radha and Krsna. I
recognize in them a transcendental stimulus for making the Lords charming
pastimes more intense.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'কুসুম-সরোবর, মানস-গঙ্গা
কলিন্দ-নন্দিনী বিপুল-তরঙ্গ', E'kusuma-sarovara,
mānasa-gańgā
kalinda-nandinī
vipula-tarańga', E'I refuse to go anywhere if there stimuli to devotional service are not there,
for to abandon them is to abandon life itself.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'বংশী-বট, গোকুল, ধীর-সমীর
বৃন্দাবন-তরু-লতিকা-বানীর', E'vaḿśī-vaṭa,
gokula, dhīra-samīr
bṛndābana-taru-latikā-bānīr', E'Bhaktivinoda says, Please hear me, O Kana! Your entourage and paraphernalia
stimulate remembrance of You and are the very source of my life.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'খগ-মৃগ-কুল, মলয়-বাতাস
ময়ূর, ভ্রমর, মুরলী-বিলাস', E'khaga-mṛga-kula,
malaya-bātās
mayūra,
bhramara, muralī-vilās', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'বেনু, শৃঙ্গ, পদ-চিহ্ন, মেঘ-মালা
বসন্ত, শশঙ্ক, শঙ্খ, করতাল', E'venu,
śṛńga, pada-cihna, megha-mālā
vasanta,
śaśańka, śańkha, karatāla', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'য়ুগল-বিলাসে অনুকূল জানি
লীলা-বিলাসে-উদ্দীপক মানি', E'yugala-vilāse
anukūla jāni
līlā-vilāse-uddīpaka
māni', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'এ সব ছোড়ত কঁহি নাহি যাউ
এ সব ছোড়ত পরাণ হারাউ', E'e
saba choḍato kańhi nāhi jāu
e
saba choḍato parāna hārāu', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'ভকতিবিনোদ কহে, শুন কান!
তুয়া উদ্দীপক হামারা পরাণ
2017', E'bhakativinoda kohe, śuno kān!
tuwā uddīpaka
hāmārā parān', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 7, Song 1: Kesava Tuwa Jagata Vicitra
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 7;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Kesava Tuwa Jagata Vicitra', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'কেশব! তুয়া জগত বিচিত্র
করম-বিপাকে, ভব-বন ভ্রম-ই,
পেখলুঁ রঙ্গ বহু চিত্র', E'keśava!
tuwā jagata vicitra
karama-vipāke,
bhava-vana bhrama-i,
pekhaluń
rańga bahu citra', E'This material creation of Yours, O Kesava, is most strange. I have roamed
throughout the forest of this universe in consequence of my selfish acts, and I
have beheld many strange and curious sights.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'তুয়া পদ-বিস্মৃতি, আ-মর যন্ত্রনা,
ক্লেশ-দহনে দোহি যায়
কপিল, পতঞ্জলি, গৌতম, কনভোজী,
জৈমিনি, বৌদ্ধ আওয়ে ধাই', E'tuwā
pada-vismṛti, ā-mara jantranā,
kleśa-dahane
dohi jāi
kapila,
patañjali, gautama, kanabhojī,
jaimini,
bauddha āowe dhāi', E'Forgetfulness of Your lotus feet has brought on anguish and grief. As I burn in
this fire of misery, my would-be saviors  Kapila, Gautama, Kanada, Jaimini,
and Buddha  come running to my aid.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'তব কৈ নিজ-মতে, ভুক্তি, মুক্তি যাচত,
পাত-ই নানা-বিধ ফাঁদ
সো-সবু-বঞ্চক, তুয়া ভক্তি বহির-মুখ,
ঘটাওয়ে বিষম পরমাদ', E'tab
koi nija-mate, bhukti, mukti yācato,
pāta-i
nānā-vidha phāńd
so-sabuvañcaka,
tuwā bhakti bahir-mukha,
ghaṭāowe
viṣama paramād', E'Each expounds his particular view, dangling various pleasures and liberation as
bait in their philosophical traps. They are all cheaters, averse to Your
devotional service and thus fatally dangerous.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'বৈমুখ-বঞ্চনে, ভট সো-সবু,
নিরমিল বিবিধ পসার
দণ্ডবত দূরত, ভকতিবিনোদ ভেল,
ভকত-চরণ করি সার
2017', E'vaimukha-vañcane,
bhaṭa so-sabu,
niramilo
vividha pasār
danḍavat
dūrato, bhakativinoda bhelo,
bhakata-caraṇa
kori sār', E'They are magnates of karma, jnana, and yoga who specialize in opinions and
proofs for cheating the materially inclined. Bhaktivinoda, considering refuge
at the feet of the Vaisnavas as essential, pays his respects to these cheating
philosophers from afar.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 7, Song 2: Tuwa Bhakti Pratikula
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 7;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Tuwa Bhakti Pratikula', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'তুয়া-ভক্তি-প্রতিকূল ধর্ম জাতে রয়
পরম যতনে তাহা ত্যজিব নিশ্চয়', E'tuwā-bhakti-pratikūla
dharma jāte roy
parama
jatane tāhā tyajibo niścoy', E'I
vow to abandon without compromise all actions contrary to Your devotional
service.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'তুয়া-ভক্তি-বহির-মুখ সঙ্গ না করিব
গৌরাঙ্গ-বিরোধি-জন-মুখ না হেরিব', E'tuwā-bhakti-bahir-mukha
sańga nā koribo
gaurāńga-virodhi-jana-mukha
nā heribo', E'I will
keep company with no one opposed to devotional service, nor even look at the
face of a person inimical toward Lord Gauranga.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'ভক্তি-প্রতিকূল স্থানে না করি বসতি
ভক্তির অপ্রিয় কার্যে নাহি করি রতি', E'bhakti-pratikūla
sthāne nā kori vasati
bhaktira
apriya kārye nāhi kori rati', E'I
shall never reside at a place unfavorable for devotional practices, and may I
never take pleasure in non-devotional works.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'ভক্তির বিরোধী গ্রন্থ পাঠ না করিব
ভক্তির বিরোধী ব্যাখ্যা কভু না শুনিব', E'bhaktira
virodhī grantha pāṭha nā koribo
bhaktira
virodhī vyākhyā kabhu nā śunibo', E'I
will read no book opposed to pure devotion, nor listen to any explanation which
disagrees with pure devotional principles.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'গৌরাঙ্গ-বর্জিত স্থান তীর্থ নাহি মানি
ভক্তির বাধক জ্ঞান-কর্ম তুচ্ছ জানি', E'gaurāńga-varjita
sthāna tīrtha nāhi māni
bhaktira
bādhaka jñāna-karma tuccha jāni', E'I
will never regard as sacred any place where Lord Gauranga is rejected. Any
knowledge hindering pure devotional service I consider worthless.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'ভক্তির বাধক কালে না করি আদর
ভক্তি বহির-মুখ নিজ-জনে জানি পর', E'bhaktira
bādhaka kāle nā kori ādar
bhakti
bahir-mukha nija-jane jāni par', E'Any
season which poses obstacles to the execution of devotional service shall find
no favor with me, and I will consider all relatives or family members averse to
pure devotion as strangers.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'ভক্তির বাধিকা স্পৃহা করিব বর্জন
অভক্ত-প্রদত্ত অন্ন না করি গ্রহন', E'bhaktira
bādhikā spṛhā koribo varjan
abhakta-pradatta
anna nā kori grahan', E'I
will abandon all desires that hinder devotion and never accept food offered to
me by non-devotee atheists.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'জাহা কিছু ভক্তি-প্রতিকূল বলি জানি
ত্যজিব যতনে তাহা, এ নিশ্চয় বানী', E'jāhā
kichu bhakti-pratikūla boli jāni
tyajibo
jatane tāhā, e niścoya vānī', E'I
vow to promptly shun whatever I know to contradict pure devotion. This I
strongly promise.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '9', 9, E'ভকতিবিনোদ পড়ি প্রভুর চরণে
মাগয়ে শকতি প্রতিকূল্যের বর্জনে
2017', E'bhakativinoda
poḍi prabhura caraṇe
māgaye
śakati pratikūlyera varjane', E'Bhaktivinoda, falling at the feet of the Lord, begs for the strength to give up
all obstacles to pure devotion.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 7, Song 3: Visaya Bimudha Ar Mayavadi
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 7;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Visaya Bimudha Ar Mayavadi', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'বিষয়-বিমূঢ আর মায়াবাদী জন
ভক্তি-শূন্য দুঁহে প্রাণ ধরে অকারণ', E'viṣaya-vimūḍha
ār māyāvādī jan
bhakti-śūnya
duńhe prāna dhare akāraṇ', E'Both the monist philosophers and those bewildered by worldly affairs live in
vain, for both are devoid of devotion to You.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'এই দুই-সঙ্গ নাথ! না হয় আমার
প্রার্থনা করিয়ে আমি চরণে তোমার', E'ei
dui-sańga nātha! nā hoy āmār
prārthanā
koriye āmi caraṇe tomār', E'I pray at Your lotus feet, O Lord, that I may be spared the company of them
both.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'সে দুয়ের মধ্যে বিষয়ী তবু ভাল
মায়াবাদী-সঙ্গ নাহি মাগি কন কাল', E'se
duwera madhye viṣayī tabu bhālo
māyāvādī-sańga
nāhi māgi kono kālo', E'Yet of the two the worldly man is better. I ask never to have the company of
mayavadi.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'বিষয়ী-হৃদয় যবে সাধু-সঙ্গ পায়
অনায়াসে লভে ভক্তি ভক্তের কৃপায়', E'viṣayī-hṛdoya
jabe sādhu-sańga pāy
anāyāse
labhe bhakti bhaktera kṛpāy', E'When the worldly man enters into the company of saintly persons within his
heart he becomes inspired by pure devotion through the mercy of those devotees.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'মায়াবাদ-দোষ যার হৃদয়ে পশিল
কুতর্কে হৃদয় তার বজ্র-সম ভেল', E'māyāvāda-doṣa
jāra hṛdoye paśilo
kutarke
hṛdoya tāra vajra-sama bhelo', E'But woe to him who has known the offensive presence of impersonalist
philosophy. Such sophistry makes the heart hard as a thunderbolt.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'ভক্তির স্বরূপ, আর বিষয়, আশ্রয়
মায়াবাদী অনিত্য বলিয়া সব কয়', E'bhaktira
swarūpa, āra `viṣaya, `āśroy
māyāvādī
`anitya boliyā saba koy', E'The mayavada philosopher declares that the true form of bhakti, its object (Sri
Krishna), and its possessor (the devotee) are all transitory and thus illusory.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'ধিক তার কৃষ্ণ-সেবা-শ্রবন-কীর্তন
কৃষ্ণ-অঙ্গে বজ্র হানে তাহার স্তবন', E'dhik
tāra kṛṣṇa-sevā-śravana-kīrtan
kṛṣṇa-ańge
vajra hāne tāhāra stavan', E'Fie on his pretense of service to Krishna, of hearing and chanting His glories!
His so-called prayers strike the body of Krishna with blows more cruel that a
thunderbolt.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'মায়াবাদ সম ভক্তি-প্রতিকূল নাই
অতএব মায়াবাদী-সঙ্গ নাহি চাই', E'māyāvāda
sama bhakti-pratikūla nāi
ataeva
māyāvādī-sańga nāhi cāi', E'There is no philosophy as antagonistic to devotional service as mayavada
philosophy. Therefore I do not desire the association of the mayavadi.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 9
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '9', 9, E'ভকতিবিনোদ মায়াবাদ দূর করি
বৈষ্ণব-সঙ্গেতে বৈসে নামাশ্রয় ধরি
2017', E'bhakativinoda
māyāvāda dūra kori
vaiṣṇava-sańgete
baise nāmāśraya dhori', E'Bhaktivinoda drives away the philosophy of illusionism and sits safely in the
society of Vaisnavas under the shelter of the holy name.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 7, Song 4: Ami To Swananda Sukhada Vasi
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 7;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Ami To Swananda Sukhada Vasi', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'আমি তো স্বানন্দ-সুখদ-বাসী
রাধিকা-মাধব-চরণ-দাসী', E'āmi
to swānanda-sukhada-bāsī
rādhikā-mādhava-caraṇa-dāsī', E'I
am a resident of Svananda-sukhada-kunja and a maidservant of the lotus feet of
Radhika and Madhava.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'দুঁহার মিলনে আনন্দ করি
দুঁহার বিয়োগে দুঃখেতে মরি', E'duńhāra
milane ānanda kori
duńhāra
viyoge duḥkhete mari', E'At
the union of the Divine Couple I rejoice, and in Their separation I die in
anguish.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'সখী-স্থলী নাহি হেরি নয়নে
দেখিলে শৈব্যাকে পরয়ে মনে', E'sakhī-sthalī
nāhi heri nayane
dekhile
śaibyāke paraye mane', E'I
never look at the place where Candravali and her friends stay. Whenever I see
such a place it reminds me of Candravalis gopi friend, Saibya.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'যে-যে প্রতিকূল চন্দ্রার সখী
প্রাণে দুঃখ পাই তাহারে দেখি', E'je-je
pratikūla candrāra sakhī
prāne
duḥkha pāi tāhāre dekhi', E'I
feel pain in my heart when I catch sight of Candravalis girl-friends, for they
are opposed to Radha.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'রাধিকা-কুঞ্জ আঁধার করি
লৈতে চাহে সে রাধার হরি', E'rādhikā-kuñja
āńdhāra kori
loite
cāhe se rādhāra hari', E'Candravali wants to take away Radhas Lord Hari, thus covering the grove of
Radhika with the darkness of gloom.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'শ্রী-রাধা-গোবিন্দ-মিলন-সুখ
প্রতিকূল-জন না হেরি মুখ', E'śrī-rādhā-govinda-milana-sukha
pratikūla-jana
nā heri mukha', E'I
never look at the faces of those who are opposed to Sri Radha and Govindas
joyous union.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'রাধা-প্রতিকূল যতেক জন-
সম্ভাষনে কভু না হয় মন', E'rādhā-pratikūla
jateka jana-
sambhāṣane
kabhu nā hoy mana', E'Nor
do I find any pleasure in conversing with those who are opposed to Radha.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'ভকতিবিনোদ শ্রী-রাধা-চরণে
সঁপেছে পরাণ অতীব যতনে
2017', E'bhakativinoda
śrī-rādhā-caraṇe
sańpeche
parāna atīva jatane', E'Bhaktivinoda has enthusiastically entrusted his soul to the lotus feet of
Srimati Radharani.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 1: Prapance Poriya Agati
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Prapance Poriya Agati', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'হরি হে!
প্রপঞ্চে পড়িয়া, অগতি হৈয়া,
না দেখি উপায় আর
অগতির গতি, চরণে শরণ,
তোমায় করিনু সার', E'hari
he!
prapañce
poḍiyā, agati hoiyā,
nā
dekhi upāya ār
agatira
gati, caraṇe śaraṇa,
tomāya
korinu sār', E'O Lord Hari, having fallen helplessly into the illusion of this world, I see no
other means of deliverance but You. You are the only recourse for the helpless.
I accept the shelter of Your lotus feet as essential.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'করম গেয়ান, কিছু নাহি মোর,
সাধন ভজন নাই
তুমি কৃপা-ময়, আমি তো কাঙ্গাল,
অহৈতুকী কৃপা চাই', E'karama
geyāna, kichu nāhi mora,
sādhana
bhajana nāi
tumi
kṛpā-moya, āmi to kāńgāla,
ahaitukī
kṛpā cāi', E'I have no knowledge, no background of pious activities, nor any history of
strict devotional practice. But You are full of compassion and kindness.
Therefore, although I am certainly destitute, I solicit Your causeless mercy.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'বাক্য-মন-বেগ, ক্রোধ-জিহ্বা-বেগ,
উদর-উপস্থ-বেগ
মিলিয়া এ সব, সংসারে ভাসায়ে,
দিতেছে পরমোদ্বেগ', E'vākya-mano-vega,
krodha-jihvā-vega,
udara-upastha-vega
miliyā
e saba, saḿsāre bhāsāye,
diteche
paramodvega', E'The powerful urges of speech, mind, anger, tongue, belly, and genital have
banded together to cast me adrift on the sea of this material world, thus
causing me great anxiety and trouble.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'অনেক যতনে, সে সব দমনে,
ছাড়িয়াছি আশা আমি
অনাথের নাথ! ডাকি তব নাম,
এখন ভরসা তুমি', E'aneka
jatane, se saba damane,
chāḍiyāchi
āśā āmi
anāthera
nātha! ḍāki tava nāma,
ekhona
bharasā tumi', E'After great endeavor to subdue these material demands, I have completely given
up all hope. O Lord of the destitute, I call upon Your holy name, for now You
are my only shelter.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 2: Arthera Sancaye
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Arthera Sancaye', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'হরি হে!
অর্থের সঞ্চয়ে, বিষয়-প্রয়াসে,
আন-কথা-প্রজল্পনে
আন-অধিকার, নিয়ম আগ্রহে,
অসত-সঙ্গ-সংঘটনে', E'hari
he!
arthera
sañcaye, viṣaya-prayāse,
āno-kathā-prajalpane
āno-adhikāra,
niyama āgrahe,
asat-sańga-saḿghaṭane', E'O Lord Hari, I have become absorbed in accumulating wealth and endeavoring for
material possessions. I am addicted to speaking of topics apart from You and am
always eager to accept practices apart from my own duties. I am in the habit of
meeting with worldly men and am absorbed in speculative thinking. Therefore,
devotion to You has remained distant from me. In this heart of mine dwells only
envy and malice towards others false pride, hypocrisy, deceitfulness, and the
desire for fame and honor.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'অস্থির সিদ্ধান্তে, রহিনু মজিয়া,
হরি-ভক্তি রৈল দূরে
এ হৃদয়ে মাত্র, পর-হিংসা, মদ,
প্রতিষ্ঠা, শঠতা স্ফুরে', E'asthira
siddhānte, rohinu mojiyā,
hari-bhakti
roilo dūre
e
hṛdoye mātro, para-hiḿsā, mada,
pratiṣṭhā,
śaṭhatā sphure', E'I have not been able to give up any of these attachments. Thus my own faults
have been my down fall. My birth as a human being has been wasted. O Lord Hari,
what am I to do now?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'এ সব আগ্রহ, ছাডিতে নারিনু,
আপন দোষতে মরি
জনম বিফল, হৈল আমার,
এখন কি করি, হরি!', E'e
saba āgraha, chāḍite nārinu,
āpana
doṣate mari
janama
biphala, hoilo āmāra,
ekhona
ki kori, hari!', E'I am indeed fallen; but Your holy name is the savior of the fallen. Clinging to
that holy name, I have taken shelter at Your lotus feet.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'আমি তো পতিত, পতিত-পাবন,
তোমার পবিত্র নাম
সে সম্বন্ধ ধরি, তোমার চরণে,
শরণ লৈনু হাম', E'āmi
to patita, patita-pāvana,
tomāra
pavitra nāma
se
sambandha dhori, tomāra caraṇe,
śaraṇa
loinu hāma', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 3: Bhajane Utsaha Bhaktite Visvasa
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Bhajane Utsaha Bhaktite Visvasa', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'হরি হে!
ভজনে উত্সাহ, ভক্তিতে বিশ্বাস,
প্রেম-লভে ধৈর্য-ধন
ভক্তি-অনুকূল, কর্ম-প্রবর্তন,
অসত-সঙ্গ-বিসর্জন', E'hari
he!
bhajane
utsāha, bhaktite viśvāsa,
prema-labhe
dhairya-dhana
bhakti-anukūla,
karma-pravartana,
asat-sańga-visarjana', E'Enthusiasm in devotional service, faith in the process of devotional service,
the treasure of patience in endeavoring to attain love of God, performing
activities conducive to pure devotion, abandoning the company of worldly
people, performing approved devotional practices  I have never possessed these
six devotional qualities. How, then, shall I give up the association of maya
and worship Your lotus feet, O Lord?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'ভক্তি-সদাচার, এই ছয গুন,
নাহিল আমার নাথ!
কেমনে ভজিব, তোমার চরণ,
ছাড়িয়া মায়ার সাথ', E'bhakti-sadācāra,
ei chaya guna,
nāhilo
āmāra nātha!
kemone
bhojibo, tomāra caraṇa,
chāḍiyā
māyāra sātha', E'Absorbed in abominable activities, I never kept company with sadhus. Now I
adopt the garb of the sadhus and instruct others. This is mayas big joke.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'গর্হিত আচারে, রহিলাম মজি,
না করিনু সাধু-সঙ্গ
লয়ে সাধু-বেশ, আনে উপদেশি,
এ বড় মায়ার রঙ্গ', E'garhita
ācāre, rohilāma moji,
nā
korinu sādhu-sańga
loye
sādhu-veśa, āne upadeśi,
e
boḍo māyāra rańga', E'O
Lord Hari, in such a helpless condition surely I will obtain Your causeless
mercy. O when, under the shelter of my spiritual master, will I call out to You
with humble prayers?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'এ হেন দশায়, অহৈতুকী কৃপা,
তোমার পাইব, হরি!
শ্রী-গুরু-আশ্রয়ে, ডাকিব তোমায়,
কবে বা মিনতি করি', E'e
heno daśāya, ahaitukī kṛpā,
tomāra
pāibo, hari!
śrī-guru-āśroye,
ḍākibo tomāya,
kabe
vā minati kori', E'', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 4: Dana Pratigraha Mitho
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Dana Pratigraha Mitho', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'হরি হে!
দান, প্রতিগ্রহ, মিথ গুপ্ত-কথা,
ভক্ষন, ভোজন-দান
সঙ্গের লক্ষন, এই ছয় হয়,
ইহাতে ভক্তির প্রান', E'hari
he!
dāna,
pratigraha, mitho gupta-kathā,
bhakṣana,
bhojana-dāna
sańgera
lakṣana, ei chaya hoya,
ihāte
bhaktira prāna', E'O
Lord Hari, to offer a gift and receive one in return, to give and receive
spiritual food, to reveal ones confidential thoughts and make confidential
inquiries  these are the six characteristics of loving association, and in
them is found the very soul of devotion.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'তত্ত্ব না বুঝিয়ে, জ্ঞানে বা অজ্ঞানে,
অসতে এ সব করি
ভক্তি হারাইনু, সংসারী হৈনু,
সুদূরে রহিলে হরি', E'tattva
nā bujhiye, jñāne vā ajñāne,
asate
e saba kori
bhakti
hārāinu, saḿsārī hoinu,
sudūre
rohile hari', E'I
have failed to understand the Absolute Truth, and by practicing these six
activities with non-devotees, either knowingly or unknowingly, I have lost all
devotion. Thus I have become a materialist. For me, You, O Lord, remain afar.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'কৃষ্ণ-ভক্ত-জনে, এই সঙ্গ-লক্ষনে,
আদর করিব যবে
ভক্তি-মহা-দেবী, আমার হৃদয়-
আসনে বসিবে তবে', E'kṛṣṇa-bhakta-jane,
ei sańga-lakṣane,
ādara
koribo jabe
bhakti-mahā-devī,
āmāra hṛdoya-
āsane
bosibe tabe', E'The
day I cherish these activities of intimate association with the devotees of Sri
Krsna, that day the great goddess of devotion will ascend the throne of my
heart.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'যোষিত-সঙ্গী-জন, কৃষ্ণাভক্ত আর,
দুঙ্হু-সঙ্গ-পরিহরি
তব ভক্ত-জন- সঙ্গ অনুক্ষন,
কবে বা হৈবে হরি!', E'yoṣit-sańgī-jana,
kṛṣṇābhakta āra,
duńhu-sańga-parihari
tava
bhakta-jana- sańga anukṣana,
kabe
vā hoibe hari!', E'When will I give up the company of those who are addicted to women and those
who are not devoted to You? When will I get the constant association of Your
devotees, O Lord?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 5: Sanga Dosa Sunya
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Sanga Dosa Sunya', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'হরি হে!
সঙ্গ-দোষ-শূন্য, দীক্ষিতাদীক্ষিত,
যদি তব নাম গায়
মানসে আদর, করিব তাহারে,
জানি নিজ-জন তায়', E'hari
he!
sańga-doṣa-śūnya,
dīkṣitādīkṣita,
jadi
tava nāma gāya
mānase
ādara, koribo tāhāre,
jāni
nija-jana tāya', E'O Lord, I will mentally honor and consider as my brother one who avoids bad
company and sings Your holy name, be he formally initiated or not.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'দীক্ষিত হৈয়া, ভজে তুয়া পদ,
তাহারে প্রনতি করি
অনন্য-ভজনে, বিজ্ঞ যেই জন,
তাহারে সেবিব, হরি!', E'dīkṣita
hoiyā, bhaje tuwā pada,
tāhāre
pranati kori
ananya-bhajane,
vijña yei jana,
tāhāre
sevibo, hari!', E'I offer obeisances to that person who is initiated and worships Your lotus
feet, and I will serve, O Lord, anyone who is fixed in unalloyed devotion to
You.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'সর্ব-ভূতে সম, যে ভক্তের মতি,
তাহার দর্শনে মানি
আপনাকে ধন্য, সে সঙ্গ পাইয়া,
চরিতার্থ হৈলুঁ জানি', E'sarva-bhūte
sama, ye bhaktera mati,
tāhāra
darśane māni
āpanāke
dhanya, se sańga pāiyā,
caritārtha
hoiluń jāni', E'I consider myself greatly fortunate to even see that devotee who looks upon all
living beings equally. By obtaining his association I know that I become
successful in life.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'নিষ্কপট-মতি, বৈষ্ণবের প্রতি,
এই ধর্ম কবে পাব
কবে সংসার- সিন্ধু-পার হয়ে,
তব ব্রজ-পুরে যাব
UDPATED: January 5, 2017', E'niṣkapaṭa-mati,
vaiṣṇavera prati,
ei
dharma kabe pābo
kabe
saḿsāra- sindhu-pāra hoye,
tava
braja-pure jābo', E'When will my mind become simple and inoffensive toward the Vaisnavas, and when
will I cross over the ocean of worldly existence to reach Your abode of Vraja?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 6: Nira Dharma Gata
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Nira Dharma Gata', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'হরি হে!
নীর-ধর্ম-গত, জাহ্নবী-সলিলে,
পঙ্ক-ফেন দৃষ্ট হয়
তথাপি কখনো, ব্রহ্ম-দ্রব-ধর্ম,
সে সলিল না ছাড়য়', E'hari
he!
nīra-dharma-gata,
jāhnavī-salile,
pańka-phena
dṛṣṭa hoya
tathāpi
kakhona, brahma-drava-dharma,
se
salila nā chāḍoya', E'Mud and foam are seen in the waters of the Ganges, for that is the inherent
nature of river water. Yet Ganges water never loses its transcendental nature.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'বৈষ্নব-শরীর, অপ্রাকৃত সদা,
স্বভাব-বপুর ধর্মে
কভু নাহে জড়, তথাপি যে নিন্দে,
পড়ে সে বিষমাধর্মে', E'vaiṣnava-śarīra,
aprākṛta sadā,
swabhāva-vapura
dharme
kabhu
nāhe jaḍa, tathāpi ye ninde,
poḍe
se viṣamādharme', E'One may likewise find defects in the body of a Vaisnava, yet his body is always
spiritual, never material. That person who criticizes the body of a Vaisnava
falls into deadly irreligion.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'সেই অপরাধে, যমের যাতনা,
পায় জীব অবিরত
হে নন্দ-নন্দন! সেই অপরাধে,
যেন নাহি হয় হত', E'sei
aparādhe, yamera jātanā,
pāya
jīva avirata
he
nanda-nandana! sei aparādhe,
yeno
nāhi hoi hata', E'For such an offense, the fallen soul continuously suffers the tortures of Yamaraja,
lord of death. O youthful son of Nanda, I pray that I not be destroyed by
committing such an offense.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'তোমার বৈষ্ণব, বৈভব তোমার,
আমারে করুনা দয়া
তবে মোর গতি, হবে তব প্রতি,
পাব তব পদ-ছায়া', E'tomāra
vaiṣṇava, vaibhava tomāra,
āmāre
korunā doyā
tabe
mora gati, habe tava prati,
pābo
tava pada-chāyā', E'The Vaisnava is Yours, and he is Your glory. May he be merciful to me. Then my
lifes journey will lead to You, and I will obtain shelter in the shade of Your
lotus feet.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 7: Ohe Vaisnava Thakura
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Ohe Vaisnava Thakura', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'ওহে! বৈষ্ণব ঠাকুর, দয়ার সাগর,
এ দাসে করুণা করি
দিয়া পদ-ছায়া, শোধো হে আমায়,
তোমার চরণ ধরি', E'ohe!
vaiṣṇaba ṭhākura, doyāra sāgara,
e dāse koruṇā kori''
diyā pada-chāyā, śodho he āmāya,
tomāra caraṇa dhori', E'O venerable Vaisnava, devotee of Krsna! O ocean of mercy, be merciful unto your
servant. Give me the shade of your lotus feet and purify me. I hold on to your
lotus feet.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'ছয় বেগ দমি, ছয় দোষ শোধি,
ছয় গুণ দেহো দাসে
ছয় সত-সঙ্গ, দেহো হে আমারে,
বশেছি সঙ্গের আশে', E'chaya
bega domi'', chaya doṣa śodhi'',
chaya guṇa deho'' dāse
chaya sat-sańga, deho'' he āmāre,
bosechi sańgera āśe', E'Teach me to control my six passions; rectify my six faults, bestow upon me the
six qualities, and offer unto me the six kinds of holy association.*', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'একাকী আমার, নাহি পায় বল,
হরি-নাম-সঙ্কীর্ত্তনে
তুমি কৃপা করি, শ্রদ্ধা-বিন্দু দিয়া,
দেহো কৃষ্ণ-নাম-ধনে', E'ekākī
āmāra, nāhi pāya bala,
hari-nāma-sańkīrtane
tumi kṛpā kori'', śraddhā-bindu diyā,
deho'' kṛṣṇa-nāma-dhane', E'I do not find the strength to carry on alone the sankirtana of the holy name of
Hari. Please bless me by giving me just one drop of faith with which to obtain
the great treasure of the holy name of Krsna.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'কৃষ্ণ সে তোমার, কৃষ্ণ দিতে পার,
তোমার শকতি আছে
আমি তো কাঙ্গল, কৃষ্ণ কৃষ্ণ বলি,
ধাই তব পাছে পাছে', E'kṛṣṇa
se tomāra, kṛṣṇa dīte pāro,
tomāra śakati āche
āmi to'' kāńgāla, ''kṛṣṇa''
''kṛṣṇa'' boli'',
dhāi tava pāche pāche
WORD
FOR WORD', E'Krsna is yours. You have the power to give Him to me. I am simply your servant
running behind you shouting, "Krsna! Krsna!"', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 8: Tomare Bhuliya
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Tomare Bhuliya', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 8;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'হরি হে!
তোমারে ভুলিয়া, অবিদ্যা-পীড়ায়,
পীড়িত রসনা মোর
কৃষ্ণ-নাম-সুধা, ভাল নাহি লাগে,
বিষয়-সুখতে ভর', E'hari
he!
tomāre
bhuliyā, avidyā-pīḍāya,
pīḍita
rasanā mora
kṛṣṇa-nāma-sudhā,
bhālo nāhi lāge,
viṣaya-sukhate
bhora', E'O
Lord Hari, because I forgot You my tongue has become afflicted with the disease
of ignorance. I cannot relish the nectar of Your holy name, for I have become
addicted to the taste of worldly pleasures.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'প্রতি-দিন যদি, আদর করিয়া,
সে নাম কীর্তন করি
সিতপল যেন, নাশি রোগ-মূল,
ক্রমে স্বাদু হয়, হরি!', E'prati-dina
jadi, ādara koriyā,
se
nāma kīrtana kori
sitapala
jeno, nāśi roga-mūla,
krame
swādu hoya, hari!', E'O
Lord Hari, if I sing Your holy name aloud every day with great respect, then as
sugar candy taken medicinally destroys the very disease which makes it taste
bitter (jaundice), so Your holy name will cure my spiritual disease and allow
me to gradually taste His sweetness.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'দুর্দৈব আমার, সে নামে আদর,
না হৈল, দয়াময়!
দশ অপরাধ, আমার দুর্দৈব,
কেমনে হৈবে ক্ষয়', E'durdaiva
āmāra, se nāme ādara,
nā
hoilo, doyāmoya!
daśa
aparādha, āmāra durdaiva,
kemone
hoibe kṣoya', E'O
merciful Lord, how great is my misfortune that I feel no appreciation for Your
holy name! In such a lamentable state, how will I be freed from committing the
ten offenses to the holy name?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'অনুদিন যেন, তব নাম গাই,
ক্রমেতে কৃপায় তব
অপরাধ যাবে, নামে রুচি হবে,
আস্বাদিব নামাসব', E'anudina
jeno, tava nāma gāi,
kramete
kṛpāya tava
aparādha
jābe, nāme ruci habe,
āswādibo
nāmāsava', E'If
I sing Your holy name every day, by Your mercy the ten offenses will gradually
disappear. A taste for Your holy name will grow within me, and then I will
taste the intoxicating spirit of the name.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 9: Sri Rupa Gosai Sri Guru Rupete
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 9, E'Sri Rupa Gosai Sri Guru Rupete', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 9;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'হরি হে!
শ্রী-রূপ-গোসাঞি, শ্রী-গুরু-রূপেতে,
শিক্ষা দিল মোর কানে
জান মোর কথা, নামের কাঙ্গাল!
রতি পাবে নাম-গানে', E'hari
he!
śrī-rūpa-gosāi,
śrī-guru-rūpete,
śikṣā
dila mora kāne
jāno
mora kathā, nāmera kāńgāla!
rati
pābe nāma-gāne', E'O Lord Hari, Sri Rupa Gosvami, in the form of the spiritual master, gave these
instructions to my ears: Try to understand my words, O you who begs for the
gift of the holy name, for by these instructions you will develop attraction
for chanting the holy name.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'কৃষ্ণ-নাম-রূপ- গুন-সুচরিত,
পরম যতনে করি
রসনা-মানসে, করহ নিয়োগ,
ক্রম-বিধি অনুসরি', E'kṛṣṇa-nāma-rūpa-
guna-sucarita,
parama
jatane kori
rasanā-mānase,
koraho niyoga,
krama-vidhi
anusari', E'Follow the scriptural rules and regulations and engage your tongue and mind in
carefully chanting and remembering the holy names, divine forms, qualities, and
wonderful pastimes of Lord Krishna.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'ব্রজে করি বাস, রাগানুগা হৈয়া,
স্মরণ কীর্তন কর
এ নিখিল কাল, করহ জাপন,
উপদেশ-সার ধর', E'braje
kori bāsa, rāgānugā hoiyā,
smaraṇa
kīrtana koro
e
nikhila kāla, koraho jāpana,
upadeśa-sāra
dharo ', E'Dwell in the holy land of Vraja, cultivate spontaneous loving devotion
(raganuga-bhakti), and spend your every moment chanting and remembering the
glories of Sri Hari. Just accept these as the essence of all instructions.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'হা! রূপ-গোসাঞি, দয়া করি কবে,
দিবে দিনে ব্রজ-বাস
রাগাত্মিক তুমি, তব পদানুগ,
হৈতে দাসের আশা', E'hā!
rūpa-gosāi, doyā kori kabe,
dibe
dine braja-bāsa
rāgātmika
tumi, tava padānuga,
hoite
dāsera āśā', E'O Rupa Gosvami, when out of your causeless mercy, will you enable this poor
wretched soul to reside in Vrndavana? You are a ragatmika devotee, an eternally
liberated, intimate associate of Radha and Krsna. This humble servant of yours
desires to become a follower at your lotus feet', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 10: Gurudeva Boro Krpa Kori
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 10, E'Gurudeva Boro Krpa Kori', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 10;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'গুরুদেব!
বড় কৃপা করি, গৌড়-বন মাঝে,
গোদ্রুমে দিয়াছ স্থান
আজ্ঞা দিল মোরে, এই ব্রজে বসি,
হরি-নাম কর গান', E'gurudev!
boḍo
kṛpā kori, gauḍa-vana mājhe,
godrume
diyācho sthāna
ājñā
dila more, ei braje bosi,
hari-nāma
koro gāna', E'Gurudeva! Because you are so merciful, you gave me a place in Godruma amid the woodlands
of Gauda, with this order to fulfill: Dwell here in this Vrndavana and sing
the holy name of Hari.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'কিন্তু কবে প্রভু, যোগ্যতা অর্পিবে,
এ দাসেরে দয়া করি
চিত্ত স্থির হবে, সকল সহিব,
একান্তে ভজিব হরি', E'kintu
kabe prabhu, yogyatā arpibe,
e
dāsere doyā kori
citta
sthira habe, sakala sohibo,
ekānte
bhajibo hari', E'But
when, O master, out of your great mercy, will you bestow upon this servant of
yours the spiritual competence to fulfill that order? When will my mind become
tranquil and fixed? When will I endure all hardships and serve Lord Hari
without distractions?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'শৈশব-যৌবনে, জড়-সুখ-সঙ্গে,
অভ্যাস হৈল মন্দ
নিজ-কর্ম-দোষে, এ দেহ হৈল,
ভজনের প্রতিবন্ধ', E'śaiśava-yauvane,
jaḍa-sukha-sańge,
abhyāsa
hoilo manda
nija-karma-doṣe,
e deho hoilo,
bhajanera
pratibandha', E'Due
to attachment to worldly pleasures in childhood and youth, I have developed bad
habits. Because of these sinful acts my body has become an impediment to the
service of the Supreme Lord.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'বার্ধক্যে এখন, পঞ্চ-রোগে হত,
কেমনে ভজিব বল
কাঁদিয়া কাঁদিয়া, তোমার চরণে,
পড়িয়াছি সুবিহ্বল
2015', E'vārdhakye
ekhona, pañca-roge hata,
kemone
bhojibo bolo
kāńdiyā
kāńdiyā, tomāra caraṇe,
poḍiyāchi
suvihvala', E'Now, in old age, afflicted by the five-fold illnesses, how will I serve the
Lord? O master, please tell me. I have fallen at your feet weeping, overwhelmed
by anxiety.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 11: Gurudeva Krpa Bindu Diya
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 11, E'Gurudeva Krpa Bindu Diya', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 11;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'গুরুদেব!
কৃপা-বিন্দু দিয়া, কর এই দাসে,
তৃণাপেখা অতি হীন
সকল সহনে, বল দিয়া কর,
নিজ-মানে স্পৃহা-হীন', E'gurudev!
kṛpā-bindu diyā, koro'' ei dāse,
tṛṇāpekhā ati hīna
sakala sahane, bala diyā koro'',
nija-māne spṛhā-hīna', E'Gurudeva, O spiritual master! Give to this servant just one drop of mercy. I am
lower than a blade of grass. Give me all help. Give me strength. Let me be as
you are, without desires or aspirations.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'সকলে সম্মান করিতে শকতি,
দেহ নাথ! যথাযথ
তবে ত গাইব, হরি-নাম-সুখে,
অপরাধ হ বে হত', E'sakale
sammāna korite śakati,
deho'' nātha! jathājatha
tabe to'' gāibo, hari-nāma-sukhe,
aparādha ha ''be hata', E'I
offer you all respects, for thus I may have the energy to know you correctly.
Then, by chanting the holy name in great ecstasy, all my offenses will cease.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'কবে হেন কৃপা, লভিয়া এ জন,
কৃতার্থ হৈবে, নাথ!
শক্তি-বুদ্ধি-হীন, আমি অতি দীন,
কর মোরে আত্ম-সাথ', E'kabe
heno kṛpā, labhiyā e jana,
kṛtārtha hoibe, nātha!
śakti-buddhi-hīna, āmi ati dīna,
koro'' more ātma-sātha', E'When will such mercy fall to this one who is weak and devoid of intelligence?
Allow me to be with you.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'জোগ্যতা-বিচারে, কিছু নাহি পাই,
তোমার করুণা-সার
করুণা না হৈলে, কান্দিয়া কান্দিয়া,
প্রাণ না রাখিব আর', E'jogyatā-vicāre,
kichu nāhi pāi,
tomāra karuṇā-sāra
karuṇā nā hoile, kāndiyā kāndiyā,
prāṇa nā rākhibo āra
WORD
FOR WORD', E'If
you examine me, you will find no qualities. Your mercy is all that I am made
of. If you are not merciful unto me, I can only weep, and I will not be able to
maintain my life.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 12: Gurudeva Kabe Mora Sei
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 12, E'Gurudeva Kabe Mora Sei', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 12;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'গুরুদেব!
কবে মোর সেই দিন হবে
মন স্থির করি, নির্জনে বসিয়া,
কৃষ্ণ-নাম গাব
যবে
সংসার-ফুকার, কানে না
পষিবে,
দেহ-রোগ দূরে রবে', E'gurudev!
kabe
mora sei din habe
mana
sthira kori, nirjane bosiyā,
kṛṣṇa-nāma
gābo jabe
saḿsāra-phukāra,
kāne nā poṣibe,
deho-roga
dūre robe', E'Gurudeva! O spiritual master! When, with a steady mind in a secluded place,
will I sing the name of Sri Krsna? When will the pandemonium of worldly
existence no longer echo in my ears and the diseases of the body remain far
away? When will that day be mine?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'হরে কৃষ্ণ বলি, গাহিতে গাহিতে,
নয়নে বহিবে লোর
দেহেতে পুলক, উদিত হৈবে,
প্রেমেতে করিবে ভোর', E'`hare
kṛṣṇa boli, gāhite gāhite,
nayane
bohibe lora
dehete
pulaka, udita hoibe,
premete
koribe bhora', E'When I chant Hare Krsna, tears of love will flow from my eyes and ecstatic
rapture will arise within my body, causing my hair to stand on end and my body
to become overwhelmed with divine love.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'গদ-গদ
বানী, মুখে বাহিরিবে,
কাঁপিবে শরীর মম
ঘর্ম মুহুর্মুহুঃ, বির্বর্ন হৈবে,
স্তম্ভিত প্রলয় সম', E'gada-gada
vānī, mukhe bāhiribe,
kāńpibe
śarīra mama
gharma
muhur muhuḥ, virvarna hoibe,
stambhita
pralaya sama', E'Faltering words choked with emotion will issue from my mouth. My body will
tremble, constantly perspire, turn pale and discolored, and become stunned. All
of this will be like a devastation of ecstatic love and cause me to fall
unconscious.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'নিষ্কপটে হেন, দশা কবে হবে,
নিরন্তর নাম গাব
আবেশে রহিয়া, দেহ-যাত্রা করি,
তোমার করুনা পাব', E'niṣkapaṭe
heno, daśā kabe habe,
nirantara
nāma gābo
āveśe
rohiyā, deha-yātrā kori,
tomāra
karunā pābo', E'When will such a genuine ecstatic condition be mine? I will constantly sing the
holy name and remain absorbed in profound devotion while maintaining the
material body. In this way I will obtain your mercy.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 8, Song 13: Gurudeva Kabe Tava Karuna
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 8;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 13, E'Gurudeva Kabe Tava Karuna', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 13;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'গুরুদেব!
কবে তব করুনা-প্রকাশে
শ্রী-গৌরাঙ্গ-লীলা, হয় নিত্য-তত্ত্ব,
এই দৃঢ বিশ্বাসে
হরি হরি বলি, গোদ্রুম-কাননে,
ভ্রমিব দর্শন-আশে', E'gurudev!
kabe
tava karunā-prakāśe
śrī-gaurāńga-līlā,
hoya nitya-tattwa,
ei
dṛḍha viśvāse
`hari
hari boli, godruma-kānane,
bhromibo
darśana-āśe', E'Gurudeva! O spiritual master! Lord Gaurangas transcendental pastimes are
eternal realities. I wait for the day when, with this firm faith manifested by
your mercy, I will wander through the groves of Godruma, chanting Hari! Hari!
and hoping to behold those pastimes.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'নিতাই, গৌরাঙ্গ, অদ্বৈত, শ্রীবাস,
গদাধর,-পঞ্চ-জন
কৃষ্ণ-নাম-রসে, ভাসাবে জগত,
করি মহা-সঙ্কীর্তন', E'nitāi,
gaurāńga, adwaita, śrīvāsa,
gadādhara,pañca-jana
kṛṣṇa-nāma-rase,
bhāsābe jagat,
kori
mahā-sańkīrtana', E'The Panca-tattva (Nitai, Gauranga, Advaita, Srivasa and Gadadhara) will flood
the entire universe with the intoxicating nectar of the holy name of Sri Krsna
by performing a maha-sankirtana.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'নর্তন-বিলাস, মৃদঙ্গ-বাদন,
শুনিব আপন-কানে
দেখিয়া দেখিয়া, সে লীলা-মাধুরী,
ভাসিব প্রেমের বানে', E'nartana-vilāsa,
mṛdańga-vādana,
śunibo
āpana-kāne
dekhiyā
dekhiyā, se līlā-mādhurī,
bhāsibo
premera bāne', E'In my ears I will hear the sounds of dancing and the playing of the mrdangas.
By constantly beholding the sweetness and beauty of that pastime of Lord
Gaurangas, I will swim in the flood tide of divine love.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'না দেখি আবার, সে লীলা-রতন,
কাঁদি হা গৌরাঙ্গ! বলি
আমারে বিষয়ী, পাগল বলিয়া,
অঙ্গেতে দিবেক ধূলি', E'nā
dekhi ābāra, se līlā-ratana,
kāńdi
hā gaurāńga! boli
āmāre
viṣayī, pāgala boliyā,
ańgete
dibeka dhūli', E'Materialists will throw dirt at my body and proclaim me thoroughly mad. For
being again bereft of seeing the jewel of that pastime, I shall weep and cry
out, O my Lord Gauranga!', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 9, Song 1: Kabe Gaura Vane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 9;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Kabe Gaura Vane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'কবে গৌর-বনে, সুরধুনী-তটে,
হা রাধে হা কৃষ্ণ বোলে
কান্দিয়া বেড়াবো, দেহ-সুখ ছাড়ি,
নানা লতা-তরু-তলে', E'kabe
gaura-vane, suradhunī-taṭe,
`hā rādhe hā kṛṣṇa'' bole''
kāńdiyā beḍā''bo, deho-sukha chāḍi'',
nānā latā-taru-tale', E'When, oh when will I wander here and there, weeping under the shade of the trees
and creepers along the banks of the celestial Ganges River in Navadvipa? I will
cry out "Oh Radhe! Oh Krsna!", and I will completely forget about all
the so-called pleasures of this material body.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'স্ব-পচ-গৃহেতে, মাগিয়া খা‌ইবো,
পিবো সরস্বতী-জল
পুলিনে পুলিনে, গড়াগড়ি দিবো,
করি কৃষ্ণ-কোলাহল', E'śwa-paca-gṛhete,
māgiyā khāibo,
pibo saraswatī-jala
puline puline, gaḍā-gaḍi dibo,
kori'' kṛṣṇa-kolāhala', E'When will I be able to live so simply by begging some food from the homes of
the untouchables who live here and there? I will drink the water of the
Sarasvati, and in ecstasy I will roll to and fro on the banks of the river,
raising a loud uproar of "Krsna! Krsna!"', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'ধাম-বাসী জনে, প্রণতি করিয়া,
মাগিবো কৃপার লেশ
বৈষ্ণব-চরণ-রেণূ গায় মাখি,
ধোরি অবধূত-বেশ', E'dhāma-bāsī
jane, pranati koriyā,
māgibo kṛpāra leśa
vaiṣṇava-caraṇa- reṇu gāya mākhi'',
dhori'' avadhūta-veśa', E'When will I bow down to all the inhabitants of the holy land of Navadvipa and
receive a bit of their causeless mercy? I will smear the dust of the Vaisnavas
lotus feet all over my body, and I will wear the dress of a mad wandering
mendicant.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'গৌড়-ব্রজ-জনে, ভেদ না দেখিব,
হো‌ইবো বরজ-বাসী
ধামের স্বরূপ, স্ফুরিবে নয়নে,
হো‌ইবো রাধার দাসী', E'gauḍa-braja-jane,
bheda nā dekhibo,
hoibo baraja-bāsī
dhāmera swarūpa, sphuribe nayane,
hoibo rādhāra dāsī
WORD
FOR WORD', E'When I factually observe that the transcendental lane of Navadvipa is not
different from Sri Vraja-bhumi, then I shall be transformed into a Vrajabasi
also. Then I will see the true form of the transcendental realm opening up
before my very eyes, and I will thus become one of the maidservants of Srimati
Radharanai.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 9, Song 2: Dekhite Dekhite
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 9;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Dekhite Dekhite', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'দেখিতে দেখিতে, ভুলিব বা কবে,
নিজ-স্থূল-পরিচয়
নয়নে হেরিব, ব্রজ-পুর-শোভা,
নিত্য চিদ-আনন্দ-ময়', E'dekhite
dekhite, bhulibo vā kabe,
nija-sthūla-paricoya
nayane
heribo, braja-pura-śobhā,
nitya
cid-ānanda-moya', E'When will I be able to leave this plane of my gross bodily identity far behind?
Within a split second, I will completely forget about all these false external
affairs and behold the exquisite beauty of the transcendental realm of Vraja,
which is completely paraded with eternal, conscious bliss.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'বৃষভানু-পুরে, জনম লৈব,
যাবটে বিবাহ হবে
ব্রজ-গোপী-ভাব, হৈবে স্বভাব,
আনো-ভাব না রহিবে', E'bṛṣabhānu-pure,
janama loibo,
yāvaṭe
vivāha habe
braja-gopī-bhāva,
hoibe swabhāva,
āno-bhāva
nā rohibe', E'I shall then take birth in Barsana, the town of King Vrsabhanu, and I will be
married nearby in the town of Yavata. My sole disposition and character shall
be that of a simple cowherd girl, and I shall not know any other mood.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'নিজ-সিদ্ধ-দেহ, নিজ-সিদ্ধ-নাম,
নিজ-রূপ-স্ব-বসন
রাধা-কৃপা-বলে, লোভিব বা কবে,
কৃষ্ণ-প্রেম-প্রকরণ', E'nija-siddha-deha,
nija-siddha-nāma,
nija-rūpa-swa-vasana
rādhā-kṛpā-bale,
lobhibo vā kabe,
kṛṣṇa-prema-prakaraṇa', E'I shall obtain my own eternal spiritual body, transcendental name, and specific
type of beauty and dress for the pleasure of Krsna. And when, by the power of
Sri Radha''s causeless mercy, will I be allowed entrance into the pastimes of
divine love of Krsna?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'যমুনা-সলিল- আহরণে গিয়া,
বুঝিব যুগল-রস
প্রেম-মুগ্ধ হয়ে, পাগলিনী-প্রায়,
গাইব রাধার যশ', E'jamunā-salila-
āharaṇe giyā,
bujhibo
yugala-rasa
prema-mugdha
hoye, pāgalinī-prāya,
gāibo
rādhāra yaśa', E'As I go with a water pot on my head to draw water from the Yamuna river, I
shall cherish remembrance of the mellows of conjugal love that unite Sri Radha
with Krsna. Thus being enchanted by Their divine love, I will madly sing the
glories of Sri Radha just like a raving lunatic.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 9, Song 3: Vrsabhanu Suta Carana Sevane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 9;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Vrsabhanu Suta Carana Sevane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'বৃষভানু-সুতা- চরণ-সেবনে,
হৈব যে পাল্য-দাসী
শ্রী-রাধার সুখ, সতত সাধনে,
রহিব আমি প্রয়াসী', E'vṛṣabhānu-sutā-
caraṇa-sevane,
hoibo
ye pālya-dāsī
śrī-rādhāra
sukha, satata sādhane,
rohibo
āmi prayāsī', E'For serving the lotus feet of the charming daughter of King Vrsabhanu, I will
become a sheltered maidservant of Her maidservant. Indeed, I will live only for
the happiness of Sri Radha, and I will always endeavor to increase Her joy.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'শ্রী-রাধার সুখে, কৃষ্ণএর যে সুখ,
জানিব মনেতে আমি
রাধা-পদ ছাড়ি, শ্রী-কৃষ্ণ-সঙ্গমে,
কভু না হৈব কামী', E'śrī-rādhāra
sukhe, kṛṣṇaera ye sukha,
jānibo
manete āmi
rādhā-pada
chāḍi, śrī-kṛṣṇa-sańgame,
kabhu
nā hoibo kāmī', E'I will understand within my heart that Krsna feels happiness only when Radha is
happy. I will thus never, ever dare become desirous of abandoning Radhika''s
lotus feet to be with Krsna myself.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'সখী-গণ মম, পরম-সুহৃত,
যুগল-প্রেমের গুরু
তদ-অনুগা হয়ে, সেবিব রাধার,
চরণ-কলপ-তরু', E'sakhī-gaṇa
mama, parama-suhṛt,
yugala-premera
guru
tad-anugā
hoye, sevibo rādhāra,
caraṇa-kalapa-taru', E'All my associate sakhis are my supreme well-wishers, my best friends, and they
are the teachers of my lessons in conjugal love. Simply by following them, I
will serve the lotus feet of Radha, which are just like desire-fulfilling
trees.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'রাধা-পক্ষ ছাড়ি, যে-জন সে-জন,
যে ভাবে সে ভাবে থাকে
আমি তো রাধিকা- পক্ষ-পাতী সদা,
কভু নাহি হেরি তাকে', E'rādhā-pakṣa
chāḍi, ye-jana se-jana,
ye
bhāve se bhāve thāke
āmi
to rādhikā- pakṣa-pātī sadā,
kabhu
nāhi heri tāke', E'I am forever partial and prone to favoring the party of Sri Radhika. I will
never even look upon those persons who have abandoned Her entourage, whoever
they may be and regardless of what they preach.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 10, Song 1: Kabe Ha''be Bolo Sei Dina Amar
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 10;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Kabe Ha''be Bolo Sei Dina Amar', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'কবে হবে বল সে-দিন আমার
(আমার) অপরাধ ঘুচি, শুদ্ধ নামে রুচি,
কৃপা-বলে হবে হৃদয়ে সঞ্চার', E'kabe
ha''be bolo se-dina āmār
(āmār) aparādha ghuci'', śuddha nāme ruci,
kṛpā-bale ha''be hṛdoye sañcār', E'When, O when, will that day be mine? When will you give me your blessings,
erase all my offences and give my heart a taste [ruci] for chanting the Holy
Name in purity?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'তৃণাধিক হীন, কবে নিজে মানি,
সহিষ্ণুতা-গুণ হৃদয়েতে আনি
সকলে মানদ, আপনি অমানী,
হয়ে আস্বাদিবো নাম-রস-সার', E'tṛṇādhika
hīna, kabe nije māni'',
sahiṣṇutā-guṇa hṛdoyete āni''
sakale mānada, āpani amānī,
ho''ye āswādibo nāma-rasa-sār', E'When will I taste the essence of the Holy Name, feeling myself to be lower than
the grass, my heart filled with tolerance? When will I give respect to all
others and be free from desire for respect from them?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'ধন জন আর, কবিতা-সুন্দরী,
বলিব না চাহি দেহ-সুখ-করী
জন্মে-জন্মে দাও, ওহে গৌরহরি!
অহৈতুকী ভক্তি চরণে তোমার', E'dhana
jana āra, kobitā-sundarī,
bolibo nā cāhi deho-sukha-karī
janme-janme dāo, ohe gaurahari!
ahaitukī bhakti caraṇe tomār', E'When will I cry out that I have no longer any desire for wealth and followers,
poetry and beautiful women, all of which are meant just for bodily pleasure? O
Gaura Hari! Give me causeless devotional service [bhakti] to your lotus feet,
birth after birth.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'(কবে) করিতে শ্রী-কৃষ্ণ-নাম উচ্চারণ,
পুলকিত দেহ গদ্গদ বচন
বৈবর্ণ্য-বেপথু হবে সঙ্ঘটন,
নিরন্তর নেত্রে ববে অশ্রু-ধার', E'(kabe)
korite śrī-kṛṣṇa-nāma uccāraṇa,
pulakita deho gadgada bacana
baibarṇya-bepathu ha''be sańghaṭana,
nirantara netre ba''be aśru-dhār', E'When will my body be covered with goose bumps and my voice broken with emotion
as I pronounce Krishna''s name? When will my body change color and my eyes flow
with endless tears as I chant?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'কবে নবদ্বীপে, সুরধুনী-তটে,
গৌর-নিত্যানন্দ বলি নিষ্কপটে
নাচিয়া গাইয়া, বেরাইব ছুটে,
বাতুলের প্রায় ছারিয়া বিচার', E'kabe
navadwīpe, suradhunī-taṭe,
gaura-nityānanda boli'' niṣkapaṭe
nāciyā gāiyā, berāibo chuṭe,
bātulera prāya chāriyā bicār', E'When will I give up all thought of the world and society to run like a madman
along the banks of the Ganges in Navadvipa, singing and dancing and sincerely
calling out the names of Gaura and Nityananda?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'কবে নিত্যানন্দ, মোরে করি দয়া,
ছারাইবে মোর বিষয়ের মায়া
দিয়া মোরে নিজ-চরণের ছায়া,
নামের হাটেতে দিবে অধিকার', E'kabe
nityānanda, more kori ''doyā,
chārāibe mora viṣayera māyā
diyā more nija-caraṇera chāyā,
nāmera hāṭete dibe adhikār', E'When will Nityananda Prabhu be merciful to me and deliver me from the
enchantment [maya] of the sense objects? When will he give me the shade of his
lotus feet and the right to enter the market place [nama-hatta] of the Holy
Name?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'কিনিব, লুটিব, হরি-নাম-রস,
নাম-রসে মাতি হৈব বিবশ
রসের রসিক-চরণ পরশ,
করিয়া মোজিব রসে অনিবার', E'kinibo,
luṭibo, hari-nāma-rasa,
nāma-rase māti'' hoibo bibaśa
rasera rasika-caraṇa paraśa,
koriyā mojibo rase anibār', E'When will I buy, borrow or steal the ecstasies of the Holy Name? When will I
lose myself in the intoxication of the Holy Name? When will I immerse myself in
the nectar of the Holy Name after grasping the feet of a saint who constantly
relishes the flavors [rasa] of devotion?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'কবে জীবে দয়া, হৈবে উদয়,
নিজ-সুখ ভুলি সুদীন-হৃদয়
ভকতিবিনোদ, করিয়া বিনয়,
শ্রী-আজ্ঞা-টহল করিবে প্রচার', E'kabe
jībe doyā, hoibe udoya,
nija-sukha bhuli'' sudīna-hṛdoya
bhakativinoda, koriyā binoya,
śrī-ājñā-ṭahala koribe pracār
WORD
FOR WORD', E'When will I feel compassion for all living beings [jivas]? When will I forget
my own pleasure in genuine humility? And when will I, Bhaktivinoda, meekly go
from door to door, preaching your message of love?', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 11, Song 1: Krsna Nama Dhare Kato Bal
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 11;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Krsna Nama Dhare Kato Bal', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '1', 1, E'কৃষ্ণ-নাম ধরে কত বল
বিষয়-বাসনানলে, মোর চিত্ত সদা জ্বলে,
রবি-তপ্ত মরু-ভূমি-সম
কর্ন-রন্ধ্র-পথ দিয়া, হৃদি মাঝে প্রবেশিয়া,
বরিষয় সুধা অনুপম', E'kṛṣṇa-nāma
dhare koto bal
viṣaya-vāsanānale,
mora citta sadā jwale,
ravi-tapta
maru-bhūmi-sam
karna-randhra-patha
diyā, hṛdi mājhe praveśiyā,
variṣoya
sudhā anupam', E'How much power does the name of Krsna possess? My heart constantly burns in the
fire of worldly desires, like a desert scorched by the sun. The holy name,
entering within my heart through the holes of my ears, showers unparalleled
nectar upon my soul.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 2
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '2', 2, E'হৃদয় হৈতে বলে, জিহ্বার অগ্রেতে চলে,
শব্দ-রূপে নাচে অনুক্ষন
কন্ঠে মোর ভঙ্গে স্বর, অঙ্গ কাঁপে থর থর,
স্থির হৈতে না পারে চরণ', E'hṛdoya
hoite bole, jihvāra agrete cale,
śabda-rūpe
nāce anukṣan
kanṭhe
mora bhańge swara, ańga kāńpe thara thara,
sthira
hoite nā pāre caraṇ', E'The holy name speaks from within my heart, moves on the tip of my tongue, and
constantly dances on it in the form of transcendental sound.
My
throat becomes choked up, my body violently trembles, and my feet move
uncontrollably.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 3
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '3', 3, E'চক্ষে ধারা, দেহে ঘর্ম, পুলকিত সব চর্ম,
বিবর্ন হৈল কলেবর
মূর্ছিত হৈল মন, প্রলয়ের আগমন,
ভাবে সর্ব-দেহ জর জর', E'cakṣe
dhārā, dehe gharma, pulakita saba carma,
vivarna
hoilo kalevara
mūrchita
hoilo man, pralayera āgaman,
bhāve
sarva-deha jara jara', E'Rivers of tears flow from my eyes. Perspiration pours from my
body. My body thrills with rapture, causing my hair to stand on end and my skin
to turn pale and discolored. My mind grows faint, and I begin to experience
devastation. My entire body is shattered in a flood of ecstasies.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 4
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '4', 4, E'করি এত উপদ্রব, চিত্তে বর্ষে সুধা-দ্রব,
মোরে ডারে প্রেমের সাগরে
কিছু না বুঝিতে দিল, মোরে তো বাতুল কৈল,
মোর চিত্ত-বিত্ত সব হরে', E'kori
eto upadrava, citte varṣe sudhā-drava,
more
ḍāre premera sāgare
kichu
nā bujhite dilo, more to bātula koilo,
mora
citta-vitta saba hare', E'While causing such an ecstatic disturbance, the holy name showers liquid nectar
on my heart and drowns me in the ocean of divine love of Godhead. He does not
allow me to understand anything; For He has made me truly mad and has stolen
away my heart and all my wealth.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 5
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '5', 5, E'লৈনু আশ্রয় যার, হেন ব্যবহার তার,
বর্নিতে না পারি এ সকল
কৃষ্ণ-নাম ইচ্ছা-ময়, যাহে যাহে সুখী হয়,
সেই মোর সুখের সম্বল', E'loinu
āśroya jār, heno vyavahāra tār,
varnite
nā pāri e sakal
kṛṣṇa-nāma
icchā-moy, jāhe jāhe sukhī hoy,
sei
mora sukhera sambal', E'Such is the behavior of Him who is now my only shelter. I am not capable of
describing all this. The holy name of Krsna is independent and thus acts at His
own sweet will. In whatever way He becomes happy, that is also my way of
happiness.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 6
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '6', 6, E'প্রেমের কলিকা নাম, অদ্ভুত রসের ধাম,
হেন বল করয়ে প্রকাশ
ঈষত বিকশি পুনঃ, দেখায় নিজ-রূপ-গুন,
চিত্ত হরি লয় কৃষ্ণ-পাশ', E'premera
kalikā nām, adbhuta rasera dhām,
heno
bala karaye prakāś
īṣat
vikaśi punaḥ, dekhāy nija-rūpa-guna,
citta
hari loya kṛṣṇa-pāś', E'The holy name is the bud of the flower of divine love, the abode of devotions
wonderful mellows. Such is the power that He manifests, that although He
displays His power only slightly, He reveals His own divine form and qualities,
steals my heart and takes it to Krsna.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 7
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '7', 7, E'পূর্ন বিকশিত হৈয়া, ব্রজে মোরে যায় লৈয়া,
দেখায় মোরে স্বরূপ-বিলাস
মোরে সিদ্ধ-দেহ দিয়া, কৃষ্ণ-পাশে রাখে গিয়া,
এ দেহের করে সর্ব-নাশ', E'pūrna
vikaśita hoiyā, braje more jāya loiyā,
dekhāy
more swarūpa-vilās
more
siddha-deha diyā, kṛṣṇa-pāśe rākhe
giyā,
e
dehera kore sarva-nāś', E'Being fully manifest, the holy name of takes me to Vraja and reveals to me His
own love dalliance. He gives to me my own divine, eternal body, keeps me near
Krsna and completely destroys this mortal frame of mine.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 8
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '8', 8, E'কৃষ্ণ-নাম-চিন্তামণি, অখিল রসের খনি,
নিত্য-মুক্ত শুদ্ধ-রস-ময়
নামের বালাই যত, সব লয়ে হয় হত,
তবে মোর সুখের উদয়', E'kṛṣṇa-nāma-cintāmaṇi,
akhila rasera khani,
nitya-mukta
śuddha-rasa-moy
nāmera
bālāi jata, saba loye hoi hata,
tabe
mora sukhera udoy', E'The name of Krsna is touchstone, a mine of all devotional mellows, eternally
liberated, and the embodiment of pure rasa. When all impediments to the pure
chanting of the holy name are taken away and destroyed, then my happiness will
know its true awakening.', E'', E'', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


END $$;

COMMIT;
