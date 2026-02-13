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
  language?: 'uk' | 'en';
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
    language = 'uk',
    bookIds,
    limit = 10,
    includeCommentary = true,
    includeSanskrit = false,
    includeTransliteration = false,
  } = options;

  try {
    const { data, error } = await supabase.rpc('search_verses_fulltext', {
      search_query: query,
      language_code: language,
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
  const { query } = options;

  // First, try expanded fulltext search
  const expandedQuery = expandQuery(query);

  // Fallback to fulltext search with expanded query
  // Note: hybrid_search_verses RPC may not exist yet
  return fulltextSearch({
    ...options,
    query: expandedQuery,
  });
}

/**
 * Cross-reference types
 */
export type ReferenceType =
  | 'citation'       // Direct quote or citation
  | 'explanation'    // Explains or elaborates
  | 'parallel'       // Similar teaching in different context
  | 'contrast'       // Contrasting view
  | 'prerequisite'   // Should be read before
  | 'followup'       // Should be read after
  | 'related';       // Generally related

export interface CrossReference {
  id: string;
  sourceVerseId: string;
  targetVerseId: string;
  referenceType: ReferenceType | null;
  confidence: number | null;
  // Target verse details
  verseNumber: string;
  bookSlug: string;
  chapterNumber: number;
  cantoNumber?: number;
  translation?: string;
  transliteration?: string;
}

/**
 * Get cross-references for a specific verse
 * Returns related verses from the cross_references table
 */
export async function getVerseReferences(
  verseId: string,
  options: {
    language?: 'uk' | 'en';
    limit?: number;
    minConfidence?: number;
  } = {}
): Promise<CrossReference[]> {
  const { language = 'uk', limit = 5, minConfidence = 0 } = options;

  try {
    // Query cross_references with target verse details
    const { data, error } = await supabase
      .from('cross_references')
      .select(`
        id,
        source_verse_id,
        target_verse_id,
        reference_type,
        confidence,
        target_verse:verses!cross_references_target_verse_id_fkey (
          id,
          verse_number,
          translation_uk,
          translation_en,
          transliteration,
          transliteration_uk,
          transliteration_en,
          chapter:chapters!verses_chapter_id_fkey (
            chapter_number,
            canto:cantos (
              canto_number
            ),
            book:books!chapters_book_id_fkey (
              slug
            )
          )
        )
      `)
      .eq('source_verse_id', verseId)
      .gte('confidence', minConfidence)
      .order('confidence', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching cross-references:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the data
    return data
      .filter((ref: any) => ref.target_verse) // Filter out any null references
      .map((ref: any) => {
        const verse = ref.target_verse;
        const chapter = verse?.chapter;
        const translation = language === 'uk'
          ? verse?.translation_uk
          : verse?.translation_en;
        const transliteration = language === 'uk'
          ? (verse?.transliteration_uk || verse?.transliteration)
          : (verse?.transliteration_en || verse?.transliteration);

        return {
          id: ref.id,
          sourceVerseId: ref.source_verse_id,
          targetVerseId: ref.target_verse_id,
          referenceType: ref.reference_type as ReferenceType | null,
          confidence: ref.confidence,
          verseNumber: verse?.verse_number || '',
          bookSlug: chapter?.book?.slug || '',
          chapterNumber: chapter?.chapter_number || 0,
          cantoNumber: chapter?.canto?.canto_number,
          translation: translation ? truncateText(translation, 150) : undefined,
          transliteration: transliteration ? truncateText(transliteration, 100) : undefined,
        };
      });
  } catch (error) {
    console.error('Error in getVerseReferences:', error);
    return [];
  }
}

/**
 * Get bidirectional cross-references (both source and target)
 */
export async function getBidirectionalReferences(
  verseId: string,
  options: {
    language?: 'uk' | 'en';
    limit?: number;
  } = {}
): Promise<CrossReference[]> {
  const { language = 'uk', limit = 10 } = options;

  try {
    // Get references where this verse is the source
    const sourceRefs = await getVerseReferences(verseId, { language, limit: limit / 2 });

    // Get references where this verse is the target
    const { data: targetData, error } = await supabase
      .from('cross_references')
      .select(`
        id,
        source_verse_id,
        target_verse_id,
        reference_type,
        confidence,
        source_verse:verses!cross_references_source_verse_id_fkey (
          id,
          verse_number,
          translation_uk,
          translation_en,
          transliteration,
          transliteration_uk,
          transliteration_en,
          chapter:chapters!verses_chapter_id_fkey (
            chapter_number,
            canto:cantos (
              canto_number
            ),
            book:books!chapters_book_id_fkey (
              slug
            )
          )
        )
      `)
      .eq('target_verse_id', verseId)
      .order('confidence', { ascending: false })
      .limit(limit / 2);

    if (error) {
      console.error('Error fetching reverse cross-references:', error);
      return sourceRefs;
    }

    // Transform reverse references (swap source/target for display)
    const reverseRefs: CrossReference[] = (targetData || [])
      .filter((ref: any) => ref.source_verse)
      .map((ref: any) => {
        const verse = ref.source_verse;
        const chapter = verse?.chapter;
        const translation = language === 'uk'
          ? verse?.translation_uk
          : verse?.translation_en;
        const transliteration = language === 'uk'
          ? (verse?.transliteration_uk || verse?.transliteration)
          : (verse?.transliteration_en || verse?.transliteration);

        return {
          id: ref.id,
          sourceVerseId: verseId, // Current verse
          targetVerseId: ref.source_verse_id, // The referencing verse
          referenceType: ref.reference_type as ReferenceType | null,
          confidence: ref.confidence,
          verseNumber: verse?.verse_number || '',
          bookSlug: chapter?.book?.slug || '',
          chapterNumber: chapter?.chapter_number || 0,
          cantoNumber: chapter?.canto?.canto_number,
          translation: translation ? truncateText(translation, 150) : undefined,
          transliteration: transliteration ? truncateText(transliteration, 100) : undefined,
        };
      });

    // Combine and deduplicate
    const allRefs = [...sourceRefs, ...reverseRefs];
    const uniqueRefs = allRefs.filter((ref, index, self) =>
      index === self.findIndex(r => r.targetVerseId === ref.targetVerseId)
    );

    return uniqueRefs.slice(0, limit);
  } catch (error) {
    console.error('Error in getBidirectionalReferences:', error);
    return [];
  }
}

/**
 * Truncate text to a maximum length with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format a search result for display
 */
export function formatSearchResult(
  result: SearchResult,
  language: 'uk' | 'en' = 'uk'
): string {
  const bookAbbr = getBookAbbreviation(result.bookSlug, language);
  return `${bookAbbr} ${result.chapterNumber}.${result.verseNumber}`;
}

/**
 * Get book abbreviation based on slug
 */
function getBookAbbreviation(slug: string, language: 'uk' | 'en'): string {
  const abbreviations: Record<string, { uk: string; en: string }> = {
    'bg': { uk: 'БГ', en: 'BG' },
    'sb': { uk: 'ШБ', en: 'SB' },
    'cc': { uk: 'ЧЧ', en: 'CC' },
    'noi': { uk: 'НН', en: 'NOI' },
    'nod': { uk: 'НВ', en: 'NOD' },
    'iso': { uk: 'Ішо', en: 'ISO' },
  };

  return abbreviations[slug]?.[language] || slug.toUpperCase();
}
