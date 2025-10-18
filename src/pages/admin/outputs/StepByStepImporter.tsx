// src/pages/admin/StepByStepImporter.tsx
// Поетапний імпортер: завантажує контент покроково для кращого контролю

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useSupabaseClient } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check, AlertCircle } from "lucide-react";

type ImportStep = 
  | "sanskrit" 
  | "transliteration" 
  | "synonyms" 
  | "translation" 
  | "commentary"
  | "full_content"; // Для лекцій/листів

interface StepResult {
  step: ImportStep;
  success: boolean;
  count: number;
  errors: string[];
}

export default function StepByStepImporter() {
  const supabase = useSupabaseClient();
  
  const [url, setUrl] = useState("");
  const [bookId, setBookId] = useState("");
  const [chapterNumber, setChapterNumber] = useState("1");
  const [isLecture, setIsLecture] = useState(false);
  
  const [isImporting, setIsImporting] = useState(false);
  const [currentStep, setCurrentStep] = useState<ImportStep | null>(null);
  const [results, setResults] = useState<StepResult[]>([]);
  const [progress, setProgress] = useState(0);

  const steps: ImportStep[] = isLecture 
    ? ["full_content"]
    : ["sanskrit", "transliteration", "synonyms", "translation", "commentary"];

  /**
   * Завантажує HTML сторінки
   */
  const fetchHTML = async (pageUrl: string): Promise<string> => {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(pageUrl)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
    return await response.text();
  };

  /**
   * Парсить тільки санскрит з HTML
   */
  const parseSanskritOnly = (html: string): Map<string, string> => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const verses = new Map<string, string>();

    // Шукаємо TEXT X блоки
    const textPattern = /TEXT\s+(\d+)/gi;
    const matches = Array.from(html.matchAll(textPattern));

    matches.forEach((match, i) => {
      const verseNum = match[1];
      const startPos = match.index! + match[0].length;
      const endPos = i < matches.length - 1 ? matches[i + 1].index! : html.length;
      const content = html.substring(startPos, endPos);

      // Шукаємо деванагарі
      const devanagariMatch = content.match(/[\u0900-\u097F\u0980-\u09FF]+[^\n]*/);
      if (devanagariMatch) {
        verses.set(verseNum, devanagariMatch[0].trim());
      }
    });

    return verses;
  };

  /**
   * Парсить тільки транслітерацію
   */
  const parseTransliterationOnly = (html: string): Map<string, string> => {
    const verses = new Map<string, string>();
    const textPattern = /TEXT\s+(\d+)/gi;
    const matches = Array.from(html.matchAll(textPattern));

    matches.forEach((match, i) => {
      const verseNum = match[1];
      const startPos = match.index! + match[0].length;
      const endPos = i < matches.length - 1 ? matches[i + 1].index! : html.length;
      const content = html.substring(startPos, endPos);

      // Шукаємо транслітерацію (латиниця з діакритикою)
      const lines = content.split(/\n/);
      for (const line of lines) {
        if (/[āīūṛṝḷḹēōṁṃḥṅñṭḍṇśṣ]/i.test(line) && line.length > 10) {
          verses.set(verseNum, line.trim());
          break;
        }
      }
    });

    return verses;
  };

  /**
   * Парсить тільки synonyms
   */
  const parseSynonymsOnly = (html: string): Map<string, string> => {
    const verses = new Map<string, string>();
    const textPattern = /TEXT\s+(\d+)/gi;
    const matches = Array.from(html.matchAll(textPattern));

    matches.forEach((match, i) => {
      const verseNum = match[1];
      const startPos = match.index! + match[0].length;
      const endPos = i < matches.length - 1 ? matches[i + 1].index! : html.length;
      const content = html.substring(startPos, endPos);

      const synonymsMatch = content.match(/SYNONYMS?\s*\n([\s\S]*?)(?=TRANSLATION|$)/i);
      if (synonymsMatch) {
        verses.set(verseNum, synonymsMatch[1].trim());
      }
    });

    return verses;
  };

  /**
   * Парсить тільки переклад
   */
  const parseTranslationOnly = (html: string): Map<string, string> => {
    const verses = new Map<string, string>();
    const textPattern = /TEXT\s+(\d+)/gi;
    const matches = Array.from(html.matchAll(textPattern));

    matches.forEach((match, i) => {
      const verseNum = match[1];
      const startPos = match.index! + match[0].length;
      const endPos = i < matches.length - 1 ? matches[i + 1].index! : html.length;
      const content = html.substring(startPos, endPos);

      const translationMatch = content.match(/TRANSLATION\s*\n([\s\S]*?)(?=PURPORT|COMMENTARY|$)/i);
      if (translationMatch) {
        verses.set(verseNum, translationMatch[1].trim());
      }
    });

    return verses;
  };

  /**
   * Парсить тільки коментар
   */
  const parseCommentaryOnly = (html: string): Map<string, string> => {
    const verses = new Map<string, string>();
    const textPattern = /TEXT\s+(\d+)/gi;
    const matches = Array.from(html.matchAll(textPattern));

    matches.forEach((match, i) => {
      const verseNum = match[1];
      const startPos = match.index! + match[0].length;
      const endPos = i < matches.length - 1 ? matches[i + 1].index! : html.length;
      const content = html.substring(startPos, endPos);

      const commentaryMatch = content.match(/(?:PURPORT|COMMENTARY)\s*\n([\s\S]+)$/i);
      if (commentaryMatch) {
        verses.set(verseNum, commentaryMatch[1].trim());
      }
    });

    return verses;
  };

  /**
   * Парсить весь контент для лекції/листа
   */
  const parseFullContent = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    // Шукаємо основний контент
    let content = "";
    
    const contentSelectors = [
      'article',
      '[class*="content"]',
      '[class*="transcript"]',
      'main',
      '.lecture-text',
      '#content'
    ];

    for (const selector of contentSelectors) {
      const element = doc.querySelector(selector);
      if (element && element.textContent && element.textContent.length > 100) {
        content = element.textContent.trim();
        break;
      }
    }

    // Якщо не знайшли через селектори, беремо body
    if (!content) {
      const body = doc.querySelector('body');
      if (body) {
        // Видаляємо скрипти, стилі, навігацію
        const nav = body.querySelectorAll('nav, header, footer, script, style, .navigation');
        nav.forEach(el => el.remove());
        content = body.textContent?.trim() || "";
      }
    }

    return content;
  };

  /**
   * Імпортує один крок
   */
  const importStep = async (step: ImportStep): Promise<StepResult> => {
    setCurrentStep(step);
    
    try {
      const html = await fetchHTML(url);
      
      if (step === "full_content") {
        // Лекції/листи - імпортуємо як chapter з content_en
        const content = parseFullContent(html);
        
        if (!content) {
          throw new Error("Не вдалося витягти контент з сторінки");
        }

        // Створюємо або оновлюємо главу
        const { error } = await supabase
          .from("chapters")
          .upsert({
            book_id: bookId,
            chapter_number: parseInt(chapterNumber),
            chapter_type: "text",
            content_en: content,
            title_en: `Lecture ${chapterNumber}`,
            title_ua: `Лекція ${chapterNumber}`,
          });

        if (error) throw error;

        return {
          step,
          success: true,
          count: 1,
          errors: [],
        };
      }

      // Вірші - імпортуємо покроково
      let data: Map<string, string>;
      let fieldName: string;

      switch (step) {
        case "sanskrit":
          data = parseSanskritOnly(html);
          fieldName = "sanskrit";
          break;
        case "transliteration":
          data = parseTransliterationOnly(html);
          fieldName = "transliteration";
          break;
        case "synonyms":
          data = parseSynonymsOnly(html);
          fieldName = "synonyms_en";
          break;
        case "translation":
          data = parseTranslationOnly(html);
          fieldName = "translation_en";
          break;
        case "commentary":
          data = parseCommentaryOnly(html);
          fieldName = "commentary_en";
          break;
        default:
          throw new Error(`Unknown step: ${step}`);
      }

      const errors: string[] = [];
      let successCount = 0;

      // Оновлюємо кожен вірш
      for (const [verseNum, value] of data.entries()) {
        try {
          // Спочатку знайдемо ID глави
          const { data: chapter } = await supabase
            .from("chapters")
            .select("id")
            .eq("book_id", bookId)
            .eq("chapter_number", parseInt(chapterNumber))
            .single();

          if (!chapter) {
            errors.push(`Chapter ${chapterNumber} not found`);
            continue;
          }

          // Оновлюємо або створюємо вірш
          const { error } = await supabase
            .from("verses")
            .upsert({
              chapter_id: chapter.id,
              verse_number: verseNum,
              [fieldName]: value,
            }, {
              onConflict: "chapter_id,verse_number"
            });

          if (error) {
            errors.push(`Verse ${verseNum}: ${error.message}`);
          } else {
            successCount++;
          }
        } catch (e: any) {
          errors.push(`Verse ${verseNum}: ${e.message}`);
        }
      }

      return {
        step,
        success: errors.length === 0,
        count: successCount,
        errors,
      };

    } catch (e: any) {
      return {
        step,
        success: false,
        count: 0,
        errors: [e.message],
      };
    }
  };

  /**
   * Запускає весь процес поетапного імпорту
   */
  const handleStartImport = async () => {
    if (!url || !bookId || !chapterNumber) {
      toast({
        title: "Помилка",
        description: "Заповніть всі поля",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setResults([]);
    setProgress(0);

    const stepResults: StepResult[] = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const result = await importStep(step);
      stepResults.push(result);
      setResults([...stepResults]);
      setProgress(((i + 1) / steps.length) * 100);
    }

    setCurrentStep(null);
    setIsImporting(false);

    const allSuccess = stepResults.every(r => r.success);
    toast({
      title: allSuccess ? "✅ Імпорт завершено" : "⚠️ Імпорт завершено з помилками",
      description: `Оброблено ${stepResults.length} кроків`,
      variant: allSuccess ? "default" : "destructive",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Поетапний імпорт</h1>
          <p className="text-muted-foreground mt-2">
            Імпортує контент покроково: спочатку санскрит, потім транслітерацію, тощо
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label>URL сторінки Vedabase</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://vedabase.io/en/library/bg/1/"
              />
            </div>

            <div>
              <Label>Book ID (UUID)</Label>
              <Input
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                placeholder="123e4567-e89b-12d3-a456-426614174000"
              />
            </div>

            <div>
              <Label>Номер глави/лекції</Label>
              <Input
                type="number"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(e.target.value)}
                min="1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isLecture"
                checked={isLecture}
                onChange={(e) => setIsLecture(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="isLecture" className="cursor-pointer">
                Це лекція/лист (імпортувати весь текст одразу)
              </Label>
            </div>

            <Button 
              onClick={handleStartImport} 
              disabled={isImporting}
              className="w-full"
              size="lg"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Імпорт... {Math.round(progress)}%
                </>
              ) : (
                "Почати поетапний імпорт"
              )}
            </Button>

            {isImporting && (
              <div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  {currentStep && `Зараз: ${currentStep}`}
                </p>
              </div>
            )}
          </div>
        </Card>

        {results.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Результати</h2>
            <div className="space-y-3">
              {results.map((result, i) => (
                <div 
                  key={i}
                  className={`p-4 rounded-lg border ${
                    result.success 
                      ? "bg-green-50 border-green-200" 
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium capitalize">{result.step}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {result.count} оброблено
                    </span>
                  </div>
                  
                  {result.errors.length > 0 && (
                    <div className="mt-2 text-sm text-red-600">
                      <p className="font-medium">Помилки:</p>
                      <ul className="list-disc ml-5 mt-1">
                        {result.errors.slice(0, 3).map((err, j) => (
                          <li key={j}>{err}</li>
                        ))}
                        {result.errors.length > 3 && (
                          <li>...та ще {result.errors.length - 3}</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
