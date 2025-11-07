/**
 * Утиліта для імпорту листів Прабгупади з JSON (створених Python скриптами)
 *
 * ВАЖЛИВО: Потрібна міграція 20251107000002_create_letters_tables.sql
 */

import { supabase } from "@/integrations/supabase/client";
import type { LetterImportData } from "@/types/letter";

export interface LetterImportResult {
  success: boolean;
  letterId?: string;
  error?: string;
}

/**
 * Імпортувати лист з JSON даних
 */
export async function importLetter(
  data: LetterImportData
): Promise<LetterImportResult> {
  try {
    // Крок 1: Перевірити, чи існує лист з таким slug
    const { data: existing } = await supabase
      .from("letters")
      .select("id")
      .eq("slug", data.metadata.slug)
      .single();

    let letterId: string;

    if (existing) {
      // Оновити існуючий лист
      const { data: updated, error: updateError } = await supabase
        .from("letters")
        .update({
          recipient_en: data.metadata.recipient_en,
          recipient_ua: data.metadata.recipient_ua,
          letter_date: data.metadata.letter_date,
          location_en: data.metadata.location_en,
          location_ua: data.metadata.location_ua,
          reference: data.metadata.reference,
          address_block: data.metadata.address_block,
          content_en: data.content_en,
          content_ua: data.content_ua || null,
        })
        .eq("id", existing.id)
        .select("id")
        .single();

      if (updateError) throw updateError;
      letterId = updated.id;
    } else {
      // Створити новий лист
      const { data: created, error: createError } = await supabase
        .from("letters")
        .insert({
          slug: data.metadata.slug,
          recipient_en: data.metadata.recipient_en,
          recipient_ua: data.metadata.recipient_ua,
          letter_date: data.metadata.letter_date,
          location_en: data.metadata.location_en,
          location_ua: data.metadata.location_ua,
          reference: data.metadata.reference,
          address_block: data.metadata.address_block,
          content_en: data.content_en,
          content_ua: data.content_ua || null,
        })
        .select("id")
        .single();

      if (createError) throw createError;
      letterId = created.id;
    }

    return {
      success: true,
      letterId,
    };
  } catch (error: any) {
    console.error("[importLetter] Error:", error);
    return {
      success: false,
      error: error.message || "Невідома помилка",
    };
  }
}

/**
 * Імпортувати багато листів (batch)
 */
export async function importLettersBatch(
  letters: LetterImportData[],
  onProgress?: (current: number, total: number, slug: string) => void
): Promise<{
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ slug: string; error: string }>;
}> {
  const results = {
    total: letters.length,
    successful: 0,
    failed: 0,
    errors: [] as Array<{ slug: string; error: string }>,
  };

  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i];
    onProgress?.(i + 1, letters.length, letter.metadata.slug);

    const result = await importLetter(letter);

    if (result.success) {
      results.successful++;
    } else {
      results.failed++;
      results.errors.push({
        slug: letter.metadata.slug,
        error: result.error || "Невідома помилка",
      });
    }

    // Невелика затримка між запитами
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Парсити JSON файл листа
 */
export function parseLetterJSON(jsonString: string): LetterImportData | null {
  try {
    const data = JSON.parse(jsonString);

    // Валідація структури
    if (!data.metadata || !data.metadata.slug) {
      throw new Error("Невірна структура JSON: відсутні metadata.slug");
    }

    if (!data.content_en) {
      throw new Error("Невірна структура JSON: відсутній content_en");
    }

    return data as LetterImportData;
  } catch (error: any) {
    console.error("[parseLetterJSON] Error:", error);
    return null;
  }
}

/**
 * Парсити множинні JSON файли (батч-імпорт)
 */
export function parseLettersJSONBatch(
  jsonStrings: string[]
): LetterImportData[] {
  const letters: LetterImportData[] = [];

  for (const json of jsonStrings) {
    const parsed = parseLetterJSON(json);
    if (parsed) {
      letters.push(parsed);
    }
  }

  return letters;
}
