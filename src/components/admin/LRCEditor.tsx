/**
 * LRCEditor - Адмін інструмент для створення та редагування LRC timestamps
 *
 * Функції:
 * - Програвання аудіо з візуалізацією прогресу
 * - Клавіша Space для встановлення мітки на поточному рядку
 * - Імпорт/експорт LRC формату
 * - Збереження в базу даних
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Download, Upload, Save, Trash2, Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { generateSmartTimestamps } from '@/lib/autoTimestampGenerator';

interface LRCLine {
  time: number | null; // null = не встановлено
  text: string;
}

interface LRCEditorProps {
  verseId: string;
  audioUrl: string;
  initialText: string; // Текст для синхронізації (санскрит, переклад і т.д.)
  initialLRC?: string; // Існуючий LRC контент
  section?: 'sanskrit' | 'transliteration' | 'synonyms' | 'translation' | 'commentary';
  onSave?: (lrcContent: string) => void;
  onCancel?: () => void;
}

export function LRCEditor({
  verseId,
  audioUrl,
  initialText,
  initialLRC,
  section = 'sanskrit',
  onSave,
  onCancel,
}: LRCEditorProps) {
  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Editor state
  const [lines, setLines] = useState<LRCLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  // Auto-generation state
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);

  // Auto-generate timestamps using audio analysis
  const autoGenerate = useCallback(async () => {
    if (!audioUrl || lines.length === 0) return;

    setIsAutoGenerating(true);
    try {
      const text = lines.map(l => l.text).join('\n');
      const { lrc } = await generateSmartTimestamps(audioUrl, text, section);
      const parsed = parseLRC(lrc);
      setLines(parsed);
      setCurrentLineIndex(0);
      toast.success(`Автоматично згенеровано ${parsed.filter(l => l.time !== null).length} міток`);
    } catch (error) {
      console.error('Auto-generation failed:', error);
      toast.error('Помилка автогенерації. Спробуйте ще раз.');
    } finally {
      setIsAutoGenerating(false);
    }
  }, [audioUrl, lines, section]);

  // Initialize lines from text or LRC
  useEffect(() => {
    if (initialLRC) {
      // Parse existing LRC
      const parsed = parseLRC(initialLRC);
      setLines(parsed);
    } else {
      // Create lines from text
      const textLines = initialText
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);
      setLines(textLines.map(text => ({ time: null, text })));
    }
  }, [initialText, initialLRC]);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if editing text
      if (isEditing) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (currentLineIndex < lines.length) {
          // Set timestamp for current line
          setLines(prev => prev.map((line, i) =>
            i === currentLineIndex
              ? { ...line, time: currentTime }
              : line
          ));
          // Move to next line
          setCurrentLineIndex(prev => Math.min(prev + 1, lines.length - 1));
        }
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setCurrentLineIndex(prev => Math.max(0, prev - 1));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setCurrentLineIndex(prev => Math.min(lines.length - 1, prev + 1));
      } else if (e.code === 'Backspace' && e.shiftKey) {
        e.preventDefault();
        // Clear current line timestamp
        setLines(prev => prev.map((line, i) =>
          i === currentLineIndex ? { ...line, time: null } : line
        ));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLineIndex, currentTime, lines.length, isEditing]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Seek to time
  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  // Reset all timestamps
  const resetTimestamps = useCallback(() => {
    setLines(prev => prev.map(line => ({ ...line, time: null })));
    setCurrentLineIndex(0);
    seekTo(0);
    toast.info('Всі мітки скинуто');
  }, [seekTo]);

  // Export to LRC format
  const exportLRC = useCallback(() => {
    const lrcContent = generateLRC(lines);
    return lrcContent;
  }, [lines]);

  // Download LRC file
  const downloadLRC = useCallback(() => {
    const lrcContent = exportLRC();
    const blob = new Blob([lrcContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${verseId}_${section}.lrc`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('LRC файл завантажено');
  }, [exportLRC, verseId, section]);

  // Import LRC from file
  const importLRC = useCallback((content: string) => {
    const parsed = parseLRC(content);
    setLines(parsed);
    toast.success('LRC імпортовано');
  }, []);

  // Handle file input
  const handleFileImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      importLRC(content);
    };
    reader.readAsText(file);
  }, [importLRC]);

  // Save handler
  const handleSave = useCallback(() => {
    const lrcContent = exportLRC();
    if (onSave) {
      onSave(lrcContent);
    }
    toast.success('LRC збережено');
  }, [exportLRC, onSave]);

  // Format time as MM:SS.CC
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`;
  };

  // Progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>LRC Editor — {section}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              Скасувати
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Зберегти
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Audio Player */}
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <span className="text-sm font-mono w-24">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div
              className="flex-1 h-2 bg-muted rounded-full cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = x / rect.width;
                seekTo(percent * duration);
              }}
            >
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow"
                style={{ left: `${progressPercent}%`, marginLeft: '-6px' }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={autoGenerate}
            disabled={isAutoGenerating || lines.length === 0}
          >
            {isAutoGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            {isAutoGenerating ? 'Аналіз аудіо...' : 'Автогенерація'}
          </Button>

          <Button variant="outline" size="sm" onClick={resetTimestamps}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Скинути мітки
          </Button>

          <Button variant="outline" size="sm" onClick={downloadLRC}>
            <Download className="h-4 w-4 mr-2" />
            Експорт LRC
          </Button>

          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Імпорт LRC
              </span>
            </Button>
            <input
              type="file"
              accept=".lrc,.txt"
              className="hidden"
              onChange={handleFileImport}
            />
          </label>

          <div className="ml-auto text-sm text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Space</kbd> — мітка |{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↑↓</kbd> — навігація |{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift+Backspace</kbd> — скинути
          </div>
        </div>

        {/* Lines Editor */}
        <div className="border rounded-lg max-h-80 overflow-y-auto">
          {lines.map((line, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrentLineIndex(index);
                if (line.time !== null) {
                  seekTo(line.time);
                }
              }}
              className={cn(
                'flex items-center gap-3 px-3 py-2 border-b last:border-b-0 cursor-pointer transition-colors',
                index === currentLineIndex && 'bg-primary/10',
                line.time !== null && 'bg-green-50 dark:bg-green-900/20'
              )}
            >
              {/* Timestamp */}
              <span className={cn(
                'font-mono text-sm w-20',
                line.time !== null ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
              )}>
                {line.time !== null ? `[${formatTime(line.time)}]` : '[  ---  ]'}
              </span>

              {/* Text */}
              <span className="flex-1">{line.text}</span>

              {/* Clear button */}
              {line.time !== null && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLines(prev => prev.map((l, i) =>
                      i === index ? { ...l, time: null } : l
                    ));
                  }}
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Raw LRC Preview */}
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
            Переглянути LRC
          </summary>
          <Textarea
            readOnly
            value={exportLRC()}
            className="mt-2 font-mono text-xs h-32"
          />
        </details>
      </CardContent>
    </Card>
  );
}

// Helper: Parse LRC to lines
function parseLRC(lrcContent: string): LRCLine[] {
  const lines: LRCLine[] = [];
  const lineRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.+)/;

  for (const line of lrcContent.split('\n')) {
    const match = line.match(lineRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3].padEnd(3, '0'), 10);
      const time = minutes * 60 + seconds + milliseconds / 1000;
      lines.push({ time, text: match[4].trim() });
    } else if (line.trim()) {
      // Line without timestamp
      lines.push({ time: null, text: line.trim() });
    }
  }

  return lines;
}

// Helper: Generate LRC from lines
function generateLRC(lines: LRCLine[]): string {
  return lines
    .map(line => {
      if (line.time === null) {
        return line.text; // No timestamp
      }
      const mins = Math.floor(line.time / 60);
      const secs = line.time % 60;
      const timeStr = `${String(mins).padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`;
      return `[${timeStr}]${line.text}`;
    })
    .join('\n');
}

export default LRCEditor;
