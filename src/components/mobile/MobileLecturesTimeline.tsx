// src/components/mobile/MobileLecturesTimeline.tsx
// Мобільний таймлайн лекцій у стилі Neu Bible
// Рік → Місяць (свайп) → Локація (чіпси) → Лекції

import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Calendar, Mic, BookOpen } from "lucide-react";
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
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(1); // 1-12
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null); // null = all
  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);
  const locationScrollRef = useRef<HTMLDivElement>(null);

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

  // Derive years from actual data
  const years = useMemo(() => {
    if (!lectures || lectures.length === 0) return [];
    const uniqueYears = new Set<number>();
    lectures.forEach(l => {
      const year = new Date(l.lecture_date).getFullYear();
      if (!isNaN(year)) uniqueYears.add(year);
    });
    return Array.from(uniqueYears).sort((a, b) => a - b);
  }, [lectures]);

  // Auto-select first year when data loads
  useEffect(() => {
    if (years.length > 0 && selectedYear === null) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  // Auto-select first month with lectures when year changes
  useEffect(() => {
    if (!lectures || selectedYear === null) return;
    const monthsWithData = new Set<number>();
    lectures.forEach(l => {
      const date = new Date(l.lecture_date);
      if (date.getFullYear() === selectedYear) {
        monthsWithData.add(date.getMonth() + 1);
      }
    });
    if (monthsWithData.size > 0 && !monthsWithData.has(selectedMonth)) {
      setSelectedMonth(Math.min(...monthsWithData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectures, selectedYear]);

  // Get unique locations for the selected year
  const locations = useMemo(() => {
    if (!lectures) return [];
    const uniqueLocations = new Set<string>();
    lectures.forEach(l => {
      if (l.location_en) {
        const date = new Date(l.lecture_date);
        if (selectedYear === null || date.getFullYear() === selectedYear) {
          uniqueLocations.add(l.location_en);
        }
      }
    });
    return Array.from(uniqueLocations).sort();
  }, [lectures, selectedYear]);

  // Months that have lectures for the selected year
  const monthsWithLectures = useMemo(() => {
    if (!lectures || selectedYear === null) return new Set<number>();
    const months = new Set<number>();
    lectures.forEach(l => {
      const date = new Date(l.lecture_date);
      if (date.getFullYear() === selectedYear) {
        months.add(date.getMonth() + 1);
      }
    });
    return months;
  }, [lectures, selectedYear]);

  // Filter lectures by year, month, and location
  const filteredLectures = useMemo(() => {
    if (!lectures || selectedYear === null) return [];

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

  // Scroll to selected year
  useEffect(() => {
    if (yearScrollRef.current && selectedYear !== null) {
      const yearIndex = years.indexOf(selectedYear);
      const scrollPosition = yearIndex * 80 - (window.innerWidth / 2) + 40;
      yearScrollRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }
  }, [selectedYear, years]);

  // Scroll to selected month
  useEffect(() => {
    if (monthScrollRef.current) {
      const monthIndex = selectedMonth - 1;
      const itemWidth = 100; // approx width of month button
      const scrollPosition = monthIndex * itemWidth - (window.innerWidth / 2) + itemWidth / 2;
      monthScrollRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }
  }, [selectedMonth]);

  // Navigate to lecture
  const handleLectureClick = (lecture: Lecture) => {
    navigate(getLocalizedPath(`/library/lectures/${lecture.slug}`));
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
        className="flex overflow-x-auto scrollbar-hide py-4 px-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {years.map((year) => (
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

      {/* Months horizontal scroll */}
      <div
        ref={monthScrollRef}
        className="flex overflow-x-auto scrollbar-hide py-3 px-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {monthNames.map((month, index) => {
          const monthNum = index + 1;
          const hasData = monthsWithLectures.has(monthNum);
          return (
            <button
              key={index}
              onClick={() => setSelectedMonth(monthNum)}
              className={cn(
                "flex-shrink-0 px-4 py-2 text-center font-serif text-base transition-all whitespace-nowrap",
                "scroll-snap-align-center",
                selectedMonth === monthNum
                  ? "text-brand-600 font-bold"
                  : hasData
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-muted-foreground/30"
              )}
            >
              {month}
            </button>
          );
        })}
      </div>

      {/* Location filter - horizontal scroll */}
      {locations.length > 0 && (
        <div
          ref={locationScrollRef}
          className="flex overflow-x-auto scrollbar-hide py-3 px-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          <button
            onClick={() => setSelectedLocation(null)}
            className={cn(
              "flex-shrink-0 px-4 py-2 text-center font-serif text-base transition-all whitespace-nowrap",
              "scroll-snap-align-center",
              selectedLocation === null
                ? "text-brand-600 font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t("Всі", "All")}
          </button>
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => setSelectedLocation(location)}
              className={cn(
                "flex-shrink-0 px-4 py-2 text-center font-serif text-base transition-all whitespace-nowrap",
                "scroll-snap-align-center",
                selectedLocation === location
                  ? "text-brand-600 font-bold"
                  : "text-muted-foreground hover:text-foreground"
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
