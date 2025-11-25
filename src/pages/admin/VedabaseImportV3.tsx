// ПОВНА ВЕРСІЯ VedabaseImportV3 - Двомовний імпорт + Вступні глави
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { VEDABASE_BOOKS, getBookConfig, buildVedabaseUrl, buildGitabaseUrl } from "@/utils/Vedabase-books";
import { normalizeVerseField, convertIASTtoUkrainian } from "@/utils/textNormalizer";
import { Badge } from "@/components/ui/badge";
import { ParserStatus } from "@/components/admin/ParserStatus";
import { parseGitabaseCC } from "@/utils/dualSourceParser";

interface ImportStats {
  total: number;
  imported: number;
  skipped: number;
  errors: string[];
}

// ============================================================================
// ПАРСЕРИ
// ============================================================================

function extractVedabaseContent(html: string) {
  const result = {
    sanskrit: "",
    transliteration: "",
    synonyms: "",
    translation: "",
    purport: "",
  };

  try {
    // САНСКРИТ/БЕНГАЛІ (спільний для обох мов)
    // Спочатку пробуємо знайти блоки з класом av-bengali або av-devanagari
    const classBasedRegex = /<div[^>]*class="[^"]*av-(?:bengali|devanagari)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    const classBasedMatches = [...html.matchAll(classBasedRegex)];

    if (classBasedMatches.length > 0) {
      // Витягуємо текст з кожного блоку
      const texts = classBasedMatches.map(match => {
        return match[1]
          .replace(/<[^>]+>/g, ' ')  // Видаляємо HTML теги
          .replace(/\s+/g, ' ')       // Нормалізуємо пробіли
          .trim();
      }).filter(text => text.length > 10);

      // Об'єднуємо всі блоки з подвійним переносом рядка
      if (texts.length > 0) {
        if (texts.length > 1) {
          console.log(`[Vedabase Parser] Found ${texts.length} Bengali/Devanagari blocks (combined verse)`);
        }
        result.sanskrit = texts.join('\n\n');
      }
    } else {
      // Fallback: використовуємо старий метод з покращенням
      const devanagariMatch = html.match(/[\u0900-\u097F।॥\s]+/g);
      const bengaliMatch = html.match(/[\u0980-\u09FF।॥\s]+/g);

      const allMatches = [...(devanagariMatch || []), ...(bengaliMatch || [])];
      const validBlocks = allMatches
        .map((s) => s.trim())
        .filter((s) => s.length > 10);

      // Шукаємо блоки з номерами віршів (॥ २२२ ॥, ॥ २२९ ॥ тощо)
      const blocksWithVerseNumbers = validBlocks.filter(block => /॥\s*[\u0966-\u096F२]+\s*॥/.test(block));

      // Якщо знайдено кілька блоків з номерами віршів - це об'єднаний вірш
      if (blocksWithVerseNumbers.length > 1) {
        console.log(`[Vedabase Parser] Found ${blocksWithVerseNumbers.length} verse blocks with numbers (combined verse, fallback method)`);
        result.sanskrit = blocksWithVerseNumbers.join('\n\n');
      } else if (validBlocks.length > 0) {
        // Інакше беремо найдовший блок
        result.sanskrit = validBlocks.sort((a, b) => b.length - a.length)[0];
      }
    }

    // ТРАНСЛІТЕРАЦІЯ (IAST)
    // Спочатку пробуємо знайти блоки з класом av-verse_text
    const verseTextRegex = /<div[^>]*class="[^"]*av-verse_text[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    const verseTextMatches = [...html.matchAll(verseTextRegex)];

    if (verseTextMatches.length > 0) {
      // Витягуємо текст з кожного блоку
      const texts = verseTextMatches.map(match => {
        return match[1]
          .replace(/<[^>]+>/g, ' ')  // Видаляємо HTML теги
          .replace(/\s+/g, ' ')       // Нормалізуємо пробіли
          .trim();
      }).filter(text => {
        // Фільтруємо блоки з IAST діакритикою та достатньою довжиною
        return /[āīūṛṝḷḹēōṃḥśṣṇṭḍñṅ]/.test(text) && text.split(/\s+/).length > 2;
      });

      // Об'єднуємо всі блоки з подвійним переносом рядка
      if (texts.length > 0) {
        if (texts.length > 1) {
          console.log(`[Vedabase Parser] Found ${texts.length} transliteration blocks via av-verse_text (combined verse)`);
        }
        result.transliteration = texts.join('\n\n');
      }
    } else {
      // Fallback: використовуємо regex IAST
      const iastPattern = /\b[a-zA-Zāīūṛṝḷḹēōṃḥśṣṇṭḍñṅ\s\-']+\b/g;
      const iastMatches = html.match(iastPattern);

      if (iastMatches) {
        const withDiacritics = iastMatches.filter(
          (text) => /[āīūṛṝḷḹēōṃḥśṣṇṭḍñṅ]/.test(text) && text.trim().split(/\s+/).length > 3,
        );

        if (withDiacritics.length > 0) {
          // Сортуємо за довжиною
          const sorted = withDiacritics.sort((a, b) => b.length - a.length);

          // Перевіряємо, чи є це об'єднаний вірш (другий блок > 40% від першого)
          if (sorted.length > 1 && sorted[1].length > sorted[0].length * 0.4) {
            // Об'єднуємо перші 2-3 найдовші блоки
            const blocksToJoin = sorted.slice(0, Math.min(3, sorted.length))
              .filter(block => block.length > sorted[0].length * 0.3);
            console.log(`[Vedabase Parser] Found ${blocksToJoin.length} transliteration blocks via regex (combined verse, fallback)`);
            result.transliteration = blocksToJoin.map(s => s.trim()).join('\n\n');
          } else {
            // Звичайний вірш - беремо найдовший блок
            result.transliteration = sorted[0].trim();
          }
        }
      }
    }

    // СИНОНІМИ
    const synonymsMatch = html.match(/(?:SYNONYMS|Word for word)[:\s]*(.*?)(?=TRANSLATION|$)/is);
    if (synonymsMatch) {
      result.synonyms = synonymsMatch[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 2000);
    }

    // ПЕРЕКЛАД
    const translationMatch = html.match(/TRANSLATION[:\s]*(.*?)(?=PURPORT|COMMENTARY|$)/is);
    if (translationMatch) {
      result.translation = translationMatch[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 1000);
    }

    // ПОЯСНЕННЯ (Purport)
    const purportMatch = html.match(/(?:PURPORT|COMMENTARY)[:\s]*(.*?)$/is);
    if (purportMatch) {
      result.purport = purportMatch[1]
        .replace(/<script[^>]*>.*?<\/script>/gis, "")
        .replace(/<style[^>]*>.*?<\/style>/gis, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 10000);
    }
  } catch (error) {
    console.error("Parse error:", error);
  }

  return result;
}

