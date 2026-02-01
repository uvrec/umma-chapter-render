-- Fix preview token hierarchy: tokens for child resources should grant access to parent resources
-- This allows a chapter token to also access the parent canto and book pages

-- Update get_book_with_preview to accept tokens for child cantos/chapters
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

  -- Check preview token - now also accepts tokens for child resources
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens pt
      WHERE pt.token = p_token
        AND pt.is_active = TRUE
        AND (pt.expires_at IS NULL OR pt.expires_at > NOW())
        AND (
          -- Token for this book
          (pt.resource_type = 'book' AND pt.resource_id = v_book_id)
          -- Token for any canto in this book
          OR (pt.resource_type = 'canto' AND EXISTS (
            SELECT 1 FROM public.cantos c WHERE c.id = pt.resource_id AND c.book_id = v_book_id
          ))
          -- Token for any chapter in this book (direct or via canto)
          OR (pt.resource_type = 'chapter' AND EXISTS (
            SELECT 1 FROM public.chapters ch
            LEFT JOIN public.cantos ca ON ch.canto_id = ca.id
            WHERE ch.id = pt.resource_id
              AND (ch.book_id = v_book_id OR ca.book_id = v_book_id)
          ))
        )
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

-- Update get_canto_by_number_with_preview to accept tokens for child chapters
CREATE OR REPLACE FUNCTION public.get_canto_by_number_with_preview(
  p_book_id UUID,
  p_canto_number INTEGER,
  p_token TEXT DEFAULT NULL
)
RETURNS SETOF public.cantos
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
  IF auth.uid() IS NOT NULL THEN
    SELECT public.has_role(auth.uid(), 'admin') INTO v_is_admin;
  END IF;

  IF v_is_admin THEN
    RETURN QUERY SELECT * FROM public.cantos WHERE id = v_canto_id;
    RETURN;
  END IF;

  -- Check preview token - now also accepts tokens for child chapters
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens pt
      WHERE pt.token = p_token
        AND pt.is_active = TRUE
        AND (pt.expires_at IS NULL OR pt.expires_at > NOW())
        AND (
          -- Token for this canto
          (pt.resource_type = 'canto' AND pt.resource_id = v_canto_id)
          -- Token for parent book
          OR (pt.resource_type = 'book' AND pt.resource_id = p_book_id)
          -- Token for any chapter in this canto
          OR (pt.resource_type = 'chapter' AND EXISTS (
            SELECT 1 FROM public.chapters ch WHERE ch.id = pt.resource_id AND ch.canto_id = v_canto_id
          ))
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

-- Update get_cantos_by_book_with_preview to accept tokens for child resources
CREATE OR REPLACE FUNCTION public.get_cantos_by_book_with_preview(
  p_book_id UUID,
  p_token TEXT DEFAULT NULL
)
RETURNS SETOF public.cantos
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_has_preview BOOLEAN := FALSE;
BEGIN
  -- Check if user is admin
  IF auth.uid() IS NOT NULL THEN
    SELECT public.has_role(auth.uid(), 'admin') INTO v_is_admin;
  END IF;

  IF v_is_admin THEN
    RETURN QUERY SELECT * FROM public.cantos WHERE book_id = p_book_id ORDER BY canto_number;
    RETURN;
  END IF;

  -- Check preview token for book or any child resource
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens pt
      WHERE pt.token = p_token
        AND pt.is_active = TRUE
        AND (pt.expires_at IS NULL OR pt.expires_at > NOW())
        AND (
          -- Token for the book
          (pt.resource_type = 'book' AND pt.resource_id = p_book_id)
          -- Token for any canto in this book
          OR (pt.resource_type = 'canto' AND EXISTS (
            SELECT 1 FROM public.cantos c WHERE c.id = pt.resource_id AND c.book_id = p_book_id
          ))
          -- Token for any chapter in this book
          OR (pt.resource_type = 'chapter' AND EXISTS (
            SELECT 1 FROM public.chapters ch
            LEFT JOIN public.cantos ca ON ch.canto_id = ca.id
            WHERE ch.id = pt.resource_id
              AND (ch.book_id = p_book_id OR ca.book_id = p_book_id)
          ))
        )
    ) INTO v_has_preview;

    IF v_has_preview THEN
      UPDATE public.preview_tokens SET access_count = access_count + 1, last_accessed_at = NOW()
      WHERE token = p_token;
      -- Return all cantos (both published and unpublished) for the book
      RETURN QUERY SELECT * FROM public.cantos WHERE book_id = p_book_id ORDER BY canto_number;
      RETURN;
    END IF;
  END IF;

  -- Return only published cantos
  RETURN QUERY SELECT * FROM public.cantos WHERE book_id = p_book_id AND is_published = TRUE ORDER BY canto_number;
END;
$$;

-- Update get_chapters_by_canto_with_preview to accept tokens for child resources
CREATE OR REPLACE FUNCTION public.get_chapters_by_canto_with_preview(
  p_canto_id UUID,
  p_token TEXT DEFAULT NULL
)
RETURNS SETOF public.chapters
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_has_preview BOOLEAN := FALSE;
  v_book_id UUID;
BEGIN
  -- Get book_id from canto
  SELECT book_id INTO v_book_id FROM public.cantos WHERE id = p_canto_id;

  -- Check if user is admin
  IF auth.uid() IS NOT NULL THEN
    SELECT public.has_role(auth.uid(), 'admin') INTO v_is_admin;
  END IF;

  IF v_is_admin THEN
    RETURN QUERY SELECT * FROM public.chapters WHERE canto_id = p_canto_id ORDER BY chapter_number;
    RETURN;
  END IF;

  -- Check preview token for canto, book, or any chapter in this canto
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens pt
      WHERE pt.token = p_token
        AND pt.is_active = TRUE
        AND (pt.expires_at IS NULL OR pt.expires_at > NOW())
        AND (
          -- Token for the canto
          (pt.resource_type = 'canto' AND pt.resource_id = p_canto_id)
          -- Token for the book
          OR (pt.resource_type = 'book' AND pt.resource_id = v_book_id)
          -- Token for any chapter in this canto
          OR (pt.resource_type = 'chapter' AND EXISTS (
            SELECT 1 FROM public.chapters ch WHERE ch.id = pt.resource_id AND ch.canto_id = p_canto_id
          ))
        )
    ) INTO v_has_preview;

    IF v_has_preview THEN
      UPDATE public.preview_tokens SET access_count = access_count + 1, last_accessed_at = NOW()
      WHERE token = p_token;
      -- Return all chapters (both published and unpublished) for the canto
      RETURN QUERY SELECT * FROM public.chapters WHERE canto_id = p_canto_id ORDER BY chapter_number;
      RETURN;
    END IF;
  END IF;

  -- Return only published chapters
  RETURN QUERY SELECT * FROM public.chapters WHERE canto_id = p_canto_id AND is_published = TRUE ORDER BY chapter_number;
END;
$$;

COMMENT ON FUNCTION public.get_book_with_preview IS 'Get book by slug. Accepts preview tokens for book, canto, or chapter within the book.';
COMMENT ON FUNCTION public.get_canto_by_number_with_preview IS 'Get canto by number. Accepts preview tokens for canto, parent book, or any chapter in the canto.';
COMMENT ON FUNCTION public.get_cantos_by_book_with_preview IS 'Get all cantos for a book. Accepts preview tokens for book or any child resource.';
COMMENT ON FUNCTION public.get_chapters_by_canto_with_preview IS 'Get all chapters for a canto. Accepts preview tokens for canto, book, or any chapter.';
