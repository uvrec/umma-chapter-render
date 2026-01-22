/**
 * Утиліта для імпорту лекцій з JSON (створених Python скриптами)
 *
 * ВАЖЛИВО: Потрібні міграції:
 * - 20251107000001_create_lectures_tables.sql
 * - 20260105120000_create_verse_lectures_junction.sql
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Посилання на вірш для зв'язку лекції з бібліотекою
 */
export interface VerseReference {
  book_slug: string; // 'bg', 'sb', 'scc', 'noi', 'iso'
  canto_number?: number; // Для SB (1-12) або CC (1=adi, 2=madhya, 3=antya)
  canto_lila?: string; // Для CC: 'adi', 'madhya', 'antya'
  chapter_number: number;
  verse_start: number;
  verse_end?: number; // Для діапазонів (напр. 2.7-11)
  is_primary: boolean; // Основна тема лекції чи згадка
}

/**
 * Структура даних для імпорту лекції (з Vanisource parser)
 */
export interface LectureImportData {
  metadata: {
    slug: string;
    title_en: string;
    title_ua?: string; // Опціонально, заповнюється вручну
    lecture_date: string; // YYYY-MM-DD
    location_en: string;
    location_ua?: string; // Опціонально
    lecture_type: string;
    lecture_type_ua?: string; // Опціонально
    audio_url?: string;
    audio_urls?: string[]; // Може бути кілька частин
    book_slug?: string;
    canto_number?: number;
    canto_lila?: string;
    chapter_number?: number;
    verse_start?: number;
    verse_end?: number;
    verse_number?: string; // Оригінальний рядок "7-11"
  };
  paragraphs: Array<{
    paragraph_number: number;
    content_en: string; // Може містити HTML форматування (<i>, <b>)
    content_ua?: string;
    audio_timecode?: number;
    speaker?: string;
    sanskrit_terms?: string[];
  }>;
  verse_references?: VerseReference[];
  sanskrit_terms?: string[];
}

export interface LectureImportResult {
  success: boolean;
  lectureId?: string;
  error?: string;
  paragraphsImported?: number;
  verseLinksCreated?: number;
}

/**
 * Імпортувати лекцію з JSON даних
 */
export async function importLecture(
  data: LectureImportData
): Promise<LectureImportResult> {
  try {
    // Крок 1: Перевірити, чи існує лекція з таким slug
    const { data: existing } = await (supabase as any)
      .from("lectures")
      .select("id")
      .eq("slug", data.metadata.slug)
      .single();

    let lectureId: string;

    // Підготувати дані для запису
    const lectureData = {
      title_en: data.metadata.title_en,
      title_ua: data.metadata.title_uk || null,
      lecture_date: data.metadata.lecture_date,
      location_en: data.metadata.location_en,
      location_ua: data.metadata.location_ua || null,
      lecture_type: data.metadata.lecture_type as any,
      audio_url: data.metadata.audio_url || null,
      book_slug: data.metadata.book_slug || null,
      canto_number: data.metadata.canto_number || null,
      chapter_number: data.metadata.chapter_number || null,
      verse_number: data.metadata.verse_number || null,
    };

    if (existing) {
      // Оновити існуючу лекцію
      const { data: updated, error: updateError } = await supabase
        .from("lectures")
        .update(lectureData)
        .eq("id", existing.id)
        .select("id")
        .single();

      if (updateError) throw updateError;
      lectureId = updated.id;

      // Видалити старі параграфи
      await supabase
        .from("lecture_paragraphs")
        .delete()
        .eq("lecture_id", lectureId);

      // Видалити старі зв'язки з віршами
      await (supabase as any)
        .from("verse_lectures")
        .delete()
        .eq("lecture_id", lectureId);
    } else {
      // Створити нову лекцію
      const { data: created, error: createError } = await supabase
        .from("lectures")
        .insert({
          ...lectureData,
          slug: data.metadata.slug,
        })
        .select("id")
        .single();

      if (createError) throw createError;
      lectureId = created.id;
    }

    // Крок 2: Вставити параграфи
    let paragraphsImported = 0;
    if (data.paragraphs && data.paragraphs.length > 0) {
      const paragraphsToInsert = data.paragraphs.map((p) => ({
        lecture_id: lectureId,
        paragraph_number: p.paragraph_number,
        content_en: p.content_en,
        content_ua: p.content_uk || null,
        audio_timecode: p.audio_timecode || null,
      }));

      const { error: paragraphsError } = await supabase
        .from("lecture_paragraphs")
        .insert(paragraphsToInsert);

      if (paragraphsError) throw paragraphsError;
      paragraphsImported = paragraphsToInsert.length;
    }

    // Крок 3: Створити зв'язки з віршами
    let verseLinksCreated = 0;
    if (data.verse_references && data.verse_references.length > 0) {
      const verseLinksToInsert = data.verse_references.map((ref) => ({
        lecture_id: lectureId,
        book_slug: ref.book_slug,
        canto_number: ref.canto_number || null,
        chapter_number: ref.chapter_number,
        verse_start: ref.verse_start,
        verse_end: ref.verse_end || null,
        is_primary: ref.is_primary,
        // verse_id буде заповнено пізніше функцією find_verse_id
      }));

      const { error: verseLinksError } = await (supabase as any)
        .from("verse_lectures")
        .insert(verseLinksToInsert);

      if (verseLinksError) {
        // Не критична помилка - лекція вже імпортована
        console.warn("[importLecture] Failed to create verse links:", verseLinksError);
      } else {
        verseLinksCreated = verseLinksToInsert.length;
      }
    }

    return {
      success: true,
      lectureId,
      paragraphsImported,
      verseLinksCreated,
    };
  } catch (error: any) {
    console.error("[importLecture] Error:", error);
    return {
      success: false,
      error: error.message || "Невідома помилка",
    };
  }
}

