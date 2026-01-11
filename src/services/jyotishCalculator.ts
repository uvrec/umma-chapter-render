/**
 * Ведичний Джйотіш Калькулятор
 * Інтеграція з @bidyashish/panchang та локальними даними
 */

// Dynamic import to avoid __dirname error in Vite browser environment
// The @bidyashish/panchang package uses swisseph which requires Node.js globals
type PanchangaInput = {
  date: Date;
  latitude: number;
  longitude: number;
  timezone: string;
};

type PanchangaOutput = {
  tithi?: { number: number; paksha: string; progress?: number; endTime?: string };
  nakshatra?: { degree: number; endTime?: string };
  yoga?: { number: number; progress?: number; endTime?: string };
  karana?: { number: number; progress?: number; endTime?: string };
  sunSign?: { degree: number };
  sunrise?: string;
  sunset?: string;
  moonrise?: string;
  moonset?: string;
  rahuKaal?: { start: string; end: string };
};

let panchangaModule: { getPanchanga: (input: PanchangaInput) => Promise<PanchangaOutput> } | null = null;
let panchangaLoadAttempted = false;

async function loadPanchangaModule(): Promise<typeof panchangaModule> {
  if (panchangaLoadAttempted) return panchangaModule;
  panchangaLoadAttempted = true;

  try {
    const mod = await import('@bidyashish/panchang');
    panchangaModule = { getPanchanga: mod.getPanchanga };
    return panchangaModule;
  } catch (error) {
    console.warn('Failed to load @bidyashish/panchang (expected in browser):', error);
    return null;
  }
}

import { getNakshatraByDegree, getNakshatraPada, getNakshatraProgress, NAKSHATRAS } from '@/data/jyotish/nakshatras';
import { getRashiByDegree, getRashiProgress, RASHIS } from '@/data/jyotish/rashis';
import { getGrahaById, getGrahaByDayOfWeek, GRAHAS, VIMSHOTTARI_ORDER, VIMSHOTTARI_YEARS } from '@/data/jyotish/grahas';
import type {
  BirthData,
  JyotishReading,
  Panchanga,
  Nakshatra,
  Rashi,
  Tithi,
  Yoga,
  Karana,
  Vara,
  GrahaPlanet,
  VedicPortrait
} from '@/types/jyotish';
import { calculateNumerologyReading } from '@/utils/numerology/lifeNumberCalculator';
import { createBirthDate } from '@/utils/numerology/birthDateProcessor';

// ============================================
// Константи
// ============================================

/**
 * 30 Тітхі з українською транслітерацією
 */
