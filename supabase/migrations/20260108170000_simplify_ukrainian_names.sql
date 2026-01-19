-- Simplify Ukrainian names (remove diacritics for readability)
-- Rules: th → тх, g → ґ, ṛ → і (in names), bh → бг, c → ч

BEGIN;

-- ============================================================================
-- FIX AUTHORS - SIMPLIFIED UKRAINIAN NAMES
-- ============================================================================

-- Founders (Pancha-tattva)
UPDATE gv_authors SET
  name_uk = 'Шрі Чайтанья Махапрабгу',
  title_uk = 'Махапрабгу'
WHERE slug = 'chaitanya-mahaprabhu';

UPDATE gv_authors SET
  name_uk = 'Шрі Нітьянанда Прабгу',
  title_uk = 'Прабгу'
WHERE slug = 'nityananda-prabhu';

UPDATE gv_authors SET
  name_uk = 'Шрі Адвайта Ачарья',
  title_uk = 'Ачарья'
WHERE slug = 'advaita-acharya';

UPDATE gv_authors SET
  name_uk = 'Шрі Ґададгара Пандіт',
  title_uk = 'Пандіт'
WHERE slug = 'gadadhara-pandita';

UPDATE gv_authors SET
  name_uk = 'Шріваса Тхакур',
  title_uk = 'Тхакур'
WHERE slug = 'srivasa-thakura';

UPDATE gv_authors SET
  name_uk = 'Шріла Харідаса Тхакур',
  title_uk = 'Тхакур'
WHERE slug = 'haridasa-thakura';

UPDATE gv_authors SET
  name_uk = 'Шріла Сварупа Дамодара Ґосвамі',
  title_uk = 'Ґосвамі'
WHERE slug = 'svarupa-damodara';

UPDATE gv_authors SET
  name_uk = 'Шрі Рамананда Рая'
WHERE slug = 'ramananda-raya';

UPDATE gv_authors SET
  name_uk = 'Шрі Пундаріка Відьянідгі'
WHERE slug = 'pundarika-vidyanidhi';

-- Six Gosvamis
UPDATE gv_authors SET
  name_uk = 'Шріла Рупа Ґосвамі',
  title_uk = 'Ґосвамі'
WHERE slug = 'rupa-gosvami';

UPDATE gv_authors SET
  name_uk = 'Шріла Санатана Ґосвамі',
  title_uk = 'Ґосвамі'
WHERE slug = 'sanatana-gosvami';

UPDATE gv_authors SET
  name_uk = 'Шріла Джіва Ґосвамі',
  title_uk = 'Ґосвамі'
WHERE slug = 'jiva-gosvami';

UPDATE gv_authors SET
  name_uk = 'Шріла Раґхунатха Даса Ґосвамі',
  title_uk = 'Ґосвамі'
WHERE slug = 'raghunatha-dasa-gosvami';

UPDATE gv_authors SET
  name_uk = 'Шріла Раґхунатха Бхатта Ґосвамі',
  title_uk = 'Ґосвамі'
WHERE slug = 'raghunatha-bhatta-gosvami';

UPDATE gv_authors SET
  name_uk = 'Шріла Ґопала Бхатта Ґосвамі',
  title_uk = 'Ґосвамі'
WHERE slug = 'gopala-bhatta-gosvami';

UPDATE gv_authors SET
  name_uk = 'Шріла Локанатха Ґосвамі',
  title_uk = 'Ґосвамі'
WHERE slug = 'lokanatha-gosvami';

UPDATE gv_authors SET
  name_uk = 'Шріла Бхуґарбха Ґосвамі',
  title_uk = 'Ґосвамі'
WHERE slug = 'bhugarbha-gosvami';

-- Later Acharyas
UPDATE gv_authors SET
  name_uk = 'Шріла Крішнадаса Кавіраджа',
  title_uk = 'Кавіраджа'
WHERE slug = 'krishnadasa-kaviraja';

UPDATE gv_authors SET
  name_uk = 'Шріла Вріндавана Даса Тхакур',
  title_uk = 'Тхакур'
WHERE slug = 'vrindavana-dasa-thakura';

