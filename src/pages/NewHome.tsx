// src/pages/NewHome.tsx
// Оновлена домашня сторінка з Hero + "Продовжити прослуховування", Latest, Playlists, Support
// Інтегровано з GlobalAudioPlayer (useAudio) і динамічним Hero з БД (site_settings.home_hero)
// + DailyQuoteBanner для відображення щоденних цитат
// + ContinueReadingSection для відображення прогресу читання

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WebsiteSchema, OrganizationSchema } from "@/components/StructuredData";
import { Helmet } from "react-helmet-async";
import { SITE_CONFIG } from "@/lib/constants";
import { InlineBannerEditor } from "@/components/InlineBannerEditor";
import { Button } from "@/components/ui/button";
import { DailyQuoteBanner } from "@/components/DailyQuoteBanner";
import { ContinueReadingSection } from "@/components/ContinueReadingSection";
import { Headphones, BookOpen, Play, Pause, Clock, ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { HomeSearchBar } from "@/components/HomeSearchBar";
import { QuickActions } from "@/components/QuickActions";
import { openExternal } from "@/lib/openExternal";
import { useAudio } from "@/contexts/ModernAudioContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileLibraryList } from "@/components/mobile/MobileLibraryList";

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
    url: string;
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
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    currentTime,
    duration
  } = useAudio();
  const {
    language
  } = useLanguage();

  // Завантаження налаштувань з БД
  const {
    data: settingsData,
    refetch
  } = useQuery({
    queryKey: ["site-settings", "home_hero"],
    queryFn: async () => {
      const {
        data,
        error
      } = await (supabase as any).from("site_settings").select("value").eq("key", "home_hero").single();
      if (error) {
        console.error("Failed to load home hero settings:", error);
        return null; // Return null instead of throwing
      }
      return (data as any)?.value as {
        background_image: string;
        logo_image: string;
        subtitle_uk: string;
        subtitle_en: string;
      };
    }
  });

  // Дефолти поки не завантажилось
  const settings = settingsData || {
    background_image: "/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png",
    logo_image: "/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png",
    subtitle_uk: "Бібліотека ведичних аудіокниг",
    subtitle_en: "Library of Vedic audiobooks"
  };

  // Формат часу
  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  const subtitle = language === "uk" ? settings.subtitle_uk : settings.subtitle_en;
  const {
    isAdmin
  } = useAuth();
  const inlineSettings = {
    background_image: settings.background_image || "",
    logo_image: settings.logo_image || "",
    subtitle_uk: settings.subtitle_uk || "",
    subtitle_en: settings.subtitle_en || "",
    quote_uk: (settingsData as any)?.quote_uk || "",
    quote_en: (settingsData as any)?.quote_en || "",
    quote_author_uk: (settingsData as any)?.quote_author_uk || "",
    quote_author_en: (settingsData as any)?.quote_author_en || ""
  };
  return <section className="relative min-h-fit py-8 sm:py-12 md:min-h-[70vh] md:py-0 flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.6)), url(${settings.background_image})`
  }}>
      <div className="container mx-auto px-3 sm:px-4 text-center text-white">
        <div className="mx-auto max-w-4xl">
          {/* Logo - адаптивний (менший на мобільних) */}
          <div className="mb-3 sm:mb-4 md:mb-6 flex flex-col items-center">
            <div className="mb-2 sm:mb-3 md:mb-4 h-40 w-40 sm:h-56 sm:w-56 md:h-72 md:w-72 lg:h-80 lg:w-80">
              <img src={settings.logo_image} alt="Прабгупада соловʼїною" className="h-full w-full object-contain" />
            </div>
          </div>

          {isAdmin && <InlineBannerEditor settings={inlineSettings} onUpdate={() => refetch()} />}

          {/* Continue Listening - в стилі цитати */}
          {currentTrack && <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
              <div className="backdrop-blur-[10px] bg-white/10 dark:bg-white/5 rounded-2xl p-4 sm:p-5">
                  <div className="mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm" style={{ color: '#F1E1C7' }}>
                    <Headphones className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Продовжити прослуховування</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1 text-left">
                      <div className="mb-1 truncate text-sm sm:text-base font-semibold" style={{ color: '#F1E1C7' }}>
                        {currentTrack.title_uk || currentTrack.title}
                      </div>
                      <div className="truncate text-xs sm:text-sm" style={{ color: 'rgba(241, 225, 199, 0.7)' }}>
                        {currentTrack.artist || currentTrack.album || "Vedavoice"}
                      </div>
                      <div className="mt-1 sm:mt-2 flex items-center gap-2 text-xs" style={{ color: 'rgba(241, 225, 199, 0.6)' }}>
                        <Clock className="h-3 w-3" />
                        <span>{isPlaying ? `Відтворюється ${formatTime(currentTime)}` : `Пауза на ${formatTime(currentTime)}`}</span>
                      </div>
                    </div>

                    <Button size="sm" onClick={togglePlay} className="gap-1 sm:gap-2 flex-shrink-0 bg-white/20 hover:bg-white/30 text-white border-0">
                      {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
                      <span className="hidden xs:inline">{isPlaying ? "Пауза" : "Продовжити"}</span>
                    </Button>
                  </div>
              </div>
            </div>}
        </div>

        {/* Daily Quote Banner - moved above search */}
        <div className="mt-1.5 sm:mt-3.5 mx-auto max-w-5xl sm:max-w-6xl px-2 sm:px-4">
          <DailyQuoteBanner />
        </div>

        {/* Search Bar - moved below daily quote */}
        <div className="mt-4 sm:mt-6 mx-auto max-w-5xl sm:max-w-6xl px-2 sm:px-4">
          <HomeSearchBar className="mb-2 sm:mb-4" />
        </div>
      </div>

      {/* Scroll indicator - ховається на малих екранах */}
      <div className="hidden sm:block absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
        <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-white/70" />
      </div>
    </section>;
}

