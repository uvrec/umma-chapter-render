// src/components/mobile/VerseSlider.tsx
// Бокова стрічка для швидкої навігації по віршах (біблійний стиль)
// Викликається свайпом зліва направо, дозволяє ковзати пальцем для вибору вірша

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
  const [showMagnifier, setShowMagnifier] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Розрахувати позицію вірша на основі координати Y
  const getVerseFromY = useCallback(
    (clientY: number) => {
      if (!sliderRef.current || verses.length === 0) return null;

      const rect = sliderRef.current.getBoundingClientRect();
      const relativeY = clientY - rect.top;
      const percentage = Math.max(0, Math.min(1, relativeY / rect.height));
      const index = Math.floor(percentage * verses.length);
      const clampedIndex = Math.max(0, Math.min(verses.length - 1, index));

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

      // Запуск таймера довгого натискання
      longPressTimer.current = setTimeout(() => {
        setShowMagnifier(true);
      }, 300);
    },
    [getVerseFromY]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;

      const verseNum = getVerseFromY(e.touches[0].clientY);
      if (verseNum) setHoveredVerse(verseNum);

      // Якщо рухається - показати збільшувач
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      setShowMagnifier(true);
    },
    [isDragging, getVerseFromY]
  );

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (hoveredVerse) {
      onVerseSelect(hoveredVerse);
    }

    setIsDragging(false);
    setShowMagnifier(false);
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

  return (
    <>
      {/* Затемнення фону */}
      <div
        className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Слайдер */}
      <div
        ref={sliderRef}
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-50",
          "w-10 h-[70vh] max-h-[500px]",
          "bg-background/95 backdrop-blur-sm",
          "border-l border-border rounded-l-xl",
          "shadow-lg",
          "flex flex-col justify-between py-2",
          "animate-in slide-in-from-right duration-200"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Маркери віршів */}
        {verses.map((verse, index) => {
          const isActive = verse.verse_number === currentVerseNumber;
          const isHovered = verse.verse_number === hoveredVerse;
          // Показати кожен 5-й номер або якщо віршів мало
          const showNumber = verses.length <= 20 || index % 5 === 0 || index === verses.length - 1;

          return (
            <button
              key={verse.id}
              onClick={() => handleVerseClick(verse.verse_number)}
              className={cn(
                "flex-1 flex items-center justify-center",
                "text-xs font-medium transition-colors",
                isActive && "text-primary bg-primary/10",
                isHovered && "text-primary bg-primary/20",
                !isActive && !isHovered && "text-muted-foreground"
              )}
            >
              {showNumber && (
                <span className={cn(
                  "text-[10px]",
                  isActive && "font-bold"
                )}>
                  {verse.verse_number}
                </span>
              )}
            </button>
          );
        })}

        {/* Індикатор поточної позиції */}
        {currentVerseNumber && (
          <div
            className="absolute left-0 w-1 bg-primary rounded-r"
            style={{
              top: `${(verses.findIndex(v => v.verse_number === currentVerseNumber) / verses.length) * 100}%`,
              height: `${100 / verses.length}%`,
              minHeight: "8px",
            }}
          />
        )}
      </div>

      {/* Збільшувач номера при ковзанні */}
      {showMagnifier && hoveredVerse && (
        <div
          className={cn(
            "fixed right-14 top-1/2 -translate-y-1/2 z-50",
            "bg-primary/90 text-primary-foreground",
            "px-4 py-2 rounded-lg shadow-xl",
            "animate-in zoom-in-50 duration-100",
            "flex items-center gap-2"
          )}
        >
          <span className="text-3xl font-bold">{hoveredVerse}</span>
          <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-primary/90 absolute -right-2" />
        </div>
      )}
    </>
  );
}

export default VerseSlider;