const TITHIS: Omit<Tithi, 'paksha' | 'paksha_number'>[] = [
  { number: 1, name_iast: 'Pratipadā', name_ua: 'Пратіпада', name_en: 'Pratipada', deity_ua: 'Аґні', deity_en: 'Agni', nature: 'nanda', is_ekadashi: false },
  { number: 2, name_iast: 'Dvitīyā', name_ua: 'Двітія', name_en: 'Dwitiya', deity_ua: 'Брахма', deity_en: 'Brahma', nature: 'bhadra', is_ekadashi: false },
  { number: 3, name_iast: 'Tṛtīyā', name_ua: 'Трітія', name_en: 'Tritiya', deity_ua: 'Ґаурі', deity_en: 'Gauri', nature: 'jaya', is_ekadashi: false },
  { number: 4, name_iast: 'Caturthī', name_ua: 'Чатуртхі', name_en: 'Chaturthi', deity_ua: 'Ґанеша', deity_en: 'Ganesha', nature: 'rikta', is_ekadashi: false },
  { number: 5, name_iast: 'Pañcamī', name_ua: 'Панчамі', name_en: 'Panchami', deity_ua: 'Наґи', deity_en: 'Nagas', nature: 'purna', is_ekadashi: false },
  { number: 6, name_iast: 'Ṣaṣṭhī', name_ua: 'Шаштхі', name_en: 'Shashthi', deity_ua: 'Карттікея', deity_en: 'Kartikeya', nature: 'nanda', is_ekadashi: false },
  { number: 7, name_iast: 'Saptamī', name_ua: 'Саптамі', name_en: 'Saptami', deity_ua: 'Сур\'я', deity_en: 'Surya', nature: 'bhadra', is_ekadashi: false },
  { number: 8, name_iast: 'Aṣṭamī', name_ua: 'Аштамі', name_en: 'Ashtami', deity_ua: 'Рудра', deity_en: 'Rudra', nature: 'jaya', is_ekadashi: false },
  { number: 9, name_iast: 'Navamī', name_ua: 'Навамі', name_en: 'Navami', deity_ua: 'Дурґа', deity_en: 'Durga', nature: 'rikta', is_ekadashi: false },
  { number: 10, name_iast: 'Daśamī', name_ua: 'Дашамі', name_en: 'Dashami', deity_ua: 'Дгарма', deity_en: 'Dharma', nature: 'purna', is_ekadashi: false },
  { number: 11, name_iast: 'Ekādaśī', name_ua: 'Екадаші', name_en: 'Ekadashi', deity_ua: 'Вішну', deity_en: 'Vishnu', nature: 'nanda', is_ekadashi: true },
  { number: 12, name_iast: 'Dvādaśī', name_ua: 'Двадаші', name_en: 'Dwadashi', deity_ua: 'Вішну', deity_en: 'Vishnu', nature: 'bhadra', is_ekadashi: false },
  { number: 13, name_iast: 'Trayodaśī', name_ua: 'Трайодаші', name_en: 'Trayodashi', deity_ua: 'Кама', deity_en: 'Kama', nature: 'jaya', is_ekadashi: false },
  { number: 14, name_iast: 'Caturdaśī', name_ua: 'Чатурдаші', name_en: 'Chaturdashi', deity_ua: 'Шіва', deity_en: 'Shiva', nature: 'rikta', is_ekadashi: false },
  { number: 15, name_iast: 'Pūrṇimā/Amāvasyā', name_ua: 'Пурніма/Амавас\'я', name_en: 'Purnima/Amavasya', deity_ua: 'Чандра/Пітри', deity_en: 'Chandra/Pitris', nature: 'purna', is_ekadashi: false },
];

/**
 * 27 Йог з українською транслітерацією
 */
