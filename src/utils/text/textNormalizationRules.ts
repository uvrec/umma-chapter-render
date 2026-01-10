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
    id: "endings",
    name_ua: "Закінчення слів",
    name_en: "Word endings",
    description_ua: "Стандартизація закінчень -а/-∅ у санскритських термінах",
    description_en: "Standardize -a/-∅ endings in Sanskrit terms",
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

  // Additional transliteration rules from approved list
  { id: "translit_govardhan_g", incorrect: "Говардхан", correct: "Ґовардган", category: "transliteration", description: "Г→Ґ, х→г" },
  { id: "translit_ganga", incorrect: "Ганга", correct: "Ґанґа", category: "transliteration", description: "Г→Ґ" },
  { id: "translit_ganga2", incorrect: "Ганґа", correct: "Ґанґа", category: "transliteration" },
  { id: "translit_ghi", incorrect: "гхі", correct: "ґгі", category: "transliteration" },
  { id: "translit_hippie", incorrect: "гіпі", correct: "хіпі", category: "transliteration" },
  { id: "translit_garga", incorrect: "Гарґа", correct: "Ґарґа", category: "transliteration" },
  { id: "translit_alexander", incorrect: "Александр Великий", correct: "Олександр Македонський", category: "transliteration" },
  { id: "translit_valmiki", incorrect: "Вальмікі", correct: "Валмікі", category: "transliteration" },
  { id: "translit_shridhar_svami", incorrect: "Шрідгара Свамі", correct: "Шрідгар Свамі", category: "transliteration" },
  { id: "translit_hiranyakashipu", incorrect: "Хіран'якашіпу", correct: "Хіраньякашіпу", category: "transliteration" },
  { id: "translit_hiranyakashipu2", incorrect: "Гіран'якашіпу", correct: "Хіраньякашіпу", category: "transliteration" },
  { id: "translit_hiranyakashipu3", incorrect: "Гіраньякашіпу", correct: "Хіраньякашіпу", category: "transliteration" },
  { id: "translit_chhando", incorrect: "Чгандоґ'я", correct: "Чхандоґ'я", category: "transliteration" },
  { id: "translit_bhaktisiddhanta", incorrect: "Бгактісіддханта", correct: "Бгактісіддганта", category: "transliteration" },
  { id: "translit_vishvanath", incorrect: "Вішванатха Чакраварті", correct: "Вішванатх Чакраварті", category: "transliteration" },
  { id: "translit_brihaspati", incorrect: "Брігаспаті", correct: "Бріхаспаті", category: "transliteration" },
  { id: "translit_daitya", incorrect: "даіт'я", correct: "дайтья", category: "transliteration" },
  { id: "translit_haridas_thakur", incorrect: "Харідас Тгакур", correct: "Харідас Тхакур", category: "transliteration" },
  { id: "translit_haridas_thakur2", incorrect: "Харідаса Тхакура", correct: "Харідас Тхакур", category: "transliteration" },
  { id: "translit_adhyatmika", incorrect: "адѓятміка", correct: "адг'ятміка", category: "transliteration" },
  { id: "translit_khyati", incorrect: "Кг'яті", correct: "Кх'яті", category: "transliteration" },
  { id: "translit_hatha_yoga", incorrect: "Хатха йога", correct: "хатха-йоґа", category: "transliteration" },
  { id: "translit_hatha_yoga2", incorrect: "хатха йога", correct: "хатха-йоґа", category: "transliteration" },
  { id: "translit_hindi", incorrect: "хінді", correct: "гінді", category: "transliteration" },
  { id: "translit_avadhuta", incorrect: "авадгута", correct: "авадгута", category: "transliteration", caseSensitive: true },
  { id: "translit_udgata", incorrect: "удґата", correct: "удґата", category: "transliteration", caseSensitive: true },
  { id: "translit_para_vyoma", incorrect: "пара-вйом", correct: "пара-вйома", category: "transliteration" },
  { id: "translit_achyuta_katha", incorrect: "ач'юта-катга", correct: "ач'юта-катха", category: "transliteration" },
  { id: "translit_nityam", incorrect: "ніт'ям", correct: "нітьям", category: "transliteration" },
  { id: "translit_nitya_mukta", incorrect: "ніт'я-мукта", correct: "нітья-мукта", category: "transliteration" },
  { id: "translit_sumalya", incorrect: "Sumalya", correct: "Сумалья", category: "transliteration" },
  { id: "translit_badarikashram", incorrect: "Badarikāśrama", correct: "Бадарікашрам", category: "transliteration" },
  { id: "translit_kashyapa", incorrect: "Кашьяпа", correct: "Каш'япа", category: "transliteration" },
  { id: "translit_dvaraka_puri", incorrect: "Дварака-Пурі", correct: "Дварака Пурі", category: "transliteration", description: "обидва слова невідмінювані" },
  { id: "translit_chir_ghat", incorrect: "Чір Ґхата", correct: "Чір-ґгат", category: "transliteration" },
  { id: "translit_chir_ghat2", incorrect: "Чір-ґхата", correct: "Чір-ґгат", category: "transliteration" },
  { id: "translit_brahmacharya", incorrect: "брахмачар'я", correct: "брахмачар'я", category: "transliteration", caseSensitive: true, description: "процес" },
  { id: "translit_buddha", incorrect: "Будда", correct: "Будда", category: "transliteration", caseSensitive: true },
  { id: "translit_prachina", incorrect: "Прачінабархішата", correct: "Прачінабархішат", category: "transliteration" },
  { id: "translit_yamaduta", incorrect: "ямадута", correct: "ямадут", category: "transliteration" },
  { id: "translit_vishnuduta", incorrect: "вішнудута", correct: "вішнудут", category: "transliteration" },
  { id: "translit_ayurveda", incorrect: "Аюр-веда", correct: "аюрведа", category: "transliteration" },
  { id: "translit_ayurveda2", incorrect: "Аюрведа", correct: "аюрведа", category: "transliteration" },
  { id: "translit_allah", incorrect: "Аллах", correct: "Аллаг", category: "transliteration" },
  { id: "translit_vaiyasaki", incorrect: "Vaiyāsaki", correct: "Вайясакі", category: "transliteration" },
  { id: "translit_dashama_skandha", incorrect: "Дашама-скандга", correct: "Дашама-скандга", category: "transliteration", caseSensitive: true },
  { id: "translit_acintya", incorrect: "ачінтья-бгедабгеда", correct: "ачінтья-бгеда-абгеда-таттва", category: "transliteration" },
  { id: "translit_gurvashaka", incorrect: "Ґурв-аштака", correct: "Ґурваштака", category: "transliteration" },
  { id: "translit_nirjana_bhajan", incorrect: "нірджана-бгаджан", correct: "нірджан-бгаджан", category: "transliteration" },
  { id: "translit_sakhya", incorrect: "сакѓям", correct: "сакх'я", category: "transliteration" },
  { id: "translit_vidhi_marg", incorrect: "відгі марґ", correct: "відгі-марґ", category: "transliteration" },
  { id: "translit_raga_marg", incorrect: "раґа марґ", correct: "раґа-марґ", category: "transliteration" },
  { id: "translit_calcutta", incorrect: "Колката", correct: "Калькутта", category: "transliteration" },
  { id: "translit_makhana_chora", incorrect: "Makhana-cora", correct: "Макхан-чор", category: "transliteration" },
  { id: "translit_brahmajyoti", incorrect: "брахмаджоті", correct: "брахмаджйоті", category: "transliteration" },
  { id: "translit_radha_desh", incorrect: "Радга-деш", correct: "Радгадеш", category: "transliteration" },
  { id: "translit_gramya", incorrect: "ґрам'я-матхім", correct: "ґрамйа-матіх", category: "transliteration" },
  { id: "translit_gaurasundara", incorrect: "Ґаурасундар", correct: "Ґаурасундара", category: "transliteration" },
  { id: "translit_nyaya", incorrect: "Nyaya", correct: "ньяя", category: "transliteration" },
  { id: "translit_nyayika", incorrect: "ньяїка", correct: "ньяїки", category: "transliteration" },
  { id: "translit_mimamsaka", incorrect: "мімансака", correct: "мімансаки", category: "transliteration" },

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
  { id: "apostrophe_chaitya", incorrect: "чайт'я", correct: "чайтья", category: "apostrophe" },
  { id: "apostrophe_sayujya", incorrect: "саюдж'я", correct: "саюдж'я", category: "apostrophe", caseSensitive: true },
  { id: "apostrophe_dhyana", incorrect: "Дг'яна", correct: "дг'яна", category: "apostrophe" },
  { id: "apostrophe_tapa", incorrect: "тапас'я", correct: "тапасья", category: "apostrophe" },
  { id: "apostrophe_dasya", incorrect: "дас'я", correct: "дасья", category: "apostrophe" },
  { id: "apostrophe_nitya_lila", incorrect: "ніт'я-ліла", correct: "нітья-ліла", category: "apostrophe" },

  // Apostrophe rules: ь after шиплячих/губних/задньоязикових is incorrect
  { id: "apostrophe_chyavana", incorrect: "Чьявана", correct: "Ч'явана", category: "apostrophe" },
  { id: "apostrophe_shyama", incorrect: "Шьяма", correct: "Ш'яма", category: "apostrophe" },
  { id: "apostrophe_bhavishya", incorrect: "Бгавішья", correct: "Бгавіш'я", category: "apostrophe" },
  { id: "apostrophe_achyuta", incorrect: "Ачьюта", correct: "Ач'юта", category: "apostrophe" },
  { id: "apostrophe_samkhya", incorrect: "санкхья", correct: "санкх'я", category: "apostrophe" },
  { id: "apostrophe_gyana", incorrect: "гьяна", correct: "ґ'яна", category: "apostrophe" },
  { id: "apostrophe_yagya", incorrect: "яґья", correct: "яґ'я", category: "apostrophe" },
  { id: "apostrophe_yagya2", incorrect: "ягья", correct: "яґ'я", category: "apostrophe" },
  { id: "apostrophe_prabhupada", incorrect: "Прабгьюпада", correct: "Прабгупада", category: "apostrophe" },
  { id: "apostrophe_bhashya", incorrect: "бгашья", correct: "бгаш'я", category: "apostrophe" },
  { id: "apostrophe_kavya", incorrect: "кавья", correct: "кав'я", category: "apostrophe" },
  { id: "apostrophe_divya", incorrect: "дівья", correct: "дів'я", category: "apostrophe" },
  { id: "apostrophe_saumya", incorrect: "саумья", correct: "саум'я", category: "apostrophe" },
  { id: "apostrophe_ramya", incorrect: "рамья", correct: "рам'я", category: "apostrophe" },
  { id: "apostrophe_bhavya", incorrect: "бгавья", correct: "бгав'я", category: "apostrophe" },
  { id: "apostrophe_dhanya", incorrect: "дганья", correct: "дган'я", category: "apostrophe" },
  { id: "apostrophe_arya", incorrect: "арья", correct: "ар'я", category: "apostrophe" },
  { id: "apostrophe_karya", incorrect: "карья", correct: "кар'я", category: "apostrophe" },
  { id: "apostrophe_surya", incorrect: "сурья", correct: "сур'я", category: "apostrophe" },

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

  // Additional names from approved transliteration list
  { id: "name_gaudiya_math", incorrect: "Ґаудіа-матх", correct: "Ґаудія-матх", category: "names" },
  { id: "name_gayatri_person", incorrect: "ґаятрі", correct: "Ґаятрі", category: "names", description: "Ґаятрі - особа, мантра ґаятрі" },
  { id: "name_karanodakashayi", incorrect: "Каранодакашаї-Вішну", correct: "Каранодакашаї Вішну", category: "names" },
  { id: "name_garbhodakashayi", incorrect: "Ґарбгодакашаї-Вішну", correct: "Ґарбгодакашаї Вішну", category: "names" },
  { id: "name_vasishtha", incorrect: "Васішта", correct: "Васіштха", category: "names" },
  { id: "name_naimi", incorrect: "Наймішар'яна", correct: "Наймішаранья", category: "names" },
  { id: "name_satya_loka", incorrect: "Сатья-лока", correct: "Сатьялока", category: "names" },
  { id: "name_brahma_loka", incorrect: "Брахма-лока", correct: "Брахмалока", category: "names" },
  { id: "name_siddha_loka", incorrect: "Сіддга-лока", correct: "Сіддгалока", category: "names" },
  { id: "name_bhuvar_loka", incorrect: "Бгувар-лока", correct: "Бгуварлока", category: "names" },
  { id: "name_mahar_loka", incorrect: "Махар-лока", correct: "Махарлока", category: "names" },
  { id: "name_tapo_loka", incorrect: "Тапо-лока", correct: "Таполока", category: "names" },
  { id: "name_vaikuntha_loka", incorrect: "Вайкунтха-лока", correct: "Вайкунтхалока", category: "names" },
  { id: "name_devarshi", incorrect: "Деварші-Нарада", correct: "Деварші Нарада", category: "names" },
  { id: "name_vajrangaji", incorrect: "Ваджранґаджі", correct: "Шрі Ваджранґаджі", category: "names" },
  { id: "name_kaustubha", incorrect: "Каустубга", correct: "Каустубга", category: "names", caseSensitive: true },
  { id: "name_prajapati", incorrect: "праджапаті", correct: "Праджапаті", category: "names", description: "Праджапаті - як посада, з маленької" },
  { id: "name_yugavatara", incorrect: "юга-аватара", correct: "юґаватара", category: "names" },
  { id: "name_sudarshana", incorrect: "Сударшана чакра", correct: "Сударшана-чакра", category: "names" },
  { id: "name_tulasiDevi", incorrect: "Туласі-Деві", correct: "Туласі-деві", category: "names" },
  { id: "name_parvati", incorrect: "Парватідеві", correct: "Парваті-деві", category: "names" },
  { id: "name_jahnavii", incorrect: "Джахнаві", correct: "Джахнаві", category: "names", caseSensitive: true, description: "Джахнаві (Ґанґа)" },
  { id: "name_chamara", incorrect: "чамар", correct: "чамара", category: "names" },
  { id: "name_sanjay_pandit", incorrect: "Санджая Пандіт", correct: "Санджай Пандіт", category: "names" },
  { id: "name_narahari", incorrect: "Нарахарі Саракара", correct: "Нарахарі Саркар", category: "names" },
  { id: "name_vasu_ghosh", incorrect: "Васу Ґхош", correct: "Васу Ґгош", category: "names" },
  { id: "name_vraj", incorrect: "Враджа", correct: "Врадж", category: "names", description: "Р.в. Враджу" },
  { id: "name_bhaktivinod", incorrect: "Бгактівінода", correct: "Бгактівінод", category: "names" },
  { id: "name_gaurakishor", incorrect: "Гауракішора", correct: "Ґауракішор", category: "names" },
  { id: "name_gaurakishor2", incorrect: "Ґауракішора", correct: "Ґауракішор", category: "names" },
  { id: "name_aditi", incorrect: "адіті", correct: "Адіті", category: "names" },
  { id: "name_maruti", incorrect: "маруті", correct: "Марути", category: "names" },
  { id: "name_uttar_pradesh", incorrect: "Уттар Прадеш", correct: "Уттар-Прадеш", category: "names" },
  { id: "name_zamidar", incorrect: "замідар", correct: "заміндар", category: "names" },
  { id: "name_ashvini", incorrect: "Ашвіні кумари", correct: "Ашвіні-кумари", category: "names" },
  { id: "name_prakrita_sahajiya", incorrect: "пракріта сахаджії", correct: "пракріта-сахаджії", category: "names" },
  { id: "name_nava_yogendri", incorrect: "нава йоґендри", correct: "нава-йоґендри", category: "names" },
  { id: "name_lingam", incorrect: "лінга", correct: "лінґам", category: "names" },
  { id: "name_shiva_lingam", incorrect: "Шіва-лінга", correct: "Шіва-лінґам", category: "names" },
  { id: "name_somaraj", incorrect: "Сома-радж", correct: "Сомарадж", category: "names" },
  { id: "name_gandharvaraj", incorrect: "Ґандгарва-радж", correct: "Ґандгарварадж", category: "names" },
  { id: "name_madhva_gaudiya", incorrect: "Мадгва Ґаудія сампрадая", correct: "Мадгва-Ґаудія-сампрадая", category: "names" },
  { id: "name_brahma_madhva", incorrect: "Брахма Мадгва Ґаудія сампрадая", correct: "Брахма-Мадгва-Ґаудія-сампрадая", category: "names" },
  { id: "name_mahat_tattva", incorrect: "махат таттва", correct: "махат-таттва", category: "names" },
  { id: "name_nama_hatta", incorrect: "нама хатта", correct: "нама-хатта", category: "names" },
  { id: "name_kanthi_mala", incorrect: "кантхімала", correct: "кантхімала", category: "names", caseSensitive: true },
  { id: "name_vyasa_puja", incorrect: "В'яса пуджа", correct: "В'яса-пуджа", category: "names" },

  // =====================================================
  // ПЕРЕКЛАД ТЕРМІНІВ (англійська → українська)
  // =====================================================
  { id: "transl_false_ego", incorrect: "помилкове его", correct: "оманне его", category: "translation", description: "false ego → оманне его" },
  { id: "transl_spirit_soul", incorrect: "духова душа", correct: "духовна душа", category: "translation" },
  { id: "transl_goddess_fortune", incorrect: "богиня процвітання", correct: "богиня щастя", category: "translation", description: "goddess of fortune → богиня щастя" },
  { id: "transl_householder", incorrect: "домовласник", correct: "сімейна людина", category: "translation" },
  { id: "transl_householder2", incorrect: "домогосподар", correct: "сімейна людина", category: "translation", description: "householder → сімейна людина, НЕ домогосподар!" },
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

  // =====================================================
  // ЗАКІНЧЕННЯ СЛІВ: Без -А (прибираємо зайве -а)
  // =====================================================
  // Примітка: Довге "а" в кінці слова ніколи не скорочуємо (пуджа, парікрама тощо)

  // Імена та титули без -а
  { id: "ending_brahman", incorrect: "брахмана", correct: "брахман", category: "endings", description: "брахман (не брахмана)" },
  { id: "ending_kshatriya", incorrect: "кшатрія", correct: "кшатрій", category: "endings", description: "кшатрій (не кшатрія)" },
  { id: "ending_vaishnav", incorrect: "вайшнава", correct: "вайшнав", category: "endings", description: "вайшнав (не вайшнава)" },
  { id: "ending_vrindavan", incorrect: "Вріндавана", correct: "Вріндаван", category: "endings", description: "Вріндаван (не Вріндавана)" },
  { id: "ending_ashram", incorrect: "ашрама", correct: "ашрам", category: "endings", description: "ашрам (не ашрама)" },
  { id: "ending_govardhan", incorrect: "Ґовардгана", correct: "Ґовардган", category: "endings", description: "Ґовардган (не Ґовардгана)" },
  { id: "ending_gandharva", incorrect: "ґандгарва", correct: "ґандгарв", category: "endings", description: "ґандгарв (не ґандгарва)" },
  { id: "ending_rakshasa", incorrect: "ракшаса", correct: "ракшас", category: "endings", description: "ракшас (не ракшаса)" },
  { id: "ending_dasa", incorrect: "даса", correct: "дас", category: "endings", description: "дас (не даса)" },
  { id: "ending_jagannath", incorrect: "Джаґаннатха", correct: "Джаґаннатх", category: "endings", description: "Джаґаннатх (не Джаґаннатха)" },
  { id: "ending_thakur", incorrect: "Тхакура", correct: "Тхакур", category: "endings", description: "Тхакур (не Тхакура)" },
  { id: "ending_kumar", incorrect: "Кумара", correct: "Кумар", category: "endings", description: "Кумар (не Кумара)" },
  { id: "ending_narottam", incorrect: "Нароттама", correct: "Нароттам", category: "endings", description: "Нароттам (не Нароттама)" },
  { id: "ending_prasad", incorrect: "прасада", correct: "прасад", category: "endings", description: "прасад (не прасада)" },
  { id: "ending_mahaprasad", incorrect: "махапрасада", correct: "махапрасад", category: "endings", description: "махапрасад (не махапрасада)" },
  { id: "ending_marg", incorrect: "марґа", correct: "марґ", category: "endings", description: "марґ (не марґа)" },
  { id: "ending_ghat", incorrect: "ґгата", correct: "ґгат", category: "endings", description: "ґгат (не ґгата)" },
  { id: "ending_lakshman", incorrect: "Лакшмана", correct: "Лакшман", category: "endings", description: "Лакшман (не Лакшмана)" },
  { id: "ending_bhajan", incorrect: "бгаджана", correct: "бгаджан", category: "endings", description: "бгаджан (не бгаджана)" },
  { id: "ending_pandit", incorrect: "пандіта", correct: "пандіт", category: "endings", description: "пандіт (не пандіта)" },
  { id: "ending_kailas", incorrect: "Кайласа", correct: "Кайлас", category: "endings", description: "Кайлас (не Кайласа)" },
  { id: "ending_gopal", incorrect: "Ґопала", correct: "Ґопал", category: "endings", description: "Ґопал (не Ґопала)" },
  { id: "ending_kinnar", incorrect: "кіннара", correct: "кіннар", category: "endings", description: "кіннар (не кіннара)" },
  { id: "ending_charan", incorrect: "чарана", correct: "чаран", category: "endings", description: "чаран (не чарана)" },
  { id: "ending_pramath", incorrect: "праматха", correct: "праматх", category: "endings", description: "праматх (не праматха)" },
  { id: "ending_sandesh", incorrect: "сандеша", correct: "сандеш", category: "endings", description: "сандеш (не сандеша)" },
  { id: "ending_navadvip", incorrect: "Навадвіпа", correct: "Навадвіп", category: "endings", description: "Навадвіп (ч.р.)" },
  { id: "ending_math", incorrect: "матха", correct: "матх", category: "endings", description: "матх (не матха)" },
  { id: "ending_tilak", incorrect: "тілака", correct: "тілак", category: "endings", description: "тілак (про глину, не жіночі імена)" },
  { id: "ending_subal", incorrect: "Субала", correct: "Субал", category: "endings", description: "Субал (не Субала)" },
  { id: "ending_damodar", incorrect: "Дамодара", correct: "Дамодар", category: "endings", description: "Дамодар (не Дамодара)" },
  { id: "ending_vishnupad", incorrect: "Вішнупада", correct: "Вішнупад", category: "endings", description: "Вішнупад (не Вішнупада)" },
  { id: "ending_mahadev", incorrect: "Махадева", correct: "Махадев", category: "endings", description: "Махадев (не Махадева)" },
  { id: "ending_shridhar", incorrect: "Шрідгара", correct: "Шрідгар", category: "endings", description: "Шрідгар (не Шрідгара)" },
  { id: "ending_vishvambhar", incorrect: "Вішвамбара", correct: "Вішвамбар", category: "endings", description: "Вішвамбар (не Вішвамбара)" },
  { id: "ending_nilambar", incorrect: "Нілямбара", correct: "Ніламбар", category: "endings", description: "Ніламбар (не Нілямбара)" },
  { id: "ending_bharadvaj", incorrect: "Бгарадваджа", correct: "Бгарадвадж", category: "endings", description: "Бгарадвадж (не Бгарадваджа)" },
  { id: "ending_prabhas", incorrect: "Прабгаса", correct: "Прабгас", category: "endings", description: "Прабгас (не Прабгаса)" },
  { id: "ending_aniruddha", incorrect: "Аніруддга", correct: "Аніруддг", category: "endings", description: "Аніруддг (не Аніруддга)" },
  { id: "ending_virochan", incorrect: "Вірочана", correct: "Вірочан", category: "endings", description: "Вірочан (не Вірочана)" },
  { id: "ending_kashishvar", incorrect: "Кашішвара", correct: "Кашішвар", category: "endings", description: "Кашішвар (не Кашішвара)" },
  { id: "ending_anupam", incorrect: "Анупама", correct: "Анупам", category: "endings", description: "Анупам (не Анупама)" },
  { id: "ending_tukaram", incorrect: "Тукарама", correct: "Tукарам", category: "endings", description: "Тукарам (не Тукарама)" },
  { id: "ending_shripad", incorrect: "Шріпада", correct: "Шріпад", category: "endings", description: "Шріпад (не Шріпада)" },
  { id: "ending_lochan", incorrect: "Лочана", correct: "Лочан", category: "endings", description: "Лочан (не Лочана)" },
  { id: "ending_chandrashekhar", incorrect: "Чандрашекхара", correct: "Чандрашекхар", category: "endings", description: "Чандрашекхар (не Чандрашекхара)" },
  { id: "ending_shalagram", incorrect: "Шалаґрама", correct: "Шалаґрам", category: "endings", description: "Шалаґрам (не Шалаґрама)" },
  { id: "ending_jagay", incorrect: "Джаґая", correct: "Джаґай", category: "endings", description: "Джаґай (не Джаґая)" },
  { id: "ending_madhay", incorrect: "Мадгая", correct: "Мадгай", category: "endings", description: "Мадгай (не Мадгая)" },
  { id: "ending_chandal", incorrect: "чандала", correct: "чандал", category: "endings", description: "чандал (не чандала)" },
  { id: "ending_vanar", incorrect: "ванара", correct: "ванар", category: "endings", description: "ванар (не ванара)" },
  { id: "ending_dhananjay", incorrect: "Дгананджая", correct: "Дгананджай", category: "endings", description: "Дгананджай (не Дгананджая)" },
  { id: "ending_sanjay", incorrect: "Санджая", correct: "Санджай", category: "endings", description: "Санджай (не Санджая)" },
  { id: "ending_srinjay", incorrect: "Срінджая", correct: "Срінджай", category: "endings", description: "Срінджай (не Срінджая)" },
  { id: "ending_shrinivas", incorrect: "Шрінаваса", correct: "Шрінавас", category: "endings", description: "Шрінавас (не Шрінаваса)" },
  { id: "ending_shrivasa", incorrect: "Шріваса", correct: "Шрівас", category: "endings", description: "Шрівас (не Шріваса)" },
  { id: "ending_sagar", incorrect: "Саґара", correct: "Саґар", category: "endings", description: "Саґар (не Саґара)" },
  { id: "ending_gangasagar", incorrect: "Ґанґасаґара", correct: "Ґанґасаґар", category: "endings", description: "Ґанґасаґар (не Ґанґасаґара)" },
  { id: "ending_adhivasa", incorrect: "адгіваса", correct: "адгівас", category: "endings", description: "адгівас (не адгіваса)" },
  { id: "ending_mahesh", incorrect: "Махеша", correct: "Махеш", category: "endings", description: "Махеш (не Махеша)" },
  { id: "ending_tamal", incorrect: "тамала", correct: "тамал", category: "endings", description: "тамал (дерево, не тамала)" },
  { id: "ending_madana_mohan", incorrect: "Мадана-мохана", correct: "Мадана-мохан", category: "endings", description: "Мадана-мохан (не Мадана-мохана)" },
  { id: "ending_jharkhand", incorrect: "Джгарікханда", correct: "Джгарікханд", category: "endings", description: "Джгарікханд (не Джгарікханда)" },
  { id: "ending_rashtrabhrith", incorrect: "Раштрабгріта", correct: "Раштрабгріт", category: "endings", description: "Раштрабгріт (не Раштрабгріта)" },
  { id: "ending_pandava", incorrect: "Пандава", correct: "Пандав", category: "endings", description: "Пандав (не Пандава)" },
  { id: "ending_hastinpur", incorrect: "Хастінапура", correct: "Хастінапур", category: "endings", description: "Хастінапур (не Хастінапура)" },

  // Назви лісів з -ван без -а
  { id: "ending_bhadravan", incorrect: "Бгадравана", correct: "Бгадраван", category: "endings" },
  { id: "ending_bilvavan", incorrect: "Білвавана", correct: "Білваван", category: "endings" },
  { id: "ending_lauhavan", incorrect: "Лаухавана", correct: "Лаухаван", category: "endings" },
  { id: "ending_bhandiravan", incorrect: "Бгандіравана", correct: "Бгандіраван", category: "endings" },
  { id: "ending_mahavan", incorrect: "Махавана", correct: "Махаван", category: "endings" },
  { id: "ending_madhuvan", incorrect: "Мадгувана", correct: "Мадгуван", category: "endings" },
  { id: "ending_talavan", incorrect: "Талавана", correct: "Талаван", category: "endings" },
  { id: "ending_kumudavan", incorrect: "Кумудавана", correct: "Кумудаван", category: "endings" },
  { id: "ending_bahulavan", incorrect: "Бахулавана", correct: "Бахулаван", category: "endings" },
  { id: "ending_kamyavan", incorrect: "Кам'явана", correct: "Кам'яван", category: "endings" },
  { id: "ending_khadiravan", incorrect: "Кхадіравана", correct: "Кхадіраван", category: "endings" },

  // =====================================================
  // ЗАКІНЧЕННЯ СЛІВ: З -А (додаємо -а якщо відсутня)
  // =====================================================
  // Слова з -дева завжди з -а
  { id: "ending_avatara", incorrect: "аватар", correct: "аватара", category: "endings", description: "аватара (не аватар)" },
  { id: "ending_chaitanya", incorrect: "Чайтань", correct: "Чайтанья", category: "endings", description: "Чайтанья (не Чайтань)" },
  { id: "ending_vyasadeva", incorrect: "В'ясадев", correct: "В'ясадева", category: "endings", description: "В'ясадева (не В'ясадев)" },
  { id: "ending_prabhupada", incorrect: "Прабгупад", correct: "Прабгупада", category: "endings", description: "Прабгупада (не Прабгупад)" },
  { id: "ending_paramahamsa", incorrect: "парамахамс", correct: "парамахамса", category: "endings", description: "парамахамса (не парамахамс)" },
  { id: "ending_shukadeva", incorrect: "Шукадев", correct: "Шукадева", category: "endings", description: "Шукадева (не Шукадев)" },
  { id: "ending_grihastha", incorrect: "ґріхастх", correct: "ґріхастха", category: "endings", description: "ґріхастха (не ґріхастх)" },
  { id: "ending_vanaprastha", incorrect: "ванапрастх", correct: "ванапрастха", category: "endings", description: "ванапрастха (не ванапрастх)" },
  { id: "ending_vasudeva", incorrect: "Васудев", correct: "Васудева", category: "endings", description: "Васудева (не Васудев)" },
  { id: "ending_baladeva", incorrect: "Баладев", correct: "Баладева", category: "endings", description: "Баладева (не Баладев)" },
  { id: "ending_acharya", incorrect: "ачар'", correct: "ачар'я", category: "endings", description: "ачар'я (не ачар')" },
  { id: "ending_bhagavata", incorrect: "бгаґават", correct: "бгаґавата", category: "endings", description: "бгаґавата (не бгаґават)" },
  { id: "ending_naradadeva", incorrect: "Нарададев", correct: "Нарададева", category: "endings", description: "Нарададева (не Нарададев)" },
  { id: "ending_mahajana", incorrect: "махаджан", correct: "махаджана", category: "endings", description: "махаджана (не махаджан)" },
  { id: "ending_bhishmadeva", incorrect: "Бгішмадев", correct: "Бгішмадева", category: "endings", description: "Бгішмадева (не Бгішмадев)" },
  { id: "ending_varnashrama", incorrect: "варнашрам", correct: "варнашрама", category: "endings", description: "варнашрама (не варнашрам)" },
  { id: "ending_dvija", incorrect: "двідж", correct: "двіджа", category: "endings", description: "двіджа (не двідж)" },
  { id: "ending_ashvatthama", incorrect: "Ашваттхам", correct: "Ашваттхама", category: "endings", description: "Ашваттхама (не Ашваттхам)" },
  { id: "ending_dasharatha", incorrect: "Дашаратх", correct: "Дашаратха", category: "endings", description: "Дашаратха (не Дашаратх)" },
  { id: "ending_narasimhadeva", incorrect: "Нарасімхадев", correct: "Нарасімхадева", category: "endings", description: "Нарасімхадева (не Нарасімхадев)" },
  { id: "ending_nrisimhadeva", incorrect: "Нрісімхадев", correct: "Нрісімхадева", category: "endings", description: "Нрісімхадева (не Нрісімхадев)" },
  { id: "ending_bhakta", incorrect: "бгакт", correct: "бгакта", category: "endings", description: "бгакта (не бгакт)" },
  { id: "ending_mleccha", incorrect: "млечч", correct: "млеччха", category: "endings", description: "млеччха (не млечч)" },
  { id: "ending_asura", incorrect: "асур", correct: "асура", category: "endings", description: "асура (не асур)" },
  { id: "ending_tirtha", incorrect: "тіртх", correct: "тіртха", category: "endings", description: "тіртха (не тіртх)" },
  { id: "ending_mridanga", incorrect: "мріданґ", correct: "мріданґа", category: "endings", description: "мріданґа (не мріданґ)" },
  { id: "ending_yojana", incorrect: "йоджан", correct: "йоджана", category: "endings", description: "йоджана (не йоджан)" },
  { id: "ending_shudra", incorrect: "шудр", correct: "шудра", category: "endings", description: "шудра (не шудр)" },
  { id: "ending_vaishya", incorrect: "вайш'", correct: "вайш'я", category: "endings", description: "вайш'я (не вайш')" },
  { id: "ending_yaksha", incorrect: "якш", correct: "якша", category: "endings", description: "якша (не якш)" },
  { id: "ending_chitraratham", incorrect: "Чітраратх", correct: "Чітраратха", category: "endings", description: "Чітраратха (не Чітраратх)" },
  { id: "ending_siddha", incorrect: "сіддг", correct: "сіддга", category: "endings", description: "сіддга (не сіддг)" },
  { id: "ending_vidyadhara", incorrect: "відьядгар", correct: "відьядгара", category: "endings", description: "відьядгара (не відьядгар)" },
  { id: "ending_pishacha", incorrect: "пішач", correct: "пішача", category: "endings", description: "пішача (не пішач)" },
  { id: "ending_puja", incorrect: "пудж", correct: "пуджа", category: "endings", description: "пуджа (не пудж)" },
  { id: "ending_jaya", incorrect: "Джай", correct: "Джая", category: "endings", description: "Джая (особа, не Джай)" },
  { id: "ending_vijaya", incorrect: "Віджай", correct: "Віджая", category: "endings", description: "Віджая (особа, не Віджай)" },
  { id: "ending_avadhuta", incorrect: "авадгут", correct: "авадгута", category: "endings", description: "авадгута (не авадгут)" },
  { id: "ending_chaitanyadeva", incorrect: "Чайтаньядев", correct: "Чайтаньядева", category: "endings", description: "Чайтаньядева (не Чайтаньядев)" },
  { id: "ending_samosa", incorrect: "самос", correct: "самоса", category: "endings", description: "самоса (не самос)" },
  { id: "ending_prahlada", incorrect: "Прахлад", correct: "Прахлада", category: "endings", description: "Прахлада (не Прахлад)" },
  { id: "ending_upanishada", incorrect: "Упанішад", correct: "Упанішада", category: "endings", description: "Упанішада (не Упанішад)" },
  { id: "ending_ganesha", incorrect: "Ґанеш", correct: "Ґанеша", category: "endings", description: "Ґанеша (не Ґанеш)" },
  { id: "ending_ishvara", incorrect: "Ішвар", correct: "Ішвара", category: "endings", description: "Ішвара (не Ішвар)" },
  { id: "ending_narayana", incorrect: "Нараян", correct: "Нараяна", category: "endings", description: "Нараяна (не Нараян)" },
  { id: "ending_goloka", incorrect: "Ґолок", correct: "Ґолока", category: "endings", description: "Ґолока (не Ґолок)" },
  { id: "ending_dvaraka", incorrect: "Дварак", correct: "Дварака", category: "endings", description: "Дварака (не Дварак)" },
  { id: "ending_rama", incorrect: "Рам", correct: "Рама", category: "endings", description: "Рама (не Рам)", caseSensitive: true },
  { id: "ending_vibhishana", incorrect: "Вібгішан", correct: "Вібгішана", category: "endings", description: "Вібгішана (не Вібгішан)" },
  { id: "ending_indraprastha", incorrect: "Індрапрастх", correct: "Індрапрастха", category: "endings", description: "Індрапрастха (не Індрапрастх)" },
  { id: "ending_jada_bharata", incorrect: "Джада Бгарат", correct: "Джада Бгарата", category: "endings", description: "Джада Бгарата (не Джада Бгарат)" },
  { id: "ending_kamadev", incorrect: "Камадев", correct: "Камадева", category: "endings", description: "Камадева (не Камадев), слова з -дева з -а" },
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
