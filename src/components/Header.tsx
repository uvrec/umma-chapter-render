// NewHome.tsx — фінальна версія з усіма покращеннями

import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContinueListening } from "@/components/ContinueListening";
import { CategoryFilter } from "@/components/CategoryFilter";
import { useAudioQueue } from "@/hooks/useAudioQueue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  Headphones,
  BookOpen,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Clock,
  ArrowRight,
  Music4,
  Search,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { openExternal } from "@/lib/openExternal";

// --- Types ---
type ContentItem = {
  id: string;
  type: "audio" | "text" | "blog";
  title: string;
  subtitle?: string;
  href: string;
  duration?: string;
  created_at: string;
};

type AudioTrack = {
  id: string;
  title: string;
  src: string;
  playlist_title?: string;
};

// --- Mini Player ---
function MiniPlayer({ queue }: { queue: AudioTrack[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  const current = useMemo(() => queue?.[index], [queue, index]);

  const playPause = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    playing ? el.pause() : el.play();
  }, [playing]);

  const next = () => {
    if (queue.length > 0) setIndex((i) => (i + 1) % queue.length);
  };
  const prev = () => {
    if (queue.length > 0) setIndex((i) => (i - 1 + queue.length) % queue.length);
  };

  useEffect(() => {
    const el = audioRef.current;
    if (!current || !el) return;
    const saved = localStorage.getItem(`vv_progress_${current.id}`);
    if (saved) {
      const t = parseFloat(saved);
      if (!Number.isNaN(t)) el.currentTime = t;
    }
  }, [current?.id]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !current) return;

    const onTime = () => {
      if (!el.duration) return;
      const pct = (el.currentTime / el.duration) * 100;
      setProgress(pct);
      if (Math.floor(el.currentTime) % 2 === 0) {
        localStorage.setItem(`vv_progress_${current.id}`, String(el.currentTime));
      }
    };

    el.addEventListener("timeupdate", onTime);
    return () => el.removeEventListener("timeupdate", onTime);
  }, [current?.id]);

  const handleLoadedMetadata = () => {
    const el = audioRef.current;
    if (el) setDuration(el.duration || 0);
  };

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    const bar = barRef.current;
    if (!el || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    el.currentTime = Math.max(0, Math.min(duration, duration * ratio));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      const isEditable =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        (document.activeElement as HTMLElement | null)?.isContentEditable;
      if (isEditable) return;

      const el = audioRef.current;
      if (!el) return;

      if (e.code === "Space") {
        e.preventDefault();
        playPause();
      } else if (e.code === "ArrowRight") {
        el.currentTime = Math.min((el.currentTime || 0) + 5, duration || el.duration || 0);
      } else if (e.code === "ArrowLeft") {
        el.currentTime = Math.max((el.currentTime || 0) - 5, 0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playPause, duration]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!current) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur animate-in slide-in-from-bottom duration-300"
      role="region"
      aria-label="Міні-плеєр"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div
          ref={barRef}
          className="h-1 cursor-pointer bg-muted transition-colors hover:h-1.5"
          onClick={handleBarClick}
          role="slider"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Прогрес відтворення"
        >
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
          <Music4 className="h-5 w-5" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{current.title}</div>
            <div className="truncate text-xs text-muted-foreground">
              {current.playlist_title || "Vedavoice · Аудіо"} · {formatTime(audioRef.current?.currentTime || 0)} /{" "}
              {formatTime(duration)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              disabled={queue.length <= 1}
              className="h-9 w-9"
              aria-label="Попередній трек"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button size="icon" onClick={playPause} className="h-9 w-9" aria-label={playing ? "Пауза" : "Відтворити"}>
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              disabled={queue.length <= 1}
              className="h-9 w-9"
              aria-label="Наступний трек"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <audio
            ref={audioRef}
            src={current.src}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={next}
            onLoadedMetadata={handleLoadedMetadata}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}

// --- Hero Section ---
function Hero() {
  return (
    <section
      className="relative flex min-h-[80vh] items-center justify-center bg-cover bg-center bg-no-repeat animate-in fade-in duration-700"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png)",
      }}
    >
      <div className="container mx-auto px-4 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-col items-center animate-in slide-in-from-top duration-500">
            <div className="mb-4 h-64 w-64 md:h-80 md:w-80">
              <img
                src="/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png"
                alt="Прабгупада солов'їною"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-xl text-white/90 md:text-2xl">
              Прабгупада солов'їною. <span className="opacity-80">Продовжуй там, де зупинився.</span>
            </div>
          </div>

          <p className="mb-8 text-xl font-medium text-white/90 md:text-2xl animate-in slide-in-from-top duration-500 delay-100">
            Бібліотека ведичних аудіокниг
          </p>

          <div className="mb-8 rounded-lg border border-white/20 bg-black/20 p-6 backdrop-blur-sm animate-in slide-in-from-bottom duration-500 delay-200">
            <p className="mb-4 text-base leading-relaxed text-white/90 md:text-lg">
              За моєї відсутності читайте книжки. Все, про що я говорю, я написав у книжках. Ви можете підтримувати
              зв'язок зі мною через мої книги.
            </p>
            <p className="text-right text-sm text-white/70">
              — Шріла Прабгупада
              <br />7 серпня 1975 року, Торонто
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row animate-in slide-in-from-bottom duration-500 delay-300">
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
              <a href="/library">
                <BookOpen className="mr-2 h-5 w-5" />
                Переглянути бібліотеку
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black"
            >
              <a href="/audiobooks">
                <Headphones className="mr-2 h-5 w-5" />
                Аудіокниги
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-white/70" />
      </div>
    </section>
  );
}

