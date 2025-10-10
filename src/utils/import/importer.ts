// src/utils/import/importer.ts
import { SupabaseClient } from "@supabase/supabase-js";
import type { ParsedChapter, ParsedVerse } from "@/types/book-import";

/** Мінімальна санітизація HTML (зберігаємо розмітку/форматування) */
export const safeHtml = (html?: string) =>
  (html ?? "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .trim();

/** Нормалізація послівного (мʼяка) */
export const normalizeSynonymsSoft = (s?: string) =>
  (s ?? "")
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

/** Пошук або створення глави (upsert) */
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

/** Повністю замінює вірші глави: видаляє всі старі, вставляє нові */
export async function replaceChapterVerses(supabase: SupabaseClient, chapterId: string, verses: ParsedVerse[]) {
  const { error: delErr } = await supabase.from("verses").delete().eq("chapter_id", chapterId);
  if (delErr) throw delErr;

  if (!verses?.length) return;

  // мапінг audioUrl → audio_url (бек очікує snake_case)
  const rows = verses.map((v) => ({
    chapter_id: chapterId,
    verse_number: v.verse_number,
    sanskrit: v.sanskrit ?? null,
    transliteration: v.transliteration ?? null,
    synonyms_ua: normalizeSynonymsSoft(v.synonyms_ua ?? ""),
    synonyms_en: v.synonyms_en ?? null,
    translation_ua: v.translation_ua ?? null,
    translation_en: v.translation_en ?? null,
    commentary_ua: safeHtml(v.commentary_ua ?? ""),
    commentary_en: safeHtml(v.commentary_en ?? ""),
    audio_url: (v as any).audio_url ?? (v as any).audioUrl ?? null,
  }));

  const { error: insErr } = await supabase.from("verses").insert(rows);
  if (insErr) throw insErr;
}

/** Імпорт однієї глави (upsert глави + повна заміна віршів) */
export async function importSingleChapter(
  supabase: SupabaseClient,
  payload: {
    bookId: string;
    cantoId?: string | null;
    chapter: ParsedChapter;
  },
) {
  const { bookId, cantoId, chapter } = payload;

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
    await replaceChapterVerses(supabase, chapterId, chapter.verses ?? []);
  }
}

/** Масовий імпорт усієї книги */
export async function importBook(
  supabase: SupabaseClient,
  payload: {
    bookId: string;
    cantoId?: string | null;
    chapters: ParsedChapter[];
    onProgress?: (info: { index: number; total: number; chapter: ParsedChapter }) => void;
  },
) {
  const { bookId, cantoId, chapters, onProgress } = payload;
  const total = chapters.length;

  for (let i = 0; i < total; i++) {
    const ch = chapters[i];
    await importSingleChapter(supabase, { bookId, cantoId: cantoId ?? null, chapter: ch });
    onProgress?.({ index: i + 1, total, chapter: ch });
  }
}
