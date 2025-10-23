/**
 * Типи для гнучкої системи відображення контенту
 */

export interface DisplayBlocks {
  sanskrit_ua: boolean;
  sanskrit_en: boolean;
  transliteration_ua: boolean;
  transliteration_en: boolean;
  synonyms: boolean;
  translation: boolean;
  commentary: boolean;
}

export interface VerseData {
  id?: string;
  verse_number?: string;
  sanskrit?: string | null;
  transliteration?: string | null;
  synonyms_ua?: string | null;
  synonyms_en?: string | null;
  translation_ua?: string | null;
  translation_en?: string | null;
  commentary_ua?: string | null;
  commentary_en?: string | null;
  display_blocks?: DisplayBlocks | null;
  audio_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ChapterStructure {
  chapter_type?: 'regular' | 'intro' | 'appendix' | 'preface';
  content_structure?: 'full' | 'text_only' | null;
}

export interface BookStructure {
  vedabase_slug?: string | null;
  gitabase_slug?: string | null;
  default_structure?: 'full' | 'text_only' | 'mixed';
}

export interface BlogPostWithVerse {
  id: string;
  title: string;
  content: string;
  sanskrit?: string | null;
  transliteration?: string | null;
  synonyms_ua?: string | null;
  synonyms_en?: string | null;
  translation_ua?: string | null;
  translation_en?: string | null;
  display_blocks?: DisplayBlocks | null;
  created_at: string;
  updated_at?: string;
}
