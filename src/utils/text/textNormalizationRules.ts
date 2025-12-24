/**
 * Text Normalization Rules for Gaudiya Vaishnava philosophy texts
 *
 * Based on editorial standards from:
 * https://docs.google.com/spreadsheets/d/1YZT4-KaQBeEZu7R9qysirdt8yb-9psOIkXCalDPLuwY/edit?gid=627477148#gid=627477148
 *
 * This file contains rules extracted from the official translation glossary
 * maintained by the Gaudiya Vaishnava translation team.
 */

export interface NormalizationRule {
  id: string;
  incorrect: string;
  correct: string;
  category: string;
  description?: string;
  caseSensitive?: boolean;
  regex?: boolean;
}

export interface RuleCategory {
  id: string;
  name_ua: string;
  name_en: string;
  description_ua?: string;
  description_en?: string;
}

/**
 * Categories of normalization rules
 */
export const ruleCategories: RuleCategory[] = [
  {
    id: "transliteration",
    name_ua: "Транслітерація",
    name_en: "Transliteration",
    description_ua: "Правила транслітерації санскритських термінів (бх→бг, г→ґ)",
    description_en: "Sanskrit transliteration rules (bh→bg, g→ґ)",
  },
  {
    id: "names",
    name_ua: "Імена та терміни",
    name_en: "Names and terms",
    description_ua: "Стандартизація написання імен та термінів",
    description_en: "Standardize names and terms spelling",
  },
  {
    id: "scriptures",
    name_ua: "Назви писань",
    name_en: "Scripture names",
    description_ua: "Правильне написання назв священних писань",
    description_en: "Correct spelling of scripture names",
  },
  {
    id: "apostrophe",
    name_ua: "Апострофи та м'який знак",
    name_en: "Apostrophes and soft sign",
    description_ua: "Правила використання апострофа (санн'ясі→санньясі, від'я→відья)",
    description_en: "Apostrophe usage rules",
  },
  {
    id: "consonants",
    name_ua: "Приголосні",
    name_en: "Consonants",
    description_ua: "Виправлення придихових приголосних (джг→джх, тг→тх)",
    description_en: "Aspirated consonants fixes",
  },
  {
    id: "typography",
    name_ua: "Типографіка",
    name_en: "Typography",
    description_ua: "Типографічні виправлення (тире, лапки, пробіли)",
    description_en: "Typography fixes (dashes, quotes, spaces)",
  },
  {
    id: "translation",
    name_ua: "Переклад термінів",
    name_en: "Term translation",
    description_ua: "Стандартні переклади англійських термінів",
    description_en: "Standard translations of English terms",
  },
  {
    id: "custom",
    name_ua: "Користувацькі",
    name_en: "Custom",
    description_ua: "Користувацькі правила",
    description_en: "Custom rules",
  },
];

/**
 * Default normalization rules based on Gaudiya Vaishnava editorial standards
 * Extracted from: https://docs.google.com/spreadsheets/d/1YZT4-KaQBeEZu7R9qysirdt8yb-9psOIkXCalDPLuwY
 */
