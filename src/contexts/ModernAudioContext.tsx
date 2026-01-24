// ModernAudioContext.tsx - Audio player context
import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AudioTrack {
  id: string;
  title: string;
  subtitle?: string;
  src: string;
  url?: string;
  coverImage?: string;
  duration?: number;
  artist?: string;
  album?: string;
  // Supabase integration fields
  playlist_id?: string;
  track_number?: number;
  title_uk?: string;
  title_en?: string;
  // Verse sync fields
  verseId?: string;         // ID of the verse this audio belongs to
  bookSlug?: string;        // Book slug for navigation
  chapterNumber?: number;   // Chapter number
  cantoNumber?: number;     // Canto number (for SB, CC)
  verseNumber?: string;     // Verse number
}

type RepeatMode = "off" | "all" | "one";

// Sleep timer modes
export type SleepTimerMode =
  | { type: 'minutes'; value: number }     // Stop after X minutes
  | { type: 'tracks'; value: number }      // Stop after X tracks
  | { type: 'endOfTrack' }                 // Stop at end of current track
  | null;

// Audio Favorites
export interface AudioFavorite {
  id: string;
  trackId: string;
  title: string;
  title_uk?: string;
  src: string;
  coverImage?: string;
  verseId?: string;
  verseRef?: string; // e.g., "SCC 1.1.1"
  createdAt: string;
}

interface AudioContextState {
  // Playlist
  playlist: AudioTrack[];
  currentIndex: number | null;
  currentTrack: AudioTrack | null;

  // Playback state
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  buffered: number;

  // Settings
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  playbackRate: number;

  // UI state
  isExpanded: boolean;
  showPlaylist: boolean;

  // History & Analytics
  playHistory: AudioTrack[];

  // Favorites
  favorites: AudioFavorite[];
  addFavorite: (track: AudioTrack) => void;
  removeFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;

  // Sleep Timer
  sleepTimer: SleepTimerMode;
  sleepTimerRemaining: number | null;  // seconds remaining
  setSleepTimer: (mode: SleepTimerMode) => void;
  cancelSleepTimer: () => void;

  // Enhanced methods
  playTrack: (track: AudioTrack) => void;
  playVerseWithChapterContext: (track: AudioTrack) => Promise<void>;
  playPlaylist: (tracks: AudioTrack[], startIndex?: number) => void;
  addToPlaylist: (track: AudioTrack) => void;
  removeFromPlaylist: (index: number) => void;
  clearPlaylist: () => void;
  togglePlay: () => void;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setPlaybackRate: (rate: number) => void;
  setIsExpanded: (expanded: boolean) => void;
  setShowPlaylist: (show: boolean) => void;
  jumpToTrack: (index: number) => void;

  // Analytics
  trackPlay: (trackId: string) => void;
  getPlayStats: () => Promise<any>;
}

const AudioContext = createContext<AudioContextState | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
};

interface AudioProviderProps {
  children: React.ReactNode;
  storageKey?: string;
}

const FAVORITES_STORAGE_KEY = "vedavoice-audio-favorites";

