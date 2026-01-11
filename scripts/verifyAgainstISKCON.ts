/**
 * Quick verification script to compare our calculation with ISKCON official dates
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

// Official ISKCON dates for Kyiv 2026 (from drikpanchang.com)
const ISKCON_KYIV_2026 = [
  { date: '2026-01-14', name: 'Shat Tila' },
  { date: '2026-01-29', name: 'Bhaimi' },
  { date: '2026-02-13', name: 'Vijaya' },
  { date: '2026-02-27', name: 'Amalaki' },
  { date: '2026-03-15', name: 'Papamochani' },
  { date: '2026-03-29', name: 'Kamada' },
  { date: '2026-04-13', name: 'Varuthini' },
  { date: '2026-04-27', name: 'Mohini' },
  { date: '2026-05-13', name: 'Apara' },
  { date: '2026-05-27', name: 'Padmini' },
  { date: '2026-06-11', name: 'Parama' },
  { date: '2026-06-25', name: 'Pandava Nirjala' },
  { date: '2026-07-11', name: 'Yogini' },
  { date: '2026-07-25', name: 'Sayana' },
  { date: '2026-08-09', name: 'Kamika' },
  { date: '2026-08-23', name: 'Pavitropana' },
  { date: '2026-09-07', name: 'Annada' },
  { date: '2026-09-22', name: 'Parshva' },
  { date: '2026-10-06', name: 'Indira' },
  { date: '2026-10-22', name: 'Pashankusha' },
  { date: '2026-11-05', name: 'Rama' },
  { date: '2026-11-20', name: 'Utthana' },
  { date: '2026-12-04', name: 'Utpanna' },
  { date: '2026-12-20', name: 'Mokshada' },
];

/**
 * Check if a date is Ekadashi using ISKCON rules (Brahma Muhurta check + Mahadvadashi)
 */
function isEkadashiISKCON(date: Date, location: GeoLocation): boolean {
  const sunTimes = calculateSunTimes(date, location);
  const brahmaMuhurta = new Date(sunTimes.sunrise.getTime() - 96 * 60 * 1000);
  const tithiAtBrahma = calculateTithi(brahmaMuhurta);

  // Primary: Ekadashi at Brahma Muhurta
  if (tithiAtBrahma.tithiInPaksha === 11) {
    return true;
  }

  // Mahadvadashi: Dvadashi at Brahma Muhurta, but Ekadashi was overnight
  if (tithiAtBrahma.tithiInPaksha === 12) {
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevSunTimes = calculateSunTimes(prevDay, location);
    const tithiAtPrevSunset = calculateTithi(prevSunTimes.sunset);
    const prevBrahma = new Date(prevSunTimes.sunrise.getTime() - 96 * 60 * 1000);
    const tithiAtPrevBrahma = calculateTithi(prevBrahma);

    if (tithiAtPrevSunset.tithiInPaksha === 11 && tithiAtPrevBrahma.tithiInPaksha === 10) {
      return true;
    }
  }

  return false;
}

console.log('');
console.log('════════════════════════════════════════════════════════════════');
console.log('   ВЕРИФІКАЦІЯ ПРОТИ ОФІЦІЙНОГО КАЛЕНДАРЯ ISKCON');
console.log('════════════════════════════════════════════════════════════════');
console.log('');

let matches = 0;
let mismatches = 0;

for (const entry of ISKCON_KYIV_2026) {
  const date = new Date(entry.date + 'T12:00:00');
  const isOurs = isEkadashiISKCON(date, KYIV);

  const status = isOurs ? '✅' : '❌';
  console.log(`${status} ${entry.date} - ${entry.name}`);

  if (isOurs) matches++;
  else mismatches++;
}

console.log('');
console.log('════════════════════════════════════════════════════════════════');
console.log(`   РЕЗУЛЬТАТ: ${matches}/${ISKCON_KYIV_2026.length} співпадають`);
if (mismatches === 0) {
  console.log('   ✅ ВСІ ДАТИ ЗБІГАЮТЬСЯ З ISKCON!');
} else {
  console.log(`   ⚠️ ${mismatches} дат не співпадають`);
}
console.log('════════════════════════════════════════════════════════════════');
console.log('');