const YOGAS: Yoga[] = [
  { id: 1, name_iast: 'Viṣkambha', name_ua: 'Вішкамбга', name_en: 'Vishkambha', nature: 'inauspicious', deity_ua: 'Яма', deity_en: 'Yama', description_ua: 'Перешкода', description_en: 'Obstacle' },
  { id: 2, name_iast: 'Prīti', name_ua: 'Пріті', name_en: 'Priti', nature: 'auspicious', deity_ua: 'Вішну', deity_en: 'Vishnu', description_ua: 'Любов', description_en: 'Love' },
  { id: 3, name_iast: 'Āyuṣmān', name_ua: 'Аюшман', name_en: 'Ayushman', nature: 'auspicious', deity_ua: 'Чандра', deity_en: 'Chandra', description_ua: 'Довголіття', description_en: 'Longevity' },
  { id: 4, name_iast: 'Saubhāgya', name_ua: 'Саубгаґья', name_en: 'Saubhagya', nature: 'auspicious', deity_ua: 'Брахма', deity_en: 'Brahma', description_ua: 'Удача', description_en: 'Fortune' },
  { id: 5, name_iast: 'Śobhana', name_ua: 'Шобгана', name_en: 'Shobhana', nature: 'auspicious', deity_ua: 'Бріхаспаті', deity_en: 'Brihaspati', description_ua: 'Краса', description_en: 'Beauty' },
  { id: 6, name_iast: 'Atigaṇḍa', name_ua: 'Атіґанда', name_en: 'Atiganda', nature: 'inauspicious', deity_ua: 'Чандра', deity_en: 'Chandra', description_ua: 'Небезпека', description_en: 'Danger' },
  { id: 7, name_iast: 'Sukarma', name_ua: 'Сукарма', name_en: 'Sukarma', nature: 'auspicious', deity_ua: 'Індра', deity_en: 'Indra', description_ua: 'Добра дія', description_en: 'Good deed' },
  { id: 8, name_iast: 'Dhṛti', name_ua: 'Дхріті', name_en: 'Dhriti', nature: 'auspicious', deity_ua: 'Вода', deity_en: 'Water', description_ua: 'Стійкість', description_en: 'Steadiness' },
  { id: 9, name_iast: 'Śūla', name_ua: 'Шула', name_en: 'Shula', nature: 'inauspicious', deity_ua: 'Змія', deity_en: 'Serpent', description_ua: 'Біль', description_en: 'Pain' },
  { id: 10, name_iast: 'Gaṇḍa', name_ua: 'Ґанда', name_en: 'Ganda', nature: 'inauspicious', deity_ua: 'Аґні', deity_en: 'Agni', description_ua: 'Вузол', description_en: 'Knot' },
  { id: 11, name_iast: 'Vṛddhi', name_ua: 'Вріддгі', name_en: 'Vriddhi', nature: 'auspicious', deity_ua: 'Сур\'я', deity_en: 'Surya', description_ua: 'Зростання', description_en: 'Growth' },
  { id: 12, name_iast: 'Dhruva', name_ua: 'Дгрува', name_en: 'Dhruva', nature: 'auspicious', deity_ua: 'Бгумі', deity_en: 'Bhumi', description_ua: 'Сталість', description_en: 'Permanence' },
  { id: 13, name_iast: 'Vyāghāta', name_ua: 'В\'яґгата', name_en: 'Vyaghata', nature: 'inauspicious', deity_ua: 'Ваю', deity_en: 'Vayu', description_ua: 'Руйнування', description_en: 'Destruction' },
  { id: 14, name_iast: 'Harṣaṇa', name_ua: 'Харшана', name_en: 'Harshana', nature: 'auspicious', deity_ua: 'Бгаґа', deity_en: 'Bhaga', description_ua: 'Радість', description_en: 'Joy' },
  { id: 15, name_iast: 'Vajra', name_ua: 'Ваджра', name_en: 'Vajra', nature: 'neutral', deity_ua: 'Варуна', deity_en: 'Varuna', description_ua: 'Блискавка', description_en: 'Lightning' },
  { id: 16, name_iast: 'Siddhi', name_ua: 'Сіддгі', name_en: 'Siddhi', nature: 'auspicious', deity_ua: 'Ґанеша', deity_en: 'Ganesha', description_ua: 'Досягнення', description_en: 'Achievement' },
  { id: 17, name_iast: 'Vyatīpāta', name_ua: 'В\'ятіпата', name_en: 'Vyatipata', nature: 'inauspicious', deity_ua: 'Рудра', deity_en: 'Rudra', description_ua: 'Катастрофа', description_en: 'Calamity' },
  { id: 18, name_iast: 'Varīyān', name_ua: 'Варіян', name_en: 'Variyan', nature: 'auspicious', deity_ua: 'Лакшмі', deity_en: 'Lakshmi', description_ua: 'Найкращий', description_en: 'Best' },
  { id: 19, name_iast: 'Parigha', name_ua: 'Паріґха', name_en: 'Parigha', nature: 'inauspicious', deity_ua: 'Вішвакарма', deity_en: 'Vishwakarma', description_ua: 'Бар\'єр', description_en: 'Barrier' },
  { id: 20, name_iast: 'Śiva', name_ua: 'Шіва', name_en: 'Shiva', nature: 'auspicious', deity_ua: 'Шіва', deity_en: 'Shiva', description_ua: 'Благо', description_en: 'Auspicious' },
  { id: 21, name_iast: 'Siddha', name_ua: 'Сіддга', name_en: 'Siddha', nature: 'auspicious', deity_ua: 'Ґанеша', deity_en: 'Ganesha', description_ua: 'Досконалий', description_en: 'Perfect' },
  { id: 22, name_iast: 'Sādhya', name_ua: 'Садх\'я', name_en: 'Sadhya', nature: 'auspicious', deity_ua: 'Савітар', deity_en: 'Savitar', description_ua: 'Досяжний', description_en: 'Achievable' },
  { id: 23, name_iast: 'Śubha', name_ua: 'Шубга', name_en: 'Shubha', nature: 'auspicious', deity_ua: 'Лакшмі', deity_en: 'Lakshmi', description_ua: 'Благий', description_en: 'Good' },
  { id: 24, name_iast: 'Śukla', name_ua: 'Шукла', name_en: 'Shukla', nature: 'auspicious', deity_ua: 'Парваті', deity_en: 'Parvati', description_ua: 'Світлий', description_en: 'Bright' },
  { id: 25, name_iast: 'Brahma', name_ua: 'Брахма', name_en: 'Brahma', nature: 'auspicious', deity_ua: 'Брахма', deity_en: 'Brahma', description_ua: 'Творець', description_en: 'Creator' },
  { id: 26, name_iast: 'Indra', name_ua: 'Індра', name_en: 'Indra', nature: 'auspicious', deity_ua: 'Індра', deity_en: 'Indra', description_ua: 'Цар', description_en: 'King' },
  { id: 27, name_iast: 'Vaidhṛti', name_ua: 'Вайдхріті', name_en: 'Vaidhriti', nature: 'inauspicious', deity_ua: 'Дгатрі', deity_en: 'Dhatri', description_ua: 'Дисонанс', description_en: 'Dissonance' },
];

