-- Simplify Ukrainian names (remove diacritics for readability)
-- Rules: th → тх, g → ґ, ṛ → і (in names), bh → бг, c → ч

BEGIN;

-- ============================================================================
-- FIX AUTHORS - SIMPLIFIED UKRAINIAN NAMES
-- ============================================================================

-- Founders (Pancha-tattva)
UPDATE gv_authors SET
  name_ua = 'Шрі Чайтанья Махапрабгу',
  title_ua = 'Махапрабгу'
WHERE slug = 'chaitanya-mahaprabhu';

UPDATE gv_authors SET
  name_ua = 'Шрі Нітьянанда Прабгу',
  title_ua = 'Прабгу'
WHERE slug = 'nityananda-prabhu';

UPDATE gv_authors SET
  name_ua = 'Шрі Адвайта Ачарья',
  title_ua = 'Ачарья'
WHERE slug = 'advaita-acharya';

UPDATE gv_authors SET
  name_ua = 'Шрі Ґададгара Пандіт',
  title_ua = 'Пандіт'
WHERE slug = 'gadadhara-pandita';

UPDATE gv_authors SET
  name_ua = 'Шріваса Тхакур',
  title_ua = 'Тхакур'
WHERE slug = 'srivasa-thakura';

UPDATE gv_authors SET
  name_ua = 'Шріла Харідаса Тхакур',
  title_ua = 'Тхакур'
WHERE slug = 'haridasa-thakura';

UPDATE gv_authors SET
  name_ua = 'Шріла Сварупа Дамодара Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'svarupa-damodara';

UPDATE gv_authors SET
  name_ua = 'Шрі Рамананда Рая'
WHERE slug = 'ramananda-raya';

UPDATE gv_authors SET
  name_ua = 'Шрі Пундаріка Відьянідгі'
WHERE slug = 'pundarika-vidyanidhi';

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
  name_ua = 'Шріла Раґхунатха Даса Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'raghunatha-dasa-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шріла Раґхунатха Бхатта Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'raghunatha-bhatta-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шріла Ґопала Бхатта Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'gopala-bhatta-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шріла Локанатха Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'lokanatha-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шріла Бхуґарбха Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'bhugarbha-gosvami';

-- Later Acharyas
UPDATE gv_authors SET
  name_ua = 'Шріла Крішнадаса Кавіраджа',
  title_ua = 'Кавіраджа'
WHERE slug = 'krishnadasa-kaviraja';

UPDATE gv_authors SET
  name_ua = 'Шріла Вріндавана Даса Тхакур',
  title_ua = 'Тхакур'
WHERE slug = 'vrindavana-dasa-thakura';

UPDATE gv_authors SET
  name_ua = 'Шріла Нароттама Даса Тхакур',
  title_ua = 'Тхакур'
WHERE slug = 'narottama-dasa-thakura';

UPDATE gv_authors SET
  name_ua = 'Шріла Вішванатха Чакраварті Тхакур',
  title_ua = 'Тхакур'
WHERE slug = 'visvanatha-chakravarti';

UPDATE gv_authors SET
  name_ua = 'Шріла Баладева Відьябхушана',
  title_ua = 'Відьябхушана'
WHERE slug = 'baladeva-vidyabhushana';

UPDATE gv_authors SET
  name_ua = 'Шріла Каві Карнапура'
WHERE slug = 'kavi-karnapura';

UPDATE gv_authors SET
  name_ua = 'Шріла Прабодхананда Сарасваті'
WHERE slug = 'prabodhanananda-sarasvati';

UPDATE gv_authors SET
  name_ua = 'Шріла Шьяманада Прабгу',
  title_ua = 'Прабгу'
WHERE slug = 'shyamananda-prabhu';

UPDATE gv_authors SET
  name_ua = 'Шріла Шрініваса Ачарья',
  title_ua = 'Ачарья'
WHERE slug = 'srinivasa-acharya';

