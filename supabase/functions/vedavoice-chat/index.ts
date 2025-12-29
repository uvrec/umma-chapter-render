/**
 * VedaVOICE Chat Edge Function
 *
 * AI-powered Q&A system that answers questions EXCLUSIVELY from the works
 * of A.C. Bhaktivedanta Swami Prabhupada using RAG (Retrieval Augmented Generation).
 *
 * Core Principles:
 * - Never speculate or add information not in the sources
 * - Always cite exact sources for every claim
 * - Respond in the user's preferred language (Ukrainian or English)
 *
 * REQUIRES AUTHENTICATION: User must be logged in
 *
 * POST /vedavoice-chat
 * Body: {
 *   message: string,        // User's question
 *   sessionId?: string,     // Optional session ID for conversation continuity
 *   language?: 'uk' | 'en', // Preferred language (default: 'uk')
 * }
 *
 * Response: {
 *   message: string,
 *   sessionId: string,
 *   citations: Citation[],
 *   responseLevel: 'direct' | 'synthesis' | 'insufficient',
 *   relatedTopics?: string[]
 * }
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// ============================================================================
// TYPES
// ============================================================================

interface Citation {
  verseId: string;
  quote: string;
  reference: string;      // e.g., "BG 2.14" or "SB 1.2.6"
  referenceType: 'book' | 'lecture' | 'letter';
  bookSlug?: string;
  chapterNumber?: number;
  verseNumber?: string;
  url: string;            // Link to VedaVOICE.org page
}

interface SearchResult {
  id: string;
  verse_number: string;
  chapter_id: string;
  book_slug: string;
  chapter_number: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
  commentary: string;
  semantic_score?: number;
  fulltext_score?: number;
  combined_score?: number;
  similarity?: number;
}

interface ChatRequest {
  message: string;
  sessionId?: string;
  language?: 'uk' | 'en';
}

interface ChatResponse {
  message: string;
  sessionId: string;
  citations: Citation[];
  responseLevel: 'direct' | 'synthesis' | 'insufficient';
  relatedTopics?: string[];
}

interface AuthResult {
  user: { id: string; email?: string };
  supabaseClient: ReturnType<typeof createClient>;
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

/**
 * Validate user authentication
 * Returns authenticated user or error Response
 */
