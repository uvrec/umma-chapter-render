-- Seed data for Ekadashi info with Padma Purana glories
-- All 24 regular Ekadashis + 2 adhika month Ekadashis

BEGIN;

-- ============================================
-- EKADASHI DATA (26 total)
-- ============================================

INSERT INTO ekadashi_info (
  slug, vaishnava_month_id, paksha,
  name_sanskrit, name_uk, name_en,
  glory_title_uk, glory_title_en,
  glory_text_uk, glory_text_en,
  glory_source,
  presiding_deity_uk, presiding_deity_en,
  fasting_rules_uk, fasting_rules_en,
  breaking_fast_time,
  benefits_uk, benefits_en,
  is_major, sort_order
) VALUES

-- МЕСЯЦЬ 1: МАДГАВА (Chaitra) - Березень/Квітень
(
  'papamochani-ekadashi',
  1, 'krishna',
  'Pāpamochanī Ekādaśī', 'Папамочані Екадаші', 'Papamochani Ekadashi',
  'Екадаші, що звільняє від гріхів', 'The Ekadashi that liberates from sins',
  'Цей екадаші має силу знищувати всі гріхи, накопичені протягом багатьох життів. Той, хто дотримується посту в цей день з вірою та відданістю, звільняється від всіх гріховних реакцій і досягає духовного світу.',
  'This Ekadashi has the power to destroy all sins accumulated over many lifetimes. One who observes the fast on this day with faith and devotion is freed from all sinful reactions and attains the spiritual world.',
  'Padma Purana, Uttara-khanda',
  'Господь Вішну', 'Lord Vishnu',
  'Повний піст від зернових та бобових. Рекомендується відвідувати храм та слухати славу Господа.',
  'Complete fast from grains and beans. Visiting the temple and hearing the glories of the Lord is recommended.',
  'На Двадаші після сходу сонця',
  'Звільнення від всіх гріхів, духовне очищення', 'Liberation from all sins, spiritual purification',
  false, 1
),
(
  'kamada-ekadashi',
  1, 'shukla',
  'Kāmadā Ekādaśī', 'Камада Екадаші', 'Kamada Ekadashi',
  'Екадаші, що виконує бажання', 'The Ekadashi that fulfills desires',
  'Камада Екадаші виконує всі матеріальні та духовні бажання відданих. Дотримання посту в цей день приносить звільнення від прокляття та благословення від Верховного Господа.',
  'Kamada Ekadashi fulfills all material and spiritual desires of the devotees. Observing the fast on this day brings liberation from curses and blessings from the Supreme Lord.',
  'Padma Purana, Uttara-khanda',
  'Господь Вішну', 'Lord Vishnu',
  'Піст від зернових. Споживання фруктів та молочних продуктів дозволено.',
  'Fast from grains. Fruits and dairy products are allowed.',
  'На Двадаші після сходу сонця',
  'Виконання бажань, звільнення від прокляття', 'Fulfillment of desires, liberation from curses',
  false, 2
),

-- МЕСЯЦЬ 2: МАДГУСУДАНА (Vaishakha) - Квітень/Травень
(
  'varuthini-ekadashi',
  2, 'krishna',
  'Varūthinī Ekādaśī', 'Варутхіні Екадаші', 'Varuthini Ekadashi',
  'Екадаші, що дарує захист', 'The Ekadashi that grants protection',
  'Варутхіні Екадаші захищає відданих від всіх небезпек та страждань. Цей піст має силу знищити гріхи вбивства та інші важкі гріхи.',
  'Varuthini Ekadashi protects devotees from all dangers and sufferings. This fast has the power to destroy the sins of killing and other grave sins.',
  'Padma Purana, Uttara-khanda',
  'Господь Варага', 'Lord Varaha',
  'Повний піст. Нічне бдіння рекомендоване.',
  'Complete fast. Night vigil is recommended.',
  'На Двадаші після сходу сонця',
  'Захист від небезпек, знищення важких гріхів', 'Protection from dangers, destruction of grave sins',
  false, 3
),
(
  'mohini-ekadashi',
  2, 'shukla',
  'Mohinī Ekādaśī', 'Мохіні Екадаші', 'Mohini Ekadashi',
  'Екадаші Господа Мохіні', 'The Ekadashi of Lord Mohini',
  'Мохіні Екадаші названий на честь форми Господа Вішну як Мохіні-мурті. Цей піст дарує звільнення від ілюзії матеріального світу та відкриває шлях до духовного пробудження.',
  'Mohini Ekadashi is named after Lord Vishnu''s form as Mohini-murti. This fast grants liberation from the illusion of the material world and opens the path to spiritual awakening.',
  'Padma Purana, Uttara-khanda',
  'Господь Мохіні-мурті', 'Lord Mohini-murti',
  'Піст від зернових та бобових.',
  'Fast from grains and beans.',
  'На Двадаші після сходу сонця',
  'Звільнення від ілюзії, духовне пробудження', 'Liberation from illusion, spiritual awakening',
  false, 4
),

