-- ============================================================================
-- Sanskrit Lexicon Test Suite
-- ============================================================================
-- Run sections A and C in any environment (read-only safe)
-- Run section B only in writable environment (local dev or migration context)
-- ============================================================================

-- ============================================================================
-- SECTION A: Read-Only Tests (safe to run anywhere)
-- ============================================================================

\echo '=== SECTION A: Read-Only Search Tests ==='

-- A1. Exact search by IAST
\echo 'A1. Exact search for "dharma"'
SELECT id, word, word_devanagari, grammar, LEFT(meanings, 60) AS meanings_preview, relevance
FROM search_sanskrit_lexicon('dharma', 'exact')
LIMIT 5;

-- A2. Prefix search
\echo 'A2. Prefix search for "kṛṣ"'
SELECT id, word, word_devanagari, grammar, LEFT(meanings, 60) AS meanings_preview, relevance
FROM search_sanskrit_lexicon('kṛṣ', 'starts_with')
LIMIT 10;

-- A3. Contains search (normalized)
\echo 'A3. Contains search for "yoga"'
SELECT id, word, grammar, LEFT(meanings, 60) AS meanings_preview, relevance
FROM search_sanskrit_lexicon('yoga', 'contains')
LIMIT 10;

-- A4. Meaning search (uses meanings_tsv)
\echo 'A4. Meaning search for "truth"'
SELECT id, word, word_devanagari, grammar, LEFT(meanings, 80) AS meanings_preview, relevance
FROM search_sanskrit_by_meaning('truth')
LIMIT 10;

-- A5. Meaning search with multiple terms
\echo 'A5. Meaning search for "supreme lord"'
SELECT id, word, grammar, LEFT(meanings, 80) AS meanings_preview, relevance
FROM search_sanskrit_by_meaning('supreme lord')
LIMIT 10;

-- A6. Fuzzy search with typo (pg_trgm)
\echo 'A6. Fuzzy search for "krisna" (typo for kṛṣṇa)'
SELECT id, word, word_devanagari, grammar, LEFT(meanings, 60) AS meanings_preview, similarity
FROM search_sanskrit_fuzzy('krisna', 0.3)
LIMIT 10;

-- A7. Fuzzy search with another typo
\echo 'A7. Fuzzy search for "brahman" variations'
SELECT id, word, grammar, LEFT(meanings, 60) AS meanings_preview, similarity
FROM search_sanskrit_fuzzy('brahman', 0.4)
LIMIT 10;

-- A8. Grammar filter test
\echo 'A8. Search masculine nouns only containing "deva"'
SELECT id, word, grammar, LEFT(meanings, 60) AS meanings_preview, relevance
FROM search_sanskrit_lexicon('deva', 'contains', 'm')
LIMIT 10;

-- A9. Verify normalized column is populated
\echo 'A9. Check word_normalized population (should be 0 NULLs)'
SELECT
  COUNT(*) AS total_rows,
  COUNT(word_normalized) AS normalized_count,
  COUNT(*) - COUNT(word_normalized) AS null_count
FROM sanskrit_lexicon;

-- A10. Verify meanings_tsv column is populated
\echo 'A10. Check meanings_tsv population'
SELECT
  COUNT(*) AS total_rows,
  COUNT(meanings_tsv) AS tsv_count,
  COUNT(meanings) AS meanings_count
FROM sanskrit_lexicon;


-- ============================================================================
-- SECTION B: Writable Tests (run in local dev or writable context only)
-- ============================================================================

\echo '=== SECTION B: Writable Trigger Tests ==='
\echo 'NOTE: Skip this section if in read-only mode'

-- Check if we can write (will fail gracefully in read-only)
DO $$
DECLARE
  is_readonly BOOLEAN;
