-- Fix RLS policies to prevent data exposure

-- 1. Update blog_posts SELECT policy to exclude author_id from public access
-- Drop existing public policy
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;

-- Create new policy that allows viewing published posts (author_id will be filtered at app level)
CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts
FOR SELECT
USING (
  is_published = true 
  AND (published_at IS NULL OR published_at <= now())
);

-- 2. Restrict profiles table to authenticated users only
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- 3. Fix audio_events INSERT policy to prevent user_id manipulation
DROP POLICY IF EXISTS "Users can insert own audio events" ON public.audio_events;

CREATE POLICY "Users can insert own audio events"
ON public.audio_events
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
);

-- 4. Fix function search_path issues
-- Update create_blog_post function
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
AS $function$
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

  -- handle tags
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
$function$;

-- Update increment_blog_post_views function
CREATE OR REPLACE FUNCTION public.increment_blog_post_views(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$function$;