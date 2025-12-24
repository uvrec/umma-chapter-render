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
    description_ua: "Правила транслітерації санскритських термінів",
    description_en: "Sanskrit transliteration rules",
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
    description_ua: "Правильне написання назв священних писань (у лапках «»)",
    description_en: "Correct spelling of scripture names (in quotes «»)",
  },
  {
    id: "apostrophe",
    name_ua: "Апострофи",
    name_en: "Apostrophes",
    description_ua: "Правила використання апострофа",
    description_en: "Apostrophe usage rules",
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
    description_ua: "Стандартні переклади англійських термінів українською",
    description_en: "Standard translations of English terms to Ukrainian",
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
  // НАЗВИ ПИСАНЬ (у лапках «»)
  // =====================================================
  { id: "scripture_amarakosha", incorrect: "Aмаракоша", correct: "«Амаракоша»", category: "scriptures" },
  { id: "scripture_atharva", incorrect: "Aтхарваведа", correct: "«Атхарва Веда»", category: "scriptures" },
  { id: "scripture_atharva2", incorrect: "Атхарваведа", correct: "«Атхарва Веда»", category: "scriptures" },
  { id: "scripture_atharva3", incorrect: "Атхарва-веда", correct: "«Атхарва Веда»", category: "scriptures" },
  { id: "scripture_brahmasutra", incorrect: "Брахма-сутра", correct: "«Брахма-сутра»", category: "scriptures" },
  { id: "scripture_brhatsama", incorrect: "Брігатсама", correct: "«Бріхат-сама»", category: "scriptures" },
  { id: "scripture_bhagavata_sandarbha", incorrect: "Бгаґавата-сандарбга", correct: "«Бгаґавата-сандарбга»", category: "scriptures" },
  { id: "scripture_bhagavat_sandarbha", incorrect: "Бгаґават-сандарбга", correct: "«Бгаґават-сандарбга»", category: "scriptures" },
  { id: "scripture_bhagavata_tatparya", incorrect: "Бгаґавата-татпар'я-нірная", correct: "«Бгаґавата-татпар'я-нірная»", category: "scriptures" },
  { id: "scripture_bhagavadgita", incorrect: "Бгаґавад-ґіта", correct: "«Бгаґавад-ґіта»", category: "scriptures" },
  { id: "scripture_bhagavata_purana", incorrect: "Бгаґавата Пурана", correct: "«Бгаґавата Пурана»", category: "scriptures" },
  { id: "scripture_bhakti_rasamrta", incorrect: "Бгакті-расамріта-сіндгу", correct: "«Бгакті-расамріта-сіндгу»", category: "scriptures" },
  { id: "scripture_bhakti_ratnakara", incorrect: "Бгакті-ратнакара", correct: "«Бгакті-ратнакара»", category: "scriptures" },
  { id: "scripture_bhakti_sandarbha", incorrect: "Бгакті-сандарбга", correct: "«Бгакті-сандарбга»", category: "scriptures" },
  { id: "scripture_bhavartha_dipika", incorrect: "Бгавартха-діпіка", correct: "«Бгавартха-діпіка»", category: "scriptures" },
  { id: "scripture_bhallaveia", incorrect: "Бгаллавея-шруті", correct: "«Бгаллавея-шруті»", category: "scriptures" },
  { id: "scripture_garuda", incorrect: "Ґаруда Пурана", correct: "«Ґаруда Пурана»", category: "scriptures" },
  { id: "scripture_gitopanishad", incorrect: "Ґітопанішад", correct: "«Ґітопанішада»", category: "scriptures" },
  { id: "scripture_govinda_bhashya", incorrect: "Ґовінда-бгаш'я", correct: "«Ґовінда-бгаш'я»", category: "scriptures" },
  { id: "scripture_gopal_champu", incorrect: "Ґопала-чампу", correct: "«Ґопал-чампу»", category: "scriptures" },
  { id: "scripture_gopal_champu2", incorrect: "Ґопалачампу", correct: "«Ґопал-чампу»", category: "scriptures" },
  { id: "scripture_hamsa_guhya", incorrect: "Хамса-ґух'я-става", correct: "«Хамса-ґух'я-став»", category: "scriptures" },
  { id: "scripture_hamsa_guhya2", incorrect: "Гамсаґуг'ястава", correct: "«Хамса-ґух'я-став»", category: "scriptures" },
  { id: "scripture_hari_namamrta", incorrect: "Харі-намамріта-в'якарана", correct: "«Харі-намамріта-в'якарана»", category: "scriptures" },
  { id: "scripture_krishna_sandarbha", incorrect: "Крішна-сандарбга", correct: "«Крішна-сандарбга»", category: "scriptures" },
  { id: "scripture_laghu_bhagavatamrita", incorrect: "Лаґгу-бгаґаватамріта", correct: "«Лаґгу-бгаґаватамріта»", category: "scriptures" },
  { id: "scripture_mahabharata", incorrect: "Магабгарата", correct: "«Махабгарата»", category: "scriptures" },
  { id: "scripture_mahabharata2", incorrect: "Махабгарата", correct: "«Махабгарата»", category: "scriptures" },
  { id: "scripture_matsya", incorrect: "Матсья Пурана", correct: "«Матсья Пурана»", category: "scriptures" },
  { id: "scripture_ramayana", incorrect: "Рамаяна", correct: "«Рамаяна»", category: "scriptures" },
  { id: "scripture_rigveda", incorrect: "Ріґведа", correct: "«Ріґ Веда»", category: "scriptures" },
  { id: "scripture_samaveda", incorrect: "Самаведа", correct: "«Сама Веда»", category: "scriptures" },
  { id: "scripture_skanda", incorrect: "Сканда Пурана", correct: "«Сканда Пурана»", category: "scriptures" },
  { id: "scripture_tattva_sandarbha", incorrect: "Таттва-сандарбга", correct: "«Таттва-сандарбга»", category: "scriptures" },
  { id: "scripture_ujjvala", incorrect: "Уджвала-ніламані", correct: "«Удджвала-ніламані»", category: "scriptures" },
  { id: "scripture_vedanta_sutra", incorrect: "Веданта-сутра", correct: "«Веданта-сутра»", category: "scriptures" },
  { id: "scripture_vedartha", incorrect: "Ведартга Самґраха", correct: "«Ведартха Санґраха»", category: "scriptures" },
  { id: "scripture_vishnu", incorrect: "Вішну Пурана", correct: "«Вішну Пурана»", category: "scriptures" },
  { id: "scripture_yajurveda", incorrect: "Яджурведа", correct: "«Яджур Веда»", category: "scriptures" },
  { id: "scripture_yoga_sutri", incorrect: "Йоґа-сутри", correct: "«Йоґа-сутри»", category: "scriptures" },
  { id: "scripture_shrimad", incorrect: "Шрімад-Бгаґаватам", correct: "«Шрімад-Бгаґаватам»", category: "scriptures" },
  { id: "scripture_shvetashvatara", incorrect: "Шветашватара-упанішада", correct: "«Шветашватара-упанішада»", category: "scriptures" },
  { id: "scripture_shatapatha", incorrect: "Шатапатха-брахмана", correct: "«Шатапатха-брахмана»", category: "scriptures" },
  { id: "scripture_taittiriya", incorrect: "Тайттірія-брахмана", correct: "«Тайттірія-брахмана»", category: "scriptures" },
  { id: "scripture_brihadaranyaka", incorrect: "Бріхад-араньяка-упанішада", correct: "«Бріхад-араньяка-упанішада»", category: "scriptures" },
  { id: "scripture_agni", incorrect: "Аґні Пурана", correct: "«Аґні Пурана»", category: "scriptures" },
  { id: "scripture_nama_sankirtana", incorrect: "Нама-санкіртана", correct: "«Нама-санкіртана»", category: "scriptures" },
  { id: "scripture_gita_mala", incorrect: "Ґіта-мала", correct: "«Ґіта-мала»", category: "scriptures" },
  { id: "scripture_tantra_sara", incorrect: "Тантра-сара", correct: "«Тантра-сара»", category: "scriptures" },
  { id: "scripture_purusha_sukta", incorrect: "Пуруша-сукта", correct: "«Пуруша-сукта»", category: "scriptures" },
  { id: "scripture_chandogya", incorrect: "Чхандоґ'я-упанішада", correct: "«Чхандоґ'я-упанішада»", category: "scriptures" },
  { id: "scripture_chandogya2", incorrect: "Чхандог'я Упанішад", correct: "«Чхандоґ'я-упанішада»", category: "scriptures" },
  { id: "scripture_mundaka", incorrect: "Мундака-упанішада", correct: "«Мундака-упанішада»", category: "scriptures" },
  { id: "scripture_katha", incorrect: "Катха-упанішада", correct: "«Катха-упанішада»", category: "scriptures" },
  { id: "scripture_isha", incorrect: "Іша-упанішада", correct: "«Іша-упанішада»", category: "scriptures" },
  { id: "scripture_cc", incorrect: "Чайтанья-чарітамріта", correct: "«Чайтанья-чарітамріта»", category: "scriptures" },
  { id: "scripture_sb", incorrect: "Шрімад-Бгаґаватам", correct: "«Шрімад-Бгаґаватам»", category: "scriptures" },
  { id: "scripture_noi", incorrect: "Нектар Настанов", correct: "«Нектар Настанов»", category: "scriptures" },
  { id: "scripture_nod", incorrect: "Нектар Відданості", correct: "«Нектар Відданості»", category: "scriptures" },
  { id: "scripture_brahma_samhita", incorrect: "Брахма-самхіта", correct: "«Брахма-самхіта»", category: "scriptures" },
  { id: "scripture_padma_purana", incorrect: "Падма Пурана", correct: "«Падма Пурана»", category: "scriptures" },
  { id: "scripture_narada_purana", incorrect: "Нарада Пурана", correct: "«Нарада Пурана»", category: "scriptures" },
  { id: "scripture_harivamsha", incorrect: "Харівамша", correct: "«Харівамша»", category: "scriptures" },
  { id: "scripture_gita_govinda", incorrect: "Ґіта-ґовінда", correct: "«Ґіта-ґовінда»", category: "scriptures" },

  // =====================================================
  // ТРАНСЛІТЕРАЦІЯ: Виправлення термінів
  // =====================================================
  { id: "translit_vayu", incorrect: "Вайю", correct: "Ваю", category: "transliteration" },
  { id: "translit_vayu2", incorrect: "вайю", correct: "ваю", category: "transliteration" },
  { id: "translit_vaishnav", incorrect: "Вайшнава", correct: "вайшнав", category: "transliteration" },
  { id: "translit_mimamsa", incorrect: "мімамса", correct: "міманса", category: "transliteration" },
  { id: "translit_mayavadi", incorrect: "майяваді", correct: "маяваді", category: "transliteration" },
  { id: "translit_mahatma", incorrect: "мага̄тма", correct: "махатма", category: "transliteration" },
  { id: "translit_rishi", incorrect: "риші", correct: "ріші", category: "transliteration" },
  { id: "translit_jagannath", incorrect: "Джаґаннатха", correct: "Джаґаннатх", category: "transliteration" },
  { id: "translit_krishnadas", incorrect: "Крішнадаса Кавіраджа", correct: "Крішнадас Кавірадж", category: "transliteration" },
  { id: "translit_krishnadas2", incorrect: "Крішнадаса Адгікарі", correct: "Крішнадас Адгікарі", category: "transliteration" },
  { id: "translit_kumar", incorrect: "Кумара", correct: "Кумар", category: "transliteration" },
  { id: "translit_gopal", incorrect: "Ґопала Бгатта Ґосвамі", correct: "Ґопал Бгатта Ґосвамі", category: "transliteration" },
  { id: "translit_thakur", incorrect: "Тхакура", correct: "Тхакур", category: "transliteration" },
  { id: "translit_mahamantra", incorrect: "Харе Крішна Маха-мантра", correct: "маха-мантра Харе Крішна", category: "transliteration" },
  { id: "translit_mahamantra2", incorrect: "Маха-мантра", correct: "маха-мантра", category: "transliteration" },
  { id: "translit_dhananjay", incorrect: "Дгананджая", correct: "Дгананджай", category: "transliteration" },
  { id: "translit_janamejaya", incorrect: "Джанамеджая", correct: "Джанамеджая", category: "transliteration" },
  { id: "translit_srinjay", incorrect: "Срінджая", correct: "Срінджай", category: "transliteration" },
  { id: "translit_gajahvaya", incorrect: "Ґаджахвая", correct: "Ґаджахвая", category: "transliteration" },
  { id: "translit_svacha", incorrect: "Сваха", correct: "Сваха", category: "transliteration" },
  { id: "translit_tryaksha", incorrect: "Tryakşa", correct: "Тр'якша", category: "transliteration" },
  { id: "translit_trayyaruni", incorrect: "Trayyāruṇi", correct: "Трайяруні", category: "transliteration" },
  { id: "translit_sanjay", incorrect: "Санджая", correct: "Санджай", category: "transliteration" },
  { id: "translit_jaya", incorrect: "Джая", correct: "Джай", category: "transliteration" },
  { id: "translit_karttikeya", incorrect: "Карттікея", correct: "Картікея", category: "transliteration" },
  { id: "translit_kaikeyi", incorrect: "Kaykeyi", correct: "Кайкеї", category: "transliteration" },
  { id: "translit_shurpanakha", incorrect: "Шурпанакха", correct: "Шурпанака", category: "transliteration" },
  { id: "translit_phulia", incorrect: "Phulia", correct: "Фулія", category: "transliteration" },
  { id: "translit_yavanaraj", incorrect: "Явана-радж", correct: "Яванарадж", category: "transliteration" },
  { id: "translit_albandaru", incorrect: "Ālbandāru Yāmunācārya", correct: "Альбандару Ямуначар'я", category: "transliteration" },
  { id: "translit_maithila", incorrect: "Maithila", correct: "Майтхіла", category: "transliteration" },
  { id: "translit_himalaya", incorrect: "Himalaya", correct: "Гімалаї", category: "transliteration" },

  // =====================================================
  // АПОСТРОФИ: Виправлення написання
  // =====================================================
  { id: "apostrophe_vidya", incorrect: "від'я", correct: "відья", category: "apostrophe" },
  { id: "apostrophe_gyana", incorrect: "Ґ`яна", correct: "ґ'яна", category: "apostrophe" },
  { id: "apostrophe_gyana2", incorrect: "джняна", correct: "ґ'яна", category: "apostrophe" },
  { id: "apostrophe_daityi", incorrect: "дайт'ї", correct: "дайтьї", category: "apostrophe" },
  { id: "apostrophe_kaivalya", incorrect: "кайвал'я", correct: "кайвалья", category: "apostrophe" },
  { id: "apostrophe_sannyasi", incorrect: "саньясі", correct: "санньясі", category: "apostrophe" },
  { id: "apostrophe_sannyasi2", incorrect: "санн'ясі", correct: "санньясі", category: "apostrophe" },
  { id: "apostrophe_sannyasa", incorrect: "санн'яса", correct: "санньяса", category: "apostrophe" },
  { id: "apostrophe_achintya", incorrect: "ачінтя", correct: "ачінтья", category: "apostrophe" },
  { id: "apostrophe_chaitanya", incorrect: "Чайтаньа", correct: "Чайтанья", category: "apostrophe" },
  { id: "apostrophe_vyasa", incorrect: "Вяса", correct: "В'яса", category: "apostrophe" },

  // =====================================================
  // ІМЕНА ТА ТЕРМІНИ
  // =====================================================
  { id: "name_hanuman", incorrect: "Гануман", correct: "Хануман", category: "names" },
  { id: "name_hare", incorrect: "Гаре", correct: "Харе", category: "names" },
  { id: "name_maya", incorrect: "майя", correct: "мая", category: "names" },
  { id: "name_yogamaya", incorrect: "йоґа-мая", correct: "йоґамая", category: "names" },
  { id: "name_mahamaya", incorrect: "маха-мая", correct: "махамая", category: "names" },
  { id: "name_devamaya", incorrect: "дева-мая", correct: "девамая", category: "names" },
  { id: "name_sachchidananda", incorrect: "сат-чіт-ананда", correct: "сач-чід-ананда", category: "names" },
  { id: "name_parabrahman", incorrect: "Пара-брахман", correct: "Парабрахман", category: "names" },
  { id: "name_vishnutattva", incorrect: "Вішну таттва", correct: "вішну-таттва", category: "names" },
  { id: "name_ashvamedha", incorrect: "Ашвамедга", correct: "ашвамедга", category: "names" },
  { id: "name_digvijay", incorrect: "Діґвіджая", correct: "діґвіджай", category: "names" },
  { id: "name_mataji", incorrect: "матаджі", correct: "матаджі", category: "names", caseSensitive: true },
  { id: "name_guru_maharaj", incorrect: "Ґуру Махарадж", correct: "ґуру махарадж", category: "names" },
  { id: "name_gorakshya", incorrect: "ґо-ракшйя", correct: "ґо-ракш'я", category: "names" },
  { id: "name_sita_devi", incorrect: "Сітадеві", correct: "Сіта-деві", category: "names" },
  { id: "name_mahalakshmi", incorrect: "Махалакшмі", correct: "Маха-Лакшмі", category: "names" },
  { id: "name_lilapurushottama", incorrect: "Ліла-пурушоттама", correct: "ліла-пурушоттама", category: "names" },
  { id: "name_makara_sankranti", incorrect: "макара-санкранті", correct: "Макара-санкранті", category: "names" },
  { id: "name_rakhaowala", incorrect: "rakhaowala", correct: "ракховала", category: "names" },
  { id: "name_nim", incorrect: "nimba", correct: "нім", category: "names" },
  { id: "name_mahapurusha", incorrect: "Mahā-puruṣa", correct: "Маха-пуруша", category: "names" },
  { id: "name_pratichi", incorrect: "Pratīcī Mahānadī", correct: "Пратічі-Маханаді", category: "names" },
  { id: "name_krishna_dvaipayana", incorrect: "Kṛṣṇa-dvaipāyana Vyāsa", correct: "Крішна-Двайпаяна В'яса", category: "names" },
  { id: "name_shrivatsa", incorrect: "Srivatsa", correct: "Шріватса", category: "names" },
  { id: "name_lakh", incorrect: "лакхи", correct: "лакхів", category: "names" },
  { id: "name_kror", incorrect: "крори", correct: "крорів", category: "names" },
  { id: "name_varna", incorrect: "варна", correct: "варна", category: "names", caseSensitive: true },
  { id: "name_bhoga", incorrect: "бгоґа", correct: "бгоґа", category: "names", caseSensitive: true },
  { id: "name_nabob", incorrect: "набоб", correct: "набоб", category: "names", caseSensitive: true },
  { id: "name_alakapuri", incorrect: "Алака-пурі", correct: "Алакапурі", category: "names" },
  { id: "name_vira_prabhanjana", incorrect: "Vіra-prabhanjana Matha", correct: "Віра-прабганджана-матх", category: "names" },
  { id: "name_mayadanava", incorrect: "Maya Danava", correct: "Мая Данава", category: "names" },
  { id: "name_narasimha", incorrect: "Божественний Людина-Лев", correct: "Людинолев", category: "names" },

  // Additional names from document
  { id: "name_gauranga", incorrect: "Ґауранґа", correct: "Ґаура", category: "names" },
  { id: "name_govinda", incorrect: "Ґовінда", correct: "Ґовінда", category: "names", caseSensitive: true },
  { id: "name_ganesha", incorrect: "Ґанеш", correct: "Ґанеша", category: "names" },
  { id: "name_ishvara", incorrect: "Ішвар", correct: "Ішвара", category: "names" },
  { id: "name_narayana", incorrect: "Нараян", correct: "Нараяна", category: "names" },
  { id: "name_lakshmi", incorrect: "Лакшмі", correct: "Лакшмі", category: "names", caseSensitive: true },
  { id: "name_shiva", incorrect: "Шива", correct: "Шіва", category: "names" },
  { id: "name_brahman", incorrect: "Брахман", correct: "Брахман", category: "names", caseSensitive: true },
  { id: "name_dvaraka", incorrect: "Дварка", correct: "Дварака", category: "names" },
  { id: "name_goloka", incorrect: "Ґолок", correct: "Ґолока", category: "names" },
  { id: "name_vaikuntha", incorrect: "Вайкунтха", correct: "Вайкунтха", category: "names", caseSensitive: true },
  { id: "name_vrindavan", incorrect: "Врідаван", correct: "Вріндаван", category: "names" },
  { id: "name_vrindavan2", incorrect: "Вріндавана", correct: "Вріндаван", category: "names" },
  { id: "name_mathura", incorrect: "Матура", correct: "Матхура", category: "names" },
  { id: "name_ayodhya", incorrect: "Айодх'я", correct: "Айодг'я", category: "names" },
  { id: "name_brahmachari", incorrect: "Брахмачарі", correct: "брахмачарі", category: "names" },
  { id: "name_brahmin", incorrect: "Брахмін", correct: "брахман", category: "names" },
  { id: "name_kshatriya", incorrect: "Кшатрія", correct: "кшатрій", category: "names" },
  { id: "name_ashram", incorrect: "Ашрам", correct: "ашрам", category: "names" },
  { id: "name_diksha", incorrect: "Дікша", correct: "дікша", category: "names" },
  { id: "name_lila", incorrect: "Ліла", correct: "ліла", category: "names" },
  { id: "name_mukti", incorrect: "Мукті", correct: "мукті", category: "names" },
  { id: "name_prema", incorrect: "Према", correct: "према", category: "names" },
  { id: "name_rasa", incorrect: "Раса", correct: "раса", category: "names" },
  { id: "name_tapasya", incorrect: "Тапасья", correct: "тапасья", category: "names" },
  { id: "name_kirtan", incorrect: "Кіртан", correct: "кіртан", category: "names" },
  { id: "name_sankirtan", incorrect: "Санкіртана", correct: "санкіртана", category: "names" },
  { id: "name_puja", incorrect: "Пуджа", correct: "пуджа", category: "names" },
  { id: "name_arati", incorrect: "Араті", correct: "араті", category: "names" },
  { id: "name_tilak", incorrect: "Тілак", correct: "тілак", category: "names" },
  { id: "name_prasad", incorrect: "Прасад", correct: "прасад", category: "names" },
  { id: "name_ghee", incorrect: "Ґгі", correct: "ґгі", category: "names" },
  { id: "name_chakra", incorrect: "Чакра", correct: "чакра", category: "names" },
  { id: "name_acharya", incorrect: "Ачар'я", correct: "ачар'я", category: "names" },
  { id: "name_kaliyuga", incorrect: "Калі-юга", correct: "Калі-юґа", category: "names" },
  { id: "name_satya_yuga", incorrect: "Сатья-юга", correct: "Сатья-юґа", category: "names" },
  { id: "name_treta_yuga", incorrect: "Трета-юга", correct: "Трета-юґа", category: "names" },
  { id: "name_dvapara_yuga", incorrect: "Двапара-юга", correct: "Двапара-юґа", category: "names" },
  { id: "name_advaita", incorrect: "Адвайта-веданта", correct: "адвайта-веданта", category: "names" },
  { id: "name_bhakti", incorrect: "Бгакті", correct: "бгакті", category: "names" },
  { id: "name_dharma", incorrect: "Дгарма", correct: "дгарма", category: "names" },
  { id: "name_gyana", incorrect: "Джнана", correct: "ґ'яна", category: "names" },
  { id: "name_karma", incorrect: "Карма", correct: "карма", category: "names" },
  { id: "name_nyaya", incorrect: "Нйайа", correct: "ньяя", category: "names" },
  { id: "name_samkhya", incorrect: "Санкхья", correct: "санкх'я", category: "names" },
  { id: "name_vaisheshika", incorrect: "Вайшешика", correct: "вайшешіка", category: "names" },

  // =====================================================
  // ПЕРЕКЛАД ТЕРМІНІВ (англійська → українська)
  // =====================================================
  { id: "transl_false_ego", incorrect: "помилкове его", correct: "оманне его", category: "translation", description: "false ego → оманне его" },
  { id: "transl_spirit_soul", incorrect: "духова душа", correct: "духовна душа", category: "translation" },
  { id: "transl_goddess_fortune", incorrect: "богиня процвітання", correct: "богиня щастя", category: "translation", description: "goddess of fortune → богиня щастя" },
  { id: "transl_householder", incorrect: "домовласник", correct: "домогосподар", category: "translation" },
  { id: "transl_demigod", incorrect: "напівбог", correct: "півбог", category: "translation", description: "demigod → півбог (основний)" },
  { id: "transl_bona_fide", incorrect: "справжній духовний", correct: "істинний духовний", category: "translation", description: "bona fide → істинний" },
  { id: "transl_penance", incorrect: "покаяння", correct: "аскеза", category: "translation", description: "penance → аскеза" },
  { id: "transl_liberation", incorrect: "освобождення", correct: "визволення", category: "translation" },
  { id: "transl_rounds", incorrect: "раундів", correct: "кіл", category: "translation", description: "16 rounds → 16 кіл" },
  { id: "transl_rounds2", incorrect: "раунди", correct: "кола", category: "translation" },
  { id: "transl_intoxication", incorrect: "інтоксикація", correct: "дурманні речовини", category: "translation" },
  { id: "transl_speculate", incorrect: "спекулювати", correct: "розумувати", category: "translation" },
  { id: "transl_mental_speculation", incorrect: "ментальні спекуляції", correct: "розумування", category: "translation", description: "mental speculations → розумування" },
  { id: "transl_fruitive_worker", incorrect: "фруїтивний трудівник", correct: "корисливий трудівник", category: "translation" },
  { id: "transl_surrender", incorrect: "здаватися", correct: "віддатися", category: "translation", description: "surrender → віддатися, вручити себе" },
  { id: "transl_realization", incorrect: "реалізація", correct: "усвідомлення", category: "translation", description: "realization → усвідомлення, осяяння" },
  { id: "transl_controller", incorrect: "контролер", correct: "володар", category: "translation", description: "controller → володар, повелитель" },
  { id: "transl_opulence", incorrect: "пишнота", correct: "щедроти", category: "translation", description: "opulence → щедроти, багатства" },
  { id: "transl_plenary", incorrect: "пленарне", correct: "довершене", category: "translation", description: "plenary expansion → довершене поширення" },
  { id: "transl_expansion", incorrect: "експансія", correct: "поширення", category: "translation" },
  { id: "transl_constitutional", incorrect: "конституційне", correct: "природне", category: "translation", description: "constitutional position → природне становище" },
  { id: "transl_back_home", incorrect: "назад додому, до Бога", correct: "назад додому, назад до Бога", category: "translation" },
  { id: "transl_revealed", incorrect: "відкриті писання", correct: "явлені писання", category: "translation" },
  { id: "transl_conditioned", incorrect: "обумовлена душа", correct: "зумовлена душа", category: "translation" },
  { id: "transl_auspicious", incorrect: "сприятливе", correct: "благодатний", category: "translation", description: "auspicious → благодатний, сприятливий" },
  { id: "transl_original", incorrect: "оригінальний", correct: "первинний", category: "translation", description: "original → первинний, одвічний" },
  { id: "transl_intelligent", incorrect: "інтелігентна", correct: "розсудлива", category: "translation", description: "intelligent person → розсудлива людина" },
  { id: "transl_unalloyed", incorrect: "незмішаний", correct: "бездомісний", category: "translation", description: "unalloyed → бездомісний, чистий" },
  { id: "transl_threefold", incorrect: "три страждання", correct: "троїсті страждання", category: "translation" },
  { id: "transl_impersonal", incorrect: "імперсональний", correct: "безособистісний", category: "translation" },
  { id: "transl_wellwisher", incorrect: "доброзичлива людина", correct: "доброзичливець", category: "translation" },
  { id: "transl_glory", incorrect: "глорія", correct: "слава", category: "translation" },
  { id: "transl_mindful", incorrect: "майндфул", correct: "уважний", category: "translation" },
  { id: "transl_fallen", incorrect: "падші душі", correct: "занепалі душі", category: "translation" },
  { id: "transl_glorify", incorrect: "глорифікувати", correct: "славити", category: "translation" },
  { id: "transl_criticize", incorrect: "критикувати", correct: "ганити", category: "translation" },
  { id: "transl_enjoyer", incorrect: "ен'джоєр", correct: "насолодник", category: "translation" },
  { id: "transl_offender", incorrect: "офендер", correct: "кривдник", category: "translation" },
  { id: "transl_order_supplier", incorrect: "виконавець замовлень", correct: "хлопчик на побігеньках", category: "translation" },
  { id: "transl_progenitor", incorrect: "прогенітор", correct: "прародитель", category: "translation" },
  { id: "transl_potency", incorrect: "потенція", correct: "енергія", category: "translation" },
  { id: "transl_marginal", incorrect: "маргінальна", correct: "межова", category: "translation" },
  { id: "transl_irreligion", incorrect: "ірелігія", correct: "безбожність", category: "translation" },
  { id: "transl_empowered", incorrect: "емповерд", correct: "повноважний", category: "translation" },
  { id: "transl_worshipable", incorrect: "воршіпейбл", correct: "гідний поклоніння", category: "translation" },
  { id: "transl_causeless", incorrect: "безкаузальна", correct: "безпричинна", category: "translation" },
  { id: "transl_associate", incorrect: "асоціюватися", correct: "спілкуватися", category: "translation" },
  { id: "transl_oblation", incorrect: "облація", correct: "підношення", category: "translation" },
  { id: "transl_obeisances", incorrect: "обейсанси", correct: "поклони", category: "translation" },
  { id: "transl_pastimes", incorrect: "пастаймз", correct: "розваги", category: "translation" },
  { id: "transl_heavenly", incorrect: "небесні планети", correct: "райські планети", category: "translation" },
  { id: "transl_cheating", incorrect: "читінг", correct: "облудний", category: "translation" },
  { id: "transl_womb", incorrect: "вумб", correct: "лоно", category: "translation" },
  { id: "transl_wakefulness", incorrect: "вейкфулнес", correct: "пильнування", category: "translation" },
  { id: "transl_inconceivable", incorrect: "інконсівейбл", correct: "незбагненний", category: "translation" },
  { id: "transl_creative_energy", incorrect: "творча енергія", correct: "твірна енергія", category: "translation" },
  { id: "transl_phenomenal", incorrect: "феноменальний", correct: "проявлений", category: "translation" },
  { id: "transl_complete_unit", incorrect: "повний юніт", correct: "довершена цілість", category: "translation" },
  { id: "transl_concealed", incorrect: "консілд", correct: "приховане", category: "translation" },
  { id: "transl_advent", incorrect: "адвент", correct: "прихід", category: "translation", description: "advent of Kali-yuga → прихід Калі-юґи" },
  { id: "transl_leave_body", incorrect: "залишити тіло", correct: "покинути тіло", category: "translation" },
  { id: "transl_commit_offence", incorrect: "зробити образу", correct: "вчинити образу", category: "translation" },
  { id: "transl_austerity", incorrect: "аустеріті", correct: "аскеза", category: "translation" },
  { id: "transl_cow", incorrect: "коров'як", correct: "коров'ячий гній", category: "translation" },
  { id: "transl_resident", incorrect: "резідент", correct: "житель", category: "translation" },
  { id: "transl_mating", incorrect: "мейтінг", correct: "парування", category: "translation" },
  { id: "transl_untouchable", incorrect: "унтачейбл", correct: "недоторканний", category: "translation" },
  { id: "transl_awe_reverence", incorrect: "ав енд ревіренс", correct: "благоговіння", category: "translation" },
  { id: "transl_milk_ocean", incorrect: "Океан молока", correct: "Молочний океан", category: "translation" },
  { id: "transl_seed", incorrect: "сід", correct: "насіння", category: "translation" },
  { id: "transl_seer", incorrect: "сіар", correct: "провидець", category: "translation" },
  { id: "transl_evidence", incorrect: "евіденс", correct: "докази", category: "translation" },
  { id: "transl_false", incorrect: "фальшивий прояв", correct: "ілюзорний прояв", category: "translation" },
  { id: "transl_mother", incorrect: "Мати Лакшмі", correct: "Мати Лакшмі", category: "translation", caseSensitive: true },
  { id: "transl_mumbai", incorrect: "Бомбей", correct: "Мумбай", category: "translation" },
  { id: "transl_witness", incorrect: "вітнес", correct: "свідок", category: "translation" },
  { id: "transl_time_death", incorrect: "в час смерті", correct: "у годину смерті", category: "translation" },
  { id: "transl_strictly", incorrect: "строго", correct: "суворо", category: "translation" },
  { id: "transl_join_society", incorrect: "приєднатися до", correct: "пристати до", category: "translation" },
  { id: "transl_individual_soul", incorrect: "індівідуальна", correct: "індивідуальна", category: "translation" },

  // Additional translation rules from document
  { id: "transl_supreme_personality", incorrect: "Верховна Божественна Особа", correct: "Верховний Бог-Особа", category: "translation" },
  { id: "transl_supreme_abode", incorrect: "вище обиталище", correct: "найвища обитель", category: "translation" },
  { id: "transl_spiritual_identity", incorrect: "духова тотожність", correct: "духовна тотожність", category: "translation" },
  { id: "transl_sense_organs", incorrect: "органи відчуттів", correct: "органи чуттів", category: "translation" },
  { id: "transl_sense_pleasures", incorrect: "чуттєві задоволення", correct: "чуттєві насолоди", category: "translation" },
  { id: "transl_mental_platform", incorrect: "ментальний рівень", correct: "рівень розуму", category: "translation" },
  { id: "transl_supersoul", incorrect: "Супердуша", correct: "Наддуша", category: "translation" },
  { id: "transl_material_entanglement", incorrect: "матеріальна заплутаність", correct: "матеріальне рабство", category: "translation" },
  { id: "transl_controller2", incorrect: "контролюючий", correct: "володар", category: "translation" },
  { id: "transl_omniscient", incorrect: "всезнаючий", correct: "Всевідаючий", category: "translation" },
  { id: "transl_spiritualist", incorrect: "спірітуаліст", correct: "трансценденталіст", category: "translation" },
  { id: "transl_clutches_maya", incorrect: "кігті маї", correct: "лабета маї", category: "translation" },
  { id: "transl_clutches_maya2", incorrect: "пазурі маї", correct: "лабета маї", category: "translation" },
  { id: "transl_bona_fide_method", incorrect: "справжній метод", correct: "авторитетний метод", category: "translation" },
  { id: "transl_order_of_life", incorrect: "порядок життя", correct: "уклад життя", category: "translation" },
  { id: "transl_engagement_service", incorrect: "зайнятість у служінні", correct: "долучення до служіння", category: "translation" },
  { id: "transl_detachment", incorrect: "детачмент", correct: "зреченість", category: "translation" },
  { id: "transl_renunciation", incorrect: "рінансіейшн", correct: "зречення", category: "translation" },
  { id: "transl_chant", incorrect: "чантити", correct: "повторювати", category: "translation" },
  { id: "transl_chanting", incorrect: "чантінг", correct: "повторення", category: "translation" },
  { id: "transl_worship", incorrect: "воршіп", correct: "поклоніння", category: "translation" },
  { id: "transl_regulative", incorrect: "регулятивні принципи", correct: "регулятивні принципи", category: "translation", caseSensitive: true },
  { id: "transl_material_contamination", incorrect: "матеріальна контамінація", correct: "матеріальне осквернення", category: "translation" },
  { id: "transl_ether", incorrect: "етер", correct: "ефір", category: "translation" },
  { id: "transl_waters_devastation", incorrect: "води руйнування", correct: "води спустошення", category: "translation" },
  { id: "transl_wakefulness2", incorrect: "неспання", correct: "пильнування", category: "translation" },
  { id: "transl_equipoised", incorrect: "еквілібріум", correct: "урівноважений", category: "translation" },
  { id: "transl_false_pride", incorrect: "фальшива гордість", correct: "гординя", category: "translation" },
  { id: "transl_tolerance", incorrect: "толерантність", correct: "терпеливість", category: "translation" },
  { id: "transl_vedic_literatures", incorrect: "ведична література", correct: "ведичні писання", category: "translation" },
  { id: "transl_disciplic_succession", incorrect: "дисціплічна сукцесія", correct: "ланцюг учнівської послідовності", category: "translation" },
  { id: "transl_disciplic_succession2", incorrect: "дісціплічна послідовність", correct: "учнівська послідовність", category: "translation" },
  { id: "transl_attain_god", incorrect: "атейн Бога", correct: "досягти Бога", category: "translation" },
  { id: "transl_follow_footsteps", incorrect: "слідувати стопам", correct: "йти вслід", category: "translation" },
  { id: "transl_offer_obeisances", incorrect: "офферити обейсанси", correct: "складати поклони", category: "translation" },
  { id: "transl_well_wisher2", incorrect: "велл-вішер", correct: "доброзичливець", category: "translation" },
  { id: "transl_learned_scholar", incorrect: "вчений", correct: "учений мудрець", category: "translation" },
  { id: "transl_innocent_people", incorrect: "інносент люди", correct: "невинні люди", category: "translation" },
  { id: "transl_causal_ocean", incorrect: "Казуальний Океан", correct: "Причиновий океан", category: "translation" },
  { id: "transl_thunderbolt", incorrect: "тандерболт", correct: "блискавка", category: "translation" },
  { id: "transl_cosmic_manifestation", incorrect: "космічна маніфестація", correct: "космічний прояв", category: "translation" },
  { id: "transl_dormant_love", incorrect: "дормант лав", correct: "спляча любов", category: "translation" },
  { id: "transl_conjugal", incorrect: "конджуґал", correct: "подружній", category: "translation" },
  { id: "transl_nondifferent", incorrect: "нон-діфферент", correct: "тотожний", category: "translation" },
  { id: "transl_part_parcel", incorrect: "частина і часточка", correct: "невід'ємна частка", category: "translation" },
  { id: "transl_differentiated", incorrect: "діференційовані", correct: "відокремлені", category: "translation" },
  { id: "transl_initiation", incorrect: "ініціація", correct: "посвята", category: "translation" },

  // Additional rules from editorial guidelines
  { id: "transl_false_ego2", incorrect: "фальшиве его", correct: "оманне его", category: "translation" },
  { id: "transl_control_mind", incorrect: "контролювати розум", correct: "опанувати розум", category: "translation" },
  { id: "transl_verify", incorrect: "верифікувати", correct: "підтвердити", category: "translation" },
  { id: "transl_reservoir", incorrect: "резервуар", correct: "вмістище", category: "translation" },
  { id: "transl_emphasize", incorrect: "акцентувати", correct: "наголосити", category: "translation" },
  { id: "transl_ingredients", incorrect: "інгредієнти", correct: "складники", category: "translation" },
  { id: "transl_fix_mind", incorrect: "зафіксувати розум", correct: "зосередити розум", category: "translation" },
  { id: "transl_transmigrate", incorrect: "трансмігрувати", correct: "переселятися", category: "translation" },
  { id: "transl_identity", incorrect: "ідентичність", correct: "тотожність", category: "translation" },
  { id: "transl_intimate", incorrect: "інтимні стосунки", correct: "близькі стосунки", category: "translation" },
  { id: "transl_status", incorrect: "статус життя", correct: "стан життя", category: "translation" },
  { id: "transl_demonstrate", incorrect: "демонструє", correct: "показує", category: "translation" },
  { id: "transl_demonstrate2", incorrect: "продемонструвати", correct: "показати", category: "translation" },
  { id: "transl_focus", incorrect: "фокусуватися", correct: "зосереджуватися", category: "translation" },
  { id: "transl_mechanism", incorrect: "механізм", correct: "спосіб", category: "translation" },
  { id: "transl_activate", incorrect: "активувати", correct: "пробудити", category: "translation" },
  { id: "transl_process", incorrect: "процесувати", correct: "опрацьовувати", category: "translation" },
  { id: "transl_fixate", incorrect: "фіксувати", correct: "закріплювати", category: "translation" },
  { id: "transl_manifest", incorrect: "маніфестувати", correct: "проявляти", category: "translation" },
  { id: "transl_manifest2", incorrect: "маніфестація", correct: "прояв", category: "translation" },
  { id: "transl_eternal_servant", incorrect: "вічний слуга", correct: "вічний слуга", category: "translation", caseSensitive: true },
  { id: "transl_degraded", incorrect: "деградувати", correct: "занепадати", category: "translation" },
  { id: "transl_degradation", incorrect: "деградація", correct: "занепад", category: "translation" },

  // =====================================================
  // ТИПОГРАФІКА
  // =====================================================
  { id: "typo_dash_1", incorrect: " - ", correct: " — ", category: "typography", description: "Дефіс → тире" },
  { id: "typo_dash_2", incorrect: "--", correct: "—", category: "typography", description: "Подвійний дефіс → тире" },
  { id: "typo_ellipsis", incorrect: "...", correct: "…", category: "typography", description: "Три крапки → еліпсис" },
  { id: "typo_ending_love", incorrect: "любови", correct: "любові", category: "typography" },
  { id: "typo_ending_passion", incorrect: "пристрасти", correct: "пристрасті", category: "typography" },
  { id: "typo_ending_death", incorrect: "смерти", correct: "смерті", category: "typography" },
  { id: "typo_господu", incorrect: "Господу", correct: "Господеві", category: "typography" },

  // Additional typography and grammar rules from editorial guidelines
  { id: "typo_ending_radosti", incorrect: "радости", correct: "радості", category: "typography" },
  { id: "typo_ending_milosti", incorrect: "милости", correct: "милості", category: "typography" },
  { id: "typo_ending_vtichi", incorrect: "втіхи", correct: "втіхи", category: "typography", caseSensitive: true },
  { id: "typo_ending_viddanosti", incorrect: "віддаености", correct: "відданості", category: "typography" },
  { id: "typo_ending_svidomosti", incorrect: "свідомости", correct: "свідомості", category: "typography" },
  { id: "typo_ending_mudrolsti", incorrect: "мудрости", correct: "мудрості", category: "typography" },
  { id: "typo_ending_chesnosti", incorrect: "чесности", correct: "чесності", category: "typography" },
  { id: "typo_ending_yunosti", incorrect: "юности", correct: "юності", category: "typography" },
  { id: "typo_ending_mozhlivosti", incorrect: "можливости", correct: "можливості", category: "typography" },
  { id: "typo_ending_osoblivosti", incorrect: "особливости", correct: "особливості", category: "typography" },
  { id: "typo_ending_diyalnosti", incorrect: "діяльности", correct: "діяльності", category: "typography" },
  { id: "typo_ending_vichnosti", incorrect: "вічности", correct: "вічності", category: "typography" },
  { id: "typo_ending_sutnosti", incorrect: "сутности", correct: "сутності", category: "typography" },
  { id: "typo_ending_yakosti", incorrect: "якости", correct: "якості", category: "typography" },
  { id: "typo_ending_osobystosti", incorrect: "особистости", correct: "особистості", category: "typography" },
  { id: "typo_ending_sili", incorrect: "сили", correct: "сили", category: "typography", caseSensitive: true },

  // Genitive plural with -іп ending (лотосових стіп)
  { id: "typo_lotus_feet", incorrect: "лотосових стоп", correct: "лотосових стіп", category: "typography" },
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
