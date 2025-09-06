import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  List,
  Shuffle,
  Repeat
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { incrementPlayCount } from "@/utils/playbackStats";

interface Track {
  id: string;
  title: string;
  duration: string;
  src: string;
}

interface PlaylistPlayerProps {
  tracks: Track[];
  title: string;
  albumCover?: string;
}

export const PlaylistPlayer: React.FC<PlaylistPlayerProps> = ({ tracks, title, albumCover }) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([100]);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const countedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let isMounted = true;
    countedRef.current = false; // reset threshold flag for new track

    const updateTime = () => {
      if (!isMounted) return;
      setCurrentTime(audio.currentTime);
      const d = audio.duration || 0;
      if (!countedRef.current && d > 0 && audio.currentTime / d >= 0.6) {
        // Count a play for this track
        const id = tracks[currentTrack]?.id || tracks[currentTrack]?.src || `track-${currentTrack}`;
        try {
          incrementPlayCount(id);
        } catch {}
        countedRef.current = true;
      }
    };
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      handleNext();
    };
    const onError = () => {
      setIsPlaying(false);
      console.warn('Audio error for src:', audio.src);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      isMounted = false;
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [currentTrack, tracks]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        if (!tracks[currentTrack]?.src) {
          console.warn('No audio source for current track');
          return;
        }
        await audio.play();
        setIsPlaying(true);
      }
    } catch (e) {
      console.warn('Unable to play audio:', e);
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = value[0] / 100;
      setVolume(value);
      setIsMuted(value[0] === 0);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isMuted) {
        audio.volume = volume[0] / 100;
        setIsMuted(false);
      } else {
        audio.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <audio
        ref={audioRef}
        src={tracks[currentTrack]?.src}
        crossOrigin="anonymous"
        onLoadedData={() => setIsPlaying(false)}
      />

      {/* Main Player */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Album Cover and Track Info */}
          <div className="flex items-center space-x-4">
            {albumCover && (
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={albumCover}
                  alt={title}
                  className="w-full h-full object-cover rounded-md shadow-md"
                />
              </div>
            )}
            <div className="flex-1 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {tracks[currentTrack]?.title}
              </h3>
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button variant="ghost" size="icon" onClick={handlePrevious}>
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <Button size="icon" onClick={togglePlay} className="w-12 h-12">
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleNext}>
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume and Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={isMuted ? [0] : volume}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>

            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon">
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Repeat className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowPlaylist(!showPlaylist)}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Playlist */}
      {showPlaylist && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">Плейлист</h4>
            <span className="text-sm text-muted-foreground">
              {tracks.length} треків
            </span>
          </div>
          
          <ScrollArea className="h-64">
            <div className="space-y-1">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                    index === currentTrack
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted text-foreground'
                  }`}
                  onClick={() => selectTrack(index)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 text-center text-sm">
                      {index === currentTrack && isPlaying ? (
                        <Play className="w-3 h-3" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="font-medium">{track.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {track.duration}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};