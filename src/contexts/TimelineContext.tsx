// src/contexts/TimelineContext.tsx
// Контекст для управління закладками та виділеними віршами (Timeline)

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type TimelineItemType = "bookmark" | "highlight";

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  /** Verse reference like "bg/1/1" or "sb/1/1/1" */
  verseRef: string;
  /** Book slug */
  bookSlug: string;
  /** Chapter number */
  chapter: number;
  /** Canto number (for SB) */
  canto?: number;
  /** Verse number or range */
  verse: string;
  /** Short excerpt of verse text */
  excerpt: string;
  /** Display name of the book */
  bookName: string;
  /** Timestamp when item was created */
  createdAt: number;
  /** Optional highlight color */
  color?: string;
}

interface TimelineContextValue {
  items: TimelineItem[];
  bookmarks: TimelineItem[];
  highlights: TimelineItem[];
  addBookmark: (item: Omit<TimelineItem, "id" | "type" | "createdAt">) => void;
  addHighlight: (item: Omit<TimelineItem, "id" | "type" | "createdAt">) => void;
  removeItem: (id: string) => void;
  isBookmarked: (verseRef: string) => boolean;
  isHighlighted: (verseRef: string) => boolean;
  clearAll: () => void;
}

const TimelineContext = createContext<TimelineContextValue | null>(null);

const TIMELINE_STORAGE_KEY = "vedavoice-timeline";

interface TimelineProviderProps {
  children: ReactNode;
}

export function TimelineProvider({ children }: TimelineProviderProps) {
  const [items, setItems] = useState<TimelineItem[]>(() => {
    try {
      const stored = localStorage.getItem(TIMELINE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage when items change
  useEffect(() => {
    localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const bookmarks = items.filter(item => item.type === "bookmark");
  const highlights = items.filter(item => item.type === "highlight");

  const addBookmark = useCallback((item: Omit<TimelineItem, "id" | "type" | "createdAt">) => {
    const newItem: TimelineItem = {
      ...item,
      id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "bookmark",
      createdAt: Date.now(),
    };
    setItems(prev => [newItem, ...prev]);
  }, []);

  const addHighlight = useCallback((item: Omit<TimelineItem, "id" | "type" | "createdAt">) => {
    const newItem: TimelineItem = {
      ...item,
      id: `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "highlight",
      createdAt: Date.now(),
    };
    setItems(prev => [newItem, ...prev]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const isBookmarked = useCallback((verseRef: string) => {
    return items.some(item => item.type === "bookmark" && item.verseRef === verseRef);
  }, [items]);

  const isHighlighted = useCallback((verseRef: string) => {
    return items.some(item => item.type === "highlight" && item.verseRef === verseRef);
  }, [items]);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <TimelineContext.Provider
      value={{
        items,
        bookmarks,
        highlights,
        addBookmark,
        addHighlight,
        removeItem,
        isBookmarked,
        isHighlighted,
        clearAll,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (!context) {
    // Return default values when context isn't available
    return {
      items: [],
      bookmarks: [],
      highlights: [],
      addBookmark: () => {},
      addHighlight: () => {},
      removeItem: () => {},
      isBookmarked: () => false,
      isHighlighted: () => false,
      clearAll: () => {},
    };
  }
  return context;
}
