-- Fix Ukrainian transliterations and expand Gaudiya Vaishnava references
-- Following the project's transliteration rules from src/utils/text/transliteration.ts

BEGIN;

-- ============================================================================
-- FIX UKRAINIAN NAMES FOR AUTHORS
-- ============================================================================

-- Founders (Pancha-tattva)
UPDATE gv_authors SET
  name_ua = 'Шрі Чаітанья Махапрабгу',
  title_ua = 'Махапрабгу'
WHERE slug = 'chaitanya-mahaprabhu';

UPDATE gv_authors SET
  name_ua = 'Шрі Нітьянанда Прабгу',
  title_ua = 'Прабгу'
WHERE slug = 'nityananda-prabhu';

UPDATE gv_authors SET
  name_ua = 'Шрі Адваіта Ачар'я',
  title_ua = 'Ачар'я'
WHERE slug = 'advaita-acharya';

UPDATE gv_authors SET
  name_ua = 'Шрі Ґададгар Пандіт',
  title_ua = 'Пандіт'
WHERE slug = 'gadadhara-pandita';

UPDATE gv_authors SET
  name_ua = 'Шрівас Т̣хакур',
  title_ua = 'Т̣хакур'
WHERE slug = 'srivasa-thakura';

-- Six Gosvamis
UPDATE gv_authors SET
  name_ua = 'Шрı̄ла Рӯпа Ґосвāмı̄',
  title_ua = 'Ґосвāмı̄'
WHERE slug = 'rupa-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шрı̄ла Санāтана Ґосвāмı̄',
  title_ua = 'Ґосвāмı̄'
WHERE slug = 'sanatana-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шрı̄ла Джı̄ва Ґосвāмı̄',
  title_ua = 'Ґосвāмı̄'
WHERE slug = 'jiva-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шрı̄ла Раґгунāтга Дāса Ґосвāмı̄',
  title_ua = 'Ґосвāмı̄'
WHERE slug = 'raghunatha-dasa-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шрı̄ла Раґгунāтга Бгат̣т̣а Ґосвāмı̄',
  title_ua = 'Ґосвāмı̄'
WHERE slug = 'raghunatha-bhatta-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шрı̄ла Ґопāла Бгат̣т̣а Ґосвāмı̄',
  title_ua = 'Ґосвāмı̄'
WHERE slug = 'gopala-bhatta-gosvami';

-- Later Acharyas
UPDATE gv_authors SET
  name_ua = 'Шрı̄ла Кр̣шн̣адāса Кавірāджа',
  title_ua = 'Кавірāджа'
WHERE slug = 'krishnadasa-kaviraja';

UPDATE gv_authors SET
  name_ua = 'Шрı̄ла Вр̣ндāвана Дāса Т̣гāкура',
  title_ua = 'Т̣гāкура'
WHERE slug = 'vrindavana-dasa-thakura';

UPDATE gv_authors SET
  name_ua = 'Шрı̄ла Нароттама Дāса Т̣гāкура',
  title_ua = 'Т̣гāкура'
WHERE slug = 'narottama-dasa-thakura';

UPDATE gv_authors SET
  name_ua = 'Шрı̄ла Віш́ванāтга Чакравартı̄ Т̣гāкура',
  title_ua = 'Т̣гāкура'
WHERE slug = 'visvanatha-chakravarti';

UPDATE gv_authors SET
  name_ua = 'Шрı̄ла Баладева Відйāбгӯшан̣а',
  title_ua = 'Відйāбгӯшан̣а'
WHERE slug = 'baladeva-vidyabhushana';

-- Modern Acharyas
UPDATE gv_authors SET
  name_ua = 'Шрı̄ла Бгактівінода Т̣гāкура',
  title_ua = 'Т̣гāкура'
WHERE slug = 'bhaktivinoda-thakura';

UPDATE gv_authors SET
  name_ua = 'Шрı̄ла Ґауракіш́ора Дāса Бāбāджı̄',
  title_ua = 'Бāбāджı̄'
WHERE slug = 'gaurakisora-dasa-babaji';

UPDATE gv_authors SET
  name_ua = 'Шрı̄ла Бгактісіддгāнта Сарасватı̄ Т̣гāкура',
  title_ua = 'Т̣гāкура'
WHERE slug = 'bhaktisiddhanta-sarasvati';

UPDATE gv_authors SET
  name_ua = 'Шрı̄ла А.Ч. Бгактіведāнта Свāмı̄ Прабгупāда',
  title_ua = 'Прабгупāда'
WHERE slug = 'bhaktivedanta-swami-prabhupada';

-- Prabhupada's disciples
UPDATE gv_authors SET
  name_ua = 'Сатсварӯпа Дāса Ґосвāмı̄',
  title_ua = 'Ґосвāмı̄'
