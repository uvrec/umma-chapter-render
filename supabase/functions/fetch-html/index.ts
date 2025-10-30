// Supabase Edge Function: fetch-html
// Public CORS-enabled proxy to fetch HTML from allowed domains (vedabase.io, gitabase.com)
// Returns: { html: string }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_HOSTS = new Set(["vedabase.io", "www.vedabase.io", "gitabase.com", "www.gitabase.com"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json().catch(() => ({ url: "" }));
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'url'" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    let host: string | null = null;
    try { host = new URL(url).host; } catch {}
    if (!host || !ALLOWED_HOSTS.has(host)) {
      return new Response(JSON.stringify({ error: "Domain not allowed" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const res = await fetch(url, { headers: { "User-Agent": "VedavoiceFetcher/1.0 (+https://vedavoice.app)" } });
    if (!res.ok) {
      // Always return 200 with notFound flag for client-side handling
      return new Response(JSON.stringify({ error: `Upstream ${res.status}`, notFound: res.status === 404 }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    const html = await res.text();
    return new Response(JSON.stringify({ html }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
});
