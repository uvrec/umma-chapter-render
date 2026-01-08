-- Fix aspirated consonants in Ukrainian transliteration
-- Rules: bh → бг (NOT бх!), gh → ґг (NOT ґх!), dh → дг (NOT дх!)
-- th → тх, kh → кх

BEGIN;

-- ============================================================================
-- FIX AUTHORS - ASPIRATED CONSONANTS
-- ============================================================================

-- Raghunatha (gh → ґг)
UPDATE gv_authors SET
  name_ua = 'Шріла Раґгунатх Дас Ґосвамі'
WHERE slug = 'raghunatha-dasa-gosvami';

UPDATE gv_authors SET
  name_ua = 'Шріла Раґгунатх Бгатта Ґосвамі'
WHERE slug = 'raghunatha-bhatta-gosvami';

-- Bhatta (bh → бг)
UPDATE gv_authors SET
  name_ua = 'Шріла Ґопала Бгатта Ґосвамі'
WHERE slug = 'gopala-bhatta-gosvami';

-- Bhugarbha (bh → бг)
UPDATE gv_authors SET
  name_ua = 'Шріла Бгуґарбга Ґосвамі'
WHERE slug = 'bhugarbha-gosvami';

-- Vidyabhushana (bh → бг)
UPDATE gv_authors SET
  name_ua = 'Шріла Баладева Відьябгушана',
  title_ua = 'Відьябгушана'
WHERE slug = 'baladeva-vidyabhushana';

-- Bhaktivinoda (bh → бг)
UPDATE gv_authors SET
  name_ua = 'Шріла Бгактівінод Тхакур'
WHERE slug = 'bhaktivinoda-thakura';

-- Bhaktisiddhanta (bh → бг, dh → дг)
UPDATE gv_authors SET
  name_ua = 'Шріла Бгактісіддганта Сарасваті Тхакур'
WHERE slug = 'bhaktisiddhanta-sarasvati';

-- Bhaktivedanta (bh → бг)
UPDATE gv_authors SET
  name_ua = 'Шріла А.Ч. Бгактіведанта Свамі Прабгупада'
WHERE slug = 'bhaktivedanta-swami-prabhupada';

-- Disciples with Bhakti in name (bh → бг)
UPDATE gv_authors SET
  name_ua = 'Бгакті Тіртха Свамі'
WHERE slug = 'bhakti-tirtha-swami';

UPDATE gv_authors SET
  name_ua = 'Бгакті Вікаша Свамі'
WHERE slug = 'bhakti-vikasa-swami';

UPDATE gv_authors SET
  name_ua = 'Бгану Свамі'
WHERE slug = 'bhanu-swami';

UPDATE gv_authors SET
  name_ua = 'Дганурдгара Свамі'
WHERE slug = 'dhanurdhara-swami';

UPDATE gv_authors SET
  name_ua = 'Бгакті Чару Свамі'
WHERE slug = 'bhakti-charu-swami';

UPDATE gv_authors SET
  name_ua = 'Бгуріджана Даса'
WHERE slug = 'bhurijan-dasa';

UPDATE gv_authors SET
  name_ua = 'Радганатх Свамі'
WHERE slug = 'radhanatha-swami';

-- Gadadhara (dh → дг)
UPDATE gv_authors SET
  name_ua = 'Шрі Ґададгара Пандіт'
WHERE slug = 'gadadhara-pandita';

-- Vidyanidhi (dh → дг)
UPDATE gv_authors SET
  name_ua = 'Шрі Пундаріка Відьянідгі'
WHERE slug = 'pundarika-vidyanidhi';

-- Prabodhanananda (dh → дг)
UPDATE gv_authors SET
  name_ua = 'Шріла Прабодгананда Сарасваті'
WHERE slug = 'prabodhanananda-sarasvati';

-- ============================================================================
-- FIX BOOK TITLES - ASPIRATED CONSONANTS
-- ============================================================================