export const defaultRules: NormalizationRule[] = [
  // =====================================================
  // ТРАНСЛІТЕРАЦІЯ: бх → бг (основне правило)
  // =====================================================
  {
    id: "translit_bh_bg_1",
    incorrect: "Бхаґаватам",
    correct: "Бгаґаватам",
    category: "transliteration",
    description: "Бхаґаватам → Бгаґаватам",
  },
  {
    id: "translit_bh_bg_2",
    incorrect: "Бхагаватам",
    correct: "Бгаґаватам",
    category: "transliteration",
    description: "Бхагаватам → Бгаґаватам",
  },
  {
    id: "translit_bh_bg_3",
    incorrect: "бхаґаватам",
    correct: "бгаґаватам",
    category: "transliteration",
    description: "бхаґаватам → бгаґаватам",
  },
  {
    id: "translit_bh_bg_4",
    incorrect: "Бхаґавад",
    correct: "Бгаґавад",
    category: "transliteration",
    description: "Бхаґавад → Бгаґавад",
  },
  {
    id: "translit_bh_bg_5",
    incorrect: "Бхагавад",
    correct: "Бгаґавад",
    category: "transliteration",
    description: "Бхагавад → Бгаґавад",
  },
  {
    id: "translit_bh_bg_6",
    incorrect: "бхаґавад",
    correct: "бгаґавад",
    category: "transliteration",
    description: "бхаґавад → бгаґавад",
  },
  {
    id: "translit_bh_bg_7",
    incorrect: "Бхаґаван",
    correct: "Бгаґаван",
    category: "transliteration",
    description: "Бхаґаван → Бгаґаван",
  },
  {
    id: "translit_bh_bg_8",
    incorrect: "бхаґаван",
    correct: "бгаґаван",
    category: "transliteration",
    description: "бхаґаван → бгаґаван",
  },
  {
    id: "translit_bh_bg_9",
    incorrect: "Бхакті",
    correct: "Бгакті",
    category: "transliteration",
    description: "Бхакті → Бгакті",
  },
  {
    id: "translit_bh_bg_10",
    incorrect: "бхакті",
    correct: "бгакті",
    category: "transliteration",
    description: "бхакті → бгакті",
  },
  {
    id: "translit_bh_bg_11",
    incorrect: "Прабхупада",
    correct: "Прабгупада",
    category: "transliteration",
    description: "Прабхупада → Прабгупада",
  },
  {
    id: "translit_bh_bg_12",
    incorrect: "прабхупада",
    correct: "прабгупада",
    category: "transliteration",
    description: "прабхупада → прабгупада",
  },
  {
    id: "translit_bh_bg_13",
    incorrect: "Махапрабху",
    correct: "Махапрабгу",
    category: "transliteration",
    description: "Махапрабху → Махапрабгу",
  },
  {
    id: "translit_bh_bg_14",
    incorrect: "махапрабху",
    correct: "махапрабгу",
    category: "transliteration",
    description: "махапрабху → махапрабгу",
  },
  {
    id: "translit_bh_bg_15",
    incorrect: "прабху",
    correct: "прабгу",
    category: "transliteration",
    description: "прабху → прабгу",
  },
  {
    id: "translit_bh_bg_16",
    incorrect: "Брахман",
    correct: "Брахман",
    category: "transliteration",
    description: "Брахман (залишаємо х після р)",
    caseSensitive: true,
  },
  {
    id: "translit_bh_bg_17",
    incorrect: "Брагман",
    correct: "Брахман",
    category: "transliteration",
    description: "Брагман → Брахман",
  },
  {
    id: "translit_bh_bg_18",
    incorrect: "брагман",
    correct: "брахман",
    category: "transliteration",
    description: "брагман → брахман",
  },

  // =====================================================
  // ТРАНСЛІТЕРАЦІЯ: г → ґ (українське ґ)
  // =====================================================
  {
    id: "translit_g_g_1",
    incorrect: "гуру",
    correct: "ґуру",
    category: "transliteration",
    description: "гуру → ґуру",
    caseSensitive: true,
  },
  {
    id: "translit_g_g_2",
    incorrect: "Гуру",
    correct: "Ґуру",
    category: "transliteration",
    description: "Гуру → Ґуру",
    caseSensitive: true,
  },
  {
    id: "translit_g_g_3",
    incorrect: "Говінда",
    correct: "Ґовінда",
    category: "transliteration",
    description: "Говінда → Ґовінда",
  },
  {
    id: "translit_g_g_4",
    incorrect: "говінда",
    correct: "ґовінда",
    category: "transliteration",
    description: "говінда → ґовінда",
  },
  {
    id: "translit_g_g_5",
    incorrect: "Голока",
    correct: "Ґолока",
    category: "transliteration",
    description: "Голока → Ґолока",
  },
  {
    id: "translit_g_g_6",
    incorrect: "голока",
    correct: "ґолока",
    category: "transliteration",
    description: "голока → ґолока",
  },
  {
    id: "translit_g_g_7",
    incorrect: "Госвамі",
    correct: "Ґосвамі",
    category: "transliteration",
    description: "Госвамі → Ґосвамі",
  },
  {
    id: "translit_g_g_8",
    incorrect: "госвамі",
    correct: "ґосвамі",
    category: "transliteration",
    description: "госвамі → ґосвамі",
  },
  {
    id: "translit_g_g_9",
    incorrect: "гіта",
    correct: "ґіта",
    category: "transliteration",
    description: "гіта → ґіта",
    caseSensitive: true,
  },
  {
    id: "translit_g_g_10",
    incorrect: "Гіта",
    correct: "Ґіта",
    category: "transliteration",
    description: "Гіта → Ґіта",
    caseSensitive: true,
  },
  {
    id: "translit_g_g_11",
    incorrect: "гаудія",
    correct: "ґаудія",
    category: "transliteration",
    description: "гаудія → ґаудія",
    caseSensitive: true,
  },
  {
    id: "translit_g_g_12",
    incorrect: "Гаудія",
    correct: "Ґаудія",
    category: "transliteration",
    description: "Гаудія → Ґаудія",
    caseSensitive: true,
  },
  {
    id: "translit_g_g_13",
    incorrect: "гуни",
    correct: "ґуни",
    category: "transliteration",
    description: "гуни → ґуни",
    caseSensitive: true,
  },
  {
    id: "translit_g_g_14",
    incorrect: "гуна",
    correct: "ґуна",
    category: "transliteration",
    description: "гуна → ґуна",
    caseSensitive: true,
  },
  {
    id: "translit_g_g_15",
    incorrect: "Гаятрі",
    correct: "Ґаятрі",
    category: "transliteration",
    description: "Гаятрі → Ґаятрі",
  },
  {
    id: "translit_g_g_16",
    incorrect: "гаятрі",
    correct: "ґаятрі",
    category: "transliteration",
    description: "гаятрі → ґаятрі",
  },
  {
    id: "translit_g_g_17",
    incorrect: "Гаруда",
    correct: "Ґаруда",
    category: "transliteration",
    description: "Гаруда → Ґаруда",
  },
  {
    id: "translit_g_g_18",
    incorrect: "гаруда",
    correct: "ґаруда",
    category: "transliteration",
    description: "гаруда → ґаруда",
  },

  // =====================================================
  // АПОСТРОФИ: санн'яс → санньяс, від'я → відья
  // =====================================================
  {
    id: "apostrophe_sannyasa_1",
    incorrect: "санн'ясі",
    correct: "санньясі",
    category: "apostrophe",
    description: "санн'ясі → санньясі",
  },
  {
    id: "apostrophe_sannyasa_2",
    incorrect: "Санн'ясі",
    correct: "Санньясі",
    category: "apostrophe",
    description: "Санн'ясі → Санньясі",
  },
  {
    id: "apostrophe_sannyasa_3",
    incorrect: "санн'яса",
    correct: "санньяса",
    category: "apostrophe",
    description: "санн'яса → санньяса",
  },
  {
    id: "apostrophe_sannyasa_4",
    incorrect: "Санн'яса",
    correct: "Санньяса",
    category: "apostrophe",
    description: "Санн'яса → Санньяса",
  },
  {
    id: "apostrophe_sannyasa_5",
    incorrect: "санн'яс",
    correct: "санньяс",
    category: "apostrophe",
    description: "санн'яс → санньяс (всі форми)",
  },
  {
    id: "apostrophe_vidya_1",
    incorrect: "від'я",
    correct: "відья",
    category: "apostrophe",
    description: "від'я → відья",
  },
  {
    id: "apostrophe_vidya_2",
    incorrect: "Від'я",
    correct: "Відья",
    category: "apostrophe",
    description: "Від'я → Відья",
  },
  {
    id: "apostrophe_gyana_1",
    incorrect: "ґ'яна",
    correct: "ґ'яна",
    category: "apostrophe",
    description: "ґ'яна (зберігаємо апостроф)",
    caseSensitive: true,
  },
  {
    id: "apostrophe_vyasa_1",
    incorrect: "Вяса",
    correct: "В'яса",
    category: "apostrophe",
    description: "Вяса → В'яса",
  },
  {
    id: "apostrophe_antaryami_1",
    incorrect: "антарямі",
    correct: "антар'ямі",
    category: "apostrophe",
    description: "антарямі → антар'ямі",
  },
  {
    id: "apostrophe_achintya_1",
    incorrect: "ачінтя",
    correct: "ачінтья",
    category: "apostrophe",
    description: "ачінтя → ачінтья",
  },
  {
    id: "apostrophe_tatparya_1",
    incorrect: "татпар'я",
    correct: "татпар'я",
    category: "apostrophe",
    description: "татпар'я (зберігаємо апостроф)",
    caseSensitive: true,
  },
  {
    id: "apostrophe_chaitanya_1",
    incorrect: "Чайтаньа",
    correct: "Чайтанья",
    category: "apostrophe",
    description: "Чайтаньа → Чайтанья",
  },

  // =====================================================
  // ПРИГОЛОСНІ: джг → джх, тг → тх (аспірація)
  // =====================================================
  {
    id: "consonant_jjh_1",
    incorrect: "джджг",
    correct: "джджх",
    category: "consonants",
    description: "джджг → джджх (аспірація)",
  },
  {
    id: "consonant_jh_1",
    incorrect: "джг",
    correct: "джх",
    category: "consonants",
    description: "джг → джх (аспірація)",
  },
  {
    id: "consonant_th_1",
    incorrect: "Ведартга",
    correct: "Ведартха",
    category: "consonants",
    description: "Ведартга → Ведартха (придих після т)",
  },
  {
    id: "consonant_th_2",
    incorrect: "ведартга",
    correct: "ведартха",
    category: "consonants",
    description: "ведартга → ведартха",
  },
  {
    id: "consonant_th_3",
    incorrect: "Самграга",
    correct: "Санґраха",
    category: "consonants",
    description: "Самграга → Санґраха",
  },

  // =====================================================
  // ІМЕНА ТА ТЕРМІНИ (з документа)
  // =====================================================
  {
    id: "name_vayu_1",
    incorrect: "Вайю",
    correct: "Ваю",
    category: "names",
    description: "Вайю → Ваю",
  },
  {
    id: "name_vayu_2",
    incorrect: "вайю",
    correct: "ваю",
    category: "names",
    description: "вайю → ваю",
  },
  {
    id: "name_vaishnav_1",
    incorrect: "Вайшнава",
    correct: "вайшнав",
    category: "names",
    description: "Вайшнава → вайшнав (чоловічий рід)",
  },
  {
    id: "name_hanuman_1",
    incorrect: "Гануман",
    correct: "Хануман",
    category: "names",
    description: "Гануман → Хануман",
  },
  {
    id: "name_hanuman_2",
    incorrect: "гануман",
    correct: "хануман",
    category: "names",
    description: "гануман → хануман",
  },
  {
    id: "name_hare_1",
    incorrect: "Гаре",
    correct: "Харе",
    category: "names",
    description: "Гаре → Харе",
  },
  {
    id: "name_gopal_1",
    incorrect: "Ґопала Бгатта",
    correct: "Ґопал Бгатта",
    category: "names",
    description: "Ґопала Бгатта → Ґопал Бгатта",
  },
  {
    id: "name_thakur_1",
    incorrect: "Тхакура",
    correct: "Тхакур",
    category: "names",
    description: "Тхакура → Тхакур",
  },
  {
    id: "name_dhananjay_1",
    incorrect: "Дгананджая",
    correct: "Дгананджай",
    category: "names",
    description: "Дгананджая → Дгананджай",
  },
  {
    id: "name_srinjay_1",
    incorrect: "Срінджая",
    correct: "Срінджай",
    category: "names",
    description: "Срінджая → Срінджай",
  },
  {
    id: "name_karttikeya_1",
    incorrect: "Карттікея",
    correct: "Картікея",
    category: "names",
    description: "Карттікея → Картікея (одна т)",
  },
  {
    id: "name_karttikeya_2",
    incorrect: "карттікея",
    correct: "картікея",
    category: "names",
    description: "карттікея → картікея",
  },
  {
    id: "name_himalaya_1",
    incorrect: "Гімалая",
    correct: "Гімалаї",
    category: "names",
    description: "Гімалая → Гімалаї",
  },
  {
    id: "name_kaikeyi_1",
    incorrect: "Кайкейі",
    correct: "Кайкеї",
    category: "names",
    description: "Кайкейі → Кайкеї",
  },
  {
    id: "name_phulia_1",
    incorrect: "Фуліа",
    correct: "Фулія",
    category: "names",
    description: "Фуліа → Фулія",
  },

  // =====================================================
  // НАЗВИ ПИСАНЬ
  // =====================================================
  {
    id: "scripture_agni_1",
    incorrect: "Агні Пурана",
    correct: "Аґні Пурана",
    category: "scriptures",
    description: "Агні Пурана → Аґні Пурана",
  },
  {
    id: "scripture_atharva_1",
    incorrect: "Атхарваведа",
    correct: "Атхарва Веда",
    category: "scriptures",
    description: "Атхарваведа → Атхарва Веда",
  },
  {
    id: "scripture_atharva_2",
    incorrect: "Атхарва-веда",
    correct: "Атхарва Веда",
    category: "scriptures",
    description: "Атхарва-веда → Атхарва Веда",
  },
  {
    id: "scripture_vishnu_1",
    incorrect: "Вішну-пурана",
    correct: "Вішну Пурана",
    category: "scriptures",
    description: "Вішну-пурана → Вішну Пурана",
  },
  {
    id: "scripture_garuda_1",
    incorrect: "Ґаруда-пурана",
    correct: "Ґаруда Пурана",
    category: "scriptures",
    description: "Ґаруда-пурана → Ґаруда Пурана",
  },
  {
    id: "scripture_bhagavata_1",
    incorrect: "Бгаґавата-пурана",
    correct: "Бгаґавата Пурана",
    category: "scriptures",
    description: "Бгаґавата-пурана → Бгаґавата Пурана",
  },
  {
    id: "scripture_brahmasutra_1",
    incorrect: "Брагма-сутра",
    correct: "Брахма-сутра",
    category: "scriptures",
    description: "Брагма-сутра → Брахма-сутра",
  },
  {
    id: "scripture_vedanta_1",
    incorrect: "Веданта сутра",
    correct: "Веданта-сутра",
    category: "scriptures",
    description: "Веданта сутра → Веданта-сутра",
  },
  {
    id: "scripture_gitopanishad_1",
    incorrect: "Ґітопанішад",
    correct: "Ґітопанішада",
    category: "scriptures",
    description: "Ґітопанішад → Ґітопанішада",
  },
  {
    id: "scripture_brihat_1",
    incorrect: "Брігатсама",
    correct: "Бріхат-сама",
    category: "scriptures",
    description: "Брігатсама → Бріхат-сама",
  },
  {
    id: "scripture_shatapatha_1",
    incorrect: "Шатапатха-брагмана",
    correct: "Шатапатха-брахмана",
    category: "scriptures",
    description: "Шатапатха-брагмана → Шатапатха-брахмана",
  },
  {
    id: "scripture_taittiriya_1",
    incorrect: "Тайттірія-брагмана",
    correct: "Тайттірія-брахмана",
    category: "scriptures",
    description: "Тайттірія-брагмана → Тайттірія-брахмана",
  },
  {
    id: "scripture_brihadaranyaka_1",
    incorrect: "Бріхад-араньака",
    correct: "Бріхад-араньяка-упанішада",
    category: "scriptures",
    description: "Бріхад-араньака → Бріхад-араньяка-упанішада",
  },

  // =====================================================
  // ТЕРМІНИ (з документа)
  // =====================================================
  {
    id: "term_advaita_1",
    incorrect: "адвайта веданта",
    correct: "адвайта-веданта",
    category: "names",
    description: "адвайта веданта → адвайта-веданта",
  },
  {
    id: "term_vishishtadvaita_1",
    incorrect: "вішішта адвайта",
    correct: "вішішта-адвайта",
    category: "names",
    description: "вішішта адвайта → вішішта-адвайта",
  },
  {
    id: "term_vaisnavism_1",
    incorrect: "вайшнавізм",
    correct: "вайшнавізм",
    category: "names",
    description: "вайшнавізм (правильно)",
    caseSensitive: true,
  },
  {
    id: "term_gaudiya_1",
    incorrect: "ґаудія вайшнавізм",
    correct: "ґаудія-вайшнавізм",
    category: "names",
    description: "ґаудія вайшнавізм → ґаудія-вайшнавізм",
  },
  {
    id: "term_sachchidananda_1",
    incorrect: "сат-чіт-ананда",
    correct: "сач-чід-ананда",
    category: "names",
    description: "сат-чіт-ананда → сач-чід-ананда",
  },
  {
    id: "term_yogamaya_1",
    incorrect: "йоґа-мая",
    correct: "йоґамая",
    category: "names",
    description: "йоґа-мая → йоґамая",
  },
  {
    id: "term_mahamaya_1",
    incorrect: "маха-мая",
    correct: "махамая",
    category: "names",
    description: "маха-мая → махамая",
  },
  {
    id: "term_devamaya_1",
    incorrect: "дева-мая",
    correct: "девамая",
    category: "names",
    description: "дева-мая → девамая",
  },
  {
    id: "term_parabrahman_1",
    incorrect: "Пара-брахман",
    correct: "Парабрахман",
    category: "names",
    description: "Пара-брахман → Парабрахман",
  },
  {
    id: "term_vishnutattva_1",
    incorrect: "Вішну таттва",
    correct: "вішну-таттва",
    category: "names",
    description: "Вішну таттва → вішну-таттва",
  },
  {
    id: "term_ashvamedha_1",
    incorrect: "Ашвамедга",
    correct: "ашвамедга",
    category: "names",
    description: "Ашвамедга → ашвамедга (з малої)",
  },
  {
    id: "term_mahamantra_1",
    incorrect: "Маха-мантра",
    correct: "маха-мантра",
    category: "names",
    description: "Маха-мантра → маха-мантра (з малої)",
  },
  {
    id: "term_digvijay_1",
    incorrect: "Діґвіджая",
    correct: "діґвіджай",
    category: "names",
    description: "Діґвіджая → діґвіджай (з малої)",
  },
  {
    id: "term_lakh_1",
    incorrect: "лакхи",
    correct: "лакхів",
    category: "names",
    description: "лакхи → лакхів (відмінювання)",
  },
  {
    id: "term_mataji_1",
    incorrect: "матаджі",
    correct: "матаджі",
    category: "names",
    description: "матаджі (правильно)",
    caseSensitive: true,
  },
  {
    id: "term_maharaj_1",
    incorrect: "Ґуру Махарадж",
    correct: "ґуру махарадж",
    category: "names",
    description: "Ґуру Махарадж → ґуру махарадж (з малої)",
  },

  // =====================================================
  // ПЕРЕКЛАД ТЕРМІНІВ (з другого документа)
  // =====================================================
  {
    id: "transl_false_ego",
    incorrect: "помилкове его",
    correct: "оманне его",
    category: "translation",
    description: "помилкове его → оманне его",
  },
  {
    id: "transl_spirit_soul",
    incorrect: "духова душа",
    correct: "духовна душа",
    category: "translation",
    description: "духова душа → духовна душа",
  },
  {
    id: "transl_goddess",
    incorrect: "богиня процвітання",
    correct: "богиня щастя",
    category: "translation",
    description: "богиня процвітання → богиня щастя",
  },
  {
    id: "transl_householder",
    incorrect: "домовласник",
    correct: "домогосподар",
    category: "translation",
    description: "домовласник → домогосподар",
  },
  {
    id: "transl_bona_fide",
    incorrect: "справжній духовний",
    correct: "істинний духовний",
    category: "translation",
    description: "справжній духовний → істинний духовний (bona fide)",
  },
  {
    id: "transl_demigod",
    incorrect: "напівбог",
    correct: "півбог",
    category: "translation",
    description: "напівбог → півбог (основний варіант)",
  },
  {
    id: "transl_devotee_1",
    incorrect: "чистий бхакта",
    correct: "чистий відданий",
    category: "translation",
    description: "чистий бхакта → чистий відданий",
  },
  {
    id: "transl_penance",
    incorrect: "покаяння",
    correct: "аскеза",
    category: "translation",
    description: "покаяння → аскеза (penance)",
  },
  {
    id: "transl_liberation_1",
    incorrect: "освобождення",
    correct: "визволення",
    category: "translation",
    description: "освобождення → визволення",
  },
  {
    id: "transl_rounds",
    incorrect: "раундів",
    correct: "кіл",
    category: "translation",
    description: "раундів → кіл (16 кіл)",
  },

  // =====================================================
  // ТИПОГРАФІКА
  // =====================================================
  {
    id: "typo_dash_1",
    incorrect: " - ",
    correct: " — ",
    category: "typography",
    description: "Дефіс → тире",
  },
  {
    id: "typo_dash_2",
    incorrect: "--",
    correct: "—",
    category: "typography",
    description: "Подвійний дефіс → тире",
  },
  {
    id: "typo_ellipsis",
    incorrect: "...",
    correct: "…",
    category: "typography",
    description: "Три крапки → еліпсис",
  },
  {
    id: "typo_ending_love",
    incorrect: "любови",
    correct: "любові",
    category: "typography",
    description: "любови → любові (закінчення -і)",
  },
  {
    id: "typo_ending_passion",
    incorrect: "пристрасти",
    correct: "пристрасті",
    category: "typography",
    description: "пристрасти → пристрасті (закінчення -і)",
  },
  {
    id: "typo_ending_death",
    incorrect: "смерти",
    correct: "смерті",
    category: "typography",
    description: "смерти → смерті (закінчення -і)",
  },
];

