import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StaticPageMeta {
  id: string;
  slug: string;
  title_ua: string;
  title_en: string;
  meta_description_ua?: string;
  meta_description_en?: string;
  hero_image_url?: string;
  og_image?: string;
  seo_keywords?: string;
  created_at: string;
  updated_at: string;
}

export const useStaticPageMeta = (slug: string) => {
  return useQuery({
    queryKey: ["static-page-meta", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("static_page_metadata")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching static page metadata:", error);
        return null;
      }

      return data as StaticPageMeta;
    },
  });
};
