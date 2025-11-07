/**
 * Головна сторінка бібліотеки лекцій
 * /library/lectures
 *
 * Функціонал:
 * - Список всіх лекцій з фільтрацією та сортуванням
 * - Групування за датою, місцем, типом
 * - Пошук по тексту
 * - Мовний переключач (UA/EN)
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { Lecture, LectureFilters, LectureSortOptions } from "@/types/lecture";
import {
  Calendar,
  MapPin,
  BookOpen,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Mic,
  Play,
} from "lucide-react";

export const LecturesLibrary = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"ua" | "en">("ua");
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

  // Завантаження лекцій з БД
  const { data: lectures = [], isLoading } = useQuery({
    queryKey: ["lectures"],
    queryFn: async () => {
      const { data, error } = await supabase
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
          (lecture.title_ua && lecture.title_ua.toLowerCase().includes(query)) ||
          lecture.location_en.toLowerCase().includes(query) ||
          (lecture.location_ua && lecture.location_ua.toLowerCase().includes(query))
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
    return language === "ua"
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
    return language === "ua" && lecture.title_ua ? lecture.title_ua : lecture.title_en;
  };

  const getLectureLocation = (lecture: Lecture) => {
    return language === "ua" && lecture.location_ua
      ? lecture.location_ua
      : lecture.location_en;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Завантаження...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Mic className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-foreground">
              {language === "ua" ? "Бібліотека лекцій" : "Lecture Library"}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "ua"
              ? "Колекція лекцій Шріли Прабгупади з коментарями на ведичні писання"
              : "Collection of Srila Prabhupada's lectures with commentaries on Vedic scriptures"}
          </p>

          {/* Мовний переключач */}
          <div className="mt-6">
            <Tabs value={language} onValueChange={(v) => setLanguage(v as "ua" | "en")}>
              <TabsList>
                <TabsTrigger value="ua">Українська</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Пошук та фільтри */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Пошук */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={
                  language === "ua" ? "Пошук лекцій..." : "Search lectures..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Фільтр по типу */}
            <Select
              value={filters.type || "all"}
              onValueChange={(value) =>
                setFilters({ ...filters, type: value as any })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={language === "ua" ? "Тип" : "Type"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === "ua" ? "Всі типи" : "All types"}
                </SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Фільтр по локації */}
            <Select
              value={filters.location || "all"}
              onValueChange={(value) =>
                setFilters({ ...filters, location: value })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={language === "ua" ? "Місце" : "Location"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === "ua" ? "Всі місця" : "All locations"}
                </SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Фільтр по книзі */}
            <Select
              value={filters.book || "all"}
              onValueChange={(value) => setFilters({ ...filters, book: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={language === "ua" ? "Книга" : "Book"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === "ua" ? "Всі книги" : "All books"}
                </SelectItem>
                {uniqueBooks.map((book) => (
                  <SelectItem key={book} value={book!}>
                    {book?.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Сортування та групування */}
          <div className="flex flex-wrap gap-4">
            <Select
              value={sortOptions.sortBy}
              onValueChange={(value) =>
                setSortOptions({ ...sortOptions, sortBy: value as any })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">
                  {language === "ua" ? "За датою" : "By date"}
                </SelectItem>
                <SelectItem value="location">
                  {language === "ua" ? "За місцем" : "By location"}
                </SelectItem>
                <SelectItem value="type">
                  {language === "ua" ? "За типом" : "By type"}
                </SelectItem>
                <SelectItem value="title">
                  {language === "ua" ? "За назвою" : "By title"}
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSortOptions({
                  ...sortOptions,
                  sortOrder: sortOptions.sortOrder === "asc" ? "desc" : "asc",
                })
              }
            >
              {sortOptions.sortOrder === "asc" ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
            </Button>

            <Select value={groupBy} onValueChange={(value) => setGroupBy(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">
                  {language === "ua" ? "Групувати за роком" : "Group by year"}
                </SelectItem>
                <SelectItem value="location">
                  {language === "ua" ? "Групувати за місцем" : "Group by location"}
                </SelectItem>
                <SelectItem value="type">
                  {language === "ua" ? "Групувати за типом" : "Group by type"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Список лекцій */}
        <div className="space-y-8">
          {Object.keys(groupedLectures)
            .sort()
            .reverse()
            .map((groupKey) => (
              <div key={groupKey}>
                <h2 className="text-2xl font-bold mb-4 text-foreground">{groupKey}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedLectures[groupKey].map((lecture) => (
                    <Card
                      key={lecture.id}
                      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/library/lectures/${lecture.slug}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary">{lecture.lecture_type}</Badge>
                        {lecture.audio_url && (
                          <Play className="w-4 h-4 text-primary" />
                        )}
                      </div>

                      <h3 className="text-lg font-semibold mb-2 text-foreground">
                        {getLectureTitle(lecture)}
                      </h3>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(lecture.lecture_date)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {getLectureLocation(lecture)}
                        </div>
                        {lecture.book_slug && (
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            {lecture.book_slug.toUpperCase()}
                            {lecture.chapter_number && ` ${lecture.chapter_number}`}
                            {lecture.verse_number && `.${lecture.verse_number}`}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Якщо немає результатів */}
        {filteredAndSortedLectures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === "ua"
                ? "Лекцій не знайдено. Спробуйте змінити фільтри."
                : "No lectures found. Try changing the filters."}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};