/**
 * Parse CSV content into normalization rules
 */
export function parseCSVRules(csvContent: string): NormalizationRule[] {
  const lines = csvContent.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const incorrectIdx = headers.findIndex((h) =>
    h.includes("incorrect") || h.includes("неправильн") || h.includes("from") ||
    h.includes("під питанням") || h.includes("фраза")
  );
  const correctIdx = headers.findIndex((h) =>
    h.includes("correct") || h.includes("правильн") || h.includes("to") ||
    h.includes("затверджен") || h.includes("остаточн") || h.includes("переклад")
  );
  const categoryIdx = headers.findIndex((h) => h.includes("category") || h.includes("категор"));
  const descriptionIdx = headers.findIndex((h) => h.includes("description") || h.includes("опис") || h.includes("comment") || h.includes("комент"));

  // If standard columns not found, try first two columns
  const col1 = incorrectIdx !== -1 ? incorrectIdx : 0;
  const col2 = correctIdx !== -1 ? correctIdx : 1;

  const rules: NormalizationRule[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 2) continue;

    const incorrect = values[col1]?.trim();
    const correct = values[col2]?.trim();

    if (!incorrect || !correct || incorrect === correct) continue;
    // Skip if correct contains complex instructions (multiple options)
    if (correct.includes(" / ") || correct.includes("(") || correct.length > 100) continue;

    rules.push({
      id: `custom_${i}`,
      incorrect,
      correct,
      category: categoryIdx !== -1 ? values[categoryIdx]?.trim() || "custom" : "custom",
      description: descriptionIdx !== -1 ? values[descriptionIdx]?.trim() : `${incorrect} → ${correct}`,
    });
  }

  return rules;
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);

  return values;
}

