/**
 * Reading Session Service
 * Tracks reading sessions, time spent, and syncs progress to Supabase
 */

import { supabase } from "@/integrations/supabase/client";

export interface ReadingSession {
  id?: string;
  userId?: string;
  bookSlug: string;
  bookTitle?: string;
  cantoNumber?: number;
  chapterNumber: number;
  chapterTitle?: string;
  startedAt: Date;
  endedAt?: Date;
  durationSeconds?: number;
  startVerse?: string;
  endVerse?: string;
  versesRead?: number;
  percentRead?: number;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  isAudioSession?: boolean;
}

export interface BookProgress {
  bookSlug: string;
  bookTitle?: string;
  totalChapters: number;
  chaptersStarted: number;
  chaptersCompleted: number;
  overallPercent: number;
  totalReadingSeconds: number;
  totalSessions: number;
  firstReadAt?: Date;
  lastReadAt?: Date;
}

export interface ChapterProgress {
  bookSlug: string;
  cantoNumber?: number;
  chapterNumber: number;
  chapterTitle?: string;
  totalVerses: number;
  versesRead: number;
  percentRead: number;
  isCompleted: boolean;
  readingSeconds: number;
  sessionCount: number;
  lastVerse?: string;
  lastReadAt?: Date;
}

export interface ReadingStats {
  totalReadingTime: number;
  totalSessions: number;
  booksInProgress: number;
  booksCompleted: number;
  chaptersCompleted: number;
  currentStreak: number;
  longestStreak: number;
}

// Local storage key for anonymous sessions
const LOCAL_SESSIONS_KEY = 'veda_reading_sessions';
const CURRENT_SESSION_KEY = 'veda_current_session';

// Detect device type
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Get current session from localStorage
function getCurrentSession(): ReadingSession | null {
  try {
    const data = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!data) return null;
    const session = JSON.parse(data);
    session.startedAt = new Date(session.startedAt);
    if (session.endedAt) session.endedAt = new Date(session.endedAt);
    return session;
  } catch {
    return null;
  }
}

// Save current session to localStorage
function saveCurrentSession(session: ReadingSession | null): void {
  try {
    if (session) {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    }
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

/**
 * Start a new reading session
 */
export async function startReadingSession(params: {
  bookSlug: string;
  bookTitle?: string;
  cantoNumber?: number;
  chapterNumber: number;
  chapterTitle?: string;
  startVerse?: string;
  isAudioSession?: boolean;
}): Promise<ReadingSession> {
  // End any existing session first
  const existingSession = getCurrentSession();
  if (existingSession) {
    await endReadingSession();
  }

  const { data: { user } } = await supabase.auth.getUser();

  const session: ReadingSession = {
    userId: user?.id,
    bookSlug: params.bookSlug,
    bookTitle: params.bookTitle,
    cantoNumber: params.cantoNumber,
    chapterNumber: params.chapterNumber,
    chapterTitle: params.chapterTitle,
    startedAt: new Date(),
    startVerse: params.startVerse,
    deviceType: getDeviceType(),
    isAudioSession: params.isAudioSession || false,
    versesRead: 0,
    percentRead: 0,
  };

  // Try to insert into Supabase
  if (user) {
    try {
      const { data, error } = await (supabase as any)
        .from('user_reading_sessions')
        .insert({
          user_id: user.id,
          book_slug: session.bookSlug,
          book_title: session.bookTitle,
          canto_number: session.cantoNumber,
          chapter_number: session.chapterNumber,
          chapter_title: session.chapterTitle,
          started_at: session.startedAt.toISOString(),
          start_verse: session.startVerse,
          device_type: session.deviceType,
          is_audio_session: session.isAudioSession,
        })
        .select()
        .single();

      if (!error && data) {
        session.id = (data as any).id;
      }
    } catch (error) {
      console.error('Failed to start session in Supabase:', error);
    }
  }

  saveCurrentSession(session);
  return session;
}

/**
 * Update the current session progress
 */
export function updateSessionProgress(params: {
  endVerse?: string;
  versesRead?: number;
  percentRead?: number;
}): void {
  const session = getCurrentSession();
  if (!session) return;

  if (params.endVerse !== undefined) session.endVerse = params.endVerse;
  if (params.versesRead !== undefined) session.versesRead = params.versesRead;
  if (params.percentRead !== undefined) session.percentRead = params.percentRead;

  saveCurrentSession(session);
}

/**
 * End the current reading session and sync to database
 */
export async function endReadingSession(): Promise<ReadingSession | null> {
  const session = getCurrentSession();
  if (!session) return null;

  session.endedAt = new Date();
  session.durationSeconds = Math.floor(
    (session.endedAt.getTime() - session.startedAt.getTime()) / 1000
  );

  // Minimum 5 seconds to count as valid session
  if (session.durationSeconds < 5) {
    saveCurrentSession(null);
    return null;
  }

  const { data: { user } } = await supabase.auth.getUser();

  // Update in Supabase if we have a session ID
  if (session.id && user) {
    try {
      await (supabase as any).rpc('end_reading_session', {
        p_session_id: session.id,
        p_end_verse: session.endVerse || null,
        p_verses_read: session.versesRead || 0,
        p_percent_read: session.percentRead || 0,
      });
    } catch (error) {
      console.error('Failed to end session in Supabase:', error);
      // Store locally for later sync
      storeLocalSession(session);
    }
  } else {
    // Store locally for anonymous users or failed requests
    storeLocalSession(session);
  }

  saveCurrentSession(null);
  return session;
}

/**
 * Store session in localStorage for offline/anonymous tracking
 */
function storeLocalSession(session: ReadingSession): void {
  try {
    const data = localStorage.getItem(LOCAL_SESSIONS_KEY);
    const sessions: ReadingSession[] = data ? JSON.parse(data) : [];
    sessions.push(session);
    // Keep only last 50 sessions
    const limited = sessions.slice(-50);
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Failed to store local session:', error);
  }
}

/**
 * Get local sessions for display (when not logged in)
 */
export function getLocalSessions(): ReadingSession[] {
  try {
    const data = localStorage.getItem(LOCAL_SESSIONS_KEY);
    if (!data) return [];
    const sessions = JSON.parse(data) as ReadingSession[];
    return sessions.map(s => ({
      ...s,
      startedAt: new Date(s.startedAt),
      endedAt: s.endedAt ? new Date(s.endedAt) : undefined,
    }));
  } catch {
    return [];
  }
}

/**
 * Get book progress for a user
 */
export async function getBookProgress(userId?: string): Promise<BookProgress[]> {
  if (!userId) {
    // Calculate from local sessions
    return calculateLocalBookProgress();
  }

  try {
    const { data, error } = await (supabase as any)
      .from('user_book_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_read_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      bookSlug: row.book_slug,
      bookTitle: row.book_title,
      totalChapters: row.total_chapters || 0,
      chaptersStarted: row.chapters_started || 0,
      chaptersCompleted: row.chapters_completed || 0,
      overallPercent: parseFloat(row.overall_percent) || 0,
      totalReadingSeconds: row.total_reading_seconds || 0,
      totalSessions: row.total_sessions || 0,
      firstReadAt: row.first_read_at ? new Date(row.first_read_at) : undefined,
      lastReadAt: row.last_read_at ? new Date(row.last_read_at) : undefined,
    }));
  } catch (error) {
    console.error('Failed to get book progress:', error);
    return calculateLocalBookProgress();
  }
}

