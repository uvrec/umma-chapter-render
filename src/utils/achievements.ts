// Achievement and Gamification System for Script Learning

export interface Achievement {
  id: string;
  title: { uk: string; en: string };
  description: { uk: string; en: string };
  icon: string; // Emoji or icon name
  category: 'words' | 'verses' | 'streak' | 'practice' | 'mastery';
  unlockedAt?: number; // timestamp
  progress?: number; // 0-100
  target?: number; // for progressive achievements
}

export interface DailyGoal {
  date: string; // YYYY-MM-DD
  target: number;
  completed: number;
  achieved: boolean;
}

export interface LearningProgress {
  lastLoginDate?: string; // YYYY-MM-DD
  currentStreak: number;
  longestStreak: number;
  totalReviews: number;
  totalCorrect: number;
  achievements: Achievement[];
  dailyGoals: DailyGoal[];
}

const STORAGE_KEY = 'scriptLearning_progress';

// Achievement definitions
export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlockedAt' | 'progress'>[] = [
  // Words achievements
  {
    id: 'first_word',
    title: { uk: 'Перше слово', en: 'First Word' },
    description: { uk: 'Додано перше слово для вивчення', en: 'Added first word to learn' },
    icon: '📝',
    category: 'words',
  },
  {
    id: 'word_collector_10',
    title: { uk: 'Колекціонер слів', en: 'Word Collector' },
    description: { uk: 'Додано 10 слів для вивчення', en: 'Added 10 words to learn' },
    icon: '📚',
    category: 'words',
    target: 10,
  },
  {
    id: 'word_master_50',
    title: { uk: 'Майстер слів', en: 'Word Master' },
    description: { uk: 'Додано 50 слів для вивчення', en: 'Added 50 words to learn' },
    icon: '🎓',
    category: 'words',
    target: 50,
  },
  {
    id: 'word_legend_100',
    title: { uk: 'Легенда слів', en: 'Word Legend' },
    description: { uk: 'Додано 100 слів для вивчення', en: 'Added 100 words to learn' },
    icon: '👑',
    category: 'words',
    target: 100,
  },

  // Verses achievements
  {
    id: 'first_verse',
    title: { uk: 'Перша шлока', en: 'First Sloka' },
    description: { uk: 'Додано перший вірш для вивчення', en: 'Added first verse to learn' },
    icon: '📖',
    category: 'verses',
  },
  {
    id: 'verse_scholar_10',
    title: { uk: 'Знавець віршів', en: 'Verse Scholar' },
    description: { uk: 'Додано 10 віршів для вивчення', en: 'Added 10 verses to learn' },
    icon: '📜',
    category: 'verses',
    target: 10,
  },
  {
    id: 'verse_sage_25',
    title: { uk: 'Мудрець віршів', en: 'Verse Sage' },
    description: { uk: 'Додано 25 віршів для вивчення', en: 'Added 25 verses to learn' },
    icon: '🧙',
    category: 'verses',
    target: 25,
  },

  // Streak achievements
  {
    id: 'streak_3',
    title: { uk: '3-денна серія', en: '3-Day Streak' },
    description: { uk: 'Займалися 3 дні поспіль', en: 'Practiced for 3 days in a row' },
    icon: '🔥',
    category: 'streak',
    target: 3,
  },
  {
    id: 'streak_7',
    title: { uk: 'Тиждень практики', en: 'Week Warrior' },
    description: { uk: 'Займалися тиждень поспіль', en: 'Practiced for 7 days in a row' },
    icon: '⚡',
    category: 'streak',
    target: 7,
  },
  {
    id: 'streak_30',
    title: { uk: 'Місяць майстерності', en: 'Month Master' },
    description: { uk: 'Займалися місяць поспіль', en: 'Practiced for 30 days in a row' },
    icon: '🌟',
    category: 'streak',
    target: 30,
  },
  {
    id: 'streak_100',
    title: { uk: 'Сотня днів', en: 'Century' },
    description: { uk: 'Займалися 100 днів поспіль', en: 'Practiced for 100 days in a row' },
    icon: '💯',
    category: 'streak',
    target: 100,
  },

  // Practice achievements
  {
    id: 'reviews_10',
    title: { uk: 'Початківець', en: 'Beginner' },
    description: { uk: 'Зроблено 10 повторень', en: 'Completed 10 reviews' },
    icon: '🌱',
    category: 'practice',
    target: 10,
  },
  {
    id: 'reviews_100',
    title: { uk: 'Практикант', en: 'Practitioner' },
    description: { uk: 'Зроблено 100 повторень', en: 'Completed 100 reviews' },
    icon: '🌿',
    category: 'practice',
    target: 100,
  },
  {
    id: 'reviews_500',
    title: { uk: 'Майстер практики', en: 'Practice Master' },
    description: { uk: 'Зроблено 500 повторень', en: 'Completed 500 reviews' },
    icon: '🌳',
    category: 'practice',
    target: 500,
  },
  {
    id: 'reviews_1000',
    title: { uk: 'Гранд-майстер', en: 'Grand Master' },
    description: { uk: 'Зроблено 1000 повторень', en: 'Completed 1000 reviews' },
    icon: '🏆',
    category: 'practice',
    target: 1000,
  },
  {
    id: 'accuracy_90',
    title: { uk: 'Точність', en: 'Precision' },
    description: { uk: 'Досягнуто 90% точності', en: 'Achieved 90% accuracy' },
    icon: '🎯',
    category: 'practice',
    target: 90,
  },
  {
    id: 'perfect_session',
    title: { uk: 'Ідеальна сесія', en: 'Perfect Session' },
    description: { uk: '10 правильних відповідей підряд', en: '10 correct answers in a row' },
    icon: '✨',
    category: 'practice',
    target: 10,
  },

  // Mastery achievements
  {
    id: 'mastered_10',
    title: { uk: 'Перші освоєння', en: 'First Masteries' },
    description: { uk: 'Освоєно 10 елементів (3+ повторення)', en: 'Mastered 10 items (3+ repetitions)' },
    icon: '🎖️',
    category: 'mastery',
    target: 10,
  },
  {
    id: 'mastered_50',
    title: { uk: 'Експерт', en: 'Expert' },
    description: { uk: 'Освоєно 50 елементів', en: 'Mastered 50 items' },
    icon: '🥇',
    category: 'mastery',
    target: 50,
  },
];

