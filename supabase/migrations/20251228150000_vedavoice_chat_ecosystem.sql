-- ============================================================================
-- VedaVOICE Chat Ecosystem Migration
-- Version: 1.0
-- Description: Creates the foundation for AI-powered Q&A system
-- ============================================================================

-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- ============================================================================
-- TATTVA TAXONOMY SYSTEM
-- Philosophical concept categorization for intelligent retrieval
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tattvas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_uk TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_uk TEXT,
  description_en TEXT,
  parent_id UUID REFERENCES public.tattvas(id) ON DELETE SET NULL,
  category TEXT CHECK (category IN ('sambandha', 'abhidheya', 'prayojana')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for parent lookups
CREATE INDEX IF NOT EXISTS idx_tattvas_parent ON public.tattvas(parent_id);
CREATE INDEX IF NOT EXISTS idx_tattvas_category ON public.tattvas(category);
CREATE INDEX IF NOT EXISTS idx_tattvas_slug ON public.tattvas(slug);

-- ============================================================================
-- CONTENT-TATTVA RELATIONSHIP (Many-to-Many)
-- Links verses/content to philosophical concepts
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.content_tattvas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_id UUID REFERENCES public.verses(id) ON DELETE CASCADE,
  lecture_id UUID,  -- References lectures table
  letter_id UUID,   -- References letters table
  tattva_id UUID REFERENCES public.tattvas(id) ON DELETE CASCADE NOT NULL,
  relevance_score FLOAT DEFAULT 1.0 CHECK (relevance_score >= 0 AND relevance_score <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_verse_tattva UNIQUE (verse_id, tattva_id),
  CONSTRAINT check_single_content_type CHECK (
    (verse_id IS NOT NULL AND lecture_id IS NULL AND letter_id IS NULL) OR
    (verse_id IS NULL AND lecture_id IS NOT NULL AND letter_id IS NULL) OR
    (verse_id IS NULL AND lecture_id IS NULL AND letter_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_content_tattvas_verse ON public.content_tattvas(verse_id);
CREATE INDEX IF NOT EXISTS idx_content_tattvas_tattva ON public.content_tattvas(tattva_id);
CREATE INDEX IF NOT EXISTS idx_content_tattvas_relevance ON public.content_tattvas(relevance_score DESC);

-- ============================================================================
-- CROSS-REFERENCES BETWEEN CONTENT
-- Track quotes, elaborations, and parallel teachings
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.cross_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_verse_id UUID REFERENCES public.verses(id) ON DELETE CASCADE,
  target_verse_id UUID REFERENCES public.verses(id) ON DELETE CASCADE,
  reference_type TEXT NOT NULL CHECK (reference_type IN ('quote', 'elaboration', 'parallel', 'commentary')),
  context_uk TEXT,
  context_en TEXT,
  auto_detected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT different_verses CHECK (source_verse_id != target_verse_id)
);

CREATE INDEX IF NOT EXISTS idx_cross_refs_source ON public.cross_references(source_verse_id);
CREATE INDEX IF NOT EXISTS idx_cross_refs_target ON public.cross_references(target_verse_id);
CREATE INDEX IF NOT EXISTS idx_cross_refs_type ON public.cross_references(reference_type);

-- ============================================================================
-- CHAT SESSIONS
-- Stores conversation sessions for Q&A
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT,
  language TEXT DEFAULT 'uk' CHECK (language IN ('uk', 'en')),
  is_archived BOOLEAN DEFAULT FALSE,
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created ON public.chat_sessions(created_at DESC);

-- ============================================================================
-- CHAT MESSAGES
-- Individual messages within a chat session
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  -- Citation data: references to source material
  citations JSONB DEFAULT '[]'::jsonb,
  -- Response classification
  response_level TEXT CHECK (response_level IN ('direct', 'synthesis', 'insufficient')),
  -- Related topics suggested when insufficient
  related_topics JSONB DEFAULT '[]'::jsonb,
  -- Token usage for analytics
  input_tokens INTEGER,
  output_tokens INTEGER,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON public.chat_messages(role);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON public.chat_messages(created_at);

-- ============================================================================
-- VECTOR EMBEDDINGS FOR SEMANTIC SEARCH
-- Add embedding column to verses table
-- ============================================================================

-- Add embedding column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'verses' AND column_name = 'embedding'
  ) THEN
    ALTER TABLE public.verses ADD COLUMN embedding vector(1536);
  END IF;
END $$;

-- Create IVFFlat index for fast vector similarity search
-- Note: This index should be created after embedding data is populated
-- For now, we create a placeholder comment

-- Add embedding last updated timestamp
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'verses' AND column_name = 'embedding_updated_at'
  ) THEN
    ALTER TABLE public.verses ADD COLUMN embedding_updated_at TIMESTAMPTZ;
  END IF;
END $$;

-- ============================================================================
-- SEMANTIC SEARCH FUNCTION
-- Performs vector similarity search on verses
-- ============================================================================

CREATE OR REPLACE FUNCTION public.semantic_search_verses(
  query_embedding vector(1536),
  similarity_threshold FLOAT DEFAULT 0.5,
  match_count INTEGER DEFAULT 10,
  filter_book_ids TEXT[] DEFAULT NULL,
  language_code TEXT DEFAULT 'uk'
)
RETURNS TABLE (
  id UUID,
  verse_number TEXT,
  chapter_id UUID,
  book_slug TEXT,
  chapter_number INTEGER,
  sanskrit TEXT,
  transliteration TEXT,
  translation TEXT,
  commentary TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.verse_number,
    v.chapter_id,
    b.slug AS book_slug,
    c.chapter_number,
    v.sanskrit,
    COALESCE(v.transliteration, v.transliteration_ua) AS transliteration,
    CASE WHEN language_code = 'uk'
      THEN COALESCE(v.translation_ua, v.translation_en)
      ELSE COALESCE(v.translation_en, v.translation_ua)
    END AS translation,
    CASE WHEN language_code = 'uk'
      THEN COALESCE(v.commentary_ua, v.commentary_en)
      ELSE COALESCE(v.commentary_en, v.commentary_ua)
    END AS commentary,
    1 - (v.embedding <=> query_embedding) AS similarity
  FROM public.verses v
  JOIN public.chapters c ON v.chapter_id = c.id
  JOIN public.books b ON c.book_id = b.id
  WHERE
    v.embedding IS NOT NULL
    AND v.deleted_at IS NULL
    AND (filter_book_ids IS NULL OR b.id::text = ANY(filter_book_ids))
    AND 1 - (v.embedding <=> query_embedding) > similarity_threshold
  ORDER BY v.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================================================
-- HYBRID SEARCH FUNCTION
-- Combines semantic (vector) and full-text search
-- ============================================================================

CREATE OR REPLACE FUNCTION public.hybrid_search_verses(
  query_text TEXT,
  query_embedding vector(1536) DEFAULT NULL,
  semantic_weight FLOAT DEFAULT 0.5,
  match_count INTEGER DEFAULT 10,
  filter_book_ids TEXT[] DEFAULT NULL,
  language_code TEXT DEFAULT 'uk'
)
RETURNS TABLE (
  id UUID,
  verse_number TEXT,
  chapter_id UUID,
  book_slug TEXT,
  chapter_number INTEGER,
  sanskrit TEXT,
  transliteration TEXT,
  translation TEXT,
  commentary TEXT,
  semantic_score FLOAT,
  fulltext_score FLOAT,
  combined_score FLOAT
)
LANGUAGE plpgsql
AS $$
DECLARE
  fulltext_weight FLOAT := 1 - semantic_weight;
BEGIN
  RETURN QUERY
  WITH semantic_results AS (
    SELECT
      v.id,
      1 - (v.embedding <=> query_embedding) AS score
    FROM public.verses v
    JOIN public.chapters c ON v.chapter_id = c.id
    JOIN public.books b ON c.book_id = b.id
    WHERE
      query_embedding IS NOT NULL
      AND v.embedding IS NOT NULL
      AND v.deleted_at IS NULL
      AND (filter_book_ids IS NULL OR b.id::text = ANY(filter_book_ids))
  ),
  fulltext_results AS (
    SELECT
      v.id,
      ts_rank_cd(v.search_vector, plainto_tsquery('simple', query_text)) AS score
    FROM public.verses v
    JOIN public.chapters c ON v.chapter_id = c.id
    JOIN public.books b ON c.book_id = b.id
    WHERE
      v.search_vector @@ plainto_tsquery('simple', query_text)
      AND v.deleted_at IS NULL
      AND (filter_book_ids IS NULL OR b.id::text = ANY(filter_book_ids))
  ),
  combined AS (
    SELECT
      COALESCE(s.id, f.id) AS id,
      COALESCE(s.score, 0) AS semantic_score,
      COALESCE(f.score, 0) AS fulltext_score,
      (COALESCE(s.score, 0) * semantic_weight + COALESCE(f.score, 0) * fulltext_weight) AS combined_score
    FROM semantic_results s
    FULL OUTER JOIN fulltext_results f ON s.id = f.id
    WHERE COALESCE(s.score, 0) > 0.3 OR COALESCE(f.score, 0) > 0
  )
  SELECT
    v.id,
    v.verse_number,
    v.chapter_id,
    b.slug AS book_slug,
    c.chapter_number,
    v.sanskrit,
    COALESCE(v.transliteration, v.transliteration_ua) AS transliteration,
    CASE WHEN language_code = 'uk'
      THEN COALESCE(v.translation_ua, v.translation_en)
      ELSE COALESCE(v.translation_en, v.translation_ua)
    END AS translation,
    CASE WHEN language_code = 'uk'
      THEN COALESCE(v.commentary_ua, v.commentary_en)
      ELSE COALESCE(v.commentary_en, v.commentary_ua)
    END AS commentary,
    combined.semantic_score,
    combined.fulltext_score,
    combined.combined_score
  FROM combined
  JOIN public.verses v ON combined.id = v.id
  JOIN public.chapters c ON v.chapter_id = c.id
  JOIN public.books b ON c.book_id = b.id
  ORDER BY combined.combined_score DESC
  LIMIT match_count;
END;
$$;

-- ============================================================================
-- TATTVA TAXONOMY SEED DATA
-- Core philosophical categories
-- ============================================================================

INSERT INTO public.tattvas (name_uk, name_en, slug, category, description_uk, description_en, display_order)
VALUES
  -- Sambandha (Relationship) Tattvas
  ('Крішна-таттва', 'Krishna-tattva', 'krishna-tattva', 'sambandha',
   'Наука про Верховну Особистість Бога Крішну',
   'Science of the Supreme Personality of Godhead Krishna', 1),
  ('Джіва-таттва', 'Jiva-tattva', 'jiva-tattva', 'sambandha',
   'Наука про живі істоти та їхнє вічне становище',
   'Science of the living entities and their eternal position', 2),
  ('Майя-таттва', 'Maya-tattva', 'maya-tattva', 'sambandha',
   'Наука про ілюзорну енергію та матеріальний світ',
   'Science of the illusory energy and material world', 3),
  ('Шакті-таттва', 'Shakti-tattva', 'shakti-tattva', 'sambandha',
   'Наука про енергії Господа',
   'Science of the Lord''s energies', 4),

  -- Abhidheya (Process) Tattvas
  ('Бгакті-таттва', 'Bhakti-tattva', 'bhakti-tattva', 'abhidheya',
   'Наука про відданість та любовне служіння',
   'Science of devotion and loving service', 5),
  ('Садгана-таттва', 'Sadhana-tattva', 'sadhana-tattva', 'abhidheya',
   'Наука про практику духовного розвитку',
   'Science of spiritual practice', 6),
  ('Дікша-таттва', 'Diksha-tattva', 'diksha-tattva', 'abhidheya',
   'Наука про духовне посвячення',
   'Science of spiritual initiation', 7),
  ('Шікша-таттва', 'Shiksha-tattva', 'shiksha-tattva', 'abhidheya',
   'Наука про духовне навчання',
   'Science of spiritual instruction', 8),

  -- Prayojana (Goal) Tattvas
  ('Према-таттва', 'Prema-tattva', 'prema-tattva', 'prayojana',
   'Наука про чисту любов до Бога',
   'Science of pure love of God', 9),
  ('Раса-таттва', 'Rasa-tattva', 'rasa-tattva', 'prayojana',
   'Наука про духовні смаки та відносини',
   'Science of spiritual mellows and relationships', 10),
  ('Нітья-ліла', 'Nitya-lila', 'nitya-lila', 'prayojana',
   'Вічні ігри Господа',
   'Eternal pastimes of the Lord', 11)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE public.tattvas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tattvas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cross_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Tattvas: Everyone can read
CREATE POLICY "Tattvas are viewable by everyone" ON public.tattvas
  FOR SELECT USING (true);

-- Content-Tattvas: Everyone can read
CREATE POLICY "Content-tattvas are viewable by everyone" ON public.content_tattvas
  FOR SELECT USING (true);

-- Cross-references: Everyone can read
CREATE POLICY "Cross-references are viewable by everyone" ON public.cross_references
  FOR SELECT USING (true);

-- Chat Sessions: Users can only see their own sessions
CREATE POLICY "Users can view their own chat sessions" ON public.chat_sessions
  FOR SELECT USING (
    auth.uid() = user_id OR user_id IS NULL
  );

CREATE POLICY "Users can create their own chat sessions" ON public.chat_sessions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );

CREATE POLICY "Users can update their own chat sessions" ON public.chat_sessions
  FOR UPDATE USING (
    auth.uid() = user_id
  );

-- Chat Messages: Users can see messages in their sessions
CREATE POLICY "Users can view messages in their sessions" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions cs
      WHERE cs.id = session_id
      AND (cs.user_id = auth.uid() OR cs.user_id IS NULL)
    )
  );