-- Modern Acharyas
UPDATE gv_authors SET
  name_ua = 'Шріла Бхактівінода Тхакур',
  title_ua = 'Тхакур'
WHERE slug = 'bhaktivinoda-thakura';

UPDATE gv_authors SET
  name_ua = 'Шріла Ґауракішора Даса Бабаджі',
  title_ua = 'Бабаджі'
WHERE slug = 'gaurakisora-dasa-babaji';

UPDATE gv_authors SET
  name_ua = 'Шріла Бхактісіддханта Сарасваті Тхакур',
  title_ua = 'Тхакур'
WHERE slug = 'bhaktisiddhanta-sarasvati';

UPDATE gv_authors SET
  name_ua = 'Шріла А.Ч. Бхактіведанта Свамі Прабгупада',
  title_ua = 'Прабгупада'
WHERE slug = 'bhaktivedanta-swami-prabhupada';

-- Prabhupada's disciples
UPDATE gv_authors SET
  name_ua = 'Сатсварупа Даса Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'satsvarupa-dasa-goswami';

UPDATE gv_authors SET
  name_ua = 'Ґопіпаранадхана Даса'
WHERE slug = 'gopiparanadhana-dasa';

UPDATE gv_authors SET
  name_ua = 'Хрідаянанда Даса Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'hridayananda-dasa-goswami';

UPDATE gv_authors SET
  name_ua = 'Шіварама Свамі',
  title_ua = 'Свамі'
WHERE slug = 'sivarama-swami';

UPDATE gv_authors SET
  name_ua = 'Бхакті Тіртха Свамі',
  title_ua = 'Свамі'
WHERE slug = 'bhakti-tirtha-swami';

UPDATE gv_authors SET
  name_ua = 'Радханатха Свамі',
  title_ua = 'Свамі'
WHERE slug = 'radhanatha-swami';

UPDATE gv_authors SET
  name_ua = 'Бхакті Вікаша Свамі',
  title_ua = 'Свамі'
WHERE slug = 'bhakti-vikasa-swami';

UPDATE gv_authors SET
  name_ua = 'Сачінандана Свамі',
  title_ua = 'Свамі'
WHERE slug = 'sacinandana-swami';

UPDATE gv_authors SET
  name_ua = 'Бхану Свамі',
  title_ua = 'Свамі'
WHERE slug = 'bhanu-swami';

UPDATE gv_authors SET
  name_ua = 'Джаядвайта Свамі',
  title_ua = 'Свамі'
WHERE slug = 'jayadvaita-swami';

UPDATE gv_authors SET
  name_ua = 'Дханурдхара Свамі',
  title_ua = 'Свамі'
WHERE slug = 'dhanurdhara-swami';

UPDATE gv_authors SET
  name_ua = 'Девамріта Свамі',
  title_ua = 'Свамі'
WHERE slug = 'devamrita-swami';

UPDATE gv_authors SET
  name_ua = 'Тамала Крішна Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'tamal-krishna-goswami';

UPDATE gv_authors SET
  name_ua = 'Ґірірадж Свамі',
  title_ua = 'Свамі'
WHERE slug = 'giriraj-swami';

UPDATE gv_authors SET
  name_ua = 'Індрадьюмна Свамі',
  title_ua = 'Свамі'
WHERE slug = 'indradyumna-swami';

UPDATE gv_authors SET
  name_ua = 'Джаяпатака Свамі',
  title_ua = 'Свамі'
WHERE slug = 'jayapataka-swami';

UPDATE gv_authors SET
  name_ua = 'Бхакті Чару Свамі',
  title_ua = 'Свамі'
WHERE slug = 'bhakti-charu-swami';

UPDATE gv_authors SET
  name_ua = 'Бір Крішна Даса Ґосвамі',
  title_ua = 'Ґосвамі'
WHERE slug = 'bir-krishna-das-goswami';

UPDATE gv_authors SET
  name_ua = 'Урміла Деві Дасі'
WHERE slug = 'urmila-devi-dasi';

