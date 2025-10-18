// src/utils/import/importer.ts
import { SupabaseClient } from "@supabase/supabase-js";
import type { ParsedChapter, ParsedVerse } from "@/types/book-import";

/** Безпечна конвертація verse_number в integer */
function safeVerseNumber(verseNum: string | number | undefined | null): number | null {
  if (verseNum === null || verseNum === undefined || verseNum === "") {
    return null;
  }

  if (typeof verseNum === "number") {
    return Number.isInteger(verseNum) && verseNum > 0 ? verseNum : null;
  }

  const strNum = String(verseNum).trim();

  // Діапазон типу "1-64" - беремо перше число
  const rangeMatch = strNum.match(/^(\d+)-\d+$/);
  if (rangeMatch) {
    console.warn(`⚠️ Verse range "${strNum}", using first: ${rangeMatch[1]}`);
    return parseInt(rangeMatch[1], 10);
  }

  const num = parseInt(strNum, 10);
  if (!isNaN(num) && num > 0) {
    return num;
  }

  console.error(`❌ Invalid verse_number: "${verseNum}"`);
  return null;
}

/** Санітизація HTML */
export const safeHtml = (html?: string) => {
  const s = html ?? "";
  let out = s
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/on\w+=\w+/gi, "");
  out = out.replace(/(href|src)\s*=\s*(['"])\s*(javascript:|data:text\/html)[^'"]*\2/gi, '$1="#"');
  out = out.replace(/(href|src)\s*=\s*(['"])\s*([^'"]+)\2/gi, (m, attr, q, url) => {
    const ok = /^(https?:|mailto:|tel:)/i.test((url || "").trim());
    return ok ? m : `${attr}="#"`;
  });
  return out.trim();
};

/** Нормалізація послівного */
export const normalizeSynonymsSoft = (s?: string) =>
  (s ?? "")
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

/** Пошук або створення глави */
export async function upsertChapter(
  supabase: SupabaseClient,
  params: {
    bookId: string;
    cantoId?: string | null;
    chapter_number: number;
    chapter_type: "verses" | "text";
    title_ua?: string;
    title_en?: string;
    content_ua?: string;
    content_en?: string;
  },
): Promise<string> {
  const { bookId, cantoId, chapter_number } = params;

  let query = supabase.from("chapters").select("id").eq("chapter_number", chapter_number).limit(1);

  if (cantoId) query = query.eq("canto_id", cantoId);
  else query = query.eq("book_id", bookId);

  const { data: existing, error: findErr } = await query.maybeSingle();
  if (findErr) throw findErr;

  const payload: any = {
    chapter_number,
    chapter_type: params.chapter_type,
    title_ua: params.title_ua ?? null,
    title_en: params.title_en ?? null,
    content_ua: safeHtml(params.content_ua),
    content_en: safeHtml(params.content_en),
  };

  if (cantoId) payload.canto_id = cantoId;
  else payload.book_id = bookId;

  if (existing?.id) {
    const { error: updErr } = await supabase.from("chapters").update(payload).eq("id", existing.id);
    if (updErr) throw updErr;
    return existing.id;
  } else {
    const { data: created, error: insErr } = await supabase.from("chapters").insert(payload).select("id").single();
    if (insErr) throw insErr;
    return created.id;
  }
}

/** Повна заміна віршів глави з фільтрацією невалідних */
export async function replaceChapterVerses(
  supabase: SupabaseClient,
  chapterId: string,
  verses: ParsedVerse[],
  _opts?: { language?: "ua" | "en" },
) {
  const { error: delErr } = await supabase.from("verses").delete().eq("chapter_id", chapterId);
  if (delErr) throw delErr;

  if (!verses?.length) return;

  const validRows: any[] = [];
  let skippedCount = 0;

  verses.forEach((v, index) => {
    const verseNum = safeVerseNumber(v.verse_number);

    if (verseNum === null) {
      console.warn(`⚠️ Skipping verse ${index}: invalid verse_number "${v.verse_number}"`);
      skippedCount++;
      return;
    }

    validRows.push({
      chapter_id: chapterId,
      verse_number: verseNum,
      sanskrit: v.sanskrit ?? null,
      transliteration: v.transliteration ?? null,
      synonyms_ua: normalizeSynonymsSoft((v as any).synonyms_ua ?? ""),
      synonyms_en: (v as any).synonyms_en ?? null,
      translation_ua: (v as any).translation_ua ?? null,
      translation_en: (v as any).translation_en ?? null,
      commentary_ua: safeHtml((v as any).commentary_ua ?? ""),
      commentary_en: safeHtml((v as any).commentary_en ?? ""),
      audio_url: (v as any).audio_url ?? (v as any).audioUrl ?? null,
    });
  });

  console.log(`✅ Valid verses: ${validRows.length}, Skipped: ${skippedCount}`);

  if (validRows.length === 0) {
    console.warn("⚠️ No valid verses to insert");
    return;
  }

  const { error: insErr } = await supabase.from("verses").insert(validRows);
  if (insErr) throw insErr;
}

/** Upsert віршів з фільтрацією */
export async function upsertChapterVerses(supabase: SupabaseClient, chapterId: string, verses: ParsedVerse[]) {
  if (!verses?.length) return;

  const validRows: any[] = [];
  let skippedCount = 0;

  verses.forEach((v, index) => {
    const verseNum = safeVerseNumber(v.verse_number);

    if (verseNum === null) {
      console.warn(`⚠️ Skipping verse ${index}: invalid verse_number "${v.verse_number}"`);
      skippedCount++;
      return;
    }

    validRows.push({
      chapter_id: chapterId,
      verse_number: verseNum,
      sanskrit: v.sanskrit ?? null,
      transliteration: v.transliteration ?? null,
      synonyms_ua: normalizeSynonymsSoft((v as any).synonyms_ua ?? ""),
      synonyms_en: (v as any).synonyms_en ?? null,
      translation_ua: (v as any).translation_ua ?? null,
      translation_en: (v as any).translation_en ?? null,
      commentary_ua: safeHtml((v as any).commentary_ua ?? ""),
      commentary_en: safeHtml((v as any).commentary_en ?? ""),
      audio_url: (v as any).audio_url ?? (v as any).audioUrl ?? null,
    });
  });

  console.log(`✅ Valid verses: ${validRows.length}, Skipped: ${skippedCount}`);

  if (validRows.length === 0) {
    console.warn("⚠️ No valid verses to upsert");
    return;
  }

  const { error } = await supabase
    .from("verses")
    .upsert(validRows, { onConflict: "chapter_id,verse_number", ignoreDuplicates: false });

  if (error) throw error;
}

/** Імпорт однієї глави */
export async function importSingleChapter(
  supabase: SupabaseClient,
  payload: {
    bookId: string;
    cantoId?: string | null;
    chapter: ParsedChapter;
    strategy?: "replace" | "upsert";
  },
) {
  const { bookId, cantoId, chapter, strategy = "replace" } = payload;

  const chapterId = await upsertChapter(supabase, {
    bookId,
    cantoId: cantoId ?? null,
    chapter_number: chapter.chapter_number,
    chapter_type: chapter.chapter_type ?? "verses",
    title_ua: chapter.title_ua,
    title_en: chapter.title_en,
    content_ua: chapter.content_ua,
    content_en: chapter.content_en,
  });

  if ((chapter.chapter_type ?? "verses") === "verses") {
    if (strategy === "replace") {
      await replaceChapterVerses(supabase, chapterId, chapter.verses ?? []);
    } else {
      await upsertChapterVerses(supabase, chapterId, chapter.verses ?? []);
    }
  }
}

/** Масовий імпорт книги */
export async function importBook(
  supabase: SupabaseClient,
  payload: {
    bookId: string;
    cantoId?: string | null;
    chapters: ParsedChapter[];
    onProgress?: (info: { index: number; total: number; chapter: ParsedChapter }) => void;
    strategy?: "replace" | "upsert";
  },
) {
  const { bookId, cantoId, chapters, onProgress, strategy = "replace" } = payload;
  const total = chapters.length;

  for (let i = 0; i < total; i++) {
    const ch = chapters[i];
    await importSingleChapter(supabase, { bookId, cantoId: cantoId ?? null, chapter: ch, strategy });
    onProgress?.({ index: i + 1, total, chapter: ch });
  }
}
