// GlobalAudioPlayer.utils.ts - Утиліти для глобального аудіо плеєра

import type { Track, MediaSessionMetadata } from './GlobalAudioPlayer.types';

/**
 * Форматує час у секундах до формату MM:SS або HH:MM:SS
 */
export const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

/**
 * Парсить час з формату MM:SS або HH:MM:SS до секунд
 */
export const parseTime = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);
  
  if (parts.length === 2) {
    const [m, s] = parts;
    return m * 60 + s;
  }
  
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return h * 3600 + m * 60 + s;
  }
  
  return 0;
};

/**
 * Перевіряє чи підтримується Media Session API
 */
export const isMediaSessionSupported = (): boolean => {
  return 'mediaSession' in navigator;
};

/**
 * Перевіряє чи підтримується Wake Lock API (для фонового відтворення)
 */
export const isWakeLockSupported = (): boolean => {
  return 'wakeLock' in navigator;
};

/**
 * Оновлює Media Session метадані
 */
export const updateMediaSession = (track: Track): void => {
  if (!isMediaSessionSupported()) return;
  
  const metadata: MediaSessionMetadata = {
    title: track.title,
    artist: track.verseNumber || track.metadata?.artist || 'Vedavoice',
    album: track.metadata?.album,
  };
  
  if (track.metadata?.coverUrl) {
    metadata.artwork = [
      {
        src: track.metadata.coverUrl,
        sizes: '512x512',
        type: 'image/jpeg'
      }
    ];
  }
  
  navigator.mediaSession.metadata = new MediaMetadata(metadata);
};

/**
 * Зберігає плейлист у localStorage
 */
export const savePlaylist = (playlist: Track[], key: string = 'vedavoice_playlist'): void => {
  try {
    localStorage.setItem(key, JSON.stringify(playlist));
  } catch (error) {
    console.error('Failed to save playlist:', error);
  }
};

/**
 * Завантажує плейлист з localStorage
 */
export const loadPlaylist = (key: string = 'vedavoice_playlist'): Track[] => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load playlist:', error);
    return [];
  }
};

/**
 * Зберігає гучність у localStorage
 */
export const saveVolume = (volume: number, key: string = 'vedavoice_volume'): void => {
  try {
    localStorage.setItem(key, volume.toString());
  } catch (error) {
    console.error('Failed to save volume:', error);
  }
};

/**
 * Завантажує гучність з localStorage
 */
export const loadVolume = (defaultVolume: number = 75, key: string = 'vedavoice_volume'): number => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? parseInt(saved, 10) : defaultVolume;
  } catch (error) {
    console.error('Failed to load volume:', error);
    return defaultVolume;
  }
};

/**
 * Отримує MIME тип аудіо файлу з URL
 */
export const getAudioMimeType = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    flac: 'audio/flac',
    webm: 'audio/webm',
  };
  
  return mimeTypes[extension || ''] || 'audio/mpeg';
};

/**
 * Перевіряє чи URL є валідним аудіо файлом
 */
export const isValidAudioUrl = (url: string): boolean => {
  try {
    new URL(url);
    const extension = url.split('.').pop()?.toLowerCase();
    const validExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'webm'];
    return extension ? validExtensions.includes(extension) : false;
  } catch {
    return false;
  }
};

/**
 * Генерує унікальний ID для треку
 */
export const generateTrackId = (url: string, title: string): string => {
  const timestamp = Date.now();
  const hash = `${url}-${title}-${timestamp}`.split('').reduce(
    (acc, char) => ((acc << 5) - acc) + char.charCodeAt(0) | 0,
    0
  );
  return `track-${Math.abs(hash)}`;
};

/**
 * Отримує ім'я файлу з URL
 */
export const getFileNameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.substring(pathname.lastIndexOf('/') + 1);
  } catch {
    return 'Unknown';
  }
};

/**
 * Конвертує File об'єкт до Track об'єкту
 */
export const fileToTrack = (file: File): Promise<Track> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    
    audio.addEventListener('loadedmetadata', () => {
      const track: Track = {
        id: generateTrackId(url, file.name),
        title: file.name.replace(/\.[^/.]+$/, ''), // Видаляє розширення
        src: url,
        duration: audio.duration,
      };
      
      resolve(track);
    });
    
    audio.addEventListener('error', () => {
      reject(new Error('Failed to load audio file'));
    });
  });
};

/**
 * Перемішує масив треків (для shuffle функції)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Отримує прогрес відтворення у відсотках
 */
export const getProgressPercentage = (currentTime: number, duration: number): number => {
  if (!duration || duration === 0) return 0;
  return (currentTime / duration) * 100;
};

/**
 * Розблоковує audio context на iOS
 */
export const unlockAudioContext = (audioElement: HTMLAudioElement): Promise<void> => {
  return new Promise((resolve) => {
    const unlock = () => {
      audioElement.play()
        .then(() => {
          audioElement.pause();
          audioElement.currentTime = 0;
        })
        .catch(() => {})
        .finally(() => {
          document.removeEventListener('touchstart', unlock);
          document.removeEventListener('click', unlock);
          resolve();
        });
    };
    
    document.addEventListener('touchstart', unlock, { once: true });
    document.addEventListener('click', unlock, { once: true });
  });
};

/**
 * Перевіряє чи браузер є iOS Safari
 */
export const isIOSSafari = (): boolean => {
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const webkit = /WebKit/.test(ua);
  const iOSSafari = iOS && webkit && !/CriOS|FxiOS|OPiOS|mercury/.test(ua);
  return iOSSafari;
};

/**
 * Отримує обкладинку з метаданих аудіо файлу (якщо доступно)
 */
export const extractCoverImage = async (audioUrl: string): Promise<string | null> => {
  // Це потребує додаткової бібліотеки типу jsmediatags
  // Поки що повертаємо null, можна додати пізніше
  return null;
};

/**
 * Форматує розмір файлу у читабельний формат
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Debounce функція для оптимізації перемотки
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle функція для оптимізації timeupdate events
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Створює градієнт для обкладинки з кольорів зображення
 */
export const getImageDominantColor = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('#000000');
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let r = 0, g = 0, b = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      
      const pixelCount = data.length / 4;
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);
      
      resolve(`rgb(${r}, ${g}, ${b})`);
    };
    
    img.onerror = () => resolve('#000000');
    img.src = imageUrl;
  });
};
