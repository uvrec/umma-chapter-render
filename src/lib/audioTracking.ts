// src/lib/audioTracking.ts
// Утиліта для трекінгу прослуховування аудіо та запису подій у Supabase

import { supabase } from "@/integrations/supabase/client";

export type AudioEventType = "play" | "pause" | "complete" | "skip";

interface TrackEventParams {
  trackId: string;
  eventType: AudioEventType;
  positionMs: number;
  durationMs: number;
  userId?: string;
}

/**
 * Записує подію прослуховування в базу даних
 */
export async function trackAudioEvent({
  trackId,
  eventType,
  positionMs,
  durationMs,
  userId,
}: TrackEventParams): Promise<void> {
  try {
    // Якщо немає userId, намагаємося отримати поточного користувача
    let currentUserId = userId;

    if (!currentUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      currentUserId = user?.id;
    }

    // Якщо користувач не авторизований, зберігаємо тільки в localStorage
    if (!currentUserId) {
      saveToLocalStorage(trackId, positionMs, durationMs, eventType);
      return;
    }

    // Записуємо подію в базу даних
    const { error } = await supabase.from("audio_events").insert({
      user_id: currentUserId,
      track_id: trackId,
      event_type: eventType,
      position_ms: Math.round(positionMs),
      duration_ms: Math.round(durationMs),
    });

    if (error) {
      console.error("Failed to track audio event:", error);
      // Fallback до localStorage при помилці
      saveToLocalStorage(trackId, positionMs, durationMs, eventType);
    } else {
      // Додатково зберігаємо в localStorage
      saveToLocalStorage(trackId, positionMs, durationMs, eventType);
    }
  } catch (error) {
    console.error("Error tracking audio event:", error);
    saveToLocalStorage(trackId, positionMs, durationMs, eventType);
  }
}

/**
 * Зберігає інформацію про прогрес у localStorage
 */
function saveToLocalStorage(trackId: string, positionMs: number, durationMs: number, eventType: AudioEventType): void {
  try {
    // Зберігаємо позицію
    const positionSeconds = positionMs / 1000;
    localStorage.setItem(`vv_progress_${trackId}`, positionSeconds.toString());

    // Зберігаємо останній трек
    localStorage.setItem("vv_last_track_id", trackId);

    // Зберігаємо метадані
    const metadata = {
      trackId,
      positionMs,
      durationMs,
      eventType,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("vv_last_audio_metadata", JSON.stringify(metadata));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

/**
 * Отримує останній прогрес з localStorage
 */
export function getLastProgress(trackId: string): number {
  try {
    const saved = localStorage.getItem(`vv_progress_${trackId}`);
    if (saved) {
      const seconds = parseFloat(saved);
      return !isNaN(seconds) ? seconds : 0;
    }
  } catch (error) {
    console.error("Failed to get progress from localStorage:", error);
  }
  return 0;
}

/**
 * Отримує метадані останнього прослуханого треку
 */
export function getLastAudioMetadata(): {
  trackId: string;
  positionMs: number;
  durationMs: number;
  eventType: AudioEventType;
  timestamp: string;
} | null {
  try {
    const saved = localStorage.getItem("vv_last_audio_metadata");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to get metadata from localStorage:", error);
  }
  return null;
}

/**
 * Очищає дані прогресу для конкретного треку
 */
export function clearTrackProgress(trackId: string): void {
  try {
    localStorage.removeItem(`vv_progress_${trackId}`);
  } catch (error) {
    console.error("Failed to clear track progress:", error);
  }
}

/**
 * Очищає всі дані прослуховування
 */
export function clearAllAudioData(): void {
  try {
    const keysToRemove: string[] = [];

    // Знайти всі ключі, що починаються з vv_progress_
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("vv_progress_") || key?.startsWith("vv_last_")) {
        keysToRemove.push(key);
      }
    }

    // Видалити знайдені ключі
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Failed to clear audio data:", error);
  }
}

/**
 * Хук для автоматичного трекінгу аудіо плеєра
 * Використовуйте в компоненті плеєра
 */
export function createAudioTracker(audioElement: HTMLAudioElement, trackId: string, durationMs: number) {
  let lastSavedPosition = 0;
  const SAVE_INTERVAL = 5000; // Зберігати кожні 5 секунд

  const handlePlay = () => {
    trackAudioEvent({
      trackId,
      eventType: "play",
      positionMs: audioElement.currentTime * 1000,
      durationMs,
    });
  };

  const handlePause = () => {
    trackAudioEvent({
      trackId,
      eventType: "pause",
      positionMs: audioElement.currentTime * 1000,
      durationMs,
    });
  };

  const handleEnded = () => {
    trackAudioEvent({
      trackId,
      eventType: "complete",
      positionMs: durationMs,
      durationMs,
    });
    clearTrackProgress(trackId);
  };

  const handleTimeUpdate = () => {
    const currentPositionMs = audioElement.currentTime * 1000;

    // Зберігати прогрес кожні 5 секунд
    if (currentPositionMs - lastSavedPosition > SAVE_INTERVAL) {
      trackAudioEvent({
        trackId,
        eventType: "pause", // використовуємо pause для періодичного збереження
        positionMs: currentPositionMs,
        durationMs,
      });
      lastSavedPosition = currentPositionMs;
    }
  };

  // Додати слухачі подій
  audioElement.addEventListener("play", handlePlay);
  audioElement.addEventListener("pause", handlePause);
  audioElement.addEventListener("ended", handleEnded);
  audioElement.addEventListener("timeupdate", handleTimeUpdate);

  // Функція для видалення слухачів
  return () => {
    audioElement.removeEventListener("play", handlePlay);
    audioElement.removeEventListener("pause", handlePause);
    audioElement.removeEventListener("ended", handleEnded);
    audioElement.removeEventListener("timeupdate", handleTimeUpdate);
  };
}

/**
 * Отримує статистику прослуховування користувача
 */
export async function getUserListeningStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from("audio_events")
      .select("event_type, created_at, duration_ms, track_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Підрахувати статистику
    const totalListeningTimeMs =
      data?.reduce((acc, event) => {
        if (event.event_type === "complete") {
          return acc + (event.duration_ms || 0);
        }
        return acc;
      }, 0) || 0;

    const totalTracks = new Set(data?.filter((e) => e.event_type === "complete").map((e) => e.track_id)).size;

    return {
      totalListeningTimeMs,
      totalListeningHours: Math.round(totalListeningTimeMs / 3600000),
      totalTracksCompleted: totalTracks,
      recentActivity: data?.slice(0, 10) || [],
    };
  } catch (error) {
    console.error("Failed to get listening stats:", error);
    return null;
  }
}
