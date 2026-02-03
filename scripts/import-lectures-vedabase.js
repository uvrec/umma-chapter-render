#!/usr/bin/env node
/**
 * Масовий імпорт лекцій з Vedabase.io
 *
 * Використання:
 *   node scripts/import-lectures-vedabase.js
 *
 * Опції:
 *   --limit <number>  - обмежити кількість лекцій для імпорту
 *   --offset <number> - пропустити перші N лекцій
 *   --slug <string>   - імпортувати конкретну лекцію
 *   --dry-run         - тільки показати що буде імпортовано
 */

import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";

// Конфігурація
const VEDABASE_BASE_URL = "https://vedabase.io/en/library/transcripts";
const DELAY_MS = 2000;

// Supabase клієнт
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Маппінг типів лекцій для української мови
const LECTURE_TYPE_TRANSLATIONS = {
  "Conversation": "Розмова",
  "Walk": "Прогулянка",
  "Morning Walk": "Ранкова прогулянка",
  "Lecture": "Лекція",
  "Bhagavad-gita": "Лекція з Бгаґавад-ґіти",
  "Srimad-Bhagavatam": "Лекція з Шрімад-Бгаґаватам",
  "Nectar of Devotion": "Лекція з Нектару відданості",
  "Sri Isopanisad": "Лекція з Шрі Ішопанішад",
  "Sri Caitanya-caritamrta": "Лекція з Шрі Чайтанья-чарітамріта",
  "Initiation": "Ініціація",
  "Room Conversation": "Розмова в кімнаті",
  "Interview": "Інтерв'ю",
  "Arrival": "Прибуття",
  "Departure": "Від'їзд",
  "Festival": "Фестиваль",
  "Bhajan": "Бгаджан",
  "Kirtan": "Кіртан",
  "Other": "Інше",
};

// Маппінг міст
const LOCATION_TRANSLATIONS = {
  "New York": "Нью-Йорк",
  "Los Angeles": "Лос-Анджелес",
  "San Francisco": "Сан-Франциско",
  "London": "Лондон",
  "Paris": "Париж",
  "Bombay": "Бомбей",
  "Mumbai": "Мумбаї",
  "Calcutta": "Калькутта",
  "Vrindavan": "Вріндаван",
  "Mayapur": "Маяпур",
  "Delhi": "Делі",
  "New Delhi": "Нью-Делі",
  "Honolulu": "Гонолулу",
  "Tokyo": "Токіо",
  "Melbourne": "Мельбурн",
  "Sydney": "Сідней",
  "Montreal": "Монреаль",
  "Toronto": "Торонто",
  "Boston": "Бостон",
  "Chicago": "Чикаго",
  "Detroit": "Детройт",
  "Seattle": "Сіетл",
  "Dallas": "Даллас",
  "Atlanta": "Атланта",
  "Hawaii": "Гаваї",
  "Berlin": "Берлін",
  "Hyderabad": "Гайдерабад",
  "Madras": "Мадрас",
  "Chennai": "Ченнаї",
  "Bangalore": "Бангалор",
  "Nairobi": "Найробі",
  "Johannesburg": "Йоганнесбург",
  "Tehran": "Тегеран",
  "Mexico City": "Мехіко",
  "Caracas": "Каракас",
  "Buenos Aires": "Буенос-Айрес",
};

