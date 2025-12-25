/**
 * UserContentContext - Context for managing bookmarks, notes, and highlights
 * Stores data in localStorage, can be extended to sync with Supabase
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Types
export interface Bookmark {
  id: string;
  bookSlug: string;
  cantoNumber?: number;
  chapterNumber: number;
  verseNumber: string;
  verseRef: string; // e.g., "BG 1.1" or "SB 1.1.1"
  title?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  bookSlug: string;
  cantoNumber?: number;
  chapterNumber: number;
  verseNumber: string;
  verseRef: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Highlight {
  id: string;
  bookSlug: string;
  cantoNumber?: number;
  chapterNumber: number;
  verseNumber: string;
  verseRef: string;
  text: string;
  color: HighlightColor;
  section: "sanskrit" | "transliteration" | "synonyms" | "translation" | "purport";
  startOffset?: number;
  endOffset?: number;
  createdAt: string;
}

export type HighlightColor = "yellow" | "green" | "blue" | "pink" | "orange";

export const HIGHLIGHT_COLORS: { id: HighlightColor; name: string; nameEn: string; className: string }[] = [
  { id: "yellow", name: "Жовтий", nameEn: "Yellow", className: "bg-yellow-200 dark:bg-yellow-900/50" },
  { id: "green", name: "Зелений", nameEn: "Green", className: "bg-green-200 dark:bg-green-900/50" },
  { id: "blue", name: "Синій", nameEn: "Blue", className: "bg-blue-200 dark:bg-blue-900/50" },
  { id: "pink", name: "Рожевий", nameEn: "Pink", className: "bg-pink-200 dark:bg-pink-900/50" },
  { id: "orange", name: "Помаранчевий", nameEn: "Orange", className: "bg-orange-200 dark:bg-orange-900/50" },
];

// Storage keys
const STORAGE_KEYS = {
  bookmarks: "vv_user_bookmarks",
  notes: "vv_user_notes",
  highlights: "vv_user_highlights",
};

// Helper to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper to build verse reference string
export const buildVerseRef = (
  bookSlug: string,
  cantoNumber: number | undefined,
  chapterNumber: number,
  verseNumber: string
): string => {
  const bookAbbrev = bookSlug.toUpperCase();
  if (cantoNumber) {
    return `${bookAbbrev} ${cantoNumber}.${chapterNumber}.${verseNumber}`;
  }
  return `${bookAbbrev} ${chapterNumber}.${verseNumber}`;
};

// Context interface
interface UserContentContextType {
  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, "id" | "createdAt">) => Bookmark;
  removeBookmark: (id: string) => void;
  isBookmarked: (bookSlug: string, cantoNumber: number | undefined, chapterNumber: number, verseNumber: string) => boolean;
  getBookmarkForVerse: (bookSlug: string, cantoNumber: number | undefined, chapterNumber: number, verseNumber: string) => Bookmark | undefined;
  getBookmarksForBook: (bookSlug: string) => Bookmark[];

  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Note;
  updateNote: (id: string, content: string) => void;
  removeNote: (id: string) => void;
  getNotesForVerse: (bookSlug: string, cantoNumber: number | undefined, chapterNumber: number, verseNumber: string) => Note[];
  getNotesForBook: (bookSlug: string) => Note[];

  // Highlights
  highlights: Highlight[];
  addHighlight: (highlight: Omit<Highlight, "id" | "createdAt">) => Highlight;
  removeHighlight: (id: string) => void;
  getHighlightsForVerse: (bookSlug: string, cantoNumber: number | undefined, chapterNumber: number, verseNumber: string) => Highlight[];
  getHighlightsForBook: (bookSlug: string) => Highlight[];

  // Stats
  getStats: (bookSlug?: string) => { bookmarks: number; notes: number; highlights: number };
}

const UserContentContext = createContext<UserContentContextType | undefined>(undefined);

// Load from localStorage
const loadFromStorage = <T,>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save to localStorage
const saveToStorage = <T,>(key: string, data: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
};

export const UserContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // Load data on mount
  useEffect(() => {
    setBookmarks(loadFromStorage<Bookmark>(STORAGE_KEYS.bookmarks));
    setNotes(loadFromStorage<Note>(STORAGE_KEYS.notes));
    setHighlights(loadFromStorage<Highlight>(STORAGE_KEYS.highlights));
  }, []);

  // Save bookmarks
  useEffect(() => {
    if (bookmarks.length > 0 || localStorage.getItem(STORAGE_KEYS.bookmarks)) {
      saveToStorage(STORAGE_KEYS.bookmarks, bookmarks);
    }
  }, [bookmarks]);

  // Save notes
  useEffect(() => {
    if (notes.length > 0 || localStorage.getItem(STORAGE_KEYS.notes)) {
      saveToStorage(STORAGE_KEYS.notes, notes);
    }
  }, [notes]);

  // Save highlights
  useEffect(() => {
    if (highlights.length > 0 || localStorage.getItem(STORAGE_KEYS.highlights)) {
      saveToStorage(STORAGE_KEYS.highlights, highlights);
    }
  }, [highlights]);

  // Bookmark functions
  const addBookmark = useCallback((bookmark: Omit<Bookmark, "id" | "createdAt">): Bookmark => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setBookmarks((prev) => [...prev, newBookmark]);
    return newBookmark;
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const isBookmarked = useCallback(
    (bookSlug: string, cantoNumber: number | undefined, chapterNumber: number, verseNumber: string) => {
      return bookmarks.some(
        (b) =>
          b.bookSlug === bookSlug &&
          b.cantoNumber === cantoNumber &&
          b.chapterNumber === chapterNumber &&
          b.verseNumber === verseNumber
      );
    },
    [bookmarks]
  );

  const getBookmarkForVerse = useCallback(
    (bookSlug: string, cantoNumber: number | undefined, chapterNumber: number, verseNumber: string) => {
      return bookmarks.find(
        (b) =>
          b.bookSlug === bookSlug &&
          b.cantoNumber === cantoNumber &&
          b.chapterNumber === chapterNumber &&
          b.verseNumber === verseNumber
      );
    },
    [bookmarks]
  );

  const getBookmarksForBook = useCallback(
    (bookSlug: string) => {
      return bookmarks.filter((b) => b.bookSlug === bookSlug);
    },
    [bookmarks]
  );

  // Note functions
  const addNote = useCallback((note: Omit<Note, "id" | "createdAt" | "updatedAt">): Note => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [...prev, newNote]);
    return newNote;
  }, []);

  const updateNote = useCallback((id: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n
      )
    );
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const getNotesForVerse = useCallback(
    (bookSlug: string, cantoNumber: number | undefined, chapterNumber: number, verseNumber: string) => {
      return notes.filter(
        (n) =>
          n.bookSlug === bookSlug &&
          n.cantoNumber === cantoNumber &&
          n.chapterNumber === chapterNumber &&
          n.verseNumber === verseNumber
      );
    },
    [notes]
  );

  const getNotesForBook = useCallback(
    (bookSlug: string) => {
      return notes.filter((n) => n.bookSlug === bookSlug);
    },
    [notes]
  );

  // Highlight functions
  const addHighlight = useCallback((highlight: Omit<Highlight, "id" | "createdAt">): Highlight => {
    const newHighlight: Highlight = {
      ...highlight,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setHighlights((prev) => [...prev, newHighlight]);
    return newHighlight;
  }, []);

  const removeHighlight = useCallback((id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const getHighlightsForVerse = useCallback(
    (bookSlug: string, cantoNumber: number | undefined, chapterNumber: number, verseNumber: string) => {
      return highlights.filter(
        (h) =>
          h.bookSlug === bookSlug &&
          h.cantoNumber === cantoNumber &&
          h.chapterNumber === chapterNumber &&
          h.verseNumber === verseNumber
      );
    },
    [highlights]
  );

  const getHighlightsForBook = useCallback(
    (bookSlug: string) => {
      return highlights.filter((h) => h.bookSlug === bookSlug);
    },
    [highlights]
  );

  // Stats
  const getStats = useCallback(
    (bookSlug?: string) => {
      if (bookSlug) {
        return {
          bookmarks: bookmarks.filter((b) => b.bookSlug === bookSlug).length,
          notes: notes.filter((n) => n.bookSlug === bookSlug).length,
          highlights: highlights.filter((h) => h.bookSlug === bookSlug).length,
        };
      }
      return {
        bookmarks: bookmarks.length,
        notes: notes.length,
        highlights: highlights.length,
      };
    },
    [bookmarks, notes, highlights]
  );

  return (
    <UserContentContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        getBookmarkForVerse,
        getBookmarksForBook,
        notes,
        addNote,
        updateNote,
        removeNote,
        getNotesForVerse,
        getNotesForBook,
        highlights,
        addHighlight,
        removeHighlight,
        getHighlightsForVerse,
        getHighlightsForBook,
        getStats,
      }}
    >
      {children}
    </UserContentContext.Provider>
  );
};

export const useUserContent = () => {
  const context = useContext(UserContentContext);
  if (!context) {
    throw new Error("useUserContent must be used within a UserContentProvider");
  }
  return context;
};