-- Bhakti (bh → бг)
UPDATE gv_book_references SET title_ua = 'Бгакті-расамріта-сіндгу (Океан нектару відданості)' WHERE slug = 'bhakti-rasamrta-sindhu';
UPDATE gv_book_references SET title_ua = 'Бгакті-сандарбга (Есе про відданість)' WHERE slug = 'bhakti-sandarbha';
UPDATE gv_book_references SET title_ua = 'Харі-бгакті-віласа (Ігри відданості Харі)' WHERE slug = 'hari-bhakti-vilasa';
UPDATE gv_book_references SET title_ua = 'Према-бгакті-чандріка (Місячні промені любовної відданості)' WHERE slug = 'prema-bhakti-chandrika';
UPDATE gv_book_references SET title_ua = 'Харі-бгакті-калпа-латіка (Ліана бажань відданості Харі)' WHERE slug = 'hari-bhakti-kalpa-latika';
UPDATE gv_book_references SET title_ua = 'Нарада-бгакті-сутра' WHERE slug = 'narada-bhakti-sutra-prabhupada';

-- Bhagavad/Bhagavata/Bhagavatam (bh → бг)
UPDATE gv_book_references SET title_ua = 'Бгаґавад-ґіта (Пісня Бога)' WHERE slug = 'bhagavad-gita';
UPDATE gv_book_references SET title_ua = 'Шрімад-Бгаґаватам (Прекрасна оповідь про Бога)' WHERE slug = 'srimad-bhagavatam';
UPDATE gv_book_references SET title_ua = 'Бгаґават-сандарбга (Есе про Верховну Особу)' WHERE slug = 'bhagavat-sandarbha';
UPDATE gv_book_references SET title_ua = 'Лаґгу-бгаґаватамріта (Малий нектар Бгаґавати)' WHERE slug = 'laghu-bhagavatamrta';
UPDATE gv_book_references SET title_ua = 'Бріхад-бгаґаватамріта (Великий нектар Бгаґавати)' WHERE slug = 'brihad-bhagavatamrta';
UPDATE gv_book_references SET title_ua = 'Шрі Чайтанья Бгаґавата' WHERE slug = 'chaitanya-bhagavata';
UPDATE gv_book_references SET title_ua = 'Бгаґавад-арка-марічі-мала (Гірлянда променів із сонця Бгаґавад-ґіти)' WHERE slug = 'bhagavad-arka-marici-mala';
UPDATE gv_book_references SET title_ua = 'Світло Бгаґавати' WHERE slug = 'light-of-bhagavata';
UPDATE gv_book_references SET title_ua = 'Бгаґавад-ґіта як вона є' WHERE slug = 'bhagavad-gita-as-it-is';

-- Bhashya (bh → бг)
UPDATE gv_book_references SET title_ua = 'Ґовінда-бгашья (Коментар на ім''я Ґовінди)' WHERE slug = 'govinda-bhashya';
UPDATE gv_book_references SET title_ua = 'Анубгашья (Послідовний коментар)' WHERE slug = 'anubhashya';
UPDATE gv_book_references SET title_ua = 'Амріта-правага-бгашья (Коментар, що тече нектаром)' WHERE slug = 'amrta-pravaha-bhasya';

-- Bhushana (bh → бг)
UPDATE gv_book_references SET title_ua = 'Ґіта-бгушана (Окраса Ґіти)' WHERE slug = 'gita-bhusana';
UPDATE gv_book_references SET title_ua = 'Ґіта-бгушана (Баладева)' WHERE slug = 'gita-bhushana-baladeva';

-- Bhajana (bh → бг)
UPDATE gv_book_references SET title_ua = 'Бгаджана-рахасья (Таємниці девоційної практики)' WHERE slug = 'bhajana-rahasya';

