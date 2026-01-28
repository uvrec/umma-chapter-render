// src/components/mobile/VerseNavigator.tsx
// Neu Bible-style verse navigator (right sidebar minimap)
// Права бокова панель для швидкої навігації по віршах

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

interface VerseNavigatorProps {
  /** Total number of verses in the chapter */
  totalVerses: number;
  /** Currently active/visible verse number */
  currentVerse: number;
  /** Callback when user taps a verse number to jump */
  onVerseSelect: (verseNumber: number) => void;
  /** Whether the navigator is visible */
  visible?: boolean;
  /** Auto-hide delay in ms (0 = always visible) */
  autoHideDelay?: number;
}

export function VerseNavigator({
  totalVerses,
  currentVerse,
  onVerseSelect,
  visible = true,
  autoHideDelay = 3000,
}: VerseNavigatorProps) {
  const [isVisible, setIsVisible] = useState(visible);
  const [isDragging, setIsDragging] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate verse markers - show every 4-5 verses with dots in between
  const verseMarkers = useMemo(() => {
    const markers: { verse: number; isLabel: boolean }[] = [];
    const step = totalVerses <= 20 ? 4 : totalVerses <= 50 ? 5 : 6;

    for (let i = 1; i <= totalVerses; i++) {
      // Always show first, last, and every 'step' verses as labels
      const isLabel = i === 1 || i === totalVerses || i % step === 0;
      markers.push({ verse: i, isLabel });
    }

    return markers;
  }, [totalVerses]);

  // Reset visibility when prop changes
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  // Auto-hide logic
  useEffect(() => {
    if (autoHideDelay > 0 && isVisible && !isDragging) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDelay);

      return () => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      };
    }
  }, [isVisible, autoHideDelay, isDragging, currentVerse]);

  // Show on scroll/interaction
  const showNavigator = useCallback(() => {
    setIsVisible(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  }, []);

  // Handle verse selection
  const handleVerseClick = (verse: number) => {
    showNavigator();
    onVerseSelect(verse);
  };

  // Handle drag/swipe on the navigator
  const handleTouchStart = () => {
    setIsDragging(true);
    showNavigator();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = touch.clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, relativeY / rect.height));
    const verse = Math.round(1 + percentage * (totalVerses - 1));

    onVerseSelect(verse);
  };

  if (!isVisible) {
    return (
      <button
        onClick={showNavigator}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40
          w-1 h-16 bg-muted-foreground/30 rounded-l-full
          hover:w-1.5 transition-all duration-200"
        aria-label="Show verse navigator"
      />
    );
  }

  return (
    <nav
      ref={containerRef}
      className={cn(
        "verse-navigator fixed right-0 top-0 bottom-0 z-40",
        "w-5 flex flex-col items-center justify-between py-4",
        "bg-transparent",
        "transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      aria-label="Verse navigator"
    >
      <div className="flex flex-col items-center gap-0 flex-1 py-2 overflow-hidden">
        {verseMarkers.map(({ verse, isLabel }) => {
          const isCurrent = verse === currentVerse;
          const isNearCurrent = Math.abs(verse - currentVerse) <= 2;

          return (
            <button
              key={verse}
              onClick={() => handleVerseClick(verse)}
              className={cn(
                "relative flex items-center justify-center transition-all duration-200",
                isLabel ? "min-h-[16px]" : "min-h-[4px]",
                isCurrent && "z-10"
              )}
              aria-label={`Go to verse ${verse}`}
              aria-current={isCurrent ? "true" : undefined}
            >
              {/* Current verse indicator - oval extending left */}
              {isCurrent && (
                <div
                  className="absolute right-0 flex items-center justify-center
                    bg-primary text-primary-foreground font-medium
                    rounded-l-full px-3 py-0.5 -mr-0.5
                    shadow-md animate-in slide-in-from-right-2 duration-200"
                  style={{
                    minWidth: "36px",
                    transform: "translateX(-4px)",
                  }}
                >
                  <span className="text-sm">{verse}</span>
                </div>
              )}

              {/* Verse label or dot */}
              {!isCurrent && (
                <>
                  {isLabel ? (
                    <span
                      className={cn(
                        "text-[9px] transition-colors",
                        isNearCurrent ? "text-muted-foreground" : "text-muted-foreground/50"
                      )}
                    >
                      {verse}
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "w-0.5 h-0.5 rounded-full transition-colors",
                        isNearCurrent ? "bg-muted-foreground/50" : "bg-muted-foreground/20"
                      )}
                    />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default VerseNavigator;
