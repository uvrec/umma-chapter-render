// NewHome.tsx — оновлена версія з карткою "Продовжити прослуховування" у Hero
// Відповідає PDF шаблону 2: Hero, Continue Listening, SearchStrip, Latest, Playlists
// ВСІ ЕЛЕМЕНТИ ЗБЕРЕЖЕНО + додано інтеграцію з GlobalAudioPlayer

import React, { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { useAudio } from "@/components/GlobalAudioPlayer";

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

// --- Mini Player (внизу сторінки) ---
// ЗАЛИШЕНО для сумісності, але GlobalAudioPlayer з App.tsx має вищий пріоритет
function MiniPlayer({ queue }: { queue: AudioTrack[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = useMemo(() => queue[index], [queue, index]);

  const playPause = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      el.play();
    }
  };

  const next = () => setIndex((i) => (i + 1) % queue.length);
  const prev = () => setIndex((i) => (i - 1 + queue.length) % queue.length);

  if (!current) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
        <Music4 className="h-5 w-5" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{current.title}</div>
          <div className="truncate text-xs text-muted-foreground">{current.playlist_title || "Vedavoice · Аудіо"}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={prev} disabled={queue.length <= 1} className="h-9 w-9">
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button size="icon" onClick={playPause} className="h-9 w-9">
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={next} disabled={queue.length <= 1} className="h-9 w-9">
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        <audio
          ref={audioRef}
          src={current.src}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={next}
          className="hidden"
        />
      </div>
    </div>
  );
}

