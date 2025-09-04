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

  // Audio source mapping for verses
  const audioSources: { [key: string]: string } = {
    "ШБ 1.1.1": "https://telegram.org/dl?tme=e8253e9854b878a4b8_5692623092382467309",
    // Add more audio sources here as needed
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(Math.floor(audio.currentTime));
    const updateDuration = () => setDuration(Math.floor(audio.duration));
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [verseNumber]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume[0] / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const speeds = { "1x": 1, "1.25x": 1.25, "1.5x": 1.5, "2x": 2 };
    audio.playbackRate = speeds[speed as keyof typeof speeds] || 1;
  }, [speed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to play audio:', error);
      }
    }
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.currentTime + 15, audio.duration);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(audio.currentTime - 15, 0);
  };

  const toggleSpeed = () => {
    const speeds = ["1x", "1.25x", "1.5x", "2x"];
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <audio
        ref={audioRef}
        src={audioSources[verseNumber]}
        preload="metadata"
      />
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
            >
              {isPlaying ? (
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