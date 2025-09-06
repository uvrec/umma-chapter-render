import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { Play, Pause, X, Volume2, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface Track {
  id: string;
  title: string;
  verseNumber?: string;
  url: string;
  src: string;
}

interface AudioContextType {
  playlist: Track[];
  currentIndex: number | null;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (track: { id: string; title: string; src: string; verseNumber?: string }) => void;
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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // створюємо <audio>, якщо ще нема
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
      audioRef.current.volume = volume / 100;
    }
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      console.log("Audio loaded:", audio.src);
      setDuration(audio?.duration || 0);
    };
    const handleTimeUpdate = () => setCurrentTime(audio?.currentTime || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      if (currentIndex !== null && currentIndex < playlist.length - 1) {
        playTrackByIndex(currentIndex + 1);
      }
    };
    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setIsPlaying(false);
    };

    audio?.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio?.addEventListener("timeupdate", handleTimeUpdate);
    audio?.addEventListener("ended", handleEnded);
    audio?.addEventListener("error", handleError);

    return () => {
      audio?.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio?.removeEventListener("timeupdate", handleTimeUpdate);
      audio?.removeEventListener("ended", handleEnded);
      audio?.removeEventListener("error", handleError);
    };
  }, [playlist, currentIndex, volume]);

  const playTrackByIndex = (index: number) => {
    if (index < 0 || index >= playlist.length) return;
    setCurrentIndex(index);
    if (audioRef.current) {
      audioRef.current.src = playlist[index].src || playlist[index].url;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch((error) => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    }
  };

  const playTrack = (track: { id: string; title: string; src: string; verseNumber?: string }) => {
    // Додаємо трек до плейлиста якщо його немає
    const existingIndex = playlist.findIndex(t => t.id === track.id);
    
    if (existingIndex >= 0) {
      playTrackByIndex(existingIndex);
    } else {
      const newTrack: Track = {
        id: track.id,
        title: track.title,
        verseNumber: track.verseNumber,
        url: track.src,
        src: track.src
      };
      
      const newPlaylist = [...playlist, newTrack];
      setPlaylist(newPlaylist);
      setCurrentIndex(newPlaylist.length - 1);
      
      if (audioRef.current) {
        audioRef.current.src = newTrack.src;
        audioRef.current.load();
        audioRef.current.play().then(() => setIsPlaying(true)).catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioRef.current.src) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((error) => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
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
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Progress bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            onValueChange={(v) => seek(v[0])}
            max={duration || 0}
            step={1}
            className="w-full"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Info */}
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{currentTrack.title}</p>
              {currentTrack.verseNumber && (
                <p className="text-xs text-muted-foreground">Вірш {currentTrack.verseNumber}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4 mx-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevTrack}
              aria-label="Попередній трек"
              disabled={currentIndex === 0}
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              variant="default"
              size="lg"
              className="rounded-full w-12 h-12"
              onClick={togglePlay}
              aria-label={isPlaying ? "Пауза" : "Відтворити"}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextTrack}
              aria-label="Наступний трек"
              disabled={currentIndex === playlist.length - 1}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={[volume]}
                onValueChange={(v) => setVolume(v[0])}
                max={100}
                step={1}
                className="w-20"
              />
            </div>

            <Button variant="ghost" size="sm" onClick={stop} aria-label="Зупинити">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};