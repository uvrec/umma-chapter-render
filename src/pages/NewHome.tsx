// NewHome.tsx — оновлена версія з GlobalAudioPlayer
// Відповідає PDF шаблону 2: Hero, Continue Listening, SearchStrip, Latest, Playlists

import React from "react";
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
  Clock,
  ArrowRight,
  Search,
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
                alt="Прабгупада соловйїною"
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
            <p className="text-sm text-white/70">— Шріла Прабгупада</p>
          </div>

          {/* Continue Listening Card - показується якщо є поточний трек */}
          {currentTrack && (
            <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Продовжити прослуховування</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="rounded-full bg-white/20 hover:bg-white/30 text-white"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                </div>
                <div className="text-left">
                  <p className="text-white font-medium mb-1 truncate">{currentTrack.title}</p>
                  <p className="text-white/70 text-sm mb-2">
                    {currentTrack.verseNumber || currentTrack.metadata?.artist || "Vedavoice"}
                  </p>
                  <div className="flex items-center gap-2 text-white/60 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}

// --- Search Strip ---
function SearchStrip() {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/library?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="bg-muted/50 py-8">
      <div className="container mx-auto px-4">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Пошук книг, лекцій, віршів..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </form>
      </div>
    </section>
  );
}

// --- Latest Content ---
function LatestContent() {
  const { data: items, isLoading } = useQuery({
    queryKey: ["latest-content"],
    queryFn: async () => {
      // Аудіо
      const { data: audio } = await supabase
        .from("audio_tracks")
        .select("id, title_ua, file_url, track_number, duration")
        .order("created_at", { ascending: false })
        .limit(3);

      // Блог пости
      const { data: blogs } = await supabase
        .from("blog_posts")
        .select("id, title_ua, excerpt_ua, slug")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(2);

      const result: ContentItem[] = [];

      audio?.forEach((a) => {
        result.push({
          id: a.id,
          type: "audio",
          title: a.title_ua || "Без назви",
          subtitle: `Трек ${a.track_number}`,
          href: `/audiobooks/${a.id}`,
          duration: a.duration ? `${Math.floor(a.duration / 60)}:${(a.duration % 60).toString().padStart(2, "0")}` : undefined,
          created_at: "",
        });
      });

      blogs?.forEach((b) => {
        result.push({
          id: b.id,
          type: "blog",
          title: b.title_ua,
          subtitle: b.excerpt_ua || undefined,
          href: `/blog/${b.slug}`,
          created_at: "",
        });
      });

      return result;
    },
    staleTime: 60_000,
  });

  if (isLoading) return null;
  if (!items || items.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <h2 className="mb-6 font-serif text-2xl font-semibold">Останні публікації</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
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

// --- Quick Access Playlists ---
function Playlists() {
  const featuredPlaylists = [
    { title: "Популярне", href: "/audiobooks?sort=popular" },
    { title: "Останні", href: "/audiobooks?sort=latest" },
    { title: "Бгаґавата", href: "/audiobooks?tag=sb" },
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
// ВАЖЛИВО: MiniPlayer компонент видалено!
// Тепер GlobalAudioPlayer (з App.tsx) показується завжди внизу екрану
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
      {/* MiniPlayer ВИДАЛЕНО - тепер використовується GlobalAudioPlayer з App.tsx */}
    </div>
  );
};
