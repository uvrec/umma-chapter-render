// src/components/mobile/MobileLecturesTimeline.tsx
// Мобільний таймлайн лекцій у стилі Neu Bible
// Рік → Місяць (свайп) → Локація (чіпси) → Лекції

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Mic, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface Lecture {
  id: string;
  slug: string;
  title_en: string;
  title_uk: string | null;
  lecture_date: string;
  location_en: string;
  location_uk: string | null;
  lecture_type: string;
  book_slug: string | null;
  chapter_number: number | null;
  verse_number: string | null;
}

// Prabhupada's active years
const YEARS = [1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977];

const MONTHS_UK = [
  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
];

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function MobileLecturesTimeline() {
  const navigate = useNavigate();
  const { language, t, getLocalizedPath } = useLanguage();
  const [selectedYear, setSelectedYear] = useState(1966);
  const [selectedMonth, setSelectedMonth] = useState(1); // 1-12
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null); // null = all
  const yearScrollRef = useRef<HTMLDivElement>(null);

  // Touch handling for month swipe
  const touchStartX = useRef<number | null>(null);

  // Fetch all lectures
  const { data: lectures, isLoading } = useQuery({
    queryKey: ["lectures-timeline"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lectures")
        .select("id, slug, title_en, title_uk, lecture_date, location_en, location_uk, lecture_type, book_slug, chapter_number, verse_number")
        .order("lecture_date", { ascending: true });

      if (error) throw error;
      return data as Lecture[];
    },
  });

  // Get unique locations
  const locations = useMemo(() => {
    if (!lectures) return [];
    const uniqueLocations = new Set<string>();
    lectures.forEach(l => {
      if (l.location_en) uniqueLocations.add(l.location_en);
    });
    return Array.from(uniqueLocations).sort();
  }, [lectures]);

  // Filter lectures by year, month, and location
  const filteredLectures = useMemo(() => {
    if (!lectures) return [];

    return lectures.filter(lecture => {
      const date = new Date(lecture.lecture_date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 1-12

      if (year !== selectedYear) return false;
      if (month !== selectedMonth) return false;
      if (selectedLocation && lecture.location_en !== selectedLocation) return false;

      return true;
    });
  }, [lectures, selectedYear, selectedMonth, selectedLocation]);

  // Get lecture count for current month
  const monthLectureCount = useMemo(() => {
    if (!lectures) return 0;
    return lectures.filter(l => {
      const date = new Date(l.lecture_date);
      return date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth;
    }).length;
  }, [lectures, selectedYear, selectedMonth]);

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

  // Navigate to lecture
  const handleLectureClick = (lecture: Lecture) => {
    navigate(getLocalizedPath(`/lectures/${lecture.slug}`));
  };

  const monthNames = language === "uk" ? MONTHS_UK : MONTHS_EN;

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  // Get location display name
  const getLocationDisplay = (lecture: Lecture) => {
    return language === "uk" ? (lecture.location_uk || lecture.location_en) : lecture.location_en;
  };

  // Get title display
  const getTitleDisplay = (lecture: Lecture) => {
    return language === "uk" ? (lecture.title_uk || lecture.title_en) : lecture.title_en;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Years horizontal scroll */}
      <div
        ref={yearScrollRef}
        className="flex overflow-x-auto scrollbar-hide py-4 px-2 border-b border-border/50"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {YEARS.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={cn(
              "flex-shrink-0 w-20 py-2 text-center font-serif text-lg transition-all",
              "scroll-snap-align-center",
              selectedYear === year
                ? "text-brand-600 font-bold scale-110"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {year}
          </button>
        ))}
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
            {monthLectureCount} {t("лекцій", "lectures")}
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
      {locations.length > 0 && (
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

      {/* Lectures list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-muted-foreground">{t("Завантаження...", "Loading...")}</div>
          </div>
        ) : filteredLectures.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              {t("Лекцій за цей період не знайдено", "No lectures found for this period")}
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
            {filteredLectures.map((lecture) => (
              <button
                key={lecture.id}
                onClick={() => handleLectureClick(lecture)}
                className="w-full flex items-start gap-4 p-4 text-left hover:bg-muted/50 active:bg-muted transition-colors"
              >
                {/* Date circle */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                    {formatDate(lecture.lecture_date)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {getTitleDisplay(lecture)}
                  </h3>

                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {getLocationDisplay(lecture)}
                    </span>

                    {lecture.book_slug && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {lecture.book_slug.toUpperCase()}
                        {lecture.chapter_number && ` ${lecture.chapter_number}`}
                        {lecture.verse_number && `.${lecture.verse_number}`}
                      </span>
                    )}
                  </div>

                  <div className="mt-1">
                    <span className="inline-block px-2 py-0.5 text-xs bg-muted rounded-full text-muted-foreground">
                      {lecture.lecture_type}
                    </span>
                  </div>
                </div>

                {/* Audio indicator */}
                <div className="flex-shrink-0 text-muted-foreground/50">
                  <Mic className="h-5 w-5" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileLecturesTimeline;
