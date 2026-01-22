-- Populate Vaishnava Calendar with ISKCON acharyas and festivals
-- All dates are in Vedic lunar calendar format (tithi + month)

BEGIN;

-- ============================================
-- 1. APPEARANCE/DISAPPEARANCE DAYS
-- ============================================

-- Get category IDs
DO $$
DECLARE
  v_appearance_cat INTEGER;
  v_disappearance_cat INTEGER;
  v_festival_cat INTEGER;
  v_major_festival_cat INTEGER;
BEGIN
  SELECT id INTO v_appearance_cat FROM festival_categories WHERE slug = 'appearance';
  SELECT id INTO v_disappearance_cat FROM festival_categories WHERE slug = 'disappearance';
  SELECT id INTO v_festival_cat FROM festival_categories WHERE slug = 'special';
  SELECT id INTO v_major_festival_cat FROM festival_categories WHERE slug = 'major-festival';

  -- ============================================
  -- CHAITANYA MAHAPRABHU AND PANCHA-TATTVA
  -- ============================================

  INSERT INTO appearance_days (slug, category_id, event_type, person_name_sanskrit, person_name_ua, person_name_en, person_title_ua, person_title_en, vaishnava_month_id, tithi_number, paksha, fasting_level, is_major, description_ua, description_en) VALUES
  ('chaitanya-mahaprabhu-appearance', v_appearance_cat, 'appearance', 'Śrī Caitanya Mahāprabhu', 'Шрі Чайтанья Махапрабгу', 'Sri Chaitanya Mahaprabhu', 'Верховний Господь', 'The Supreme Lord', 11, 15, 'shukla', 'full', true, 'Явлення Шрі Чайтаньї Махапрабгу, Золотого Аватара', 'Appearance of Sri Chaitanya Mahaprabhu, the Golden Avatar'),
  ('chaitanya-mahaprabhu-disappearance', v_disappearance_cat, 'disappearance', 'Śrī Caitanya Mahāprabhu', 'Шрі Чайтанья Махапрабгу', 'Sri Chaitanya Mahaprabhu', 'Верховний Господь', 'The Supreme Lord', 4, 15, 'shukla', 'half', true, 'Відхід Шрі Чайтаньї Махапрабгу', 'Disappearance of Sri Chaitanya Mahaprabhu'),
  ('nityananda-prabhu-appearance', v_appearance_cat, 'appearance', 'Śrī Nityānanda Prabhu', 'Шрі Нітьянанда Прабгу', 'Sri Nityananda Prabhu', 'Верховний Господь', 'The Supreme Lord', 10, 13, 'shukla', 'full', true, 'Явлення Шрі Нітьянанди Прабгу', 'Appearance of Sri Nityananda Prabhu'),
  ('advaita-acharya-appearance', v_appearance_cat, 'appearance', 'Śrī Advaita Ācārya', 'Шрі Адвайта Ачар''я', 'Sri Advaita Acharya', 'Ачар''я', 'Acharya', 10, 7, 'shukla', 'half', true, 'Явлення Шрі Адвайти Ачар''ї', 'Appearance of Sri Advaita Acharya'),
  ('advaita-acharya-disappearance', v_disappearance_cat, 'disappearance', 'Śrī Advaita Ācārya', 'Шрі Адвайта Ачар''я', 'Sri Advaita Acharya', 'Ачар''я', 'Acharya', 5, 7, 'shukla', 'half', false, 'Відхід Шрі Адвайти Ачар''ї', 'Disappearance of Sri Advaita Acharya'),
  ('gadadhara-pandita-appearance', v_appearance_cat, 'appearance', 'Śrī Gadādhara Paṇḍita', 'Шрі Ґададгара Пандіт', 'Sri Gadadhara Pandita', 'Пандіт', 'Pandita', 12, 15, 'shukla', 'half', false, 'Явлення Шрі Ґададгари Пандіта', 'Appearance of Sri Gadadhara Pandita'),
  ('gadadhara-pandita-disappearance', v_disappearance_cat, 'disappearance', 'Śrī Gadādhara Paṇḍita', 'Шрі Ґададгара Пандіт', 'Sri Gadadhara Pandita', 'Пандіт', 'Pandita', 4, 1, 'krishna', 'half', false, 'Відхід Шрі Ґададгари Пандіта', 'Disappearance of Sri Gadadhara Pandita'),
  ('srivasa-thakura-appearance', v_appearance_cat, 'appearance', 'Śrī Śrīvāsa Ṭhākura', 'Шрі Шріваса Тхакур', 'Sri Srivasa Thakura', 'Тхакур', 'Thakura', 12, 15, 'shukla', 'half', false, 'Явлення Шрі Шрівасі Тхакура', 'Appearance of Sri Srivasa Thakura'),
  ('srivasa-thakura-disappearance', v_disappearance_cat, 'disappearance', 'Śrī Śrīvāsa Ṭhākura', 'Шрі Шріваса Тхакур', 'Sri Srivasa Thakura', 'Тхакур', 'Thakura', 4, 2, 'krishna', 'half', false, 'Відхід Шрі Шрівасі Тхакура', 'Disappearance of Sri Srivasa Thakura')
  ON CONFLICT (slug) DO NOTHING;

  -- ============================================
  -- SIX GOSWAMIS OF VRINDAVAN
  -- ============================================

  INSERT INTO appearance_days (slug, category_id, event_type, person_name_sanskrit, person_name_ua, person_name_en, person_title_ua, person_title_en, vaishnava_month_id, tithi_number, paksha, fasting_level, is_major, description_ua, description_en) VALUES
  ('rupa-goswami-appearance', v_appearance_cat, 'appearance', 'Śrīla Rūpa Gosvāmī', 'Шріла Рупа Ґосвамі', 'Srila Rupa Goswami', 'Ґосвамі', 'Goswami', 12, 12, 'shukla', 'half', false, 'Явлення Шріли Рупи Ґосвамі', 'Appearance of Srila Rupa Goswami'),
  ('rupa-goswami-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Rūpa Gosvāmī', 'Шріла Рупа Ґосвамі', 'Srila Rupa Goswami', 'Ґосвамі', 'Goswami', 5, 12, 'shukla', 'half', true, 'Відхід Шріли Рупи Ґосвамі', 'Disappearance of Srila Rupa Goswami'),
  ('sanatana-goswami-appearance', v_appearance_cat, 'appearance', 'Śrīla Sanātana Gosvāmī', 'Шріла Санатана Ґосвамі', 'Srila Sanatana Goswami', 'Ґосвамі', 'Goswami', 12, 5, 'shukla', 'half', false, 'Явлення Шріли Санатани Ґосвамі', 'Appearance of Srila Sanatana Goswami'),
  ('sanatana-goswami-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Sanātana Gosvāmī', 'Шріла Санатана Ґосвамі', 'Srila Sanatana Goswami', 'Ґосвамі', 'Goswami', 4, 10, 'shukla', 'half', true, 'Відхід Шріли Санатани Ґосвамі', 'Disappearance of Srila Sanatana Goswami'),
  ('raghunath-das-goswami-appearance', v_appearance_cat, 'appearance', 'Śrīla Raghunātha dāsa Gosvāmī', 'Шріла Раґгунатха даса Ґосвамі', 'Srila Raghunatha dasa Goswami', 'Ґосвамі', 'Goswami', 10, 5, 'shukla', 'half', false, 'Явлення Шріли Раґгунатхи даса Ґосвамі', 'Appearance of Srila Raghunatha dasa Goswami'),
  ('raghunath-das-goswami-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Raghunātha dāsa Gosvāmī', 'Шріла Раґгунатха даса Ґосвамі', 'Srila Raghunatha dasa Goswami', 'Ґосвамі', 'Goswami', 7, 12, 'shukla', 'half', true, 'Відхід Шріли Раґгунатхи даса Ґосвамі', 'Disappearance of Srila Raghunatha dasa Goswami'),
  ('raghunath-bhatta-goswami-appearance', v_appearance_cat, 'appearance', 'Śrīla Raghunātha Bhaṭṭa Gosvāmī', 'Шріла Раґгунатха Бгатта Ґосвамі', 'Srila Raghunatha Bhatta Goswami', 'Ґосвамі', 'Goswami', 12, 7, 'shukla', 'half', false, 'Явлення Шріли Раґгунатхи Бгатти Ґосвамі', 'Appearance of Srila Raghunatha Bhatta Goswami'),
  ('raghunath-bhatta-goswami-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Raghunātha Bhaṭṭa Gosvāmī', 'Шріла Раґгунатха Бгатта Ґосвамі', 'Srila Raghunatha Bhatta Goswami', 'Ґосвамі', 'Goswami', 7, 12, 'shukla', 'half', false, 'Відхід Шріли Раґгунатхи Бгатти Ґосвамі', 'Disappearance of Srila Raghunatha Bhatta Goswami'),
  ('jiva-goswami-appearance', v_appearance_cat, 'appearance', 'Śrīla Jīva Gosvāmī', 'Шріла Джіва Ґосвамі', 'Srila Jiva Goswami', 'Ґосвамі', 'Goswami', 5, 5, 'shukla', 'half', false, 'Явлення Шріли Джіви Ґосвамі', 'Appearance of Srila Jiva Goswami'),
  ('jiva-goswami-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Jīva Gosvāmī', 'Шріла Джіва Ґосвамі', 'Srila Jiva Goswami', 'Ґосвамі', 'Goswami', 7, 3, 'shukla', 'half', false, 'Відхід Шріли Джіви Ґосвамі', 'Disappearance of Srila Jiva Goswami'),
  ('gopal-bhatta-goswami-appearance', v_appearance_cat, 'appearance', 'Śrīla Gopāla Bhaṭṭa Gosvāmī', 'Шріла Ґопал Бгатта Ґосвамі', 'Srila Gopal Bhatta Goswami', 'Ґосвамі', 'Goswami', 12, 13, 'shukla', 'half', false, 'Явлення Шріли Ґопала Бгатти Ґосвамі', 'Appearance of Srila Gopal Bhatta Goswami'),
  ('gopal-bhatta-goswami-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Gopāla Bhaṭṭa Gosvāmī', 'Шріла Ґопал Бгатта Ґосвамі', 'Srila Gopal Bhatta Goswami', 'Ґосвамі', 'Goswami', 5, 6, 'shukla', 'half', false, 'Відхід Шріли Ґопала Бгатти Ґосвамі', 'Disappearance of Srila Gopal Bhatta Goswami')
  ON CONFLICT (slug) DO NOTHING;

  -- ============================================
  -- ACHARYAS IN PARAMPARA
  -- ============================================

  INSERT INTO appearance_days (slug, category_id, event_type, person_name_sanskrit, person_name_ua, person_name_en, person_title_ua, person_title_en, vaishnava_month_id, tithi_number, paksha, fasting_level, is_major, description_ua, description_en) VALUES
  -- Vishvanath Chakravarti Thakur
  ('vishvanath-chakravarti-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Viśvanātha Cakravartī Ṭhākura', 'Шріла Вішванатх Чакраварті Тхакур', 'Srila Vishvanath Chakravarti Thakur', 'Тхакур', 'Thakura', 10, 5, 'shukla', 'half', false, 'Відхід Шріли Вішванатха Чакраварті Тхакура', 'Disappearance of Srila Vishvanath Chakravarti Thakur'),
  -- Baladeva Vidyabhusana
  ('baladeva-vidyabhusana-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Baladeva Vidyābhūṣaṇa', 'Шріла Баладева Відьябгушана', 'Srila Baladeva Vidyabhusana', 'Ачар''я', 'Acharya', 4, 2, 'shukla', 'half', false, 'Відхід Шріли Баладеви Відьябгушани', 'Disappearance of Srila Baladeva Vidyabhusana'),
  -- Jagannath Das Babaji
  ('jagannath-das-babaji-appearance', v_appearance_cat, 'appearance', 'Śrīla Jagannātha dāsa Bābājī', 'Шріла Джаґаннатха даса Бабаджі', 'Srila Jagannatha dasa Babaji', 'Бабаджі', 'Babaji', 10, 5, 'krishna', 'half', false, 'Явлення Шріли Джаґаннатхи даса Бабаджі', 'Appearance of Srila Jagannatha dasa Babaji'),
  ('jagannath-das-babaji-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Jagannātha dāsa Bābājī', 'Шріла Джаґаннатха даса Бабаджі', 'Srila Jagannatha dasa Babaji', 'Бабаджі', 'Babaji', 11, 1, 'krishna', 'half', false, 'Відхід Шріли Джаґаннатхи даса Бабаджі', 'Disappearance of Srila Jagannatha dasa Babaji'),
  -- Bhaktivinoda Thakur
  ('bhaktivinoda-thakur-appearance', v_appearance_cat, 'appearance', 'Śrīla Bhaktivinoda Ṭhākura', 'Шріла Бгактівінода Тхакур', 'Srila Bhaktivinoda Thakur', 'Тхакур', 'Thakura', 6, 3, 'shukla', 'half', true, 'Явлення Шріли Бгактівіноди Тхакура', 'Appearance of Srila Bhaktivinoda Thakur'),
  ('bhaktivinoda-thakur-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Bhaktivinoda Ṭhākura', 'Шріла Бгактівінода Тхакур', 'Srila Bhaktivinoda Thakur', 'Тхакур', 'Thakura', 4, 12, 'shukla', 'half', true, 'Відхід Шріли Бгактівіноди Тхакура', 'Disappearance of Srila Bhaktivinoda Thakur'),
  -- Gaurakishor Das Babaji
  ('gaurakishor-das-babaji-appearance', v_appearance_cat, 'appearance', 'Śrīla Gaurakiśora dāsa Bābājī', 'Шріла Ґауракішора даса Бабаджі', 'Srila Gaurakishor dasa Babaji', 'Бабаджі', 'Babaji', 8, 12, 'krishna', 'half', false, 'Явлення Шріли Ґауракішори даса Бабаджі', 'Appearance of Srila Gaurakishor dasa Babaji'),
  ('gaurakishor-das-babaji-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Gaurakiśora dāsa Bābājī', 'Шріла Ґауракішора даса Бабаджі', 'Srila Gaurakishor dasa Babaji', 'Бабаджі', 'Babaji', 8, 11, 'krishna', 'half', true, 'Відхід Шріли Ґауракішори даса Бабаджі', 'Disappearance of Srila Gaurakishor dasa Babaji'),
  -- Bhaktisiddhanta Sarasvati Thakur
  ('bhaktisiddhanta-sarasvati-appearance', v_appearance_cat, 'appearance', 'Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura', 'Шріла Бгактісіддганта Сарасваті Тхакур', 'Srila Bhaktisiddhanta Sarasvati Thakur', 'Тхакур', 'Thakura', 10, 5, 'shukla', 'half', true, 'Явлення Шріли Бгактісіддганти Сарасваті Тхакура', 'Appearance of Srila Bhaktisiddhanta Sarasvati Thakur'),
  ('bhaktisiddhanta-sarasvati-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura', 'Шріла Бгактісіддганта Сарасваті Тхакур', 'Srila Bhaktisiddhanta Sarasvati Thakur', 'Тхакур', 'Thakura', 8, 5, 'krishna', 'half', true, 'Відхід Шріли Бгактісіддганти Сарасваті Тхакура', 'Disappearance of Srila Bhaktisiddhanta Sarasvati Thakur'),
  -- A.C. Bhaktivedanta Swami Prabhupada
  ('prabhupada-appearance', v_appearance_cat, 'appearance', 'Śrīla A.C. Bhaktivedānta Svāmī Prabhupāda', 'Шріла А.Ч. Бгактіведанта Свамі Прабгупада', 'Srila A.C. Bhaktivedanta Swami Prabhupada', 'Засновник-Ачар''я ІСККОН', 'Founder-Acharya of ISKCON', 5, 9, 'krishna', 'half', true, 'Явлення Шріли Прабгупади', 'Appearance of Srila Prabhupada'),
  ('prabhupada-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla A.C. Bhaktivedānta Svāmī Prabhupāda', 'Шріла А.Ч. Бгактіведанта Свамі Прабгупада', 'Srila A.C. Bhaktivedanta Swami Prabhupada', 'Засновник-Ачар''я ІСККОН', 'Founder-Acharya of ISKCON', 8, 4, 'krishna', 'half', true, 'Відхід Шріли Прабгупади', 'Disappearance of Srila Prabhupada')
  ON CONFLICT (slug) DO NOTHING;

  -- ============================================
  -- OTHER IMPORTANT VAISHNAVAS
  -- ============================================

  INSERT INTO appearance_days (slug, category_id, event_type, person_name_sanskrit, person_name_ua, person_name_en, person_title_ua, person_title_en, vaishnava_month_id, tithi_number, paksha, fasting_level, is_major, description_ua, description_en) VALUES
  -- Vishnupriya Devi
  ('vishnupriya-devi-appearance', v_appearance_cat, 'appearance', 'Śrīmatī Viṣṇupriyā Devī', 'Шріматі Вішнупрія Деві', 'Srimati Vishnupriya Devi', 'Вічна дружина Господа Чайтаньї', 'Eternal consort of Lord Chaitanya', 10, 5, 'shukla', 'half', false, 'Явлення Шріматі Вішнупрії Деві', 'Appearance of Srimati Vishnupriya Devi'),
  -- Pundarika Vidyanidhi
  ('pundarika-vidyanidhi-appearance', v_appearance_cat, 'appearance', 'Śrī Puṇḍarīka Vidyānidhi', 'Шрі Пундаріка Відьянідгі', 'Sri Pundarika Vidyanidhi', 'Відданий', 'Devotee', 10, 5, 'shukla', 'half', false, 'Явлення Шрі Пундаріки Відьянідгі', 'Appearance of Sri Pundarika Vidyanidhi'),
  -- Narottama Das Thakur
  ('narottama-das-thakur-appearance', v_appearance_cat, 'appearance', 'Śrīla Narottama dāsa Ṭhākura', 'Шріла Нароттама даса Тхакур', 'Srila Narottama dasa Thakur', 'Тхакур', 'Thakura', 10, 5, 'shukla', 'half', false, 'Явлення Шріли Нароттами даса Тхакура', 'Appearance of Srila Narottama dasa Thakur'),
  ('narottama-das-thakur-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Narottama dāsa Ṭhākura', 'Шріла Нароттама даса Тхакур', 'Srila Narottama dasa Thakur', 'Тхакур', 'Thakura', 8, 6, 'krishna', 'half', false, 'Відхід Шріли Нароттами даса Тхакура', 'Disappearance of Srila Narottama dasa Thakur'),
  -- Shyamananda Pandit
  ('shyamananda-pandit-appearance', v_appearance_cat, 'appearance', 'Śrīla Śyāmānanda Paṇḍita', 'Шріла Шьямананда Пандіт', 'Srila Shyamananda Pandit', 'Пандіт', 'Pandita', 12, 12, 'krishna', 'half', false, 'Явлення Шріли Шьямананди Пандіта', 'Appearance of Srila Shyamananda Pandit'),
  ('shyamananda-pandit-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Śyāmānanda Paṇḍita', 'Шріла Шьямананда Пандіт', 'Srila Shyamananda Pandit', 'Пандіт', 'Pandita', 8, 6, 'krishna', 'half', false, 'Відхід Шріли Шьямананди Пандіта', 'Disappearance of Srila Shyamananda Pandit'),
  -- Srinivas Acharya
  ('srinivas-acharya-appearance', v_appearance_cat, 'appearance', 'Śrīla Śrīnivāsa Ācārya', 'Шріла Шрініваса Ачар''я', 'Srila Srinivasa Acharya', 'Ачар''я', 'Acharya', 12, 15, 'shukla', 'half', false, 'Явлення Шріли Шрінівасі Ачар''ї', 'Appearance of Srila Srinivasa Acharya'),
  ('srinivas-acharya-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Śrīnivāsa Ācārya', 'Шріла Шрініваса Ачар''я', 'Srila Srinivasa Acharya', 'Ачар''я', 'Acharya', 7, 12, 'shukla', 'half', false, 'Відхід Шріли Шрінівасі Ачар''ї', 'Disappearance of Srila Srinivasa Acharya'),
  -- Locana Das Thakur
  ('locana-das-thakur-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Locana dāsa Ṭhākura', 'Шріла Лочана даса Тхакур', 'Srila Locana dasa Thakur', 'Тхакур', 'Thakura', 8, 8, 'krishna', 'half', false, 'Відхід Шріли Лочани даса Тхакура', 'Disappearance of Srila Locana dasa Thakur'),
  -- Krishnadas Kaviraj Goswami
  ('krishnadas-kaviraj-goswami-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Kṛṣṇadāsa Kavirāja Gosvāmī', 'Шріла Крішнадаса Кавіраджа Ґосвамі', 'Srila Krishnadas Kaviraj Goswami', 'Ґосвамі', 'Goswami', 7, 12, 'shukla', 'half', false, 'Відхід Шріли Крішнадаси Кавіраджі Ґосвамі', 'Disappearance of Srila Krishnadas Kaviraj Goswami'),
  -- Vrindavan Das Thakur
  ('vrindavan-das-thakur-appearance', v_appearance_cat, 'appearance', 'Śrīla Vṛndāvana dāsa Ṭhākura', 'Шріла Вріндаван даса Тхакур', 'Srila Vrindavan dasa Thakur', 'Тхакур', 'Thakura', 12, 12, 'shukla', 'half', false, 'Явлення Шріли Вріндавани даса Тхакура', 'Appearance of Srila Vrindavan dasa Thakur'),
  ('vrindavan-das-thakur-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Vṛndāvana dāsa Ṭhākura', 'Шріла Вріндаван даса Тхакур', 'Srila Vrindavan dasa Thakur', 'Тхакур', 'Thakura', 4, 12, 'shukla', 'half', false, 'Відхід Шріли Вріндавани даса Тхакура', 'Disappearance of Srila Vrindavan dasa Thakur'),
  -- Madhvacharya
  ('madhvacharya-disappearance', v_disappearance_cat, 'disappearance', 'Śrī Madhvācārya', 'Шрі Мадгвачар''я', 'Sri Madhvacharya', 'Ачар''я', 'Acharya', 10, 9, 'shukla', 'half', false, 'Відхід Шрі Мадгвачар''ї', 'Disappearance of Sri Madhvacharya'),
  -- Ramanujacharya
  ('ramanujacharya-disappearance', v_disappearance_cat, 'disappearance', 'Śrī Rāmānujācārya', 'Шрі Рамануджачар''я', 'Sri Ramanujacharya', 'Ачар''я', 'Acharya', 7, 10, 'shukla', 'half', false, 'Відхід Шрі Рамануджачар''ї', 'Disappearance of Sri Ramanujacharya'),
  -- Isvara Puri
  ('isvara-puri-appearance', v_appearance_cat, 'appearance', 'Śrīla Īśvara Purī', 'Шріла Ішвара Пурі', 'Srila Ishvara Puri', 'Духовний вчитель Господа Чайтаньї', 'Spiritual master of Lord Chaitanya', 4, 13, 'shukla', 'half', false, 'Явлення Шріли Ішвари Пурі', 'Appearance of Srila Ishvara Puri'),
  ('isvara-puri-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Īśvara Purī', 'Шріла Ішвара Пурі', 'Srila Ishvara Puri', 'Духовний вчитель Господа Чайтаньї', 'Spiritual master of Lord Chaitanya', 8, 13, 'krishna', 'half', false, 'Відхід Шріли Ішвари Пурі', 'Disappearance of Srila Ishvara Puri'),
  -- Haridasa Thakur
  ('haridasa-thakur-appearance', v_appearance_cat, 'appearance', 'Śrīla Haridāsa Ṭhākura', 'Шріла Харідаса Тхакур', 'Srila Haridasa Thakur', 'Намачар''я', 'Namacharya', 11, 15, 'shukla', 'half', false, 'Явлення Шріли Харідаси Тхакура', 'Appearance of Srila Haridasa Thakur'),
  ('haridasa-thakur-disappearance', v_disappearance_cat, 'disappearance', 'Śrīla Haridāsa Ṭhākura', 'Шріла Харідаса Тхакур', 'Srila Haridasa Thakur', 'Намачар''я', 'Namacharya', 5, 4, 'krishna', 'half', true, 'Відхід Шріли Харідаси Тхакура', 'Disappearance of Srila Haridasa Thakur')
  ON CONFLICT (slug) DO NOTHING;

  -- ============================================
  -- 2. MAJOR FESTIVALS
  -- ============================================

  INSERT INTO vaishnava_festivals (slug, category_id, name_sanskrit, name_ua, name_en, vaishnava_month_id, tithi_number, paksha, fasting_level, is_major, short_description_ua, short_description_en, description_ua, description_en) VALUES
  -- Krishna Janmashtami
  ('janmashtami', v_major_festival_cat, 'Śrī Kṛṣṇa Janmāṣṭamī', 'Шрі Крішна Джанмаштамі', 'Sri Krishna Janmashtami', 5, 8, 'krishna', 'full', true, 'Явлення Господа Шрі Крішни', 'Appearance of Lord Sri Krishna', 'Святкування явлення Верховного Господа Шрі Крішни у в''язниці Камси в Матхурі', 'Celebration of the appearance of Supreme Lord Sri Krishna in the prison of Kamsa in Mathura'),
  -- Nandotsava
  ('nandotsava', v_major_festival_cat, 'Nandotsava', 'Нандотсава', 'Nandotsava', 5, 9, 'krishna', 'none', true, 'Свято Махараджі Нанди', 'Festival of Maharaja Nanda', 'Святкування народження Крішни в домі Махараджі Нанди', 'Celebration of Krishna''s birth in the house of Maharaja Nanda'),
  -- Radhashtami
  ('radhashtami', v_major_festival_cat, 'Śrī Rādhāṣṭamī', 'Шрі Радгаштамі', 'Sri Radhashtami', 6, 8, 'shukla', 'half', true, 'Явлення Шріматі Радгарані', 'Appearance of Srimati Radharani', 'Святкування явлення Шріматі Радгарані, вічної супутниці Господа Крішни', 'Celebration of the appearance of Srimati Radharani, eternal consort of Lord Krishna'),
  -- Gaura Purnima
  ('gaura-purnima', v_major_festival_cat, 'Gaura Pūrṇimā', 'Ґаура Пурніма', 'Gaura Purnima', 11, 15, 'shukla', 'full', true, 'Явлення Шрі Чайтаньї Махапрабгу', 'Appearance of Sri Chaitanya Mahaprabhu', 'Найважливіше свято в Ґаудія-вайшнавізмі - явлення Золотого Аватара', 'The most important festival in Gaudiya Vaishnavism - appearance of the Golden Avatar'),
  -- Rama Navami
  ('rama-navami', v_major_festival_cat, 'Śrī Rāma Navamī', 'Шрі Рама Навамі', 'Sri Rama Navami', 12, 9, 'shukla', 'half', true, 'Явлення Господа Рамачандри', 'Appearance of Lord Ramachandra', 'Святкування явлення Господа Рами в Айодг''ї', 'Celebration of the appearance of Lord Rama in Ayodhya'),
  -- Nrisimha Chaturdashi
  ('nrisimha-chaturdashi', v_major_festival_cat, 'Śrī Nṛsiṁha Caturdaśī', 'Шрі Нрісімха Чатурдаші', 'Sri Nrisimha Chaturdashi', 1, 14, 'shukla', 'full', true, 'Явлення Господа Нрісімхадева', 'Appearance of Lord Nrisimhadeva', 'Святкування явлення Господа Нрісімхадева, захисника відданих', 'Celebration of the appearance of Lord Nrisimhadeva, protector of devotees'),
  -- Balarama Purnima
  ('balarama-purnima', v_major_festival_cat, 'Śrī Balarāma Pūrṇimā', 'Шрі Баларама Пурніма', 'Sri Balarama Purnima', 5, 15, 'shukla', 'half', true, 'Явлення Господа Баларами', 'Appearance of Lord Balarama', 'Святкування явлення Господа Баларами', 'Celebration of the appearance of Lord Balarama'),
  -- Govardhan Puja
  ('govardhan-puja', v_major_festival_cat, 'Govardhana Pūjā', 'Ґовардхана Пуджа', 'Govardhan Puja', 8, 1, 'shukla', 'none', true, 'Поклоніння пагорбу Ґовардхану', 'Worship of Govardhan Hill', 'Святкування на честь пагорба Ґовардхана, піднятого Господом Крішною', 'Celebration in honor of Govardhan Hill lifted by Lord Krishna'),
  -- Ratha Yatra
  ('ratha-yatra', v_major_festival_cat, 'Ratha Yātrā', 'Ратха Ятра', 'Ratha Yatra', 3, 2, 'shukla', 'none', true, 'Фестиваль колісниць', 'Festival of Chariots', 'Велике свято колісниць Господа Джаґаннатхи', 'Great chariot festival of Lord Jagannatha'),
  -- Jhulana Yatra (start)
  ('jhulana-yatra', v_major_festival_cat, 'Jhūlana Yātrā', 'Джгулана Ятра', 'Jhulana Yatra', 5, 11, 'shukla', 'none', false, 'Фестиваль гойдалок', 'Swing Festival', 'П''ятиденний фестиваль гойдання Божеств', 'Five-day festival of swinging the Deities'),
  -- Akshaya Tritiya
  ('akshaya-tritiya', v_major_festival_cat, 'Akṣaya Tṛtīyā', 'Акшая Трітія', 'Akshaya Tritiya', 1, 3, 'shukla', 'none', false, 'День Парашурами та Чанданаятри', 'Day of Parashurama and Chandana-yatra', 'Початок Чандана-ятри; явлення Парашурами', 'Beginning of Chandana-yatra; appearance of Parashurama'),
  -- Vasanta Panchami
  ('vasanta-panchami', v_festival_cat, 'Vasanta Pañcamī', 'Васанта Панчамі', 'Vasanta Panchami', 10, 5, 'shukla', 'none', false, 'Свято весни', 'Spring Festival', 'Святкування приходу весни; день Сарасваті', 'Celebration of spring; day of Sarasvati'),
  -- Diwali / Kartik Purnima
  ('diwali', v_major_festival_cat, 'Dīpāvalī', 'Діпавалі', 'Diwali', 8, 15, 'krishna', 'none', true, 'Фестиваль вогнів', 'Festival of Lights', 'Святкування повернення Господа Рами в Айодг''ю', 'Celebration of Lord Rama''s return to Ayodhya'),
  -- Kartik beginning
  ('kartik-begins', v_festival_cat, 'Kārtika Māsa', 'Початок Картіки', 'Kartik Begins', 8, 15, 'shukla', 'none', false, 'Початок священного місяця Картіка', 'Beginning of holy Kartik month', 'Початок місячного обітниці - Дамодара врата', 'Beginning of the month-long vow - Damodara Vrata')
  ON CONFLICT (slug) DO NOTHING;

