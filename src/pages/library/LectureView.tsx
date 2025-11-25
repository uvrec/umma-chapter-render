/**
 * Сторінка перегляду окремої лекції
 * /library/lectures/:slug
 *
 * Функціонал:
 * - Відображення тексту лекції по параграфах
 * - Аудіо програвач з синхронізацією параграфів
 * - Підсвітка санскритських термінів з глосарієм
 * - Мовний переключач (UA/EN)
 * - Навігація до попередньої/наступної лекції
 */

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import type { Lecture, LectureParagraph } from "@/types/lecture";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  BookOpen,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
} from "lucide-react";

export const LectureView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"ua" | "en">("ua");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const paragraphRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Завантаження лекції
  const { data: lecture, isLoading: lectureLoading } = useQuery({
    queryKey: ["lecture", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Lecture;
    },
    enabled: !!slug,
  });

  // Завантаження параграфів
  const { data: paragraphs = [], isLoading: paragraphsLoading } = useQuery({
    queryKey: ["lecture-paragraphs", lecture?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lecture_paragraphs")
        .select("*")
        .eq("lecture_id", lecture!.id)
        .order("paragraph_number");

      if (error) throw error;
      return data as LectureParagraph[];
    },
    enabled: !!lecture?.id,
  });

  // Керування аудіо
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Синхронізація параграфів з аудіо
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateCurrentParagraph = () => {
      const currentTime = audio.currentTime;

      // Знайти поточний параграф на основі timecode
      const current = paragraphs.find((p, idx) => {
        const next = paragraphs[idx + 1];
        return (
          p.audio_timecode !== null &&
          currentTime >= p.audio_timecode &&
          (!next || !next.audio_timecode || currentTime < next.audio_timecode)
        );
      });

      if (current) {
        setCurrentParagraph(current.paragraph_number);

        // Прокрутити до поточного параграфа
        const ref = paragraphRefs.current[current.paragraph_number];
        if (ref) {
          ref.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    };

    audio.addEventListener("timeupdate", updateCurrentParagraph);
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateCurrentParagraph);
      audio.removeEventListener("play", () => setIsPlaying(true));
      audio.removeEventListener("pause", () => setIsPlaying(false));
    };
  }, [paragraphs]);

  // Підсвітка санскритських термінів
  const highlightSanskritTerms = (text: string): JSX.Element => {
    // Знайти слова з діакритичними знаками або в курсиві
    const diacriticPattern = /(\b\w*[āīūṛṝḷḹēōṃḥṇṭḍśṣ]\w*\b)/gi;

    const parts = text.split(diacriticPattern);

    return (
      <>
        {parts.map((part, idx) => {
          if (part.match(diacriticPattern)) {
            return (
              <span
                key={idx}
                className="italic text-primary cursor-help underline decoration-dotted"
                title={`Санскритський термін: ${part}`}
              >
                {part}
              </span>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return language === "ua"
      ? date.toLocaleDateString("uk-UA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  if (lectureLoading || paragraphsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Завантаження...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Лекцію не знайдено</h1>
            <Button onClick={() => navigate("/library/lectures")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад до бібліотеки
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = language === "ua" && lecture.title_ua ? lecture.title_ua : lecture.title_en;
  const location =
    language === "ua" && lecture.location_ua ? lecture.location_ua : lecture.location_en;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Навігація назад */}
        <Button
          variant="ghost"
          onClick={() => navigate("/library/lectures")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === "ua" ? "Назад до бібліотеки" : "Back to library"}
        </Button>

        {/* Заголовок лекції */}
        <Card className="p-8 mb-8">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">
              {lecture.lecture_type}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-foreground">{title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {formatDate(lecture.lecture_date)}
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              {location}
            </div>
            {lecture.book_slug && (
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                {lecture.book_slug.toUpperCase()}
                {lecture.chapter_number && ` ${lecture.chapter_number}`}
                {lecture.verse_number && `.${lecture.verse_number}`}
              </div>
            )}
          </div>

          {/* Мовний переключач */}
          <div className="mt-6">
            <Tabs value={language} onValueChange={(v) => setLanguage(v as "ua" | "en")}>
              <TabsList>
                <TabsTrigger value="ua">Українська</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Аудіо плеєр */}
          {lecture.audio_url && (
            <div className="mt-6">
              <Card className="p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={togglePlayPause}
                      className="w-12 h-12 rounded-full"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </Button>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Volume2 className="w-4 h-4 mr-2" />
                      {language === "ua" ? "Аудіо лекція" : "Audio lecture"}
                    </div>
                  </div>
                </div>
                <audio ref={audioRef} src={lecture.audio_url} preload="metadata" />
              </Card>
            </div>
          )}
        </Card>

        {/* Текст лекції */}
        <Card className="p-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {paragraphs.map((paragraph) => {
              const content =
                language === "ua" && paragraph.content_ua
                  ? paragraph.content_ua
                  : paragraph.content_en;

              const isCurrentParagraph =
                currentParagraph === paragraph.paragraph_number;

              return (
                <div
                  key={paragraph.id}
                  ref={(el) =>
                    (paragraphRefs.current[paragraph.paragraph_number] = el)
                  }
                  className={`mb-6 p-4 rounded-lg transition-all ${
                    isCurrentParagraph
                      ? "bg-primary/10 border-l-4 border-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <p className="leading-relaxed text-foreground">
                    {highlightSanskritTerms(content)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Якщо немає параграфів */}
          {paragraphs.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              {language === "ua"
                ? "Текст лекції ще не додано"
                : "Lecture text not yet added"}
            </div>
          )}
        </Card>

        {/* Навігація між лекціями */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" disabled>
            <ChevronLeft className="w-4 h-4 mr-2" />
            {language === "ua" ? "Попередня" : "Previous"}
          </Button>
          <Button variant="outline" disabled>
            {language === "ua" ? "Наступна" : "Next"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};
