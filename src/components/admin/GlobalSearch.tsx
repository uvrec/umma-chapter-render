import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { BookOpen, FileText, PenSquare, Music, Search } from "lucide-react";

interface SearchResult {
  type: "book" | "chapter" | "verse" | "blog_post" | "playlist";
  id: string;
  title: string;
  subtitle?: string;
  href: string;
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const searchResults: SearchResult[] = [];

    try {
      // Search books
      const { data: books } = await supabase
        .from("books")
        .select("id, title_ua, has_cantos")
        .ilike("title_ua", `%${searchQuery}%`)
        .limit(5);

      books?.forEach((book) => {
        searchResults.push({
          type: "book",
          id: book.id,
          title: book.title_ua,
          subtitle: book.has_cantos ? "Книга з піснями" : "Книга",
          href: book.has_cantos
            ? `/admin/cantos/${book.id}`
            : `/admin/chapters/${book.id}`,
        });
      });

      // Search chapters
      const { data: chapters } = await supabase
        .from("chapters")
        .select("id, title_ua, chapter_number, books(title_ua), cantos(title_ua)")
        .or(`title_ua.ilike.%${searchQuery}%,chapter_number.ilike.%${searchQuery}%`)
        .limit(5);

      chapters?.forEach((chapter: any) => {
        const bookTitle = chapter.books?.title_ua || "";
        const cantoTitle = chapter.cantos?.title_ua || "";
        searchResults.push({
          type: "chapter",
          id: chapter.id,
          title: `${chapter.chapter_number}. ${chapter.title_ua}`,
          subtitle: cantoTitle ? `${bookTitle} → ${cantoTitle}` : bookTitle,
          href: `/admin/verses?chapterId=${chapter.id}`,
        });
      });

      // Search verses
      const { data: verses } = await supabase
        .from("verses")
        .select("id, verse_number, translation_ua, chapter_id")
        .or(
          `verse_number.ilike.%${searchQuery}%,translation_ua.ilike.%${searchQuery}%,sanskrit_ua.ilike.%${searchQuery}%`
        )
        .limit(5);

      verses?.forEach((verse) => {
        const previewText = verse.translation_ua
          ? verse.translation_ua.substring(0, 60) + "..."
          : "";
        searchResults.push({
          type: "verse",
          id: verse.id,
          title: `Вірш ${verse.verse_number}`,
          subtitle: previewText,
          href: `/admin/verses/${verse.id}/edit`,
        });
      });

      // Search blog posts
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("id, title_ua, slug")
        .ilike("title_ua", `%${searchQuery}%`)
        .limit(5);

      posts?.forEach((post) => {
        searchResults.push({
          type: "blog_post",
          id: post.id,
          title: post.title_ua,
          subtitle: "Пост блогу",
          href: `/admin/blog-posts/${post.id}/edit`,
        });
      });

      // Search audio playlists
      const { data: playlists } = await supabase
        .from("audio_playlists")
        .select("id, title")
        .ilike("title", `%${searchQuery}%`)
        .limit(5);

      playlists?.forEach((playlist) => {
        searchResults.push({
          type: "playlist",
          id: playlist.id,
          title: playlist.title,
          subtitle: "Аудіо плейліст",
          href: `/admin/audio-playlists/${playlist.id}`,
        });
      });

      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, performSearch]);

  const handleSelect = (href: string) => {
    navigate(href);
    onOpenChange(false);
    setQuery("");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-4 w-4 mr-2" />;
      case "chapter":
        return <FileText className="h-4 w-4 mr-2" />;
      case "verse":
        return <FileText className="h-4 w-4 mr-2" />;
      case "blog_post":
        return <PenSquare className="h-4 w-4 mr-2" />;
      case "playlist":
        return <Music className="h-4 w-4 mr-2" />;
      default:
        return <Search className="h-4 w-4 mr-2" />;
    }
  };

  const groupedResults = {
    books: results.filter((r) => r.type === "book"),
    chapters: results.filter((r) => r.type === "chapter"),
    verses: results.filter((r) => r.type === "verse"),
    blog_posts: results.filter((r) => r.type === "blog_post"),
    playlists: results.filter((r) => r.type === "playlist"),
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Шукати книги, вірші, пости, плейлісти..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {!query && (
          <CommandEmpty>Введіть запит для пошуку (мінімум 2 символи)</CommandEmpty>
        )}

        {query && !isLoading && results.length === 0 && (
          <CommandEmpty>Нічого не знайдено</CommandEmpty>
        )}

        {isLoading && (
          <CommandEmpty>Пошук...</CommandEmpty>
        )}

        {groupedResults.books.length > 0 && (
          <CommandGroup heading="Книги">
            {groupedResults.books.map((result) => (
              <CommandItem
                key={result.id}
                onSelect={() => handleSelect(result.href)}
              >
                {getIcon(result.type)}
                <div className="flex flex-col">
                  <span>{result.title}</span>
                  {result.subtitle && (
                    <span className="text-xs text-muted-foreground">
                      {result.subtitle}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {groupedResults.chapters.length > 0 && (
          <>
            {groupedResults.books.length > 0 && <CommandSeparator />}
            <CommandGroup heading="Розділи">
              {groupedResults.chapters.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result.href)}
                >
                  {getIcon(result.type)}
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    {result.subtitle && (
                      <span className="text-xs text-muted-foreground">
                        {result.subtitle}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {groupedResults.verses.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Вірші">
              {groupedResults.verses.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result.href)}
                >
                  {getIcon(result.type)}
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    {result.subtitle && (
                      <span className="text-xs text-muted-foreground">
                        {result.subtitle}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {groupedResults.blog_posts.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Блог">
              {groupedResults.blog_posts.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result.href)}
                >
                  {getIcon(result.type)}
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    {result.subtitle && (
                      <span className="text-xs text-muted-foreground">
                        {result.subtitle}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {groupedResults.playlists.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Аудіо">
              {groupedResults.playlists.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result.href)}
                >
                  {getIcon(result.type)}
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    {result.subtitle && (
                      <span className="text-xs text-muted-foreground">
                        {result.subtitle}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