UPDATE gv_authors SET
  name_ua = 'Бхуріджана Даса'
WHERE slug = 'bhurijan-dasa';

UPDATE gv_authors SET
  name_ua = 'Крішна-кшетра Свамі',
  title_ua = 'Свамі'
WHERE slug = 'krishna-kshetra-swami';

-- ============================================================================
-- FIX BOOK TITLES - SIMPLIFIED UKRAINIAN
-- ============================================================================

-- Foundational
UPDATE gv_book_references SET title_ua = 'Бгаґавад-ґіта (Пісня Бога)' WHERE slug = 'bhagavad-gita';
UPDATE gv_book_references SET title_ua = 'Шрімад-Бгаґаватам (Прекрасна оповідь про Бога)' WHERE slug = 'srimad-bhagavatam';
UPDATE gv_book_references SET title_ua = 'Шрі Ішопанішад' WHERE slug = 'sri-isopanishad';
UPDATE gv_book_references SET title_ua = 'Брахма-самхіта' WHERE slug = 'brahma-samhita';
UPDATE gv_book_references SET title_ua = 'Веданта-сутра' WHERE slug = 'vedanta-sutra';
UPDATE gv_book_references SET title_ua = 'Шікшаштакам (Вісім настанов)' WHERE slug = 'siksastakam';

-- Rupa Gosvami
UPDATE gv_book_references SET title_ua = 'Бхакті-расамріта-сіндху (Океан нектару відданості)' WHERE slug = 'bhakti-rasamrta-sindhu';
UPDATE gv_book_references SET title_ua = 'Уджвала-ніламані (Сяючий сапфір)' WHERE slug = 'ujjvala-nilamani';
UPDATE gv_book_references SET title_ua = 'Упадешамріта (Нектар настанов)' WHERE slug = 'upadesamrta';
UPDATE gv_book_references SET title_ua = 'Відаґдха-мадхава' WHERE slug = 'vidagdha-madhava';
UPDATE gv_book_references SET title_ua = 'Лаліта-мадхава' WHERE slug = 'lalita-madhava';
UPDATE gv_book_references SET title_ua = 'Става-мала (Гірлянда молитов)' WHERE slug = 'stavamala';
UPDATE gv_book_references SET title_ua = 'Лаґху-бгаґаватамріта (Малий нектар Бгаґавати)' WHERE slug = 'laghu-bhagavatamrta';
UPDATE gv_book_references SET title_ua = 'Падьявалі (Збірка віршів)' WHERE slug = 'padyavali';
UPDATE gv_book_references SET title_ua = 'Дана-келі-каумуді' WHERE slug = 'dana-keli-kaumudi';
UPDATE gv_book_references SET title_ua = 'Хамса-дута (Лебідь-посланець)' WHERE slug = 'hamsaduta';
UPDATE gv_book_references SET title_ua = 'Уддхава-сандеша (Послання Уддхаві)' WHERE slug = 'uddhava-sandesa';
UPDATE gv_book_references SET title_ua = 'Матхура-махатмья (Слава Матхури)' WHERE slug = 'mathura-mahatmya';

-- Sanatana Gosvami
UPDATE gv_book_references SET title_ua = 'Бріхад-бгаґаватамріта (Великий нектар Бгаґавати)' WHERE slug = 'brihad-bhagavatamrta';
UPDATE gv_book_references SET title_ua = 'Харі-бхакті-віласа (Ігри відданості Харі)' WHERE slug = 'hari-bhakti-vilasa';
UPDATE gv_book_references SET title_ua = 'Дашама-тіппані (Нотатки до Десятої пісні)' WHERE slug = 'dasama-tippani';
UPDATE gv_book_references SET title_ua = 'Крішна-ліла-става (Молитви, що прославляють ігри Крішни)' WHERE slug = 'krishna-lila-stava';

