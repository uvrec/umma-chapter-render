-- Gaudiya Vaishnava Book References - Seed Data
-- Complete catalogue of all major works in the tradition

BEGIN;

-- ============================================================================
-- BOOK CATALOGUES
-- ============================================================================

INSERT INTO gv_book_catalogues (slug, name_en, name_uk, description_en, description_uk, display_order, icon)
VALUES
  ('foundational-scriptures', 'Foundational Scriptures', 'Основні писання', 'The primary scriptural sources of Gaudiya Vaishnavism', 'Первинні джерела писань ґаудіа-вайшнавізму', 1, 'book'),
  ('chaitanya-mahaprabhu', 'Works of Sri Chaitanya', 'Твори Шрі Чайтан''ї', 'Teachings and compositions attributed to Chaitanya Mahaprabhu', 'Вчення та твори Чайтан''ї Махапрабгу', 2, 'lotus'),
  ('six-gosvamis', 'Literature of the Six Gosvamis', 'Література шести Ґосвамі', 'Philosophical and devotional works by the Six Gosvamis of Vrindavan', 'Філософські та девоційні твори шести Ґосвамі Вріндавана', 3, 'temple'),
  ('biographies', 'Sacred Biographies', 'Священні біографії', 'Biographies of Chaitanya Mahaprabhu and His associates', 'Біографії Чайтан''ї Махапрабгу та Його супутників', 4, 'scroll'),
  ('later-acharyas', 'Works of Later Acharyas', 'Твори пізніших ачар''їв', 'Commentaries and compositions by acharyas after the Six Gosvamis', 'Коментарі та твори ачар''їв після шести Ґосвамі', 5, 'pen'),
  ('bhaktivinoda-thakura', 'Works of Bhaktivinoda Thakura', 'Твори Бгактівіноди Тгакура', 'Prolific writings of the pioneer of modern Gaudiya Vaishnavism', 'Плідні твори піонера сучасного ґаудіа-вайшнавізму', 6, 'sun'),
  ('bhaktisiddhanta-sarasvati', 'Works of Bhaktisiddhanta Sarasvati', 'Твори Бгактісіддганти Сарасваті', 'Writings and lectures of the lion guru', 'Твори та лекції ґуру-лева', 7, 'lion'),
  ('prabhupada-books', 'Books by Srila Prabhupada', 'Книжки Шріли Прабгупади', 'Translations and commentaries by the Founder-Acharya of ISKCON', 'Переклади та коментарі Засновника-ачар''ї ІСККОН', 8, 'globe'),
  ('prabhupada-small-books', 'Small Books by Srila Prabhupada', 'Малі книжки Шріли Прабгупади', 'Shorter works and compilations', 'Коротші твори та збірки', 9, 'booklet'),
  ('prabhupada-disciples', 'Works by Prabhupada''s Disciples', 'Твори учнів Прабгупади', 'Books by direct disciples continuing the mission', 'Книжки прямих учнів, які продовжують місію', 10, 'users')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- FOUNDATIONAL SCRIPTURES
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, verse_count, importance_level, significance_en, significance_uk, internal_book_slug, is_available_in_app, display_order)
VALUES
  -- Bhagavad-gita
  ('bhagavad-gita', 'भगवद्गीता', 'Bhagavad-gītā', 'Bhagavad-gita (Song of God)', 'Бгаґавад-ґіта (Пісня Бога)', NULL, 'shruti', 'gita', 'sanskrit', 700, 5,
   'The essence of all Vedic wisdom, spoken by Lord Krishna to Arjuna. The most important scripture for understanding bhakti-yoga.',
   'Суть усієї ведичної мудрості, промовлена Господом Крішною Арджуні. Найважливіше писання для розуміння бгакті-йоґи.',
   'gita', true, 1),

  -- Srimad-Bhagavatam
  ('srimad-bhagavatam', 'श्रीमद्भागवतम्', 'Śrīmad-Bhāgavatam', 'Srimad-Bhagavatam (Beautiful Story of God)', 'Шрімад-Бгаґаватам (Прекрасна оповідь про Бога)', NULL, 'purana', 'maha-purana', 'sanskrit', 18000, 5,
   'The ripened fruit of the Vedic tree, the complete science of God. Twelve cantos describing creation, devotion, and Krishna''s pastimes.',
   'Достиглий плід ведичного дерева, повна наука про Бога. Дванадцять пісень, що описують творіння, відданість та ігри Крішни.',
   'bhagavatam', true, 2),

  -- Sri Isopanishad
  ('sri-isopanishad', 'ईशोपनिषद्', 'Īśopaniṣad', 'Sri Isopanishad', 'Шрі Ішопанішад', NULL, 'shruti', 'upanishad', 'sanskrit', 18, 5,
   'The foremost of the 108 Upanishads, establishing the personal nature of the Absolute Truth.',
   'Найперша з 108 Упанішад, що встановлює особистісну природу Абсолютної Істини.',
   'iso', true, 3),

  -- Brahma-samhita
  ('brahma-samhita', 'ब्रह्मसंहिता', 'Brahma-saṁhitā', 'Brahma-samhita', 'Брагма-самгіта', NULL, 'stotra', 'stuti', 'sanskrit', 62, 5,
   'Prayers of Lord Brahma describing the spiritual world and Krishna''s supreme position. Discovered by Chaitanya Mahaprabhu.',
   'Молитви Господа Брагми, що описують духовний світ і найвище становище Крішни. Знайдена Чайтан''єю Махапрабгу.',
   'bs', true, 4),

  -- Vedanta-sutra
  ('vedanta-sutra', 'वेदान्तसूत्र', 'Vedānta-sūtra', 'Vedanta-sutra', 'Веданта-сутра', NULL, 'shruti', 'sutra', 'sanskrit', 555, 4,
   'The philosophical essence of the Upanishads by Vyasadeva. The Gaudiya commentary is Govinda-bhashya.',
   'Філософська суть Упанішад за В''ясадевою. Ґаудіа-коментар — Ґовінда-бгаш''я.',
   NULL, false, 5)

