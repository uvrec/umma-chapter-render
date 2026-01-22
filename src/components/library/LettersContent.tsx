/**
 * Контент бібліотеки листів (без Header/Footer)
 * Використовується в Library.tsx та LettersLibrary.tsx
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

export const LettersContent = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Мовні налаштування для контенту
  const [contentLanguage, setContentLanguage] = useState<"uk" | "en">("ua");

  // Пошук та фільтрація
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<LetterFilters>({
    recipient: "all",
    location: "all",
  });

  // Сортування
  const [sortBy, setSortBy] = useState<LetterSortBy>("date");
  const [sortOrder, setSortOrder] = useState<LetterSortOrder>("desc");

  // Групування
  const [groupBy, setGroupBy] = useState<"none" | "year" | "recipient">("year");

  const t = (ua: string, en: string) => contentLanguage === "ua" ? ua : en;

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
        const recipient = contentLanguage === "ua" && letter.recipient_ua
          ? letter.recipient_ua
          : letter.recipient_en;
        const location = contentLanguage === "ua" && letter.location_ua
          ? letter.location_ua
          : letter.location_en;
        const content = contentLanguage === "ua" && letter.content_uk
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
  }, [letters, searchQuery, filters, sortBy, sortOrder, contentLanguage]);

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
    <div className="space-y-6">
      {/* Заголовок з лічильником та мовним переключачем */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Mail className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {t("Листи Шріли Прабгупади", "Letters of Srila Prabhupada")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t(
                `${letters.length} листів (1947-1977)`,
                `${letters.length} letters (1947-1977)`
              )}
            </p>
          </div>
        </div>

        {/* Мовний переключач */}
        <div className="flex gap-2">
          <Button
            variant={contentLanguage === "ua" ? "default" : "outline"}
            size="sm"
            onClick={() => setContentLanguage("ua")}
          >
            Українська
          </Button>
          <Button
            variant={contentLanguage === "en" ? "default" : "outline"}
            size="sm"
            onClick={() => setContentLanguage("en")}
          >
            English
          </Button>
        </div>
      </div>

      {/* Пошук та фільтри */}
      <div className="space-y-4">
        <div className="flex items-center text-lg font-semibold mb-4">
          <Search className="w-5 h-5 mr-2" />
          {t("Пошук та фільтри", "Search & filters")}
        </div>
          {/* Пошук */}
          <div>
            <Input
              placeholder={t(
                "Пошук по отримувачу, локації, тексту...",
                "Search by recipient, location, content..."
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Фільтри */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("Отримувач", "Recipient")}
              </label>
              <Select
                value={filters.recipient || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, recipient: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Всі", "All")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("Всі отримувачі", "All recipients")}</SelectItem>
                  {recipients.map((recipient) => (
                    <SelectItem key={recipient} value={recipient}>
                      {recipient}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("Локація", "Location")}
              </label>
              <Select
                value={filters.location || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, location: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Всі", "All")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("Всі локації", "All locations")}</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("Рік", "Year")}
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={t("Від", "From")}
                  value={filters.yearFrom || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      yearFrom: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full"
                />
                <Input
                  type="number"
                  placeholder={t("До", "To")}
                  value={filters.yearTo || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      yearTo: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Сортування та групування */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("Сортувати за", "Sort by")}
              </label>
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
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("Напрямок", "Order")}
              </label>
              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as LetterSortOrder)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">{t("За зростанням", "Ascending")}</SelectItem>
                  <SelectItem value="desc">{t("За спаданням", "Descending")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("Групувати за", "Group by")}
              </label>
              <Select value={groupBy} onValueChange={(v) => setGroupBy(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("Без групування", "No grouping")}</SelectItem>
                  <SelectItem value="year">{t("Рік", "Year")}</SelectItem>
                  <SelectItem value="recipient">{t("Отримувач", "Recipient")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
      </div>

      {/* Результати */}
      <div className="mb-4 text-sm text-muted-foreground">
        {t("Знайдено листів:", "Letters found:")} {filteredAndSortedLetters.length}
      </div>

      <div className="space-y-8">
        {groupedLetters.map((group) => (
          <div key={group.label}>
            <h3 className="text-xl font-bold mb-4">{group.label}</h3>
            <div className="space-y-4">
              {group.letters.map((letter) => (
                <div
                  key={letter.id}
                  className="cursor-pointer hover:bg-muted/30 transition-colors py-3"
                  onClick={() => navigate(`/library/letters/${letter.slug}`)}
                >
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-1 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold line-clamp-2">
                        {contentLanguage === "ua" && letter.recipient_ua
                          ? letter.recipient_ua
                          : letter.recipient_en}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(letter.letter_date).toLocaleDateString(
                            contentLanguage === "ua" ? "uk-UA" : "en-US",
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
                            {contentLanguage === "ua" && letter.location_ua
                              ? letter.location_ua
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
                        {contentLanguage === "ua" && letter.content_uk
                          ? letter.content_uk.substring(0, 150) + "..."
                          : letter.content_en.substring(0, 150) + "..."}
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
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {t(
              "Листів не знайдено за вказаними критеріями",
              "No letters found matching the criteria"
            )}
          </p>
        </div>
      )}
    </div>
  );
};
