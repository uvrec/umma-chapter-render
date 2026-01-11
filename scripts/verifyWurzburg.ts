/**
 * Verification script for Würzburg against official ISKCON calendar
 */

import { isEkadashiISKCON, type GeoLocation } from '../src/services/ekadashiCalculator';

const WURZBURG: GeoLocation = {
  latitude: 49.7913,
  longitude: 9.9534,
  timezone: 'Europe/Berlin'
};

// Official ISKCON dates for Würzburg 2026 (from drikpanchang.com)
const ISKCON_WURZBURG_2026 = [
  { date: '2026-01-14', name: 'Shat Tila' },
  { date: '2026-01-29', name: 'Bhaimi' },
  { date: '2026-02-13', name: 'Vijaya' },
  { date: '2026-02-27', name: 'Amalaki' },
  { date: '2026-03-14', name: 'Papamochani' },  // Different from Kyiv (Mar 15)
  { date: '2026-03-28', name: 'Kamada' },       // Different from Kyiv (Mar 29)
  { date: '2026-04-13', name: 'Varuthini' },
  { date: '2026-04-27', name: 'Mohini' },
  { date: '2026-05-13', name: 'Apara' },
  { date: '2026-05-26', name: 'Padmini' },      // Different from Kyiv (May 27)
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

console.log('');
console.log('════════════════════════════════════════════════════════════════');
console.log('   VERIFIKATION WÜRZBURG vs ISKCON KALENDER');
console.log('════════════════════════════════════════════════════════════════');
console.log('');

let matches = 0;
let mismatches = 0;

for (const entry of ISKCON_WURZBURG_2026) {
  const date = new Date(entry.date + 'T12:00:00');
  const result = isEkadashiISKCON(date, WURZBURG);

  const status = result.isEkadashi ? '✅' : '❌';
  console.log(`${status} ${entry.date} - ${entry.name}`);

  if (result.isEkadashi) matches++;
  else mismatches++;
}

console.log('');
console.log('════════════════════════════════════════════════════════════════');
console.log(`   RESULT: ${matches}/${ISKCON_WURZBURG_2026.length} match`);
if (mismatches === 0) {
  console.log('   ✅ ALL DATES MATCH ISKCON WÜRZBURG!');
} else {
  console.log(`   ⚠️ ${mismatches} dates do not match`);
}
console.log('════════════════════════════════════════════════════════════════');
console.log('');