-- Jiva Gosvami (Sandarbhas)
UPDATE gv_book_references SET title_ua = 'Таттва-сандарбха (Есе про істину)' WHERE slug = 'tattva-sandarbha';
UPDATE gv_book_references SET title_ua = 'Бгаґават-сандарбха (Есе про Верховну Особу)' WHERE slug = 'bhagavat-sandarbha';
UPDATE gv_book_references SET title_ua = 'Параматма-сандарбха (Есе про Наддушу)' WHERE slug = 'paramatma-sandarbha';
UPDATE gv_book_references SET title_ua = 'Крішна-сандарбха (Есе про Крішну)' WHERE slug = 'krishna-sandarbha';
UPDATE gv_book_references SET title_ua = 'Бхакті-сандарбха (Есе про відданість)' WHERE slug = 'bhakti-sandarbha';
UPDATE gv_book_references SET title_ua = 'Пріті-сандарбха (Есе про божественну любов)' WHERE slug = 'priti-sandarbha';
UPDATE gv_book_references SET title_ua = 'Ґопала-чампу' WHERE slug = 'gopala-champu';
UPDATE gv_book_references SET title_ua = 'Крама-сандарбха (Послідовний коментар)' WHERE slug = 'krama-sandarbha';
UPDATE gv_book_references SET title_ua = 'Сарва-самвадіні (Узгоджувач усього)' WHERE slug = 'sarva-samvadini';
UPDATE gv_book_references SET title_ua = 'Мадхава-махотсава (Великий фестиваль Мадхави)' WHERE slug = 'madhava-mahotsava';
UPDATE gv_book_references SET title_ua = 'Санкалпа-калпадрума (Дерево бажань медитації)' WHERE slug = 'sankalpa-kalpadruma';

-- Raghunatha Dasa Gosvami
UPDATE gv_book_references SET title_ua = 'Вілапа-кусуманджалі (Квіткова жертва скорботи)' WHERE slug = 'vilapa-kusumanjali';
UPDATE gv_book_references SET title_ua = 'Стававалі (Збірка молитов)' WHERE slug = 'stavavali';
UPDATE gv_book_references SET title_ua = 'Манах-шікша (Настанови розуму)' WHERE slug = 'manah-siksa';
UPDATE gv_book_references SET title_ua = 'Мукта-чаріта (Життя звільненого)' WHERE slug = 'muktacarita';
UPDATE gv_book_references SET title_ua = 'Дана-чаріта (Ліла збирання податків)' WHERE slug = 'dana-carita';
UPDATE gv_book_references SET title_ua = 'Сва-ніяма-дашакам (Десять віршів про мої обітниці)' WHERE slug = 'sva-niyama-dasakam';

-- Gopala Bhatta Gosvami
UPDATE gv_book_references SET title_ua = 'Сат-крія-сара-діпіка (Світильник основних обрядів)' WHERE slug = 'sat-kriya-sara-dipika';

-- Biographies
UPDATE gv_book_references SET title_ua = 'Шрі Чайтанья-чарітамріта (Нектар життя Чайтаньї)' WHERE slug = 'chaitanya-charitamrita';
UPDATE gv_book_references SET title_ua = 'Шрі Чайтанья Бгаґавата' WHERE slug = 'chaitanya-bhagavata';

-- Narottama Dasa Thakura
UPDATE gv_book_references SET title_ua = 'Прартхана (Молитви)' WHERE slug = 'prarthana';
UPDATE gv_book_references SET title_ua = 'Према-бхакті-чандріка (Місячні промені любовної відданості)' WHERE slug = 'prema-bhakti-chandrika';

-- Visvanatha Chakravarti
UPDATE gv_book_references SET title_ua = 'Мадхурья-кадамбіні (Хмара солодощів)' WHERE slug = 'madhurya-kadambini';
UPDATE gv_book_references SET title_ua = 'Раґа-вартма-чандріка (Місячне світло на шляху раґи)' WHERE slug = 'raga-vartma-chandrika';
UPDATE gv_book_references SET title_ua = 'Сарартха-даршіні (Відкривач суттєвого значення)' WHERE slug = 'sarartha-darshini';
UPDATE gv_book_references SET title_ua = 'Ґіта-бхушана (Окраса Ґіти)' WHERE slug = 'gita-bhusana';
UPDATE gv_book_references SET title_ua = 'Уджвала-ніламані-кірана (Промені Уджвала-ніламані)' WHERE slug = 'ujjvala-nilamani-kirana';
UPDATE gv_book_references SET title_ua = 'Кшанада-ґіта-чінтамані' WHERE slug = 'ksanada-gita-cintamani';