/**
 * Get learning progress from localStorage
 */
export function getLearningProgress(): LearningProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalReviews: 0,
        totalCorrect: 0,
        achievements: [],
        dailyGoals: [],
      };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading learning progress:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalReviews: 0,
      totalCorrect: 0,
      achievements: [],
      dailyGoals: [],
    };
  }
}

/**
 * Save learning progress to localStorage
 */
export function saveLearningProgress(progress: LearningProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving learning progress:', error);
  }
}

/**
 * Get today's date string (YYYY-MM-DD)
 */
function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Update streak based on login date
 */
export function updateStreak(progress: LearningProgress): LearningProgress {
  const today = getTodayString();

  if (progress.lastLoginDate === today) {
    // Already logged in today
    return progress;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  let newStreak = progress.currentStreak;

  if (progress.lastLoginDate === yesterdayString) {
    // Consecutive day
    newStreak += 1;
  } else if (progress.lastLoginDate && progress.lastLoginDate < yesterdayString) {
    // Streak broken
    newStreak = 1;
  } else {
    // First login
    newStreak = 1;
  }

  const newProgress = {
    ...progress,
    currentStreak: newStreak,
    longestStreak: Math.max(progress.longestStreak, newStreak),
    lastLoginDate: today,
  };

  saveLearningProgress(newProgress);
  return newProgress;
}

/**
 * Record a review (correct or incorrect)
 */
export function recordReview(correct: boolean): LearningProgress {
  const progress = getLearningProgress();

  const newProgress = {
    ...progress,
    totalReviews: progress.totalReviews + 1,
    totalCorrect: correct ? progress.totalCorrect + 1 : progress.totalCorrect,
  };

  saveLearningProgress(newProgress);
  return newProgress;
}

/**
 * Check and unlock achievements
 * Returns newly unlocked achievements
 */
export function checkAchievements(
  progress: LearningProgress,
  context: {
    wordCount?: number;
    verseCount?: number;
    currentStreak?: number;
    consecutiveCorrect?: number;
    masteredCount?: number;
  }
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  const unlockedIds = new Set(progress.achievements.map(a => a.id));

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    if (unlockedIds.has(def.id)) continue; // Already unlocked

    let shouldUnlock = false;

    switch (def.id) {
      // Words
      case 'first_word':
        shouldUnlock = (context.wordCount || 0) >= 1;
        break;
      case 'word_collector_10':
        shouldUnlock = (context.wordCount || 0) >= 10;
        break;
      case 'word_master_50':
        shouldUnlock = (context.wordCount || 0) >= 50;
        break;
      case 'word_legend_100':
        shouldUnlock = (context.wordCount || 0) >= 100;
        break;

      // Verses
      case 'first_verse':
        shouldUnlock = (context.verseCount || 0) >= 1;
        break;
      case 'verse_scholar_10':
        shouldUnlock = (context.verseCount || 0) >= 10;
        break;
      case 'verse_sage_25':
        shouldUnlock = (context.verseCount || 0) >= 25;
        break;

      // Streak
      case 'streak_3':
        shouldUnlock = progress.currentStreak >= 3;
        break;
      case 'streak_7':
        shouldUnlock = progress.currentStreak >= 7;
        break;
      case 'streak_30':
        shouldUnlock = progress.currentStreak >= 30;
        break;
      case 'streak_100':
        shouldUnlock = progress.currentStreak >= 100;
        break;

      // Practice
      case 'reviews_10':
        shouldUnlock = progress.totalReviews >= 10;
        break;
      case 'reviews_100':
        shouldUnlock = progress.totalReviews >= 100;
        break;
      case 'reviews_500':
        shouldUnlock = progress.totalReviews >= 500;
        break;
      case 'reviews_1000':
        shouldUnlock = progress.totalReviews >= 1000;
        break;
      case 'accuracy_90':
        shouldUnlock = progress.totalReviews > 0 &&
                      (progress.totalCorrect / progress.totalReviews) >= 0.9;
        break;
      case 'perfect_session':
        shouldUnlock = (context.consecutiveCorrect || 0) >= 10;
        break;

      // Mastery
      case 'mastered_10':
        shouldUnlock = (context.masteredCount || 0) >= 10;
        break;
      case 'mastered_50':
        shouldUnlock = (context.masteredCount || 0) >= 50;
        break;
    }

    if (shouldUnlock) {
      const achievement: Achievement = {
        ...def,
        unlockedAt: Date.now(),
      };
      newlyUnlocked.push(achievement);
    }
  }

  if (newlyUnlocked.length > 0) {
    const updatedProgress = {
      ...progress,
      achievements: [...progress.achievements, ...newlyUnlocked],
    };
    saveLearningProgress(updatedProgress);
  }

  return newlyUnlocked;
}

