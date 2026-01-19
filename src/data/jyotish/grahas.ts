/**
 * 9 Ґрах (Планет)
 * Транслітерація згідно з правилами проекту UMMA
 */

import { Graha, GrahaPlanet } from '@/types/jyotish';

/**
 * Повний список 9 ґрах (планет)
 * Включає 7 класичних планет + Раху та Кету
 */
export const GRAHAS: Graha[] = [
  {
    id: 'surya',
    name_iast: 'Sūrya',
    name_uk: 'Сур\'я',
    name_en: 'Surya',
    name_sanskrit: 'सूर्य',
    western_name_uk: 'Сонце',
    western_name_en: 'Sun',
    day_of_week_uk: 'Неділя',
    day_of_week_en: 'Sunday',
    nature: 'malefic',
    element: 'fire',
    color_uk: 'Оранжевий, золотий',
    color_en: 'Orange, gold',
    metal_uk: 'Золото',
    metal_en: 'Gold',
    gemstone_uk: 'Рубін',
    gemstone_en: 'Ruby',
    direction: 'East',
    owns_rashis: [5], // Сімха
    exalted_in: 1, // Меша
    debilitated_in: 7, // Тула
    description_uk: 'Сур\'я — цар планет, що символізує душу, его, батька та владу. Дарує життєву силу, самовпевненість та лідерські якості.',
    description_en: 'Surya is the king of planets, symbolizing soul, ego, father, and authority. Bestows vitality, self-confidence, and leadership qualities.',
  },
  {
    id: 'chandra',
    name_iast: 'Candra',
    name_uk: 'Чандра',
    name_en: 'Chandra',
    name_sanskrit: 'चन्द्र',
    western_name_uk: 'Місяць',
    western_name_en: 'Moon',
    day_of_week_uk: 'Понеділок',
    day_of_week_en: 'Monday',
    nature: 'benefic',
    element: 'water',
    color_uk: 'Білий, сріблястий',
    color_en: 'White, silver',
    metal_uk: 'Срібло',
    metal_en: 'Silver',
    gemstone_uk: 'Перлина, місячний камінь',
    gemstone_en: 'Pearl, moonstone',
    direction: 'Northwest',
    owns_rashis: [4], // Карката
    exalted_in: 2, // Врішабга
    debilitated_in: 8, // Врішчіка
    description_uk: 'Чандра — королева планет, що символізує розум, емоції, матір та комфорт. Дарує емоційну стабільність, інтуїцію та турботливість.',
    description_en: 'Chandra is the queen of planets, symbolizing mind, emotions, mother, and comfort. Bestows emotional stability, intuition, and nurturing nature.',
  },
  {
    id: 'mangala',
    name_iast: 'Maṅgala',
    name_uk: 'Манґала',
    name_en: 'Mangala',
    name_sanskrit: 'मंगल',
    western_name_uk: 'Марс',
    western_name_en: 'Mars',
    day_of_week_uk: 'Вівторок',
    day_of_week_en: 'Tuesday',
    nature: 'malefic',
    element: 'fire',
    color_uk: 'Червоний',
    color_en: 'Red',
    metal_uk: 'Мідь, залізо',
    metal_en: 'Copper, iron',
    gemstone_uk: 'Червоний корал',
    gemstone_en: 'Red coral',
    direction: 'South',
    owns_rashis: [1, 8], // Меша, Врішчіка
    exalted_in: 10, // Макара
    debilitated_in: 4, // Карката
    description_uk: 'Манґала — воїн серед планет, що символізує енергію, сміливість, брата та землю. Дарує рішучість, силу та захисні здібності.',
    description_en: 'Mangala is the warrior among planets, symbolizing energy, courage, brother, and land. Bestows determination, strength, and protective abilities.',
  },
  {
    id: 'budha',
    name_iast: 'Budha',
    name_uk: 'Будга',
    name_en: 'Budha',
    name_sanskrit: 'बुध',
    western_name_uk: 'Меркурій',
    western_name_en: 'Mercury',
    day_of_week_uk: 'Середа',
    day_of_week_en: 'Wednesday',
    nature: 'neutral',
    element: 'earth',
    color_uk: 'Зелений',
    color_en: 'Green',
    metal_uk: 'Бронза, латунь',
    metal_en: 'Bronze, brass',
    gemstone_uk: 'Смарагд',
    gemstone_en: 'Emerald',
    direction: 'North',
    owns_rashis: [3, 6], // Мітхуна, Канья
    exalted_in: 6, // Канья
    debilitated_in: 12, // Міна
    description_uk: 'Будга — принц планет, що символізує інтелект, комунікацію, торгівлю та навчання. Дарує аналітичний розум, красномовство та адаптивність.',
    description_en: 'Budha is the prince of planets, symbolizing intellect, communication, commerce, and learning. Bestows analytical mind, eloquence, and adaptability.',
  },
  {
    id: 'guru',
    name_iast: 'Guru',
    name_uk: 'Ґуру',
    name_en: 'Guru',
    name_sanskrit: 'गुरु',
    western_name_uk: 'Юпітер',
    western_name_en: 'Jupiter',
    day_of_week_uk: 'Четвер',
    day_of_week_en: 'Thursday',
    nature: 'benefic',
    element: 'ether',
    color_uk: 'Жовтий, золотий',
    color_en: 'Yellow, golden',
    metal_uk: 'Золото',
    metal_en: 'Gold',
    gemstone_uk: 'Жовтий сапфір, топаз',
    gemstone_en: 'Yellow sapphire, topaz',
    direction: 'Northeast',
    owns_rashis: [9, 12], // Дгануш, Міна
    exalted_in: 4, // Карката
    debilitated_in: 10, // Макара
    description_uk: 'Ґуру — вчитель богів, що символізує мудрість, духовність, дітей та багатство. Найбільш благодійна планета, що дарує процвітання та захист.',
    description_en: 'Guru is the teacher of gods, symbolizing wisdom, spirituality, children, and wealth. The most benefic planet, bestowing prosperity and protection.',
  },
  {
    id: 'shukra',
    name_iast: 'Śukra',
    name_uk: 'Шукра',
    name_en: 'Shukra',
    name_sanskrit: 'शुक्र',
    western_name_uk: 'Венера',
    western_name_en: 'Venus',
    day_of_week_uk: 'П\'ятниця',
    day_of_week_en: 'Friday',
    nature: 'benefic',
    element: 'water',
    color_uk: 'Білий, рожевий',
    color_en: 'White, pink',
    metal_uk: 'Срібло, платина',
    metal_en: 'Silver, platinum',
    gemstone_uk: 'Діамант, білий сапфір',
    gemstone_en: 'Diamond, white sapphire',
    direction: 'Southeast',
    owns_rashis: [2, 7], // Врішабга, Тула
    exalted_in: 12, // Міна
    debilitated_in: 6, // Канья
    description_uk: 'Шукра — вчитель асурів, що символізує красу, любов, мистецтво та шлюб. Дарує чарівність, творчі здібності та матеріальні насолоди.',
    description_en: 'Shukra is the teacher of asuras, symbolizing beauty, love, art, and marriage. Bestows charm, creative abilities, and material pleasures.',
  },
  {
    id: 'shani',
    name_iast: 'Śani',
    name_uk: 'Шані',
    name_en: 'Shani',
    name_sanskrit: 'शनि',
    western_name_uk: 'Сатурн',
    western_name_en: 'Saturn',
    day_of_week_uk: 'Субота',
    day_of_week_en: 'Saturday',
    nature: 'malefic',
    element: 'air',
    color_uk: 'Чорний, темно-синій',
    color_en: 'Black, dark blue',
    metal_uk: 'Залізо, свинець',
    metal_en: 'Iron, lead',
    gemstone_uk: 'Синій сапфір',
    gemstone_en: 'Blue sapphire',
    direction: 'West',
    owns_rashis: [10, 11], // Макара, Кумбга
    exalted_in: 7, // Тула
    debilitated_in: 1, // Меша
    description_uk: 'Шані — суддя серед планет, що символізує карму, обмеження, дисципліну та довголіття. Дарує терпіння, витривалість та духовну зрілість через випробування.',
    description_en: 'Shani is the judge among planets, symbolizing karma, restriction, discipline, and longevity. Bestows patience, endurance, and spiritual maturity through trials.',
  },
  {
    id: 'rahu',
    name_iast: 'Rāhu',
    name_uk: 'Раху',
    name_en: 'Rahu',
    name_sanskrit: 'राहु',
    western_name_uk: 'Північний місячний вузол',
    western_name_en: 'North Lunar Node',
    day_of_week_uk: 'Субота (разом з Шані)',
    day_of_week_en: 'Saturday (with Shani)',
    nature: 'malefic',
    element: 'air',
    color_uk: 'Димчастий, ультрафіолетовий',
    color_en: 'Smoky, ultraviolet',
    metal_uk: 'Свинець',
    metal_en: 'Lead',
    gemstone_uk: 'Гессоніт (гомед)',
    gemstone_en: 'Hessonite (gomed)',
    direction: 'Southwest',
    owns_rashis: [], // Не володіє жодним
    exalted_in: 3, // Мітхуна
    debilitated_in: 9, // Дгануш
    description_uk: 'Раху — тіньова планета, що символізує ілюзію, матеріальні бажання та кармічні уроки. Дарує амбіції, інновації та здатність долати межі.',
    description_en: 'Rahu is a shadow planet, symbolizing illusion, material desires, and karmic lessons. Bestows ambition, innovation, and ability to transcend boundaries.',
  },
  {
    id: 'ketu',
    name_iast: 'Ketu',
    name_uk: 'Кету',
    name_en: 'Ketu',
    name_sanskrit: 'केतु',
    western_name_uk: 'Південний місячний вузол',
    western_name_en: 'South Lunar Node',
    day_of_week_uk: 'Вівторок (разом з Манґалою)',
    day_of_week_en: 'Tuesday (with Mangala)',
    nature: 'malefic',
    element: 'fire',
    color_uk: 'Сірий, інфрачервоний',
    color_en: 'Gray, infrared',
    metal_uk: 'Залізо',
    metal_en: 'Iron',
    gemstone_uk: 'Котяче око',
    gemstone_en: 'Cat\'s eye',
    direction: 'Southwest',
    owns_rashis: [], // Не володіє жодним
    exalted_in: 9, // Дгануш
    debilitated_in: 3, // Мітхуна
    description_uk: 'Кету — тіньова планета, що символізує мокшу, духовне відречення та минулі життя. Дарує інтуїцію, духовні здібності та звільнення від прив\'язаностей.',
    description_en: 'Ketu is a shadow planet, symbolizing moksha, spiritual renunciation, and past lives. Bestows intuition, spiritual abilities, and liberation from attachments.',
  },
];

