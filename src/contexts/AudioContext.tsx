import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { incrementPlayCount } from '@/utils/playbackStats';

interface AudioTrack {
  id: string;
  title: string;
  src: string;
  verseNumber?: string;
}

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (track: AudioTrack) => void;
  togglePlay: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(75);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const countedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let isMounted = true;
    countedRef.current = false;

    const handleLoadedMetadata = () => {
      if (!isMounted) return;
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      if (!isMounted) return;
      setCurrentTime(audio.currentTime);
      
      const d = audio.duration || 0;
      if (!countedRef.current && d > 0 && audio.currentTime / d >= 0.6) {
        if (currentTrack) {
          try {
            incrementPlayCount(currentTrack.id);
          } catch {}
          countedRef.current = true;
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setIsPlaying(false);
      console.error('Global audio player error');
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      isMounted = false;
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
    }
  }, [volume]);

  const playTrack = async (track: AudioTrack) => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      // If same track is playing, just toggle
      if (currentTrack?.src === track.src && isPlaying) {
        audio.pause();
        setIsPlaying(false);
        return;
      }

      setCurrentTrack(track);
      countedRef.current = false;
      
      if (audio.src !== track.src) {
        audio.src = track.src;
        audio.load();
      }

      await audio.play();
      setIsPlaying(true);
      console.log('Playing track:', track.title);
    } catch (error) {
      console.error('Error playing track:', error);
      setIsPlaying(false);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play:', error);
      setIsPlaying(false);
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      setCurrentTrack(null);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const value: AudioContextType = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    playTrack,
    togglePlay,
    stop,
    setVolume,
    seek
  };

  return (
    <AudioContext.Provider value={value}>
      <audio ref={audioRef} preload="metadata" />
      {children}
    </AudioContext.Provider>
  );
};