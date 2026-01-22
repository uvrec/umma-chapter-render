/**
 * Sadhana Service
 * Manages sadhana tracking, reading goals, and statistics
 */

import { supabase } from "@/integrations/supabase/client";

// ============================================================================
// Types
// ============================================================================

export interface SadhanaConfig {
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  isPublic: boolean;
  japaRoundsTarget: number;
  japaBefore730Target: number;
  readingMinutesTarget: number;
  wakeUpTarget: string; // TIME as HH:MM
  bedTimeTarget: string;
  trackService: boolean;
  trackYoga: boolean;
  trackLections: boolean;
  trackKirtan: boolean;
  reminderEnabled: boolean;
  reminderTime: string;
  timezone: string;
  language: 'uk' | 'en';
}

export interface SadhanaDaily {
  id?: string;
  userId: string;
  entryDate: string; // YYYY-MM-DD
  wakeUpTime?: string; // HH:MM
  japaBefore730: number;
  japaBefore1000: number;
  japaBefore1800: number;
  japaAfter1800: number;
  japaTotal: number;
  readingMinutes: number;
  kirtanMinutes: number;
  serviceDone: boolean;
  yogaDone: boolean;
  lectionsAttended: boolean;
  bedTime?: string;
  notes?: string;
  completionPercent: number;
}

export interface SadhanaStreak {
  currentStreak: number;
  longestStreak: number;
  lastEntryDate?: string;
}

export interface SadhanaMonthlyStats {
  monthNum: number;
  monthName: string;
  avgWakeUp: string;
  totalJapa: number;
  japaQualityPercent: number;
  totalReadingMinutes: number;
  avgBedTime: string;
  daysTracked: number;
  streakScore: number;
}

export interface ReadingGoal {
  id?: string;
  userId: string;
  bookSlug: string;
  bookTitle?: string;
  timeUnit: 'day' | 'week' | 'month' | 'year';
  duration: number;
  trackBy: 'pages' | 'slokas';
  totalPages?: number;
  totalSlokas?: number;
  targetPerDay: number;
  startedAt: string;
  targetDate?: string;
  currentPage: number;
  currentSloka: number;
  isActive: boolean;
  completedAt?: string;
  reminderEnabled: boolean;
  reminderTime?: string;
}

export interface PublicSadhanaUser {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  currentStreak: number;
  todayJapa: number;
  todayReading: number;
}

// ============================================================================
// Sadhana Config
// ============================================================================

export async function getSadhanaConfig(userId: string): Promise<SadhanaConfig | null> {
  try {
    const { data, error } = await (supabase as any)
      .from('user_sadhana_config')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return mapConfigFromDb(data);
  } catch (error) {
    console.error('Failed to get sadhana config:', error);
    return null;
  }
}

