/**
 * useScrollDirection - Hook to detect scroll direction
 *
 * Returns 'up' or 'down' based on scroll direction
 * Includes threshold to avoid jitter on small scrolls
 */

import { useState, useEffect, useRef } from 'react';

interface UseScrollDirectionOptions {
  /** Minimum scroll distance to trigger direction change (default: 10) */
  threshold?: number;
  /** Initial direction (default: 'up' - header visible) */
  initialDirection?: 'up' | 'down';
}

export function useScrollDirection({
  threshold = 10,
  initialDirection = 'up',
}: UseScrollDirectionOptions = {}) {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>(initialDirection);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const diff = scrollY - lastScrollY.current;

      // Only update if scroll exceeds threshold
      if (Math.abs(diff) < threshold) {
        ticking.current = false;
        return;
      }

      // At top of page, always show header
      if (scrollY < 100) {
        setScrollDirection('up');
      } else {
        setScrollDirection(diff > 0 ? 'down' : 'up');
      }

      lastScrollY.current = scrollY > 0 ? scrollY : 0;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    // Set initial scroll position
    lastScrollY.current = window.scrollY;

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return scrollDirection;
}

export default useScrollDirection;
