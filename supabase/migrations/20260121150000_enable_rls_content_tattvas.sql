-- ============================================================================
-- Security: Enable RLS on content_tattvas (public read, admin write)
-- ============================================================================
-- content_tattvas links verses to tattvas (philosophical categories)
-- Access model: Public read, writes only via service_role
-- ============================================================================

-- 1) Enable RLS
ALTER TABLE public.content_tattvas ENABLE ROW LEVEL SECURITY;

-- 2) Revoke all from PUBLIC, grant minimal privileges
REVOKE ALL ON public.content_tattvas FROM PUBLIC;
GRANT SELECT ON public.content_tattvas TO anon, authenticated;
-- INSERT/UPDATE/DELETE not granted to anon/authenticated
-- Writes happen only via service_role (admin/AI tagging)

-- 3) Public read policy
CREATE POLICY "content_tattvas_public_read"
ON public.content_tattvas
FOR SELECT
TO anon, authenticated
USING (true);

-- No INSERT/UPDATE/DELETE policies = blocked for anon/authenticated
-- service_role bypasses RLS, so admin operations still work

-- 4) Index for common queries (tattva_id, verse_id for JOINs)
CREATE INDEX IF NOT EXISTS idx_content_tattvas_tattva_id ON public.content_tattvas(tattva_id);
CREATE INDEX IF NOT EXISTS idx_content_tattvas_verse_id ON public.content_tattvas(verse_id);

-- ============================================================================
-- SUMMARY:
-- - RLS enabled
-- - SELECT granted to anon + authenticated
-- - Public read policy allows all reads
-- - No write policies = writes blocked for clients
-- - Writes only via service_role (Edge Functions, admin)
-- ============================================================================
