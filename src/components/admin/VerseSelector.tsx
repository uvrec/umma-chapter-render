// src/components/admin/VerseSelector.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerseSelectorProps {
  selectedVerseId?: string;
  onVerseSelect: (verseId: string | undefined) => void;
}

type Book = {
  id: string;
  slug: string;
  title_ua: string;
  title_en: string;
};

type Chapter = {
  id: string;
  chapter_number: number;
  title_ua: string;
  title_en: string;
};

type Verse = {
  id: string;
  verse_number: string;
  translation_ua: string;
  translation_en: string;
  sanskrit_ua?: string;
};

export function VerseSelector({ selectedVerseId, onVerseSelect }: VerseSelectorProps) {
  const { language } = useLanguage();
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Завантажуємо книги
  const { data: books, isLoading: booksLoading } = useQuery({
    queryKey: ["books_for_quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, slug, title_ua, title_en")
        .order("title_ua");

      if (error) throw error;
      return data as Book[];
    },
  });

  // Завантажуємо розділи для вибраної книги
  const { data: chapters, isLoading: chaptersLoading } = useQuery({
    queryKey: ["chapters_for_book", selectedBookId],
    queryFn: async () => {
      if (!selectedBookId) return [];

      const { data, error } = await supabase
        .from("chapters")
        .select("id, chapter_number, title_ua, title_en")
        .eq("book_id", selectedBookId)
        .order("chapter_number");

      if (error) throw error;
      return data as Chapter[];
    },
    enabled: !!selectedBookId,
  });

  // Завантажуємо вірші для вибраного розділу
  const { data: verses, isLoading: versesLoading } = useQuery({
    queryKey: ["verses_for_chapter", selectedChapterId],
    queryFn: async () => {
      if (!selectedChapterId) return [];

      const { data, error } = await supabase
        .from("verses")
        .select("id, verse_number, translation_ua, translation_en, sanskrit_ua")
        .eq("chapter_id", selectedChapterId)
        .eq("is_published", true)
        .order("verse_number");

      if (error) throw error;
      return data as Verse[];
    },
    enabled: !!selectedChapterId,
  });

  // Завантажуємо дані вибраного вірша (якщо передано ID)
  const { data: selectedVerse } = useQuery({
    queryKey: ["selected_verse", selectedVerseId],
    queryFn: async () => {
      if (!selectedVerseId) return null;

      const { data, error } = await supabase
        .from("verses")
        .select(`
          id,
          verse_number,
          translation_ua,
          translation_en,
          sanskrit_ua,
          chapter:chapters (
            id,
            chapter_number,
            title_ua,
            title_en,
            book:books (
              id,
              slug,
              title_ua,
              title_en
            )
          )
        `)
        .eq("id", selectedVerseId)
        .single();

      if (error) throw error;

      // Встановлюємо вибрані значення
      if (data?.chapter?.book?.id) setSelectedBookId(data.chapter.book.id);
      if (data?.chapter?.id) setSelectedChapterId(data.chapter.id);

      return data;
    },
    enabled: !!selectedVerseId,
  });

  // Фільтруємо вірші по пошуковому терміну
  const filteredVerses = verses?.filter(verse => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      verse.verse_number.includes(search) ||
      verse.translation_ua?.toLowerCase().includes(search) ||
      verse.translation_en?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-4">
      {/* Показуємо вибраний вірш */}
      {selectedVerse && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {selectedVerse.chapter?.book?.[language === 'ua' ? 'title_ua' : 'title_en']}
                  {' '}
                  {selectedVerse.chapter?.chapter_number}.{selectedVerse.verse_number}
                </CardTitle>
                <CardDescription>
                  {selectedVerse.chapter?.[language === 'ua' ? 'title_ua' : 'title_en']}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVerseSelect(undefined)}
              >
                Змінити
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedVerse.sanskrit_ua && (
              <p className="text-sm text-muted-foreground mb-2 italic">
                {selectedVerse.sanskrit_ua}
              </p>
            )}
            <blockquote className="border-l-4 border-primary pl-4">
              {selectedVerse[language === 'ua' ? 'translation_ua' : 'translation_en']}
            </blockquote>
          </CardContent>
        </Card>
      )}

      {/* Вибір книги, розділу, вірша */}
      {!selectedVerseId && (
        <div className="space-y-4">
          {/* Вибір книги */}
          <div className="space-y-2">
            <Label>Книга</Label>
            <Select
              value={selectedBookId}
              onValueChange={(value) => {
                setSelectedBookId(value);
                setSelectedChapterId("");
                onVerseSelect(undefined);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Оберіть книгу..." />
              </SelectTrigger>
              <SelectContent>
                {booksLoading ? (
                  <SelectItem value="loading" disabled>Завантаження...</SelectItem>
                ) : books?.length === 0 ? (
                  <SelectItem value="empty" disabled>Немає книг</SelectItem>
                ) : (
                  books?.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book[language === 'ua' ? 'title_ua' : 'title_en']}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Вибір розділу */}
          {selectedBookId && (
            <div className="space-y-2">
              <Label>Розділ</Label>
              <Select
                value={selectedChapterId}
                onValueChange={(value) => {
                  setSelectedChapterId(value);
                  onVerseSelect(undefined);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть розділ..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {chaptersLoading ? (
                    <SelectItem value="loading" disabled>Завантаження...</SelectItem>
                  ) : chapters?.length === 0 ? (
                    <SelectItem value="empty" disabled>Немає розділів</SelectItem>
                  ) : (
                    chapters?.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        Розділ {chapter.chapter_number}
                        {chapter.title_ua && `: ${chapter[language === 'ua' ? 'title_ua' : 'title_en']}`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Вибір вірша */}
          {selectedChapterId && (
            <div className="space-y-2">
              <Label>Вірш</Label>

              {/* Пошук */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Пошук по номеру або тексту..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Список віршів */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto border rounded-md p-2">
                {versesLoading ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Завантаження віршів...
                  </div>
                ) : filteredVerses?.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    {searchTerm ? "Нічого не знайдено" : "Немає опублікованих віршів"}
                  </div>
                ) : (
                  filteredVerses?.map((verse) => (
                    <Card
                      key={verse.id}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-accent",
                        selectedVerseId === verse.id && "border-primary border-2"
                      )}
                      onClick={() => onVerseSelect(verse.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline">Вірш {verse.verse_number}</Badge>
                        </div>
                        {verse.sanskrit_ua && (
                          <p className="text-xs text-muted-foreground mb-1 italic truncate">
                            {verse.sanskrit_ua}
                          </p>
                        )}
                        <p className="text-sm line-clamp-2">
                          {verse[language === 'ua' ? 'translation_ua' : 'translation_en']}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