WHERE slug = 'satsvarupa-dasa-goswami';

UPDATE gv_authors SET
  name_ua = 'Ґопіпаранадгана Дас'
WHERE slug = 'gopiparanadhana-dasa';

UPDATE gv_authors SET
  name_ua = 'Хрір̣даянанда Дас Ґосвамі',
  title_ua = 'Ґосвāмı̄'
WHERE slug = 'hridayananda-dasa-goswami';

UPDATE gv_authors SET
  name_ua = 'Ш́івāрāма Свāмı̄',
  title_ua = 'Свāмı̄'
WHERE slug = 'sivarama-swami';

UPDATE gv_authors SET
  name_ua = 'Бгакті Тı̄ртга Свāмı̄',
  title_ua = 'Свāмı̄'
WHERE slug = 'bhakti-tirtha-swami';

UPDATE gv_authors SET
  name_ua = 'Рāдгāнāтга Свāмı̄',
  title_ua = 'Свāмı̄'
WHERE slug = 'radhanatha-swami';

UPDATE gv_authors SET
  name_ua = 'Бгакті Вікāш́а Свāмı̄',
  title_ua = 'Свāмı̄'
WHERE slug = 'bhakti-vikasa-swami';

UPDATE gv_authors SET
  name_ua = 'Сачı̄нандана Свāмı̄',
  title_ua = 'Свāмı̄'
WHERE slug = 'sacinandana-swami';

UPDATE gv_authors SET
  name_ua = 'Бгāну Свāмı̄',
  title_ua = 'Свāмı̄'
WHERE slug = 'bhanu-swami';

UPDATE gv_authors SET
  name_ua = 'Джайādваіта Свāмı̄',
  title_ua = 'Свāмı̄'
WHERE slug = 'jayadvaita-swami';

UPDATE gv_authors SET
  name_ua = 'Дганурдгара Свāмı̄',
  title_ua = 'Свāмı̄'
WHERE slug = 'dhanurdhara-swami';

UPDATE gv_authors SET
  name_ua = 'Девāмр̣та Свāмı̄',
  title_ua = 'Свāмı̄'
WHERE slug = 'devamrita-swami';

-- ============================================================================
-- ADD MORE FOLLOWERS OF CHAITANYA MAHAPRABHU (Panca-tattva associates, disciples)
-- ============================================================================

