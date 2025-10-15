// GlobalAudioPlayer.types.ts - Типи для глобального аудіо плеєра

export interface Track {
  /** Унікальний ідентифікатор треку */
  id: string;
  
  /** Назва треку */
  title: string;
  
  /** Опис або номер вірша (опціонально) */
  verseNumber?: string;

  /** URL аудіо файлу */
  src: string;

  /** Тривалість у секундах (опціонально, визначається автоматично) */
  duration?: number;

  /** Додаткові метадані (опціонально) */
  metadata?: {
    artist?: string;
    album?: string;
    year?: number;
    genre?: string;
    coverUrl?: string;
    playlistTitle?: string;
  };
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface AudioContextType {
  /** Поточний плейлист */
  playlist: Track[];
  
  /** Індекс поточного треку в плейлисті */
  currentIndex: number | null;
  
  /** Поточний трек */
  currentTrack: Track | null;
  
  /** Статус відтворення */
  isPlaying: boolean;
  
  /** Поточна позиція у секундах */
  currentTime: number;
  
  /** Загальна тривалість у секундах */
  duration: number;
  
  /** Гучність від 0 до 100 */
  volume: number;
  
  /** Режим повтору */
  repeatMode: RepeatMode;
  
  /**
   * Відтворити трек
   * Якщо трек вже є в плейлисті - перемикається на нього
   * Якщо ні - додає до плейлиста і починає відтворення
   */
  playTrack: (track: Track) => void;
  
  /**
   * Перемикає відтворення/паузу
   */
  togglePlay: () => void;
  
  /**
   * Зупиняє відтворення та скидає позицію
   */
  stop: () => void;
  
  /**
   * Переміщує позицію відтворення
   * @param time - позиція у секундах
   */
  seek: (time: number) => void;
  
  /**
   * Встановлює гучність
   * @param volume - гучність від 0 до 100
   */
  setVolume: (volume: number) => void;
  
  /**
   * Переключає на попередній трек
   */
  prevTrack: () => void;
  
  /**
   * Переключає на наступний трек
   */
  nextTrack: () => void;
  
  /**
   * Додає трек до плейлиста без відтворення
   */
  addToPlaylist: (track: Track) => void;

  /**
   * Додає трек до черги (alias для addToPlaylist)
   */
  addToQueue: (track: {
    id: string;
    title: string;
    src: string;
    verseNumber?: string;
    duration?: number;
    metadata?: Track["metadata"];
  }) => void;

  /**
   * Встановлює весь плейлист
   */
  setQueue: (tracks: Track[]) => void;
  
  /**
   * Видаляє трек з плейлиста за індексом
   */
  removeFromPlaylist: (index: number) => void;
  
  /**
   * Очищає весь плейлист та зупиняє відтворення
   */
  clearPlaylist: () => void;
}

export interface GlobalAudioPlayerProps {
  /** Початкова гучність (0-100) */
  initialVolume?: number;
  
  /** Початковий режим повтору */
  initialRepeatMode?: RepeatMode;
  
  /** Чи показувати плеєр відразу */
  initiallyVisible?: boolean;
  
  /** Кастомний клас для контейнера плеєра */
  className?: string;
}

export interface MediaSessionMetadata {
  title: string;
  artist?: string;
  album?: string;
  artwork?: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
}

export interface AudioProviderProps {
  children: React.ReactNode;
  
  /** Чи зберігати плейлист у localStorage */
  persistPlaylist?: boolean;
  
  /** Ключ для localStorage */
  storageKey?: string;
  
  /** Callback при зміні треку */
  onTrackChange?: (track: Track | null) => void;
  
  /** Callback при зміні статусу відтворення */
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export interface PlaylistItemProps {
  track: Track;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  onRemove: (index: number) => void;
  onPlay: (index: number) => void;
}

export interface PlayerControlsProps {
  isPlaying: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  repeatMode: RepeatMode;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleRepeat: () => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export interface CoverImageProps {
  src?: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
}

// Константи
export const REPEAT_MODES: RepeatMode[] = ['off', 'all', 'one'];

export const DEFAULT_VOLUME = 75;

export const STORAGE_KEYS = {
  PLAYLIST: 'vedavoice_playlist',
  VOLUME: 'vedavoice_volume',
  REPEAT_MODE: 'vedavoice_repeat_mode',
} as const;

// Utility types
export type PartialTrack = Partial<Track> & Pick<Track, 'id' | 'title' | 'src'>;

export type TrackUpdatePayload = Partial<Omit<Track, 'id'>> & Pick<Track, 'id'>;
