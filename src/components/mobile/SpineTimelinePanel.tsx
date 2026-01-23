// src/components/mobile/SpineTimelinePanel.tsx
// Панель Timeline з закладками та виділеними віршами
// Мінімалістичний дизайн у стилі Neu Bible

import { useNavigate } from "react-router-dom";
import { Bookmark, Minus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTimeline, TimelineItem } from "@/contexts/TimelineContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SpineTimelinePanelProps {
  open: boolean;
  onClose: () => void;
}

// Format date in Neu Bible style: "19. JAN 2026 | 16:37"
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString("en", { month: "short" }).toUpperCase();
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}. ${month} ${year} | ${hours}:${minutes}`;
}

// Get display name for verse reference
function getVerseDisplay(item: TimelineItem): string {
  if (item.canto) {
    return `${item.bookName} ${item.canto}.${item.chapter}.${item.verse}`;
  }
  return `${item.bookName} ${item.chapter}:${item.verse}`;
}

interface TimelineItemCardProps {
  item: TimelineItem;
  onNavigate: () => void;
  onRemove: () => void;
}

function TimelineItemCard({ item, onNavigate, onRemove }: TimelineItemCardProps) {
  const isBookmark = item.type === "bookmark";

  return (
    <div className="relative pl-8 pb-6 border-l-2 border-muted ml-4">
      {/* Icon on the timeline line */}
      <div
        className={cn(
          "absolute left-0 -translate-x-1/2 w-12 h-12 rounded-full",
          "flex items-center justify-center",
          "border-2 bg-background",
          isBookmark ? "border-brand-500 text-brand-500" : "border-muted-foreground text-muted-foreground"
        )}
      >
        {isBookmark ? (
          <Bookmark className="w-5 h-5 fill-current" />
        ) : (
          <Minus className="w-5 h-5" />
        )}
      </div>

      {/* Content */}
      <div className="ml-6 cursor-pointer" onClick={onNavigate}>
        {/* Date */}
        <p className="text-xs font-medium text-brand-500 tracking-wide mb-1">
          {formatDate(item.createdAt)}
        </p>

        {/* Excerpt */}
        <p className="text-foreground text-lg font-serif leading-relaxed mb-1">
          {item.excerpt.length > 80 ? item.excerpt.substring(0, 80) + "..." : item.excerpt}
        </p>

        {/* Verse reference */}
        <p className="text-sm italic text-brand-400">
          {getVerseDisplay(item)}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute right-0 top-0 p-2 text-muted-foreground hover:text-destructive transition-colors"
        aria-label="Remove"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function EmptyTimeline() {
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
      {/* Circle icon */}
      <div className="w-20 h-20 rounded-full border-2 border-muted flex items-center justify-center mb-6">
        <Minus className="w-8 h-8 text-muted-foreground" />
      </div>

      <h2 className="text-2xl font-serif text-foreground mb-2">
        {t("Ласкаво просимо", "Welcome to")}
      </h2>
      <h2 className="text-2xl font-serif text-foreground mb-4">
        {t("до вашої Хронології", "your Timeline")}
      </h2>

      <p className="text-muted-foreground italic text-sm leading-relaxed">
        {t(
          "Легко повертайтесь і переглядайте всі вірші, які ви виділили.",
          "Easily go back and rediscover all of the verses you've highlighted."
        )}
      </p>
    </div>
  );
}

export function SpineTimelinePanel({ open, onClose }: SpineTimelinePanelProps) {
  const navigate = useNavigate();
  const { t, getLocalizedPath } = useLanguage();
  const { items, bookmarks, removeItem } = useTimeline();

  const handleNavigate = (item: TimelineItem) => {
    // Build verse URL
    let url = `/lib/${item.bookSlug}`;
    if (item.canto) {
      url += `/${item.canto}`;
    }
    url += `/${item.chapter}/${item.verse}`;

    navigate(getLocalizedPath(url));
    onClose();
  };

  // Group items: show bookmarks at top, then highlights by date
  const latestBookmark = bookmarks[0];
  const timelineItems = items.filter(item => item !== latestBookmark);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="left"
        className="w-[calc(100vw-4rem)] sm:w-[400px] p-0 border-r-0 ml-16"
      >
        <div className="h-full flex flex-col bg-background">
          {/* Header with latest bookmark */}
          {latestBookmark && (
            <div
              className="p-6 border-b cursor-pointer"
              onClick={() => handleNavigate(latestBookmark)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-brand-500 flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-brand-500 fill-brand-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-brand-500 tracking-wider uppercase">
                    {t("Закладка", "Bookmark")}
                  </p>
                  <p className="text-lg font-serif text-foreground">
                    {latestBookmark.bookName} {latestBookmark.chapter}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline content */}
          {items.length === 0 ? (
            <EmptyTimeline />
          ) : (
            <div className="flex-1 overflow-y-auto p-6">
              {timelineItems.map((item) => (
                <TimelineItemCard
                  key={item.id}
                  item={item}
                  onNavigate={() => handleNavigate(item)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SpineTimelinePanel;