/**
 * 11 Каран з українською транслітерацією
 */
const KARANAS: Karana[] = [
  { id: 1, name_iast: 'Bava', name_ua: 'Бава', name_en: 'Bava', type: 'chara', nature: 'auspicious', deity_ua: 'Індра', deity_en: 'Indra' },
  { id: 2, name_iast: 'Bālava', name_ua: 'Балава', name_en: 'Balava', type: 'chara', nature: 'auspicious', deity_ua: 'Брахма', deity_en: 'Brahma' },
  { id: 3, name_iast: 'Kaulava', name_ua: 'Каулава', name_en: 'Kaulava', type: 'chara', nature: 'auspicious', deity_ua: 'Мітра', deity_en: 'Mitra' },
  { id: 4, name_iast: 'Taitila', name_ua: 'Тайтіла', name_en: 'Taitila', type: 'chara', nature: 'auspicious', deity_ua: 'Ар\'яман', deity_en: 'Aryaman' },
  { id: 5, name_iast: 'Gara', name_ua: 'Ґара', name_en: 'Gara', type: 'chara', nature: 'neutral', deity_ua: 'Бгумі', deity_en: 'Bhumi' },
  { id: 6, name_iast: 'Vaṇija', name_ua: 'Ваніджа', name_en: 'Vanija', type: 'chara', nature: 'auspicious', deity_ua: 'Лакшмі', deity_en: 'Lakshmi' },
  { id: 7, name_iast: 'Viṣṭi', name_ua: 'Вішті', name_en: 'Vishti', type: 'chara', nature: 'inauspicious', deity_ua: 'Яма', deity_en: 'Yama' },
  // Стхіра карани (фіксовані)
  { id: 8, name_iast: 'Śakuni', name_ua: 'Шакуні', name_en: 'Shakuni', type: 'sthira', nature: 'inauspicious', deity_ua: 'Каліка', deity_en: 'Kalika' },
  { id: 9, name_iast: 'Catuṣpāda', name_ua: 'Чатушпада', name_en: 'Chatushpada', type: 'sthira', nature: 'neutral', deity_ua: 'Рудра', deity_en: 'Rudra' },
  { id: 10, name_iast: 'Nāga', name_ua: 'Наґа', name_en: 'Naga', type: 'sthira', nature: 'neutral', deity_ua: 'Наґи', deity_en: 'Nagas' },
  { id: 11, name_iast: 'Kiṃstughna', name_ua: 'Кімстуґхна', name_en: 'Kimstughna', type: 'sthira', nature: 'auspicious', deity_ua: 'Манмадха', deity_en: 'Manmadha' },
];

