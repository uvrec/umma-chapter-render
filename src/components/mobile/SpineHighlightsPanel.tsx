// src/components/mobile/SpineHighlightsPanel.tsx
// ✅ REMEMBER BETTER: Mobile highlights timeline panel (Neu Bible-style)
// Показує виділення згруповані за сесіями/датами для мобільного читання

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Highlighter, ChevronRight, Calendar, BookOpen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHighlights, groupHighlightsByTimeline, getHighlightReference, type HighlightGroup } from "@/hooks/useHighlights";
import { Button } from "@/components/ui/button";

interface SpineHighlightsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SpineHighlightsPanel({ open, onClose }: SpineHighlightsPanelProps) {
  const navigate = useNavigate();
  const { t, getLocalizedPath, language } = useLanguage();
  const { highlights, isLoading, deleteHighlight } = useHighlights(undefined, true); // Fetch all highlights
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // ✅ Smooth translate-x animation on open/close
  useEffect(() => {
    if (open && !isVisible) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
    } else if (!open && isAnimating) {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open, isVisible, isAnimating]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300); // Match transition duration
  };

  // ✅ Group highlights by timeline (sessions/dates)
  const timelineGroups = useMemo(() => {
    return groupHighlightsByTimeline(highlights || [], language as "uk" | "en");
  }, [highlights, language]);

  const toggleGroup = (date: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  };

  const handleHighlightClick = (highlight: any) => {
    if (!highlight.book?.slug) return;

    // Build path based on book structure
    const bookSlug = highlight.book.slug;
    const chapterNum = highlight.chapter?.chapter_number;
    const verseNum = highlight.verse_number;

    let path = `/lib/${bookSlug}`;
    if (chapterNum) path += `/${chapterNum}`;
    if (verseNum) path += `/${verseNum}`;

    navigate(getLocalizedPath(path));
    handleClose();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm(t("Видалити це виділення?", "Delete this highlight?"))) {
      deleteHighlight(id);
    }
  };

  // Get highlight color as CSS class
  const getHighlightColorClass = (color: string) => {
    switch (color) {
      case "yellow": return "bg-yellow-200/60 dark:bg-yellow-500/30";
      case "green": return "bg-green-200/60 dark:bg-green-500/30";
      case "blue": return "bg-blue-200/60 dark:bg-blue-500/30";
      case "pink": return "bg-pink-200/60 dark:bg-pink-500/30";
      case "orange": return "bg-orange-200/60 dark:bg-orange-500/30";
      default: return "bg-yellow-200/60 dark:bg-yellow-500/30";
    }
  };

  if (!isVisible && !open) return null;

  return (
    <div
      className={cn(
        "fixed left-14 top-0 bottom-0 z-[40] flex flex-col",
        "transition-transform duration-300 ease-out",
        isAnimating ? "translate-x-0" : "-translate-x-full"
      )}
      style={{ width: 'calc(100% - 56px)' }}
    >
      {/* Timeline Content */}
      <div
        className="flex-1 bg-background overflow-y-auto"
        onClick={handleClose}
      >
        {/* Close button */}
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground p-2 -mr-2 transition-colors"
            aria-label={t("Закрити", "Close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
          {/* Loading */}
          {isLoading && (
            <div className="py-8 text-center text-muted-foreground">
              {t("Завантаження...", "Loading...")}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && (!highlights || highlights.length === 0) && (
            <div className="py-16 text-center">
              <Highlighter className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-muted-foreground">
                {t("Виділення ще немає", "No highlights yet")}
              </p>
              <p className="text-sm text-muted-foreground/60 mt-2">
                {t(
                  "Виділіть текст під час читання, щоб зберегти його тут",
                  "Select text while reading to save it here"
                )}
              </p>
            </div>
          )}

          {/* Timeline groups */}
          {!isLoading && timelineGroups.length > 0 && (
            <div className="space-y-1">
              {timelineGroups.map((group) => {
                const isExpanded = expandedGroups.has(group.date) || timelineGroups.length <= 3;

                return (
                  <div key={group.date} className="rounded-lg overflow-hidden">
                    {/* Date header - clickable to expand/collapse */}
                    <button
                      onClick={() => toggleGroup(group.date)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 text-left",
                        "bg-muted/30 hover:bg-muted/50 transition-colors"
                      )}
                    >
                      <Calendar className="h-4 w-4 text-brand-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex-1">
                        {group.label}
                      </span>
                      <span className="text-xs text-muted-foreground/60 mr-2">
                        {group.highlights.length}
                      </span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          isExpanded && "rotate-90"
                        )}
                      />
                    </button>

                    {/* Highlights in this group */}
                    {isExpanded && (
                      <div className="divide-y divide-border/50">
                        {group.highlights.map((highlight) => (
                          <button
                            key={highlight.id}
                            onClick={() => handleHighlightClick(highlight)}
                            className={cn(
                              "w-full flex flex-col gap-1 px-3 py-3 text-left",
                              "hover:bg-muted/30 active:bg-muted/50 transition-colors"
                            )}
                          >
                            {/* Reference */}
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-brand-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                                {getHighlightReference(highlight, language as "uk" | "en")}
                              </span>
                              {/* Delete button */}
                              <button
                                onClick={(e) => handleDelete(e, highlight.id)}
                                className="ml-auto p-1 text-muted-foreground/40 hover:text-destructive transition-colors"
                                aria-label={t("Видалити", "Delete")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Highlighted text with background color */}
                            <div className={cn(
                              "text-sm text-foreground line-clamp-3 px-2 py-1 rounded",
                              getHighlightColorClass(highlight.highlight_color)
                            )}>
                              "{highlight.selected_text}"
                            </div>

                            {/* Notes if any */}
                            {highlight.notes && (
                              <p className="text-xs text-muted-foreground italic pl-2">
                                {highlight.notes}
                              </p>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tap to close hint */}
          {!isLoading && timelineGroups.length > 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground/40 text-sm italic">
                {t("Торкніться виділення для переходу", "Tap a highlight to navigate")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpineHighlightsPanel;
