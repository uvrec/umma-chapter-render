// src/pages/TimelinePage.tsx
// Timeline page showing reading history - bookmarks, highlights, notes
// Сторінка з історією читання у стилі Neu Bible

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, isToday, isYesterday, isThisWeek, parseISO } from "date-fns";
import { uk, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserContent, Bookmark, Highlight, Note, HIGHLIGHT_COLORS } from "@/contexts/UserContentContext";
import { useBooksContext } from "@/contexts/BooksContext";
import { cn } from "@/lib/utils";
import {
  Bookmark as BookmarkIcon,
  Highlighter,
  StickyNote,
  ChevronRight,
  Clock,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type TimelineItem = {
  type: "bookmark" | "highlight" | "note";
  id: string;
  createdAt: string;
  data: Bookmark | Highlight | Note;
};

export default function TimelinePage() {
  const { t, language, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();
  const { books } = useBooksContext();
  const {
    bookmarks,
    highlights,
    notes,
    removeBookmark,
    removeHighlight,
    removeNote,
    getStats,
  } = useUserContent();

  const [deleteItem, setDeleteItem] = useState<TimelineItem | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "bookmarks" | "highlights" | "notes">("all");

  const stats = getStats();
  const dateLocale = language === "uk" ? uk : enUS;

  // Combine all items into a single timeline
  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [
      ...bookmarks.map((b) => ({ type: "bookmark" as const, id: b.id, createdAt: b.createdAt, data: b })),
      ...highlights.map((h) => ({ type: "highlight" as const, id: h.id, createdAt: h.createdAt, data: h })),
      ...notes.map((n) => ({ type: "note" as const, id: n.id, createdAt: n.createdAt, data: n })),
    ];

    // Filter by tab
    const filtered = activeTab === "all"
      ? items
      : items.filter((item) => item.type === activeTab.slice(0, -1)); // Remove 's' from tab name

    // Sort by date, newest first
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookmarks, highlights, notes, activeTab]);

  // Group items by date
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: TimelineItem[] } = {};

    timelineItems.forEach((item) => {
      const date = parseISO(item.createdAt);
      let groupKey: string;

      if (isToday(date)) {
        groupKey = t("Сьогодні", "Today");
      } else if (isYesterday(date)) {
        groupKey = t("Вчора", "Yesterday");
      } else if (isThisWeek(date)) {
        groupKey = format(date, "EEEE", { locale: dateLocale });
      } else {
        groupKey = format(date, "d MMMM yyyy", { locale: dateLocale });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    return groups;
  }, [timelineItems, t, dateLocale]);

  // Get book name by slug
  const getBookName = (bookSlug: string) => {
    const book = books?.find((b) => b.id === bookSlug);
    if (!book) return bookSlug;
    return language === "uk" ? (book.name_uk || book.name_en || bookSlug) : (book.name_en || book.name_uk || bookSlug);
  };

  // Handle item click - navigate to verse
  const handleItemClick = (item: TimelineItem) => {
    const data = item.data;
    const basePath = data.cantoNumber
      ? `/lib/${data.bookSlug}/${data.cantoNumber}/${data.chapterNumber}/${data.verseNumber}`
      : `/lib/${data.bookSlug}/${data.chapterNumber}/${data.verseNumber}`;
    navigate(getLocalizedPath(basePath));
  };

  // Handle delete
  const handleDelete = () => {
    if (!deleteItem) return;

    switch (deleteItem.type) {
      case "bookmark":
        removeBookmark(deleteItem.id);
        break;
      case "highlight":
        removeHighlight(deleteItem.id);
        break;
      case "note":
        removeNote(deleteItem.id);
        break;
    }
    setDeleteItem(null);
  };

  // Get icon for item type
  const getIcon = (type: TimelineItem["type"]) => {
    switch (type) {
      case "bookmark":
        return <BookmarkIcon className="h-5 w-5 text-brand-500" />;
      case "highlight":
        return <Highlighter className="h-5 w-5 text-yellow-500" />;
      case "note":
        return <StickyNote className="h-5 w-5 text-blue-500" />;
    }
  };

  // Get highlight color class
  const getHighlightColorClass = (color: string) => {
    const colorDef = HIGHLIGHT_COLORS.find((c) => c.id === color);
    return colorDef?.className || "bg-yellow-200";
  };

  const isEmpty = timelineItems.length === 0;

  return (
    <div className="min-h-screen bg-background pl-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-serif font-semibold">
            {t("Історія", "Timeline")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t(
              "Ваші закладки, виділення та нотатки",
              "Your bookmarks, highlights, and notes"
            )}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="w-full justify-start px-4 pb-2 bg-transparent">
            <TabsTrigger value="all" className="gap-1.5">
              <Clock className="h-4 w-4" />
              {t("Все", "All")}
              <span className="text-xs text-muted-foreground">
                ({stats.bookmarks + stats.highlights + stats.notes})
              </span>
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="gap-1.5">
              <BookmarkIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{t("Закладки", "Bookmarks")}</span>
              <span className="text-xs text-muted-foreground">({stats.bookmarks})</span>
            </TabsTrigger>
            <TabsTrigger value="highlights" className="gap-1.5">
              <Highlighter className="h-4 w-4" />
              <span className="hidden sm:inline">{t("Виділення", "Highlights")}</span>
              <span className="text-xs text-muted-foreground">({stats.highlights})</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-1.5">
              <StickyNote className="h-4 w-4" />
              <span className="hidden sm:inline">{t("Нотатки", "Notes")}</span>
              <span className="text-xs text-muted-foreground">({stats.notes})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {/* Content */}
      <main className="px-4 py-4">
        {isEmpty ? (
          <EmptyState type={activeTab} t={t} />
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([dateGroup, items]) => (
              <div key={dateGroup}>
                {/* Date Group Header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {dateGroup}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">
                    {format(parseISO(items[0].createdAt), "HH:mm")}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {items.map((item) => (
                    <TimelineItemCard
                      key={item.id}
                      item={item}
                      getBookName={getBookName}
                      getIcon={getIcon}
                      getHighlightColorClass={getHighlightColorClass}
                      onClick={() => handleItemClick(item)}
                      onDelete={() => setDeleteItem(item)}
                      language={language}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("Видалити?", "Delete?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "Цю дію неможливо скасувати.",
                "This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("Скасувати", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {t("Видалити", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Timeline Item Card Component
function TimelineItemCard({
  item,
  getBookName,
  getIcon,
  getHighlightColorClass,
  onClick,
  onDelete,
  language,
}: {
  item: TimelineItem;
  getBookName: (slug: string) => string;
  getIcon: (type: TimelineItem["type"]) => React.ReactNode;
  getHighlightColorClass: (color: string) => string;
  onClick: () => void;
  onDelete: () => void;
  language: string;
}) {
  const data = item.data;

  // Get preview text based on item type
  const getPreviewText = () => {
    if (item.type === "highlight") {
      const highlight = data as Highlight;
      return highlight.text;
    }
    if (item.type === "note") {
      const note = data as Note;
      return note.content;
    }
    return null;
  };

  const previewText = getPreviewText();

  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-3 rounded-lg",
        "bg-card hover:bg-muted/50 active:bg-muted transition-colors",
        "border border-transparent hover:border-border"
      )}
    >
      {/* Icon */}
      <div className="mt-0.5">{getIcon(item.type)}</div>

      {/* Content */}
      <button
        onClick={onClick}
        className="flex-1 min-w-0 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{data.verseRef}</span>
          <span className="text-xs text-muted-foreground">
            {getBookName(data.bookSlug)}
          </span>
        </div>

        {/* Preview text for highlights and notes */}
        {previewText && (
          <p
            className={cn(
              "text-sm mt-1 line-clamp-2",
              item.type === "highlight" && getHighlightColorClass((data as Highlight).color),
              item.type === "highlight" && "px-1.5 py-0.5 rounded inline-block",
              item.type === "note" && "text-muted-foreground italic"
            )}
          >
            {previewText.length > 100 ? previewText.substring(0, 100) + "..." : previewText}
          </p>
        )}

        {/* Tags for notes */}
        {item.type === "note" && (data as Note).tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {(data as Note).tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 bg-muted rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({
  type,
  t,
}: {
  type: "all" | "bookmarks" | "highlights" | "notes";
  t: (uk: string, en: string) => string;
}) {
  const getEmptyMessage = () => {
    switch (type) {
      case "bookmarks":
        return {
          icon: <BookmarkIcon className="h-16 w-16" />,
          title: t("Немає закладок", "No Bookmarks"),
          description: t(
            "Додавайте закладки до улюблених віршів для швидкого доступу",
            "Add bookmarks to your favorite verses for quick access"
          ),
        };
      case "highlights":
        return {
          icon: <Highlighter className="h-16 w-16" />,
          title: t("Немає виділень", "No Highlights"),
          description: t(
            "Виділяйте важливі фрагменти тексту під час читання",
            "Highlight important text passages while reading"
          ),
        };
      case "notes":
        return {
          icon: <StickyNote className="h-16 w-16" />,
          title: t("Немає нотаток", "No Notes"),
          description: t(
            "Записуйте свої думки та роздуми до віршів",
            "Write down your thoughts and reflections on verses"
          ),
        };
      default:
        return {
          icon: <Clock className="h-16 w-16" />,
          title: t("Ваша історія порожня", "Your Timeline is Empty"),
          description: t(
            "Тут з'являтимуться ваші закладки, виділення та нотатки",
            "Your bookmarks, highlights, and notes will appear here"
          ),
        };
    }
  };

  const { icon, title, description } = getEmptyMessage();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-muted-foreground/30 mb-4">{icon}</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}