/**
 * 7 Вар (днів тижня)
 */
const VARAS: Vara[] = [
  { id: 0, name_iast: 'Ravivāra', name_ua: 'Равівара (Неділя)', name_en: 'Sunday', ruler: 'surya', nature: 'neutral' },
  { id: 1, name_iast: 'Somavāra', name_ua: 'Сомавара (Понеділок)', name_en: 'Monday', ruler: 'chandra', nature: 'auspicious' },
  { id: 2, name_iast: 'Maṅgalavāra', name_ua: 'Манґалавара (Вівторок)', name_en: 'Tuesday', ruler: 'mangala', nature: 'inauspicious' },
  { id: 3, name_iast: 'Budhavāra', name_ua: 'Будгавара (Середа)', name_en: 'Wednesday', ruler: 'budha', nature: 'auspicious' },
  { id: 4, name_iast: 'Guruvāra', name_ua: 'Ґурувара (Четвер)', name_en: 'Thursday', ruler: 'guru', nature: 'auspicious' },
  { id: 5, name_iast: 'Śukravāra', name_ua: 'Шукравара (П\'ятниця)', name_en: 'Friday', ruler: 'shukra', nature: 'auspicious' },
  { id: 6, name_iast: 'Śanivāra', name_ua: 'Шанівара (Субота)', name_en: 'Saturday', ruler: 'shani', nature: 'inauspicious' },
];

// ============================================
// Головні функції
// ============================================

/**
 * Отримати повну панчангу для дати та локації
 */
export async function calculatePanchanga(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: string
): Promise<Panchanga> {
  try {
    // Спробуємо завантажити бібліотеку @bidyashish/panchang динамічно
    const mod = await loadPanchangaModule();

    if (mod) {
      const input: PanchangaInput = {
        date,
        latitude,
        longitude,
        timezone,
      };

      const panchangaData = await mod.getPanchanga(input);

      // Мапимо дані бібліотеки на наші типи
      return mapPanchangaOutput(panchangaData, date, latitude, longitude, timezone);
    }

    // Бібліотека недоступна - використовуємо локальні розрахунки
    return calculateLocalPanchanga(date, latitude, longitude, timezone);
  } catch (error) {
    console.error('Error calculating panchanga:', error);
    // Fallback на локальні розрахунки
    return calculateLocalPanchanga(date, latitude, longitude, timezone);
  }
}

/**
 * Мапування виводу бібліотеки на наші типи
 */
