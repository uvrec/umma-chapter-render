-- Seed all 26 Ekadashis with Padma Purana data
-- Each ekadashi has glory texts from Padma Purana Uttara-khanda

BEGIN;

-- ============================================
-- SEED 26 EKADASHIS
-- ============================================

INSERT INTO ekadashi_info (
  slug,
  vaishnava_month_id,
  paksha,
  name_sanskrit,
  name_uk,
  name_en,
  glory_title_uk,
  glory_title_en,
  glory_text_uk,
  glory_text_en,
  glory_source,
  presiding_deity_uk,
  presiding_deity_en,
  benefits_uk,
  benefits_en,
  fasting_rules_uk,
  fasting_rules_en,
  breaking_fast_time,
  is_major,
  sort_order
) VALUES

-- ============================================
-- Month 1: Mādhava (Chaitra)
-- ============================================

(
  'kamada-ekadashi',
  1, -- Mādhava
  'shukla',
  'Kāmadā Ekādaśī',
  'Камада Екадаші',
  'Kamada Ekadashi',
  'Слава Камада Екадаші',
  'The Glory of Kamada Ekadashi',
  'Цей екадаші виконує всі бажання (кама) відданих. Той, хто дотримується цього посту з вірою та відданістю, звільняється від усіх гріхів та досягає вищої обителі Господа Вішну.',
  'This Ekadashi fulfills all desires (kama) of the devotees. One who observes this fast with faith and devotion is freed from all sins and attains the supreme abode of Lord Vishnu.',
  'Padma Purana, Uttara-khanda, Chapter 23',
  'Господь Вішну',
  'Lord Vishnu',
  'Виконання всіх бажань, звільнення від гріхів, досягнення Вайкунтхи',
  'Fulfillment of all desires, freedom from sins, attainment of Vaikuntha',
  'Повний піст від зерна та бобових. Дозволено фрукти, молоко, горіхи.',
  'Complete fast from grains and beans. Fruits, milk, and nuts are allowed.',
  'After sunrise on Dvadashi, within parana time',
  false,
  1
),

(
  'varuthini-ekadashi',
  1, -- Mādhava
  'krishna',
  'Varūthinī Ekādaśī',
  'Варутхіні Екадаші',
  'Varuthini Ekadashi',
  'Слава Варутхіні Екадаші',
  'The Glory of Varuthini Ekadashi',
  'Варутхіні означає "та, що захищає". Цей екадаші захищає від усіх небезпек та дарує духовний прогрес. Заслуга цього посту перевищує заслугу від тисячі ашвамедха-ягій.',
  'Varuthini means "the one who protects". This Ekadashi protects from all dangers and grants spiritual progress. The merit of this fast exceeds the merit of a thousand Ashvamedha sacrifices.',
  'Padma Purana, Uttara-khanda, Chapter 24',
  'Господь Варага (Вепр)',
  'Lord Varaha (Boar)',
  'Захист від небезпек, духовний прогрес, звільнення від матеріальних страждань',
  'Protection from dangers, spiritual progress, liberation from material suffering',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  2
),

-- ============================================
-- Month 2: Mādhusūdana (Vaishakha)
-- ============================================

(
  'mohini-ekadashi',
  2, -- Mādhusūdana
  'shukla',
  'Mohinī Ekādaśī',
  'Мохіні Екадаші',
  'Mohini Ekadashi',
  'Слава Мохіні Екадаші',
  'The Glory of Mohini Ekadashi',
  'Названий на честь чарівної форми Господа Мохіні. Цей екадаші знищує всі гріхи та дарує красу, привабливість та духовне очищення.',
  'Named after the enchanting form of Lord Mohini. This Ekadashi destroys all sins and grants beauty, attractiveness, and spiritual purification.',
  'Padma Purana, Uttara-khanda, Chapter 25',
  'Господь Мохіні',
  'Lord Mohini',
  'Очищення від гріхів, духовна краса, звільнення від ілюзії',
  'Purification from sins, spiritual beauty, freedom from illusion',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  3
),