UPDATE gv_authors SET
  name_uk = 'Шріла Нароттама Даса Тхакур',
  title_uk = 'Тхакур'
WHERE slug = 'narottama-dasa-thakura';

UPDATE gv_authors SET
  name_uk = 'Шріла Вішванатха Чакраварті Тхакур',
  title_uk = 'Тхакур'
WHERE slug = 'visvanatha-chakravarti';

UPDATE gv_authors SET
  name_uk = 'Шріла Баладева Відьябхушана',
  title_uk = 'Відьябхушана'
WHERE slug = 'baladeva-vidyabhushana';

UPDATE gv_authors SET
  name_uk = 'Шріла Каві Карнапура'
WHERE slug = 'kavi-karnapura';

UPDATE gv_authors SET
  name_uk = 'Шріла Прабодхананда Сарасваті'
WHERE slug = 'prabodhanananda-sarasvati';

UPDATE gv_authors SET
  name_uk = 'Шріла Шьяманада Прабгу',
  title_uk = 'Прабгу'
WHERE slug = 'shyamananda-prabhu';

UPDATE gv_authors SET
  name_uk = 'Шріла Шрініваса Ачарья',
  title_uk = 'Ачарья'
WHERE slug = 'srinivasa-acharya';

-- Modern Acharyas
UPDATE gv_authors SET
  name_uk = 'Шріла Бхактівінода Тхакур',
  title_uk = 'Тхакур'
WHERE slug = 'bhaktivinoda-thakura';

UPDATE gv_authors SET
  name_uk = 'Шріла Ґауракішора Даса Бабаджі',
  title_uk = 'Бабаджі'
WHERE slug = 'gaurakisora-dasa-babaji';

UPDATE gv_authors SET
  name_uk = 'Шріла Бхактісіддханта Сарасваті Тхакур',
  title_uk = 'Тхакур'
WHERE slug = 'bhaktisiddhanta-sarasvati';

UPDATE gv_authors SET
  name_uk = 'Шріла А.Ч. Бхактіведанта Свамі Прабгупада',
  title_uk = 'Прабгупада'
WHERE slug = 'bhaktivedanta-swami-prabhupada';

-- Prabhupada's disciples
UPDATE gv_authors SET
  name_uk = 'Сатсварупа Даса Ґосвамі',
  title_uk = 'Ґосвамі'
WHERE slug = 'satsvarupa-dasa-goswami';

UPDATE gv_authors SET
  name_uk = 'Ґопіпаранадхана Даса'
WHERE slug = 'gopiparanadhana-dasa';

UPDATE gv_authors SET
  name_uk = 'Хрідаянанда Даса Ґосвамі',
  title_uk = 'Ґосвамі'
WHERE slug = 'hridayananda-dasa-goswami';

UPDATE gv_authors SET
  name_uk = 'Шіварама Свамі',
  title_uk = 'Свамі'
WHERE slug = 'sivarama-swami';

UPDATE gv_authors SET
  name_uk = 'Бхакті Тіртха Свамі',
  title_uk = 'Свамі'
WHERE slug = 'bhakti-tirtha-swami';

UPDATE gv_authors SET
  name_uk = 'Радханатха Свамі',
  title_uk = 'Свамі'
WHERE slug = 'radhanatha-swami';

UPDATE gv_authors SET
  name_uk = 'Бхакті Вікаша Свамі',
  title_uk = 'Свамі'
WHERE slug = 'bhakti-vikasa-swami';

UPDATE gv_authors SET
  name_uk = 'Сачінандана Свамі',
  title_uk = 'Свамі'
WHERE slug = 'sacinandana-swami';

UPDATE gv_authors SET
  name_uk = 'Бхану Свамі',
  title_uk = 'Свамі'
WHERE slug = 'bhanu-swami';

UPDATE gv_authors SET
  name_uk = 'Джаядвайта Свамі',
  title_uk = 'Свамі'
WHERE slug = 'jayadvaita-swami';

UPDATE gv_authors SET
  name_uk = 'Дханурдхара Свамі',
  title_uk = 'Свамі'
WHERE slug = 'dhanurdhara-swami';

UPDATE gv_authors SET
  name_uk = 'Девамріта Свамі',
  title_uk = 'Свамі'
