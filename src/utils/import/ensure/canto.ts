// src/utils/import/ensure/canto.ts
import { supabase } from "@/integrations/supabase/client";

export type CantoData = {
  title_ua: string;
  title_en: string;
  description_ua?: string;
  description_en?: string;
};

/**
 * Знаходить або створює пісню (canto) для книги
 * @param bookId UUID книги
 * @param cantoNumber Номер пісні
 * @param data Дані для створення нової пісні
 * @returns Існуючий або новостворений запис пісні
 */
export async function ensureCanto(bookId: string, cantoNumber: number, data?: CantoData) {
  // 1. Шукаємо існуючу пісню
  const { data: existing, error: fetchError } = await supabase
    .from('cantos')
    .select('*')
    .eq('book_id', bookId)
    .eq('canto_number', cantoNumber)
    .maybeSingle();
  
  if (fetchError) {
    throw new Error(`Error fetching canto: ${fetchError.message}`);
  }
  
  if (existing) {
    console.log(`  📜 Canto ${cantoNumber} found`);
    return existing;
  }
  
  // 2. Створюємо нову пісню
  if (!data?.title_ua || !data?.title_en) {
    throw new Error('title_ua and title_en required to create canto');
  }
  
  const { data: created, error: insertError } = await supabase
    .from('cantos')
    .insert({
      book_id: bookId,
      canto_number: cantoNumber,
      title_ua: data.title_ua,
      title_en: data.title_en,
      description_ua: data.description_ua || null,
      description_en: data.description_en || null,
      is_published: true
    })
    .select()
    .single();
  
  if (insertError) {
    throw new Error(`Error creating canto: ${insertError.message}`);
  }
  
  console.log(`  ✨ Canto ${cantoNumber} created`);
  return created;
}