/**
 * Parse tab-separated content (for Excel paste)
 */
export function parseTSVRules(tsvContent: string): NormalizationRule[] {
  const lines = tsvContent.trim().split("\n");
  const rules: NormalizationRule[] = [];

  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split("\t").map((p) => p.trim());
    if (parts.length < 2) continue;

    const incorrect = parts[0];
    const correct = parts[1];

    if (!incorrect || !correct || incorrect === correct) continue;

    rules.push({
      id: `tsv_${i}`,
      incorrect,
      correct,
      category: parts[2] || "custom",
      description: parts[3] || `${incorrect} → ${correct}`,
    });
  }

  return rules;
}

/**
 * Parse simple text file with "incorrect → correct" or "incorrect -> correct" format
 */
export function parseTextRules(textContent: string): NormalizationRule[] {
  const lines = textContent.trim().split("\n");
  const rules: NormalizationRule[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("#") || line.startsWith("//")) continue;

    // Try different separators
    let parts: string[] = [];
    if (line.includes("→")) {
      parts = line.split("→").map((p) => p.trim());
    } else if (line.includes("->")) {
      parts = line.split("->").map((p) => p.trim());
    } else if (line.includes("=>")) {
      parts = line.split("=>").map((p) => p.trim());
    } else if (line.includes("\t")) {
      parts = line.split("\t").map((p) => p.trim());
    }

    if (parts.length < 2) continue;

    const incorrect = parts[0];
    const correct = parts[1];

    if (!incorrect || !correct || incorrect === correct) continue;

    rules.push({
      id: `text_${i}`,
      incorrect,
      correct,
      category: "custom",
      description: parts[2] || `${incorrect} → ${correct}`,
    });
  }

  return rules;
}

