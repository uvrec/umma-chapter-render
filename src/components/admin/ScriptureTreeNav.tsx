import { useState } from "react";
import { ChevronRight, ChevronDown, BookOpen, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Book {
  id: string;
  title_ua: string;
  has_cantos: boolean;
}

interface Canto {
  id: string;
  book_id: string;
  canto_number: number;
  title_ua: string;
}

interface Chapter {
  id: string;
  book_id?: string;
  canto_id?: string;
  chapter_number: number;
  title_ua: string;
  verse_count?: number;
}

interface ScriptureTreeNavProps {
  books: Book[];
  cantos: Canto[];
  chapters: Chapter[];
  selectedChapterId: string | null;
  onChapterSelect: (chapterId: string) => void;
}

export function ScriptureTreeNav({
  books,
  cantos,
  chapters,
  selectedChapterId,
  onChapterSelect,
}: ScriptureTreeNavProps) {
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set());
  const [expandedCantos, setExpandedCantos] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const toggleBook = (bookId: string) => {
    const newExpanded = new Set(expandedBooks);
    if (newExpanded.has(bookId)) {
      newExpanded.delete(bookId);
    } else {
      newExpanded.add(bookId);
    }
    setExpandedBooks(newExpanded);
  };

  const toggleCanto = (cantoId: string) => {
    const newExpanded = new Set(expandedCantos);
    if (newExpanded.has(cantoId)) {
      newExpanded.delete(cantoId);
    } else {
      newExpanded.add(cantoId);
    }
    setExpandedCantos(newExpanded);
  };

  // Filter by search query
  const filteredBooks = books.filter((book) =>
    book.title_ua.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full border-r bg-muted/10">
      {/* Search */}
      <div className="p-3 border-b">
        <Input
          type="search"
          placeholder="Шукати книгу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredBooks.map((book) => {
            const isExpanded = expandedBooks.has(book.id);
            const bookCantos = cantos.filter((c) => c.book_id === book.id);
            const bookChapters = chapters.filter((ch) => ch.book_id === book.id);

            return (
              <div key={book.id} className="mb-1">
                {/* Book */}
                <button
                  onClick={() => toggleBook(book.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors text-left",
                    isExpanded && "bg-accent/50"
                  )}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  )}
                  <BookOpen className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="flex-1 truncate font-medium">{book.title_ua}</span>
                  <span className="text-xs text-muted-foreground">
                    {book.has_cantos ? bookCantos.length : bookChapters.length}
                  </span>
                </button>

                {/* Cantos or Chapters */}
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {book.has_cantos ? (
                      // Show cantos
                      bookCantos.map((canto) => {
                        const isCantoExpanded = expandedCantos.has(canto.id);
                        const cantoChapters = chapters.filter(
                          (ch) => ch.canto_id === canto.id
                        );

                        return (
                          <div key={canto.id}>
                            {/* Canto */}
                            <button
                              onClick={() => toggleCanto(canto.id)}
                              className={cn(
                                "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors text-left",
                                isCantoExpanded && "bg-accent/50"
                              )}
                            >
                              {isCantoExpanded ? (
                                <ChevronDown className="h-4 w-4 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="h-4 w-4 flex-shrink-0" />
                              )}
                              <span className="flex-1 truncate">
                                Пісня {canto.canto_number}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {cantoChapters.length}
                              </span>
                            </button>

                            {/* Chapters under Canto */}
                            {isCantoExpanded && (
                              <div className="ml-4 mt-1 space-y-0.5">
                                {cantoChapters.map((chapter) => (
                                  <button
                                    key={chapter.id}
                                    onClick={() => onChapterSelect(chapter.id)}
                                    className={cn(
                                      "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors text-left",
                                      selectedChapterId === chapter.id &&
                                        "bg-primary text-primary-foreground hover:bg-primary"
                                    )}
                                  >
                                    <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                                    <span className="flex-1 truncate text-xs">
                                      {chapter.chapter_number}. {chapter.title_ua}
                                    </span>
                                    {chapter.verse_count !== undefined && (
                                      <span className="text-xs opacity-70">
                                        {chapter.verse_count}
                                      </span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      // Show chapters directly
                      bookChapters.map((chapter) => (
                        <button
                          key={chapter.id}
                          onClick={() => onChapterSelect(chapter.id)}
                          className={cn(
                            "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors text-left",
                            selectedChapterId === chapter.id &&
                              "bg-primary text-primary-foreground hover:bg-primary"
                          )}
                        >
                          <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="flex-1 truncate text-xs">
                            {chapter.chapter_number}. {chapter.title_ua}
                          </span>
                          {chapter.verse_count !== undefined && (
                            <span className="text-xs opacity-70">
                              {chapter.verse_count}
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Stats */}
      <div className="p-3 border-t text-xs text-muted-foreground">
        <div>Книг: {books.length}</div>
        <div>Розділів: {chapters.length}</div>
      </div>
    </div>
  );
}
