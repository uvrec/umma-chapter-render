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
          audio_url: string | null
          author_display_name: string | null
          author_id: string
          author_name: string
          category_id: string
          content_en: string
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
          published_at: string | null
          read_time: number | null
          sanskrit: string | null
          scheduled_publish_at: string | null
          search_vector: unknown | null
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
          audio_url?: string | null
          author_display_name?: string | null
          author_id: string
          author_name?: string
          category_id: string
          content_en: string
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
          published_at?: string | null
          read_time?: number | null
          sanskrit?: string | null
          scheduled_publish_at?: string | null
          search_vector?: unknown | null
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
          audio_url?: string | null
          author_display_name?: string | null
          author_id?: string
          author_name?: string
          category_id?: string
          content_en?: string
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
          published_at?: string | null
          read_time?: number | null
          sanskrit?: string | null
          scheduled_publish_at?: string | null
          search_vector?: unknown | null
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
      books: {
        Row: {
          cover_image_path: string | null
          cover_image_url: string | null
          created_at: string
          default_structure: string | null
          description_en: string | null
          description_ua: string | null
          display_category: string | null
          display_order: number | null
          gitabase_slug: string | null
          has_cantos: boolean | null
          id: string
          is_featured: boolean | null
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
          description_en?: string | null
          description_ua?: string | null
          display_category?: string | null
          display_order?: number | null
          gitabase_slug?: string | null
          has_cantos?: boolean | null
          id?: string
          is_featured?: boolean | null
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
          description_en?: string | null
          description_ua?: string | null
          display_category?: string | null
          display_order?: number | null
          gitabase_slug?: string | null
          has_cantos?: boolean | null
          id?: string
          is_featured?: boolean | null
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
          display_blocks: Json | null
          id: string
          is_published: boolean | null
          sanskrit: string | null
          search_vector: unknown | null
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
          display_blocks?: Json | null
          id?: string
          is_published?: boolean | null
          sanskrit?: string | null
          search_vector?: unknown | null
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
          display_blocks?: Json | null
          id?: string
          is_published?: boolean | null
          sanskrit?: string | null
          search_vector?: unknown | null
          synonyms_en?: string | null
          synonyms_ua?: string | null
          translation_en?: string | null
          translation_ua?: string | null
          transliteration?: string | null
          verse_number?: string
          verse_number_sort?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
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
          search_vector: unknown | null
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
          search_vector?: unknown | null
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
          search_vector?: unknown | null
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
          search_vector: unknown | null
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
          search_vector?: unknown | null
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
          search_vector?: unknown | null
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
          search_vector: unknown | null
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
          search_vector?: unknown | null
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
          search_vector?: unknown | null
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
        ]
      }
    }
    Functions: {
      count_visible_blocks: {
        Args: { verse_id: string }
        Returns: number
      }
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
          audio_url: string | null
          author_display_name: string | null
          author_id: string
          author_name: string
          category_id: string
          content_en: string
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
          published_at: string | null
          read_time: number | null
          sanskrit: string | null
          scheduled_publish_at: string | null
          search_vector: unknown | null
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_blog_post_views: {
        Args: { post_id: string }
        Returns: undefined
      }
      slugify: {
        Args: { "": string }
        Returns: string
      }
      update_intro_chapters_order: {
        Args: { p_items: Json }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
      audio_event_type: "play" | "pause" | "complete" | "skip"
      chapter_type: "verses" | "text"
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
    },
  },
} as const
