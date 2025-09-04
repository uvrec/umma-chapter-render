import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw, X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  verseNumber: string;
  onClose: () => void;
  isVisible: boolean;
}

export const AudioPlayer = ({ verseNumber, onClose, isVisible }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState("1x");
  const [volume, setVolume] = useState([75]);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mock audio functionality since direct Telegram links don't work in browsers
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // Mock duration for demo - would be set from real audio
  useEffect(() => {
    if (verseNumber === "ШБ 1.1.1") {
      setDuration(96); // 1:36 for SB 1.1.1
    } else {
      setDuration(60); // Default 1 minute
    }
  }, [verseNumber]);

  // Mock audio playback with timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsLoadingAudio(true);
      // Simulate loading time
      setTimeout(() => {
        setIsLoadingAudio(false);
        setIsPlaying(true);
      }, 500);
    }
  };

  const skipForward = () => {
    setCurrentTime(prev => Math.min(prev + 15, duration));
  };

  const skipBackward = () => {
    setCurrentTime(prev => Math.max(prev - 15, 0));
  };

  const toggleSpeed = () => {
    const speeds = ["1x", "1.25x", "1.5x", "2x"];
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  const handleProgressChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Progress bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            onValueChange={handleProgressChange}
            max={duration}
            step={1}
            className="w-full"
          />
        </div>

        {/* Main controls */}
        <div className="flex items-center justify-between">
          {/* Time display */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground min-w-[80px]">
            <span>{formatTime(currentTime)}</span>
          </div>

          {/* Control buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm" onClick={skipBackward}>
              <RotateCcw className="w-4 h-4" />
              <span className="ml-1 text-xs">15</span>
            </Button>

            <Button
              variant="default"
              size="lg"
              className="rounded-full w-12 h-12"
              onClick={togglePlay}
              disabled={isLoadingAudio}
            >
              {isLoadingAudio ? (
                <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </Button>

            <Button variant="ghost" size="sm" onClick={skipForward}>
              <RotateCw className="w-4 h-4" />
              <span className="ml-1 text-xs">15</span>
            </Button>

            <Button variant="ghost" size="sm">
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Right controls */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{formatTime(duration)}</span>
            </div>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleSpeed}
              className="min-w-[40px]"
            >
              {speed}
            </Button>

            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-20"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-2 border"
            >
              СА-УК
            </Button>

            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Verse info */}
        <div className="text-center mt-2">
          <span className="text-sm font-medium">Вірш {verseNumber}</span>
        </div>
      </div>
    </div>
  );
};