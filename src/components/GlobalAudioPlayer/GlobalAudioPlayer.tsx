import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { Play, Pause, X, Volume2, SkipBack, SkipForward, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// ✅ ВИПРАВЛЕНО: Додано duration та metadata
interface Track {
  id: string;
  title: string;
  verseNumber?: string;
  url: string;
  src: string;
  duration?: number; // ✅ ДОДАНО: тривалість треку в секундах
  metadata?: {
    // ✅ ДОДАНО: додаткові метадані
    artist?: string;
    album?: string;
    coverUrl?: string;
    playlistTitle?: string;
    [key: string]: any;
  };
}

interface AudioContextType {
  playlist: Track[];
  currentIndex: number | null;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (track: {
    id: string;
    title: string;
    src: string;
    verseNumber?: string;
    duration?: number;
    metadata?: Track["metadata"];
  }) => void;
  togglePlay: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  prevTrack: () => void;
  nextTrack: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(75);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // створюємо <audio>, якщо ще нема
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
      audioRef.current.volume = volume / 100;
      audioRef.current.setAttribute("playsinline", "");

      // Mobile audio unlock - перший клік розблоковує аудіо на iOS/Android
      const unlockAudio = () => {
        if (!audioRef.current || isAudioUnlocked) return;
        const promise = audioRef.current.play();
        if (promise !== undefined) {
          promise
            .then(() => {
              audioRef.current?.pause();
              audioRef.current!.currentTime = 0;
              setIsAudioUnlocked(true);
              console.log("[Audio] Unlocked for mobile");
            })
            .catch(() => {
              // Ignore - буде спроба при наступному кліку
            });
        }
      };

      document.addEventListener("touchstart", unlockAudio, { once: true });
      document.addEventListener("click", unlockAudio, { once: true });

      return () => {
        document.removeEventListener("touchstart", unlockAudio);
        document.removeEventListener("click", unlockAudio);
      };
    }
  }, [isAudioUnlocked, volume]);

  // слухачі подій <audio>
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      if (currentIndex !== null && currentIndex < playlist.length - 1) {
        playTrackByIndex(currentIndex + 1);
      }
    };
    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
    };
  }, [currentIndex, playlist.length]);

  const playTrackByIndex = (index: number) => {
    if (index < 0 || index >= playlist.length) return;
    setCurrentIndex(index);
    const track = playlist[index];
    if (!audioRef.current || !track?.src) return;

    console.log("[Audio] playTrackByIndex:", index, track.src);
    audioRef.current.src = track.src;
    audioRef.current.load();

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error("Error playing audio:", error);
          if (error.name === "NotAllowedError") {
            console.warn("Playback requires user interaction on mobile");
          }
          setIsPlaying(false);
        });
    }
  };

  const playTrack = (track: {
    id: string;
    title: string;
    src: string;
    verseNumber?: string;
    duration?: number;
    metadata?: Track["metadata"];
  }) => {
    // Додаємо трек до плейлиста якщо його нема
    const existingIndex = playlist.findIndex((t) => t.id === track.id);

    if (existingIndex >= 0) {
      playTrackByIndex(existingIndex);
    } else {
      const newTrack: Track = {
        id: track.id,
        title: track.title,
        verseNumber: track.verseNumber,
        url: track.src,
        src: track.src,
        duration: track.duration, // ✅ ДОДАНО
        metadata: track.metadata, // ✅ ДОДАНО
      };

      const newPlaylist = [...playlist, newTrack];
      setPlaylist(newPlaylist);
      setCurrentIndex(newPlaylist.length - 1);

      if (audioRef.current) {
        console.log("[Audio] playTrack new src:", newTrack.src);
        audioRef.current.src = newTrack.src;
        audioRef.current.load();

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => {
              console.error("Error playing audio:", error);
              if (error.name === "NotAllowedError") {
                console.warn("Playback requires user interaction on mobile");
              }
              setIsPlaying(false);
            });
        }
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioRef.current.src) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error("Error playing audio:", error);
            if (error.name === "NotAllowedError") {
              console.warn("Playback requires user interaction on mobile");
            }
            setIsPlaying(false);
          });
      }
    }
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentIndex(null);
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (audioRef.current) {
      audioRef.current.volume = v / 100;
    }
  };

  const prevTrack = () => {
    if (currentIndex !== null && currentIndex > 0) playTrackByIndex(currentIndex - 1);
  };

  const nextTrack = () => {
    if (currentIndex !== null && currentIndex < playlist.length - 1) playTrackByIndex(currentIndex + 1);
  };

  const value: AudioContextType = {
    playlist,
    currentIndex,
    currentTrack: currentIndex !== null ? playlist[currentIndex] : null,
    isPlaying,
    currentTime,
    duration,
    volume,
    playTrack,
    togglePlay,
    stop,
    seek,
    setVolume,
    prevTrack,
    nextTrack,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const GlobalAudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    stop,
    setVolume,
    seek,
    prevTrack,
    nextTrack,
    currentIndex,
    playlist,
  } = useAudio();

  const [isVisible, setIsVisible] = useState(true);

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0
      ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50 transition-transform duration-300"
      style={{ transform: isVisible ? "translateY(0)" : "translateY(calc(100% - 40px))" }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="absolute -top-10 left-1/2 -translate-x-1/2 bg-background border border-border rounded-t-lg px-4 py-2 hover:bg-accent transition-colors"
        aria-label={isVisible ? "Сховати плеєр" : "Показати плеєр"}
      >
        {isVisible ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Track info */}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{currentTrack.title}</div>
            {currentTrack.verseNumber && (
              <div className="text-sm text-muted-foreground">Вірш {currentTrack.verseNumber}</div>
            )}
            {/* ✅ ВИПРАВЛЕНО: Тепер metadata доступна */}
            {currentTrack.metadata?.artist && (
              <div className="text-xs text-muted-foreground">{currentTrack.metadata.artist}</div>
            )}
            {currentTrack.metadata?.playlistTitle && (
              <div className="text-xs text-muted-foreground">{currentTrack.metadata.playlistTitle}</div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevTrack}
              disabled={currentIndex === null || currentIndex <= 0}
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button onClick={togglePlay} size="icon">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextTrack}
              disabled={currentIndex === null || currentIndex >= playlist.length - 1}
            >
              <SkipForward className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" onClick={stop}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-12 text-right">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={(val) => seek(val[0])}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-12">{formatTime(duration)}</span>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider value={[volume]} max={100} step={1} onValueChange={(val) => setVolume(val[0])} className="w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};
