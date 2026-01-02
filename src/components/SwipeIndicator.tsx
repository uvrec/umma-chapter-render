/**
 * SwipeIndicator - Visual feedback for swipe navigation
 *
 * Shows edge glow/arrow when user is swiping
 */

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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

  if (!isSwiping || !direction) return null;

  const opacity = Math.min(1, progress * 1.5);
  const translateX = direction === 'left'
    ? `${-20 + progress * 20}px`
    : `${20 - progress * 20}px`;

  const defaultLeftLabel = t("Попередній", "Previous");
  const defaultRightLabel = t("Наступний", "Next");

  return (
    <>
      {/* Left edge indicator (swipe right = go back) */}
      {direction === 'right' && (
        <div
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none transition-transform duration-100"
          style={{
            opacity,
            transform: `translateY(-50%) translateX(${translateX})`,
          }}
        >
          <div className="flex items-center gap-1 bg-primary/90 text-primary-foreground px-3 py-2 rounded-r-full shadow-lg">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm font-medium whitespace-nowrap">
              {leftLabel || defaultLeftLabel}
            </span>
          </div>
        </div>
      )}

      {/* Right edge indicator (swipe left = go forward) */}
      {direction === 'left' && (
        <div
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none transition-transform duration-100"
          style={{
            opacity,
            transform: `translateY(-50%) translateX(${translateX})`,
          }}
        >
          <div className="flex items-center gap-1 bg-primary/90 text-primary-foreground px-3 py-2 rounded-l-full shadow-lg">
            <span className="text-sm font-medium whitespace-nowrap">
              {rightLabel || defaultRightLabel}
            </span>
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      )}

      {/* Edge glow effect */}
      {direction === 'right' && (
        <div
          className="fixed left-0 top-0 bottom-0 w-16 pointer-events-none z-40 bg-gradient-to-r from-primary/20 to-transparent"
          style={{ opacity: opacity * 0.5 }}
        />
      )}
      {direction === 'left' && (
        <div
          className="fixed right-0 top-0 bottom-0 w-16 pointer-events-none z-40 bg-gradient-to-l from-primary/20 to-transparent"
          style={{ opacity: opacity * 0.5 }}
        />
      )}
    </>
  );
}

export default SwipeIndicator;
