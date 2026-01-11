/**
 * Accurate Ekadashi Date Generator
 *
 * Determines Ekadashi based on tithi at LOCAL SUNRISE
 * This is the correct Vedic method used by ISKCON
 *
 * Rule: If Ekadashi tithi (11th) is present at sunrise, that day is Ekadashi
 */

import {
  calculateTithi,
  calculateSunTimes,
  calculateEkadashiFastingTimes,
  type GeoLocation
} from '../src/services/ekadashiCalculator';

// Locations
const KYIV: GeoLocation = {
  latitude: 50.4501,
  longitude: 30.5234,
  timezone: 'Europe/Kyiv'
};

const WURZBURG: GeoLocation = {
  latitude: 49.7913,
  longitude: 9.9534,
  timezone: 'Europe/Berlin'
};

interface EkadashiEvent {
  date: Date;
  dateStr: string;
  paksha: 'shukla' | 'krishna';
  tithiAtSunrise: number;
  sunrise: string;
  sunset: string;
  paranaStart: string;
  paranaEnd: string;
}

/**
 * Determines if a specific day is Ekadashi for a given location
 * by checking the tithi at the moment of LOCAL SUNRISE
 */
function isEkadashiAtLocation(date: Date, location: GeoLocation): {
  isEkadashi: boolean;
  tithi: number;
  paksha: 'shukla' | 'krishna';
  sunrise: Date;
} {
  // Get sunrise time for this location on this date
  const sunTimes = calculateSunTimes(date, location);

  // Calculate tithi at the exact moment of sunrise
  const tithiAtSunrise = calculateTithi(sunTimes.sunrise);

  return {
    isEkadashi: tithiAtSunrise.tithiInPaksha === 11,
    tithi: tithiAtSunrise.tithiInPaksha,
    paksha: tithiAtSunrise.paksha,
    sunrise: sunTimes.sunrise
  };
}

/**
 * Find all Ekadashi dates for a location in a given year
 */
function findEkadashisForLocation(year: number, location: GeoLocation): EkadashiEvent[] {
  const ekadashis: EkadashiEvent[] = [];

  // Scan each day of the year
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const result = isEkadashiAtLocation(currentDate, location);

    if (result.isEkadashi) {
      const sunTimes = calculateSunTimes(currentDate, location);
      const fasting = calculateEkadashiFastingTimes(currentDate, location);

      const formatTime = (d: Date) => d.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: location.timezone
      });

      ekadashis.push({
        date: new Date(currentDate),
        dateStr: currentDate.toLocaleDateString('uk-UA', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: location.timezone
        }),
        paksha: result.paksha,
        tithiAtSunrise: result.tithi,
        sunrise: formatTime(sunTimes.sunrise),
        sunset: formatTime(sunTimes.sunset),
        paranaStart: formatTime(fasting.paranaStart),
        paranaEnd: formatTime(fasting.paranaEnd)
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return ekadashis;
}

/**
 * Format date for comparison
 */
function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// ============================================
// MAIN
// ============================================

console.log('');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('   ТОЧНИЙ РОЗРАХУНОК ЕКАДАШІ ПО ЛОКАЦІЯХ (тітхі на схід сонця)');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('');

const year = 2026;

// Calculate for both locations
console.log('Розраховую для Києва...');
const kyivEkadashis = findEkadashisForLocation(year, KYIV);

console.log('Розраховую для Вюрцбурга...');
const wurzburgEkadashis = findEkadashisForLocation(year, WURZBURG);

console.log('');
console.log(`Знайдено екадаші в ${year} році:`);
console.log(`  Київ: ${kyivEkadashis.length}`);
console.log(`  Вюрцбург: ${wurzburgEkadashis.length}`);
console.log('');

// Create lookup maps
const kyivDates = new Set(kyivEkadashis.map(e => formatDateKey(e.date)));
const wurzburgDates = new Set(wurzburgEkadashis.map(e => formatDateKey(e.date)));

