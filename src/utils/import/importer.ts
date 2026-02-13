// src/utils/import/importer.ts
import { SupabaseClient } from "@supabase/supabase-js";
import type { ParsedChapter, ParsedVerse } from "@/types/book-import";
import { processVerseLineBreaks } from "./lineBreaker";

/**
 * Нормалізує номер вірша: видаляє префікси типу "1.1." з формату WisdomLib
 *
 * @example
 * normalizeVerseNumberForDB("1.1.73-74") // → "73-74"
 * normalizeVerseNumberForDB("2.17.48") // → "48"
 * normalizeVerseNumberForDB("73-74") // → "73-74" (без змін)
 * normalizeVerseNumberForDB("42") // → "42" (без змін)
 */
export const normalizeVerseNumberForDB = (verseNum: string): string => {
  if (!verseNum) return verseNum;

  const trimmed = verseNum.trim();

  // Видаляємо префікси формату "N.N." на початку
  // Regex: починається з цифр, крапка, цифри, крапка → видаляємо
  const normalized = trimmed.replace(/^\d+\.\d+\./, '');

  // Якщо номер змінився - логуємо для діагностики
  if (normalized !== trimmed) {
    console.warn(`⚠️ [Importer] Normalized verse number: "${trimmed}" → "${normalized}"`);
  }

  return normalized;
};

/** Санітизація HTML на імпорті (додатковий "пояс безпеки" до DOMPurify на рендері) */
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

/** Перевірка чи це fallback-назва (автоматично згенерована) */
const isFallbackTitle = (title: string, chapterNum: number, extras: string[] = []): boolean => {
  const cleaned = (title || "").trim();
  if (!cleaned) return true;

  const n = chapterNum;
  
  // Базові автогенеровані варіанти
  const patterns = [
    `^(Глава|Розділ|Chapter|Song|Пісня)\\s*${n}(?:\\s*[.:—-])?$`,
    // Формати типу "CC madhya 24", "SB 1.1", "BG 2.13"
    `^[A-Z]{1,4}\\s+(madhya|adi|antya|lila|canto)?\\s*${n}$`,
    // Формати з назвою lila
    `(madhya|adi|antya)\\s*lila\\s*${n}$`,
    `(madhya|adi|antya)\\s*${n}$`,
    // Формати типу "Canto 1", "Madhya 24"
    `^(Canto|Madhya|Adi|Antya)\\s*${n}$`,
    // Повні назви типу "Шрі Чайтанья-чарітамріта madhya 24"
    `чайтанья.*madhya\\s*${n}`,
    `чайтанья.*adi\\s*${n}`,
    `чайтанья.*antya\\s*${n}`,
    `bhagavatam.*canto\\s*${n}`,
    `шрімад.*пісня\\s*${n}`,
  ];

  // Перевірка по всіх патернах
  const matchesPattern = patterns.some(p => new RegExp(p, "i").test(cleaned));
  if (matchesPattern) return true;

  // Додаткові "дефолтні" значення з форми (назва книги/канто тощо)
  const baseExtras = new Set<string>();
  for (const e of extras) {
    const v = (e || "").trim().toLowerCase();
    if (v) {
      baseExtras.add(v);
      // Також додати варіанти з номером
      baseExtras.add(`${v} ${n}`);
      baseExtras.add(`${v} ${n}`.replace(/\s+/g, ' '));
      
      // Перевірка чи назва містить фрагменти з extras + номер
      const words = v.split(/\s+/);
      for (const word of words) {
        if (word.length > 3) {
          const titleLower = cleaned.toLowerCase();
          if (titleLower.includes(word) && titleLower.includes(String(n))) {
            return true;
          }
        }
      }
    }
  }

  return baseExtras.has(cleaned.toLowerCase());
};