export async function upsertSadhanaConfig(config: Partial<SadhanaConfig> & { userId: string }): Promise<SadhanaConfig | null> {
  try {
    const { data, error } = await (supabase as any)
      .from('user_sadhana_config')
      .upsert({
        user_id: config.userId,
        display_name: config.displayName,
        avatar_url: config.avatarUrl,
        is_public: config.isPublic,
        japa_rounds_target: config.japaRoundsTarget,
        japa_before_730_target: config.japaBefore730Target,
        reading_minutes_target: config.readingMinutesTarget,
        wake_up_target: config.wakeUpTarget,
        bed_time_target: config.bedTimeTarget,
        track_service: config.trackService,
        track_yoga: config.trackYoga,
        track_lections: config.trackLections,
        track_kirtan: config.trackKirtan,
        reminder_enabled: config.reminderEnabled,
        reminder_time: config.reminderTime,
        timezone: config.timezone,
        language: config.language,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return mapConfigFromDb(data);
  } catch (error) {
    console.error('Failed to upsert sadhana config:', error);
    return null;
  }
}

// ============================================================================
// Sadhana Daily
// ============================================================================

export async function getSadhanaDaily(userId: string, date: string): Promise<SadhanaDaily | null> {
  try {
    const { data, error } = await (supabase as any)
      .from('user_sadhana_daily')
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', date)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return mapDailyFromDb(data);
  } catch (error) {
    console.error('Failed to get sadhana daily:', error);
    return null;
  }
}

export async function getSadhanaDailyRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<SadhanaDaily[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('user_sadhana_daily')
      .select('*')
      .eq('user_id', userId)
      .gte('entry_date', startDate)
      .lte('entry_date', endDate)
      .order('entry_date', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapDailyFromDb);
  } catch (error) {
    console.error('Failed to get sadhana daily range:', error);
    return [];
  }
}

export async function upsertSadhanaDaily(entry: Partial<SadhanaDaily> & { userId: string; entryDate: string }): Promise<SadhanaDaily | null> {
  try {
    const { data, error } = await (supabase as any).rpc('upsert_sadhana_daily', {
      p_user_id: entry.userId,
      p_entry_date: entry.entryDate,
      p_wake_up_time: entry.wakeUpTime || null,
      p_japa_before_730: entry.japaBefore730 ?? null,
      p_japa_before_1000: entry.japaBefore1000 ?? null,
      p_japa_before_1800: entry.japaBefore1800 ?? null,
      p_japa_after_1800: entry.japaAfter1800 ?? null,
      p_reading_minutes: entry.readingMinutes ?? null,
      p_kirtan_minutes: entry.kirtanMinutes ?? null,
      p_service_done: entry.serviceDone ?? null,
      p_yoga_done: entry.yogaDone ?? null,
      p_lections_attended: entry.lectionsAttended ?? null,
      p_bed_time: entry.bedTime || null,
      p_notes: entry.notes || null,
    });

    if (error) throw error;
    return mapDailyFromDb(data);
  } catch (error) {
    console.error('Failed to upsert sadhana daily:', error);
    return null;
  }
}

// ============================================================================
// Sadhana Streak
// ============================================================================

export async function getSadhanaStreak(userId: string): Promise<SadhanaStreak> {
  try {
    const { data, error } = await (supabase as any).rpc('get_sadhana_streak', {
      p_user_id: userId,
    });

    if (error) throw error;

    if (data && Array.isArray(data) && data.length > 0) {
      const row = data[0];
      return {
        currentStreak: row.current_streak || 0,
        longestStreak: row.longest_streak || 0,
        lastEntryDate: row.last_entry_date,
      };
    }

    return { currentStreak: 0, longestStreak: 0 };
  } catch (error) {
    console.error('Failed to get sadhana streak:', error);
    return { currentStreak: 0, longestStreak: 0 };
  }
}

// ============================================================================
// Sadhana Monthly Stats
// ============================================================================

export async function getSadhanaMonthlyStats(
  userId: string,
  year: number = new Date().getFullYear()
): Promise<SadhanaMonthlyStats[]> {
  try {
    const { data, error } = await (supabase as any).rpc('get_sadhana_monthly_stats', {
      p_user_id: userId,
      p_year: year,
    });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      monthNum: row.month_num,
      monthName: row.month_name,
      avgWakeUp: row.avg_wake_up || '',
      totalJapa: row.total_japa || 0,
      japaQualityPercent: parseFloat(row.japa_quality_percent) || 0,
      totalReadingMinutes: row.total_reading_minutes || 0,
      avgBedTime: row.avg_bed_time || '',
      daysTracked: row.days_tracked || 0,
      streakScore: row.streak_score || 0,
    }));
  } catch (error) {
    console.error('Failed to get sadhana monthly stats:', error);
    return [];
  }
}

// ============================================================================
// Reading Goals (Page by Page)
// ============================================================================

export async function getReadingGoals(userId: string, activeOnly = true): Promise<ReadingGoal[]> {
  try {
    let query = (supabase as any)
      .from('user_reading_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(mapReadingGoalFromDb);
  } catch (error) {
    console.error('Failed to get reading goals:', error);
    return [];
  }
}

export async function createReadingGoal(goal: Omit<ReadingGoal, 'id' | 'targetPerDay' | 'targetDate'>): Promise<ReadingGoal | null> {
  try {
    const { data, error } = await (supabase as any)
      .from('user_reading_goals')
      .insert({
        user_id: goal.userId,
        book_slug: goal.bookSlug,
        book_title: goal.bookTitle,
        time_unit: goal.timeUnit,
        duration: goal.duration,
        track_by: goal.trackBy,
        total_pages: goal.totalPages,
        total_slokas: goal.totalSlokas,
        started_at: goal.startedAt,
        current_page: goal.currentPage || 0,
        current_sloka: goal.currentSloka || 0,
        is_active: goal.isActive ?? true,
        reminder_enabled: goal.reminderEnabled || false,
        reminder_time: goal.reminderTime,
      })
      .select()
      .single();

    if (error) throw error;
    return mapReadingGoalFromDb(data);
  } catch (error) {
    console.error('Failed to create reading goal:', error);
    return null;
  }
}

export async function updateReadingGoalProgress(
  goalId: string,
  currentPage?: number,
  currentSloka?: number
): Promise<boolean> {
  try {
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (currentPage !== undefined) updates.current_page = currentPage;
    if (currentSloka !== undefined) updates.current_sloka = currentSloka;

    const { error } = await (supabase as any)
      .from('user_reading_goals')
      .update(updates)
      .eq('id', goalId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to update reading goal progress:', error);
    return false;
  }
}

export async function completeReadingGoal(goalId: string): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from('user_reading_goals')
      .update({
        is_active: false,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', goalId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to complete reading goal:', error);
    return false;
  }
}

// ============================================================================
// Public Users (Other Graphs)
// ============================================================================

export async function getPublicSadhanaUsers(
  limit = 50,
  offset = 0
): Promise<PublicSadhanaUser[]> {
  try {
    const { data, error } = await (supabase as any).rpc('get_public_sadhana_users', {
      p_limit: limit,
      p_offset: offset,
    });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      userId: row.user_id,
      displayName: row.display_name || 'Anonymous',
      avatarUrl: row.avatar_url,
      currentStreak: row.current_streak || 0,
      todayJapa: row.today_japa || 0,
      todayReading: row.today_reading || 0,
    }));
  } catch (error) {
    console.error('Failed to get public sadhana users:', error);
    return [];
  }
}

