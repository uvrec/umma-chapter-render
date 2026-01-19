-- Enable RLS on remaining backup tables (if they exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'chapters_backup_20251014') THEN
    ALTER TABLE public.chapters_backup_20251014 ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Only admins can access chapters_backup_20251014" ON public.chapters_backup_20251014;
    CREATE POLICY "Only admins can access chapters_backup_20251014"
    ON public.chapters_backup_20251014
    FOR ALL
    TO authenticated
    USING (has_role(auth.uid(), 'admin'::app_role));
    RAISE NOTICE 'RLS enabled on chapters_backup_20251014';
  ELSE
    RAISE NOTICE 'Table chapters_backup_20251014 does not exist, skipping...';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'verses_backup_20251014') THEN
    ALTER TABLE public.verses_backup_20251014 ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Only admins can access verses_backup_20251014" ON public.verses_backup_20251014;
    CREATE POLICY "Only admins can access verses_backup_20251014"
    ON public.verses_backup_20251014
    FOR ALL
    TO authenticated
    USING (has_role(auth.uid(), 'admin'::app_role));
    RAISE NOTICE 'RLS enabled on verses_backup_20251014';
  ELSE
    RAISE NOTICE 'Table verses_backup_20251014 does not exist, skipping...';
  END IF;
END $$;

-- Fix security definer views - recreate them as SECURITY INVOKER
-- These views should respect the RLS of the calling user, not bypass it

-- Drop and recreate audio_track_daily_stats view
DROP VIEW IF EXISTS public.audio_track_daily_stats;
CREATE VIEW public.audio_track_daily_stats
WITH (security_invoker = true)
AS
SELECT 
  track_id,
  DATE(created_at AT TIME ZONE 'UTC') as day_utc,
  COUNT(*) as events_total,
  SUM(CASE WHEN event_type = 'play' THEN 1 ELSE 0 END) as plays,
  SUM(CASE WHEN event_type = 'pause' THEN 1 ELSE 0 END) as pauses,
  SUM(CASE WHEN event_type = 'skip' THEN 1 ELSE 0 END) as skips,
  SUM(CASE WHEN event_type = 'complete' THEN 1 ELSE 0 END) as completes,
  SUM(CASE WHEN event_type = 'complete' THEN duration_ms ELSE 0 END) as completed_duration_ms,
  AVG(duration_ms) as avg_track_duration_ms,
  MAX(created_at) as last_event_at
FROM public.audio_events
GROUP BY track_id, DATE(created_at AT TIME ZONE 'UTC');

-- Drop and recreate blog_posts_public view
-- Note: search_vector columns are added later in migration 20251228120000
DROP VIEW IF EXISTS public.blog_posts_public;
CREATE VIEW public.blog_posts_public
WITH (security_invoker = true)
AS
SELECT
  id,
  slug,
  title_ua,
  title_en,
  content_ua,
  content_en,
  excerpt_ua,
  excerpt_en,
  cover_image_url,
  video_url,
  audio_url,
  category_id,
  tags,
  is_published,
  published_at,
  scheduled_publish_at,
  created_at,
  updated_at,
  view_count,
  read_time,
  featured_image,
  meta_description_en,
  meta_description_ua,
  telegram_embed_url,
  author_display_name,
  substack_embed_url,
  instagram_embed_url
FROM public.blog_posts
WHERE is_published = true;

