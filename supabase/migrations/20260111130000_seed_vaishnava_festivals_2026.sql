-- Seed Vaishnava Festivals and Appearance Days for 2026
-- Source: ISKCON Official Calendar (drikpanchang.com)
-- Transliteration follows Ukrainian rules: bh→бг, dh→дг, gh→ґг

-- ============================================
-- MAJOR FESTIVALS
-- ============================================

INSERT INTO vaishnava_festivals (slug, category_id, name_sanskrit, name_ua, name_en, description_ua, description_en, significance_ua, significance_en, fasting_level, is_major, sort_order) VALUES

-- Gaura Purnima - Appearance of Chaitanya Mahaprabhu
('gaura-purnima', 4, 'Gaura Pūrṇimā', 'Ґаура Пурніма', 'Gaura Purnima',
 'День явлення Шрі Чайтаньї Магапрабгу, Золотого Аватари, який прийшов, щоб навчити любові до Бога через спільний спів Святих Імен.',
 'Appearance day of Sri Chaitanya Mahaprabhu, the Golden Avatar who came to teach love of God through the congregational chanting of the Holy Names.',
 'Найважливіше свято для ґаудія-вайшнавів. Шрі Чайтанья явився у 1486 році в Навадвіпі, Західна Бенґалія.',
 'The most important festival for Gaudiya Vaishnavas. Sri Chaitanya appeared in 1486 in Navadvipa, West Bengal.',
 'full', true, 1),

-- Janmashtami - Appearance of Krishna
('janmashtami', 4, 'Janmāṣṭamī', 'Джанмаштамі', 'Janmashtami',
 'День явлення Господа Шрі Крішни, Верховної Особистості Бога, у Вріндавані понад 5000 років тому.',
 'Appearance day of Lord Sri Krishna, the Supreme Personality of Godhead, in Vrindavan over 5000 years ago.',
 'Одне з найбільших свят у вайшнавізмі. Піст дотримується до півночі, коли народився Крішна.',
 'One of the biggest festivals in Vaishnavism. Fasting is observed until midnight when Krishna was born.',
 'full', true, 2),

-- Rama Navami - Appearance of Lord Rama
('rama-navami', 4, 'Rāma Navamī', 'Рама Навамі', 'Rama Navami',
 'День явлення Господа Рамачандри, сьомого аватари Вішну, ідеального царя та чоловіка.',
 'Appearance day of Lord Ramachandra, the seventh avatar of Vishnu, the ideal king and husband.',
 'Свято відзначається читанням «Рамаяни» та поклонінням Господу Рамі.',
 'The festival is celebrated by reading Ramayana and worshiping Lord Rama.',
 'half', true, 3),

-- Narasimha Chaturdashi - Appearance of Lord Narasimha
('narasimha-chaturdashi', 4, 'Nṛsiṁha Caturdaśī', 'Нарасімга Чатурдаші', 'Narasimha Chaturdashi',
 'День явлення Господа Нарасімгадева, напів-людини, напів-лева, який захистив Своїх відданих.',
 'Appearance day of Lord Narasimhadeva, the half-man, half-lion form who protects His devotees.',
 'Господь Нарасімга явився, щоб захистити Прагладу Магараджа від його демонічного батька Хіран''якашіпу.',
 'Lord Narasimha appeared to protect Prahlada Maharaja from his demonic father Hiranyakashipu.',
 'full', true, 4),

-- Radhashtami - Appearance of Radharani
('radhashtami', 4, 'Rādhāṣṭamī', 'Радгаштамі', 'Radhashtami',
 'День явлення Шріматі Радгарані, вічної супутниці Крішни та уособлення чистої відданості.',
 'Appearance day of Shrimati Radharani, the eternal consort of Krishna and embodiment of pure devotion.',
 'Радгарані є найвищою відданою Крішни. Через Її милість можна досягти любові до Бога.',
 'Radharani is the topmost devotee of Krishna. Through Her mercy one can achieve love of God.',
 'half', true, 5),

