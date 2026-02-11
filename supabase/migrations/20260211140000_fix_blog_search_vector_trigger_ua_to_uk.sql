-- ============================================================================
-- COMPREHENSIVE FIX: All _ua → _uk references in database functions/triggers
-- ============================================================================
-- After columns were renamed from _ua to _uk, these database objects still
-- reference the old column names. This migration updates ALL of them.
--
-- HOW TO APPLY:
-- Copy this entire SQL and run it in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/qeplxgqadcbwlrbgydlb/sql/new
-- ============================================================================

-- ============================================================================
-- 1. BLOG: Fix search vector trigger (causes "no field title_ua" error)
-- ============================================================================

DROP TRIGGER IF EXISTS trg_blog_posts_search_vector ON public.blog_posts;

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

CREATE TRIGGER trg_blog_posts_search_vector
  BEFORE INSERT OR UPDATE OF title_uk, title_en, excerpt_uk, excerpt_en, content_uk, content_en
  ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_post_search_vector();

-- ============================================================================
-- 2. BLOG: Fix create_blog_post() function parameters
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
  IF coalesce(_title_en, '') <> '' THEN
    _slug := slugify(_title_en);
  ELSE
    _slug := slugify(_title_uk);
  END IF;

  base_slug := _slug;
  LOOP
    tmp_slug := CASE WHEN cnt = 0 THEN base_slug ELSE base_slug || '-' || cnt::text END;
    EXIT WHEN NOT EXISTS(SELECT 1 FROM public.blog_posts WHERE slug = tmp_slug);
    cnt := cnt + 1;
  END LOOP;
  _slug := tmp_slug;

  SELECT display_name INTO user_display_name
  FROM public.profiles
  WHERE id = auth.uid();

  IF user_display_name IS NULL THEN
    SELECT split_part(email, '@', 1) INTO user_display_name
    FROM auth.users
    WHERE id = auth.uid();
  END IF;

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

  IF _tags IS NOT NULL THEN
    FOREACH _tag IN ARRAY _tags LOOP
      _tag := slugify(coalesce(_tag, ''));
      IF _tag = '' THEN CONTINUE; END IF;
      SELECT id INTO _tag_id FROM public.blog_tags WHERE slug = _tag FOR UPDATE;
      IF NOT FOUND THEN
        INSERT INTO public.blog_tags(name_en, slug, post_count, created_at)
        VALUES (_tag, _tag, 1, now()) RETURNING id INTO _tag_id;
      ELSE
        UPDATE public.blog_tags SET post_count = coalesce(post_count,0) + 1 WHERE id = _tag_id;
      END IF;
      BEGIN
        INSERT INTO public.blog_post_tags(post_id, tag_id) VALUES (_post.id, _tag_id);
      EXCEPTION WHEN unique_violation THEN NULL;
      END;
    END LOOP;
  END IF;

  IF _category_id IS NOT NULL THEN
    UPDATE public.blog_categories SET post_count = coalesce(post_count,0) + 1 WHERE id = _category_id;
  END IF;

  RETURN _post;
END;
$function$;

-- ============================================================================
-- 3. CALENDAR: Fix get_calendar_events()
-- ============================================================================

