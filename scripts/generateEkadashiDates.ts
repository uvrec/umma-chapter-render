/**
 * Script to generate Ekadashi dates and populate calendar_events table
 *
 * Usage: npx vite-node scripts/generateEkadashiDates.ts
 */

import { calculateTithi, calculateSunTimes, calculateEkadashiFastingTimes } from '../src/services/ekadashiCalculator';
import { createClient } from '@supabase/supabase-js';

// Supabase connection - use environment variables or local config
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Default location (Kyiv) for calculating times
const DEFAULT_LOCATION = {
  latitude: 50.4501,
  longitude: 30.5234,
  timezone: 'Europe/Kyiv'
};

// Ekadashi slugs mapped by paksha and vaishnava month
const EKADASHI_SLUGS: Record<string, Record<number, string>> = {
  shukla: {
    1: 'kamada-ekadashi',        // Madhava
    2: 'mohini-ekadashi',        // Madhusudana
    3: 'nirjala-ekadashi',       // Trivikrama
    4: 'devashayani-ekadashi',   // Vamana
    5: 'shravana-putrada-ekadashi', // Shridhara
    6: 'padma-ekadashi',         // Hrishikesha
    7: 'papankusha-ekadashi',    // Padmanabha
    8: 'prabodhini-ekadashi',    // Damodara (Kartik)
    9: 'mokshada-ekadashi',      // Keshava
    10: 'pausha-putrada-ekadashi', // Narayana
    11: 'jaya-ekadashi',         // Govinda
    12: 'amalaki-ekadashi',      // Vishnu
  },
  krishna: {
    1: 'varuthini-ekadashi',     // Madhava
    2: 'apara-ekadashi',         // Madhusudana
    3: 'yogini-ekadashi',        // Trivikrama
    4: 'kamika-ekadashi',        // Vamana
    5: 'aja-ekadashi',           // Shridhara
    6: 'parivartini-ekadashi',   // Hrishikesha
    7: 'indira-ekadashi',        // Padmanabha
    8: 'rama-ekadashi',          // Damodara (Kartik)
    9: 'utpanna-ekadashi',       // Keshava
    10: 'saphala-ekadashi',      // Narayana
    11: 'sat-tila-ekadashi',     // Govinda
    12: 'vijaya-ekadashi',       // Vishnu
  }
};

// Map Gregorian month to approximate Vaishnava month
function getVaishnavMonthNumber(date: Date): number {
  const month = date.getMonth(); // 0-11
  // Approximate mapping (varies by year based on lunar calendar)
  const mapping: Record<number, number> = {
    0: 10,  // Jan -> Pausha/Narayana (month 10)
    1: 11,  // Feb -> Magha/Govinda (month 11)
    2: 12,  // Mar -> Phalguna/Vishnu (month 12)
    3: 1,   // Apr -> Chaitra/Madhava (month 1)
    4: 2,   // May -> Vaishakha/Madhusudana (month 2)
    5: 3,   // Jun -> Jyeshtha/Trivikrama (month 3)
    6: 4,   // Jul -> Ashadha/Vamana (month 4)
    7: 5,   // Aug -> Shravana/Shridhara (month 5)
    8: 6,   // Sep -> Bhadrapada/Hrishikesha (month 6)
    9: 7,   // Oct -> Ashvina/Padmanabha (month 7)
    10: 8,  // Nov -> Kartika/Damodara (month 8)
    11: 9,  // Dec -> Margashirsha/Keshava (month 9)
  };
  return mapping[month];
}

interface EkadashiDate {
  date: Date;
  paksha: 'shukla' | 'krishna';
  tithiInPaksha: number;
  vaishnavMonth: number;
  slug: string;
}

/**
 * Find all Ekadashi dates in a year
 */
function findAllEkadashisInYear(year: number): EkadashiDate[] {
  const ekadashis: EkadashiDate[] = [];

  // Scan each day of the year
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day, 12, 0, 0);
      const tithi = calculateTithi(date);

      if (tithi.tithiInPaksha === 11) {
        const vaishnavMonth = getVaishnavMonthNumber(date);
        const slug = EKADASHI_SLUGS[tithi.paksha][vaishnavMonth];

        ekadashis.push({
          date,
          paksha: tithi.paksha,
          tithiInPaksha: tithi.tithiInPaksha,
          vaishnavMonth,
          slug: slug || 'unknown-ekadashi',
        });
      }
    }
  }

  return ekadashis;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format time as HH:MM:SS
 */
function formatTime(date: Date): string {
  return date.toTimeString().split(' ')[0];
}

/**
 * Main function to generate and optionally insert Ekadashi dates
 */
