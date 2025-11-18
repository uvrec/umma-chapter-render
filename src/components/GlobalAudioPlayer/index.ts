// index.ts - Центральний файл експортів для GlobalAudioPlayer

// Основні компоненти та хуки (імпортуються з ModernAudioContext)
export { useAudio } from '@/contexts/ModernAudioContext';

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

// Кастомні хуки
export {
  usePlaybackProgress,
  useVolumeControl,
  useRepeatMode,
  usePlaylistNavigation,
  usePlaylistPersistence,
  usePlaybackHistory,
  useLoadingState,
  usePlayerKeyboardShortcuts,
  usePlaybackRate,
  useShufflePlaylist,
  usePlaylistFilter,
  useSleepTimer,
} from './GlobalAudioPlayer.hooks';

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