-- МЕСЯЦЬ 3: ТРІВІКРАМА (Jyeshtha) - Травень/Червень
(
  'apara-ekadashi',
  3, 'krishna',
  'Aparā Ekādaśī', 'Апара Екадаші', 'Apara Ekadashi',
  'Неперевершений Екадаші', 'The Incomparable Ekadashi',
  'Апара Екадаші є неперевершеним серед усіх екадаші. Його дотримання звільняє від гріхів брахмахатьї (вбивства брахмана) та інших найважчих гріхів.',
  'Apara Ekadashi is incomparable among all Ekadashis. Its observance liberates from the sins of brahmahatya (killing a brahmana) and other most grave sins.',
  'Padma Purana, Uttara-khanda',
  'Господь Трівікрама', 'Lord Trivikrama',
  'Суворий піст. Воду можна пити.',
  'Strict fast. Water may be drunk.',
  'На Двадаші після сходу сонця',
  'Знищення найважчих гріхів', 'Destruction of the most grave sins',
  true, 5
),
(
  'nirjala-ekadashi',
  3, 'shukla',
  'Nirjalā Ekādaśī', 'Ніржала Екадаші', 'Nirjala Ekadashi',
  'Екадаші без води (Бхіма Екадаші)', 'Ekadashi without water (Bhima Ekadashi)',
  'Ніржала Екадаші — найсуворіший з усіх екадаші. Дотримання повного посту без води в цей день прирівнюється до дотримання всіх 24 екадаші протягом року. Цей піст був наданий Бхімою, який не міг контролювати свій апетит.',
  'Nirjala Ekadashi is the most austere of all Ekadashis. Observing a complete fast without water on this day equals observing all 24 Ekadashis throughout the year. This fast was granted to Bhima, who could not control his appetite.',
  'Padma Purana, Uttara-khanda',
  'Господь Вішну', 'Lord Vishnu',
  'Повний піст БЕЗ ВОДИ. Найсуворіший екадаші. Тим, хто не може, дозволяється пити воду.',
  'Complete fast WITHOUT WATER. The most austere Ekadashi. Those who cannot may drink water.',
  'На Двадаші після сходу сонця, переривати водою або чаранамрітою',
  'Рівноцінний дотриманню всіх 24 екадаші, повне очищення', 'Equivalent to observing all 24 Ekadashis, complete purification',
  true, 6
),

-- МЕСЯЦЬ 4: ВАМАНА (Ashadha) - Червень/Липень
(
  'yogini-ekadashi',
  4, 'krishna',
  'Yoginī Ekādaśī', 'Йогіні Екадаші', 'Yogini Ekadashi',
  'Екадаші йогінів', 'The Ekadashi of yoginis',
  'Йогіні Екадаші дарує сили для йоги та медитації. Дотримання цього посту приносить відданим здатність до глибокої концентрації та духовного прогресу.',
  'Yogini Ekadashi grants powers for yoga and meditation. Observing this fast brings devotees the ability for deep concentration and spiritual progress.',
  'Padma Purana, Uttara-khanda',
  'Господь Вамана', 'Lord Vamana',
  'Піст від зернових. Медитація та джапа рекомендовані.',
  'Fast from grains. Meditation and japa are recommended.',
  'На Двадаші після сходу сонця',
  'Сили для йоги, духовний прогрес', 'Powers for yoga, spiritual progress',
  false, 7
),
(
  'devshayani-ekadashi',
  4, 'shukla',
  'Devśayanī Ekādaśī', 'Девшаяні Екадаші', 'Devshayani Ekadashi',
  'Екадаші сну Господа (Падма Екадаші)', 'Ekadashi of the Lord''s sleep (Padma Ekadashi)',
  'Девшаяні Екадаші починає чотиримісячний період Чатурмас''ї, коли Господь Вішну засинає на ліжку Шеші. Цей екадаші має особливе значення та є початком суворих обітниць.',
  'Devshayani Ekadashi begins the four-month period of Chaturmasya when Lord Vishnu sleeps on the bed of Shesha. This Ekadashi has special significance and marks the beginning of strict vows.',
  'Padma Purana, Uttara-khanda',
  'Господь Падманабга', 'Lord Padmanabha',
  'Піст від зернових. Початок Чатурмас''ї.',
  'Fast from grains. Beginning of Chaturmasya.',
  'На Двадаші після сходу сонця',
  'Особливі благословення на період Чатурмас''ї', 'Special blessings for Chaturmasya period',
  true, 8
),

