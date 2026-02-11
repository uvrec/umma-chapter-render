/**
 * Контент бібліотеки листів (без Header/Footer)
 * Використовується в Library.tsx та LettersLibrary.tsx
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Letter, LetterFilters } from "@/types/letter";


export const LettersContent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, t, getLocalizedPath } = useLanguage();

  // Пошук та фільтрація - ініціалізуємо з URL параметрів
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState<LetterFilters>({
    recipient: searchParams.get("recipient") || "all",
    location: searchParams.get("location") || "all",
    yearFrom: searchParams.get("yearFrom") ? parseInt(searchParams.get("yearFrom")!) : undefined,
    yearTo: searchParams.get("yearTo") ? parseInt(searchParams.get("yearTo")!) : undefined,
  });

  // Групування - вимикаємо групування коли є активні фільтри з URL
  const hasUrlFilters = searchParams.get("recipient") || searchParams.get("location") || searchParams.get("yearFrom");
  const [groupBy, setGroupBy] = useState<"none" | "year" | "recipient">(hasUrlFilters ? "none" : "year");

  // Оновлюємо стан при зміні URL параметрів
  useEffect(() => {
    const recipient = searchParams.get("recipient");
    const location = searchParams.get("location");
    const yearFrom = searchParams.get("yearFrom");
    const yearTo = searchParams.get("yearTo");
    const q = searchParams.get("q");

    setFilters({
      recipient: recipient || "all",
      location: location || "all",
      yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
      yearTo: yearTo ? parseInt(yearTo) : undefined,
    });

    if (q) setSearchQuery(q);

    // Вимикаємо групування якщо є фільтри
    if (recipient || location || yearFrom) {
      setGroupBy("none");
    }
  }, [searchParams]);

  // Завантажити листи з БД
  const { data: letters = [], isLoading } = useQuery({
    queryKey: ["letters"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("letters")
        .select("*")
        .order("letter_date", { ascending: false });

      if (error) throw error;
      return data as Letter[];
    },
  });

  // Фільтрувати та сортувати листи
  const filteredAndSortedLetters = useMemo(() => {
    let result = [...letters];

    // Пошук
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((letter) => {
        const recipient = language === "uk" && letter.recipient_uk
          ? letter.recipient_uk
          : letter.recipient_en;
        const location = language === "uk" && letter.location_uk
          ? letter.location_uk
          : letter.location_en;
        const content = language === "uk" && letter.content_uk
          ? letter.content_uk
          : letter.content_en;

        return (
          recipient.toLowerCase().includes(query) ||
          location.toLowerCase().includes(query) ||
          content.toLowerCase().includes(query)
        );
      });
    }

    // Фільтри (часткове співпадіння тексту)
    if (filters.recipient && filters.recipient !== "all") {
      const q = filters.recipient.toLowerCase();
      result = result.filter((l) =>
        l.recipient_en.toLowerCase().includes(q) ||
        (l.recipient_uk && l.recipient_uk.toLowerCase().includes(q))
      );
    }

    if (filters.location && filters.location !== "all") {
      const q = filters.location.toLowerCase();
      result = result.filter((l) =>
        l.location_en.toLowerCase().includes(q) ||
        (l.location_uk && l.location_uk.toLowerCase().includes(q))
      );
    }

    if (filters.yearFrom || filters.yearTo) {
      result = result.filter((l) => {
        const year = new Date(l.letter_date).getFullYear();
        if (filters.yearFrom && year < filters.yearFrom) return false;
        if (filters.yearTo && year > filters.yearTo) return false;
        return true;
      });
    }

    // Сортування за датою (нові зверху)
    result.sort((a, b) =>
      new Date(b.letter_date).getTime() - new Date(a.letter_date).getTime()
    );

    return result;
  }, [letters, searchQuery, filters, language]);

  // Групувати листи
  const groupedLetters = useMemo(() => {
    if (groupBy === "none") {
      return [{ label: t("Всі листи", "All letters"), letters: filteredAndSortedLetters }];
    }

    const groups: { [key: string]: Letter[] } = {};

    filteredAndSortedLetters.forEach((letter) => {
      let key: string;

      if (groupBy === "year") {
        key = new Date(letter.letter_date).getFullYear().toString();
      } else {
        // recipient
        key = letter.recipient_en;
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(letter);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => {
        // Для років: більш нові зверху
        if (groupBy === "year") {
          return parseInt(b) - parseInt(a);
        }
        // Для отримувачів: алфавітно
        return a.localeCompare(b);
      })
      .map(([label, letters]) => ({ label, letters }));
  }, [filteredAndSortedLetters, groupBy, t]);

  // Порахувати листи за роками для сайдбару
  const yearCounts = useMemo(() => {
    const counts: { [year: string]: number } = {};
    filteredAndSortedLetters.forEach((letter) => {
      const year = new Date(letter.letter_date).getFullYear().toString();
      counts[year] = (counts[year] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => parseInt(b) - parseInt(a));
  }, [filteredAndSortedLetters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Search bar — top */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Input
          placeholder={t("Отримувач...", "Letter to...")}
          value={filters.recipient === "all" ? "" : filters.recipient || ""}
          onChange={(e) => setFilters({ ...filters, recipient: e.target.value || "all" })}
          className="flex-1"
        />
        <Input
          placeholder={t("Локація...", "Location...")}
          value={filters.location === "all" ? "" : filters.location || ""}
          onChange={(e) => setFilters({ ...filters, location: e.target.value || "all" })}
          className="flex-1"
        />
        <Input
          placeholder={t("Пошук...", "Search...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="flex gap-10">
        {/* Letter list — main */}
        <div className="flex-1 min-w-0">
          {filteredAndSortedLetters.length > 0 && (
            <p className="text-sm text-muted-foreground mb-6">
              {filteredAndSortedLetters.length} {t("листів", "letters")}
            </p>
          )}

          {groupedLetters.map((group) => (
            <div key={group.label} className="mb-8">
              <h3 className="text-lg font-bold text-muted-foreground mb-4">{group.label}</h3>
              <div>
                {group.letters.map((letter) => (
                  <div
                    key={letter.id}
                    className="cursor-pointer hover:bg-muted/20 transition-colors py-2.5"
                    onClick={() => navigate(getLocalizedPath(`/library/letters/${letter.slug}`))}
                  >
                    <h4 className="text-base font-semibold text-primary hover:underline">
                      {language === "uk" && letter.recipient_uk
                        ? letter.recipient_uk
                        : letter.recipient_en}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {new Date(letter.letter_date).toLocaleDateString(
                        language === "uk" ? "uk-UA" : "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                      {" — "}
                      {language === "uk" && letter.location_uk
                        ? letter.location_uk
                        : letter.location_en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredAndSortedLetters.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {t("Листів не знайдено", "No letters found")}
            </div>
          )}
        </div>

        {/* Year sidebar — right */}
        <nav className="hidden lg:block w-36 flex-shrink-0">
          <div className="sticky top-16">
            <h3 className="text-sm font-bold uppercase tracking-wide text-primary mb-3">
              {t("Роки", "Years")}
            </h3>
            <div className="space-y-1">
              {yearCounts.map(([year, count]) => (
                <button
                  key={year}
                  className="block w-full text-left text-sm py-1 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => {
                    setFilters({ ...filters, yearFrom: parseInt(year), yearTo: parseInt(year) });
                    setGroupBy("none");
                  }}
                >
                  {year} <span className="text-muted-foreground/60">({count})</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};
