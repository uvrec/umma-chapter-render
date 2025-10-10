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

/** — нижче все без змін — */
function saveToLocalStorage(/* ... */) {
  /* як у тебе */
}
export function getLastProgress(/* ... */) {
  /* як у тебе */
}
export function getLastAudioMetadata(/* ... */) {
  /* як у тебе */
}
export function clearTrackProgress(/* ... */) {
  /* як у тебе */
}
export function clearAllAudioData(/* ... */) {
  /* як у тебе */
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
