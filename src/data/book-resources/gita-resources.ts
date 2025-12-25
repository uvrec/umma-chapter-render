/**
 * Resources for Bhagavad-gita As It Is
 * Complete book metadata, chapters, dedication, and disciplic succession
 */

export interface DedicationData {
  title: string;
  content: string;
}

export interface DiscipleLineage {
  name: string;
  altNames?: string[];
}

export interface DisciplicSuccessionData {
  title: string;
  verse: string;
  verseReference: string;
  introduction: string;
  lineage: DiscipleLineage[];
}

export interface ChapterInfo {
  number: number;
  title_ua: string;
  title_en: string;
  subtitle_ua?: string;
  subtitle_en?: string;
}

export interface BookMetadata {
  slug: string;
  title_ua: string;
  title_en: string;
  subtitle_ua?: string;
  subtitle_en?: string;
  author_ua: string;
  author_en: string;
  author_title_ua: string;
  author_title_en: string;
  isbn?: string;
  copyright: string;
  publisher: string;
}

// Book metadata
export const GITA_BOOK_INFO: BookMetadata = {
  slug: "gita",
  title_ua: "Бгаґавад-ґіта як вона є",
  title_en: "Bhagavad-gītā As It Is",
  subtitle_ua: "з транслітерацією санскриту, послівним перекладом, літературним перекладом та коментарями",
  subtitle_en: "with Roman transliteration, English equivalents, translation and elaborate purports",
  author_ua: "А.Ч. Бгактіведанта Свамі Прабгупада",
  author_en: "A.C. Bhaktivedanta Swami Prabhupāda",
  author_title_ua: "Його Божественна Милість",
  author_title_en: "His Divine Grace",
  isbn: "978-91-7149-560-0",
  copyright: "© 1972 The Bhaktivedanta Book Trust",
  publisher: "The Bhaktivedanta Book Trust International, Inc.",
};

// All 18 chapters
export const GITA_CHAPTERS: ChapterInfo[] = [
  {
    number: 1,
    title_ua: "Огляд армій на полі битви Курукшетра",
    title_en: "Observing the Armies on the Battlefield of Kurukṣetra",
  },
  {
    number: 2,
    title_ua: "Зміст Ґіти в стислому викладі",
    title_en: "Contents of the Gītā Summarized",
  },
  {
    number: 3,
    title_ua: "Карма-йоґа",
    title_en: "Karma-yoga",
  },
  {
    number: 4,
    title_ua: "Трансцендентне знання",
    title_en: "Transcendental Knowledge",
  },
  {
    number: 5,
    title_ua: "Карма-йоґа — діяльність у свідомості Крішни",
    title_en: "Karma-yoga—Action in Kṛṣṇa Consciousness",
  },
  {
    number: 6,
    title_ua: "Дг'яна-йоґа",
    title_en: "Dhyāna-yoga",
  },
  {
    number: 7,
    title_ua: "Знання про Абсолют",
    title_en: "Knowledge of the Absolute",
  },
  {
    number: 8,
    title_ua: "Досягнення Всевишнього",
    title_en: "Attaining the Supreme",
  },
  {
    number: 9,
    title_ua: "Найпотаємніше знання",
    title_en: "The Most Confidential Knowledge",
  },
  {
    number: 10,
    title_ua: "Велич Абсолюту",
    title_en: "The Opulence of the Absolute",
  },
  {
    number: 11,
    title_ua: "Всесвітня форма",
    title_en: "The Universal Form",
  },
  {
    number: 12,
    title_ua: "Віддане служіння",
    title_en: "Devotional Service",
  },
  {
    number: 13,
    title_ua: "Природа, той, хто насолоджується, і свідомість",
    title_en: "Nature, the Enjoyer and Consciousness",
  },
  {
    number: 14,
    title_ua: "Три ґуни матеріальної природи",
    title_en: "The Three Modes of Material Nature",
  },
  {
    number: 15,
    title_ua: "Йоґа Верховної Особи",
    title_en: "The Yoga of the Supreme Person",
  },
  {
    number: 16,
    title_ua: "Божественні та демонічні натури",
    title_en: "The Divine and Demoniac Natures",
  },
  {
    number: 17,
    title_ua: "Різновиди віри",
    title_en: "The Divisions of Faith",
  },
  {
    number: 18,
    title_ua: "Висновок — досконалість зречення",
    title_en: "Conclusion—The Perfection of Renunciation",
  },
];

