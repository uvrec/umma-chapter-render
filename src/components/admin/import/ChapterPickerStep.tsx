import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ParsedChapter } from '@/types/book-import';
import { BookOpen } from 'lucide-react';

interface ChapterPickerStepProps {
  chapters: ParsedChapter[];
  onNext: (chapter: ParsedChapter) => void;
  onBack: () => void;
}

export function ChapterPickerStep({ chapters, onNext, onBack }: ChapterPickerStepProps) {
  const [selectedChapter, setSelectedChapter] = useState<ParsedChapter | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Крок 3: Вибір глави для імпорту</h2>
        <p className="text-muted-foreground">
          Оберіть одну главу для імпорту. Інші глави можна буде додати пізніше
        </p>
      </div>

      <div className="grid gap-3 max-h-[500px] overflow-y-auto">
        {chapters.map((chapter) => (
          <Card
            key={chapter.chapter_number}
            className={`p-4 cursor-pointer transition-colors ${
              selectedChapter?.chapter_number === chapter.chapter_number
                ? 'border-primary bg-primary/5'
                : ''
            }`}
            onClick={() => setSelectedChapter(chapter)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{chapter.title_ua}</h3>
                  <p className="text-sm text-muted-foreground">
                    {chapter.verses.length} віршів
                  </p>
                </div>
              </div>
              {selectedChapter?.chapter_number === chapter.chapter_number && (
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
