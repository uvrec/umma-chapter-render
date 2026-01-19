#!/bin/bash
# Prebuild script - generates sitemap if Supabase credentials are available

# Check for URL
HAS_URL=""
if [ -n "$VITE_SUPABASE_URL" ] || [ -n "$SUPABASE_URL" ]; then
  HAS_URL="true"
fi

# Check for API key (supports both ANON_KEY and PUBLISHABLE_KEY naming)
HAS_KEY=""
if [ -n "$VITE_SUPABASE_ANON_KEY" ] || [ -n "$VITE_SUPABASE_PUBLISHABLE_KEY" ] || [ -n "$SUPABASE_ANON_KEY" ]; then
  HAS_KEY="true"
fi

if [ -n "$HAS_URL" ] && [ -n "$HAS_KEY" ]; then
  echo "🗺️  Generating sitemap..."
  npx tsx scripts/generate-sitemap.ts
else
  echo "⏭️  Sitemap generation skipped (missing Supabase credentials)"
fi