// --- Search Strip ---
function SearchStrip() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/glossary?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 animate-in fade-in duration-500">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Пошук за назвою або ключовими словами…"
              className="flex-1"
              aria-label="Пошук"
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Знайти
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// --- Latest Content ---
function LatestContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: audioTracks = [], isLoading: aLoading } = useQuery({
    queryKey: ["latest-audio", selectedCategory],
    staleTime: 60_000,
    placeholderData: [],
    queryFn: async () => {
      let query = supabase
        .from("audio_tracks")
        .select(
          `
          id,
          title_ua,
          duration,
          created_at,
          audio_playlists!inner (
            title_ua,
            slug,
            is_published,
            audio_categories (
              slug
            )
          )
        `,
        )
        .eq("audio_playlists.is_published", true);

      if (selectedCategory) {
        query = query.eq("audio_playlists.audio_categories.slug", selectedCategory);
      }

      const { data, error } = await query.order("created_at", { ascending: false }).limit(6);

      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: blogPosts = [], isLoading: bLoading } = useQuery({
    queryKey: ["latest-blog"],
    staleTime: 60_000,
    placeholderData: [],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title_ua, excerpt_ua, slug, created_at, read_time, is_published, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data ?? [];
    },
  });

  const latestContent: ContentItem[] = [
    ...(audioTracks as any[]).map((track) => {
      const catSlug = track.audio_playlists?.audio_categories?.slug;
      const playlistSlug = track.audio_playlists?.slug;
      const href =
        catSlug && playlistSlug
          ? `/audiobooks/${catSlug}/${playlistSlug}`
          : playlistSlug
            ? `/audiobooks/${playlistSlug}`
            : `/audiobooks`;
      return {
        id: track.id,
        type: "audio" as const,
        title: track.title_ua,
        subtitle: track.audio_playlists?.title_ua,
        href,
        duration: track.duration
          ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, "0")}`
          : undefined,
        created_at: track.created_at,
      };
    }),
    ...(blogPosts as any[]).map((post) => ({
      id: post.id,
      type: "blog" as const,
      title: post.title_ua,
      subtitle: post.excerpt_ua || undefined,
      href: `/blog/${post.slug}`,
      duration: post.read_time ? `${post.read_time} хв` : undefined,
      created_at: post.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-3xl font-semibold">Останні додані</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/audiobooks">
              <Headphones className="mr-2 h-4 w-4" />
              Усе аудіо
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/library">
              <BookOpen className="mr-2 h-4 w-4" />
              Усі тексти
            </a>
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      </div>

      {aLoading && bLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-3 w-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestContent.map((item, idx) => (
            <Card
              key={item.id}
              className="transition-shadow hover:shadow-md animate-in fade-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2 text-base font-semibold">
                  {item.type === "audio" ? (
                    <Headphones className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <BookOpen className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="truncate">{item.title}</span>
                </div>

                {item.subtitle && (
                  <div className="mb-3 line-clamp-2 text-sm text-muted-foreground">{item.subtitle}</div>
                )}

                <div className="flex items-center justify-between">
                  <Button variant="secondary" size="sm" asChild>
                    <a href={item.href}>
                      {item.type === "audio" ? (
                        <>
                          <Play className="mr-2 h-3 w-3" />
                          Слухати
                        </>
                      ) : (
                        <>
                          <ArrowRight className="mr-2 h-3 w-3" />
                          Читати
                        </>
                      )}
                    </a>
                  </Button>
                  {item.duration && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {item.duration}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

// --- Quick Access Playlists ---
function Playlists() {
  const featuredPlaylists = [
    { title: "Популярне", href: "/audiobooks?sort=popular" },
    { title: "Останні", href: "/audiobooks?sort=latest" },
    { title: "Бгаґаватам", href: "/audiobooks?tag=sb" },
    { title: "Бгаґавад-ґіта", href: "/audiobooks?tag=bg" },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-8 animate-in fade-in duration-500">
      <h3 className="mb-4 font-serif text-xl font-semibold">Швидкий доступ</h3>
      <div className="flex flex-wrap gap-2">
        {featuredPlaylists.map((p, idx) => (
          <Button
            key={p.href}
            variant="outline"
            asChild
            className="animate-in fade-in slide-in-from-left duration-300"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <a href={p.href}>{p.title}</a>
          </Button>
        ))}
      </div>
    </section>
  );
}

// --- Support Section ---
function SupportSection() {
  return (
    <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-16 animate-in fade-in duration-500">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-center text-3xl font-bold md:text-4xl">Підтримати проєкт</h2>
          <p className="mb-8 text-center text-lg text-muted-foreground">
            Якщо ви хочете підтримати цей проєкт, ви можете зробити це фінансово або допомогти з редагуванням
            аудіозаписів чи перевіркою вже записаного матеріалу. Всі пожертви йдуть на розвиток проєкту.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={() => openExternal("https://paypal.me/andriiuvarov")} className="gap-2">
              PayPal
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://send.monobank.ua/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Monobank
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Main Page ---
export const NewHome = () => {
  // Завантажити реальну чергу з останніх прослуханих треків
  const { queue } = useAudioQueue({ limit: 10 });

  // Fallback до mock даних якщо черга порожня
  const audioQueue: AudioTrack[] =
    queue.length > 0
      ? queue
      : [
          {
            id: "a1",
            title: "ШБ 3.26.19 — Бомбей, 1974",
            src: "/media/sb-32619.mp3",
            playlist_title: "Шрімад-Бгаґаватам",
          },
        ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main>
        <Hero />
        <SearchStrip />
        <ContinueListening />
        <LatestContent />
        <Playlists />
        <SupportSection />
      </main>
      <Footer />
      <MiniPlayer queue={audioQueue} />
    </div>
  );
};
