// Centralized IDs for imports
export const ImportIds = {
  lecturesBookId: "2c99d79a-5c20-4b02-ac86-00551c475379",
  lettersBookId: "4edac4c6-bcdf-413a-b444-6628ebfca892",
} as const;

export type ChapterLocator = {
  book_id: string;
  canto_id?: string | number;
  chapter_id?: string | number;
  verse_id?: string | number;
};
