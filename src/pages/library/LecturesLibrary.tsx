/**
 * Сторінка бібліотеки лекцій
 * /library/lectures
 *
 * Використовує спільний компонент LecturesContent
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LecturesContent } from "@/components/library/LecturesContent";

export const LecturesLibrary = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <LecturesContent />
      </main>
      <Footer />
    </div>
  );
};
