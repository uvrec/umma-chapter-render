/**
 * Prabhupadavani Parser - Transcendental Diary
 *
 * Парсить книгу "Transcendental Diary" by Hari Sauri dasa з сайту prabhupadavani.org
 *
 * Структура книги:
 * - 5 томів (Volume 1-5), кожен том - це canto в нашій БД
 * - Кожен том має глави (chapter_type: "text")
 * - Тільки англійська версія (українська - в майбутньому)
 *
 * Джерело: https://prabhupadavani.org/bio/transcendental-diary/
 */

// ============= TYPES =============

export interface TDChapter {
  chapter_number: number;
  title_en: string;
  content_en: string;
  dates?: string;
}

export interface TDVolume {
  volume_number: number;
  title_en: string;
  subtitle_en?: string;
  chapters: TDChapter[];
}

export interface TDIntroPage {
  slug: string;
  title_en: string;
  content_en: string;
  display_order: number;
}

// ============= CONFIGURATION =============

export const TD_CONFIG = {
  baseUrl: "https://prabhupadavani.org/bio/transcendental-diary",
  volumes: [
    {
      number: 1,
      title: "Volume 1",
      subtitle: "November 1975 – April 1976",
      chaptersCount: 12,
      introPages: ["dedication", "acknowledgments", "introduction", "foreword", "preface"],
    },
    {
      number: 2,
      title: "Volume 2",
      subtitle: "April 1976 – June 1976",
      chaptersCount: 6,
    },
    {
      number: 3,
      title: "Volume 3",
      subtitle: "June 1976 – August 1976",
      chaptersCount: 6,
    },
    {
      number: 4,
      title: "Volume 4",
      subtitle: "August 1976 – October 1976",
      chaptersCount: 6,
    },
    {
      number: 5,
      title: "Volume 5",
      subtitle: "October 1976 – November 1977",
      chaptersCount: 8,
    },
  ],
} as const;

// ============= UTILITIES =============

const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12,
};

function numberToWord(num: number): string {
  const words = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
  return words[num] || String(num);
}

// ============= PARSERS =============

/**
 * Парсить сторінку глави Transcendental Diary
 * @param html - HTML сторінки
 * @param chapterNum - Номер глави (для fallback)
 */
export function parseTDChapterPage(html: string, chapterNum: number = 1): TDChapter | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Extract title from h1 or .entry-title
    let title =
      doc.querySelector("h1.entry-title")?.textContent?.trim() ||
      doc.querySelector("h1")?.textContent?.trim() ||
      `Chapter ${chapterNum}`;

    // Clean up title - remove "Chapter X:" prefix if present
    title = title.replace(/^Chapter\s+\w+\s*[:–-]\s*/i, "").trim();

    // Try to extract chapter number from title or content
    const titleMatch = title.match(/^Chapter\s+(\w+)/i);
    if (titleMatch) {
      const numWord = titleMatch[1].toLowerCase();
      if (NUMBER_WORDS[numWord]) {
        chapterNum = NUMBER_WORDS[numWord];
      } else if (/^\d+$/.test(numWord)) {
        chapterNum = parseInt(numWord, 10);
      }
    }

    // Extract main content
    const contentEl =
      doc.querySelector(".entry-content") ||
      doc.querySelector("article .content") ||
      doc.querySelector(".post-content") ||
      doc.querySelector("main article");

    if (!contentEl) {
      console.warn(`⚠️ [TD Parser] No content area found for chapter ${chapterNum}`);
      return null;
    }

    // Remove navigation elements, ads, related posts
    contentEl.querySelectorAll(
      "nav, .navigation, .post-navigation, .related-posts, .sharedaddy, .jp-relatedposts, script, style, .social-share"
    ).forEach((el) => el.remove());

    // Process content to clean HTML
    const contentParts: string[] = [];
    const dates: string[] = [];

    contentEl.querySelectorAll("p, h2, h3, h4, blockquote, ul, ol").forEach((el) => {
      const tagName = el.tagName?.toLowerCase() || "p";
      const text = el.textContent?.trim() || "";

      // Skip empty elements
      if (!text) return;

      // Skip navigation text
      if (/^(Previous|Next|←|→|Chapter\s+\d+$)/i.test(text)) return;

      // Extract dates from content (e.g., "May 3rd, 1976")
      const dateMatch = text.match(
        /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}/gi
      );
      if (dateMatch) {
        dates.push(...dateMatch);
      }

      // Get innerHTML and clean it
      let innerHtml = el.innerHTML || "";

      // Preserve emphasis (em, i, strong, b)
      innerHtml = innerHtml
        .replace(/<em>/gi, "<em>")
        .replace(/<\/em>/gi, "</em>")
        .replace(/<i>/gi, "<em>")
        .replace(/<\/i>/gi, "</em>")
        .replace(/<strong>/gi, "<strong>")
        .replace(/<\/strong>/gi, "</strong>")
        .replace(/<b>/gi, "<strong>")
        .replace(/<\/b>/gi, "</strong>");

      // Remove unwanted tags but keep content
      innerHtml = innerHtml.replace(/<\/?(?:span|div|a)[^>]*>/gi, "");

      // Clean multiple spaces and newlines
      innerHtml = innerHtml.replace(/\s+/g, " ").trim();

      // Wrap in appropriate HTML tag
      if (tagName === "h2" || tagName === "h3" || tagName === "h4") {
        contentParts.push(`<${tagName}>${innerHtml}</${tagName}>`);
      } else if (tagName === "blockquote") {
        contentParts.push(`<blockquote><p>${innerHtml}</p></blockquote>`);
      } else if (tagName === "ul" || tagName === "ol") {
        const listItems = Array.from(el.querySelectorAll("li"))
          .map((li) => li.textContent?.trim() || "")
          .filter(Boolean);
        const listHtml = listItems.map((item) => `<li>${item}</li>`).join("");
        contentParts.push(`<${tagName}>${listHtml}</${tagName}>`);
      } else {
        contentParts.push(`<p>${innerHtml}</p>`);
      }
    });

    const content = contentParts.join("\n\n");

    if (!content || content.length < 100) {
      console.warn(`⚠️ [TD Parser] Content too short for chapter ${chapterNum}`);
      return null;
    }

    console.log(`✅ [TD Parser] Chapter ${chapterNum}: "${title}" (${content.length} chars)`);

    return {
      chapter_number: chapterNum,
      title_en: title || `Chapter ${chapterNum}`,
      content_en: content,
      dates: dates.length > 0 ? dates.join(", ") : undefined,
    };
  } catch (error) {
    console.error(`❌ [TD Parser] Error parsing chapter ${chapterNum}:`, error);
    return null;
  }
}

