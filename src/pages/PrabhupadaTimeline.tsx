// src/pages/PrabhupadaTimeline.tsx
// Unified timeline of Prabhupada's activities: lectures, letters, diary entries
// Uses RPC function get_prabhupada_timeline for aggregated data

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Mic, Mail, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface TimelineItem {
  event_date: string;
  event_type: "lecture" | "letter" | "diary";
  title_en: string;
  title_uk: string | null;
  location_en: string | null;
  location_uk: string | null;
  slug: string;
  extra_type: string | null;
  book_slug: string | null;
  chapter_number: number | null;
  verse_number: string | null;
}

interface YearStats {
  year: number;
  lecture_count: number;
  letter_count: number;
  diary_count: number;
}

// Prabhupada's active years (1966-1977)
const YEARS = [1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977];

const MONTHS_UK = [
  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
];

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

type EventFilter = "all" | "lecture" | "letter" | "diary";

export function PrabhupadaTimeline() {
  const navigate = useNavigate();
  const { language, t, getLocalizedPath } = useLanguage();
  const [selectedYear, setSelectedYear] = useState(1966);
  const [selectedMonth, setSelectedMonth] = useState(1); // 1-12
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState<EventFilter>("all");
  const yearScrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Fetch year statistics
  const { data: yearStats } = useQuery({
    queryKey: ["timeline-years"],
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)("get_timeline_years");
      if (error) throw error;
      return (data || []) as YearStats[];
    },
  });

  // Get event types for RPC call
  const eventTypes = useMemo(() => {
    if (eventFilter === "all") return ["lecture", "letter", "diary"];
    return [eventFilter];
  }, [eventFilter]);

  // Fetch timeline items for selected year/month
  const { data: timelineItems, isLoading } = useQuery({
    queryKey: ["prabhupada-timeline", selectedYear, selectedMonth, eventTypes],
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)("get_prabhupada_timeline", {
        p_year: selectedYear,
        p_month: selectedMonth,
        p_event_types: eventTypes,
      });
      if (error) throw error;
      return (data || []) as TimelineItem[];
    },
  });

  // Get unique locations from current items
  const locations = useMemo(() => {
    if (!timelineItems) return [];
    const uniqueLocations = new Set<string>();
    timelineItems.forEach(item => {
      if (item.location_en) uniqueLocations.add(item.location_en);
    });
    return Array.from(uniqueLocations).sort();
  }, [timelineItems]);

  // Filter by location
  const filteredItems = useMemo(() => {
    if (!timelineItems) return [];
    if (!selectedLocation) return timelineItems;
    return timelineItems.filter(item => item.location_en === selectedLocation);
  }, [timelineItems, selectedLocation]);

  // Count items for current month
  const monthItemCount = useMemo(() => {
    return timelineItems?.length || 0;
  }, [timelineItems]);

  // Get stats for current year
  const currentYearStats = useMemo(() => {
    if (!yearStats) return null;
    return yearStats.find(y => y.year === selectedYear);
  }, [yearStats, selectedYear]);

  // Scroll to selected year
  useEffect(() => {
    if (yearScrollRef.current) {
      const yearIndex = YEARS.indexOf(selectedYear);
      const scrollPosition = yearIndex * 80 - (window.innerWidth / 2) + 40;
      yearScrollRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }
  }, [selectedYear]);

  // Month navigation
  const goToPrevMonth = useCallback(() => {
    if (selectedMonth === 1) {
      const prevYear = YEARS[YEARS.indexOf(selectedYear) - 1];
      if (prevYear) {
        setSelectedYear(prevYear);
        setSelectedMonth(12);
      }
    } else {
      setSelectedMonth(m => m - 1);
    }
    setSelectedLocation(null);
  }, [selectedMonth, selectedYear]);

  const goToNextMonth = useCallback(() => {
    if (selectedMonth === 12) {
      const nextYear = YEARS[YEARS.indexOf(selectedYear) + 1];
      if (nextYear) {
        setSelectedYear(nextYear);
        setSelectedMonth(1);
      }
    } else {
      setSelectedMonth(m => m + 1);
    }
    setSelectedLocation(null);
  }, [selectedMonth, selectedYear]);

  // Touch handlers for month swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        goToPrevMonth();
      } else {
        goToNextMonth();
      }
    }
    touchStartX.current = null;
  };

  // Navigate to item
  const handleItemClick = (item: TimelineItem) => {
    switch (item.event_type) {
      case "lecture":
        navigate(getLocalizedPath(`/library/lectures/${item.slug}`));
        break;
      case "letter":
        navigate(getLocalizedPath(`/library/letters/${item.slug}`));
        break;
      case "diary":
        // Diary slug is "canto/chapter/verse-slug", prepend book slug
        navigate(getLocalizedPath(`/lib/td/${item.slug}`));
        break;
    }
  };

  const monthNames = language === "uk" ? MONTHS_UK : MONTHS_EN;

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  // Get location display
  const getLocationDisplay = (item: TimelineItem) => {
    if (!item.location_en) return null;
    return language === "uk" ? (item.location_uk || item.location_en) : item.location_en;
  };

  // Get title display
  const getTitleDisplay = (item: TimelineItem) => {
    return language === "uk" ? (item.title_uk || item.title_en) : item.title_en;
  };

  // Get icon for event type
  const getIcon = (type: TimelineItem["event_type"]) => {
    switch (type) {
      case "lecture":
        return <Mic className="h-5 w-5" />;
      case "letter":
        return <Mail className="h-5 w-5" />;
      case "diary":
        return <BookOpen className="h-5 w-5" />;
    }
  };

  // Get event type label
  const getEventTypeLabel = (type: TimelineItem["event_type"]) => {
    switch (type) {
      case "lecture":
        return t("Лекція", "Lecture");
      case "letter":
        return t("Лист", "Letter");
      case "diary":
        return t("Щоденник", "Diary");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background min-h-screen pl-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-serif font-semibold">
            {t("Таймлайн", "Timeline")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("Хронологія життя Шріли Прабгупади", "Chronology of Srila Prabhupada's life")}
          </p>
        </div>

        {/* Event type filter */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setEventFilter("all")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              eventFilter === "all"
                ? "bg-brand-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {t("Все", "All")}
            {currentYearStats && (
              <span className="text-xs opacity-75">
                ({currentYearStats.lecture_count + currentYearStats.letter_count + currentYearStats.diary_count})
              </span>
            )}
          </button>
          <button
            onClick={() => setEventFilter("lecture")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              eventFilter === "lecture"
                ? "bg-brand-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <Mic className="h-3.5 w-3.5" />
            {t("Лекції", "Lectures")}
            {currentYearStats && (
              <span className="text-xs opacity-75">({currentYearStats.lecture_count})</span>
            )}
          </button>
          <button
            onClick={() => setEventFilter("letter")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              eventFilter === "letter"
                ? "bg-brand-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <Mail className="h-3.5 w-3.5" />
            {t("Листи", "Letters")}
            {currentYearStats && (
              <span className="text-xs opacity-75">({currentYearStats.letter_count})</span>
            )}
          </button>
          <button
            onClick={() => setEventFilter("diary")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              eventFilter === "diary"
                ? "bg-brand-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            {t("Щоденник", "Diary")}
            {currentYearStats && (
              <span className="text-xs opacity-75">({currentYearStats.diary_count})</span>
            )}
          </button>
        </div>
      </header>

      {/* Years horizontal scroll */}
      <div
        ref={yearScrollRef}
        className="flex overflow-x-auto scrollbar-hide py-4 px-2 border-b border-border/50"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {YEARS.map((year) => {
          const stats = yearStats?.find(y => y.year === year);
          const hasData = stats && (stats.lecture_count > 0 || stats.letter_count > 0 || stats.diary_count > 0);

          return (
            <button
              key={year}
              onClick={() => {
                setSelectedYear(year);
                setSelectedLocation(null);
              }}
              className={cn(
                "flex-shrink-0 w-20 py-2 text-center font-serif text-lg transition-all",
                "scroll-snap-align-center",
                selectedYear === year
                  ? "text-brand-600 font-bold scale-110"
                  : hasData
                    ? "text-foreground hover:text-brand-500"
                    : "text-muted-foreground/50"
              )}
            >
              {year}
            </button>
          );
        })}
      </div>

      {/* Month selector with swipe */}
      <div
        className="flex items-center justify-between px-4 py-6 border-b border-border/50"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          onClick={goToPrevMonth}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={t("Попередній місяць", "Previous month")}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="text-center">
          <h2 className="text-xl font-serif font-medium">
            {monthNames[selectedMonth - 1]} {selectedYear}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {monthItemCount} {t("записів", "entries")}
          </p>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={t("Наступний місяць", "Next month")}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Location filter chips */}
      {locations.length > 1 && (
        <div className="flex overflow-x-auto scrollbar-hide gap-2 px-4 py-3 border-b border-border/50">
          <button
            onClick={() => setSelectedLocation(null)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              selectedLocation === null
                ? "bg-brand-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {t("Всі", "All")}
          </button>
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => setSelectedLocation(location)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                selectedLocation === location
                  ? "bg-brand-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {location}
            </button>
          ))}
        </div>
      )}

      {/* Timeline list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-muted-foreground">{t("Завантаження...", "Loading...")}</div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              {t("Записів за цей період не знайдено", "No entries found for this period")}
            </p>
            {selectedLocation && (
              <button
                onClick={() => setSelectedLocation(null)}
                className="mt-2 text-sm text-brand-500 hover:underline"
              >
                {t("Показати всі локації", "Show all locations")}
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredItems.map((item, index) => (
              <button
                key={`${item.event_type}-${item.slug}-${index}`}
                onClick={() => handleItemClick(item)}
                className="w-full flex items-start gap-4 p-4 text-left hover:bg-muted/50 active:bg-muted transition-colors"
              >
                {/* Date circle */}
                <div className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                  item.event_type === "lecture" && "bg-blue-100 dark:bg-blue-900/30",
                  item.event_type === "letter" && "bg-amber-100 dark:bg-amber-900/30",
                  item.event_type === "diary" && "bg-green-100 dark:bg-green-900/30"
                )}>
                  <span className={cn(
                    "text-lg font-bold",
                    item.event_type === "lecture" && "text-blue-600 dark:text-blue-400",
                    item.event_type === "letter" && "text-amber-600 dark:text-amber-400",
                    item.event_type === "diary" && "text-green-600 dark:text-green-400"
                  )}>
                    {formatDate(item.event_date)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {getTitleDisplay(item)}
                  </h3>

                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    {getLocationDisplay(item) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {getLocationDisplay(item)}
                      </span>
                    )}

                    {item.book_slug && item.event_type === "lecture" && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {item.book_slug.toUpperCase()}
                        {item.chapter_number && ` ${item.chapter_number}`}
                        {item.verse_number && `.${item.verse_number}`}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full",
                      item.event_type === "lecture" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                      item.event_type === "letter" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                      item.event_type === "diary" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    )}>
                      {getEventTypeLabel(item.event_type)}
                    </span>
                    {item.extra_type && item.event_type === "lecture" && (
                      <span className="inline-block px-2 py-0.5 text-xs bg-muted rounded-full text-muted-foreground">
                        {item.extra_type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Type indicator */}
                <div className={cn(
                  "flex-shrink-0",
                  item.event_type === "lecture" && "text-blue-400",
                  item.event_type === "letter" && "text-amber-400",
                  item.event_type === "diary" && "text-green-400"
                )}>
                  {getIcon(item.event_type)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PrabhupadaTimeline;
