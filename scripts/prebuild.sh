#!/bin/bash
# Prebuild script - generates sitemap if Supabase credentials are available

if [ -n "$VITE_SUPABASE_URL" ] || [ -n "$SUPABASE_URL" ]; then
  echo "🗺️  Generating sitemap..."
  npx tsx scripts/generate-sitemap.ts
else
  echo "⏭️  Sitemap generation skipped (no Supabase credentials)"
fi