-- МЕСЯЦЬ 5: ШРІДГАРА (Shravana) - Липень/Серпень
(
  'kamika-ekadashi',
  5, 'krishna',
  'Kāmikā Ekādaśī', 'Каміка Екадаші', 'Kamika Ekadashi',
  'Екадаші виконання бажань', 'The Ekadashi of wish fulfillment',
  'Каміка Екадаші виконує всі благочестиві бажання відданих. Особливо сприятливий для тих, хто бажає духовного прогресу.',
  'Kamika Ekadashi fulfills all pious desires of devotees. Especially auspicious for those desiring spiritual progress.',
  'Padma Purana, Uttara-khanda',
  'Господь Шрідгара', 'Lord Shridhara',
  'Піст від зернових.',
  'Fast from grains.',
  'На Двадаші після сходу сонця',
  'Виконання благочестивих бажань', 'Fulfillment of pious desires',
  false, 9
),
(
  'shravana-putrada-ekadashi',
  5, 'shukla',
  'Śrāvaṇa Putradā Ekādaśī', 'Шравана Путрада Екадаші', 'Shravana Putrada Ekadashi',
  'Екадаші, що дарує синів', 'The Ekadashi that grants sons',
  'Шравана Путрада Екадаші дарує благословення тим, хто бажає мати дітей. Особливо сприятливий для сімейних пар, які хочуть мати благочестиве потомство.',
  'Shravana Putrada Ekadashi grants blessings to those desiring children. Especially auspicious for married couples wishing for pious offspring.',
  'Padma Purana, Uttara-khanda',
  'Господь Вішну', 'Lord Vishnu',
  'Піст від зернових. Молитви за дітей.',
  'Fast from grains. Prayers for children.',
  'На Двадаші після сходу сонця',
  'Благословення на дітей', 'Blessing for children',
  false, 10
),

-- МЕСЯЦЬ 6: ХРІШІКЕША (Bhadrapada) - Серпень/Вересень
(
  'aja-ekadashi',
  6, 'krishna',
  'Ajā Ekādaśī', 'Аджа Екадаші', 'Aja Ekadashi',
  'Ненароджений Екадаші', 'The Unborn Ekadashi',
  'Аджа Екадаші символізує ненародженого Господа та звільняє від циклу народження і смерті.',
  'Aja Ekadashi symbolizes the unborn Lord and liberates from the cycle of birth and death.',
  'Padma Purana, Uttara-khanda',
  'Господь Хрішікеша', 'Lord Hrishikesha',
  'Піст від зернових.',
  'Fast from grains.',
  'На Двадаші після сходу сонця',
  'Звільнення від циклу народження і смерті', 'Liberation from the cycle of birth and death',
  false, 11
),
(
  'parivartini-ekadashi',
  6, 'shukla',
  'Parivartinī Ekādaśī', 'Парівартіні Екадаші', 'Parivartini Ekadashi',
  'Екадаші перевороту (Падма Екадаші)', 'The Ekadashi of turning (Padma Ekadashi)',
  'Парівартіні Екадаші відзначає момент, коли Господь Вішну перевертається на інший бік під час свого йога-нідри. Цей день має особливе значення в період Чатурмас''ї.',
  'Parivartini Ekadashi marks the moment when Lord Vishnu turns to the other side during His yoga-nidra. This day has special significance during Chaturmasya.',
  'Padma Purana, Uttara-khanda',
  'Господь Вамана', 'Lord Vamana',
  'Піст від зернових. Обітниці Чатурмас''ї.',
  'Fast from grains. Chaturmasya vows.',
  'На Двадаші після сходу сонця',
  'Середина Чатурмас''ї, особливі благословення', 'Middle of Chaturmasya, special blessings',
  true, 12
),

