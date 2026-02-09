// VedaReaderDB.tsx — ENHANCED VERSION
// Додано: Sticky Header, Bookmark, Share, Download, Keyboard Navigation

import { useEffect, useLayoutEffect, useMemo, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Languages, Bookmark, Share2, Download, Home, Highlighter, HelpCircle, GraduationCap, Maximize, Leaf, Copy, Link, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerseCard } from "@/components/VerseCard";
import { DualLanguageVerseCard } from "@/components/DualLanguageVerseCard";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type VerseData = Database['public']['Tables']['verses']['Row'];
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { addLearningVerse, isVerseInLearningList } from "@/utils/learningVerses";
import { TiptapRenderer } from "@/components/blog/TiptapRenderer";
import { HighlightDialog } from "@/components/HighlightDialog";
import { SelectionTooltip } from "@/components/SelectionTooltip";
import { useHighlights } from "@/hooks/useHighlights";
import { useKeyboardShortcuts, KeyboardShortcut } from "@/hooks/useKeyboardShortcuts";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { JumpToVerseDialog } from "@/components/JumpToVerseDialog";
import { SwipeIndicator } from "@/components/SwipeIndicator";
import { ChapterVerseSelector } from "@/components/ChapterVerseSelector";
import { RelatedVerses } from "@/components/RelatedVerses";
import { VerseTattvas } from "@/components/verse/VerseTattvas";
import { cleanHtml, cleanSanskrit } from "@/utils/import/normalizers";
import { shareVerse, copyVerseWithLink, copyVerseUrl, VerseParams } from "@/utils/verseShare";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useTrackpadNavigation } from "@/hooks/useTrackpadNavigation";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useReadingSession } from "@/hooks/useReadingSession";
import { useSectionMemento } from "@/hooks/useSectionMemento";
import { useBooks } from "@/contexts/BooksContext";
import { useIsMobile } from "@/hooks/use-mobile";

