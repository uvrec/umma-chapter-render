import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  X,
  Volume2,
  Repeat,
  Repeat1,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { incrementPlayCount } from "@/utils/playbackStats";

interface AudioPlayerProps {
  playlist: { verseNumber: string; audioUrl?: string }[];
  initialIndex?: number;
  onClose: () => void;
  isVisible: boolean;
}

type RepeatMode = "off" | "one" | "all";

export const AudioPlayer = ({
  playlist,
  initialIndex = 0,
  onClose,
  isVisible,
}: AudioPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState("1x");
  const [volume, setVolume] = useState([75]);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("all");

  const audioRef = useRef<HTMLAudioElement>(null);
  const countedRef = useRef(false);

  const currentItem = playlist[currentIndex];
  const currentAudioUrl = currentItem?.audioUrl;
  const verseNumber = currentItem?.verseNumber || "";

  // завантаження нового аудіо
  useEffect(() => {
    if (!currentAudioUrl || !audioRef.current) return;
    const audio = audioRef.current;
    let isMounted = true;
    countedRef.current = false;
    setCurrentTime(0);
    setDuration(0);

    const handleLoadedMetadata = () => {
      if (!isMounted) return;
      setDuration(Math.floor(audio.duration));
      setIsLoadingAudio(false);
    };

    const handleTimeUpdate = () => {
      if (!isMounted) return;
      const ct = Math.floor(audio.currentTime);
      setCurrentTime(ct);

      if (
        !countedRef.current &&
        audio.duration > 0 &&
        audio.currentTime / audio.duration >= 0.6
      ) {
        try {
          incrementPlayCount(verseNumber || currentAudioUrl);
        } catch {}
        countedRef.current = true;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);

      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        setIsPlaying(true);
      } else if (repeatMode === "all" && currentIndex < playlist.length - 1) {
        setCurrentIndex((i) => i + 1);
        setIsPlaying(true);
      }
    };

    const handleLoadStart = () => setIsLoadingAudio(true);
    const handleError = () => {
      setIsPlaying(false);
      setIsLoadingAudio(false);
      console.warn("Audio error for verse:", verseNumber, "URL:", currentAudioUrl);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("error", handleError);

    audio.src = currentAudioUrl;
    audio.load();

    return () => {
      isMounted = false;
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("error", handleError);
    };
  }, [currentAudioUrl, verseNumber, currentIndex, playlist.length, repeatMode]);

  // швидкість
  useEffect(() => {
    if (audioRef.current) {
      const speedValue = parseFloat(speed.replace("x", ""));
      audioRef.current.playbackRate = speedValue;
    }
  }, [speed]);

  // гучність
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = async () => {
    if (!audioRef.current || !currentAudioUrl) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoadingAudio(true);
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoadingAudio(false);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsLoadingAudio(false);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      const newTime = Math.min(audioRef.current.currentTime + 15, duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(Math.floor(newTime));
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      const newTime = Math.max(audioRef.current.currentTime - 15, 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(Math.floor(newTime));
    }
  };

  const toggleSpeed = () => {
    const speeds = ["1x", "1.25x", "1.5x", "2x"];
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsPlaying(true);
    }
  };

  const cycleRepeatMode = () => {
    setRepeatMode((prev) =>
      prev === "off" ? "one" : prev === "one" ? "all" : "off"
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />
      <div className="container mx-auto px-4 py-4">
        {/* Progress bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            onValueChange={handleProgressChange}
            max={duration || 0}
            step={1}
            className="w-full"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Current time */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground min-w-[80px]">
            <span>{formatTime(currentTime)}</span>
          </div>

          {/* Main buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handlePrev} disabled={currentIndex === 0}>
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm" onClick={skipBackward} disabled={duration === 0}>
              <RotateCcw className="w-4 h-4" />
              <span className="ml-1 text-xs">15</span>
            </Button>

            <Button
              variant="default"
              size="lg"
              className="rounded-full w-12 h-12"
              onClick={togglePlay}
              disabled={isLoadingAudio || !currentAudioUrl}
            >
              {isLoadingAudio ? (
                <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </Button>

            <Button variant="ghost" size="sm" onClick={skipForward} disabled={duration === 0}>
              <RotateCw className="w-4 h-4" />
              <span className="ml-1 text-xs">15</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={currentIndex === playlist.length - 1}
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{formatTime(duration)}</span>
            </div>

            <Button variant="ghost" size="sm" onClick={toggleSpeed} className="min-w-[40px]">
              {speed}
            </Button>

            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-20" />
            </div>

            {/* Repeat button */}
            <Button variant="ghost" size="sm" onClick={cycleRepeatMode}>
              {repeatMode === "one" ? (
                <Repeat1 className="w-5 h-5 text-primary" />
              ) : repeatMode === "all" ? (
                <Repeat className="w-5 h-5 text-primary" />
              ) : (
                <Repeat className="w-5 h-5 text-muted-foreground" />
              )}
            </Button>

            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Verse info */}
        <div className="text-center mt-2">
          <span className="text-sm font-medium">
            Вірш {verseNumber} ({currentIndex + 1}/{playlist.length})
          </span>
        </div>
      </div>
    </div>
  );
};