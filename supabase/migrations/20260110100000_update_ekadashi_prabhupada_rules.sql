-- Update Ekadashi info with Prabhupada's instructions and detailed stories
-- Reference: Room Conversation, September 2, 1970, Calcutta

BEGIN;

-- ============================================
-- 1. ADD PRABHUPADA'S FASTING INSTRUCTIONS AS COMMON RULES
-- ============================================

-- Add general fasting rules column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ekadashi_info' AND column_name = 'prabhupada_instructions_ua'
  ) THEN
    ALTER TABLE ekadashi_info
      ADD COLUMN prabhupada_instructions_ua TEXT,
      ADD COLUMN prabhupada_instructions_en TEXT,
      ADD COLUMN prabhupada_source TEXT;
  END IF;
END $$;

-- ============================================
-- 2. UPDATE ALL EKADASHIS WITH PRABHUPADA'S INSTRUCTIONS
-- ============================================

UPDATE ekadashi_info SET
  prabhupada_instructions_ua = E'**Правила посту (за Шрілою Прабгупадою, 1970 р., Калькутта):**\n\n**Заборонено в екадаші:**\n• Усі зернові: рис, пшениця, кукурудза, ячмінь, просо, овес, жито, квіноа\n• Усе борошно із зерна та бобових\n• Боби, сочевиця, горох\n• Морква, гриби, цибуля, часник\n\n**Дозволено:**\n• Гречка (єдина «псевдо-крупа»)\n• Фрукти, овочі (крім заборонених)\n• Молочні продукти\n• Горіхи, насіння\n• Вода, соки\n\n**Вихід з посту (парана):**\n• Виходити ПІСЛЯ сходу сонця на Двадаші\n• Якщо на екадаші їли фрукти/овочі → виходити зерновими\n• Якщо повний піст (без води) → можна виходити будь-чим\n• Можна вийти чаранамрітою або фруктами\n\n**Суть екадаші:**\n«Суть екадаші — проводити якомога більше часу слухаючи, оспівуючи та пам''ятаючи Шрі Шрі Радгу-Крішну. Тому в цей день рекомендується їсти просто, лише раз або двічі.»',

  prabhupada_instructions_en = E'**Fasting Rules (by Srila Prabhupada, 1970, Calcutta):**\n\n**Prohibited on Ekadashi:**\n• All grains: rice, wheat, corn, barley, millet, oats, rye, quinoa\n• All flour from grains and beans\n• Beans, lentils, peas\n• Carrots, mushrooms, onions, garlic\n\n**Allowed:**\n• Buckwheat (the only "pseudo-grain")\n• Fruits, vegetables (except prohibited)\n• Dairy products\n• Nuts, seeds\n• Water, juices\n\n**Breaking the Fast (Paran):**\n• Break AFTER sunrise on Dvadashi\n• If you ate fruits/vegetables on Ekadashi → break with grains\n• If complete fast (no water) → can break with anything\n• Can break with charanamrita or fruits\n\n**Essence of Ekadashi:**\n"The essence of Ekadashi is to spend as much time as possible hearing, chanting and remembering Sri Sri Radha-Krishna. Therefore, on that day, it is recommended that one eat simply, only once or twice."',

  prabhupada_source = 'Room Conversation, September 2, 1970, Calcutta (700902R1)'
WHERE prabhupada_source IS NULL;

-- ============================================
-- 3. UPDATE INDIRA EKADASHI WITH FULL STORY
-- ============================================

