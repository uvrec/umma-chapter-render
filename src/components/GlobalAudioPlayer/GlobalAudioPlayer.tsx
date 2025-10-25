import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { 
  Play, Pause, X, Volume2, SkipBack, SkipForward, 
  ChevronDown, ChevronUp, Repeat, Repeat1, List, Upload, Image as ImageIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface Track {
  id: string;
  title: string;
  verseNumber?: string;
  url: string;
  src: string;
  coverImage?: string;
}

type RepeatMode = 'off' | 'all' | 'one';

interface AudioContextType {
  playlist: Track[];
  currentIndex: number | null;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeatMode: RepeatMode;
  playTrack: (track: { id: string; title: string; src: string; verseNumber?: string; coverImage?: string }) => void;
  togglePlay: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  prevTrack: () => void;
  nextTrack: () => void;
  toggleRepeat: () => void;
  addToPlaylist: (track: { id: string; title: string; src: string; verseNumber?: string; coverImage?: string }) => void;
  removeFromPlaylist: (index: number) => void;
  clearPlaylist: () => void;
  // Queue helpers for integrations
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: { id: string; title: string; src: string; verseNumber?: string; coverImage?: string }) => void;
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
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Створення audio елементу
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
      audioRef.current.volume = volume / 100;
      audioRef.current.setAttribute('playsinline', '');
      
      // Mobile audio unlock
      const unlockAudio = () => {
        if (!audioRef.current || isAudioUnlocked) return;
        const promise = audioRef.current.play();
        if (promise !== undefined) {
          promise.then(() => {
            audioRef.current?.pause();
            audioRef.current!.currentTime = 0;
            setIsAudioUnlocked(true);
          }).catch(() => {});
        }
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('click', unlockAudio);
      };

      document.addEventListener('touchstart', unlockAudio, { once: true });
      document.addEventListener('click', unlockAudio, { once: true });

      // Media Session API для фонового відтворення
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', () => {
          audioRef.current?.play();
          setIsPlaying(true);
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          audioRef.current?.pause();
          setIsPlaying(false);
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          if (currentIndex !== null && currentIndex > 0) {
            playTrackByIndex(currentIndex - 1);
          }
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          if (currentIndex !== null && currentIndex < playlist.length - 1) {
            playTrackByIndex(currentIndex + 1);
          }
        });
      }
    }

    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 'all') {
        if (currentIndex !== null && currentIndex < playlist.length - 1) {
          playTrackByIndex(currentIndex + 1);
        } else {
          playTrackByIndex(0);
        }
      } else {
        if (currentIndex !== null && currentIndex < playlist.length - 1) {
          playTrackByIndex(currentIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, playlist.length, repeatMode]);

  // Оновлення Media Session метаданих
  useEffect(() => {
    if ('mediaSession' in navigator && currentIndex !== null && playlist[currentIndex]) {
      const track = playlist[currentIndex];
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.verseNumber || 'Vedavoice',
        artwork: track.coverImage ? [
          { src: track.coverImage, sizes: '512x512', type: 'image/jpeg' }
        ] : []
      });
    }
  }, [currentIndex, playlist]);

  const playTrackByIndex = (index: number) => {
    if (index < 0 || index >= playlist.length) return;
    const track = playlist[index];
    setCurrentIndex(index);

    if (audioRef.current) {
      audioRef.current.src = track.src;
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error("Error playing audio:", error);
            setIsPlaying(false);
          });
      }
    }
  };

  const playTrack = (track: { id: string; title: string; src: string; verseNumber?: string; coverImage?: string }) => {
    const existingIndex = playlist.findIndex(t => t.id === track.id);
    
    if (existingIndex >= 0) {
      playTrackByIndex(existingIndex);
    } else {
      const newTrack: Track = {
        id: track.id,
        title: track.title,
        verseNumber: track.verseNumber,
        url: track.src,
        src: track.src,
        coverImage: track.coverImage
      };
      
      const newPlaylist = [...playlist, newTrack];
      setPlaylist(newPlaylist);
      setCurrentIndex(newPlaylist.length - 1);
      
      if (audioRef.current) {
        audioRef.current.src = newTrack.src;
        audioRef.current.load();
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => {
              console.error("Error playing audio:", error);
              setIsPlaying(false);
            });
        }
      }
    }
  };

  const addToPlaylist = (track: { id: string; title: string; src: string; verseNumber?: string; coverImage?: string }) => {
    const existingIndex = playlist.findIndex(t => t.id === track.id);
    if (existingIndex >= 0) return;

    const newTrack: Track = {
      id: track.id,
      title: track.title,
      verseNumber: track.verseNumber,
      url: track.src,
      src: track.src,
      coverImage: track.coverImage
    };
    
    setPlaylist(prev => [...prev, newTrack]);
  };
  
  // Queue helpers for integrations
  const addToQueue = (track: { id: string; title: string; src: string; verseNumber?: string; coverImage?: string }) => {
    addToPlaylist(track);
  };

  const setQueue = (tracks: Track[]) => {
    setPlaylist(tracks);
    if (tracks.length) {
      setCurrentIndex(0);
      if (audioRef.current) {
        audioRef.current.src = tracks[0].src;
        audioRef.current.load();
      }
      setIsPlaying(false);
    } else {
      stop();
    }
  };
  
  const removeFromPlaylist = (index: number) => {
    setPlaylist(prev => {
      const newPlaylist = [...prev];
      newPlaylist.splice(index, 1);
      
      if (currentIndex === index) {
        stop();
      } else if (currentIndex !== null && currentIndex > index) {
        setCurrentIndex(currentIndex - 1);
      }
      
      return newPlaylist;
    });
  };

  const clearPlaylist = () => {
    stop();
    setPlaylist([]);
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
    if (currentIndex !== null && currentIndex > 0) {
      playTrackByIndex(currentIndex - 1);
    }
  };

  const nextTrack = () => {
    if (currentIndex !== null && currentIndex < playlist.length - 1) {
      playTrackByIndex(currentIndex + 1);
    } else if (repeatMode === 'all' && playlist.length > 0) {
      playTrackByIndex(0);
    }
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const value: AudioContextType = {
    playlist,
    currentIndex,
    currentTrack: currentIndex !== null ? playlist[currentIndex] : null,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeatMode,
    playTrack,
    togglePlay,
    stop,
    seek,
    setVolume,
    prevTrack,
    nextTrack,
    toggleRepeat,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
    setQueue,
    addToQueue,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const GlobalAudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeatMode,
    playlist,
    currentIndex,
    togglePlay,
    stop,
    setVolume,
    seek,
    prevTrack,
    nextTrack,
    toggleRepeat,
    removeFromPlaylist,
    clearPlaylist,
  } = useAudio();

  const [isVisible, setIsVisible] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Тут можна додати логіку завантаження файлів
    console.log("Files to upload:", files);
  };

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  return (
    <>
      {/* Модальне вікно зі збільшеною обкладинкою */}
      {showCoverModal && currentTrack.coverImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowCoverModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={currentTrack.coverImage} 
              alt={currentTrack.title}
              className="w-full h-full object-contain rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation();
                setShowCoverModal(false);
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Плейлист */}
      {showPlaylist && (
        <div className="fixed bottom-24 left-0 right-0 max-w-6xl mx-auto bg-background border border-border rounded-t-lg shadow-xl z-40 max-h-96 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Плейлист ({playlist.length})</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearPlaylist}
                disabled={playlist.length === 0}
              >
                Очистити
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPlaylist(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="overflow-y-auto max-h-80">
            {playlist.map((track, index) => (
              <div
                key={track.id}
                className={cn(
                  "flex items-center gap-3 p-3 hover:bg-accent cursor-pointer border-b last:border-b-0",
                  currentIndex === index && "bg-accent"
                )}
              >
                {track.coverImage && (
                  <img 
                    src={track.coverImage} 
                    alt={track.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{track.title}</div>
                  {track.verseNumber && (
                    <div className="text-sm text-muted-foreground">{track.verseNumber}</div>
                  )}
                </div>
                {currentIndex === index && isPlaying && (
                  <div className="flex gap-0.5">
                    <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromPlaylist(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Основний плеєр */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50 transition-transform duration-300"
        style={{ transform: isVisible ? 'translateY(0)' : 'translateY(calc(100% - 48px))' }}
      >
        {/* Кнопка згортання */}
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="absolute -top-10 left-1/2 -translate-x-1/2 bg-background border border-border rounded-t-lg px-4 py-2 hover:bg-accent transition-colors"
          aria-label={isVisible ? "Сховати плеєр" : "Показати плеєр"}
        >
          {isVisible ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>

        <div className="max-w-6xl mx-auto p-4">
          <div className="flex flex-col gap-4">
            {/* Верхня частина: обкладинка та інформація */}
            <div className="flex items-center gap-4">
              {/* Обкладинка */}
              {currentTrack.coverImage && (
                <button
                  onClick={() => setShowCoverModal(true)}
                  className="relative w-16 h-16 rounded-lg overflow-hidden hover:opacity-80 transition-opacity group flex-shrink-0"
                >
                  <img 
                    src={currentTrack.coverImage} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                </button>
              )}

              {/* Інформація про трек */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{currentTrack.title}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {currentTrack.verseNumber || "Vedavoice · Аудіо"}
                </div>
              </div>

              {/* Кнопки управління на десктопі */}
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  title="Додати файли"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  title="Плейлист"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={stop}
                  title="Зупинити"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Прогрес бар */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground min-w-[40px]">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={(v) => seek(v[0])}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground min-w-[40px]">
                {formatTime(duration)}
              </span>
            </div>

            {/* Елементи управління */}
            <div className="flex items-center justify-between">
              {/* Ліва частина: гучність */}
              <div className="flex items-center gap-2 w-32">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={(v) => setVolume(v[0])}
                  className="flex-1"
                />
              </div>

              {/* Центр: кнопки відтворення */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRepeat}
                  className={cn(
                    "h-9 w-9",
                    repeatMode !== 'off' && "text-primary"
                  )}
                  title={
                    repeatMode === 'off' ? 'Повтор вимкнено' :
                    repeatMode === 'all' ? 'Повторити все' :
                    'Повторити один'
                  }
                >
                  <RepeatIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevTrack}
                  disabled={currentIndex === null || currentIndex === 0}
                  className="h-9 w-9"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  size="icon"
                  onClick={togglePlay}
                  className="h-11 w-11"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextTrack}
                  disabled={currentIndex === null || currentIndex === playlist.length - 1}
                  className="h-9 w-9"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              {/* Права частина: мобільні кнопки */}
              <div className="flex md:hidden items-center gap-2 w-32 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPlaylist(!showPlaylist)}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={stop}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Права частина: десктоп (порожньо для симетрії) */}
              <div className="hidden md:block w-32" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