function mapPanchangaOutput(
  data: PanchangaOutput,
  date: Date,
  latitude: number,
  longitude: number,
  timezone: string
): Panchanga {
  // Отримуємо накшатру та раші за градусом Місяця
  const moonDegree = data.nakshatra?.degree || 0;
  const sunDegree = data.sunSign?.degree || 0;

  const nakshatra = getNakshatraByDegree(moonDegree);
  const moonRashi = getRashiByDegree(moonDegree);
  const sunRashi = getRashiByDegree(sunDegree);

  // Тітхі
  const tithiNumber = data.tithi?.number || 1;
  const paksha = data.tithi?.paksha === 'Shukla' ? 'shukla' : 'krishna';
  const tithiData = TITHIS[(tithiNumber - 1) % 15];
  const tithi: Tithi = {
    ...tithiData,
    paksha,
    paksha_number: paksha === 'shukla' ? tithiNumber : tithiNumber - 15,
  };

  // Йога
  const yogaNumber = data.yoga?.number || 1;
  const yoga = YOGAS[yogaNumber - 1] || YOGAS[0];

  // Карана
  const karanaNumber = data.karana?.number || 1;
  const karana = KARANAS[(karanaNumber - 1) % 11] || KARANAS[0];

  // Вара
  const dayOfWeek = date.getDay();
  const vara = VARAS[dayOfWeek];

  return {
    date,
    location: {
      latitude,
      longitude,
      timezone,
    },
    tithi: {
      current: tithi,
      progress: data.tithi?.progress || 0,
      end_time: data.tithi?.endTime ? new Date(data.tithi.endTime) : undefined,
    },
    nakshatra: {
      current: nakshatra,
      moon_degree: moonDegree,
      progress: getNakshatraProgress(moonDegree),
      end_time: data.nakshatra?.endTime ? new Date(data.nakshatra.endTime) : undefined,
    },
    yoga: {
      current: yoga,
      progress: data.yoga?.progress || 0,
      end_time: data.yoga?.endTime ? new Date(data.yoga.endTime) : undefined,
    },
    karana: {
      current: karana,
      progress: data.karana?.progress || 0,
      end_time: data.karana?.endTime ? new Date(data.karana.endTime) : undefined,
    },
    vara,
    rashi: {
      moon: moonRashi,
      sun: sunRashi,
    },
    sunrise: data.sunrise ? new Date(data.sunrise) : new Date(date.setHours(6, 0, 0, 0)),
    sunset: data.sunset ? new Date(data.sunset) : new Date(date.setHours(18, 0, 0, 0)),
    moonrise: data.moonrise ? new Date(data.moonrise) : undefined,
    moonset: data.moonset ? new Date(data.moonset) : undefined,
    rahu_kaal: data.rahuKaal ? {
      start: new Date(data.rahuKaal.start),
      end: new Date(data.rahuKaal.end),
    } : undefined,
  };
}

/**
 * Локальні розрахунки панчанги (fallback)
 */
function calculateLocalPanchanga(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: string
): Panchanga {
  // Спрощені локальні розрахунки
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);

  // Приблизний градус Місяця (спрощено)
  const moonDegree = (dayOfYear * 13.2) % 360;
  const sunDegree = (dayOfYear * 0.9856) % 360;

  const nakshatra = getNakshatraByDegree(moonDegree);
  const moonRashi = getRashiByDegree(moonDegree);
  const sunRashi = getRashiByDegree(sunDegree);

  // Приблизна тітхі
  const lunarDay = Math.floor(((moonDegree - sunDegree + 360) % 360) / 12) + 1;
  const tithiNumber = ((lunarDay - 1) % 30) + 1;
  const paksha: 'shukla' | 'krishna' = tithiNumber <= 15 ? 'shukla' : 'krishna';
  const tithiData = TITHIS[(tithiNumber - 1) % 15];

  const tithi: Tithi = {
    ...tithiData,
    paksha,
    paksha_number: paksha === 'shukla' ? tithiNumber : tithiNumber - 15,
  };

  // Приблизна йога
  const yogaNumber = Math.floor(((moonDegree + sunDegree) % 360) / 13.333333) + 1;
  const yoga = YOGAS[(yogaNumber - 1) % 27] || YOGAS[0];

  // Приблизна карана
  const karanaNumber = Math.floor((tithiNumber * 2 - 1) % 60 / 2) + 1;
  const karana = KARANAS[(karanaNumber - 1) % 11] || KARANAS[0];

  // Вара
  const dayOfWeek = date.getDay();
  const vara = VARAS[dayOfWeek];

  return {
    date,
    location: {
      latitude,
      longitude,
      timezone,
    },
    tithi: {
      current: tithi,
      progress: 50,
    },
    nakshatra: {
      current: nakshatra,
      moon_degree: moonDegree,
      progress: getNakshatraProgress(moonDegree),
    },
    yoga: {
      current: yoga,
      progress: 50,
    },
    karana: {
      current: karana,
      progress: 50,
    },
    vara,
    rashi: {
      moon: moonRashi,
      sun: sunRashi,
    },
    sunrise: new Date(date.setHours(6, 0, 0, 0)),
    sunset: new Date(date.setHours(18, 0, 0, 0)),
  };
}