WHERE slug = 'devamrita-swami';

UPDATE gv_authors SET
  name_uk = 'Тамала Крішна Ґосвамі',
  title_uk = 'Ґосвамі'
WHERE slug = 'tamal-krishna-goswami';

UPDATE gv_authors SET
  name_uk = 'Ґірірадж Свамі',
  title_uk = 'Свамі'
WHERE slug = 'giriraj-swami';

UPDATE gv_authors SET
  name_uk = 'Індрадьюмна Свамі',
  title_uk = 'Свамі'
WHERE slug = 'indradyumna-swami';

UPDATE gv_authors SET
  name_uk = 'Джаяпатака Свамі',
  title_uk = 'Свамі'
WHERE slug = 'jayapataka-swami';

UPDATE gv_authors SET
  name_uk = 'Бхакті Чару Свамі',
  title_uk = 'Свамі'
WHERE slug = 'bhakti-charu-swami';

UPDATE gv_authors SET
  name_uk = 'Бір Крішна Даса Ґосвамі',
  title_uk = 'Ґосвамі'
WHERE slug = 'bir-krishna-das-goswami';

UPDATE gv_authors SET
  name_uk = 'Урміла Деві Дасі'
WHERE slug = 'urmila-devi-dasi';

UPDATE gv_authors SET
  name_uk = 'Бхуріджана Даса'
WHERE slug = 'bhurijan-dasa';

UPDATE gv_authors SET
  name_uk = 'Крішна-кшетра Свамі',
  title_uk = 'Свамі'
WHERE slug = 'krishna-kshetra-swami';

-- ============================================================================
-- FIX BOOK TITLES - SIMPLIFIED UKRAINIAN
-- ============================================================================

-- Foundational
UPDATE gv_book_references SET title_uk = 'Бгаґавад-ґіта (Пісня Бога)' WHERE slug = 'bhagavad-gita';
UPDATE gv_book_references SET title_uk = 'Шрімад-Бгаґаватам (Прекрасна оповідь про Бога)' WHERE slug = 'srimad-bhagavatam';
UPDATE gv_book_references SET title_uk = 'Шрі Ішопанішад' WHERE slug = 'sri-isopanishad';
UPDATE gv_book_references SET title_uk = 'Брахма-самхіта' WHERE slug = 'brahma-samhita';
UPDATE gv_book_references SET title_uk = 'Веданта-сутра' WHERE slug = 'vedanta-sutra';
UPDATE gv_book_references SET title_uk = 'Шікшаштакам (Вісім настанов)' WHERE slug = 'siksastakam';

-- Rupa Gosvami
UPDATE gv_book_references SET title_uk = 'Бхакті-расамріта-сіндху (Океан нектару відданості)' WHERE slug = 'bhakti-rasamrta-sindhu';
UPDATE gv_book_references SET title_uk = 'Уджвала-ніламані (Сяючий сапфір)' WHERE slug = 'ujjvala-nilamani';
UPDATE gv_book_references SET title_uk = 'Упадешамріта (Нектар настанов)' WHERE slug = 'upadesamrta';
UPDATE gv_book_references SET title_uk = 'Відаґдха-мадхава' WHERE slug = 'vidagdha-madhava';
UPDATE gv_book_references SET title_uk = 'Лаліта-мадхава' WHERE slug = 'lalita-madhava';
UPDATE gv_book_references SET title_uk = 'Става-мала (Гірлянда молитов)' WHERE slug = 'stavamala';
UPDATE gv_book_references SET title_uk = 'Лаґху-бгаґаватамріта (Малий нектар Бгаґавати)' WHERE slug = 'laghu-bhagavatamrta';
UPDATE gv_book_references SET title_uk = 'Падьявалі (Збірка віршів)' WHERE slug = 'padyavali';
UPDATE gv_book_references SET title_uk = 'Дана-келі-каумуді' WHERE slug = 'dana-keli-kaumudi';
UPDATE gv_book_references SET title_uk = 'Хамса-дута (Лебідь-посланець)' WHERE slug = 'hamsaduta';
UPDATE gv_book_references SET title_uk = 'Уддхава-сандеша (Послання Уддхаві)' WHERE slug = 'uddhava-sandesa';
UPDATE gv_book_references SET title_uk = 'Матхура-махатмья (Слава Матхури)' WHERE slug = 'mathura-mahatmya';

