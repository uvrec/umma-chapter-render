// src/pages/NewHome.tsx
// Оновлена домашня сторінка відповідно до дизайну vedavoice.org

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Headphones,
  BookOpen,
  Play,
  Clock,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Home,
  Book,
  Languages,
  GraduationCap,
  BookMarked,
  User,
  Heart
} from "lucide-react";
import { openExternal } from "@/lib/openExternal";
import { useAudio } from "@/contexts/ModernAudioContext";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

// --- Types ---
type ContentItem = {
  id: string;
  type: "audio" | "text" | "blog";
  title: string;
  subtitle?: string;
  href: string;
  duration?: string;
  created_at: string;
  category?: string;
  audioData?: {
    id: string;
    title: string;
    subtitle?: string;
    src: string;
    url: string;
    coverImage?: string;
    duration?: number;
  };
};

// --- Hero Section ---
function Hero() {
  const { language } = useLanguage();

  // Завантаження налаштувань з БД
  const { data: settingsData } = useQuery({
    queryKey: ["site-settings", "home_hero"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("value")
        .eq("key", "home_hero")
        .single();
      if (error) {
        console.error("Failed to load home hero settings:", error);
        return null;
      }
      return (data as any)?.value as {
        background_image: string;
        logo_image: string;
        subtitle_ua: string;
        subtitle_en: string;
        quote_ua?: string;
        quote_en?: string;
        quote_author_ua?: string;
        quote_author_en?: string;
        quote_source_ua?: string;
        quote_source_en?: string;
      };
    },
  });

  // Завантаження щоденної цитати
  const { data: dailyQuote } = useQuery({
    queryKey: ["daily-quote"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_quotes")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (error) {
        console.log("No daily quote found:", error);
        return null;
      }
      return data;
    },
  });

  const settings = settingsData || {
    background_image: "/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png",
    logo_image: "/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png",
    subtitle_ua: "Бібліотека ведичних аудіокниг",
    subtitle_en: "Library of Vedic audiobooks",
  };

  const quoteText = dailyQuote
    ? (language === "ua" ? dailyQuote.text_ua : dailyQuote.text_en)
    : (language === "ua" ? settings.quote_ua : settings.quote_en);

  const quoteAuthor = dailyQuote
    ? (language === "ua" ? dailyQuote.author_ua : dailyQuote.author_en)
    : (language === "ua" ? settings.quote_author_ua : settings.quote_author_en);

  const quoteSource = dailyQuote
    ? (language === "ua" ? dailyQuote.source_ua : dailyQuote.source_en)
    : (language === "ua" ? settings.quote_source_ua : settings.quote_source_en);

  return (
    <section
      className="relative min-h-[60vh] sm:min-h-[70vh] flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.5)), url(${settings.background_image})`,
      }}
    >
      <div className="container mx-auto px-4 text-center text-white">
        <div className="mx-auto max-w-4xl">
          {/* Logo */}
          <div className="mb-6 flex flex-col items-center">
            <div className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64">
              <img
                src={settings.logo_image}
                alt="Прабгупада соловʼїною"
                className="h-full w-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Quote Box */}
          {quoteText && (
            <Card className="mx-auto max-w-2xl backdrop-blur-md bg-white/15 dark:bg-black/30 border-white/20">
              <CardContent className="p-4 sm:p-6">
                <blockquote className="text-center">
                  <p className="text-sm sm:text-base md:text-lg font-serif italic text-white/95 leading-relaxed">
                    "{quoteText}"
                  </p>
                  {(quoteAuthor || quoteSource) && (
                    <footer className="mt-3 text-xs sm:text-sm text-white/80">
                      {quoteAuthor && <cite className="not-italic font-medium">— {quoteAuthor}</cite>}
                      {quoteSource && <span className="ml-2 opacity-80">{quoteSource}</span>}
                    </footer>
                  )}
                </blockquote>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-white/70" />
      </div>
    </section>
  );
}

