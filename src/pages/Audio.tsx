// Audio.tsx - Player-centric audio hub
import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAudio } from "@/contexts/ModernAudioContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Headphones,
  Mic,
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ListMusic,
  Heart,
  ChevronRight,
  ChevronDown,
  X,
  Trash2,
  Volume2,
  Repeat,
  Repeat1,
  Shuffle,
  Clock,
  Library
} from "lucide-react";
import { cn } from "@/lib/utils";

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

// Now Playing Section
function NowPlayingSection() {
  const { t } = useLanguage();
  const {
    currentTrack,
    isPlaying,
    playlist,
    currentIndex,
    togglePlay,
    nextTrack,
    prevTrack,
    setIsExpanded,
    removeFromPlaylist,
    jumpToTrack,
    clearPlaylist
  } = useAudio();
  const [showQueue, setShowQueue] = useState(false);

  if (!currentTrack && playlist.length === 0) {
    return null;
  }

  const upcomingTracks = currentIndex !== null
    ? playlist.slice(currentIndex + 1)
    : playlist;

  return (
    <div className="mb-6">
      {/* Now Playing Card */}
      {currentTrack && (
        <div
          className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-4 mb-3"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center gap-4">
            {/* Cover */}
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              {currentTrack.coverImage ? (
                <img
                  src={currentTrack.coverImage}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-primary/50" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-primary font-medium mb-0.5">
                {t("Зараз відтворюється", "Now Playing")}
              </p>
              <h3 className="font-semibold text-foreground truncate">
                {currentTrack.title_uk || currentTrack.title}
              </h3>
              {currentTrack.subtitle && (
                <p className="text-sm text-muted-foreground truncate">
                  {currentTrack.subtitle}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={prevTrack}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={nextTrack}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Queue Toggle */}
      {playlist.length > 0 && (
        <button
          onClick={() => setShowQueue(!showQueue)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-3">
            <ListMusic className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">
              {t("Черга", "Queue")}
            </span>
            <span className="text-sm text-muted-foreground">
              ({playlist.length} {t("треків", "tracks")})
            </span>
          </div>
          <ChevronRight className={cn(
            "w-5 h-5 text-muted-foreground transition-transform",
            showQueue && "rotate-90"
          )} />
        </button>
      )}

      {/* Queue List */}
      {showQueue && playlist.length > 0 && (
        <div className="mt-2 rounded-xl overflow-hidden">
          {/* Queue Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
            <span className="text-sm font-medium text-muted-foreground">
              {upcomingTracks.length > 0
                ? t(`Далі: ${upcomingTracks.length} треків`, `Up next: ${upcomingTracks.length} tracks`)
                : t("Черга порожня", "Queue empty")
              }
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-destructive hover:text-destructive"
              onClick={clearPlaylist}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              {t("Очистити", "Clear")}
            </Button>
          </div>

          {/* Queue Tracks */}
          <div className="max-h-64 overflow-y-auto">
            {playlist.map((track, index) => {
              const isCurrent = index === currentIndex;
              return (
                <div
                  key={`${track.id}-${index}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer",
                    isCurrent && "bg-primary/10"
                  )}
                  onClick={() => jumpToTrack(index)}
                >
                  {/* Track Number / Playing Indicator */}
                  <div className="w-6 text-center flex-shrink-0">
                    {isCurrent ? (
                      <div className="flex items-center justify-center gap-0.5">
                        <span className="w-1 h-3 bg-primary rounded-full animate-pulse" />
                        <span className="w-1 h-4 bg-primary rounded-full animate-pulse delay-75" />
                        <span className="w-1 h-2 bg-primary rounded-full animate-pulse delay-150" />
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">{index + 1}</span>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm truncate",
                      isCurrent ? "font-medium text-primary" : "text-foreground"
                    )}>
                      {track.title_uk || track.title}
                    </p>
                    {track.subtitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        {track.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromPlaylist(index);
                    }}
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Category Card Component
interface CategoryCardProps {
  category: AudioCategory;
  playlists: AudioPlaylist[];
  isLoading: boolean;
}

function CategoryCard({ category, playlists, isLoading }: CategoryCardProps) {
  const { language, t, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();
  const Icon = CATEGORY_ICONS[category.slug] || Music;
  const label = language === "uk" ? category.name_uk : category.name_en;

  // Get first 4 playlists for preview
  const previewPlaylists = playlists.slice(0, 4);
  const totalTracks = playlists.reduce((sum, p) => sum + (p.tracks?.[0]?.count || 0), 0);

  const handleCategoryClick = () => {
    // Navigate to category-specific page
    if (category.slug === "audiobooks") {
      navigate(getLocalizedPath("/audiobooks"));
    } else {
      navigate(getLocalizedPath(`/audio/${category.slug}`));
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-3" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (playlists.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {/* Category Header */}
      <button
        onClick={handleCategoryClick}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">{label}</h2>
          <span className="text-sm text-muted-foreground">
            ({playlists.length})
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </button>

      {/* Playlist Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {previewPlaylists.map((playlist) => {
          const title = language === "uk"
            ? (playlist.title_uk || playlist.title_en)
            : (playlist.title_en || playlist.title_uk);
          const trackCount = playlist.tracks?.[0]?.count || 0;

          return (
            <div
              key={playlist.id}
              onClick={() => navigate(getLocalizedPath(`/audiobooks/${playlist.id}`))}
              className="group cursor-pointer"
            >
              {/* Cover */}
              <div className="relative aspect-square overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-all">
                {playlist.cover_image_url ? (
                  <img
                    src={playlist.cover_image_url}
                    alt={title || ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary/50" />
                  </div>
                )}

                {/* Hover Play Button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="mt-2 text-sm font-medium line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                {title || t("Без назви", "Untitled")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {trackCount} {t("треків", "tracks")}
              </p>
            </div>
          );
        })}
      </div>

      {/* View All Link */}
      {playlists.length > 4 && (
        <button
          onClick={handleCategoryClick}
          className="mt-3 text-sm text-primary hover:underline"
        >
          {t(`Переглянути всі (${playlists.length})`, `View all (${playlists.length})`)}
        </button>
      )}
    </div>
  );
}

// Favorites Section
function FavoritesSection() {
  const { t, language, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();
  const { favorites, playTrack, removeFavorite } = useAudio();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-semibold">{t("Улюблене", "Favorites")}</h2>
        <span className="text-sm text-muted-foreground">
          ({favorites.length})
        </span>
      </div>

      <div className="space-y-1">
        {favorites.slice(0, 5).map((fav) => (
          <div
            key={fav.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
            onClick={() => playTrack({
              id: fav.trackId,
              title: fav.title,
              title_uk: fav.title_uk,
              src: fav.src,
              coverImage: fav.coverImage,
              verseId: fav.verseId,
            })}
          >
            {/* Cover */}
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              {fav.coverImage ? (
                <img src={fav.coverImage} alt={fav.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <Music className="w-5 h-5 text-primary/50" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fav.title_uk || fav.title}</p>
              {fav.verseRef && (
                <p className="text-xs text-muted-foreground">{fav.verseRef}</p>
              )}
            </div>

            {/* Remove */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                removeFavorite(fav.trackId);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {favorites.length > 5 && (
        <button className="mt-2 text-sm text-primary hover:underline">
          {t(`Показати всі (${favorites.length})`, `Show all (${favorites.length})`)}
        </button>
      )}
    </div>
  );
}

// Empty State
function EmptyState() {
  const { t } = useLanguage();

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
        <Headphones className="w-10 h-10 text-primary/50" />
      </div>
      <h2 className="text-xl font-semibold mb-2">
        {t("Почніть слухати", "Start listening")}
      </h2>
      <p className="text-muted-foreground max-w-sm mx-auto">
        {t(
          "Оберіть аудіокнигу, лекцію або музику з колекції нижче",
          "Choose an audiobook, lecture, or music from the collection below"
        )}
      </p>
    </div>
  );
}

// Format time helper
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Mobile Fullscreen Player - просто плеєр з усіма треками
function MobileFullscreenPlayer() {
  const { t, language } = useLanguage();
  const tracksLoadedRef = useRef(false);

  const {
    currentTrack,
    isPlaying,
    playlist,
    currentIndex,
    currentTime,
    duration,
    repeatMode,
    isShuffled,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    toggleRepeat,
    toggleShuffle,
    jumpToTrack,
    playPlaylist,
    isFavorite,
    addFavorite,
    removeFavorite,
  } = useAudio();

  // Завантажуємо всі треки з бази
  const { data: allTracks = [], isLoading } = useQuery({
    queryKey: ["all-audio-tracks-mobile"],
    queryFn: async () => {
      const { data, error } = await (supabase.from as any)("audio_tracks")
        .select(`
          id,
          title_uk,
          title_en,
          audio_url,
          duration,
          track_number,
          playlist:audio_playlists!inner(
            id,
            title_uk,
            title_en,
            cover_image_url,
            author
          )
        `)
        .eq("is_published", true)
        .not("audio_url", "is", null)
        .order("track_number", { ascending: true });

      if (error) throw error;
      return (data || []).map((t: any) => ({
        id: t.id,
        title: t.title_uk || t.title_en || "Без назви",
        title_uk: t.title_uk,
        title_en: t.title_en,
        src: t.audio_url,
        duration: t.duration,
        coverImage: t.playlist?.cover_image_url,
        artist: t.playlist?.author,
        album: t.playlist?.title_uk || t.playlist?.title_en,
      }));
    },
  });

  // Автозавантаження треків у плейлист
  useEffect(() => {
    if (allTracks.length > 0 && playlist.length === 0 && !tracksLoadedRef.current) {
      tracksLoadedRef.current = true;
      playPlaylist(allTracks, 0);
    }
  }, [allTracks, playlist.length, playPlaylist]);

  const handleFavoriteToggle = () => {
    if (!currentTrack) return;
    if (isFavorite(currentTrack.id)) {
      removeFavorite(currentTrack.id);
    } else {
      addFavorite(currentTrack);
    }
  };

  // Показуємо список треків (або з плейлисту, або завантажені)
  const displayTracks = playlist.length > 0 ? playlist : allTracks;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Плеєр зверху */}
      <div className="flex-shrink-0 p-4 border-b bg-card">
        {/* Обкладинка та інфо */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {currentTrack?.coverImage ? (
              <img
                src={currentTrack.coverImage}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate text-sm">
              {currentTrack?.title_uk || currentTrack?.title || t("Оберіть трек", "Select a track")}
            </h2>
            {currentTrack?.album && (
              <p className="text-xs text-muted-foreground truncate">{currentTrack.album}</p>
            )}
          </div>
          {currentTrack && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleFavoriteToggle}
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  isFavorite(currentTrack.id) && "fill-red-500 text-red-500"
                )}
              />
            </Button>
          )}
        </div>

        {/* Прогрес */}
        <div className="mb-3">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={([val]) => seek(val)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Контроли */}
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", isShuffled && "text-primary")}
            onClick={toggleShuffle}
          >
            <Shuffle className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={prevTrack}>
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>

          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={nextTrack}>
            <SkipForward className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", repeatMode !== "off" && "text-primary")}
            onClick={toggleRepeat}
          >
            {repeatMode === "one" ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Список треків */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-6 h-4 bg-muted rounded" />
                <div className="w-10 h-10 bg-muted rounded" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          displayTracks.map((track, index) => {
            const isCurrent = playlist.length > 0 ? index === currentIndex : false;
            return (
              <div
                key={`${track.id}-${index}`}
                onClick={() => {
                  if (playlist.length > 0) {
                    jumpToTrack(index);
                  } else {
                    playPlaylist(allTracks, index);
                  }
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 border-b border-border/30 active:bg-muted/50",
                  isCurrent && "bg-primary/5"
                )}
              >
                {/* Номер */}
                <div className="w-6 text-center flex-shrink-0">
                  {isCurrent && isPlaying ? (
                    <div className="flex items-center justify-center gap-0.5">
                      <span className="w-0.5 h-3 bg-primary rounded-full animate-pulse" />
                      <span className="w-0.5 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: "75ms" }} />
                      <span className="w-0.5 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">{index + 1}</span>
                  )}
                </div>

                {/* Міні обкладинка */}
                <div className="w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
                  {track.coverImage ? (
                    <img src={track.coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Інфо */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm truncate",
                    isCurrent && "font-medium text-primary"
                  )}>
                    {track.title_uk || track.title}
                  </p>
                  {track.album && (
                    <p className="text-xs text-muted-foreground truncate">{track.album}</p>
                  )}
                </div>

                {/* Тривалість */}
                <span className="text-xs text-muted-foreground">
                  {formatTime(track.duration || 0)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export const Audio = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const { currentTrack, playlist } = useAudio();

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
    acc[category.id] = playlists.filter(p => p.category_id === category.id);
    return acc;
  }, {} as Record<string, AudioPlaylist[]>);

  const isLoading = categoriesLoading || playlistsLoading;
  const hasContent = !currentTrack && playlist.length === 0 && playlists.length === 0;

  // Mobile: show fullscreen player
  if (isMobile) {
    return <MobileFullscreenPlayer />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-4">
        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6">
          {t("Аудіо", "Audio")}
        </h1>

        {/* Now Playing & Queue */}
        <NowPlayingSection />

        {/* Favorites */}
        <FavoritesSection />

        {/* Categories */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 w-32 bg-muted rounded mb-3" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j}>
                      <div className="aspect-square bg-muted rounded-xl mb-2" />
                      <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                playlists={playlistsByCategory[category.id] || []}
                isLoading={isLoading}
              />
            ))}
          </div>
        ) : hasContent ? (
          <EmptyState />
        ) : null}
      </div>
    </div>
  );
};
