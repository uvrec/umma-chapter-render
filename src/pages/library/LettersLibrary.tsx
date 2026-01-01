/**
 * Сторінка бібліотеки листів
 * /library/letters
 *
 * Використовує спільний компонент LettersContent
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LettersContent } from "@/components/library/LettersContent";

export const LettersLibrary = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <LettersContent />
      </main>
      <Footer />
    </div>
  );
};