/**
 * Отримати джйотіш читання для дати народження
 */
export async function getJyotishReading(birthData: BirthData): Promise<JyotishReading> {
  const { date, location } = birthData;

  // Отримуємо панчангу для часу народження
  const panchanga = await calculatePanchanga(
    date,
    location.latitude,
    location.longitude,
    location.timezone
  );

  const janmaNakshatra = panchanga.nakshatra.current;
  const chandraRashi = panchanga.rashi.moon;
  const suryaRashi = panchanga.rashi.sun;

  // Генеруємо інтерпретацію
  const interpretation = generateInterpretation(janmaNakshatra, chandraRashi, suryaRashi);

  return {
    birthData,
    panchanga,
    janma_nakshatra: janmaNakshatra,
    chandra_rashi: chandraRashi,
    surya_rashi: suryaRashi,
    personality_ua: interpretation.personality_ua,
    personality_en: interpretation.personality_en,
    strengths_ua: interpretation.strengths_ua,
    strengths_en: interpretation.strengths_en,
    challenges_ua: interpretation.challenges_ua,
    challenges_en: interpretation.challenges_en,
    career_ua: interpretation.career_ua,
    career_en: interpretation.career_en,
    compatibility_ua: interpretation.compatibility_ua,
    compatibility_en: interpretation.compatibility_en,
  };
}

/**
 * Генерація інтерпретації на основі накшатри та раші
 */
function generateInterpretation(
  nakshatra: Nakshatra,
  moonRashi: Rashi,
  sunRashi: Rashi
) {
  const nakshatraRuler = getGrahaById(nakshatra.ruler_planet);
  const rashiRuler = getGrahaById(moonRashi.ruler_planet);

  const personality_ua = `Ваша накшатра народження — ${nakshatra.name_ua} (${nakshatra.name_sanskrit}), що перебуває під впливом ${nakshatraRuler?.name_ua || nakshatra.ruler_planet}. ${nakshatra.description_ua} Місяць у ${moonRashi.name_ua} (${moonRashi.western_name_ua}) надає вашим емоціям ${moonRashi.description_ua.toLowerCase()}`;

  const personality_en = `Your birth nakshatra is ${nakshatra.name_en} (${nakshatra.name_sanskrit}), ruled by ${nakshatraRuler?.name_en || nakshatra.ruler_planet}. ${nakshatra.description_en} Moon in ${moonRashi.name_en} (${moonRashi.western_name_en}) gives your emotions ${moonRashi.description_en.toLowerCase()}`;

  return {
    personality_ua,
    personality_en,
    strengths_ua: [...nakshatra.positive_traits_ua, ...moonRashi.positive_traits_ua.slice(0, 3)],
    strengths_en: [...nakshatra.positive_traits_en, ...moonRashi.positive_traits_en.slice(0, 3)],
    challenges_ua: [...nakshatra.negative_traits_ua, ...moonRashi.negative_traits_ua.slice(0, 2)],
    challenges_en: [...nakshatra.negative_traits_en, ...moonRashi.negative_traits_en.slice(0, 2)],
    career_ua: nakshatra.career_ua,
    career_en: nakshatra.career_en,
    compatibility_ua: `Найкраща сумісність з накшатрами, якими володіє ${nakshatraRuler?.name_ua || 'та сама планета'}.`,
    compatibility_en: `Best compatibility with nakshatras ruled by ${nakshatraRuler?.name_en || 'the same planet'}.`,
  };
}

/**
 * Отримати повний ведичний портрет (Джйотіш + Нумерологія)
 */
