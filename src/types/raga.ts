/**
 * Індійська класична музика - Раги
 * Indian Classical Music - Ragas
 */

// ============================================
// Свари (ноти)
// ============================================

// Індійські свари та їх західні еквіваленти
export type Svara =
  | 'S'   // Шадджа (Sa) - До / C
  | 'r'   // Комал Рішабха (komal Re) - До# / C#
  | 'R'   // Шуддха Рішабха (shuddha Re) - Ре / D
  | 'g'   // Комал Ґандхара (komal Ga) - Ре# / D#
  | 'G'   // Шуддха Ґандхара (shuddha Ga) - Мі / E
  | 'm'   // Шуддха Мадхьяма (shuddha Ma) - Фа / F
  | 'M'   // Тівра Мадхьяма (tivra Ma) - Фа# / F#
  | 'P'   // Панчама (Pa) - Соль / G
  | 'd'   // Комал Дхайвата (komal Dha) - Соль# / G#
  | 'D'   // Шуддха Дхайвата (shuddha Dha) - Ля / A
  | 'n'   // Комал Нішада (komal Ni) - Ля# / A#
  | 'N'   // Шуддха Нішада (shuddha Ni) - Сі / B
  | "S'" // Верхня Шадджа (upper Sa) - верхнє До / upper C
  | "'S" // Нижня Шадджа (lower Sa) - нижнє До / lower C
  | 's';  // Альтернативне позначення

// Маппінг свар на MIDI ноти (відносно C4 = 60)
export const SVARA_TO_MIDI: Record<string, number> = {
  "'S": 48,  // нижня октава
  "'r": 49,
  "'R": 50,
  "'g": 51,
  "'G": 52,
  "'m": 53,
  "'M": 54,
  "'P": 55,
  "'d": 56,
  "'D": 57,
  "'n": 58,
  "'N": 59,
  'S': 60,   // середня октава (C4)
  'r': 61,
  'R': 62,
  'g': 63,
  'G': 64,
  'm': 65,
  'M': 66,
  'P': 67,
  'd': 68,
  'D': 69,
  'n': 70,
  'N': 71,
  "S'": 72,  // верхня октава
  "r'": 73,
  "R'": 74,
  "g'": 75,
  "G'": 76,
  "m'": 77,
  "M'": 78,
  "P'": 79,
  "d'": 80,
  "D'": 81,
  "n'": 82,
  "N'": 83,
};

// Маппінг свар на українські назви
export const SVARA_NAMES_UA: Record<string, string> = {
  'S': 'Са (Шадджа)',
  'r': 'комал Ре (Рішабха)',
  'R': 'шуддха Ре (Рішабха)',
  'g': 'комал Ґа (Ґандхара)',
  'G': 'шуддха Ґа (Ґандхара)',
  'm': 'шуддха Ма (Мадхьяма)',
  'M': 'тівра Ма (Мадхьяма)',
  'P': 'Па (Панчама)',
  'd': 'комал Дха (Дхайвата)',
  'D': 'шуддха Дха (Дхайвата)',
  'n': 'комал Ні (Нішада)',
  'N': 'шуддха Ні (Нішада)',
};

// Маппінг на західні ноти
export const SVARA_TO_WESTERN: Record<string, string> = {
  'S': 'C',
  'r': 'C#/Db',
  'R': 'D',
  'g': 'D#/Eb',
  'G': 'E',
  'm': 'F',
  'M': 'F#/Gb',
  'P': 'G',
  'd': 'G#/Ab',
  'D': 'A',
  'n': 'A#/Bb',
  'N': 'B',
};

// ============================================
// Тхаат (материнська гамма)
// ============================================

export type Thaat =
  | 'Bilaval'    // Білавал - мажорна гама
  | 'Khamaj'     // Кхамадж
  | 'Kafi'       // Кафі
  | 'Asavari'    // Асаварі
  | 'Bhairavi'   // Бгайраві
  | 'Bhairav'    // Бгайрав
  | 'Kalyan'     // Кальян (Яман)
  | 'Marva'      // Марва
  | 'Purvi'      // Пурві
  | 'Todi';      // Тоді

