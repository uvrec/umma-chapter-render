// VedaReaderDB.tsx — ENHANCED VERSION
// Додано: Sticky Header, Bookmark, Share, Download, Keyboard Navigation

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Settings, Bookmark, Share2, Download, Home, Highlighter, HelpCircle, GraduationCap, X, Maximize, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerseCard } from "@/components/VerseCard";
import { DualLanguageVerseCard } from "@/components/DualLanguageVerseCard";
import { GlobalSettingsPanel } from "@/components/GlobalSettingsPanel";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { supabase } from "@/integrations/supabase/client";
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
import { ChapterMinimap, ChapterMinimapCompact } from "@/components/ChapterMinimap";
import { RelatedVerses } from "@/components/RelatedVerses";
import { VerseTattvas } from "@/components/verse/VerseTattvas";
import { cleanHtml, cleanSanskrit } from "@/utils/import/normalizers";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useReadingSession } from "@/hooks/useReadingSession";
export const VedaReaderDB = () => {
  const {
    bookId,
    cantoNumber,
    chapterNumber,
    verseNumber,
    verseId
  } = useParams();
  const routeVerseNumber = verseNumber ?? verseId;
  const navigate = useNavigate();
  const {
    language,
    t
  } = useLanguage();
  const {
    isAdmin
  } = useAuth();
  const queryClient = useQueryClient();
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
  } = useReaderSettings();
  const [originalLanguage, setOriginalLanguage] = useState<"sanskrit" | "ua" | "en">("sanskrit");
  const getDisplayVerseNumber = (verseNumber: string): string => {
    const parts = verseNumber.split(/[\s.]+/);
    return parts[parts.length - 1] || verseNumber;
  };

  // ✅ НОВЕ: Helper для fallback на іншу мову якщо переклад відсутній
  const getTranslationWithFallback = (verse: any, field: 'translation' | 'synonyms' | 'commentary'): string => {
    const primaryField = language === 'ua' ? `${field}_ua` : `${field}_en`;
    const fallbackField = language === 'ua' ? `${field}_en` : `${field}_ua`;

    // Спочатку намагаємося взяти основну мову
    const primaryValue = verse[primaryField];
    if (primaryValue && primaryValue.trim()) {
      return primaryValue;
    }

    // Якщо основної мови немає, беремо fallback
    const fallbackValue = verse[fallbackField];
    if (fallbackValue && fallbackValue.trim()) {
      // Додаємо маркер що це fallback (тільки для адміна і тільки для перекладу)
      if (isAdmin && field === 'translation') {
        const fallbackLang = language === 'ua' ? 'EN' : 'UA';
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

  // BOOK
  const {
    data: book
  } = useQuery({
    queryKey: ["book", bookId],
    staleTime: 60_000,
    enabled: !!bookId,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("books").select("id, slug, title_ua, title_en, has_cantos").eq("slug", bookId).maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  // CANTO (лише в canto mode)
  const {
    data: canto
  } = useQuery({
    queryKey: ["canto", book?.id, cantoNumber],
    staleTime: 60_000,
    enabled: isCantoMode && !!book?.id && !!cantoNumber,
    queryFn: async () => {
      if (!book?.id || !cantoNumber) return null;
      const {
        data,
        error
      } = await supabase.from("cantos").select("id, canto_number, title_ua, title_en").eq("book_id", book.id).eq("canto_number", parseInt(cantoNumber)).maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  // CHAPTER
  const {
    data: chapter,
    isLoading: isLoadingChapter
  } = useQuery({
    queryKey: ["chapter", book?.id, canto?.id, effectiveChapterParam, isCantoMode],
    staleTime: 60_000,
    enabled: !!effectiveChapterParam && (isCantoMode ? !!canto?.id : !!book?.id),
    queryFn: async () => {
      if (!book?.id || !effectiveChapterParam) return null;
      const base = supabase.from("chapters").select("*").eq("chapter_number", parseInt(effectiveChapterParam));
      const query = isCantoMode && canto?.id ? base.eq("canto_id", canto.id) : base.eq("book_id", book.id);
      const {
        data,
        error
      } = await query.maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  // Fallback: legacy chapter without canto
  const {
    data: fallbackChapter
  } = useQuery({
    queryKey: ["fallback-chapter", book?.id, effectiveChapterParam],
    staleTime: 60_000,
    enabled: !!book?.id && !!effectiveChapterParam,
    queryFn: async () => {
      if (!book?.id || !effectiveChapterParam) return null;
      const {
        data,
        error
      } = await supabase.from("chapters").select("*").eq("book_id", book.id).eq("chapter_number", parseInt(effectiveChapterParam)).is("canto_id", null).maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  // VERSES (main)
  const {
    data: versesMain = [],
    isLoading: isLoadingVersesMain
  } = useQuery({
    queryKey: ["verses", chapter?.id],
    enabled: !!chapter?.id,
    queryFn: async () => {
      if (!chapter?.id) return [] as any[];
      const {
        data,
        error
      } = await supabase.from("verses").select(`
          *,
          is_composite,
          start_verse,
          end_verse,
          verse_count,
          sort_key
        `).eq("chapter_id", chapter.id).order("sort_key", {
        ascending: true
      });
      if (error) throw error;
      return (data || []) as any[];
    }
  });

  // VERSES (fallback)
  const {
    data: versesFallback = [],
    isLoading: isLoadingVersesFallback
  } = useQuery({
    queryKey: ["verses-fallback", fallbackChapter?.id],
    enabled: !!fallbackChapter?.id,
    queryFn: async () => {
      if (!fallbackChapter?.id) return [] as any[];
      const {
        data,
        error
      } = await supabase.from("verses").select(`
          *,
          is_composite,
          start_verse,
          end_verse,
          verse_count,
          sort_key
        `).eq("chapter_id", fallbackChapter.id).order("sort_key", {
        ascending: true
      });
      if (error) throw error;
      return (data || []) as any[];
    }
  });
  const verses = versesMain && versesMain.length > 0 ? versesMain : versesFallback || [];

  // ✅ FALLBACK: використовуємо fallbackChapter якщо chapter не знайдено
  // Це критично для SCC та інших книг де canto може не існувати в БД
  const effectiveChapter = chapter || fallbackChapter;
  const isLoading = isLoadingChapter || isLoadingVersesMain || isLoadingVersesFallback;

  // Highlights hook - needs chapter.id
  const {
    createHighlight
  } = useHighlights(effectiveChapter?.id);

  // Reading session tracking
  const { trackVerseView } = useReadingSession({
    bookSlug: bookId || '',
    bookTitle: language === 'ua' ? book?.title_ua : book?.title_en,
    cantoNumber: cantoNumber ? parseInt(cantoNumber) : undefined,
    chapterNumber: parseInt(effectiveChapterParam || '1'),
    chapterTitle: language === 'ua' ? effectiveChapter?.title_ua : effectiveChapter?.title_en,
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

  // Jump to verse from URL if provided
  useEffect(() => {
    if (!routeVerseNumber || !verses.length) return;
    let idx = verses.findIndex(v => String(v.id) === String(routeVerseNumber));
    if (idx === -1) {
      idx = verses.findIndex(v => String(v.verse_number) === String(routeVerseNumber));
    }
    if (idx === -1) {
      const num = parseInt(routeVerseNumber as string);
      if (!isNaN(num)) {
        idx = verses.findIndex(v => {
          const vn = String(v.verse_number);
          if (vn.includes('-')) {
            const [start, end] = vn.split('-').map(n => parseInt(n));
            return !isNaN(start) && !isNaN(end) && num >= start && num <= end;
          }
          return false;
        });
      }
    }
    if (idx >= 0) {
      setCurrentVerseIndex(idx);
    } else {
      console.warn(`Verse ${routeVerseNumber} not found in chapter`);
      toast({
        title: t("Вірш не знайдено", "Verse not found"),
        description: t(`Вірш ${routeVerseNumber} відсутній у цій главі`, `Verse ${routeVerseNumber} not found in this chapter`),
        variant: "destructive"
      });
    }
  }, [routeVerseNumber, verses, t]);

  // ALL CHAPTERS (для навігації між главами)
  const {
    data: allChapters = []
  } = useQuery({
    queryKey: isCantoMode ? ["all-chapters-canto", canto?.id] : ["all-chapters-book", book?.id],
    staleTime: 60_000,
    enabled: isCantoMode ? !!canto?.id : !!book?.id,
    queryFn: async () => {
      const base = supabase.from("chapters").select("id, chapter_number").order("chapter_number");
      const query = isCantoMode && canto?.id ? base.eq("canto_id", canto.id) : base.eq("book_id", book!.id);
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      return data || [];
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
      updates: any;
      chapterId?: string;
      verseNumber?: string;
    }) => {
      const payload: any = {};

      // Sanskrit - зберігати у відповідні поля
      if (updates.sanskrit_ua !== undefined) {
        payload.sanskrit_ua = updates.sanskrit_ua;
      }
      if (updates.sanskrit_en !== undefined) {
        payload.sanskrit_en = updates.sanskrit_en;
      }
      // Fallback для single mode
      if (updates.sanskrit !== undefined && updates.sanskrit_ua === undefined && updates.sanskrit_en === undefined) {
        if (language === "ua") {
          payload.sanskrit_ua = updates.sanskrit;
        } else {
          payload.sanskrit_en = updates.sanskrit;
        }
      }

      // Transliteration - зберігати в правильне поле
      if (updates.transliteration_ua !== undefined) {
        payload.transliteration_ua = updates.transliteration_ua;
      }
      if (updates.transliteration_en !== undefined) {
        payload.transliteration_en = updates.transliteration_en;
      }
      // Fallback для single mode
      if (updates.transliteration !== undefined && updates.transliteration_ua === undefined && updates.transliteration_en === undefined) {
        if (language === "ua") {
          payload.transliteration_ua = updates.transliteration;
        } else {
          payload.transliteration_en = updates.transliteration;
        }
      }

      // Synonyms - зберігати в правильне поле
      if (updates.synonyms_ua !== undefined) {
        payload.synonyms_ua = updates.synonyms_ua;
      }
      if (updates.synonyms_en !== undefined) {
        payload.synonyms_en = updates.synonyms_en;
      }
      // Fallback для single mode
      if (updates.synonyms !== undefined && updates.synonyms_ua === undefined && updates.synonyms_en === undefined) {
        if (language === "ua") {
          payload.synonyms_ua = updates.synonyms;
        } else {
          payload.synonyms_en = updates.synonyms;
        }
      }

      // Translation - зберігати в правильне поле
      if (updates.translation_ua !== undefined) {
        payload.translation_ua = updates.translation_ua;
      }
      if (updates.translation_en !== undefined) {
        payload.translation_en = updates.translation_en;
      }
      // Fallback для single mode
      if (updates.translation !== undefined && updates.translation_ua === undefined && updates.translation_en === undefined) {
        if (language === "ua") {
          payload.translation_ua = updates.translation;
        } else {
          payload.translation_en = updates.translation;
        }
      }

      // Commentary - зберігати в правильне поле
      if (updates.commentary_ua !== undefined) {
        payload.commentary_ua = updates.commentary_ua;
      }
      if (updates.commentary_en !== undefined) {
        payload.commentary_en = updates.commentary_en;
      }
      // Fallback для single mode
      if (updates.commentary !== undefined && updates.commentary_ua === undefined && updates.commentary_en === undefined) {
        if (language === "ua") {
          payload.commentary_ua = updates.commentary;
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
    onError: (err: any) => {
      toast({
        title: t("Помилка", "Error"),
        description: err.message,
        variant: "destructive"
      });
    }
  });
  const bookTitle = language === "ua" ? book?.title_ua : book?.title_en;
  const cantoTitle = canto ? language === "ua" ? canto.title_ua : canto.title_en : null;

  // Special handling for NOI: display "Text X" instead of chapter title
  let chapterTitle = effectiveChapter ? language === "ua" ? effectiveChapter.title_ua : effectiveChapter.title_en : null;
  if (bookId === 'noi' && routeVerseNumber) {
    chapterTitle = language === 'ua' ? `Текст ${routeVerseNumber}` : `Text ${routeVerseNumber}`;
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

  // 🆕 Share функція
  const handleShare = () => {
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
  };

  // 🆕 Download функція
  const handleDownload = () => {
    toast({
      title: t("Завантаження", "Download"),
      description: t("Функція в розробці", "Feature in development")
    });
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
      translation: language === 'ua' ? currentVerse.translation_ua || "" : currentVerse.translation_en || "",
      commentary: language === 'ua' ? currentVerse.commentary_ua || undefined : currentVerse.commentary_en || undefined,
      audioUrl: (currentVerse as any).full_verse_audio_url || currentVerse.audio_url || undefined,
      audioSanskrit: (currentVerse as any).recitation_audio_url || undefined,
      audioTranslation: language === 'ua'
        ? (currentVerse as any).explanation_ua_audio_url || undefined
        : (currentVerse as any).explanation_en_audio_url || undefined
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
    if (!selectedText.includes(' ')) {
      return;
    }

    // Get selection position for tooltip
    const range = selection?.getRangeAt(0);
    if (!range) return;

    const rect = range.getBoundingClientRect();
    const tooltipX = rect.left + rect.width / 2;
    const tooltipY = rect.top + window.scrollY;

    // Get context
    const container = range.commonAncestorContainer;
    const fullText = container.textContent || '';
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;
    const before = fullText.substring(Math.max(0, startOffset - 50), startOffset);
    const after = fullText.substring(endOffset, Math.min(fullText.length, endOffset + 50));

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

  // Hide tooltip when selection changes or is cleared
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    // If no selection or very short, hide tooltip
    if (!selectedText || selectedText.length < 10) {
      setSelectionTooltipVisible(false);
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
        selectionTimeoutRef.current = null;
      }
    }
  }, []);

  // Handler for opening dialog from tooltip
  const handleOpenHighlightDialog = useCallback(() => {
    setSelectionTooltipVisible(false);
    setHighlightDialogOpen(true);
  }, []);

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
      const path = bookId === 'noi' ? `/veda-reader/noi/${urlVerseNumber}` : isCantoMode ? `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${chapterNumber}/${urlVerseNumber}` : `/veda-reader/${bookId}/${effectiveChapterParam}/${urlVerseNumber}`;
      navigate(path);
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
      const path = bookId === 'noi' ? `/veda-reader/noi/${urlVerseNumber}` : isCantoMode ? `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${chapterNumber}/${urlVerseNumber}` : `/veda-reader/${bookId}/${effectiveChapterParam}/${urlVerseNumber}`;
      navigate(path);
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
      const path = isCantoMode ? `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${prevChapter.chapter_number}` : `/veda-reader/${bookId}/${prevChapter.chapter_number}`;
      navigate(path);
      setCurrentVerseIndex(0);
    }
  };
  const handleNextChapter = () => {
    if (currentChapterIndex < allChapters.length - 1) {
      const nextChapter = allChapters[currentChapterIndex + 1];
      const path = isCantoMode ? `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${nextChapter.chapter_number}` : `/veda-reader/${bookId}/${nextChapter.chapter_number}`;
      navigate(path);
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

  const handleSaveHighlight = useCallback((notes: string) => {
    if (!book?.id || !effectiveChapter?.id) return;
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
      highlight_color: "yellow"
    });
  }, [book, canto, effectiveChapter, currentVerse, selectedTextForHighlight, selectionContext, createHighlight]);

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
      if (zenMode) {
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
          <Button variant="outline" onClick={() => navigate(isCantoMode ? `/veda-reader/${bookId}/canto/${cantoNumber}` : `/veda-reader/${bookId}`)}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("Назад", "Back")}
          </Button>
        </div>
      </div>;
  }
  const isTextChapter = effectiveChapter.chapter_type === "text" || verses.length === 0;

  // ✅ fontSize керується через useReaderSettings → оновлює CSS змінну --vv-reader-font-size
  // Не потрібно встановлювати inline font-size на контейнер

  return <div className="min-h-screen bg-background">
      {/* Кнопка виходу з zen/fullscreen режиму */}
      {(zenMode || fullscreenMode) && (
        <button
          onClick={() => {
            if (zenMode) setZenMode(false);
            else setFullscreenMode(false);
          }}
          className={zenMode ? "zen-exit-btn" : "fullscreen-exit-btn"}
          title={zenMode
            ? t("Вийти з Zen режиму (Esc)", "Exit Zen mode (Esc)")
            : t("Вийти з повноекранного режиму (Esc)", "Exit fullscreen (Esc)")
          }
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <Header />

      {/* 🆕 Sticky Breadcrumbs - прилипає під хедером */}
      <div className="sticky top-[65px] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Breadcrumbs - responsive with overflow handling */}
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground min-w-0 overflow-hidden">
              <a href="/library" className="hover:text-foreground transition-colors flex items-center gap-1 flex-shrink-0">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">{t("Бібліотека", "Library")}</span>
              </a>
              <span className="flex-shrink-0">›</span>
              <a href={`/veda-reader/${bookId}`} className="hover:text-foreground transition-colors truncate max-w-[60px] sm:max-w-none">
                {bookTitle}
              </a>
              {cantoTitle && <>
                  <span className="flex-shrink-0">›</span>
                  <a href={`/veda-reader/${bookId}/canto/${cantoNumber}`} className="hover:text-foreground transition-colors truncate max-w-[40px] sm:max-w-none">
                    {cantoTitle}
                  </a>
                </>}
              <span className="flex-shrink-0">›</span>
              <span className="text-foreground font-medium truncate">{chapterTitle}</span>
            </div>

            {/* Icons - responsive */}
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
              <Button variant="ghost" size="icon" onClick={handleShare} title={t("Поділитися", "Share")}>
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDownload} title={t("Завантажити", "Download")}>
                <Download className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowKeyboardShortcuts(true)} title={t("Клавіатурні скорочення (?)", "Keyboard shortcuts (?)")}>
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setZenMode(!zenMode)} title={t("Zen режим (z)", "Zen mode (z)")}>
                <Leaf className={`h-5 w-5 ${zenMode ? "text-primary" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setFullscreenMode(!fullscreenMode)} title={t("Повноекранний режим (f)", "Fullscreen mode (f)")}>
                <Maximize className={`h-5 w-5 ${fullscreenMode ? "text-primary" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} title={t("Налаштування", "Settings")}>
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8" data-reader-root="true">
        {/* Заголовок - тільки для безперервного читання або текстових глав */}
        {(continuousReadingSettings.enabled || isTextChapter) && <div className="mb-8">
            <h1 className="text-center font-extrabold text-5xl text-primary">{chapterTitle}</h1>
          </div>}

        {/* Intro/preface block (render above verses if present) */}
        {(language === "ua" ? effectiveChapter.content_ua : effectiveChapter.content_en) && !isTextChapter && <div className="verse-surface mb-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <TiptapRenderer content={language === "ua" ? effectiveChapter.content_ua || "" : effectiveChapter.content_en || ""} />
            </div>
          </div>}

        {isTextChapter ? <div className="verse-surface">
            {/* Навігація зверху для текстових глав */}
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

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <TiptapRenderer content={language === "ua" ? effectiveChapter.content_ua || "" : effectiveChapter.content_en || effectiveChapter.content_ua || ""} />
            </div>

            {/* Навігація знизу */}
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
          </div> : continuousReadingSettings.enabled ? <div className="space-y-8">
            {verses.map(verse => {
          const verseIdx = getDisplayVerseNumber(verse.verse_number);
          const fullVerseNumber = isCantoMode ? `${cantoNumber}.${chapterNumber}.${verseIdx}` : `${effectiveChapter?.chapter_number || effectiveChapterParam}.${verseIdx}`;

          // Налаштування відображення для continuous mode
          const contSettings = {
            showSanskrit: continuousReadingSettings.showSanskrit,
            showTransliteration: continuousReadingSettings.showTransliteration,
            showSynonyms: continuousReadingSettings.showSynonyms,
            showTranslation: continuousReadingSettings.showTranslation,
            showCommentary: continuousReadingSettings.showCommentary
          };
          return dualLanguageMode ? <DualLanguageVerseCard key={verse.id} verseId={verse.id} verseNumber={fullVerseNumber} bookName={chapterTitle || undefined} sanskritTextUa={cleanSanskrit((verse as any).sanskrit_ua || (verse as any).sanskrit || "")} sanskritTextEn={cleanSanskrit((verse as any).sanskrit_en || (verse as any).sanskrit || "")} transliterationUa={(verse as any).transliteration_ua || ""} synonymsUa={(verse as any).synonyms_ua || ""} translationUa={(verse as any).translation_ua || ""} commentaryUa={(verse as any).commentary_ua || ""} transliterationEn={(verse as any).transliteration_en || ""} synonymsEn={(verse as any).synonyms_en || ""} translationEn={(verse as any).translation_en || ""} commentaryEn={(verse as any).commentary_en || ""} audioUrl={(verse as any).full_verse_audio_url || (verse as any).audio_url || ""} audioSanskrit={(verse as any).recitation_audio_url || ""} audioTranslationUa={(verse as any).explanation_ua_audio_url || ""} audioTranslationEn={(verse as any).explanation_en_audio_url || ""} audioCommentaryUa={(verse as any).explanation_ua_audio_url || ""} audioCommentaryEn={(verse as any).explanation_en_audio_url || ""} textDisplaySettings={contSettings} isAdmin={isAdmin} showNumbers={showNumbers} fontSize={fontSize} lineHeight={lineHeight} onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({
            verseId,
            updates,
            chapterId: effectiveChapter?.id,
            verseNumber: verse.verse_number
          })} /> : <VerseCard key={verse.id} verseId={verse.id} verseNumber={fullVerseNumber} bookName={chapterTitle} sanskritText={cleanSanskrit(language === "ua" ? (verse as any).sanskrit_ua || (verse as any).sanskrit || "" : (verse as any).sanskrit_en || (verse as any).sanskrit || "")} transliteration={language === "ua" ? (verse as any).transliteration_ua || "" : (verse as any).transliteration_en || ""} synonyms={getTranslationWithFallback(verse, 'synonyms')} translation={getTranslationWithFallback(verse, 'translation')} commentary={getTranslationWithFallback(verse, 'commentary')} audioUrl={(verse as any).full_verse_audio_url || (verse as any).audio_url || ""} audioSanskrit={(verse as any).recitation_audio_url || ""} audioTranslation={language === "ua" ? (verse as any).explanation_ua_audio_url || "" : (verse as any).explanation_en_audio_url || ""} audioCommentary={language === "ua" ? (verse as any).explanation_ua_audio_url || "" : (verse as any).explanation_en_audio_url || ""} is_composite={(verse as any).is_composite} start_verse={(verse as any).start_verse} end_verse={(verse as any).end_verse} verse_count={(verse as any).verse_count} textDisplaySettings={contSettings} showNumbers={showNumbers} fontSize={fontSize} lineHeight={lineHeight} flowMode={true} showVerseContour={showVerseContour} isAdmin={isAdmin} language={language} onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({
            verseId,
            updates,
            chapterId: effectiveChapter?.id,
            verseNumber: verse.verse_number
          })} />;
        })}
          </div> : <>
            {currentVerse && (() => {
          const verseIdx = getDisplayVerseNumber(currentVerse.verse_number);
          const fullVerseNumber = isCantoMode ? `${cantoNumber}.${chapterNumber}.${verseIdx}` : `${effectiveChapter?.chapter_number || effectiveChapterParam}.${verseIdx}`;
          return <div className="space-y-6">
                  {dualLanguageMode ? <DualLanguageVerseCard key={currentVerse.id} verseId={currentVerse.id} verseNumber={fullVerseNumber} bookName={chapterTitle || undefined} sanskritTextUa={cleanSanskrit((currentVerse as any).sanskrit_ua || (currentVerse as any).sanskrit || "")} sanskritTextEn={cleanSanskrit((currentVerse as any).sanskrit_en || (currentVerse as any).sanskrit || "")} transliterationUa={(currentVerse as any).transliteration_ua || ""} synonymsUa={(currentVerse as any).synonyms_ua || ""} translationUa={(currentVerse as any).translation_ua || ""} commentaryUa={(currentVerse as any).commentary_ua || ""} transliterationEn={(currentVerse as any).transliteration_en || ""} synonymsEn={(currentVerse as any).synonyms_en || ""} translationEn={(currentVerse as any).translation_en || ""} commentaryEn={(currentVerse as any).commentary_en || ""} audioUrl={(currentVerse as any).full_verse_audio_url || (currentVerse as any).audio_url || ""} audioSanskrit={(currentVerse as any).recitation_audio_url || ""} audioTranslationUa={(currentVerse as any).explanation_ua_audio_url || ""} audioTranslationEn={(currentVerse as any).explanation_en_audio_url || ""} audioCommentaryUa={(currentVerse as any).explanation_ua_audio_url || ""} audioCommentaryEn={(currentVerse as any).explanation_en_audio_url || ""} textDisplaySettings={textDisplaySettings} isAdmin={isAdmin} showNumbers={showNumbers} fontSize={fontSize} lineHeight={lineHeight} onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({
              verseId,
              updates,
              chapterId: effectiveChapter?.id,
              verseNumber: currentVerse.verse_number
            })} onPrevVerse={handlePrevVerse} onNextVerse={handleNextVerse} isPrevDisabled={currentVerseIndex === 0 && currentChapterIndex === 0} isNextDisabled={currentVerseIndex === verses.length - 1 && currentChapterIndex === allChapters.length - 1} prevLabel={currentVerseIndex === 0 ? t("Попередня глава", "Previous Chapter") : t("Попередній вірш", "Previous Verse")} nextLabel={currentVerseIndex === verses.length - 1 ? t("Наступна глава", "Next Chapter") : t("Наступний вірш", "Next Verse")} /> : <VerseCard key={currentVerse.id} verseId={currentVerse.id} verseNumber={fullVerseNumber} bookName={chapterTitle} sanskritText={cleanSanskrit(language === "ua" ? (currentVerse as any).sanskrit_ua || (currentVerse as any).sanskrit || "" : (currentVerse as any).sanskrit_en || (currentVerse as any).sanskrit || "")} transliteration={language === "ua" ? (currentVerse as any).transliteration_ua || "" : (currentVerse as any).transliteration_en || ""} synonyms={getTranslationWithFallback(currentVerse, 'synonyms')} translation={getTranslationWithFallback(currentVerse, 'translation')} commentary={getTranslationWithFallback(currentVerse, 'commentary')} audioUrl={(currentVerse as any).full_verse_audio_url || currentVerse.audio_url || ""} audioSanskrit={(currentVerse as any).recitation_audio_url || ""} audioTranslation={language === "ua" ? (currentVerse as any).explanation_ua_audio_url || "" : (currentVerse as any).explanation_en_audio_url || ""} audioCommentary={language === "ua" ? (currentVerse as any).explanation_ua_audio_url || "" : (currentVerse as any).explanation_en_audio_url || ""} is_composite={(currentVerse as any).is_composite} start_verse={(currentVerse as any).start_verse} end_verse={(currentVerse as any).end_verse} verse_count={(currentVerse as any).verse_count} showNumbers={showNumbers} fontSize={fontSize} lineHeight={lineHeight} flowMode={flowMode} showVerseContour={showVerseContour} isAdmin={isAdmin} language={language} onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({
              verseId,
              updates,
              chapterId: effectiveChapter?.id,
              verseNumber: currentVerse.verse_number
            })} onVerseNumberUpdate={() => {
              queryClient.invalidateQueries({
                queryKey: ["verses"]
              });
            }} onPrevVerse={handlePrevVerse} onNextVerse={handleNextVerse} isPrevDisabled={currentVerseIndex === 0 && currentChapterIndex === 0} isNextDisabled={currentVerseIndex === verses.length - 1 && currentChapterIndex === allChapters.length - 1} prevLabel={currentVerseIndex === 0 ? t("Попередня глава", "Previous Chapter") : t("Попередній вірш", "Previous Verse")} nextLabel={currentVerseIndex === verses.length - 1 ? t("Наступна глава", "Next Chapter") : t("Наступний вірш", "Next Verse")} />}

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

                  {/* Навігація знизу */}
                  <div className="flex items-center justify-between pt-6">
                    <Button variant="outline" onClick={handlePrevVerse} disabled={currentVerseIndex === 0 && currentChapterIndex === 0}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      {currentVerseIndex === 0 ? t("Попередня глава", "Previous Chapter") : t("Попередній вірш", "Previous Verse")}
                    </Button>

                    <Button variant="outline" onClick={handleNextVerse} disabled={currentVerseIndex === verses.length - 1 && currentChapterIndex === allChapters.length - 1}>
                      {currentVerseIndex === verses.length - 1 ? t("Наступна глава", "Next Chapter") : t("Наступний вірш", "Next Verse")}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>;
        })()}
          </>}
      </div>

      <GlobalSettingsPanel
        isOpen={settingsOpen}
        onOpenChange={setSettingsOpen}
        showFloatingButton={false}
      />

      <SelectionTooltip
        isVisible={selectionTooltipVisible}
        position={selectionTooltipPosition}
        onSave={handleOpenHighlightDialog}
        onClose={() => setSelectionTooltipVisible(false)}
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

      {/* Chapter minimap - only in single verse mode */}
      {!continuousReadingSettings.enabled && !isTextChapter && verses.length > 1 && (
        <div data-minimap="true">
          {/* Desktop: vertical sidebar */}
          <ChapterMinimap
            verses={verses}
            currentVerseIndex={currentVerseIndex}
            bookId={bookId}
            cantoNumber={cantoNumber}
            chapterNumber={effectiveChapterParam}
            isCantoMode={isCantoMode}
          />
          {/* Mobile: horizontal bottom bar */}
          <ChapterMinimapCompact
            verses={verses}
            currentVerseIndex={currentVerseIndex}
            bookId={bookId}
            cantoNumber={cantoNumber}
            chapterNumber={effectiveChapterParam}
            isCantoMode={isCantoMode}
          />
        </div>
      )}
    </div>;
};