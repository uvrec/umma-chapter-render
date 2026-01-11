/**
 * Ведичний Джйотіш - типи даних
 * Vedic Jyotish Types
 */

// ============================================
// Накшатра (27 місячних домів)
// ============================================

export interface Nakshatra {
  id: number; // 1-27
  name_iast: string; // IAST транслітерація
  name_ua: string; // Українська транслітерація
  name_en: string; // English
  name_sanskrit: string; // Деванаґарі
  deity_ua: string; // Божество (укр)
  deity_en: string; // Deity (eng)
  ruler_planet: GrahaPlanet; // Планета-володар
  symbol_ua: string; // Символ (укр)
  symbol_en: string; // Symbol (eng)
  start_degree: number; // Початок (0-360)
  end_degree: number; // Кінець (0-360)
  guna: Guna; // Ґуна (саттва/раджас/тамас)
  animal_ua: string; // Тварина (укр)
  animal_en: string; // Animal (eng)
  gender: 'male' | 'female';
  caste: NakshatraCaste;
  element: Element;
  body_part_ua: string;
  body_part_en: string;
  // Інтерпретації
  keywords_ua: string[];
  keywords_en: string[];
  description_ua: string;
  description_en: string;
  positive_traits_ua: string[];
  positive_traits_en: string[];
  negative_traits_ua: string[];
  negative_traits_en: string[];
  career_ua: string[];
  career_en: string[];
}

export type NakshatraCaste = 'brahmin' | 'kshatriya' | 'vaishya' | 'shudra' | 'mleccha';

// ============================================
// Раші (12 знаків зодіаку)
// ============================================

export interface Rashi {
  id: number; // 1-12
  name_iast: string; // IAST
  name_ua: string; // Українська
  name_en: string; // English
  name_sanskrit: string; // Деванаґарі
  western_name_ua: string; // Західна назва (укр)
  western_name_en: string; // Western name
  ruler_planet: GrahaPlanet;
  element: Element;
  modality: Modality;
  gender: 'male' | 'female';
  symbol_ua: string;
  symbol_en: string;
  start_degree: number;
  end_degree: number;
  exalted_planet?: GrahaPlanet; // Екзальтація
  debilitated_planet?: GrahaPlanet; // Падіння
  // Інтерпретації
  keywords_ua: string[];
  keywords_en: string[];
  description_ua: string;
  description_en: string;
  positive_traits_ua: string[];
  positive_traits_en: string[];
  negative_traits_ua: string[];
  negative_traits_en: string[];
}

// ============================================
// Ґраха (9 планет)
// ============================================

export type GrahaPlanet =
  | 'surya'      // Сонце
  | 'chandra'    // Місяць
  | 'mangala'    // Марс
  | 'budha'      // Меркурій
  | 'guru'       // Юпітер
  | 'shukra'     // Венера
  | 'shani'      // Сатурн
  | 'rahu'       // Раху (пн. вузол)
  | 'ketu';      // Кету (пд. вузол)

export interface Graha {
  id: GrahaPlanet;
  name_iast: string;
  name_ua: string;
  name_en: string;
  name_sanskrit: string;
  western_name_ua: string;
  western_name_en: string;
  day_of_week_ua: string; // День тижня
  day_of_week_en: string;
  nature: 'benefic' | 'malefic' | 'neutral';
  element: Element;
  color_ua: string;
  color_en: string;
  metal_ua: string;
  metal_en: string;
  gemstone_ua: string;
  gemstone_en: string;
  direction: string;
  owns_rashis: number[]; // Які раші володіє
  exalted_in: number; // Екзальтація в раші
  debilitated_in: number; // Падіння в раші
  description_ua: string;
  description_en: string;
}

// ============================================
// Тітхі (місячний день)
// ============================================

