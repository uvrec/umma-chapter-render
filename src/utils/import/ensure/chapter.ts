// src/utils/import/ensure/chapter.ts
import { supabase } from "@/integrations/supabase/client";

export type ChapterParams = {
  bookId?: string;
  cantoId?: string;
  chapterNumber: number;
  title_ua: string;
  title_en: string;
  content_ua?: string;
  content_en?: string;
  content_structure?: 'full' | 'text_only';
  chapter_type?: 'verses' | 'text';
};

/**
 * Знаходить або створює главу для книги або пісні
 * Оновлює content_ua/content_en якщо глава вже існує
 * @returns Існуючий або новостворений запис глави
 */
export async function ensureChapter(params: ChapterParams) {
  if (!params.bookId && !params.cantoId) {
    throw new Error('Either bookId or cantoId required');
  }
  
  // 1. Шукаємо існуючу главу
  let query = supabase
    .from('chapters')
    .select('*')
    .eq('chapter_number', params.chapterNumber);
  
  if (params.cantoId) {
    query = query.eq('canto_id', params.cantoId);
  } else if (params.bookId) {
    query = query.eq('book_id', params.bookId).is('canto_id', null);
  }
  
  const { data: existing, error: fetchError } = await query.maybeSingle();
  
  if (fetchError) {
    throw new Error(`Error fetching chapter: ${fetchError.message}`);
  }
  
  if (existing) {
    // Оновлюємо content якщо передано
    if (params.content_ua || params.content_en) {
      const updates: any = {};
      if (params.content_ua) updates.content_ua = params.content_ua;
      if (params.content_en) updates.content_en = params.content_en;
      
      const { data: updated } = await supabase
        .from('chapters')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();
      
      console.log(`    📄 Chapter ${params.chapterNumber} updated`);
      return updated || existing;
    }
    
    console.log(`    📄 Chapter ${params.chapterNumber} found`);
    return existing;
  }
  
  // 2. Створюємо нову главу
  const { data: created, error: insertError } = await supabase
    .from('chapters')
    .insert({
      book_id: params.bookId || null,
      canto_id: params.cantoId || null,
      chapter_number: params.chapterNumber,
      chapter_type: params.chapter_type || 'verses',
      title_ua: params.title_ua,
      title_en: params.title_en,
      content_ua: params.content_ua || null,
      content_en: params.content_en || null,
      content_structure: params.content_structure || 'full',
      is_published: true
    })
    .select()
    .single();
  
  if (insertError) {
    throw new Error(`Error creating chapter: ${insertError.message}`);
  }
  
  console.log(`    ✨ Chapter ${params.chapterNumber} created`);
  return created;
}