// Утиліти
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHtml(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "VedaVoice-Importer/1.0 (+https://vedavoice.org)",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

function parseDateFromSlug(slug) {
  const match = slug.match(/^(\d{2})(\d{2})(\d{2})/);
  if (!match) return null;

  const [, yy, mm, dd] = match;
  // Прабгупада жив 1896-1977, всі лекції - це 19xx роки
  const year = `19${yy}`;

  try {
    const date = new Date(`${year}-${mm}-${dd}`);
    if (isNaN(date.getTime())) return null;
    return `${year}-${mm}-${dd}`;
  } catch {
    return null;
  }
}

function detectLectureType(title, slug) {
  const titleLower = title.toLowerCase();
  const slugLower = slug.toLowerCase();

  if (titleLower.includes("bhagavad") || titleLower.includes("gita") || slugLower.includes("bg")) {
    return { type: "Bhagavad-gita", bookSlug: "bg" };
  }
  if (titleLower.includes("bhagavatam") || slugLower.includes("sb")) {
    return { type: "Srimad-Bhagavatam", bookSlug: "sb" };
  }
  if (titleLower.includes("caitanya") || slugLower.includes("cc")) {
    return { type: "Sri Caitanya-caritamrta", bookSlug: "cc" };
  }
  if (titleLower.includes("isopanisad") || slugLower.includes("iso")) {
    return { type: "Sri Isopanisad", bookSlug: "iso" };
  }
  if (titleLower.includes("walk") || slugLower.includes("walk")) {
    return { type: "Morning Walk", bookSlug: null };
  }
  if (titleLower.includes("conversation") || slugLower.includes("conv")) {
    return { type: "Conversation", bookSlug: null };
  }
  if (titleLower.includes("initiation")) {
    return { type: "Initiation", bookSlug: null };
  }

  return { type: "Lecture", bookSlug: null };
}

function parseChapterVerse(title) {
  const match = title.match(/(\d+)\.(\d+(?:-\d+)?)/);
  if (!match) return { chapter: null, verse: null };

  return {
    chapter: parseInt(match[1]),
    verse: match[2],
  };
}

function transliterateTitle(title) {
  const replacements = {
    "Bhagavad-gita": "Бгаґавад-ґіта",
    "Bhagavad-gītā": "Бгаґавад-ґіта",
    "Srimad-Bhagavatam": "Шрімад-Бгаґаватам",
    "Śrīmad-Bhāgavatam": "Шрімад-Бгаґаватам",
    "Caitanya-caritamrta": "Чайтанья-чарітамріта",
    "Introduction": "Вступ",
    "Lecture": "Лекція",
  };

  let result = title;
  for (const [en, ua] of Object.entries(replacements)) {
    result = result.replace(new RegExp(en, "gi"), ua);
  }
  return result;
}

// Витягти локацію з HTML
function extractLocation(html, slug) {
  // Спосіб 1: JSON embedded data - "location":"City Name"
  const jsonMatch = html.match(/"location":"([^"]+)"/);
  if (jsonMatch && jsonMatch[1] && jsonMatch[1] !== "Location…") {
    return jsonMatch[1];
  }

  // Спосіб 2: URL параметр - ?location=City+Name або location=City+Name
  const urlMatch = html.match(/location=([A-Za-z+%]+)/);
  if (urlMatch && urlMatch[1]) {
    return decodeURIComponent(urlMatch[1].replace(/\+/g, " "));
  }

  // Спосіб 3: Код міста в slug - останні 2-3 літери
  // Формат slug: YYMMDD + TYPE + LOCATION_CODE (напр. 681231pula = PU + LA)
  const slugLocationCodes = {
    "la": "Los Angeles",
    "ny": "New York",
    "sf": "San Francisco",
    "lon": "London",
    "bom": "Bombay",
    "vrn": "Vrindavan",
    "may": "Mayapur",
    "del": "Delhi",
    "cal": "Calcutta",
    "hon": "Honolulu",
    "tok": "Tokyo",
    "mel": "Melbourne",
    "syd": "Sydney",
    "mon": "Montreal",
    "tor": "Toronto",
    "bos": "Boston",
    "chi": "Chicago",
    "det": "Detroit",
    "sea": "Seattle",
    "dal": "Dallas",
    "atl": "Atlanta",
    "par": "Paris",
    "ber": "Berlin",
    "hyd": "Hyderabad",
    "mad": "Madras",
    "ban": "Bangalore",
    "nai": "Nairobi",
  };

  // Спробувати витягти код міста з slug (останні 2-3 символи після дати+типу)
  const slugLower = slug.toLowerCase();
  for (const [code, city] of Object.entries(slugLocationCodes)) {
    if (slugLower.endsWith(code)) {
      return city;
    }
  }

  return "Unknown";
}

// Парсер лекції
function parseLecture(html, slug) {
  const $ = cheerio.load(html);

  const title = $("h1").first().text().trim() || $("title").text().trim();
  if (!title) {
    console.warn(`No title found for ${slug}`);
    return null;
  }

  const lectureDate = parseDateFromSlug(slug);
  if (!lectureDate) {
    console.warn(`Could not parse date from slug: ${slug}`);
    return null;
  }

  // Використовуємо нову функцію для витягування локації
  const location = extractLocation(html, slug);

  const { type: lectureType, bookSlug } = detectLectureType(title, slug);
  const { chapter, verse } = parseChapterVerse(title);
  const audioUrl = $("audio source").attr("src") || $("audio").attr("src") || null;

  const paragraphs = [];
  const contentDiv = $(".r-text, .content, article, main").first();
  const paragraphElements = contentDiv.length ? contentDiv.find("p") : $("p");

  let paragraphNumber = 1;
  paragraphElements.each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 10) {
      paragraphs.push({
        paragraph_number: paragraphNumber++,
        content_en: text,
        content_uk: null,
        audio_timecode: null,
      });
    }
  });

  const metadata = {
    slug,
    title_en: title,
    title_uk: transliterateTitle(title),
    lecture_date: lectureDate,
    location_en: location,
    location_uk: LOCATION_TRANSLATIONS[location] || null,
    lecture_type: lectureType,
    audio_url: audioUrl,
    book_slug: bookSlug,
    chapter_number: chapter,
    verse_number: verse,
  };

  return { metadata, paragraphs };
}