// Front matter sections
export const GITA_FRONT_MATTER = {
  foreword: {
    title_ua: "Передмова",
    title_en: "Foreword",
    author: "Professor Edward C. Dimock, Jr.",
    institution: "Department of South Asian Languages and Civilization, University of Chicago",
  },
  preface: {
    title_ua: "Вступне слово автора",
    title_en: "Preface",
    date: "12 May 1971",
    location: "Sydney, Australia",
  },
  introduction: {
    title_ua: "Вступ",
    title_en: "Introduction",
  },
};

// List of books by Śrīla Prabhupāda
export const PRABHUPADA_BOOKS = {
  title_ua: "Книги Шріли Прабгупади",
  title_en: "Books by His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda",
  books: [
    { title_en: "Bhagavad-gītā As It Is", title_ua: "Бгаґавад-ґіта як вона є" },
    { title_en: "Śrīmad-Bhāgavatam (completed by disciples)", title_ua: "Шрімад-Бгаґаватам (завершено учнями)" },
    { title_en: "Śrī Caitanya-caritāmṛta", title_ua: "Шрі Чайтанья-чарітамріта" },
    { title_en: "Kṛṣṇa, the Supreme Personality of Godhead", title_ua: "Крішна, Верховний Бог-Особа" },
    { title_en: "Teachings of Lord Caitanya", title_ua: "Вчення Господа Чайтаньї" },
    { title_en: "The Nectar of Devotion", title_ua: "Нектар відданості" },
    { title_en: "The Nectar of Instruction", title_ua: "Нектар настанов" },
    { title_en: "Śrī Īśopaniṣad", title_ua: "Шрі Ішопанішад" },
    { title_en: "Light of the Bhāgavata", title_ua: "Світло Бгаґавати" },
    { title_en: "Easy Journey to Other Planets", title_ua: "Легка подорож на інші планети" },
    { title_en: "Teachings of Lord Kapila, the Son of Devahūti", title_ua: "Вчення Господа Капіли, сина Девагуті" },
    { title_en: "Teachings of Queen Kuntī", title_ua: "Вчення цариці Кунті" },
    { title_en: "Message of Godhead", title_ua: "Послання Бога" },
    { title_en: "The Science of Self-Realization", title_ua: "Наука самоусвідомлення" },
    { title_en: "The Perfection of Yoga", title_ua: "Досконалість йоґи" },
    { title_en: "Beyond Birth and Death", title_ua: "По той бік народження і смерті" },
    { title_en: "On the Way to Kṛṣṇa", title_ua: "На шляху до Крішни" },
    { title_en: "Rāja-vidyā: The King of Knowledge", title_ua: "Раджа-відья: найшляхетніше знання" },
    { title_en: "Elevation to Kṛṣṇa Consciousness", title_ua: "Підняття до свідомості Крішни" },
    { title_en: "Kṛṣṇa Consciousness: The Matchless Gift", title_ua: "Свідомість Крішни: неперевершений дар" },
    { title_en: "Kṛṣṇa Consciousness: The Topmost Yoga System", title_ua: "Свідомість Крішни: найвища система йоґи" },
    { title_en: "Perfect Questions, Perfect Answers", title_ua: "Досконалі запитання, досконалі відповіді" },
    { title_en: "Life Comes from Life", title_ua: "Життя походить від життя" },
    { title_en: "The Nārada-bhakti-sūtra (completed by disciples)", title_ua: "Нарада-бгакті-сутра (завершено учнями)" },
    { title_en: "The Mukunda-mālā-stotra (completed by disciples)", title_ua: "Мукунда-мала-стотра (завершено учнями)" },
    { title_en: "Back to Godhead magazine (founder)", title_ua: "Журнал «Назад до Бога» (засновник)" },
  ],
  compiledBooks: {
    title_en: "Books compiled from the teachings of Śrīla Prabhupāda after his lifetime",
    title_ua: "Книги, укладені на основі вчень Шріли Прабгупади після його відходу",
    books: [
      { title_en: "The Journey of Self-Discovery", title_ua: "Подорож самовідкриття" },
      { title_en: "Civilization and Transcendence", title_ua: "Цивілізація і трансцендентність" },
      { title_en: "The Laws of Nature", title_ua: "Закони природи" },
      { title_en: "Renunciation Through Wisdom", title_ua: "Зречення через мудрість" },
      { title_en: "Beyond Illusion and Doubt", title_ua: "По той бік ілюзії та сумнівів" },
    ],
  },
};

