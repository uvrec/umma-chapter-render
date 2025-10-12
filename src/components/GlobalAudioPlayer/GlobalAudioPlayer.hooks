// GlobalAudioPlayer.hooks.ts - Кастомні React хуки для роботи з плеєром

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudio } from './GlobalAudioPlayer';
import type { Track, RepeatMode } from './GlobalAudioPlayer.types';
import { formatTime, getProgressPercentage } from './GlobalAudioPlayer.utils';

/**
 * Хук для роботи з прогресом відтворення
 */
export const usePlaybackProgress = () => {
  const { currentTime, duration, seek } = useAudio();
  const [isDragging, setIsDragging] = useState(false);
  const [tempTime, setTempTime] = useState(0);

  const handleSeekStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleSeekChange = useCallback((time: number) => {
    setTempTime(time);
  }, []);

  const handleSeekEnd = useCallback((time: number) => {
    seek(time);
    setIsDragging(false);
  }, [seek]);

  const displayTime = isDragging ? tempTime : currentTime;
  const progressPercentage = getProgressPercentage(displayTime, duration);

  return {
    currentTime: displayTime,
    duration,
    progressPercentage,
    formattedCurrentTime: formatTime(displayTime),
    formattedDuration: formatTime(duration),
    isDragging,
    handleSeekStart,
    handleSeekChange,
    handleSeekEnd,
  };
};

/**
 * Хук для роботи з гучністю
 */
export const useVolumeControl = () => {
  const { volume, setVolume } = useAudio();
  const [isMuted, setIsMuted] = useState(false);
  const previousVolumeRef = useRef(volume);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(previousVolumeRef.current);
      setIsMuted(false);
    } else {
      previousVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  }, [isMuted, volume, setVolume]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
      previousVolumeRef.current = newVolume;
    }
  }, [setVolume]);

  useEffect(() => {
    if (volume === 0) {
      setIsMuted(true);
    } else if (isMuted && volume > 0) {
      setIsMuted(false);
    }
  }, [volume, isMuted]);

  return {
    volume,
    isMuted,
    toggleMute,
    setVolume: handleVolumeChange,
  };
};

/**
 * Хук для роботи з режимом повтору
 */
export const useRepeatMode = () => {
  const { repeatMode, toggleRepeat } = useAudio();

  const getRepeatLabel = useCallback((mode: RepeatMode): string => {
    switch (mode) {
      case 'off':
        return 'Повтор вимкнено';
      case 'all':
        return 'Повторити все';
      case 'one':
        return 'Повторити один';
      default:
        return '';
    }
  }, []);

  return {
    repeatMode,
    toggleRepeat,
    repeatLabel: getRepeatLabel(repeatMode),
  };
};

/**
 * Хук для роботи з навігацією по плейлисту
 */
export const usePlaylistNavigation = () => {
  const { playlist, currentIndex, prevTrack, nextTrack, playTrack } = useAudio();

  const canGoPrev = currentIndex !== null && currentIndex > 0;
  const canGoNext = currentIndex !== null && currentIndex < playlist.length - 1;
  const hasPlaylist = playlist.length > 0;

  const goToTrack = useCallback((index: number) => {
    if (index >= 0 && index < playlist.length) {
      const track = playlist[index];
      playTrack(track);
    }
  }, [playlist, playTrack]);

  return {
    canGoPrev,
    canGoNext,
    hasPlaylist,
    currentTrackNumber: currentIndex !== null ? currentIndex + 1 : 0,
    totalTracks: playlist.length,
    prevTrack,
    nextTrack,
    goToTrack,
  };
};

/**
 * Хук для автозбереження плейлиста
 */
export const usePlaylistPersistence = (storageKey: string = 'vedavoice_playlist') => {
  const { playlist } = useAudio();

  useEffect(() => {
    try {
      if (playlist.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(playlist));
      }
    } catch (error) {
      console.error('Failed to save playlist:', error);
    }
  }, [playlist, storageKey]);

  const clearSavedPlaylist = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear saved playlist:', error);
    }
  }, [storageKey]);

  return { clearSavedPlaylist };
};

/**
 * Хук для відстеження історії відтворення
 */
