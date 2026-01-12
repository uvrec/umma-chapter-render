-- Import Krsna Samhita by Bhaktivinoda Thakura (1879)
-- Proper structure: books -> cantos -> chapters -> verses
-- Fields: sanskrit_en/ua, transliteration_en/ua, synonyms_en/ua, translation_en/ua, commentary_en/ua
-- Note: This book has chapters directly, no sections. Using single canto for DB structure.

BEGIN;

-- 1. Create/update the book
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos)
VALUES ('krsna-samhita', 'Krsna Samhita', 'Крішна-самхіта', true, false)
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
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'krsna-samhita';

  -- Create single canto for chapters (required by schema)
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 1, 'Main Text', 'Основний текст', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;


  -- Chapter 1: Vaikuntha Varnanam
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Vaikuntha Varnanam', E'Вайкунтга-варнанам', 'verses', true)
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
    E'śrī-kṛṣṇa-tattva-nirdeśe
kṛpā yasya prayojanam
vande
taḿ jñānadaḿ kṛṣṇa-caitanyaḿ
rasa-vigraham', E'śrī-kṛṣṇa-tattva-nirdeśe
kṛpā yasya prayojanam
vande
taḿ jñānadaḿ kṛṣṇa-caitanyaḿ
rasa-vigraham',
    E'śrī-kṛṣṇa-tattva-nirdeśe
kṛpā yasya prayojanam
vande
taḿ jñānadaḿ kṛṣṇa-caitanyaḿ
rasa-vigraham', E'ш́рı̄-кр̣шн̣а-таттва-нірдеш́е
кр̣па̄ йасйа прайоджанам
ванде
таḿ джн̃а̄надаḿ кр̣шн̣а-чаітанйаḿ
раса-віґрахам',
    E'', E'',
    E'I offer my respectful obeisances unto Sri Krsna Caitanya, who is full of
transcendental mellows and the giver of spiritual knowledge. Without His mercy,
no one can ascertain the truth about Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'samudra-śoṣaṇaḿ
reṇor yathā na ghaṭate kvacit
tathā
me tattva-nirdeśo mūḍhasya kṣudra-cetasaḥ', E'samudra-śoṣaṇaḿ
reṇor yathā na ghaṭate kvacit
tathā
me tattva-nirdeśo mūḍhasya kṣudra-cetasaḥ',
    E'samudra-śoṣaṇaḿ
reṇor yathā na ghaṭate kvacit
tathā
me tattva-nirdeśo mūḍhasya kṣudra-cetasaḥ', E'самудра-ш́ошан̣аḿ
рен̣ор йатха̄ на ґгат̣ате квачіт
татха̄
ме таттва-нірдеш́о мӯд̣хасйа кшудра-четасах̣',
    E'', E'',
    E'Just as it is not possible for a particle of dust to absorb the ocean, it is
extremely difficult for a foolish, less-intelligent person like me to ascertain
the truth.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'kintu
me hṛdaye ko''pi puruṣaḥ śyāmasundaraḥ
sphuran
samādiśat kāryam etat-tattva-ni-rūpaṇam', E'kintu
me hṛdaye ko''pi puruṣaḥ śyāmasundaraḥ
sphuran
samādiśat kāryam etat-tattva-ni-rūpaṇam',
    E'kintu
me hṛdaye ko''pi puruṣaḥ śyāmasundaraḥ
sphuran
samādiśat kāryam etat-tattva-ni-rūpaṇam', E'кінту
ме хр̣дайе ко''пі пурушах̣ ш́йа̄масундарах̣
спхуран
сама̄діш́ат ка̄рйам етат-таттва-ні-рӯпан̣ам',
    E'', E'',
    E'Although a living entity is never able to ascertain the truth with his small
intelligence, a blackish personality with a form of pure consciousness has
appeared in my heart and engaged me in the work of ascertaining the truth. For
this reason I have boldly taken up this work.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'āsīd
ekaḥ paraḥ kṛṣṇo
nitya-līlā-parāyaṇaḥ
cic-chaktyāviṣkṛte
dhāmni nitya-siddha-gaṇāśrite', E'āsīd
ekaḥ paraḥ kṛṣṇo
nitya-līlā-parāyaṇaḥ
cic-chaktyāviṣkṛte
dhāmni nitya-siddha-gaṇāśrite',
    E'āsīd
ekaḥ paraḥ kṛṣṇo
nitya-līlā-parāyaṇaḥ
cic-chaktyāviṣkṛte
dhāmni nitya-siddha-gaṇāśrite', E'а̄сı̄д
еках̣ парах̣ кр̣шн̣о
нітйа-лı̄ла̄-пара̄йан̣ах̣
чіч-чхактйа̄вішкр̣те
дга̄мні нітйа-сіддга-ґан̣а̄ш́ріте',
    E'', E'',
    E'Lord Sri Krsna is beyond spirit and matter and has no origin. The name of His
abode is Vaikuntha, and it was created by His cit-shakti, or internal potency.
Vaikuntha is beyond material time and space, and it is the residence of the
eternally liberated souls. All the eternally liberated living entities, who are
fragmental parts of the Supreme Lord, emanate from the Lord''s jiva-shakti, or
marginal potency, to assist the Lord in His pastimes. Vaikuntha is the abode of
realm is beyond material time, and therefore past, present, and future do not
exist there. In this material creation, however, we must consider past,
present, and future, for the living entities here are conditioned by time and
space.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'cid-vilāsa-rase
mattaś cid-gaṇair anvitaḥ sadā
cid-viśeṣānvite
bhāve prasaktaḥ priya-darśanaḥ', E'cid-vilāsa-rase
mattaś cid-gaṇair anvitaḥ sadā
cid-viśeṣānvite
bhāve prasaktaḥ priya-darśanaḥ',
    E'cid-vilāsa-rase
mattaś cid-gaṇair anvitaḥ sadā
cid-viśeṣānvite
bhāve prasaktaḥ priya-darśanaḥ', E'чід-віла̄са-расе
матташ́ чід-ґан̣аір анвітах̣ сада̄
чід-віш́еша̄нвіте
бга̄ве прасактах̣ прійа-дарш́анах̣',
    E'', E'',
    E'Lord Sri Krsna is always absorbed in transcendental rasas and surrounded by
liberated souls. He is always addicted to the emotions arising from varieties
of spiritual activities. He is the cynosure of all eyes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jīvānāḿ
nitya-siddhānāḿ svādhīna-prema-lālasaḥ
prādāttebhyaḥ
svatantratvaḿ kāryākārya-vicāraṇe', E'jīvānāḿ
nitya-siddhānāḿ svādhīna-prema-lālasaḥ
prādāttebhyaḥ
svatantratvaḿ kāryākārya-vicāraṇe',
    E'jīvānāḿ
nitya-siddhānāḿ svādhīna-prema-lālasaḥ
prādāttebhyaḥ
svatantratvaḿ kāryākārya-vicāraṇe', E'джı̄ва̄на̄ḿ
нітйа-сіддга̄на̄ḿ сва̄дгı̄на-према-ла̄ласах̣
пра̄да̄ттебгйах̣
сватантратваḿ ка̄рйа̄ка̄рйа-віча̄ран̣е',
    E'', E'',
    E'A great, wonderful spiritual relationship is found between the spiritually
perfect living entities and Krsnacandra, who is the source of spiritual
knowledge. This relationship is called priti, or love. This love is concomitant
with the creation of the living entities, so it is the living entities''
inherent nature. If there is no independence in this relationship, however,
there is no possibility of the living entities attaining higher rasas. Therefore
Sri Krsna gives the living entities the power to independently discriminate
between proper and improper action, and He awards them the fruits of their
independent activities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'yeṣāḿ
tu bhagavad-dāsye rucir āsīd balīyasī
svādhīna-bhāva-sampannās
te dāsā nitya-dhāmani', E'yeṣāḿ
tu bhagavad-dāsye rucir āsīd balīyasī
svādhīna-bhāva-sampannās
te dāsā nitya-dhāmani',
    E'yeṣāḿ
tu bhagavad-dāsye rucir āsīd balīyasī
svādhīna-bhāva-sampannās
te dāsā nitya-dhāmani', E'йеша̄ḿ
ту бгаґавад-да̄сйе ручір а̄сı̄д балı̄йасı̄
сва̄дгı̄на-бга̄ва-сампанна̄с
те да̄са̄ нітйа-дга̄мані',
    E'', E'',
    E'Among the minutely independent living entities, those who have a strong taste
for serving the Lord shall be in servitude to the Lord in the eternal abode.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'aiśvarya-karṣitā
eke nārāyaṇa-parāyaṇāḥ
mādhurya-mohitāś
cānye kṛṣṇa-dāsāḥ sunirmalāḥ', E'aiśvarya-karṣitā
eke nārāyaṇa-parāyaṇāḥ
mādhurya-mohitāś
cānye kṛṣṇa-dāsāḥ sunirmalāḥ',
    E'aiśvarya-karṣitā
eke nārāyaṇa-parāyaṇāḥ
mādhurya-mohitāś
cānye kṛṣṇa-dāsāḥ sunirmalāḥ', E'аіш́варйа-каршіта̄
еке на̄ра̄йан̣а-пара̄йан̣а̄х̣
ма̄дгурйа-мохіта̄ш́
ча̄нйе кр̣шн̣а-да̄са̄х̣ сунірмала̄х̣',
    E'', E'',
    E'Among them, those who desire to serve the Lord with opulence see their
worshipable Lord as Narayana and those who desire to serve the Lord with
sweetness see their worshipable Lord as Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sambhramād
dāsya-bodhe hi prītis tu prema-rūpiṇī
na
tatra praṇayaḥ kaścit viśrambhe rahite sati', E'sambhramād
dāsya-bodhe hi prītis tu prema-rūpiṇī
na
tatra praṇayaḥ kaścit viśrambhe rahite sati',
    E'sambhramād
dāsya-bodhe hi prītis tu prema-rūpiṇī
na
tatra praṇayaḥ kaścit viśrambhe rahite sati', E'самбграма̄д
да̄сйа-бодге хі прı̄тіс ту према-рӯпін̣ı̄
на
татра пран̣айах̣ каш́чіт віш́рамбге рахіте саті',
    E'', E'',
    E'Those who serve the Lord with opulence have a natural mood of awe and
reverence. Therefore their affection ends with prema, or love, for due to
insufficient faith there is no pranaya, or intimacy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'mādhurya-bhāva-sampattau
viśrambho balavān sadā
mahā-bhāvāvadhiḥ
prīter bhaktānāḿ hṛdaye dhruvam', E'mādhurya-bhāva-sampattau
viśrambho balavān sadā
mahā-bhāvāvadhiḥ
prīter bhaktānāḿ hṛdaye dhruvam',
    E'mādhurya-bhāva-sampattau
viśrambho balavān sadā
mahā-bhāvāvadhiḥ
prīter bhaktānāḿ hṛdaye dhruvam', E'ма̄дгурйа-бга̄ва-сампаттау
віш́рамбго балава̄н сада̄
маха̄-бга̄ва̄вадгіх̣
прı̄тер бгакта̄на̄ḿ хр̣дайе дгрувам',
    E'', E'',
    E'The faith of those who serve the Lord in the conjugal rasa is extremely strong.
Therefore their affection advances up to maha-bhava.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jīvasya
nitya-siddhasya sarvam etad anāmayam
vikārāś
cid-gatāḥ śaśvat kadāpi no
jaḍānvitaḥ', E'jīvasya
nitya-siddhasya sarvam etad anāmayam
vikārāś
cid-gatāḥ śaśvat kadāpi no
jaḍānvitaḥ',
    E'jīvasya
nitya-siddhasya sarvam etad anāmayam
vikārāś
cid-gatāḥ śaśvat kadāpi no
jaḍānvitaḥ', E'джı̄васйа
нітйа-сіддгасйа сарвам етад ана̄майам
віка̄ра̄ш́
чід-ґата̄х̣ ш́аш́ват када̄пі но
джад̣а̄нвітах̣',
    E'', E'',
    E'Some people say that unless there is oneness between the atma and the
Paramatma, there will be a lack of pranaya in spiritual affairs. They further
say the concept of mahabhava is the false acceptance of material thoughts as
spiritual. Regarding these impure opinions, we say that the living entities''
different emotions arising from pranaya are not transformations of material
nescience, they are spiritual emotions.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'vaikuṇṭhe
śuddha-cid-dhāmni vilāsā nirvikārakāḥ
ānandābdhi-tarańgās
te sadā doṣa-vivarjitāḥ', E'vaikuṇṭhe
śuddha-cid-dhāmni vilāsā nirvikārakāḥ
ānandābdhi-tarańgās
te sadā doṣa-vivarjitāḥ',
    E'vaikuṇṭhe
śuddha-cid-dhāmni vilāsā nirvikārakāḥ
ānandābdhi-tarańgās
te sadā doṣa-vivarjitāḥ', E'ваікун̣т̣хе
ш́уддга-чід-дга̄мні віла̄са̄ нірвіка̄рака̄х̣
а̄нанда̄бдгі-тараńґа̄с
те сада̄ доша-віварджіта̄х̣',
    E'', E'',
    E'The pastimes in the pure spiritual abode of Vaikuntha are all faultless and
like waves in the ocean of bliss. The word vikara, or transformation, cannot be
applied in those pastimes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'yam
aiśvarya-parā jīvā nārāyaṇaḿ vadanti
hi
mādhurya-rasa-sampannāḥ
kṛṣṇam eva bhajanti tam', E'yam
aiśvarya-parā jīvā nārāyaṇaḿ vadanti
hi
mādhurya-rasa-sampannāḥ
kṛṣṇam eva bhajanti tam',
    E'yam
aiśvarya-parā jīvā nārāyaṇaḿ vadanti
hi
mādhurya-rasa-sampannāḥ
kṛṣṇam eva bhajanti tam', E'йам
аіш́варйа-пара̄ джı̄ва̄ на̄ра̄йан̣аḿ ваданті
хі
ма̄дгурйа-раса-сампанна̄х̣
кр̣шн̣ам ева бгаджанті там',
    E'', E'',
    E'There is no difference between Krsna and Narayana. He appears as Narayana to
eyes absorbed in opulence, and He appears as Krsna to eyes absorbed in
sweetness. Actually there is no difference in the Absolute Truth. A difference
is considered only among people who discuss the Absolute Truth and in the
discussions of the Absolute Truth.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'rasa-bheda-vaśād
eko dvidhā bhāti svarūpataḥ
advayaḥ
sa paraḥ kṛṣṇo
vilāsānanda-candramāḥ', E'rasa-bheda-vaśād
eko dvidhā bhāti svarūpataḥ
advayaḥ
sa paraḥ kṛṣṇo
vilāsānanda-candramāḥ',
    E'rasa-bheda-vaśād
eko dvidhā bhāti svarūpataḥ
advayaḥ
sa paraḥ kṛṣṇo
vilāsānanda-candramāḥ', E'раса-бгеда-ваш́а̄д
еко двідга̄ бга̄ті сварӯпатах̣
адвайах̣
са парах̣ кр̣шн̣о
віла̄са̄нанда-чандрама̄х̣',
    E'', E'',
    E'Sri Krsna is the Supreme Absolute Truth without a second. He is the moonlike
Lord who is always absorbed in the ecstasy of His pastimes, and He manifests
different forms due to the variety of rasas.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'ādheyādhāra-bhedaś
ca deha-dehi-vibhinnatā
dharma-dharmi-pṛthag-bhāvā
na santi nitya-vastuni', E'ādheyādhāra-bhedaś
ca deha-dehi-vibhinnatā
dharma-dharmi-pṛthag-bhāvā
na santi nitya-vastuni',
    E'ādheyādhāra-bhedaś
ca deha-dehi-vibhinnatā
dharma-dharmi-pṛthag-bhāvā
na santi nitya-vastuni', E'а̄дгейа̄дга̄ра-бгедаш́
ча деха-дехі-вібгінната̄
дгарма-дгармі-пр̣тхаґ-бга̄ва̄
на санті нітйа-вастуні',
    E'', E'',
    E'Actually there is no difference between His various forms, because in the
Absolute Truth there is no difference between the container and its contents,
the body and its owner, or the occupation and its performer. In the conditioned
state, these differences are found in the human body due to the misconception
of identifying the body as the self. These differences are natural for material
objects.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'viśeṣa
eva dharmo''sau yato bhedaḥ pravartate
tad-bheda-vaśataḥ
prītis tarańga-rūpiṇī sadā', E'viśeṣa
eva dharmo''sau yato bhedaḥ pravartate
tad-bheda-vaśataḥ
prītis tarańga-rūpiṇī sadā',
    E'viśeṣa
eva dharmo''sau yato bhedaḥ pravartate
tad-bheda-vaśataḥ
prītis tarańga-rūpiṇī sadā', E'віш́еша
ева дгармо''сау йато бгедах̣ правартате
тад-бгеда-ваш́атах̣
прı̄тіс тараńґа-рӯпін̣ı̄ сада̄',
    E'', E'',
    E'The Vaisesikas say that the quality by which one object is differentiated from
another is called variety. Due to variety we find a difference between atoms of
water and atoms of air and between atoms of air and atoms of fire. But the
Vaisesikas have detected the variegated nature of only the material world; they
have no information of the variegated nature of the spiritual world. Nor is
there information about this in the scriptures of the jnanis. That is why most
jnanis consider liberation to be brahma-nirvana, absorption or merging in the
Supreme. According to the Vaisnavas the quality of variegated nature not only exists
in the material world, but it eternally exists in the spiritual world. That is
why the Supersoul is different from the soul, the soul is different from the
material world, and all souls are different from one another. From the quality
of variegated nature, love of God takes the form of waves and appears with
various emotions.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'prapañca-malato''smākaḿ
buddhir duṣṭāsti kevalam
viśeṣo
nirmalas tasmān na ceha bhāsate''dhunā', E'prapañca-malato''smākaḿ
buddhir duṣṭāsti kevalam
viśeṣo
nirmalas tasmān na ceha bhāsate''dhunā',
    E'prapañca-malato''smākaḿ
buddhir duṣṭāsti kevalam
viśeṣo
nirmalas tasmān na ceha bhāsate''dhunā', E'прапан̃ча-малато''сма̄каḿ
буддгір душт̣а̄сті кевалам
віш́ешо
нірмалас тасма̄н на чеха бга̄сате''дгуна̄',
    E'', E'',
    E'Due to material conditioning our intelligence has become polluted by the dirt
of this world. Therefore realizing spiritual variegated nature is extremely
difficult.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'bhagavaj-jīvayos
tatra sambandho vidyate''malaḥ
sa
tu pañca-vidhaḥ prokto yathātra saḿsṛtau svataḥ', E'bhagavaj-jīvayos
tatra sambandho vidyate''malaḥ
sa
tu pañca-vidhaḥ prokto yathātra saḿsṛtau svataḥ',
    E'bhagavaj-jīvayos
tatra sambandho vidyate''malaḥ
sa
tu pañca-vidhaḥ prokto yathātra saḿsṛtau svataḥ', E'бгаґавадж-джı̄вайос
татра самбандго відйате''малах̣
са
ту пан̃ча-відгах̣ прокто йатха̄тра саḿср̣тау сватах̣',
    E'', E'',
    E'Due to the quality of variegated nature there is not only an eternal difference
between the Lord and the pure living entities, there is also an eternal pure
relationship between them. Just as conditioned living entities have five types
of relationships in the material world, there are also five types of
relationships between Krsna and the living entities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'śānta-bhāvas
tathā dāsyaḿ sakhyaḿ vātsalyam eva ca
kānta-bhāva
iti jñeyāḥ sambandhāḥ
kṛṣṇa-jīvayoḥ', E'śānta-bhāvas
tathā dāsyaḿ sakhyaḿ vātsalyam eva ca
kānta-bhāva
iti jñeyāḥ sambandhāḥ
kṛṣṇa-jīvayoḥ',
    E'śānta-bhāvas
tathā dāsyaḿ sakhyaḿ vātsalyam eva ca
kānta-bhāva
iti jñeyāḥ sambandhāḥ
kṛṣṇa-jīvayoḥ', E'ш́а̄нта-бга̄вас
татха̄ да̄сйаḿ сакхйаḿ ва̄тсалйам ева ча
ка̄нта-бга̄ва
іті джн̃ейа̄х̣ самбандга̄х̣
кр̣шн̣а-джı̄вайох̣',
    E'', E'',
    E'The names of these five types of relationships are shanta (neutrality), dasya
(servitude), sakhya (friendship), vatsalya (paternal affection), and madhurya
(conjugal love).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'bhāvākāra-gatā
prītiḥ sambandhe vartate''malā
aṣṭa-rūpā
kriyā-sārā jīvānām adhikārataḥ', E'bhāvākāra-gatā
prītiḥ sambandhe vartate''malā
aṣṭa-rūpā
kriyā-sārā jīvānām adhikārataḥ',
    E'bhāvākāra-gatā
prītiḥ sambandhe vartate''malā
aṣṭa-rūpā
kriyā-sārā jīvānām adhikārataḥ', E'бга̄ва̄ка̄ра-ґата̄
прı̄тіх̣ самбандге вартате''мала̄
ашт̣а-рӯпа̄
крійа̄-са̄ра̄ джı̄ва̄на̄м адгіка̄ратах̣',
    E'', E'',
    E'In the Lord''s association, the ecstatic love of the pure living entities
manifests according to their qualification and relationship in eight different
emotions. All those emotions are symptoms of love. They are known as pulaka
(standing of hairs on end), ashru (weeping), kampa (trembling), sveda
(perspiring), vaivarnya (fading away of color), stambha (being stunned),
svara-bheda (choking), and pralaya (devastation). These symptoms manifest in a
pure form in pure living entities, but they are materially contaminated in
conditioned living entities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'śānte
tu rati-rūpā sā cittollāsa-vidhāyinī
ratiḥ
premā dvidhā dāsye mamatā-bhāva-sańgatā', E'śānte
tu rati-rūpā sā cittollāsa-vidhāyinī
ratiḥ
premā dvidhā dāsye mamatā-bhāva-sańgatā',
    E'śānte
tu rati-rūpā sā cittollāsa-vidhāyinī
ratiḥ
premā dvidhā dāsye mamatā-bhāva-sańgatā', E'ш́а̄нте
ту раті-рӯпа̄ са̄ чіттолла̄са-відга̄йінı̄
ратіх̣
према̄ двідга̄ да̄сйе мамата̄-бга̄ва-саńґата̄',
    E'', E'',
    E'The affection of those devotees who are situated in shanta-rasa remains in the
form of rati, or attraction, which gives mental happiness. When affection is
mixed with attachment in dasya-rasa, then it is called attraction in pure love.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sakhye
ratis tathā premā praṇayo''pi vicāryate
viśvāso
balavān tatra na bhayaḿ vartate kvacit', E'sakhye
ratis tathā premā praṇayo''pi vicāryate
viśvāso
balavān tatra na bhayaḿ vartate kvacit',
    E'sakhye
ratis tathā premā praṇayo''pi vicāryate
viśvāso
balavān tatra na bhayaḿ vartate kvacit', E'сакхйе
ратіс татха̄ према̄ пран̣айо''пі віча̄рйате
віш́ва̄со
балава̄н татра на бгайаḿ вартате квачіт',
    E'', E'',
    E'In sakhya-rasa, this attraction in pure love turns into pranaya, intimacy,
which is strengthened by faith and attachment and which destroys fear.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'vātsalye
sneha-paryantā prītir drava-mayī satī
kānta-bhāve
ca tat sarvaḿ militaḿ vartate kila
māna-rāgānurāgaiś
ca mahā-bhāvair viśeṣataḥ', E'vātsalye
sneha-paryantā prītir drava-mayī satī
kānta-bhāve
ca tat sarvaḿ militaḿ vartate kila
māna-rāgānurāgaiś
ca mahā-bhāvair viśeṣataḥ',
    E'vātsalye
sneha-paryantā prītir drava-mayī satī
kānta-bhāve
ca tat sarvaḿ militaḿ vartate kila
māna-rāgānurāgaiś
ca mahā-bhāvair viśeṣataḥ', E'ва̄тсалйе
снеха-парйанта̄ прı̄тір драва-майı̄ сатı̄
ка̄нта-бга̄ве
ча тат сарваḿ мілітаḿ вартате кіла
ма̄на-ра̄ґа̄нура̄ґаіш́
ча маха̄-бга̄ваір віш́ешатах̣',
    E'', E'',
    E'In vatsalya-rasa, this affection flows up to sneha-bhava, affection with
ecstatic sentiments. But when kanta-bhava, or conjugal rasa, appears, then all
the above-mentioned emotions mix with mana (jealous anger), raga (attachment),
anuraga (further attachment), and maha-bhava (great ecstasy).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'vaikuṇṭhe
bhagavān śyāmaḥ gṛhasthaḥ
kula-pālakaḥ
yathātra
lakṣyate jīvaḥ sva-gaṇaiḥ
pariveṣṭitaḥ', E'vaikuṇṭhe
bhagavān śyāmaḥ gṛhasthaḥ
kula-pālakaḥ
yathātra
lakṣyate jīvaḥ sva-gaṇaiḥ
pariveṣṭitaḥ',
    E'vaikuṇṭhe
bhagavān śyāmaḥ gṛhasthaḥ
kula-pālakaḥ
yathātra
lakṣyate jīvaḥ sva-gaṇaiḥ
pariveṣṭitaḥ', E'ваікун̣т̣хе
бгаґава̄н ш́йа̄мах̣ ґр̣хастхах̣
кула-па̄лаках̣
йатха̄тра
лакшйате джı̄вах̣ сва-ґан̣аіх̣
парівешт̣ітах̣',
    E'', E'',
    E'Just as the living entities are surrounded by relatives and engaged in
household activities in the material world, Lord Krsna is engaged in the same
way in Vaikuntha.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'śāntā
dāsāḥ sakhāś caiva pitaro yoṣitas tathā
sarve
te sevakā jñeyāḥ sevyaḥ kṛṣṇaḥ
priyaḥ satām', E'śāntā
dāsāḥ sakhāś caiva pitaro yoṣitas tathā
sarve
te sevakā jñeyāḥ sevyaḥ kṛṣṇaḥ
priyaḥ satām',
    E'śāntā
dāsāḥ sakhāś caiva pitaro yoṣitas tathā
sarve
te sevakā jñeyāḥ sevyaḥ kṛṣṇaḥ
priyaḥ satām', E'ш́а̄нта̄
да̄са̄х̣ сакха̄ш́ чаіва пітаро йошітас татха̄
сарве
те севака̄ джн̃ейа̄х̣ севйах̣ кр̣шн̣ах̣
прійах̣ сата̄м',
    E'', E'',
    E'All the associates in santa, dasya, sakhya, vatsalya, and madhurya are servants
of the Lord. Sri Krsna is the beloved Lord and object of worship of those
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
    E'sārvajñya-dhṛti-sāmarthya-vicāra-paṭutā-kṣamāḥ
prītāv
ekātmatāḿ prāptā vaikuṇṭhe''dvaya-vastuni', E'sārvajñya-dhṛti-sāmarthya-vicāra-paṭutā-kṣamāḥ
prītāv
ekātmatāḿ prāptā vaikuṇṭhe''dvaya-vastuni',
    E'sārvajñya-dhṛti-sāmarthya-vicāra-paṭutā-kṣamāḥ
prītāv
ekātmatāḿ prāptā vaikuṇṭhe''dvaya-vastuni', E'са̄рваджн̃йа-дгр̣ті-са̄мартхйа-віча̄ра-пат̣ута̄-кшама̄х̣
прı̄та̄в
ека̄тмата̄ḿ пра̄пта̄ ваікун̣т̣хе''двайа-вастуні',
    E'', E'',
    E'In the affection of the absolute realm of Vaikuntha, all qualities like
omniscience, forbearance, ability, consideration, expertness, and forgiveness
are in complete harmony. Due to an absence of affection in the material world,
those qualities appear distinct.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'cid-dravātmā
sadā tatra kālindī virajā nadī
cid-ādhāra-svarūpā
sā bhūmis tatra virājate', E'cid-dravātmā
sadā tatra kālindī virajā nadī
cid-ādhāra-svarūpā
sā bhūmis tatra virājate',
    E'cid-dravātmā
sadā tatra kālindī virajā nadī
cid-ādhāra-svarūpā
sā bhūmis tatra virājate', E'чід-драва̄тма̄
сада̄ татра ка̄ліндı̄ віраджа̄ надı̄
чід-а̄дга̄ра-сварӯпа̄
са̄ бгӯміс татра віра̄джате',
    E'', E'',
    E'The Viraja River eternally flows through the outer circle of Vaikuntha. The
Kalindi River eternally flows through the inner circle. Both rivers are
transcendental to the mode of passion. The indescribable land there is the
resting place of all pure souls.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'latā-kuñja-gṛha-dvāra-prāsāda-toraṇāni
ca
sarvāṇi
cid-viśiṣṭāni vaikuṇṭhe doṣa-varjite', E'latā-kuñja-gṛha-dvāra-prāsāda-toraṇāni
ca
sarvāṇi
cid-viśiṣṭāni vaikuṇṭhe doṣa-varjite',
    E'latā-kuñja-gṛha-dvāra-prāsāda-toraṇāni
ca
sarvāṇi
cid-viśiṣṭāni vaikuṇṭhe doṣa-varjite', E'лата̄-кун̃джа-ґр̣ха-два̄ра-пра̄са̄да-торан̣а̄ні
ча
сарва̄н̣і
чід-віш́ішт̣а̄ні ваікун̣т̣хе доша-варджіте',
    E'', E'',
    E'All the creepers, palaces, houses, and gateways are fully spiritual and free of
all fault. The influence of time and place cannot pollute those things.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 29
  INSERT INTO public.verses (
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
    E'cic-chakti-nirmitaḿ
sarvaḿ yad vaikuṇṭhe sanātanam
pratibhātaḿ
prapañce''smin jaḍa-rūpa-malānvitam', E'cic-chakti-nirmitaḿ
sarvaḿ yad vaikuṇṭhe sanātanam
pratibhātaḿ
prapañce''smin jaḍa-rūpa-malānvitam',
    E'cic-chakti-nirmitaḿ
sarvaḿ yad vaikuṇṭhe sanātanam
pratibhātaḿ
prapañce''smin jaḍa-rūpa-malānvitam', E'чіч-чхакті-нірмітаḿ
сарваḿ йад ваікун̣т̣хе сана̄танам
пратібга̄таḿ
прапан̃че''смін джад̣а-рӯпа-мала̄нвітам',
    E'', E'',
    E'Some people try to impose their material conceptions on the nature of Vaikuntha
and thus become overwhelmed by prejudices. Later they try to establish these
prejudices by their shrewd arguments. Such descriptions of Vaikuntha and the
pastimes of the Lord, however, are actually all material. These types of
conclusions arise only due to improper knowledge of the Absolute Truth. Only
those who have not deeply discussed spiritual topics will have the propensity
to rationalize in this way. The doubtful hearts of the madhyama-adhikaris are
always swinging between the material and the spiritual due to their being
unable to cross into the realm of the Absolute Truth. Actually the variegated
nature seen in the material world is only a perverted reflection of the spiritual
world. The difference between the material and spiritual worlds is this: In the
spiritual world everything is blissful and faultless, whereas in the material
world everything is a temporary mixture of happiness and distress, full of
impurities arising from time and place. Therefore the descriptions of the
spiritual world are not imitations of those of the material world, rather they
are most coveted ideals.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 30
  INSERT INTO public.verses (
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
    E'sad-bhāve''pi
viśeṣasya sarvaḿ tan nitya-dhāmani
akhaṇḍa-sac-cid-ānanda-svarūpaḿ
prakṛteḥ param', E'sad-bhāve''pi
viśeṣasya sarvaḿ tan nitya-dhāmani
akhaṇḍa-sac-cid-ānanda-svarūpaḿ
prakṛteḥ param',
    E'sad-bhāve''pi
viśeṣasya sarvaḿ tan nitya-dhāmani
akhaṇḍa-sac-cid-ānanda-svarūpaḿ
prakṛteḥ param', E'сад-бга̄ве''пі
віш́ешасйа сарваḿ тан нітйа-дга̄мані
акхан̣д̣а-сач-чід-а̄нанда-сварӯпаḿ
пракр̣тех̣ парам',
    E'', E'',
    E'The splendor of the spiritual abode is established by the quality of variegated
nature. Although that splendor is eternal, Vaikuntha is nevertheless nondual
and constitutionally eternal, full of knowledge, and bliss. The material world
consists of dualities arising from time, place, and circumstances, yet because
Vaikuntha is transcendental to the material creation it is devoid of duality
and fault.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 31
  INSERT INTO public.verses (
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
    E'jīvānāḿ
siddha-sattvānāḿ nitya-siddhimatām api
etan
nitya-sukhaḿ śaśvat kṛṣṇa-dāsye
niyojitam', E'jīvānāḿ
siddha-sattvānāḿ nitya-siddhimatām api
etan
nitya-sukhaḿ śaśvat kṛṣṇa-dāsye
niyojitam',
    E'jīvānāḿ
siddha-sattvānāḿ nitya-siddhimatām api
etan
nitya-sukhaḿ śaśvat kṛṣṇa-dāsye
niyojitam', E'джı̄ва̄на̄ḿ
сіддга-саттва̄на̄ḿ нітйа-сіддгімата̄м апі
етан
нітйа-сукхаḿ ш́аш́ват кр̣шн̣а-да̄сйе
нійоджітам',
    E'', E'',
    E'Eternal servitude of Lord Krsna is the eternal happiness of those who are
eternally perfect and those who have achieved perfection.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 32
  INSERT INTO public.verses (
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
    E'vākyānāḿ
jaḍa-janyatvān na śaktā me sarasvatī
varṇane
vimalānanda-vilāsasya cid-ātmanaḥ', E'vākyānāḿ
jaḍa-janyatvān na śaktā me sarasvatī
varṇane
vimalānanda-vilāsasya cid-ātmanaḥ',
    E'vākyānāḿ
jaḍa-janyatvān na śaktā me sarasvatī
varṇane
vimalānanda-vilāsasya cid-ātmanaḥ', E'ва̄кйа̄на̄ḿ
джад̣а-джанйатва̄н на ш́акта̄ ме сарасватı̄
варн̣ане
вімала̄нанда-віла̄сасйа чід-а̄тманах̣',
    E'', E'',
    E'It is beyond my power of speech to describe the pure ecstatic pastimes of the
living entities, because the words I would use in such descriptions are
products of the material world.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 33
  INSERT INTO public.verses (
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
    E'tathāpi
sārajuṭ vṛttyā samādhim avalambya vai
varṇitā
bhagavad-vārtā mayā bodhyā samādhinā', E'tathāpi
sārajuṭ vṛttyā samādhim avalambya vai
varṇitā
bhagavad-vārtā mayā bodhyā samādhinā',
    E'tathāpi
sārajuṭ vṛttyā samādhim avalambya vai
varṇitā
bhagavad-vārtā mayā bodhyā samādhinā', E'татха̄пі
са̄раджут̣ вр̣ттйа̄ сама̄дгім аваламбйа ваі
варн̣іта̄
бгаґавад-ва̄рта̄ майа̄ бодгйа̄ сама̄дгіна̄',
    E'', E'',
    E'Although I am unable to clearly describe this topic by words, by samadhi and
the process of sarajut I have described the topics of the Lord to the best of
words, then one will not properly realize the described subject. I therefore
request the reader to try and realize these truths through samadhi. One should
try to understand subtle points from gross statements, as in Arundhati-nyaya
[when one points out a faint star with the help of a bright star]. The process
of argument is useless, because it cannot lead one to the Absolute Truth. The
subtle process of directly perceiving the soul is called samadhi. I have given
these descriptions based on this process. The reader should also follow this
process to realize the truth.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 34
  INSERT INTO public.verses (
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
    E'yasyeha
vartate prītiḥ kṛṣṇe vraja-vilāsini
tasyaivātma-samādhau
tu vaikuṇṭho lakṣyate svataḥ', E'yasyeha
vartate prītiḥ kṛṣṇe vraja-vilāsini
tasyaivātma-samādhau
tu vaikuṇṭho lakṣyate svataḥ',
    E'yasyeha
vartate prītiḥ kṛṣṇe vraja-vilāsini
tasyaivātma-samādhau
tu vaikuṇṭho lakṣyate svataḥ', E'йасйеха
вартате прı̄тіх̣ кр̣шн̣е враджа-віла̄сіні
тасйаіва̄тма-сама̄дгау
ту ваікун̣т̣хо лакшйате сватах̣',
    E'', E'',
    E'Vaikuntha can be naturally perceived through the samadhi of those uttama-adhikaris
who have attained love for Krsna, who performs pastimes in Vraja. The
kanistha-adhikaris and the madhyama-adhikaris are not yet qualified in this
regard, because such truths cannot be realized by reading or argument.
Kanistha-adhikaris who consider the scriptures as the only authority and
logicians who consider themselves liberated are both unable to advance.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Chapter 2: Bhagavac-chakti Varnanam
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Bhagavac-chakti Varnanam', E'Бгаґавач-шакті-варнанам', 'verses', true)
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
    E'atraiva
tattva-vijñānaḿ jñātavyaḿ satataḿ budhaiḥ
śakti-śaktimator
bhedo nāsty eva paramātmani', E'atraiva
tattva-vijñānaḿ jñātavyaḿ satataḿ budhaiḥ
śakti-śaktimator
bhedo nāsty eva paramātmani',
    E'atraiva
tattva-vijñānaḿ jñātavyaḿ satataḿ budhaiḥ
śakti-śaktimator
bhedo nāsty eva paramātmani', E'атраіва
таттва-віджн̃а̄наḿ джн̃а̄тавйаḿ сататаḿ будгаіх̣
ш́акті-ш́актіматор
бгедо на̄стй ева парама̄тмані',
    E'', E'',
    E'We will now consider the science of Vaikuntha, which should be known by the
learned. In the beginning it should be understood that there is no difference
between the energy and the energetic. Nothing is gained if we consider the
Absolute Truth as devoid of energy, therefore it is the duty of swanlike
persons to accept the existence of His energies. Energy is never a truth
separate from the energetic Supreme Lord. Although proper examples to illustrate
the Absolute Truth are unavailable in this material world, indirect examples
are sometimes found. Just as fire and heat cannot exist separately, the
Absolute Truth and His energies do not exist separately.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tathāpi
śrūyate''smābhiḥ parā śaktiḥ parātmanaḥ
acintya-bhāva-sampannā
śaktimantaḿ prakāśayet', E'tathāpi
śrūyate''smābhiḥ parā śaktiḥ parātmanaḥ
acintya-bhāva-sampannā
śaktimantaḿ prakāśayet',
    E'tathāpi
śrūyate''smābhiḥ parā śaktiḥ parātmanaḥ
acintya-bhāva-sampannā
śaktimantaḿ prakāśayet', E'татха̄пі
ш́рӯйате''сма̄бгіх̣ пара̄ ш́актіх̣ пара̄тманах̣
ачінтйа-бга̄ва-сампанна̄
ш́актімантаḿ прака̄ш́айет',
    E'', E'',
    E'The Absolute Truth is manifested through the inconceivable superior energy of
the energetic Absolute Truth, who is the source of the purushavataras and is
realized through samadhi. If heat was separated from fire, then due to an
absence of energy, fire would not exist. Similarly, if energy was separated
from the Absolute Truth, then the Absolute Truth would not exist.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sā
śaktiḥ sandhinī bhūtvā sattā-jātaḿ
vitanyate
pīṭha-sattā-svarupā
sā vaikuṇṭha-rūpiṇī satī', E'sā
śaktiḥ sandhinī bhūtvā sattā-jātaḿ
vitanyate
pīṭha-sattā-svarupā
sā vaikuṇṭha-rūpiṇī satī',
    E'sā
śaktiḥ sandhinī bhūtvā sattā-jātaḿ
vitanyate
pīṭha-sattā-svarupā
sā vaikuṇṭha-rūpiṇī satī', E'са̄
ш́актіх̣ сандгінı̄ бгӯтва̄ сатта̄-джа̄таḿ
вітанйате
пı̄т̣ха-сатта̄-сварупа̄
са̄ ваікун̣т̣ха-рӯпін̣ı̄ сатı̄',
    E'', E'',
    E'The superior energy of the Absolute Truth is realized in three different
aspectssandhini, samvit, and hladini. The first manifestation of the Absolute
Truth is sat (sandhini), cit (samvit), and ananda (hladini). In the beginning
there was only the Supreme Brahman, then, after manifesting His energies, He
became known as sat-cid-ananda,this kind of misconception arises due to
consideration of material time and should not applied on the Absolute Truth. It
is understood by swanlike people that the sat-cid-ananda form of the Lord is
beginningless, endless, and eternal. The sandhini energy manifests the
existence of the eternal abode, name, form, associates, relationships, features,
and foundation of the Absolute Truth. The superior energy of the Lord has three
potencies, namely cit, or spiritual, jiva, or marginal, and acit, or material.
The spiritual potency, cit, is His internal potency. The marginal and material
potencies are separated. These potencies are considered according to the
proportion of the energy manifest. Vaikuntha is the abode of the spiritual
potency of the sandhini aspect of the superior energy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'kṛṣṇādy-ākhyābhidhā
sattā rūpa-sattā kalevaram
rādhādyā
sańginī-sattā sarva-sattā tu sandhinī', E'kṛṣṇādy-ākhyābhidhā
sattā rūpa-sattā kalevaram
rādhādyā
sańginī-sattā sarva-sattā tu sandhinī',
    E'kṛṣṇādy-ākhyābhidhā
sattā rūpa-sattā kalevaram
rādhādyā
sańginī-sattā sarva-sattā tu sandhinī', E'кр̣шн̣а̄дй-а̄кхйа̄бгідга̄
сатта̄ рӯпа-сатта̄ калеварам
ра̄дга̄дйа̄
саńґінı̄-сатта̄ сарва-сатта̄ ту сандгінı̄',
    E'', E'',
    E'The names of Krsna manifest from the abhidha-satta, the body of Krsna manifests
from the rupa-satta, and the lovers of Krsna like Radha manifest from a mixture
of the rupa-satta and sangini-satta.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sandhinī-śakti-sambhūtāḥ
sambandhā vividhā matāḥ
sarvādhāra-svarūpeyaḿ
sarvākārā sad-aḿśakā', E'sandhinī-śakti-sambhūtāḥ
sambandhā vividhā matāḥ
sarvādhāra-svarūpeyaḿ
sarvākārā sad-aḿśakā',
    E'sandhinī-śakti-sambhūtāḥ
sambandhā vividhā matāḥ
sarvādhāra-svarūpeyaḿ
sarvākārā sad-aḿśakā', E'сандгінı̄-ш́акті-самбгӯта̄х̣
самбандга̄ вівідга̄ мата̄х̣
сарва̄дга̄ра-сварӯпейаḿ
сарва̄ка̄ра̄ сад-аḿш́ака̄',
    E'', E'',
    E'All kinds of relationships manifest from the sandhini aspect. The sandhini
aspect of the Lord is the source of all spiritual manifestations and features.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'saḿvid-bhūtā
parā śaktir jñāna-vijñāna-rūpiṇī
sandhinī-nirmite
sattve bhāva-saḿyojinī satī', E'saḿvid-bhūtā
parā śaktir jñāna-vijñāna-rūpiṇī
sandhinī-nirmite
sattve bhāva-saḿyojinī satī',
    E'saḿvid-bhūtā
parā śaktir jñāna-vijñāna-rūpiṇī
sandhinī-nirmite
sattve bhāva-saḿyojinī satī', E'саḿвід-бгӯта̄
пара̄ ш́актір джн̃а̄на-віджн̃а̄на-рӯпін̣ı̄
сандгінı̄-нірміте
саттве бга̄ва-саḿйоджінı̄ сатı̄',
    E'', E'',
    E'The samvit aspect of the superior energy consists of knowledge and its
practical application (jnana and vijnana). When samvit interacts with the
manifestations of the sandhini aspect, all emotions appear.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'bhāvābhāve
ca sattāyāḿ na kiñcid api lakṣyate
tasmāt
tu sarva-bhāvānāḿ saḿvid eva prakāśinī', E'bhāvābhāve
ca sattāyāḿ na kiñcid api lakṣyate
tasmāt
tu sarva-bhāvānāḿ saḿvid eva prakāśinī',
    E'bhāvābhāve
ca sattāyāḿ na kiñcid api lakṣyate
tasmāt
tu sarva-bhāvānāḿ saḿvid eva prakāśinī', E'бга̄ва̄бга̄ве
ча сатта̄йа̄ḿ на кін̃чід апі лакшйате
тасма̄т
ту сарва-бга̄ва̄на̄ḿ саḿвід ева прака̄ш́інı̄',
    E'', E'',
    E'Without the presence of emotions, existence would be unknown. Therefore all
truths are illuminated by samvit. All the emotions of Vaikuntha are created by
the samvit aspect of the spiritual potency.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sandhinī-kṛta-sattveṣu
sambandha-bhāva-yojikā
saḿvid-rūpā
mahā-devī kāryākārya-vidhāyinī', E'sandhinī-kṛta-sattveṣu
sambandha-bhāva-yojikā
saḿvid-rūpā
mahā-devī kāryākārya-vidhāyinī',
    E'sandhinī-kṛta-sattveṣu
sambandha-bhāva-yojikā
saḿvid-rūpā
mahā-devī kāryākārya-vidhāyinī', E'сандгінı̄-кр̣та-саттвешу
самбандга-бга̄ва-йоджіка̄
саḿвід-рӯпа̄
маха̄-девı̄ ка̄рйа̄ка̄рйа-відга̄йінı̄',
    E'', E'',
    E'All relationships in Vaikuntha have been established by Samvitdevi, who is the
director of action and inaction. The different rasas, such as shanta and dasya,
and the respective activities in those rasas have been established by samvit.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'viśeṣābhāvataḥ
saḿvid brahma-jñānaḿ prakāśayet
viśeṣa-saḿyutā
sā tu bhagavad-bhakti-dāyinī', E'viśeṣābhāvataḥ
saḿvid brahma-jñānaḿ prakāśayet
viśeṣa-saḿyutā
sā tu bhagavad-bhakti-dāyinī',
    E'viśeṣābhāvataḥ
saḿvid brahma-jñānaḿ prakāśayet
viśeṣa-saḿyutā
sā tu bhagavad-bhakti-dāyinī', E'віш́еша̄бга̄ватах̣
саḿвід брахма-джн̃а̄наḿ прака̄ш́айет
віш́еша-саḿйута̄
са̄ ту бгаґавад-бгакті-да̄йінı̄',
    E'', E'',
    E'If one does not accept the quality of variegatedness, then Samvitdevi manifests
for him the impersonal feature of the Absolute Truth. The living entity then
takes shelter of impersonal knowledge of Brahman. Therefore impersonal
knowledge of Brahman is only the impersonal consideration of Vaikuntha. For one
who accepts the quality of variegatedness, Samvitdevi manifests the Supreme
Personality of Godhead. The living entity then accepts the devotional service
of the Lord.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'hlādinī-nāma-samprāptā
saiva śaktiḥ parākhyikā
mahā-bhāvādiṣu
sthitvā paramānanda-dāyinī', E'hlādinī-nāma-samprāptā
saiva śaktiḥ parākhyikā
mahā-bhāvādiṣu
sthitvā paramānanda-dāyinī',
    E'hlādinī-nāma-samprāptā
saiva śaktiḥ parākhyikā
mahā-bhāvādiṣu
sthitvā paramānanda-dāyinī', E'хла̄дінı̄-на̄ма-сампра̄пта̄
саіва ш́актіх̣ пара̄кхйіка̄
маха̄-бга̄ва̄дішу
стхітва̄ парама̄нанда-да̄йінı̄',
    E'', E'',
    E'When the spiritual potency of the superior energy interacts with the hladini
aspect, it creates attachment up to the state of mahabhava, in which She
(hladini) bestows the topmost ecstasy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sarvordhva-bhāva-sampannā
kṛṣṇārdha-rūpa-dhāriṇī
rādhikā
sattva-rūpeṇa kṛṣṇānandamayī kila', E'sarvordhva-bhāva-sampannā
kṛṣṇārdha-rūpa-dhāriṇī
rādhikā
sattva-rūpeṇa kṛṣṇānandamayī kila',
    E'sarvordhva-bhāva-sampannā
kṛṣṇārdha-rūpa-dhāriṇī
rādhikā
sattva-rūpeṇa kṛṣṇānandamayī kila', E'сарвордгва-бга̄ва-сампанна̄
кр̣шн̣а̄рдга-рӯпа-дга̄рін̣ı̄
ра̄дгіка̄
саттва-рӯпен̣а кр̣шн̣а̄нандамайı̄ кіла',
    E'', E'',
    E'This hladini is Sri Radhika, who is the energy of the energetic, who possesses
the topmost loving sentiments, and who is half of the Supreme Lord''s form. She
expands into the indescribable forms of Krsna''s inconceivable happiness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'mahābhāva-svarūpeyaḿ
rādhā kṛṣṇa-vinodinī
sakhya
aṣṭa-vidhā bhāvā hlādinyā rasa-poṣikāḥ', E'mahābhāva-svarūpeyaḿ
rādhā kṛṣṇa-vinodinī
sakhya
aṣṭa-vidhā bhāvā hlādinyā rasa-poṣikāḥ',
    E'mahābhāva-svarūpeyaḿ
rādhā kṛṣṇa-vinodinī
sakhya
aṣṭa-vidhā bhāvā hlādinyā rasa-poṣikāḥ', E'маха̄бга̄ва-сварӯпейаḿ
ра̄дга̄ кр̣шн̣а-вінодінı̄
сакхйа
ашт̣а-відга̄ бга̄ва̄ хла̄дінйа̄ раса-пошіка̄х̣',
    E'', E'',
    E'That Radha gives pleasure to Krsna. She is the embodiment of mahabhava. There
are eight varieties of emotions that nourish the rasa of hladini. They are
known as Radha''s eight sakhis.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tat-tad-bhāva-gatā
jīvā nityānanda-parāyaṇāḥ
sarvadā
jīva-sattāyāḿ bhāvānāḿ vimalā
sthitiḥ', E'tat-tad-bhāva-gatā
jīvā nityānanda-parāyaṇāḥ
sarvadā
jīva-sattāyāḿ bhāvānāḿ vimalā
sthitiḥ',
    E'tat-tad-bhāva-gatā
jīvā nityānanda-parāyaṇāḥ
sarvadā
jīva-sattāyāḿ bhāvānāḿ vimalā
sthitiḥ', E'тат-тад-бга̄ва-ґата̄
джı̄ва̄ нітйа̄нанда-пара̄йан̣а̄х̣
сарвада̄
джı̄ва-сатта̄йа̄ḿ бга̄ва̄на̄ḿ вімала̄
стхітіх̣',
    E'', E'',
    E'When the hladini energy of the living entities realizes a portion of the
spiritual hladini by the association of devotees and the mercy of the Lord,
then the living entities become eternally happy and attain the stage of pure
eternal sentiments while remaining individual entities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'hlādinī
sandhinī saḿvid ekā kṛṣṇe parātpare
yasya
svāḿśa-vilāseṣu nityā sā tritayātmikā', E'hlādinī
sandhinī saḿvid ekā kṛṣṇe parātpare
yasya
svāḿśa-vilāseṣu nityā sā tritayātmikā',
    E'hlādinī
sandhinī saḿvid ekā kṛṣṇe parātpare
yasya
svāḿśa-vilāseṣu nityā sā tritayātmikā', E'хла̄дінı̄
сандгінı̄ саḿвід ека̄ кр̣шн̣е пара̄тпаре
йасйа
сва̄ḿш́а-віла̄сешу нітйа̄ са̄ трітайа̄тміка̄',
    E'', E'',
    E'The sandhini, samvit, and hladini energies are eternally situated in Sri Krsna,
the Supreme Personality of Godhead; that is, existence, knowledge, and
attachment are in perfect harmony in Him. Yet these three energies are also
present in His personal expansions in His Vaikuntha pastimes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'etat
sarvaḿ svataḥ kṛṣṇe nirguṇe''pi kilādbhutam
cic-chakti-rati-sambhūtaḿ
cid-vibhūti-svarūpataḥ', E'etat
sarvaḿ svataḥ kṛṣṇe nirguṇe''pi kilādbhutam
cic-chakti-rati-sambhūtaḿ
cid-vibhūti-svarūpataḥ',
    E'etat
sarvaḿ svataḥ kṛṣṇe nirguṇe''pi kilādbhutam
cic-chakti-rati-sambhūtaḿ
cid-vibhūti-svarūpataḥ', E'етат
сарваḿ сватах̣ кр̣шн̣е нірґун̣е''пі кіла̄дбгутам
чіч-чхакті-раті-самбгӯтаḿ
чід-вібгӯті-сварӯпатах̣',
    E'', E'',
    E'Although many variegated qualities are eternally manifest in Sri Krsna, He
wonderfully remains nirguna, devoid of material qualities, because His
qualities are the interactions of His spiritual potency and are forms of His
spiritual opulence.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jīva-śakti-samudbhūto
vilāso''nyaḥ prakīrtitaḥ
jīvasya
bhinna-tattvatvāt vibhinnāḿśo nigadyate', E'jīva-śakti-samudbhūto
vilāso''nyaḥ prakīrtitaḥ
jīvasya
bhinna-tattvatvāt vibhinnāḿśo nigadyate',
    E'jīva-śakti-samudbhūto
vilāso''nyaḥ prakīrtitaḥ
jīvasya
bhinna-tattvatvāt vibhinnāḿśo nigadyate', E'джı̄ва-ш́акті-самудбгӯто
віла̄со''нйах̣ пракı̄ртітах̣
джı̄васйа
бгінна-таттватва̄т вібгінна̄ḿш́о ніґадйате',
    E'', E'',
    E'After concluding the consideration on the sandhini, samvit, and hladini aspects
of the spiritual potency of the superior energy, I will now explain the
sandhini, samvit, and hladini aspects of the marginal potency of the superior
energy. The living entities are created by the will of the Lord and by the
inconceivable superior energy of the Lord. The living entities have been
awarded minute independence, so they are classified as separated truths and
their activities are said to be separated from the Lord''s activities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'paramāṇu-samā
jīvāḥ kṛṣṇārka-kara-vartinaḥ
tat
teṣu kṛṣṇa-dharmāṇāḿ sad-bhāvo
vartate svataḥ', E'paramāṇu-samā
jīvāḥ kṛṣṇārka-kara-vartinaḥ
tat
teṣu kṛṣṇa-dharmāṇāḿ sad-bhāvo
vartate svataḥ',
    E'paramāṇu-samā
jīvāḥ kṛṣṇārka-kara-vartinaḥ
tat
teṣu kṛṣṇa-dharmāṇāḿ sad-bhāvo
vartate svataḥ', E'парама̄н̣у-сама̄
джı̄ва̄х̣ кр̣шн̣а̄рка-кара-вартінах̣
тат
тешу кр̣шн̣а-дгарма̄н̣а̄ḿ сад-бга̄во
вартате сватах̣',
    E'', E'',
    E'Krsna is like the spiritual sun, and the living entities are like the atomic
particles of that incomparable sun''s rays. Therefore all the qualities of Krsna
are naturally present in the living entities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'samudrasya
yathā binduḥ pṛthivyā reṇavo yathā
tathā
bhagavato jīve guṇānāḿ vartamānatā', E'samudrasya
yathā binduḥ pṛthivyā reṇavo yathā
tathā
bhagavato jīve guṇānāḿ vartamānatā',
    E'samudrasya
yathā binduḥ pṛthivyā reṇavo yathā
tathā
bhagavato jīve guṇānāḿ vartamānatā', E'самудрасйа
йатха̄ біндух̣ пр̣тхівйа̄ рен̣аво йатха̄
татха̄
бгаґавато джı̄ве ґун̣а̄на̄ḿ вартама̄ната̄',
    E'', E'',
    E'Although it is inappropriate to compare the greatness of the Lord''s qualities
with the ocean or the earth, if we do consider His qualities in this way, then
the qualities of the living entities appear like drops of the ocean or dust
particles of the earth.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'hlādinī
sandhinī saḿvit kṛṣṇe pūrṇatamā
matā
jīve
tv aṇu-svarūpeṇa draṣṭavyā sūkṣma-buddhibhiḥ', E'hlādinī
sandhinī saḿvit kṛṣṇe pūrṇatamā
matā
jīve
tv aṇu-svarūpeṇa draṣṭavyā sūkṣma-buddhibhiḥ',
    E'hlādinī
sandhinī saḿvit kṛṣṇe pūrṇatamā
matā
jīve
tv aṇu-svarūpeṇa draṣṭavyā sūkṣma-buddhibhiḥ', E'хла̄дінı̄
сандгінı̄ саḿвіт кр̣шн̣е пӯрн̣атама̄
мата̄
джı̄ве
тв ан̣у-сварӯпен̣а драшт̣авйа̄ сӯкшма-буддгібгіх̣',
    E'', E'',
    E'The three aspectshladini, sandhini, and samvitare fully manifest in Sri
Krsna, but they are also minutely present in the living entities. This is
understood by persons endowed with fine intelligence.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'svātantrye
vartamāne''pi jīvānāḿ bhadra-kāńkṣiṇām
śaktayo''nugatāḥ
śaśvat kṛṣṇecchāyāḥ svabhāvataḥ', E'svātantrye
vartamāne''pi jīvānāḿ bhadra-kāńkṣiṇām
śaktayo''nugatāḥ
śaśvat kṛṣṇecchāyāḥ svabhāvataḥ',
    E'svātantrye
vartamāne''pi jīvānāḿ bhadra-kāńkṣiṇām
śaktayo''nugatāḥ
śaśvat kṛṣṇecchāyāḥ svabhāvataḥ', E'сва̄тантрйе
вартама̄не''пі джı̄ва̄на̄ḿ бгадра-ка̄ńкшін̣а̄м
ш́актайо''нуґата̄х̣
ш́аш́ват кр̣шн̣еччха̄йа̄х̣ свабга̄ватах̣',
    E'', E'',
    E'All living entities have independence that was awarded by the Lord, yet those
who desire auspiciousness naturally remain under the subordination of Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'ye
tu bhoga-ratā mūḍhās te sva-śakti-parāyaṇāḥ
bhramanti
karma-mārgeṣu prapañce durnibārite', E'ye
tu bhoga-ratā mūḍhās te sva-śakti-parāyaṇāḥ
bhramanti
karma-mārgeṣu prapañce durnibārite',
    E'ye
tu bhoga-ratā mūḍhās te sva-śakti-parāyaṇāḥ
bhramanti
karma-mārgeṣu prapañce durnibārite', E'йе
ту бгоґа-рата̄ мӯд̣ха̄с те сва-ш́акті-пара̄йан̣а̄х̣
бграманті
карма-ма̄рґешу прапан̃че дурніба̄ріте',
    E'', E'',
    E'Those who are unable to recognize what is auspicious and what is inauspicious
and who engage in sense gratification do not accept subordination under the
spiritual potency and thus live independently. They traverse the path of
fruitive activities while wandering in the material world, which is difficult
to leave after once entering.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tatraiva
karma-mārgeṣu bhramatsu jantuṣu prabhuḥ
paramātma-svarūpeṇa
vartate līlayā svayam', E'tatraiva
karma-mārgeṣu bhramatsu jantuṣu prabhuḥ
paramātma-svarūpeṇa
vartate līlayā svayam',
    E'tatraiva
karma-mārgeṣu bhramatsu jantuṣu prabhuḥ
paramātma-svarūpeṇa
vartate līlayā svayam', E'татраіва
карма-ма̄рґешу бграматсу джантушу прабгух̣
парама̄тма-сварӯпен̣а
вартате лı̄лайа̄ свайам',
    E'', E'',
    E'For those living entities who traverse the path of fruitive activities, the
Lord, as His pastime, accompanies them in the form of the Supersoul.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'eṣā
jīveśayor līlā māyayā vartate''dhunā
ekaḥ
karma-phalaḿ bhuńkte cāparaḥ phala-dāyakaḥ', E'eṣā
jīveśayor līlā māyayā vartate''dhunā
ekaḥ
karma-phalaḿ bhuńkte cāparaḥ phala-dāyakaḥ',
    E'eṣā
jīveśayor līlā māyayā vartate''dhunā
ekaḥ
karma-phalaḿ bhuńkte cāparaḥ phala-dāyakaḥ', E'еша̄
джı̄веш́айор лı̄ла̄ ма̄йайа̄ вартате''дгуна̄
еках̣
карма-пхалаḿ бгуńкте ча̄парах̣ пхала-да̄йаках̣',
    E'', E'',
    E'The pastimes of the Lord and the living entities appear mundane to the
conditioned souls. The living entities enjoy the results of their fruitive
activities, while the Supersoul awards those results.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jīva-śakti-gatā
sā tu sandhinī sattva-rūpiṇī
svargādi-lokam
ārabhya pārakyaḿ sṛjati svayam', E'jīva-śakti-gatā
sā tu sandhinī sattva-rūpiṇī
svargādi-lokam
ārabhya pārakyaḿ sṛjati svayam',
    E'jīva-śakti-gatā
sā tu sandhinī sattva-rūpiṇī
svargādi-lokam
ārabhya pārakyaḿ sṛjati svayam', E'джı̄ва-ш́акті-ґата̄
са̄ ту сандгінı̄ саттва-рӯпін̣ı̄
сварґа̄ді-локам
а̄рабгйа па̄ракйаḿ ср̣джаті свайам',
    E'', E'',
    E'When the marginal potency of the superior energy interacts with sandhini, the
upper heavenly planets are created.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'karma
karma-phalaḿ duḥkhaḿ sukhaḿ vā tatra vartate
pāpa-puṇyādikaḿ
sarvam āśā-pāśādikaḿ hi yat', E'karma
karma-phalaḿ duḥkhaḿ sukhaḿ vā tatra vartate
pāpa-puṇyādikaḿ
sarvam āśā-pāśādikaḿ hi yat',
    E'karma
karma-phalaḿ duḥkhaḿ sukhaḿ vā tatra vartate
pāpa-puṇyādikaḿ
sarvam āśā-pāśādikaḿ hi yat', E'карма
карма-пхалаḿ дух̣кхаḿ сукхаḿ ва̄ татра вартате
па̄па-пун̣йа̄дікаḿ
сарвам а̄ш́а̄-па̄ш́а̄дікаḿ хі йат',
    E'', E'',
    E'Fruitive activities, the results of fruitive activities, distress, happiness,
sin, piety, and all desires are also created by this interaction with sandhini.
The functions of the subtle bodies are also created by this interaction.
Svarloka, Janaloka, Tapoloka, Satyaloka, and Brahmaloka are all created by this
interaction. Even the lower hellish planets are understood to be created by
this interaction with sandhini.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jīva-śakti-gatā
saḿvid īśa-jñānaḿ prakāśayet
jñānena
yena jīvānām ātmany ātmā hi lakṣyate', E'jīva-śakti-gatā
saḿvid īśa-jñānaḿ prakāśayet
jñānena
yena jīvānām ātmany ātmā hi lakṣyate',
    E'jīva-śakti-gatā
saḿvid īśa-jñānaḿ prakāśayet
jñānena
yena jīvānām ātmany ātmā hi lakṣyate', E'джı̄ва-ш́акті-ґата̄
саḿвід ı̄ш́а-джн̃а̄наḿ прака̄ш́айет
джн̃а̄нена
йена джı̄ва̄на̄м а̄тманй а̄тма̄ хі лакшйате',
    E'', E'',
    E'When the marginal potency of the superior energy interacts with samvit, it
manifests knowledge of the Absolute Truth. By this knowledge a living entity
realizes the Supersoul. This knowledge is distinct from and inferior to
impersonal knowledge of Brahman, which is manifested by the interaction of the
spiritual potency of the superior energy with samvit.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'vairāgyam
api jīvānāḿ saḿvidā sampravartate
kadācil
laya-vāñchā tu prabalā bhavati dhruvam', E'vairāgyam
api jīvānāḿ saḿvidā sampravartate
kadācil
laya-vāñchā tu prabalā bhavati dhruvam',
    E'vairāgyam
api jīvānāḿ saḿvidā sampravartate
kadācil
laya-vāñchā tu prabalā bhavati dhruvam', E'ваіра̄ґйам
апі джı̄ва̄на̄ḿ саḿвіда̄ самправартате
када̄чіл
лайа-ва̄н̃чха̄ ту прабала̄ бгаваті дгрувам',
    E'', E'',
    E'Renunciation, in the form of neglecting maya, manifests from this interaction
of samvit with the marginal energy. Sometimes the living entities consider the
happiness of realizing the self as insignificant and the happiness of realizing
the Supersoul as relatively superior, and they therefore desire to merge with
the Supersoul.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jīve
yā hlādinī-śaktir īśa-bhakti-svarūpiṇī
māyā-niṣedhikā
sā tu nirākāra-parāyaṇā', E'jīve
yā hlādinī-śaktir īśa-bhakti-svarūpiṇī
māyā-niṣedhikā
sā tu nirākāra-parāyaṇā',
    E'jīve
yā hlādinī-śaktir īśa-bhakti-svarūpiṇī
māyā-niṣedhikā
sā tu nirākāra-parāyaṇā', E'джı̄ве
йа̄ хла̄дінı̄-ш́актір ı̄ш́а-бгакті-сварӯпін̣ı̄
ма̄йа̄-нішедгіка̄
са̄ ту ніра̄ка̄ра-пара̄йан̣а̄',
    E'', E'',
    E'When the marginal potency of the superior energy interacts with hladini, it
manifests devotional service to the Supreme Lord. This devotional service
nullifies the material conception of the Lord and establishes Him as nirakara,
or formless.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 29
  INSERT INTO public.verses (
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
    E'cic-chaktir
atibhinnatvād īśa-bhaktiḥ kadācana
na
prīti-rūpam āpnoti sadā śuṣkā svabhāvataḥ', E'cic-chaktir
atibhinnatvād īśa-bhaktiḥ kadācana
na
prīti-rūpam āpnoti sadā śuṣkā svabhāvataḥ',
    E'cic-chaktir
atibhinnatvād īśa-bhaktiḥ kadācana
na
prīti-rūpam āpnoti sadā śuṣkā svabhāvataḥ', E'чіч-чхактір
атібгіннатва̄д ı̄ш́а-бгактіх̣ када̄чана
на
прı̄ті-рӯпам а̄пноті сада̄ ш́ушка̄ свабга̄ватах̣',
    E'', E'',
    E'The rati, or attachment, of the spiritual potency is different from this type
of devotional service of the Supreme Lord. Therefore this devotional service of
the Lord is naturally dry, or without rasa, and is not based on love.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 30
  INSERT INTO public.verses (
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
    E'kṛtajñatā-bhāva-yuktā
prārthanā vartate harau
saḿsṛteḥ
puṣṭi-vāñchā vā vairāgya-bhāvanā-yutā', E'kṛtajñatā-bhāva-yuktā
prārthanā vartate harau
saḿsṛteḥ
puṣṭi-vāñchā vā vairāgya-bhāvanā-yutā',
    E'kṛtajñatā-bhāva-yuktā
prārthanā vartate harau
saḿsṛteḥ
puṣṭi-vāñchā vā vairāgya-bhāvanā-yutā', E'кр̣таджн̃ата̄-бга̄ва-йукта̄
пра̄ртхана̄ вартате харау
саḿср̣тех̣
пушт̣і-ва̄н̃чха̄ ва̄ ваіра̄ґйа-бга̄вана̄-йута̄',
    E'', E'',
    E'The prayers of those who perform this type of devotional service are mixed with
gratefulness, therefore this cannot be called unmotivated devotional service.
Rather, their prayers are filled with desires for material advancement or
renunciation.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 31
  INSERT INTO public.verses (
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
    E'kadācid
bhāva-bāhulyād aśru vā vartate dṛśoḥ
tathāpi
na bhaved bhāvaḥ śrī-kṛṣṇe cid-vilāsini', E'kadācid
bhāva-bāhulyād aśru vā vartate dṛśoḥ
tathāpi
na bhaved bhāvaḥ śrī-kṛṣṇe cid-vilāsini',
    E'kadācid
bhāva-bāhulyād aśru vā vartate dṛśoḥ
tathāpi
na bhaved bhāvaḥ śrī-kṛṣṇe cid-vilāsini', E'када̄чід
бга̄ва-ба̄хулйа̄д аш́ру ва̄ вартате др̣ш́ох̣
татха̄пі
на бгавед бга̄вах̣ ш́рı̄-кр̣шн̣е чід-віла̄сіні',
    E'', E'',
    E'Although sometimes tears are shed out of emotion while executing this type of
devotional service, such persons'' emotions for Sri Krsna, who enjoys spiritual
pastimes, do not arise.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 32
  INSERT INTO public.verses (
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
    E'vibhinnāḿśa-gatā
līlā kṛṣṇasya paramātmanaḥ
jīvānāḿ
baddha-bhūtānāḿ sambandhe vidyate kila', E'vibhinnāḿśa-gatā
līlā kṛṣṇasya paramātmanaḥ
jīvānāḿ
baddha-bhūtānāḿ sambandhe vidyate kila',
    E'vibhinnāḿśa-gatā
līlā kṛṣṇasya paramātmanaḥ
jīvānāḿ
baddha-bhūtānāḿ sambandhe vidyate kila', E'вібгінна̄ḿш́а-ґата̄
лı̄ла̄ кр̣шн̣асйа парама̄тманах̣
джı̄ва̄на̄ḿ
баддга-бгӯта̄на̄ḿ самбандге відйате кіла',
    E'', E'',
    E'Does this mean that there is no superior emotion in the hearts of the
conditioned souls than this form of devotional service? Certainly there is.
Just as Sri Krsna performs His pastimes in Vaikuntha with the eternally perfect
living entities, He certainly performs pastimes in relationship with the
conditioned souls.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 33
  INSERT INTO public.verses (
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
    E'cid-vilāsa-ratā
ye tu cic-chakti-pālitāḥ sadā
na
teṣām ātma-yogena brahma-jñānena vā phalam', E'cid-vilāsa-ratā
ye tu cic-chakti-pālitāḥ sadā
na
teṣām ātma-yogena brahma-jñānena vā phalam',
    E'cid-vilāsa-ratā
ye tu cic-chakti-pālitāḥ sadā
na
teṣām ātma-yogena brahma-jñānena vā phalam', E'чід-віла̄са-рата̄
йе ту чіч-чхакті-па̄літа̄х̣ сада̄
на
теша̄м а̄тма-йоґена брахма-джн̃а̄нена ва̄ пхалам',
    E'', E'',
    E'Those who consider the happiness of the hladini aspect of the marginal potency
as insignificant and consider the impersonal Brahman as incomplete understand
that the pastimes of Krsna with the spiritual potency of the superior energy
are more relishable, so they join those pastimes. They are qualified for
receiving the highest happiness. They are servants of the Lord and are under
the protection of the spiritual potency. They derive no fruits whatsoever from
impersonal knowledge of Brahman or yoga. In this context, yoga refers to
devotional service (as described above in verses 28-31), as practiced by the
living entities. Regarding impersonal knowledge of Brahman, please refer to
verse 9 of this chapter. Therefore when yogis and jnanis become fortunate, they
engage in spiritual activities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 34
  INSERT INTO public.verses (
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
    E'māyā
tu jaḍa-yonitvāc cid-dharma-parivartinī
āvaraṇātmikā
śaktir īśasya paricārikā', E'māyā
tu jaḍa-yonitvāc cid-dharma-parivartinī
āvaraṇātmikā
śaktir īśasya paricārikā',
    E'māyā
tu jaḍa-yonitvāc cid-dharma-parivartinī
āvaraṇātmikā
śaktir īśasya paricārikā', E'ма̄йа̄
ту джад̣а-йонітва̄ч чід-дгарма-парівартінı̄
а̄варан̣а̄тміка̄
ш́актір ı̄ш́асйа паріча̄ріка̄',
    E'', E'',
    E'After completing discussions on the marginal potency, I will now discuss the
sandhini, samvit, and hladini aspects of maya-shakti, the external potency. All
inert matter is manifested from the external potency of the superior energy.
Therefore this maya potency converts spiritual characteristics into material
characteristics. Maya, the external potency, covers the living entities, so she
is the mother of illusion and a maidservant of the Supersoul.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 35
  INSERT INTO public.verses (
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
    E'cic-chakteḥ
pratibimbatvān māyayā bhinnatā kutaḥ
praticchāyā
bhaved bhinnā vastuno na kadācana', E'cic-chakteḥ
pratibimbatvān māyayā bhinnatā kutaḥ
praticchāyā
bhaved bhinnā vastuno na kadācana',
    E'cic-chakteḥ
pratibimbatvān māyayā bhinnatā kutaḥ
praticchāyā
bhaved bhinnā vastuno na kadācana', E'чіч-чхактех̣
пратібімбатва̄н ма̄йайа̄ бгінната̄ кутах̣
пратіччха̄йа̄
бгавед бгінна̄ вастуно на када̄чана',
    E'', E'',
    E'After carefully studying the nature of maya, it is concluded to be the most
inferior potency in the whole creation, because all of the living entities''
inauspiciousness is created by maya. If maya did not exist, there would be no
degradation of the living entities in the form of aversion to the Lord.
Therefore many people doubt whether maya is the Lord''s energy, because the
Supreme Lord is all-auspicious and unaffected by sin. Those who understand the
Supreme Lord as the supreme doer and controller do not accept any truth that is
contrary to Him; they thus accept maya as the material potency of the Supreme
Lord''s spiritual energy. The external potency, which is a reflection or shadow
of the spiritual potency, is not independent. By the will of the Lord, maya is
the perverted reflection of, and therefore certainly subordinate to, the Lord''s
spiritual potency. In this context one should not accept the Mayavadi
praticchaya (shadow).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 36
  INSERT INTO public.verses (
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
    E'tasmān
māyā-kṛte viśve yad yad bhāti viśeṣataḥ
tat
tad eva pratichāyā cic-chakter jala-candravat', E'tasmān
māyā-kṛte viśve yad yad bhāti viśeṣataḥ
tat
tad eva pratichāyā cic-chakter jala-candravat',
    E'tasmān
māyā-kṛte viśve yad yad bhāti viśeṣataḥ
tat
tad eva pratichāyā cic-chakter jala-candravat', E'тасма̄н
ма̄йа̄-кр̣те віш́ве йад йад бга̄ті віш́ешатах̣
тат
тад ева пратічха̄йа̄ чіч-чхактер джала-чандрават',
    E'', E'',
    E'If we consider the existence of maya, we can conclude that this world is the
shadow of Vaikuntha, which is created by the spiritual potency of the superior
energy of the Lord and is full of variegatedness. The example of the moon in
water is applicable to this shadow [the material world]. But this world is not
false in the same way as the moon in the water is false. As maya is in fact a
potency of the superior energy, whatever is created by her is also a fact.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 37
  INSERT INTO public.verses (
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
    E'māyayā
bimbitaḿ sarvaḿ prapañcaḥ śabdyate budhaiḥ
jīvasya
bandhane śaktam īśasya līlayā sadā', E'māyayā
bimbitaḿ sarvaḿ prapañcaḥ śabdyate budhaiḥ
jīvasya
bandhane śaktam īśasya līlayā sadā',
    E'māyayā
bimbitaḿ sarvaḿ prapañcaḥ śabdyate budhaiḥ
jīvasya
bandhane śaktam īśasya līlayā sadā', E'ма̄йайа̄
бімбітаḿ сарваḿ прапан̃чах̣ ш́абдйате будгаіх̣
джı̄васйа
бандгане ш́актам ı̄ш́асйа лı̄лайа̄ сада̄',
    E'', E'',
    E'As far as the work of the maidservant [Maya] is concerned, learned people say
that this material world is her creation. This material existence is able to
bind the living entities as part of the Lord''s pastimes (please see verses
22-23 of this chapter).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 38
  INSERT INTO public.verses (
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
    E'vastunaḥ
śuddha-bhāvatvaḿ chāyāyāḿ vartate
kutaḥ
tasmān
māyā-kṛte viśve heyatvaḿ paridṛśyate', E'vastunaḥ
śuddha-bhāvatvaḿ chāyāyāḿ vartate
kutaḥ
tasmān
māyā-kṛte viśve heyatvaḿ paridṛśyate',
    E'vastunaḥ
śuddha-bhāvatvaḿ chāyāyāḿ vartate
kutaḥ
tasmān
māyā-kṛte viśve heyatvaḿ paridṛśyate', E'вастунах̣
ш́уддга-бга̄ватваḿ чха̄йа̄йа̄ḿ вартате
кутах̣
тасма̄н
ма̄йа̄-кр̣те віш́ве хейатваḿ парідр̣ш́йате',
    E'', E'',
    E'Just as the original, pure condition of an object is not manifest in its
shadow, we do not find the pleasantness of the spiritual world in the material
world, which is created by maya, rather we find the perverted quality,
distress.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 39
  INSERT INTO public.verses (
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
    E'sā
māyā sandhinī bhūtvā deśa-buddhiḿ tanoti hi
ākṛtau
vistṛtau vyāptā prapañce vartate jaḍā', E'sā
māyā sandhinī bhūtvā deśa-buddhiḿ tanoti hi
ākṛtau
vistṛtau vyāptā prapañce vartate jaḍā',
    E'sā
māyā sandhinī bhūtvā deśa-buddhiḿ tanoti hi
ākṛtau
vistṛtau vyāptā prapañce vartate jaḍā', E'са̄
ма̄йа̄ сандгінı̄ бгӯтва̄ деш́а-буддгіḿ таноті хі
а̄кр̣тау
вістр̣тау вйа̄пта̄ прапан̃че вартате джад̣а̄',
    E'', E'',
    E'When the external potency of the superior energy interacts with sandhini, it
spreads conceptions of nationalism. This mentality is found only in this world.
The symptoms of this conception are spread through forms and their expansions.
If one could ascertain Vaikuntha by one''s thoughts, then the material forms and
their expansions would certainly be useful. But the science of Vaikuntha is
beyond the realm of material space, time, and argument and is realized through
samadhi. Actually all the forms and expansions that are seen in Vaikuntha, the
abode of transcendental pastimes, are all spiritual and auspicious. It should
be known that the forms and expansions of the material world, the perverted
reflection of the spiritual world, are forever devoid of bliss.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 40
  INSERT INTO public.verses (
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
    E'jīvānāḿ
martya-dehādau sarvāṇi karaṇāni ca
tiṣṭhanti
parimeyāni bhautikāni bhavāya hi', E'jīvānāḿ
martya-dehādau sarvāṇi karaṇāni ca
tiṣṭhanti
parimeyāni bhautikāni bhavāya hi',
    E'jīvānāḿ
martya-dehādau sarvāṇi karaṇāni ca
tiṣṭhanti
parimeyāni bhautikāni bhavāya hi', E'джı̄ва̄на̄ḿ
мартйа-деха̄дау сарва̄н̣і каран̣а̄ні ча
тішт̣ханті
парімейа̄ні бгаутіка̄ні бгава̄йа хі',
    E'', E'',
    E'The activities and bodies of the conditioned living entities are material and
limited and are meant for performing work and enjoying its results. They are
created by the sandhini aspect of the external potency. If one tries to
understand words like tiny and atomic in descriptions of the living
entities and greatness in descriptions of the Supreme Lord in terms of
material space, then one will not attain knowledge of the Absolute Truth.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 41
  INSERT INTO public.verses (
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
    E'saḿvid-rūpā
mahā-māyā lińga-rūpa-vidhāyinī
ahańkārātmakaḿ
cittaḿ baddha-jīve tanoty aho', E'saḿvid-rūpā
mahā-māyā lińga-rūpa-vidhāyinī
ahańkārātmakaḿ
cittaḿ baddha-jīve tanoty aho',
    E'saḿvid-rūpā
mahā-māyā lińga-rūpa-vidhāyinī
ahańkārātmakaḿ
cittaḿ baddha-jīve tanoty aho', E'саḿвід-рӯпа̄
маха̄-ма̄йа̄ ліńґа-рӯпа-відга̄йінı̄
ахаńка̄ра̄тмакаḿ
чіттаḿ баддга-джı̄ве танотй ахо',
    E'', E'',
    E'When the external potency of the superior energy interacts with samvit, it
creates the subtle body of conditioned souls in the form of intelligence and
false ego. The constitutional position of a pure living entity is beyond the
gross and subtle bodies. The samvit aspect of the external potency is known in
the scriptures as nescience. Due to this nescience, the gross and subtle bodies
of the living entities are created. When pure living entities reside in
Vaikuntha, the first knot of nescience, in the form of false ego, does not
entangle them. Pure living entities cannot remain steady after giving up
spiritual activities. Therefore as soon as the living entities become situated
in their own happiness through the minute independence given by the Lord, they
become shelterless and are compelled to take shelter of Maya. On account of
this, pure living entities have no shelter other than Vaikuntha. The living
entities of Vaikuntha are very insignificant, like fireflies in comparison to
the powerful sunlike Lord. As soon as the living entity leaves Vaikuntha, he is
simultaneously awarded a subtle body and thrown into the material world,
created by Maya. All manifestations of the sandhini, samvit, and hladini
aspects of the marginal potency are mixed with maya as soon as the living
entity leaves the shelter of Vaikuntha. When one considers material existence
as his own, this is called false ego. Absorption in this false ego is the
function of the heart, cultivating material sense objects through the heart is
the function of the mind, and realization through this cultivation is called
material knowledge. The mind, being superior to the senses, manifests as the
functions of the senses in their association. When the impression of contact
between the senses and sense objects is established within, it is protected by
the strength of remembrance. When one cultivates those protected memories by
following the process of elaborating and condensing them, then whatever one
conjectures is called argument. By this argument, knowledge of sense objects
and related items is acquired.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 42
  INSERT INTO public.verses (
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
    E'sā
śaktiś cetaso buddhir indriye bodha-rūpiṇī
manasy
eva smṛtiḥ śaśvat viṣaya-jñāna-dāyinī', E'sā
śaktiś cetaso buddhir indriye bodha-rūpiṇī
manasy
eva smṛtiḥ śaśvat viṣaya-jñāna-dāyinī',
    E'sā
śaktiś cetaso buddhir indriye bodha-rūpiṇī
manasy
eva smṛtiḥ śaśvat viṣaya-jñāna-dāyinī', E'са̄
ш́актіш́ четасо буддгір індрійе бодга-рӯпін̣ı̄
манасй
ева смр̣тіх̣ ш́аш́ват вішайа-джн̃а̄на-да̄йінı̄',
    E'', E'',
    E'The samvit aspect of the external energy creates the intelligence of the heart,
the feelings of the senses, the remembrance of the mind, and the knowledge of
sense objects.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 43
  INSERT INTO public.verses (
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
    E'viṣaya-jñānam
eva syān māyikaḿ nātma-dharmakam
prakṛter
guṇa-saḿyuktaḿ prākṛtaḿ kathyate
janaiḥ', E'viṣaya-jñānam
eva syān māyikaḿ nātma-dharmakam
prakṛter
guṇa-saḿyuktaḿ prākṛtaḿ kathyate
janaiḥ',
    E'viṣaya-jñānam
eva syān māyikaḿ nātma-dharmakam
prakṛter
guṇa-saḿyuktaḿ prākṛtaḿ kathyate
janaiḥ', E'вішайа-джн̃а̄нам
ева сйа̄н ма̄йікаḿ на̄тма-дгармакам
пракр̣тер
ґун̣а-саḿйуктаḿ пра̄кр̣таḿ катхйате
джанаіх̣',
    E'', E'',
    E'Knowledge of sense objects is completely mundane. It has nothing to do with
one''s constitutional duties. It is called material knowledge because it is
connected with the qualities of the material world.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 44
  INSERT INTO public.verses (
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
    E'sā
māyā-hlādinī prītir viṣayeṣu bhavet kila
karmānanda-svarūpā
sa bhukti-bhāva-pradāyinī', E'sā
māyā-hlādinī prītir viṣayeṣu bhavet kila
karmānanda-svarūpā
sa bhukti-bhāva-pradāyinī',
    E'sā
māyā-hlādinī prītir viṣayeṣu bhavet kila
karmānanda-svarūpā
sa bhukti-bhāva-pradāyinī', E'са̄
ма̄йа̄-хла̄дінı̄ прı̄тір вішайешу бгавет кіла
карма̄нанда-сварӯпа̄
са бгукті-бга̄ва-прада̄йінı̄',
    E'', E'',
    E'The hladini aspect of the external energy manifests as attachment for material
objects. That attachment spreads the conception of enjoyment in the form of
happiness derived from fruitive activities. Attachment for the material world,
the endeavor for material prosperity, and the desire for sense gratification
all naturally arise from this attachment to sense objects. In order to maintain
life peacefully, the four castesbrahmana, kshatriya, vaishya, and shudraare
established according to people''s natural characteristics, and the four
ashramasgrihastha, vanaprastha, brahmacari, and sannyasiare established
according to people''s position. According to necessity, constitutional and
conditional occupational duties are ascribed. When the upper and lower planets,
which are created by the sandhini aspect of the marginal potency (see verses
24-25), are connected with the results of these duties, then they become the
object of the fruitive workers'' hopes or fears. It is to be mentioned at this
point that the samvit and hladini aspects of the marginal potency, being almost
covered by the samvit and hladini aspects of the external potency, time to time
manifest renunciation and knowledge of the self, which are ultimately overcome
by maya due to the absence of spiritual activities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 45
  INSERT INTO public.verses (
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
    E'yajñeśa-bhajanaḿ
śaśvat tat-prīti-kārakaḿ bhavet
trivarga-viṣayo
dharmo lakṣitas tatra karmibhiḥ', E'yajñeśa-bhajanaḿ
śaśvat tat-prīti-kārakaḿ bhavet
trivarga-viṣayo
dharmo lakṣitas tatra karmibhiḥ',
    E'yajñeśa-bhajanaḿ
śaśvat tat-prīti-kārakaḿ bhavet
trivarga-viṣayo
dharmo lakṣitas tatra karmibhiḥ', E'йаджн̃еш́а-бгаджанаḿ
ш́аш́ват тат-прı̄ті-ка̄ракаḿ бгавет
тріварґа-вішайо
дгармо лакшітас татра кармібгіх̣',
    E'', E'',
    E'The Supersoul is perceived at this point as Yajnesvara, the Lord of sacrifice.
People of the material world try to please Him by their activities, and they
worship Him by sacrifices. The name of this religion is trivarga, or dharma,
artha, and kama. But there is no possibility of moksha, or liberation, by this
path.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Chapter 3: Avatara Lila Varnanam
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Avatara Lila Varnanam', E'Аватара-ліла-варнанам', 'verses', true)
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
    E'bhagavac-chakti-kāryeṣu
trividheṣu sva-śaktimān
vilasan vartate
kṛṣṇaś cij-jīva-māyikeṣu ca', E'bhagavac-chakti-kāryeṣu
trividheṣu sva-śaktimān
vilasan vartate
kṛṣṇaś cij-jīva-māyikeṣu ca',
    E'bhagavac-chakti-kāryeṣu
trividheṣu sva-śaktimān
vilasan vartate
kṛṣṇaś cij-jīva-māyikeṣu ca', E'бгаґавач-чхакті-ка̄рйешу
трівідгешу сва-ш́актіма̄н
віласан вартате
кр̣шн̣аш́ чідж-джı̄ва-ма̄йікешу ча',
    E'', E'',
    E'The two philosophiesadvaita-vada, or monism, from Vedanta and materialism from
Sarikhyahave been current from time immemorial. Monism has been further
divided into two, namely vivarta-vdda and Mayavada. Among all these philosophers,
some say the material world is a transformation of Brahman, some say it is
false, and some have established the material world as beginningless. Swanlike
persons, however, say that although Lord Krsna is separate from all activities
and their cause, by His incon­ceivable potency and through His three principle
energies the Lord is nevertheless present and involved in the activities of
Vaikuntha, the living entities, and the material world.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'cit-kāryeṣu
svayaḿ kṛṣṇo jīve tu paramātmakaḥ
jaḍe
yajñeśvaraḥ pūjyaḥ sarva-karma-phala-pradaḥ', E'cit-kāryeṣu
svayaḿ kṛṣṇo jīve tu paramātmakaḥ
jaḍe
yajñeśvaraḥ pūjyaḥ sarva-karma-phala-pradaḥ',
    E'cit-kāryeṣu
svayaḿ kṛṣṇo jīve tu paramātmakaḥ
jaḍe
yajñeśvaraḥ pūjyaḥ sarva-karma-phala-pradaḥ', E'чіт-ка̄рйешу
свайаḿ кр̣шн̣о джı̄ве ту парама̄тмаках̣
джад̣е
йаджн̃еш́варах̣ пӯджйах̣ сарва-карма-пхала-прадах̣',
    E'', E'',
    E'Sri Krsna is personally present in spiritual activities. He is present as
Supersoul in the living entities, and He is worshiped as Ya­jnesvara in the
material world. He alone awards the results of all activities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sarvāḿśī
sarva-rūpī ca sarvāvatāra-bījakaḥ
kṛṣṇas
tu bhagavān sākṣān na tasmāt para eva hi', E'sarvāḿśī
sarva-rūpī ca sarvāvatāra-bījakaḥ
kṛṣṇas
tu bhagavān sākṣān na tasmāt para eva hi',
    E'sarvāḿśī
sarva-rūpī ca sarvāvatāra-bījakaḥ
kṛṣṇas
tu bhagavān sākṣān na tasmāt para eva hi', E'сарва̄ḿш́ı̄
сарва-рӯпı̄ ча сарва̄вата̄ра-бı̄джаках̣
кр̣шн̣ас
ту бгаґава̄н са̄кша̄н на тасма̄т пара ева хі',
    E'', E'',
    E'All the existing personal expansions and all the created sepa. rated
expansions, the living entities, are products of Krsna''s energy, therefore Lord
Sri Krsna is the origin of all expansions. Nothing can manifest outside of His
energy, therefore He is the source of all forms. All incarnations of the Lord
emanate from Him, therefore He is the source of all incarnations. Lord Sri
Krsna is the Supreme Personality of Godhead. There is no truth superior to Him.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'acintya-śakti-sampannaḥ
sa kṛṣṇaḥ karuṇā-mayaḥ
māyā-baddhaysa
jīvasya kṣemāya yatnavān sadā', E'acintya-śakti-sampannaḥ
sa kṛṣṇaḥ karuṇā-mayaḥ
māyā-baddhaysa
jīvasya kṣemāya yatnavān sadā',
    E'acintya-śakti-sampannaḥ
sa kṛṣṇaḥ karuṇā-mayaḥ
māyā-baddhaysa
jīvasya kṣemāya yatnavān sadā', E'ачінтйа-ш́акті-сампаннах̣
са кр̣шн̣ах̣ карун̣а̄-майах̣
ма̄йа̄-баддгайса
джı̄васйа кшема̄йа йатнава̄н сада̄',
    E'', E'',
    E'That Krsna is inconceivably powerful and merciful. He is ar­dently engaged in
the welfare of the living entities who have been conditioned by Maya due to
misuse of their independence.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'yad-yad-bhāva-gato
jīvas tat-tad-bhāva-gato hariḥ
avatīrṇaḥ
sva-śaktyā sa krīḍatīva janaiḥ saha', E'yad-yad-bhāva-gato
jīvas tat-tad-bhāva-gato hariḥ
avatīrṇaḥ
sva-śaktyā sa krīḍatīva janaiḥ saha',
    E'yad-yad-bhāva-gato
jīvas tat-tad-bhāva-gato hariḥ
avatīrṇaḥ
sva-śaktyā sa krīḍatīva janaiḥ saha', E'йад-йад-бга̄ва-ґато
джı̄вас тат-тад-бга̄ва-ґато харіх̣
аватı̄рн̣ах̣
сва-ш́актйа̄ са крı̄д̣атı̄ва джанаіх̣ саха',
    E'', E'',
    E'When the conditioned souls receive various forms according to their nature, the
Supreme Lord Krsna, by His inconceivable po­tency, agrees to accompany them by
incarnating and enjoying pastimes with them.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'matsyeṣu
matsya-bhāvo hi kacchape kūrma-rūpakaḥ
meru-daṇḍa-yute
jīve varāha-bhāvavān hariḥ', E'matsyeṣu
matsya-bhāvo hi kacchape kūrma-rūpakaḥ
meru-daṇḍa-yute
jīve varāha-bhāvavān hariḥ',
    E'matsyeṣu
matsya-bhāvo hi kacchape kūrma-rūpakaḥ
meru-daṇḍa-yute
jīve varāha-bhāvavān hariḥ', E'матсйешу
матсйа-бга̄во хі каччхапе кӯрма-рӯпаках̣
меру-дан̣д̣а-йуте
джı̄ве вара̄ха-бга̄вава̄н харіх̣',
    E'', E'',
    E'When the living entities accept the position of fish, the Lord accepts His fish
incarnation, Matsya. Matsya is without danda. When the living entities
gradually accept the position of vajra-danda, then the Lord incarnates as
Kurma. When vajra-danda gradually becomes meru-danda, the Lord incarnates as
Varaha.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'nṛsiḿho
madhya-bhāvo hi vāmanaḥ kṣudra-mānave
bhārgavo''sabhya-vargeṣu
sabhye dāśarathis tathā', E'nṛsiḿho
madhya-bhāvo hi vāmanaḥ kṣudra-mānave
bhārgavo''sabhya-vargeṣu
sabhye dāśarathis tathā',
    E'nṛsiḿho
madhya-bhāvo hi vāmanaḥ kṣudra-mānave
bhārgavo''sabhya-vargeṣu
sabhye dāśarathis tathā', E'нр̣сіḿхо
мадгйа-бга̄во хі ва̄манах̣ кшудра-ма̄наве
бга̄рґаво''сабгйа-варґешу
сабгйе да̄ш́аратхіс татха̄',
    E'', E'',
    E'When the living entities accept the combined position of incarnation of human
and animal, the Lord accepts His incarnation of Nrsimha. When the living entities
are short, He appears as Vamana. When the living entities are uncivilized, He
comes as Parasurama. When they are civilized, He appears as Ramacandra.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sarva-vijñāna-sampanne
kṛṣṇas tu bhagavān svayam
tarka-niṣṭha-nare
buddho nāstike kalkir eva ca', E'sarva-vijñāna-sampanne
kṛṣṇas tu bhagavān svayam
tarka-niṣṭha-nare
buddho nāstike kalkir eva ca',
    E'sarva-vijñāna-sampanne
kṛṣṇas tu bhagavān svayam
tarka-niṣṭha-nare
buddho nāstike kalkir eva ca', E'сарва-віджн̃а̄на-сампанне
кр̣шн̣ас ту бгаґава̄н свайам
тарка-нішт̣ха-наре
буддго на̄стіке калкір ева ча',
    E'', E'',
    E'When the living entities possess the wealth of practical knowl­edge, then Lord
Krsna Himself appears. When the living entities develop the tendency for
argument, the Lord appears as Buddha. And when they are atheistic, the Lord
comes as Kalki. These are well-known facts.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'avatārā harer
bhāvāḥ kramordhva-gatimad dhṛdi
na teṣāḿ
janma-karmādau prapañco vartate kvacit', E'avatārā harer
bhāvāḥ kramordhva-gatimad dhṛdi
na teṣāḿ
janma-karmādau prapañco vartate kvacit',
    E'avatārā harer
bhāvāḥ kramordhva-gatimad dhṛdi
na teṣāḿ
janma-karmādau prapañco vartate kvacit', E'авата̄ра̄ харер
бга̄ва̄х̣ крамордгва-ґатімад дгр̣ді
на теша̄ḿ
джанма-карма̄дау прапан̃чо вартате квачіт',
    E'', E'',
    E'In the course of the gradual development of the living entities'' hearts, the Lord
incarnates in a form material contamination.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jīvānāḿ
krama-bhāvānāḿ lakṣaṇānāḿ
vicārataḥ
kālo vibhajyate
śāstre daśadhā ṛṣibhiḥ pṛthak', E'jīvānāḿ
krama-bhāvānāḿ lakṣaṇānāḿ
vicārataḥ
kālo vibhajyate
śāstre daśadhā ṛṣibhiḥ pṛthak',
    E'jīvānāḿ
krama-bhāvānāḿ lakṣaṇānāḿ
vicārataḥ
kālo vibhajyate
śāstre daśadhā ṛṣibhiḥ pṛthak', E'джı̄ва̄на̄ḿ
крама-бга̄ва̄на̄ḿ лакшан̣а̄на̄ḿ
віча̄ратах̣
ка̄ло вібгаджйате
ш́а̄стре даш́адга̄ р̣шібгіх̣ пр̣тхак',
    E'', E'',
    E' 11) After consideration, the sages have divided the history of the living
entities'' advancement into ten periods of time. Each period has different
symptoms, with each successive mood superior to the previous. Each progressive
mood is described as an incarnation.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tat-tat-kāla-gato
bhāvaḥ kṛṣṇasya lakṣyate hi yaḥ
sa eva kathyate vijñair
avatāro hareḥ kila', E'tat-tat-kāla-gato
bhāvaḥ kṛṣṇasya lakṣyate hi yaḥ
sa eva kathyate vijñair
avatāro hareḥ kila',
    E'tat-tat-kāla-gato
bhāvaḥ kṛṣṇasya lakṣyate hi yaḥ
sa eva kathyate vijñair
avatāro hareḥ kila', E'тат-тат-ка̄ла-ґато
бга̄вах̣ кр̣шн̣асйа лакшйате хі йах̣
са ева катхйате віджн̃аір
авата̄ро харех̣ кіла',
    E'', E'',
    E'Some learned scholars have divided this period of time into twenty-four and
ascertained twenty-four incarnations. Yet there are others who have divided it into
eighteen with the correspond­ing number of incarnations.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'kenacid bhajyate
kālaś caturviḿśatidhā vidā
aṣṭādaśa-vibhāge
vā cāvatāra-vibhāgaśaḥ', E'kenacid bhajyate
kālaś caturviḿśatidhā vidā
aṣṭādaśa-vibhāge
vā cāvatāra-vibhāgaśaḥ',
    E'kenacid bhajyate
kālaś caturviḿśatidhā vidā
aṣṭādaśa-vibhāge
vā cāvatāra-vibhāgaśaḥ', E'кеначід бгаджйате
ка̄лаш́ чатурвіḿш́атідга̄ віда̄
ашт̣а̄даш́а-вібга̄ґе
ва̄ ча̄вата̄ра-вібга̄ґаш́ах̣',
    E'', E'',
    E'Some people say that the Supreme Lord is omnipotent, therefore He may sometimes
incarnate by His inconceivable energy in a material body, and all incarnations
can therefore be accepted simply as historical incidents. According to the
opinion of swanlike Vaisnavas, this statement is extremely unreasonable because
it is impossible for Lord Krsna to accept a material body and perform material
activities. Such action would be insignificant and abomi­nable for Him. But His
appearance and pastimes in the hearts of the realized living entities'' are
accepted by both the sadhus and Krsna.
14-15)
As the sun cannot enjoy its shadow, Krsna cannot enjoy maya. What to speak of
Krsna enjoying maya. He is not even seen by persons who are under the shelter
of maya. Yet simply by the mercy of Krsna one can easily see Him through samadhi.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'māyayā
ramaṇaḿ tucchaḿ kṛṣṇasya
cit-svarūpiṇaḥ
jīvasya
tattva-vijñāne ramaṇaḿ tasya sammatam', E'māyayā
ramaṇaḿ tucchaḿ kṛṣṇasya
cit-svarūpiṇaḥ
jīvasya
tattva-vijñāne ramaṇaḿ tasya sammatam',
    E'māyayā
ramaṇaḿ tucchaḿ kṛṣṇasya
cit-svarūpiṇaḥ
jīvasya
tattva-vijñāne ramaṇaḿ tasya sammatam', E'ма̄йайа̄
раман̣аḿ туччхаḿ кр̣шн̣асйа
чіт-сварӯпін̣ах̣
джı̄васйа
таттва-віджн̃а̄не раман̣аḿ тасйа самматам',
    E'', E'',
    E'The pure activities of Krsna have been perceived through the samadhi of
swanlike persons like Vyasadeva. Krsna''s activities are not exactly historical
like those of people under the clutches of maya, because Krsna''s activities are
not limited to any time or place. Nor are His activities comparable with the
activities of ordinary people.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'chāyāyāḥ
sūrya-sambhogo yathā na ghaṭate kvacit
māyāyāḥ
kṛṣṇa-sambhogas tathā na syāt kadācana', E'chāyāyāḥ
sūrya-sambhogo yathā na ghaṭate kvacit
māyāyāḥ
kṛṣṇa-sambhogas tathā na syāt kadācana',
    E'chāyāyāḥ
sūrya-sambhogo yathā na ghaṭate kvacit
māyāyāḥ
kṛṣṇa-sambhogas tathā na syāt kadācana', E'чха̄йа̄йа̄х̣
сӯрйа-самбгоґо йатха̄ на ґгат̣ате квачіт
ма̄йа̄йа̄х̣
кр̣шн̣а-самбгоґас татха̄ на сйа̄т када̄чана',
    E'', E'',
    E'After careful consideration and by the mercy of Sri Krsna Caitanya we will
herein briefly describe the activities of Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'māyāśritasya
jīvasya hṛdaye kṛṣṇa-bhāvanā
kevalaḿ
kṛpayā tasya nānyathā hi kadācana', E'māyāśritasya
jīvasya hṛdaye kṛṣṇa-bhāvanā
kevalaḿ
kṛpayā tasya nānyathā hi kadācana',
    E'māyāśritasya
jīvasya hṛdaye kṛṣṇa-bhāvanā
kevalaḿ
kṛpayā tasya nānyathā hi kadācana', E'ма̄йа̄ш́рітасйа
джı̄васйа хр̣дайе кр̣шн̣а-бга̄вана̄
кевалаḿ
кр̣пайа̄ тасйа на̄нйатха̄ хі када̄чана',
    E'', E'',
    E'The explanation on the science of Krsna that is presented in this book may be
applied to His various incarnations. The conclu­sion is that Krsna is the root
cause and seed of all incarnations. He is eternally enjoying pastimes with the
living entities as the Super-soul. The Supersoul reciprocates according to the
mood and realization a living entity acquires while traveling on the path of
fruitive activities. But Krsna does not personally appear until spiri­tual
attachment arises in the hearts of the living entities. Therefore all other
incarnations appear from the Supersoul, of whom Krsna is the original seed.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'śrī-kṛṣṇa-caritaḿ
sākṣāt samādhi-darśitaḿ kila
na tatra kalpanā
mithyā netihāso jaḍāśritaḥ', E'śrī-kṛṣṇa-caritaḿ
sākṣāt samādhi-darśitaḿ kila
na tatra kalpanā
mithyā netihāso jaḍāśritaḥ',
    E'śrī-kṛṣṇa-caritaḿ
sākṣāt samādhi-darśitaḿ kila
na tatra kalpanā
mithyā netihāso jaḍāśritaḥ', E'ш́рı̄-кр̣шн̣а-чарітаḿ
са̄кша̄т сама̄дгі-дарш́ітаḿ кіла
на татра калпана̄
мітхйа̄ нетіха̄со джад̣а̄ш́рітах̣',
    E'', E'',
    E'We appeal to the swanlike Vaisnavas to ignore the imperfections of these verses
and happily relish Krsna''s activities, which are the essence and wealth of all
living entities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'vayaḿ tu
caritaḿ tasya varṇayāmo samāsataḥ
tattvataḥ
kṛpayā kṛṣṇa-caitanyasya mahātmanaḥ', E'vayaḿ tu
caritaḿ tasya varṇayāmo samāsataḥ
tattvataḥ
kṛpayā kṛṣṇa-caitanyasya mahātmanaḥ',
    E'vayaḿ tu
caritaḿ tasya varṇayāmo samāsataḥ
tattvataḥ
kṛpayā kṛṣṇa-caitanyasya mahātmanaḥ', E'вайаḿ ту
чарітаḿ тасйа варн̣айа̄мо сама̄сатах̣
таттватах̣
кр̣пайа̄ кр̣шн̣а-чаітанйасйа маха̄тманах̣',
    E'', E'',
    E'Regarding these descriptions of Krsna''s activities, despite much effort we were
unable to restrain our intelligence from considerations of time and space,
because we are not free from the pangs of material life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sarveṣām
avatārāṇām artho bodhyo yathā mayā
kevalaḿ
kṛṣṇa-tattvasya cārtho vijñāpito''dhunā', E'sarveṣām
avatārāṇām artho bodhyo yathā mayā
kevalaḿ
kṛṣṇa-tattvasya cārtho vijñāpito''dhunā',
    E'sarveṣām
avatārāṇām artho bodhyo yathā mayā
kevalaḿ
kṛṣṇa-tattvasya cārtho vijñāpito''dhunā', E'сарвеша̄м
авата̄ра̄н̣а̄м артхо бодгйо йатха̄ майа̄
кевалаḿ
кр̣шн̣а-таттвасйа ча̄ртхо віджн̃а̄піто''дгуна̄',
    E'', E'',
    E'Still, after drinking the shower of mercy from Sri Gauracandra the son of Saci
and our only guide, let whatever little we have described herein enter the
hearts of all living entities to fill the absence of krsna-rasa; that is, let
everyone relish the transcenden­tal mellows in relationship with Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'vaiṣṇavāḥ
sāra-sampannās tyaktvā vākyam alaḿ mama
gṛhṇantu
sāra-sampattiḿ śrī-kṛṣṇa-caritaḿ
mudā', E'vaiṣṇavāḥ
sāra-sampannās tyaktvā vākyam alaḿ mama
gṛhṇantu
sāra-sampattiḿ śrī-kṛṣṇa-caritaḿ
mudā',
    E'vaiṣṇavāḥ
sāra-sampannās tyaktvā vākyam alaḿ mama
gṛhṇantu
sāra-sampattiḿ śrī-kṛṣṇa-caritaḿ
mudā', E'ваішн̣ава̄х̣
са̄ра-сампанна̄с тйактва̄ ва̄кйам алаḿ мама
ґр̣хн̣анту
са̄ра-сампаттіḿ ш́рı̄-кр̣шн̣а-чарітаḿ
муда̄',
    E'', E'',
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
    E'vayaḿ tu
bahu-yatnena na śaktā deśa-kālataḥ
samuddhartuḿ
manīṣāḿ naḥ prapañca-pīḍitā
yataḥ', E'vayaḿ tu
bahu-yatnena na śaktā deśa-kālataḥ
samuddhartuḿ
manīṣāḿ naḥ prapañca-pīḍitā
yataḥ',
    E'vayaḿ tu
bahu-yatnena na śaktā deśa-kālataḥ
samuddhartuḿ
manīṣāḿ naḥ prapañca-pīḍitā
yataḥ', E'вайаḿ ту
баху-йатнена на ш́акта̄ деш́а-ка̄латах̣
самуддгартуḿ
манı̄ша̄ḿ нах̣ прапан̃ча-пı̄д̣іта̄
йатах̣',
    E'', E'',
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
    E'tathāpi
gauracandrasya kṛpā-vāri-niṣevaṇāt
sarveṣāḿ
hṛdaye kṛṣṇa-rasābhāvo nivartatām', E'tathāpi
gauracandrasya kṛpā-vāri-niṣevaṇāt
sarveṣāḿ
hṛdaye kṛṣṇa-rasābhāvo nivartatām',
    E'tathāpi
gauracandrasya kṛpā-vāri-niṣevaṇāt
sarveṣāḿ
hṛdaye kṛṣṇa-rasābhāvo nivartatām', E'татха̄пі
ґаурачандрасйа кр̣па̄-ва̄рі-нішеван̣а̄т
сарвеша̄ḿ
хр̣дайе кр̣шн̣а-раса̄бга̄во нівартата̄м',
    E'', E'',
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


  -- Chapter 4: Krsna Lila Varnanam Part 1
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Krsna Lila Varnanam Part 1', E'Крішна-ліла-варнанам (частина 1)', 'verses', true)
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
    E'yadā
hi jīva-vijñānaḿ pūrṇam āsīn
mahī-tale
kramordhva-gati-rītyā
ca dvāpare bhārate kila', E'yadā
hi jīva-vijñānaḿ pūrṇam āsīn
mahī-tale
kramordhva-gati-rītyā
ca dvāpare bhārate kila',
    E'yadā
hi jīva-vijñānaḿ pūrṇam āsīn
mahī-tale
kramordhva-gati-rītyā
ca dvāpare bhārate kila', E'йада̄
хі джı̄ва-віджн̃а̄наḿ пӯрн̣ам а̄сı̄н
махı̄-тале
крамордгва-ґаті-рı̄тйа̄
ча два̄паре бга̄рате кіла',
    E'', E'',
    E'1-2)
Two types of persons, the kanistha-adhikaris and the uttama-adhikaris, are
eligible for understanding the science of Krsna. The madhyama-adhikaris cannot
understand this science due to their doubting nature. Madhyama-adhikaris are
known as either impersonalists or worshipers of the supreme controller. If they
are fortunate, then by the strength of devotees'' association they be¬come
uttama-adhikaris and also realize the sweetness of Krsna''s activities through
the process of samadhi. Although by the mercy of Krsna, living entities can
easily attain the stage of uttama-adhikari, people generally have greater faith
in arguments arising from the samvit aspect of the external energy and disregard
the simple process of samadhi as superstitious. If they become faithful, however,
then they first become kanistha-adhikaris, and later, by the association of
devotees, by following the devotees'' instructions, and by gradual advancement,
they can certainly become uttama-adhikaris. But if they are doubtful from the
beginning, then either they become fortunate and cross the ocean of arguments
to become uttama-adhikaris or they become more averse to the Lord fall away
from the path of liberation. Therefore when the experienced knowledge of the
living entities attained maturity by faithful discussion, then at the end of
Dvapara-yuga in the pious land of Bharata-varsa in Mathura, the personification
of Absolute knowledge, King Vasudeva, the personification of pure goodness,
took birth.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tadā
sattvaḿ viśuddhaḿ yad vasudeva itīritaḥ
brahma-jñāna-vibhāge
hi mathurāyām ajāyata', E'tadā
sattvaḿ viśuddhaḿ yad vasudeva itīritaḥ
brahma-jñāna-vibhāge
hi mathurāyām ajāyata',
    E'tadā
sattvaḿ viśuddhaḿ yad vasudeva itīritaḥ
brahma-jñāna-vibhāge
hi mathurāyām ajāyata', E'тада̄
саттваḿ віш́уддгаḿ йад васудева ітı̄рітах̣
брахма-джн̃а̄на-вібга̄ґе
хі матхура̄йа̄м аджа̄йата',
    E'', E'',
    E'Vasudeva appeared in a family of devotees and married Devaki, the so-called
sister of Kamsa, who was the personification of atheism.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sātvatāḿ
vaḿśa-sambhūto vasudevo mano-mayīm
devakīm
agrahīt kaḿsa-nāstikya-bhaginīḿ satīm', E'sātvatāḿ
vaḿśa-sambhūto vasudevo mano-mayīm
devakīm
agrahīt kaḿsa-nāstikya-bhaginīḿ satīm',
    E'sātvatāḿ
vaḿśa-sambhūto vasudevo mano-mayīm
devakīm
agrahīt kaḿsa-nāstikya-bhaginīḿ satīm', E'са̄твата̄ḿ
ваḿш́а-самбгӯто васудево мано-майı̄м
девакı̄м
аґрахı̄т каḿса-на̄стікйа-бгаґінı̄ḿ сатı̄м',
    E'', E'',
    E'Fearing the Lord''s advent from this couple, the wretched Kamsa of the Bhoja
dynasty arrested them and put them in the jail of remembrance. It is understood
that the descendants of the Yadu dynasty were all devotees, while the
descendants of the Bhoja dynasty were all extremely argumentative and averse to
the Lord.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'bhagavad-bhāva-sambhūteḥ
śańkayā bhoja-pāḿśulaḥ
arundhad
dampatī tatra kārāgāre sudurmadaḥ', E'bhagavad-bhāva-sambhūteḥ
śańkayā bhoja-pāḿśulaḥ
arundhad
dampatī tatra kārāgāre sudurmadaḥ',
    E'bhagavad-bhāva-sambhūteḥ
śańkayā bhoja-pāḿśulaḥ
arundhad
dampatī tatra kārāgāre sudurmadaḥ', E'бгаґавад-бга̄ва-самбгӯтех̣
ш́аńкайа̄ бгоджа-па̄ḿш́улах̣
арундгад
дампатı̄ татра ка̄ра̄ґа̄ре судурмадах̣',
    E'', E'',
    E'That couple gradually begot six sons such as Yasa and Kirti, but Kamsa, who is
averse to the Lord, killed them in their childhood.
6) Sri
Baladeva is decorated with service to the Lord and is the transcendental
reservoir of all living entities. He is their seventh son.
7) Sri
Baladeva is the transcendental reservoir of all living entities, and He
appeared in the womb of Devaki, who represents the heart filled with knowledge.
8) He
was transferred to the faithful abode of Vraja and entered the firmly devoted
heart of Rohini. News of Devaki''s miscarriage was spread at this time.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'yaśaḥ-kīrty-ādayaḥ
putrāḥ ṣaḍ āsan kramaśas tayoḥ
te sarve
nihatā bālye kaḿseneśa-virodhinā', E'yaśaḥ-kīrty-ādayaḥ
putrāḥ ṣaḍ āsan kramaśas tayoḥ
te sarve
nihatā bālye kaḿseneśa-virodhinā',
    E'yaśaḥ-kīrty-ādayaḥ
putrāḥ ṣaḍ āsan kramaśas tayoḥ
te sarve
nihatā bālye kaḿseneśa-virodhinā', E'йаш́ах̣-кı̄ртй-а̄дайах̣
путра̄х̣ шад̣ а̄сан крамаш́ас тайох̣
те сарве
ніхата̄ ба̄лйе каḿсенеш́а-віродгіна̄',
    E'', E'',
    E'Right after the appearance of the transcendental reservoir of all living
entities, awareness of the Lord appeared in the heart of the living entities. Thereafter
the eighth son, the Supreme Person¬ality of Godhead, appeared as Narayana with
full opulences. The greatly heroic Lord appeared with a desire to vanquish
Kamsa, who was the personification of atheism.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jīva-tattvaḿ
viśuddhaḿ yad bhagavad-dāsya-bhūṣaṇam
tad eva
bhagavān rāmaḥ saptame samajāyata', E'jīva-tattvaḿ
viśuddhaḿ yad bhagavad-dāsya-bhūṣaṇam
tad eva
bhagavān rāmaḥ saptame samajāyata',
    E'jīva-tattvaḿ
viśuddhaḿ yad bhagavad-dāsya-bhūṣaṇam
tad eva
bhagavān rāmaḥ saptame samajāyata', E'джı̄ва-таттваḿ
віш́уддгаḿ йад бгаґавад-да̄сйа-бгӯшан̣ам
тад ева
бгаґава̄н ра̄мах̣ саптаме самаджа̄йата',
    E'', E'',
    E'The Lord in His own form as Krsna was brought to Vraja, which is created by the
sandhim aspect of the spiritual potency. The root foundation of this land is
faith. The purport is that this land does not exist in argument or speculative
knowledge; it exists in faith.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jñānāśraya-maye
citte śuddha-jīvaḥ pravartate
kaḿsasya
kāryam āśańkya sa yāti vraja-mandiram', E'jñānāśraya-maye
citte śuddha-jīvaḥ pravartate
kaḿsasya
kāryam āśańkya sa yāti vraja-mandiram',
    E'jñānāśraya-maye
citte śuddha-jīvaḥ pravartate
kaḿsasya
kāryam āśańkya sa yāti vraja-mandiram', E'джн̃а̄на̄ш́райа-майе
чітте ш́уддга-джı̄вах̣ правартате
каḿсасйа
ка̄рйам а̄ш́аńкйа са йа̄ті враджа-мандірам',
    E'', E'',
    E'Speculative knowledge or renunciation is not found there. The most blissful son
of Nanda is the only authority there. There is no consideration of superiority
or inferiority of the different castes in that abode. That is why He appeared
in the family of cowherd men. He always engaged in tending and protecting the
cows, as such activities are devoid of opulence and full of sweetness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tathā
śraddhā-maye citte rohiṇyāḿ ca viśaty asau
devakī-garbha-nāśas
tu jñāpitaś cābhavat tadā', E'tathā
śraddhā-maye citte rohiṇyāḿ ca viśaty asau
devakī-garbha-nāśas
tu jñāpitaś cābhavat tadā',
    E'tathā
śraddhā-maye citte rohiṇyāḿ ca viśaty asau
devakī-garbha-nāśas
tu jñāpitaś cābhavat tadā', E'татха̄
ш́раддга̄-майе чітте рохін̣йа̄ḿ ча віш́атй асау
девакı̄-ґарбга-на̄ш́ас
ту джн̃а̄піташ́ ча̄бгават тада̄',
    E'', E'',
    E'The inferior energy, Maya, who was begotten by the blissful mother Yasoda, the
wife of Nanda, was taken out of Vraja by Vasudeva. The mundane conception that
is inherent in the condi¬tioned souls'' impression of the spiritual abode is
destroyed by the arrival of Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'aṣṭame
bhagavān sākṣād aiśvaryākhyāḿ dadhat
tanum
prādurāsīn
mahāvīryaḥ kaḿsa-dhvaḿsa-cikīrṣayā', E'aṣṭame
bhagavān sākṣād aiśvaryākhyāḿ dadhat
tanum
prādurāsīn
mahāvīryaḥ kaḿsa-dhvaḿsa-cikīrṣayā',
    E'aṣṭame
bhagavān sākṣād aiśvaryākhyāḿ dadhat
tanum
prādurāsīn
mahāvīryaḥ kaḿsa-dhvaḿsa-cikīrṣayā', E'ашт̣аме
бгаґава̄н са̄кша̄д аіш́варйа̄кхйа̄ḿ дадгат
танум
пра̄дура̄сı̄н
маха̄вı̄рйах̣ каḿса-дгваḿса-чікı̄ршайа̄',
    E'', E'',
    E'The inconceivable Supreme Lord, Sri Krsna, and the transcendental reservoir of
all living entities, Balarama, grew up together in Gokula, which is filled with
the rays of the transcendental sun of pure love.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'vraja-bhūmiḿ
tadānītaḥ svarūpeṇābhavad dhariḥ
sandhinī-nirmitā
sā tu viśvāso bhittir eva ca', E'vraja-bhūmiḿ
tadānītaḥ svarūpeṇābhavad dhariḥ
sandhinī-nirmitā
sā tu viśvāso bhittir eva ca',
    E'vraja-bhūmiḿ
tadānītaḥ svarūpeṇābhavad dhariḥ
sandhinī-nirmitā
sā tu viśvāso bhittir eva ca', E'враджа-бгӯміḿ
тада̄нı̄тах̣ сварӯпен̣а̄бгавад дгаріх̣
сандгінı̄-нірміта̄
са̄ ту віш́ва̄со бгіттір ева ча',
    E'', E'',
    E'With a desire to kill Krsna, the atheist Kamsa sent Putana, the child-killer,
to Vraja. Deceiving Krsna with motherly affection, Putana offered Him her
breast-milk and was killed by Krsna''s prowess.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'na
jñānaḿ na ca vairāgyaḿ tatra dṛśyaḿ
bhavet kadā
tatraiva
nanda-gopaḥ syād ānanda iva mūrtimān', E'na
jñānaḿ na ca vairāgyaḿ tatra dṛśyaḿ
bhavet kadā
tatraiva
nanda-gopaḥ syād ānanda iva mūrtimān',
    E'na
jñānaḿ na ca vairāgyaḿ tatra dṛśyaḿ
bhavet kadā
tatraiva
nanda-gopaḥ syād ānanda iva mūrtimān', E'на
джн̃а̄наḿ на ча ваіра̄ґйаḿ татра др̣ш́йаḿ
бгавет када̄
татраіва
нанда-ґопах̣ сйа̄д а̄нанда іва мӯртіма̄н',
    E'', E'',
    E'Trnavarta, the personification of argument, was also killed by the Lord''s
prowess. Thereafter the Lord broke the ass-like Sakata, who only carried loads.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'ullāsa-rūpiṇī
tasya yaśodā sahadharmiṇī
ajījanan
mahāmāyāḿ yāḿ śaurir nītavān
vrajāt', E'ullāsa-rūpiṇī
tasya yaśodā sahadharmiṇī
ajījanan
mahāmāyāḿ yāḿ śaurir nītavān
vrajāt',
    E'ullāsa-rūpiṇī
tasya yaśodā sahadharmiṇī
ajījanan
mahāmāyāḿ yāḿ śaurir nītavān
vrajāt', E'улла̄са-рӯпін̣ı̄
тасйа йаш́ода̄ сахадгармін̣ı̄
аджı̄джанан
маха̄ма̄йа̄ḿ йа̄ḿ ш́аурір нı̄тава̄н
враджа̄т',
    E'', E'',
    E'Sri Krsna showed His mother the whole universe when He opened His mouth, but
mother Yasoda could not accept Krsna''s opulence due to being overwhelmed by the
spiritual potency''s nescience that nourishes attachment. The transcendental
devotees are so much overwhelmed by the Lord''s sweetness that they can¬not
accept the Lord''s opulence in spite of its presence. This nescience, however,
is not a material product.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'kramaśo
vardhate kṛṣṇaḥ rāmeṇa saha gokule
viśuddha-prema-sūryasya
praśānta-kara-sańkule', E'kramaśo
vardhate kṛṣṇaḥ rāmeṇa saha gokule
viśuddha-prema-sūryasya
praśānta-kara-sańkule',
    E'kramaśo
vardhate kṛṣṇaḥ rāmeṇa saha gokule
viśuddha-prema-sūryasya
praśānta-kara-sańkule', E'крамаш́о
вардгате кр̣шн̣ах̣ ра̄мен̣а саха ґокуле
віш́уддга-према-сӯрйасйа
праш́а̄нта-кара-саńкуле',
    E'', E'',
    E'After seeing Krsna''s childish mischief, in the form of stealing the heart (in
the form of butter), Yasoda, the form of joyfulness, labored in vain to bind
Krsna with ropes.
18) He
who has no material form was bound by Yasoda with only a thread of love; One
cannot attain the perfection of binding Krsna with material ropes.
19) In
the course of Krsna''s childhood pastimes, the two sons of Kuvera were easily
delivered from their forms as trees.
20) We
can understand two instructions from the deliverance of the Yamalarjuna trees.
The first is that by a moment''s association with a devotee, the living entity
is freed from bondage. Secondly, by the association of nondevotees, even the
demigods become materialistic and engage in sinful activities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'preritā
pūtanā tatra kaḿsena bāla-ghātinī
mātṛ-vyāja-svarūpā
sā mamāra kṛṣṇa-tejasā', E'preritā
pūtanā tatra kaḿsena bāla-ghātinī
mātṛ-vyāja-svarūpā
sā mamāra kṛṣṇa-tejasā',
    E'preritā
pūtanā tatra kaḿsena bāla-ghātinī
mātṛ-vyāja-svarūpā
sā mamāra kṛṣṇa-tejasā', E'преріта̄
пӯтана̄ татра каḿсена ба̄ла-ґга̄тінı̄
ма̄тр̣-вйа̄джа-сварӯпа̄
са̄ мама̄ра кр̣шн̣а-теджаса̄',
    E'', E'',
    E'The child Krsna entered the forest with His friends in order to | tend the
cows. This means that the pure living entities, who are overwhelmed with the
nescience of the spiritual potency, attain the form of calves due to being
fixed in feelings of subordination to Krsna. Vatsasura, the form of boyhood
offenses, was killed in the pasture grounds.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tarka-rūpas
tṛṇāvartaḥ kṛṣṇa-bhāvān
mamāra ha
bhāravāhi-svarūpaḿ
tu babhañja śakaṭaḿ hariḥ', E'tarka-rūpas
tṛṇāvartaḥ kṛṣṇa-bhāvān
mamāra ha
bhāravāhi-svarūpaḿ
tu babhañja śakaṭaḿ hariḥ',
    E'tarka-rūpas
tṛṇāvartaḥ kṛṣṇa-bhāvān
mamāra ha
bhāravāhi-svarūpaḿ
tu babhañja śakaṭaḿ hariḥ', E'тарка-рӯпас
тр̣н̣а̄вартах̣ кр̣шн̣а-бга̄ва̄н
мама̄ра ха
бга̄рава̄хі-сварӯпаḿ
ту бабган̃джа ш́акат̣аḿ харіх̣',
    E'', E'',
    E'Bakasura, who was maintained by Kamsa and who personified cheating religion,
was killed by the purely intelligent Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'ānanābhyantare
kṛṣṇo mātre pradarśayan jagat
adarśayad
avidyāḿ hi cic-chaktir atipoṣikām', E'ānanābhyantare
kṛṣṇo mātre pradarśayan jagat
adarśayad
avidyāḿ hi cic-chaktir atipoṣikām',
    E'ānanābhyantare
kṛṣṇo mātre pradarśayan jagat
adarśayad
avidyāḿ hi cic-chaktir atipoṣikām', E'а̄нана̄бгйантаре
кр̣шн̣о ма̄тре прадарш́айан джаґат
адарш́айад
авідйа̄ḿ хі чіч-чхактір атіпошіка̄м',
    E'', E'',
    E'The snake named Agha, who was the form of cruelty, was subdued. After this, the
Lord had a picnic of simplicity.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'dṛṣṭvā
ca bāla-cāpalyaḿ gopī
sūllāsa-rūpiṇī
bandhanāya
manaś cakre rajjvā kṛṣṇasya sā
vṛthā', E'dṛṣṭvā
ca bāla-cāpalyaḿ gopī
sūllāsa-rūpiṇī
bandhanāya
manaś cakre rajjvā kṛṣṇasya sā
vṛthā',
    E'dṛṣṭvā
ca bāla-cāpalyaḿ gopī
sūllāsa-rūpiṇī
bandhanāya
manaś cakre rajjvā kṛṣṇasya sā
vṛthā', E'др̣шт̣ва̄
ча ба̄ла-ча̄палйаḿ ґопı̄
сӯлла̄са-рӯпін̣ı̄
бандгана̄йа
манаш́ чакре раджджва̄ кр̣шн̣асйа са̄
вр̣тха̄',
    E'', E'',
    E'Meanwhile, the four-headed Brahma, the creator of all planets and speaker of
the four Vedas, became overwhelmed by Krsna''s external energy and stole the
calves and cowherd boys.
25) By
this incident, Krsna displayed complete domination in His supreme sweetness.
Although merely a cowherd boy, He showed His complete control over the creator
of the universe. It is also understood from this pastime that the dearmost
person of the spiritual world, Krsna, is not controlled by any regulation.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'na yasya
parimāṇaḿ vai tasyaiva bandhanaḿ kila
kevalaḿ
prema-sūtreṇa cakāra nanda-gehinī', E'na yasya
parimāṇaḿ vai tasyaiva bandhanaḿ kila
kevalaḿ
prema-sūtreṇa cakāra nanda-gehinī',
    E'na yasya
parimāṇaḿ vai tasyaiva bandhanaḿ kila
kevalaḿ
prema-sūtreṇa cakāra nanda-gehinī', E'на йасйа
паріма̄н̣аḿ ваі тасйаіва бандганаḿ кіла
кевалаḿ
према-сӯтрен̣а чака̄ра нанда-ґехінı̄',
    E'', E'',
    E'After Brahma stole the boys and calves, the Lord personally manifested Himself
as the boys and calves and easily continued on with His pastimes. From this it
is clearly understood that even with the destruction of the material and
spiritual worlds, the opulence of Krsna is never hampered. No one can surpass
Krsna''s abilities, no matter how capable he is.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'bāla-krīḍā-prasańgena
kṛṣṇasya bandha-chedanam
abhavad
vārkṣa-bhāvāt tu nimeṣād deva-putrayoḥ', E'bāla-krīḍā-prasańgena
kṛṣṇasya bandha-chedanam
abhavad
vārkṣa-bhāvāt tu nimeṣād deva-putrayoḥ',
    E'bāla-krīḍā-prasańgena
kṛṣṇasya bandha-chedanam
abhavad
vārkṣa-bhāvāt tu nimeṣād deva-putrayoḥ', E'ба̄ла-крı̄д̣а̄-прасаńґена
кр̣шн̣асйа бандга-чхеданам
абгавад
ва̄ркша-бга̄ва̄т ту німеша̄д дева-путрайох̣',
    E'', E'',
    E'Dhenukasura, who personifies the ass of blunt judgment, was killed by Baladeva,
the transcendental reservoir of all living enti¬ties.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'anena
darśitaḿ sādhu-sańgasya phalam uttamam
devo''pi
jaḍatāḿ yāti kukarma-nirato yadi', E'anena
darśitaḿ sādhu-sańgasya phalam uttamam
devo''pi
jaḍatāḿ yāti kukarma-nirato yadi',
    E'anena
darśitaḿ sādhu-sańgasya phalam uttamam
devo''pi
jaḍatāḿ yāti kukarma-nirato yadi', E'анена
дарш́ітаḿ са̄дгу-саńґасйа пхалам уттамам
дево''пі
джад̣ата̄ḿ йа̄ті кукарма-нірато йаді',
    E'', E'',
    E'The Kaliya snake, the personification of malice, polluted the Yamuna waters,
which are spiritual liquid. The Lord tortured and banished him.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'vatsānāḿ
cāraṇe kṛṣṇaḥ sakhibhir yāti
kānanam
tathā
vatsāsuraḿ hanti bāla-doṣam aghaḿ bhṛśam', E'vatsānāḿ
cāraṇe kṛṣṇaḥ sakhibhir yāti
kānanam
tathā
vatsāsuraḿ hanti bāla-doṣam aghaḿ bhṛśam',
    E'vatsānāḿ
cāraṇe kṛṣṇaḥ sakhibhir yāti
kānanam
tathā
vatsāsuraḿ hanti bāla-doṣam aghaḿ bhṛśam', E'ватса̄на̄ḿ
ча̄ран̣е кр̣шн̣ах̣ сакхібгір йа̄ті
ка̄нанам
татха̄
ватса̄сураḿ ханті ба̄ла-дошам аґгаḿ бгр̣ш́ам',
    E'', E'',
    E'The formidable forest fire, the form of quarrel amongst Vrsnava sampradayas,
was swallowed by the Lord in order to Protect the land of Vraja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tadā
tu dharma-kāpaṭya-svarūpo baka-rūpa-dhṛk
kṛṣṇeṇa
śuddha-buddhena nihataḥ kaḿsa-pālitaḥ', E'tadā
tu dharma-kāpaṭya-svarūpo baka-rūpa-dhṛk
kṛṣṇeṇa
śuddha-buddhena nihataḥ kaḿsa-pālitaḥ',
    E'tadā
tu dharma-kāpaṭya-svarūpo baka-rūpa-dhṛk
kṛṣṇeṇa
śuddha-buddhena nihataḥ kaḿsa-pālitaḥ', E'тада̄
ту дгарма-ка̄пат̣йа-сварӯпо бака-рӯпа-дгр̣к
кр̣шн̣ен̣а
ш́уддга-буддгена ніхатах̣ каḿса-па̄літах̣',
    E'', E'',
    E'The rascal Pralambasura, who stole away the reservoir of all living entities
and who personified the covered form of Buddhist philosophy, Mayavada, was sent
by the atheist Kamsa and killed by Baladeva.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'agho''pi
marditaḥ sarpo nṛśaḿsatva-svarūpakaḥ
yamunā-puline
kṛṣṇo bubhuje sakhibhis tadā', E'agho''pi
marditaḥ sarpo nṛśaḿsatva-svarūpakaḥ
yamunā-puline
kṛṣṇo bubhuje sakhibhis tadā',
    E'agho''pi
marditaḥ sarpo nṛśaḿsatva-svarūpakaḥ
yamunā-puline
kṛṣṇo bubhuje sakhibhis tadā', E'аґго''пі
мардітах̣ сарпо нр̣ш́аḿсатва-сварӯпаках̣
йамуна̄-пуліне
кр̣шн̣о бубгудже сакхібгіс тада̄',
    E'', E'',
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
    E'gopāla-bālakān
vatsān corayitvā caturmukhaḥ
kṛṣṇasya
māyayā mugdho babhūva jagatāḿ vidhiḥ', E'gopāla-bālakān
vatsān corayitvā caturmukhaḥ
kṛṣṇasya
māyayā mugdho babhūva jagatāḿ vidhiḥ',
    E'gopāla-bālakān
vatsān corayitvā caturmukhaḥ
kṛṣṇasya
māyayā mugdho babhūva jagatāḿ vidhiḥ', E'ґопа̄ла-ба̄лака̄н
ватса̄н чорайітва̄ чатурмукхах̣
кр̣шн̣асйа
ма̄йайа̄ муґдго бабгӯва джаґата̄ḿ відгіх̣',
    E'', E'',
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
    E'anena
darśitā kṛṣṇa-mādhurye prabhutā''malā
na
kṛṣṇo vidhi-bādhyo hi preyān
kṛṣṇaḥ svataś citām', E'anena
darśitā kṛṣṇa-mādhurye prabhutā''malā
na
kṛṣṇo vidhi-bādhyo hi preyān
kṛṣṇaḥ svataś citām',
    E'anena
darśitā kṛṣṇa-mādhurye prabhutā''malā
na
kṛṣṇo vidhi-bādhyo hi preyān
kṛṣṇaḥ svataś citām', E'анена
дарш́іта̄ кр̣шн̣а-ма̄дгурйе прабгута̄''мала̄
на
кр̣шн̣о відгі-ба̄дгйо хі прейа̄н
кр̣шн̣ах̣ сваташ́ чіта̄м',
    E'', E'',
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
    E'cid-acid-viśva-nāśo''pi
kṛṣṇaiśvaryaḿ na kuṇṭhitam
na ko''pi
kṛṣṇa-sāmarthya-samudra-lańghane kṣamaḥ', E'cid-acid-viśva-nāśo''pi
kṛṣṇaiśvaryaḿ na kuṇṭhitam
na ko''pi
kṛṣṇa-sāmarthya-samudra-lańghane kṣamaḥ',
    E'cid-acid-viśva-nāśo''pi
kṛṣṇaiśvaryaḿ na kuṇṭhitam
na ko''pi
kṛṣṇa-sāmarthya-samudra-lańghane kṣamaḥ', E'чід-ачід-віш́ва-на̄ш́о''пі
кр̣шн̣аіш́варйаḿ на кун̣т̣хітам
на ко''пі
кр̣шн̣а-са̄мартхйа-самудра-лаńґгане кшамах̣',
    E'', E'',
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
    E'sthūla-buddhi-svarūpo''yaḿ
gardabho dhenukāsuraḥ
naṣṭo''bhūd
baladevena śuddha-jīvena durmatiḥ', E'sthūla-buddhi-svarūpo''yaḿ
gardabho dhenukāsuraḥ
naṣṭo''bhūd
baladevena śuddha-jīvena durmatiḥ',
    E'sthūla-buddhi-svarūpo''yaḿ
gardabho dhenukāsuraḥ
naṣṭo''bhūd
baladevena śuddha-jīvena durmatiḥ', E'стхӯла-буддгі-сварӯпо''йаḿ
ґардабго дгенука̄сурах̣
нашт̣о''бгӯд
баладевена ш́уддга-джı̄вена дурматіх̣',
    E'', E'',
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
    E'krūrātmā
kālīyaḥ sarpaḥ salilaḿ cid-dravātmakam
sanduṣya
yāmunaḿ pāpo hariṇā lāñchito gataḥ', E'krūrātmā
kālīyaḥ sarpaḥ salilaḿ cid-dravātmakam
sanduṣya
yāmunaḿ pāpo hariṇā lāñchito gataḥ',
    E'krūrātmā
kālīyaḥ sarpaḥ salilaḿ cid-dravātmakam
sanduṣya
yāmunaḿ pāpo hariṇā lāñchito gataḥ', E'крӯра̄тма̄
ка̄лı̄йах̣ сарпах̣ салілаḿ чід-драва̄тмакам
сандушйа
йа̄мунаḿ па̄по харін̣а̄ ла̄н̃чхіто ґатах̣',
    E'', E'',
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


  -- Verse 29
  INSERT INTO public.verses (
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
    E'parampara-vivādātmā
dāvānalo bhayańkaraḥ
bhakṣito
hariṇā sākṣād
vraja-dhāma-śubhārthinā', E'parampara-vivādātmā
dāvānalo bhayańkaraḥ
bhakṣito
hariṇā sākṣād
vraja-dhāma-śubhārthinā',
    E'parampara-vivādātmā
dāvānalo bhayańkaraḥ
bhakṣito
hariṇā sākṣād
vraja-dhāma-śubhārthinā', E'парампара-віва̄да̄тма̄
да̄ва̄нало бгайаńкарах̣
бгакшіто
харін̣а̄ са̄кша̄д
враджа-дга̄ма-ш́убга̄ртхіна̄',
    E'', E'',
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


  -- Verse 30
  INSERT INTO public.verses (
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
    E'pralambo
jīva-cauras tu śuddhena śauriṇā hataḥ
kaḿsena
prerito duṣṭaḥ pracchanno bauddha-rūpa-dhṛk', E'pralambo
jīva-cauras tu śuddhena śauriṇā hataḥ
kaḿsena
prerito duṣṭaḥ pracchanno bauddha-rūpa-dhṛk',
    E'pralambo
jīva-cauras tu śuddhena śauriṇā hataḥ
kaḿsena
prerito duṣṭaḥ pracchanno bauddha-rūpa-dhṛk', E'праламбо
джı̄ва-чаурас ту ш́уддгена ш́аурін̣а̄ хатах̣
каḿсена
преріто душт̣ах̣ праччханно бауддга-рӯпа-дгр̣к',
    E'', E'',
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


  -- Chapter 5: Krsna Lila Varnanam Part 2
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Krsna Lila Varnanam Part 2', E'Крішна-ліла-варнанам (частина 2)', 'verses', true)
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
    E'prīti-prāvṛṭ-samārambhe
gopyo bhāvātmikās tadā
kṛṣṇasya
guṇa-gāne tu pramattās tā hari-priyāḥ', E'prīti-prāvṛṭ-samārambhe
gopyo bhāvātmikās tadā
kṛṣṇasya
guṇa-gāne tu pramattās tā hari-priyāḥ',
    E'prīti-prāvṛṭ-samārambhe
gopyo bhāvātmikās tadā
kṛṣṇasya
guṇa-gāne tu pramattās tā hari-priyāḥ', E'прı̄ті-пра̄вр̣т̣-сама̄рамбге
ґопйо бга̄ва̄тміка̄с тада̄
кр̣шн̣асйа
ґун̣а-ґа̄не ту праматта̄с та̄ харі-прійа̄х̣',
    E'', E'',
    E'When madhurya-rasa becomes excessively liquified, then love pours like rain
during the rainy season. Then the gopis, who are most dear to Hari and fully
absorbed in His thought, become maddened while chanting His glories.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'śrī-kṛṣṇa-veṇu-gītena
vyākulās tā samārcayan
yoga-māyāḿ
mahā-devīḿ kṛṣṇa-lābhecchayā vraje', E'śrī-kṛṣṇa-veṇu-gītena
vyākulās tā samārcayan
yoga-māyāḿ
mahā-devīḿ kṛṣṇa-lābhecchayā vraje',
    E'śrī-kṛṣṇa-veṇu-gītena
vyākulās tā samārcayan
yoga-māyāḿ
mahā-devīḿ kṛṣṇa-lābhecchayā vraje', E'ш́рı̄-кр̣шн̣а-вен̣у-ґı̄тена
вйа̄кула̄с та̄ сама̄рчайан
йоґа-ма̄йа̄ḿ
маха̄-девı̄ḿ кр̣шн̣а-ла̄бгеччхайа̄ врадже',
    E'', E'',
    E'Being overwhelmed by the sound of Krsna''s flute, the gopis of Vraja worshiped goddess
Yogamaya with a desire to attain Krsna. The appearance of the truth of
Vaikuntha in the pure consciousness of the living entities of this world is
called Vraja. The word vraja means to go. It is impossible to elevate oneself
in this material world by rejecting maya, therefore one should take shelter of
favorable material items and try to search for the indescribable truth. For
this reason living entities who have attained the mood of gopis take shelter of
the great goddess Yogamaya to help them attain the Lord''s pastimes in the
spiritual world.
3  4)
Those persons who have an intense desire to serve Krsna have no secrets amongst
themselves or with others. In order to teach this principle to the devotees,
Krsna stole the clothes of the gopis. A heart that is situated in pure goodness
is the proper abode for attachment to the Lord. He exposed the gopis'' love for
Him by stealing away their clothes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'yeṣāḿ
tu kṛṣṇa-dāsyecchā vartate balavattarā
gopanīyaḿ
na teṣāḿ hi svasmin vānyatra kiñcana', E'yeṣāḿ
tu kṛṣṇa-dāsyecchā vartate balavattarā
gopanīyaḿ
na teṣāḿ hi svasmin vānyatra kiñcana',
    E'yeṣāḿ
tu kṛṣṇa-dāsyecchā vartate balavattarā
gopanīyaḿ
na teṣāḿ hi svasmin vānyatra kiñcana', E'йеша̄ḿ
ту кр̣шн̣а-да̄сйеччха̄ вартате балаваттара̄
ґопанı̄йаḿ
на теша̄ḿ хі свасмін ва̄нйатра кін̃чана',
    E'', E'',
    E'While tending the cows near Mathura, Sri Krsna begged food grains from the
brahmanas who were engaged in sacrifice. Being proud of their caste, those
brahmanas considered that performing sacrifices was the highest principle and
therefore did not give Krsna any food.
6) The
reason for this is that high-caste brahmanas are so-called followers of the
Vedas, and therefore they cannot realize the subtle purport of the Vedas. They
follow the process of insignificant fruitive activities and become
materialistic, or they study the science of self-realization and speculative
knowledge and become absorbed in impersonalism. Such brahmanas prefer to simply
remain controlled by the scriptural injunctions or previous ancestors by
formally carrying out their instructions. They are unable to understand that
attachment to the Lord is the primary purpose of all scriptures, so how can
they become servants of Krsna? We should not misunderstand from this that all
brahmanas are mundane fruitive workers or followers of speculative knowledge.
Many great personalities appeared in brahmana families and attained the topmost
position of devotional service. Therefore the purport of this verse is that
asslike brahmanas who formally carry out the rules and regulations are averse
to Krsna, but swanlike brahmanas are servants of Krsna and thus worshipable by
all.
7) The
wives of the asslike brahmanas represent people who are subordinate to those
with undeveloped faith. Being under the control of the sweetness of Krsna, who
is the Supersoul, they went to the forest and offered themselves to Him. Those
who have undeveloped faith are called mundane devotees.
8) By
this incident the equality of all living entities is ascertained. There is no
consideration of caste in pleasing Krsna, rather caste consciousness sometimes
becomes an obstacle in the development of love.
9) In
order to maintain social order, the Aryans divided society into four castes and
four social orders. If the social system is protected, then people''s spiritual
lives are nourished by good association and discussion. Therefore the
varnasrama system should be accepted in all respects. By this arrangement there
is a possibility of gradually attaining love for Krsna. The main purpose for
this arrangement is the cultivation of spiritual life, or love for Krsna. Even
if one attains perfection without following this process, still it should not
be disregarded. At this point one should understand that after attaining
perfection, this process naturally becomes unimportant. There is no fault in
the rejection of the relatively less important process of varnasrama by those
who have attained perfection in the form of love for Krsna. Therefore the
conclusion is that faults and qualities can be attributed only in respect to
the qualification of the performer.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'etad
vai śikṣayan kṛṣṇo vastrāṇi vyaharan
prabhuḥ
dadarśānāvṛtaḿ
cittaḿ rati-sthānam anāmayam', E'etad
vai śikṣayan kṛṣṇo vastrāṇi vyaharan
prabhuḥ
dadarśānāvṛtaḿ
cittaḿ rati-sthānam anāmayam',
    E'etad
vai śikṣayan kṛṣṇo vastrāṇi vyaharan
prabhuḥ
dadarśānāvṛtaḿ
cittaḿ rati-sthānam anāmayam', E'етад
ваі ш́ікшайан кр̣шн̣о вастра̄н̣і вйахаран
прабгух̣
дадарш́а̄на̄вр̣таḿ
чіттаḿ раті-стха̄нам ана̄майам',
    E'', E'',
    E'Lord Yajnesvara is the predominating Lord of the activities for protecting the social
order. His representative amongst the living entities is Indra. Such activities
are of two varietiesconstitutional and conditional. Those regular activities
which are meant for maintaining one''s life are called constitutional. Any
activities other than these are conditional. If we consider, we can understand
that all fruitive activities fall under the category of either constitutional
or conditional. Therefore activities performed either with material desire or
without material desire fall under the categories of constitutional or
conditional activities. Lord Krsna forbade His devotees from performing any
activities other than those meant for maintaining their lives. When Indra, the
lord of fruitive activities, saw Lord Krsna arrange to neglect the activities
meant to nourish the world, he created a great disturbance. The Lord protected
the devotees from flood and supplied their needs by accepting Govardhana, the
expanding shelter of sober persons, as an umbrella.
11) If
the activities that nourish the world are neglected for the cultivation of
Krsna consciousness, the devotees of Krsna should not feel anxiety.
12) No
one can destroy one whom Krsna wants to protect. The strength of regulations
cannot influence such persons. What to speak of the bondage of regulations,
nothing other than the bondage of love for the Lord can bind the devotees.
13) In
Sri Vrndavana, the land of faith, the Yamuna, the personification of spiritual
liquid, flows. Nanda Maharaja was merged in that water, and the Lord delivered
him as part of His pastimes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'brāhmaṇāḿś
ca jagannātho yajñānnaḿ samayācata
brāhmaṇā
na dadur bhaktaḿ varṇābhimānino yataḥ', E'brāhmaṇāḿś
ca jagannātho yajñānnaḿ samayācata
brāhmaṇā
na dadur bhaktaḿ varṇābhimānino yataḥ',
    E'brāhmaṇāḿś
ca jagannātho yajñānnaḿ samayācata
brāhmaṇā
na dadur bhaktaḿ varṇābhimānino yataḥ', E'бра̄хман̣а̄ḿш́
ча джаґанна̄тхо йаджн̃а̄ннаḿ самайа̄чата
бра̄хман̣а̄
на дадур бгактаḿ варн̣а̄бгіма̄ніно йатах̣',
    E'', E'',
    E'Thereafter, Lord Krsna mercifully displayed the truth and opulence of Vaikuntha
to the cowherd men. This shows that Krsna''s sweetness is so prominent that His
opulences become covered by its presence.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'veda-vāda-ratā
viprāḥ karma-jñāna-parāyaṇāḥ
vidhīnāḿ
vāhakāḥ śaśvat kathaḿ
kṛṣṇa-ratā hi te', E'veda-vāda-ratā
viprāḥ karma-jñāna-parāyaṇāḥ
vidhīnāḿ
vāhakāḥ śaśvat kathaḿ
kṛṣṇa-ratā hi te',
    E'veda-vāda-ratā
viprāḥ karma-jñāna-parāyaṇāḥ
vidhīnāḿ
vāhakāḥ śaśvat kathaḿ
kṛṣṇa-ratā hi te', E'веда-ва̄да-рата̄
віпра̄х̣ карма-джн̃а̄на-пара̄йан̣а̄х̣
відгı̄на̄ḿ
ва̄хака̄х̣ ш́аш́ват катхаḿ
кр̣шн̣а-рата̄ хі те',
    E'', E'',
    E'The Lord, who is very dear to the eternally perfect living entities and their
followers, performed His rasa-lila, which is the culmination of ecstatic love.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'teṣāḿ
striyas tadāgatya śrī-kṛṣṇa-sannidhiḿ
vane
akurvann
ātma-dānaḿ vai kṛṣṇāya paramātmane', E'teṣāḿ
striyas tadāgatya śrī-kṛṣṇa-sannidhiḿ
vane
akurvann
ātma-dānaḿ vai kṛṣṇāya paramātmane',
    E'teṣāḿ
striyas tadāgatya śrī-kṛṣṇa-sannidhiḿ
vane
akurvann
ātma-dānaḿ vai kṛṣṇāya paramātmane', E'теша̄ḿ
стрійас тада̄ґатйа ш́рı̄-кр̣шн̣а-саннідгіḿ
ване
акурванн
а̄тма-да̄наḿ ваі кр̣шн̣а̄йа парама̄тмане',
    E'', E'',
    E'After the most merciful Lord increased the amorous love of the gopis by
suddenly disappearing from them, He began to dance in the circle of the
rasa-lila.
17 
18) In this material world, which is created by maya, there is a principle
constellation named Dhruva. All the suns along with their planets continually
circle around Dhruva by its power of attraction. The main consideration is that
there is an energy known as attraction in all material atoms. By the strength
of this energy, atoms are attracted to each other and they thus create a
globular planet. When these planets are attracted to a larger globular planet,
they begin to move around it. This is the invariable law of this material
world. Maya is the basis of the material world and only a reflection of the
spiritual world. This has already been explained previously while discussing
the energies of the Lord. By their eternal constitution, in the form of love,
the sparklike conscious living entities in the spiritual world are attracted to
one another, and they imitate one with more elevated consciousness. Those more
elevated conscious persons with their subordinate conscious associates
constantly move in the rasa-lila circle of Krsna, who is the superconscious
supreme Dhruva. Therefore the great rasa-lila pastimes are eternally manifest
in the realm of Vaikuntha. In the spiritual world the ever-existing attachment
extends love up to mahabhava, and in the material world the reflection extends
as an inconceivable material attraction that creates variegated nature. In
order to illustrate subtle truths by gross examples we say that in the material
world the sun along with the planets are constantly moving around the Dhruva
constellation by the strength of its attraction, just as all pure living
entities eternally circle around Krsna by the strength His attraction.
19) In
the transcendental rasa-lila pastimes, Sri Krsna is the only enjoyer and all
others are enjoyed. The conclusion is that the sunlike personality of the
spiritual world, Lord Sri Krsna, is the only male and the living entities are
all female. All the relationships of the spiritual world are based on pure
love, one therefore finds the enjoyer is male and the enjoyed are female. The
males and females of the material world are perverted reflections of the
enjoyer and enjoyed of the spiritual world. If one searches through all
dictionaries one will not find the words to properly describe the spiritual
pastimes of the supremely conscious Lord and His associates. Hence the
descriptions of the man and woman of the material world are used here as an
appropriate indication. There is no necessity or suggestion of obscene thoughts
in this regard. If we reject these activities as obscene, then we miss the
opportunity to discuss that supreme pastime. We are able to describe the truths
of Vaikuntha by describing mundane emotions as the reflections of spiritual
emotions. There is no other alternative in this regard. For example: Krsna is
merciful. But to show how Krsna is merciful, one has to give the example of
certain persons who are merciful. There is no way of expressing this quality
other than by giving a well-known example. Therefore swanlike persons should
give up shyness and obscene considerations and then hear, read, and think about
the transcendental topics of the rasa-lila without anxiety.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'etena
darśitaḿ tattvaḿ jīvānāḿ
sama-darśanam
śrī-kṛṣṇa-prīti-sampattau
jāti-buddhir na kāraṇam', E'etena
darśitaḿ tattvaḿ jīvānāḿ
sama-darśanam
śrī-kṛṣṇa-prīti-sampattau
jāti-buddhir na kāraṇam',
    E'etena
darśitaḿ tattvaḿ jīvānāḿ
sama-darśanam
śrī-kṛṣṇa-prīti-sampattau
jāti-buddhir na kāraṇam', E'етена
дарш́ітаḿ таттваḿ джı̄ва̄на̄ḿ
сама-дарш́анам
ш́рı̄-кр̣шн̣а-прı̄ті-сампаттау
джа̄ті-буддгір на ка̄ран̣ам',
    E'', E'',
    E'The topmost expression of the rasa-lila is that Srimati Radhika, who is the
personification of hladini, who manifests the sweetness of Krsna, and who is
supremely worshipable by the living entities, is surrounded by the sakhis, who
are personifications of various emotions, and beautifully situated in the rasa
dance.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'narāṇāḿ
varṇa-bhāgo hi sāmājika-vidhir mataḥ
tyajan
varṇāśramān dharman kṛṣṇārtham hi
na doṣa-bhāk', E'narāṇāḿ
varṇa-bhāgo hi sāmājika-vidhir mataḥ
tyajan
varṇāśramān dharman kṛṣṇārtham hi
na doṣa-bhāk',
    E'narāṇāḿ
varṇa-bhāgo hi sāmājika-vidhir mataḥ
tyajan
varṇāśramān dharman kṛṣṇārtham hi
na doṣa-bhāk', E'нара̄н̣а̄ḿ
варн̣а-бга̄ґо хі са̄ма̄джіка-відгір матах̣
тйаджан
варн̣а̄ш́рама̄н дгарман кр̣шн̣а̄ртхам хі
на доша-бга̄к',
    E'', E'',
    E'After the rasa-lila dance, the water sports in the spiritual waters of the
Yamuna naturally take place.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'indrasya
karma-rūpasya niṣidhya yajñam utsavam
varṣaṇāt
plāvanāt tasya rarakṣa gokulaḿ hariḥ', E'indrasya
karma-rūpasya niṣidhya yajñam utsavam
varṣaṇāt
plāvanāt tasya rarakṣa gokulaḿ hariḥ',
    E'indrasya
karma-rūpasya niṣidhya yajñam utsavam
varṣaṇāt
plāvanāt tasya rarakṣa gokulaḿ hariḥ', E'індрасйа
карма-рӯпасйа нішідгйа йаджн̃ам утсавам
варшан̣а̄т
пла̄вана̄т тасйа раракша ґокулаḿ харіх̣',
    E'', E'',
    E'When Maharaja Nanda, who is personified happiness, was swallowed by the snake,
who personifies merging with the Supreme, Krsna, the protector of the devotees,
rescued him from danger. Sankhacuda was the personification of fame, because he
considered fame as his life and soul. He was killed while trying to create
disturbances in Vraja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'etena
jñāpitaḿ tattvaḿ kṛṣṇa-prītiḿ
gatasya vai
na
kācid vartate śańkā viśva-nāśād
akarmaṇaḥ', E'etena
jñāpitaḿ tattvaḿ kṛṣṇa-prītiḿ
gatasya vai
na
kācid vartate śańkā viśva-nāśād
akarmaṇaḥ',
    E'etena
jñāpitaḿ tattvaḿ kṛṣṇa-prītiḿ
gatasya vai
na
kācid vartate śańkā viśva-nāśād
akarmaṇaḥ', E'етена
джн̃а̄пітаḿ таттваḿ кр̣шн̣а-прı̄тіḿ
ґатасйа ваі
на
ка̄чід вартате ш́аńка̄ віш́ва-на̄ш́а̄д
акарман̣ах̣',
    E'', E'',
    E'When Krsna, the enemy of Kamsa, decided to go to Mathura, the horse demon
Keshi, who personifies the vanity of political ambition, was killed.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'yeṣāḿ
kṛṣṇaḥ samuddhartā teṣāḿ
hantā na kaścana
vidhīnāḿ
na balaḿ teṣu bhaktānāḿ kutra bandhanam', E'yeṣāḿ
kṛṣṇaḥ samuddhartā teṣāḿ
hantā na kaścana
vidhīnāḿ
na balaḿ teṣu bhaktānāḿ kutra bandhanam',
    E'yeṣāḿ
kṛṣṇaḥ samuddhartā teṣāḿ
hantā na kaścana
vidhīnāḿ
na balaḿ teṣu bhaktānāḿ kutra bandhanam', E'йеша̄ḿ
кр̣шн̣ах̣ самуддгарта̄ теша̄ḿ
ханта̄ на каш́чана
відгı̄на̄ḿ
на балаḿ тешу бгакта̄на̄ḿ кутра бандганам',
    E'', E'',
    E'Akrura, the catalyst of future events, took Krsna and Balarama to Mathura,
where the two Lords first killed the wrestlers and then Kamsa.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'viśvāsa-viṣaye
ramye nadī cid-drava-rūpiṇī
tasyāḿ
tu pitaraḿ magnam uddhṛtya līlayā hariḥ', E'viśvāsa-viṣaye
ramye nadī cid-drava-rūpiṇī
tasyāḿ
tu pitaraḿ magnam uddhṛtya līlayā hariḥ',
    E'viśvāsa-viṣaye
ramye nadī cid-drava-rūpiṇī
tasyāḿ
tu pitaraḿ magnam uddhṛtya līlayā hariḥ', E'віш́ва̄са-вішайе
рамйе надı̄ чід-драва-рӯпін̣ı̄
тасйа̄ḿ
ту пітараḿ маґнам уддгр̣тйа лı̄лайа̄ харіх̣',
    E'', E'',
    E'After the atheist Kamsa was killed, his father, Ugrasena, the personification
of freedom, was installed on the throne by Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'darśayāmāsa
vaikuṇṭhaḿ gopebhyo harir ātmanaḥ
aiśvaryaḿ
kṛṣṇa-tattve tu sarvadā nihitaḿ kila', E'darśayāmāsa
vaikuṇṭhaḿ gopebhyo harir ātmanaḥ
aiśvaryaḿ
kṛṣṇa-tattve tu sarvadā nihitaḿ kila',
    E'darśayāmāsa
vaikuṇṭhaḿ gopebhyo harir ātmanaḥ
aiśvaryaḿ
kṛṣṇa-tattve tu sarvadā nihitaḿ kila', E'дарш́айа̄ма̄са
ваікун̣т̣хаḿ ґопебгйо харір а̄тманах̣
аіш́варйаḿ
кр̣шн̣а-таттве ту сарвада̄ ніхітаḿ кіла',
    E'', E'',
    E'The two wives of Kamsa, Asti and Prapti, described the killing of their husband
to Jarasandha, the personification of fruitive activities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jīvānāḿ
nitya-siddhānām anugatānām api priyaḥ
akarod
rāsa-līlāḿ vai prīti-tattva-prakāśikām', E'jīvānāḿ
nitya-siddhānām anugatānām api priyaḥ
akarod
rāsa-līlāḿ vai prīti-tattva-prakāśikām',
    E'jīvānāḿ
nitya-siddhānām anugatānām api priyaḥ
akarod
rāsa-līlāḿ vai prīti-tattva-prakāśikām', E'джı̄ва̄на̄ḿ
нітйа-сіддга̄на̄м ануґата̄на̄м апі прійах̣
акарод
ра̄са-лı̄ла̄ḿ ваі прı̄ті-таттва-прака̄ш́іка̄м',
    E'', E'',
    E'Hearing their description, the King of Magadha gathered a huge army and
attacked Mathura seventeen times, but was defeated each time.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'antardhāna-viyogena
vardhayan smaram uttamam
gopikā-rāsa-cakre
tu nanarta kṛpayā hariḥ', E'antardhāna-viyogena
vardhayan smaram uttamam
gopikā-rāsa-cakre
tu nanarta kṛpayā hariḥ',
    E'antardhāna-viyogena
vardhayan smaram uttamam
gopikā-rāsa-cakre
tu nanarta kṛpayā hariḥ', E'антардга̄на-війоґена
вардгайан смарам уттамам
ґопіка̄-ра̄са-чакре
ту нанарта кр̣пайа̄ харіх̣',
    E'', E'',
    E'When Jarasandha again attacked Mathura, the Lord went to His abode of Dvaraka.
The main purport is that there are ten types of purificatory activities, such
as funeral rites, along with four castes and four orders of life, which brings
the total to eighteen. Among these, when the eighteenth, or sannyasa, captures
the abode of knowledge, then due to the desire for liberation the Lord
disappears.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jaḍātmake
yathā viśve dhruvasyākarṣaṇāt kila
bhramanti
maṇḍalākārāḥ sa-sūryā
graha-saḿkulāḥ', E'jaḍātmake
yathā viśve dhruvasyākarṣaṇāt kila
bhramanti
maṇḍalākārāḥ sa-sūryā
graha-saḿkulāḥ',
    E'jaḍātmake
yathā viśve dhruvasyākarṣaṇāt kila
bhramanti
maṇḍalākārāḥ sa-sūryā
graha-saḿkulāḥ', E'джад̣а̄тмаке
йатха̄ віш́ве дгрувасйа̄каршан̣а̄т кіла
бграманті
ман̣д̣ала̄ка̄ра̄х̣ са-сӯрйа̄
ґраха-саḿкула̄х̣',
    E'', E'',
    E'During Krsna''s residence in Mathura, He left for gurukula, where He very easily
studied all the scriptures. He brought the dead sons of His guru back to life
and offered them to His guru.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tathā
cid-viṣaye kṛṣṇasyākarṣaṇa-balād
api
bhramanti
nityaśo jīvāḥ śrī-kṛṣṇe
madhyage sati', E'tathā
cid-viṣaye kṛṣṇasyākarṣaṇa-balād
api
bhramanti
nityaśo jīvāḥ śrī-kṛṣṇe
madhyage sati',
    E'tathā
cid-viṣaye kṛṣṇasyākarṣaṇa-balād
api
bhramanti
nityaśo jīvāḥ śrī-kṛṣṇe
madhyage sati', E'татха̄
чід-вішайе кр̣шн̣асйа̄каршан̣а-бала̄д
апі
бграманті
нітйаш́о джı̄ва̄х̣ ш́рı̄-кр̣шн̣е
мадгйаґе саті',
    E'', E'',
    E'There is no need for Krsna, who is independently perfect, to endeavor for an
education, but when one resides in Mathura, the abode of knowledge, one''s
knowledge gradually expands. This was illustrated in this pastime.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'mahā-rāsa-vihāre''smin
puruṣaḥ kṛṣṇa eva hi
sarve
nārī-gaṇās tatra bhogya-bhoktṛ-vicārataḥ', E'mahā-rāsa-vihāre''smin
puruṣaḥ kṛṣṇa eva hi
sarve
nārī-gaṇās tatra bhogya-bhoktṛ-vicārataḥ',
    E'mahā-rāsa-vihāre''smin
puruṣaḥ kṛṣṇa eva hi
sarve
nārī-gaṇās tatra bhogya-bhoktṛ-vicārataḥ', E'маха̄-ра̄са-віха̄ре''смін
пурушах̣ кр̣шн̣а ева хі
сарве
на̄рı̄-ґан̣а̄с татра бгоґйа-бгоктр̣-віча̄ратах̣',
    E'', E'',
    E'Those who enjoy the fruits of their activities are called lusty. Such peoples''
attachment for Krsna is contaminated with impurities, but if they cultivate
attachment to Krsna for a long time, then pure devotion arises.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tatraiva
paramārādhyā hlādinī
kṛṣṇa-bhāsinī
bhāvaiḥ
sā rāsa-madhya-sthā sakhibhī
rādhikāvṛtā', E'tatraiva
paramārādhyā hlādinī
kṛṣṇa-bhāsinī
bhāvaiḥ
sā rāsa-madhya-sthā sakhibhī
rādhikāvṛtā',
    E'tatraiva
paramārādhyā hlādinī
kṛṣṇa-bhāsinī
bhāvaiḥ
sā rāsa-madhya-sthā sakhibhī
rādhikāvṛtā', E'татраіва
парама̄ра̄дгйа̄ хла̄дінı̄
кр̣шн̣а-бга̄сінı̄
бга̄ваіх̣
са̄ ра̄са-мадгйа-стха̄ сакхібгı̄
ра̄дгіка̄вр̣та̄',
    E'', E'',
    E'While residing in Mathura, Krsna had a seemingly mundane affair with Kubja.
Although there were lusty desires in the heart of Kubja, those desires were
ultimately transformed into pure love. Thereafter Krsna sent Uddhava to Gokula
to teach him that the loving sentiments of the residents of Vraja are the
highest of all.
33) In
the smritis it is stated that the Pandavas were like the branches of religion
and the Kauravas were like branches of irreligion. Therefore Lord Krsna was the
friend and protector of the Pandavas.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'mahā-rāsa-vihārānte
jala-krīḍā svabhāvataḥ
vartate
yamunāyāḿ vai drava-mayyāḿ satāḿ kila', E'mahā-rāsa-vihārānte
jala-krīḍā svabhāvataḥ
vartate
yamunāyāḿ vai drava-mayyāḿ satāḿ kila',
    E'mahā-rāsa-vihārānte
jala-krīḍā svabhāvataḥ
vartate
yamunāyāḿ vai drava-mayyāḿ satāḿ kila', E'маха̄-ра̄са-віха̄ра̄нте
джала-крı̄д̣а̄ свабга̄ватах̣
вартате
йамуна̄йа̄ḿ ваі драва-маййа̄ḿ сата̄ḿ кіла',
    E'', E'',
    E'The Lord sent Akrura to Hastinapura as an ambassador to establish religious
principles and deliver the sinful persons.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'mukty-ahi-grasta-nandas
tu kṛṣṇena mocitas tadā
yaśo-mūrdhā
sudurdāntaḥ śańkhacūḍo hataḥ purā', E'mukty-ahi-grasta-nandas
tu kṛṣṇena mocitas tadā
yaśo-mūrdhā
sudurdāntaḥ śańkhacūḍo hataḥ purā',
    E'mukty-ahi-grasta-nandas
tu kṛṣṇena mocitas tadā
yaśo-mūrdhā
sudurdāntaḥ śańkhacūḍo hataḥ purā', E'муктй-ахі-ґраста-нандас
ту кр̣шн̣ена мочітас тада̄
йаш́о-мӯрдга̄
судурда̄нтах̣ ш́аńкхачӯд̣о хатах̣ пура̄',
    E'', E'',
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
    E'ghoṭakātmā
hatas tena keśī rājya-madāsuraḥ
mathurāḿ
gantu-kāmena kṛṣṇena kaḿsa-vairiṇā', E'ghoṭakātmā
hatas tena keśī rājya-madāsuraḥ
mathurāḿ
gantu-kāmena kṛṣṇena kaḿsa-vairiṇā',
    E'ghoṭakātmā
hatas tena keśī rājya-madāsuraḥ
mathurāḿ
gantu-kāmena kṛṣṇena kaḿsa-vairiṇā', E'ґгот̣ака̄тма̄
хатас тена кеш́ı̄ ра̄джйа-мада̄сурах̣
матхура̄ḿ
ґанту-ка̄мена кр̣шн̣ена каḿса-ваірін̣а̄',
    E'', E'',
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
    E'ghaṭyānāḿ
ghaṭako''krūro mathurām anayad dharim
mallān
hatvā hariḥ kaḿsaḿ sānujaḿ nipapāta ha', E'ghaṭyānāḿ
ghaṭako''krūro mathurām anayad dharim
mallān
hatvā hariḥ kaḿsaḿ sānujaḿ nipapāta ha',
    E'ghaṭyānāḿ
ghaṭako''krūro mathurām anayad dharim
mallān
hatvā hariḥ kaḿsaḿ sānujaḿ nipapāta ha', E'ґгат̣йа̄на̄ḿ
ґгат̣ако''крӯро матхура̄м анайад дгарім
малла̄н
хатва̄ харіх̣ каḿсаḿ са̄нуджаḿ ніпапа̄та ха',
    E'', E'',
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
    E'nāstikye
vigate kaḿse svātantryam ugra-senakam
tasyaiva
pitaraḿ kṛṣṇaḥ kṛtavān
kṣiti-pālakam', E'nāstikye
vigate kaḿse svātantryam ugra-senakam
tasyaiva
pitaraḿ kṛṣṇaḥ kṛtavān
kṣiti-pālakam',
    E'nāstikye
vigate kaḿse svātantryam ugra-senakam
tasyaiva
pitaraḿ kṛṣṇaḥ kṛtavān
kṣiti-pālakam', E'на̄стікйе
віґате каḿсе сва̄тантрйам уґра-сенакам
тасйаіва
пітараḿ кр̣шн̣ах̣ кр̣тава̄н
кшіті-па̄лакам',
    E'', E'',
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
    E'kaḿsa-bhāryā-dvayaḿ
gatvā pitaraḿ magadhāśrayam
karma-kāṇḍa-svarūpaḿ
taḿ vaidhavyaḿ vinyavedayat', E'kaḿsa-bhāryā-dvayaḿ
gatvā pitaraḿ magadhāśrayam
karma-kāṇḍa-svarūpaḿ
taḿ vaidhavyaḿ vinyavedayat',
    E'kaḿsa-bhāryā-dvayaḿ
gatvā pitaraḿ magadhāśrayam
karma-kāṇḍa-svarūpaḿ
taḿ vaidhavyaḿ vinyavedayat', E'каḿса-бга̄рйа̄-двайаḿ
ґатва̄ пітараḿ маґадга̄ш́райам
карма-ка̄н̣д̣а-сварӯпаḿ
таḿ ваідгавйаḿ вінйаведайат',
    E'', E'',
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
    E'śrutvaitan
māgadho rājā sva-sainya-parivāritaḥ
saptadaśa-mahā-yuddhaḿ
kṛtavān mathurā-pure', E'śrutvaitan
māgadho rājā sva-sainya-parivāritaḥ
saptadaśa-mahā-yuddhaḿ
kṛtavān mathurā-pure',
    E'śrutvaitan
māgadho rājā sva-sainya-parivāritaḥ
saptadaśa-mahā-yuddhaḿ
kṛtavān mathurā-pure', E'ш́рутваітан
ма̄ґадго ра̄джа̄ сва-саінйа-паріва̄рітах̣
саптадаш́а-маха̄-йуддгаḿ
кр̣тава̄н матхура̄-пуре',
    E'', E'',
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
    E'hariṇā
marditaḥ so''pi gatvāṣṭadaśame raṇe
arundhan
mathurāḿ kṛṣṇo jagāma
dvārakāḿ svakām', E'hariṇā
marditaḥ so''pi gatvāṣṭadaśame raṇe
arundhan
mathurāḿ kṛṣṇo jagāma
dvārakāḿ svakām',
    E'hariṇā
marditaḥ so''pi gatvāṣṭadaśame raṇe
arundhan
mathurāḿ kṛṣṇo jagāma
dvārakāḿ svakām', E'харін̣а̄
мардітах̣ со''пі ґатва̄шт̣адаш́аме ран̣е
арундган
матхура̄ḿ кр̣шн̣о джаґа̄ма
два̄рака̄ḿ свака̄м',
    E'', E'',
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


  -- Verse 29
  INSERT INTO public.verses (
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
    E'mathurāyāḿ
vasan kṛṣṇo gurv-āśramāśrayāt
tadā
paṭhitvā
sarva-śāstrāṇi dattavān suta-jīvanam', E'mathurāyāḿ
vasan kṛṣṇo gurv-āśramāśrayāt
tadā
paṭhitvā
sarva-śāstrāṇi dattavān suta-jīvanam',
    E'mathurāyāḿ
vasan kṛṣṇo gurv-āśramāśrayāt
tadā
paṭhitvā
sarva-śāstrāṇi dattavān suta-jīvanam', E'матхура̄йа̄ḿ
васан кр̣шн̣о ґурв-а̄ш́рама̄ш́райа̄т
тада̄
пат̣хітва̄
сарва-ш́а̄стра̄н̣і даттава̄н сута-джı̄ванам',
    E'', E'',
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


  -- Verse 30
  INSERT INTO public.verses (
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
    E'svataḥ-siddhasya
kṛṣṇasya jñānaḿ sādhyaḿ bhaven na hi
kevalaḿ
nara-citteṣu tad-bhāvānāḿ kramodgatiḥ', E'svataḥ-siddhasya
kṛṣṇasya jñānaḿ sādhyaḿ bhaven na hi
kevalaḿ
nara-citteṣu tad-bhāvānāḿ kramodgatiḥ',
    E'svataḥ-siddhasya
kṛṣṇasya jñānaḿ sādhyaḿ bhaven na hi
kevalaḿ
nara-citteṣu tad-bhāvānāḿ kramodgatiḥ', E'сватах̣-сіддгасйа
кр̣шн̣асйа джн̃а̄наḿ са̄дгйаḿ бгавен на хі
кевалаḿ
нара-чіттешу тад-бга̄ва̄на̄ḿ крамодґатіх̣',
    E'', E'',
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


  -- Verse 31
  INSERT INTO public.verses (
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
    E'kāminām
api kṛṣṇe tu ratiḥ syān mala-saḿyutā
sā
ratiḥ kramaśaḥ prītir bhavatīha sunirmalā', E'kāminām
api kṛṣṇe tu ratiḥ syān mala-saḿyutā
sā
ratiḥ kramaśaḥ prītir bhavatīha sunirmalā',
    E'kāminām
api kṛṣṇe tu ratiḥ syān mala-saḿyutā
sā
ratiḥ kramaśaḥ prītir bhavatīha sunirmalā', E'ка̄міна̄м
апі кр̣шн̣е ту ратіх̣ сйа̄н мала-саḿйута̄
са̄
ратіх̣ крамаш́ах̣ прı̄тір бгаватı̄ха сунірмала̄',
    E'', E'',
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


  -- Verse 32
  INSERT INTO public.verses (
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
    E'kubjāyāḥ
praṇaye tattvam etad vai darśitaḿ śubham
vraja-bhāva-suśikṣārthaḿ
gokule coddhavo gataḥ', E'kubjāyāḥ
praṇaye tattvam etad vai darśitaḿ śubham
vraja-bhāva-suśikṣārthaḿ
gokule coddhavo gataḥ',
    E'kubjāyāḥ
praṇaye tattvam etad vai darśitaḿ śubham
vraja-bhāva-suśikṣārthaḿ
gokule coddhavo gataḥ', E'кубджа̄йа̄х̣
пран̣айе таттвам етад ваі дарш́ітаḿ ш́убгам
враджа-бга̄ва-суш́ікша̄ртхаḿ
ґокуле чоддгаво ґатах̣',
    E'', E'',
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


  -- Verse 33
  INSERT INTO public.verses (
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
    E'pāṇḍavā
dharma-śākhā hi kauravāś cetarāḥ
smṛtāḥ
pāṇḍavānāḿ
tataḥ kṛṣṇo bāndhavaḥ
kula-rakṣakaḥ', E'pāṇḍavā
dharma-śākhā hi kauravāś cetarāḥ
smṛtāḥ
pāṇḍavānāḿ
tataḥ kṛṣṇo bāndhavaḥ
kula-rakṣakaḥ',
    E'pāṇḍavā
dharma-śākhā hi kauravāś cetarāḥ
smṛtāḥ
pāṇḍavānāḿ
tataḥ kṛṣṇo bāndhavaḥ
kula-rakṣakaḥ', E'па̄н̣д̣ава̄
дгарма-ш́а̄кха̄ хі каурава̄ш́ четара̄х̣
смр̣та̄х̣
па̄н̣д̣ава̄на̄ḿ
татах̣ кр̣шн̣о ба̄ндгавах̣
кула-ракшаках̣',
    E'', E'',
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


  -- Verse 34
  INSERT INTO public.verses (
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
    E'akrūraḿ
bhagavān dūtaḿ prerayāmāsa hastinām
dharmasya
kuśalārthaḿ vai pāpināḿ
trāṇa-kāmukaḥ', E'akrūraḿ
bhagavān dūtaḿ prerayāmāsa hastinām
dharmasya
kuśalārthaḿ vai pāpināḿ
trāṇa-kāmukaḥ',
    E'akrūraḿ
bhagavān dūtaḿ prerayāmāsa hastinām
dharmasya
kuśalārthaḿ vai pāpināḿ
trāṇa-kāmukaḥ', E'акрӯраḿ
бгаґава̄н дӯтаḿ прерайа̄ма̄са хастіна̄м
дгармасйа
куш́ала̄ртхаḿ ваі па̄піна̄ḿ
тра̄н̣а-ка̄муках̣',
    E'', E'',
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


  -- Chapter 6: Krsna Lila Varnanam Part 3
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Krsna Lila Varnanam Part 3', E'Крішна-ліла-варнанам (частина 3)', 'verses', true)
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
    E'karma-kāṇḍa-svarūpo''yaḿ
māgadhaḥ kaḿsa-bāndhavaḥ
rurodha
mathurāḿ ramyāḿ
brahma-jñāna-svarūpiṇī', E'karma-kāṇḍa-svarūpo''yaḿ
māgadhaḥ kaḿsa-bāndhavaḥ
rurodha
mathurāḿ ramyāḿ
brahma-jñāna-svarūpiṇī',
    E'karma-kāṇḍa-svarūpo''yaḿ
māgadhaḥ kaḿsa-bāndhavaḥ
rurodha
mathurāḿ ramyāḿ
brahma-jñāna-svarūpiṇī', E'карма-ка̄н̣д̣а-сварӯпо''йаḿ
ма̄ґадгах̣ каḿса-ба̄ндгавах̣
руродга
матхура̄ḿ рамйа̄ḿ
брахма-джн̃а̄на-сварӯпін̣ı̄',
    E'', E'',
    E'There are two types of activitiesself-centered and God-centered. God-centered
activities are called karma-yoga, because such activities nourish one''s
knowledge, and this knowledge along with those activities enhance one''s
attachment to the Lord. This mixture of karma, jnana, and bhakti is called
karma-yoga by some people, jnana-yoga by others, and bhakti-yoga by still
others. The swanlike people call it a synthesis of yoga. Those activities that
are self-centered are called fruitive activities. Fruitive activities generally
create doubts, in the form of Asti and Prapti, in regard to the Lord. Fruitive
activities then arrange their marriage with atheism [Kamsa]. This Jarasandha,
the personification of fruitive activities, obstructs Mathura, the
personification of spiritual knowledge.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'māyayā
bāndhavān kṛṣṇo nītavān
dvārakāḿ purīm
mlecchatā-yavanaḿ
hitvā sa-rāmo gatavān hariḥ', E'māyayā
bāndhavān kṛṣṇo nītavān
dvārakāḿ purīm
mlecchatā-yavanaḿ
hitvā sa-rāmo gatavān hariḥ',
    E'māyayā
bāndhavān kṛṣṇo nītavān
dvārakāḿ purīm
mlecchatā-yavanaḿ
hitvā sa-rāmo gatavān hariḥ', E'ма̄йайа̄
ба̄ндгава̄н кр̣шн̣о нı̄тава̄н
два̄рака̄ḿ пурı̄м
млеччхата̄-йаванаḿ
хітва̄ са-ра̄мо ґатава̄н харіх̣',
    E'', E'',
    E' 3) By His sweet will, Sri Krsna took all His friends, the personifications of
devotees, to Dvaraka, the personified abode of regulative devotional service.
One who does not follow the rules and regulations of varnashrama is called a
yavana. When a yavana performs illicit activities, he is degraded further into
a mleccha. With the support of fruitive activities, this yavana was inimical to
knowledge. King Mucukunda, the personification of the path of liberation, was
kicked by this yavana, and the wicked yavana was killed by powerful glance of
Mucukunda.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'mucukundaḿ
mahārājaḿ mukti-mārgādhikāriṇam
padāhanad
durācāras tasya tejohatas tadā', E'mucukundaḿ
mahārājaḿ mukti-mārgādhikāriṇam
padāhanad
durācāras tasya tejohatas tadā',
    E'mucukundaḿ
mahārājaḿ mukti-mārgādhikāriṇam
padāhanad
durācāras tasya tejohatas tadā', E'мучукундаḿ
маха̄ра̄джаḿ мукті-ма̄рґа̄дгіка̄рін̣ам
пада̄ханад
дура̄ча̄рас тасйа теджохатас тада̄',
    E'', E'',
    E'While residing in Dvaraka, which is filled with the knowledge of opulence, the
Lord married Rukmini, the personification of supreme opulence.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'aiśvarya-jñāna-mayyāḿ
vai dvārakāyāḿ gato hariḥ
uvāha
rukmiṇīḿ devīḿ
paramaiśvarya-rūpiṇīm', E'aiśvarya-jñāna-mayyāḿ
vai dvārakāyāḿ gato hariḥ
uvāha
rukmiṇīḿ devīḿ
paramaiśvarya-rūpiṇīm',
    E'aiśvarya-jñāna-mayyāḿ
vai dvārakāyāḿ gato hariḥ
uvāha
rukmiṇīḿ devīḿ
paramaiśvarya-rūpiṇīm', E'аіш́варйа-джн̃а̄на-маййа̄ḿ
ваі два̄рака̄йа̄ḿ ґато харіх̣
ува̄ха
рукмін̣ı̄ḿ девı̄ḿ
парамаіш́варйа-рӯпін̣ı̄м',
    E'', E'',
    E'As soon as Pradyumna, the personification of Cupid, was born from the womb of
Rukmini, he was immediately kidnapped by the cripple-minded Shambara, the
personification of maya.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'pradyumnaḥ
kāma-rūpo vai jātas tasyāḥ hṛtas tadā
māyā-rūpeṇa
daityena śambareṇa durātmanā', E'pradyumnaḥ
kāma-rūpo vai jātas tasyāḥ hṛtas tadā
māyā-rūpeṇa
daityena śambareṇa durātmanā',
    E'pradyumnaḥ
kāma-rūpo vai jātas tasyāḥ hṛtas tadā
māyā-rūpeṇa
daityena śambareṇa durātmanā', E'прадйумнах̣
ка̄ма-рӯпо ваі джа̄тас тасйа̄х̣ хр̣тас тада̄
ма̄йа̄-рӯпен̣а
даітйена ш́амбарен̣а дура̄тмана̄',
    E'', E'',
    E'In ancient times Cupid''s body was burned to ashes by the dry renunciate
Mahadeva. At that time, Ratidevi, the personification of material enjoyment,
took shelter of the demoniac nature. But when regulative devotional service
arose, then Cupid was reborn in the form of Krsna''s son. He then delivered his
wife, Ratidevi, from the clutches of demoniac nature. The purport is that in
yukta-vairagya, regulated lust and attachment are acceptable. Taking help from
the teachings of his wife, the most powerful Cupid killed Sambara, the
personification of material enjoyment, and then returned to Dvaraka with his
wife.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'svapatnyā
rati-devyā saḥ śikṣitaḥ paravīrahā
nihatya
śambaraḿ kāmo dvārakāḿ gatavāḿs
tadā', E'svapatnyā
rati-devyā saḥ śikṣitaḥ paravīrahā
nihatya
śambaraḿ kāmo dvārakāḿ gatavāḿs
tadā',
    E'svapatnyā
rati-devyā saḥ śikṣitaḥ paravīrahā
nihatya
śambaraḿ kāmo dvārakāḿ gatavāḿs
tadā', E'свапатнйа̄
раті-девйа̄ сах̣ ш́ікшітах̣ паравı̄раха̄
ніхатйа
ш́амбараḿ ка̄мо два̄рака̄ḿ ґатава̄ḿс
тада̄',
    E'', E'',
    E'After recovering the jewel, the Lord married Satyabhama, who personifies a
portion of Radharani''s jealous pride.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'māna-mayyāś
ca rādhāyāḥ satyabhāmāḿ kalāḿ
śubhām
upayeme hariḥ
prītyā maṇy-uddhāra-cchalena ca', E'māna-mayyāś
ca rādhāyāḥ satyabhāmāḿ kalāḿ
śubhām
upayeme hariḥ
prītyā maṇy-uddhāra-cchalena ca',
    E'māna-mayyāś
ca rādhāyāḥ satyabhāmāḿ kalāḿ
śubhām
upayeme hariḥ
prītyā maṇy-uddhāra-cchalena ca', E'ма̄на-маййа̄ш́
ча ра̄дга̄йа̄х̣ сатйабга̄ма̄ḿ кала̄ḿ
ш́убга̄м
упайеме харіх̣
прı̄тйа̄ ман̣й-уддга̄ра-ччхалена ча',
    E'', E'',
    E'Krsna''s eight queens, headed by Rukmini, were reflections of the opulences of
the hladini aspect and were very dear to Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'mādhurya-hlādinī-śakteḥ
praticchāyā svarūpakāḥ
rukmiṇyādyā
mahiṣyo''ṣṭa kṛṣṇasyāntaḥ-pure
kila', E'mādhurya-hlādinī-śakteḥ
praticchāyā svarūpakāḥ
rukmiṇyādyā
mahiṣyo''ṣṭa kṛṣṇasyāntaḥ-pure
kila',
    E'mādhurya-hlādinī-śakteḥ
praticchāyā svarūpakāḥ
rukmiṇyādyā
mahiṣyo''ṣṭa kṛṣṇasyāntaḥ-pure
kila', E'ма̄дгурйа-хла̄дінı̄-ш́актех̣
пратіччха̄йа̄ сварӯпака̄х̣
рукмін̣йа̄дйа̄
махішйо''шт̣а кр̣шн̣асйа̄нтах̣-пуре
кіла',
    E'', E'',
    E'The sentiments of the Lord in His sweet feature are unbroken, but the
sentiments of the Lord in Dvaraka, the shelter of opulent regulative devotional
service, are not like that, because many sons and grandsons expand His family
of those sentiments.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'aiśvarye
phalavān kṛṣṇaḥ santater vistṛtir
yataḥ
sātvatāḿ
vaḿśa-saḿvṛddhiḥ dvārakāyāḿ
satāḿ hṛdi', E'aiśvarye
phalavān kṛṣṇaḥ santater vistṛtir
yataḥ
sātvatāḿ
vaḿśa-saḿvṛddhiḥ dvārakāyāḿ
satāḿ hṛdi',
    E'aiśvarye
phalavān kṛṣṇaḥ santater vistṛtir
yataḥ
sātvatāḿ
vaḿśa-saḿvṛddhiḥ dvārakāyāḿ
satāḿ hṛdi', E'аіш́варйе
пхалава̄н кр̣шн̣ах̣ сантатер вістр̣тір
йатах̣
са̄твата̄ḿ
ваḿш́а-саḿвр̣ддгіх̣ два̄рака̄йа̄ḿ
сата̄ḿ хр̣ді',
    E'', E'',
    E'The demoniac philosophy, in the form of monism, took birth in Kasi, the abode
of Shiva, wherein a wretched person claimed to be Vasudeva (Paundraka) and
preached that demoniac philosophy. The Lord, who is the husband of Rama, killed', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sthūlārtha-bodhake
granthe na teṣām artha-nirṇayaḥ
pṛthag-rūpeṇa
kartavyaḥ sudhiyaḥ prathayantu tat', E'sthūlārtha-bodhake
granthe na teṣām artha-nirṇayaḥ
pṛthag-rūpeṇa
kartavyaḥ sudhiyaḥ prathayantu tat',
    E'sthūlārtha-bodhake
granthe na teṣām artha-nirṇayaḥ
pṛthag-rūpeṇa
kartavyaḥ sudhiyaḥ prathayantu tat', E'стхӯла̄ртха-бодгаке
ґрантхе на теша̄м артха-нірн̣айах̣
пр̣тхаґ-рӯпен̣а
картавйах̣ судгійах̣ пратхайанту тат',
    E'', E'',
    E'Narakasura is also called Bhauma, because he considered the Absolute Truth to
be mundane. The Lord, who sits on Garuda, killed Narakasura, and after
delivering the queens, He married them. The conception of the Deity as an idol
is abominable, because it is foolish to consider the Absolute Truth to be
mundane. There is a great difference between serving the Deity of the Lord and
worshiping idols. Deity worship is an indicator of the Absolute Truth, because
by this process one attains the Absolute Truth. Idol worship, however, means to
accept a material form or formlessness as the Absolute Truth, in other words,
to accept a material form as the Supreme Lord. The Lord ultimately delivered
and accepted those people who were of this opinion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'advaita-rūpiṇaḿ
daityaḿ hatvā kāśīḿ ramā-patiḥ
hara-dhāmādahat
kṛṣṇas tad-duṣṭa-mata-pīṭhakam', E'advaita-rūpiṇaḿ
daityaḿ hatvā kāśīḿ ramā-patiḥ
hara-dhāmādahat
kṛṣṇas tad-duṣṭa-mata-pīṭhakam',
    E'advaita-rūpiṇaḿ
daityaḿ hatvā kāśīḿ ramā-patiḥ
hara-dhāmādahat
kṛṣṇas tad-duṣṭa-mata-pīṭhakam', E'адваіта-рӯпін̣аḿ
даітйаḿ хатва̄ ка̄ш́ı̄ḿ рама̄-патіх̣
хара-дга̄ма̄дахат
кр̣шн̣ас тад-душт̣а-мата-пı̄т̣хакам',
    E'', E'',
    E'The Lord had Jarasandha killed by Bhima, the brother of Dharma. He then rescued
many kings from the bondage of karma.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'bhaumabuddhimayaḿ
bhaumaḿ hatvā sa garuḍāsanaḥ
uddhṛtya
ramaṇīvṛndamupayeme priyaḥ satām', E'bhaumabuddhimayaḿ
bhaumaḿ hatvā sa garuḍāsanaḥ
uddhṛtya
ramaṇīvṛndamupayeme priyaḥ satām',
    E'bhaumabuddhimayaḿ
bhaumaḿ hatvā sa garuḍāsanaḥ
uddhṛtya
ramaṇīvṛndamupayeme priyaḥ satām', E'бгаумабуддгімайаḿ
бгаумаḿ хатва̄ са ґаруд̣а̄санах̣
уддгр̣тйа
раман̣ı̄вр̣ндамупайеме прійах̣ сата̄м',
    E'', E'',
    E'The Lord accepted unlimited worship in Yudhisthira''s sacrifice and severed the
head of Sisupala, the personification of envy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'ghāṭayitvā
jarāsandhaḿ bhīmena dharma-bhrātṛṇā
amocayad
bhūmi-pālān karma-pāśasya bandhanāt', E'ghāṭayitvā
jarāsandhaḿ bhīmena dharma-bhrātṛṇā
amocayad
bhūmi-pālān karma-pāśasya bandhanāt',
    E'ghāṭayitvā
jarāsandhaḿ bhīmena dharma-bhrātṛṇā
amocayad
bhūmi-pālān karma-pāśasya bandhanāt', E'ґга̄т̣айітва̄
джара̄сандгаḿ бгı̄мена дгарма-бгра̄тр̣н̣а̄
амочайад
бгӯмі-па̄ла̄н карма-па̄ш́асйа бандгана̄т',
    E'', E'',
    E'The Lord protected society by reestablishing the principles of religion, and He
removed the burden of the world by arranging the Battle of Kurukshetra.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'yajñe ca dharma-putrasya
labdhvā pūjām aśeṣataḥ
cakarta
śiśupālasya śiraḥ sandveṣṭur
ātmanaḥ', E'yajñe ca dharma-putrasya
labdhvā pūjām aśeṣataḥ
cakarta
śiśupālasya śiraḥ sandveṣṭur
ātmanaḥ',
    E'yajñe ca dharma-putrasya
labdhvā pūjām aśeṣataḥ
cakarta
śiśupālasya śiraḥ sandveṣṭur
ātmanaḥ', E'йаджн̃е ча дгарма-путрасйа
лабдгва̄ пӯджа̄м аш́ешатах̣
чакарта
ш́іш́упа̄ласйа ш́ірах̣ сандвешт̣ур
а̄тманах̣',
    E'', E'',
    E'Narada Muni visited Dvaraka and was struck with the depth of the Absolute Truth
when he saw that Krsna was simultaneously present in each of the queens''
houses. It is very wonderful that the Supreme Lord is simultaneously and fully
present everywherewithin the heart of all living entities and engaged in
various pastimes. The quality of omnipresence is insignificant for the Almighty
Lord.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'kurukṣetra-raṇe
kṛṣṇo dharā-bhāraḿ nivartya saḥ
samāja-rakṣaṇaḿ
kāryam akarot karuṇā-mayaḥ', E'kurukṣetra-raṇe
kṛṣṇo dharā-bhāraḿ nivartya saḥ
samāja-rakṣaṇaḿ
kāryam akarot karuṇā-mayaḥ',
    E'kurukṣetra-raṇe
kṛṣṇo dharā-bhāraḿ nivartya saḥ
samāja-rakṣaṇaḿ
kāryam akarot karuṇā-mayaḥ', E'курукшетра-ран̣е
кр̣шн̣о дгара̄-бга̄раḿ нівартйа сах̣
сама̄джа-ракшан̣аḿ
ка̄рйам акарот карун̣а̄-майах̣',
    E'', E'',
    E'Dantavakra, the personification of uncivilized man, was killed by the Lord. The
Lord then arranged the marriage of His sister, Subhadra, with Arjuna, the
brother of Yudhisthira. In order to establish a relationship between the Lord
and an enjoyed living entity who has not developed the nature of being the
Lord''s consort, the hladini aspect of the mood of friendship selects an
inconceivable devotee to take the role of Subhadra, who becomes very near to
the Lord as His sister. Subhadra is to be enjoyed by a devotee like Arjuna.
This relationship, however, is not as exalted as found in Vraja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sarvāsāḿ
mahiṣīṇāḿ ca pratisadma hariḿ muniḥ
dṛṣṭvā
ca nārado''gacchad vismayaḿ tattva-nirṇaye', E'sarvāsāḿ
mahiṣīṇāḿ ca pratisadma hariḿ muniḥ
dṛṣṭvā
ca nārado''gacchad vismayaḿ tattva-nirṇaye',
    E'sarvāsāḿ
mahiṣīṇāḿ ca pratisadma hariḿ muniḥ
dṛṣṭvā
ca nārado''gacchad vismayaḿ tattva-nirṇaye', E'сарва̄са̄ḿ
махішı̄н̣а̄ḿ ча пратісадма харіḿ муніх̣
др̣шт̣ва̄
ча на̄радо''ґаччхад вісмайаḿ таттва-нірн̣айе',
    E'', E'',
    E'The Lord protected Dvaraka by killing Salva, who possessed mystical powers. The
scientific arts are most insignificant before the Lord. King Nrga was suffering
the results of his bad karma in the form of a lizard, but he was delivered by
the mercy of the Lord.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'kadarya-bhāva-rūpaḥ
sa dantavakro hatas tadā
subhadrāḿ
dharma-bhrātre hi narāya dattavān prabhuḥ', E'kadarya-bhāva-rūpaḥ
sa dantavakro hatas tadā
subhadrāḿ
dharma-bhrātre hi narāya dattavān prabhuḥ',
    E'kadarya-bhāva-rūpaḥ
sa dantavakro hatas tadā
subhadrāḿ
dharma-bhrātre hi narāya dattavān prabhuḥ', E'кадарйа-бга̄ва-рӯпах̣
са дантавакро хатас тада̄
субгадра̄ḿ
дгарма-бгра̄тре хі нара̄йа даттава̄н прабгух̣',
    E'', E'',
    E'If the most relishable item is offered by a nondevotee, the Lord does not
accept it. But if an ordinary item is offered with love, the Lord accepts it.
This was demonstrated when the Lord ate the rice that Sudama offered.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'śālvamāyāḿ
nāśayitvā rarakṣa dvārakāḿ purīm
nṛgaḿ tu
kṛkalāsatvāt karma-pāśād amocayat', E'śālvamāyāḿ
nāśayitvā rarakṣa dvārakāḿ purīm
nṛgaḿ tu
kṛkalāsatvāt karma-pāśād amocayat',
    E'śālvamāyāḿ
nāśayitvā rarakṣa dvārakāḿ purīm
nṛgaḿ tu
kṛkalāsatvāt karma-pāśād amocayat', E'ш́а̄лвама̄йа̄ḿ
на̄ш́айітва̄ раракша два̄рака̄ḿ пурı̄м
нр̣ґаḿ ту
кр̣кала̄сатва̄т карма-па̄ш́а̄д амочайат',
    E'', E'',
    E'The monkey Dvivida, the personification of godlessness, was killed by Baladeva,
who possesses ecstatic love for Krsna and who is the reservoir of all living entities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sudāmnā
prīti-dattaḿ ca taṇḍulaḿ bhuktavān hariḥ
pāṣaṇḍānāḿ
pradattena miṣṭena na tathā sukhī', E'sudāmnā
prīti-dattaḿ ca taṇḍulaḿ bhuktavān hariḥ
pāṣaṇḍānāḿ
pradattena miṣṭena na tathā sukhī',
    E'sudāmnā
prīti-dattaḿ ca taṇḍulaḿ bhuktavān hariḥ
pāṣaṇḍānāḿ
pradattena miṣṭena na tathā sukhī', E'суда̄мна̄
прı̄ті-даттаḿ ча тан̣д̣улаḿ бгуктава̄н харіх̣
па̄шан̣д̣а̄на̄ḿ
прадаттена мішт̣ена на татха̄ сукхı̄',
    E'', E'',
    E'In the forests of Vraja, which are created by the samvit aspect of the marginal
potency, Sri Baladeva performed conjugal pastimes with the gopis, the
personifications of ecstatic love.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'balo''pi
śuddha-jīvo''yaḿ kṛṣṇa-prema-vaśaḿ
gataḥ
avadhīd dividaḿ
mūḍhaḿ nirīśvara-pramodakam', E'balo''pi
śuddha-jīvo''yaḿ kṛṣṇa-prema-vaśaḿ
gataḥ
avadhīd dividaḿ
mūḍhaḿ nirīśvara-pramodakam',
    E'balo''pi
śuddha-jīvo''yaḿ kṛṣṇa-prema-vaśaḿ
gataḥ
avadhīd dividaḿ
mūḍhaḿ nirīśvara-pramodakam', E'бало''пі
ш́уддга-джı̄во''йаḿ кр̣шн̣а-према-ваш́аḿ
ґатах̣
авадгı̄д дівідаḿ
мӯд̣хаḿ нірı̄ш́вара-прамодакам',
    E'', E'',
    E'All these pastimes are situated in the hearts of the devotees, but when the
devotees give up their material bodies, the pastimes disappear just as an actor
leaves the stage.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sva-saḿvin-nirmite
dhāmni hṛd-gate rohiṇī-sutaḥ
gopībhir
bhāva-rūpābhī reme bṛhad-vanāntare', E'sva-saḿvin-nirmite
dhāmni hṛd-gate rohiṇī-sutaḥ
gopībhir
bhāva-rūpābhī reme bṛhad-vanāntare',
    E'sva-saḿvin-nirmite
dhāmni hṛd-gate rohiṇī-sutaḥ
gopībhir
bhāva-rūpābhī reme bṛhad-vanāntare', E'сва-саḿвін-нірміте
дга̄мні хр̣д-ґате рохін̣ı̄-сутах̣
ґопı̄бгір
бга̄ва-рӯпа̄бгı̄ реме бр̣хад-вана̄нтаре',
    E'', E'',
    E'The desire of Krsna, in the form of time, separated the Yadavas, the
personifications of affectionate love, from the pastimes of the Lord and
flooded the abode of Dvaraka in the waves of the ocean of forgetfulness. The
desire of Krsna is always pure and devoid of all inauspiciousness. In order to
transfer His devotees to Vaikuntha, the Lord separates them from their material
bodies.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'bhaktānāḿ
hṛdaye śaśvat kṛṣṇa-līlā pravartate
naṭo''pi
sva-puraḿ yāti bhaktānāḿ jīvanātyaye', E'bhaktānāḿ
hṛdaye śaśvat kṛṣṇa-līlā pravartate
naṭo''pi
sva-puraḿ yāti bhaktānāḿ jīvanātyaye',
    E'bhaktānāḿ
hṛdaye śaśvat kṛṣṇa-līlā pravartate
naṭo''pi
sva-puraḿ yāti bhaktānāḿ jīvanātyaye', E'бгакта̄на̄ḿ
хр̣дайе ш́аш́ват кр̣шн̣а-лı̄ла̄ правартате
нат̣о''пі
сва-пураḿ йа̄ті бгакта̄на̄ḿ джı̄вана̄тйайе',
    E'', E'',
    E'This desire of Krsna, which bestows the topmost happiness, obliged the devotees
to give up their old decrepit bodies in Prabhasa-ksetra, the personification of
knowledge of the Absolute Truth. When the body becomes useless, then all the
parts and limbs do not cooperate with each otherthey quarrel. Especially at
the time of death, all the parts and limbs become senseless; but in the hearts
of devotees, remembrance is never lost.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'kṛṣṇecchā
kāla-rūpā sā yādavān bhāva-rūpakān
nivartya
rańgataḥ sādhvī dvārakāḿ plāvayat
tadā', E'kṛṣṇecchā
kāla-rūpā sā yādavān bhāva-rūpakān
nivartya
rańgataḥ sādhvī dvārakāḿ plāvayat
tadā',
    E'kṛṣṇecchā
kāla-rūpā sā yādavān bhāva-rūpakān
nivartya
rańgataḥ sādhvī dvārakāḿ plāvayat
tadā', E'кр̣шн̣еччха̄
ка̄ла-рӯпа̄ са̄ йа̄дава̄н бга̄ва-рӯпака̄н
нівартйа
раńґатах̣ са̄дгвı̄ два̄рака̄ḿ пла̄вайат
тада̄',
    E'', E'',
    E'At the time of giving up the body, the mood that is present in the heart of a
devotee accompanies the pure soul to his glorious position, and the devotee
then eternally resides in the portion of Vaikuntha called Gokula.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'prabhāse
bhagavaj-jñāne jarākrāntān kalevarān
paraspara-vivādena
mocayāmāsa nandinī', E'prabhāse
bhagavaj-jñāne jarākrāntān kalevarān
paraspara-vivādena
mocayāmāsa nandinī',
    E'prabhāse
bhagavaj-jñāne jarākrāntān kalevarān
paraspara-vivādena
mocayāmāsa nandinī', E'прабга̄се
бгаґавадж-джн̃а̄не джара̄кра̄нта̄н калевара̄н
параспара-віва̄дена
мочайа̄ма̄са нандінı̄',
    E'', E'',
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
    E'kṛṣṇa-bhāva-svarūpo''pi
jarākrāntāt kalevarāt
nirgato gokulaḿ
prāpto mahimni sve mahīyate', E'kṛṣṇa-bhāva-svarūpo''pi
jarākrāntāt kalevarāt
nirgato gokulaḿ
prāpto mahimni sve mahīyate',
    E'kṛṣṇa-bhāva-svarūpo''pi
jarākrāntāt kalevarāt
nirgato gokulaḿ
prāpto mahimni sve mahīyate', E'кр̣шн̣а-бга̄ва-сварӯпо''пі
джара̄кра̄нта̄т калевара̄т
нірґато ґокулаḿ
пра̄пто махімні све махı̄йате',
    E'', E'',
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


  -- Chapter 7: Krsna Lila Tattva Vicarah
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Krsna Lila Tattva Vicarah', E'Крішна-ліла-таттва-вічарах̣', 'verses', true)
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
    E'eṣā
līlā vibhor nityā goloke śuddha-dhāmani
svarūpa-bhāva-sampannā
cid-rūpa-vartinī kila', E'eṣā
līlā vibhor nityā goloke śuddha-dhāmani
svarūpa-bhāva-sampannā
cid-rūpa-vartinī kila',
    E'eṣā
līlā vibhor nityā goloke śuddha-dhāmani
svarūpa-bhāva-sampannā
cid-rūpa-vartinī kila', E'еша̄
лı̄ла̄ вібгор нітйа̄ ґолоке ш́уддга-дга̄мані
сварӯпа-бга̄ва-сампанна̄
чід-рӯпа-вартінı̄ кіла',
    E'', E'',
    E'It was previously described how Vaikuntha was created by the sandhini aspect of
the spiritual potency of the superior energy. Vaikuntha is divided into three
divisionsthe sweet division, the opulent division, and the impersonal
division. The impersonal division is the covering of Vaikuntha, the outer
apartment is called the abode of Narayana, and the inner apartment is called
Goloka. The impersonalists attain Brahma-dhama, the impersonal division, and
become free from lamentations caused by maya. The devotees who worship the
opulent aspect of the Lord attain Narayana-dhama and become fearless. The
devotees who worship the sweet aspect of the Lord attain the inner apartment
and relish the nectar of Krsna. Freedom from lamentation, fearlessness, and
nectar are the three-quarter opulences of the Lord known as Vaikuntha. When the
Supreme Lord is endowed with opulence, He is known as Vibhu. This material
world is the one-quarter opulence of Krsna. Various pastimes beginning with the
Lord''s appearance and continuing to His disappearance are eternally manifested
in Goloka. The mood of Goloka is reflected in the conditioned living entities''
hearts, wherein the pastimes of Krsna are also eternally manifest. Therefore
according to the devotees'' qualification, at a particular time Krsna is taking
birth in some devotee''s heart, He is stealing the gopis'' clothes in another
devotee''s heart, He is performing the rasa dance in someone''s heart, He is
killing Putana in another''s heart, He is killing Kamsa in someone else''s heart,
He is having an affair with Kubja in yet another''s heart, and He enacts His
disappearance in the heart of some devotee who is leaving his body. As the
living entities are innumerable, the planets are also. As one pastime takes
place on one planet, another pastime takes place on another planet. In this way
each pastime continually takes place. Therefore all of the Lord''s pastimes are
eternal; there is no break, because the Lord''s energies are always active. All
these pastimes are purely spiritual, without a trace of material contamination.
Although for the conditioned living entities in illusion these pastimes appear
perverted, in reality they are most confidential and spiritual.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'pravarteta dvidhā
sā''pi pātra-bheda-kramād iha
jīve
sāmbandhikī seyaḿ deśa-kāla-vicārataḥ', E'pravarteta dvidhā
sā''pi pātra-bheda-kramād iha
jīve
sāmbandhikī seyaḿ deśa-kāla-vicārataḥ',
    E'pravarteta dvidhā
sā''pi pātra-bheda-kramād iha
jīve
sāmbandhikī seyaḿ deśa-kāla-vicārataḥ', E'правартета двідга̄
са̄''пі па̄тра-бгеда-крама̄д іха
джı̄ве
са̄мбандгікı̄ сейаḿ деш́а-ка̄ла-віча̄ратах̣',
    E'', E'',
    E'These pastimes are constitutionally manifest in Goloka, but the conditioned
living entities perceive them in a relative way. A pastime appears different
because the nature of conditioned souls varies according to time, place, and
person. The pastimes of the Lord are never contaminated, but they may appear to
be due one''s contaminated consideration. It was previously described that the
activities of the spiritual world are not clearly seen by conditioned souls.
Although something may be realized through samadhi, that also is seen through
the perverted material medium of the original spiritual nature. Examples65 are
seen in the place66, time67, and persons68 that are mentioned in the pastimes
of Vraja. All these examples may be understood in two ways. For the
kanistha-adhikaris these examples are only appreciated through complete faith.
There is no other possibility for their advancement. But for the
uttama-adhikaris these examples are accepted as indications of spiritual
variegated nature. When conditioned souls are free from material affinity, then
they will perceive the constitutional pastimes of the Lord.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'vyakti-niṣṭhā
bhaved ekā sarva-niṣṭhā''parā matā
bhaktimad dhṛdaye
sā tu vyakti-niṣṭhā prakāśate', E'vyakti-niṣṭhā
bhaved ekā sarva-niṣṭhā''parā matā
bhaktimad dhṛdaye
sā tu vyakti-niṣṭhā prakāśate',
    E'vyakti-niṣṭhā
bhaved ekā sarva-niṣṭhā''parā matā
bhaktimad dhṛdaye
sā tu vyakti-niṣṭhā prakāśate', E'вйакті-нішт̣ха̄
бгавед ека̄ сарва-нішт̣ха̄''пара̄ мата̄
бгактімад дгр̣дайе
са̄ ту вйакті-нішт̣ха̄ прака̄ш́ате',
    E'', E'',
    E'Conditioned souls naturally perceive the pastimes of the Lord in terms of their
affinity for Him. This affinity is of two kindsthat which is found in an
individual and that which is found in a general mass of people. The affinity
found in the hearts of particular devotees is that which is found in an
individual. The hearts of Prahlada and Dhruva were sitting places for the
pastimes of the Lord as a result of their individual affinity.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'yā līlā
sarva-niṣṭhā tu samāja-jñāna-vardhanāt
nārada-vyāsa-citteṣu
dvāpare sā pravartitā', E'yā līlā
sarva-niṣṭhā tu samāja-jñāna-vardhanāt
nārada-vyāsa-citteṣu
dvāpare sā pravartitā',
    E'yā līlā
sarva-niṣṭhā tu samāja-jñāna-vardhanāt
nārada-vyāsa-citteṣu
dvāpare sā pravartitā', E'йа̄ лı̄ла̄
сарва-нішт̣ха̄ ту сама̄джа-джн̃а̄на-вардгана̄т
на̄рада-вйа̄са-чіттешу
два̄паре са̄ правартіта̄',
    E'', E'',
    E'Just as a particular feature of the Lord appears in and purifies the heart of a
person according to the awakening of his knowledge, if we similarly envision
the whole society as one person and consider its childhood, youth, and old age,
then the particular feature of the Lord that manifests becomes a community
asset. As the community''s knowledge matures, they first take to fruitive
activities, then the cultivation of knowledge, and ultimately they take to
spiritual activities and become purified. The affinity that is found in a general
mass of people first appeared in the hearts of Narada and Vyasa in Dvapara-yuga
and has progressively been propagated as pure Vaisnava religion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'dvārakāyāḿ
hariḥ pūrṇo madhye pūrṇataraḥ
smṛtaḥ
mathurāyāḿ
vijānīyād vraje pūrṇatamaḥ prabhuḥ', E'dvārakāyāḿ
hariḥ pūrṇo madhye pūrṇataraḥ
smṛtaḥ
mathurāyāḿ
vijānīyād vraje pūrṇatamaḥ prabhuḥ',
    E'dvārakāyāḿ
hariḥ pūrṇo madhye pūrṇataraḥ
smṛtaḥ
mathurāyāḿ
vijānīyād vraje pūrṇatamaḥ prabhuḥ', E'два̄рака̄йа̄ḿ
харіх̣ пӯрн̣о мадгйе пӯрн̣атарах̣
смр̣тах̣
матхура̄йа̄ḿ
віджа̄нı̄йа̄д врадже пӯрн̣атамах̣ прабгух̣',
    E'', E'',
    E' 6) This Vaisnava religion in the form of the pastimes of the Lord is divided
into three parts according to the development of a society''s knowledge. The
first part is the pastimes of Dvaraka, where the Lord is opulent, where He is
known as Vibhu, and where His is worshiped through regulative principles. The
second part is seen around Mathura, where the Lord''s opulence is partially
manifest with a greater portion of sweetness. But the third part, the pastimes
of Vraja, is the best of all. Pastimes that contain more sweetness are superior
and more intimate by nature. Therefore Krsna is most complete in the pastimes
of Vraja. Although opulences are part of the Lord''s splendor, they cannot
become prominent before Krsna; because wherever opulences are more prominent,
sweetness is diminished. This is also the case in the material world. Therefore
objects of sweetness like cows, gopas, gopis, cowherds'' dress, butter, forests,
fresh leaves, the Yamuna, and the flute are the only wealth of Vraja-Gokula, or
Vrndavana. What is the need for opulence there?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'pūrṇatvaḿ
kalpitaḿ kṛṣṇe
mādhurya-śuddhatā-kramāt
vraja-līlā-vilāso
hi jīvānāḿ śreṣṭha-bhāvanā', E'pūrṇatvaḿ
kalpitaḿ kṛṣṇe
mādhurya-śuddhatā-kramāt
vraja-līlā-vilāso
hi jīvānāḿ śreṣṭha-bhāvanā',
    E'pūrṇatvaḿ
kalpitaḿ kṛṣṇe
mādhurya-śuddhatā-kramāt
vraja-līlā-vilāso
hi jīvānāḿ śreṣṭha-bhāvanā', E'пӯрн̣атваḿ
калпітаḿ кр̣шн̣е
ма̄дгурйа-ш́уддгата̄-крама̄т
враджа-лı̄ла̄-віла̄со
хі джı̄ва̄на̄ḿ ш́решт̣ха-бга̄вана̄',
    E'', E'',
    E'Supreme rasas under the shelter of the four relationshipsdasya, sakhya,
vatsalya, and madhuryaare eternally existing in the pastimes of Vraja as the
ingredients of all spiritual activities. Among all these rasas, the pastimes of
the Lord with the gopis are the highest. And among these, the Lord''s pastimes
with Srimati Radharani, who is the crest jewel amongst the gopis, are still
higher.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'gopikā-ramaṇaḿ
tasya bhāvānāḿ śreṣṭha ucyate
śrī-rādhā-ramaṇaḿ
tatra sarvordhva-bhāvanā matā', E'gopikā-ramaṇaḿ
tasya bhāvānāḿ śreṣṭha ucyate
śrī-rādhā-ramaṇaḿ
tatra sarvordhva-bhāvanā matā',
    E'gopikā-ramaṇaḿ
tasya bhāvānāḿ śreṣṭha ucyate
śrī-rādhā-ramaṇaḿ
tatra sarvordhva-bhāvanā matā', E'ґопіка̄-раман̣аḿ
тасйа бга̄ва̄на̄ḿ ш́решт̣ха учйате
ш́рı̄-ра̄дга̄-раман̣аḿ
татра сарвордгва-бга̄вана̄ мата̄',
    E'', E'',
    E'Those who relish this topmost spiritual rasa are said to have accepted their
eternal constitutional activities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'etasya rasa-rūpasya
bhāvasya cid-gatasya ca
āsvādana-parā
ye tu te narā nitya-dharminaḥ', E'etasya rasa-rūpasya
bhāvasya cid-gatasya ca
āsvādana-parā
ye tu te narā nitya-dharminaḥ',
    E'etasya rasa-rūpasya
bhāvasya cid-gatasya ca
āsvādana-parā
ye tu te narā nitya-dharminaḥ', E'етасйа раса-рӯпасйа
бга̄васйа чід-ґатасйа ча
а̄сва̄дана-пара̄
йе ту те нара̄ нітйа-дгармінах̣',
    E'', E'',
    E'Fearing to cross the threshold of argument, some madhyama-adhikaris say, Just
try to explain these feelings with simple words. There is no need to use
Krsna''s pastimes as examples. But such type of comments are faulty, for the
variegated nature of Vaikuntha cannot be explained with simple words. Just by
saying, There is a Lord. Worship Him, does not properly explain the living
entities'' supreme constitutional duties. The act of worship is not possible
without a relationship. To be situated in Brahman after giving up maya cannot
be called worship, because in this process only an indirect mood of negation is
accepted; there is nothing positive. But by saying, See the form of the Lord.
Take shelter of the Lord''s lotus feet, the quality of variegated nature is
somewhat accepted. At this juncture we must consider that if one is not fully
satisfied with spiritual variegated nature, one may still address the Absolute
Truth as Lord or Father. Although these relationships appear mundane, there
is nonetheless an indescribable purpose behind them. Since one must accept
material ingredients, activities, and all the perverted mundane reflections of
the relationships of Vaikuntha as examples, swanlike persons must not fear to
extract from these the understanding of spiritual activities and ingredients by
the propensity of swans. Out of fear that foreign scholars will not understand
this and accuse us as idol worshipers, should we submerge the jewel of
spiritualism? Those who will criticize are certainly immature in their
conclusions. Being on a higher platform, why should we fear their fallacious
conclusions? The science of rasa cannot be fully explained by ordinary words,
therefore poets such as Vyasadeva have elaborately described the pastimes of
Krsna. Those wonderful pastimes of the Lord are the respected wealth for both
kanistha-adhikaris and uttama-adhikaris.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sāmānya-vākya-yoge
tu rasānāḿ kutra vistṛtiḥ
ato vai kavibhiḥ
kṛṣṇa-līlā-tattvaḿ vitanyate', E'sāmānya-vākya-yoge
tu rasānāḿ kutra vistṛtiḥ
ato vai kavibhiḥ
kṛṣṇa-līlā-tattvaḿ vitanyate',
    E'sāmānya-vākya-yoge
tu rasānāḿ kutra vistṛtiḥ
ato vai kavibhiḥ
kṛṣṇa-līlā-tattvaḿ vitanyate', E'са̄ма̄нйа-ва̄кйа-йоґе
ту раса̄на̄ḿ кутра вістр̣тіх̣
ато ваі кавібгіх̣
кр̣шн̣а-лı̄ла̄-таттваḿ вітанйате',
    E'', E'',
    E'The happiness that Lord Krsna bestows when He is properly served is not
obtained when He is worshiped as Yajnesvara through karma-yoga, as impersonal
Brahman through jnana-yoga, or as Paramatma, the companion of the living
entity, through dhyana-yoga. Therefore serving Krsna is the supreme
occupational duty for all living entitieswhether kanistha-adhikari or
fortunate uttama-adhikari.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'īśo dhyāto
bṛhaj jñātaḿ yajñeśo yajitas tathā
na rāti
paramānandaḿ yathā kṛṣṇaḥ
prasevitaḥ', E'īśo dhyāto
bṛhaj jñātaḿ yajñeśo yajitas tathā
na rāti
paramānandaḿ yathā kṛṣṇaḥ
prasevitaḥ',
    E'īśo dhyāto
bṛhaj jñātaḿ yajñeśo yajitas tathā
na rāti
paramānandaḿ yathā kṛṣṇaḥ
prasevitaḥ', E'ı̄ш́о дгйа̄то
бр̣хадж джн̃а̄таḿ йаджн̃еш́о йаджітас татха̄
на ра̄ті
парама̄нандаḿ йатха̄ кр̣шн̣ах̣
прасевітах̣',
    E'', E'',
    E'All Vaisnavas should read this Krsna-samhita and understand the science of
Krsna. All the results that one achieves by studying Srimad Bhagavatam will be
achieved by studying this book.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'vidanti tattvataḥ
kṛṣṇaḿ paṭhitvedaḿ
suvaiṣṇavāḥ
labhante tat phalaḿ
yat tu labhed bhāgavate naraḥ', E'vidanti tattvataḥ
kṛṣṇaḿ paṭhitvedaḿ
suvaiṣṇavāḥ
labhante tat phalaḿ
yat tu labhed bhāgavate naraḥ',
    E'vidanti tattvataḥ
kṛṣṇaḿ paṭhitvedaḿ
suvaiṣṇavāḥ
labhante tat phalaḿ
yat tu labhed bhāgavate naraḥ', E'віданті таттватах̣
кр̣шн̣аḿ пат̣хітведаḿ
суваішн̣ава̄х̣
лабганте тат пхалаḿ
йат ту лабгед бга̄ґавате нарах̣',
    E'', E'',
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


  -- Chapter 8: Vraja Bhava Vicarah
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Vraja Bhava Vicarah', E'Враджа-бгава-вічарах̣', 'verses', true)
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
    E'atraiva
vraja-bhāvānāḿ śreṣṭhyam uktam
aśeṣataḥ
mathurā-dvārakā-bhāvās
teṣāḿ puṣṭikarā matāḥ', E'atraiva
vraja-bhāvānāḿ śreṣṭhyam uktam
aśeṣataḥ
mathurā-dvārakā-bhāvās
teṣāḿ puṣṭikarā matāḥ',
    E'atraiva
vraja-bhāvānāḿ śreṣṭhyam uktam
aśeṣataḥ
mathurā-dvārakā-bhāvās
teṣāḿ puṣṭikarā matāḥ', E'атраіва
враджа-бга̄ва̄на̄ḿ ш́решт̣хйам уктам
аш́ешатах̣
матхура̄-два̄рака̄-бга̄ва̄с
теша̄ḿ пушт̣ікара̄ мата̄х̣',
    E'', E'',
    E'In this book the moods of Vraja have already been elaborately described. The
moods of Mathura and Dvaraka nourish the moods of Vraja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'yad-bhāva-sańgato
jīvaś cāmṛtatvāya kalpate
jīvasya
mańgalārthāya vraja-bhāvo vivicyate', E'yad-bhāva-sańgato
jīvaś cāmṛtatvāya kalpate
jīvasya
mańgalārthāya vraja-bhāvo vivicyate',
    E'yad-bhāva-sańgato
jīvaś cāmṛtatvāya kalpate
jīvasya
mańgalārthāya vraja-bhāvo vivicyate', E'йад-бга̄ва-саńґато
джı̄ваш́ ча̄мр̣татва̄йа калпате
джı̄васйа
маńґала̄ртха̄йа враджа-бга̄во вівічйате',
    E'', E'',
    E'I will now discuss the moods of Vraja for the auspiciousness of the living
entities. By remaining attached to the moods of Vraja, the living entities
achieve eternal life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'anvaya-vyatirekābhyāḿ
vivicyo''yaḿ mayādhunā
anvayāt pañca
sambandhāḥ śānta-dāsyādayaś ca ye', E'anvaya-vyatirekābhyāḿ
vivicyo''yaḿ mayādhunā
anvayāt pañca
sambandhāḥ śānta-dāsyādayaś ca ye',
    E'anvaya-vyatirekābhyāḿ
vivicyo''yaḿ mayādhunā
anvayāt pañca
sambandhāḥ śānta-dāsyādayaś ca ye', E'анвайа-вйатірека̄бгйа̄ḿ
вівічйо''йаḿ майа̄дгуна̄
анвайа̄т пан̃ча
самбандга̄х̣ ш́а̄нта-да̄сйа̄дайаш́ ча йе',
    E'', E'',
    E'These moods of Vraja will now be directly and indirectly considered. Through
direct consideration, shanta, dasya, sakhya, vatsalya, and madhurya are found.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'kecit tu
vraja-rājasya dāsa-bhāgavatāḥ sadā
apare
sakhya-bhāvāḍhyāḥ
śrīdāma-subalāadayaḥ', E'kecit tu
vraja-rājasya dāsa-bhāgavatāḥ sadā
apare
sakhya-bhāvāḍhyāḥ
śrīdāma-subalāadayaḥ',
    E'kecit tu
vraja-rājasya dāsa-bhāgavatāḥ sadā
apare
sakhya-bhāvāḍhyāḥ
śrīdāma-subalāadayaḥ', E'кечіт ту
враджа-ра̄джасйа да̄са-бга̄ґавата̄х̣ сада̄
апаре
сакхйа-бга̄ва̄д̣хйа̄х̣
ш́рı̄да̄ма-субала̄адайах̣',
    E'', E'',
    E'Some attain the service of the King of Vraja, and the devotees such as Sridama
and Subala serve the Lord in the mood of friendship.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'yaśodā-rohiṇī-nandāḥ
vātsalya-bhāva-saḿsthitāḥ
rādhādyāḥ
kānta-bhāve tu vartante rāsa-maṇḍale', E'yaśodā-rohiṇī-nandāḥ
vātsalya-bhāva-saḿsthitāḥ
rādhādyāḥ
kānta-bhāve tu vartante rāsa-maṇḍale',
    E'yaśodā-rohiṇī-nandāḥ
vātsalya-bhāva-saḿsthitāḥ
rādhādyāḥ
kānta-bhāve tu vartante rāsa-maṇḍale', E'йаш́ода̄-рохін̣ı̄-нанда̄х̣
ва̄тсалйа-бга̄ва-саḿстхіта̄х̣
ра̄дга̄дйа̄х̣
ка̄нта-бга̄ве ту вартанте ра̄са-ман̣д̣але',
    E'', E'',
    E'Yashoda, Rohini, and Nanda are the examples of parental love, and gopis such as
Sri Radhika are present in the rasa-mandala in the conjugal mood.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'vṛndāvanaḿ
vinā nāsti śuddha-sambandha-bhāvakaḥ
ato vai
śuddha-jīvānāḿ ramye vṛndāvane ratiḥ', E'vṛndāvanaḿ
vinā nāsti śuddha-sambandha-bhāvakaḥ
ato vai
śuddha-jīvānāḿ ramye vṛndāvane ratiḥ',
    E'vṛndāvanaḿ
vinā nāsti śuddha-sambandha-bhāvakaḥ
ato vai
śuddha-jīvānāḿ ramye vṛndāvane ratiḥ', E'вр̣нда̄ванаḿ
віна̄ на̄сті ш́уддга-самбандга-бга̄ваках̣
ато ваі
ш́уддга-джı̄ва̄на̄ḿ рамйе вр̣нда̄ване ратіх̣',
    E'', E'',
    E'Pure relationships and their respective moods are found only in Vrndavana. That
is why pure living entities have a natural attraction for Vrndavana-dhama.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tatraiva
kānta-bhāvasya śreṣṭhatā śāstra-sammatā
jīvasya
nitya-dharmo''yaḿ bhagavad-bhogyatā matā', E'tatraiva
kānta-bhāvasya śreṣṭhatā śāstra-sammatā
jīvasya
nitya-dharmo''yaḿ bhagavad-bhogyatā matā',
    E'tatraiva
kānta-bhāvasya śreṣṭhatā śāstra-sammatā
jīvasya
nitya-dharmo''yaḿ bhagavad-bhogyatā matā', E'татраіва
ка̄нта-бга̄васйа ш́решт̣хата̄ ш́а̄стра-саммата̄
джı̄васйа
нітйа-дгармо''йаḿ бгаґавад-бгоґйата̄ мата̄',
    E'', E'',
    E'All scriptures agree that the conjugal mood of Vrndavana is the topmost,
because the Lord'' nature as the enjoyer and the living entities'' nature as the
enjoyed are purely found therein.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'na tatra
kuṇṭhatā kācit vartate
jīvakṛṣṇayoḥ
akhaṇḍa-paramānandaḥ
sadā syāt prīti-rūpa-dhṛk', E'na tatra
kuṇṭhatā kācit vartate
jīvakṛṣṇayoḥ
akhaṇḍa-paramānandaḥ
sadā syāt prīti-rūpa-dhṛk',
    E'na tatra
kuṇṭhatā kācit vartate
jīvakṛṣṇayoḥ
akhaṇḍa-paramānandaḥ
sadā syāt prīti-rūpa-dhṛk', E'на татра
кун̣т̣хата̄ ка̄чіт вартате
джı̄вакр̣шн̣айох̣
акхан̣д̣а-парама̄нандах̣
сада̄ сйа̄т прı̄ті-рӯпа-дгр̣к',
    E'', E'',
    E'In Vaikuntha, there is no anxiety between Krsna and the living entities, as
both are situated in their eternal constitutional positions. Perpetual supreme
happiness in the form of love is eternally present there.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sambhoga-sukha-puṣṭy-arthaḿ
vipralambho''pi sammataḥ
mathurā-dvārakā-cintā
vraja-bhāva-vivardhinī', E'sambhoga-sukha-puṣṭy-arthaḿ
vipralambho''pi sammataḥ
mathurā-dvārakā-cintā
vraja-bhāva-vivardhinī',
    E'sambhoga-sukha-puṣṭy-arthaḿ
vipralambho''pi sammataḥ
mathurā-dvārakā-cintā
vraja-bhāva-vivardhinī', E'самбгоґа-сукха-пушт̣й-артхаḿ
віпраламбго''пі самматах̣
матхура̄-два̄рака̄-чінта̄
враджа-бга̄ва-вівардгінı̄',
    E'', E'',
    E'The ultimate goal of vraja-rasa is the happiness of enjoyment between Krsna and
the living entities. The mood of separation, in the form of purva-raga, mana,
prema-vaicittya, and pravasa, is extremely essential in nourishing this
happiness. This becomes perfected by contemplation on Mathura and Dvaraka.
Therefore the moods of Mathura and Dvaraka nourish the moods of Vraja, as previously
described.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'prapañca-baddha-jīvānāḿ
vaidha-dharmāśrayāt purā
adhunā
kṛṣṇa-samprāptau
pārakīya-rasāśrayaḥ', E'prapañca-baddha-jīvānāḿ
vaidha-dharmāśrayāt purā
adhunā
kṛṣṇa-samprāptau
pārakīya-rasāśrayaḥ',
    E'prapañca-baddha-jīvānāḿ
vaidha-dharmāśrayāt purā
adhunā
kṛṣṇa-samprāptau
pārakīya-rasāśrayaḥ', E'прапан̃ча-баддга-джı̄ва̄на̄ḿ
ваідга-дгарма̄ш́райа̄т пура̄
адгуна̄
кр̣шн̣а-сампра̄птау
па̄ракı̄йа-раса̄ш́райах̣',
    E'', E'',
    E'According to their qualification, the conditioned living entities first take
shelter of regulative devotional service. Later, when attachment awakens, the
mood of Vraja awakens. When one externally follows the regulative process of
devotional service and internally takes shelter of attachment to Krsna, then
the relationship between Krsna and the devotee known as parakiya-rasa, or
paramour love, is appreciated. Just as a married woman becomes overwhelmed by
the beauty of another man and secretly becomes attached to him while externally
respecting her own husband, similarly the lovers of Krsna take shelter of
parakiya-rasa by internally cultivating attachment while externally following
the regulative principles and respecting the Lord and protector of those
principles. This science is very important for persons in the conjugal rasa.
The uttama-adhikaris can never give this up even if they are criticized by the
madhyama-adhikaris. This book is not meant for the kanistha-adhikaris, therefore
the regulative principles are not being elaborated herein. One will have to
study these regulative principles from books like Hari-bhakti-vilasa. The main
purport of the regulative principles is that when the conditioned living
entities'' constitutional duties are almost dormant, or pervertedly reflected as
attachment for material objects, then whatever the learned doctors prescribe in
order to cure the disease are called regulative principles. While wandering in
the material world, a great personality is able to arouse his dormant
attachment by certain activities. He bestows his mercy on the living entities
by establishing those activities as a form of spiritual practice. The
prescriptions given by those great personalities must be followed by the kanistha-adhikaris
as though they were scriptural injunctions. The sages who establish these
prescriptions are all uttama-adhikaris and swanlike personalities. Those
persons who cannot awaken attachment by their own efforts have no alternative
other than following these prescriptions. In the Srimad Bhagavatam those
prescriptions are classified into nine divisions, beginning with hearing and
chanting. Those prescriptions have been further discussed in
Bhakti-rasamrita-sindhu as sixty-four limbs. The conclusion is that those whose
natural attachment is practically dormant are eligible for vidhi-marga, the
path of regulative principles; but as soon as attachment is awakened, the path
of regulative principles becomes secondary. Those regulative principles that
are followed in order to awaken one''s attachment while cultivating Krsna
consciousness should be followed with gratefulness long after attachment is
awakened, so that people can follow that example. In any case, swanlike
mahatmas reserve the right of either following or giving up the regulative
principles.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'śrī-gopī-bhāvam
āśritya mañjarī-sevanaḿ tadā
sakhīnāḿ
sańgatis tasmāt tasmād
rādhā-padāśrayaḥ', E'śrī-gopī-bhāvam
āśritya mañjarī-sevanaḿ tadā
sakhīnāḿ
sańgatis tasmāt tasmād
rādhā-padāśrayaḥ',
    E'śrī-gopī-bhāvam
āśritya mañjarī-sevanaḿ tadā
sakhīnāḿ
sańgatis tasmāt tasmād
rādhā-padāśrayaḥ', E'ш́рı̄-ґопı̄-бга̄вам
а̄ш́рітйа ман̃джарı̄-севанаḿ тада̄
сакхı̄на̄ḿ
саńґатіс тасма̄т тасма̄д
ра̄дга̄-пада̄ш́райах̣',
    E'', E'',
    E'In the upasana-kanda, or Vedic division on worship, attachment is divided into
three categoriespure attachment, attachment in the mood of Vaikuntha, and
attachment based on material examples of spiritual relationships. Pure
attachment, or mahabhava, is the property of Radhika, who is half of Krsna''s
form. Similar but slightly different to mahabhava are the eight pure symptoms
of transcendental ecstatic love, personified by the eight sakhis. Similar to the
mood of the sakhis (please see the commentary on 7.2) are attachments based on
material examples of spiritual relationships, personified by the manjaris. The
worshiper should first take shelter of a manjari who has a nature similar to
his own. Later he should take shelter of the sakhi who is worshiped by that
manjari. By the mercy of that sakhi, one will attain the shelter of the lotus
feet of Sri Radhika. The positions of a worshiper, a manjari, a sakhi, and
Srimati Radhika in the circle of the rasa dance are similar to an asteroid, a
planet, the sun, and Dhruvaloka of the material world.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tatraiva
bhāva-bāhulyān mahābhāvo bhaved dhruvam
tatraiva
kṛṣṇa-sambhogaḥ sarvānanda-pradāyakaḥ', E'tatraiva
bhāva-bāhulyān mahābhāvo bhaved dhruvam
tatraiva
kṛṣṇa-sambhogaḥ sarvānanda-pradāyakaḥ',
    E'tatraiva
bhāva-bāhulyān mahābhāvo bhaved dhruvam
tatraiva
kṛṣṇa-sambhogaḥ sarvānanda-pradāyakaḥ', E'татраіва
бга̄ва-ба̄хулйа̄н маха̄бга̄во бгавед дгрувам
татраіва
кр̣шн̣а-самбгоґах̣ сарва̄нанда-прада̄йаках̣',
    E'', E'',
    E'When the living entities approach mahabhava by gradual advancement of their
loving emotions, then enjoyment with Krsna, which bestows unlimited bliss, is
easily attained.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'etasyāḿ
vraja-bhāvānāḿ sampattau pratibandhakāḥ
aṣṭādaśa-vidhāḥ
santi śatravaḥ prīti-dūṣakāḥ', E'etasyāḿ
vraja-bhāvānāḿ sampattau pratibandhakāḥ
aṣṭādaśa-vidhāḥ
santi śatravaḥ prīti-dūṣakāḥ',
    E'etasyāḿ
vraja-bhāvānāḿ sampattau pratibandhakāḥ
aṣṭādaśa-vidhāḥ
santi śatravaḥ prīti-dūṣakāḥ', E'етасйа̄ḿ
враджа-бга̄ва̄на̄ḿ сампаттау пратібандгака̄х̣
ашт̣а̄даш́а-відга̄х̣
санті ш́атравах̣ прı̄ті-дӯшака̄х̣',
    E'', E'',
    E'There are eighteen obstacles that pollute one''s ecstatic love in the wonderful
mood of Vraja. Contemplating the names of these obstacles is the indirect
consideration of the mood of Vraja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'ādau
duṣṭa-guru-prāptiḥ pūtanā
stanya-dāyinī
vātyā-rūpa-kutarkas
tu tṛṇāvarta itīritaḥ', E'ādau
duṣṭa-guru-prāptiḥ pūtanā
stanya-dāyinī
vātyā-rūpa-kutarkas
tu tṛṇāvarta itīritaḥ',
    E'ādau
duṣṭa-guru-prāptiḥ pūtanā
stanya-dāyinī
vātyā-rūpa-kutarkas
tu tṛṇāvarta itīritaḥ', E'а̄дау
душт̣а-ґуру-пра̄птіх̣ пӯтана̄
станйа-да̄йінı̄
ва̄тйа̄-рӯпа-кутаркас
ту тр̣н̣а̄варта ітı̄рітах̣',
    E'', E'',
    E'Persons who are on the path of attachment should avoid the first obstacle,
accepting a bogus guru, by discussing Putana''s arrival in Vraja in the guise of
a nurse [see Appendix A]. There are two types of gurusantaranga, or internal,
and bahiranga, or external. The living entity who is situated in samadhi is his
own antaranga guru69. One who accepts argument as his guru and who learns the
process of worship from such a guru is said to have accepted the shelter of a
bogus guru. When argument poses as nourishment for the living entities''
constitutional duties, this may be compared with Putana''s falsely posing as a
nurse. Worshipers on the path of attachment must immerse all arguments in
spiritual subjects and take shelter of samadhi. The external guru is he from
whom the science of worship is learned. One who knows the proper path of
attachment and who instructs his disciples according to their qualification is
a sad-guru, or eternal guru. One who does not know the path of attachment yet
instructs others in this path or who knows that path and instructs his disciples
without considering their qualification is a bogus guru and must be given up.
The second obstacle is false arguments. It is difficult for one''s ecstatic
emotion to be awakened until Trnavarta, in the form of a whirlwind, is killed
in Vraja. In the form of Trnavarta, the arguments of philosophers, Buddhists,
and logicians are all obstacles to the ecstatic emotion of Vraja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tṛtīye
bhāra-vāhitvaḿ śakaṭaḿ buddhi-mardakam
caturthe
bāla-doṣāṇāḿ svarūpo
vatsa-rūpa-dhṛk', E'tṛtīye
bhāra-vāhitvaḿ śakaṭaḿ buddhi-mardakam
caturthe
bāla-doṣāṇāḿ svarūpo
vatsa-rūpa-dhṛk',
    E'tṛtīye
bhāra-vāhitvaḿ śakaṭaḿ buddhi-mardakam
caturthe
bāla-doṣāṇāḿ svarūpo
vatsa-rūpa-dhṛk', E'тр̣тı̄йе
бга̄ра-ва̄хітваḿ ш́акат̣аḿ буддгі-мардакам
чатуртхе
ба̄ла-доша̄н̣а̄ḿ сварӯпо
ватса-рӯпа-дгр̣к',
    E'', E'',
    E'Those who do not understand the purpose of the regulative principles but simply
carry the burden of following them out of formality are unable to develop
attachment. When one destroys Sakata, who personifies carrying the burden of
the regulative principles, the third obstacle is overcome. Bogus gurus who did
not consider their disciples'' qualification for the path of attachment and thus
instructed many Sakata-like people to accept service in the mood of manjaris
and sakhis committed offenses in the form of disrespecting confidential subject
matters and fell down. Those who worship according to such instructions also
gradually fall away from spiritual life, because they do not attain the
symptoms of deep attachment for those topics. Yet they may still be delivered
by the association of devotees and proper instructions. This is called breaking
Sakata. The living entities are sober by nature, but when they are disturbed
due to possessing a body made of blood and flesh it is called bala-dosa, or
juvenile offenses. This is the fourth obstacle, in the form of Vatsasura [see
Appendix B].', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'pañcame
dharma-kāpaṭyaḿ nāmāparādha-rūpakam
baka-rūpī
mahā-dhūrto vaiṣṇavānāḿ virodhakaḥ', E'pañcame
dharma-kāpaṭyaḿ nāmāparādha-rūpakam
baka-rūpī
mahā-dhūrto vaiṣṇavānāḿ virodhakaḥ',
    E'pañcame
dharma-kāpaṭyaḿ nāmāparādha-rūpakam
baka-rūpī
mahā-dhūrto vaiṣṇavānāḿ virodhakaḥ', E'пан̃чаме
дгарма-ка̄пат̣йаḿ на̄ма̄пара̄дга-рӯпакам
бака-рӯпı̄
маха̄-дгӯрто ваішн̣ава̄на̄ḿ віродгаках̣',
    E'', E'',
    E'The most clever Bakasura, who is the personification of cheating religion, is
the fifth obstacle for Vaisnavas. This is called namaparadha, offenses against
the holy name of the Lord. Those who do not understand their qualification but
accept the instruction of a bogus guru and engage in the process of worship
meant for exalted devotees are cheated asslike people. And those who have
understood their ineligibility yet with a goal to accumulate money and prestige
still follow the process of worship meant for exalted devotees are called
cheaters. Until this cheating in the name of religion is destroyed, one''s
attachment will not awaken. Such people deceive the entire world by making a
show of sectarian formalities and pseudo-renunciation.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'dāmbhikānāḿ
na sā prītiḥ kṛṣṇe vraja-nivāsini
tatraiva
sampradāyānāḿ bāhya-lińga-samādarāt', E'dāmbhikānāḿ
na sā prītiḥ kṛṣṇe vraja-nivāsini
tatraiva
sampradāyānāḿ bāhya-lińga-samādarāt',
    E'dāmbhikānāḿ
na sā prītiḥ kṛṣṇe vraja-nivāsini
tatraiva
sampradāyānāḿ bāhya-lińga-samādarāt', E'да̄мбгіка̄на̄ḿ
на са̄ прı̄тіх̣ кр̣шн̣е враджа-ніва̄сіні
татраіва
сампрада̄йа̄на̄ḿ ба̄хйа-ліńґа-сама̄дара̄т',
    E'', E'',
    E'Those who see and respect such proud people''s show of external formalities
cannot attain love for Krsna and are like thorns in the side of the world. It
is to be understood here that one should not disrespect a swanlike person just
because he has accepted external formalities that are generally considered
detestable. It is the eternal duty of Vaisnavas to develop the symptoms of love
by associating with and serving devotees, while remaining indifferent to
external formalities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'nṛśaḿsatvaḿ
pracaṇḍatvam aghāsura-svarūpakam
ṣaṣṭhāparādha-rūpo''yaḿ
vartate pratibandhakaḥ', E'nṛśaḿsatvaḿ
pracaṇḍatvam aghāsura-svarūpakam
ṣaṣṭhāparādha-rūpo''yaḿ
vartate pratibandhakaḥ',
    E'nṛśaḿsatvaḿ
pracaṇḍatvam aghāsura-svarūpakam
ṣaṣṭhāparādha-rūpo''yaḿ
vartate pratibandhakaḥ', E'нр̣ш́аḿсатваḿ
прачан̣д̣атвам аґга̄сура-сварӯпакам
шашт̣ха̄пара̄дга-рӯпо''йаḿ
вартате пратібандгаках̣',
    E'', E'',
    E'Aghasura, the personification of intolerance and cruelty, is the sixth
obstacle. Due to a lack of compassion for the living entities there is a
possibility that one''s attachment will gradual diminish, because compassion
cannot remain separated from attachment. The basis of compassion for the living
entities and devotion to Krsna is the same.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'bahu-śāstra-vicāreṇa
yan moho vartate satām
sa eva saptamo lakṣyo
brahmaṇo mohane kila', E'bahu-śāstra-vicāreṇa
yan moho vartate satām
sa eva saptamo lakṣyo
brahmaṇo mohane kila',
    E'bahu-śāstra-vicāreṇa
yan moho vartate satām
sa eva saptamo lakṣyo
brahmaṇo mohane kila', E'баху-ш́а̄стра-віча̄рен̣а
йан мохо вартате сата̄м
са ева саптамо лакшйо
брахман̣о мохане кіла',
    E'', E'',
    E'If one intensely absorbs his mind in various arguments, opinions, and their
respective literatures, then all realizations attained through samadhi are
practically lost. This is called illusion based on the flowery words of the
Vedas. Being overwhelmed with this illusion, Brahma doubted the supremacy of
Krsna. The Vaisnavas should regard this illusion as the seventh obstacle.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'dhenukaḥ
sthūla-buddhiḥ syād gardabhas tāla-rodhakaḥ
aṣṭame
lakṣyate doṣaḥ sampradāye satāḿ mahān', E'dhenukaḥ
sthūla-buddhiḥ syād gardabhas tāla-rodhakaḥ
aṣṭame
lakṣyate doṣaḥ sampradāye satāḿ mahān',
    E'dhenukaḥ
sthūla-buddhiḥ syād gardabhas tāla-rodhakaḥ
aṣṭame
lakṣyate doṣaḥ sampradāye satāḿ mahān', E'дгенуках̣
стхӯла-буддгіх̣ сйа̄д ґардабгас та̄ла-родгаках̣
ашт̣аме
лакшйате дошах̣ сампрада̄йе сата̄ḿ маха̄н',
    E'', E'',
    E'Subtle discrimination is extremely important for Vaisnavas. Those who invent
social distinctions and preach the unbreakable principles of Vaishnavism while
breaking them to suit their needs are said to possess gross discrimination.
This gross discrimination takes the form of the ass Dhenuka. The ass cannot eat
the sweet palm tree fruits, and he opposes others'' attempts to eat them. The
purport is that the previous acaryas of the authorized sampradayas have written
many spiritual literatures, which people with gross discrimination neither
understand nor allow others to see. Asslike devotees who are simply interested
in the regulative principles and under the control of gross discrimination are
unable to attain a higher platform. Vaisnava principles are so unlimitedly
exalted that those who simply remain entangled in the regulative process
without endeavoring to understand the science of attachment are comparable to
ordinary fruitive workers. Therefore, until the ass Dhenukasura is killed, one
cannot advance in the science of Vaishnavism.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'indriyāṇi
bhajanty eke tyaktvā vaidha-vidhiḿ śubham
navame
vṛṣabhās te''pi naśyante
kṛṣṇa-tejasā', E'indriyāṇi
bhajanty eke tyaktvā vaidha-vidhiḿ śubham
navame
vṛṣabhās te''pi naśyante
kṛṣṇa-tejasā',
    E'indriyāṇi
bhajanty eke tyaktvā vaidha-vidhiḿ śubham
navame
vṛṣabhās te''pi naśyante
kṛṣṇa-tejasā', E'індрійа̄н̣і
бгаджантй еке тйактва̄ ваідга-відгіḿ ш́убгам
наваме
вр̣шабга̄с те''пі наш́йанте
кр̣шн̣а-теджаса̄',
    E'', E'',
    E'Many weak-hearted people give up the path of regulative principles and enter
the path of attachment. When they are unable to realize the souls'' spiritual
attachment, they behave like Vrishabhasura [Arishtasura, the bull] by
cultivating perverted material attachment. They will be killed by the prowess
of Krsna. The example of this obstacle is regularly found among the selfish
dharma-dvajis, the show-bottle devotees.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'khalatā daśame lakṣyā
kālīye sarpa-rūpake
sampradāya-virodho''yaḿ
dāvānalo vicintyate', E'khalatā daśame lakṣyā
kālīye sarpa-rūpake
sampradāya-virodho''yaḿ
dāvānalo vicintyate',
    E'khalatā daśame lakṣyā
kālīye sarpa-rūpake
sampradāya-virodho''yaḿ
dāvānalo vicintyate', E'кхалата̄ даш́аме лакшйа̄
ка̄лı̄йе сарпа-рӯпаке
сампрада̄йа-віродго''йаḿ
да̄ва̄нало вічінтйате',
    E'', E'',
    E'Kaliya''s malice always pollutes the water of the Yamuna, which is the spiritual
liquid of the Vaisnavas. It is everyone''s duty to give up this tenth obstacle
[see Appendix C]. The eleventh obstacle of the Vaisnavas is sectarianism, which
takes the shape of the forest fire. Due to sectarianism a person cannot accept
anyone outside of his own group as a Vaisnava, and as a result he faces many
obstacles in finding a guru and associating with devotees. Therefore
extinguishing the forest fire is most important.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'pralambo dvādaśe
cauryam ātmano brahma-vādinām
praviṣṭaḥ
kṛṣṇa-dāsye''pi vaiṣṇavānāḿ
sutaskaraḥ', E'pralambo dvādaśe
cauryam ātmano brahma-vādinām
praviṣṭaḥ
kṛṣṇa-dāsye''pi vaiṣṇavānāḿ
sutaskaraḥ',
    E'pralambo dvādaśe
cauryam ātmano brahma-vādinām
praviṣṭaḥ
kṛṣṇa-dāsye''pi vaiṣṇavānāḿ
sutaskaraḥ', E'праламбо два̄даш́е
чаурйам а̄тмано брахма-ва̄діна̄м
правішт̣ах̣
кр̣шн̣а-да̄сйе''пі ваішн̣ава̄на̄ḿ
сутаскарах̣',
    E'', E'',
    E'The impersonalists desire to merge the soul in the impersonal Brahman. In other
words, searching for the liberation of complete merging is the defect of
stealing the self, because there is no happiness in this state. Neither the
living entity nor the Lord gain anything from this. If one believes the
impersonalists'' philosophy, then he must accept this material world as false.
One then denounces Brahman as indifferent and gradually develops doubts about
the basis of Brahman. If one deeply discusses this topic, then he is compelled
this philosophy enters amongst Vaisnavas in the form of Pralambasura to spread
anarthas, in the form of stealing the self. This is the twelve obstacle in the
Vaisnavas'' science of love.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'karmaṇaḥ
phalam anvīkṣya devendrādi-prapūjanam
trayodaśātmako
doṣo varjanīyaḥ prayatnataḥ', E'karmaṇaḥ
phalam anvīkṣya devendrādi-prapūjanam
trayodaśātmako
doṣo varjanīyaḥ prayatnataḥ',
    E'karmaṇaḥ
phalam anvīkṣya devendrādi-prapūjanam
trayodaśātmako
doṣo varjanīyaḥ prayatnataḥ', E'карман̣ах̣
пхалам анвı̄кшйа девендра̄ді-прапӯджанам
трайодаш́а̄тмако
дошо варджанı̄йах̣ прайатнатах̣',
    E'', E'',
    E'The thirteenth obstacle for the Vaisnavas is the worship of minor demigods such
as Indra with a desire for fruitive results even after becoming situated in the
process of devotional service.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'cauryānṛta-mayo
doṣo vyomāsura-svarūpakaḥ
śrī-kṛṣṇa-prīti-paryāptau
narāṇāḿ pratibandhakaḥ', E'cauryānṛta-mayo
doṣo vyomāsura-svarūpakaḥ
śrī-kṛṣṇa-prīti-paryāptau
narāṇāḿ pratibandhakaḥ',
    E'cauryānṛta-mayo
doṣo vyomāsura-svarūpakaḥ
śrī-kṛṣṇa-prīti-paryāptau
narāṇāḿ pratibandhakaḥ', E'чаурйа̄нр̣та-майо
дошо вйома̄сура-сварӯпаках̣
ш́рı̄-кр̣шн̣а-прı̄ті-парйа̄птау
нара̄н̣а̄ḿ пратібандгаках̣',
    E'', E'',
    E'The fourteenth obstacle in developing love for Krsna is stealing others''
property and speaking lies. These create disturbances in Vraja in the form of
Vyomasura.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'varjanīyaḿ
sadā sadbhir vismṛtir hy ātmano yataḥ
varuṇālaya-samprāptir
nandasya citta-mādakam', E'varjanīyaḿ
sadā sadbhir vismṛtir hy ātmano yataḥ
varuṇālaya-samprāptir
nandasya citta-mādakam',
    E'varjanīyaḿ
sadā sadbhir vismṛtir hy ātmano yataḥ
varuṇālaya-samprāptir
nandasya citta-mādakam', E'варджанı̄йаḿ
сада̄ садбгір вісмр̣тір хй а̄тмано йатах̣
варун̣а̄лайа-сампра̄птір
нандасйа чітта-ма̄дакам',
    E'', E'',
    E'The transcendental happiness of the living entities in Vraja is known as nanda.
In order to enhance that happiness, some deluded people drink wine, and as a
result they create the great anartha of forgetting themselves. Kidnapping Nanda
to the abode of Varuna is the fifteenth obstacle for the Vaisnavas. People who
are absorbed in the mood of Vraja never drink wine.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'pratiṣṭhā-paratā
bhakti-cchalena bhoga-kāmanā
śańkhacūḍa
iti proktaḥ ṣoḍaśaḥ pratibandhakaḥ', E'pratiṣṭhā-paratā
bhakti-cchalena bhoga-kāmanā
śańkhacūḍa
iti proktaḥ ṣoḍaśaḥ pratibandhakaḥ',
    E'pratiṣṭhā-paratā
bhakti-cchalena bhoga-kāmanā
śańkhacūḍa
iti proktaḥ ṣoḍaśaḥ pratibandhakaḥ', E'пратішт̣ха̄-парата̄
бгакті-ччхалена бгоґа-ка̄мана̄
ш́аńкхачӯд̣а
іті проктах̣ шод̣аш́ах̣ пратібандгаках̣',
    E'', E'',
    E'The desire for gaining fame and sense gratification through bhakti is called
Shankhacuda. This is the sixteenth obstacle. Those whose actions are motivated
by a desire for fame are also proud, therefore Vaisnavas should always be
careful of such persons.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'ānanda-vardhane
kiñcit sāyujyaḿ bhāsate hṛdi
tan
nanda-bhakṣakaḥ sarpas tena muktaḥ
suvaiṣṇavaḥ', E'ānanda-vardhane
kiñcit sāyujyaḿ bhāsate hṛdi
tan
nanda-bhakṣakaḥ sarpas tena muktaḥ
suvaiṣṇavaḥ',
    E'ānanda-vardhane
kiñcit sāyujyaḿ bhāsate hṛdi
tan
nanda-bhakṣakaḥ sarpas tena muktaḥ
suvaiṣṇavaḥ', E'а̄нанда-вардгане
кін̃чіт са̄йуджйаḿ бга̄сате хр̣ді
тан
нанда-бгакшаках̣ сарпас тена муктах̣
суваішн̣авах̣',
    E'', E'',
    E'As the Vaisnavas'' happiness continually increases in the process of worship,
they sometimes lose consciousness. At that time the feeling of merging
overcomes them. This feeling of merging with the Lord is the snake that
swallowed Nanda Maharaja. A practitioner who remains free from this snake will
become a qualified Vaisnava.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 29
  INSERT INTO public.verses (
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
    E'bhakti-tejaḥ-samṛddhyā
tu svotkarṣa-jñānavān naraḥ
kadācid
duṣṭa-buddhyā tu keśighnam avamanyate', E'bhakti-tejaḥ-samṛddhyā
tu svotkarṣa-jñānavān naraḥ
kadācid
duṣṭa-buddhyā tu keśighnam avamanyate',
    E'bhakti-tejaḥ-samṛddhyā
tu svotkarṣa-jñānavān naraḥ
kadācid
duṣṭa-buddhyā tu keśighnam avamanyate', E'бгакті-теджах̣-самр̣ддгйа̄
ту своткарша-джн̃а̄нава̄н нарах̣
када̄чід
душт̣а-буддгйа̄ ту кеш́іґгнам аваманйате',
    E'', E'',
    E'Kesi, a demon in the form of a horse, personifies the practitioner''s conception
of being more expert than others in devotional service. When he comes to Vraja,
he creates a great disturbance. As a Vaisnava gradually begins proclaiming his
own superiority, a mentality of disrespect for the Lord arises and the devotee
falls from his position. Therefore it is most important to prevent this evil
mentality from entering the heart. Even if one is expert in devotional service,
a Vaisnava will never give up the quality of humility. If one does so, then
there is a need for killing Kesi. This is the eighteenth obstacle.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 30
  INSERT INTO public.verses (
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
    E'doṣāś
cāṣṭādaśa hy ete bhaktānāḿ
śatravo hṛdi
damanīyāḥ
prayatnena kṛṣṇānanda-niṣevinā', E'doṣāś
cāṣṭādaśa hy ete bhaktānāḿ
śatravo hṛdi
damanīyāḥ
prayatnena kṛṣṇānanda-niṣevinā',
    E'doṣāś
cāṣṭādaśa hy ete bhaktānāḿ
śatravo hṛdi
damanīyāḥ
prayatnena kṛṣṇānanda-niṣevinā', E'доша̄ш́
ча̄шт̣а̄даш́а хй ете бгакта̄на̄ḿ
ш́атраво хр̣ді
даманı̄йа̄х̣
прайатнена кр̣шн̣а̄нанда-нішевіна̄',
    E'', E'',
    E'Those who want to happily serve Krsna in the pure mood of Vraja should
carefully destroy the above-mentioned eighteen obstacles. Some of these
obstacles should be destroyed by a person''s own endeavor and purity, and some
should be destroyed by the mercy of Krsna. A living entity is able to
personally destroy the obstacles that are found under the shelter of religious
duties through samadhi known as savikalpa. The Srimad Bhagavatam explains that
these obstacles are actually destroyed by Baladeva. But it is also described
that the obstacles that are destroyed by taking shelter of Krsna are actually destroyed
by Him. Swanlike persons with subtle discrimination should carefully discuss
these topics.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 31
  INSERT INTO public.verses (
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
    E'jñānināḿ
māthurā doṣāḥ karmiṇāḿ
pura-vartinaḥ
varjanīyāḥ
sadā kintu bhaktānāḿ vraja-dūṣakāḥ', E'jñānināḿ
māthurā doṣāḥ karmiṇāḿ
pura-vartinaḥ
varjanīyāḥ
sadā kintu bhaktānāḿ vraja-dūṣakāḥ',
    E'jñānināḿ
māthurā doṣāḥ karmiṇāḿ
pura-vartinaḥ
varjanīyāḥ
sadā kintu bhaktānāḿ vraja-dūṣakāḥ', E'джн̃а̄ніна̄ḿ
ма̄тхура̄ доша̄х̣ кармін̣а̄ḿ
пура-вартінах̣
варджанı̄йа̄х̣
сада̄ кінту бгакта̄на̄ḿ враджа-дӯшака̄х̣',
    E'', E'',
    E'Those who are on the path of jnana should give up the offenses found in the
realm of Mathura, and those who are on the path of fruitive activities should
give the offenses found in Dvaraka. But devotees should give up the obstacles
that pollute the mood of Vraja and be absorbed in love for Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Chapter 9: Krsnapti Varnanam
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 9, E'Krsnapti Varnanam', E'Крішнапті-варнанам', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 9;


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
    E'vyāsena
vraja-līlāyāḿ nitya-tattvaḿ prakāśitam
prapañca-janitaḿ
jñānaḿ nāpnoti yat svarūpakam', E'vyāsena
vraja-līlāyāḿ nitya-tattvaḿ prakāśitam
prapañca-janitaḿ
jñānaḿ nāpnoti yat svarūpakam',
    E'vyāsena
vraja-līlāyāḿ nitya-tattvaḿ prakāśitam
prapañca-janitaḿ
jñānaḿ nāpnoti yat svarūpakam', E'вйа̄сена
враджа-лı̄ла̄йа̄ḿ нітйа-таттваḿ прака̄ш́ітам
прапан̃ча-джанітаḿ
джн̃а̄наḿ на̄пноті йат сварӯпакам',
    E'', E'',
    E'1) Sri
Vyasadeva has explained the eternal truth while describing the pastimes of
Vraja. This eternal truth is beyond the realm of material knowledge.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jīvasya
siddha-sattāyāḿ bhāsate tattvam uttamam
dūratā-rahite
śuddhe samādhau nirvikalpake', E'jīvasya
siddha-sattāyāḿ bhāsate tattvam uttamam
dūratā-rahite
śuddhe samādhau nirvikalpake',
    E'jīvasya
siddha-sattāyāḿ bhāsate tattvam uttamam
dūratā-rahite
śuddhe samādhau nirvikalpake', E'джı̄васйа
сіддга-сатта̄йа̄ḿ бга̄сате таттвам уттамам
дӯрата̄-рахіте
ш́уддге сама̄дгау нірвікалпаке',
    E'', E'',
    E'This supreme truth shines in the living entity''s pure existence. This pure
existence is attainable by conditioned souls through pure absolute samadhi,
which vanquishes all impediments. There are two types of samadhiartificial and
absolute. The devotees accept natural samadhi as absolute and fabricated
samadhi as artificial, regardless of whatever explanations the jnanis have. The
soul is spiritual, therefore the qualities of self-knowledge and knowledge of
other objects are naturally present in him. By the quality of self-knowledge,
one can realize one''s self. By the quality of knowing other objects, one can
realize all other objects. Since such qualities are the constitutional nature
of a living entity, where is the doubt that natural samadhi is absolute? A
living entity does not require to take shelter of another instrument to
understand the supreme object. Therefore this samadhi is faultless. But when
one takes shelter of Sankhya-samadhi, which entails faulty or unnatural
activities, it is known as artificial samadhi. The constitutional activities of
the soul are called natural samadhi, for the mind has no jurisdiction in these
activities. Natural samadhi is easy and free from misery. If one takes shelter
of this samadhi, then the eternal truth is easily realized.
3) The
pastimes of Vraja have been perceived and described through the process of natural
samadhi, in the form of self-realization. Although the names, forms, qualities,
and activities that are used to describe Vraja-lila appear almost mundane, that
is only because the material world created by Maya is similar to its origin,
Vaikuntha. Actually the soul''s natural samadhi is a function of the spiritual
potency. Whatever is perceived through natural samadhi is the ideal example for
the material world, not imitation.
4) For
this reason Krsna''s names, qualities, and forms have a similarity to material
names, qualities, and forms.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'māyā-sūtasya
viśvasya cic-chāyatvāt samānatā
cic-chakty-āviṣkṛte
kārye samādhāv api cātmani', E'māyā-sūtasya
viśvasya cic-chāyatvāt samānatā
cic-chakty-āviṣkṛte
kārye samādhāv api cātmani',
    E'māyā-sūtasya
viśvasya cic-chāyatvāt samānatā
cic-chakty-āviṣkṛte
kārye samādhāv api cātmani', E'ма̄йа̄-сӯтасйа
віш́васйа чіч-чха̄йатва̄т сама̄ната̄
чіч-чхактй-а̄вішкр̣те
ка̄рйе сама̄дга̄в апі ча̄тмані',
    E'', E'',
    E'Self-realization comes through self-illumination. Learned scholars call
self-realization samadhi. This is very subtle. If there is a tinge of doubt, it
is practically lost. Many truths such as the living entity''s faith in his own
existence, the living entity''s eternal existence, and the living entity''s
relationship with the Absolute Truth are realized through natural samadhi. Do
I exist or not? Will I exist after death? Do I have any relationship with
the Absolute Truth? If one develops such argumentative doubts on the truth,
then his natural samadhi becomes contaminated with prejudices and gradually
forgotten. The truth can never be lost; it can only be forgotten. The soul''s
eternality and the existence of the Absolute Truth cannot be established by
argument, because argument has no entrance into the realm beyond the material
world. Self-realization is the only way to establish these truths. The devotees
occupation, service to Krsna, through natural samadhi, or self-realization.
When a spirit soul practices natural samadhi, he progressively realizes the
following subjects: (1) his self, (2) the insignificance of the self, (3) the
supreme shelter, (4) the relationship between the shelter and the sheltered,
(5) the beauty of the qualities, activities, and form of the shelter, (6) the
relationships amongst the sheltered, (7) the abode of the shelter and the
sheltered, (8) the absolute time factor, (9) the various moods of the
sheltered, (10) the eternal pastimes between the shelter and the sheltered,
(11) the energies of the shelter, (12) the advancement and degradation of the
sheltered by the energies of the shelter, (13) the misidentification of the
degraded sheltered, (14) the cultivation of devotional service for restoration
of the degraded sheltered, and (15) the degraded sheltered regaining their
constitutional position through devotional service. These fifteen along with
other inconceivable truths are realized. The more material knowledge is mixed
with one''s natural samadhi, the less one can realize the truth. The more one is
able to advance on the path of natural samadhi by controlling argument, which
is like the minister of material knowledge, the more one can open the
storehouse and acquire indescribable spiritual truths. The storehouse of
Vaikuntha is always full. Lord Sri Krsnacandra, the lovable object of all,
constantly invites the living entities through the open door of that storehouse.
6) We
have destroyed the doubts that hinder samadhi, and we are seeing within the
inner circle of Vaikuntha the beautiful form of Sri Krsna, who is the topmost
personality of Vrndavana. If our samadhi would have been polluted with material
knowledge and if the propensity for argument, after giving up mundane
knowledge, would have intruded in the process of samadhi, then we would not
have accepted the quality of variegated nature of the spiritual world and we
would have proceeded only up to impersonal Brahman. But if material knowledge
and argument was to some extent subdued and intruded only to some extent into
the process of samadhi, then we would have accepted the eternal differentiation
between the soul and the Supersoul, and nothing more. But since we have totally
submerged this wicked propensity of doubting, we have attained complete
realization of the beautiful form of the supreme shelter.
7) Now
we are going to explain the form and beauty of the Lord, which are realized
through samadhi. The beautiful form of the Lord, which nourishes all spiritual
subjects, is like a human form. There is no difference between the energy and
its effect in the absolute realm, nevertheless the sandhini aspect of the
spiritual potency with the help of variegated nature arranges the effect so
perfectly that it has created a wonderfully unprecedented scene. There is no
comparison to that beauty, either in this world or in the spiritual world.
Since there is no predominance of time and space in the Absolute Truth, the significance
or greatness of the Lord''s form does not increase His glories, rather, because
His form is beyond the material realm, it is always wonderful and complete.
Therefore we are seeing the body of the Lord, which is the source of all
beauty, through samadhi. The Lord''s form is even more sweet. The more deeply
one sees the form of the Lord through the eyes of samadhi, the more one sees an
indescribable pleasing blackish form. Perhaps that spiritual form is
pervertedly reflected as mundane blue sapphires, which give relief to the
mundane eyes, or mundane new clouds, which increase the happiness of the
burning mundane eyes.
8  9)
The sandhini, samvit, and hladini potencies wonderfully merge in the beautiful threefold-bending
form of the Lord. The Lord''s ever-pleasing eyes increase the beauty of His
form. Perhaps the lotus flowers of this world are modeled after His eyes. The
crown of the Lord''s head is wonderfully decorated. Perhaps the peacock feathers
of this world are modeled after those decorations. A garland of spiritual
flowers increases the beauty of the Lord''s neck. Perhaps a forest flower
garland of this world is modeled after that transcendental garland. Spiritual
knowledge, which is manifested from the samvit aspect of the spiritual potency,
covers the waist of the Lord''s form. Perhaps the lightning bolt of a new cloud
of this world is modeled after that covering. Spiritual jewels like Kaustubha
and other ornaments beautifully decorate His form. The instrument by which the
Lord sweetly invites or spiritually attracts all is known as the flute. The
flute of this world, which creates various ragas, or musical modes, might be
modeled after that flute. This inconceivable form of the Lord is seen under the
kadamba tree, which is the form of hairs standing on end in ecstasy, on the
bank of the Yamuna, which is the form of spiritual liquid.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'guṇair
jāḍyātmakaiḥ śaśvat sādṛśyam
upalakṣyate
tasmāt tu
vraja-bhāvānāḿ
kṛṣṇa-nāma-guṇātmanām', E'guṇair
jāḍyātmakaiḥ śaśvat sādṛśyam
upalakṣyate
tasmāt tu
vraja-bhāvānāḿ
kṛṣṇa-nāma-guṇātmanām',
    E'guṇair
jāḍyātmakaiḥ śaśvat sādṛśyam
upalakṣyate
tasmāt tu
vraja-bhāvānāḿ
kṛṣṇa-nāma-guṇātmanām', E'ґун̣аір
джа̄д̣йа̄тмакаіх̣ ш́аш́ват са̄др̣ш́йам
упалакшйате
тасма̄т ту
враджа-бга̄ва̄на̄ḿ
кр̣шн̣а-на̄ма-ґун̣а̄тмана̄м',
    E'', E'',
    E'Sri Krsna, the son of Nanda and Lord of the spiritual and material worlds, is
seen with the above-mentioned spiritual symptoms by the Vaisnavas through
samadhi. A swanlike person should not disregard these spiritual features
because they have shadow forms in this material world. All these spiritual
features combine to further enhance the splendor of the Lord. One will see more
subtle features of the Lord by entering deeper into samadhi, and one will see
less variety and qualities of the Lord by entering shallower into samadhi.
Unfortunate people who are enamoured by material knowledge are unable to see
the spiritual form of the Lord and the variegated nature of the spiritual world
even though they attempt to see Vaikuntha through samadhi. For this reason
their spiritual cultivation is limited and their treasure of love is very
meagre.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sva-prakāśa-svabhāvo''yaḿ
samādhiḥ kathyate budhaiḥ
atisūkṣma-svarūpatvāt
saḿśayāt sa vilupyate', E'sva-prakāśa-svabhāvo''yaḿ
samādhiḥ kathyate budhaiḥ
atisūkṣma-svarūpatvāt
saḿśayāt sa vilupyate',
    E'sva-prakāśa-svabhāvo''yaḿ
samādhiḥ kathyate budhaiḥ
atisūkṣma-svarūpatvāt
saḿśayāt sa vilupyate', E'сва-прака̄ш́а-свабга̄во''йаḿ
сама̄дгіх̣ катхйате будгаіх̣
атісӯкшма-сварӯпатва̄т
саḿш́айа̄т са вілупйате',
    E'', E'',
    E'Lord Sri Krsnacandra, who is realized through samadhi, kidnaps the hearts of
the gopis and maddens the spiritual and material worlds with the sound of His
flute, which is the form of all attraction.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'vayaḿ tu
saḿśayaḿ tyaktvā paśyāmas tattvam uttamam
vṛndāvanāntare
ramye śrī-kṛṣṇa-rūpa-saubhagam', E'vayaḿ tu
saḿśayaḿ tyaktvā paśyāmas tattvam uttamam
vṛndāvanāntare
ramye śrī-kṛṣṇa-rūpa-saubhagam',
    E'vayaḿ tu
saḿśayaḿ tyaktvā paśyāmas tattvam uttamam
vṛndāvanāntare
ramye śrī-kṛṣṇa-rūpa-saubhagam', E'вайаḿ ту
саḿш́айаḿ тйактва̄ паш́йа̄мас таттвам уттамам
вр̣нда̄вана̄нтаре
рамйе ш́рı̄-кр̣шн̣а-рӯпа-саубгаґам',
    E'', E'',
    E'How can those whose hearts have been polluted by social prestige attain Krsna?
The wicked pride of this material world has six causesbirth, beauty,
qualities, knowledge, opulence, and strength. People who are overwhelmed by
these six kinds of pride cannot take to the devotional service of the Lord. We
are experiencing this everyday in our life. Persons who are polluted by the
pride of knowledge consider the science of Krsna very insignificant. While
considering the goal of life, such people regard the happiness of Brahman to be
superior to the happiness of devotional service. Persons who are devoid of
pride attain the mood of gopas or gopis to enjoy with Krsna. The gopas and
gopis are the authorities in the science of Krsna. The reason for using the
word gopi in this verse is that in this book we are discussing the topmost rasa
of conjugal love. Persons who are situated in shanta, dasya, sakhya, and
vatsalya rasas are also in the mood of Vraja, and they realize the
transcendental mellows in relationship with Krsna according to their respective
moods. We are not going to elaborate on them in this book. Actually all living
entities are eligible for the mood of Vraja. When one''s heart is filled with
the mood of madhurya, he attains Vraja in full perfection. Out of the five
rasas, a person is naturally attracted to the rasa in which he has an eternal
constitutional relationship with the Lord, and he should therefore worship the
Lord in that particular mood. But in this book we have only described the
living entity''s topmost mood of conjugal love.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'nara-bhāva-svarūpo''yaḿ
cit-tattva-pratipoṣakaḥ
snigdha-śyāmātmako
varṇaḥ sarvānanda-vivardhakaḥ', E'nara-bhāva-svarūpo''yaḿ
cit-tattva-pratipoṣakaḥ
snigdha-śyāmātmako
varṇaḥ sarvānanda-vivardhakaḥ',
    E'nara-bhāva-svarūpo''yaḿ
cit-tattva-pratipoṣakaḥ
snigdha-śyāmātmako
varṇaḥ sarvānanda-vivardhakaḥ', E'нара-бга̄ва-сварӯпо''йаḿ
чіт-таттва-пратіпошаках̣
сніґдга-ш́йа̄ма̄тмако
варн̣ах̣ сарва̄нанда-вівардгаках̣',
    E'', E'',
    E'Those who have attained the mood of the gopis are called perfected beings, and
those who imitate them are called practitioners. Therefore the learned, who
know the Absolute Truth, accept two types of sadhusperfected beings and
practitioners.
14) We
are now explaining the gradual process of sadhana for those in the mood of the
gopis. When the sound of Krsna''s flute enters the ear of a living entity who is
wandering throughout the material world, he is attracted by the sweet sound and
becomes highly qualified.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tri-tattva-bhańgimā-yukto
rājīva-nayanānvitaḥ
śikhi-piccha-dharaḥ
śrīmān vana-mālā-vibhūṣitaḥ', E'tri-tattva-bhańgimā-yukto
rājīva-nayanānvitaḥ
śikhi-piccha-dharaḥ
śrīmān vana-mālā-vibhūṣitaḥ',
    E'tri-tattva-bhańgimā-yukto
rājīva-nayanānvitaḥ
śikhi-piccha-dharaḥ
śrīmān vana-mālā-vibhūṣitaḥ', E'трі-таттва-бгаńґіма̄-йукто
ра̄джı̄ва-найана̄нвітах̣
ш́ікхі-піччха-дгарах̣
ш́рı̄ма̄н вана-ма̄ла̄-вібгӯшітах̣',
    E'', E'',
    E'Sense gratification is the materialist''s primary anartha. When the sheltered
give up the shelter, then they consider themselves the enjoyer of maya. If the
practitioner''s propensity for enjoyment is quickly destroyed, then he can again
attain the shelter of those persons who are attached to conjugal rasa and
consider himself a transcendental woman, to be enjoyed by the Lord. Gradually
such persons develop purva-raga to such a degree that they become almost mad.
16) By
seeing pictures of Krsna or by repeatedly hearing descriptions of Krsna from
persons who have seen Him, one''s greed for attaining Krsna increases
unlimitedly.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'pītāmbaraḥ
suveśāḍhyo vaḿśī-nyasta-mukhāmbujaḥ
yamunā-puline ramye
kadamba-talam āśritaḥ', E'pītāmbaraḥ
suveśāḍhyo vaḿśī-nyasta-mukhāmbujaḥ
yamunā-puline ramye
kadamba-talam āśritaḥ',
    E'pītāmbaraḥ
suveśāḍhyo vaḿśī-nyasta-mukhāmbujaḥ
yamunā-puline ramye
kadamba-talam āśritaḥ', E'пı̄та̄мбарах̣
сувеш́а̄д̣хйо ваḿш́ı̄-нйаста-мукха̄мбуджах̣
йамуна̄-пуліне рамйе
кадамба-талам а̄ш́рітах̣',
    E'', E'',
    E'When a living entity through natural knowledge experiences attraction for the
Lord, this is known as hearing songs of Krsna. Realizing Krsna after
scrutinizingly studying descriptions of His form narrated in the scriptures by
persons who have seen Krsna is called hearing the qualities of Krsna. Seeing
Krsna''s artistry within the world is called seeing Krsna''s picture. This
material world is the reflected shadow of spiritual variegated nature. Whoever
has realized this is said to have seen Krsna''s picture. In other words, a
person becomes a Vaisnava by three processesseeing the Lord through natural
knowledge, realizing the Lord by studying the scriptures, and seeing the Lord
through His artistry.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'etena
cit-svarūpeṇa lakṣaṇena jagat-patiḥ
lakṣito
nandajaḥ kṛṣṇo vaiṣṇavena
samādhinā', E'etena
cit-svarūpeṇa lakṣaṇena jagat-patiḥ
lakṣito
nandajaḥ kṛṣṇo vaiṣṇavena
samādhinā',
    E'etena
cit-svarūpeṇa lakṣaṇena jagat-patiḥ
lakṣito
nandajaḥ kṛṣṇo vaiṣṇavena
samādhinā', E'етена
чіт-сварӯпен̣а лакшан̣ена джаґат-патіх̣
лакшіто
нандаджах̣ кр̣шн̣о ваішн̣авена
сама̄дгіна̄',
    E'', E'',
    E'Pure faith in Krsna, who is the shelter of the moods of Vraja, is called
purva-raga or prag-bhava. When this faith awakens, one achieves the association
of a devotee resident of Vraja. Association of the devotees is the cause for
achieving Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'mādayan viśvam
etad vai gopīnām aharan manaḥ
ākarṣaṇa-svarūpeṇa
vaḿśī-gītena sundaraḥ', E'mādayan viśvam
etad vai gopīnām aharan manaḥ
ākarṣaṇa-svarūpeṇa
vaḿśī-gītena sundaraḥ',
    E'mādayan viśvam
etad vai gopīnām aharan manaḥ
ākarṣaṇa-svarūpeṇa
vaḿśī-gītena sundaraḥ', E'ма̄дайан віш́вам
етад ваі ґопı̄на̄м ахаран манах̣
а̄каршан̣а-сварӯпен̣а
ваḿш́ı̄-ґı̄тена сундарах̣',
    E'', E'',
    E'Such fortunate persons fix a love rendezvous with Krsna and then gradually
proceed towards the bank of the spiritual liquid Yamuna, where they meet their
beloved.
20) By
the association of Krsna, they then naturally experience such transcendental
happiness that the happiness of Brahman is considered insignificant before it.
At that time the happiness of material family life becomes comparable to the
water in the hoofprint of a calf before the ocean of love.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jātyādi-mada-vibhrāntyā
kṛṣṇāptir durhṛdāḿ kutaḥ
gopīnāḿ
kevalaḿ kṛṣṇaś cittam ākarṣaṇe
kṣamaḥ', E'jātyādi-mada-vibhrāntyā
kṛṣṇāptir durhṛdāḿ kutaḥ
gopīnāḿ
kevalaḿ kṛṣṇaś cittam ākarṣaṇe
kṣamaḥ',
    E'jātyādi-mada-vibhrāntyā
kṛṣṇāptir durhṛdāḿ kutaḥ
gopīnāḿ
kevalaḿ kṛṣṇaś cittam ākarṣaṇe
kṣamaḥ', E'джа̄тйа̄ді-мада-вібгра̄нтйа̄
кр̣шн̣а̄птір дурхр̣да̄ḿ кутах̣
ґопı̄на̄ḿ
кевалаḿ кр̣шн̣аш́ чіттам а̄каршан̣е
кшамах̣',
    E'', E'',
    E'Thereafter, the Lord and soul of all souls, in His ever-fresh form, unlimitedly
increases that ocean of bliss. The Lord, who is the shelter of all rasas,
always appears wonderfully ever-fresh. In other words, the sheltered persons''
thirst for rasa increases and is never quenched. Through samadhi, great
devotees have seen in the spiritual world five direct rasas, beginning with
shanta, and seven indirect rasas, beginning with heroism and compassion. Since
the material world is known as the reflected shadow of the Vaikuntha world, all
the imitation rasas of the material world must certainly be present in their
pure forms in Vaikuntha.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'gopī-bhāvātmakāḥ
siddhāḥ sādhakās tad-anukṛteḥ
dvividhāḥ
sādhavo jñeyāḥ paramārtha-vidā sadā', E'gopī-bhāvātmakāḥ
siddhāḥ sādhakās tad-anukṛteḥ
dvividhāḥ
sādhavo jñeyāḥ paramārtha-vidā sadā',
    E'gopī-bhāvātmakāḥ
siddhāḥ sādhakās tad-anukṛteḥ
dvividhāḥ
sādhavo jñeyāḥ paramārtha-vidā sadā', E'ґопı̄-бга̄ва̄тмака̄х̣
сіддга̄х̣ са̄дгака̄с тад-анукр̣тех̣
двівідга̄х̣
са̄дгаво джн̃ейа̄х̣ парама̄ртха-віда̄ сада̄',
    E'', E'',
    E'Now we will again deeply discuss the previously explained science of rati,
attraction. Attraction is the seed of love and the principle asset for
executing devotional service. The self-illuminated perfect attachment of a
living entity for the sat-cid-ananda Lord is called attraction. The naturally
perfect propensity of attachment between spiritual identities is very strong
between Krsna and the living entities. This stage is called sthayi-bhava,
permanent ecstatic moods, which is the goal of the Srimad Bhagavatam, the
ornamental literature of the paramahamsas.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'saḿsṛtau
bhramatāḿ karṇe praviṣṭaḿ
kṛṣṇa-gītakam
balād
ākarṣayaḿś cittam uttamān kurute hi tān', E'saḿsṛtau
bhramatāḿ karṇe praviṣṭaḿ
kṛṣṇa-gītakam
balād
ākarṣayaḿś cittam uttamān kurute hi tān',
    E'saḿsṛtau
bhramatāḿ karṇe praviṣṭaḿ
kṛṣṇa-gītakam
balād
ākarṣayaḿś cittam uttamān kurute hi tān', E'саḿср̣тау
бграмата̄ḿ карн̣е правішт̣аḿ
кр̣шн̣а-ґı̄такам
бала̄д
а̄каршайаḿш́ чіттам уттама̄н куруте хі та̄н',
    E'', E'',
    E'This attraction is the subtle origin of rasa. Just as one is the origin in
the process of counting numbers yet it remains present in subsequent numbers,
similarly in the mature stages of pritisuch as prema, sneha, mana, and
ragaattraction remains present as the origin. Attraction is seen as the root
in all the activities of priti, while bhava and various ingredients are seen as
branches and subbranches. Therefore attraction continually increases under the
shelter of rasa. There are twelve direct and indirect rasas.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'puḿbhāve vigate
śīghraḿ strī-bhāvo jāyate tadā
pūrva-rāgo
bhavet teṣām unmāda-lakṣaṇānvitaḥ', E'puḿbhāve vigate
śīghraḿ strī-bhāvo jāyate tadā
pūrva-rāgo
bhavet teṣām unmāda-lakṣaṇānvitaḥ',
    E'puḿbhāve vigate
śīghraḿ strī-bhāvo jāyate tadā
pūrva-rāgo
bhavet teṣām unmāda-lakṣaṇānvitaḥ', E'пуḿбга̄ве віґате
ш́ı̄ґграḿ стрı̄-бга̄во джа̄йате тада̄
пӯрва-ра̄ґо
бгавет теша̄м унма̄да-лакшан̣а̄нвітах̣',
    E'', E'',
    E'Shanta, dasya, sakhya, vatsalya, and madhurya are the five direct rasas.
Besides the five direct mellows, there are seven indirect mellows, known as
hasya (laughter), adbhuta (wonder), vira (chivalry), karuna (compassion),
raudra (anger), bibhatsa (disaster), and bhaya (fear). These seven indirect
rasas arise from the five direct rasas. Until attraction mixes with a
particular relationship, it remains in a neutral state and cannot act. But when
attraction joins with a particular relationship, it begins to manifest. The
emotions that are produced by this manifestation are the indirect rasas.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'śrutvā
kṛṣṇa-guṇaḿ tatra darśakād dhi
punaḥ punaḥ
citritaḿ rūpam
anvīkṣya vardhate lālasā bhṛśam', E'śrutvā
kṛṣṇa-guṇaḿ tatra darśakād dhi
punaḥ punaḥ
citritaḿ rūpam
anvīkṣya vardhate lālasā bhṛśam',
    E'śrutvā
kṛṣṇa-guṇaḿ tatra darśakād dhi
punaḥ punaḥ
citritaḿ rūpam
anvīkṣya vardhate lālasā bhṛśam', E'ш́рутва̄
кр̣шн̣а-ґун̣аḿ татра дарш́ака̄д дгі
пунах̣ пунах̣
чітрітаḿ рӯпам
анвı̄кшйа вардгате ла̄ласа̄ бгр̣ш́ам',
    E'', E'',
    E'When rati, attraction, takes the shape of rasa, it becomes more luminous by
mixing with four other ingredients. Although attraction is present under the
shelter of rasa, it cannot manifest without the ingredients. These ingredients
are of four typesvibhava (special ecstasy), anubhava (subordinate ecstasy),
sattvika (natural ecstasy), and vyabhicari (transitory ecstasy). Vibhava is
divided into the two categories alambana (the support) and uddipana
(stimulation). Alambana may be further divided into twoKrsna and His devotees.
The qualities and characteristics of Krsna and His devotees are called
uddipana. Anubhava is divided into threealankara (ornaments of emotional
love), udbhasvara (external manifestations of emotional love), and vacika
(verbal manifestations of emotional love). The twenty types of alankaras, such
as bhava (ecstasy) and hava (gestures), are categorized into threeangaja (in
relation to the body), ayatnaja (in relation to the self), and svabhavaja (in
relation to nature). Physical activities like jrimbha (yawning), nritya
(dancing), and lunthana (plundering) are known as udbhasvaras (external
manifestations of emotional love). There are twelve vacika anubhavas, such as
alapa and vilapa. There are eight sattvika-vikaras, such as stambha (being
stunned), and sveda (perspiring). And there are thirty-three vyabhicari-bhavas,
such as nirveda (indifference). Attraction requires the constant support of
rasa and these ingredients to nourish one''s relationship up to mahabhava.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'prathamaḿ
sahajaḿ jñānaḿ dvitīyaḿ
śāstra-varṇanam
tṛtīyaḿ
kauśalaḿ viśve kṛṣṇasya
ceśa-rūpiṇaḥ', E'prathamaḿ
sahajaḿ jñānaḿ dvitīyaḿ
śāstra-varṇanam
tṛtīyaḿ
kauśalaḿ viśve kṛṣṇasya
ceśa-rūpiṇaḥ',
    E'prathamaḿ
sahajaḿ jñānaḿ dvitīyaḿ
śāstra-varṇanam
tṛtīyaḿ
kauśalaḿ viśve kṛṣṇasya
ceśa-rūpiṇaḥ', E'пратхамаḿ
сахаджаḿ джн̃а̄наḿ двітı̄йаḿ
ш́а̄стра-варн̣анам
тр̣тı̄йаḿ
кауш́алаḿ віш́ве кр̣шн̣асйа
чеш́а-рӯпін̣ах̣',
    E'', E'',
    E'This attraction for Krsna is also known as sthayi-bhava and bhakti-rasa. Due to
the conditioned souls'' relationship with the material world, their attraction
takes the shape of devotional service. In the liberated souls in Vaikuntha,
attraction is eternally present in the form of priti, or love.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'vraja-bhāvāśraye
kṛṣṇe śraddhā tu rāga-rūpakā
tasmāt sańgo''tha
sādhūnāḿ vartate vraja-vāsinām', E'vraja-bhāvāśraye
kṛṣṇe śraddhā tu rāga-rūpakā
tasmāt sańgo''tha
sādhūnāḿ vartate vraja-vāsinām',
    E'vraja-bhāvāśraye
kṛṣṇe śraddhā tu rāga-rūpakā
tasmāt sańgo''tha
sādhūnāḿ vartate vraja-vāsinām', E'враджа-бга̄ва̄ш́райе
кр̣шн̣е ш́раддга̄ ту ра̄ґа-рӯпака̄
тасма̄т саńґо''тха
са̄дгӯна̄ḿ вартате враджа-ва̄сіна̄м',
    E'', E'',
    E'The gradual stages of the development of attraction up to mahabhava, the
manifestation of attraction under the shelter of direct and indirect rasa, and
the unlimited ocean of sweetness created by the wonderful mixture of attraction
with the above-mentioned ingredients are the eternal wealth of liberated souls
and the goal for conditioned souls. You may ask what is the need for practicing
devotional service if this spiritual blissful rasa is eternal. The answer is
that the attraction of the living entities has become perverted and mundane.
Therefore one has to awaken pure attraction in one''s heart by practicing
devotional service.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'kadācid
abhisāraḥ syād yamunā-taṭa-sannidhau
ghaṭate
milanaḿ tatra kāntena sahitaḿ śubham', E'kadācid
abhisāraḥ syād yamunā-taṭa-sannidhau
ghaṭate
milanaḿ tatra kāntena sahitaḿ śubham',
    E'kadācid
abhisāraḥ syād yamunā-taṭa-sannidhau
ghaṭate
milanaḿ tatra kāntena sahitaḿ śubham', E'када̄чід
абгіса̄рах̣ сйа̄д йамуна̄-тат̣а-саннідгау
ґгат̣ате
міланаḿ татра ка̄нтена сахітаḿ ш́убгам',
    E'', E'',
    E'Learned personalities like Vyasadeva and we ourselves have seen through samadhi
that the science of attraction is most relishable for the pure living entities.
The qualities of the origin are somewhat reflected in its shadow. That is why
the loving affairs of this material world are the most pleasing form of
material enjoyment. But the attraction between male and female of this world is
very insignificant and abominable when compared to spiritual attraction.
29) We
have thus described activities up to the rasa dance and moods up to mahabhava
enjoyed between the Supreme Lord Krsna and the eternally liberated living
entities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'kṛṣṇa-sańgāt
parānandaḥ svabhāvena pravartate
pūrvāśritaḿ
sukhaḿ gārhyaḿ tat-kṣaṇād goṣpadāyate', E'kṛṣṇa-sańgāt
parānandaḥ svabhāvena pravartate
pūrvāśritaḿ
sukhaḿ gārhyaḿ tat-kṣaṇād goṣpadāyate',
    E'kṛṣṇa-sańgāt
parānandaḥ svabhāvena pravartate
pūrvāśritaḿ
sukhaḿ gārhyaḿ tat-kṣaṇād goṣpadāyate', E'кр̣шн̣а-саńґа̄т
пара̄нандах̣ свабга̄вена правартате
пӯрва̄ш́рітаḿ
сукхаḿ ґа̄рхйаḿ тат-кшан̣а̄д ґошпада̄йате',
    E'', E'',
    E'Due to associating with matter, this is the limit that our words can describe.
Whatever is beyond this can be known only through Samadhi.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'ātmanāmātmani
preṣṭhe nitya-nūtana-vigrahe
vardhate paramānando
hṛdaye ca dine dine', E'ātmanāmātmani
preṣṭhe nitya-nūtana-vigrahe
vardhate paramānando
hṛdaye ca dine dine',
    E'ātmanāmātmani
preṣṭhe nitya-nūtana-vigrahe
vardhate paramānando
hṛdaye ca dine dine', E'а̄тмана̄ма̄тмані
прешт̣хе нітйа-нӯтана-віґрахе
вардгате парама̄нандо
хр̣дайе ча діне діне',
    E'', E'',
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
    E'cid-ānandasya
jīvasya saccid-ānanda-vigrahe
yā''nuraktiḥ
svataḥ-siddhā sā ratiḥ prīti-bījakam', E'cid-ānandasya
jīvasya saccid-ānanda-vigrahe
yā''nuraktiḥ
svataḥ-siddhā sā ratiḥ prīti-bījakam',
    E'cid-ānandasya
jīvasya saccid-ānanda-vigrahe
yā''nuraktiḥ
svataḥ-siddhā sā ratiḥ prīti-bījakam', E'чід-а̄нандасйа
джı̄васйа саччід-а̄нанда-віґрахе
йа̄''нурактіх̣
сватах̣-сіддга̄ са̄ ратіх̣ прı̄ті-бı̄джакам',
    E'', E'',
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
    E'sā ratī rasam
āśritya vardhate rasa-rūpa-dhṛk
rasaḥ pañca-vidho
mukhyaḥ gauṇaḥ sapta-vidhas tathā', E'sā ratī rasam
āśritya vardhate rasa-rūpa-dhṛk
rasaḥ pañca-vidho
mukhyaḥ gauṇaḥ sapta-vidhas tathā',
    E'sā ratī rasam
āśritya vardhate rasa-rūpa-dhṛk
rasaḥ pañca-vidho
mukhyaḥ gauṇaḥ sapta-vidhas tathā', E'са̄ ратı̄ расам
а̄ш́рітйа вардгате раса-рӯпа-дгр̣к
расах̣ пан̃ча-відго
мукхйах̣ ґаун̣ах̣ сапта-відгас татха̄',
    E'', E'',
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
    E'śānta-dāsyādayo
mukhyāḥ sambandha-bhāva-rūpakāḥ
rasā
vīrādayo gauṇāḥ sambandhotthāḥ
svabhāvataḥ', E'śānta-dāsyādayo
mukhyāḥ sambandha-bhāva-rūpakāḥ
rasā
vīrādayo gauṇāḥ sambandhotthāḥ
svabhāvataḥ',
    E'śānta-dāsyādayo
mukhyāḥ sambandha-bhāva-rūpakāḥ
rasā
vīrādayo gauṇāḥ sambandhotthāḥ
svabhāvataḥ', E'ш́а̄нта-да̄сйа̄дайо
мукхйа̄х̣ самбандга-бга̄ва-рӯпака̄х̣
раса̄
вı̄ра̄дайо ґаун̣а̄х̣ самбандготтха̄х̣
свабга̄ватах̣',
    E'', E'',
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
    E'rasa-rūpam
avāpyeyaḿ ratir bhāti svarūpataḥ
vibhāvair
anubhāvaiś ca sāttvikair vyabhicāribhiḥ', E'rasa-rūpam
avāpyeyaḿ ratir bhāti svarūpataḥ
vibhāvair
anubhāvaiś ca sāttvikair vyabhicāribhiḥ',
    E'rasa-rūpam
avāpyeyaḿ ratir bhāti svarūpataḥ
vibhāvair
anubhāvaiś ca sāttvikair vyabhicāribhiḥ', E'раса-рӯпам
ава̄пйейаḿ ратір бга̄ті сварӯпатах̣
вібга̄ваір
анубга̄ваіш́ ча са̄ттвікаір вйабгіча̄рібгіх̣',
    E'', E'',
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
    E'eṣā
kṛṣṇa-ratiḥ sthāyī bhāvo bhakti-raso
bhaved
baddhe
bhakti-svarūpā sā mukte sā
prīti-rūpiṇī', E'eṣā
kṛṣṇa-ratiḥ sthāyī bhāvo bhakti-raso
bhaved
baddhe
bhakti-svarūpā sā mukte sā
prīti-rūpiṇī',
    E'eṣā
kṛṣṇa-ratiḥ sthāyī bhāvo bhakti-raso
bhaved
baddhe
bhakti-svarūpā sā mukte sā
prīti-rūpiṇī', E'еша̄
кр̣шн̣а-ратіх̣ стха̄йı̄ бга̄во бгакті-расо
бгавед
баддге
бгакті-сварӯпа̄ са̄ мукте са̄
прı̄ті-рӯпін̣ı̄',
    E'', E'',
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
    E'mukte sā vartate
nityā baddhe sā sādhitā bhavet
nitya-siddhasya
bhāvasya prākaṭyaḿ hṛdi sādhyatā', E'mukte sā vartate
nityā baddhe sā sādhitā bhavet
nitya-siddhasya
bhāvasya prākaṭyaḿ hṛdi sādhyatā',
    E'mukte sā vartate
nityā baddhe sā sādhitā bhavet
nitya-siddhasya
bhāvasya prākaṭyaḿ hṛdi sādhyatā', E'мукте са̄ вартате
нітйа̄ баддге са̄ са̄дгіта̄ бгавет
нітйа-сіддгасйа
бга̄васйа пра̄кат̣йаḿ хр̣ді са̄дгйата̄',
    E'', E'',
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
    E'ādarśāc
cin-mayād viśvāt samprāptaḿ susamādhinā
sahajena
mahābhāgair vyāsādibhir idaḿ matam', E'ādarśāc
cin-mayād viśvāt samprāptaḿ susamādhinā
sahajena
mahābhāgair vyāsādibhir idaḿ matam',
    E'ādarśāc
cin-mayād viśvāt samprāptaḿ susamādhinā
sahajena
mahābhāgair vyāsādibhir idaḿ matam', E'а̄дарш́а̄ч
чін-майа̄д віш́ва̄т сампра̄птаḿ сусама̄дгіна̄
сахаджена
маха̄бга̄ґаір вйа̄са̄дібгір ідаḿ матам',
    E'', E'',
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


  -- Verse 29
  INSERT INTO public.verses (
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
    E'mahā-bhāvāvirbhāvo
mahā-rāsāvadhiḥ kriyā
nitya-siddhasya
jīvasya nitya-siddhe parātmani', E'mahā-bhāvāvirbhāvo
mahā-rāsāvadhiḥ kriyā
nitya-siddhasya
jīvasya nitya-siddhe parātmani',
    E'mahā-bhāvāvirbhāvo
mahā-rāsāvadhiḥ kriyā
nitya-siddhasya
jīvasya nitya-siddhe parātmani', E'маха̄-бга̄ва̄вірбга̄во
маха̄-ра̄са̄вадгіх̣ крійа̄
нітйа-сіддгасйа
джı̄васйа нітйа-сіддге пара̄тмані',
    E'', E'',
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


  -- Verse 30
  INSERT INTO public.verses (
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
    E'etāvaj
jaḍa-janyānāḿ vākyānāḿ caramā
gatiḥ
yad-ūrdhvaḿ
vartate tan no samādhau paridṛśyatām', E'etāvaj
jaḍa-janyānāḿ vākyānāḿ caramā
gatiḥ
yad-ūrdhvaḿ
vartate tan no samādhau paridṛśyatām',
    E'etāvaj
jaḍa-janyānāḿ vākyānāḿ caramā
gatiḥ
yad-ūrdhvaḿ
vartate tan no samādhau paridṛśyatām', E'ета̄вадж
джад̣а-джанйа̄на̄ḿ ва̄кйа̄на̄ḿ чарама̄
ґатіх̣
йад-ӯрдгваḿ
вартате тан но сама̄дгау парідр̣ш́йата̄м',
    E'', E'',
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


  -- Chapter 10: Krsnapta Jana Caritam
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 10, E'Krsnapta Jana Caritam', E'Крішнапта-джана-чарітам', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 10;


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
    E'yeṣāḿ
rāgoditaḥ kṛṣṇe śraddhā vā
vimaloditā
teṣām
ācaraṇaḿ śuddhaḿ sarvatra paridṛśyate', E'yeṣāḿ
rāgoditaḥ kṛṣṇe śraddhā vā
vimaloditā
teṣām
ācaraṇaḿ śuddhaḿ sarvatra paridṛśyate',
    E'yeṣāḿ
rāgoditaḥ kṛṣṇe śraddhā vā
vimaloditā
teṣām
ācaraṇaḿ śuddhaḿ sarvatra paridṛśyate', E'йеша̄ḿ
ра̄ґодітах̣ кр̣шн̣е ш́раддга̄ ва̄
вімалодіта̄
теша̄м
а̄чаран̣аḿ ш́уддгаḿ сарватра парідр̣ш́йате',
    E'', E'',
    E'1) We
are now describing the characteristics of Krsna''s devotees who are in the mood
of Vraja. The characteristics of those who have awakened raga, or faith in the
form of purva-raga, is always pure and faultless. At this juncture we need to
consider the science of raga, or attachment. The thread of bondage between the
heart and its repository is called priti. The portion of the thread of bondage
that binds the repository is called the sense of pleasure. The portion of the
thread of bondage that binds the heart is called raga. The symptoms of a living
entity''s pure spiritual attachment and a living entity''s impure mental
attachment are similar in terms of the relationship between the heart and its
repository. When attachment first begins to manifest, it is known as faith. The
characteristics of both persons with faith and persons with attachment are
pure.
2) One
may ask, What is the reason for this? The answer is as follows: The science
of the living entities'' attachment is one. Attachment is present whether the
repository is the Lord or something mundane, the only difference is its
repository. When attachment is turned towards Vaikuntha, then no attachment for
the material world remains; one accepts only what is required for maintenance.
Even the objects that are thus accepted become transcendental. Therefore all
attachments become spiritualized. As soon as there is a lack of raga, asakti
certainly diminishes. Due to accepting material objects with an impure motive,
one naturally develops faithlessness. Therefore it is almost impossible for
devotees to act sinfully. And if they do act impurely at any time, there is no
need for atonement. The main purport is that sin is committed through
activities or desires. Sinful activities are called sin, and sinful desires are
called seeds of sin. Sinful activities are not sinful by constitution, because
according to one''s desire they are sometimes sinful and sometimes not. If we
try to search out the root cause of sinful desire, or the seed of sin, then we
can ascertain that identifying one''s body as one''s self is the root cause of
the pure living entity''s sinful desires. From this misidentification of one''s
body as one''s self, both sin and piety arise. Therefore both sin and piety are
relative, not constitutional. The activities or desires that relatively help a
soul attain his constitutional position are called piety. The opposite are
called sin. Since devotional service to Krsna is one''s constitutional position,
when one cultivates this service, then nescience, which is the root cause of
relative situations in the form of sin and piety, is gradually fried and
abolished. Although the desire to engage in sinful activity may suddenly
manifest like a fried kai fish, it is quickly subdued by the process of
devotional service. The endeavor for atonement at this point is useless. There
are three types of atonementatonement through karma, atonement through jnana,
and atonement through bhakti. Remembering Krsna is the atonement through
bhakti. Therefore devotional service is atonement through bhakti. There is no
need for devotees to separately endeavor for atonement. Atonement in jnana is
through repentence. By atonement through jnana one''s sins and seeds of sin, or
desires, are destroyed, but nescience is not destroyed without bhakti. By
atonement through karma, such as candrayana (a kind of expiatory penance),
one''s sins are checked, but the seeds of sinful desires and nescience, the root
cause of sins and the desire to sin, remains. One must understand this science
of atonement with careful consideration. The practice of repentance is observed
in some foreign devotional processes based on paternal rasa, and since this
paternal rasa is mixed with jnana and opulence, it is reasonable. In the
unmotivated devotional service of the sweet Lord, however, there are no
opposing rasas like fear, repentance, or liberation. Realization of one''s
constitutional position and elimination of all previous sins, in the form of
both fructified and unfructified sins, are both irrelevant fruits of bhakti and
therefore easily attained by the devotees. As for the jnanis, they destroy
their unfructified sins by the indirect process of repentance and they enjoy
the results of their fructified sins in their current life. As for the karmis,
their sins will be destroyed by enjoying the fruits, in the form of punishment.
Therefore in the science of atonement it is extremely important to consider the
qualification of the performer.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'aśuddhācaraṇe
teṣām aśraddhā vartate svataḥ
prapañca-viṣayād
rāgo vaikuṇṭhābhimukho yataḥ', E'aśuddhācaraṇe
teṣām aśraddhā vartate svataḥ
prapañca-viṣayād
rāgo vaikuṇṭhābhimukho yataḥ',
    E'aśuddhācaraṇe
teṣām aśraddhā vartate svataḥ
prapañca-viṣayād
rāgo vaikuṇṭhābhimukho yataḥ', E'аш́уддга̄чаран̣е
теша̄м аш́раддга̄ вартате сватах̣
прапан̃ча-вішайа̄д
ра̄ґо ваікун̣т̣ха̄бгімукхо йатах̣',
    E'', E'',
    E'From animal life to human life and from regulative principles to attachment
there are many levels of qualification. Performance of duties a person has
according to his qualification is called piety, and deviation from those duties
is called impiety. If we consider all activities according to this principle,
then what is the need for separately calculating one''s piety and impiety? According
to qualification, one person''s piety may be another''s impiety. When jackals and
dogs steal and goats have illicit sex, can it be considered sinful? Such
activities are certainly counted as sins for human beings. Those who are very
attached to material objects should associate with women through marriage, as
this is piety for such persons. But for one whose attachment for material
objects has been totally directed towards the Supreme Lord, loving affairs
through marriage are forbidden; because by great fortune he has attained love
for Krsna. To divert that love for the Lord to material objects is certainly an
act of degradation. On the other hand, people who are like animals may need to
associate with more than one woman through marriage to become pious. From the
beginning of the process of worshiping the Lord up to the attainment of the
mood of Vraja there are different modes, such as ignorance, passion, goodness,
and transcendence. According to the practitioner''s nature, advancement of
knowledge, and absorption in the spirit of Vaikuntha, innumerable
qualifications are seen. According to those qualifications, different forms of
karma and jnana are seen. We do not want to increase the volume of this book by
mentioning examples, because a thoughtful person can understand this himself.
All dualities like sin and virtue, religion and irreligion, proper and improper
actions, heaven and hell, knowledge and ignorance are all objects of dispute
for persons who have perverted attachment. Actually they are neither pious nor
impious. We only explain them as pious or impious due to relative
consideration. If we independently consider, then we can understand that the
pervertedness of the soul''s attachment is impiety and remaining in the
constitutional position of the soul''s attachment is called piety. Swanlike
persons accept those activities that nourish piety to be pious and those
activities which nourish impiety to be impious. They do not take shelter of dry
speculation or agree with biased arguments.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'adhikāra-vicāreṇa
guṇa-doṣau vivicyate
tyajanti satataḿ
vādān śuṣka-tarkānanātmakān', E'adhikāra-vicāreṇa
guṇa-doṣau vivicyate
tyajanti satataḿ
vādān śuṣka-tarkānanātmakān',
    E'adhikāra-vicāreṇa
guṇa-doṣau vivicyate
tyajanti satataḿ
vādān śuṣka-tarkānanātmakān', E'адгіка̄ра-віча̄рен̣а
ґун̣а-дошау вівічйате
тйаджанті сататаḿ
ва̄да̄н ш́ушка-тарка̄нана̄тмака̄н',
    E'', E'',
    E'Nourishing love is the living entity''s goal of life. Knowing this, the devotees
of Krsna do not like or hate external formalities and sectarian conflicts. They
remain indifferent to all forms of insignificant bigotry.
5) The
learned devotees of Hari know perfectly well that activities that are pleasing
to Lord Krsna are called karma and activities that attract one''s mind to Krsna
are called knowledge. Keeping this in mind, they engage only in the activities
and cultivation of knowledge that nourishes their spiritual lives. They
understand that all other activities and knowledge are useless.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sampradāya-vivādeṣu
bāhya-lińgādiṣu kvacit
na dviṣanti na
sajjante prayojana-parāyaṇāḥ', E'sampradāya-vivādeṣu
bāhya-lińgādiṣu kvacit
na dviṣanti na
sajjante prayojana-parāyaṇāḥ',
    E'sampradāya-vivādeṣu
bāhya-lińgādiṣu kvacit
na dviṣanti na
sajjante prayojana-parāyaṇāḥ', E'сампрада̄йа-віва̄дешу
ба̄хйа-ліńґа̄дішу квачіт
на двішанті на
саджджанте прайоджана-пара̄йан̣а̄х̣',
    E'', E'',
    E'They are naturally humble, fixed in knowledge, and always busy for the welfare
of others. Their intelligence is so fixed that even if they suffer various
severe pains in their present or future lives, they never deviate from
spiritual life.
7  8)
Whether their mind and body naturally change by the awakening of attachment or
whether they cultivate knowledge to realize the science of attachment, the
devotees of Krsna who are in the mood of Vraja come to a natural conclusion.
The conclusion is that the soul is by nature pure and devoid of material
qualities. What we call the mind has no existence of its own, for it is only a
perversion of the soul''s contact with matter for increasing the knowledge of
the conditioned soul. The soul''s original propensities are displayed in the
relative world by the propensities of the mind. In the realm of Vaikuntha, a
soul acts according to his constitutional propensitiesthere is no existence of
this mind. When a soul comes in contact with matter, his pure knowledge becomes
almost dormant and he accepts perverted knowledge as real. This knowledge is
grasped by the interaction of the mind with matter. This is called material
knowledge. Our present body is material and related with the soul only as long
as the soul is conditioned. Only the Supreme Lord knows the relationship
between a pure soul and his gross and subtle bodies; human beings are unable to
know this. In the course of devotional service a devotee must accept whatever
is required to keep body and soul together for as long as Lord Krsna desires.
The living entity is spiritual by nature. He is an eternal servant of the Lord,
so his only constitutional duty is to love the Lord. At the time of giving up
the body, one attains, by the will of the Lord, a destination according to the
state of one''s heart. Therefore a person who desires auspiciousness must accept
the process of devotional service. When the Lord''s mercy is bestowed on a
devotee who is following the process of devotional service, then the devotee''s
connection with the material world is easily destroyed. This is never possible
by one''s own endeavoreither by giving up the body, by renouncing activities,
or by opposing the Lord. This supreme truth was obtained through samadhi. Human
life is based on karma and jnana, but when one takes shelter of bhakti, then
one''s devotion for Krsna awakens.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'tat karma
hari-toṣaḿ yat sā vidyā tan-matir yayā
smṛtvaitan
niyataḿ kāryaḿ sādhayanti
manīṣiṇaḥ', E'tat karma
hari-toṣaḿ yat sā vidyā tan-matir yayā
smṛtvaitan
niyataḿ kāryaḿ sādhayanti
manīṣiṇaḥ',
    E'tat karma
hari-toṣaḿ yat sā vidyā tan-matir yayā
smṛtvaitan
niyataḿ kāryaḿ sādhayanti
manīṣiṇaḥ', E'тат карма
харі-тошаḿ йат са̄ відйа̄ тан-матір йайа̄
смр̣тваітан
нійатаḿ ка̄рйаḿ са̄дгайанті
манı̄шін̣ах̣',
    E'', E'',
    E'Persons who have realized this truth and are absorbed in the mood of Vraja
worship Krsna, who is eternally full of knowledge and bliss, through samadhi.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jīvane maraṇe
vāpi buddhis teṣāḿ na muhyati
dhīrā
namra-svabhāvāś ca sarva-bhūta-hite ratāḥ', E'jīvane maraṇe
vāpi buddhis teṣāḿ na muhyati
dhīrā
namra-svabhāvāś ca sarva-bhūta-hite ratāḥ',
    E'jīvane maraṇe
vāpi buddhis teṣāḿ na muhyati
dhīrā
namra-svabhāvāś ca sarva-bhūta-hite ratāḥ', E'джı̄ване маран̣е
ва̄пі буддгіс теша̄ḿ на мухйаті
дгı̄ра̄
намра-свабга̄ва̄ш́ ча сарва-бгӯта-хіте рата̄х̣',
    E'', E'',
    E'When a living entity''s love for Krsna increases, then the waves of that love
spread throughout his subtle mental body and create various mixed emotions. At
that time there is an awakening of thinking, remembering, meditating,
concentrating, and considering how to purify oneselfall of which help one
worship through the mind. One should not abandon the process of worshiping
through the mind because of mixed emotions, for these mixed emotions naturally
remain until the destruction of the subtle body. The mental activities that
accumulate through contact with matter demonstrate the concept of mundane
idolatry, but the emotions that manifest and gradually spread throughout the
mind and body in the soul''s endeavor for samadhi are all spiritually reflected
truths.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'ātmā
śuddhaḥ kevalas tu mano jāḍyodbhavaḿ dhruvam
dehaḿ
prāpañcikaḿ śaśvad etat teṣāḿ
nirūpitam', E'ātmā
śuddhaḥ kevalas tu mano jāḍyodbhavaḿ dhruvam
dehaḿ
prāpañcikaḿ śaśvad etat teṣāḿ
nirūpitam',
    E'ātmā
śuddhaḥ kevalas tu mano jāḍyodbhavaḿ dhruvam
dehaḿ
prāpañcikaḿ śaśvad etat teṣāḿ
nirūpitam', E'а̄тма̄
ш́уддгах̣ кевалас ту мано джа̄д̣йодбгаваḿ дгрувам
дехаḿ
пра̄пан̃чікаḿ ш́аш́вад етат теша̄ḿ
нірӯпітам',
    E'', E'',
    E'Thus, for the conditioned souls, loving exchanges take the form of mental
activities. These mental activities, which are reflections of spiritual
exchanges, swell and further spread throughout the body. They appear on the tip
of the tongue and glorify the spiritually reflected names and qualities of the
Lord. They appear at the ears and hear the names and qualities of the Lord.
They appear in the eyes and see the spiritually reflected sat-cid-ananda Deity
form of the Lord in this material world. The shuddha-sattvika-bhavas, bodily
transformations, swell in the body and manifest in the form of hairs standing
on end, crying, perspiring, shivering, dancing, offering obeisances, falling to
the ground, embracing with love, and traveling to the holy places. The soul''s
inherent emotions could continue to remain active with the soul, but in the
material world the mercy of the Lord is the principle force for awakening
spiritual emotions and situating one in his constitutional position. With a
desire to convert material attachment into spiritual attachment, all the
spiritual emotions are mixed with material emotions for giving up parag-gati
and practicing pratyag-gati. When a soul sits in the chariot of the mind and
chases the sense objects through the gates of the senses, this is called
parag-gati. When this current again flows towards the soul''s own abode, it is
called pratyag-gati. The pratyag-dharma of being greedy to eat palatable foods
is to eat maha-prasada. The pratyag-dharma of the eyes is to see holy places
and the beautiful form of the Lord. The pratyag-dharma of the ears is to hear
the pastimes of Hari and devotional songs. The pratyag-dharma of the nose has
been exemplified by the four Kumaras when they smelled the tulasi and
sandalwood that was offered to the feet of the Lord. The pratyag-dharma of
associating with the opposite sex through marriage for the prosperity of a
Vaisnava family was exemplified by Manu, Janaka, Jayadeva, and Pipaji. The
pratyag-dharma of festivals is seen in the festivals celebrating the pastimes
of Lord Hari. These human characteristics filled with emotions of
pratyag-dharma are seen in the lives of pure swanlike personalities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jīvaś
cid-bhagavad-dāsaḥ prīti-dharmātmakaḥ sadā
prākṛte
vartamāno''yaḿ bhakti-yoga-samanvitaḥ', E'jīvaś
cid-bhagavad-dāsaḥ prīti-dharmātmakaḥ sadā
prākṛte
vartamāno''yaḿ bhakti-yoga-samanvitaḥ',
    E'jīvaś
cid-bhagavad-dāsaḥ prīti-dharmātmakaḥ sadā
prākṛte
vartamāno''yaḿ bhakti-yoga-samanvitaḥ', E'джı̄ваш́
чід-бгаґавад-да̄сах̣ прı̄ті-дгарма̄тмаках̣ сада̄
пра̄кр̣те
вартама̄но''йаḿ бгакті-йоґа-саманвітах̣',
    E'', E'',
    E'Does this mean that swanlike persons engage only in spiritual activities and
neglect material activities? No. Swanlike persons worship Krsna in the mood of
one who is enjoyed, and they valiantly take care of the external body. Eating,
enjoying, exercise, industrial enterprises, walking in the open air, sleeping,
riding in vehicles, protecting the body, protecting the society, and traveling
are all seen in the lives of swanlike persons.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'jñātvaitad
vraja-bhāvāḍhyā vaikuṇṭha-sthāḥ
sadātmani
bhajanti sarvadā
kṛṣṇaḿ sac-cid-ānanda-vigraham', E'jñātvaitad
vraja-bhāvāḍhyā vaikuṇṭha-sthāḥ
sadātmani
bhajanti sarvadā
kṛṣṇaḿ sac-cid-ānanda-vigraham',
    E'jñātvaitad
vraja-bhāvāḍhyā vaikuṇṭha-sthāḥ
sadātmani
bhajanti sarvadā
kṛṣṇaḿ sac-cid-ānanda-vigraham', E'джн̃а̄тваітад
враджа-бга̄ва̄д̣хйа̄ ваікун̣т̣ха-стха̄х̣
сада̄тмані
бгаджанті сарвада̄
кр̣шн̣аḿ сач-чід-а̄нанда-віґрахам',
    E'', E'',
    E'The swanlike Vaisnavas valiantly remain and work among men. They are the
shelter of women and are respected by them. They take part in social activities
and get much experience. They teach their children artha-sastra and thus become
known as headmasters.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'cit-sattve
prema-bāhulyāl lińga-dehe mano-maye
miśra-bhāva-gatā
sā tu prītir utplāvitā satī', E'cit-sattve
prema-bāhulyāl lińga-dehe mano-maye
miśra-bhāva-gatā
sā tu prītir utplāvitā satī',
    E'cit-sattve
prema-bāhulyāl lińga-dehe mano-maye
miśra-bhāva-gatā
sā tu prītir utplāvitā satī', E'чіт-саттве
према-ба̄хулйа̄л ліńґа-дехе мано-майе
міш́ра-бга̄ва-ґата̄
са̄ ту прı̄тір утпла̄віта̄ сатı̄',
    E'', E'',
    E'Books on physical and mental science, books on industry, books on the science
of language, books on grammar, and books on ornamental language are all known
as artha-sastra. Some kind of physical, mental, familial, and social benefits
are obtained from these literatures. The name of these benefits is artha. The
advantage of these literatures is that by studying books on medicine, one can
get the benefit of a cure. By studying books on music, one can get the benefit
of happiness to the mind and ears. By material scientific knowledge, various
wonderful machines are created. By books on astrology, one can get the benefit
of ascertaining subjects like proper and improper times. Those who study such
artha-sastras are known as artha-vit scholars. The smriti-sastras establish
varnashrama-dharma and are also known as artha-sastra. The smarta scholars are
also known as artha-vit scholars, because the main purpose of their
occupational duties is to protect society. The spiritual scholars, however,
practice spiritual life with these arthas. Swanlike Vaisnavas are never averse
to discussing these scriptures. They abstract the supreme goal of spiritual
life from these artha-sastras and become worshipable among artha-vit scholars.
The artha-vit scholars are happy to assist them in ascertaining the Absolute
Truth. The swanlike Vaisnavas are present in the battlefield as negotiators.
They do not hate or reject various sinful persons. Swanlike Vaisnavas are
always engaged in purifying the hearts of sinful persons by confidential
instructions, public lectures, friendly advice, chastising, setting example,
and sometimes punishing sinners.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'prīti-kāryam ato
baddhe mano-mayam itīkṣitam
punas
tad-vyāpitaḿ dehe pratyag-bhāva-samanvitam', E'prīti-kāryam ato
baddhe mano-mayam itīkṣitam
punas
tad-vyāpitaḿ dehe pratyag-bhāva-samanvitam',
    E'prīti-kāryam ato
baddhe mano-mayam itīkṣitam
punas
tad-vyāpitaḿ dehe pratyag-bhāva-samanvitam', E'прı̄ті-ка̄рйам ато
баддге мано-майам ітı̄кшітам
пунас
тад-вйа̄пітаḿ дехе пратйаґ-бга̄ва-саманвітам',
    E'', E'',
    E'Although the characteristics of swanlike Vaisnavas are wonderful, sometimes
they do not manifest the above-mentioned activities due to being overwhelmed
with increased feelings of love. The swanlike Vaisnavas, who are very dear to
all, sometimes live in secluded places and engage in the most confidential
internal worship of the Lord.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'sāra-grāhī
bhajan kṛṣṇaḿ
yoṣid-bhāvāśrite''tmani
vīravat kurute
bāhye śārīraḿ karma nityaśaḥ', E'sāra-grāhī
bhajan kṛṣṇaḿ
yoṣid-bhāvāśrite''tmani
vīravat kurute
bāhye śārīraḿ karma nityaśaḥ',
    E'sāra-grāhī
bhajan kṛṣṇaḿ
yoṣid-bhāvāśrite''tmani
vīravat kurute
bāhye śārīraḿ karma nityaśaḥ', E'са̄ра-ґра̄хı̄
бгаджан кр̣шн̣аḿ
йошід-бга̄ва̄ш́ріте''тмані
вı̄рават куруте
ба̄хйе ш́а̄рı̄раḿ карма нітйаш́ах̣',
    E'', E'',
    E'While describing the glories of Vraja, the author''s intense greed for love of
God has awakened and he therefore says, When will I be so fortunate that I
will worship the sat-cid-ananda Supreme Lord in the association of swanlike
Vaisnavas in the forest of Vrndavana on the banks of the Yamuna?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'puruṣeṣu
mahā-vīro yoṣitsu puruṣas tathā
samājeṣu
mahābhijño bālakeṣu suśikṣakaḥ', E'puruṣeṣu
mahā-vīro yoṣitsu puruṣas tathā
samājeṣu
mahābhijño bālakeṣu suśikṣakaḥ',
    E'puruṣeṣu
mahā-vīro yoṣitsu puruṣas tathā
samājeṣu
mahābhijño bālakeṣu suśikṣakaḥ', E'пурушешу
маха̄-вı̄ро йошітсу пурушас татха̄
сама̄джешу
маха̄бгіджн̃о ба̄лакешу суш́ікшаках̣',
    E'', E'',
    E'Let my eternal occupation be to take shelter of the lotus feet of the swanlike
Vaisnavas. They are captains of the boat to cross the material ocean, and only
by their mercy do karmis and jnanis become swanlike Vaisnavas.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'artha-śāstra-vidāḿ
śreṣṭhaḥ paramārtha-prayojakaḥ
śānti-saḿsthāpako
yuddhe pāpināḿ citta-śodhakaḥ', E'artha-śāstra-vidāḿ
śreṣṭhaḥ paramārtha-prayojakaḥ
śānti-saḿsthāpako
yuddhe pāpināḿ citta-śodhakaḥ',
    E'artha-śāstra-vidāḿ
śreṣṭhaḥ paramārtha-prayojakaḥ
śānti-saḿsthāpako
yuddhe pāpināḿ citta-śodhakaḥ', E'артха-ш́а̄стра-віда̄ḿ
ш́решт̣хах̣ парама̄ртха-прайоджаках̣
ш́а̄нті-саḿстха̄пако
йуддге па̄піна̄ḿ чітта-ш́одгаках̣',
    E'', E'',
    E'There are three types of Vaisnavaskanistha-adhikaris, whose faith is very
soft, madhyama-adhikaris, and uttama-adhikaris. Those who consider karma-kanda
and its results as permanent and are averse to the Absolute Truth are called
mundane fruitive workers. Those who want to establish the liberation of merging
in the impersonal Brahman are extremely dry and devoid of rasa. They are burnt
by knowledge due to not understanding eternal varigatedness. The Vaisnavas are
those who have accepted the eternal spiritual variegated nature of the living
entities'' supreme destination. They are convinced that the living entities''
eternal position is to worship the Lord, who is merciful, full of sweetness and
opulence, the abode of happiness, and always different from the living
entities. The fruitive workers and mental speculators can become Vaisnavas and
live as pure human beings by the influence of good association and good
fortunate. The contamination that is found in the lives of kanistha-adhikari
and madhyama-adhikari Vaisnavas is found in abundance among fruitive workers
and mental speculators. Even if the fruitive workers and mental speculators
become Vaisnavas, the remnants of their material conceptions and arguments
remain as bad habits. Those bad habits are the contaminations that are found in
the lives of kanistha-adhikaris and madhyama-adhikaris. Anyway, these
contaminations are certainly the result of nescience and prejudice. Among the
three types of Vaisnavas, the uttama-adhikari Vaisnavas have no prejudices or
material conceptions. They may have a lack of knowledge in various material
subject matters, but the swanlike Vaisnavas vigorously destroy all sorts of
prejudices. The madhyama-adhikari Vaisnavas do not wish to be asslike
Vaisnavas, but the swanlike tendency is not fully present in them. They have
some doubts in their hearts due to previous prejudice. Although such persons
accept spiritual variegated nature and natural samadhi, they cannot properly
realize the science of Vaikuntha because of their argumentative nature.
Although the kanistha-adhikaris are known as Vaisnavas, they are totally under
the control of prejudice. They associate with fruitive work under the
jurisdiction of regulative principles. Although they are not proper candidates
for studying this book, if they discuss it with the assistance of
uttama-adhikaris, they will also become uttama-adhikaris. Therefore all three
types of Vaisnavas should study this book in order to increase their love for
Krsna and achieve transcendental happiness.
19) We
have discussed the Absolute Truth in this book, so please excuse any grammar or
language defects. Swanlike persons should not waste any time in this way. Those
who criticize such external defects while studying this book will obstruct its
main purposeaccepting the essence of the Absolute Truthand are not eligible
to study this book. Arguments born of childish education are despicable in
serious subject matters.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'bāhulyāt
prema-sampatteḥ sa kadācij jana-priyaḥ
antarańgaḿ
bhajaty eva rahasyaḿ rahasi sthitaḥ', E'bāhulyāt
prema-sampatteḥ sa kadācij jana-priyaḥ
antarańgaḿ
bhajaty eva rahasyaḿ rahasi sthitaḥ',
    E'bāhulyāt
prema-sampatteḥ sa kadācij jana-priyaḥ
antarańgaḿ
bhajaty eva rahasyaḿ rahasi sthitaḥ', E'ба̄хулйа̄т
према-сампаттех̣ са када̄чідж джана-прійах̣
антараńґаḿ
бгаджатй ева рахасйаḿ рахасі стхітах̣',
    E'', E'',
    E'This book, which is dear to the devotees, was compiled by Kedaranatha, who
belongs to the Bharadvaja kayastha community of the Datta family and who is a
resident of Hatta Khola, Calcutta. This book was written in the year 1879 while
staying in the town of Bhadraka, Orissa, for official purposes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    E'kadāhaḿ
śrī-vrajāraṇye yamunā-taṭam
āśritaḥ
bhajāmi
sac-cid-ānandaḿ sāra-grāhi-janānvitaḥ', E'kadāhaḿ
śrī-vrajāraṇye yamunā-taṭam
āśritaḥ
bhajāmi
sac-cid-ānandaḿ sāra-grāhi-janānvitaḥ',
    E'kadāhaḿ
śrī-vrajāraṇye yamunā-taṭam
āśritaḥ
bhajāmi
sac-cid-ānandaḿ sāra-grāhi-janānvitaḥ', E'када̄хаḿ
ш́рı̄-враджа̄ран̣йе йамуна̄-тат̣ам
а̄ш́рітах̣
бгаджа̄мі
сач-чід-а̄нандаḿ са̄ра-ґра̄хі-джана̄нвітах̣',
    E'', E'',
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
    E'sāra-grāhi-vaiṣṇavānāḿ
padāśrayaḥ sadāstu me
yat-kṛpā-leśa-mātreṇa
sāra-grāhī bhaven naraḥ', E'sāra-grāhi-vaiṣṇavānāḿ
padāśrayaḥ sadāstu me
yat-kṛpā-leśa-mātreṇa
sāra-grāhī bhaven naraḥ',
    E'sāra-grāhi-vaiṣṇavānāḿ
padāśrayaḥ sadāstu me
yat-kṛpā-leśa-mātreṇa
sāra-grāhī bhaven naraḥ', E'са̄ра-ґра̄хі-ваішн̣ава̄на̄ḿ
пада̄ш́райах̣ сада̄сту ме
йат-кр̣па̄-леш́а-ма̄трен̣а
са̄ра-ґра̄хı̄ бгавен нарах̣',
    E'', E'',
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
    E'vaiṣṇavāḥ
komala-śraddhā madhyamāś cottamās tathā
grantham etat
samāsādya modantāḿ kṛṣṇa-prītaye', E'vaiṣṇavāḥ
komala-śraddhā madhyamāś cottamās tathā
grantham etat
samāsādya modantāḿ kṛṣṇa-prītaye',
    E'vaiṣṇavāḥ
komala-śraddhā madhyamāś cottamās tathā
grantham etat
samāsādya modantāḿ kṛṣṇa-prītaye', E'ваішн̣ава̄х̣
комала-ш́раддга̄ мадгйама̄ш́ чоттама̄с татха̄
ґрантхам етат
сама̄са̄дйа моданта̄ḿ кр̣шн̣а-прı̄тайе',
    E'', E'',
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
    E'paramārtha-vicāre''smin
bāhya-doṣa-vicārataḥ
na kadācid
dhata-śraddhaḥ sāra-grāhi-jano bhavet', E'paramārtha-vicāre''smin
bāhya-doṣa-vicārataḥ
na kadācid
dhata-śraddhaḥ sāra-grāhi-jano bhavet',
    E'paramārtha-vicāre''smin
bāhya-doṣa-vicārataḥ
na kadācid
dhata-śraddhaḥ sāra-grāhi-jano bhavet', E'парама̄ртха-віча̄ре''смін
ба̄хйа-доша-віча̄ратах̣
на када̄чід
дгата-ш́раддгах̣ са̄ра-ґра̄хі-джано бгавет',
    E'', E'',
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
    E'aṣṭādaśa-śate
śāke bhadrake datta-vaḿśajaḥ
kedāro''racayac
chāstram idaḿ sādhu-jana-priyam', E'aṣṭādaśa-śate
śāke bhadrake datta-vaḿśajaḥ
kedāro''racayac
chāstram idaḿ sādhu-jana-priyam',
    E'aṣṭādaśa-śate
śāke bhadrake datta-vaḿśajaḥ
kedāro''racayac
chāstram idaḿ sādhu-jana-priyam', E'ашт̣а̄даш́а-ш́ате
ш́а̄ке бгадраке датта-ваḿш́аджах̣
кеда̄ро''рачайач
чха̄страм ідаḿ са̄дгу-джана-прійам',
    E'', E'',
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
