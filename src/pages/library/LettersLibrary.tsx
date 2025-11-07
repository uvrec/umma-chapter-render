/**
 * Бібліотека листів Прабгупади
 *
 * Маршрут: /library/letters
 *
 * Функціонал:
 * - Фільтрація за отримувачем, локацією, роком
 * - Пошук по тексту
 * - Сортування за датою, отримувачем, локацією
 * - Групування за роками або отримувачами
 * - Мовний переключач (UA/EN)
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Search, Calendar, MapPin, User } from "lucide-react";
import type {
  Letter,
  LetterFilters,
  LetterSortBy,
  LetterSortOrder,
  LetterGroup,
} from "@/types/letter";

export const LettersLibrary = () => {
  const navigate = useNavigate();

  // Мовні налаштування
  const [language, setLanguage] = useState<"ua" | "en">("ua");

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

  // Завантажити листи з БД
  const { data: letters = [], isLoading } = useQuery({
    queryKey: ["letters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("letters")
        .select("*")
        .order("letter_date", { ascending: false });

      if (error) throw error;
      return data as Letter[];
    },
  });

  // Отримати унікальні значення для фільтрів
  const recipients = useMemo(() => {
    const unique = new Set(letters.map((l) => l.recipient_en));
    return Array.from(unique).sort();
  }, [letters]);

  const locations = useMemo(() => {
    const unique = new Set(letters.map((l) => l.location_en));
    return Array.from(unique).sort();
  }, [letters]);

  // Фільтрувати та сортувати листи
  const filteredAndSortedLetters = useMemo(() => {
    let result = [...letters];

    // Пошук
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((letter) => {
        const recipient = language === "ua" && letter.recipient_ua
          ? letter.recipient_ua
          : letter.recipient_en;
        const location = language === "ua" && letter.location_ua
          ? letter.location_ua
          : letter.location_en;
        const content = language === "ua" && letter.content_ua
          ? letter.content_ua
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
      return [{ label: "Всі листи", letters: filteredAndSortedLetters }];
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
  }, [filteredAndSortedLetters, groupBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Листи Шріли Прабгупади
          </h1>
          <p className="text-muted-foreground">
            Історична листівка (1947-1977)
          </p>
        </div>

        {/* Мовний переключач */}
        <div className="mb-6 flex justify-end">
          <div className="flex gap-2">
            <Button
              variant={language === "ua" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("ua")}
            >
              Українська
            </Button>
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
            >
              English
            </Button>
          </div>
        </div>

        {/* Пошук та фільтри */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Пошук та фільтри
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Пошук */}
            <div>
              <Input
                placeholder="Пошук по отримувачу, локації, тексту..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Фільтри */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Отримувач
                </label>
                <Select
                  value={filters.recipient || "all"}
                  onValueChange={(value) =>
                    setFilters({ ...filters, recipient: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Всі" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі отримувачі</SelectItem>
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
                  Локація
                </label>
                <Select
                  value={filters.location || "all"}
                  onValueChange={(value) =>
                    setFilters({ ...filters, location: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Всі" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі локації</SelectItem>
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
                  Рік
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Від"
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
                    placeholder="До"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Сортувати за
                </label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as LetterSortBy)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Дата</SelectItem>
                    <SelectItem value="recipient">Отримувач</SelectItem>
                    <SelectItem value="location">Локація</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Напрямок
                </label>
                <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as LetterSortOrder)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">За зростанням</SelectItem>
                    <SelectItem value="desc">За спаданням</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Групувати за
                </label>
                <Select value={groupBy} onValueChange={(v) => setGroupBy(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Без групування</SelectItem>
                    <SelectItem value="year">Рік</SelectItem>
                    <SelectItem value="recipient">Отримувач</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Результати */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Знайдено листів: {filteredAndSortedLetters.length}
            </div>

            <div className="space-y-8">
              {groupedLetters.map((group) => (
                <div key={group.label}>
                  <h2 className="text-2xl font-bold mb-4">{group.label}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.letters.map((letter) => (
                      <Card
                        key={letter.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => navigate(`/library/letters/${letter.slug}`)}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg flex items-start gap-2">
                            <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
                            <span>
                              {language === "ua" && letter.recipient_ua
                                ? letter.recipient_ua
                                : letter.recipient_en}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(letter.letter_date).toLocaleDateString("uk-UA", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {language === "ua" && letter.location_ua
                              ? letter.location_ua
                              : letter.location_en}
                          </div>

                          {letter.reference && (
                            <Badge variant="outline" className="mt-2">
                              Ref: {letter.reference}
                            </Badge>
                          )}

                          <p className="text-sm line-clamp-3 mt-3">
                            {language === "ua" && letter.content_ua
                              ? letter.content_ua.substring(0, 150) + "..."
                              : letter.content_en.substring(0, 150) + "..."}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredAndSortedLetters.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Листів не знайдено за вказаними критеріями
                </p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};