ON CONFLICT (slug) DO UPDATE SET
  title_sanskrit = EXCLUDED.title_sanskrit,
  title_transliteration = EXCLUDED.title_transliteration,
  updated_at = now();

-- ============================================================================
-- SRI CHAITANYA MAHAPRABHU
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, verse_count, importance_level, significance_en, significance_uk, display_order)
VALUES
  ('siksastakam', 'शिक्षाष्टकम्', 'Śikṣāṣṭakam', 'Siksastakam (Eight Instructions)', 'Шікшаштакам (Вісім настанов)',
   (SELECT id FROM gv_authors WHERE slug = 'chaitanya-mahaprabhu'),
   'stotra', 'stuti', 'sanskrit', 8, 5,
   'The only eight verses composed by Chaitanya Mahaprabhu, containing the complete essence of devotional service.',
   'Єдині вісім віршів, складених Чайтан''єю Махапрабгу, що містять повну суть відданого служіння.',
   10)
ON CONFLICT (slug) DO UPDATE SET updated_at = now();

-- ============================================================================
-- SRILA RUPA GOSVAMI
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, verse_count, importance_level, significance_en, significance_uk, internal_book_slug, is_available_in_app, display_order)
VALUES
  ('bhakti-rasamrta-sindhu', 'भक्तिरसामृतसिन्धु', 'Bhakti-rasāmṛta-sindhu', 'Bhakti-rasamrita-sindhu (Ocean of the Nectar of Devotion)', 'Бгакті-расамріта-сіндгу (Океан нектару відданості)',
   (SELECT id FROM gv_authors WHERE slug = 'rupa-gosvami'),
   'shastra', 'bhakti-shastra', 'sanskrit', 1440, 5,
   'The complete science of bhakti-yoga, defining all aspects of devotional service from sadhana to prema.',
   'Повна наука бгакті-йоґи, що визначає всі аспекти відданого служіння від садгани до преми.',
   'nod', true, 20),

  ('ujjvala-nilamani', 'उज्ज्वलनीलमणि', 'Ujjvala-nīlamaṇi', 'Ujjvala-nilamani (Brilliant Sapphire)', 'Удджвала-ніламані (Сяючий сапфір)',
   (SELECT id FROM gv_authors WHERE slug = 'rupa-gosvami'),
   'shastra', 'bhakti-shastra', 'sanskrit', 1500, 5,
   'The definitive treatise on madhurya-rasa, conjugal love of Krishna. Continuation of Bhakti-rasamrita-sindhu.',
   'Найавторитетніший трактат про мадгур''я-расу, подружню любов до Крішни. Продовження Бгакті-расамріта-сіндгу.',
   NULL, false, 21),

  ('upadesamrta', 'उपदेशामृतम्', 'Upadeśāmṛtam', 'Upadesamrta (Nectar of Instruction)', 'Упадешамріта (Нектар настанов)',
   (SELECT id FROM gv_authors WHERE slug = 'rupa-gosvami'),
   'shastra', 'bhakti-shastra', 'sanskrit', 11, 5,
   'Eleven essential verses on the practice of bhakti, fundamental instructions for all practitioners.',
   'Одинадцять основних віршів про практику бгакті, фундаментальні настанови для всіх практикуючих.',
   'noi', true, 22),

  ('vidagdha-madhava', 'विदग्धमाधव', 'Vidagdha-mādhava', 'Vidagdha-madhava', 'Відаґдга-мадгава',
   (SELECT id FROM gv_authors WHERE slug = 'rupa-gosvami'),
   'kavya', 'nataka', 'sanskrit', NULL, 4,
   'A drama depicting Krishna''s pastimes in Vrindavan. Seven acts of transcendental literature.',
   'Драма, що зображує ігри Крішни у Вріндавані. Сім актів трансцендентної літератури.',
   NULL, false, 23),

  ('lalita-madhava', 'ललितामाधव', 'Lalitā-mādhava', 'Lalita-madhava', 'Лаліта-мадгава',
   (SELECT id FROM gv_authors WHERE slug = 'rupa-gosvami'),
   'kavya', 'nataka', 'sanskrit', NULL, 4,
   'A drama depicting Krishna''s pastimes in Dvaraka. Ten acts continuing from Vidagdha-madhava.',
   'Драма, що зображує ігри Крішни в Дварці. Десять актів, продовження Відаґдга-мадгави.',
   NULL, false, 24),

  ('stavamala', 'स्तवमाला', 'Stava-mālā', 'Stava-mala (Garland of Prayers)', 'Става-мала (Гірлянда молитов)',
   (SELECT id FROM gv_authors WHERE slug = 'rupa-gosvami'),
   'stotra', 'stuti', 'sanskrit', NULL, 4,
   'Collection of beautiful prayers and hymns glorifying Krishna and His associates.',
   'Збірка прекрасних молитов та гімнів, що прославляють Крішну та Його супутників.',
   NULL, false, 25),

  ('laghu-bhagavatamrta', 'लघुभागवतामृतम्', 'Laghu-bhāgavatāmṛtam', 'Laghu-bhagavatamrta (Small Nectar of Bhagavata)', 'Лаґгу-бгаґаватамріта (Малий нектар Бгаґавати)',
   (SELECT id FROM gv_authors WHERE slug = 'rupa-gosvami'),
   'shastra', 'theology', 'sanskrit', NULL, 4,
   'A shorter analysis of Krishna''s forms and incarnations, based on Sanatana Gosvami''s work.',
   'Коротший аналіз форм та втілень Крішни, на основі праці Санатани Ґосвамі.',
   NULL, false, 26),

  ('padyavali', 'पद्यावली', 'Padyāvalī', 'Padyavali (Collection of Verses)', 'Падьяваілі (Збірка віршів)',
   (SELECT id FROM gv_authors WHERE slug = 'rupa-gosvami'),
   'kavya', 'anthology', 'sanskrit', NULL, 3,
   'Anthology of verses from various poets describing devotional moods.',
   'Антологія віршів різних поетів, що описують девоційні настрої.',
   NULL, false, 27),

  ('dana-keli-kaumudi', 'दानकेलीकौमुदी', 'Dāna-kelī-kaumudī', 'Dana-keli-kaumudi', 'Дана-келі-каумуді',
   (SELECT id FROM gv_authors WHERE slug = 'rupa-gosvami'),
   'kavya', 'nataka', 'sanskrit', NULL, 3,
   'A short drama describing Krishna''s tax-collecting pastime with the gopis.',
   'Коротка драма, що описує лілу Крішни зі збиранням податків із ґопі.',
   NULL, false, 28),

  ('hamsaduta', 'हंसदूतम्', 'Haṁsa-dūtam', 'Hamsa-duta (The Swan Messenger)', 'Гамса-дута (Лебідь-посланець)',
   (SELECT id FROM gv_authors WHERE slug = 'rupa-gosvami'),
   'kavya', 'duta-kavya', 'sanskrit', NULL, 3,
   'A messenger poem where Radha sends a swan to Krishna.',
   'Поема-послання, де Радга посилає лебедя до Крішни.',
   NULL, false, 29),

  ('uddhava-sandesa', 'उद्धवसन्देश', 'Uddhava-sandeśa', 'Uddhava-sandesa (Message to Uddhava)', 'Уддгава-сандеша (Послання Уддгаві)',
   (SELECT id FROM gv_authors WHERE slug = 'rupa-gosvami'),
   'kavya', 'duta-kavya', 'sanskrit', NULL, 3,
   'A messenger poem depicting separation mood of the gopis.',
   'Поема-послання, що зображує настрій розлуки ґопі.',
   NULL, false, 30),

  ('mathura-mahatmya', 'मथुरामाहात्म्य', 'Mathurā-māhātmyam', 'Mathura-mahatmya (Glories of Mathura)', 'Матгура-магатм''я (Слава Матгури)',
   (SELECT id FROM gv_authors WHERE slug = 'rupa-gosvami'),
   'shastra', 'tirtha', 'sanskrit', NULL, 3,
   'Description of the glories and holy places of Mathura-dhama.',
   'Опис слави та святих місць Матгура-дгами.',
   NULL, false, 31)