-- Drop and recreate book_pages_with_metadata view (only if book_pages exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_pages') THEN
    DROP VIEW IF EXISTS public.book_pages_with_metadata;
    CREATE VIEW public.book_pages_with_metadata
    WITH (security_invoker = true)
    AS
    SELECT
      bp.id,
      bp.book_id,
      bp.page_type,
      bp.page_order,
      bp.slug,
      bp.title_ua,
      bp.title_en,
      bp.content_ua,
      bp.content_en,
      bp.is_published,
      bp.created_at,
      bp.updated_at,
      b.slug as book_slug,
      b.title_ua as book_title_ua,
      b.title_en as book_title_en,
      CASE
        WHEN bp.page_type = 'preface' THEN 'Передмова'
        WHEN bp.page_type = 'introduction' THEN 'Вступ'
        WHEN bp.page_type = 'conclusion' THEN 'Висновок'
        WHEN bp.page_type = 'appendix' THEN 'Додаток'
        ELSE bp.page_type
      END as page_type_display
    FROM public.book_pages bp
    LEFT JOIN public.books b ON bp.book_id = b.id;
    RAISE NOTICE 'Created book_pages_with_metadata view';
  ELSE
    RAISE NOTICE 'Table book_pages does not exist, skipping book_pages_with_metadata view...';
  END IF;
END $$;

-- Drop and recreate books_with_mapping view
-- Note: Using only core columns that definitely exist
DROP VIEW IF EXISTS public.books_with_mapping;
CREATE VIEW public.books_with_mapping
WITH (security_invoker = true)
AS
SELECT
  b.id,
  b.slug as our_slug,
  b.title_ua,
  b.title_en,
  (SELECT COUNT(*) FROM public.cantos c WHERE c.book_id = b.id) as cantos_count,
  (SELECT COUNT(*) FROM public.chapters ch WHERE ch.book_id = b.id) as chapters_count,
  (SELECT COUNT(*) FROM public.verses v
   JOIN public.chapters ch ON v.chapter_id = ch.id
   WHERE ch.book_id = b.id) as verses_count
FROM public.books b;

-- Drop and recreate readable_chapters view
DROP VIEW IF EXISTS public.readable_chapters;
CREATE VIEW public.readable_chapters
WITH (security_invoker = true)
AS
SELECT 
  c.id as chapter_id,
  c.chapter_number,
  c.title_ua as chapter_title_ua,
  c.title_en as chapter_title_en,
  c.chapter_type,
  c.book_id,
  b.slug as book_slug,
  b.title_ua as book_title_ua,
  b.title_en as book_title_en,
  COUNT(v.id) as total_verses,
  COUNT(CASE 
    WHEN (v.translation_ua IS NOT NULL AND LENGTH(TRIM(v.translation_ua)) > 0)
      OR (v.translation_en IS NOT NULL AND LENGTH(TRIM(v.translation_en)) > 0)
    THEN 1 
  END) as filled_verses,
  CASE 
    WHEN COUNT(v.id) > 0 THEN 
      ROUND((COUNT(CASE 
        WHEN (v.translation_ua IS NOT NULL AND LENGTH(TRIM(v.translation_ua)) > 0)
          OR (v.translation_en IS NOT NULL AND LENGTH(TRIM(v.translation_en)) > 0)
        THEN 1 
      END)::numeric / COUNT(v.id)::numeric) * 100, 2)
    ELSE 0 
  END as completion_percentage
FROM public.chapters c
LEFT JOIN public.books b ON c.book_id = b.id
LEFT JOIN public.verses v ON v.chapter_id = c.id
WHERE c.chapter_type = 'verses'
GROUP BY c.id, c.chapter_number, c.title_ua, c.title_en, c.chapter_type, c.book_id, b.slug, b.title_ua, b.title_en
HAVING COUNT(CASE 
  WHEN (v.translation_ua IS NOT NULL AND LENGTH(TRIM(v.translation_ua)) > 0)
    OR (v.translation_en IS NOT NULL AND LENGTH(TRIM(v.translation_en)) > 0)
  THEN 1 
END) > 0;

-- Drop and recreate verses_with_structure view
-- Note: Using actual column names from verses table schema
DROP VIEW IF EXISTS public.verses_with_structure;
CREATE VIEW public.verses_with_structure
WITH (security_invoker = true)
AS
SELECT
  v.id,
  v.chapter_id,
  v.verse_number,
  (v.sanskrit IS NOT NULL AND LENGTH(TRIM(v.sanskrit)) > 0) as has_sanskrit,
  (v.transliteration IS NOT NULL AND LENGTH(TRIM(v.transliteration)) > 0) as has_transliteration,
  (v.synonyms_ua IS NOT NULL AND LENGTH(TRIM(v.synonyms_ua)) > 0)
    OR (v.synonyms_en IS NOT NULL AND LENGTH(TRIM(v.synonyms_en)) > 0) as has_synonyms,
  (v.translation_ua IS NOT NULL AND LENGTH(TRIM(v.translation_ua)) > 0)
    OR (v.translation_en IS NOT NULL AND LENGTH(TRIM(v.translation_en)) > 0) as has_translation,
  (v.commentary_ua IS NOT NULL AND LENGTH(TRIM(v.commentary_ua)) > 0)
    OR (v.commentary_en IS NOT NULL AND LENGTH(TRIM(v.commentary_en)) > 0) as has_commentary,
  CASE
    WHEN v.sanskrit IS NOT NULL
      AND v.transliteration IS NOT NULL
      AND (v.synonyms_ua IS NOT NULL OR v.synonyms_en IS NOT NULL)
      AND (v.translation_ua IS NOT NULL OR v.translation_en IS NOT NULL)
      AND (v.commentary_ua IS NOT NULL OR v.commentary_en IS NOT NULL)
    THEN 'full'
    WHEN (v.translation_ua IS NOT NULL OR v.translation_en IS NOT NULL)
      AND (v.commentary_ua IS NOT NULL OR v.commentary_en IS NOT NULL)
    THEN 'translation_commentary'
    WHEN (v.translation_ua IS NOT NULL OR v.translation_en IS NOT NULL)
    THEN 'translation_only'
    ELSE 'incomplete'
  END as detected_structure
FROM public.verses v;