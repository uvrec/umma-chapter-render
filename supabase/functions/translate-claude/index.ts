/**
 * Edge Function: translate-claude
 *
 * Переклад тексту з англійської на українську через Claude API
 * з врахуванням санскритської термінології
 *
 * POST /translate-claude
 * Body: {
 *   text: string,           // Текст для перекладу
 *   context?: string,       // Контекст (lecture, letter, etc.)
 *   preserveTerms?: boolean // Зберегти санскритські терміни без перекладу
 * }
 *
 * Response: {
 *   translated: string,
 *   terms_found: string[]   // Знайдені санскритські терміни
 * }
 *
 * Потрібен секрет: ANTHROPIC_API_KEY
 * REQUIRES AUTHENTICATION: Admin only
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Правила транслітерації IAST → українська кирилиця
const TRANSLITERATION_RULES: Record<string, string> = {
  // Сполучення (спочатку довші)
  "kṣ": "кш", "jñ": "ґй", "ḍh": "д̣г", "bh": "бг", "gh": "ґг",
  "dh": "дг", "jh": "джх", "th": "тх", "kh": "кх", "ch": "чх",
  "ph": "пх", "ṅg": "н̇ґ",
  // Голосні
  "ā": "а̄", "ī": "ı̄", "ū": "ӯ", "ṛ": "р̣", "ṝ": "р̣̄",  // ī → ı̄ (dotless i + макрон!)
  "ai": "аі", "au": "ау",
  // Приголосні з діакритикою
  "ś": "ш́", "ṣ": "ш", "ṭ": "т̣", "ḍ": "д̣", "ṇ": "н̣",
  "ñ": "н̃", "ṅ": "н̇", "ṁ": "м̇", "ḥ": "х̣",
  // Звичайні приголосні
  "k": "к", "g": "ґ", "c": "ч", "j": "дж", "t": "т",
  "d": "д", "n": "н", "p": "п", "b": "б", "m": "м",
  "y": "й", "r": "р", "l": "л", "v": "в", "s": "с", "h": "х",
  // Голосні
  "a": "а", "i": "і", "u": "у", "e": "е", "o": "о",
};

// Транслітерація санскритського терміна
function transliterateTerm(term: string): string {
  let result = term.toLowerCase();

  // Сортуємо за довжиною (довші заміни спочатку)
  const sortedKeys = Object.keys(TRANSLITERATION_RULES).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    result = result.split(key).join(TRANSLITERATION_RULES[key]);
  }

  return result;
}

// Словник відомих санскритських термінів з перекладами
const SANSKRIT_GLOSSARY: Record<string, string> = {
  "Kṛṣṇa": "Кр̣шн̣а",
  "Krishna": "Крішна",
  "Prabhupāda": "Прабгупа̄да",
  "Prabhupada": "Прабгупада",
  "Bhagavad-gītā": "Бгаґавад-ґı̄та̄",  // ī → ı̄ (dotless i + макрон!)
  "Bhagavad-gita": "Бгаґавад-ґіта",
  "Śrīmad-Bhāgavatam": "Шрı̄мад-Бга̄ґаватам",  // ī → ı̄ (dotless i + макрон!)
  "Srimad-Bhagavatam": "Шрімад-Бгаґаватам",
  "Vedānta": "Веда̄нта",
  "Vedanta": "Веданта",
  "Upaniṣad": "Упанішад",
  "dharma": "дгарма",
  "karma": "карма",
  "yoga": "йоґа",
  "bhakti": "бгакті",
  "jñāna": "ґйа̄на",
  "mokṣa": "мокша",
  "saṁsāra": "сам̇са̄ра",
  "māyā": "ма̄йа̄",
  "guru": "ґуру",
  "mantra": "мантра",
  "ācārya": "а̄ча̄рйа",
  "sannyāsī": "саннйа̄сı̄",  // ī → ı̄ (dotless i + макрон!)
  "brāhmaṇa": "бра̄хман̣а",
  "kṣatriya": "кшатрійа",
  "vaiśya": "ваіш́йа",
  "śūdra": "ш́ӯдра",
  "Vṛndāvana": "Вр̣нда̄вана",
  "Māyāpur": "Ма̄йа̄пур",
  "Gaṅgā": "Ґан̇ґа̄",
  "ISKCON": "ІСКОН",
};

/**
 * Validate user authentication and admin role
 */
async function validateAdminAuth(req: Request): Promise<{ user: { id: string; email?: string } } | Response> {
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

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Auth error:", error?.message);
    return new Response(
      JSON.stringify({ error: "Unauthorized - invalid token" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  // Check if user has admin role
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError || !roleData) {
    console.warn(`User ${user.id} attempted to access translate-claude without admin role`);
    return new Response(
      JSON.stringify({ error: "Forbidden - admin role required" }),
      { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  return { user };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate admin authentication
  const authResult = await validateAdminAuth(req);
  if (authResult instanceof Response) {
    return authResult;
  }

  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const { text, context = "spiritual", preserveTerms = true } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Translation request from user ${authResult.user.id}, text length: ${text.length}`);

    // Знайти санскритські терміни
    const termsFound: string[] = [];
    let processedText = text;

    // Замінити відомі терміни на плейсхолдери
    const termPlaceholders: Record<string, string> = {};
    let placeholderIndex = 0;

    for (const [term, translation] of Object.entries(SANSKRIT_GLOSSARY)) {
      if (text.includes(term)) {
        const placeholder = `__TERM_${placeholderIndex}__`;
        termPlaceholders[placeholder] = translation;
        processedText = processedText.split(term).join(placeholder);
        termsFound.push(term);
        placeholderIndex++;
      }
    }

    // Знайти інші санскритські терміни (з діакритикою)
    const diacriticPattern = /\b\w*[āīūṛṝḷḹēōṃḥṇṭḍśṣñṅ]\w*\b/gi;
    const diacriticTerms = text.match(diacriticPattern) || [];

    for (const term of diacriticTerms) {
      if (!termsFound.includes(term) && !Object.values(termPlaceholders).includes(term)) {
        const placeholder = `__TERM_${placeholderIndex}__`;
        const transliterated = transliterateTerm(term);
        termPlaceholders[placeholder] = transliterated;
        processedText = processedText.split(term).join(placeholder);
        termsFound.push(term);
        placeholderIndex++;
      }
    }

    // Системний промпт для перекладу
    const systemPrompt = `Ти - професійний перекладач з англійської на українську мову.
Ти спеціалізуєшся на духовній літературі, зокрема ведичній філософії та вайшнавізмі.

Правила перекладу:
1. Переклад має бути природнім і читабельним українською
2. Зберігай оригінальний стиль та тон тексту
3. Плейсхолдери типу __TERM_0__ залишай без змін - це санскритські терміни
4. Не додавай пояснень чи коментарів
5. Повертай ТІЛЬКИ переклад, без додаткового тексту

Контекст: ${context === "lecture" ? "транскрипт лекції Шріли Прабгупади" :
           context === "letter" ? "лист Шріли Прабгупади" : "духовний текст"}`;

    // Виклик Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Переклади цей текст на українську:\n\n${processedText}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Translation API error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const result = await response.json();
    let translated = result.content[0]?.text || "";

    // Замінити плейсхолдери на транслітеровані терміни
    for (const [placeholder, translation] of Object.entries(termPlaceholders)) {
      translated = translated.split(placeholder).join(translation);
    }

    return new Response(
      JSON.stringify({
        translated,
        terms_found: termsFound,
        original_length: text.length,
        translated_length: translated.length,
      }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Translation error:", errorMessage);
    return new Response(
      JSON.stringify({ error: "Translation failed" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
