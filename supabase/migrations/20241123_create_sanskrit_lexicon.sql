-- Sanskrit Lexicon from Digital Corpus of Sanskrit (DCS)
-- Source: https://github.com/OliverHellwig/sanskrit
-- License: CC BY 4.0

-- Main lexicon table
CREATE TABLE IF NOT EXISTS sanskrit_lexicon (
  id BIGINT PRIMARY KEY,  -- Original DCS ID (permanent identifier)
  word TEXT NOT NULL,     -- Sanskrit word in IAST transliteration
  word_devanagari TEXT,   -- Sanskrit word in Devanagari script (generated)
  grammar TEXT,           -- Part of speech: m (masculine), f (feminine), n (neuter), adj, ind, etc.
  preverbs TEXT,          -- Verbal prefixes
  meanings TEXT,          -- English meanings (semicolon separated)

  -- Search optimization
  word_normalized TEXT,   -- Normalized for search (lowercase, no diacritics)

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast search
CREATE INDEX IF NOT EXISTS idx_sanskrit_lexicon_word ON sanskrit_lexicon(word);
CREATE INDEX IF NOT EXISTS idx_sanskrit_lexicon_word_normalized ON sanskrit_lexicon(word_normalized);
CREATE INDEX IF NOT EXISTS idx_sanskrit_lexicon_grammar ON sanskrit_lexicon(grammar);

-- Full-text search index for meanings
CREATE INDEX IF NOT EXISTS idx_sanskrit_lexicon_meanings_gin ON sanskrit_lexicon
  USING gin(to_tsvector('english', COALESCE(meanings, '')));

-- Trigram index for fuzzy search (requires pg_trgm extension)
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX IF NOT EXISTS idx_sanskrit_lexicon_word_trgm ON sanskrit_lexicon USING gin(word gin_trgm_ops);

-- Function to normalize Sanskrit words for search
CREATE OR REPLACE FUNCTION normalize_sanskrit_word(word TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    TRANSLATE(
      word,
      'āīūṛṝḷḹēōṃḥṅñṭḍṇśṣĀĪŪṚṜḶḸĒŌṂḤṄÑṬḌṆŚṢ',
      'aiurlleomhnnttnsssaiurlleomhnnttnsss'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Search function for Sanskrit words
CREATE OR REPLACE FUNCTION search_sanskrit_lexicon(
  search_term TEXT,
  search_mode TEXT DEFAULT 'contains',  -- 'exact', 'starts_with', 'contains'
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
  relevance FLOAT
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
    CASE
      WHEN l.word_normalized = normalized_term THEN 1.0
      WHEN l.word_normalized LIKE normalized_term || '%' THEN 0.8
      WHEN l.word_normalized LIKE '%' || normalized_term || '%' THEN 0.5
      ELSE 0.3
    END::FLOAT as relevance
  FROM sanskrit_lexicon l
  WHERE
    (grammar_filter IS NULL OR l.grammar = grammar_filter)
    AND (
      CASE search_mode
        WHEN 'exact' THEN l.word_normalized = normalized_term
        WHEN 'starts_with' THEN l.word_normalized LIKE normalized_term || '%'
        ELSE l.word_normalized LIKE '%' || normalized_term || '%'
      END
      OR l.word = search_term  -- Also match exact IAST
    )
  ORDER BY relevance DESC, LENGTH(l.word) ASC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Search by English meaning
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
    ts_rank(to_tsvector('english', COALESCE(l.meanings, '')), plainto_tsquery('english', search_term))::FLOAT as relevance
  FROM sanskrit_lexicon l
  WHERE to_tsvector('english', COALESCE(l.meanings, '')) @@ plainto_tsquery('english', search_term)
  ORDER BY relevance DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Get word by ID
CREATE OR REPLACE FUNCTION get_sanskrit_word(word_id BIGINT)
RETURNS TABLE (
  id BIGINT,
  word TEXT,
  word_devanagari TEXT,
  grammar TEXT,
  preverbs TEXT,
  meanings TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.word,
    l.word_devanagari,
    l.grammar,
    l.preverbs,
    l.meanings
  FROM sanskrit_lexicon l
  WHERE l.id = word_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security
ALTER TABLE sanskrit_lexicon ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Sanskrit lexicon is publicly readable"
  ON sanskrit_lexicon
  FOR SELECT
  TO public
  USING (true);

-- Comment for attribution
COMMENT ON TABLE sanskrit_lexicon IS 'Sanskrit lexicon from Digital Corpus of Sanskrit (DCS) by Oliver Hellwig. License: CC BY 4.0. Citation: Oliver Hellwig: Digital Corpus of Sanskrit (DCS). 2010-2024.';
