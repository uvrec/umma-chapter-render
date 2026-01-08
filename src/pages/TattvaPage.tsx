/**
 * TattvaPage - Сторінка окремої таттви з віршами
 *
 * Мінімалістичний дизайн, фокус на контенті
 */

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageMeta } from "@/components/PageMeta";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import {
  useTattva,
  useTattvaChildren,
  useTattvaVerses,
  useTattvaBreadcrumb,
  Tattva,
  TattvaVerse,
} from "@/hooks/useTattvas";
import { cn } from "@/lib/utils";

function Breadcrumb({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const { data: breadcrumb } = useTattvaBreadcrumb(slug);

  if (!breadcrumb || breadcrumb.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6 flex-wrap">
      <Link to="/tattvas" className="hover:text-foreground transition-colors">
        Таттви
      </Link>
      {breadcrumb.slice(0, -1).map((item) => (
        <span key={item.id} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3" />
          <Link
            to={`/tattva/${item.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {language === "ua" ? item.name_ua : item.name_en}
          </Link>
        </span>
      ))}
    </nav>
  );
}

function SubcategoryRow({ tattva }: { tattva: Tattva }) {
  const { language } = useLanguage();
  const name = language === "ua" ? tattva.name_ua : tattva.name_en;

  return (
    <Link
      to={`/tattva/${tattva.slug}`}
      className="flex items-center justify-between py-3 px-4 -mx-4 hover:bg-muted/50 transition-colors group"
    >
      <span className="text-foreground group-hover:text-primary transition-colors">
        {name}
      </span>
      <div className="flex items-center gap-2">
        {tattva.verses_count && tattva.verses_count > 0 && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {tattva.verses_count}
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}

function VerseRow({ verse }: { verse: TattvaVerse }) {
  const { language, t } = useLanguage();

  // Generate link to verse
  const verseLink = verse.canto_number
    ? `/veda-reader/${verse.book_slug}/canto/${verse.canto_number}/chapter/${verse.chapter_number}/${verse.verse_number}`
    : `/veda-reader/${verse.book_slug}/${verse.chapter_number}/${verse.verse_number}`;

  // Generate reference text
  const reference = verse.canto_number
    ? `${verse.chapter_number}.${verse.verse_number}`
    : `${verse.chapter_number}.${verse.verse_number}`;

  const translation =
    language === "ua" ? verse.translation_ua : verse.translation_en;

  return (
    <Link
      to={verseLink}
      className="block py-4 px-4 -mx-4 hover:bg-muted/30 transition-colors group"
    >
      {/* Reference */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-primary">
          {verse.book_title}
        </span>
        <span className="text-sm text-muted-foreground">{reference}</span>
        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Sanskrit */}
      {verse.sanskrit && (
        <p className="text-sm text-muted-foreground italic mb-2 line-clamp-1">
          {verse.sanskrit}
        </p>
      )}

      {/* Translation */}
      {translation && (
        <p className="text-sm text-foreground/90 line-clamp-2">{translation}</p>
      )}
    </Link>
  );
}

function VersesSection({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const [limit, setLimit] = useState(20);
  const { data: verses, isLoading } = useTattvaVerses(slug, { limit });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!verses || verses.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        {t("Поки що немає віршів у цій категорії", "No verses in this category yet")}
      </p>
    );
  }

  return (
    <div>
      <div className="divide-y divide-border/50">
        {verses.map((verse) => (
          <VerseRow key={verse.verse_id} verse={verse} />
        ))}
      </div>

      {verses.length >= limit && (
        <Button
          variant="ghost"
          className="w-full mt-4"
          onClick={() => setLimit((l) => l + 20)}
        >
          <ChevronDown className="h-4 w-4 mr-2" />
          {t("Показати більше", "Show more")}
        </Button>
      )}
    </div>
  );
}

export function TattvaPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { data: tattva, isLoading: tattvaLoading } = useTattva(slug!);
  const { data: children, isLoading: childrenLoading } = useTattvaChildren(
    tattva?.id || ""
  );

  const hasChildren = children && children.length > 0;
  const name = tattva
    ? language === "ua"
      ? tattva.name_ua
      : tattva.name_en
    : "";
  const description = tattva
    ? language === "ua"
      ? tattva.description_ua
      : tattva.description_en
    : "";

  return (
    <>
      <PageMeta
        titleUa={`${name || "Таттва"} | Vedavoice`}
        titleEn={`${name || "Tattva"} | Vedavoice`}
        metaDescriptionUa={description || "Філософська категорія"}
        metaDescriptionEn={description || "Philosophical category"}
        language={language}
      />

      <main className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/tattvas">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t("Таттви", "Tattvas")}
                </Button>
              </Link>

              <Link to="/library">
                <Button variant="ghost" size="sm" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  {t("Бібліотека", "Library")}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {tattvaLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : tattva ? (
            <>
              {/* Breadcrumb */}
              <Breadcrumb slug={slug!} />

              {/* Title */}
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  {name}
                </h1>
                {description && (
                  <p className="text-muted-foreground">{description}</p>
                )}
              </div>

              {/* Subcategories */}
              {!childrenLoading && hasChildren && (
                <section className="mb-8">
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                    {t("Підкатегорії", "Subcategories")}
                  </h2>
                  <div className="divide-y divide-border/50">
                    {children.map((child) => (
                      <SubcategoryRow key={child.id} tattva={child} />
                    ))}
                  </div>
                </section>
              )}

              {/* Verses */}
              <section>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                  {t("Вірші", "Verses")}
                </h2>
                <VersesSection slug={slug!} />
              </section>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t("Таттву не знайдено", "Tattva not found")}
              </p>
              <Link to="/tattvas">
                <Button variant="link" className="mt-4">
                  {t("Повернутися до списку", "Back to list")}
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </>
  );
}

export default TattvaPage;
