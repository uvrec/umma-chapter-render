/**
 * Semantic Search Service
 *
 * Provides hybrid search capabilities combining:
 * - Vector similarity search (semantic understanding)
 * - Full-text search (keyword matching)
 *
 * Designed for the VedaVOICE ecosystem to find relevant
 * verses and teachings from Srila Prabhupada's works.
 */

import { supabase } from "@/integrations/supabase/client";

// ============================================================================
// TYPES
// ============================================================================

export interface SearchResult {
  id: string;
  verseNumber: string;
  chapterId: string;
  bookSlug: string;
  chapterNumber: number;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  commentary?: string;
  semanticScore?: number;
  fulltextScore?: number;
  combinedScore?: number;
}

export interface SearchOptions {
  query: string;
  language?: 'ua' | 'en';
  bookIds?: string[];
  limit?: number;
  includeCommentary?: boolean;
  includeSanskrit?: boolean;
  includeTransliteration?: boolean;
  useSemantic?: boolean;
  semanticWeight?: number;
}

// ============================================================================
// QUERY EXPANSION
// ============================================================================

/**
 * Sanskrit/spiritual term synonyms for query expansion
 */
const TERM_SYNONYMS: Record<string, string[]> = {
  // Soul-related
  'душа': ['atma', 'jiva', 'soul', 'spirit'],
  'soul': ['atma', 'jiva', 'душа', 'spirit'],
  'atma': ['soul', 'spirit', 'душа', 'self'],

  // God-related
  'бог': ['krishna', 'bhagavan', 'god', 'lord', 'supreme'],
  'god': ['krishna', 'bhagavan', 'бог', 'lord', 'supreme'],
  'krishna': ['god', 'bhagavan', 'бог', 'lord', 'supreme', 'кришна'],
  'крішна': ['krishna', 'god', 'bhagavan', 'бог'],

  // Practice-related
  'медитація': ['meditation', 'dhyana', 'contemplation'],
  'meditation': ['dhyana', 'медитація', 'contemplation'],
  'йога': ['yoga', 'union', 'practice'],
  'yoga': ['йога', 'union', 'practice', 'devotion'],

  // Devotion-related
  'відданість': ['devotion', 'bhakti', 'service'],
  'devotion': ['bhakti', 'відданість', 'service', 'love'],
  'bhakti': ['devotion', 'відданість', 'love', 'service'],

  // Knowledge-related
  'знання': ['knowledge', 'jnana', 'wisdom'],
  'knowledge': ['jnana', 'знання', 'wisdom', 'understanding'],

  // Karma-related
  'карма': ['karma', 'action', 'work', 'duty'],
  'karma': ['карма', 'action', 'work', 'fruit', 'result'],

  // Liberation-related
  'звільнення': ['liberation', 'moksha', 'mukti', 'freedom'],
  'liberation': ['moksha', 'mukti', 'звільнення', 'freedom'],

  // Material world
  'матерія': ['matter', 'material', 'prakriti', 'nature'],
  'maya': ['illusion', 'ілюзія', 'material energy'],
  'ілюзія': ['maya', 'illusion', 'material energy'],

  // Guru-related
  'вчитель': ['guru', 'teacher', 'master', 'acharya'],
  'guru': ['вчитель', 'teacher', 'master', 'spiritual master'],

  // Reincarnation
  'реінкарнація': ['reincarnation', 'transmigration', 'rebirth'],
  'reincarnation': ['реінкарнація', 'transmigration', 'rebirth', 'changing bodies'],
};

/**
 * Expand query with synonyms and related terms
 */
export function expandQuery(query: string): string {
  let expandedQuery = query.toLowerCase();
  const additionalTerms: string[] = [];

  for (const [term, synonyms] of Object.entries(TERM_SYNONYMS)) {
    if (expandedQuery.includes(term.toLowerCase())) {
      additionalTerms.push(...synonyms);
    }
  }

  // Remove duplicates and add to query
  const uniqueTerms = [...new Set(additionalTerms)];
  if (uniqueTerms.length > 0) {
    expandedQuery = `${query} ${uniqueTerms.join(' ')}`;
  }

  return expandedQuery;
}

