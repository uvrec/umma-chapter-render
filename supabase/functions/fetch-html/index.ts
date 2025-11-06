// Supabase Edge Function: fetch-html
// Public CORS-enabled proxy to fetch HTML from allowed domains (vedabase.io, gitabase.com)
// Returns: { html: string }
// Supports JavaScript execution via Puppeteer for client-side rendered content (Gitabase)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

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
    const { url, executeJS } = await req.json().catch(() => ({ url: "", executeJS: false }));
    const rawUrl = typeof url === "string" ? url.trim() : "";
    const shouldExecuteJS = executeJS === true;

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

    console.log(`[fetch-html] Fetching: ${rawUrl} (host: ${host}, executeJS: ${shouldExecuteJS})`);

    let html: string;

    if (shouldExecuteJS) {
      // Use Puppeteer to execute JavaScript and get rendered HTML
      console.log(`[fetch-html] Using Puppeteer for ${rawUrl}`);
      let browser;
      try {
        browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setUserAgent("VedavoiceFetcher/1.0 (+https://vedavoice.app)");

        // Navigate and wait for network to be idle
        await page.goto(rawUrl, { waitUntil: 'networkidle2', timeout: 30000 });

        // For Gitabase, wait for div.dia_text to appear
        if (host?.includes('gitabase')) {
          try {
            await page.waitForSelector('div.dia_text', { timeout: 10000 });
          } catch (e) {
            console.warn(`[fetch-html] div.dia_text not found, continuing anyway`);
          }
        }

        // Get the rendered HTML
        html = await page.content();
        console.log(`[fetch-html] Puppeteer HTML length: ${html.length} chars`);
      } finally {
        if (browser) {
          await browser.close();
        }
      }
    } else {
      // Simple fetch for static content (Vedabase)
      const res = await fetch(rawUrl, { headers: { "User-Agent": "VedavoiceFetcher/1.0 (+https://vedavoice.app)" } });
      if (!res.ok) {
        // Always return 200 with notFound flag for client-side handling
        return new Response(JSON.stringify({ error: `Upstream ${res.status}`, notFound: res.status === 404 }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
      }
      html = await res.text();
    }

    return new Response(JSON.stringify({ html }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.error('[fetch-html] Error:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
});