export interface ThaatInfo {
  name: Thaat;
  name_ua: string;
  name_devanagari: string;
  svaras: string[]; // 7 нот тхаата
  description_ua: string;
  description_en: string;
  mood_ua: string;
  mood_en: string;
}

export const THAATS: ThaatInfo[] = [
  {
    name: 'Bilaval',
    name_ua: 'Білавал',
    name_devanagari: 'बिलावल',
    svaras: ['S', 'R', 'G', 'm', 'P', 'D', 'N'],
    description_ua: 'Базовий тхаат, еквівалент мажорної гами',
    description_en: 'Basic thaat, equivalent to major scale',
    mood_ua: 'Радість, світло, ясність',
    mood_en: 'Joy, light, clarity',
  },
  {
    name: 'Khamaj',
    name_ua: 'Кхамадж',
    name_devanagari: 'खमाज',
    svaras: ['S', 'R', 'G', 'm', 'P', 'D', 'n'],
    description_ua: 'Комал Нішада, романтичний настрій',
    description_en: 'Flat Ni, romantic mood',
    mood_ua: 'Кохання, романтика, ніжність',
    mood_en: 'Love, romance, tenderness',
  },
  {
    name: 'Kafi',
    name_ua: 'Кафі',
    name_devanagari: 'काफी',
    svaras: ['S', 'R', 'g', 'm', 'P', 'D', 'n'],
    description_ua: 'Комал Ґандхара та Нішада',
    description_en: 'Flat Ga and Ni',
    mood_ua: 'Відданість, духовність',
    mood_en: 'Devotion, spirituality',
  },
  {
    name: 'Asavari',
    name_ua: 'Асаварі',
    name_devanagari: 'आसावरी',
    svaras: ['S', 'R', 'g', 'm', 'P', 'd', 'n'],
    description_ua: 'Комал Ґа, Дха, Ні - мінорний характер',
    description_en: 'Flat Ga, Dha, Ni - minor character',
    mood_ua: 'Сум, меланхолія, роздуми',
    mood_en: 'Sadness, melancholy, contemplation',
  },
  {
    name: 'Bhairavi',
    name_ua: 'Бгайраві',
    name_devanagari: 'भैरवी',
    svaras: ['S', 'r', 'g', 'm', 'P', 'd', 'n'],
    description_ua: 'Всі комал свари, глибока духовність',
    description_en: 'All flat notes, deep spirituality',
    mood_ua: 'Смирення, духовність, завершення',
    mood_en: 'Humility, spirituality, conclusion',
  },
  {
    name: 'Bhairav',
    name_ua: 'Бгайрав',
    name_devanagari: 'भैरव',
    svaras: ['S', 'r', 'G', 'm', 'P', 'd', 'N'],
    description_ua: 'Комал Ре та Дха, ранкова раґа',
    description_en: 'Flat Re and Dha, morning raga',
    mood_ua: 'Серйозність, відданість, ранковий настрій',
    mood_en: 'Seriousness, devotion, morning mood',
  },
  {
    name: 'Kalyan',
    name_ua: 'Кальян',
    name_devanagari: 'कल्याण',
    svaras: ['S', 'R', 'G', 'M', 'P', 'D', 'N'],
    description_ua: 'Тівра Мадхьяма, вечірня раґа',
    description_en: 'Sharp Ma, evening raga',
    mood_ua: 'Спокій, благословення, вечірній настрій',
    mood_en: 'Peace, blessing, evening mood',
  },
  {
    name: 'Marva',
    name_ua: 'Марва',
    name_devanagari: 'मारवा',
    svaras: ['S', 'r', 'G', 'M', 'P', 'D', 'N'],
    description_ua: 'Комал Ре + Тівра Ма, присмерк',
    description_en: 'Flat Re + Sharp Ma, twilight',
    mood_ua: 'Присмерк, роздуми, очікування',
    mood_en: 'Twilight, contemplation, anticipation',
  },
  {
    name: 'Purvi',
    name_ua: 'Пурві',
    name_devanagari: 'पूर्वी',
    svaras: ['S', 'r', 'G', 'M', 'P', 'd', 'N'],
    description_ua: 'Комал Ре та Дха + Тівра Ма',
    description_en: 'Flat Re and Dha + Sharp Ma',
    mood_ua: 'Захід сонця, містичність',
    mood_en: 'Sunset, mysticism',
  },
  {
    name: 'Todi',
    name_ua: 'Тоді',
    name_devanagari: 'तोड़ी',
    svaras: ['S', 'r', 'g', 'M', 'P', 'd', 'N'],
    description_ua: 'Комал Ре, Ґа, Дха + Тівра Ма',
    description_en: 'Flat Re, Ga, Dha + Sharp Ma',
    mood_ua: 'Глибина, серйозність, медитація',
    mood_en: 'Depth, seriousness, meditation',
  },
];

