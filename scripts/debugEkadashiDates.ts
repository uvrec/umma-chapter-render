/**
 * Debug script to understand Ekadashi date discrepancies
 *
 * Compares our calculation with ISKCON official dates
 * and analyzes tithi progression at key times
 */

import {
  calculateTithi,
  calculateSunTimes,
  type GeoLocation
} from '../src/services/ekadashiCalculator';

const KYIV: GeoLocation = {
  latitude: 50.4501,
  longitude: 30.5234,
  timezone: 'Europe/Kyiv'
};

// Discrepant dates from comparison
const DISCREPANT_DATES = [
  { ours: '2026-03-14', iskcon: '2026-03-15', name: 'Papamochani' },
  { ours: '2026-03-28', iskcon: '2026-03-29', name: 'Kamada' },
  { ours: '2026-05-26', iskcon: '2026-05-27', name: 'Padmini/Nirjala' },
  { ours: null, iskcon: '2026-07-11', name: 'Yogini (MISSING)' },
];

// ISKCON official dates for Kyiv 2026
const ISKCON_DATES = [
  '2026-01-14', '2026-01-29', '2026-02-13', '2026-02-27',
  '2026-03-15', '2026-03-29', '2026-04-13', '2026-04-27',
  '2026-05-13', '2026-05-27', '2026-06-11', '2026-06-25',
  '2026-07-11', '2026-07-25', '2026-08-09', '2026-08-23',
  '2026-09-07', '2026-09-22', '2026-10-06', '2026-10-22',
  '2026-11-05', '2026-11-20', '2026-12-04', '2026-12-20'
];

function formatTime(d: Date, tz: string): string {
  return d.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: tz
  });
}

function analyzeTithiProgression(dateStr: string, location: GeoLocation) {
  const date = new Date(dateStr + 'T00:00:00');
  const sunTimes = calculateSunTimes(date, location);

  // Key times to check
  const brahmaMuhurta = new Date(sunTimes.sunrise.getTime() - 96 * 60 * 1000);
  const arunodaya = new Date(sunTimes.sunrise.getTime() - 96 * 60 * 1000); // Same as Brahma Muhurta start

  // Previous day sunset (for overnight analysis)
  const prevDay = new Date(date);
  prevDay.setDate(prevDay.getDate() - 1);
  const prevSunTimes = calculateSunTimes(prevDay, location);

  // Next day sunrise
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextSunTimes = calculateSunTimes(nextDay, location);

  const checkPoints = [
    { name: 'Prev Sunset', time: prevSunTimes.sunset },
    { name: 'Midnight', time: new Date(date.getTime() + 0 * 60 * 60 * 1000) },
    { name: 'Brahma Muhurta', time: brahmaMuhurta },
    { name: 'Sunrise', time: sunTimes.sunrise },
    { name: 'Mid-morning', time: new Date(sunTimes.sunrise.getTime() + 3 * 60 * 60 * 1000) },
    { name: 'Noon', time: new Date(date.getTime() + 12 * 60 * 60 * 1000) },
    { name: 'Sunset', time: sunTimes.sunset },
    { name: 'Next Sunrise', time: nextSunTimes.sunrise },
  ];

  console.log(`\n  ${dateStr}:`);
  console.log('  ─────────────────────────────────────────────────────');

  for (const cp of checkPoints) {
    const tithi = calculateTithi(cp.time);
    const marker = tithi.tithiInPaksha === 11 ? ' ← EKADASHI' :
                   tithi.tithiInPaksha === 10 ? ' ← DASHAMI' :
                   tithi.tithiInPaksha === 12 ? ' ← DVADASHI' : '';
    console.log(
      `  ${cp.name.padEnd(15)} ${formatTime(cp.time, location.timezone!)}  →  Tithi ${tithi.tithiInPaksha.toString().padStart(2)} (${tithi.paksha})${marker}`
    );
  }
}

console.log('');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('   АНАЛІЗ РОЗБІЖНОСТЕЙ В ДАТАХ ЕКАДАШІ');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('');
console.log('Порівнюємо наші розрахунки з офіційним календарем ISKCON для Києва.');
console.log('');

console.log('════════════════════════════════════════════════════════════════════════════');
console.log('   РОЗБІЖНОСТІ:');
console.log('════════════════════════════════════════════════════════════════════════════');

for (const d of DISCREPANT_DATES) {
  console.log(`\n▶ ${d.name}`);
  console.log(`  Наш розрахунок: ${d.ours || 'ВІДСУТНІЙ'}`);
  console.log(`  ISKCON офіц.:   ${d.iskcon}`);

  if (d.ours) {
    console.log('\n  --- Наша дата ---');
    analyzeTithiProgression(d.ours, KYIV);
  }

  console.log('\n  --- ISKCON дата ---');
  analyzeTithiProgression(d.iskcon, KYIV);

  // Also check day before ISKCON date
  const dayBefore = new Date(d.iskcon);
  dayBefore.setDate(dayBefore.getDate() - 1);
  const dayBeforeStr = dayBefore.toISOString().split('T')[0];

  if (d.ours !== dayBeforeStr) {
    console.log('\n  --- День перед ISKCON датою ---');
    analyzeTithiProgression(dayBeforeStr, KYIV);
  }
}

console.log('');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('   ПОВНА ПЕРЕВІРКА ВСІХ ISKCON ДАТ');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('');
console.log('Перевіряємо тітхі на схід сонця для кожної офіційної дати ISKCON:');
console.log('');

for (const dateStr of ISKCON_DATES) {
  const date = new Date(dateStr + 'T12:00:00');
  const sunTimes = calculateSunTimes(date, KYIV);
  const tithiAtSunrise = calculateTithi(sunTimes.sunrise);

  // Check Brahma Muhurta (96 min before sunrise)
  const brahmaMuhurta = new Date(sunTimes.sunrise.getTime() - 96 * 60 * 1000);
  const tithiAtBrahma = calculateTithi(brahmaMuhurta);

  const status = tithiAtSunrise.tithiInPaksha === 11 ? '✅' : '⚠️';
  const brahmaStatus = tithiAtBrahma.tithiInPaksha === 11 ? 'Ek' :
                       tithiAtBrahma.tithiInPaksha === 10 ? 'Da' : 'Dv';

  console.log(
    `${status} ${dateStr} | Sunrise: Tithi ${tithiAtSunrise.tithiInPaksha.toString().padStart(2)} | Brahma M: ${brahmaStatus} | ${tithiAtSunrise.paksha}`
  );
}

console.log('');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('   ВИСНОВОК');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('');
console.log('Правило ISKCON (Viddha Ekadashi):');
console.log('Якщо Дашамі (10-та тітхі) присутня на Брахма Мугурту (96 хв до сходу),');
console.log('то Екадаші вважається "заплямованою" і піст переноситься на наступний день.');
console.log('');
