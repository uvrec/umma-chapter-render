/**
 * Hooks for Tattva (philosophical categories) system
 * 
 * NOTE: Some RPC functions are stubbed because they don't exist yet.
 * Once the SQL migration is run, these can use the real RPC calls.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Tattva {
  id: string;
  name_ua: string;
  name_en: string;
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
 * Get hierarchical tree of tattvas (stubbed - RPC doesn't exist yet)
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
      
      // Map database fields to interface
      return data.map(t => ({
        id: t.id,
        name_ua: t.name_ua,
        name_en: t.name_en,
        slug: t.slug,
        description_ua: t.description_ua,
        description_en: t.description_en,
        parent_id: t.parent_id,
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
        name_ua: data.name_ua,
        name_en: data.name_en,
        slug: data.slug,
        description_ua: data.description_ua,
        description_en: data.description_en,
        parent_id: data.parent_id,
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
            name_ua: t.name_ua,
            name_en: t.name_en,
            slug: t.slug,
            description_ua: t.description_ua,
            description_en: t.description_en,
            parent_id: t.parent_id,
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
 * Get verses for a tattva (stubbed - RPC doesn't exist yet)
 */
export function useTattvaVerses(
  _slug: string,
  _options?: {
    limit?: number;
    offset?: number;
    includeChildren?: boolean;
  }
) {
  return {
    data: [] as TattvaVerse[],
    isLoading: false,
    error: null,
  };
}

/**
 * Get tattvas for a specific verse (stubbed - RPC doesn't exist yet)
 */
export function useVerseTattvas(_verseId: string) {
  return {
    data: [] as Tattva[],
    isLoading: false,
    error: null,
  };
}

/**
 * Search tattvas (stubbed - RPC doesn't exist yet)
 */
export function useSearchTattvas(_query: string) {
  return {
    data: [] as (Tattva & { parent_slug?: string })[],
    isLoading: false,
    error: null,
  };
}

/**
 * Get breadcrumb path for a tattva (stubbed - RPC doesn't exist yet)
 */
export function useTattvaBreadcrumb(_slug: string) {
  return {
    data: [] as TattvaBreadcrumb[],
    isLoading: false,
    error: null,
  };
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
        name_ua: t.name_ua,
        name_en: t.name_en,
        slug: t.slug,
        description_ua: t.description_ua,
        description_en: t.description_en,
        parent_id: t.parent_id,
        verses_count: countMap[t.id] || 0,
      })) as Tattva[];
    },
    staleTime: 1000 * 60 * 5,
  });
}
