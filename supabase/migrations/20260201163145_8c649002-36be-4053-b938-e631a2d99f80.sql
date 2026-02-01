
-- Fix all preview RPC functions to handle UPDATE in read-only context gracefully

-- 1. Fix get_book_with_preview
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
  -- Get the book ID first
  SELECT id INTO v_book_id FROM public.books WHERE slug = p_book_slug AND deleted_at IS NULL;
  IF v_book_id IS NULL THEN RETURN; END IF;

  -- If book is published, return it immediately
  IF EXISTS (SELECT 1 FROM public.books WHERE id = v_book_id AND is_published = TRUE) THEN
    RETURN QUERY SELECT * FROM public.books WHERE id = v_book_id;
    RETURN;
  END IF;

  -- Check admin status
  IF auth.uid() IS NOT NULL THEN
    SELECT public.has_role(auth.uid(), 'admin') INTO v_is_admin;
  END IF;

  -- Return for admin
  IF v_is_admin THEN
    RETURN QUERY SELECT * FROM public.books WHERE id = v_book_id;
    RETURN;
  END IF;

  -- Check preview token with cascading access from child resources
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens pt
      WHERE pt.token = p_token AND pt.is_active = TRUE
        AND (pt.expires_at IS NULL OR pt.expires_at > NOW())
        AND (
          (pt.resource_type = 'book' AND pt.resource_id = v_book_id)
          OR (pt.resource_type = 'canto' AND EXISTS (
            SELECT 1 FROM public.cantos c WHERE c.id = pt.resource_id AND c.book_id = v_book_id
          ))
          OR (pt.resource_type = 'chapter' AND EXISTS (
            SELECT 1 FROM public.chapters ch
            LEFT JOIN public.cantos ca ON ch.canto_id = ca.id
            WHERE ch.id = pt.resource_id AND (ch.book_id = v_book_id OR ca.book_id = v_book_id)
          ))
          OR (pt.resource_type = 'verse' AND EXISTS (
            SELECT 1 FROM public.verses v
            JOIN public.chapters ch ON v.chapter_id = ch.id
            LEFT JOIN public.cantos ca ON ch.canto_id = ca.id
            WHERE v.id = pt.resource_id AND (ch.book_id = v_book_id OR ca.book_id = v_book_id)
          ))
        )
    ) INTO v_has_preview;
    
    IF v_has_preview THEN
      -- Try to update access count, but ignore if fails (read-only context)
      BEGIN
        UPDATE public.preview_tokens
        SET access_count = access_count + 1, last_accessed_at = NOW()
        WHERE token = p_token;
      EXCEPTION WHEN OTHERS THEN
        NULL; -- Silently ignore update failures
      END;
      
      RETURN QUERY SELECT * FROM public.books WHERE id = v_book_id;
      RETURN;
    END IF;
  END IF;
  
  -- No access - return nothing
  RETURN;
END;
$$;

