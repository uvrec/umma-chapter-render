-- Add get_book_with_preview function for anonymous preview access
-- This allows users with a valid preview token to view unpublished books without logging in

CREATE OR REPLACE FUNCTION public.get_book_with_preview(
  p_book_slug TEXT,
  p_token TEXT DEFAULT NULL
)
RETURNS SETOF public.books
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_has_preview BOOLEAN := FALSE;
  v_book_id UUID;
BEGIN
  -- Get book_id from slug
  SELECT id INTO v_book_id FROM public.books WHERE slug = p_book_slug AND deleted_at IS NULL;

  IF v_book_id IS NULL THEN
    RETURN; -- Book not found
  END IF;

  -- Check if book is published (no token needed)
  IF EXISTS (SELECT 1 FROM public.books WHERE id = v_book_id AND is_published = TRUE) THEN
    RETURN QUERY SELECT * FROM public.books WHERE id = v_book_id;
    RETURN;
  END IF;

  -- Check if user is admin
  IF auth.uid() IS NOT NULL THEN
    SELECT public.has_role(auth.uid(), 'admin') INTO v_is_admin;
  END IF;

  IF v_is_admin THEN
    RETURN QUERY SELECT * FROM public.books WHERE id = v_book_id;
    RETURN;
  END IF;

  -- Check preview token
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens
      WHERE token = p_token
        AND is_active = TRUE
        AND (expires_at IS NULL OR expires_at > NOW())
        AND resource_type = 'book'
        AND resource_id = v_book_id
    ) INTO v_has_preview;

    IF v_has_preview THEN
      UPDATE public.preview_tokens
      SET access_count = access_count + 1, last_accessed_at = NOW()
      WHERE token = p_token;
      RETURN QUERY SELECT * FROM public.books WHERE id = v_book_id;
      RETURN;
    END IF;
  END IF;

  -- No access - return empty
  RETURN;
END;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION public.get_book_with_preview TO anon, authenticated;

COMMENT ON FUNCTION public.get_book_with_preview IS 'Get book by slug, including unpublished if valid preview token provided';
