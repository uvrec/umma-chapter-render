#!/usr/bin/env node
/**
 * Масовий імпорт листів Прабгупади з Vedabase.io
 *
 * Використання:
 *   node scripts/import-letters-vedabase.js
 *
 * Опції:
 *   --limit <number>  - обмежити кількість листів для імпорту
 *   --offset <number> - пропустити перші N листів
 *   --slug <string>   - імпортувати конкретний лист
 *   --dry-run         - тільки показати що буде імпортовано
 *   --year <number>   - імпортувати листи за конкретний рік
 */

import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";

// Конфігурація
const VEDABASE_BASE_URL = "https://vedabase.io/en/library/letters";
const DELAY_MS = 2000;

// Supabase клієнт
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Маппінг локацій
const LOCATION_TRANSLATIONS = {
  "New York": "Нью-Йорк",
  "Los Angeles": "Лос-Анджелес",
  "San Francisco": "Сан-Франциско",
  "London": "Лондон",
  "Bombay": "Бомбей",
  "Vrindavan": "Вріндаван",
  "Mayapur": "Маяпур",
  "Delhi": "Делі",
  "Calcutta": "Калькутта",
  "Tokyo": "Токіо",
  "Montreal": "Монреаль",
  "Boston": "Бостон",
  "Hawaii": "Гаваї",
};

// Утиліти
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Генерувати короткий slug з імені отримувача
function slugifyRecipient(recipient) {
  return recipient
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 30); // Limit length
}

// Згенерувати короткий slug для листа (тільки ім'я-номер)
async function generateShortSlug(recipient) {
  const recipientSlug = slugifyRecipient(recipient);

  // Знайти існуючі slug'и з таким же базовим ім'ям
  const { data: existing } = await supabase
    .from("letters")
    .select("slug")
    .like("slug", `${recipientSlug}%`);

  if (!existing || existing.length === 0) {
    return recipientSlug;
  }

  // Знайти максимальний номер
  let maxNum = 0;
  for (const row of existing) {
    // Якщо slug == recipientSlug, це перший лист
    if (row.slug === recipientSlug) {
      maxNum = Math.max(maxNum, 1);
      continue;
    }
    const match = row.slug.match(/-(\d+)$/);
    if (match) {
      const num = parseInt(match[1]);
      if (num > maxNum) maxNum = num;
    }
  }

  // Якщо є тільки один лист без номера, наступний буде -2
  if (maxNum === 0) {
    return recipientSlug;
  }

  return `${recipientSlug}-${maxNum + 1}`;
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
  const year = parseInt(yy) > 50 ? `19${yy}` : `20${yy}`;

  try {
    const date = new Date(`${year}-${mm}-${dd}`);
    if (isNaN(date.getTime())) return null;
    return `${year}-${mm}-${dd}`;
  } catch {
    return null;
  }
}

function parseRecipientFromSlug(slug) {
  const withoutDate = slug.replace(/^\d{6}_?/, "");
  const cleaned = withoutDate.replace(/_/g, " ");
  return cleaned.split(" ").map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(" ");
}

// Парсер листа
function parseLetter(html, slug) {
  const $ = cheerio.load(html);

  const title = $("h1").first().text().trim();

  const letterDate = parseDateFromSlug(slug);
  if (!letterDate) {
    console.warn(`Could not parse date from slug: ${slug}`);
    return null;
  }

  let recipient = parseRecipientFromSlug(slug);
  const titleMatch = title.match(/(?:to|Letter to)\s+(.+?)(?:\s*[-–—]|\s*$)/i);
  if (titleMatch) {
    recipient = titleMatch[1].trim();
  }

  let location = "Unknown";
  const locationMatch = html.match(/(?:from|written in|written at)\s+([A-Za-z\s]+?)(?:[,\.\n])/i);
  if (locationMatch) {
    location = locationMatch[1].trim();
  }

  let reference = null;
  const refMatch = html.match(/(?:Ref|Reference)[:\s]+([^\n<]+)/i);
  if (refMatch) {
    reference = refMatch[1].trim();
  }

  const contentDiv = $(".r-text, .letter-content, .content, article").first();
  let content = "";

  // Helper to extract HTML preserving bold/italic formatting
  const extractHtmlContent = (element) => {
    // Clone the element to manipulate without affecting original
    const clone = $(element).clone();

    // Convert <em> and <i> to <em> for consistency
    clone.find('i').each((_, el) => {
      $(el).replaceWith(`<em>${$(el).html()}</em>`);
    });

    // Convert <strong> to <strong> (keep as is)
    // Convert <b> to <strong> for consistency
    clone.find('b').each((_, el) => {
      $(el).replaceWith(`<strong>${$(el).html()}</strong>`);
    });

    // Get inner HTML
    let html = clone.html() || '';

    // Clean up extra whitespace but preserve paragraph breaks
    html = html.replace(/\s+/g, ' ').trim();

    return html;
  };

  if (contentDiv.length) {
    // Get paragraphs from content div preserving HTML formatting
    const paragraphs = [];
    contentDiv.find("p, div.copy").each((_, el) => {
      const html = extractHtmlContent(el);
      if (html && html.length > 20) {
        paragraphs.push(`<p>${html}</p>`);
      }
    });

    if (paragraphs.length > 0) {
      content = paragraphs.join("\n");
    } else {
      // Fallback: get all HTML content
      content = extractHtmlContent(contentDiv);
    }
  } else {
    const paragraphs = [];
    $("p").each((_, el) => {
      const html = extractHtmlContent(el);
      if (html && html.length > 20) {
        paragraphs.push(`<p>${html}</p>`);
      }
    });
    content = paragraphs.join("\n");
  }

  if (!content) {
    console.warn(`No content found for ${slug}`);
    return null;
  }

  return {
    slug,
    recipient_en: recipient,
    recipient_uk: null,
    letter_date: letterDate,
    location_en: location,
    location_uk: LOCATION_TRANSLATIONS[location] || null,
    reference,
    content_en: content,
    content_uk: null,
  };
}