-- Ratha Yatra - Chariot Festival
('ratha-yatra', 4, 'Ratha Yātrā', 'Ратга Ятра', 'Ratha Yatra',
 'Фестиваль колісниць, коли Господь Джаґаннатх, Баладева та Субгадра подорожують на величезних колісницях.',
 'The chariot festival when Lord Jagannatha, Baladeva and Subhadra travel on huge chariots.',
 'Одне з найстаріших та найбільших свят в Індії. Шрі Чайтанья танцював перед колісницею Джаґаннатха.',
 'One of the oldest and biggest festivals in India. Sri Chaitanya danced before Lord Jagannatha''s chariot.',
 'none', true, 6),

-- Govardhana Puja
('govardhana-puja', 4, 'Govardhana Pūjā', 'Ґовардган Пуджа', 'Govardhana Puja',
 'Свято поклоніння пагорбу Ґовардган, який Крішна підняв, щоб захистити мешканців Враджа.',
 'Festival of worshiping Govardhana Hill which Krishna lifted to protect the residents of Vraja.',
 'Крішна підняв Ґовардган на мізинці і тримав 7 днів, захищаючи від гніву Індри.',
 'Krishna lifted Govardhana on His little finger for 7 days, protecting from the wrath of Indra.',
 'none', true, 7),

-- Dipavali
('dipavali', 4, 'Dīpāvalī', 'Діпавалі', 'Dipavali',
 'Свято вогнів, що відзначає перемогу світла над темрявою.',
 'Festival of lights celebrating the victory of light over darkness.',
 'Вайшнави відзначають повернення Господа Рами до Айодг''ї після перемоги над Раваною.',
 'Vaishnavas celebrate Lord Rama''s return to Ayodhya after defeating Ravana.',
 'none', true, 8),

-- Balarama Jayanti
('balarama-jayanti', 4, 'Balarāma Jayantī', 'Баларама Джаянті', 'Balarama Jayanti',
 'День явлення Господа Баларами, старшого брата Крішни.',
 'Appearance day of Lord Balarama, the elder brother of Krishna.',
 'Баларама є першою експансією Крішни та джерелом всіх аватар.',
 'Balarama is the first expansion of Krishna and the source of all avatars.',
 'full', true, 9),

-- Nityananda Trayodashi
('nityananda-trayodashi', 4, 'Nityānanda Trayodaśī', 'Нітьянанда Трайодаші', 'Nityananda Trayodashi',
 'День явлення Господа Нітьянанди, вічного супутника Шрі Чайтаньї Магапрабгу.',
 'Appearance day of Lord Nityananda, the eternal associate of Sri Chaitanya Mahaprabhu.',
 'Нітьянанда Прабгу роздавав любов до Бога навіть найбільш грішним людям.',
 'Nityananda Prabhu distributed love of God even to the most sinful people.',
 'full', true, 10),

-- Advaita Acharya Appearance
('advaita-acharya-appearance', 2, 'Advaita Ācārya Āvirbhāva', 'Явлення Адвайти Ачар''ї', 'Advaita Acharya Appearance',
 'День явлення Шрі Адвайти Ачар''ї, чиї молитви привели Господа Чайтанью на Землю.',
 'Appearance day of Sri Advaita Acharya, whose prayers brought Lord Chaitanya to Earth.',
 'Адвайта Ачар''я гучно кликав Господа, і Крішна явився як Чайтанья.',
 'Advaita Acharya loudly called for the Lord, and Krishna appeared as Chaitanya.',
 'half', true, 11),

-- Gita Jayanti
('gita-jayanti', 4, 'Gītā Jayantī', 'Ґіта Джаянті', 'Gita Jayanti',
 'День, коли Господь Крішна промовив «Бгаґавад-ґіту» Арджуні на полі битви Курукшетра.',
 'The day Lord Krishna spoke Bhagavad-gita to Arjuna on the battlefield of Kurukshetra.',
 '«Бгаґавад-ґіта» є квінтесенцією ведичної мудрості та посібником для духовного життя.',
 'Bhagavad-gita is the quintessence of Vedic wisdom and a guide for spiritual life.',
 'half', true, 12)