// ============================================================================
// Sadhana Friends
// ============================================================================

export async function getSadhanaFriends(userId: string): Promise<PublicSadhanaUser[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('user_sadhana_friends')
      .select(`
        friend_id,
        is_favorite,
        friend:user_sadhana_config!friend_id (
          user_id,
          display_name,
          avatar_url
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    // Fetch streak data for each friend
    const friends: PublicSadhanaUser[] = [];
    for (const row of data || []) {
      const friend = row.friend;
      if (!friend) continue;

      const streak = await getSadhanaStreak(friend.user_id);
      const today = await getSadhanaDaily(friend.user_id, new Date().toISOString().split('T')[0]);

      friends.push({
        userId: friend.user_id,
        displayName: friend.display_name || 'Anonymous',
        avatarUrl: friend.avatar_url,
        currentStreak: streak.currentStreak,
        todayJapa: today?.japaTotal || 0,
        todayReading: today?.readingMinutes || 0,
      });
    }

    return friends;
  } catch (error) {
    console.error('Failed to get sadhana friends:', error);
    return [];
  }
}

export async function addSadhanaFriend(userId: string, friendId: string): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from('user_sadhana_friends')
      .insert({ user_id: userId, friend_id: friendId });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to add sadhana friend:', error);
    return false;
  }
}

export async function removeSadhanaFriend(userId: string, friendId: string): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from('user_sadhana_friends')
      .delete()
      .eq('user_id', userId)
      .eq('friend_id', friendId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to remove sadhana friend:', error);
    return false;
  }
}

// ============================================================================
// Mappers
// ============================================================================

function mapConfigFromDb(data: any): SadhanaConfig {
  return {
    userId: data.user_id,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    isPublic: data.is_public || false,
    japaRoundsTarget: data.japa_rounds_target || 16,
    japaBefore730Target: data.japa_before_730_target || 16,
    readingMinutesTarget: data.reading_minutes_target || 30,
    wakeUpTarget: data.wake_up_target || '04:00',
    bedTimeTarget: data.bed_time_target || '22:00',
    trackService: data.track_service ?? true,
    trackYoga: data.track_yoga ?? false,
    trackLections: data.track_lections ?? true,
    trackKirtan: data.track_kirtan ?? true,
    reminderEnabled: data.reminder_enabled || false,
    reminderTime: data.reminder_time || '04:00',
    timezone: data.timezone || 'UTC',
    language: data.language || 'uk',
  };
}

function mapDailyFromDb(data: any): SadhanaDaily {
  return {
    id: data.id,
    userId: data.user_id,
    entryDate: data.entry_date,
    wakeUpTime: data.wake_up_time,
    japaBefore730: data.japa_before_730 || 0,
    japaBefore1000: data.japa_before_1000 || 0,
    japaBefore1800: data.japa_before_1800 || 0,
    japaAfter1800: data.japa_after_1800 || 0,
    japaTotal: data.japa_total || 0,
    readingMinutes: data.reading_minutes || 0,
    kirtanMinutes: data.kirtan_minutes || 0,
    serviceDone: data.service_done || false,
    yogaDone: data.yoga_done || false,
    lectionsAttended: data.lections_attended || false,
    bedTime: data.bed_time,
    notes: data.notes,
    completionPercent: parseFloat(data.completion_percent) || 0,
  };
}

function mapReadingGoalFromDb(data: any): ReadingGoal {
  return {
    id: data.id,
    userId: data.user_id,
    bookSlug: data.book_slug,
    bookTitle: data.book_title,
    timeUnit: data.time_unit,
    duration: data.duration,
    trackBy: data.track_by,
    totalPages: data.total_pages,
    totalSlokas: data.total_slokas,
    targetPerDay: parseFloat(data.target_per_day) || 0,
    startedAt: data.started_at,
    targetDate: data.target_date,
    currentPage: data.current_page || 0,
    currentSloka: data.current_sloka || 0,
    isActive: data.is_active ?? true,
    completedAt: data.completed_at,
    reminderEnabled: data.reminder_enabled || false,
    reminderTime: data.reminder_time,
  };
}