// Отримати slug'и за рік
async function fetchLetterSlugsByYear(year) {
  console.log(`Fetching letters for year ${year}...`);

  const html = await fetchHtml(`${VEDABASE_BASE_URL}/${year}/`);
  if (!html) {
    console.error(`Failed to fetch letters for year ${year}`);
    return [];
  }

  const $ = cheerio.load(html);
  const slugs = [];

  $('a[href*="/letters/"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      const match = href.match(/\/letters\/\d{4}\/([^/]+)/);
      if (match && match[1]) {
        slugs.push(match[1]);
      }
    }
  });

  return [...new Set(slugs)];
}

// Отримати всі роки
async function fetchAvailableYears() {
  console.log("Fetching available years...");

  const html = await fetchHtml(`${VEDABASE_BASE_URL}/`);
  if (!html) {
    console.error("Failed to fetch letters main page");
    return [];
  }

  const $ = cheerio.load(html);
  const years = [];

  $('a[href*="/letters/"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      const match = href.match(/\/letters\/(\d{4})/);
      if (match) {
        years.push(parseInt(match[1]));
      }
    }
  });

  return [...new Set(years)].sort();
}

// Імпортувати один лист
async function importLetter(vedabaseSlug, year, dryRun = false) {
  console.log(`  Processing: ${vedabaseSlug}`);

  const html = await fetchHtml(`${VEDABASE_BASE_URL}/${year}/${vedabaseSlug}/`);
  if (!html) {
    console.error(`    Failed to fetch`);
    return false;
  }

  const metadata = parseLetter(html, vedabaseSlug);
  if (!metadata) {
    console.error(`    Failed to parse`);
    return false;
  }

  // Перевірити чи вже існує лист з такою ж датою і отримувачем
  const { data: existing } = await supabase
    .from("letters")
    .select("id, slug")
    .eq("letter_date", metadata.letter_date)
    .eq("recipient_en", metadata.recipient_en)
    .single();

  if (existing) {
    console.log(`    Skipping (already exists: ${existing.slug})`);
    return true;
  }

  // Згенерувати короткий slug
  const shortSlug = await generateShortSlug(metadata.recipient_en);
  metadata.slug = shortSlug;

  if (dryRun) {
    console.log(`    [DRY RUN] Would import letter to: ${metadata.recipient_en}`);
    console.log(`      Slug: ${shortSlug}`);
    console.log(`      Date: ${metadata.letter_date}`);
    console.log(`      Location: ${metadata.location_en}`);
    console.log(`      Content length: ${metadata.content_en.length} chars`);
    return true;
  }

  const { error } = await supabase.from("letters").insert(metadata);

  if (error) {
    console.error(`    Failed to insert: ${error.message}`);
    return false;
  }

  console.log(`    ✓ Imported: ${shortSlug} (${metadata.recipient_en})`);
  return true;
}

// Головна функція
async function main() {
  const args = process.argv.slice(2);

  const limitIndex = args.indexOf("--limit");
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined;

  const offsetIndex = args.indexOf("--offset");
  const offset = offsetIndex !== -1 ? parseInt(args[offsetIndex + 1]) : 0;

  const yearIndex = args.indexOf("--year");
  const specificYear = yearIndex !== -1 ? parseInt(args[yearIndex + 1]) : undefined;

  const slugIndex = args.indexOf("--slug");
  const singleSlug = slugIndex !== -1 ? args[slugIndex + 1] : undefined;

  const dryRun = args.includes("--dry-run");

  console.log("=== Vedabase Letters Importer ===");
  console.log(`Dry run: ${dryRun}`);
  if (limit) console.log(`Limit: ${limit}`);
  if (offset) console.log(`Offset: ${offset}`);
  if (specificYear) console.log(`Year: ${specificYear}`);
  if (singleSlug) console.log(`Single slug: ${singleSlug}`);

  let successCount = 0;
  let failCount = 0;
  let totalProcessed = 0;

  if (singleSlug && specificYear) {
    const success = await importLetter(singleSlug, specificYear, dryRun);
    if (success) successCount++;
    else failCount++;
    totalProcessed = 1;
  } else {
    const years = specificYear ? [specificYear] : await fetchAvailableYears();
    console.log(`\nYears to process: ${years.join(", ")}`);

    for (const year of years) {
      console.log(`\n=== Year ${year} ===`);

      const slugs = await fetchLetterSlugsByYear(year);
      console.log(`Found ${slugs.length} letters for ${year}`);

      let toProcess = slugs;
      if (offset > totalProcessed) {
        const skip = offset - totalProcessed;
        toProcess = slugs.slice(skip);
      }
      if (limit && successCount + failCount >= limit) {
        break;
      }
      if (limit) {
        const remaining = limit - successCount - failCount;
        toProcess = toProcess.slice(0, remaining);
      }

      for (const slug of toProcess) {
        try {
          const success = await importLetter(slug, year, dryRun);
          if (success) successCount++;
          else failCount++;
        } catch (error) {
          console.error(`Error processing ${slug}:`, error);
          failCount++;
        }

        totalProcessed++;
        await delay(DELAY_MS);

        if (limit && successCount + failCount >= limit) {
          break;
        }
      }
    }
  }

  console.log("\n=== Import Complete ===");
  console.log(`Total processed: ${totalProcessed}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

main().catch(console.error);
