-- Seed Jayadeva Goswami disappearance day
-- Great Vaishnava poet, author of Gita-Govinda

BEGIN;

-- ============================================
-- JAYADEVA GOSWAMI DISAPPEARANCE DAY
-- ============================================

INSERT INTO appearance_days (
  slug,
  category_id,
  event_type,
  person_name_sanskrit,
  person_name_ua,
  person_name_en,
  person_title_ua,
  person_title_en,
  vaishnava_month_id,
  paksha,
  description_ua,
  description_en,
  short_description_ua,
  short_description_en,
  observances_ua,
  observances_en,
  fasting_level,
  is_major,
  sort_order
) VALUES (
  'jayadeva-goswami-disappearance',
  (SELECT id FROM festival_categories WHERE slug = 'disappearance'),
  'disappearance',
  'Śrī Jayadeva Gosvāmī',
  'Шрі Джаядева Ґосвамі',
  'Sri Jayadeva Goswami',
  'Великий поет-вайшнав, автор «Ґіта-ґовінди»',
  'Great Vaishnava poet, author of Gita-Govinda',
  10, -- Nārāyaṇa (Pausha)
  'krishna',
  E'Джаядева Ґосвамі був великим вайшнавом, чия любов до Господа Крішни знайшла вираження в його віршах. Народившись за три століття до явлення Шрі Чайтаньї Магапрабгу, він склав поеми неймовірної краси, якими згодом насолоджувався Сам Господь Ґауранґа, перебуваючи в сокровенному настрої Шріматі Радгарані.\n\nОсобливо дорогою для Магапрабгу та всіх вайшнавів була його поема «Ґіта-ґовінда», де він солодко описує взаємини Шріматі Радгарані та Шрі Крішни. Сповнений глибокої любові до Бога, він безпосередньо споглядав і відчував те, що згодом майстерно виражав у своїх віршах. Цим він підкорив серця ґаудія-вайшнавів.\n\nОкрім «Ґіта-ґовінди», Джаядева Ґосвамі написав книгу «Чандралока». А знаменита «Даш-аватара-ґіта», що розповідає про десять аватара Вішну, — це частина «Ґіта-ґовінди».\n\nШріла Бгактівінода Тхакура писав, що хоча Чандідаса, Відьяпаті, Білваманґала та Джаядева жили до того, як Шрі Чайтанья Магапрабгу проявився зовні в цьому світі, концепція бгакті Чайтаньї Магапрабгу виникла в їхніх серцях і була виражена в їхніх творах.\n\nДжаядева Ґосвамі залишив цей світ у Пауша-санкранті. Зараз у Кендубіва-ґрамі, де народився Шрі Джаядева Ґосвамі, щороку в цей день відзначається свято — «Джаядева-мела».\n\nІсторія про Господа Джаґаннатху та Падмаваті:\n\nКоли Джаядева Ґосвамі написав «Ґіта-ґовінду», першою слухачкою була його дружина Падмаваті, яка написала музику на всі ці пісні. Вона весь час співала ці пісні про Крішну і не могла співати ні про що інше.\n\nОдного разу Падмаваті пішла на поле збирати баклажани і співала про Крішну. Господь Джаґаннатха, почувши її голос, втік з вівтаря і крадучись йшов за нею. Коли вона обернулася, Джаґаннатха прикинувся баклажаном (бо Він теж синій). Але вдруге Він не встиг зникнути, і Падмаваті все зрозуміла.\n\nКоли цар Джаґаннатха-пурі прийшов на даршан, він побачив, що одяг Божества весь у колючках з поля. Вночі Джаґаннатха прийшов до царя уві сні і сказав: «Я не можу в храмі сидіти, коли «Ґіта-ґовінду» співають на вулиці. Мені нудно без неї. Накажи, щоб Падмаваті щодня в храмі «Ґіта-ґовінду» співала».\n\nВідтоді цар видав указ, і «Ґіта-ґовінда» стала невід''ємною частиною поклоніння Господу Джаґаннатхі.',
  E'Jayadeva Goswami was a great Vaishnava whose love for Lord Krishna found expression in his verses. Born three centuries before the advent of Sri Chaitanya Mahaprabhu, he composed poems of incredible beauty, which Lord Gauranga Himself later relished while in the intimate mood of Srimati Radharani.\n\nEspecially dear to Mahaprabhu and all Vaishnavas was his poem "Gita-Govinda," where he sweetly describes the relationship between Srimati Radharani and Sri Krishna. Filled with deep love for God, he directly beheld and felt what he masterfully expressed in his verses. Thus he captured the hearts of Gaudiya Vaishnavas.\n\nBesides "Gita-Govinda," Jayadeva Goswami wrote a book called "Chandraloka." And the famous "Dasha-avatara-gita," which tells of the ten avatars of Vishnu, is part of "Gita-Govinda."\n\nSrila Bhaktivinoda Thakura wrote that although Chandidasa, Vidyapati, Bilvamangala, and Jayadeva lived before Sri Chaitanya Mahaprabhu externally manifested in this world, the concept of bhakti of Chaitanya Mahaprabhu arose in their hearts and was expressed in their works.\n\nJayadeva Goswami left this world on Pausha-sankranti. Now in Kendubilva-grama, where Sri Jayadeva Goswami was born, the festival "Jayadeva-mela" is celebrated every year on this day.\n\nThe story of Lord Jagannatha and Padmavati:\n\nWhen Jayadeva Goswami wrote "Gita-Govinda," his first listener was his wife Padmavati, who composed music for all these songs. She constantly sang these songs about Krishna and could not sing about anything else.\n\nOnce Padmavati went to a field to collect eggplants while singing about Krishna. Lord Jagannatha, hearing her voice, fled from His altar and stealthily followed her. When she turned around, Jagannatha disguised Himself as an eggplant (since He is also blue). But the second time He could not disappear in time, and Padmavati understood everything.\n\nWhen the king of Jagannatha Puri came for darshan, he saw that the Deity''s clothes were covered with thorns from the field. That night Jagannatha came to the king in a dream and said: "I cannot sit in the temple when ''Gita-Govinda'' is sung on the street. I am bored without it. Order Padmavati to sing ''Gita-Govinda'' in the temple every day."\n\nSince then the king issued a decree, and "Gita-Govinda" became an integral part of the worship of Lord Jagannatha.',
  'Великий вайшнав-поет, автор «Ґіта-ґовінди», чиї вірші підкорили серця всіх відданих, включно з Господом Джаґаннатхою.',
  'Great Vaishnava poet, author of "Gita-Govinda," whose verses captured the hearts of all devotees, including Lord Jagannatha Himself.',
  'Читання «Ґіта-ґовінди» та «Даш-аватара-ґіти». Слухання історій про Джаядеву Ґосвамі та Падмаваті. Оспівування слави поета-вайшнава.',
  'Reading "Gita-Govinda" and "Dasha-avatara-gita." Hearing stories about Jayadeva Goswami and Padmavati. Glorifying the Vaishnava poet.',
  'half',
  true,
  10
)
ON CONFLICT (slug) DO UPDATE SET
  person_name_ua = EXCLUDED.person_name_ua,
  person_name_en = EXCLUDED.person_name_en,
  description_ua = EXCLUDED.description_ua,
  description_en = EXCLUDED.description_en,
  short_description_ua = EXCLUDED.short_description_ua,
  short_description_en = EXCLUDED.short_description_en,
  observances_ua = EXCLUDED.observances_ua,
  observances_en = EXCLUDED.observances_en,
  updated_at = now();

-- ============================================
-- Add calendar event for 2026
-- ============================================

INSERT INTO calendar_events (
  event_date,
  appearance_day_id,
  tithi_number,
  paksha,
  vaishnava_month_id,
  is_published
) VALUES (
  '2026-01-08',
  (SELECT id FROM appearance_days WHERE slug = 'jayadeva-goswami-disappearance'),
  11, -- Approximate tithi for Pausha-sankranti
  'krishna',
  10, -- Nārāyaṇa (Pausha)
  true
)
ON CONFLICT DO NOTHING;

COMMIT;
