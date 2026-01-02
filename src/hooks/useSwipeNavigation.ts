/**
 * useSwipeNavigation - Hook for handling swipe gestures for navigation
 *
 * Features:
 * - Swipe left → next (verse/chapter)
 * - Swipe right → previous (verse/chapter)
 * - Configurable threshold and velocity
 * - Visual feedback support (optional)
 * - Respects touch scrolling (only triggers on horizontal swipes)
 */

import { useEffect, useRef, useCallback, useState } from 'react';

interface SwipeNavigationOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  /** Minimum distance in pixels to trigger swipe (default: 80) */
  threshold?: number;
  /** Minimum velocity in px/ms to trigger swipe (default: 0.3) */
  velocityThreshold?: number;
  /** Maximum vertical distance to still count as horizontal swipe (default: 100) */
  maxVerticalDistance?: number;
  /** Container element ref (defaults to document) */
  containerRef?: React.RefObject<HTMLElement>;
  /** Whether swipe is enabled */
  enabled?: boolean;
}

interface SwipeState {
  isSwiping: boolean;
  direction: 'left' | 'right' | null;
  progress: number; // 0 to 1
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  currentX: number;
  currentY: number;
  isHorizontalSwipe: boolean | null;
}

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 80,
  velocityThreshold = 0.3,
  maxVerticalDistance = 100,
  containerRef,
  enabled = true,
}: SwipeNavigationOptions) {
  const touchRef = useRef<TouchState | null>(null);
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    direction: null,
    progress: 0,
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;

    // Don't interfere with multi-touch
    if (e.touches.length !== 1) return;

    const touch = e.touches[0];
    touchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      currentX: touch.clientX,
      currentY: touch.clientY,
      isHorizontalSwipe: null, // Will be determined on first move
    };
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !touchRef.current) return;
    if (e.touches.length !== 1) return;

    const touch = e.touches[0];
    const { startX, startY } = touchRef.current;

    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine swipe direction on first significant movement
    if (touchRef.current.isHorizontalSwipe === null && (absX > 10 || absY > 10)) {
      touchRef.current.isHorizontalSwipe = absX > absY;
    }

    // Only process horizontal swipes
    if (!touchRef.current.isHorizontalSwipe) {
      touchRef.current = null;
      return;
    }

    // Check if vertical movement is within acceptable range
    if (absY > maxVerticalDistance) {
      touchRef.current = null;
      setSwipeState({ isSwiping: false, direction: null, progress: 0 });
      return;
    }

    // Update current position
    touchRef.current.currentX = touch.clientX;
    touchRef.current.currentY = touch.clientY;

    // Calculate progress (0 to 1)
    const progress = Math.min(1, absX / threshold);
    const direction = deltaX > 0 ? 'right' : 'left';

    setSwipeState({
      isSwiping: absX > 20,
      direction,
      progress,
    });

    // Prevent default to avoid scrolling during horizontal swipe
    if (absX > 20) {
      e.preventDefault();
    }
  }, [enabled, threshold, maxVerticalDistance]);

  const handleTouchEnd = useCallback(() => {
    if (!enabled || !touchRef.current) return;

    const { startX, startY, startTime, currentX, currentY, isHorizontalSwipe } = touchRef.current;

    // Reset touch state
    touchRef.current = null;

    // Reset visual state
    setSwipeState({ isSwiping: false, direction: null, progress: 0 });

    // Only process horizontal swipes
    if (!isHorizontalSwipe) return;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const duration = Date.now() - startTime;
    const velocity = absX / duration;

    // Check if swipe meets threshold
    if (absY > maxVerticalDistance) return;

    const meetsThreshold = absX >= threshold || velocity >= velocityThreshold;

    if (meetsThreshold) {
      if (deltaX > 0 && onSwipeRight) {
        // Swipe right → previous
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        // Swipe left → next
        onSwipeLeft();
      }
    }
  }, [enabled, threshold, velocityThreshold, maxVerticalDistance, onSwipeLeft, onSwipeRight]);

  const handleTouchCancel = useCallback(() => {
    touchRef.current = null;
    setSwipeState({ isSwiping: false, direction: null, progress: 0 });
  }, []);

  // Attach event listeners
  useEffect(() => {
    if (!enabled) return;

    const container = containerRef?.current || document;

    container.addEventListener('touchstart', handleTouchStart as EventListener, { passive: true });
    container.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
    container.addEventListener('touchend', handleTouchEnd as EventListener, { passive: true });
    container.addEventListener('touchcancel', handleTouchCancel as EventListener, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart as EventListener);
      container.removeEventListener('touchmove', handleTouchMove as EventListener);
      container.removeEventListener('touchend', handleTouchEnd as EventListener);
      container.removeEventListener('touchcancel', handleTouchCancel as EventListener);
    };
  }, [enabled, containerRef, handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel]);

  return swipeState;
}

export default useSwipeNavigation;
