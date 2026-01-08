-- Migration: Improve Sanskrit Lexicon Search Performance
-- Implements recommendations from code review:
-- 1. Enable pg_trgm extension for fuzzy search
-- 2. Add meanings_tsv column with auto-update trigger
-- 3. Add word_normalized auto-populate trigger
-- 4. Update search functions to use pre-computed tsvector

-- ============================================================================
-- 1. Enable pg_trgm extension for fuzzy/similarity search
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create trigram index for fuzzy search on normalized words
CREATE INDEX IF NOT EXISTS idx_sanskrit_lexicon_wordnorm_trgm
  ON sanskrit_lexicon USING gin (word_normalized gin_trgm_ops);

-- Also create trigram index on the original word for IAST search
CREATE INDEX IF NOT EXISTS idx_sanskrit_lexicon_word_trgm
  ON sanskrit_lexicon USING gin (word gin_trgm_ops);

-- ============================================================================
-- 2. Add meanings_tsv column for pre-computed full-text search vector
-- ============================================================================

-- Add the tsvector column if it doesn't exist
ALTER TABLE sanskrit_lexicon
  ADD COLUMN IF NOT EXISTS meanings_tsv tsvector;

-- Create trigger function to auto-update meanings_tsv
CREATE OR REPLACE FUNCTION update_sanskrit_meanings_tsv()
RETURNS TRIGGER AS $$
BEGIN
  NEW.meanings_tsv := to_tsvector('english', COALESCE(NEW.meanings, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS trig_update_sanskrit_meanings_tsv ON sanskrit_lexicon;

-- Create trigger to auto-update meanings_tsv on INSERT/UPDATE
CREATE TRIGGER trig_update_sanskrit_meanings_tsv
  BEFORE INSERT OR UPDATE OF meanings ON sanskrit_lexicon
  FOR EACH ROW
  EXECUTE FUNCTION update_sanskrit_meanings_tsv();

-- Populate existing rows with tsvector data
UPDATE sanskrit_lexicon
SET meanings_tsv = to_tsvector('english', COALESCE(meanings, ''))
WHERE meanings_tsv IS NULL OR meanings IS NOT NULL;

-- Create GIN index on the new tsvector column (more efficient than expression index)
DROP INDEX IF EXISTS idx_sanskrit_lexicon_meanings_gin;
CREATE INDEX idx_sanskrit_lexicon_meanings_tsv_gin
  ON sanskrit_lexicon USING gin (meanings_tsv);

-- ============================================================================
-- 3. Add word_normalized auto-populate trigger
-- ============================================================================

-- Create trigger function to auto-normalize word on INSERT/UPDATE
CREATE OR REPLACE FUNCTION update_sanskrit_word_normalized()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_normalized := normalize_sanskrit_word(NEW.word);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS trig_update_sanskrit_word_normalized ON sanskrit_lexicon;

-- Create trigger to auto-normalize word on INSERT/UPDATE
CREATE TRIGGER trig_update_sanskrit_word_normalized
  BEFORE INSERT OR UPDATE OF word ON sanskrit_lexicon
  FOR EACH ROW
  EXECUTE FUNCTION update_sanskrit_word_normalized();

-- Ensure all existing rows have normalized words
UPDATE sanskrit_lexicon
SET word_normalized = normalize_sanskrit_word(word)
WHERE word_normalized IS NULL AND word IS NOT NULL;

-- ============================================================================
-- 4. Update search functions to use pre-computed tsvector
-- ============================================================================

-- Improved search by English meaning using pre-computed tsvector
CREATE OR REPLACE FUNCTION search_sanskrit_by_meaning(
  search_term TEXT,
  result_limit INT DEFAULT 50
)
RETURNS TABLE (
  id BIGINT,
  word TEXT,
  word_devanagari TEXT,
  grammar TEXT,
  meanings TEXT,
  relevance FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.word,
    l.word_devanagari,
    l.grammar,
    l.meanings,
    ts_rank(l.meanings_tsv, plainto_tsquery('english', search_term))::FLOAT as relevance
  FROM sanskrit_lexicon l
  WHERE l.meanings_tsv @@ plainto_tsquery('english', search_term)
  ORDER BY relevance DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. Add fuzzy search function using trigram similarity
-- ============================================================================

-- Fuzzy search for Sanskrit words with typo tolerance
CREATE OR REPLACE FUNCTION search_sanskrit_fuzzy(
  search_term TEXT,
  similarity_threshold FLOAT DEFAULT 0.3,
  grammar_filter TEXT DEFAULT NULL,
  result_limit INT DEFAULT 50
)
RETURNS TABLE (
  id BIGINT,
  word TEXT,
  word_devanagari TEXT,
  grammar TEXT,
  preverbs TEXT,
  meanings TEXT,
  similarity FLOAT
) AS $$
DECLARE
  normalized_term TEXT;
BEGIN
  normalized_term := normalize_sanskrit_word(search_term);

  RETURN QUERY
  SELECT
    l.id,
    l.word,
    l.word_devanagari,
    l.grammar,
    l.preverbs,
    l.meanings,
    GREATEST(
      similarity(l.word_normalized, normalized_term),
      similarity(l.word, search_term)
    )::FLOAT as sim
  FROM sanskrit_lexicon l
  WHERE
    (grammar_filter IS NULL OR l.grammar = grammar_filter)
    AND (
      l.word_normalized % normalized_term
      OR l.word % search_term
    )
  ORDER BY sim DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Set the similarity threshold for the % operator (session default)
-- Users can adjust this with: SET pg_trgm.similarity_threshold = 0.3;

-- ============================================================================
-- Comments and attribution
-- ============================================================================

COMMENT ON COLUMN sanskrit_lexicon.meanings_tsv IS 'Pre-computed tsvector for full-text search on meanings';
COMMENT ON FUNCTION search_sanskrit_fuzzy IS 'Fuzzy search for Sanskrit words using trigram similarity (pg_trgm)';
COMMENT ON FUNCTION update_sanskrit_meanings_tsv IS 'Trigger function to auto-update meanings_tsv column';
COMMENT ON FUNCTION update_sanskrit_word_normalized IS 'Trigger function to auto-normalize word column';
