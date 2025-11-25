/**
 * Утиліта для імпорту лекцій з JSON (створених Python скриптами)
 *
 * ВАЖЛИВО: Потрібна міграція 20251107000001_create_lectures_tables.sql
 */

import { supabase } from "@/integrations/supabase/client";

export interface LectureImportData {
  metadata: {
    slug: string;
    title_en: string;
    title_ua: string;
    lecture_date: string; // YYYY-MM-DD
    location_en: string;
    location_ua: string;
    lecture_type: string;
    lecture_type_ua: string;
    audio_url?: string;
    book_slug?: string;
    chapter_number?: number;
    verse_number?: string;
  };
  paragraphs: Array<{
    paragraph_number: number;
    content_en: string;
    content_ua?: string;
    audio_timecode?: number;
    sanskrit_terms?: string[];
  }>;
  sanskrit_terms?: string[];
}

export interface LectureImportResult {
  success: boolean;
  lectureId?: string;
  error?: string;
  paragraphsImported?: number;
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

    if (existing) {
      // Оновити існуючу лекцію
      const { data: updated, error: updateError } = await supabase
        .from("lectures")
        .update({
          title_en: data.metadata.title_en,
          title_ua: data.metadata.title_ua,
          lecture_date: data.metadata.lecture_date,
          location_en: data.metadata.location_en,
          location_ua: data.metadata.location_ua,
          lecture_type: data.metadata.lecture_type as any,
          audio_url: data.metadata.audio_url,
          book_slug: data.metadata.book_slug,
          chapter_number: data.metadata.chapter_number,
          verse_number: data.metadata.verse_number,
        })
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
    } else {
      // Створити нову лекцію
      const { data: created, error: createError} = await supabase
        .from("lectures")
        .insert({
          title_en: data.metadata.title_en,
          title_ua: data.metadata.title_ua,
          lecture_date: data.metadata.lecture_date,
          location_en: data.metadata.location_en,
          location_ua: data.metadata.location_ua,
          lecture_type: data.metadata.lecture_type as any,
          audio_url: data.metadata.audio_url,
          book_slug: data.metadata.book_slug,
          chapter_number: data.metadata.chapter_number,
          verse_number: data.metadata.verse_number,
          slug: data.metadata.slug,
        })
        .select("id")
        .single();

      if (createError) throw createError;
      lectureId = created.id;
    }

    // Крок 2: Вставити параграфи
    if (data.paragraphs && data.paragraphs.length > 0) {
      const paragraphsToInsert = data.paragraphs.map((p) => ({
        lecture_id: lectureId,
        paragraph_number: p.paragraph_number,
        content_en: p.content_en,
        content_ua: p.content_ua || null,
        audio_timecode: p.audio_timecode || null,
      }));

      const { error: paragraphsError } = await supabase
        .from("lecture_paragraphs")
        .insert(paragraphsToInsert);

      if (paragraphsError) throw paragraphsError;
    }

    return {
      success: true,
      lectureId,
      paragraphsImported: data.paragraphs?.length || 0,
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
  errors: Array<{ slug: string; error: string }>;
}> {
  const results = {
    total: lectures.length,
    successful: 0,
    failed: 0,
    errors: [] as Array<{ slug: string; error: string }>,
  };

  for (let i = 0; i < lectures.length; i++) {
    const lecture = lectures[i];
    onProgress?.(i + 1, lectures.length, lecture.metadata.slug);

    const result = await importLecture(lecture);

    if (result.success) {
      results.successful++;
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
