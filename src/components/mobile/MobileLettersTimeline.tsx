// src/components/mobile/MobileLettersTimeline.tsx
// Мобільний таймлайн листів у стилі Neu Bible
// Рік → Місяць (свайп) → Локація (чіпси) → Листи

import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Calendar, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface Letter {
  id: string;
  slug: string;
  recipient_en: string;
  recipient_uk: string | null;
  letter_date: string;
  location_en: string;
  location_uk: string | null;
  reference: string | null;
  content_en: string;
  content_uk: string | null;
}

const MONTHS_UK = [
  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
];

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function MobileLettersTimeline() {
  const navigate = useNavigate();
  const { language, t, getLocalizedPath } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(1); // 1-12
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null); // null = all
  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);
  const locationScrollRef = useRef<HTMLDivElement>(null);

  // Fetch all letters
  const { data: letters, isLoading } = useQuery({
    queryKey: ["letters-timeline"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("letters")
        .select("id, slug, recipient_en, recipient_uk, letter_date, location_en, location_uk, reference, content_en, content_uk")
        .order("letter_date", { ascending: true });

      if (error) throw error;
      return data as Letter[];
    },
  });

  // Get unique years from letters data
  const years = useMemo(() => {
    if (!letters || letters.length === 0) return [];
    const uniqueYears = new Set<number>();
    letters.forEach(l => {
      const year = new Date(l.letter_date).getFullYear();
      if (!isNaN(year)) uniqueYears.add(year);
    });
    return Array.from(uniqueYears).sort((a, b) => a - b);
  }, [letters]);

  // Set initial year when data loads
  useEffect(() => {
    if (years.length > 0 && selectedYear === null) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  // Get unique locations
  const locations = useMemo(() => {
    if (!letters) return [];
    const uniqueLocations = new Set<string>();
    letters.forEach(l => {
      if (l.location_en) uniqueLocations.add(l.location_en);
    });
    return Array.from(uniqueLocations).sort();
  }, [letters]);

  // Filter letters by year, month, and location
  const filteredLetters = useMemo(() => {
    if (!letters || selectedYear === null) return [];

    return letters.filter(letter => {
      const date = new Date(letter.letter_date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 1-12

      if (year !== selectedYear) return false;
      if (month !== selectedMonth) return false;
      if (selectedLocation && letter.location_en !== selectedLocation) return false;

      return true;
    });
  }, [letters, selectedYear, selectedMonth, selectedLocation]);

  // Get letter count for current month
  const monthLetterCount = useMemo(() => {
    if (!letters || selectedYear === null) return 0;
    return letters.filter(l => {
      const date = new Date(l.letter_date);
      return date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth;
    }).length;
  }, [letters, selectedYear, selectedMonth]);

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
      const itemWidth = 100;
      const scrollPosition = monthIndex * itemWidth - (window.innerWidth / 2) + itemWidth / 2;
      monthScrollRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }
  }, [selectedMonth]);

  // Navigate to letter
  const handleLetterClick = (letter: Letter) => {
    navigate(getLocalizedPath(`/library/letters/${letter.slug}`));
  };

  const monthNames = language === "uk" ? MONTHS_UK : MONTHS_EN;

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  // Get location display name
  const getLocationDisplay = (letter: Letter) => {
    return language === "uk" ? (letter.location_uk || letter.location_en) : letter.location_en;
  };

  // Get recipient display
  const getRecipientDisplay = (letter: Letter) => {
    return language === "uk" ? (letter.recipient_uk || letter.recipient_en) : letter.recipient_en;
  };

  // Get content preview
  const getContentPreview = (letter: Letter) => {
    const content = language === "uk" ? (letter.content_uk || letter.content_en) : letter.content_en;
    // Strip HTML tags and truncate
    const stripped = content.replace(/<[^>]*>/g, '');
    return stripped.length > 100 ? stripped.substring(0, 100) + '...' : stripped;
  };

  if (selectedYear === null && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <Mail className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground">
          {t("Листів не знайдено", "No letters found")}
        </p>
      </div>
    );
  }

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
        {monthNames.map((month, index) => (
          <button
            key={index}
            onClick={() => setSelectedMonth(index + 1)}
            className={cn(
              "flex-shrink-0 px-4 py-2 text-center font-serif text-base transition-all whitespace-nowrap",
              "scroll-snap-align-center",
              selectedMonth === index + 1
                ? "text-brand-600 font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {month}
          </button>
        ))}
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

      {/* Letters list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-muted-foreground">{t("Завантаження...", "Loading...")}</div>
          </div>
        ) : filteredLetters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              {t("Листів за цей період не знайдено", "No letters found for this period")}
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
            {filteredLetters.map((letter) => (
              <button
                key={letter.id}
                onClick={() => handleLetterClick(letter)}
                className="w-full flex items-start gap-4 p-4 text-left hover:bg-muted/50 active:bg-muted transition-colors"
              >
                {/* Date circle */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                    {formatDate(letter.letter_date)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {getRecipientDisplay(letter)}
                  </h3>

                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {getLocationDisplay(letter)}
                    </span>

                    {letter.reference && (
                      <span className="text-xs text-muted-foreground/70">
                        {letter.reference}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {getContentPreview(letter)}
                  </p>
                </div>

                {/* Mail icon */}
                <div className="flex-shrink-0 text-muted-foreground/50">
                  <Mail className="h-5 w-5" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileLettersTimeline;
