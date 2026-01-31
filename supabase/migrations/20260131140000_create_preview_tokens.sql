-- Preview tokens for sharing unpublished content
-- Allows admins to share private links to unpublished books/cantos/chapters

-- Create preview_tokens table
CREATE TABLE IF NOT EXISTS public.preview_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('book', 'canto', 'chapter', 'verse')),
  resource_id UUID NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- NULL = never expires
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  access_count INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  note TEXT -- Optional note about who the link was shared with
);

-- Index for fast token lookup
CREATE INDEX IF NOT EXISTS idx_preview_tokens_token ON public.preview_tokens(token);
CREATE INDEX IF NOT EXISTS idx_preview_tokens_resource ON public.preview_tokens(resource_type, resource_id);

-- RLS policies
ALTER TABLE public.preview_tokens ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage preview tokens"
  ON public.preview_tokens
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Anyone can read active, non-expired tokens (for validation)
CREATE POLICY "Anyone can validate tokens"
  ON public.preview_tokens
  FOR SELECT
  TO anon, authenticated
  USING (
    is_active = TRUE
    AND (expires_at IS NULL OR expires_at > NOW())
  );

-- Function to validate preview token and get resource access
CREATE OR REPLACE FUNCTION public.validate_preview_token(
  p_token TEXT,
  p_resource_type TEXT,
  p_resource_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_valid BOOLEAN := FALSE;
BEGIN
  -- Check if token exists and is valid
  SELECT TRUE INTO v_valid
  FROM public.preview_tokens
  WHERE token = p_token
    AND resource_type = p_resource_type
    AND resource_id = p_resource_id
    AND is_active = TRUE
    AND (expires_at IS NULL OR expires_at > NOW());

  -- Update access stats if valid
  IF v_valid THEN
    UPDATE public.preview_tokens
    SET access_count = access_count + 1,
        last_accessed_at = NOW()
    WHERE token = p_token;
  END IF;

  RETURN COALESCE(v_valid, FALSE);
END;
$$;

-- Function to get canto with preview token (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_canto_with_preview(
  p_canto_id UUID,
  p_token TEXT
)
RETURNS SETOF public.cantos
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if canto is published (no token needed)
  IF EXISTS (SELECT 1 FROM public.cantos WHERE id = p_canto_id AND is_published = TRUE) THEN
    RETURN QUERY SELECT * FROM public.cantos WHERE id = p_canto_id;
    RETURN;
  END IF;

  -- Check preview token for canto or its book
  IF public.validate_preview_token(p_token, 'canto', p_canto_id) THEN
    RETURN QUERY SELECT * FROM public.cantos WHERE id = p_canto_id;
    RETURN;
  END IF;

  -- Check if token is for the book
  IF EXISTS (
    SELECT 1 FROM public.cantos c
    JOIN public.preview_tokens pt ON pt.resource_id = c.book_id
    WHERE c.id = p_canto_id
      AND pt.token = p_token
      AND pt.resource_type = 'book'
      AND pt.is_active = TRUE
      AND (pt.expires_at IS NULL OR pt.expires_at > NOW())
  ) THEN
    -- Update access count
    UPDATE public.preview_tokens SET access_count = access_count + 1, last_accessed_at = NOW()
    WHERE token = p_token;
    RETURN QUERY SELECT * FROM public.cantos WHERE id = p_canto_id;
    RETURN;
  END IF;

  -- No access
  RETURN;
END;
$$;

-- Function to get cantos by book with preview token
CREATE OR REPLACE FUNCTION public.get_cantos_by_book_with_preview(
  p_book_id UUID,
  p_token TEXT DEFAULT NULL
)
RETURNS SETOF public.cantos
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_has_book_preview BOOLEAN := FALSE;
BEGIN
  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO v_is_admin;

  -- Check if token gives book-level access
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens
      WHERE token = p_token
        AND resource_type = 'book'
        AND resource_id = p_book_id
        AND is_active = TRUE
        AND (expires_at IS NULL OR expires_at > NOW())
    ) INTO v_has_book_preview;

    IF v_has_book_preview THEN
      UPDATE public.preview_tokens SET access_count = access_count + 1, last_accessed_at = NOW()
      WHERE token = p_token;
    END IF;
  END IF;

  -- Return all cantos if admin or has book preview, otherwise only published
  IF v_is_admin OR v_has_book_preview THEN
    RETURN QUERY SELECT * FROM public.cantos WHERE book_id = p_book_id ORDER BY canto_number;
  ELSE
    RETURN QUERY SELECT * FROM public.cantos WHERE book_id = p_book_id AND is_published = TRUE ORDER BY canto_number;
  END IF;
END;
$$;

-- Function to get chapters by canto with preview token
CREATE OR REPLACE FUNCTION public.get_chapters_by_canto_with_preview(
  p_canto_id UUID,
  p_token TEXT DEFAULT NULL
)
RETURNS SETOF public.chapters
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_has_preview BOOLEAN := FALSE;
  v_book_id UUID;
BEGIN
  -- Get book_id for this canto
  SELECT book_id INTO v_book_id FROM public.cantos WHERE id = p_canto_id;

  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO v_is_admin;

  -- Check preview token (for canto or book)
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens
      WHERE token = p_token
        AND is_active = TRUE
        AND (expires_at IS NULL OR expires_at > NOW())
        AND (
          (resource_type = 'canto' AND resource_id = p_canto_id)
          OR (resource_type = 'book' AND resource_id = v_book_id)
        )
    ) INTO v_has_preview;

    IF v_has_preview THEN
      UPDATE public.preview_tokens SET access_count = access_count + 1, last_accessed_at = NOW()
      WHERE token = p_token;
    END IF;
  END IF;

  -- Return chapters
  IF v_is_admin OR v_has_preview THEN
    RETURN QUERY SELECT * FROM public.chapters WHERE canto_id = p_canto_id ORDER BY chapter_number;
  ELSE
    RETURN QUERY SELECT * FROM public.chapters WHERE canto_id = p_canto_id AND is_published = TRUE ORDER BY chapter_number;
  END IF;
