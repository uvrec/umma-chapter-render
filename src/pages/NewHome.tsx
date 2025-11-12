// src/pages/NewHome.tsx
// Оновлена домашня сторінка з Hero + "Продовжити прослуховування", SearchStrip, Latest, Playlists, Support
// Інтегровано з GlobalAudioPlayer (useAudio) і динамічним Hero з БД (site_settings.home_hero)

import React, { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
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
import { useAudio } from "@/contexts/ModernAudioContext";

// --- Types ---
type ContentItem = {
  id: string;
  type: "audio" | "text" | "blog";
  title: string;
  subtitle?: string;
  href: string;
  duration?: string;
  created_at: string;
  // Додаткові дані для аудіо
  audioData?: {
    id: string;
    title: string;
    subtitle?: string;
    src: string;
    coverImage?: string;
    duration?: number;
  };
};

type AudioTrack = {
  id: string;
  title: string;
  src: string;
  playlist_title?: string;
  album?: string;
  verseNumber?: string | number;
};



// --- Hero Section (динамічний, з карткою "Продовжити") ---
function Hero() {
  const { currentTrack, isPlaying, togglePlay, currentTime, duration } = useAudio();
  const { language } = useLanguage();

  // Завантаження налаштувань з БД
  const { data: settingsData } = useQuery({
    queryKey: ["site-settings", "home_hero"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("site_settings").select("value").eq("key", "home_hero").single();
      if (error) throw error;
      return (data as any)?.value as {
        background_image: string;
        logo_image: string;
        subtitle_ua: string;
        subtitle_en: string;
        quote_ua: string;
        quote_en: string;
        quote_author_ua: string;
        quote_author_en: string;
      };
    },
  });

  // Дефолти поки не завантажилось
  const settings = settingsData || {
    background_image: "/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png",
    logo_image: "/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png",
    subtitle_ua: "Бібліотека ведичних аудіокниг",
    subtitle_en: "Library of Vedic audiobooks",
    quote_ua:
      "За моєї відсутності читайте книжки. Все, про що я говорю, я написав у книжках. Ви можете підтримувати зв'язок зі мною через мої книги.",
    quote_en:
      "In my absence, read the books. Everything I speak is written in the books. You can associate with me through my books.",
    quote_author_ua: "Шріла Прабгупада",
    quote_author_en: "Srila Prabhupada",
  };

  // Формат часу
  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const subtitle = language === "ua" ? settings.subtitle_ua : settings.subtitle_en;
  const quote = language === "ua" ? settings.quote_ua : settings.quote_en;
  const author = language === "ua" ? settings.quote_author_ua : settings.quote_author_en;

  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.6)), url(${settings.background_image})`,
      }}
    >
      <div className="container mx-auto px-4 text-center text-white">
        <div className="mx-auto max-w-4xl">
          {/* Logo */}
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 h-64 w-64 md:h-80 md:w-80">
              <img src={settings.logo_image} alt="Прабгупада соловʼїною" className="h-full w-full object-contain" />
            </div>
          </div>

          {/* Subtitle */}
          <p className="mb-8 text-xl font-medium text-white/90 md:text-2xl">{subtitle}</p>

          {/* Quote */}
          <div className="mb-8 rounded-lg border border-white/20 bg-black/20 p-6 backdrop-blur-sm">
            <p className="mb-4 text-base leading-relaxed text-white/90 md:text-lg">{quote}</p>
            <p className="text-sm italic text-white/70">— {author}</p>
          </div>

          {/* Continue Listening Card */}
          {currentTrack && (
            <div className="mt-8">
              <Card className="backdrop-blur bg-white/95 dark:bg-gray-900/95">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Headphones className="h-4 w-4" />
                    Продовжити прослуховування
                  </div>

                  <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1 text-left">
                        <div className="mb-1 truncate text-base font-semibold text-foreground">
                          {currentTrack.title_ua || currentTrack.title}
                        </div>
                        <div className="truncate text-sm text-muted-foreground">
                          {currentTrack.artist || currentTrack.album || "Vedavoice · Аудіо"}
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {isPlaying ? `Відтворюється ${formatTime(currentTime)}` : `Пауза на ${formatTime(currentTime)}`}
                        </div>
                      </div>

                    <Button size="sm" onClick={togglePlay} className="gap-2">
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? "Пауза" : "Продовжити"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
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
  const { playTrack } = useAudio();
  
  const handlePlayTrack = (item: ContentItem) => {
    if (item.type === "audio" && item.audioData) {
      playTrack(item.audioData);
    }
  };
  
  // Останні треки
  const { data: audioTracks } = useQuery({
    queryKey: ["latest-audio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_tracks")
        .select(
          `
          id,
          title_ua,
          title_en,
          audio_url,
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
      return data as any[];
    },
  });

  // Останні пости блогу
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
      return data as any[];
    },
  });

  const latestContent: ContentItem[] = [
    ...(audioTracks?.map((track: any) => ({
      id: track.id,
      type: "audio" as const,
      title: track.title_ua,
      subtitle: track.audio_playlists?.title_ua,
      href: `/audiobooks/${track.playlist_id}`,
      duration: track.duration
        ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, "0")}`
        : undefined,
      created_at: track.created_at,
      audioData: {
        id: track.id,
        title: track.title_ua,
        title_ua: track.title_ua,
        title_en: track.title_en,
        subtitle: track.audio_playlists?.title_ua,
        artist: 'Шріла Прабгупада', // За замовчанням автор
        src: track.audio_url || '',
        duration: track.duration,
        coverImage: '/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png', // Логотип як обкладинка за замовчанням
      },
    })) || []),
    ...(blogPosts?.map((post: any) => ({
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {latestContent.map((item) => (
          <Card key={item.id} className="transition-shadow hover:shadow-md">
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
                {item.type === "audio" ? (
                  <Button variant="secondary" size="sm" onClick={() => handlePlayTrack(item)}>
                    <Play className="mr-2 h-3 w-3" />
                    Слухати
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" asChild>
                    <a href={item.href}>
                      <ArrowRight className="mr-2 h-3 w-3" />
                      Читати
                    </a>
                  </Button>
                )}
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

// --- Featured Books Section ---
function FeaturedBooks() {
  const { language } = useLanguage();
  
  const { data: books = [], isLoading } = useQuery({
    queryKey: ['featured-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('id, slug, title_ua, title_en, cover_image_url')
        .eq('is_published', true)
        .order('display_order')
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <h2 className="mb-6 font-serif text-3xl font-semibold">Бібліотека</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-[2/3] w-full rounded-lg bg-muted animate-pulse" />
              <div className="h-4 w-3/4 mx-auto bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-3xl font-semibold">Бібліотека</h2>
        <Button variant="outline" size="sm" asChild>
          <a href="/library">
            <BookOpen className="mr-2 h-4 w-4" />
            Усі книги
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {books.map((book) => (
          <a
            key={book.id}
            href={`/veda-reader/${book.slug}`}
            className="group cursor-pointer"
          >
            {/* Book Cover */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300">
              {book.cover_image_url ? (
                <img
                  src={book.cover_image_url}
                  alt={language === 'ua' ? book.title_ua : book.title_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <span className="text-5xl opacity-50">📖</span>
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Book Title */}
            <h3 className="mt-3 text-sm font-medium text-center line-clamp-2 text-foreground group-hover:text-primary transition-colors px-1">
              {language === 'ua' ? book.title_ua : book.title_en}
            </h3>
          </a>
        ))}
      </div>
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

// --- Support Section ---
function SupportSection() {
  return (
    <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-center text-3xl font-bold md:text-4xl">Підтримати проєкт</h2>
          <p className="mb-8 text-center text-lg text-muted-foreground">
            Якщо ви хочете підтримати цей проект, ви можете зробити це фінансово або допомогти з редагуванням
            аудіозаписів чи перевіркою вже записаного матеріалу. Всі пожертви йдуть на розвиток проєкту.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => openExternal("https://paypal.me/andriiuvarov")} className="gap-2">
              PayPal
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button size="lg" onClick={() => openExternal("https://send.monobank.ua/jar/YAmYDYgti")} className="gap-2">
              Monobank
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Main Page ---
export const NewHome = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <SearchStrip />
        <LatestContent />
        <FeaturedBooks />
        <Playlists />
        <SupportSection />
      </main>
      <Footer />
    </div>
  );
};