-- Baladeva Vidyabhushana
UPDATE gv_book_references SET title_ua = 'Ґовінда-бхашья (Коментар на ім''я Ґовінди)' WHERE slug = 'govinda-bhashya';
UPDATE gv_book_references SET title_ua = 'Прамея-ратнавалі (Гірлянда філософських коштовностей)' WHERE slug = 'prameya-ratnavali';
UPDATE gv_book_references SET title_ua = 'Сіддханта-ратна (Коштовність висновків)' WHERE slug = 'siddhanta-ratna';
UPDATE gv_book_references SET title_ua = 'Ґіта-бхушана (Баладева)' WHERE slug = 'gita-bhushana-baladeva';

-- Bhaktivinoda Thakura
UPDATE gv_book_references SET title_ua = 'Джайва-дхарма (Релігія душі)' WHERE slug = 'jaiva-dharma';
UPDATE gv_book_references SET title_ua = 'Харінама-чінтамані (Філософський камінь святого імені)' WHERE slug = 'harinama-cintamani';
UPDATE gv_book_references SET title_ua = 'Бхаджана-рахасья (Таємниці девоційної практики)' WHERE slug = 'bhajana-rahasya';
UPDATE gv_book_references SET title_ua = 'Шрі Чайтанья-шікшамріта (Нектар вчень Чайтаньї)' WHERE slug = 'sri-chaitanya-siksamrta';
UPDATE gv_book_references SET title_ua = 'Навадвіпа-дхама-махатмья (Слава Навадвіпи)' WHERE slug = 'navadvipa-dhama-mahatmya';
UPDATE gv_book_references SET title_ua = 'Крішна-самхіта (Збірка про Крішну)' WHERE slug = 'krishna-samhita';
UPDATE gv_book_references SET title_ua = 'Таттва-сутра (Афоризми про істину)' WHERE slug = 'tattva-sutra';
UPDATE gv_book_references SET title_ua = 'Таттва-вівека (Розрізнення істини)' WHERE slug = 'tattva-viveka';
UPDATE gv_book_references SET title_ua = 'Амная-сутра (Афоризми традиції)' WHERE slug = 'amnaya-sutra';
UPDATE gv_book_references SET title_ua = 'Шаранаґаті (Віддання)' WHERE slug = 'saranagati';
UPDATE gv_book_references SET title_ua = 'Ґітавалі (Збірка пісень)' WHERE slug = 'gitavali';
UPDATE gv_book_references SET title_ua = 'Ґіта-мала (Гірлянда пісень)' WHERE slug = 'gita-mala';
UPDATE gv_book_references SET title_ua = 'Кальяна-калпатару (Дерево бажань благодаті)' WHERE slug = 'kalyana-kalpataru';
UPDATE gv_book_references SET title_ua = 'Баула-санґіта (Пісні мандрівного відданого)' WHERE slug = 'baula-sangita';
UPDATE gv_book_references SET title_ua = 'Датта-каустубха' WHERE slug = 'datta-kaustubha';
UPDATE gv_book_references SET title_ua = 'Према-прадіпа (Світильник божественної любові)' WHERE slug = 'prema-pradipa';
UPDATE gv_book_references SET title_ua = 'Харі-бхакті-калпа-латіка (Ліана бажань відданості Харі)' WHERE slug = 'hari-bhakti-kalpa-latika';
UPDATE gv_book_references SET title_ua = 'Вайшнава-сіддханта-мала (Гірлянда вайшнавських висновків)' WHERE slug = 'vaishnava-siddhanta-mala';
UPDATE gv_book_references SET title_ua = 'Бгаґавад-арка-марічі-мала (Гірлянда променів із сонця Бгаґавад-ґіти)' WHERE slug = 'bhagavad-arka-marici-mala';
UPDATE gv_book_references SET title_ua = 'Шрі Чайтанья Махапрабгу: Його життя і вчення' WHERE slug = 'chaitanya-mahaprabhu-his-life-and-precepts';

