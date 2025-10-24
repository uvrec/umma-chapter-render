// src/components/admin/AudioUploadWithMetadata.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAudioMetadata, AudioMetadata } from '@/hooks/useAudioMetadata';
import { Upload, FileAudio, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioUploadWithMetadataProps {
  playlistId: string;
  onUploadComplete?: (trackId: string) => void;
}

interface FileWithMetadata {
  file: File;
  metadata: AudioMetadata | null;
  status: 'pending' | 'uploading' | 'success' | 'error';
  trackId?: string;
  error?: string;
}

export const AudioUploadWithMetadata = ({
  playlistId,
  onUploadComplete,
}: AudioUploadWithMetadataProps) => {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();
  const { isProcessing, progress, extractMetadata, uploadToSupabase, uploadMultiple } = useAudioMetadata();

  // Обробка вибору файлів
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setIsExtracting(true);

    const newFiles: FileWithMetadata[] = [];

    for (const file of selectedFiles) {
      // Перевірка формату
      const validExts = ['.mp3', '.flac', '.ogg', '.m4a', '.wav', '.aac'];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!validExts.includes(ext)) {
        toast({
          title: 'Неправильний формат',
          description: `Файл ${file.name} має неправильний формат`,
          variant: 'destructive',
        });
        continue;
      }

      // Витягуємо метадані
      const metadata = await extractMetadata(file);

      newFiles.push({
        file,
        metadata,
        status: 'pending',
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
    setIsExtracting(false);
    e.target.value = '';
  };

  // Видалення файлу
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Завантаження всіх файлів
  const handleUploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;

      // Оновлюємо статус
      setFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: 'uploading' as const } : f))
      );

      // Завантажуємо
      const result = await uploadToSupabase(files[i].file, playlistId);

      if (result.success && result.track_id) {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: 'success' as const, trackId: result.track_id }
              : f
          )
        );

        toast({
          title: 'Успіх',
          description: `${files[i].file.name} завантажено`,
        });

        if (onUploadComplete && result.track_id) {
          onUploadComplete(result.track_id);
        }
      } else {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: 'error' as const, error: result.error }
              : f
          )
        );

        toast({
          title: 'Помилка',
          description: result.error || 'Не вдалося завантажити файл',
          variant: 'destructive',
        });
      }
    }
  };

  // Форматування тривалості
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Форматування розміру
  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Завантаження аудіофайлів</h3>

      {/* Вибір файлів */}
      <div className="mb-4">
        <input
          type="file"
          multiple
          accept=".mp3,.flac,.ogg,.m4a,.wav,.aac"
          onChange={handleFileSelect}
          disabled={isProcessing || isExtracting}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Підтримувані формати: MP3, FLAC, OGG, M4A, WAV, AAC
        </p>
      </div>

      {/* Індикатор витягування */}
      {isExtracting && (
        <div className="flex items-center gap-2 text-sm mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          Витягування метаданих...
        </div>
      )}

      {/* Список файлів */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Файлів: {files.length} (готово: {files.filter(f => f.status === 'success').length})
            </span>
            <Button
              onClick={handleUploadAll}
              disabled={isProcessing || files.every(f => f.status !== 'pending')}
              size="sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Завантаження...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Завантажити всі
                </>
              )}
            </Button>
          </div>

          {isProcessing && <Progress value={progress} className="h-2" />}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {files.map((item, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-start gap-3">
                  <FileAudio className="h-6 w-6 flex-shrink-0 mt-1" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-medium truncate">
                        {item.metadata?.title || item.file.name}
                      </p>

                      {/* Статус */}
                      {item.status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      )}
                      {item.status === 'error' && (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      )}
                      {item.status === 'uploading' && (
                        <Loader2 className="h-5 w-5 animate-spin flex-shrink-0" />
                      )}
                      {item.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {item.metadata && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        {item.metadata.artist && <p>Виконавець: {item.metadata.artist}</p>}
                        {item.metadata.album && <p>Альбом: {item.metadata.album}</p>}
                        <p>
                          Тривалість: {formatDuration(item.metadata.duration)} • Розмір:{' '}
                          {formatSize(item.file.size)}
                        </p>
                      </div>
                    )}

                    {item.error && (
                      <p className="text-xs text-red-500 mt-1">Помилка: {item.error}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Порожній стан */}
      {files.length === 0 && !isExtracting && (
        <div className="text-center py-12 text-muted-foreground">
          <FileAudio className="h-16 w-16 mx-auto mb-3 opacity-50" />
          <p>Оберіть аудіофайли для завантаження</p>
          <p className="text-sm mt-1">Метадані будуть витягнуті автоматично</p>
        </div>
      )}
    </Card>
  );
};
