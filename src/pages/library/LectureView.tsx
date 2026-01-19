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
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { EnhancedInlineEditor } from "@/components/EnhancedInlineEditor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
  Languages,
  Sparkles,
  Loader2,
  ClipboardPaste,
} from "lucide-react";
import { transliterateIAST } from "@/utils/text/transliteration";
import { useLanguage } from "@/contexts/LanguageContext";

export const LectureView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const { language, getLocalizedPath } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const paragraphRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedLecture, setEditedLecture] = useState<{
    title_ua: string;
    title_en: string;
    location_ua: string;
    location_en: string;
  } | null>(null);
  const [editedParagraphs, setEditedParagraphs] = useState<{
    [id: string]: { content_ua: string; content_en: string };
  }>({});

  // Translation state
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatingParagraphId, setTranslatingParagraphId] = useState<string | null>(null);

  // Bulk translation paste state
  const [showBulkTranslationDialog, setShowBulkTranslationDialog] = useState(false);
  const [bulkTranslationText, setBulkTranslationText] = useState("");
  const [detectedParagraphsCount, setDetectedParagraphsCount] = useState(0);

  // Scroll sync state for bilingual editors
  const [scrollSyncState, setScrollSyncState] = useState<{
    [paragraphId: string]: { ratio: number; source: "uk" | "en"; counter: number };
  }>({});

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

  // Форматування тексту (санскритські терміни просто курсивом, без підкреслень)
  const formatText = (text: string): JSX.Element => {
    // Слова з діакритичними знаками - тільки курсив
    const diacriticPattern = /(\b\w*[āīūṛṝḷḹēōṃḥṇṭḍśṣ]\w*\b)/gi;
    const parts = text.split(diacriticPattern);

    return (
      <>
        {parts.map((part, idx) => {
          if (part.match(diacriticPattern)) {
            return (
              <em key={idx} className="not-italic font-medium">
                {part}
              </em>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </>
    );
  };

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

  // Mutation for saving lecture changes
  const saveLectureMutation = useMutation({
    mutationFn: async () => {
      if (!lecture || !editedLecture) return;

      // Update lecture metadata
      const lectureUpdates: Partial<Lecture> = {};
      if (editedLecture.title_ua !== lecture.title_ua) lectureUpdates.title_ua = editedLecture.title_ua;
      if (editedLecture.title_en !== lecture.title_en) lectureUpdates.title_en = editedLecture.title_en;
      if (editedLecture.location_ua !== lecture.location_ua) lectureUpdates.location_ua = editedLecture.location_ua;
      if (editedLecture.location_en !== lecture.location_en) lectureUpdates.location_en = editedLecture.location_en;

      if (Object.keys(lectureUpdates).length > 0) {
        const { error } = await (supabase as any)
          .from("lectures")
          .update(lectureUpdates)
          .eq("id", lecture.id);
        if (error) throw error;
      }

      // Update paragraphs
      for (const [paragraphId, content] of Object.entries(editedParagraphs)) {
        const originalParagraph = paragraphs.find((p) => p.id === paragraphId);
        if (!originalParagraph) continue;

        const updates: Partial<LectureParagraph> = {};
        if (content.content_ua !== originalParagraph.content_ua) updates.content_ua = content.content_ua;
        if (content.content_en !== originalParagraph.content_en) updates.content_en = content.content_en;

        if (Object.keys(updates).length > 0) {
          const { error } = await (supabase as any)
            .from("lecture_paragraphs")
            .update(updates)
            .eq("id", paragraphId);
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
      title_ua: lecture.title_ua || "",
      title_en: lecture.title_en,
      location_ua: lecture.location_ua || "",
      location_en: lecture.location_en,
    });
    const paragraphEdits: { [id: string]: { content_ua: string; content_en: string } } = {};
    paragraphs.forEach((p) => {
      paragraphEdits[p.id] = {
        content_ua: p.content_ua || "",
        content_en: p.content_en,
      };
    });
    setEditedParagraphs(paragraphEdits);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedLecture(null);
    setEditedParagraphs({});
  };

  const saveEdit = () => {
    saveLectureMutation.mutate();
  };

  // Транслітерація параграфа
  const transliterateParagraph = (paragraphId: string) => {
    const content = editedParagraphs[paragraphId];
    if (!content?.content_en) return;

    const transliterated = transliterateIAST(content.content_en);
    setEditedParagraphs((prev) => ({
      ...prev,
      [paragraphId]: { ...prev[paragraphId], content_ua: transliterated },
    }));
    toast.success("Транслітерацію застосовано");
  };

  // Транслітерація всіх параграфів
  const transliterateAll = () => {
    setEditedParagraphs((prev) => {
      const updated = { ...prev };
      for (const [id, content] of Object.entries(updated)) {
        if (content.content_en) {
          updated[id] = {
            ...content,
            content_ua: transliterateIAST(content.content_en),
          };
        }
      }
      return updated;
    });
    toast.success("Транслітерацію застосовано до всіх параграфів");
  };

  // AI переклад параграфа
  const translateParagraphWithAI = async (paragraphId: string) => {
    const content = editedParagraphs[paragraphId];
    if (!content?.content_en) return;

    setTranslatingParagraphId(paragraphId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Необхідно увійти в систему");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-claude`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            text: content.content_en,
            context: "lecture",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Translation failed");
      }

      const data = await response.json();

      setEditedParagraphs((prev) => ({
        ...prev,
        [paragraphId]: { ...prev[paragraphId], content_ua: data.translated },
      }));

      toast.success("Параграф перекладено");
    } catch (error: any) {
      toast.error(error.message || "Помилка перекладу");
      console.error(error);
    } finally {
      setTranslatingParagraphId(null);
    }
  };

  // AI переклад всіх параграфів
  const translateAllWithAI = async () => {
    const untranslated = Object.entries(editedParagraphs).filter(
      ([_, content]) => content.content_en && !content.content_ua
    );

    if (untranslated.length === 0) {
      toast.info("Всі параграфи вже мають український текст");
      return;
    }

    setIsTranslating(true);
    let translated = 0;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Необхідно увійти в систему");
      }

      for (const [paragraphId, content] of Object.entries(editedParagraphs)) {
        if (!content.content_en || content.content_ua) continue;

        setTranslatingParagraphId(paragraphId);

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-claude`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              text: content.content_en,
              context: "lecture",
            }),
          }
        );

        if (!response.ok) {
          console.error(`Failed to translate paragraph ${paragraphId}`);
          continue;
        }

        const data = await response.json();

        setEditedParagraphs((prev) => ({
          ...prev,
          [paragraphId]: { ...prev[paragraphId], content_ua: data.translated },
        }));

        translated++;
      }

      toast.success(`Перекладено ${translated} параграфів`);
    } catch (error: any) {
      toast.error(error.message || "Помилка перекладу");
      console.error(error);
    } finally {
      setIsTranslating(false);
      setTranslatingParagraphId(null);
    }
  };

  // Функція для парсингу HTML та отримання параграфів
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
          result.push(content);
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

  // Оновлення кількості визначених параграфів при зміні тексту
  const handleBulkTextChange = (html: string) => {
    setBulkTranslationText(html);
    const detected = parseHtmlParagraphs(html);
    setDetectedParagraphsCount(detected.length);
  };

  // Вставка повного перекладу (розбиття по параграфах з HTML)
  const applyBulkTranslation = () => {
    const translatedParagraphs = parseHtmlParagraphs(bulkTranslationText);

    if (translatedParagraphs.length === 0) {
      toast.error("Введіть текст перекладу");
      return;
    }

    // Отримуємо параграфи у правильному порядку
    const sortedParagraphs = [...paragraphs].sort(
      (a, b) => a.paragraph_number - b.paragraph_number
    );

    // Застосовуємо переклад до відповідних параграфів (зберігаємо HTML форматування)
    setEditedParagraphs((prev) => {
      const updated = { ...prev };
      const minCount = Math.min(sortedParagraphs.length, translatedParagraphs.length);

      for (let i = 0; i < minCount; i++) {
        const paragraph = sortedParagraphs[i];
        const paragraphId = paragraph.id;

        if (updated[paragraphId]) {
          updated[paragraphId] = {
            ...updated[paragraphId],
            // Зберігаємо HTML форматування з вставленого тексту
            content_ua: translatedParagraphs[i],
          };
        }
      }

      return updated;
    });

    const appliedCount = Math.min(sortedParagraphs.length, translatedParagraphs.length);
    toast.success(`Застосовано переклад до ${appliedCount} параграфів`);

    if (translatedParagraphs.length !== paragraphs.length) {
      toast.info(
        `Параграфів у тексті: ${translatedParagraphs.length}, у лекції: ${paragraphs.length}`
      );
    }

    setShowBulkTranslationDialog(false);
    setBulkTranslationText("");
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

  const title = language === "uk" && lecture.title_ua ? lecture.title_ua : lecture.title_en;
  const location =
    language === "uk" && lecture.location_ua ? lecture.location_ua : lecture.location_en;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Навігація назад */}
        <Button
          variant="ghost"
          onClick={() => navigate(getLocalizedPath("/library/lectures"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === "uk" ? "Назад до бібліотеки" : "Back to library"}
        </Button>

        {/* Admin Edit Header */}
        {isAdmin && (
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 mb-4 -mx-4 px-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isEditing && (
                  <span className="text-sm text-muted-foreground">
                    Режим редагування
                    {isTranslating && translatingParagraphId && (
                      <span className="ml-2">
                        (Переклад...)
                      </span>
                    )}
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={transliterateAll}
                      disabled={isTranslating}
                      title="Транслітерувати санскрит у всіх параграфах"
                    >
                      <Languages className="mr-2 h-4 w-4" />
                      Транслітерувати все
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={translateAllWithAI}
                      disabled={isTranslating}
                      title="AI переклад всіх параграфів без українського тексту"
                    >
                      {isTranslating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      {isTranslating ? "Перекладаю..." : "Перекласти все AI"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBulkTranslationDialog(true)}
                      disabled={isTranslating}
                      title="Вставити повний переклад для всіх параграфів"
                    >
                      <ClipboardPaste className="mr-2 h-4 w-4" />
                      Вставити переклад
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={saveEdit}
                      disabled={saveLectureMutation.isPending || isTranslating}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {saveLectureMutation.isPending ? "Збереження..." : "Зберегти"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEdit} disabled={isTranslating}>
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
            </div>
          </div>
        )}

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
                  value={editedLecture.title_ua}
                  onChange={(e) => setEditedLecture({ ...editedLecture, title_ua: e.target.value })}
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
            <h1 className="text-3xl font-bold mb-4 text-foreground">{title}</h1>
          )}

          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {formatDate(lecture.lecture_date)}
            </div>
            {isEditing && editedLecture ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <Input
                    value={editedLecture.location_ua}
                    onChange={(e) => setEditedLecture({ ...editedLecture, location_ua: e.target.value })}
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


          {/* Аудіо плеєр */}
          {lecture.audio_url && (
            <div className="mt-6">
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
                  {language === "uk" ? "Аудіо лекція" : "Audio lecture"}
                </div>
              </div>
              <audio ref={audioRef} src={lecture.audio_url} preload="metadata" />
            </div>
          )}
        </div>

        {/* Текст лекції */}
        <div>
          {isEditing ? (
            <div className="space-y-6">
              {paragraphs.map((paragraph) => (
                <div
                  key={paragraph.id}
                  className={`border rounded-lg p-4 bg-muted/20 ${
                    translatingParagraphId === paragraph.id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-muted-foreground">
                      Параграф {paragraph.paragraph_number}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => transliterateParagraph(paragraph.id)}
                        disabled={isTranslating}
                        title="Транслітерувати санскрит"
                      >
                        <Languages className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => translateParagraphWithAI(paragraph.id)}
                        disabled={translatingParagraphId === paragraph.id || isTranslating}
                        title="AI переклад"
                      >
                        {translatingParagraphId === paragraph.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Українська</label>
                      <EnhancedInlineEditor
                        content={editedParagraphs[paragraph.id]?.content_ua || ""}
                        onChange={(html) =>
                          setEditedParagraphs((prev) => ({
                            ...prev,
                            [paragraph.id]: {
                              ...prev[paragraph.id],
                              content_ua: html,
                            },
                          }))
                        }
                        label="Редагувати текст UA"
                        onScroll={(ratio) =>
                          setScrollSyncState((prev) => ({
                            ...prev,
                            [paragraph.id]: {
                              ratio,
                              source: "uk",
                              counter: (prev[paragraph.id]?.counter || 0) + 1,
                            },
                          }))
                        }
                        syncScrollRatio={
                          scrollSyncState[paragraph.id]?.source === "en"
                            ? scrollSyncState[paragraph.id]?.ratio
                            : undefined
                        }
                        scrollSyncId={`${paragraph.id}-${scrollSyncState[paragraph.id]?.counter || 0}`}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">English</label>
                      <EnhancedInlineEditor
                        content={editedParagraphs[paragraph.id]?.content_en || ""}
                        onChange={(html) =>
                          setEditedParagraphs((prev) => ({
                            ...prev,
                            [paragraph.id]: {
                              ...prev[paragraph.id],
                              content_en: html,
                            },
                          }))
                        }
                        label="Edit text EN"
                        onScroll={(ratio) =>
                          setScrollSyncState((prev) => ({
                            ...prev,
                            [paragraph.id]: {
                              ratio,
                              source: "en",
                              counter: (prev[paragraph.id]?.counter || 0) + 1,
                            },
                          }))
                        }
                        syncScrollRatio={
                          scrollSyncState[paragraph.id]?.source === "uk"
                            ? scrollSyncState[paragraph.id]?.ratio
                            : undefined
                        }
                        scrollSyncId={`${paragraph.id}-${scrollSyncState[paragraph.id]?.counter || 0}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
              {paragraphs.map((paragraph) => {
                const content =
                  language === "uk" && paragraph.content_ua
                    ? paragraph.content_ua
                    : paragraph.content_en;

                const isCurrentParagraph =
                  currentParagraph === paragraph.paragraph_number;

                return (
                  <p
                    key={paragraph.id}
                    ref={(el) =>
                      (paragraphRefs.current[paragraph.paragraph_number] = el)
                    }
                    className={`mb-4 leading-relaxed transition-colors ${
                      isCurrentParagraph
                        ? "bg-primary/10 -mx-2 px-2 py-1"
                        : ""
                    }`}
                  >
                    {formatText(content)}
                  </p>
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

      {/* Діалог вставки повного перекладу */}
      <Dialog open={showBulkTranslationDialog} onOpenChange={(open) => {
        setShowBulkTranslationDialog(open);
        if (!open) {
          setBulkTranslationText("");
          setDetectedParagraphsCount(0);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Вставити переклад для всіх параграфів</DialogTitle>
            <DialogDescription>
              Вставте повний український переклад лекції з форматуванням (bold, italic тощо).
              Кожен параграф має бути в окремому абзаці (натискайте Enter двічі між параграфами).
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-4 text-sm py-2">
            <div className="px-3 py-1 rounded bg-muted">
              Параграфів у лекції: <strong>{paragraphs.length}</strong>
            </div>
            <div className={`px-3 py-1 rounded ${
              detectedParagraphsCount === paragraphs.length
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : detectedParagraphsCount > 0
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : "bg-muted"
            }`}>
              Визначено параграфів: <strong>{detectedParagraphsCount}</strong>
              {detectedParagraphsCount > 0 && detectedParagraphsCount !== paragraphs.length && (
                <span className="ml-1">
                  ({detectedParagraphsCount > paragraphs.length ? "+" : ""}{detectedParagraphsCount - paragraphs.length})
                </span>
              )}
            </div>
          </div>

          <div className="py-2">
            <EnhancedInlineEditor
              content={bulkTranslationText}
              onChange={handleBulkTextChange}
              minHeight="300px"
              placeholder="Вставте тут повний текст перекладу українською мовою з форматуванням..."
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkTranslationDialog(false)}>
              Скасувати
            </Button>
            <Button
              onClick={applyBulkTranslation}
              disabled={detectedParagraphsCount === 0}
            >
              <ClipboardPaste className="mr-2 h-4 w-4" />
              Застосувати переклад ({Math.min(detectedParagraphsCount, paragraphs.length)} пар.)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
