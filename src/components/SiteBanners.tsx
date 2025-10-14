// src/components/SiteBanners.tsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

/**
 * Таблиця `site_settings`
 * key:
 *  - 'home_hero_banner'
 *  - 'audiobooks_hero_banner'
 *  - 'reader_hero_banner'
 *  - 'blog_hero_banner'
 * value: { url: string | null; enabled: boolean }
 */

type BannerValue = { url: string | null; enabled: boolean };

function resolveBannerKey(pathname: string): string | null {
  if (pathname === "/" || pathname.startsWith("/home")) return "home_hero_banner";
  if (pathname.startsWith("/audiobooks") || pathname.startsWith("/audio")) return "audiobooks_hero_banner";
  if (pathname.startsWith("/veda-reader") || pathname.startsWith("/verses")) return "reader_hero_banner";
  if (pathname.startsWith("/blog")) return "blog_hero_banner";
  return null;
}

export default function SiteBanners() {
  const { pathname } = useLocation();
  const key = resolveBannerKey(pathname);
  const { user, isAdmin } = useAuth();

  const { data } = useQuery({
    queryKey: ["site-banner", key],
    enabled: !!key,
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings" as any).select("key,value").eq("key", key!).single();
      if (error) return null; // якщо запису ще немає — не показуємо банер
      return ((data as any)?.value || null) as BannerValue | null;
    },
  });

  const banner = data && data.enabled && data.url ? data : null;
  if (!banner) return null;

  const showInlineEdit = Boolean(user && isAdmin); // інлей редагування НА ВСІХ сторінках з банером

  return (
    <div className="w-full border-b">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="relative overflow-hidden rounded-xl bg-muted">
          <img src={banner.url!} alt="" className="h-40 w-full object-cover sm:h-56 md:h-64" loading="lazy" />

          {showInlineEdit && (
            <div className="absolute right-3 top-3">
              <Button asChild size="sm" variant="secondary" className="backdrop-blur bg-white/90">
                <Link to="/admin/sitebanners">
                  <Settings className="mr-2 h-4 w-4" />
                  Змінити банер
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
