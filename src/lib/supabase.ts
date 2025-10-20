// src/lib/supabase.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.js";

let supabase: SupabaseClient<Database> | null = null;

/**
 * Get Supabase client with service_role key (bypasses RLS)
 * @throws Error if SUPABASE_URL or SUPABASE_SERVICE_KEY not set
 * @returns Singleton Supabase client instance
 */
export function getSupabase(): SupabaseClient<Database> {
  if (supabase) return supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment.\n" +
        "Get your service_role key from: https://supabase.com/dashboard/project/_/settings/api",
    );
  }

  supabase = createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        "X-Client-Info": "vedavoice-import-agent/1.0",
      },
    },
  });

  return supabase;
}

/**
 * Close Supabase client connection (for graceful shutdown)
 */
export function closeSupabase() {
  if (supabase) {
    // Supabase JS client doesn't have explicit close, but we can null the reference
    supabase = null;
  }
}
