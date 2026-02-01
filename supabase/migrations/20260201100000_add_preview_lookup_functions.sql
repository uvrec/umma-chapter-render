-- Add RPC functions for looking up book/canto/chapter by slug/number with preview token support
-- These functions support preview tokens for viewing unpublished content

-- Function to get book by slug with preview token
CREATE OR REPLACE FUNCTION public.get_book_by_slug_with_preview(
  p_slug TEXT,
  p_token TEXT DEFAULT NULL
)
RETURNS SETOF public.books
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_book_id UUID;
  v_has_preview BOOLEAN := FALSE;
BEGIN
  -- Get book ID
  SELECT id INTO v_book_id FROM public.books WHERE slug = p_slug;

  IF v_book_id IS NULL THEN
    RETURN;
  END IF;

  -- Check if book is published (no token needed)
  IF EXISTS (SELECT 1 FROM public.books WHERE id = v_book_id AND is_published = TRUE) THEN
    RETURN QUERY SELECT * FROM public.books WHERE id = v_book_id;
    RETURN;
  END IF;

  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO v_is_admin;

  IF v_is_admin THEN
    RETURN QUERY SELECT * FROM public.books WHERE id = v_book_id;
    RETURN;
  END IF;

  -- Check preview token for book
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens
      WHERE token = p_token
        AND resource_type = 'book'
        AND resource_id = v_book_id
        AND is_active = TRUE
        AND (expires_at IS NULL OR expires_at > NOW())
    ) INTO v_has_preview;

    IF v_has_preview THEN
      UPDATE public.preview_tokens SET access_count = access_count + 1, last_accessed_at = NOW()
      WHERE token = p_token;
      RETURN QUERY SELECT * FROM public.books WHERE id = v_book_id;
      RETURN;
    END IF;
  END IF;

  -- No access
  RETURN;
END;
$$;

-- Function to get canto by book_id and canto_number with preview token
CREATE OR REPLACE FUNCTION public.get_canto_by_number_with_preview(
  p_book_id UUID,
  p_canto_number INTEGER,
  p_token TEXT DEFAULT NULL
)
RETURNS SETOF public.cantos
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_canto_id UUID;
  v_has_preview BOOLEAN := FALSE;
BEGIN
  -- Get canto ID
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = p_book_id AND canto_number = p_canto_number;

  IF v_canto_id IS NULL THEN
    RETURN;
  END IF;

  -- Check if canto is published (no token needed)
  IF EXISTS (SELECT 1 FROM public.cantos WHERE id = v_canto_id AND is_published = TRUE) THEN
    RETURN QUERY SELECT * FROM public.cantos WHERE id = v_canto_id;
    RETURN;
  END IF;

  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO v_is_admin;

  IF v_is_admin THEN
    RETURN QUERY SELECT * FROM public.cantos WHERE id = v_canto_id;
    RETURN;
  END IF;

  -- Check preview token (for canto or book)
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens
      WHERE token = p_token
        AND is_active = TRUE
        AND (expires_at IS NULL OR expires_at > NOW())
        AND (
          (resource_type = 'canto' AND resource_id = v_canto_id)
          OR (resource_type = 'book' AND resource_id = p_book_id)
        )
    ) INTO v_has_preview;

    IF v_has_preview THEN
      UPDATE public.preview_tokens SET access_count = access_count + 1, last_accessed_at = NOW()
      WHERE token = p_token;
      RETURN QUERY SELECT * FROM public.cantos WHERE id = v_canto_id;
      RETURN;
    END IF;
  END IF;

  -- No access
  RETURN;
END;
$$;

-- Function to get chapter by canto_id/book_id and chapter_number with preview token
CREATE OR REPLACE FUNCTION public.get_chapter_by_number_with_preview(
  p_book_id UUID,
  p_canto_id UUID,
  p_chapter_number INTEGER,
  p_token TEXT DEFAULT NULL
)
RETURNS SETOF public.chapters
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_chapter_id UUID;
  v_has_preview BOOLEAN := FALSE;
BEGIN
  -- Get chapter ID based on whether we're looking by canto or directly by book
  IF p_canto_id IS NOT NULL THEN
    SELECT id INTO v_chapter_id FROM public.chapters
    WHERE canto_id = p_canto_id AND chapter_number = p_chapter_number;
  ELSE
    SELECT id INTO v_chapter_id FROM public.chapters
    WHERE book_id = p_book_id AND canto_id IS NULL AND chapter_number = p_chapter_number;
  END IF;

  IF v_chapter_id IS NULL THEN
    RETURN;
  END IF;

  -- Check if chapter is published (no token needed)
  IF EXISTS (SELECT 1 FROM public.chapters WHERE id = v_chapter_id AND is_published = TRUE) THEN
    RETURN QUERY SELECT * FROM public.chapters WHERE id = v_chapter_id;
    RETURN;
  END IF;

  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO v_is_admin;

  IF v_is_admin THEN
    RETURN QUERY SELECT * FROM public.chapters WHERE id = v_chapter_id;
    RETURN;
  END IF;

  -- Check preview token (for chapter, canto, or book)
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens
      WHERE token = p_token
        AND is_active = TRUE
        AND (expires_at IS NULL OR expires_at > NOW())
        AND (
          (resource_type = 'chapter' AND resource_id = v_chapter_id)
          OR (resource_type = 'canto' AND resource_id = p_canto_id)
          OR (resource_type = 'book' AND resource_id = p_book_id)
        )
    ) INTO v_has_preview;

    IF v_has_preview THEN
      UPDATE public.preview_tokens SET access_count = access_count + 1, last_accessed_at = NOW()
      WHERE token = p_token;
      RETURN QUERY SELECT * FROM public.chapters WHERE id = v_chapter_id;
      RETURN;
    END IF;
  END IF;

  -- No access
  RETURN;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_book_by_slug_with_preview TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_canto_by_number_with_preview TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_chapter_by_number_with_preview TO anon, authenticated;

COMMENT ON FUNCTION public.get_book_by_slug_with_preview IS 'Get book by slug, including unpublished if valid preview token';
COMMENT ON FUNCTION public.get_canto_by_number_with_preview IS 'Get canto by book_id and number, including unpublished if valid preview token';
COMMENT ON FUNCTION public.get_chapter_by_number_with_preview IS 'Get chapter by canto/book and number, including unpublished if valid preview token';
