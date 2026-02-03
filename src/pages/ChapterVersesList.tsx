// ChapterVersesList.tsx — Список віршів з підтримкою dualLanguageMode

import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBooks } from "@/contexts/BooksContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen, Edit, Save, X, ChevronLeft, ChevronRight, Plus, Trash2, Settings } from "lucide-react";
import { GlobalSettingsPanel } from "@/components/GlobalSettingsPanel";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import DOMPurify from "dompurify";
import { VerseSlider } from "@/components/mobile/VerseSlider";
import { EnhancedInlineEditor } from "@/components/EnhancedInlineEditor";
import { toast } from "@/hooks/use-toast";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMobileReading } from "@/contexts/MobileReadingContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { stripParagraphTags, sanitizeForRender } from "@/utils/import/normalizers";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { ChapterSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { getChapterOgImage } from "@/utils/og-image";
import { Helmet } from "react-helmet-async";
import { SITE_CONFIG } from "@/lib/constants";
import { SelectionTooltip } from "@/components/SelectionTooltip";
import { copyVerseWithLink, shareVerse, type VerseParams } from "@/utils/verseShare";

/**
 * Safety check: detect if chapter content looks like incorrectly imported verse text
 * This prevents showing full verse content as a "chapter introduction"
 */
function isLikelyMisimportedVerseContent(content: string | null | undefined): boolean {
  if (!content) return false;
  const text = content.toLowerCase();

  // Check for verse number patterns (e.g., "вірш 1", "verse 1", "text 1")
  const versePatterns = /\b(вірш|verse|text)\s+\d+/i;
  const hasVerseNumbers = versePatterns.test(text);

  // Check for multiple numbered items (indication of verse list)
  const multipleNumbers = (text.match(/\b\d+\s*[-–—.):]/g) || []).length > 3;

  // Check for Sanskrit/Devanagari characters (more than 50 chars indicates full text)
  const devanagariChars = (content.match(/[\u0900-\u097F]/g) || []).length;
  const hasSignificantSanskrit = devanagariChars > 50;

  // Check if content is suspiciously long for an introduction (>5000 chars)
  const isTooLong = content.length > 5000;

  // Content from wrong chapter (e.g., "глава перша" in chapter 10)
  const hasChapterMismatch = /глава\s+(перш|друг|трет|четверт|п'ят)/i.test(text);

  return (hasVerseNumbers && (multipleNumbers || isTooLong)) ||
         hasSignificantSanskrit ||
         hasChapterMismatch;
}