// ============================================
// Джаті (тип раги за кількістю нот)
// ============================================

export type Jati =
  | 'Audav'      // 5 нот
  | 'Shadav'     // 6 нот
  | 'Sampurna'   // 7 нот (повна)
  | 'Audav-Audav'
  | 'Audav-Shadav'
  | 'Audav-Sampurna'
  | 'Shadav-Audav'
  | 'Shadav-Shadav'
  | 'Shadav-Sampurna'
  | 'Sampurna-Audav'
  | 'Sampurna-Shadav'
  | 'Sampurna-Sampurna';

export const JATI_NAMES_UA: Record<string, string> = {
  'Audav': 'Аудав (5 нот)',
  'Shadav': 'Шадав (6 нот)',
  'Sampurna': 'Сампурна (7 нот)',
  'Audav-Audav': 'Аудав-Аудав (5-5)',
  'Audav-Shadav': 'Аудав-Шадав (5-6)',
  'Audav-Sampurna': 'Аудав-Сампурна (5-7)',
  'Shadav-Audav': 'Шадав-Аудав (6-5)',
  'Shadav-Shadav': 'Шадав-Шадав (6-6)',
  'Shadav-Sampurna': 'Шадав-Сампурна (6-7)',
  'Sampurna-Audav': 'Сампурна-Аудав (7-5)',
  'Sampurna-Shadav': 'Сампурна-Шадав (7-6)',
  'Sampurna-Sampurna': 'Сампурна-Сампурна (7-7)',
};

// ============================================
// Час виконання раги
// ============================================

export type RagaTime =
  | 'EarlyMorning4-7'   // Прахара 1: Брахма мухурта
  | 'Morning6-9'        // Ранок
  | 'LateMorning9-12'   // Пізній ранок
  | 'Afternoon12-3'     // День
  | 'LateAfternoon3-6'  // Пізній день
  | 'Evening6-9'        // Вечір (Сандхья)
  | 'Night9-12'         // Ніч
  | 'EarlyNight9-12'    // Рання ніч
  | 'LateNight12-3'     // Пізня ніч
  | 'Midnight'          // Північ
  | 'Monsoon'           // Сезон мусонів
  | 'Spring'            // Весна
  | 'AllDay'            // Будь-який час
  | string;             // Інші варіанти

export const TIME_NAMES_UA: Record<string, string> = {
  'EarlyMorning4-7': 'Ранній ранок (4-7)',
  'EarlyMorning3-6': 'Ранній ранок (3-6)',
  'Morning6-9': 'Ранок (6-9)',
  'LateMorning9-12': 'Пізній ранок (9-12)',
  'Afternoon12-3': 'День (12-15)',
  'LateAfternoon3-6': 'Пізній день (15-18)',
  'Evening6-9': 'Вечір (18-21)',
  'Night9-12': 'Ніч (21-24)',
  'EarlyNight9-12': 'Рання ніч (21-24)',
  'LateNight12-3': 'Пізня ніч (0-3)',
  'Midnight': 'Північ',
  'Monsoon': 'Сезон дощів',
  'Spring': 'Весна',
  'AllDay': 'Будь-який час',
};

// ============================================
// Основний тип Раги
// ============================================

