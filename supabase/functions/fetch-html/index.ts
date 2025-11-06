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
  // WordPress CDN occasionally used in content links
  "i0.wp.com"
]);

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

    console.log(`[fetch-html] Fetching: ${rawUrl} (host: ${host})`);

    const res = await fetch(rawUrl, { headers: { "User-Agent": "VedavoiceFetcher/1.0 (+https://vedavoice.app)" } });
    if (!res.ok) {
      // Always return 200 with notFound flag for client-side handling
      return new Response(JSON.stringify({ error: `Upstream ${res.status}`, notFound: res.status === 404 }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    const html = await res.text();

    return new Response(JSON.stringify({ html }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.error('[fetch-html] Error:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
});
