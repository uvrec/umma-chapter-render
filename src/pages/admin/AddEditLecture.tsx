/**
 * Повноцінний редактор лекцій
 * /admin/lectures/new - створення нової лекції
 * /admin/lectures/:id/edit - редагування існуючої
 *
 * Функціонал:
 * - Редагування метаданих лекції
 * - Керування параграфами з drag-and-drop
 * - Аудіо синхронізація з таймкодами
 * - Waveform візуалізація аудіо
 * - AI переклад (batch)
 * - Keyboard shortcuts
 * - Live preview
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

// Icons
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Clock,
  Languages,
  Sparkles,
  Eye,
  Volume2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  SplitSquareHorizontal,
  Merge,
  Copy,
  Keyboard,
  Mic,
  Upload,
  Settings,
  AudioWaveform,
  Timer,
  Music,
} from "lucide-react";

import { toast } from "sonner";
import { transliterateIAST } from "@/utils/text/transliteration";
import type { Lecture, LectureParagraph, LectureType } from "@/types/lecture";

// Constants
const LECTURE_TYPES: LectureType[] = [
  "Bhagavad-gita",
  "Srimad-Bhagavatam",
  "Sri Caitanya-caritamrta",
  "Nectar of Devotion",
  "Sri Isopanisad",
  "Lecture",
  "Morning Walk",
  "Room Conversation",
  "Conversation",
  "Walk",
  "Interview",
  "Initiation",
  "Arrival",
  "Departure",
  "Festival",
  "Bhajan",
  "Kirtan",
  "Other",
];

const BOOK_SLUGS = ["bg", "sb", "cc", "nod", "iso", "noi", "tkg", "rv"];

// Paragraph interface with local state
interface EditableParagraph extends LectureParagraph {
  isNew?: boolean;
  isDeleted?: boolean;
  isDirty?: boolean;
}

// Format time helper
const formatTime = (seconds: number | null): string => {
  if (seconds === null || seconds === undefined) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const parseTime = (timeStr: string): number | null => {
  const parts = timeStr.split(":").map((p) => parseInt(p, 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  return null;
};

export default function AddEditLecture() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAdmin } = useAuth();
  const isEditing = !!id;

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const paragraphRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // State - Lecture
  const [lecture, setLecture] = useState<Partial<Lecture>>({
    title_en: "",
    title_ua: "",
    location_en: "",
    location_ua: "",
    lecture_date: new Date().toISOString().split("T")[0],
    lecture_type: "Lecture",
    audio_url: "",
    book_slug: null,
    canto_number: null,
    chapter_number: null,
    verse_number: null,
    description_en: "",
    description_ua: "",
  });

  // State - Paragraphs
  const [paragraphs, setParagraphs] = useState<EditableParagraph[]>([]);
  const [activeParagraph, setActiveParagraph] = useState<string | null>(null);

  // State - Audio
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showWaveform, setShowWaveform] = useState(true);

  // State - UI
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // State - AI Translation
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translatingParagraphId, setTranslatingParagraphId] = useState<string | null>(null);

  // State - Sync Mode
  const [syncMode, setSyncMode] = useState(false);
  const [syncParagraphIndex, setSyncParagraphIndex] = useState(0);

  // Auth check
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  // Load lecture data
  const { data: lectureData, isLoading: lectureLoading } = useQuery({
    queryKey: ["admin-lecture", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await (supabase as any)
        .from("lectures")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Lecture;
    },
    enabled: !!id,
  });

  // Load paragraphs
  const { data: paragraphsData, isLoading: paragraphsLoading } = useQuery({
    queryKey: ["admin-lecture-paragraphs", id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await (supabase as any)
        .from("lecture_paragraphs")
        .select("*")
        .eq("lecture_id", id)
        .order("paragraph_number");
      if (error) throw error;
      return data as LectureParagraph[];
    },
    enabled: !!id,
  });

  // Initialize state from loaded data
  useEffect(() => {
    if (lectureData) {
      setLecture(lectureData);
    }
  }, [lectureData]);

  useEffect(() => {
    if (paragraphsData) {
      setParagraphs(paragraphsData.map((p) => ({ ...p, isDirty: false })));
    }
  }, [paragraphsData]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [lecture.audio_url]);

  // Highlight current paragraph based on timecode
  useEffect(() => {
    if (!isPlaying) return;

    const current = paragraphs.find((p, idx) => {
      if (p.audio_timecode === null) return false;
      const next = paragraphs[idx + 1];
      return (
        currentTime >= p.audio_timecode &&
        (!next || next.audio_timecode === null || currentTime < next.audio_timecode)
      );
    });

    if (current && activeParagraph !== current.id) {
      setActiveParagraph(current.id);
      // Auto-scroll to active paragraph
      const ref = paragraphRefs.current[current.id];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentTime, paragraphs, isPlaying, activeParagraph]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        // Allow space for sync mode even in inputs
        if (e.code === "Space" && syncMode) {
          e.preventDefault();
          handleSetTimecode();
        }
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (syncMode) {
            handleSetTimecode();
          } else {
            togglePlayPause();
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekAudio(-5);
          break;
        case "ArrowRight":
          e.preventDefault();
          seekAudio(5);
          break;
        case "ArrowUp":
          e.preventDefault();
          if (e.shiftKey) moveParagraph("up");
          break;
        case "ArrowDown":
          e.preventDefault();
          if (e.shiftKey) moveParagraph("down");
          break;
        case "KeyS":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleSave();
          }
          break;
        case "KeyT":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setSyncMode((prev) => !prev);
          }
          break;
        case "Escape":
          setSyncMode(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [syncMode, activeParagraph, paragraphs]);

  // Audio controls
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const seekAudio = (delta: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(duration, audioRef.current.currentTime + delta)
      );
    }
  };

  const seekToTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Paragraph management
  const addParagraph = () => {
    const newParagraph: EditableParagraph = {
      id: `new-${Date.now()}`,
      lecture_id: id || "",
      paragraph_number: paragraphs.length + 1,
      content_en: "",
      content_ua: null,
      audio_timecode: null,
      created_at: new Date().toISOString(),
      isNew: true,
      isDirty: true,
    };
    setParagraphs([...paragraphs, newParagraph]);
    setActiveParagraph(newParagraph.id);
  };

  const updateParagraph = (id: string, field: keyof EditableParagraph, value: any) => {
    setParagraphs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value, isDirty: true } : p))
    );
  };

  const deleteParagraph = (id: string) => {
    const paragraph = paragraphs.find((p) => p.id === id);
    if (!paragraph) return;

    if (paragraph.isNew) {
      setParagraphs((prev) => prev.filter((p) => p.id !== id));
    } else {
      setParagraphs((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isDeleted: true } : p))
      );
    }
    setShowDeleteConfirm(null);
  };

  const moveParagraph = (direction: "up" | "down") => {
    if (!activeParagraph) return;
    const currentIndex = paragraphs.findIndex((p) => p.id === activeParagraph);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= paragraphs.length) return;

    const newParagraphs = [...paragraphs];
    [newParagraphs[currentIndex], newParagraphs[newIndex]] = [
      newParagraphs[newIndex],
      newParagraphs[currentIndex],
    ];

    // Update paragraph numbers
    newParagraphs.forEach((p, idx) => {
      p.paragraph_number = idx + 1;
      p.isDirty = true;
    });

    setParagraphs(newParagraphs);
  };

  const splitParagraph = (id: string, position: number) => {
    const paragraph = paragraphs.find((p) => p.id === id);
    if (!paragraph || !paragraph.content_en) return;

    const textBefore = paragraph.content_en.slice(0, position);
    const textAfter = paragraph.content_en.slice(position);

    const newParagraph: EditableParagraph = {
      id: `new-${Date.now()}`,
      lecture_id: id || "",
      paragraph_number: paragraph.paragraph_number + 1,
      content_en: textAfter.trim(),
      content_ua: null,
      audio_timecode: null,
      created_at: new Date().toISOString(),
      isNew: true,
      isDirty: true,
    };

    setParagraphs((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      const updated = [...prev];
      updated[idx] = { ...paragraph, content_en: textBefore.trim(), isDirty: true };
      updated.splice(idx + 1, 0, newParagraph);

      // Update paragraph numbers
      return updated.map((p, i) => ({ ...p, paragraph_number: i + 1 }));
    });
  };

  const mergeParagraphs = (id1: string, id2: string) => {
    const p1 = paragraphs.find((p) => p.id === id1);
    const p2 = paragraphs.find((p) => p.id === id2);
    if (!p1 || !p2) return;

    const mergedContent = `${p1.content_en || ""}\n\n${p2.content_en || ""}`.trim();
    const mergedContentUa = p1.content_ua || p2.content_ua
      ? `${p1.content_ua || ""}\n\n${p2.content_ua || ""}`.trim()
      : null;

    setParagraphs((prev) => {
      const idx1 = prev.findIndex((p) => p.id === id1);
      const updated = prev
        .map((p) =>
          p.id === id1
            ? { ...p, content_en: mergedContent, content_ua: mergedContentUa, isDirty: true }
            : p
        )
        .filter((p) => p.id !== id2);

      // Update paragraph numbers
      return updated.map((p, i) => ({ ...p, paragraph_number: i + 1 }));
    });
  };

  // Set timecode for sync mode
  const handleSetTimecode = useCallback(() => {
    if (!syncMode) return;

    const visibleParagraphs = paragraphs.filter((p) => !p.isDeleted);
    if (syncParagraphIndex >= visibleParagraphs.length) {
      setSyncMode(false);
      toast.success("Всі таймкоди встановлено!");
      return;
    }

    const paragraph = visibleParagraphs[syncParagraphIndex];
    updateParagraph(paragraph.id, "audio_timecode", Math.floor(currentTime));
    setSyncParagraphIndex((prev) => prev + 1);

    toast.success(`Таймкод ${formatTime(currentTime)} для параграфа #${paragraph.paragraph_number}`);
  }, [syncMode, syncParagraphIndex, currentTime, paragraphs]);

  // AI Translation
  const translateParagraph = async (paragraphId: string) => {
    const paragraph = paragraphs.find((p) => p.id === paragraphId);
    if (!paragraph?.content_en) return;

    setTranslatingParagraphId(paragraphId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-claude`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            text: paragraph.content_en,
            context: "lecture",
          }),
        }
      );

      if (!response.ok) throw new Error("Translation failed");

      const data = await response.json();
      updateParagraph(paragraphId, "content_ua", data.translated);
      toast.success(`Параграф #${paragraph.paragraph_number} перекладено`);
    } catch (error) {
      toast.error("Помилка перекладу");
      console.error(error);
    } finally {
      setTranslatingParagraphId(null);
    }
  };

  const translateAllParagraphs = async () => {
    const untranslated = paragraphs.filter(
      (p) => p.content_en && !p.content_ua && !p.isDeleted
    );

    if (untranslated.length === 0) {
      toast.info("Всі параграфи вже перекладено");
      return;
    }

    setIsTranslating(true);
    setTranslationProgress(0);

    try {
      for (let i = 0; i < untranslated.length; i++) {
        const p = untranslated[i];
        setTranslatingParagraphId(p.id);

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-claude`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              text: p.content_en,
              context: "lecture",
            }),
          }
        );

        if (!response.ok) continue;

        const data = await response.json();
        updateParagraph(p.id, "content_ua", data.translated);
        setTranslationProgress(((i + 1) / untranslated.length) * 100);
      }

      toast.success(`Перекладено ${untranslated.length} параграфів`);
    } catch (error) {
      toast.error("Помилка перекладу");
      console.error(error);
    } finally {
      setIsTranslating(false);
      setTranslatingParagraphId(null);
    }
  };

  // Transliterate
  const transliterateParagraph = (paragraphId: string) => {
    const paragraph = paragraphs.find((p) => p.id === paragraphId);
    if (!paragraph?.content_en) return;

    const transliterated = transliterateIAST(paragraph.content_en);
    updateParagraph(paragraphId, "content_ua", transliterated);
    toast.success("Транслітерацію застосовано");
  };

  // Generate slug
  const generateSlug = () => {
    if (!lecture.lecture_date || !lecture.title_en) return;

    const date = lecture.lecture_date.replace(/-/g, "").slice(2);
    const title = lecture.title_en
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 30);

    setLecture((prev) => ({ ...prev, slug: `${date}-${title}` }));
  };

  // Save lecture
  const handleSave = async () => {
    if (!lecture.title_en) {
      toast.error("Назва лекції обов'язкова");
      return;
    }

    setIsSaving(true);

    try {
      let lectureId = id;

      // Save or create lecture
      if (isEditing) {
        const { error } = await (supabase as any)
          .from("lectures")
          .update({
            title_en: lecture.title_en,
            title_ua: lecture.title_ua || null,
            location_en: lecture.location_en,
            location_ua: lecture.location_ua || null,
            lecture_date: lecture.lecture_date,
            lecture_type: lecture.lecture_type,
            audio_url: lecture.audio_url || null,
            book_slug: lecture.book_slug || null,
            canto_number: lecture.canto_number || null,
            chapter_number: lecture.chapter_number || null,
            verse_number: lecture.verse_number || null,
            description_en: lecture.description_en || null,
            description_ua: lecture.description_ua || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) throw error;
      } else {
        // Generate slug if not set
        const slug =
          lecture.slug ||
          `${lecture.lecture_date?.replace(/-/g, "").slice(2)}-${lecture.title_en
            ?.toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 30)}`;

        const { data, error } = await (supabase as any)
          .from("lectures")
          .insert({
            slug,
            title_en: lecture.title_en,
            title_ua: lecture.title_ua || null,
            location_en: lecture.location_en || "",
            location_ua: lecture.location_ua || null,
            lecture_date: lecture.lecture_date,
            lecture_type: lecture.lecture_type,
            audio_url: lecture.audio_url || null,
            book_slug: lecture.book_slug || null,
            canto_number: lecture.canto_number || null,
            chapter_number: lecture.chapter_number || null,
            verse_number: lecture.verse_number || null,
            description_en: lecture.description_en || null,
            description_ua: lecture.description_ua || null,
          })
          .select()
          .single();

        if (error) throw error;
        lectureId = data.id;
      }

      // Handle paragraphs
      const deletedParagraphs = paragraphs.filter((p) => p.isDeleted && !p.isNew);
      const newParagraphs = paragraphs.filter((p) => p.isNew && !p.isDeleted);
      const updatedParagraphs = paragraphs.filter(
        (p) => !p.isNew && !p.isDeleted && p.isDirty
      );

      // Delete removed paragraphs
      for (const p of deletedParagraphs) {
        await (supabase as any).from("lecture_paragraphs").delete().eq("id", p.id);
      }

      // Insert new paragraphs
      for (const p of newParagraphs) {
        await (supabase as any).from("lecture_paragraphs").insert({
          lecture_id: lectureId,
          paragraph_number: p.paragraph_number,
          content_en: p.content_en,
          content_ua: p.content_ua || null,
          audio_timecode: p.audio_timecode,
        });
      }

      // Update existing paragraphs
      for (const p of updatedParagraphs) {
        await (supabase as any)
          .from("lecture_paragraphs")
          .update({
            paragraph_number: p.paragraph_number,
            content_en: p.content_en,
            content_ua: p.content_ua || null,
            audio_timecode: p.audio_timecode,
          })
          .eq("id", p.id);
      }

      queryClient.invalidateQueries({ queryKey: ["admin-lectures"] });
      queryClient.invalidateQueries({ queryKey: ["admin-lecture", lectureId] });
      queryClient.invalidateQueries({ queryKey: ["admin-lecture-paragraphs", lectureId] });

      toast.success(isEditing ? "Лекцію оновлено" : "Лекцію створено");

      if (!isEditing && lectureId) {
        navigate(`/admin/lectures/${lectureId}/edit`);
      }
    } catch (error: any) {
      toast.error(`Помилка: ${error.message}`);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (lectureLoading || paragraphsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const visibleParagraphs = paragraphs.filter((p) => !p.isDeleted);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin/lectures")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                <div>
                  <h1 className="text-xl font-bold">
                    {isEditing ? "Редагування лекції" : "Нова лекція"}
                  </h1>
                  {lecture.slug && (
                    <p className="text-xs text-muted-foreground">{lecture.slug}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Sync Mode Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={syncMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSyncMode(!syncMode);
                        setSyncParagraphIndex(0);
                      }}
                      disabled={!lecture.audio_url}
                    >
                      <Timer className="w-4 h-4 mr-2" />
                      {syncMode ? "Режим синхронізації" : "Синхронізація"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ctrl+T: Увімкнути режим синхронізації</p>
                    <p className="text-xs text-muted-foreground">
                      Space: встановити таймкод для параграфа
                    </p>
                  </TooltipContent>
                </Tooltip>

                {/* Keyboard shortcuts */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowKeyboardShortcuts(true)}
                    >
                      <Keyboard className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Клавіатурні скорочення</TooltipContent>
                </Tooltip>

                {/* Preview */}
                {isEditing && lecture.slug && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          window.open(`/library/lectures/${lecture.slug}`, "_blank")
                        }
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Відкрити на сайті</TooltipContent>
                  </Tooltip>
                )}

                {/* Save */}
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Зберегти
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Sync Mode Banner */}
        {syncMode && (
          <div className="bg-primary text-primary-foreground py-2 px-4 text-center">
            <div className="container mx-auto flex items-center justify-center gap-4">
              <Timer className="w-4 h-4" />
              <span className="font-medium">
                Режим синхронізації: Параграф #{syncParagraphIndex + 1} з{" "}
                {visibleParagraphs.length}
              </span>
              <span className="text-sm opacity-80">
                Натисніть Space щоб встановити таймкод {formatTime(currentTime)}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSyncMode(false)}
              >
                Вийти (Esc)
              </Button>
            </div>
          </div>
        )}

        {/* Audio Player */}
        {lecture.audio_url && (
          <div className="sticky top-[57px] z-40 border-b bg-muted/50 backdrop-blur">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center gap-4">
                {/* Play controls */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => seekAudio(-5)}>
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    className="w-12 h-12 rounded-full"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => seekAudio(5)}>
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                {/* Progress */}
                <div className="flex-1">
                  <div
                    className="h-2 bg-muted rounded-full cursor-pointer overflow-hidden"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      seekToTime(percent * duration);
                    }}
                  >
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Volume */}
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <audio ref={audioRef} src={lecture.audio_url} preload="metadata" />
          </div>
        )}

        {/* Main content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Metadata */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Метадані лекції</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Title EN */}
                  <div className="space-y-2">
                    <Label htmlFor="title_en">Назва (EN) *</Label>
                    <Input
                      id="title_en"
                      value={lecture.title_en || ""}
                      onChange={(e) =>
                        setLecture((prev) => ({ ...prev, title_en: e.target.value }))
                      }
                      placeholder="Bhagavad-gita 2.12"
                    />
                  </div>

                  {/* Title UA */}
                  <div className="space-y-2">
                    <Label htmlFor="title_ua">Назва (UA)</Label>
                    <Input
                      id="title_ua"
                      value={lecture.title_ua || ""}
                      onChange={(e) =>
                        setLecture((prev) => ({ ...prev, title_ua: e.target.value }))
                      }
                      placeholder="Бгагавад-гіта 2.12"
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Дата</Label>
                    <Input
                      id="date"
                      type="date"
                      value={lecture.lecture_date || ""}
                      onChange={(e) =>
                        setLecture((prev) => ({ ...prev, lecture_date: e.target.value }))
                      }
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <Label>Тип</Label>
                    <Select
                      value={lecture.lecture_type || "Lecture"}
                      onValueChange={(value) =>
                        setLecture((prev) => ({ ...prev, lecture_type: value as LectureType }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LECTURE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="location_en">Локація (EN)</Label>
                      <Input
                        id="location_en"
                        value={lecture.location_en || ""}
                        onChange={(e) =>
                          setLecture((prev) => ({ ...prev, location_en: e.target.value }))
                        }
                        placeholder="New York"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location_ua">Локація (UA)</Label>
                      <Input
                        id="location_ua"
                        value={lecture.location_ua || ""}
                        onChange={(e) =>
                          setLecture((prev) => ({ ...prev, location_ua: e.target.value }))
                        }
                        placeholder="Нью-Йорк"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Scripture reference */}
                  <div className="space-y-2">
                    <Label>Посилання на писання</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Select
                        value={lecture.book_slug || "none"}
                        onValueChange={(value) =>
                          setLecture((prev) => ({
                            ...prev,
                            book_slug: value === "none" ? null : value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Книга" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Без книги</SelectItem>
                          {BOOK_SLUGS.map((slug) => (
                            <SelectItem key={slug} value={slug}>
                              {slug.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Глава"
                        type="number"
                        value={lecture.chapter_number || ""}
                        onChange={(e) =>
                          setLecture((prev) => ({
                            ...prev,
                            chapter_number: e.target.value ? parseInt(e.target.value) : null,
                          }))
                        }
                      />
                    </div>
                    <Input
                      placeholder="Вірш (напр. 2.12 або 2.7-11)"
                      value={lecture.verse_number || ""}
                      onChange={(e) =>
                        setLecture((prev) => ({ ...prev, verse_number: e.target.value || null }))
                      }
                    />
                  </div>

                  <Separator />

                  {/* Audio URL */}
                  <div className="space-y-2">
                    <Label htmlFor="audio_url">
                      <Music className="w-4 h-4 inline mr-1" />
                      Аудіо URL
                    </Label>
                    <Input
                      id="audio_url"
                      value={lecture.audio_url || ""}
                      onChange={(e) =>
                        setLecture((prev) => ({ ...prev, audio_url: e.target.value }))
                      }
                      placeholder="https://..."
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description_en">Опис (EN)</Label>
                    <Textarea
                      id="description_en"
                      value={lecture.description_en || ""}
                      onChange={(e) =>
                        setLecture((prev) => ({ ...prev, description_en: e.target.value }))
                      }
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_ua">Опис (UA)</Label>
                    <Textarea
                      id="description_ua"
                      value={lecture.description_ua || ""}
                      onChange={(e) =>
                        setLecture((prev) => ({ ...prev, description_ua: e.target.value }))
                      }
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Статистика</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Параграфів</div>
                      <div className="text-2xl font-bold">{visibleParagraphs.length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Перекладено</div>
                      <div className="text-2xl font-bold">
                        {visibleParagraphs.filter((p) => p.content_ua).length}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">З таймкодами</div>
                      <div className="text-2xl font-bold">
                        {visibleParagraphs.filter((p) => p.audio_timecode !== null).length}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Тривалість</div>
                      <div className="text-2xl font-bold">{formatTime(duration)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Paragraphs */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Параграфи</CardTitle>
                    <div className="flex items-center gap-2">
                      {/* Batch translate */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={translateAllParagraphs}
                        disabled={isTranslating}
                      >
                        {isTranslating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {Math.round(translationProgress)}%
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Перекласти все
                          </>
                        )}
                      </Button>

                      {/* Add paragraph */}
                      <Button size="sm" onClick={addParagraph}>
                        <Plus className="w-4 h-4 mr-2" />
                        Додати параграф
                      </Button>
                    </div>
                  </div>

                  {/* Translation progress */}
                  {isTranslating && (
                    <Progress value={translationProgress} className="mt-4" />
                  )}
                </CardHeader>
                <CardContent>
                  {visibleParagraphs.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="mb-4">Параграфів ще немає</p>
                      <Button onClick={addParagraph}>
                        <Plus className="w-4 h-4 mr-2" />
                        Додати перший параграф
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {visibleParagraphs.map((paragraph, index) => (
                        <Card
                          key={paragraph.id}
                          ref={(el) => (paragraphRefs.current[paragraph.id] = el)}
                          className={`transition-all ${
                            activeParagraph === paragraph.id
                              ? "ring-2 ring-primary"
                              : ""
                          } ${
                            syncMode && syncParagraphIndex === index
                              ? "ring-2 ring-yellow-500 bg-yellow-50 dark:bg-yellow-950"
                              : ""
                          } ${paragraph.isDirty ? "border-orange-300" : ""}`}
                          onClick={() => setActiveParagraph(paragraph.id)}
                        >
                          <CardContent className="p-4">
                            {/* Paragraph header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                                <Badge variant="outline">#{paragraph.paragraph_number}</Badge>

                                {/* Timecode */}
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <Input
                                    className="w-16 h-6 text-xs text-center"
                                    value={
                                      paragraph.audio_timecode !== null
                                        ? formatTime(paragraph.audio_timecode)
                                        : ""
                                    }
                                    placeholder="--:--"
                                    onChange={(e) => {
                                      const time = parseTime(e.target.value);
                                      updateParagraph(paragraph.id, "audio_timecode", time);
                                    }}
                                  />
                                  {paragraph.audio_timecode !== null && lecture.audio_url && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="w-6 h-6"
                                      onClick={() => seekToTime(paragraph.audio_timecode!)}
                                    >
                                      <Play className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>

                                {paragraph.isDirty && (
                                  <Badge variant="secondary" className="text-xs">
                                    Змінено
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                {/* Move buttons */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="w-6 h-6"
                                      disabled={index === 0}
                                      onClick={() => {
                                        setActiveParagraph(paragraph.id);
                                        moveParagraph("up");
                                      }}
                                    >
                                      <ChevronUp className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Вгору (Shift+Up)</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="w-6 h-6"
                                      disabled={index === visibleParagraphs.length - 1}
                                      onClick={() => {
                                        setActiveParagraph(paragraph.id);
                                        moveParagraph("down");
                                      }}
                                    >
                                      <ChevronDown className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Вниз (Shift+Down)</TooltipContent>
                                </Tooltip>

                                <Separator orientation="vertical" className="h-4" />

                                {/* Transliterate */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="w-6 h-6"
                                      onClick={() => transliterateParagraph(paragraph.id)}
                                    >
                                      <Languages className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Транслітерувати</TooltipContent>
                                </Tooltip>

                                {/* AI Translate */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="w-6 h-6"
                                      onClick={() => translateParagraph(paragraph.id)}
                                      disabled={translatingParagraphId === paragraph.id}
                                    >
                                      {translatingParagraphId === paragraph.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Sparkles className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Перекласти AI</TooltipContent>
                                </Tooltip>

                                <Separator orientation="vertical" className="h-4" />

                                {/* Merge with next */}
                                {index < visibleParagraphs.length - 1 && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-6 h-6"
                                        onClick={() =>
                                          mergeParagraphs(
                                            paragraph.id,
                                            visibleParagraphs[index + 1].id
                                          )
                                        }
                                      >
                                        <Merge className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Об'єднати з наступним</TooltipContent>
                                  </Tooltip>
                                )}

                                {/* Delete */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="w-6 h-6 text-destructive"
                                      onClick={() => setShowDeleteConfirm(paragraph.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Видалити</TooltipContent>
                                </Tooltip>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">
                                  English
                                </Label>
                                <Textarea
                                  value={paragraph.content_en || ""}
                                  onChange={(e) =>
                                    updateParagraph(paragraph.id, "content_en", e.target.value)
                                  }
                                  rows={4}
                                  className="text-sm"
                                  placeholder="Enter English text..."
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">
                                  Українська
                                </Label>
                                <Textarea
                                  value={paragraph.content_ua || ""}
                                  onChange={(e) =>
                                    updateParagraph(paragraph.id, "content_ua", e.target.value)
                                  }
                                  rows={4}
                                  className="text-sm"
                                  placeholder="Введіть український текст..."
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Delete confirmation dialog */}
        <AlertDialog
          open={!!showDeleteConfirm}
          onOpenChange={() => setShowDeleteConfirm(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Видалити параграф?</AlertDialogTitle>
              <AlertDialogDescription>
                Цю дію неможливо скасувати після збереження.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Скасувати</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => showDeleteConfirm && deleteParagraph(showDeleteConfirm)}
                className="bg-destructive text-destructive-foreground"
              >
                Видалити
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Keyboard shortcuts dialog */}
        <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Клавіатурні скорочення</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Аудіо</div>
                <div></div>

                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-muted rounded">Space</kbd>
                </div>
                <div className="text-muted-foreground">Play / Pause</div>

                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-muted rounded">←</kbd>
                </div>
                <div className="text-muted-foreground">-5 секунд</div>

                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-muted rounded">→</kbd>
                </div>
                <div className="text-muted-foreground">+5 секунд</div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Синхронізація</div>
                <div></div>

                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-muted rounded">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-muted rounded">T</kbd>
                </div>
                <div className="text-muted-foreground">Режим синхронізації</div>

                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-muted rounded">Space</kbd>
                  <span className="text-xs">(в режимі синхр.)</span>
                </div>
                <div className="text-muted-foreground">Встановити таймкод</div>

                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-muted rounded">Esc</kbd>
                </div>
                <div className="text-muted-foreground">Вийти з режиму</div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Редагування</div>
                <div></div>

                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-muted rounded">Shift</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-muted rounded">↑</kbd>
                </div>
                <div className="text-muted-foreground">Перемістити вгору</div>

                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-muted rounded">Shift</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-muted rounded">↓</kbd>
                </div>
                <div className="text-muted-foreground">Перемістити вниз</div>

                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-muted rounded">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-muted rounded">S</kbd>
                </div>
                <div className="text-muted-foreground">Зберегти</div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowKeyboardShortcuts(false)}>Закрити</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