-- МЕСЯЦЬ 7: ПАДМАНАБГА (Ashvina) - Вересень/Жовтень
(
  'indira-ekadashi',
  7, 'krishna',
  'Indirā Ekādaśī', 'Індіра Екадаші', 'Indira Ekadashi',
  'Екадаші богині Індіри', 'The Ekadashi of Goddess Indira',
  'Індіра Екадаші звільняє предків від страждань та дарує їм благо. Особливо сприятливий для обрядів на честь предків.',
  'Indira Ekadashi liberates ancestors from suffering and grants them benefit. Especially auspicious for rituals honoring ancestors.',
  'Padma Purana, Uttara-khanda',
  'Господь Хрішікеша', 'Lord Hrishikesha',
  'Піст від зернових. Обряди на честь предків.',
  'Fast from grains. Rituals honoring ancestors.',
  'На Двадаші після сходу сонця',
  'Звільнення предків', 'Liberation of ancestors',
  false, 13
),
(
  'pashankusha-ekadashi',
  7, 'shukla',
  'Pāśāṅkuśā Ekādaśī', 'Пашанкуша Екадаші', 'Pashankusha Ekadashi',
  'Екадаші петлі та стрекала', 'The Ekadashi of noose and goad',
  'Пашанкуша Екадаші дарує контроль над чуттями та звільняє від пут матеріального існування. Символіка петлі та стрекала вказує на контроль та спрямування.',
  'Pashankusha Ekadashi grants control over the senses and liberates from the bonds of material existence. The symbolism of noose and goad indicates control and direction.',
  'Padma Purana, Uttara-khanda',
  'Господь Падманабга', 'Lord Padmanabha',
  'Піст від зернових.',
  'Fast from grains.',
  'На Двадаші після сходу сонця',
  'Контроль чуттів, звільнення від пут', 'Sense control, liberation from bonds',
  false, 14
),

-- МЕСЯЦЬ 8: ДАМОДАРА (Kartika) - Жовтень/Листопад
(
  'rama-ekadashi',
  8, 'krishna',
  'Ramā Ekādaśī', 'Рама Екадаші', 'Rama Ekadashi',
  'Екадаші богині Рами (Лакшмі)', 'The Ekadashi of Goddess Rama (Lakshmi)',
  'Рама Екадаші названий на честь богині Лакшмі та дарує процвітання і духовне багатство.',
  'Rama Ekadashi is named after Goddess Lakshmi and grants prosperity and spiritual wealth.',
  'Padma Purana, Uttara-khanda',
  'Богиня Лакшмі', 'Goddess Lakshmi',
  'Піст від зернових. Поклоніння Лакшмі.',
  'Fast from grains. Worship of Lakshmi.',
  'На Двадаші після сходу сонця',
  'Процвітання та духовне багатство', 'Prosperity and spiritual wealth',
  false, 15
),
(
  'haribodhini-ekadashi',
  8, 'shukla',
  'Haribodinī Ekādaśī', 'Харібодхіні Екадаші', 'Haribodhini Ekadashi',
  'Екадаші пробудження Господа (Уттхана Екадаші)', 'The Ekadashi of the Lord''s awakening (Utthana Ekadashi)',
  'Харібодхіні Екадаші — це день, коли Господь Вішну прокидається від свого чотиримісячного сну. Цей день завершує період Чатурмас''ї і є одним з найважливіших екадаші року.',
  'Haribodhini Ekadashi is the day when Lord Vishnu awakens from His four-month sleep. This day concludes Chaturmasya and is one of the most important Ekadashis of the year.',
  'Padma Purana, Uttara-khanda',
  'Господь Дамодара', 'Lord Damodara',
  'Піст від зернових. Нічне бдіння. Завершення Чатурмас''ї.',
  'Fast from grains. Night vigil. Conclusion of Chaturmasya.',
  'На Двадаші після сходу сонця',
  'Пробудження Господа, завершення Чатурмас''ї, особливі благословення', 'Lord''s awakening, conclusion of Chaturmasya, special blessings',
  true, 16
),

