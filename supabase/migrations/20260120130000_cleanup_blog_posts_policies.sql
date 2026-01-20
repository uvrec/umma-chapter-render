-- ============================================================================
-- Cleanup: Remove duplicate blog_posts RLS policies
-- ============================================================================
-- This migration consolidates multiple SELECT policies into one clear policy
-- and removes overly permissive access for authenticated users.
-- ============================================================================

BEGIN;

-- Remove duplicate/redundant SELECT policies
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "public_can_read_published" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_select_authenticated" ON public.blog_posts;

-- Ensure the canonical public read policy exists
DROP POLICY IF EXISTS "blog_posts_public_read" ON public.blog_posts;
CREATE POLICY "blog_posts_public_read" ON public.blog_posts
  FOR SELECT
  USING (
    is_published = true
    AND (published_at IS NULL OR published_at <= NOW())
  );

-- Ensure grants are in place (required for RLS to apply)
GRANT SELECT ON TABLE public.blog_posts TO anon;
GRANT SELECT ON TABLE public.blog_posts TO authenticated;

COMMIT;

-- ============================================================================
-- Result:
-- - One SELECT policy for all users (anon + authenticated): published posts only
-- - Authors can still edit their own posts via "blog_posts_modify_author_only"
-- - Admins/service_role bypass RLS entirely
-- ============================================================================
