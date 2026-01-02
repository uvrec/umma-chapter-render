// ModernGlobalPlayer.tsx - Інтегрована версія для VedaVoice
import React, { useState } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Repeat1, Shuffle, ChevronUp, ChevronDown,
  Heart, Music
} from 'lucide-react';
import { useAudio } from '@/contexts/ModernAudioContext';
import { SleepTimerDialog, SleepTimerIndicator } from '@/components/SleepTimerDialog';

interface ModernGlobalPlayerProps {
  className?: string;
}

export const ModernGlobalPlayer: React.FC<ModernGlobalPlayerProps> = ({ className = '' }) => {
  const [showSleepTimer, setShowSleepTimer] = useState(false);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffled,
    isExpanded,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    setIsExpanded
  } = useAudio();

  // Format time helper
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Progress bar click handler
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = percent * duration;
    seek(newTime);
  };

  // Volume change handler
  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
  };

  // Don't render if no track
  if (!currentTrack) return null;

  return (
    <>
      {/* Backdrop overlay коли розгорнуто */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-xl z-40 transition-opacity"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Main Player Container */}
      <div 
        className={`
          fixed bottom-0 left-0 right-0 z-50
          ${isExpanded ? 'inset-0' : 'h-auto'}
          transition-all duration-300 ease-in-out
          ${className}
        `}
      >
        {/* Expanded View */}
        {isExpanded && (
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-accent/30 to-background p-6 overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition z-10 text-foreground"
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </button>

            {/* Cover Art (Large) */}
            <div className="max-w-md mx-auto mt-16 mb-8">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                {currentTrack.coverImage ? (
                  <img 
                    src={currentTrack.coverImage} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary via-accent to-primary-hover flex items-center justify-center">
                    <Music className="w-20 h-20 text-primary-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Track Info */}
            <div className="max-w-md mx-auto text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2 line-clamp-2">
                {currentTrack.title_ua || currentTrack.title}
              </h2>
              {currentTrack.artist && (
                <p className="text-muted-foreground text-lg mb-1">
                  {currentTrack.artist}
                </p>
              )}
              {(currentTrack.subtitle || currentTrack.title_en) && (
                <p className="text-muted-foreground text-sm">
                  {currentTrack.subtitle || currentTrack.title_en}
                </p>
              )}
            </div>

            {/* Progress Bar (Large) */}
            <div className="max-w-md mx-auto mb-4">
              <div 
                onClick={handleProgressClick}
                className="h-2 bg-foreground/20 rounded-full cursor-pointer group relative"
              >
                <div 
                  className="absolute h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition" />
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Controls (Large) */}
            <div className="max-w-md mx-auto flex items-center justify-center gap-6 mb-8">
              <button 
                onClick={toggleShuffle}
                className={`p-3 rounded-full transition ${
                  isShuffled 
                    ? 'text-primary bg-primary/20' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/10'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button 
                onClick={prevTrack}
                className="p-3 rounded-full hover:bg-foreground/10 transition text-foreground"
              >
                <SkipBack className="w-7 h-7" />
              </button>

              <button 
                onClick={togglePlay}
                className="p-5 rounded-full bg-primary text-primary-foreground hover:scale-105 transition shadow-xl"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>

              <button 
                onClick={nextTrack}
                className="p-3 rounded-full hover:bg-foreground/10 transition text-foreground"
              >
                <SkipForward className="w-7 h-7" />
              </button>

              <button 
                onClick={toggleRepeat}
                className={`p-3 rounded-full transition ${
                  repeatMode !== 'off' 
                    ? 'text-primary bg-primary/20' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/10'
                }`}
              >
                {repeatMode === 'one' ? 
                  <Repeat1 className="w-5 h-5" /> : 
                  <Repeat className="w-5 h-5" />
                }
              </button>
            </div>

            {/* Secondary Controls */}
            <div className="max-w-md mx-auto flex items-center justify-between px-4">
              <button className="text-muted-foreground hover:text-foreground transition">
                <Heart className="w-6 h-6" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleMute} 
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  {isMuted || volume === 0 ? 
                    <VolumeX className="w-5 h-5" /> : 
                    <Volume2 className="w-5 h-5" />
                  }
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-24 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <SleepTimerIndicator onClick={() => setShowSleepTimer(true)} />
            </div>
          </div>
        )}

        {/* Mini Player (Compact) */}
        {!isExpanded && (
          <div className="bg-card/95 backdrop-blur border-t border-border px-4 py-3 safe-bottom">
            <div className="max-w-6xl mx-auto">
              {/* Progress bar (thin) */}
              <div 
                onClick={handleProgressClick}
                className="h-1 bg-muted rounded-full cursor-pointer mb-3 group relative"
              >
                <div 
                  className="absolute h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* Track Info + Cover */}
                <div 
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => setIsExpanded(true)}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                    {currentTrack.coverImage ? (
                      <img 
                        src={currentTrack.coverImage} 
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                        <Music className="w-6 h-6 text-primary-foreground/50" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-card-foreground truncate text-sm">
                      {currentTrack.title_ua || currentTrack.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentTrack.artist || currentTrack.subtitle || currentTrack.title_en || 'VedaVoice'}
                    </p>
                  </div>

                  <button className="md:hidden text-muted-foreground">
                    <ChevronUp className="w-5 h-5" />
                  </button>
                </div>

                {/* Desktop Controls */}
                <div className="hidden md:flex items-center gap-2">
                  <button 
                    onClick={prevTrack}
                    className="p-2 rounded-full hover:bg-muted transition"
                  >
                    <SkipBack className="w-5 h-5 text-card-foreground" />
                  </button>

                  <button 
                    onClick={togglePlay}
                    className="p-2.5 rounded-full bg-primary text-primary-foreground hover:scale-105 transition"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>

                  <button 
                    onClick={nextTrack}
                    className="p-2 rounded-full hover:bg-muted transition"
                  >
                    <SkipForward className="w-5 h-5 text-card-foreground" />
                  </button>
                </div>

                {/* Volume (Desktop only) */}
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    {isMuted || volume === 0 ?
                      <VolumeX className="w-5 h-5" /> :
                      <Volume2 className="w-5 h-5" />
                    }
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => changeVolume(Number(e.target.value))}
                    className="w-20 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Sleep Timer (Desktop) */}
                <div className="hidden md:block">
                  <SleepTimerIndicator onClick={() => setShowSleepTimer(true)} />
                </div>

                {/* Time */}
                <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Mobile Play Button */}
                <button
                  onClick={togglePlay}
                  className="md:hidden p-2 rounded-full bg-primary text-primary-foreground"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sleep Timer Dialog */}
      <SleepTimerDialog
        isOpen={showSleepTimer}
        onClose={() => setShowSleepTimer(false)}
      />
    </>
  );
};

export default ModernGlobalPlayer;