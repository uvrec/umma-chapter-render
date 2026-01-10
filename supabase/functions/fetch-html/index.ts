// Supabase Edge Function: fetch-html
// CORS-enabled proxy to fetch HTML from allowed domains (vedabase.io, gitabase.com)
// REQUIRES AUTHENTICATION: User must be logged in
// Returns: { html: string }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_HOSTS = new Set([
  "vedabase.io",
  "www.vedabase.io",
  "gitabase.com",
  "www.gitabase.com",
  "bhaktivinodainstitute.org",
  "www.bhaktivinodainstitute.org",
  "kksongs.org",
  "www.kksongs.org",
  "wisdomlib.org",
  "www.wisdomlib.org",
  // WordPress CDN occasionally used in content links
  "i0.wp.com"
]);

// Rate limiting: track requests per user
const userRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per minute
const RATE_WINDOW_MS = 60000; // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRate = userRequestCounts.get(userId);
  
  if (!userRate || now > userRate.resetTime) {
    userRequestCounts.set(userId, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return true;
  }
  
  if (userRate.count >= RATE_LIMIT) {
    return false;
  }
  
  userRate.count++;
  return true;
}

/**
 * Validate JWT and get authenticated user
 */
async function validateAuth(req: Request): Promise<{ userId: string } | Response> {
  const authHeader = req.headers.get("Authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Missing or invalid Authorization header" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getClaims(token);
  
  if (error || !data?.claims?.sub) {
    console.error("[fetch-html] Auth error:", error?.message);
    return new Response(
      JSON.stringify({ error: "Unauthorized: Invalid token" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  return { userId: data.claims.sub as string };
}

/**
 * Fetch with retry logic and exponential backoff
 * Returns 200 status even on failure (with retriable flag) to allow client-side handling
 */
async function fetchWithRetry(url: string, host: string, maxAttempts = 3, timeoutMs = 15000) {
  const delays = [500, 1000, 2000];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const startTime = Date.now();

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,uk;q=0.8",
          "Referer": "https://vedabase.io/",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive"
        },
        signal: controller.signal,
        redirect: 'follow'
      });

      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      if (!res.ok) {
        console.log(`[fetch-html] ${host}: Attempt ${attempt}/${maxAttempts} - ${res.status} (${duration}ms)`);

        if (res.status === 404) {
          return { success: false, notFound: true, error: "Not found" };
        }

        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delays[attempt - 1]));
          continue;
        }

        return { success: false, error: `Upstream ${res.status}`, retriable: true };
      }

      const html = await res.text();
      console.log(`[fetch-html] ${host}: Attempt ${attempt}/${maxAttempts} - Success (${duration}ms, ${html.length} bytes)`);
      return { success: true, html };

    } catch (e) {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      const errorMsg = e instanceof Error ? e.message : "Unknown error";
      const isTimeout = errorMsg.includes("abort") || errorMsg.includes("timeout");

      console.log(`[fetch-html] ${host}: Attempt ${attempt}/${maxAttempts} - ${isTimeout ? "Timeout" : "Error"}: ${errorMsg} (${duration}ms)`);

      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delays[attempt - 1]));
        continue;
      }

      return { success: false, error: errorMsg, retriable: true };
    }
  }

  return { success: false, error: "Max retries exceeded", retriable: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate authentication
  const authResult = await validateAuth(req);
  if (authResult instanceof Response) {
    return authResult;
  }

  const { userId } = authResult;

  // Check rate limit
  if (!checkRateLimit(userId)) {
    console.warn(`[fetch-html] Rate limit exceeded for user ${userId}`);
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please wait a moment." }),
      { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const { url } = await req.json().catch(() => ({ url: "" }));
    const rawUrl = typeof url === "string" ? url.trim() : "";

    if (!rawUrl) {
      return new Response(JSON.stringify({ error: "Missing 'url'" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    let host: string | null = null;
    try {
      const u = new URL(rawUrl);
      host = (u.hostname || u.host || "").toLowerCase();
    } catch {}

    if (!host || !ALLOWED_HOSTS.has(host)) {
      console.warn(`[fetch-html] Domain not allowed: host="${host}", url="${rawUrl}", user=${userId}`);
      return new Response(JSON.stringify({ error: "Domain not allowed", host }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    console.log(`[fetch-html] ${host}: Starting fetch for ${rawUrl} (user: ${userId})`);

    const result = await fetchWithRetry(rawUrl, host);

    if (!result.success) {
      // Always return 200 with error details for client-side handling
      return new Response(
        JSON.stringify({
          error: result.error || "Failed to fetch",
          notFound: result.notFound || false,
          retriable: result.retriable || false
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ html: result.html }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.error('[fetch-html] Unexpected error:', errorMessage);
    // Return 200 with retriable flag even for unexpected errors
    return new Response(
      JSON.stringify({ error: errorMessage, retriable: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
