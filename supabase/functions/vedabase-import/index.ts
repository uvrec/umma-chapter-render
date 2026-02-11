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

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Конфігурація
const VEDABASE_BASE_URL = "https://vedabase.io/en/library";
const DELAY_MS = 1500;
const MAX_BATCH_SIZE = 15; // Обмеження для уникнення timeout

// Supabase клієнт (service role for data operations)
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Validate admin authentication
 */
async function validateAdminAuth(req: Request): Promise<{ isAdmin: boolean; userId: string } | Response> {
  const authHeader = req.headers.get("Authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Missing Authorization header" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await authClient.auth.getClaims(token);
  
  if (error || !data?.claims?.sub) {
    console.error("[vedabase-import] Auth error:", error?.message);
    return new Response(
      JSON.stringify({ error: "Unauthorized: Invalid token" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const userId = data.claims.sub as string;

  // Check admin role
  const { data: roleData, error: roleError } = await authClient
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();

  if (roleError || !roleData) {
    console.warn(`[vedabase-import] Non-admin user attempted access: ${userId}`);
    return new Response(
      JSON.stringify({ error: "Forbidden: Admin access required" }),
      { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  console.log(`[vedabase-import] Admin access granted: ${userId}`);
  return { isAdmin: true, userId };
}

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
    content_uk: string | null;
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
        content_uk: null,
        audio_timecode: null,
      });
    }
  });

  return {
    metadata: {
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
    },
    paragraphs,
  };
}

// Допоміжний маппінг місяців
const MONTH_MAP: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04",
  may: "05", june: "06", july: "07", august: "08",
  september: "09", october: "10", november: "11", december: "12"
};

/**
 * Парсить дату з тексту типу "February 4th 1968", "4 February 1968", "January 1, 1968"
 */
function parseDateFromText(text: string): string | null {
  const patterns = [
    // "February 4th 1968" або "February 4, 1968"
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/i,
    // "4th February 1968" або "4 February 1968"
    /(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December),?\s+(\d{4})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;

    let monthName: string, day: string, year: string;
    if (/^\d/.test(match[1])) {
      day = match[1]; monthName = match[2]; year = match[3];
    } else {
      monthName = match[1]; day = match[2]; year = match[3];
    }

    const month = MONTH_MAP[monthName.toLowerCase()];
    if (month) return `${year}-${month}-${day.padStart(2, "0")}`;
  }
  return null;
}

// Парсер листа
function parseLetter(html: string, slug: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return null;

  const title = doc.querySelector("h1")?.textContent?.trim() || "";

  // --- 1. Витягнути метадані зі структурованого блоку Vedabase (div.mb-9) ---
  // Формат: <span class="inline-block w-32">Dated:</span> <a ...>February 4th 1968</a>
  let letterDate: string | null = null;
  let location = "";
  let recipient = "";

  const metaContainer = doc.querySelector(".mb-9");
  if (metaContainer) {
    metaContainer.querySelectorAll("div").forEach((node) => {
      const el = node as unknown as Element;
      const text = el.textContent?.trim() || "";
      const link = el.querySelector("a") as unknown as Element | null;
      const linkText = link?.textContent?.trim() || "";

      if (text.startsWith("Dated:") && linkText) {
        letterDate = parseDateFromText(linkText);
      } else if (text.startsWith("Location:") && linkText) {
        location = linkText;
      } else if (text.startsWith("Letter to:") && linkText) {
        recipient = linkText;
      }
    });
  }

  // --- 2. Фолбеки для дати ---
  if (!letterDate) {
    letterDate = parseDateFromSlug(slug);
  }
  if (!letterDate) {
    // Шукати дату в HTML (з підтримкою ordinals: 4th, 1st, 2nd, 3rd)
    const dateMatch = html.match(
      /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}/i
    );
    if (dateMatch) {
      letterDate = parseDateFromText(dateMatch[0]);
    }
  }
  if (!letterDate) {
    // Формат "68-01-01" в контенті
    const shortMatch = html.match(/(\d{2})-(\d{2})-(\d{2})/);
    if (shortMatch) {
      const [, yy, mm, dd] = shortMatch;
      const year = parseInt(yy) > 50 ? `19${yy}` : `20${yy}`;
      letterDate = `${year}-${mm}-${dd}`;
    }
  }
  if (!letterDate) {
    console.warn(`Could not parse date for letter: ${slug}, using placeholder`);
    letterDate = "1900-01-01";
  }

  // --- 3. Фолбеки для отримувача ---
  if (!recipient) {
    // Витягнути з H1: "Letter to: Hansadutta" → "Hansadutta"
    recipient = title.replace(/^Letter\s+to:?\s*/i, "").trim();
  }
  if (!recipient) {
    // Витягнути з slug: "letter-to-hansadutta-5" → "Hansadutta"
    let slugRecipient = slug.replace(/^\d{6}_?/, "");
    slugRecipient = slugRecipient.replace(/^letter-to-/i, "");
    slugRecipient = slugRecipient.replace(/-\d+$/, ""); // Видалити trailing number (-5)
    slugRecipient = slugRecipient.replace(/[-_]/g, " ");
    recipient = slugRecipient.split(" ").map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(" ");
  }

  // --- 4. Фолбек для локації ---
  if (!location) {
    const locationMatch = html.match(/(?:from|written in|written at)\s+([A-Za-z\s]+?)(?:[,\.\n])/i);
    if (locationMatch) {
      location = locationMatch[1].trim();
    }
  }
  if (!location) {
    location = "Unknown";
  }

  // --- 5. Reference ---
  let reference: string | null = null;
  const refMatch = html.match(/(?:Ref|Reference)[:\s]+([^\n<]+)/i);
  if (refMatch) {
    reference = refMatch[1].trim();
  }

  // --- 6. Контент: витягнути параграфи як HTML з <p> тегами ---
  const paragraphs: string[] = [];
  const skipPatterns = ["previous", "next", "share", "download", "copyright", "vedabase.io"];

  // Vedabase: кожен параграф — div з класом "copy" та вкладеним div з текстом
  const mainContent = doc.querySelector("main") || doc.querySelector("body");
  let paragraphElements = mainContent?.querySelectorAll('div[class*="copy"]');

  if (!paragraphElements || paragraphElements.length === 0) {
    paragraphElements = mainContent?.querySelectorAll("p") || doc.querySelectorAll("p");
  }

  paragraphElements?.forEach((node) => {
    const el = node as unknown as Element;
    const text = el.textContent?.trim() || "";
    if (!text || text.length < 3) return;

    const textLower = text.toLowerCase();
    if (skipPatterns.some(p => textLower.includes(p))) return;

    // Пропустити H1 заголовок всередині copy div
    if (el.querySelector("h1")) return;

    // Пропустити рядок з кодом дати: "68-02-04"
    if (/^\d{2}-\d{2}-\d{2}$/.test(text)) return;

    // Отримати innerHTML внутрішнього div (зберігає <br>, <em>, <strong>)
    const innerDiv = el.querySelector("div") as unknown as Element | null;
    const innerHtml = (innerDiv?.innerHTML || el.innerHTML || text).trim();

    // Визначити підпис листа: "Your ever well-wisher,<br>..."
    const isSignature = /^Your\s+(ever\s+)?well[- ]?wisher/i.test(text) ||
      /^Your\s+humble\s+servant/i.test(text) ||
      /^Yours\s+(sincerely|faithfully|in\s+)/i.test(text) ||
      /^A\.?\s*C\.?\s*Bhaktivedanta/i.test(text);

    if (isSignature) {
      // Підпис: italic, <br> для щільних рядків (без відступів між ними)
      paragraphs.push(`<p class="letter-signature"><em>${innerHtml}</em></p>`);
    } else {
      paragraphs.push(`<p>${innerHtml}</p>`);
    }
  });

  const content = paragraphs.join("\n");

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
async function importLetter(slug: string, _year?: number): Promise<{ success: boolean; error?: string }> {
  // Перевірити чи існує
  const { data: existing } = await supabase
    .from("letters")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return { success: true }; // Already exists
  }

  // URL без року - Vedabase використовує прямий шлях до листа
  const html = await fetchHtml(`${VEDABASE_BASE_URL}/letters/${slug}/`);
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

  // Validate admin authentication (CRITICAL - this is an admin-only operation)
  const authResult = await validateAdminAuth(req);
  if (authResult instanceof Response) {
    return authResult;
  }

  const { userId } = authResult;

  try {
    const body = await req.json().catch(() => ({}));
    const { type, action, limit, offset = 0, year, slugs } = body;

    console.log(`[vedabase-import] Admin ${userId} requested: ${type}/${action}`);

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