ON CONFLICT (slug) DO UPDATE SET
  name_ua = EXCLUDED.name_ua,
  name_en = EXCLUDED.name_en,
  description_ua = EXCLUDED.description_ua,
  description_en = EXCLUDED.description_en;

-- ============================================
-- APPEARANCE/DISAPPEARANCE DAYS - ACHARYAS
-- ============================================

INSERT INTO appearance_days (slug, category_id, event_type, person_name_sanskrit, person_name_ua, person_name_en, person_title_ua, person_title_en, description_ua, description_en, fasting_level, is_major, sort_order) VALUES

-- Prabhupada
('prabhupada-appearance', 2, 'appearance', 'Śrīla Prabhupāda', 'Шріла Прабгупада', 'Srila Prabhupada',
 'Засновник-ачар''я ISKCON', 'Founder-Acharya of ISKCON',
 'День явлення Його Божественної Милості А.Ч. Бгактіведанти Свамі Прабгупади, який розповсюдив свідомість Крішни по всьому світу.',
 'Appearance day of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, who spread Krishna consciousness worldwide.',
 'half', true, 1),

('prabhupada-disappearance', 3, 'disappearance', 'Śrīla Prabhupāda', 'Шріла Прабгупада', 'Srila Prabhupada',
 'Засновник-ачар''я ISKCON', 'Founder-Acharya of ISKCON',
 'День відходу Шріли Прабгупади, 14 листопада 1977 року у Вріндавані.',
 'Disappearance day of Srila Prabhupada, November 14, 1977 in Vrindavan.',
 'half', true, 2),

-- Bhaktisiddhanta Sarasvati
('bhaktisiddhanta-appearance', 2, 'appearance', 'Śrīla Bhaktisiddhānta Sarasvatī', 'Шріла Бгактісіддганта Сарасваті', 'Srila Bhaktisiddhanta Sarasvati',
 'Духовний учитель Шріли Прабгупади', 'Spiritual master of Srila Prabhupada',
 'День явлення Шріли Бгактісіддганти Сарасваті Тгакура, великого проповідника свідомості Крішни.',
 'Appearance day of Srila Bhaktisiddhanta Sarasvati Thakura, the great preacher of Krishna consciousness.',
 'half', true, 3),

('bhaktisiddhanta-disappearance', 3, 'disappearance', 'Śrīla Bhaktisiddhānta Sarasvatī', 'Шріла Бгактісіддганта Сарасваті', 'Srila Bhaktisiddhanta Sarasvati',
 'Духовний учитель Шріли Прабгупади', 'Spiritual master of Srila Prabhupada',
 'День відходу Шріли Бгактісіддганти Сарасваті Тгакура.',
 'Disappearance day of Srila Bhaktisiddhanta Sarasvati Thakura.',
 'half', true, 4),

-- Bhaktivinoda Thakura
('bhaktivinoda-appearance', 2, 'appearance', 'Śrīla Bhaktivinoda Ṭhākura', 'Шріла Бгактівінод Тгакур', 'Srila Bhaktivinoda Thakura',
 'Сьомий Ґосвамі', 'The Seventh Goswami',
 'День явлення Шріли Бгактівінода Тгакура, відродника ґаудія-вайшнавізму.',
 'Appearance day of Srila Bhaktivinoda Thakura, the reviver of Gaudiya Vaishnavism.',
 'half', true, 5),

('bhaktivinoda-disappearance', 3, 'disappearance', 'Śrīla Bhaktivinoda Ṭhākura', 'Шріла Бгактівінод Тгакур', 'Srila Bhaktivinoda Thakura',
 'Сьомий Ґосвамі', 'The Seventh Goswami',
 'День відходу Шріли Бгактівінода Тгакура.',
 'Disappearance day of Srila Bhaktivinoda Thakura.',
 'half', true, 6),