// Find differences
const onlyKyiv = kyivEkadashis.filter(e => !wurzburgDates.has(formatDateKey(e.date)));
const onlyWurzburg = wurzburgEkadashis.filter(e => !kyivDates.has(formatDateKey(e.date)));
const both = kyivEkadashis.filter(e => wurzburgDates.has(formatDateKey(e.date)));

console.log('════════════════════════════════════════════════════════════════════════════');
console.log('   ПОРІВНЯННЯ');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('');
console.log(`Однакові дати: ${both.length}`);
console.log(`Тільки в Києві: ${onlyKyiv.length}`);
console.log(`Тільки у Вюрцбурзі: ${onlyWurzburg.length}`);

if (onlyKyiv.length > 0 || onlyWurzburg.length > 0) {
  console.log('');
  console.log('⚠️  РІЗНИЦЯ В ДАТАХ:');

  if (onlyKyiv.length > 0) {
    console.log('');
    console.log('   Тільки в КИЄВІ:');
    for (const e of onlyKyiv) {
      console.log(`     ${e.dateStr} (${e.paksha})`);
    }
  }

  if (onlyWurzburg.length > 0) {
    console.log('');
    console.log('   Тільки у ВЮРЦБУРЗІ:');
    for (const e of onlyWurzburg) {
      console.log(`     ${e.dateStr} (${e.paksha})`);
    }
  }
}

// Print detailed tables
console.log('');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('   КИЇВ — ЕКАДАШІ ' + year);
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('');
console.log('Дата                 | Пакша   | Схід  | Захід | Парана');
console.log('---------------------|---------|-------|-------|---------------');

for (const e of kyivEkadashis) {
  const pakshaStr = e.paksha === 'shukla' ? 'Шукла' : 'Крішна';
  console.log(
    `${e.dateStr.padEnd(20)} | ${pakshaStr.padEnd(7)} | ${e.sunrise} | ${e.sunset} | ${e.paranaStart}—${e.paranaEnd}`
  );
}

console.log('');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('   ВЮРЦБУРГ — ЕКАДАШІ ' + year);
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('');
console.log('Дата                 | Пакша   | Схід  | Захід | Парана');
console.log('---------------------|---------|-------|-------|---------------');

for (const e of wurzburgEkadashis) {
  const pakshaStr = e.paksha === 'shukla' ? 'Шукла' : 'Крішна';
  console.log(
    `${e.dateStr.padEnd(20)} | ${pakshaStr.padEnd(7)} | ${e.sunrise} | ${e.sunset} | ${e.paranaStart}—${e.paranaEnd}`
  );
}

console.log('');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('   ПОРІВНЯЛЬНА ТАБЛИЦЯ (поряд)');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('');
console.log('           КИЇВ                    |            ВЮРЦБУРГ');
console.log('Дата           | Схід  | Парана    | Дата           | Схід  | Парана');
console.log('---------------|-------|-----------|----------------|-------|----------');

// Merge and sort all dates
const allDates = new Set([...kyivDates, ...wurzburgDates]);
const sortedDates = Array.from(allDates).sort();

const kyivMap = new Map(kyivEkadashis.map(e => [formatDateKey(e.date), e]));
const wurzburgMap = new Map(wurzburgEkadashis.map(e => [formatDateKey(e.date), e]));

for (const dateKey of sortedDates) {
  const k = kyivMap.get(dateKey);
  const w = wurzburgMap.get(dateKey);

  const kDate = k ? k.date.toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' }) : '';
  const kSunrise = k ? k.sunrise : '';
  const kParana = k ? `${k.paranaStart}` : '';

  const wDate = w ? w.date.toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' }) : '';
  const wSunrise = w ? w.sunrise : '';
  const wParana = w ? `${w.paranaStart}` : '';

  const diff = (k && w) ? '' : ' ⚠️';

  console.log(
    `${kDate.padEnd(14)} | ${kSunrise.padEnd(5)} | ${kParana.padEnd(9)} | ${wDate.padEnd(14)} | ${wSunrise.padEnd(5)} | ${wParana}${diff}`
  );
}

console.log('');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('✅ Розрахунок завершено');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('');
