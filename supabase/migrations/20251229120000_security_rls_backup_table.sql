-- ============================================================================
-- БЕЗПЕЧНА МІГРАЦІЯ: Security Fixes - RLS на backup таблиці + security_invoker views
-- ============================================================================
-- Гібридний підхід: найкраще з обох варіантів
-- Виконується в транзакції для атомарності

BEGIN;

-- ============================================================================
-- КРОК 0: Перевірка prerequisites
-- ============================================================================
DO $$
BEGIN
  -- Перевірка, що функція has_role існує
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = 'has_role' AND n.nspname = 'public'
  ) THEN
    RAISE EXCEPTION 'ABORT: Function public.has_role does not exist! Please create it first.';
  END IF;

  -- Перевірка версії Postgres (для security_invoker потрібно 15+)
  IF current_setting('server_version_num')::int < 150000 THEN
    RAISE WARNING 'Postgres version < 15 detected. security_invoker may not work as expected.';
  END IF;

  RAISE NOTICE 'Prerequisites OK: has_role function exists, Postgres version: %', current_setting('server_version');
END $$;

-- ============================================================================
-- КРОК 1: RLS на backup таблиці verses_backup_danda_fix
-- ============================================================================
DO $$
BEGIN
  -- Перевіряємо чи таблиця існує
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'verses_backup_danda_fix'
  ) THEN
    -- Вмикаємо RLS
    ALTER TABLE public.verses_backup_danda_fix ENABLE ROW LEVEL SECURITY;

    -- Відкликаємо доступ від PUBLIC (безпечніше)
    REVOKE ALL ON public.verses_backup_danda_fix FROM PUBLIC;

    -- Надаємо доступ authenticated (політики RLS далі обмежать до адмінів)
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.verses_backup_danda_fix TO authenticated;

    -- Видаляємо старі політики
    DROP POLICY IF EXISTS "Admin only access to backup" ON public.verses_backup_danda_fix;
    DROP POLICY IF EXISTS "Admins can access backup table" ON public.verses_backup_danda_fix;
    DROP POLICY IF EXISTS "verses_backup_danda_fix_admin_read" ON public.verses_backup_danda_fix;
    DROP POLICY IF EXISTS "verses_backup_danda_fix_admin_write" ON public.verses_backup_danda_fix;

    -- Окремі політики для кожної операції (чіткіше для аудиту)
    CREATE POLICY "verses_backup_danda_fix_admin_read"
      ON public.verses_backup_danda_fix
      FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role));

    CREATE POLICY "verses_backup_danda_fix_admin_insert"
      ON public.verses_backup_danda_fix
      FOR INSERT
      TO authenticated
      WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

    CREATE POLICY "verses_backup_danda_fix_admin_update"
      ON public.verses_backup_danda_fix
      FOR UPDATE
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role))
      WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

    CREATE POLICY "verses_backup_danda_fix_admin_delete"
      ON public.verses_backup_danda_fix
      FOR DELETE
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role));

    -- Коментарі для аудиту
    COMMENT ON POLICY "verses_backup_danda_fix_admin_read" ON public.verses_backup_danda_fix
      IS 'Admin-only SELECT via public.has_role(auth.uid(), admin)';
    COMMENT ON POLICY "verses_backup_danda_fix_admin_insert" ON public.verses_backup_danda_fix
      IS 'Admin-only INSERT via public.has_role(auth.uid(), admin)';
    COMMENT ON POLICY "verses_backup_danda_fix_admin_update" ON public.verses_backup_danda_fix
      IS 'Admin-only UPDATE via public.has_role(auth.uid(), admin)';
    COMMENT ON POLICY "verses_backup_danda_fix_admin_delete" ON public.verses_backup_danda_fix
      IS 'Admin-only DELETE via public.has_role(auth.uid(), admin)';

    RAISE NOTICE 'Step 1 complete: RLS enabled on verses_backup_danda_fix with granular policies';
  ELSE
    RAISE NOTICE 'Table verses_backup_danda_fix does not exist, skipping...';
  END IF;
END $$;

