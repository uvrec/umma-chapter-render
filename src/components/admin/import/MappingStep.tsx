import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { BOOK_TEMPLATES, ImportTemplate, ParsedChapter } from '@/types/book-import';
import { splitIntoChapters, customSplitByRegex } from '@/utils/import/splitters';
import { toast } from 'sonner';

interface MappingStepProps {
  extractedText: string;
  onNext: (template: ImportTemplate, chapters: ParsedChapter[]) => void;
  onBack: () => void;
}

export function MappingStep({ extractedText, onNext, onBack }: MappingStepProps) {
  const [templateId, setTemplateId] = useState<string>('bhagavad-gita');
  const [isCustom, setIsCustom] = useState(false);
  const [customRegex, setCustomRegex] = useState({
    verse: '^(?:ТЕКСТ|TEXT)\\s+(\\d+)',
    synonyms: '^(?:ПОСЛІВНИЙ ПЕРЕКЛАД|WORD FOR WORD)',
    translation: '^(?:ПЕРЕКЛАД|TRANSLATION)',
    commentary: '^(?:ПОЯСНЕННЯ|PURPORT)',
  });

  const handleNext = () => {
    try {
      // Validate custom regex patterns
      if (isCustom) {
        try {
          new RegExp(customRegex.verse, 'mi');
          new RegExp(customRegex.synonyms, 'mi');
          new RegExp(customRegex.translation, 'mi');
          new RegExp(customRegex.commentary, 'mi');
        } catch (regexError) {
          toast.error('Невалідний regex патерн: ' + (regexError as Error).message);
          return;
        }
      }

      let chapters: ParsedChapter[];
      let template: ImportTemplate;

      if (isCustom) {
        template = {
          id: 'custom',
          name: 'Користувацький',
          versePattern: new RegExp(customRegex.verse, 'mi'),
          synonymsPattern: new RegExp(customRegex.synonyms, 'mi'),
          translationPattern: new RegExp(customRegex.translation, 'mi'),
          commentaryPattern: new RegExp(customRegex.commentary, 'mi'),
          chapterPattern: /^(?:РОЗДІЛ|CHAPTER)\s+(\d+)/mi,
        };
        chapters = splitIntoChapters(extractedText, template);
      } else {
        template = BOOK_TEMPLATES.find(t => t.id === templateId)!;
        chapters = splitIntoChapters(extractedText, template);
      }

      console.log('Parsed chapters:', chapters.length);
      chapters.forEach((ch, i) => {
        console.log(`Chapter ${i + 1}: ${ch.verses.length} verses`);
      });

      if (chapters.length === 0) {
        toast.error('Не вдалося знайти жодної глави. Спробуйте інший шаблон або текст');
        return;
      }

      const totalVerses = chapters.reduce((sum, ch) => sum + ch.verses.length, 0);
      if (totalVerses === 0) {
        toast.error('Не вдалося знайти вірші. Перевірте налаштування шаблону');
        return;
      }

      // Show preview info
      const firstVerse = chapters[0]?.verses[0];
      if (firstVerse) {
        console.log('First verse preview:', {
          number: firstVerse.verse_number,
          sanskrit: firstVerse.sanskrit?.substring(0, 50),
          hasTranslation: !!firstVerse.translation_ua,
        });
      }

      toast.success(`Знайдено ${chapters.length} розділів з ${totalVerses} віршами`);
      onNext(template, chapters);
    } catch (error) {
      console.error('Error parsing text:', error);
      toast.error('Помилка при обробці тексту: ' + (error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Крок 2: Налаштування структури</h2>
        <p className="text-muted-foreground">
          Оберіть шаблон книги або налаштуйте власні правила розбору
        </p>
      </div>

      <RadioGroup value={isCustom ? 'custom' : 'template'} onValueChange={(v) => setIsCustom(v === 'custom')}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="template" id="template" />
            <Label htmlFor="template">Використати готовий шаблон</Label>
          </div>

          {!isCustom && (
            <div className="ml-6 space-y-2">
              {BOOK_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    templateId === template.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setTemplateId(template.id)}
                >
                  <h3 className="font-semibold">{template.name}</h3>
                </Card>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom">Налаштувати власні правила (regex)</Label>
          </div>

          {isCustom && (
            <div className="ml-6 space-y-4">
              <div>
                <Label>Початок вірша (regex)</Label>
                <Input
                  value={customRegex.verse}
                  onChange={(e) => setCustomRegex({ ...customRegex, verse: e.target.value })}
                  placeholder="^ТЕКСТ\s+(\d+)"
                />
              </div>
              <div>
                <Label>Початок синонімів (regex)</Label>
                <Input
                  value={customRegex.synonyms}
                  onChange={(e) => setCustomRegex({ ...customRegex, synonyms: e.target.value })}
                  placeholder="^ПОСЛІВНИЙ ПЕРЕКЛАД"
                />
              </div>
              <div>
                <Label>Початок перекладу (regex)</Label>
                <Input
                  value={customRegex.translation}
                  onChange={(e) => setCustomRegex({ ...customRegex, translation: e.target.value })}
                  placeholder="^ПЕРЕКЛАД"
                />
              </div>
              <div>
                <Label>Початок пояснення (regex)</Label>
                <Input
                  value={customRegex.commentary}
                  onChange={(e) => setCustomRegex({ ...customRegex, commentary: e.target.value })}
                  placeholder="^ПОЯСНЕННЯ"
                />
              </div>
            </div>
          )}
        </div>
      </RadioGroup>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Назад
        </Button>
        <Button onClick={handleNext}>
          Далі: Вибір глави
        </Button>
      </div>
    </div>
  );
}
