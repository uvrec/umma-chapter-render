// src/types/gv-references.ts
// Types for Gaudiya Vaishnava Book References System

/**
 * Era classification for authors
 */
export type AuthorEra =
  | "founders" // Pancha-tattva and early associates
  | "gosvamis" // Six Gosvamis of Vrindavan
  | "later_acharyas" // 16th-19th century acharyas
  | "modern" // 19th-20th century acharyas
  | "prabhupada_disciples"; // Disciples of Srila Prabhupada

/**
 * Category classification for books
 */
export type BookCategory =
  | "shruti" // Revealed scriptures (Upanishads, etc.)
  | "smriti" // Traditional texts
  | "purana" // Puranic literature
  | "kavya" // Poetry, dramas, biographies
  | "stotra" // Prayers and hymns
  | "shastra" // Philosophical treatises
  | "prabandha"; // Essays, novels, compilations

/**
 * Subcategory for more specific classification
 */
export type BookSubcategory =
  // Shruti subcategories
  | "upanishad"
  | "gita"
  | "sutra"
  // Purana subcategories
  | "maha-purana"
  | "upa-purana"
  // Kavya subcategories
  | "nataka" // Drama
  | "champu" // Mixed prose-verse
  | "carita" // Biography
  | "duta-kavya" // Messenger poem
  | "anthology"
  // Stotra subcategories
  | "stuti" // Prayers
  | "giti" // Songs
  | "siksa" // Instructions
  // Shastra subcategories
  | "bhakti-shastra"
  | "darsana" // Philosophy
  | "tika" // Commentary
  | "bhasya" // Full commentary
  | "theology"
  | "smriti"
  | "tirtha" // Holy places
  // Prabandha subcategories
  | "novel"
  | "essay"
  | "biography"
  | "autobiography"
  | "memoir"
  | "memories"
  | "stories"
  | "dialogue"
  | "summary"
  | "compilation"
  | "letters"
  | "practical"
  | "translation"
  | "commentary";

/**
 * Original language of the work
 */
export type OriginalLanguage = "sanskrit" | "bengali" | "hindi" | "brajabhasha" | "english";

/**
 * Author / Acharya from the Gaudiya Vaishnava tradition
 */
export interface GVAuthor {
  id: string;
  slug: string;

  // Names in multiple formats
  name_sanskrit?: string; // Original script (Devanagari/Bengali)
  name_transliteration: string; // IAST transliteration
  name_en: string; // English
  name_ua: string; // Ukrainian

  // Titles and honorifics
  title_sanskrit?: string;
  title_transliteration?: string;
  title_en?: string;
  title_ua?: string;

  // Life details
  birth_year?: number;
  death_year?: number;
  birth_place?: string;
  samadhi_place?: string;

  // Lineage
  guru_id?: string;
  guru?: GVAuthor; // Populated when fetching with joins

  // Biography
  biography_en?: string;
  biography_ua?: string;

  // Significance
  significance_en?: string;
  significance_ua?: string;

  // Media
  image_url?: string;

  // Classification
  era: AuthorEra;
  display_order: number;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

/**
 * Book reference from the Gaudiya Vaishnava tradition
 */
export interface GVBookReference {
  id: string;
  slug: string;

  // Title in multiple formats
  title_sanskrit?: string; // Original script (Devanagari/Bengali)
  title_transliteration: string; // IAST transliteration
  title_en: string; // English translation/title
  title_ua: string; // Ukrainian translation/title

  // Alternative titles
  alt_titles?: string[];

  // Authorship
  author_id?: string;
  author?: GVAuthor; // Populated when fetching with joins

  // For commentaries
  original_text_id?: string;
  original_text?: GVBookReference; // The text being commented on
  commentary_type?: "tika" | "bhasya" | "vrtti" | "dipika";

  // Description
  description_en?: string;
  description_ua?: string;

  // Classification
  category: BookCategory;
  subcategory?: BookSubcategory;

  // Structure
  volume_count: number;
  chapter_count?: number;
  verse_count?: number;

  // Language of original
  original_language: OriginalLanguage;