-- ============================================================================
-- КРОК 2: Індекси для продуктивності
-- ============================================================================

-- 2.1 Partial index для фільтрів is_published/deleted_at у views
CREATE INDEX IF NOT EXISTS idx_verses_published_not_deleted
  ON public.verses (is_published, deleted_at)
  WHERE is_published = true AND deleted_at IS NULL;

COMMENT ON INDEX idx_verses_published_not_deleted IS 'Partial index for filtering published and non-deleted verses';

-- 2.2 Індекс для швидкої перевірки ролей у RLS політиках
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role
  ON public.user_roles (user_id, role);

COMMENT ON INDEX idx_user_roles_user_role IS 'Index for RLS policy performance (has_role function)';

-- ============================================================================
-- КРОК 3: Оновлення views з security_invoker = true
-- ============================================================================

-- 3.1 verses_with_synonyms (додаємо security_invoker)
DROP VIEW IF EXISTS public.verses_with_synonyms;
CREATE VIEW public.verses_with_synonyms
WITH (security_invoker = true)
AS
SELECT
  v.id,
  b.slug AS book_slug,
  b.title_ua,
  b.title_en,
  c.chapter_number,
  v.verse_number,
  v.sanskrit,
  v.transliteration_ua,
  v.transliteration_en,
  v.synonyms_ua,
  v.synonyms_en,
  v.translation_ua,
  v.translation_en
FROM verses v
INNER JOIN chapters c ON v.chapter_id = c.id
INNER JOIN books b ON c.book_id = b.id
WHERE v.is_published = true
  AND v.deleted_at IS NULL
  AND (v.synonyms_ua IS NOT NULL OR v.synonyms_en IS NOT NULL);

COMMENT ON VIEW public.verses_with_synonyms IS 'Published verses with synonyms - uses SECURITY INVOKER for RLS';

-- 3.2 verses_with_structure (додаємо фільтр is_published та deleted_at)
DROP VIEW IF EXISTS public.verses_with_structure;
CREATE VIEW public.verses_with_structure
WITH (security_invoker = true)
AS
SELECT
  v.id,
  v.chapter_id,
  v.verse_number,
  v.display_blocks,
  (v.sanskrit IS NOT NULL AND LENGTH(TRIM(v.sanskrit)) > 0)
    OR (v.sanskrit_ua IS NOT NULL AND LENGTH(TRIM(v.sanskrit_ua)) > 0)
    OR (v.sanskrit_en IS NOT NULL AND LENGTH(TRIM(v.sanskrit_en)) > 0) AS has_sanskrit,
  (v.transliteration IS NOT NULL AND LENGTH(TRIM(v.transliteration)) > 0)
    OR (v.transliteration_ua IS NOT NULL AND LENGTH(TRIM(v.transliteration_ua)) > 0)
    OR (v.transliteration_en IS NOT NULL AND LENGTH(TRIM(v.transliteration_en)) > 0) AS has_transliteration,
  (v.synonyms_ua IS NOT NULL AND LENGTH(TRIM(v.synonyms_ua)) > 0)
    OR (v.synonyms_en IS NOT NULL AND LENGTH(TRIM(v.synonyms_en)) > 0) AS has_synonyms,
  (v.translation_ua IS NOT NULL AND LENGTH(TRIM(v.translation_ua)) > 0)
    OR (v.translation_en IS NOT NULL AND LENGTH(TRIM(v.translation_en)) > 0) AS has_translation,
  (v.commentary_ua IS NOT NULL AND LENGTH(TRIM(v.commentary_ua)) > 0)
    OR (v.commentary_en IS NOT NULL AND LENGTH(TRIM(v.commentary_en)) > 0) AS has_commentary,
  CASE
    WHEN (v.sanskrit IS NOT NULL OR v.sanskrit_ua IS NOT NULL OR v.sanskrit_en IS NOT NULL)
      AND (v.transliteration IS NOT NULL OR v.transliteration_ua IS NOT NULL OR v.transliteration_en IS NOT NULL)
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
  END AS detected_structure
