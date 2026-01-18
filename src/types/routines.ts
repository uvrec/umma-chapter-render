/**
 * Daily Routines & Tasks - NotePlan-like functionality
 *
 * Types for tracking daily spiritual practices, tasks, and routines
 */

// Time-based routine item
export interface RoutineItem {
  id: string;
  title: string;
  title_ua?: string;
  description?: string;

  // Time scheduling
  startTime?: string;          // HH:MM format
  endTime?: string;            // HH:MM format
  duration?: number;           // minutes

  // Recurrence
  recurrence: 'daily' | 'weekly' | 'specific_days' | 'once';
  daysOfWeek?: number[];       // 0=Sun, 1=Mon, ... 6=Sat

  // Categorization
  category: RoutineCategory;
  color?: string;
  icon?: string;

  // Tracking
  trackValue?: boolean;        // true = track numeric value (e.g., rounds)
  targetValue?: number;        // target number (e.g., 16 rounds)
  unit?: string;               // "rounds", "minutes", "pages"

  // Status
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export type RoutineCategory =
  | 'japa'
  | 'reading'
  | 'service'
  | 'exercise'
  | 'meditation'
  | 'kirtan'
  | 'lecture'
  | 'custom';

// Completion record for a specific day
export interface RoutineCompletion {
  id: string;
  routineItemId: string;
  date: string;                // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;        // ISO timestamp
  value?: number;              // tracked value (rounds, minutes, etc.)
  notes?: string;
}

// Daily task (one-time or recurring)
export interface DailyTask {
  id: string;
  title: string;
  description?: string;

  // Scheduling
  date?: string;               // YYYY-MM-DD for specific date tasks
  startTime?: string;          // HH:MM

  // Recurrence (for recurring tasks)
  isRecurring: boolean;
  recurrence?: 'daily' | 'weekly' | 'monthly';
  daysOfWeek?: number[];

  // Priority
  priority: 'high' | 'medium' | 'low';

  // Status
  completed: boolean;
  completedAt?: string;

  // Organization
  category?: string;
  color?: string;
  sortOrder: number;
  createdAt: string;
}

// Daily note/journal entry
export interface DailyNote {
  id: string;
  date: string;                // YYYY-MM-DD
  content: string;             // Markdown content

  // Linked references
  linkedVerseIds?: string[];   // References to saved verse notes
  linkedBookmarks?: string[];  // References to bookmarks

  // Metadata
  mood?: 'great' | 'good' | 'neutral' | 'difficult';
  tags?: string[];

  createdAt: string;
  updatedAt: string;
}

// Complete daily data structure
export interface DailyData {
  date: string;
  routineCompletions: RoutineCompletion[];
  tasks: DailyTask[];
  note?: DailyNote;

  // Summary stats
  completedRoutines: number;
  totalRoutines: number;
  completionPercent: number;
}

// Default routine templates
export const DEFAULT_ROUTINE_ITEMS: Omit<RoutineItem, 'id' | 'createdAt'>[] = [
  {
    title: 'Mangala Arati',
    title_ua: 'Манґала Араті',
    startTime: '04:30',
    endTime: '05:00',
    duration: 30,
    recurrence: 'daily',
    category: 'kirtan',
    color: '#F59E0B',
    isActive: true,
    sortOrder: 1,
  },
  {
    title: 'Japa Meditation',
    title_ua: 'Джапа медитація',
    startTime: '05:00',
    endTime: '07:30',
    duration: 150,
    recurrence: 'daily',
    category: 'japa',
    color: '#8B5CF6',
    trackValue: true,
    targetValue: 16,
    unit: 'rounds',
    isActive: true,
    sortOrder: 2,
  },
  {
    title: 'Srimad Bhagavatam Class',
    title_ua: 'Клас Шрімад-Бгаґаватам',
    startTime: '07:30',
    endTime: '08:30',
    duration: 60,
    recurrence: 'daily',
    category: 'lecture',
    color: '#3B82F6',
    isActive: true,
    sortOrder: 3,
  },
  {
    title: 'Reading',
    title_ua: 'Читання',
    startTime: '19:00',
    endTime: '19:30',
    duration: 30,
    recurrence: 'daily',
    category: 'reading',
    color: '#22C55E',
    trackValue: true,
    targetValue: 30,
    unit: 'minutes',
    isActive: true,
    sortOrder: 4,
  },
  {
    title: 'Evening Kirtan',
    title_ua: 'Вечірній кіртан',
    startTime: '19:30',
    endTime: '20:00',
    duration: 30,
    recurrence: 'daily',
    category: 'kirtan',
    color: '#F59E0B',
    isActive: true,
    sortOrder: 5,
  },
];

// Category metadata
export const ROUTINE_CATEGORIES: Record<RoutineCategory, { label_en: string; label_ua: string; color: string; icon: string }> = {
  japa: { label_en: 'Japa', label_ua: 'Джапа', color: '#8B5CF6', icon: 'circle-dot' },
  reading: { label_en: 'Reading', label_ua: 'Читання', color: '#22C55E', icon: 'book-open' },
  service: { label_en: 'Service', label_ua: 'Служіння', color: '#EF4444', icon: 'heart-handshake' },
  exercise: { label_en: 'Exercise', label_ua: 'Вправи', color: '#06B6D4', icon: 'dumbbell' },
  meditation: { label_en: 'Meditation', label_ua: 'Медитація', color: '#A855F7', icon: 'brain' },
  kirtan: { label_en: 'Kirtan', label_ua: 'Кіртан', color: '#F59E0B', icon: 'music' },
  lecture: { label_en: 'Lecture', label_ua: 'Лекція', color: '#3B82F6', icon: 'graduation-cap' },
  custom: { label_en: 'Custom', label_ua: 'Інше', color: '#6B7280', icon: 'circle' },
};
