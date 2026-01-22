/**
 * Індекс лекцій Шріли Прабгупади
 * Експортує всі доступні лекції для обох мов
 */

export { BG_INTRODUCTION_EN } from "./bg-introduction-en";
export { BG_INTRODUCTION_UK } from "./bg-introduction-uk";

// Типи
export interface LecturePrayer {
  sanskrit: string;
  translation: string;
}

export interface LectureMetadata {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  location: string;
  type: string;
  audioFile?: string;
  bookSlug?: string;
}

export interface LectureData {
  metadata: LectureMetadata;
  prayers: LecturePrayer[];
  content: string[];
}

// Список всіх доступних лекцій
export const AVAILABLE_LECTURES = [
  {
    slug: "660219bg-new-york",
    titleEn: "Introduction to Gītopaniṣad",
    titleUk: "Вступ до «Ґітопанішад»",
    date: "1966-02-19",
    location: "New York",
    type: "Bhagavad-gita",
  },
];
