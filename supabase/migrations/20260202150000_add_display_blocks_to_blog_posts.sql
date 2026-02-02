-- Add display_blocks column to blog_posts table
-- This allows storing visibility settings for each block (sanskrit, transliteration, etc.)
-- in poetry mode blog posts

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS display_blocks JSONB DEFAULT '{"sanskrit": true, "transliteration": true, "synonyms": true, "translation": true, "commentary": true}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.blog_posts.display_blocks IS 'JSON object storing visibility settings for each block in poetry mode: {sanskrit, transliteration, synonyms, translation, commentary}';

-- Create index for better query performance (optional, for filtering by display settings)
CREATE INDEX IF NOT EXISTS idx_blog_posts_display_blocks ON public.blog_posts USING gin (display_blocks);
