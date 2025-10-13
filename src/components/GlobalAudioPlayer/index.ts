// index.ts - Центральний файл експортів для GlobalAudioPlayer

// Основні компоненти та хуки
export { AudioProvider, GlobalAudioPlayer, useAudio } from './GlobalAudioPlayer';

// TypeScript типи
export type {
  Track,
  RepeatMode,
  AudioContextType,
  GlobalAudioPlayerProps,
  AudioProviderProps,
} from './GlobalAudioPlayer.types';

// Утиліти
export {
  formatTime,
  parseTime,
  isMediaSessionSupported,
  isWakeLockSupported,
  updateMediaSession,
  savePlaylist,
  loadPlaylist,
  saveVolume,
  loadVolume,
  isValidAudioUrl,
  generateTrackId,
  getFileNameFromUrl,
  fileToTrack,
} from './GlobalAudioPlayer.utils';

// Supabase адаптер
export {
  convertSupabaseTrackToPlayerTrack,
  loadTrackFromSupabase,
  loadPlaylistTracks,
  loadRecentTracks,
  trackPlayEvent,
  useSupabasePlaylist,
  useAudioTracking,
} from './GlobalAudioPlayer.supabase-adapter';

// CSS стилі (імпортуйте окремо там де потрібно)
// import '@/components/GlobalAudioPlayer/GlobalAudioPlayer.css';