// --- Horizontal Navigation Menu ---
function NavigationMenu() {
  const { isAdmin } = useAuth();

  const menuItems = [
    { label: "Книги", href: "/library", icon: BookOpen },
    { label: "Бібліотека", href: "/audiobooks", icon: Book },
    { label: "Глосарій", href: "/glossary", icon: Book },
    { label: "Транслітерація", href: "/tools/transliteration", icon: Languages },
    { label: "Меджибіж", href: "/audiobooks?tag=medjibizh", icon: Headphones },
    { label: "Мороз", href: "/audiobooks?tag=moroz", icon: Headphones },
    { label: "Зачитані", href: "/audiobooks?sort=popular", icon: Headphones },
    { label: "Йога", href: "/audiobooks?tag=yoga", icon: GraduationCap },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Navigation Links */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
            <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-1.5">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Головна</span>
              </Link>
            </Button>

            {menuItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                asChild
                className="flex-shrink-0"
              >
                <Link to={item.href} className="flex items-center gap-1.5">
                  <item.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              </Button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <ThemeToggle />
            {isAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/dashboard" className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Адмін</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// --- Latest Content Section ---
function LatestContent() {
  const { playTrack } = useAudio();

  const handlePlayTrack = (item: ContentItem) => {
    if (item.type === "audio" && item.audioData) {
      playTrack(item.audioData);
    }
  };

  // Останні аудіотреки
  const { data: audioTracks } = useQuery({
    queryKey: ["latest-audio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_tracks")
        .select(`
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
              slug,
              name_ua
            )
          )
        `)
        .eq("audio_playlists.is_published", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data as any[];
    },
  });

  // Останні блог-пости
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
      category: track.audio_playlists?.audio_categories?.name_ua || "Аудіо",
      audioData: {
        id: track.id,
        title: track.title_ua,
        title_ua: track.title_ua,
        title_en: track.title_en,
        subtitle: track.audio_playlists?.title_ua,
        artist: "Шріла Прабгупада",
        src: track.audio_url || "",
        url: track.audio_url || "",
        duration: track.duration,
        coverImage: "/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png",
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
      category: "Читати",
    })) || []),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  if (latestContent.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl mb-6">Останні додані</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>Контент скоро з'явиться</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Останні додані</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/audiobooks" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              Усе аудіо
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/blog" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Усі тексти
            </Link>
          </Button>
        </div>
      </div>

      {/* Content Grid - 2 columns on desktop */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {latestContent.map((item) => (
          <Card key={item.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              {/* Category Badge */}
              <div className="mb-2 flex items-center justify-between">
                <Badge variant={item.type === "audio" ? "default" : "secondary"} className="text-xs">
                  {item.type === "audio" ? (
                    <><Headphones className="h-3 w-3 mr-1" /> Слухати</>
                  ) : (
                    <><BookOpen className="h-3 w-3 mr-1" /> Читати</>
                  )}
                </Badge>
                {item.duration && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.duration}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-1">
                {item.title}
              </h3>

              {/* Subtitle */}
              {item.subtitle && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {item.subtitle}
                </p>
              )}

              {/* Action Button */}
              <div className="flex justify-end mt-2">
                {item.type === "audio" ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePlayTrack(item)}
                    className="gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Слухати
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" asChild className="gap-1">
                    <Link to={item.href}>
                      <ArrowRight className="h-3 w-3" />
                      Читати
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// --- Library Section (Books) ---
function LibrarySection() {
  const { language } = useLanguage();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["featured-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, slug, title_ua, title_en, cover_image_url, is_published, display_order")
        .eq("is_published", true)
        .order("display_order", { ascending: true, nullsFirst: false })
        .limit(4);
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <h2 className="mb-6 font-serif text-2xl sm:text-3xl font-semibold">Бібліотека</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
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

  if (!books || books.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <h2 className="mb-6 font-serif text-2xl sm:text-3xl font-semibold">Бібліотека</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>Книги скоро з'являться</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold">Бібліотека</h2>
        <Button variant="link" size="sm" asChild className="text-muted-foreground">
          <Link to="/library" className="flex items-center gap-1">
            Усі книги
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {books.map((book) => (
          <Link
            key={book.id}
            to={`/veda-reader/${book.slug}`}
            className="group cursor-pointer"
          >
            {/* Book Cover */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300">
              {book.cover_image_url ? (
                <img
                  src={book.cover_image_url}
                  alt={language === "ua" ? book.title_ua : book.title_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <span className="text-4xl opacity-50">📖</span>
                </div>
              )}
            </div>

            {/* Book Title */}
            <h3 className="mt-2 text-xs sm:text-sm font-medium text-center line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {language === "ua" ? book.title_ua : book.title_en}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

// --- Quick Access Section ---
function QuickAccess() {
  const quickLinks = [
    { label: "Популярне", href: "/audiobooks?sort=popular" },
    { label: "Останні", href: "/audiobooks?sort=latest" },
    { label: "Бгаґаватам", href: "/audiobooks?tag=sb" },
    { label: "Бгаґавад-ґіта", href: "/audiobooks?tag=bg" },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <h3 className="mb-4 font-serif text-xl font-semibold">Швидкий доступ</h3>
      <div className="flex flex-wrap gap-2">
        {quickLinks.map((link) => (
          <Button key={link.href} variant="outline" size="sm" asChild>
            <Link to={link.href}>{link.label}</Link>
          </Button>
        ))}
      </div>
    </section>
  );
}

// --- Support Section ---
function SupportSection() {
  return (
    <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl sm:text-3xl font-bold">Підтримати проєкт</h2>
          <p className="mb-6 text-sm sm:text-base text-muted-foreground">
            Якщо ви хочете підтримати цей проект, ви можете зробити це фінансово або
            допомогти з редагуванням аудіозаписів чи перевіркою вже записаного матеріалу.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              size="lg"
              onClick={() => openExternal("https://paypal.me/andriiuvarov")}
              className="gap-2"
            >
              PayPal
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              onClick={() => openExternal("https://send.monobank.ua/jar/YAmYDYgti")}
              className="gap-2"
            >
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
      <Hero />
      <NavigationMenu />
      <main>
        <LatestContent />
        <LibrarySection />
        <QuickAccess />
        <SupportSection />
      </main>
      <Footer />
    </div>
  );
};
