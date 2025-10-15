// src/pages/admin/WebImport.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Download, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { parseChapterFromWeb } from "@/utils/import/webImporter";
import { importSingleChapter } from "@/utils/import/importer";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function WebImport() {
  const { toast } = useToast();

  const [books, setBooks] = useState<any[]>([]);
  const [cantos, setCantos] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedCanto, setSelectedCanto] = useState<string>("");
  const [chapterNumber, setChapterNumber] = useState<string>("1");
  const [verseRange, setVerseRange] = useState<string>("1-64, 65-66, 67-96, 97-98, 99-110");
  const [chapterTitleUa, setChapterTitleUa] = useState<string>("");
  const [chapterTitleEn, setChapterTitleEn] = useState<string>("");
  const [vedabaseUrl, setVedabaseUrl] = useState<string>("https://vedabase.io/en/library/cc/adi/1/");
  const [gitabaseUrl, setGitabaseUrl] = useState<string>("https://gitabase.com/ukr/CC/1/1");
  const [isImporting, setIsImporting] = useState(false);
  const [parsingProgress, setParsingProgress] = useState<number>(0);
  const [parsingStatus, setParsingStatus] = useState<string>("");
  const [useServerParser, setUseServerParser] = useState<boolean>(true);

  const loadBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("id, title_ua, title_en, has_cantos")
      .order("display_order");

    if (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити книги",
        variant: "destructive",
      });
      return;
    }

    setBooks(data || []);
  };

  const loadCantos = async (bookId: string) => {
    const { data, error } = await supabase
      .from("cantos")
      .select("id, canto_number, title_ua, title_en")
      .eq("book_id", bookId)
      .order("canto_number");

    if (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити Пісні",
        variant: "destructive",
      });
      return;
    }

    setCantos(data || []);
  };

  const handleBookChange = (bookId: string) => {
    setSelectedBook(bookId);
    setSelectedCanto("");
    setCantos([]);

    const book = books.find((b) => b.id === bookId);
    if (book?.has_cantos) {
      loadCantos(bookId);
    }
  };

  /**
   * Завантажує HTML через CORS proxy
   */
  const fetchWithProxy = async (url: string): Promise<string> => {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
      throw new Error(`Не вдалося завантажити контент з ${url}. Перевірте URL.`);
    }
  };

  const handleImport = async () => {
    console.log("[WebImport] handleImport started");
    console.log("[WebImport] selectedBook:", selectedBook);
    console.log("[WebImport] selectedCanto:", selectedCanto);
    console.log("[WebImport] cantos.length:", cantos.length);

    if (!selectedBook || (!selectedCanto && cantos.length > 0)) {
      console.error("[WebImport] Validation failed: book or canto missing");
      toast({
        title: "Помилка",
        description: "Виберіть книгу" + (cantos.length > 0 ? " та Пісню" : ""),
        variant: "destructive",
      });
      return;
    }

    if (!chapterTitleUa || !chapterTitleEn) {
      console.error("[WebImport] Validation failed: chapter titles missing");
      toast({
        title: "Помилка",
        description: "Введіть назви глави українською та англійською",
        variant: "destructive",
      });
      return;
    }

    if (!vedabaseUrl || !gitabaseUrl) {
      console.error("[WebImport] Validation failed: URLs missing");
      toast({
        title: "Помилка",
        description: "Введіть обидва URL",
        variant: "destructive",
      });
      return;
    }

    const verseCountNum = verseRange.split(",").reduce((acc, range) => {
      const parts = range
        .trim()
        .split("-")
        .map((p) => parseInt(p.trim()));
      if (parts.length === 1) return acc + 1;
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return acc + (parts[1] - parts[0] + 1);
      }
      return acc;
    }, 0);

    if (verseCountNum < 1 || verseCountNum > 500) {
      toast({
        title: "Помилка",
        description: "Кількість віршів має бути від 1 до 500",
        variant: "destructive",
      });
      return;
    }

    console.log("[WebImport] Validation passed, starting import");
    setIsImporting(true);
    setParsingProgress(0);
    setParsingStatus("Підготовка до парсингу...");

    try {
      let chapter = null;

      if (useServerParser) {
        // ============================================================================
        // НОВИЙ ПІДХІД: Playwright parser з нормалізацією через API
        // ============================================================================
        console.log("[WebImport] Using server-side Playwright parser with normalization");
        setParsingStatus(`Парсинг ${verseCountNum} віршів через Playwright...`);

        // Визначаємо lila number з UUID Пісні
        const selectedCantoObj = cantos.find((c) => c.id === selectedCanto);
        const lilaNum = selectedCantoObj ? selectedCantoObj.canto_number : 1;

        try {
          const apiUrl = "http://localhost:5003/admin/parse-web-chapter";
          console.log("[WebImport] Calling API:", apiUrl);
          console.log("[WebImport] Request payload:", {
            lila: lilaNum,
            chapter: parseInt(chapterNumber),
            verse_ranges: verseRange,
            vedabase_base: vedabaseUrl,
            gitabase_base: gitabaseUrl,
          });

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lila: lilaNum,
              chapter: parseInt(chapterNumber),
              verse_ranges: verseRange,
              vedabase_base: vedabaseUrl,
              gitabase_base: gitabaseUrl,
            }),
          });

          console.log("[WebImport] Response status:", response.status);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.error || `API помилка: ${response.statusText}`);
          }

          setParsingProgress(50);
          setParsingStatus("Отримання даних з сервера...");

          const result = await response.json();
          console.log("[WebImport] Received from API:", {
            verse_count: result.verses?.length,
            summary: result.summary,
          });

          if (!result.verses || result.verses.length === 0) {
            throw new Error("API не повернув віршів");
          }

          // Конвертуємо формат API у формат для імпорту
          chapter = {
            chapter_number: parseInt(chapterNumber),
            title_ua: chapterTitleUa,
            title_en: chapterTitleEn,
            verses: result.verses.map((v: any) => ({
              verse_number: parseInt(v.verse_number),
              sanskrit: v.sanskrit || "",
              transliteration: v.transliteration || "",
              synonyms_en: v.synonyms_en || "",
              translation_en: v.translation_en || "",
              commentary_en: v.commentary_en || "",
              synonyms_ua: v.synonyms_ua || "",
              translation_ua: v.translation_ua || "",
              commentary_ua: v.commentary_ua || "",
            })),
          };

          // DEBUG: Логуємо перший вірш щоб побачити що передається
          if (chapter.verses.length > 0) {
            const v1 = chapter.verses[0];
            console.log("[WebImport] Verse 1 field lengths:", {
              sanskrit: v1.sanskrit.length,
              transliteration: v1.transliteration.length,
              synonyms_ua: v1.synonyms_ua.length,
              translation_ua: v1.translation_ua.length,
              commentary_ua: v1.commentary_ua.length,
            });
            console.log("[WebImport] Verse 1 samples:", {
              sanskrit: v1.sanskrit.substring(0, 50),
              transliteration: v1.transliteration.substring(0, 50),
              synonyms_ua: v1.synonyms_ua.substring(0, 50),
              translation_ua: v1.translation_ua.substring(0, 50),
            });
          }

          setParsingProgress(75);
          setParsingStatus(`Отримано ${chapter.verses.length} віршів з нормалізацією`);

          toast({
            title: "✅ Парсинг завершено",
            description: `Отримано ${chapter.verses.length} віршів з транслітерацією`,
          });
        } catch (apiError) {
          console.error("[WebImport] Server parser failed:", apiError);

          // Показуємо помилку але не падаємо - можна спробувати fallback
          toast({
            title: "⚠️ Помилка серверного парсера",
            description: apiError instanceof Error ? apiError.message : "Невідома помилка",
            variant: "destructive",
          });

          throw apiError; // Не робимо fallback автоматично
        }
      } else {
        // ============================================================================
        // СТАРИЙ ПІДХІД: Client-side HTML parsing (без нормалізації)
        // ============================================================================
        console.log("[WebImport] Using client-side HTML parser (legacy)");
        setParsingStatus("Завантаження HTML через CORS proxy...");

        const vedabaseHtml = await fetchWithProxy(vedabaseUrl);
        setParsingProgress(25);

        const gitabaseHtml = await fetchWithProxy(gitabaseUrl);
        setParsingProgress(50);

        setParsingStatus("Парсинг HTML на клієнті...");
        chapter = await parseChapterFromWeb(
          vedabaseHtml,
          gitabaseHtml,
          parseInt(chapterNumber),
          chapterTitleUa,
          chapterTitleEn,
        );

        setParsingProgress(75);
        setParsingStatus(`Розпізнано ${chapter.verses.length} віршів`);
      }

      console.log("[WebImport] Parsed chapter:", {
        chapter_number: chapter.chapter_number,
        verses_count: chapter.verses.length,
        title_ua: chapter.title_ua,
      });

      // ============================================================================
      // ІМПОРТ У БАЗУ ДАНИХ
      // ============================================================================
      console.log("[WebImport] Importing to database");
      setParsingStatus("Імпорт у базу даних...");
      setParsingProgress(80);

      await importSingleChapter(supabase, {
        bookId: selectedBook,
        cantoId: selectedCanto || null,
        chapter,
        strategy: "replace",
      });

      setParsingProgress(100);
      setParsingStatus("Готово!");

      console.log("[WebImport] Import successful!");
      toast({
        title: "🎉 Успіх!",
        description: `Главу ${chapterNumber} успішно імпортовано (${chapter.verses.length} віршів)`,
      });

      // Очищуємо форму
      setChapterNumber((parseInt(chapterNumber) + 1).toString());
      setChapterTitleUa("");
      setChapterTitleEn("");
    } catch (error) {
      console.error("[WebImport] Import error:", error);
      setParsingStatus("Помилка");
      toast({
        title: "❌ Помилка",
        description: error instanceof Error ? error.message : "Не вдалося імпортувати главу",
        variant: "destructive",
      });
    } finally {
      console.log("[WebImport] Import process finished");
      setTimeout(() => {
        setIsImporting(false);
        setParsingProgress(0);
        setParsingStatus("");
      }, 2000);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Веб-імпорт (Playwright)</h1>
        <p className="text-muted-foreground">Імпорт з веб-сторінок з автоматичною транслітерацією та нормалізацією</p>
      </div>
      <div className="max-w-3xl mx-auto">
        {/* Інформаційний блок про новий парсер */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Download className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Покращений імпорт</AlertTitle>
          <AlertDescription className="text-blue-800">
            <strong>Playwright парсер з нормалізацією:</strong>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>✅ Автоматична транслітерація (англійська IAST → українська)</li>
              <li>✅ Нормалізація тексту (mojibake, діакритика)</li>
              <li>✅ Правильні форми термінів (згідно стандарту)</li>
              <li>⏱️ Час парсингу: ~2-3 сек/вірш (повна глава ~10-15 хв)</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="book">Книга</Label>
              <Select value={selectedBook} onValueChange={handleBookChange}>
                <SelectTrigger id="book">
                  <SelectValue placeholder="Виберіть книгу" />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title_ua}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {cantos.length > 0 && (
              <div>
                <Label htmlFor="canto">Ліла (Пісня)</Label>
                <Select value={selectedCanto} onValueChange={setSelectedCanto}>
                  <SelectTrigger id="canto">
                    <SelectValue placeholder="Виберіть лілу" />
                  </SelectTrigger>
                  <SelectContent>
                    {cantos.map((canto) => (
                      <SelectItem key={canto.id} value={canto.id}>
                        {canto.canto_number === 1 ? "Аді" : canto.canto_number === 2 ? "Мадх'я" : "Антья"}-ліла:{" "}
                        {canto.title_ua}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chapterNumber">Номер глави</Label>
                <Input
                  id="chapterNumber"
                  type="number"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(e.target.value)}
                  placeholder="1"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="verseRange">Діапазон віршів</Label>
                <Input
                  id="verseRange"
                  value={verseRange}
                  onChange={(e) => setVerseRange(e.target.value)}
                  placeholder="1-64, 65-66, 67-110"
                />
                <p className="text-xs text-muted-foreground mt-1">Через кому, напр. 1-10, 12, 15-20</p>
              </div>
            </div>

            <div>
              <Label htmlFor="titleUa">Назва глави (українською)</Label>
              <Input
                id="titleUa"
                value={chapterTitleUa}
                onChange={(e) => setChapterTitleUa(e.target.value)}
                placeholder="Духовний учитель"
              />
            </div>

            <div>
              <Label htmlFor="titleEn">Назва глави (англійською)</Label>
              <Input
                id="titleEn"
                value={chapterTitleEn}
                onChange={(e) => setChapterTitleEn(e.target.value)}
                placeholder="The Spiritual Master"
              />
            </div>

            <div>
              <Label htmlFor="vedabaseUrl">URL Vedabase (без номера вірша)</Label>
              <Input
                id="vedabaseUrl"
                value={vedabaseUrl}
                onChange={(e) => setVedabaseUrl(e.target.value)}
                placeholder="https://vedabase.io/en/library/cc/adi/1/"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Приклад: https://vedabase.io/en/library/cc/adi/1/ (без номера вірша в кінці)
              </p>
            </div>

            <div>
              <Label htmlFor="gitabaseUrl">URL Gitabase (українська)</Label>
              <Input
                id="gitabaseUrl"
                value={gitabaseUrl}
                onChange={(e) => setGitabaseUrl(e.target.value)}
                placeholder="https://gitabase.com/ukr/CC/1/1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Приклад: https://gitabase.com/ukr/CC/1/1 (ліла/глава без номера віршу)
              </p>
            </div>

            {/* Перемикач типу парсера */}
            <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
              <input
                type="checkbox"
                id="useServerParser"
                checked={useServerParser}
                onChange={(e) => setUseServerParser(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="useServerParser" className="cursor-pointer">
                <span className="font-semibold">Використовувати Playwright парсер</span>
                <span className="text-xs text-muted-foreground ml-2">(рекомендовано для транслітерації)</span>
              </Label>
            </div>

            {/* Прогрес-бар */}
            {isImporting && (
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">{parsingStatus}</p>
                    <Progress value={parsingProgress} className="mt-2 h-2" />
                    <p className="text-xs text-blue-700 mt-1">{parsingProgress}% завершено</p>
                  </div>
                </div>
                <p className="text-xs text-blue-600">
                  ⏱️ Парсинг може зайняти 10-15 хвилин для повної глави. Не закривайте сторінку!
                </p>
              </div>
            )}

            <Button onClick={handleImport} disabled={isImporting} className="w-full" size="lg">
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Парсинг віршів...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Імпортувати главу
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground space-y-2 p-4 bg-muted rounded-lg">
              <p className="font-semibold">💡 Поради:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>
                  Переконайтеся що сервер парсера запущено:{" "}
                  <code className="bg-background px-1 rounded">python3 tools/parse_server.py</code>
                </li>
                <li>URL Vedabase має вказувати на главу (без номера вірша в кінці)</li>
                <li>URL Gitabase має вказувати на лілу/главу (без номера віршу)</li>
                <li>Відкрийте консоль браузера (F12) для детальних логів</li>
                <li>Для тестування почніть з 3-5 віршів</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
