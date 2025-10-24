// src/pages/NewHome.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/components/GlobalAudioPlayer";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Headphones, BookOpen, Play, Pause, Clock, ArrowRight, Search, ExternalLink } from "lucide-react";
import { openExternal } from "@/lib/openExternal";

type ContentItem = {
  id: string;
  type: "audio" | "text" | "blog";
  title: string;
  subtitle?: string;
  href: string;
  duration?: string;
  created_at: string;
};

function Hero() {
  const { currentTrack, isPlaying, togglePlay, currentTime, duration } = useAudio();
  const { language } = useLanguage();

  const { data: settingsData } = useQuery({
    queryKey: ["site-settings", "home_hero"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", "home_hero").single();
      if (error) throw error;
      return data?.value as {
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
      className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('${settings.background_image}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4">
        <div className="flex flex-col items-center text-center">
          <img src={settings.logo_image} alt="Vedavoice Logo" className="mb-6 h-32 w-auto drop-shadow-2xl md:h-40" />
          <p className="mb-10 text-2xl font-light tracking-wide text-white/90 drop-shadow-lg md:text-3xl">{subtitle}</p>

          {currentTrack && (
            <Card className="w-full max-w-md overflow-hidden border-primary/20 bg-card/80 backdrop-blur-md">
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                      {language === "ua" ? "Продовжити" : "Continue"}
                    </div>
                    <div className="truncate font-semibold">{currentTrack.title}</div>
                    {currentTrack.verseNumber && (
                      <div className="text-sm text-muted-foreground">Вірш {currentTrack.verseNumber}</div>
                    )}
                  </div>
                  <Button size="icon" onClick={togglePlay} className="ml-2 h-12 w-12 flex-shrink-0">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <blockquote className="mt-12 max-w-2xl">
            <p className="mb-3 text-lg italic text-white/80 drop-shadow-md md:text-xl">{quote}</p>
            <cite className="text-sm font-medium text-white/70 drop-shadow-sm">— {author}</cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function SearchStrip() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/verses?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <section className="border-b bg-muted/30 py-6">
      <div className="container mx-auto px-4">
        <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl gap-2">
          <Input
            type="search"
            placeholder="Шукати вірш, слово, тему..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  );
}

function LatestContent() {
  const { playTrack } = useAudio();
  const { data: items, isLoading } = useQuery({
    queryKey: ["latest-content"],
    queryFn: async () => {
      const [audioRes, blogRes] = await Promise.all([
        supabase
          .from("audio_playlists")
          .select("id, title_ua, description_ua, cover_image_url, created_at, is_published")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(4),
        supabase
          .from("blog_posts")
          .select("id, title_ua, excerpt_ua, slug, created_at, is_published")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(2),
      ]);

      const audio: ContentItem[] = (audioRes.data || []).map((a: any) => ({
        id: a.id,
        type: "audio" as const,
        title: a.title_ua || "Без назви",
        subtitle: a.description_ua,
        href: `/audiobooks/${a.id}`,
        created_at: a.created_at,
      }));

      const blog: ContentItem[] = (blogRes.data || []).map((b: any) => ({
        id: b.id,
        type: "blog" as const,
        title: b.title_ua || "Без назви",
        subtitle: b.excerpt_ua,
        href: `/blog/${b.slug}`,
        created_at: b.created_at,
      }));

      return [...audio, ...blog].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
  });

  const handlePlayAudio = async (item: ContentItem) => {
    const { data: tracks } = await supabase
      .from("audio_tracks")
      .select("id, title_ua, file_url")
      .eq("playlist_id", item.id)
      .order("track_number", { ascending: true })
      .limit(1);

    if (tracks && tracks[0]) {
      playTrack({
        id: tracks[0].id,
        title: tracks[0].title_ua || item.title,
        src: tracks[0].file_url,
      });
    }
  };

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <h3 className="mb-6 font-serif text-2xl font-semibold">Останнє</h3>
        <p className="text-muted-foreground">Немає доступного контенту</p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <h3 className="mb-6 font-serif text-2xl font-semibold">Останнє</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
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
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePlayAudio(item);
                    }}
                  >
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

export const NewHome = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <SearchStrip />
        <LatestContent />
        <Playlists />
        <SupportSection />
      </main>
      <Footer />
    </div>
  );
};
