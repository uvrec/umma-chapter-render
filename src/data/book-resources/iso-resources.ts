/**
 * Resources for Śrī Īśopaniṣad
 * Complete book metadata, mantras, dedication, and disciplic succession
 */

import {
  DedicationData,
  DisciplicSuccessionData,
  BookMetadata
} from "./gita-resources";

export interface MantraInfo {
  number: number;
  title_uk?: string;
  title_en?: string;
}

// Book metadata
export const ISO_BOOK_INFO: BookMetadata = {
  slug: "iso",
  title_uk: "Шрі Ішопанішад",
  title_en: "Śrī Īśopaniṣad",
  subtitle_uk: "Знання, що наближає до Верховного Бога-Особи, Крішни",
  subtitle_en: "The Knowledge That Brings One Nearer to the Supreme Personality of Godhead, Kṛṣṇa",
  author_uk: "А.Ч. Бгактіведанта Свамі Прабгупада",
  author_en: "A.C. Bhaktivedanta Swami Prabhupāda",
  author_title_uk: "Його Божественна Милість",
  author_title_en: "His Divine Grace",
  isbn: "978-91-7769-427-4",
  copyright: "© 1969 The Bhaktivedanta Book Trust",
  publisher: "The Bhaktivedanta Book Trust International, Inc.",
};

// All 18 mantras
export const ISO_MANTRAS: MantraInfo[] = [
  { number: 1 },
  { number: 2 },
  { number: 3 },
  { number: 4 },
  { number: 5 },
  { number: 6 },
  { number: 7 },
  { number: 8 },
  { number: 9 },
  { number: 10 },
  { number: 11 },
  { number: 12 },
  { number: 13 },
  { number: 14 },
  { number: 15 },
  { number: 16 },
  { number: 17 },
  { number: 18 },
];

// Front matter sections
export const ISO_FRONT_MATTER = {
  introduction: {
    title_uk: "Вчення Вед",
    title_en: "The Teachings of the Vedas",
    subtitle_uk: "Лекція, прочитана 6 жовтня 1969 року у Бостонському храмі в Корнуей-стріт",
    subtitle_en: "Lecture delivered October 6, 1969 at the Boston Temple on Cornway Street",
  },
  invocation: {
    title_uk: "Звернення",
    title_en: "Invocation",
  },
};

// Appendices
export const ISO_APPENDICES = {
  aboutAuthor: {
    slug: "about-author",
    title_uk: "Про автора",
    title_en: "About the Author",
  },
  glossary: {
    slug: "glossary",
    title_uk: "Глосарій",
    title_en: "Glossary",
  },
  sanskritPronunciation: {
    slug: "sanskrit-pronunciation",
    title_uk: "Як читати санскрит",
    title_en: "A Note About Sanskrit Pronunciation",
  },
  citedLiterature: {
    slug: "cited-literature",
    title_uk: "Цитована література",
    title_en: "Cited Literature",
  },
  bbtInfo: {
    slug: "bbt-info",
    title_uk: "ББТ",
    title_en: "BBT",
  },
};

// List of books by Śrīla Prabhupāda (Ukrainian version for Īśopaniṣad)
export const ISO_PRABHUPADA_BOOKS_UK = {
  title: "Книги Шріли Прабгупади",
  books: [
    "Бгаґавад-ґіта як вона є",
    "Шрімад-Бгаґаватам (завершено учнями)",
    "Шрі Чайтанья-чарітамріта",
    "Крішна, Верховний Бог-Особа",
    "Вчення Господа Чайтаньї",
    "Вчення Господа Капіли, сина Девагуті",
    "Нектар відданості",
    "Нектар настанов",
    "Шрі Ішопанішад",
    "Легка подорож на інші планети",
    "Наука самоусвідомлення",
    "Раджа-відья: найшляхетніше знання",
    "По той бік народження і смерті",
    "На шляху до Крішни",
    "Досконалість йоґи",
    "Свідомість Крішни: неперевершений дар",
    "Досконалі запитання, досконалі відповіді",
    "Вчення цариці Кунті",
    "Життя походить від життя",
    "Назад до Бога (журнал, засновник)",
  ],
};

export const ISO_DEDICATION_UK: DedicationData = {
  title: "Посвята",
  content: `Шрі Ішопанішад присвячується Його Божественній Милості Ом Вішнупаді Парамахамсі Шрі Шрімад Бгактісіддганті Сарасваті Ґосвамі Махараджі, який так милостиво зʼявився у цьому світі, щоб передати вчення Господа Чайтаньї.`,
};

export const ISO_DEDICATION_EN: DedicationData = {
  title: "Dedication",
  content: `Śrī Īśopaniṣad is dedicated to His Divine Grace Oṁ Viṣṇupāda Paramahaṁsa Śrī Śrīmad Bhaktisiddhānta Sarasvatī Gosvāmī Mahārāja, who so kindly appeared in this world to deliver the teachings of Lord Caitanya.`,
};

export const ISO_DISCIPLIC_SUCCESSION_UK: DisciplicSuccessionData = {
  title: "Ланки ланцюга учнівської послідовності",
  verse: "Евам̇ парампара̄-пра̄птам імам̇ ра̄джаршайо відух̣",
  verseReference: "Б.-ґ., 4.2",
  introduction: "Ведичне знання передавалось у такій послідовності:",
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

export const ISO_DISCIPLIC_SUCCESSION_EN: DisciplicSuccessionData = {
  title: "The Disciplic Succession",
  verse: "evaṁ paramparā-prāptam imaṁ rājarṣayo viduḥ",
  verseReference: "Bg. 4.2",
  introduction: "This Vedic knowledge is received through this disciplic succession:",
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

// Cited literature
export const ISO_CITED_LITERATURE_UK = {
  title: "Цитована література",
  introduction: "У цьому покажчику подано назви ведичних писань, на які автор посилається у своїх поясненнях.",
  sources: [
    "Бгаґавад-ґіта",
    "Брахма-самхіта",
    "Брахма-сутра (Веданта-сутра)",
    "Бріхад-аран'яка-упанішада",
    "Веди",
    "Вішну Пурана",
    "Ішопанішада",
    "Катха-упанішада",
    "Мундака-упанішада",
    "Падма Пурана",
    "Рамаяна",
    "Сканда Пурана",
    "Упанішади",
    "Шветашватара-упанішада",
    "Шрімад-Бгаґаватам",
  ],
  abbreviations: [
    { abbr: "Б.-ґ.", full: "Бгаґавад-ґіта" },
    { abbr: "Бгаґ.", full: "Шрімад-Бгаґаватам" },
    { abbr: "Б.-с.", full: "Брахма-самхіта" },
  ],
};