BEGIN
  -- Try to detect read-only mode
  BEGIN
    -- Attempt a savepoint to test writability
    PERFORM 1;

    -- B1. Test word_normalized auto-trigger
    RAISE NOTICE 'B1. Testing word_normalized auto-trigger...';

    INSERT INTO sanskrit_lexicon (id, word, grammar, meanings)
    VALUES (999999999, 'Teśtāīūṛ', 'm', 'test entry for trigger validation');

    -- Verify normalization happened
    IF EXISTS (
      SELECT 1 FROM sanskrit_lexicon
      WHERE id = 999999999
        AND word_normalized = 'testaiur'
        AND meanings_tsv IS NOT NULL
    ) THEN
      RAISE NOTICE 'SUCCESS: word_normalized = "testaiur", meanings_tsv populated';
    ELSE
      RAISE WARNING 'FAILED: Trigger did not work as expected';
    END IF;

    -- Cleanup
    DELETE FROM sanskrit_lexicon WHERE id = 999999999;
    RAISE NOTICE 'B1. Cleanup complete';

    -- B2. Test meanings_tsv update trigger
    RAISE NOTICE 'B2. Testing meanings_tsv update trigger...';

    INSERT INTO sanskrit_lexicon (id, word, grammar, meanings)
    VALUES (999999998, 'triggertest', 'm', 'initial meaning');

    UPDATE sanskrit_lexicon
    SET meanings = 'updated meaning with knowledge'
    WHERE id = 999999998;

    -- Verify tsvector updated
    IF EXISTS (
      SELECT 1 FROM sanskrit_lexicon
      WHERE id = 999999998
        AND meanings_tsv @@ to_tsquery('english', 'knowledge')
    ) THEN
      RAISE NOTICE 'SUCCESS: meanings_tsv updated correctly';
    ELSE
      RAISE WARNING 'FAILED: meanings_tsv not updated on UPDATE';
    END IF;

    -- Cleanup
    DELETE FROM sanskrit_lexicon WHERE id = 999999998;
    RAISE NOTICE 'B2. Cleanup complete';

  EXCEPTION
    WHEN read_only_sql_transaction THEN
      RAISE NOTICE 'SKIPPED: Database is in read-only mode. Run Section B in writable context.';
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'SKIPPED: Insufficient privileges for write operations.';
  END;
END $$;


-- ============================================================================
-- SECTION C: EXPLAIN ANALYZE (read-only, performance validation)
-- ============================================================================

\echo '=== SECTION C: EXPLAIN ANALYZE Performance Tests ==='

-- C1. Meaning search should use meanings_tsv GIN index
\echo 'C1. EXPLAIN ANALYZE: search_sanskrit_by_meaning'
EXPLAIN ANALYZE
SELECT * FROM search_sanskrit_by_meaning('knowledge');

-- C2. Fuzzy search should use trigram index
\echo 'C2. EXPLAIN ANALYZE: search_sanskrit_fuzzy'
EXPLAIN ANALYZE
SELECT * FROM search_sanskrit_fuzzy('atman', 0.3);

-- C3. Direct trigram operator usage
\echo 'C3. EXPLAIN ANALYZE: Direct trigram % operator'
EXPLAIN ANALYZE
SELECT id, word, word_normalized
FROM sanskrit_lexicon
WHERE word_normalized % 'dharma'
LIMIT 20;

-- C4. Prefix search performance
\echo 'C4. EXPLAIN ANALYZE: Prefix search'
EXPLAIN ANALYZE
SELECT * FROM search_sanskrit_lexicon('sam', 'starts_with', NULL, 20);

-- C5. FTS on meanings_tsv (raw query)
\echo 'C5. EXPLAIN ANALYZE: Raw FTS on meanings_tsv'
EXPLAIN ANALYZE
SELECT id, word, meanings
FROM sanskrit_lexicon
WHERE meanings_tsv @@ plainto_tsquery('english', 'devotion supreme')
ORDER BY ts_rank(meanings_tsv, plainto_tsquery('english', 'devotion supreme')) DESC
LIMIT 20;


-- ============================================================================
-- Summary
-- ============================================================================
\echo ''
\echo '=== Test Summary ==='
\echo 'Section A: Read-only search tests - should all return results'
\echo 'Section B: Trigger tests - run in writable environment only'
\echo 'Section C: EXPLAIN ANALYZE - check for index usage (Bitmap Index Scan on GIN indexes)'
\echo ''
\echo 'Expected index patterns in EXPLAIN output:'
\echo '  - "Bitmap Index Scan on idx_sanskrit_lexicon_meanings_tsv_gin" for meaning searches'
\echo '  - "Bitmap Index Scan on idx_sanskrit_lexicon_wordnorm_trgm" for fuzzy searches'
\echo '  - "Index Scan on idx_sanskrit_lexicon_word_normalized" for exact/prefix searches'