END;
$$;

-- Function to get chapter with preview token
CREATE OR REPLACE FUNCTION public.get_chapter_with_preview(
  p_chapter_id UUID,
  p_token TEXT DEFAULT NULL
)
RETURNS SETOF public.chapters
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_has_preview BOOLEAN := FALSE;
  v_canto_id UUID;
  v_book_id UUID;
BEGIN
  -- Get canto_id and book_id
  SELECT canto_id, book_id INTO v_canto_id, v_book_id FROM public.chapters WHERE id = p_chapter_id;

  -- Check if published
  IF EXISTS (SELECT 1 FROM public.chapters WHERE id = p_chapter_id AND is_published = TRUE) THEN
    RETURN QUERY SELECT * FROM public.chapters WHERE id = p_chapter_id;
    RETURN;
  END IF;

  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO v_is_admin;

  IF v_is_admin THEN
    RETURN QUERY SELECT * FROM public.chapters WHERE id = p_chapter_id;
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
          (resource_type = 'chapter' AND resource_id = p_chapter_id)
          OR (resource_type = 'canto' AND resource_id = v_canto_id)
          OR (resource_type = 'book' AND resource_id = v_book_id)
        )
    ) INTO v_has_preview;

    IF v_has_preview THEN
      UPDATE public.preview_tokens SET access_count = access_count + 1, last_accessed_at = NOW()
      WHERE token = p_token;
      RETURN QUERY SELECT * FROM public.chapters WHERE id = p_chapter_id;
    END IF;
  END IF;

  -- No access
  RETURN;
END;
$$;

-- Function to get verses by chapter with preview token
CREATE OR REPLACE FUNCTION public.get_verses_by_chapter_with_preview(
  p_chapter_id UUID,
  p_token TEXT DEFAULT NULL
)
RETURNS SETOF public.verses
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_has_preview BOOLEAN := FALSE;
  v_canto_id UUID;
  v_book_id UUID;
BEGIN
  -- Get canto_id and book_id
  SELECT canto_id, book_id INTO v_canto_id, v_book_id FROM public.chapters WHERE id = p_chapter_id;

  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO v_is_admin;

  -- Check preview token
  IF p_token IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.preview_tokens
      WHERE token = p_token
        AND is_active = TRUE
        AND (expires_at IS NULL OR expires_at > NOW())
        AND (
          (resource_type = 'chapter' AND resource_id = p_chapter_id)
          OR (resource_type = 'canto' AND resource_id = v_canto_id)
          OR (resource_type = 'book' AND resource_id = v_book_id)
        )
    ) INTO v_has_preview;

    IF v_has_preview THEN
      UPDATE public.preview_tokens SET access_count = access_count + 1, last_accessed_at = NOW()
      WHERE token = p_token;
    END IF;
  END IF;

  -- Return verses
  IF v_is_admin OR v_has_preview THEN
    RETURN QUERY SELECT * FROM public.verses WHERE chapter_id = p_chapter_id AND deleted_at IS NULL ORDER BY sort_key;
  ELSE
    RETURN QUERY SELECT * FROM public.verses WHERE chapter_id = p_chapter_id AND is_published = TRUE AND deleted_at IS NULL ORDER BY sort_key;
  END IF;
END;
$$;

-- Function to generate a new preview token
CREATE OR REPLACE FUNCTION public.generate_preview_token(
  p_resource_type TEXT,
  p_resource_id UUID,
  p_expires_in_days INTEGER DEFAULT NULL,
  p_note TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can generate preview tokens';
  END IF;

  -- Generate unique token (nanoid-style)
  v_token := encode(gen_random_bytes(16), 'base64');
  v_token := replace(replace(replace(v_token, '+', '-'), '/', '_'), '=', '');

  -- Calculate expiration
  IF p_expires_in_days IS NOT NULL THEN
    v_expires_at := NOW() + (p_expires_in_days || ' days')::INTERVAL;
  END IF;

  -- Insert token
  INSERT INTO public.preview_tokens (token, resource_type, resource_id, created_by, expires_at, note)
  VALUES (v_token, p_resource_type, p_resource_id, auth.uid(), v_expires_at, p_note);

  RETURN v_token;
END;
$$;

-- Grant execute permissions for RPC functions
GRANT EXECUTE ON FUNCTION public.validate_preview_token TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_preview_token TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_canto_with_preview TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_cantos_by_book_with_preview TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_chapters_by_canto_with_preview TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_chapter_with_preview TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_verses_by_chapter_with_preview TO anon, authenticated;

COMMENT ON TABLE public.preview_tokens IS 'Stores tokens for sharing unpublished content privately';
COMMENT ON FUNCTION public.validate_preview_token IS 'Validates a preview token for accessing unpublished content';
COMMENT ON FUNCTION public.generate_preview_token IS 'Generates a new preview token (admin only)';
COMMENT ON FUNCTION public.get_cantos_by_book_with_preview IS 'Get cantos for a book, including unpublished if valid preview token';
COMMENT ON FUNCTION public.get_chapters_by_canto_with_preview IS 'Get chapters for a canto, including unpublished if valid preview token';
COMMENT ON FUNCTION public.get_verses_by_chapter_with_preview IS 'Get verses for a chapter, including unpublished if valid preview token';