-- МЕСЯЦЬ 9: КЕШАВА (Margashirsha) - Листопад/Грудень
(
  'utpanna-ekadashi',
  9, 'krishna',
  'Utpannā Ekādaśī', 'Утпанна Екадаші', 'Utpanna Ekadashi',
  'Екадаші появи (народження Екадаші)', 'The Ekadashi of origin (birth of Ekadashi)',
  'Утпанна Екадаші — це день, коли персоніфікована Екадаші-деві з''явилася з тіла Господа Вішну. Цей екадаші є матір''ю всіх екадаші.',
  'Utpanna Ekadashi is the day when the personified Ekadashi-devi appeared from the body of Lord Vishnu. This Ekadashi is the mother of all Ekadashis.',
  'Padma Purana, Uttara-khanda',
  'Екадаші-деві', 'Ekadashi-devi',
  'Піст від зернових. Слухання історії появи Екадаші.',
  'Fast from grains. Hearing the story of Ekadashi''s appearance.',
  'На Двадаші після сходу сонця',
  'Особливі благословення матері всіх екадаші', 'Special blessings from the mother of all Ekadashis',
  true, 17
),
(
  'mokshada-ekadashi',
  9, 'shukla',
  'Mokṣadā Ekādaśī', 'Мокшада Екадаші', 'Mokshada Ekadashi',
  'Екадаші, що дарує звільнення (Гіта Джаянті)', 'The Ekadashi that grants liberation (Gita Jayanti)',
  'Мокшада Екадаші — день, коли Господь Крішна розповів Бгаґавад-ґіту Арджуні. Цей день також відомий як Гіта Джаянті. Дотримання посту в цей день дарує мокшу — духовне звільнення.',
  'Mokshada Ekadashi is the day when Lord Krishna spoke the Bhagavad-gita to Arjuna. This day is also known as Gita Jayanti. Observing the fast on this day grants moksha — spiritual liberation.',
  'Padma Purana, Uttara-khanda',
  'Господь Крішна', 'Lord Krishna',
  'Піст від зернових. Читання Бгаґавад-ґіти.',
  'Fast from grains. Reading Bhagavad-gita.',
  'На Двадаші після сходу сонця',
  'Мокша — духовне звільнення, Гіта Джаянті', 'Moksha — spiritual liberation, Gita Jayanti',
  true, 18
),

-- МЕСЯЦЬ 10: НАРАЯНА (Pausha) - Грудень/Січень
(
  'saphala-ekadashi',
  10, 'krishna',
  'Saphalā Ekādaśī', 'Сапхала Екадаші', 'Saphala Ekadashi',
  'Успішний Екадаші', 'The Successful Ekadashi',
  'Сапхала Екадаші приносить успіх у всіх справах і звільняє від невдач.',
  'Saphala Ekadashi brings success in all endeavors and liberates from failures.',
  'Padma Purana, Uttara-khanda',
  'Господь Нараяна', 'Lord Narayana',
  'Піст від зернових.',
  'Fast from grains.',
  'На Двадаші після сходу сонця',
  'Успіх у всіх справах', 'Success in all endeavors',
  false, 19
),
(
  'pausha-putrada-ekadashi',
  10, 'shukla',
  'Pauṣa Putradā Ekādaśī', 'Пауша Путрада Екадаші', 'Pausha Putrada Ekadashi',
  'Екадаші, що дарує синів', 'The Ekadashi that grants sons',
  'Пауша Путрада Екадаші, як і Шравана Путрада, дарує благословення на благочестиве потомство.',
  'Pausha Putrada Ekadashi, like Shravana Putrada, grants blessings for pious offspring.',
  'Padma Purana, Uttara-khanda',
  'Господь Нараяна', 'Lord Narayana',
  'Піст від зернових. Молитви за дітей.',
  'Fast from grains. Prayers for children.',
  'На Двадаші після сходу сонця',
  'Благословення на потомство', 'Blessing for offspring',
  false, 20
),