-- Sanatana Gosvami
UPDATE gv_book_references SET title_uk = 'Бріхад-бгаґаватамріта (Великий нектар Бгаґавати)' WHERE slug = 'brihad-bhagavatamrta';
UPDATE gv_book_references SET title_uk = 'Харі-бхакті-віласа (Ігри відданості Харі)' WHERE slug = 'hari-bhakti-vilasa';
UPDATE gv_book_references SET title_uk = 'Дашама-тіппані (Нотатки до Десятої пісні)' WHERE slug = 'dasama-tippani';
UPDATE gv_book_references SET title_uk = 'Крішна-ліла-става (Молитви, що прославляють ігри Крішни)' WHERE slug = 'krishna-lila-stava';

-- Jiva Gosvami (Sandarbhas)
UPDATE gv_book_references SET title_uk = 'Таттва-сандарбха (Есе про істину)' WHERE slug = 'tattva-sandarbha';
UPDATE gv_book_references SET title_uk = 'Бгаґават-сандарбха (Есе про Верховну Особу)' WHERE slug = 'bhagavat-sandarbha';
UPDATE gv_book_references SET title_uk = 'Параматма-сандарбха (Есе про Наддушу)' WHERE slug = 'paramatma-sandarbha';
UPDATE gv_book_references SET title_uk = 'Крішна-сандарбха (Есе про Крішну)' WHERE slug = 'krishna-sandarbha';
UPDATE gv_book_references SET title_uk = 'Бхакті-сандарбха (Есе про відданість)' WHERE slug = 'bhakti-sandarbha';
UPDATE gv_book_references SET title_uk = 'Пріті-сандарбха (Есе про божественну любов)' WHERE slug = 'priti-sandarbha';
UPDATE gv_book_references SET title_uk = 'Ґопала-чампу' WHERE slug = 'gopala-champu';
UPDATE gv_book_references SET title_uk = 'Крама-сандарбха (Послідовний коментар)' WHERE slug = 'krama-sandarbha';
UPDATE gv_book_references SET title_uk = 'Сарва-самвадіні (Узгоджувач усього)' WHERE slug = 'sarva-samvadini';
UPDATE gv_book_references SET title_uk = 'Мадхава-махотсава (Великий фестиваль Мадхави)' WHERE slug = 'madhava-mahotsava';
UPDATE gv_book_references SET title_uk = 'Санкалпа-калпадрума (Дерево бажань медитації)' WHERE slug = 'sankalpa-kalpadruma';

-- Raghunatha Dasa Gosvami
UPDATE gv_book_references SET title_uk = 'Вілапа-кусуманджалі (Квіткова жертва скорботи)' WHERE slug = 'vilapa-kusumanjali';
UPDATE gv_book_references SET title_uk = 'Стававалі (Збірка молитов)' WHERE slug = 'stavavali';
UPDATE gv_book_references SET title_uk = 'Манах-шікша (Настанови розуму)' WHERE slug = 'manah-siksa';
UPDATE gv_book_references SET title_uk = 'Мукта-чаріта (Життя звільненого)' WHERE slug = 'muktacarita';
UPDATE gv_book_references SET title_uk = 'Дана-чаріта (Ліла збирання податків)' WHERE slug = 'dana-carita';
UPDATE gv_book_references SET title_uk = 'Сва-ніяма-дашакам (Десять віршів про мої обітниці)' WHERE slug = 'sva-niyama-dasakam';

-- Gopala Bhatta Gosvami
UPDATE gv_book_references SET title_uk = 'Сат-крія-сара-діпіка (Світильник основних обрядів)' WHERE slug = 'sat-kriya-sara-dipika';

-- Biographies
UPDATE gv_book_references SET title_uk = 'Шрі Чайтанья-чарітамріта (Нектар життя Чайтаньї)' WHERE slug = 'chaitanya-charitamrita';
UPDATE gv_book_references SET title_uk = 'Шрі Чайтанья Бгаґавата' WHERE slug = 'chaitanya-bhagavata';

