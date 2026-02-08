/**
 * Контент бібліотеки лекцій (без Header/Footer)
 * Використовується в Library.tsx та LecturesLibrary.tsx
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import { supabase } from "@/integrations/supabase/client";
import type { Lecture, LectureFilters, LectureSortOptions } from "@/types/lecture";
import {
  Calendar,
  MapPin,
  BookOpen,
  Search,
  SortAsc,
  SortDesc,
  Mic,
  Play,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const LecturesContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, t, getLocalizedPath } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<LectureFilters>({
    type: "all",
    location: "all",
    book: "all",
  });
  const [sortOptions, setSortOptions] = useState<LectureSortOptions>({
    sortBy: "date",
    sortOrder: "desc",
  });
  const [groupBy, setGroupBy] = useState<"date" | "location" | "type">("date");

  // Initialize filters from URL params (from clickable metadata on lecture pages)
  useEffect(() => {
    const urlType = searchParams.get("type");
    const urlLocation = searchParams.get("location");
    const urlYearFrom = searchParams.get("yearFrom");
    const urlYearTo = searchParams.get("yearTo");

    if (urlType || urlLocation || urlYearFrom || urlYearTo) {
      setFilters(prev => ({
        ...prev,
        type: urlType || prev.type,
        location: urlLocation || prev.location,
        dateFrom: urlYearFrom ? `${urlYearFrom}-01-01` : prev.dateFrom,
        dateTo: urlYearTo ? `${urlYearTo}-12-31` : prev.dateTo,
      }));
    }
  }, [searchParams]);

  // Завантаження лекцій з БД
  const { data: lectures = [], isLoading } = useQuery({
    queryKey: ["lectures"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("lectures")
        .select("*")
        .order("lecture_date", { ascending: false });

      if (error) throw error;
      return data as Lecture[];
    },
  });

  // Фільтрація та сортування лекцій
  const filteredAndSortedLectures = useMemo(() => {
    let result = [...lectures];

    // Пошук
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (lecture) =>
          lecture.title_en.toLowerCase().includes(query) ||
          (lecture.title_uk && lecture.title_uk.toLowerCase().includes(query)) ||
          lecture.location_en.toLowerCase().includes(query) ||
          (lecture.location_uk && lecture.location_uk.toLowerCase().includes(query))
      );
    }

    // Фільтри
    if (filters.type && filters.type !== "all") {
      result = result.filter((lecture) => lecture.lecture_type === filters.type);
    }

    if (filters.location && filters.location !== "all") {
      result = result.filter((lecture) => lecture.location_en === filters.location);
    }

    if (filters.book && filters.book !== "all") {
      result = result.filter((lecture) => lecture.book_slug === filters.book);
    }

    if (filters.dateFrom) {
      result = result.filter((lecture) => lecture.lecture_date >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      result = result.filter((lecture) => lecture.lecture_date <= filters.dateTo!);
    }

    // Сортування
    result.sort((a, b) => {
      let compareValue = 0;

      switch (sortOptions.sortBy) {
        case "date":
          compareValue = a.lecture_date.localeCompare(b.lecture_date);
          break;
        case "location":
          compareValue = a.location_en.localeCompare(b.location_en);
          break;
        case "type":
          compareValue = a.lecture_type.localeCompare(b.lecture_type);
          break;
        case "title":
          compareValue = a.title_en.localeCompare(b.title_en);
          break;
      }

      return sortOptions.sortOrder === "asc" ? compareValue : -compareValue;
    });

    return result;
  }, [lectures, searchQuery, filters, sortOptions]);

  // Групування лекцій
  const groupedLectures = useMemo(() => {
    const groups: { [key: string]: Lecture[] } = {};

    filteredAndSortedLectures.forEach((lecture) => {
      let groupKey: string;

      switch (groupBy) {
        case "date": {
          const date = new Date(lecture.lecture_date);
          groupKey = `${date.getFullYear()}`;
          break;
        }
        case "location":
          groupKey = lecture.location_en;
          break;
        case "type":
          groupKey = lecture.lecture_type;
          break;
        default:
          groupKey = "All";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(lecture);
    });

    return groups;
  }, [filteredAndSortedLectures, groupBy]);

  // Унікальні значення для фільтрів
  const uniqueLocations = useMemo(
    () => [...new Set(lectures.map((l) => l.location_en))].sort(),
    [lectures]
  );

  const uniqueTypes = useMemo(
    () => [...new Set(lectures.map((l) => l.lecture_type))].sort(),
    [lectures]
  );

  const uniqueBooks = useMemo(
    () => [...new Set(lectures.map((l) => l.book_slug).filter(Boolean))].sort(),
    [lectures]
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return language === "uk"
      ? date.toLocaleDateString("uk-UA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const getLectureTitle = (lecture: Lecture) => {
    return language === "uk" && lecture.title_uk ? lecture.title_uk : lecture.title_en;
  };

  const getLectureLocation = (lecture: Lecture) => {
    return language === "uk" && lecture.location_uk
      ? lecture.location_uk
      : lecture.location_en;
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-muted-foreground">
          {language === "uk" ? "Завантаження..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Results - Main content */}
      <div className="lg:col-span-3 order-2 lg:order-1">
        {filteredAndSortedLectures.length > 0 && (
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredAndSortedLectures.length} {t("лекцій", "lectures")}
          </div>
        )}
        <div className="space-y-6">
        {Object.keys(groupedLectures)
          .sort()
          .reverse()
          .map((groupKey) => (
            <div key={groupKey}>
              <h3 className="text-xl font-bold mb-4 text-foreground">{groupKey}</h3>
              <div className="space-y-4">
                {groupedLectures[groupKey].map((lecture) => (
                  <div
                    key={lecture.id}
                    className="py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => navigate(getLocalizedPath(`/library/lectures/${lecture.slug}`))}
                  >
                    <div className="flex items-start gap-3">
                      <Mic className="w-5 h-5 mt-1 flex-shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary">{lecture.lecture_type}</Badge>
                          {lecture.audio_url && (
                            <Play className="w-4 h-4 text-primary" />
                          )}
                        </div>

                        <h4 className="text-lg font-semibold text-foreground line-clamp-2">
                          {getLectureTitle(lecture)}
                        </h4>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(lecture.lecture_date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{getLectureLocation(lecture)}</span>
                          </div>
                          {lecture.book_slug && (
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>
                                {lecture.book_slug.toUpperCase()}
                                {lecture.chapter_number && ` ${lecture.chapter_number}`}
                                {lecture.verse_number && `.${lecture.verse_number}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

        {/* Якщо немає результатів */}
        {filteredAndSortedLectures.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t("Лекцій не знайдено", "No lectures found")}
          </div>
        )}
      </div>

      {/* Sidebar - Filters */}
      <div className="lg:col-span-1 order-1 lg:order-2">
        <div className="sticky top-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("Пошук...", "Search...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <Select
            value={filters.type || "all"}
            onValueChange={(value) => setFilters({ ...filters, type: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Тип", "Type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("Всі типи", "All types")}</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.location || "all"}
            onValueChange={(value) => setFilters({ ...filters, location: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Місце", "Location")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("Всі місця", "All locations")}</SelectItem>
              {uniqueLocations.map((location) => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.book || "all"}
            onValueChange={(value) => setFilters({ ...filters, book: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Книга", "Book")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("Всі книги", "All books")}</SelectItem>
              {uniqueBooks.map((book) => (
                <SelectItem key={book} value={book!}>{book?.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort & Group */}
          <div className="pt-3 border-t space-y-3">
            <div className="flex gap-2">
              <Select
                value={sortOptions.sortBy}
                onValueChange={(value) => setSortOptions({ ...sortOptions, sortBy: value as any })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">{t("Дата", "Date")}</SelectItem>
                  <SelectItem value="location">{t("Місце", "Location")}</SelectItem>
                  <SelectItem value="type">{t("Тип", "Type")}</SelectItem>
                  <SelectItem value="title">{t("Назва", "Title")}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOptions({
                  ...sortOptions,
                  sortOrder: sortOptions.sortOrder === "asc" ? "desc" : "asc",
                })}
              >
                {sortOptions.sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>

            <Select value={groupBy} onValueChange={(value) => setGroupBy(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">{t("За роком", "By year")}</SelectItem>
                <SelectItem value="location">{t("За місцем", "By location")}</SelectItem>
                <SelectItem value="type">{t("За типом", "By type")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