ON CONFLICT (slug) DO UPDATE SET
  title_sanskrit = EXCLUDED.title_sanskrit,
  title_transliteration = EXCLUDED.title_transliteration,
  updated_at = now();

-- ============================================================================
-- SRILA SANATANA GOSVAMI
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, verse_count, importance_level, significance_en, significance_uk, display_order)
VALUES
  ('brihad-bhagavatamrta', 'बृहद्भागवतामृतम्', 'Bṛhad-bhāgavatāmṛtam', 'Brihad-bhagavatamrta (Great Nectar of Bhagavata)', 'Бріхад-бгаґаватамріта (Великий нектар Бгаґавати)',
   (SELECT id FROM gv_authors WHERE slug = 'sanatana-gosvami'),
   'shastra', 'theology', 'sanskrit', NULL, 5,
   'Two-part epic describing the search for the greatest devotee and the spiritual world. Essential for understanding sambandha.',
   'Двочастинний епос, що описує пошук найвищого відданого та духовний світ. Необхідний для розуміння самбандги.',
   40),

  ('hari-bhakti-vilasa', 'हरिभक्तिविलास', 'Hari-bhakti-vilāsa', 'Hari-bhakti-vilasa (Pastimes of Devotion to Hari)', 'Харі-бгакті-віласа (Ігри відданості Харі)',
   (SELECT id FROM gv_authors WHERE slug = 'sanatana-gosvami'),
   'shastra', 'smriti', 'sanskrit', NULL, 5,
   'The standard manual of Vaishnava rituals and practices. Twenty chapters covering all aspects of sadhana.',
   'Стандартний посібник вайшнавських ритуалів та практик. Двадцять розділів, що охоплюють усі аспекти садгани.',
   41),

  ('dasama-tippani', 'दशमटिप्पणी', 'Daśama-ṭippaṇī', 'Dasama-tippani (Notes on the Tenth Canto)', 'Дашама-тіппані (Нотатки до Десятої пісні)',
   (SELECT id FROM gv_authors WHERE slug = 'sanatana-gosvami'),
   'shastra', 'tika', 'sanskrit', NULL, 4,
   'Commentary on the Tenth Canto of Srimad-Bhagavatam describing Krishna''s pastimes.',
   'Коментар до Десятої пісні Шрімад-Бгаґаватам, що описує ігри Крішни.',
   42),

  ('krishna-lila-stava', 'कृष्णलीलास्तव', 'Kṛṣṇa-līlā-stava', 'Krishna-lila-stava (Prayers Glorifying Krishna''s Pastimes)', 'Крішна-ліла-става (Молитви, що прославляють ігри Крішни)',
   (SELECT id FROM gv_authors WHERE slug = 'sanatana-gosvami'),
   'stotra', 'stuti', 'sanskrit', 432, 4,
   'Beautiful prayers describing all of Krishna''s daily pastimes (ashta-kaliya-lila).',
   'Прекрасні молитви, що описують усі щоденні ігри Крішни (ашта-калія-ліла).',
   43)