-- МЕСЯЦЬ 11: ГОВІНДА (Magha) - Січень/Лютий
(
  'sat-tila-ekadashi',
  11, 'krishna',
  'Ṣaṭ-tilā Ekādaśī', 'Шат-тіла Екадаші', 'Sat-tila Ekadashi',
  'Екадаші шести кунжутів', 'The Ekadashi of six sesames',
  'Шат-тіла Екадаші отримав назву через шість способів використання кунжуту: їсти, поливати маслом, наносити на тіло, пропонувати в жертву, дарувати та роздавати. Дотримання цього екадаші з використанням кунжуту приносить велику заслугу.',
  'Sat-tila Ekadashi gets its name from the six ways of using sesame: eating, anointing with oil, applying to the body, offering in sacrifice, gifting, and distributing. Observing this Ekadashi with sesame brings great merit.',
  'Padma Purana, Uttara-khanda',
  'Господь Говінда', 'Lord Govinda',
  'Піст від зернових. Використання кунжуту у шести способах.',
  'Fast from grains. Use sesame in six ways.',
  'На Двадаші після сходу сонця',
  'Велика духовна заслуга', 'Great spiritual merit',
  false, 21
),
(
  'jaya-ekadashi',
  11, 'shukla',
  'Jayā Ekādaśī', 'Джая Екадаші', 'Jaya Ekadashi',
  'Переможний Екадаші', 'The Victorious Ekadashi',
  'Джая Екадаші дарує перемогу над ворогами — як зовнішніми, так і внутрішніми (похіть, гнів, жадібність). Цей піст звільняє навіть привидів і демонів.',
  'Jaya Ekadashi grants victory over enemies — both external and internal (lust, anger, greed). This fast liberates even ghosts and demons.',
  'Padma Purana, Uttara-khanda',
  'Господь Вішну', 'Lord Vishnu',
  'Піст від зернових.',
  'Fast from grains.',
  'На Двадаші після сходу сонця',
  'Перемога над ворогами, звільнення', 'Victory over enemies, liberation',
  false, 22
),

-- МЕСЯЦЬ 12: ВІШНУ (Phalguna) - Лютий/Березень
(
  'vijaya-ekadashi',
  12, 'krishna',
  'Vijayā Ekādaśī', 'Віджая Екадаші', 'Vijaya Ekadashi',
  'Екадаші перемоги', 'The Ekadashi of victory',
  'Віджая Екадаші дарує перемогу у всіх справах. Господь Рама дотримувався цього екадаші перед війною з Раваною, і здобув перемогу.',
  'Vijaya Ekadashi grants victory in all endeavors. Lord Rama observed this Ekadashi before the war with Ravana and achieved victory.',
  'Padma Purana, Uttara-khanda',
  'Господь Рама', 'Lord Rama',
  'Піст від зернових.',
  'Fast from grains.',
  'На Двадаші після сходу сонця',
  'Перемога у всіх справах', 'Victory in all endeavors',
  true, 23
),
(
  'amalaki-ekadashi',
  12, 'shukla',
  'Āmalakī Ekādaśī', 'Амалакі Екадаші', 'Amalaki Ekadashi',
  'Екадаші дерева Амалакі', 'The Ekadashi of Amalaki tree',
  'Амалакі Екадаші названий на честь священного дерева амалакі (індійський аґрус). Поклоніння цьому дереву в цей день приносить велику заслугу та здоров''я.',
  'Amalaki Ekadashi is named after the sacred amalaki tree (Indian gooseberry). Worshiping this tree on this day brings great merit and health.',
  'Padma Purana, Uttara-khanda',
  'Господь Вішну', 'Lord Vishnu',
  'Піст від зернових. Поклоніння дереву амалакі.',
  'Fast from grains. Worship of the amalaki tree.',
  'На Двадаші після сходу сонця',
  'Здоров''я та духовна заслуга', 'Health and spiritual merit',
  false, 24
)

ON CONFLICT (slug) DO UPDATE SET
  name_uk = EXCLUDED.name_uk,
  name_en = EXCLUDED.name_en,
  glory_title_uk = EXCLUDED.glory_title_uk,
  glory_title_en = EXCLUDED.glory_title_en,
  glory_text_uk = EXCLUDED.glory_text_uk,
  glory_text_en = EXCLUDED.glory_text_en,
  presiding_deity_uk = EXCLUDED.presiding_deity_uk,
  presiding_deity_en = EXCLUDED.presiding_deity_en,
  fasting_rules_uk = EXCLUDED.fasting_rules_uk,
  fasting_rules_en = EXCLUDED.fasting_rules_en,
  benefits_uk = EXCLUDED.benefits_uk,
  benefits_en = EXCLUDED.benefits_en,
  updated_at = now();

COMMIT;