INSERT INTO gv_authors (slug, name_sanskrit, name_transliteration, name_en, name_ua, title_sanskrit, title_transliteration, title_en, title_ua, birth_year, death_year, birth_place, samadhi_place, era, significance_en, significance_ua, display_order)
VALUES
  -- Haridasa Thakura
  ('haridasa-thakura', 'শ্রীল হরিদাস ঠাকুর', 'Śrīla Haridāsa Ṭhākura', 'Srila Haridasa Thakura', 'Шрı̄ла Харідāса Т̣гāкура', 'ঠাকুর', 'Ṭhākura', 'Revered One', 'Шанований', 1451, 1527, 'Buron, Bengal', 'Puri, Odisha', 'founders',
   'The namacharya (teacher of the holy name), chanted 300,000 names daily. Example of humility and devotion.',
   'Нāмāчāрйа (вчитель святого імені), оспівував 300 000 імен щодня. Приклад смиренності та відданості.',
   6),

  -- Svarupa Damodara
  ('svarupa-damodara', 'শ্রীল স্বরূপ দামোদর গোস্বামী', 'Śrīla Svarūpa Dāmodara Gosvāmī', 'Srila Svarupa Damodara Gosvami', 'Шрı̄ла Сварӯпа Дāмодара Ґосвāмı̄', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Ґосвāмı̄', NULL, 1540, 'Bengal', 'Puri, Odisha', 'founders',
   'The most intimate associate of Chaitanya in Puri, his personal secretary and the manifestation of Lalita-sakhi.',
   'Найближчий супутник Чаітанйі в Пурı̄, його особистий секретар і прояв Лалітā-сакгı̄.',
   7),

  -- Ramananda Raya
  ('ramananda-raya', 'শ্রী রামানন্দ রায়', 'Śrī Rāmānanda Rāya', 'Sri Ramananda Raya', 'Шрı̄ Рāмāнанда Рāйа', NULL, NULL, NULL, NULL, 1470, 1550, 'Puri, Odisha', 'Puri, Odisha', 'founders',
   'Governor and intimate devotee who discussed the highest topics of divine love with Mahaprabhu (Ramananda-samvada).',
   'Губернатор та близький відданий, який обговорював найвищі теми божественної любові з Махāпрабгу (Рāмāнанда-самвāда).',
   8),

  -- Pundarika Vidyanidhi
  ('pundarika-vidyanidhi', 'শ্রী পুণ্ডরীক বিদ্যানিধি', 'Śrī Puṇḍarīka Vidyānidhi', 'Sri Pundarika Vidyanidhi', 'Шрı̄ Пун̣д̣арı̄ка Відйāнідгі', NULL, NULL, NULL, NULL, NULL, NULL, 'Bengal', 'Bengal', 'founders',
   'Guru of Gadadhara Pandita, considered the incarnation of King Vrishabhanu (Radharani''s father).',
   'Ґуру Ґадāдгари Пан̣д̣іти, вважається втіленням царя Вр̣шабгāну (батька Рāдгāрāн̣ı̄).',
   9),

  -- Lokanatha Gosvami
  ('lokanatha-gosvami', 'শ্রীল লোকনাথ গোস্বামী', 'Śrīla Lokanātha Gosvāmī', 'Srila Lokanatha Gosvami', 'Шрı̄ла Локанāтга Ґосвāмı̄', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Ґосвāмı̄', 1480, 1580, 'Bengal', 'Vrindavan', 'gosvamis',
   'Intimate associate of Mahaprabhu and guru of Narottama Dasa Thakura.',
   'Близький супутник Махāпрабгу та ґуру Нароттами Дāси Т̣гāкури.',
   16),

  -- Bhugarbha Gosvami
  ('bhugarbha-gosvami', 'শ্রীল ভূগর্ভ গোস্বামী', 'Śrīla Bhūgarbha Gosvāmī', 'Srila Bhugarbha Gosvami', 'Шрı̄ла Бгӯґарбга Ґосвāмı̄', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Ґосвāмı̄', NULL, NULL, 'Bengal', 'Vrindavan', 'gosvamis',
   'Close associate of Lokanatha Gosvami, discovered many sacred places in Vraja.',
   'Близький супутник Локанāтги Ґосвāмı̄, відкрив багато священних місць у Враджі.',
   17),

  -- Kavi Karnapura
  ('kavi-karnapura', 'শ্রীল কবি কর্ণপুর', 'Śrīla Kavi Karṇapūra', 'Srila Kavi Karnapura', 'Шрı̄ла Каві Карн̣апӯра', NULL, NULL, 'King of Poets', 'Цар поетів', 1524, 1604, 'Puri, Odisha', 'Puri, Odisha', 'later_acharyas',
   'Son of Sivananda Sena, wrote Sanskrit dramas and the Gaura-ganoddesa-dipika.',
   'Син Ш́івāнанди Сени, написав санскритські драми та Ґаура-ґан̣оддеш́а-дı̄піку.',
   25),

  -- Prabhodhananda Sarasvati
  ('prabodhanananda-sarasvati', 'শ্রীল প্রবোধানন্দ সরস্বতী', 'Śrīla Prabodhānanda Sarasvatī', 'Srila Prabodhanananda Sarasvati', 'Шрı̄ла Прабодгāнанда Сарасватı̄', NULL, NULL, NULL, NULL, NULL, NULL, 'South India', 'Vrindavan', 'later_acharyas',
   'Uncle of Gopala Bhatta Gosvami, author of Radha-rasa-sudha-nidhi and Vrindavana-mahimamrta.',
   'Дядько Ґопāли Бгат̣т̣и Ґосвāмı̄, автор Рāдгā-раса-судгā-нідгı̄ та Вр̣ндāвана-махімāмр̣ти.',
   26),

  -- Shyamananda Prabhu
  ('shyamananda-prabhu', 'শ্রীল শ্যামানন্দ প্রভু', 'Śrīla Śyāmānanda Prabhu', 'Srila Shyamananda Prabhu', 'Шрı̄ла Ш́йāмāнанда Прабгу', 'প্রভু', 'Prabhu', 'Lord', 'Господь', 1535, 1630, 'Orissa', 'Vrindavan', 'later_acharyas',
   'Disciple of Jiva Gosvami who spread the movement in Orissa.',
   'Учень Джı̄ви Ґосвāмı̄, який поширив рух в Орісі.',
   27),

  -- Srinivasa Acharya
  ('srinivasa-acharya', 'শ্রীল শ্রীনিবাস আচার্য', 'Śrīla Śrīnivāsa Ācārya', 'Srila Srinivasa Acharya', 'Шрı̄ла Шрı̄нівāса Āчāрйа', 'আচার্য', 'Ācārya', 'Teacher', 'Вчитель', 1517, 1610, 'Bengal', 'Bengal', 'later_acharyas',
   'Disciple of Jiva Gosvami, carried the Gosvami literature to Bengal with Narottama and Shyamananda.',
   'Учень Джı̄ви Ґосвāмı̄, переніс літературу Ґосвāмı̄ до Бенґалії з Нароттамою та Ш́йāмāнандою.',
   28)

