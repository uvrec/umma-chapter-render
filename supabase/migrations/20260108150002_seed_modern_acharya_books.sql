-- Gaudiya Vaishnava Book References - Modern Acharyas
-- Books by Bhaktivinoda Thakura, Bhaktisiddhanta Sarasvati, Srila Prabhupada, and disciples

BEGIN;

-- ============================================================================
-- SRILA BHAKTIVINODA THAKURA
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, importance_level, significance_en, significance_uk, internal_book_slug, is_available_in_app, display_order)
VALUES
  -- Major Works
  ('jaiva-dharma', 'জৈবধর্ম', 'Jaiva-dharma', 'Jaiva-dharma (The Religion of the Soul)', 'Джайва-дгарма (Релігія душі)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'prabandha', 'novel', 'bengali', 5,
   'Philosophical novel presenting the complete Gaudiya siddhanta through dialogues. His magnum opus.',
   'Філософський роман, що представляє повну ґаудіа-сіддганту через діалоги. Його головний твір.',
   NULL, false, 130),

  ('harinama-cintamani', 'হরিনামচিন্তামণি', 'Harināma-cintāmaṇi', 'Harinama-cintamani (Touchstone of the Holy Name)', 'Харінама-чінтамані (Філософський камінь святого імені)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'shastra', 'bhakti-shastra', 'bengali', 5,
   'Complete guide to chanting the holy name, including the ten offenses.',
   'Повний посібник з оспівування святого імені, включаючи десять образ.',
   NULL, false, 131),

  ('bhajana-rahasya', 'ভজনরহস্য', 'Bhajana-rahasya', 'Bhajana-rahasya (Secrets of Devotional Practice)', 'Бгаджана-рахасья (Таємниці девоційної практики)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'shastra', 'bhakti-shastra', 'bengali', 5,
   'Meditation guide organized around the eight periods of the day (ashta-kaliya).',
   'Посібник з медитації, організований навколо восьми періодів дня (ашта-калія).',
   NULL, false, 132),

  ('sri-chaitanya-siksamrta', 'শ্রীচৈতন্যশিক্ষামৃত', 'Śrī Caitanya-śikṣāmṛta', 'Sri Chaitanya-siksamrita (Nectar of Chaitanya''s Teachings)', 'Шрі Чайтан''я-шікшамріта (Нектар вчень Чайтан''ї)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'shastra', 'siksa', 'bengali', 5,
   'Systematic presentation of Chaitanya Mahaprabhu''s teachings for modern readers.',
   'Систематичне представлення вчень Чайтан''ї Махапрабгу для сучасних читачів.',
   NULL, false, 133),

  ('navadvipa-dhama-mahatmya', 'নবদ্বীপধামমাহাত্ম্য', 'Navadvīpa-dhāma-māhātmya', 'Navadvipa-dhama-mahatmya (Glories of Navadvipa)', 'Навадвіпа-дгама-магатм''я (Слава Навадвіпи)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'shastra', 'tirtha', 'bengali', 4,
   'Description of the nine islands of Navadvipa and their spiritual significance.',
   'Опис дев''яти островів Навадвіпи та їхнього духовного значення.',
   NULL, false, 134),

  ('krishna-samhita', 'কৃষ্ণসংহিতা', 'Kṛṣṇa-saṁhitā', 'Krishna-samhita (Collection on Krishna)', 'Крішна-самгіта (Збірка про Крішну)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'shastra', 'theology', 'bengali', 4,
   'Theological analysis of Krishna''s nature and pastimes.',
   'Теологічний аналіз природи та ігор Крішни.',
   NULL, false, 135),

  ('tattva-sutra', 'তত্ত্বসূত্র', 'Tattva-sūtra', 'Tattva-sutra (Aphorisms on Truth)', 'Таттва-сутра (Афоризми про істину)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'shastra', 'darsana', 'bengali', 4,
   'Philosophical aphorisms summarizing Gaudiya Vaishnava doctrine.',
   'Філософські афоризми, що резюмують ґаудіа-вайшнавську доктрину.',
   NULL, false, 136),

  ('tattva-viveka', 'তত্ত্ববিবেক', 'Tattva-viveka', 'Tattva-viveka (Discrimination of Truth)', 'Таттва-вівека (Розрізнення істини)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'shastra', 'darsana', 'bengali', 4,
   'Philosophical analysis establishing tattva (truth) categories.',
   'Філософський аналіз, що встановлює категорії таттви (істини).',
   NULL, false, 137),

  ('amnaya-sutra', 'আম্নায়সূত্র', 'Āmnāya-sūtra', 'Amnaya-sutra (Aphorisms of Tradition)', 'Амная-сутра (Афоризми традиції)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'shastra', 'darsana', 'bengali', 4,
   'Ten philosophical principles of Gaudiya Vaishnavism.',
   'Десять філософських принципів ґаудіа-вайшнавізму.',
   NULL, false, 138),

  -- Songbooks
  ('saranagati', 'শরণাগতি', 'Śaraṇāgati', 'Saranagati (Surrender)', 'Шаранаґаті (Віддання)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'stotra', 'giti', 'bengali', 5,
   'Collection of songs on the six limbs of surrender (sharanagati).',
   'Збірка пісень про шість частин віддання (шаранаґаті).',
   'saranagati', true, 139),

  ('gitavali', 'গীতাবলী', 'Gītāvalī', 'Gitavali (Collection of Songs)', 'Ґітаваілі (Збірка пісень)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'stotra', 'giti', 'bengali', 5,
   'Songs glorifying various aspects of devotional service.',
   'Пісні, що прославляють різні аспекти відданого служіння.',
   NULL, false, 140),

  ('gita-mala', 'গীতমালা', 'Gīta-mālā', 'Gita-mala (Garland of Songs)', 'Ґіта-мала (Гірлянда пісень)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'stotra', 'giti', 'bengali', 5,
   'Songs describing the progressive path of bhakti.',
   'Пісні, що описують прогресивний шлях бгакті.',
   NULL, false, 141),

  ('kalyana-kalpataru', 'কল্যাণকল্পতরু', 'Kalyāṇa-kalpataru', 'Kalyana-kalpataru (Desire-Tree of Auspiciousness)', 'Калья́на-калпатару (Дерево бажань благодаті)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'stotra', 'giti', 'bengali', 5,
   'Songs expressing desire for pure devotion.',
   'Пісні, що виражають бажання чистої відданості.',
   NULL, false, 142),

  ('baula-sangita', 'বাউলসঙ্গীত', 'Bāula-saṅgīta', 'Baula-sangita (Songs of the Wandering Devotee)', 'Баула-санґіта (Пісні мандрівного відданого)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'stotra', 'giti', 'bengali', 3,
   'Songs in the style of wandering mendicants.',
   'Пісні в стилі мандрівних жебраків.',
   NULL, false, 143),

  -- Other works
  ('datta-kaustubha', 'দত্তকৌস্তুভ', 'Datta-kaustubha', 'Datta-kaustubha', 'Датта-каустубга',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'shastra', 'tika', 'bengali', 3,
   'Commentary on the Upanishads from the Gaudiya perspective.',
   'Коментар до Упанішад з ґаудіа-перспективи.',
   NULL, false, 144),

  ('prema-pradipa', 'প্রেমপ্রদীপ', 'Prema-pradīpa', 'Prema-pradipa (Lamp of Divine Love)', 'Према-прадіпа (Світильник божественної любові)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'prabandha', 'novel', 'bengali', 4,
   'Philosophical novel on the nature of prema.',
   'Філософський роман про природу преми.',
   NULL, false, 145),

  ('hari-bhakti-kalpa-latika', 'হরিভক্তিকল্পলতিকা', 'Hari-bhakti-kalpa-latikā', 'Hari-bhakti-kalpa-latika (Desire-Creeper of Devotion to Hari)', 'Харі-бгакті-калпа-латіка (Ліана бажань відданості Харі)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'shastra', 'bhakti-shastra', 'bengali', 3,
   'Guide to developing devotional creeper (bhakti-lata).',
   'Посібник з розвитку ліани відданості (бгакті-лата).',
   NULL, false, 146),

  ('vaishnava-siddhanta-mala', 'বৈষ্ণবসিদ্ধান্তমালা', 'Vaiṣṇava-siddhānta-mālā', 'Vaishnava-siddhanta-mala (Garland of Vaishnava Conclusions)', 'Вайшнава-сіддганта-мала (Гірлянда вайшнавських висновків)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'shastra', 'darsana', 'bengali', 4,
   'Catechism of Gaudiya Vaishnava philosophy in question-answer format.',
   'Катехізис ґаудіа-вайшнавської філософії у форматі питання-відповідь.',
   NULL, false, 147),

  ('bhagavad-arka-marici-mala', 'ভগবদর্কমরীচিমালা', 'Bhagavad-arka-marīci-mālā', 'Bhagavad-arka-marici-mala (Garland of Rays from the Sun of Bhagavad-gita)', 'Бгаґавад-арка-марічі-мала (Гірлянда променів із сонця Бгаґавад-ґіти)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'shastra', 'tika', 'bengali', 3,
   'Compilation of important verses from Bhagavad-gita with commentary.',
   'Збірка важливих віршів з Бгаґавад-ґіти з коментарем.',
   NULL, false, 148),

  ('chaitanya-mahaprabhu-his-life-and-precepts', NULL, 'Śrī Caitanya Mahāprabhu: His Life and Precepts', 'Sri Chaitanya Mahaprabhu: His Life and Precepts', 'Шрі Чайтан''я Махапрабгу: Його життя і вчення',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivinoda-thakura'),
   'prabandha', 'biography', 'english', 4,
   'First English presentation of Chaitanya Mahaprabhu, sent to universities worldwide.',
   'Перше представлення Чайтан''ї Махапрабгу англійською, надіслане університетам по всьому світу.',
   NULL, false, 149)