async function validateAuth(req: Request): Promise<AuthResult | Response> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ error: "Supabase credentials not configured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Authorization header required" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  // Create client with user's auth context
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error } = await supabaseClient.auth.getUser();

  if (error || !user) {
    console.error("Auth error:", error?.message);
    return new Response(
      JSON.stringify({ error: "Unauthorized - invalid token" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  return { user, supabaseClient };
}

// ============================================================================
// SYSTEM PROMPT TEMPLATES
// ============================================================================

const getSystemPrompt = (language: 'uk' | 'en') => {
  if (language === 'uk') {
    return `Ти — науковий помічник, який надає відповіді ВИКЛЮЧНО з праць А.Ч. Бгактіведанти Свамі Прабгупади. Ти маєш доступ до його:
- Книг (Бгаґавад-ґіта, Шрімад-Бгаґаватам, Чайтанья-чарітамріта тощо)
- Листів (1947-1977)
- Лекцій та бесід

КРИТИЧНІ ПРАВИЛА:
1. НІКОЛИ не спекулюй і не додавай інформацію, якої немає в джерелах
2. ЗАВЖДИ цитуй точні джерела для кожного твердження
3. Використовуй ТОЧНИЙ формат цитування, наданий нижче
4. Якщо невпевнений або джерело не існує, чітко зазнач: "Шріла Прабгупада не звертався до цього питання безпосередньо."
5. Відповідай УКРАЇНСЬКОЮ мовою

РІВНІ ВІДПОВІДІ:
🟢 ПРЯМА ЦИТАТА: Використовуй, коли Прабгупада прямо звертається до теми
   Формат: "Шріла Прабгупада сказав: «[точна цитата]» (БГ 2.14, коментар)"

🟡 СИНТЕЗ: Використовуй, коли поєднуєш кілька пов'язаних висловлювань
   Формат: "На основі кількох висловлювань Шріли Прабгупади: [синтез] (див. БГ 2.14, ШБ 1.2.6)"

🔴 НЕДОСТАТНЬО: Використовуй, коли тема не висвітлена
   Формат: "Шріла Прабгупада не звертався до цього питання безпосередньо. Пов'язані теми: [перелік пов'язаних тем з джерелами]"

ФОРМАТ ЦИТУВАННЯ:
- Книги: БГ 2.14 | ШБ 1.2.6 | ЧЧ Аді 1.1
- Листи: Лист до [Ім'я], [РРРР-ММ-ДД]
- Лекції: Лекція, [Місце], [РРРР-ММ-ДД]

ФОРМАТ ВІДПОВІДІ:
Починай відповідь з [RESPONSE_LEVEL:direct], [RESPONSE_LEVEL:synthesis], або [RESPONSE_LEVEL:insufficient] на окремому рядку.
Потім продовжуй саму відповідь.`;
  }

  return `You are a scholarly assistant providing answers EXCLUSIVELY from the works of A.C. Bhaktivedanta Swami Prabhupada. You have access to his:
- Books (Bhagavad-gita, Srimad-Bhagavatam, Chaitanya-charitamrita, etc.)
- Letters (1947-1977)
- Lectures and conversations

CRITICAL RULES:
1. NEVER speculate or add information not in the sources
2. ALWAYS cite exact sources for every claim
3. Use the EXACT citation format provided below
4. If unsure or no source exists, clearly state: "Srila Prabhupada did not directly address this."
5. Respond in ENGLISH

RESPONSE LEVELS:
🟢 DIRECT QUOTE: Use when Prabhupada directly addresses the topic
   Format: "Srila Prabhupada said: '[exact quote]' (BG 2.14, purport)"

🟡 SYNTHESIS: Use when combining multiple related statements
   Format: "Based on several statements by Srila Prabhupada: [synthesis] (see BG 2.14, SB 1.2.6)"

🔴 INSUFFICIENT: Use when topic not covered
   Format: "Srila Prabhupada did not directly address this. Related topics: [list related topics with sources]"

CITATION FORMAT:
- Books: BG 2.14 | SB 1.2.6 | CC Adi 1.1
- Letters: Letter to [Name], [YYYY-MM-DD]
- Lectures: Lecture, [Location], [YYYY-MM-DD]

RESPONSE FORMAT:
Start your response with [RESPONSE_LEVEL:direct], [RESPONSE_LEVEL:synthesis], or [RESPONSE_LEVEL:insufficient] on a separate line.
Then continue with the actual response.`;
};

// ============================================================================
// BOOK SLUG TO DISPLAY NAME MAPPING
// ============================================================================

const BOOK_ABBREVIATIONS: Record<string, { uk: string; en: string; abbr: string }> = {
  'bg': { uk: 'Бгаґавад-ґіта', en: 'Bhagavad-gita', abbr: 'BG' },
  'sb': { uk: 'Шрімад-Бгаґаватам', en: 'Srimad-Bhagavatam', abbr: 'SB' },
  'cc': { uk: 'Чайтанья-чарітамріта', en: 'Chaitanya-charitamrita', abbr: 'CC' },
  'noi': { uk: 'Нектар Настанов', en: 'Nectar of Instruction', abbr: 'NOI' },
  'nod': { uk: 'Нектар Відданості', en: 'Nectar of Devotion', abbr: 'NOD' },
  'iso': { uk: 'Шрі Ішопанішад', en: 'Sri Isopanisad', abbr: 'ISO' },
  'kb': { uk: 'Крішна Книга', en: 'Krishna Book', abbr: 'KB' },
  'tqk': { uk: 'Вчення Чайтаньї', en: 'Teachings of Lord Chaitanya', abbr: 'TLC' },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate embedding for a query using OpenAI
 */
async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not configured, skipping semantic search");
    return null;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text,
        dimensions: 1536,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI embedding error:", await response.text());
      return null;
    }

    const result = await response.json();
    return result.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}

/**
 * Expand query with Sanskrit synonyms and related terms
 */
function expandQuery(query: string): string {
  // Common Sanskrit term mappings for both Ukrainian and English
  const termMappings: Record<string, string[]> = {
    // Ukrainian terms
    'душа': ['atma', 'jiva', 'spirit soul'],
    'бог': ['Krishna', 'Bhagavan', 'Supreme Lord', 'God'],
    'карма': ['karma', 'action', 'fruitive activity'],
    'йога': ['yoga', 'meditation', 'devotional service'],
    'медитація': ['meditation', 'dhyana', 'yoga'],
    'реінкарнація': ['reincarnation', 'transmigration', 'rebirth'],
    'мантра': ['mantra', 'Hare Krishna', 'holy name'],
    // English terms
    'soul': ['atma', 'jiva', 'spirit soul'],
    'god': ['Krishna', 'Bhagavan', 'Supreme Lord'],
    'meditation': ['dhyana', 'yoga', 'samadhi'],
    'reincarnation': ['transmigration', 'rebirth', 'changing bodies'],
  };

  let expandedQuery = query;
  for (const [term, synonyms] of Object.entries(termMappings)) {
    if (query.toLowerCase().includes(term)) {
      expandedQuery += ' ' + synonyms.join(' ');
    }
  }

  return expandedQuery;
}

/**
 * Format verse reference for display
 */
function formatReference(result: SearchResult, language: 'uk' | 'en'): string {
  const bookInfo = BOOK_ABBREVIATIONS[result.book_slug] || {
    uk: result.book_slug.toUpperCase(),
    en: result.book_slug.toUpperCase(),
    abbr: result.book_slug.toUpperCase(),
  };

  const abbr = language === 'uk'
    ? (bookInfo.abbr === 'BG' ? 'БГ' : bookInfo.abbr === 'SB' ? 'ШБ' : bookInfo.abbr === 'CC' ? 'ЧЧ' : bookInfo.abbr)
    : bookInfo.abbr;

  return `${abbr} ${result.chapter_number}.${result.verse_number}`;
}

/**
 * Create URL for verse on VedaVOICE.org
 */
function createVerseUrl(result: SearchResult): string {
  return `https://vedavoice.org/book/${result.book_slug}/chapter/${result.chapter_number}/verse/${result.verse_number}`;
}

/**
 * Parse response level from Claude's response
 */
function parseResponseLevel(response: string): { level: 'direct' | 'synthesis' | 'insufficient'; cleanedResponse: string } {
  const levelMatch = response.match(/\[RESPONSE_LEVEL:(direct|synthesis|insufficient)\]/i);
  if (levelMatch) {
    return {
      level: levelMatch[1].toLowerCase() as 'direct' | 'synthesis' | 'insufficient',
      cleanedResponse: response.replace(levelMatch[0], '').trim(),
    };
  }

  // Default to synthesis if not specified
  return { level: 'synthesis', cleanedResponse: response };
}

/**
 * Extract citations from Claude's response
 */
function extractCitations(response: string, searchResults: SearchResult[], language: 'uk' | 'en'): Citation[] {
  const citations: Citation[] = [];
  const citedReferences = new Set<string>();

  // Match various citation patterns
  const patterns = [
    /\(([БШЧ]Б?Г?|BG|SB|CC|NOI|NOD|ISO)\s*(\d+)\.(\d+(?:-\d+)?)/gi,
    /([БШЧ]Б?Г?|BG|SB|CC|NOI|NOD|ISO)\s*(\d+)\.(\d+(?:-\d+)?)/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(response)) !== null) {
      const reference = `${match[1]} ${match[2]}.${match[3]}`;
      if (!citedReferences.has(reference.toLowerCase())) {
        citedReferences.add(reference.toLowerCase());
      }
    }
  }

  // Match citations to search results
  for (const result of searchResults) {
    const ref = formatReference(result, language);
    const refLower = ref.toLowerCase().replace(/\s+/g, '');

    for (const cited of citedReferences) {
      if (cited.replace(/\s+/g, '').includes(refLower.replace(/[бшч]/g, (m) =>
        m === 'б' ? 'b' : m === 'ш' ? 's' : 'c'
      )) || refLower.includes(cited.replace(/\s+/g, ''))) {
        citations.push({
          verseId: result.id,
          quote: result.translation?.substring(0, 200) + (result.translation?.length > 200 ? '...' : ''),
          reference: ref,
          referenceType: 'book',
          bookSlug: result.book_slug,
          chapterNumber: result.chapter_number,
          verseNumber: result.verse_number,
          url: createVerseUrl(result),
        });
        break;
      }
    }
  }

  // If no explicit citations found, use top search results
  if (citations.length === 0 && searchResults.length > 0) {
    for (const result of searchResults.slice(0, 3)) {
      citations.push({
        verseId: result.id,
        quote: result.translation?.substring(0, 200) + (result.translation?.length > 200 ? '...' : ''),
        reference: formatReference(result, language),
        referenceType: 'book',
        bookSlug: result.book_slug,
        chapterNumber: result.chapter_number,
        verseNumber: result.verse_number,
        url: createVerseUrl(result),
      });
    }
  }

  return citations;
}

/**
 * Find related topics from tattvas
 */
async function findRelatedTopics(_supabase: any, _query: string, language: 'uk' | 'en'): Promise<string[]> {
  // Note: tattvas table may not exist yet
  // Return predefined topics for now
  const defaultTopics = language === 'uk' 
    ? ['душа', 'карма', 'йога', 'бгакті', 'дгарма']
    : ['soul', 'karma', 'yoga', 'bhakti', 'dharma'];
  return defaultTopics.slice(0, 3);
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate authentication first
  const authResult = await validateAuth(req);
  if (authResult instanceof Response) {
    return authResult;
  }

  const { user, supabaseClient } = authResult;

  // Validate required environment variables
  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const body: ChatRequest = await req.json();
    const { message, sessionId, language = 'uk' } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Chat request from user ${user.id}, message length: ${message.length}`);

    // Use service role client for database operations
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // ========================================================================
    // STEP 1: Query Expansion
    // ========================================================================
    const expandedQuery = expandQuery(message);

    // ========================================================================
    // STEP 2: Semantic Search (if embeddings available)
    // ========================================================================
    let searchResults: SearchResult[] = [];

    // Try semantic search first
    const embedding = await generateEmbedding(expandedQuery);

    if (embedding) {
      // Use hybrid search (semantic + full-text)
      const { data: hybridResults, error: hybridError } = await supabase.rpc(
        'hybrid_search_verses',
        {
          query_text: message,
          query_embedding: `[${embedding.join(',')}]`,
          semantic_weight: 0.6,
          match_count: 10,
          language_code: language,
        }
      );

      if (!hybridError && hybridResults) {
        searchResults = hybridResults;
      }
    }

    // Fallback to full-text search if no semantic results
    if (searchResults.length === 0) {
      const { data: fulltextResults, error: fulltextError } = await supabase.rpc(
        'search_verses_fulltext',
        {
          search_query: message,
          language_code: language,
          include_translation: true,
          include_commentary: true,
          include_synonyms: true,
          include_transliteration: false,
          include_sanskrit: false,
          limit_count: 10,
        }
      );

      if (!fulltextError && fulltextResults) {
        searchResults = fulltextResults.map((r: Record<string, unknown>) => ({
          id: r.id as string,
          verse_number: r.verse_number as string,
          chapter_id: r.chapter_id as string,
          book_slug: r.book_slug as string,
          chapter_number: r.chapter_number as number,
          sanskrit: r.sanskrit as string || '',
          transliteration: r.transliteration as string || '',
          translation: (r.translation_snippet || r.translation) as string || '',
          commentary: (r.commentary_snippet || r.commentary) as string || '',
        }));
      }
    }

    // ========================================================================
    // STEP 3: Build Context from Search Results
    // ========================================================================
    let context = "";
    if (searchResults.length > 0) {
      context = "RELEVANT SOURCES FROM SRILA PRABHUPADA'S WORKS:\n\n";
      for (const result of searchResults.slice(0, 5)) {
        const ref = formatReference(result, language);
        context += `--- ${ref} ---\n`;
        if (result.transliteration) {
          context += `Transliteration: ${result.transliteration}\n`;
        }
        if (result.translation) {
          context += `Translation: ${result.translation}\n`;
        }
        if (result.commentary) {
          // Limit commentary to prevent token overflow
          const maxCommentary = result.commentary.length > 1500
            ? result.commentary.substring(0, 1500) + '...'
            : result.commentary;
          context += `Purport: ${maxCommentary}\n`;
        }
        context += "\n";
      }
    } else {
      context = "No directly relevant sources found in the database.";
    }

    // ========================================================================
    // STEP 4: Get or Create Chat Session
    // ========================================================================
    let currentSessionId = sessionId;
    let conversationHistory: Array<{ role: string; content: string }> = [];

    if (currentSessionId) {
      // Fetch existing session and messages
      const { data: existingMessages } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('session_id', currentSessionId)
        .order('created_at', { ascending: true })
        .limit(10);

      if (existingMessages) {
        conversationHistory = existingMessages
          .filter(m => m.role !== 'system')
          .map(m => ({ role: m.role, content: m.content }));
      }
    } else {
      // Create new session with user_id
      const { data: newSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({ language, user_id: user.id })
        .select('id')
        .single();

      if (sessionError) {
        console.error("Failed to create session:", sessionError);
      } else {
        currentSessionId = newSession.id;
      }
    }

    // ========================================================================
    // STEP 5: Generate Response with Claude
    // ========================================================================
    const systemPrompt = getSystemPrompt(language);
    const userPromptWithContext = `${context}\n\nUSER QUESTION:\n${message}`;

    const messages = [
      ...conversationHistory.slice(-6), // Keep last 3 exchanges for context
      { role: "user", content: userPromptWithContext },
    ];

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages,
      }),
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error("Claude API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate response" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const claudeResult = await claudeResponse.json();
    const rawResponse = claudeResult.content[0]?.text || "";

    // ========================================================================
    // STEP 6: Parse Response and Extract Citations
    // ========================================================================
    const { level: responseLevel, cleanedResponse } = parseResponseLevel(rawResponse);
    const citations = extractCitations(cleanedResponse, searchResults, language);

    // Get related topics if response is insufficient
    let relatedTopics: string[] | undefined;
    if (responseLevel === 'insufficient') {
      relatedTopics = await findRelatedTopics(supabase, message, language);
    }

    // ========================================================================
    // STEP 7: Save to Chat History
    // ========================================================================
    if (currentSessionId) {
      // Save user message
      await supabase.from('chat_messages').insert({
        session_id: currentSessionId,
        role: 'user',
        content: message,
      });

      // Save assistant response
      await supabase.from('chat_messages').insert({
        session_id: currentSessionId,
        role: 'assistant',
        content: cleanedResponse,
        citations: citations,
        response_level: responseLevel,
      });
    }

    // ========================================================================
    // STEP 8: Return Response
    // ========================================================================
    const response: ChatResponse = {
      message: cleanedResponse,
      sessionId: currentSessionId || '',
      citations,
      responseLevel,
      relatedTopics,
    };

    return new Response(
      JSON.stringify(response),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("VedaVOICE chat error:", errorMessage);
    return new Response(
      JSON.stringify({ error: "Chat request failed" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