// --- Hero Section (з карткою "Продовжити") ---
function Hero() {
  const { currentTrack, isPlaying, togglePlay, currentTime, duration } = useAudio();

  // Функція для форматування часу
  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png)`,
      }}
    >
      <div className="container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-64 h-64 md:w-80 md:h-80 mb-4">
              <img
                src="/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png"
                alt="Прабгупада солов'їною"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-medium">Бібліотека ведичних аудіокниг</p>

          {/* Quote */}
          <div className="mb-8 p-6 bg-black/20 backdrop-blur-sm rounded-lg border border-white/20">
            <p className="text-base md:text-lg leading-relaxed text-white/90 mb-4">
              За моєї відсутності читайте книжки. Все, про що я говорю, я написав у книжках. Ви можете підтримувати
              зв'язок зі мною через мої книги.
            </p>
            <p className="text-sm text-white/70 text-right">
              — Шріла Прабгупада
              <br />7 серпня 1975 року, Торонто
            </p>
          </div>

          {/* CTA Buttons - ПЕРЕЙМЕНОВАНО як ти просив */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
              <a href="/library">
                <BookOpen className="w-5 h-5 mr-2" />
                Читати
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black"
            >
              <a href="/audiobooks">
                <Headphones className="w-5 h-5 mr-2" />
                Слухати
              </a>
            </Button>
          </div>

          {/* Картка "Продовжити прослуховування" (інтеграція з GlobalAudioPlayer) */}
          {currentTrack && (
            <div className="max-w-xl mx-auto">
              <Card className="bg-card/90 backdrop-blur border-white/20">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /> Продовжити прослуховування
                  </div>

                  <div className="rounded-xl border border-border bg-background/50 p-4">
                    <div className="mb-2 text-base font-semibold text-foreground">{currentTrack.title}</div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-foreground">
                          {currentTrack.verseNumber ? `Вірш ${currentTrack.verseNumber}` : "Аудіо"}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {formatTime(duration)} ·{" "}
                          {isPlaying
                            ? `Відтворюється ${formatTime(currentTime)}`
                            : `Пауза на ${formatTime(currentTime)}`}
                        </div>
                      </div>

                      <Button size="sm" onClick={togglePlay} className="gap-2 relative z-10">
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {isPlaying ? "Пауза" : "Продовжити"}
                      </Button>
                    </div>
                  </div>

                  {/* Опційно: Продовжити читання */}
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" /> Продовжити читання
                  </div>
                  <div className="mt-2 rounded-xl border border-border bg-background/50 p-4">
                    <div className="truncate text-sm font-medium text-foreground">Останній прочитаний вірш</div>
                    <div className="truncate text-xs text-muted-foreground">Відкрийте бібліотеку для продовження</div>
                    <a href="/library" className="mt-3 inline-flex items-center gap-2 text-sm hover:underline">
                      Відкрити <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/70" />
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
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Пошук за назвою або ключовими словами…"
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Знайти
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// --- Latest Content (ЗАЛИШЕНО ПОВНІСТЮ) ---
function LatestContent() {
  // Fetch latest audio tracks
  const { data: audioTracks } = useQuery({
    queryKey: ["latest-audio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_tracks")
        .select(
          `
          id,
          title_ua,
          duration,
          created_at,
          playlist_id,
          audio_playlists!inner (
            id,
            title_ua,
            is_published,
            category_id,
            audio_categories (
              slug
            )
          )
        `,
        )
        .eq("audio_playlists.is_published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  // Fetch latest blog posts
  const { data: blogPosts } = useQuery({
    queryKey: ["latest-blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title_ua, excerpt_ua, slug, created_at, read_time")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  // Combine and format content
  const latestContent: ContentItem[] = [
    ...(audioTracks?.map((track) => ({
      id: track.id,
      type: "audio" as const,
      title: track.title_ua,
      subtitle: track.audio_playlists?.title_ua,
      href: `/audiobooks/${track.playlist_id}`,
      duration: track.duration
        ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, "0")}`
        : undefined,
      created_at: track.created_at,
    })) || []),
    ...(blogPosts?.map((post) => ({
      id: post.id,
      type: "blog" as const,
      title: post.title_ua,
      subtitle: post.excerpt_ua || undefined,
      href: `/blog/${post.slug}`,
      duration: post.read_time ? `${post.read_time} хв` : undefined,
      created_at: post.created_at,
    })) || []),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-3xl font-semibold">Останні додані</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/audiobooks">
              <Headphones className="h-4 w-4 mr-2" />
              Усе аудіо
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/library">
              <BookOpen className="h-4 w-4 mr-2" />
              Усі тексти
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {latestContent.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2 text-base font-semibold">
                {item.type === "audio" ? (
                  <Headphones className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <BookOpen className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="truncate">{item.title}</span>
              </div>

              {item.subtitle && <div className="mb-3 line-clamp-2 text-sm text-muted-foreground">{item.subtitle}</div>}

              <div className="flex items-center justify-between">
                <Button variant="secondary" size="sm" asChild>
                  <a href={item.href}>
                    {item.type === "audio" ? (
                      <>
                        <Play className="h-3 w-3 mr-2" />
                        Слухати
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-3 w-3 mr-2" />
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
    </section>
  );
}

// --- Quick Access Playlists (ЗАЛИШЕНО) ---
function Playlists() {
  const featuredPlaylists = [
    { title: "Популярне", href: "/audiobooks?sort=popular" },
    { title: "Останні", href: "/audiobooks?sort=latest" },
    { title: "Бгаґаватам", href: "/audiobooks?tag=sb" },
    { title: "Бгаґавад-ґіта", href: "/audiobooks?tag=bg" },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-8">
      <h3 className="mb-4 font-serif text-xl font-semibold">Швидкий доступ</h3>
      <div className="flex flex-wrap gap-2">
        {featuredPlaylists.map((p) => (
          <Button key={p.href} variant="outline" asChild>
            <a href={p.href}>{p.title}</a>
          </Button>
        ))}
      </div>
    </section>
  );
}

// --- Support Section (ЗАЛИШЕНО) ---
function SupportSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Підтримати проєкт</h2>
          <p className="text-lg text-muted-foreground mb-8 text-center">
            Якщо ви хочете підтримати цей проект, ви можете зробити це фінансово або допомогти з редагуванням
            аудіозаписів чи перевіркою вже записаного матеріалу. Всі пожертви йдуть на розвиток проєкту.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => openExternal("https://paypal.me/andriiuvarov")} className="gap-2">
              PayPal
              <ExternalLink className="w-4 h-4" />
            </Button>

            <Button size="lg" onClick={() => openExternal("https://send.monobank.ua/jar/YAmYDYgti")} className="gap-2">
              Monobank
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Main Page ---
export const NewHome = () => {
  // Mock queue - replace with actual data from continue listening
  const queue: AudioTrack[] = [
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
        <LatestContent />
        <Playlists />
        <SupportSection />
      </main>
      <Footer />
      <MiniPlayer queue={queue} />
    </div>
  );
};
