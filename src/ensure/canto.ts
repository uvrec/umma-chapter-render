// src/ensure/canto.ts
import { getSupabase } from '../lib/supabase.js';
import type { Database } from '../types/database.js';

type CantoRow = Database['public']['Tables']['cantos']['Row'];
type CantoInsert = Database['public']['Tables']['cantos']['Insert'];

export type CantoData = {
  title_ua: string;
  title_en: string;
  description_ua?: string;
  description_en?: string;
  cover_image_url?: string;
};

/**
 * Ensure canto exists, create if missing (idempotent)
 * Uses unique constraint on (book_id, canto_number)
 */
export async function ensureCanto(
  bookId: string,
  cantoNumber: number,
  data?: CantoData
): Promise<CantoRow> {
  const sb = getSupabase();
  
  if (!data?.title_ua || !data?.title_en) {
    throw new Error('title_ua and title_en required for canto');
  }
  
  const insertData: CantoInsert = {
    book_id: bookId,
    canto_number: cantoNumber,
    title_ua: data.title_ua,
    title_en: data.title_en,
    description_ua: data.description_ua || null,
    description_en: data.description_en || null,
    cover_image_url: data.cover_image_url || null,
    is_published: true
  };
  
  // Upsert with conflict resolution on (book_id, canto_number)
  const { data: result, error } = await sb
    .from('cantos')
    .upsert(insertData, {
      onConflict: 'book_id,canto_number',
      ignoreDuplicates: false
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error upserting canto: ${error.message}`);
  }
  
  console.log(`  📜 Canto ${cantoNumber}: ${result.title_ua}`);
  return result;
}