END$$;

-- ============================================
-- 3. EKADASHI INFO (26 ekadashis)
-- ============================================

INSERT INTO ekadashi_info (slug, vaishnava_month_id, paksha, name_sanskrit, name_ua, name_en, presiding_deity_ua, presiding_deity_en, is_major, glory_title_ua, glory_title_en) VALUES
-- Month 1 - Madhava (Apr-May)
('varuthini', 1, 'krishna', 'Varūthinī', 'Варутхіні', 'Varuthini', 'Варага', 'Varaha', false, 'Слава Варутхіні Екадаші', 'Glory of Varuthini Ekadashi'),
('mohini', 1, 'shukla', 'Mohinī', 'Мохіні', 'Mohini', 'Мохіні', 'Mohini', false, 'Слава Мохіні Екадаші', 'Glory of Mohini Ekadashi'),
-- Month 2 - Madhusudana (May-Jun)
('apara', 2, 'krishna', 'Aparā', 'Апара', 'Apara', 'Трівікрама', 'Trivikrama', false, 'Слава Апара Екадаші', 'Glory of Apara Ekadashi'),
('pandava-nirjala', 2, 'shukla', 'Pāṇḍava Nirjalā', 'Пандава Нірджала', 'Pandava Nirjala', 'Вішну', 'Vishnu', true, 'Слава Пандава Нірджала Екадаші', 'Glory of Pandava Nirjala Ekadashi'),
-- Month 3 - Trivikrama (Jun-Jul)
('yogini', 3, 'krishna', 'Yoginī', 'Йогіні', 'Yogini', 'Йоґешвара', 'Yogeshwara', false, 'Слава Йогіні Екадаші', 'Glory of Yogini Ekadashi'),
('devshayani', 3, 'shukla', 'Devaśayanī', 'Девашаяні', 'Devshayani', 'Вішну', 'Vishnu', true, 'Слава Девашаяні Екадаші', 'Glory of Devshayani Ekadashi'),
-- Month 4 - Vamana (Jul-Aug)
('kamika', 4, 'krishna', 'Kāmikā', 'Каміка', 'Kamika', 'Вішну', 'Vishnu', false, 'Слава Каміка Екадаші', 'Glory of Kamika Ekadashi'),
('shravana-putrada', 4, 'shukla', 'Śrāvaṇa Putradā', 'Шравана Путрада', 'Shravana Putrada', 'Нараяна', 'Narayana', false, 'Слава Шравана Путрада Екадаші', 'Glory of Shravana Putrada Ekadashi'),
-- Month 5 - Shridhara (Aug-Sep)
('annada', 5, 'krishna', 'Annadā', 'Аннада', 'Annada', 'Вішну', 'Vishnu', false, 'Слава Аннада Екадаші', 'Glory of Annada Ekadashi'),
('parsva', 5, 'shukla', 'Pārśva', 'Паршва', 'Parsva', 'Вамана', 'Vamana', false, 'Слава Паршва Екадаші', 'Glory of Parsva Ekadashi'),
-- Month 6 - Hrishikesha (Sep-Oct)
('indira', 6, 'krishna', 'Indirā', 'Індіра', 'Indira', 'Хрішікеша', 'Hrishikesha', false, 'Слава Індіра Екадаші', 'Glory of Indira Ekadashi'),
('pashankusha', 6, 'shukla', 'Pāśāṅkuśā', 'Пашанкуша', 'Pashankusha', 'Падманабга', 'Padmanabha', false, 'Слава Пашанкуша Екадаші', 'Glory of Pashankusha Ekadashi'),
-- Month 7 - Padmanabha (Oct-Nov)
('rama', 7, 'krishna', 'Rāmā', 'Рама', 'Rama', 'Мукунда', 'Mukunda', false, 'Слава Рама Екадаші', 'Glory of Rama Ekadashi'),
('utthana', 7, 'shukla', 'Utthānā', 'Уттхана', 'Utthana', 'Шрідгара', 'Shridhara', true, 'Слава Уттхана Екадаші', 'Glory of Utthana Ekadashi'),
-- Month 8 - Damodara (Nov-Dec)
('utpanna', 8, 'krishna', 'Utpannā', 'Утпанна', 'Utpanna', 'Кешава', 'Keshava', false, 'Слава Утпанна Екадаші', 'Glory of Utpanna Ekadashi'),
('mokshada', 8, 'shukla', 'Mokṣadā', 'Мокшада', 'Mokshada', 'Дамодара', 'Damodara', true, 'Слава Мокшада Екадаші', 'Glory of Mokshada Ekadashi'),
-- Month 9 - Keshava (Dec-Jan)
('saphala', 9, 'krishna', 'Saphalā', 'Сапхала', 'Saphala', 'Нараяна', 'Narayana', false, 'Слава Сапхала Екадаші', 'Glory of Saphala Ekadashi'),
('pausha-putrada', 9, 'shukla', 'Pauṣa Putradā', 'Пауша Путрада', 'Pausha Putrada', 'Нараяна', 'Narayana', false, 'Слава Пауша Путрада Екадаші', 'Glory of Pausha Putrada Ekadashi'),
-- Month 10 - Narayana (Jan-Feb)
('shattila', 10, 'krishna', 'Ṣaṭtilā', 'Шаттіла', 'Shattila', 'Вішну', 'Vishnu', false, 'Слава Шаттіла Екадаші', 'Glory of Shattila Ekadashi'),
('bhaimi', 10, 'shukla', 'Bhaimī', 'Бгаймі', 'Bhaimi', 'Варага', 'Varaha', false, 'Слава Бгаймі Екадаші', 'Glory of Bhaimi Ekadashi'),
-- Month 11 - Govinda (Feb-Mar)
('vijaya', 11, 'krishna', 'Vijayā', 'Віджая', 'Vijaya', 'Нараяна', 'Narayana', false, 'Слава Віджая Екадаші', 'Glory of Vijaya Ekadashi'),
('amalaki', 11, 'shukla', 'Āmalakī', 'Амалакі', 'Amalaki', 'Парашурама', 'Parashurama', false, 'Слава Амалакі Екадаші', 'Glory of Amalaki Ekadashi'),
-- Month 12 - Vishnu (Mar-Apr)
('papamochani', 12, 'krishna', 'Pāpamochanī', 'Папамочані', 'Papamochani', 'Чайтанья', 'Chaitanya', false, 'Слава Папамочані Екадаші', 'Glory of Papamochani Ekadashi'),
('kamada', 12, 'shukla', 'Kāmadā', 'Камада', 'Kamada', 'Мадгусудана', 'Madhusudana', false, 'Слава Камада Екадаші', 'Glory of Kamada Ekadashi')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 4. CALENDAR EVENTS FOR 2026
-- Based on lunar calendar calculations
-- ============================================

