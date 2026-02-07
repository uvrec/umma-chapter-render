/**
 * useVirtualizedList — Wrapper around @tanstack/react-virtual
 * for virtualizing long verse/paragraph lists with dynamic heights.
 *
 * Uses window-level scrolling (useWindowVirtualizer) since content
 * is rendered in page-scroll context, not a fixed container.
 *
 * Features:
 * - Dynamic row height measurement
 * - Scroll-to-item support (for audio sync, verse navigation)
 * - Overscan for smooth scrolling
 * - Window-level scroll observation
 */

import { useRef, useCallback } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

export interface UseVirtualizedListOptions {
  /** Total number of items */
  count: number;
  /** Estimated item height in pixels (used before measurement) */
  estimateSize?: number;
  /** Number of items to render above/below visible area */
  overscan?: number;
  /** Whether virtualization is enabled (can be disabled for small lists) */
  enabled?: boolean;
  /** Minimum item count to activate virtualization */
  threshold?: number;
}

export function useVirtualizedList({
  count,
  estimateSize = 80,
  overscan = 8,
  enabled = true,
  threshold = 30,
}: UseVirtualizedListOptions) {
  // Ref for the list wrapper element — used to calculate scrollMargin
  const listRef = useRef<HTMLDivElement>(null);

  const shouldVirtualize = enabled && count >= threshold;

  const virtualizer = useWindowVirtualizer({
    count: shouldVirtualize ? count : 0,
    estimateSize: () => estimateSize,
    overscan,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  const scrollToIndex = useCallback(
    (index: number, options?: { align?: 'start' | 'center' | 'end'; behavior?: 'auto' | 'smooth' }) => {
      if (!shouldVirtualize) return;
      virtualizer.scrollToIndex(index, {
        align: options?.align ?? 'center',
        behavior: options?.behavior ?? 'smooth',
      });
    },
    [virtualizer, shouldVirtualize]
  );

  return {
    listRef,
    virtualizer,
    shouldVirtualize,
    scrollToIndex,
    virtualItems: shouldVirtualize ? virtualizer.getVirtualItems() : null,
    totalSize: shouldVirtualize ? virtualizer.getTotalSize() : 0,
  };
}
