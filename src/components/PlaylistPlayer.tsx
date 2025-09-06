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
import { useAudio } from "@/contexts/AudioContext";

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
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(true);
  
  const { 
    currentTrack, 
    isPlaying, 
    currentTime, 
    duration, 
    volume, 
    playTrack, 
    togglePlay, 
    setVolume, 
    seek 
  } = useAudio();

  const currentPlaylistTrack = tracks[currentTrackIndex];
  const isCurrentTrackInPlaylist = currentTrack && tracks.some(track => track.src === currentTrack.src);

  const handlePlayTrack = (track: Track, index: number) => {
    setCurrentTrackIndex(index);
    playTrack({
      id: track.id,
      title: track.title,
      src: track.src
    });
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];
    if (nextTrack?.src) {
      handlePlayTrack(nextTrack, nextIndex);
    }
  };

  const handlePrevious = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    const prevTrack = tracks[prevIndex];
    if (prevTrack?.src) {
      handlePlayTrack(prevTrack, prevIndex);
    }
  };

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
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
                {isCurrentTrackInPlaylist ? currentTrack.title : currentPlaylistTrack?.title}
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
              disabled={!isCurrentTrackInPlaylist}
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
            
            <Button 
              size="icon" 
              onClick={() => {
                if (isCurrentTrackInPlaylist) {
                  togglePlay();
                } else {
                  handlePlayTrack(currentPlaylistTrack, currentTrackIndex);
                }
              }}
              className="w-12 h-12"
            >
              {isCurrentTrackInPlaylist && isPlaying ? (
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
              <Button variant="ghost" size="icon">
                <Volume2 className="w-4 h-4" />
              </Button>
              <Slider
                value={[volume]}
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
                    index === currentTrackIndex
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted text-foreground'
                  }`}
                  onClick={() => handlePlayTrack(track, index)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 text-center text-sm">
                      {isCurrentTrackInPlaylist && currentTrack?.src === track.src && isPlaying ? (
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