import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  calculateNextReview,
  isDueForReview,
  getDueItems,
  sortByReviewPriority,
  getReviewStats,
  formatTimeUntilReview,
  DEFAULT_SRS_METADATA,
  SRSMetadata,
} from "./spacedRepetition";

describe("calculateNextReview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses default metadata when none provided", () => {
    const result = calculateNextReview(4);
    expect(result.repetitions).toBe(1);
    expect(result.interval).toBe(1);
    expect(result.lastReviewed).toBe(Date.now());
  });

  it("clamps quality to 0-5 range", () => {
    const low = calculateNextReview(-1);
    const high = calculateNextReview(10);
    // quality -1 gets clamped to 0, quality 10 gets clamped to 5
    expect(low.repetitions).toBe(0); // q < 3 => reset
    expect(high.repetitions).toBe(1); // q >= 3 => success
  });

  it("resets repetitions on quality < 3", () => {
    const metadata: SRSMetadata = {
      easeFactor: 2.5,
      interval: 10,
      repetitions: 5,
    };
    const result = calculateNextReview(2, metadata);
    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
  });

  it("sets interval to 1 on first successful review", () => {
    const result = calculateNextReview(4, { ...DEFAULT_SRS_METADATA });
    expect(result.repetitions).toBe(1);
    expect(result.interval).toBe(1);
  });

  it("sets interval to 6 on second successful review", () => {
    const metadata: SRSMetadata = {
      easeFactor: 2.5,
      interval: 1,
      repetitions: 1,
    };
    const result = calculateNextReview(4, metadata);
    expect(result.repetitions).toBe(2);
    expect(result.interval).toBe(6);
  });

  it("multiplies interval by ease factor on subsequent reviews", () => {
    const metadata: SRSMetadata = {
      easeFactor: 2.5,
      interval: 6,
      repetitions: 2,
    };
    const result = calculateNextReview(4, metadata);
    expect(result.repetitions).toBe(3);
    // interval = round(6 * updated_ease_factor)
    expect(result.interval).toBeGreaterThan(6);
  });

  it("calculates nextReview timestamp correctly", () => {
    const result = calculateNextReview(4);
    const now = Date.now();
    const expectedNext = now + result.interval * 24 * 60 * 60 * 1000;
    expect(result.nextReview).toBe(expectedNext);
  });

  it("never lets ease factor drop below 1.3", () => {
    const metadata: SRSMetadata = {
      easeFactor: 1.3,
      interval: 1,
      repetitions: 0,
    };
    // quality 0 => maximum EF reduction
    const result = calculateNextReview(0, metadata);
    expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it("increases ease factor with quality 5", () => {
    const metadata: SRSMetadata = {
      easeFactor: 2.5,
      interval: 6,
      repetitions: 2,
    };
    const result = calculateNextReview(5, metadata);
    expect(result.easeFactor).toBe(2.6);
  });

  it("decreases ease factor with quality 3", () => {
    const metadata: SRSMetadata = {
      easeFactor: 2.5,
      interval: 6,
      repetitions: 2,
    };
    const result = calculateNextReview(3, metadata);
    expect(result.easeFactor).toBeLessThan(2.5);
  });
});

describe("isDueForReview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true for undefined metadata", () => {
    expect(isDueForReview(undefined)).toBe(true);
  });

  it("returns true when nextReview is not set", () => {
    expect(isDueForReview({ easeFactor: 2.5, interval: 0, repetitions: 0 })).toBe(true);
  });

  it("returns true when past due", () => {
    const pastDue: SRSMetadata = {
      easeFactor: 2.5,
      interval: 1,
      repetitions: 1,
      nextReview: Date.now() - 1000,
    };
    expect(isDueForReview(pastDue)).toBe(true);
  });

  it("returns false when not yet due", () => {
    const future: SRSMetadata = {
      easeFactor: 2.5,
      interval: 1,
      repetitions: 1,
      nextReview: Date.now() + 86400000,
    };
    expect(isDueForReview(future)).toBe(false);
  });
});

