import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { parseChapterFromEPUBHTML, findChapterFileName } from "@/utils/import/srimad_bhagavatam_epub_parser";
import { mergeSBChapters } from "@/utils/import/srimad_bhagavatam_merger";
import JSZip from "jszip";
import { useNavigate } from "react-router-dom";
import type { ParsedChapter, ParsedVerse } from "@/types/book-import";

const BOOK_ID = "3ab9dbbf-1250-4d3e-84cb-f954baefb0c7"; // Srimad-Bhagavatam
const CANTO_3_ID = "45f1c43d-59c0-4faa-8599-67a52443d967"; // Canto 3

export default function SBCantoImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [startChapter, setStartChapter] = useState(1);
  const [endChapter, setEndChapter] = useState(33);
  const [mergeWithEnglish, setMergeWithEnglish] = useState(true);
  const [autoStarted, setAutoStarted] = useState(false);
  const navigate = useNavigate();

  // Преобробка HTML → текст для нашого парсера (додаємо розриви рядків)
  const htmlToTextForParser = (html: string) => {
    let t = html
      .replace(/<\s*br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "");
    // Зняти всі теги
    t = t.replace(/<[^>]+>/g, "");
    // Прибрати дублікати переносів
    t = t.replace(/\n{2,}/g, "\n");
    return t;
  };

  // Функція для отримання HTML з Vedabase через edge function
  const fetchVedabaseHTML = async (url: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("fetch-html", {
      body: { url },
    });

    if (error) throw new Error(`Failed to fetch ${url}: ${error.message}`);
    if (!data?.html) throw new Error(`No HTML returned from ${url}`);

    return data.html;
  };

  // Парсинг вірша з Vedabase
  const parseVedabaseVerse = (html: string): any => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Базова логіка парсингу (спрощена версія)
    const devanagari = doc.querySelector(".r-devanagari")?.textContent?.trim() || "";
    const transliteration = doc.querySelector(".r-verse-text")?.textContent?.trim() || "";
    const synonyms = doc.querySelector(".r-synonyms")?.textContent?.trim() || "";
    const translation = doc.querySelector(".r-translation")?.textContent?.trim() || "";
    const purport = doc.querySelector(".r-paragraph")?.textContent?.trim() || "";

    return {
      sanskrit: devanagari,
      transliteration_en: transliteration,
      synonyms_en: synonyms,
      translation_en: translation,
      commentary_en: purport,
    };
  };

  // Отримання англійських даних для глави
  const fetchEnglishChapter = async (cantoNum: number, chapterNum: number): Promise<ParsedChapter | null> => {
    const verses: ParsedVerse[] = [];
    
    // Спробуємо отримати до 50 віршів (типова глава має 20-40 віршів)
    for (let verseNum = 1; verseNum <= 50; verseNum++) {
      try {
        const url = `https://vedabase.io/en/library/sb/${cantoNum}/${chapterNum}/${verseNum}`;
        const html = await fetchVedabaseHTML(url);
        const parsed = parseVedabaseVerse(html);
        
        if (!parsed.sanskrit && !parsed.translation_en) {
          // Немає більше віршів
          break;
        }

        verses.push({
          verse_number: verseNum.toString(),
          ...parsed,
        });

        // Затримка між запитами
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error fetching verse ${verseNum}:`, error);
        break;
      }
    }

    if (verses.length === 0) return null;

    return {
      chapter_number: chapterNum,
      chapter_type: "verses",
      title_ua: "",
      title_en: "",
      verses,
    };
  };

  // Збереження глави в БД
  const saveChapterToDB = async (chapter: ParsedChapter) => {
    // 1. Створити chapter запис
    const { data: chapterRecord, error: chapterError } = await supabase
      .from("chapters")
      .insert({
        book_id: BOOK_ID,
        canto_id: CANTO_3_ID,
        chapter_number: chapter.chapter_number,
        chapter_type: "verses",
        title_ua: chapter.title_ua || `Глава ${chapter.chapter_number}`,
        title_en: chapter.title_en || `Chapter ${chapter.chapter_number}`,
        is_published: true,
      })
      .select()
      .maybeSingle();

    if (chapterError) throw chapterError;

    // 2. Підготувати дані віршів
    const versesData = chapter.verses.map((v) => ({
      chapter_id: chapterRecord.id,
      verse_number: v.verse_number || "",
      sanskrit_ua: v.sanskrit || null,
      sanskrit_en: v.sanskrit || null,
      transliteration_ua: v.transliteration_ua || null,
      transliteration_en: v.transliteration_en || null,
      synonyms_ua: v.synonyms_ua || null,
      synonyms_en: v.synonyms_en || null,
      translation_ua: v.translation_ua || null,
      translation_en: v.translation_en || null,
      commentary_ua: v.commentary_ua || null,
      commentary_en: v.commentary_en || null,
      is_published: true,
    }));

    // 3. Вставити вірші батчем
    const { error: versesError } = await supabase.from("verses").insert(versesData);

    if (versesError) throw versesError;

    return { chapterId: chapterRecord.id, versesCount: versesData.length };
  };

  // Основна функція імпорту
  const handleImport = async () => {
    setIsImporting(true);
    setProgress(0);
    setCurrentChapter(0);

    try {
      console.log("📚 Завантаження EPUB файлу...");
      
      const response = await fetch('/epub/UK_SB_3_epub_r1.epub');
      if (!response.ok) throw new Error(`Не вдалося завантажити EPUB: ${response.status}`);
      
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      
      // Завантажити EPUB через JSZip
      const zip = await JSZip.loadAsync(arrayBuffer);
      
      console.log("✅ EPUB завантажено успішно");
      toast.success("EPUB файл завантажено");

      const totalChapters = endChapter - startChapter + 1;
      let importedChapters = 0;
      
      for (let chapterNum = startChapter; chapterNum <= endChapter; chapterNum++) {
        setCurrentChapter(chapterNum);
        console.log(`\n🔵 Імпорт глави ${chapterNum}/${endChapter}`);
        
        try {
          // Витягти HTML з EPUB використовуючи JSZip
          const chapterPath = `OEBPS/${findChapterFileName(3, chapterNum)}`;
          let chapterFile = zip.file(chapterPath);

          // Fallback: інколи шлях без OEBPS або різний регістр
          if (!chapterFile) {
            const altName = findChapterFileName(3, chapterNum);
            chapterFile = zip.file(altName);
          }

          if (!chapterFile) {
            console.warn(`⚠️ Не знайдено файл глави в EPUB: ${chapterPath}`);
            toast.warning(`Глава ${chapterNum} не знайдена в EPUB`);
            importedChapters++;
            setProgress((importedChapters / totalChapters) * 100);
            continue;
          }

          const rawHTML = await chapterFile.async('text');
          // Конвертуємо HTML → текст, щоб парсер бачив роздільники (без штучного префіксу заголовка)
          const textForParser = htmlToTextForParser(rawHTML);
          console.log(`  📄 HTML глави ${chapterNum}: ${textForParser.length} символів (після нормалізації)`);

          // Парсити українські дані
          let uaChapter = parseChapterFromEPUBHTML(textForParser, 3);
          
          if (!uaChapter) {
            toast.warning(`Глава ${chapterNum}: помилка парсингу`);
            importedChapters++;
            setProgress((importedChapters / totalChapters) * 100);
            continue;
          }
          
          console.log(`  ✅ UA: ${uaChapter.verses.length} віршів`);

          let mergedChapter: ParsedChapter | null = uaChapter;
          
          // Якщо UA не розпарсилась або порожня — спробувати EN як основу
          if (!uaChapter || uaChapter.verses.length === 0) {
            try {
              const enChapter = await fetchEnglishChapter(3, chapterNum);
              if (enChapter) {
                mergedChapter = enChapter;
                console.log(`  🔁 UA порожня, використано EN: ${enChapter.verses.length} віршів`);
              } else {
                console.warn(`  ⚠️ Немає даних EN для глави ${chapterNum}`);
              }
            } catch (enErr) {
              console.warn(`  ⚠️ Помилка отримання EN:`, enErr);
            }
          } else if (mergeWithEnglish) {
            try {
              const enChapter = await fetchEnglishChapter(3, chapterNum);
              if (enChapter) {
                mergedChapter = mergeSBChapters(uaChapter, enChapter);
              }
            } catch (enError) {
              console.warn(`  ⚠️ Помилка EN даних:`, enError);
            }
          }

          if (!mergedChapter || mergedChapter.verses.length === 0) {
            toast.warning(`Глава ${chapterNum}: пропущено (немає віршів)`);
          } else {
            const { chapterId, versesCount } = await saveChapterToDB(mergedChapter);
            toast.success(`Глава ${chapterNum}: ${versesCount} віршів`);
          }

        } catch (error: any) {
          console.error(`❌ Помилка глави ${chapterNum}:`, error);
          toast.error(`Глава ${chapterNum}: ${error.message}`);
        }

        importedChapters++;
        setProgress((importedChapters / totalChapters) * 100);
      }

      await supabase.from('cantos').update({ 
        is_published: true,
        title_ua: 'Статус-кво',
        title_en: 'The Status Quo'
      }).eq('id', CANTO_3_ID);

      toast.success(`Імпорт завершено! ${importedChapters} глав`);
      navigate(`/veda-reader/bhagavatam/canto/3`);
    } catch (error: any) {
      console.error("Import error:", error);
      toast.error(`Помилка імпорту: ${error.message}`);
    } finally {
      setIsImporting(false);
      setCurrentChapter(0);
    }
  };

  // Автоматичний запуск імпорту при завантаженні
  useEffect(() => {
    if (!autoStarted && !isImporting) {
      setAutoStarted(true);
      console.log("🚀 Автоматичний запуск імпорту...");
      toast.info("Запуск імпорту автоматично...");
      setTimeout(() => handleImport(), 1000);
    }
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>🕉️ Імпорт Шрімад-Бхаґаватам Пісня 3</CardTitle>
          <CardDescription>
            Імпорт з EPUB файлу UK_SB_3_epub_r1.epub (33 глави)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Діапазон глав */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">Від глави</Label>
              <Input
                id="start"
                type="number"
                min={1}
                max={33}
                value={startChapter}
                onChange={(e) => setStartChapter(parseInt(e.target.value) || 1)}
                disabled={isImporting}
              />
            </div>
            <div>
              <Label htmlFor="end">До глави</Label>
              <Input
                id="end"
                type="number"
                min={1}
                max={33}
                value={endChapter}
                onChange={(e) => setEndChapter(parseInt(e.target.value) || 33)}
                disabled={isImporting}
              />
            </div>
          </div>

          {/* Налаштування */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="merge"
              checked={mergeWithEnglish}
              onChange={(e) => setMergeWithEnglish(e.target.checked)}
              disabled={isImporting}
              className="h-4 w-4"
            />
            <Label htmlFor="merge" className="cursor-pointer">
              Об'єднати з англійськими даними з Vedabase
            </Label>
          </div>

          {/* Прогрес */}
          {isImporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Глава {currentChapter}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Кнопка імпорту */}
          <Button
            onClick={handleImport}
            disabled={isImporting}
            className="w-full"
            size="lg"
          >
            {isImporting ? "⏳ Імпортується..." : "🚀 Розпочати імпорт"}
          </Button>

          {/* Інфо */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>📁 Файл: /epub/UK_SB_3_epub_r1.epub</p>
            <p>📖 Пісня: 3 (Status Quo)</p>
            <p>📄 Всього глав: 33</p>
            <p>⏱️ Очікуваний час: ~30-60 хвилин</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