(
  'apara-ekadashi',
  2, -- Mādhusūdana
  'krishna',
  'Aparā Ekādaśī',
  'Апара Екадаші',
  'Apara Ekadashi',
  'Слава Апара Екадаші',
  'The Glory of Apara Ekadashi',
  'Апара означає "безмежний". Заслуга цього екадаші безмежна. Навіть найважчі гріхи, такі як брахмахатья (вбивство брахмана), знищуються дотриманням цього посту.',
  'Apara means "unlimited". The merit of this Ekadashi is unlimited. Even the gravest sins like brahmahatya (killing a brahmana) are destroyed by observing this fast.',
  'Padma Purana, Uttara-khanda, Chapter 26',
  'Господь Вішну',
  'Lord Vishnu',
  'Безмежна заслуга, знищення найважчих гріхів, духовне звільнення',
  'Unlimited merit, destruction of gravest sins, spiritual liberation',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  4
),

-- ============================================
-- Month 3: Trivikrama (Jyeshtha)
-- ============================================

(
  'nirjala-ekadashi',
  3, -- Trivikrama
  'shukla',
  'Nirjalā Ekādaśī',
  'Ніржала Екадаші',
  'Nirjala Ekadashi',
  'Слава Ніржала (Пандава/Бхіма) Екадаші',
  'The Glory of Nirjala (Pandava/Bhima) Ekadashi',
  'Найсуворіший з усіх екадаші. Бхімасена запитав Вьясадеву, як він може отримати заслугу всіх екадаші, не маючи сили дотримуватись їх усіх. Вьяса порадив дотримуватись цього одного екадаші без води - і заслуга дорівнює всім 24 екадаші року.',
  'The strictest of all Ekadashis. Bhimasena asked Vyasadeva how he could gain the merit of all Ekadashis without the strength to observe them all. Vyasa advised observing this one Ekadashi without water - and the merit equals all 24 Ekadashis of the year.',
  'Padma Purana, Uttara-khanda, Chapter 27 (Jyeshtha-mahatmya)',
  'Господь Вішну',
  'Lord Vishnu',
  'Заслуга всіх 24 екадаші року, повне очищення, досягнення Вайкунтхи',
  'Merit of all 24 Ekadashis of the year, complete purification, attainment of Vaikuntha',
  'Повний піст БЕЗ ВОДИ (ніржала). Лише ачамана дозволена для ритуалів.',
  'Complete fast WITHOUT WATER (nirjala). Only achamana is allowed for rituals.',
  'After sunrise on Dvadashi, must drink water immediately',
  true,
  5
),

(
  'yogini-ekadashi',
  3, -- Trivikrama
  'krishna',
  'Yoginī Ekādaśī',
  'Йогіні Екадаші',
  'Yogini Ekadashi',
  'Слава Йогіні Екадаші',
  'The Glory of Yogini Ekadashi',
  'Цей екадаші особливо сприятливий для йогів та тих, хто прагне духовного прогресу. Дотримання цього посту звільняє від циклу народження і смерті.',
  'This Ekadashi is especially auspicious for yogis and those seeking spiritual progress. Observing this fast liberates from the cycle of birth and death.',
  'Padma Purana, Uttara-khanda, Chapter 28',
  'Господь Вішну',
  'Lord Vishnu',
  'Духовний прогрес, звільнення від сансари, благословення для йоги',
  'Spiritual progress, liberation from samsara, blessings for yoga practice',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  6
),

-- ============================================
-- Month 4: Vāmana (Ashadha)
-- ============================================

(
  'devashayani-ekadashi',
  4, -- Vāmana
  'shukla',
  'Devaśayanī Ekādaśī',
  'Девашаяні Екадаші',
  'Devashayani Ekadashi',
  'Слава Девашаяні (Шаяна) Екадаші',
  'The Glory of Devashayani (Shayana) Ekadashi',
  'У цей день Господь Вішну лягає спати на Шеша-нагу в молочному океані на чотири місяці Чатурмасья. Початок священного періоду Чатурмасья. Всі благочестиві обряди посилюються у цей період.',
  'On this day Lord Vishnu goes to sleep on Shesha-naga in the milk ocean for the four months of Chaturmasya. Beginning of the sacred Chaturmasya period. All pious observances are intensified during this period.',
  'Padma Purana, Uttara-khanda, Chapter 29',
  'Господь Вішну (сплячий)',
  'Lord Vishnu (sleeping)',
  'Початок Чатурмасья, особливі благословення, духовне очищення',
  'Beginning of Chaturmasya, special blessings, spiritual purification',
  'Повний піст від зерна та бобових. Початок обітниць Чатурмасья.',
  'Complete fast from grains and beans. Beginning of Chaturmasya vows.',
  'After sunrise on Dvadashi',
  true,
  7
),