-- 2. Fix get_canto_by_number_with_preview
CREATE OR REPLACE FUNCTION public.get_canto_by_number_with_preview(
  p_book_id UUID,
  p_canto_number INT,
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
  v_canto_id UUID;
BEGIN
  -- Get canto ID
  SELECT id INTO v_canto_id 
  FROM public.cantos 
  WHERE book_id = p_book_id AND canto_number = p_canto_number;
  
  IF v_canto_id IS NULL THEN RETURN; END IF;

  -- If canto is published, return it immediately
  IF EXISTS (SELECT 1 FROM public.cantos WHERE id = v_canto_id AND is_published = TRUE) THEN
    RETURN QUERY SELECT * FROM public.cantos WHERE id = v_canto_id;
    RETURN;
  END IF;

  -- Check admin status
  IF auth.uid() IS NOT NULL THEN
    SELECT public.has_role(auth.uid(), 'admin') INTO v_is_admin;
  END IF;

  IF v_is_admin THEN
    RETURN QUERY SELECT * FROM public.cantos WHERE id = v_canto_id;
    RETURN;
  END IF;

  -- Check preview token
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens pt
      WHERE pt.token = p_token AND pt.is_active = TRUE
        AND (pt.expires_at IS NULL OR pt.expires_at > NOW())
        AND (
          (pt.resource_type = 'book' AND pt.resource_id = p_book_id)
          OR (pt.resource_type = 'canto' AND pt.resource_id = v_canto_id)
          OR (pt.resource_type = 'chapter' AND EXISTS (
            SELECT 1 FROM public.chapters ch WHERE ch.id = pt.resource_id AND ch.canto_id = v_canto_id
          ))
          OR (pt.resource_type = 'verse' AND EXISTS (
            SELECT 1 FROM public.verses v
            JOIN public.chapters ch ON v.chapter_id = ch.id
            WHERE v.id = pt.resource_id AND ch.canto_id = v_canto_id
          ))
        )
    ) INTO v_has_preview;
    
    IF v_has_preview THEN
      BEGIN
        UPDATE public.preview_tokens
        SET access_count = access_count + 1, last_accessed_at = NOW()
        WHERE token = p_token;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
      
      RETURN QUERY SELECT * FROM public.cantos WHERE id = v_canto_id;
      RETURN;
    END IF;
  END IF;
  
  RETURN;
END;
$$;

-- 3. Fix get_chapter_by_number_with_preview
CREATE OR REPLACE FUNCTION public.get_chapter_by_number_with_preview(
  p_book_id UUID,
  p_canto_id UUID,
  p_chapter_number INT,
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
  v_chapter_id UUID;
BEGIN
  -- Get chapter ID based on whether canto is specified
  IF p_canto_id IS NOT NULL THEN
    SELECT id INTO v_chapter_id 
    FROM public.chapters 
    WHERE canto_id = p_canto_id AND chapter_number = p_chapter_number;
  ELSE
    SELECT id INTO v_chapter_id 
    FROM public.chapters 
    WHERE book_id = p_book_id AND chapter_number = p_chapter_number AND canto_id IS NULL;
  END IF;
  
  IF v_chapter_id IS NULL THEN RETURN; END IF;

  -- If chapter is published, return it immediately
  IF EXISTS (SELECT 1 FROM public.chapters WHERE id = v_chapter_id AND is_published = TRUE) THEN
    RETURN QUERY SELECT * FROM public.chapters WHERE id = v_chapter_id;
    RETURN;
  END IF;

  -- Check admin status
  IF auth.uid() IS NOT NULL THEN
    SELECT public.has_role(auth.uid(), 'admin') INTO v_is_admin;
  END IF;

  IF v_is_admin THEN
    RETURN QUERY SELECT * FROM public.chapters WHERE id = v_chapter_id;
    RETURN;
  END IF;

  -- Check preview token
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens pt
      WHERE pt.token = p_token AND pt.is_active = TRUE
        AND (pt.expires_at IS NULL OR pt.expires_at > NOW())
        AND (
          (pt.resource_type = 'book' AND pt.resource_id = p_book_id)
          OR (pt.resource_type = 'canto' AND pt.resource_id = p_canto_id)
          OR (pt.resource_type = 'chapter' AND pt.resource_id = v_chapter_id)
          OR (pt.resource_type = 'verse' AND EXISTS (
            SELECT 1 FROM public.verses v WHERE v.id = pt.resource_id AND v.chapter_id = v_chapter_id
          ))
        )
    ) INTO v_has_preview;
    
    IF v_has_preview THEN
      BEGIN
        UPDATE public.preview_tokens
        SET access_count = access_count + 1, last_accessed_at = NOW()
        WHERE token = p_token;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
      
      RETURN QUERY SELECT * FROM public.chapters WHERE id = v_chapter_id;
      RETURN;
    END IF;
  END IF;
  
  RETURN;
END;
$$;

