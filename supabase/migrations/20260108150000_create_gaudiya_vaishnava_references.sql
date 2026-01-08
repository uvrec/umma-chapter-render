-- Gaudiya Vaishnava Book References System
-- Complete catalogue of sacred texts with authors/acharyas
-- Includes original Sanskrit/Bengali, transliteration, English and Ukrainian

BEGIN;

-- ============================================================================
-- 1. AUTHORS / ACHARYAS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.gv_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,

  -- Names
  name_sanskrit TEXT,                    -- Original script (Devanagari/Bengali)
  name_transliteration TEXT NOT NULL,    -- IAST transliteration
  name_en TEXT NOT NULL,                 -- English
  name_ua TEXT NOT NULL,                 -- Ukrainian

  -- Titles and honorifics
  title_sanskrit TEXT,                   -- e.g., ঠাকুর, গোস্বামী
  title_transliteration TEXT,            -- e.g., Ṭhākura, Gosvāmī
  title_en TEXT,
  title_ua TEXT,

  -- Life details
  birth_year INTEGER,
  death_year INTEGER,
  birth_place TEXT,
  samadhi_place TEXT,

  -- Lineage
  guru_id UUID REFERENCES gv_authors(id),

  -- Biography
  biography_en TEXT,
  biography_ua TEXT,

  -- Significance
  significance_en TEXT,
  significance_ua TEXT,

  -- Media
  image_url TEXT,

  -- Metadata
  era TEXT,                              -- 'founders', 'gosvamis', 'later_acharyas', 'modern'
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 2. BOOK REFERENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.gv_book_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,

  -- Title in multiple formats
  title_sanskrit TEXT,                   -- Original script (Devanagari/Bengali)
  title_transliteration TEXT NOT NULL,   -- IAST transliteration
  title_en TEXT NOT NULL,                -- English translation/title
  title_ua TEXT NOT NULL,                -- Ukrainian translation/title

  -- Alternative titles
  alt_titles TEXT[],                     -- Other known names

  -- Authorship
  author_id UUID REFERENCES gv_authors(id),

  -- For commentaries
  original_text_id UUID REFERENCES gv_book_references(id),
  commentary_type TEXT,                  -- 'tika', 'bhasya', 'vrtti', 'dipika'

  -- Description
  description_en TEXT,
  description_ua TEXT,

  -- Classification
  category TEXT NOT NULL,                -- 'shruti', 'smriti', 'purana', 'kavya', 'stotra', 'shastra', 'prabandha'
  subcategory TEXT,                      -- e.g., 'upanishad', 'gita', 'bhakti-shastra'

  -- Structure
  volume_count INTEGER DEFAULT 1,
  chapter_count INTEGER,
  verse_count INTEGER,

  -- Language of original
  original_language TEXT DEFAULT 'sanskrit', -- 'sanskrit', 'bengali', 'hindi', 'brajabhasha'

  -- Dating
  composition_year INTEGER,
  composition_century TEXT,              -- e.g., '16th century'

  -- Significance
  importance_level INTEGER DEFAULT 3,    -- 1-5 (5 = most important)
  significance_en TEXT,
  significance_ua TEXT,

  -- Topics/themes
  topics TEXT[],

  -- Media
  cover_image_url TEXT,

  -- Links to internal content
  internal_book_slug TEXT,               -- Link to books table if available in app
  external_url TEXT,                     -- Link to external source (vedabase, etc.)

  -- Metadata
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  is_available_in_app BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 3. BOOK CATALOGUES TABLE (for grouping)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.gv_book_catalogues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,

  name_en TEXT NOT NULL,
  name_ua TEXT NOT NULL,

  description_en TEXT,
  description_ua TEXT,

  -- Ordering and display
  display_order INTEGER DEFAULT 0,
  icon TEXT,                             -- Icon identifier
  color TEXT,                            -- Theme color

  is_published BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Junction table for catalogue membership