ON CONFLICT (slug) DO UPDATE SET updated_at = now();

-- ============================================================================
-- SRILA BHAKTISIDDHANTA SARASVATI THAKURA
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, importance_level, significance_en, significance_uk, display_order)
VALUES
  ('brahmana-o-vaishnava', 'ব্রাহ্মণ ও বৈষ্ণব', 'Brāhmaṇa o Vaiṣṇava', 'Brahmana and Vaishnava', 'Брагмана і Вайшнав',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktisiddhanta-sarasvati'),
   'prabandha', 'essay', 'bengali', 4,
   'Analysis of the relationship between brahminical and Vaishnava status.',
   'Аналіз взаємозв''язку між брагманічним і вайшнавським статусом.',
   160),

  ('upakhyane-upadesa', 'উপাখ্যানে উপদেশ', 'Upākhyāne Upadeśa', 'Upakhyane Upadesa (Teachings Through Stories)', 'Упакх''яне Упадеша (Вчення через історії)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktisiddhanta-sarasvati'),
   'prabandha', 'stories', 'bengali', 3,
   'Collection of instructive stories and parables.',
   'Збірка повчальних історій та притч.',
   161),

  ('prakrita-rasa-sata-dushini', 'প্রাকৃতরস শতদূষণী', 'Prākṛta-rasa-śata-dūṣaṇī', 'Prakrita-rasa-sata-dushini (Hundred Defects of Mundane Rasa)', 'Пракріта-раса-шата-душіні (Сто недоліків мирської раси)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktisiddhanta-sarasvati'),
   'shastra', 'siksa', 'bengali', 5,
   'Hundred verses warning against imitation of advanced devotional moods.',
   'Сто віршів, що застерігають від імітації просунутих девоційних настроїв.',
   162),

  ('anubhashya', 'অনুভাষ্য', 'Anubhāṣya', 'Anubhashya (Following Commentary)', 'Анубгаш''я (Послідовний коментар)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktisiddhanta-sarasvati'),
   'shastra', 'tika', 'bengali', 5,
   'Commentary on Sri Chaitanya-charitamrita with elaborate explanations.',
   'Коментар до Шрі Чайтан''я-чарітамріти з детальними поясненнями.',
   163),

  ('vaishnava-ke', 'বৈষ্ণব কে', 'Vaiṣṇava Ke', 'Who is a Vaishnava?', 'Хто такий вайшнав?',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktisiddhanta-sarasvati'),
   'prabandha', 'essay', 'bengali', 4,
   'Analysis of the qualifications of a genuine Vaishnava.',
   'Аналіз кваліфікацій справжнього вайшнава.',
   164),

  ('amrta-pravaha-bhasya', 'অমৃতপ্রবাহভাষ্য', 'Amṛta-pravāha-bhāṣya', 'Amrita-pravaha-bhasya (Commentary Flowing with Nectar)', 'Амріта-праваха-бгаш''я (Коментар, що тече нектаром)',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktisiddhanta-sarasvati'),
   'shastra', 'tika', 'bengali', 4,
   'Commentary on Chaitanya-charitamrita, different from Anubhashya.',
   'Коментар до Чайтан''я-чарітамріти, відмінний від Анубгаш''ї.',
   165),

  ('sri-chaitanyas-teachings', NULL, 'Sri Chaitanya''s Teachings', 'Sri Chaitanya''s Teachings', 'Вчення Шрі Чайтан''ї',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktisiddhanta-sarasvati'),
   'prabandha', 'essay', 'english', 4,
   'English presentation of Chaitanya Mahaprabhu''s philosophy.',
   'Представлення філософії Чайтан''ї Махапрабгу англійською мовою.',
   166)