ON CONFLICT (slug) DO UPDATE SET updated_at = now();

-- ============================================================================
-- SRILA JIVA GOSVAMI
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, verse_count, importance_level, significance_en, significance_uk, display_order)
VALUES
  ('tattva-sandarbha', 'तत्त्वसन्दर्भ', 'Tattva-sandarbha', 'Tattva-sandarbha (Essay on Truth)', 'Таттва-сандарбга (Есе про істину)',
   (SELECT id FROM gv_authors WHERE slug = 'jiva-gosvami'),
   'shastra', 'darsana', 'sanskrit', NULL, 5,
   'First of six Sandarbhas, establishing Srimad-Bhagavatam as the supreme authority.',
   'Перша з шести Сандарбг, що встановлює Шрімад-Бгаґаватам як найвищий авторитет.',
   50),

  ('bhagavat-sandarbha', 'भगवत्सन्दर्भ', 'Bhagavat-sandarbha', 'Bhagavat-sandarbha (Essay on the Supreme Person)', 'Бгаґават-сандарбга (Есе про Верховну Особу)',
   (SELECT id FROM gv_authors WHERE slug = 'jiva-gosvami'),
   'shastra', 'darsana', 'sanskrit', NULL, 5,
   'Second Sandarbha, analyzing the nature of Bhagavan as the ultimate aspect of the Absolute Truth.',
   'Друга Сандарбга, що аналізує природу Бгаґавана як найвищий аспект Абсолютної Істини.',
   51),

  ('paramatma-sandarbha', 'परमात्मसन्दर्भ', 'Paramātma-sandarbha', 'Paramatma-sandarbha (Essay on the Supersoul)', 'Параматма-сандарбга (Есе про Наддушу)',
   (SELECT id FROM gv_authors WHERE slug = 'jiva-gosvami'),
   'shastra', 'darsana', 'sanskrit', NULL, 5,
   'Third Sandarbha, explaining the Supersoul feature and its relationship to the living entities.',
   'Третя Сандарбга, що пояснює аспект Наддуші та її зв''язок із живими істотами.',
   52),

  ('krishna-sandarbha', 'कृष्णसन्दर्भ', 'Kṛṣṇa-sandarbha', 'Krishna-sandarbha (Essay on Krishna)', 'Крішна-сандарбга (Есе про Крішну)',
   (SELECT id FROM gv_authors WHERE slug = 'jiva-gosvami'),
   'shastra', 'darsana', 'sanskrit', NULL, 5,
   'Fourth Sandarbha, establishing Sri Krishna as the source of all incarnations (svayam bhagavan).',
   'Четверта Сандарбга, що встановлює Шрі Крішну як джерело всіх втілень (сваям бгаґаван).',
   53),

  ('bhakti-sandarbha', 'भक्तिसन्दर्भ', 'Bhakti-sandarbha', 'Bhakti-sandarbha (Essay on Devotion)', 'Бгакті-сандарбга (Есе про відданість)',
   (SELECT id FROM gv_authors WHERE slug = 'jiva-gosvami'),
   'shastra', 'darsana', 'sanskrit', NULL, 5,
   'Fifth Sandarbha, comprehensive analysis of bhakti as the supreme process (abhidheya).',
   'П''ята Сандарбга, всебічний аналіз бгакті як найвищого процесу (абгідгея).',
   54),

  ('priti-sandarbha', 'प्रीतिसन्दर्भ', 'Prīti-sandarbha', 'Priti-sandarbha (Essay on Divine Love)', 'Пріті-сандарбга (Есе про божественну любов)',
   (SELECT id FROM gv_authors WHERE slug = 'jiva-gosvami'),
   'shastra', 'darsana', 'sanskrit', NULL, 5,
   'Sixth Sandarbha, culminating treatise on prema as the ultimate goal (prayojana).',
   'Шоста Сандарбга, завершальний трактат про прему як кінцеву мету (прайоджана).',
   55),

  ('gopala-champu', 'गोपालचम्पू', 'Gopāla-campū', 'Gopala-champu', 'Ґопала-чампу',
   (SELECT id FROM gv_authors WHERE slug = 'jiva-gosvami'),
   'kavya', 'champu', 'sanskrit', NULL, 4,
   'Poetic prose masterpiece narrating Krishna''s Vrindavan and Mathura pastimes in two parts.',
   'Поетичний прозовий шедевр, що оповідає про ігри Крішни у Вріндавані та Матгурі у двох частинах.',
   56),

  ('krama-sandarbha', 'क्रमसन्दर्भ', 'Krama-sandarbha', 'Krama-sandarbha (Sequential Commentary)', 'Крама-сандарбга (Послідовний коментар)',
   (SELECT id FROM gv_authors WHERE slug = 'jiva-gosvami'),
   'shastra', 'tika', 'sanskrit', NULL, 4,
   'Verse-by-verse commentary on Srimad-Bhagavatam.',
   'Вірш-за-віршем коментар до Шрімад-Бгаґаватам.',
   57),

  ('sarva-samvadini', 'सर्वसंवादिनी', 'Sarva-saṁvādinī', 'Sarva-samvadini (The Reconciler of All)', 'Сарва-самвадіні (Узгоджувач усього)',
   (SELECT id FROM gv_authors WHERE slug = 'jiva-gosvami'),
   'shastra', 'tika', 'sanskrit', NULL, 4,
   'Auto-commentary on the Sat-sandarbhas, harmonizing all philosophical points.',
   'Автокоментар до Шат-сандарбг, що гармонізує всі філософські положення.',
   58),

  ('madhava-mahotsava', 'माधवमहोत्सव', 'Mādhava-mahotsava', 'Madhava-mahotsava (Great Festival of Madhava)', 'Мадгава-магоцава (Великий фестиваль Мадгави)',
   (SELECT id FROM gv_authors WHERE slug = 'jiva-gosvami'),
   'kavya', 'champu', 'sanskrit', NULL, 3,
   'Description of Radharani''s coronation as Queen of Vrindavan.',
   'Опис коронації Радгарані як Цариці Вріндавана.',
   59),

  ('sankalpa-kalpadruma', 'सङ्कल्पकल्पद्रुम', 'Saṅkalpa-kalpadruma', 'Sankalpa-kalpadruma (Desire-Tree of Meditation)', 'Санкалпа-калпадрума (Дерево бажань медитації)',
   (SELECT id FROM gv_authors WHERE slug = 'jiva-gosvami'),
   'stotra', 'stuti', 'sanskrit', 104, 3,
   'Prayers expressing desire to serve in Radha-Krishna''s eternal pastimes.',
   'Молитви, що виражають бажання служити у вічних іграх Радги-Крішни.',
   60)