export async function getVedicPortrait(birthData: BirthData): Promise<VedicPortrait> {
  // Джйотіш читання
  const jyotish = await getJyotishReading(birthData);

  // Нумерологія
  const birthDateObj = createBirthDate(
    birthData.date.getDate().toString(),
    (birthData.date.getMonth() + 1).toString(),
    birthData.date.getFullYear().toString()
  );

  let numerology;
  if (birthDateObj) {
    const reading = calculateNumerologyReading(birthDateObj);
    numerology = {
      consciousness: reading.numbers.consciousness,
      action: reading.numbers.action,
      realization: reading.numbers.realization,
      lifeNumber: reading.numbers.lifeNumber,
      notation: reading.notation,
    };
  }

  // Комбінована інтерпретація
  const combined_interpretation_ua = generateCombinedInterpretation(jyotish, numerology, 'ua');
  const combined_interpretation_en = generateCombinedInterpretation(jyotish, numerology, 'en');

  return {
    birthData,
    jyotish,
    numerology,
    combined_interpretation_ua,
    combined_interpretation_en,
  };
}

/**
 * Генерація комбінованої інтерпретації
 */
function generateCombinedInterpretation(
  jyotish: JyotishReading,
  numerology: VedicPortrait['numerology'],
  lang: 'ua' | 'en'
): string {
  if (!numerology) {
    return lang === 'ua'
      ? jyotish.personality_ua
      : jyotish.personality_en;
  }

  const nakshatra = jyotish.janma_nakshatra;
  const rashi = jyotish.chandra_rashi;

  if (lang === 'ua') {
    return `Ваш ведичний портрет: накшатра ${nakshatra.name_ua} у ${rashi.name_ua} (${rashi.western_name_ua}) поєднується з нумерологічним числом підсумку ${numerology.lifeNumber}. Формула ${numerology.notation} вказує на ${getLifeNumberTheme(numerology.lifeNumber, 'ua')}. ${nakshatra.description_ua}`;
  }

  return `Your Vedic portrait: ${nakshatra.name_en} nakshatra in ${rashi.name_en} (${rashi.western_name_en}) combines with life number ${numerology.lifeNumber}. Formula ${numerology.notation} indicates ${getLifeNumberTheme(numerology.lifeNumber, 'en')}. ${nakshatra.description_en}`;
}

/**
 * Отримати тему числа підсумку
 */
function getLifeNumberTheme(lifeNumber: number, lang: 'ua' | 'en'): string {
  const themes: Record<number, { ua: string; en: string }> = {
    1: { ua: 'шлях лідерства та незалежності', en: 'path of leadership and independence' },
    2: { ua: 'шлях партнерства та дипломатії', en: 'path of partnership and diplomacy' },
    3: { ua: 'шлях творчості та самовираження', en: 'path of creativity and self-expression' },
    4: { ua: 'шлях стабільності та практичності', en: 'path of stability and practicality' },
    5: { ua: 'шлях свободи та пригод', en: 'path of freedom and adventure' },
    6: { ua: 'шлях служіння та відповідальності', en: 'path of service and responsibility' },
    7: { ua: 'шлях духовності та аналізу', en: 'path of spirituality and analysis' },
    8: { ua: 'шлях влади та матеріального успіху', en: 'path of power and material success' },
    9: { ua: 'шлях мудрості та гуманізму', en: 'path of wisdom and humanitarianism' },
  };

  return themes[lifeNumber]?.[lang] || (lang === 'ua' ? 'унікальний життєвий шлях' : 'unique life path');
}

// ============================================
// Експорт допоміжних функцій та даних
// ============================================

export {
  TITHIS,
  YOGAS,
  KARANAS,
  VARAS,
  getNakshatraByDegree,
  getNakshatraPada,
  getNakshatraProgress,
  getRashiByDegree,
  getRashiProgress,
  getGrahaById,
  getGrahaByDayOfWeek,
  NAKSHATRAS,
  RASHIS,
  GRAHAS,
};