ON CONFLICT (slug) DO UPDATE SET updated_at = now();

-- ============================================================================
-- SRILA A.C. BHAKTIVEDANTA SWAMI PRABHUPADA - Major Works
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, volume_count, verse_count, importance_level, significance_en, significance_uk, internal_book_slug, is_available_in_app, display_order)
VALUES
  -- Major Translations and Commentaries
  ('bhagavad-gita-as-it-is', 'भगवद्गीता यथारूप', 'Bhagavad-gītā Yathārūpa', 'Bhagavad-gita As It Is', 'Бгаґавад-ґіта як вона є',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'shastra', 'translation', 'english', 1, 700, 5,
   'The most widely distributed edition of Bhagavad-gita in the world, with Vaishnava commentary.',
   'Найпоширеніше видання Бгаґавад-ґіти у світі з вайшнавським коментарем.',
   'gita', true, 200),

  ('srimad-bhagavatam-prabhupada', 'श्रीमद्भागवतम्', 'Śrīmad-Bhāgavatam', 'Srimad-Bhagavatam', 'Шрімад-Бгаґаватам',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'shastra', 'translation', 'english', 30, 18000, 5,
   'Complete translation with commentary of the first nine cantos and part of the tenth.',
   'Повний переклад з коментарем перших дев''яти пісень та частини десятої.',
   'bhagavatam', true, 201),

  ('chaitanya-charitamrita-prabhupada', 'চৈতন্যচরিতামৃত', 'Caitanya-caritāmṛta', 'Sri Chaitanya-charitamrita', 'Шрі Чайтан''я-чарітамріта',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'shastra', 'translation', 'english', 17, NULL, 5,
   'Complete translation with elaborate commentary of Krishnadasa Kaviraja''s masterpiece.',
   'Повний переклад з детальним коментарем шедевру Крішнадаси Кавіраджи.',
   'cc', true, 202),

  ('nectar-of-devotion', 'भक्तिरसामृतसिन्धु', 'Bhakti-rasāmṛta-sindhu', 'The Nectar of Devotion', 'Нектар відданості',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'shastra', 'translation', 'english', 1, NULL, 5,
   'Summary study of Rupa Gosvami''s Bhakti-rasamrita-sindhu.',
   'Підсумкове вивчення Бгакті-расамріта-сіндгу Рупи Ґосвамі.',
   'nod', true, 203),

  ('nectar-of-instruction', 'उपदेशामृत', 'Upadeśāmṛta', 'The Nectar of Instruction', 'Нектар настанов',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'shastra', 'translation', 'english', 1, 11, 5,
   'Translation and commentary on Rupa Gosvami''s eleven essential verses.',
   'Переклад і коментар до одинадцяти основних віршів Рупи Ґосвамі.',
   'noi', true, 204),

  ('sri-isopanisad-prabhupada', 'ईशोपनिषद्', 'Īśopaniṣad', 'Sri Isopanisad', 'Шрі Ішопанішад',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'shastra', 'translation', 'english', 1, 18, 5,
   'Translation and commentary on the foremost Upanishad.',
   'Переклад і коментар до найпершої Упанішади.',
   'iso', true, 205),

  ('teachings-of-lord-chaitanya', NULL, 'Teachings of Lord Chaitanya', 'Teachings of Lord Chaitanya', 'Вчення Господа Чайтан''ї',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'summary', 'english', 1, NULL, 5,
   'Summary study of the Chaitanya-charitamrita, written before the complete translation.',
   'Підсумкове вивчення Чайтан''я-чарітамріти, написане до повного перекладу.',
   NULL, false, 206),

  ('krishna-book', NULL, 'Kṛṣṇa Book', 'Krishna, The Supreme Personality of Godhead', 'Крішна, Верховна Особистість Бога',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'summary', 'english', 2, NULL, 5,
   'Summary study of the Tenth Canto of Srimad-Bhagavatam.',
   'Підсумкове вивчення Десятої пісні Шрімад-Бгаґаватам.',
   'kb', true, 207),

  ('teachings-of-lord-kapila', NULL, 'Teachings of Lord Kapila', 'Teachings of Lord Kapila, the Son of Devahuti', 'Вчення Господа Капіли, сина Девагуті',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'summary', 'english', 1, NULL, 4,
   'Commentaries on Lord Kapila''s teachings from the Third Canto of Srimad-Bhagavatam.',
   'Коментарі до вчень Господа Капіли з Третьої пісні Шрімад-Бгаґаватам.',
   'tlk', true, 208),

  ('teachings-of-queen-kunti', NULL, 'Teachings of Queen Kunti', 'Teachings of Queen Kunti', 'Вчення цариці Кунті',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'summary', 'english', 1, NULL, 4,
   'Commentaries on Queen Kunti''s prayers from the First Canto of Srimad-Bhagavatam.',
   'Коментарі до молитов цариці Кунті з Першої пісні Шрімад-Бгаґаватам.',
   NULL, false, 209),

  ('brahma-samhita-prabhupada', 'ब्रह्मसंहिता', 'Brahma-saṁhitā', 'Brahma-samhita', 'Брагма-самгіта',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'shastra', 'translation', 'english', 1, 62, 5,
   'Translation and commentary on Lord Brahma''s prayers.',
   'Переклад і коментар до молитов Господа Брагми.',
   'bs', true, 210)