FROM public.verses v
WHERE v.deleted_at IS NULL
  AND v.is_published = true;

COMMENT ON VIEW public.verses_with_structure IS 'Verse structure analysis - uses SECURITY INVOKER for RLS, filters unpublished';

-- 3.3 verses_with_metadata (створюємо з фільтрами!)
DROP VIEW IF EXISTS public.verses_with_metadata;
CREATE VIEW public.verses_with_metadata
WITH (security_invoker = true)
AS
SELECT
  v.id,
  v.chapter_id,
  v.verse_number,
  v.verse_number_sort,
  v.sanskrit,
  v.sanskrit_ua,
  v.sanskrit_en,
  v.transliteration,
  v.transliteration_ua,
  v.transliteration_en,
  v.synonyms_ua,
  v.synonyms_en,
  v.translation_ua,
  v.translation_en,
  v.commentary_ua,
  v.commentary_en,
  v.audio_url,
  v.display_blocks,
  v.search_vector,
  v.is_published,
  v.is_composite,
  v.start_verse,
  v.end_verse,
  v.verse_start,
  v.verse_end,
  v.verse_count,
  v.verse_suffix,
  v.sort_key,
  v.deleted_at,
  v.created_at,
  c.chapter_number,
  c.title_ua AS chapter_title_ua,
  c.title_en AS chapter_title_en,
  b.slug AS book_slug,
  CASE
    WHEN v.is_composite = true THEN 'composite'
    WHEN v.verse_suffix IS NOT NULL THEN 'sub-verse'
    ELSE 'standard'
  END AS verse_type_display
FROM verses v
JOIN chapters c ON v.chapter_id = c.id
JOIN books b ON c.book_id = b.id
WHERE v.deleted_at IS NULL
  AND v.is_published = true;

COMMENT ON VIEW public.verses_with_metadata IS 'Verses with chapter/book info - uses SECURITY INVOKER for RLS, filters unpublished';

-- 3.4 books_with_mapping (вже має security_invoker, перевіряємо)
DROP VIEW IF EXISTS public.books_with_mapping;
CREATE VIEW public.books_with_mapping
WITH (security_invoker = true)
AS
SELECT
  b.id,
  b.slug AS our_slug,
  b.vedabase_slug,
  b.gitabase_slug,
  b.title_ua,
  b.title_en,
  b.has_cantos,
  b.default_structure,
  (SELECT COUNT(*) FROM public.cantos c WHERE c.book_id = b.id) AS cantos_count,
  (SELECT COUNT(*) FROM public.chapters ch WHERE ch.book_id = b.id) AS chapters_count,
  (SELECT COUNT(*) FROM public.verses v
   JOIN public.chapters ch ON v.chapter_id = ch.id
   WHERE ch.book_id = b.id AND v.deleted_at IS NULL AND v.is_published = true) AS verses_count
FROM public.books b
WHERE b.deleted_at IS NULL;

COMMENT ON VIEW public.books_with_mapping IS 'Books with chapter/verse counts - uses SECURITY INVOKER for RLS';

-- 3.5 readable_chapters (вже має security_invoker)
DROP VIEW IF EXISTS public.readable_chapters;
CREATE VIEW public.readable_chapters
WITH (security_invoker = true)
AS
SELECT
  c.id AS chapter_id,
  c.chapter_number,
  c.title_ua AS chapter_title_ua,
  c.title_en AS chapter_title_en,
  c.chapter_type,
  c.book_id,
  b.slug AS book_slug,
  b.title_ua AS book_title_ua,
  b.title_en AS book_title_en,
  COUNT(v.id) AS total_verses,
  COUNT(CASE
    WHEN (v.translation_ua IS NOT NULL AND LENGTH(TRIM(v.translation_ua)) > 0)
      OR (v.translation_en IS NOT NULL AND LENGTH(TRIM(v.translation_en)) > 0)
    THEN 1
  END) AS filled_verses,
  CASE
    WHEN COUNT(v.id) > 0 THEN
      ROUND((COUNT(CASE
        WHEN (v.translation_ua IS NOT NULL AND LENGTH(TRIM(v.translation_ua)) > 0)
          OR (v.translation_en IS NOT NULL AND LENGTH(TRIM(v.translation_en)) > 0)
        THEN 1
      END)::numeric / COUNT(v.id)::numeric) * 100, 2)
    ELSE 0
  END AS completion_percentage
