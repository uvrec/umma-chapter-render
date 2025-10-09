import { useState, useCallback, useEffect } from "react";
import { saveProgress, trackAudioEvent, AudioProgress } from "@/lib/audioTracking";

export interface QueueTrack {
  id: string;
  title: string;
  src: string;
  playlistId: string;
  playlistTitle?: string;
  duration?: number;
}

export function useAudioQueue(initialTracks: QueueTrack[] = []) {
  const [queue, setQueue] = useState<QueueTrack[]>(initialTracks);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = queue[currentIndex];

  // Зберегти прогрес
  const saveCurrentProgress = useCallback(() => {
    if (!currentTrack) return;

    const progress: AudioProgress = {
      trackId: currentTrack.id,
      playlistId: currentTrack.playlistId,
      position: currentTime,
      duration: duration,
      timestamp: Date.now(),
      completed: false,
    };

    saveProgress(progress);
  }, [currentTrack, currentTime, duration]);

  // Автозбереження прогресу кожні 5 секунд
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      saveCurrentProgress();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, saveCurrentProgress]);

  // Зберегти прогрес при паузі
  useEffect(() => {
    if (!isPlaying && currentTime > 0) {
      saveCurrentProgress();
    }
  }, [isPlaying, saveCurrentProgress, currentTime]);

  const play = useCallback(() => {
    setIsPlaying(true);
    if (currentTrack) {
      trackAudioEvent(currentTrack.id, "play", currentTime, duration);
    }
  }, [currentTrack, currentTime, duration]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (currentTrack) {
      trackAudioEvent(currentTrack.id, "pause", currentTime, duration);
      saveCurrentProgress();
    }
  }, [currentTrack, currentTime, duration, saveCurrentProgress]);

  const next = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      if (currentTrack) {
        trackAudioEvent(currentTrack.id, "skip", currentTime, duration);
      }
      setCurrentIndex((prev) => prev + 1);
      setCurrentTime(0);
    }
  }, [currentIndex, queue.length, currentTrack, currentTime, duration]);

  const previous = useCallback(() => {
    if (currentIndex > 0) {
      if (currentTrack) {
        trackAudioEvent(currentTrack.id, "skip", currentTime, duration);
      }
      setCurrentIndex((prev) => prev - 1);
      setCurrentTime(0);
    }
  }, [currentIndex, currentTrack, currentTime, duration]);

  const seek = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const addToQueue = useCallback((tracks: QueueTrack | QueueTrack[]) => {
    const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
    setQueue((prev) => [...prev, ...tracksArray]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => {
      const newQueue = [...prev];
      newQueue.splice(index, 1);
      if (index < currentIndex) {
        setCurrentIndex((i) => i - 1);
      } else if (index === currentIndex) {
        setCurrentTime(0);
      }
      return newQueue;
    });
  }, [currentIndex]);

  const playTrack = useCallback((index: number) => {
    setCurrentIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  const replaceQueue = useCallback((newQueue: QueueTrack[], startIndex: number = 0) => {
    setQueue(newQueue);
    setCurrentIndex(startIndex);
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  const onEnded = useCallback(() => {
    if (currentTrack) {
      trackAudioEvent(currentTrack.id, "complete", currentTime, duration);
      saveProgress({
        trackId: currentTrack.id,
        playlistId: currentTrack.playlistId,
        position: duration,
        duration: duration,
        timestamp: Date.now(),
        completed: true,
      });
    }

    // Автоматично перейти до наступного треку
    if (currentIndex < queue.length - 1) {
      next();
    } else {
      setIsPlaying(false);
    }
  }, [currentTrack, currentTime, duration, currentIndex, queue.length, next]);

  return {
    queue,
    currentTrack,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    next,
    previous,
    seek,
    addToQueue,
    removeFromQueue,
    playTrack,
    replaceQueue,
    setCurrentTime,
    setDuration,
    onEnded,
  };
}