ON CONFLICT (slug) DO UPDATE SET
  name_ua = EXCLUDED.name_ua,
  title_ua = EXCLUDED.title_ua,
  significance_en = EXCLUDED.significance_en,
  significance_ua = EXCLUDED.significance_ua,
  updated_at = now();

-- Set guru relationships
UPDATE gv_authors SET guru_id = (SELECT id FROM gv_authors WHERE slug = 'chaitanya-mahaprabhu') WHERE slug IN ('haridasa-thakura', 'svarupa-damodara', 'ramananda-raya', 'pundarika-vidyanidhi', 'lokanatha-gosvami', 'bhugarbha-gosvami');
UPDATE gv_authors SET guru_id = (SELECT id FROM gv_authors WHERE slug = 'jiva-gosvami') WHERE slug IN ('shyamananda-prabhu', 'srinivasa-acharya');
UPDATE gv_authors SET guru_id = (SELECT id FROM gv_authors WHERE slug = 'lokanatha-gosvami') WHERE slug = 'narottama-dasa-thakura';

-- ============================================================================
-- ADD MORE PRABHUPADA DISCIPLES
-- ============================================================================

INSERT INTO gv_authors (slug, name_sanskrit, name_transliteration, name_en, name_ua, title_sanskrit, title_transliteration, title_en, title_ua, birth_year, death_year, birth_place, era, significance_en, significance_ua, display_order)
VALUES
  ('tamal-krishna-goswami', NULL, 'Tamāla Kṛṣṇa Gosvāmī', 'Tamal Krishna Goswami', 'Тамāла Кр̣шн̣а Ґосвāмı̄', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Ґосвāмı̄', 1946, 2002, 'New York, USA', 'prabhupada_disciples',
   'Personal secretary of Prabhupada, GBC, author of Servant of the Servant.',
   'Особистий секретар Прабгупāди, ДжБС, автор "Слуги слуги".',
   52),

  ('giriraj-swami', NULL, 'Giriṛāja Svāmī', 'Giriraj Swami', 'Ґірірāджа Свāмı̄', 'স্বামী', 'Svāmī', 'Master', 'Свāмı̄', 1947, NULL, 'Chicago, USA', 'prabhupada_disciples',
   'Pioneer in India, established ISKCON in Bombay, author of Many Moons.',
   'Піонер в Індії, заснував ІСККОН у Бомбеї, автор "Багатьох місяців".',
   53),

  ('indradyumna-swami', NULL, 'Indradyumna Svāmī', 'Indradyumna Swami', 'Індрадйумна Свāмı̄', 'স্বামী', 'Svāmī', 'Master', 'Свāмı̄', 1949, NULL, 'USA', 'prabhupada_disciples',
   'Famous traveling preacher, organized Polish Tour festivals, author of Diary of a Traveling Preacher.',
   'Відомий мандрівний проповідник, організатор фестивалів Польської турне, автор "Щоденника мандрівного проповідника".',
   54),

  ('jayapataka-swami', NULL, 'Jayapatāka Svāmī', 'Jayapataka Swami', 'Джайапатāка Свāмı̄', 'স্বামী', 'Svāmī', 'Master', 'Свāмı̄', 1949, NULL, 'USA', 'prabhupada_disciples',
   'Pioneer in Mayapur development, GBC, initiated thousands of disciples.',
   'Піонер розвитку Маяпуру, ДжБС, ініціював тисячі учнів.',
   55),

  ('bhakti-charu-swami', NULL, 'Bhakti Cāru Svāmī', 'Bhakti Charu Swami', 'Бгакті Чāру Свāмı̄', 'স্বামী', 'Svāmī', 'Master', 'Свāмı̄', 1945, 2020, 'Bengal, India', 'prabhupada_disciples',
   'Personal servant of Prabhupada, translated works into Bengali, GBC.',
   'Особистий слуга Прабгупāди, переклав праці бенґалı̄, ДжБС.',
   56),

  ('bir-krishna-das-goswami', NULL, 'Bīr Kṛṣṇa Dāsa Gosvāmī', 'Bir Krishna Das Goswami', 'Бı̄р Кр̣шн̣а Дāса Ґосвāмı̄', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Ґосвāмı̄', 1948, NULL, 'USA', 'prabhupada_disciples',
   'GBC, initiating guru, known for his Bhagavatam classes.',
   'ДжБС, ініціюючий ґуру, відомий своїми заняттями з Бгāґаватам.',
   57),

  ('urmila-devi-dasi', NULL, 'Urmilā Devī Dāsī', 'Urmila Devi Dasi', 'Урмı̄лā Девı̄ Дāсı̄', NULL, NULL, NULL, NULL, 1955, NULL, 'USA', 'prabhupada_disciples',
   'Pioneer in Vaishnava education, author of Vaikuntha Children.',
   'Піонер у вайшнавській освіті, автор "Діти Вайкун̣т̣гі".',
   58),

  ('bhurijan-dasa', NULL, 'Bhūrijana Dāsa', 'Bhurijan Dasa', 'Бгӯріджана Дāса', NULL, NULL, NULL, NULL, 1948, NULL, 'USA', 'prabhupada_disciples',
   'Senior teacher, author of analytical works on Bhagavatam.',
   'Старший вчитель, автор аналітичних праць з Бгāґаватам.',
   59),

  ('krishna-kshetra-swami', NULL, 'Kṛṣṇa-kṣetra Svāmī', 'Krishna-kshetra Swami', 'Кр̣шн̣а-кшетра Свāмı̄', 'স্বামী', 'Svāmī', 'Master', 'Свāмı̄', 1957, NULL, 'USA', 'prabhupada_disciples',
   'Academic scholar, author of Rethinking Religion in India.',
   'Академічний вчений, автор "Переосмислення релігії в Індії".',
   60)