/**
 * Get chapter progress for a book
 */
export async function getChapterProgress(
  userId: string | undefined,
  bookSlug: string
): Promise<ChapterProgress[]> {
  if (!userId) {
    return calculateLocalChapterProgress(bookSlug);
  }

  try {
    const { data, error } = await (supabase as any)
      .from('user_chapter_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('book_slug', bookSlug)
      .order('canto_number', { ascending: true })
      .order('chapter_number', { ascending: true });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      bookSlug: row.book_slug,
      cantoNumber: row.canto_number,
      chapterNumber: row.chapter_number,
      chapterTitle: row.chapter_title,
      totalVerses: row.total_verses || 0,
      versesRead: row.verses_read || 0,
      percentRead: parseFloat(row.percent_read) || 0,
      isCompleted: row.is_completed || false,
      readingSeconds: row.reading_seconds || 0,
      sessionCount: row.session_count || 0,
      lastVerse: row.last_verse,
      lastReadAt: row.last_read_at ? new Date(row.last_read_at) : undefined,
    }));
  } catch (error) {
    console.error('Failed to get chapter progress:', error);
    return calculateLocalChapterProgress(bookSlug);
  }
}

/**
 * Get reading stats summary
 */
export async function getReadingStats(userId?: string): Promise<ReadingStats> {
  const defaultStats: ReadingStats = {
    totalReadingTime: 0,
    totalSessions: 0,
    booksInProgress: 0,
    booksCompleted: 0,
    chaptersCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
  };

  if (!userId) {
    return calculateLocalStats();
  }

  try {
    const { data, error } = await (supabase as any).rpc('get_user_reading_stats', {
      p_user_id: userId,
    });

    if (error) throw error;

    if (data && Array.isArray(data) && data.length > 0) {
      const row = data[0] as any;
      return {
        totalReadingTime: row.total_reading_time || 0,
        totalSessions: row.total_sessions || 0,
        booksInProgress: row.books_in_progress || 0,
        booksCompleted: row.books_completed || 0,
        chaptersCompleted: row.chapters_completed || 0,
        currentStreak: row.current_streak || 0,
        longestStreak: row.longest_streak || 0,
      };
    }

    return defaultStats;
  } catch (error) {
    console.error('Failed to get reading stats:', error);
    return calculateLocalStats();
  }
}

