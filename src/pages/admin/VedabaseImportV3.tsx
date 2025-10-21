// src/pages/admin/VedabaseImportV3.tsx
/**
 * ПОВНІСТЮ ФУНКЦІОНАЛЬНИЙ ІМПОРТЕР V3
 * 
 * ✅ Робочий CORS fallback (allorigins.win)
 * ✅ Двомовний режим: EN (Vedabase) + UA (Gitabase/Vedabase-UA)
 * ✅ Нормалізація тексту (mojibake, діакритика, IAST→українська)
 * ✅ Підтримка всіх книг
 * ✅ Автоматичне виправлення помилок Gitabase
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { VEDABASE_BOOKS, getBookConfig, buildVedabaseUrl, buildGitabaseUrl } from "@/utils/Vedabase-books";
import { normalizeVerse, normalizeVerseField, convertIASTtoUkrainian } from "@/utils/textNormalizer";
import { Badge } from "@/components/ui/badge";

interface ImportStats {
  total: number;
  imported: number;
  skipped: number;
  errors: string[];
}

export default function VedabaseImportV3() {
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState("bg");
  const [cantoNumber, setCantoNumber] = useState("1");
  const [chapterNumber, setChapterNumber] = useState("1");
  const [fromVerse, setFromVerse] = useState("1");
  const [toVerse, setToVerse] = useState("10");
  
  // Налаштування імпорту
  const [importEN, setImportEN] = useState(true);
  const [importUA, setImportUA] = useState(true);
  const [useGitabase, setUseGitabase] = useState(true);
  const [useVedabaseUA, setUseVedabaseUA] = useState(false);
  
  const [stats, setStats] = useState<ImportStats | null>(null);

  const bookConfig = useMemo(() => getBookConfig(selectedBook), [selectedBook]);

  // ========================================================================
  // CORS PROXY з автоматичним fallback
  // ========================================================================

  const fetchHTML = async (url: string, attempt = 1): Promise<string> => {
    const proxies = [
      // Спроба 1: Supabase Edge Function
      async () => {
        const { data, error } = await supabase.functions.invoke("fetch-proxy", { body: { url } });
        if (error) throw new Error(error.message);
        return (data as any)?.html;
      },
      // Спроба 2: AllOrigins (надійний публічний proxy)
      async () => {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
      },
      // Спроба 3: CORS Anywhere (резервний)
      async () => {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
      },
    ];

    if (attempt > proxies.length) {
      throw new Error(`Не вдалося завантажити ${url} після ${proxies.length} спроб`);
    }

    try {
      console.log(`Спроба ${attempt}: завантаження ${url}`);
      const html = await proxies[attempt - 1]();
      if (!html || html.length < 100) {
        throw new Error("Порожня відповідь");
      }
      console.log(`✅ Завантажено ${url} (${html.length} символів)`);
      return html;
    } catch (error) {
      console.warn(`⚠️ Спроба ${attempt} не вдалась:`, error);
      if (attempt < proxies.length) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // затримка перед наступною спробою
        return fetchHTML(url, attempt + 1);
      }
      throw error;
    }
  };

  // ========================================================================
  // ПАРСИНГ VEDABASE (англійська)
  // ========================================================================

  const extractVedabaseContent = (html: string): {
    sanskrit: string;
    transliteration: string;
    synonyms: string;
    translation: string;
    commentary: string;
  } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    const result = {
      sanskrit: "",
      transliteration: "",
      synonyms: "",
      translation: "",
      commentary: "",
    };

    try {
      // Санскрит/Бенгалі - шукаємо текст в скрипті Devanagari/Bengali
      const scriptTags = doc.querySelectorAll('script');
      for (const script of scriptTags) {
        const text = script.textContent || '';
        const match = text.match(/["']sanskrit["']:\s*["']([^"']+)["']/);
        if (match) {
          result.sanskrit = match[1];
          break;
        }
      }
      
      // Fallback: шукаємо в тексті
      if (!result.sanskrit) {
        const bengaliRegex = /[\u0980-\u09FF।॥]+/;
        const devanagariRegex = /[\u0900-\u097F।॥]+/;
        const bodyText = doc.body.textContent || '';
        const bengaliMatch = bodyText.match(bengaliRegex);
        const devanagariMatch = bodyText.match(devanagariRegex);
        result.sanskrit = bengaliMatch?.[0] || devanagariMatch?.[0] || '';
      }

      // Транслітерація - шукаємо IAST латиницю
      const translitEl = doc.querySelector('.transliteration, [class*="translit"], .verse-text em, .verse-text i');
      if (translitEl) {
        result.transliteration = translitEl.textContent?.trim() || '';
      }

      // Синоніми - шукаємо "SYNONYMS" або "Word for word"
      const synonymsHeaders = Array.from(doc.querySelectorAll('h3, h4, strong, b')).find(
        el => /synonyms|word.*word/i.test(el.textContent || '')
      );
      if (synonymsHeaders) {
        let nextEl = synonymsHeaders.nextElementSibling;
        const parts: string[] = [];
        while (nextEl && parts.length < 5) {
          const text = nextEl.textContent?.trim();
          if (text && !/translation|commentary|purport/i.test(text)) {
            parts.push(text);
          }
          nextEl = nextEl.nextElementSibling;
          if (nextEl?.tagName === 'H3' || nextEl?.tagName === 'H4') break;
        }
        result.synonyms = parts.join(' ');
      }

      // Переклад - шукаємо "TRANSLATION"
      const translationHeader = Array.from(doc.querySelectorAll('h3, h4, strong, b')).find(
        el => /^translation$/i.test(el.textContent?.trim() || '')
      );
      if (translationHeader) {
        const nextP = translationHeader.nextElementSibling;
        if (nextP?.tagName === 'P') {
          result.translation = nextP.textContent?.trim() || '';
        }
      }

      // Коментар - шукаємо "PURPORT" або "COMMENTARY"
      const commentaryHeader = Array.from(doc.querySelectorAll('h3, h4, strong, b')).find(
        el => /purport|commentary/i.test(el.textContent || '')
      );
      if (commentaryHeader) {
        let nextEl = commentaryHeader.nextElementSibling;
        const parts: string[] = [];
        while (nextEl && parts.length < 100) {
          if (nextEl.tagName === 'P') {
            const text = nextEl.textContent?.trim();
            if (text) parts.push(text);
          }
          nextEl = nextEl.nextElementSibling;
          if (nextEl?.tagName === 'H3' || nextEl?.tagName === 'H4') break;
        }
        result.commentary = parts.join('\n\n');
      }

      console.log('Vedabase extracted:', {
        sanskrit: result.sanskrit.substring(0, 50),
        transliteration: result.transliteration.substring(0, 50),
        synonyms: result.synonyms.substring(0, 50),
        translation: result.translation.substring(0, 50),
        commentary: result.commentary.substring(0, 100),
      });

    } catch (error) {
      console.error('Error extracting Vedabase content:', error);
    }

    return result;
  };

  // ========================================================================
  // ПАРСИНГ GITABASE (українська)
  // ========================================================================

  const extractGitabaseContent = (html: string): {
    transliteration: string;
    synonyms: string;
    translation: string;
    commentary: string;
  } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    const result = {
      transliteration: "",
      synonyms: "",
      translation: "",
      commentary: "",
    };

    try {
      // Транслітерація
      const translitEl = doc.querySelector('#div_translit em, #div_translit i');
      if (translitEl) {
        result.transliteration = translitEl.textContent?.trim() || '';
      }

      // Синоніми (word-by-word)
      const diaBlocks = doc.querySelectorAll('.dia_text');
      for (const block of diaBlocks) {
        const italics = block.querySelectorAll('i');
        if (italics.length > 4) {
          const parts = Array.from(italics).map(i => i.textContent?.trim()).filter(Boolean);
          result.synonyms = parts.slice(0, 60).join(' ; ');
          break;
        }
      }

      // Переклад та коментар - шукаємо в тексті
      const bodyText = doc.body.textContent || '';
      const textPattern = /(?:Текст.*?)?[«"](.+?)[»"](.+?)(?=Текст|$)/gis;
      const match = bodyText.match(textPattern);
      if (match) {
        const quotedMatch = bodyText.match(/[«"](.+?)[»"]/);
        if (quotedMatch) {
          result.translation = quotedMatch[1];
          const afterQuote = bodyText.substring(quotedMatch.index! + quotedMatch[0].length);
          result.commentary = afterQuote.substring(0, 5000).trim();
        }
      }

      console.log('Gitabase extracted:', {
        transliteration: result.transliteration.substring(0, 50),
        synonyms: result.synonyms.substring(0, 50),
        translation: result.translation.substring(0, 50),
        commentary: result.commentary.substring(0, 100),
      });

    } catch (error) {
      console.error('Error extracting Gitabase content:', error);
    }

    return result;
  };

  // ========================================================================
  // ІМПОРТ ОДНОГО ВІРША
  // ========================================================================

  const importSingleVerse = async (
    verseNumber: string,
    chapterId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setCurrentStep(`Імпорт вірша ${verseNumber}...`);

      let sanskrit = "";
      let transliteration = "";
      let synonyms_en = "";
      let translation_en = "";
      let commentary_en = "";
      let synonyms_ua = "";
      let translation_ua = "";
      let commentary_ua = "";

      // 1. VEDABASE (англійська)
      if (importEN && bookConfig) {
        try {
          const vedabaseUrl = buildVedabaseUrl(bookConfig, {
            canto: cantoNumber,
            chapter: chapterNumber,
            verse: verseNumber,
          });
          console.log(`Завантаження Vedabase: ${vedabaseUrl}`);
          const vedabaseHTML = await fetchHTML(vedabaseUrl);
          const vedabaseData = extractVedabaseContent(vedabaseHTML);

          sanskrit = vedabaseData.sanskrit;
          synonyms_en = vedabaseData.synonyms;
          translation_en = vedabaseData.translation;
          commentary_en = vedabaseData.commentary;

          // Конвертуємо англійську транслітерацію в українську
          if (vedabaseData.transliteration) {
            transliteration = convertIASTtoUkrainian(vedabaseData.transliteration);
            transliteration = normalizeVerseField(transliteration, 'transliteration');
          }

          await new Promise(resolve => setTimeout(resolve, 500)); // затримка між запитами
        } catch (error) {
          console.error(`Помилка Vedabase для вірша ${verseNumber}:`, error);
        }
      }

      // 2. GITABASE (українська)
      if (importUA && useGitabase && bookConfig?.gitabase_available) {
        try {
          const gitabaseUrl = buildGitabaseUrl(bookConfig, {
            canto: cantoNumber,
            chapter: chapterNumber,
            verse: verseNumber,
          });
          console.log(`Завантаження Gitabase: ${gitabaseUrl}`);
          const gitabaseHTML = await fetchHTML(gitabaseUrl!);
          const gitabaseData = extractGitabaseContent(gitabaseHTML);

          synonyms_ua = gitabaseData.synonyms;
          translation_ua = gitabaseData.translation;
          commentary_ua = gitabaseData.commentary;

          // Якщо немає української транслітерації з Vedabase
          if (!transliteration && gitabaseData.transliteration) {
            transliteration = gitabaseData.transliteration;
          }

          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Помилка Gitabase для вірша ${verseNumber}:`, error);
        }
      }

      // 3. VEDABASE-UA (українська офіційна)
      if (importUA && useVedabaseUA && bookConfig) {
        try {
          const vedabaseUAUrl = buildVedabaseUrl(bookConfig, {
            canto: cantoNumber,
            chapter: chapterNumber,
            verse: verseNumber,
          }).replace('/en/', '/uk/'); // або /ua/
          
          console.log(`Завантаження Vedabase-UA: ${vedabaseUAUrl}`);
          const vedabaseUAHTML = await fetchHTML(vedabaseUAUrl);
          const vedabaseUAData = extractVedabaseContent(vedabaseUAHTML);

          // Якщо ще немає української
          if (!translation_ua) translation_ua = vedabaseUAData.translation;
          if (!commentary_ua) commentary_ua = vedabaseUAData.commentary;
          if (!synonyms_ua) synonyms_ua = vedabaseUAData.synonyms;

          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Помилка Vedabase-UA для вірша ${verseNumber}:`, error);
        }
      }

      // Перевірка чи є хоч якийсь контент
      const hasContent = sanskrit || transliteration || 
                        synonyms_en || translation_en || commentary_en ||
                        synonyms_ua || translation_ua || commentary_ua;

      if (!hasContent) {
        console.warn(`⚠️ Вірш ${verseNumber}: порожній контент, пропускаємо`);
        return { success: false, error: "Порожній контент" };
      }

      // 4. НОРМАЛІЗАЦІЯ
      const normalized = normalizeVerse({
        sanskrit,
        transliteration,
        synonyms_en,
        translation_en,
        commentary_en,
        synonyms_ua,
        translation_ua,
        commentary_ua,
      });

      // 5. ЗБЕРЕЖЕННЯ В БД
      const displayBlocks = {
        sanskrit: !!normalized.sanskrit,
        transliteration: !!normalized.transliteration,
        synonyms: !!(normalized.synonyms_en || normalized.synonyms_ua),
        translation: !!(normalized.translation_en || normalized.translation_ua),
        commentary: !!(normalized.commentary_en || normalized.commentary_ua),
      };

      const { error: upsertError } = await supabase.from("verses").upsert(
        {
          chapter_id: chapterId,
          verse_number: verseNumber,
          sanskrit: normalized.sanskrit,
          transliteration: normalized.transliteration,
          synonyms_en: normalized.synonyms_en,
          translation_en: normalized.translation_en,
          commentary_en: normalized.commentary_en,
          synonyms_ua: normalized.synonyms_ua,
          translation_ua: normalized.translation_ua,
          commentary_ua: normalized.commentary_ua,
          display_blocks: displayBlocks,
          is_published: true,
        },
        {
          onConflict: "chapter_id,verse_number",
        }
      );

      if (upsertError) {
        return { success: false, error: upsertError.message };
      }

      console.log(`✅ Імпортовано вірш ${verseNumber}`);
      return { success: true };

    } catch (error) {
      console.error(`Помилка імпорту вірша ${verseNumber}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Невідома помилка",
      };
    }
  };

  // ========================================================================
  // ГОЛОВНА ФУНКЦІЯ ІМПОРТУ
  // ========================================================================

  const startImport = async () => {
    setIsProcessing(true);
    setStats({ total: 0, imported: 0, skipped: 0, errors: [] });

    try {
      if (!bookConfig) {
        toast.error("Невідома книга");
        return;
      }

      // 1. Знайти або створити книгу
      let { data: book } = await supabase
        .from("books")
        .select("id")
        .eq("vedabase_slug", selectedBook)
        .maybeSingle();

      if (!book) {
        const { data: newBook, error } = await supabase
          .from("books")
          .insert({
            slug: bookConfig.our_slug || selectedBook,
            vedabase_slug: selectedBook,
            gitabase_slug: bookConfig.gitabase_slug,
            title_ua: bookConfig.name_ua,
            title_en: bookConfig.name_en,
            has_cantos: bookConfig.has_cantos,
            is_published: true,
          })
          .select("id")
          .single();

        if (error) {
          toast.error(`Помилка створення книги: ${error.message}`);
          return;
        }
        book = newBook;
      }

      // 2. Знайти або створити розділ
      let chapterId: string;

      if (bookConfig.has_cantos) {
        // Для книг з канто (SB, CC)
        let { data: canto } = await supabase
          .from("cantos")
          .select("id")
          .eq("book_id", book.id)
          .eq("canto_number", parseInt(cantoNumber))
          .maybeSingle();

        if (!canto) {
          const { data: newCanto, error } = await supabase
            .from("cantos")
            .insert({
              book_id: book.id,
              canto_number: parseInt(cantoNumber),
              title_ua: `Пісня ${cantoNumber}`,
              title_en: `Canto ${cantoNumber}`,
              is_published: true,
            })
            .select("id")
            .single();

          if (error) {
            toast.error(`Помилка створення канто: ${error.message}`);
            return;
          }
          canto = newCanto;
        }

        let { data: chapter } = await supabase
          .from("chapters")
          .select("id")
          .eq("canto_id", canto.id)
          .eq("chapter_number", parseInt(chapterNumber))
          .maybeSingle();

        if (!chapter) {
          const { data: newChapter, error } = await supabase
            .from("chapters")
            .insert({
              book_id: book.id,
              canto_id: canto.id,
              chapter_number: parseInt(chapterNumber),
              title_ua: `Глава ${chapterNumber}`,
              title_en: `Chapter ${chapterNumber}`,
              is_published: true,
            })
            .select("id")
            .single();

          if (error) {
            toast.error(`Помилка створення розділу: ${error.message}`);
            return;
          }
          chapter = newChapter;
        }

        chapterId = chapter.id;
      } else {
        // Для книг без канто (BG, ISO)
        let { data: chapter } = await supabase
          .from("chapters")
          .select("id")
          .eq("book_id", book.id)
          .eq("chapter_number", parseInt(chapterNumber))
          .maybeSingle();

        if (!chapter) {
          const { data: newChapter, error } = await supabase
            .from("chapters")
            .insert({
              book_id: book.id,
              chapter_number: parseInt(chapterNumber),
              title_ua: `Глава ${chapterNumber}`,
              title_en: `Chapter ${chapterNumber}`,
              is_published: true,
            })
            .select("id")
            .single();

          if (error) {
            toast.error(`Помилка створення розділу: ${error.message}`);
            return;
          }
          chapter = newChapter;
        }

        chapterId = chapter.id;
      }

      // 3. Імпорт віршів
      const from = parseInt(fromVerse);
      const to = parseInt(toVerse);
      const verseNumbers = Array.from({ length: to - from + 1 }, (_, i) => (from + i).toString());

      setStats(prev => ({ ...prev!, total: verseNumbers.length }));

      for (const verseNum of verseNumbers) {
        const result = await importSingleVerse(verseNum, chapterId);

        if (result.success) {
          setStats(prev => ({
            ...prev!,
            imported: prev!.imported + 1,
          }));
        } else {
          setStats(prev => ({
            ...prev!,
            errors: [...prev!.errors, `${verseNum}: ${result.error}`],
          }));
        }
      }

      toast.success(`Імпорт завершено! Імпортовано: ${stats?.imported || 0}`);

    } catch (error) {
      console.error("Помилка імпорту:", error);
      toast.error(`Помилка: ${error instanceof Error ? error.message : "Невідома помилка"}`);
    } finally {
      setIsProcessing(false);
      setCurrentStep("");
    }
  };

  // ========================================================================
  // UI
  // ========================================================================

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-2xl font-bold">Імпорт з Vedabase V3 (Повна версія)</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Налаштування */}
        <Card>
          <CardHeader>
            <CardTitle>Налаштування імпорту</CardTitle>
            <CardDescription>
              ✅ Робочий CORS fallback | ✅ Двомовний режим | ✅ Авто-нормалізація
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Книга */}
            <div>
              <Label>Книга</Label>
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VEDABASE_BOOKS.map(book => (
                    <SelectItem key={book.slug} value={book.slug}>
                      {book.name_ua} ({book.slug.toUpperCase()})
                      {book.gitabase_available && <Badge variant="outline" className="ml-2">UA</Badge>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Канто (якщо потрібно) */}
            {bookConfig?.has_cantos && (
              <div>
                <Label>Канто/Ліла</Label>
                <Input
                  type="number"
                  value={cantoNumber}
                  onChange={(e) => setCantoNumber(e.target.value)}
                  min="1"
                />
              </div>
            )}

            {/* Глава */}
            <div>
              <Label>Глава</Label>
              <Input
                type="number"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(e.target.value)}
                min="1"
              />
            </div>

            {/* Діапазон віршів */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Від вірша</Label>
                <Input
                  type="number"
                  value={fromVerse}
                  onChange={(e) => setFromVerse(e.target.value)}
                  min="1"
                />
              </div>
              <div>
                <Label>До вірша</Label>
                <Input
                  type="number"
                  value={toVerse}
                  onChange={(e) => setToVerse(e.target.value)}
                  min="1"
                />
              </div>
            </div>

            {/* Опції */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="importEN"
                  checked={importEN}
                  onCheckedChange={(checked) => setImportEN(checked as boolean)}
                />
                <Label htmlFor="importEN">Імпортувати англійською (Vedabase)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="importUA"
                  checked={importUA}
                  onCheckedChange={(checked) => setImportUA(checked as boolean)}
                />
                <Label htmlFor="importUA">Імпортувати українською</Label>
              </div>
              {importUA && (
                <>
                  <div className="flex items-center space-x-2 ml-6">
                    <Checkbox
                      id="useGitabase"
                      checked={useGitabase}
                      onCheckedChange={(checked) => setUseGitabase(checked as boolean)}
                      disabled={!bookConfig?.gitabase_available}
                    />
                    <Label htmlFor="useGitabase">
                      Використати Gitabase (з автовиправленням)
                      {!bookConfig?.gitabase_available && " - недоступно"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-6">
                    <Checkbox
                      id="useVedabaseUA"
                      checked={useVedabaseUA}
                      onCheckedChange={(checked) => setUseVedabaseUA(checked as boolean)}
                    />
                    <Label htmlFor="useVedabaseUA">
                      Використати Vedabase-UA (офіційна українська)
                    </Label>
                  </div>
                </>
              )}
            </div>

            <Button
              onClick={startImport}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isProcessing ? currentStep || "Обробка..." : "Розпочати імпорт"}
            </Button>
          </CardContent>
        </Card>

        {/* Статистика */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Статистика імпорту</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Всього</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.imported}</div>
                  <div className="text-sm text-muted-foreground">Імпортовано</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.errors.length}</div>
                  <div className="text-sm text-muted-foreground">Помилок</div>
                </div>
              </div>

              {stats.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Помилки:</h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {stats.errors.map((error, i) => (
                      <div key={i} className="text-sm text-red-600 flex items-start gap-2">
                        <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