UPDATE ekadashi_info SET
  glory_text_ua = E'**Діалог між Юдгіштхірою та Крішною**\n\nЮдгіштхіра запитав Господа Крішну про екадаші, що випадає на темну половину місяця Ашвіна (Падманабга). Господь Крішна відповів: «Цей екадаші називається Індіра. Він знищує великі гріхи та визволяє предків з нижчих царств.»\n\n**Історія царя Індрасени**\n\nУ Сат''я-юґу жив праведний цар на ім''я Індрасена. Він вирізнявся:\n• Непохитною відданістю Вішну\n• Постійним повторенням імен Ґовінди заради звільнення\n• Регулярною духовною практикою та медитацією\n\n**Звістка від Наради**\n\nМудрець Нарада приніс тривожну звістку: батько Індрасени, попри свою земну побожність, припустився помилок у виконанні певних ритуалів і внаслідок цього опинився у царстві Ямараджі замість небес.\n\nЧерез Нараду батько передав синові послання: «Сину, правильне дотримання Індіра Екадаші дарує мені заслугу піднестися до Вішну-локи.» Це демонструє глибокий принцип — **плоди праведних дій можуть бути передані іншим**.\n\n**Триденний протокол**\n\n**День 10 (Дашамі):** Ранкове та полуденне омивання, підношення предкам з вірою\n\n**День 11 (Екадаші):** Піст, полоскання рота без чищення зубів, проголошення обітниці, поклоніння Шалаґрама-шілі, нічне неспання\n\n**День 12 (Двадаші):** Поклоніння Божеству, ритуали для предків із зерновими, вшанування брахманів дарами, завершальна трапеза\n\n**Результат**\n\nДотримуючись цих практик правильно, батько Індрасени вийшов з нижчих світів і досяг **Вішну-локи** — перевершивши навіть небесні царства.\n\n**Благословення:**\n«Ті, хто розповідає, слухає та дотримується цього екадаші, досягають повного очищення від гріхів та вічного перебування на Вішну-лоці.»',

  glory_text_en = E'**Dialogue between Yudhishthira and Krishna**\n\nYudhishthira inquired from Lord Krishna about the Ekadashi observed in the dark fortnight of Ashvina (Padmanabha). Lord Krishna replied: "This Ekadashi is called Indira. It destroys great sins and rescues ancestors from lower realms."\n\n**The Story of King Indrasena**\n\nIn Satya-yuga there lived a righteous monarch named Indrasena. He was characterized by:\n• Unwavering devotion to Vishnu\n• Constant repetition of Govinda''s names for liberation\n• Regular practice of spiritual meditation\n\n**The Message from Narada**\n\nThe sage Narada brought troubling news: Indrasena''s father, despite his earthly piety, erred in performing certain rituals and consequently suffered rebirth in Yamaraja''s domains rather than heaven.\n\nThrough Narada, the father''s message reached his son: "Son, performing Indira Ekadashi correctly will grant me the merit to ascend to Vishnu-Loka." This exchange demonstrates a profound principle—**the fruits of virtuous action can be transferred to beneficiaries**.\n\n**The Three-Day Protocol**\n\n**Day 10 (Dashami):** Morning and noon bathing, ancestor offerings with faith\n\n**Day 11 (Ekadashi):** Fasting, mouth-rinsing without tooth-cleaning, vow recitation, Shalagrama-stone worship, nocturnal vigil\n\n**Day 12 (Dvadashi):** Deity worship, ancestor rituals with grains, brahmin veneration with gifts, concluding feast\n\n**The Outcome**\n\nFollowing these practices correctly, Indrasena''s father transcended the underworld and attained **Vishnu-Loka**—surpassing mere celestial realms entirely.\n\n**Benediction:**\n"Narrators, listeners, and observers achieve complete sin-removal and eternal residence in Vishnu-Loka."',

  story_ua = E'Цар Індрасена був відомий своєю відданістю Господу Вішну. Одного дня до нього прийшов мудрець Нарада з тривожною звісткою: його померлий батько, попри свою побожність за життя, опинився у царстві Ямараджі через помилки в ритуалах.\n\nБатько через Нараду передав сину прохання дотримуватись Індіра Екадаші, щоб заслуга цього посту допомогла йому вирватись з нижчих світів.\n\nІндрасена ретельно виконав усі приписи: на Дашамі він омився та здійснив підношення предкам, на Екадаші постив та не спав всю ніч, поклоняючись Шалаґрама-шілі, а на Двадаші здійснив ритуали та нагодував брахманів.\n\nВнаслідок цих практик його батько був звільнений і досяг Вішну-локи — вищого духовного царства.',

  story_en = E'King Indrasena was renowned for his devotion to Lord Vishnu. One day, the sage Narada came to him with troubling news: his deceased father, despite his piety during life, had ended up in Yamaraja''s kingdom due to errors in performing rituals.\n\nThrough Narada, his father sent a request to observe Indira Ekadashi, so that the merit of this fast would help him escape from the lower worlds.\n\nIndrasena carefully followed all the prescriptions: on Dashami he bathed and made offerings to ancestors, on Ekadashi he fasted and stayed awake all night worshiping Shalagrama-shila, and on Dvadashi he performed rituals and fed brahmanas.\n\nAs a result of these practices, his father was liberated and attained Vishnu-loka—the supreme spiritual realm.',

  benefits_ua = E'• Знищення великих гріхів\n• Визволення предків з нижчих царств (особливо важливо для шраддхи)\n• Передача заслуги померлим родичам\n• Вічне перебування на Вішну-лоці\n• Благословення для тих, хто розповідає, слухає та дотримується',

  benefits_en = E'• Destruction of great sins\n• Liberation of ancestors from lower realms (especially important for shraddha)\n• Transfer of merit to deceased relatives\n• Eternal residence in Vishnu-loka\n• Blessings for narrators, listeners, and observers',

  recommended_activities_ua = E'**Дашамі (день перед):**\n• Ранкове та полуденне омивання\n• Підношення предкам (тарпана)\n\n**Екадаші:**\n• Повний піст\n• Полоскання рота без чищення зубів\n• Проголошення обітниці посту\n• Поклоніння Шалаґрама-шілі\n• Нічне неспання (джаґарана)\n\n**Двадаші:**\n• Поклоніння Божеству\n• Шраддха-ритуали із зерновими\n• Вшанування та годування брахманів\n• Завершальна трапеза',

  recommended_activities_en = E'**Dashami (day before):**\n• Morning and noon bathing\n• Offerings to ancestors (tarpana)\n\n**Ekadashi:**\n• Complete fast\n• Mouth-rinsing without tooth-cleaning\n• Recitation of fasting vow\n• Worship of Shalagrama-shila\n• Nocturnal vigil (jagarana)\n\n**Dvadashi:**\n• Deity worship\n• Shraddha rituals with grains\n• Honoring and feeding brahmanas\n• Concluding feast',

  updated_at = now()

