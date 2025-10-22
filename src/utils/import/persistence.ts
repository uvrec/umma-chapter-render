// utils/import/persistence.ts
import type { SupabaseClient } from "@supabase/supabase-js";

/** ——— Типи, сумісні з імпортом ——— */
export type ChapterType = "verses" | "prose";

export interface VerseInput {
  verse_number?: string;
  sanskrit?: string;
  transliteration?: string;
  synonyms_en?: string;
  synonyms_ua?: string;
  translation_en?: string;
  translation_ua?: string;
  commentary_en?: string;
  commentary_ua?: string;
}

export interface ChapterInput {
  chapter_number: number;
  title_en?: string;
  title_ua?: string;
  chapter_type?: ChapterType;
  content_en?: string;
  content_ua?: string;
  verses?: VerseInput[];
}

export interface EnsureContainersParams {
  bookSlug: string;
  fallbackTitles?: { ua?: string; en?: string };
  hasCantos?: boolean;
  cantoNumber?: number | null;
  vedabase_slug?: string | null;
}

export interface EnsureContainersResult {
  book: { id: string; slug: string; has_cantos: boolean };
  canto?: { id: string; canto_number: number } | null;
}

/** ——— Крок 0. Реєстр маперів під специфіку окремих книг ——— */
type BookMapper = (raw: any) => ChapterInput;
const bookMappers: Record<string, BookMapper> = {
  "cc": (raw) => ({
    chapter_number: raw.chapter_number,
    chapter_type: "prose",
    title_en: raw.title_en,
    title_ua: raw.title_ua,
    content_en: raw.html_en,
    content_ua: raw.html_ua,
  }),
};

export function mapParsedChapterForBook(bookSlug: string, raw: any): ChapterInput {
  return bookMappers[bookSlug]?.(raw) ?? raw;
}

/** ——— Крок 1. Забезпечити наявність containers: book → canto ——— */
export async function ensureContainers(
  supabase: SupabaseClient,
  params: EnsureContainersParams
): Promise<EnsureContainersResult> {
  const { bookSlug, fallbackTitles, hasCantos, cantoNumber, vedabase_slug } = params;

  const { data: bookRow, error: bookErr } = await supabase
    .from("books")
    .upsert(
      {
        slug: bookSlug,
        title_ua: fallbackTitles?.ua ?? bookSlug.toUpperCase(),
        title_en: fallbackTitles?.en ?? bookSlug.toUpperCase(),
        has_cantos: !!hasCantos,
        vedabase_slug: vedabase_slug ?? bookSlug,
      },
      { onConflict: "slug" }
    )
    .select("id, slug, has_cantos")
    .single();

  if (bookErr) throw bookErr;
  const book = bookRow!;

  let canto: EnsureContainersResult["canto"] = null;
  if (hasCantos && cantoNumber) {
    const { data: cantoRow, error: cantoErr } = await supabase
      .from("cantos")
      .upsert(
        {
          book_id: book.id,
          canto_number: Number(cantoNumber),
          title_ua: `Канто ${cantoNumber}`,
          title_en: `Canto ${cantoNumber}`,
        },
        { onConflict: "book_id,canto_number" }
      )
      .select("id, canto_number")
      .single();
    if (cantoErr) throw cantoErr;
    canto = cantoRow!;
  }

  return { book, canto };
}

/** ——— Крок 2. Upsert глави — підтримка "verses" і "prose" ——— */
export async function upsertChapter(
  supabase: SupabaseClient,
  container: { book_id: string; canto_id?: string | null },
  input: ChapterInput
): Promise<{ id: string }> {
  const type: ChapterType = input.chapter_type ?? autoDetectChapterType(input);

  const payload: any = {
    book_id: container.book_id,
    canto_id: container.canto_id ?? null,
    chapter_number: input.chapter_number,
    title_en: input.title_en ?? `Chapter ${input.chapter_number}`,
    title_ua: input.title_ua ?? `Глава ${input.chapter_number}`,
    chapter_type: type,
  };

  if (type === "prose") {
    payload.content_en = input.content_en ?? "";
    payload.content_ua = input.content_ua ?? "";
  }

  const { data, error } = await supabase
    .from("chapters")
    .upsert(payload, {
      onConflict: "book_id,canto_id,chapter_number",
    })
    .select("id")
    .single();

  if (error) throw error;
  return data!;
}

