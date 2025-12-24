/**
 * Resources for Bhagavad-gita As It Is (Ukrainian)
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
