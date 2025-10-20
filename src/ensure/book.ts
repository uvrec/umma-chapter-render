// src/ensure/book.ts
import { getSupabase } from '../lib/supabase.js';
import type { Database } from '../types/database.js';

type BookRow = Database['public']['Tables']['books']['Row'];
type BookInsert = Database['public']['Tables']['books']['Insert'];

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
 * Ensure book exists, create if missing (idempotent)
 * Uses upsert with unique constraint on vedabase_slug/gitabase_slug
 */
export async function ensureBook(
  identifier: BookIdentifier,
  data?: BookData
): Promise<BookRow> {
  const sb = getSupabase();
  
  // 1. Try to find existing book
  let query = sb.from('books').select('*');
  
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
  
  // 2. Create new book if not found
  if (!data?.title_ua || !data?.title_en) {
    throw new Error('title_ua and title_en required to create new book');
  }
  
  const slug = identifier.slug || identifier.vedabase_slug || identifier.gitabase_slug!;
  
  const insertData: BookInsert = {
    slug,
    vedabase_slug: identifier.vedabase_slug || null,
    gitabase_slug: identifier.gitabase_slug || null,
    title_ua: data.title_ua,
    title_en: data.title_en,
    has_cantos: data.has_cantos ?? false,
    description_ua: data.description_ua || null,
    description_en: data.description_en || null,
    is_published: true
  };
  
  // Use upsert for idempotency
  const { data: created, error: insertError } = await sb
    .from('books')
    .upsert(insertData, {
      onConflict: 'slug',
      ignoreDuplicates: false
    })
    .select()
    .single();
  
  if (insertError) {
    // Handle race condition: if book was created between SELECT and INSERT
    if (insertError.code === '23505') { // unique violation
      console.log(`📖 Book ${slug} created by another process, refetching...`);
      const { data: refetched } = await sb
        .from('books')
        .select('*')
        .eq('slug', slug)
        .single();
      if (refetched) return refetched;
    }
    throw new Error(`Error creating book: ${insertError.message}`);
  }
  
  console.log(`✨ Book created: ${created.slug}`);
  return created;
}
