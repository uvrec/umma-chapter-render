import { SupabaseClient } from "@supabase/supabase-js";

interface ChapterData {
  chapter_number: number;
  title_ua: string;
  title_en: string;
  verses?: any[];
}

interface ImportOptions {
  bookId: string;
  cantoId: string | null;
  chapter: ChapterData;
  strategy: "replace" | "skip" | "merge";
}

export async function importSingleChapter(
  supabase: SupabaseClient,
  options: ImportOptions
): Promise<void> {
  const { bookId, cantoId, chapter, strategy } = options;

  // Check if chapter exists
  const { data: existingChapter } = await supabase
    .from("chapters")
    .select("id")
    .eq("book_id", bookId)
    .eq("chapter_number", chapter.chapter_number)
    .eq("canto_id", cantoId || "")
    .maybeSingle();

  if (existingChapter) {
    if (strategy === "skip") {
      console.log(`Chapter ${chapter.chapter_number} already exists, skipping`);
      return;
    }

    if (strategy === "replace") {
      // Delete existing verses
      await supabase.from("verses").delete().eq("chapter_id", existingChapter.id);

      // Update chapter
      await supabase
        .from("chapters")
        .update({
          title_ua: chapter.title_ua,
          title_en: chapter.title_en,
        })
        .eq("id", existingChapter.id);

      // Insert verses
      if (chapter.verses && chapter.verses.length > 0) {
        await supabase.from("verses").insert(
          chapter.verses.map((v) => ({
            chapter_id: existingChapter.id,
            ...v,
          }))
        );
      }

      console.log(`Chapter ${chapter.chapter_number} replaced`);
      return;
    }
  }

  // Insert new chapter
  const { data: newChapter, error: chapterError } = await supabase
    .from("chapters")
    .insert({
      book_id: bookId,
      canto_id: cantoId,
      chapter_number: chapter.chapter_number,
      title_ua: chapter.title_ua,
      title_en: chapter.title_en,
    })
    .select()
    .single();

  if (chapterError) {
    throw new Error(`Failed to insert chapter: ${chapterError.message}`);
  }

  // Insert verses
  if (chapter.verses && chapter.verses.length > 0) {
    const { error: versesError } = await supabase.from("verses").insert(
      chapter.verses.map((v) => ({
        chapter_id: newChapter.id,
        ...v,
      }))
    );

    if (versesError) {
      throw new Error(`Failed to insert verses: ${versesError.message}`);
    }
  }

  console.log(`Chapter ${chapter.chapter_number} imported successfully`);
}