-- Six Goswamis
('rupa-goswami-disappearance', 3, 'disappearance', 'Śrīla Rūpa Gosvāmī', 'Шріла Рупа Ґосвамі', 'Srila Rupa Goswami',
 'Один із Шести Ґосвамі Вріндавана', 'One of the Six Goswamis of Vrindavan',
 'День відходу Шріли Рупи Ґосвамі, головного учня Шрі Чайтаньї Магапрабгу.',
 'Disappearance day of Srila Rupa Goswami, the chief disciple of Sri Chaitanya Mahaprabhu.',
 'half', true, 7),

('sanatana-goswami-disappearance', 3, 'disappearance', 'Śrīla Sanātana Gosvāmī', 'Шріла Санатана Ґосвамі', 'Srila Sanatana Goswami',
 'Один із Шести Ґосвамі Вріндавана', 'One of the Six Goswamis of Vrindavan',
 'День відходу Шріли Санатани Ґосвамі, старшого брата Рупи Ґосвамі.',
 'Disappearance day of Srila Sanatana Goswami, the elder brother of Rupa Goswami.',
 'half', true, 8),

('jiva-goswami-appearance', 2, 'appearance', 'Śrīla Jīva Gosvāmī', 'Шріла Джіва Ґосвамі', 'Srila Jiva Goswami',
 'Один із Шести Ґосвамі Вріндавана', 'One of the Six Goswamis of Vrindavan',
 'День явлення Шріли Джіви Ґосвамі, найвидатнішого філософа ґаудія-вайшнавізму.',
 'Appearance day of Srila Jiva Goswami, the greatest philosopher of Gaudiya Vaishnavism.',
 'half', true, 9),

('raghunatha-dasa-goswami-disappearance', 3, 'disappearance', 'Śrīla Raghunātha Dāsa Gosvāmī', 'Шріла Раґгунатга Даса Ґосвамі', 'Srila Raghunatha Dasa Goswami',
 'Один із Шести Ґосвамі Вріндавана', 'One of the Six Goswamis of Vrindavan',
 'День відходу Шріли Раґгунатги Даси Ґосвамі, ідеального відреченого.',
 'Disappearance day of Srila Raghunatha Dasa Goswami, the ideal renunciate.',
 'half', true, 10),

('gopala-bhatta-goswami-disappearance', 3, 'disappearance', 'Śrīla Gopāla Bhaṭṭa Gosvāmī', 'Шріла Ґопала Бгатта Ґосвамі', 'Srila Gopala Bhatta Goswami',
 'Один із Шести Ґосвамі Вріндавана', 'One of the Six Goswamis of Vrindavan',
 'День відходу Шріли Ґопали Бгатти Ґосвамі.',
 'Disappearance day of Srila Gopala Bhatta Goswami.',
 'half', true, 11),

-- Narottama Dasa Thakura
('narottama-dasa-appearance', 2, 'appearance', 'Śrīla Narottama Dāsa Ṭhākura', 'Шріла Нароттама Даса Тгакур', 'Srila Narottama Dasa Thakura',
 'Великий ачар''я та поет', 'Great acharya and poet',
 'День явлення Шріли Нароттами Даси Тгакура, автора багатьох бгаджанів.',
 'Appearance day of Srila Narottama Dasa Thakura, author of many bhajans.',
 'half', true, 12),

('narottama-dasa-disappearance', 3, 'disappearance', 'Śrīla Narottama Dāsa Ṭhākura', 'Шріла Нароттама Даса Тгакур', 'Srila Narottama Dasa Thakura',
 'Великий ачар''я та поет', 'Great acharya and poet',
 'День відходу Шріли Нароттами Даси Тгакура.',
 'Disappearance day of Srila Narottama Dasa Thakura.',
 'half', true, 13),

-- Haridasa Thakura
('haridasa-thakura-disappearance', 3, 'disappearance', 'Śrīla Haridāsa Ṭhākura', 'Шріла Харідаса Тгакур', 'Srila Haridasa Thakura',
 'Намачар''я — вчитель Святого Імені', 'Namacharya — Teacher of the Holy Name',
 'День відходу Шріли Харідаси Тгакура, який повторював 300 000 імен щодня.',
 'Disappearance day of Srila Haridasa Thakura, who chanted 300,000 names daily.',
 'half', true, 14),