ON CONFLICT (slug) DO UPDATE SET updated_at = now();

-- ============================================================================
-- SRILA RAGHUNATHA DASA GOSVAMI
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, verse_count, importance_level, significance_en, significance_uk, display_order)
VALUES
  ('vilapa-kusumanjali', 'विलापकुसुमाञ्जलि', 'Vilāpa-kusumāñjali', 'Vilapa-kusumanjali (Flower-Offering of Lamentation)', 'Вілапа-кусуманджалі (Квіткова жертва скорботи)',
   (SELECT id FROM gv_authors WHERE slug = 'raghunatha-dasa-gosvami'),
   'stotra', 'stuti', 'sanskrit', 104, 5,
   'The pinnacle of separation mood poetry, prayers in the mood of a manjari longing for Radha''s service.',
   'Вершина поезії настрою розлуки, молитви в настрої манджарі, яка прагне служити Радзі.',
   70),

  ('stavavali', 'स्तवावली', 'Stavāvalī', 'Stavavali (Collection of Prayers)', 'Стававаілі (Збірка молитов)',
   (SELECT id FROM gv_authors WHERE slug = 'raghunatha-dasa-gosvami'),
   'stotra', 'stuti', 'sanskrit', NULL, 5,
   'Collection of beautiful prayers expressing the highest devotional sentiments.',
   'Збірка прекрасних молитов, що виражають найвищі девоційні почуття.',
   71),

  ('manah-siksa', 'मनःशिक्षा', 'Manaḥ-śikṣā', 'Manah-siksa (Instructions to the Mind)', 'Манах-шікша (Настанови розуму)',
   (SELECT id FROM gv_authors WHERE slug = 'raghunatha-dasa-gosvami'),
   'stotra', 'siksa', 'sanskrit', 12, 5,
   'Twelve verses of essential instructions for the practitioner''s mind.',
   'Дванадцять віршів основних настанов для розуму практикуючого.',
   72),

  ('muktacarita', 'मुक्तचरित', 'Mukta-carita', 'Mukta-carita (Life of the Liberated)', 'Мукта-чаріта (Життя звільненого)',
   (SELECT id FROM gv_authors WHERE slug = 'raghunatha-dasa-gosvami'),
   'kavya', 'carita', 'sanskrit', NULL, 3,
   'Description of the activities of liberated devotees.',
   'Опис діяльності звільнених відданих.',
   73),

  ('dana-carita', 'दानचरित', 'Dāna-carita', 'Dana-carita (Tax-Collecting Pastime)', 'Дана-чаріта (Ліла збирання податків)',
   (SELECT id FROM gv_authors WHERE slug = 'raghunatha-dasa-gosvami'),
   'kavya', 'lila-katha', 'sanskrit', NULL, 3,
   'Description of Krishna''s tax-collecting pastime with the gopis.',
   'Опис ліли Крішни зі збиранням податків із ґопі.',
   74),

  ('sva-niyama-dasakam', 'स्वनियमदशकम्', 'Sva-niyama-daśakam', 'Sva-niyama-dasakam (Ten Verses on My Vows)', 'Сва-ніяма-дашакам (Десять віршів про мої обітниці)',
   (SELECT id FROM gv_authors WHERE slug = 'raghunatha-dasa-gosvami'),
   'stotra', 'siksa', 'sanskrit', 10, 4,
   'Personal vows of renunciation and devotion.',
   'Особисті обітниці зречення та відданості.',
   75)