async function main() {
  const startYear = 2025;
  const endYear = 2030;

  console.log('');
  console.log('════════════════════════════════════════════════════════════════');
  console.log('    ГЕНЕРАЦІЯ ДАТ ЕКАДАШІ ДЛЯ КАЛЕНДАРЯ');
  console.log('════════════════════════════════════════════════════════════════');
  console.log('');
  console.log(`Роки: ${startYear} - ${endYear}`);
  console.log(`Локація для розрахунку часів: Київ`);
  console.log('');

  const allEkadashis: EkadashiDate[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const yearEkadashis = findAllEkadashisInYear(year);
    allEkadashis.push(...yearEkadashis);
    console.log(`${year}: знайдено ${yearEkadashis.length} екадаші`);
  }

  console.log('');
  console.log(`Всього екадаші: ${allEkadashis.length}`);
  console.log('');

  // Group by year and month for display
  console.log('════════════════════════════════════════════════════════════════');
  console.log('    СПИСОК ЕКАДАШІ');
  console.log('════════════════════════════════════════════════════════════════');
  console.log('');

  let currentYear = 0;
  for (const eka of allEkadashis) {
    const year = eka.date.getFullYear();
    if (year !== currentYear) {
      currentYear = year;
      console.log(`\n--- ${year} ---`);
    }

    const dateStr = eka.date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: 'short',
      weekday: 'short'
    });
    const pakshaStr = eka.paksha === 'shukla' ? 'Шукла' : 'Крішна';
    console.log(`  ${dateStr} | ${pakshaStr.padEnd(6)} | ${eka.slug}`);
  }

  console.log('');
  console.log('════════════════════════════════════════════════════════════════');
  console.log('    SQL ДЛЯ ВСТАВКИ В БАЗУ');
  console.log('════════════════════════════════════════════════════════════════');
  console.log('');

  // Generate SQL INSERT statements
  console.log('-- Спочатку отримаємо ID екадаші з ekadashi_info');
  console.log('-- Потім вставимо записи в calendar_events');
  console.log('');
  console.log('BEGIN;');
  console.log('');

  for (const eka of allEkadashis.slice(0, 10)) { // Show first 10 as example
    const fasting = calculateEkadashiFastingTimes(eka.date, DEFAULT_LOCATION);
    const sunTimes = calculateSunTimes(eka.date, DEFAULT_LOCATION);

    console.log(`-- ${formatDate(eka.date)} - ${eka.slug}`);
    console.log(`INSERT INTO calendar_events (
  event_date,
  ekadashi_id,
  tithi_number,
  paksha,
  vaishnava_month_id,
  sunrise_time,
  sunset_time,
  parana_start_time,
  parana_end_time
) SELECT
  '${formatDate(eka.date)}',
  id,
  ${eka.tithiInPaksha},
  '${eka.paksha}',
  ${eka.vaishnavMonth},
  '${formatTime(sunTimes.sunrise)}',
  '${formatTime(sunTimes.sunset)}',
  '${fasting.paranaStart.toISOString()}',
  '${fasting.paranaEnd.toISOString()}'
FROM ekadashi_info WHERE slug = '${eka.slug}'
ON CONFLICT DO NOTHING;`);
    console.log('');
  }

  console.log('-- ... (ще ' + (allEkadashis.length - 10) + ' записів)');
  console.log('');
  console.log('COMMIT;');
  console.log('');

  // If we have Supabase credentials, offer to insert directly
  if (SUPABASE_SERVICE_KEY) {
    console.log('════════════════════════════════════════════════════════════════');
    console.log('    ВСТАВКА В БАЗУ ДАНИХ');
    console.log('════════════════════════════════════════════════════════════════');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get ekadashi_info records to map slugs to IDs
    const { data: ekadashiInfos, error: infoError } = await supabase
      .from('ekadashi_info')
      .select('id, slug');

    if (infoError) {
      console.error('Помилка отримання ekadashi_info:', infoError);
      return;
    }

    const slugToId = new Map<string, string>();
    for (const info of ekadashiInfos || []) {
      slugToId.set(info.slug, info.id);
    }

    console.log(`Знайдено ${slugToId.size} записів в ekadashi_info`);

    // Insert calendar events
    let inserted = 0;
    let skipped = 0;

    for (const eka of allEkadashis) {
      const ekadashiId = slugToId.get(eka.slug);
      if (!ekadashiId) {
        console.log(`⚠️  Не знайдено ekadashi_info для: ${eka.slug}`);
        skipped++;
        continue;
      }

      const fasting = calculateEkadashiFastingTimes(eka.date, DEFAULT_LOCATION);
      const sunTimes = calculateSunTimes(eka.date, DEFAULT_LOCATION);

      const { error: insertError } = await supabase
        .from('calendar_events')
        .upsert({
          event_date: formatDate(eka.date),
          ekadashi_id: ekadashiId,
          tithi_number: eka.tithiInPaksha,
          paksha: eka.paksha,
          vaishnava_month_id: eka.vaishnavMonth,
          sunrise_time: formatTime(sunTimes.sunrise),
          sunset_time: formatTime(sunTimes.sunset),
          parana_start_time: fasting.paranaStart.toISOString(),
          parana_end_time: fasting.paranaEnd.toISOString(),
          is_published: true,
        }, {
          onConflict: 'event_date,ekadashi_id,location_id'
        });

      if (insertError) {
        console.error(`Помилка вставки ${formatDate(eka.date)}:`, insertError.message);
      } else {
        inserted++;
      }
    }

    console.log('');
    console.log(`✅ Вставлено: ${inserted}`);
    console.log(`⚠️  Пропущено: ${skipped}`);
  } else {
    console.log('');
    console.log('💡 Для автоматичної вставки в базу встановіть змінні середовища:');
    console.log('   SUPABASE_URL');
    console.log('   SUPABASE_SERVICE_ROLE_KEY');
  }
}

main().catch(console.error);