WHERE slug = 'indira-ekadashi';

-- ============================================
-- 4. LINK EKADASHIS TO PADMA PURANA BOOK
-- ============================================

-- Add column for book reference if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ekadashi_info' AND column_name = 'padma_purana_chapter'
  ) THEN
    ALTER TABLE ekadashi_info
      ADD COLUMN padma_purana_chapter INTEGER,
      ADD COLUMN padma_purana_book_slug TEXT DEFAULT 'pp';
  END IF;
END $$;

-- Set Padma Purana chapter references (Uttara-khanda)
UPDATE ekadashi_info SET padma_purana_chapter = 23 WHERE slug = 'kamada-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 24 WHERE slug = 'varuthini-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 25 WHERE slug = 'mohini-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 26 WHERE slug = 'apara-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 27 WHERE slug = 'nirjala-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 28 WHERE slug = 'yogini-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 29 WHERE slug = 'devashayani-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 30 WHERE slug = 'kamika-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 31 WHERE slug = 'shravana-putrada-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 32 WHERE slug = 'aja-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 57 WHERE slug = 'padma-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 33 WHERE slug = 'parivartini-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 34 WHERE slug = 'indira-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 35 WHERE slug = 'papankusha-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 36 WHERE slug = 'rama-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 37 WHERE slug = 'prabodhini-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 38 WHERE slug = 'utpanna-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 39 WHERE slug = 'mokshada-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 40 WHERE slug = 'saphala-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 41 WHERE slug = 'pausha-putrada-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 42 WHERE slug = 'sat-tila-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 43 WHERE slug = 'jaya-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 44 WHERE slug = 'vijaya-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 45 WHERE slug = 'amalaki-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 46 WHERE slug = 'padmini-ekadashi';
UPDATE ekadashi_info SET padma_purana_chapter = 47 WHERE slug = 'parama-ekadashi';

COMMIT;
