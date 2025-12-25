/**
 * Edge Function: vedabase-import
 *
 * Масовий імпорт лекцій та листів з Vedabase.io
 *
 * POST /vedabase-import
 * Body: {
 *   type: "lectures" | "letters",
 *   action: "list" | "import",
 *   limit?: number,
 *   offset?: number,
 *   year?: number (для листів),
 *   slugs?: string[] (для імпорту конкретних)
 * }
 *
 * Responses:
 *   action=list:   { slugs: string[], total: number }
 *   action=import: { imported: number, failed: number, errors: string[] }
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Конфігурація
const VEDABASE_BASE_URL = "https://vedabase.io/en/library";
const DELAY_MS = 1500;
const MAX_BATCH_SIZE = 15; // Обмеження для уникнення timeout

// Supabase клієнт
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Маппінг локацій
const LOCATION_TRANSLATIONS: Record<string, string> = {
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
  "Honolulu": "Гонолулу",
  "Tokyo": "Токіо",
  "Melbourne": "Мельбурн",
  "Sydney": "Сідней",
  "Montreal": "Монреаль",
  "Toronto": "Торонто",
  "Boston": "Бостон",
};

// Утиліти
async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "VedaVoice-Import/1.0 (+https://vedavoice.org)",
        "Accept": "text/html,application/xhtml+xml",
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

function parseDateFromSlug(slug: string): string | null {
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

function detectLectureType(title: string, slug: string): { type: string; bookSlug: string | null } {
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

function parseChapterVerse(title: string): { chapter: number | null; verse: string | null } {
  const match = title.match(/(\d+)\.(\d+(?:-\d+)?)/);
  if (!match) return { chapter: null, verse: null };

  return {
    chapter: parseInt(match[1]),
    verse: match[2],
  };
}

function transliterateTitle(title: string): string {
  const replacements: Record<string, string> = {
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

// Парсер лекції
function parseLecture(html: string, slug: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return null;

  const title = doc.querySelector("h1")?.textContent?.trim() ||
    doc.querySelector("title")?.textContent?.trim() || "";

  if (!title) {
    console.warn(`No title found for ${slug}`);
    return null;
  }

  const lectureDate = parseDateFromSlug(slug);
  if (!lectureDate) {
    console.warn(`Could not parse date from slug: ${slug}`);
    return null;
  }

  let location = "Unknown";
  const slugParts = slug.split("-");
  if (slugParts.length > 1) {
    location = slugParts.slice(1).join(" ").replace(/_/g, " ");
    location = location.split(" ").map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  }

  const { type: lectureType, bookSlug } = detectLectureType(title, slug);
  const { chapter, verse } = parseChapterVerse(title);

  const audioUrl = doc.querySelector("audio source")?.getAttribute("src") ||
    doc.querySelector("audio")?.getAttribute("src") || null;

  // Витягти параграфи
  const paragraphs: Array<{
    paragraph_number: number;
    content_en: string;
    content_ua: string | null;
    audio_timecode: number | null;
  }> = [];

  // Vedabase використовує div з класом "copy" для параграфів
  const mainContent = doc.querySelector("main") || doc.querySelector("body");

  // Шукаємо div елементи з класом "copy" (основний контент Vedabase)
  let paragraphElements = mainContent?.querySelectorAll('div[class*="copy"]');

  // Якщо не знайдено, спробувати <p> теги
  if (!paragraphElements || paragraphElements.length === 0) {
    paragraphElements = mainContent?.querySelectorAll("p") || doc.querySelectorAll("p");
  }

  // Паттерни для пропуску елементів навігації
  const skipPatterns = ["previous", "next", "share", "download", "copyright", "all rights reserved", "vedabase.io"];

  let paragraphNumber = 0;
  paragraphElements?.forEach((el) => {
    const text = el.textContent?.trim() || "";
    if (text && text.length > 10) {
      // Пропустити елементи навігації
      const textLower = text.toLowerCase();
      const shouldSkip = skipPatterns.some(pattern => textLower.includes(pattern));
      if (shouldSkip) return;

      paragraphNumber++;
      paragraphs.push({
        paragraph_number: paragraphNumber,
        content_en: text,
        content_ua: null,
        audio_timecode: null,
      });
    }
  });

  return {
    metadata: {
      slug,
      title_en: title,
      title_ua: transliterateTitle(title),
      lecture_date: lectureDate,
      location_en: location,
      location_ua: LOCATION_TRANSLATIONS[location] || null,
      lecture_type: lectureType,
      audio_url: audioUrl,
      book_slug: bookSlug,
      chapter_number: chapter,
      verse_number: verse,
    },
    paragraphs,
  };
}

// Парсер листа
function parseLetter(html: string, slug: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return null;

  const title = doc.querySelector("h1")?.textContent?.trim() || "";

  const letterDate = parseDateFromSlug(slug);
  if (!letterDate) {
    console.warn(`Could not parse date from slug: ${slug}`);
    return null;
  }

  // Отримувач
  let recipient = slug.replace(/^\d{6}_?/, "").replace(/_/g, " ");
  recipient = recipient.split(" ").map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(" ");

  const titleMatch = title.match(/(?:to|Letter to)\s+(.+?)(?:\s*[-–—]|\s*$)/i);
  if (titleMatch) {
    recipient = titleMatch[1].trim();
  }

  // Локація
  let location = "Unknown";
  const locationMatch = html.match(/(?:from|written in|written at)\s+([A-Za-z\s]+?)(?:[,\.\n])/i);
  if (locationMatch) {
    location = locationMatch[1].trim();
  }

  // Reference
  let reference: string | null = null;
  const refMatch = html.match(/(?:Ref|Reference)[:\s]+([^\n<]+)/i);
  if (refMatch) {
    reference = refMatch[1].trim();
  }

  // Контент - Vedabase використовує div.copy для параграфів
  const mainContent = doc.querySelector("main") || doc.querySelector("body");
  const paragraphs: string[] = [];

  // Паттерни для пропуску
  const skipPatterns = ["previous", "next", "share", "download", "copyright", "vedabase.io"];

  // Шукаємо div елементи з класом "copy"
  let paragraphElements = mainContent?.querySelectorAll('div[class*="copy"]');

  // Якщо не знайдено, спробувати <p> теги
  if (!paragraphElements || paragraphElements.length === 0) {
    paragraphElements = mainContent?.querySelectorAll("p") || doc.querySelectorAll("p");
  }

  paragraphElements?.forEach((el) => {
    const text = el.textContent?.trim() || "";
    if (text && text.length > 5) {
      const textLower = text.toLowerCase();
      const shouldSkip = skipPatterns.some(pattern => textLower.includes(pattern));
      if (!shouldSkip) {
        paragraphs.push(text);
      }
    }
  });

  const content = paragraphs.join("\n\n");

  if (!content) {
    console.warn(`No content found for ${slug}`);
    return null;
  }

  return {
    slug,
    recipient_en: recipient,
    recipient_ua: null,
    letter_date: letterDate,
    location_en: location,
    location_ua: LOCATION_TRANSLATIONS[location] || null,
    reference,
    content_en: content,
    content_ua: null,
  };
}

// Отримати список slug'ів лекцій
async function fetchLectureSlugs(): Promise<string[]> {
  console.log("Fetching lecture slugs from Vedabase...");

  const html = await fetchHtml(`${VEDABASE_BASE_URL}/transcripts/`);
  if (!html) return [];

  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return [];

  const slugs: string[] = [];

  doc.querySelectorAll('a[href*="/transcripts/"]').forEach((node) => {
    const el = node as unknown as Element;
    const href = el.getAttribute("href");
    if (href) {
      const match = href.match(/\/transcripts\/([^/]+)/);
      if (match && match[1]) {
        slugs.push(match[1]);
      }
    }
  });

  return [...new Set(slugs)];
}

// Отримати список slug'ів листів за рік
async function fetchLetterSlugsByYear(year: number): Promise<string[]> {
  console.log(`Fetching letter slugs for year ${year}...`);

  const html = await fetchHtml(`${VEDABASE_BASE_URL}/letters/${year}/`);
  if (!html) return [];

  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return [];

  const slugs: string[] = [];

  doc.querySelectorAll('a[href*="/letters/"]').forEach((node) => {
    const el = node as unknown as Element;
    const href = el.getAttribute("href");
    if (href) {
      const match = href.match(/\/letters\/\d{4}\/([^/]+)/);
      if (match && match[1]) {
        slugs.push(match[1]);
      }
    }
  });

  return [...new Set(slugs)];
}

// Отримати всі доступні роки листів
async function fetchLetterYears(): Promise<number[]> {
  console.log("Fetching available years for letters...");

  const html = await fetchHtml(`${VEDABASE_BASE_URL}/letters/`);
  if (!html) return [];

  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return [];

  const years: number[] = [];

  doc.querySelectorAll('a[href*="/letters/"]').forEach((node) => {
    const el = node as unknown as Element;
    const href = el.getAttribute("href");
    if (href) {
      const match = href.match(/\/letters\/(\d{4})/);
      if (match) {
        years.push(parseInt(match[1]));
      }
    }
  });

  return [...new Set(years)].sort();
}

// Імпортувати лекцію
async function importLecture(slug: string): Promise<{ success: boolean; error?: string }> {
  // Перевірити чи існує
  const { data: existing } = await supabase
    .from("lectures")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return { success: true }; // Already exists
  }

  const html = await fetchHtml(`${VEDABASE_BASE_URL}/transcripts/${slug}/`);
  if (!html) {
    return { success: false, error: "Failed to fetch HTML" };
  }

  const result = parseLecture(html, slug);
  if (!result) {
    return { success: false, error: "Failed to parse lecture" };
  }

  const { metadata, paragraphs } = result;

  const { data: lecture, error: lectureError } = await supabase
    .from("lectures")
    .insert(metadata)
    .select("id")
    .single();

  if (lectureError) {
    return { success: false, error: lectureError.message };
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
      console.error(`Failed to insert paragraphs: ${paragraphsError.message}`);
    }
  }

  return { success: true };
}

// Імпортувати лист
async function importLetter(slug: string, year: number): Promise<{ success: boolean; error?: string }> {
  // Перевірити чи існує
  const { data: existing } = await supabase
    .from("letters")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return { success: true }; // Already exists
  }

  const html = await fetchHtml(`${VEDABASE_BASE_URL}/letters/${year}/${slug}/`);
  if (!html) {
    return { success: false, error: "Failed to fetch HTML" };
  }

  const letterData = parseLetter(html, slug);
  if (!letterData) {
    return { success: false, error: "Failed to parse letter" };
  }

  const { error } = await supabase.from("letters").insert(letterData);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Основний обробник
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { type, action, limit, offset = 0, year, slugs } = body;

    if (!type || !["lectures", "letters"].includes(type)) {
      return new Response(
        JSON.stringify({ error: "Invalid type. Use 'lectures' or 'letters'" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!action || !["list", "import", "years"].includes(action)) {
      return new Response(
        JSON.stringify({ error: "Invalid action. Use 'list', 'import', or 'years'" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Action: years (тільки для листів)
    if (action === "years") {
      const years = await fetchLetterYears();
      return new Response(
        JSON.stringify({ years }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Action: list
    if (action === "list") {
      let allSlugs: string[] = [];

      if (type === "lectures") {
        allSlugs = await fetchLectureSlugs();
      } else {
        if (!year) {
          return new Response(
            JSON.stringify({ error: "Year is required for letters" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        allSlugs = await fetchLetterSlugsByYear(year);
      }

      const total = allSlugs.length;
      const paginated = allSlugs.slice(offset, limit ? offset + limit : undefined);

      return new Response(
        JSON.stringify({ slugs: paginated, total, offset }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Action: import
    if (action === "import") {
      const toImport: Array<{ slug: string; year?: number }> = [];

      if (slugs && Array.isArray(slugs)) {
        // Конкретні slug'и
        for (const s of slugs.slice(0, MAX_BATCH_SIZE)) {
          toImport.push({ slug: s, year });
        }
      } else {
        // Автоматичний список
        let allSlugs: string[] = [];

        if (type === "lectures") {
          allSlugs = await fetchLectureSlugs();
        } else {
          if (!year) {
            return new Response(
              JSON.stringify({ error: "Year is required for letters" }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }
          allSlugs = await fetchLetterSlugsByYear(year);
        }

        const paginated = allSlugs.slice(offset, Math.min(offset + (limit || MAX_BATCH_SIZE), offset + MAX_BATCH_SIZE));
        for (const s of paginated) {
          toImport.push({ slug: s, year });
        }
      }

      console.log(`Importing ${toImport.length} ${type}...`);

      let imported = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const item of toImport) {
        try {
          let result: { success: boolean; error?: string };

          if (type === "lectures") {
            result = await importLecture(item.slug);
          } else {
            result = await importLetter(item.slug, item.year!);
          }

          if (result.success) {
            imported++;
            console.log(`✓ Imported: ${item.slug}`);
          } else {
            failed++;
            errors.push(`${item.slug}: ${result.error}`);
            console.error(`✗ Failed: ${item.slug} - ${result.error}`);
          }
        } catch (error) {
          failed++;
          const errorMsg = error instanceof Error ? error.message : "Unknown error";
          errors.push(`${item.slug}: ${errorMsg}`);
          console.error(`✗ Error: ${item.slug} - ${errorMsg}`);
        }

        await delay(DELAY_MS);
      }

      return new Response(
        JSON.stringify({
          imported,
          failed,
          errors: errors.slice(0, 10), // Перші 10 помилок
          nextOffset: offset + imported + failed,
          hasMore: (slugs ? false : toImport.length === MAX_BATCH_SIZE),
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Unexpected error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