export const VedaReaderDB = () => {
  // Support both /veda-reader/ and /lib/ URL patterns
  const params = useParams<{
    bookId?: string;
    cantoNumber?: string;
    chapterNumber?: string;
    verseNumber?: string;
    verseId?: string;
    // /lib/ params
    p1?: string;
    p2?: string;
    p3?: string;
  }>();

  const { hasCantoStructure } = useBooks();

  // Normalize params from /lib/ format to standard format
  const bookId = params.bookId;
  const isCantoBook = bookId ? hasCantoStructure(bookId) : false;

  // For /lib/ routes: p1/p2/p3 need to be mapped based on book type
  // /lib/sb/1/3/19 → canto=1, chapter=3, verse=19 (canto book)
  // /lib/bg/3/19 → chapter=3, verse=19 (non-canto book)
  const cantoNumber = params.cantoNumber ?? (isCantoBook ? params.p1 : undefined);
  const chapterNumber = params.chapterNumber ?? (isCantoBook ? params.p2 : params.p1);
  const verseNumber = params.verseNumber ?? params.verseId ?? (isCantoBook ? params.p3 : params.p2);

  const routeVerseNumber = verseNumber;
  const navigate = useNavigate();
  const {
    language,
    t,
    getLocalizedPath
  } = useLanguage();
  const {
    isAdmin
  } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  useSectionMemento(); // Preserve scroll position when navigating away and back

  // Hide Spine navigation on mobile when verse page is active
  useEffect(() => {
    document.documentElement.setAttribute('data-verse-page', 'true');
    return () => {
      document.documentElement.removeAttribute('data-verse-page');
    };
  }, []);

  const [searchParams] = useSearchParams();
  const previewToken = searchParams.get('preview');
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  // settingsOpen removed — settings accessible from Header gear icon

  // Bookmark state
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Highlight state
  const [highlightDialogOpen, setHighlightDialogOpen] = useState(false);
  const [selectedTextForHighlight, setSelectedTextForHighlight] = useState("");
  const [selectionContext, setSelectionContext] = useState({
    before: "",
    after: ""
  });
  // Selection tooltip state (shown before dialog)
  const [selectionTooltipVisible, setSelectionTooltipVisible] = useState(false);
  const [selectionTooltipPosition, setSelectionTooltipPosition] = useState({ x: 0, y: 0 });

  // Keyboard shortcuts state
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Jump to verse dialog state
  const [showJumpDialog, setShowJumpDialog] = useState(false);

  // Ref to track if we've already shown "verse not found" error for current URL
  // This prevents repeated error toasts when verses are reloaded after save
  const lastNotFoundVerseRef = useRef<string | null>(null);

  // ✅ Використовуємо централізовану систему через useReaderSettings
  const {
    fontSize,
    lineHeight,
    increaseFont,
    decreaseFont,
    dualLanguageMode,
    setDualLanguageMode,
    textDisplaySettings,
    setTextDisplaySettings,
    continuousReadingSettings,
    setContinuousReadingSettings,
    showNumbers,
    setShowNumbers,
    flowMode,
    setFlowMode,
    showVerseContour,
    fullscreenMode,
    setFullscreenMode,
    zenMode,
    setZenMode,
    presentationMode,
    setPresentationMode,
  } = useReaderSettings();
  const [originalLanguage, setOriginalLanguage] = useState<"sanskrit" | "uk" | "en">("sanskrit");
  const getDisplayVerseNumber = (verseNumber: string): string => {
    const parts = verseNumber.split(/[\s.]+/);
    return parts[parts.length - 1] || verseNumber;
  };

  // ✅ НОВЕ: Helper для fallback на іншу мову якщо переклад відсутній
  const getTranslationWithFallback = (verse: VerseData, field: 'translation' | 'synonyms' | 'commentary'): string => {
    // Захист від undefined verse
    if (!verse) return '';

    const primaryField = (language === 'uk' ? `${field}_uk` : `${field}_en`) as keyof VerseData;
    const fallbackField = (language === 'uk' ? `${field}_en` : `${field}_uk`) as keyof VerseData;

    // Спочатку намагаємося взяти основну мову
    const primaryValue = verse[primaryField] as string | null;
    if (primaryValue && primaryValue.trim()) {
      return primaryValue;
    }

    // Якщо основної мови немає, беремо fallback
    const fallbackValue = verse[fallbackField] as string | null;
    if (fallbackValue && fallbackValue.trim()) {
      // Додаємо маркер що це fallback (тільки для адміна і тільки для перекладу)
      if (isAdmin && field === 'translation') {
        const fallbackLang = language === 'uk' ? 'EN' : 'UK';
        return `⚠️ [${fallbackLang} fallback] ${fallbackValue}`;
      }
      return fallbackValue;
    }
    return '';
  };
  const isCantoMode = !!cantoNumber;

  // Special handling for NoI: /veda-reader/noi/1 → chapter=1, verse=1
  // NoI має всі тексти в главі 1, URL /noi/1 означає "текст 1"
  let effectiveChapterParam = chapterNumber;
  if (bookId === 'noi' && !chapterNumber && routeVerseNumber) {
    effectiveChapterParam = '1'; // Всі NoI тексти завжди в главі 1
  }

  // BOOK - with preview token support
  const {
    data: book
  } = useQuery({
    queryKey: ["book", bookId, previewToken],
    staleTime: 60_000,
    enabled: !!bookId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_book_with_preview", {
        p_book_slug: bookId,
        p_token: previewToken
      });
      if (error) {
        console.error('RPC get_book_with_preview error:', error);
        // Fallback for published books
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("books")
          .select("id, slug, title_uk, title_en, has_cantos")
          .eq("slug", bookId)
          .maybeSingle();
        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
      return data && data.length > 0 ? data[0] : null;
    }
  });

  // CANTO (лише в canto mode) - with preview token support
  const {
    data: canto,
    isLoading: isLoadingCanto
  } = useQuery({
    queryKey: ["canto", book?.id, cantoNumber, previewToken],
    staleTime: 60_000,
    enabled: isCantoMode && !!book?.id && !!cantoNumber,
    queryFn: async () => {
      if (!book?.id || !cantoNumber) return null;
      const { data, error } = await supabase.rpc("get_canto_by_number_with_preview", {
        p_book_id: book.id,
        p_canto_number: parseInt(cantoNumber),
        p_token: previewToken
      });
      if (error) {
        console.error('RPC get_canto_by_number_with_preview error:', error);
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("cantos")
          .select("id, canto_number, title_uk, title_en")
          .eq("book_id", book.id)
          .eq("canto_number", parseInt(cantoNumber))
          .maybeSingle();
        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
      return data && data.length > 0 ? data[0] : null;
    }
  });

  // CHAPTER - with preview token support
  const {
    data: chapter,
    isLoading: isLoadingChapter
  } = useQuery({
    queryKey: ["chapter", book?.id, canto?.id, effectiveChapterParam, isCantoMode, previewToken],
    staleTime: 60_000,
    enabled: !!effectiveChapterParam && (isCantoMode ? !!canto?.id : !!book?.id),
    queryFn: async () => {
      if (!book?.id || !effectiveChapterParam) return null;
      const { data, error } = await supabase.rpc("get_chapter_by_number_with_preview", {
        p_book_id: book.id,
        p_canto_id: isCantoMode && canto?.id ? canto.id : null,
        p_chapter_number: parseInt(effectiveChapterParam),
        p_token: previewToken
      });
      if (error) {
        console.error('RPC get_chapter_by_number_with_preview error:', error);
        const base = supabase.from("chapters").select("*").eq("chapter_number", parseInt(effectiveChapterParam));
        const query = isCantoMode && canto?.id ? base.eq("canto_id", canto.id) : base.eq("book_id", book.id);
        const { data: fallbackData, error: fallbackError } = await query.maybeSingle();
        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
      return data && data.length > 0 ? data[0] : null;
    }
  });

  // Fallback: legacy chapter without canto - with preview token support
  // Only use fallback when main chapter query completed and found nothing
  const {
    data: fallbackChapter
  } = useQuery({
    queryKey: ["fallback-chapter", book?.id, effectiveChapterParam, previewToken],
    staleTime: 60_000,
    // FIX: Prevent duplicate queries by only enabling fallback when main query completed with no results
    // For canto books: only if canto lookup completed and found nothing
    // For non-canto books: only if main chapter query completed and found nothing
    enabled: !!book?.id && !!effectiveChapterParam && (
      (isCantoMode && !isLoadingCanto && !canto?.id) ||
      (!isCantoMode && !isLoadingChapter && !chapter)
    ),
    queryFn: async () => {
      if (!book?.id || !effectiveChapterParam) return null;
      const { data, error } = await supabase.rpc("get_chapter_by_number_with_preview", {
        p_book_id: book.id,
        p_canto_id: null,
        p_chapter_number: parseInt(effectiveChapterParam),
        p_token: previewToken
      });
      if (error) {
        console.error('RPC get_chapter_by_number_with_preview fallback error:', error);
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("chapters")
          .select("*")
          .eq("book_id", book.id)
          .eq("chapter_number", parseInt(effectiveChapterParam))
          .is("canto_id", null)
          .maybeSingle();
        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
      return data && data.length > 0 ? data[0] : null;
    }
  });

  // VERSES (main) - включає verse_lyrics для синхронізації аудіо, with preview token support
  const {
    data: versesMain = [],
    isLoading: isLoadingVersesMain
  } = useQuery({
    queryKey: ["verses", chapter?.id, previewToken],
    enabled: !!chapter?.id,
    queryFn: async () => {
      if (!chapter?.id) return [] as VerseData[];
      const { data, error } = await supabase.rpc("get_verses_by_chapter_with_preview", {
        p_chapter_id: chapter.id,
        p_token: previewToken
      });
      if (error) {
        console.error('RPC get_verses_by_chapter_with_preview error:', error);
        // Fallback for published verses with verse_lyrics
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("verses")
          .select(`
            *,
            is_composite,
            start_verse,
            end_verse,
            verse_count,
            sort_key,
            verse_lyrics (
              lrc_content,
              timestamps,
              language,
              sync_type,
              audio_type
            )
          `)
          .eq("chapter_id", chapter.id)
          .is("deleted_at", null)
          .order("sort_key", { ascending: true });
        if (fallbackError) throw fallbackError;
        return (fallbackData || []) as VerseData[];
      }
      return (data || []) as VerseData[];
    }
  });

  // VERSES (fallback) - включає verse_lyrics для синхронізації аудіо, with preview token support
  const {
    data: versesFallback = [],
    isLoading: isLoadingVersesFallback
  } = useQuery({
    queryKey: ["verses-fallback", fallbackChapter?.id, previewToken],
    enabled: !!fallbackChapter?.id,
    queryFn: async () => {
      if (!fallbackChapter?.id) return [] as VerseData[];
      const { data, error } = await supabase.rpc("get_verses_by_chapter_with_preview", {
        p_chapter_id: fallbackChapter.id,
        p_token: previewToken
      });
      if (error) {
        console.error('RPC get_verses_by_chapter_with_preview fallback error:', error);
        // Fallback for published verses with verse_lyrics
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("verses")
          .select(`
            *,
            is_composite,
            start_verse,
            end_verse,
            verse_count,
            sort_key,
            verse_lyrics (
              lrc_content,
              timestamps,
              language,
              sync_type,
              audio_type
            )
          `)
          .eq("chapter_id", fallbackChapter.id)
          .is("deleted_at", null)
          .order("sort_key", { ascending: true });
        if (fallbackError) throw fallbackError;
        return (fallbackData || []) as VerseData[];
      }
      return (data || []) as VerseData[];
    }
  });
  const verses = useMemo(() => versesMain && versesMain.length > 0 ? versesMain : versesFallback || [], [versesMain, versesFallback]);

  // ✅ FALLBACK: використовуємо fallbackChapter якщо chapter не знайдено
  // Це критично для SCC та інших книг де canto може не існувати в БД
  const effectiveChapter = chapter || fallbackChapter;
  const isLoading = isLoadingCanto || isLoadingChapter || isLoadingVersesMain || isLoadingVersesFallback;

  // Highlights hook - needs chapter.id
  const {
    highlights: chapterHighlights,
    createHighlight
  } = useHighlights(effectiveChapter?.id);

  // Reading session tracking
  const { trackVerseView } = useReadingSession({
    bookSlug: bookId || '',
    bookTitle: language === 'uk' ? book?.title_uk : book?.title_en,
    cantoNumber: cantoNumber ? parseInt(cantoNumber) : undefined,
    chapterNumber: parseInt(effectiveChapterParam || '1'),
    chapterTitle: language === 'uk' ? effectiveChapter?.title_uk : effectiveChapter?.title_en,
    totalVerses: verses.length,
    enabled: !!bookId && !!effectiveChapter,
  });

  // Track current verse view
  useEffect(() => {
    if (verses.length > 0 && currentVerseIndex >= 0) {
      const verse = verses[currentVerseIndex];
      if (verse) {
        trackVerseView(verse.verse_number);
      }
    }
  }, [currentVerseIndex, verses, trackVerseView]);

  // Reset the "verse not found" ref when URL changes
  useEffect(() => {
    lastNotFoundVerseRef.current = null;
  }, [routeVerseNumber]);

  // Jump to verse from URL if provided
  useEffect(() => {
    // Don't search for verse while data is still loading (prevents race condition with fallback)
    if (!routeVerseNumber || !verses.length || isLoading) return;
    let idx = verses.findIndex(v => String(v.id) === String(routeVerseNumber));
    if (idx === -1) {
      idx = verses.findIndex(v => String(v.verse_number) === String(routeVerseNumber));
    }
    if (idx === -1) {
      const num = parseInt(routeVerseNumber as string);
      if (!isNaN(num)) {
        idx = verses.findIndex(v => {
          // Check is_composite flag with start_verse/end_verse fields first
          if (v.is_composite && v.start_verse != null && v.end_verse != null) {
            return num >= v.start_verse && num <= v.end_verse;
          }
          // Fallback: check if verse_number contains hyphen (e.g., "46-47")
          const vn = String(v.verse_number);
          if (vn.includes('-')) {
            const [start, end] = vn.split('-').map(n => parseInt(n));
            return !isNaN(start) && !isNaN(end) && num >= start && num <= end;
          }
          // Check simple verse number as integer match
          const verseNum = parseInt(vn);
          return !isNaN(verseNum) && verseNum === num;
        });
      }
    }
    if (idx >= 0) {
      setCurrentVerseIndex(idx);
      // Verse found, reset the error ref in case it was set
      lastNotFoundVerseRef.current = null;
    } else {
      // Only show error toast if we haven't already shown it for this verse
      const verseKey = String(routeVerseNumber);
      if (lastNotFoundVerseRef.current !== verseKey) {
        lastNotFoundVerseRef.current = verseKey;
        console.warn(`Verse ${routeVerseNumber} not found in chapter`);
        toast({
          title: t("Вірш не знайдено", "Verse not found"),
          description: t(`Вірш ${routeVerseNumber} відсутній у цій главі`, `Verse ${routeVerseNumber} not found in this chapter`),
          variant: "destructive"
        });
      }
    }
  }, [routeVerseNumber, verses, t, isLoading]);

  // ALL CHAPTERS (для навігації між главами) - with preview token support
  const {
    data: allChapters = []
  } = useQuery({
    queryKey: isCantoMode 
      ? ["all-chapters-canto", canto?.id, previewToken] 
      : ["all-chapters-book", book?.id, previewToken],
    staleTime: 60_000,
    enabled: isCantoMode ? !!canto?.id : !!book?.id,
    queryFn: async () => {
      if (isCantoMode && canto?.id) {
        const { data, error } = await supabase.rpc("get_chapters_by_canto_with_preview", {
          p_canto_id: canto.id,
          p_token: previewToken
        });
        if (error) {
          console.error('RPC get_chapters_by_canto_with_preview error:', error);
          const { data: fallbackData } = await supabase
            .from("chapters")
            .select("id, chapter_number, title_uk, title_en")
            .eq("canto_id", canto.id)
            .order("chapter_number");
          return fallbackData || [];
        }
        return data || [];
      } else if (book?.id) {
        // For books without canto — use direct query (books without cantos are simpler)
        const { data, error } = await supabase
          .from("chapters")
          .select("id, chapter_number, title_uk, title_en")
          .eq("book_id", book.id)
          .order("chapter_number");
        if (error) throw error;
        return data || [];
      }
      return [];
    }
  });

  // Мутація для оновлення/створення вірша (upsert)
  const updateVerseMutation = useMutation({
    mutationFn: async ({
      verseId,
      updates,
      chapterId,
      verseNumber
    }: {
      verseId?: string;
      updates: Record<string, string | undefined>;
      chapterId?: string;
      verseNumber?: string;
    }) => {
      const payload: Record<string, string | undefined> = {};

      // Sanskrit - зберігати у відповідні поля
      if (updates.sanskrit_uk !== undefined) {
        payload.sanskrit_uk = updates.sanskrit_uk;
      }
      if (updates.sanskrit_en !== undefined) {
        payload.sanskrit_en = updates.sanskrit_en;
      }
      // Fallback для single mode
      if (updates.sanskrit !== undefined && updates.sanskrit_uk === undefined && updates.sanskrit_en === undefined) {
        if (language === "uk") {
          payload.sanskrit_uk = updates.sanskrit;
        } else {
          payload.sanskrit_en = updates.sanskrit;
        }
      }

      // Transliteration - зберігати в правильне поле
      if (updates.transliteration_uk !== undefined) {
        payload.transliteration_uk = updates.transliteration_uk;
      }
      if (updates.transliteration_en !== undefined) {
        payload.transliteration_en = updates.transliteration_en;
      }
      // Fallback для single mode
      if (updates.transliteration !== undefined && updates.transliteration_uk === undefined && updates.transliteration_en === undefined) {
        if (language === "uk") {
          payload.transliteration_uk = updates.transliteration;
        } else {
          payload.transliteration_en = updates.transliteration;
        }
      }

      // Synonyms - зберігати в правильне поле
      if (updates.synonyms_uk !== undefined) {
        payload.synonyms_uk = updates.synonyms_uk;
      }
      if (updates.synonyms_en !== undefined) {
        payload.synonyms_en = updates.synonyms_en;
      }
      // Fallback для single mode
      if (updates.synonyms !== undefined && updates.synonyms_uk === undefined && updates.synonyms_en === undefined) {
        if (language === "uk") {
          payload.synonyms_uk = updates.synonyms;
        } else {
          payload.synonyms_en = updates.synonyms;
        }
      }

      // Translation - зберігати в правильне поле
      if (updates.translation_uk !== undefined) {
        payload.translation_uk = updates.translation_uk;
      }
      if (updates.translation_en !== undefined) {
        payload.translation_en = updates.translation_en;
      }
      // Fallback для single mode
      if (updates.translation !== undefined && updates.translation_uk === undefined && updates.translation_en === undefined) {
        if (language === "uk") {
          payload.translation_uk = updates.translation;
        } else {
          payload.translation_en = updates.translation;
        }
      }

      // Commentary - зберігати в правильне поле
      if (updates.commentary_uk !== undefined) {
        payload.commentary_uk = updates.commentary_uk;
      }
      if (updates.commentary_en !== undefined) {
        payload.commentary_en = updates.commentary_en;
      }
      // Fallback для single mode
      if (updates.commentary !== undefined && updates.commentary_uk === undefined && updates.commentary_en === undefined) {
        if (language === "uk") {
          payload.commentary_uk = updates.commentary;
        } else {
          payload.commentary_en = updates.commentary;
        }
      }

      // ✅ UPSERT logic: update existing or create new verse
      if (verseId) {
        // Has verseId - simple update
        const result = await supabase.from("verses").update(payload).eq("id", verseId);
        if (result.error) throw result.error;
      } else {
        // No verseId - try to find by chapter_id + verse_number, or create new
        if (!chapterId || !verseNumber) {
          throw new Error("Cannot upsert verse without chapter_id and verse_number");
        }
        const {
          data: existingVerse
        } = await supabase.from("verses").select("id").eq("chapter_id", chapterId).eq("verse_number", verseNumber).maybeSingle();
        if (existingVerse) {
          // Verse exists, update it
          const result = await supabase.from("verses").update(payload).eq("id", existingVerse.id);
          if (result.error) throw result.error;
        } else {
          // Verse doesn't exist, create new one
          const result = await supabase.from("verses").insert({
            ...payload,
            chapter_id: chapterId,
            verse_number: verseNumber
          });
          if (result.error) throw result.error;
        }
      }
    },
    onSuccess: () => {
      // Очищуємо кеш для обох query keys (основний і fallback)
      queryClient.invalidateQueries({
        queryKey: ["verses"]
      });
      toast({
        title: t("Збережено", "Saved"),
        description: t("Вірш оновлено", "Verse updated")
      });
    },
    onError: (err: Error) => {
      toast({
        title: t("Помилка", "Error"),
        description: err.message,
        variant: "destructive"
      });
    }
  });

  // Мутація для видалення вірша
  const deleteVerseMutation = useMutation({
    mutationFn: async (verseId: string) => {
      const { error } = await supabase
        .from("verses")
        .delete()
        .eq("id", verseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verses"] });
      toast({
        title: t("Видалено", "Deleted"),
        description: t("Вірш видалено з бази даних", "Verse deleted from database")
      });
      // Якщо видалили поточний вірш, переходимо до попереднього або наступного
      if (currentVerseIndex > 0) {
        handlePrevVerse();
      } else if (verses.length > 1) {
        handleNextVerse();
      }
    },
    onError: (err: Error) => {
      toast({
        title: t("Помилка видалення", "Delete error"),
        description: err.message,
        variant: "destructive"
      });
    }
  });

  const bookTitle = language === "uk" ? book?.title_uk : book?.title_en;
  const cantoTitle = canto ? language === "uk" ? canto.title_uk : canto.title_en : null;

  // Special handling for NOI: display "Text X" instead of chapter title
  let chapterTitle = effectiveChapter ? language === "uk" ? effectiveChapter.title_uk : effectiveChapter.title_en : null;
  if (bookId === 'noi' && routeVerseNumber) {
    chapterTitle = language === 'uk' ? `Текст ${routeVerseNumber}` : `Text ${routeVerseNumber}`;
  }
  const currentChapterIndex = allChapters.findIndex(ch => ch.id === effectiveChapter?.id);
  const currentVerse = verses[currentVerseIndex];

  // 🆕 Bookmark функція
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? t("Закладку видалено", "Bookmark removed") : t("Додано до закладок", "Added to bookmarks"),
      description: chapterTitle
    });
  };

  // 🆕 Share функція - тепер ділиться текстом вірша з посиланням
  const handleShare = async () => {
    if (!currentVerse) {
      // Fallback to old behavior if no verse
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: `${bookTitle} - ${chapterTitle}`,
          url
        });
      } else {
        navigator.clipboard.writeText(url);
        toast({
          title: t("Посилання скопійовано", "Link copied"),
          description: url
        });
      }
      return;
    }

    const verseIdx = getDisplayVerseNumber(currentVerse.verse_number);
    const verseParams: VerseParams = {
      bookSlug: bookId || "",
      bookTitle: bookTitle,
      cantoNumber: cantoNumber ? parseInt(cantoNumber) : undefined,
      chapterNumber: parseInt(effectiveChapterParam || "1"),
      verseNumber: verseIdx,
      verseText: language === 'uk' ? currentVerse.translation_uk : currentVerse.translation_en,
      sanskritText: currentVerse.text,
    };

    await shareVerse(verseParams, {
      lang: language as "uk" | "en",
      onSuccess: () => {
        toast({
          title: t("Поділено успішно", "Shared successfully"),
        });
      },
      onFallbackCopy: () => {
        toast({
          title: t("Текст скопійовано!", "Text copied!"),
          description: t("Вставте куди потрібно", "Paste where needed"),
        });
      },
      onError: (error) => {
        console.error("Share failed:", error);
        toast({
          title: t("Помилка поширення", "Share error"),
          variant: "destructive",
        });
      },
    });
  };

  // 🆕 Copy with link функція - копіює текст вірша з посиланням
  const handleCopyWithLink = async () => {
    if (!currentVerse) {
      toast({
        title: t("Немає поточного вірша", "No current verse"),
        variant: "destructive",
      });
      return;
    }

    const verseIdx = getDisplayVerseNumber(currentVerse.verse_number);
    const verseParams: VerseParams = {
      bookSlug: bookId || "",
      bookTitle: bookTitle,
      cantoNumber: cantoNumber ? parseInt(cantoNumber) : undefined,
      chapterNumber: parseInt(effectiveChapterParam || "1"),
      verseNumber: verseIdx,
      verseText: language === 'uk' ? currentVerse.translation_uk : currentVerse.translation_en,
      sanskritText: currentVerse.text,
    };

    await copyVerseWithLink(verseParams, {
      lang: language as "uk" | "en",
      onSuccess: () => {
        toast({
          title: t("Скопійовано з посиланням", "Copied with link"),
          description: t("Текст вірша та URL скопійовано", "Verse text and URL copied"),
        });
      },
      onError: (error) => {
        console.error("Copy failed:", error);
        toast({
          title: t("Помилка копіювання", "Copy error"),
          variant: "destructive",
        });
      },
    });
  };

  // 🆕 Copy URL only
  const handleCopyUrl = async () => {
    if (!currentVerse) {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: t("Посилання скопійовано", "Link copied"),
      });
      return;
    }

    const verseIdx = getDisplayVerseNumber(currentVerse.verse_number);
    const verseParams: VerseParams = {
      bookSlug: bookId || "",
      cantoNumber: cantoNumber ? parseInt(cantoNumber) : undefined,
      chapterNumber: parseInt(effectiveChapterParam || "1"),
      verseNumber: verseIdx,
    };

    await copyVerseUrl(verseParams, {
      onSuccess: () => {
        toast({
          title: t("Посилання скопійовано", "Link copied"),
        });
      },
      onError: () => {
        // Fallback
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: t("Посилання скопійовано", "Link copied"),
        });
      },
    });
  };

  // 🆕 Download функція - відкриває сторінку експорту з параметрами поточної глави
  const handleDownload = () => {
    if (!effectiveChapter?.id) {
      toast({
        title: t("Помилка", "Error"),
        description: t("Глава не завантажена", "Chapter not loaded")
      });
      return;
    }

    // Формуємо URL з параметрами для експорту
    const params = new URLSearchParams();
    if (bookId) params.set('book', bookId);
    if (canto?.id) params.set('canto', canto.id);
    if (effectiveChapter.id) params.set('chapter', effectiveChapter.id);

    navigate(`/admin/book-export?${params.toString()}`);
  };

  // 🆕 Add verse to learning
  const handleAddToLearning = () => {
    if (!currentVerse) {
      sonnerToast.error(t("Немає поточного вірша", "No current verse"));
      return;
    }

    // Check if already in learning list
    if (isVerseInLearningList(currentVerse.id)) {
      sonnerToast.info(t("Вірш вже в списку для вивчення", "Verse already in learning list"));
      return;
    }

    // Determine full verse number
    const verseIdx = getDisplayVerseNumber(currentVerse.verse_number);
    const fullVerseNumber = isCantoMode ? `${cantoNumber}.${chapterNumber}.${verseIdx}` : `${effectiveChapter?.chapter_number || effectiveChapterParam}.${verseIdx}`;

    // Create learning verse object
    const learningVerse = {
      verseId: currentVerse.id,
      verseNumber: fullVerseNumber,
      bookName: bookTitle || "",
      bookSlug: bookId,
      cantoNumber: cantoNumber,
      chapterNumber: isCantoMode ? chapterNumber : effectiveChapter?.chapter_number?.toString(),
      sanskritText: currentVerse.text || "",
      transliteration: currentVerse.transliteration || undefined,
      translation: language === 'uk' ? currentVerse.translation_uk || "" : currentVerse.translation_en || "",
      commentary: language === 'uk' ? currentVerse.commentary_uk || undefined : currentVerse.commentary_en || undefined,
      audioUrl: currentVerse.full_verse_audio_url || currentVerse.audio_url || undefined,
      audioSanskrit: currentVerse.recitation_audio_url || undefined,
      audioTranslation: language === 'uk'
        ? currentVerse.explanation_uk_audio_url || undefined
        : currentVerse.explanation_en_audio_url || undefined
    };
    const added = addLearningVerse(learningVerse);
    if (added) {
      sonnerToast.success(t(`Додано до вивчення: ${fullVerseNumber}`, `Added to learning: ${fullVerseNumber}`));
    } else {
      sonnerToast.error(t("Помилка додавання вірша", "Error adding verse"));
    }
  };

  // 🆕 Text selection handler - shows tooltip instead of dialog
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTextSelection = useCallback(() => {
    // Clear any pending timeout
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
      selectionTimeoutRef.current = null;
    }

    // ✅ ПЕРЕВІРКА 1: Чи не в режимі редагування?
    const editableElement = document.activeElement as HTMLElement;
    if (editableElement?.tagName === 'TEXTAREA' || editableElement?.tagName === 'INPUT' || editableElement?.contentEditable === 'true' || editableElement?.closest('[contenteditable="true"]')) {
      return;
    }

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    // ✅ ПЕРЕВІРКА 2: Чи достатньо тексту? (мінімум 10 символів)
    if (!selectedText || selectedText.length < 10) {
      return;
    }

    // ✅ ПЕРЕВІРКА 3: Чи це не одне слово?
    // Використовуємо regex \s для перевірки будь-яких пробільних символів,
    // включаючи нерозривні пробіли (U+00A0) з EPUB/HTML форматування
    if (!/\s/.test(selectedText)) {
      return;
    }

    // Get selection position for tooltip
    const range = selection?.getRangeAt(0);
    if (!range) return;

    // ✅ ВИПРАВЛЕНО: Використовуємо getClientRects() для точнішого позиціонування
    // при виділенні через кілька елементів (як в DualLanguageText)
    const rects = range.getClientRects();
    let tooltipX: number;
    let tooltipY: number;

    if (rects.length > 0) {
      // Використовуємо перший прямокутник для позиції (початок виділення)
      const firstRect = rects[0];
      tooltipX = firstRect.left + firstRect.width / 2;
      // ✅ ВИПРАВЛЕНО: НЕ додаємо window.scrollY - tooltip використовує position: fixed (viewport-relative)
      tooltipY = firstRect.top;
    } else {
      // Fallback на getBoundingClientRect
      const rect = range.getBoundingClientRect();
      tooltipX = rect.left + rect.width / 2;
      tooltipY = rect.top;
    }

    // ✅ ВИПРАВЛЕНО: Безпечне отримання контексту для multi-element selections
    let before = '';
    let after = '';

    try {
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;

      // Отримуємо текст до виділення
      if (startContainer.nodeType === Node.TEXT_NODE) {
        const text = startContainer.textContent || '';
        before = text.substring(Math.max(0, range.startOffset - 50), range.startOffset);
      }

      // Отримуємо текст після виділення
      if (endContainer.nodeType === Node.TEXT_NODE) {
        const text = endContainer.textContent || '';
        after = text.substring(range.endOffset, Math.min(text.length, range.endOffset + 50));
      }
    } catch (e) {
      // Ігноруємо помилки контексту - вони не критичні
      console.warn('Could not extract selection context:', e);
    }

    // ✅ Довша затримка (700ms) - дає час для копіювання без перешкод
    selectionTimeoutRef.current = setTimeout(() => {
      const currentSelection = window.getSelection()?.toString().trim();
      // Only show tooltip if selection is still the same
      if (currentSelection === selectedText) {
        setSelectedTextForHighlight(selectedText);
        setSelectionContext({ before, after });
        setSelectionTooltipPosition({ x: tooltipX, y: tooltipY });
        setSelectionTooltipVisible(true);
      }
    }, 700);
  }, []);

  // Hide tooltip when selection is cleared (but don't cancel pending timeout)
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    // Only hide VISIBLE tooltip if selection is cleared
    // Don't cancel pending timeout - let it complete and check selection then
    if (!selectedText || selectedText.length < 10) {
      setSelectionTooltipVisible(false);
    }
  }, []);

  // Handler for opening dialog from tooltip
  const handleOpenHighlightDialog = useCallback(() => {
    setSelectionTooltipVisible(false);
    setHighlightDialogOpen(true);
  }, []);

  // Handler for copying selected text with verse reference
  const handleCopySelectedText = useCallback(async () => {
    if (!selectedTextForHighlight || !currentVerse) return;

    const verseIdx = getDisplayVerseNumber(currentVerse.verse_number);
    const verseParams: VerseParams = {
      bookSlug: bookId || "",
      bookTitle: bookTitle,
      cantoNumber: cantoNumber ? parseInt(cantoNumber) : undefined,
      chapterNumber: parseInt(effectiveChapterParam || "1"),
      verseNumber: verseIdx,
      verseText: selectedTextForHighlight,
    };

    await copyVerseWithLink(verseParams, {
      lang: language as "uk" | "en",
      onSuccess: () => {
        toast({
          title: t("Скопійовано з посиланням", "Copied with link"),
        });
      },
    });
  }, [selectedTextForHighlight, currentVerse, bookId, bookTitle, cantoNumber, effectiveChapterParam, language, t]);

  // Handler for sharing selected text
  const handleShareSelectedText = useCallback(async () => {
    if (!selectedTextForHighlight || !currentVerse) return;

    const verseIdx = getDisplayVerseNumber(currentVerse.verse_number);
    const verseParams: VerseParams = {
      bookSlug: bookId || "",
      bookTitle: bookTitle,
      cantoNumber: cantoNumber ? parseInt(cantoNumber) : undefined,
      chapterNumber: parseInt(effectiveChapterParam || "1"),
      verseNumber: verseIdx,
      verseText: selectedTextForHighlight,
    };

    await shareVerse(verseParams, {
      lang: language as "uk" | "en",
      onFallbackCopy: () => {
        toast({
          title: t("Скопійовано з посиланням", "Copied with link"),
        });
      },
    });
  }, [selectedTextForHighlight, currentVerse, bookId, bookTitle, cantoNumber, effectiveChapterParam, language, t]);

  // Mouseup and selectionchange listeners for highlights
  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleTextSelection, handleSelectionChange]);

  // Keyboard navigation (← →) is now handled via useKeyboardShortcuts below
  const handlePrevVerse = () => {
    if (currentVerseIndex > 0) {
      const prevVerse = verses[currentVerseIndex - 1];
      const urlVerseNumber = String(prevVerse.verse_number).includes('-') ? String(prevVerse.verse_number).split('-')[0] : prevVerse.verse_number;
      const path = bookId === 'noi' ? `/lib/noi/${urlVerseNumber}` : isCantoMode ? `/lib/${bookId}/${cantoNumber}/${chapterNumber}/${urlVerseNumber}` : `/lib/${bookId}/${effectiveChapterParam}/${urlVerseNumber}`;
      navigate(getLocalizedPath(path));
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else if (currentChapterIndex > 0) {
      // Перехід до попередньої глави (останній вірш)
      handlePrevChapter();
    }
  };
  const handleNextVerse = () => {
    if (currentVerseIndex < verses.length - 1) {
      const nextVerse = verses[currentVerseIndex + 1];
      const urlVerseNumber = String(nextVerse.verse_number).includes('-') ? String(nextVerse.verse_number).split('-')[0] : nextVerse.verse_number;
      const path = bookId === 'noi' ? `/lib/noi/${urlVerseNumber}` : isCantoMode ? `/lib/${bookId}/${cantoNumber}/${chapterNumber}/${urlVerseNumber}` : `/lib/${bookId}/${effectiveChapterParam}/${urlVerseNumber}`;
      navigate(getLocalizedPath(path));
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else if (currentChapterIndex < allChapters.length - 1) {
      // Перехід до наступної глави (перший вірш)
      handleNextChapter();
    }
  };
  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      const prevChapter = allChapters[currentChapterIndex - 1];
      const path = isCantoMode ? `/lib/${bookId}/${cantoNumber}/${prevChapter.chapter_number}` : `/lib/${bookId}/${prevChapter.chapter_number}`;
      navigate(getLocalizedPath(path));
      setCurrentVerseIndex(0);
    }
  };
  const handleNextChapter = () => {
    if (currentChapterIndex < allChapters.length - 1) {
      const nextChapter = allChapters[currentChapterIndex + 1];
      const path = isCantoMode ? `/lib/${bookId}/${cantoNumber}/${nextChapter.chapter_number}` : `/lib/${bookId}/${nextChapter.chapter_number}`;
      navigate(getLocalizedPath(path));
      setCurrentVerseIndex(0);
    }
  };

  // Swipe navigation for mobile
  const swipeState = useSwipeNavigation({
    onSwipeLeft: handleNextVerse,
    onSwipeRight: handlePrevVerse,
    threshold: 80,
    velocityThreshold: 0.3,
    enabled: !continuousReadingSettings.enabled, // Disable in continuous mode to allow scrolling
  });

  // Trackpad navigation for desktop (especially in presentation mode)
  useTrackpadNavigation({
    onSwipeLeft: handleNextVerse,
    onSwipeRight: handlePrevVerse,
    threshold: 50,
    enabled: presentationMode || zenMode, // Enable in presentation/zen modes
  });

  // Scroll direction for auto-hide header (mobile)
  const scrollDirection = useScrollDirection({ threshold: 15 });
  const isHeaderHidden = scrollDirection === 'down' && !fullscreenMode && !zenMode;

  const handleSaveHighlight = useCallback((notes: string, color: string) => {
    // Перевірка наявності даних
    if (!book?.id || !effectiveChapter?.id) {
      console.error("handleSaveHighlight: Missing book or chapter data", { bookId: book?.id, chapterId: effectiveChapter?.id });
      sonnerToast.error(t("Помилка: дані книги ще завантажуються", "Error: book data is still loading"));
      return;
    }

    // Перевірка наявності виділеного тексту
    if (!selectedTextForHighlight) {
      console.error("handleSaveHighlight: No selected text");
      sonnerToast.error(t("Немає виділеного тексту", "No selected text"));
      return;
    }

    createHighlight({
      book_id: book.id,
      canto_id: canto?.id,
      chapter_id: effectiveChapter.id,
      verse_id: currentVerse?.id,
      verse_number: currentVerse?.verse_number,
      selected_text: selectedTextForHighlight,
      context_before: selectionContext.before,
      context_after: selectionContext.after,
      notes: notes || undefined,
      highlight_color: color || "yellow"
    });
  }, [book, canto, effectiveChapter, currentVerse, selectedTextForHighlight, selectionContext, createHighlight, t]);

  // ✅ Apply saved highlights visually to the DOM after render
  useLayoutEffect(() => {
    if (!chapterHighlights || chapterHighlights.length === 0) return;

    // Small delay to ensure VerseCard has finished rendering
    const timer = setTimeout(() => {
      const container = document.querySelector('[data-reader-root]');
      if (!container) return;

      // Clean up previous highlight marks
      container.querySelectorAll('mark[data-hl]').forEach(mark => {
        const parent = mark.parentNode;
        if (parent) {
          while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
          parent.removeChild(mark);
        }
        parent?.normalize();
      });

      // Filter highlights for current verse (if in single verse mode)
      const verseHighlights = currentVerse
        ? chapterHighlights.filter(h => h.verse_id === currentVerse.id || !h.verse_id)
        : chapterHighlights;

      for (const hl of verseHighlights) {
        const searchText = hl.selected_text;
        if (!searchText || searchText.length < 5) continue;

        // Use first 80 chars for matching (highlights can be long)
        const searchFragment = searchText.substring(0, 80).trim();

        const walker = document.createTreeWalker(
          container,
          NodeFilter.SHOW_TEXT,
          null
        );

        let textNode: Text | null;
        while ((textNode = walker.nextNode() as Text | null)) {
          const nodeText = textNode.textContent || '';
          const index = nodeText.indexOf(searchFragment);
          if (index === -1) continue;

          const highlightEnd = Math.min(nodeText.length, index + searchText.length);

          try {
            const range = document.createRange();
            range.setStart(textNode, index);
            range.setEnd(textNode, highlightEnd);

            const mark = document.createElement('mark');
            mark.dataset.hl = hl.id;
            mark.className = `hl-${hl.highlight_color || 'yellow'}`;
            range.surroundContents(mark);
          } catch {
            // surroundContents fails if range crosses element boundaries — skip
          }

          break; // Only highlight first occurrence per highlight
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [chapterHighlights, currentVerse]);

  // Визначити всі keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = [
  // Navigation
  {
    key: 'j',
    description: t('Наступний вірш', 'Next verse'),
    handler: handleNextVerse,
    category: 'navigation'
  }, {
    key: 'k',
    description: t('Попередній вірш', 'Previous verse'),
    handler: handlePrevVerse,
    category: 'navigation'
  }, {
    key: '[',
    description: t('Попередня глава', 'Previous chapter'),
    handler: handlePrevChapter,
    category: 'navigation'
  }, {
    key: ']',
    description: t('Наступна глава', 'Next chapter'),
    handler: handleNextChapter,
    category: 'navigation'
  },
  // Display toggles
  {
    key: '1',
    description: t('Показати/Сховати Санскрит', 'Toggle Sanskrit'),
    handler: () => setTextDisplaySettings(prev => ({
      ...prev,
      showSanskrit: !prev.showSanskrit
    })),
    category: 'display'
  }, {
    key: '2',
    description: t('Показати/Сховати Транслітерацію', 'Toggle Transliteration'),
    handler: () => setTextDisplaySettings(prev => ({
      ...prev,
      showTransliteration: !prev.showTransliteration
    })),
    category: 'display'
  }, {
    key: '3',
    description: t('Показати/Сховати Послівний переклад', 'Toggle Synonyms'),
    handler: () => setTextDisplaySettings(prev => ({
      ...prev,
      showSynonyms: !prev.showSynonyms
    })),
    category: 'display'
  }, {
    key: '4',
    description: t('Показати/Сховати Переклад', 'Toggle Translation'),
    handler: () => setTextDisplaySettings(prev => ({
      ...prev,
      showTranslation: !prev.showTranslation
    })),
    category: 'display'
  }, {
    key: '5',
    description: t('Показати/Сховати Пояснення', 'Toggle Commentary'),
    handler: () => setTextDisplaySettings(prev => ({
      ...prev,
      showCommentary: !prev.showCommentary
    })),
    category: 'display'
  },
  // Font controls
  {
    key: '}',
    description: t('Збільшити шрифт', 'Increase font size'),
    handler: () => {
      increaseFont();
      increaseFont(); // +2px як було раніше
    },
    category: 'font'
  }, {
    key: '{',
    description: t('Зменшити шрифт', 'Decrease font size'),
    handler: () => {
      decreaseFont();
      decreaseFont(); // -2px як було раніше
    },
    category: 'font'
  },
  // Modes
  {
    key: 'd',
    description: t('Двомовний режим', 'Dual language mode'),
    handler: () => {
      const newMode = !dualLanguageMode;
      setDualLanguageMode(newMode);
      localStorage.setItem("vv_reader_dualMode", String(newMode));
    },
    category: 'modes'
  }, {
    key: 'c',
    description: t('Безперервне читання', 'Continuous reading'),
    handler: () => {
      const newSettings = {
        ...continuousReadingSettings,
        enabled: !continuousReadingSettings.enabled
      };
      setContinuousReadingSettings(newSettings);
      window.dispatchEvent(new Event("vv-reader-prefs-changed"));
    },
    category: 'modes'
  },
  // Navigation - Jump to verse
  {
    key: 'g',
    description: t('Перейти до вірша (go to)', 'Go to verse'),
    handler: () => setShowJumpDialog(true),
    category: 'navigation'
  },
  // Fullscreen
  {
    key: 'f',
    description: t('Повноекранний режим', 'Fullscreen mode'),
    handler: () => setFullscreenMode(prev => !prev),
    category: 'modes'
  },
  // Zen Mode
  {
    key: 'z',
    description: t('Zen режим (максимальний фокус)', 'Zen mode (maximum focus)'),
    handler: () => setZenMode(prev => !prev),
    category: 'modes'
  },
  // Presentation Mode
  {
    key: 'p',
    description: t('Презентація (для проектора/ТВ)', 'Presentation (for projector/TV)'),
    handler: () => setPresentationMode(prev => !prev),
    category: 'modes'
  },
  // Help
  {
    key: '?',
    description: t('Показати клавіатурні скорочення', 'Show keyboard shortcuts'),
    handler: () => setShowKeyboardShortcuts(prev => !prev),
    category: 'help'
  }, {
    key: 'Escape',
    description: t('Закрити модальне вікно / Вийти з режиму', 'Close modal / Exit mode'),
    handler: () => {
      if (presentationMode) {
        setPresentationMode(false);
      } else if (zenMode) {
        setZenMode(false);
      } else if (fullscreenMode) {
        setFullscreenMode(false);
      } else {
        setShowKeyboardShortcuts(false);
        setShowJumpDialog(false);
        setSettingsOpen(false);
      }
    },
    category: 'help'
  },
  // Arrow key navigation
  {
    key: 'ArrowRight',
    description: t('Наступний вірш', 'Next verse'),
    handler: handleNextVerse,
    category: 'navigation'
  },
  {
    key: 'ArrowLeft',
    description: t('Попередній вірш', 'Previous verse'),
    handler: handlePrevVerse,
    category: 'navigation'
  },
  {
    key: 'ArrowDown',
    description: t('Наступний вірш', 'Next verse'),
    handler: handleNextVerse,
    category: 'navigation'
  },
  {
    key: 'ArrowUp',
    description: t('Попередній вірш', 'Previous verse'),
    handler: handlePrevVerse,
    category: 'navigation'
  }];

  // Активувати keyboard shortcuts
  useKeyboardShortcuts({
    enabled: true,
    shortcuts
  });

  // Скелетон-завантаження
  if (isLoading) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">{t("Завантаження...", "Loading...")}</p>
        </div>
      </div>;
  }
  if (!effectiveChapter) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="mb-4 text-muted-foreground">{t("Немає даних для цієї глави", "No data for this chapter")}</p>
          <Button variant="outline" onClick={() => navigate(getLocalizedPath(isCantoMode ? `/lib/${bookId}/${cantoNumber}` : `/lib/${bookId}`))}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("Назад", "Back")}
          </Button>
        </div>
      </div>;
  }
  // Determine text chapter by actual verse count, not by chapter_type field
  // This prevents display issues when chapter_type is incorrectly set
  const isTextChapter = verses.length === 0;

  // ✅ fontSize керується через useReaderSettings → оновлює CSS змінну --vv-reader-font-size
  // Не потрібно встановлювати inline font-size на контейнер

  return <div className="min-h-screen bg-background">

      <Header />

      {/* 🆕 Sticky Breadcrumbs - прилипає під хедером, ховається при скролі вниз на мобільних */}
      {/* Hidden on mobile via CSS for clean reading */}
      <div className={`hidden md:block sticky top-[65px] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ${isHeaderHidden ? '-translate-y-full md:translate-y-0' : 'translate-y-0'}`}>
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
            {/* Row 1: Breadcrumbs + Icons */}
            <div className="flex items-center justify-between gap-2">
              {/* Breadcrumbs - responsive with overflow handling */}
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground min-w-0 overflow-hidden">
                <a href={getLocalizedPath("/library")} className="hover:text-foreground transition-colors flex items-center gap-1 flex-shrink-0">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("Бібліотека", "Library")}</span>
                </a>
                <span className="flex-shrink-0">›</span>
                <a href={getLocalizedPath(`/lib/${bookId}`)} className="hover:text-foreground transition-colors truncate max-w-[60px] sm:max-w-none">
                  {bookTitle}
                </a>
                {cantoTitle && <>
                    <span className="flex-shrink-0">›</span>
                    <a href={getLocalizedPath(`/lib/${bookId}/${cantoNumber}`)} className="hover:text-foreground transition-colors truncate max-w-[40px] sm:max-w-none">
                      {cantoTitle}
                    </a>
                  </>}
                <span className="flex-shrink-0">›</span>
                <span className="text-foreground font-medium truncate">{chapterTitle}</span>
              </div>

              {/* Icons - hidden on mobile (use Spine navigation instead) */}
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={handleAddToLearning} disabled={!currentVerse} title={t("Додати до вивчення", "Add to learning")}>
                  <GraduationCap className={`h-5 w-5 ${currentVerse && isVerseInLearningList(currentVerse.id) ? "fill-primary text-primary" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleBookmark} title={t("Закладка", "Bookmark")}>
                  <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
                </Button>
                {isAdmin && <Button variant="ghost" size="icon" onClick={() => navigate("/admin/highlights")} title={t("Виділення", "Highlights")}>
                    <Highlighter className="h-5 w-5" />
                  </Button>}
                <Button variant="ghost" size="icon" onClick={handleCopyWithLink} disabled={!currentVerse} title={t("Копіювати з посиланням", "Copy with link")}>
                  <Copy className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCopyUrl} title={t("Копіювати посилання", "Copy link")}>
                  <Link className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleShare} title={t("Поділитися", "Share")}>
                  <Share2 className="h-5 w-5" />
                </Button>
                {isAdmin && (
                  <Button variant="ghost" size="icon" onClick={handleDownload} title={t("Експорт глави", "Export chapter")} className="text-primary">
                    <Download className="h-5 w-5" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setShowKeyboardShortcuts(true)} title={t("Клавіатурні скорочення (?)", "Keyboard shortcuts (?)")}>
                  <HelpCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setPresentationMode(!presentationMode)} title={t("Презентація (p)", "Presentation (p)")}>
                  <Presentation className={`h-5 w-5 ${presentationMode ? "text-primary" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setZenMode(!zenMode)} title={t("Zen режим (z)", "Zen mode (z)")}>
                  <Leaf className={`h-5 w-5 ${zenMode ? "text-primary" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setFullscreenMode(!fullscreenMode)} title={t("Повноекранний режим (f)", "Fullscreen mode (f)")}>
                  <Maximize className={`h-5 w-5 ${fullscreenMode ? "text-primary" : ""}`} />
                </Button>
                <Button variant={dualLanguageMode ? "secondary" : "ghost"} size="icon" onClick={() => setDualLanguageMode(!dualLanguageMode)} title={t("Двомовний режим", "Dual language")}>
                  <Languages className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Row 2: Chapter/Verse Selector - окремий рядок по центру */}
            {!continuousReadingSettings.enabled && !isTextChapter && verses.length > 0 && (
              <div className="flex justify-center mt-1">
                <ChapterVerseSelector
                  chapters={allChapters}
                  verses={verses}
                  currentChapterIndex={currentChapterIndex}
                  currentVerseIndex={currentVerseIndex}
                  bookId={bookId}
                  cantoNumber={cantoNumber}
                  isCantoMode={isCantoMode}
                />
              </div>
            )}
          </div>
        </div>

      <div className="container mx-auto px-4 pt-2 pb-4 md:pt-2 md:pb-8" data-reader-root="true">
        {/* Заголовок - тільки для безперервного читання або текстових глав */}
        {(continuousReadingSettings.enabled || isTextChapter) && <div className="mb-4 md:mb-8">
            <h1 className="text-center font-extrabold text-3xl md:text-5xl text-primary">{chapterTitle}</h1>
          </div>}

        {/* Intro/preface block (render above verses if present) */}
        {(language === "uk" ? effectiveChapter.content_uk : effectiveChapter.content_en) && !isTextChapter && (
          <div className="verse-surface mb-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <TiptapRenderer content={language === "uk" ? effectiveChapter.content_uk || "" : effectiveChapter.content_en || ""} />
            </div>
          </div>
        )}

        {/* Main content rendering */}
        {isTextChapter ? (
          <div className="verse-surface">
            {/* Навігація зверху для текстових глав - ховаємо на мобільних (є свайп) */}
            {!isMobile && (
              <div className="mb-8 flex items-center justify-between pb-6">
                <Button variant="outline" onClick={handlePrevChapter} disabled={currentChapterIndex === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {t("Попередня глава", "Previous Chapter")}
                </Button>
                <Button variant="outline" onClick={handleNextChapter} disabled={currentChapterIndex === allChapters.length - 1}>
                  {t("Наступна глава", "Next Chapter")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <TiptapRenderer content={language === "uk" ? effectiveChapter.content_uk || "" : effectiveChapter.content_en || effectiveChapter.content_uk || ""} />
            </div>
            {/* Навігація знизу для текстових глав - ховаємо на мобільних (є свайп) */}
            {!isMobile && (
              <div className="mt-8 flex items-center justify-between pt-6">
                <Button variant="outline" onClick={handlePrevChapter} disabled={currentChapterIndex === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {t("Попередня глава", "Previous Chapter")}
                </Button>
                <Button variant="outline" onClick={handleNextChapter} disabled={currentChapterIndex === allChapters.length - 1}>
                  {t("Наступна глава", "Next Chapter")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : continuousReadingSettings.enabled ? (
          <div className="space-y-8">
            {verses.filter(Boolean).map(verse => {
              const verseIdx = getDisplayVerseNumber(verse.verse_number);
              const fullVerseNumber = isCantoMode
                ? `${cantoNumber}.${chapterNumber}.${verseIdx}`
                : `${effectiveChapter?.chapter_number || effectiveChapterParam}.${verseIdx}`;
              const contSettings = {
                showSanskrit: continuousReadingSettings.showSanskrit,
                showTransliteration: continuousReadingSettings.showTransliteration,
                showSynonyms: continuousReadingSettings.showSynonyms,
                showTranslation: continuousReadingSettings.showTranslation,
                showCommentary: continuousReadingSettings.showCommentary
              };

              return dualLanguageMode && !isMobile ? (
                <DualLanguageVerseCard
                  key={verse.id}
                  verseId={verse.id}
                  verseNumber={fullVerseNumber}
                  bookName={chapterTitle || undefined}
                  bookSlug={bookId}
                  sanskritTextUk={cleanSanskrit(verse.sanskrit_uk || verse.sanskrit || "")}
                  sanskritTextEn={cleanSanskrit(verse.sanskrit_en || verse.sanskrit || "")}
                  transliterationUk={verse.transliteration_uk || ""}
                  synonymsUk={verse.synonyms_uk || ""}
                  translationUk={verse.translation_uk || ""}
                  commentaryUk={verse.commentary_uk || ""}
                  transliterationEn={verse.transliteration_en || ""}
                  synonymsEn={verse.synonyms_en || ""}
                  translationEn={verse.translation_en || ""}
                  commentaryEn={verse.commentary_en || ""}
                  audioUrl={verse.full_verse_audio_url || verse.audio_url || ""}
                  audioSanskrit={verse.recitation_audio_url || ""}
                  audioTranslationUk={verse.explanation_uk_audio_url || ""}
                  audioTranslationEn={verse.explanation_en_audio_url || ""}
                  audioCommentaryUk={verse.explanation_uk_audio_url || ""}
                  audioCommentaryEn={verse.explanation_en_audio_url || ""}
                  textDisplaySettings={contSettings}
                  isAdmin={isAdmin}
                  showNumbers={showNumbers}
                  fontSize={fontSize}
                  lineHeight={lineHeight}
                  onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({
                    verseId,
                    updates,
                    chapterId: effectiveChapter?.id,
                    verseNumber: verse.verse_number
                  })}
                  onVerseDelete={(verseId) => deleteVerseMutation.mutate(verseId)}
                />
              ) : (
                <VerseCard
                  key={verse.id}
                  verseId={verse.id}
                  verseNumber={fullVerseNumber}
                  bookName={chapterTitle}
                  bookSlug={bookId}
                  sanskritText={cleanSanskrit(language === "uk" ? verse.sanskrit_uk || verse.sanskrit || "" : verse.sanskrit_en || verse.sanskrit || "")}
                  transliteration={language === "uk" ? verse.transliteration_uk || "" : verse.transliteration_en || ""}
                  synonyms={getTranslationWithFallback(verse, 'synonyms')}
                  translation={getTranslationWithFallback(verse, 'translation')}
                  commentary={getTranslationWithFallback(verse, 'commentary')}
                  audioUrl={verse.full_verse_audio_url || verse.audio_url || ""}
                  audioSanskrit={verse.recitation_audio_url || ""}
                  audioTranslation={language === "uk" ? verse.explanation_uk_audio_url || "" : verse.explanation_en_audio_url || ""}
                  audioCommentary={language === "uk" ? verse.explanation_uk_audio_url || "" : verse.explanation_en_audio_url || ""}
                  
                  is_composite={verse.is_composite}
                  start_verse={verse.start_verse}
                  end_verse={verse.end_verse}
                  verse_count={verse.verse_count}
                  textDisplaySettings={contSettings}
                  showNumbers={showNumbers}
                  fontSize={fontSize}
                  lineHeight={lineHeight}
                  flowMode={true}
                  showVerseContour={showVerseContour}
                  isAdmin={isAdmin}
                  language={language}
                  onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({
                    verseId,
                    updates,
                    chapterId: effectiveChapter?.id,
                    verseNumber: verse.verse_number
                  })}
                  onVerseDelete={(verseId) => deleteVerseMutation.mutate(verseId)}
                />
              );
            })}
          </div>
        ) : currentVerse ? (
          <div className="space-y-6">
            {dualLanguageMode && !isMobile ? (
              <DualLanguageVerseCard
                key={currentVerse.id}
                verseId={currentVerse.id}
                verseNumber={isCantoMode
                  ? `${cantoNumber}.${chapterNumber}.${getDisplayVerseNumber(currentVerse.verse_number)}`
                  : `${effectiveChapter?.chapter_number || effectiveChapterParam}.${getDisplayVerseNumber(currentVerse.verse_number)}`
                }
                bookName={chapterTitle || undefined}
                bookSlug={bookId}
                sanskritTextUk={cleanSanskrit(currentVerse.sanskrit_uk || currentVerse.sanskrit || "")}
                sanskritTextEn={cleanSanskrit(currentVerse.sanskrit_en || currentVerse.sanskrit || "")}
                transliterationUk={currentVerse.transliteration_uk || ""}
                synonymsUk={currentVerse.synonyms_uk || ""}
                translationUk={currentVerse.translation_uk || ""}
                commentaryUk={currentVerse.commentary_uk || ""}
                transliterationEn={currentVerse.transliteration_en || ""}
                synonymsEn={currentVerse.synonyms_en || ""}
                translationEn={currentVerse.translation_en || ""}
                commentaryEn={currentVerse.commentary_en || ""}
                audioUrl={currentVerse.full_verse_audio_url || currentVerse.audio_url || ""}
                audioSanskrit={currentVerse.recitation_audio_url || ""}
                audioTranslationUk={currentVerse.explanation_uk_audio_url || ""}
                audioTranslationEn={currentVerse.explanation_en_audio_url || ""}
                audioCommentaryUk={currentVerse.explanation_uk_audio_url || ""}
                audioCommentaryEn={currentVerse.explanation_en_audio_url || ""}
                textDisplaySettings={textDisplaySettings}
                isAdmin={isAdmin}
                showNumbers={showNumbers}
                fontSize={fontSize}
                lineHeight={lineHeight}
                onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({
                  verseId,
                  updates,
                  chapterId: effectiveChapter?.id,
                  verseNumber: currentVerse.verse_number
                })}
                onVerseDelete={(verseId) => deleteVerseMutation.mutate(verseId)}
                onPrevVerse={isMobile ? undefined : handlePrevVerse}
                onNextVerse={isMobile ? undefined : handleNextVerse}
                isPrevDisabled={currentVerseIndex === 0 && currentChapterIndex === 0}
                isNextDisabled={currentVerseIndex === verses.length - 1 && currentChapterIndex === allChapters.length - 1}
                prevLabel={currentVerseIndex === 0 ? t("Попередня глава", "Previous Chapter") : t("Попередній вірш", "Previous Verse")}
                nextLabel={currentVerseIndex === verses.length - 1 ? t("Наступна глава", "Next Chapter") : t("Наступний вірш", "Next Verse")}
              />
            ) : (
              <VerseCard
                key={currentVerse.id}
                verseId={currentVerse.id}
                verseNumber={isCantoMode
                  ? `${cantoNumber}.${chapterNumber}.${getDisplayVerseNumber(currentVerse.verse_number)}`
                  : `${effectiveChapter?.chapter_number || effectiveChapterParam}.${getDisplayVerseNumber(currentVerse.verse_number)}`
                }
                bookName={chapterTitle}
                bookSlug={bookId}
                sanskritText={cleanSanskrit(language === "uk" ? currentVerse.sanskrit_uk || currentVerse.sanskrit || "" : currentVerse.sanskrit_en || currentVerse.sanskrit || "")}
                transliteration={language === "uk" ? currentVerse.transliteration_uk || "" : currentVerse.transliteration_en || ""}
                synonyms={getTranslationWithFallback(currentVerse, 'synonyms')}
                translation={getTranslationWithFallback(currentVerse, 'translation')}
                commentary={getTranslationWithFallback(currentVerse, 'commentary')}
                audioUrl={currentVerse.full_verse_audio_url || currentVerse.audio_url || ""}
                audioSanskrit={currentVerse.recitation_audio_url || ""}
                audioTranslation={language === "uk" ? currentVerse.explanation_uk_audio_url || "" : currentVerse.explanation_en_audio_url || ""}
                audioCommentary={language === "uk" ? currentVerse.explanation_uk_audio_url || "" : currentVerse.explanation_en_audio_url || ""}
                
                is_composite={currentVerse.is_composite}
                start_verse={currentVerse.start_verse}
                end_verse={currentVerse.end_verse}
                verse_count={currentVerse.verse_count}
                showNumbers={showNumbers}
                fontSize={fontSize}
                lineHeight={lineHeight}
                flowMode={flowMode}
                showVerseContour={showVerseContour}
                isAdmin={isAdmin}
                language={language}
                onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({
                  verseId,
                  updates,
                  chapterId: effectiveChapter?.id,
                  verseNumber: currentVerse.verse_number
                })}
                onVerseDelete={(verseId) => deleteVerseMutation.mutate(verseId)}
                onVerseNumberUpdate={() => {
                  queryClient.invalidateQueries({ queryKey: ["verses"] });
                }}
                onPrevVerse={isMobile ? undefined : handlePrevVerse}
                onNextVerse={isMobile ? undefined : handleNextVerse}
                isPrevDisabled={currentVerseIndex === 0 && currentChapterIndex === 0}
                isNextDisabled={currentVerseIndex === verses.length - 1 && currentChapterIndex === allChapters.length - 1}
                prevLabel={currentVerseIndex === 0 ? t("Попередня глава", "Previous Chapter") : t("Попередній вірш", "Previous Verse")}
                nextLabel={currentVerseIndex === verses.length - 1 ? t("Наступна глава", "Next Chapter") : t("Наступний вірш", "Next Verse")}
              />
            )}

            {/* Tattvas */}
            {currentVerse?.id && (
              <VerseTattvas verseId={currentVerse.id} className="mt-4" />
            )}

            {/* Related verses */}
            {currentVerse?.id && (
              <RelatedVerses
                verseId={currentVerse.id}
                defaultExpanded={false}
                limit={5}
              />
            )}

            {/* Навігація знизу - тільки на десктопі */}
            {!isMobile && (
              <div className="flex items-center justify-between pt-6">
                <Button variant="ghost" onClick={handlePrevVerse} disabled={currentVerseIndex === 0 && currentChapterIndex === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {currentVerseIndex === 0 ? t("Попередня глава", "Previous Chapter") : t("Попередній вірш", "Previous Verse")}
                </Button>
                <Button variant="ghost" onClick={handleNextVerse} disabled={currentVerseIndex === verses.length - 1 && currentChapterIndex === allChapters.length - 1}>
                  {currentVerseIndex === verses.length - 1 ? t("Наступна глава", "Next Chapter") : t("Наступний вірш", "Next Verse")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <SelectionTooltip
        isVisible={selectionTooltipVisible}
        position={selectionTooltipPosition}
        selectedText={selectedTextForHighlight}
        onSave={handleOpenHighlightDialog}
        onClose={() => setSelectionTooltipVisible(false)}
        onCopy={handleCopySelectedText}
        onShare={handleShareSelectedText}
      />
      <HighlightDialog isOpen={highlightDialogOpen} onClose={() => setHighlightDialogOpen(false)} onSave={handleSaveHighlight} selectedText={selectedTextForHighlight} />

      <KeyboardShortcutsModal isOpen={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)} shortcuts={shortcuts} />

      <JumpToVerseDialog
        isOpen={showJumpDialog}
        onClose={() => setShowJumpDialog(false)}
        currentBookId={bookId}
        currentCantoNumber={cantoNumber}
        isCantoMode={isCantoMode}
      />

      {/* Swipe navigation indicator */}
      <SwipeIndicator
        isSwiping={swipeState.isSwiping}
        direction={swipeState.direction}
        progress={swipeState.progress}
        leftLabel={currentVerseIndex === 0
          ? t("Попередня глава", "Previous chapter")
          : t("Попередній вірш", "Previous verse")
        }
        rightLabel={currentVerseIndex === verses.length - 1
          ? t("Наступна глава", "Next chapter")
          : t("Наступний вірш", "Next verse")
        }
      />

    </div>;
};