ON CONFLICT (slug) DO UPDATE SET updated_at = now();

-- ============================================================================
-- SRILA GOPALA BHATTA GOSVAMI
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, importance_level, significance_en, significance_uk, display_order)
VALUES
  ('sat-kriya-sara-dipika', 'सत्क्रियासारदीपिका', 'Sat-kriyā-sāra-dīpikā', 'Sat-kriya-sara-dipika (Lamp Illuminating Essential Rites)', 'Сат-кріа-сара-діпіка (Світильник, що освітлює основні обряди)',
   (SELECT id FROM gv_authors WHERE slug = 'gopala-bhatta-gosvami'),
   'shastra', 'smriti', 'sanskrit', 4,
   'Manual of Vaishnava samskaras (sacred rites) including initiation and marriage ceremonies.',
   'Посібник вайшнавських самскар (священних обрядів), включаючи ініціацію та шлюбні церемонії.',
   80)

ON CONFLICT (slug) DO UPDATE SET updated_at = now();

-- ============================================================================
-- SACRED BIOGRAPHIES
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, volume_count, importance_level, significance_en, significance_uk, internal_book_slug, is_available_in_app, display_order)
VALUES
  ('chaitanya-charitamrita', 'চৈতন্যচরিতামৃত', 'Caitanya-caritāmṛta', 'Sri Chaitanya-charitamrita (Nectar of Chaitanya''s Life)', 'Шрі Чайтан''я-чарітамріта (Нектар життя Чайтан''ї)',
   (SELECT id FROM gv_authors WHERE slug = 'krishnadasa-kaviraja'),
   'kavya', 'carita', 'bengali', 3, 5,
   'The most authoritative biography of Chaitanya Mahaprabhu. Three divisions: Adi, Madhya, and Antya-lila.',
   'Найавторитетніша біографія Чайтан''ї Махапрабгу. Три частини: Аді, Мадг''я та Антья-ліла.',
   'cc', true, 90),

  ('chaitanya-bhagavata', 'চৈতন্যভাগবত', 'Caitanya-bhāgavata', 'Sri Chaitanya Bhagavata', 'Шрі Чайтан''я Бгаґавата',
   (SELECT id FROM gv_authors WHERE slug = 'vrindavana-dasa-thakura'),
   'kavya', 'carita', 'bengali', 3, 5,
   'The first major biography of Chaitanya Mahaprabhu, written by the Vyasa of Chaitanya-lila.',
   'Перша велика біографія Чайтан''ї Махапрабгу, написана В''ясою Чайтан''я-ліли.',
   'scb', true, 91)

