import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Download, AlertCircle, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VEDABASE_BOOKS, getBookConfig, buildVedabaseUrl, getOurSlug } from "@/utils/Vedabase-books";
import { Badge } from "@/components/ui/badge";

/**
 * Вдосконалений інструмент імпорту з Vedabase.io та Gitabase.com
 *
 * Етапи:
 * 1. Імпорт базової структури з Vedabase (англійська)
 * 2. Обробка згрупованих віршів
 * 3. Додавання українських перекладів з Gitabase
 */
export default function VedabaseImportV2() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState("cc"); // За замовчуванням Chaitanya-charitamrita
  const [cantoNumber, setCantoNumber] = useState("1");
  const [chapterNumber, setChapterNumber] = useState("1");
  const [manualMode, setManualMode] = useState(false);
  const [manualFrom, setManualFrom] = useState("1");
  const [manualTo, setManualTo] = useState("10");

  const [stats, setStats] = useState<{
    total: number;
    imported: number;
    skipped: number;
    grouped: string[];
    errors: string[];
  } | null>(null);

  const bookConfig = useMemo(() => getBookConfig(selectedBook)!, [selectedBook]);
  const requiresCanto = !!bookConfig?.has_cantos;
  // Потрібен номер глави лише якщо у шаблоні є {chapter} або {lila}
  const requiresChapter = useMemo(
    () => !!bookConfig?.url_pattern?.includes("{chapter}") || !!bookConfig?.url_pattern?.includes("{lila}"),
    [bookConfig],
  );

  /**
   * Крок 1: Сканування сторінки для отримання списку всіх віршів
   * Підтримує як сторінки глави, так і індексні сторінки книги (ISO/BS/NOI)
   */
  const scanChapterVerses = async (baseUrl: string): Promise<string[]> => {
    setCurrentStep("Сканування сторінки глави...");

    try {
      const response = await fetch(baseUrl, { mode: "cors" });
      const html = await response.text();

      // Парсимо HTML для знаходження всіх посилань на вірші
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Адаптивний пошук посилань: використовуємо абсолютний href, шукаємо кінцевий числовий сегмент
      const anchors = Array.from(doc.querySelectorAll<HTMLAnchorElement>("a[href]"));
      const verseLinks = anchors
        .map((a) => a.href || "")
        .map((href) => {
          try {
            // Залишаємо лише лінки, що ведуть до поточної книги (на будь-якій мові сайту)
            // приклади: https://vedabase.io/en/library/sb/1/1/2/ → 2 ; https://vedabase.io/en/library/bs/5/ → 5 ; relative теж нормалізовані у a.href
            const path = new URL(href).pathname;
            if (!path.includes(`/library/${bookConfig.slug}/`)) return null;
            const m = path.match(/\/(\d+(?:-\d+)?)\/?$/);
            return m ? m[1] : null;
          } catch {
            return null;
          }
        })
        .filter((v): v is string => !!v);

      // Унікальні вірші в порядку появи
      const uniqueVerses = Array.from(new Set(verseLinks));

      console.log(`Знайдено віршів на сторінці: ${uniqueVerses.length}`, uniqueVerses);
      return uniqueVerses;
    } catch (error) {
      console.error("Помилка сканування сторінки глави:", error);
      return [];
    }
  };

  /**
   * Крок 2: Імпорт одного вірша з Vedabase
   */
  const importVerseFromVedabase = async (
    verseNumber: string,
    verseUrl: string,
    chapterId: string,
  ): Promise<{ success: boolean; isGrouped: boolean; error?: string }> => {
    try {
      setCurrentStep(`Імпорт вірша ${verseNumber}...`);

      const response = await fetch(verseUrl);
      if (!response.ok) {
        return { success: false, isGrouped: false, error: `HTTP ${response.status}` };
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Перевірка чи це згрупований вірш
      const isGrouped = verseNumber.includes("-");

      // Витягуємо блоки
      const sanskrit = doc.querySelector(".verse-text")?.textContent?.trim() || "";
      const transliteration = doc.querySelector(".transliteration")?.textContent?.trim() || "";
      const synonyms = doc.querySelector(".synonyms")?.textContent?.trim() || "";
      const translation = doc.querySelector(".translation")?.textContent?.trim() || "";
      const purport = doc.querySelector(".purport")?.innerHTML?.trim() || "";

      if (isGrouped) {
        console.log(`⚠️ Вірш ${verseNumber} згрупований - пропускаємо для ручного введення`);
        return { success: true, isGrouped: true };
      }

      // Формуємо display_blocks на базі наявності контенту
      const displayBlocks = {
        sanskrit: !!sanskrit && sanskrit.trim().length > 0,
        transliteration: !!transliteration && transliteration.trim().length > 0,
        synonyms: !!synonyms && synonyms.trim().length > 0,
        translation: !!translation && translation.trim().length > 0,
        commentary: !!purport && purport.trim().length > 0,
      };

      // Зберігаємо в базу даних із display_blocks
      const { error: insertError } = await supabase.from("verses").insert({
        chapter_id: chapterId,
        verse_number: verseNumber,
        sanskrit: sanskrit,
        transliteration: transliteration,
        synonyms_en: synonyms,
        translation_en: translation,
        commentary_en: purport,
        display_blocks: displayBlocks,
      });

      if (insertError) {
        // Якщо вірш вже існує, оновлюємо
        const { error: updateError } = await supabase
          .from("verses")
          .update({
            sanskrit: sanskrit,
            transliteration: transliteration,
            synonyms_en: synonyms,
            translation_en: translation,
            commentary_en: purport,
            display_blocks: displayBlocks,
          })
          .eq("chapter_id", chapterId)
          .eq("verse_number", verseNumber);

        if (updateError) {
          return { success: false, isGrouped: false, error: updateError.message };
        }
      }

      return { success: true, isGrouped: false };
    } catch (error) {
      return {
        success: false,
        isGrouped: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  /**
   * Головна функція імпорту
   */
  const startImport = async () => {
    setIsProcessing(true);
    setStats({ total: 0, imported: 0, skipped: 0, grouped: [], errors: [] });

    try {
      // Отримуємо конфігурацію обраної книги (vedabase slug)
      if (!bookConfig) {
        toast.error("Невідома книга");
        return;
      }

      // Додатково перевіряємо наявність книги в БД за vedabase_slug
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: dbBooks, error: dbBookError } = await (supabase as any)
        .from("books")
        .select("id, slug, has_cantos")
        .eq("vedabase_slug", selectedBook)
        .limit(1);

      const dbBook = dbBooks?.[0] ?? null;

      if (dbBookError) {
        console.warn("Помилка пошуку книги за vedabase_slug:", dbBookError.message);
      }

      // Якщо книга існує і має Пісні/ліли, ми зможемо точніше знайти потрібну главу
      // Формуємо базовий URL для глави
      const chapterBaseUrl = buildVedabaseUrl(bookConfig, {
        canto: bookConfig.has_cantos ? cantoNumber : undefined,
        chapter: requiresChapter ? chapterNumber : undefined,
      });

      console.log("Базовий URL:", chapterBaseUrl);

      // Отримуємо ID глави з бази даних з урахуванням книги (і Пісні/ліли якщо є)
      const chapterNumberInt = parseInt(chapterNumber);

      let cantoId: string | null = null;
      if (bookConfig.has_cantos) {
        if (!dbBook) {
          console.warn("Книга з vedabase_slug не знайдена в БД, пошук Пісень/ліл неможливий.");
        } else {
          const cantoNumberInt = parseInt(cantoNumber);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: cantoRows, error: cantoErr } = await (supabase as any)
            .from("cantos")
            .select("id, canto_number, book_id")
            .eq("book_id", dbBook.id)
            .eq("canto_number", cantoNumberInt)
            .limit(1);
          if (cantoErr) {
            console.warn("Помилка пошуку Пісні/ліли:", cantoErr.message);
          }
          const canto = cantoRows?.[0] ?? null;
          if (!canto) {
            toast.error("Пісня/Ліла не знайдена в БД. Спочатку створіть її.");
            return;
          }
          cantoId = canto.id;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let chapterQuery: any = (supabase as any)
        .from("chapters")
        .select("id, chapter_number, book_id, canto_id")
        .eq("chapter_number", chapterNumberInt)
        .limit(1);

      if (dbBook?.id) {
        chapterQuery = chapterQuery.eq("book_id", dbBook.id);
      }
      if (bookConfig.has_cantos && cantoId) {
        chapterQuery = chapterQuery.eq("canto_id", cantoId);
      }

      const { data: chapterRows, error: chapterErr } = await chapterQuery;

      const chapter = chapterRows?.[0] ?? null;
      if (chapterErr) {
        console.warn("Не знайдено главу за поточними критеріями:", chapterErr.message);
      }

      if (!chapter) {
        toast.error("Глава не знайдена в базі даних. Створіть її спочатку.");
        return;
      }

      // Крок 1: Сканування всіх віршів або ручний режим
      let verses: string[] = [];
      if (manualMode) {
        const from = Math.max(1, parseInt(manualFrom || "1", 10));
        const to = Math.max(from, parseInt(manualTo || String(from), 10));
        verses = Array.from({ length: to - from + 1 }, (_, i) => String(from + i));
      } else {
        verses = await scanChapterVerses(chapterBaseUrl);
      }

      if (verses.length === 0) {
        toast.error(
          "Не вдалося знайти вірші на сторінці. Це може бути CORS або на сторінці немає списку віршів. Спробуйте ручний діапазон.",
        );
        return;
      }

      setStats({ total: verses.length, imported: 0, skipped: 0, grouped: [], errors: [] });

      let imported = 0;
      let skipped = 0;
      const grouped: string[] = [];
      const errors: string[] = [];

      // Крок 2: Імпорт кожного вірша
      for (const verseNumber of verses) {
        // Формуємо URL конкретного вірша
        const verseUrl = buildVedabaseUrl(bookConfig, {
          canto: bookConfig.has_cantos ? cantoNumber : undefined,
          chapter: requiresChapter ? chapterNumber : undefined,
          verse: verseNumber,
        });

        const result = await importVerseFromVedabase(verseNumber, verseUrl, chapter.id);

        if (result.success) {
          if (result.isGrouped) {
            grouped.push(verseNumber);
          } else {
            imported++;
          }
        } else {
          errors.push(`${verseNumber}: ${result.error}`);
          skipped++;
        }

        setStats({ total: verses.length, imported, skipped, grouped, errors });

        // Затримка між запитами
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      toast.success(`Імпорт завершено! Імпортовано: ${imported}, Пропущено: ${skipped}`);
    } catch (error) {
      console.error("Помилка імпорту:", error);
      toast.error("Помилка під час імпорту");
    } finally {
      setIsProcessing(false);
      setCurrentStep("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Vedabase Import v2</h1>
              <p className="text-sm text-muted-foreground">Розумний імпорт з обробкою згрупованих віршів та поетапним додаванням даних</p>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Вдосконалений імпорт з Vedabase.io</CardTitle>
          <CardDescription>Автоматичне сканування та імпорт віршів з підтримкою згрупованих елементів</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vedabase" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vedabase">
                <Download className="w-4 h-4 mr-2" />
                Етап 1: Vedabase (EN)
              </TabsTrigger>
              <TabsTrigger value="gitabase" disabled>
                Етап 2: Gitabase (UA)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vedabase" className="space-y-6">
              {/* Підказка з прямим посиланням для перевірки та CORS-нота */}
              <div className="p-3 rounded-lg border bg-muted/30 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground">URL для сканування:</span>
                  <a
                    className="underline break-all"
                    href={buildVedabaseUrl(bookConfig, {
                      canto: requiresCanto ? cantoNumber : undefined,
                      chapter: requiresChapter ? chapterNumber : undefined,
                    })}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {buildVedabaseUrl(bookConfig, {
                      canto: requiresCanto ? cantoNumber : undefined,
                      chapter: requiresChapter ? chapterNumber : undefined,
                    })}
                  </a>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Якщо після натискання "Почати імпорт" вірші не знайдено, це може бути через CORS або відсутність
                  списку віршів на сторінці. У такому разі скористайтеся режимом "Ручний діапазон" нижче.
                </div>
              </div>
              {/* Інформаційний блок про маппінг Vedabase → Наша БД */}
              <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-soft">
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-muted-foreground">Маппінг книги та структура</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">Vedabase: {selectedBook.toUpperCase()}</Badge>
                    {getBookConfig(selectedBook)?.our_slug && (
                      <>
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="secondary">Наша БД: {getOurSlug(getBookConfig(selectedBook)!)}</Badge>
                      </>
                    )}
                    {getBookConfig(selectedBook)?.structure_type && (
                      <Badge>Структура: {getBookConfig(selectedBook)!.structure_type}</Badge>
                    )}
                    {getBookConfig(selectedBook)?.has_cantos && <Badge variant="outline">Має пісні/ліли</Badge>}
                    {!requiresChapter && <Badge variant="outline">Без глав (лише вірші)</Badge>}
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  ℹ️ Етап 1: Базовий імпорт з Vedabase
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Сканування всіх віршів глави (включно зі згрупованими)</li>
                  <li>• Імпорт оригіналу, транслітерації, синонімів</li>
                  <li>• Імпорт англійського перекладу та пояснення</li>
                  <li>• Автоматичний пропуск згрупованих віршів (65-66, 69-70 тощо)</li>
                </ul>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Book select */}
                <div className="space-y-2">
                  <Label htmlFor="bookSelect">Книга</Label>
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger id="bookSelect">
                      <SelectValue placeholder="Виберіть книгу" />
                    </SelectTrigger>
                    <SelectContent>
                      {VEDABASE_BOOKS.map((book) => (
                        <SelectItem key={book.slug} value={book.slug}>
                          <div>
                            <div className="font-medium">{book.slug.toUpperCase()}</div>
                            <div className="text-xs text-muted-foreground">{book.name_ua}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Canto input if needed */}
                {requiresCanto && (
                  <div className="space-y-2">
                    <Label htmlFor="cantoNumber">Номер пісні/ліли</Label>
                    <Input
                      id="cantoNumber"
                      value={cantoNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCantoNumber(e.target.value)}
                      placeholder="1"
                    />
                    <p className="text-xs text-muted-foreground">
                      {selectedBook === "cc" ? "1 — Аді, 2 — Мадхʼя, 3 — Антья" : "Номер Пісні"}
                    </p>
                  </div>
                )}

                {/* Chapter input if required */}
                {requiresChapter && (
                  <div className="space-y-2">
                    <Label htmlFor="chapterNumber">Номер глави</Label>
                    <Input
                      id="chapterNumber"
                      value={chapterNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChapterNumber(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                )}
              </div>

              {/* Ручний режим (коли сканер не знаходить вірші або CORS) */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Ручний діапазон (fallback)</div>
                  <div className="text-xs text-muted-foreground">Корисно для ISO/BS/NOI або при CORS</div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="text-sm text-muted-foreground" htmlFor="from">
                    Від
                  </label>
                  <Input
                    id="from"
                    className="w-24"
                    value={manualFrom}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualFrom(e.target.value)}
                  />
                  <label className="text-sm text-muted-foreground" htmlFor="to">
                    До
                  </label>
                  <Input
                    id="to"
                    className="w-24"
                    value={manualTo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualTo(e.target.value)}
                  />
                  <div className="flex items-center gap-2 ml-2">
                    <input
                      id="manualMode"
                      type="checkbox"
                      checked={manualMode}
                      onChange={(e) => setManualMode(e.currentTarget.checked)}
                    />
                    <label htmlFor="manualMode" className="text-sm">
                      Використовувати ручний діапазон
                    </label>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Підказка: стандартні діапазони — ISO (1–18), NOI (1–11), BS (1–62). Для BG/SB/CC використовуйте сканер
                  по главах/лілах.
                </div>
              </div>

              <Button onClick={startImport} disabled={isProcessing} className="w-full" size="lg">
                {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isProcessing ? currentStep : "Почати імпорт"}
              </Button>

              {stats && (
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Статистика імпорту:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Всього віршів</div>
                        <div className="text-2xl font-bold">{stats.total}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Імпортовано</div>
                        <div className="text-2xl font-bold text-green-600">{stats.imported}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Пропущено</div>
                        <div className="text-2xl font-bold text-yellow-600">{stats.skipped}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Згруповані</div>
                        <div className="text-2xl font-bold text-blue-600">{stats.grouped.length}</div>
                      </div>
                    </div>
                  </div>

                  {stats.grouped.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Згруповані вірші (для ручного введення):
                      </h4>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">{stats.grouped.join(", ")}</div>
                    </div>
                  )}

                  {stats.errors.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Помилки:</h4>
                      <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                        {stats.errors.map((error, i) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="gitabase">
              <div className="text-center py-8 text-muted-foreground">
                Етап 2 буде доступний після завершення імпорту з Vedabase
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
