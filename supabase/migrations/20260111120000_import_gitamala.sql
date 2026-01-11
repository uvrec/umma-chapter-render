-- Import Gitamala by Bhaktivinoda Thakura
-- Proper structure: books -> cantos -> chapters -> verses
-- Fields: sanskrit_en/ua, transliteration_en/ua, synonyms_en/ua, translation_en/ua, commentary_en/ua

BEGIN;

-- 1. Create/update the book
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos)
VALUES ('gitamala', 'Gitamala', E'Ґіта-мала̄', true, true)
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
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'gitamala';


  -- Canto 1: Yamuna Bhavavali
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 1, E'Yamuna Bhavavali', E'Йамуна-бгава̄валі', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 2: Karpanya Panjika
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 2, E'Karpanya Panjika', E'Карпан̣йа-пан̃джіка̄', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 3: Soka Satana
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 3, E'Soka Satana', E'Ш́ока-ш́а̄тана', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 4: Rupanuga Bhajana Darpana
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 4, E'Rupanuga Bhajana Darpana', E'Рӯпа̄нуґа-бгаджана-дарпан̣а', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Canto 5: Siddhi Lalasa
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, 5, E'Siddhi Lalasa', E'Сіддгі-лаласа̄', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;


  -- Section 1, Song 1: Ohe Prabhu Doyamoy
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Ohe Prabhu Doyamoy', E'Охе Прабгу Дойамоі', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
ohe prabhu doyāmoya tomāra caraṇa-dwoya
śruti-śiropari śobhā pāya
guru-jana-śire puna śobhā pāya śata guṇa
dekhi āmāra parāṇa juḍāya', E'харі хе
охе прабгу дойа̄мойа тома̄ра чаран̣а-двойа
ш́руті-ш́іропарі ш́обга̄ па̄йа
ґуру-джана-ш́іре пуна ш́обга̄ па̄йа ш́ата ґун̣а
декхі а̄ма̄ра пара̄н̣а джуд̣а̄йа',
    E'', E'',
    E'Oh my Lord, oh most compassionate Personality! Your two divine lotus feet are
beautifully decorating the summit of all the scriptures. And when those lotus
feet in turn decorate the heads of all the spiritual masters coming in the disciplic succession, then their beauty and splendor
increases hundred fold. Seeing this truth, my heart has become fully satisfied.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'jība manoratha-patha tańhi saba anugata
jība-bañcha-kalpa-taru jathā
jībera se kula dhana ati-pūjya sanātana
jībera carama gati tathā', E'джı̄ба маноратха-патха таńхі саба ануґата
джı̄ба-бан̃чха-калпа-тару джатха̄
джı̄бера се кула дгана аті-пӯджйа сана̄тана
джı̄бера чарама ґаті татха̄',
    E'', E'',
    E'The desires of all the jiva souls are actually
following the path which leads them to Your beautiful lotus feet, which are
just purpose-trees as much as they bestow the fulfillment of the most cherished
desires of all these souls. Indeed, Your feet are just
like the very wealth of the dynasty of jivas, and
they are the most revered object of worship for all of time to come. Thus they
are the ultimate goal and refuge of all souls.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'kamalākha-pada-dwoya parama ānanda-moya
nikhapaṭa e sebiyā satata
e bhaktibinoda cāya satata tuṣite tāya
bhakta-janera ho''ye anugata', E'камала̄кха-пада-двойа парама а̄нанда-мойа
нікхапат̣а е себійа̄ сатата
е бгактібінода ча̄йа сатата тушіте та̄йа
бгакта-джанера хо''йе ануґата',
    E'', E'',
    E'The divine lotus feet of the lotus-eyed Lord, are abounding in supreme
spiritual bliss. Sincerely serving those divine feet continuously, Bhaktivinoda wants to satisfy them by remaining as a humble
follower of the devotees of the Lord.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 2: Tomari Ksane Hoy
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Tomari Ksane Hoy', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
tomāra īkṣana hoya sakala utpatti loya
caturdaśa bhubanete jata
joḍa jība ādi kori'' tomāra kṛpāya hori
labhe janma āra ko''bo kota', E'харі хе
тома̄ра ı̄кшана хойа сакала утпатті лойа
чатурдаш́а бгубанете джата
джод̣а джı̄ба а̄ді корі'' тома̄ра кр̣па̄йа хорі
лабге джанма а̄ра ко''бо кота',
    E'', E'',
    E'Oh my dear Lord Hari! Merely by Your glance, all creations throughout the
fourteen worlds come into being. By Your mercy alone, oh Lord, all souls take
their birth within this world of matter. What more can I say than this?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'tāhādera bṛtti jata tomāra īkṣaṇe
swataḥ
janme prabhu tumi sarbeśwara
sakala jantura tumi swabhābika nitya-swāmī
suhṛn mitra prāṇera
īśwara', E'та̄ха̄дера бр̣тті джата тома̄ра ı̄кшан̣е
сватах̣
джанме прабгу тумі сарбеш́вара
сакала джантура тумі свабга̄біка нітйа-сва̄мı̄
сухр̣н мітра пра̄н̣ера
ı̄ш́вара',
    E'', E'',
    E'When You cast Your
glance, then automatically all the souls awaken into their own different
natures, propensities and activities. Thus You, my dear Lord, are the only
Master and Controller of all. You are by nature the eternal Master of all
living beings, and You are thereby the dearest friend and Lord of everyone''s
heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'e bhaktibinoda
koya śuno prabhu doyāmoya
bhakti prati bātsalya
tomāra
naisargika dharma hoya aupādhika
kabhu noya
dāse doyā hoiyā udāra', E'е бгактібінода
койа ш́уно прабгу дойа̄мойа
бгакті праті ба̄тсалйа
тома̄ра
наісарґіка дгарма хойа аупа̄дгіка
кабгу нойа
да̄се дойа̄ хоійа̄ уда̄ра',
    E'', E'',
    E'Now Bhaktivinoda
says, please hear me, oh munificent Lord! The loving affection You show towards
Your own devotees is most natural and eternal. It can never be classified as
being of a temporary, designative nature. Thus, the kindness You show to Your
own eternal servants is most liberal and magnanimous.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 3: Para Tattva Vicaksana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Para Tattva Vicaksana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
para-tattwa bicakṣaṇa byāsa ādi muni-gaṇa
śāstra bicāriyā bāra bāra
prabhu taba nitya-rūpa guṇa-śīla
anurūpa
tomāra caritra sudhā-sāra', E'харі хе
пара-таттва бічакшан̣а бйа̄са а̄ді муні-ґан̣а
ш́а̄стра біча̄рійа̄ ба̄ра ба̄ра
прабгу таба нітйа-рӯпа ґун̣а-ш́ı̄ла
анурӯпа
тома̄ра чарітра судга̄-са̄ра',
    E'', E'',
    E'Oh my Lord! All the great sages headed by Srila Vyasadeva are most experienced and wise regarding the transcendental
truth. This is because they discuss and deliberate on the revealed scriptures
again and again. Thereby they help to manifest these sacred literatures which
reveal Your eternal personal form abounding in all
virtuous qualities, Your divine character which is the very essence of
ambrosial nectar as well as Your eternal pastimes of pure transcendental
goodness. These principle scriptures thus prescribe the path of auspicious
well-being for all souls. However, those unfortunate souls who are blinded by
the material modes of passion and ignorance, who harbor the nature of demons,
and who are foolish and dull-minded cannot possibly understand Your divine form or pastimes which are described throughout
all these scriptures.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'śuddha-sattwa-moyī līlā mukhya-śāstre
prokāśila
jībera kuśala su-bidhāna
rajas-tamo-guṇa-andha asura-prakṛti-manda-
jane tāhā bujhita nā jāne', E'ш́уддга-саттва-мойı̄ лı̄ла̄ мукхйа-ш́а̄стре
прока̄ш́іла
джı̄бера куш́ала су-бідга̄на
раджас-тамо-ґун̣а-андга асура-пракр̣ті-манда-
джане та̄ха̄ буджхіта на̄ джа̄не',
    E'', E'',
    E'Those who live in this universe but are not interested
in Your eternal form remain completely oblivious just like ignorant frogs who
live in a small, shallow well. Now Bhaktivinoda
sings, alas! What an unfortunate, sorry situation has arisen here! For it seems
that the eternal servants of Hari have not become
fixed up in the service of their eternal Lord Hari.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'nāhi māne nitya-rūpa bhajiyā maṇḍūka-kūpa
rahe tāhe udāsīna prāya
e bhaktibinoda gāya ki durdaiba haya
hāya
hari-dāsa nāhi hari pāya', E'на̄хі ма̄не нітйа-рӯпа бгаджійа̄ ман̣д̣ӯка-кӯпа
рахе та̄хе уда̄сı̄на пра̄йа
е бгактібінода ґа̄йа кі дурдаіба хайа
ха̄йа
харі-да̄са на̄хі харі па̄йа',
    E'', E'',
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


  -- Section 1, Song 4: Jagater Bastu Jata
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Jagater Bastu Jata', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
jagatera bastu jata baddha saba swabhābata
deśa
kāla bastu simāśroya
tumi prabhu sarbeśwara naha sīmā-bidhi-para
bidhi saba kampe taba
bhoya', E'харі хе
джаґатера басту джата баддга саба свабга̄бата
деш́а
ка̄ла басту сіма̄ш́ройа
тумі прабгу сарбеш́вара наха сı̄ма̄-бідгі-пара
бідгі саба кампе таба
бгойа',
    E'', E'',
    E'Oh my dear Lord Hari! All the things contained within this universe are by
nature conditioned and bound up by the limits of material time, place and
circumstances. But You, dear Lord, are not subordinate
to any such limitation or even to scriptural injunctions. Indeed, all rules and
regulations are trembling in fear of Your Lordship.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'sama bā adhika taba swabhābataḥ asambhāba
bidhi lańghi'' taba abasthāna
swatantra swabhāba dharo āpane gopana
koro
māyā-bale
kori'' adhiṣṭhāna', E'сама ба̄ адгіка таба свабга̄батах̣ асамбга̄ба
бідгі лаńґгі'' таба абастха̄на
сватантра свабга̄ба дгаро а̄пане ґопана
коро
ма̄йа̄-бале
корі'' адгішт̣ха̄на',
    E'', E'',
    E'It is naturally
impossible for any kind of law to be equal to, or surpass Your Lordship, for Your transcendental position naturally transgresses all
rules and regulations. You possess the Supremely
independent nature, and thus You reserve the right to conceal Yourself behind
the powerful curtain of maya.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'tathāpi ananya-bhakta tomāre dekhite śakta
sadā dekhe swarūpa tomāra
e bhaktibinoda dina ananya bhajana hīna
bhakta-pada-reṇu-mātra sāra', E'татха̄пі ананйа-бгакта тома̄ре декхіте ш́акта
сада̄ декхе сварӯпа тома̄ра
е бгактібінода діна ананйа бгаджана хı̄на
бгакта-пада-рен̣у-ма̄тра са̄ра',
    E'', E'',
    E'Despite this covering
screen of maya''s illusions, my dear Lord, Your pure
unalloyed devotees have the power to see You. Indeed,
wherever they turn their eyes, they see Your original
personal form there. However, this Bhaktivinoda is
very fallen and is completely bereft of unalloyed devotional worship. But he
has one hope... he has considered the dust of Your
devotees'' feet to be the sole essence of his life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 5: Tumi Sarva Guna Juta
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Tumi Sarva Guna Juta', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
tumi sarba-guṇa-juta
śakti taba baśī-bhūta
badānya sarala śuci dhīra
doyālu madhura sama kṛtī
sthira sarbottama
kṛtajña-lakhaṇe punaḥ bīra', E'харі хе
тумі сарба-ґун̣а-джута
ш́акті таба баш́ı̄-бгӯта
бада̄нйа сарала ш́учі дгı̄ра
дойа̄лу мадгура сама кр̣тı̄
стхіра сарботтама
кр̣таджн̃а-лакхан̣е пунах̣ бı̄ра',
    E'', E'',
    E'Oh my Lord Hari! You are invested with all good qualities, for all
energies are fully under Your control. You are most
magnanimous, simple and straightforward, clean, patient, compassionate sweet,
equal to all, successful, peaceful, You are the best
of all, most grateful and the greatest hero.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'samasta kalyāṇa-guṇa guṇāmṛta
sambhābana
samudra-swarūpa
bhagabān
bindu bindu guṇa taba sarba-jība-subaibhaba
tumi pūrṇa sarba-śaktimān', E'самаста калйа̄н̣а-ґун̣а ґун̣а̄мр̣та
самбга̄бана
самудра-сварӯпа
бгаґаба̄н
бінду бінду ґун̣а таба сарба-джı̄ба-субаібгаба
тумі пӯрн̣а сарба-ш́актіма̄н',
    E'', E'',
    E'You are the origin of
all immortal nectarine qualities of auspiciousness, which are each as deep as
the ocean, and You are thus the Supreme possessor of
all spiritual opulences. All souls can each display a
small drop from the ocean of Your unlimited, complete
qualities. Thus You are the full, perfectly complete
energetic source of all potencies.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'e bhaktibinoda chāra kṛtāñjali bāra bāra
kore citta-kathā bijñāpana
taba dāsa-gaṇa-sańge taba līlā-kathā-rańge
jāya jena āmāra jībana', E'е бгактібінода чха̄ра кр̣та̄н̃джалі ба̄ра ба̄ра
коре чітта-катха̄ біджн̃а̄пана
таба да̄са-ґан̣а-саńґе таба лı̄ла̄-катха̄-раńґе
джа̄йа джена а̄ма̄ра джı̄бана',
    E'', E'',
    E'Now this most fallen Bhaktivinoda prays again and again with folded hands, and
humbly confesses all these talks from his heart. Oh Lord, I am simply passing
my life absorbed in enjoying all these discussions about Your
transcendental pastimes in the company of Your loving servitors.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 6: Tomar Gambhir Mana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Tomar Gambhir Mana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
tomāra gambhīra mana nāhi bujhe anya jana
sei mana anusāri saba
jagata-udbhāba-sthiti pralaya-soḿsāra-gati
mukti ādi śaktira baibhaba', E'харі хе
тома̄ра ґамбгı̄ра мана на̄хі буджхе анйа джана
сеі мана ануса̄рі саба
джаґата-удбга̄ба-стхіті пралайа-соḿса̄ра-ґаті
мукті а̄ді ш́актіра баібгаба',
    E'', E'',
    E'Oh, my Lord Hari! Your mind is extremely grave, and Your
deep intentions cannot be understood by any other person, although all living
beings are unconsciously following Your mind. The opulences
of Your magnificent potencies produce the creation,
maintenance and ultimate destruction of the material worlds, as well as provide
for liberation from these temporary abodes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'e saba baidika
līlā
icchā-mātra prokāśilā
jībera bāsanā anusāre
tomāte bimukha ho''ye mājila abidyā lo''ye
sei jība karma-pārābāre', E'е саба баідіка
лı̄ла̄
іччха̄-ма̄тра прока̄ш́іла̄
джı̄бера ба̄сана̄ ануса̄ре
тома̄те бімукха хо''йе ма̄джіла абідйа̄ ло''йе
сеі джı̄ба карма-па̄ра̄ба̄ре',
    E'', E'',
    E'These pastimes of
creation, maintenance and destruction are all described in the Vedic scripture.
And You have manifested it all according to Your own
sweet will, in order to fulfill the materialistic desires of certain souls.
When they become averse to You, they then become
drowned in the darkest ignorance within the ocean of fruitive
actions and reactions.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'punaḥ jadi bhakti kori'' bhaje bhakta-sańga dhori''
tabe pāya tomāra caraṇa
antarańga-līlā-rase bhase māyā nā paraśe
bhaktibinodera phire mana', E'пунах̣ джаді бгакті корі'' бгадже бгакта-саńґа дгорі''
табе па̄йа тома̄ра чаран̣а
антараńґа-лı̄ла̄-расе бгасе ма̄йа̄ на̄ параш́е
бгактібінодера пхіре мана',
    E'', E'',
    E'However, if one again
revives his devotional service to You, and worships
You in the association of Your devotees, then he can attain Your lotus feet.
Thus Bhaktivinoda''s mind has been changed back onto
the path towards You by floating in the mellows of
Your confidential pastimes, which maya is not able to
touch.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 7: Maya Baddha Jata Ksana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Maya Baddha Jata Ksana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
māyā-baddha jata kṣaṇa thāke
to'' jībera mana
joḍa mājhe kore bicāraṇa
parabyoma jñāna-moya
tāhe taba sthiti hoya
mana nāhi pāya daraśana', E'харі хе
ма̄йа̄-баддга джата кшан̣а тха̄ке
то'' джı̄бера мана
джод̣а ма̄джхе коре біча̄ран̣а
парабйома джн̃а̄на-мойа
та̄хе таба стхіті хойа
мана на̄хі па̄йа дараш́ана',
    E'', E'',
    E'Oh my dear Lord Hari! So long as the minds of the jivas are conditioned by maya,
they simply wander about and loiter within the world of dead matter. However, You are permanently situated in the spiritual skies of Vaikuntha and Goloka, which the
material mind has no capacity for perceiving at all.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'bhakti-kṛpā-khargāghāte joḍa-bandha cheda tā''te
jaya mana prakṛtira pāra
tomāra sundara rūpa here'' taba aparūpa
joḍa-bastu koroye dhik-kāra', E'бгакті-кр̣па̄-кхарґа̄ґга̄те джод̣а-бандга чхеда та̄''те
джайа мана пракр̣тіра па̄ра
тома̄ра сундара рӯпа хере'' таба апарӯпа
джод̣а-басту коройе дгік-ка̄ра',
    E'', E'',
    E'By the causeless mercy of the sharp sword of pure devotional service, all
bondage to matter is severed, and the mind can then travel far beyond the dull
material energy. Then, upon beholding Your wonderfully
beautiful form, one has no other choice but to condemn all inferior things
which are simply made of matter.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'ananta bibhūti jāńra jini doyā pārābāra
sei prabhu jībera īśwara
e bhaktibinoda dīna sadā śuddha-bhakti-hīna
śuddha-bhakti
māge nirantara', E'ананта бібгӯті джа̄ńра джіні дойа̄ па̄ра̄ба̄ра
сеі прабгу джı̄бера ı̄ш́вара
е бгактібінода дı̄на сада̄ ш́уддга-бгакті-хı̄на
ш́уддга-бгакті
ма̄ґе нірантара',
    E'', E'',
    E'Thus, by devotion one is enabled to see the Supreme Lord Who is the Master of
all souls, Who possesses unlimited transcendental opulences, and Who is an ocean of compassion. This most
fallen Bhaktivinoda, who is always bereft of pure
devotional service, now begs ceaselessly for this type of staunch, unalloyed
devotion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 8: Dharma Nistha Nahi Mor
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Dharma Nistha Nahi Mor', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 8;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
dharma-niṣṭhā nāhi mora ātma-bodha
bā sundora
bhakti nāhi
tomāra caraṇe
ata eba akiñcana
gati-hīna duṣṭa-jana
rata sadā āpana bañcane', E'харі хе
дгарма-нішт̣ха̄ на̄хі мора а̄тма-бодга
ба̄ сундора
бгакті на̄хі
тома̄ра чаран̣е
ата еба акін̃чана
ґаті-хı̄на душт̣а-джана
рата сада̄ а̄пана бан̃чане',
    E'', E'',
    E'Oh my Lord Hari! I don''t have the determination to follow any kind of
religious path, nor do I have any realization of my real self, nor do I have
any trace of lovely devotion to Your lotus feet.
Therefore, being completely bereft of spiritual practices, this wicked, aimless
soul is always fond of cheating himself.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'patita-pābana tumi patita adhama āmi
tumi mora eka-mātra gati
taba pada-mūle
painu tomāra śaraṇa lainu
ā;mi dāsa
tumi mora pati', E'патіта-па̄бана тумі патіта адгама а̄мі
тумі мора ека-ма̄тра ґаті
таба пада-мӯле
паіну тома̄ра ш́аран̣а лаіну
а̄;мі да̄са
тумі мора паті',
    E'', E'',
    E'Dear Lord, You are known
as patita-pavana, the rescuer of the most fallen, and
I am one such fallen soul. Therefore You are my only
hope for deliverance. Now I have achieved the soles of Your
lotus feet, for I have taken complete refuge in You alone; I am Your eternal
servant, and You are my eternal Master.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'e bhaktibinoda kānde hṛde dhairja nāhi bāndhe
bhūmi poḍi bole ataḥ-para
ahaitukī kṛpā kori'' ei duṣṭa-jane hori
deho pada-chāyā
nirantara', E'е бгактібінода ка̄нде хр̣де дгаірджа на̄хі ба̄ндге
бгӯмі под̣і боле атах̣-пара
ахаітукı̄ кр̣па̄ корі'' еі душт̣а-джане хорі
дехо пада-чха̄йа̄
нірантара',
    E'', E'',
    E'Now Bhaktivinoda
falls upon the ground, weeping piteously, unable to maintain composure in his
heart, and says, Oh my Lord! Kindly favor this rogue with Your
causeless mercy, and give me the shade of Your lotus feet forever and ever.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 9: Heno Dusta Karma Nai
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 9, E'Heno Dusta Karma Nai', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 9;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
heno duṣṭa
karma nāi
jaha āmi kori nāi
sahasra sahasra-bāra
hori
sei saba-karma-phala peye abasara bala
āmāya piśiche
jantropori', E'харі хе
хено душт̣а
карма на̄і
джаха а̄мі корі на̄і
сахасра сахасра-ба̄ра
хорі
сеі саба-карма-пхала пейе абасара бала
а̄ма̄йа піш́ічхе
джантропорі',
    E'', E'',
    E'Oh my dear Lord Hari! There are not sinful activities which I have not
performed thousands upon thousands of times! And by the fruits of all these
sinful actions, I have become robbed of all strength, being helplessly taken
for an excruciatingly painful ride on the machine of this material world.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'gati nāhi
dekhi āra kānde hari anibāra
tomāra agrete ebe āmi
ja'' tomāra
hoya mane
daṇḍa deo
akiñcane
tumi mora daṇḍa-dhara swāmī', E'ґаті на̄хі
декхі а̄ра ка̄нде харі аніба̄ра
тома̄ра аґрете ебе а̄мі
джа'' тома̄ра
хойа мане
дан̣д̣а део
акін̃чане
тумі мора дан̣д̣а-дгара сва̄мı̄',
    E'', E'',
    E'Seeing no other hope for
deliverance in sight, I am now continuously crying before You,
my Lord. Please punish Your insignificant servant as
You see befitting, for You are my Lord and ruling Master.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'kleśa-bhoga bhāgye
jata bhoga mora hao
tata
kintu eka mama
nibedana
je je daśā bhoga āmi āmāke nā chāḍo swāmī
bhaktibinodera prāṇa-dhana', E'клеш́а-бгоґа бга̄ґйе
джата бгоґа мора хао
тата
кінту ека мама
нібедана
дже дже даш́а̄ бгоґа а̄мі а̄ма̄ке на̄ чха̄д̣о сва̄мı̄
бгактібінодера пра̄н̣а-дгана',
    E'', E'',
    E'Whatever difficulty my
destiny prescribes for me, I will gladly undergo, but I have just one appeal to
make to You. My dear Lord, no matter what condition I
must undergo, please never give me up, for You are the only treasure of Bhaktivinoda''s life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 10: Nija Karma Dose Phale
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 10, E'Nija Karma Dose Phale', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 10;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
nija-karma-doṣa-phale poḍi''
bhabārṇaba-jale
hābuḍubu
khāi kota kāla
sāntāri''
sāntāri'' jāi sindhu-anta nāhi pāi
bhaba-sindhu ananta biśāla', E'харі хе
ніджа-карма-доша-пхале под̣і''
бгаба̄рн̣аба-джале
ха̄буд̣убу
кха̄і кота ка̄ла
са̄нта̄рі''
са̄нта̄рі'' джа̄і сіндгу-анта на̄хі па̄і
бгаба-сіндгу ананта біш́а̄ла',
    E'', E'',
    E'Oh my dear Lord Hari! By the bad fruits of my past
evil activities, I have slipped and fallen into the waters of the ocean of
nescience, and I have been thus bobbing and sinking beneath the waves for a
very, very long time. Swimming, I have not been able to reach the shore of this
ocean of material existence, for it extends for an unlimitedly vast distance.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'nimagna hoinu jabe ḍākinu
kātara rabe
keho more koroho uddhāra
sei kāle āile tumi tomā jāni'' kūla-bhūmi
āśā-bīja hoilo āmāra', E'німаґна хоіну джабе д̣а̄кіну
ка̄тара рабе
кехо море корохо уддга̄ра
сеі ка̄ле а̄іле тумі тома̄ джа̄ні'' кӯла-бгӯмі
а̄ш́а̄-бı̄джа хоіло а̄ма̄ра',
    E'', E'',
    E'Becoming completely submerged and drowned in this ocean, I have loudly called
out with a greatly distressed voice for someone to come and rescue me. At that
time You came to me, oh Lord. Knowing that You are the safe shelter at the shore of this fearful ocean
has gien me a ray of hope.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'tumi hari doyāmoya pāile more su-niścoya
sarbottama doyāra biṣoya
tomāke nā chāḍi'' āra e bhaktibinoda chāra
doyā-pātre
pāile doyāmoya', E'тумі харі дойа̄мойа па̄іле море су-ніш́чойа
сарботтама дойа̄ра бішойа
тома̄ке на̄ чха̄д̣і'' а̄ра е бгактібінода чха̄ра
дойа̄-па̄тре
па̄іле дойа̄мойа',
    E'', E'',
    E'You, dear Lord, are actually made of compassion. I am completely convinced that
You are the original source of the highest form of
causeless mercy. Now this most fallen rascal Bhaktivinoda
won''t reject You any more... for I, the befitting
object of causeless mercy, have attained the favor of He Who abounds in
causeless mercy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 11: Anya Asana Nahi Jar
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 11, E'Anya Asana Nahi Jar', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 11;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
anya
āśā nāhi jāra taba pada-padma tāra
chāḍibāra jogya nāhi
hoya
taba padāśroye nātha kore sei dina-pāta
taba pade tāhāra abhoya', E'харі хе
анйа
а̄ш́а̄ на̄хі джа̄ра таба пада-падма та̄ра
чха̄д̣іба̄ра джоґйа на̄хі
хойа
таба пада̄ш́ройе на̄тха коре сеі діна-па̄та
таба паде та̄ха̄ра абгойа',
    E'', E'',
    E'Oh my dear Lord Hari! He who spends his time under the shelter of Your lotus feet, oh Lord, becomes completely fearless.
Indeed, he has no ability to neglect Your lotus feet
for he hasn''t a pinch of desire to remain under any other shelter.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'stanya-pāyī-śiśu-jane mātā chāḍe krodha-mane
śiśu tabu nāhi
chāḍe māya
je hetu tāhāra ārae jībana
dhoribāra
mātā binā nāhika upāya', E'станйа-па̄йı̄-ш́іш́у-джане ма̄та̄ чха̄д̣е кродга-мане
ш́іш́у табу на̄хі
чха̄д̣е ма̄йа
дже хету та̄ха̄ра а̄рае джı̄бана
дгоріба̄ра
ма̄та̄ біна̄ на̄хіка упа̄йа',
    E'', E'',
    E'A mother sometimes
neglects her breast-suckling children out of anger but still the children could
never give up their mother. This is because such small helpless children are
not able to maintain their lives at all without their mother, being totally
dependent on her.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'e bhaktibinoda koya tumi chāḍo doyāmoya
dekhiyā āmāra doṣa-gaṇa
ā;mi to'' chāḍite nāri tomā binā nāhi pāri
kakhana dhorite e jībana', E'е бгактібінода койа тумі чха̄д̣о дойа̄мойа
декхійа̄ а̄ма̄ра доша-ґан̣а
а̄;мі то'' чха̄д̣іте на̄рі тома̄ біна̄ на̄хі па̄рі
какхана дгоріте е джı̄бана',
    E'', E'',
    E'Similarly, Bhaktivinoda says to You, oh Lord
Who is overflowing with compassion, that You may reject me if You like, seeing
all of my offenses. But still, I will never be able to abandon You, for I cannot maintain my life under any circumstances
without You.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 12: Tava Pada Pankajini
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 12, E'Tava Pada Pankajini', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 12;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
taba pada-pańkajinī jībāmṛta-sañcāriṇī
ati-bhāgye jība tāhā pāya
se amṛta pāna kori'' mugdha hoya tāhā hori
āra tāhā chāḍite
nā cāya', E'харі хе
таба пада-паńкаджінı̄ джı̄ба̄мр̣та-сан̃ча̄рін̣ı̄
аті-бга̄ґйе джı̄ба та̄ха̄ па̄йа
се амр̣та па̄на корі'' муґдга хойа та̄ха̄ хорі
а̄ра та̄ха̄ чха̄д̣іте
на̄ ча̄йа',
    E'', E'',
    E'Oh my Lord Hari! Your lotus feet distribute the
nectar of eternal devotional service to the surrender souls, and only by dint
of the greatest good fortune can any soul drink such nectar. By drinking this
rare ambrosia they become attracted and captivated, and by being completely
absorbed in this transcendental honey of devotion, they will never want to
abandon drinking it.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'nibiṣṭa
hoiyā tāya anya sthāne nāhi jāya
anya rasa tuccha kori''
mane
madhu-pūrṇa-padma-sthita madhubrata kadācita
nāhi cāya ikhu-daṇḍa-pāne', E'нібішт̣а
хоійа̄ та̄йа анйа стха̄не на̄хі джа̄йа
анйа раса туччха корі''
мане
мадгу-пӯрн̣а-падма-стхіта мадгубрата када̄чіта
на̄хі ча̄йа ікху-дан̣д̣а-па̄не',
    E'', E'',
    E'Being deeply engrossed in this jivamrta, they will
never ever go anywhere else, for they will then consider all other tastes to be
simply insignificant and verily nauseating. It is just like when a bee is fully
satisfied, tasting the sweet honey within the whorl of a lotus flower, then he
won''t even consider the inferior sweetness of sugarcane juice.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'e bhaktibinoda kabe se pańkaja-sthita ha''be
nāhi ja''be soḿsārābhimukhe
bhakta-kṛpā bhakti-bala ei duiṭī su-sambala
pāile se sthiti ghaṭe sukhe', E'е бгактібінода кабе се паńкаджа-стхіта ха''бе
на̄хі джа''бе соḿса̄ра̄бгімукхе
бгакта-кр̣па̄ бгакті-бала еі дуіт̣ı̄ су-самбала
па̄іле се стхіті ґгат̣е сукхе',
    E'', E'',
    E'Bhaktivinoda now says that when I become situated at
those lotus-like feet, then I will never again go towards the material world.
And I will happily attain a place at those lotus feet only due to two most
auspicious things... the causeless mercy of the devotee and the power of
devotion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 13: Bhramita Samsara Bane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 13, E'Bhramita Samsara Bane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 13;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
bhramite soḿsāra-bane
kabhu daiba-samghaṭane
kona-mate kona bhāgyabān
taba pada uddeśiyā thāke kṛtāñjali hoya
eka-bāra ohe bhagabān', E'харі хе
бграміте соḿса̄ра-бане
кабгу даіба-самґгат̣ане
кона-мате кона бга̄ґйаба̄н
таба пада уддеш́ійа̄ тха̄ке кр̣та̄н̃джалі хойа
ека-ба̄ра охе бгаґаба̄н',
    E'', E'',
    E'Oh my Lord Hari! While wandering about in the forest of this material
world, some fortunate soul may be able to get a momentary glimpse of Your lotus feet just once, by some unseen influence of
destiny, and he receives that visions of Your lotus feet with folded hands.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'sei khaṇe tā''ra jata amańgala hoya hata
su-mańgala hoya puṣṭa ati
ā;ra nāhi khaya hoya krame tā''ra śubhodoya
tā''re deya sarbottama-gati', E'сеі кхан̣е та̄''ра джата амаńґала хойа хата
су-маńґала хойа пушт̣а аті
а̄;ра на̄хі кхайа хойа краме та̄''ра ш́убгодойа
та̄''ре дейа сарботтама-ґаті',
    E'', E'',
    E'At that very moment all
inauspiciousness becomes dissipated, and he very much relishes the nourishment
of divine auspiciousness. This never decreases, for You
gradually awaken his eternal well-being by bestowing upon such a fortunate soul
the topmost goal of life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'emona doyālu tumi emona durbhāgā āmi
kabhu nā korinu paraṇāma
taba pada-padma prati nā jāne e duṣṭa-mati
bhaktibinodera pariṇāma', E'емона дойа̄лу тумі емона дурбга̄ґа̄ а̄мі
кабгу на̄ коріну паран̣а̄ма
таба пада-падма праті на̄ джа̄не е душт̣а-маті
бгактібінодера парін̣а̄ма',
    E'', E'',
    E'Thus You
are such a liberal and magnanimous Lord, but I have never offered my respectful
obeisances unto Your lotus feet. Therefore my wicked
mentality cannot comprehend anything. This is Bhaktivinoda''s
resultant unfortunate position.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 14: Tomar Carana Padma
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 14, E'Tomar Carana Padma', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 14;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
tomāra caraṇa-padma
anurāga sudhā-sadma
sāgara-śīkara jadi pāya
kona bhāgyabāna jane kona kārya-sańgaṭane
tā''ra saba duḥkha dūre jāya', E'харі хе
тома̄ра чаран̣а-падма
анура̄ґа судга̄-садма
са̄ґара-ш́ı̄кара джаді па̄йа
кона бга̄ґйаба̄на джане кона ка̄рйа-саńґат̣ане
та̄''ра саба дух̣кха дӯре джа̄йа',
    E'', E'',
    E'Oh my Dear Lord Hari! If a greatly fortunate soul, somehow or other, gets a
chance to drink just one nectar-drop sprayed from the rich ocean of love
emanating from Your lotus feet, then all of his miseries are automatically and
instantly repelled to a far distant place.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'se sudhā-samudra-kaṇa soḿsārāgni-nirbāpana
khaṇete koriyā phele tā''ra
parama nibṛtti diyā tomāra caraṇe loya
deya tabe ānanda apāra', E'се судга̄-самудра-кан̣а соḿса̄ра̄ґні-нірба̄пана
кхан̣ете корійа̄ пхеле та̄''ра
парама нібр̣тті дійа̄ тома̄ра чаран̣е лойа
дейа табе а̄нанда апа̄ра',
    E'', E'',
    E'This single drop from
the ocean of nectar completely extinguishes the blazing fire of material
existence and gives immediate relief. One who drinks such a drop thus takes
hold of Your lotus feet, which bestow upon him
transcendentally liberated peace and unlimited spiritual bliss.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'e bhaktibinoda kānde poḍiyā soḿsāra-phānde
bole nāhi kona bhāgya mora
e ghaṭana nā ghaṭilo āmāra
janama gelo
bṛthā roinu ho''ye ātma-bhora', E'е бгактібінода ка̄нде под̣ійа̄ соḿса̄ра-пха̄нде
боле на̄хі кона бга̄ґйа мора
е ґгат̣ана на̄ ґгат̣іло а̄ма̄ра
джанама ґело
бр̣тха̄ роіну хо''йе а̄тма-бгора',
    E'', E'',
    E'Now Bhaktivinoda
is weeping and says to You, Oh Lord... I am most unfortunate, falling into the
snare of this material world. I have never taken a drop of the nectar of Your lotus feet, and therefore my entire life has been
wasted, uselessly engrossed in the affairs of this material body.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 15: Tab Hanghri Kamala
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 15, E'Tab Hanghri Kamala', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 15;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
tabāńghri-kamala-dwoya bilāsa-bikrama-moya
parābara jagata byāpiyā
sarba-khaṇa
bartamāna
bhakta-kleśa-abasāna
lagi'' sadā prastuta hoiyā', E'харі хе
таба̄ńґгрі-камала-двойа біла̄са-бікрама-мойа
пара̄бара джаґата бйа̄пійа̄
сарба-кхан̣а
бартама̄на
бгакта-клеш́а-абаса̄на
лаґі'' сада̄ прастута хоійа̄',
    E'', E'',
    E'Oh my Lord Hari! Your twin lotus feet are full of
mighty prowess in performing transcendental pastimes, which are constantly
expanding daily throughout both the material and spiritual worlds. Such
pastimes are eternally being performed just to mitigate all the sufferings of Your devotees. For this reason only are Your
eightfold pastimes enacted.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'jagatera sei dhana āmi jaga-madhya-jana
ata eba sama adhikāra
āmi kibā bhāgya-hīna sādhane
bañcita dīna
ki kāja jībane āra chāra', E'джаґатера сеі дгана а̄мі джаґа-мадгйа-джана
ата еба сама адгіка̄ра
а̄мі кіба̄ бга̄ґйа-хı̄на са̄дгане
бан̃чіта дı̄на
кі ка̄джа джı̄бане а̄ра чха̄ра',
    E'', E'',
    E'Despite the presence of Your pastimes here, which are
the real treasure of this universe, I am still bereft of all good fortune, for
I have cheated myself out of worshiping Your lotus feet in devotional service.
Thus I am most fallen, and there is no one else quite as fallen as me. What
other activities could possibly be more sinful than those which were performed
by me throughout my entire lifetime?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'kṛpā binā nāhi gati e bhaktibinoda ati
dainya kori'' bole prabhu pāya
kabe taba kṛpā pe''ye uṭhibo sabale dhe''ye
heribo se pada-juga hāya', E'кр̣па̄ біна̄ на̄хі ґаті е бгактібінода аті
даінйа корі'' боле прабгу па̄йа
кабе таба кр̣па̄ пе''йе ут̣хібо сабале дге''йе
херібо се пада-джуґа ха̄йа',
    E'', E'',
    E'Now Bhaktivinoda, with the utmost humility says to You, oh Lord... without Your causeless mercy, I have no
other refuge. Alas! When will I get Your kind favor? I
will stand up and forcefully run for You, and then I
will behold Your beautiful lotus feet with my very eyes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 16: Ami Sei Dusta Mati
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 16, E'Ami Sei Dusta Mati', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 16;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'(hari
he)
āmi sei duṣṭa-mati nā dekhiyā anya-gati
taba pade lo''yechi śaraṇa
jānilama āmi nātha tumi prabhu jagannātha
āmi taba nitya parijana', E'(харі
хе)
а̄мі сеі душт̣а-маті на̄ декхійа̄ анйа-ґаті
таба паде ло''йечхі ш́аран̣а
джа̄нілама а̄мі на̄тха тумі прабгу джаґанна̄тха
а̄мі таба нітйа паріджана',
    E'', E'',
    E'Oh my dear Lord Hari! I am most fallen, and seeing no other alternative, I
have taken full shelter at Your lotus feet. Oh Lord! Now I have finally
understood that You are known as Jagannatha, Lord of
the Universe, whereas I am but Your eternal servant.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'sei dina kabe ha''be
aikantika-bhābe
jabe
nitya-dāsa-bhāba lo''ye āmi
manorathāntara jata nihśeṣa koriyā swataḥ
sebibo āmāra nitya-swāmī', E'сеі діна кабе ха''бе
аікантіка-бга̄бе
джабе
нітйа-да̄са-бга̄ба ло''йе а̄мі
маноратха̄нтара джата ніхш́еша корійа̄ сватах̣
себібо а̄ма̄ра нітйа-сва̄мı̄',
    E'', E'',
    E'When will that day come
when I will take on the mood and behavior of Your unalloyed eternal servant?
Then, all other distracting desires of my mind will automatically become
totally exhausted, and I will be able to whole-heartedly render service to my
eternal Master.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'nirantara sebā-mati bahibe cittete satī
praśānta hoibe ātmā mora
e bhaktibinoda bole kṛṣṇa-sebā-kutūhole
ciro-dina thāki jena bhora', E'нірантара себа̄-маті бахібе чіттете сатı̄
праш́а̄нта хоібе а̄тма̄ мора
е бгактібінода боле кр̣шн̣а-себа̄-кутӯхоле
чіро-діна тха̄кі джена бгора',
    E'', E'',
    E'My soul will become fully
satisfied when that day will be mine. My heart will be chaste only to You, and
it will exhibit such a service attitude which flows from the core of the heart
with uninterrupted devotion. Bhaktivinoda says that
he will thus live eternally absorbed in such a delightful flow of ecstatic
loving service to Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 17: Ami Aparadhi Jana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 17, E'Ami Aparadhi Jana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 17;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
āmi aparādhī jana sadā daṇḍya durlakhaṇa
sahasra sahasra doṣe doṣī
bhīma-bhabārṇabodare patita biṣama ghore
gati-hīna gati-abhilāṣī', E'харі хе
а̄мі апара̄дгı̄ джана сада̄ дан̣д̣йа дурлакхан̣а
сахасра сахасра доше дошı̄
бгı̄ма-бгаба̄рн̣абодаре патіта бішама ґгоре
ґаті-хı̄на ґаті-абгіла̄шı̄',
    E'', E'',
    E'Oh my Lord Hari! I have been a great offender to You, and thus I am
just quite fit to receive punishment for all of my misdeeds. I am sinister and
ill-fated, and I am guilty of committing thousands upon thousands of sins. I
have somehow fallen into the very belly of the terribly deep, dark, fearsome
and horrible ocean of material existence, and I have no shelter at all in this
hellish place. Therefore I am greatly desirous of finding some way to get
salvation from this dreadful predicament.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'hari taba pada-dwoye śaraṇe loinu bhoye
kṛpā kori'' koro ātma-sāṭha
tomāra pratijñā ei śaraṇa loibe jei
tumi tā''ra rakhā-kartā nātha', E'харі таба пада-двойе ш́аран̣е лоіну бгойе
кр̣па̄ корі'' коро а̄тма-са̄т̣ха
тома̄ра пратіджн̃а̄ еі ш́аран̣а лоібе джеі
тумі та̄''ра ракха̄-карта̄ на̄тха',
    E'', E'',
    E'Hari!
Thus I have taken refuge at Your two lotus feet out of intense fear, Please be
kind to me and make me Your own property. Your promise is that for whoever
takes full shelter of You, then You will become his protector and maintainer,
Oh Lord.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'pratijñāte kori'' bhara o madhaba
prāṇeśwara
śaraṇa loilo ei dāsa
e bhaktibinoda gāya tomāra se rāńgā-pāya
deho dāse sebāya bilāsa', E'пратіджн̃а̄те корі'' бгара о мадгаба
пра̄н̣еш́вара
ш́аран̣а лоіло еі да̄са
е бгактібінода ґа̄йа тома̄ра се ра̄ńґа̄-па̄йа
дехо да̄се себа̄йа біла̄са',
    E'', E'',
    E'Completely relaying on
Your promise, this servant has now taken full shelter of You as his last hope,
oh Madhava! Oh Lord of my life! Bhaktivinoda
sings this prayer to You now just to be eternally fixed up in the service of
Your two reddish lotus feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 18: Aviveka Rupa Ghana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 18, E'Aviveka Rupa Ghana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 18;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
abibeka
rūpa ghana tāhe dhik ācchādana
hoilo ta''te andhakāra ghora
tāhe duḥkha-bṛṣṭi hoya dekhi'' cāri-dike bhoya
patha-bhrama hoiyāche mora', E'харі хе
абібека
рӯпа ґгана та̄хе дгік а̄ччха̄дана
хоіло та''те андгака̄ра ґгора
та̄хе дух̣кха-бр̣шт̣і хойа декхі'' ча̄рі-діке бгойа
патха-бграма хоійа̄чхе мора',
    E'', E'',
    E'Oh my Lord Hari! Ignorance of You is just like a menacing raincloud which hovers overhead and covers all directions,
causing the darkness of spiritual blindness to envelop me. From this cloud of
ignorance falls the rains of material tribulations
which strikes fear throughout the four directions. Thus I have become lost and
confused in this darkness, and I am absolutely unable to find the right path
back to You, dear Lord', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'nija abibeka doṣe poḍi'' durdinera roṣe
prāṇa
jāya soḿsāra-kāntāre
patha-pradarśaka
nāi e durdaibe
mārā jāi
ḍāki tāi
acyuta tomāre', E'ніджа абібека доше под̣і'' дурдінера роше
пра̄н̣а
джа̄йа соḿса̄ра-ка̄нта̄ре
патха-прадарш́ака
на̄і е дурдаібе
ма̄ра̄ джа̄і
д̣а̄кі та̄і
ачйута тома̄ре',
    E'', E'',
    E'By my own fault of
whimsical behavior, independent of You, I have become very angry at my fate of
falling into the foul weather of this most difficult time of distress. And my
life is leaving me while I am thus stranded within this material world, which
is just like a dark forest in which one cannot properly find his way. I have no
guide to show me the way out of here, and by this misfortune I am dying a slow
death. Therefore I now call out to You, Acyuta, oh
supremely infallible Lord!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'eka-bāra
kṛpā-dṛṣṭi koro āmā prati bṛṣṭi
tabe mora ghucibe durdina
bibeka sabala ha''be bhaktibinoda tabe
dekhaibe patha samīcīna', E'ека-ба̄ра
кр̣па̄-др̣шт̣і коро а̄ма̄ праті бр̣шт̣і
табе мора ґгучібе дурдіна
бібека сабала ха''бе бгактібінода табе
декхаібе патха самı̄чı̄на',
    E'', E'',
    E'If You
would just shower the rain of Your kind glance moist with causeless mercy in my
direction just once, oh Lord, then that glance would instantly terminate this
period of great distress for me. Then my understanding of Your
spiritual reality will become fixed-up, and then this Bhaktivinoda
will be able to properly see the path which leads back to You.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 19: Agre Ek Nivedana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 19, E'Agre Ek Nivedana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 19;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'হরি হে
অগ্রে এক
নিবেদন করি মধুনিসূদন
শুন কৃপা করিয়া আমায়
নিরর্থক কথা নয় নিগূঢার্থ-ময়
হয়
হৃদয়া হৈতে বহিরায়', E'হরি হে
অগ্রে এক
নিবেদন করি মধুনিসূদন
শুন কৃপা করিয়া আমায়
নিরর্থক কথা নয় নিগূঢার্থ-ময়
হয়
হৃদয়া হৈতে বহিরায়',
    E'hari
he
agre
eka nibedana kori madhunisūdana
śuno
kṛpā koriyā āmāya
nirarthaka
kathā noya nigūḍhārtha-moya hoya
hṛdoyā
hoite bahirāya', E'харі
хе
аґре
ека нібедана корі мадгунісӯдана
ш́уно
кр̣па̄ корійа̄ а̄ма̄йа
нірартхака
катха̄ нойа ніґӯд̣ха̄ртха-мойа хойа
хр̣дойа̄
хоіте бахіра̄йа',
    E'', E'',
    E'Oh
my dear Lord Hari! I have just one appeal to make before You, oh killer of the
Madhu demon! Please be kind enough to hear it from me. It is certainly not a
useless talk for wasting time, for it is full of very deep meaning. Indeed, it
is welling up from the very depths of my heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'অতি অপ্রকৃষ্ট আমি পরম দয়ালু তুমি
তব দয়া মোর অধিকার
যে যত
পতিত হয়
তব দয়া তত তায়
ত''তে
আমি সু-পাত্র দয়ার', E'অতি অপ্রকৃষ্ট আমি পরম দয়ালু তুমি
তব দয়া মোর অধিকার
যে যত
পতিত হয়
তব দয়া তত তায়
ত''তে
আমি সু-পাত্র দয়ার',
    E'ati
aprakṛṣṭa āmi
parama doyālu tumi
taba
doyā mora adhikāra
je
jata patita hoya taba doyā tata tāya
ta''te
āmi su-pātra doyāra', E'аті
апракр̣шт̣а а̄мі
парама дойа̄лу тумі
таба
дойа̄ мора адгіка̄ра
дже
джата патіта хойа таба дойа̄ тата та̄йа
та''те
а̄мі су-па̄тра дойа̄ра',
    E'', E'',
    E'I
am most degraded, and You are most merciful; therefore I have full rights to
stake a claim for Your mercy. For no matter how fallen I could possibly be,
Your mercy easily extends to that degree; therefore I am quite a suitable
candidate for receiving Your causeless mercy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'মোরে যদি উপেখিবে দয়া-পাত্রে কোথা পাবে
দয়াময় নামটি ঘুচা''বে
এ ভক্তিবিনোদ কয়
দয়া কর
দয়াময়
যশ-কীর্তি চির-দিন পা''বে', E'মোরে যদি উপেখিবে দয়া-পাত্রে কোথা পাবে
দয়াময় নামটি ঘুচা''বে
এ ভক্তিবিনোদ কয়
দয়া কর
দয়াময়
যশ-কীর্তি চির-দিন পা''বে',
    E'more
jodi upekhibe doyā-pātre
kothā pābe
doyāmoya
nāmaṭi ghucā''be
e
bhaktibinoda koya doyā koro doyāmoya
jaśa-kīrti
ciro-dina pā''be', E'море
джоді упекхібе дойа̄-па̄тре
котха̄ па̄бе
дойа̄мойа
на̄мат̣і ґгуча̄''бе
е
бгактібінода койа дойа̄ коро дойа̄мойа
джаш́а-кı̄рті
чіро-діна па̄''бе',
    E'', E'',
    E'If
You were to neglect my appeal, then Your famous name as "the Most
Merciful" would become null and void. And then where else could this
recipient go to find the same kind of mercy? Bhaktivinoda says, please be
merciful, oh Most Merciful! If You would do this, then Your fame and glories
will go on unblemished for all of time to come.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 20: Toma Chadi Ami Kabhu
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 20, E'Toma Chadi Ami Kabhu', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 20;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
tomā chāḍi'' āmi kabhu anātha nā hoi prabhu
prabhu-hīna dāsa nirāśroya
āmāke nā nile sātha kaiche tumi ha''be nātha
domanīya ke tomāra hoya', E'харі хе
тома̄ чха̄д̣і'' а̄мі кабгу ана̄тха на̄ хоі прабгу
прабгу-хı̄на да̄са ніра̄ш́ройа
а̄ма̄ке на̄ ніле са̄тха каічхе тумі ха''бе на̄тха
доманı̄йа ке тома̄ра хойа',
    E'', E'',
    E'My dear Hari! I will never, ever abandon Your
shelter, oh Lord, for if I were to do that, I would become utterly helpless without
my Master. When a faithful servant becomes bereft of his Master, then he
remains helplessly lost and confused, with no shelter from any quarter.
However, if You do not accept me into Your
association, then how will You be known as my Master, and who else besides me
will be a suitable recipient of Your mercy?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'āmādera
e sambandha
bidhi-kṛta su-nirbandha
sa-bidhi tomāra guṇa-dhāma
ata eba nibedana śuno he
madhu-mathana
chāḍā-chāḍi nāhe kona kāma', E'а̄ма̄дера
е самбандга
бідгі-кр̣та су-нірбандга
са-бідгі тома̄ра ґун̣а-дга̄ма
ата еба нібедана ш́уно хе
мадгу-матхана
чха̄д̣а̄-чха̄д̣і на̄хе кона ка̄ма',
    E'', E'',
    E'This is our eternal
relationship which is unavoidably fixed up by our destiny, and which reflects Your abode of good qualities. Please hear my appeal to You now, oh Lord Who bestows nectar upon those that You
punish! For there is no possibility whatsoever of separating
us from our eternal relationship of being the Master (You) and the servant
(me).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'e bhaktibinoda gāya rākho more taba pāya
pālo more nā chāḍo kakhana
jabe mama pāo doṣa koriyā ucita roṣa
daṇḍa
diyā deo śrī-caraṇa', E'е бгактібінода ґа̄йа ра̄кхо море таба па̄йа
па̄ло море на̄ чха̄д̣о какхана
джабе мама па̄о доша корійа̄ учіта роша
дан̣д̣а
дійа̄ део ш́рı̄-чаран̣а',
    E'', E'',
    E'Now Bhaktivinoda
sings to You his appeal, dear Lord: Please keep me
always under the shelter of Your lotus feet, always protect me, and never
abandon me at any time. Whenever You find me deviating
slightly from the shelter of Your feet, then I request You to please manifest
suitable anger and punish me in a befitting way by mercifully kicking some
sense into me with those same divine lotus feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 21: Stri Purusa Deha Geha
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 21, E'Stri Purusa Deha Geha', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 21;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
strī-puruṣa-deha-gata barṇa-ādi dharma jata
tāhe punaḥ deha-gata bheda
sattwa-rajas-tamo-guṇa āśroyeche bheda punaḥ
ei-rūpa sahasra prabheda', E'харі хе
стрı̄-пуруша-деха-ґата барн̣а-а̄ді дгарма джата
та̄хе пунах̣ деха-ґата бгеда
саттва-раджас-тамо-ґун̣а а̄ш́ройечхе бгеда пунах̣
еі-рӯпа сахасра прабгеда',
    E'', E'',
    E'Oh my Lord! I know that all bodily distinctions between female and male, as
well as the divisions of the varnasrama system namely
brahmana, ksatriya, vaisya, sudra, brahmacari, grhastha, vanaprastha and sannyasa are all
simply materialistic distinctions based on bodily consciousness. All these fall
under the jurisdiction of the modes of goodness, passion and ignorance, and
thus all these bodily discriminations multiply into thousands of different
complicated classifications.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'jekhona śarīra thāki jekhona abasthā rākhi
se saba ekhona
taba pāya
saḿpilāma prāṇeśwara mama boli'' ataḥ para
āra kichu nā rohilo
dāya', E'джекхона ш́арı̄ра тха̄кі джекхона абастха̄ ра̄кхі
се саба екхона
таба па̄йа
саḿпіла̄ма пра̄н̣еш́вара мама болі'' атах̣ пара
а̄ра кічху на̄ рохіло
да̄йа',
    E'', E'',
    E'Whatever type of body I happen to live in, and whatever circumstantial position
surrounds this particular body, I now offer all these things unto Your lotus
feet, oh Lord of my life! From now on, I am no longer responsible for anything
related to my very existence.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'tumi prabhu rākho mora saba taba adhikāra
āchi āmi tomāra kińkora
e bhaktibinoda bole taba dāsya-kautūhole
thāki jena sadā-sebā-pora', E'тумі прабгу ра̄кхо мора саба таба адгіка̄ра
а̄чхі а̄мі тома̄ра кіńкора
е бгактібінода боле таба да̄сйа-каутӯхоле
тха̄кі джена сада̄-себа̄-пора',
    E'', E'',
    E'Therefore, please protect and maintain me, oh Lord, for I am but Your eternal
humble servant. Bhaktivinoda is just informing You
that I am living always absorbed in the curious amusement of the transcendental
loving service attitude.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 22: Veda Vidhi Anusare
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 22, E'Veda Vidhi Anusare', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 22;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
veda-vidhi-anusāre karma
kori'' e soḿsāre
punaḥ
punaḥ jība janma pāya
pūrba-kṛta-karma-phale
tomāra bā icchā-bale
janma jadi labhi
punarāya', E'харі хе
веда-відгі-ануса̄ре карма
корі'' е соḿса̄ре
пунах̣
пунах̣ джı̄ба джанма па̄йа
пӯрба-кр̣та-карма-пхале
тома̄ра ба̄ іччха̄-бале
джанма джаді лабгі
пунара̄йа',
    E'', E'',
    E'Oh my Lord Hari! By working fruitively
according to the Vedic injunctions in this material world, the soul
continuously takes birth again and again. If I also have to take birth once
again according to Your will, due to the results of my
previous fruitive reactions, then I have just one
request to make to You, oh Lord.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'tabe eka kathā
mama śuno he puruṣottama
taba dāsa-sańgi-jana-ghore
kīṭa-janma jadi hoya tāhāte-o
doyāmoya
rohibo he santuṣṭa antore', E'табе ека катха̄
мама ш́уно хе пурушоттама
таба да̄са-саńґі-джана-ґгоре
кı̄т̣а-джанма джаді хойа та̄ха̄те-о
дойа̄мойа
рохібо хе сантушт̣а анторе',
    E'', E'',
    E'So then kindly hear me, oh Purusottama! I have only
one petition to submit before You. If I can only take
my next birth even as an insignificant insect within the home of Your loving servant, then I would become completely
satisfied, oh Most Merciful Lord.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'taba dāsa-sańga-hīna je gṛhastha ārbacīna
tā''ra gṛhe caturmukha-bhūti
nā hao kakhana
hari kara-dwoya joḍa kori''
kore bhaktibinoda minati', E'таба да̄са-саńґа-хı̄на дже ґр̣хастха а̄рбачı̄на
та̄''ра ґр̣хе чатурмукха-бгӯті
на̄ хао какхана
харі кара-двойа джод̣а корі''
коре бгактібінода мінаті',
    E'', E'',
    E'Please never, never let me take birth in the home of a foolish householder who
is bereft of the association of Your eternal servant,
even if his household opulences rival those of Lord''s
Brahma''s. This is the only humble prayer that Bhaktivinoda
is making now with folded hands.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 23: Tomar Je Suddha Bhakta
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 23, E'Tomar Je Suddha Bhakta', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 23;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
tomāra je śuddha-bhakta tomāte
se anurakta
bhukti mukhti tuccha kori''
jāne
bāreka dekhite taba cid-ākāra-śrī-baibhaba
tṛṇa boli'' anya sukha
mane', E'харі хе
тома̄ра дже ш́уддга-бгакта тома̄те
се ануракта
бгукті мукхті туччха корі''
джа̄не
ба̄река декхіте таба чід-а̄ка̄ра-ш́рı̄-баібгаба
тр̣н̣а болі'' анйа сукха
мане',
    E'', E'',
    E'Oh my Lord Hari! Your pure unalloyed devotee, who is uncompromisingly
devoted and attached to You only, considers any type
or material enjoyment or liberation to be insignificant. Simply by beholding
the beauty and opulences of Your
form made of eternity, knowledge and bliss, such a pure devotee considers all
other forms of so-called happiness to be just like small pieces of straw which
one sees strewn here and there in the gutter.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'se saba bhaktera
sańge
līlā koro nānā-rańge
biraha sahite nāhi pāra
kṛpā kori'' akiñcane dekhāo mahātma-gaṇe
sādhu binā gati nāhi āra', E'се саба бгактера
саńґе
лı̄ла̄ коро на̄на̄-раńґе
біраха сахіте на̄хі па̄ра
кр̣па̄ корі'' акін̃чане декха̄о маха̄тма-ґан̣е
са̄дгу біна̄ ґаті на̄хі а̄ра',
    E'', E'',
    E'You always perform
different types of sportive pastimes in the company of pure devotees of this
caliber, for You are not able to tolerate separation
from them even for a moment. Please show Your gracious
favor to me and reveal to me who these great souls are, for I can find no
purpose for living without the shelter of their company.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'se bhakta-caraṇa-dhana kabe pā''bo daraśana
sodhibo āmāra duṣṭa
mana
e bhaktibinoda bhaṇe kṛpā ha''be jata-khaṇe
mahātmara ho''be daraśana', E'се бгакта-чаран̣а-дгана кабе па̄''бо дараш́ана
содгібо а̄ма̄ра душт̣а
мана
е бгактібінода бган̣е кр̣па̄ ха''бе джата-кхан̣е
маха̄тмара хо''бе дараш́ана',
    E'', E'',
    E'When will I get the
vision of the rare treasure-like feet of all these pure devotees? If I could
just catch a glimpse of their lotus feet, then that would completely purify me
and rectify my sinister mind. Bhaktivinoda narrates this
prayer to You, oh Lord: I will be able to get the
audience of such great souls only if Your causeless mercy comes upon me by Your
own sweet will.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 24: Suno He Madhu Mathana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 24, E'Suno He Madhu Mathana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 24;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
śuno he madhu-mathana
mama eka bijñāpana
biśeṣa
koriyā boli āmi
tomāra sebātwa mama
swakiyā baibhabottama
āmi dāsa tumi mora swāmī', E'харі хе
ш́уно хе мадгу-матхана
мама ека біджн̃а̄пана
біш́еша
корійа̄ болі а̄мі
тома̄ра себа̄тва мама
свакійа̄ баібгаботтама
а̄мі да̄са тумі мора сва̄мı̄',
    E'', E'',
    E'Oh my dear Lord Hari! Please hear me now, oh Lord Who gives honey to those who You trample upon!
I am revealing this specific confession unto You. The
topmost wealth of my own ultimate service attitude is this... I am Your servant, and You are my Master.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'se-baibhaba-bahirbhūta hoite hoile he acyuta
khaṇa-mātra sahite nā pāri
deho prāṇa sukha āśā
ātma prati bhalābāsa
sarba-tyāga korite bicāri', E'се-баібгаба-бахірбгӯта хоіте хоіле хе ачйута
кхан̣а-ма̄тра сахіте на̄ па̄рі
дехо пра̄н̣а сукха а̄ш́а̄
а̄тма праті бгала̄ба̄са
сарба-тйа̄ґа коріте біча̄рі',
    E'', E'',
    E'Oh Acyuta, infallible Lord! I am not able to tolerate
even a split second of life outside the purview of this divine wealth of Your eternal service. Therefore I have now decided to
renounce everything that is near and dear to the illusioned
soul such as the body, the life, material pleasures as well as all hopes for
future sense gratification.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'e saba jāuka
nāśa
śata-bāra śrīnibāsa
tabu thāku dāsatwa tomāra
e bhaktibinoda koya kṛṣṇa-dāsa jība
hoya
dāsya binā kiba āche āra', E'е саба джа̄ука
на̄ш́а
ш́ата-ба̄ра ш́рı̄ніба̄са
табу тха̄ку да̄сатва тома̄ра
е бгактібінода койа кр̣шн̣а-да̄са джı̄ба
хойа
да̄сйа біна̄ кіба а̄чхе а̄ра',
    E'', E'',
    E'Oh Residence of the Goddess of Fortune! Let all these things be neglected by me
and fall into abject ruination hundreds of times; I don''t mind, for I will
still remain immutably fixed in Your eternal service. Bhaktivinoda says that the soul is irrevocably the eternal
servant of Krsna and except for this eternal service there is no other reality.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 25: Ami Nara Pasu Pray
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 25, E'Ami Nara Pasu Pray', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 25;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'(hari
he)
āmi nara-paśu-prāya ācāra-bihīna
tāya
anādi ananta su-bistāra
ati-kaṣṭe parihārja
sahajete anibārja
aśubhera āspada ābāra', E'(харі
хе)
а̄мі нара-паш́у-пра̄йа а̄ча̄ра-біхı̄на
та̄йа
ана̄ді ананта су-біста̄ра
аті-кашт̣е паріха̄рджа
сахаджете аніба̄рджа
аш́убгера а̄спада а̄ба̄ра',
    E'', E'',
    E'Oh my Lord Hari! I am simply a two-legged animal, completely bereft of
proper behavior. I have been suffering great difficulties unlimitedly since
time immemorial. And moreover, I have unavoidably become the repository of all
types of sinful activities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'tumi to'' doyāra sindhu tumi to'' jagad-bandhu
asīma bātsalya-payonidhi
taba guṇa-gaṇa smari'' bhaba-bandha
cheda kori''
nirbhīka hoibo nirabadhi', E'тумі то'' дойа̄ра сіндгу тумі то'' джаґад-бандгу
асı̄ма ба̄тсалйа-пайонідгі
таба ґун̣а-ґан̣а смарі'' бгаба-бандга
чхеда корі''
нірбгı̄ка хоібо нірабадгі',
    E'', E'',
    E'You are certainly an
ocean of compassion, and You are the only real friend
of the universe. Your affection is just like a boundless, unfathomable sea of
loving relationships. Simply by remembering Your
wonderful qualities, my material bonds are being severed and I will become
eternally fearless.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'ei icchā kori'' mane śrī-jāmuna-caraṇe
gāya bhaktibinoda ekhana
jāmuna-bipina-bidhu śrī-caraṇābja-sīdhu
tā''ra śire koruṇa arpaṇa', E'еі іччха̄ корі'' мане ш́рı̄-джа̄муна-чаран̣е
ґа̄йа бгактібінода екхана
джа̄муна-біпіна-бідгу ш́рı̄-чаран̣а̄бджа-сı̄дгу
та̄''ра ш́іре корун̣а арпан̣а',
    E'', E'',
    E'Now Bhativinoda
sings about all these desires which he has within his mind while prostrated at
the lotus feet of Sri Yamunacarya. And he begs Sri Yamunacarya to kindly bestow upon his head the quintessence
of the fragrant immortal nectar which flows from the lotus feet of that
moon-like person Who glows within the forests on the
bank of the river Yamuna in Vraja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 26: Tumi Jagater Pita
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 26, E'Tumi Jagater Pita', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 26;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
tumi jagatera pitā tumi jagatera mātā
doyita tanoya hari tumi
tumi suhṛn mitra guru tumi gati kalpa-taru
twadīya-sambandha-mātra āmi', E'харі хе
тумі джаґатера піта̄ тумі джаґатера ма̄та̄
дойіта танойа харі тумі
тумі сухр̣н мітра ґуру тумі ґаті калпа-тару
твадı̄йа-самбандга-ма̄тра а̄мі',
    E'', E'',
    E'Oh my Lord Hari! You are the Father of the universe; You are the Mother of the universe, as well as the Lover and
son of all beings. You are the most dearly beloved friend of the heart, the
spiritual master of all, the ultimate refuge and the divine purpose-tree that
fulfills everyone''s desires...', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'taba bhṛtya parijana gati-prārthi
akiñcana
prapanna tomāra śrī-caraṇe
taba sattwa taba dhana tomāra pālita jana
āmāra mamatā taba jane', E'таба бгр̣тйа паріджана ґаті-пра̄ртхі
акін̃чана
прапанна тома̄ра ш́рı̄-чаран̣е
таба саттва таба дгана тома̄ра па̄літа джана
а̄ма̄ра мамата̄ таба джане',
    E'', E'',
    E'...But my relationship
with You is simply that of Your insignificant menial
servant, Your humble attendant, always praying for Your shelter, surrendered at
Your divine lotus feet. I am simply Your plaything,
Your property, Your protected servant; my only identification is my personal
attachment to being Your devotee.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'e bhaktibinoda koya ahantā-mamatā noya
śrī-kṛṣṇa-sambandha-abhimāne
sebāra sambandha dhori'' ahantā-mamatā
kori''
tad-itare prākṛta bidhāne', E'е бгактібінода койа аханта̄-мамата̄ нойа
ш́рı̄-кр̣шн̣а-самбандга-абгіма̄не
себа̄ра самбандга дгорі'' аханта̄-мамата̄
корі''
тад-ітаре пра̄кр̣та бідга̄не',
    E'', E'',
    E'Bhaktivinoda
says that there is no relationship of "I and mine" other than this
true conception of being related to Krsna as His
eternal servant. Maintaining this position of eternal service, he thus accepts
the real principle of "I and mine" which is the natural, unchangeable
relationship with Krsna and all His devotees.
Anything besides that would just be material and temporary.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 1, Song 27: Ami To Cancala Mati
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 1;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 27, E'Ami To Cancala Mati', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 27;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hari he
āmi to'' cañcala-mati amaryāda khudra ati
asūya-prasaba sadā mora
pāpiṣṭha kṛtaghna mānī nṛśaḿsa bañcane jñānī
kāma-baśe thāki sadā ghora', E'харі хе
а̄мі то'' чан̃чала-маті амарйа̄да кхудра аті
асӯйа-прасаба сада̄ мора
па̄пішт̣ха кр̣таґгна ма̄нı̄ нр̣ш́аḿса бан̃чане джн̃а̄нı̄
ка̄ма-баш́е тха̄кі сада̄ ґгора',
    E'', E'',
    E'Oh my dear Lord Hari! I am most fickle-minded, completely bereft of proper
etiquette and extremely insignificant. I always radiate an intense effulgence
of jealousy and malice. I willingly perform sinful acts, I love to do harm to
my well-wishing benefactors, and I am unnecessarily puffed up with false
prestige. Ferociously vicious like a barbarian, I am vastly learned in the art
of deceiving others. I am always obsessed under the control of lusty motives,
which are my very breath of life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'e heno durjana ho''ye
e duḥkha-jaladhi bo''ye
caritechi soḿsāra-sāgore
kemone e bhabāmbudhi pāra ho''ye nirabadhi
taba pada-sebā mile more', E'е хено дурджана хо''йе
е дух̣кха-джаладгі бо''йе
чарітечхі соḿса̄ра-са̄ґоре
кемоне е бгаба̄мбудгі па̄ра хо''йе нірабадгі
таба пада-себа̄ міле море',
    E'', E'',
    E'Being such a sinful
rogue, I am completely submerged in this ocean of material tribulation as I
aimlessly wander here and there in the vast ocean of birth and death. How will
I ever be able to cross over this deep ocean of nescience and enter into the
eternal service of Your divine lotus feet??', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'tomāra koruṇā pāi taba to'' toriyā jāi
amki e duranta-sāgora
tumi prabhu śrī-caraṇe rākho dāse dhūli-sane
nahe bhaktibinoda kātora', E'тома̄ра корун̣а̄ па̄і таба то'' торійа̄ джа̄і
амкі е дуранта-са̄ґора
тумі прабгу ш́рı̄-чаран̣е ра̄кхо да̄се дгӯлі-сане
нахе бгактібінода ка̄тора',
    E'', E'',
    E'Only if I get Your causeless mercy, then I can certainly cross over this
miserable ocean of suffering. Now, my dear Lord, Bhaktivinoda
is humbly requesting You to kindly keep this servant
as just one of the many particles of dust under the safe shelter of Your
beautiful lotus feet... then I''ll be fully satisfied.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 2, Song 1: Ami Ati Dina Mati
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 2;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Ami Ati Dina Mati', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'আমি অতি দিন-মতি ব্রজ-কুঞ্জে নিবসতি
রাধা-কৃষ্ণ-জুগল-চরণে
কাঁদিয়া কাঁদিয়া অজ ছাড়ি'' সব লোক লজ
নিবেদিব জত আছে মনে', E'আমি অতি দিন-মতি ব্রজ-কুঞ্জে নিবসতি
রাধা-কৃষ্ণ-জুগল-চরণে
কাঁদিয়া কাঁদিয়া অজ ছাড়ি'' সব লোক লজ
নিবেদিব জত আছে মনে',
    E'āmi
ati dina-mati braja-kuñje nibasati
rādhā-kṛṣṇa-jugala-caraṇe
kāńdiyā
kāńdiyā aja chāḍi'' saba loka laja
nibedibo
jata āche mane', E'а̄мі
аті діна-маті браджа-кун̃дже нібасаті
ра̄дга̄-кр̣шн̣а-джуґала-чаран̣е
ка̄ńдійа̄
ка̄ńдійа̄ аджа чха̄д̣і'' саба лока ладжа
нібедібо
джата а̄чхе мане',
    E'', E'',
    E'I am most distressed and miserable within the core of my heart. Therefore
today, living in my grove at Vraja-bhumi, I will submit to the lotus feet of
the divine couple,
Sri-Sri-Radha-Krsna.
Weeping and weeping today at Their lotus feet, I now give up all shyness and
fear of public opinion, and I will reveal to Them all the outpourings of the
inner core of my heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'তুমি কৃষ্ণ নীলমণি নব-মেঘ-প্রভা জিনি''
ব্রজানন্দ কর বিতরণ
তুমি রাধে নব-গৌরী গোরোচনা-গর্ব হরি''
ব্রজে হর কৃষ্ণচন্দ্র-মন', E'তুমি কৃষ্ণ নীলমণি নব-মেঘ-প্রভা জিনি''
ব্রজানন্দ কর বিতরণ
তুমি রাধে নব-গৌরী গোরোচনা-গর্ব হরি''
ব্রজে হর কৃষ্ণচন্দ্র-মন',
    E'tumi
kṛṣṇa nīlamaṇi naba-megha-prabhā jini''
brajānanda
koro bitaraṇa
tumi
rādhe naba-gaurī gorocanā-garba hori''
braje
horo kṛṣṇacandra-mana', E'тумі
кр̣шн̣а нı̄ламан̣і наба-меґга-прабга̄ джіні''
браджа̄нанда
коро бітаран̣а
тумі
ра̄дге наба-ґаурı̄ ґорочана̄-ґарба хорі''
брадже
хоро кр̣шн̣ачандра-мана',
    E'', E'',
    E'You are Lord Krsna, and Your deep translucent bluish hue like sapphires is
putting to shame the luster of a fresh new rain cloud. You are distributing the
blissful mood of
Vraja
to everyone. And You, Sri Radhe, are forcibly taking away the pride of
brilliant yellow gorocana dye with Your fair complexion, which is decorating
Your fresh blooming
youth.
Thus You are attracting and stealing the mind of Your moon-like Krsna in Vraja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'তুমি কৃষ্ণ পীতাম্বরে পরাজিয়া আর্তশ্বরে
ব্রজ-বনে নিত্য-কেলি-রত
তুমি রাধে নীলাম্বরী পলাশের গর্ব হরি''
কৃষ্ণ-কেলি-সহায় সতত', E'তুমি কৃষ্ণ পীতাম্বরে পরাজিয়া আর্তশ্বরে
ব্রজ-বনে নিত্য-কেলি-রত
তুমি রাধে নীলাম্বরী পলাশের গর্ব হরি''
কৃষ্ণ-কেলি-সহায় সতত',
    E'tumi
kṛṣṇa pītāmbare parājiyā
ārtaśware
braja-bane
nitya-keli-rata
tumi
rādhe nīlāmbarī palāśera garba hari''
kṛṣṇa-keli-sahāya
satata', E'тумі
кр̣шн̣а пı̄та̄мбаре пара̄джійа̄
а̄рташ́варе
браджа-бане
нітйа-келі-рата
тумі
ра̄дге нı̄ла̄мбарı̄ пала̄ш́ера ґарба харі''
кр̣шн̣а-келі-саха̄йа
сатата',
    E'', E'',
    E'You, my dear Lord Krsna, are conquering the radiant luster of pure gold with
Your dazzling yellow garments. You are always very fond of performing Your
amorous sports
within
the transcendental forests of Vraja. And You, my dear Radharani, are wearing a
brilliant blue sari which is taking away the pride of the palasa flower, which
is also blue with a white whorl in the center. You are always gracefully
present as the chief companion during all the amorous games played by Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'তুমি কৃষ্ণ হরিন্মণি জুবা-বৃন্দ-শিরোমণি
রাধিকা তোমার প্রাণেশ্বরী
ব্রজঙ্গণ-সিরঃ-শোভা ধম্মিল-মল্লিকা-প্রভা
তুমি রাধে কৃষ্ণ-প্রিয়াঙ্করী', E'তুমি কৃষ্ণ হরিন্মণি জুবা-বৃন্দ-শিরোমণি
রাধিকা তোমার প্রাণেশ্বরী
ব্রজঙ্গণ-সিরঃ-শোভা ধম্মিল-মল্লিকা-প্রভা
তুমি রাধে কৃষ্ণ-প্রিয়াঙ্করী',
    E'tumi
kṛṣṇa harinmaṇi
jubā-bṛnda-śiromaṇi
rādhikā
tomāra prāṇeśwarī
brajańgaṇa-siraḥ-śobhā
dhammila-mallikā-probhā
tumi
rādhe kṛṣṇa-priyāńkarī', E'тумі
кр̣шн̣а харінман̣і
джуба̄-бр̣нда-ш́іроман̣і
ра̄дгіка̄
тома̄ра пра̄н̣еш́варı̄
браджаńґан̣а-сірах̣-ш́обга̄
дгамміла-малліка̄-пробга̄
тумі
ра̄дге кр̣шн̣а-прійа̄ńкарı̄',
    E'', E'',
    E'You, dear Lord Krsna, like a rare, radiant emerald, are the crest jewel amongst
all the youthful boys of Vrndavana. And Srimati Radhika is the Mistress of Your
life. And You, Radhe, are the topmost resplendent personality amongst all the
women of Vraja. You radiate an effulgence like the fragrant white jasmine
blossoms which are woven within the braided hair of all those beautiful young
women, and You are the most amiable and affectionate maidservant of Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'রমা-পতি-শোভা জিনি'' কৃষ্ণ তব রূপ-খানি
জগত মাতায় ব্রজ-বনে
রমা জিনি'' ব্রজাঙ্গনা- গণ-মধ্য়ে সু-শোভন
তুমি রাধে কৃষ্ণ-চিত্তাঙ্গনে', E'রমা-পতি-শোভা জিনি'' কৃষ্ণ তব রূপ-খানি
জগত মাতায় ব্রজ-বনে
রমা জিনি'' ব্রজাঙ্গনা- গণ-মধ্য়ে সু-শোভন
তুমি রাধে কৃষ্ণ-চিত্তাঙ্গনে',
    E'ramā-pati-śobhā
jini'' kṛṣṇa taba rūpa-khāni
jagat
mātāya braja-bane
ramā
jini'' brajāńganā- gaṇa-madhye su-śobhana
tumi
rādhe kṛṣṇa-cittāńgane', E'рама̄-паті-ш́обга̄
джіні'' кр̣шн̣а таба рӯпа-кха̄ні
джаґат
ма̄та̄йа браджа-бане
рама̄
джіні'' браджа̄ńґана̄- ґан̣а-мадгйе су-ш́обгана
тумі
ра̄дге кр̣шн̣а-чітта̄ńґане',
    E'', E'',
    E'Dear Krsna, Your beauty and sweetness far surpasses that of Lord Visnu, the
husband of the Goddess of Fortune. And that form which You are displaying
within the forests of Vrndavana is making the entire universe go mad. And You,
Radhe, are likewise surpassing the Goddess of Fortune Laksmi herself with Your
supreme splendor which radiates outstandingly amongst all the damsel of Vraja.
Thus it is only You who is dwelling in the beautiful courtyard of Krsna''s
heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'তরঙ্গ-সৌরভ-কণ বংশী-গীত অনুক্ষণ
ওহে কৃষ্ণ রাধা-মন হরে
রাধে অঙ্গ-গন্ধ তব তোমার সু-বিনা-রব
কৃষ্ণ-চিত্ত উন্মাদিত করে', E'তরঙ্গ-সৌরভ-কণ বংশী-গীত অনুক্ষণ
ওহে কৃষ্ণ রাধা-মন হরে
রাধে অঙ্গ-গন্ধ তব তোমার সু-বিনা-রব
কৃষ্ণ-চিত্ত উন্মাদিত করে',
    E'tarańga-saurabha-kaṇa
baḿśī-gīta anukṣaṇa
ohe
kṛṣṇa rādhā-mana hore
rādhe
ańga-gandha taba tomāra su-binā-raba
kṛṣṇa-citta
unmādita kore', E'тараńґа-саурабга-кан̣а
баḿш́ı̄-ґı̄та анукшан̣а
охе
кр̣шн̣а ра̄дга̄-мана хоре
ра̄дге
аńґа-ґандга таба тома̄ра су-біна̄-раба
кр̣шн̣а-чітта
унма̄діта коре',
    E'', E'',
    E'Oh Krsna! You are abducting Radharani''s mind with the enchanting songs of Your
flute as well by Your sweet bodily fragrance, which are both blowing like waves
incessantly in the wind. Oh Radhe! You are likewise exciting and sending
Krsna''s mind wild with Your fragrant bodily aroma and the sweet sound of Your
vina.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'তোমার চপলেক্ষণহরে রাধা-ধৈর্য়-ধন
তুমি কৃষ্ণ চোর-শিরোমণি
বঙ্ক দৃষ্টি-ভঙ্গি তবশ্রী-কৃষ্ণ-হৃদয়াসব
তুমি রাধে কলাবতী ধনী', E'তোমার চপলেক্ষণহরে রাধা-ধৈর্য়-ধন
তুমি কৃষ্ণ চোর-শিরোমণি
বঙ্ক দৃষ্টি-ভঙ্গি তবশ্রী-কৃষ্ণ-হৃদয়াসব
তুমি রাধে কলাবতী ধনী',
    E'tomāra
capalekṣaṇahare rādhā-dhairya-dhana
tumi
kṛṣṇa cora-śiromaṇi
bańka
dṛṣṭi-bhańgi
tabaśrī-kṛṣṇa-hṛdayāsaba
tumi
rādhe kalābatī dhanī', E'тома̄ра
чапалекшан̣ахаре ра̄дга̄-дгаірйа-дгана
тумі
кр̣шн̣а чора-ш́іроман̣і
баńка
др̣шт̣і-бгаńґі
табаш́рı̄-кр̣шн̣а-хр̣дайа̄саба
тумі
ра̄дге кала̄батı̄ дганı̄',
    E'', E'',
    E'You, My dear Krsna, are the crest jewel of all thieves, for You forcibly rob
Radharani''s patience when You gaze upon Her with Your special fickle, amorous
expression. And You, dear Radhe, like to sting Krsna''s lotus heart when You
look back at Him with Your crooked, falsely unfriendly expression. He becomes
maddened by Your slanted behavior. And You are also a beautiful, young maiden
who is well-versed in all the classical arts such as music, dancing, singing,
etc.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'পরিহাসে রাধিকারকথা নাহি সরে যার
তুমি কৃষ্ণ নট-কুল-গুরু
কৃষ্ণ নর্ম-উক্তি শুনি'' রোমঞ্চিত তনু-খনি
তব রাধে রস-কল্প-তরু', E'পরিহাসে রাধিকারকথা নাহি সরে যার
তুমি কৃষ্ণ নট-কুল-গুরু
কৃষ্ণ নর্ম-উক্তি শুনি'' রোমঞ্চিত তনু-খনি
তব রাধে রস-কল্প-তরু',
    E'parihāse
rādhikārakathā nāhi sare jāra
tumi
kṛṣṇa naṭa-kula-guru
kṛṣṇa
narma-ukti śuni'' romañcita tanu-khani
taba
rādhe rasa-kalpa-taru', E'паріха̄се
ра̄дгіка̄ракатха̄ на̄хі саре джа̄ра
тумі
кр̣шн̣а нат̣а-кула-ґуру
кр̣шн̣а
нарма-укті ш́уні'' роман̃чіта тану-кхані
таба
ра̄дге раса-калпа-тару',
    E'', E'',
    E'You, Krsna, are indeed the Master and instructor of all those who are learning
dancing. Sometimes You simply cannot utter a word in reply to the confidential
joking statements of Srimati Radharani. You, Radhe, then experience intense
thriving jubilation throughout Your entire body when You hear Krsna''s soft,
amusing retort. Thus You are like a wish-fulfilling tree of transcendental
mellows.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'অপ্রাকৃত-গুণ-মণি-বিনির্মিত-গিরি-শ্রেণি
তুমি কৃষ্ণ সর্ব-গুণ-ময়
উমাদি রমণী-জনবাঞ্ছনীয় গুণ-গণ
রাধে তব স্বভাবিক হয়', E'অপ্রাকৃত-গুণ-মণি-বিনির্মিত-গিরি-শ্রেণি
তুমি কৃষ্ণ সর্ব-গুণ-ময়
উমাদি রমণী-জনবাঞ্ছনীয় গুণ-গণ
রাধে তব স্বভাবিক হয়',
    E'aprākṛta-guṇa-maṇi-binirmita-giri-śreṇi
tumi
kṛṣṇa sarba-guṇa-moya
umādi
ramaṇī-janabāñchanīya guṇa-gaṇa
rādhe
taba swabhābika hoya', E'апра̄кр̣та-ґун̣а-ман̣і-бінірміта-ґірі-ш́рен̣і
тумі
кр̣шн̣а сарба-ґун̣а-мойа
ума̄ді
раман̣ı̄-джанаба̄н̃чханı̄йа ґун̣а-ґан̣а
ра̄дге
таба свабга̄біка хойа',
    E'', E'',
    E'You, dear Krsna, are also abounding in all good qualities. Indeed, Your
super-excellent transcendental qualities stand out just like a multitude of
mountain ranges made of rubies. Oh Radhe! You naturally possess all the good
qualities that are desired by all the beautiful young women headed by Goddess
Uma.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10',
    E'আমি অতি মন্দ-মতি করি হে কাকুতি নতি
নিখপটে এ প্রার্থন করি
বৃন্দাবন-অধীশ্বর তুমি কৃষ্ণ প্রাণেশ্বর
তুমি রাধে ব্রজ-বনেশ্বরী', E'আমি অতি মন্দ-মতি করি হে কাকুতি নতি
নিখপটে এ প্রার্থন করি
বৃন্দাবন-অধীশ্বর তুমি কৃষ্ণ প্রাণেশ্বর
তুমি রাধে ব্রজ-বনেশ্বরী',
    E'āmi
ati manda-mati kori he kākuti nati
nikhapaṭe
e prārthana kori
bṛndābana-adhīśwara
tumi kṛṣṇa prāṇeśwara
tumi
rādhe braja-baneśwarī', E'а̄мі
аті манда-маті корі хе ка̄куті наті
нікхапат̣е
е пра̄ртхана корі
бр̣нда̄бана-адгı̄ш́вара
тумі кр̣шн̣а пра̄н̣еш́вара
тумі
ра̄дге браджа-банеш́варı̄',
    E'', E'',
    E'I am extremely dull-minded and wicked; therefore I bow down pitifully before
You, and offer You this humble prayer in all sincerity. You, my dear Lord
Krsna, are the Supreme Master of Vrndavana and the Lord of my life! And You,
dear Radhe, are the proprietress of all the transcendental forests of Vraja!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11',
    E'তোমাদের কৃপা পাইএ-রূপ যোগ্যতা নাই
যদি আমার ব্রজ-বনে
দুঁহে মম কৃপা-ময় জানি'' কৈনু পদাশ্রয়
কৃপা কর এ অধম জনে', E'তোমাদের কৃপা পাইএ-রূপ যোগ্যতা নাই
যদি আমার ব্রজ-বনে
দুঁহে মম কৃপা-ময় জানি'' কৈনু পদাশ্রয়
কৃপা কর এ অধম জনে',
    E'tomādera
kṛpā pāie-rūpa jogyatā nāi
jadi
āmāra braja-bane
duńhe
mama kṛpā-moya jāni'' kainu padāśroya
kṛpā
koro e adhama jane', E'тома̄дера
кр̣па̄ па̄іе-рӯпа джоґйата̄ на̄і
джаді
а̄ма̄ра браджа-бане
дуńхе
мама кр̣па̄-мойа джа̄ні'' каіну пада̄ш́ройа
кр̣па̄
коро е адгама джане',
    E'', E'',
    E'I am certainly not at all fit to receive the mercy of You both in Vrndavana.
However, I have still taken refuge at Your lotus feet for I know that You both
are the topmost merciful personalities. Please be kind to this most fallen
soul.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '12',
    E'কেবল অযোগ্য নহিঅপরাধী আমি হৈ
তথাপি করহ কৃপা দান
লোকে কৃপাবিষ্ট জন ক্ষমে অপরাধ-গণ
তুমি দুঁহে মহা-কৃপাবান', E'কেবল অযোগ্য নহিঅপরাধী আমি হৈ
তথাপি করহ কৃপা দান
লোকে কৃপাবিষ্ট জন ক্ষমে অপরাধ-গণ
তুমি দুঁহে মহা-কৃপাবান',
    E'kebala
ajogya nahiaparādhī āmi hoi
tathāpi
koroho kṛpā dāna
loke
kṛpābiṣṭa jana kṣame aparādha-gaṇa
tumi
duńhe mahā-kṛpābān', E'кебала
аджоґйа нахіапара̄дгı̄ а̄мі хоі
татха̄пі
корохо кр̣па̄ да̄на
локе
кр̣па̄бішт̣а джана кшаме апара̄дга-ґан̣а
тумі
дуńхе маха̄-кр̣па̄ба̄н',
    E'', E'',
    E'But only am I unfit and undeserving, but I am actually an offender to Your
lotus feet. Nevertheless, I still beg You Both now to bestow Your kind favor.
Just as a great soul is very tolerant of the general public, compassionately
forgiving their offenses, similarly You Both are certainly the most supremely
sympathetic Personalities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '13',
    E'কৃপা-হেতু ভক্তি-সার লেশাভাস নাহি তা''র
কৃপা-অধিকারী নাহি আমি
দুঁহে মহা-লীলেশ্বর
হন সেই লীলাপর
কৃপা কর ব্রজ-জন-স্বামী', E'কৃপা-হেতু ভক্তি-সার লেশাভাস নাহি তা''র
কৃপা-অধিকারী নাহি আমি
দুঁহে মহা-লীলেশ্বর
হন সেই লীলাপর
কৃপা কর ব্রজ-জন-স্বামী',
    E'kṛpā-hetu
bhakti-sāra leśābhāsa nāhi tā''ra
kṛpā-adhikārī
nāhi āmi
duńhe
mahā-līleśwara hana sei līlāpara
kṛpā
koro braja-jana-swāmī', E'кр̣па̄-хету
бгакті-са̄ра леш́а̄бга̄са на̄хі та̄''ра
кр̣па̄-адгіка̄рı̄
на̄хі а̄мі
дуńхе
маха̄-лı̄леш́вара хана сеі лı̄ла̄пара
кр̣па̄
коро браджа-джана-сва̄мı̄',
    E'', E'',
    E'The most essential result of Your mercy is to finally get devotional service.
However, I do not possess even a fraction of a drop of devotion, for I have no
right to receive Your mercy. In this world, You are the Supreme Master of the
greatest pastime... the rasa dance. So I ask You now to please be merciful to
me when You are performing this most unlimited pastime within this universe, oh
Lord of the Brijbasis.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '14',
    E'সু-দুষ্ট অভক্ত জনে সিবাদি দেবত-গণে
প্রসন্ন হৈল কৃপা করি''
মহা-লীলা সর্বেশ্বর দুঁহু মম প্রাণেশ্বর
দয়া কর দোষ পরিহরি''', E'সু-দুষ্ট অভক্ত জনে সিবাদি দেবত-গণে
প্রসন্ন হৈল কৃপা করি''
মহা-লীলা সর্বেশ্বর দুঁহু মম প্রাণেশ্বর
দয়া কর দোষ পরিহরি''',
    E'su-duṣṭa
abhakta jane sibādi debata-gaṇe
prasanna
hoilo kṛpā kori''
mahā-līlā
sarbeśwara duńhu mama prāṇeśwara
doyā
koro doṣa parihori''', E'су-душт̣а
абгакта джане сіба̄ді дебата-ґан̣е
прасанна
хоіло кр̣па̄ корі''
маха̄-лı̄ла̄
сарбеш́вара дуńху мама пра̄н̣еш́вара
дойа̄
коро доша паріхорі''',
    E'', E'',
    E'You have shown Your supreme rasa dance to all in this world, including all the
demigods headed by Lord Siva, and even to the most wicked persons and
non-devotees. Thus You pleased all the living entities within the universe. You
Both are the Masters of this maha-lila, the Lords of all Lords, and the Lords
of my life. Please show Your leniency by disregarding all of my past offenses.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '15',
    E'অধমে উত্তম মণি মূঢ বিজ্ঞ অভিমানী
দুষ্ট হন সিষ্ট-অভিমান
এই দোষে দোষি হন গেল চির-দিন বন
না করিনু ভজন-বিধান', E'অধমে উত্তম মণি মূঢ বিজ্ঞ অভিমানী
দুষ্ট হন সিষ্ট-অভিমান
এই দোষে দোষি হন গেল চির-দিন বন
না করিনু ভজন-বিধান',
    E'adhame
uttama maṇi mūḍha bijña abhimānī
duṣṭa
hana siṣṭa-abhimāna
ei
doṣe doṣi hana gelo ciro-dina bana
nā
korinu bhajana-bidhāna', E'адгаме
уттама ман̣і мӯд̣ха біджн̃а абгіма̄нı̄
душт̣а
хана сішт̣а-абгіма̄на
еі
доше доші хана ґело чіро-діна бана
на̄
коріну бгаджана-бідга̄на',
    E'', E'',
    E'Some of my offenses are as follows: I have accepted my most degraded self to be
the best man of all. Even though I am foolish like an ass, I consider myself to
be very wise due to my false sentimentality. Thus I have actually become most
polluted and mischievous underneath my false conception of being gentle and good-natured.
Being guilty of these offenses, i have spent many days without ever worshiping
You.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '16',
    E'তথাপি এ দীন-জনে যদি নাম-উচ্চরণে
নামাভাসে করিল জীবনে
সর্ব-দোষ-নিবরণ দুঁহু নাম-সঞ্জল্পন
প্রসাদে প্রসীদ দুই জনে', E'তথাপি এ দীন-জনে যদি নাম-উচ্চরণে
নামাভাসে করিল জীবনে
সর্ব-দোষ-নিবরণ দুঁহু নাম-সঞ্জল্পন
প্রসাদে প্রসীদ দুই জনে',
    E'tathāpi
e dīna-jane jadi nāma-uccaraṇe
nāmābhāse
korilo jībane
sarba-doṣa-nibaraṇa
duńhu nāma-sañjalpana
prasāde
prasīda dui jane', E'татха̄пі
е дı̄на-джане джаді на̄ма-уччаран̣е
на̄ма̄бга̄се
коріло джı̄бане
сарба-доша-нібаран̣а
дуńху на̄ма-сан̃джалпана
праса̄де
прасı̄да дуі джане',
    E'', E'',
    E'In spite of all these offenses, I pray that if ever in my life this most fallen
soul has once accidentally uttered just a faint glimpse of Your holy name, without
offence, then kindly mitigate all of my faults and allow me to chant Your name
simply for the pleasure of You Both.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '17',
    E'ভক্তি-লব-মাত্রে খোয়সর্ব-অপরাধা হয়
ক্ষম-শীল দুঁহের কৃপায়
এ আশা মনে ধরি'' চরণে প্রার্থন করি''
শোধ দোষ ক্ষমিয়া অমায়', E'ভক্তি-লব-মাত্রে খোয়সর্ব-অপরাধা হয়
ক্ষম-শীল দুঁহের কৃপায়
এ আশা মনে ধরি'' চরণে প্রার্থন করি''
শোধ দোষ ক্ষমিয়া অমায়',
    E'bhakti-laba-mātre
khoyasarba-aparādhā hoya
kṣama-śīla
duńhera kṛpāya
e
āśā mane dhori'' caraṇe prārthana kori''
śodha
doṣa kṣamiyā amāya', E'бгакті-лаба-ма̄тре
кхойасарба-апара̄дга̄ хойа
кшама-ш́ı̄ла
дуńхера кр̣па̄йа
е
а̄ш́а̄ мане дгорі'' чаран̣е пра̄ртхана корі''
ш́одга
доша кшамійа̄ ама̄йа',
    E'', E'',
    E'Even the most minute trace of devotion can completely destroy all offensive
faults, for I know that the causeless mercy of You Both is most forgiving by
nature. Keeping this in mind as my last hope, I offer this humble prayer at
Your lotus feet. Please forgive me and rectify all of my offenses.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '18',
    E'সাধন-সম্পত্তি-হীন ওহে এ জীব দীন
অতি-কষ্টে ধৃষ্টতর ছার
দুঁহু পদ-নিপতিত প্রার্থন করয়ে হিত
প্রসন্নতা হৌক দোঁহার', E'সাধন-সম্পত্তি-হীন ওহে এ জীব দীন
অতি-কষ্টে ধৃষ্টতর ছার
দুঁহু পদ-নিপতিত প্রার্থন করয়ে হিত
প্রসন্নতা হৌক দোঁহার',
    E'sādhana-sampatti-hīna
ohe e jība dīna
ati-kaṣṭe
dhṛṣṭatara chāra
duńhu
pada-nipatita prārthana koroye hita
prasannatā
hauka dońhāra', E'са̄дгана-сампатті-хı̄на
охе е джı̄ба дı̄на
аті-кашт̣е
дгр̣шт̣атара чха̄ра
дуńху
пада-ніпатіта пра̄ртхана коройе хіта
прасанната̄
хаука доńха̄ра',
    E'', E'',
    E'Alas, this most fallen soul is completely bereft of the priceless treasure of
devotional service. I am so degraded, and I remain in great difficulty due to
my shameless arrogance. Falling down and grasping the lotus feet of You Both, I
now pray simply for the benefit of seeing You become satisfied by my prayers.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '19',
    E'দন্তে তৃণ ধরি'' হায় কাঁদিতেছে উভরায়
এ পাপী কম্পিত শরীর
হ নাথ হ নাথ বলি''হ''য়ে অজি কৃতাঞ্জলি
প্রসাদ অর্পিয়া কর স্থির', E'দন্তে তৃণ ধরি'' হায় কাঁদিতেছে উভরায়
এ পাপী কম্পিত শরীর
হ নাথ হ নাথ বলি''হ''য়ে অজি কৃতাঞ্জলি
প্রসাদ অর্পিয়া কর স্থির',
    E'dante
tṛṇa dhori'' hāya kāńditeche ubharāya
e
pāpī kampita śarīra
ha
nātha ha nātha boli''ho''ye aji kṛtāñjali
prasāda
arpiyā koro sthira', E'данте
тр̣н̣а дгорі'' ха̄йа ка̄ńдітечхе убгара̄йа
е
па̄пı̄ кампіта ш́арı̄ра
ха
на̄тха ха на̄тха болі''хо''йе аджі кр̣та̄н̃джалі
праса̄да
арпійа̄ коро стхіра',
    E'', E'',
    E'Alas! This sinner''s whole body is trembling, and clutching clumps of straw
between his teeth, he weeps and wails piteously at the top of his voice,
"Oh my Lord! Oh Nath! Today, with folded hands, i beg that You pacify me
by bestowing Your kind favor!"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '20',
    E'এ দুর্ভগ হ হ স্বরে প্রসাদ প্রার্থনা করে
অনুতাপে গডাগডি যায়
হে রাধে হে কৃষ্ণচন্দ্রশুন মম কাকু-বাদ
তুঁহু কৃপা বিনা প্রাণ যায়', E'এ দুর্ভগ হ হ স্বরে প্রসাদ প্রার্থনা করে
অনুতাপে গডাগডি যায়
হে রাধে হে কৃষ্ণচন্দ্রশুন মম কাকু-বাদ
তুঁহু কৃপা বিনা প্রাণ যায়',
    E'e
durbhaga ha ha sware prasāda prārthanā kore
anutāpe
gaḍāgaḍi jāya
he
rādhe he kṛṣṇacandraśuno mama kāku-bāda
tuńhu
kṛpā binā prāṇa jāya', E'е
дурбгаґа ха ха сваре праса̄да пра̄ртхана̄ коре
анута̄пе
ґад̣а̄ґад̣і джа̄йа
хе
ра̄дге хе кр̣шн̣ачандраш́уно мама ка̄ку-ба̄да
туńху
кр̣па̄ біна̄ пра̄н̣а джа̄йа',
    E'', E'',
    E'This most unfortunate, miserable soul now prays for mercy, crying out in a
piteous, remorseful voice while rolling on the ground in repentance. Oh Radhe!
Oh Krsna-candra!, please hear my mournful prayers, for my life is departing
without the causeless mercy of You Both!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '21',
    E'ফুত্কার করিয়া কান্দে আহা আহা কাকু-নাদে
বলে হও প্রসন্ন অমায়
এই তো'' অযোগ্য় জনেকৃপা কর নিজ-গুণে
করুণ-সাগর রাখো পায়', E'ফুত্কার করিয়া কান্দে আহা আহা কাকু-নাদে
বলে হও প্রসন্ন অমায়
এই তো'' অযোগ্য় জনেকৃপা কর নিজ-গুণে
করুণ-সাগর রাখো পায়',
    E'phutkāra
koriyā kāńde āhā āhā
kāku-nāde
bole
hao prasanna amāya
ei
to'' ajogya janekṛpā koro nija-guṇe
koruṇa-sāgara
rākho pāya', E'пхутка̄ра
корійа̄ ка̄ńде а̄ха̄ а̄ха̄
ка̄ку-на̄де
боле
хао прасанна ама̄йа
еі
то'' аджоґйа джанекр̣па̄ коро ніджа-ґун̣е
корун̣а-са̄ґара
ра̄кхо па̄йа',
    E'', E'',
    E'Please become pleased with me, for I am sobbing aloud and crying, alas, alas!
In a great pitiful uproar just to petition You. By Your own divine qualities,
please favor this most unworthy and undeserving soul and keep me always at Your
lotus feet. You are Both just like an ocean of compassion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '22',
    E'মুখেতে অঙ্গুষ্ঠ দিয়া উচ্চৈঃস্বরে আর্ত হন
কাঁদিতে কাঁদিতে বলে নাথ
করুণ-কণিকা-দানেরাখ কর মোর প্রাণে
কর এই দিনে আত্ম-শাঠ', E'মুখেতে অঙ্গুষ্ঠ দিয়া উচ্চৈঃস্বরে আর্ত হন
কাঁদিতে কাঁদিতে বলে নাথ
করুণ-কণিকা-দানেরাখ কর মোর প্রাণে
কর এই দিনে আত্ম-শাঠ',
    E'mukhete
ańguṣṭha diyā uccaiḥsware ārta hana
kāńdite
kāńdite bole nātha
koruṇa-kaṇikā-dānerākha
koro mora prāṇe
koro
ei dine ātma-śāṭha', E'мукхете
аńґушт̣ха дійа̄ уччаіх̣сваре а̄рта хана
ка̄ńдіте
ка̄ńдіте боле на̄тха
корун̣а-кан̣іка̄-да̄нера̄кха
коро мора пра̄н̣е
коро
еі діне а̄тма-ш́а̄т̣ха',
    E'', E'',
    E'Now I am biting my thumb to try to check my crying from making a public
disturbance. But still, being most aggrieved, i am weeping and weeping in a
loud voice just to call on You, oh Lord! Please give me just one small grain of
Your mercy in charity and thus save my life. Kindly capture this lowly soul and
make me Your very own.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '23',
    E'এ তব মূঢ-জন দীন-বাক্যে সু-ক্রন্দন
প্রার্থনা করয়ে দৃঢ-মনে
হে করুণা-সুনিধান অনুগতি কর দান
করুণর্মি-চ্ছটা ব্রজ-বনে', E'এ তব মূঢ-জন দীন-বাক্যে সু-ক্রন্দন
প্রার্থনা করয়ে দৃঢ-মনে
হে করুণা-সুনিধান অনুগতি কর দান
করুণর্মি-চ্ছটা ব্রজ-বনে',
    E'e
taba mūḍha-jana dīna-bākye su-krandana
prārthanā
koroye dṛḍha-mane
he
koruṇā-sunidhāna anugati koro dāna
koruṇormi-cchaṭā
braja-bane', E'е
таба мӯд̣ха-джана дı̄на-ба̄кйе су-крандана
пра̄ртхана̄
коройе др̣д̣ха-мане
хе
корун̣а̄-сунідга̄на ануґаті коро да̄на
корун̣ормі-ччхат̣а̄
браджа-бане',
    E'', E'',
    E'Thus Your most ignorant, foolish devotee prays to You in great determination
with humble, distressed words while sobbing and weeping. Oh treasure-house of
compassion! Please award me with personal service to You and thus display Your
splendorous shining rays of that compassion in Vrndavana!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '24',
    E'ভাব চিত্ত-সুখকর জত আছে সু-মধুর
প্রকটাপ্রকট লীলা-স্থানে
রাধা-কৃষ্ণ-প্রেম-সার সকলের সারাত সার
সেই ভাব যেনি কৃপা-বলে', E'ভাব চিত্ত-সুখকর জত আছে সু-মধুর
প্রকটাপ্রকট লীলা-স্থানে
রাধা-কৃষ্ণ-প্রেম-সার সকলের সারাত সার
সেই ভাব যেনি কৃপা-বলে',
    E'bhāba
citta-sukhakara jata āche su-madhura
prakaṭāprakaṭa
līlā-sthāne
rādhā-kṛṣṇa-prema-sāra
sakalera sārāt sāra
sei
bhāba jeni kṛpā-bale', E'бга̄ба
чітта-сукхакара джата а̄чхе су-мадгура
пракат̣а̄пракат̣а
лı̄ла̄-стха̄не
ра̄дга̄-кр̣шн̣а-према-са̄ра
сакалера са̄ра̄т са̄ра
сеі
бга̄ба джені кр̣па̄-бале',
    E'', E'',
    E'All the places of Krsna''s manifested and unmanifested transcendental pastimes
are the repository of various conscious pleasure-giving ecstasies, which are
all super sweet. Out of all of these ecstasies, the quintessence of ecstatic
love between Radha and Krsna is definitely the best, the topmost expression of
pure love. And that ecstasy is worshiped by a rare, great personality only on
the strength of Their mercy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '25',
    E'যদি এ দাসীর প্রতি প্রসন্ন করুণা-মতি
দুঁহু পদ-সেবা কর দান
আর কিছু নাহি চাইজুগল-চরণ পাই
শীতল হৌক মোর প্রাণ', E'যদি এ দাসীর প্রতি প্রসন্ন করুণা-মতি
দুঁহু পদ-সেবা কর দান
আর কিছু নাহি চাইজুগল-চরণ পাই
শীতল হৌক মোর প্রাণ',
    E'jodi
e dāsīra prati prasanna koruṇā-mati
duńhu
pada-sebā koro dāna
āra
kichu nāhi cāijugala-caraṇa pāi
śītala
hauka mora prāṇa', E'джоді
е да̄сı̄ра праті прасанна корун̣а̄-маті
дуńху
пада-себа̄ коро да̄на
а̄ра
кічху на̄хі ча̄іджуґала-чаран̣а па̄і
ш́ı̄тала
хаука мора пра̄н̣а',
    E'', E'',
    E'If You Both are ever pleased with this maidservant, then kindly manifest Your
favorable inclination towards me by granting me the service of Your four lotus
feet. There''s really nothing more that I want than to get those two pairs of
lotus feet, so I request You to please grant this favor and thus soothe my
heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '26',
    E'অনাথ-বত্সল তুমি অধম অনাথ আমি
ত্বদীয় সাক্ষাত-দাস্য মাগি
এ প্রসাদ কর দান রাখো অনাথেরপ্রাণ
ছাড়ি'' সব তব দাস্য মাগি', E'অনাথ-বত্সল তুমি অধম অনাথ আমি
ত্বদীয় সাক্ষাত-দাস্য মাগি
এ প্রসাদ কর দান রাখো অনাথেরপ্রাণ
ছাড়ি'' সব তব দাস্য মাগি',
    E'anātha-batsala
tumi adhama anātha āmi
twadīya
sākṣāt-dāsya māgi
e
prasāda koro dāna rākho anātheraprāṇa
chāḍi''
saba taba dāsya māgi', E'ана̄тха-батсала
тумі адгама ана̄тха а̄мі
твадı̄йа
са̄кша̄т-да̄сйа ма̄ґі
е
праса̄да коро да̄на ра̄кхо ана̄тхерапра̄н̣а
чха̄д̣і''
саба таба да̄сйа ма̄ґі',
    E'', E'',
    E'I know that You are most kind and affectionate to those who are helpless
without their master. I am actually such a fallen soul who is also bereft of my
Master, and feeling so helpless. Therefore I am now begging for Your personal
service. Please grant this favor just to save the life of this helpless orphan.
Giving up everything else, I am now begging only for Your service.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '27',
    E'শিরেতে অঞ্জলি ধরি'' ও-পদে বিজপ্তি করি
আমার অভীষ্ট নিবেদন
এক-বার দাস্য দিয়া শীতল কর হে হিয়া
তবে মানি সার্থাক জীবন', E'শিরেতে অঞ্জলি ধরি'' ও-পদে বিজপ্তি করি
আমার অভীষ্ট নিবেদন
এক-বার দাস্য দিয়া শীতল কর হে হিয়া
তবে মানি সার্থাক জীবন',
    E'śirete
añjali dhori'' o-pade bijapti kori
āmāra
abhīṣṭa nibedana
eka-bāra
dāsya diyā śītala koro he hiyā
tabe
māni sārthāka jībana', E'ш́ірете
ан̃джалі дгорі'' о-паде біджапті корі
а̄ма̄ра
абгı̄шт̣а нібедана
ека-ба̄ра
да̄сйа дійа̄ ш́ı̄тала коро хе хійа̄
табе
ма̄ні са̄ртха̄ка джı̄бана',
    E'', E'',
    E'Clasping my head with both hands, I am lying flat before those lotus feet
making this request: my most cherished prayer. Please, Please soothe my heart
by giving me Your service just once only. Then and then only will I consider
this life to be successful.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '28',
    E'কবে দুঁহে এই বনেবিলোকিব সম্মিলনে
অমূল্যাঙ্গ-পরিমল-ঘ্রাণ
আমার নাসিকা-দ্বরেপ্রবেশিয়া চিত্ত-পুরে
অচৈতন্য করিবে বিধান', E'কবে দুঁহে এই বনেবিলোকিব সম্মিলনে
অমূল্যাঙ্গ-পরিমল-ঘ্রাণ
আমার নাসিকা-দ্বরেপ্রবেশিয়া চিত্ত-পুরে
অচৈতন্য করিবে বিধান',
    E'kabe
duńhe ei banebilokibo sammilane
amūlyāńga-parimala-ghrāṇa
āmāra
nāsikā-dwareprabeśiyā citta-pure
acaitanya
koribe bidhāna', E'кабе
дуńхе еі банебілокібо саммілане
амӯлйа̄ńґа-парімала-ґгра̄н̣а
а̄ма̄ра
на̄сіка̄-дварепрабеш́ійа̄ чітта-пуре
ачаітанйа
корібе бідга̄на',
    E'', E'',
    E'When will I be able to wistfully observe You Both encountering each other
within the transcendental forest? The sweet nectarine fragrance produced by the
meeting of Your precious forms will pass through my nostrils and, entering into
my heart, will immediately knock me unconscious.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '29',
    E'দুঁহার নূপুর-ধ্বনি হংস-কণ্ঠ-স্বর জিনি''
মধুর মধুর মম কানে
প্রবেশিয়া কোন ক্ষণে মম চিত্ত-সুরঞ্জনে
মাতাইবে সেবা-রস-পানে', E'দুঁহার নূপুর-ধ্বনি হংস-কণ্ঠ-স্বর জিনি''
মধুর মধুর মম কানে
প্রবেশিয়া কোন ক্ষণে মম চিত্ত-সুরঞ্জনে
মাতাইবে সেবা-রস-পানে',
    E'duńhāra
nūpura-dhwani haḿsa-kaṇṭha-swara jini''
madhura
madhura mama kāne
prabeśiyā
kona kṣaṇe mama citta-surañjane
mātāibe
sebā-rasa-pāne', E'дуńха̄ра
нӯпура-дгвані хаḿса-кан̣т̣ха-свара джіні''
мадгура
мадгура мама ка̄не
прабеш́ійа̄
кона кшан̣е мама чітта-суран̃джане
ма̄та̄ібе
себа̄-раса-па̄не',
    E'', E'',
    E'The tinkling sound of both of Your ankle bells together, surpasses the sweet
sound produced by the swan. It is transcendentally sweet; so sweet that
immediately upon entering my ears, my heart will become so charmed that I will
go ragingly wild to drink more of the liquid nectar-mellows of Your service.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '30',
    E'চক্রাদি সৌভাগ্যাস্পদ বিলখিত দুঁহু পদ
চিহ্ন এই বৃন্দাবন-বনে
দেখিয়া এ দাসী কবে ভাসিবে আনন্দোত্সবে
দুঁহু কৃপা পেয়ে সঙ্গোপনে', E'চক্রাদি সৌভাগ্যাস্পদ বিলখিত দুঁহু পদ
চিহ্ন এই বৃন্দাবন-বনে
দেখিয়া এ দাসী কবে ভাসিবে আনন্দোত্সবে
দুঁহু কৃপা পেয়ে সঙ্গোপনে',
    E'cakrādi
saubhāgyāspada bilakhita duńhu pada
cihna
ei bṛndābana-bane
dekhiyā
e dāsī kabe bhāsibe ānandotsabe
duńhu
kṛpā peye sańgopane', E'чакра̄ді
саубга̄ґйа̄спада білакхіта дуńху пада
чіхна
еі бр̣нда̄бана-бане
декхійа̄
е да̄сı̄ кабе бга̄сібе а̄нандотсабе
дуńху
кр̣па̄ пейе саńґопане',
    E'', E'',
    E'The nineteen most auspicious marks of the wheel, conch, lotus, mace etc., which
are unique to both of Your lotus feet, are visible on the ground all throughout
the forests of Vrndavana. Whenever this maidservant sees those marks, she
becomes over flooded and immersed in a festival of bliss, due to secretly
receiving the mercy of You Both in this way.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '31',
    E'সকল-সৌন্দর্জাস্পদ নীরাজিত দুঁহু পদ
হে রাধে হে নন্দের নন্দন
মমাখি-গোচরে কবে সর্বাদ্ভুত-মহোত্সবে
করিবে আনন্দ-বিতরণ', E'সকল-সৌন্দর্জাস্পদ নীরাজিত দুঁহু পদ
হে রাধে হে নন্দের নন্দন
মমাখি-গোচরে কবে সর্বাদ্ভুত-মহোত্সবে
করিবে আনন্দ-বিতরণ',
    E'sakala-saundarjāspada
nīrājita duńhu pada
he
rādhe he nandera nandana
mamākhi-gocare
kabe sarbādbhuta-mahotsabe
koribe
ānanda-bitaraṇa', E'сакала-саундарджа̄спада
нı̄ра̄джіта дуńху пада
хе
ра̄дге хе нандера нандана
мама̄кхі-ґочаре
кабе сарба̄дбгута-махотсабе
корібе
а̄нанда-бітаран̣а',
    E'', E'',
    E'Oh Radhe! Oh son of Maharaja Nanda! The lotus feet of You Both are fit for
being worshiped wit all kinds of suitable paraphernalia, and they are indeed
worshiped by the highest excellence of beauty itself. When, oh when will my
eyes behold the wonderfully astonishing pastimes performed by Your lotus feet,
which will give me a great festival of happiness?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '32',
    E'প্রচীনাশা ফল-পূর্তি তুঁহু পদাম্ভুজ-স্ফূর্তি
সেই দুঁহু জন-দরশন
এ জন্মে কি হবে মম এ উত্কণ্ঠা সু-বিষম
বিচলিত করে মম মন', E'প্রচীনাশা ফল-পূর্তি তুঁহু পদাম্ভুজ-স্ফূর্তি
সেই দুঁহু জন-দরশন
এ জন্মে কি হবে মম এ উত্কণ্ঠা সু-বিষম
বিচলিত করে মম মন',
    E'pracīnāśā
phala-pūrti tuńhu padāmbhuja-sphūrti
sei
duńhu jana-daraśana
e
janme ki habe mama e utkaṇṭhā su-biṣama
bicalita
kore mama mana', E'прачı̄на̄ш́а̄
пхала-пӯрті туńху пада̄мбгуджа-спхӯрті
сеі
дуńху джана-дараш́ана
е
джанме кі хабе мама е уткан̣т̣ха̄ су-бішама
бічаліта
коре мама мана',
    E'', E'',
    E'Just a glimpse of Your lotus feet fulfills all of one''s most cherished
longings; this is the real benefit for one who has Your vision. But I am
worrying now that, without Your audience, what will become of my life now? The
suspense of this unbearable anxiety has greatly perturbed my mind.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '33',
    E'কবে আমি বৃন্দাবন- কুঞ্জান্তরে দরশন
করিব সুন্দর দুঁহু জনে
সুরত-লীলায় রতআমা হৈতে অদূরত
প্রেমে মগ্ন হ''ব দরশনে', E'কবে আমি বৃন্দাবন- কুঞ্জান্তরে দরশন
করিব সুন্দর দুঁহু জনে
সুরত-লীলায় রতআমা হৈতে অদূরত
প্রেমে মগ্ন হ''ব দরশনে',
    E'kabe
āmi bṛndābana- kuñjāntare daraśana
koribo
sundara duńhu jane
surata-līlāya
rataāmā hoite adūrata
preme
magna ha''bo daraśane', E'кабе
а̄мі бр̣нда̄бана- кун̃джа̄нтаре дараш́ана
корібо
сундара дуńху джане
сурата-лı̄ла̄йа
ратаа̄ма̄ хоіте адӯрата
преме
маґна ха''бо дараш́ане',
    E'', E'',
    E'When will I ever have the vision of Your two exquisite forms within a bower in
Vrndavana? Observing Your most intimate pastimes of conjugal love being enacted
so close by, I will become overwhelmed and drowned in ecstatic love at such a
sight.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '34',
    E'ঘটনাবশতঃ কবে দুঁহু যোগ অসম্ভবে
পরস্পর সন্দেশ আনিয়া
বাড়াইব দুঁহু সুখ জবে তবে মনো-দুঃখ
বাড়াইব আনন্দে মাতিয়া', E'ঘটনাবশতঃ কবে দুঁহু যোগ অসম্ভবে
পরস্পর সন্দেশ আনিয়া
বাড়াইব দুঁহু সুখ জবে তবে মনো-দুঃখ
বাড়াইব আনন্দে মাতিয়া',
    E'ghaṭanābaśataḥ
kabe duńhu joga asambhabe
paraspara
sandeśa āniyā
bāḍāibo
duńhu sukha jabe tabe mano-duḥkha
bāḍāibo
ānande mātiyā', E'ґгат̣ана̄баш́атах̣
кабе дуńху джоґа асамбгабе
параспара
сандеш́а а̄нійа̄
ба̄д̣а̄ібо
дуńху сукха джабе табе мано-дух̣кха
ба̄д̣а̄ібо
а̄нанде ма̄тійа̄',
    E'', E'',
    E'In the course of Your transcendental pastimes, sometimes You are separated from
each other, and thereby fell great distress. When will I ever be allowed, at
that time, to act as a messenger and bring Your secret messages back and forth
to each other? Since such messages contain news of the rare, uncommon union of You
Both, hearing them will only increase Your happiness and dispel the distress of
being separated from one another. Thus I will carry these messages to and fro,
and in so doing I will excitedly stroll along, completely besides myself and
overwhelmingly absorbed in great delight.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '35',
    E'কবে এই বৃন্দাবনে দুঁহু দুঁহ অদর্শনে
ফিরে জ''ব দুঁহে অন্বেষিয়া
সম্মিলন করাইব হর-পদকাদি পা''ব
পরিতুষ্ট দুঁহারে করিয়া', E'কবে এই বৃন্দাবনে দুঁহু দুঁহ অদর্শনে
ফিরে জ''ব দুঁহে অন্বেষিয়া
সম্মিলন করাইব হর-পদকাদি পা''ব
পরিতুষ্ট দুঁহারে করিয়া',
    E'kabe
ei bṛndābane duńhu duńha adarśane
phire
ja''bo duńhe anweṣiyā
sammilana
korāibo hara-padakādi pā''bo
parituṣṭa
duńhāre koriyā', E'кабе
еі бр̣нда̄бане дуńху дуńха адарш́ане
пхіре
джа''бо дуńхе анвешійа̄
саммілана
кора̄ібо хара-падака̄ді па̄''бо
парітушт̣а
дуńха̄ре корійа̄',
    E'', E'',
    E'In Vrndavana, sometimes You Both are deprived of the vision of each other. When
will wander all over the forest in search of You Both? I will bring You
together again, and You will be so pleased with me that You will reward me by
giving me some ornaments that You had used such as Your anklebells, toe-rings,
necklaces, lockets, etc.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '36',
    E'দুঁহে হার ধরি'' পণে দ্যূত-ক্রীডা সমাপনে
আমি জয়ী আমি জয়ী বলি''
করিবে কলহ তবেহর-সঙ্গ্রহেতে কবে
আমি তাহা দেখিব সকলি', E'দুঁহে হার ধরি'' পণে দ্যূত-ক্রীডা সমাপনে
আমি জয়ী আমি জয়ী বলি''
করিবে কলহ তবেহর-সঙ্গ্রহেতে কবে
আমি তাহা দেখিব সকলি',
    E'duńhe
hāra dhori'' paṇe dyūta-krīḍā samāpane
āmi
jayī āmi jayī boli''
koribe
kalaha tabehara-sańgrahete kabe
āmi
tāhā dekhibo sakali', E'дуńхе
ха̄ра дгорі'' пан̣е дйӯта-крı̄д̣а̄ сама̄пане
а̄мі
джайı̄ а̄мі джайı̄ болі''
корібе
калаха табехара-саńґрахете кабе
а̄мі
та̄ха̄ декхібо сакалі',
    E'', E'',
    E'During another pastime, You Both place a wager on a necklace and being gambling
over it, placing different kinds of bets with the rolling of dice. When the
game is over, each of You separately exclaims, I win! I win! Then there is a
big quarrel as You Both struggle together, each attempting to collect the
necklace at stake. When will I ever be able to witness all of these wonderful
sports?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '37',
    E'আহা কবে দুই জনে কুঞ্জ-মাঝে সু-সয়নে
কুসুম-শয়্যায় বিরামিবে
সে সময়ে দুঁহু পদ সম্বহন-সুসম্পদ
এ দাসীর সৌভাগ্য মিলিবে', E'আহা কবে দুই জনে কুঞ্জ-মাঝে সু-সয়নে
কুসুম-শয়্যায় বিরামিবে
সে সময়ে দুঁহু পদ সম্বহন-সুসম্পদ
এ দাসীর সৌভাগ্য মিলিবে',
    E'āhā
kabe dui jane kuñja-mājhe su-sayane
kusuma-śayyāya
birāmibe
se
samaye duńhu pada sambahana-susampada
e
dāsīra saubhāgya milibe', E'а̄ха̄
кабе дуі джане кун̃джа-ма̄джхе су-сайане
кусума-ш́аййа̄йа
біра̄мібе
се
самайе дуńху пада самбахана-сусампада
е
да̄сı̄ра саубга̄ґйа мілібе',
    E'', E'',
    E'Oh, when will I behold You two Divine Personalities reclining and lounging
leisurely upon a beautiful bed of flowers within a forest grove? Taking the
opportunity at that time, I will massage the most auspicious treasure of Your
lotus feet, and in this way shall this maidservant meet with her good fortune.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '38',
    E'কন্দর্প-কলহোদ্গারে ছিণ্ডিবে কণ্ঠের হারে
লতা-গৃহে পড়িবে খাসিয়া
সে হার গান্থিতে কবে এ দাসী নিজুক্ত হ''বে
দুঁহু কৃপা-আজ্ঞা শিরে পাঞা', E'কন্দর্প-কলহোদ্গারে ছিণ্ডিবে কণ্ঠের হারে
লতা-গৃহে পড়িবে খাসিয়া
সে হার গান্থিতে কবে এ দাসী নিজুক্ত হ''বে
দুঁহু কৃপা-আজ্ঞা শিরে পাঞা',
    E'kandarpa-kalahodgāre
chiṇḍibe kaṇṭhera hāre
latā-gṛhe
paḍibe khāsiyā
se
hāra gānthite kabe e dāsī nijukta ha''be
duńhu
kṛpā-ājñā śire pāñā', E'кандарпа-калаходґа̄ре
чхін̣д̣ібе кан̣т̣хера ха̄ре
лата̄-ґр̣хе
пад̣ібе кха̄сійа̄
се
ха̄ра ґа̄нтхіте кабе е да̄сı̄ ніджукта ха''бе
дуńху
кр̣па̄-а̄джн̃а̄ ш́іре па̄н̃а̄',
    E'', E'',
    E'Sometimes, during the struggle of contending with Cupid, one of Your necklaces
accidentally becomes broken, and the pieces fall and scatter all over the
creeper-shaded bower. When will this maidservant take Your merciful order upon
her head, and be appointed to re-string that very same necklace?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '39',
    E'কেলি-কল্লোলের জবে দুঁহু কেস স্রস্ত হবে
দুই-জনর ইঙ্গিত পাইয়া
শিখি-পিঞ্ছ করে ধরি'' কুন্তল-মধিত করি''
আমি রব আনন্দে ডুবিয়া', E'কেলি-কল্লোলের জবে দুঁহু কেস স্রস্ত হবে
দুই-জনর ইঙ্গিত পাইয়া
শিখি-পিঞ্ছ করে ধরি'' কুন্তল-মধিত করি''
আমি রব আনন্দে ডুবিয়া',
    E'keli-kallolera
jabe duńhu kesa srasta habe
dui-janara
ińgita pāiyā
śikhi-piñcha
kore dhori'' kuntala-madhita kori''
āmi
rabo ānande ḍubiyā', E'келі-каллолера
джабе дуńху кеса сраста хабе
дуі-джанара
іńґіта па̄ійа̄
ш́ікхі-пін̃чха
коре дгорі'' кунтала-мадгіта корі''
а̄мі
рабо а̄нанде д̣убійа̄',
    E'', E'',
    E'Sometimes, due to the restless sporting of Your amorous games, Your hair will
fall loose. Heeding Your gesture towards me, I will then com Your hair with a
peacock tail comb and thus redecorate Your lovely tresses. In this way I
will remain submerged and drowned in pure ecstasy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '40',
    E'কন্দর্প-ক্রীডায় জবে দুঁহু স্রক স্রস্ত হ''বে
তবে আমি দুঁহু আজ্ঞা পাঞা
উভয় ললাট-মাঝে করিব তিলক-সাজে
মত্ত হ''বে সে শোভা দেখিয়া', E'কন্দর্প-ক্রীডায় জবে দুঁহু স্রক স্রস্ত হ''বে
তবে আমি দুঁহু আজ্ঞা পাঞা
উভয় ললাট-মাঝে করিব তিলক-সাজে
মত্ত হ''বে সে শোভা দেখিয়া',
    E'kandarpa-krīḍāya
jabe duńhu srak srasta ha''be
tabe
āmi duńhu ājñā pāñā
ubhaya
lalāṭa-mājhe koribo tilaka-sāje
matta
ha''be se śobhā dekhiyā', E'кандарпа-крı̄д̣а̄йа
джабе дуńху срак сраста ха''бе
табе
а̄мі дуńху а̄джн̃а̄ па̄н̃а̄
убгайа
лала̄т̣а-ма̄джхе корібо тілака-са̄дже
матта
ха''бе се ш́обга̄ декхійа̄',
    E'', E'',
    E'Sometimes, due to being jostled about during Cupid''s amorous games, Your flower
garlands, necklaces, earrings, crowns and other decorations may become ruffled
and disarrayed out of place. At that time, upon receiving Your order, I will
rearrange all those scattered ornaments, and then redecorate Your foreheads
with fresh tilaka. Thus I will go mad just seeing Your splendors beauty.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '41',
    E'কৃষ্ণ তব বখে আমি বন-মল দিয়া স্বামী
রাধে তব নয়নে কজ্জল
কুঞ্জ-মাঝে কোন দিন পা''ব সুখ সমীচীন
প্রেমে চিত্ত হ''বে টলমল', E'কৃষ্ণ তব বখে আমি বন-মল দিয়া স্বামী
রাধে তব নয়নে কজ্জল
কুঞ্জ-মাঝে কোন দিন পা''ব সুখ সমীচীন
প্রেমে চিত্ত হ''বে টলমল',
    E'kṛṣṇa
taba bakhe āmi bana-mala diyā swāmī
rādhe
taba nayane kajjala
kuñja-mājhe
kona dina pā''bo sukha samīcīna
preme
citta ha''be ṭalamala', E'кр̣шн̣а
таба бакхе а̄мі бана-мала дійа̄ сва̄мı̄
ра̄дге
таба найане каджджала
кун̃джа-ма̄джхе
кона діна па̄''бо сукха самı̄чı̄на
преме
чітта ха''бе т̣аламала',
    E'', E'',
    E'Oh! I will get enough happiness to satisfy my longings when I am placing a
garland of fresh forest flowers upon Your chest! Oh Radhe! And likewise when I
am re-applying black mascara around Your lotus eyes! When will that day be mine
when I can render such services within a bower in Vrndavana? Then my heart will
throb in ecstatic love for You Both.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '42',
    E'কবে জাম্বুনদ-বর্ণ লৈয়া তাম্বূল-পর্ণ
শিরা শূন্য কর্পূরাদি-জুত
বীটিক নির্মাণ করি'' দুঁহু মুখে দিব ধরি''
প্রেমে চিত্ত হ''বে পরিপ্লুত', E'কবে জাম্বুনদ-বর্ণ লৈয়া তাম্বূল-পর্ণ
শিরা শূন্য কর্পূরাদি-জুত
বীটিক নির্মাণ করি'' দুঁহু মুখে দিব ধরি''
প্রেমে চিত্ত হ''বে পরিপ্লুত',
    E'kabe
jāmbunada-barṇa loiyā tāmbūla-parṇa
śirā
śūnya karpūrādi-juta
bīṭika
nirmāṇa kori'' duńhu mukhe dibo dhori''
preme
citta ha''be paripluta', E'кабе
джа̄мбунада-барн̣а лоійа̄ та̄мбӯла-парн̣а
ш́іра̄
ш́ӯнйа карпӯра̄ді-джута
бı̄т̣іка
нірма̄н̣а корі'' дуńху мукхе дібо дгорі''
преме
чітта ха''бе паріплута',
    E'', E'',
    E'When can I make first-class pan for You Both to chew? Picking fresh cold- betel
leaves, I will remove the stems and add fragrant spices and camphor, Then,
rolling the leaves into a cone shape and thus making it nice, I will take them
and place them in Your lotus mouths. At that moment my heart will become
flooded and saturated with ecstatic love for You.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '43',
    E'কোথা এ দুরাশা মোর কোথা এ দুষ্কর্ম ঘোর
এ প্রার্থনা যদি বল ক্যানো
হে রাধে হে ঘন-শ্যামদুঁহু জন-গুণ-গ্রাম
মাধুরী বলায় মোরে হেন', E'কোথা এ দুরাশা মোর কোথা এ দুষ্কর্ম ঘোর
এ প্রার্থনা যদি বল ক্যানো
হে রাধে হে ঘন-শ্যামদুঁহু জন-গুণ-গ্রাম
মাধুরী বলায় মোরে হেন',
    E'kothā
e durāśā mora kothā e duṣkarma ghora
e
prārthanā jodi bolo keno
he
rādhe he ghana-śyāmaduńhu jana-guṇa-grāma
mādhurī
bolāya more heno', E'котха̄
е дура̄ш́а̄ мора котха̄ е душкарма ґгора
е
пра̄ртхана̄ джоді боло кено
хе
ра̄дге хе ґгана-ш́йа̄мадуńху джана-ґун̣а-ґра̄ма
ма̄дгурı̄
бола̄йа море хено',
    E'', E'',
    E'Why am I revealing such far-off, impossible dreams in these prayers when i am
in reality so deeply sunk into the dark well of sinful materialistic
activities? Oh Radhe! Oh Ghanasyama! Your own maddening sweetness is actually
making me speak all these things about Your transcendentally glorious
qualities!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '44',
    E'দুঁহার জে কৃপা-গুণে পাইনু ধাম-বৃন্দাবনে
সে কৃপা অভীষ্ট-পূরণ
করুণ আমায় নাথপাঞা তুনু সখী-সাঠ
কুঞ্জ-সেবা পাই অনুক্ষণ', E'দুঁহার জে কৃপা-গুণে পাইনু ধাম-বৃন্দাবনে
সে কৃপা অভীষ্ট-পূরণ
করুণ আমায় নাথপাঞা তুনু সখী-সাঠ
কুঞ্জ-সেবা পাই অনুক্ষণ',
    E'duńhāra
je kṛpā-guṇe pāinu
dhāma-bṛndābane
se
kṛpā abhīṣṭa-pūraṇa
koruṇa
āmāya nāthapāñā tunu sakhī-sāṭha
kuñja-sebā
pāi anukṣaṇa', E'дуńха̄ра
дже кр̣па̄-ґун̣е па̄іну
дга̄ма-бр̣нда̄бане
се
кр̣па̄ абгı̄шт̣а-пӯран̣а
корун̣а
а̄ма̄йа на̄тхапа̄н̃а̄ туну сакхı̄-са̄т̣ха
кун̃джа-себа̄
па̄і анукшан̣а',
    E'', E'',
    E'By Your supreme transcendental quality of mercy I have attained residence in
the spiritual abode of Sri Vrndavana, and this mercy has fulfilled all of my
most cherished longings. Oh Lord! Now please let me have eternal service in
Your pleasure-gardens in the company of Your most beloved girlfriends and
maidservants!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '45',
    E'ওহে রাধে ওহে কৃষ্ণ সেই ব্রজ-রস-তৃষ্ণ
কার্পণ্য-পঞ্জিকা-কথা-ছলে
জল্পন করয়ে সদা তা''র বাঞ্ছা-পূর্তি তদা
করুন দুঁহু কৃপা-বলে', E'ওহে রাধে ওহে কৃষ্ণ সেই ব্রজ-রস-তৃষ্ণ
কার্পণ্য-পঞ্জিকা-কথা-ছলে
জল্পন করয়ে সদা তা''র বাঞ্ছা-পূর্তি তদা
করুন দুঁহু কৃপা-বলে',
    E'ohe
rādhe ohe kṛṣṇa sei braja-rasa-tṛṣṇa
kārpaṇya-pañjikā-kathā-chale
jalpana
koroye sadā tā''ra bāñchā-pūrti tadā
koruna
duńhu kṛpā-bale', E'охе
ра̄дге охе кр̣шн̣а сеі браджа-раса-тр̣шн̣а
ка̄рпан̣йа-пан̃джіка̄-катха̄-чхале
джалпана
коройе сада̄ та̄''ра ба̄н̃чха̄-пӯрті тада̄
коруна
дуńху кр̣па̄-бале',
    E'', E'',
    E'Oh Radhe! Oh Krsna! On the plea of narrating this diary of my greedy, selfish
desires for Your humble service (karpanya-panjika), I have thus revealed my
incredible thirst for all these liquid mellows of Vraja. All of these thirsty
longings are just bottled up inside my heart, and I am incessantly cherishing
the constant churning of these hopes within my mind. Please, I beg You Both,
please therefore fulfill all these spiritual desires for Your service. I am
appealing to You now on the strength of Your own causeless mercy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Verse 46
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '46',
    E'শ্রী-রূপ-মঞ্জরী-পদ শিরে ধরি'' সু-সম্পদ
কমল-মঞ্জরী করে আশা
শ্রী-গোদ্রুম-ব্রজ-বনে দুঁহু লীলা-সন্দর্শনে
পূর্ণ হও রসের পিপাসা', E'শ্রী-রূপ-মঞ্জরী-পদ শিরে ধরি'' সু-সম্পদ
কমল-মঞ্জরী করে আশা
শ্রী-গোদ্রুম-ব্রজ-বনে দুঁহু লীলা-সন্দর্শনে
পূর্ণ হও রসের পিপাসা',
    E'śrī-rūpa-mañjarī-pada
śire dhori'' su-sampada
kamala-mañjarī
kore āśā
śrī-godruma-braja-bane
duńhu līlā-sandarśane
pūrṇa
hao rasera pipāsā', E'ш́рı̄-рӯпа-ман̃джарı̄-пада
ш́іре дгорі'' су-сампада
камала-ман̃джарı̄
коре а̄ш́а̄
ш́рı̄-ґодрума-браджа-бане
дуńху лı̄ла̄-сандарш́ане
пӯрн̣а
хао расера піпа̄са̄',
    E'', E'',
    E'Holding upon her head her most treasured possession (the lotus feet of Sri Rupa
Manjari), this Kamala Manjari hopes that by thus observing Their eternal
pastimes going on within this transcendental forest of Vraja at Godruma,
Navadvipa, then her craving thirst for such mellows will finally be quenched.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 1: Pradosa Samaye
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Pradosa Samaye', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'pradoṣa-samaye śrībāsa-ańgane
sańgopane gorā-maṇi
śrī-hari-kīrtane nāce nānā-rańge
uṭhilo mańgala-dhwani', E'прадоша-самайе ш́рı̄ба̄са-аńґане
саńґопане ґора̄-ман̣і
ш́рı̄-харі-кı̄ртане на̄че на̄на̄-раńґе
ут̣хіло маńґала-дгвані',
    E'', E'',
    E'In the evening twilight,
within the privacy of Srivasa Pandita''s
courtyard, the cream-lustered jewel, Lord Gauramani, raised a most auspicious vibration by His
chanting of Hari-kirtana, which He personally
accompanied by dancing in various playful moods.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'mṛdańga
mādala
bāje karatāla
mājhe mājhe jayatura
prabhura naṭana
dekhi'' sakalera
hoilo santāpa dūra', E'мр̣даńґа
ма̄дала
ба̄дже карата̄ла
ма̄джхе ма̄джхе джайатура
прабгура нат̣ана
декхі'' сакалера
хоіло санта̄па дӯра',
    E'', E'',
    E'Accompanied by the
paying of the mrdanga drum and karatalas,
and amidst occasional victorious shouts of "Jaya!
Jaya! the dramatic dance of the Lord dispelled the
grief of all those who witnessed it.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'akhaṇda premete mātala takhana
sakala bhakata-gaṇa
āpana pāsari'' gorācande gheri''
nāce gāya anukhaṇa', E'акхан̣да премете ма̄тала такхана
сакала бгаката-ґан̣а
а̄пана па̄сарі'' ґора̄чанде ґгері''
на̄че ґа̄йа анукхан̣а',
    E'', E'',
    E'Then, becoming madly
intoxicated in supreme ecstatic love, all the assembled devotees completely
forgot themselves and incessantly began to dance and chant wildly, surrounding
Lord Gauracandra.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'emona samaye daiba-byādhi-joge
śrībāsera antaḥ-pure
tanaya-bijoge nārī-gaṇa
śoke
prokāśalo
uccaiḥ-sware', E'емона самайе даіба-бйа̄дгі-джоґе
ш́рı̄ба̄сера антах̣-пуре
танайа-біджоґе на̄рı̄-ґан̣а
ш́оке
прока̄ш́ало
уччаіх̣-сваре',
    E'', E'',
    E'At this time, within the
inner chamber of Srivasa''s house, one of his sons
suddenly died due to some disease, as ordained by the will of Providence. Due
to separation from the boy, all the women of the household began to lament and
cry out in a loud voice.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'krandana uṭhile
habe rasa-bhańga
bhakatibinoda ḍare
śrībāsa amani bujhilo kāraṇa
paśilo āpana ghare', E'крандана ут̣хіле
хабе раса-бгаńґа
бгакатібінода д̣аре
ш́рı̄ба̄са амані буджхіло ка̄ран̣а
паш́іло а̄пана ґгаре',
    E'', E'',
    E'Now Bhaktivinoda
fears that the transcendental mellows of the Lord''s kirtana
will be disturbed by the uprising of such loud crying sounds. However, Srivasa Pandita has now
understood the cause of this sound, and has personally entered the house.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 2: Pravesiya Antah Pure
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Pravesiya Antah Pure', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'prabeśiyā antaḥ-pure nārī-gaṇe
śānta kore
śrībāsa āmiyā upadeśe
śuno pāgalinī-gaṇa śoka koro akāraṇa
kibā duḥkha thāke kṛṣṇābeśe', E'прабеш́ійа̄ антах̣-пуре на̄рı̄-ґан̣е
ш́а̄нта коре
ш́рı̄ба̄са а̄мійа̄ упадеш́е
ш́уно па̄ґалінı̄-ґан̣а ш́ока коро ака̄ран̣а
кіба̄ дух̣кха тха̄ке кр̣шн̣а̄беш́е',
    E'', E'',
    E'Entering into the inner chamber, Srivasa began to
pacify all of the women there by giving them spiritual instructions that were
as sweet as nectar. He said, "Look here, you crazy ladies, you all lament
uselessly, for what kind of unhappiness can there possibly be in ecstatic love
for Krsna?"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'kṛṣṇa nitya suta
jāra
śoka kabhu nāhi tāra
anitya āsakti sarba-nāśa
asiyācho e soḿsāre kṛṣṇa
bhajībara tāre
nitya-tattwe koroho bilāsa', E'кр̣шн̣а нітйа сута
джа̄ра
ш́ока кабгу на̄хі та̄ра
анітйа а̄сакті сарба-на̄ш́а
асійа̄чхо е соḿса̄ре кр̣шн̣а
бгаджı̄бара та̄ре
нітйа-таттве корохо біла̄са',
    E'', E'',
    E'"Whoever has Krsna for his eternal Son never has
to lament for anything, although if one becomes attached to that which is
temporary, then everything is lost. You have all come into this material world
for the purpose of worshiping Krsna, so now you
should all becomes situated again in the eternal absolute truth.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'e dehe jabata sthiti koro kṛṣṇacandre rati
kṛṣṇa jāno dhana jana prāṇa
e-deho-anuga jata bhāi bandhu pati suta
anitya sambanda boli'' mano', E'е дехе джабата стхіті коро кр̣шн̣ачандре раті
кр̣шн̣а джа̄но дгана джана пра̄н̣а
е-дехо-ануґа джата бга̄і бандгу паті сута
анітйа самбанда болі'' мано',
    E'', E'',
    E'"As long as you are existing in this body, you
should all cultivate love and attachment for Lord Krsna,
knowing Him to be your real wealth, real friend and your very life and soul.
All of the followers of this body namely brothers,
friends, husbands and sons should be accepted as being only temporary
relationships.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'kebā kāra pati suta anitya-sambandha-kṛta
cāhile rākhite nāre tāre
karama-bipaka-phale suta ho''ye baise
kole
karma-khaya āra raite nāre', E'кеба̄ ка̄ра паті сута анітйа-самбандга-кр̣та
ча̄хіле ра̄кхіте на̄ре та̄ре
карама-біпака-пхале сута хо''йе баісе
коле
карма-кхайа а̄ра раіте на̄ре',
    E'', E'',
    E'"Whoever wants to hold onto husbands or sons will not be able to keep
them, for all these relationships are only temporary. Even if your son is
sitting in your very lap, you still cannot protect him, for when his bad fruitive reactions fructify, then his present karma is
finished, and he will not be able to remain here any longer."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'ithe sukha duḥkha
māni''
adho-gati labhe prāṇī
kṛṣṇa-pada hoite paḍe
dūre
śoka sambariyā ebe nāmānanda māja'' sabe
bhakatibinoda-bāñchā pūre', E'ітхе сукха дух̣кха
ма̄ні''
адго-ґаті лабге пра̄н̣ı̄
кр̣шн̣а-пада хоіте пад̣е
дӯре
ш́ока самбарійа̄ ебе на̄ма̄нанда ма̄джа'' сабе
бгакатібінода-ба̄н̃чха̄ пӯре',
    E'', E'',
    E'"By accepting this type of temporary happiness and distress, many other
living entities are now being degraded into lower species of life, falling far,
far away from Krsna''s lotus feet. Therefore you
should all give up your temporary lamentation right now,
and just become absorbed in the bliss of the Lord''s holy names." All of Bhaktivinoda''s desires are now being fulfilled by hearing Srivasa speak such nice eternal truths.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 3: Dhana Jana Deha Geha
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Dhana Jana Deha Geha', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'dhana jana deha geha
kṛṣṇe samarpaṇa
koriyācho śuddha-citte koroho smaraṇa', E'дгана джана деха ґеха
кр̣шн̣е самарпан̣а
корійа̄чхо ш́уддга-чітте корохо смаран̣а',
    E'', E'',
    E'"Offering all of
your wealth, relatives, body and entire household unto Krsna
in dedication, just remember Him always with a purified heart."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'tabe keno
mama suta boli'' koro duḥkha
kṛṣṇa nilo nija-jana tāhe tāra sukha', E'табе кено
мама сута болі'' коро дух̣кха
кр̣шн̣а ніло ніджа-джана та̄хе та̄ра сукха',
    E'', E'',
    E'"So then why are
you exclaiming, `my son, my son!'' in great sadness? Krsna
has simply taken His own devotee, just to suit His own happiness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'kṛṣṇa-icchā-mate saba ghaṭaya ghaṭanā
tāhe sukha-duḥkha-jñāna abidyā-kalpanā', E'кр̣шн̣а-іччха̄-мате саба ґгат̣айа ґгат̣ана̄
та̄хе сукха-дух̣кха-джн̃а̄на абідйа̄-калпана̄',
    E'', E'',
    E'"Krsna is causing all things to take place just according to
His own sweet will. In light of that, all your ideas of happiness and distress
are simply ignorant mental concoctions.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'jāhā icchā kore kṛṣṇa tāi jāno bhāla
tyajiyā āpana icchā ghucāo jañjāla', E'джа̄ха̄ іччха̄ коре кр̣шн̣а та̄і джа̄но бга̄ла
тйаджійа̄ а̄пана іччха̄ ґгуча̄о джан̃джа̄ла',
    E'', E'',
    E'"Whatever Krsna''s desire is, you must accept only that as actually
good. Renouncing all of your separate personal desires, relieve yourselves of
this unnecessary botheration."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'deya kṛṣṇa neya kṛṣṇa pāle
kṛṣṇa sabe
rākhe kṛṣṇa māre
kṛṣṇa icchā
kore jabe', E'дейа кр̣шн̣а нейа кр̣шн̣а па̄ле
кр̣шн̣а сабе
ра̄кхе кр̣шн̣а ма̄ре
кр̣шн̣а іччха̄
коре джабе',
    E'', E'',
    E'"Krsna gives you everything, Krsna
takes everything away, Krsna maintains everyone or
kills everyone whenever He likes, according to His own sweet will.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'kṛṣṇa-icchā biparīta je kore bāsanā
tāra icchā nāhi phale se pāya jātanā', E'кр̣шн̣а-іччха̄ біпарı̄та дже коре ба̄сана̄
та̄ра іччха̄ на̄хі пхале се па̄йа джа̄тана̄',
    E'', E'',
    E'"If someone
maintains some desire that is contrary to Krsna''s
desire, then her wish does not become fruitful. Indeed, she only gets trouble
and anguish."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'tyajiyā sakala śoka śuno kṛṣṇa-nāma
parama ānanda pabe pūrṇa habe kāma', E'тйаджійа̄ сакала ш́ока ш́уно кр̣шн̣а-на̄ма
парама а̄нанда пабе пӯрн̣а хабе ка̄ма',
    E'', E'',
    E'"Therefore,
rejecting all of your lamentation, just listen to the chanting of Krsna''s holy name which is going on now out in the
courtyard. From this you will get the topmost transcendental bliss, and all of
your desires will be fulfilled."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'bhakatibinoda māge śrībāsa-caraṇe
ātma-nibedana-śakti jībane maraṇe', E'бгакатібінода ма̄ґе ш́рı̄ба̄са-чаран̣е
а̄тма-нібедана-ш́акті джı̄бане маран̣е',
    E'', E'',
    E'Thus Bhaktivinoda
begs at Srivasa Pandita''s
lotus feet for the power to completely surrender his soul to Krsna in life or in death.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 4: Sabu Meli Balaka Bhaga
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Sabu Meli Balaka Bhaga', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'sabu meli'' bālaka-bhāga
bicāri''
choḍabi moha śoka
citta-bikārī', E'сабу мелі'' ба̄лака-бга̄ґа
біча̄рі''
чход̣абі моха ш́ока
чітта-біка̄рı̄',
    E'', E'',
    E'Srivasa continued, All of you together should
consider the real fate of the boy, and you should immediately discontinue any
bewilderment and grief that may be in your disturbed hearts."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'caudda-bhubana-pati
nanda-kumāra
śacī-nandana bhelo nadīyā-abatāra', E'чаудда-бгубана-паті
нанда-кума̄ра
ш́ачı̄-нандана бгело надı̄йа̄-абата̄ра',
    E'', E'',
    E'"The Supreme Lord of all the fourteen worlds is the youthful Son of Nanda Maharaja, and now He has become the Son of Mother Saci by personally descending in Nadia."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'sohiu gokula-cānda ańgane mora
nācāi bhakta-saha ānanda-bibhora', E'сохіу ґокула-ча̄нда аńґане мора
на̄ча̄і бгакта-саха а̄нанда-бібгора',
    E'', E'',
    E'"This
very same Gokula-canda is now dancing in my courtyard
with His most confidential devotees, all completely overwhelmed with ecstatic
bliss."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'śunata nāma-gaṇa bālaka mora
choḍalo deha hari-prīti-bibhora', E'ш́уната на̄ма-ґан̣а ба̄лака мора
чход̣ало деха харі-прı̄ті-бібгора',
    E'', E'',
    E'"My boy has given up his body while hearing the singing of the Lord''s holy
names coming from the kirtana out in the courtyard.
Therefore he certainly has died while overwhelmed with love for the Lord."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'aichana bhāga jaba bhai hāmārā
tabahuń hau bhāba-sāgara-pārā', E'аічхана бга̄ґа джаба бгаі ха̄ма̄ра̄
табахуń хау бга̄ба-са̄ґара-па̄ра̄',
    E'', E'',
    E'"If I would be so fortunate as to get such an auspicious death as this,
them I will certainly be able to easily cross over the ocean of material
existence."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'tuńhu sabu bichari
ehi bicārā
kāńhe korobi śoka citta-bikārā', E'туńху сабу бічхарі
ехі біча̄ра̄
ка̄ńхе коробі ш́ока чітта-біка̄ра̄',
    E'', E'',
    E'"All of you together just consider this one judgment ... what will your
lamentation and disturbed hearts do to help the situation?"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'sthira nāhi haobi jadi upadeśe
bañcita haobi rase abaśeṣe', E'стхіра на̄хі хаобі джаді упадеш́е
бан̃чіта хаобі расе абаш́еше',
    E'', E'',
    E'"If you all do not become pacified by these instructions, then you will
only cheat yourselves out of tasting transcendentally ecstatic mellows in the
long run.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'paśibuń hama suratatinī-māhe
bhakatibinoda
pramāda dekhe tāhe', E'паш́ібуń хама сурататінı̄-ма̄хе
бгакатібінода
прама̄да декхе та̄хе',
    E'', E'',
    E'"Not only will you cheat yourself, but you will induce me to leave this
world by plunging myself into the waters of Ganga." Thus Bhaktivinoda
is witnessing this entire calamity in progress.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 5: Srivasa Vacana Sravana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Srivasa Vacana Sravana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'śrībāsa-bacana śrabaṇa koriyā
sādhwī pati-brata-gaṇa
śoka parihari'' mṛta śiśu rākhi''
hari-rase dilo mana', E'ш́рı̄ба̄са-бачана ш́рабан̣а корійа̄
са̄дгвı̄ паті-брата-ґан̣а
ш́ока паріхарі'' мр̣та ш́іш́у ра̄кхі''
харі-расе діло мана',
    E'', E'',
    E'Hearing these words of Srivasa Pandita,
all those chaste and faithful ladies gave up their lamentation for the dead
son, because Srivasa had satisfied their minds by
informing them of the transcendental mellows of Lord Hari.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'śrībāsa takhana ānande
mātiyā
ańgane ailo punaḥ
nāce gorā-sane sakala pāsari''
gāya nanda-suta-guṇa', E'ш́рı̄ба̄са такхана а̄нанде
ма̄тійа̄
аńґане аіло пунах̣
на̄че ґора̄-сане сакала па̄сарі''
ґа̄йа нанда-сута-ґун̣а',
    E'', E'',
    E'Then Srivasa again came out into the courtyard and,
overwhelmed with joy, resumed dancing with Lord Caitanya
and loudly sang the glories of the Son of Nanda
Maharaja, completely forgetting about what had just happened.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'cāri daṇḍa rātre mārilo kumāra
ańgane keho nā jāne
śrī-nāma-mańgale tṛtīya prahara
rajanī atīta gāne', E'ча̄рі дан̣д̣а ра̄тре ма̄ріло кума̄ра
аńґане кехо на̄ джа̄не
ш́рı̄-на̄ма-маńґале тр̣тı̄йа прахара
раджанı̄ атı̄та ґа̄не',
    E'', E'',
    E'The boy had expired only 1  ½ hours after dark, but out in the courtyard no
one had known anything due to the loud kirtana. Then
for 9 hours there was continuous chanting of the auspicious holy names. Thus
the entire night had elapsed in this ecstatic singing.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'kīrtana bhańgile
kohe gaura-hari
āji keno pāi duḥkha
bujhi ei gṛhe kichu amańgala
ghaṭiyā
harilo sukha', E'кı̄ртана бгаńґіле
кохе ґаура-харі
а̄джі кено па̄і дух̣кха
буджхі еі ґр̣хе кічху амаńґала
ґгат̣ійа̄
харіло сукха',
    E'', E'',
    E'Then the kirtana stopped, and Lord Gaurahari said, "Why am I feeling some unhappiness
today? I can understand that something inauspicious has happened in this house
which has robbed Me of My bliss."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'tabe bhakta-jana nibedana kore
śrībāsa-śiśura kathā
śuni'' gorā rāya bole hāya
hāya
marame pāinu byathā', E'табе бгакта-джана нібедана коре
ш́рı̄ба̄са-ш́іш́ура катха̄
ш́уні'' ґора̄ ра̄йа боле ха̄йа
ха̄йа
мараме па̄іну бйатха̄',
    E'', E'',
    E'Then the devotees related to the Lord the story of the death of Srivasa''s son. Hearing this news, the Lord loudly
exclaimed, "Oh no! What has happened? Now the core of My
heart has become pierced with so much unbearable pain!"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'keno nā kohile āmāre takhana
bipada-sambada sabe
bhakatibinoda bhakata-batsala
snehete mājilo tabe', E'кено на̄ кохіле а̄ма̄ре такхана
біпада-самбада сабе
бгакатібінода бгаката-батсала
снехете ма̄джіло табе',
    E'', E'',
    E'"Why didn''t you inform Me of this calamity when
it had just happened?" Now, Bhaktivinoda has
completely lost himself in the affection that he Lords shows to His own
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


  -- Section 3, Song 6: Prabhur Vacana Takha Suniya
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Prabhur Vacana Takha Suniya', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'prabhura bacana takhana śuniyā
śrībāsa loṭāñā bhūmi
bole śuno nātha taba rasa-bhańga
sahite nā pāri āmi', E'прабгура бачана такхана ш́унійа̄
ш́рı̄ба̄са лот̣а̄н̃а̄ бгӯмі
боле ш́уно на̄тха таба раса-бгаńґа
сахіте на̄ па̄рі а̄мі',
    E'', E'',
    E'Then, hearing these words of the Lord, Srivasa Pandita began rolling on the ground, crying out,
"Please hear me, oh Lord! I am simply not able to tolerate any disturbance
or interruption of the ecstatic mellows of Your kirtana!"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'ekaṭi tanaya mariyāche nātha
tāhe mora kiba duḥkha
jadi saba mare tomāre heriyā
tabu to'' pāibo sukha', E'екат̣і танайа марійа̄чхе на̄тха
та̄хе мора кіба дух̣кха
джаді саба маре тома̄ре херійа̄
табу то'' па̄ібо сукха',
    E'', E'',
    E'"Only one of my sons has died, oh Lord, and has that really made me upset?
Even if all of my sons die, then I will certainly get more than enough
happiness by seeing You."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'taba nṛtya-bhańga hoile āmāra
maraṇa hoite hari
tāi ku-sambāda nā dilo tomāre
bipada āśańkā kori''', E'таба нр̣тйа-бгаńґа хоіле а̄ма̄ра
маран̣а хоіте харі
та̄і ку-самба̄да на̄ діло тома̄ре
біпада а̄ш́аńка̄ корі''',
    E'', E'',
    E'"I would certainly die on the spot if I were to interrupt Your dancing, oh Lord. That is why I did not inform You of this bad news. For I was dreading the calamity of
disturbing Your ecstasy."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'ebe ājñā deho mṛta suta lo''ye
satkāra
koruna sabe
eteka śuniyā
gorā dwija-maṇi
kāndite lagilo tabe', E'ебе а̄джн̃а̄ дехо мр̣та сута ло''йе
сатка̄ра
коруна сабе
етека ш́унійа̄
ґора̄ двіджа-ман̣і
ка̄ндіте лаґіло табе',
    E'', E'',
    E'"Lord, if You will kindly grant us Your
permission now, then we shall all take the boy''s body and perform the proper
funeral rites." Hearing this much from the mouth of Srivasa
Pandita, the jewel of the twice-born, Lord Gaurasundara, then broke down and began to weep piteously
on the spot.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'kemone e saba chāḍiyā jāibo
paraṇa bikala hoya
se kathā śuniyā
bhakatibinoda
manete pāilo bhoya', E'кемоне е саба чха̄д̣ійа̄ джа̄ібо
паран̣а бікала хойа
се катха̄ ш́унійа̄
бгакатібінода
манете па̄іло бгойа',
    E'', E'',
    E'Crying and crying, the Lord thought within Himself, "How could I possibly
abandon such loving servitors and go elsewhere by taking sannyasa?
If I were to do so, my heart would certainly split." Hearing
this type of talk, Bhaktivinoda''s mind become
somewhat fearful.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 7: Gora Candera Ajna Peye
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Gora Candera Ajna Peye', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'gorācandera ajña peye gṛha-bāsi-gaṇa
mṛta suta ańganete āna tata-khaṇa', E'ґора̄чандера аджн̃а пейе ґр̣ха-ба̄сі-ґан̣а
мр̣та сута аńґанете а̄на тата-кхан̣а',
    E'', E'',
    E'Then the Lord ordered
the household members to bring the boy''s body out into the courtyard, and they
immediately complied.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'kali-mala-hari gorā jijñāse takhana
śrībāse chāḍiyā śiśu
jāo ki kāraṇa', E'калі-мала-харі ґора̄ джіджн̃а̄се такхана
ш́рı̄ба̄се чха̄д̣ійа̄ ш́іш́у
джа̄о кі ка̄ран̣а',
    E'', E'',
    E'Then the merciful Lord Gaura, Who removes the gloomy, dirty influence of the age
of Kali, began to question the body by saying, "Please tell Me, my dear boy, whatever prompted you to leave here so
suddenly, thus giving up your loving father Srivasa Pandita?"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'mṛta-śiśu-mukhe jība kore nibedana
loka-śikha lāgi prabhu taba ācaraṇa', E'мр̣та-ш́іш́у-мукхе джı̄ба коре нібедана
лока-ш́ікха ла̄ґі прабгу таба а̄чаран̣а',
    E'', E'',
    E'Being thus questioned by
the Lord, the soul again manifested in the dead body by the mercy of the Lord,
and he began to offer very nice prayers which were meant to be instructive to
all persons.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'tumi to'' parama-tattwa ananta adwaya
para śakti tomāra abhinna tattwa hoya', E'тумі то'' парама-таттва ананта адвайа
пара ш́акті тома̄ра абгінна таттва хойа',
    E'', E'',
    E'The dead boy said,
" My dear Lord, You are without a doubt the Supreme Absolute Truth,
unlimited and one without a second. Since You are the
Supremely energetic, all of Your transcendental energies are certainly
non-different from You."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'sei parā śakti tridhā hoiyā prokāśa
taba icchā-mata koraya tomāra bilāsa', E'сеі пара̄ ш́акті трідга̄ хоійа̄ прока̄ш́а
таба іччха̄-мата корайа тома̄ра біла̄са',
    E'', E'',
    E'"This
transcendental potency of Your manifests itself in
three different ways, and it assists in the performance of Your eternal
pastimes in different ways according to Your own sweet will."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'cic-chakti-swarūpe nitya-līlā prokāśiyā
tomāre ānanda dena hlādinī hoiyā', E'чіч-чхакті-сварӯпе нітйа-лı̄ла̄ прока̄ш́ійа̄
тома̄ре а̄нанда дена хла̄дінı̄ хоійа̄',
    E'', E'',
    E'"The original form
of the cognizant potency (cit-sakti) is manifesting Your eternal pastimes in the spiritual world, and just to
give You pleasure it becomes the pleasure-giving potency known as hladini."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'jība-śakti hana taba cit-kiraṇa-caye
taṭastha-swabhābe jība-gaṇe prakaṭaye', E'джı̄ба-ш́акті хана таба чіт-кіран̣а-чайе
тат̣астха-свабга̄бе джı̄ба-ґан̣е пракат̣айе',
    E'', E'',
    E'"Secondly, becoming
the jiva-sakti, the potency produces the multitudes
of fine, conscious particles which make up the glowing effulgence of Your transcendental body. All of these souls are thus
manifest with a natural marginal characteristic of minute independence."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'māyā-śakti ho''ye kore prapañca
sṛjana
bahirmukha jībe tāhe koroya bandhana', E'ма̄йа̄-ш́акті хо''йе коре прапан̃ча
ср̣джана
бахірмукха джı̄бе та̄хе коройа бандгана',
    E'', E'',
    E'"Thirdly, becoming
the maya-sakti, the potency crates the innumerable
material universes, and within them she captures and binds all the souls who
choose to remain averse to You, dear Lord."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'', E'',
    E'bhakatibinoda bole aparādha-phale
bahirmukha ho''ye āchi prapañca-kabale', E'бгакатібінода боле апара̄дга-пхале
бахірмукха хо''йе а̄чхі прапан̃ча-кабале',
    E'', E'',
    E'Hearing these prayers
offered to Lord Caitanya by the dead boy, Bhaktivinoda says at this point that he himself has also
become averse to the Lord due to his offences, and has become swallowed up by maya in the material world.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 8: Purna Cid Ananda Tumi
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Purna Cid Ananda Tumi', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 8;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'pūrṇa-cid-ānanda tumi tomāra
cit-kaṇa āmi
swabhābataḥ
āmi tuyā dāsa
parama swatantra tumi tuyā paratantra āmi
tuyā pada chāḍi'' sarba-nāśa', E'пӯрн̣а-чід-а̄нанда тумі тома̄ра
чіт-кан̣а а̄мі
свабга̄батах̣
а̄мі туйа̄ да̄са
парама сватантра тумі туйа̄ паратантра а̄мі
туйа̄ пада чха̄д̣і'' сарба-на̄ш́а',
    E'', E'',
    E'The dead son continued: "You, dear Lord, are completely full in
transcendental bliss. I am simply a tiny conscious particle of You; therefore by nature I am Your eternal servant. Only You are supremely independent, whereasI
am totally dependent on You. Indeed, neglecting Your
lotus feet, I have now become completely ruined."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'swatantra ho''ye jakhana māyā
prati koinu mana
swa-swabhāba
chāḍilo āmāya
prapañce māyāra bandhe padinu karmera dhande
karma-cakre āmāre phelya', E'сватантра хо''йе джакхана ма̄йа̄
праті коіну мана
сва-свабга̄ба
чха̄д̣іло а̄ма̄йа
прапан̃че ма̄йа̄ра бандге падіну кармера дганде
карма-чакре а̄ма̄ре пхелйа',
    E'', E'',
    E'"As soon as I chose to be independent of Your Lordship, I became inclined
toward maya''s illusory benefits. Thus I have given up
my natural spiritual characteristics. Falling down due to the dazzling
bewilderment of fruitive gain, I have become captured
by maya within this mundane world. Now as a result I
am being forcibly thrown into the revolving wheel of binding fruitive actions and reactions."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'māyā taba icchā-mate bāndhe
more e jagate
adṛṣṭa nirbandha lauha-kore
sei to'' nirbandha more
ane śrībāsera
ghore
putra-rūpe malinī-jaṭhore', E'ма̄йа̄ таба іччха̄-мате ба̄ндге
море е джаґате
адр̣шт̣а нірбандга лауха-коре
сеі то'' нірбандга море
ане ш́рı̄ба̄сера
ґгоре
путра-рӯпе малінı̄-джат̣хоре',
    E'', E'',
    E'"Thus I am bound up by Maya in this world according to Your
will, being firmly clenched in the iron-like grip of my predestined fate. And
according to this fate, I have now come into Srivasa''s
home by taking birth as the son of Malini."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'se nirbandha punarāya
more ebe lo''ye jāya
āmi to'' thākite nāri āra
taba icchā su-prabala mora icchā su-durbala
āmi jība akiñcana chāra', E'се нірбандга пунара̄йа
море ебе ло''йе джа̄йа
а̄мі то'' тха̄кіте на̄рі а̄ра
таба іччха̄ су-прабала мора іччха̄ су-дурбала
а̄мі джı̄ба акін̃чана чха̄ра',
    E'', E'',
    E'"Now, again according to my predestined fate, I must leave this place; I
cannot remain here any longer, even if I wanted to. Your desire is most
powerful, dear Lord, whereas my desire is most feeble, for I am simply an
insignificant, humble soul."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'jathāya pāṭhāo tumi abaśya jāibo āmi
kara keba putra pati
pitā
jaḍera sambandha saba tāhā
nāhi satya-laba
tumi jībera nitya pālayitā', E'джатха̄йа па̄т̣ха̄о тумі абаш́йа джа̄ібо а̄мі
кара кеба путра паті
піта̄
джад̣ера самбандга саба та̄ха̄
на̄хі сатйа-лаба
тумі джı̄бера нітйа па̄лайіта̄',
    E'', E'',
    E'"Wherever You send me next, oh Lord, I must
certainly go to become someone''s son or husband or father. However, I know that
all these material relationships do not possess even one speck of eternal
truth, for only You, dear Lord, are the eternal friend
and guardian of all souls."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'sañjoge bijoge jini sukha-duḥkha
mane gaṇi
taba pade chāḍena āśroya
māyāra gardabha ho''ye mājena soḿsāra lo''ye
bhaktibinodera sei bhoya', E'сан̃джоґе біджоґе джіні сукха-дух̣кха
мане ґан̣і
таба паде чха̄д̣ена а̄ш́ройа
ма̄йа̄ра ґардабга хо''йе ма̄джена соḿса̄ра ло''йе
бгактібінодера сеі бгойа',
    E'', E'',
    E'"Only one who foolishly neglects the eternal shelter of You
two lotus feet considers the union and separation of all these temporary family
relationships to be separation of all distress. This just shows how much one
has actually become absorbed in the bodily concept of life, being crammed and
stuffed into the womb of illusion." Hearing all these truths about the
fate of the bound soul has now made Bhaktivinoda
become extremely frightened.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 9: Bandhilo Maya Je Dina
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 9, E'Bandhilo Maya Je Dina', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 9;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'bāndhilo māyā je dina ho''te
abidyā-moha-ḍore
aneka janma labhinu āmi
phirinu māyā-ghore', E'ба̄ндгіло ма̄йа̄ дже діна хо''те
абідйа̄-моха-д̣оре
анека джанма лабгіну а̄мі
пхіріну ма̄йа̄-ґгоре',
    E'', E'',
    E'The dead boy continued,
"Thus I have been captured and bound by maya.
Due to being tied tightly by her ropes of ignorance and bewilderment, I have
undergone many, many births since that time, simply wandering here and there in
the ghastly darkness of maya''s illusions."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'deba dānaba mānaba paśu
patańga
kīṭa ho''ye
swarge narake bhū-tale
phiri
anitya āśā lo''ye', E'деба да̄наба ма̄наба паш́у
патаńґа
кı̄т̣а хо''йе
сварґе нараке бгӯ-тале
пхірі
анітйа а̄ш́а̄ ло''йе',
    E'', E'',
    E'"Sometime I become
a demigod, sometimes a demon, and sometimes I get the body of a man, an animal,
a bird or an insect. Sometimes I wander up to heaven, sometimes down to hell,
and sometimes on earth, being carried away the whole time by innumerable
materialistic hopes and aspirations."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'nā
jāni kibā sukṛti-bale
śrībāsa-suta hoinu
nadīyā-dhāme caraṇa taba
daraśa-paraśa koinu', E'на̄
джа̄ні кіба̄ сукр̣ті-бале
ш́рı̄ба̄са-сута хоіну
надı̄йа̄-дга̄ме чаран̣а таба
дараш́а-параш́а коіну',
    E'', E'',
    E'" I have no idea of
what kind of wonderful pious credit I have earned to be born here in this life
as the son of Sri Srivasa Pandita
within the holy abode of Navadvipa. Thus I myself am
amazed that I have had the great fortune of actually being able to see and
touch Your lotus feet, oh Lord."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'sakala bāre maraṇa-kāle
aneka duḥkha pāi
tuyā praśańge
parama sukhe
e bāra ca''le jāi', E'сакала ба̄ре маран̣а-ка̄ле
анека дух̣кха па̄і
туйа̄ праш́аńґе
парама сукхе
е ба̄ра ча''ле джа̄і',
    E'', E'',
    E'"Usually, whenever
I have to die, I always experience great pain and distress upon leaving the
particular body I happen to be in. But this time, I am only experiencing great
happiness by discussing all these topics related to Your
glories. However, my time is now up, so I must take Your
leave."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'icchāya tora janama jadi
ābāra hoya hori
caraṇe taba prema-bhakati
thāke minati kori', E'іччха̄йа тора джанама джаді
а̄ба̄ра хойа хорі
чаран̣е таба према-бгакаті
тха̄ке мінаті корі',
    E'', E'',
    E'"If it is Your desire
that I should take another birth, oh Lord, I pray and humbly request Your
Lordship to kindly allow me to be always situated in the transcendental loving
service of Your divine lotus feet."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'jakhana śiśu
niraba bhelo
dekhiyā prabhura līlā
śrībā;sa-goṣṭhi tyajiyā
śoka
ānanda-magaṇa bhela', E'джакхана ш́іш́у
ніраба бгело
декхійа̄ прабгура лı̄ла̄
ш́рı̄ба̄;са-ґошт̣хі тйаджійа̄
ш́ока
а̄нанда-маґан̣а бгела',
    E'', E'',
    E'Saying this, the boy
then fell silent. Seeing this wonderful pastime of Sri Caitanya
Mahaprabhu, Srivasa Pandita''s whole family gave up all of their lamentation and
became absorbed in great transcendental happiness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'gaura-carita amṛta-dhārā
korite korite pāna
bhaktibinoda śrībāse
māge
jāya jena mora prāṇa', E'ґаура-чаріта амр̣та-дга̄ра̄
коріте коріте па̄на
бгактібінода ш́рı̄ба̄се
ма̄ґе
джа̄йа джена мора пра̄н̣а',
    E'', E'',
    E'Thus the transcendental
character and activities of Sri Caitanya Mahaprabhu are just like a continuous shower of ambrosia. Bhaktivinoda is thereby losing his vital life force simply
begging Srivasa Thakura to
allow him to drink more of this nectarean ambrosia.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 10: Srivase Kohen Prabhu
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 10, E'Srivase Kohen Prabhu', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 10;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'śrībāse kohena prabhu tuńhu mora dāsa
tuyā prīte bāndhā āmi jagate prokāśa', E'ш́рı̄ба̄се кохена прабгу туńху мора да̄са
туйа̄ прı̄те ба̄ндга̄ а̄мі джаґате прока̄ш́а',
    E'', E'',
    E'Then Sri Caitanya Mahaprabhu
began to speak to Srivasa with very affectionate and
sweet words. He said, "My dear Srivasa, you are
actually My very old servant. Indeed, I am staying in
this world only due to your unalloyed love for Me."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'bhakta-gaṇa
senāpati śrībāsa
paṇḍita
jagate ghuṣuka āji tomāra carita', E'бгакта-ґан̣а
сена̄паті ш́рı̄ба̄са
пан̣д̣іта
джаґате ґгушука а̄джі тома̄ра чаріта',
    E'', E'',
    E'"You, Srivasa Pandita,
are factually the commander-in-chief of all of My
devotees. Today your glorious character will be acclaimed throughout the three
worlds."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'prapañca-kārā-rākhinī māyāra bandhana
tomāra nāhiko kabhu dekhuka jagaj-jana', E'прапан̃ча-ка̄ра̄-ра̄кхінı̄ ма̄йа̄ра бандгана
тома̄ра на̄хіко кабгу декхука джаґадж-джана',
    E'', E'',
    E'"You are never subject to the imprisoning bondage of Mayadevi,
the proprietress of this prison-like material world. Indeed, this fact is
attested to by all the people of the world."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'dhana jana deha geha
āmāre arpiyā
āmāra sebāya sukhe ācho sukhi hana', E'дгана джана деха ґеха
а̄ма̄ре арпійа̄
а̄ма̄ра себа̄йа сукхе а̄чхо сукхі хана',
    E'', E'',
    E'"You have dedicated unto Me all of your wealth, followers, body and
household paraphernalia, and thus you have become most joyful by being so
nicely situated in My eternal service."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'mama līlā-puṣṭi
lagi'' tomāra soḿsāra
śikhuka gṛhastha-jana tomāra ācāra', E'мама лı̄ла̄-пушт̣і
лаґі'' тома̄ра соḿса̄ра
ш́ікхука ґр̣хастха-джана тома̄ра а̄ча̄ра',
    E'', E'',
    E'The whole of your existence in this world is only for the purpose of
nourishing My eternal pastimes. Thus your ideal
behavior as a transcendental family man is exemplary for instructing all the
materialistic householders."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'taba preme baddha āchi
āmi nityānanda
ama duńhe suta jāni'' bhuñjaha ānanda', E'таба преме баддга а̄чхі
а̄мі нітйа̄нанда
ама дуńхе сута джа̄ні'' бгун̃джаха а̄нанда',
    E'', E'',
    E'"Sri Nityananda Prabhu
and I are so much obliged to you due to your pure love for Us.
Indeed, We know that you enjoy great happiness by
considering Us to be your very own sons."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'nitya-tattwa suta jāra anitya tanoya
āsakti nā kore sei
sṛjane praloya', E'нітйа-таттва сута джа̄ра анітйа танойа
а̄сакті на̄ коре сеі
ср̣джане пралойа',
    E'', E'',
    E'"We are truly your eternal sons, for We see that
you are not at all attached to your temporary sons, who are all subject to the
material conditions of creation and destruction."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'bhaktite tomāra ṛṇī āmi ciro-dina
taba sādhu-bhābe tumi khama mora ṛṇa', E'бгактіте тома̄ра р̣н̣ı̄ а̄мі чіро-діна
таба са̄дгу-бга̄бе тумі кхама мора р̣н̣а',
    E'', E'',
    E'"Because of your pure devotion I am eternally indebted to you. And because
of your saintly character you are also quite deserving of My
indebtedness."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'', E'',
    E'śrībāsera pāya bhaktibinoda
kujana
kākuti koriyā māge gaurāńga-caraṇa', E'ш́рı̄ба̄сера па̄йа бгактібінода
куджана
ка̄куті корійа̄ ма̄ґе ґаура̄ńґа-чаран̣а',
    E'', E'',
    E'Hearing these loving words of Sri Caitanya Mahaprabhu, this rascal Bhaktivinoda
now begs at the feet of Srivasa Thakura
in humble supplication to receive the lotus feet of Lord Gauranga.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 11: Srivaser Prati Caitanya
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 11, E'Srivaser Prati Caitanya', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 11;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'śrībāsera prati caitanya-prasāda
dekhiyā sakala jana
jaya śrī-caitanya jaya nityānanda
boli'' nāce ghana ghana', E'ш́рı̄ба̄сера праті чаітанйа-праса̄да
декхійа̄ сакала джана
джайа ш́рı̄-чаітанйа джайа нітйа̄нанда
болі'' на̄че ґгана ґгана',
    E'', E'',
    E'Seeing Sri Caitanya Mahaprabhu
shows such favorable grace to Srivasa Pandita, all the devotees present there began to dance
ecstatically, and they repeatedly shouted, "Jaya
Sri Caitanya! Jaya Nityananda!" with resounding voices.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'śrībāsa-mandire ki bhāba uṭhilo
tāhā ki barṇaṇa
hoya
bhāba-yuddha sane ānanda-krandana
uṭhe kṛṣṇa-prema-moya', E'ш́рı̄ба̄са-мандіре кі бга̄ба ут̣хіло
та̄ха̄ кі барн̣ан̣а
хойа
бга̄ба-йуддга сане а̄нанда-крандана
ут̣хе кр̣шн̣а-према-мойа',
    E'', E'',
    E'It is simply not possible to describe the ecstatic mood that arose in Srivasa''s house at that time, indeed, it was just like a
great war of transcendental emotions was taking place within the battlefield of
tears of joy, all arising due to ecstatic love for Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'cāri bhāi paḍi'' prabhura caraṇe
preme gadagada sware
kāndiyā kāndiyā kākuti
koriyā
gaḍi'' jāya prema-bhare', E'ча̄рі бга̄і пад̣і'' прабгура чаран̣е
преме ґадаґада сваре
ка̄ндійа̄ ка̄ндійа̄ ка̄куті
корійа̄
ґад̣і'' джа̄йа према-бгаре',
    E'', E'',
    E'Then the four brothers of the dead boy came over and fell down at Lord Caitanya''s lotus feet and began weeping and wailing with
piteous voices choked with ecstatic love. Then they began rolling on the
ground, overflowing with pure love while humbly petitioning the Lord as
follows.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'ohe prāṇeśwara e heno bipada
prati-dina jeno hoya
jāhāte tomāra caraṇa-jugale
āsakti bāḍhite roya', E'охе пра̄н̣еш́вара е хено біпада
праті-діна джено хойа
джа̄ха̄те тома̄ра чаран̣а-джуґале
а̄сакті ба̄д̣хіте ройа',
    E'', E'',
    E'They said, "Oh Lord of our lives! If calamities like this would happen
every day, then that would only increase our deep loving attachment to Your
lotus feet!"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'bipada-sampade sei dina bhalo
je dina tomāre
smari
tomāra smaraṇa rohita je dina
se dina
bipada hari', E'біпада-сампаде сеі діна бгало
дже діна тома̄ре
смарі
тома̄ра смаран̣а рохіта дже діна
се діна
біпада харі',
    E'', E'',
    E'"This calamity of losing our brother today is actually our great fortune,
for on this day we are remembering Your Lordship. If, on some other day, we are
bereft of Your remembrance, then that day is actually the real calamity for us,
oh Lord."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'śrībāsa-goṣṭhira caraṇe padiyā
bhakatibinoda bhaṇe
tomādera gorā kṛpā
bitariyā
dekhāo durgata jane', E'ш́рı̄ба̄са-ґошт̣хіра чаран̣е падійа̄
бгакатібінода бган̣е
тома̄дера ґора̄ кр̣па̄
бітарійа̄
декха̄о дурґата джане',
    E'', E'',
    E'Falling down at the feet of Srivasa Pandita''s entire family, Bhaktivinoda
thus narrates how their Lord Gaurasundara is
bestowing His causeless mercy upon all distressed souls.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 3, Song 12: Mrta Sisu Loye Tabe
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 12, E'Mrta Sisu Loye Tabe', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 12;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'mṛta śiśu lo''ye tabe bhakata-batsala
bhakata-sańgete
gāya śrī-nāma-mańgala', E'мр̣та ш́іш́у ло''йе табе бгаката-батсала
бгаката-саńґете
ґа̄йа ш́рı̄-на̄ма-маńґала',
    E'', E'',
    E'Lord Caitanya, Who is so affectionate to His own devotees,
then took the dead boy and, along with all the devotees, began to chant the
most auspicious sound vibration of the holy names. Thus singing and singing,
they all arrived on the bank of the Ganga (the Jahnavi). Then they performed the proper funeral rites with
some water from the Ganga.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'gāite gāite gelā jāhnabīra tīre
balake satkāra koilo jāhnabīra nīre', E'ґа̄іте ґа̄іте ґела̄ джа̄хнабı̄ра тı̄ре
балаке сатка̄ра коіло джа̄хнабı̄ра нı̄ре',
    E'', E'',
    E'The personified Gangamayi, Sri Jahnavi-devi,
then appeared herself and said, "Such unlimited auspicious fortune has
become mine today! Now I have achieved the successful fruits of all the vows
and penances I had undertaken!"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'jāhnabī bolena mama saubhāgya apāra
saphala hoilo brata
chilo je āmāra', E'джа̄хнабı̄ болена мама саубга̄ґйа апа̄ра
сапхала хоіло брата
чхіло дже а̄ма̄ра',
    E'', E'',
    E'Then Lord Caitanya personally put the boy''s body into
the river. Immediately thereafter, Jahnavi Devi picked up the body and took him on her lap.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'mṛta śiśu dena gorā jāhnabīra jale
uṭhali jāhnabī debī śiśu loya kole', E'мр̣та ш́іш́у дена ґора̄ джа̄хнабı̄ра джале
ут̣халі джа̄хнабı̄ дебı̄ ш́іш́у лойа коле',
    E'', E'',
    E'Bringing the dead boy out of the water, she touched the lotus feet of Lord Gaura. With the body still on her lap, she began to tremble
in ecstatic love for the Lord.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'uṭhaliyā sparśa gorā-caraṇa-kamala
śiśu kole preme
debī hoya ṭalamala', E'ут̣халійа̄ спарш́а ґора̄-чаран̣а-камала
ш́іш́у коле преме
дебı̄ хойа т̣аламала',
    E'', E'',
    E'Seeing such an ecstatic mood being exhibited by Sri Jahnavi
Devi, all the assembled devotees there immediately
began chanting the auspicious holy names incessantly.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'jāhnabīra bhāba dekhi'' jata bhakta-gaṇa
śrī-nāma-mańgala-dhwani kore anukhaṇa', E'джа̄хнабı̄ра бга̄ба декхі'' джата бгакта-ґан̣а
ш́рı̄-на̄ма-маńґала-дгвані коре анукхан̣а',
    E'', E'',
    E'From the heavens, the demigods began to shower flowers like rainfall. They
crowded in the sky, almost blocking out the sunlight with their innumerable
airplanes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'swarge hoite debe
kore puṣpa-bariṣaṇa
bimāna sańkula tabe chailo gagana', E'сварґе хоіте дебе
коре пушпа-барішан̣а
біма̄на саńкула табе чхаіло ґаґана',
    E'', E'',
    E'In this way, everyone on all sides was absorbed in various ecstasies. After
performing the funeral rites, they all took their bath in the Ganga.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'ei rūpe nānā-bhābe hoiyā
magana
satkāra koriyā snāna koilo sarba-jana', E'еі рӯпе на̄на̄-бга̄бе хоійа̄
маґана
сатка̄ра корійа̄ сна̄на коіло сарба-джана',
    E'', E'',
    E'In great happiness, everyone then returned to their respective homes, and Bhaktivinoda is now completely immersed in the
transcendental ecstasies of Lord Gaurasundara.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'', E'',
    E'parama ānande sabe gelo nija
ghare
bhakatibinoda māje gorā-bhāba-bhare', E'парама а̄нанде сабе ґело ніджа
ґгаре
бгакатібінода ма̄дже ґора̄-бга̄ба-бгаре',
    E'', E'',
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


  -- Section 3, Song 13: Nadiya Nagare Gora
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 3;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 13, E'Nadiya Nagare Gora', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 13;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'nadīyā-nagare gorā-carita amṛta
piyā śoka bhoya chāḍo sthira koro cita', E'надı̄йа̄-наґаре ґора̄-чаріта амр̣та
пійа̄ ш́ока бгойа чха̄д̣о стхіра коро чіта',
    E'', E'',
    E'The activities and behavior of Lord Gaurasundara
within the villages around Nadia District are just like sweet ambrosial nectar.
By drinking this nectar, just give up all of your material lamentations and
fears, and make your heart become thus fixed up.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'anitya soḿsāra bhāi kṛṣṇa mātra
sāra
gorā-śikhā mate kṛṣṇa bhaja anibāra', E'анітйа соḿса̄ра бга̄і кр̣шн̣а ма̄тра
са̄ра
ґора̄-ш́ікха̄ мате кр̣шн̣а бгаджа аніба̄ра',
    E'', E'',
    E'Within this temporary material world, my friends, the only substantial essence
of Absolute truth is Lord Krsna. Therefore, kindly
take heed of Lord Caitanya''s advice, and just worship
Krsna constantly.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'gorāra caraṇa dhori'' jei bhāgyabān
braje rādhā-kṛṣṇa bhaje
sei mora prāṇa', E'ґора̄ра чаран̣а дгорі'' джеі бга̄ґйаба̄н
брадже ра̄дга̄-кр̣шн̣а бгадже
сеі мора пра̄н̣а',
    E'', E'',
    E'Whoever understands this and thereby firmly grabs hold of Lord Caitanya''s lotus feet is most fortunate. And if he worships
Sri Sri Radha-Krsna in Vrndavana, then I will accept him as my very life soul.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'rādhā-kṛṣṇa gorācanda na''de bṛndābana
ei mātra koro sāra pā''be nitya dhana', E'ра̄дга̄-кр̣шн̣а ґора̄чанда на''де бр̣нда̄бана
еі ма̄тра коро са̄ра па̄''бе нітйа дгана',
    E'', E'',
    E'Their Lordships Sri Sri Radha-Krsna
are none other than the selfsame Lord Gauracandra,
and Sri Navadvipa-dhama is that very same Vrndavana-dhama. If you consider this as the only essential
point, then you will rightfully receive some eternal treasures.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'bidyā-buddhi
hīna dīna akiñcana chāra
karma-jñāna-śūnya āmi śūnya-sad-ācāra', E'бідйа̄-буддгі
хı̄на дı̄на акін̃чана чха̄ра
карма-джн̃а̄на-ш́ӯнйа а̄мі ш́ӯнйа-сад-а̄ча̄ра',
    E'', E'',
    E'Actually I am completely devoid of any real knowledge or good intelligence.
Indeed, I am most lowly, insignificant and contemptible. I am also certainly
without the slightest trace of good karma or philosophical understanding, and I
am completely bereft of any proper virtuous behavior.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'śrī-guru
baiṣṇaba more dilena
upādhi
bhakti-hīne upādhi hoilo ebe byādhi', E'ш́рı̄-ґуру
баішн̣аба море ділена
упа̄дгі
бгакті-хı̄не упа̄дгі хоіло ебе бйа̄дгі',
    E'', E'',
    E'All the assembled Vaisnavas, who I consider to be
just like my spiritual master, have given me this title of Bhaktivinoda,
but because I am actually totally devoid of any trace of devotion, this title
has simply become like a painful disease for me.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'jatana koriyā sei byadhi nibaraṇe
śaraṇa
loinu āmi baiṣṇaba-caraṇe', E'джатана корійа̄ сеі бйадгі нібаран̣е
ш́аран̣а
лоіну а̄мі баішн̣аба-чаран̣е',
    E'', E'',
    E'Taking great care to check the spreading of this disease, I have taken refuge
at the lotus feet of all the Vaisnavas.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'baiṣṇabera pada-raja mastake dhoriyā
e śoka-satana gāya bhaktibinodiyā', E'баішн̣абера пада-раджа мастаке дгорійа̄
е ш́ока-сатана ґа̄йа бгактібінодійа̄',
    E'', E'',
    E'Taking the dust of the lotus feet of all the Vaisnavas
upon my head, this lowly Bhaktivinoda thus sings this
story called soka-satana, (The Dispelling of Grief).*', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 1: Bahu Janma Bhagya
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Bahu Janma Bhagya', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'bahu-janma-bhāgya-baśe cinmoya madhura rase
spṛhā janme jībera hiyāya
sei spṛhā lobha hoya braja-dhāme jība loya
rūpānuga-bhajane mātāya', E'баху-джанма-бга̄ґйа-баш́е чінмойа мадгура расе
спр̣ха̄ джанме джı̄бера хійа̄йа
сеі спр̣ха̄ лобга хойа браджа-дга̄ме джı̄ба лойа
рӯпа̄нуґа-бгаджане ма̄та̄йа',
    E'', E'',
    E'Glorifying the lotus feet of Sri Guru, Sri Gauracandra,
the Youthful Couple of Vrndavan as well as of all the
residents of Vraja, with a cheerful mind this Bhaktivinoda will now narrate the description of the mirror
which reflects the worship of those who strictly follow in the footsteps of Srila Rupa Gosvami.
Song 2:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'bhajana-prakāra jata sakalera sāra mata
śikhāilo śrī-rūpa gosāñi
se bhajana nā jāniyā kṛṣṇa bhajibāre
giyā
tuccha kāje jībana kāṭāi', E'бгаджана-прака̄ра джата сакалера са̄ра мата
ш́ікха̄іло ш́рı̄-рӯпа ґоса̄н̃і
се бгаджана на̄ джа̄нійа̄ кр̣шн̣а бгаджіба̄ре
ґійа̄
туччха ка̄дже джı̄бана ка̄т̣а̄і',
    E'', E'',
    E'By the influence of extremely good fortune accrued for many, many births, the
desire awakens within the heart of a fortunate soul to taste the sweetness of
eternal transcendental mellows. Then, a strong inclination toward such a desire
forcibly brings that soul to Sri Vrndavana-dhama,
where he becomes absorbed in the worship of Lord Krsna
which strictly follows the process outlined by Srila Rupa Gosvami.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'bujhibāre se bhajana bahu jatna akiñcana
biracilo bhajana-darapaṇa
braje rādhā-kṛṣṇa-sebā korite utsuka jebā
sukhe teńha koruṇa śrabaṇa', E'буджхіба̄ре се бгаджана баху джатна акін̃чана
бірачіло бгаджана-дарапан̣а
брадже ра̄дга̄-кр̣шн̣а-себа̄ коріте утсука джеба̄
сукхе теńха корун̣а ш́рабан̣а',
    E'', E'',
    E'Srila Rupa Gosvami has so kindly given us his valuable opinion and
taught the essential techniques for properly worshiping the Supreme Personality
of Godhead. Whoever tries to worship Krsna without
being aware of these methods will simply waste his entire life in useless
labor.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'lobhete janama pāi ati śīghra bāḍi''
jāi
śraddhā rati tabe hoya
prīti
sahaja bhajana rati nāhi cāya śikhā-mati
tabu śikhā prathamika-rīti', E'лобгете джанама па̄і аті ш́ı̄ґгра ба̄д̣і''
джа̄і
ш́раддга̄ раті табе хойа
прı̄ті
сахаджа бгаджана раті на̄хі ча̄йа ш́ікха̄-маті
табу ш́ікха̄ пратхаміка-рı̄ті',
    E'', E'',
    E'Just for the sake of those who really want to understand this worship, I have
taken great care to humbly present this mirror of bhajana,
although I am insignificant. If any of you are actually serious and
enthusiastic to render eternal service to Sri Sri Radha-Krsna in the transcendental realm of Vraja, then I request you now to please hear this narration
with great happiness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'putra-sneha jananīra sahaja hṛdoye sthira
dūṣita hṛdoye śikhā cāi
kṛṣṇa-prema sei rūpa nitya-siddha aparūpa
baddha-jībe aprakaṭa bhāi', E'путра-снеха джананı̄ра сахаджа хр̣дойе стхіра
дӯшіта хр̣дойе ш́ікха̄ ча̄і
кр̣шн̣а-према сеі рӯпа нітйа-сіддга апарӯпа
баддга-джı̄бе апракат̣а бга̄і',
    E'', E'',
    E'If one has intense greed and selfish eagerness for this process, presented
herein, then gradually his faith, then taste, and then full attachment in love
will all increase very, very quickly. One who has attained this platform of
worship in his own natural love and attachment has no need at all to bother
with scriptural rules and regulations, although in the primary, beginning stage
such practices are mandatory.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'sei to'' sahaja rati pāiyāche
apagati
śikhānuśīlana jadi pāya
se rati jāgiyā uṭhe jībera bandhana chuṭe
brajānanda tāhāre
nācāya', E'сеі то'' сахаджа раті па̄ійа̄чхе
апаґаті
ш́ікха̄нуш́ı̄лана джаді па̄йа
се раті джа̄ґійа̄ ут̣хе джı̄бера бандгана чхут̣е
браджа̄нанда та̄ха̄ре
на̄ча̄йа',
    E'', E'',
    E'Brothers, it is just like the affection of a mother for her son, which is
naturally fixed in her heart. She is inclined to care for her son by instinct.
But if someone else cares for the same child, they may not be as attentive as
the mother, so they might sometimes need to be reminded of their duty. So love
for Krsna is just like that. It is natural and wonderful for the nitya-siddha souls, whereas it is completely unmanifested and beyond the range of the nitya-baddha souls who are outside the purview of devotion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'However, if one cultivates these spiritual instructions, then the flow of his
natural attachment and affection for the Lord is released. And when this
attachment reawakens and grows, then all the material bondage which entraps the
soul becomes severed, and this natural spiritual attachment will make him dance
in the transcendental ecstastic bliss of Vraja consciousness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 2: Bahu Janma Bhagya 2
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Bahu Janma Bhagya 2', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Section 4, Song 3: Yoga Jaga Saba Char
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Yoga Jaga Saba Char', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'yoga jāga saba chāra śraddhā
sakalera sāra
sei śraddhā hṛdoye jāhāra
udiyāche eka bindhu krame bhakti-rasa-sindhu
lābhe tāra hoya adhikāra', E'йоґа джа̄ґа саба чха̄ра ш́раддга̄
сакалера са̄ра
сеі ш́раддга̄ хр̣дойе джа̄ха̄ра
удійа̄чхе ека біндгу краме бгакті-раса-сіндгу
ла̄бге та̄ра хойа адгіка̄ра',
    E'', E'',
    E'Any type of yoga
exercise or external religious ceremony is completely useless and is no help at
all... for genuine faith is the only real substance. Whoever has such sincere
faith in his heart tastes one drop of transcendental nectar, and then he
gradually gains the right of admission into the entire ocean of ecstatic
devotional mellows (the Bhakti-rasamrta-sindhu)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'jñāna karma deba debi bahu jatanete sebi''
prāpta-phala
hoilo tuccha jñāna
sādhu-jana-sańgābeśe śrī-kṛṣṇa-kathāra śeṣe
biśwāso
to'' hoya balabān', E'джн̃а̄на карма деба дебі баху джатанете себі''
пра̄пта-пхала
хоіло туччха джн̃а̄на
са̄дгу-джана-саńґа̄беш́е ш́рı̄-кр̣шн̣а-катха̄ра ш́еше
біш́ва̄со
то'' хойа балаба̄н',
    E'', E'',
    E'By faithfully worshiping
the gods and goddesses who bestow knowledge and fruitive
results, with great care and attention, one gets only insignificant material
knowledge. On the other hand, by hearing the narration of topics concerning Krsna with rapt attention in the company of virtuous
devotees, one''s transcendental conviction becomes completely fixed-up.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'sei to'' biśwāse bhāi śraddhā
boli'' sadā gāi
bhakti-latā bīja boli tāre
karmī jñānī jane jāre śraddhā bole bāre bāre
sei bṛtti śraddhā hoite nāre', E'сеі то'' біш́ва̄се бга̄і ш́раддга̄
болі'' сада̄ ґа̄і
бгакті-лата̄ бı̄джа болі та̄ре
кармı̄ джн̃а̄нı̄ джане джа̄ре ш́раддга̄ боле ба̄ре ба̄ре
сеі бр̣тті ш́раддга̄ хоіте на̄ре',
    E'', E'',
    E'My friends! I call this
type of fixed-up conviction "sraddha",
which I continuously sing about and glorify in various ways. This sraddha is actually the bhakti-lata-bija
(the seed of the creeper of devotion). The fruitive
workers and the mental speculators have their own idea about what is sraddha, which they advertise and proclaim again and again,
but in my opinion, their definition is without a doubt a misconception, and
does not constitute the real, transcendental sraddha.
Whenever I hear such foolish disputes and misconceptions over mere names from
such unauthorized persons, it burns me up because that is just like mistaking
iron to be gold. Iron always remains iron, and can
never become gold unless and until it is touched by a transcendental
touchstone.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'nāmera bibada mātra śuniyā
to'' jwale gātra
lauhe jadi boloho kañcana
tabu lauha lauha roya kañcana to'' kabhu noya
maṇi sparśa nāhe jata-khaṇa', E'на̄мера бібада ма̄тра ш́унійа̄
то'' джвале ґа̄тра
лаухе джаді болохо кан̃чана
табу лауха лауха ройа кан̃чана то'' кабгу нойа
ман̣і спарш́а на̄хе джата-кхан̣а',
    E'', E'',
    E'This touch-stone is
actually pure devotional service to Lord Krsna. By
the mere touch of this transcendental gem, the iron-mine of faith in fruitive action and philosophical wrangling turns into
golden ecstatic loving faith in the Lord. The weight of this type of gold certainly
outweighs all materialistic delusions. This is the real power of the touch-
stone of Krsna-bhakti.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'kṛṣṇa-bhakti cintāmaṇi tańra sparśe lauha-khani
kārma-jñāna-gata śraddhā-bhāba
haya jaya hema-bhara chāḍiyā
to'' ku-bikāra
se kebala maṇira prabhāba', E'кр̣шн̣а-бгакті чінта̄ман̣і таńра спарш́е лауха-кхані
ка̄рма-джн̃а̄на-ґата ш́раддга̄-бга̄ба
хайа джайа хема-бгара чха̄д̣ійа̄
то'' ку-біка̄ра
се кебала ман̣іра прабга̄ба',
    E'', E'',
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


  -- Section 4, Song 4: Chari Anya Abhilasa
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Chari Anya Abhilasa', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'chāḍi'' anya abhilāṣa jñāna-karma-sahābāsa
ānukūlya
kṛṣṇānuśīlana
śuddha-bhakti boli'' tāre bhakti-śāstra
su-bicāre
śrī-rūpera
siddhānta-bacana', E'чха̄д̣і'' анйа абгіла̄ша джн̃а̄на-карма-саха̄ба̄са
а̄нукӯлйа
кр̣шн̣а̄нуш́ı̄лана
ш́уддга-бгакті болі'' та̄ре бгакті-ш́а̄стра
су-біча̄ре
ш́рı̄-рӯпера
сіддга̄нта-бачана',
    E'', E'',
    E'Srila Rupa Gosvami, after intensely studying all the devotional
scriptures, has made the following conclusive definition of pure devotional
service: Giving up all desires for fruitive reward or
philosophical jugglery, one should execute favorable devotional service to
Krsna for his pleasure only.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'śrabaṇa
kīrtana smṛti
sebārcana dāsya nati
sakhya ātma-nibedana hoya
sādhana-bhaktira ańga
sādhakera jāhe rańga
sadā sādhu-jana-sańga-moya', E'ш́рабан̣а
кı̄ртана смр̣ті
себа̄рчана да̄сйа наті
сакхйа а̄тма-нібедана хойа
са̄дгана-бгактіра аńґа
са̄дгакера джа̄хе раńґа
сада̄ са̄дгу-джана-саńґа-мойа',
    E'', E'',
    E'The divisions of regulated devotional service are:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'sādhana-bhaktira
bale bhāba-rūpa bhakti-phale
tāhā punaḥ prema-rūpa pāya
preme jība kṛṣṇa
bhaje kṛṣṇa-bhakti-rase māje
sei rasa śrī-rūpa
śikhāya', E'са̄дгана-бгактіра
бале бга̄ба-рӯпа бгакті-пхале
та̄ха̄ пунах̣ према-рӯпа па̄йа
преме джı̄ба кр̣шн̣а
бгадже кр̣шн̣а-бгакті-расе ма̄дже
сеі раса ш́рı̄-рӯпа
ш́ікха̄йа',
    E'', E'',
    E'hearing the glories of
the Lord,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'', E'',
    E'', E'',
    E'chanting His holy names,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'', E'',
    E'', E'',
    E'remembering Him within the core of the
heart,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'serving His lotus feet,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'worshiping His Deity form,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'becoming His
menial servant,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'', E'',
    E'', E'',
    E'', E'',
    E'offering prayers to Him revealing the mind,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10',
    E'', E'',
    E'', E'',
    E'', E'',
    E'entering into
a friendly relationship with Him, and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11',
    E'', E'',
    E'', E'',
    E'', E'',
    E'ultimately surrendering one''s whole
existence in full dedication by mind, body and words. The practicing neophyte
devotees continuously perform all of these nine processes joyfully in the
association of saintly persons who are adept in hones devotional dedication.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '12',
    E'', E'',
    E'', E'',
    E'', E'',
    E'By the strength of the above-mentioned ninefold
practices of regulated devotional service, the devotion thereafter fructifies
into an ecstatic emotional service attitude, and after that one reawakens his
original pure ecstatic love of Godhead. In such transcendental love, the soul
whole-heartedly worships Krsna, constantly immersed in tasting the ecstatic
mellows of devotion to Him. This is the delicious mellow that Srila Rupa Gosvami
is teaching us about.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 5: Sraddha Devi Nama Jar
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Sraddha Devi Nama Jar', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'śraddhā-debi nāma jāra duiti swabhāba tāra
bidhi-mūla ruci-mūla bhede
śāstrera
śāsana jabe śraddhāra
udoya ho''be
baidhī śraddhā tāre bole bede', E'ш́раддга̄-дебі на̄ма джа̄ра дуіті свабга̄ба та̄ра
бідгі-мӯла ручі-мӯла бгеде
ш́а̄стрера
ш́а̄сана джабе ш́раддга̄ра
удойа хо''бе
баідгı̄ ш́раддга̄ та̄ре боле беде',
    E'', E'',
    E'The presiding deity of devotional faith called Sraddha
Devi, and she has two principle characteristics...
one is executed according to rules, and the other according to tastes. First of
all, when devotional faith arises due to fear of the rules and regulations
given in the revealed scriptures, then that type of faith is known throughout
the Vedas as "vaidhi sraddha",
or faith situated in regulation.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'braja-bāsī
sebe kṛṣṇe sei śuddha-sebā dṛṣṭe
jabe hoya śraddhāra udoya
lobhamoyī śraddhā satī rāgānugā
śuddhā mati
bahu bhāgye sādhaka labhoya', E'браджа-ба̄сı̄
себе кр̣шн̣е сеі ш́уддга-себа̄ др̣шт̣е
джабе хойа ш́раддга̄ра удойа
лобгамойı̄ ш́раддга̄ сатı̄ ра̄ґа̄нуґа̄
ш́уддга̄ маті
баху бга̄ґйе са̄дгака лабгойа',
    E'', E'',
    E'Secondly, sometimes one''s faith flourishes in a similar way as that of the
residents of Vraja, who all render service to Krsna
with a purely spontaneous service attitude. Faith that concentrates on Krsna
exclusively with such intense greed to satisfy Him is the chastest
form of faith. Such a pure, spontaneous service attitude is called "raganuga sraddha", and a
practicing devotee who worships in this way attains the most auspicious
spiritual position.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'śraddhā-bhede bhakti-bhede gāitecheche
catur-beda
baidhī rāgānugā bhakti dwoya
sādhana-samoye
jaiche siddhi-kāle prāpti taiche
ei-rūpa bhakti-śāstre koya', E'ш́раддга̄-бгеде бгакті-бгеде ґа̄ітечхечхе
чатур-беда
баідгı̄ ра̄ґа̄нуґа̄ бгакті двойа
са̄дгана-самойе
джаічхе сіддгі-ка̄ле пра̄пті таічхе
еі-рӯпа бгакті-ш́а̄стре койа',
    E'', E'',
    E'Due to different types of faith, these different divisions of devotional
service exist. Thus the four Vedas sing of these two types of devotion... regulative
service and spontaneous service. According to these different types of sadhana, one accordingly attains different perfections,
which are all mentioned comprehensively in the revealed scriptures of
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


  -- Verse 4
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'baidhī bhakti dhīra gati rāgānugā tībra
ati
ati śīghra rasābasthā
pāya
rāga-bartma-su-sādhane ruci hoya jāra
mane
rūpānuga
hoite sei dhāya', E'баідгı̄ бгакті дгı̄ра ґаті ра̄ґа̄нуґа̄ тı̄бра
аті
аті ш́ı̄ґгра раса̄бастха̄
па̄йа
ра̄ґа-бартма-су-са̄дгане ручі хойа джа̄ра
мане
рӯпа̄нуґа
хоіте сеі дга̄йа',
    E'', E'',
    E'Vaidhi bhakti progresses
very slowly toward the goal, but raganuga bhakti moves extremely fast, and enables one to be quickly
situated in the tasty transcendental mellows. By following the path of
spontaneous devotional service, real taste awakens in one''s mind, and he runs
and chases after that current which flows from the lotus feet of Srila Rupa Gosvami.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 6: Rupanuga Tattva Sara
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Rupanuga Tattva Sara', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'rūpānuga tattwa-sāra bujhite akańkha jāńra
rasa-jñāna tāńra prayojana
cinmoya ānanda-rasa
sarba-tattwa jāńra
baśa
akhaṇḍa parama tattwa-dhana', E'рӯпа̄нуґа таттва-са̄ра буджхіте акаńкха джа̄ńра
раса-джн̃а̄на та̄ńра прайоджана
чінмойа а̄нанда-раса
сарба-таттва джа̄ńра
баш́а
акхан̣д̣а парама таттва-дгана',
    E'', E'',
    E'Whoever has a longing to understand the essential truth of the reality of rupanuga, then for him it is necessary to have some basic
knowledge of transcendental mellows. And such spiritually blissful conscious
mellows influence and control all other subordinate truths, for they are the
hidden treasure of the supreme, absolutely undividable Truth of all Truths.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'jāńra bhāṇe jñāni jana brahmāloya-anweṣaṇa
kore nāhi bujhi'' beda-marma
jāńra
chāyā-mātra bore
jogī-jana joga kore
jāra chale karmi kore
karma', E'джа̄ńра бга̄н̣е джн̃а̄ні джана брахма̄лойа-анвешан̣а
коре на̄хі буджхі'' беда-марма
джа̄ńра
чха̄йа̄-ма̄тра боре
джоґı̄-джана джоґа коре
джа̄ра чхале кармі коре
карма',
    E'', E'',
    E'In pursuit of this same spiritual mellow, the philosophical speculators search
for fusing themselves with the impersonal Brahman effugence,
not understanding the real import of the Vedic conclusion. And all the desired
boons of the yogis are simply shadow reflections of this rasa.
On the plea of this taste, the karmis execute all
their fruitive activities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'bibhāba anubhāba āra sāttwika sañcārī
cāra
sthāyī bhābe milana śundara
sthāyī
bhābe rasa hoya nitya
cid-ānanda-moya
parama āswādya nirantara', E'бібга̄ба анубга̄ба а̄ра са̄ттвіка сан̃ча̄рı̄
ча̄ра
стха̄йı̄ бга̄бе мілана ш́ундара
стха̄йı̄
бга̄бе раса хойа нітйа
чід-а̄нанда-мойа
парама а̄сва̄дйа нірантара',
    E'', E'',
    E'The permanent basis of ecstatic mellow is called "stayi
bhava", and is abounding in eternal, conscious
bliss. It becomes the topmost relishable euphoria
when it mixes into a beautifully delicious combination with these four
elements:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'je rasa prapañca-gata joḍa-kābye
prokāśita
parama rasera asan-mūrti
asan-mūrti nitya hoya ādarśera
chāyā hoya
jena marīcikā jala-sphūrti', E'дже раса прапан̃ча-ґата джод̣а-ка̄бйе
прока̄ш́іта
парама расера асан-мӯрті
асан-мӯрті нітйа хойа а̄дарш́ера
чха̄йа̄ хойа
джена марı̄чіка̄ джала-спхӯрті',
    E'', E'',
    E'Vibhava (specific stimulants and
supporting characters)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Anubhava (thirteen
resultant ecstatic symptoms)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Sattvika (eigth especially disruptive ecstatic symptoms)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Sancari (thirty-three transitory accompanying emotions).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'When rasa is expressed in the material world, it is
praised throughout the materialistic literature of the world, but that is only
a perverted reflection of this supreme mellow. It is temporary and is just like
an imitation copy of the real thing, similar to a mirage which appears to be
water in a desert.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 7: Rasera Harajini Citta
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Rasera Harajini Citta', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'rasera ādhāra jini tāńra
citte rasa-khani
sei cittera abasthā biśeṣe
śraddhā-niṣṭhā-rucy-āsakti krame hoya bhāba-byakti
rati-nāme tāńhāra nirdeśe', E'расера а̄дга̄ра джіні та̄ńра
чітте раса-кхані
сеі чіттера абастха̄ біш́еше
ш́раддга̄-нішт̣ха̄-ручй-а̄сакті краме хойа бга̄ба-бйакті
раті-на̄ме та̄ńха̄ра нірдеш́е',
    E'', E'',
    E'The heart of one who is a receptacle for rasa is just
like a holding tank which is filled with this liquid mellow. The specific
symptoms of such a rasa laden heart is that it
fosters the gradual manifestation of ecstatic emotion, which evolves gradually
from the beginning as sraddha (faith), then nistha (steadiness), then ruci
(taste), then finally bhava (firm attachment to
Krsna). This is the definition of what is known as rati,
or affection within the scope of the transcendental loving mellow.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'biruddhābiruddha-bhāba sarbopari swa-prabhāba
prokāśiyā loya nija-baśe
sakalera ādi-pati haya śobhā pāya ati
sthāyī bhāba nāma pāya rase', E'біруддга̄біруддга-бга̄ба сарбопарі сва-прабга̄ба
прока̄ш́ійа̄ лойа ніджа-баш́е
сакалера а̄ді-паті хайа ш́обга̄ па̄йа аті
стха̄йı̄ бга̄ба на̄ма па̄йа расе',
    E'', E'',
    E'The constantly flowing undercurrent and cause of all mellows is called "stayi-bhava" or basic permanent ecstasy. It is the
primary root origin of all mellows, and it eternally exists in great beauty and
splendor. As the fountainhead of rasa, it fuses all
subordinate mellows and subjugates them all under its own control. Thus, it
exhibits the topmost manifestation of its own supreme power, which contains all
inconceivable, simultaneously favorable and opposing ecstasies.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'mukhya-gauṇa-bhede tāra paricoya dwi-prakāra
mukhya pañca gauṇa sapta-bidha
santa dāsya sakhya āra bātsalya madhura sāra
ei pañca rati mukhyābhidha', E'мукхйа-ґаун̣а-бгеде та̄ра парічойа дві-прака̄ра
мукхйа пан̃ча ґаун̣а сапта-бідга
санта да̄сйа сакхйа а̄ра ба̄тсалйа мадгура са̄ра
еі пан̃ча раті мукхйа̄бгідга',
    E'', E'',
    E'In considering the differences in the various ecstatic loving moods of this
permanent ecstasy (sthayi bhava),
we see that there are two divisions of subjects which fall into:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'hāsyādbhuta bīra āra koruṇa
o raudrākara
bhayānaka-bībhatsa-bibhede
rati sapta gauṇī hoya saba kṛṣṇa-bhakti-moya
śobhā pāya rasera prabhede', E'ха̄сйа̄дбгута бı̄ра а̄ра корун̣а
о раудра̄кара
бгайа̄нака-бı̄бгатса-бібгеде
раті сапта ґаун̣ı̄ хойа саба кр̣шн̣а-бгакті-мойа
ш́обга̄ па̄йа расера прабгеде',
    E'', E'',
    E'five direct
or primary mellows, and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'', E'',
    E'', E'',
    E'seven indirect or secondary mellows. The five
principle types of affection are called santa, dasya, sakhya, vatsalya and madhura, or
neutrality, servitude, friendship, parental affection and conjugal love,
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


  -- Verse 6
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'The seven indirect affections are known as:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'hasya
(devotional laughing attachment),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'adbhuta
(devotional attachment fixed in wonder and astonishment),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'', E'',
    E'', E'',
    E'', E'',
    E'vira (chivalrous attachment with charitable and merciful
tendencies),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10',
    E'', E'',
    E'', E'',
    E'', E'',
    E'karuna (attachment in compassion with
lamentation),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11',
    E'', E'',
    E'', E'',
    E'', E'',
    E'raudra (devotion mixed with anger),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '12',
    E'', E'',
    E'', E'',
    E'', E'',
    E'bhayanaka (devotion mixed with fear), and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '13',
    E'', E'',
    E'', E'',
    E'', E'',
    E'bibhatsa (attachment enjoyed by the devotee which develops
in an abominable way). All of these mellows are found in great abundance within
the realm of devotional service to Krsna, and all these different types of
attachments exist eternally as beautiful decorations of the all-consistent sthayi bhava.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 8: Jei Rati Janme Jar
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Jei Rati Janme Jar', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 8;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'jei rati janme jāra sei mata rasa tāra
rasa mukhya pañca-bidha hoya
gauṇa-sapta-rasa punaḥ hoya ratira anuguṇa
ratira sambandha bhābāśroya', E'джеі раті джанме джа̄ра сеі мата раса та̄ра
раса мукхйа пан̃ча-бідга хойа
ґаун̣а-сапта-раса пунах̣ хойа ратіра ануґун̣а
ратіра самбандга бга̄ба̄ш́ройа',
    E'', E'',
    E'According to the
particular type of attachment that attracts one to love Krsna,
the devotee becomes attached to that degree in one of the five direct mellows.
Besides to this direct attachment, there are occasional manifestations of the
seven indirect mellows, which follow the direct attachment. Thus the seven indirect
attachments remain subjugated under the shelter of the ecstatic emotions
presented by the more predominant direct mellow.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'pañca mukhya madhye bhāi madhurera guṇa gāi
sarba-śreṣṭha rasa-rāja boli
guṇa anya rase jata madhurete āche tata
āra bahu bale hoya bali', E'пан̃ча мукхйа мадгйе бга̄і мадгурера ґун̣а ґа̄і
сарба-ш́решт̣ха раса-ра̄джа болі
ґун̣а анйа расе джата мадгурете а̄чхе тата
а̄ра баху бале хойа балі',
    E'', E'',
    E'Oh brothers! Now listen
as I sing of the glories of the madhura rasa, the sweet conjugal mellow, for it is said to be the
best and most powerful rasa amongst all the five
direct mellows. Indeed, it is just like the king of all mellows. All the
transcendental qualities of the other mellows are
fully present in this topmost of all rasas, and
therefore it is most powerful because of the combined potencies of all the
other mellows contained within it. And also, the other mellows individually
become more powerful when they are within the madhura
rasa than they are when they stand on their own.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'gauṇa rasa āche jata saba sañcārīra mata
haya srńgarera puṣṭi kore
śrī-rūpera anugata
bhajane je hoya rata
sthiti tāra kebale madhure', E'ґаун̣а раса а̄чхе джата саба сан̃ча̄рı̄ра мата
хайа срńґарера пушт̣і коре
ш́рı̄-рӯпера ануґата
бгаджане дже хойа рата
стхіті та̄ра кебале мадгуре',
    E'', E'',
    E'All the seven indirect
mellows give transitory stimulation to the madhura rasa (also called srngara rasa). They also circulate to nourish and supplement the
ecstasies of the conjugal mellow. Those devotees who develop attachment for the
worship that follows in the footsteps of Srila Rupa Gosvami become situated and
firmly established only in this conjugal mellow.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'madhura ujjwala-rasa
sadā śṛńgārera
baśa
braja-raja-nandana
biṣoya
aiśwarja su-gupta ta''te mādhurja-prabhābe
mate
tāhāra āśroya bhakta-coya', E'мадгура уджджвала-раса
сада̄ ш́р̣ńґа̄рера
баш́а
браджа-раджа-нандана
бішойа
аіш́варджа су-ґупта та''те ма̄дгурджа-прабга̄бе
мате
та̄ха̄ра а̄ш́ройа бгакта-чойа',
    E'', E'',
    E'The madhura
rasa is known as the most brilliant mellow, and its
main subject is Sri Krsna, the Son of the King of Vraja. Indeed, He actually lets Himself be controlled and
subjugated by this loving mellow. The majestic opulences
of the Lord (aisvarya) are covered over, and the
powerful maddening influence of its transcendental sweetness (madhurya) is the sole refuge of all the assembled devotees,
who are the object of this mellow.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 9: Madhurer Sthayi Bhava
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 9, E'Madhurer Sthayi Bhava', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 9;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'madhurera sthāyī bhāba labhe jate abirbhāba
boli tāhā śuno eka-mane
abhijoga o biṣoya sambandhābhimāna-dwoya
tadīya biśeṣa upamāne', E'мадгурера стха̄йı̄ бга̄ба лабге джате абірбга̄ба
болі та̄ха̄ ш́уно ека-мане
абгіджоґа о бішойа самбандга̄бгіма̄на-двойа
тадı̄йа біш́еша упама̄не',
    E'', E'',
    E'Madhura rati, or conjugal
affection, is the stayi bhava
of the madhura rasa. Now
please hear with rapt attention as I explain the sequence of its development.
The seven causal ingredients are:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'swabhāba āśroya kori'' citte rati abatori
śṛńgāra rasera kore puṣṭi
abhijoga ādi choya anye rati-hetu hoya
braja-debīra
tāhe nāhi dṛṣṭi', E'свабга̄ба а̄ш́ройа корі'' чітте раті абаторі
ш́р̣ńґа̄ра расера коре пушт̣і
абгіджоґа а̄ді чхойа анйе раті-хету хойа
браджа-дебı̄ра
та̄хе на̄хі др̣шт̣і',
    E'', E'',
    E'Abhiyoga
(expression of heartfelt emotions as joking complaints)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'swataḥ-siddhi
rati tāńre sambandhādi-sahākāre
samartha koriyā rākhe sadā
kṛṣṇa-sebā binā tāńra
udyamo nāhika āra
swīya sukha ceṣṭa nāhi kadā', E'сватах̣-сіддгі
раті та̄ńре самбандга̄ді-саха̄ка̄ре
самартха корійа̄ ра̄кхе сада̄
кр̣шн̣а-себа̄ біна̄ та̄ńра
удйамо на̄хіка а̄ра
свı̄йа сукха чешт̣а на̄хі када̄',
    E'', E'',
    E'Visaya
(the five sense perceptions of Krsna, namely sound,
touch, form, taste and smell)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'ei rati prauḍha hoya mahā-bhāba dāsa pāya
jāra tulya prāpti āra nāi
sarbādbhuta camatkāra
sambhogecchā e prakāra
barṇibāre
bākya nāhi pāi', E'еі раті прауд̣ха хойа маха̄-бга̄ба да̄са па̄йа
джа̄ра тулйа пра̄пті а̄ра на̄і
сарба̄дбгута чаматка̄ра
самбгоґеччха̄ е прака̄ра
барн̣іба̄ре
ба̄кйа на̄хі па̄і',
    E'', E'',
    E'Sambandha (Krsna''s relatives and family members)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Abhimana (the feeling that Krsna
is one''s own)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Tadiya Visesa
(Krsna''s personal specialties, like His footprints,
favorite pastures, etc.)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Upama (poetic comparison
of Krsna to other things)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Svabhava
(love that arises naturally without external stimulus)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Rati develops in the heart of the practicing devotee
when all these features act together under the shelter of the 7th ingredient svabhava, and thus the conjugal mellow becomes nourished.
However, all the Vraja gopis
have natural rati as their svabhava,
so for them there is no need of stimulation by the first six above-mentioned
ingredients headed by abhiyoga.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10',
    E'', E'',
    E'', E'',
    E'', E'',
    E'The natural, spontaneous transcendental rati of the gopis is so strongly fixed up that they merely take help
from the above-mentioned six ingredients, instead of depending on them for
stimulation. Except for Krsna''s service, there is no
question of their ever performing any other endeavor. Indeed, it is verily
impossible for them to strive for their own personal happiness at any time,
even to the slightest degree.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11',
    E'', E'',
    E'', E'',
    E'', E'',
    E'When this type of pure attachment becomes most matured, then the final stage it
attains is called maha-bhava . . . the most exalted,
sublime form of transcendental ecstasy. There is no comparison anywhere to such
bliss. Their desire for this type of selfless union is the most wonderful thing
to observe, and it really makes one astonished even to think of it. Therefore,
I can certainly find no suitable words to describe the manifestation of this
topmost divine grace called maha-bhava.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 10: Rati Prema Sneha Mana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 10, E'Rati Prema Sneha Mana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 10;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'rati prema sneha māna praṇaya
o rāgākhyāna
anurāga bhāba ei sāta
rati jata gāḍha hoya krame sapta nāma
loya
sthāyī bhāba sadā abadāta', E'раті према снеха ма̄на пран̣айа
о ра̄ґа̄кхйа̄на
анура̄ґа бга̄ба еі са̄та
раті джата ґа̄д̣ха хойа краме сапта на̄ма
лойа
стха̄йı̄ бга̄ба сада̄ абада̄та',
    E'', E'',
    E'The development of ecstatic love of Godhead gradually thickens and intensifies
as it manifests in seven stages of ecstasy known as:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'snehādi je bhāba choya prema nāme paricoya
sādhāraṇa janera nikaṭe
je bhāba kṛṣṇete
jāńra
sei bhābe kṛṣṇa tāńra
e rahasya rase nitya baṭe', E'снеха̄ді дже бга̄ба чхойа према на̄ме парічойа
са̄дга̄ран̣а джанера нікат̣е
дже бга̄ба кр̣шн̣ете
джа̄ńра
сеі бга̄бе кр̣шн̣а та̄ńра
е рахасйа расе нітйа бат̣е',
    E'', E'',
    E'Prema (general
ecstatic love for the Personality of Godhead)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'bhakta-citta-siḿhāsana ta''te upabiṣṭa hana
sthāyī bhāba sarba-bhāba-rāja
hlādinī
je para śakti tāńrasāra śuddha-bhakti
bhāba-rūpe
tāńhāra birāja', E'бгакта-чітта-сіḿха̄сана та''те упабішт̣а хана
стха̄йı̄ бга̄ба сарба-бга̄ба-ра̄джа
хла̄дінı̄
дже пара ш́акті та̄ńраса̄ра ш́уддга-бгакті
бга̄ба-рӯпе
та̄ńха̄ра біра̄джа',
    E'', E'',
    E'Sneha
(personal affection borne of a softened and melted heart)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'bibhābādi
bhāba-gaṇe nijāyatte
ānayane
korena ye rasera prokāśa
rasa nityānanda-tattwa nitya-siddha sāra-sattwa
jība-citte tāhāra bikāśa', E'бібга̄ба̄ді
бга̄ба-ґан̣е ніджа̄йатте
а̄найане
корена йе расера прока̄ш́а
раса нітйа̄нанда-таттва нітйа-сіддга са̄ра-саттва
джı̄ба-чітте та̄ха̄ра біка̄ш́а',
    E'', E'',
    E'Mana (pouting counter-love due to confidential familiarity)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Pranaya (mutually intimate love devoid of shyness
or hesitation)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Raga (highly involved attachment that disregards any offense)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Anuraga (the constant presence of supplementary
attachments that ripple and twinkle in waves of mutual charms)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Bhava (the stage of wildly relishable
exhilaration in a transparently pure yet supremely inflamed love-passion) All
these stages of the sthayi bhava
are spotlessly free from any material impurities.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'', E'',
    E'', E'',
    E'', E'',
    E'The above mentioned symptoms are all-together known as prema
(love of Godhead). According to the particular ecstatic emotions that one
develops for Krsna, then to that degree Krsna reciprocates, and this level of
secret mellow indeed continues eternally.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Being seated on the throne of the devotee''s heart, the stayi
bhava behaves like the King of all ecstasies. Rooted
in the hladini pleasure potency, whose distilled
extract is pure devotional service and, it is conspicuously present in the form
of transcendental emotional ecstasies.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11',
    E'', E'',
    E'', E'',
    E'', E'',
    E'By bringing the four principles of ecstasy, namely vibhava,
anubhava, sattvika, and sancari under its control, the hladini
manifests all mellows. These mellows are the eternal truth of bliss, eternally
perfect, the best state of purified existence; all this displays itself
widening and blooming within the core of the spirit soul''s heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 11: Raty Asvada Heta Jata
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 11, E'Raty Asvada Heta Jata', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 11;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'raty-āswāda hetu jata bibhāba
nāmete khyāta
ālambana uddīpana hoya
biṣoya-āśroya-gata ālambana dui mata
kṛṣṇa kṛṣṇa-bhakta se ubhoya', E'ратй-а̄сва̄да хету джата бібга̄ба
на̄мете кхйа̄та
а̄ламбана уддı̄пана хойа
бішойа-а̄ш́ройа-ґата а̄ламбана дуі мата
кр̣шн̣а кр̣шн̣а-бгакта се убгойа',
    E'', E'',
    E'All the things which cause one to taste his attachment to the Lord are called vibhava (special stimulants). The two divisions of these
causes are called:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'nāyakera śiromaṇi
swayaḿ kṛṣṇa
guṇa-maṇi
nitya guṇa-dhāma parāt para
tāńra bhābe anurakta guṇāḍhya
jateka bhakta
siddha eka sādhaka apara', E'на̄йакера ш́іроман̣і
свайаḿ кр̣шн̣а
ґун̣а-ман̣і
нітйа ґун̣а-дга̄ма пара̄т пара
та̄ńра бга̄бе ануракта ґун̣а̄д̣хйа
джатека бгакта
сіддга ека са̄дгака апара',
    E'', E'',
    E'alambana (the persons who are
foundations of support, and between whom love appears reciprocally), and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'bhāba uddīpana kore uddīpana nāma dhore
kṛṣṇera sambandha bastu saba
smitāsya saurabha śṛńga baḿśī
kambu khetra bhṛńga
padāńkanūpura kala-raba', E'бга̄ба уддı̄пана коре уддı̄пана на̄ма дгоре
кр̣шн̣ера самбандга басту саба
сміта̄сйа саурабга ш́р̣ńґа баḿш́ı̄
камбу кхетра бгр̣ńґа
пада̄ńканӯпура кала-раба',
    E'', E'',
    E'uddipana (the exciting factors which stimulate the
awakening of love). There are also two sides to the alambana
foundations', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'tulasī bhajana cīna bhakta jana-daraśana
ei-rūpa nānā uddīpana
bhakti-rasa-āswādane ei saba hetu-gaṇe
nirdeśila rūpa-sanātana', E'туласı̄ бгаджана чı̄на бгакта джана-дараш́ана
еі-рӯпа на̄на̄ уддı̄пана
бгакті-раса-а̄сва̄дане еі саба хету-ґан̣е
нірдеш́іла рӯпа-сана̄тана',
    E'', E'',
    E'visayathe subject of love: Krsna) and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'', E'',
    E'', E'',
    E'asraya (the object of love: Krsna''s
devotee).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Lord Krsna Himself is full of all good qualities, for He is the most
outstanding Hero amongst all heroes. He is the eternal reservoir of all
virtuous qualities, and is the Supreme Greatest of the greatest. There are
many, many devotees who are very much attached to Krsna in ecstatic love. These
devotees are also full of transcendental qualities themselves. Some of them are
known as siddha (spiritually perfect), whereas others
are sadhaka (neophyte practitioners).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'All the things which stimulate the awakening of ecstatic emotions are called uddipana. This includes Krsna''s
enchanting smile, His sweet bodily fragrance, His buffalo horn, His flute, His conchshell, His place of residence, the buzzing of the bees
in Vraja, the marks on the soles of His lotus feet,
His ankle bells, and the soft sweet sound of His voice and flute.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Other causes are the association of Srimati Tulasi Devi, the various symbols
and practices of devotional service, and the vision of the Lord''s bona fide
representatives and devotees. In this way, there are many factors to stimulate
ecstatic love. And all these causes, which induce one to taste the mellow of
devotion, have been clearly described by Srila Rupa Gosvami and Srila Sanatana Gosvami.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 12: Sri Nanda Nandana Dhana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 12, E'Sri Nanda Nandana Dhana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 12;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'śrī-nandānandana dhana tadīya ballabhā-gaṇa
madhura-rasera ālambana
gopī-gata rati jāhān gopī-cittāśroya
tāhān
kṛṣṇa-mātra biṣoya takhan', E'ш́рı̄-нанда̄нандана дгана тадı̄йа баллабга̄-ґан̣а
мадгура-расера а̄ламбана
ґопı̄-ґата раті джа̄ха̄н ґопı̄-чітта̄ш́ройа
та̄ха̄н
кр̣шн̣а-ма̄тра бішойа такхан',
    E'', E'',
    E'The delightful Son of Nanda
Maharaja considers all His loving consorts, the gopis,
to be His most valued treasure. Both He and they are the foundations of the
mellow of conjugal love. This mellow flows back and forth between them all in
these two ways:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'jāhān rati kṛṣṇa-gata raty-āśroya
kṛṣṇa-cita
gopī tāhān ratira biṣoya
biṣoya āśroya dhore'' sthāyī-bhāba
rati core
naile rati udgata nā
hoya', E'джа̄ха̄н раті кр̣шн̣а-ґата ратй-а̄ш́ройа
кр̣шн̣а-чіта
ґопı̄ та̄ха̄н ратіра бішойа
бішойа а̄ш́ройа дгоре'' стха̄йı̄-бга̄ба
раті чоре
наіле раті удґата на̄
хойа',
    E'', E'',
    E'when the rati (affection) flows
toward the gopis and takes shelter in their hearts as
the object, then Krsna becomes the one and only subject of their love, and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'bibhābete ālambana rase nitya prayojana
braje tāi kṛṣṇa gopīnātha
madana-mohana dhana brajāńganā gopī-jana
ballabha rasika rādhā-nātha', E'бібга̄бете а̄ламбана расе нітйа прайоджана
брадже та̄і кр̣шн̣а ґопı̄на̄тха
мадана-мохана дгана браджа̄ńґана̄ ґопı̄-джана
баллабга расіка ра̄дга̄-на̄тха',
    E'', E'',
    E'when the rati flows toward Krsna and takes shelter in
His heart as the object, then the gopis become the
one and only subject of His love. In this manner affection flows mutually
within the sthayi bhava
(the permanent ecstasy) because of the combination of both the subject and
object, without which there is no possibility of genuine love existing.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'swīya-parakīya-bhede rasa rasāntarāswāde
nityānanda biraje mādhaba
boro bhāgyabāna jei nije ālambana hoi''
āswādaye
se rasa-āsaba', E'свı̄йа-паракı̄йа-бгеде раса раса̄нтара̄сва̄де
нітйа̄нанда бірадже ма̄дгаба
боро бга̄ґйаба̄на джеі нідже а̄ламбана хоі''
а̄сва̄дайе
се раса-а̄саба',
    E'', E'',
    E'Thus there is the necessary functioning of this combination of foundation which
contain this love for Krsna, and these mellows are the eternal and topmost goal
of all existences. Thus within Vraja, Krsna is known as Gopinatha, the
Lord of the gopis. And the most highly valued
treasure of this Madana-Mohana is all the cowherd
maidens of Vraja, the gopis.
Krsna is their dearmost lover, their sweet relisher, and the Lord and Master of Srimati
Radharani.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Lord Madhava thoroughly enjoys Himself in full eternal
bliss as He tastes the internal mellows contained within the principles known
as sviya (love within marriage) and parakiya (unwedded love). And one who also becomes one of
these basic foundations for sharing these loving exchanges is most fortunate, for
she also tastes the maddening wine of these supremely transcendental mellows
along with Krsna Himself.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 13: Suramya Madhura Smita
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 13, E'Suramya Madhura Smita', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 13;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'su-ramya madhura-smita sarba-sal-lakhaṇānwita
balīyān
taruṇa gambhīra
bābadūka
priya-bhāṣī sudhī sapratibhāśwāsī
bidagdha catura sukhī dhīra', E'су-рамйа мадгура-сміта сарба-сал-лакхан̣а̄нвіта
балı̄йа̄н
тарун̣а ґамбгı̄ра
ба̄бадӯка
прійа-бга̄шı̄ судгı̄ сапратібга̄ш́ва̄сı̄
бідаґдга чатура сукхı̄ дгı̄ра',
    E'', E'',
    E'Lord Krsna, the supreme hero, has the most beautiful body which possesses all
good features. He has the most sweet smile, He
possesses extraordinary bodily strength, He is ever-youthfully beautiful, and
His grave plans and actions are very difficult for anyone else to understand.
He is expert at speaking meaningful words with all politeness, He is the most
pleasing talker, He is the source of all nectar, and He is a wonderful linguist
Who is fluent in all languages (even that of the
animals and birds). He is most expert in all kinds of artistic enjoyment (He
lives wonderfully at the topmost height of artistic craftsmanship), He is
cunning and clever in the art of performing various types of work
simultaneously, He is always joyful and untouched by any distress, and He is
always self-satisfied and peaceful.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'kṛtajña dakhiṇa preṣṭha
barīyān kīrtimac-chreṣṭha
lalanā-mohana
keli-para
su-nitya nūtana-mūrti kebala saundarya-sphūrti
baḿśī-gāne su-dakha tat-para', E'кр̣таджн̃а дакхін̣а прешт̣ха
барı̄йа̄н кı̄ртімач-чхрешт̣ха
лалана̄-мохана
келі-пара
су-нітйа нӯтана-мӯрті кебала саундарйа-спхӯрті
баḿш́ı̄-ґа̄не су-дакха тат-пара',
    E'', E'',
    E'Krsna is grateful by never forgetting the service of His friends, He is simple
and liberal, He is the best, and is very famous for His good works. He is very
attractive to all women, He is very playful in amorous sports, and He possesses
an eternally fresh and youthful form. He is the full manifestation of complete
transcendental beauty, He is most expert at playing His all-attractive flute,
and He is the Supreme Personality of Godhead.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'dhīrodātta
dhīra-śānta sudhīra lalitā kānta
dhīroddhata lalanā-nāyaka
ceṭaka-biṭa-beṣṭita bidūṣaka-susebita
pīṭha-marda priya narmasakha', E'дгı̄рода̄тта
дгı̄ра-ш́а̄нта судгı̄ра лаліта̄ ка̄нта
дгı̄роддгата лалана̄-на̄йака
чет̣ака-біт̣а-бешт̣іта бідӯшака-сусебіта
пı̄т̣ха-марда прійа нармасакха',
    E'', E'',
    E'Krsna is most grave, gentle, forgiving, peaceful and forbearing, self-composed,
carefree and joking, the best lover, proud and restless, and the hero of all
women. He is always surrounded by five kinds of eternal servants:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'e pañca sahāya-juta nandīśwara-pati-suta
pati-upapati-bhābācārī
anukūla śaṭha dhṛṣṭa sudakhiṇa
rasa-tṛṣṇa
rasa-mūrti nikuñja-bihārī', E'е пан̃ча саха̄йа-джута нандı̄ш́вара-паті-сута
паті-упапаті-бга̄ба̄ча̄рı̄
анукӯла ш́ат̣ха дгр̣шт̣а судакхін̣а
раса-тр̣шн̣а
раса-мӯрті нікун̃джа-біха̄рı̄',
    E'', E'',
    E'ceta (spies),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'', E'',
    E'', E'',
    E'vita (dressing
attendants).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'vidusaka
(clowns headed by Madhu-mangala),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'pitha-marda (back-massagers like Sridama),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'priya-narma-sakha (close friends.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Thus served by these five kinds of helpers, the Son of the King of Vraja enjoys various mellows, sometimes as a husband or as
an illicit lover of others'' wives. Being extremely thirsty to taste these rasas, He enjoys playing the role of four kind of heroes,
as anukula (favorable), satha
(deceitful), drsta (impertinent), and daksina (clever). Thus He sports in the amorous garden
groves as the personification of all ecstatic mellows.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 14: Suramya Di Guna Gana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 14, E'Suramya Di Guna Gana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 14;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'su-ramyādi guṇa-gaṇa hoiyāche
bibhūṣaṇa
lalanā-ucita
jata-dūra
pṛthu-prema
su-mādhurja
sampadera su-pracurja
śrī-kṛṣṇa-ballabha rasa-pūra', E'су-рамйа̄ді ґун̣а-ґан̣а хоійа̄чхе
бібгӯшан̣а
лалана̄-учіта
джата-дӯра
пр̣тху-према
су-ма̄дгурджа
сампадера су-прачурджа
ш́рı̄-кр̣шн̣а-баллабга раса-пӯра',
    E'', E'',
    E'Sri Krsna''s loving consorts are decorated quite
befittingly with all the attractive womanly graces and charms such as gorgeous beauty
and loveliness. They are decorated with these qualities to the maximum possible
degree. And all of these consorts are abundantly thriving within the current of
the most highly treasured, super-sweet, and immeasurable reservoir of pure prema. Thus, Sri Krsna''s lovers
are especially relishable for Him within the vast
realm of transcendental mellows.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'ballabha to'' dwi-prakāra
swīya parakīya
āra
mugdhā madhyā pragalbheti troya
keho ba nāyikā tāhe keho sakhī hoite cāhe
nije to'' nāyikā nāhi hoya', E'баллабга то'' дві-прака̄ра
свı̄йа паракı̄йа
а̄ра
муґдга̄ мадгйа̄ праґалбгеті тройа
кехо ба на̄йіка̄ та̄хе кехо сакхı̄ хоіте ча̄хе
нідже то'' на̄йіка̄ на̄хі хойа',
    E'', E'',
    E'Krsna has two main divisions of lovers --- those in sviya
(wedded love) and those in parakiya (unwedded love).
Heroines may also be classified as captivated, intermediate, and impudent. Some
of them take leading roles as heroines, whereas some of them simply want to
remain as an assisting friend or sakhi instead of
playing the role of a heroine.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'nāyikā-gaṇa-pradhāna rādhā candrā dui jana
saundarya-baidagdhya-guṇāśroya
sei dui madhye śreṣṭha rādhikā
kṛṣṇera preṣṭha
mahā-bhāba-swarūpa-niloya', E'на̄йіка̄-ґан̣а-прадга̄на ра̄дга̄ чандра̄ дуі джана
саундарйа-баідаґдгйа-ґун̣а̄ш́ройа
сеі дуі мадгйе ш́решт̣ха ра̄дгіка̄
кр̣шн̣ера прешт̣ха
маха̄-бга̄ба-сварӯпа-нілойа',
    E'', E'',
    E'There are two chief gopis amongst all of Krsna
heroines --- Srimati Radharani
and Sri Candravali. Both of them are the reservoirs
of the qualities of supreme transcendental beauty and cunning behavior. Amongst
these two chief gopis, Raddharani
is certainly the best, for She is most dear to Lord
Krsna. She is naturally the embodiment of the complete storehouse of the most
exalted, sublime ecstasy called mahabhava.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'āra jata nitya-priyā nija nija jūtha lañā
se du''yera korena sebana
śrī-rūpa-anuga jana śrī-rādhikā-śrī-caraṇa
binā nāhi jāne anya dhana', E'а̄ра джата нітйа-прійа̄ ніджа ніджа джӯтха лан̃а̄
се ду''йера корена себана
ш́рı̄-рӯпа-ануґа джана ш́рı̄-ра̄дгіка̄-ш́рı̄-чаран̣а
біна̄ на̄хі джа̄не анйа дгана',
    E'', E'',
    E'All the multitudes of Krsna''s other dear lovers
divide themselves into two parties, identifying either with the entourage of Srimati Radharani or with party
of Candravali. And each of them, within her preferred
group, renders services in a thousand different ways for the pleasure of one of
these two predominant heroines. However, the real followers of Srila Rupa Gosvami
possess no wealth other than full consciousness of their eternal treasure under
the shelter of Srimati Radharani''s
divine lotus feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 15: Sri Krsna Sevi Boboili
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 15, E'Sri Krsna Sevi Boboili', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 15;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'śrī-kṛṣṇe sebibo boli'' gṛha chāḍi'' kuñje coli''
jāite hoya abhisārī sakhī
kuñja sajjā kore jabe bāsaka sajjā ha''na tabe
utkaṇṭhita kṛṣṇa-patha lakhi''', E'ш́рı̄-кр̣шн̣е себібо болі'' ґр̣ха чха̄д̣і'' кун̃дже чолі''
джа̄іте хойа абгіса̄рı̄ сакхı̄
кун̃джа саджджа̄ коре джабе ба̄сака саджджа̄ ха''на табе
уткан̣т̣хіта кр̣шн̣а-патха лакхі''',
    E'', E'',
    E'Ahisarika: Only for the sake of rendering service to Krsna for His pleasure, the sahkis
who are to meet their lover at the assigned rendezvous garden abandon their
homes and proceed on the path to the pleasure grove.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'kāla ullańghiyā hori bhoga-cihna
dehe dhori''
aile hana khaṇḍitā takhana
sańkete pāiyā baise tabu kanta nā āise
bipralabdhā nāyikā to'' hana', E'ка̄ла уллаńґгійа̄ хорі бгоґа-чіхна
дехе дгорі''
аіле хана кхан̣д̣іта̄ такхана
саńкете па̄ійа̄ баісе табу канта на̄ а̄ісе
біпралабдга̄ на̄йіка̄ то'' хана',
    E'', E'',
    E'Basaka-sajja:
Then they beautify the kunja with various types of
decorations, busying themselves in the mood of preparing the bed-chamber for
their dearmost lover.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'mānera kalahe hori jana cali duḥkha kori''
kalahāntarita
santāpinī
mathurāte kānta gelo bahu-dina nā āilo
proṣita-bhartṛkā kāńgālinī', E'ма̄нера калахе хорі джана чалі дух̣кха корі''
калаха̄нтаріта
санта̄пінı̄
матхура̄те ка̄нта ґело баху-діна на̄ а̄іло
прошіта-бгартр̣ка̄ ка̄ńґа̄лінı̄',
    E'', E'',
    E'Utkanthita:
And in the process, they all repeatedly glance out the doorway, looking down
the road in greatly exhilarating eagerness, anticipating the arrival of their
beloved hero, Sri Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'nijāyatte kānte peye'' krīḍā kore kānta lo''ye
swādhīna-bhartṛkā se ramaṇī
nāyikā-mātrera hoya ei aṣṭa-daśodaya
bipralambha-sambhoga-bodhinī', E'ніджа̄йатте ка̄нте пейе'' крı̄д̣а̄ коре ка̄нта ло''йе
сва̄дгı̄на-бгартр̣ка̄ се раман̣ı̄
на̄йіка̄-ма̄трера хойа еі ашт̣а-даш́одайа
біпраламбга-самбгоґа-бодгінı̄',
    E'', E'',
    E'Khandita: When Krsna
arrives late, transgressing the fixed time of rendezvous, His body bears some
of signs of His having enjoyed Himself with another lover. At that time, the
heroine becomes extremely jealous upon observing such symptoms.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Bipralabdha: When the heroine sits waiting in the solitary
bower, and her lover does not show up at all, then She feels disappointed and
let down by His absence.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Kalahantarita: Whenever, due to some quarrel with Krsna, Radharani sends Him away
in Her anguish, then She become severely afflicted with bereavement due to
dismissing Him.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Prosita-bhartrka: When Krsna leaves Vrndavana and goes
to Mathura, not returning even after many days have
passed, then Srimati Radharani becomes most miserable and suffers terribly in
separation while Her lover is abroad.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Svadhina-bhartrka: When the heroine dominates Her
lover, and tames Him according to Her own whims, then such a lady uses Him for
Her own amorous sports. All heroines experience these eight different states of
devotional service. Thus they taste different varieties of separation and
meeting.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 16: Nayikar Siromani Vraje Radha
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 16, E'Nayikar Siromani Vraje Radha', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 16;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'nāyikāra
śiromaṇi braje rādhā ṭhākurāṇī
pañca-bidha sakhī-gaṇa tā''ra
sakhī nitya-sakhī āra prāṇa-sakhī
ataḥ para
priyā-sakhī ei hoilo cāra', E'на̄йіка̄ра
ш́іроман̣і брадже ра̄дга̄ т̣ха̄кура̄н̣ı̄
пан̃ча-бідга сакхı̄-ґан̣а та̄''ра
сакхı̄ нітйа-сакхı̄ а̄ра пра̄н̣а-сакхı̄
атах̣ пара
прійа̄-сакхı̄ еі хоіло ча̄ра',
    E'', E'',
    E'The transcendental
Goddess, Srimati Radharani,
has five different divisions of girlfriends in Vraja.
She holds Her position as the crown jewel amongst all
of these heroines. Their divisions are:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'pañcama parama-preṣṭha sakhī-gaṇa
madhye śreṣṭha
boli saba śuno bibaraṇa
kusumikā bindhyābatī dhaniṣṭhādi
braja-satī
sakhī-gaṇa madhyete gaṇana', E'пан̃чама парама-прешт̣ха сакхı̄-ґан̣а
мадгйе ш́решт̣ха
болі саба ш́уно бібаран̣а
кусуміка̄ біндгйа̄батı̄ дганішт̣ха̄ді
браджа-сатı̄
сакхı̄-ґан̣а мадгйете ґан̣ана',
    E'', E'',
    E'the sakhis,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'śrī-rūpa rati kasturī śrī-guṇa
maṇi-mañjarī
prabhṛti rādhikā-nitya-sakhī
prāṇa-sakhī bahu tāra basanti nāyikā āra
pradhāna tāhāraśaśimukhī', E'ш́рı̄-рӯпа раті кастурı̄ ш́рı̄-ґун̣а
ман̣і-ман̃джарı̄
прабгр̣ті ра̄дгіка̄-нітйа-сакхı̄
пра̄н̣а-сакхı̄ баху та̄ра басанті на̄йіка̄ а̄ра
прадга̄на та̄ха̄раш́аш́імукхı̄',
    E'', E'',
    E'the nitya-sakhis,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'kurańgākṣī mañjukeśī sumadhyā madanālasī
kamalā mādhurī kāmalatā
kandarpasundarī
āra mādhabī mālatī
āra
śaśikalā rādhā-sebā-rata', E'кураńґа̄кшı̄ ман̃джукеш́ı̄ сумадгйа̄ мадана̄ласı̄
камала̄ ма̄дгурı̄ ка̄малата̄
кандарпасундарı̄
а̄ра ма̄дгабı̄ ма̄латı̄
а̄ра
ш́аш́ікала̄ ра̄дга̄-себа̄-рата',
    E'', E'',
    E'the prana-sakhis,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'lalitā biśākhā citrā tuńgabidyā
campalatā
indulekhā rańga-debī satī
sudebīti aṣṭa-jana
parama-preṣṭha sakhī-gaṇa
rādhā-kṛṣṇe sebe eka
mati', E'лаліта̄ біш́а̄кха̄ чітра̄ туńґабідйа̄
чампалата̄
індулекха̄ раńґа-дебı̄ сатı̄
судебı̄ті ашт̣а-джана
парама-прешт̣ха сакхı̄-ґан̣а
ра̄дга̄-кр̣шн̣е себе ека
маті',
    E'', E'',
    E'the priya-sakhis, and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'the parama-presta-sakhis.
This last division is undoubtedly the best of all, for they are the dearest to
Sri Radha. Please listen carefully as I describe all
of these dear girlfriends of Hers. Counted amongst the
sakhis are gopis such as Kusumika, Vindhyavati and Dhanista who are very chaste in Vraja-dhama.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'The nitya-sakhis
include Sri Rupa Manjari,
Sri Rati Manjari, Sri Guna Manjari, and others. Radharani''s prana-sakhis are
numerous, including Sri Basanti, and Sri Nayika, and the principle gopi is
Sri Sasi-mukhi.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'The priya-sakhis
include Kurangaksi, Manjukesi,
Sumadhya, Madanalasi,
Kamala, Madhuri, Kama-lata,
Kandarpa-sundari, Madhavi, Malati, and Sasi-kala, who are
all fondly attached to rendering service to Srimati Radharani.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'', E'',
    E'', E'',
    E'', E'',
    E'There are eight parama-presta-sakhis, whose only concern is to serve Radha-Krsna with every aspect of their existence,
whole-heartedly and selflessly. They are Lalita, Visakha, Citra, Tunga-visya, Campaka-lata, Indu-lekha, Ranga-devi and Sudevi, who are
the chastest of all the sahkis.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 17: Radha Krsna Guna Gana Mitha Sakhi
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 17, E'Radha Krsna Guna Gana Mitha Sakhi', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 17;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'rādhā-kṛṣṇa-guṇa-gāna mithāsakti sambardhana
ubhayābhisāra sampadana
kṛṣṇa
sakhī-samarpaṇa
narma-bākya-āswādana
ubhayera subeśa-racana', E'ра̄дга̄-кр̣шн̣а-ґун̣а-ґа̄на мітха̄сакті самбардгана
убгайа̄бгіса̄ра сампадана
кр̣шн̣а
сакхı̄-самарпан̣а
нарма-ба̄кйа-а̄сва̄дана
убгайера субеш́а-рачана',
    E'', E'',
    E'Some of the typical services rendered by the sakhis
are:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'citta-bhāba-utgatana mitha-cchidra sańgopana
pratīpa janera subañcana
kuśala
śikhaṇa āra sammilana du''janara
byajanādi bibidha sebāna', E'чітта-бга̄ба-утґатана мітха-ччхідра саńґопана
пратı̄па джанера субан̃чана
куш́ала
ш́ікхан̣а а̄ра саммілана ду''джанара
бйаджана̄ді бібідга себа̄на',
    E'', E'',
    E'singing songs together about the glories of Radha-
Krsna,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'ubhaya kuśala dhyāna doṣe tiraskāra dāna
paraspara sandeśa bāhana
rādhikāra daśā-kāle prāṇa-rākha
su-kauśale
sakhī-sādhāraṇ akārja jana', E'убгайа куш́ала дгйа̄на доше тіраска̄ра да̄на
параспара сандеш́а ба̄хана
ра̄дгіка̄ра даш́а̄-ка̄ле пра̄н̣а-ра̄кха
су-кауш́але
сакхı̄-са̄дга̄ран̣ ака̄рджа джана',
    E'', E'',
    E'performing activities which increase Their attachment for one
another,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'jeba je sakhīra kārja
biśeṣa boliyā dharja
pradarśita ha''be jathā-sthāne
rūpānuga bhaje jeba je sakhīra
jei sebā
tad-anuga sei sebā māne', E'джеба дже сакхı̄ра ка̄рджа
біш́еша болійа̄ дгарджа
прадарш́іта ха''бе джатха̄-стха̄не
рӯпа̄нуґа бгадже джеба дже сакхı̄ра
джеі себа̄
тад-ануґа сеі себа̄ ма̄не',
    E'', E'',
    E'executing the successful performance of Their secret rendezvous,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'', E'',
    E'', E'',
    E'offering different sakhis to Krsna
for His pleasure,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'pleasing Them by allowing Them to taste the soft, joking
speech and comments of the sakhis, and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'decorating
Their bodies with different types of fascinating ornaments, flowers, and cloth,
all expertly arranged.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'The sakhis sometimes have to seek out and discover
the particular ecstatic emotion which is hidden within the deepest core of
Their hearts,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'', E'',
    E'', E'',
    E'', E'',
    E'they have to hide the faults of Radha
or Krsna at times,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10',
    E'', E'',
    E'', E'',
    E'', E'',
    E'and sometimes they have to
cheat persons who are opposed to Their meeting.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Then, understanding the
situation of Their deep-rooted, innermost feelings,
they give expert advice which', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '12',
    E'', E'',
    E'', E'',
    E'', E'',
    E'causes Them to unite happily.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '13',
    E'', E'',
    E'', E'',
    E'', E'',
    E'During the whole
time they render numerous other services spontaneously, such as fanning Them gently with jeweled peacock-tail fans and yak-tail
whisks.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '14',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Keeping in mind the benefit of Them Both, the sakhis
sometimes have to chastise Them for some fault,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '15',
    E'', E'',
    E'', E'',
    E'', E'',
    E'they are highly skilled in
remembering the momentary moods and inner desires of Radharani
when they convey messages between Radha and Krsna ( in Their presence or at other times when They are
separated),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '16',
    E'', E'',
    E'', E'',
    E'', E'',
    E'they are most expert in maintaining Radharani''s
life during the performance of Their pastimes, in accordance with the specific
changes of Her emotional ecstasies which continuously move this way and that.
These are all some of the typical services rendered during a day in the life of
Srimati Radharani''s girlfriends,', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '17',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Each sakhi is fixed up in her own specific eternal
service, which she engages in befittingly at the proper time and place. Whoever
wants to do the bhajana which strictly follows Srila Rupa Gosvami
dwells upon one particular sakhi and her seva and thus becomes her follower.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 18: Panca Sakhi Madhye Cara
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 18, E'Panca Sakhi Madhye Cara', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 18;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'pañca-sakhī madhye cāra nitya-siddha rādhikāra
se sakale sādhana nā koilo
sakhī boli'' ukta jei sādhana-prabhābe
tei
braja-rāja
pure bāsa pāilo', E'пан̃ча-сакхı̄ мадгйе ча̄ра нітйа-сіддга ра̄дгіка̄ра
се сакале са̄дгана на̄ коіло
сакхı̄ болі'' укта джеі са̄дгана-прабга̄бе
теі
браджа-ра̄джа
пуре ба̄са па̄іло',
    E'', E'',
    E'Amongst the five divisions of Radharani''s sakhis, four of these groups are nitya-siddha,
or eternally situated in their roles. They did not have to perform any
ritualistic sadhana to achieve their position. The
fifth division known as sakhi consists of new gopis who have attained residence in Vraja
by dint of their sadhana practice.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'sei sakhī dwi-prakāra sādhanete
siddha āra
sādhana-para
boliyā gaṇana
siddha boli'' ākhya tāńra gopī-deha hoilo jāńra
kori'' rāge jugala-bhajana', E'сеі сакхı̄ дві-прака̄ра са̄дганете
сіддга а̄ра
са̄дгана-пара
болійа̄ ґан̣ана
сіддга болі'' а̄кхйа та̄ńра ґопı̄-деха хоіло джа̄ńра
корі'' ра̄ґе джуґала-бгаджана',
    E'', E'',
    E'These sakhis are also of two varieties --- those
still situated in their sadhana practice as sadhaka manjaris, and those who
are already situated in their spiritual bodies beyond the rules of sadhana. Thus those who attain perfection receive the body
of a gopi and continuously worship the Divine Couple
in spontaneous love.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'kṛṣṇākṛṣṭa muni-jana tathā upaniṣad-gaṇa
je nā loilo gopīra
swarūpa
sādhana ābeśe bhaje siddhi tabu nā upaje
braja-bhāba-prāpti aparūpa', E'кр̣шн̣а̄кр̣шт̣а муні-джана татха̄ упанішад-ґан̣а
дже на̄ лоіло ґопı̄ра
сварӯпа
са̄дгана а̄беш́е бгадже сіддгі табу на̄ упадже
браджа-бга̄ба-пра̄пті апарӯпа',
    E'', E'',
    E'There are many great saints and devotees as well as the personified Upanishads
themselves who are all attracted by Lord Krsna, but who haven''t accepted the
topmost perfection of receiving the form of a gopi.
Although they are all definitely absorbed in their regulative worship of the
Lord, their eternal spiritual perfection still doesn''t awaken fully, because
attainment of the mood of Vraja is a very uncommon
and rare perfection.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'je je śruti-muni-gaṇa gopī haya su-bhajana
korilo sakhīra pada dhari''
nitya-sakhī-kṛpā-bale tat-sālokya-lābha-phale
sebā kore śrī-rādhā-śrī-hari', E'дже дже ш́руті-муні-ґан̣а ґопı̄ хайа су-бгаджана
коріло сакхı̄ра пада дгарі''
нітйа-сакхı̄-кр̣па̄-бале тат-са̄локйа-ла̄бга-пхале
себа̄ коре ш́рı̄-ра̄дга̄-ш́рı̄-харі',
    E'', E'',
    E'But it is heard from authoritative sources that there are some great souls who
execute their worship in the mood of the gopis,
catching a firm grip on the lotus feet of one of Radharani''s
girlfriends. Then, by the power of that nitya-sakhi''s
affectionate favor, one ultimately attains a residential place in that sakhi''s own abode, where she eternally spends her time
waiting on the Divine Couple Sri Radha and Sri Hari.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'debī-gaṇa
sei bhābe sakhīra sālokya-lābhe
kṛṣṇa-sebā kore sakhī
ho''ye
brajera bidhāna eho gopī binā āra keho
nā pāibe braja-juba-dwaye', E'дебı̄-ґан̣а
сеі бга̄бе сакхı̄ра са̄локйа-ла̄бге
кр̣шн̣а-себа̄ коре сакхı̄
хо''йе
браджера бідга̄на ехо ґопı̄ біна̄ а̄ра кехо
на̄ па̄ібе браджа-джуба-двайе',
    E'', E'',
    E'Thus one becomes one of Radharani''s eternal
girlfriends just to be able to render eternal service to the pleasure of Krsna
within the same abode of another sakhi. This is all
due to voluntarily accepting the mood of that sakhi.
This is actually the only real law which allows one entrance into Vraja --- that is, without the favor on another merciful gopi, it is absolutely impossible for anyone to enter into
the ecstatic eternal service of the ecstatic eternal Lovers.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 19: Parama Caitanya Hari
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 19, E'Parama Caitanya Hari', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 19;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'parama caitanya hari tāńra
śakti baneśwarī
parā śakti boli'' bede gāya
śaktimāne
sebibāre
śakti kāya-byūha
kore
nānā śakti tāhe bahirāya', E'парама чаітанйа харі та̄ńра
ш́акті банеш́варı̄
пара̄ ш́акті болі'' беде ґа̄йа
ш́актіма̄не
себіба̄ре
ш́акті ка̄йа-бйӯха
коре
на̄на̄ ш́акті та̄хе бахіра̄йа',
    E'', E'',
    E'Lord Hari is the Supreme form of consciousness, and
His potency is the Mistress of the Vrndavana forest.
All the Vedas sing about Her being the transcendental
internal potency (para-sakti). To render service to
Him Who is the potential source of all potencies, She
expands Her internal potency into many bodily forms, with numerous different types
of potencies flowing out and spouting from the energetic source in all
directions simultaneously.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'ādhāra-śaktite dhāma ahwaya-śaktite
nāma
sandhinī-śaktite bastu jata
sambit-śaktite
jñāna
taṭasthā jība-bidhāna
hlādinīte
koilo sakhī-brata', E'а̄дга̄ра-ш́актіте дга̄ма ахвайа-ш́актіте
на̄ма
сандгінı̄-ш́актіте басту джата
самбіт-ш́актіте
джн̃а̄на
тат̣астха̄ джı̄ба-бідга̄на
хла̄дінı̄те
коіло сакхı̄-брата',
    E'', E'',
    E'Her internal potency is the abode and container of all potencies, and it
invokes the other divisions called sandhini, samvit, and hladini. With its sandhini existence potency it transforms to produce all
things of substance within the spiritual and material worlds. With its samvit cognizant potency it
produces all knowledge, which has a marginal sector called jiva-sakti,
the multitude of conscious spirit souls. With its hladini
pleasure potency, the assembly of Radha''s girlfriends
are produced and enlivened.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'nitya-siddha sakhī saba hlādinīra
su-baibhaba
hlādinī-swarūpa mūla rādhā
candrābalī
ādi jata śrī-rādhāra
anugata
keho nāhe rādhā-premerabādha', E'нітйа-сіддга сакхı̄ саба хла̄дінı̄ра
су-баібгаба
хла̄дінı̄-сварӯпа мӯла ра̄дга̄
чандра̄балı̄
а̄ді джата ш́рı̄-ра̄дга̄ра
ануґата
кехо на̄хе ра̄дга̄-премераба̄дга',
    E'', E'',
    E'The topmost divine wealth of the hladini pleasure
potency is the multitude of Her girlfriends, who are
all eternally perfect in spiritual bliss. And the original root cause and
primeval source of this hladini-sakti is none other
than Srimati Radharani
Herself, Who is the embodiment of this supreme pleasure potency. Even the other
apparently opposing gopis, headed by Candravali are all actually subordinate followers of this
transcendental Goddess Sri Radha, for the fact is
that no one can possibly obstruct the gushing flow of Her
pure selfless divine love for Lord Krsna.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'premera bicitra gati prati-dwandwi
ho''ye sati
candra kore rādhā-prema puṣṭa
saba sakhīra eka-mana nānā-kaye
nānā-jana
braja-juba-dwandwe
kore tuṣṭa', E'премера бічітра ґаті праті-двандві
хо''йе саті
чандра коре ра̄дга̄-према пушт̣а
саба сакхı̄ра ека-мана на̄на̄-кайе
на̄на̄-джана
браджа-джуба-двандве
коре тушт̣а',
    E'', E'',
    E'The wonderful, unique movement of Their loving affairs
is such that Candravali appears to oppose and rival Radharani, but this simulated competition is actually
chaste, for it is meant to nourish Radharani''s pure
love for Krsna. Indeed, all the sakhis possess many
different bodies and many different moods, but their mind is factually one and
one only, for their sole, mutual interest is to give complete satisfaction and
total pleasure to the youthful Divine Couple of Vraja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 20: Krsna Krsna Bhakata Gata
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 20, E'Krsna Krsna Bhakata Gata', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 20;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'kṛṣṇa kṛṣṇa-bhakata-gaṇa guṇa nāma su-carita
maṇḍana
sambandhi taṭasthādi
bhāba jata agaṇana e rasera uddīpana
hetu boli'' bole rasa-bedi', E'кр̣шн̣а кр̣шн̣а-бгаката-ґан̣а ґун̣а на̄ма су-чаріта
ман̣д̣ана
самбандгі тат̣астха̄ді
бга̄ба джата аґан̣ана е расера уддı̄пана
хету болі'' боле раса-беді',
    E'', E'',
    E'Those who are wise regarding transcendental mellows
describe certain things which stimulate the awakening of limitless ecstatic
emotions. These things are called uddipana, and are
borne of the relationship between Krsna and His
devotees. There are six categories of uddipanas known
as:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'mānasa bācika punaḥ kāyikate tina-guṇa
nāma-kṛṣṇa śrī-rādhā-mādhaba
nṛtya baḿśī-gāna gati go-dohana
go-āhuti
aghoddhāra goṣṭhete tāṇḍaba', E'ма̄наса ба̄чіка пунах̣ ка̄йікате тіна-ґун̣а
на̄ма-кр̣шн̣а ш́рı̄-ра̄дга̄-ма̄дгаба
нр̣тйа баḿш́ı̄-ґа̄на ґаті ґо-дохана
ґо-а̄хуті
аґгоддга̄ра ґошт̣хете та̄н̣д̣аба',
    E'', E'',
    E'guna (personal qualities),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'mālyānulepana āra bāsa bhūṣā ei cāra
prakāra mandana sobhākāra
baḿśī śṛńga bīṇā raba gītaśilpa su-saurabha
padāńka-bhūṣaṇa bādya-swara', E'ма̄лйа̄нулепана а̄ра ба̄са бгӯша̄ еі ча̄ра
прака̄ра мандана собга̄ка̄ра
баḿш́ı̄ ш́р̣ńґа бı̄н̣а̄ раба ґı̄таш́ілпа су-саурабга
пада̄ńка-бгӯшан̣а ба̄дйа-свара',
    E'', E'',
    E'nama (holy names),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'śikhi-puccha
gābhī yaṣṭi beṇu śṛńga preṣṭha-dṛṣṭi
adri-dhātu nirmālya go-dhūli
bṛndābana
tad-aśrīta gobardhana rabisutā
rāsa ādi jata līlā-sthali', E'ш́ікхі-пуччха
ґа̄бгı̄ йашт̣і бен̣у ш́р̣ńґа прешт̣ха-др̣шт̣і
адрі-дга̄ту нірма̄лйа ґо-дгӯлі
бр̣нда̄бана
тад-аш́рı̄та ґобардгана рабісута̄
ра̄са а̄ді джата лı̄ла̄-стхалі',
    E'', E'',
    E'carita (characteristic activities),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'khaga bhṛńga mṛga kuñja tulasikā latā-puñja
karṇikāra
kadambādi taru
śrī-kṛṣṇa-sambandhi saba bṛndābana
su-baibhaba
uddīpana kore rasa cāru', E'кхаґа бгр̣ńґа мр̣ґа кун̃джа туласіка̄ лата̄-пун̃джа
карн̣іка̄ра
кадамба̄ді тару
ш́рı̄-кр̣шн̣а-самбандгі саба бр̣нда̄бана
су-баібгаба
уддı̄пана коре раса ча̄ру',
    E'', E'',
    E'mandana
(bodily adornments),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'jyotsnā ghana saudaminī śarat-pūrṇa-niśāmaṇi
gandha-bāha āra khaga-coya
taṭasthākhya uddīpana rasāswāda-bibhābana
kore saba hoiyā sadoya', E'джйотсна̄ ґгана саудамінı̄ ш́арат-пӯрн̣а-ніш́а̄ман̣і
ґандга-ба̄ха а̄ра кхаґа-чойа
тат̣астха̄кхйа уддı̄пана раса̄сва̄да-бібга̄бана
коре саба хоійа̄ садойа',
    E'', E'',
    E'sambandhi (related
paraphernalia), and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'tatastha (natural phenomena).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'guna (personal
qualities): there are three types of personal qualities which stimulate
ecstatic love for Krsna - those which are of the
body, of the mind, and of the words.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'', E'',
    E'', E'',
    E'', E'',
    E'nama (holy
names): there are innumerable name-stimulants such as Krsna,
Sri Radha-Madhava, etc.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10',
    E'', E'',
    E'', E'',
    E'', E'',
    E'carita
(characteristic activities): stimulants such as Krsna''s
ecstatic dancing, flute-playing, singing, mode of walking, method of milking
the cows, how he calls His cows personally, His lifting of the Govardhana hill, and His specially wild, frantic dances
with the cowherd boys out in the pasturelands.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11',
    E'', E'',
    E'', E'',
    E'', E'',
    E'mandana (bodily adornments): there are four types of
bodily adornments by which Krsna is beautified --- A)
flower decorations such as garlands, earrings, crowns, etc. B) substances that are smeared such as ground sandalwood pulp,
various oils and perfumes, etc. C) different types of
exotic clothing, sashes and scarves, etc. D) ornaments such as anklebells, belts, medallions, bangles, armlets, and crowns,
made from precious metals and jewels, etc.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '12',
    E'', E'',
    E'', E'',
    E'', E'',
    E'sambandhi
(related paraphernalia): assorted stimulants include the tooting of His flute,
the bugling of His buffalo horn, the sound of His lute-playing (vina), the technique of the songs He composes, His creativity
of design in arts and crafts, His all-pervading bodily fragrance, His
footprints, the sound of His ornaments tinkling, the sound of various other
musical instruments He plays, the peacock feathers He wears in His crown or
holds in His hand, His cows, His bejeweled walking stick, His collection of
flutes made from various materials, assorted buffalo horns, the sight of His
dear most friends, the colorful minerals from Govardhana
hill which the boys smear on themselves, forest flower garlands, the dust
raised from the cows'' hooves, and various places of pastimes that are sheltered
in Vrndavana such as Govardhana
hill, the Yamuna river (who is the Daughter of the
Sun), the place of the rasa dance, and many other
locations of pastimes, as well as large birds like peacocks and cranes, etc.,
bumblebees humming His glories, she- and he-deer, forest bowers, Tulasi trees, clusters of creepers, bright marigold plants,
trees such as the kadamba and others --- all these
things are the naturally beautiful opulences of the Vrndavana forest which stimulate the most beautiful
ecstatic mellows. This is due to the direct relationship of all these things
with Krsna and His eternal pastimes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '13',
    E'', E'',
    E'', E'',
    E'', E'',
    E'tatastha
(natural phenomena): other stimulants include the Vrndavana
moonlight, the clouds, the lightning of the rainy season, the full moon of the
autumn season, the sweetly-scented breeze, and small birds like sparrows and
finches, etc. --- all these natural opulences
together produce a favorable situation just to enable Radha-Krsna
and Their devotees to fully relish the most tasty mellows.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 21: Vibhavita Rati Jabe
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 21, E'Vibhavita Rati Jabe', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 21;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'vibhāvita rati jabe kriyāpara
ho''ye tabe
anubhāba hoya to'' udita
citta-bhāba udghāṭiyā kore bāhya su-bikriyā
jakhana je hoya to'' ucita', E'вібга̄віта раті джабе крійа̄пара
хо''йе табе
анубга̄ба хойа то'' удіта
чітта-бга̄ба удґга̄т̣ійа̄ коре ба̄хйа су-бікрійа̄
джакхана дже хойа то'' учіта',
    E'', E'',
    E'When one experiences ecstatic love stimulated by the above-mentioned uddipanas, then a natural resultant reaction occurs in
one''s body. This is called anubhava. It is like
opening the doors of the heart, thus releasing the emotions. When the ecstasy
thus comes to the external plane, some fine physical reactions become visible,
which are quite befitting of the emotions which are revealed from within the
heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'nṛtya gīta biluṇṭhana krośana tanu-moṭana
huńkāra jṛmbhana ghana-śwāsa
lokanāpekhita mati lāla-sraba
ghūrṇa ati
hikkadoyā aṭṭa aṭṭa
hāsa', E'нр̣тйа ґı̄та білун̣т̣хана крош́ана тану-мот̣ана
хуńка̄ра джр̣мбгана ґгана-ш́ва̄са
локана̄пекхіта маті ла̄ла-сраба
ґгӯрн̣а аті
хіккадойа̄ ат̣т̣а ат̣т̣а
ха̄са',
    E'', E'',
    E'The thirteen anubhavas are dancing, singing, rolling
on the ground, crying, stretching the body, loud shouting, yawning, deep
sighing, complete disregard of public opinion,
drooling, dizziness, uncontrollable hiccups, and extremely loud roaring
laughter just like a madman.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'gātra citta jata
saba
alańkāra su-bibhāba
nigadita biḿśati prakāra
udbhāswara nāma tāra dhammilyā
saḿsraṇa āra
phulla ghrāṇa nībyādi
bikāra', E'ґа̄тра чітта джата
саба
алаńка̄ра су-бібга̄ба
ніґадіта біḿш́аті прака̄ра
удбга̄свара на̄ма та̄ра дгаммілйа̄
саḿсран̣а а̄ра
пхулла ґгра̄н̣а нı̄бйа̄ді
біка̄ра',
    E'', E'',
    E'It is said that there are twenty alankaras, or
sensual enhancements of the body and mind. One type called udbhasvara
includes letting down the hair, sniffing flowers, and adjusting the belt of one''s
sari, etc.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'bilāpālāpa samlāpa
pralāpa o anulāpa
apalāpa sandeśātideśa
apadeśa upadeśa nirdeśa o byapadeśa
bācikānubhābera biśeṣa', E'біла̄па̄ла̄па самла̄па
прала̄па о анула̄па
апала̄па сандеш́а̄тідеш́а
ападеш́а упадеш́а нірдеш́а о бйападеш́а
ба̄чіка̄нубга̄бера біш́еша',
    E'', E'',
    E'There are also twelve vacika or verbal anubhavas, namely', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'', E'',
    E'', E'',
    E'vilapa
(words of lamentation),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'alapa (witty flattery),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'samlapa (conversations),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'pralapa
(frivolous babbling),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'', E'',
    E'', E'',
    E'', E'',
    E'anulapa (repeating the same
thing over and over again),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10',
    E'', E'',
    E'', E'',
    E'', E'',
    E'apalapa (giving
another meaning to a previous statement)', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11',
    E'', E'',
    E'', E'',
    E'', E'',
    E'sandesa
(sending a message to a lover afar),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '12',
    E'', E'',
    E'', E'',
    E'', E'',
    E'atidesa (to
say "his words are my words"), 9_ apadesa
(saying one thing to indicate something else),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '13',
    E'', E'',
    E'', E'',
    E'', E'',
    E'upadesa
(words of instruction),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '14',
    E'', E'',
    E'', E'',
    E'', E'',
    E'nirdesa (to clarify
"I am that same person"),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '15',
    E'', E'',
    E'', E'',
    E'', E'',
    E'vyapadesa (to
reveal the heart under another pretension).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 22: Sthayi Bhava Vista Citta
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 22, E'Sthayi Bhava Vista Citta', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 22;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'sthāyī bhābābiṣṭa citta pāiyā
bibhāba-bitta
udbhaṭa bhābete āpanāra
prāṇa-bṛtte nyasa kore prāṇa
sei nyāsa-bhore
deha prati bikṛti cālāya', E'стха̄йı̄ бга̄ба̄бішт̣а чітта па̄ійа̄
бібга̄ба-бітта
удбгат̣а бга̄бете а̄пана̄ра
пра̄н̣а-бр̣тте нйаса коре пра̄н̣а
сеі нйа̄са-бгоре
деха праті бікр̣ті ча̄ла̄йа',
    E'', E'',
    E'When one''s consciousness is overwhelmed with one''s permanent ecstasy (sthayi-bhava), and attains the wealth of all special
stimulants (vibhava), then another effect is produced
of its own accord. That is, the life-air is regulated and forcibly directed
within the body, thus causing various unusual transfigurations of the body.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'baibarṇya romañca sweda stambha kampa swara-bheda
pralayāśru
e aṣṭa bikāra
sañcārī
je bhābacoya harṣāmārṣa
āra bhoya
biṣāda
bismoyādi tāra', E'баібарн̣йа роман̃ча сведа стамбга кампа свара-бгеда
пралайа̄ш́ру
е ашт̣а біка̄ра
сан̃ча̄рı̄
дже бга̄бачойа харша̄ма̄рша
а̄ра бгойа
біша̄да
бісмойа̄ді та̄ра',
    E'', E'',
    E'The eight sattvika-vikaras are: changing of bodily
colors, standing up of hairs, perspiration, shivering, choked voice, physical
devastation, mental stupor, and torrents of tears. There are also 33 other
transitory ecstasies known as sancari, including such
emotions as jubilation, sorrow, fear, anguish, wonder, etc.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'prabṛtti kāraṇa hoya līlā-kāle rase loya
āpane koraya anukhaṇa
dhūmayitā ujjwalitā dīptā
āra su-uddīptā
ei cāri abasthālakhaṇa', E'прабр̣тті ка̄ран̣а хойа лı̄ла̄-ка̄ле расе лойа
а̄пане корайа анукхан̣а
дгӯмайіта̄ уджджваліта̄ дı̄пта̄
а̄ра су-уддı̄пта̄
еі ча̄рі абастха̄лакхан̣а',
    E'', E'',
    E'According to the particular mellow at play during any given lila
of Radha-Krsna''s eternal pastimes, then the sattvika bhava can take on four
different degrees of intensity, namely', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'jāra jei adhikāra sāttwika
bikāra tāra
se lakhaṇe
hoya to'' udoya
mahā-bhāba daśā jathā su-uddīptā bhāba tathā
anāyāse su-lakhitā hoya', E'джа̄ра джеі адгіка̄ра са̄ттвіка
біка̄ра та̄ра
се лакхан̣е
хойа то'' удойа
маха̄-бга̄ба даш́а̄ джатха̄ су-уддı̄пта̄ бга̄ба татха̄
ана̄йа̄се су-лакхіта̄ хойа',
    E'', E'',
    E'dhumyita
(smoldering),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'', E'',
    E'', E'',
    E'ujjvalita (ignited),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'dipta (burning), and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'uddipta
(blazing).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Whoever has the adhikara or the capacity of
qualification for these ecstasies experiences the awakening of the symptoms of
the eight sattvika-vikaras. However, only in the mahabhava stage (as in Srimati Radharani) is it possible to observe the ornament of the uddipta blazing ecstasy.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 23: Nirbeda Bisada Mada
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 23, E'Nirbeda Bisada Mada', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 23;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'nirbeda biṣāda mada dainya glāni śramonmāda
garba trāsa śańkā apasmṛti
ābega ālasya byādhi moha mṛtyu jaḍatādi
brīḍā abahitthā āra
smṛti', E'нірбеда біша̄да мада даінйа ґла̄ні ш́рамонма̄да
ґарба тра̄са ш́аńка̄ апасмр̣ті
а̄беґа а̄ласйа бйа̄дгі моха мр̣тйу джад̣ата̄ді
брı̄д̣а̄ абахіттха̄ а̄ра
смр̣ті',
    E'', E'',
    E'The following 33 emotions are known as vyabhicari bhavas: indifference, melancholy, madness, humility,
fatigue, vanity, pride, apprehension, fear, forgetfulness, anxiety, laziness,
malady, fascination, death, stupor, shyness, concealment, memory, debate,
fickleness, temperament, thoughtfulness, curiosity, delight, patience, envy,
violence, sleep, deep sleep, sadness and alertness.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'bitarka cāpalya mati cintautsukya
harṣa dhṛti
ugrālasya nidrāmarṣa supti
bodha hoya ei bhāba-coya trayas-triḿśat
sabe hoya
byabhicārī
nāme labhe jñapti', E'бітарка ча̄палйа маті чінтаутсукйа
харша дгр̣ті
уґра̄ласйа нідра̄марша супті
бодга хойа еі бга̄ба-чойа трайас-тріḿш́ат
сабе хойа
бйабгіча̄рı̄
на̄ме лабге джн̃апті',
    E'', E'',
    E'The vyabhicari bhava called
violence, however, can not touch the incomparably sweet madhura
rasa. All of the other vyabhicari
successively arise and flow towards the sthayi bhava, circulating themselves around it happily in their
own respective ways.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'atulya madhura rase ugrālasya
nā paraśe
āra saba bhābajathājatha
udi'' bhābābeśa sukhe sthāyī-bhābera
abhimukhe
biśeṣa
āgrahe hoya rata', E'атулйа мадгура расе уґра̄ласйа
на̄ параш́е
а̄ра саба бга̄баджатха̄джатха
уді'' бга̄ба̄беш́а сукхе стха̄йı̄-бга̄бера
абгімукхе
біш́еша
а̄ґрахе хойа рата',
    E'', E'',
    E'Under the shelter of the pure goodness produced by spontaneous devotional
attachment, these vyabhicari emotions circulate about
in conjunction with the particular rasa in play. They
are all just like waves on the sthayi bhava ocean. They arise, do their emotional work, and then
quickly slip back again into the ocean, not to be seen by anyone anymore.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'rāgāńga sattwa āśroye rasa-joga sañcaroye
jena sthāyi sāgarera ḍheu
nija kārja sādhi'' tūrṇa
sāgara koriyā
pūrṇa
nibe āra nāhi dekhe keu', E'ра̄ґа̄ńґа саттва а̄ш́ройе раса-джоґа сан̃чаройе
джена стха̄йі са̄ґарера д̣хеу
ніджа ка̄рджа са̄дгі'' тӯрн̣а
са̄ґара корійа̄
пӯрн̣а
нібе а̄ра на̄хі декхе кеу',
    E'', E'',
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


  -- Section 4, Song 24: Sadharani Samanjasa
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 24, E'Sadharani Samanjasa', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 24;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'sādhāraṇi samañjasā sthāyī
lābhe bhāba daśā
kubjā āra mahiṣī pramāṇa
eka braja-debī-gaṇe mahā-bhāba
sańghaṭane
rūḍha adhirūḍha su-bidhāna', E'са̄дга̄ран̣і саман̃джаса̄ стха̄йı̄
ла̄бге бга̄ба даш́а̄
кубджа̄ а̄ра махішı̄ прама̄н̣а
ека браджа-дебı̄-ґан̣е маха̄-бга̄ба
саńґгат̣ане
рӯд̣ха адгірӯд̣ха су-бідга̄на',
    E'', E'',
    E'The highest limits that the sthayi-bhava can attain
are fixed up according to different divisions of Krsna''s
lovers. The girl Kubja of Mathura
and Krsna''s 16,000 Queens of Dvaraka
are examples of the bhavas known respectively as sadharani (the fickle love-infatuation felt by common
girls) and samanjasa (the consistent love felt by
wives). However, only the Vraja gopis
can attain the advanced states of maha- bhava known as rudha (advanced)
and adhirudha (highly advanced).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'nimeṣāsahyatā tāya hṛn-mathane
khinna prāya
kalpa khaṇa saukhye śańkākula
ātmābadhi
bismaraṇa
khaṇa kalpa bibecana
joge bā bijoge samatula', E'німеша̄сахйата̄ та̄йа хр̣н-матхане
кхінна пра̄йа
калпа кхан̣а саукхйе ш́аńка̄кула
а̄тма̄бадгі
бісмаран̣а
кхан̣а калпа бібечана
джоґе ба̄ біджоґе саматула',
    E'', E'',
    E'The symptoms of rudha ecstasy are: intolerance of
separation even by the blinking of an eye, the churning of the hearts of
persons nearby, experiencing a millennium spent with Krsna to be like an
instant, experiencing an instant of separation from Krsna to be like a millennium,
feeling great pain in worrying about Krsna''s
happiness, and forgetfulness of self-identity. All these anubhavas
of the rudha ecstasy can be experienced in both union
and separation.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'adhirūḍha
bhābe punaḥ dwi-prakāra
bheda śuna
modana mādana nāme khyāta
biśleṣa
daśāte punaḥ modana hoya mohana
dibyonmāda tāhe hoya jata', E'адгірӯд̣ха
бга̄бе пунах̣ дві-прака̄ра
бгеда ш́уна
модана ма̄дана на̄ме кхйа̄та
біш́леша
даш́а̄те пунах̣ модана хойа мохана
дібйонма̄да та̄хе хойа джата',
    E'', E'',
    E'Now kindly hear of the two divisions of the adhirudha
maha-bhava, known as modana
(divine pleasure) and madana (madly intoxicated
amorous exhilaration). In separation from Krsna, the modana
also becomes what in known as mohana (wonder-struk astonishment) at a certain stage, thereby producing a
transcendental madness called divyonmada.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'dibyonmāda dwi-prakāra
citra-jalpodghūrṇa āra
citra-jalpa bahu-bidha tāya
mohanete śrī-rādhāra mādanākhya
daśā sāra
nitya-līlāmoyī bhāba pāya', E'дібйонма̄да дві-прака̄ра
чітра-джалподґгӯрн̣а а̄ра
чітра-джалпа баху-бідга та̄йа
моханете ш́рı̄-ра̄дга̄ра ма̄дана̄кхйа
даш́а̄ са̄ра
нітйа-лı̄ла̄мойı̄ бга̄ба па̄йа',
    E'', E'',
    E'This divyonmada also has two divisions known as', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'sādhāraṇī dhūmayitā samañjasā
sadā dīpta
rūḍhe tathoddīpta samarthāya
śuddīpta
śrī-rādhā-prema jena ujjwalita hema
modanādi bhābe sadā tāya', E'са̄дга̄ран̣ı̄ дгӯмайіта̄ саман̃джаса̄
сада̄ дı̄пта
рӯд̣хе татходдı̄пта самартха̄йа
ш́уддı̄пта
ш́рı̄-ра̄дга̄-према джена уджджваліта хема
модана̄ді бга̄бе сада̄ та̄йа',
    E'', E'',
    E'citra-jalpa (various types of insane raving speech). and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'udghurna (uncontrollably
wonder-struck giddiness). After She relishes Her mohana state of wonder-struck astonishment, Sri Radha attains an even more essential condition called madana, or madly intoxicated amorous exhilaration. This is
the summit of ecstasy that stimulates the flow of Her
eternal pastimes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'The sadharani lovers (common girls like Kubja) have smoldering love. The samanjasa
lovers (consistent wives like the Queens of Dvaraka)
have ignited love. The samartha lovers (the Vraja gopis) have burning
ecstasy; but above all of them, Sri Radha''s loving
ecstasies are brilliantly blazing like the dazzling shimmer of pure gold, for
only in Her moods can one find these topmost brilliant ecstasies headed by modana and madana.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 25: Sri Ujjvala Rasa Sara
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 25, E'Sri Ujjvala Rasa Sara', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 25;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'śrī ujjwala rasa sāra swabhābataḥ
dwi-prakāra
bipralambha sambhoga ākhyāna
binā bipralambhāśroya sambhogera puṣṭi noya
tāi bipralambhera bidhāna', E'ш́рı̄ уджджвала раса са̄ра свабга̄батах̣
дві-прака̄ра
біпраламбга самбгоґа а̄кхйа̄на
біна̄ біпраламбга̄ш́ройа самбгоґера пушт̣і нойа
та̄і біпраламбгера бідга̄на',
    E'', E'',
    E'The most brilliant mellow of conjugal love has two
natural divisions: vipralambha (separation) and sambhoga (enjoyment together). The pleasure felt in union
cannot be properly appreciated without the experience of suffering in
separation. That is the function of vipralambha.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'pūrba-rāga
tathā māna prabāsa
baicttya-jñāna
bipralambha cāri to'' prakāra
sańgamera pūrba-rīti
labhe
pūrba-rāga khyāti
darśane śrabaṇe janma tāra', E'пӯрба-ра̄ґа
татха̄ ма̄на праба̄са
баічттйа-джн̃а̄на
біпраламбга ча̄рі то'' прака̄ра
саńґамера пӯрба-рı̄ті
лабге
пӯрба-ра̄ґа кхйа̄ті
дарш́ане ш́рабан̣е джанма та̄ра',
    E'', E'',
    E'There are four types of vipralambha, namely', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'anurakta dam-patira abhiṣṭa biśleṣa
sthira
darśana birodhi bhāba māna
sa-hetu nirhetu māna praṇayera
pariṇāma
praṇayera bilāsapramāṇa', E'ануракта дам-патіра абгішт̣а біш́леша
стхіра
дарш́ана біродгі бга̄ба ма̄на
са-хету нірхету ма̄на пран̣айера
парін̣а̄ма
пран̣айера біла̄сапрама̄н̣а',
    E'', E'',
    E'purva-raga (preliminary affection),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'sāma-bheda kriyā dāne natyupekhā
su-bidhāne
sahetu mānera upaśama
deśa kāla beṇu-rabe nirhetuka mānotsabe
kore ati śīghra uparama', E'са̄ма-бгеда крійа̄ да̄не натйупекха̄
су-бідга̄не
сахету ма̄нера упаш́ама
деш́а ка̄ла бен̣у-рабе нірхетука ма̄нотсабе
коре аті ш́ı̄ґгра упарама',
    E'', E'',
    E'mana
(pouting),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'biccheda āśańkā hoite premera baicittya citte
premera swabhābe upajoya
deśa grāma banāntare priyā je prabāsa kore
prabāsākhya bipralambha hoya', E'біччхеда а̄ш́аńка̄ хоіте премера баічіттйа чітте
премера свабга̄бе упаджойа
деш́а ґра̄ма бана̄нтаре прійа̄ дже праба̄са коре
праба̄са̄кхйа біпраламбга хойа',
    E'', E'',
    E'pravasa (distant sojourn),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'prema-vaicittya (feeling separation even in the presence of
the lover). The purva-raga is the infatuated
condition that arises prior to union as a result of either seeing or hearing
about the lover.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Mana arises when one of the attached couple starts pouting
and becomes firmly determined to stay aloof from the other, being averse even
to looking at the other. This particular state of affection has two sides to
it, namely sahetu mana
(pouting for a good reason), and nirhetu mana (pouting for no reason at all). These are standard
twists which commonly occur during the course of transcendental loving affairs.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Sahetu mana can be pacified
by:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'', E'',
    E'', E'',
    E'', E'',
    E'sama (pleasing words
of consolation).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10',
    E'', E'',
    E'', E'',
    E'', E'',
    E'bheda
(witty', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 26: Darsana Aslesan Vita
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 26, E'Darsana Aslesan Vita', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 26;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'darśana āśleṣanwita ānukūlya
sebāśrīta
ullāse ārūḍha
jei bhāba
juba-dwandwa hṛdi
mājhe
rasākāre su-birājye
sambhogākhya tāra hoya lābha', E'дарш́ана а̄ш́лешанвіта а̄нукӯлйа
себа̄ш́рı̄та
улла̄се а̄рӯд̣ха
джеі бга̄ба
джуба-двандва хр̣ді
ма̄джхе
раса̄ка̄ре су-біра̄джйе
самбгоґа̄кхйа та̄ра хойа ла̄бга',
    E'', E'',
    E'Sambhoga is defined as follows: it is that ecstatic
mutual mood between the young couple Radha and Krsna which is enhanced by looking at each other, by
embracing, by worshipping and attending each other favorably, which surmounts
the highest pinnacle of elated bliss, and which is present within both Their hearts as personified rasa.
Such a mood of Theirs together is called sambhoga.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'mukhya gauṇa
dwi-prakāra
sambhogera su-bistāra
tad ubhoya cāriṭi
prakāra
sańkhipta sańkīrṇa
jāna
sampanna samṛddhimāna
pūrba bhābābasthā
anusāra', E'мукхйа ґаун̣а
дві-прака̄ра
самбгоґера су-біста̄ра
тад убгойа ча̄ріт̣і
прака̄ра
саńкхіпта саńкı̄рн̣а
джа̄на
сампанна самр̣ддгіма̄на
пӯрба бга̄ба̄бастха̄
ануса̄ра',
    E'', E'',
    E'Sambhoga expands nicely into two main headings, mukhya (primary), and gauna
(secondary). Both of these headings can each have four varieties of contacts,
namely', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'pūrba-rāgāntare jāhā sańkhipta
sambhoga tāhā
mānāntare sańkīrṇa
pramāṇe
khudra prabāsābasāne sampanna samṛddhimāne
su-dūra prabāsa
abasāne', E'пӯрба-ра̄ґа̄нтаре джа̄ха̄ саńкхіпта
самбгоґа та̄ха̄
ма̄на̄нтаре саńкı̄рн̣а
прама̄н̣е
кхудра праба̄са̄баса̄не сампанна самр̣ддгіма̄не
су-дӯра праба̄са
абаса̄не',
    E'', E'',
    E'samksipst (very brief and simple meeting),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'sampanna dwi-bidha
bhāba
āgati o prādurbhāba
manohara sambhoga
tāhāya
swapne āi saba bhāba jahe hoya ābirbhāba
tabe gauṇa
sambhoga jānāya', E'сампанна дві-бідга
бга̄ба
а̄ґаті о пра̄дурбга̄ба
манохара самбгоґа
та̄ха̄йа
свапне а̄і саба бга̄ба джахе хойа а̄бірбга̄ба
табе ґаун̣а
самбгоґа джа̄на̄йа',
    E'', E'',
    E'samkirna (narrow --- slightly hindered by fear,
etc.),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'', E'',
    E'', E'',
    E'sampanna (affluent --- a warm loving
meeting after a sojourn), and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'samrddhimana sambhoga (fully enriched to the maximum). Each of these
four types of union follows one of four types of separation as follows:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '7',
    E'', E'',
    E'', E'',
    E'', E'',
    E'The systematic appearance of the four mukhya sambhogas are', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '8',
    E'', E'',
    E'', E'',
    E'', E'',
    E'samksipt sambhoga, occurs after purva-raga
(simple union after preliminary affection),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '9',
    E'', E'',
    E'', E'',
    E'', E'',
    E'sankirna
sambhoga occurs after mana
(narrow union after pouting),', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '10',
    E'', E'',
    E'', E'',
    E'', E'',
    E'sampanna sambhoga occurs after a brief pravasa
(affluent union after a short sojourn), and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '11',
    E'', E'',
    E'', E'',
    E'', E'',
    E'samrddhimana
sambhoga occurs after a long pravasa
(fully enriched union after a long sojourn).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '12',
    E'', E'',
    E'', E'',
    E'', E'',
    E'The sampanna sambhoga has
two variations which produce very enchanting unions. They are two types of
arrivals:', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '13',
    E'', E'',
    E'', E'',
    E'', E'',
    E'agati (formal or pre-arranged arrival)
and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '14',
    E'', E'',
    E'', E'',
    E'', E'',
    E'pradurbhava (sudden appearance among those who
are eager). Also there are meetings and pastimes together in dreams. These
factual dream-lilas come under the second heading as gauna sambhoga (secondary
category of union).', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 27: Sandarsana Sa Sparsana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 27, E'Sandarsana Sa Sparsana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 27;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'sandarśana saḿsparśana jalpa bartma-nirodhana
rāsa bṛndābana-līlā bhūri
jala-keli jamunāya naukā-khelā cauryatāya
ghaṭṭa-līlā kuñje lukocuri', E'сандарш́ана саḿспарш́ана джалпа бартма-ніродгана
ра̄са бр̣нда̄бана-лı̄ла̄ бгӯрі
джала-келі джамуна̄йа наука̄-кхела̄ чаурйата̄йа
ґгат̣т̣а-лı̄ла̄ кун̃дже лукочурі',
    E'', E'',
    E'There are unlimited numbers of ecstatic lilas
which Radha and Krsna play
daily all throughout Vrndavana with Their
girlfriends. They sometimes look at each other in different ways, touch and
caress each other, converse in many different types of talks, and sometimes
block each others'' path. They sport the rasa dance,
or play different types of water sports in the Yamuna
river, and sometimes Krsna
takes the role of a boatman while They engage in different types of pastimes in
a boat on the Yamuna. There are different kinds of
joking thefts  sometimes Krsna steals Radharani''s necklace, and almost every day He gets His
flute stolen by Radharani and Her friends. Sometime They play the ghatta lila, better known as the dana-keli
 His begging of charity from the yougurt-pots
of the gopis. And sometimes They
run around playing hide-and-seek throughout the forest bowers.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'madhu-pāna badhū-beśa
kapaṭa nidrā-ābeśa
dyūta-krīḍā bastra ṭānāṭāni
cumbāśleṣa nakhārpaṇa bimbādhara
sudhā-pāna
samprajoga ādi līlā māni', E'мадгу-па̄на бадгӯ-беш́а
капат̣а нідра̄-а̄беш́а
дйӯта-крı̄д̣а̄ бастра т̣а̄на̄т̣а̄ні
чумба̄ш́леша накха̄рпан̣а бімба̄дгара
судга̄-па̄на
сампраджоґа а̄ді лı̄ла̄ ма̄ні',
    E'', E'',
    E'Sometimes They get drunk on huge quantities of
honey-wine, sometimes Krsna comes in numerous types
of women''s dress, and sometimes He pretends to be sleeping just to listen to the
sakhis talk about Him. They have gambling matches
with dice and place different kinds of bets, They
sometimes have a tug-of-war with each other''s clothes, and sometimes there is
kissing, embracing, clawing with fingernails, drinking the nectar of berry-red
lips, and conjugal union. Thus some of Radha-Krsna''s
innumerable daily pastimes are understood.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'sambhoga prakāra saba sambhogera mahotsaba
līlā hoya sadā su-peśala
sei līlā aparūpa ujjwala rasera kūpa
tāhe jāra hoya kautūhala', E'самбгоґа прака̄ра саба самбгоґера махотсаба
лı̄ла̄ хойа сада̄ су-пеш́ала
сеі лı̄ла̄ апарӯпа уджджвала расера кӯпа
та̄хе джа̄ра хойа каутӯхала',
    E'', E'',
    E'All these different types of union constantly produce a gala festival of most
charmingly beautiful playful pastimes. All these lilas are uncommonly wonderful --- they are a
veritable reservoir filled with the most brilliant mellows of the conjugal rasa.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'cid-bilāsa rasa-bhore rati-bhāba rasa dhore
mahā-bhāba
parjanta baḍaya
je jība saubhāgyabān līlā-joge
su-sandhān
braje bāsi'' satata koraya', E'чід-біла̄са раса-бгоре раті-бга̄ба раса дгоре
маха̄-бга̄ба
парджанта бад̣айа
дже джı̄ба саубга̄ґйаба̄н лı̄ла̄-джоґе
су-сандга̄н
брадже ба̄сі'' сатата корайа',
    E'', E'',
    E'Only an extremely rare and highly fortunate soul takes a curios delightful
interest in such daily lilas
of Sri Sri Radha-Krsna. He
constantly lives in Vraja and takes on all the
ecstatic moods of transcendental affection (rati),
which keeps swelling and increasing all the way up to the topmost beatific peak
of mahabhava. Thus saturated with Their
transcendental daily pastimes and absorbed in Vraja
consciousness, such a precious fortunate soul always inquires and searches
after the means to enter into those pastimes.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 28: Rasa Tattva Nitya Jaiche
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 28, E'Rasa Tattva Nitya Jaiche', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 28;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'rasa-tattwa nitya jaiche braja-tattwa nitya taiche
līlā-rasa
eka kori'' jñāna
kṛṣṇa je sākhāt
rasa sakala-i kṛṣṇera
baśa
beda bhāgabate kore gāna', E'раса-таттва нітйа джаічхе браджа-таттва нітйа таічхе
лı̄ла̄-раса
ека корі'' джн̃а̄на
кр̣шн̣а дже са̄кха̄т
раса сакала-і кр̣шн̣ера
баш́а
беда бга̄ґабате коре ґа̄на',
    E'', E'',
    E'One should make himself
aware that all the fundamental eternal truths concerning rasa,
Vraja, and Krsna''s pastimes
are one and the same principle of lila-rasa. And Krsna Himself is directly the personification of this rasa. All things are completely under His control, as
confirmed throughout the Vedas and the Srimad Bhagavatam.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'śrī-kṛṣṇa parama tattwa tāra līlā śuddha sattwa
māyā jāra dūra-sthita dāsī
jība prati kṛpā
kori'' līlā prokāśilo
hori
jībera mańgala abhilāṣī', E'ш́рı̄-кр̣шн̣а парама таттва та̄ра лı̄ла̄ ш́уддга саттва
ма̄йа̄ джа̄ра дӯра-стхіта да̄сı̄
джı̄ба праті кр̣па̄
корі'' лı̄ла̄ прока̄ш́іло
хорі
джı̄бера маńґала абгіла̄шı̄',
    E'', E'',
    E'Sri Krsna
is the Supreme Truth, and all His pastimes are of the nature of transcendental
pure goodness. Maya is situated at a distance as His humble maidservant. Just
to show His causeless mercy to all the conditioned souls, the Lord manifests
His transcendental pastimes before their very eyes within the mundane world.
This just shows how much He desires their welfare.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'brahmā śeṣe śiba jāra anweśiyā
bāra bāra
tattwa bujhibāre nāhi pāre
brahmera āśroya jini paramātmāra aḿśī
tini
swayaḿ bhagabān boli'' jā''re', E'брахма̄ ш́еше ш́іба джа̄ра анвеш́ійа̄
ба̄ра ба̄ра
таттва буджхіба̄ре на̄хі па̄ре
брахмера а̄ш́ройа джіні парама̄тма̄ра аḿш́ı̄
тіні
свайаḿ бгаґаба̄н болі'' джа̄''ре',
    E'', E'',
    E'Krsna
is Himself the only Supreme Personality of Godhead. Even Lord Brahma, Lord Anantadeva and Lord Siva are trying to find Him out again
and again, but still they are not able to understand Him fully. The vast Brahmana effulgence emanates from Him only, and the
all-cognizant Supersoul is only His tiny fractional
portion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'sei kṛṣṇa doyāmoya mūla-tattwa sarbāśroya
ananta-līlāra eka khani
nirbiśeṣa līlā bhore brahmatā prokāśa kore
swīya ańga kānti guṇa-maṇi', E'сеі кр̣шн̣а дойа̄мойа мӯла-таттва сарба̄ш́ройа
ананта-лı̄ла̄ра ека кхані
нірбіш́еша лı̄ла̄ бгоре брахмата̄ прока̄ш́а коре
свı̄йа аńґа ка̄нті ґун̣а-ман̣і',
    E'', E'',
    E'This Lord Krsna is full of all good qualities. He is most merciful,
He is the basic root of all truths, and all things in the material and
spiritual worlds rest in Him alone. He even manifests His own bodily effulgence
as the impersonal Brahman to have some impersonal pastimes. Thus He is just
like a gold-mine of unlimited lilas.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'aḿśa paramātmā ho''ye baddha-jība-gaṇa lo''ye
karma-cakre
līlā kore kota
deba-loke deba-saha upendrādi ho''ye teha
deba-līlā
kore kota śata', E'аḿш́а парама̄тма̄ хо''йе баддга-джı̄ба-ґан̣а ло''йе
карма-чакре
лı̄ла̄ коре кота
деба-локе деба-саха упендра̄ді хо''йе теха
деба-лı̄ла̄
коре кота ш́ата',
    E'', E'',
    E'His lilas
are everywhere. Becoming His own partial plenary portion as the Supersoul, He performs many lilas
by taking all the conditioned souls for a ride on the revolving wheel of fruitive action and reaction. Appearing in the higher
planetary system in incarnations such as Vamanadeva,
He performs many more lilas along with the demigods.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'parabyome nārāyaṇa ho''ye pāle dāsa-jana
deba-deba rāja rājeśwara
sei kṛṣṇa sarbāśroya braje nara-paricoya
nara-līlā korilo bistāra', E'парабйоме на̄ра̄йан̣а хо''йе па̄ле да̄са-джана
деба-деба ра̄джа ра̄джеш́вара
сеі кр̣шн̣а сарба̄ш́ройа брадже нара-парічойа
нара-лı̄ла̄ коріло біста̄ра',
    E'', E'',
    E'In the spiritual sky on
the Vaikuntha planets, He becomes Lord Narayana and maintains hosts of servants there as the God
of all Gods and the King of all Kings. This selfsame Lord Krsna,
the refuge and abode of all beings and all creations, in spite of such
incredible spiritual and material opulences, likes
most of all to appear just like an ordinary human being in Vraja,
and so He remains happy by expanding so many human-like lilas.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 4, Song 29: Krsnera Ja Teka Khela
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 4;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 29, E'Krsnera Ja Teka Khela', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 29;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'kṛṣṇera jateka khelā tāra madhye nara-līlā
sarbottama rasera āloya
e rasa
goloke nāi tabe bolo kothā pāi
braja-dhāma tāhāra niloya', E'кр̣шн̣ера джатека кхела̄ та̄ра мадгйе нара-лı̄ла̄
сарботтама расера а̄лойа
е раса
ґолоке на̄і табе боло котха̄ па̄і
браджа-дга̄ма та̄ха̄ра нілойа',
    E'', E'',
    E'Among all of Lord Krsna''s pastimes, His lila as an ordinary human being is certainly the best of
all, for these pastimes are like an unlimited reservoir of ecstatic
transcendental mellows. These mellows are not even available on other planets
in the spiritual sky. So then tell me where are they available? Such things can
only be had in the topmost abode of Vraja-dhama.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'nitya-līlā dwi-prakāra sāntara
o nirantara
jāhe mājhe rasikera mana
janma-bṛddhi
daitya-nāśa mathurā dwārakā-bāsa
nitya-līlā
sāntare gaṇana', E'нітйа-лı̄ла̄ дві-прака̄ра са̄нтара
о нірантара
джа̄хе ма̄джхе расікера мана
джанма-бр̣ддгі
даітйа-на̄ш́а матхура̄ два̄рака̄-ба̄са
нітйа-лı̄ла̄
са̄нтаре ґан̣ана',
    E'', E'',
    E'Krsna''s eternal pastimes are of two types, which are
always meditated on by those who know how to relish the mellows ---', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'dibā rātra aṣṭa-bhāge braja-jana anurāge
kore kṛṣṇa-līlā
nirantara
tāhāra birāma nāi sei nitya-līlā bhāi
brahma-rudra-śeṣa agocara', E'діба̄ ра̄тра ашт̣а-бга̄ґе браджа-джана анура̄ґе
коре кр̣шн̣а-лı̄ла̄
нірантара
та̄ха̄ра біра̄ма на̄і сеі нітйа-лı̄ла̄ бга̄і
брахма-рудра-ш́еша аґочара',
    E'', E'',
    E'santara (pastimes performed in the material world at
intervals, with a beginning and an end, but which repeat eternally), and', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'jñāna joga koro
jata hoya tāhā dūra-gata
śuddha rāga nayane kebala
sei līlā rākhita hoya parānanda
bitaroya
hoya bhakta-jībana sambala', E'джн̃а̄на джоґа коро
джата хойа та̄ха̄ дӯра-ґата
ш́уддга ра̄ґа найане кебала
сеі лı̄ла̄ ра̄кхіта хойа пара̄нанда
бітаройа
хойа бгакта-джı̄бана самбала',
    E'', E'',
    E'nirantara (pastimes performed in the spiritual world as
perpetual asta-kaliya or eight-fold daily sports).
Pastimes called santara include Krsna''s
birth, His growth through childhood and youth, the killing of many different
kinds of demons, and His journey to and residence at Mathura
and Dvaraka.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Those pastimes which are called nirantara are
performed incessantly, in eight time divisions the entire day and night. These
sports are motivated by His pure loving affection for the residents of Vraja. These pastimes do not stop even for a second ---
therefore it''s called nitya-lila, oh brothers! These
eight-fold daily pastimes are imperceptible even for Lord Brahma, Lord Siva and
Lord Ananta-sesa.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'', E'',
    E'', E'',
    E'Just toss out all of your speculative knowledge and yoga practice, for all of
these ecstatic lilas of Vraja
are just waiting for you to behold them with your eyes of unalloyed affection
opened wide. These transcendental pastimes are capable of giving you only one
thing ---topmost spiritual bliss far beyond anything you can even imagine. This
only is the sole sustenance in the lives of pure devotees who follow in the
footsteps of Srila Rupa Gosvami.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 1: Kabe Gaura Vane
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 1, E'Kabe Gaura Vane', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
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
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 2: Dekhite Dekhite
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 2, E'Dekhite Dekhite', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
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
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 3: Heno Kale Habe
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 3, E'Heno Kale Habe', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'hena kāle habe bilāsa mañjarī
anańga mañjarī āra
amare heriya ati kṛpa
kori
bolibe bacana sāra', E'хена ка̄ле хабе біла̄са ман̃джарı̄
анаńґа ман̃джарı̄ а̄ра
амаре херійа аті кр̣па
корі
болібе бачана са̄ра',
    E'', E'',
    E'When, at such a time,
will Vilasa Manjari and Ananga Manjari come along on the
same foot-path and, seeing me in this completely insane condition, will speak
to me the sweetest essence of words?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'eso, eso, sakhī! śrī-lalitā-gaṇe
janibo tomare āja
gṛha-kathā chari rādhā-kṛṣṇa
bhajo
tyājiyā
dharama-lāja', E'есо, есо, сакхı̄! ш́рı̄-лаліта̄-ґан̣е
джанібо томаре а̄джа
ґр̣ха-катха̄ чхарі ра̄дга̄-кр̣шн̣а
бгаджо
тйа̄джійа̄
дгарама-ла̄джа',
    E'', E'',
    E'They will say,
"Come, come, sakhi! Our very dear friend! From
now on you will be counted amongst the attendants of Sri Lalita
Sakhi! Giving up your household concerns and fear of
religious principles, just come along with us now and worship Sri-Sri Radha-Krsna!"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'se madhura vānī śuniyā e
jana
se dunhara śrī-caraṇe
āśraya loibe duńhe kṛpa kori
loibe lalita-sthane', E'се мадгура ва̄нı̄ ш́унійа̄ е
джана
се дунхара ш́рı̄-чаран̣е
а̄ш́райа лоібе дуńхе кр̣па корі
лоібе лаліта-стхане',
    E'', E'',
    E'Hearing such sweet
words, I will unhesitatingly take shelter of the lotus feet of both these sakhis, and they will then show me their merciful favor by
catching my hand and bringing me into the presence of Sri Lalita
Sakhi.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'lalitā sundarī sadaya hoiya
koribe amare dāsī
sva-kuñja-kutire dibena basati
jāni sebā-abhilāṣī', E'лаліта̄ сундарı̄ садайа хоійа
корібе амаре да̄сı̄
сва-кун̃джа-кутіре дібена басаті
джа̄ні себа̄-абгіла̄шı̄',
    E'', E'',
    E'Then the most beautiful
and charming Lalita Sakhi
will behave very graciously towards me and will accept me as one of her own
maidservants. She will take me and give me a residence in a small cottage in
her own garden, knowing me to be intensely desirous of rendering eternal
service.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 4: Palya Dasi Kori
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 4, E'Palya Dasi Kori', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'palya-dāsī
kori lalitā sundarī
amare loiyā kabe
śrī-rādhikā-pade kale milaibe
ajña-sebā samarpibe', E'палйа-да̄сı̄
корі лаліта̄ сундарı̄
амаре лоійа̄ кабе
ш́рı̄-ра̄дгіка̄-паде кале мілаібе
аджн̃а-себа̄ самарпібе',
    E'', E'',
    E'When will Lalita Sundari foster
me as her own aspirant novice maidservant? Then later she will offer me up unto
the lotus feet of Srimati Radharani,
and will place me entirely at Her disposal for
rendering various services according to Her own merciful orders.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'śrī rūpa mañjarī sańge jabo kabe
rasa-seba-śikṣa-tare
tad-anugā hoye rādhā-kuṇḍa
tate
rohibo harṣitāntare', E'ш́рı̄ рӯпа ман̃джарı̄ саńґе джабо кабе
раса-себа-ш́ікша-таре
тад-ануґа̄ хойе ра̄дга̄-кун̣д̣а
тате
рохібо харшіта̄нтаре',
    E'', E'',
    E'When will Sri Rupa Manjari
take me along with herself to the banks of Sri Radha-kunda
to give me lessons in the performance of services to the transcendental
mellows? She will take me there and make me practice by following her
instructions and movements. Thus I will pass my time feeling great delight
within my heart.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'śrī viśākhā-pade sańgīta
śikhibo
kṛṣṇa-līlā rasamaya
śrī rati mañjarī śrī rasa mañjarī
hoibe sabe sadaya', E'ш́рı̄ віш́а̄кха̄-паде саńґı̄та
ш́ікхібо
кр̣шн̣а-лı̄ла̄ расамайа
ш́рı̄ раті ман̃джарı̄ ш́рı̄ раса ман̃джарı̄
хоібе сабе садайа',
    E'', E'',
    E'At the lotus feet of Sri Visakha I will learn music
and songs which are all abounding in the transcendental mellows of Krsna''s pastimes. All of the other sakhis
in our group, including Sri Rati Manjari
and Sri Rasa Manjari, will also share their most kind
and affectionate dealings with me.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'parama ānande sakale miliya
rādhikā
caraṇe rabo
ei parākāṣṭhā siddhi
kabe habe
pabo rādhā-pada saba', E'парама а̄нанде сакале мілійа
ра̄дгіка̄
чаран̣е рабо
еі пара̄ка̄шт̣ха̄ сіддгі
кабе хабе
пабо ра̄дга̄-пада саба',
    E'', E'',
    E'All of us will meet together, feeling the greatest supreme bliss, and we will
remain by the lotus feet of Sri Radhika. When, oh
when will there be this highest excellence of the culmination of spiritual
perfection, whereby I will receive the intoxicating honey flowing from the
lotus feet of Srimati Radharani?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 5: Cintamani Moy
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 5, E'Cintamani Moy', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'cintāmaṇi-maya rādhā-kuṇḍa-taṭa
taha kuñja śata śata
prabāla bidruma maya taru-latā
mukta-phale abanata', E'чінта̄ман̣і-майа ра̄дга̄-кун̣д̣а-тат̣а
таха кун̃джа ш́ата ш́ата
праба̄ла бідрума майа тару-лата̄
мукта-пхале абаната',
    E'', E'',
    E'The banks of Sri Radha-kunda are made of billions of conscious, ecstatic
desire-fulfilling touchstones, and surrounding the lake are hundreds and
hundreds of beautiful transcendental gardens and groves. All the trees and
creepers in those gardens are made of coral and rubies, and the fruits they
produce are diamonds and pearls. And their branches are bending down to the
ground due to being overburdened with millions of these lovely gems.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'svānanda-sukhadā kuñja manohara
tahate kuṭīra śobhe
basiya tathaya gabo kṛṣṇa
nāma
kabe kṛṣṇa-dasya hobe', E'сва̄нанда-сукхада̄ кун̃джа манохара
тахате кут̣ı̄ра ш́обге
басійа татхайа ґабо кр̣шн̣а
на̄ма
кабе кр̣шн̣а-дасйа хобе',
    E'', E'',
    E'My small cottage is
shining beautifully within that most enchanting garden called Svananda-sukhada-kunja. Living there, I will sing Krsna''s holy name, and I will greedily hanker for that time
when I will get the service of Him and His associates.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'emona samaya muralira gāna,
pasibe e dāsī-kāne
ānanda matibo sakala bhulibo,
sri-kṛṣṇa-vamsira gane', E'емона самайа мураліра ґа̄на,
пасібе е да̄сı̄-ка̄не
а̄нанда матібо сакала бгулібо,
срі-кр̣шн̣а-вамсіра ґане',
    E'', E'',
    E'At this time, while
thinking like this, the songs of a transcendental flute will suddenly enter
this maidservant''s ear. Becoming madly excited by such a sound, I will forget
everything and will only listen spellbound to those wonderful songs of Sri Krsna''s flute.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'radhe radhe boli murali
dakibe
madīya īśwari nāma
śuniya camaki uthibe e dāsī
kemon koribe prāna', E'радге радге болі муралі
дакібе
мадı̄йа ı̄ш́варі на̄ма
ш́унійа чамакі утхібе е да̄сı̄
кемон корібе пра̄на',
    E'', E'',
    E'The low, deep sound of
His long murali flute will call out, "Radhe. . . Radhe. . ."
--- the very name of my only worshipable Empress and
Maharani! Startled with wonder by hearing such a sound, this maidservant will
then stand up in great haste with an anxious heart, wondering what to do next.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 6: Nirjana Kutire
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 6, E'Nirjana Kutire', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'nirjana kuṭīre śrī rādhā-caraṇa
smaraṇe thākibā rata
śrī rūpa mañjarī dhīre dhīre āsi
kahibe amaya', E'нірджана кут̣ı̄ре ш́рı̄ ра̄дга̄-чаран̣а
смаран̣е тха̄кіба̄ рата
ш́рı̄ рӯпа ман̃джарı̄ дгı̄ре дгı̄ре а̄сі
кахібе амайа',
    E'', E'',
    E'In my solitary cottage, I will constantly remain absorbed in the remembrance of
Sri Radha''s lotus feet. By and by, I will see Sri Rupa Manjari slowly approaching.
Coming up to me, she will then begin saying some very nice things to me.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'bolibe o'' sakhi! ki
koro basiya,
dekhaha bahire asi
yugala milana śobha nirūpama
hoibe caraṇa', E'болібе о'' сакхі! кі
коро басійа,
декхаха бахіре асі
йуґала мілана ш́обга нірӯпама
хоібе чаран̣а',
    E'', E'',
    E'She will say, "Oh sakhi! My dear friend, what
are you doing sitting here? Just come outside here and look --- just see Who is coming! The Divine Couple will now perform Their splendors, unparalleled transcendental meeting, and
today you will be one of the maidservants at Their lotus feet!"', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'svārasikī
siddhi braja-gopī dhana
parama-cañcala
sati
yogīra dheyana nirviśeṣa jñāna
na pāya ekhane', E'сва̄расікı̄
сіддгі браджа-ґопı̄ дгана
парама-чан̃чала
саті
йоґı̄ра дгейана нірвіш́еша джн̃а̄на
на па̄йа екхане',
    E'', E'',
    E'The perfections of their personal mellows which are individually exhibited by
each of the gopis of Vraja
are all the real treasures of Vrndavana, and these
individual moods are intelligently fickle and chaste. The so-called meditations
of the yogis, or the impersonal speculations of the Brahmavadis
cannot get any foothold within the realm of such transcendental mellows as those
which are naturally exhibited by the gopis.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'sākṣāt darśana madhyāhna
līlāya
rādhā-pada-sevārthinī
yakhana ye seva koroho yatane
śrī rādhā-caraṇe dhāni', E'са̄кша̄т дарш́ана мадгйа̄хна
лı̄ла̄йа
ра̄дга̄-пада-сева̄ртхінı̄
йакхана йе сева корохо йатане
ш́рı̄ ра̄дга̄-чаран̣е дга̄ні',
    E'', E'',
    E'Seeing Them personally coming and performing Their midday pastimes there at Radha-kunda,
I have become very much desirous to serve the lotus feet of Sri Radha. And whenever I get the opportunity to render some
small service, I will perform that service with the greatest care and
attention, and I will thus become rich with the treasure of Her
lotus feet.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 7: Sri Rupa Manjari Kabe Madhura
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 7, E'Sri Rupa Manjari Kabe Madhura', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'śrī rūpa mañjarī kabe madhura bacane
rādhā-kuṇḍa mahimā barnibe sańgopane', E'ш́рı̄ рӯпа ман̃джарı̄ кабе мадгура бачане
ра̄дга̄-кун̣д̣а махіма̄ барнібе саńґопане',
    E'', E'',
    E'When will Sri Rupa Manjari speak to me with
such sweet words in a private place, vividly explaining to me the
transcendental glories of Sri Radha-kunda?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'e caudda bhuvanopari vaikuntha nilaya
tad-apekṣā mathurā parama
śreṣṭha haya', E'е чаудда бгуванопарі ваікунтха нілайа
тад-апекша̄ матхура̄ парама
ш́решт̣ха хайа',
    E'', E'',
    E'"Beyond these
fourteen worlds is the spiritual abode of the Vaikuntha
planets. And beyond that, the area known as Mathura
is the topmost and supreme abode."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'mathurā-maṇḍale rāsa-līlā sthāna yatha
vṛndāvana śreṣṭa ati śuno mama kathā', E'матхура̄-ман̣д̣але ра̄са-лı̄ла̄ стха̄на йатха
вр̣нда̄вана ш́решт̣а аті ш́уно мама катха̄',
    E'', E'',
    E'"Within that Mathura-mandala, the place known as Vrndavana
is best of all, for that is where the rasa-lila takes
place. Please hear me now as I narrate these glories."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'kṛṣṇa-līlā-sthala govardhana śreṣṭhatara
rādhā-kuṇḍa śreṣṭatam
sarva-śakti-dhara', E'кр̣шн̣а-лı̄ла̄-стхала ґовардгана ш́решт̣хатара
ра̄дга̄-кун̣д̣а ш́решт̣атам
сарва-ш́акті-дгара',
    E'', E'',
    E'"Out of all the
places in Vrndavana where Krsna
performs His pastimes, the place known as Govardhana
is best. And the best place in Govardhana is Radha kunda, which possesses all
transcendental potencies."', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '5',
    E'', E'',
    E'rādhā-kuṇḍa-mahimā to'' koriyā śravaṇa
lālayita ho''ye ami
paribo takhana', E'ра̄дга̄-кун̣д̣а-махіма̄ то'' корійа̄ ш́раван̣а
ла̄лайіта хо''йе амі
парібо такхана',
    E'', E'',
    E'Whenever I hear the
glories of this sacred Radha-kunda, I become sized
with such an eager yearning that I will swoon and fall down on the spot.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '6',
    E'', E'',
    E'sakhīra caraṇe kabe koribo ākuti
sakhī kṛpa kori'' dibe svārasikī
sthiti', E'сакхı̄ра чаран̣е кабе корібо а̄куті
сакхı̄ кр̣па корі'' дібе сва̄расікı̄
стхіті',
    E'', E'',
    E'When will I ever become
so intensely eager for the lotus feet of a sakhi,
which will make her so obliged to me that she will mercifully bestow upon me
permanent situation in my own natural eternal mellow?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 8: Varane Tarit
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 8, E'Varane Tarit', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 8;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'', E'',
    E'varaṇe taḍita bāsa tārābalī
kamala mañjarī nāma
sāḍe bāra barṣa bayasa satata
svānanda-sukhada-dhāma', E'варан̣е тад̣іта ба̄са та̄ра̄балı̄
камала ман̃джарı̄ на̄ма
са̄д̣е ба̄ра барша байаса сатата
сва̄нанда-сукхада-дга̄ма',
    E'', E'',
    E'This maidservant has a complexion
just like lightning, and she is wearing a sari which has star like decorations
all over it. My name is Kamala Manjari. Eternally
appearing to be only twelve-and-a-half years of age, I always live within the
abode of Svananda-sukhada-kunja.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'', E'',
    E'karpūra sebā lalitāra gaṇa
rādhā yutheśvarī hana
mameśvarī-nātha śrī nanda-nandana
āmāra parāṇa dhana', E'карпӯра себа̄ лаліта̄ра ґан̣а
ра̄дга̄ йутхеш́варı̄ хана
мамеш́варı̄-на̄тха ш́рı̄ нанда-нандана
а̄ма̄ра пара̄н̣а дгана',
    E'', E'',
    E'I render the service of
preparing the camphor within the assembly of Lalita Sakhi, of whom Sri Radha is the
leader and the center of all their activities. And the Lord of my mistress Radha is the delightful Son of Nanda
Maharaja, Who is also the treasure of my life.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'', E'',
    E'śrī rūpa mañjari prabhṛtira sama
yugala sebāya āśa
abaśya se-rūpa sebā pābo āmi
parākāṣṭhā su-bisbāsa', E'ш́рı̄ рӯпа ман̃джарі прабгр̣тіра сама
йуґала себа̄йа а̄ш́а
абаш́йа се-рӯпа себа̄ па̄бо а̄мі
пара̄ка̄шт̣ха̄ су-бісба̄са',
    E'', E'',
    E'I always desire to
execute conjugal service similar to that which is rendered by Sri Rupa Manjari and her associates.
Thus I will certainly get utmost conviction and faith.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'', E'',
    E'kabe bā e dāsī saḿsiddhi labhibe
rādhā-kuṇḍe bāsa kori
rādhā-kṛṣṇa-seba satata koribe
pūrba smṛti parihari', E'кабе ба̄ е да̄сı̄ саḿсіддгі лабгібе
ра̄дга̄-кун̣д̣е ба̄са корі
ра̄дга̄-кр̣шн̣а-себа сатата корібе
пӯрба смр̣ті паріхарі',
    E'', E'',
    E'When will this
maidservant thus attain such complete spiritual perfection, living by the banks
of Sri Radha- kunda? I will
eternally serve Radha and Krsna,
and all of my previous memories will be automatically forgotten.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 9: Vrsabhanu Suta Carana
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 9, E'Vrsabhanu Suta Carana', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 9;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'রাধা-পক্ষ ছাড়ি'', যে-জন সে-জন,
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
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;


  -- Section 5, Song 10: Sri Krsna Virohe Radhikar Dasa
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = 5;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, 10, E'Sri Krsna Virohe Radhikar Dasa', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = 10;


  -- Verse 1
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '1',
    E'শ্রী-কৃষ্ণ-বিরহে রাধিকার দশা
আমি তো'' সহিতে নারি
যুগল-মিলন- সুখের কারণ
জীবন ছাড়িতে পারি', E'শ্রী-কৃষ্ণ-বিরহে রাধিকার দশা
আমি তো'' সহিতে নারি
যুগল-মিলন- সুখের কারণ
জীবন ছাড়িতে পারি',
    E'śrī-kṛṣṇa-birahe
rādhikāra daśā
āmi
to'' sahite nāri
jugala-milana-
sukhera kāraṇa
jībana
chāḍite pāri', E'ш́рı̄-кр̣шн̣а-бірахе
ра̄дгіка̄ра даш́а̄
а̄мі
то'' сахіте на̄рі
джуґала-мілана-
сукхера ка̄ран̣а
джı̄бана
чха̄д̣іте па̄рі',
    E'', E'',
    E'Whenever Radha is suffering in separation from Krsna and I am unable to give
any solace, my heart breaks for I am unable to tolerate seeing Her condition so
pitiful. Then I am fully prepared to give up my life for the sake of Their
happy reunion.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '2',
    E'রাধিকা-চরণ ত্যজিয়া আমার
ক্ষণেকে প্রলয় হয়
রাধিকার তরে শত-বার মরি
সে দুঃখ আমার সোয়', E'রাধিকা-চরণ ত্যজিয়া আমার
ক্ষণেকে প্রলয় হয়
রাধিকার তরে শত-বার মরি
সে দুঃখ আমার সোয়',
    E'rādhikā-caraṇa
tyajiyā āmāra
kṣaṇeke
praloya hoya
rādhikāra
tare śata-bāra mari
se
duḥkha āmāra soya', E'ра̄дгіка̄-чаран̣а
тйаджійа̄ а̄ма̄ра
кшан̣еке
пралойа хойа
ра̄дгіка̄ра
таре ш́ата-ба̄ра марі
се
дух̣кха а̄ма̄ра сойа',
    E'', E'',
    E'If
I were ever to give up the lotus feet of Sri Radhika, I would become totally
devastated in an instant. For Her sake, I am prepared to tolerate the pain and
the agony of death hundreds of times.', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '3',
    E'এ হেনো রাধার চরণ-যুগলে
পরিচর্য়্যা পা''বো কবে
হহ ব্রজ-জন মোরে দোয়া করি''
কবে ব্রজ-বনে ল''বে', E'এ হেনো রাধার চরণ-যুগলে
পরিচর্য়্যা পা''বো কবে
হহ ব্রজ-জন মোরে দোয়া করি''
কবে ব্রজ-বনে ল''বে',
    E'e
heno rādhāra caraṇa-jugale
paricarjā
pā''bo kabe
haha
braja-jana more doyā kori''
kabe
braja-bane lo''be', E'е
хено ра̄дга̄ра чаран̣а-джуґале
парічарджа̄
па̄''бо кабе
хаха
браджа-джана море дойа̄ корі''
кабе
браджа-бане ло''бе',
    E'', E'',
    E'When will I be able to serve such a divine pair of lotus feet as Radha''s? Alas,
I beg you all, oh residents of Vraja, please be merciful to me now! When will
you take me in the transcendental forests of Vrndavana?', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '4',
    E'বিলাস মঞ্জরী অনঙ্গ মঞ্জরী
শ্রী রূপ মঞ্জরী আর
আমাকে তুলিয়া লহ নিজ পদে
দেহো'' মোরে সিদ্ধি সার', E'বিলাস মঞ্জরী অনঙ্গ মঞ্জরী
শ্রী রূপ মঞ্জরী আর
আমাকে তুলিয়া লহ নিজ পদে
দেহো'' মোরে সিদ্ধি সার',
    E'bilāsa
mañjarī anańga mañjarī
śrī
rūpa mañjarī āra
āmāke
tuliyā loho nija pade
deho''
more siddhi sāra', E'біла̄са
ман̃джарı̄ анаńґа ман̃джарı̄
ш́рı̄
рӯпа ман̃джарı̄ а̄ра
а̄ма̄ке
тулійа̄ лохо ніджа паде
дехо''
море сіддгі са̄ра',
    E'', E'',
    E'Oh
Vilasa Manjari! Oh Ananga Manjari! Oh Rupa Manjari! Please lift me up and bring
me close to your own lotus feet, thus bestowing upon me the quintessence of
eternal spiritual perfection!', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
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
