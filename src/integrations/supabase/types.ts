export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      appearance_days: {
        Row: {
          category_id: number | null;
          created_at: string | null;
          description_en: string | null;
          description_uk: string | null;
          event_type: string;
          fasting_level: string | null;
          id: string;
          image_url: string | null;
          is_major: boolean | null;
          observances_en: string | null;
          observances_uk: string | null;
          paksha: string | null;
          person_name_en: string;
          person_name_sanskrit: string | null;
          person_name_uk: string;
          person_title_en: string | null;
          person_title_uk: string | null;
          short_description_en: string | null;
          short_description_uk: string | null;
          slug: string;
          sort_order: number | null;
          tithi_number: number | null;
          updated_at: string | null;
          vaishnava_month_id: number | null;
        };
        Insert: {
          category_id?: number | null;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          event_type: string;
          fasting_level?: string | null;
          id?: string;
          image_url?: string | null;
          is_major?: boolean | null;
          observances_en?: string | null;
          observances_uk?: string | null;
          paksha?: string | null;
          person_name_en: string;
          person_name_sanskrit?: string | null;
          person_name_uk: string;
          person_title_en?: string | null;
          person_title_uk?: string | null;
          short_description_en?: string | null;
          short_description_uk?: string | null;
          slug: string;
          sort_order?: number | null;
          tithi_number?: number | null;
          updated_at?: string | null;
          vaishnava_month_id?: number | null;
        };
        Update: {
          category_id?: number | null;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          event_type?: string;
          fasting_level?: string | null;
          id?: string;
          image_url?: string | null;
          is_major?: boolean | null;
          observances_en?: string | null;
          observances_uk?: string | null;
          paksha?: string | null;
          person_name_en?: string;
          person_name_sanskrit?: string | null;
          person_name_uk?: string;
          person_title_en?: string | null;
          person_title_uk?: string | null;
          short_description_en?: string | null;
          short_description_uk?: string | null;
          slug?: string;
          sort_order?: number | null;
          tithi_number?: number | null;
          updated_at?: string | null;
          vaishnava_month_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "appearance_days_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "festival_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appearance_days_vaishnava_month_id_fkey";
            columns: ["vaishnava_month_id"];
            isOneToOne: false;
            referencedRelation: "vaishnava_months";
            referencedColumns: ["id"];
          },
        ];
      };
      audio_categories: {
        Row: {
          created_at: string | null;
          description_en: string | null;
          description_uk: string | null;
          display_order: number | null;
          icon: string | null;
          id: string;
          name_en: string;
          name_uk: string;
          slug: string;
        };
        Insert: {
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          display_order?: number | null;
          icon?: string | null;
          id?: string;
          name_en: string;
          name_uk: string;
          slug: string;
        };
        Update: {
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          display_order?: number | null;
          icon?: string | null;
          id?: string;
          name_en?: string;
          name_uk?: string;
          slug?: string;
        };
        Relationships: [];
      };
      audio_events: {
        Row: {
          created_at: string;
          duration_ms: number | null;
          event_type: string;
          id: string;
          position_ms: number | null;
          track_id: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          duration_ms?: number | null;
          event_type: string;
          id?: string;
          position_ms?: number | null;
          track_id: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          duration_ms?: number | null;
          event_type?: string;
          id?: string;
          position_ms?: number | null;
          track_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audio_events_track_id_fkey";
            columns: ["track_id"];
            isOneToOne: false;
            referencedRelation: "audio_tracks";
            referencedColumns: ["id"];
          },
        ];
      };
      audio_playlists: {
        Row: {
          author: string | null;
          category_id: string;
          cover_image_path: string | null;
          cover_image_url: string | null;
          created_at: string | null;
          description_en: string | null;
          description_uk: string | null;
          display_order: number | null;
          id: string;
          is_published: boolean | null;
          slug: string | null;
          title_en: string;
          title_uk: string;
          total_duration: number | null;
          total_tracks: number | null;
          updated_at: string | null;
          year: number | null;
        };
        Insert: {
          author?: string | null;
          category_id: string;
          cover_image_path?: string | null;
          cover_image_url?: string | null;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          display_order?: number | null;
          id?: string;
          is_published?: boolean | null;
          slug?: string | null;
          title_en: string;
          title_uk: string;
          total_duration?: number | null;
          total_tracks?: number | null;
          updated_at?: string | null;
          year?: number | null;
        };
        Update: {
          author?: string | null;
          category_id?: string;
          cover_image_path?: string | null;
          cover_image_url?: string | null;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          display_order?: number | null;
          id?: string;
          is_published?: boolean | null;
          slug?: string | null;
          title_en?: string;
          title_uk?: string;
          total_duration?: number | null;
          total_tracks?: number | null;
          updated_at?: string | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "audio_playlists_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "audio_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      audio_tracks: {
        Row: {
          album: string | null;
          album_artist: string | null;
          artist: string | null;
          audio_url: string;
          bitrate: number | null;
          composer: string | null;
          cover_image_url: string | null;
          created_at: string | null;
          disc_number: number | null;
          duration: number | null;
          file_format: string | null;
          file_size: number | null;
          genre: string | null;
          id: string;
          playlist_id: string;
          sample_rate: number | null;
          storage_path: string | null;
          title_en: string;
          title_uk: string;
          track_number: number;
          updated_at: string | null;
          year: number | null;
        };
        Insert: {
          album?: string | null;
          album_artist?: string | null;
          artist?: string | null;
          audio_url: string;
          bitrate?: number | null;
          composer?: string | null;
          cover_image_url?: string | null;
          created_at?: string | null;
          disc_number?: number | null;
          duration?: number | null;
          file_format?: string | null;
          file_size?: number | null;
          genre?: string | null;
          id?: string;
          playlist_id: string;
          sample_rate?: number | null;
          storage_path?: string | null;
          title_en: string;
          title_uk: string;
          track_number: number;
          updated_at?: string | null;
          year?: number | null;
        };
        Update: {
          album?: string | null;
          album_artist?: string | null;
          artist?: string | null;
          audio_url?: string;
          bitrate?: number | null;
          composer?: string | null;
          cover_image_url?: string | null;
          created_at?: string | null;
          disc_number?: number | null;
          duration?: number | null;
          file_format?: string | null;
          file_size?: number | null;
          genre?: string | null;
          id?: string;
          playlist_id?: string;
          sample_rate?: number | null;
          storage_path?: string | null;
          title_en?: string;
          title_uk?: string;
          track_number?: number;
          updated_at?: string | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "audio_tracks_playlist_id_fkey";
            columns: ["playlist_id"];
            isOneToOne: false;
            referencedRelation: "audio_playlists";
            referencedColumns: ["id"];
          },
        ];
      };
      bengali_lexicon: {
        Row: {
          created_at: string | null;
          id: number;
          word_bn: string;
          word_en: string;
          word_en_normalized: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          word_bn: string;
          word_en: string;
          word_en_normalized?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          word_bn?: string;
          word_en?: string;
          word_en_normalized?: string | null;
        };
        Relationships: [];
      };
      blog_categories: {
        Row: {
          created_at: string | null;
          description_en: string | null;
          description_uk: string | null;
          id: string;
          name_en: string;
          name_uk: string;
          post_count: number | null;
          slug: string;
        };
        Insert: {
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          id?: string;
          name_en: string;
          name_uk: string;
          post_count?: number | null;
          slug: string;
        };
        Update: {
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          id?: string;
          name_en?: string;
          name_uk?: string;
          post_count?: number | null;
          slug?: string;
        };
        Relationships: [];
      };
      blog_post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "blog_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_post_tags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "blog_posts_public";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_post_tags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "mv_blog_recent_published";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "blog_tags";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_posts: {
        Row: {
          audio_commentary_en_url: string | null;
          audio_commentary_uk_url: string | null;
          audio_poetry_translation_en_url: string | null;
          audio_poetry_translation_uk_url: string | null;
          audio_sanskrit_url: string | null;
          audio_synonyms_en_url: string | null;
          audio_synonyms_uk_url: string | null;
          audio_transliteration_url: string | null;
          audio_url: string | null;
          author_display_name: string | null;
          author_id: string;
          author_name: string;
          category_id: string;
          content_en: string;
          content_mode: string | null;
          content_uk: string;
          cover_image_url: string | null;
          created_at: string;
          display_blocks: Json | null;
          excerpt_en: string | null;
          excerpt_uk: string | null;
          featured_image: string | null;
          id: string;
          instagram_embed_url: string | null;
          is_published: boolean | null;
          meta_description_en: string | null;
          meta_description_uk: string | null;
          poetry_translation_en: string | null;
          poetry_translation_uk: string | null;
          published_at: string | null;
          read_time: number | null;
          sanskrit: string | null;
          scheduled_publish_at: string | null;
          search_vector: unknown;
          search_vector_en: unknown;
          search_vector_uk: unknown;
          slug: string;
          substack_embed_url: string | null;
          synonyms_en: string | null;
          synonyms_uk: string | null;
          tags: string[] | null;
          telegram_embed_url: string | null;
          title_en: string;
          title_uk: string;
          translation_en: string | null;
          translation_uk: string | null;
          transliteration: string | null;
          updated_at: string;
          video_url: string | null;
          view_count: number | null;
        };
        Insert: {
          audio_commentary_en_url?: string | null;
          audio_commentary_uk_url?: string | null;
          audio_poetry_translation_en_url?: string | null;
          audio_poetry_translation_uk_url?: string | null;
          audio_sanskrit_url?: string | null;
          audio_synonyms_en_url?: string | null;
          audio_synonyms_uk_url?: string | null;
          audio_transliteration_url?: string | null;
          audio_url?: string | null;
          author_display_name?: string | null;
          author_id: string;
          author_name?: string;
          category_id: string;
          content_en: string;
          content_mode?: string | null;
          content_uk: string;
          cover_image_url?: string | null;
          created_at?: string;
          display_blocks?: Json | null;
          excerpt_en?: string | null;
          excerpt_uk?: string | null;
          featured_image?: string | null;
          id?: string;
          instagram_embed_url?: string | null;
          is_published?: boolean | null;
          meta_description_en?: string | null;
          meta_description_uk?: string | null;
          poetry_translation_en?: string | null;
          poetry_translation_uk?: string | null;
          published_at?: string | null;
          read_time?: number | null;
          sanskrit?: string | null;
          scheduled_publish_at?: string | null;
          search_vector?: unknown;
          search_vector_en?: unknown;
          search_vector_uk?: unknown;
          slug: string;
          substack_embed_url?: string | null;
          synonyms_en?: string | null;
          synonyms_uk?: string | null;
          tags?: string[] | null;
          telegram_embed_url?: string | null;
          title_en: string;
          title_uk: string;
          translation_en?: string | null;
          translation_uk?: string | null;
          transliteration?: string | null;
          updated_at?: string;
          video_url?: string | null;
          view_count?: number | null;
        };
        Update: {
          audio_commentary_en_url?: string | null;
          audio_commentary_uk_url?: string | null;
          audio_poetry_translation_en_url?: string | null;
          audio_poetry_translation_uk_url?: string | null;
          audio_sanskrit_url?: string | null;
          audio_synonyms_en_url?: string | null;
          audio_synonyms_uk_url?: string | null;
          audio_transliteration_url?: string | null;
          audio_url?: string | null;
          author_display_name?: string | null;
          author_id?: string;
          author_name?: string;
          category_id?: string;
          content_en?: string;
          content_mode?: string | null;
          content_uk?: string;
          cover_image_url?: string | null;
          created_at?: string;
          display_blocks?: Json | null;
          excerpt_en?: string | null;
          excerpt_uk?: string | null;
          featured_image?: string | null;
          id?: string;
          instagram_embed_url?: string | null;
          is_published?: boolean | null;
          meta_description_en?: string | null;
          meta_description_uk?: string | null;
          poetry_translation_en?: string | null;
          poetry_translation_uk?: string | null;
          published_at?: string | null;
          read_time?: number | null;
          sanskrit?: string | null;
          scheduled_publish_at?: string | null;
          search_vector?: unknown;
          search_vector_en?: unknown;
          search_vector_uk?: unknown;
          slug?: string;
          substack_embed_url?: string | null;
          synonyms_en?: string | null;
          synonyms_uk?: string | null;
          tags?: string[] | null;
          telegram_embed_url?: string | null;
          title_en?: string;
          title_uk?: string;
          translation_en?: string | null;
          translation_uk?: string | null;
          transliteration?: string | null;
          updated_at?: string;
          video_url?: string | null;
          view_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "blog_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_tags: {
        Row: {
          created_at: string | null;
          id: string;
          name_en: string;
          name_uk: string;
          post_count: number | null;
          slug: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name_en: string;
          name_uk: string;
          post_count?: number | null;
          slug: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name_en?: string;
          name_uk?: string;
          post_count?: number | null;
          slug?: string;
        };
        Relationships: [];
      };
      book_pages: {
        Row: {
          book_id: string;
          canto_id: string | null;
          content_en: Json | null;
          content_uk: Json | null;
          created_at: string | null;
          id: string;
          is_published: boolean | null;
          page_order: number;
          page_type: string;
          slug: string | null;
          title_en: string | null;
          title_uk: string | null;
          updated_at: string | null;
        };
        Insert: {
          book_id: string;
          canto_id?: string | null;
          content_en?: Json | null;
          content_uk?: Json | null;
          created_at?: string | null;
          id?: string;
          is_published?: boolean | null;
          page_order?: number;
          page_type: string;
          slug?: string | null;
          title_en?: string | null;
          title_uk?: string | null;
          updated_at?: string | null;
        };
        Update: {
          book_id?: string;
          canto_id?: string | null;
          content_en?: Json | null;
          content_uk?: Json | null;
          created_at?: string | null;
          id?: string;
          is_published?: boolean | null;
          page_order?: number;
          page_type?: string;
          slug?: string | null;
          title_en?: string | null;
          title_uk?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "book_pages_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "book_pages_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books_with_mapping";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "book_pages_canto_id_fkey";
            columns: ["canto_id"];
            isOneToOne: false;
            referencedRelation: "cantos";
            referencedColumns: ["id"];
          },
        ];
      };
      books: {
        Row: {
          cover_image_path: string | null;
          cover_image_url: string | null;
          created_at: string;
          default_structure: string | null;
          deleted_at: string | null;
          description_en: string | null;
          description_uk: string | null;
          display_category: string | null;
          display_order: number | null;
          gitabase_slug: string | null;
          has_cantos: boolean | null;
          id: string;
          is_featured: boolean | null;
          is_published: boolean;
          purchase_url: string | null;
          slug: string;
          title_en: string;
          title_uk: string;
          vedabase_slug: string | null;
        };
        Insert: {
          cover_image_path?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          default_structure?: string | null;
          deleted_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          display_category?: string | null;
          display_order?: number | null;
          gitabase_slug?: string | null;
          has_cantos?: boolean | null;
          id?: string;
          is_featured?: boolean | null;
          is_published?: boolean;
          purchase_url?: string | null;
          slug: string;
          title_en: string;
          title_uk: string;
          vedabase_slug?: string | null;
        };
        Update: {
          cover_image_path?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          default_structure?: string | null;
          deleted_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          display_category?: string | null;
          display_order?: number | null;
          gitabase_slug?: string | null;
          has_cantos?: boolean | null;
          id?: string;
          is_featured?: boolean | null;
          is_published?: boolean;
          purchase_url?: string | null;
          slug?: string;
          title_en?: string;
          title_uk?: string;
          vedabase_slug?: string | null;
        };
        Relationships: [];
      };
      calendar_events: {
        Row: {
          appearance_day_id: string | null;
          created_at: string | null;
          custom_description_en: string | null;
          custom_description_uk: string | null;
          custom_name_en: string | null;
          custom_name_uk: string | null;
          ekadashi_end_time: string | null;
          ekadashi_id: string | null;
          ekadashi_start_time: string | null;
          event_date: string;
          festival_id: string | null;
          id: string;
          is_published: boolean | null;
          location_id: string | null;
          moon_phase: number | null;
          paksha: string | null;
          parana_end_time: string | null;
          parana_start_time: string | null;
          sunrise_time: string | null;
          sunset_time: string | null;
          timezone: string | null;
          tithi_number: number | null;
          updated_at: string | null;
          vaishnava_month_id: number | null;
          year: number | null;
        };
        Insert: {
          appearance_day_id?: string | null;
          created_at?: string | null;
          custom_description_en?: string | null;
          custom_description_uk?: string | null;
          custom_name_en?: string | null;
          custom_name_uk?: string | null;
          ekadashi_end_time?: string | null;
          ekadashi_id?: string | null;
          ekadashi_start_time?: string | null;
          event_date: string;
          festival_id?: string | null;
          id?: string;
          is_published?: boolean | null;
          location_id?: string | null;
          moon_phase?: number | null;
          paksha?: string | null;
          parana_end_time?: string | null;
          parana_start_time?: string | null;
          sunrise_time?: string | null;
          sunset_time?: string | null;
          timezone?: string | null;
          tithi_number?: number | null;
          updated_at?: string | null;
          vaishnava_month_id?: number | null;
          year?: number | null;
        };
        Update: {
          appearance_day_id?: string | null;
          created_at?: string | null;
          custom_description_en?: string | null;
          custom_description_uk?: string | null;
          custom_name_en?: string | null;
          custom_name_uk?: string | null;
          ekadashi_end_time?: string | null;
          ekadashi_id?: string | null;
          ekadashi_start_time?: string | null;
          event_date?: string;
          festival_id?: string | null;
          id?: string;
          is_published?: boolean | null;
          location_id?: string | null;
          moon_phase?: number | null;
          paksha?: string | null;
          parana_end_time?: string | null;
          parana_start_time?: string | null;
          sunrise_time?: string | null;
          sunset_time?: string | null;
          timezone?: string | null;
          tithi_number?: number | null;
          updated_at?: string | null;
          vaishnava_month_id?: number | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "calendar_events_appearance_day_id_fkey";
            columns: ["appearance_day_id"];
            isOneToOne: false;
            referencedRelation: "appearance_days";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "calendar_events_ekadashi_id_fkey";
            columns: ["ekadashi_id"];
            isOneToOne: false;
            referencedRelation: "ekadashi_info";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "calendar_events_festival_id_fkey";
            columns: ["festival_id"];
            isOneToOne: false;
            referencedRelation: "vaishnava_festivals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "calendar_events_location_id_fkey";
            columns: ["location_id"];
            isOneToOne: false;
            referencedRelation: "calendar_locations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "calendar_events_vaishnava_month_id_fkey";
            columns: ["vaishnava_month_id"];
            isOneToOne: false;
            referencedRelation: "vaishnava_months";
            referencedColumns: ["id"];
          },
        ];
      };
      calendar_locations: {
        Row: {
          city_en: string | null;
          city_uk: string | null;
          country_code: string | null;
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          is_preset: boolean | null;
          latitude: number;
          longitude: number;
          name_en: string;
          name_uk: string;
          timezone: string;
          updated_at: string | null;
          utc_offset: number | null;
        };
        Insert: {
          city_en?: string | null;
          city_uk?: string | null;
          country_code?: string | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_preset?: boolean | null;
          latitude: number;
          longitude: number;
          name_en: string;
          name_uk: string;
          timezone: string;
          updated_at?: string | null;
          utc_offset?: number | null;
        };
        Update: {
          city_en?: string | null;
          city_uk?: string | null;
          country_code?: string | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_preset?: boolean | null;
          latitude?: number;
          longitude?: number;
          name_en?: string;
          name_uk?: string;
          timezone?: string;
          updated_at?: string | null;
          utc_offset?: number | null;
        };
        Relationships: [];
      };
      cantos: {
        Row: {
          book_id: string;
          canto_number: number;
          cover_image_url: string | null;
          created_at: string | null;
          description_en: string | null;
          description_uk: string | null;
          id: string;
          is_published: boolean | null;
          title_en: string;
          title_uk: string;
        };
        Insert: {
          book_id: string;
          canto_number: number;
          cover_image_url?: string | null;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          id?: string;
          is_published?: boolean | null;
          title_en: string;
          title_uk: string;
        };
        Update: {
          book_id?: string;
          canto_number?: number;
          cover_image_url?: string | null;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          id?: string;
          is_published?: boolean | null;
          title_en?: string;
          title_uk?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cantos_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cantos_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books_with_mapping";
            referencedColumns: ["id"];
          },
        ];
      };
      chapters: {
        Row: {
          book_id: string | null;
          canto_id: string | null;
          chapter_number: number;
          chapter_type: Database["public"]["Enums"]["chapter_type"] | null;
          content_en: string | null;
          content_format: string | null;
          content_structure: string | null;
          content_uk: string | null;
          created_at: string;
          id: string;
          is_published: boolean | null;
          summary_en: string | null;
          summary_uk: string | null;
          title_en: string;
          title_uk: string;
        };
        Insert: {
          book_id?: string | null;
          canto_id?: string | null;
          chapter_number: number;
          chapter_type?: Database["public"]["Enums"]["chapter_type"] | null;
          content_en?: string | null;
          content_format?: string | null;
          content_structure?: string | null;
          content_uk?: string | null;
          created_at?: string;
          id?: string;
          is_published?: boolean | null;
          summary_en?: string | null;
          summary_uk?: string | null;
          title_en: string;
          title_uk: string;
        };
        Update: {
          book_id?: string | null;
          canto_id?: string | null;
          chapter_number?: number;
          chapter_type?: Database["public"]["Enums"]["chapter_type"] | null;
          content_en?: string | null;
          content_format?: string | null;
          content_structure?: string | null;
          content_uk?: string | null;
          created_at?: string;
          id?: string;
          is_published?: boolean | null;
          summary_en?: string | null;
          summary_uk?: string | null;
          title_en?: string;
          title_uk?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chapters_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books_with_mapping";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chapters_canto_id_fkey";
            columns: ["canto_id"];
            isOneToOne: false;
            referencedRelation: "cantos";
            referencedColumns: ["id"];
          },
        ];
      };
      chapters_archive: {
        Row: {
          book_id: string | null;
          canto_id: string | null;
          chapter_number: number;
          chapter_type: Database["public"]["Enums"]["chapter_type"] | null;
          content_en: string | null;
          content_format: string | null;
          content_uk: string | null;
          created_at: string;
          id: string;
          title_en: string;
          title_uk: string;
        };
        Insert: {
          book_id?: string | null;
          canto_id?: string | null;
          chapter_number: number;
          chapter_type?: Database["public"]["Enums"]["chapter_type"] | null;
          content_en?: string | null;
          content_format?: string | null;
          content_uk?: string | null;
          created_at?: string;
          id?: string;
          title_en: string;
          title_uk: string;
        };
        Update: {
          book_id?: string | null;
          canto_id?: string | null;
          chapter_number?: number;
          chapter_type?: Database["public"]["Enums"]["chapter_type"] | null;
          content_en?: string | null;
          content_format?: string | null;
          content_uk?: string | null;
          created_at?: string;
          id?: string;
          title_en?: string;
          title_uk?: string;
        };
        Relationships: [];
      };
      chapters_backup_20251014: {
        Row: {
          book_id: string | null;
          canto_id: string | null;
          chapter_number: number | null;
          chapter_type: Database["public"]["Enums"]["chapter_type"] | null;
          content_en: string | null;
          content_format: string | null;
          content_uk: string | null;
          created_at: string | null;
          id: string | null;
          title_en: string | null;
          title_uk: string | null;
        };
        Insert: {
          book_id?: string | null;
          canto_id?: string | null;
          chapter_number?: number | null;
          chapter_type?: Database["public"]["Enums"]["chapter_type"] | null;
          content_en?: string | null;
          content_format?: string | null;
          content_uk?: string | null;
          created_at?: string | null;
          id?: string | null;
          title_en?: string | null;
          title_uk?: string | null;
        };
        Update: {
          book_id?: string | null;
          canto_id?: string | null;
          chapter_number?: number | null;
          chapter_type?: Database["public"]["Enums"]["chapter_type"] | null;
          content_en?: string | null;
          content_format?: string | null;
          content_uk?: string | null;
          created_at?: string | null;
          id?: string | null;
          title_en?: string | null;
          title_uk?: string | null;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          citations: Json | null;
          content: string;
          created_at: string | null;
          id: string;
          response_level: string | null;
          role: string;
          session_id: string;
          tattva_ids: string[] | null;
        };
        Insert: {
          citations?: Json | null;
          content: string;
          created_at?: string | null;
          id?: string;
          response_level?: string | null;
          role: string;
          session_id: string;
          tattva_ids?: string[] | null;
        };
        Update: {
          citations?: Json | null;
          content?: string;
          created_at?: string | null;
          id?: string;
          response_level?: string | null;
          role?: string;
          session_id?: string;
          tattva_ids?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "chat_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_sessions: {
        Row: {
          created_at: string | null;
          id: string;
          language: string | null;
          title: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          language?: string | null;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          language?: string | null;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      content_tattvas: {
        Row: {
          created_at: string;
          id: string;
          relevance_score: number;
          tagged_by: string;
          tattva_id: string;
          updated_at: string;
          verse_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          relevance_score?: number;
          tagged_by?: string;
          tattva_id: string;
          updated_at?: string;
          verse_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          relevance_score?: number;
          tagged_by?: string;
          tattva_id?: string;
          updated_at?: string;
          verse_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_tattvas_tattva_id_fkey";
            columns: ["tattva_id"];
            isOneToOne: false;
            referencedRelation: "tattva_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_tattvas_tattva_id_fkey";
            columns: ["tattva_id"];
            isOneToOne: false;
            referencedRelation: "tattvas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_tattvas_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_tattvas_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_metadata";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_tattvas_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_structure";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_tattvas_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_synonyms";
            referencedColumns: ["id"];
          },
        ];
      };
      cross_references: {
        Row: {
          confidence: number | null;
          created_at: string | null;
          id: string;
          reference_type: string | null;
          source_verse_id: string;
          target_verse_id: string;
        };
        Insert: {
          confidence?: number | null;
          created_at?: string | null;
          id?: string;
          reference_type?: string | null;
          source_verse_id: string;
          target_verse_id: string;
        };
        Update: {
          confidence?: number | null;
          created_at?: string | null;
          id?: string;
          reference_type?: string | null;
          source_verse_id?: string;
          target_verse_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cross_references_source_verse_id_fkey";
            columns: ["source_verse_id"];
            isOneToOne: false;
            referencedRelation: "verses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cross_references_source_verse_id_fkey";
            columns: ["source_verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_metadata";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cross_references_source_verse_id_fkey";
            columns: ["source_verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_structure";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cross_references_source_verse_id_fkey";
            columns: ["source_verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_synonyms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cross_references_target_verse_id_fkey";
            columns: ["target_verse_id"];
            isOneToOne: false;
            referencedRelation: "verses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cross_references_target_verse_id_fkey";
            columns: ["target_verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_metadata";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cross_references_target_verse_id_fkey";
            columns: ["target_verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_structure";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cross_references_target_verse_id_fkey";
            columns: ["target_verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_synonyms";
            referencedColumns: ["id"];
          },
        ];
      };
      daily_quotes: {
        Row: {
          author_en: string | null;
          author_uk: string | null;
          created_at: string | null;
          created_by: string | null;
          display_count: number | null;
          id: string;
          is_active: boolean | null;
          last_displayed_at: string | null;
          priority: number | null;
          quote_en: string | null;
          quote_type: Database["public"]["Enums"]["daily_quote_type"];
          quote_uk: string | null;
          source_en: string | null;
          source_uk: string | null;
          updated_at: string | null;
          verse_id: string | null;
        };
        Insert: {
          author_en?: string | null;
          author_uk?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          display_count?: number | null;
          id?: string;
          is_active?: boolean | null;
          last_displayed_at?: string | null;
          priority?: number | null;
          quote_en?: string | null;
          quote_type: Database["public"]["Enums"]["daily_quote_type"];
          quote_uk?: string | null;
          source_en?: string | null;
          source_uk?: string | null;
          updated_at?: string | null;
          verse_id?: string | null;
        };
        Update: {
          author_en?: string | null;
          author_uk?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          display_count?: number | null;
          id?: string;
          is_active?: boolean | null;
          last_displayed_at?: string | null;
          priority?: number | null;
          quote_en?: string | null;
          quote_type?: Database["public"]["Enums"]["daily_quote_type"];
          quote_uk?: string | null;
          source_en?: string | null;
          source_uk?: string | null;
          updated_at?: string | null;
          verse_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "daily_quotes_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "daily_quotes_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_metadata";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "daily_quotes_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_structure";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "daily_quotes_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_synonyms";
            referencedColumns: ["id"];
          },
        ];
      };
      ekadashi_info: {
        Row: {
          benefits_en: string | null;
          benefits_uk: string | null;
          breaking_fast_time: string | null;
          created_at: string | null;
          fasting_rules_en: string | null;
          fasting_rules_uk: string | null;
          glory_source: string | null;
          glory_text_en: string | null;
          glory_text_uk: string | null;
          glory_title_en: string | null;
          glory_title_uk: string | null;
          id: string;
          image_url: string | null;
          is_major: boolean | null;
          mantras: string[] | null;
          name_en: string;
          name_sanskrit: string;
          name_uk: string;
          padma_purana_book_slug: string | null;
          padma_purana_chapter: number | null;
          paksha: string;
          prabhupada_instructions_en: string | null;
          prabhupada_instructions_uk: string | null;
          prabhupada_source: string | null;
          presiding_deity_en: string | null;
          presiding_deity_uk: string | null;
          recommended_activities_en: string | null;
          recommended_activities_uk: string | null;
          slug: string;
          sort_order: number | null;
          story_en: string | null;
          story_uk: string | null;
          updated_at: string | null;
          vaishnava_month_id: number | null;
        };
        Insert: {
          benefits_en?: string | null;
          benefits_uk?: string | null;
          breaking_fast_time?: string | null;
          created_at?: string | null;
          fasting_rules_en?: string | null;
          fasting_rules_uk?: string | null;
          glory_source?: string | null;
          glory_text_en?: string | null;
          glory_text_uk?: string | null;
          glory_title_en?: string | null;
          glory_title_uk?: string | null;
          id?: string;
          image_url?: string | null;
          is_major?: boolean | null;
          mantras?: string[] | null;
          name_en: string;
          name_sanskrit: string;
          name_uk: string;
          padma_purana_book_slug?: string | null;
          padma_purana_chapter?: number | null;
          paksha: string;
          prabhupada_instructions_en?: string | null;
          prabhupada_instructions_uk?: string | null;
          prabhupada_source?: string | null;
          presiding_deity_en?: string | null;
          presiding_deity_uk?: string | null;
          recommended_activities_en?: string | null;
          recommended_activities_uk?: string | null;
          slug: string;
          sort_order?: number | null;
          story_en?: string | null;
          story_uk?: string | null;
          updated_at?: string | null;
          vaishnava_month_id?: number | null;
        };
        Update: {
          benefits_en?: string | null;
          benefits_uk?: string | null;
          breaking_fast_time?: string | null;
          created_at?: string | null;
          fasting_rules_en?: string | null;
          fasting_rules_uk?: string | null;
          glory_source?: string | null;
          glory_text_en?: string | null;
          glory_text_uk?: string | null;
          glory_title_en?: string | null;
          glory_title_uk?: string | null;
          id?: string;
          image_url?: string | null;
          is_major?: boolean | null;
          mantras?: string[] | null;
          name_en?: string;
          name_sanskrit?: string;
          name_uk?: string;
          padma_purana_book_slug?: string | null;
          padma_purana_chapter?: number | null;
          paksha?: string;
          prabhupada_instructions_en?: string | null;
          prabhupada_instructions_uk?: string | null;
          prabhupada_source?: string | null;
          presiding_deity_en?: string | null;
          presiding_deity_uk?: string | null;
          recommended_activities_en?: string | null;
          recommended_activities_uk?: string | null;
          slug?: string;
          sort_order?: number | null;
          story_en?: string | null;
          story_uk?: string | null;
          updated_at?: string | null;
          vaishnava_month_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "ekadashi_info_vaishnava_month_id_fkey";
            columns: ["vaishnava_month_id"];
            isOneToOne: false;
            referencedRelation: "vaishnava_months";
            referencedColumns: ["id"];
          },
        ];
      };
      festival_categories: {
        Row: {
          color: string;
          created_at: string | null;
          description_en: string | null;
          description_uk: string | null;
          icon: string | null;
          id: number;
          name_en: string;
          name_uk: string;
          slug: string;
          sort_order: number | null;
        };
        Insert: {
          color?: string;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          icon?: string | null;
          id?: number;
          name_en: string;
          name_uk: string;
          slug: string;
          sort_order?: number | null;
        };
        Update: {
          color?: string;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          icon?: string | null;
          id?: number;
          name_en?: string;
          name_uk?: string;
          slug?: string;
          sort_order?: number | null;
        };
        Relationships: [];
      };
      gv_authors: {
        Row: {
          biography_en: string | null;
          biography_uk: string | null;
          birth_place: string | null;
          birth_year: number | null;
          created_at: string | null;
          death_year: number | null;
          display_order: number | null;
          era: string | null;
          fts: unknown;
          guru_id: string | null;
          id: string;
          image_url: string | null;
          is_published: boolean | null;
          name_en: string;
          name_sanskrit: string | null;
          name_transliteration: string;
          name_uk: string;
          samadhi_place: string | null;
          significance_en: string | null;
          significance_uk: string | null;
          slug: string;
          title_en: string | null;
          title_sanskrit: string | null;
          title_transliteration: string | null;
          title_uk: string | null;
          updated_at: string | null;
        };
        Insert: {
          biography_en?: string | null;
          biography_uk?: string | null;
          birth_place?: string | null;
          birth_year?: number | null;
          created_at?: string | null;
          death_year?: number | null;
          display_order?: number | null;
          era?: string | null;
          fts?: unknown;
          guru_id?: string | null;
          id?: string;
          image_url?: string | null;
          is_published?: boolean | null;
          name_en: string;
          name_sanskrit?: string | null;
          name_transliteration: string;
          name_uk: string;
          samadhi_place?: string | null;
          significance_en?: string | null;
          significance_uk?: string | null;
          slug: string;
          title_en?: string | null;
          title_sanskrit?: string | null;
          title_transliteration?: string | null;
          title_uk?: string | null;
          updated_at?: string | null;
        };
        Update: {
          biography_en?: string | null;
          biography_uk?: string | null;
          birth_place?: string | null;
          birth_year?: number | null;
          created_at?: string | null;
          death_year?: number | null;
          display_order?: number | null;
          era?: string | null;
          fts?: unknown;
          guru_id?: string | null;
          id?: string;
          image_url?: string | null;
          is_published?: boolean | null;
          name_en?: string;
          name_sanskrit?: string | null;
          name_transliteration?: string;
          name_uk?: string;
          samadhi_place?: string | null;
          significance_en?: string | null;
          significance_uk?: string | null;
          slug?: string;
          title_en?: string | null;
          title_sanskrit?: string | null;
          title_transliteration?: string | null;
          title_uk?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "gv_authors_guru_id_fkey";
            columns: ["guru_id"];
            isOneToOne: false;
            referencedRelation: "gv_authors";
            referencedColumns: ["id"];
          },
        ];
      };
      gv_book_catalogues: {
        Row: {
          color: string | null;
          created_at: string | null;
          description_en: string | null;
          description_uk: string | null;
          display_order: number | null;
          icon: string | null;
          id: string;
          is_published: boolean | null;
          name_en: string;
          name_uk: string;
          slug: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          display_order?: number | null;
          icon?: string | null;
          id?: string;
          is_published?: boolean | null;
          name_en: string;
          name_uk: string;
          slug: string;
        };
        Update: {
          color?: string | null;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          display_order?: number | null;
          icon?: string | null;
          id?: string;
          is_published?: boolean | null;
          name_en?: string;
          name_uk?: string;
          slug?: string;
        };
        Relationships: [];
      };
      gv_book_references: {
        Row: {
          alt_titles: string[] | null;
          author_id: string | null;
          category: string;
          chapter_count: number | null;
          commentary_type: string | null;
          composition_century: string | null;
          composition_year: number | null;
          cover_image_url: string | null;
          created_at: string | null;
          description_en: string | null;
          description_uk: string | null;
          display_order: number | null;
          external_url: string | null;
          fts: unknown;
          id: string;
          importance_level: number | null;
          internal_book_slug: string | null;
          is_available_in_app: boolean | null;
          is_published: boolean | null;
          original_language: string | null;
          original_text_id: string | null;
          significance_en: string | null;
          significance_uk: string | null;
          slug: string;
          subcategory: string | null;
          title_en: string;
          title_sanskrit: string | null;
          title_transliteration: string;
          title_uk: string;
          topics: string[] | null;
          updated_at: string | null;
          verse_count: number | null;
          volume_count: number | null;
        };
        Insert: {
          alt_titles?: string[] | null;
          author_id?: string | null;
          category: string;
          chapter_count?: number | null;
          commentary_type?: string | null;
          composition_century?: string | null;
          composition_year?: number | null;
          cover_image_url?: string | null;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          display_order?: number | null;
          external_url?: string | null;
          fts?: unknown;
          id?: string;
          importance_level?: number | null;
          internal_book_slug?: string | null;
          is_available_in_app?: boolean | null;
          is_published?: boolean | null;
          original_language?: string | null;
          original_text_id?: string | null;
          significance_en?: string | null;
          significance_uk?: string | null;
          slug: string;
          subcategory?: string | null;
          title_en: string;
          title_sanskrit?: string | null;
          title_transliteration: string;
          title_uk: string;
          topics?: string[] | null;
          updated_at?: string | null;
          verse_count?: number | null;
          volume_count?: number | null;
        };
        Update: {
          alt_titles?: string[] | null;
          author_id?: string | null;
          category?: string;
          chapter_count?: number | null;
          commentary_type?: string | null;
          composition_century?: string | null;
          composition_year?: number | null;
          cover_image_url?: string | null;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          display_order?: number | null;
          external_url?: string | null;
          fts?: unknown;
          id?: string;
          importance_level?: number | null;
          internal_book_slug?: string | null;
          is_available_in_app?: boolean | null;
          is_published?: boolean | null;
          original_language?: string | null;
          original_text_id?: string | null;
          significance_en?: string | null;
          significance_uk?: string | null;
          slug?: string;
          subcategory?: string | null;
          title_en?: string;
          title_sanskrit?: string | null;
          title_transliteration?: string;
          title_uk?: string;
          topics?: string[] | null;
          updated_at?: string | null;
          verse_count?: number | null;
          volume_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "gv_book_references_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "gv_authors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gv_book_references_original_text_id_fkey";
            columns: ["original_text_id"];
            isOneToOne: false;
            referencedRelation: "gv_book_references";
            referencedColumns: ["id"];
          },
        ];
      };
      gv_catalogue_books: {
        Row: {
          book_id: string;
          catalogue_id: string;
          display_order: number | null;
        };
        Insert: {
          book_id: string;
          catalogue_id: string;
          display_order?: number | null;
        };
        Update: {
          book_id?: string;
          catalogue_id?: string;
          display_order?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "gv_catalogue_books_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "gv_book_references";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gv_catalogue_books_catalogue_id_fkey";
            columns: ["catalogue_id"];
            isOneToOne: false;
            referencedRelation: "gv_book_catalogues";
            referencedColumns: ["id"];
          },
        ];
      };
      highlights: {
        Row: {
          book_id: string;
          canto_id: string | null;
          chapter_id: string;
          context_after: string | null;
          context_before: string | null;
          created_at: string;
          highlight_color: string | null;
          id: string;
          notes: string | null;
          selected_text: string;
          updated_at: string;
          user_id: string;
          verse_id: string | null;
          verse_number: string | null;
        };
        Insert: {
          book_id: string;
          canto_id?: string | null;
          chapter_id: string;
          context_after?: string | null;
          context_before?: string | null;
          created_at?: string;
          highlight_color?: string | null;
          id?: string;
          notes?: string | null;
          selected_text: string;
          updated_at?: string;
          user_id: string;
          verse_id?: string | null;
          verse_number?: string | null;
        };
        Update: {
          book_id?: string;
          canto_id?: string | null;
          chapter_id?: string;
          context_after?: string | null;
          context_before?: string | null;
          created_at?: string;
          highlight_color?: string | null;
          id?: string;
          notes?: string | null;
          selected_text?: string;
          updated_at?: string;
          user_id?: string;
          verse_id?: string | null;
          verse_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "highlights_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "highlights_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books_with_mapping";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "highlights_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "highlights_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "readable_chapters";
            referencedColumns: ["chapter_id"];
          },
        ];
      };
      intro_chapters: {
        Row: {
          book_id: string;
          content_en: string | null;
          content_uk: string | null;
          created_at: string;
          display_order: number;
          id: string;
          slug: string;
          title_en: string;
          title_uk: string;
          updated_at: string;
        };
        Insert: {
          book_id: string;
          content_en?: string | null;
          content_uk?: string | null;
          created_at?: string;
          display_order?: number;
          id?: string;
          slug: string;
          title_en: string;
          title_uk: string;
          updated_at?: string;
        };
        Update: {
          book_id?: string;
          content_en?: string | null;
          content_uk?: string | null;
          created_at?: string;
          display_order?: number;
          id?: string;
          slug?: string;
          title_en?: string;
          title_uk?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "intro_chapters_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "intro_chapters_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books_with_mapping";
            referencedColumns: ["id"];
          },
        ];
      };
      lecture_paragraphs: {
        Row: {
          audio_timecode: number | null;
          content_en: string;
          content_uk: string | null;
          created_at: string;
          id: string;
          lecture_id: string;
          paragraph_number: number;
        };
        Insert: {
          audio_timecode?: number | null;
          content_en: string;
          content_uk?: string | null;
          created_at?: string;
          id?: string;
          lecture_id: string;
          paragraph_number: number;
        };
        Update: {
          audio_timecode?: number | null;
          content_en?: string;
          content_uk?: string | null;
          created_at?: string;
          id?: string;
          lecture_id?: string;
          paragraph_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "lecture_paragraphs_lecture_id_fkey";
            columns: ["lecture_id"];
            isOneToOne: false;
            referencedRelation: "lectures";
            referencedColumns: ["id"];
          },
        ];
      };
      lectures: {
        Row: {
          audio_url: string | null;
          book_slug: string | null;
          canto_number: number | null;
          chapter_number: number | null;
          created_at: string;
          description_en: string | null;
          description_uk: string | null;
          id: string;
          lecture_date: string;
          lecture_type: Database["public"]["Enums"]["lecture_type"];
          location_en: string;
          location_uk: string | null;
          slug: string;
          title_en: string;
          title_uk: string | null;
          updated_at: string;
          verse_number: string | null;
        };
        Insert: {
          audio_url?: string | null;
          book_slug?: string | null;
          canto_number?: number | null;
          chapter_number?: number | null;
          created_at?: string;
          description_en?: string | null;
          description_uk?: string | null;
          id?: string;
          lecture_date: string;
          lecture_type?: Database["public"]["Enums"]["lecture_type"];
          location_en: string;
          location_uk?: string | null;
          slug: string;
          title_en: string;
          title_uk?: string | null;
          updated_at?: string;
          verse_number?: string | null;
        };
        Update: {
          audio_url?: string | null;
          book_slug?: string | null;
          canto_number?: number | null;
          chapter_number?: number | null;
          created_at?: string;
          description_en?: string | null;
          description_uk?: string | null;
          id?: string;
          lecture_date?: string;
          lecture_type?: Database["public"]["Enums"]["lecture_type"];
          location_en?: string;
          location_uk?: string | null;
          slug?: string;
          title_en?: string;
          title_uk?: string | null;
          updated_at?: string;
          verse_number?: string | null;
        };
        Relationships: [];
      };
      letters: {
        Row: {
          address_block: string | null;
          content_en: string;
          content_uk: string | null;
          created_at: string;
          id: string;
          letter_date: string;
          location_en: string;
          location_uk: string | null;
          recipient_en: string;
          recipient_uk: string | null;
          reference: string | null;
          slug: string;
          updated_at: string;
        };
        Insert: {
          address_block?: string | null;
          content_en: string;
          content_uk?: string | null;
          created_at?: string;
          id?: string;
          letter_date: string;
          location_en: string;
          location_uk?: string | null;
          recipient_en: string;
          recipient_uk?: string | null;
          reference?: string | null;
          slug: string;
          updated_at?: string;
        };
        Update: {
          address_block?: string | null;
          content_en?: string;
          content_uk?: string | null;
          created_at?: string;
          id?: string;
          letter_date?: string;
          location_en?: string;
          location_uk?: string | null;
          recipient_en?: string;
          recipient_uk?: string | null;
          reference?: string | null;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      pages: {
        Row: {
          banner_image_url: string | null;
          content_en: string | null;
          content_uk: string | null;
          created_at: string;
          hero_image_url: string | null;
          id: string;
          is_published: boolean | null;
          meta_description_en: string | null;
          meta_description_uk: string | null;
          og_image: string | null;
          sections: Json | null;
          seo_keywords: string | null;
          slug: string;
          title_en: string;
          title_uk: string;
          updated_at: string;
        };
        Insert: {
          banner_image_url?: string | null;
          content_en?: string | null;
          content_uk?: string | null;
          created_at?: string;
          hero_image_url?: string | null;
          id?: string;
          is_published?: boolean | null;
          meta_description_en?: string | null;
          meta_description_uk?: string | null;
          og_image?: string | null;
          sections?: Json | null;
          seo_keywords?: string | null;
          slug: string;
          title_en: string;
          title_uk: string;
          updated_at?: string;
        };
        Update: {
          banner_image_url?: string | null;
          content_en?: string | null;
          content_uk?: string | null;
          created_at?: string;
          hero_image_url?: string | null;
          id?: string;
          is_published?: boolean | null;
          meta_description_en?: string | null;
          meta_description_uk?: string | null;
          og_image?: string | null;
          sections?: Json | null;
          seo_keywords?: string | null;
          slug?: string;
          title_en?: string;
          title_uk?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      prabhupada_events: {
        Row: {
          content_en: string | null;
          content_preview_en: string | null;
          content_preview_uk: string | null;
          content_uk: string | null;
          created_at: string | null;
          date_display: string;
          day: number | null;
          event_date: string;
          id: string;
          is_published: boolean | null;
          location_en: string | null;
          location_uk: string | null;
          month: number | null;
          source_book_slug: string | null;
          source_chapter: number | null;
          source_type: string;
          source_url: string | null;
          source_verse: string | null;
          source_volume: number | null;
          title_en: string | null;
          title_uk: string | null;
          updated_at: string | null;
          year: number | null;
        };
        Insert: {
          content_en?: string | null;
          content_preview_en?: string | null;
          content_preview_uk?: string | null;
          content_uk?: string | null;
          created_at?: string | null;
          date_display: string;
          day?: number | null;
          event_date: string;
          id?: string;
          is_published?: boolean | null;
          location_en?: string | null;
          location_uk?: string | null;
          month?: number | null;
          source_book_slug?: string | null;
          source_chapter?: number | null;
          source_type: string;
          source_url?: string | null;
          source_verse?: string | null;
          source_volume?: number | null;
          title_en?: string | null;
          title_uk?: string | null;
          updated_at?: string | null;
          year?: number | null;
        };
        Update: {
          content_en?: string | null;
          content_preview_en?: string | null;
          content_preview_uk?: string | null;
          content_uk?: string | null;
          created_at?: string | null;
          date_display?: string;
          day?: number | null;
          event_date?: string;
          id?: string;
          is_published?: boolean | null;
          location_en?: string | null;
          location_uk?: string | null;
          month?: number | null;
          source_book_slug?: string | null;
          source_chapter?: number | null;
          source_type?: string;
          source_url?: string | null;
          source_verse?: string | null;
          source_volume?: number | null;
          title_en?: string | null;
          title_uk?: string | null;
          updated_at?: string | null;
          year?: number | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          display_name: string | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      quote_categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          description_uk: string | null;
          display_order: number | null;
          id: string;
          is_featured: boolean | null;
          parent_id: string | null;
          quotes_count: number | null;
          slug: string;
          title: string;
          title_uk: string | null;
          updated_at: string | null;
          vaniquotes_url: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          description_uk?: string | null;
          display_order?: number | null;
          id?: string;
          is_featured?: boolean | null;
          parent_id?: string | null;
          quotes_count?: number | null;
          slug: string;
          title: string;
          title_uk?: string | null;
          updated_at?: string | null;
          vaniquotes_url?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          description_uk?: string | null;
          display_order?: number | null;
          id?: string;
          is_featured?: boolean | null;
          parent_id?: string | null;
          quotes_count?: number | null;
          slug?: string;
          title?: string;
          title_uk?: string | null;
          updated_at?: string | null;
          vaniquotes_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "quote_categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "quote_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      quote_page_categories: {
        Row: {
          category_id: string;
          quote_page_id: string;
        };
        Insert: {
          category_id: string;
          quote_page_id: string;
        };
        Update: {
          category_id?: string;
          quote_page_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quote_page_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "quote_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quote_page_categories_quote_page_id_fkey";
            columns: ["quote_page_id"];
            isOneToOne: false;
            referencedRelation: "quote_pages";
            referencedColumns: ["id"];
          },
        ];
      };
      quote_pages: {
        Row: {
          created_at: string | null;
          id: string;
          slug: string;
          title: string;
          title_uk: string | null;
          updated_at: string | null;
          vaniquotes_url: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          slug: string;
          title: string;
          title_uk?: string | null;
          updated_at?: string | null;
          vaniquotes_url?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          slug?: string;
          title?: string;
          title_uk?: string | null;
          updated_at?: string | null;
          vaniquotes_url?: string | null;
        };
        Relationships: [];
      };
      quotes: {
        Row: {
          book_slug: string | null;
          canto_number: number | null;
          chapter_number: number | null;
          created_at: string | null;
          date: string | null;
          id: string;
          lecture_id: string | null;
          location: string | null;
          quote_page_id: string | null;
          search_vector: unknown;
          source_reference: string | null;
          source_type: string | null;
          text_en: string;
          text_html: string | null;
          text_uk: string | null;
          updated_at: string | null;
          verse_id: string | null;
          verse_number: string | null;
        };
        Insert: {
          book_slug?: string | null;
          canto_number?: number | null;
          chapter_number?: number | null;
          created_at?: string | null;
          date?: string | null;
          id?: string;
          lecture_id?: string | null;
          location?: string | null;
          quote_page_id?: string | null;
          search_vector?: unknown;
          source_reference?: string | null;
          source_type?: string | null;
          text_en: string;
          text_html?: string | null;
          text_uk?: string | null;
          updated_at?: string | null;
          verse_id?: string | null;
          verse_number?: string | null;
        };
        Update: {
          book_slug?: string | null;
          canto_number?: number | null;
          chapter_number?: number | null;
          created_at?: string | null;
          date?: string | null;
          id?: string;
          lecture_id?: string | null;
          location?: string | null;
          quote_page_id?: string | null;
          search_vector?: unknown;
          source_reference?: string | null;
          source_type?: string | null;
          text_en?: string;
          text_html?: string | null;
          text_uk?: string | null;
          updated_at?: string | null;
          verse_id?: string | null;
          verse_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "quotes_lecture_id_fkey";
            columns: ["lecture_id"];
            isOneToOne: false;
            referencedRelation: "lectures";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quotes_quote_page_id_fkey";
            columns: ["quote_page_id"];
            isOneToOne: false;
            referencedRelation: "quote_pages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quotes_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quotes_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_metadata";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quotes_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_structure";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quotes_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_synonyms";
            referencedColumns: ["id"];
          },
        ];
      };
      sanskrit_lexicon: {
        Row: {
          created_at: string | null;
          grammar: string | null;
          id: number;
          meanings: string | null;
          meanings_tsv: unknown;
          preverbs: string | null;
          word: string;
          word_devanagari: string | null;
          word_normalized: string | null;
        };
        Insert: {
          created_at?: string | null;
          grammar?: string | null;
          id: number;
          meanings?: string | null;
          meanings_tsv?: unknown;
          preverbs?: string | null;
          word: string;
          word_devanagari?: string | null;
          word_normalized?: string | null;
        };
        Update: {
          created_at?: string | null;
          grammar?: string | null;
          id?: number;
          meanings?: string | null;
          meanings_tsv?: unknown;
          preverbs?: string | null;
          word?: string;
          word_devanagari?: string | null;
          word_normalized?: string | null;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          key: string;
          updated_at: string | null;
          value: Json;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          key: string;
          updated_at?: string | null;
          value: Json;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          key?: string;
          updated_at?: string | null;
          value?: Json;
        };
        Relationships: [];
      };
      static_page_metadata: {
        Row: {
          created_at: string;
          hero_image_url: string | null;
          id: string;
          meta_description_en: string | null;
          meta_description_uk: string | null;
          og_image: string | null;
          seo_keywords: string | null;
          slug: string;
          title_en: string;
          title_uk: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          hero_image_url?: string | null;
          id?: string;
          meta_description_en?: string | null;
          meta_description_uk?: string | null;
          og_image?: string | null;
          seo_keywords?: string | null;
          slug: string;
          title_en: string;
          title_uk: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          hero_image_url?: string | null;
          id?: string;
          meta_description_en?: string | null;
          meta_description_uk?: string | null;
          og_image?: string | null;
          seo_keywords?: string | null;
          slug?: string;
          title_en?: string;
          title_uk?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      stripe_customers: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: string;
          stripe_customer_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          stripe_customer_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          stripe_customer_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      stripe_payments: {
        Row: {
          amount: number;
          created_at: string | null;
          currency: string;
          description: string | null;
          id: string;
          metadata: Json | null;
          status: string;
          stripe_checkout_session_id: string | null;
          stripe_customer_id: string | null;
          stripe_payment_intent_id: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          currency?: string;
          description?: string | null;
          id?: string;
          metadata?: Json | null;
          status?: string;
          stripe_checkout_session_id?: string | null;
          stripe_customer_id?: string | null;
          stripe_payment_intent_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          currency?: string;
          description?: string | null;
          id?: string;
          metadata?: Json | null;
          status?: string;
          stripe_checkout_session_id?: string | null;
          stripe_customer_id?: string | null;
          stripe_payment_intent_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      stripe_products: {
        Row: {
          amount: number;
          created_at: string | null;
          currency: string;
          description: string | null;
          id: string;
          interval: string | null;
          interval_count: number | null;
          is_active: boolean | null;
          metadata: Json | null;
          name: string;
          stripe_price_id: string;
          stripe_product_id: string;
          updated_at: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          currency?: string;
          description?: string | null;
          id?: string;
          interval?: string | null;
          interval_count?: number | null;
          is_active?: boolean | null;
          metadata?: Json | null;
          name: string;
          stripe_price_id: string;
          stripe_product_id: string;
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          currency?: string;
          description?: string | null;
          id?: string;
          interval?: string | null;
          interval_count?: number | null;
          is_active?: boolean | null;
          metadata?: Json | null;
          name?: string;
          stripe_price_id?: string;
          stripe_product_id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          created_at: string | null;
          current_period_end: string | null;
          current_period_start: string | null;
          id: string;
          is_effectively_active: boolean | null;
          status: string;
          stripe_customer_id: string;
          stripe_price_id: string;
          stripe_subscription_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created_at?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          is_effectively_active?: boolean | null;
          status?: string;
          stripe_customer_id: string;
          stripe_price_id: string;
          stripe_subscription_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created_at?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          is_effectively_active?: boolean | null;
          status?: string;
          stripe_customer_id?: string;
          stripe_price_id?: string;
          stripe_subscription_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      tattvas: {
        Row: {
          category: string | null;
          created_at: string | null;
          description_en: string | null;
          description_uk: string | null;
          display_order: number | null;
          id: string;
          name_en: string;
          name_sanskrit: string | null;
          name_uk: string;
          parent_id: string | null;
          slug: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          display_order?: number | null;
          id?: string;
          name_en: string;
          name_sanskrit?: string | null;
          name_uk: string;
          parent_id?: string | null;
          slug: string;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          display_order?: number | null;
          id?: string;
          name_en?: string;
          name_sanskrit?: string | null;
          name_uk?: string;
          parent_id?: string | null;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tattvas_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "tattva_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tattvas_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "tattvas";
            referencedColumns: ["id"];
          },
        ];
      };
      tithi_types: {
        Row: {
          created_at: string | null;
          id: number;
          is_ekadashi: boolean | null;
          name_en: string;
          name_sanskrit: string;
          name_uk: string;
          paksha: string;
          tithi_number: number;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          is_ekadashi?: boolean | null;
          name_en: string;
          name_sanskrit: string;
          name_uk: string;
          paksha: string;
          tithi_number: number;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          is_ekadashi?: boolean | null;
          name_en?: string;
          name_sanskrit?: string;
          name_uk?: string;
          paksha?: string;
          tithi_number?: number;
        };
        Relationships: [];
      };
      user_book_progress: {
        Row: {
          book_slug: string;
          book_title: string | null;
          chapters_completed: number | null;
          chapters_started: number | null;
          completed_at: string | null;
          created_at: string | null;
          first_read_at: string | null;
          id: string;
          last_read_at: string | null;
          overall_percent: number | null;
          total_chapters: number | null;
          total_reading_seconds: number | null;
          total_sessions: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          book_slug: string;
          book_title?: string | null;
          chapters_completed?: number | null;
          chapters_started?: number | null;
          completed_at?: string | null;
          created_at?: string | null;
          first_read_at?: string | null;
          id?: string;
          last_read_at?: string | null;
          overall_percent?: number | null;
          total_chapters?: number | null;
          total_reading_seconds?: number | null;
          total_sessions?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          book_slug?: string;
          book_title?: string | null;
          chapters_completed?: number | null;
          chapters_started?: number | null;
          completed_at?: string | null;
          created_at?: string | null;
          first_read_at?: string | null;
          id?: string;
          last_read_at?: string | null;
          overall_percent?: number | null;
          total_chapters?: number | null;
          total_reading_seconds?: number | null;
          total_sessions?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_calendar_settings: {
        Row: {
          created_at: string | null;
          custom_latitude: number | null;
          custom_longitude: number | null;
          default_view: string | null;
          fasting_level: string | null;
          id: string;
          location_id: string | null;
          notification_time: string | null;
          notify_day_before: boolean | null;
          notify_ekadashi: boolean | null;
          notify_festivals: boolean | null;
          show_appearances: boolean | null;
          show_disappearances: boolean | null;
          show_ekadashi: boolean | null;
          show_festivals: boolean | null;
          show_moon_phase: boolean | null;
          show_sunrise_sunset: boolean | null;
          timezone: string | null;
          updated_at: string | null;
          user_id: string | null;
          week_starts_monday: boolean | null;
        };
        Insert: {
          created_at?: string | null;
          custom_latitude?: number | null;
          custom_longitude?: number | null;
          default_view?: string | null;
          fasting_level?: string | null;
          id?: string;
          location_id?: string | null;
          notification_time?: string | null;
          notify_day_before?: boolean | null;
          notify_ekadashi?: boolean | null;
          notify_festivals?: boolean | null;
          show_appearances?: boolean | null;
          show_disappearances?: boolean | null;
          show_ekadashi?: boolean | null;
          show_festivals?: boolean | null;
          show_moon_phase?: boolean | null;
          show_sunrise_sunset?: boolean | null;
          timezone?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          week_starts_monday?: boolean | null;
        };
        Update: {
          created_at?: string | null;
          custom_latitude?: number | null;
          custom_longitude?: number | null;
          default_view?: string | null;
          fasting_level?: string | null;
          id?: string;
          location_id?: string | null;
          notification_time?: string | null;
          notify_day_before?: boolean | null;
          notify_ekadashi?: boolean | null;
          notify_festivals?: boolean | null;
          show_appearances?: boolean | null;
          show_disappearances?: boolean | null;
          show_ekadashi?: boolean | null;
          show_festivals?: boolean | null;
          show_moon_phase?: boolean | null;
          show_sunrise_sunset?: boolean | null;
          timezone?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          week_starts_monday?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_calendar_settings_location_id_fkey";
            columns: ["location_id"];
            isOneToOne: false;
            referencedRelation: "calendar_locations";
            referencedColumns: ["id"];
          },
        ];
      };
      user_chapter_progress: {
        Row: {
          book_slug: string;
          canto_number: number | null;
          canto_number_norm: number | null;
          chapter_number: number;
          chapter_title: string | null;
          completed_at: string | null;
          created_at: string | null;
          first_read_at: string | null;
          id: string;
          is_completed: boolean | null;
          last_read_at: string | null;
          last_verse: string | null;
          percent_read: number | null;
          reading_seconds: number | null;
          scroll_position: number | null;
          session_count: number | null;
          total_verses: number | null;
          updated_at: string | null;
          user_id: string;
          verses_read: number | null;
        };
        Insert: {
          book_slug: string;
          canto_number?: number | null;
          canto_number_norm?: number | null;
          chapter_number: number;
          chapter_title?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          first_read_at?: string | null;
          id?: string;
          is_completed?: boolean | null;
          last_read_at?: string | null;
          last_verse?: string | null;
          percent_read?: number | null;
          reading_seconds?: number | null;
          scroll_position?: number | null;
          session_count?: number | null;
          total_verses?: number | null;
          updated_at?: string | null;
          user_id: string;
          verses_read?: number | null;
        };
        Update: {
          book_slug?: string;
          canto_number?: number | null;
          canto_number_norm?: number | null;
          chapter_number?: number;
          chapter_title?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          first_read_at?: string | null;
          id?: string;
          is_completed?: boolean | null;
          last_read_at?: string | null;
          last_verse?: string | null;
          percent_read?: number | null;
          reading_seconds?: number | null;
          scroll_position?: number | null;
          session_count?: number | null;
          total_verses?: number | null;
          updated_at?: string | null;
          user_id?: string;
          verses_read?: number | null;
        };
        Relationships: [];
      };
      user_learning_activity: {
        Row: {
          activity_date: string;
          correct_count: number | null;
          created_at: string | null;
          id: string;
          reviews_count: number | null;
          time_spent_seconds: number | null;
          user_id: string;
          verses_added: number | null;
          words_added: number | null;
        };
        Insert: {
          activity_date?: string;
          correct_count?: number | null;
          created_at?: string | null;
          id?: string;
          reviews_count?: number | null;
          time_spent_seconds?: number | null;
          user_id: string;
          verses_added?: number | null;
          words_added?: number | null;
        };
        Update: {
          activity_date?: string;
          correct_count?: number | null;
          created_at?: string | null;
          id?: string;
          reviews_count?: number | null;
          time_spent_seconds?: number | null;
          user_id?: string;
          verses_added?: number | null;
          words_added?: number | null;
        };
        Relationships: [];
      };
      user_learning_items: {
        Row: {
          created_at: string | null;
          id: string;
          item_data: Json;
          item_id: string;
          item_type: string;
          srs_ease_factor: number | null;
          srs_interval: number | null;
          srs_last_reviewed: string | null;
          srs_next_review: string | null;
          srs_repetitions: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          item_data: Json;
          item_id: string;
          item_type: string;
          srs_ease_factor?: number | null;
          srs_interval?: number | null;
          srs_last_reviewed?: string | null;
          srs_next_review?: string | null;
          srs_repetitions?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          item_data?: Json;
          item_id?: string;
          item_type?: string;
          srs_ease_factor?: number | null;
          srs_interval?: number | null;
          srs_last_reviewed?: string | null;
          srs_next_review?: string | null;
          srs_repetitions?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_learning_progress: {
        Row: {
          achievements: Json | null;
          created_at: string | null;
          current_streak: number | null;
          daily_goal: number | null;
          id: string;
          last_login_date: string | null;
          longest_streak: number | null;
          total_correct: number | null;
          total_reviews: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          achievements?: Json | null;
          created_at?: string | null;
          current_streak?: number | null;
          daily_goal?: number | null;
          id?: string;
          last_login_date?: string | null;
          longest_streak?: number | null;
          total_correct?: number | null;
          total_reviews?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          achievements?: Json | null;
          created_at?: string | null;
          current_streak?: number | null;
          daily_goal?: number | null;
          id?: string;
          last_login_date?: string | null;
          longest_streak?: number | null;
          total_correct?: number | null;
          total_reviews?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_reading_daily_stats: {
        Row: {
          books_touched: number | null;
          chapters_read: number | null;
          created_at: string | null;
          id: string;
          peak_reading_hour: number | null;
          reading_seconds: number | null;
          sessions_count: number | null;
          stats_date: string;
          updated_at: string | null;
          user_id: string;
          verses_read: number | null;
        };
        Insert: {
          books_touched?: number | null;
          chapters_read?: number | null;
          created_at?: string | null;
          id?: string;
          peak_reading_hour?: number | null;
          reading_seconds?: number | null;
          sessions_count?: number | null;
          stats_date?: string;
          updated_at?: string | null;
          user_id: string;
          verses_read?: number | null;
        };
        Update: {
          books_touched?: number | null;
          chapters_read?: number | null;
          created_at?: string | null;
          id?: string;
          peak_reading_hour?: number | null;
          reading_seconds?: number | null;
          sessions_count?: number | null;
          stats_date?: string;
          updated_at?: string | null;
          user_id?: string;
          verses_read?: number | null;
        };
        Relationships: [];
      };
      user_reading_goals: {
        Row: {
          book_slug: string;
          book_title: string | null;
          completed_at: string | null;
          created_at: string | null;
          current_page: number | null;
          current_sloka: number | null;
          duration: number;
          id: string;
          is_active: boolean | null;
          reminder_enabled: boolean | null;
          reminder_time: string | null;
          started_at: string;
          target_date: string | null;
          target_per_day: number | null;
          time_unit: string;
          total_pages: number | null;
          total_slokas: number | null;
          track_by: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          book_slug: string;
          book_title?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          current_page?: number | null;
          current_sloka?: number | null;
          duration: number;
          id?: string;
          is_active?: boolean | null;
          reminder_enabled?: boolean | null;
          reminder_time?: string | null;
          started_at?: string;
          target_date?: string | null;
          target_per_day?: number | null;
          time_unit: string;
          total_pages?: number | null;
          total_slokas?: number | null;
          track_by?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          book_slug?: string;
          book_title?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          current_page?: number | null;
          current_sloka?: number | null;
          duration?: number;
          id?: string;
          is_active?: boolean | null;
          reminder_enabled?: boolean | null;
          reminder_time?: string | null;
          started_at?: string;
          target_date?: string | null;
          target_per_day?: number | null;
          time_unit?: string;
          total_pages?: number | null;
          total_slokas?: number | null;
          track_by?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_reading_sessions: {
        Row: {
          book_slug: string;
          book_title: string | null;
          canto_number: number | null;
          chapter_number: number;
          chapter_title: string | null;
          created_at: string | null;
          device_type: string | null;
          duration_seconds: number | null;
          end_verse: string | null;
          ended_at: string | null;
          id: string;
          is_audio_session: boolean | null;
          percent_read: number | null;
          start_verse: string | null;
          started_at: string;
          user_id: string | null;
          verses_read: number | null;
        };
        Insert: {
          book_slug: string;
          book_title?: string | null;
          canto_number?: number | null;
          chapter_number: number;
          chapter_title?: string | null;
          created_at?: string | null;
          device_type?: string | null;
          duration_seconds?: number | null;
          end_verse?: string | null;
          ended_at?: string | null;
          id?: string;
          is_audio_session?: boolean | null;
          percent_read?: number | null;
          start_verse?: string | null;
          started_at?: string;
          user_id?: string | null;
          verses_read?: number | null;
        };
        Update: {
          book_slug?: string;
          book_title?: string | null;
          canto_number?: number | null;
          chapter_number?: number;
          chapter_title?: string | null;
          created_at?: string | null;
          device_type?: string | null;
          duration_seconds?: number | null;
          end_verse?: string | null;
          ended_at?: string | null;
          id?: string;
          is_audio_session?: boolean | null;
          percent_read?: number | null;
          start_verse?: string | null;
          started_at?: string;
          user_id?: string | null;
          verses_read?: number | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      user_sadhana_config: {
        Row: {
          apns_token: string | null;
          avatar_url: string | null;
          bed_time_target: string | null;
          created_at: string | null;
          display_name: string | null;
          fcm_token: string | null;
          id: string;
          is_public: boolean | null;
          japa_before_730_target: number | null;
          japa_rounds_target: number | null;
          language: string | null;
          reading_minutes_target: number | null;
          reminder_enabled: boolean | null;
          reminder_time: string | null;
          timezone: string | null;
          track_kirtan: boolean | null;
          track_lections: boolean | null;
          track_service: boolean | null;
          track_yoga: boolean | null;
          updated_at: string | null;
          user_id: string;
          wake_up_target: string | null;
        };
        Insert: {
          apns_token?: string | null;
          avatar_url?: string | null;
          bed_time_target?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          fcm_token?: string | null;
          id?: string;
          is_public?: boolean | null;
          japa_before_730_target?: number | null;
          japa_rounds_target?: number | null;
          language?: string | null;
          reading_minutes_target?: number | null;
          reminder_enabled?: boolean | null;
          reminder_time?: string | null;
          timezone?: string | null;
          track_kirtan?: boolean | null;
          track_lections?: boolean | null;
          track_service?: boolean | null;
          track_yoga?: boolean | null;
          updated_at?: string | null;
          user_id: string;
          wake_up_target?: string | null;
        };
        Update: {
          apns_token?: string | null;
          avatar_url?: string | null;
          bed_time_target?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          fcm_token?: string | null;
          id?: string;
          is_public?: boolean | null;
          japa_before_730_target?: number | null;
          japa_rounds_target?: number | null;
          language?: string | null;
          reading_minutes_target?: number | null;
          reminder_enabled?: boolean | null;
          reminder_time?: string | null;
          timezone?: string | null;
          track_kirtan?: boolean | null;
          track_lections?: boolean | null;
          track_service?: boolean | null;
          track_yoga?: boolean | null;
          updated_at?: string | null;
          user_id?: string;
          wake_up_target?: string | null;
        };
        Relationships: [];
      };
      user_sadhana_daily: {
        Row: {
          bed_time: string | null;
          completion_percent: number | null;
          created_at: string | null;
          entry_date: string;
          id: string;
          japa_after_1800: number | null;
          japa_before_1000: number | null;
          japa_before_1800: number | null;
          japa_before_730: number | null;
          japa_total: number | null;
          kirtan_minutes: number | null;
          lections_attended: boolean | null;
          notes: string | null;
          reading_minutes: number | null;
          service_done: boolean | null;
          updated_at: string | null;
          user_id: string;
          wake_up_time: string | null;
          yoga_done: boolean | null;
        };
        Insert: {
          bed_time?: string | null;
          completion_percent?: number | null;
          created_at?: string | null;
          entry_date?: string;
          id?: string;
          japa_after_1800?: number | null;
          japa_before_1000?: number | null;
          japa_before_1800?: number | null;
          japa_before_730?: number | null;
          japa_total?: number | null;
          kirtan_minutes?: number | null;
          lections_attended?: boolean | null;
          notes?: string | null;
          reading_minutes?: number | null;
          service_done?: boolean | null;
          updated_at?: string | null;
          user_id: string;
          wake_up_time?: string | null;
          yoga_done?: boolean | null;
        };
        Update: {
          bed_time?: string | null;
          completion_percent?: number | null;
          created_at?: string | null;
          entry_date?: string;
          id?: string;
          japa_after_1800?: number | null;
          japa_before_1000?: number | null;
          japa_before_1800?: number | null;
          japa_before_730?: number | null;
          japa_total?: number | null;
          kirtan_minutes?: number | null;
          lections_attended?: boolean | null;
          notes?: string | null;
          reading_minutes?: number | null;
          service_done?: boolean | null;
          updated_at?: string | null;
          user_id?: string;
          wake_up_time?: string | null;
          yoga_done?: boolean | null;
        };
        Relationships: [];
      };
      user_sadhana_friends: {
        Row: {
          created_at: string | null;
          friend_id: string;
          id: string;
          is_favorite: boolean | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          friend_id: string;
          id?: string;
          is_favorite?: boolean | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          friend_id?: string;
          id?: string;
          is_favorite?: boolean | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_sadhana_monthly_stats: {
        Row: {
          avg_bed_time: string | null;
          avg_wake_up_time: string | null;
          created_at: string | null;
          days_tracked: number | null;
          days_with_lections: number | null;
          days_with_service: number | null;
          days_with_yoga: number | null;
          id: string;
          stats_month: string;
          streak_at_month_end: number | null;
          total_japa_rounds: number | null;
          total_kirtan_minutes: number | null;
          total_reading_minutes: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          avg_bed_time?: string | null;
          avg_wake_up_time?: string | null;
          created_at?: string | null;
          days_tracked?: number | null;
          days_with_lections?: number | null;
          days_with_service?: number | null;
          days_with_yoga?: number | null;
          id?: string;
          stats_month: string;
          streak_at_month_end?: number | null;
          total_japa_rounds?: number | null;
          total_kirtan_minutes?: number | null;
          total_reading_minutes?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          avg_bed_time?: string | null;
          avg_wake_up_time?: string | null;
          created_at?: string | null;
          days_tracked?: number | null;
          days_with_lections?: number | null;
          days_with_service?: number | null;
          days_with_yoga?: number | null;
          id?: string;
          stats_month?: string;
          streak_at_month_end?: number | null;
          total_japa_rounds?: number | null;
          total_kirtan_minutes?: number | null;
          total_reading_minutes?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      vaishnava_festivals: {
        Row: {
          category_id: number | null;
          created_at: string | null;
          description_en: string | null;
          description_uk: string | null;
          fasting_level: string | null;
          gallery_urls: string[] | null;
          id: string;
          image_url: string | null;
          is_major: boolean | null;
          name_en: string;
          name_sanskrit: string | null;
          name_uk: string;
          observances_en: string | null;
          observances_uk: string | null;
          paksha: string | null;
          related_books: string[] | null;
          related_verses: string[] | null;
          short_description_en: string | null;
          short_description_uk: string | null;
          significance_en: string | null;
          significance_uk: string | null;
          slug: string;
          sort_order: number | null;
          tithi_number: number | null;
          updated_at: string | null;
          vaishnava_month_id: number | null;
        };
        Insert: {
          category_id?: number | null;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          fasting_level?: string | null;
          gallery_urls?: string[] | null;
          id?: string;
          image_url?: string | null;
          is_major?: boolean | null;
          name_en: string;
          name_sanskrit?: string | null;
          name_uk: string;
          observances_en?: string | null;
          observances_uk?: string | null;
          paksha?: string | null;
          related_books?: string[] | null;
          related_verses?: string[] | null;
          short_description_en?: string | null;
          short_description_uk?: string | null;
          significance_en?: string | null;
          significance_uk?: string | null;
          slug: string;
          sort_order?: number | null;
          tithi_number?: number | null;
          updated_at?: string | null;
          vaishnava_month_id?: number | null;
        };
        Update: {
          category_id?: number | null;
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          fasting_level?: string | null;
          gallery_urls?: string[] | null;
          id?: string;
          image_url?: string | null;
          is_major?: boolean | null;
          name_en?: string;
          name_sanskrit?: string | null;
          name_uk?: string;
          observances_en?: string | null;
          observances_uk?: string | null;
          paksha?: string | null;
          related_books?: string[] | null;
          related_verses?: string[] | null;
          short_description_en?: string | null;
          short_description_uk?: string | null;
          significance_en?: string | null;
          significance_uk?: string | null;
          slug?: string;
          sort_order?: number | null;
          tithi_number?: number | null;
          updated_at?: string | null;
          vaishnava_month_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "vaishnava_festivals_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "festival_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vaishnava_festivals_vaishnava_month_id_fkey";
            columns: ["vaishnava_month_id"];
            isOneToOne: false;
            referencedRelation: "vaishnava_months";
            referencedColumns: ["id"];
          },
        ];
      };
      vaishnava_months: {
        Row: {
          created_at: string | null;
          description_en: string | null;
          description_uk: string | null;
          id: number;
          month_number: number;
          name_en: string;
          name_sanskrit: string;
          name_uk: string;
        };
        Insert: {
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          id?: number;
          month_number: number;
          name_en: string;
          name_sanskrit: string;
          name_uk: string;
        };
        Update: {
          created_at?: string | null;
          description_en?: string | null;
          description_uk?: string | null;
          id?: number;
          month_number?: number;
          name_en?: string;
          name_sanskrit?: string;
          name_uk?: string;
        };
        Relationships: [];
      };
      verse_lectures: {
        Row: {
          book_slug: string;
          canto_number: number | null;
          chapter_number: number;
          created_at: string;
          id: string;
          is_primary: boolean;
          lecture_id: string;
          verse_end: number | null;
          verse_id: string | null;
          verse_start: number;
        };
        Insert: {
          book_slug: string;
          canto_number?: number | null;
          chapter_number: number;
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          lecture_id: string;
          verse_end?: number | null;
          verse_id?: string | null;
          verse_start: number;
        };
        Update: {
          book_slug?: string;
          canto_number?: number | null;
          chapter_number?: number;
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          lecture_id?: string;
          verse_end?: number | null;
          verse_id?: string | null;
          verse_start?: number;
        };
        Relationships: [
          {
            foreignKeyName: "verse_lectures_lecture_id_fkey";
            columns: ["lecture_id"];
            isOneToOne: false;
            referencedRelation: "lectures";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "verse_lectures_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "verse_lectures_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_metadata";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "verse_lectures_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_structure";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "verse_lectures_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_synonyms";
            referencedColumns: ["id"];
          },
        ];
      };
      verse_lyrics: {
        Row: {
          audio_type: string;
          created_at: string;
          created_by: string | null;
          id: string;
          is_enhanced: boolean;
          language: string;
          lrc_content: string | null;
          sync_type: string;
          timestamps: Json;
          total_duration: number | null;
          updated_at: string;
          verse_id: string;
        };
        Insert: {
          audio_type?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          is_enhanced?: boolean;
          language?: string;
          lrc_content?: string | null;
          sync_type?: string;
          timestamps?: Json;
          total_duration?: number | null;
          updated_at?: string;
          verse_id: string;
        };
        Update: {
          audio_type?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          is_enhanced?: boolean;
          language?: string;
          lrc_content?: string | null;
          sync_type?: string;
          timestamps?: Json;
          total_duration?: number | null;
          updated_at?: string;
          verse_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "verse_lyrics_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "verse_lyrics_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_metadata";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "verse_lyrics_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_structure";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "verse_lyrics_verse_id_fkey";
            columns: ["verse_id"];
            isOneToOne: false;
            referencedRelation: "verses_with_synonyms";
            referencedColumns: ["id"];
          },
        ];
      };
      verses: {
        Row: {
          audio_url: string | null;
          chapter_id: string;
          commentary_en: string | null;
          commentary_uk: string | null;
          created_at: string;
          deleted_at: string | null;
          display_blocks: Json | null;
          embedding: string | null;
          end_verse: number | null;
          event_date: string | null;
          explanation_en_audio_url: string | null;
          explanation_uk_audio_url: string | null;
          full_verse_audio_url: string | null;
          id: string;
          is_composite: boolean | null;
          is_published: boolean | null;
          recitation_audio_url: string | null;
          sanskrit: string | null;
          sanskrit_en: string | null;
          sanskrit_uk: string | null;
          search_vector: unknown;
          search_vector_en: unknown;
          search_vector_uk: unknown;
          sort_key: number | null;
          start_verse: number | null;
          synonyms_en: string | null;
          synonyms_uk: string | null;
          translation_en: string | null;
          translation_uk: string | null;
          transliteration: string | null;
          transliteration_en: string | null;
          transliteration_uk: string | null;
          verse_count: number | null;
          verse_end: number | null;
          verse_number: string;
          verse_number_sort: number | null;
          verse_start: number | null;
          verse_suffix: string | null;
        };
        Insert: {
          audio_url?: string | null;
          chapter_id: string;
          commentary_en?: string | null;
          commentary_uk?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          display_blocks?: Json | null;
          embedding?: string | null;
          end_verse?: number | null;
          event_date?: string | null;
          explanation_en_audio_url?: string | null;
          explanation_uk_audio_url?: string | null;
          full_verse_audio_url?: string | null;
          id?: string;
          is_composite?: boolean | null;
          is_published?: boolean | null;
          recitation_audio_url?: string | null;
          sanskrit?: string | null;
          sanskrit_en?: string | null;
          sanskrit_uk?: string | null;
          search_vector?: unknown;
          search_vector_en?: unknown;
          search_vector_uk?: unknown;
          sort_key?: number | null;
          start_verse?: number | null;
          synonyms_en?: string | null;
          synonyms_uk?: string | null;
          translation_en?: string | null;
          translation_uk?: string | null;
          transliteration?: string | null;
          transliteration_en?: string | null;
          transliteration_uk?: string | null;
          verse_count?: number | null;
          verse_end?: number | null;
          verse_number: string;
          verse_number_sort?: number | null;
          verse_start?: number | null;
          verse_suffix?: string | null;
        };
        Update: {
          audio_url?: string | null;
          chapter_id?: string;
          commentary_en?: string | null;
          commentary_uk?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          display_blocks?: Json | null;
          embedding?: string | null;
          end_verse?: number | null;
          event_date?: string | null;
          explanation_en_audio_url?: string | null;
          explanation_uk_audio_url?: string | null;
          full_verse_audio_url?: string | null;
          id?: string;
          is_composite?: boolean | null;
          is_published?: boolean | null;
          recitation_audio_url?: string | null;
          sanskrit?: string | null;
          sanskrit_en?: string | null;
          sanskrit_uk?: string | null;
          search_vector?: unknown;
          search_vector_en?: unknown;
          search_vector_uk?: unknown;
          sort_key?: number | null;
          start_verse?: number | null;
          synonyms_en?: string | null;
          synonyms_uk?: string | null;
          translation_en?: string | null;
          translation_uk?: string | null;
          transliteration?: string | null;
          transliteration_en?: string | null;
          transliteration_uk?: string | null;
          verse_count?: number | null;
          verse_end?: number | null;
          verse_number?: string;
          verse_number_sort?: number | null;
          verse_start?: number | null;
          verse_suffix?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "verses_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "verses_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "readable_chapters";
            referencedColumns: ["chapter_id"];
          },
        ];
      };
      verses_archive: {
        Row: {
          audio_url: string | null;
          chapter_id: string;
          commentary_en: string | null;
          commentary_uk: string | null;
          created_at: string;
          id: string;
          sanskrit: string | null;
          search_vector: unknown;
          synonyms_en: string | null;
          synonyms_uk: string | null;
          translation_en: string | null;
          translation_uk: string | null;
          transliteration: string | null;
          verse_number: string;
          verse_number_sort: number | null;
        };
        Insert: {
          audio_url?: string | null;
          chapter_id: string;
          commentary_en?: string | null;
          commentary_uk?: string | null;
          created_at?: string;
          id?: string;
          sanskrit?: string | null;
          search_vector?: unknown;
          synonyms_en?: string | null;
          synonyms_uk?: string | null;
          translation_en?: string | null;
          translation_uk?: string | null;
          transliteration?: string | null;
          verse_number: string;
          verse_number_sort?: number | null;
        };
        Update: {
          audio_url?: string | null;
          chapter_id?: string;
          commentary_en?: string | null;
          commentary_uk?: string | null;
          created_at?: string;
          id?: string;
          sanskrit?: string | null;
          search_vector?: unknown;
          synonyms_en?: string | null;
          synonyms_uk?: string | null;
          translation_en?: string | null;
          translation_uk?: string | null;
          transliteration?: string | null;
          verse_number?: string;
          verse_number_sort?: number | null;
        };
        Relationships: [];
      };
      verses_backup_20251014: {
        Row: {
          audio_url: string | null;
          chapter_id: string | null;
          commentary_en: string | null;
          commentary_uk: string | null;
          created_at: string | null;
          id: string | null;
          sanskrit: string | null;
          search_vector: unknown;
          synonyms_en: string | null;
          synonyms_uk: string | null;
          translation_en: string | null;
          translation_uk: string | null;
          transliteration: string | null;
          verse_number: string | null;
          verse_number_sort: number | null;
        };
        Insert: {
          audio_url?: string | null;
          chapter_id?: string | null;
          commentary_en?: string | null;
          commentary_uk?: string | null;
          created_at?: string | null;
          id?: string | null;
          sanskrit?: string | null;
          search_vector?: unknown;
          synonyms_en?: string | null;
          synonyms_uk?: string | null;
          translation_en?: string | null;
          translation_uk?: string | null;
          transliteration?: string | null;
          verse_number?: string | null;
          verse_number_sort?: number | null;
        };
        Update: {
          audio_url?: string | null;
          chapter_id?: string | null;
          commentary_en?: string | null;
          commentary_uk?: string | null;
          created_at?: string | null;
          id?: string | null;
          sanskrit?: string | null;
          search_vector?: unknown;
          synonyms_en?: string | null;
          synonyms_uk?: string | null;
          translation_en?: string | null;
          translation_uk?: string | null;
          transliteration?: string | null;
          verse_number?: string | null;
          verse_number_sort?: number | null;
        };
        Relationships: [];
      };
      verses_backup_danda_fix: {
        Row: {
          changed_at: string | null;
          id: string;
          orig_sanskrit_en: string | null;
          orig_sanskrit_uk: string | null;
        };
        Insert: {
          changed_at?: string | null;
          id: string;
          orig_sanskrit_en?: string | null;
          orig_sanskrit_uk?: string | null;
        };
        Update: {
          changed_at?: string | null;
          id?: string;
          orig_sanskrit_en?: string | null;
          orig_sanskrit_uk?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      audio_track_daily_stats: {
        Row: {
          avg_track_duration_ms: number | null;
          completed_duration_ms: number | null;
          completes: number | null;
          day_utc: string | null;
          events_total: number | null;
          last_event_at: string | null;
          pauses: number | null;
          plays: number | null;
          skips: number | null;
          track_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audio_events_track_id_fkey";
            columns: ["track_id"];
            isOneToOne: false;
            referencedRelation: "audio_tracks";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_posts_public: {
        Row: {
          audio_url: string | null;
          author_display_name: string | null;
          category_id: string | null;
          content_en: string | null;
          content_uk: string | null;
          cover_image_url: string | null;
          created_at: string | null;
          excerpt_en: string | null;
          excerpt_uk: string | null;
          featured_image: string | null;
          id: string | null;
          instagram_embed_url: string | null;
          is_published: boolean | null;
          meta_description_en: string | null;
          meta_description_uk: string | null;
          published_at: string | null;
          read_time: number | null;
          scheduled_publish_at: string | null;
          search_vector_en: unknown;
          search_vector_uk: unknown;
          slug: string | null;
          substack_embed_url: string | null;
          tags: string[] | null;
          telegram_embed_url: string | null;
          title_en: string | null;
          title_uk: string | null;
          updated_at: string | null;
          video_url: string | null;
          view_count: number | null;
        };
        Insert: {
          audio_url?: string | null;
          author_display_name?: string | null;
          category_id?: string | null;
          content_en?: string | null;
          content_uk?: string | null;
          cover_image_url?: string | null;
          created_at?: string | null;
          excerpt_en?: string | null;
          excerpt_uk?: string | null;
          featured_image?: string | null;
          id?: string | null;
          instagram_embed_url?: string | null;
          is_published?: boolean | null;
          meta_description_en?: string | null;
          meta_description_uk?: string | null;
          published_at?: string | null;
          read_time?: number | null;
          scheduled_publish_at?: string | null;
          search_vector_en?: unknown;
          search_vector_uk?: unknown;
          slug?: string | null;
          substack_embed_url?: string | null;
          tags?: string[] | null;
          telegram_embed_url?: string | null;
          title_en?: string | null;
          title_uk?: string | null;
          updated_at?: string | null;
          video_url?: string | null;
          view_count?: number | null;
        };
        Update: {
          audio_url?: string | null;
          author_display_name?: string | null;
          category_id?: string | null;
          content_en?: string | null;
          content_uk?: string | null;
          cover_image_url?: string | null;
          created_at?: string | null;
          excerpt_en?: string | null;
          excerpt_uk?: string | null;
          featured_image?: string | null;
          id?: string | null;
          instagram_embed_url?: string | null;
          is_published?: boolean | null;
          meta_description_en?: string | null;
          meta_description_uk?: string | null;
          published_at?: string | null;
          read_time?: number | null;
          scheduled_publish_at?: string | null;
          search_vector_en?: unknown;
          search_vector_uk?: unknown;
          slug?: string | null;
          substack_embed_url?: string | null;
          tags?: string[] | null;
          telegram_embed_url?: string | null;
          title_en?: string | null;
          title_uk?: string | null;
          updated_at?: string | null;
          video_url?: string | null;
          view_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "blog_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      book_pages_with_metadata: {
        Row: {
          book_id: string | null;
          book_slug: string | null;
          book_title_en: string | null;
          book_title_uk: string | null;
          content_en: Json | null;
          content_uk: Json | null;
          created_at: string | null;
          id: string | null;
          is_published: boolean | null;
          page_order: number | null;
          page_type: string | null;
          page_type_display: string | null;
          slug: string | null;
          title_en: string | null;
          title_uk: string | null;
          updated_at: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "book_pages_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "book_pages_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books_with_mapping";
            referencedColumns: ["id"];
          },
        ];
      };
      books_with_mapping: {
        Row: {
          cantos_count: number | null;
          chapters_count: number | null;
          id: string | null;
          our_slug: string | null;
          title_en: string | null;
          title_uk: string | null;
          verses_count: number | null;
        };
        Insert: {
          cantos_count?: never;
          chapters_count?: never;
          id?: string | null;
          our_slug?: string | null;
          title_en?: string | null;
          title_uk?: string | null;
          verses_count?: never;
        };
        Update: {
          cantos_count?: never;
          chapters_count?: never;
          id?: string | null;
          our_slug?: string | null;
          title_en?: string | null;
          title_uk?: string | null;
          verses_count?: never;
        };
        Relationships: [];
      };
      glossary_stats_cache_en: {
        Row: {
          book_slug: string | null;
          book_title: string | null;
          term: string | null;
        };
        Relationships: [];
      };
      glossary_stats_cache_uk: {
        Row: {
          book_slug: string | null;
          book_title: string | null;
          term: string | null;
        };
        Relationships: [];
      };
      mv_blog_recent_published: {
        Row: {
          category_id: string | null;
          created_at: string | null;
          featured_image: string | null;
          id: string | null;
          is_published: boolean | null;
          slug: string | null;
          sort_date: string | null;
          title_en: string | null;
          title_uk: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "blog_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      readable_chapters: {
        Row: {
          book_id: string | null;
          book_slug: string | null;
          book_title_en: string | null;
          book_title_uk: string | null;
          chapter_id: string | null;
          chapter_number: number | null;
          chapter_title_en: string | null;
          chapter_title_uk: string | null;
          chapter_type: Database["public"]["Enums"]["chapter_type"] | null;
          completion_percentage: number | null;
          filled_verses: number | null;
          total_verses: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chapters_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books_with_mapping";
            referencedColumns: ["id"];
          },
        ];
      };
      tattva_stats: {
        Row: {
          ai_tagged: number | null;
          avg_relevance: number | null;
          id: string | null;
          manual_tagged: number | null;
          name_en: string | null;
          name_uk: string | null;
          seed_tagged: number | null;
          slug: string | null;
          verses_count: number | null;
        };
        Relationships: [];
      };
      verses_with_metadata: {
        Row: {
          audio_url: string | null;
          book_slug: string | null;
          chapter_id: string | null;
          chapter_number: number | null;
          chapter_title_en: string | null;
          chapter_title_uk: string | null;
          commentary_en: string | null;
          commentary_uk: string | null;
          created_at: string | null;
          id: string | null;
          sanskrit: string | null;
          synonyms_en: string | null;
          synonyms_uk: string | null;
          translation_en: string | null;
          translation_uk: string | null;
          transliteration: string | null;
          verse_number: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "verses_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "verses_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "readable_chapters";
            referencedColumns: ["chapter_id"];
          },
        ];
      };
      verses_with_structure: {
        Row: {
          chapter_id: string | null;
          detected_structure: string | null;
          has_commentary: boolean | null;
          has_sanskrit: boolean | null;
          has_synonyms: boolean | null;
          has_translation: boolean | null;
          has_transliteration: boolean | null;
          id: string | null;
          verse_number: string | null;
        };
        Insert: {
          chapter_id?: string | null;
          detected_structure?: never;
          has_commentary?: never;
          has_sanskrit?: never;
          has_synonyms?: never;
          has_translation?: never;
          has_transliteration?: never;
          id?: string | null;
          verse_number?: string | null;
        };
        Update: {
          chapter_id?: string | null;
          detected_structure?: never;
          has_commentary?: never;
          has_sanskrit?: never;
          has_synonyms?: never;
          has_translation?: never;
          has_transliteration?: never;
          id?: string | null;
          verse_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "verses_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "verses_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "readable_chapters";
            referencedColumns: ["chapter_id"];
          },
        ];
      };
      verses_with_synonyms: {
        Row: {
          book_slug: string | null;
          chapter_number: number | null;
          id: string | null;
          sanskrit: string | null;
          synonyms_en: string | null;
          synonyms_uk: string | null;
          title_en: string | null;
          title_uk: string | null;
          translation_en: string | null;
          translation_uk: string | null;
          transliteration: string | null;
          verse_number: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      compile_canto_knowledge: {
        Args: {
          language_code?: string;
          p_book_id: string;
          p_canto_number: number;
        };
        Returns: Json;
      };
      compile_chapter_knowledge: {
        Args: {
          language_code?: string;
          p_book_id: string;
          p_canto_number?: number;
          p_chapter_number: number;
        };
        Returns: Json;
      };
      compile_verse_knowledge: {
        Args: { language_code?: string; p_verse_id: string };
        Returns: Json;
      };
      count_blog_search_results: {
        Args: { lang?: string; q: string };
        Returns: number;
      };
      count_visible_blocks: { Args: { verse_id: string }; Returns: number };
      create_blog_post: {
        Args: {
          _audio_url?: string;
          _category_id?: string;
          _content_en: string;
          _content_uk: string;
          _cover_image_url?: string;
          _excerpt_en?: string;
          _excerpt_uk?: string;
          _is_published?: boolean;
          _scheduled_publish_at?: string;
          _tags?: string[];
          _title_en: string;
          _title_uk: string;
          _video_url?: string;
        };
        Returns: {
          audio_commentary_en_url: string | null;
          audio_commentary_uk_url: string | null;
          audio_poetry_translation_en_url: string | null;
          audio_poetry_translation_uk_url: string | null;
          audio_sanskrit_url: string | null;
          audio_synonyms_en_url: string | null;
          audio_synonyms_uk_url: string | null;
          audio_transliteration_url: string | null;
          audio_url: string | null;
          author_display_name: string | null;
          author_id: string;
          author_name: string;
          category_id: string;
          content_en: string;
          content_mode: string | null;
          content_uk: string;
          cover_image_url: string | null;
          created_at: string;
          display_blocks: Json | null;
          excerpt_en: string | null;
          excerpt_uk: string | null;
          featured_image: string | null;
          id: string;
          instagram_embed_url: string | null;
          is_published: boolean | null;
          meta_description_en: string | null;
          meta_description_uk: string | null;
          poetry_translation_en: string | null;
          poetry_translation_uk: string | null;
          published_at: string | null;
          read_time: number | null;
          sanskrit: string | null;
          scheduled_publish_at: string | null;
          search_vector: unknown;
          search_vector_en: unknown;
          search_vector_uk: unknown;
          slug: string;
          substack_embed_url: string | null;
          synonyms_en: string | null;
          synonyms_uk: string | null;
          tags: string[] | null;
          telegram_embed_url: string | null;
          title_en: string;
          title_uk: string;
          translation_en: string | null;
          translation_uk: string | null;
          transliteration: string | null;
          updated_at: string;
          video_url: string | null;
          view_count: number | null;
        };
        SetofOptions: {
          from: "*";
          to: "blog_posts";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      decode_html_entities: { Args: { input_text: string }; Returns: string };
      end_reading_session: {
        Args: {
          p_end_verse?: string;
          p_percent_read?: number;
          p_session_id: string;
          p_verses_read?: number;
        };
        Returns: {
          book_slug: string;
          book_title: string | null;
          canto_number: number | null;
          chapter_number: number;
          chapter_title: string | null;
          created_at: string | null;
          device_type: string | null;
          duration_seconds: number | null;
          end_verse: string | null;
          ended_at: string | null;
          id: string;
          is_audio_session: boolean | null;
          percent_read: number | null;
          start_verse: string | null;
          started_at: string;
          user_id: string | null;
          verses_read: number | null;
        };
        SetofOptions: {
          from: "*";
          to: "user_reading_sessions";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      find_html_encoding_remnants: {
        Args: never;
        Returns: {
          affected_count: number;
          column_name: string;
          sample_id: string;
          sample_text: string;
          sample_verse_number: string;
          table_name: string;
        }[];
      };
      find_verse_id: {
        Args: {
          p_book_slug: string;
          p_canto_number: number;
          p_chapter_number: number;
          p_verse_number: string;
        };
        Returns: string;
      };
      fix_html_encoding_remnants: {
        Args: never;
        Returns: {
          column_name: string;
          fixed_count: number;
          table_name: string;
        }[];
      };
      get_bengali_word: {
        Args: { word_id: number };
        Returns: {
          id: number;
          word_bn: string;
          word_en: string;
        }[];
      };
      get_book_by_vedabase_slug: {
        Args: { v_slug: string };
        Returns: {
          default_structure: string;
          gitabase_slug: string;
          id: string;
          slug: string;
          title_en: string;
          title_uk: string;
          vedabase_slug: string;
        }[];
      };
      get_book_pages:
        | {
            Args: {
              p_book_id: string;
              p_canto_id?: string;
              p_language?: string;
            };
            Returns: {
              content: Json;
              id: string;
              page_order: number;
              page_type: string;
              slug: string;
              title: string;
            }[];
          }
        | {
            Args: { p_book_id: string; p_language?: string };
            Returns: {
              content: Json;
              id: string;
              page_order: number;
              page_type: string;
              slug: string;
              title: string;
            }[];
          };
      get_calendar_events: {
        Args: {
          p_end_date: string;
          p_location_id?: string;
          p_start_date: string;
        };
        Returns: {
          category_color: string;
          category_slug: string;
          description_en: string;
          description_uk: string;
          event_date: string;
          event_id: string;
          event_type: string;
          is_ekadashi: boolean;
          is_major: boolean;
          moon_phase: number;
          name_en: string;
          name_uk: string;
          sunrise_time: string;
          sunset_time: string;
        }[];
      };
      get_chapter_verses: {
        Args: { p_chapter_id: string };
        Returns: {
          audio_url: string;
          commentary_en: string;
          commentary_uk: string;
          end_verse: number;
          id: string;
          is_composite: boolean;
          sanskrit: string;
          start_verse: number;
          synonyms_en: string;
          synonyms_uk: string;
          translation_en: string;
          translation_uk: string;
          transliteration: string;
          verse_count: number;
          verse_number: string;
        }[];
      };
      get_featured_quote_categories: {
        Args: { p_limit?: number };
        Returns: {
          id: string;
          quotes_count: number;
          slug: string;
          title: string;
          title_uk: string;
        }[];
      };
      get_glossary_stats: {
        Args: { search_language?: string };
        Returns: {
          book_stats: Json;
          books_count: number;
          total_terms: number;
          unique_terms: number;
        }[];
      };
      get_glossary_term_by_name: {
        Args: { search_language?: string; term_name: string };
        Returns: {
          categories: string[];
          definition: string;
          devanagari: string;
          etymology: string;
          id: string;
          related_terms: string[];
          term: string;
          translation: string;
          transliteration: string;
          usage_examples: Json;
        }[];
      };
      get_glossary_term_details: {
        Args: { search_language?: string; term_to_find: string };
        Returns: {
          book_slug: string;
          book_title: string;
          canto_number: number;
          chapter_number: number;
          has_cantos: boolean;
          meaning: string;
          term: string;
          transliteration: string;
          verse_link: string;
          verse_number: string;
        }[];
      };
      get_glossary_terms_grouped: {
        Args: {
          book_filter?: string;
          page_number?: number;
          page_size?: number;
          search_language?: string;
          search_mode?: string;
          search_term?: string;
          search_translation?: string;
        };
        Returns: {
          books: string[];
          sample_meanings: string[];
          term: string;
          total_unique_terms: number;
          usage_count: number;
        }[];
      };
      get_lecture_verses: {
        Args: { p_lecture_id: string };
        Returns: {
          book_slug: string;
          canto_number: number;
          chapter_number: number;
          is_primary: boolean;
          reference_string: string;
          verse_end: number;
          verse_id: string;
          verse_lecture_id: string;
          verse_start: number;
        }[];
      };
      get_or_create_calendar_settings: {
        Args: { p_user_id: string };
        Returns: {
          created_at: string | null;
          custom_latitude: number | null;
          custom_longitude: number | null;
          default_view: string | null;
          fasting_level: string | null;
          id: string;
          location_id: string | null;
          notification_time: string | null;
          notify_day_before: boolean | null;
          notify_ekadashi: boolean | null;
          notify_festivals: boolean | null;
          show_appearances: boolean | null;
          show_disappearances: boolean | null;
          show_ekadashi: boolean | null;
          show_festivals: boolean | null;
          show_moon_phase: boolean | null;
          show_sunrise_sunset: boolean | null;
          timezone: string | null;
          updated_at: string | null;
          user_id: string | null;
          week_starts_monday: boolean | null;
        };
        SetofOptions: {
          from: "*";
          to: "user_calendar_settings";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      get_public_sadhana_users: {
        Args: { p_limit?: number; p_offset?: number };
        Returns: {
          avatar_url: string;
          current_streak: number;
          display_name: string;
          today_japa: number;
          today_reading: number;
          user_id: string;
        }[];
      };
      get_sadhana_monthly_stats: {
        Args: { p_user_id: string; p_year?: number };
        Returns: {
          avg_bed_time: string;
          avg_wake_up: string;
          days_tracked: number;
          japa_quality_percent: number;
          month_name: string;
          month_num: number;
          streak_score: number;
          total_japa: number;
          total_reading_minutes: number;
        }[];
      };
      get_sadhana_streak: {
        Args: { p_user_id: string };
        Returns: {
          current_streak: number;
          last_entry_date: string;
          longest_streak: number;
        }[];
      };
      get_synonyms_for_term: {
        Args: {
          language_code?: string;
          limit_count?: number;
          search_term: string;
        };
        Returns: {
          meaning: string;
          sanskrit: string;
          term: string;
          verse_refs: string[];
        }[];
      };
      get_tattva_breadcrumb: {
        Args: { p_tattva_slug: string };
        Returns: {
          depth: number;
          id: string;
          name_en: string;
          name_uk: string;
          slug: string;
        }[];
      };
      get_tattva_verses: {
        Args: {
          p_include_children?: boolean;
          p_limit?: number;
          p_offset?: number;
          p_tattva_slug: string;
        };
        Returns: {
          book_slug: string;
          book_title: string;
          canto_number: number;
          chapter_number: number;
          relevance_score: number;
          sanskrit: string;
          tattva_name: string;
          translation_en: string;
          translation_uk: string;
          verse_id: string;
          verse_number: string;
        }[];
      };
      get_today_events: {
        Args: { p_location_id?: string };
        Returns: {
          category_color: string;
          event_id: string;
          event_type: string;
          is_ekadashi: boolean;
          name_en: string;
          name_uk: string;
          parana_end_time: string;
          parana_start_time: string;
          short_description_en: string;
          short_description_uk: string;
        }[];
      };
      get_topic_statistics: {
        Args: {
          book_ids?: string[];
          language_code: string;
          search_query: string;
        };
        Returns: {
          book_id: string;
          book_slug: string;
          book_title: string;
          sample_verses: string[];
          verse_count: number;
        }[];
      };
      get_unique_synonym_terms: {
        Args: {
          book_filter?: string;
          canto_filter?: number;
          search_language?: string;
        };
        Returns: {
          count: number;
          term: string;
        }[];
      };
      get_user_reading_stats: {
        Args: { p_user_id: string };
        Returns: {
          books_completed: number;
          books_in_progress: number;
          chapters_completed: number;
          current_streak: number;
          longest_streak: number;
          total_reading_time: number;
          total_sessions: number;
        }[];
      };
      get_verse_id_by_ref: {
        Args: {
          p_book_slug: string;
          p_chapter_number: number;
          p_verse_number: string;
        };
        Returns: string;
      };
      get_verse_lectures: {
        Args: {
          p_book_slug: string;
          p_canto_number: number;
          p_chapter_number: number;
          p_verse_number: number;
        };
        Returns: {
          audio_url: string | null;
          book_slug: string | null;
          canto_number: number | null;
          chapter_number: number | null;
          created_at: string;
          description_en: string | null;
          description_uk: string | null;
          id: string;
          lecture_date: string;
          lecture_type: Database["public"]["Enums"]["lecture_type"];
          location_en: string;
          location_uk: string | null;
          slug: string;
          title_en: string;
          title_uk: string | null;
          updated_at: string;
          verse_number: string | null;
        }[];
        SetofOptions: {
          from: "*";
          to: "lectures";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      get_verse_quotes: {
        Args: {
          p_book_slug: string;
          p_canto_number: number;
          p_chapter_number: number;
          p_verse_number: string;
        };
        Returns: {
          id: string;
          page_title: string;
          source_reference: string;
          source_type: string;
          text_en: string;
          text_uk: string;
        }[];
      };
      get_verse_tattvas: {
        Args: { p_verse_id: string };
        Returns: {
          category: string;
          id: string;
          name_en: string;
          name_sanskrit: string;
          name_uk: string;
          relevance_score: number;
          slug: string;
        }[];
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      hybrid_search_verses: {
        Args: {
          language_code?: string;
          match_count?: number;
          query_embedding?: string;
          query_text: string;
          semantic_weight?: number;
        };
        Returns: {
          book_slug: string;
          chapter_id: string;
          combined_score: number;
          commentary: string;
          id: string;
          translation: string;
          verse_number: string;
        }[];
      };
      increment_blog_post_views: {
        Args: { post_id: string };
        Returns: undefined;
      };
      is_chapter_readable: { Args: { chapter_uuid: string }; Returns: boolean };
      jsonb_no_uk_keys: { Args: { j: Json }; Returns: boolean };
      link_verse_to_tattva: {
        Args: {
          p_book_slug: string;
          p_chapter_number: number;
          p_relevance?: number;
          p_tagged_by?: string;
          p_tattva_slug: string;
          p_verse_number: string;
        };
        Returns: undefined;
      };
      normalize_english_word: { Args: { word: string }; Returns: string };
      normalize_language_code: { Args: { lang: string }; Returns: string };
      normalize_sanskrit_word: { Args: { word: string }; Returns: string };
      normalize_ukrainian_cc_texts: { Args: never; Returns: undefined };
      parse_advanced_query: {
        Args: { config: unknown; query_text: string };
        Returns: {
          has_complex_wildcard: boolean;
          has_proximity: boolean;
          ilike_pattern: string;
          ts_query: unknown;
        }[];
      };
      parse_proximity_query: {
        Args: { config: unknown; query_text: string };
        Returns: unknown;
      };
      parse_verse_number: {
        Args: { v_num: string };
        Returns: {
          v_end: number;
          v_start: number;
          v_suffix: string;
        }[];
      };
      parse_wildcard_query: {
        Args: { config: unknown; query_text: string };
        Returns: {
          has_complex_wildcard: boolean;
          ilike_pattern: string;
          ts_query: unknown;
        }[];
      };
      refresh_glossary_cache: { Args: never; Returns: undefined };
      remove_adjacent_duplicate_paragraphs: {
        Args: { input_text: string };
        Returns: string;
      };
      remove_adjacent_duplicate_sentences: {
        Args: { input_text: string };
        Returns: string;
      };
      remove_duplicate_words_in_synonyms: { Args: never; Returns: undefined };
      safe_websearch_to_tsquery: {
        Args: { config: unknown; query_text: string };
        Returns: unknown;
      };
      search_bengali_by_bengali: {
        Args: { result_limit?: number; search_term: string };
        Returns: {
          id: number;
          relevance: number;
          word_bn: string;
          word_en: string;
        }[];
      };
      search_bengali_lexicon: {
        Args: {
          result_limit?: number;
          search_mode?: string;
          search_term: string;
        };
        Returns: {
          id: number;
          relevance: number;
          word_bn: string;
          word_en: string;
        }[];
      };
      search_blog_posts: {
        Args: {
          lang?: string;
          limit_count?: number;
          offset_count?: number;
          q: string;
        };
        Returns: {
          author_display_name: string;
          category_id: string;
          cover_image_url: string;
          created_at: string;
          excerpt: string;
          featured_image: string;
          id: string;
          published_at: string;
          rank: number;
          read_time: number;
          slug: string;
          tags: string[];
          title: string;
          view_count: number;
        }[];
      };
      search_glossary_by_translation: {
        Args: {
          limit_count?: number;
          search_language?: string;
          search_text: string;
        };
        Returns: {
          id: string;
          rank: number;
          term: string;
          translation: string;
        }[];
      };
      search_glossary_similar: {
        Args: {
          limit_count?: number;
          search_language?: string;
          search_text: string;
          similarity_threshold?: number;
        };
        Returns: {
          id: string;
          similarity_score: number;
          term: string;
          translation: string;
        }[];
      };
      search_glossary_terms:
        | {
            Args: {
              book_filter?: string;
              limit_count?: number;
              search_language?: string;
              search_mode?: string;
              search_term: string;
            };
            Returns: {
              book_id: string;
              book_slug: string;
              book_title: string;
              canto_number: number;
              chapter_number: number;
              meaning: string;
              term: string;
              verse_id: string;
              verse_link: string;
              verse_number: string;
            }[];
          }
        | {
            Args: {
              limit_count?: number;
              offset_count?: number;
              search_language?: string;
              search_text: string;
            };
            Returns: {
              definition: string;
              devanagari: string;
              id: string;
              rank: number;
              term: string;
              translation: string;
            }[];
          };
      search_glossary_terms_v2: {
        Args: {
          book_filter?: string;
          page_number?: number;
          page_size?: number;
          search_language?: string;
          search_mode?: string;
          search_term?: string;
          search_translation?: string;
        };
        Returns: {
          book_slug: string;
          book_title: string;
          canto_number: number;
          chapter_number: number;
          meaning: string;
          term: string;
          total_count: number;
          verse_id: string;
          verse_link: string;
          verse_number: string;
        }[];
      };
      search_quotes: {
        Args: {
          p_book_slug?: string;
          p_category_slug?: string;
          p_limit?: number;
          p_offset?: number;
          p_query: string;
          p_source_type?: string;
        };
        Returns: {
          book_slug: string;
          categories: string[];
          chapter_number: number;
          id: string;
          page_title: string;
          rank: number;
          source_reference: string;
          source_type: string;
          text_en: string;
          text_uk: string;
          verse_number: string;
        }[];
      };
      search_sanskrit_by_meaning: {
        Args: { result_limit?: number; search_term: string };
        Returns: {
          grammar: string;
          id: number;
          meanings: string;
          relevance: number;
          word: string;
          word_devanagari: string;
        }[];
      };
      search_sanskrit_fuzzy: {
        Args: {
          grammar_filter?: string;
          result_limit?: number;
          search_term: string;
          similarity_threshold?: number;
        };
        Returns: {
          grammar: string;
          id: number;
          meanings: string;
          preverbs: string;
          similarity: number;
          word: string;
          word_devanagari: string;
        }[];
      };
      search_sanskrit_lexicon: {
        Args: {
          grammar_filter?: string;
          result_limit?: number;
          search_mode?: string;
          search_term: string;
        };
        Returns: {
          grammar: string;
          id: number;
          meanings: string;
          preverbs: string;
          relevance: number;
          word: string;
          word_devanagari: string;
        }[];
      };
      search_suggest_terms: {
        Args: {
          language_code?: string;
          limit_count?: number;
          search_prefix: string;
        };
        Returns: {
          frequency: number;
          source: string;
          suggestion: string;
        }[];
      };
      search_synonyms:
        | {
            Args: {
              limit_count?: number;
              offset_count?: number;
              search_language?: string;
              search_mode?: string;
              search_term: string;
            };
            Returns: {
              book_slug: string;
              book_title: string;
              canto_number: number;
              chapter_number: number;
              match_rank: number;
              sanskrit: string;
              synonyms: string;
              translation: string;
              transliteration: string;
              verse_id: string;
              verse_number: string;
            }[];
          }
        | {
            Args: {
              book_filter?: string;
              canto_filter?: number;
              limit_results?: number;
              search_language?: string;
              search_term: string;
            };
            Returns: {
              book_id: string;
              canto_number: number;
              chapter_number: number;
              rank: number;
              synonyms: string;
              translation: string;
              verse_id: string;
              verse_number: string;
            }[];
          };
      search_synonyms_with_canto: {
        Args: {
          book_filter?: string;
          canto_filter?: number;
          chapter_filter?: number;
          limit_results?: number;
          search_language?: string;
          search_term: string;
        };
        Returns: {
          book_id: string;
          canto_number: number;
          chapter_number: number;
          rank: number;
          synonyms: string;
          translation: string;
          verse_id: string;
          verse_number: string;
        }[];
      };
      search_tattvas: {
        Args: { p_query: string };
        Returns: {
          category: string;
          description_en: string;
          description_uk: string;
          id: string;
          name_en: string;
          name_sanskrit: string;
          name_uk: string;
          parent_id: string;
          parent_slug: string;
          slug: string;
          verses_count: number;
        }[];
      };
      search_verses_fulltext:
        | {
            Args: {
              book_ids?: string[];
              include_commentary: boolean;
              include_sanskrit: boolean;
              include_synonyms: boolean;
              include_translation: boolean;
              include_transliteration: boolean;
              language_code: string;
              limit_count?: number;
              search_query: string;
            };
            Returns: {
              book_id: string;
              book_slug: string;
              book_title: string;
              canto_id: string;
              canto_number: number;
              canto_title: string;
              chapter_id: string;
              chapter_number: number;
              chapter_title: string;
              commentary: string;
              matched_in: string[];
              relevance_rank: number;
              sanskrit: string;
              search_snippet: string;
              synonyms: string;
              translation: string;
              transliteration: string;
              verse_id: string;
              verse_number: string;
            }[];
          }
        | {
            Args: {
              book_filter?: string;
              canto_filter?: number;
              chapter_filter?: number;
              language_code?: string;
              limit_results?: number;
              offset_results?: number;
              search_term: string;
            };
            Returns: {
              book_id: string;
              canto_number: number;
              chapter_number: number;
              devanagari: string;
              headline_text: string;
              headline_translation: string;
              id: string;
              purport: string;
              rank: number;
              synonyms: string;
              translation: string;
              verse_number: string;
              verse_text: string;
            }[];
          };
      semantic_search_verses: {
        Args: {
          match_count?: number;
          match_threshold?: number;
          query_embedding: string;
        };
        Returns: {
          book_slug: string;
          chapter_id: string;
          commentary_en: string;
          commentary_uk: string;
          id: string;
          similarity: number;
          translation_en: string;
          translation_uk: string;
          verse_number: string;
        }[];
      };
      show_limit: { Args: never; Returns: number };
      show_trgm: { Args: { "": string }; Returns: string[] };
      slugify: { Args: { "": string }; Returns: string };
      unaccent: { Args: { "": string }; Returns: string };
      unified_search:
        | {
            Args: {
              language_code?: string;
              limit_per_type?: number;
              overall_limit?: number;
              search_query: string;
              search_types?: string[];
            };
            Returns: {
              href: string;
              matched_in: string[];
              relevance: number;
              result_id: string;
              result_type: string;
              snippet: string;
              subtitle: string;
              title: string;
            }[];
          }
        | {
            Args: {
              language_code?: string;
              limit_per_type?: number;
              search_query: string;
              search_types?: string[];
            };
            Returns: {
              href: string;
              matched_in: string[];
              relevance: number;
              result_id: string;
              result_type: string;
              snippet: string;
              subtitle: string;
              title: string;
            }[];
          };
      update_intro_chapters_order: {
        Args: { p_items: Json };
        Returns: undefined;
      };
      upsert_learning_activity: {
        Args: {
          p_correct?: number;
          p_reviews?: number;
          p_time?: number;
          p_user_id: string;
          p_verses?: number;
          p_words?: number;
        };
        Returns: undefined;
      };
      upsert_sadhana_daily: {
        Args: {
          p_bed_time?: string;
          p_entry_date: string;
          p_japa_after_1800?: number;
          p_japa_before_1000?: number;
          p_japa_before_1800?: number;
          p_japa_before_730?: number;
          p_kirtan_minutes?: number;
          p_lections_attended?: boolean;
          p_notes?: string;
          p_reading_minutes?: number;
          p_service_done?: boolean;
          p_user_id: string;
          p_wake_up_time?: string;
          p_yoga_done?: boolean;
        };
        Returns: {
          bed_time: string | null;
          completion_percent: number | null;
          created_at: string | null;
          entry_date: string;
          id: string;
          japa_after_1800: number | null;
          japa_before_1000: number | null;
          japa_before_1800: number | null;
          japa_before_730: number | null;
          japa_total: number | null;
          kirtan_minutes: number | null;
          lections_attended: boolean | null;
          notes: string | null;
          reading_minutes: number | null;
          service_done: boolean | null;
          updated_at: string | null;
          user_id: string;
          wake_up_time: string | null;
          yoga_done: boolean | null;
        };
        SetofOptions: {
          from: "*";
          to: "user_sadhana_daily";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
    };
    Enums: {
      app_role: "admin" | "editor" | "user";
      audio_event_type: "play" | "pause" | "complete" | "skip";
      chapter_type: "verses" | "text";
      daily_quote_type: "verse" | "custom";
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
        | "Other";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

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
} as const;