CREATE TABLE IF NOT EXISTS public.gv_catalogue_books (
  catalogue_id UUID REFERENCES gv_book_catalogues(id) ON DELETE CASCADE,
  book_id UUID REFERENCES gv_book_references(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  PRIMARY KEY (catalogue_id, book_id)
);

-- ============================================================================
-- 4. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_gv_authors_slug ON gv_authors(slug);
CREATE INDEX IF NOT EXISTS idx_gv_authors_era ON gv_authors(era);
CREATE INDEX IF NOT EXISTS idx_gv_authors_guru ON gv_authors(guru_id);

CREATE INDEX IF NOT EXISTS idx_gv_books_slug ON gv_book_references(slug);
CREATE INDEX IF NOT EXISTS idx_gv_books_author ON gv_book_references(author_id);
CREATE INDEX IF NOT EXISTS idx_gv_books_category ON gv_book_references(category);
CREATE INDEX IF NOT EXISTS idx_gv_books_importance ON gv_book_references(importance_level DESC);
CREATE INDEX IF NOT EXISTS idx_gv_books_internal ON gv_book_references(internal_book_slug);

CREATE INDEX IF NOT EXISTS idx_gv_catalogues_slug ON gv_book_catalogues(slug);

-- ============================================================================
-- 5. ENABLE RLS
-- ============================================================================

ALTER TABLE gv_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE gv_book_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE gv_book_catalogues ENABLE ROW LEVEL SECURITY;
ALTER TABLE gv_catalogue_books ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. RLS POLICIES
-- ============================================================================

DO $$
BEGIN
  -- gv_authors policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='gv_authors' AND policyname='Anyone can view published authors'
  ) THEN
    CREATE POLICY "Anyone can view published authors"
      ON gv_authors FOR SELECT
      USING (is_published = true);
  END IF;

  -- gv_book_references policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='gv_book_references' AND policyname='Anyone can view published books'
  ) THEN
    CREATE POLICY "Anyone can view published books"
      ON gv_book_references FOR SELECT
      USING (is_published = true);
  END IF;

  -- gv_book_catalogues policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='gv_book_catalogues' AND policyname='Anyone can view published catalogues'
  ) THEN
    CREATE POLICY "Anyone can view published catalogues"
      ON gv_book_catalogues FOR SELECT
      USING (is_published = true);
  END IF;

  -- gv_catalogue_books policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='gv_catalogue_books' AND policyname='Anyone can view catalogue books'
  ) THEN
    CREATE POLICY "Anyone can view catalogue books"
      ON gv_catalogue_books FOR SELECT
      USING (true);
  END IF;
END$$;

-- ============================================================================
-- 7. SEED DATA - AUTHORS / ACHARYAS
-- ============================================================================

-- Insert authors in chronological/lineage order

-- Era: Founders
INSERT INTO gv_authors (slug, name_sanskrit, name_transliteration, name_en, name_ua, title_sanskrit, title_transliteration, title_en, title_ua, birth_year, death_year, birth_place, samadhi_place, era, significance_en, significance_ua, display_order)
VALUES
  ('chaitanya-mahaprabhu', 'শ্রীচৈতন্য মহাপ্রভু', 'Śrī Caitanya Mahāprabhu', 'Sri Chaitanya Mahaprabhu', 'Шрі Чайтан''я Махапрабгу', 'মহাপ্রভু', 'Mahāprabhu', 'The Great Master', 'Великий Вчитель', 1486, 1534, 'Navadvipa, Bengal', 'Puri, Odisha', 'founders', 'The founder of Gaudiya Vaishnavism, considered the combined incarnation of Radha and Krishna', 'Засновник ґаудіа-вайшнавізму, вважається об''єднаним втіленням Радги і Крішни', 1),

  ('nityananda-prabhu', 'শ্রীনিত্যানন্দ প্রভু', 'Śrī Nityānanda Prabhu', 'Sri Nityananda Prabhu', 'Шрі Нітьянанда Прабгу', 'প্রভু', 'Prabhu', 'The Lord', 'Господь', 1474, 1540, 'Ekachakra, Bengal', 'Khardaha, Bengal', 'founders', 'The principal associate of Chaitanya Mahaprabhu, considered the incarnation of Balarama', 'Головний супутник Чайтан''ї Махапрабгу, вважається втіленням Баларами', 2),

  ('advaita-acharya', 'শ্রী অদ্বৈত আচার্য', 'Śrī Advaita Ācārya', 'Sri Advaita Acharya', 'Шрі Адвайта Ачар''я', 'আচার্য', 'Ācārya', 'The Teacher', 'Вчитель', 1434, 1559, 'Laur, Sylhet', 'Shantipur, Bengal', 'founders', 'Invoked the descent of Chaitanya Mahaprabhu through his prayers', 'Закликав прихід Чайтан''ї Махапрабгу своїми молитвами', 3),

  ('gadadhara-pandita', 'শ্রী গদাধর পণ্ডিত', 'Śrī Gadādhara Paṇḍita', 'Sri Gadadhara Pandita', 'Шрі Ґададгара Пандіт', 'পণ্ডিত', 'Paṇḍita', 'The Scholar', 'Учений', 1486, 1534, 'Navadvipa, Bengal', 'Puri, Odisha', 'founders', 'Intimate associate of Chaitanya, considered the incarnation of Radharani', 'Близький супутник Чайтан''ї, вважається втіленням Радгарані', 4),

  ('srivasa-thakura', 'শ্রীবাস ঠাকুর', 'Śrīvāsa Ṭhākura', 'Srivasa Thakura', 'Шрівас Тгакур', 'ঠাকুর', 'Ṭhākura', 'Revered One', 'Шанований', 1450, 1540, 'Sylhet', 'Navadvipa, Bengal', 'founders', 'The leader of sankirtana in whose courtyard the first congregational chanting took place', 'Лідер санкіртани, на подвір''ї якого відбувся перший спільний кіртан', 5)

