// src/components/mobile/VerseSlider.tsx
// Бокова стрічка для швидкої навігації по віршах (біблійний стиль як у Neu Bible)
// Відображається справа, дозволяє ковзати пальцем для вибору вірша

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface VerseSliderProps {
  verses: { id: string; verse_number: string }[];
  currentVerseNumber?: string;
  onVerseSelect: (verseNumber: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function VerseSlider({
  verses,
  currentVerseNumber,
  onVerseSelect,
  isOpen,
  onClose,
}: VerseSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredVerse, setHoveredVerse] = useState<string | null>(null);
  const [magnifierY, setMagnifierY] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Розрахувати позицію вірша на основі координати Y
  const getVerseFromY = useCallback(
    (clientY: number) => {
      if (!sliderRef.current || verses.length === 0) return null;

      const rect = sliderRef.current.getBoundingClientRect();
      const relativeY = clientY - rect.top;
      const percentage = Math.max(0, Math.min(1, relativeY / rect.height));
      const index = Math.floor(percentage * verses.length);
      const clampedIndex = Math.max(0, Math.min(verses.length - 1, index));

      setMagnifierY(clientY);
      return verses[clampedIndex]?.verse_number || null;
    },
    [verses]
  );

  // Обробка дотику
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      const verseNum = getVerseFromY(e.touches[0].clientY);
      if (verseNum) setHoveredVerse(verseNum);
    },
    [getVerseFromY]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      const verseNum = getVerseFromY(e.touches[0].clientY);
      if (verseNum) setHoveredVerse(verseNum);
    },
    [isDragging, getVerseFromY]
  );

  const handleTouchEnd = useCallback(() => {
    if (hoveredVerse) {
      onVerseSelect(hoveredVerse);
    }
    setIsDragging(false);
    setHoveredVerse(null);
    onClose();
  }, [hoveredVerse, onVerseSelect, onClose]);

  // Клік на конкретний вірш
  const handleVerseClick = (verseNumber: string) => {
    onVerseSelect(verseNumber);
    onClose();
  };

  // Закрити при кліку поза слайдером
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (sliderRef.current && !sliderRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Визначити які номери показувати (кожен N-й залежно від кількості)
  const getVisibleIndices = () => {
    const total = verses.length;
    if (total <= 15) return verses.map((_, i) => i); // всі
    if (total <= 30) return verses.map((_, i) => i).filter(i => i % 2 === 0 || i === total - 1);
    if (total <= 50) return verses.map((_, i) => i).filter(i => i % 3 === 0 || i === total - 1);
    // Для великих глав - показати ~15-20 міток
    const step = Math.ceil(total / 15);
    return verses.map((_, i) => i).filter(i => i % step === 0 || i === total - 1);
  };

  const visibleIndices = getVisibleIndices();

  return (
    <>
      {/* Напівпрозоре затемнення */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Слайдер справа - вузький і елегантний */}
      <div
        ref={sliderRef}
        className={cn(
          "fixed right-0 top-0 bottom-0 z-50",
          "w-6 py-6",
          "bg-transparent",
          "flex flex-col items-center justify-between",
          "animate-in slide-in-from-right duration-200"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Маркери віршів з точками */}
        {verses.map((verse, index) => {
          const isVisible = visibleIndices.includes(index);
          const isActive = verse.verse_number === currentVerseNumber;
          const isHovered = verse.verse_number === hoveredVerse;

          return (
            <button
              key={verse.id}
              onClick={() => handleVerseClick(verse.verse_number)}
              className={cn(
                "flex-1 w-full flex items-center justify-center min-h-[4px]",
                "transition-colors duration-100"
              )}
            >
              {isVisible ? (
                <span
                  className={cn(
                    "text-[9px] font-medium",
                    isActive && "text-primary font-bold",
                    isHovered && "text-primary font-bold",
                    !isActive && !isHovered && "text-muted-foreground/70"
                  )}
                >
                  {verse.verse_number}
                </span>
              ) : (
                <span
                  className={cn(
                    "w-0.5 h-0.5 rounded-full",
                    isActive && "bg-primary",
                    isHovered && "bg-primary",
                    !isActive && !isHovered && "bg-muted-foreground/30"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Індикатор при ковзанні - компактний */}
      {isDragging && hoveredVerse && (
        <div
          className={cn(
            "fixed z-50 pointer-events-none",
            "animate-in fade-in zoom-in-75 duration-100"
          )}
          style={{
            right: "32px",
            top: magnifierY - 24,
          }}
        >
          <div className="relative">
            <div
              className={cn(
                "bg-primary text-primary-foreground",
                "px-3 py-1.5 rounded-full",
                "shadow-lg",
                "flex items-center justify-center"
              )}
            >
              <span className="text-xl font-bold">{hoveredVerse}</span>
            </div>
            {/* Стрілка вправо */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -right-1.5 border-l-primary"
              style={{
                width: 0,
                height: 0,
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeftWidth: "8px",
                borderLeftStyle: "solid",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default VerseSlider;