-- Gaura Kishora Dasa Babaji
('gaura-kishora-dasa-disappearance', 3, 'disappearance', 'Śrīla Gaura Kiśora Dāsa Bābājī', 'Шріла Ґаура Кішора Даса Бабаджі', 'Srila Gaura Kishora Dasa Babaji',
 'Духовний учитель Бгактісіддганти Сарасваті', 'Spiritual master of Bhaktisiddhanta Sarasvati',
 'День відходу Шріли Ґаури Кішори Даси Бабаджі Магараджа.',
 'Disappearance day of Srila Gaura Kishora Dasa Babaji Maharaja.',
 'half', true, 15),

-- Gadadhara Pandita
('gadadhara-pandita-appearance', 2, 'appearance', 'Śrī Gadādhara Paṇḍita', 'Шрі Ґададгара Пандіт', 'Sri Gadadhara Pandita',
 'Член Панча-таттви', 'Member of the Pancha-tattva',
 'День явлення Шрі Ґададгари Пандіта, вічного супутника Шрі Чайтаньї.',
 'Appearance day of Sri Gadadhara Pandita, eternal associate of Sri Chaitanya.',
 'half', true, 16),

('gadadhara-pandita-disappearance', 3, 'disappearance', 'Śrī Gadādhara Paṇḍita', 'Шрі Ґададгара Пандіт', 'Sri Gadadhara Pandita',
 'Член Панча-таттви', 'Member of the Pancha-tattva',
 'День відходу Шрі Ґададгари Пандіта.',
 'Disappearance day of Sri Gadadhara Pandita.',
 'half', true, 17),

-- Srivasa Pandita
('srivasa-pandita-appearance', 2, 'appearance', 'Śrī Śrīvāsa Paṇḍita', 'Шрі Шріваса Пандіт', 'Sri Srivasa Pandita',
 'Член Панча-таттви', 'Member of the Pancha-tattva',
 'День явлення Шрі Шріваси Пандіта, в чийому домі проводилися нічні кіртани.',
 'Appearance day of Sri Srivasa Pandita, in whose home the night kirtans were held.',
 'half', true, 18),

('srivasa-pandita-disappearance', 3, 'disappearance', 'Śrī Śrīvāsa Paṇḍita', 'Шрі Шріваса Пандіт', 'Sri Srivasa Pandita',
 'Член Панча-таттви', 'Member of the Pancha-tattva',
 'День відходу Шрі Шріваси Пандіта.',
 'Disappearance day of Sri Srivasa Pandita.',
 'half', true, 19),

-- Madhvacharya
('madhvacharya-appearance', 2, 'appearance', 'Śrī Madhvācārya', 'Шрі Мадгвачар''я', 'Sri Madhvacharya',
 'Засновник Брагма-Мадгва-сампрадаї', 'Founder of the Brahma-Madhva sampradaya',
 'День явлення Шрі Мадгвачар''ї, великого вчителя двайта-веданти.',
 'Appearance day of Sri Madhvacharya, the great teacher of dvaita-vedanta.',
 'half', true, 20),

('madhvacharya-disappearance', 3, 'disappearance', 'Śrī Madhvācārya', 'Шрі Мадгвачар''я', 'Sri Madhvacharya',
 'Засновник Брагма-Мадгва-сампрадаї', 'Founder of the Brahma-Madhva sampradaya',
 'День відходу Шрі Мадгвачар''ї.',
 'Disappearance day of Sri Madhvacharya.',
 'half', true, 21),

-- Ramanujacharya
('ramanujacharya-appearance', 2, 'appearance', 'Śrī Rāmānujācārya', 'Шрі Рамануджачар''я', 'Sri Ramanujacharya',
 'Засновник Шрі-сампрадаї', 'Founder of the Sri sampradaya',
 'День явлення Шрі Рамануджачар''ї, великого вчителя вішішта-адвайти.',
 'Appearance day of Sri Ramanujacharya, the great teacher of vishishta-advaita.',
 'half', true, 22),