-- 4. Fix get_verses_by_chapter_with_preview
CREATE OR REPLACE FUNCTION public.get_verses_by_chapter_with_preview(
  p_chapter_id UUID,
  p_token TEXT DEFAULT NULL
)
RETURNS SETOF public.verses
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_has_preview BOOLEAN := FALSE;
  v_canto_id UUID;
  v_book_id UUID;
BEGIN
  -- Get chapter's parent IDs
  SELECT canto_id, book_id INTO v_canto_id, v_book_id 
  FROM public.chapters 
  WHERE id = p_chapter_id;
  
  -- If canto_id exists but book_id is null, get book_id from canto
  IF v_canto_id IS NOT NULL AND v_book_id IS NULL THEN
    SELECT book_id INTO v_book_id FROM public.cantos WHERE id = v_canto_id;
  END IF;

  -- Check admin status
  IF auth.uid() IS NOT NULL THEN
    SELECT public.has_role(auth.uid(), 'admin') INTO v_is_admin;
  END IF;

  -- Check preview token
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens pt
      WHERE pt.token = p_token AND pt.is_active = TRUE
        AND (pt.expires_at IS NULL OR pt.expires_at > NOW())
        AND (
          (pt.resource_type = 'book' AND pt.resource_id = v_book_id)
          OR (pt.resource_type = 'canto' AND pt.resource_id = v_canto_id)
          OR (pt.resource_type = 'chapter' AND pt.resource_id = p_chapter_id)
          OR (pt.resource_type = 'verse' AND EXISTS (
            SELECT 1 FROM public.verses v WHERE v.id = pt.resource_id AND v.chapter_id = p_chapter_id
          ))
        )
    ) INTO v_has_preview;
    
    IF v_has_preview THEN
      BEGIN
        UPDATE public.preview_tokens
        SET access_count = access_count + 1, last_accessed_at = NOW()
        WHERE token = p_token;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
    END IF;
  END IF;

  -- Return verses based on access
  IF v_is_admin OR v_has_preview THEN
    RETURN QUERY 
    SELECT * FROM public.verses 
    WHERE chapter_id = p_chapter_id AND deleted_at IS NULL 
    ORDER BY sort_key;
  ELSE
    RETURN QUERY 
    SELECT * FROM public.verses 
    WHERE chapter_id = p_chapter_id AND is_published = TRUE AND deleted_at IS NULL 
    ORDER BY sort_key;
  END IF;
END;
$$;

-- 5. Fix get_chapters_by_canto_with_preview
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

  -- Check admin status
  IF auth.uid() IS NOT NULL THEN
    SELECT public.has_role(auth.uid(), 'admin') INTO v_is_admin;
  END IF;

  -- Check preview token
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens pt
      WHERE pt.token = p_token AND pt.is_active = TRUE
        AND (pt.expires_at IS NULL OR pt.expires_at > NOW())
        AND (
          (pt.resource_type = 'book' AND pt.resource_id = v_book_id)
          OR (pt.resource_type = 'canto' AND pt.resource_id = p_canto_id)
          OR (pt.resource_type = 'chapter' AND EXISTS (
            SELECT 1 FROM public.chapters ch WHERE ch.id = pt.resource_id AND ch.canto_id = p_canto_id
          ))
        )
    ) INTO v_has_preview;
    
    IF v_has_preview THEN
      BEGIN
        UPDATE public.preview_tokens
        SET access_count = access_count + 1, last_accessed_at = NOW()
        WHERE token = p_token;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
    END IF;
  END IF;

  -- Return chapters based on access
  IF v_is_admin OR v_has_preview THEN
    RETURN QUERY 
    SELECT * FROM public.chapters 
    WHERE canto_id = p_canto_id 
    ORDER BY chapter_number;
  ELSE
    RETURN QUERY 
    SELECT * FROM public.chapters 
    WHERE canto_id = p_canto_id AND is_published = TRUE 
    ORDER BY chapter_number;
  END IF;
END;
$$;