(
  'kamika-ekadashi',
  4, -- Vāmana
  'krishna',
  'Kāmikā Ekādaśī',
  'Каміка Екадаші',
  'Kamika Ekadashi',
  'Слава Каміка Екадаші',
  'The Glory of Kamika Ekadashi',
  'Каміка означає "та, що виконує бажання". Господь Брагма розповів про славу цього екадаші Нараді Муні. Навіть простий погляд на Божество в цей день дарує велику заслугу.',
  'Kamika means "the one who fulfills desires". Lord Brahma narrated the glory of this Ekadashi to Narada Muni. Even a simple glance at the Deity on this day grants great merit.',
  'Padma Purana, Uttara-khanda, Chapter 30',
  'Господь Вішну',
  'Lord Vishnu',
  'Виконання бажань, велика заслуга, духовне очищення',
  'Fulfillment of desires, great merit, spiritual purification',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  8
),

-- ============================================
-- Month 5: Śrīdhara (Shravana)
-- ============================================

(
  'shravana-putrada-ekadashi',
  5, -- Śrīdhara
  'shukla',
  'Śravaṇa Putradā Ekādaśī',
  'Шравана Путрада Екадаші',
  'Shravana Putrada Ekadashi',
  'Слава Шравана Путрада Екадаші',
  'The Glory of Shravana Putrada Ekadashi',
  'Путрада означає "той, що дарує синів". Цей екадаші особливо сприятливий для тих, хто бажає потомства. Історія царя Махіджіта, який отримав сина завдяки цьому екадаші.',
  'Putrada means "giver of sons". This Ekadashi is especially auspicious for those desiring offspring. The story of King Mahijita who obtained a son by observing this Ekadashi.',
  'Padma Purana, Uttara-khanda, Chapter 31',
  'Господь Вішну',
  'Lord Vishnu',
  'Благословення потомством, сімейне щастя, духовний прогрес',
  'Blessing of offspring, family happiness, spiritual progress',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  9
),

(
  'aja-ekadashi',
  5, -- Śrīdhara
  'krishna',
  'Ajā Ekādaśī',
  'Аджа Екадаші',
  'Aja Ekadashi',
  'Слава Аджа Екадаші',
  'The Glory of Aja Ekadashi',
  'Аджа означає "ненароджений" - епітет Господа. Цар Гаріш-чандра, славетний своєю правдивістю, звільнився від усіх страждань завдяки цьому екадаші.',
  'Aja means "unborn" - an epithet of the Lord. King Harishchandra, famous for his truthfulness, was freed from all suffering by observing this Ekadashi.',
  'Padma Purana, Uttara-khanda, Chapter 32',
  'Господь Вішну (Аджа)',
  'Lord Vishnu (Aja)',
  'Звільнення від страждань, очищення карми, духовне піднесення',
  'Freedom from suffering, karmic purification, spiritual elevation',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  10
),

-- ============================================
-- Month 6: Hṛṣīkeśa (Bhadrapada)
-- ============================================

(
  'padma-ekadashi',
  6, -- Hṛṣīkeśa
  'shukla',
  'Padmā Ekādaśī',
  'Падма Екадаші',
  'Padma Ekadashi',
  'Слава Падма Екадаші',
  'The Glory of Padma Ekadashi',
  'Падма означає "лотос". Цей екадаші названий на честь лотоса, що виріс з пупка Господа Вішну. Дотримання цього посту дарує чистоту лотоса та звільнення від матеріальної скверни.',
  'Padma means "lotus". This Ekadashi is named after the lotus that grew from the navel of Lord Vishnu. Observing this fast grants the purity of a lotus and freedom from material contamination.',
  'Padma Purana, Uttara-khanda, Chapter 57',
  'Господь Вішну',
  'Lord Vishnu',
  'Чистота серця, духовне звільнення, благословення Господа',
  'Purity of heart, spiritual liberation, blessings of the Lord',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  11
),