/**
 * Apply normalization rules to text
 */
export function applyNormalizationRules(
  text: string,
  rules: NormalizationRule[],
  enabledCategories?: Set<string>
): { result: string; changes: NormalizationChange[] } {
  let result = text;
  const changes: NormalizationChange[] = [];

  for (const rule of rules) {
    // Skip if category filtering is enabled and this category is not enabled
    if (enabledCategories && !enabledCategories.has(rule.category)) {
      continue;
    }

    // Skip rules that would replace with the same value
    if (rule.incorrect === rule.correct) continue;

    const flags = rule.caseSensitive ? "g" : "gi";

    let pattern: RegExp;
    if (rule.regex) {
      try {
        pattern = new RegExp(rule.incorrect, flags);
      } catch {
        pattern = new RegExp(escapeRegExp(rule.incorrect), flags);
      }
    } else {
      pattern = new RegExp(escapeRegExp(rule.incorrect), flags);
    }

    let match;
    const tempResult = result;
    while ((match = pattern.exec(tempResult)) !== null) {
      changes.push({
        ruleId: rule.id,
        original: match[0],
        replacement: rule.correct,
        position: match.index,
        category: rule.category,
      });
      // Prevent infinite loop for zero-length matches
      if (match.index === pattern.lastIndex) {
        pattern.lastIndex++;
      }
    }

    result = result.replace(pattern, rule.correct);
  }

  return { result, changes };
}