// Type for verse data
interface Verse {
  id: string;
  verse_number: string;
  sanskrit: string | null;
  transliteration: string | null;
  transliteration_en: string | null;
  transliteration_uk: string | null;
  translation_uk: string | null;
  translation_en: string | null;
  is_published: boolean;
  deleted_at: string | null;
}
export const ChapterVersesList = () => {
  // Support both /veda-reader/ and /lib/ URL patterns
  const params = useParams<{
    bookId?: string;
    cantoNumber?: string;
    chapterNumber?: string;
    // /lib/ params
    p1?: string;
    p2?: string;
  }>();

  const { hasCantoStructure } = useBooks();

  // Normalize params from /lib/ format to standard format
  const bookId = params.bookId;
  const isCantoBook = bookId ? hasCantoStructure(bookId) : false;

  // For /lib/ routes: p1/p2 need to be mapped based on book type
  // /lib/sb/1/3 → canto=1, chapter=3 (canto book)
  // /lib/bg/3 → chapter=3 (non-canto book)
  const cantoNumber = params.cantoNumber ?? (isCantoBook ? params.p1 : undefined);
  const chapterNumber = params.chapterNumber ?? (isCantoBook ? params.p2 : params.p1);

  const {
    language,
    getLocalizedPath
  } = useLanguage();
  const navigate = useNavigate();
  const {
    user,
    isAdmin
  } = useAuth();
  const queryClient = useQueryClient();
  const {
    fontSize,
    lineHeight,
    dualLanguageMode,
    showNumbers,
    flowMode,
    fullscreenMode,
    setFullscreenMode
  } = useReaderSettings();
  const isMobile = useIsMobile();
  const { enterFullscreen } = useMobileReading();
  const [searchParams] = useSearchParams();

  // Get preview token directly from URL (not from global state which may not be set yet)
  const previewToken = searchParams.get('preview');

  // Helper to add preview token to navigation paths
  const getPathWithPreview = (path: string) => {
    const localizedPath = getLocalizedPath(path);
    if (previewToken) {
      return `${localizedPath}?preview=${previewToken}`;
    }
    return localizedPath;
  };

  // Enter fullscreen mode on mobile for immersive reading
  useEffect(() => {
    if (isMobile) {
      enterFullscreen();
    }
  }, [isMobile, enterFullscreen]);

  // Editing state
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedContentUk, setEditedContentUk] = useState("");
  const [editedContentEn, setEditedContentEn] = useState("");
  const [verseToDelete, setVerseToDelete] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Mobile Bible-style navigation
  const [verseSliderOpen, setVerseSliderOpen] = useState(false);
  const [currentVisibleVerse, setCurrentVisibleVerse] = useState<string | null>(null);
  const verseRefs = useRef<Map<string, HTMLElement>>(new Map());
  const swipeStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Text selection states for SelectionTooltip
  const [selectionTooltipVisible, setSelectionTooltipVisible] = useState(false);
  const [selectionTooltipPosition, setSelectionTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedTextForHighlight, setSelectedTextForHighlight] = useState<string>("");
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isCantoMode = !!cantoNumber;
  const effectiveChapterParam = chapterNumber;
  const {
    data: book
  } = useQuery({
    queryKey: ["book", bookId, previewToken],
    queryFn: async () => {
      // Try RPC function that supports preview tokens
      const { data, error } = await (supabase.rpc as any)("get_book_with_preview", {
        p_book_slug: bookId,
        p_token: previewToken
      });
      if (error) {
        console.error('RPC get_book_with_preview error:', error);
        // Fallback to direct query (respects RLS, works for published books)
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("books")
          .select("*")
          .eq("slug", bookId)
          .single();
        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
      // RPC returns array, get first element
      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!bookId
  });
  const {
    data: canto
  } = useQuery({
    queryKey: ["canto", book?.id, cantoNumber, previewToken],
    queryFn: async () => {
      if (!book?.id || !cantoNumber) return null;
      // Try RPC function that supports preview tokens
      const { data, error } = await (supabase.rpc as any)("get_canto_by_number_with_preview", {
        p_book_id: book.id,
        p_canto_number: parseInt(cantoNumber),
        p_token: previewToken
      });
      if (error) {
        console.error('RPC get_canto_by_number_with_preview error:', error);
        // Fallback to direct query (respects RLS, works for published cantos)
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("cantos")
          .select("*")
          .eq("book_id", book.id)
          .eq("canto_number", parseInt(cantoNumber))
          .single();
        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
      // RPC returns array, get first element
      return data && data.length > 0 ? data[0] : null;
    },
    enabled: isCantoMode && !!book?.id && !!cantoNumber
  });
  const {
    data: chapter,
    isLoading: isLoadingChapter
  } = useQuery({
    queryKey: ["chapter", book?.id, canto?.id, effectiveChapterParam, isCantoMode, previewToken, isAdmin],
    queryFn: async () => {
      if (!book?.id || !effectiveChapterParam) return null;
      // Try RPC function that supports preview tokens
      const { data, error } = await (supabase.rpc as any)("get_chapter_by_number_with_preview", {
        p_book_id: book.id,
        p_canto_id: isCantoMode && canto?.id ? canto.id : null,
        p_chapter_number: parseInt(effectiveChapterParam as string),
        p_token: previewToken
      });
      if (error) {
        console.error('RPC get_chapter_by_number_with_preview error:', error);
        // Fallback to direct query (respects RLS, works for published chapters)
        let query = supabase
          .from("chapters")
          .select("*")
          .eq("book_id", book.id)
          .eq("chapter_number", parseInt(effectiveChapterParam as string));

        if (isCantoMode && canto?.id) {
          query = query.eq("canto_id", canto.id);
        }

        // Filter by is_published only if not admin AND no preview token
        if (!isAdmin && !previewToken) {
          query = query.eq("is_published", true);
        }

        const { data: fallbackData, error: fallbackError } = await query.single();
        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
      // RPC returns array, get first element
      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!effectiveChapterParam && (isCantoMode ? !!canto?.id : !!book?.id)
  });
  const {
    data: fallbackChapter
  } = useQuery({
    queryKey: ["fallback-chapter", book?.id, effectiveChapterParam, previewToken, isAdmin],
    queryFn: async () => {
      if (!book?.id || !effectiveChapterParam) return null;
      // Try RPC function that supports preview tokens (with null canto_id for fallback)
      const { data, error } = await (supabase.rpc as any)("get_chapter_by_number_with_preview", {
        p_book_id: book.id,
        p_canto_id: null,
        p_chapter_number: parseInt(effectiveChapterParam as string),
        p_token: previewToken
      });
      if (error) {
        console.error('RPC get_chapter_by_number_with_preview fallback error:', error);
        // Fallback to direct query
        let query = supabase
          .from("chapters")
          .select("*")
          .eq("book_id", book.id)
          .eq("chapter_number", parseInt(effectiveChapterParam as string))
          .is("canto_id", null);

        // Filter by is_published only if not admin AND no preview token
        if (!isAdmin && !previewToken) {
          query = query.eq("is_published", true);
        }

        const { data: fallbackData, error: fallbackError } = await query.single();
        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
      // RPC returns array, get first element
      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!book?.id && !!effectiveChapterParam
  });
  const {
    data: versesMain = [],
    isLoading: isLoadingVersesMain
  } = useQuery({
    queryKey: ["chapter-verses-list", chapter?.id, previewToken, isAdmin],
    queryFn: async () => {
      if (!chapter?.id) return [] as Verse[];

      // Try RPC function that supports preview tokens
      const { data, error } = await (supabase.rpc as any)("get_verses_by_chapter_with_preview", {
        p_chapter_id: chapter.id,
        p_token: previewToken
      });

      if (error) {
        console.error('RPC get_verses_by_chapter_with_preview error:', error);
        // Fallback to direct query (respects RLS, works for published verses)
        let query = supabase
          .from("verses")
          .select("*")
          .eq("chapter_id", chapter.id)
          .is("deleted_at", null);

        // Filter by is_published only if not admin AND no preview token
        if (!isAdmin && !previewToken) {
          query = query.eq("is_published", true);
        }

        const { data: fallbackData, error: fallbackError } = await query.order("sort_key", { ascending: true });
        if (fallbackError) throw fallbackError;
        return (fallbackData || []) as Verse[];
      }
      return (data || []) as Verse[];
    },
    enabled: !!chapter?.id && "id" in chapter
  });
  const {
    data: versesFallback = [],
    isLoading: isLoadingVersesFallback
  } = useQuery({
    queryKey: ["chapter-verses-fallback", fallbackChapter?.id, previewToken, isAdmin],
    queryFn: async () => {
      if (!fallbackChapter?.id) return [] as Verse[];

      // Try RPC function that supports preview tokens
      const { data, error } = await (supabase.rpc as any)("get_verses_by_chapter_with_preview", {
        p_chapter_id: fallbackChapter.id,
        p_token: previewToken
      });

      if (error) {
        console.error('RPC get_verses_by_chapter_with_preview fallback error:', error);
        // Fallback to direct query
        let query = supabase
          .from("verses")
          .select("*")
          .eq("chapter_id", fallbackChapter.id)
          .is("deleted_at", null);

        // Filter by is_published only if not admin AND no preview token
        if (!isAdmin && !previewToken) {
          query = query.eq("is_published", true);
        }

        const { data: fallbackData, error: fallbackError } = await query.order("sort_key", { ascending: true });
        if (fallbackError) throw fallbackError;
        return (fallbackData || []) as Verse[];
      }
      return (data || []) as Verse[];
    },
    enabled: !!fallbackChapter?.id
  });
  const versesRaw = useMemo(() => versesMain && versesMain.length > 0 ? versesMain : versesFallback || [], [versesMain, versesFallback]);
  const verses = useMemo(() => (versesRaw || []).filter((v: Verse) => v?.translation_uk && v.translation_uk.trim().length > 0 || v?.translation_en && v.translation_en.trim().length > 0), [versesRaw]);
  const {
    data: adjacentChapters
  } = useQuery({
    queryKey: ["adjacent-chapters", book?.id, canto?.id, effectiveChapterParam, isCantoMode],
    queryFn: async () => {
      if (!book?.id || !effectiveChapterParam) return {
        prev: null,
        next: null
      };
      const currentNum = parseInt(effectiveChapterParam as string);
      const base = supabase.from("chapters").select("id, chapter_number, title_uk, title_en");
      if (isCantoMode && canto?.id) {
        const {
          data
        } = await base.eq("canto_id", canto.id).order("chapter_number");
        const chapters = data || [];
        const currentIdx = chapters.findIndex(c => c.chapter_number === currentNum);
        return {
          prev: currentIdx > 0 ? chapters[currentIdx - 1] : null,
          next: currentIdx < chapters.length - 1 ? chapters[currentIdx + 1] : null
        };
      } else {
        const {
          data
        } = await base.eq("book_id", book.id).is("canto_id", null).order("chapter_number");
        const chapters = data || [];
        const currentIdx = chapters.findIndex(c => c.chapter_number === currentNum);
        return {
          prev: currentIdx > 0 ? chapters[currentIdx - 1] : null,
          next: currentIdx < chapters.length - 1 ? chapters[currentIdx + 1] : null
        };
      }
    },
    enabled: !!book?.id && !!effectiveChapterParam
  });
  const isLoading = isLoadingChapter || isLoadingVersesMain || isLoadingVersesFallback;
  const getVerseUrl = (verseNumber: string) => {
    if (isCantoMode) {
      return getLocalizedPath(`/lib/${bookId}/${cantoNumber}/${chapterNumber}/${verseNumber}`);
    }
    return getLocalizedPath(`/lib/${bookId}/${chapterNumber}/${verseNumber}`);
  };
  const handleBack = () => {
    if (isCantoMode) {
      navigate(getPathWithPreview(`/lib/${bookId}/${cantoNumber}`));
    } else {
      navigate(getPathWithPreview(`/lib/${bookId}`));
    }
  };
  const bookTitle = language === "uk" ? book?.title_uk : book?.title_en;
  const cantoTitle = canto ? language === "uk" ? canto.title_uk : canto.title_en : null;
  const effectiveChapterObj = chapter ?? fallbackChapter;
  const chapterTitle = effectiveChapterObj && "title_uk" in effectiveChapterObj ? language === "uk" ? effectiveChapterObj.title_uk : effectiveChapterObj.title_en : null;

  // SEO metadata
  const chapterPath = isCantoMode
    ? `/${language}/lib/${bookId}/${cantoNumber}/${chapterNumber}`
    : `/${language}/lib/${bookId}/${chapterNumber}`;
  const canonicalUrl = `${SITE_CONFIG.baseUrl}${chapterPath}`;
  const alternateUkUrl = isCantoMode
    ? `${SITE_CONFIG.baseUrl}/uk/lib/${bookId}/${cantoNumber}/${chapterNumber}`
    : `${SITE_CONFIG.baseUrl}/uk/lib/${bookId}/${chapterNumber}`;
  const alternateEnUrl = isCantoMode
    ? `${SITE_CONFIG.baseUrl}/en/lib/${bookId}/${cantoNumber}/${chapterNumber}`
    : `${SITE_CONFIG.baseUrl}/en/lib/${bookId}/${chapterNumber}`;
  const ogImage = getChapterOgImage(
    bookId || '',
    bookTitle || '',
    parseInt(chapterNumber || '1'),
    chapterTitle || '',
    cantoNumber ? parseInt(cantoNumber) : undefined,
    language
  );
  const pageTitle = cantoTitle
    ? `${bookTitle} - ${cantoTitle} - ${chapterTitle}`
    : `${bookTitle} - ${chapterTitle}`;
  const pageDescription = language === "uk"
    ? `${chapterTitle || `Глава ${chapterNumber}`} з ${bookTitle}${cantoTitle ? ` (${cantoTitle})` : ''}`
    : `${chapterTitle || `Chapter ${chapterNumber}`} from ${bookTitle}${cantoTitle ? ` (${cantoTitle})` : ''}`;
  const saveContentMutation = useMutation({
    mutationFn: async () => {
      if (!effectiveChapterObj || !("id" in effectiveChapterObj)) return;
      const {
        error
      } = await supabase.from("chapters").update({
        content_uk: editedContentUk,
        content_en: editedContentEn
      }).eq("id", effectiveChapterObj.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapter"]
      });
      setIsEditingContent(false);
      toast({
        title: "Зміни збережено"
      });
    },
    onError: () => {
      toast({
        title: "Помилка збереження",
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
      queryClient.invalidateQueries({ queryKey: ["chapter-verses-list"] });
      queryClient.invalidateQueries({ queryKey: ["chapter-verses-fallback"] });
      setVerseToDelete(null);
      toast({
        title: language === "uk" ? "Вірш видалено" : "Verse deleted"
      });
    },
    onError: () => {
      toast({
        title: language === "uk" ? "Помилка видалення" : "Delete error",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (effectiveChapterObj) {
      setEditedContentUk(effectiveChapterObj.content_uk || "");
      setEditedContentEn(effectiveChapterObj.content_en || "");
    }
  }, [effectiveChapterObj]);
  const handleNavigate = (chapterNum: number) => {
    if (isCantoMode) {
      navigate(getPathWithPreview(`/lib/${bookId}/${cantoNumber}/${chapterNum}`));
    } else {
      navigate(getPathWithPreview(`/lib/${bookId}/${chapterNum}`));
    }
  };

  // Text selection handler - shows tooltip for copy/share/highlight
  const handleTextSelection = useCallback(() => {
    // Clear any pending timeout
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
      selectionTimeoutRef.current = null;
    }

    // Check if in editable element
    const editableElement = document.activeElement as HTMLElement;
    if (editableElement?.tagName === 'TEXTAREA' || editableElement?.tagName === 'INPUT' || editableElement?.contentEditable === 'true' || editableElement?.closest('[contenteditable="true"]')) {
      return;
    }

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    // Need at least 10 characters and contain whitespace (not single word)
    if (!selectedText || selectedText.length < 10) {
      return;
    }
    if (!/\s/.test(selectedText)) {
      return;
    }

    // Get selection position for tooltip
    const range = selection?.getRangeAt(0);
    if (!range) return;

    const rects = range.getClientRects();
    let tooltipX: number;
    let tooltipY: number;

    if (rects.length > 0) {
      const firstRect = rects[0];
      tooltipX = firstRect.left + firstRect.width / 2;
      // Tooltip uses position: fixed (viewport-relative), so no window.scrollY needed
      tooltipY = firstRect.top;
    } else {
      const rect = range.getBoundingClientRect();
      tooltipX = rect.left + rect.width / 2;
      tooltipY = rect.top;
    }

    // Delay before showing tooltip (allows for copy action without interference)
    selectionTimeoutRef.current = setTimeout(() => {
      const currentSelection = window.getSelection()?.toString().trim();
      if (currentSelection === selectedText) {
        setSelectedTextForHighlight(selectedText);
        setSelectionTooltipPosition({ x: tooltipX, y: tooltipY });
        setSelectionTooltipVisible(true);
      }
    }, 700);
  }, []);

  // Hide tooltip when selection is cleared
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    if (!selectedText || selectedText.length < 10) {
      setSelectionTooltipVisible(false);
    }
  }, []);

  // Copy selected text with verse reference
  const handleCopySelectedText = useCallback(async () => {
    if (!selectedTextForHighlight) return;

    const verseParams: VerseParams = {
      bookSlug: bookId || "",
      bookTitle: bookTitle || "",
      cantoNumber: cantoNumber ? parseInt(cantoNumber) : undefined,
      chapterNumber: parseInt(effectiveChapterParam || "1"),
      verseNumber: "—",
      verseText: selectedTextForHighlight,
    };

    await copyVerseWithLink(verseParams, {
      lang: language as "uk" | "en",
      onSuccess: () => {
        toast({ title: language === "uk" ? "Скопійовано з посиланням" : "Copied with link" });
      },
    });
    setSelectionTooltipVisible(false);
  }, [selectedTextForHighlight, bookId, bookTitle, cantoNumber, effectiveChapterParam, language]);

  // Share selected text
  const handleShareSelectedText = useCallback(async () => {
    if (!selectedTextForHighlight) return;

    const verseParams: VerseParams = {
      bookSlug: bookId || "",
      bookTitle: bookTitle || "",
      cantoNumber: cantoNumber ? parseInt(cantoNumber) : undefined,
      chapterNumber: parseInt(effectiveChapterParam || "1"),
      verseNumber: "—",
      verseText: selectedTextForHighlight,
    };

    await shareVerse(verseParams, {
      lang: language as "uk" | "en",
      onFallbackCopy: () => {
        toast({ title: language === "uk" ? "Скопійовано з посиланням" : "Copied with link" });
      },
    });
    setSelectionTooltipVisible(false);
  }, [selectedTextForHighlight, bookId, bookTitle, cantoNumber, effectiveChapterParam, language]);

  // Mouseup and selectionchange listeners for highlights
  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleTextSelection, handleSelectionChange]);

  // Keyboard navigation functions
  const handlePrevChapter = useCallback(() => {
    if (adjacentChapters?.prev) {
      const chapterNum = adjacentChapters.prev.chapter_number;
      if (isCantoMode) {
        navigate(getPathWithPreview(`/lib/${bookId}/${cantoNumber}/${chapterNum}`));
      } else {
        navigate(getPathWithPreview(`/lib/${bookId}/${chapterNum}`));
      }
    }
  }, [adjacentChapters?.prev, isCantoMode, navigate, getLocalizedPath, bookId, cantoNumber]);

  const handleNextChapter = useCallback(() => {
    if (adjacentChapters?.next) {
      const chapterNum = adjacentChapters.next.chapter_number;
      if (isCantoMode) {
        navigate(getPathWithPreview(`/lib/${bookId}/${cantoNumber}/${chapterNum}`));
      } else {
        navigate(getPathWithPreview(`/lib/${bookId}/${chapterNum}`));
      }
    }
  }, [adjacentChapters?.next, isCantoMode, navigate, getLocalizedPath, bookId, cantoNumber]);

  // Keyboard shortcuts for chapter navigation
  useKeyboardShortcuts({
    enabled: !isEditingContent,
    shortcuts: [
      {
        key: 'ArrowLeft',
        description: language === 'uk' ? 'Попередня глава' : 'Previous chapter',
        handler: handlePrevChapter,
        category: 'navigation'
      },
      {
        key: 'ArrowRight',
        description: language === 'uk' ? 'Наступна глава' : 'Next chapter',
        handler: handleNextChapter,
        category: 'navigation'
      },
      {
        key: 'ArrowUp',
        description: language === 'uk' ? 'Попередня глава' : 'Previous chapter',
        handler: handlePrevChapter,
        category: 'navigation'
      },
      {
        key: 'ArrowDown',
        description: language === 'uk' ? 'Наступна глава' : 'Next chapter',
        handler: handleNextChapter,
        category: 'navigation'
      },
      {
        key: '[',
        description: language === 'uk' ? 'Попередня глава' : 'Previous chapter',
        handler: handlePrevChapter,
        category: 'navigation'
      },
      {
        key: ']',
        description: language === 'uk' ? 'Наступна глава' : 'Next chapter',
        handler: handleNextChapter,
        category: 'navigation'
      },
    ],
  });

  const readerTextStyle = {
    fontSize: `${fontSize}px`,
    lineHeight: lineHeight
  };

  // Трекінг прогресу читання
  useReadingProgress({
    bookId: book?.id || '',
    bookSlug: bookId || '',
    bookTitle: bookTitle || '',
    chapterNumber: parseInt(effectiveChapterParam || '1'),
    chapterTitle: chapterTitle || '',
    cantoNumber: cantoNumber ? parseInt(cantoNumber) : undefined
  });

  // Mobile Bible-style: свайп для відкриття слайдера віршів
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    swipeStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (swipeStartX.current === null) return;

    const swipeEndX = e.changedTouches[0].clientX;
    const deltaX = swipeStartX.current - swipeEndX;

    // Свайп справа наліво (> 50px) - відкрити слайдер віршів
    if (deltaX > 50 && isMobile) {
      setVerseSliderOpen(true);
    }

    swipeStartX.current = null;
  }, [isMobile]);

  // Прокрутка до вірша при виборі зі слайдера
  const handleVerseSelect = useCallback((verseNumber: string) => {
    const element = verseRefs.current.get(verseNumber);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setCurrentVisibleVerse(verseNumber);
    }
  }, []);

  // Відстеження видимого вірша при скролі (для мобільних)
  useEffect(() => {
    if (!isMobile || verses.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const verseNum = entry.target.getAttribute('data-verse');
            if (verseNum) setCurrentVisibleVerse(verseNum);
          }
        });
      },
      { threshold: 0.5 }
    );

    verseRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isMobile, verses]);

  if (isLoading) {
    return <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background py-8">
          <div className="container mx-auto max-w-5xl px-4">
            <Skeleton className="mb-4 h-8 w-48" />
            <Skeleton className="mb-8 h-12 w-96" />
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
          </div>
        </main>
        <Footer />
      </div>;
  }
  // Build breadcrumb items
  const breadcrumbItems = [
    { name: language === "uk" ? "Головна" : "Home", url: `/${language}` },
    { name: language === "uk" ? "Бібліотека" : "Library", url: `/${language}/library` },
    { name: bookTitle || '', url: `/${language}/lib/${bookId}` },
  ];
  if (isCantoMode && cantoTitle) {
    breadcrumbItems.push({ name: cantoTitle, url: `/${language}/lib/${bookId}/${cantoNumber}` });
  }
  breadcrumbItems.push({ name: chapterTitle || `${language === "uk" ? "Глава" : "Chapter"} ${chapterNumber}`, url: chapterPath });

  return <div
      className="flex min-h-screen flex-col"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* SEO Metadata */}
      <Helmet>
        <title>{`${pageTitle} | ${SITE_CONFIG.siteName}`}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="uk" href={alternateUkUrl} />
        <link rel="alternate" hrefLang="en" href={alternateEnUrl} />
        <link rel="alternate" hrefLang="x-default" href={alternateUkUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content={SITE_CONFIG.siteName} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      {/* Structured Data */}
      {book && effectiveChapterObj && (
        <>
          <ChapterSchema
            bookSlug={bookId || ''}
            bookTitle={bookTitle || ''}
            chapterNumber={parseInt(chapterNumber || '1')}
            chapterTitle={chapterTitle || ''}
            cantoNumber={cantoNumber ? parseInt(cantoNumber) : undefined}
            cantoTitle={cantoTitle || undefined}
            description={pageDescription}
            language={language}
          />
          <BreadcrumbSchema items={breadcrumbItems} />
        </>
      )}

      <Header />
      <main className="flex-1 bg-background py-4 sm:py-8">
        <div className="container mx-auto max-w-6xl px-3 sm:px-4">
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 sticky top-0 z-40 bg-background/95 backdrop-blur-sm py-2 -mx-3 px-3 sm:-mx-4 sm:px-4">
            <Button variant="ghost" onClick={handleBack} className="gap-2" size="sm">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden xs:inline">Назад</span>
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Навігація по главах - ховаємо на мобільних */}
              {!isMobile && adjacentChapters?.prev && <Button variant="outline" size="sm" onClick={() => handleNavigate(adjacentChapters.prev.chapter_number)} className="gap-1 flex-1 sm:flex-none">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{language === "uk" ? "Попередня" : "Previous"}</span>
                </Button>}
              {!isMobile && adjacentChapters?.next && <Button variant="outline" size="sm" onClick={() => handleNavigate(adjacentChapters.next.chapter_number)} className="gap-1 flex-1 sm:flex-none">
                  <span className="hidden sm:inline">{language === "uk" ? "Наступна" : "Next"}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>}
              {/* Admin tools - hidden on mobile */}
              {!isMobile && isAdmin && effectiveChapterObj?.id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/verses/new?chapterId=${effectiveChapterObj.id}`)}
                  className="gap-1 flex-1 sm:flex-none"
                  title={language === "uk" ? "Додати вірш" : "Add verse"}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">{language === "uk" ? "Додати вірш" : "Add verse"}</span>
                </Button>
              )}
              {/* Settings button - hidden on mobile (Spine has settings) */}
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSettingsOpen(true)}
                  title={language === "uk" ? "Налаштування" : "Settings"}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="mb-2 gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap flex items-center justify-center">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-none">{bookTitle}</span>
              {cantoTitle && <>
                  <span className="flex-shrink-0">→</span>
                  <span className="truncate max-w-[200px] sm:max-w-none">{cantoTitle}</span>
                </>}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold break-words text-center md:text-4xl font-serif text-primary">
              {chapterTitle || `Глава ${chapter?.chapter_number}`}
            </h1>
          </div>

          {effectiveChapterObj && (effectiveChapterObj.content_uk || effectiveChapterObj.content_en) &&
           !isLikelyMisimportedVerseContent(effectiveChapterObj.content_uk) &&
           !isLikelyMisimportedVerseContent(effectiveChapterObj.content_en) && (
            <div className="mb-8">
              {/* Edit button - hidden on mobile */}
              {!isMobile && user && !isEditingContent && (
                <div className="mb-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => setIsEditingContent(true)} className="gap-2">
                    <Edit className="h-4 w-4" />
                    {language === "uk" ? "Редагувати" : "Edit"}
                  </Button>
                </div>
              )}

              {isEditingContent ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <EnhancedInlineEditor content={editedContentUk} onChange={setEditedContentUk} label="Українська" />
                    <EnhancedInlineEditor content={editedContentEn} onChange={setEditedContentEn} label="English" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => saveContentMutation.mutate()} disabled={saveContentMutation.isPending} className="gap-2">
                      <Save className="h-4 w-4" />
                      {language === "uk" ? "Зберегти" : "Save"}
                    </Button>
                    <Button variant="outline" onClick={() => {
                setIsEditingContent(false);
                setEditedContentUk(effectiveChapterObj.content_uk || "");
                setEditedContentEn(effectiveChapterObj.content_en || "");
              }} className="gap-2">
                      <X className="h-4 w-4" />
                      {language === "uk" ? "Скасувати" : "Cancel"}
                    </Button>
                  </div>
                </div>
              ) : dualLanguageMode && !isMobile && effectiveChapterObj.content_uk && effectiveChapterObj.content_en ? (
                (() => {
            const splitHtmlIntoParagraphs = (html: string): string[] => {
              const sanitized = DOMPurify.sanitize(html);
              const div = document.createElement("div");
              div.innerHTML = sanitized;
              const paragraphs: string[] = [];
              div.childNodes.forEach(node => {
                if (node.nodeType === 1) {
                  // ELEMENT_NODE
                  const el = node as HTMLElement;
                  // Якщо це блочний елемент - додаємо як є
                  if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'UL', 'OL', 'LI'].includes(el.tagName)) {
                    paragraphs.push(el.outerHTML);
                  } else if (el.tagName === "BR") {
                    // BR пропускаємо
                  } else {
                    paragraphs.push(`<p>${el.outerHTML}</p>`);
                  }
                } else if (node.nodeType === 3 && node.textContent?.trim()) {
                  // TEXT_NODE
                  paragraphs.push(`<p>${node.textContent.trim()}</p>`);
                }
              });
              if (paragraphs.length === 0 && sanitized.trim()) {
                return [sanitized];
              }
              return paragraphs.filter(p => p.length > 0);
            };
            const paragraphsUk = splitHtmlIntoParagraphs(effectiveChapterObj.content_uk || "");
            const paragraphsEn = splitHtmlIntoParagraphs(effectiveChapterObj.content_en || "");

            // Вирівнювання: довший переклад (зазвичай УКР) задає довжину
            const maxLen = Math.max(paragraphsUk.length, paragraphsEn.length);
            const alignedUk = [...paragraphsUk, ...Array(maxLen - paragraphsUk.length).fill("")];
            const alignedEn = [...paragraphsEn, ...Array(maxLen - paragraphsEn.length).fill("")];
            return <div className="space-y-4" style={readerTextStyle}>
                      {alignedUk.map((paraUk, idx) => {
                        const paraEn = alignedEn[idx];
                        return (
                          <div
                            key={idx}
                            className="grid gap-6 md:grid-cols-2"
                          >
                            <div
                              className="prose prose-slate dark:prose-invert max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: sanitizeForRender(paraUk || '<span class="italic text-muted-foreground">—</span>'),
                              }}
                            />
                            <div
                              className="prose prose-slate dark:prose-invert max-w-none border-l border-border pl-6"
                              dangerouslySetInnerHTML={{
                                __html: sanitizeForRender(paraEn || '<span class="italic text-muted-foreground">—</span>'),
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>;
                })()
              ) : (
                <div
                  className="prose prose-slate dark:prose-invert max-w-none"
                  style={readerTextStyle}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeForRender(
                      language === "uk"
                        ? effectiveChapterObj.content_uk || effectiveChapterObj.content_en || ""
                        : effectiveChapterObj.content_en || effectiveChapterObj.content_uk || "",
                    ),
                  }}
                />
              )}
            </div>
          )}

          {/* Mobile Bible-style: суцільний текст з маленькими номерами */}
          {isMobile ? (
            <div
              className="prose prose-lg max-w-none"
              style={readerTextStyle}
              onClick={() => setFullscreenMode(!fullscreenMode)}
            >
              <p className="text-foreground text-justify leading-relaxed">
                {verses.map((verse: Verse) => {
                  const text = language === "uk" ? verse.translation_uk : verse.translation_en;
                  return (
                    <span
                      key={verse.id}
                      ref={(el) => {
                        if (el) verseRefs.current.set(verse.verse_number, el);
                      }}
                      data-verse={verse.verse_number}
                      className="inline"
                    >
                      <sup
                        className="text-primary font-bold text-xs mr-0.5 cursor-pointer hover:text-primary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(getVerseUrl(verse.verse_number));
                        }}
                      >
                        {verse.verse_number}
                      </sup>
                      {stripParagraphTags(text || "") || (
                        <span className="italic text-muted-foreground">—</span>
                      )}{" "}
                    </span>
                  );
                })}
              </p>
            </div>
          ) : flowMode ? <div className="prose prose-lg max-w-none" style={readerTextStyle}>
              {verses.map((verse: Verse) => {
            const text = language === "uk" ? verse.translation_uk : verse.translation_en;
            return <p key={verse.id} className="text-foreground mb-6">
                    {stripParagraphTags(text || "") || <span className="italic text-muted-foreground">
                        {language === "uk" ? "Немає перекладу" : "No translation"}
                      </span>}
                  </p>;
          })}
            </div> : dualLanguageMode ? (
              /* Poetry-style dual language layout - synchronized rows */
              <div className="space-y-6" style={readerTextStyle}>
                {verses.map((verse: Verse) => {
                  const translationUk = verse.translation_uk || "";
                  const translationEn = verse.translation_en || "";
                  return (
                    <div key={verse.id} className="grid gap-6 md:grid-cols-2">
                      {/* Ukrainian */}
                      <p className="text-foreground text-justify leading-relaxed">
                        {showNumbers && (
                          <>
                            <Link
                              to={getVerseUrl(verse.verse_number)}
                              className="text-primary font-semibold hover:text-primary/80 transition-colors"
                            >
                              Вірш {verse.verse_number}:
                            </Link>{" "}
                          </>
                        )}
                        {stripParagraphTags(translationUk) || (
                          <span className="italic text-muted-foreground">Немає перекладу</span>
                        )}
                        {!isMobile && isAdmin && (
                          verseToDelete === verse.id ? (
                            <span className="inline-flex items-center gap-1 ml-2">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteVerseMutation.mutate(verse.id)}
                                disabled={deleteVerseMutation.isPending}
                                className="h-6 px-2 text-xs"
                              >
                                Так
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setVerseToDelete(null)}
                                className="h-6 px-2 text-xs"
                              >
                                Ні
                              </Button>
                            </span>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setVerseToDelete(verse.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0 ml-1 inline-flex"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )
                        )}
                      </p>
                      {/* English */}
                      <p className="text-foreground text-justify leading-relaxed border-l border-border pl-6">
                        {showNumbers && (
                          <>
                            <Link
                              to={getVerseUrl(verse.verse_number)}
                              className="text-primary font-semibold hover:text-primary/80 transition-colors"
                            >
                              Text {verse.verse_number}:
                            </Link>{" "}
                          </>
                        )}
                        {stripParagraphTags(translationEn) || (
                          <span className="italic text-muted-foreground">No translation</span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Single language poetry-style layout */
              <div className="space-y-4 max-w-4xl mx-auto" style={readerTextStyle}>
                {verses.map((verse: Verse) => {
                  const translationUk = verse.translation_uk || "";
                  const translationEn = verse.translation_en || "";
                  return (
                    <p key={verse.id} className="text-foreground text-justify leading-relaxed">
                      {showNumbers && (
                        <>
                          <Link
                            to={getVerseUrl(verse.verse_number)}
                            className="text-primary font-semibold hover:text-primary/80 transition-colors"
                          >
                            {language === "uk" ? `Вірш ${verse.verse_number}:` : `Text ${verse.verse_number}:`}
                          </Link>{" "}
                        </>
                      )}
                      {language === "uk"
                        ? stripParagraphTags(translationUk) || <span className="italic text-muted-foreground">Немає перекладу</span>
                        : stripParagraphTags(translationEn) || <span className="italic text-muted-foreground">No translation</span>
                      }
                      {!isMobile && isAdmin && (
                        verseToDelete === verse.id ? (
                          <span className="inline-flex items-center gap-1 ml-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteVerseMutation.mutate(verse.id)}
                              disabled={deleteVerseMutation.isPending}
                              className="h-6 px-2 text-xs"
                            >
                              {language === "uk" ? "Так" : "Yes"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setVerseToDelete(null)}
                              className="h-6 px-2 text-xs"
                            >
                              {language === "uk" ? "Ні" : "No"}
                            </Button>
                          </span>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setVerseToDelete(verse.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0 ml-1 inline-flex"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )
                      )}
                    </p>
                  );
                })}
              </div>
            )}

          {verses.length === 0}

          {/* Навігація по главах - ховаємо на мобільних (мінімалістичний дизайн) */}
          {!isMobile && (adjacentChapters?.prev || adjacentChapters?.next) && <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
              {adjacentChapters?.prev ? <Button variant="outline" onClick={() => handleNavigate(adjacentChapters.prev.chapter_number)} className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">
                      {language === "uk" ? "Попередня глава" : "Previous Chapter"}
                    </div>
                    <div className="font-medium">
                      {language === "uk" ? adjacentChapters.prev.title_uk : adjacentChapters.prev.title_en}
                    </div>
                  </div>
                </Button> : <div />}

              {adjacentChapters?.next ? <Button variant="outline" onClick={() => handleNavigate(adjacentChapters.next.chapter_number)} className="gap-2">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {language === "uk" ? "Наступна глава" : "Next Chapter"}
                    </div>
                    <div className="font-medium">
                      {language === "uk" ? adjacentChapters.next.title_uk : adjacentChapters.next.title_en}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button> : <div />}
            </div>}
        </div>
      </main>
      <Footer />

      <GlobalSettingsPanel
        isOpen={settingsOpen}
        onOpenChange={setSettingsOpen}
        showFloatingButton={false}
      />

      {/* Mobile Verse Slider - бокова стрічка навігації */}
      {isMobile && verses.length > 0 && (
        <VerseSlider
          verses={verses.map(v => ({ id: v.id, verse_number: v.verse_number }))}
          currentVerseNumber={currentVisibleVerse || verses[0]?.verse_number}
          onVerseSelect={handleVerseSelect}
          isOpen={verseSliderOpen}
          onClose={() => setVerseSliderOpen(false)}
        />
      )}

      {/* Text Selection Tooltip for copy/share */}
      <SelectionTooltip
        isVisible={selectionTooltipVisible}
        position={selectionTooltipPosition}
        selectedText={selectedTextForHighlight}
        onClose={() => setSelectionTooltipVisible(false)}
        onCopy={handleCopySelectedText}
        onShare={handleShareSelectedText}
      />
    </div>;
};