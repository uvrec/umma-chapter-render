import { Play, Pause, X, Volume2, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudio } from "@/contexts/AudioContext";

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
    seek 
  } = useAudio();

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (value: number[]) => {
    seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

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
          {/* Track info and time */}
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

          {/* Control buttons */}
          <div className="flex items-center space-x-4 mx-4">
            <Button variant="ghost" size="sm">
              <SkipBack className="w-4 h-4" />
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

            <Button variant="ghost" size="sm">
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Right controls */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-20"
              />
            </div>

            <Button variant="ghost" size="sm" onClick={stop}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};