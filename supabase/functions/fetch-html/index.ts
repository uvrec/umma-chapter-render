// Supabase Edge Function: fetch-html
// Public CORS-enabled proxy to fetch HTML from allowed domains (vedabase.io, gitabase.com)
// Returns: { html: string }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
          "User-Agent": "VedavoiceFetcher/1.0 (+https://vedavoice.app)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Connection": "close"
        },
        signal: controller.signal
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
      console.warn(`[fetch-html] Domain not allowed: host="${host}", url="${rawUrl}"`);
      return new Response(JSON.stringify({ error: "Domain not allowed", host }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    console.log(`[fetch-html] ${host}: Starting fetch for ${rawUrl}`);

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
