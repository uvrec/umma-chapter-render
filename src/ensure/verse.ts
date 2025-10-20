// src/ensure/verse.ts
import { getSupabase } from "../lib/supabase.js";
import type { Database } from "../types/database.js";

type VerseRow = Database["public"]["Tables"]["verses"]["Row"];
type VerseInsert = Database["public"]["Tables"]["verses"]["Insert"];

export type VerseData = {
  verse_number: string;
  language: "en" | "uk";
  sanskrit?: string | null;
  transliteration?: string | null;
  synonyms?: string | null;
  translation?: string | null;
  commentary?: string | null;
  audio_url?: string | null;
  display_blocks?: any;
};

/**
 * Parse verse number to extract sortable integer
 * Examples: "1" -> 1, "1.1" -> 1, "10-11" -> 10
 */
function parseVerseNumberSort(verseNumber: string): number | null {
  const match = verseNumber.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Ensure verse exists with smart merging:
 * - Sanskrit/transliteration are language-agnostic (shared)
 * - Synonyms/translation/commentary are language-specific
 * - Merges data from multiple languages without overwriting
 */
export async function ensureVerse(chapterId: string, verseData: VerseData): Promise<VerseRow> {
  const sb = getSupabase();

  if (!verseData.verse_number) {
    throw new Error("verse_number is required");
  }

  const isUkrainian = verseData.language === "uk";
  const verseNumberSort = parseVerseNumberSort(verseData.verse_number);

  // Prepare base data (language-agnostic fields)
  const baseData: Partial<VerseInsert> = {
    chapter_id: chapterId,
    verse_number: verseData.verse_number,
    verse_number_sort: verseNumberSort,
    is_published: true,
  };

  // Add language-agnostic fields (overwrite if provided)
  if (verseData.sanskrit !== undefined) baseData.sanskrit = verseData.sanskrit;
  if (verseData.transliteration !== undefined) baseData.transliteration = verseData.transliteration;
  if (verseData.audio_url !== undefined) baseData.audio_url = verseData.audio_url;
  if (verseData.display_blocks !== undefined) baseData.display_blocks = verseData.display_blocks;

  // Add language-specific fields
  if (isUkrainian) {
    if (verseData.synonyms !== undefined) baseData.synonyms_ua = verseData.synonyms;
    if (verseData.translation !== undefined) baseData.translation_ua = verseData.translation;
    if (verseData.commentary !== undefined) baseData.commentary_ua = verseData.commentary;
  } else {
    if (verseData.synonyms !== undefined) baseData.synonyms_en = verseData.synonyms;
    if (verseData.translation !== undefined) baseData.translation_en = verseData.translation;
    if (verseData.commentary !== undefined) baseData.commentary_en = verseData.commentary;
  }

  // 1. Try to fetch existing verse
  const { data: existing, error: fetchError } = await sb
    .from("verses")
    .select("*")
    .eq("chapter_id", chapterId)
    .eq("verse_number", verseData.verse_number)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Error fetching verse: ${fetchError.message}`);
  }

  if (existing) {
    // 2. Merge with existing verse (don't overwrite other language data)
    const updates: Partial<VerseInsert> = {};

    // Always update language-agnostic fields if provided
    if (verseData.sanskrit !== undefined && verseData.sanskrit !== existing.sanskrit) {
      updates.sanskrit = verseData.sanskrit;
    }
    if (verseData.transliteration !== undefined && verseData.transliteration !== existing.transliteration) {
      updates.transliteration = verseData.transliteration;
    }
    if (verseData.audio_url !== undefined && verseData.audio_url !== existing.audio_url) {
      updates.audio_url = verseData.audio_url;
    }

    // Update language-specific fields (preserve other language)
    if (isUkrainian) {
      if (verseData.synonyms !== undefined) updates.synonyms_ua = verseData.synonyms;
      if (verseData.translation !== undefined) updates.translation_ua = verseData.translation;
      if (verseData.commentary !== undefined) updates.commentary_ua = verseData.commentary;
    } else {
      if (verseData.synonyms !== undefined) updates.synonyms_en = verseData.synonyms;
      if (verseData.translation !== undefined) updates.translation_en = verseData.translation;
      if (verseData.commentary !== undefined) updates.commentary_en = verseData.commentary;
    }

    if (Object.keys(updates).length === 0) {
      console.log(`      ✓ Verse ${verseData.verse_number} unchanged (${verseData.language})`);
      return existing;
    }

    // Perform update
    const { data: updated, error: updateError } = await sb
      .from("verses")
      .update(updates)
      .eq("id", existing.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Error updating verse: ${updateError.message}`);
    }

    console.log(`      ♻️  Verse ${verseData.verse_number} updated (${verseData.language})`);
    return updated;
  } else {
    // 3. Create new verse
    const { data: created, error: insertError } = await sb
      .from("verses")
      .insert(baseData as VerseInsert)
      .select()
      .single();

    if (insertError) {
      // Handle race condition
      if (insertError.code === "23505") {
        // unique_violation
        console.log(`      🔄 Verse ${verseData.verse_number} created by another process, retrying...`);
        // Retry with existing logic
        return ensureVerse(chapterId, verseData);
      }
      throw new Error(`Error creating verse: ${insertError.message}`);
    }

    console.log(`      ✨ Verse ${verseData.verse_number} created (${verseData.language})`);
    return created;
  }
}

/**
 * Batch upsert verses (for performance optimization)
 * Note: This won't do smart merging - use for initial bulk imports only
 */
export async function batchUpsertVerses(chapterId: string, verses: VerseData[]): Promise<VerseRow[]> {
  const sb = getSupabase();

  const inserts: VerseInsert[] = verses.map((v) => ({
    chapter_id: chapterId,
    verse_number: v.verse_number,
    verse_number_sort: parseVerseNumberSort(v.verse_number),
    sanskrit: v.sanskrit || null,
    transliteration: v.transliteration || null,
    synonyms_ua: v.language === "uk" ? v.synonyms : null,
    synonyms_en: v.language === "en" ? v.synonyms : null,
    translation_ua: v.language === "uk" ? v.translation : null,
    translation_en: v.language === "en" ? v.translation : null,
    commentary_ua: v.language === "uk" ? v.commentary : null,
    commentary_en: v.language === "en" ? v.commentary : null,
    audio_url: v.audio_url || null,
    display_blocks: v.display_blocks || null,
    is_published: true,
  }));

  const { data, error } = await sb
    .from("verses")
    .upsert(inserts, {
      onConflict: "chapter_id,verse_number",
      ignoreDuplicates: false,
    })
    .select();

  if (error) {
    throw new Error(`Batch upsert failed: ${error.message}`);
  }

  console.log(`      ⚡ Batch upserted ${data.length} verses`);
  return data;
}
