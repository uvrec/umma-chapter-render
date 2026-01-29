// Audio.tsx - Minimalist audio library page (NeuBibel style)
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Headphones, Mic, Music, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileLecturesTimeline } from "@/components/mobile/MobileLecturesTimeline";

// Types
type AudioCategory = {
  id: string;
  slug: string;
  name_uk: string | null;
  name_en: string | null;
  display_order: number | null;
};

type AudioPlaylist = {
  id: string;
  title_uk: string | null;
  title_en: string | null;
  cover_image_url: string | null;
  category_id: string;
  is_published: boolean | null;
  tracks?: { count: number }[];
};

// Category slug to icon mapping
const CATEGORY_ICONS: Record<string, typeof Headphones> = {
  audiobooks: Headphones,
  playlists: Music,
  lectures: Mic,
  bhajans: Music,
  kirtans: Music,
};

// Swipeable audio row component
interface SwipeableAudioRowProps {
  item: {
    id: string;
    title_uk: string | null;
    title_en: string | null;
    track_count: number;
  };
  onRowClick: () => void;
  onTrackClick: (track: number) => void;
  language: string;
  t: (uk: string, en: string) => string;
}

function SwipeableAudioRow({
  item,
  onRowClick,
  onTrackClick,
  language,
  t,
}: SwipeableAudioRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const touchStartRef = useRef<{ x: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const title = language === "uk" ? (item.title_uk || item.title_en) : (item.title_en || item.title_uk);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = touchStartRef.current.x - e.touches[0].clientX;
    const containerWidth = containerRef.current?.offsetWidth || 300;
    if (isExpanded) {
      const newTranslate = Math.max(0, Math.min(deltaX, containerWidth));
      setTranslateX(-containerWidth + newTranslate);
    } else {
      const newTranslate = Math.max(0, Math.min(deltaX, containerWidth));
      setTranslateX(-newTranslate);
    }
  }, [isExpanded]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;
    const containerWidth = containerRef.current?.offsetWidth || 300;
    const threshold = containerWidth * 0.3;
    if (isExpanded) {
      if (translateX > -containerWidth + threshold) {
        setIsExpanded(false);
        setTranslateX(0);
      } else {
        setTranslateX(-containerWidth);
      }
    } else {
      if (translateX < -threshold) {
        setIsExpanded(true);
        setTranslateX(-containerWidth);
      } else {
        setTranslateX(0);
      }
    }
    touchStartRef.current = null;
  }, [isExpanded, translateX]);

  const handleRowTap = () => {
    if (!isExpanded) onRowClick();
  };

  const handleClose = () => {
    setIsExpanded(false);
    setTranslateX(0);
  };

  const tracks = Array.from({ length: item.track_count }, (_, i) => i + 1);
  const containerWidth = containerRef.current?.offsetWidth || 300;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex will-change-transform"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: touchStartRef.current ? 'none' : 'transform 200ms ease-out',
          width: `${containerWidth * 2}px`,
        }}
      >
        {/* Item info */}
        <div
          className="flex items-center gap-3 px-4 py-4 cursor-pointer active:bg-muted/50"
          style={{ width: `${containerWidth}px` }}
          onClick={handleRowTap}
        >
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground">{title || "Без назви"}</div>
            <div className="text-sm text-muted-foreground">
              {item.track_count} {t("треків", "tracks")}
            </div>
          </div>
        </div>

        {/* Track numbers */}
        <div className="flex items-center bg-muted/50" style={{ width: `${containerWidth}px` }}>
          <button onClick={handleClose} className="h-full px-2 flex items-center text-muted-foreground">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 px-2 py-2">
              {tracks.map((track) => (
                <button
                  key={track}
                  onClick={() => onTrackClick(track)}
                  className={cn(
                    "min-w-[36px] h-9 px-2",
                    "text-sm font-medium",
                    "text-foreground hover:text-brand-600 active:text-brand-700",
                    "rounded-md hover:bg-brand-100/50 active:bg-brand-200/50"
                  )}
                >
                  {track}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile list component
interface MobileAudioListProps {
  items: AudioPlaylist[];
  isLoading: boolean;
}

function MobileAudioList({ items, isLoading }: MobileAudioListProps) {
  const { language, t, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();

  const handleRowClick = useCallback((id: string) => {
    navigate(getLocalizedPath(`/audiobooks/${id}`));
  }, [navigate, getLocalizedPath]);

  const handleTrackClick = useCallback((id: string, track: number) => {
    navigate(getLocalizedPath(`/audiobooks/${id}?track=${track}`));
  }, [navigate, getLocalizedPath]);

  if (isLoading) {
    return (
      <div className="divide-y divide-border/50">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="px-4 py-4 animate-pulse">
            <div className="h-4 w-40 bg-muted rounded mb-2" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t("Поки що немає записів", "No recordings yet")}
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {items.map((item) => (
        <SwipeableAudioRow
          key={item.id}
          item={{
            id: item.id,
            title_uk: item.title_uk,
            title_en: item.title_en,
            track_count: item.tracks?.[0]?.count || 0,
          }}
          onRowClick={() => handleRowClick(item.id)}
          onTrackClick={(track) => handleTrackClick(item.id, track)}
          language={language}
          t={t}
        />
      ))}
    </div>
  );
}

// Desktop grid component
interface DesktopAudioGridProps {
  items: AudioPlaylist[];
  isLoading: boolean;
}

function DesktopAudioGrid({ items, isLoading }: DesktopAudioGridProps) {
  const { language, t, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-muted rounded-lg mb-2" />
            <div className="h-4 w-3/4 bg-muted rounded mx-auto mb-1" />
            <div className="h-3 w-1/2 bg-muted rounded mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t("Поки що немає записів", "No recordings yet")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {items.map((item) => {
        const title = language === "uk" ? (item.title_uk || item.title_en) : (item.title_en || item.title_uk);
        const trackCount = item.tracks?.[0]?.count || 0;

        return (
          <div
            key={item.id}
            onClick={() => navigate(getLocalizedPath(`/audiobooks/${item.id}`))}
            className="group cursor-pointer"
          >
            {/* Cover */}
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300">
              {item.cover_image_url ? (
                <img
                  src={item.cover_image_url}
                  alt={title || ""}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <Headphones className="w-12 h-12 text-primary/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Title */}
            <h3 className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center line-clamp-2 text-foreground group-hover:text-primary transition-colors px-1">
              {title || t("Без назви", "Untitled")}
            </h3>
            <p className="text-xs text-center text-muted-foreground">
              {trackCount} {t("треків", "tracks")}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export const Audio = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();

  // Fetch audio categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["audio-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_categories")
        .select("id, slug, name_uk, name_en, display_order")
        .order("display_order", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data || []) as AudioCategory[];
    },
  });

  // Fetch all published playlists with track counts
  const { data: playlists = [], isLoading: playlistsLoading } = useQuery({
    queryKey: ["audio-playlists-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_playlists")
        .select(`
          id,
          title_uk,
          title_en,
          cover_image_url,
          category_id,
          is_published,
          tracks:audio_tracks(count)
        `)
        .eq("is_published", true)
        .order("display_order", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data || []) as AudioPlaylist[];
    },
  });

  // Group playlists by category
  const playlistsByCategory = categories.reduce((acc, category) => {
    acc[category.slug] = playlists.filter(p => p.category_id === category.id);
    return acc;
  }, {} as Record<string, AudioPlaylist[]>);

  const isLoading = categoriesLoading || playlistsLoading;

  // Default tab to first category
  const defaultTab = categories[0]?.slug || "audiobooks";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-3 sm:py-4">
        {categories.length > 0 ? (
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="flex justify-center gap-8 bg-transparent mb-6 h-auto p-0">
              {categories.map((category) => {
                const Icon = CATEGORY_ICONS[category.slug] || Music;
                const label = language === "uk" ? category.name_uk : category.name_en;

                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.slug}
                    className="flex items-center gap-2 bg-transparent px-0 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-primary"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.slug}>
                {/* For lectures category on mobile, use the timeline view */}
                {category.slug === "lectures" && isMobile ? (
                  <MobileLecturesTimeline />
                ) : isMobile ? (
                  <MobileAudioList
                    items={playlistsByCategory[category.slug] || []}
                    isLoading={isLoading}
                  />
                ) : (
                  <DesktopAudioGrid
                    items={playlistsByCategory[category.slug] || []}
                    isLoading={isLoading}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t("Аудіо поки що недоступне", "Audio not available yet")}
          </div>
        )}
      </div>
    </div>
  );
};
