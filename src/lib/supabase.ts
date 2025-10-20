// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (supabase) return supabase;
  
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY required in .env');
  }
  
  supabase = createClient(url, key, {
    auth: { 
      persistSession: false,
      autoRefreshToken: false
    }
  });
  
  return supabase;
}