ON CONFLICT (slug) DO UPDATE SET updated_at = now();

-- ============================================================================
-- SRILA NAROTTAMA DASA THAKURA
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, importance_level, significance_en, significance_uk, display_order)
VALUES
  ('prarthana', 'প্রার্থনা', 'Prārthanā', 'Prarthana (Prayers)', 'Прартгана (Молитви)',
   (SELECT id FROM gv_authors WHERE slug = 'narottama-dasa-thakura'),
   'stotra', 'giti', 'bengali', 5,
   'Collection of devotional songs expressing the moods of humility, aspiration, and surrender.',
   'Збірка девоційних пісень, що виражають настрої смирення, прагнення та віддання.',
   100),

  ('prema-bhakti-chandrika', 'প্রেমভক্তিচন্দ্রিকা', 'Prema-bhakti-candrikā', 'Prema-bhakti-chandrika (Moonrays of Loving Devotion)', 'Према-бгакті-чандріка (Місячні промені любовної відданості)',
   (SELECT id FROM gv_authors WHERE slug = 'narottama-dasa-thakura'),
   'shastra', 'bhakti-shastra', 'bengali', 5,
   'Essential guide to raganuga-bhakti, the path of spontaneous devotion.',
   'Необхідний посібник з раґануґа-бгакті, шляху спонтанної відданості.',
   101)

ON CONFLICT (slug) DO UPDATE SET updated_at = now();

