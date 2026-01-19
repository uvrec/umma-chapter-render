-- Fix: Ensure blog_posts has search_vector columns before views are created
-- This fixes an issue where the view creation migration runs before the column addition

-- Add columns if they don't exist
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS search_vector_ua tsvector,
  ADD COLUMN IF NOT EXISTS search_vector_en tsvector;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_blog_posts_search_vector_ua
  ON public.blog_posts USING gin(search_vector_ua);
CREATE INDEX IF NOT EXISTS idx_blog_posts_search_vector_en
  ON public.blog_posts USING gin(search_vector_en);

-- Recreate the blog_posts_public view
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
