// src/utils/import/importer.ts
import { SupabaseClient } from "@supabase/supabase-js";
import type { ParsedChapter, ParsedVerse } from "@/types/book-import";

/** Санітизація HTML на імпорті (додатковий “пояс безпеки” до DOMPurify на рендері) */
export const safeHtml = (html?: string) => {
  const s = html ?? "";

  // 1) прибираємо явні небезпеки
  let out = s
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    // inline-івенти типу onclick="", onerror='' або onload=something
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/on\w+=\w+/gi, "");

  // 2) “javascript:” та data:text/html у href/src
  out = out.replace(/(href|src)\s*=\s*(['"])\s*(javascript:|data:text\/html)[^'"]*\2/gi, '$1="#"');

  // 3) дозволяємо лише http/https/mailto/tel у href/src
  out = out.replace(/(href|src)\s*=\s*(['"])\s*([^'"]+)\2/gi, (m, attr, q, url) => {
    const ok = /^(https?:|mailto:|tel:)/i.test((url || "").trim());
    return ok ? m : `${attr}="#"`;
  });

  return out.trim();
};

/** Нормалізація послівного (мʼяка) */
export const normalizeSynonymsSoft = (s?: string) =>
  (s ?? "")
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

/** Пошук або створення глави (bookId/cantoId + chapter_number) з оновленням полів */
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

/** Повна заміна віршів глави: delete all -> insert */
export async function replaceChapterVerses(
  supabase: SupabaseClient,
  chapterId: string,
  verses: ParsedVerse[],
  _opts?: { language?: "ua" | "en" },
) {
  const { error: delErr } = await supabase.from("verses").delete().eq("chapter_id", chapterId);
  if (delErr) throw delErr;

  if (!verses?.length) return;

  const rows = verses.map((v) => ({
    chapter_id: chapterId,
    verse_number: v.verse_number,
    sanskrit: v.sanskrit ?? null,
    transliteration: (v as any).transliteration_en ?? v.transliteration ?? null,
    transliteration_en: (v as any).transliteration_en ?? null,
    transliteration_ua: (v as any).transliteration_ua ?? null,
    synonyms_ua: normalizeSynonymsSoft((v as any).synonyms_ua ?? ""),
    // Fallback to generic EN keys when Python parser returns {synonyms, translation, purport}
    synonyms_en: (v as any).synonyms_en ?? (v as any).synonyms ?? null,
    translation_ua: (v as any).translation_ua ?? null,
    translation_en: (v as any).translation_en ?? (v as any).translation ?? null,
    commentary_ua: safeHtml((v as any).commentary_ua ?? ""),
    commentary_en: safeHtml((v as any).commentary_en ?? (v as any).purport ?? ""),
    // підтримуємо і audioUrl (camelCase), і audio_url (snake_case)
    audio_url: (v as any).audio_url ?? (v as any).audioUrl ?? null,
  }));

  const { error: insErr } = await supabase.from("verses").insert(rows);
  if (insErr) throw insErr;
}

/** АЛЬТЕРНАТИВА: лише upsert віршів (за унікальним ключем chapter_id,verse_number) */
export async function upsertChapterVerses(supabase: SupabaseClient, chapterId: string, verses: ParsedVerse[]) {
  if (!verses?.length) return;

  const rows = verses.map((v) => ({
    chapter_id: chapterId,
    verse_number: v.verse_number,
    sanskrit: v.sanskrit ?? null,
    transliteration: (v as any).transliteration_en ?? v.transliteration ?? null,
    transliteration_en: (v as any).transliteration_en ?? null,
    transliteration_ua: (v as any).transliteration_ua ?? null,
    synonyms_ua: normalizeSynonymsSoft((v as any).synonyms_ua ?? ""),
    // Fallback to generic EN keys when Python parser returns {synonyms, translation, purport}
    synonyms_en: (v as any).synonyms_en ?? (v as any).synonyms ?? null,
    translation_ua: (v as any).translation_ua ?? null,
    translation_en: (v as any).translation_en ?? (v as any).translation ?? null,
    commentary_ua: safeHtml((v as any).commentary_ua ?? ""),
    commentary_en: safeHtml((v as any).commentary_en ?? (v as any).purport ?? ""),
    audio_url: (v as any).audio_url ?? (v as any).audioUrl ?? null,
  }));

  const { error } = await supabase
    .from("verses")
    .upsert(rows, { onConflict: "chapter_id,verse_number", ignoreDuplicates: false });
  if (error) throw error;
}

/** Імпорт однієї глави (оновити або створити) + вірші (за замовчуванням — повна заміна) */
export async function importSingleChapter(
  supabase: SupabaseClient,
  payload: {
    bookId: string;
    cantoId?: string | null;
    chapter: ParsedChapter;
    /** опційно: "replace" (default) або "upsert" */
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

/** Масовий імпорт усієї книги (послідовно) */
export async function importBook(
  supabase: SupabaseClient,
  payload: {
    bookId: string;
    cantoId?: string | null;
    chapters: ParsedChapter[];
    onProgress?: (info: { index: number; total: number; chapter: ParsedChapter }) => void;
    /** опційно: "replace" (default) або "upsert" */
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
