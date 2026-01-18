/**
 * useRoutines - Hook for managing daily routines and tasks
 *
 * MVP: Uses localStorage for storage
 * Future: Can be upgraded to Supabase
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import type {
  RoutineItem,
  RoutineCompletion,
  DailyTask,
  DailyNote,
  DailyData,
} from '@/types/routines';
import { DEFAULT_ROUTINE_ITEMS } from '@/types/routines';

const STORAGE_KEYS = {
  ROUTINES: 'veda_routines',
  COMPLETIONS: 'veda_routine_completions',
  TASKS: 'veda_daily_tasks',
  NOTES: 'veda_daily_notes',
};

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function useRoutines(selectedDate?: Date) {
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);
  const [completions, setCompletions] = useState<RoutineCompletion[]>([]);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentDate = selectedDate || new Date();
  const dateStr = format(currentDate, 'yyyy-MM-dd');

  // Load data from localStorage
  useEffect(() => {
    setIsLoading(true);
    try {
      // Load routine items
      const savedRoutines = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      if (savedRoutines) {
        setRoutineItems(JSON.parse(savedRoutines));
      } else {
        // Initialize with default routines
        const defaultItems: RoutineItem[] = DEFAULT_ROUTINE_ITEMS.map((item, index) => ({
          ...item,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }));
        setRoutineItems(defaultItems);
        localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(defaultItems));
      }

      // Load completions
      const savedCompletions = localStorage.getItem(STORAGE_KEYS.COMPLETIONS);
      if (savedCompletions) {
        setCompletions(JSON.parse(savedCompletions));
      }

      // Load tasks
      const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }

      // Load notes
      const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Failed to load routines data:', error);
    }
    setIsLoading(false);
  }, []);

  // Save routines to localStorage
  const saveRoutines = useCallback((items: RoutineItem[]) => {
    setRoutineItems(items);
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(items));
  }, []);

  // Save completions to localStorage
  const saveCompletions = useCallback((items: RoutineCompletion[]) => {
    setCompletions(items);
    localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(items));
  }, []);

  // Save tasks to localStorage
  const saveTasks = useCallback((items: DailyTask[]) => {
    setTasks(items);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(items));
  }, []);

  // Save notes to localStorage
  const saveNotes = useCallback((items: DailyNote[]) => {
    setNotes(items);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(items));
  }, []);

  // Get active routines for today
  const todayRoutines = useMemo(() => {
    const dayOfWeek = currentDate.getDay();
    return routineItems
      .filter(item => {
        if (!item.isActive) return false;
        if (item.recurrence === 'daily') return true;
        if (item.recurrence === 'specific_days' && item.daysOfWeek) {
          return item.daysOfWeek.includes(dayOfWeek);
        }
        return true;
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [routineItems, currentDate]);

  // Get completions for today
  const todayCompletions = useMemo(() => {
    return completions.filter(c => c.date === dateStr);
  }, [completions, dateStr]);

  // Get tasks for today
  const todayTasks = useMemo(() => {
    return tasks
      .filter(t => {
        if (t.date === dateStr) return true;
        if (t.isRecurring) {
          const dayOfWeek = currentDate.getDay();
          if (t.recurrence === 'daily') return true;
          if (t.recurrence === 'weekly' && t.daysOfWeek?.includes(dayOfWeek)) return true;
        }
        return false;
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [tasks, dateStr, currentDate]);

  // Get note for today
  const todayNote = useMemo(() => {
    return notes.find(n => n.date === dateStr);
  }, [notes, dateStr]);

  // Toggle routine completion
  const toggleRoutineCompletion = useCallback((routineItemId: string, value?: number) => {
    const existingIndex = completions.findIndex(
      c => c.routineItemId === routineItemId && c.date === dateStr
    );

    let newCompletions: RoutineCompletion[];

    if (existingIndex >= 0) {
      // Toggle off - remove completion
      newCompletions = completions.filter((_, i) => i !== existingIndex);
    } else {
      // Toggle on - add completion
      const newCompletion: RoutineCompletion = {
        id: generateId(),
        routineItemId,
        date: dateStr,
        completed: true,
        completedAt: new Date().toISOString(),
        value,
      };
      newCompletions = [...completions, newCompletion];
    }

    saveCompletions(newCompletions);
  }, [completions, dateStr, saveCompletions]);

  // Update routine value (e.g., japa rounds)
  const updateRoutineValue = useCallback((routineItemId: string, value: number) => {
    const existingIndex = completions.findIndex(
      c => c.routineItemId === routineItemId && c.date === dateStr
    );

    let newCompletions: RoutineCompletion[];

    if (existingIndex >= 0) {
      // Update existing
      newCompletions = completions.map((c, i) =>
        i === existingIndex ? { ...c, value, completed: value > 0 } : c
      );
    } else {
      // Create new
      const newCompletion: RoutineCompletion = {
        id: generateId(),
        routineItemId,
        date: dateStr,
        completed: value > 0,
        completedAt: new Date().toISOString(),
        value,
      };
      newCompletions = [...completions, newCompletion];
    }

    saveCompletions(newCompletions);
  }, [completions, dateStr, saveCompletions]);

  // Add new task
  const addTask = useCallback((task: Omit<DailyTask, 'id' | 'createdAt' | 'sortOrder'>) => {
    const newTask: DailyTask = {
      ...task,
      id: generateId(),
      sortOrder: tasks.length,
      createdAt: new Date().toISOString(),
    };
    saveTasks([...tasks, newTask]);
    return newTask;
  }, [tasks, saveTasks]);

  // Toggle task completion
  const toggleTaskCompletion = useCallback((taskId: string) => {
    const newTasks = tasks.map(t =>
      t.id === taskId
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
        : t
    );
    saveTasks(newTasks);
  }, [tasks, saveTasks]);

  // Delete task
  const deleteTask = useCallback((taskId: string) => {
    saveTasks(tasks.filter(t => t.id !== taskId));
  }, [tasks, saveTasks]);

  // Update daily note
  const updateNote = useCallback((content: string, metadata?: Partial<DailyNote>) => {
    const existingIndex = notes.findIndex(n => n.date === dateStr);

    let newNotes: DailyNote[];

    if (existingIndex >= 0) {
      // Update existing
      newNotes = notes.map((n, i) =>
        i === existingIndex
          ? { ...n, ...metadata, content, updatedAt: new Date().toISOString() }
          : n
      );
    } else {
      // Create new
      const newNote: DailyNote = {
        id: generateId(),
        date: dateStr,
        content,
        ...metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      newNotes = [...notes, newNote];
    }

    saveNotes(newNotes);
  }, [notes, dateStr, saveNotes]);

  // Add routine item
  const addRoutineItem = useCallback((item: Omit<RoutineItem, 'id' | 'createdAt' | 'sortOrder'>) => {
    const newItem: RoutineItem = {
      ...item,
      id: generateId(),
      sortOrder: routineItems.length,
      createdAt: new Date().toISOString(),
    };
    saveRoutines([...routineItems, newItem]);
    return newItem;
  }, [routineItems, saveRoutines]);

  // Update routine item
  const updateRoutineItem = useCallback((id: string, updates: Partial<RoutineItem>) => {
    const newItems = routineItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    saveRoutines(newItems);
  }, [routineItems, saveRoutines]);

  // Delete routine item
  const deleteRoutineItem = useCallback((id: string) => {
    saveRoutines(routineItems.filter(item => item.id !== id));
    // Also delete related completions
    saveCompletions(completions.filter(c => c.routineItemId !== id));
  }, [routineItems, completions, saveRoutines, saveCompletions]);

  // Get daily data summary
  const dailyData: DailyData = useMemo(() => {
    const completedCount = todayCompletions.filter(c => c.completed).length;
    const totalCount = todayRoutines.length;

    return {
      date: dateStr,
      routineCompletions: todayCompletions,
      tasks: todayTasks,
      note: todayNote,
      completedRoutines: completedCount,
      totalRoutines: totalCount,
      completionPercent: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    };
  }, [dateStr, todayCompletions, todayRoutines, todayTasks, todayNote]);

  // Get completion status for a routine
  const getRoutineCompletion = useCallback((routineItemId: string) => {
    return todayCompletions.find(c => c.routineItemId === routineItemId);
  }, [todayCompletions]);

  return {
    // Data
    routineItems,
    todayRoutines,
    todayCompletions,
    todayTasks,
    todayNote,
    dailyData,
    isLoading,

    // Routine actions
    addRoutineItem,
    updateRoutineItem,
    deleteRoutineItem,
    toggleRoutineCompletion,
    updateRoutineValue,
    getRoutineCompletion,

    // Task actions
    addTask,
    toggleTaskCompletion,
    deleteTask,

    // Note actions
    updateNote,
  };
}