ON CONFLICT (slug) DO UPDATE SET
  name_ua = EXCLUDED.name_ua,
  updated_at = now();

-- Set guru relationships
UPDATE gv_authors SET guru_id = (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada')
WHERE slug IN ('tamal-krishna-goswami', 'giriraj-swami', 'indradyumna-swami', 'jayapataka-swami', 'bhakti-charu-swami', 'bir-krishna-das-goswami', 'urmila-devi-dasi', 'bhurijan-dasa', 'krishna-kshetra-swami');

-- ============================================================================
-- ADD MORE BOOKS BY NEW AUTHORS
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_ua, author_id, category, subcategory, original_language, importance_level, significance_en, significance_ua, display_order)
VALUES
  -- Kavi Karnapura
  ('gaura-ganoddesa-dipika', 'গৌরগণোদ্দেশদীপিকা', 'Gaura-gaṇoddeśa-dīpikā', 'Gaura-ganoddesa-dipika', 'Ґаура-ґан̣оддеш́а-дı̄пı̄кā',
   (SELECT id FROM gv_authors WHERE slug = 'kavi-karnapura'),
   'shastra', 'theology', 'sanskrit', 4,
   'Identifies the eternal identities of Mahaprabhu''s associates as Krishna''s Vraja associates.',
   'Визначає вічні ідентичності супутників Махāпрабгу як супутників Крı̄шн̣и з Враджі.',
   400),

  ('caitanya-candramrita', 'চৈতন্যচন্দ্রামৃত', 'Caitanya-candrāmṛta', 'Chaitanya-chandramrita', 'Чаітанйа-чандрāмр̣та',
   (SELECT id FROM gv_authors WHERE slug = 'kavi-karnapura'),
   'stotra', 'stuti', 'sanskrit', 4,
   'Beautiful prayers glorifying Chaitanya Mahaprabhu as the moon of divine love.',
   'Прекрасні молитви, що прославляють Чаітанйу Махāпрабгу як місяць божественної любові.',
   401),

  -- Prabodhanananda Sarasvati
  ('radha-rasa-sudha-nidhi', 'রাধারসসুধানিধি', 'Rādhā-rasa-sudhā-nidhi', 'Radha-rasa-sudha-nidhi', 'Рāдгā-раса-судгā-нідгı̄',
   (SELECT id FROM gv_authors WHERE slug = 'prabodhanananda-sarasvati'),
   'stotra', 'stuti', 'sanskrit', 5,
   'Exalted prayers to Radharani, describing the ocean of nectar of Her divine love.',
   'Піднесені молитви до Рāдгāрāн̣ı̄, що описують океан нектару Її божественної любові.',
   402),

  ('vrindavana-mahimamrta', 'বৃন্দাবনমহিমামৃত', 'Vṛndāvana-mahimāmṛta', 'Vrindavana-mahimamrta', 'Вр̣ндāвана-махімāмр̣та',
   (SELECT id FROM gv_authors WHERE slug = 'prabodhanananda-sarasvati'),
   'stotra', 'tirtha', 'sanskrit', 4,
   'Glorification of Vrindavan-dhama and its spiritual significance.',
   'Прославлення Вр̣ндāвана-дгāми та її духовного значення.',
   403),

  -- Indradyumna Swami
  ('diary-traveling-preacher', NULL, 'Diary of a Traveling Preacher', 'Diary of a Traveling Preacher', 'Щоденник мандрівного проповідника',
   (SELECT id FROM gv_authors WHERE slug = 'indradyumna-swami'),
   'prabandha', 'memoir', 'english', 4,
   'Multi-volume memoirs of preaching experiences around the world.',
   'Багатотомні мемуари проповідницького досвіду по всьому світу.',
   410),

  -- Tamal Krishna Goswami
  ('servant-of-servant', NULL, 'Servant of the Servant', 'Servant of the Servant', 'Слуга слуги',
   (SELECT id FROM gv_authors WHERE slug = 'tamal-krishna-goswami'),
   'prabandha', 'memoir', 'english', 4,
   'Memoirs of personal service to Srila Prabhupada.',
   'Мемуари особистого служіння Шрı̄лі Прабгупāді.',
   411),

  ('tkg-diary', NULL, 'TKG''s Diary', 'TKG''s Diary', 'Щоденник ТКҐ',
   (SELECT id FROM gv_authors WHERE slug = 'tamal-krishna-goswami'),
   'prabandha', 'memoir', 'english', 5,
   'Diary of Prabhupada''s final days, essential historical document.',
   'Щоденник останніх днів Прабгупāди, важливий історичний документ.',
   412),

  -- Giriraj Swami
  ('many-moons', NULL, 'Many Moons', 'Many Moons', 'Багато місяців',
   (SELECT id FROM gv_authors WHERE slug = 'giriraj-swami'),
   'prabandha', 'memoir', 'english', 4,
   'Reflections on personal experiences with Srila Prabhupada and in ISKCON.',
   'Роздуми про особистий досвід зі Шрı̄лою Прабгупāдою та в ІСККОН.',
   413),

  -- Bhurijan Dasa
  ('surrender-unto-me', NULL, 'Surrender Unto Me', 'Surrender Unto Me', 'Віддайся Мені',
   (SELECT id FROM gv_authors WHERE slug = 'bhurijan-dasa'),
   'shastra', 'commentary', 'english', 4,
   'Analytical study of the Bhagavad-gita.',
   'Аналітичне вивчення Бгаґавад-ґı̄ти.',
   414)

