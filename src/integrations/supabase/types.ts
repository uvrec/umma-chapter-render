export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audio_categories: {
        Row: {
          created_at: string | null
          description_en: string | null
          description_ua: string | null
          display_order: number | null
          icon: string | null
          id: string
          name_en: string
          name_ua: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description_en?: string | null
          description_ua?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name_en: string
          name_ua: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description_en?: string | null
          description_ua?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name_en?: string
          name_ua?: string
          slug?: string
        }
        Relationships: []
      }
      audio_events: {
        Row: {
          created_at: string
          duration_ms: number | null
          event_type: string
          id: string
          position_ms: number | null
          track_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          event_type: string
          id?: string
          position_ms?: number | null
          track_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          event_type?: string
          id?: string
          position_ms?: number | null
          track_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audio_events_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "audio_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_playlists: {
        Row: {
          author: string | null
          category_id: string
          cover_image_path: string | null
          cover_image_url: string | null
          created_at: string | null
          description_en: string | null
          description_ua: string | null
          display_order: number | null
          id: string
          is_published: boolean | null
          slug: string | null
          title_en: string
          title_ua: string
          total_duration: number | null
          total_tracks: number | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          author?: string | null
          category_id: string
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description_en?: string | null
          description_ua?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          slug?: string | null
          title_en: string
          title_ua: string
          total_duration?: number | null
          total_tracks?: number | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          author?: string | null
          category_id?: string
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description_en?: string | null
          description_ua?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          slug?: string | null
          title_en?: string
          title_ua?: string
          total_duration?: number | null
          total_tracks?: number | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audio_playlists_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "audio_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_tracks: {
        Row: {
          album: string | null
          album_artist: string | null
          artist: string | null
          audio_url: string
          bitrate: number | null
          composer: string | null
          cover_image_url: string | null
          created_at: string | null
          disc_number: number | null
          duration: number | null
          file_format: string | null
          file_size: number | null
          genre: string | null
          id: string
          playlist_id: string
          sample_rate: number | null
          storage_path: string | null
          title_en: string
          title_ua: string
          track_number: number
          updated_at: string | null
          year: number | null
        }
        Insert: {
          album?: string | null
          album_artist?: string | null
          artist?: string | null
          audio_url: string
          bitrate?: number | null
          composer?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          disc_number?: number | null
          duration?: number | null
          file_format?: string | null
          file_size?: number | null
          genre?: string | null
          id?: string
          playlist_id: string
          sample_rate?: number | null
          storage_path?: string | null
          title_en: string
          title_ua: string
          track_number: number
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          album?: string | null
          album_artist?: string | null
          artist?: string | null
          audio_url?: string
          bitrate?: number | null
          composer?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          disc_number?: number | null
          duration?: number | null
          file_format?: string | null
          file_size?: number | null
          genre?: string | null
          id?: string
          playlist_id?: string
          sample_rate?: number | null
          storage_path?: string | null
          title_en?: string
          title_ua?: string
          track_number?: number
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audio_tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "audio_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string | null
          description_en: string | null
          description_ua: string | null
          id: string
          name_en: string
          name_ua: string
          post_count: number | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          description_en?: string | null
          description_ua?: string | null
          id?: string
          name_en: string
          name_ua: string
          post_count?: number | null
          slug: string
        }
        Update: {
          created_at?: string | null
          description_en?: string | null
          description_ua?: string | null
          id?: string
          name_en?: string
          name_ua?: string
          post_count?: number | null
          slug?: string
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "mv_blog_recent_published"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          audio_commentary_en_url: string | null
          audio_commentary_ua_url: string | null
          audio_poetry_translation_en_url: string | null
          audio_poetry_translation_ua_url: string | null
          audio_sanskrit_url: string | null
          audio_synonyms_en_url: string | null
          audio_synonyms_ua_url: string | null
          audio_transliteration_url: string | null
          audio_url: string | null
          author_display_name: string | null
          author_id: string
          author_name: string
          category_id: string
          content_en: string
          content_mode: string | null
          content_ua: string
          cover_image_url: string | null
          created_at: string
          display_blocks: Json | null
          excerpt_en: string | null
          excerpt_ua: string | null
          featured_image: string | null
          id: string
          instagram_embed_url: string | null
          is_published: boolean | null
          meta_description_en: string | null
          meta_description_ua: string | null
          poetry_translation_en: string | null
          poetry_translation_ua: string | null
          published_at: string | null
          read_time: number | null
          sanskrit: string | null
          scheduled_publish_at: string | null
          search_vector: unknown
          search_vector_en: unknown
          search_vector_ua: unknown
          slug: string
          substack_embed_url: string | null
          synonyms_en: string | null
          synonyms_ua: string | null
          tags: string[] | null
          telegram_embed_url: string | null
          title_en: string
          title_ua: string
          translation_en: string | null
          translation_ua: string | null
          transliteration: string | null
          updated_at: string
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          audio_commentary_en_url?: string | null
          audio_commentary_ua_url?: string | null
          audio_poetry_translation_en_url?: string | null
          audio_poetry_translation_ua_url?: string | null
          audio_sanskrit_url?: string | null
          audio_synonyms_en_url?: string | null
          audio_synonyms_ua_url?: string | null
          audio_transliteration_url?: string | null
          audio_url?: string | null
          author_display_name?: string | null
          author_id: string
          author_name?: string
          category_id: string
          content_en: string
          content_mode?: string | null
          content_ua: string
          cover_image_url?: string | null
          created_at?: string
          display_blocks?: Json | null
          excerpt_en?: string | null
          excerpt_ua?: string | null
          featured_image?: string | null
          id?: string
          instagram_embed_url?: string | null
          is_published?: boolean | null
          meta_description_en?: string | null
          meta_description_ua?: string | null
          poetry_translation_en?: string | null
          poetry_translation_ua?: string | null
          published_at?: string | null
          read_time?: number | null
          sanskrit?: string | null
          scheduled_publish_at?: string | null
          search_vector?: unknown
          search_vector_en?: unknown
          search_vector_ua?: unknown
          slug: string
          substack_embed_url?: string | null
          synonyms_en?: string | null
          synonyms_ua?: string | null
          tags?: string[] | null
          telegram_embed_url?: string | null
          title_en: string
          title_ua: string
          translation_en?: string | null
          translation_ua?: string | null
          transliteration?: string | null
          updated_at?: string
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          audio_commentary_en_url?: string | null
          audio_commentary_ua_url?: string | null
          audio_poetry_translation_en_url?: string | null
          audio_poetry_translation_ua_url?: string | null
          audio_sanskrit_url?: string | null
          audio_synonyms_en_url?: string | null
          audio_synonyms_ua_url?: string | null
          audio_transliteration_url?: string | null
          audio_url?: string | null
          author_display_name?: string | null
          author_id?: string
          author_name?: string
          category_id?: string
          content_en?: string
          content_mode?: string | null
          content_ua?: string
          cover_image_url?: string | null
          created_at?: string
          display_blocks?: Json | null
          excerpt_en?: string | null
          excerpt_ua?: string | null
          featured_image?: string | null
          id?: string
          instagram_embed_url?: string | null
          is_published?: boolean | null
          meta_description_en?: string | null
          meta_description_ua?: string | null
          poetry_translation_en?: string | null
          poetry_translation_ua?: string | null
          published_at?: string | null
          read_time?: number | null
          sanskrit?: string | null
          scheduled_publish_at?: string | null
          search_vector?: unknown
          search_vector_en?: unknown
          search_vector_ua?: unknown
          slug?: string
          substack_embed_url?: string | null
          synonyms_en?: string | null
          synonyms_ua?: string | null
          tags?: string[] | null
          telegram_embed_url?: string | null
          title_en?: string
          title_ua?: string
          translation_en?: string | null
          translation_ua?: string | null
          transliteration?: string | null
          updated_at?: string
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string | null
          id: string
          name_en: string
          name_ua: string
          post_count: number | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name_en: string
          name_ua: string
          post_count?: number | null
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name_en?: string
          name_ua?: string
          post_count?: number | null
          slug?: string
        }
        Relationships: []
      }
      book_pages: {
        Row: {
          book_id: string
          canto_id: string | null
          content_en: Json | null
          content_ua: Json | null
          created_at: string | null
          id: string
          is_published: boolean | null
          page_order: number
          page_type: string
          slug: string | null
          title_en: string | null
          title_ua: string | null
          updated_at: string | null
        }
        Insert: {
          book_id: string
          canto_id?: string | null
          content_en?: Json | null
          content_ua?: Json | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          page_order?: number
          page_type: string
          slug?: string | null
          title_en?: string | null
          title_ua?: string | null
          updated_at?: string | null
        }
        Update: {
          book_id?: string
          canto_id?: string | null
          content_en?: Json | null
          content_ua?: Json | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          page_order?: number
          page_type?: string
          slug?: string | null
          title_en?: string | null
          title_ua?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_pages_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_pages_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_with_mapping"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_pages_canto_id_fkey"
            columns: ["canto_id"]
            isOneToOne: false
            referencedRelation: "cantos"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          cover_image_path: string | null
          cover_image_url: string | null
          created_at: string
          default_structure: string | null
          deleted_at: string | null
          description_en: string | null
          description_ua: string | null
          display_category: string | null
          display_order: number | null
          gitabase_slug: string | null
          has_cantos: boolean | null
          id: string
          is_featured: boolean | null
          is_published: boolean
          purchase_url: string | null
          slug: string
          title_en: string
          title_ua: string
          vedabase_slug: string | null
        }
        Insert: {
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          default_structure?: string | null
          deleted_at?: string | null
          description_en?: string | null
          description_ua?: string | null
          display_category?: string | null
          display_order?: number | null
          gitabase_slug?: string | null
          has_cantos?: boolean | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean
          purchase_url?: string | null
          slug: string
          title_en: string
          title_ua: string
          vedabase_slug?: string | null
        }
        Update: {
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          default_structure?: string | null
          deleted_at?: string | null
          description_en?: string | null
          description_ua?: string | null
          display_category?: string | null
          display_order?: number | null
          gitabase_slug?: string | null
          has_cantos?: boolean | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean
          purchase_url?: string | null
          slug?: string
          title_en?: string
          title_ua?: string
          vedabase_slug?: string | null
        }
        Relationships: []
      }
      cantos: {
        Row: {
          book_id: string
          canto_number: number
          cover_image_url: string | null
          created_at: string | null
          description_en: string | null
          description_ua: string | null
          id: string
          is_published: boolean | null
          title_en: string
          title_ua: string
        }
        Insert: {
          book_id: string
          canto_number: number
          cover_image_url?: string | null
          created_at?: string | null
          description_en?: string | null
          description_ua?: string | null
          id?: string
          is_published?: boolean | null
          title_en: string
          title_ua: string
        }
        Update: {
          book_id?: string
          canto_number?: number
          cover_image_url?: string | null
          created_at?: string | null
          description_en?: string | null
          description_ua?: string | null
          id?: string
          is_published?: boolean | null
          title_en?: string
          title_ua?: string
        }
        Relationships: [
          {
            foreignKeyName: "cantos_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cantos_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_with_mapping"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          book_id: string | null
          canto_id: string | null
          chapter_number: number
          chapter_type: Database["public"]["Enums"]["chapter_type"] | null
          content_en: string | null
          content_format: string | null
          content_structure: string | null
          content_ua: string | null
          created_at: string
          id: string
          is_published: boolean | null
          summary_en: string | null
          summary_ua: string | null
          title_en: string
          title_ua: string
        }
        Insert: {
          book_id?: string | null
          canto_id?: string | null
          chapter_number: number
          chapter_type?: Database["public"]["Enums"]["chapter_type"] | null
          content_en?: string | null
          content_format?: string | null
          content_structure?: string | null
          content_ua?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          summary_en?: string | null
          summary_ua?: string | null
          title_en: string
          title_ua: string
        }
        Update: {
          book_id?: string | null
          canto_id?: string | null
          chapter_number?: number
          chapter_type?: Database["public"]["Enums"]["chapter_type"] | null
          content_en?: string | null
          content_format?: string | null
          content_structure?: string | null
          content_ua?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          summary_en?: string | null
          summary_ua?: string | null
          title_en?: string
          title_ua?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_with_mapping"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_canto_id_fkey"
            columns: ["canto_id"]
            isOneToOne: false
            referencedRelation: "cantos"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters_archive: {
        Row: {
          book_id: string | null
          canto_id: string | null
          chapter_number: number
          chapter_type: Database["public"]["Enums"]["chapter_type"] | null
          content_en: string | null
          content_format: string | null
          content_ua: string | null
          created_at: string
          id: string
          title_en: string
          title_ua: string
        }
        Insert: {
          book_id?: string | null
          canto_id?: string | null
          chapter_number: number
          chapter_type?: Database["public"]["Enums"]["chapter_type"] | null
          content_en?: string | null
          content_format?: string | null
          content_ua?: string | null
          created_at?: string
          id?: string
          title_en: string
          title_ua: string
        }
        Update: {
          book_id?: string | null
          canto_id?: string | null
          chapter_number?: number
          chapter_type?: Database["public"]["Enums"]["chapter_type"] | null
          content_en?: string | null
          content_format?: string | null
          content_ua?: string | null
          created_at?: string
          id?: string
          title_en?: string
          title_ua?: string
        }
        Relationships: []
      }
      chapters_backup_20251014: {
        Row: {
          book_id: string | null
          canto_id: string | null
          chapter_number: number | null
          chapter_type: Database["public"]["Enums"]["chapter_type"] | null
          content_en: string | null
          content_format: string | null
          content_ua: string | null
          created_at: string | null
          id: string | null
          title_en: string | null
          title_ua: string | null
        }
        Insert: {
          book_id?: string | null
          canto_id?: string | null
          chapter_number?: number | null
          chapter_type?: Database["public"]["Enums"]["chapter_type"] | null
          content_en?: string | null
          content_format?: string | null
          content_ua?: string | null
          created_at?: string | null
          id?: string | null
          title_en?: string | null
          title_ua?: string | null
        }
        Update: {
          book_id?: string | null
          canto_id?: string | null
          chapter_number?: number | null
          chapter_type?: Database["public"]["Enums"]["chapter_type"] | null
          content_en?: string | null
          content_format?: string | null
          content_ua?: string | null
          created_at?: string | null
          id?: string | null
          title_en?: string | null
          title_ua?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          citations: Json | null
          content: string
          created_at: string | null
          id: string
          response_level: string | null
          role: string
          session_id: string
          tattva_ids: string[] | null
        }
        Insert: {
          citations?: Json | null
          content: string
          created_at?: string | null
          id?: string
          response_level?: string | null
          role: string
          session_id: string
          tattva_ids?: string[] | null
        }
        Update: {
          citations?: Json | null
          content?: string
          created_at?: string | null
          id?: string
          response_level?: string | null
          role?: string
          session_id?: string
          tattva_ids?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          language: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          language?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          language?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      content_tattvas: {
        Row: {
          created_at: string
          id: string
          relevance_score: number
          tagged_by: string
          tattva_id: string
          updated_at: string
          verse_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          relevance_score?: number
          tagged_by?: string
          tattva_id: string
          updated_at?: string
          verse_id: string
        }
        Update: {
          created_at?: string
          id?: string
          relevance_score?: number
          tagged_by?: string
          tattva_id?: string
          updated_at?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_tattvas_tattva_id_fkey"
            columns: ["tattva_id"]
            isOneToOne: false
            referencedRelation: "tattva_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tattvas_tattva_id_fkey"
            columns: ["tattva_id"]
            isOneToOne: false
            referencedRelation: "tattvas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tattvas_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tattvas_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses_with_metadata"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tattvas_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses_with_structure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tattvas_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses_with_synonyms"
            referencedColumns: ["id"]
          },
        ]
      }
      cross_references: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          reference_type: string | null
          source_verse_id: string
          target_verse_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          reference_type?: string | null
          source_verse_id: string
          target_verse_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          reference_type?: string | null
          source_verse_id?: string
          target_verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cross_references_source_verse_id_fkey"
            columns: ["source_verse_id"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_references_source_verse_id_fkey"
            columns: ["source_verse_id"]
            isOneToOne: false
            referencedRelation: "verses_with_metadata"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_references_source_verse_id_fkey"
            columns: ["source_verse_id"]
            isOneToOne: false
            referencedRelation: "verses_with_structure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_references_source_verse_id_fkey"
            columns: ["source_verse_id"]
            isOneToOne: false
            referencedRelation: "verses_with_synonyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_references_target_verse_id_fkey"
            columns: ["target_verse_id"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_references_target_verse_id_fkey"
            columns: ["target_verse_id"]
            isOneToOne: false
            referencedRelation: "verses_with_metadata"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_references_target_verse_id_fkey"
            columns: ["target_verse_id"]
            isOneToOne: false
            referencedRelation: "verses_with_structure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_references_target_verse_id_fkey"
            columns: ["target_verse_id"]
            isOneToOne: false
            referencedRelation: "verses_with_synonyms"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_quotes: {
        Row: {
          author_en: string | null
          author_ua: string | null
          created_at: string | null
          created_by: string | null
          display_count: number | null
          id: string
          is_active: boolean | null
          last_displayed_at: string | null
          priority: number | null
          quote_en: string | null
          quote_type: Database["public"]["Enums"]["daily_quote_type"]
          quote_ua: string | null
          source_en: string | null
          source_ua: string | null
          updated_at: string | null
          verse_id: string | null
        }
        Insert: {
          author_en?: string | null
          author_ua?: string | null
          created_at?: string | null
          created_by?: string | null
          display_count?: number | null
          id?: string
          is_active?: boolean | null
          last_displayed_at?: string | null
          priority?: number | null
          quote_en?: string | null
          quote_type: Database["public"]["Enums"]["daily_quote_type"]
          quote_ua?: string | null
          source_en?: string | null
          source_ua?: string | null
          updated_at?: string | null
          verse_id?: string | null
        }
        Update: {
          author_en?: string | null
          author_ua?: string | null
          created_at?: string | null
          created_by?: string | null
          display_count?: number | null
          id?: string
          is_active?: boolean | null
          last_displayed_at?: string | null
          priority?: number | null
          quote_en?: string | null
          quote_type?: Database["public"]["Enums"]["daily_quote_type"]
          quote_ua?: string | null
          source_en?: string | null
          source_ua?: string | null
          updated_at?: string | null
          verse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_quotes_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_quotes_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses_with_metadata"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_quotes_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses_with_structure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_quotes_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses_with_synonyms"
            referencedColumns: ["id"]
          },
        ]
      }
      highlights: {
        Row: {
          book_id: string
          canto_id: string | null
          chapter_id: string
          context_after: string | null
          context_before: string | null
          created_at: string
          highlight_color: string | null
          id: string
          notes: string | null
          selected_text: string
          updated_at: string
          user_id: string
          verse_id: string | null
          verse_number: string | null
        }
        Insert: {
          book_id: string
          canto_id?: string | null
          chapter_id: string
          context_after?: string | null
          context_before?: string | null
          created_at?: string
          highlight_color?: string | null
          id?: string
          notes?: string | null
          selected_text: string
          updated_at?: string
          user_id: string
          verse_id?: string | null
          verse_number?: string | null
        }
        Update: {
          book_id?: string
          canto_id?: string | null
          chapter_id?: string
          context_after?: string | null
          context_before?: string | null
          created_at?: string
          highlight_color?: string | null
          id?: string
          notes?: string | null
          selected_text?: string
          updated_at?: string
          user_id?: string
          verse_id?: string | null
          verse_number?: string | null
        }
        Relationships: []
      }
      intro_chapters: {
        Row: {
          book_id: string
          content_en: string | null
          content_ua: string | null
          created_at: string
          display_order: number
          id: string
          slug: string
          title_en: string
          title_ua: string
          updated_at: string
        }
        Insert: {
          book_id: string
          content_en?: string | null
          content_ua?: string | null
          created_at?: string
          display_order?: number
          id?: string
          slug: string
          title_en: string
          title_ua: string
          updated_at?: string
        }
        Update: {
          book_id?: string
          content_en?: string | null
          content_ua?: string | null
          created_at?: string
          display_order?: number
          id?: string
          slug?: string
          title_en?: string
          title_ua?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "intro_chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intro_chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_with_mapping"
            referencedColumns: ["id"]
          },
        ]
      }
      lecture_paragraphs: {
        Row: {
          audio_timecode: number | null
          content_en: string
          content_ua: string | null
          created_at: string
          id: string
          lecture_id: string
          paragraph_number: number
        }
        Insert: {
          audio_timecode?: number | null
          content_en: string
          content_ua?: string | null
          created_at?: string
          id?: string
          lecture_id: string
          paragraph_number: number
        }
        Update: {
          audio_timecode?: number | null
          content_en?: string
          content_ua?: string | null
          created_at?: string
          id?: string
          lecture_id?: string
          paragraph_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "lecture_paragraphs_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
        ]
      }
      lectures: {
        Row: {
          audio_url: string | null
          book_slug: string | null
          canto_number: number | null
          chapter_number: number | null
          created_at: string
          description_en: string | null
          description_ua: string | null
          id: string
          lecture_date: string
          lecture_type: Database["public"]["Enums"]["lecture_type"]
          location_en: string
          location_ua: string | null
          slug: string
          title_en: string
          title_ua: string | null
          updated_at: string
          verse_number: string | null
        }
        Insert: {
          audio_url?: string | null
          book_slug?: string | null
          canto_number?: number | null
          chapter_number?: number | null
          created_at?: string
          description_en?: string | null
          description_ua?: string | null
          id?: string
          lecture_date: string
          lecture_type?: Database["public"]["Enums"]["lecture_type"]
          location_en: string
          location_ua?: string | null
          slug: string
          title_en: string
          title_ua?: string | null
          updated_at?: string
          verse_number?: string | null
        }
        Update: {
          audio_url?: string | null
          book_slug?: string | null
          canto_number?: number | null
          chapter_number?: number | null
          created_at?: string
          description_en?: string | null
          description_ua?: string | null
          id?: string
          lecture_date?: string
          lecture_type?: Database["public"]["Enums"]["lecture_type"]
          location_en?: string
          location_ua?: string | null
          slug?: string
          title_en?: string
          title_ua?: string | null
          updated_at?: string
          verse_number?: string | null
        }
        Relationships: []
      }
      letters: {
        Row: {
          address_block: string | null
          content_en: string
          content_ua: string | null
          created_at: string
          id: string
          letter_date: string
          location_en: string
          location_ua: string | null
          recipient_en: string
          recipient_ua: string | null
          reference: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          address_block?: string | null
          content_en: string
          content_ua?: string | null
          created_at?: string
          id?: string
          letter_date: string
          location_en: string
          location_ua?: string | null
          recipient_en: string
          recipient_ua?: string | null
          reference?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          address_block?: string | null
          content_en?: string
          content_ua?: string | null
          created_at?: string
          id?: string
          letter_date?: string
          location_en?: string
          location_ua?: string | null
          recipient_en?: string
          recipient_ua?: string | null
          reference?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          banner_image_url: string | null
          content_en: string | null
          content_ua: string | null
          created_at: string
          hero_image_url: string | null
          id: string
          is_published: boolean | null
          meta_description_en: string | null
          meta_description_ua: string | null
          og_image: string | null
          sections: Json | null
          seo_keywords: string | null
          slug: string
          title_en: string
          title_ua: string
          updated_at: string
        }
        Insert: {
          banner_image_url?: string | null
          content_en?: string | null
          content_ua?: string | null
          created_at?: string
          hero_image_url?: string | null
          id?: string
          is_published?: boolean | null
          meta_description_en?: string | null
          meta_description_ua?: string | null
          og_image?: string | null
          sections?: Json | null
          seo_keywords?: string | null
          slug: string
          title_en: string
          title_ua: string
          updated_at?: string
        }
        Update: {
          banner_image_url?: string | null
          content_en?: string | null
          content_ua?: string | null
          created_at?: string
          hero_image_url?: string | null
          id?: string
          is_published?: boolean | null
          meta_description_en?: string | null
          meta_description_ua?: string | null
          og_image?: string | null
          sections?: Json | null
          seo_keywords?: string | null
          slug?: string
          title_en?: string
          title_ua?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sanskrit_lexicon: {
        Row: {
          created_at: string | null
          grammar: string | null
          id: number
          meanings: string | null
          preverbs: string | null
          word: string
          word_devanagari: string | null
          word_normalized: string | null
        }
        Insert: {
          created_at?: string | null
          grammar?: string | null
          id: number
          meanings?: string | null
          preverbs?: string | null
          word: string
          word_devanagari?: string | null
          word_normalized?: string | null
        }
        Update: {
          created_at?: string | null
          grammar?: string | null
          id?: number
          meanings?: string | null
          preverbs?: string | null
          word?: string
          word_devanagari?: string | null
          word_normalized?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      static_page_metadata: {
        Row: {
          created_at: string
          hero_image_url: string | null
          id: string
          meta_description_en: string | null
          meta_description_ua: string | null
          og_image: string | null
          seo_keywords: string | null
          slug: string
          title_en: string
          title_ua: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hero_image_url?: string | null
          id?: string
          meta_description_en?: string | null
          meta_description_ua?: string | null
          og_image?: string | null
          seo_keywords?: string | null
          slug: string
          title_en: string
          title_ua: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hero_image_url?: string | null
          id?: string
          meta_description_en?: string | null
          meta_description_ua?: string | null
          og_image?: string | null
          seo_keywords?: string | null
          slug?: string
          title_en?: string
          title_ua?: string
          updated_at?: string
        }
        Relationships: []
      }
      tattvas: {
        Row: {
          category: string | null
          created_at: string | null
          description_en: string | null
          description_ua: string | null
          display_order: number | null
          id: string
          name_en: string
          name_sanskrit: string | null
          name_ua: string
          parent_id: string | null
          slug: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description_en?: string | null
          description_ua?: string | null
          display_order?: number | null
          id?: string
          name_en: string
          name_sanskrit?: string | null
          name_ua: string
          parent_id?: string | null
          slug: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description_en?: string | null
          description_ua?: string | null
          display_order?: number | null
          id?: string
          name_en?: string
          name_sanskrit?: string | null
          name_ua?: string
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "tattvas_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tattva_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tattvas_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tattvas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_learning_activity: {
        Row: {
          activity_date: string
          correct_count: number | null
          created_at: string | null
          id: string
          reviews_count: number | null
          time_spent_seconds: number | null
          user_id: string
          verses_added: number | null
          words_added: number | null
        }
        Insert: {
          activity_date?: string
          correct_count?: number | null
          created_at?: string | null
          id?: string
          reviews_count?: number | null
          time_spent_seconds?: number | null
          user_id: string
          verses_added?: number | null
          words_added?: number | null
        }
        Update: {
          activity_date?: string
          correct_count?: number | null
          created_at?: string | null
          id?: string
          reviews_count?: number | null
          time_spent_seconds?: number | null
          user_id?: string
          verses_added?: number | null
          words_added?: number | null
        }
        Relationships: []
      }
      user_learning_items: {
        Row: {
          created_at: string | null
          id: string
          item_data: Json
          item_id: string
          item_type: string
          srs_ease_factor: number | null
          srs_interval: number | null
          srs_last_reviewed: string | null
          srs_next_review: string | null
          srs_repetitions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_data: Json
          item_id: string
          item_type: string
          srs_ease_factor?: number | null
          srs_interval?: number | null
          srs_last_reviewed?: string | null
          srs_next_review?: string | null
          srs_repetitions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_data?: Json
          item_id?: string
          item_type?: string
          srs_ease_factor?: number | null
          srs_interval?: number | null
          srs_last_reviewed?: string | null
          srs_next_review?: string | null
          srs_repetitions?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_learning_progress: {
        Row: {
          achievements: Json | null
          created_at: string | null
          current_streak: number | null
          daily_goal: number | null
          id: string
          last_login_date: string | null
          longest_streak: number | null
          total_correct: number | null
          total_reviews: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievements?: Json | null
          created_at?: string | null
          current_streak?: number | null
          daily_goal?: number | null
          id?: string
          last_login_date?: string | null
          longest_streak?: number | null
          total_correct?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievements?: Json | null
          created_at?: string | null
          current_streak?: number | null
          daily_goal?: number | null
          id?: string
          last_login_date?: string | null
          longest_streak?: number | null
          total_correct?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verses: {
        Row: {
          audio_url: string | null
          chapter_id: string
          commentary_en: string | null
          commentary_ua: string | null
          created_at: string
          deleted_at: string | null
          display_blocks: Json | null
          embedding: string | null
          end_verse: number | null
          explanation_en_audio_url: string | null
          explanation_ua_audio_url: string | null
          full_verse_audio_url: string | null
          id: string
          is_composite: boolean | null
          is_published: boolean | null
          recitation_audio_url: string | null
          sanskrit: string | null
          sanskrit_en: string | null
          sanskrit_ua: string | null
          search_vector: unknown
          search_vector_en: unknown
          search_vector_ua: unknown
          sort_key: number | null
          start_verse: number | null
          synonyms_en: string | null
          synonyms_ua: string | null
          translation_en: string | null
          translation_ua: string | null
          transliteration: string | null
          transliteration_en: string | null
          transliteration_ua: string | null
          verse_count: number | null
          verse_end: number | null
          verse_number: string
          verse_number_sort: number | null
          verse_start: number | null
          verse_suffix: string | null
        }
        Insert: {
          audio_url?: string | null
          chapter_id: string
          commentary_en?: string | null
          commentary_ua?: string | null
          created_at?: string
          deleted_at?: string | null
          display_blocks?: Json | null
          embedding?: string | null
          end_verse?: number | null
          explanation_en_audio_url?: string | null
          explanation_ua_audio_url?: string | null
          full_verse_audio_url?: string | null
          id?: string
          is_composite?: boolean | null
          is_published?: boolean | null
          recitation_audio_url?: string | null
          sanskrit?: string | null
          sanskrit_en?: string | null
          sanskrit_ua?: string | null
          search_vector?: unknown
          search_vector_en?: unknown
          search_vector_ua?: unknown
          sort_key?: number | null
          start_verse?: number | null
          synonyms_en?: string | null
          synonyms_ua?: string | null
          translation_en?: string | null
          translation_ua?: string | null
          transliteration?: string | null
          transliteration_en?: string | null
          transliteration_ua?: string | null
          verse_count?: number | null
          verse_end?: number | null
          verse_number: string
          verse_number_sort?: number | null
          verse_start?: number | null
          verse_suffix?: string | null
        }
        Update: {
          audio_url?: string | null
          chapter_id?: string
          commentary_en?: string | null
          commentary_ua?: string | null
          created_at?: string
          deleted_at?: string | null
          display_blocks?: Json | null
          embedding?: string | null
          end_verse?: number | null
          explanation_en_audio_url?: string | null
          explanation_ua_audio_url?: string | null
          full_verse_audio_url?: string | null
          id?: string
          is_composite?: boolean | null
          is_published?: boolean | null
          recitation_audio_url?: string | null
          sanskrit?: string | null
          sanskrit_en?: string | null
          sanskrit_ua?: string | null
          search_vector?: unknown
          search_vector_en?: unknown
          search_vector_ua?: unknown
          sort_key?: number | null
          start_verse?: number | null
          synonyms_en?: string | null
          synonyms_ua?: string | null
          translation_en?: string | null
          translation_ua?: string | null
          transliteration?: string | null
          transliteration_en?: string | null
          transliteration_ua?: string | null
          verse_count?: number | null
          verse_end?: number | null
          verse_number?: string
          verse_number_sort?: number | null
          verse_start?: number | null
          verse_suffix?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "readable_chapters"
            referencedColumns: ["chapter_id"]
          },
        ]
      }
      verses_archive: {
        Row: {
          audio_url: string | null
          chapter_id: string
          commentary_en: string | null
          commentary_ua: string | null
          created_at: string
          id: string
          sanskrit: string | null
          search_vector: unknown
          synonyms_en: string | null
          synonyms_ua: string | null
          translation_en: string | null
          translation_ua: string | null
          transliteration: string | null
          verse_number: string
          verse_number_sort: number | null
        }
        Insert: {
          audio_url?: string | null
          chapter_id: string
          commentary_en?: string | null
          commentary_ua?: string | null
          created_at?: string
          id?: string
          sanskrit?: string | null
          search_vector?: unknown
          synonyms_en?: string | null
          synonyms_ua?: string | null
          translation_en?: string | null
          translation_ua?: string | null
          transliteration?: string | null
          verse_number: string
          verse_number_sort?: number | null
        }
        Update: {
          audio_url?: string | null
          chapter_id?: string
          commentary_en?: string | null
          commentary_ua?: string | null
          created_at?: string
          id?: string
          sanskrit?: string | null
          search_vector?: unknown
          synonyms_en?: string | null
          synonyms_ua?: string | null
          translation_en?: string | null
          translation_ua?: string | null
          transliteration?: string | null
          verse_number?: string
          verse_number_sort?: number | null
        }
        Relationships: []
      }
      verses_backup_20251014: {
        Row: {
          audio_url: string | null
          chapter_id: string | null
          commentary_en: string | null
          commentary_ua: string | null
          created_at: string | null
          id: string | null
          sanskrit: string | null
          search_vector: unknown
          synonyms_en: string | null
          synonyms_ua: string | null
          translation_en: string | null
          translation_ua: string | null
          transliteration: string | null
          verse_number: string | null
          verse_number_sort: number | null
        }
        Insert: {
          audio_url?: string | null
          chapter_id?: string | null
          commentary_en?: string | null
          commentary_ua?: string | null
          created_at?: string | null
          id?: string | null
          sanskrit?: string | null
          search_vector?: unknown
          synonyms_en?: string | null
          synonyms_ua?: string | null
          translation_en?: string | null
          translation_ua?: string | null
          transliteration?: string | null
          verse_number?: string | null
          verse_number_sort?: number | null
        }
        Update: {
          audio_url?: string | null
          chapter_id?: string | null
          commentary_en?: string | null
          commentary_ua?: string | null
          created_at?: string | null
          id?: string | null
          sanskrit?: string | null
          search_vector?: unknown
          synonyms_en?: string | null
          synonyms_ua?: string | null
          translation_en?: string | null
          translation_ua?: string | null
          transliteration?: string | null
          verse_number?: string | null
          verse_number_sort?: number | null
        }
        Relationships: []
      }
      verses_backup_danda_fix: {
        Row: {
          changed_at: string | null
          id: string
          orig_sanskrit_en: string | null
          orig_sanskrit_ua: string | null
        }
        Insert: {
          changed_at?: string | null
          id: string
          orig_sanskrit_en?: string | null
          orig_sanskrit_ua?: string | null
        }
        Update: {
          changed_at?: string | null
          id?: string
          orig_sanskrit_en?: string | null
          orig_sanskrit_ua?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      audio_track_daily_stats: {
        Row: {
          avg_track_duration_ms: number | null
          completed_duration_ms: number | null
          completes: number | null
          day_utc: string | null
          events_total: number | null
          last_event_at: string | null
          pauses: number | null
          plays: number | null
          skips: number | null
          track_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audio_events_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "audio_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts_public: {
        Row: {
          audio_url: string | null
          author_display_name: string | null
          category_id: string | null
          content_en: string | null
          content_ua: string | null
          cover_image_url: string | null
          created_at: string | null
          excerpt_en: string | null
          excerpt_ua: string | null
          featured_image: string | null
          id: string | null
          instagram_embed_url: string | null
          is_published: boolean | null
          meta_description_en: string | null
          meta_description_ua: string | null
          published_at: string | null
          read_time: number | null
          scheduled_publish_at: string | null
          search_vector: unknown
          slug: string | null
          substack_embed_url: string | null
          tags: string[] | null
          telegram_embed_url: string | null
          title_en: string | null
          title_ua: string | null
          updated_at: string | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          audio_url?: string | null
          author_display_name?: string | null
          category_id?: string | null
          content_en?: string | null
          content_ua?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          excerpt_en?: string | null
          excerpt_ua?: string | null
          featured_image?: string | null
          id?: string | null
          instagram_embed_url?: string | null
          is_published?: boolean | null
          meta_description_en?: string | null
          meta_description_ua?: string | null
          published_at?: string | null
          read_time?: number | null
          scheduled_publish_at?: string | null
          search_vector?: unknown
          slug?: string | null
          substack_embed_url?: string | null
          tags?: string[] | null
          telegram_embed_url?: string | null
          title_en?: string | null
          title_ua?: string | null
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          audio_url?: string | null
          author_display_name?: string | null
          category_id?: string | null
          content_en?: string | null
          content_ua?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          excerpt_en?: string | null
          excerpt_ua?: string | null
          featured_image?: string | null
          id?: string | null
          instagram_embed_url?: string | null
          is_published?: boolean | null
          meta_description_en?: string | null
          meta_description_ua?: string | null
          published_at?: string | null
          read_time?: number | null
          scheduled_publish_at?: string | null
          search_vector?: unknown
          slug?: string | null
          substack_embed_url?: string | null
          tags?: string[] | null
          telegram_embed_url?: string | null
          title_en?: string | null
          title_ua?: string | null
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      book_pages_with_metadata: {
        Row: {
          book_id: string | null
          book_slug: string | null
          book_title_en: string | null
          book_title_ua: string | null
          content_en: Json | null
          content_ua: Json | null
          created_at: string | null
          id: string | null
          is_published: boolean | null
          page_order: number | null
          page_type: string | null
          page_type_display: string | null
          slug: string | null
          title_en: string | null
          title_ua: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_pages_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_pages_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_with_mapping"
            referencedColumns: ["id"]
          },
        ]
      }
      books_with_mapping: {
        Row: {
          cantos_count: number | null
          chapters_count: number | null
          default_structure: string | null
          gitabase_slug: string | null
          has_cantos: boolean | null
          id: string | null
          our_slug: string | null
          title_en: string | null
          title_ua: string | null
          vedabase_slug: string | null
          verses_count: number | null
        }
        Insert: {
          cantos_count?: never
          chapters_count?: never
          default_structure?: string | null
          gitabase_slug?: string | null
          has_cantos?: boolean | null
          id?: string | null
          our_slug?: string | null
          title_en?: string | null
          title_ua?: string | null
          vedabase_slug?: string | null
          verses_count?: never
        }
        Update: {
          cantos_count?: never
          chapters_count?: never
          default_structure?: string | null
          gitabase_slug?: string | null
          has_cantos?: boolean | null
          id?: string | null
          our_slug?: string | null
          title_en?: string | null
          title_ua?: string | null
          vedabase_slug?: string | null
          verses_count?: never
        }
        Relationships: []
      }
      mv_blog_recent_published: {
        Row: {
          category_id: string | null
          created_at: string | null
          featured_image: string | null
          id: string | null
          is_published: boolean | null
          slug: string | null
          sort_date: string | null
          title_en: string | null
          title_ua: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      readable_chapters: {
        Row: {
          book_id: string | null
          book_slug: string | null
          book_title_en: string | null
          book_title_ua: string | null
          chapter_id: string | null
          chapter_number: number | null
          chapter_title_en: string | null
          chapter_title_ua: string | null
          chapter_type: Database["public"]["Enums"]["chapter_type"] | null
          completion_percentage: number | null
          filled_verses: number | null
          total_verses: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_with_mapping"
            referencedColumns: ["id"]
          },
        ]
      }
      tattva_stats: {
        Row: {
          ai_tagged: number | null
          avg_relevance: number | null
          id: string | null
          manual_tagged: number | null
          name_en: string | null
          name_ua: string | null
          seed_tagged: number | null
          slug: string | null
          verses_count: number | null
        }
        Relationships: []
      }
      verses_with_metadata: {
        Row: {
          audio_url: string | null
          book_slug: string | null
          chapter_id: string | null
          chapter_number: number | null
          chapter_title_en: string | null
          chapter_title_ua: string | null
          commentary_en: string | null
          commentary_ua: string | null
          created_at: string | null
          deleted_at: string | null
          display_blocks: Json | null
          end_verse: number | null
          id: string | null
          is_composite: boolean | null
          is_published: boolean | null
          sanskrit: string | null
          sanskrit_en: string | null
          sanskrit_ua: string | null
          search_vector: unknown
          sort_key: number | null
          start_verse: number | null
          synonyms_en: string | null
          synonyms_ua: string | null
          translation_en: string | null
          translation_ua: string | null
          transliteration: string | null
          transliteration_en: string | null
          transliteration_ua: string | null
          verse_count: number | null
          verse_end: number | null
          verse_number: string | null
          verse_number_sort: number | null
          verse_start: number | null
          verse_suffix: string | null
          verse_type_display: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "readable_chapters"
            referencedColumns: ["chapter_id"]
          },
        ]
      }
      verses_with_structure: {
        Row: {
          chapter_id: string | null
          detected_structure: string | null
          display_blocks: Json | null
          has_commentary: boolean | null
          has_sanskrit: boolean | null
          has_synonyms: boolean | null
          has_translation: boolean | null
          has_transliteration: boolean | null
          id: string | null
          verse_number: string | null
        }
        Insert: {
          chapter_id?: string | null
          detected_structure?: never
          display_blocks?: Json | null
          has_commentary?: never
          has_sanskrit?: never
          has_synonyms?: never
          has_translation?: never
          has_transliteration?: never
          id?: string | null
          verse_number?: string | null
        }
        Update: {
          chapter_id?: string | null
          detected_structure?: never
          display_blocks?: Json | null
          has_commentary?: never
          has_sanskrit?: never
          has_synonyms?: never
          has_translation?: never
          has_transliteration?: never
          id?: string | null
          verse_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "readable_chapters"
            referencedColumns: ["chapter_id"]
          },
        ]
      }
      verses_with_synonyms: {
        Row: {
          book_slug: string | null
          chapter_number: number | null
          id: string | null
          sanskrit: string | null
          synonyms_en: string | null
          synonyms_ua: string | null
          title_en: string | null
          title_ua: string | null
          translation_en: string | null
          translation_ua: string | null
          transliteration_en: string | null
          transliteration_ua: string | null
          verse_number: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      count_visible_blocks: { Args: { verse_id: string }; Returns: number }
      create_blog_post: {
        Args: {
          _audio_url?: string
          _category_id?: string
          _content_en: string
          _content_ua: string
          _cover_image_url?: string
          _excerpt_en?: string
          _excerpt_ua?: string
          _is_published?: boolean
          _scheduled_publish_at?: string
          _tags?: string[]
          _title_en: string
          _title_ua: string
          _video_url?: string
        }
        Returns: {
          audio_commentary_en_url: string | null
          audio_commentary_ua_url: string | null
          audio_poetry_translation_en_url: string | null
          audio_poetry_translation_ua_url: string | null
          audio_sanskrit_url: string | null
          audio_synonyms_en_url: string | null
          audio_synonyms_ua_url: string | null
          audio_transliteration_url: string | null
          audio_url: string | null
          author_display_name: string | null
          author_id: string
          author_name: string
          category_id: string
          content_en: string
          content_mode: string | null
          content_ua: string
          cover_image_url: string | null
          created_at: string
          display_blocks: Json | null
          excerpt_en: string | null
          excerpt_ua: string | null
          featured_image: string | null
          id: string
          instagram_embed_url: string | null
          is_published: boolean | null
          meta_description_en: string | null
          meta_description_ua: string | null
          poetry_translation_en: string | null
          poetry_translation_ua: string | null
          published_at: string | null
          read_time: number | null
          sanskrit: string | null
          scheduled_publish_at: string | null
          search_vector: unknown
          search_vector_en: unknown
          search_vector_ua: unknown
          slug: string
          substack_embed_url: string | null
          synonyms_en: string | null
          synonyms_ua: string | null
          tags: string[] | null
          telegram_embed_url: string | null
          title_en: string
          title_ua: string
          translation_en: string | null
          translation_ua: string | null
          transliteration: string | null
          updated_at: string
          video_url: string | null
          view_count: number | null
        }
        SetofOptions: {
          from: "*"
          to: "blog_posts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_book_by_vedabase_slug: {
        Args: { v_slug: string }
        Returns: {
          default_structure: string
          gitabase_slug: string
          id: string
          slug: string
          title_en: string
          title_ua: string
          vedabase_slug: string
        }[]
      }
      get_book_pages:
        | {
            Args: {
              p_book_id: string
              p_canto_id?: string
              p_language?: string
            }
            Returns: {
              content: Json
              id: string
              page_order: number
              page_type: string
              slug: string
              title: string
            }[]
          }
        | {
            Args: { p_book_id: string; p_language?: string }
            Returns: {
              content: Json
              id: string
              page_order: number
              page_type: string
              slug: string
              title: string
            }[]
          }
      get_chapter_verses: {
        Args: { p_chapter_id: string }
        Returns: {
          audio_url: string
          commentary_en: string
          commentary_ua: string
          end_verse: number
          id: string
          is_composite: boolean
          sanskrit: string
          start_verse: number
          synonyms_en: string
          synonyms_ua: string
          translation_en: string
          translation_ua: string
          transliteration: string
          verse_count: number
          verse_number: string
        }[]
      }
      get_tattva_breadcrumb: {
        Args: { p_tattva_slug: string }
        Returns: {
          depth: number
          id: string
          name_en: string
          name_ua: string
          slug: string
        }[]
      }
      get_tattva_verses: {
        Args: {
          p_include_children?: boolean
          p_limit?: number
          p_offset?: number
          p_tattva_slug: string
        }
        Returns: {
          book_slug: string
          book_title: string
          canto_number: number
          chapter_number: number
          relevance_score: number
          sanskrit: string
          tattva_name: string
          translation_en: string
          translation_ua: string
          verse_id: string
          verse_number: string
        }[]
      }
      get_topic_statistics: {
        Args: {
          book_ids?: string[]
          language_code: string
          search_query: string
        }
        Returns: {
          book_id: string
          book_slug: string
          book_title: string
          sample_verses: string[]
          verse_count: number
        }[]
      }
      get_unique_synonym_terms: {
        Args: {
          limit_count?: number
          prefix_filter?: string
          search_language?: string
        }
        Returns: {
          frequency: number
          term: string
        }[]
      }
      get_verse_id_by_ref: {
        Args: {
          p_book_slug: string
          p_chapter_number: number
          p_verse_number: string
        }
        Returns: string
      }
      get_verse_tattvas: {
        Args: { p_verse_id: string }
        Returns: {
          category: string
          id: string
          name_en: string
          name_sanskrit: string
          name_ua: string
          relevance_score: number
          slug: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hybrid_search_verses: {
        Args: {
          language_code?: string
          match_count?: number
          query_embedding?: string
          query_text: string
          semantic_weight?: number
        }
        Returns: {
          book_slug: string
          chapter_id: string
          combined_score: number
          commentary: string
          id: string
          translation: string
          verse_number: string
        }[]
      }
      increment_blog_post_views: {
        Args: { post_id: string }
        Returns: undefined
      }
      is_chapter_readable: { Args: { chapter_uuid: string }; Returns: boolean }
      link_verse_to_tattva: {
        Args: {
          p_book_slug: string
          p_chapter_number: number
          p_relevance?: number
          p_tagged_by?: string
          p_tattva_slug: string
          p_verse_number: string
        }
        Returns: undefined
      }
      normalize_sanskrit_word: { Args: { word: string }; Returns: string }
      normalize_ukrainian_cc_texts: { Args: never; Returns: undefined }
      parse_verse_number: {
        Args: { v_num: string }
        Returns: {
          v_end: number
          v_start: number
          v_suffix: string
        }[]
      }
      remove_adjacent_duplicate_paragraphs: {
        Args: { input_text: string }
        Returns: string
      }
      remove_adjacent_duplicate_sentences: {
        Args: { input_text: string }
        Returns: string
      }
      remove_duplicate_words_in_synonyms: { Args: never; Returns: undefined }
      search_glossary_terms: {
        Args: {
          book_filter?: string
          limit_count?: number
          search_language?: string
          search_mode?: string
          search_term: string
        }
        Returns: {
          book_id: string
          book_slug: string
          book_title: string
          canto_number: number
          chapter_number: number
          meaning: string
          term: string
          verse_id: string
          verse_link: string
          verse_number: string
        }[]
      }
      search_sanskrit_by_meaning: {
        Args: { result_limit?: number; search_term: string }
        Returns: {
          grammar: string
          id: number
          meanings: string
          relevance: number
          word: string
          word_devanagari: string
        }[]
      }
      search_sanskrit_lexicon: {
        Args: {
          grammar_filter?: string
          result_limit?: number
          search_mode?: string
          search_term: string
        }
        Returns: {
          grammar: string
          id: number
          meanings: string
          preverbs: string
          relevance: number
          word: string
          word_devanagari: string
        }[]
      }
      search_suggest_terms: {
        Args: {
          language_code?: string
          limit_count?: number
          search_prefix: string
        }
        Returns: {
          frequency: number
          source: string
          suggestion: string
        }[]
      }
      search_synonyms: {
        Args: {
          limit_count?: number
          offset_count?: number
          search_language?: string
          search_mode?: string
          search_term: string
        }
        Returns: {
          book_slug: string
          book_title: string
          canto_number: number | null
          chapter_number: number
          match_rank: number
          sanskrit: string
          synonyms: string
          translation: string
          transliteration: string
          verse_id: string
          verse_number: string
        }[]
      }
      search_tattvas: {
        Args: { p_query: string }
        Returns: {
          category: string
          description_en: string
          description_ua: string
          id: string
          name_en: string
          name_sanskrit: string
          name_ua: string
          parent_id: string
          parent_slug: string
          slug: string
          verses_count: number
        }[]
      }
      search_verses_fulltext: {
        Args: {
          book_ids?: string[]
          include_commentary: boolean
          include_sanskrit: boolean
          include_synonyms: boolean
          include_translation: boolean
          include_transliteration: boolean
          language_code: string
          limit_count?: number
          search_query: string
        }
        Returns: {
          book_id: string
          book_slug: string
          book_title: string
          canto_id: string
          canto_number: number
          canto_title: string
          chapter_id: string
          chapter_number: number
          chapter_title: string
          commentary: string
          matched_in: string[]
          relevance_rank: number
          sanskrit: string
          search_snippet: string
          synonyms: string
          translation: string
          transliteration: string
          verse_id: string
          verse_number: string
        }[]
      }
      semantic_search_verses: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          book_slug: string
          chapter_id: string
          commentary_en: string
          commentary_ua: string
          id: string
          similarity: number
          translation_en: string
          translation_ua: string
          verse_number: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      slugify: { Args: { "": string }; Returns: string }
      unaccent: { Args: { "": string }; Returns: string }
      unified_search: {
        Args: {
          language_code?: string
          limit_per_type?: number
          overall_limit?: number
          search_query: string
          search_types?: string[]
        }
        Returns: {
          href: string
          matched_in: string[]
          relevance: number
          result_id: string
          result_type: string
          snippet: string
          subtitle: string
          title: string
        }[]
      }
      update_intro_chapters_order: {
        Args: { p_items: Json }
        Returns: undefined
      }
      upsert_learning_activity: {
        Args: {
          p_correct?: number
          p_reviews?: number
          p_time?: number
          p_user_id: string
          p_verses?: number
          p_words?: number
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
      audio_event_type: "play" | "pause" | "complete" | "skip"
      chapter_type: "verses" | "text"
      daily_quote_type: "verse" | "custom"
      lecture_type:
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
        | "Other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user"],
      audio_event_type: ["play", "pause", "complete", "skip"],
      chapter_type: ["verses", "text"],
      daily_quote_type: ["verse", "custom"],
      lecture_type: [
        "Conversation",
        "Walk",
        "Morning Walk",
        "Lecture",
        "Bhagavad-gita",
        "Srimad-Bhagavatam",
        "Nectar of Devotion",
        "Sri Isopanisad",
        "Sri Caitanya-caritamrta",
        "Initiation",
        "Room Conversation",
        "Interview",
        "Arrival",
        "Departure",
        "Festival",
        "Bhajan",
        "Kirtan",
        "Other",
      ],
    },
  },
} as const
