/**
 * Сторінка бібліотеки листів
 * /library/letters
 *
 * Мобільна: MobileLettersTimeline (таймлайн)
 * Десктоп: LettersContent (список з фільтрами)
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LettersContent } from "@/components/library/LettersContent";
import { MobileLettersTimeline } from "@/components/mobile/MobileLettersTimeline";
import { useIsMobile } from "@/hooks/use-mobile";

export const LettersLibrary = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={isMobile ? "" : "container mx-auto px-4 py-8 max-w-7xl"}>
        {isMobile ? <MobileLettersTimeline /> : <LettersContent />}
      </main>
      <Footer />
    </div>
  );
};
