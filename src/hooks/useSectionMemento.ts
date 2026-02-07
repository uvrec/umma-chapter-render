/**
 * useSectionMemento - Telegram-style section state preservation
 *
 * Saves and restores scroll position + UI state when navigating between sections.
 * Uses sessionStorage so state persists during the session but not across tabs.
 */
import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface SectionState {
  scrollY: number;
  timestamp: number;
}

const STORAGE_KEY = 'vv_section_memento';
const MAX_ENTRIES = 50;
const MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

function getStore(): Record<string, SectionState> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStore(store: Record<string, SectionState>) {
  try {
    // Prune old entries
    const now = Date.now();
    const entries = Object.entries(store)
      .filter(([, v]) => now - v.timestamp < MAX_AGE_MS)
      .sort(([, a], [, b]) => b.timestamp - a.timestamp)
      .slice(0, MAX_ENTRIES);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    // sessionStorage not available (private mode, etc.)
  }
}

/**
 * Hook to preserve and restore scroll position for the current route.
 *
 * Usage:
 *   useSectionMemento(); // in any page component
 *
 * Automatically saves scroll position when navigating away,
 * and restores it when returning to the same route.
 */
export function useSectionMemento() {
  const location = useLocation();
  const pathKey = location.pathname;
  const hasRestored = useRef(false);
  const prevPath = useRef(pathKey);

  // Save scroll position for current path before navigating away
  const saveCurrentPosition = useCallback(() => {
    const store = getStore();
    store[prevPath.current] = {
      scrollY: window.scrollY,
      timestamp: Date.now(),
    };
    setStore(store);
  }, []);

  // Save on path change
  useEffect(() => {
    if (prevPath.current !== pathKey) {
      saveCurrentPosition();
      prevPath.current = pathKey;
      hasRestored.current = false;
    }
  }, [pathKey, saveCurrentPosition]);

  // Save before unload (tab close, refresh)
  useEffect(() => {
    const handleBeforeUnload = () => saveCurrentPosition();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Save when component unmounts (navigation)
      saveCurrentPosition();
    };
  }, [saveCurrentPosition]);

  // Restore scroll position on mount for this route
  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    const store = getStore();
    const saved = store[pathKey];
    if (!saved) return;

    // Check if data is not stale
    if (Date.now() - saved.timestamp > MAX_AGE_MS) return;

    // Restore after a small delay to allow content to render
    const timer = requestAnimationFrame(() => {
      // Use another rAF to ensure the DOM has painted
      requestAnimationFrame(() => {
        window.scrollTo({ top: saved.scrollY, behavior: 'instant' as ScrollBehavior });
      });
    });

    return () => cancelAnimationFrame(timer);
  }, [pathKey]);
}

/**
 * Hook to save/restore arbitrary UI state for a section.
 *
 * Usage:
 *   const { save, restore } = useSectionState<MyState>('verse-reader');
 *
 *   // On mount: const savedState = restore();
 *   // Before unmount: save({ expandedSections: [...], activeTab: 'uk' });
 */
export function useSectionState<T>(key: string) {
  const storageKey = `vv_section_state_${key}`;

  const save = useCallback((state: T) => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({
        data: state,
        timestamp: Date.now(),
      }));
    } catch {
      // Ignore
    }
  }, [storageKey]);

  const restore = useCallback((): T | null => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp > MAX_AGE_MS) return null;
      return parsed.data as T;
    } catch {
      return null;
    }
  }, [storageKey]);

  return { save, restore };
}
