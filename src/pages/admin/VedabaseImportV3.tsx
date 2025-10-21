// src/pages/admin/VedabaseImportV3.tsx
/**
 * ПОВНІСТЮ ВИПРАВЛЕНИЙ ІМПОРТЕР V3
 *
 * ✅ Нормалізація для ВСІХ джерел (Vedabase, Gitabase, Vedabase.io UA)
 * ✅ Правильна обробка українського тексту з Vedabase.io
 * ✅ Діагностика та логування
 */

import { useState } from "react";
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
import { VEDABASE_BOOKS, getBookConfig, buildVedabaseUrl, buildGitabaseUrl } from "@/utils/vedabase-books";
import { normalizeVerse, normalizeVerseField } from "@/utils/textNormalizer";
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
  const [useGitabase, setUseGitabase] = useState(false);
  const [useVedabaseUA, setUseVedabaseUA] = useState(true); // Додано

  const [stats, setStats] = useState<ImportStats | null>(null);

  const bookConfig = getBookConfig(selectedBook);

  // ========================================================================
  // CORS FALLBACK
  // ========================================================================

  const fetchHTML = async (url: string, attempt = 1): Promise<string> => {
    const maxAttempts = 3;

    try {
      console.log(`🌐 Спроба ${attempt}: ${url}`);

      // Спочатку пробуємо прямий запит
      if (attempt === 1) {
        const res = await fetch(url);
        if (res.ok) {
          const html = await res.text();
          console.log(`✅ Успішно (прямий): ${url}`);
          return html;
        }
      }

      // Якщо не вийшло, використовуємо CORS proxy
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      console.log(`🔄 Використовую proxy: ${proxyUrl}`);

      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const html = await res.text();
      console.log(`✅ Успішно (proxy): ${url}`);
      return html;
    } catch (error) {
      console.error(`❌ Помилка спроби ${attempt}:`, error);

      if (attempt < maxAttempts) {
        console.log(`⏳ Очікування перед спробою ${attempt + 1}...`);
        await new Promise((r) => setTimeout(r, 2000 * attempt));
        return fetchHTML(url, attempt + 1);
      }

      throw error;
    }
  };

  // ========================================================================
  // ПАРСЕРИ
  // ========================================================================

  const extractVedabaseContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Санскрит
    let sanskrit = "";
    const verses = doc.querySelectorAll(".verse, .r");
    verses.forEach((v) => {
      const text = v.textContent?.trim() || "";
      if (text) sanskrit += text + "\n";
    });
    sanskrit = sanskrit.trim();

    // Транслітерація (англійська IAST)
    let transliteration = "";
    const translit = doc.querySelectorAll(".vers, .r");
    translit.forEach((t) => {
      const text = t.textContent?.trim() || "";
      if (text && text !== sanskrit) transliteration += text + "\n";
    });
    transliteration = transliteration.trim();

    // Послівний переклад
    let synonyms = "";
    const syns = doc.querySelectorAll('[id*="synonyms"], .wbw');
    syns.forEach((s) => {
      const text = s.textContent?.trim() || "";
      if (text) synonyms += text + " ";
    });
    synonyms = synonyms.trim();

    // Переклад
    let translation = "";
    const trans = doc.querySelectorAll('[id*="translation"], .translation');
    trans.forEach((t) => {
      const text = t.textContent?.trim() || "";
      if (text) translation += text + "\n";
    });
    translation = translation.trim();

    // Пояснення (purport)
    let purport = "";
    const purps = doc.querySelectorAll('[id*="purport"], .purport, [class*="purport"]');
    purps.forEach((p) => {
      const text = p.textContent?.trim() || "";
      if (text && !text.includes("synonyms") && !text.includes("translation")) {
        purport += text + "\n\n";
      }
    });
    purport = purport.trim();

    console.log("📦 Vedabase витяг:", {
      sanskrit: !!sanskrit,
      transliteration: !!transliteration,
      synonyms: !!synonyms,
      translation: !!translation,
      purport: !!purport,
    });

    return { sanskrit, transliteration, synonyms, translation, purport };
  };

  const extractGitabaseContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Транслітерація (українська)
    let transliteration = "";
    const translit = doc.querySelector(".verse-ukr-transliteration");
    if (translit) {
      transliteration = translit.textContent?.trim() || "";
    }

    // Послівний переклад
    let synonyms = "";
    const syns = doc.querySelector(".synonyms");
    if (syns) {
      synonyms = syns.textContent?.trim() || "";
      // Видаляємо "Послівний переклад:"
      synonyms = synonyms.replace(/^Послівний переклад:\s*/i, "").trim();
    }

    // Переклад
    let translation = "";
    const trans = doc.querySelector(".translation");
    if (trans) {
      translation = trans.textContent?.trim() || "";
      // Видаляємо "Переклад:"
      translation = translation.replace(/^Переклад:\s*/i, "").trim();
    }

    // Пояснення
    let purport = "";
    const purp = doc.querySelector(".purport");
    if (purp) {
      purport = purp.textContent?.trim() || "";
      // Видаляємо "Пояснення:"
      purport = purport.replace(/^Пояснення:\s*/i, "").trim();
    }

    console.log("📦 Gitabase витяг:", {
      transliteration: !!transliteration,
      synonyms: !!synonyms,
      translation: !!translation,
      purport: !!purport,
    });

    return { transliteration, synonyms, translation, purport };
  };

  // ========================================================================
  // ІМПОРТ ВІРШІВ
  // ========================================================================

  const importVerses = async () => {
    setIsProcessing(true);
    setStats({ total: 0, imported: 0, skipped: 0, errors: [] });

    try {
      if (!bookConfig) {
        toast.error("Невідома книга");
        return;
      }

      // 1. Книга
      let { data: book } = await supabase.from("books").select("id").eq("vedabase_slug", selectedBook).maybeSingle();

      if (!book) {
        const { data: newBook, error: bookError } = await supabase
          .from("books")
          .insert({
            vedabase_slug: selectedBook,
            title_en: bookConfig.title,
            title_ua: bookConfig.titleUA || bookConfig.title,
          })
          .select()
          .single();

        if (bookError) throw bookError;
        book = newBook;
      }

      // 2. Пісня (якщо є)
      let cantoId: string | null = null;
      if (bookConfig.hasCanto) {
        const { data: canto, error: cantoError } = await supabase
          .from("cantos")
          .upsert(
            {
              book_id: book.id,
              canto_number: parseInt(cantoNumber),
              title_en: `Canto ${cantoNumber}`,
              title_ua: `Пісня ${cantoNumber}`,
            },
            { onConflict: "book_id,canto_number" },
          )
          .select()
          .single();

        if (cantoError) throw cantoError;
        cantoId = canto.id;
      }

      // 3. Розділ
      const { data: chapter, error: chapterError } = await supabase
        .from("chapters")
        .upsert(
          {
            book_id: book.id,
            canto_id: cantoId,
            chapter_number: parseInt(chapterNumber),
            title_en: `Chapter ${chapterNumber}`,
            title_ua: `Розділ ${chapterNumber}`,
          },
          { onConflict: cantoId ? "canto_id,chapter_number" : "book_id,chapter_number" },
        )
        .select()
        .single();

      if (chapterError) throw chapterError;
      const chapterId = chapter.id;

      // 4. Імпорт віршів
      const from = parseInt(fromVerse);
      const to = parseInt(toVerse);
      const total = to - from + 1;
      setStats({ total, imported: 0, skipped: 0, errors: [] });

      for (let i = from; i <= to; i++) {
        const verseNum = String(i);
        setCurrentStep(`Імпорт вірша ${verseNum}/${to}...`);

        // Змінні для збору даних
        let sanskrit = "";
        let transliterationEN = "";
        let transliterationUA = "";
        let synonymsEN = "";
        let synonymsUA = "";
        let translationEN = "";
        let translationUA = "";
        let purportEN = "";
        let purportUA = "";

        // ============================================================
        // VEDABASE (EN) - англійська версія
        // ============================================================
        if (importEN) {
          try {
            const vedabaseUrl = buildVedabaseUrl(bookConfig, {
              canto: cantoNumber,
              chapter: chapterNumber,
              verse: verseNum,
            });

            console.log(`📖 Завантаження Vedabase EN: ${vedabaseUrl}`);
            const html = await fetchHTML(vedabaseUrl);
            const data = extractVedabaseContent(html);

            sanskrit = data.sanskrit;
            transliterationEN = data.transliteration; // IAST латиниця
            synonymsEN = data.synonyms;
            translationEN = data.translation;
            purportEN = data.purport;

            await new Promise((r) => setTimeout(r, 500));
          } catch (e) {
            console.error(`❌ Помилка Vedabase EN ${verseNum}:`, e);
          }
        }

        // ============================================================
        // VEDABASE.IO (UA) - офіційна українська версія
        // ============================================================
        if (importUA && useVedabaseUA && bookConfig) {
          try {
            const vedabaseUAUrl = buildVedabaseUrl(bookConfig, {
              canto: cantoNumber,
              chapter: chapterNumber,
              verse: verseNum,
            }).replace("/en/", "/uk/"); // або /ua/ в залежності від сайту

            console.log(`📖 Завантаження Vedabase.io UA: ${vedabaseUAUrl}`);
            const html = await fetchHTML(vedabaseUAUrl);
            const data = extractVedabaseContent(html);

            // КРИТИЧНО: нормалізуємо українські дані з Vedabase.io
            if (!transliterationUA && data.transliteration) {
              transliterationUA = normalizeVerseField(data.transliteration, "transliteration");
            }
            if (!synonymsUA && data.synonyms) {
              synonymsUA = normalizeVerseField(data.synonyms, "synonyms");
            }
            if (!translationUA && data.translation) {
              translationUA = normalizeVerseField(data.translation, "translation");
            }
            if (!purportUA && data.purport) {
              purportUA = normalizeVerseField(data.purport, "commentary");
            }

            console.log("✅ Нормалізовано UA з Vedabase.io:", {
              transliteration: !!transliterationUA,
              synonyms: !!synonymsUA,
              translation: !!translationUA,
              purport: !!purportUA,
            });

            await new Promise((r) => setTimeout(r, 500));
          } catch (e) {
            console.error(`❌ Помилка Vedabase.io UA ${verseNum}:`, e);
          }
        }

        // ============================================================
        // GITABASE (UA) - альтернативна українська версія
        // ============================================================
        if (importUA && useGitabase) {
          try {
            const gitabaseUrl = buildGitabaseUrl(bookConfig, {
              canto: cantoNumber,
              chapter: chapterNumber,
              verse: verseNum,
            });

            console.log(`📖 Завантаження Gitabase UA: ${gitabaseUrl}`);
            const html = await fetchHTML(gitabaseUrl);
            const data = extractGitabaseContent(html);

            // КРИТИЧНО: нормалізуємо українські дані з Gitabase
            if (!transliterationUA && data.transliteration) {
              transliterationUA = normalizeVerseField(data.transliteration, "transliteration");
            }
            if (!synonymsUA && data.synonyms) {
              synonymsUA = normalizeVerseField(data.synonyms, "synonyms");
            }
            if (!translationUA && data.translation) {
              translationUA = normalizeVerseField(data.translation, "translation");
            }
            if (!purportUA && data.purport) {
              purportUA = normalizeVerseField(data.purport, "commentary");
            }

            console.log("✅ Нормалізовано UA з Gitabase:", {
              transliteration: !!transliterationUA,
              synonyms: !!synonymsUA,
              translation: !!translationUA,
              purport: !!purportUA,
            });

            await new Promise((r) => setTimeout(r, 500));
          } catch (e) {
            console.error(`❌ Помилка Gitabase ${verseNum}:`, e);
          }
        }

        // ============================================================
        // НОРМАЛІЗАЦІЯ АНГЛІЙСЬКОЇ ТРАНСЛІТЕРАЦІЇ → УКРАЇНСЬКА
        // ============================================================
        if (transliterationEN && !transliterationUA) {
          console.log("🔄 Конвертую IAST → українська");
          transliterationUA = normalizeVerseField(transliterationEN, "transliteration_en");
        }

        // ============================================================
        // НОРМАЛІЗАЦІЯ САНСКРИТУ
        // ============================================================
        if (sanskrit) {
          sanskrit = normalizeVerseField(sanskrit, "sanskrit");
        }

        // Перевірка контенту
        const hasContent =
          sanskrit || synonymsEN || translationEN || purportEN || synonymsUA || translationUA || purportUA;

        if (!hasContent) {
          setStats((prev) => ({
            ...prev!,
            errors: [...prev!.errors, `${verseNum}: порожній`],
          }));
          continue;
        }

        // Збереження
        const displayBlocks = {
          sanskrit: !!sanskrit,
          transliteration: !!(transliterationUA || transliterationEN),
          synonyms: !!(synonymsEN || synonymsUA),
          translation: !!(translationEN || translationUA),
          commentary: !!(purportEN || purportUA),
        };

        const { error } = await supabase.from("verses").upsert(
          {
            chapter_id: chapterId,
            verse_number: verseNum,
            sanskrit,
            transliteration: transliterationUA || transliterationEN,
            synonyms_en: synonymsEN,
            translation_en: translationEN,
            commentary_en: purportEN,
            synonyms_ua: synonymsUA,
            translation_ua: translationUA,
            commentary_ua: purportUA,
            display_blocks: displayBlocks,
            is_published: true,
          },
          { onConflict: "chapter_id,verse_number" },
        );

        if (error) {
          console.error(`❌ Помилка збереження ${verseNum}:`, error);
          setStats((prev) => ({
            ...prev!,
            errors: [...prev!.errors, `${verseNum}: ${error.message}`],
          }));
        } else {
          console.log(`✅ Збережено ${verseNum}`);
          setStats((prev) => ({ ...prev!, imported: prev!.imported + 1 }));
        }
      }

      toast.success(`Імпорт завершено! Імпортовано: ${stats?.imported || 0}`);
    } catch (error) {
      console.error("❌ Критична помилка:", error);
      toast.error(`Помилка: ${error instanceof Error ? error.message : "Невідома"}`);
    } finally {
      setIsProcessing(false);
      setCurrentStep("");
    }
  };

  // ========================================================================
  // UI
  // ========================================================================

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад до адмінки
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Імпорт з Vedabase + Vedabase.io/Gitabase
            <Badge variant="secondary">V3 ✅ Нормалізація</Badge>
          </CardTitle>
          <CardDescription>Автоматичний імпорт віршів з нормалізацією тексту для всіх джерел</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Вибір книги */}
          <div>
            <Label>Книга</Label>
            <Select value={selectedBook} onValueChange={setSelectedBook}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(VEDABASE_BOOKS).map(([key, book]) => (
                  <SelectItem key={key} value={key}>
                    {book.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Пісня/Розділ */}
          {bookConfig?.hasCanto && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Пісня (Canto)</Label>
                <Input type="number" value={cantoNumber} onChange={(e) => setCantoNumber(e.target.value)} min="1" />
              </div>
              <div>
                <Label>Розділ (Chapter)</Label>
                <Input type="number" value={chapterNumber} onChange={(e) => setChapterNumber(e.target.value)} min="1" />
              </div>
            </div>
          )}

          {!bookConfig?.hasCanto && (
            <div>
              <Label>Розділ (Chapter)</Label>
              <Input type="number" value={chapterNumber} onChange={(e) => setChapterNumber(e.target.value)} min="1" />
            </div>
          )}

          {/* Діапазон віршів */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Від вірша</Label>
              <Input type="number" value={fromVerse} onChange={(e) => setFromVerse(e.target.value)} min="1" />
            </div>
            <div>
              <Label>До вірша</Label>
              <Input type="number" value={toVerse} onChange={(e) => setToVerse(e.target.value)} min="1" />
            </div>
          </div>

          {/* Налаштування */}
          <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-semibold">Джерела даних</h3>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="import-en"
                checked={importEN}
                onCheckedChange={(checked) => setImportEN(checked as boolean)}
              />
              <Label htmlFor="import-en" className="cursor-pointer">
                Імпортувати англійську (Vedabase.io/en)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="import-ua"
                checked={importUA}
                onCheckedChange={(checked) => setImportUA(checked as boolean)}
              />
              <Label htmlFor="import-ua" className="cursor-pointer">
                Імпортувати українську
              </Label>
            </div>

            {importUA && (
              <div className="ml-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use-vedabase-ua"
                    checked={useVedabaseUA}
                    onCheckedChange={(checked) => setUseVedabaseUA(checked as boolean)}
                  />
                  <Label htmlFor="use-vedabase-ua" className="cursor-pointer">
                    Використовувати Vedabase.io/uk (офіційна українська)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use-gitabase"
                    checked={useGitabase}
                    onCheckedChange={(checked) => setUseGitabase(checked as boolean)}
                  />
                  <Label htmlFor="use-gitabase" className="cursor-pointer">
                    Використовувати Gitabase.com (альтернативна)
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Кнопка імпорту */}
          <Button onClick={importVerses} disabled={isProcessing} className="w-full" size="lg">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {currentStep || "Обробка..."}
              </>
            ) : (
              "Імпортувати вірші"
            )}
          </Button>

          {/* Статистика */}
          {stats && (
            <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold">Статистика імпорту</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Всього</div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Імпортовано</div>
                  <div className="text-2xl font-bold text-green-600 flex items-center gap-1">
                    {stats.imported}
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Помилки</div>
                  <div className="text-2xl font-bold text-red-600 flex items-center gap-1">
                    {stats.errors.length}
                    {stats.errors.length > 0 && <XCircle className="h-5 w-5" />}
                  </div>
                </div>
              </div>

              {stats.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">Помилки:</h4>
                  <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                    {stats.errors.map((err, i) => (
                      <div key={i} className="text-red-600">
                        • {err}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