export interface NormalizationChange {
  ruleId: string;
  original: string;
  replacement: string;
  position: number;
  category: string;
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Get statistics about applied changes
 */
export function getChangeStatistics(changes: NormalizationChange[]): Record<string, number> {
  const stats: Record<string, number> = {};

  for (const change of changes) {
    if (!stats[change.category]) {
      stats[change.category] = 0;
    }
    stats[change.category]++;
  }

  return stats;
}

/**
 * Merge custom rules with default rules
 */
export function mergeRules(
  customRules: NormalizationRule[],
  includeDefaults: boolean = true
): NormalizationRule[] {
  if (!includeDefaults) {
    return customRules;
  }

  // Custom rules take precedence (by id)
  const customIds = new Set(customRules.map((r) => r.id));
  const filteredDefaults = defaultRules.filter((r) => !customIds.has(r.id));

  return [...customRules, ...filteredDefaults];
}

/**
 * Export rules to CSV format
 */
export function exportRulesToCSV(rules: NormalizationRule[]): string {
  const headers = ["id", "incorrect", "correct", "category", "description"];
  const lines = [headers.join(",")];

  for (const rule of rules) {
    const values = [
      rule.id,
      `"${rule.incorrect.replace(/"/g, '""')}"`,
      `"${rule.correct.replace(/"/g, '""')}"`,
      rule.category,
      rule.description ? `"${rule.description.replace(/"/g, '""')}"` : "",
    ];
    lines.push(values.join(","));
  }

  return lines.join("\n");
}

/**
 * Google Sheets URL for the official rules document
 */
export const RULES_DOCUMENT_URL = "https://docs.google.com/spreadsheets/d/1YZT4-KaQBeEZu7R9qysirdt8yb-9psOIkXCalDPLuwY/edit?gid=627477148#gid=627477148";