/** Пошук або створення глави (bookId/cantoId + chapter_number) з оновленням полів */
export async function upsertChapter(
  supabase: SupabaseClient,
  params: {
    bookId: string;
    cantoId?: string | null;
    chapter_number: number;
    chapter_type: "verses" | "text";
    title_uk?: string;
    title_en?: string;
    content_uk?: string;
    content_en?: string;
  },
): Promise<string> {
  const { bookId, cantoId, chapter_number } = params;

  // ✅ КРИТИЧНО: Спочатку шукаємо існуючу главу по chapter_number і book_id
  // Це дозволить знайти главу навіть якщо вона була створена без canto_id
  let existingChapter: any = null;
  
  // Спочатку пробуємо знайти з правильним canto_id (якщо є)
  if (cantoId) {
    const { data } = await supabase
      .from("chapters")
      .select("id, title_uk, title_en, content_uk, content_en, canto_id")
      .eq("chapter_number", chapter_number)
      .eq("canto_id", cantoId)
      .maybeSingle();
    existingChapter = data;
  }
  
  // Якщо не знайшли або не було cantoId, шукаємо по book_id
  if (!existingChapter) {
    const { data } = await supabase
      .from("chapters")
      .select("id, title_uk, title_en, content_uk, content_en, canto_id")
      .eq("chapter_number", chapter_number)
      .eq("book_id", bookId)
      .maybeSingle();
    existingChapter = data;
  }

  // Load book/canto titles to treat certain UI defaults as fallback
  let fallbackExtras: string[] = [];
  try {
    const { data: bookMeta } = await supabase
      .from("books")
      .select("title_uk, title_en")
      .eq("id", bookId)
      .maybeSingle();
    if (bookMeta) fallbackExtras.push(bookMeta.title_uk || "", bookMeta.title_en || "");
    if (cantoId) {
      const { data: cantoMeta } = await supabase
        .from("cantos")
        .select("title_uk, title_en")
        .eq("id", cantoId)
        .maybeSingle();
      if (cantoMeta) fallbackExtras.push(cantoMeta.title_uk || "", cantoMeta.title_en || "");
    }
  } catch {
    // ignore
  }
  fallbackExtras = fallbackExtras.filter(Boolean);

  // Build payloads carefully to avoid overwriting existing titles when not provided
  const baseRefs: any = {};
  if (cantoId) baseRefs.canto_id = cantoId;
  else baseRefs.book_id = bookId;

  const hasText = (v?: string) => typeof v === 'string' && v.trim().length > 0;

  // Insert payload: can include defaults
  const uaTitle = params.title_uk || params.title_en || `Глава ${chapter_number}`;
  const enTitle = params.title_en || params.title_uk || `Chapter ${chapter_number}`;
  const insertPayload: any = {
    ...baseRefs,
    chapter_number,
    chapter_type: params.chapter_type,
    title_uk: uaTitle,
    // ✅ Ensure title_en always has a value (database NOT NULL constraint)
    title_en: enTitle,
    content_uk: safeHtml(params.content_uk),
    content_en: safeHtml(params.content_en),
  };

  // Update payload: оновлюємо прив'язку та тип, але НІКОЛИ не чіпаємо назви,
  // якщо користувач явно їх не змінив (і це не fallback)
  const updatePayload: any = {
    ...baseRefs,
    chapter_type: params.chapter_type,
  };

  console.log('🔍 upsertChapter: Отримав параметри', {
    chapter_number,
    title_uk: params.title_uk,
    title_en: params.title_en,
    title_uk_provided: params.title_uk !== undefined,
    title_en_provided: params.title_en !== undefined,
    existing_chapter_id: existingChapter?.id,
    existing_title_uk: existingChapter?.title_uk,
    existing_title_en: existingChapter?.title_en,
  });

  // ✅ КРИТИЧНО: Оновлюємо назви ЛИШЕ якщо:
  // 1. Параметр явно переданий (не undefined)
  // 2. Має текст
  // 3. НЕ є fallback
  if (params.title_uk !== undefined && hasText(params.title_uk) && !isFallbackTitle(params.title_uk, chapter_number, fallbackExtras)) {
    console.log('🔍 upsertChapter: Оновлюємо title_uk');
    updatePayload.title_uk = params.title_uk;
  } else {
    console.log('🔍 upsertChapter: НЕ оновлюємо title_uk (undefined або fallback)');
  }
  
  if (params.title_en !== undefined && hasText(params.title_en) && !isFallbackTitle(params.title_en, chapter_number, fallbackExtras)) {
    console.log('🔍 upsertChapter: Оновлюємо title_en');
    updatePayload.title_en = params.title_en;
  } else {
    console.log('🔍 upsertChapter: НЕ оновлюємо title_en (undefined або fallback)');
  }

  if (typeof params.content_uk === 'string' && hasText(params.content_uk)) updatePayload.content_uk = safeHtml(params.content_uk);
  if (typeof params.content_en === 'string' && hasText(params.content_en)) updatePayload.content_en = safeHtml(params.content_en);

  if (existingChapter?.id) {
    console.log('🔍 upsertChapter: Update payload', updatePayload);
    const { error: updErr } = await supabase.from("chapters").update(updatePayload).eq("id", existingChapter.id);
    if (updErr) {
      console.error(`❌ Помилка оновлення розділу ${chapter_number}:`, updErr);
      throw new Error(`Розділ ${chapter_number}: ${updErr.message}`);
    }
    return existingChapter.id;
  } else {
    console.log('🔍 upsertChapter: Insert payload', insertPayload);
    const { data: created, error: insErr } = await supabase.from("chapters").insert(insertPayload).select("id").single();
    if (insErr) {
      console.error(`❌ Помилка створення розділу ${chapter_number}:`, insErr);
      throw new Error(`Розділ ${chapter_number}: ${insErr.message}`);
    }
    return created.id;
  }
}

