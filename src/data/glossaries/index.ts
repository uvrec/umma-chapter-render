/**
 * Glossaries index - exports all book glossaries
 */

export { ISO_GLOSSARY_UA, ISO_GLOSSARY_EN, type GlossaryTermData } from "./iso-glossary";
export { RAJA_VIDYA_GLOSSARY_UA, RAJA_VIDYA_BOOK_INFO } from "./raja-vidya-glossary";
export { GITA_GLOSSARY_EN, GITA_GLOSSARY_INFO } from "./gita-glossary";

import { ISO_GLOSSARY_UA, ISO_GLOSSARY_EN } from "./iso-glossary";
import { RAJA_VIDYA_GLOSSARY_UA } from "./raja-vidya-glossary";
import { GITA_GLOSSARY_EN } from "./gita-glossary";
import { type GlossaryTermData } from "@/components/book/BookGlossary";

/**
 * Get glossary for a specific book by slug
 * @param bookSlug - The book's slug identifier
 * @param language - "ua" or "en"
 * @returns Array of glossary terms for the book
 */
export const getGlossaryForBook = (bookSlug: string, language: string = "ua"): GlossaryTermData[] => {
  switch (bookSlug) {
    case "iso":
    case "sri-isopanishad":
      return language === "uk" ? ISO_GLOSSARY_UA : ISO_GLOSSARY_EN;

    case "raja-vidya":
      return RAJA_VIDYA_GLOSSARY_UA;

    case "gita":
    case "bhagavad-gita":
      return GITA_GLOSSARY_EN; // English glossary available; UA to be added

    // For books without specific glossaries, return empty array
    // The component will fall back to its default glossary
    default:
      return [];
  }
};

/**
 * Check if a book has a dedicated glossary
 */
export const hasGlossary = (bookSlug: string): boolean => {
  const booksWithGlossaries = ["iso", "sri-isopanishad", "raja-vidya", "gita", "bhagavatam"];
  return booksWithGlossaries.includes(bookSlug);
};
