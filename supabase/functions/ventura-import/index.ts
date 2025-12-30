/**
 * Ventura Import Edge Function
 *
 * Parses BBT Ventura files (.H93) and extracts Ukrainian content
 * for Bhagavad-gita import.
 *
 * POST /ventura-import
 * Content-Type: multipart/form-data
 *
 * Body:
 *   file: .H93 file (Ventura format)
 *   type: "chapter" | "intro"
 *   file_prefix?: string (for intro files, e.g., "UKBG00PF")
 *
 * Response:
 *   For chapters: { chapter_number, title_ua, verses: [...] }
 *   For intros: { slug, title_ua, content_ua, display_order }
 *
 * REQUIRES AUTHENTICATION: Admin only
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// =============================================================================
// PUA MAPPING - Ukrainian diacritics
// =============================================================================

const UKRAINIAN_PUA_MAP: Record<string, string> = {
  '\uf101': 'а̄',   // ā → а з макроном
  '\uf102': 'і̄',   // ī → і з макроном
  '\uf121': 'і̄',   // ī → і з макроном (alt)
  '\uf123': 'ӯ',   // ū → у з макроном
  '\uf115': 'р̣',   // ṛ → р з точкою знизу
  '\uf125': 'р̣̄',  // ṝ → р з точкою знизу та макроном
  '\uf127': 'л̣',   // ḷ → л з точкою знизу
  '\uf129': 'л̣̄',  // ḹ → л з точкою знизу та макроном
  '\uf10f': 'н̇',   // ṅ → н з точкою зверху
  '\uf113': 'н̃',   // ñ → н з тильдою
  '\uf111': 'н̣',   // ṇ → н з точкою знизу
  '\uf109': 'м̇',   // ṁ → м з точкою зверху (анусвара)
  '\uf119': 'т̣',   // ṭ → т з точкою знизу
  '\uf103': 'д̣',   // ḍ → д з точкою знизу
  '\uf11d': 'ш́',   // ś → ш з акутом (палатальний)
  '\uf11f': 'ш̣',   // ṣ → ш з точкою знизу (ретрофлексний)
  '\uf11b': 'х̣',   // ḥ → х з точкою знизу (вісарга)
  '\uf11c': 'Ш́',   // Ś → Ш з акутом (велика)
};

// Intro file mapping
const INTRO_FILE_MAP: Record<string, [string, string, number]> = {
  'UKBG00DC': ['dedication', 'Посвята', 1],
  'UKBG00SS': ['background', 'Передісторія «Бгаґавад-ґіти»', 2],
  'UKBG00PF': ['preface', 'Передмова до англійського видання', 3],
  'UKBG00NT': ['note', 'Коментар до другого англійського видання', 4],
  'UKBG00ID': ['introduction', 'Вступ', 5],
  'UKBG00DS': ['disciplic-succession', 'Ланцюг учнівської послідовності', 100],
  'UKBG00AU': ['about-author', 'Про автора', 101],
  'UKBG00KU': ['reviews', 'Відгуки про «Бгаґавад-ґіту як вона є»', 102],
  'UKBG00PG': ['pronunciation', 'Як читати санскрит', 103],
  'UKBG00GL': ['glossary', 'Словничок імен і термінів', 104],
  'UKBG00QV': ['verse-index', 'Покажчик цитованих віршів', 105],
  'UKBG00XS': ['sanskrit-index', 'Покажчик санскритських віршів', 106],
  'UKBG00RF': ['references', 'Список цитованої літератури', 107],
  'UKBG00BL': ['books', 'Книги Його Божественної Милості', 108],
};

// Ukrainian ordinal numbers for chapter detection
const ORDINALS: [string, number][] = [
  ['ВІСІМНАДЦЯТА', 18], ['СІМНАДЦЯТА', 17], ['ШІСТНАДЦЯТА', 16], ["П'ЯТНАДЦЯТА", 15],
  ['ЧОТИРНАДЦЯТА', 14], ['ТРИНАДЦЯТА', 13], ['ДВАНАДЦЯТА', 12], ['ОДИНАДЦЯТА', 11],
  ['ДЕСЯТА', 10], ["ДЕВ'ЯТА", 9], ['ВОСЬМА', 8], ["С'ОМА", 7], ['СЬОМА', 7],
  ['ШОСТА', 6], ["П'ЯТА", 5], ['ЧЕТВЕРТА', 4], ['ТРЕТЯ', 3], ['ДРУГА', 2], ['ПЕРША', 1]
];

// Tags to skip
const SKIP_TAGS = new Set(['rh-verso', 'rh-recto', 'logo', 'text-rh', 'special']);
const DEVANAGARI_TAGS = new Set(['d-uvaca', 'd-anustubh', 'd-tristubh']);

// =============================================================================
// TEXT PROCESSING
// =============================================================================

function decodePua(text: string): string {
  let result = text;
  for (const [pua, uni] of Object.entries(UKRAINIAN_PUA_MAP)) {
    result = result.split(pua).join(uni);
  }
  return result;
}

function processLineContinuations(text: string): string {
  // Early return if no line continuations present
  if (!text.includes('<->') && !text.includes('<&>')) {
    return text;
  }

  const lines = text.split('\n');
  const result: string[] = [];
  let buffer = "";

  for (const line of lines) {
    const stripped = line.trimEnd();

    if (stripped.endsWith('<->')) {
      let l = stripped.slice(0, -3);
      if (l.endsWith('-')) l = l.slice(0, -1);
      buffer += l;
    } else if (stripped.endsWith('-<&>')) {
      buffer += stripped.slice(0, -4);
    } else if (stripped.endsWith('<&>')) {
      buffer += stripped.slice(0, -3);
    } else {
      if (buffer) {
        result.push(buffer + line);
        buffer = "";
      } else {
        result.push(line);
      }
    }
  }

  if (buffer) result.push(buffer);
  return result.join('\n');
}

function processInlineTags(text: string, keepHtml: boolean = false): string {
  let result = processLineContinuations(text);

  // Unicode escapes
  result = result.split('<u003C>').join('<');

  // Whitespace and line breaks
  result = result.replace(/<->\s*/g, '');
  result = result.replace(/<&>\s*/g, '');
  result = result.replace(/<_?R>/g, '\n');
  result = result.replace(/<N\|?>/g, '');
  result = result.replace(/<S>/g, ' ');
  result = result.replace(/<_>/g, ' ');

  // Single-letter prepositions
  result = result.replace(/<_oneletter>([^<]*)<_N>/g, '$1 ');

  if (keepHtml) {
    // Bold + Italic
    result = result.replace(/<BI>([^<]*)<\/?D>/g, '<strong><em>$1</em></strong>');

    // Bold
    result = result.replace(/<B>([^<]*)<\/?D>/g, '<strong>$1</strong>');
    result = result.replace(/<B>/g, '<strong>');

    // Italic
    result = result.replace(/<MI>([^<]*)<\/?D>/g, '<em>$1</em>');
    result = result.replace(/<MI>/g, '<em>');
    result = result.replace(/<\/?D>/g, '</em>');

    // Clean up punctuation in italic/bold
    result = result.replace(/<\/em>\s*<em>([,.\;:])/g, '</em>$1');
    result = result.replace(/<\/strong>\s*<strong>([,.\;:])/g, '</strong>$1');

    // Remove empty tags
    result = result.replace(/<em><\/em>/g, '');
    result = result.replace(/<strong><\/strong>/g, '');
    result = result.replace(/<\/em>\s*<em>/g, ' ');
    result = result.replace(/<\/strong>\s*<strong>/g, ' ');

    // Remove spaces before closing tags
    result = result.replace(/\s+<\/em>/g, '</em>');
    result = result.replace(/\s+<\/strong>/g, '</strong>');

    // Remove empty tags again
    result = result.replace(/<em><\/em>/g, '');
    result = result.replace(/<strong><\/strong>/g, '');
  } else {
    // Strip formatting
    result = result.replace(/<BI>([^<]*)<\/?D>/g, '$1');
    result = result.replace(/<B>([^<]*)<\/?D>/g, '$1');
    result = result.replace(/<B>/g, '');
    result = result.replace(/<MI>([^<]*)<\/?D>/g, '$1');
    result = result.replace(/<MI>/g, '');
    result = result.replace(/<\/?D>/g, '');
  }

  // Book titles - wrap in strong and quotes
  if (keepHtml) {
    result = result.replace(/<_bt>([^<]*)<_\/bt>/g, '<strong>«$1»</strong>');
  } else {
    result = result.replace(/<_bt>([^<]*)<_\/bt>/g, '«$1»');
  }

  // Quotes - just remove tags (quotes already in text)
  result = result.replace(/<_qm>/g, '');
  result = result.replace(/<\/_qm>/g, '');

  // Terms (for synonyms)
  result = result.replace(/<_dt>([^<]*)<_\/dt>/g, '$1');
  result = result.replace(/<_dt>|<_\/dt>/g, '');
  result = result.replace(/<_dd>|<_\/dd>/g, '');

  // Slash
  result = result.replace(/<_slash>\/<_\/slash>/g, '/');

  // Monospace - ignore
  result = result.replace(/<mon>[^<]*<\/mon>/g, '');

  // Decode PUA
  result = decodePua(result);

  // Remove remaining Ventura tags (but not HTML if keepHtml)
  if (keepHtml) {
    // OPTIMIZED: Use positive approach instead of slow negative lookahead
    // The old regex `/<(?!\/?(em|strong|br|span|p|blockquote)[^a-z])[^>]*>/g` caused
    // catastrophic backtracking on large files (5+ minutes for 450KB)
    const allowedTags = ['em', 'strong', 'br', 'span', 'p', 'blockquote'];
    const tempMarker = '\x00KEEP\x00';

    // 1. Mark allowed tags with unique marker
    for (const tag of allowedTags) {
      result = result.replace(new RegExp(`<(/?)(${tag})([^>]*)>`, 'gi'), `${tempMarker}<$1$2$3>${tempMarker}`);
    }

    // 2. Remove all other tags (simple fast regex)
    result = result.replace(/<[^>]*>/g, '');

    // 3. Remove markers, keeping the preserved tags
    result = result.replace(/\x00KEEP\x00/g, '');
  } else {
    result = result.replace(/<[^>]*>/g, '');
  }

  // Normalize whitespace
  result = result.replace(/[ \t]+/g, ' ');
  result = result.replace(/\n\s*\n/g, '\n\n');

  return result.trim();
}

