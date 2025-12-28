import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { errorLogger } from "@/utils/errorLogger";

/**
 * Очікувана структура таблиці `site_banners` (мінімум):
 * id: string (uuid)
 * title_ua: string | null
 * title_en: string | null
 * description_ua: string | null
 * description_en: string | null
 * link_url: string | null
 * image_url: string | null
 * is_active: boolean
 * start_at: string | null (ISO)
 * end_at: string | null (ISO)
 * priority: number | null
 */

type Banner = {
  id: string;
  title_ua?: string | null;
  title_en?: string | null;
  description_ua?: string | null;
  description_en?: string | null;
  link_url?: string | null;
  image_url?: string | null;
  is_active: boolean;
  start_at?: string | null;
  end_at?: string | null;
  priority?: number | null;
};

const STORAGE_KEY = "dismissed_site_banners";

export default function SiteBanners() {
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDismissed(JSON.parse(raw));
    } catch (e) {
      errorLogger.logSilent(e, 'localStorage read - dismissed banners');
    }
  }, []);

  const { data } = useQuery({
    queryKey: ["site_banners"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("site_banners")
        .select(
          "id,title_ua,title_en,description_ua,description_en,link_url,image_url,is_active,start_at,end_at,priority"
        )
        .eq("is_active", true)
        .order("priority", { ascending: true })
        .order("start_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Banner[];
    },
  });

  const now = Date.now();

  const banners = useMemo(() => {
    return (data || [])
      .filter((b) => {
        if (dismissed.includes(b.id)) return false;
        const startOk = b.start_at ? Date.parse(b.start_at) <= now : true;
        const endOk = b.end_at ? Date.parse(b.end_at) >= now : true;
        return startOk && endOk;
      })
      .slice(0, 3); // не більше 3, щоб не перевантажувати хедер
  }, [data, dismissed, now]);

  const handleDismiss = (id: string) => {
    const next = Array.from(new Set([...dismissed, id]));
    setDismissed(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      errorLogger.logSilent(e, 'localStorage write - dismissed banners');
    }
  };

  if (!banners.length) return null;

  return (
    <div className="w-full bg-amber-50/90 dark:bg-amber-900/20 backdrop-blur supports-[backdrop-filter]:backdrop-blur-sm border-b border-amber-200 dark:border-amber-800">
      <div className="mx-auto max-w-6xl px-4 py-2 space-y-2">
        {banners.map((b) => {
          const title = language === "ua" ? b.title_ua || b.title_en : b.title_en || b.title_ua;
          const desc =
            language === "ua" ? b.description_ua || b.description_en : b.description_en || b.description_ua;

          return (
            <div
              key={b.id}
              className="relative flex gap-3 rounded-md border border-amber-300/60 dark:border-amber-800/60 bg-white/70 dark:bg-amber-950/30 px-3 py-2"
            >
              {b.image_url ? (
                <img
                  src={b.image_url}
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded object-cover ring-1 ring-amber-300/50 dark:ring-amber-700/40"
                  loading="lazy"
                />
              ) : null}

              <div className="min-w-0 flex-1">
                {title ? <div className="text-sm font-semibold text-amber-900 dark:text-amber-200">{title}</div> : null}
                {desc ? (
                  <div className="text-xs text-amber-800/90 dark:text-amber-300/90 line-clamp-2">{desc}</div>
                ) : null}
                {b.link_url ? (
                  <a
                    href={b.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-amber-900 underline underline-offset-4 hover:no-underline dark:text-amber-200"
                  >
                    {language === "ua" ? "Детальніше" : "Learn more"}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>

              <button
                aria-label={language === "ua" ? "Закрити банер" : "Dismiss banner"}
                onClick={() => handleDismiss(b.id)}
                className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-amber-800/80 hover:bg-amber-200/60 dark:text-amber-200/80 dark:hover:bg-amber-800/50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
