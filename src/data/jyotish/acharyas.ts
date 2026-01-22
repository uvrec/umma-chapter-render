/**
 * Дані Ґаудія-вайшнавських ачар'їв з накшатрами народження
 * Для інтеграції з джйотіш калькулятором
 */

export interface Acharya {
  id: string;
  name_sanskrit?: string;
  name_uk: string;
  name_en: string;
  title_uk: string;
  title_en: string;
  nakshatra_id: number; // 1-27
  birth_tithi?: {
    number: number;
    paksha: 'shukla' | 'krishna';
  };
  vaishnava_month_id?: number; // 1-12
  description_uk: string;
  description_en: string;
  is_major: boolean;
}

/**
 * Список ачар'їв з накшатрами народження
 */
export const ACHARYAS: Acharya[] = [
  // Панча-таттва
  {
    id: 'chaitanya-mahaprabhu',
    name_sanskrit: 'Śrī Kṛṣṇa Caitanya',
    name_uk: 'Шрі Чайтанья Махапрабгу',
    name_en: 'Sri Chaitanya Mahaprabhu',
    title_uk: 'Верховний Господь',
    title_en: 'Supreme Lord',
    nakshatra_id: 22, // Шравана
    birth_tithi: { number: 15, paksha: 'shukla' }, // Пурніма
    vaishnava_month_id: 11, // Ґовінда
    description_uk: 'Верховна Особа Бога в образі відданого. Народився у Навадвіпі 1486 року під час місячного затемнення.',
    description_en: 'The Supreme Personality of Godhead in the role of a devotee. Born in Navadvipa in 1486 during a lunar eclipse.',
    is_major: true,
  },
  {
    id: 'nityananda-prabhu',
    name_sanskrit: 'Śrī Nityānanda Prabhu',
    name_uk: 'Шрі Нітьянанда Прабгу',
    name_en: 'Sri Nityananda Prabhu',
    title_uk: 'Прояв Господа Баларами',
    title_en: 'Manifestation of Lord Balarama',
    nakshatra_id: 9, // Ашлеша
    birth_tithi: { number: 13, paksha: 'shukla' },
    vaishnava_month_id: 10, // Нараяна
    description_uk: 'Найближчий супутник Шрі Чайтаньї Махапрабгу, прояв Господа Баларами.',
    description_en: 'Closest associate of Sri Chaitanya Mahaprabhu, manifestation of Lord Balarama.',
    is_major: true,
  },
  {
    id: 'advaita-acharya',
    name_sanskrit: 'Śrī Advaita Ācārya',
    name_uk: 'Шрі Адвайта Ачар\'я',
    name_en: 'Sri Advaita Acharya',
    title_uk: 'Втілення Маха-Вішну',
    title_en: 'Incarnation of Maha-Vishnu',
    nakshatra_id: 8, // Пуш'я
    birth_tithi: { number: 7, paksha: 'shukla' },
    vaishnava_month_id: 10,
    description_uk: 'Своїми молитвами закликав Господа Чайтанью зійти на Землю.',
    description_en: 'Called Lord Chaitanya to descend to Earth through his prayers.',
    is_major: true,
  },
  {
    id: 'gadadhara-pandita',
    name_sanskrit: 'Śrī Gadādhara Paṇḍita',
    name_uk: 'Шрі Ґададгара Пандіт',
    name_en: 'Sri Gadadhara Pandita',
    title_uk: 'Втілення Шріматі Радхарані',
    title_en: 'Incarnation of Srimati Radharani',
    nakshatra_id: 22, // Шравана
    birth_tithi: { number: 11, paksha: 'shukla' },
    vaishnava_month_id: 11,
    description_uk: 'Найближчий супутник Шрі Чайтаньї, втілення Шріматі Радхарані.',
    description_en: 'Closest associate of Sri Chaitanya, incarnation of Srimati Radharani.',
    is_major: true,
  },
  {
    id: 'shrivasa-thakura',
    name_sanskrit: 'Śrīvāsa Ṭhākura',
    name_uk: 'Шріваса Тхакур',
    name_en: 'Shrivasa Thakura',
    title_uk: 'Одне з Панча-таттви',
    title_en: 'One of the Pancha-tattva',
    nakshatra_id: 16, // Вішакха
    description_uk: 'В його домі проводилися нічні кіртани Шрі Чайтаньї Махапрабгу.',
    description_en: 'In his home the nocturnal kirtans of Sri Chaitanya Mahaprabhu were held.',
    is_major: true,
  },

  // Шість Ґосвамі Вріндавана
  {
    id: 'rupa-goswami',
    name_sanskrit: 'Śrīla Rūpa Gosvāmī',
    name_uk: 'Шріла Рупа Ґосвамі',
    name_en: 'Srila Rupa Goswami',
    title_uk: 'Голова Шести Ґосвамі',
    title_en: 'Head of Six Goswamis',
    nakshatra_id: 4, // Рохіні
    description_uk: 'Автор «Бгакті-расамріта-сіндгу» та «Уджвала-ніламані».',
    description_en: 'Author of Bhakti-rasamrita-sindhu and Ujjvala-nilamani.',
    is_major: true,
  },
  {
    id: 'sanatana-goswami',
    name_sanskrit: 'Śrīla Sanātana Gosvāmī',
    name_uk: 'Шріла Санатана Ґосвамі',
    name_en: 'Srila Sanatana Goswami',
    title_uk: 'Один із Шести Ґосвамі',
    title_en: 'One of Six Goswamis',
    nakshatra_id: 25, // Пурва Бгадрапада
    description_uk: 'Старший брат Рупи Ґосвамі, автор «Хаті-бгакті-віласи».',
    description_en: 'Elder brother of Rupa Goswami, author of Hari-bhakti-vilasa.',
    is_major: true,
  },
  {
    id: 'raghunatha-dasa-goswami',
    name_sanskrit: 'Śrīla Raghunātha dāsa Gosvāmī',
    name_uk: 'Шріла Раґхунатха даса Ґосвамі',
    name_en: 'Srila Raghunatha dasa Goswami',
    title_uk: 'Один із Шести Ґосвамі',
    title_en: 'One of Six Goswamis',
    nakshatra_id: 8, // Пуш'я
    birth_tithi: { number: 5, paksha: 'shukla' },
    vaishnava_month_id: 10,
    description_uk: 'Автор «Вілапа-кусуманджалі», зразок відречення.',
    description_en: 'Author of Vilapa-kusumanjali, example of renunciation.',
    is_major: true,
  },
  {
    id: 'raghunatha-bhatta-goswami',
    name_sanskrit: 'Śrīla Raghunātha Bhaṭṭa Gosvāmī',
    name_uk: 'Шріла Раґхунатха Бгатта Ґосвамі',
    name_en: 'Srila Raghunatha Bhatta Goswami',
    title_uk: 'Один із Шести Ґосвамі',
    title_en: 'One of Six Goswamis',
    nakshatra_id: 7, // Пунарвасу
    description_uk: 'Відомий оповідач «Шрімад-Бгаґаватам».',
    description_en: 'Famous reciter of Srimad-Bhagavatam.',
    is_major: true,
  },
  {
    id: 'jiva-goswami',
    name_sanskrit: 'Śrīla Jīva Gosvāmī',
    name_uk: 'Шріла Джіва Ґосвамі',
    name_en: 'Srila Jiva Goswami',
    title_uk: 'Один із Шести Ґосвамі',
    title_en: 'One of Six Goswamis',
    nakshatra_id: 6, // Ардра
    description_uk: 'Автор «Шат-сандарбг» та найвидатніший філософ Ґаудія-вайшнавізму.',
    description_en: 'Author of Shat-sandarbhas and greatest philosopher of Gaudiya Vaishnavism.',
    is_major: true,
  },
  {
    id: 'gopala-bhatta-goswami',
    name_sanskrit: 'Śrīla Gopāla Bhaṭṭa Gosvāmī',
    name_uk: 'Шріла Ґопала Бгатта Ґосвамі',
    name_en: 'Srila Gopala Bhatta Goswami',
    title_uk: 'Один із Шести Ґосвамі',
    title_en: 'One of Six Goswamis',
    nakshatra_id: 17, // Анурадха
    description_uk: 'Встановив Божество Шрі Радха-Раман у Вріндавані.',
    description_en: 'Installed the Deity of Sri Radha-Raman in Vrindavan.',
    is_major: true,
  },

  // Пізніші ачар'ї
  {
    id: 'vishvanatha-chakravarti',
    name_sanskrit: 'Śrīla Viśvanātha Cakravartī Ṭhākura',
    name_uk: 'Шріла Вішванатха Чакраварті Тхакур',
    name_en: 'Srila Vishvanatha Chakravarti Thakura',
    title_uk: 'Великий ачар\'я та коментатор',
    title_en: 'Great Acharya and Commentator',
    nakshatra_id: 7, // Пунарвасу
    birth_tithi: { number: 5, paksha: 'shukla' },
    vaishnava_month_id: 10,
    description_uk: 'Автор коментарів до «Шрімад-Бгаґаватам» та «Бгаґавад-ґіти».',
    description_en: 'Author of commentaries on Srimad-Bhagavatam and Bhagavad-gita.',
    is_major: true,
  },
  {
    id: 'baladeva-vidyabhushana',
    name_sanskrit: 'Śrīla Baladeva Vidyābhūṣaṇa',
    name_uk: 'Шріла Баладева Відьябгушана',
    name_en: 'Srila Baladeva Vidyabhushana',
    title_uk: 'Великий філософ та коментатор',
    title_en: 'Great Philosopher and Commentator',
    nakshatra_id: 21, // Уттарашадха
    description_uk: 'Автор «Ґовінда-бгаш\'ї» — коментаря до «Веданта-сутри».',
    description_en: 'Author of Govinda-bhashya - commentary on Vedanta-sutra.',
    is_major: true,
  },
  {
    id: 'bhaktivinoda-thakura',
    name_sanskrit: 'Śrīla Bhaktivinoda Ṭhākura',
    name_uk: 'Шріла Бгактівінода Тхакур',
    name_en: 'Srila Bhaktivinoda Thakura',
    title_uk: 'Сьомий Ґосвамі',
    title_en: 'Seventh Goswami',
    nakshatra_id: 12, // Уттара Пхалґуні
    description_uk: 'Відроджувач Ґаудія-вайшнавізму в 19 столітті, автор багатьох книг.',
    description_en: 'Reviver of Gaudiya Vaishnavism in the 19th century, author of many books.',
    is_major: true,
  },
  {
    id: 'gaurakishora-dasa-babaji',
    name_sanskrit: 'Śrīla Gaurakiśora dāsa Bābājī Mahārāja',
    name_uk: 'Шріла Ґауракішора даса Бабаджі Махарадж',
    name_en: 'Srila Gaurakishora dasa Babaji Maharaja',
    title_uk: 'Парама-бгаґавата',
    title_en: 'Parama-bhagavata',
    nakshatra_id: 19, // Мула
    description_uk: 'Духовний вчитель Шріли Бгактісіддганти Сарасваті Тхакура.',
    description_en: 'Spiritual master of Srila Bhaktisiddhanta Sarasvati Thakura.',
    is_major: true,
  },
  {
    id: 'bhaktisiddhanta-sarasvati',
    name_sanskrit: 'Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura',
    name_uk: 'Шріла Бгактісіддганта Сарасваті Тхакур',
    name_en: 'Srila Bhaktisiddhanta Sarasvati Thakura',
    title_uk: 'Засновник-ачар\'я Ґаудія Матха',
    title_en: 'Founder-Acharya of Gaudiya Math',
    nakshatra_id: 21, // Уттарашадха
    birth_tithi: { number: 5, paksha: 'shukla' },
    vaishnava_month_id: 10,
    description_uk: 'Духовний вчитель Шріли Прабгупади, засновник Ґаудія Матха, експерт у джйотіш.',
    description_en: 'Spiritual master of Srila Prabhupada, founder of Gaudiya Math, expert in Jyotish.',
    is_major: true,
  },
  {
    id: 'prabhupada',
    name_sanskrit: 'A.C. Bhaktivedānta Svāmī Prabhupāda',
    name_uk: 'Шріла Прабгупада',
    name_en: 'Srila Prabhupada',
    title_uk: 'Засновник-ачар\'я ISKCON',
    title_en: 'Founder-Acharya of ISKCON',
    nakshatra_id: 23, // Дханішта
    description_uk: 'Засновник Міжнародного товариства свідомості Крішни, переклав та прокоментував основні ведичні писання.',
    description_en: 'Founder of ISKCON, translated and commented on major Vedic scriptures.',
    is_major: true,
  },

  // Вічні супутниці
  {
    id: 'vishnupriya-devi',
    name_sanskrit: 'Śrīmatī Viṣṇupriyā Devī',
    name_uk: 'Шріматі Вішнупрія Деві',
    name_en: 'Srimati Vishnupriya Devi',
    title_uk: 'Вічна супутниця Господа Чайтаньї',
    title_en: 'Eternal Consort of Lord Chaitanya',
    nakshatra_id: 22, // Шравана
    birth_tithi: { number: 5, paksha: 'shukla' },
    vaishnava_month_id: 10,
    description_uk: 'Вічна супутниця Шрі Чайтаньї Махапрабгу.',
    description_en: 'Eternal consort of Sri Chaitanya Mahaprabhu.',
    is_major: true,
  },
  {
    id: 'pundarika-vidyanidhi',
    name_sanskrit: 'Śrī Puṇḍarīka Vidyānidhi',
    name_uk: 'Шрі Пундаріка Відьянідхі',
    name_en: 'Sri Pundarika Vidyanidhi',
    title_uk: 'Втілення Вршабгану Махараджа',
    title_en: 'Incarnation of Vrishabhanu Maharaja',
    nakshatra_id: 4, // Рохіні
    birth_tithi: { number: 5, paksha: 'shukla' },
    vaishnava_month_id: 10,
    description_uk: 'Втілення батька Шріматі Радхарані.',
    description_en: 'Incarnation of the father of Srimati Radharani.',
    is_major: true,
  },
];

/**
 * Отримати ачар'їв за накшатрою народження
 */
export function getAcharyasByNakshatra(nakshatraId: number): Acharya[] {
  return ACHARYAS.filter(a => a.nakshatra_id === nakshatraId);
}

/**
 * Отримати всіх ачар'їв з такою самою накшатрою
 */
export function getSaintsWithSameNakshatra(nakshatraId: number): {
  saints: Acharya[];
  count: number;
} {
  const saints = getAcharyasByNakshatra(nakshatraId);
  return {
    saints,
    count: saints.length,
  };
}

/**
 * Отримати ачар'ю за ID
 */
export function getAcharyaById(id: string): Acharya | undefined {
  return ACHARYAS.find(a => a.id === id);
}

export default ACHARYAS;