describe("getDueItems", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns items without SRS data", () => {
    const items = [{ id: 1 }, { id: 2, srs: undefined }];
    expect(getDueItems(items)).toHaveLength(2);
  });

  it("filters out items not yet due", () => {
    const items = [
      { id: 1, srs: { easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: Date.now() + 86400000 } },
      { id: 2, srs: { easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: Date.now() - 1000 } },
    ];
    const due = getDueItems(items);
    expect(due).toHaveLength(1);
    expect(due[0].id).toBe(2);
  });
});

describe("sortByReviewPriority", () => {
  it("puts items without SRS data first", () => {
    const items = [
      { id: 1, srs: { easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: 1000 } },
      { id: 2 },
    ];
    const sorted = sortByReviewPriority(items);
    expect(sorted[0].id).toBe(2);
  });

  it("sorts by nextReview ascending", () => {
    const items = [
      { id: 1, srs: { easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: 3000 } },
      { id: 2, srs: { easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: 1000 } },
      { id: 3, srs: { easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: 2000 } },
    ];
    const sorted = sortByReviewPriority(items);
    expect(sorted.map((i) => i.id)).toEqual([2, 3, 1]);
  });

  it("does not mutate original array", () => {
    const items = [{ id: 1, srs: undefined }, { id: 2, srs: undefined }];
    const sorted = sortByReviewPriority(items as any);
    expect(sorted).not.toBe(items);
  });
});

describe("getReviewStats", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts totals correctly", () => {
    const items = [{ id: 1, srs: undefined }, { id: 2, srs: undefined }, { id: 3, srs: undefined }];
    const stats = getReviewStats(items as any);
    expect(stats.total).toBe(3);
    expect(stats.dueToday).toBe(3); // no SRS => due
  });

  it("counts learned and mastered", () => {
    const now = Date.now();
    const items = [
      { srs: { easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: now + 1000 } },
      { srs: { easeFactor: 2.5, interval: 10, repetitions: 3, nextReview: now + 1000 } },
      { srs: { easeFactor: 2.5, interval: 0, repetitions: 0, nextReview: now - 1000 } },
    ];
    const stats = getReviewStats(items);
    expect(stats.learned).toBe(2);
    expect(stats.mastered).toBe(1);
    expect(stats.dueToday).toBe(1);
  });

  it("counts dueThisWeek correctly", () => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const items = [
      { srs: { easeFactor: 2.5, interval: 3, repetitions: 1, nextReview: now + 3 * dayMs } },
      { srs: { easeFactor: 2.5, interval: 30, repetitions: 1, nextReview: now + 30 * dayMs } },
    ];
    const stats = getReviewStats(items);
    expect(stats.dueThisWeek).toBe(1);
  });
});

describe("formatTimeUntilReview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "New" for undefined', () => {
    expect(formatTimeUntilReview(undefined)).toBe("New");
  });

  it('returns "Now" for past timestamps', () => {
    expect(formatTimeUntilReview(Date.now() - 1000)).toBe("Now");
  });

  it("formats days correctly", () => {
    const dayMs = 24 * 60 * 60 * 1000;
    expect(formatTimeUntilReview(Date.now() + 1 * dayMs)).toBe("1 day");
    expect(formatTimeUntilReview(Date.now() + 3 * dayMs)).toBe("3 days");
  });

  it("formats hours correctly", () => {
    const hourMs = 60 * 60 * 1000;
    expect(formatTimeUntilReview(Date.now() + 2 * hourMs)).toBe("2 hours");
  });

  it("formats minutes correctly", () => {
    const minMs = 60 * 1000;
    expect(formatTimeUntilReview(Date.now() + 30 * minMs)).toBe("30 minutes");
  });

  it("uses translation function when provided", () => {
    const t = (ua: string, en: string) => ua;
    expect(formatTimeUntilReview(undefined, t)).toBe("Новий");
    expect(formatTimeUntilReview(Date.now() - 1000, t)).toBe("Зараз");
  });
});
