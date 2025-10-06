-- Create a public view of blog posts that excludes author_id for security
-- This prevents correlation of blog posts with user account IDs
CREATE OR REPLACE VIEW public.blog_posts_public AS
SELECT 
  id,
  title_ua,
  title_en,
  slug,
  content_ua,
  content_en,
  excerpt_ua,
  excerpt_en,
  cover_image_url,
  featured_image,
  video_url,
  audio_url,
  instagram_embed_url,
  telegram_embed_url,
  substack_embed_url,
  meta_description_ua,
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
  read_time,
  search_vector
FROM public.blog_posts
WHERE is_published = true 
  AND (published_at IS NULL OR published_at <= now());

-- Grant access to the view
GRANT SELECT ON public.blog_posts_public TO authenticated;
GRANT SELECT ON public.blog_posts_public TO anon;

-- Add comment explaining the security measure
COMMENT ON VIEW public.blog_posts_public IS 
'Public view of blog posts that excludes author_id to prevent correlation with user accounts. Use this view for public-facing queries instead of the blog_posts table directly.';