-- Bhaktisiddhanta Sarasvati
UPDATE gv_book_references SET title_ua = 'Брахмана і Вайшнав' WHERE slug = 'brahmana-o-vaishnava';
UPDATE gv_book_references SET title_ua = 'Упакхьяне Упадеша (Вчення через історії)' WHERE slug = 'upakhyane-upadesa';
UPDATE gv_book_references SET title_ua = 'Пракріта-раса-шата-душіні (Сто недоліків мирської раси)' WHERE slug = 'prakrita-rasa-sata-dushini';
UPDATE gv_book_references SET title_ua = 'Анубхашья (Послідовний коментар)' WHERE slug = 'anubhashya';
UPDATE gv_book_references SET title_ua = 'Хто такий вайшнав?' WHERE slug = 'vaishnava-ke';
UPDATE gv_book_references SET title_ua = 'Амріта-праваха-бхашья (Коментар, що тече нектаром)' WHERE slug = 'amrta-pravaha-bhasya';
UPDATE gv_book_references SET title_ua = 'Вчення Шрі Чайтаньї' WHERE slug = 'sri-chaitanyas-teachings';

-- Prabhupada - Major works
UPDATE gv_book_references SET title_ua = 'Бгаґавад-ґіта як вона є' WHERE slug = 'bhagavad-gita-as-it-is';
UPDATE gv_book_references SET title_ua = 'Шрімад-Бгаґаватам' WHERE slug = 'srimad-bhagavatam-prabhupada';
UPDATE gv_book_references SET title_ua = 'Шрі Чайтанья-чарітамріта' WHERE slug = 'chaitanya-charitamrita-prabhupada';
UPDATE gv_book_references SET title_ua = 'Нектар відданості' WHERE slug = 'nectar-of-devotion';
UPDATE gv_book_references SET title_ua = 'Нектар настанов' WHERE slug = 'nectar-of-instruction';
UPDATE gv_book_references SET title_ua = 'Шрі Ішопанішад' WHERE slug = 'sri-isopanisad-prabhupada';
UPDATE gv_book_references SET title_ua = 'Вчення Господа Чайтаньї' WHERE slug = 'teachings-of-lord-chaitanya';
UPDATE gv_book_references SET title_ua = 'Крішна, Верховна Особистість Бога' WHERE slug = 'krishna-book';
UPDATE gv_book_references SET title_ua = 'Вчення Господа Капіли, сина Девахуті' WHERE slug = 'teachings-of-lord-kapila';
UPDATE gv_book_references SET title_ua = 'Вчення цариці Кунті' WHERE slug = 'teachings-of-queen-kunti';
UPDATE gv_book_references SET title_ua = 'Брахма-самхіта' WHERE slug = 'brahma-samhita-prabhupada';

