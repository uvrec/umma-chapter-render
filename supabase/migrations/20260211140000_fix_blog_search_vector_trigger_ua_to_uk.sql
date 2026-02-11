-- Fix: Blog post search vector trigger still references search_vector_ua
-- Error: record "new" has no field "search_vector_ua"
-- The columns were renamed from _ua to _uk, but the trigger function was not updated

-- Drop existing trigger
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

-- Recreate the trigger
CREATE TRIGGER trg_blog_posts_search_vector
  BEFORE INSERT OR UPDATE OF title_uk, title_en, excerpt_uk, excerpt_en, content_uk, content_en
  ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_post_search_vector();