/**
 * Імпортувати багато лекцій (batch)
 */
export async function importLecturesBatch(
  lectures: LectureImportData[],
  onProgress?: (current: number, total: number, slug: string) => void
): Promise<{
  total: number;
  successful: number;
  failed: number;
  totalParagraphs: number;
  totalVerseLinks: number;
  errors: Array<{ slug: string; error: string }>;
}> {
  const results = {
    total: lectures.length,
    successful: 0,
    failed: 0,
    totalParagraphs: 0,
    totalVerseLinks: 0,
    errors: [] as Array<{ slug: string; error: string }>,
  };

  for (let i = 0; i < lectures.length; i++) {
    const lecture = lectures[i];
    onProgress?.(i + 1, lectures.length, lecture.metadata.slug);

    const result = await importLecture(lecture);

    if (result.success) {
      results.successful++;
      results.totalParagraphs += result.paragraphsImported || 0;
      results.totalVerseLinks += result.verseLinksCreated || 0;
    } else {
      results.failed++;
      results.errors.push({
        slug: lecture.metadata.slug,
        error: result.error || "Невідома помилка",
      });
    }

    // Невелика затримка між запитами
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Парсити JSON файл лекції
 */
export function parseLectureJSON(jsonString: string): LectureImportData | null {
  try {
    const data = JSON.parse(jsonString);

    // Валідація структури
    if (!data.metadata || !data.metadata.slug) {
      throw new Error("Невірна структура JSON: відсутні metadata.slug");
    }

    return data as LectureImportData;
  } catch (error: any) {
    console.error("[parseLectureJSON] Error:", error);
    return null;
  }
}

/**
 * Парсити множинні JSON файли (батч-імпорт)
 */
export function parseLecturesJSONBatch(
  jsonStrings: string[]
): LectureImportData[] {
  const lectures: LectureImportData[] = [];

  for (const json of jsonStrings) {
    const parsed = parseLectureJSON(json);
    if (parsed) {
      lectures.push(parsed);
    }
  }

  return lectures;
}

/**
 * Отримати лекції для конкретного вірша
 * Використовує функцію get_verse_lectures з бази даних
 */
export async function getVerseLectures(
  bookSlug: string,
  cantoNumber: number | null,
  chapterNumber: number,
  verseNumber: number
) {
  const { data, error } = await (supabase as any).rpc("get_verse_lectures", {
    p_book_slug: bookSlug,
    p_canto_number: cantoNumber,
    p_chapter_number: chapterNumber,
    p_verse_number: verseNumber,
  });

  if (error) {
    console.error("[getVerseLectures] Error:", error);
    return [];
  }

  return data || [];
}
