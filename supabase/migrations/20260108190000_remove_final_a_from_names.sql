-- Remove final "а" from Sanskrit names in Ukrainian transliteration
-- Raghunatha → Раґгунатх (not Раґгунатха)
-- Bhaktivinoda → Бгактівінод (not Бгактівінода)

BEGIN;

-- ============================================================================
-- FIX AUTHORS - REMOVE FINAL "А"
-- ============================================================================

-- Pancha-tattva
UPDATE gv_authors SET name_ua = 'Шрі Нітьянанд Прабгу' WHERE slug = 'nityananda-prabhu';
UPDATE gv_authors SET name_ua = 'Шрі Адвайта Ачар''я' WHERE slug = 'advaita-acharya';
UPDATE gv_authors SET name_ua = 'Шрі Ґададгар Пандіт' WHERE slug = 'gadadhara-pandita';
UPDATE gv_authors SET name_ua = 'Шрівас Тхакур' WHERE slug = 'srivasa-thakura';
UPDATE gv_authors SET name_ua = 'Шріла Харідас Тхакур' WHERE slug = 'haridasa-thakura';
UPDATE gv_authors SET name_ua = 'Шріла Сваруп Дамодар Ґосвамі' WHERE slug = 'svarupa-damodara';
UPDATE gv_authors SET name_ua = 'Шрі Рамананд Рай' WHERE slug = 'ramananda-raya';
UPDATE gv_authors SET name_ua = 'Шрі Пундарік Відьянідгі' WHERE slug = 'pundarika-vidyanidhi';

-- Six Gosvamis
UPDATE gv_authors SET name_ua = 'Шріла Руп Ґосвамі' WHERE slug = 'rupa-gosvami';
UPDATE gv_authors SET name_ua = 'Шріла Санатан Ґосвамі' WHERE slug = 'sanatana-gosvami';
UPDATE gv_authors SET name_ua = 'Шріла Джів Ґосвамі' WHERE slug = 'jiva-gosvami';
UPDATE gv_authors SET name_ua = 'Шріла Раґгунатх Дас Ґосвамі' WHERE slug = 'raghunatha-dasa-gosvami';
UPDATE gv_authors SET name_ua = 'Шріла Раґгунатх Бгатт Ґосвамі' WHERE slug = 'raghunatha-bhatta-gosvami';
UPDATE gv_authors SET name_ua = 'Шріла Ґопал Бгатт Ґосвамі' WHERE slug = 'gopala-bhatta-gosvami';
UPDATE gv_authors SET name_ua = 'Шріла Локанатх Ґосвамі' WHERE slug = 'lokanatha-gosvami';
UPDATE gv_authors SET name_ua = 'Шріла Бгуґарбг Ґосвамі' WHERE slug = 'bhugarbha-gosvami';

-- Later Acharyas
UPDATE gv_authors SET name_ua = 'Шріла Крішнадас Кавірадж' WHERE slug = 'krishnadasa-kaviraja';
UPDATE gv_authors SET name_ua = 'Шріла Вріндаван Дас Тхакур' WHERE slug = 'vrindavana-dasa-thakura';
UPDATE gv_authors SET name_ua = 'Шріла Нароттам Дас Тхакур' WHERE slug = 'narottama-dasa-thakura';
UPDATE gv_authors SET name_ua = 'Шріла Вішванатх Чакраварті Тхакур' WHERE slug = 'visvanatha-chakravarti';
UPDATE gv_authors SET name_ua = 'Шріла Баладев Відьябгушан' WHERE slug = 'baladeva-vidyabhushana';
UPDATE gv_authors SET name_ua = 'Шріла Каві Карнапур' WHERE slug = 'kavi-karnapura';
UPDATE gv_authors SET name_ua = 'Шріла Прабодгананд Сарасваті' WHERE slug = 'prabodhanananda-sarasvati';
UPDATE gv_authors SET name_ua = 'Шріла Шьямананд Прабгу' WHERE slug = 'shyamananda-prabhu';
UPDATE gv_authors SET name_ua = 'Шріла Шрінівас Ачар''я' WHERE slug = 'srinivasa-acharya';

-- Modern Acharyas
UPDATE gv_authors SET name_ua = 'Шріла Бгактівінод Тхакур' WHERE slug = 'bhaktivinoda-thakura';
UPDATE gv_authors SET name_ua = 'Шріла Ґауракішор Дас Бабаджі' WHERE slug = 'gaurakisora-dasa-babaji';
UPDATE gv_authors SET name_ua = 'Шріла Бгактісіддгант Сарасваті Тхакур' WHERE slug = 'bhaktisiddhanta-sarasvati';
UPDATE gv_authors SET name_ua = 'Шріла А.Ч. Бгактіведант Свамі Прабгупад' WHERE slug = 'bhaktivedanta-swami-prabhupada';

-- Prabhupada's disciples
UPDATE gv_authors SET name_ua = 'Сатсваруп Дас Ґосвамі' WHERE slug = 'satsvarupa-dasa-goswami';
UPDATE gv_authors SET name_ua = 'Ґопіпаранадган Дас' WHERE slug = 'gopiparanadhana-dasa';
UPDATE gv_authors SET name_ua = 'Хрідаянанд Дас Ґосвамі' WHERE slug = 'hridayananda-dasa-goswami';
UPDATE gv_authors SET name_ua = 'Шіварам Свамі' WHERE slug = 'sivarama-swami';
UPDATE gv_authors SET name_ua = 'Бгакті Тіртх Свамі' WHERE slug = 'bhakti-tirtha-swami';
UPDATE gv_authors SET name_ua = 'Радганатх Свамі' WHERE slug = 'radhanatha-swami';
UPDATE gv_authors SET name_ua = 'Бгакті Вікаш Свамі' WHERE slug = 'bhakti-vikasa-swami';
UPDATE gv_authors SET name_ua = 'Сачінандан Свамі' WHERE slug = 'sacinandana-swami';
UPDATE gv_authors SET name_ua = 'Бгану Свамі' WHERE slug = 'bhanu-swami';
UPDATE gv_authors SET name_ua = 'Джаядвайт Свамі' WHERE slug = 'jayadvaita-swami';
UPDATE gv_authors SET name_ua = 'Дганурдгар Свамі' WHERE slug = 'dhanurdhara-swami';
UPDATE gv_authors SET name_ua = 'Девамріт Свамі' WHERE slug = 'devamrita-swami';
UPDATE gv_authors SET name_ua = 'Тамал Крішн Ґосвамі' WHERE slug = 'tamal-krishna-goswami';
UPDATE gv_authors SET name_ua = 'Ґірірадж Свамі' WHERE slug = 'giriraj-swami';
UPDATE gv_authors SET name_ua = 'Індрадьюмн Свамі' WHERE slug = 'indradyumna-swami';
UPDATE gv_authors SET name_ua = 'Джаяпатак Свамі' WHERE slug = 'jayapataka-swami';
UPDATE gv_authors SET name_ua = 'Бгакті Чару Свамі' WHERE slug = 'bhakti-charu-swami';
UPDATE gv_authors SET name_ua = 'Бір Крішн Дас Ґосвамі' WHERE slug = 'bir-krishna-das-goswami';
UPDATE gv_authors SET name_ua = 'Урміл Деві Дасі' WHERE slug = 'urmila-devi-dasi';
UPDATE gv_authors SET name_ua = 'Бгуріджан Дас' WHERE slug = 'bhurijan-dasa';
UPDATE gv_authors SET name_ua = 'Крішна-кшетр Свамі' WHERE slug = 'krishna-kshetra-swami';

COMMIT;