  // Dating
  composition_year?: number;
  composition_century?: string;

  // Significance
  importance_level: 1 | 2 | 3 | 4 | 5;
  significance_en?: string;
  significance_ua?: string;

  // Topics/themes
  topics?: string[];

  // Media
  cover_image_url?: string;

  // Links to internal content
  internal_book_slug?: string; // Link to books table if available in app
  external_url?: string; // Link to external source

  // Metadata
  display_order: number;
  is_published: boolean;
  is_available_in_app: boolean;

  created_at: string;
  updated_at: string;
}

/**
 * Book catalogue for grouping books
 */
export interface GVBookCatalogue {
  id: string;
  slug: string;

  name_en: string;
  name_ua: string;

  description_en?: string;
  description_ua?: string;

  // Ordering and display
  display_order: number;
  icon?: string;
  color?: string;

  is_published: boolean;

  // Books in this catalogue (populated when fetching)
  books?: GVBookReference[];

  created_at: string;
}

/**
 * Catalogue-book junction with ordering
 */
export interface GVCatalogueBook {
  catalogue_id: string;
  book_id: string;
  display_order: number;
}

// ============================================================================
// UI Helper Types
// ============================================================================

/**
 * Author with count of books
 */
export interface GVAuthorWithBookCount extends GVAuthor {
  book_count: number;
}

/**
 * Book reference with author name (for list views)
 */
export interface GVBookReferenceWithAuthor extends GVBookReference {
  author_name_en?: string;
  author_name_ua?: string;
}

/**
 * Catalogue with nested books
 */
export interface GVCatalogueWithBooks extends GVBookCatalogue {
  books: GVBookReferenceWithAuthor[];
}

/**
 * Filter options for book references
 */
export interface GVBookFilters {
  category?: BookCategory;
  subcategory?: BookSubcategory;
  author_id?: string;
  era?: AuthorEra;
  importance_level?: number;
  original_language?: OriginalLanguage;
  is_available_in_app?: boolean;
  search?: string;
}

/**
 * Sort options for book references
 */
export type GVBookSortField =
  | "title"
  | "author"
  | "importance_level"
  | "display_order"
  | "composition_year";

export interface GVBookSortOptions {
  field: GVBookSortField;
  direction: "asc" | "desc";
}

// ============================================================================
// Display Helpers
// ============================================================================

/**
 * Get display name for author era
 */
export const eraDisplayNames: Record<AuthorEra, { en: string; ua: string }> = {
  founders: { en: "Founders & Associates", uk: "Засновники та супутники" },
  gosvamis: { en: "Six Gosvamis of Vrindavan", uk: "Шість Ґосвамі Вріндавана" },
  later_acharyas: { en: "Later Acharyas", uk: "Пізніші ачар'ї" },
  modern: { en: "Modern Acharyas", uk: "Сучасні ачар'ї" },
  prabhupada_disciples: { en: "Prabhupada's Disciples", uk: "Учні Прабгупади" },
};

/**
 * Get display name for book category
 */
export const categoryDisplayNames: Record<BookCategory, { en: string; ua: string }> = {
  shruti: { en: "Revealed Scriptures", uk: "Об'явлені писання" },
  smriti: { en: "Traditional Texts", uk: "Традиційні тексти" },
  purana: { en: "Puranic Literature", uk: "Пуранічна література" },
  kavya: { en: "Poetry & Drama", uk: "Поезія та драма" },
  stotra: { en: "Prayers & Hymns", uk: "Молитви та гімни" },
  shastra: { en: "Philosophical Treatises", uk: "Філософські трактати" },
  prabandha: { en: "Essays & Compilations", uk: "Есе та збірки" },
};

/**
 * Get display name for importance level
 */
export const importanceLevelNames: Record<number, { en: string; ua: string }> = {
  5: { en: "Essential", uk: "Необхідний" },
  4: { en: "Important", uk: "Важливий" },
  3: { en: "Recommended", uk: "Рекомендований" },
  2: { en: "Supplementary", uk: "Додатковий" },
  1: { en: "Reference", uk: "Довідковий" },
};