export const AudioProvider: React.FC<AudioProviderProps> = ({ children, storageKey = "vedavoice-audio-state" }) => {
  // State (same as original)
  const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolumeState] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatModeState] = useState<RepeatMode>("off");
  const [isShuffled, setIsShuffled] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playHistory, setPlayHistory] = useState<AudioTrack[]>([]);

  // Favorites state
  const [favorites, setFavorites] = useState<AudioFavorite[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Favorites functions
  const addFavorite = useCallback((track: AudioTrack) => {
    const newFavorite: AudioFavorite = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      trackId: track.id,
      title: track.title,
      title_uk: track.title_uk,
      src: track.src,
      coverImage: track.coverImage,
      verseId: track.verseId,
      verseRef: track.subtitle || track.title,
      createdAt: new Date().toISOString(),
    };
    setFavorites(prev => {
      // Don't add if already exists
      if (prev.some(f => f.trackId === track.id)) return prev;
      return [...prev, newFavorite];
    });
  }, []);

  const removeFavorite = useCallback((trackId: string) => {
    setFavorites(prev => prev.filter(f => f.trackId !== trackId));
  }, []);

  const isFavorite = useCallback((trackId: string) => {
    return favorites.some(f => f.trackId === trackId);
  }, [favorites]);

  // Sleep Timer state
  const [sleepTimer, setSleepTimerState] = useState<SleepTimerMode>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const sleepTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sleepTimerTracksRemaining = useRef<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const originalPlaylistOrder = useRef<AudioTrack[]>([]);

  // ðŸ”§ Enhanced: Analytics tracking (using localStorage for now)
  const trackPlay = useCallback(async (trackId: string) => {
    try {
      // Local analytics in localStorage
      const playStats = JSON.parse(localStorage.getItem("audio-play-stats") || "{}");
      playStats[trackId] = (playStats[trackId] || 0) + 1;
      localStorage.setItem("audio-play-stats", JSON.stringify(playStats));

      // TODO: Add audio_analytics table in future
      console.log("Track played:", trackId, "Total plays:", playStats[trackId]);
    } catch (error) {
      console.error("Analytics tracking failed:", error);
    }
  }, []);

  // ðŸ”§ Enhanced: Play entire playlist
  const playPlaylist = useCallback(
    (tracks: AudioTrack[], startIndex = 0) => {
      setPlaylist(tracks);
      setCurrentIndex(startIndex);
      setIsPlaying(true);

      // Track playlist play
      if (tracks[startIndex]) {
        trackPlay(tracks[startIndex].id);
      }
    },
    [trackPlay],
  );

  // 🔧 Enhanced: Better format support
  const playTrack = useCallback(
    (track: AudioTrack) => {
      const existingIndex = playlist.findIndex((t) => t.id === track.id);

      if (existingIndex >= 0) {
        setCurrentIndex(existingIndex);
      } else {
        setPlaylist((prev) => {
          // Set index to the new track position (end of new playlist)
          setCurrentIndex(prev.length);
          return [...prev, track];
        });
      }

      setIsPlaying(true);
      trackPlay(track.id);
    },
    [playlist, trackPlay],
  );

  // 🔧 NEW: Play verse with chapter context - loads all chapter verses with audio
  const playVerseWithChapterContext = useCallback(
    async (track: AudioTrack) => {
      // If no verseId, just play the single track
      if (!track.verseId) {
        playTrack(track);
        return;
      }

      try {
        // First, get the verse to find its chapter
        const { data: verse, error: verseError } = await supabase
          .from('verses')
          .select('id, chapter_id, verse_number, sort_key, audio_url, full_verse_audio_url, recitation_audio_url, explanation_uk_audio_url, explanation_en_audio_url')
          .eq('id', track.verseId)
          .maybeSingle();

        if (verseError || !verse || !verse.chapter_id) {
          // Fallback to single track play
          playTrack(track);
          return;
        }

        // Get all verses from the same chapter that have audio
        const { data: chapterVerses, error: chapterError } = await supabase
          .from('verses')
          .select('id, verse_number, sort_key, audio_url, full_verse_audio_url, recitation_audio_url, explanation_uk_audio_url, explanation_en_audio_url')
          .eq('chapter_id', verse.chapter_id)
          .order('sort_key', { ascending: true });

        if (chapterError || !chapterVerses) {
          playTrack(track);
          return;
        }

        // Filter verses that have any audio and build tracks
        const versesWithAudio = chapterVerses.filter(v =>
          v.full_verse_audio_url || v.recitation_audio_url || v.explanation_uk_audio_url || v.explanation_en_audio_url || v.audio_url
        );

        if (versesWithAudio.length <= 1) {
          // Only one or no verses with audio, just play single track
          playTrack(track);
          return;
        }

        // Build playlist from chapter verses
        const chapterPlaylist: AudioTrack[] = versesWithAudio.map(v => {
          // Use the primary audio URL available (priority: full_verse > recitation > explanation > legacy)
          const audioSrc = v.full_verse_audio_url || v.recitation_audio_url || v.explanation_uk_audio_url || v.explanation_en_audio_url || v.audio_url;
          return {
            id: `verse-${v.id}`,
            title: `${v.verse_number}`,
            title_uk: `Вірш ${v.verse_number}`,
            subtitle: track.subtitle || track.title,
            src: audioSrc!,
            verseId: v.id,
            coverImage: track.coverImage,
            // Preserve navigation context
            bookSlug: track.bookSlug,
            cantoNumber: track.cantoNumber,
            chapterNumber: track.chapterNumber,
            verseNumber: v.verse_number,
          };
        });

        // Find the index of the current track in the playlist
        const startIndex = chapterPlaylist.findIndex(t => t.verseId === track.verseId);

        // Play the playlist starting from the current verse
        setPlaylist(chapterPlaylist);
        setCurrentIndex(startIndex >= 0 ? startIndex : 0);
        setIsPlaying(true);
        trackPlay(chapterPlaylist[startIndex >= 0 ? startIndex : 0].id);
      } catch (err) {
        console.error('Failed to load chapter context:', err);
        // Fallback to single track play
        playTrack(track);
      }
    },
    [playTrack, trackPlay],
  );

  // Enhanced: Error handling for audio
  const play = useCallback(async () => {
    if (!audioRef.current || !audioRef.current.src) return;

    try {
      // Check if file is accessible
      const response = await fetch(audioRef.current.src, { method: "HEAD" });
      if (!response.ok) {
        throw new Error(`Audio file not accessible: ${response.status}`);
      }

      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Play failed:", err);

      // Try next track if current fails
      if (playlist.length > 1) {
        nextTrack();
      }
    }
  }, []);

  // ðŸ”§ Enhanced: Crossfade support
  const nextTrack = useCallback(() => {
    if (currentIndex === null || playlist.length === 0) return;

    let nextIndex: number;

    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else if (currentIndex < playlist.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (repeatMode === "all") {
      nextIndex = 0;
    } else {
      pause();
      return;
    }

    setCurrentIndex(nextIndex);
    trackPlay(playlist[nextIndex].id);
  }, [currentIndex, playlist, isShuffled, repeatMode, trackPlay]);

  // Same implementation for other methods...
  const addToPlaylist = useCallback((track: AudioTrack) => {
    setPlaylist((prev) => {
      if (prev.some((t) => t.id === track.id)) return prev;
      return [...prev, track];
    });
  }, []);

  const removeFromPlaylist = useCallback(
    (index: number) => {
      setPlaylist((prev) => {
        const newPlaylist = prev.filter((_, i) => i !== index);

        if (currentIndex === index) {
          setCurrentIndex(null);
          setIsPlaying(false);
          if (audioRef.current) audioRef.current.pause();
        } else if (currentIndex !== null && currentIndex > index) {
          setCurrentIndex(currentIndex - 1);
        }

        return newPlaylist;
      });
    },
    [currentIndex],
  );

  const clearPlaylist = useCallback(() => {
    setPlaylist([]);
    setCurrentIndex(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const prevTrack = useCallback(() => {
    if (currentIndex === null || playlist.length === 0) return;

    if (currentTime > 3) {
      seek(0);
      return;
    }

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (repeatMode === "all") {
      setCurrentIndex(playlist.length - 1);
    }
  }, [currentIndex, playlist, currentTime, repeatMode]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume / 100;
    }
    if (clampedVolume > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  }, [isMuted]);

  const toggleRepeat = useCallback(() => {
    setRepeatModeState((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled((prev) => {
      if (!prev) {
        originalPlaylistOrder.current = [...playlist];
      } else {
        if (originalPlaylistOrder.current.length > 0) {
          setPlaylist(originalPlaylistOrder.current);
        }
      }
      return !prev;
    });
  }, [playlist]);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  const jumpToTrack = useCallback(
    (index: number) => {
      if (index >= 0 && index < playlist.length) {
        setCurrentIndex(index);
      }
    },
    [playlist],
  );

  // ðŸ"§ Enhanced: Analytics (localStorage based)
  const getPlayStats = useCallback(async () => {
    try {
      const playStats = JSON.parse(localStorage.getItem("audio-play-stats") || "{}");
      return Object.entries(playStats).map(([trackId, count]) => ({
        track_id: trackId,
        play_count: count,
        last_played: localStorage.getItem(`last-played-${trackId}`) || new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Failed to get play stats:", error);
      return [];
    }
  }, []);

  // Sleep Timer functions
  const cancelSleepTimer = useCallback(() => {
    if (sleepTimerIntervalRef.current) {
      clearInterval(sleepTimerIntervalRef.current);
      sleepTimerIntervalRef.current = null;
    }
    setSleepTimerState(null);
    setSleepTimerRemaining(null);
    sleepTimerTracksRemaining.current = 0;
  }, []);

  const setSleepTimer = useCallback((mode: SleepTimerMode) => {
    // Clear existing timer
    cancelSleepTimer();

    if (!mode) return;

    setSleepTimerState(mode);

    if (mode.type === 'minutes') {
      // Set countdown in seconds
      const totalSeconds = mode.value * 60;
      setSleepTimerRemaining(totalSeconds);

      // Start countdown interval
      sleepTimerIntervalRef.current = setInterval(() => {
        setSleepTimerRemaining((prev) => {
          if (prev === null || prev <= 1) {
            // Timer expired - stop playback
            pause();
            cancelSleepTimer();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (mode.type === 'tracks') {
      sleepTimerTracksRemaining.current = mode.value;
    }
    // 'endOfTrack' mode is handled in handleEnded
  }, [cancelSleepTimer, pause]);

  // Handle sleep timer track counting (called when track ends)
  const handleSleepTimerTrackEnd = useCallback(() => {
    if (!sleepTimer) return false;

    if (sleepTimer.type === 'endOfTrack') {
      pause();
      cancelSleepTimer();
      return true; // Prevent next track
    }

    if (sleepTimer.type === 'tracks') {
      sleepTimerTracksRemaining.current--;
      if (sleepTimerTracksRemaining.current <= 0) {
        pause();
        cancelSleepTimer();
        return true; // Prevent next track
      }
    }

    return false;
  }, [sleepTimer, pause, cancelSleepTimer]);

  // Audio setup and event listeners (same as original)
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
      audioRef.current.volume = volume / 100;
    }

    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.volume) setVolumeState(parsed.volume);
        if (parsed.repeatMode) setRepeatModeState(parsed.repeatMode);
        if (parsed.playbackRate) setPlaybackRateState(parsed.playbackRate);
      } catch (e) {
        console.error("Failed to load saved audio state:", e);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Save state
  useEffect(() => {
    const state = { volume, repeatMode, playbackRate };
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [volume, repeatMode, playbackRate, storageKey]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        setBuffered((bufferedEnd / audio.duration) * 100);
      }
    };
    const handleEnded = () => {
      // Check sleep timer first
      if (handleSleepTimerTrackEnd()) {
        return; // Sleep timer stopped playback
      }

      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: ErrorEvent) => {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("progress", handleProgress);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError as any);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("progress", handleProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError as any);
    };
  }, [repeatMode, handleSleepTimerTrackEnd]);

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || currentIndex === null) return;

    const track = playlist[currentIndex];
    if (!track) return;

    audio.src = track.src;
    audio.playbackRate = playbackRate;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("Playback failed:", err);
        setIsPlaying(false);
      });
    }

    // Media Session API
    if ("mediaSession" in navigator && track) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title_uk || track.title,
        artist: track.subtitle || track.artist || "VedaVoice",
        album: track.album || "Vedabase Audio",
        artwork: track.coverImage ? [{ src: track.coverImage, sizes: "512x512", type: "image/jpeg" }] : [],
      });

      navigator.mediaSession.setActionHandler("play", play);
      navigator.mediaSession.setActionHandler("pause", pause);
      navigator.mediaSession.setActionHandler("previoustrack", prevTrack);
      navigator.mediaSession.setActionHandler("nexttrack", nextTrack);
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details.seekTime) seek(details.seekTime);
      });
    }

    // Add to history
    setPlayHistory((prev) => {
      const filtered = prev.filter((t) => t.id !== track.id);
      return [track, ...filtered].slice(0, 50);
    });
  }, [currentIndex, playlist]);

  const currentTrack = currentIndex !== null ? playlist[currentIndex] : null;

  const value: AudioContextState = {
    playlist,
    currentIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    buffered,
    volume,
    isMuted,
    repeatMode,
    isShuffled,
    playbackRate,
    isExpanded,
    showPlaylist,
    playHistory,
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    sleepTimer,
    sleepTimerRemaining,
    setSleepTimer,
    cancelSleepTimer,
    playTrack,
    playVerseWithChapterContext,
    playPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
    togglePlay,
    play,
    pause,
    stop,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    setRepeatMode: setRepeatModeState,
    toggleRepeat,
    toggleShuffle,
    setPlaybackRate,
    setIsExpanded,
    setShowPlaylist,
    jumpToTrack,
    trackPlay,
    getPlayStats,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export default AudioProvider;
