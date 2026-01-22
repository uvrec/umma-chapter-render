-- Add nakshatra support to Vaishnava calendar
-- Links appearance_days to birth nakshatras for Jyotish integration

BEGIN;

-- ============================================
-- 1. CREATE NAKSHATRAS REFERENCE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.nakshatras (
  id SERIAL PRIMARY KEY,
  nakshatra_number INTEGER NOT NULL UNIQUE CHECK (nakshatra_number BETWEEN 1 AND 27),

  -- Names
  name_iast TEXT NOT NULL,
  name_uk TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_sanskrit TEXT NOT NULL,

  -- Ruler planet
  ruler_planet TEXT NOT NULL CHECK (ruler_planet IN (
    'surya', 'chandra', 'mangala', 'budha', 'guru', 'shukra', 'shani', 'rahu', 'ketu'
  )),

  -- Deity
  deity_uk TEXT,
  deity_en TEXT,

  -- Symbol
  symbol_uk TEXT,
  symbol_en TEXT,

  -- Degrees (0-360)
  start_degree NUMERIC(10,6) NOT NULL,
  end_degree NUMERIC(10,6) NOT NULL,

  -- Qualities
  guna TEXT CHECK (guna IN ('sattva', 'rajas', 'tamas')),
  element TEXT CHECK (element IN ('fire', 'earth', 'air', 'water', 'ether')),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert 27 nakshatras
INSERT INTO nakshatras (nakshatra_number, name_iast, name_uk, name_en, name_sanskrit, ruler_planet, deity_uk, deity_en, symbol_uk, symbol_en, start_degree, end_degree, guna, element) VALUES
  (1, 'Aśvinī', 'Ашвіні', 'Ashvini', 'अश्विनी', 'ketu', 'Ашвіни Кумари', 'Ashvini Kumaras', 'Голова коня', 'Horse head', 0, 13.333333, 'rajas', 'earth'),
  (2, 'Bharaṇī', 'Бгарані', 'Bharani', 'भरणी', 'shukra', 'Яма', 'Yama', 'Йоні', 'Yoni', 13.333333, 26.666667, 'rajas', 'earth'),
  (3, 'Kṛttikā', 'Кріттіка', 'Krittika', 'कृत्तिका', 'surya', 'Аґні', 'Agni', 'Леза, полум''я', 'Razor, flame', 26.666667, 40, 'rajas', 'fire'),
  (4, 'Rohiṇī', 'Рохіні', 'Rohini', 'रोहिणी', 'chandra', 'Брахма', 'Brahma', 'Бик, колісниця', 'Bull, chariot', 40, 53.333333, 'rajas', 'earth'),
  (5, 'Mṛgaśirā', 'Мріґаширша', 'Mrigashira', 'मृगशिरा', 'mangala', 'Сома', 'Soma', 'Голова оленя', 'Deer head', 53.333333, 66.666667, 'tamas', 'earth'),
  (6, 'Ārdrā', 'Ардра', 'Ardra', 'आर्द्रा', 'rahu', 'Рудра', 'Rudra', 'Краплина сліз', 'Teardrop', 66.666667, 80, 'tamas', 'water'),
  (7, 'Punarvasu', 'Пунарвасу', 'Punarvasu', 'पुनर्वसु', 'guru', 'Адіті', 'Aditi', 'Сагайдак', 'Bow and quiver', 80, 93.333333, 'sattva', 'water'),
  (8, 'Puṣya', 'Пуш''я', 'Pushya', 'पुष्य', 'shani', 'Бріхаспаті', 'Brihaspati', 'Коров''яче вим''я', 'Cow udder', 93.333333, 106.666667, 'sattva', 'water'),
  (9, 'Āśleṣā', 'Ашлеша', 'Ashlesha', 'आश्लेषा', 'budha', 'Наґи', 'Nagas', 'Скручена змія', 'Coiled serpent', 106.666667, 120, 'sattva', 'water'),
  (10, 'Maghā', 'Маґха', 'Magha', 'मघा', 'ketu', 'Пітри', 'Pitris', 'Трон', 'Throne', 120, 133.333333, 'tamas', 'water'),
  (11, 'Pūrva Phalgunī', 'Пурва Пхалґуні', 'Purva Phalguni', 'पूर्व फाल्गुनी', 'shukra', 'Бгаґа', 'Bhaga', 'Гойдалка', 'Hammock', 133.333333, 146.666667, 'tamas', 'water'),
  (12, 'Uttara Phalgunī', 'Уттара Пхалґуні', 'Uttara Phalguni', 'उत्तर फाल्गुनी', 'surya', 'Ар''яман', 'Aryaman', 'Ліжко', 'Bed', 146.666667, 160, 'tamas', 'fire'),
  (13, 'Hasta', 'Хаста', 'Hasta', 'हस्त', 'chandra', 'Савітар', 'Savitar', 'Долоня', 'Palm', 160, 173.333333, 'rajas', 'fire'),
  (14, 'Citrā', 'Чітра', 'Chitra', 'चित्रा', 'mangala', 'Твашта', 'Tvashtar', 'Перлина', 'Pearl', 173.333333, 186.666667, 'tamas', 'fire'),
  (15, 'Svātī', 'Сваті', 'Swati', 'स्वाति', 'rahu', 'Ваю', 'Vayu', 'Молодий пагін', 'Young sprout', 186.666667, 200, 'tamas', 'fire'),
  (16, 'Viśākhā', 'Вішакха', 'Vishakha', 'विशाखा', 'guru', 'Індра та Аґні', 'Indra and Agni', 'Арка', 'Arch', 200, 213.333333, 'sattva', 'fire'),
  (17, 'Anurādhā', 'Анурадха', 'Anuradha', 'अनुराधा', 'shani', 'Мітра', 'Mitra', 'Лотос', 'Lotus', 213.333333, 226.666667, 'sattva', 'fire'),
  (18, 'Jyeṣṭhā', 'Дж''єштха', 'Jyeshtha', 'ज्येष्ठा', 'budha', 'Індра', 'Indra', 'Парасолька', 'Umbrella', 226.666667, 240, 'sattva', 'air'),
  (19, 'Mūla', 'Мула', 'Mula', 'मूल', 'ketu', 'Нірріті', 'Nirriti', 'Зв''язка коренів', 'Bunch of roots', 240, 253.333333, 'rajas', 'air'),
  (20, 'Pūrvāṣāḍhā', 'Пурвашадха', 'Purva Ashadha', 'पूर्वाषाढा', 'shukra', 'Апас', 'Apas', 'Віяло', 'Fan', 253.333333, 266.666667, 'rajas', 'air'),
  (21, 'Uttarāṣāḍhā', 'Уттарашадха', 'Uttara Ashadha', 'उत्तराषाढा', 'surya', 'Вішведеви', 'Vishvedevas', 'Бивень слона', 'Elephant tusk', 266.666667, 280, 'rajas', 'air'),
  (22, 'Śravaṇa', 'Шравана', 'Shravana', 'श्रवण', 'chandra', 'Вішну', 'Vishnu', 'Вухо', 'Ear', 280, 293.333333, 'rajas', 'air'),
  (23, 'Dhaniṣṭhā', 'Дханішта', 'Dhanishtha', 'धनिष्ठा', 'mangala', 'Васу', 'Vasus', 'Барабан', 'Drum', 293.333333, 306.666667, 'tamas', 'ether'),
  (24, 'Śatabhiṣaj', 'Шатабгішадж', 'Shatabhisha', 'शतभिषज्', 'rahu', 'Варуна', 'Varuna', 'Порожнє коло', 'Empty circle', 306.666667, 320, 'tamas', 'ether'),
  (25, 'Pūrva Bhādrapadā', 'Пурва Бгадрапада', 'Purva Bhadrapada', 'पूर्व भाद्रपदा', 'guru', 'Аджа Екапад', 'Aja Ekapada', 'Похоронне ліжко', 'Funeral bed', 320, 333.333333, 'sattva', 'ether'),
  (26, 'Uttara Bhādrapadā', 'Уттара Бгадрапада', 'Uttara Bhadrapada', 'उत्तर भाद्रपदा', 'shani', 'Ахір Будг''ня', 'Ahir Budhnya', 'Змій глибин', 'Serpent of depths', 333.333333, 346.666667, 'sattva', 'ether'),
  (27, 'Revatī', 'Реваті', 'Revati', 'रेवती', 'budha', 'Пуша', 'Pushan', 'Риба', 'Fish', 346.666667, 360, 'sattva', 'ether')
ON CONFLICT (nakshatra_number) DO NOTHING;

-- ============================================
-- 2. ADD NAKSHATRA TO APPEARANCE_DAYS
-- ============================================

ALTER TABLE appearance_days
  ADD COLUMN IF NOT EXISTS nakshatra_id INTEGER REFERENCES nakshatras(id),
  ADD COLUMN IF NOT EXISTS birth_year INTEGER,
  ADD COLUMN IF NOT EXISTS birth_place TEXT,
  ADD COLUMN IF NOT EXISTS biography_short_uk TEXT,
  ADD COLUMN IF NOT EXISTS biography_short_en TEXT;

-- Index for nakshatra lookups
CREATE INDEX IF NOT EXISTS idx_appearance_days_nakshatra ON appearance_days(nakshatra_id);

-- ============================================
-- 3. INSERT GAUDIYA VAISHNAVA ACHARYAS DATA
-- ============================================

-- First, ensure we have the appearance category
INSERT INTO festival_categories (slug, name_uk, name_en, icon, color, sort_order)
VALUES ('appearance', 'Явлення', 'Appearance', 'Sunrise', '#F59E0B', 2)
ON CONFLICT (slug) DO NOTHING;

-- Insert major Gaudiya Vaishnava acharyas with their nakshatra data
INSERT INTO appearance_days (
  slug, category_id, event_type,
  person_name_sanskrit, person_name_uk, person_name_en, person_title_uk, person_title_en,
  vaishnava_month_id, tithi_number, paksha, nakshatra_id,
  description_uk, description_en, is_major, fasting_level
)
SELECT
  slug,
  (SELECT id FROM festival_categories WHERE slug = 'appearance'),
  event_type,
  person_name_sanskrit, person_name_uk, person_name_en, person_title_uk, person_title_en,
  vaishnava_month_id, tithi_number, paksha,
  (SELECT id FROM nakshatras WHERE nakshatra_number = nakshatra_num),
  description_uk, description_en, is_major, fasting_level
FROM (VALUES
  -- Шрі Чайтанья Махапрабгу
  ('chaitanya-mahaprabhu-appearance', 'appearance',
   'Śrī Kṛṣṇa Caitanya', 'Шрі Чайтанья Махапрабгу', 'Sri Chaitanya Mahaprabhu',
   'Верховний Господь', 'Supreme Lord',
   11, 15, 'shukla', 22, -- Пурніма, Шравана накшатра
   'Явлення Шрі Чайтаньї Махапрабгу - Верховної Особи Бога в образі відданого. Народився у Навадвіпі 1486 року під час місячного затемнення.',
   'Appearance of Sri Chaitanya Mahaprabhu - the Supreme Personality of Godhead in the role of a devotee. Born in Navadvipa in 1486 during a lunar eclipse.',
   true, 'half'),

  -- Шріла Прабгупада
  ('prabhupada-appearance', 'appearance',
   'A.C. Bhaktivedānta Svāmī Prabhupāda', 'Шріла Прабгупада', 'Srila Prabhupada',
   'Засновник-ачар''я ISKCON', 'Founder-Acharya of ISKCON',
   6, 8, 'krishna', 23, -- Аштамі, Дханішта накшатра (1 вересня 1896)
   'Явлення Його Божественної Милості А.Ч. Бгактіведанти Свамі Прабгупади, засновника-ачар''ї Міжнародного товариства свідомості Крішни.',
   'Appearance of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, Founder-Acharya of ISKCON.',
   true, 'half'),

  -- Бгактісіддганта Сарасваті Тхакур
  ('bhaktisiddhanta-appearance', 'appearance',
   'Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura', 'Бгактісіддганта Сарасваті Тхакур', 'Bhaktisiddhanta Sarasvati Thakura',
   'Ачар''я-засновник Ґаудія Матха', 'Founder-Acharya of Gaudiya Math',
   10, 5, 'shukla', 21, -- Панчамі, Уттарашадха накшатра (6 лютого 1874)
   'Явлення Шріли Бгактісіддганти Сарасваті Тхакура, духовного вчителя Шріли Прабгупади та засновника Ґаудія Матха.',
   'Appearance of Srila Bhaktisiddhanta Sarasvati Thakura, spiritual master of Srila Prabhupada and founder of Gaudiya Math.',
   true, 'half'),

  -- Бгактівінода Тхакур
  ('bhaktivinoda-appearance', 'appearance',
   'Śrīla Bhaktivinoda Ṭhākura', 'Бгактівінода Тхакур', 'Bhaktivinoda Thakura',
   'Сьомий Ґосвамі', 'Seventh Goswami',
   6, 3, 'krishna', 12, -- Трітія, Уттара Пхалґуні накшатра (2 вересня 1838)
   'Явлення Шріли Бгактівіноди Тхакура, великого ачар''ї та відроджувача Ґаудія-вайшнавізму в 19 столітті.',
   'Appearance of Srila Bhaktivinoda Thakura, great acharya and reviver of Gaudiya Vaishnavism in the 19th century.',
   true, 'half'),

  -- Нітьянанда Прабгу
  ('nityananda-appearance', 'appearance',
   'Śrī Nityānanda Prabhu', 'Шрі Нітьянанда Прабгу', 'Sri Nityananda Prabhu',
   'Верховний Господь', 'Supreme Lord',
   10, 13, 'shukla', 9, -- Трайодаші, Ашлеша накшатра
   'Явлення Шрі Нітьянанди Прабгу - прояви Господа Баларами та найближчого супутника Шрі Чайтаньї Махапрабгу.',
   'Appearance of Sri Nityananda Prabhu - manifestation of Lord Balarama and closest associate of Sri Chaitanya Mahaprabhu.',
   true, 'half'),

  -- Адвайта Ачар'я
  ('advaita-acharya-appearance', 'appearance',
   'Śrī Advaita Ācārya', 'Шрі Адвайта Ачар''я', 'Sri Advaita Acharya',
   'Втілення Маха-Вішну', 'Incarnation of Maha-Vishnu',
   10, 7, 'shukla', 8, -- Саптамі, Пуш'я накшатра
   'Явлення Шрі Адвайти Ачар''ї, який своїми молитвами закликав Господа Чайтанью зійти на Землю.',
   'Appearance of Sri Advaita Acharya, who called Lord Chaitanya to descend to Earth through his prayers.',
   true, 'half'),

  -- Шріваса Тхакур
  ('shrivasa-appearance', 'appearance',
   'Śrīvāsa Ṭhākura', 'Шріваса Тхакур', 'Shrivasa Thakura',
   'Одне з Панча-таттви', 'One of the Pancha-tattva',
   10, 11, 'krishna', 16, -- Екадаші, Вішакха накшатра
   'Явлення Шрівасі Тхакура, в чиєму домі проводилися нічні кіртани Шрі Чайтаньї Махапрабгу.',
   'Appearance of Shrivasa Thakura, in whose home the nocturnal kirtans of Sri Chaitanya Mahaprabhu were held.',
   true, 'none'),

  -- Ґададхара Пандіт
  ('gadadhara-appearance', 'appearance',
   'Śrī Gadādhara Paṇḍita', 'Шрі Ґададгара Пандіт', 'Sri Gadadhara Pandita',
   'Втілення Шріматі Радхарані', 'Incarnation of Srimati Radharani',
   11, 11, 'shukla', 22, -- Екадаші, Шравана накшатра
   'Явлення Шрі Ґададгари Пандіта, найближчого супутника Шрі Чайтаньї та втілення Шріматі Радхарані.',
   'Appearance of Sri Gadadhara Pandita, closest associate of Sri Chaitanya and incarnation of Srimati Radharani.',
   true, 'none'),

  -- Рупа Ґосвамі
  ('rupa-goswami-appearance', 'appearance',
   'Śrīla Rūpa Gosvāmī', 'Шріла Рупа Ґосвамі', 'Srila Rupa Goswami',
   'Голова Шести Ґосвамі', 'Head of Six Goswamis',
   4, 12, 'krishna', 4, -- Двадаші, Рохіні накшатра
   'Явлення Шріли Рупи Ґосвамі, головного з Шести Ґосвамі Вріндавана та автора «Бгакті-расамріта-сіндгу».',
   'Appearance of Srila Rupa Goswami, chief of the Six Goswamis of Vrindavan and author of Bhakti-rasamrita-sindhu.',
   true, 'half'),

  -- Санатана Ґосвамі
  ('sanatana-goswami-appearance', 'appearance',
   'Śrīla Sanātana Gosvāmī', 'Шріла Санатана Ґосвамі', 'Srila Sanatana Goswami',
   'Один із Шести Ґосвамі', 'One of Six Goswamis',
   3, 5, 'shukla', 25, -- Панчамі, Пурва Бгадрапада накшатра
   'Явлення Шріли Санатани Ґосвамі, старшого брата Рупи Ґосвамі та автора «Хаті-бгакті-віласи».',
   'Appearance of Srila Sanatana Goswami, elder brother of Rupa Goswami and author of Hari-bhakti-vilasa.',
   true, 'half'),

  -- Раґхунатха даса Ґосвамі
  ('raghunatha-dasa-appearance', 'appearance',
   'Śrīla Raghunātha dāsa Gosvāmī', 'Шріла Раґхунатха даса Ґосвамі', 'Srila Raghunatha dasa Goswami',
   'Один із Шести Ґосвамі', 'One of Six Goswamis',
   10, 5, 'shukla', 8, -- Панчамі, Пуш'я накшатра
   'Явлення Шріли Раґхунатхи даса Ґосвамі, автора «Вілапа-кусуманджалі» та зразка відречення.',
   'Appearance of Srila Raghunatha dasa Goswami, author of Vilapa-kusumanjali and example of renunciation.',
   true, 'half'),

  -- Вішванатха Чакраварті Тхакур
  ('vishvanatha-chakravarti-appearance', 'appearance',
   'Śrīla Viśvanātha Cakravartī Ṭhākura', 'Шріла Вішванатха Чакраварті Тхакур', 'Srila Vishvanatha Chakravarti Thakura',
   'Великий ачар''я та коментатор', 'Great Acharya and Commentator',
   10, 5, 'shukla', 7, -- Панчамі, Пунарвасу накшатра (Васанта Панчамі)
   'Явлення Шріли Вішванатхи Чакраварті Тхакура, автора коментарів до «Шрімад-Бгаґаватам» та «Бгаґавад-ґіти».',
   'Appearance of Srila Vishvanatha Chakravarti Thakura, author of commentaries on Srimad-Bhagavatam and Bhagavad-gita.',
   true, 'half'),

  -- Вішнупрія Деві
  ('vishnupriya-appearance', 'appearance',
   'Śrīmatī Viṣṇupriyā Devī', 'Шріматі Вішнупрія Деві', 'Srimati Vishnupriya Devi',
   'Вічна супутниця Господа Чайтаньї', 'Eternal Consort of Lord Chaitanya',
   10, 5, 'shukla', 22, -- Панчамі, Шравана накшатра (Васанта Панчамі)
   'Явлення Шріматі Вішнупрії Деві, вічної супутниці Шрі Чайтаньї Махапрабгу.',
   'Appearance of Srimati Vishnupriya Devi, eternal consort of Sri Chaitanya Mahaprabhu.',
   true, 'none'),

  -- Пундаріка Відьянідхі
  ('pundarika-vidyanidhi-appearance', 'appearance',
   'Śrī Puṇḍarīka Vidyānidhi', 'Шрі Пундаріка Відьянідхі', 'Sri Pundarika Vidyanidhi',
   'Втілення Вршабгану Махараджа', 'Incarnation of Vrishabhanu Maharaja',
   10, 5, 'shukla', 4, -- Панчамі, Рохіні накшатра (Васанта Панчамі)
   'Явлення Шрі Пундаріки Відьянідхі, втілення Вршабгану Махараджа, батька Шріматі Радхарані.',
   'Appearance of Sri Pundarika Vidyanidhi, incarnation of Vrishabhanu Maharaja, father of Srimati Radharani.',
   true, 'none')

) AS data(slug, event_type, person_name_sanskrit, person_name_uk, person_name_en, person_title_uk, person_title_en, vaishnava_month_id, tithi_number, paksha, nakshatra_num, description_uk, description_en, is_major, fasting_level)
ON CONFLICT (slug) DO UPDATE SET
  nakshatra_id = (SELECT id FROM nakshatras WHERE nakshatra_number = EXCLUDED.nakshatra_id),
  description_uk = EXCLUDED.description_uk,
  description_en = EXCLUDED.description_en;

-- ============================================
-- 4. FUNCTION: Find saints by nakshatra
-- ============================================

CREATE OR REPLACE FUNCTION get_saints_by_nakshatra(p_nakshatra_number INTEGER)
RETURNS TABLE (
  person_name_uk TEXT,
  person_name_en TEXT,
  person_title_uk TEXT,
  person_title_en TEXT,
  event_type TEXT,
  nakshatra_name_uk TEXT,
  nakshatra_name_en TEXT,
  description_uk TEXT,
  description_en TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
BEGIN
  RETURN QUERY
  SELECT
    ad.person_name_uk,
    ad.person_name_en,
    ad.person_title_uk,
    ad.person_title_en,
    ad.event_type,
    n.name_uk as nakshatra_name_uk,
    n.name_en as nakshatra_name_en,
    ad.description_uk,
    ad.description_en
  FROM appearance_days ad
  JOIN nakshatras n ON ad.nakshatra_id = n.id
  WHERE n.nakshatra_number = p_nakshatra_number
    AND ad.event_type = 'appearance'
  ORDER BY ad.is_major DESC, ad.person_name_en;
END;
$func$;

REVOKE ALL ON FUNCTION get_saints_by_nakshatra(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_saints_by_nakshatra(INTEGER) TO authenticated, anon;

-- ============================================
-- 5. RLS AND INDEXES
-- ============================================

ALTER TABLE nakshatras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for nakshatras"
  ON nakshatras FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_nakshatras_ruler ON nakshatras(ruler_planet);

COMMIT;
