/**
 * Hooks for Tattva (philosophical categories) system
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Tattva {
  id: string;
  name_ua: string;
  name_en: string;
  name_sanskrit?: string;
  slug: string;
  description_ua?: string;
  description_en?: string;
  category?: "sambandha" | "abhidheya" | "prayojana";
  parent_id?: string;
  depth?: number;
  children_count?: number;
  verses_count?: number;
}

export interface TattvaVerse {
  verse_id: string;
  book_slug: string;
  book_title: string;
  canto_number?: number;
  chapter_number: number;
  verse_number: string;
  sanskrit?: string;
  translation_ua?: string;
  translation_en?: string;
  relevance_score: number;
  tattva_name?: string;
}

export interface TattvaBreadcrumb {
  id: string;
  name_ua: string;
  name_en: string;
  slug: string;
  depth: number;
}

/**
 * Get hierarchical tree of tattvas
 */
export function useTattvaTree(_parentId?: string) {
  return {
    data: [] as Tattva[],
    isLoading: false,
    error: null,
  };
}

/**
 * Get root-level tattvas (main categories)
 */
export function useRootTattvas() {
  return useQuery({
    queryKey: ["tattvas", "root"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tattvas")
        .select("*")
        .is("parent_id", null)
        .order("display_order");

      if (error) throw error;
      
      return data.map(t => ({
        id: t.id,
        name_ua: t.name_uk,
        name_en: t.name_en,
        slug: t.slug,
        description_ua: t.description_uk,
        description_en: t.description_en,
        parent_id: t.parent_id,
        category: t.category as Tattva['category'],
      })) as Tattva[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Get a single tattva by slug
 */
export function useTattva(slug: string) {
  return useQuery({
    queryKey: ["tattva", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tattvas")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name_ua: data.name_uk,
        name_en: data.name_en,
        slug: data.slug,
        description_ua: data.description_uk,
        description_en: data.description_en,
        parent_id: data.parent_id,
        category: data.category as Tattva['category'],
      } as Tattva;
    },
    enabled: !!slug,
  });
}

/**
 * Get children of a tattva
 */
export function useTattvaChildren(parentId: string) {
  return useQuery({
    queryKey: ["tattvas", "children", parentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tattvas")
        .select("*")
        .eq("parent_id", parentId)
        .order("display_order");

      if (error) throw error;

      // Get verse counts for each child
      const withCounts = await Promise.all(
        data.map(async (t) => {
          const { count } = await supabase
            .from("content_tattvas")
            .select("*", { count: "exact", head: true })
            .eq("tattva_id", t.id);
          return {
            id: t.id,
            name_ua: t.name_uk,
            name_en: t.name_en,
            slug: t.slug,
            description_ua: t.description_uk,
            description_en: t.description_en,
            parent_id: t.parent_id,
            category: t.category as Tattva['category'],
            verses_count: count || 0,
          };
        })
      );

      return withCounts as Tattva[];
    },
    enabled: !!parentId,
  });
}

/**
 * Get verses for a tattva using RPC
 */
export function useTattvaVerses(
  slug: string,
  options?: {
    limit?: number;
    offset?: number;
    includeChildren?: boolean;
  }
) {
  const { limit = 50, offset = 0, includeChildren = true } = options || {};

  return useQuery({
    queryKey: ["tattva-verses", slug, limit, offset, includeChildren],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("get_tattva_verses", {
        p_tattva_slug: slug,
        p_limit: limit,
        p_offset: offset,
        p_include_children: includeChildren,
      });

      if (error) throw error;
      return (data || []) as TattvaVerse[];
    },
    enabled: !!slug,
  });
}

/**
 * Get tattvas for a specific verse using RPC
 */
export function useVerseTattvas(verseId: string) {
  return useQuery({
    queryKey: ["verse-tattvas", verseId],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("get_verse_tattvas", {
        p_verse_id: verseId,
      });

      if (error) throw error;
      return (data || []) as Tattva[];
    },
    enabled: !!verseId,
  });
}

/**
 * Search tattvas using RPC
 */
export function useSearchTattvas(query: string) {
  return useQuery({
    queryKey: ["tattvas", "search", query],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("search_tattvas", {
        p_query: query,
      });

      if (error) throw error;
      return (data || []) as (Tattva & { parent_slug?: string })[];
    },
    enabled: query.length >= 2,
  });
}

/**
 * Get breadcrumb path for a tattva using RPC
 */
export function useTattvaBreadcrumb(slug: string) {
  return useQuery({
    queryKey: ["tattva-breadcrumb", slug],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("get_tattva_breadcrumb", {
        p_tattva_slug: slug,
      });

      if (error) throw error;
      return (data || []) as TattvaBreadcrumb[];
    },
    enabled: !!slug,
  });
}

/**
 * Get all tattvas with verse counts (for stats)
 */
export function useTattvasWithCounts() {
  return useQuery({
    queryKey: ["tattvas", "with-counts"],
    queryFn: async () => {
      const { data: tattvas, error } = await supabase
        .from("tattvas")
        .select("*")
        .order("display_order");

      if (error) throw error;

      // Get counts in a single query
      const { data: contentTattvas } = await supabase
        .from("content_tattvas")
        .select("tattva_id");
        
      const countMap: Record<string, number> = {};
      contentTattvas?.forEach((ct) => {
        countMap[ct.tattva_id] = (countMap[ct.tattva_id] || 0) + 1;
      });

      return tattvas.map((t) => ({
        id: t.id,
        name_ua: t.name_uk,
        name_en: t.name_en,
        slug: t.slug,
        description_ua: t.description_uk,
        description_en: t.description_en,
        parent_id: t.parent_id,
        category: t.category as Tattva['category'],
        verses_count: countMap[t.id] || 0,
      })) as Tattva[];
    },
    staleTime: 1000 * 60 * 5,
  });
}
