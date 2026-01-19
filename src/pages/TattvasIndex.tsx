/**
 * TattvasIndex - Філософські категорії (таттви)
 *
 * Мінімалістичний дизайн без зайвих карток
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageMeta } from "@/components/PageMeta";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Search,
  ChevronRight,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useRootTattvas, useSearchTattvas, Tattva } from "@/hooks/useTattvas";
import { cn } from "@/lib/utils";

// Категорії самбандга/абгідгея/праойджана
const CATEGORY_INFO = {
  sambandha: {
    ua: "Самбандга",
    en: "Sambandha",
    descUa: "Взаємозв'язок — хто Бог, хто ми, і як ми пов'язані",
    descEn: "Relationship — who is God, who are we, and how are we connected",
  },
  abhidheya: {
    ua: "Абгідгея",
    en: "Abhidheya",
    descUa: "Процес — як досягти мети життя",
    descEn: "Process — how to achieve the goal of life",
  },
  prayojana: {
    ua: "Прайоджана",
    en: "Prayojana",
    descUa: "Мета — кінцева ціль духовного життя",
    descEn: "Goal — the ultimate objective of spiritual life",
  },
};

function TattvaRow({ tattva, depth = 0 }: { tattva: Tattva; depth?: number }) {
  const { language, t, getLocalizedPath } = useLanguage();
  const name = language === "uk" ? tattva.name_uk : tattva.name_en;

  return (
    <Link
      to={getLocalizedPath(`/tattva/${tattva.slug}`)}
      className={cn(
        "flex items-center justify-between py-3 px-4 -mx-4",
        "hover:bg-muted/50 transition-colors group",
        depth > 0 && "pl-8"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-foreground group-hover:text-primary transition-colors truncate">
          {name}
        </span>
        {tattva.verses_count && tattva.verses_count > 0 && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {tattva.verses_count}
          </span>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
    </Link>
  );
}

function CategorySection({
  category,
  tattvas,
}: {
  category: keyof typeof CATEGORY_INFO;
  tattvas: Tattva[];
}) {
  const { language, t } = useLanguage();
  const info = CATEGORY_INFO[category];
  const filtered = tattvas.filter((t) => t.category === category);

  if (filtered.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-foreground">
          {language === "uk" ? info.uk : info.en}
        </h2>
        <p className="text-sm text-muted-foreground">
          {language === "uk" ? info.descUa : info.descEn}
        </p>
      </div>
      <div className="divide-y divide-border/50">
        {filtered.map((tattva) => (
          <TattvaRow key={tattva.id} tattva={tattva} />
        ))}
      </div>
    </section>
  );
}

function SearchResults({ query }: { query: string }) {
  const { language, t } = useLanguage();
  const { data: results, isLoading } = useSearchTattvas(query);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        {t("Нічого не знайдено", "No results found")}
      </p>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {results.map((tattva) => (
        <TattvaRow key={tattva.id} tattva={tattva} />
      ))}
    </div>
  );
}

export function TattvasIndex() {
  const { language, t, getLocalizedPath } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: tattvas, isLoading } = useRootTattvas();

  const isSearching = searchQuery.length >= 2;

  return (
    <>
      <PageMeta
        titleUa="Таттви — Філософські категорії | Vedavoice"
        titleEn="Tattvas — Philosophical Categories | Vedavoice"
        metaDescriptionUa="Систематизовані філософські категорії вчення Шріли Прабгупади"
        metaDescriptionEn="Systematized philosophical categories of Srila Prabhupada's teachings"
        language={language}
      />

      <main className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to={getLocalizedPath("/")}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t("Головна", "Home")}
                </Button>
              </Link>

              <Link to={getLocalizedPath("/library")}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  {t("Бібліотека", "Library")}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {t("Таттви", "Tattvas")}
            </h1>
            <p className="text-muted-foreground">
              {t(
                "Філософські категорії вчення Шріли Прабгупади",
                "Philosophical categories of Srila Prabhupada's teachings"
              )}
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("Пошук категорій...", "Search categories...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-64" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-10 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : isSearching ? (
            <SearchResults query={searchQuery} />
          ) : (
            <>
              <CategorySection category="sambandha" tattvas={tattvas || []} />
              <CategorySection category="abhidheya" tattvas={tattvas || []} />
              <CategorySection category="prayojana" tattvas={tattvas || []} />

              {/* Info */}
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    {t(
                      "Таттви — це філософські істини (санскр. 'та, що є'). Вони допомагають систематизувати і глибше зрозуміти вчення.",
                      "Tattvas are philosophical truths (Sanskrit 'that which is'). They help systematize and deeply understand the teachings."
                    )}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <Footer />
      </main>
    </>
  );
}

export default TattvasIndex;
