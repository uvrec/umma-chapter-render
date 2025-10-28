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

/** Прибирає службові мітки на початку блоку типу "ПОЯСНЕННЯ:", "PURPORT:" */
export const stripSectionLabel = (s?: string) =>
  (s ?? "")
    .replace(/^\s*(ПОЯСНЕННЯ|КОМЕНТАРІЙ|КОМЕНТАР|COMMENTARY|PURPORT)\s*[:—-]?\s*/i, "")
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

  // ✅ КРИТИЧНО: Спочатку завантажимо існуючу главу, щоб зберегти назви
  const { data: existingChapter } = await supabase
    .from("chapters")
    .select("id, title_ua, title_en, content_ua, content_en")
    .eq("chapter_number", chapter_number)
    .eq(cantoId ? "canto_id" : "book_id", cantoId || bookId)
    .maybeSingle();

  // Build payloads carefully to avoid overwriting existing titles when not provided
  const baseRefs: any = {};
  if (cantoId) baseRefs.canto_id = cantoId;
  else baseRefs.book_id = bookId;

  const hasText = (v?: string) => typeof v === 'string' && v.trim().length > 0;

  // Insert payload: can include defaults
  const insertPayload: any = {
    ...baseRefs,
    chapter_number,
    chapter_type: params.chapter_type,
    title_ua: params.title_ua ?? null,
    title_en: params.title_en ?? null,
    content_ua: safeHtml(params.content_ua),
    content_en: safeHtml(params.content_en),
  };

  // Update payload: ✅ Зберігаємо існуючі назви, якщо нові не надані
  const updatePayload: any = {
    ...baseRefs,
    chapter_type: params.chapter_type,
  };
  if (hasText(params.title_ua)) {
    updatePayload.title_ua = params.title_ua;
  } else if (existingChapter?.title_ua) {
    updatePayload.title_ua = existingChapter.title_ua;
  }
  if (hasText(params.title_en)) {
    updatePayload.title_en = params.title_en;
  } else if (existingChapter?.title_en) {
    updatePayload.title_en = existingChapter.title_en;
  }
  if (typeof params.content_ua === 'string' && hasText(params.content_ua)) updatePayload.content_ua = safeHtml(params.content_ua);
  if (typeof params.content_en === 'string' && hasText(params.content_en)) updatePayload.content_en = safeHtml(params.content_en);

  if (existingChapter?.id) {
    const { error: updErr } = await supabase.from("chapters").update(updatePayload).eq("id", existingChapter.id);
    if (updErr) throw updErr;
    return existingChapter.id;
  } else {
    const { data: created, error: insErr } = await supabase.from("chapters").insert(insertPayload).select("id").single();
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
    commentary_ua: safeHtml(stripSectionLabel((v as any).commentary_ua ?? "")),
    commentary_en: safeHtml(stripSectionLabel((v as any).commentary_en ?? (v as any).purport ?? "")),
    // підтримуємо і audioUrl (camelCase), і audio_url (snake_case)
    audio_url: (v as any).audio_url ?? (v as any).audioUrl ?? null,
  }));

  const { error: insErr } = await supabase.from("verses").insert(rows);
  if (insErr) throw insErr;
}

/** АЛЬТЕРНАТИВА: лише upsert віршів (за унікальним ключем chapter_id,verse_number) */
export async function upsertChapterVerses(supabase: SupabaseClient, chapterId: string, verses: ParsedVerse[]) {
  if (!verses?.length) return;

  // Load existing verses to preserve curated content and Bengali when present
  const { data: existingRows, error: exErr } = await supabase
    .from("verses")
    .select(
      "id, verse_number, sanskrit, transliteration, transliteration_en, transliteration_ua, synonyms_ua, synonyms_en, translation_ua, translation_en, commentary_ua, commentary_en, audio_url"
    )
    .eq("chapter_id", chapterId);
  if (exErr) throw exErr;

  const byNum = new Map<string, any>((existingRows || []).map((r: any) => [String(r.verse_number), r]));
  const hasText = (v?: string) => typeof v === "string" && v.trim().length > 0;
  const isEmpty = (v?: string | null) => !v || v.trim().length === 0;

  const rows = verses.map((v) => {
    const incoming: any = v as any;
    const existing = byNum.get(String(v.verse_number));
    const row: any = {
      chapter_id: chapterId,
      verse_number: v.verse_number,
    };

    // Preserve existing Bengali/Sanskrit if incoming is missing; set null only for new rows
    if (hasText(incoming.sanskrit)) row.sanskrit = incoming.sanskrit;
    else if (!existing) row.sanskrit = null;

    // Transliteration fields - update only when provided
    if (hasText(incoming.transliteration)) row.transliteration = incoming.transliteration;
    if (hasText(incoming.transliteration_en)) row.transliteration_en = incoming.transliteration_en;
    if (hasText(incoming.transliteration_ua)) row.transliteration_ua = incoming.transliteration_ua;

    // EN blocks: update whenever provided
    if (hasText(incoming.synonyms_en)) row.synonyms_en = incoming.synonyms_en;
    else if (hasText(incoming.synonyms)) row.synonyms_en = incoming.synonyms;

    if (hasText(incoming.translation_en)) row.translation_en = incoming.translation_en;
    else if (hasText(incoming.translation)) row.translation_en = incoming.translation;

    if (hasText(incoming.commentary_en) || hasText(incoming.purport)) {
      row.commentary_en = safeHtml(stripSectionLabel(incoming.commentary_en ?? incoming.purport));
    }

    // ✅ UA blocks: ЗАВЖДИ оновлюємо, якщо incoming має текст (не лише коли existing порожній)
    if (hasText(incoming.synonyms_ua)) {
      row.synonyms_ua = normalizeSynonymsSoft(incoming.synonyms_ua);
    }
    if (hasText(incoming.translation_ua)) {
      row.translation_ua = incoming.translation_ua;
    }
    if (hasText(incoming.commentary_ua)) {
      row.commentary_ua = safeHtml(stripSectionLabel(incoming.commentary_ua));
    }

    // Audio URL - update when provided
    if (hasText(incoming.audio_url)) row.audio_url = incoming.audio_url;
    if (hasText(incoming.audioUrl)) row.audio_url = incoming.audioUrl;

    return row;
  });

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
