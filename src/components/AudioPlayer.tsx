import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw, X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  verseNumber: string;
  onClose: () => void;
  isVisible: boolean;
  audioUrl?: string;
}

// Audio URLs mapping - replace with your Google Drive direct download links
const AUDIO_URLS: Record<string, string> = {
  "ШБ 1.1.1": "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_HERE",
  "ШБ 1.1.2": "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_HERE",
  // Add more mappings as needed
};

export const AudioPlayer = ({ verseNumber, onClose, isVisible, audioUrl }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState("1x");
  const [volume, setVolume] = useState([75]);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // Get audio URL for current verse
  const currentAudioUrl = audioUrl || AUDIO_URLS[verseNumber];

  // Initialize audio element
  useEffect(() => {
    if (currentAudioUrl && audioRef.current) {
      const audio = audioRef.current;
      
      const handleLoadedMetadata = () => {
        setDuration(Math.floor(audio.duration));
        setIsLoadingAudio(false);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(Math.floor(audio.currentTime));
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      const handleLoadStart = () => {
        setIsLoadingAudio(true);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('loadstart', handleLoadStart);
      
      audio.src = currentAudioUrl;
      audio.load();

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('loadstart', handleLoadStart);
      };
    }
  }, [currentAudioUrl]);

  // Update audio playback speed
  useEffect(() => {
    if (audioRef.current) {
      const speedValue = parseFloat(speed.replace('x', ''));
      audioRef.current.playbackRate = speedValue;
    }
  }, [speed]);

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      console.error('Error playing audio:', error);
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

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <audio ref={audioRef} preload="metadata" />
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