export const usePlaybackHistory = (maxHistory: number = 50) => {
  const { currentTrack } = useAudio();
  const [history, setHistory] = useState<Track[]>([]);

  useEffect(() => {
    if (currentTrack) {
      setHistory((prev) => {
        const newHistory = [currentTrack, ...prev.filter((t) => t.id !== currentTrack.id)];
        return newHistory.slice(0, maxHistory);
      });
    }
  }, [currentTrack, maxHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    clearHistory,
    hasHistory: history.length > 0,
  };
};

/**
 * Хук для визначення статусу завантаження
 */
export const useLoadingState = () => {
  const { isPlaying, currentTrack } = useAudio();
  const [isLoading, setIsLoading] = useState(false);
  const previousTrackRef = useRef(currentTrack);

  useEffect(() => {
    if (currentTrack && currentTrack.id !== previousTrackRef.current?.id) {
      setIsLoading(true);
      previousTrackRef.current = currentTrack;
    }
  }, [currentTrack]);

  useEffect(() => {
    if (isPlaying) {
      setIsLoading(false);
    }
  }, [isPlaying]);

  return { isLoading };
};

/**
 * Хук для keyboard shortcuts
 */
export const usePlayerKeyboardShortcuts = (enabled: boolean = true) => {
  const { togglePlay, prevTrack, nextTrack, seek, currentTime, volume, setVolume } = useAudio();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ігноруємо якщо фокус на input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (e.shiftKey) {
            prevTrack();
          } else {
            seek(Math.max(0, currentTime - 5));
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (e.shiftKey) {
            nextTrack();
          } else {
            seek(currentTime + 5);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(100, volume + 5));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 5));
          break;
        case 'm':
          e.preventDefault();
          setVolume(volume === 0 ? 75 : 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, togglePlay, prevTrack, nextTrack, seek, currentTime, volume, setVolume]);
};

/**
 * Хук для роботи з playback rate
 */
export const usePlaybackRate = () => {
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Отримуємо аудіо елемент з DOM
    const audio = document.querySelector('audio');
    if (audio) {
      audioRef.current = audio;
    }
  }, []);

  const changePlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, []);

  const increaseRate = useCallback(() => {
    const newRate = Math.min(2.0, playbackRate + 0.25);
    changePlaybackRate(newRate);
  }, [playbackRate, changePlaybackRate]);

  const decreaseRate = useCallback(() => {
    const newRate = Math.max(0.5, playbackRate - 0.25);
    changePlaybackRate(newRate);
  }, [playbackRate, changePlaybackRate]);

  const resetRate = useCallback(() => {
    changePlaybackRate(1.0);
  }, [changePlaybackRate]);

  return {
    playbackRate,
    setPlaybackRate: changePlaybackRate,
    increaseRate,
    decreaseRate,
    resetRate,
  };
};

/**
 * Хук для shuffle функціоналу
 */
export const useShufflePlaylist = () => {
  const { playlist, currentIndex, playTrack } = useAudio();
  const [isShuffled, setIsShuffled] = useState(false);
  const originalOrderRef = useRef<Track[]>([]);

  const shuffle = useCallback(() => {
    if (playlist.length <= 1) return;

    originalOrderRef.current = [...playlist];
    const currentTrack = currentIndex !== null ? playlist[currentIndex] : null;
    
    const shuffled = [...playlist].sort(() => Math.random() - 0.5);
    
    // Переконуємося що поточний трек залишається на місці
    if (currentTrack) {
      const currentShuffledIndex = shuffled.findIndex(t => t.id === currentTrack.id);
      if (currentShuffledIndex !== -1 && currentIndex !== null) {
        [shuffled[currentIndex], shuffled[currentShuffledIndex]] = 
        [shuffled[currentShuffledIndex], shuffled[currentIndex]];
      }
    }

    // TODO: Тут потрібно оновити playlist через context
    // Це вимагає додаткового методу setPlaylist в AudioContext
    
    setIsShuffled(true);
  }, [playlist, currentIndex]);

  const unshuffle = useCallback(() => {
    // TODO: Відновити оригінальний порядок
    setIsShuffled(false);
  }, []);

  const toggleShuffle = useCallback(() => {
    if (isShuffled) {
      unshuffle();
    } else {
      shuffle();
    }
  }, [isShuffled, shuffle, unshuffle]);

  return {
    isShuffled,
    shuffle,
    unshuffle,
    toggleShuffle,
  };
};

/**
 * Хук для фільтрації та сортування плейлиста
 */
export const usePlaylistFilter = () => {
  const { playlist } = useAudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'duration' | 'dateAdded'>('dateAdded');

  const filteredPlaylist = playlist.filter((track) =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.verseNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPlaylist = [...filteredPlaylist].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'duration':
        return (a.duration || 0) - (b.duration || 0);
      case 'dateAdded':
      default:
        return 0; // Зберігаємо оригінальний порядок
    }
  });

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredPlaylist: sortedPlaylist,
  };
};

/**
 * Хук для sleep timer
 */
export const useSleepTimer = () => {
  const { stop } = useAudio();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback((minutes: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeLeft(minutes * 60);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          stop();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stop]);

  const cancelTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    timeLeft,
    formattedTimeLeft: timeLeft !== null ? formatTime(timeLeft) : null,
    isActive: timeLeft !== null,
    startTimer,
    cancelTimer,
  };
};