ON CONFLICT (slug) DO UPDATE SET
  title_ua = EXCLUDED.title_ua,
  updated_at = now();

-- ============================================================================
-- FIX UKRAINIAN TITLES FOR BOOKS
-- ============================================================================

UPDATE gv_book_references SET title_ua = 'Бгаґавад-ґı̄та̄ (Пı̄сня Бога)' WHERE slug = 'bhagavad-gita';
UPDATE gv_book_references SET title_ua = 'Шрı̄мад-Бгāґаватам (Прекрасна оповідь про Бога)' WHERE slug = 'srimad-bhagavatam';
UPDATE gv_book_references SET title_ua = 'Шрı̄ Īш́опанı̄шад' WHERE slug = 'sri-isopanishad';
UPDATE gv_book_references SET title_ua = 'Брагма-самхı̄тā' WHERE slug = 'brahma-samhita';
UPDATE gv_book_references SET title_ua = 'Ведāнта-сӯтра' WHERE slug = 'vedanta-sutra';
UPDATE gv_book_references SET title_ua = 'Ш́ı̄кшāшт̣акам (Вı̄сı̄м настанов)' WHERE slug = 'siksastakam';

UPDATE gv_book_references SET title_ua = 'Бгакті-расāмр̣та-сіндгу (Океан нектару відданості)' WHERE slug = 'bhakti-rasamrta-sindhu';
UPDATE gv_book_references SET title_ua = 'Удджвала-нı̄ламан̣і (Сяючий сапфір)' WHERE slug = 'ujjvala-nilamani';
UPDATE gv_book_references SET title_ua = 'Упадеш́āмр̣там (Нектар настанов)' WHERE slug = 'upadesamrta';

UPDATE gv_book_references SET title_ua = 'Шрı̄ Чаітанйа-чарітāмр̣та (Нектар життя Чаітанйі)' WHERE slug = 'chaitanya-charitamrita';
UPDATE gv_book_references SET title_ua = 'Шрı̄ Чаітанйа Бгāґавата' WHERE slug = 'chaitanya-bhagavata';

UPDATE gv_book_references SET title_ua = 'Прāртгана (Молитви)' WHERE slug = 'prarthana';
UPDATE gv_book_references SET title_ua = 'Према-бгакті-чандрı̄кā (Місячні промені любовної відданості)' WHERE slug = 'prema-bhakti-chandrika';

UPDATE gv_book_references SET title_ua = 'Мāдгурйа-кāдамбı̄нı̄ (Хмара солодощів)' WHERE slug = 'madhurya-kadambini';
UPDATE gv_book_references SET title_ua = 'Рāґа-вартма-чандрı̄кā (Місячне світло на шляху рāґи)' WHERE slug = 'raga-vartma-chandrika';
UPDATE gv_book_references SET title_ua = 'Сāрāртга-дарш́інı̄ (Відкривач суттєвого значення)' WHERE slug = 'sarartha-darshini';