ON CONFLICT (slug) DO UPDATE SET
  name_sanskrit = EXCLUDED.name_sanskrit,
  name_transliteration = EXCLUDED.name_transliteration,
  updated_at = now();

-- Era: Six Gosvamis of Vrindavan
INSERT INTO gv_authors (slug, name_sanskrit, name_transliteration, name_en, name_ua, title_sanskrit, title_transliteration, title_en, title_ua, birth_year, death_year, birth_place, samadhi_place, era, significance_en, significance_ua, display_order)
VALUES
  ('rupa-gosvami', 'শ্রীল রূপ গোস্বামী', 'Śrīla Rūpa Gosvāmī', 'Srila Rupa Gosvami', 'Шріла Рупа Ґосвамі', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Володар почуттів', 1489, 1564, 'Ramakeli, Bengal', 'Vrindavan', 'gosvamis', 'The leader of the Six Gosvamis, established the philosophical and devotional framework of Gaudiya Vaishnavism', 'Лідер шести Ґосвамі, заклав філософську та девоційну основу ґаудіа-вайшнавізму', 10),

  ('sanatana-gosvami', 'শ্রীল সনাতন গোস্বামী', 'Śrīla Sanātana Gosvāmī', 'Srila Sanatana Gosvami', 'Шріла Санатана Ґосвамі', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Володар почуттів', 1488, 1558, 'Ramakeli, Bengal', 'Vrindavan', 'gosvamis', 'Elder brother of Rupa Gosvami, codified Vaishnava rituals and theology', 'Старший брат Рупи Ґосвамі, кодифікував вайшнавські ритуали та теологію', 11),

  ('jiva-gosvami', 'শ্রীল জীব গোস্বামী', 'Śrīla Jīva Gosvāmī', 'Srila Jiva Gosvami', 'Шріла Джіва Ґосвамі', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Володар почуттів', 1513, 1598, 'Ramakeli, Bengal', 'Vrindavan', 'gosvamis', 'Greatest philosopher of Gaudiya Vaishnavism, author of the Sat-sandarbhas', 'Найвидатніший філософ ґаудіа-вайшнавізму, автор Шат-сандарбг', 12),

  ('raghunatha-dasa-gosvami', 'শ্রীল রঘুনাথ দাস গোস্বামী', 'Śrīla Raghunātha Dāsa Gosvāmī', 'Srila Raghunatha Dasa Gosvami', 'Шріла Раґгунатга Даса Ґосвамі', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Володар почуттів', 1494, 1586, 'Chandpura, Bengal', 'Vrindavan', 'gosvamis', 'The prayojana-acharya, exemplar of renunciation and divine love', 'Прайоджана-ачар''я, приклад зречення та божественної любові', 13),

  ('raghunatha-bhatta-gosvami', 'শ্রীল রঘুনাথ ভট্ট গোস্বামী', 'Śrīla Raghunātha Bhaṭṭa Gosvāmī', 'Srila Raghunatha Bhatta Gosvami', 'Шріла Раґгунатга Бгатта Ґосвамі', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Володар почуттів', 1505, 1579, 'Varanasi', 'Vrindavan', 'gosvamis', 'Expert reciter of Srimad-Bhagavatam, did not write but taught through recitation', 'Майстер читання Шрімад-Бгаґаватам, не писав, але вчив через декламацію', 14),

  ('gopala-bhatta-gosvami', 'শ্রীল গোপাল ভট্ট গোস্বামী', 'Śrīla Gopāla Bhaṭṭa Gosvāmī', 'Srila Gopala Bhatta Gosvami', 'Шріла Ґопала Бгатта Ґосвамі', 'গোস্বামী', 'Gosvāmī', 'Master of the Senses', 'Володар почуттів', 1503, 1578, 'Sri Rangam', 'Vrindavan', 'gosvamis', 'Compiled Hari-bhakti-vilasa, the standard book of Vaishnava rituals', 'Упорядкував Харі-бгакті-віласу, стандартний посібник вайшнавських ритуалів', 15)

ON CONFLICT (slug) DO UPDATE SET
  name_sanskrit = EXCLUDED.name_sanskrit,
  name_transliteration = EXCLUDED.name_transliteration,
  updated_at = now();

-- Era: Later Acharyas
INSERT INTO gv_authors (slug, name_sanskrit, name_transliteration, name_en, name_ua, title_sanskrit, title_transliteration, title_en, title_ua, birth_year, death_year, birth_place, samadhi_place, era, significance_en, significance_ua, display_order)
VALUES
  ('krishnadasa-kaviraja', 'শ্রীল কৃষ্ণদাস কবিরাজ', 'Śrīla Kṛṣṇadāsa Kavirāja', 'Srila Krishnadasa Kaviraja', 'Шріла Крішнадаса Кавіраджа', 'কবিরাজ', 'Kavirāja', 'King of Poets', 'Цар поетів', 1496, 1588, 'Jhamatpur, Bengal', 'Vrindavan', 'later_acharyas', 'Author of Sri Chaitanya-charitamrita, the authoritative biography of Chaitanya Mahaprabhu', 'Автор Шрі Чайтан''я-чарітамріти, авторитетної біографії Чайтан''ї Махапрабгу', 20),

  ('vrindavana-dasa-thakura', 'শ্রীল বৃন্দাবন দাস ঠাকুর', 'Śrīla Vṛndāvana Dāsa Ṭhākura', 'Srila Vrindavana Dasa Thakura', 'Шріла Вріндавана Даса Тгакур', 'ঠাকুর', 'Ṭhākura', 'Revered One', 'Шанований', 1507, 1589, 'Mamgachi, Bengal', 'Denur, Bengal', 'later_acharyas', 'Author of Sri Chaitanya Bhagavata, the Vyasa of Chaitanya-lila', 'Автор Шрі Чайтан''я Бгаґавати, В''яса Чайтан''я-ліли', 21),

  ('narottama-dasa-thakura', 'শ্রীল নরোত্তম দাস ঠাকুর', 'Śrīla Narottama Dāsa Ṭhākura', 'Srila Narottama Dasa Thakura', 'Шріла Нароттама Даса Тгакур', 'ঠাকুর', 'Ṭhākura', 'Revered One', 'Шанований', 1540, 1611, 'Kheturi, Bengal', 'Kheturi, Bengal', 'later_acharyas', 'Great acharya and poet, organized the first Gaura-purnima festival', 'Великий ачар''я та поет, організував перший фестиваль Ґаура-пурніми', 22),

  ('visvanatha-chakravarti', 'শ্রীল বিশ্বনাথ চক্রবর্তী ঠাকুর', 'Śrīla Viśvanātha Cakravartī Ṭhākura', 'Srila Visvanatha Chakravarti Thakura', 'Шріла Вішванатга Чакраварті Тгакур', 'ঠাকুর', 'Ṭhākura', 'Revered One', 'Шанований', 1626, 1708, 'Devagram, Bengal', 'Vrindavan', 'later_acharyas', 'Prolific commentator, saved the Gaudiya lineage at Jaipur debate', 'Плідний коментатор, врятував ґаудіа-лінію на дебатах у Джайпурі', 23),

  ('baladeva-vidyabhushana', 'শ্রীল বলদেব বিদ্যাভূষণ', 'Śrīla Baladeva Vidyābhūṣaṇa', 'Srila Baladeva Vidyabhushana', 'Шріла Баладева Відьябгушана', 'বিদ্যাভূষণ', 'Vidyābhūṣaṇa', 'Ornament of Learning', 'Окраса вчення', 1700, 1793, 'Orissa', 'Vrindavan', 'later_acharyas', 'Author of Govinda-bhashya, the Gaudiya commentary on Vedanta-sutra', 'Автор Ґовінда-бгаш''ї, ґаудіа-коментаря на Веданта-сутру', 24)

ON CONFLICT (slug) DO UPDATE SET
  name_sanskrit = EXCLUDED.name_sanskrit,
  name_transliteration = EXCLUDED.name_transliteration,
  updated_at = now();

-- Era: Modern Acharyas
INSERT INTO gv_authors (slug, name_sanskrit, name_transliteration, name_en, name_ua, title_sanskrit, title_transliteration, title_en, title_ua, birth_year, death_year, birth_place, samadhi_place, era, significance_en, significance_ua, display_order)
VALUES
  ('bhaktivinoda-thakura', 'শ্রীল ভক্তিবিনোদ ঠাকুর', 'Śrīla Bhaktivinoda Ṭhākura', 'Srila Bhaktivinoda Thakura', 'Шріла Бгактівінода Тгакур', 'ঠাকুর', 'Ṭhākura', 'Revered One', 'Шанований', 1838, 1914, 'Birnagar, Bengal', 'Puri, Odisha', 'modern', 'The pioneer of the modern Gaudiya Vaishnava renaissance, prolific writer and visionary', 'Піонер сучасного відродження ґаудіа-вайшнавізму, плідний письменник і провидець', 30),

  ('gaurakisora-dasa-babaji', 'শ্রীল গৌরকিশোর দাস বাবাজী', 'Śrīla Gaurakiśora Dāsa Bābājī', 'Srila Gaurakisora Dasa Babaji', 'Шріла Ґауракішора Даса Бабаджі', 'বাবাজী', 'Bābājī', 'Renunciate', 'Зречений', 1838, 1915, 'Vagalpara, Bengal', 'Mayapur', 'modern', 'Exemplar of renunciation and devotion, guru of Bhaktisiddhanta Sarasvati', 'Приклад зречення та відданості, ґуру Бгактісіддганти Сарасваті', 31),

  ('bhaktisiddhanta-sarasvati', 'শ্রীল ভক্তিসিদ্ধান্ত সরস্বতী ঠাকুর', 'Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura', 'Srila Bhaktisiddhanta Sarasvati Thakura', 'Шріла Бгактісіддганта Сарасваті Тгакур', 'ঠাকুর', 'Ṭhākura', 'Revered One', 'Шанований', 1874, 1937, 'Puri, Odisha', 'Mayapur', 'modern', 'Founder of Gaudiya Math, revolutionary preacher who trained disciples for worldwide mission', 'Засновник Ґаудіа Матг, революційний проповідник, який готував учнів для всесвітньої місії', 32),

  ('bhaktivedanta-swami-prabhupada', 'শ্রীল অ.চ. ভক্তিবেদান্ত স্বামী প্রভুপাদ', 'Śrīla A.C. Bhaktivedānta Svāmī Prabhupāda', 'Srila A.C. Bhaktivedanta Swami Prabhupada', 'Шріла А.Ч. Бгактіведанта Свамі Прабгупада', 'প্রভুপাদ', 'Prabhupāda', 'At Whose Feet Masters Sit', 'Той, біля чиїх стіп сидять вчителі', 1896, 1977, 'Kolkata', 'Vrindavan', 'modern', 'Founder-Acharya of ISKCON, brought Gaudiya Vaishnavism to the Western world', 'Засновник-ачар''я ІСККОН, приніс ґаудіа-вайшнавізм на Захід', 33)

ON CONFLICT (slug) DO UPDATE SET
  name_sanskrit = EXCLUDED.name_sanskrit,
  name_transliteration = EXCLUDED.name_transliteration,
  updated_at = now();

-- Set guru relationships
UPDATE gv_authors SET guru_id = (SELECT id FROM gv_authors WHERE slug = 'chaitanya-mahaprabhu') WHERE slug IN ('rupa-gosvami', 'sanatana-gosvami', 'raghunatha-dasa-gosvami');
UPDATE gv_authors SET guru_id = (SELECT id FROM gv_authors WHERE slug = 'nityananda-prabhu') WHERE slug = 'vrindavana-dasa-thakura';
UPDATE gv_authors SET guru_id = (SELECT id FROM gv_authors WHERE slug = 'rupa-gosvami') WHERE slug IN ('jiva-gosvami', 'krishnadasa-kaviraja');
UPDATE gv_authors SET guru_id = (SELECT id FROM gv_authors WHERE slug = 'jiva-gosvami') WHERE slug = 'narottama-dasa-thakura';
UPDATE gv_authors SET guru_id = (SELECT id FROM gv_authors WHERE slug = 'narottama-dasa-thakura') WHERE slug = 'visvanatha-chakravarti';
UPDATE gv_authors SET guru_id = (SELECT id FROM gv_authors WHERE slug = 'visvanatha-chakravarti') WHERE slug = 'baladeva-vidyabhushana';
UPDATE gv_authors SET guru_id = (SELECT id FROM gv_authors WHERE slug = 'gaurakisora-dasa-babaji') WHERE slug = 'bhaktisiddhanta-sarasvati';
UPDATE gv_authors SET guru_id = (SELECT id FROM gv_authors WHERE slug = 'bhaktisiddhanta-sarasvati') WHERE slug = 'bhaktivedanta-swami-prabhupada';

COMMIT;