('ramanujacharya-disappearance', 3, 'disappearance', 'Śrī Rāmānujācārya', 'Шрі Рамануджачар''я', 'Sri Ramanujacharya',
 'Засновник Шрі-сампрадаї', 'Founder of the Sri sampradaya',
 'День відходу Шрі Рамануджачар''ї.',
 'Disappearance day of Sri Ramanujacharya.',
 'half', true, 23)

ON CONFLICT (slug) DO UPDATE SET
  person_name_ua = EXCLUDED.person_name_ua,
  person_name_en = EXCLUDED.person_name_en,
  description_ua = EXCLUDED.description_ua,
  description_en = EXCLUDED.description_en;

-- ============================================
-- CALENDAR EVENTS FOR 2026 (Major Festivals)
-- ============================================

-- Get location ID for Kyiv (default)
DO $$
DECLARE
  kyiv_location_id UUID;
  gaura_purnima_id UUID;
  janmashtami_id UUID;
  rama_navami_id UUID;
  narasimha_id UUID;
  radhashtami_id UUID;
  ratha_yatra_id UUID;
  govardhana_id UUID;
  dipavali_id UUID;
  balarama_id UUID;
  nityananda_id UUID;
  gita_jayanti_id UUID;
BEGIN
  SELECT id INTO kyiv_location_id FROM calendar_locations WHERE slug = 'kyiv' LIMIT 1;

  -- Get festival IDs
  SELECT id INTO gaura_purnima_id FROM vaishnava_festivals WHERE slug = 'gaura-purnima';
  SELECT id INTO janmashtami_id FROM vaishnava_festivals WHERE slug = 'janmashtami';
  SELECT id INTO rama_navami_id FROM vaishnava_festivals WHERE slug = 'rama-navami';
  SELECT id INTO narasimha_id FROM vaishnava_festivals WHERE slug = 'narasimha-chaturdashi';
  SELECT id INTO radhashtami_id FROM vaishnava_festivals WHERE slug = 'radhashtami';
  SELECT id INTO ratha_yatra_id FROM vaishnava_festivals WHERE slug = 'ratha-yatra';
  SELECT id INTO govardhana_id FROM vaishnava_festivals WHERE slug = 'govardhana-puja';
  SELECT id INTO dipavali_id FROM vaishnava_festivals WHERE slug = 'dipavali';
  SELECT id INTO balarama_id FROM vaishnava_festivals WHERE slug = 'balarama-jayanti';
  SELECT id INTO nityananda_id FROM vaishnava_festivals WHERE slug = 'nityananda-trayodashi';
  SELECT id INTO gita_jayanti_id FROM vaishnava_festivals WHERE slug = 'gita-jayanti';

  -- Insert calendar events for 2026 major festivals
  INSERT INTO calendar_events (event_date, festival_id, location_id, is_published, year)
  VALUES
    ('2026-03-03', gaura_purnima_id, kyiv_location_id, true, 2026),
    ('2026-09-04', janmashtami_id, kyiv_location_id, true, 2026),
    ('2026-03-27', rama_navami_id, kyiv_location_id, true, 2026),
    ('2026-04-30', narasimha_id, kyiv_location_id, true, 2026),
    ('2026-09-19', radhashtami_id, kyiv_location_id, true, 2026),
    ('2026-07-16', ratha_yatra_id, kyiv_location_id, true, 2026),
    ('2026-11-10', govardhana_id, kyiv_location_id, true, 2026),
    ('2026-11-09', dipavali_id, kyiv_location_id, true, 2026),
    ('2026-08-28', balarama_id, kyiv_location_id, true, 2026),
    ('2026-01-31', nityananda_id, kyiv_location_id, true, 2026),
    ('2026-12-20', gita_jayanti_id, kyiv_location_id, true, 2026)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- Add comment
-- ============================================

COMMENT ON TABLE vaishnava_festivals IS 'Major Vaishnava festivals with descriptions and fasting information';
COMMENT ON TABLE appearance_days IS 'Appearance and disappearance days of deities and acharyas';