// ============================================================================
// SEARCH FUNCTIONS
// ============================================================================

/**
 * Perform full-text search using existing database function
 */
export async function fulltextSearch(options: SearchOptions): Promise<SearchResult[]> {
  const {
    query,
    language = 'ua',
    bookIds,
    limit = 10,
    includeCommentary = true,
    includeSanskrit = false,
    includeTransliteration = false,
  } = options;

  try {
    const { data, error } = await supabase.rpc('search_verses_fulltext', {
      search_query: query,
      language_code: language === 'ua' ? 'uk' : 'en',
      include_translation: true,
      include_commentary: includeCommentary,
      include_synonyms: true,
      include_transliteration: includeTransliteration,
      include_sanskrit: includeSanskrit,
      book_ids: bookIds,
      limit_count: limit,
    });

    if (error) {
      console.error('Fulltext search error:', error);
      return [];
    }

    return (data || []).map((result: Record<string, unknown>) => ({
      id: result.id as string,
      verseNumber: result.verse_number as string,
      chapterId: result.chapter_id as string,
      bookSlug: result.book_slug as string,
      chapterNumber: result.chapter_number as number,
      sanskrit: result.sanskrit as string | undefined,
      transliteration: result.transliteration as string | undefined,
      translation: (result.translation_snippet || result.translation) as string | undefined,
      commentary: (result.commentary_snippet || result.commentary) as string | undefined,
      fulltextScore: result.rank as number | undefined,
    }));
  } catch (error) {
    console.error('Fulltext search error:', error);
    return [];
  }
}

/**
 * Perform hybrid search (semantic + fulltext)
 * Falls back to fulltext-only if semantic search is not available
 */
export async function hybridSearch(options: SearchOptions): Promise<SearchResult[]> {
  const {
    query,
    language = 'ua',
    bookIds,
    limit = 10,
    semanticWeight = 0.6,
  } = options;

  // First, try expanded fulltext search
  const expandedQuery = expandQuery(query);

  try {
    // Try hybrid search (requires embeddings to be populated)
    const { data: hybridData, error: hybridError } = await supabase.rpc('hybrid_search_verses', {
      query_text: query,
      query_embedding: null, // Will be null until embeddings are generated
      semantic_weight: semanticWeight,
      match_count: limit,
      filter_book_ids: bookIds,
      language_code: language === 'ua' ? 'uk' : 'en',
    });

    if (!hybridError && hybridData && hybridData.length > 0) {
      return hybridData.map((result: Record<string, unknown>) => ({
        id: result.id as string,
        verseNumber: result.verse_number as string,
        chapterId: result.chapter_id as string,
        bookSlug: result.book_slug as string,
        chapterNumber: result.chapter_number as number,
        sanskrit: result.sanskrit as string | undefined,
        transliteration: result.transliteration as string | undefined,
        translation: result.translation as string | undefined,
        commentary: result.commentary as string | undefined,
        semanticScore: result.semantic_score as number | undefined,
        fulltextScore: result.fulltext_score as number | undefined,
        combinedScore: result.combined_score as number | undefined,
      }));
    }
  } catch (error) {
    console.warn('Hybrid search not available, falling back to fulltext:', error);
  }

  // Fallback to fulltext search with expanded query
  return fulltextSearch({
    ...options,
    query: expandedQuery,
  });
}

/**
 * Search for verses related to a specific tattva (philosophical concept)
 */