/** ——— Крок 3. Батчевий upsert віршів ——— */
export async function upsertVersesBatch(
  supabase: SupabaseClient,
  chapterId: string,
  verses: VerseInput[],
  opts?: { chunkSize?: number; onProgress?: (done: number, total: number) => void }
): Promise<void> {
  const chunkSize = opts?.chunkSize ?? 50;

  const rows = (verses ?? []).map((v, idx) => {
    const rawNum = (v.verse_number ?? `${idx + 1}`).trim();
    return {
      chapter_id: chapterId,
      verse_number: rawNum,
      verse_number_sort: computeVerseSort(rawNum),
      sanskrit: v.sanskrit ?? null,
      transliteration: v.transliteration ?? null,
      synonyms_en: v.synonyms_en ?? null,
      synonyms_ua: v.synonyms_ua ?? null,
      translation_en: v.translation_en ?? null,
      translation_ua: v.translation_ua ?? null,
      commentary_en: v.commentary_en ?? null,
      commentary_ua: v.commentary_ua ?? null,
    };
  });

  const seen = new Set<string>();
  const deduped: typeof rows = [];
  for (let i = rows.length - 1; i >= 0; i--) {
    const key = rows[i].verse_number_sort;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(rows[i]);
  }
  deduped.reverse();

  for (let i = 0; i < deduped.length; i += chunkSize) {
    const chunk = deduped.slice(i, i + chunkSize);
    const { error } = await supabase
      .from("verses")
      .upsert(chunk, { onConflict: "chapter_id,verse_number_sort" });
    if (error) throw error;
    opts?.onProgress?.(Math.min(i + chunk.length, deduped.length), deduped.length);
  }
}

/** ——— Допоміжне: автодетект типу глави ——— */
export function autoDetectChapterType(ch: ChapterInput): ChapterType {
  const hasVerses = Array.isArray(ch.verses) && ch.verses.length > 0;
  const anyVerseLike =
    hasVerses &&
    ch.verses!.some(
      (v) =>
        !!v.verse_number ||
        !!v.sanskrit ||
        !!v.transliteration ||
        !!v.translation_en ||
        !!v.translation_ua
    );
  if (anyVerseLike) return "verses";

  const hasHtml =
    (ch.content_en && stripHtml(ch.content_en).trim().length > 0) ||
    (ch.content_ua && stripHtml(ch.content_ua).trim().length > 0);
  if (hasHtml) return "prose";

  return "prose";
}

/** ——— Допоміжне: сортування номерів віршів ——— */
export function computeVerseSort(raw: string): string {
  const left = raw.split(/[–-]/)[0].trim();

  const m = left.match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?([a-z])?$/i);
  if (!m) {
    const n = parseInt(left, 10);
    return Number.isFinite(n) ? n.toString().padStart(6, "0") : left;
  }
  const p1 = m[1] ? m[1].padStart(3, "0") : "000";
  const p2 = m[2] ? m[2].padStart(3, "0") : "000";
  const p3 = m[3] ? m[3].padStart(3, "0") : "000";
  const suf = m[4] ? m[4].toLowerCase().charCodeAt(0).toString().padStart(3, "0") : "000";
  return `${p1}.${p2}.${p3}.${suf}`;
}

function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<script[^>]*>.*?<\/script>/gis, "")
             .replace(/<style[^>]*>.*?<\/style>/gis, "")
             .replace(/<[^>]+>/g, " ");
}
