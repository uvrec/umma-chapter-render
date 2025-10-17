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
import { detectScript } from "@/utils/synonyms";

/**
 * Вдосконалений інструмент імпорту з Vedabase.io (side-by-side pages)
 * Автоматично витягує EN+UA контент, назви глав, та коректно обробляє Bengali/Devanagari
 */
export default function VedabaseImportV2() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState("bg");
  const [cantoNumber, setCantoNumber] = useState("1");
  const [chapterNumber, setChapterNumber] = useState("1");
  const [manualMode, setManualMode] = useState(false);
  const [manualFrom, setManualFrom] = useState("1");
  const [manualTo, setManualTo] = useState("10");

  const fetchHtmlViaProxy = async (url: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("fetch-proxy", { body: { url } });
    if (error) throw new Error(error.message || "Proxy error");
    const html = (data as any)?.html as string | undefined;
    if (!html) throw new Error("Порожня відповідь від проксі");
    return html;
  };

  const [stats, setStats] = useState<{
    total: number;
    imported: number;
    skipped: number;
    grouped: string[];
    errors: string[];
  } | null>(null);

  const bookConfig = useMemo(() => getBookConfig(selectedBook)!, [selectedBook]);
  const requiresCanto = !!bookConfig?.has_cantos;
  const requiresChapter = useMemo(
    () => !!bookConfig?.url_pattern?.includes("{chapter}") || !!bookConfig?.url_pattern?.includes("{lila}"),
    [bookConfig],
  );
  // Дозволяємо імпорт УКР лише для Чайтанья-чарітамріти (cc)
  const uaAllowed = useMemo(() => selectedBook === "cc", [selectedBook]);

  /**
   * Нормалізація тексту для порівняння (видалення діакритики та зайвих пробілів)
   */
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // діакритика
      .replace(/\s+/g, " ")
      .trim();
  };

  /**
   * Видалення ярликів типу "Devanagari:", "Purport", тощо
   */
  const stripLabels = (text: string): string => {
    if (!text) return "";
    const normalized = normalizeText(text);
    const labels = [
      "devanagari",
      "sanskrit",
      "bengali",
      "translation",
      "synonyms",
      "purport",
      "commentary",
      "word for word",
    ];

    let result = text.trim();
    // Видаляємо лейбл на початку рядка
    for (const label of labels) {
      const regex = new RegExp(`^\\s*${label}\\s*:?\\s*`, "i");
      result = result.replace(regex, "");
    }
    // Видаляємо окремі слова "Purport" у тексті
    result = result.replace(/\bPurport\b/gi, "").trim();
    return result;
  };

  /**
   * Локатор секції: знаходить заголовок секції та збирає весь контент після нього до наступного заголовка
   */
  const locateSection = (doc: Document, sectionName: string): string => {
    const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, .section-header, [class*='heading']"));
    const normalizedName = normalizeText(sectionName);

    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      const headingText = normalizeText(heading.textContent || "");

      if (headingText.includes(normalizedName)) {
        // Збираємо весь контент після цього заголовка до наступного заголовка
        const contentParts: string[] = [];
        let sibling = heading.nextElementSibling;

        while (sibling && !headings.includes(sibling as HTMLElement)) {
          const text = sibling.textContent?.trim();
          if (text) contentParts.push(text);
          sibling = sibling.nextElementSibling;
        }

        return stripLabels(contentParts.join("\n"));
      }
    }

    return "";
  };

  /**
   * Сканування сторінки для отримання списку всіх віршів
   */
  const scanChapterVerses = async (baseUrl: string): Promise<string[]> => {
    setCurrentStep("Сканування сторінки...");
    try {
      const html = await fetchHtmlViaProxy(baseUrl);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const anchors = Array.from(doc.querySelectorAll<HTMLAnchorElement>("a[href]"));
      const verseLinks = anchors
        .map((a) => a.href || "")
        .map((href) => {
          try {
            const path = new URL(href).pathname;
            if (!path.includes(`/library/${bookConfig.slug}/`)) return null;
            const m = path.match(/\/(\d+(?:-\d+)?)\/?$/);
            return m ? m[1] : null;
          } catch {
            return null;
          }
        })
        .filter((v): v is string => !!v);

      const uniqueVerses = Array.from(new Set(verseLinks));
      console.log(`Знайдено віршів: ${uniqueVerses.length}`, uniqueVerses);
      return uniqueVerses;
    } catch (error) {
      console.error("Помилка сканування:", error);
      return [];
    }
  };

  /**
   * Імпорт одного вірша з side-by-side сторінки Vedabase
   */
  const importVerseFromVedabase = async (
    verseNumber: string,
    verseUrl: string,
    chapterId: string,
  ): Promise<{ success: boolean; isGrouped: boolean; error?: string }> => {
    try {
      setCurrentStep(`Імпорт вірша ${verseNumber}...`);

      // Завантажуємо side-by-side версію (EN + UA)
      const sideBySideUrl = verseUrl.replace(/\/$/, "") + "/side-by-side/uk/";
      const html = await fetchHtmlViaProxy(sideBySideUrl);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const isGrouped = verseNumber.includes("-");
      if (isGrouped) {
        console.log(`⚠️ Вірш ${verseNumber} згрупований - пропускаємо`);
        return { success: true, isGrouped: true };
      }

      // Витягуємо санскрит/бенгалі
      const sanskrit = locateSection(doc, "Devanagari") || locateSection(doc, "Bengali") || locateSection(doc, "Sanskrit") || "";

      // Транслітерація
      const transliteration = Array.from(doc.querySelectorAll(".transliteration, [class*='translit']"))
        .map((el) => el.textContent?.trim())
        .filter(Boolean)
        .join("\n");

      // Синоніми (word-for-word) - шукаємо в обох мовах
      const synonyms_ua = locateSection(doc, "Пословний переклад") || locateSection(doc, "Синоніми") || "";
      const synonyms_en = locateSection(doc, "Synonyms") || locateSection(doc, "Word for word") || "";

      // Переклад - шукаємо в обох мовах
      const translation_ua = locateSection(doc, "Переклад") || "";
      const translation_en = locateSection(doc, "Translation") || "";

      // Пояснення - шукаємо в обох мовах
      const commentary_ua = locateSection(doc, "Пояснення") || locateSection(doc, "Коментар") || "";
      const commentary_en = locateSection(doc, "Purport") || locateSection(doc, "Commentary") || "";

      // Формуємо display_blocks з урахуванням дозволу на UA
      const displayBlocks = {
        sanskrit: !!sanskrit,
        transliteration: !!transliteration,
        synonyms: !!(synonyms_en || (uaAllowed && synonyms_ua)),
        translation: !!(translation_en || (uaAllowed && translation_ua)),
        commentary: !!(commentary_en || (uaAllowed && commentary_ua)),
      };

      // Динамічний payload: не перезаписувати UA-поля, якщо UA заборонено
      const insertPayload: any = {
        chapter_id: chapterId,
        verse_number: verseNumber,
        sanskrit,
        transliteration,
        synonyms_en,
        translation_en,
        commentary_en,
        display_blocks: displayBlocks,
      };
      if (uaAllowed) {
        insertPayload.synonyms_ua = synonyms_ua;
        insertPayload.translation_ua = translation_ua;
        insertPayload.commentary_ua = commentary_ua;
      }

      // Зберігаємо
      const { error: insertError } = await supabase.from("verses").insert(insertPayload);

      if (insertError) {
        const updatePayload: any = {
          sanskrit,
          transliteration,
          synonyms_en,
          translation_en,
          commentary_en,
          display_blocks: displayBlocks,
        };
        if (uaAllowed) {
          updatePayload.synonyms_ua = synonyms_ua;
          updatePayload.translation_ua = translation_ua;
          updatePayload.commentary_ua = commentary_ua;
        }

        const { error: updateError } = await supabase
          .from("verses")
          .update(updatePayload)
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
      if (!bookConfig) {
        toast.error("Невідома книга");
        return;
      }

      // Знаходимо або створюємо книгу
      const { data: dbBooks, error: dbBookError } = await (supabase as any)
        .from("books")
        .select("id, slug, has_cantos")
        .eq("vedabase_slug", selectedBook)
        .limit(1);

      let dbBook = dbBooks?.[0] ?? null;

      if (!dbBook) {
        console.log(`📚 Створюємо книгу з vedabase_slug="${selectedBook}"...`);
        const ourSlug = getOurSlug(bookConfig) || selectedBook;
        const bookTitle = bookConfig.name_ua || bookConfig.name_en || selectedBook.toUpperCase();

        const { data: newBook, error: createBookError } = await supabase
          .from("books")
          .insert({
            slug: ourSlug,
            vedabase_slug: selectedBook,
            title_ua: bookConfig.name_ua || bookTitle,
            title_en: bookConfig.name_en || bookTitle,
            has_cantos: bookConfig.has_cantos || false,
          })
          .select("id, slug, has_cantos")
          .single();

        if (createBookError) {
          toast.error(`Не вдалося створити книгу: ${createBookError.message}`);
          return;
        }

        dbBook = newBook;
        toast.success(`Книга "${bookTitle}" створена!`);
      }

      // Формуємо URL для side-by-side сторінки
      const baseUrl = buildVedabaseUrl(bookConfig, {
        canto: cantoNumber,
        chapter: chapterNumber,
      });

      const chapterUrl = baseUrl.replace(/\/$/, "") + "/side-by-side/uk/";

      // Витягуємо назву глави з side-by-side сторінки
      let chapterTitleUa = `Глава ${chapterNumber}`;
      let chapterTitleEn = `Chapter ${chapterNumber}`;

      try {
        const chapterHtml = await fetchHtmlViaProxy(chapterUrl);
        const chapterDoc = new DOMParser().parseFromString(chapterHtml, "text/html");
        const h1 = chapterDoc.querySelector("h1");
        if (h1) {
          const fullTitle = h1.textContent?.trim() || "";
          // Розділяємо на український та англійський (зазвичай розділені "/" або "-")
          const parts = fullTitle.split(/[\/\-]/);
          if (parts.length >= 2) {
            chapterTitleUa = parts[0].trim();
            chapterTitleEn = parts[1].trim();
          } else {
            chapterTitleUa = fullTitle;
            chapterTitleEn = fullTitle;
          }
        }
      } catch (error) {
        console.warn("Не вдалося витягнути назву глави:", error);
      }

      // Знаходимо або створюємо главу
      let chapterId: string;

      if (requiresCanto) {
        const { data: canto } = await supabase
          .from("cantos")
          .select("id")
          .eq("book_id", dbBook.id)
          .eq("canto_number", parseInt(cantoNumber))
          .single();

        let cantoId = canto?.id;

        if (!cantoId) {
          const { data: newCanto, error: cantoError } = await supabase
            .from("cantos")
            .insert({
              book_id: dbBook.id,
              canto_number: parseInt(cantoNumber),
              title_ua: `Пісня ${cantoNumber}`,
              title_en: `Canto ${cantoNumber}`,
            })
            .select("id")
            .single();

          if (cantoError) {
            toast.error(`Помилка створення canto: ${cantoError.message}`);
            return;
          }
          cantoId = newCanto.id;
        }

        const { data: existingChapter } = await supabase
          .from("chapters")
          .select("id")
          .eq("canto_id", cantoId)
          .eq("chapter_number", parseInt(chapterNumber))
          .single();

        if (existingChapter) {
          chapterId = existingChapter.id;
          await supabase
            .from("chapters")
            .update({
              title_en: chapterTitleEn,
              ...(uaAllowed ? { title_ua: chapterTitleUa } : {}),
            })
            .eq("id", chapterId);
        } else {
          const { data: newChapter, error: chapterError } = await supabase
            .from("chapters")
            .insert({
              canto_id: cantoId,
              chapter_number: parseInt(chapterNumber),
              title_ua: chapterTitleUa,
              title_en: chapterTitleEn,
              chapter_type: "verses",
            })
            .select("id")
            .single();

          if (chapterError) {
            toast.error(`Помилка створення глави: ${chapterError.message}`);
            return;
          }
          chapterId = newChapter.id;
        }
      } else {
        const { data: existingChapter } = await supabase
          .from("chapters")
          .select("id")
          .eq("book_id", dbBook.id)
          .eq("chapter_number", parseInt(chapterNumber))
          .single();

        if (existingChapter) {
          chapterId = existingChapter.id;
          await supabase
            .from("chapters")
            .update({
              title_en: chapterTitleEn,
              ...(uaAllowed ? { title_ua: chapterTitleUa } : {}),
            })
            .eq("id", chapterId);
        } else {
          const { data: newChapter, error: chapterError } = await supabase
            .from("chapters")
            .insert({
              book_id: dbBook.id,
              chapter_number: parseInt(chapterNumber),
              title_ua: chapterTitleUa,
              title_en: chapterTitleEn,
              chapter_type: "verses",
            })
            .select("id")
            .single();

          if (chapterError) {
            toast.error(`Помилка створення глави: ${chapterError.message}`);
            return;
          }
          chapterId = newChapter.id;
        }
      }

      // Сканування віршів
      let verseNumbers: string[];

      if (manualMode) {
        const from = parseInt(manualFrom);
        const to = parseInt(manualTo);
        verseNumbers = Array.from({ length: to - from + 1 }, (_, i) => (from + i).toString());
        console.log("Ручний режим:", verseNumbers);
      } else {
        verseNumbers = await scanChapterVerses(baseUrl);
        if (verseNumbers.length === 0) {
          toast.error("Не знайдено жодного вірша. Спробуйте ручний режим.");
          return;
        }
      }

      setStats((prev) => ({ ...prev!, total: verseNumbers.length }));

      // Імпорт кожного вірша
      for (const verseNum of verseNumbers) {
        const verseUrl = buildVedabaseUrl(bookConfig, {
          canto: cantoNumber,
          chapter: chapterNumber,
          verse: verseNum,
        });

        const result = await importVerseFromVedabase(verseNum, verseUrl, chapterId);

        if (result.success) {
          if (result.isGrouped) {
            setStats((prev) => ({
              ...prev!,
              grouped: [...prev!.grouped, verseNum],
              skipped: prev!.skipped + 1,
            }));
          } else {
            setStats((prev) => ({ ...prev!, imported: prev!.imported + 1 }));
          }
        } else {
          setStats((prev) => ({
            ...prev!,
            errors: [...prev!.errors, `${verseNum}: ${result.error}`],
          }));
        }
      }

      toast.success("Імпорт завершено!");
    } catch (error) {
      console.error("Помилка імпорту:", error);
      toast.error(`Помилка: ${error instanceof Error ? error.message : "Unknown"}`);
    } finally {
      setIsProcessing(false);
      setCurrentStep("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-2xl font-bold">Імпорт з Vedabase (Side-by-Side)</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="vedabase" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="vedabase">Vedabase (EN+UA)</TabsTrigger>
          </TabsList>

          <TabsContent value="vedabase" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Налаштування імпорту</CardTitle>
                <CardDescription>
                  Використовує side-by-side сторінки для автоматичного витягування UA+EN контенту
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Книга</Label>
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VEDABASE_BOOKS.map((book) => (
                        <SelectItem key={book.slug} value={book.slug}>
                          {book.name_ua} ({book.slug})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {requiresCanto && (
                  <div className="space-y-2">
                    <Label>Номер пісні/ліли</Label>
                    <Input
                      type="number"
                      value={cantoNumber}
                      onChange={(e) => setCantoNumber(e.target.value)}
                      min="1"
                    />
                  </div>
                )}

                {requiresChapter && (
                  <div className="space-y-2">
                    <Label>Номер глави</Label>
                    <Input
                      type="number"
                      value={chapterNumber}
                      onChange={(e) => setChapterNumber(e.target.value)}
                      min="1"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="manual-mode"
                    checked={manualMode}
                    onChange={(e) => setManualMode(e.target.checked)}
                  />
                  <Label htmlFor="manual-mode">Ручний режим (вказати діапазон віршів)</Label>
                </div>

                {manualMode && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Від вірша</Label>
                      <Input
                        type="number"
                        value={manualFrom}
                        onChange={(e) => setManualFrom(e.target.value)}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label>До вірша</Label>
                      <Input
                        type="number"
                        value={manualTo}
                        onChange={(e) => setManualTo(e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>
                )}

                <Button onClick={startImport} disabled={isProcessing} className="w-full">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {currentStep || "Імпортуємо..."}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Почати імпорт
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Статистика</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Всього:</span>
                    <Badge>{stats.total}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Імпортовано:</span>
                    <Badge variant="default">{stats.imported}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Пропущено:</span>
                    <Badge variant="secondary">{stats.skipped}</Badge>
                  </div>
                  {stats.grouped.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Згруповані вірші:</h4>
                      <div className="flex flex-wrap gap-2">
                        {stats.grouped.map((v) => (
                          <Badge key={v} variant="outline">
                            {v}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {stats.errors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 text-destructive">Помилки:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {stats.errors.map((err, i) => (
                          <li key={i} className="text-destructive">
                            {err}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
