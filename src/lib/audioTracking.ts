import { supabase } from "@/integrations/supabase/client";

export interface AudioProgress {
  trackId: string;
  playlistId: string;
  position: number;
  duration: number;
  timestamp: number;
  completed: boolean;
}

const PROGRESS_KEY = "audio_progress";
const LISTEN_THRESHOLD = 0.6; // 60% прослуховування

// Локальне сховище прогресу
export function saveProgress(progress: AudioProgress): void {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    const progressMap: Record<string, AudioProgress> = stored ? JSON.parse(stored) : {};
    progressMap[progress.trackId] = progress;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressMap));
  } catch (error) {
    console.error("Failed to save audio progress:", error);
  }
}

export function getProgress(trackId: string): AudioProgress | null {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (!stored) return null;
    const progressMap: Record<string, AudioProgress> = JSON.parse(stored);
    return progressMap[trackId] || null;
  } catch (error) {
    console.error("Failed to get audio progress:", error);
    return null;
  }
}

export function getAllProgress(): AudioProgress[] {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (!stored) return [];
    const progressMap: Record<string, AudioProgress> = JSON.parse(stored);
    return Object.values(progressMap).sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Failed to get all progress:", error);
    return [];
  }
}

export function clearProgress(trackId: string): void {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (!stored) return;
    const progressMap: Record<string, AudioProgress> = JSON.parse(stored);
    delete progressMap[trackId];
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressMap));
  } catch (error) {
    console.error("Failed to clear progress:", error);
  }
}

// Відстеження подій для авторизованих користувачів
export async function trackAudioEvent(
  trackId: string,
  eventType: "play" | "pause" | "complete" | "skip",
  position: number,
  duration: number
): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("audio_events").insert({
      user_id: user.id,
      track_id: trackId,
      event_type: eventType,
      position_ms: Math.floor(position * 1000),
      duration_ms: Math.floor(duration * 1000),
    });

    if (error) {
      console.error("Failed to track audio event:", error);
    }
  } catch (error) {
    console.error("Error tracking audio event:", error);
  }
}

// Перевірка чи трек прослуханий на 60%+
export function isListened(position: number, duration: number): boolean {
  if (!duration || duration === 0) return false;
  return position / duration >= LISTEN_THRESHOLD;
}

// Отримати останні прослухані треки
export function getRecentListens(limit: number = 10): AudioProgress[] {
  const allProgress = getAllProgress();
  return allProgress
    .filter((p) => p.completed || isListened(p.position, p.duration))
    .slice(0, limit);
}

// Отримати треки в процесі прослуховування
export function getInProgress(limit: number = 10): AudioProgress[] {
  const allProgress = getAllProgress();
  return allProgress
    .filter((p) => !p.completed && p.position > 0 && !isListened(p.position, p.duration))
    .slice(0, limit);
}