FROM public.chapters c
LEFT JOIN public.books b ON c.book_id = b.id
LEFT JOIN public.verses v
  ON v.chapter_id = c.id
  AND v.deleted_at IS NULL
  AND v.is_published = true
WHERE c.chapter_type = 'verses'
  AND c.is_published = true
GROUP BY c.id, c.chapter_number, c.title_ua, c.title_en, c.chapter_type, c.book_id, b.slug, b.title_ua, b.title_en
HAVING COUNT(CASE
  WHEN (v.translation_ua IS NOT NULL AND LENGTH(TRIM(v.translation_ua)) > 0)
    OR (v.translation_en IS NOT NULL AND LENGTH(TRIM(v.translation_en)) > 0)
  THEN 1
END) > 0;

COMMENT ON VIEW public.readable_chapters IS 'Chapters with completion stats - uses SECURITY INVOKER for RLS';

-- 3.6 audio_track_daily_stats (вже має security_invoker)
DROP VIEW IF EXISTS public.audio_track_daily_stats;
CREATE VIEW public.audio_track_daily_stats
WITH (security_invoker = true)
AS
SELECT
  track_id,
  DATE(created_at AT TIME ZONE 'UTC') AS day_utc,
  COUNT(*) AS events_total,
  SUM(CASE WHEN event_type = 'play' THEN 1 ELSE 0 END) AS plays,
  SUM(CASE WHEN event_type = 'pause' THEN 1 ELSE 0 END) AS pauses,
  SUM(CASE WHEN event_type = 'skip' THEN 1 ELSE 0 END) AS skips,
  SUM(CASE WHEN event_type = 'complete' THEN 1 ELSE 0 END) AS completes,
  SUM(CASE WHEN event_type = 'complete' THEN duration_ms ELSE 0 END) AS completed_duration_ms,
  AVG(duration_ms) AS avg_track_duration_ms,
  MAX(created_at) AS last_event_at
FROM public.audio_events
GROUP BY track_id, DATE(created_at AT TIME ZONE 'UTC');

COMMENT ON VIEW public.audio_track_daily_stats IS 'Audio analytics by day - uses SECURITY INVOKER for RLS';

-- 3.7 blog_posts_public (вже має security_invoker)
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
  search_vector_ua,
  search_vector_en,
  featured_image,
  meta_description_en,
  meta_description_ua,
  telegram_embed_url,
  author_display_name,
  substack_embed_url,
  instagram_embed_url
FROM public.blog_posts
WHERE is_published = true;

COMMENT ON VIEW public.blog_posts_public IS 'Published blog posts - uses SECURITY INVOKER for RLS';

-- 3.8 book_pages_with_metadata (вже має security_invoker)
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
  b.slug AS book_slug,
  b.title_ua AS book_title_ua,
  b.title_en AS book_title_en,
  CASE
    WHEN bp.page_type = 'preface' THEN 'Передмова'
    WHEN bp.page_type = 'introduction' THEN 'Вступ'
    WHEN bp.page_type = 'conclusion' THEN 'Висновок'
    WHEN bp.page_type = 'appendix' THEN 'Додаток'
    ELSE bp.page_type
  END AS page_type_display
FROM public.book_pages bp
LEFT JOIN public.books b ON bp.book_id = b.id
WHERE bp.is_published = true;

COMMENT ON VIEW public.book_pages_with_metadata IS 'Book pages with book info - uses SECURITY INVOKER for RLS';

-- ============================================================================
-- Завершення транзакції
-- ============================================================================
COMMIT;

-- ============================================================================
-- Фінальна перевірка (поза транзакцією)
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Views recreated with security_invoker = true';
  RAISE NOTICE 'RLS enabled on backup tables';
  RAISE NOTICE '========================================';
END $$;
