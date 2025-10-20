// src/utils/import/ensure/verse.ts
import { supabase } from "@/integrations/supabase/client";

export type VerseData = {
  verse_number: string;
  language: 'en' | 'uk';
  sanskrit?: string | null;
  transliteration?: string | null;
  synonyms?: string | null;
  translation?: string | null;
  commentary?: string | null;
  audio_url?: string | null;
};

/**
 * Створює або оновлює вірш з підтримкою багатомовності
 * Sanskrit/transliteration - спільні для обох мов
 * Synonyms/translation/commentary - мовно-специфічні (_ua/_en)
 * 
 * @param chapterId UUID глави
 * @param verseData Дані вірша з вказанням мови
 * @returns Створений або оновлений запис вірша
 */
export async function ensureVerse(chapterId: string, verseData: VerseData) {
  if (!verseData.verse_number) {
    throw new Error('verse_number is required');
  }
  
  // 1. Перевіряємо чи існує вірш
  const { data: existing, error: fetchError } = await supabase
    .from('verses')
    .select('*')
    .eq('chapter_id', chapterId)
    .eq('verse_number', verseData.verse_number)
    .maybeSingle();
  
  if (fetchError) {
    throw new Error(`Error fetching verse: ${fetchError.message}`);
  }
  
  // Підготовка даних для вставки/оновлення
  const isUkrainian = verseData.language === 'uk';
  const verseRecord: any = {
    chapter_id: chapterId,
    verse_number: verseData.verse_number,
    is_published: true
  };
  
  // Sanskrit і transliteration - спільні для обох мов
  if (verseData.sanskrit !== undefined) {
    verseRecord.sanskrit = verseData.sanskrit;
  }
  if (verseData.transliteration !== undefined) {
    verseRecord.transliteration = verseData.transliteration;
  }
  if (verseData.audio_url !== undefined) {
    verseRecord.audio_url = verseData.audio_url;
  }
  
  // Мовно-специфічні поля
  if (isUkrainian) {
    if (verseData.synonyms !== undefined) verseRecord.synonyms_ua = verseData.synonyms;
    if (verseData.translation !== undefined) verseRecord.translation_ua = verseData.translation;
    if (verseData.commentary !== undefined) verseRecord.commentary_ua = verseData.commentary;
  } else {
    if (verseData.synonyms !== undefined) verseRecord.synonyms_en = verseData.synonyms;
    if (verseData.translation !== undefined) verseRecord.translation_en = verseData.translation;
    if (verseData.commentary !== undefined) verseRecord.commentary_en = verseData.commentary;
  }
  
  if (existing) {
    // 2a. UPDATE існуючого вірша
    // Мержимо дані: не перезаписуємо існуючі переклади іншою мовою
    const updates: any = {};
    
    // Оновлюємо спільні поля якщо вони передані
    if (verseData.sanskrit !== undefined && verseData.sanskrit !== existing.sanskrit) {
      updates.sanskrit = verseData.sanskrit;
    }
    if (verseData.transliteration !== undefined && verseData.transliteration !== existing.transliteration) {
      updates.transliteration = verseData.transliteration;
    }
    if (verseData.audio_url !== undefined && verseData.audio_url !== existing.audio_url) {
      updates.audio_url = verseData.audio_url;
    }
    
    // Оновлюємо мовно-специфічні поля
    if (isUkrainian) {
      if (verseData.synonyms !== undefined) updates.synonyms_ua = verseData.synonyms;
      if (verseData.translation !== undefined) updates.translation_ua = verseData.translation;
      if (verseData.commentary !== undefined) updates.commentary_ua = verseData.commentary;
    } else {
      if (verseData.synonyms !== undefined) updates.synonyms_en = verseData.synonyms;
      if (verseData.translation !== undefined) updates.translation_en = verseData.translation;
      if (verseData.commentary !== undefined) updates.commentary_en = verseData.commentary;
    }
    
    // Якщо є що оновлювати
    if (Object.keys(updates).length > 0) {
      const { data: updated, error: updateError } = await supabase
        .from('verses')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (updateError) {
        throw new Error(`Error updating verse: ${updateError.message}`);
      }
      
      console.log(`      ♻️  Verse ${verseData.verse_number} updated (${verseData.language})`);
      return updated;
    } else {
      console.log(`      ✓ Verse ${verseData.verse_number} unchanged`);
      return existing;
    }
    
  } else {
    // 2b. INSERT нового вірша
    const { data: created, error: insertError } = await supabase
      .from('verses')
      .insert(verseRecord)
      .select()
      .single();
    
    if (insertError) {
      throw new Error(`Error creating verse: ${insertError.message}`);
    }
    
    console.log(`      ✨ Verse ${verseData.verse_number} created (${verseData.language})`);
    return created;
  }
}
