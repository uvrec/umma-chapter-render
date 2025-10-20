// src/types/database.ts
/**
 * Database type definitions for Supabase
 * Generate with: npx supabase gen types typescript --project-id your-project-id > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          slug: string
          vedabase_slug: string | null
          gitabase_slug: string | null
          title_ua: string
          title_en: string
          description_ua: string | null
          description_en: string | null
          has_cantos: boolean
          is_published: boolean
          created_at: string
          default_structure: string | null
        }
        Insert: {
          id?: string
          slug: string
          vedabase_slug?: string | null
          gitabase_slug?: string | null
          title_ua: string
          title_en: string
          description_ua?: string | null
          description_en?: string | null
          has_cantos?: boolean
          is_published?: boolean
          created_at?: string
          default_structure?: string | null
        }
        Update: {
          id?: string
          slug?: string
          vedabase_slug?: string | null
          gitabase_slug?: string | null
          title_ua?: string
          title_en?: string
          description_ua?: string | null
          description_en?: string | null
          has_cantos?: boolean
          is_published?: boolean
          created_at?: string
          default_structure?: string | null
        }
      }
      cantos: {
        Row: {
          id: string
          book_id: string
          canto_number: number
          title_ua: string
          title_en: string
          description_ua: string | null
          description_en: string | null
          cover_image_url: string | null
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          canto_number: number
          title_ua: string
          title_en: string
          description_ua?: string | null
          description_en?: string | null
          cover_image_url?: string | null
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          canto_number?: number
          title_ua?: string
          title_en?: string
          description_ua?: string | null
          description_en?: string | null
          cover_image_url?: string | null
          is_published?: boolean
          created_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          book_id: string | null
          canto_id: string | null
          chapter_number: number
          title_ua: string
          title_en: string
          intro_html_ua: string | null
          intro_html_en: string | null
          content_structure: string | null
          chapter_type: 'verses' | 'text' | null
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          book_id?: string | null
          canto_id?: string | null
          chapter_number: number
          title_ua: string
          title_en: string
          intro_html_ua?: string | null
          intro_html_en?: string | null
          content_structure?: string | null
          chapter_type?: 'verses' | 'text' | null
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string | null
          canto_id?: string | null
          chapter_number?: number
          title_ua?: string
          title_en?: string
          intro_html_ua?: string | null
          intro_html_en?: string | null
          content_structure?: string | null
          chapter_type?: 'verses' | 'text' | null
          is_published?: boolean
          created_at?: string
        }
      }
      verses: {
        Row: {
          id: string
          chapter_id: string
          verse_number: string
          verse_number_sort: number | null
          sanskrit: string | null
          transliteration: string | null
          synonyms_ua: string | null
          synonyms_en: string | null
          translation_ua: string | null
          translation_en: string | null
          commentary_ua: string | null
          commentary_en: string | null
          audio_url: string | null
          display_blocks: Json | null
          is_published: boolean
          created_at: string
          search_vector: unknown | null
        }
        Insert: {
          id?: string
          chapter_id: string
          verse_number: string
          verse_number_sort?: number | null
          sanskrit?: string | null
          transliteration?: string | null
          synonyms_ua?: string | null
          synonyms_en?: string | null
          translation_ua?: string | null
          translation_en?: string | null
          commentary_ua?: string | null
          commentary_en?: string | null
          audio_url?: string | null
          display_blocks?: Json | null
          is_published?: boolean
          created_at?: string
          search_vector?: unknown | null
        }
        Update: {
          id?: string
          chapter_id?: string
          verse_number?: string
          verse_number_sort?: number | null
          sanskrit?: string | null
          transliteration?: string | null
          synonyms_ua?: string | null
          synonyms_en?: string | null
          translation_ua?: string | null
          translation_en?: string | null
          commentary_ua?: string | null
          commentary_en?: string | null
          audio_url?: string | null
          display_blocks?: Json | null
          is_published?: boolean
          created_at?: string
          search_vector?: unknown | null
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {
      chapter_type: 'verses' | 'text'
    }
  }
}