// RagaCore - дані раги без name (як в JSON, де name = ключ)
export interface RagaCore {
  aaroha: string[];        // Сходження
  avaroha: string[];       // Спадання
  pakad: string[];         // Характерна фраза
  vadi: string;            // Головна нота (король)
  samvadi: string;         // Друга за важливістю (міністр)
  thaat: Thaat | string;   // Материнська гамма
  time: RagaTime | string; // Час виконання
  jati: Jati | string;     // Тип за кількістю нот
}

// Raga - повний тип з name (для UI після нормалізації)
export interface Raga extends RagaCore {
  name: string;
}

// Раги з бази даних (ключ = назва, значення = RagaCore без name)
export type RagaDatabase = Record<string, RagaCore>;

// ============================================
// Розширена інформація для UI
// ============================================

export interface RagaWithMetadata extends Raga {
  name_devanagari?: string;
  name_ua?: string;
  description_ua?: string;
  description_en?: string;
  mood_ua?: string;
  mood_en?: string;
  related_ragas?: string[];
  famous_compositions?: string[];
  artists?: string[];
}

// ============================================
// Фільтри для пошуку раг
// ============================================

export interface RagaFilters {
  thaat?: Thaat | string;
  time?: RagaTime | string;
  jati?: Jati | string;
  search?: string;
  vadi?: string;
}

// ============================================
// Допоміжні функції
// ============================================

/**
 * Перетворює час раги на читабельний формат
 */
export function formatRagaTime(time: string, language: 'uk' | 'en' = 'uk'): string {
  if (language === 'uk') {
    return TIME_NAMES_UA[time] || time;
  }
  return time.replace(/([A-Z])/g, ' $1').replace(/(\d+)-(\d+)/, ' ($1:00-$2:00)').trim();
}

/**
 * Перетворює джаті на читабельний формат
 */
export function formatJati(jati: string, language: 'uk' | 'en' = 'uk'): string {
  if (language === 'uk') {
    return JATI_NAMES_UA[jati] || jati;
  }
  return jati;
}

/**
 * Отримує MIDI ноти для арохи раги
 */
export function getAarohaMidi(aaroha: string[]): number[] {
  return aaroha
    .map(svara => {
      // Очищаємо від спеціальних символів
      const clean = svara.replace(/[_]/g, '');
      return SVARA_TO_MIDI[clean];
    })
    .filter((n): n is number => n !== undefined);
}

/**
 * Отримує унікальні ноти раги (для клавіатури)
 */
export function getRagaNotes(raga: Raga): Set<number> {
  const notes = new Set<number>();

  [...raga.aaroha, ...raga.avaroha].forEach(svara => {
    const clean = svara.replace(/[_']/g, '');
    const midi = SVARA_TO_MIDI[clean];
    if (midi !== undefined) {
      // Нормалізуємо до однієї октави (0-11)
      notes.add(midi % 12);
    }
  });

  return notes;
}

/**
 * Перевіряє чи час відповідає поточному часу дня
 */
export function isRagaTimeNow(time: string): boolean {
  const hour = new Date().getHours();

  if (time.includes('EarlyMorning') || time.includes('3-6') || time.includes('4-7')) {
    return hour >= 3 && hour < 7;
  }
  if (time.includes('Morning6-9') || time === 'Morning') {
    return hour >= 6 && hour < 9;
  }
  if (time.includes('LateMorning') || time.includes('9-12')) {
    return hour >= 9 && hour < 12;
  }
  if (time.includes('Afternoon') || time.includes('12-3')) {
    return hour >= 12 && hour < 15;
  }
  if (time.includes('LateAfternoon') || time.includes('3-6')) {
    return hour >= 15 && hour < 18;
  }
  if (time.includes('Evening') || time.includes('6-9')) {
    return hour >= 18 && hour < 21;
  }
  if (time.includes('Night') || time.includes('9-12')) {
    return hour >= 21 || hour < 3;
  }
  if (time === 'Midnight') {
    return hour >= 23 || hour < 1;
  }
  if (time === 'AllDay') {
    return true;
  }

  return false;
}