// --- Latest Content ---
function LatestContent() {
  const {
    playTrack
  } = useAudio();
  const handlePlayTrack = (item: ContentItem) => {
    if (item.type === "audio" && item.audioData) {
      playTrack(item.audioData);
    }
  };

  // Останні треки
  const {
    data: audioTracks,
    isError: audioError
  } = useQuery({
    queryKey: ["latest-audio"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("audio_tracks").select(`
          id,
          title_uk,
          title_en,
          audio_url,
          duration,
          created_at,
          playlist_id,
          audio_playlists!inner (
            id,
            title_uk,
            is_published,
            category_id,
            audio_categories (
              slug
            )
          )
        `).eq("audio_playlists.is_published", true).order("created_at", {
        ascending: false
      }).limit(3);
      if (error) {
        console.error("[LatestContent] Failed to fetch audio tracks:", error);
        throw error;
      }
      return data as any[];
    }
  });

  // Останні пости блогу
  const {
    data: blogPosts,
    isError: blogError
  } = useQuery({
    queryKey: ["latest-blog"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("blog_posts").select("id, title_uk, excerpt_uk, slug, created_at, read_time").eq("is_published", true).order("published_at", {
        ascending: false
      }).limit(3);
      if (error) {
        console.error("[LatestContent] Failed to fetch blog posts:", error);
        throw error;
      }
      return data as any[];
    }
  });
  const latestContent: ContentItem[] = [...(audioTracks?.map((track: any) => ({
    id: track.id,
    type: "audio" as const,
    title: track.title_uk,
    subtitle: track.audio_playlists?.title_uk,
    href: `/audiobooks/${track.playlist_id}`,
    duration: track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, "0")}` : undefined,
    created_at: track.created_at,
    audioData: {
      id: track.id,
      title: track.title_uk,
      title_uk: track.title_uk,
      title_en: track.title_en,
      subtitle: track.audio_playlists?.title_uk,
      artist: "Шріла Прабгупада",
      // За замовчанням автор
      src: track.audio_url || "",
      url: track.audio_url || "",
      duration: track.duration,
      coverImage: "/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png" // Логотип як обкладинка за замовчанням
    }
  })) || []), ...(blogPosts?.map((post: any) => ({
    id: post.id,
    type: "blog" as const,
    title: post.title_uk,
    subtitle: post.excerpt_uk || undefined,
    href: `/blog/${post.slug}`,
    duration: post.read_time ? `${post.read_time} хв` : undefined,
    created_at: post.created_at
  })) || [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6);

  // Empty state if no content or both queries failed
  if ((audioError && blogError) || latestContent.length === 0) {
    console.warn("[LatestContent] No content available or both queries failed");
    return <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl mb-6">Останні додані</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>Контент скоро з'явиться</p>
        </div>
      </section>;
  }

  return <section className="mx-auto w-full max-w-6xl px-4 py-10">
      {/* Responsive header - стек на мобільних */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Останні додані</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
            <a href="/audiobooks" className="flex items-center justify-center">
              <Headphones className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Усе аудіо</span>
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
            <a href="/library" className="flex items-center justify-center">
              <BookOpen className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Усі тексти</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Responsive grid - 1 колонка на мобільних */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {latestContent.map(item => <div key={item.id} className="py-3 hover:bg-muted/30 transition-colors">
              {/* Заголовок з іконкою */}
              <div className="mb-2 flex items-start gap-2">
                {item.type === "audio" ? <Headphones className="h-4 w-4 flex-shrink-0 mt-0.5" /> : <BookOpen className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                <span className="text-sm font-semibold line-clamp-2 sm:text-base">{item.title}</span>
              </div>

              {/* Субтайтл */}
              {item.subtitle && <div className="mb-3 line-clamp-2 text-xs text-muted-foreground sm:text-sm">{item.subtitle}</div>}

              {/* Кнопки і час */}
              <div className="flex items-center justify-between gap-2">
                {item.type === "audio" ? <Button variant="secondary" size="sm" onClick={() => handlePlayTrack(item)} className="flex-shrink-0">
                    <Play className="h-3 w-3 sm:mr-2" />
                    <span className="hidden sm:inline">Слухати</span>
                  </Button> : <Button variant="secondary" size="sm" asChild className="flex-shrink-0">
                    <a href={item.href}>
                      <ArrowRight className="h-3 w-3 sm:mr-2" />
                      <span className="hidden sm:inline">Читати</span>
                    </a>
                  </Button>}
                {item.duration && <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Clock className="h-3 w-3" />
                    {item.duration}
                  </div>}
              </div>
            </div>)}
      </div>
    </section>;
}

// --- Featured Books Section ---
function FeaturedBooks() {
  const {
    language,
    getLocalizedPath
  } = useLanguage();
  const {
    data: books = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["featured-books"],
    queryFn: async () => {
      console.log("[FeaturedBooks] Fetching books from database...");
      const {
        data,
        error
      } = await supabase.from("books").select("id, slug, title_uk, title_en, cover_image_url, is_published, display_order").eq("is_published", true).order("display_order", {
        ascending: true,
        nullsFirst: false
      }).limit(4);
      if (error) {
        console.error("[FeaturedBooks] Failed to fetch books:", error);
        throw error;
      }
      console.log("[FeaturedBooks] Successfully fetched books:", data);
      return data || [];
    }
  });

  // Loading state
  if (isLoading) {
    return <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <h2 className="mb-6 font-serif text-3xl font-semibold">Бібліотека</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="space-y-2">
              <div className="aspect-[2/3] w-full rounded-lg bg-muted animate-pulse" />
              <div className="h-4 w-3/4 mx-auto bg-muted animate-pulse rounded" />
            </div>)}
        </div>
      </section>;
  }

  // Error state
  if (isError) {
    console.error("[FeaturedBooks] Error loading books:", error);
    return <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <h2 className="mb-6 font-serif text-2xl font-semibold sm:text-3xl">Бібліотека</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>Не вдалося завантажити книги. Спробуйте оновити сторінку.</p>
          <Button variant="outline" className="mt-4" asChild>
            <a href="/library">Перейти до бібліотеки</a>
          </Button>
        </div>
      </section>;
  }

  // Empty state
  if (!books || books.length === 0) {
    console.warn("[FeaturedBooks] No published books found in database");
    return <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <h2 className="mb-6 font-serif text-2xl font-semibold sm:text-3xl">Бібліотека</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>Книги скоро з'являться</p>
          <Button variant="outline" className="mt-4" asChild>
            <a href="/library">Перейти до бібліотеки</a>
          </Button>
        </div>
      </section>;
  }
  return <section className="mx-auto w-full max-w-6xl px-4 py-10">
      {/* Responsive header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Бібліотека</h2>
        <Button variant="outline" size="sm" asChild>
          <a href="/library" className="flex items-center justify-center">
            <BookOpen className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Усі книги</span>
          </a>
        </Button>
      </div>

      {/* Responsive grid - 2 колонки на мобільних, 3 на планшетах, 4 на десктопах */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {books.map(book => <a key={book.id} href={getLocalizedPath(`/lib/${book.slug}`)} className="group cursor-pointer">
            {/* Book Cover */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300">
              {book.cover_image_url ? <img src={book.cover_image_url} alt={language === "uk" ? book.title_uk : book.title_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" /> : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <span className="text-3xl sm:text-5xl opacity-50">📖</span>
                </div>}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Book Title - адаптивний розмір */}
            <h3 className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center line-clamp-2 text-foreground group-hover:text-primary transition-colors px-1">
              {language === "uk" ? book.title_uk : book.title_en}
            </h3>
          </a>)}
      </div>
    </section>;
}

// --- Support Section ---
function SupportSection() {
  return <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 sm:mb-6 text-center text-2xl sm:text-3xl md:text-4xl font-bold">Підтримати проєкт</h2>
          <p className="mb-6 sm:mb-8 text-center text-sm sm:text-base md:text-lg text-muted-foreground px-2">
            Якщо ви хочете підтримати цей проект, ви можете зробити це фінансово або допомогти з редагуванням
            аудіозаписів чи перевіркою вже записаного матеріалу. Всі пожертви йдуть на розвиток проєкту.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button size="lg" onClick={() => openExternal("https://paypal.me/andriiuvarov")} className="gap-2 w-full sm:w-auto">
              PayPal
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button size="lg" onClick={() => openExternal("https://send.monobank.ua/jar/YAmYDYgti")} className="gap-2 w-full sm:w-auto">
              Monobank
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>;
}

// --- Main Page ---
export const NewHome = () => {
  const { language, t } = useLanguage();
  const isMobile = useIsMobile();

  // Fetch books with chapter counts for mobile home view
  const { data: mobileBooks = [], isLoading: mobileBooksLoading } = useQuery({
    queryKey: ['home-mobile-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('id, slug, title_uk, title_en, has_cantos')
        .eq('is_published', true)
        .order('display_order');
      if (error) throw error;

      // Fetch chapter/canto counts
      const booksWithCounts = await Promise.all(
        (data || []).map(async (book) => {
          if (book.has_cantos) {
            const { count } = await supabase
              .from('cantos')
              .select('*', { count: 'exact', head: true })
              .eq('book_id', book.id);
            return { ...book, chapter_count: count || 0 };
          } else {
            const { count } = await supabase
              .from('chapters')
              .select('*', { count: 'exact', head: true })
              .eq('book_id', book.id);
            return { ...book, chapter_count: count || 0 };
          }
        })
      );

      return booksWithCounts;
    },
    enabled: isMobile, // Only fetch when on mobile
  });

  const title = language === 'uk'
    ? "Прабгупада солов'їною — Ведичні писання українською"
    : "Vedavoice — Vedic scriptures in Ukrainian";
  const description = language === 'uk'
    ? "Бгаґавад-ґіта, Шрімад-Бгаґаватам та інші священні тексти ведичної традиції українською мовою з коментарями Шріли Прабгупади."
    : "Bhagavad-gita, Srimad-Bhagavatam and other sacred texts of the Vedic tradition in Ukrainian with Srila Prabhupada's commentaries.";
  const canonicalUrl = `${SITE_CONFIG.baseUrl}/${language}`;

  // Mobile: Show library list as home page
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>
        <WebsiteSchema />
        <OrganizationSchema language={language} />
        <MobileLibraryList books={mobileBooks} isLoading={mobileBooksLoading} />
      </div>
    );
  }

  // Desktop: Full home page
  return <div className="min-h-screen bg-background">
      {/* SEO Metadata */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="uk" href={`${SITE_CONFIG.baseUrl}/uk`} />
        <link rel="alternate" hrefLang="en" href={`${SITE_CONFIG.baseUrl}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE_CONFIG.baseUrl}/uk`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={SITE_CONFIG.socialImage} />
        <meta property="og:site_name" content={SITE_CONFIG.siteName} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={SITE_CONFIG.socialImage} />
      </Helmet>

      {/* Structured Data */}
      <WebsiteSchema />
      <OrganizationSchema language={language} />

      <Header />
      <main>
        <Hero />
        <QuickActions />
        <div className="container mx-auto px-4 py-8">
          <ContinueReadingSection className="mb-8" maxItems={3} />
        </div>
        <LatestContent />
        <FeaturedBooks />
        <SupportSection />
      </main>
      <Footer />
    </div>;
};