-- Narottama Dasa Thakura
UPDATE gv_book_references SET title_uk = 'Прартхана (Молитви)' WHERE slug = 'prarthana';
UPDATE gv_book_references SET title_uk = 'Према-бхакті-чандріка (Місячні промені любовної відданості)' WHERE slug = 'prema-bhakti-chandrika';

-- Visvanatha Chakravarti
UPDATE gv_book_references SET title_uk = 'Мадхурья-кадамбіні (Хмара солодощів)' WHERE slug = 'madhurya-kadambini';
UPDATE gv_book_references SET title_uk = 'Раґа-вартма-чандріка (Місячне світло на шляху раґи)' WHERE slug = 'raga-vartma-chandrika';
UPDATE gv_book_references SET title_uk = 'Сарартха-даршіні (Відкривач суттєвого значення)' WHERE slug = 'sarartha-darshini';
UPDATE gv_book_references SET title_uk = 'Ґіта-бхушана (Окраса Ґіти)' WHERE slug = 'gita-bhusana';
UPDATE gv_book_references SET title_uk = 'Уджвала-ніламані-кірана (Промені Уджвала-ніламані)' WHERE slug = 'ujjvala-nilamani-kirana';
UPDATE gv_book_references SET title_uk = 'Кшанада-ґіта-чінтамані' WHERE slug = 'ksanada-gita-cintamani';

-- Baladeva Vidyabhushana
UPDATE gv_book_references SET title_uk = 'Ґовінда-бхашья (Коментар на ім''я Ґовінди)' WHERE slug = 'govinda-bhashya';
UPDATE gv_book_references SET title_uk = 'Прамея-ратнавалі (Гірлянда філософських коштовностей)' WHERE slug = 'prameya-ratnavali';
UPDATE gv_book_references SET title_uk = 'Сіддханта-ратна (Коштовність висновків)' WHERE slug = 'siddhanta-ratna';
UPDATE gv_book_references SET title_uk = 'Ґіта-бхушана (Баладева)' WHERE slug = 'gita-bhushana-baladeva';

-- Bhaktivinoda Thakura
UPDATE gv_book_references SET title_uk = 'Джайва-дхарма (Релігія душі)' WHERE slug = 'jaiva-dharma';
UPDATE gv_book_references SET title_uk = 'Харінама-чінтамані (Філософський камінь святого імені)' WHERE slug = 'harinama-cintamani';
UPDATE gv_book_references SET title_uk = 'Бхаджана-рахасья (Таємниці девоційної практики)' WHERE slug = 'bhajana-rahasya';
UPDATE gv_book_references SET title_uk = 'Шрі Чайтанья-шікшамріта (Нектар вчень Чайтаньї)' WHERE slug = 'sri-chaitanya-siksamrta';
UPDATE gv_book_references SET title_uk = 'Навадвіпа-дхама-махатмья (Слава Навадвіпи)' WHERE slug = 'navadvipa-dhama-mahatmya';
UPDATE gv_book_references SET title_uk = 'Крішна-самхіта (Збірка про Крішну)' WHERE slug = 'krishna-samhita';
UPDATE gv_book_references SET title_uk = 'Таттва-сутра (Афоризми про істину)' WHERE slug = 'tattva-sutra';
UPDATE gv_book_references SET title_uk = 'Таттва-вівека (Розрізнення істини)' WHERE slug = 'tattva-viveka';
UPDATE gv_book_references SET title_uk = 'Амная-сутра (Афоризми традиції)' WHERE slug = 'amnaya-sutra';
UPDATE gv_book_references SET title_uk = 'Шаранаґаті (Віддання)' WHERE slug = 'saranagati';
UPDATE gv_book_references SET title_uk = 'Ґітавалі (Збірка пісень)' WHERE slug = 'gitavali';
UPDATE gv_book_references SET title_uk = 'Ґіта-мала (Гірлянда пісень)' WHERE slug = 'gita-mala';
UPDATE gv_book_references SET title_uk = 'Кальяна-калпатару (Дерево бажань благодаті)' WHERE slug = 'kalyana-kalpataru';
UPDATE gv_book_references SET title_uk = 'Баула-санґіта (Пісні мандрівного відданого)' WHERE slug = 'baula-sangita';
UPDATE gv_book_references SET title_uk = 'Датта-каустубха' WHERE slug = 'datta-kaustubha';
UPDATE gv_book_references SET title_uk = 'Према-прадіпа (Світильник божественної любові)' WHERE slug = 'prema-pradipa';
UPDATE gv_book_references SET title_uk = 'Харі-бхакті-калпа-латіка (Ліана бажань відданості Харі)' WHERE slug = 'hari-bhakti-kalpa-latika';
UPDATE gv_book_references SET title_uk = 'Вайшнава-сіддханта-мала (Гірлянда вайшнавських висновків)' WHERE slug = 'vaishnava-siddhanta-mala';
UPDATE gv_book_references SET title_uk = 'Бгаґавад-арка-марічі-мала (Гірлянда променів із сонця Бгаґавад-ґіти)' WHERE slug = 'bhagavad-arka-marici-mala';
UPDATE gv_book_references SET title_uk = 'Шрі Чайтанья Махапрабгу: Його життя і вчення' WHERE slug = 'chaitanya-mahaprabhu-his-life-and-precepts';