export async function searchByTattva(
  tattvaSlug: string,
  options: Omit<SearchOptions, 'query'> = {}
): Promise<SearchResult[]> {
  const { language = 'ua', limit = 10 } = options;

  try {
    // First get the tattva
    const { data: tattva } = await supabase
      .from('tattvas')
      .select('id')
      .eq('slug', tattvaSlug)
      .single();

    if (!tattva) {
      console.warn('Tattva not found:', tattvaSlug);
      return [];
    }

    // Get verses linked to this tattva
    const { data: contentTattvas } = await supabase
      .from('content_tattvas')
      .select(`
        verse_id,
        relevance_score,
        verses!inner(
          id,
          verse_number,
          chapter_id,
          sanskrit,
          transliteration_ua,
          translation_ua,
          translation_en,
          commentary_ua,
          commentary_en,
          chapters!inner(
            chapter_number,
            books!inner(slug)
          )
        )
      `)
      .eq('tattva_id', tattva.id)
      .order('relevance_score', { ascending: false })
      .limit(limit);

    if (!contentTattvas) {
      return [];
    }

    return contentTattvas.map((ct: Record<string, unknown>) => {
      const verse = ct.verses as Record<string, unknown>;
      const chapter = verse.chapters as Record<string, unknown>;
      const book = chapter.books as Record<string, unknown>;

      return {
        id: verse.id as string,
        verseNumber: verse.verse_number as string,
        chapterId: verse.chapter_id as string,
        bookSlug: book.slug as string,
        chapterNumber: chapter.chapter_number as number,
        sanskrit: verse.sanskrit as string | undefined,
        transliteration: verse.transliteration_ua as string | undefined,
        translation: language === 'ua'
          ? (verse.translation_ua || verse.translation_en) as string | undefined
          : (verse.translation_en || verse.translation_ua) as string | undefined,
        commentary: language === 'ua'
          ? (verse.commentary_ua || verse.commentary_en) as string | undefined
          : (verse.commentary_en || verse.commentary_ua) as string | undefined,
        combinedScore: ct.relevance_score as number | undefined,
      };
    });
  } catch (error) {
    console.error('Tattva search error:', error);
    return [];
  }
}

/**
 * Get cross-references for a specific verse
 */
export async function getVerseReferences(verseId: string): Promise<SearchResult[]> {
  try {
    const { data } = await supabase
      .from('cross_references')
      .select(`
        reference_type,
        context_uk,
        context_en,
        target_verse:target_verse_id(
          id,
          verse_number,
          chapter_id,
          sanskrit,
          transliteration_ua,
          translation_ua,
          translation_en,
          chapters!inner(
            chapter_number,
            books!inner(slug)
          )
        )
      `)
      .eq('source_verse_id', verseId);

    if (!data) {
      return [];
    }

    return data.map((ref: Record<string, unknown>) => {
      const verse = ref.target_verse as Record<string, unknown>;
      const chapter = verse.chapters as Record<string, unknown>;
      const book = chapter.books as Record<string, unknown>;

      return {
        id: verse.id as string,
        verseNumber: verse.verse_number as string,
        chapterId: verse.chapter_id as string,
        bookSlug: book.slug as string,
        chapterNumber: chapter.chapter_number as number,
        sanskrit: verse.sanskrit as string | undefined,
        transliteration: verse.transliteration_ua as string | undefined,
        translation: (verse.translation_ua || verse.translation_en) as string | undefined,
      };
    });
  } catch (error) {
    console.error('Cross-reference search error:', error);
    return [];
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format a search result for display
 */
export function formatSearchResult(
  result: SearchResult,
  language: 'ua' | 'en' = 'ua'
): string {
  const bookAbbr = getBookAbbreviation(result.bookSlug, language);
  return `${bookAbbr} ${result.chapterNumber}.${result.verseNumber}`;
}

/**
 * Get book abbreviation based on slug
 */
function getBookAbbreviation(slug: string, language: 'ua' | 'en'): string {
  const abbreviations: Record<string, { ua: string; en: string }> = {
    'bg': { ua: 'БГ', en: 'BG' },
    'sb': { ua: 'ШБ', en: 'SB' },
    'cc': { ua: 'ЧЧ', en: 'CC' },
    'noi': { ua: 'НН', en: 'NOI' },
    'nod': { ua: 'НВ', en: 'NOD' },
    'iso': { ua: 'Ішо', en: 'ISO' },
  };

  return abbreviations[slug]?.[language] || slug.toUpperCase();
}