-- First, get default location (Kyiv)
DO $$
DECLARE
  v_kyiv_id UUID;
BEGIN
  SELECT id INTO v_kyiv_id FROM calendar_locations WHERE city_en = 'Kyiv' AND is_preset = true LIMIT 1;

  -- February 2026 Events
  -- Feb 23 - Vasanta Panchami day (multiple events)
  INSERT INTO calendar_events (event_date, festival_id, location_id, is_published)
  SELECT '2026-02-23', id, v_kyiv_id, true FROM vaishnava_festivals WHERE slug = 'vasanta-panchami'
  ON CONFLICT DO NOTHING;

  INSERT INTO calendar_events (event_date, appearance_day_id, location_id, is_published)
  SELECT '2026-02-23', id, v_kyiv_id, true FROM appearance_days WHERE slug = 'vishnupriya-devi-appearance'
  ON CONFLICT DO NOTHING;

  INSERT INTO calendar_events (event_date, appearance_day_id, location_id, is_published)
  SELECT '2026-02-23', id, v_kyiv_id, true FROM appearance_days WHERE slug = 'vishvanath-chakravarti-disappearance'
  ON CONFLICT DO NOTHING;

  INSERT INTO calendar_events (event_date, appearance_day_id, location_id, is_published)
  SELECT '2026-02-23', id, v_kyiv_id, true FROM appearance_days WHERE slug = 'pundarika-vidyanidhi-appearance'
  ON CONFLICT DO NOTHING;

  INSERT INTO calendar_events (event_date, appearance_day_id, location_id, is_published)
  SELECT '2026-02-23', id, v_kyiv_id, true FROM appearance_days WHERE slug = 'raghunath-das-goswami-appearance'
  ON CONFLICT DO NOTHING;

  -- Nityananda Trayodashi (Feb 2026)
  INSERT INTO calendar_events (event_date, appearance_day_id, location_id, is_published)
  SELECT '2026-02-21', id, v_kyiv_id, true FROM appearance_days WHERE slug = 'nityananda-prabhu-appearance'
  ON CONFLICT DO NOTHING;

  -- Gaura Purnima (March 2026)
  INSERT INTO calendar_events (event_date, festival_id, location_id, is_published)
  SELECT '2026-03-06', id, v_kyiv_id, true FROM vaishnava_festivals WHERE slug = 'gaura-purnima'
  ON CONFLICT DO NOTHING;

  INSERT INTO calendar_events (event_date, appearance_day_id, location_id, is_published)
  SELECT '2026-03-06', id, v_kyiv_id, true FROM appearance_days WHERE slug = 'chaitanya-mahaprabhu-appearance'
  ON CONFLICT DO NOTHING;

  -- Rama Navami (April 2026)
  INSERT INTO calendar_events (event_date, festival_id, location_id, is_published)
  SELECT '2026-04-05', id, v_kyiv_id, true FROM vaishnava_festivals WHERE slug = 'rama-navami'
  ON CONFLICT DO NOTHING;

  -- Nrisimha Chaturdashi (May 2026)
  INSERT INTO calendar_events (event_date, festival_id, location_id, is_published)
  SELECT '2026-05-11', id, v_kyiv_id, true FROM vaishnava_festivals WHERE slug = 'nrisimha-chaturdashi'
  ON CONFLICT DO NOTHING;

  -- Pandava Nirjala Ekadashi (June 2026)
  INSERT INTO calendar_events (event_date, ekadashi_id, location_id, is_published)
  SELECT '2026-06-04', id, v_kyiv_id, true FROM ekadashi_info WHERE slug = 'pandava-nirjala'
  ON CONFLICT DO NOTHING;

  -- Ratha Yatra (July 2026)
  INSERT INTO calendar_events (event_date, festival_id, location_id, is_published)
  SELECT '2026-06-25', id, v_kyiv_id, true FROM vaishnava_festivals WHERE slug = 'ratha-yatra'
  ON CONFLICT DO NOTHING;

  -- Balarama Purnima (August 2026)
  INSERT INTO calendar_events (event_date, festival_id, location_id, is_published)
  SELECT '2026-08-09', id, v_kyiv_id, true FROM vaishnava_festivals WHERE slug = 'balarama-purnima'
  ON CONFLICT DO NOTHING;

  -- Janmashtami (August 2026)
  INSERT INTO calendar_events (event_date, festival_id, location_id, is_published)
  SELECT '2026-08-23', id, v_kyiv_id, true FROM vaishnava_festivals WHERE slug = 'janmashtami'
  ON CONFLICT DO NOTHING;

  -- Nandotsava (August 2026)
  INSERT INTO calendar_events (event_date, festival_id, location_id, is_published)
  SELECT '2026-08-24', id, v_kyiv_id, true FROM vaishnava_festivals WHERE slug = 'nandotsava'
  ON CONFLICT DO NOTHING;

  -- Prabhupada Appearance (September 2026)
  INSERT INTO calendar_events (event_date, appearance_day_id, location_id, is_published)
  SELECT '2026-09-01', id, v_kyiv_id, true FROM appearance_days WHERE slug = 'prabhupada-appearance'
  ON CONFLICT DO NOTHING;

  -- Radhashtami (September 2026)
  INSERT INTO calendar_events (event_date, festival_id, location_id, is_published)
  SELECT '2026-09-03', id, v_kyiv_id, true FROM vaishnava_festivals WHERE slug = 'radhashtami'
  ON CONFLICT DO NOTHING;

  -- Bhaktivinoda Thakur Appearance (September 2026)
  INSERT INTO calendar_events (event_date, appearance_day_id, location_id, is_published)
  SELECT '2026-09-06', id, v_kyiv_id, true FROM appearance_days WHERE slug = 'bhaktivinoda-thakur-appearance'
  ON CONFLICT DO NOTHING;

  -- Prabhupada Disappearance (November 2026)
  INSERT INTO calendar_events (event_date, appearance_day_id, location_id, is_published)
  SELECT '2026-11-07', id, v_kyiv_id, true FROM appearance_days WHERE slug = 'prabhupada-disappearance'
  ON CONFLICT DO NOTHING;

  -- Govardhan Puja (November 2026)
  INSERT INTO calendar_events (event_date, festival_id, location_id, is_published)
  SELECT '2026-11-01', id, v_kyiv_id, true FROM vaishnava_festivals WHERE slug = 'govardhan-puja'
  ON CONFLICT DO NOTHING;

  -- Diwali (October/November 2026)
  INSERT INTO calendar_events (event_date, festival_id, location_id, is_published)
  SELECT '2026-10-31', id, v_kyiv_id, true FROM vaishnava_festivals WHERE slug = 'diwali'
  ON CONFLICT DO NOTHING;

  -- Utthana Ekadashi (November 2026)
  INSERT INTO calendar_events (event_date, ekadashi_id, location_id, is_published)
  SELECT '2026-11-13', id, v_kyiv_id, true FROM ekadashi_info WHERE slug = 'utthana'
  ON CONFLICT DO NOTHING;

  -- Mokshada Ekadashi / Gita Jayanti (December 2026)
  INSERT INTO calendar_events (event_date, ekadashi_id, location_id, is_published)
  SELECT '2026-12-13', id, v_kyiv_id, true FROM ekadashi_info WHERE slug = 'mokshada'
  ON CONFLICT DO NOTHING;

END$$;

COMMIT;