-- Bhaktisiddhanta Sarasvati
UPDATE gv_book_references SET title_uk = 'Брахмана і Вайшнав' WHERE slug = 'brahmana-o-vaishnava';
UPDATE gv_book_references SET title_uk = 'Упакхьяне Упадеша (Вчення через історії)' WHERE slug = 'upakhyane-upadesa';
UPDATE gv_book_references SET title_uk = 'Пракріта-раса-шата-душіні (Сто недоліків мирської раси)' WHERE slug = 'prakrita-rasa-sata-dushini';
UPDATE gv_book_references SET title_uk = 'Анубхашья (Послідовний коментар)' WHERE slug = 'anubhashya';
UPDATE gv_book_references SET title_uk = 'Хто такий вайшнав?' WHERE slug = 'vaishnava-ke';
UPDATE gv_book_references SET title_uk = 'Амріта-праваха-бхашья (Коментар, що тече нектаром)' WHERE slug = 'amrta-pravaha-bhasya';
UPDATE gv_book_references SET title_uk = 'Вчення Шрі Чайтаньї' WHERE slug = 'sri-chaitanyas-teachings';

-- Prabhupada - Major works
UPDATE gv_book_references SET title_uk = 'Бгаґавад-ґіта як вона є' WHERE slug = 'bhagavad-gita-as-it-is';
UPDATE gv_book_references SET title_uk = 'Шрімад-Бгаґаватам' WHERE slug = 'srimad-bhagavatam-prabhupada';
UPDATE gv_book_references SET title_uk = 'Шрі Чайтанья-чарітамріта' WHERE slug = 'chaitanya-charitamrita-prabhupada';
UPDATE gv_book_references SET title_uk = 'Нектар відданості' WHERE slug = 'nectar-of-devotion';
UPDATE gv_book_references SET title_uk = 'Нектар настанов' WHERE slug = 'nectar-of-instruction';
UPDATE gv_book_references SET title_uk = 'Шрі Ішопанішад' WHERE slug = 'sri-isopanisad-prabhupada';
UPDATE gv_book_references SET title_uk = 'Вчення Господа Чайтаньї' WHERE slug = 'teachings-of-lord-chaitanya';
UPDATE gv_book_references SET title_uk = 'Крішна, Верховна Особистість Бога' WHERE slug = 'krishna-book';
UPDATE gv_book_references SET title_uk = 'Вчення Господа Капіли, сина Девахуті' WHERE slug = 'teachings-of-lord-kapila';
UPDATE gv_book_references SET title_uk = 'Вчення цариці Кунті' WHERE slug = 'teachings-of-queen-kunti';
UPDATE gv_book_references SET title_uk = 'Брахма-самхіта' WHERE slug = 'brahma-samhita-prabhupada';

