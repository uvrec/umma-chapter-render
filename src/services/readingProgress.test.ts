import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getAllReadingPositions,
  getLastReadingPosition,
  getRecentReadingPositions,
  saveReadingPosition,
  updateReadingPercent,
  getReadingUrl,
  clearReadingHistory,
  removeReadingPosition,
  ReadingPosition,
} from "./readingProgress";

function makePosition(
  overrides: Partial<Omit<ReadingPosition, "lastReadAt">> = {}
): Omit<ReadingPosition, "lastReadAt"> {
  return {
    bookId: "book-1",
    bookSlug: "bhagavad-gita",
    bookTitle: "Bhagavad Gita",
    chapterNumber: 1,
    chapterTitle: "Chapter 1",
    percentRead: 50,
    ...overrides,
  };
}

describe("readingProgress", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getAllReadingPositions", () => {
    it("returns empty array when nothing stored", () => {
      expect(getAllReadingPositions()).toEqual([]);
    });

    it("returns stored positions", () => {
      const pos: ReadingPosition = { ...makePosition(), lastReadAt: Date.now() };
      localStorage.setItem("veda_reading_progress", JSON.stringify([pos]));
      expect(getAllReadingPositions()).toEqual([pos]);
    });

    it("returns empty array on corrupt data", () => {
      localStorage.setItem("veda_reading_progress", "not json");
      expect(getAllReadingPositions()).toEqual([]);
    });
  });

  describe("saveReadingPosition", () => {
    it("saves a new position", () => {
      saveReadingPosition(makePosition());
      const positions = getAllReadingPositions();
      expect(positions).toHaveLength(1);
      expect(positions[0].bookSlug).toBe("bhagavad-gita");
      expect(positions[0].lastReadAt).toBe(Date.now());
    });

    it("deduplicates by book+chapter key", () => {
      saveReadingPosition(makePosition({ percentRead: 30 }));
      vi.advanceTimersByTime(1000);
      saveReadingPosition(makePosition({ percentRead: 60 }));
      const positions = getAllReadingPositions();
      expect(positions).toHaveLength(1);
      expect(positions[0].percentRead).toBe(60);
    });

    it("deduplicates with canto number", () => {
      saveReadingPosition(makePosition({ cantoNumber: 1, chapterNumber: 2, percentRead: 20 }));
      vi.advanceTimersByTime(1000);
      saveReadingPosition(makePosition({ cantoNumber: 1, chapterNumber: 2, percentRead: 80 }));
      const positions = getAllReadingPositions();
      expect(positions).toHaveLength(1);
      expect(positions[0].percentRead).toBe(80);
    });

    it("keeps different chapters separate", () => {
      saveReadingPosition(makePosition({ chapterNumber: 1 }));
      saveReadingPosition(makePosition({ chapterNumber: 2 }));
      expect(getAllReadingPositions()).toHaveLength(2);
    });

    it("limits history to MAX_HISTORY (10)", () => {
      for (let i = 0; i < 15; i++) {
        vi.advanceTimersByTime(1000);
        saveReadingPosition(makePosition({ chapterNumber: i + 1 }));
      }
      expect(getAllReadingPositions()).toHaveLength(10);
    });

    it("most recent is first in the list", () => {
      saveReadingPosition(makePosition({ chapterNumber: 1, chapterTitle: "First" }));
      vi.advanceTimersByTime(1000);
      saveReadingPosition(makePosition({ chapterNumber: 2, chapterTitle: "Second" }));
      const positions = getAllReadingPositions();
      expect(positions[0].chapterTitle).toBe("Second");
    });
  });

  describe("getLastReadingPosition", () => {
    it("returns null when empty", () => {
      expect(getLastReadingPosition()).toBeNull();
    });

    it("returns the most recently read position", () => {
      saveReadingPosition(makePosition({ chapterNumber: 1 }));
      vi.advanceTimersByTime(5000);
      saveReadingPosition(makePosition({ chapterNumber: 2 }));
      const last = getLastReadingPosition();
      expect(last?.chapterNumber).toBe(2);
    });
  });

  describe("getRecentReadingPositions", () => {
    it("returns limited number of positions", () => {
      for (let i = 0; i < 8; i++) {
        vi.advanceTimersByTime(1000);
        saveReadingPosition(makePosition({ chapterNumber: i + 1 }));
      }
      expect(getRecentReadingPositions(3)).toHaveLength(3);
    });

    it("defaults to 5", () => {
      for (let i = 0; i < 8; i++) {
        vi.advanceTimersByTime(1000);
        saveReadingPosition(makePosition({ chapterNumber: i + 1 }));
      }
      expect(getRecentReadingPositions()).toHaveLength(5);
    });
  });

  describe("updateReadingPercent", () => {
    it("updates percent for existing position", () => {
      saveReadingPosition(makePosition({ chapterNumber: 3, percentRead: 10 }));
      updateReadingPercent("bhagavad-gita", 3, 75);
      const positions = getAllReadingPositions();
      expect(positions[0].percentRead).toBe(75);
    });

    it("clamps percent to 0-100", () => {
      saveReadingPosition(makePosition({ chapterNumber: 1 }));
      updateReadingPercent("bhagavad-gita", 1, 150);
      expect(getAllReadingPositions()[0].percentRead).toBe(100);
      updateReadingPercent("bhagavad-gita", 1, -20);
      expect(getAllReadingPositions()[0].percentRead).toBe(0);
    });

    it("does nothing if position not found", () => {
      saveReadingPosition(makePosition({ chapterNumber: 1 }));
      updateReadingPercent("bhagavad-gita", 99, 80);
      expect(getAllReadingPositions()[0].percentRead).toBe(50);
    });

    it("works with canto number", () => {
      saveReadingPosition(makePosition({ cantoNumber: 2, chapterNumber: 5, percentRead: 10 }));
      updateReadingPercent("bhagavad-gita", 5, 90, 2);
      expect(getAllReadingPositions()[0].percentRead).toBe(90);
    });
  });

  describe("getReadingUrl", () => {
    it("generates URL without canto", () => {
      const pos: ReadingPosition = { ...makePosition(), lastReadAt: Date.now() };
      expect(getReadingUrl(pos)).toBe("/lib/bhagavad-gita/1");
    });

    it("generates URL with canto", () => {
      const pos: ReadingPosition = {
        ...makePosition({ cantoNumber: 3, chapterNumber: 7 }),
        lastReadAt: Date.now(),
      };
      expect(getReadingUrl(pos)).toBe("/lib/bhagavad-gita/3/7");
    });

    it("includes verse number when present", () => {
      const pos: ReadingPosition = {
        ...makePosition({ verseNumber: "12" }),
        lastReadAt: Date.now(),
      };
      expect(getReadingUrl(pos)).toBe("/lib/bhagavad-gita/1/12");
    });

    it("includes verse number with canto", () => {
      const pos: ReadingPosition = {
        ...makePosition({ cantoNumber: 2, chapterNumber: 5, verseNumber: "3" }),
        lastReadAt: Date.now(),
      };
      expect(getReadingUrl(pos)).toBe("/lib/bhagavad-gita/2/5/3");
    });
  });

  describe("clearReadingHistory", () => {
    it("removes all positions", () => {
      saveReadingPosition(makePosition());
      clearReadingHistory();
      expect(getAllReadingPositions()).toEqual([]);
    });
  });

  describe("removeReadingPosition", () => {
    it("removes a specific position", () => {
      saveReadingPosition(makePosition({ chapterNumber: 1 }));
      saveReadingPosition(makePosition({ chapterNumber: 2 }));
      removeReadingPosition("bhagavad-gita", 1);
      const positions = getAllReadingPositions();
      expect(positions).toHaveLength(1);
      expect(positions[0].chapterNumber).toBe(2);
    });

    it("removes with canto number", () => {
      saveReadingPosition(makePosition({ cantoNumber: 1, chapterNumber: 1 }));
      saveReadingPosition(makePosition({ cantoNumber: 1, chapterNumber: 2 }));
      removeReadingPosition("bhagavad-gita", 1, 1);
      expect(getAllReadingPositions()).toHaveLength(1);
    });
  });
});
