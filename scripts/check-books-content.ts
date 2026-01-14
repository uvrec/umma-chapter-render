#!/usr/bin/env npx tsx
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Load .env manually
const envContent = readFileSync(".env", "utf-8");
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^=]+)="?([^"]*)"?$/);
  if (match) {
    process.env[match[1]] = match[2];
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBooks() {
  // Get all books
  const { data: books, error: booksError } = await supabase
    .from("books")
    .select("id, slug, title_en, is_published, has_cantos")
    .order("slug");

  if (booksError) {
    console.error("Error fetching books:", booksError);
    return;
  }

  console.log("\n📚 Books Content Status:\n");
  console.log("Slug".padEnd(15) + "| Chapters | Cantos | Status");
  console.log("-".repeat(50));

  for (const book of books || []) {
    // Get chapter count
    const { count: chapterCount } = await supabase
      .from("chapters")
      .select("*", { count: "exact", head: true })
      .eq("book_id", book.id);

    // Get canto count
    const { count: cantoCount } = await supabase
      .from("cantos")
      .select("*", { count: "exact", head: true })
      .eq("book_id", book.id);

    const hasContent = (chapterCount || 0) > 0 || (cantoCount || 0) > 0;
    const status = hasContent ? "✅" : "❌ EMPTY";

    console.log(
      `${book.slug.padEnd(15)}| ${String(chapterCount || 0).padEnd(9)}| ${String(cantoCount || 0).padEnd(7)}| ${status}`
    );
  }
}

checkBooks().catch(console.error);