(
  'parivartini-ekadashi',
  6, -- Hṛṣīkeśa
  'krishna',
  'Parivartinī Ekādaśī',
  'Парівартіні Екадаші',
  'Parivartini Ekadashi',
  'Слава Парівартіні (Паршва/Вамана) Екадаші',
  'The Glory of Parivartini (Parsva/Vamana) Ekadashi',
  'Парівартіні означає "та, що повертається". У цей день Господь Вішну повертається на інший бік під час свого сну. Також відомий як Вамана Екадаші, бо в цей день Господь прийняв форму Вамани.',
  'Parivartini means "the one who turns". On this day Lord Vishnu turns to His other side during His sleep. Also known as Vamana Ekadashi, as the Lord assumed the Vamana form on this day.',
  'Padma Purana, Uttara-khanda, Chapter 33',
  'Господь Вамана',
  'Lord Vamana',
  'Благословення Господа Вамани, духовний прогрес, смирення',
  'Blessings of Lord Vamana, spiritual progress, humility',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  12
),

-- ============================================
-- Month 7: Padmanābha (Ashwin)
-- ============================================

(
  'indira-ekadashi',
  7, -- Padmanābha
  'krishna',
  'Indirā Ekādaśī',
  'Індіра Екадаші',
  'Indira Ekadashi',
  'Слава Індіра Екадаші',
  'The Glory of Indira Ekadashi',
  'Індіра - це ім''я богині Лакшмі. Цей екадаші особливо сприятливий для звільнення предків з пекельних планет. Історія царя Індрасени, чий батько був звільнений завдяки цьому екадаші.',
  'Indira is a name of Goddess Lakshmi. This Ekadashi is especially auspicious for liberating ancestors from hellish planets. The story of King Indrasena, whose father was liberated by this Ekadashi.',
  'Padma Purana, Uttara-khanda, Chapter 34',
  'Господь Вішну та Лакшмі',
  'Lord Vishnu and Lakshmi',
  'Звільнення предків, процвітання, духовне очищення',
  'Liberation of ancestors, prosperity, spiritual purification',
  'Повний піст від зерна та бобових. Особливо важливий для шраддхи.',
  'Complete fast from grains and beans. Especially important for shraddha.',
  'After sunrise on Dvadashi',
  false,
  13
),

(
  'papankusha-ekadashi',
  7, -- Padmanābha
  'shukla',
  'Pāpāṅkuśā Ekādaśī',
  'Папанкуша Екадаші',
  'Papankusha Ekadashi',
  'Слава Папанкуша Екадаші',
  'The Glory of Papankusha Ekadashi',
  'Папанкуша означає "той, що контролює гріхи". Цей екадаші повністю знищує всі гріхи, подібно до того, як слон контролюється анкушею (гаком).',
  'Papankusha means "the controller of sins". This Ekadashi completely destroys all sins, just as an elephant is controlled by an ankusha (goad).',
  'Padma Purana, Uttara-khanda, Chapter 35',
  'Господь Вішну',
  'Lord Vishnu',
  'Знищення всіх гріхів, духовний контроль, звільнення',
  'Destruction of all sins, spiritual control, liberation',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  14
),

-- ============================================
-- Month 8: Dāmodara (Kartik)
-- ============================================

(
  'rama-ekadashi',
  8, -- Dāmodara
  'krishna',
  'Rāmā Ekādaśī',
  'Рама Екадаші',
  'Rama Ekadashi',
  'Слава Рама Екадаші',
  'The Glory of Rama Ekadashi',
  'Рама означає "та, що дарує радість". Цей екадаші дарує радість серцю та звільняє від усіх страждань. Особливо сприятливий у священний місяць Картік.',
  'Rama means "the one who gives joy". This Ekadashi gives joy to the heart and liberates from all suffering. Especially auspicious in the sacred month of Kartik.',
  'Padma Purana, Uttara-khanda, Chapter 36',
  'Господь Вішну',
  'Lord Vishnu',
  'Радість серця, звільнення від страждань, благословення Картіка',
  'Joy of the heart, freedom from suffering, blessings of Kartik',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  15
),

