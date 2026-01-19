-- Fix the view to use SECURITY INVOKER mode
-- This ensures the view respects RLS policies and runs with the querying user's permissions
-- Note: search_vector columns are added later in migration 20251228120000
DROP VIEW IF EXISTS public.blog_posts_public;

CREATE VIEW public.blog_posts_public
WITH (security_invoker=on) AS
SELECT
  id,
  title_uk,
  title_en,
  slug,
  content_uk,
  content_en,
  excerpt_uk,
  excerpt_en,
  cover_image_url,
  featured_image,
  video_url,
  audio_url,
  instagram_embed_url,
  telegram_embed_url,
  substack_embed_url,
  meta_description_uk,
  meta_description_en,
  author_display_name,  -- Safe to expose: display name only, not the actual user ID
  category_id,
  tags,
  is_published,
  published_at,
  scheduled_publish_at,
  created_at,
  updated_at,
  view_count,
  read_time
FROM public.blog_posts
WHERE is_published = true
  AND (published_at IS NULL OR published_at <= now());

-- Grant access to the view
GRANT SELECT ON public.blog_posts_public TO authenticated;
GRANT SELECT ON public.blog_posts_public TO anon;

-- Add comment explaining the security measure
COMMENT ON VIEW public.blog_posts_public IS
'Public view of blog posts that excludes author_id to prevent correlation with user accounts. Uses SECURITY INVOKER to respect RLS policies. Use this view for public-facing queries instead of the blog_posts table directly.';
