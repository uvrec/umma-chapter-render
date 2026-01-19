import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StaticPageMeta {
  id: string;
  slug: string;
  title_uk: string;
  title_en: string;
  meta_description_uk?: string | null;
  meta_description_en?: string | null;
  hero_image_url?: string | null;
  og_image?: string | null;
  seo_keywords?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Завантажує метадані статичних сторінок (SEO, OG tags тощо)
 * @param slug — унікальний slug сторінки (наприклад "about", "contact")
 */
export const useStaticPageMeta = (slug?: string) => {
  return useQuery({
    queryKey: ["static-page-meta", slug],
    enabled: !!slug, // запит лише коли є slug
    staleTime: 10 * 60 * 1000, // кеш 10 хвилин
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<StaticPageMeta | null> => {
      const { data, error } = await supabase.from("static_page_metadata").select("*").eq("slug", slug).maybeSingle();

      if (error) {
        console.error("❌ Error fetching static page metadata:", error);
        return null;
      }

      return data as StaticPageMeta;
    },
  });
};
