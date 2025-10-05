-- Create profiles table to store public user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view profiles (only display_name and avatar_url are public)
CREATE POLICY "Anyone can view profiles"
ON public.profiles
FOR SELECT
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Add trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add author_display_name column to blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS author_display_name text;

-- Rename author to author_id for clarity (this is internal UUID)
ALTER TABLE public.blog_posts 
RENAME COLUMN author TO author_id;

-- Update existing posts to populate author_display_name with a default
UPDATE public.blog_posts 
SET author_display_name = 'Anonymous'
WHERE author_display_name IS NULL;

-- Update the trigger function to set both author_id and author_display_name
CREATE OR REPLACE FUNCTION public.set_blog_post_author()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_display_name text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Set author_id to current user
    NEW.author_id := (SELECT auth.uid())::text;
    
    -- Get display name from profiles, fallback to email or 'Anonymous'
    SELECT display_name INTO user_display_name
    FROM public.profiles
    WHERE id = auth.uid();
    
    IF user_display_name IS NULL THEN
      -- Fallback to email prefix if no display name set
      SELECT split_part(email, '@', 1) INTO user_display_name
      FROM auth.users
      WHERE id = auth.uid();
    END IF;
    
    NEW.author_display_name := COALESCE(user_display_name, 'Anonymous');
    
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Update RLS policies to use author_id instead of author
DROP POLICY IF EXISTS "blog_posts_insert_authenticated" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_modify_author_only" ON public.blog_posts;

CREATE POLICY "blog_posts_insert_authenticated"
ON public.blog_posts
FOR INSERT
WITH CHECK (((SELECT auth.uid())::text = author_id));

CREATE POLICY "blog_posts_modify_author_only"
ON public.blog_posts
FOR ALL
USING (((SELECT auth.uid())::text = author_id))
WITH CHECK (((SELECT auth.uid())::text = author_id));

-- Update create_blog_post function to handle new schema
CREATE OR REPLACE FUNCTION public.create_blog_post(
  _title_ua text,
  _title_en text,
  _content_ua text,
  _content_en text,
  _excerpt_ua text DEFAULT NULL,
  _excerpt_en text DEFAULT NULL,
  _category_id uuid DEFAULT NULL,
  _tags text[] DEFAULT NULL,
  _is_published boolean DEFAULT false,
  _scheduled_publish_at timestamp with time zone DEFAULT NULL,
  _cover_image_url text DEFAULT NULL,
  _video_url text DEFAULT NULL,
  _audio_url text DEFAULT NULL
)
RETURNS blog_posts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _slug text;
  _post public.blog_posts%ROWTYPE;
  _tag text;
  _tag_id uuid;
  cnt int := 0;
  base_slug text;
  tmp_slug text;
  user_display_name text;
BEGIN
  -- generate slug from title_en if provided, else title_ua
  IF coalesce(_title_en, '') <> '' THEN
    _slug := slugify(_title_en);
  ELSE
    _slug := slugify(_title_ua);
  END IF;

  -- ensure unique slug by appending counter if needed
  base_slug := _slug;
  LOOP
    tmp_slug := CASE WHEN cnt = 0 THEN base_slug ELSE base_slug || '-' || cnt::text END;
    EXIT WHEN NOT EXISTS(SELECT 1 FROM public.blog_posts WHERE slug = tmp_slug);
    cnt := cnt + 1;
  END LOOP;
  _slug := tmp_slug;

  -- Get author display name
  SELECT display_name INTO user_display_name
  FROM public.profiles
  WHERE id = auth.uid();
  
  IF user_display_name IS NULL THEN
    SELECT split_part(email, '@', 1) INTO user_display_name
    FROM auth.users
    WHERE id = auth.uid();
  END IF;

  -- insert post
  INSERT INTO public.blog_posts(
    title_ua, title_en, content_ua, content_en, excerpt_ua, excerpt_en,
    category_id, is_published, scheduled_publish_at, cover_image_url,
    video_url, audio_url, slug, published_at, author_id, author_display_name
  ) VALUES (
    _title_ua, _title_en, _content_ua, _content_en, _excerpt_ua, _excerpt_en,
    _category_id, _is_published, _scheduled_publish_at, _cover_image_url,
    _video_url, _audio_url, _slug, 
    CASE WHEN _is_published THEN now() ELSE NULL END,
    auth.uid()::text,
    COALESCE(user_display_name, 'Anonymous')
  ) RETURNING * INTO _post;

  -- handle tags (existing logic)
  IF _tags IS NOT NULL THEN
    FOREACH _tag IN ARRAY _tags LOOP
      _tag := slugify(coalesce(_tag, ''));
      IF _tag = '' THEN
        CONTINUE;
      END IF;
      SELECT id INTO _tag_id FROM public.blog_tags WHERE slug = _tag FOR UPDATE;
      IF NOT FOUND THEN
        INSERT INTO public.blog_tags(name_en, slug, post_count, created_at)
        VALUES (_tag, _tag, 1, now()) RETURNING id INTO _tag_id;
      ELSE
        UPDATE public.blog_tags SET post_count = coalesce(post_count,0) + 1 WHERE id = _tag_id;
      END IF;
      BEGIN
        INSERT INTO public.blog_post_tags(post_id, tag_id) VALUES (_post.id, _tag_id);
      EXCEPTION WHEN unique_violation THEN
        NULL;
      END;
    END LOOP;
  END IF;

  -- update category post_count if category provided
  IF _category_id IS NOT NULL THEN
    UPDATE public.blog_categories SET post_count = coalesce(post_count,0) + 1 WHERE id = _category_id;
  END IF;

  RETURN _post;
END;
$$;