// src/pages/SynonymsSearch.tsx
// Система пошуку синонімів (як на vedabase.io/en/search/synonyms)
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search, Loader2, BookOpen, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { debounce } from "lodash";

// Define the expected return type for search_synonyms with search_mode parameter
interface SynonymSearchResult {
  book_slug: string;
  book_title: string;
  canto_number: number;
  chapter_number: number;
  match_rank: number;
  sanskrit: string;
  synonyms: string;
  translation: string;
  transliteration: string;
  verse_id: string;
  verse_number: string;
}

// Helper to build verse link (must match App.tsx routes)
const buildVerseLinkPath = (result: SynonymSearchResult): string => {
  if (result.canto_number) {
    // Srimad-Bhagavatam structure: /lib/:bookId/:cantoNumber/:chapterNumber/:verseNumber
    return `/lib/${result.book_slug}/${result.canto_number}/${result.chapter_number}/${result.verse_number}`;
  }
  // Direct book-chapter structure: /lib/:bookId/:chapterNumber/:verseNumber
  return `/lib/${result.book_slug}/${result.chapter_number}/${result.verse_number}`;
};

// Escape special RegExp characters to prevent ReDoS and ensure correct matching
const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Escape HTML to prevent XSS
const escapeHtml = (str: string): string => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// Safely highlight search term in text
const highlightSearchTerm = (text: string, term: string): string => {
  if (!term || !text) return escapeHtml(text || '');

  const escapedText = escapeHtml(text);
  const escapedTerm = escapeRegExp(term);

  try {
    return escapedText.replace(
      new RegExp(`(${escapedTerm})`, 'gi'),
      '<mark class="bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 px-1 rounded font-semibold">$1</mark>'
    );
  } catch {
    // If RegExp fails, return escaped text without highlighting
    return escapedText;
  }
};

interface AutocompleteItem {
  term: string;
  count: number;
}

type SearchMode = "contains" | "starts_with" | "exact";

