-- Remove final "а" from Sanskrit names in Ukrainian transliteration
-- Raghunatha → Раґгунатх (not Раґгунатха)
-- Bhaktivinoda → Бгактівінод (not Бгактівінода)

BEGIN;

-- ============================================================================
-- FIX AUTHORS - REMOVE FINAL "А"
-- ============================================================================

-- Pancha-tattva
UPDATE gv_authors SET name_uk = 'Шрі Нітьянанд Прабгу' WHERE slug = 'nityananda-prabhu';
UPDATE gv_authors SET name_uk = 'Шрі Адвайта Ачар''я' WHERE slug = 'advaita-acharya';
UPDATE gv_authors SET name_uk = 'Шрі Ґададгар Пандіт' WHERE slug = 'gadadhara-pandita';
UPDATE gv_authors SET name_uk = 'Шрівас Тхакур' WHERE slug = 'srivasa-thakura';
UPDATE gv_authors SET name_uk = 'Шріла Харідас Тхакур' WHERE slug = 'haridasa-thakura';
UPDATE gv_authors SET name_uk = 'Шріла Сваруп Дамодар Ґосвамі' WHERE slug = 'svarupa-damodara';
UPDATE gv_authors SET name_uk = 'Шрі Рамананд Рай' WHERE slug = 'ramananda-raya';
UPDATE gv_authors SET name_uk = 'Шрі Пундарік Відьянідгі' WHERE slug = 'pundarika-vidyanidhi';

-- Six Gosvamis
UPDATE gv_authors SET name_uk = 'Шріла Руп Ґосвамі' WHERE slug = 'rupa-gosvami';
UPDATE gv_authors SET name_uk = 'Шріла Санатан Ґосвамі' WHERE slug = 'sanatana-gosvami';
UPDATE gv_authors SET name_uk = 'Шріла Джів Ґосвамі' WHERE slug = 'jiva-gosvami';
UPDATE gv_authors SET name_uk = 'Шріла Раґгунатх Дас Ґосвамі' WHERE slug = 'raghunatha-dasa-gosvami';
UPDATE gv_authors SET name_uk = 'Шріла Раґгунатх Бгатт Ґосвамі' WHERE slug = 'raghunatha-bhatta-gosvami';
UPDATE gv_authors SET name_uk = 'Шріла Ґопал Бгатт Ґосвамі' WHERE slug = 'gopala-bhatta-gosvami';
UPDATE gv_authors SET name_uk = 'Шріла Локанатх Ґосвамі' WHERE slug = 'lokanatha-gosvami';
UPDATE gv_authors SET name_uk = 'Шріла Бгуґарбг Ґосвамі' WHERE slug = 'bhugarbha-gosvami';

-- Later Acharyas
UPDATE gv_authors SET name_uk = 'Шріла Крішнадас Кавірадж' WHERE slug = 'krishnadasa-kaviraja';
UPDATE gv_authors SET name_uk = 'Шріла Вріндаван Дас Тхакур' WHERE slug = 'vrindavana-dasa-thakura';
UPDATE gv_authors SET name_uk = 'Шріла Нароттам Дас Тхакур' WHERE slug = 'narottama-dasa-thakura';
UPDATE gv_authors SET name_uk = 'Шріла Вішванатх Чакраварті Тхакур' WHERE slug = 'visvanatha-chakravarti';
UPDATE gv_authors SET name_uk = 'Шріла Баладев Відьябгушан' WHERE slug = 'baladeva-vidyabhushana';
UPDATE gv_authors SET name_uk = 'Шріла Каві Карнапур' WHERE slug = 'kavi-karnapura';
UPDATE gv_authors SET name_uk = 'Шріла Прабодгананд Сарасваті' WHERE slug = 'prabodhanananda-sarasvati';
UPDATE gv_authors SET name_uk = 'Шріла Шьямананд Прабгу' WHERE slug = 'shyamananda-prabhu';
UPDATE gv_authors SET name_uk = 'Шріла Шрінівас Ачар''я' WHERE slug = 'srinivasa-acharya';

-- Modern Acharyas
UPDATE gv_authors SET name_uk = 'Шріла Бгактівінод Тхакур' WHERE slug = 'bhaktivinoda-thakura';
UPDATE gv_authors SET name_uk = 'Шріла Ґауракішор Дас Бабаджі' WHERE slug = 'gaurakisora-dasa-babaji';
UPDATE gv_authors SET name_uk = 'Шріла Бгактісіддгант Сарасваті Тхакур' WHERE slug = 'bhaktisiddhanta-sarasvati';
UPDATE gv_authors SET name_uk = 'Шріла А.Ч. Бгактіведант Свамі Прабгупад' WHERE slug = 'bhaktivedanta-swami-prabhupada';

-- Prabhupada's disciples
UPDATE gv_authors SET name_uk = 'Сатсваруп Дас Ґосвамі' WHERE slug = 'satsvarupa-dasa-goswami';
UPDATE gv_authors SET name_uk = 'Ґопіпаранадган Дас' WHERE slug = 'gopiparanadhana-dasa';
UPDATE gv_authors SET name_uk = 'Хрідаянанд Дас Ґосвамі' WHERE slug = 'hridayananda-dasa-goswami';
UPDATE gv_authors SET name_uk = 'Шіварам Свамі' WHERE slug = 'sivarama-swami';
UPDATE gv_authors SET name_uk = 'Бгакті Тіртх Свамі' WHERE slug = 'bhakti-tirtha-swami';
UPDATE gv_authors SET name_uk = 'Радганатх Свамі' WHERE slug = 'radhanatha-swami';
UPDATE gv_authors SET name_uk = 'Бгакті Вікаш Свамі' WHERE slug = 'bhakti-vikasa-swami';
UPDATE gv_authors SET name_uk = 'Сачінандан Свамі' WHERE slug = 'sacinandana-swami';
UPDATE gv_authors SET name_uk = 'Бгану Свамі' WHERE slug = 'bhanu-swami';
UPDATE gv_authors SET name_uk = 'Джаядвайт Свамі' WHERE slug = 'jayadvaita-swami';
UPDATE gv_authors SET name_uk = 'Дганурдгар Свамі' WHERE slug = 'dhanurdhara-swami';
UPDATE gv_authors SET name_uk = 'Девамріт Свамі' WHERE slug = 'devamrita-swami';
UPDATE gv_authors SET name_uk = 'Тамал Крішн Ґосвамі' WHERE slug = 'tamal-krishna-goswami';
UPDATE gv_authors SET name_uk = 'Ґірірадж Свамі' WHERE slug = 'giriraj-swami';
UPDATE gv_authors SET name_uk = 'Індрадьюмн Свамі' WHERE slug = 'indradyumna-swami';
UPDATE gv_authors SET name_uk = 'Джаяпатак Свамі' WHERE slug = 'jayapataka-swami';
UPDATE gv_authors SET name_uk = 'Бгакті Чару Свамі' WHERE slug = 'bhakti-charu-swami';
UPDATE gv_authors SET name_uk = 'Бір Крішн Дас Ґосвамі' WHERE slug = 'bir-krishna-das-goswami';
UPDATE gv_authors SET name_uk = 'Урміл Деві Дасі' WHERE slug = 'urmila-devi-dasi';
UPDATE gv_authors SET name_uk = 'Бгуріджан Дас' WHERE slug = 'bhurijan-dasa';
UPDATE gv_authors SET name_uk = 'Крішна-кшетр Свамі' WHERE slug = 'krishna-kshetra-swami';

COMMIT;