export interface Tithi {
  number: number; // 1-30
  name_iast: string;
  name_ua: string;
  name_en: string;
  paksha: 'shukla' | 'krishna';
  paksha_number: number; // 1-15
  deity_ua: string;
  deity_en: string;
  nature: 'nanda' | 'bhadra' | 'jaya' | 'rikta' | 'purna';
  is_ekadashi: boolean;
  description_ua?: string;
  description_en?: string;
}

// ============================================
// Йоґа (27 комбінацій Сонце + Місяць)
// ============================================

export interface Yoga {
  id: number; // 1-27
  name_iast: string;
  name_ua: string;
  name_en: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  deity_ua: string;
  deity_en: string;
  description_ua: string;
  description_en: string;
}

// ============================================
// Карана (половина тітхі)
// ============================================

export interface Karana {
  id: number; // 1-11
  name_iast: string;
  name_ua: string;
  name_en: string;
  type: 'chara' | 'sthira'; // Рухома / Фіксована
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  deity_ua: string;
  deity_en: string;
  description_ua?: string;
  description_en?: string;
}

// ============================================
// Вара (день тижня)
// ============================================

export interface Vara {
  id: number; // 0-6 (0 = неділя)
  name_iast: string;
  name_ua: string;
  name_en: string;
  ruler: GrahaPlanet;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  description_ua?: string;
  description_en?: string;
}

// ============================================
// Допоміжні типи
// ============================================

export type Guna = 'sattva' | 'rajas' | 'tamas';
export type Element = 'fire' | 'earth' | 'air' | 'water' | 'ether';
export type Modality = 'cardinal' | 'fixed' | 'mutable'; // Чара / Стхіра / Двісвабгава

// ============================================
// Панчанга (5 елементів ведичного календаря)
// ============================================

export interface Panchanga {
  date: Date;
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
    name?: string;
  };
  // 5 елементів панчанги
  tithi: {
    current: Tithi;
    progress: number; // 0-100%
    end_time?: Date;
  };
  nakshatra: {
    current: Nakshatra;
    moon_degree: number;
    progress: number; // 0-100%
    end_time?: Date;
  };
  yoga: {
    current: Yoga;
    progress: number;
    end_time?: Date;
  };
  karana: {
    current: Karana;
    progress: number;
    end_time?: Date;
  };
  vara: Vara;
  // Додатково
  rashi: {
    moon: Rashi; // Чандра раші (Місяць)
    sun: Rashi; // Сур'я раші (Сонце)
  };
  sunrise: Date;
  sunset: Date;
  moonrise?: Date;
  moonset?: Date;
  // Несприятливі періоди
  rahu_kaal?: { start: Date; end: Date };
  gulika_kaal?: { start: Date; end: Date };
  yamaganda?: { start: Date; end: Date };
}

// ============================================
// Натальна карта (Кундалі)
// ============================================

export interface BirthData {
  date: Date;
  time: string; // HH:MM
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
    name?: string;
  };
  name?: string;
  gender?: 'male' | 'female';
}

export interface JyotishReading {
  birthData: BirthData;
  panchanga: Panchanga;
  janma_nakshatra: Nakshatra; // Накшатра народження
  chandra_rashi: Rashi; // Місячний знак
  surya_rashi: Rashi; // Сонячний знак
  // Інтерпретація
  personality_ua: string;
  personality_en: string;
  strengths_ua: string[];
  strengths_en: string[];
  challenges_ua: string[];
  challenges_en: string[];
  career_ua: string[];
  career_en: string[];
  compatibility_ua: string;
  compatibility_en: string;
}

// ============================================
// Комбінований ведичний портрет (Джйотіш + Нумерологія)
// ============================================

export interface VedicPortrait {
  birthData: BirthData;
  jyotish: JyotishReading;
  numerology?: {
    consciousness: number;
    action: number;
    realization: number;
    lifeNumber: number;
    notation: string;
  };
  combined_interpretation_ua?: string;
  combined_interpretation_en?: string;
}
