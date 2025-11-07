/**
 * TypeScript типи для лекцій Vedabase
 */

export interface Lecture {
  id: string;
  slug: string; // vedabase ID (наприклад, '660307bg-new-york')
  title_en: string;
  title_ua: string | null;
  lecture_date: string; // ISO date string (YYYY-MM-DD)
  location_en: string;
  location_ua: string | null;
  lecture_type: LectureType;
  audio_url: string | null;
  book_slug: string | null; // 'bg', 'sb', 'cc', тощо
  canto_number: number | null;
  chapter_number: number | null;
  verse_number: string | null; // '2.12' або '2.7-11'
  description_en: string | null;
  description_ua: string | null;
  created_at: string;
  updated_at: string;
}

export interface LectureParagraph {
  id: string;
  lecture_id: string;
  paragraph_number: number;
  content_en: string;
  content_ua: string | null;
  audio_timecode: number | null; // час в секундах
  created_at: string;
}

export type LectureType =
  | "Conversation"
  | "Walk"
  | "Morning Walk"
  | "Lecture"
  | "Bhagavad-gita"
  | "Srimad-Bhagavatam"
  | "Nectar of Devotion"
  | "Sri Isopanisad"
  | "Sri Caitanya-caritamrta"
  | "Initiation"
  | "Room Conversation"
  | "Interview"
  | "Arrival"
  | "Departure"
  | "Festival"
  | "Bhajan"
  | "Kirtan"
  | "Other";

export interface LectureWithParagraphs extends Lecture {
  paragraphs: LectureParagraph[];
}

/**
 * Фільтри для списку лекцій
 */
export interface LectureFilters {
  type?: LectureType | "all";
  location?: string | "all";
  book?: string | "all";
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
  search?: string;
}

/**
 * Сортування для списку лекцій
 */
export type LectureSortBy = "date" | "location" | "type" | "title";
export type LectureSortOrder = "asc" | "desc";

export interface LectureSortOptions {
  sortBy: LectureSortBy;
  sortOrder: LectureSortOrder;
}

/**
 * Групування лекцій
 */
export interface LectureGroup {
  label: string; // назва групи (рік, місяць, локація тощо)
  lectures: Lecture[];
}

/**
 * Санскритський термін для глосарія
 */
export interface SanskritTerm {
  term: string; // санскрит з діакритикою
  transliteration_ua: string | null; // українська транслітерація
  definition_en: string | null;
  definition_ua: string | null;
  lecture_id: string; // в якій лекції зустрічається
  paragraph_number: number;
}