-- ============================================================================
-- SRILA VISVANATHA CHAKRAVARTI THAKURA
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, importance_level, significance_en, significance_uk, display_order)
VALUES
  ('madhurya-kadambini', 'माधुर्यकादम्बिनी', 'Mādhurya-kādambinī', 'Madhurya-kadambini (Cloudbank of Sweetness)', 'Мадгур''я-кадамбіні (Хмара солодощів)',
   (SELECT id FROM gv_authors WHERE slug = 'visvanatha-chakravarti'),
   'shastra', 'bhakti-shastra', 'sanskrit', 5,
   'Eight chapters describing the progressive stages of bhakti from sraddha to prema.',
   'Вісім розділів, що описують прогресивні стадії бгакті від шраддги до преми.',
   110),

  ('raga-vartma-chandrika', 'रागवर्त्मचन्द्रिका', 'Rāga-vartma-candrikā', 'Raga-vartma-chandrika (Moonlight on the Path of Raga)', 'Раґа-вартма-чандріка (Місячне світло на шляху раґи)',
   (SELECT id FROM gv_authors WHERE slug = 'visvanatha-chakravarti'),
   'shastra', 'bhakti-shastra', 'sanskrit', 5,
   'Detailed guide to raganuga-bhakti practice.',
   'Детальний посібник з практики раґануґа-бгакті.',
   111),

  ('sarartha-darshini', 'सारार्थदर्शिनी', 'Sārārtha-darśinī', 'Sarartha-darshini (Revealer of Essential Meaning)', 'Сарартга-даршіні (Відкривач суттєвого значення)',
   (SELECT id FROM gv_authors WHERE slug = 'visvanatha-chakravarti'),
   'shastra', 'tika', 'sanskrit', 5,
   'Commentary on Srimad-Bhagavatam, especially illuminating the Tenth Canto.',
   'Коментар до Шрімад-Бгаґаватам, особливо що освітлює Десяту пісню.',
   112),

  ('gita-bhusana', 'गीताभूषण', 'Gītā-bhūṣaṇa', 'Gita-bhushana (Ornament of the Gita)', 'Ґіта-бгушана (Окраса Ґіти)',
   (SELECT id FROM gv_authors WHERE slug = 'visvanatha-chakravarti'),
   'shastra', 'tika', 'sanskrit', 4,
   'Commentary on Bhagavad-gita from the Gaudiya perspective.',
   'Коментар до Бгаґавад-ґіти з ґаудіа-перспективи.',
   113),

  ('ujjvala-nilamani-kirana', 'उज्ज्वलनीलमणिकिरण', 'Ujjvala-nīlamaṇi-kiraṇa', 'Ujjvala-nilamani-kirana (Rays of Ujjvala-nilamani)', 'Удджвала-ніламані-кірана (Промені Удджвала-ніламані)',
   (SELECT id FROM gv_authors WHERE slug = 'visvanatha-chakravarti'),
   'shastra', 'tika', 'sanskrit', 4,
   'Commentary on Rupa Gosvami''s Ujjvala-nilamani.',
   'Коментар до Удджвала-ніламані Рупи Ґосвамі.',
   114),

  ('ksanada-gita-cintamani', 'क्षणदागीतचिन्तामणि', 'Kṣaṇadā-gīta-cintāmaṇi', 'Ksanada-gita-cintamani', 'Кшанада-ґіта-чінтамані',
   (SELECT id FROM gv_authors WHERE slug = 'visvanatha-chakravarti'),
   'kavya', 'giti', 'sanskrit', 3,
   'Songs describing Krishna''s ashta-kaliya-lila (eightfold daily pastimes).',
   'Пісні, що описують ашта-калія-лілу Крішни (вісім щоденних ігор).',
   115)

ON CONFLICT (slug) DO UPDATE SET updated_at = now();

-- ============================================================================
-- SRILA BALADEVA VIDYABHUSHANA
-- ============================================================================

INSERT INTO gv_book_references (slug, title_sanskrit, title_transliteration, title_en, title_uk, author_id, category, subcategory, original_language, importance_level, significance_en, significance_uk, display_order)
VALUES
  ('govinda-bhashya', 'गोविन्दभाष्य', 'Govinda-bhāṣya', 'Govinda-bhashya (Commentary Named Govinda)', 'Ґовінда-бгаш''я (Коментар на ім''я Ґовінди)',
   (SELECT id FROM gv_authors WHERE slug = 'baladeva-vidyabhushana'),
   'shastra', 'bhasya', 'sanskrit', 5,
   'The Gaudiya Vaishnava commentary on Vedanta-sutra, establishing the school''s philosophical authority.',
   'Ґаудіа-вайшнавський коментар до Веданта-сутри, що встановлює філософський авторитет школи.',
   120),

  ('prameya-ratnavali', 'प्रमेयरत्नावली', 'Prameya-ratnāvalī', 'Prameya-ratnavali (Garland of Philosophical Gems)', 'Прамея-ратнаваілі (Гірлянда філософських коштовностей)',
   (SELECT id FROM gv_authors WHERE slug = 'baladeva-vidyabhushana'),
   'shastra', 'darsana', 'sanskrit', 4,
   'Summary of Gaudiya philosophy in nine principles (prameyas).',
   'Резюме ґаудіа-філософії в дев''яти принципах (прамеї).',
   121),

  ('siddhanta-ratna', 'सिद्धान्तरत्न', 'Siddhānta-ratna', 'Siddhanta-ratna (Gem of Conclusions)', 'Сіддганта-ратна (Коштовність висновків)',
   (SELECT id FROM gv_authors WHERE slug = 'baladeva-vidyabhushana'),
   'shastra', 'darsana', 'sanskrit', 4,
   'Systematic presentation of Gaudiya Vaishnava siddhanta.',
   'Систематичне представлення ґаудіа-вайшнавської сіддганти.',
   122),

  ('gita-bhushana-baladeva', 'गीताभूषण', 'Gītā-bhūṣaṇam', 'Gita-bhushana (Baladeva)', 'Ґіта-бгушана (Баладева)',
   (SELECT id FROM gv_authors WHERE slug = 'baladeva-vidyabhushana'),
   'shastra', 'tika', 'sanskrit', 4,
   'Commentary on Bhagavad-gita with philosophical depth.',
   'Коментар до Бгаґавад-ґіти з філософською глибиною.',
   123)

ON CONFLICT (slug) DO UPDATE SET updated_at = now();

COMMIT;