-- Prabhupada - Small books
UPDATE gv_book_references SET title_ua = 'Легка подорож на інші планети' WHERE slug = 'easy-journey-to-other-planets';
UPDATE gv_book_references SET title_ua = 'Наука самоусвідомлення' WHERE slug = 'science-of-self-realization';
UPDATE gv_book_references SET title_ua = 'За межами народження і смерті' WHERE slug = 'beyond-birth-and-death';
UPDATE gv_book_references SET title_ua = 'Досконалі питання, досконалі відповіді' WHERE slug = 'perfect-questions-perfect-answers';
UPDATE gv_book_references SET title_ua = 'Раджа-відья: Цар знання' WHERE slug = 'raja-vidya';
UPDATE gv_book_references SET title_ua = 'Піднесення до свідомості Крішни' WHERE slug = 'elevation-to-krishna-consciousness';
UPDATE gv_book_references SET title_ua = 'Свідомість Крішни: Найвища система йоґи' WHERE slug = 'krishna-consciousness-topmost-yoga';
UPDATE gv_book_references SET title_ua = 'Неперевершений дар' WHERE slug = 'matchless-gift';
UPDATE gv_book_references SET title_ua = 'Шлях досконалості' WHERE slug = 'path-of-perfection';
UPDATE gv_book_references SET title_ua = 'Подорож самопізнання' WHERE slug = 'journey-of-self-discovery';
UPDATE gv_book_references SET title_ua = 'Життя походить від життя' WHERE slug = 'life-comes-from-life';
UPDATE gv_book_references SET title_ua = 'Послання Бога' WHERE slug = 'message-of-godhead';
UPDATE gv_book_references SET title_ua = 'Зречення через мудрість' WHERE slug = 'renunciation-through-wisdom';
UPDATE gv_book_references SET title_ua = 'Повернення' WHERE slug = 'coming-back';
UPDATE gv_book_references SET title_ua = 'Вищий смак' WHERE slug = 'higher-taste';
UPDATE gv_book_references SET title_ua = 'Цивілізація і трансценденція' WHERE slug = 'civilization-and-transcendence';
UPDATE gv_book_references SET title_ua = 'Закони природи' WHERE slug = 'laws-of-nature';
UPDATE gv_book_references SET title_ua = 'Світло Бгаґавати' WHERE slug = 'light-of-bhagavata';
UPDATE gv_book_references SET title_ua = 'Крішна, резервуар насолоди' WHERE slug = 'krsna-the-reservoir-of-pleasure';
UPDATE gv_book_references SET title_ua = 'Досконалість йоґи' WHERE slug = 'perfection-of-yoga';
UPDATE gv_book_references SET title_ua = 'Нарада-бхакті-сутра' WHERE slug = 'narada-bhakti-sutra-prabhupada';
UPDATE gv_book_references SET title_ua = 'Мукунда-мала-стотра' WHERE slug = 'mukunda-mala-stotra-prabhupada';

