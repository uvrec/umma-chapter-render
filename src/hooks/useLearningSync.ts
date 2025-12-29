/**
 * useLearningSync - Hook for syncing learning data between localStorage and Supabase
 *
 * Provides:
 * - Automatic sync when user logs in
 * - Merge localStorage with cloud data (cloud takes priority for conflicts)
 * - Real-time updates to cloud on changes
 * - Fallback to localStorage when offline or not authenticated
 */

import { useEffect, useCallback, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LearningWord, getLearningWords, saveLearningWords } from '@/utils/learningWords';
import { LearningVerse, getLearningVerses, saveLearningVerses } from '@/utils/learningVerses';
import { LearningProgress, getLearningProgress, saveLearningProgress } from '@/utils/achievements';
import { toast } from 'sonner';

interface LearningActivity {
  activity_date: string;
  reviews_count: number;
  correct_count: number;
  words_added: number;
  verses_added: number;
  time_spent_seconds: number;
}

interface UseLearningSync {
  // State
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  isOnline: boolean;

  // Actions
  syncToCloud: () => Promise<void>;
  syncFromCloud: () => Promise<void>;
  recordActivity: (data: Partial<LearningActivity>) => Promise<void>;
  getActivityHistory: (days?: number) => Promise<LearningActivity[]>;

  // Data
  words: LearningWord[];
  verses: LearningVerse[];
  progress: LearningProgress;

  // Setters that sync
  setWords: (words: LearningWord[]) => void;
  setVerses: (verses: LearningVerse[]) => void;
  setProgress: (progress: LearningProgress) => void;
}

