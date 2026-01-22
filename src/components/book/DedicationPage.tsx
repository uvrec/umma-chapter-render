/**
 * DedicationPage - Displays book dedication
 * Based on BBT reference app design, adapted to VedaVOICE amber/craft theme
 */

import { BookReaderHeader } from "@/components/BookReaderHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { GITA_DEDICATION_UA, GITA_DEDICATION_EN } from "@/data/book-resources/gita-resources";

interface DedicationPageProps {
  bookTitle: string;
  bookSlug: string;
  cantoNumber?: number;
}

export const DedicationPage = ({
  bookTitle,
  bookSlug,
  cantoNumber,
}: DedicationPageProps) => {
  const { language, t } = useLanguage();

  // Get dedication based on language
  const dedication = language === "uk" ? GITA_DEDICATION_UA : GITA_DEDICATION_EN;

  return (
    <div className="min-h-screen bg-background">
      <BookReaderHeader
        bookTitle={bookTitle}
        bookSlug={bookSlug}
        cantoNumber={cantoNumber}
        introTitle={dedication.title}
      />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <article className="prose prose-amber dark:prose-invert max-w-none">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary">
            {dedication.title}
          </h1>

          <div className="bg-card/50 rounded-lg p-6 md:p-8 border border-border/50">
            <p className="text-lg md:text-xl text-center leading-relaxed text-foreground italic">
              {dedication.content}
            </p>
          </div>

          {/* Decorative element */}
          <div className="flex justify-center mt-8">
            <div className="w-16 h-0.5 bg-primary/30 rounded-full" />
          </div>
        </article>
      </main>
    </div>
  );
};

export default DedicationPage;