-- Disciples' works
UPDATE gv_book_references SET title_ua = 'Шріла Прабгупада-лілямріта' WHERE slug = 'srila-prabhupada-lilamrta';
UPDATE gv_book_references SET title_ua = 'Нектар Прабгупади' WHERE slug = 'prabhupada-nectar';
UPDATE gv_book_references SET title_ua = 'Реформа читання' WHERE slug = 'reading-reform';
UPDATE gv_book_references SET title_ua = 'Бріхад-бгаґаватамріта (Переклад)' WHERE slug = 'brihad-bhagavatamrta-translation';
UPDATE gv_book_references SET title_ua = 'Бхакті-сандарбха (Переклад)' WHERE slug = 'sri-bhakti-sandarbha-translation';
UPDATE gv_book_references SET title_ua = 'На Парайє ''хам' WHERE slug = 'na-paraye-ham';
UPDATE gv_book_references SET title_ua = 'Шуддха-бхакті-чінтамані' WHERE slug = 'suddha-bhakti-cintamani';
UPDATE gv_book_references SET title_ua = 'Вену-ґіта' WHERE slug = 'venu-gita';
UPDATE gv_book_references SET title_ua = 'Шікша поза ІСКОН?' WHERE slug = 'siksa-outside-iskcon';
UPDATE gv_book_references SET title_ua = 'Духовний воїн I' WHERE slug = 'spiritual-warrior-1';
UPDATE gv_book_references SET title_ua = 'Духовний воїн II' WHERE slug = 'spiritual-warrior-2';
UPDATE gv_book_references SET title_ua = 'Духовний воїн III' WHERE slug = 'spiritual-warrior-3';
UPDATE gv_book_references SET title_ua = 'Духовний воїн IV' WHERE slug = 'spiritual-warrior-4';
UPDATE gv_book_references SET title_ua = 'Духовний воїн V' WHERE slug = 'spiritual-warrior-5';
UPDATE gv_book_references SET title_ua = 'Духовний воїн VI' WHERE slug = 'spiritual-warrior-6';
UPDATE gv_book_references SET title_ua = 'Вмерти перед смертю' WHERE slug = 'die-before-dying';
UPDATE gv_book_references SET title_ua = 'Подорож додому' WHERE slug = 'journey-home';
UPDATE gv_book_references SET title_ua = 'Подорож усередину' WHERE slug = 'journey-within';
UPDATE gv_book_references SET title_ua = 'Шрі Бхактісіддханта Вайбхава' WHERE slug = 'sri-bhaktisiddhanta-vaibhava';
UPDATE gv_book_references SET title_ua = 'Погляд на традиційне індійське життя' WHERE slug = 'glimpses-traditional-indian-life';
UPDATE gv_book_references SET title_ua = 'Патропадеша' WHERE slug = 'patropadesha';
UPDATE gv_book_references SET title_ua = 'Мої спогади про Шрілу Прабгупаду' WHERE slug = 'my-memories-of-srila-prabhupada';
UPDATE gv_book_references SET title_ua = 'Про сміливу проповідь у служінні Шрілі Прабгупаді' WHERE slug = 'gaudiya-vaishnava-smriti';
UPDATE gv_book_references SET title_ua = 'Нектарний океан святого імені' WHERE slug = 'nectarean-ocean-holy-name';
UPDATE gv_book_references SET title_ua = 'Живе ім''я' WHERE slug = 'living-name';
UPDATE gv_book_references SET title_ua = 'Чудовий світ святого імені' WHERE slug = 'wonderful-world-of-the-holy-name';
UPDATE gv_book_references SET title_ua = 'Шат-сандарбха (Повний переклад)' WHERE slug = 'sat-sandarbha-translation';
UPDATE gv_book_references SET title_ua = 'Мадхурья-кадамбіні (Переклад)' WHERE slug = 'madhurya-kadambini-translation';
UPDATE gv_book_references SET title_ua = 'Хвилі відданості' WHERE slug = 'waves-of-devotion';
UPDATE gv_book_references SET title_ua = 'Прикрашаючи землю' WHERE slug = 'gracing-the-earth';
UPDATE gv_book_references SET title_ua = 'У пошуках ведичної Індії' WHERE slug = 'searching-for-vedic-india';
UPDATE gv_book_references SET title_ua = 'Міський вайшнавський спосіб життя' WHERE slug = 'perfect-encyclopedic-encyclopedia-of-perfect-encyclopedias';

-- Additional books
UPDATE gv_book_references SET title_ua = 'Ґаура-ґаноддеша-діпіка' WHERE slug = 'gaura-ganoddesa-dipika';
UPDATE gv_book_references SET title_ua = 'Чайтанья-чандрамріта' WHERE slug = 'caitanya-candramrita';
UPDATE gv_book_references SET title_ua = 'Радха-раса-судха-нідхі' WHERE slug = 'radha-rasa-sudha-nidhi';
UPDATE gv_book_references SET title_ua = 'Вріндавана-махімамріта' WHERE slug = 'vrindavana-mahimamrta';
UPDATE gv_book_references SET title_ua = 'Щоденник мандрівного проповідника' WHERE slug = 'diary-traveling-preacher';
UPDATE gv_book_references SET title_ua = 'Слуга слуги' WHERE slug = 'servant-of-servant';
UPDATE gv_book_references SET title_ua = 'Щоденник ТКҐ' WHERE slug = 'tkg-diary';
UPDATE gv_book_references SET title_ua = 'Багато місяців' WHERE slug = 'many-moons';
UPDATE gv_book_references SET title_ua = 'Віддайся Мені' WHERE slug = 'surrender-unto-me';

COMMIT;
