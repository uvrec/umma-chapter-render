/**
 * Утиліта для імпорту цитат з JSON (створених Python скриптами)
 *
 * Структура Vaniquotes:
 * - Categories (теми) -> Quote Pages (сторінки) -> Quotes (цитати)
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Структура цитати з парсера
 */
export interface ParsedQuote {
  text: string;
  text_html?: string;
  source_type?: string;
  source_reference?: string;
  book_slug?: string;
  canto_number?: number;
  chapter_number?: number;
  verse_number?: string;
  date?: string;
  location?: string;
}

/**
 * Структура сторінки цитат з парсера
 */
export interface ParsedQuotePage {
  quote_id: string;
  title: string;
  title_original?: string;
  categories: string[];
  quotes: ParsedQuote[];
  quotes_count: number;
}

/**
 * Структура категорії з парсера
 */
export interface ParsedCategory {
  category: string;
  category_slug: string;
  subcategories?: ParsedCategory[];
  quotes: ParsedQuotePage[];
  total_quotes: number;
}

export interface QuoteImportResult {
  success: boolean;
  categoriesImported: number;
  pagesImported: number;
  quotesImported: number;
  error?: string;
}

/**
 * Імпортувати категорію з усіма цитатами
 */
export async function importQuoteCategory(
  data: ParsedCategory,
  parentId?: string
): Promise<QuoteImportResult> {
  const result: QuoteImportResult = {
    success: true,
    categoriesImported: 0,
    pagesImported: 0,
    quotesImported: 0,
  };

  try {
    // 1. Створити/оновити категорію
    const { data: category, error: categoryError } = await supabase
      .from("quote_categories")
      .upsert(
        {
          slug: data.category_slug,
          title: data.category.replace(/_/g, " "),
          parent_id: parentId || null,
          quotes_count: data.total_quotes,
          vaniquotes_url: `https://vaniquotes.org/wiki/Category:${data.category}`,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (categoryError) throw categoryError;
    result.categoriesImported++;

    const categoryId = category.id;

    // 2. Імпортувати сторінки цитат
    for (const quotePage of data.quotes) {
      const pageResult = await importQuotePage(quotePage, categoryId);
      result.pagesImported += pageResult.pagesImported;
      result.quotesImported += pageResult.quotesImported;
    }

    // 3. Рекурсивно імпортувати підкатегорії
    if (data.subcategories) {
      for (const subcat of data.subcategories) {
        const subcatResult = await importQuoteCategory(subcat, categoryId);
        result.categoriesImported += subcatResult.categoriesImported;
        result.pagesImported += subcatResult.pagesImported;
        result.quotesImported += subcatResult.quotesImported;
      }
    }
  } catch (error: any) {
    console.error("[importQuoteCategory] Error:", error);
    result.success = false;
    result.error = error.message;
  }

  return result;
}

/**
 * Імпортувати сторінку цитат
 */
export async function importQuotePage(
  data: ParsedQuotePage,
  categoryId?: string
): Promise<QuoteImportResult> {
  const result: QuoteImportResult = {
    success: true,
    categoriesImported: 0,
    pagesImported: 0,
    quotesImported: 0,
  };

  try {
    // 1. Створити/оновити сторінку
    const { data: page, error: pageError } = await supabase
      .from("quote_pages")
      .upsert(
        {
          slug: data.quote_id,
          title: data.title,
          vaniquotes_url: `https://vaniquotes.org/wiki/${data.title_original || data.title.replace(/ /g, "_")}`,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (pageError) throw pageError;
    result.pagesImported++;

    const pageId = page.id;

    // 2. Зв'язати з категорією
    if (categoryId) {
      await supabase.from("quote_page_categories").upsert(
        {
          quote_page_id: pageId,
          category_id: categoryId,
        },
        { onConflict: "quote_page_id,category_id" }
      );
    }

    // 3. Імпортувати цитати
    for (const quote of data.quotes) {
      const { error: quoteError } = await supabase.from("quotes").insert({
        quote_page_id: pageId,
        text_en: quote.text,
        text_html: quote.text_html,
        source_type: quote.source_type || "unknown",
        source_reference: quote.source_reference,
        book_slug: quote.book_slug,
        canto_number: quote.canto_number,
        chapter_number: quote.chapter_number,
        verse_number: quote.verse_number,
        date: quote.date,
        location: quote.location,
      });

      if (quoteError) {
        console.warn("[importQuotePage] Quote insert error:", quoteError);
      } else {
        result.quotesImported++;
      }
    }
  } catch (error: any) {
    console.error("[importQuotePage] Error:", error);
    result.success = false;
    result.error = error.message;
  }

  return result;
}

/**
 * Парсити JSON файл категорії
 */
export function parseCategoryJSON(jsonString: string): ParsedCategory | null {
  try {
    const data = JSON.parse(jsonString);
    if (!data.category || !data.category_slug) {
      throw new Error("Invalid category JSON structure");
    }
    return data as ParsedCategory;
  } catch (error: any) {
    console.error("[parseCategoryJSON] Error:", error);
    return null;
  }
}

/**
 * Парсити JSON файл сторінки цитат
 */
export function parseQuotePageJSON(jsonString: string): ParsedQuotePage | null {
  try {
    const data = JSON.parse(jsonString);
    if (!data.quote_id || !data.title) {
      throw new Error("Invalid quote page JSON structure");
    }
    return data as ParsedQuotePage;
  } catch (error: any) {
    console.error("[parseQuotePageJSON] Error:", error);
    return null;
  }
}
