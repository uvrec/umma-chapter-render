// src/lib/audioTracking.ts
import { supabase } from "@/integrations/supabase/client";

export type AudioEventType = "play" | "pause" | "complete" | "skip";

interface TrackEventParams {
  trackId: string;
  eventType: AudioEventType;
  positionMs: number;
  durationMs: number;
}

/** Запис події прослуховування (анонімно: user_id = null) */
export async function trackAudioEvent({ trackId, eventType, positionMs, durationMs }: TrackEventParams): Promise<void> {
  try {
    // одразу пробуємо записати (user_id = null)
    const { error } = await supabase.from("audio_events").insert({
      user_id: null,
      track_id: trackId,
      event_type: eventType,
      position_ms: Math.round(positionMs),
      duration_ms: Math.round(durationMs),
    });

    if (error) {
      console.error("Failed to track audio event:", error);
      saveToLocalStorage(trackId, positionMs, durationMs, eventType);
    } else {
      // дублюємо у localStorage для UX/відновлення
      saveToLocalStorage(trackId, positionMs, durationMs, eventType);
    }
  } catch (e) {
    console.error("Error tracking audio event:", e);
    saveToLocalStorage(trackId, positionMs, durationMs, eventType);
  }
}

/** Зберігаємо прогрес у localStorage для відновлення */
function saveToLocalStorage(trackId: string, positionMs: number, durationMs: number, eventType: AudioEventType) {
  try {
    const key = `audio_progress_${trackId}`;
    localStorage.setItem(
      key,
      JSON.stringify({
        trackId,
        positionMs,
        durationMs,
        eventType,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

export function getLastProgress(trackId: string): { positionMs: number; durationMs: number } | null {
  try {
    const key = `audio_progress_${trackId}`;
    const data = localStorage.getItem(key);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return { positionMs: parsed.positionMs || 0, durationMs: parsed.durationMs || 0 };
  } catch {
    return null;
  }
}

export function getLastAudioMetadata(): { trackId: string; positionMs: number } | null {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("audio_progress_"));
    if (keys.length === 0) return null;
    
    // Знаходимо останній за timestamp
    let latest = null;
    let latestTime = 0;
    
    for (const key of keys) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        if (data.timestamp && data.timestamp > latestTime) {
          latestTime = data.timestamp;
          latest = { trackId: data.trackId, positionMs: data.positionMs || 0 };
        }
      } catch {}
    }
    
    return latest;
  } catch {
    return null;
  }
}

export function clearTrackProgress(trackId: string) {
  try {
    const key = `audio_progress_${trackId}`;
    localStorage.removeItem(key);
  } catch (e) {
    console.error("Failed to clear track progress:", e);
  }
}

export function clearAllAudioData() {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("audio_progress_"));
    keys.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.error("Failed to clear all audio data:", e);
  }
}

export function createAudioTracker(audioElement: HTMLAudioElement, trackId: string, durationMs: number) {
  let lastSavedPosition = 0;
  const SAVE_INTERVAL = 5000;

  const handlePlay = () =>
    trackAudioEvent({ trackId, eventType: "play", positionMs: audioElement.currentTime * 1000, durationMs });

  const handlePause = () =>
    trackAudioEvent({ trackId, eventType: "pause", positionMs: audioElement.currentTime * 1000, durationMs });

  const handleEnded = () => {
    trackAudioEvent({ trackId, eventType: "complete", positionMs: durationMs, durationMs });
    clearTrackProgress(trackId);
  };

  const handleTimeUpdate = () => {
    const currentPositionMs = audioElement.currentTime * 1000;
    if (currentPositionMs - lastSavedPosition > SAVE_INTERVAL) {
      trackAudioEvent({ trackId, eventType: "pause", positionMs: currentPositionMs, durationMs });
      lastSavedPosition = currentPositionMs;
    }
  };

  audioElement.addEventListener("play", handlePlay);
  audioElement.addEventListener("pause", handlePause);
  audioElement.addEventListener("ended", handleEnded);
  audioElement.addEventListener("timeupdate", handleTimeUpdate);

  return () => {
    audioElement.removeEventListener("play", handlePlay);
    audioElement.removeEventListener("pause", handlePause);
    audioElement.removeEventListener("ended", handleEnded);
    audioElement.removeEventListener("timeupdate", handleTimeUpdate);
  };
}
