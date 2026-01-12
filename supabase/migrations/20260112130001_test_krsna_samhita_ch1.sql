-- TEST Import Krsna Samhita - Chapter 1 only
-- Run this first to verify migration works

BEGIN;

INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos)
VALUES ('krsna-samhita', 'Krsna Samhita', 'Крішна-самхіта', true, false)
ON CONFLICT (slug) DO UPDATE SET
  title_ua = EXCLUDED.title_ua,
  has_cantos = EXCLUDED.has_cantos;

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'krsna-samhita';

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


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


  INSERT INTO public.verses (
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
    translation_en = EXCLUDED.translation_en;


END $$;

COMMIT;