function processSynonyms(text: string): string {
  let result = processLineContinuations(text);
  result = result.split('\n').join(' ');

  // Convert <MI><_dt>...<_/dt><D> <_dd>...<_/dd> → <em>term</em> — meaning
  // Keep <em> tags for terms (italic formatting)
  result = result.replace(/<MI><_dt>([^<]*)<_\/dt><D>\s*[-–—]?\s*<_dd>([^<]*)<_\/dd>/g, '<em>$1</em> — $2');
  result = result.replace(/<_dt>([^<]*)<_\/dt>\s*[-–—]?\s*<_dd>([^<]*)<_\/dd>/g, '<em>$1</em> — $2');

  // Process inline tags but KEEP HTML for formatting
  result = processInlineTags(result, true);
  result = result.replace(/\s+/g, ' ').trim();

  // Normalize dashes
  result = result.replace(/ – /g, ' — ');
  result = result.replace(/ - /g, ' — ');

  return result;
}

function processProse(text: string, keepHtml: boolean = false): string {
  let result = processLineContinuations(text);
  result = result.split('\n').join(' ');
  result = processInlineTags(result, keepHtml);
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

function processFirstParagraph(text: string): string {
  let result = processProse(text, true);

  // Add drop cap to first letter
  if (result && result.length > 0) {
    // Find the first non-HTML-tag character
    let i = 0;
    let leadingTags = '';

    while (i < result.length) {
      if (result[i] === '<') {
        // Find the end of this tag
        const tagEnd = result.indexOf('>', i);
        if (tagEnd !== -1) {
          leadingTags += result.slice(i, tagEnd + 1);
          i = tagEnd + 1;
        } else {
          break;
        }
      } else {
        // Found first actual character
        const firstChar = result[i];
        const rest = result.slice(i + 1);
        // Wrap in <p class="purport first"> with drop cap
        return `<p class="purport first">${leadingTags}<span class="drop-cap">${firstChar}</span>${rest}</p>`;
      }
    }
  }

  return `<p class="purport first">${result}</p>`;
}

function processTransliteration(text: string): string {
  let result = processLineContinuations(text);
  result = result.replace(/<_R><_>/g, '\n');
  result = result.replace(/<R>/g, '\n');
  result = result.replace(/<_>/g, ' ');
  result = processInlineTags(result);
  // Wrap each line in <span class="line">
  const lines = result.split('\n').map(l => l.trim()).filter(l => l);
  return lines.map(l => `<span class="line">${l}</span>`).join('\n');
}

function extractVerseNumber(text: string): string {
  const match = text.match(/(?:Вірш[иі]?|ВІРШ[ИІ]?)\s*(\d+(?:\s*[-–]\s*\d+)?)/i);
  if (match) return match[1].replace(/\s+/g, '');
  const numMatch = text.match(/(\d+(?:\s*[-–]\s*\d+)?)/);
  if (numMatch) return numMatch[1].replace(/\s+/g, '');
  return text.trim();
}

function extractChapterNumber(text: string): number {
  let norm = text.toUpperCase();
  norm = norm.replace(/ʼ/g, "'").replace(/\u2019/g, "'").replace(/`/g, "'");

  for (const [name, num] of ORDINALS) {
    if (norm.includes(name)) return num;
  }

  const match = text.match(/(\d+)/);
  if (match) return parseInt(match[1]);
  return 0;
}

// =============================================================================
// PARSERS
// =============================================================================

interface Verse {
  verse_number: string;
  transliteration_ua?: string;
  synonyms_ua?: string;
  translation_ua?: string;
  commentary_ua?: string;
}

interface Chapter {
  chapter_number: number;
  title_ua: string;
  verses: Verse[];
}

interface IntroPage {
  slug: string;
  title_ua: string;
  content_ua: string;
  display_order: number;
}

function parseVentura(text: string): Chapter {
  const lines = text.split('\n');
  console.log(`parseVentura: ${lines.length} lines`);

  let chapterNumber = 0;
  let chapterTitle = "";
  const verses: Verse[] = [];
  let currentVerse: Verse | null = null;

  let currentTag: string | null = null;
  let currentContent: string[] = [];

  const foundTags = new Set<string>();

  function flushBlock() {
    if (!currentTag || SKIP_TAGS.has(currentTag) || DEVANAGARI_TAGS.has(currentTag)) {
      return;
    }

    const content = currentContent.join(' ').trim();
    if (!content) return;

    if (currentTag === 'h1-number') {
      chapterNumber = extractChapterNumber(content);
    } else if (currentTag === 'h1') {
      chapterTitle = processInlineTags(content);
    } else if (['h2-number', 'h2-number-2', 'ch'].includes(currentTag)) {
      if (currentVerse) verses.push(currentVerse);
      currentVerse = { verse_number: extractVerseNumber(content) };
    } else if (['v-uvaca', 'v-anustubh', 'v-tristubh'].includes(currentTag)) {
      if (currentVerse) {
        const translit = processTransliteration(content);
        currentVerse.transliteration_ua = currentVerse.transliteration_ua
          ? currentVerse.transliteration_ua + '\n' + translit
          : translit;
      }
    } else if (currentTag === 'eqs') {
      if (currentVerse) {
        const synonyms = processSynonyms(content);
        currentVerse.synonyms_ua = currentVerse.synonyms_ua
          ? currentVerse.synonyms_ua + ' ' + synonyms
          : synonyms;
      }
    } else if (currentTag === 'translation') {
      if (currentVerse) {
        currentVerse.translation_ua = processProse(content, false);
      }
    } else if (currentTag === 'p-indent') {
      // First paragraph with drop cap
      if (currentVerse) {
        const para = processFirstParagraph(content);
        if (para) {
          currentVerse.commentary_ua = currentVerse.commentary_ua
            ? currentVerse.commentary_ua + '\n\n' + para
            : para;
        }
      }
    } else if (['p', 'p0', 'p1'].includes(currentTag)) {
      if (currentVerse) {
        const para = processProse(content, true);
        if (para) {
          // Wrap in <p class="purport">
          const wrapped = `<p class="purport">${para}</p>`;
          currentVerse.commentary_ua = currentVerse.commentary_ua
            ? currentVerse.commentary_ua + '\n\n' + wrapped
            : wrapped;
        }
      }
    } else if (currentTag === 'p-purport') {
      // "КОМЕНТАР" header - styled as centered header
      if (currentVerse) {
        const header = `<p class="purport-title">${processInlineTags(content)}</p>`;
        currentVerse.commentary_ua = currentVerse.commentary_ua
          ? currentVerse.commentary_ua + '\n\n' + header
          : header;
      }
    } else if (['ql', 'q', 'q-p'].includes(currentTag)) {
      // Quotes inside purport - centered blockquote
      if (currentVerse) {
        const quote = processProse(content, true);
        if (quote) {
          const blockquote = `<blockquote class="verse-quote">${quote}</blockquote>`;
          currentVerse.commentary_ua = currentVerse.commentary_ua
            ? currentVerse.commentary_ua + '\n\n' + blockquote
            : blockquote;
        }
      }
    } else if (currentTag === 'p-outro') {
      // Outro paragraph (end of chapter) - styled differently
      if (currentVerse) {
        const outro = `<p class="purport-outro"><em>${processProse(content, true)}</em></p>`;
        currentVerse.commentary_ua = currentVerse.commentary_ua
          ? currentVerse.commentary_ua + '\n\n' + outro
          : outro;
      }
    }
  }

  for (const line of lines) {
    const trimmed = line.trimEnd();

    if (trimmed.startsWith('@') && trimmed.includes(' = ')) {
      flushBlock();

      const match = trimmed.match(/^@([\w-]+)\s*=\s*(.*)/);
      if (match) {
        currentTag = match[1];
        foundTags.add(currentTag);
        const c = match[2].trim();
        currentContent = c ? [c] : [];
      }
    } else if (currentTag && line) {
      currentContent.push(line);
    }
  }

  flushBlock();
  if (currentVerse) verses.push(currentVerse);

  console.log(`parseVentura result: chapter=${chapterNumber}, title="${chapterTitle}", verses=${verses.length}`);
  console.log(`Found tags: ${Array.from(foundTags).join(', ')}`);

  return { chapter_number: chapterNumber, title_ua: chapterTitle, verses };
}

function parseIntroPage(text: string, filePrefix: string): IntroPage | null {
  const mapping = INTRO_FILE_MAP[filePrefix];
  if (!mapping) return null;

  const [slug, defaultTitle, displayOrder] = mapping;
  const lines = text.split('\n');

  let title = defaultTitle;
  const paragraphs: string[] = [];
  let currentListNumber: string | null = null;

  let currentTag: string | null = null;
  let currentContent: string[] = [];

  function flushBlock() {
    if (!currentTag) return;

    const content = currentContent.join(' ').trim();
    if (!content) return;

    // Headers
    if (['h1-fb', 'h1', 'h1-pg', 'h1-rv', 'h1-bl', 'h1-ds'].includes(currentTag)) {
      title = processProse(content, false).split(/\s+/).join(' ');
    }
    // Subheaders
    else if (['h2', 'h2-gl', 'h2-rv'].includes(currentTag)) {
      const sub = processProse(content, true);
      if (sub) paragraphs.push(`<strong>${sub}</strong>`);
    }
    // Paragraphs
    else if (['p0', 'p', 'p1', 'p-indent', 'p-gl', 'p-au', 'p-rv', 'p-bl', 'p0-ku', 'p1-ku'].includes(currentTag)) {
      const para = processProse(content, true);
      if (para) paragraphs.push(para);
    }
    // Signatures (reviews)
    else if (currentTag === 'ku-signature') {
      const sig = processProse(content, true).replace(/\n/g, '<br>');
      if (sig) paragraphs.push(`<p class="signature"><em>${sig}</em></p>`);
    }
    // Dedication
    else if (currentTag === 'dc') {
      const para = processProse(content, true).replace(/\n/g, '<br>');
      if (para) paragraphs.push(`<p class="dedication">${para}</p>`);
    }
    // Numbered lists
    else if (['li-number', 'li-number-0'].includes(currentTag)) {
      const num = processProse(content, false).trim();
      const numMatch = num.match(/(\d+)/);
      currentListNumber = numMatch ? numMatch[1] : num;
    }
    else if (currentTag === 'li-p') {
      const item = processProse(content, true);
      if (item) {
        paragraphs.push(currentListNumber ? `${currentListNumber}. ${item}` : `• ${item}`);
      }
      currentListNumber = null;
    }
    // Glossary entries
    else if (currentTag === 'li-gl') {
      const item = processSynonyms(content);
      if (item) paragraphs.push(item);
    }
    // Book list
    else if (currentTag === 'li-bl') {
      const item = processProse(content, true);
      if (item) paragraphs.push(`• ${item}`);
    }
    // Index intro
    else if (['intro-qv', 'intro-xs'].includes(currentTag)) {
      const intro = processProse(content, true);
      if (intro) paragraphs.push(intro);
    }
    // Index items
    else if (['li-qv', 'li-xs'].includes(currentTag)) {
      const item = processProse(content, true);
      if (item) paragraphs.push(item);
    }
    // Quotes
    else if (['ql', 'q', 'q-p'].includes(currentTag)) {
      const quote = processProse(content, true);
      if (quote) paragraphs.push(`<blockquote>${quote}</blockquote>`);
    }
  }

  for (const line of lines) {
    const trimmed = line.trimEnd();

    if (trimmed.startsWith('@') && trimmed.includes(' = ')) {
      flushBlock();

      const match = trimmed.match(/^@([\w-]+)\s*=\s*(.*)/);
      if (match) {
        currentTag = match[1];
        const c = match[2].trim();
        currentContent = c ? [c] : [];
      }
    } else if (currentTag && line) {
      currentContent.push(line);
    }
  }

  flushBlock();

  if (paragraphs.length === 0) return null;

  return {
    slug,
    title_ua: title,
    content_ua: paragraphs.join('\n\n'),
    display_order: displayOrder,
  };
}

// =============================================================================
// MAIN HANDLER
// =============================================================================

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Always wrap in try-catch to ensure CORS headers are returned
  try {
    // Check method
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse multipart form data with explicit error handling
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (formError) {
      console.error("FormData parsing error:", formError);
      return new Response(
        JSON.stringify({
          error: "Failed to parse form data",
          detail: formError instanceof Error ? formError.message : "Unknown error"
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string || "chapter";
    const filePrefix = formData.get("file_prefix") as string || "";

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const startTime = Date.now();
    console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${type}`);

    // Read file content
    const arrayBuffer = await file.arrayBuffer();
    let text: string;

    // Try UTF-16LE first (typical BBT format)
    try {
      const decoder = new TextDecoder("utf-16le");
      text = decoder.decode(arrayBuffer);
      if (text.startsWith('\ufeff')) {
        text = text.slice(1);
      }
      // Check if decoded correctly - should have readable content
      if (!text || text.length < 100 || !/[@\w]/.test(text.slice(0, 500))) {
        throw new Error("UTF-16LE decode produced invalid content");
      }
    } catch {
      // Fallback to UTF-8
      const decoder = new TextDecoder("utf-8");
      text = decoder.decode(arrayBuffer);
      if (text.startsWith('\ufeff')) {
        text = text.slice(1);
      }
    }

    console.log(`Decoded text length: ${text.length}`);

    // Debug: show first 500 chars of decoded text
    console.log(`First 500 chars: ${text.slice(0, 500)}`);

    // Debug: check for @ tags
    const tagMatches = text.match(/^@[\w-]+\s*=/gm);
    console.log(`Found ${tagMatches?.length || 0} @ tags in file`);
    if (tagMatches && tagMatches.length > 0) {
      console.log(`First 10 tags: ${tagMatches.slice(0, 10).join(', ')}`);
    }

    let result: any;

    if (type === "intro") {
      // Get file prefix from filename if not provided
      let prefix = filePrefix;
      if (!prefix && file.name) {
        prefix = file.name.split('.')[0].slice(0, 8);
      }

      result = parseIntroPage(text, prefix);

      if (!result) {
        return new Response(
          JSON.stringify({ error: "Invalid intro file or unknown prefix", prefix }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      // Parse as chapter
      result = parseVentura(text);

      if (!result.verses || result.verses.length === 0) {
        // Return diagnostic info instead of just error
        const tagMatches = text.match(/^@[\w-]+\s*=/gm) || [];
        return new Response(
          JSON.stringify({
            error: "No verses found in file",
            diagnostics: {
              text_length: text.length,
              line_count: text.split('\n').length,
              first_200_chars: text.slice(0, 200),
              tag_count: tagMatches.length,
              first_10_tags: tagMatches.slice(0, 10),
              chapter_number_found: result.chapter_number,
              title_found: result.title_ua,
            }
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const elapsed = Date.now() - startTime;
    console.log(`Parse completed in ${elapsed}ms, ${type === 'intro' ? 'intro page' : `${result.verses?.length || 0} verses`}`);

    return new Response(
      JSON.stringify({ success: true, type, data: result, elapsed_ms: elapsed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error parsing file:", error);
    return new Response(
      JSON.stringify({
        error: "Parse failed",
        detail: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