export const GITA_DEDICATION_UA: DedicationData = {
  title: "Посвята",
  content: `«Бгаґавад-ґіта як вона є» присвячується Шрілі Баладеві Відьябгушані, авторові «Ґовінда-бгашʼї», прекрасних коментарів до «Веданта-сутри»`,
};

export const GITA_DEDICATION_EN: DedicationData = {
  title: "Dedication",
  content: `Bhagavad-gītā As It Is is dedicated to Śrīla Baladeva Vidyābhūṣaṇa, the author of the Govinda-bhāṣya, beautiful commentaries on Vedānta-sūtra`,
};

export const GITA_DISCIPLIC_SUCCESSION_UA: DisciplicSuccessionData = {
  title: "Ланки ланцюга учнівської послідовності",
  verse: "Евам̇ парампара̄-пра̄птам імам̇ ра̄джаршайо відух̣",
  verseReference: "Б.-ґ., 4.2",
  introduction: "«Бгаґавад-ґіта» передавалась якою вона є від учителя до учня в такій послідовності:",
  lineage: [
    { name: "Крішна" },
    { name: "Брахма" },
    { name: "Нарада" },
    { name: "Вʼяса" },
    { name: "Мадгва" },
    { name: "Падманабга" },
    { name: "Нріхарі" },
    { name: "Мадгава" },
    { name: "Акшобгʼя" },
    { name: "Джая Тіртха" },
    { name: "Гʼянасіндгу" },
    { name: "Даянідгі" },
    { name: "Відьянідгі" },
    { name: "Раджендра" },
    { name: "Джаядгарма" },
    { name: "Пурушоттама" },
    { name: "Брахманья Тіртха" },
    { name: "Вʼяса Тіртха" },
    { name: "Лакшміпаті" },
    { name: "Мадгавендра Пурі" },
    { name: "Ішвара Пурі", altNames: ["Нітьянанда", "Адвайта"] },
    { name: "Господь Чайтанья" },
    { name: "Рупа", altNames: ["Сварупа", "Санатана"] },
    { name: "Раґгунатх, Джіва" },
    { name: "Крішнадас" },
    { name: "Нароттам" },
    { name: "Вішванатх" },
    { name: "Баладева", altNames: ["Джаґаннатх"] },
    { name: "Бгактівінод" },
    { name: "Ґауракішор" },
    { name: "Бгактісіддганта Сарасваті" },
    { name: "А.Ч. Бгактіведанта Свамі Прабгупада" },
  ],
};

export const GITA_DISCIPLIC_SUCCESSION_EN: DisciplicSuccessionData = {
  title: "The Disciplic Succession",
  verse: "evaṁ paramparā-prāptam imaṁ rājarṣayo viduḥ",
  verseReference: "Bg. 4.2",
  introduction: "This Bhagavad-gītā As It Is is received through this disciplic succession:",
  lineage: [
    { name: "Kṛṣṇa" },
    { name: "Brahmā" },
    { name: "Nārada" },
    { name: "Vyāsa" },
    { name: "Madhva" },
    { name: "Padmanābha" },
    { name: "Nṛhari" },
    { name: "Mādhava" },
    { name: "Akṣobhya" },
    { name: "Jaya Tīrtha" },
    { name: "Jñānasindhu" },
    { name: "Dayānidhi" },
    { name: "Vidyānidhi" },
    { name: "Rājendra" },
    { name: "Jayadharma" },
    { name: "Puruṣottama" },
    { name: "Brahmaṇya Tīrtha" },
    { name: "Vyāsa Tīrtha" },
    { name: "Lakṣmīpati" },
    { name: "Mādhavendra Purī" },
    { name: "Īśvara Purī", altNames: ["Nityānanda", "Advaita"] },
    { name: "Lord Caitanya" },
    { name: "Rūpa", altNames: ["Svarūpa", "Sanātana"] },
    { name: "Raghunātha, Jīva" },
    { name: "Kṛṣṇadāsa" },
    { name: "Narottama" },
    { name: "Viśvanātha" },
    { name: "Baladeva", altNames: ["Jagannātha"] },
    { name: "Bhaktivinoda" },
    { name: "Gaurakiśora" },
    { name: "Bhaktisiddhānta Sarasvatī" },
    { name: "A.C. Bhaktivedanta Swami Prabhupāda" },
  ],
};
