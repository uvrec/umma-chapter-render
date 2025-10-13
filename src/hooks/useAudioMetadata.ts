// src/hooks/useAudioMetadata.ts
import { useState } from 'react';

export interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  album_artist?: string;
  year?: number;
  genre?: string;
  track_number?: number;
  duration?: number;
  bitrate?: number;
  sample_rate?: number;
  channels?: number;
  file_size?: number;
  format?: string;
  cover_art?: string; // base64
}

export interface UploadResult {
  success: boolean;
  track_id?: string;
  public_url?: string;
  cover_url?: string;
  error?: string;
}

export const useAudioMetadata = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  /**
   * Витягує метадані з файлу без завантаження
   */
  const extractMetadata = async (file: File): Promise<AudioMetadata | null> => {
    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch(`${API_URL}/extract-metadata`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract metadata');
      }

      return await response.json();
    } catch (error) {
      console.error('Error extracting metadata:', error);
      return null;
    }
  };

  /**
   * Завантажує файл в Supabase з метаданими
   */
  const uploadToSupabase = async (
    file: File,
    playlistId: string
  ): Promise<UploadResult> => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('playlist_id', playlistId);

      setProgress(30);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      setProgress(70);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      setProgress(100);

      return result;
    } catch (error: any) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  /**
   * Пакетне завантаження кількох файлів
   */
  const uploadMultiple = async (
    files: File[],
    playlistId: string
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];

    for (const file of files) {
      const result = await uploadToSupabase(file, playlistId);
      results.push(result);
    }

    return results;
  };

  return {
    isProcessing,
    progress,
    extractMetadata,
    uploadToSupabase,
    uploadMultiple,
  };
};
