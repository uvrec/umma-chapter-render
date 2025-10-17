// supabase/functions/fetch-proxy/index.ts
// Simple CORS-friendly HTML proxy to fetch external pages (e.g., vedabase.io) server-side
// and return their HTML content as JSON. This avoids browser CORS blocks during imports.

import { serve } from "https://deno.land/std@0.193.0/http/server.ts";

const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

const jsonHeaders: HeadersInit = {
  ...corsHeaders,
  "Content-Type": "application/json; charset=utf-8",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let target = new URL(req.url).searchParams.get("url");
    if (!target) {
      try {
        const body = await req.json();
        target = body?.url;
      } catch {
        // ignore
      }
    }

    if (!target) {
      return new Response(JSON.stringify({ error: "Missing 'url' parameter" }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    const upstream = await fetch(target, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const html = await upstream.text();

    return new Response(
      JSON.stringify({ html, status: upstream.status, ok: upstream.ok }),
      { headers: jsonHeaders },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
});