UPDATE gv_book_references SET title_ua = 'Ґовінда-бгāшйа (Коментар на ім''я Ґовінди)' WHERE slug = 'govinda-bhashya';
UPDATE gv_book_references SET title_ua = 'Прамейа-ратнāваілı̄ (Гірлянда філософських коштовностей)' WHERE slug = 'prameya-ratnavali';
UPDATE gv_book_references SET title_ua = 'Сіддгāнта-ратна (Коштовність висновків)' WHERE slug = 'siddhanta-ratna';

UPDATE gv_book_references SET title_ua = 'Джаіва-дгарма (Релігія душі)' WHERE slug = 'jaiva-dharma';
UPDATE gv_book_references SET title_ua = 'Харінāма-чінтāман̣і (Філософський камінь святого імені)' WHERE slug = 'harinama-cintamani';
UPDATE gv_book_references SET title_ua = 'Бгаджана-рахасйа (Таємниці девоційної практики)' WHERE slug = 'bhajana-rahasya';
UPDATE gv_book_references SET title_ua = 'Шрı̄ Чаітанйа-ш́ı̄кшāмр̣та (Нектар вчень Чаітанйі)' WHERE slug = 'sri-chaitanya-siksamrta';
UPDATE gv_book_references SET title_ua = 'Ш́аран̣āґаті (Віддання)' WHERE slug = 'saranagati';

UPDATE gv_book_references SET title_ua = 'Бгаґавад-ґı̄та̄ як вона є' WHERE slug = 'bhagavad-gita-as-it-is';
UPDATE gv_book_references SET title_ua = 'Шрı̄мад-Бгāґаватам' WHERE slug = 'srimad-bhagavatam-prabhupada';
UPDATE gv_book_references SET title_ua = 'Шрı̄ Чаітанйа-чарітāмр̣та' WHERE slug = 'chaitanya-charitamrita-prabhupada';
UPDATE gv_book_references SET title_ua = 'Нектар відданості' WHERE slug = 'nectar-of-devotion';
UPDATE gv_book_references SET title_ua = 'Нектар настанов' WHERE slug = 'nectar-of-instruction';
UPDATE gv_book_references SET title_ua = 'Шрı̄ Īш́опанı̄шад' WHERE slug = 'sri-isopanisad-prabhupada';
UPDATE gv_book_references SET title_ua = 'Вчення Господа Чаітанйі' WHERE slug = 'teachings-of-lord-chaitanya';
UPDATE gv_book_references SET title_ua = 'Крı̄шн̣а, Верховна Особистість Бога' WHERE slug = 'krishna-book';
UPDATE gv_book_references SET title_ua = 'Вчення Господа Капı̄ли, сина Девахӯті' WHERE slug = 'teachings-of-lord-kapila';
UPDATE gv_book_references SET title_ua = 'Вчення царіцı̄ Кунтı̄' WHERE slug = 'teachings-of-queen-kunti';
UPDATE gv_book_references SET title_ua = 'Брагма-самхı̄тā' WHERE slug = 'brahma-samhita-prabhupada';

UPDATE gv_book_references SET title_ua = 'Легка подорож на інші планети' WHERE slug = 'easy-journey-to-other-planets';
UPDATE gv_book_references SET title_ua = 'Наука самоусвідомлення' WHERE slug = 'science-of-self-realization';
UPDATE gv_book_references SET title_ua = 'За межами народження і смерті' WHERE slug = 'beyond-birth-and-death';
UPDATE gv_book_references SET title_ua = 'Досконалі питання, досконалі відповіді' WHERE slug = 'perfect-questions-perfect-answers';
UPDATE gv_book_references SET title_ua = 'Рāджа-відйā: Цар знання' WHERE slug = 'raja-vidya';
UPDATE gv_book_references SET title_ua = 'Шлях досконалості' WHERE slug = 'path-of-perfection';
UPDATE gv_book_references SET title_ua = 'Життя походить від життя' WHERE slug = 'life-comes-from-life';
UPDATE gv_book_references SET title_ua = 'Світло Бгāґавати' WHERE slug = 'light-of-bhagavata';
UPDATE gv_book_references SET title_ua = 'Крı̄шн̣а, резервуар насолоди' WHERE slug = 'krsna-the-reservoir-of-pleasure';
UPDATE gv_book_references SET title_ua = 'Досконалість йоґи' WHERE slug = 'perfection-of-yoga';
UPDATE gv_book_references SET title_ua = 'Нāрада-бгакті-сӯтра' WHERE slug = 'narada-bhakti-sutra-prabhupada';
UPDATE gv_book_references SET title_ua = 'Мукунда-мāлā-стотра' WHERE slug = 'mukunda-mala-stotra-prabhupada';

