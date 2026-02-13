-- Drop all tattva and AI chat related database objects
-- These features were never fully functional and are being removed from the codebase.

-- ============================================================================
-- 1. DROP VIEWS
-- ============================================================================
DROP VIEW IF EXISTS public.tattva_stats CASCADE;

-- ============================================================================
-- 2. DROP FUNCTIONS (tattva)
-- ============================================================================
DROP FUNCTION IF EXISTS public.get_tattva_tree(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_tattva_verses(TEXT, INT, INT, BOOLEAN) CASCADE;
DROP FUNCTION IF EXISTS public.get_verse_tattvas(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.search_tattvas(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_tattva_breadcrumb(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_verse_id_by_ref(TEXT, INTEGER, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.link_verse_to_tattva(TEXT, INTEGER, TEXT, TEXT, REAL, TEXT) CASCADE;

-- ============================================================================
-- 3. DROP FUNCTIONS (semantic/vector search - part of chat ecosystem)
-- ============================================================================
DROP FUNCTION IF EXISTS public.semantic_search_verses(vector, FLOAT, INTEGER, TEXT[], TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.hybrid_search_verses(TEXT, vector, FLOAT, INTEGER, TEXT[], TEXT) CASCADE;

-- ============================================================================
-- 4. DROP TRIGGERS (chat)
-- ============================================================================
DROP TRIGGER IF EXISTS trigger_update_chat_session ON public.chat_messages;
DROP FUNCTION IF EXISTS public.update_chat_session_on_message() CASCADE;

-- ============================================================================
-- 5. DROP TABLES (this also drops their indexes, policies, and triggers)
-- ============================================================================
DROP TABLE IF EXISTS public.content_tattvas CASCADE;
DROP TABLE IF EXISTS public.tattvas CASCADE;
DROP TABLE IF EXISTS public.cross_references CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;

-- ============================================================================
-- 6. DROP COLUMNS added to verses for vector search
-- ============================================================================
ALTER TABLE public.verses DROP COLUMN IF EXISTS embedding;
ALTER TABLE public.verses DROP COLUMN IF EXISTS embedding_updated_at;
