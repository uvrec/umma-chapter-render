/**
 * DisciplicSuccessionPage - Displays the chain of disciplic succession (parampara)
 * Based on BBT reference app design, adapted to VedaVOICE amber/craft theme
 */

import { BookReaderHeader } from "@/components/BookReaderHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  GITA_DISCIPLIC_SUCCESSION_UA,
  GITA_DISCIPLIC_SUCCESSION_EN,
  type DiscipleLineage
} from "@/data/book-resources/gita-resources";
import { cn } from "@/lib/utils";

interface DisciplicSuccessionPageProps {
  bookTitle: string;
  bookSlug: string;
  cantoNumber?: number;
}

const LineageItem = ({
  disciple,
  index,
  isLast
}: {
  disciple: DiscipleLineage;
  index: number;
  isLast: boolean;
}) => {
  return (
    <div className="relative flex items-start">
      {/* Vertical line connecting items */}
      {!isLast && (
        <div className="absolute left-4 top-8 w-0.5 h-full bg-primary/20" />
      )}

      {/* Number badge */}
      <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
        {index + 1}
      </div>

      {/* Name and alt names */}
      <div className="ml-4 pb-6">
        <p className="font-semibold text-foreground text-lg">
          {disciple.name}
        </p>
        {disciple.altNames && disciple.altNames.length > 0 && (
          <p className="text-muted-foreground text-sm mt-0.5">
            ({disciple.altNames.join(", ")})
          </p>
        )}
      </div>
    </div>
  );
};

export const DisciplicSuccessionPage = ({
  bookTitle,
  bookSlug,
  cantoNumber,
}: DisciplicSuccessionPageProps) => {
  const { language, t } = useLanguage();

  // Get disciplic succession based on language
  const succession = language === "ua"
    ? GITA_DISCIPLIC_SUCCESSION_UA
    : GITA_DISCIPLIC_SUCCESSION_EN;

  return (
    <div className="min-h-screen bg-background">
      <BookReaderHeader
        bookTitle={bookTitle}
        bookSlug={bookSlug}
        cantoNumber={cantoNumber}
        introTitle={succession.title}
      />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <article className="prose prose-amber dark:prose-invert max-w-none">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-primary">
            {succession.title}
          </h1>

          {/* Verse quote */}
          <div className="bg-card/50 rounded-lg p-6 border border-border/50 mb-8">
            <p className="text-lg md:text-xl text-center italic text-foreground mb-2">
              {succession.verse}
            </p>
            <p className="text-sm text-center text-muted-foreground">
              ({succession.verseReference})
            </p>
          </div>

          {/* Introduction */}
          <p className="text-center text-muted-foreground mb-8">
            {succession.introduction}
          </p>

          {/* Lineage chain */}
          <div className="bg-card/30 rounded-lg p-6 border border-border/30">
            <div className="space-y-0">
              {succession.lineage.map((disciple, index) => (
                <LineageItem
                  key={disciple.name}
                  disciple={disciple}
                  index={index}
                  isLast={index === succession.lineage.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Decorative element */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-primary/30 rounded-full" />
              <div className="w-2 h-2 rounded-full bg-primary/50" />
              <div className="w-8 h-0.5 bg-primary/30 rounded-full" />
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default DisciplicSuccessionPage;