CREATE OR REPLACE FUNCTION get_calendar_events(
  p_start_date DATE,
  p_end_date DATE,
  p_location_id UUID DEFAULT NULL
)
RETURNS TABLE (
  event_id UUID,
  event_date DATE,
  event_type TEXT,
  name_uk TEXT,
  name_en TEXT,
  description_uk TEXT,
  description_en TEXT,
  category_slug TEXT,
  category_color TEXT,
  is_ekadashi BOOLEAN,
  is_major BOOLEAN,
  moon_phase NUMERIC,
  sunrise_time TIME,
  sunset_time TIME
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
BEGIN
  RETURN QUERY
  SELECT
    ce.id as event_id,
    ce.event_date,
    CASE
      WHEN ce.ekadashi_id IS NOT NULL THEN 'ekadashi'::TEXT
      WHEN ce.festival_id IS NOT NULL THEN 'festival'::TEXT
      WHEN ce.appearance_day_id IS NOT NULL THEN ad.event_type
      ELSE 'other'::TEXT
    END as event_type,
    COALESCE(ce.custom_name_uk, ei.name_uk, vf.name_uk, ad.person_name_uk) as name_uk,
    COALESCE(ce.custom_name_en, ei.name_en, vf.name_en, ad.person_name_en) as name_en,
    COALESCE(ce.custom_description_uk, ei.glory_text_uk, vf.short_description_uk, ad.short_description_uk) as description_uk,
    COALESCE(ce.custom_description_en, ei.glory_text_en, vf.short_description_en, ad.short_description_en) as description_en,
    CASE
      WHEN ce.ekadashi_id IS NOT NULL THEN 'ekadashi'
      ELSE COALESCE(fc.slug, 'special')
    END as category_slug,
    CASE
      WHEN ce.ekadashi_id IS NOT NULL THEN '#8B5CF6'
      ELSE COALESCE(fc.color, '#d97706')
    END as category_color,
    (ce.ekadashi_id IS NOT NULL) as is_ekadashi,
    COALESCE(ei.is_major, vf.is_major, ad.is_major, false) as is_major,
    ce.moon_phase,
    ce.sunrise_time,
    ce.sunset_time
  FROM calendar_events ce
  LEFT JOIN ekadashi_info ei ON ce.ekadashi_id = ei.id
  LEFT JOIN vaishnava_festivals vf ON ce.festival_id = vf.id
  LEFT JOIN appearance_days ad ON ce.appearance_day_id = ad.id
  LEFT JOIN festival_categories fc ON COALESCE(vf.category_id, ad.category_id) = fc.id
  WHERE ce.event_date BETWEEN p_start_date AND p_end_date
    AND ce.is_published = true
    AND (p_location_id IS NULL OR ce.location_id = p_location_id)
  ORDER BY ce.event_date, COALESCE(ei.is_major, vf.is_major, ad.is_major, false) DESC;
END;
$func$;

-- ============================================================================
-- 4. CALENDAR: Fix get_today_events()
-- ============================================================================

CREATE OR REPLACE FUNCTION get_today_events(
  p_location_id UUID DEFAULT NULL
)
RETURNS TABLE (
  event_id UUID,
  event_type TEXT,
  name_uk TEXT,
  name_en TEXT,
  short_description_uk TEXT,
  short_description_en TEXT,
  category_color TEXT,
  is_ekadashi BOOLEAN,
  parana_start_time TIMESTAMPTZ,
  parana_end_time TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
BEGIN
  RETURN QUERY
  SELECT
    ce.id,
    CASE
      WHEN ce.ekadashi_id IS NOT NULL THEN 'ekadashi'::TEXT
      WHEN ce.festival_id IS NOT NULL THEN 'festival'::TEXT
      WHEN ce.appearance_day_id IS NOT NULL THEN ad.event_type
      ELSE 'other'::TEXT
    END,
    COALESCE(ce.custom_name_uk, ei.name_uk, vf.name_uk, ad.person_name_uk),
    COALESCE(ce.custom_name_en, ei.name_en, vf.name_en, ad.person_name_en),
    COALESCE(ei.glory_title_uk, vf.short_description_uk, ad.short_description_uk),
    COALESCE(ei.glory_title_en, vf.short_description_en, ad.short_description_en),
    CASE
      WHEN ce.ekadashi_id IS NOT NULL THEN '#8B5CF6'
      ELSE COALESCE(fc.color, '#d97706')
    END,
    (ce.ekadashi_id IS NOT NULL),
    ce.parana_start_time,
    ce.parana_end_time
  FROM calendar_events ce
  LEFT JOIN ekadashi_info ei ON ce.ekadashi_id = ei.id
  LEFT JOIN vaishnava_festivals vf ON ce.festival_id = vf.id
  LEFT JOIN appearance_days ad ON ce.appearance_day_id = ad.id
  LEFT JOIN festival_categories fc ON COALESCE(vf.category_id, ad.category_id) = fc.id
  WHERE ce.event_date = CURRENT_DATE
    AND ce.is_published = true
    AND (p_location_id IS NULL OR ce.location_id = p_location_id);
END;
$func$;

-- ============================================================================
-- 5. TATTVA: Fix get_tattva_tree()
-- ============================================================================

DROP FUNCTION IF EXISTS get_tattva_tree(UUID);

CREATE OR REPLACE FUNCTION get_tattva_tree(p_parent_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name_en TEXT,
  name_uk TEXT,
  description_en TEXT,
  description_uk TEXT,
  category TEXT,
  parent_id UUID,
  display_order INT,
  depth INT,
  children_count BIGINT,
  verses_count BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE tree AS (
    SELECT t.*, 0 AS depth
    FROM public.tattvas t
    WHERE (p_parent_id IS NULL AND t.parent_id IS NULL)
       OR (p_parent_id IS NOT NULL AND t.parent_id = p_parent_id)
    UNION ALL
    SELECT t.*, tree.depth + 1
    FROM public.tattvas t
    JOIN tree ON t.parent_id = tree.id
    WHERE tree.depth < 5
  )
  SELECT
    tree.id,
    tree.slug,
    tree.name_en,
    tree.name_uk,
    tree.description_en,
    tree.description_uk,
    tree.category,
    tree.parent_id,
    tree.display_order,
    tree.depth,
    (SELECT COUNT(*) FROM public.tattvas c WHERE c.parent_id = tree.id) AS children_count,
    (SELECT COUNT(*) FROM public.content_tattvas ct WHERE ct.tattva_id = tree.id) AS verses_count
  FROM tree
  ORDER BY tree.depth, tree.display_order;
END;
$$;

-- ============================================================================
-- 6. TATTVA: Fix get_tattva_verses()
-- ============================================================================

DROP FUNCTION IF EXISTS get_tattva_verses(TEXT, INTEGER, INTEGER, BOOLEAN);

CREATE OR REPLACE FUNCTION get_tattva_verses(
  p_tattva_slug TEXT,
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0,
  p_include_children BOOLEAN DEFAULT TRUE
)
RETURNS TABLE (
  verse_id UUID,
  book_slug TEXT,
  book_title TEXT,
  canto_number INT,
  chapter_number INT,
  verse_number TEXT,
  sanskrit TEXT,
  translation_uk TEXT,
  translation_en TEXT,
  relevance_score FLOAT,
  tattva_name TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_tattva_id UUID;
BEGIN
  SELECT t.id INTO v_tattva_id FROM public.tattvas t WHERE t.slug = p_tattva_slug;
  IF v_tattva_id IS NULL THEN RETURN; END IF;

  RETURN QUERY
  WITH target_tattvas AS (
    SELECT t.id, t.name_uk FROM public.tattvas t WHERE t.id = v_tattva_id
    UNION ALL
    SELECT t.id, t.name_uk FROM public.tattvas t
    WHERE p_include_children AND t.parent_id = v_tattva_id
  )
  SELECT
    v.id AS verse_id,
    b.slug AS book_slug,
    COALESCE(b.title_uk, b.title) AS book_title,
    can.canto_number,
    ch.chapter_number,
    v.verse_number,
    v.sanskrit,
    v.translation_uk,
    v.translation_en,
    ct.relevance_score::FLOAT,
    tt.name_uk AS tattva_name
  FROM public.content_tattvas ct
  JOIN target_tattvas tt ON tt.id = ct.tattva_id
  JOIN public.verses v ON v.id = ct.verse_id
  JOIN public.chapters ch ON ch.id = v.chapter_id
  LEFT JOIN public.cantos can ON can.id = ch.canto_id
  JOIN public.books b ON b.id = COALESCE(can.book_id, ch.book_id)
  ORDER BY ct.relevance_score DESC, b.display_order, ch.chapter_number, v.verse_number
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- ============================================================================
-- 7. TATTVA: Fix get_verse_tattvas()
-- ============================================================================

DROP FUNCTION IF EXISTS get_verse_tattvas(UUID);

CREATE OR REPLACE FUNCTION get_verse_tattvas(p_verse_id UUID)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name_en TEXT,
  name_uk TEXT,
  category TEXT,
  relevance_score FLOAT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.slug,
    t.name_en,
    t.name_uk,
    t.category,
    ct.relevance_score::FLOAT
  FROM public.content_tattvas ct
  JOIN public.tattvas t ON t.id = ct.tattva_id
  WHERE ct.verse_id = p_verse_id
  ORDER BY ct.relevance_score DESC;
END;
$$;

-- ============================================================================
-- 8. TATTVA: Fix search_tattvas()
-- ============================================================================

DROP FUNCTION IF EXISTS search_tattvas(TEXT);

CREATE OR REPLACE FUNCTION search_tattvas(p_query TEXT)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name_en TEXT,
  name_uk TEXT,
  description_uk TEXT,
  description_en TEXT,
  category TEXT,
  parent_id UUID,
  parent_slug TEXT,
  verses_count BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.slug,
    t.name_en,
    t.name_uk,
    t.description_uk,
    t.description_en,
    t.category,
    t.parent_id,
    p.slug AS parent_slug,
    (SELECT COUNT(*) FROM public.content_tattvas ct WHERE ct.tattva_id = t.id) AS verses_count
  FROM public.tattvas t
  LEFT JOIN public.tattvas p ON p.id = t.parent_id
  WHERE
    t.name_uk ILIKE '%' || p_query || '%'
    OR t.name_en ILIKE '%' || p_query || '%'
    OR t.description_uk ILIKE '%' || p_query || '%'
    OR t.description_en ILIKE '%' || p_query || '%'
  ORDER BY
    CASE WHEN t.name_uk ILIKE p_query || '%' THEN 0 ELSE 1 END,
    t.display_order;
END;
$$;

-- ============================================================================
-- 9. TATTVA: Fix get_tattva_breadcrumb()
-- ============================================================================

DROP FUNCTION IF EXISTS get_tattva_breadcrumb(TEXT);

CREATE OR REPLACE FUNCTION get_tattva_breadcrumb(p_tattva_slug TEXT)
RETURNS TABLE (
  id UUID,
  name_uk TEXT,
  name_en TEXT,
  slug TEXT,
  depth INT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE path AS (
    SELECT t.id, t.name_uk, t.name_en, t.slug, t.parent_id, 0 AS depth
    FROM public.tattvas t
    WHERE t.slug = p_tattva_slug
    UNION ALL
    SELECT t.id, t.name_uk, t.name_en, t.slug, t.parent_id, path.depth + 1
    FROM public.tattvas t
    JOIN path ON t.id = path.parent_id
  )
  SELECT path.id, path.name_uk, path.name_en, path.slug, path.depth
  FROM path
  ORDER BY path.depth DESC;
END;
$$;

-- ============================================================================
-- 10. QUOTES: Fix search_quotes()
-- ============================================================================

CREATE OR REPLACE FUNCTION search_quotes(
    p_query TEXT,
    p_category_slug TEXT DEFAULT NULL,
    p_source_type TEXT DEFAULT NULL,
    p_book_slug TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    text_en TEXT,
    text_uk TEXT,
    source_type TEXT,
    source_reference TEXT,
    book_slug TEXT,
    chapter_number INTEGER,
    verse_number TEXT,
    page_title TEXT,
    categories TEXT[],
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        q.id,
        q.text_en,
        q.text_uk,
        q.source_type,
        q.source_reference,
        q.book_slug,
        q.chapter_number,
        q.verse_number,
        qp.title AS page_title,
        ARRAY(
            SELECT qc.title
            FROM quote_page_categories qpc
            JOIN quote_categories qc ON qc.id = qpc.category_id
            WHERE qpc.quote_page_id = q.quote_page_id
        ) AS categories,
        ts_rank(q.search_vector, websearch_to_tsquery('english', p_query)) AS rank
    FROM quotes q
    LEFT JOIN quote_pages qp ON qp.id = q.quote_page_id
    WHERE
        (p_query IS NULL OR q.search_vector @@ websearch_to_tsquery('english', p_query))
        AND (p_source_type IS NULL OR q.source_type = p_source_type)
        AND (p_book_slug IS NULL OR q.book_slug = p_book_slug)
        AND (
            p_category_slug IS NULL
            OR EXISTS (
                SELECT 1 FROM quote_page_categories qpc
                JOIN quote_categories qc ON qc.id = qpc.category_id
                WHERE qpc.quote_page_id = q.quote_page_id
                AND qc.slug = p_category_slug
            )
        )
    ORDER BY rank DESC, q.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- 11. QUOTES: Fix get_verse_quotes()
-- ============================================================================

CREATE OR REPLACE FUNCTION get_verse_quotes(
    p_book_slug TEXT,
    p_canto_number INTEGER,
    p_chapter_number INTEGER,
    p_verse_number TEXT
)
RETURNS TABLE (
    id UUID,
    text_en TEXT,
    text_uk TEXT,
    source_type TEXT,
    source_reference TEXT,
    page_title TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        q.id,
        q.text_en,
        q.text_uk,
        q.source_type,
        q.source_reference,
        qp.title AS page_title
    FROM quotes q
    LEFT JOIN quote_pages qp ON qp.id = q.quote_page_id
    WHERE
        q.book_slug = p_book_slug
        AND (p_canto_number IS NULL OR q.canto_number = p_canto_number)
        AND q.chapter_number = p_chapter_number
        AND q.verse_number = p_verse_number
    ORDER BY q.created_at;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- 12. QUOTES: Fix get_featured_quote_categories()
-- ============================================================================

CREATE OR REPLACE FUNCTION get_featured_quote_categories(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    slug TEXT,
    title TEXT,
    title_uk TEXT,
    quotes_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        qc.id,
        qc.slug,
        qc.title,
        qc.title_uk,
        qc.quotes_count
    FROM quote_categories qc
    WHERE qc.is_featured = TRUE OR qc.quotes_count > 0
    ORDER BY qc.is_featured DESC, qc.quotes_count DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- 13. VERSES: Fix get_chapter_verses()
-- ============================================================================

CREATE OR REPLACE FUNCTION get_chapter_verses(p_chapter_id UUID)
RETURNS TABLE (
    id UUID,
    verse_number TEXT,
    start_verse INT,
    end_verse INT,
    is_composite BOOLEAN,
    verse_count INT,
    sanskrit TEXT,
    transliteration TEXT,
    synonyms_uk TEXT,
    synonyms_en TEXT,
    translation_uk TEXT,
    translation_en TEXT,
    commentary_uk TEXT,
    commentary_en TEXT,
    audio_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        v.id,
        v.verse_number,
        v.start_verse,
        v.end_verse,
        v.is_composite,
        v.verse_count,
        v.sanskrit,
        v.transliteration,
        v.synonyms_uk,
        v.synonyms_en,
        v.translation_uk,
        v.translation_en,
        v.commentary_uk,
        v.commentary_en,
        v.audio_url
    FROM public.verses v
    WHERE v.chapter_id = p_chapter_id
    ORDER BY v.start_verse, v.verse_number;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- 14. BOOKS: Fix get_book_by_vedabase_slug()
-- ============================================================================

CREATE OR REPLACE FUNCTION get_book_by_vedabase_slug(v_slug TEXT)
RETURNS TABLE (
    id UUID,
    slug TEXT,
    vedabase_slug TEXT,
    gitabase_slug TEXT,
    title_en TEXT,
    title_uk TEXT,
    default_structure TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.id,
        b.slug,
        b.vedabase_slug,
        b.gitabase_slug,
        b.title_en,
        b.title_uk,
        b.default_structure
    FROM public.books b
    WHERE b.vedabase_slug = v_slug
    LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- 15. MATERIALIZED VIEW: Recreate mv_blog_recent_published with _uk columns
-- ============================================================================

DROP MATERIALIZED VIEW IF EXISTS mv_blog_recent_published;

CREATE MATERIALIZED VIEW mv_blog_recent_published AS
SELECT
  bp.id,
  bp.title_uk,
  bp.title_en,
  bp.slug,
  bp.featured_image,
  bp.category_id,
  bp.is_published,
  bp.created_at,
  COALESCE(bp.published_at, bp.created_at) AS sort_date
FROM public.blog_posts bp
WHERE bp.is_published = true
  AND (bp.published_at IS NULL OR bp.published_at <= now())
ORDER BY COALESCE(bp.published_at, bp.created_at) DESC
LIMIT 50;

CREATE INDEX IF NOT EXISTS idx_mv_blog_recent_slug ON mv_blog_recent_published(slug);

-- ============================================================================
-- 16. GRANT permissions for recreated functions
-- ============================================================================

-- Tattva functions
GRANT EXECUTE ON FUNCTION get_tattva_tree TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_tattva_verses TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_verse_tattvas TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_tattvas TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_tattva_breadcrumb TO anon, authenticated;

-- Calendar functions
REVOKE ALL ON FUNCTION get_calendar_events(DATE, DATE, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_calendar_events(DATE, DATE, UUID) TO authenticated, anon;
REVOKE ALL ON FUNCTION get_today_events(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_today_events(UUID) TO authenticated, anon;

-- Quote functions
GRANT EXECUTE ON FUNCTION search_quotes TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_verse_quotes TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_featured_quote_categories TO anon, authenticated;

-- Verse/book functions
GRANT EXECUTE ON FUNCTION get_chapter_verses TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_book_by_vedabase_slug TO anon, authenticated;