export default function SynonymsSearch() {
  const { language: contextLanguage, getLocalizedPath } = useLanguage();

  // Build verse link with language prefix
  const buildVerseLink = (result: SynonymSearchResult): string => {
    return getLocalizedPath(buildVerseLinkPath(result));
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLanguage, setSearchLanguage] = useState<"uk" | "en">("uk");
  const [searchMode, setSearchMode] = useState<SearchMode>("contains");
  const [results, setResults] = useState<SynonymSearchResult[]>([]);
  const [autocomplete, setAutocomplete] = useState<AutocompleteItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAutocomplete, setIsLoadingAutocomplete] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Синхронізуємо мову пошуку з контекстом
  useEffect(() => {
    setSearchLanguage(contextLanguage);
  }, [contextLanguage]);

  // Автокомпліт для швидкого введення
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadAutocomplete = useCallback(
    debounce(async (term: string, lang: "uk" | "en") => {
      if (term.length < 2) {
        setAutocomplete([]);
        return;
      }

      setIsLoadingAutocomplete(true);
      try {
        const { data, error } = await supabase.rpc("get_unique_synonym_terms", {
          search_language: lang,
        });

        if (error) throw error;
        // Filter client-side since prefix_filter may not exist in type definition
        const items = (data ?? []).filter(item => 
          item.term.toLowerCase().startsWith(term.toLowerCase())
        ).slice(0, 10);
        setAutocomplete(items);
      } catch (error) {
        console.error("Autocomplete error:", error);
      } finally {
        setIsLoadingAutocomplete(false);
      }
    }, 300),
    []
  );

  // Виконати пошук
  const performSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error(
        searchLanguage === "uk" ? "Введіть пошуковий термін" : "Enter search term"
      );
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.rpc("search_synonyms", {
        search_term: searchTerm.trim(),
        search_language: searchLanguage,
        search_mode: searchMode,
        limit_count: 100,
        offset_count: 0,
      } as any); // Use 'as any' due to Supabase type union ambiguity
      
      const typedData = data as SynonymSearchResult[] | null;

      if (error) throw error;

      const rows = typedData ?? [];
      setResults(rows);
      setTotalResults(rows.length);

      if (!rows || rows.length === 0) {
        toast.info(
          searchLanguage === "uk" ? "Нічого не знайдено" : "No results found",
          {
            description:
              searchLanguage === "uk"
                ? "Спробуйте інший термін або змініть режим пошуку"
                : "Try another term or change search mode",
          }
        );
      } else {
        toast.success(
          searchLanguage === "uk"
            ? `Знайдено результатів: ${rows.length}`
            : `Results found: ${rows.length}`
        );
      }
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error(
        searchLanguage === "uk" ? "Помилка пошуку" : "Search error",
        {
          description: error.message,
        }
      );
    } finally {
      setIsSearching(false);
    }
  };

  // Автокомпліт при введенні
  useEffect(() => {
    if (searchTerm.length >= 2) {
      loadAutocomplete(searchTerm, searchLanguage);
    } else {
      setAutocomplete([]);
    }
  }, [searchTerm, searchLanguage, loadAutocomplete]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <MessageSquare className="inline-block mr-2 mb-1" />
              {searchLanguage === "uk" ? "Пошук синонімів" : "Synonyms Search"}
            </h1>
            <p className="text-muted-foreground">
              {searchLanguage === "uk"
                ? "Знайдіть санскритські терміни та їх переклади у священних текстах"
                : "Find Sanskrit terms and their translations in sacred texts"}
            </p>
          </div>

          {/* Форма пошуку */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {searchLanguage === "uk" ? "Параметри пошуку" : "Search Parameters"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {searchLanguage === "uk"
                  ? "Налаштуйте параметри для точного пошуку"
                  : "Configure parameters for precise search"}
              </p>
            </div>
            <div className="space-y-6">
              {/* Мова */}
              <div>
                <Label className="mb-2 block">
                  {searchLanguage === "uk" ? "Мова пошуку" : "Search Language"}
                </Label>
                <RadioGroup
                  value={searchLanguage}
                  onValueChange={(val) => setSearchLanguage(val as "uk" | "en")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="uk" id="lang-ua" />
                    <Label htmlFor="lang-ua">Українська</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="en" id="lang-en" />
                    <Label htmlFor="lang-en">English</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Режим пошуку */}
              <div>
                <Label className="mb-2 block">
                  {searchLanguage === "uk" ? "Режим пошуку" : "Search Mode"}
                </Label>
                <RadioGroup
                  value={searchMode}
                  onValueChange={(val) => setSearchMode(val as SearchMode)}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contains" id="mode-contains" />
                    <Label htmlFor="mode-contains" className="font-normal">
                      {searchLanguage === "uk" ? "Містить термін" : "Contains term"}{" "}
                      <span className="text-muted-foreground text-sm">
                        ({searchLanguage === "uk" ? "найбільш гнучкий" : "most flexible"})
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="starts_with" id="mode-starts" />
                    <Label htmlFor="mode-starts" className="font-normal">
                      {searchLanguage === "uk" ? "Починається з" : "Starts with"}{" "}
                      <span className="text-muted-foreground text-sm">
                        ({searchLanguage === "uk" ? "точніший" : "more precise"})
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exact" id="mode-exact" />
                    <Label htmlFor="mode-exact" className="font-normal">
                      {searchLanguage === "uk" ? "Точний збіг" : "Exact match"}{" "}
                      <span className="text-muted-foreground text-sm">
                        ({searchLanguage === "uk" ? "найточніший" : "most accurate"})
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Поле пошуку */}
              <div className="relative">
                <Label className="mb-2 block">
                  {searchLanguage === "uk" ? "Пошуковий термін" : "Search Term"}
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        performSearch();
                      }
                    }}
                    placeholder={
                      searchLanguage === "uk"
                        ? "Введіть санскритський термін..."
                        : "Enter Sanskrit term..."
                    }
                    className="pr-10"
                  />
                  {isLoadingAutocomplete && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>

                {/* Автокомпліт */}
                {autocomplete.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-[300px] overflow-y-auto">
                    {autocomplete.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchTerm(item.term);
                          setAutocomplete([]);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-muted flex items-center justify-between transition-colors"
                      >
                        <span>{item.term}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Кнопка пошуку */}
              <Button
                onClick={performSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="w-full"
                size="lg"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {searchLanguage === "uk" ? "Шукаємо..." : "Searching..."}
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    {searchLanguage === "uk" ? "Шукати" : "Search"}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Результати */}
          {totalResults > 0 && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {searchLanguage === "uk" ? "Знайдено результатів:" : "Results found:"}{" "}
                {totalResults}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.verse_id}
                className="py-4 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <Link
                        to={buildVerseLink(result)}
                        className="text-sm font-medium hover:underline"
                      >
                        {result.book_title} {result.canto_number ? `${result.canto_number}.` : ''}{result.chapter_number}.{result.verse_number}
                      </Link>
                    </div>
                    <Badge variant="outline">
                      {searchLanguage === "uk" ? "Ранг:" : "Rank:"}{" "}
                      {result.match_rank.toFixed(2)}
                    </Badge>
                  </div>

                  {/* Санскрит */}
                  {result.sanskrit && (
                    <div className="mb-3">
                      <p className="text-xl sanskrit-text leading-relaxed tracking-wide">
                        {result.sanskrit}
                      </p>
                    </div>
                  )}

                  {/* Транслітерація */}
                  {result.transliteration && (
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground italic">
                        {result.transliteration}
                      </p>
                    </div>
                  )}

                  {/* Синоніми (підсвічуємо знайдений термін) */}
                  <div className="mb-3 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium mb-1">
                      {searchLanguage === "uk" ? "Синоніми:" : "Synonyms:"}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(result.synonyms, searchTerm),
                      }}
                    />
                  </div>

                  {/* Переклад */}
                  {result.translation && (
                    <div>
                      <p className="text-sm font-medium mb-1">
                        {searchLanguage === "uk" ? "Переклад:" : "Translation:"}
                      </p>
                      <p className="text-sm leading-relaxed">{result.translation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Порожній стан */}
          {!isSearching && results.length === 0 && searchTerm && (
            <div className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                {searchLanguage === "uk" ? "Нічого не знайдено" : "No results found"}
              </h3>
              <p className="text-muted-foreground">
                {searchLanguage === "uk"
                  ? "Спробуйте змінити пошуковий термін або режим пошуку"
                  : "Try changing your search term or search mode"}
              </p>
            </div>
          )}

          {/* Підказка якщо нічого не шукали */}
          {!isSearching && results.length === 0 && !searchTerm && (
            <div className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                {searchLanguage === "uk"
                  ? "Розпочніть пошук синонімів"
                  : "Start searching for synonyms"}
              </h3>
              <p className="text-muted-foreground">
                {searchLanguage === "uk"
                  ? "Введіть санскритський термін вгорі, щоб знайти його переклади та значення"
                  : "Enter a Sanskrit term above to find its translations and meanings"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
