// Audio.tsx - Minimalist audio library page (NeuBibel style)
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Headphones, Mic, Music, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Audio content data
const AUDIOBOOKS = [
  {
    id: "sb",
    slug: "sb",
    title_uk: "Шрімад-Бгаґаватам",
    title_en: "Srimad Bhagavatam",
    track_count: 12,
    cover: "/assets/srimad-bhagavatam-1-cover.webp",
  },
  {
    id: "bg",
    slug: "bg",
    title_uk: "Бгаґавад-ґіта",
    title_en: "Bhagavad-gita",
    track_count: 18,
    cover: "/assets/bhagavad-gita-cover.webp",
  },
  {
    id: "iso",
    slug: "iso",
    title_uk: "Шрі Ішопанішад",
    title_en: "Sri Isopanishad",
    track_count: 18,
    cover: "/assets/sri-isopanishad-cover.webp",
  },
  {
    id: "noi",
    slug: "noi",
    title_uk: "Нектар віддності",
    title_en: "Nectar of Instruction",
    track_count: 11,
    cover: "/assets/noi-cover.webp",
  },
];

const PLAYLISTS = [
  {
    id: "morning",
    slug: "morning",
    title_uk: "Ранкова програма",
    title_en: "Morning Program",
    track_count: 8,
  },
  {
    id: "bhajans",
    slug: "bhajans",
    title_uk: "Бгаджани",
    title_en: "Bhajans",
    track_count: 24,
  },
  {
    id: "kirtans",
    slug: "kirtans",
    title_uk: "Кіртани",
    title_en: "Kirtans",
    track_count: 16,
  },
];

const LECTURES = [
  {
    id: "prabhupada",
    slug: "prabhupada",
    title_uk: "Лекції Прабгупади",
    title_en: "Prabhupada Lectures",
    track_count: 156,
  },
  {
    id: "seminars",
    slug: "seminars",
    title_uk: "Семінари",
    title_en: "Seminars",
    track_count: 42,
  },
];

// Swipeable audio row component
interface SwipeableAudioRowProps {
  item: {
    id: string;
    slug: string;
    title_uk: string;
    title_en: string;
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

  const title = language === "uk" ? item.title_uk : item.title_en;

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
            <div className="font-medium text-foreground">{title}</div>
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
  items: typeof AUDIOBOOKS;
  basePath: string;
}

function MobileAudioList({ items, basePath }: MobileAudioListProps) {
  const { language, t, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();

  const handleRowClick = useCallback((slug: string) => {
    navigate(getLocalizedPath(`${basePath}/${slug}`));
  }, [navigate, getLocalizedPath, basePath]);

  const handleTrackClick = useCallback((slug: string, track: number) => {
    navigate(getLocalizedPath(`${basePath}/${slug}/${track}`));
  }, [navigate, getLocalizedPath, basePath]);

  return (
    <div className="divide-y divide-border/50">
      {items.map((item) => (
        <SwipeableAudioRow
          key={item.id}
          item={item}
          onRowClick={() => handleRowClick(item.slug)}
          onTrackClick={(track) => handleTrackClick(item.slug, track)}
          language={language}
          t={t}
        />
      ))}
    </div>
  );
}

// Desktop grid component
interface DesktopAudioGridProps {
  items: typeof AUDIOBOOKS;
  basePath: string;
}

function DesktopAudioGrid({ items, basePath }: DesktopAudioGridProps) {
  const { language, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {items.map((item) => {
        const title = language === "uk" ? item.title_uk : item.title_en;
        const cover = (item as any).cover;

        return (
          <div
            key={item.id}
            onClick={() => navigate(getLocalizedPath(`${basePath}/${item.slug}`))}
            className="group cursor-pointer"
          >
            {/* Cover */}
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300">
              {cover ? (
                <img
                  src={cover}
                  alt={title}
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
              {title}
            </h3>
            <p className="text-xs text-center text-muted-foreground">
              {item.track_count} треків
            </p>
          </div>
        );
      })}
    </div>
  );
}

export const Audio = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-3 sm:py-4">
        <Tabs defaultValue="audiobooks" className="w-full">
          <TabsList className="flex justify-center gap-8 bg-transparent mb-6 h-auto p-0">
            <TabsTrigger
              value="audiobooks"
              className="flex items-center gap-2 bg-transparent px-0 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-primary"
            >
              <Headphones className="w-4 h-4" />
              <span>{t("Аудіокниги", "Audiobooks")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="playlists"
              className="flex items-center gap-2 bg-transparent px-0 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-primary"
            >
              <Music className="w-4 h-4" />
              <span>{t("Плейлісти", "Playlists")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="lectures"
              className="flex items-center gap-2 bg-transparent px-0 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-primary"
            >
              <Mic className="w-4 h-4" />
              <span>{t("Лекції", "Lectures")}</span>
            </TabsTrigger>
          </TabsList>

          {/* Audiobooks Tab */}
          <TabsContent value="audiobooks">
            {isMobile ? (
              <MobileAudioList items={AUDIOBOOKS} basePath="/audio/book" />
            ) : (
              <DesktopAudioGrid items={AUDIOBOOKS} basePath="/audio/book" />
            )}
          </TabsContent>

          {/* Playlists Tab */}
          <TabsContent value="playlists">
            {isMobile ? (
              <MobileAudioList items={PLAYLISTS} basePath="/audio/playlist" />
            ) : (
              <DesktopAudioGrid items={PLAYLISTS} basePath="/audio/playlist" />
            )}
          </TabsContent>

          {/* Lectures Tab */}
          <TabsContent value="lectures">
            {isMobile ? (
              <MobileAudioList items={LECTURES} basePath="/audio/lectures" />
            ) : (
              <DesktopAudioGrid items={LECTURES} basePath="/audio/lectures" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