/**
 * Парсить intro сторінку (dedication, foreword, тощо)
 */
export function parseTDIntroPage(html: string, slug: string, displayOrder: number): TDIntroPage | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Extract title
    const title =
      doc.querySelector("h1.entry-title")?.textContent?.trim() ||
      doc.querySelector("h1")?.textContent?.trim() ||
      slug.charAt(0).toUpperCase() + slug.slice(1);

    // Extract content
    const contentEl =
      doc.querySelector(".entry-content") ||
      doc.querySelector("article .content") ||
      doc.querySelector(".post-content");

    if (!contentEl) {
      return null;
    }

    // Remove navigation
    contentEl.querySelectorAll("nav, .navigation, script, style").forEach((el) => el.remove());

    const contentParts: string[] = [];

    contentEl.querySelectorAll("p, h2, h3, blockquote").forEach((el) => {
      const tagName = el.tagName?.toLowerCase() || "p";
      let innerHtml = el.innerHTML || "";

      // Clean HTML
      innerHtml = innerHtml.replace(/\s+/g, " ").trim();

      if (innerHtml) {
        if (tagName === "h2" || tagName === "h3") {
          contentParts.push(`<${tagName}>${innerHtml}</${tagName}>`);
        } else if (tagName === "blockquote") {
          contentParts.push(`<blockquote><p>${innerHtml}</p></blockquote>`);
        } else {
          contentParts.push(`<p>${innerHtml}</p>`);
        }
      }
    });

    return {
      slug,
      title_en: title,
      content_en: contentParts.join("\n\n"),
      display_order: displayOrder,
    };
  } catch (error) {
    console.error(`❌ [TD Parser] Error parsing intro page ${slug}:`, error);
    return null;
  }
}

/**
 * Будує URL для глави
 */
export function buildTDChapterUrl(volumeNum: number, chapterNum: number): string[] {
  // Return both formats for fallback
  return [
    `${TD_CONFIG.baseUrl}/volume-${volumeNum}/chapter-${chapterNum}/`,
    `${TD_CONFIG.baseUrl}/volume-${volumeNum}/chapter-${numberToWord(chapterNum)}/`,
  ];
}

/**
 * Будує URL для intro сторінки
 */
export function buildTDIntroUrl(volumeNum: number, slug: string): string {
  return `${TD_CONFIG.baseUrl}/volume-${volumeNum}/${slug}/`;
}

/**
 * Конвертує TDChapter у стандартний формат ParsedChapter
 */
export function tdChapterToStandardChapter(chapter: TDChapter): {
  chapter_number: number;
  chapter_type: "text";
  title_uk: string;
  title_en: string;
  content_uk: string;
  content_en: string;
  verses: [];
} {
  return {
    chapter_number: chapter.chapter_number,
    chapter_type: "text",
    title_uk: "", // Українська версія поки відсутня
    title_en: chapter.title_en,
    content_uk: "", // Українська версія поки відсутня
    content_en: chapter.content_en,
    verses: [],
  };
}

/**
 * Отримати конфігурацію тому
 */
export function getTDVolumeConfig(volumeNum: number) {
  return TD_CONFIG.volumes.find((v) => v.number === volumeNum);
}

/**
 * Отримати кількість глав у томі
 */
export function getTDVolumeChaptersCount(volumeNum: number): number {
  const config = getTDVolumeConfig(volumeNum);
  return config?.chaptersCount || 0;
}
