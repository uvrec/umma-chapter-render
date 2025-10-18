// src/pages/admin/WebImport.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Download, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { parseChapterFromWeb } from "@/utils/import/webImporter";
import { parseChapterTextOnly } from "@/utils/import/textOnlyParser";
import { importSingleChapter } from "@/utils/import/chapterImporter";

interface Book {
  id: string;
  title_ua: string;
  title_en: string;
  has_cantos: boolean;
}

interface Canto {
  id: string;
  canto_number: number;
  title_ua: string;
  title_en: string;
}

export default function WebImport() {
  // Book/Canto selection
  const [books, setBooks] = useState<Book[]>([]);
  const [cantos, setCantos] = useState<Canto[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedCanto, setSelectedCanto] = useState<string>("");

  // Chapter info
  const [chapterNumber, setChapterNumber] = useState<string>("1");
  const [chapterTitleUa, setChapterTitleUa] = useState<string>("");
  const [chapterTitleEn, setChapterTitleEn] = useState<string>("");

  // URLs
  const [vedabaseUrl, setVedabaseUrl] = useState<string>("");
  const [gitabaseUrl, setGitabaseUrl] = useState<string>("");
  const [verseRange, setVerseRange] = useState<string>("1-10");
  const [useServerParser, setUseServerParser] = useState(false);
  const [useTextOnly, setUseTextOnly] = useState(false);

  // Progress
  const [isImporting, setIsImporting] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [parsingStatus, setParsingStatus] = useState("");

  // Автоматично генеруємо назву з URL
  useEffect(() => {
    if (!vedabaseUrl) return;

    try {
      const urlParts = vedabaseUrl.split('/').filter(Boolean);
      const lastPart = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
      
      if (lastPart) {
        // Для лекцій: 660219bg-new-york
        const match = lastPart.match(/(\d{6})([a-z]+)-(.+)/i);
        if (match) {
          const dateStr = match[1];
          const bookCode = match[2];
          const location = match[3].replace(/-/g, ' ');
          
          const year = '19' + dateStr.substring(0, 2);
          const month = parseInt(dateStr.substring(2, 4));
          const day = parseInt(dateStr.substring(4, 6));
          
          const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
          const monthsUa = ['', 'Січня', 'Лютого', 'Березня', 'Квітня', 'Травня', 'Червня',
                            'Липня', 'Серпня', 'Вересня', 'Жовтня', 'Листопада', 'Грудня'];
          
          const books: any = { bg: 'Bhagavad-gita', sb: 'Srimad-Bhagavatam', cc: 'Caitanya-caritamrta' };
          const booksUa: any = { bg: 'Бхагавад-гіта', sb: 'Шрімад-Бхагаватам', cc: 'Чайтанья-чарітамрита' };
          
          const loc = location.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          
          setChapterTitleEn(`${books[bookCode] || bookCode.toUpperCase()} ${months[month]} ${day}, ${year} - ${loc}`);
          setChapterTitleUa(`${booksUa[bookCode] || bookCode.toUpperCase()} ${day} ${monthsUa[month]} ${year} - ${loc}`);
        } else {
          // Для листів: letter-to-mahatma-gandhi
          const title = lastPart.replace(/-/g, ' ').split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          setChapterTitleEn(title);
          setChapterTitleUa(title);
        }
      }
    } catch (e) {
      console.error('Title parse error:', e);
    }
  }, [vedabaseUrl]);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("id, title_ua, title_en, has_cantos")
      .order("title_en");

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
        description: "Не вдалося завантажити пісні",
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

  /**
   * Витягує текст з HTML без DOM парсингу
   */
  const extractPlainText = (html: string): string => {
    // Видаляємо script та style теги
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    
    // Видаляємо HTML теги
    text = text.replace(/<[^>]+>/g, " ");
    
    // Декодуємо HTML entities
    text = text.replace(/&nbsp;/g, " ");
    text = text.replace(/&amp;/g, "&");
    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)));
    text = text.replace(/&#x([0-9A-Fa-f]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
    
    // Нормалізуємо пробіли
    text = text.replace(/\s+/g, " ");
    
    return text.trim();
  };

  const handleImport = async () => {
    console.log("[WebImport] handleImport started");
    console.log("[WebImport] selectedBook:", selectedBook);
    console.log("[WebImport] selectedCanto:", selectedCanto);
    console.log("[WebImport] useTextOnly:", useTextOnly);

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

    if (!vedabaseUrl) {
      console.error("[WebImport] Validation failed: Vedabase URL missing");
      toast({
        title: "Помилка",
        description: "Введіть URL Vedabase",
        variant: "destructive",
      });
      return;
    }

    // Gitabase опціональний для лекцій/листів
    if (!gitabaseUrl && !useTextOnly) {
      console.warn("[WebImport] No Gitabase URL - Ukrainian translation will be empty");
    }

    // Для лекцій/листів діапазон віршів не потрібен
    if (!useTextOnly) {
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

        const selectedCantoObj = cantos.find((c) => c.id === selectedCanto);
        const lilaNum = selectedCantoObj ? selectedCantoObj.canto_number : 1;

        try {
          const apiUrl = "http://localhost:5003/admin/parse-web-chapter";
          console.log("[WebImport] Calling API:", apiUrl);

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

          setParsingProgress(75);
          setParsingStatus(`Отримано ${chapter.verses.length} віршів з нормалізацією`);

          toast({
            title: "✅ Парсинг завершено",
            description: `Отримано ${chapter.verses.length} віршів з транслітерацією`,
          });
        } catch (apiError) {
          console.error("[WebImport] Server parser failed:", apiError);
          toast({
            title: "⚠️ Помилка серверного парсера",
            description: apiError instanceof Error ? apiError.message : "Невідома помилка",
            variant: "destructive",
          });
          throw apiError;
        }
      } else if (useTextOnly) {
        // ============================================================================
        // TEXT-ONLY ПІДХІД: Парсинг чистого тексту без DOM
        // ============================================================================
        console.log("[WebImport] Using text-only parser");
        setParsingStatus("Завантаження сторінок...");

        const vedabaseHtml = await fetchWithProxy(vedabaseUrl);
        setParsingProgress(25);

        const gitabaseHtml = await fetchWithProxy(gitabaseUrl);
        setParsingProgress(50);

        setParsingStatus("Витягування тексту...");
        
        const vedabaseText = extractPlainText(vedabaseHtml);
        const gitabaseText = extractPlainText(gitabaseHtml);
        
        console.log("[WebImport] Extracted text lengths:", {
          vedabase: vedabaseText.length,
          gitabase: gitabaseText.length
        });

        setParsingStatus("Парсинг тексту...");
        chapter = await parseChapterTextOnly(
          vedabaseText,
          gitabaseText,
          parseInt(chapterNumber),
          chapterTitleUa,
          chapterTitleEn,
        );

        setParsingProgress(75);
        setParsingStatus(`Розпізнано ${chapter.verses.length} віршів (text-only)`);
      } else {
        // ============================================================================
        // СТАРИЙ ПІДХІД: Client-side HTML parsing
        // ============================================================================
        console.log("[WebImport] Using client-side HTML parser");
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

      // Для text-only лекцій/листів використовуємо інший формат імпорту
      if (useTextOnly && chapter.chapter_type === "text") {
        console.log("[WebImport] Importing as text chapter (lecture/letter)");
        
        // Спочатку перевіряємо чи існує глава
        const { data: existing } = await supabase
          .from("chapters")
          .select("id")
          .eq("book_id", selectedBook)
          .eq("chapter_number", chapter.chapter_number)
          .maybeSingle();

        if (existing) {
          // Оновлюємо існуючу
          const { error } = await supabase
            .from("chapters")
            .update({
              chapter_type: "text",
              title_ua: chapter.title_ua,
              title_en: chapter.title_en,
              content_en: chapter.content_en || "",
              content_ua: chapter.content_ua || "",
            })
            .eq("id", existing.id);

          if (error) throw error;
        } else {
          // Створюємо нову
          const { error } = await supabase
            .from("chapters")
            .insert({
              book_id: selectedBook,
              canto_id: selectedCanto || null,
              chapter_number: chapter.chapter_number,
              chapter_type: "text",
              title_ua: chapter.title_ua,
              title_en: chapter.title_en,
              content_en: chapter.content_en || "",
              content_ua: chapter.content_ua || "",
            });

          if (error) throw error;
        }
        
        console.log("[WebImport] Lecture imported successfully");
      } else {
        // Звичайний імпорт глави з віршами
        await importSingleChapter(supabase, {
          bookId: selectedBook,
          cantoId: selectedCanto || null,
          chapter,
          strategy: "replace",
        });
      }

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
        description: error instanceof Error ? error.message : "Невідома помилка",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Web Import</h1>
          <p className="text-muted-foreground mt-2">Імпорт глав з vedabase.io та gitabase.com</p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="canto">Пісня</Label>
                  <Select value={selectedCanto} onValueChange={setSelectedCanto}>
                    <SelectTrigger id="canto">
                      <SelectValue placeholder="Виберіть пісню" />
                    </SelectTrigger>
                    <SelectContent>
                      {cantos.map((canto) => (
                        <SelectItem key={canto.id} value={canto.id}>
                          Пісня {canto.canto_number}: {canto.title_ua}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="chapterNumber">Номер глави</Label>
                <Input
                  id="chapterNumber"
                  type="number"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(e.target.value)}
                  min="1"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="verseRange">Діапазон віршів</Label>
                <Input
                  id="verseRange"
                  value={verseRange}
                  onChange={(e) => setVerseRange(e.target.value)}
                  placeholder="1-10 або 1,3,5-8"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Наприклад: "1-10" або "1,3,5-8,12"
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="chapterTitleUa">Назва глави (українською)</Label>
              <Input
                id="chapterTitleUa"
                value={chapterTitleUa}
                onChange={(e) => setChapterTitleUa(e.target.value)}
                placeholder="Перша зустріч з Господом Чайтаньєю"
              />
            </div>

            <div>
              <Label htmlFor="chapterTitleEn">Назва глави (англійською)</Label>
              <Input
                id="chapterTitleEn"
                value={chapterTitleEn}
                onChange={(e) => setChapterTitleEn(e.target.value)}
                placeholder="The First Meeting with Lord Caitanya"
              />
            </div>

            <div>
              <Label htmlFor="vedabaseUrl">URL Vedabase (англійська)</Label>
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
              <Label htmlFor="gitabaseUrl">URL Gitabase (українська) - опціонально</Label>
              <Input
                id="gitabaseUrl"
                value={gitabaseUrl}
                onChange={(e) => setGitabaseUrl(e.target.value)}
                placeholder="https://gitabase.com/ukr/CC/1/1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Для лекцій/листів можна залишити порожнім
              </p>
            </div>

            {/* Перемикачі типу парсера */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
                <input
                  type="checkbox"
                  id="useServerParser"
                  checked={useServerParser}
                  onChange={(e) => {
                    setUseServerParser(e.target.checked);
                    if (e.target.checked) setUseTextOnly(false);
                  }}
                  disabled={useTextOnly}
                  className="w-4 h-4"
                />
                <Label htmlFor="useServerParser" className="cursor-pointer">
                  <span className="font-semibold">Playwright парсер</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    (рекомендовано для транслітерації)
                  </span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <input
                  type="checkbox"
                  id="useTextOnly"
                  checked={useTextOnly}
                  onChange={(e) => {
                    setUseTextOnly(e.target.checked);
                    if (e.target.checked) setUseServerParser(false);
                  }}
                  disabled={useServerParser}
                  className="w-4 h-4"
                />
                <Label htmlFor="useTextOnly" className="cursor-pointer">
                  <span className="font-semibold">Text-only парсер</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    (для лекцій/листів - витягує весь текст без структури віршів)
                  </span>
                </Label>
              </div>
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
                  <strong>Text-only парсер:</strong> швидший, не потребує сервера, працює напряму з
                  текстом
                </li>
                <li>
                  <strong>Playwright парсер:</strong> точніше розпізнає транслітерацію, потребує сервер
                  <code className="bg-background px-1 ml-1 rounded">python3 tools/parse_server.py</code>
                </li>
                <li>URL Vedabase має вказувати на главу (без номера вірша в кінці)</li>
                <li>URL Gitabase має вказувати на лілу/главу (без номера віршу)</li>
                <li>Для тестування почніть з 3-5 віршів</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