(
  'prabodhini-ekadashi',
  8, -- Dāmodara
  'shukla',
  'Prabodhinī Ekādaśī',
  'Прабодхіні Екадаші',
  'Prabodhini Ekadashi',
  'Слава Прабодхіні (Уттхана/Девоттхана) Екадаші',
  'The Glory of Prabodhini (Utthana/Devotthana) Ekadashi',
  'Прабодхіні означає "та, що пробуджує". У цей день Господь Вішну прокидається після чотиримісячного сну. Кінець Чатурмасья. Найсприятливіший день для весілля та інших благих починань.',
  'Prabodhini means "the one who awakens". On this day Lord Vishnu awakens from His four-month sleep. End of Chaturmasya. Most auspicious day for weddings and other auspicious beginnings.',
  'Padma Purana, Uttara-khanda, Chapter 37',
  'Господь Вішну (пробуджений)',
  'Lord Vishnu (awakened)',
  'Кінець Чатурмасья, благословення для нових починань, духовне пробудження',
  'End of Chaturmasya, blessings for new beginnings, spiritual awakening',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  true,
  16
),

-- ============================================
-- Month 9: Keśava (Margashirsha)
-- ============================================

(
  'utpanna-ekadashi',
  9, -- Keśava
  'krishna',
  'Utpannā Ekādaśī',
  'Утпанна Екадаші',
  'Utpanna Ekadashi',
  'Слава Утпанна Екадаші',
  'The Glory of Utpanna Ekadashi',
  'Утпанна означає "народжена". Цей екадаші описує народження богині Екадаші з тіла Господа Вішну для знищення демона Мура. Перший та найважливіший екадаші для розуміння слави всіх екадаші.',
  'Utpanna means "born". This Ekadashi describes the birth of Goddess Ekadashi from the body of Lord Vishnu to destroy the demon Mura. The first and most important Ekadashi for understanding the glory of all Ekadashis.',
  'Padma Purana, Uttara-khanda, Chapter 38',
  'Богиня Екадаші',
  'Goddess Ekadashi',
  'Розуміння слави екадаші, знищення демонічних якостей, духовне народження',
  'Understanding the glory of Ekadashi, destruction of demoniac qualities, spiritual birth',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  true,
  17
),

(
  'mokshada-ekadashi',
  9, -- Keśava
  'shukla',
  'Mokṣadā Ekādaśī',
  'Мокшада Екадаші',
  'Mokshada Ekadashi',
  'Слава Мокшада (Гіта) Екадаші',
  'The Glory of Mokshada (Gita) Ekadashi',
  'Мокшада означає "той, що дарує звільнення". У цей день Господь Крішна розповів Бгаґавад-ґіту Арджуні на полі Курукшетра. Також відомий як Гіта Джаянті.',
  'Mokshada means "giver of liberation". On this day Lord Krishna spoke the Bhagavad-gita to Arjuna on the battlefield of Kurukshetra. Also known as Gita Jayanti.',
  'Padma Purana, Uttara-khanda, Chapter 39',
  'Господь Крішна',
  'Lord Krishna',
  'Звільнення (мокша), знання Бгаґавад-ґіти, духовне просвітлення',
  'Liberation (moksha), knowledge of Bhagavad-gita, spiritual enlightenment',
  'Повний піст від зерна та бобових. Читання Бгаґавад-ґіти.',
  'Complete fast from grains and beans. Reading of Bhagavad-gita.',
  'After sunrise on Dvadashi',
  true,
  18
),

-- ============================================
-- Month 10: Nārāyaṇa (Pausha)
-- ============================================

(
  'saphala-ekadashi',
  10, -- Nārāyaṇa
  'krishna',
  'Saphalā Ekādaśī',
  'Сапхала Екадаші',
  'Saphala Ekadashi',
  'Слава Сапхала Екадаші',
  'The Glory of Saphala Ekadashi',
  'Сапхала означає "успішний". Цей екадаші дарує успіх у всіх починаннях. Історія Лумпаки, грішного сина царя Магішмати, який був очищений завдяки цьому екадаші.',
  'Saphala means "successful". This Ekadashi grants success in all endeavors. The story of Lumpaka, the sinful son of King Mahishmati, who was purified by this Ekadashi.',
  'Padma Purana, Uttara-khanda, Chapter 40',
  'Господь Нараяна',
  'Lord Narayana',
  'Успіх у всіх справах, очищення навіть великих грішників',
  'Success in all matters, purification of even great sinners',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  19
),