export function useLearningSync(): UseLearningSync {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Local state mirroring localStorage
  const [words, setWordsLocal] = useState<LearningWord[]>(() => getLearningWords());
  const [verses, setVersesLocal] = useState<LearningVerse[]>(() => getLearningVerses());
  const [progress, setProgressLocal] = useState<LearningProgress>(() => getLearningProgress());

  // Debounce timer for cloud sync
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Refs for stable function references (prevents circular dependency)
  const wordsRef = useRef(words);
  const versesRef = useRef(verses);
  const progressRef = useRef(progress);
  const isSyncingRef = useRef(isSyncing);
  const hasSyncedOnMount = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { wordsRef.current = words; }, [words]);
  useEffect(() => { versesRef.current = verses; }, [verses]);
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { isSyncingRef.current = isSyncing; }, [isSyncing]);

  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync words to cloud
  const syncWordsToCloud = async (wordsToSync: LearningWord[]) => {
    if (!user) return;

    try {
      // Upsert all words
      for (const word of wordsToSync) {
        await supabase.from('user_learning_items').upsert({
          user_id: user.id,
          item_type: 'word',
          item_id: word.iast,
          item_data: {
            script: word.script,
            iast: word.iast,
            ukrainian: word.ukrainian,
            meaning: word.meaning,
            usageCount: word.usageCount,
            book: word.book,
            verseReference: word.verseReference,
            addedAt: word.addedAt,
          },
          srs_ease_factor: word.srs?.easeFactor ?? 2.5,
          srs_interval: word.srs?.interval ?? 0,
          srs_repetitions: word.srs?.repetitions ?? 0,
          srs_last_reviewed: word.srs?.lastReviewed ? new Date(word.srs.lastReviewed).toISOString() : null,
          srs_next_review: word.srs?.nextReview ? new Date(word.srs.nextReview).toISOString() : null,
        }, {
          onConflict: 'user_id,item_type,item_id',
        });
      }
    } catch (error) {
      console.error('Error syncing words to cloud:', error);
    }
  };

  // Sync verses to cloud
  const syncVersesToCloud = async (versesToSync: LearningVerse[]) => {
    if (!user) return;

    try {
      for (const verse of versesToSync) {
        await supabase.from('user_learning_items').upsert({
          user_id: user.id,
          item_type: 'verse',
          item_id: verse.verseId,
          item_data: {
            verseId: verse.verseId,
            verseNumber: verse.verseNumber,
            bookName: verse.bookName,
            bookSlug: verse.bookSlug,
            cantoNumber: verse.cantoNumber,
            chapterNumber: verse.chapterNumber,
            sanskritText: verse.sanskritText,
            transliteration: verse.transliteration,
            translation: verse.translation,
            commentary: verse.commentary,
            audioUrl: verse.audioUrl,
            audioSanskrit: verse.audioSanskrit,
            audioTranslation: verse.audioTranslation,
            addedAt: verse.addedAt,
          },
          srs_ease_factor: verse.srs?.easeFactor ?? 2.5,
          srs_interval: verse.srs?.interval ?? 0,
          srs_repetitions: verse.srs?.repetitions ?? 0,
          srs_last_reviewed: verse.srs?.lastReviewed ? new Date(verse.srs.lastReviewed).toISOString() : null,
          srs_next_review: verse.srs?.nextReview ? new Date(verse.srs.nextReview).toISOString() : null,
        }, {
          onConflict: 'user_id,item_type,item_id',
        });
      }
    } catch (error) {
      console.error('Error syncing verses to cloud:', error);
    }
  };

  // Sync progress to cloud
  const syncProgressToCloud = async (progressToSync: LearningProgress) => {
    if (!user) return;

    try {
      // Check if record exists
      const { data: existing } = await supabase
        .from('user_learning_progress')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const progressData = {
        current_streak: progressToSync.currentStreak,
        longest_streak: progressToSync.longestStreak,
        last_login_date: progressToSync.lastLoginDate,
        total_reviews: progressToSync.totalReviews,
        total_correct: progressToSync.totalCorrect,
        achievements: JSON.parse(JSON.stringify(progressToSync.achievements)),
        daily_goal: progressToSync.dailyGoals?.[0]?.target ?? 20,
      };

      if (existing) {
        await supabase
          .from('user_learning_progress')
          .update(progressData)
          .eq('user_id', user.id);
      } else {
        await supabase.from('user_learning_progress').insert([
          { ...progressData, user_id: user.id }
        ]);
      }
    } catch (error) {
      console.error('Error syncing progress to cloud:', error);
    }
  };

  // Full sync to cloud - uses refs for stable function reference
  const syncToCloud = useCallback(async () => {
    if (!user || !isOnline || isSyncingRef.current) return;

    setIsSyncing(true);
    try {
      await Promise.all([
        syncWordsToCloud(wordsRef.current),
        syncVersesToCloud(versesRef.current),
        syncProgressToCloud(progressRef.current),
      ]);
      setLastSyncedAt(new Date());
    } catch (error) {
      console.error('Error syncing to cloud:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [user, isOnline]);

  // Sync from cloud - uses refs for stable function reference
  const syncFromCloud = useCallback(async () => {
    if (!user || !isOnline || isSyncingRef.current) return;

    setIsSyncing(true);
    try {
      // Fetch words from cloud
      const { data: cloudWords, error: wordsError } = await supabase
        .from('user_learning_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_type', 'word');

      if (wordsError) throw wordsError;

      // Fetch verses from cloud
      const { data: cloudVerses, error: versesError } = await supabase
        .from('user_learning_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_type', 'verse');

      if (versesError) throw versesError;

      // Fetch progress from cloud
      const { data: cloudProgress, error: progressError } = await supabase
        .from('user_learning_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Merge words (cloud priority, but keep local items not in cloud)
      const localWords = getLearningWords();
      const mergedWords: LearningWord[] = [];

      // Add all cloud words
      if (cloudWords) {
        for (const cw of cloudWords) {
          const itemData = cw.item_data as Record<string, unknown>;
          mergedWords.push({
            script: itemData.script as string,
            iast: itemData.iast as string,
            ukrainian: itemData.ukrainian as string,
            meaning: itemData.meaning as string,
            usageCount: itemData.usageCount as number | undefined,
            book: itemData.book as string | undefined,
            verseReference: itemData.verseReference as string | undefined,
            addedAt: itemData.addedAt as number | undefined,
            srs: {
              easeFactor: cw.srs_ease_factor ?? 2.5,
              interval: cw.srs_interval ?? 0,
              repetitions: cw.srs_repetitions ?? 0,
              lastReviewed: cw.srs_last_reviewed ? new Date(cw.srs_last_reviewed).getTime() : undefined,
              nextReview: cw.srs_next_review ? new Date(cw.srs_next_review).getTime() : undefined,
            },
          });
        }
      }

      // Add local words not in cloud
      const cloudWordIds = new Set(mergedWords.map(w => w.iast));
      for (const lw of localWords) {
        if (!cloudWordIds.has(lw.iast)) {
          mergedWords.push(lw);
        }
      }

      // Merge verses
      const localVerses = getLearningVerses();
      const mergedVerses: LearningVerse[] = [];

      if (cloudVerses) {
        for (const cv of cloudVerses) {
          const itemData = cv.item_data as Record<string, unknown>;
          mergedVerses.push({
            verseId: itemData.verseId as string,
            verseNumber: itemData.verseNumber as string,
            bookName: itemData.bookName as string,
            bookSlug: itemData.bookSlug as string | undefined,
            cantoNumber: itemData.cantoNumber as string | undefined,
            chapterNumber: itemData.chapterNumber as string | undefined,
            sanskritText: itemData.sanskritText as string,
            transliteration: itemData.transliteration as string | undefined,
            translation: itemData.translation as string,
            commentary: itemData.commentary as string | undefined,
            audioUrl: itemData.audioUrl as string | undefined,
            audioSanskrit: itemData.audioSanskrit as string | undefined,
            audioTranslation: itemData.audioTranslation as string | undefined,
            addedAt: itemData.addedAt as number | undefined,
            srs: {
              easeFactor: cv.srs_ease_factor ?? 2.5,
              interval: cv.srs_interval ?? 0,
              repetitions: cv.srs_repetitions ?? 0,
              lastReviewed: cv.srs_last_reviewed ? new Date(cv.srs_last_reviewed).getTime() : undefined,
              nextReview: cv.srs_next_review ? new Date(cv.srs_next_review).getTime() : undefined,
            },
          });
        }
      }

      const cloudVerseIds = new Set(mergedVerses.map(v => v.verseId));
      for (const lv of localVerses) {
        if (!cloudVerseIds.has(lv.verseId)) {
          mergedVerses.push(lv);
        }
      }

      // Merge progress (cloud priority for numeric values, merge achievements)
      const localProgress = getLearningProgress();
      let mergedProgress: LearningProgress = localProgress;

      if (cloudProgress) {
        const cloudAchievements = (cloudProgress.achievements as unknown[]) || [];
        const localAchievementIds = new Set(localProgress.achievements.map(a => a.id));
        const mergedAchievements = [
          ...localProgress.achievements,
          ...(cloudAchievements.filter((a: unknown) => {
            const achievement = a as { id: string };
            return !localAchievementIds.has(achievement.id);
          }) as typeof localProgress.achievements),
        ];

        mergedProgress = {
          currentStreak: Math.max(cloudProgress.current_streak ?? 0, localProgress.currentStreak),
          longestStreak: Math.max(cloudProgress.longest_streak ?? 0, localProgress.longestStreak),
          lastLoginDate: cloudProgress.last_login_date ?? localProgress.lastLoginDate,
          totalReviews: Math.max(cloudProgress.total_reviews ?? 0, localProgress.totalReviews),
          totalCorrect: Math.max(cloudProgress.total_correct ?? 0, localProgress.totalCorrect),
          achievements: mergedAchievements,
          dailyGoals: localProgress.dailyGoals,
        };
      }

      // Save merged data to local state and localStorage
      setWordsLocal(mergedWords);
      setVersesLocal(mergedVerses);
      setProgressLocal(mergedProgress);

      saveLearningWords(mergedWords);
      saveLearningVerses(mergedVerses);
      saveLearningProgress(mergedProgress);

      // Sync back any local-only items to cloud
      const localOnlyWords = mergedWords.filter(w => !cloudWordIds.has(w.iast) || !cloudWords?.length);
      const localOnlyVerses = mergedVerses.filter(v => !cloudVerseIds.has(v.verseId) || !cloudVerses?.length);

      if (localOnlyWords.length > 0 || localOnlyVerses.length > 0 || !cloudProgress) {
        await Promise.all([
          localOnlyWords.length > 0 ? syncWordsToCloud(localOnlyWords) : Promise.resolve(),
          localOnlyVerses.length > 0 ? syncVersesToCloud(localOnlyVerses) : Promise.resolve(),
          !cloudProgress ? syncProgressToCloud(mergedProgress) : Promise.resolve(),
        ]);
      }

      setLastSyncedAt(new Date());

      // Show sync success if there were changes
      const totalCloudItems = (cloudWords?.length ?? 0) + (cloudVerses?.length ?? 0);
      if (totalCloudItems > 0) {
        toast.success(`Синхронізовано: ${cloudWords?.length ?? 0} слів, ${cloudVerses?.length ?? 0} віршів`);
      }
    } catch (error) {
      console.error('Error syncing from cloud:', error);
      toast.error('Помилка синхронізації з хмарою');
    } finally {
      setIsSyncing(false);
    }
  }, [user, isOnline]);

  // Store syncToCloud in a ref for stable access in debouncedSyncToCloud
  const syncToCloudRef = useRef(syncToCloud);
  useEffect(() => { syncToCloudRef.current = syncToCloud; }, [syncToCloud]);

  // Sync to cloud (debounced) - uses ref for stable function reference
  const debouncedSyncToCloud = useCallback(() => {
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }

    syncTimerRef.current = setTimeout(() => {
      if (user && isOnline) {
        syncToCloudRef.current();
      }
    }, 2000); // 2 second debounce
  }, [user, isOnline]);

  // Store syncFromCloud in a ref for stable access in useEffect
  const syncFromCloudRef = useRef(syncFromCloud);
  useEffect(() => { syncFromCloudRef.current = syncFromCloud; }, [syncFromCloud]);

  // Store debouncedSyncToCloud in a ref for stable access in setters
  const debouncedSyncToCloudRef = useRef(debouncedSyncToCloud);
  useEffect(() => { debouncedSyncToCloudRef.current = debouncedSyncToCloud; }, [debouncedSyncToCloud]);

  // Reset hasSyncedOnMount when user logs out
  useEffect(() => {
    if (!user) {
      hasSyncedOnMount.current = false;
    }
  }, [user]);

  // Sync from cloud when user logs in - only triggers once per user session
  useEffect(() => {
    if (!user || !isOnline) return;

    // Prevent multiple syncs during the same session
    if (hasSyncedOnMount.current) return;
    hasSyncedOnMount.current = true;

    let isCancelled = false;

    const doSync = async () => {
      try {
        // Check if cancelled before starting
        if (isCancelled) return;
        await syncFromCloudRef.current();
      } catch (error) {
        // Ignore errors if the effect was cancelled
        if (!isCancelled) {
          console.error('Error during initial sync:', error);
        }
      }
    };

    doSync();

    return () => {
      isCancelled = true;
    };
  }, [user?.id, isOnline]);

  // Record learning activity
  const recordActivity = useCallback(async (data: Partial<LearningActivity>) => {
    if (!user || !isOnline) return;

    try {
      await supabase.rpc('upsert_learning_activity', {
        p_user_id: user.id,
        p_reviews: data.reviews_count ?? 0,
        p_correct: data.correct_count ?? 0,
        p_words: data.words_added ?? 0,
        p_verses: data.verses_added ?? 0,
        p_time: data.time_spent_seconds ?? 0,
      });
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  }, [user, isOnline]);

  // Get activity history for graphs
  const getActivityHistory = useCallback(async (days: number = 30): Promise<LearningActivity[]> => {
    if (!user || !isOnline) return [];

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('user_learning_activity')
        .select('*')
        .eq('user_id', user.id)
        .gte('activity_date', startDate.toISOString().split('T')[0])
        .order('activity_date', { ascending: true });

      if (error) throw error;

      return (data || []).map(d => ({
        activity_date: d.activity_date,
        reviews_count: d.reviews_count ?? 0,
        correct_count: d.correct_count ?? 0,
        words_added: d.words_added ?? 0,
        verses_added: d.verses_added ?? 0,
        time_spent_seconds: d.time_spent_seconds ?? 0,
      }));
    } catch (error) {
      console.error('Error fetching activity history:', error);
      return [];
    }
  }, [user, isOnline]);

  // Setters that sync to cloud - use refs for stable function references
  const setWords = useCallback((newWords: LearningWord[]) => {
    setWordsLocal(newWords);
    saveLearningWords(newWords);
    debouncedSyncToCloudRef.current();
  }, []);

  const setVerses = useCallback((newVerses: LearningVerse[]) => {
    setVersesLocal(newVerses);
    saveLearningVerses(newVerses);
    debouncedSyncToCloudRef.current();
  }, []);

  const setProgress = useCallback((newProgress: LearningProgress) => {
    setProgressLocal(newProgress);
    saveLearningProgress(newProgress);
    debouncedSyncToCloudRef.current();
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, []);

  return {
    isSyncing,
    lastSyncedAt,
    isOnline,
    syncToCloud,
    syncFromCloud,
    recordActivity,
    getActivityHistory,
    words,
    verses,
    progress,
    setWords,
    setVerses,
    setProgress,
  };
}
