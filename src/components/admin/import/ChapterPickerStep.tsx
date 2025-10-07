import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ParsedChapter } from '@/types/book-import';
import { BookOpen, FileText } from 'lucide-react';

interface ChapterPickerStepProps {
  chapters: ParsedChapter[];
  onNext: (chapter: ParsedChapter) => void;
  onBack: () => void;
}

export function ChapterPickerStep({ chapters, onNext, onBack }: ChapterPickerStepProps) {
  const [selectedChapter, setSelectedChapter] = useState<ParsedChapter | null>(null);

  // Build visible list without mutating props. Hide text-chapters that also have verse-chapters of the same number.
  const verseChapters = [...chapters.filter(c => c.chapter_type === 'verses')].sort(
    (a, b) => a.chapter_number - b.chapter_number
  );
  const textChapters = chapters.filter(c => c.chapter_type === 'text');
  const verseNumbers = new Set(verseChapters.map(c => c.chapter_number));
  const introTextChapters = [...textChapters]
    .filter(c => !verseNumbers.has(c.chapter_number))
    .sort((a, b) => a.chapter_number - b.chapter_number);

  const visibleChapters = [...introTextChapters, ...verseChapters];
  const versesCount = verseChapters.length;
  const introCount = introTextChapters.length;

  console.log(
    `📋 ChapterPicker: visible ${visibleChapters.length} chapters (${versesCount} verses, ${introCount} intro text)`
  );

  if (visibleChapters.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Крок 3: Вибір глави для імпорту</h2>
          <p className="text-destructive">
            ❌ Не знайдено жодної глави з віршами. Перевірте формат файлу або налаштування шаблону.
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Назад
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Крок 3: Вибір глави для імпорту</h2>
        <p className="text-muted-foreground">
          Знайдено {visibleChapters.length} глав ({versesCount} з віршами, {introCount} текстових вступних). Оберіть одну главу для імпорту.
        </p>
      </div>

      <div className="grid gap-3 max-h-[500px] overflow-y-auto">
        {visibleChapters.map((chapter) => (
          <Card
            key={`${chapter.chapter_type}-${chapter.chapter_number}`}
            className={`p-4 cursor-pointer transition-colors ${
              selectedChapter?.chapter_number === chapter.chapter_number &&
                selectedChapter?.chapter_type === chapter.chapter_type
                ? 'border-primary bg-primary/5'
                : ''
            }`}
            onClick={() => setSelectedChapter(chapter)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {chapter.chapter_type === 'text' ? (
                  <FileText className="w-5 h-5 text-blue-500" />
                ) : (
                  <BookOpen className="w-5 h-5 text-primary" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Глава {chapter.chapter_number}
                    {chapter.chapter_type === 'text' && ' (текстова)'}
                  </p>
                  <h3 className="font-semibold">{chapter.title_ua}</h3>
                  <p className="text-sm text-muted-foreground">
                    {chapter.chapter_type === 'verses' 
                      ? `${chapter.verses.length} віршів`
                      : `Текстова глава (${chapter.content_ua?.length || 0} символів)`
                    }
                  </p>
                </div>
              </div>
              {selectedChapter?.chapter_number === chapter.chapter_number &&
                selectedChapter?.chapter_type === chapter.chapter_type && (
                <div className="text-primary font-semibold">Обрано</div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Назад
        </Button>
        <Button onClick={() => selectedChapter && onNext(selectedChapter)} disabled={!selectedChapter}>
          Далі: Попередній перегляд
        </Button>
      </div>
    </div>
  );
}
