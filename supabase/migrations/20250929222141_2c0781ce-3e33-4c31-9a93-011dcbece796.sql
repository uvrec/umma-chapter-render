-- Extend blog_posts table with new fields
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS featured_image text,
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS audio_url text,
ADD COLUMN IF NOT EXISTS read_time integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS scheduled_publish_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS meta_description_uk text,
ADD COLUMN IF NOT EXISTS meta_description_en text,
ADD COLUMN IF NOT EXISTS instagram_embed_url text,
ADD COLUMN IF NOT EXISTS telegram_embed_url text,
ADD COLUMN IF NOT EXISTS substack_embed_url text,
ADD COLUMN IF NOT EXISTS tags text[];

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_uk text NOT NULL,
  name_en text NOT NULL,
  slug text UNIQUE NOT NULL,
  description_uk text,
  description_en text,
  post_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_uk text NOT NULL,
  name_en text NOT NULL,
  slug text UNIQUE NOT NULL,
  post_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Create blog_post_tags junction table
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Add category_id to blog_posts
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES blog_categories(id);

-- Enable RLS on new tables
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_categories
CREATE POLICY "Anyone can view categories"
ON blog_categories FOR SELECT
USING (true);

CREATE POLICY "Admins can manage categories"
ON blog_categories FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for blog_tags
CREATE POLICY "Anyone can view tags"
ON blog_tags FOR SELECT
USING (true);

CREATE POLICY "Admins can manage tags"
ON blog_tags FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for blog_post_tags
CREATE POLICY "Anyone can view post tags"
ON blog_post_tags FOR SELECT
USING (true);

CREATE POLICY "Admins can manage post tags"
ON blog_post_tags FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update existing blog_posts RLS policy to include is_published check
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
CREATE POLICY "Anyone can view published blog posts"
ON blog_posts FOR SELECT
USING (is_published = true AND (published_at IS NULL OR published_at <= now()));

-- Create storage bucket for blog media
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-media', 'blog-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog-media bucket
CREATE POLICY "Anyone can view blog media"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-media');

CREATE POLICY "Admins can upload blog media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blog media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blog media"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-media' AND has_role(auth.uid(), 'admin'::app_role));