CREATE POLICY "Users can create messages in their sessions" ON public.chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions cs
      WHERE cs.id = session_id
      AND (cs.user_id = auth.uid() OR cs.user_id IS NULL)
    )
  );

-- ============================================================================
-- TRIGGER TO UPDATE CHAT SESSION TIMESTAMP AND MESSAGE COUNT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_chat_session_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.chat_sessions
  SET
    updated_at = NOW(),
    message_count = message_count + 1
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_chat_session ON public.chat_messages;
CREATE TRIGGER trigger_update_chat_session
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_chat_session_on_message();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.tattvas IS 'Philosophical concept taxonomy for categorizing spiritual teachings';
COMMENT ON TABLE public.content_tattvas IS 'Many-to-many relationship between content and philosophical concepts';
COMMENT ON TABLE public.cross_references IS 'Cross-references between verses showing quotes, elaborations, parallels';
COMMENT ON TABLE public.chat_sessions IS 'AI Q&A chat sessions for VedaVOICE';
COMMENT ON TABLE public.chat_messages IS 'Individual messages within a chat session';
COMMENT ON COLUMN public.verses.embedding IS 'Vector embedding for semantic search (1536 dimensions)';
COMMENT ON FUNCTION public.semantic_search_verses IS 'Performs pure vector similarity search on verses';
COMMENT ON FUNCTION public.hybrid_search_verses IS 'Combines semantic and full-text search with configurable weights';