/**
 * Get or create today's daily goal
 */
export function getTodaysDailyGoal(defaultTarget: number = 10): DailyGoal {
  const progress = getLearningProgress();
  const today = getTodayString();

  const existing = progress.dailyGoals.find(g => g.date === today);
  if (existing) return existing;

  const newGoal: DailyGoal = {
    date: today,
    target: defaultTarget,
    completed: 0,
    achieved: false,
  };

  return newGoal;
}

/**
 * Update today's daily goal progress
 */
export function updateDailyGoal(increment: number = 1): DailyGoal {
  const progress = getLearningProgress();
  const today = getTodayString();

  let dailyGoals = progress.dailyGoals.filter(g => g.date >= today); // Keep only today and future
  const existingIndex = dailyGoals.findIndex(g => g.date === today);

  let todaysGoal: DailyGoal;

  if (existingIndex >= 0) {
    todaysGoal = dailyGoals[existingIndex];
    todaysGoal.completed += increment;
    todaysGoal.achieved = todaysGoal.completed >= todaysGoal.target;
    dailyGoals[existingIndex] = todaysGoal;
  } else {
    todaysGoal = getTodaysDailyGoal();
    todaysGoal.completed += increment;
    todaysGoal.achieved = todaysGoal.completed >= todaysGoal.target;
    dailyGoals.push(todaysGoal);
  }

  const updatedProgress = {
    ...progress,
    dailyGoals,
  };

  saveLearningProgress(updatedProgress);
  return todaysGoal;
}
