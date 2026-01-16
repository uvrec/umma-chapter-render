/**
 * useTrackpadNavigation - Hook for handling trackpad/mouse wheel gestures
 *
 * Detects horizontal swipe gestures on trackpad and triggers navigation.
 * Works with macOS trackpad gestures and Windows precision touchpad.
 */

import { useEffect, useRef, useCallback } from 'react';

interface TrackpadNavigationOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  /** Minimum horizontal delta to trigger navigation (default: 50) */
  threshold?: number;
  /** Time window in ms to accumulate delta (default: 300) */
  timeWindow?: number;
  /** Whether navigation is enabled */
  enabled?: boolean;
}

export function useTrackpadNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  timeWindow = 300,
  enabled = true,
}: TrackpadNavigationOptions) {
  const accumulatedDeltaX = useRef(0);
  const lastWheelTime = useRef(0);
  const isNavigating = useRef(false);
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!enabled || isNavigating.current) return;

    // Ігноруємо якщо це звичайна вертикальна прокрутка
    // Trackpad swipe має малий deltaY і великий deltaX
    const isHorizontalGesture = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.5;
    if (!isHorizontalGesture) return;

    const now = Date.now();

    // Reset accumulator if too much time passed
    if (now - lastWheelTime.current > timeWindow) {
      accumulatedDeltaX.current = 0;
    }

    lastWheelTime.current = now;
    accumulatedDeltaX.current += e.deltaX;

    // Check if threshold reached
    if (Math.abs(accumulatedDeltaX.current) >= threshold) {
      isNavigating.current = true;

      if (accumulatedDeltaX.current > 0 && onSwipeLeft) {
        // Swipe left → next (deltaX positive means scrolling right/swiping left)
        onSwipeLeft();
      } else if (accumulatedDeltaX.current < 0 && onSwipeRight) {
        // Swipe right → previous
        onSwipeRight();
      }

      // Reset and set cooldown
      accumulatedDeltaX.current = 0;

      // Cooldown to prevent multiple triggers
      if (cooldownTimer.current) {
        clearTimeout(cooldownTimer.current);
      }
      cooldownTimer.current = setTimeout(() => {
        isNavigating.current = false;
      }, 500);
    }
  }, [enabled, threshold, timeWindow, onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    if (!enabled) return;

    // Use passive: false to allow preventDefault if needed
    document.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      document.removeEventListener('wheel', handleWheel);
      if (cooldownTimer.current) {
        clearTimeout(cooldownTimer.current);
      }
    };
  }, [enabled, handleWheel]);
}

export default useTrackpadNavigation;