function extractGitabaseContent(html: string) {
  const result = {
    transliteration: "",
    synonyms: "",
    translation: "",
    purport: "",
  };

  try {
    // Транслітерація
    const translitMatch = html.match(/<i[^>]*>([а-яґєії\s\-'ʼ]+)<\/i>/i);
    if (translitMatch) {
      result.transliteration = translitMatch[1].trim();
    }

    // Синоніми - з видаленням дублікатів
    const italicsPattern = /<i[^>]*>([^<]+)<\/i>/gi;
    const allItalics = [...html.matchAll(italicsPattern)].map((m) => m[1].trim());
    const seen = new Set<string>();
    const uniqueItalics: string[] = [];

    allItalics.forEach((text) => {
      const cleaned = text.replace(/;\s*$/, "").trim();
      if (cleaned && !seen.has(cleaned)) {
        seen.add(cleaned);
        uniqueItalics.push(cleaned);
      }
    });

    if (uniqueItalics.length > 5) {
      result.synonyms = uniqueItalics.slice(0, 60).join("; ");
    }

    // Переклад
    const translationMatch = html.match(/[«"]([^»"]{20,500})[»"]/);
    if (translationMatch) {
      result.translation = translationMatch[1].trim();
    }

    // Пояснення
    if (result.translation) {
      const purportStart = html.indexOf(result.translation) + result.translation.length;
      let purport = html
        .substring(purportStart)
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 5000);

      result.purport = purport;
    }
  } catch (error) {
    console.error("Parse error:", error);
  }

  return result;
}

// ============================================================================
// КОМПОНЕНТ
// ============================================================================

export default function VedabaseImportV3() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"verses" | "intro">("verses");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState("bg");
  const [cantoNumber, setCantoNumber] = useState("1");
  const [chapterNumber, setChapterNumber] = useState("1");
  const [fromVerse, setFromVerse] = useState("1");
  const [toVerse, setToVerse] = useState("10");

  // Для вступних глав
  const [introTitleEN, setIntroTitleEN] = useState("");
  const [introTitleUA, setIntroTitleUA] = useState("");
  const [introUrlEN, setIntroUrlEN] = useState("");
  const [introUrlUA, setIntroUrlUA] = useState("");

  // Налаштування
  const [importEN, setImportEN] = useState(true);
  const [importUA, setImportUA] = useState(true);
  const [useGitabase, setUseGitabase] = useState(true);

  const [stats, setStats] = useState<ImportStats | null>(null);
  const bookConfig = useMemo(() => getBookConfig(selectedBook), [selectedBook]);

  // ========================================================================
  // CORS PROXY
  // ========================================================================

  const fetchHTML = async (url: string, attempt = 1): Promise<string> => {
    // Спочатку пробуємо edge function
    if (attempt === 1) {
      try {
        console.log(`Спроба edge function: ${url}`);
        const { data, error } = await supabase.functions.invoke("fetch-html", {
          body: { url },
        });

        if (error) {
          throw new Error(error.message || "Edge function error");
        }

        // Check for 404 in response data
        if (data?.notFound) {
          throw new Error("Upstream 404");
        }

        if (data?.html && data.html.length > 100) {
          return data.html;
        }
        throw new Error("Порожня відповідь від edge function");
      } catch (error: any) {
        // Якщо це 404, пробросуємо помилку далі
        if (error.message?.includes("404")) {
          throw error;
        }
        console.warn("Edge function failed, trying proxies...", error);
        // Інакше пробуємо проксі
      }
    }

    // Fallback на проксі
    const proxies = [
      async () => {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Upstream 404");
          }
          throw new Error(`HTTP ${response.status}`);
        }
        return await response.text();
      },
      async () => {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Upstream 404");
          }
          throw new Error(`HTTP ${response.status}`);
        }
        return await response.text();
      },
    ];

    const proxyIndex = attempt - 2; // -2 because attempt 1 is edge function
    if (proxyIndex >= proxies.length) {
      throw new Error(`Не вдалося завантажити ${url}`);
    }

    try {
      console.log(`Спроба proxy ${proxyIndex + 1}: ${url}`);
      const html = await proxies[proxyIndex]();
      if (!html || html.length < 100) throw new Error("Порожня відповідь");
      return html;
    } catch (error: any) {
      // Якщо це 404, не пробуємо інші проксі
      if (error.message?.includes("404")) {
        throw error;
      }
      if (attempt - 1 < proxies.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchHTML(url, attempt + 1);
      }
      throw error;
    }
  };

  // ========================================================================
  // ІМПОРТ ВСТУПНОЇ ГЛАВИ
  // ========================================================================

  const importIntroChapter = async () => {
    setIsProcessing(true);
    setStats({ total: 1, imported: 0, skipped: 0, errors: [] });

    try {
      if (!bookConfig) {
        toast.error("Невідома книга");
        return;
      }

      if (!introTitleEN && !introTitleUA) {
        toast.error("Вкажіть назву хоча б однією мовою");
        return;
      }

      setCurrentStep("Створення книги...");

      // 1. Книга
      const bookQuery: any = await supabase
        .from("books")
        .select("id")
        .eq("slug", bookConfig.our_slug || selectedBook)
        .maybeSingle();
      let book = bookQuery.data;

      if (!book) {
        const { data: newBook, error } = await supabase
          .from("books")
          .insert({
            slug: bookConfig.our_slug || selectedBook,
            title_ua: bookConfig.name_ua,
            title_en: bookConfig.name_en,
            has_cantos: bookConfig.has_cantos,
            is_published: true,
          })
          .select("id")
          .single();

        if (error) {
          toast.error(`Помилка: ${error.message}`);
          return;
        }
        book = newBook;
      }

      // 2. Завантаження контенту
      let contentEN = "";
      let contentUA = "";

      if (importEN && introUrlEN) {
        setCurrentStep("Завантаження англійської версії...");
        try {
          const html = await fetchHTML(introUrlEN);
          const parsed = extractVedabaseContent(html);
          contentEN = parsed.purport || parsed.translation || "";
        } catch (e) {
          console.error("Помилка EN:", e);
        }
      }

      if (importUA && introUrlUA) {
        setCurrentStep("Завантаження української версії...");
        try {
          const html = await fetchHTML(introUrlUA);
          const parsed = useGitabase ? extractGitabaseContent(html) : extractVedabaseContent(html);
          contentUA = parsed.purport || parsed.translation || "";
        } catch (e) {
          console.error("Помилка UA:", e);
        }
      }

      // 3. Збереження
      setCurrentStep("Збереження в БД...");
      const { error } = await supabase.from("intro_chapters").insert({
        book_id: book.id,
        title_en: introTitleEN || null,
        title_ua: introTitleUA || null,
        content_en: contentEN || null,
        content_ua: contentUA || null,
        slug: (introTitleEN || introTitleUA).toLowerCase().replace(/\s+/g, "-"),
        order_index: 0,
        is_published: true,
      });

      if (error) {
        toast.error(`Помилка: ${error.message}`);
        return;
      }

      setStats((prev) => ({ ...prev!, imported: 1 }));
      toast.success("Вступну главу імпортовано!");
    } catch (error) {
      console.error("Помилка:", error);
      toast.error(`Помилка: ${error instanceof Error ? error.message : "Невідома"}`);
    } finally {
      setIsProcessing(false);
      setCurrentStep("");
    }
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
      const bookQuery2: any = await supabase
        .from("books")
        .select("id")
        .eq("slug", bookConfig.our_slug || selectedBook)
        .maybeSingle();
      let book = bookQuery2.data;

      if (!book) {
        const { data: newBook, error } = await supabase
          .from("books")
          .insert({
            slug: bookConfig.our_slug || selectedBook,
            title_ua: bookConfig.name_ua,
            title_en: bookConfig.name_en,
            has_cantos: bookConfig.has_cantos,
            is_published: true,
          })
          .select("id")
          .single();

        if (error) throw new Error(error.message);
        book = newBook;
      }

      // 2. Глава
      let chapterId: string;

      if (bookConfig.has_cantos) {
        // З канто
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

          if (error) throw new Error(error.message);
          canto = newCanto;
        }

        let { data: chapter } = await supabase
          .from("chapters")
          .select("id, title_ua, title_en")
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
            .select("id, title_ua, title_en")
            .single();

          if (error) throw new Error(error.message);
          chapter = newChapter;
        }
        // Зберігаємо існуючі назви глав

        chapterId = chapter.id;
      } else {
        // Без канто
        let { data: chapter } = await supabase
          .from("chapters")
          .select("id, title_ua, title_en")
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
            .select("id, title_ua, title_en")
            .single();

          if (error) throw new Error(error.message);
          chapter = newChapter;
        }
        // Зберігаємо існуючі назви глав

        chapterId = chapter.id;
      }

      // 3. Імпорт віршів
      const from = parseInt(fromVerse);
      const to = parseInt(toVerse);
      const verseNumbers = Array.from({ length: to - from + 1 }, (_, i) => (from + i).toString());

      setStats((prev) => ({ ...prev!, total: verseNumbers.length }));

      for (const verseNum of verseNumbers) {
        setCurrentStep(`Імпорт вірша ${verseNum}...`);

        let sanskrit = "";
        let transliterationEN = "";
        let transliterationUA = "";
        let synonymsEN = "";
        let translationEN = "";
        let purportEN = "";
        let synonymsUA = "";
        let translationUA = "";
        let purportUA = "";

        // VEDABASE (англійська)
        if (importEN && bookConfig) {
          try {
            const vedabaseUrl = buildVedabaseUrl(bookConfig, {
              canto: parseInt(cantoNumber),
              chapter: parseInt(chapterNumber),
              verse: verseNum,
            });
            const html = await fetchHTML(vedabaseUrl);
            const data = extractVedabaseContent(html);

            sanskrit = data.sanskrit; // СПІЛЬНИЙ!
            transliterationEN = data.transliteration;
            synonymsEN = data.synonyms;
            translationEN = data.translation;
            purportEN = data.purport;

            // ✅ Залишаємо EN транслітерацію в IAST як є (без конвертації)
            if (transliterationEN) {
              transliterationEN = transliterationEN.trim();
            }

            await new Promise((r) => setTimeout(r, 500));
          } catch (e: any) {
            // Якщо вірш не існує (404), пропускаємо його без помилки
            if (e?.message?.includes("404") || e?.message?.includes("Upstream 404")) {
              console.log(`Вірш ${verseNum} не знайдено на Vedabase, пропускаю...`);
              setStats((prev) => ({ ...prev!, skipped: prev!.skipped + 1 }));
              continue;
            }
            const errorMsg = `Вірш ${verseNum} [Vedabase EN]: ${e?.message || 'Невідома помилка'}`;
            console.error(errorMsg, e);
            setStats((prev) => ({
              ...prev!,
              errors: [...prev!.errors, errorMsg],
            }));
            // Continue to try Gitabase if enabled
          }
        }

        // GITABASE (українська)
        if (importUA && useGitabase && bookConfig?.gitabase_available) {
          try {
            const gitabaseUrl = buildGitabaseUrl(bookConfig.gitabaseSlug!, {
              chapter: parseInt(chapterNumber),
              verse: verseNum,
            });
            const html = await fetchHTML(gitabaseUrl!);
            const data = parseGitabaseCC(html, gitabaseUrl!);

            // ⚠️ transliteration_ua НЕ береться з Gitabase (там він зіпсований)
            // Замість цього конвертуємо IAST з Vedabase нижче
            synonymsUA = data?.synonyms_ua || "";
            translationUA = data?.translation_ua || "";
            purportUA = data?.purport_ua || "";

            await new Promise((r) => setTimeout(r, 500));
          } catch (e: any) {
            // Якщо вірш не існує (404), просто пропускаємо
            if (e?.message?.includes("404") || e?.message?.includes("Upstream 404")) {
              console.log(`Вірш ${verseNum} не знайдено на Gitabase, пропускаю...`);
            } else {
              const errorMsg = `Вірш ${verseNum} [Gitabase UA]: ${e?.message || 'Невідома помилка'}`;
              console.error(errorMsg, e);
              setStats((prev) => ({
                ...prev!,
                errors: [...prev!.errors, errorMsg],
              }));
            }
          }
        }

        // ✅ КОНВЕРТАЦІЯ IAST → Українська транслітерація
        // Беремо IAST з Vedabase і конвертуємо в українську кирилицю з діакритикою
        if (importUA && transliterationEN) {
          transliterationUA = convertIASTtoUkrainian(transliterationEN);
        }

        // ✅ НОРМАЛІЗАЦІЯ українських полів (тільки якщо імпортується UA)
        if (importUA) {
          if (transliterationUA) {
            transliterationUA = normalizeVerseField(transliterationUA, "transliteration");
          }
          if (synonymsUA) {
            synonymsUA = normalizeVerseField(synonymsUA, "synonyms");
          }
          if (translationUA) {
            translationUA = normalizeVerseField(translationUA, "translation");
          }
          if (purportUA) {
            purportUA = normalizeVerseField(purportUA, "commentary");
          }
        }

        // Перевірка контенту
        const hasContent =
          sanskrit || synonymsEN || translationEN || purportEN || synonymsUA || translationUA || purportUA;

        if (!hasContent) {
          const sources = [];
          if (importEN) sources.push('EN');
          if (importUA) sources.push('UA');
          setStats((prev) => ({
            ...prev!,
            errors: [...prev!.errors, `Вірш ${verseNum}: порожній вміст (джерела: ${sources.join(', ')})`],
          }));
          continue;
        }

        // Збереження
        const displayBlocks = {
          sanskrit: !!sanskrit,
          transliteration: !!(transliterationEN || transliterationUA),
          synonyms: !!(synonymsEN || synonymsUA),
          translation: !!(translationEN || translationUA),
          commentary: !!(purportEN || purportUA),
        };

        const { error } = await supabase.from("verses").upsert(
          {
            chapter_id: chapterId,
            verse_number: verseNum,
            sanskrit,
            transliteration: transliterationEN || null,
            transliteration_ua: transliterationUA || null,
            synonyms_en: synonymsEN || null,
            translation_en: translationEN || null,
            commentary_en: purportEN || null,
            synonyms_ua: synonymsUA || null,
            translation_ua: translationUA || null,
            commentary_ua: purportUA || null,
            is_published: true,
          },
          { onConflict: "chapter_id,verse_number" },
        );

        if (error) {
          setStats((prev) => ({
            ...prev!,
            errors: [...prev!.errors, `Вірш ${verseNum} [Database]: ${error.message}`],
          }));
        } else {
          setStats((prev) => ({ ...prev!, imported: prev!.imported + 1 }));
        }
      }

      toast.success(`Імпорт завершено! Імпортовано: ${stats?.imported || 0}`);
    } catch (error) {
      console.error("Помилка:", error);
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
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-2xl font-bold">Імпорт з Vedabase V3</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="verses">Вірші</TabsTrigger>
            <TabsTrigger value="intro">Вступні глави</TabsTrigger>
          </TabsList>

          {/* ====== ВІРШІ ====== */}
          <TabsContent value="verses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Імпорт віршів</CardTitle>
                <CardDescription>Двомовний режим: EN (Vedabase) + UA (Gitabase)</CardDescription>
                <ParserStatus className="mt-4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Книга</Label>
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VEDABASE_BOOKS.map((book) => (
                        <SelectItem key={book.slug} value={book.slug}>
                          {book.name_ua} ({book.slug.toUpperCase()})
                          {book.gitabase_available && (
                            <Badge variant="outline" className="ml-2">
                              UA
                            </Badge>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {bookConfig?.has_cantos && (
                  <div>
                    <Label>Канто/Ліла</Label>
                    <Input type="number" value={cantoNumber} onChange={(e) => setCantoNumber(e.target.value)} min="1" />
                  </div>
                )}

                <div>
                  <Label>Глава</Label>
                  <Input
                    type="number"
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(e.target.value)}
                    min="1"
                  />
                </div>

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
                    <div className="flex items-center space-x-2 ml-6">
                      <Checkbox
                        id="useGitabase"
                        checked={useGitabase}
                        onCheckedChange={(checked) => setUseGitabase(checked as boolean)}
                        disabled={!bookConfig?.gitabase_available}
                      />
                      <Label htmlFor="useGitabase">
                        Gitabase (з автовиправленням)
                        {!bookConfig?.gitabase_available && " - недоступно"}
                      </Label>
                    </div>
                  )}
                </div>

                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Примітка:</strong> Санскрит - спільний блок для обох мов. Purport = "Пояснення" українською.
                </div>

                <Button onClick={importVerses} disabled={isProcessing} className="w-full">
                  {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isProcessing ? currentStep || "Обробка..." : "Імпортувати вірші"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ====== ВСТУПНІ ГЛАВИ ====== */}
          <TabsContent value="intro" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Імпорт вступної глави</CardTitle>
                <CardDescription>Introduction, Preface, Вступ, Передмова тощо</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Книга</Label>
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VEDABASE_BOOKS.map((book) => (
                        <SelectItem key={book.slug} value={book.slug}>
                          {book.name_ua} ({book.slug.toUpperCase()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Назва англійською (необов'язково)</Label>
                    <Input
                      value={introTitleEN}
                      onChange={(e) => setIntroTitleEN(e.target.value)}
                      placeholder="Introduction"
                    />
                  </div>
                  <div>
                    <Label>Назва українською (необов'язково)</Label>
                    <Input value={introTitleUA} onChange={(e) => setIntroTitleUA(e.target.value)} placeholder="Вступ" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="importIntroEN"
                      checked={importEN}
                      onCheckedChange={(checked) => setImportEN(checked as boolean)}
                    />
                    <Label htmlFor="importIntroEN">Імпортувати англійською</Label>
                  </div>
                  {importEN && (
                    <div className="ml-6">
                      <Label>URL англійської версії</Label>
                      <Input
                        value={introUrlEN}
                        onChange={(e) => setIntroUrlEN(e.target.value)}
                        placeholder="https://vedabase.io/en/library/bg/introduction/"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="importIntroUA"
                      checked={importUA}
                      onCheckedChange={(checked) => setImportUA(checked as boolean)}
                    />
                    <Label htmlFor="importIntroUA">Імпортувати українською</Label>
                  </div>
                  {importUA && (
                    <div className="ml-6">
                      <Label>URL української версії</Label>
                      <Input
                        value={introUrlUA}
                        onChange={(e) => setIntroUrlUA(e.target.value)}
                        placeholder="https://gitabase.com/ukr/BG/introduction"
                      />
                    </div>
                  )}
                </div>

                <Button onClick={importIntroChapter} disabled={isProcessing} className="w-full">
                  {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isProcessing ? currentStep || "Обробка..." : "Імпортувати вступну главу"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Статистика */}
        {stats && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
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