-- Prabhupada - Small books
UPDATE gv_book_references SET title_uk = 'Легка подорож на інші планети' WHERE slug = 'easy-journey-to-other-planets';
UPDATE gv_book_references SET title_uk = 'Наука самоусвідомлення' WHERE slug = 'science-of-self-realization';
UPDATE gv_book_references SET title_uk = 'За межами народження і смерті' WHERE slug = 'beyond-birth-and-death';
UPDATE gv_book_references SET title_uk = 'Досконалі питання, досконалі відповіді' WHERE slug = 'perfect-questions-perfect-answers';
UPDATE gv_book_references SET title_uk = 'Раджа-відья: Цар знання' WHERE slug = 'raja-vidya';
UPDATE gv_book_references SET title_uk = 'Піднесення до свідомості Крішни' WHERE slug = 'elevation-to-krishna-consciousness';
UPDATE gv_book_references SET title_uk = 'Свідомість Крішни: Найвища система йоґи' WHERE slug = 'krishna-consciousness-topmost-yoga';
UPDATE gv_book_references SET title_uk = 'Неперевершений дар' WHERE slug = 'matchless-gift';
UPDATE gv_book_references SET title_uk = 'Шлях досконалості' WHERE slug = 'path-of-perfection';
UPDATE gv_book_references SET title_uk = 'Подорож самопізнання' WHERE slug = 'journey-of-self-discovery';
UPDATE gv_book_references SET title_uk = 'Життя походить від життя' WHERE slug = 'life-comes-from-life';
UPDATE gv_book_references SET title_uk = 'Послання Бога' WHERE slug = 'message-of-godhead';
UPDATE gv_book_references SET title_uk = 'Зречення через мудрість' WHERE slug = 'renunciation-through-wisdom';
UPDATE gv_book_references SET title_uk = 'Повернення' WHERE slug = 'coming-back';
UPDATE gv_book_references SET title_uk = 'Вищий смак' WHERE slug = 'higher-taste';
UPDATE gv_book_references SET title_uk = 'Цивілізація і трансценденція' WHERE slug = 'civilization-and-transcendence';
UPDATE gv_book_references SET title_uk = 'Закони природи' WHERE slug = 'laws-of-nature';
UPDATE gv_book_references SET title_uk = 'Світло Бгаґавати' WHERE slug = 'light-of-bhagavata';
UPDATE gv_book_references SET title_uk = 'Крішна, резервуар насолоди' WHERE slug = 'krsna-the-reservoir-of-pleasure';
UPDATE gv_book_references SET title_uk = 'Досконалість йоґи' WHERE slug = 'perfection-of-yoga';
UPDATE gv_book_references SET title_uk = 'Нарада-бхакті-сутра' WHERE slug = 'narada-bhakti-sutra-prabhupada';
UPDATE gv_book_references SET title_uk = 'Мукунда-мала-стотра' WHERE slug = 'mukunda-mala-stotra-prabhupada';

