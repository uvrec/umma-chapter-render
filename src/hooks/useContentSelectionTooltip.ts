/**
 * Хук для виділення тексту з тултіпом (Copy / Share / Highlight) у листах та лекціях.
 * Повний аналог функціоналу SelectionTooltip в читальці (VedaReaderDB),
 * включаючи збереження хайлайтів з нотатками.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { useHighlights, type CreateHighlightParams } from "@/hooks/useHighlights";

interface UseContentSelectionTooltipOptions {
  /** Заголовок контенту для копіювання/шерінгу */
  title: string;
  /** Повний шлях поточної сторінки (для посилання) */
  path: string;
  /** ID листа (для збереження хайлайтів) */
  letterId?: string;
  /** ID лекції (для збереження хайлайтів) */
  lectureId?: string;
}

export function useContentSelectionTooltip({ title, path, letterId, lectureId }: UseContentSelectionTooltipOptions) {
  const [selectionTooltipVisible, setSelectionTooltipVisible] = useState(false);
  const [selectionTooltipPosition, setSelectionTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [selectionContext, setSelectionContext] = useState({ before: "", after: "" });
  const [highlightDialogOpen, setHighlightDialogOpen] = useState(false);
  const selectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Highlights hook для збереження
  const { createHighlight } = useHighlights(
    undefined,
    false,
    { letterId, lectureId }
  );

  const handleTextSelection = useCallback(() => {
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
      selectionTimeoutRef.current = null;
    }

    // Не перехоплювати виділення в редагованих елементах
    const editableElement = document.activeElement as HTMLElement;
    if (
      editableElement?.tagName === "TEXTAREA" ||
      editableElement?.tagName === "INPUT" ||
      editableElement?.contentEditable === "true" ||
      editableElement?.closest('[contenteditable="true"]')
    ) {
      return;
    }

    const selection = window.getSelection();
    const selText = selection?.toString().trim();

    // Мінімум 10 символів і має містити пробіл (не одне слово)
    if (!selText || selText.length < 10 || !/\s/.test(selText)) {
      return;
    }

    const range = selection?.getRangeAt(0);
    if (!range) return;

    // Позиція тултіпа (viewport-relative для position: fixed)
    const rects = range.getClientRects();
    let tooltipX: number;
    let tooltipY: number;

    if (rects.length > 0) {
      const firstRect = rects[0];
      tooltipX = firstRect.left + firstRect.width / 2;
      tooltipY = firstRect.top;
    } else {
      const rect = range.getBoundingClientRect();
      tooltipX = rect.left + rect.width / 2;
      tooltipY = rect.top;
    }

    // Контекст (текст до і після виділення)
    let before = "";
    let after = "";
    try {
      if (range.startContainer.nodeType === Node.TEXT_NODE) {
        const text = range.startContainer.textContent || "";
        before = text.substring(Math.max(0, range.startOffset - 50), range.startOffset);
      }
      if (range.endContainer.nodeType === Node.TEXT_NODE) {
        const text = range.endContainer.textContent || "";
        after = text.substring(range.endOffset, Math.min(text.length, range.endOffset + 50));
      }
    } catch {
      // Ігноруємо помилки контексту
    }

    // Затримка 700ms перед показом
    selectionTimeoutRef.current = setTimeout(() => {
      const currentSelection = window.getSelection()?.toString().trim();
      if (currentSelection === selText) {
        setSelectedText(selText);
        setSelectionContext({ before, after });
        setSelectionTooltipPosition({ x: tooltipX, y: tooltipY });
        setSelectionTooltipVisible(true);
      }
    }, 700);
  }, []);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    const selText = selection?.toString().trim();
    if (!selText || selText.length < 10) {
      setSelectionTooltipVisible(false);
    }
  }, []);

  // Слухачі подій
  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (selectionTimeoutRef.current) clearTimeout(selectionTimeoutRef.current);
    };
  }, [handleTextSelection, handleSelectionChange]);

  // Копіювати виділений текст з посиланням
  const handleCopy = useCallback(async () => {
    if (!selectedText) return;
    const url = `${window.location.origin}${path}`;
    const text = `${selectedText}\n\n— ${title}\n${url}`;
    await navigator.clipboard.writeText(text);
  }, [selectedText, title, path]);

  // Поділитися виділеним текстом
  const handleShare = useCallback(async () => {
    if (!selectedText) return;
    const url = `${window.location.origin}${path}`;
    const shareText = `${selectedText}\n\n— ${title}`;

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, url });
      } catch {
        // Користувач скасував — фолбек на копіювання
        await navigator.clipboard.writeText(`${shareText}\n${url}`);
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
    }
  }, [selectedText, title, path]);

  // Відкрити діалог збереження хайлайту
  const handleOpenHighlightDialog = useCallback(() => {
    setSelectionTooltipVisible(false);
    setHighlightDialogOpen(true);
  }, []);

  // Зберегти хайлайт з нотаткою та кольором
  const handleSaveHighlight = useCallback((notes: string, color: string) => {
    if (!selectedText) return;

    const params: CreateHighlightParams = {
      selected_text: selectedText,
      context_before: selectionContext.before || undefined,
      context_after: selectionContext.after || undefined,
      notes: notes || undefined,
      highlight_color: color || "yellow",
    };

    if (letterId) {
      params.letter_id = letterId;
    } else if (lectureId) {
      params.lecture_id = lectureId;
    }

    createHighlight(params);
    setHighlightDialogOpen(false);
  }, [selectedText, selectionContext, letterId, lectureId, createHighlight]);

  return {
    selectionTooltipVisible,
    selectionTooltipPosition,
    selectedText,
    setSelectionTooltipVisible,
    handleCopy,
    handleShare,
    // Highlight (save note) support
    highlightDialogOpen,
    setHighlightDialogOpen,
    handleOpenHighlightDialog,
    handleSaveHighlight,
  };
}
