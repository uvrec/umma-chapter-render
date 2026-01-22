/**
 * SwipeIndicator - Visual feedback for swipe navigation
 *
 * Shows edge glow/arrow when user is swiping
 * Includes haptic feedback when threshold is reached
 */

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface SwipeIndicatorProps {
  isSwiping: boolean;
  direction: 'left' | 'right' | null;
  progress: number; // 0 to 1
  leftLabel?: string;
  rightLabel?: string;
}

export function SwipeIndicator({
  isSwiping,
  direction,
  progress,
  leftLabel,
  rightLabel,
}: SwipeIndicatorProps) {
  const { t } = useLanguage();
  const hasVibratedRef = useRef(false);

  // Haptic feedback when threshold is reached
  useEffect(() => {
    if (progress >= 1 && !hasVibratedRef.current && isSwiping) {
      hasVibratedRef.current = true;
      // Vibrate if supported (short pulse)
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    } else if (progress < 0.8) {
      hasVibratedRef.current = false;
    }
  }, [progress, isSwiping]);

  if (!isSwiping || !direction) return null;

  const opacity = Math.min(1, progress * 1.5);
  const isThresholdReached = progress >= 1;

  // More dynamic translation based on progress
  const translateX = direction === 'left'
    ? `${-30 + progress * 30}px`
    : `${30 - progress * 30}px`;

  // Scale effect when threshold reached
  const scale = isThresholdReached ? 1.1 : 1;

  const defaultLeftLabel = t("Попередній", "Previous");
  const defaultRightLabel = t("Наступний", "Next");

  return (
    <>
      {/* Left edge indicator (swipe right = go back) */}
      {direction === 'right' && (
        <div
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
          style={{
            opacity,
            transform: `translateY(-50%) translateX(${translateX}) scale(${scale})`,
            transition: 'transform 100ms ease-out',
          }}
        >
          <div className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 rounded-r-full shadow-xl",
            "bg-primary text-primary-foreground",
            isThresholdReached && "animate-pulse ring-4 ring-primary/30"
          )}>
            <ChevronLeft className={cn(
              "h-5 w-5 transition-transform",
              isThresholdReached && "-translate-x-0.5"
            )} />
            <span className="text-sm font-semibold whitespace-nowrap">
              {leftLabel || defaultLeftLabel}
            </span>
          </div>
        </div>
      )}

      {/* Right edge indicator (swipe left = go forward) */}
      {direction === 'left' && (
        <div
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
          style={{
            opacity,
            transform: `translateY(-50%) translateX(${translateX}) scale(${scale})`,
            transition: 'transform 100ms ease-out',
          }}
        >
          <div className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 rounded-l-full shadow-xl",
            "bg-primary text-primary-foreground",
            isThresholdReached && "animate-pulse ring-4 ring-primary/30"
          )}>
            <span className="text-sm font-semibold whitespace-nowrap">
              {rightLabel || defaultRightLabel}
            </span>
            <ChevronRight className={cn(
              "h-5 w-5 transition-transform",
              isThresholdReached && "translate-x-0.5"
            )} />
          </div>
        </div>
      )}

      {/* Edge glow effect - more pronounced */}
      {direction === 'right' && (
        <div
          className={cn(
            "fixed left-0 top-0 bottom-0 pointer-events-none z-40",
            "bg-gradient-to-r from-primary/30 to-transparent",
            isThresholdReached && "from-primary/50"
          )}
          style={{
            opacity: opacity * 0.7,
            width: `${16 + progress * 32}px`,
            transition: 'width 100ms ease-out',
          }}
        />
      )}
      {direction === 'left' && (
        <div
          className={cn(
            "fixed right-0 top-0 bottom-0 pointer-events-none z-40",
            "bg-gradient-to-l from-primary/30 to-transparent",
            isThresholdReached && "from-primary/50"
          )}
          style={{
            opacity: opacity * 0.7,
            width: `${16 + progress * 32}px`,
            transition: 'width 100ms ease-out',
          }}
        />
      )}
    </>
  );
}

export default SwipeIndicator;
