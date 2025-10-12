// src/components/SiteBanners.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Очікуваний формат у таблиці `site_settings`:
 * key: 'home_hero_banner' | 'audiobooks_hero_banner' | 'reader_hero_banner' | 'blog_hero_banner'
 * value: { url: string | null; enabled: boolean }
 */

type BannerValue = {
  url: string | null;
  enabled: boolean;
};

function resolveBannerKey(pathname: string): string | null {
  // Пріоритезуємо за першою частиною шляху
  if (pathname === "/" || pathname.startsWith("/home")) return "home_hero_banner";
  if (pathname.startsWith("/audiobooks") || pathname.startsWith("/audio")) return "audiobooks_hero_banner";
  if (pathname.startsWith("/veda-reader") || pathname.startsWith("/verses")) return "reader_hero_banner";
  if (pathname.startsWith("/blog")) return "blog_hero_banner";

  // За замовчуванням не показуємо банер
  return null;
}

export default function SiteBanners() {
  const { pathname } = useLocation();
  const key = resolveBannerKey(pathname);

  const { data } = useQuery({
    queryKey: ["site-banner", key],
    enabled: !!key,
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key,value").eq("key", key!).single();

      if (error) {
        // якщо запису ще немає — мовчки не показуємо банер
        if (error.code === "PGRST116" /* no rows */) return null;
        throw error;
      }
      return (data?.value || null) as BannerValue | null;
    },
  });

  const banner = data && data.enabled && data.url ? data : null;

  if (!banner) return null;

  return (
    <div className="w-full border-b">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="relative overflow-hidden rounded-xl bg-muted">
          <img src={banner.url!} alt="" className="h-40 w-full object-cover sm:h-56 md:h-64" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
