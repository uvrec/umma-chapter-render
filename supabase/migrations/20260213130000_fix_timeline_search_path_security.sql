-- Fix search_path for timeline SECURITY DEFINER functions
-- Prevents search_path hijacking attacks

ALTER FUNCTION public.get_prabhupada_timeline(integer, integer, text[]) SET search_path = public;
ALTER FUNCTION public.get_timeline_years() SET search_path = public;
ALTER FUNCTION public.get_timeline_locations(integer) SET search_path = public;
