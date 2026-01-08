/**
 * useSadhana - Hook for managing sadhana tracking data
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  SadhanaConfig,
  SadhanaDaily,
  SadhanaStreak,
  SadhanaMonthlyStats,
  ReadingGoal,
  PublicSadhanaUser,
  getSadhanaConfig,
  upsertSadhanaConfig,
  getSadhanaDaily,
  getSadhanaDailyRange,
  upsertSadhanaDaily,
  getSadhanaStreak,
  getSadhanaMonthlyStats,
  getReadingGoals,
  createReadingGoal,
  updateReadingGoalProgress,
  completeReadingGoal,
  getPublicSadhanaUsers,
  getSadhanaFriends,
  addSadhanaFriend,
  removeSadhanaFriend,
} from '@/services/sadhanaService';

interface UseSadhanaResult {
  // Data
  config: SadhanaConfig | null;
  todayEntry: SadhanaDaily | null;
  streak: SadhanaStreak;
  monthlyStats: SadhanaMonthlyStats[];
  readingGoals: ReadingGoal[];
  publicUsers: PublicSadhanaUser[];
  friends: PublicSadhanaUser[];

  // Loading states
  isLoading: boolean;
  isLoadingStats: boolean;

  // Actions
  updateConfig: (config: Partial<SadhanaConfig>) => Promise<void>;
  updateDailyEntry: (entry: Partial<SadhanaDaily>) => Promise<void>;
  getDailyEntries: (startDate: string, endDate: string) => Promise<SadhanaDaily[]>;
  addReadingGoal: (goal: Omit<ReadingGoal, 'id' | 'targetPerDay' | 'targetDate' | 'userId'>) => Promise<ReadingGoal | null>;
  updateGoalProgress: (goalId: string, currentPage?: number, currentSloka?: number) => Promise<void>;
  markGoalComplete: (goalId: string) => Promise<void>;
  followUser: (friendId: string) => Promise<void>;
  unfollowUser: (friendId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  refreshStats: (year?: number) => Promise<void>;
  loadPublicUsers: () => Promise<void>;
}

export function useSadhana(): UseSadhanaResult {
  const { user } = useAuth();
  const userId = user?.id;

  // State
  const [config, setConfig] = useState<SadhanaConfig | null>(null);
  const [todayEntry, setTodayEntry] = useState<SadhanaDaily | null>(null);
  const [streak, setStreak] = useState<SadhanaStreak>({ currentStreak: 0, longestStreak: 0 });
  const [monthlyStats, setMonthlyStats] = useState<SadhanaMonthlyStats[]>([]);
  const [readingGoals, setReadingGoals] = useState<ReadingGoal[]>([]);
  const [publicUsers, setPublicUsers] = useState<PublicSadhanaUser[]>([]);
  const [friends, setFriends] = useState<PublicSadhanaUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // Load initial data
  const loadData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [configData, todayData, streakData, goalsData, friendsData] = await Promise.all([
        getSadhanaConfig(userId),
        getSadhanaDaily(userId, getTodayDate()),
        getSadhanaStreak(userId),
        getReadingGoals(userId),
        getSadhanaFriends(userId),
      ]);

      setConfig(configData);
      setTodayEntry(todayData);
      setStreak(streakData);
      setReadingGoals(goalsData);
      setFriends(friendsData);
    } catch (error) {
      console.error('Failed to load sadhana data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update config
  const updateConfig = useCallback(async (updates: Partial<SadhanaConfig>) => {
    if (!userId) return;

    const result = await upsertSadhanaConfig({ ...updates, userId });
    if (result) {
      setConfig(result);
    }
  }, [userId]);

  // Update daily entry
  const updateDailyEntry = useCallback(async (updates: Partial<SadhanaDaily>) => {
    if (!userId) return;

    const entryDate = updates.entryDate || getTodayDate();
    const result = await upsertSadhanaDaily({ ...updates, userId, entryDate });

    if (result && entryDate === getTodayDate()) {
      setTodayEntry(result);
      // Refresh streak after updating entry
      const newStreak = await getSadhanaStreak(userId);
      setStreak(newStreak);
    }
  }, [userId]);

  // Get daily entries for a date range
  const getDailyEntries = useCallback(async (startDate: string, endDate: string) => {
    if (!userId) return [];
    return getSadhanaDailyRange(userId, startDate, endDate);
  }, [userId]);

  // Add reading goal
  const addReadingGoal = useCallback(async (goal: Omit<ReadingGoal, 'id' | 'targetPerDay' | 'targetDate' | 'userId'>) => {
    if (!userId) return null;

    const result = await createReadingGoal({ ...goal, userId });
    if (result) {
      setReadingGoals(prev => [result, ...prev]);
    }
    return result;
  }, [userId]);

  // Update goal progress
  const updateGoalProgress = useCallback(async (goalId: string, currentPage?: number, currentSloka?: number) => {
    const success = await updateReadingGoalProgress(goalId, currentPage, currentSloka);
    if (success) {
      setReadingGoals(prev => prev.map(g => {
        if (g.id === goalId) {
          return {
            ...g,
            currentPage: currentPage ?? g.currentPage,
            currentSloka: currentSloka ?? g.currentSloka,
          };
        }
        return g;
      }));
    }
  }, []);

  // Mark goal complete
  const markGoalComplete = useCallback(async (goalId: string) => {
    const success = await completeReadingGoal(goalId);
    if (success) {
      setReadingGoals(prev => prev.map(g => {
        if (g.id === goalId) {
          return { ...g, isActive: false, completedAt: new Date().toISOString() };
        }
        return g;
      }));
    }
  }, []);

  // Follow user
  const followUser = useCallback(async (friendId: string) => {
    if (!userId) return;

    const success = await addSadhanaFriend(userId, friendId);
    if (success) {
      const updatedFriends = await getSadhanaFriends(userId);
      setFriends(updatedFriends);
    }
  }, [userId]);

  // Unfollow user
  const unfollowUser = useCallback(async (friendId: string) => {
    if (!userId) return;

    const success = await removeSadhanaFriend(userId, friendId);
    if (success) {
      setFriends(prev => prev.filter(f => f.userId !== friendId));
    }
  }, [userId]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Refresh monthly stats
  const refreshStats = useCallback(async (year?: number) => {
    if (!userId) return;

    setIsLoadingStats(true);
    try {
      const stats = await getSadhanaMonthlyStats(userId, year);
      setMonthlyStats(stats);
    } finally {
      setIsLoadingStats(false);
    }
  }, [userId]);

  // Load public users
  const loadPublicUsers = useCallback(async () => {
    const users = await getPublicSadhanaUsers();
    setPublicUsers(users);
  }, []);

  return {
    config,
    todayEntry,
    streak,
    monthlyStats,
    readingGoals,
    publicUsers,
    friends,
    isLoading,
    isLoadingStats,
    updateConfig,
    updateDailyEntry,
    getDailyEntries,
    addReadingGoal,
    updateGoalProgress,
    markGoalComplete,
    followUser,
    unfollowUser,
    refreshData,
    refreshStats,
    loadPublicUsers,
  };
}
