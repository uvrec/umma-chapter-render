-- ============================================================================
-- Blog Posts: RPC пошук + RLS обмеження
-- ============================================================================
-- 1. Створюємо RPC функцію для повнотекстового пошуку
-- 2. Додаємо RLS політики для обмеження прямого доступу до blog_posts

BEGIN;

-- ============================================================================
-- КРОК 1: RPC функція для пошуку blog posts
-- ============================================================================

DROP FUNCTION IF EXISTS public.search_blog_posts(TEXT, TEXT, INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION public.search_blog_posts(
  q TEXT,
  lang TEXT DEFAULT 'uk',
  limit_count INTEGER DEFAULT 10,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  title TEXT,
  excerpt TEXT,
  cover_image_url TEXT,
  featured_image TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  view_count INTEGER,
  read_time INTEGER,
  category_id UUID,
  tags TEXT[],
  author_display_name TEXT,
  rank REAL
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
AS $$
DECLARE
  search_query tsquery;
BEGIN
  -- Створюємо пошуковий запит
  search_query := websearch_to_tsquery('simple', q);

  IF lang = 'uk' THEN
    RETURN QUERY
    SELECT
      bp.id,
      bp.slug,
      bp.title_uk AS title,
      bp.excerpt_uk AS excerpt,
      bp.cover_image_url,
      bp.featured_image,
      bp.published_at,
      bp.created_at,
      bp.view_count,
      bp.read_time,
      bp.category_id,
      bp.tags,
      bp.author_display_name,
      ts_rank(bp.search_vector_uk, search_query) AS rank
    FROM public.blog_posts bp
    WHERE bp.is_published = true
      AND (bp.published_at IS NULL OR bp.published_at <= NOW())
      AND bp.search_vector_uk @@ search_query
    ORDER BY rank DESC, bp.published_at DESC NULLS LAST
    LIMIT limit_count
    OFFSET offset_count;
  ELSIF lang = 'en' THEN
    RETURN QUERY
    SELECT
      bp.id,
      bp.slug,
      bp.title_en AS title,
      bp.excerpt_en AS excerpt,
      bp.cover_image_url,
      bp.featured_image,
      bp.published_at,
      bp.created_at,
      bp.view_count,
      bp.read_time,
      bp.category_id,
      bp.tags,
      bp.author_display_name,
      ts_rank(bp.search_vector_en, search_query) AS rank
    FROM public.blog_posts bp
    WHERE bp.is_published = true
      AND (bp.published_at IS NULL OR bp.published_at <= NOW())
      AND bp.search_vector_en @@ search_query
    ORDER BY rank DESC, bp.published_at DESC NULLS LAST
    LIMIT limit_count
    OFFSET offset_count;
  ELSE
    -- Пошук по обох мовах
    RETURN QUERY
    SELECT
      bp.id,
      bp.slug,
      COALESCE(bp.title_uk, bp.title_en) AS title,
      COALESCE(bp.excerpt_uk, bp.excerpt_en) AS excerpt,
      bp.cover_image_url,
      bp.featured_image,
      bp.published_at,
      bp.created_at,
      bp.view_count,
      bp.read_time,
      bp.category_id,
      bp.tags,
      bp.author_display_name,
      GREATEST(
        ts_rank(bp.search_vector_uk, search_query),
        ts_rank(bp.search_vector_en, search_query)
      ) AS rank
    FROM public.blog_posts bp
    WHERE bp.is_published = true
      AND (bp.published_at IS NULL OR bp.published_at <= NOW())
      AND (bp.search_vector_uk @@ search_query OR bp.search_vector_en @@ search_query)
    ORDER BY rank DESC, bp.published_at DESC NULLS LAST
    LIMIT limit_count
    OFFSET offset_count;
  END IF;
END;
$$;

COMMENT ON FUNCTION public.search_blog_posts IS 'Full-text search for blog posts with language support (uk, en, or both)';

-- Надаємо доступ до функції
GRANT EXECUTE ON FUNCTION public.search_blog_posts TO anon;
GRANT EXECUTE ON FUNCTION public.search_blog_posts TO authenticated;

-- ============================================================================
-- КРОК 2: RLS обмеження на blog_posts
-- ============================================================================

-- Відкликаємо прямий SELECT від anon/authenticated
REVOKE SELECT ON public.blog_posts FROM anon;
REVOKE SELECT ON public.blog_posts FROM authenticated;

-- Надаємо SELECT тільки через VIEW
GRANT SELECT ON public.blog_posts_public TO anon;
GRANT SELECT ON public.blog_posts_public TO authenticated;

-- Адміни/редактори мають повний доступ до таблиці
-- (це вже налаштовано через RLS політики)

-- ============================================================================
-- КРОК 3: Функція для підрахунку результатів пошуку
-- ============================================================================

DROP FUNCTION IF EXISTS public.count_blog_search_results(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.count_blog_search_results(
  q TEXT,
  lang TEXT DEFAULT 'uk'
)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
AS $$
DECLARE
  search_query tsquery;
  result_count INTEGER;
BEGIN
  search_query := websearch_to_tsquery('simple', q);

  IF lang = 'uk' THEN
    SELECT COUNT(*) INTO result_count
    FROM public.blog_posts bp
    WHERE bp.is_published = true
      AND (bp.published_at IS NULL OR bp.published_at <= NOW())
      AND bp.search_vector_uk @@ search_query;
  ELSIF lang = 'en' THEN
    SELECT COUNT(*) INTO result_count
    FROM public.blog_posts bp
    WHERE bp.is_published = true
      AND (bp.published_at IS NULL OR bp.published_at <= NOW())
      AND bp.search_vector_en @@ search_query;
  ELSE
    SELECT COUNT(*) INTO result_count
    FROM public.blog_posts bp
    WHERE bp.is_published = true
      AND (bp.published_at IS NULL OR bp.published_at <= NOW())
      AND (bp.search_vector_uk @@ search_query OR bp.search_vector_en @@ search_query);
  END IF;

  RETURN result_count;
END;
$$;

COMMENT ON FUNCTION public.count_blog_search_results IS 'Count total search results for pagination';

GRANT EXECUTE ON FUNCTION public.count_blog_search_results TO anon;
GRANT EXECUTE ON FUNCTION public.count_blog_search_results TO authenticated;

COMMIT;

-- ============================================================================
-- Приклади використання:
-- ============================================================================
--
-- Пошук українською:
-- SELECT * FROM search_blog_posts('Крішна свідомість', 'uk', 10, 0);
--
-- Пошук англійською:
-- SELECT * FROM search_blog_posts('krishna consciousness', 'en', 10, 0);
--
-- Пошук по обох мовах:
-- SELECT * FROM search_blog_posts('mantra', 'all', 10, 0);
--
-- Підрахунок результатів для пагінації:
-- SELECT count_blog_search_results('Крішна', 'uk');