UPDATE gv_book_references SET title_ua = 'Шрı̄ла Прабгупāда-лı̄лāмр̣та' WHERE slug = 'srila-prabhupada-lilamrta';
UPDATE gv_book_references SET title_ua = 'Нектар Прабгупāди' WHERE slug = 'prabhupada-nectar';
UPDATE gv_book_references SET title_ua = 'Бр̣хад-бгāґаватāмр̣та (Переклад)' WHERE slug = 'brihad-bhagavatamrta-translation';
UPDATE gv_book_references SET title_ua = 'Шуддга-бгакті-чінтāман̣і' WHERE slug = 'suddha-bhakti-cintamani';
UPDATE gv_book_references SET title_ua = 'Вен̣у-ґı̄та̄' WHERE slug = 'venu-gita';
UPDATE gv_book_references SET title_ua = 'Ш́ı̄кшā поза ІСККОН?' WHERE slug = 'siksa-outside-iskcon';
UPDATE gv_book_references SET title_ua = 'Подорож додому' WHERE slug = 'journey-home';
UPDATE gv_book_references SET title_ua = 'Подорож усередину' WHERE slug = 'journey-within';
UPDATE gv_book_references SET title_ua = 'Шрı̄ Бгактісіддгāнта Ваібгава' WHERE slug = 'sri-bhaktisiddhanta-vaibhava';
UPDATE gv_book_references SET title_ua = 'Нектарний океан святого імені' WHERE slug = 'nectarean-ocean-holy-name';
UPDATE gv_book_references SET title_ua = 'Живе ім''я' WHERE slug = 'living-name';
UPDATE gv_book_references SET title_ua = 'Чудовий світ святого імені' WHERE slug = 'wonderful-world-of-the-holy-name';
UPDATE gv_book_references SET title_ua = 'Шат̣-сандарбга (Повний переклад)' WHERE slug = 'sat-sandarbha-translation';
UPDATE gv_book_references SET title_ua = 'Мāдгурйа-кāдамбı̄нı̄ (Переклад)' WHERE slug = 'madhurya-kadambini-translation';
UPDATE gv_book_references SET title_ua = 'Хвилі відданості' WHERE slug = 'waves-of-devotion';
UPDATE gv_book_references SET title_ua = 'У пошуках ведичної Індії' WHERE slug = 'searching-for-vedic-india';

-- Sandarbhas
UPDATE gv_book_references SET title_ua = 'Таттва-сандарбга (Есе про істину)' WHERE slug = 'tattva-sandarbha';
UPDATE gv_book_references SET title_ua = 'Бгаґават-сандарбга (Есе про Верховну Особу)' WHERE slug = 'bhagavat-sandarbha';
UPDATE gv_book_references SET title_ua = 'Параматма-сандарбга (Есе про Наддушу)' WHERE slug = 'paramatma-sandarbha';
UPDATE gv_book_references SET title_ua = 'Крı̄шн̣а-сандарбга (Есе про Крı̄шн̣у)' WHERE slug = 'krishna-sandarbha';
UPDATE gv_book_references SET title_ua = 'Бгакті-сандарбга (Есе про відданість)' WHERE slug = 'bhakti-sandarbha';
UPDATE gv_book_references SET title_ua = 'Прı̄ті-сандарбга (Есе про божественну любов)' WHERE slug = 'priti-sandarbha';
UPDATE gv_book_references SET title_ua = 'Ґопāла-чампӯ' WHERE slug = 'gopala-champu';

-- Raghunatha Dasa Gosvami
UPDATE gv_book_references SET title_ua = 'Вілāпа-кусумāн̃джалі (Квіткова жертва скорботи)' WHERE slug = 'vilapa-kusumanjali';
UPDATE gv_book_references SET title_ua = 'Ставāваілı̄ (Збірка молитов)' WHERE slug = 'stavavali';
UPDATE gv_book_references SET title_ua = 'Манах̣-ш́ı̄кшā (Настанови розуму)' WHERE slug = 'manah-siksa';

-- Sanatana Gosvami
UPDATE gv_book_references SET title_ua = 'Бр̣хад-бгāґаватāмр̣та (Великий нектар Бгāґавати)' WHERE slug = 'brihad-bhagavatamrta';
UPDATE gv_book_references SET title_ua = 'Харі-бгакті-вілāса (Ігри відданості Харі)' WHERE slug = 'hari-bhakti-vilasa';
UPDATE gv_book_references SET title_ua = 'Даш́ама-тı̄ппан̣ı̄ (Нотатки до Десятої пı̄снı̄)' WHERE slug = 'dasama-tippani';
UPDATE gv_book_references SET title_ua = 'Кр̣шн̣а-лı̄лā-става (Молитви, що прославляють ігри Крı̄шн̣и)' WHERE slug = 'krishna-lila-stava';

COMMIT;