/**
 * Get daily reading stats for charts
 */
export async function getDailyReadingStats(
  userId: string,
  days: number = 30
): Promise<Array<{ date: string; seconds: number; sessions: number; verses: number }>> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await (supabase as any)
      .from('user_reading_daily_stats')
      .select('stats_date, reading_seconds, sessions_count, verses_read')
      .eq('user_id', userId)
      .gte('stats_date', startDate.toISOString().split('T')[0])
      .order('stats_date', { ascending: true });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      date: row.stats_date,
      seconds: row.reading_seconds || 0,
      sessions: row.sessions_count || 0,
      verses: row.verses_read || 0,
    }));
  } catch (error) {
    console.error('Failed to get daily stats:', error);
    return [];
  }
}

// Calculate book progress from local sessions
function calculateLocalBookProgress(): BookProgress[] {
  const sessions = getLocalSessions();
  const bookMap = new Map<string, BookProgress>();

  for (const session of sessions) {
    const existing = bookMap.get(session.bookSlug) || {
      bookSlug: session.bookSlug,
      bookTitle: session.bookTitle,
      totalChapters: 0,
      chaptersStarted: 0,
      chaptersCompleted: 0,
      overallPercent: 0,
      totalReadingSeconds: 0,
      totalSessions: 0,
      firstReadAt: session.startedAt,
      lastReadAt: session.startedAt,
    };

    existing.totalReadingSeconds += session.durationSeconds || 0;
    existing.totalSessions += 1;
    if (session.startedAt < (existing.firstReadAt || new Date())) {
      existing.firstReadAt = session.startedAt;
    }
    if (session.startedAt > (existing.lastReadAt || new Date(0))) {
      existing.lastReadAt = session.startedAt;
    }

    bookMap.set(session.bookSlug, existing);
  }

  return Array.from(bookMap.values());
}

// Calculate chapter progress from local sessions
function calculateLocalChapterProgress(bookSlug: string): ChapterProgress[] {
  const sessions = getLocalSessions().filter(s => s.bookSlug === bookSlug);
  const chapterMap = new Map<string, ChapterProgress>();

  for (const session of sessions) {
    const key = `${session.cantoNumber || 0}-${session.chapterNumber}`;
    const existing = chapterMap.get(key) || {
      bookSlug: session.bookSlug,
      cantoNumber: session.cantoNumber,
      chapterNumber: session.chapterNumber,
      chapterTitle: session.chapterTitle,
      totalVerses: 0,
      versesRead: 0,
      percentRead: 0,
      isCompleted: false,
      readingSeconds: 0,
      sessionCount: 0,
      lastReadAt: session.startedAt,
    };

    existing.readingSeconds += session.durationSeconds || 0;
    existing.sessionCount += 1;
    existing.percentRead = Math.max(existing.percentRead, session.percentRead || 0);
    existing.versesRead = Math.max(existing.versesRead, session.versesRead || 0);
    existing.lastVerse = session.endVerse;
    if (session.startedAt > (existing.lastReadAt || new Date(0))) {
      existing.lastReadAt = session.startedAt;
    }

    chapterMap.set(key, existing);
  }

  return Array.from(chapterMap.values());
}

// Calculate stats from local sessions
function calculateLocalStats(): ReadingStats {
  const sessions = getLocalSessions();
  const books = new Set(sessions.map(s => s.bookSlug));

  return {
    totalReadingTime: sessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0),
    totalSessions: sessions.length,
    booksInProgress: books.size,
    booksCompleted: 0,
    chaptersCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
  };
}

/**
 * Sync local sessions to server when user logs in
 */
export async function syncLocalSessionsToServer(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const localSessions = getLocalSessions();
  if (localSessions.length === 0) return;

  try {
    for (const session of localSessions) {
      await (supabase as any).from('user_reading_sessions').insert({
        user_id: user.id,
        book_slug: session.bookSlug,
        book_title: session.bookTitle,
        canto_number: session.cantoNumber,
        chapter_number: session.chapterNumber,
        chapter_title: session.chapterTitle,
        started_at: session.startedAt.toISOString(),
        ended_at: session.endedAt?.toISOString(),
        duration_seconds: session.durationSeconds,
        start_verse: session.startVerse,
        end_verse: session.endVerse,
        verses_read: session.versesRead,
        percent_read: session.percentRead,
        device_type: session.deviceType,
        is_audio_session: session.isAudioSession,
      });
    }

    // Clear local sessions after successful sync
    localStorage.removeItem(LOCAL_SESSIONS_KEY);
  } catch (error) {
    console.error('Failed to sync local sessions:', error);
  }
}