ON CONFLICT (slug) DO UPDATE SET updated_at = now();

-- Small Books by Prabhupada
INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, importance_level, significance_en, significance_uk, display_order)
VALUES
  ('easy-journey-to-other-planets', NULL, 'Easy Journey to Other Planets', 'Easy Journey to Other Planets', 'Легка подорож на інші планети',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'essay', 'english', 4,
   'Analysis of interplanetary travel through yoga and science.',
   'Аналіз міжпланетних подорожей через йоґу та науку.',
   220),

  ('science-of-self-realization', NULL, 'The Science of Self-Realization', 'The Science of Self-Realization', 'Наука самоусвідомлення',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'compilation', 'english', 4,
   'Collection of articles, lectures, and interviews.',
   'Збірка статей, лекцій та інтерв''ю.',
   221),

  ('beyond-birth-and-death', NULL, 'Beyond Birth and Death', 'Beyond Birth and Death', 'За межами народження і смерті',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'essay', 'english', 4,
   'Introduction to the transmigration of the soul.',
   'Вступ до переселення душі.',
   222),

  ('perfect-questions-perfect-answers', NULL, 'Perfect Questions, Perfect Answers', 'Perfect Questions, Perfect Answers', 'Досконалі питання, досконалі відповіді',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'dialogue', 'english', 4,
   'Conversation with Bob Cohen, a Peace Corps volunteer.',
   'Розмова з Бобом Коеном, волонтером Корпусу миру.',
   223),

  ('raja-vidya', 'राजविद्या', 'Rāja-vidyā', 'Raja-vidya: The King of Knowledge', 'Раджа-відья: Цар знання',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'essay', 'english', 4,
   'Exposition on the ninth chapter of Bhagavad-gita.',
   'Виклад дев''ятого розділу Бгаґавад-ґіти.',
   'rv', true, 224),

  ('elevation-to-krishna-consciousness', NULL, 'Elevation to Krishna Consciousness', 'Elevation to Krishna Consciousness', 'Піднесення до свідомості Крішни',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'essay', 'english', 3,
   'Introduction to the process of spiritual elevation.',
   'Вступ до процесу духовного піднесення.',
   225),

  ('krishna-consciousness-topmost-yoga', NULL, 'Krishna Consciousness: The Topmost Yoga System', 'Krishna Consciousness: The Topmost Yoga System', 'Свідомість Крішни: Найвища система йоґи',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'essay', 'english', 3,
   'Explanation of bhakti-yoga as the supreme yoga system.',
   'Пояснення бгакті-йоґи як найвищої системи йоґи.',
   226),

  ('matchless-gift', NULL, 'The Matchless Gift', 'The Matchless Gift', 'Неперевершений дар',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'essay', 'english', 3,
   'The gift of the holy name and spiritual knowledge.',
   'Дар святого імені та духовного знання.',
   227),

  ('path-of-perfection', NULL, 'The Path of Perfection', 'The Path of Perfection', 'Шлях досконалості',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'summary', 'english', 4,
   'Commentary on the sixth chapter of Bhagavad-gita on yoga.',
   'Коментар до шостого розділу Бгаґавад-ґіти про йоґу.',
   228),

  ('journey-of-self-discovery', NULL, 'The Journey of Self-Discovery', 'The Journey of Self-Discovery', 'Подорож самопізнання',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'compilation', 'english', 3,
   'Collection of articles and conversations.',
   'Збірка статей і бесід.',
   229),

  ('life-comes-from-life', NULL, 'Life Comes from Life', 'Life Comes from Life', 'Життя походить від життя',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'dialogue', 'english', 4,
   'Morning walks discussing science and consciousness.',
   'Ранкові прогулянки з обговоренням науки та свідомості.',
   230),

  ('message-of-godhead', NULL, 'Message of Godhead', 'Message of Godhead', 'Послання Бога',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'essay', 'english', 3,
   'Early work introducing Gaudiya Vaishnava philosophy.',
   'Рання праця, що представляє ґаудіа-вайшнавську філософію.',
   231),

  ('renunciation-through-wisdom', NULL, 'Renunciation Through Wisdom', 'Renunciation Through Wisdom', 'Зречення через мудрість',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'essay', 'bengali', 3,
   'Essays on spiritual renunciation, originally in Bengali.',
   'Есе про духовне зречення, спочатку бенґалі.',
   232),

  ('coming-back', NULL, 'Coming Back', 'Coming Back', 'Повернення',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'compilation', 'english', 3,
   'Compilation on reincarnation and liberation.',
   'Збірка про реінкарнацію та звільнення.',
   233),

  ('higher-taste', NULL, 'The Higher Taste', 'The Higher Taste', 'Вищий смак',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'practical', 'english', 3,
   'Introduction to vegetarian cooking with philosophy.',
   'Вступ до вегетаріанського кулінарного мистецтва з філософією.',
   234),

  ('civilization-and-transcendence', NULL, 'Civilization and Transcendence', 'Civilization and Transcendence', 'Цивілізація і трансценденція',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'dialogue', 'english', 3,
   'Dialogue on modern civilization and spiritual values.',
   'Діалог про сучасну цивілізацію та духовні цінності.',
   235),

  ('laws-of-nature', NULL, 'Laws of Nature', 'Laws of Nature', 'Закони природи',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'compilation', 'english', 3,
   'Essays on karma and the laws governing material existence.',
   'Есе про карму та закони, що керують матеріальним існуванням.',
   236),

  ('light-of-bhagavata', 'भागवतज्योति', 'Bhāgavata-jyoti', 'Light of the Bhagavata', 'Світло Бгаґавати',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'commentary', 'english', 4,
   'Poetic commentary on selected verses from Srimad-Bhagavatam.',
   'Поетичний коментар до вибраних віршів зі Шрімад-Бгаґаватам.',
   237),

  ('krsna-the-reservoir-of-pleasure', NULL, 'Krsna, the Reservoir of Pleasure', 'Krsna, the Reservoir of Pleasure', 'Крішна, резервуар насолоди',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'essay', 'english', 3,
   'Introduction to Krishna as the source of all pleasure.',
   'Вступ до Крішни як джерела всієї насолоди.',
   238),

  ('perfection-of-yoga', NULL, 'The Perfection of Yoga', 'The Perfection of Yoga', 'Досконалість йоґи',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'prabandha', 'essay', 'english', 3,
   'Introduction to the goal and practice of yoga.',
   'Вступ до мети та практики йоґи.',
   239),

  ('narada-bhakti-sutra-prabhupada', 'नारदभक्तिसूत्र', 'Nārada-bhakti-sūtra', 'Narada-bhakti-sutra', 'Нарада-бгакті-сутра',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'shastra', 'translation', 'english', 4,
   'Translation and commentary on Narada''s aphorisms on devotion.',
   'Переклад і коментар до афоризмів Наради про відданість.',
   240),

  ('mukunda-mala-stotra-prabhupada', 'मुकुन्दमालास्तोत्र', 'Mukunda-mālā-stotra', 'Mukunda-mala-stotra', 'Мукунда-мала-стотра',
   (SELECT id FROM gv_authors WHERE slug = 'bhaktivedanta-swami-prabhupada'),
   'shastra', 'translation', 'english', 4,
   'Translation of King Kulasekhara''s prayers to Lord Mukunda.',
   'Переклад молитов царя Куласекгари до Господа Мукунди.',
   241)

ON CONFLICT (slug) DO UPDATE SET updated_at = now();

COMMIT;
