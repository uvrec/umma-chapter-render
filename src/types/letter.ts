/**
 * TypeScript типи для листів Прабгупади
 */

export interface Letter {
  id: string;
  slug: string; // 'letter-to-mahatma-gandhi'
  recipient_en: string;
  recipient_ua: string | null;
  letter_date: string; // ISO date (YYYY-MM-DD)
  location_en: string;
  location_ua: string | null;
  reference: string | null; // '47-07-12'
  address_block: string | null;
  content_en: string;
  content_ua: string | null;
  created_at: string;
  updated_at: string;
}

export interface LetterFilters {
  recipient?: string | "all";
  location?: string | "all";
  yearFrom?: number;
  yearTo?: number;
  search?: string;
}

export type LetterSortBy = "date" | "recipient" | "location";
export type LetterSortOrder = "asc" | "desc";

export interface LetterSortOptions {
  sortBy: LetterSortBy;
  sortOrder: LetterSortOrder;
}

export interface LetterGroup {
  label: string; // рік або локація
  letters: Letter[];
}

export interface LetterImportData {
  metadata: {
    slug: string;
    recipient_en: string;
    recipient_ua: string;
    letter_date: string;
    location_en: string;
    location_ua: string;
    reference?: string;
    address_block?: string;
  };
  content_en: string;
  content_ua?: string;
  sanskrit_terms?: string[];
}
