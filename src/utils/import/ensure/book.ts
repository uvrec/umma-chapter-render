// src/utils/import/ensure/book.ts
import { supabase } from "@/integrations/supabase/client";

export type BookIdentifier = {
  vedabase_slug?: string;
  gitabase_slug?: string;
  slug?: string;
};

export type BookData = {
  title_ua: string;
  title_en: string;
  has_cantos?: boolean;
  description_ua?: string;
  description_en?: string;
};

/**
 * Знаходить або створює книгу за slug-идентифікатором
 * @returns Існуючий або новостворений запис книги
 */
export async function ensureBook(identifier: BookIdentifier, data?: BookData) {
  // 1. Спочатку шукаємо існуючу книгу
  let query = supabase.from('books').select('*');
  
  if (identifier.vedabase_slug) {
    query = query.eq('vedabase_slug', identifier.vedabase_slug);
  } else if (identifier.gitabase_slug) {
    query = query.eq('gitabase_slug', identifier.gitabase_slug);
  } else if (identifier.slug) {
    query = query.eq('slug', identifier.slug);
  } else {
    throw new Error('Book identifier required (vedabase_slug, gitabase_slug, or slug)');
  }
  
  const { data: existing, error: fetchError } = await query.maybeSingle();
  
  if (fetchError) {
    throw new Error(`Error fetching book: ${fetchError.message}`);
  }
  
  if (existing) {
    console.log(`📖 Book found: ${existing.slug}`);
    return existing;
  }
  
  // 2. Якщо не знайдено - створюємо нову
  if (!data?.title_ua || !data?.title_en) {
    throw new Error('title_ua and title_en required to create new book');
  }
  
  const slug = identifier.slug || identifier.vedabase_slug || identifier.gitabase_slug!;
  
  const { data: created, error: insertError } = await supabase
    .from('books')
    .insert({
      slug,
      vedabase_slug: identifier.vedabase_slug || null,
      gitabase_slug: identifier.gitabase_slug || null,
      title_ua: data.title_ua,
      title_en: data.title_en,
      has_cantos: data.has_cantos || false,
      description_ua: data.description_ua || null,
      description_en: data.description_en || null,
      is_published: true
    })
    .select()
    .single();
  
  if (insertError) {
    throw new Error(`Error creating book: ${insertError.message}`);
  }
  
  console.log(`✨ Book created: ${created.slug}`);
  return created;
}
