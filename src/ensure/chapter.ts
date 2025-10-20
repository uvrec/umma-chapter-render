// src/ensure/chapter.ts
import { getSupabase } from "../lib/supabase.js";
import type { Database } from "../types/database.js";

type ChapterRow = Database["public"]["Tables"]["chapters"]["Row"];
type ChapterInsert = Database["public"]["Tables"]["chapters"]["Insert"];

export type ChapterParams = {
  bookId?: string;
  cantoId?: string;
  chapterNumber: number;
  title_ua: string;
  title_en: string;
  intro_html_ua?: string;
  intro_html_en?: string;
  content_structure?: string;
  chapter_type?: "verses" | "text";
};

/**
 * Ensure chapter exists, create if missing (idempotent)
 * Handles both book-level chapters (no canto) and canto-level chapters
 * Uses unique constraints: (book_id, chapter_number) or (canto_id, chapter_number)
 */
export async function ensureChapter(params: ChapterParams): Promise<ChapterRow> {
  const sb = getSupabase();

  if (!params.bookId && !params.cantoId) {
    throw new Error("Either bookId or cantoId required");
  }

  if (params.bookId && params.cantoId) {
    throw new Error("Specify either bookId OR cantoId, not both");
  }

  const insertData: ChapterInsert = {
    book_id: params.bookId || null,
    canto_id: params.cantoId || null,
    chapter_number: params.chapterNumber,
    title_ua: params.title_ua,
    title_en: params.title_en,
    intro_html_ua: params.intro_html_ua || null,
    intro_html_en: params.intro_html_en || null,
    content_structure: params.content_structure || "full",
    chapter_type: params.chapter_type || "verses",
    is_published: true,
  };

  // Determine conflict target based on whether we have canto_id or book_id
  // Note: We can't specify conflict columns in Supabase JS, so we rely on unique indexes
  // The unique indexes will handle the conflict automatically

  const { data: result, error } = await sb
    .from("chapters")
    .upsert(insertData, {
      // Supabase will use the appropriate unique index based on the data
      ignoreDuplicates: false,
    })
    .select()
    .single();

  if (error) {
    // If upsert fails due to conflict, try to fetch existing
    if (error.code === "23505") {
      // unique_violation
      console.log(`    📄 Chapter ${params.chapterNumber} exists, fetching...`);

      let query = sb.from("chapters").select("*").eq("chapter_number", params.chapterNumber);

      if (params.cantoId) {
        query = query.eq("canto_id", params.cantoId);
      } else if (params.bookId) {
        query = query.eq("book_id", params.bookId).is("canto_id", null);
      }

      const { data: existing, error: fetchError } = await query.single();

      if (fetchError) {
        throw new Error(`Error fetching chapter after conflict: ${fetchError.message}`);
      }

      // Update intro_html if provided
      if (params.intro_html_ua || params.intro_html_en) {
        const updates: Partial<ChapterInsert> = {};
        if (params.intro_html_ua) updates.intro_html_ua = params.intro_html_ua;
        if (params.intro_html_en) updates.intro_html_en = params.intro_html_en;

        const { data: updated } = await sb.from("chapters").update(updates).eq("id", existing.id).select().single();

        if (updated) {
          console.log(`    ♻️  Chapter ${params.chapterNumber} intro updated`);
          return updated;
        }
      }

      return existing;
    }

    throw new Error(`Error upserting chapter: ${error.message}`);
  }

  console.log(`    📄 Chapter ${params.chapterNumber}: ${result.title_ua}`);
  return result;
}
