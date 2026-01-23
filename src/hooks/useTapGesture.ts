// src/hooks/useTapGesture.ts
// Hook для розпізнавання жестів тапу: single, double, triple

import { useRef, useCallback } from "react";

interface TapGestureCallbacks {
  onSingleTap?: () => void;
  onDoubleTap?: () => void;
  onTripleTap?: (position: { x: number; y: number }) => void;
}

interface TapGestureOptions {
  /** Max time between taps for multi-tap detection (ms) */
  tapDelay?: number;
  /** If true, single tap fires immediately without waiting for potential double tap */
  immediateMode?: boolean;
}

export function useTapGesture(
  callbacks: TapGestureCallbacks,
  options: TapGestureOptions = {}
) {
  const { tapDelay = 300, immediateMode = false } = options;
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapPosition = useRef<{ x: number; y: number } | null>(null);

  const handleTap = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    // Get tap position
    let x = 0, y = 0;
    if ('touches' in e) {
      // Touch event
      if (e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else if (e.changedTouches?.length > 0) {
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
      }
    } else {
      // Mouse event
      x = e.clientX;
      y = e.clientY;
    }

    lastTapPosition.current = { x, y };
    tapCount.current += 1;

    // Clear existing timer
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
    }

    // Handle triple tap immediately
    if (tapCount.current >= 3) {
      callbacks.onTripleTap?.(lastTapPosition.current);
      tapCount.current = 0;
      return;
    }

    // Set timer to determine final tap count
    tapTimer.current = setTimeout(() => {
      const count = tapCount.current;
      tapCount.current = 0;

      if (count === 1) {
        callbacks.onSingleTap?.();
      } else if (count === 2) {
        callbacks.onDoubleTap?.();
      }
    }, tapDelay);
  }, [callbacks, tapDelay]);

  // For immediate single tap mode (used when double/triple tap doesn't need priority)
  const handleImmediateTap = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (immediateMode) {
      callbacks.onSingleTap?.();
    } else {
      handleTap(e);
    }
  }, [handleTap, immediateMode, callbacks]);

  return {
    handlers: {
      onClick: handleTap,
    },
    // For touch events specifically
    touchHandlers: {
      onTouchEnd: (e: React.TouchEvent) => {
        // Prevent ghost clicks
        handleTap(e);
      },
    },
  };
}
