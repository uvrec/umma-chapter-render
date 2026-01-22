/**
 * Bengali Dictionary Page
 *
 * Search and browse the English-Bengali dictionary.
 * Source: https://github.com/MinhasKamal/BengaliDictionary
 * License: GPL-3.0
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Languages, Info } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface LexiconEntry {
  id: number;
  word_en: string;
  word_bn: string;
  relevance?: number;
}

type SearchMode = "english" | "bengali";

export const BengaliDictionary = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("english");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Search query
  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bengali-dictionary", debouncedSearch, searchMode],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return [];

      if (searchMode === "bengali") {
        // Search by Bengali word
        const { data, error } = await supabase.rpc("search_bengali_by_bengali", {
          search_term: debouncedSearch,
          result_limit: 50,
        });
        if (error) throw error;
        return (data as LexiconEntry[]) || [];
      } else {
        // Search by English word
        const { data, error } = await supabase.rpc("search_bengali_lexicon", {
          search_term: debouncedSearch,
          search_mode: "contains",
          result_limit: 50,
        });
        if (error) throw error;
        return (data as LexiconEntry[]) || [];
      }
    },
    enabled: debouncedSearch.length >= 2,
  });

  // Get total count
  const { data: totalCount } = useQuery({
    queryKey: ["bengali-dictionary-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("bengali_lexicon")
        .select("*", { count: "exact", head: true });
      if (error) return 0;
      return count || 0;
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-primary md:text-4xl">
                {language === "uk" ? "Бенгальський словник" : "Bengali Dictionary"}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {language === "uk"
                ? `Англо-бенгальський словник • ${totalCount?.toLocaleString() || "..."} слів`
                : `English-Bengali Dictionary • ${totalCount?.toLocaleString() || "..."} words`}
            </p>
          </div>

          {/* Search Tabs */}
          <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as SearchMode)} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="english" className="gap-2">
                <Languages className="h-4 w-4" />
                {language === "uk" ? "Англійська" : "English"}
              </TabsTrigger>
              <TabsTrigger value="bengali" className="gap-2">
                <Search className="h-4 w-4" />
                {language === "uk" ? "Бенгальська" : "Bengali"}
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
                  searchMode === "english"
                    ? language === "uk"
                      ? "Введіть англійське слово (напр. love, truth, knowledge)..."
                      : "Enter English word (e.g. love, truth, knowledge)..."
                    : language === "uk"
                    ? "Введіть бенгальське слово (напр. সত্য, জ্ঞান)..."
                    : "Enter Bengali word (e.g. সত্য, জ্ঞান)..."
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
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="py-6 text-center text-destructive">
              {language === "uk" ? "Помилка пошуку. Спробуйте пізніше." : "Search error. Please try again later."}
            </div>
          ) : results && results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {language === "uk"
                  ? `Знайдено ${results.length} результатів`
                  : `Found ${results.length} results`}
              </p>
              {results.map((entry) => (
                <div key={entry.id} className="py-4 hover:bg-muted/30 transition-colors border-b border-border">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-xl font-semibold text-primary">
                        {entry.word_en}
                      </h3>
                    </div>
                    <p className="text-2xl text-foreground leading-relaxed" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                      {entry.word_bn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : debouncedSearch.length >= 2 ? (
            <div className="py-12 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                {language === "uk"
                  ? "Нічого не знайдено. Спробуйте інший запит."
                  : "No results found. Try a different search term."}
              </p>
            </div>
          ) : (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                {language === "uk"
                  ? "Почніть вводити слово для пошуку"
                  : "Start typing to search"}
              </p>
            </div>
          )}

          {/* Attribution */}
          <div className="mt-12 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">
                  {language === "uk" ? "Джерело даних:" : "Data source:"}
                </p>
                <p>
                  MinhasKamal/BengaliDictionary{" "}
                  <a
                    href="https://github.com/MinhasKamal/BengaliDictionary"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub
                  </a>
                </p>
                <p className="mt-1">License: GPL-3.0</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BengaliDictionary;
