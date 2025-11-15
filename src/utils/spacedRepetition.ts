// Spaced Repetition System (SRS) using SM-2 Algorithm
// Based on SuperMemo 2 algorithm for optimal learning intervals

export interface SRSMetadata {
  lastReviewed?: number; // timestamp
  nextReview?: number; // timestamp
  easeFactor: number; // difficulty factor (default 2.5)
  interval: number; // days until next review
  repetitions: number; // number of successful repetitions
}

export const DEFAULT_SRS_METADATA: SRSMetadata = {
  easeFactor: 2.5,
  interval: 0,
  repetitions: 0,
};

/**
 * SM-2 Algorithm for calculating next review interval
 * @param quality - User's response quality (0-5)
 *   5 - perfect response
 *   4 - correct response after hesitation
 *   3 - correct response recalled with difficulty
 *   2 - incorrect response; correct answer seemed easy to recall
 *   1 - incorrect response; correct answer seemed hard to recall
 *   0 - complete blackout
 * @param metadata - Current SRS metadata
 * @returns Updated SRS metadata
 */
export function calculateNextReview(
  quality: number,
  metadata: SRSMetadata = DEFAULT_SRS_METADATA
): SRSMetadata {
  const now = Date.now();

  // Quality must be between 0 and 5
  const q = Math.max(0, Math.min(5, quality));

  let { easeFactor, interval, repetitions } = metadata;

  // Update ease factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  // If quality < 3, reset repetitions and start over
  if (q < 3) {
    repetitions = 0;
    interval = 1; // Review again in 1 day
  } else {
    repetitions += 1;

    // Calculate new interval
    if (repetitions === 1) {
      interval = 1; // First successful review: 1 day
    } else if (repetitions === 2) {
      interval = 6; // Second successful review: 6 days
    } else {
      // Subsequent reviews: multiply previous interval by ease factor
      interval = Math.round(interval * easeFactor);
    }
  }

  // Calculate next review timestamp
  const nextReview = now + (interval * 24 * 60 * 60 * 1000);

  return {
    lastReviewed: now,
    nextReview,
    easeFactor,
    interval,
    repetitions,
  };
}

/**
 * Check if an item is due for review
 */
export function isDueForReview(metadata?: SRSMetadata): boolean {
  if (!metadata || !metadata.nextReview) {
    return true; // New items are always due
  }

  return Date.now() >= metadata.nextReview;
}

/**
 * Get items that are due for review
 */
export function getDueItems<T extends { srs?: SRSMetadata }>(items: T[]): T[] {
  return items.filter(item => isDueForReview(item.srs));
}

/**
 * Sort items by review priority
 * Priority order:
 * 1. Overdue items (sorted by how overdue they are)
 * 2. Due today
 * 3. Items never reviewed
 * 4. Future reviews (sorted by next review date)
 */
export function sortByReviewPriority<T extends { srs?: SRSMetadata }>(items: T[]): T[] {
  const now = Date.now();

  return [...items].sort((a, b) => {
    const aSrs = a.srs;
    const bSrs = b.srs;

    // Items without SRS data go first (never reviewed)
    if (!aSrs && !bSrs) return 0;
    if (!aSrs) return -1;
    if (!bSrs) return 1;

    const aNext = aSrs.nextReview || 0;
    const bNext = bSrs.nextReview || 0;

    // Both are due or never reviewed
    if (!aNext && !bNext) return 0;
    if (!aNext) return -1;
    if (!bNext) return 1;

    // Sort by next review date (earlier = higher priority)
    return aNext - bNext;
  });
}

/**
 * Get statistics about review schedule
 */
export function getReviewStats<T extends { srs?: SRSMetadata }>(items: T[]): {
  total: number;
  dueToday: number;
  dueThisWeek: number;
  learned: number; // repetitions >= 1
  mastered: number; // repetitions >= 3
} {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const weekMs = 7 * dayMs;

  return items.reduce((stats, item) => {
    stats.total++;

    const srs = item.srs;

    if (!srs || !srs.nextReview) {
      stats.dueToday++;
      return stats;
    }

    if (srs.repetitions >= 1) stats.learned++;
    if (srs.repetitions >= 3) stats.mastered++;

    const timeUntilReview = srs.nextReview - now;

    if (timeUntilReview <= 0) {
      stats.dueToday++;
    } else if (timeUntilReview <= weekMs) {
      stats.dueThisWeek++;
    }

    return stats;
  }, {
    total: 0,
    dueToday: 0,
    dueThisWeek: 0,
    learned: 0,
    mastered: 0,
  });
}

/**
 * Format time until next review in human-readable format
 */
export function formatTimeUntilReview(nextReview?: number, t?: (ua: string, en: string) => string): string {
  if (!nextReview) {
    return t ? t("Новий", "New") : "New";
  }

  const now = Date.now();
  const diff = nextReview - now;

  if (diff <= 0) {
    return t ? t("Зараз", "Now") : "Now";
  }

  const minutes = Math.floor(diff / (60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));

  if (days > 0) {
    return t
      ? t(`${days} ${days === 1 ? 'день' : days < 5 ? 'дні' : 'днів'}`, `${days} day${days === 1 ? '' : 's'}`)
      : `${days} day${days === 1 ? '' : 's'}`;
  }

  if (hours > 0) {
    return t
      ? t(`${hours} ${hours === 1 ? 'година' : hours < 5 ? 'години' : 'годин'}`, `${hours} hour${hours === 1 ? '' : 's'}`)
      : `${hours} hour${hours === 1 ? '' : 's'}`;
  }

  return t
    ? t(`${minutes} ${minutes === 1 ? 'хвилина' : minutes < 5 ? 'хвилини' : 'хвилин'}`, `${minutes} minute${minutes === 1 ? '' : 's'}`)
    : `${minutes} minute${minutes === 1 ? '' : 's'}`;
}