-- Sandarbha (bh → бг)
UPDATE gv_book_references SET title_ua = 'Таттва-сандарбга (Есе про істину)' WHERE slug = 'tattva-sandarbha';
UPDATE gv_book_references SET title_ua = 'Параматма-сандарбга (Есе про Наддушу)' WHERE slug = 'paramatma-sandarbha';
UPDATE gv_book_references SET title_ua = 'Крішна-сандарбга (Есе про Крішну)' WHERE slug = 'krishna-sandarbha';
UPDATE gv_book_references SET title_ua = 'Пріті-сандарбга (Есе про божественну любов)' WHERE slug = 'priti-sandarbha';
UPDATE gv_book_references SET title_ua = 'Крама-сандарбга (Послідовний коментар)' WHERE slug = 'krama-sandarbha';
UPDATE gv_book_references SET title_ua = 'Бгакті-сандарбга (Переклад)' WHERE slug = 'sri-bhakti-sandarbha-translation';
UPDATE gv_book_references SET title_ua = 'Шат-сандарбга (Повний переклад)' WHERE slug = 'sat-sandarbha-translation';

-- Sindhu (dh → дг)
UPDATE gv_book_references SET title_ua = 'Радга-раса-судга-нідгі' WHERE slug = 'radha-rasa-sudha-nidhi';

-- Prabhupada works
UPDATE gv_book_references SET title_ua = 'Шріла Прабгупада-лілямріта' WHERE slug = 'srila-prabhupada-lilamrta';
UPDATE gv_book_references SET title_ua = 'Шрі Бгактісіддганта Вайбгава' WHERE slug = 'sri-bhaktisiddhanta-vaibhava';

-- Suddha-bhakti (bh → бг, ddh → ддг)
UPDATE gv_book_references SET title_ua = 'Шуддга-бгакті-чінтамані' WHERE slug = 'suddha-bhakti-cintamani';

-- Madhurya (dh → дг)
UPDATE gv_book_references SET title_ua = 'Мадгур''я-кадамбіні (Хмара солодощів)' WHERE slug = 'madhurya-kadambini';
UPDATE gv_book_references SET title_ua = 'Мадгур''я-кадамбіні (Переклад)' WHERE slug = 'madhurya-kadambini-translation';

-- Vidagdha (dh → дг)
UPDATE gv_book_references SET title_ua = 'Відаґдга-мадгава' WHERE slug = 'vidagdha-madhava';

-- Madhava (dh → дг)
UPDATE gv_book_references SET title_ua = 'Лаліта-мадгава' WHERE slug = 'lalita-madhava';
UPDATE gv_book_references SET title_ua = 'Мадгава-махотсава (Великий фестиваль Мадгави)' WHERE slug = 'madhava-mahotsava';

-- Uddhava (dh → дг)
UPDATE gv_book_references SET title_ua = 'Уддгава-сандеш (Послання Уддгаві)' WHERE slug = 'uddhava-sandesa';

-- Siddhanta (dh → дг)
UPDATE gv_book_references SET title_ua = 'Сіддганта-ратна (Коштовність висновків)' WHERE slug = 'siddhanta-ratna';
UPDATE gv_book_references SET title_ua = 'Вайшнава-сіддганта-мала (Гірлянда вайшнавських висновків)' WHERE slug = 'vaishnava-siddhanta-mala';

-- Dharma (dh → дг)
UPDATE gv_book_references SET title_ua = 'Джайва-дгарма (Релігія душі)' WHERE slug = 'jaiva-dharma';

-- Dhama (dh → дг)
UPDATE gv_book_references SET title_ua = 'Навадвіпа-дгама-магатмья (Слава Навадвіпи)' WHERE slug = 'navadvipa-dhama-mahatmya';

-- Brihad (bh → бг)
UPDATE gv_book_references SET title_ua = 'Бріхад-бгаґаватамріта (Переклад)' WHERE slug = 'brihad-bhagavatamrta-translation';

-- Prabodhanananda
UPDATE gv_book_references SET title_ua = 'Чайтанья-чандрамріта' WHERE slug = 'caitanya-candramrita';

-- Radha (dh → дг)
UPDATE gv_book_references SET title_ua = 'Радга-раса-судга-нідгі' WHERE slug = 'radha-rasa-sudha-nidhi';

COMMIT;