// Отримати список slug'ів
async function fetchLectureSlugs() {
  console.log("Fetching lecture list from Vedabase...");

  const html = await fetchHtml(`${VEDABASE_BASE_URL}/`);
  if (!html) {
    console.error("Failed to fetch lecture list");
    return [];
  }

  const $ = cheerio.load(html);
  const slugs = [];

  $('a[href*="/transcripts/"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      const match = href.match(/\/transcripts\/([^/]+)/);
      if (match && match[1]) {
        slugs.push(match[1]);
      }
    }
  });

  return [...new Set(slugs)];
}

// Імпортувати одну лекцію
async function importLecture(slug, dryRun = false) {
  console.log(`\nProcessing: ${slug}`);

  const { data: existing } = await supabase
    .from("lectures")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    console.log(`  Skipping (already exists): ${slug}`);
    return true;
  }

  const html = await fetchHtml(`${VEDABASE_BASE_URL}/${slug}/`);
  if (!html) {
    console.error(`  Failed to fetch: ${slug}`);
    return false;
  }

  const result = parseLecture(html, slug);
  if (!result) {
    console.error(`  Failed to parse: ${slug}`);
    return false;
  }

  const { metadata, paragraphs } = result;

  if (dryRun) {
    console.log(`  [DRY RUN] Would import: ${metadata.title_en}`);
    console.log(`    Date: ${metadata.lecture_date}`);
    console.log(`    Location: ${metadata.location_en}`);
    console.log(`    Type: ${metadata.lecture_type}`);
    console.log(`    Paragraphs: ${paragraphs.length}`);
    return true;
  }

  const { data: lecture, error: lectureError } = await supabase
    .from("lectures")
    .insert(metadata)
    .select("id")
    .single();

  if (lectureError) {
    console.error(`  Failed to insert lecture: ${lectureError.message}`);
    return false;
  }

  if (paragraphs.length > 0 && lecture) {
    const paragraphsWithLectureId = paragraphs.map((p) => ({
      ...p,
      lecture_id: lecture.id,
    }));

    const { error: paragraphsError } = await supabase
      .from("lecture_paragraphs")
      .insert(paragraphsWithLectureId);

    if (paragraphsError) {
      console.error(`  Failed to insert paragraphs: ${paragraphsError.message}`);
    }
  }

  console.log(`  ✓ Imported: ${metadata.title_en} (${paragraphs.length} paragraphs)`);
  return true;
}

// Головна функція
async function main() {
  const args = process.argv.slice(2);

  const limitIndex = args.indexOf("--limit");
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined;

  const offsetIndex = args.indexOf("--offset");
  const offset = offsetIndex !== -1 ? parseInt(args[offsetIndex + 1]) : 0;

  const slugIndex = args.indexOf("--slug");
  const singleSlug = slugIndex !== -1 ? args[slugIndex + 1] : undefined;

  const dryRun = args.includes("--dry-run");

  console.log("=== Vedabase Lectures Importer ===");
  console.log(`Dry run: ${dryRun}`);
  if (limit) console.log(`Limit: ${limit}`);
  if (offset) console.log(`Offset: ${offset}`);
  if (singleSlug) console.log(`Single slug: ${singleSlug}`);

  let slugs;

  if (singleSlug) {
    slugs = [singleSlug];
  } else {
    slugs = await fetchLectureSlugs();
    console.log(`Found ${slugs.length} lectures`);
    slugs = slugs.slice(offset, limit ? offset + limit : undefined);
  }

  console.log(`\nProcessing ${slugs.length} lectures...\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];

    try {
      const success = await importLecture(slug, dryRun);
      if (success) successCount++;
      else failCount++;
    } catch (error) {
      console.error(`Error processing ${slug}:`, error);
      failCount++;
    }

    if (i < slugs.length - 1) {
      await delay(DELAY_MS);
    }

    if ((i + 1) % 10 === 0) {
      console.log(`\n--- Progress: ${i + 1}/${slugs.length} (${successCount} success, ${failCount} failed) ---\n`);
    }
  }

  console.log("\n=== Import Complete ===");
  console.log(`Total: ${slugs.length}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

main().catch(console.error);