(
  'pausha-putrada-ekadashi',
  10, -- Nārāyaṇa
  'shukla',
  'Pauṣa Putradā Ekādaśī',
  'Пауша Путрада Екадаші',
  'Pausha Putrada Ekadashi',
  'Слава Пауша Путрада Екадаші',
  'The Glory of Pausha Putrada Ekadashi',
  'Другий Путрада екадаші року. Особливо сприятливий для бездітних пар. Історія царя Сукетумана та цариці Шайбьї, які отримали сина завдяки цьому екадаші.',
  'The second Putrada Ekadashi of the year. Especially auspicious for childless couples. The story of King Suketumana and Queen Shaibya, who obtained a son by this Ekadashi.',
  'Padma Purana, Uttara-khanda, Chapter 41',
  'Господь Вішну',
  'Lord Vishnu',
  'Благословення потомством, сімейне щастя, виконання бажань',
  'Blessing of offspring, family happiness, fulfillment of desires',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  20
),

-- ============================================
-- Month 11: Govinda (Magha)
-- ============================================

(
  'sat-tila-ekadashi',
  11, -- Govinda
  'krishna',
  'Ṣaṭ-tilā Ekādaśī',
  'Шат-тіла Екадаші',
  'Sat-tila Ekadashi',
  'Слава Шат-тіла Екадаші',
  'The Glory of Sat-tila Ekadashi',
  'Шат-тіла означає "шість кунжутів". У цей день слід використовувати кунжут шістьма способами: їсти, давати в дар, використовувати для обмивання, використовувати у вогняних жертвоприношеннях, пропонувати предкам та натирати тіло.',
  'Sat-tila means "six sesame seeds". On this day one should use sesame seeds in six ways: eating, giving in charity, bathing, fire sacrifice, offering to ancestors, and anointing the body.',
  'Padma Purana, Uttara-khanda, Chapter 42',
  'Господь Вішну',
  'Lord Vishnu',
  'Шестикратні благословення, очищення, добробут',
  'Sixfold blessings, purification, prosperity',
  'Повний піст від зерна та бобових. Використання кунжуту шістьма способами.',
  'Complete fast from grains and beans. Use of sesame in six ways.',
  'After sunrise on Dvadashi',
  false,
  21
),

(
  'jaya-ekadashi',
  11, -- Govinda
  'shukla',
  'Jayā Ekādaśī',
  'Джая Екадаші',
  'Jaya Ekadashi',
  'Слава Джая Екадаші',
  'The Glory of Jaya Ekadashi',
  'Джая означає "перемога". Цей екадаші дарує перемогу над ворогами, як зовнішніми, так і внутрішніми (похіть, гнів, жадібність тощо). Історія Малявана та Пушпаваті.',
  'Jaya means "victory". This Ekadashi grants victory over enemies, both external and internal (lust, anger, greed, etc.). The story of Malyavan and Pushpavati.',
  'Padma Purana, Uttara-khanda, Chapter 43',
  'Господь Вішну',
  'Lord Vishnu',
  'Перемога над ворогами та анартхами, духовна сила',
  'Victory over enemies and anarthas, spiritual strength',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  22
),

-- ============================================
-- Month 12: Viṣṇu (Phalguna)
-- ============================================

(
  'vijaya-ekadashi',
  12, -- Viṣṇu
  'krishna',
  'Vijayā Ekādaśī',
  'Віджая Екадаші',
  'Vijaya Ekadashi',
  'Слава Віджая Екадаші',
  'The Glory of Vijaya Ekadashi',
  'Віджая означає "особлива перемога". Господь Рама дотримувався цього екадаші перед будівництвом мосту на Ланку та перемогою над Раваною. Дарує перемогу в найскладніших ситуаціях.',
  'Vijaya means "special victory". Lord Rama observed this Ekadashi before building the bridge to Lanka and defeating Ravana. Grants victory in the most difficult situations.',
  'Padma Purana, Uttara-khanda, Chapter 44',
  'Господь Рама',
  'Lord Rama',
  'Особлива перемога, успіх у важких починаннях, благословення Господа Рами',
  'Special victory, success in difficult endeavors, blessings of Lord Rama',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  23
),

