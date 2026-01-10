Ось виправлений SQL-скрипт. Усі імена, титули та назви творів українською мовою очищено від діакритичних знаків (макронів, крапок тощо), при цьому збережено українську орфографію (наприклад, «Т̣гāкура» стало «Тгакура», «Кр̣шн̣а» стало «Крішна»). Решту коду залишено без змін.

```sql
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
  name_ua = 'Шрі Адваіта Ачар''я',
  title_ua = 'Ачар''я'
WHERE slug = 'advaita-acharya';

UPDATE gv_authors SET
  name_ua = 'Шрі Ґададгар Пандіт',
  title_ua = 'Пандіт'
WHERE slug = 'gadadhara-pandita';

UPDATE gv_authors SET
  name_ua = 'Шрівас Тхакур',
  title_ua = 'Тхакур'
WHERE slug = 'srivasa-thakura';

-- Six Gosvamis
UPDATE gv_authors SET
  name_ua = 'Шріла Рупа Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'rupa-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шріла Санатана Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'sanatana-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шріла Джіва Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'jiva-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шріла Раґгунатх Дас Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'raghunatha-dasa-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шріла Раґгунатх Бгатта Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'raghunatha-bhatta-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шріла Ґопал Бгатта Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'gopala-bhatta-gosvami';

-- Later Acharyas
UPDATE gv_authors SET
  name_ua = 'Шріла Крішнадас Кавірадж',
  title_ua = 'Кавірадж'
WHERE slug = 'krishnadasa-kaviraja';

UPDATE gv_authors SET
  name_ua = 'Шріла Вріндаван Дас Тхакур',
  title_ua = 'Тхакур'
WHERE slug = 'vrindavana-dasa-thakura';

UPDATE gv_authors SET
  name_ua = 'Шріла Нароттам Дас Тхакур',
  title_ua = 'Тхакур'
WHERE slug = 'narottama-dasa-thakura';

UPDATE gv_authors SET
  name_ua = 'Шріла Вішванатх Чакраварті Тхакур',
  title_ua = 'Тхакур'
WHERE slug = 'visvanatha-chakravarti';

UPDATE gv_authors SET
  name_ua = 'Шріла Баладева Відьябгушана',
  title_ua = 'Відьябгушана'
WHERE slug = 'baladeva-vidyabhushana';

-- Modern Acharyas
UPDATE gv_authors SET
  name_ua = 'Шріла Бгактівінод Тхакур',
  title_ua = 'Тхакур'
WHERE slug = 'bhaktivinoda-thakura';

UPDATE gv_authors SET
  name_ua = 'Шріла Ґауракішора Дас Бабаджі',
  title_ua = 'Бабаджі'
WHERE slug = 'gaurakisora-dasa-babaji';

UPDATE gv_authors SET
  name_ua = 'Шріла Бгактісіддганта Сарасваті Тхакур',
  title_ua = 'Тхакур'
WHERE slug = 'bhaktisiddhanta-sarasvati';

UPDATE gv_authors SET
  name_ua = 'Шріла А.Ч. Бгактіведанта Свамі Прабгупада',
  title_ua = 'Прабгупада'
WHERE slug = 'bhaktivedanta-swami-prabhupada';

-- Prabhupada's disciples
UPDATE gv_authors SET
  name_ua = 'Сатсварупа Дас Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'satsvarupa-dasa-goswami';

UPDATE gv_authors SET
  name_ua = 'Ґопіпаранадгана Дас'
WHERE slug = 'gopiparanadhana-dasa';

UPDATE gv_authors SET
  name_ua = 'Хрідаянанда Дас Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'hridayananda-dasa-goswami';

UPDATE gv_authors SET
  name_ua = 'Шіварама Свамі',
  title_ua = 'Свамі'
WHERE slug = 'sivarama-swami';

UPDATE gv_authors SET
  name_ua = 'Бгакті Тіртха Свамі',
  title_ua = 'Свамі'
WHERE slug = 'bhakti-tirtha-swami';

UPDATE gv_authors SET
  name_ua = 'Радганатх Свамі',
  title_ua = 'Свамі'
WHERE slug = 'radhanatha-swami';

UPDATE gv_authors SET
  name_ua = 'Бгакті Вікаша Свамі',
  title_ua = 'Свамі'
WHERE slug = 'bhakti-vikasa-swami';

UPDATE gv_authors SET
  name_ua = 'Сачінандана Свамі',
  title_ua = 'Свамі'
WHERE slug = 'sacinandana-swami';

UPDATE gv_authors SET
  name_ua = 'Бгану Свамі',
  title_ua = 'Свамі'
WHERE slug = 'bhanu-swami';

UPDATE gv_authors SET
  name_ua = 'Джаядвайта Свамі',
  title_ua = 'Свамі'
WHERE slug = 'jayadvaita-swami';

UPDATE gv_authors SET
  name_ua = 'Дганурдгара Свамі',
  title_ua = 'Свамі'
WHERE slug = 'dhanurdhara-swami';

UPDATE gv_authors SET
  name_ua = 'Девамріта Свамі',
  title_ua = 'Свамі'
WHERE slug = 'devamrita-swami';

-- ============================================================================
-- ADD MORE FOLLOWERS OF CHAITANYA MAHAPRABHU (Panca-tattva associates, disciples)
-- ============================================================================

INSERT INTO gv_authors (slug, name_sanskrit, name_transliteration, name_en, name_ua, title_sanskrit, title_transliteration, title_en, title_ua, birth_year, death_year, birth_place, samadhi_place, era, significance_en, significance_ua, display_order)
VALUES
  -- Haridasa Thakura
  ('haridasa-thakura', 'শ্রীল হরিদাস ঠাকুর', 'Śrīla Haridāsa Ṭhākura', 'Srila Haridasa Thakura', 'Шріла Харідаса Тгакура', 'ঠাকুর', 'Ṭhākura', 'Revered One', 'Шанований', 1451, 1527, 'Buron, Bengal', 'Puri, Odisha', 'founders',
   'The namacharya (teacher of the holy name), chanted 300,000 names daily. Example of humility and devotion.',
   'Намачар''я (вчитель святого імені), оспівував 300 000 імен щодня. Приклад смиренності та відданості.',
   6),

  -- Svarupa Damodara
  ('svarupa-damodara', 'শ্রীল স্বরূপ দামোদর গোস্বামী', 'Śrīla Svarūpa Dāmodara Gosvāmī', 'Srila Svarupa Damodara Gosvami', 'Шріла Сварупа Дамодара Ґосвамі', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Ґосвамі', NULL, 1540, 'Bengal', 'Puri, Odisha', 'founders',
   'The most intimate associate of Chaitanya in Puri, his personal secretary and the manifestation of Lalita-sakhi.',
   'Найближчий супутник Чаітаньї в Пурі, його особистий секретар і прояв Лаліта-сакхі.',
   7),

  -- Ramananda Raya
  ('ramananda-raya', 'শ্রী রামানন্দ রায়', 'Śrī Rāmānanda Rāya', 'Sri Ramananda Raya', 'Шрі Рамананда Рая', NULL, NULL, NULL, NULL, 1470, 1550, 'Puri, Odisha', 'Puri, Odisha', 'founders',
   'Governor and intimate devotee who discussed the highest topics of divine love with Mahaprabhu (Ramananda-samvada).',
   'Губернатор та близький відданий, який обговорював найвищі теми божественної любові з Махапрабгу (Рамананда-самвада).',
   8),

  -- Pundarika Vidyanidhi
  ('pundarika-vidyanidhi', 'শ্রী পুণ্ডরীক বিদ্যানিধি', 'Śrī Puṇḍarīka Vidyānidhi', 'Sri Pundarika Vidyanidhi', 'Шрі Пундаріка Відьянідгі', NULL, NULL, NULL, NULL, NULL, NULL, 'Bengal', 'Bengal', 'founders',
   'Guru of Gadadhara Pandita, considered the incarnation of King Vrishabhanu (Radharani''s father).',
   'Ґуру Ґададгари Пандіти, вважається втіленням царя Врішабгану (батька Радхарані).',
   9),

  -- Lokanatha Gosvami
  ('lokanatha-gosvami', 'শ্রীল লোকনাথ গোস্বামী', 'Śrīla Lokanātha Gosvāmī', 'Srila Lokanatha Gosvami', 'Шріла Локанатха Ґосвамі', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Ґосвамі', 1480, 1580, 'Bengal', 'Vrindavan', 'gosvamis',
   'Intimate associate of Mahaprabhu and guru of Narottama Dasa Thakura.',
   'Близький супутник Махапрабгу та ґуру Нароттами Даси Тгакури.',
   16),

  -- Bhugarbha Gosvami
  ('bhugarbha-gosvami', 'শ্রীল ভূগর্ভ গোস্বামী', 'Śrīla Bhūgarbha Gosvāmī', 'Srila Bhugarbha Gosvami', 'Шріла Бгуґарбга Ґосвамі', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Ґосвамі', NULL, NULL, 'Bengal', 'Vrindavan', 'gosvamis',
   'Close associate of Lokanatha Gosvami, discovered many sacred places in Vraja.',
   'Близький супутник Локанатги Ґосвамі, відкрив багато священних місць у Враджі.',
   17),

  -- Kavi Karnapura
  ('kavi-karnapura', 'শ্রীল কবি কর্ণপুর', 'Śrīla Kavi Karṇapūra', 'Srila Kavi Karnapura', 'Шріла Каві Карнапура', NULL, NULL, 'King of Poets', 'Цар поетів', 1524, 1604, 'Puri, Odisha', 'Puri, Odisha', 'later_acharyas',
   'Son of Sivananda Sena, wrote Sanskrit dramas and the Gaura-ganoddesa-dipika.',
   'Син Шівананди Сени, написав санскритські драми та Ґаура-ґаноддеша-діпіку.',
   25),

  -- Prabhodhananda Sarasvati
  ('prabodhanananda-sarasvati', 'শ্রীল প্রবোধানন্দ সরস্বতী', 'Śrīla Prabodhānanda Sarasvatī', 'Srila Prabodhanananda Sarasvati', 'Шріла Прабодхананда Сарасваті', NULL, NULL, NULL, NULL, NULL, NULL, 'South India', 'Vrindavan', 'later_acharyas',
   'Uncle of Gopala Bhatta Gosvami, author of Radha-rasa-sudha-nidhi and Vrindavana-mahimamrta.',
   'Дядько Ґопали Бгатти Ґосвамі, автор Радха-раса-судха-нідхі та Вріндавана-махімамріти.',
   26),

  -- Shyamananda Prabhu
  ('shyamananda-prabhu', 'শ্রীল শ্যামানন্দ প্রভু', 'Śrīla Śyāmānanda Prabhu', 'Srila Shyamananda Prabhu', 'Шріла Шьямананда Прабгу', 'প্রভু', 'Prabhu', 'Lord', 'Господь', 1535, 1630, 'Orissa', 'Vrindavan', 'later_acharyas',
   'Disciple of Jiva Gosvami who spread the movement in Orissa.',
   'Учень Джіви Ґосвамі, який поширив рух в Орісі.',
   27),

  -- Srinivasa Acharya
  ('srinivasa-acharya', 'শ্রীল শ্রীনিবাস আচার্য', 'Śrīla Śrīnivāsa Ācārya', 'Srila Srinivasa Acharya', 'Шріла Шрініваса Ачар''я', 'আচার্য', 'Ācārya', 'Teacher', 'Вчитель', 1517, 1610, 'Bengal', 'Bengal', 'later_acharyas',
   'Disciple of Jiva Gosvami, carried the Gosvami literature to Bengal with Narottama and Shyamananda.',
   'Учень Джіви Ґосвамі, переніс літературу Ґосвамі до Бенґалії з Нароттамою та Шьяманандою.',
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
  ('tamal-krishna-goswami', NULL, 'Tamāla Kṛṣṇa Gosvāmī', 'Tamal Krishna Goswami', 'Тамала Крішна Ґосвамі', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Ґосвамі', 1946, 2002, 'New York, USA', 'prabhupada_disciples',
   'Personal secretary of Prabhupada, GBC, author of Servant of the Servant.',
   'Особистий секретар Прабгупади, ДжБС, автор "Слуги слуги".',
   52),

  ('giriraj-swami', NULL, 'Giriṛāja Svāmī', 'Giriraj Swami', 'Ґіріраджа Свамі', 'স্বামী', 'Svāmī', 'Master', 'Свамі', 1947, NULL, 'Chicago, USA', 'prabhupada_disciples',
   'Pioneer in India, established ISKCON in Bombay, author of Many Moons.',
   'Піонер в Індії, заснував ІСККОН у Бомбеї, автор "Багатьох місяців".',
   53),

  ('indradyumna-swami', NULL, 'Indradyumna Svāmī', 'Indradyumna Swami', 'Індрадьюмна Свамі', 'স্বামী', 'Svāmī', 'Master', 'Свамі', 1949, NULL, 'USA', 'prabhupada_disciples',
   'Famous traveling preacher, organized Polish Tour festivals, author of Diary of a Traveling Preacher.',
   'Відомий мандрівний проповідник, організатор фестивалів Польської турне, автор "Щоденника мандрівного проповідника".',
   54),

  ('jayapataka-swami', NULL, 'Jayapatāka Svāmī', 'Jayapataka Swami', 'Джайапатака Свамі', 'স্বামী', 'Svāmī', 'Master', 'Свамі', 1949, NULL, 'USA', 'prabhupada_disciples',
   'Pioneer in Mayapur development, GBC, initiated thousands of disciples.',
   'Піонер розвитку Маяпуру, ДжБС, ініціював тисячі учнів.',
   55),

  ('bhakti-charu-swami', NULL, 'Bhakti Cāru Svāmī', 'Bhakti Charu Swami', 'Бгакті Чару Свамі', 'স্বামী', 'Svāmī', 'Master', 'Свамі', 1945, 2020, 'Bengal, India', 'prabhupada_disciples',
   'Personal servant of Prabhupada, translated works into Bengali, GBC.',
   'Особистий слуга Прабгупади, переклав праці бенґалі, ДжБС.',
   56),

  ('bir-krishna-das-goswami', NULL, 'Bīr Kṛṣṇa Dāsa Gosvāmī', 'Bir Krishna Das Goswami', 'Бір Крішна Даса Ґосвамі', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Ґосвамі', 1948, NULL, 'USA', 'prabhupada_disciples',
   'GBC, initiating guru, known for his Bhagavatam classes.',
   'ДжБС, ініціюючий ґуру, відомий своїми заняттями з Бгаґаватам.',
   57),

  ('urmila-devi-dasi', NULL, 'Urmilā Devī Dāsī', 'Urmila Devi Dasi', 'Урміла Деві Дасі', NULL, NULL, NULL, NULL, 1955, NULL, 'USA', 'prabhupada_disciples',
   'Pioneer in Vaishnava education, author of Vaikuntha Children.',
   'Піонер у вайшнавській освіті, автор "Діти Вайкунтхи".',
   58),

  ('bhurijan-dasa', NULL, 'Bhūrijana Dāsa', 'Bhurijan Dasa', 'Бгуріджана Даса', NULL, NULL, NULL, NULL, 1948, NULL, 'USA', 'prabhupada_disciples',
   'Senior teacher, author of analytical works on Bhagavatam.',
   'Старший вчитель, автор аналітичних праць з Бгаґаватам.',
   59),

  ('krishna-kshetra-swami', NULL, 'Kṛṣṇa-kṣetra Svāmī', 'Krishna-kshetra Swami', 'Крішна-кшетра Свамі', 'স্বামী', 'Svāmī', 'Master', 'Свамі', 1957, NULL, 'USA', 'prabhupada_disciples',
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
  ('gaura-ganoddesa-dipika', 'গৌরগণোদ্দেশদীপিকা', 'Gaura-gaṇoddeśa-dīpikā', 'Gaura-ganoddesa-dipika', 'Ґаура-ґаноддеша-діпіка',
   (SELECT id FROM gv_authors WHERE slug = 'kavi-karnapura'),
   'shastra', 'theology', 'sanskrit', 4,
   'Identifies the eternal identities of Mahaprabhu''s associates as Krishna''s Vraja associates.',
   'Визначає вічні ідентичності супутників Махапрабгу як супутників Крішни з Враджі.',
   400),

  ('caitanya-candramrita', 'চৈতন্যচন্দ্রামৃত', 'Caitanya-candrāmṛta', 'Chaitanya-chandramrita', 'Чаітанья-чандрамріта',
   (SELECT id FROM gv_authors WHERE slug = 'kavi-karnapura'),
   'stotra', 'stuti', 'sanskrit', 4,
   'Beautiful prayers glorifying Chaitanya Mahaprabhu as the moon of divine love.',
   'Прекрасні молитви, що прославляють Чаітанью Махапрабгу як місяць божественної любові.',
   401),

  -- Prabodhanananda Sarasvati
  ('radha-rasa-sudha-nidhi', 'রাধারসসুধানিধি', 'Rādhā-rasa-sudhā-nidhi', 'Radha-rasa-sudha-nidhi', 'Радха-раса-судха-нідхі',
   (SELECT id FROM gv_authors WHERE slug = 'prabodhanananda-sarasvati'),
   'stotra', 'stuti', 'sanskrit', 5,
   'Exalted prayers to Radharani, describing the ocean of nectar of Her divine love.',
   'Піднесені молитви до Радхарані, що описують океан нектару Її божественної любові.',
   402),

  ('vrindavana-mahimamrta', 'বৃন্দাবনমহিমামৃত', 'Vṛndāvana-mahimāmṛta', 'Vrindavana-mahimamrta', 'Вріндавана-махімамріта',
   (SELECT id FROM gv_authors WHERE slug = 'prabodhanananda-sarasvati'),
   'stotra', 'tirtha', 'sanskrit', 4,
   'Glorification of Vrindavan-dhama and its spiritual significance.',
   'Прославлення Вріндавана-дгами та її духовного значення.',
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
   'Мемуари особистого служіння Шрілі Прабгупаді.',
   411),

  ('tkg-diary', NULL, 'TKG''s Diary', 'TKG''s Diary', 'Щоденник ТКҐ',
   (SELECT id FROM gv_authors WHERE slug = 'tamal-krishna-goswami'),
   'prabandha', 'memoir', 'english', 5,
   'Diary of Prabhupada''s final days, essential historical document.',
   'Щоденник останніх днів Прабгупади, важливий історичний документ.',
   412),

  -- Giriraj Swami
  ('many-moons', NULL, 'Many Moons', 'Many Moons', 'Багато місяців',
   (SELECT id FROM gv_authors WHERE slug = 'giriraj-swami'),
   'prabandha', 'memoir', 'english', 4,
   'Reflections on personal experiences with Srila Prabhupada and in ISKCON.',
   'Роздуми про особистий досвід зі Шрілою Прабгупадою та в ІСККОН.',
   413),

  -- Bhurijan Dasa
  ('surrender-unto-me', NULL, 'Surrender Unto Me', 'Surrender Unto Me', 'Віддайся Мені',
   (SELECT id FROM gv_authors WHERE slug = 'bhurijan-dasa'),
   'shastra', 'commentary', 'english', 4,
   'Analytical study of the Bhagavad-gita.',
   'Аналітичне вивчення Бгаґавад-ґіти.',
   414)

ON CONFLICT (slug) DO UPDATE SET
  title_ua = EXCLUDED.title_ua,
  updated_at = now();

-- ============================================================================
-- FIX UKRAINIAN TITLES FOR BOOKS
-- ============================================================================

UPDATE gv_book_references SET title_ua = 'Бгаґавад-ґіта (Пісня Бога)' WHERE slug = 'bhagavad-gita';
UPDATE gv_book_references SET title_ua = 'Шрімад-Бгаґаватам (Прекрасна оповідь про Бога)' WHERE slug = 'srimad-bhagavatam';
UPDATE gv_book_references SET title_ua = 'Шрі Ішопанішад' WHERE slug = 'sri-isopanishad';
UPDATE gv_book_references SET title_ua = 'Брагма-самхіта' WHERE slug = 'brahma-samhita';
UPDATE gv_book_references SET title_ua = 'Веданта-сутра' WHERE slug = 'vedanta-sutra';
UPDATE gv_book_references SET title_ua = 'Шікшаштакам (Вісім настанов)' WHERE slug = 'siksastakam';

UPDATE gv_book_references SET title_ua = 'Бгакті-расамріта-сіндгу (Океан нектару відданості)' WHERE slug = 'bhakti-rasamrta-sindhu';
UPDATE gv_book_references SET title_ua = 'Удджвала-ніламані (Сяючий сапфір)' WHERE slug = 'ujjvala-nilamani';
UPDATE gv_book_references SET title_ua = 'Упадешамрітам (Нектар настанов)' WHERE slug = 'upadesamrta';

UPDATE gv_book_references SET title_ua = 'Шрі Чаітанья-чарітамріта (Нектар життя Чаітаньї)' WHERE slug = 'chaitanya-charitamrita';
UPDATE gv_book_references SET title_ua = 'Шрі Чаітанья Бгаґавата' WHERE slug = 'chaitanya-bhagavata';

UPDATE gv_book_references SET title_ua = 'Прартгана (Молитви)' WHERE slug = 'prarthana';
UPDATE gv_book_references SET title_ua = 'Према-бгакті-чандріка (Місячні промені любовної відданості)' WHERE slug = 'prema-bhakti-chandrika';

UPDATE gv_book_references SET title_ua = 'Мадгурья-кадамбіні (Хмара солодощів)' WHERE slug = 'madhurya-kadambini';
UPDATE gv_book_references SET title_ua = 'Раґа-вартма-чандріка (Місячне світло на шляху раґи)' WHERE slug = 'raga-vartma-chandrika';
UPDATE gv_book_references SET title_ua = 'Сарартга-даршіні (Відкривач суттєвого значення)' WHERE slug = 'sarartha-darshini';

UPDATE gv_book_references SET title_ua = 'Ґовінда-бгаш''я (Коментар на ім''я Ґовінди)' WHERE slug = 'govinda-bhashya';
UPDATE gv_book_references SET title_ua = 'Прамея-ратнавалі (Гірлянда філософських коштовностей)' WHERE slug = 'prameya-ratnavali';
UPDATE gv_book_references SET title_ua = 'Сіддганта-ратна (Коштовність висновків)' WHERE slug = 'siddhanta-ratna';

UPDATE gv_book_references SET title_ua = 'Джайва-дгарма (Релігія душі)' WHERE slug = 'jaiva-dharma';
UPDATE gv_book_references SET title_ua = 'Харінама-чінтамані (Філософський камінь святого імені)' WHERE slug = 'harinama-cintamani';
UPDATE gv_book_references SET title_ua = 'Бгаджана-рахасья (Таємниці девоційної практики)' WHERE slug = 'bhajana-rahasya';
UPDATE gv_book_references SET title_ua = 'Шрі Чаітанья-шікшамріта (Нектар вчень Чаітаньї)' WHERE slug = 'sri-chaitanya-siksamrta';
UPDATE gv_book_references SET title_ua = 'Шаранаґаті (Віддання)' WHERE slug = 'saranagati';

UPDATE gv_book_references SET title_ua = 'Бгаґавад-ґіта як вона є' WHERE slug = 'bhagavad-gita-as-it-is';
UPDATE gv_book_references SET title_ua = 'Шрімад-Бгаґаватам' WHERE slug = 'srimad-bhagavatam-prabhupada';
UPDATE gv_book_references SET title_ua = 'Шрі Чаітанья-чарітамріта' WHERE slug = 'chaitanya-charitamrita-prabhupada';
UPDATE gv_book_references SET title_ua = 'Нектар відданості' WHERE slug = 'nectar-of-devotion';
UPDATE gv_book_references SET title_ua = 'Нектар настанов' WHERE slug = 'nectar-of-instruction';
UPDATE gv_book_references SET title_ua = 'Шрі Ішопанішад' WHERE slug = 'sri-isopanisad-prabhupada';
UPDATE gv_book_references SET title_ua = 'Вчення Господа Чаітаньї' WHERE slug = 'teachings-of-lord-chaitanya';
UPDATE gv_book_references SET title_ua = 'Крішна, Верховна Особистість Бога' WHERE slug = 'krishna-book';
UPDATE gv_book_references SET title_ua = 'Вчення Господа Капіли, сина Девахуті' WHERE slug = 'teachings-of-lord-kapila';
UPDATE gv_book_references SET title_ua = 'Вчення цариці Кунті' WHERE slug = 'teachings-of-queen-kunti';
UPDATE gv_book_references SET title_ua = 'Брагма-самхіта' WHERE slug = 'brahma-samhita-prabhupada';

UPDATE gv_book_references SET title_ua = 'Легка подорож на інші планети' WHERE slug = 'easy-journey-to-other-planets';
UPDATE gv_book_references SET title_ua = 'Наука самоусвідомлення' WHERE slug = 'science-of-self-realization';
UPDATE gv_book_references SET title_ua = 'За межами народження і смерті' WHERE slug = 'beyond-birth-and-death';
UPDATE gv_book_references SET title_ua = 'Досконалі питання, досконалі відповіді' WHERE slug = 'perfect-questions-perfect-answers';
UPDATE gv_book_references SET title_ua = 'Раджа-відья: Цар знання' WHERE slug = 'raja-vidya';
UPDATE gv_book_references SET title_ua = 'Шлях досконалості' WHERE slug = 'path-of-perfection';
UPDATE gv_book_references SET title_ua = 'Життя походить від життя' WHERE slug = 'life-comes-from-life';
UPDATE gv_book_references SET title_ua = 'Світло Бгаґавати' WHERE slug = 'light-of-bhagavata';
UPDATE gv_book_references SET title_ua = 'Крішна, резервуар насолоди' WHERE slug = 'krsna-the-reservoir-of-pleasure';
UPDATE gv_book_references SET title_ua = 'Досконалість йоґи' WHERE slug = 'perfection-of-yoga';
UPDATE gv_book_references SET title_ua = 'Нарада-бгакті-сутра' WHERE slug = 'narada-bhakti-sutra-prabhupada';
UPDATE gv_book_references SET title_ua = 'Мукунда-мала-стотра' WHERE slug = 'mukunda-mala-stotra-prabhupada';

UPDATE gv_book_references SET title_ua = 'Шріла Прабгупада-ліламріта' WHERE slug = 'srila-prabhupada-lilamrta';
UPDATE gv_book_references SET title_ua = 'Нектар Прабгупади' WHERE slug = 'prabhupada-nectar';
UPDATE gv_book_references SET title_ua = 'Бріхад-бгаґаватамріта (Переклад)' WHERE slug = 'brihad-bhagavatamrta-translation';
UPDATE gv_book_references SET title_ua = 'Шуддга-бгакті-чінтамані' WHERE slug = 'suddha-bhakti-cintamani';
UPDATE gv_book_references SET title_ua = 'Вену-ґіта' WHERE slug = 'venu-gita';
UPDATE gv_book_references SET title_ua = 'Шікша поза ІСККОН?' WHERE slug = 'siksa-outside-iskcon';
UPDATE gv_book_references SET title_ua = 'Подорож додому' WHERE slug = 'journey-home';
UPDATE gv_book_references SET title_ua = 'Подорож усередину' WHERE slug = 'journey-within';
UPDATE gv_book_references SET title_ua = 'Шрі Бгактісіддганта Вайбгава' WHERE slug = 'sri-bhaktisiddhanta-vaibhava';
UPDATE gv_book_references SET title_ua = 'Нектарний океан святого імені' WHERE slug = 'nectarean-ocean-holy-name';
UPDATE gv_book_references SET title_ua = 'Живе ім''я' WHERE slug = 'living-name';
UPDATE gv_book_references SET title_ua = 'Чудовий світ святого імені' WHERE slug = 'wonderful-world-of-the-holy-name';
UPDATE gv_book_references SET title_ua = 'Шат-сандарбга (Повний переклад)' WHERE slug = 'sat-sandarbha-translation';
UPDATE gv_book_references SET title_ua = 'Мадгурья-кадамбіні (Переклад)' WHERE slug = 'madhurya-kadambini-translation';
UPDATE gv_book_references SET title_ua = 'Хвилі відданості' WHERE slug = 'waves-of-devotion';
UPDATE gv_book_references SET title_ua = 'У пошуках ведичної Індії' WHERE slug = 'searching-for-vedic-india';

-- Sandarbhas
UPDATE gv_book_references SET title_ua = 'Таттва-сандарбга (Есе про істину)' WHERE slug = 'tattva-sandarbha';
UPDATE gv_book_references SET title_ua = 'Бгаґават-сандарбга (Есе про Верховну Особу)' WHERE slug = 'bhagavat-sandarbha';
UPDATE gv_book_references SET title_ua = 'Параматма-сандарбга (Есе про Наддушу)' WHERE slug = 'paramatma-sandarbha';
UPDATE gv_book_references SET title_ua = 'Крішна-сандарбга (Есе про Крішну)' WHERE slug = 'krishna-sandarbha';
UPDATE gv_book_references SET title_ua = 'Бгакті-сандарбга (Есе про відданість)' WHERE slug = 'bhakti-sandarbha';
UPDATE gv_book_references SET title_ua = 'Пріті-сандарбга (Есе про божественну любов)' WHERE slug = 'priti-sandarbha';
UPDATE gv_book_references SET title_ua = 'Ґопала-чампу' WHERE slug = 'gopala-champu';

-- Raghunatha Dasa Gosvami
UPDATE gv_book_references SET title_ua = 'Вілапа-кусуманджалі (Квіткова жертва скорботи)' WHERE slug = 'vilapa-kusumanjali';
UPDATE gv_book_references SET title_ua = 'Стававалі (Збірка молитов)' WHERE slug = 'stavavali';
UPDATE gv_book_references SET title_ua = 'Манах-шікша (Настанови розуму)' WHERE slug = 'manah-siksa';

-- Sanatana Gosvami
UPDATE gv_book_references SET title_ua = 'Бріхад-бгаґаватамріта (Великий нектар Бгаґавати)' WHERE slug = 'brihad-bhagavatamrta';
UPDATE gv_book_references SET title_ua = 'Харі-бгакті-віласа (Ігри відданості Харі)' WHERE slug = 'hari-bhakti-vilasa';
UPDATE gv_book_references SET title_ua = 'Дашама-тіппані (Нотатки до Десятої пісні)' WHERE slug = 'dasama-tippani';
UPDATE gv_book_references SET title_ua = 'Крішна-ліла-става (Молитви, що прославляють ігри Крішни)' WHERE slug = 'krishna-lila-stava';

COMMIT;

```