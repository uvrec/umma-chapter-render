/**
 * Sanskrit Dictionary Page
 *
 * Search and browse the Digital Corpus of Sanskrit (DCS) lexicon.
 */

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Languages } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

// Grammar abbreviations
const GRAMMAR_LABELS: Record<string, { uk: string; en: string; color: string }> = {
  m: { uk: "чол. рід", en: "masculine", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  f: { uk: "жін. рід", en: "feminine", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" },
  n: { uk: "сер. рід", en: "neuter", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  adj: { uk: "прикм.", en: "adjective", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  ind: { uk: "незмін.", en: "indeclinable", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  "1. P.": { uk: "дієсл. 1 клас", en: "verb class 1", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  "4. P.": { uk: "дієсл. 4 клас", en: "verb class 4", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  "6. P.": { uk: "дієсл. 6 клас", en: "verb class 6", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  "10. P.": { uk: "дієсл. 10 клас", en: "verb class 10", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
};

interface LexiconEntry {
  id: number;
  word: string;
  word_devanagari: string | null;
  grammar: string | null;
  preverbs: string | null;
  meanings: string | null;
  relevance?: number;
}

type SearchMode = "word" | "meaning";

export const SanskritDictionary = () => {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [searchMode, setSearchMode] = useState<SearchMode>("word");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Sync search term from URL params (e.g. when navigating from glossary)
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch && urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  // Search query
  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sanskrit-dictionary", debouncedSearch, searchMode],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return [];

      if (searchMode === "meaning") {
        const { data, error } = await supabase.rpc("search_sanskrit_by_meaning", {
          search_term: debouncedSearch,
          result_limit: 50,
        });
        if (error) throw error;
        return (data as LexiconEntry[]) || [];
      } else {
        const { data, error } = await supabase.rpc("search_sanskrit_lexicon", {
          search_term: debouncedSearch,
          search_mode: "contains",
          grammar_filter: null,
          result_limit: 50,
        });
        if (error) throw error;
        return (data as LexiconEntry[]) || [];
      }
    },
    enabled: debouncedSearch.length >= 2,
  });

  const getGrammarBadge = (grammar: string | null) => {
    if (!grammar) return null;
    const info = GRAMMAR_LABELS[grammar];
    if (info) {
      return (
        <Badge variant="secondary" className={info.color}>
          {language === "uk" ? info.uk : info.en}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        {grammar}
      </Badge>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Search Tabs */}
          <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as SearchMode)} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="word" className="gap-2">
                <Languages className="h-4 w-4" />
                {language === "uk" ? "За словом" : "By Word"}
              </TabsTrigger>
              <TabsTrigger value="meaning" className="gap-2">
                <Search className="h-4 w-4" />
                {language === "uk" ? "За значенням" : "By Meaning"}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Input */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={
                  searchMode === "word"
                    ? language === "uk"
                      ? "Введіть санскритське слово (напр. dharma, karma, yoga)..."
                      : "Enter Sanskrit word (e.g. dharma, karma, yoga)..."
                    : language === "uk"
                    ? "Введіть значення англійською (напр. truth, knowledge, soul)..."
                    : "Enter meaning in English (e.g. truth, knowledge, soul)..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 text-lg"
              />
            </div>
            {searchTerm && searchTerm.length < 2 && (
              <p className="mt-2 text-sm text-muted-foreground">
                {language === "uk" ? "Введіть мінімум 2 символи" : "Enter at least 2 characters"}
              </p>
            )}
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="py-6 text-center text-destructive">
              {language === "uk" ? "Помилка пошуку. Спробуйте пізніше." : "Search error. Please try again later."}
            </div>
          ) : results && results.length > 0 ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                {language === "uk"
                  ? `Знайдено ${results.length} результатів`
                  : `Found ${results.length} results`}
              </p>
              {results.map((entry) => (
                <div key={entry.id} className="py-3 border-b border-border last:border-b-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="text-lg font-semibold font-serif text-primary">{entry.word}</span>
                      {entry.word_devanagari && (
                        <span className="ml-3 text-xl text-muted-foreground">
                          {entry.word_devanagari}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {getGrammarBadge(entry.grammar)}
                      {entry.preverbs && (
                        <Badge variant="outline">
                          {language === "uk" ? "преверб" : "preverb"}: {entry.preverbs}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {entry.meanings ? (
                    <p className="mt-1 text-foreground leading-relaxed">{entry.meanings}</p>
                  ) : (
                    <p className="mt-1 text-muted-foreground italic">
                      {language === "uk" ? "Значення не вказано" : "No meaning provided"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : debouncedSearch.length >= 2 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">
                {language === "uk"
                  ? "Нічого не знайдено. Спробуйте інший запит."
                  : "No results found. Try a different search term."}
              </p>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">
                {language === "uk"
                  ? "Почніть вводити слово для пошуку"
                  : "Start typing to search"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SanskritDictionary;