(
  'amalaki-ekadashi',
  12, -- Viṣṇu
  'shukla',
  'Āmalakī Ekādaśī',
  'Амалакі Екадаші',
  'Amalaki Ekadashi',
  'Слава Амалакі Екадаші',
  'The Glory of Amalaki Ekadashi',
  'Амалакі - це священне дерево (індійський аґрус), в якому мешкає Господь Вішну. У цей день слід поклонятися дереву амалакі та обходити його. Історія царя Чайтраратхи.',
  'Amalaki is the sacred tree (Indian gooseberry) in which Lord Vishnu resides. On this day one should worship and circumambulate the amalaki tree. The story of King Chaitraratha.',
  'Padma Purana, Uttara-khanda, Chapter 45',
  'Господь Вішну в дереві Амалакі',
  'Lord Vishnu in the Amalaki tree',
  'Благословення Амалакі, здоров''я, довголіття, духовний прогрес',
  'Blessings of Amalaki, health, longevity, spiritual progress',
  'Повний піст від зерна та бобових. Поклоніння дереву Амалакі.',
  'Complete fast from grains and beans. Worship of the Amalaki tree.',
  'After sunrise on Dvadashi',
  false,
  24
),

-- ============================================
-- ADHIKA MASA (Leap Month) - 2 additional Ekadashis
-- ============================================

(
  'padmini-ekadashi',
  NULL, -- Adhika masa (no fixed month)
  'shukla',
  'Padminī Ekādaśī',
  'Падміні Екадаші',
  'Padmini Ekadashi',
  'Слава Падміні Екадаші (Адхіка Шукла)',
  'The Glory of Padmini Ekadashi (Adhika Shukla)',
  'Падміні екадаші випадає на світлу половину додаткового місяця (адхіка маса), який трапляється раз на 2-3 роки. Заслуга цього екадаші особлива, бо адхіка маса вважається дуже священним.',
  'Padmini Ekadashi falls on the bright fortnight of the extra month (adhika masa), which occurs once every 2-3 years. The merit of this Ekadashi is special because adhika masa is considered very sacred.',
  'Padma Purana, Uttara-khanda, Chapter 46',
  'Господь Вішну',
  'Lord Vishnu',
  'Особлива заслуга адхіка маси, духовне очищення, благословення',
  'Special merit of adhika masa, spiritual purification, blessings',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  25
),

(
  'parama-ekadashi',
  NULL, -- Adhika masa (no fixed month)
  'krishna',
  'Paramā Ekādaśī',
  'Парама Екадаші',
  'Parama Ekadashi',
  'Слава Парама Екадаші (Адхіка Крішна)',
  'The Glory of Parama Ekadashi (Adhika Krishna)',
  'Парама означає "найвищий". Цей екадаші випадає на темну половину додаткового місяця. Господь Крішна особисто описав славу цього екадаші Арджуні. Заслуга дуже велика.',
  'Parama means "supreme". This Ekadashi falls on the dark fortnight of the extra month. Lord Krishna personally described the glory of this Ekadashi to Arjuna. The merit is very great.',
  'Padma Purana, Uttara-khanda, Chapter 47',
  'Господь Крішна',
  'Lord Krishna',
  'Найвища заслуга, духовне очищення, особливі благословення',
  'Supreme merit, spiritual purification, special blessings',
  'Повний піст від зерна та бобових.',
  'Complete fast from grains and beans.',
  'After sunrise on Dvadashi',
  false,
  26
)

ON CONFLICT (slug) DO UPDATE SET
  name_uk = EXCLUDED.name_uk,
  name_en = EXCLUDED.name_en,
  glory_title_uk = EXCLUDED.glory_title_uk,
  glory_title_en = EXCLUDED.glory_title_en,
  glory_text_uk = EXCLUDED.glory_text_uk,
  glory_text_en = EXCLUDED.glory_text_en,
  glory_source = EXCLUDED.glory_source,
  presiding_deity_uk = EXCLUDED.presiding_deity_uk,
  presiding_deity_en = EXCLUDED.presiding_deity_en,
  benefits_uk = EXCLUDED.benefits_uk,
  benefits_en = EXCLUDED.benefits_en,
  fasting_rules_uk = EXCLUDED.fasting_rules_uk,
  fasting_rules_en = EXCLUDED.fasting_rules_en,
  breaking_fast_time = EXCLUDED.breaking_fast_time,
  is_major = EXCLUDED.is_major,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

COMMIT;