/** Повна заміна віршів глави: delete all -> insert */
export async function replaceChapterVerses(
  supabase: SupabaseClient,
  chapterId: string,
  verses: ParsedVerse[],
  _opts?: { language?: "uk" | "en" },
) {
  const { error: delErr } = await supabase.from("verses").delete().eq("chapter_id", chapterId);
  if (delErr) {
    console.error(`❌ Помилка видалення віршів розділу ${chapterId}:`, delErr);
    throw new Error(`Видалення віршів розділу ${chapterId}: ${delErr.message}`);
  }

  if (!verses?.length) return;

  const rows = verses.map((v) => {
    // ✅ АВТОМАТИЧНА НОРМАЛІЗАЦІЯ розривів рядків за дандами (।, ॥)
    const sanskrit = v.sanskrit ?? null;
    const transliteration = (v as any).transliteration_en ?? v.transliteration ?? null;

    // Застосовуємо нормалізацію тільки якщо санскрит БЕЗ розривів рядків
    let normalizedSanskrit = sanskrit;
    let normalizedTranslit = transliteration;

    if (sanskrit && !sanskrit.includes('\n')) {
      const fixed = processVerseLineBreaks({ sanskrit, transliteration });
      normalizedSanskrit = fixed.sanskrit ?? sanskrit;
      normalizedTranslit = fixed.transliteration ?? transliteration;
      console.log(`📝 Додано розриви рядків для вірша ${v.verse_number}`);
    }

    return {
      chapter_id: chapterId,
      verse_number: normalizeVerseNumberForDB(v.verse_number), // ✅ Нормалізуємо номер
      sanskrit: normalizedSanskrit,
      transliteration: normalizedTranslit,
      transliteration_en: (v as any).transliteration_en ?? null,
      transliteration_uk: (v as any).transliteration_uk ?? null,
      synonyms_uk: normalizeSynonymsSoft((v as any).synonyms_uk ?? ""),
      // Fallback to generic EN keys when Python parser returns {synonyms, translation, purport}
      synonyms_en: (v as any).synonyms_en ?? (v as any).synonyms ?? null,
      translation_uk: (v as any).translation_uk ?? null,
      translation_en: (v as any).translation_en ?? (v as any).translation ?? null,
      commentary_uk: safeHtml(stripSectionLabel((v as any).commentary_uk ?? "")),
      commentary_en: safeHtml(stripSectionLabel((v as any).commentary_en ?? (v as any).purport ?? "")),
      // підтримуємо і audioUrl (camelCase), і audio_url (snake_case)
      audio_url: (v as any).audio_url ?? (v as any).audioUrl ?? null,
      is_published: true,
    };
  });

  const { error: insErr } = await supabase.from("verses").insert(rows);
  if (insErr) {
    const verseNumbers = verses.map(v => v.verse_number).join(', ');
    console.error(`❌ Помилка вставки віршів (${verses.length} віршів: ${verseNumbers}):`, insErr);
    throw new Error(`Вставка віршів [${verseNumbers}]: ${insErr.message}`);
  }
}

