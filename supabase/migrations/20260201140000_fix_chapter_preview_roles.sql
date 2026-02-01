-- Fix get_chapter_by_number_with_preview to use has_role() instead of user_profiles
-- The original function in 20260201100000 incorrectly queried non-existent user_profiles table
-- This caused admin role checks to always fail, preventing admins from viewing unpublished chapters

CREATE OR REPLACE FUNCTION public.get_chapter_by_number_with_preview(
  p_book_id uuid,
  p_canto_id uuid,
  p_chapter_number integer,
  p_token text DEFAULT NULL::text
)
RETURNS SETOF chapters
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_chapter_id UUID;
  v_has_preview BOOLEAN := FALSE;
BEGIN
  -- Find chapter ID
  IF p_canto_id IS NOT NULL THEN
    SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = p_canto_id AND chapter_number = p_chapter_number;
  ELSE
    SELECT id INTO v_chapter_id FROM public.chapters WHERE book_id = p_book_id AND canto_id IS NULL AND chapter_number = p_chapter_number;
  END IF;

  IF v_chapter_id IS NULL THEN RETURN; END IF;

  -- Return if published
  IF EXISTS (SELECT 1 FROM public.chapters WHERE id = v_chapter_id AND is_published = TRUE) THEN
    RETURN QUERY SELECT * FROM public.chapters WHERE id = v_chapter_id;
    RETURN;
  END IF;

  -- Check admin role using has_role() function (matches other preview functions)
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
      UPDATE public.preview_tokens SET access_count = access_count + 1, last_accessed_at = NOW() WHERE token = p_token;
      RETURN QUERY SELECT * FROM public.chapters WHERE id = v_chapter_id;
      RETURN;
    END IF;
  END IF;

  RETURN;
END;
$function$;

COMMENT ON FUNCTION public.get_chapter_by_number_with_preview IS 'Get chapter by number with preview token support. Uses has_role() for admin check.';
