-- ============================================================================
-- Fix: Blog post triggers/functions still reference _ua columns after rename
-- Error: record "new" has no field "title_ua"
--
-- The columns were renamed from _ua to _uk, but trigger functions were not updated.
-- This migration fixes the update_blog_post_search_vector() trigger function
-- and also updates create_blog_post() function parameters for consistency.
--
-- HOW TO APPLY:
-- Copy this entire SQL and run it in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/qeplxgqadcbwlrbgydlb/sql/new
-- ============================================================================

-- ============================================================================
-- 1. FIX: update_blog_post_search_vector() trigger function
--    This is the cause of "record 'new' has no field 'title_ua'" error
-- ============================================================================

-- Drop existing trigger first
DROP TRIGGER IF EXISTS trg_blog_posts_search_vector ON public.blog_posts;

-- Recreate the function with correct _uk column names
CREATE OR REPLACE FUNCTION update_blog_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector_uk :=
    setweight(to_tsvector('simple', COALESCE(NEW.title_uk, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.excerpt_uk, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.content_uk, '')), 'C');

  NEW.search_vector_en :=
    setweight(to_tsvector('english', COALESCE(NEW.title_en, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.excerpt_en, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.content_en, '')), 'C');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger with correct column names
CREATE TRIGGER trg_blog_posts_search_vector
  BEFORE INSERT OR UPDATE OF title_uk, title_en, excerpt_uk, excerpt_en, content_uk, content_en
  ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_post_search_vector();

-- ============================================================================
-- 2. FIX: create_blog_post() function — update parameter names from _ua to _uk
--    (prevents future issues if this function is called)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_blog_post(
  _title_uk text,
  _title_en text,
  _content_uk text,
  _content_en text,
  _excerpt_uk text DEFAULT NULL,
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
  -- generate slug from title_en if provided, else title_uk
  IF coalesce(_title_en, '') <> '' THEN
    _slug := slugify(_title_en);
  ELSE
    _slug := slugify(_title_uk);
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
    title_uk, title_en, content_uk, content_en, excerpt_uk, excerpt_en,
    category_id, is_published, scheduled_publish_at, cover_image_url,
    video_url, audio_url, slug, published_at, author_id, author_display_name
  ) VALUES (
    _title_uk, _title_en, _content_uk, _content_en, _excerpt_uk, _excerpt_en,
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

-- ============================================================================
-- 3. REFRESH: mv_blog_recent_published materialized view
--    The view was created with _ua column names, needs refresh after rename
-- ============================================================================

-- Refresh the materialized view to pick up renamed columns
REFRESH MATERIALIZED VIEW IF EXISTS mv_blog_recent_published;