/** АЛЬТЕРНАТИВА: лише upsert віршів (за унікальним ключем chapter_id,verse_number) */
export async function upsertChapterVerses(supabase: SupabaseClient, chapterId: string, verses: ParsedVerse[]) {
  if (!verses?.length) return;

  // Load existing verses to preserve curated content and Bengali when present
  const { data: existingRows, error: exErr } = await supabase
    .from("verses")
    .select(
      "id, verse_number, sanskrit, transliteration, transliteration_en, transliteration_uk, synonyms_uk, synonyms_en, translation_uk, translation_en, commentary_uk, commentary_en, audio_url"
    )
    .eq("chapter_id", chapterId);
  if (exErr) throw exErr;

  const byNum = new Map<string, any>((existingRows || []).map((r: any) => [String(r.verse_number), r]));
  const hasText = (v?: string) => typeof v === "string" && v.trim().length > 0;
  const isEmpty = (v?: string | null) => !v || v.trim().length === 0;

  const rows = verses.map((v) => {
    const incoming: any = v as any;
    const normalizedVerseNum = normalizeVerseNumberForDB(v.verse_number); // ✅ Нормалізуємо
    const existing = byNum.get(String(normalizedVerseNum));
    const row: any = {
      chapter_id: chapterId,
      verse_number: normalizedVerseNum, // ✅ Використовуємо нормалізований номер
      is_published: true,
    };

    // ✅ АВТОМАТИЧНА НОРМАЛІЗАЦІЯ розривів рядків за дандами (।, ॥)
    let sanskritToUse = incoming.sanskrit;
    let translitToUse = incoming.transliteration;

    // Застосовуємо нормалізацію якщо є санскрит БЕЗ розривів рядків
    if (hasText(incoming.sanskrit) && !incoming.sanskrit.includes('\n')) {
      const fixed = processVerseLineBreaks({
        sanskrit: incoming.sanskrit,
        transliteration: incoming.transliteration
      });
      sanskritToUse = fixed.sanskrit ?? incoming.sanskrit;
      translitToUse = fixed.transliteration ?? incoming.transliteration;
      console.log(`📝 Додано розриви рядків для вірша ${v.verse_number} (upsert)`);
    }

    // Preserve existing Bengali/Sanskrit if incoming is missing; set null only for new rows
    if (hasText(sanskritToUse)) row.sanskrit = sanskritToUse;
    else if (!existing) row.sanskrit = null;

    // Transliteration fields - update only when provided
    if (hasText(translitToUse)) row.transliteration = translitToUse;
    if (hasText(incoming.transliteration_en)) row.transliteration_en = incoming.transliteration_en;
    if (hasText(incoming.transliteration_uk)) row.transliteration_uk = incoming.transliteration_uk;

    // EN blocks: update whenever provided
    if (hasText(incoming.synonyms_en)) row.synonyms_en = incoming.synonyms_en;
    else if (hasText(incoming.synonyms)) row.synonyms_en = incoming.synonyms;

    if (hasText(incoming.translation_en)) row.translation_en = incoming.translation_en;
    else if (hasText(incoming.translation)) row.translation_en = incoming.translation;

    if (hasText(incoming.commentary_en) || hasText(incoming.purport)) {
      row.commentary_en = safeHtml(stripSectionLabel(incoming.commentary_en ?? incoming.purport));
    }

    // ✅ UA blocks: ЗАВЖДИ оновлюємо, якщо incoming має текст (не лише коли existing порожній)
    if (hasText(incoming.synonyms_uk)) {
      row.synonyms_uk = normalizeSynonymsSoft(incoming.synonyms_uk);
    }
    if (hasText(incoming.translation_uk)) {
      row.translation_uk = incoming.translation_uk;
    }
    if (hasText(incoming.commentary_uk)) {
      row.commentary_uk = safeHtml(stripSectionLabel(incoming.commentary_uk));
    }

    // Audio URL - update when provided
    if (hasText(incoming.audio_url)) row.audio_url = incoming.audio_url;
    if (hasText(incoming.audioUrl)) row.audio_url = incoming.audioUrl;

    return row;
  });

  const { error } = await supabase
    .from("verses")
    .upsert(rows, { onConflict: "chapter_id,verse_number", ignoreDuplicates: false });
  if (error) {
    const verseNumbers = verses.map(v => v.verse_number).join(', ');
    console.error(`❌ Помилка upsert віршів (${verses.length} віршів: ${verseNumbers}):`, error);
    throw new Error(`Upsert віршів [${verseNumbers}]: ${error.message}`);
  }
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
    title_uk: chapter.title_uk,
    title_en: chapter.title_en,
    content_uk: chapter.content_uk,
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
