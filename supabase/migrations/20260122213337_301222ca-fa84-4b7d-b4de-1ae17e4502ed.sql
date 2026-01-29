-- Drop legacy materialized view causing duplicate identifier conflict
DROP MATERIALIZED VIEW IF EXISTS public.glossary_stats_cache_uk;