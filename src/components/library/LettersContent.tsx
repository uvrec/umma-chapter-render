/**
 * Контент бібліотеки листів (без Header/Footer)
 * Використовується в Library.tsx та LettersLibrary.tsx
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Search, Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type {
  Letter,
  LetterFilters,
  LetterSortBy,
  LetterSortOrder,
} from "@/types/letter";

// Очистити HTML теги для превью
const stripHtmlTags = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, '') // Видалити всі HTML теги
    .replace(/&nbsp;/g, ' ') // Замінити &nbsp; на пробіл
    .replace(/&amp;/g, '&')  // Декодувати &amp;
    .replace(/&lt;/g, '<')   // Декодувати &lt;
    .replace(/&gt;/g, '>')   // Декодувати &gt;
    .replace(/&quot;/g, '"') // Декодувати &quot;
    .replace(/\s+/g, ' ')    // Нормалізувати пробіли
    .trim();
};

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

  // Сортування
  const [sortBy, setSortBy] = useState<LetterSortBy>("date");
  const [sortOrder, setSortOrder] = useState<LetterSortOrder>("desc");

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

  // Отримати унікальні значення для фільтрів
  const recipients = useMemo(() => {
    const unique = new Set(letters.map((l) => l.recipient_en).filter(Boolean));
    return Array.from(unique).sort() as string[];
  }, [letters]);

  const locations = useMemo(() => {
    const unique = new Set(letters.map((l) => l.location_en).filter(Boolean));
    return Array.from(unique).sort() as string[];
  }, [letters]);

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

    // Фільтри
    if (filters.recipient && filters.recipient !== "all") {
      result = result.filter((l) => l.recipient_en === filters.recipient);
    }

    if (filters.location && filters.location !== "all") {
      result = result.filter((l) => l.location_en === filters.location);
    }

    if (filters.yearFrom || filters.yearTo) {
      result = result.filter((l) => {
        const year = new Date(l.letter_date).getFullYear();
        if (filters.yearFrom && year < filters.yearFrom) return false;
        if (filters.yearTo && year > filters.yearTo) return false;
        return true;
      });
    }

    // Сортування
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison = new Date(a.letter_date).getTime() - new Date(b.letter_date).getTime();
          break;
        case "recipient":
          comparison = a.recipient_en.localeCompare(b.recipient_en);
          break;
        case "location":
          comparison = a.location_en.localeCompare(b.location_en);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [letters, searchQuery, filters, sortBy, sortOrder, language]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Results - Main content */}
      <div className="lg:col-span-3 order-2 lg:order-1">
        {filteredAndSortedLetters.length > 0 && (
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredAndSortedLetters.length} {t("листів", "letters")}
          </div>
        )}
        <div className="space-y-6">
        {groupedLetters.map((group) => (
          <div key={group.label}>
            <h3 className="text-xl font-bold mb-4">{group.label}</h3>
            <div className="space-y-4">
              {group.letters.map((letter) => (
                <div
                  key={letter.id}
                  className="cursor-pointer hover:bg-muted/30 transition-colors py-3"
                  onClick={() => navigate(getLocalizedPath(`/library/letters/${letter.slug}`))}
                >
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-1 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold line-clamp-2">
                        {language === "uk" && letter.recipient_uk
                          ? letter.recipient_uk
                          : letter.recipient_en}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(letter.letter_date).toLocaleDateString(
                            language === "uk" ? "uk-UA" : "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">
                            {language === "uk" && letter.location_uk
                              ? letter.location_uk
                              : letter.location_en}
                          </span>
                        </div>
                        {letter.reference && (
                          <Badge variant="outline">
                            Ref: {letter.reference}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                        {language === "uk" && letter.content_uk
                          ? stripHtmlTags(letter.content_uk).substring(0, 150) + "..."
                          : stripHtmlTags(letter.content_en).substring(0, 150) + "..."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

        {filteredAndSortedLetters.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t("Листів не знайдено", "No letters found")}
          </div>
        )}
      </div>

      {/* Sidebar - Filters */}
      <div className="lg:col-span-1 order-1 lg:order-2">
        <div className="sticky top-4 space-y-3">
          {/* Search */}
          <Input
            placeholder={t("Пошук...", "Search...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Filters */}
          <Select
            value={filters.recipient || "all"}
            onValueChange={(value) => setFilters({ ...filters, recipient: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Отримувач", "Recipient")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("Всі отримувачі", "All recipients")}</SelectItem>
              {recipients.map((recipient) => (
                <SelectItem key={recipient} value={recipient}>{recipient}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.location || "all"}
            onValueChange={(value) => setFilters({ ...filters, location: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Локація", "Location")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("Всі локації", "All locations")}</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year range */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={t("Від", "From")}
              value={filters.yearFrom || ""}
              onChange={(e) => setFilters({
                ...filters,
                yearFrom: e.target.value ? parseInt(e.target.value) : undefined,
              })}
            />
            <Input
              type="number"
              placeholder={t("До", "To")}
              value={filters.yearTo || ""}
              onChange={(e) => setFilters({
                ...filters,
                yearTo: e.target.value ? parseInt(e.target.value) : undefined,
              })}
            />
          </div>

          {/* Sort & Group */}
          <div className="pt-3 border-t space-y-3">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as LetterSortBy)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">{t("Дата", "Date")}</SelectItem>
                <SelectItem value="recipient">{t("Отримувач", "Recipient")}</SelectItem>
                <SelectItem value="location">{t("Локація", "Location")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as LetterSortOrder)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">{t("↑ Зростання", "↑ Ascending")}</SelectItem>
                <SelectItem value="desc">{t("↓ Спадання", "↓ Descending")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={groupBy} onValueChange={(v) => setGroupBy(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("Без групування", "No grouping")}</SelectItem>
                <SelectItem value="year">{t("За роком", "By year")}</SelectItem>
                <SelectItem value="recipient">{t("За отримувачем", "By recipient")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
