/**
 * Quotes Page - Browse thematic quotes from Srila Prabhupada
 */

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageMeta } from "@/components/PageMeta";
import SiteBanners from "@/components/SiteBanners";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Search,
  Quote as QuoteIcon,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  useFeaturedQuoteCategories,
  useSearchQuotes,
  useRandomQuote,
} from "@/hooks/useQuotes";
import { QuoteCard } from "@/components/quotes";

export function Quotes() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch data
  const { data: categories, isLoading: categoriesLoading } = useFeaturedQuoteCategories(12);
  const { data: searchResults, isLoading: searchLoading } = useSearchQuotes(searchQuery, {
    categorySlug: selectedCategory || undefined,
    limit: 20,
  });
  const { data: randomQuote, refetch: refetchRandom, isLoading: randomLoading } = useRandomQuote();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is automatic via the query hook
  };

  return (
    <>
      <PageMeta
        titleUa="Цитати Прабгупади | Vedavoice"
        titleEn="Prabhupada Quotes | Vedavoice"
        metaDescriptionUa="Тематичні цитати Шріли Прабгупади з книг, лекцій та листів"
        metaDescriptionEn="Thematic quotes from Srila Prabhupada's books, lectures, and letters"
        language={language}
      />

      <SiteBanners />

      <main className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t("На головну", "Home")}
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                <Link to="/library">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    {t("Бібліотека", "Library")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <QuoteIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {t("Цитати Прабгупади", "Prabhupada Quotes")}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t(
                  "Тематичні цитати з книг, лекцій та листів Шріли Прабгупади",
                  "Thematic quotes from Srila Prabhupada's books, lectures, and letters"
                )}
              </p>
            </div>

            {/* Random Quote */}
            <Card className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {t("Цитата дня", "Quote of the Day")}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refetchRandom()}
                    disabled={randomLoading}
                    className="h-8 px-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${randomLoading ? "animate-spin" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {randomLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : randomQuote ? (
                  <QuoteCard quote={randomQuote} showSource showCategory className="shadow-none border-0 bg-transparent" />
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    {t("Цитати ще не завантажено", "No quotes loaded yet")}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("Шукати цитати...", "Search quotes...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Categories */}
            {!searchQuery && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">
                  {t("Категорії", "Categories")}
                </h2>
                {categoriesLoading ? (
                  <div className="flex flex-wrap gap-2">
                    {[...Array(8)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-24" />
                    ))}
                  </div>
                ) : categories && categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                    >
                      {t("Всі", "All")}
                    </Button>
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={selectedCategory === cat.slug ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(cat.slug)}
                        className="gap-1"
                      >
                        {language === "ua" && cat.title_ua ? cat.title_ua : cat.title}
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {cat.quotes_count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {t(
                      "Категорії ще не завантажено. Імпортуйте цитати з Vaniquotes.",
                      "No categories loaded yet. Import quotes from Vaniquotes."
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Search Results */}
            {(searchQuery || selectedCategory) && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  {t("Результати", "Results")}
                  {searchResults && ` (${searchResults.length})`}
                </h2>

                {searchLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4 mb-4" />
                          <Skeleton className="h-6 w-24" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : searchResults && searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map((quote) => (
                      <QuoteCard key={quote.id} quote={quote} showSource showCategory />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <QuoteIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">
                        {t("Нічого не знайдено", "No results found")}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Info about importing */}
            <Card className="mt-8 border-dashed">
              <CardContent className="py-6">
                <h3 className="font-medium mb-2">
                  {t("Як додати цитати?", "How to add quotes?")}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {t(
                    "Цитати імпортуються з Vaniquotes.org за допомогою Python скрипта:",
                    "Quotes are imported from Vaniquotes.org using a Python script:"
                  )}
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded block overflow-x-auto">
                  python tools/vaniquotes_parser.py --topic "Spiritual_Master" --limit 100
                </code>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}

export default Quotes;
