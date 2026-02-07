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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EnhancedInlineEditor } from "@/components/EnhancedInlineEditor";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
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
  Edit,
  Save,
  X,
} from "lucide-react";
import { AudioUploader } from "@/components/admin/shared/AudioUploader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { useSectionMemento } from "@/hooks/useSectionMemento";
import { ContentToolbar } from "@/components/ContentToolbar";
import { useAudio } from "@/contexts/ModernAudioContext";
import { sanitizeForRender } from "@/utils/import/normalizers";

export const LectureView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const { language, getLocalizedPath } = useLanguage();
  const { dualLanguageMode } = useReaderSettings();
  useSectionMemento(); // Preserve scroll position when navigating away and back
  const [currentParagraph, setCurrentParagraph] = useState<number | null>(null);
  const paragraphRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Global audio context for the player
  const { playTrack, currentTrack, isPlaying, togglePlay, currentTime } = useAudio();

  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedLecture, setEditedLecture] = useState<{
    title_uk: string;
    title_en: string;
    location_uk: string;
    location_en: string;
    audio_url: string;
    content_uk: string;
    content_en: string;
  } | null>(null);

  // Завантаження лекції
  const { data: lecture, isLoading: lectureLoading } = useQuery({
    queryKey: ["lecture", slug],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
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
      const { data, error } = await (supabase as any)
        .from("lecture_paragraphs")
        .select("*")
        .eq("lecture_id", lecture!.id)
        .order("paragraph_number");

      if (error) throw error;
      return data as LectureParagraph[];
    },
    enabled: !!lecture?.id,
  });

  // Check if this lecture's audio is currently playing
  const lectureTrackId = lecture?.id ? `lecture-${lecture.id}` : null;
  const isThisLecturePlaying = useMemo(() => {
    return currentTrack?.id === lectureTrackId && isPlaying;
  }, [currentTrack?.id, lectureTrackId, isPlaying]);

  // Play or pause the lecture audio using global player
  const togglePlayPause = () => {
    if (!lecture?.audio_url) return;

    // If this lecture is already loaded, just toggle play/pause
    if (currentTrack?.id === lectureTrackId) {
      togglePlay();
      return;
    }

    // Play this lecture in the global player
    const lectureTitle = language === "uk" && lecture.title_uk ? lecture.title_uk : lecture.title_en;
    const lectureLocation = language === "uk" && lecture.location_uk ? lecture.location_uk : lecture.location_en;

    playTrack({
      id: lectureTrackId!,
      title: lectureTitle,
      subtitle: lectureLocation,
      src: lecture.audio_url,
      artist: "Шріла Прабгупада",
    });
  };

  // Синхронізація параграфів з аудіо (using global audio context)
  useEffect(() => {
    // Only sync if this lecture is currently playing
    if (!isThisLecturePlaying || paragraphs.length === 0) return;

    // Знайти поточний параграф на основі timecode
    const current = paragraphs.find((p, idx) => {
      const next = paragraphs[idx + 1];
      return (
        p.audio_timecode !== null &&
        currentTime >= p.audio_timecode &&
        (!next || !next.audio_timecode || currentTime < next.audio_timecode)
      );
    });

    if (current && current.paragraph_number !== currentParagraph) {
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
  }, [currentTime, paragraphs, isThisLecturePlaying, currentParagraph]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return language === "uk"
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

  // Helper function to parse HTML into paragraphs
  // Uses outerHTML to preserve paragraph-level formatting (text-align, class, etc.)
  const parseHtmlParagraphs = (html: string): string[] => {
    if (!html.trim() || html === "<p></p>") {
      return [];
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const pElements = tempDiv.querySelectorAll("p");
    const result: string[] = [];

    if (pElements.length > 0) {
      pElements.forEach((p) => {
        const content = p.innerHTML.trim();
        if (content && content !== "<br>" && content !== "<br/>") {
          // Save outerHTML to preserve <p> attributes (style="text-align: center", class, etc.)
          result.push(p.outerHTML);
        }
      });
    } else {
      const parts = html
        .split(/<br\s*\/?>\s*<br\s*\/?>/gi)
        .map((p) => p.trim())
        .filter((p) => p.length > 0 && p !== "<br>" && p !== "<br/>");

      if (parts.length > 0) {
        result.push(...parts);
      } else {
        const cleanText = tempDiv.innerHTML.trim();
        if (cleanText) {
          result.push(cleanText);
        }
      }
    }

    return result;
  };

  // Helper function to merge paragraphs into single HTML
  // Handles both old format (plain innerHTML) and new format (full <p> outerHTML with attributes)
  const mergeParagraphsToHtml = (paras: LectureParagraph[], lang: "uk" | "en"): string => {
    return paras
      .map((p) => {
        const content = lang === "uk" ? p.content_uk : p.content_en;
        if (!content) return "<p></p>";
        const trimmed = content.trim();
        // If content already has a block-level wrapper (<p>, <h1-h6>, <div>), use as-is
        if (/^<(p|h[1-6]|div)[\s>]/i.test(trimmed)) return trimmed;
        // Otherwise wrap in <p> for backward compatibility with old data
        return `<p>${content}</p>`;
      })
      .join("\n");
  };

  // Mutation for saving lecture changes
  const saveLectureMutation = useMutation({
    mutationFn: async () => {
      if (!lecture || !editedLecture) return;

      // Update lecture metadata
      const lectureUpdates: Partial<Lecture> = {};
      if (editedLecture.title_uk !== lecture.title_uk) lectureUpdates.title_uk = editedLecture.title_uk;
      if (editedLecture.title_en !== lecture.title_en) lectureUpdates.title_en = editedLecture.title_en;
      if (editedLecture.location_uk !== lecture.location_uk) lectureUpdates.location_uk = editedLecture.location_uk;
      if (editedLecture.location_en !== lecture.location_en) lectureUpdates.location_en = editedLecture.location_en;
      if (editedLecture.audio_url !== (lecture.audio_url || "")) lectureUpdates.audio_url = editedLecture.audio_url || null;

      if (Object.keys(lectureUpdates).length > 0) {
        const { error } = await (supabase as any)
          .from("lectures")
          .update(lectureUpdates)
          .eq("id", lecture.id);
        if (error) throw error;
      }

      // Parse edited content into paragraphs
      const ukParagraphs = parseHtmlParagraphs(editedLecture.content_uk);
      const enParagraphs = parseHtmlParagraphs(editedLecture.content_en);

      // Update existing paragraphs
      const sortedParagraphs = [...paragraphs].sort((a, b) => a.paragraph_number - b.paragraph_number);

      for (let i = 0; i < sortedParagraphs.length; i++) {
        const paragraph = sortedParagraphs[i];
        const newUk = ukParagraphs[i] || "";
        const newEn = enParagraphs[i] || paragraph.content_en;

        const updates: Partial<LectureParagraph> = {};
        if (newUk !== paragraph.content_uk) updates.content_uk = newUk;
        if (newEn !== paragraph.content_en) updates.content_en = newEn;

        if (Object.keys(updates).length > 0) {
          const { error } = await (supabase as any)
            .from("lecture_paragraphs")
            .update(updates)
            .eq("id", paragraph.id);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lecture", slug] });
      queryClient.invalidateQueries({ queryKey: ["lecture-paragraphs", lecture?.id] });
      setIsEditing(false);
      toast.success("Зміни збережено");
    },
    onError: (error) => {
      console.error("Save error:", error);
      toast.error("Помилка збереження");
    },
  });

  const startEdit = () => {
    if (!lecture) return;
    setEditedLecture({
      title_uk: lecture.title_uk || "",
      title_en: lecture.title_en,
      location_uk: lecture.location_uk || "",
      location_en: lecture.location_en,
      audio_url: lecture.audio_url || "",
      content_uk: mergeParagraphsToHtml(paragraphs, "uk"),
      content_en: mergeParagraphsToHtml(paragraphs, "en"),
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedLecture(null);
  };

  const saveEdit = () => {
    saveLectureMutation.mutate();
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
            <Button onClick={() => navigate(getLocalizedPath("/library/lectures"))}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === "uk" ? "Назад до бібліотеки" : "Back to library"}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = language === "uk" && lecture.title_uk ? lecture.title_uk : lecture.title_en;
  const location =
    language === "uk" && lecture.location_uk ? lecture.location_uk : lecture.location_en;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={`container mx-auto px-4 py-8 ${dualLanguageMode ? "max-w-7xl" : "max-w-5xl"}`}>
        {/* Навігація назад + Toolbar + Edit button */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate(getLocalizedPath("/library/lectures"))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "uk" ? "Назад до бібліотеки" : "Back to library"}
          </Button>

          <div className="flex items-center gap-2">
            {/* Content Toolbar */}
            <ContentToolbar
              title={title}
              contentType="lecture"
            />

            {/* Admin Edit Controls */}
            {isAdmin && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={saveEdit}
                      disabled={saveLectureMutation.isPending}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {saveLectureMutation.isPending ? "Збереження..." : "Зберегти"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                      <X className="mr-2 h-4 w-4" />
                      Скасувати
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" size="sm" onClick={startEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Редагувати
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Заголовок лекції */}
        <div className="mb-8">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">
              {lecture.lecture_type}
            </Badge>
          </div>

          {isEditing && editedLecture ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Заголовок UA</label>
                <Input
                  value={editedLecture.title_uk}
                  onChange={(e) => setEditedLecture({ ...editedLecture, title_uk: e.target.value })}
                  className="text-xl font-bold"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Title EN</label>
                <Input
                  value={editedLecture.title_en}
                  onChange={(e) => setEditedLecture({ ...editedLecture, title_en: e.target.value })}
                  className="text-xl font-bold"
                />
              </div>
            </div>
          ) : (
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-center font-serif text-primary mb-4">{title}</h1>
          )}

          <div className="flex flex-wrap justify-center gap-4 text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {formatDate(lecture.lecture_date)}
            </div>
            {isEditing && editedLecture ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <Input
                    value={editedLecture.location_uk}
                    onChange={(e) => setEditedLecture({ ...editedLecture, location_uk: e.target.value })}
                    placeholder="Локація UA"
                    className="w-40"
                  />
                </div>
                <Input
                  value={editedLecture.location_en}
                  onChange={(e) => setEditedLecture({ ...editedLecture, location_en: e.target.value })}
                  placeholder="Location EN"
                  className="w-40"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {location}
              </div>
            )}
            {lecture.book_slug && (
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                {lecture.book_slug.toUpperCase()}
                {lecture.chapter_number && ` ${lecture.chapter_number}`}
                {lecture.verse_number && `.${lecture.verse_number}`}
              </div>
            )}
          </div>


          {/* Аудіо плеєр / Завантаження аудіо */}
          {isEditing && editedLecture ? (
            <div className="mt-6">
              <AudioUploader
                label="Аудіо лекції"
                value={editedLecture.audio_url}
                onChange={(url) => setEditedLecture({ ...editedLecture, audio_url: url })}
                bucket="verse-audio"
                primary
              />
            </div>
          ) : lecture.audio_url ? (
            <div className="mt-6">
              <div className="flex items-center space-x-4">
                <Button
                  size="lg"
                  variant={isThisLecturePlaying ? "default" : "outline"}
                  onClick={togglePlayPause}
                  className="w-12 h-12 rounded-full"
                >
                  {isThisLecturePlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Volume2 className="w-4 h-4 mr-2" />
                  {language === "uk" ? "Аудіо лекція" : "Audio lecture"}
                  {isThisLecturePlaying && (
                    <span className="ml-2 text-primary animate-pulse">
                      {language === "uk" ? "● Відтворюється" : "● Playing"}
                    </span>
                  )}
                </div>
              </div>
              {/* Audio is now played through the global ModernGlobalPlayer */}
            </div>
          ) : null}
        </div>

        {/* Текст лекції */}
        <div>
          {isEditing && editedLecture ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-muted/20">
                <label className="text-sm text-muted-foreground mb-2 block">Текст UA</label>
                <EnhancedInlineEditor
                  content={editedLecture.content_uk}
                  onChange={(html) => setEditedLecture({ ...editedLecture, content_uk: html })}
                  minHeight="400px"
                />
              </div>
              <div className="border rounded-lg p-4 bg-muted/20">
                <label className="text-sm text-muted-foreground mb-2 block">Content EN</label>
                <EnhancedInlineEditor
                  content={editedLecture.content_en}
                  onChange={(html) => setEditedLecture({ ...editedLecture, content_en: html })}
                  minHeight="400px"
                />
              </div>
            </div>
          ) : dualLanguageMode ? (
            // DUAL MODE - Side by side (no labels - functional minimalism)
            <div className="grid md:grid-cols-2 gap-8">
              {/* Ukrainian Column */}
              <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
                {paragraphs.map((paragraph) => {
                  const isCurrentParagraph = currentParagraph === paragraph.paragraph_number;
                  const hasContent = paragraph.content_uk && paragraph.content_uk.trim().length > 0;

                  return hasContent ? (
                    <div
                      key={`uk-${paragraph.id}`}
                      ref={(el) => (paragraphRefs.current[paragraph.paragraph_number] = el)}
                      className={`mb-4 leading-relaxed transition-colors ${
                        isCurrentParagraph ? "bg-primary/10 -mx-2 px-2 py-1" : ""
                      }`}
                      dangerouslySetInnerHTML={{ __html: sanitizeForRender(paragraph.content_uk!) }}
                    />
                  ) : (
                    <div
                      key={`uk-${paragraph.id}`}
                      ref={(el) => (paragraphRefs.current[paragraph.paragraph_number] = el)}
                      className={`mb-4 leading-relaxed transition-colors ${
                        isCurrentParagraph ? "bg-primary/10 -mx-2 px-2 py-1" : ""
                      }`}
                    >
                      <span className="text-muted-foreground/50">—</span>
                    </div>
                  );
                })}
              </div>

              {/* English Column */}
              <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
                {paragraphs.map((paragraph) => {
                  const isCurrentParagraph = currentParagraph === paragraph.paragraph_number;

                  return (
                    <div
                      key={`en-${paragraph.id}`}
                      className={`mb-4 leading-relaxed transition-colors ${
                        isCurrentParagraph ? "bg-primary/10 -mx-2 px-2 py-1" : ""
                      }`}
                      dangerouslySetInnerHTML={{ __html: sanitizeForRender(paragraph.content_en) }}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            // SINGLE LANGUAGE MODE
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
              {paragraphs.map((paragraph) => {
                const content =
                  language === "uk" && paragraph.content_uk
                    ? paragraph.content_uk
                    : paragraph.content_en;

                const isCurrentParagraph =
                  currentParagraph === paragraph.paragraph_number;

                return (
                  <div
                    key={paragraph.id}
                    ref={(el) =>
                      (paragraphRefs.current[paragraph.paragraph_number] = el)
                    }
                    className={`mb-4 leading-relaxed transition-colors ${
                      isCurrentParagraph
                        ? "bg-primary/10 -mx-2 px-2 py-1"
                        : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: sanitizeForRender(content) }}
                  />
                );
              })}
            </div>
          )}

          {/* Якщо немає параграфів */}
          {paragraphs.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              {language === "uk"
                ? "Текст лекції ще не додано"
                : "Lecture text not yet added"}
            </div>
          )}
        </div>

        {/* Навігація між лекціями */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" disabled>
            <ChevronLeft className="w-4 h-4 mr-2" />
            {language === "uk" ? "Попередня" : "Previous"}
          </Button>
          <Button variant="outline" disabled>
            {language === "uk" ? "Наступна" : "Next"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};