-- Disciples' works
UPDATE gv_book_references SET title_uk = 'Шріла Прабгупада-лілямріта' WHERE slug = 'srila-prabhupada-lilamrta';
UPDATE gv_book_references SET title_uk = 'Нектар Прабгупади' WHERE slug = 'prabhupada-nectar';
UPDATE gv_book_references SET title_uk = 'Реформа читання' WHERE slug = 'reading-reform';
UPDATE gv_book_references SET title_uk = 'Бріхад-бгаґаватамріта (Переклад)' WHERE slug = 'brihad-bhagavatamrta-translation';
UPDATE gv_book_references SET title_uk = 'Бхакті-сандарбха (Переклад)' WHERE slug = 'sri-bhakti-sandarbha-translation';
UPDATE gv_book_references SET title_uk = 'На Парайє ''хам' WHERE slug = 'na-paraye-ham';
UPDATE gv_book_references SET title_uk = 'Шуддха-бхакті-чінтамані' WHERE slug = 'suddha-bhakti-cintamani';
UPDATE gv_book_references SET title_uk = 'Вену-ґіта' WHERE slug = 'venu-gita';
UPDATE gv_book_references SET title_uk = 'Шікша поза ІСКОН?' WHERE slug = 'siksa-outside-iskcon';
UPDATE gv_book_references SET title_uk = 'Духовний воїн I' WHERE slug = 'spiritual-warrior-1';
UPDATE gv_book_references SET title_uk = 'Духовний воїн II' WHERE slug = 'spiritual-warrior-2';
UPDATE gv_book_references SET title_uk = 'Духовний воїн III' WHERE slug = 'spiritual-warrior-3';
UPDATE gv_book_references SET title_uk = 'Духовний воїн IV' WHERE slug = 'spiritual-warrior-4';
UPDATE gv_book_references SET title_uk = 'Духовний воїн V' WHERE slug = 'spiritual-warrior-5';
UPDATE gv_book_references SET title_uk = 'Духовний воїн VI' WHERE slug = 'spiritual-warrior-6';
UPDATE gv_book_references SET title_uk = 'Вмерти перед смертю' WHERE slug = 'die-before-dying';
UPDATE gv_book_references SET title_uk = 'Подорож додому' WHERE slug = 'journey-home';
UPDATE gv_book_references SET title_uk = 'Подорож усередину' WHERE slug = 'journey-within';
UPDATE gv_book_references SET title_uk = 'Шрі Бхактісіддханта Вайбхава' WHERE slug = 'sri-bhaktisiddhanta-vaibhava';
UPDATE gv_book_references SET title_uk = 'Погляд на традиційне індійське життя' WHERE slug = 'glimpses-traditional-indian-life';
UPDATE gv_book_references SET title_uk = 'Патропадеша' WHERE slug = 'patropadesha';
UPDATE gv_book_references SET title_uk = 'Мої спогади про Шрілу Прабгупаду' WHERE slug = 'my-memories-of-srila-prabhupada';
UPDATE gv_book_references SET title_uk = 'Про сміливу проповідь у служінні Шрілі Прабгупаді' WHERE slug = 'gaudiya-vaishnava-smriti';
UPDATE gv_book_references SET title_uk = 'Нектарний океан святого імені' WHERE slug = 'nectarean-ocean-holy-name';
UPDATE gv_book_references SET title_uk = 'Живе ім''я' WHERE slug = 'living-name';
UPDATE gv_book_references SET title_uk = 'Чудовий світ святого імені' WHERE slug = 'wonderful-world-of-the-holy-name';
UPDATE gv_book_references SET title_uk = 'Шат-сандарбха (Повний переклад)' WHERE slug = 'sat-sandarbha-translation';
UPDATE gv_book_references SET title_uk = 'Мадхурья-кадамбіні (Переклад)' WHERE slug = 'madhurya-kadambini-translation';
UPDATE gv_book_references SET title_uk = 'Хвилі відданості' WHERE slug = 'waves-of-devotion';
UPDATE gv_book_references SET title_uk = 'Прикрашаючи землю' WHERE slug = 'gracing-the-earth';
UPDATE gv_book_references SET title_uk = 'У пошуках ведичної Індії' WHERE slug = 'searching-for-vedic-india';
UPDATE gv_book_references SET title_uk = 'Міський вайшнавський спосіб життя' WHERE slug = 'perfect-encyclopedic-encyclopedia-of-perfect-encyclopedias';

-- Additional books
UPDATE gv_book_references SET title_uk = 'Ґаура-ґаноддеша-діпіка' WHERE slug = 'gaura-ganoddesa-dipika';
UPDATE gv_book_references SET title_uk = 'Чайтанья-чандрамріта' WHERE slug = 'caitanya-candramrita';
UPDATE gv_book_references SET title_uk = 'Радха-раса-судха-нідхі' WHERE slug = 'radha-rasa-sudha-nidhi';
UPDATE gv_book_references SET title_uk = 'Вріндавана-махімамріта' WHERE slug = 'vrindavana-mahimamrta';
UPDATE gv_book_references SET title_uk = 'Щоденник мандрівного проповідника' WHERE slug = 'diary-traveling-preacher';
UPDATE gv_book_references SET title_uk = 'Слуга слуги' WHERE slug = 'servant-of-servant';
UPDATE gv_book_references SET title_uk = 'Щоденник ТКҐ' WHERE slug = 'tkg-diary';
UPDATE gv_book_references SET title_uk = 'Багато місяців' WHERE slug = 'many-moons';
UPDATE gv_book_references SET title_uk = 'Віддайся Мені' WHERE slug = 'surrender-unto-me';

COMMIT;