/**
 * Отримати ґраху за ID
 */
export function getGrahaById(id: GrahaPlanet): Graha | undefined {
  return GRAHAS.find(g => g.id === id);
}

/**
 * Отримати ґраху за днем тижня (0 = неділя)
 */
export function getGrahaByDayOfWeek(dayIndex: number): Graha | undefined {
  const dayToGraha: Record<number, GrahaPlanet> = {
    0: 'surya',    // Неділя
    1: 'chandra',  // Понеділок
    2: 'mangala',  // Вівторок
    3: 'budha',    // Середа
    4: 'guru',     // Четвер
    5: 'shukra',   // П'ятниця
    6: 'shani',    // Субота
  };
  const grahaId = dayToGraha[dayIndex];
  return grahaId ? getGrahaById(grahaId) : undefined;
}

/**
 * Отримати всі благодійні планети
 */
export function getBeneficGrahas(): Graha[] {
  return GRAHAS.filter(g => g.nature === 'benefic');
}

/**
 * Отримати всі шкідливі планети
 */
export function getMaleficGrahas(): Graha[] {
  return GRAHAS.filter(g => g.nature === 'malefic');
}

/**
 * Порядок планет у Вімшоттарі Даша
 */
export const VIMSHOTTARI_ORDER: GrahaPlanet[] = [
  'ketu',     // 7 років
  'shukra',   // 20 років
  'surya',    // 6 років
  'chandra',  // 10 років
  'mangala',  // 7 років
  'rahu',     // 18 років
  'guru',     // 16 років
  'shani',    // 19 років
  'budha',    // 17 років
];

/**
 * Тривалість періодів Вімшоттарі Даша (у роках)
 */
export const VIMSHOTTARI_YEARS: Record<GrahaPlanet, number> = {
  ketu: 7,
  shukra: 20,
  surya: 6,
  chandra: 10,
  mangala: 7,
  rahu: 18,
  guru: 16,
  shani: 19,
  budha: 17,
};

export default GRAHAS;
