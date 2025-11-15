import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Globe, BookOpen, FileText, CheckCircle, Download, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ParserStatus } from "@/components/admin/ParserStatus";
import { getMaxVerseFromChapter } from "@/utils/vedabaseParser";
import { parseVedabaseCC, parseGitabaseCC, mergeVedabaseAndGitabase } from "@/utils/dualSourceParser";
import { parseNoIVedabase, parseNoIGitabase } from "@/utils/noiParser";
import { parseVerseNumber, normalizeVerseNumber, extractVerseNumberFromUrl } from "@/utils/vedabaseParsers";
import {
  parseBhaktivinodaPage,
  parseBhaktivinodaSongPage,
  extractSongUrls,
  groupSongUrlsByCantos,
  determineCantoFromUrl,
  getBhaktivinodaTitle,
  bhaktivinodaSongToChapter,
  BhaktivinodaSong,
} from "@/utils/bhaktivinodaParser";
import { extractKKSongUrls, deriveKKSongUrls, parseKKSongComplete } from "@/utils/kksongsParser";
import {
  extractWisdomlibChapterUrls,
  parseWisdomlibChapterPage,
  parseWisdomlibVersePage,
  determineKhandaFromUrl,
  wisdomlibChapterToStandardChapter,
  WisdomlibChapter,
} from "@/utils/wisdomlibParser";
import {
  parseRajaVidyaEPUB,
  parseRajaVidyaVedabase,
  mergeRajaVidyaChapters,
} from "@/utils/rajaVidyaParser";
import { supabase } from "@/integrations/supabase/client";
import { normalizeTransliteration } from "@/utils/text/translitNormalize";
import { importSingleChapter } from "@/utils/import/importer";
import { extractTextFromPDF } from "@/utils/import/pdf";
import { extractTextFromEPUB } from "@/utils/import/epub";
import { extractTextFromDOCX } from "@/utils/import/docx";
import { splitIntoChapters } from "@/utils/import/splitters";
import { BOOK_TEMPLATES, ImportTemplate } from "@/types/book-import";
import { VEDABASE_BOOKS, getBookConfigByVedabaseSlug } from "@/utils/Vedabase-books";
import { LectureImporter } from "@/components/admin/LectureImporter";
import { LetterImporter } from "@/components/admin/LetterImporter";

// 🐍 ЛОКАЛЬНИЙ PYTHON PARSER (для обходу обмежень Puppeteer в Supabase Edge Functions)
// Встановіть true щоб використовувати parse_server.py для Gitabase (потребує запущеного сервера на порту 5003)
const USE_LOCAL_PARSER = true;
const LOCAL_PARSER_URL = "http://127.0.0.1:5003/admin/parse-web-chapter";

// Типи станів
type ImportSource = "file" | "vedabase" | "gitabase" | "bhaktivinoda";
type Step = "source" | "file" | "intro" | "normalize" | "process" | "preview" | "save";

interface ImportData {
  source: ImportSource;
  rawText: string;
  processedText: string;
  chapters: any[];
  metadata: {
    title_ua: string;
    title_en: string;
    author: string;
    book_slug?: string;
    vedabase_slug?: string;
    volume?: string;
    canto?: string;
    lila_name?: string;
    source_url?: string;
  };
}

// TODO: Додати підтримку bhaktivinodainstitute.org для пісень та поем (Шікшаштака, Шаранагаті тощо)

// 👇 головна змінна: адреса парсера (якщо не налаштовано - використовуємо fallback)
const PARSE_ENDPOINT = import.meta.env.VITE_PARSER_URL
  ? `${import.meta.env.VITE_PARSER_URL}/admin/parse-web-chapter`
  : null;

/**
 * Invoke fetch-html with retry logic and exponential backoff
 * Handles retriable errors from Edge function
 */
async function invokeWithRetry(
  supabase: any,
  url: string,
  maxRetries = 3,
  backoffMs = [800, 1500, 2500],
): Promise<{ html?: string; error?: string; notFound?: boolean }> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const { data, error } = await supabase.functions.invoke("fetch-html", {
        body: { url },
      });

      if (error) {
        console.warn(`[invokeWithRetry] Attempt ${attempt + 1}/${maxRetries} error:`, error);
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, backoffMs[attempt]));
          continue;
        }
        return { error: error.message || "Unknown error" };
      }

      if (data?.html) {
        return { html: data.html };
      }

      if (data?.notFound) {
        return { notFound: true };
      }

      if (data?.retriable) {
        console.warn(`[invokeWithRetry] Attempt ${attempt + 1}/${maxRetries} retriable error:`, data.error);
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, backoffMs[attempt]));
          continue;
        }
        return { error: data.error || "Retriable error exhausted" };
      }

      return { error: "No HTML returned" };
    } catch (e) {
      console.error(`[invokeWithRetry] Attempt ${attempt + 1}/${maxRetries} exception:`, e);
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, backoffMs[attempt]));
        continue;
      }
      return { error: e instanceof Error ? e.message : "Unknown exception" };
    }
  }

  return { error: "Max retries exceeded" };
}

/**
 * Sleep helper for throttling requests
 */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function UniversalImportFixed() {
  const [currentStep, setCurrentStep] = useState<Step>("source");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importData, setImportData] = useState<ImportData>({
    source: "file",
    rawText: "",
    processedText: "",
    chapters: [],
    metadata: {
      title_ua: "",
      title_en: "",
      author: "Шріла Прабгупада",
    },
  });

  // Vedabase
  const [vedabaseBook, setVedabaseBook] = useState("cc");
  const [vedabaseCanto, setVedabaseCanto] = useState("");
  const [vedabaseChapter, setVedabaseChapter] = useState("");
  const [vedabaseVerse, setVedabaseVerse] = useState("");

  // File import
  const [fileText, setFileText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("bhagavad-gita");
  const [parsedChapters, setParsedChapters] = useState<any[]>([]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);

  // Wisdomlib import
  const [wisdomlibThrottle, setWisdomlibThrottle] = useState(1000); // ms between requests
  const [skippedUrls, setSkippedUrls] = useState<Array<{ url: string; reason: string }>>([]);

  const navigate = useNavigate();

  const currentBookInfo = useMemo(() => getBookConfigByVedabaseSlug(vedabaseBook), [vedabaseBook]);

  const lilaNum = useMemo(() => {
    const map: Record<string, number> = { adi: 1, madhya: 2, antya: 3 };
    return map[vedabaseCanto.toLowerCase()] || 1;
  }, [vedabaseCanto]);

  /** 🐍 Парсинг через локальний Python server (обхід обмежень Puppeteer в Supabase) */
  const parseChapterWithPythonServer = async (params: {
    lila: number;
    chapter: number;
    verse_ranges: string;
    vedabase_base: string;
    gitabase_base: string;
  }) => {
    console.log(`[Python Parser] Calling local parse_server:`, params);

    try {
      const response = await fetch(LOCAL_PARSER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Parse server error: ${error.error || error.detail || response.statusText}`);
      }

      const result = await response.json();
      console.log(`[Python Parser] Success! Parsed ${result.verses?.length || 0} verses`);
      return result;
    } catch (error) {
      console.error("[Python Parser] Failed:", error);
      throw error;
    }
  };

  /** Імпорт з Vedabase */
  const handleVedabaseImport = useCallback(async () => {
    if (!vedabaseChapter) {
      toast({ title: "Помилка", description: "Вкажіть номер глави", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setProgress(10);

    try {
      let chapterNum = parseInt(vedabaseChapter, 10);
      const bookInfo = getBookConfigByVedabaseSlug(vedabaseBook)!;

      // ✅ FIX: NoI не має глав, всі 11 текстів мають бути в одній главі
      // Для hasSpecialStructure книг (NoI): завжди створюємо chapter_number = 1
      // А номер що ввів користувач (1-11) буде verse_number
      let verseRangesOverride = vedabaseVerse;
      if ((bookInfo as any).hasSpecialStructure) {
        console.log(
          `[NoI] Book has special structure - forcing chapter_number = 1 (user entered ${chapterNum} as verse range)`,
        );
        // Якщо користувач ввів номер в поле "Глава" - це насправді номер тексту
        // Переносимо його в verseRanges якщо verse field порожнє
        if (!vedabaseVerse && chapterNum >= 1 && chapterNum <= 11) {
          console.log(`[NoI] Moving chapter ${chapterNum} to verse_number`);
          verseRangesOverride = String(chapterNum);
        }
        chapterNum = 1; // Всі NoI тексти в главі 1
      }

      // Автоматично визначаємо максимальний вірш якщо не вказано
      let verseRanges = verseRangesOverride;
      if (!verseRanges) {
        try {
          // ✅ Формуємо URL залежно від типу книги
          // ⚠️ Для NoI: використовуємо /noi/ (без chapter), парсимо список текстів з головної сторінки
          const chapterUrl = bookInfo.isMultiVolume
            ? `https://vedabase.io/en/library/${vedabaseBook}/${vedabaseCanto}/${chapterNum}/`
            : (bookInfo as any).hasSpecialStructure
              ? `https://vedabase.io/en/library/${vedabaseBook}/` // NoI: головна сторінка
              : `https://vedabase.io/en/library/${vedabaseBook}/${chapterNum}/`;

          const { data: chapterData } = await supabase.functions.invoke("fetch-html", { body: { url: chapterUrl } });
          const maxVerse = getMaxVerseFromChapter(chapterData.html);
          verseRanges = maxVerse > 0 ? `1-${maxVerse}` : "1-500";
          toast({ title: "📖 Визначено діапазон", description: `Вірші 1-${maxVerse > 0 ? maxVerse : 500}` });
        } catch {
          verseRanges = "1-500"; // Збільшено default ліміт до 500
        }
      }

      // ✅ Формуємо базові URL залежно від типу книги
      // ⚠️ Для NoI (hasSpecialStructure): URL без глави - /noi/{verseNumber}/
      const vedabase_base = bookInfo.isMultiVolume
        ? `https://vedabase.io/en/library/${vedabaseBook}/${vedabaseCanto}/${chapterNum}/`
        : (bookInfo as any).hasSpecialStructure
          ? `https://vedabase.io/en/library/${vedabaseBook}/` // NoI: /noi/{verseNumber}/
          : `https://vedabase.io/en/library/${vedabaseBook}/${chapterNum}/`;

      // ✅ FIX: Використовуємо bookInfo.gitabaseSlug для правильного регістру (NoI, не NOI)
      const gitabaseBookSlug = bookInfo.gitabaseSlug || vedabaseBook.toUpperCase();
      const gitabase_base = bookInfo.isMultiVolume
        ? `https://gitabase.com/ukr/${gitabaseBookSlug}/${lilaNum}/${chapterNum}`
        : (bookInfo as any).hasSpecialStructure
          ? `https://gitabase.com/ukr/${gitabaseBookSlug}/` // NoI: /NoI/{verseNumber}
          : `https://gitabase.com/ukr/${gitabaseBookSlug}/${chapterNum}`;

      let result: any = null;

      // 🐍 Використовуємо локальний Python parser (обхід обмежень Puppeteer в Supabase)
      if (USE_LOCAL_PARSER && bookInfo.hasGitabaseUA) {
        try {
          console.log("🐍 Using local Python parser (parse_server.py)");
          toast({ title: "🐍 Python парсер", description: "Звернення до локального parse_server.py..." });

          result = await parseChapterWithPythonServer({
            lila: lilaNum,
            chapter: chapterNum,
            verse_ranges: verseRanges,
            vedabase_base,
            gitabase_base,
          });

          // ✅ Перевірка якості: якщо порожньо або відсутні ключові поля — примусово fallback
          const badResult =
            !Array.isArray(result?.verses) ||
            !result.verses.length ||
            result.verses.every(
              (v: any) =>
                !(
                  v?.translation_en ||
                  v?.translation_ua ||
                  v?.synonyms_en ||
                  v?.synonyms_ua ||
                  v?.commentary_en ||
                  v?.commentary_ua
                ),
            );
          if (badResult) {
            throw new Error("Python result is empty/incomplete — switching to browser fallback");
          }

          console.log(`✅ Python parser успішно: ${result.verses.length} віршів`);
          toast({
            title: "✅ Python парсер успішний",
            description: `Отримано ${result.verses.length} віршів з UA перекладами`,
          });
        } catch (err: any) {
          console.error("🐍 Python parser failed:", err);
          toast({
            title: "⚠️ Python parser провалився",
            description: `${err.message}. Fallback на browser parsing...`,
            variant: "destructive",
          });
          result = null; // Примусово переходимо до fallback
        }
      }

      // Fallback: якщо парсер не увімкнений або повернув помилку
      if (!result) {
        toast({ title: "🌐 Browser парсинг", description: "Використовується Edge-функції (EN + UA)" });

        const [start, end] = verseRanges.includes("-")
          ? verseRanges.split("-").map(Number)
          : [parseInt(verseRanges, 10), parseInt(verseRanges, 10)];

        const verses: any[] = [];

        // 🧭 1) Знімаємо індекс посилань з сторінки глави (щоб виявляти "7-8", "10-16")
        try {
          // ✅ Використовуємо ту саму логіку формування URL
          const chapterUrl = bookInfo.isMultiVolume
            ? `https://vedabase.io/en/library/${vedabaseBook}/${vedabaseCanto}/${chapterNum}/`
            : `https://vedabase.io/en/library/${vedabaseBook}/${chapterNum}/`;

          const { data: chapterHtml } = await supabase.functions.invoke("fetch-html", { body: { url: chapterUrl } });
          const map: Array<{ lastPart: string; from: number; to: number }> = [];
          if (chapterHtml?.html) {
            const dp = new DOMParser();
            const doc = dp.parseFromString(chapterHtml.html, "text/html");

            // ✅ Селектор також залежить від типу книги
            const hrefPattern = bookInfo.isMultiVolume
              ? `/${vedabaseBook}/${vedabaseCanto}/${chapterNum}/`
              : `/${vedabaseBook}/${chapterNum}/`;
            const anchors = Array.from(doc.querySelectorAll(`a[href*="${hrefPattern}"]`));
            anchors.forEach((a) => {
              const href = a.getAttribute("href") || "";
              const seg = href.split("/").filter(Boolean).pop() || "";
              if (!seg) return;
              if (/^\d+(?:-\d+)?$/.test(seg)) {
                if (seg.includes("-")) {
                  const [s, e] = seg.split("-").map((n) => parseInt(n, 10));
                  if (!Number.isNaN(s) && !Number.isNaN(e)) map.push({ lastPart: seg, from: s, to: e });
                } else {
                  const n = parseInt(seg, 10);
                  if (!Number.isNaN(n)) map.push({ lastPart: seg, from: n, to: n });
                }
              }
            });

            // Фільтруємо лише сегменти, що перетинаються з [start, end], та унікалізуємо за lastPart
            const unique = new Map<string, { lastPart: string; from: number; to: number }>();
            map
              .filter((m) => !(m.to < start || m.from > end))
              .sort((a, b) => a.from - b.from)
              .forEach((m) => unique.set(m.lastPart, m));

            const targets = Array.from(unique.values());

            // 2) Парсимо кожен таргет як окремий вірш (включно з об'єднаними)
            for (const t of targets) {
              try {
                // ✅ Формуємо URL залежно від типу книги
                // ⚠️ Для NoI (hasSpecialStructure): /noi/{verseNumber}/ замість /noi/{chapter}/{verseNumber}/
                const vedabaseUrl = bookInfo.isMultiVolume
                  ? `https://vedabase.io/en/library/${vedabaseBook}/${vedabaseCanto}/${chapterNum}/${t.lastPart}`
                  : (bookInfo as any).hasSpecialStructure
                    ? `https://vedabase.io/en/library/${vedabaseBook}/${t.lastPart}` // NoI: /noi/{verseNumber}/
                    : `https://vedabase.io/en/library/${vedabaseBook}/${chapterNum}/${t.lastPart}`;

                // ✅ Gitabase тільки для CC та NoI
                const requests: Promise<any>[] = [
                  supabase.functions.invoke("fetch-html", { body: { url: vedabaseUrl } }),
                ];

                if (bookInfo.hasGitabaseUA) {
                  // ✅ ВИПРАВЛЕНО: використовуємо t.lastPart для підтримки складених віршів (263-264)
                  // ⚠️ Для NoI (hasSpecialStructure): /NoI/{verseNumber} замість /NoI/{chapter}/{verseNumber}
                  // ✅ FIX: Використовуємо bookInfo.gitabaseSlug для правильного регістру (NoI, не NOI)
                  const gitabaseBookSlug = bookInfo.gitabaseSlug || vedabaseBook.toUpperCase();
                  const gitabaseUrl = bookInfo.isMultiVolume
                    ? `https://gitabase.com/ukr/${gitabaseBookSlug}/${lilaNum}/${chapterNum}/${t.lastPart}`
                    : (bookInfo as any).hasSpecialStructure
                      ? `https://gitabase.com/ukr/${gitabaseBookSlug}/${t.lastPart}` // NoI: /NoI/{verseNumber}
                      : `https://gitabase.com/ukr/${gitabaseBookSlug}/${chapterNum}/${t.lastPart}`;
                  console.log(`[Gitabase] URL: ${gitabaseUrl}`);
                  requests.push(supabase.functions.invoke("fetch-html", { body: { url: gitabaseUrl } }));
                }

                const results = await Promise.allSettled(requests);
                const vedabaseRes = results[0];
                const gitabaseRes = bookInfo.hasGitabaseUA ? results[1] : null;

                console.log(`📊 Fetch results for verse ${t.lastPart}:`, {
                  vedabaseStatus: vedabaseRes.status,
                  gitabaseStatus: gitabaseRes?.status || "N/A",
                  vedabaseHasData: vedabaseRes.status === "fulfilled" && !!vedabaseRes.value?.data,
                  gitabaseHasData: gitabaseRes?.status === "fulfilled" && !!gitabaseRes?.value?.data,
                });

                let parsedEN: any = null;
                let parsedUA: any = null;

                // ✅ NoI має спеціалізований парсер через іншу HTML структуру
                const useNoIParser = (bookInfo as any).hasSpecialStructure;

                if (vedabaseRes.status === "fulfilled" && vedabaseRes.value.data) {
                  if (useNoIParser) {
                    parsedEN = parseNoIVedabase(vedabaseRes.value.data.html, vedabaseUrl);
                    console.log(`✅ [NoI] Vedabase parsed for ${t.lastPart}`);
                  } else {
                    parsedEN = parseVedabaseCC(vedabaseRes.value.data.html, vedabaseUrl);
                    console.log(`✅ Vedabase parsed for ${t.lastPart}:`, {
                      hasSynonyms: !!parsedEN?.synonyms_en,
                      hasTranslation: !!parsedEN?.translation_en,
                    });
                  }
                }

                // ✅ Парсимо UA тільки якщо робили запит
                if (bookInfo.hasGitabaseUA && gitabaseRes?.status === "fulfilled" && gitabaseRes.value.data) {
                  // ✅ ВИПРАВЛЕНО: використовуємо t.lastPart для підтримки складених віршів (263-264)
                  // ✅ FIX: Використовуємо bookInfo.gitabaseSlug для правильного регістру (NoI, не NOI)
                  const gitabaseBookSlug = bookInfo.gitabaseSlug || vedabaseBook.toUpperCase();
                  const gitabaseUrl = bookInfo.isMultiVolume
                    ? `https://gitabase.com/ukr/${gitabaseBookSlug}/${lilaNum}/${chapterNum}/${t.lastPart}`
                    : (bookInfo as any).hasSpecialStructure
                      ? `https://gitabase.com/ukr/${gitabaseBookSlug}/${t.lastPart}`
                      : `https://gitabase.com/ukr/${gitabaseBookSlug}/${chapterNum}/${t.lastPart}`;
                  console.log(`🇺🇦 Parsing Gitabase for ${t.lastPart}:`, gitabaseUrl);

                  if (useNoIParser) {
                    parsedUA = parseNoIGitabase(gitabaseRes.value.data.html, gitabaseUrl);
                    console.log(`✅ [NoI] Gitabase parsed for ${t.lastPart}`);
                  } else {
                    parsedUA = parseGitabaseCC(gitabaseRes.value.data.html, gitabaseUrl);
                    console.log(`✅ Gitabase parsed for ${t.lastPart}:`, {
                      hasSynonyms: !!parsedUA?.synonyms_ua,
                      hasTranslation: !!parsedUA?.translation_ua,
                      synonymsPreview: parsedUA?.synonyms_ua?.substring(0, 50),
                    });
                  }
                } else {
                  console.warn(`⚠️ Gitabase skipped for ${t.lastPart}:`, {
                    hasGitabaseUA: bookInfo.hasGitabaseUA,
                    gitabaseResFulfilled: gitabaseRes?.status === "fulfilled",
                    gitabaseHasData: gitabaseRes?.status === "fulfilled" && !!gitabaseRes?.value?.data,
                  });
                }

                // ✅ Використовуємо новий merger для об'єднання EN + UA
                const merged = mergeVedabaseAndGitabase(
                  parsedEN,
                  parsedUA,
                  vedabaseCanto, // lila
                  chapterNum,
                  t.lastPart, // verse number
                  vedabaseUrl,
                  bookInfo.hasGitabaseUA
                    ? // ✅ ВИПРАВЛЕНО: використовуємо t.lastPart для підтримки складених віршів (263-264)
                      // ⚠️ Для NoI (hasSpecialStructure): /NoI/{verseNumber} замість /NoI/{chapter}/{verseNumber}
                      // ✅ FIX: Використовуємо bookInfo.gitabaseSlug для правильного регістру (NoI, не NOI)
                      bookInfo.isMultiVolume
                      ? `https://gitabase.com/ukr/${gitabaseBookSlug}/${lilaNum}/${chapterNum}/${t.lastPart}`
                      : (bookInfo as any).hasSpecialStructure
                        ? `https://gitabase.com/ukr/${gitabaseBookSlug}/${t.lastPart}`
                        : `https://gitabase.com/ukr/${gitabaseBookSlug}/${chapterNum}/${t.lastPart}`
                    : "",
                );

                // Тільки додаємо вірш якщо є хоч якийсь контент
                if (merged) {
                  verses.push({
                    verse_number: t.lastPart, // ← "7" або "7-8"
                    sanskrit: merged.bengali || "",
                    transliteration_en: merged.transliteration_en || "",
                    transliteration_ua: merged.transliteration_ua || "",
                    synonyms_en: merged.synonyms_en || "",
                    synonyms_ua: merged.synonyms_ua || "",
                    translation_en: merged.translation_en || "",
                    translation_ua: merged.translation_ua || "",
                    commentary_en: merged.purport_en || "",
                    commentary_ua: merged.purport_ua || "",
                  });
                } else {
                  console.log(`⏭️ Пропускаю сегмент ${t.lastPart} (немає контенту)`);
                }
              } catch (e: any) {
                console.warn(`⚠️ Failed segment ${t.lastPart}:`, e.message);
              }
            }

            console.log(`✅ Fallback parsed ${verses.length} segment(s)`);
            result = { verses };
          } else {
            throw new Error("No chapter HTML");
          }
        } catch (e) {
          console.warn("Chapter TOC parse failed, using simple numeric loop", e);
          // Простий попередній алгоритм (на випадок збою)
          for (let v = start; v <= end; v++) {
            try {
              // ✅ Формуємо URL залежно від типу книги
              // ⚠️ Для NoI (hasSpecialStructure): /noi/{v}/ замість /noi/{chapter}/{v}/
              const vedabaseUrl = bookInfo.isMultiVolume
                ? `https://vedabase.io/en/library/${vedabaseBook}/${vedabaseCanto}/${chapterNum}/${v}`
                : (bookInfo as any).hasSpecialStructure
                  ? `https://vedabase.io/en/library/${vedabaseBook}/${v}` // NoI: /noi/{v}/
                  : `https://vedabase.io/en/library/${vedabaseBook}/${chapterNum}/${v}`;

              // ✅ Gitabase тільки для CC та NoI
              const requests: Promise<any>[] = [
                supabase.functions.invoke("fetch-html", { body: { url: vedabaseUrl } }),
              ];

              if (bookInfo.hasGitabaseUA) {
                // ✅ FIX: Використовуємо bookInfo.gitabaseSlug для правильного регістру (NoI, не NOI)
                const gitabaseBookSlug = bookInfo.gitabaseSlug || vedabaseBook.toUpperCase();
                const gitabaseUrl = bookInfo.isMultiVolume
                  ? `https://gitabase.com/ukr/${gitabaseBookSlug}/${lilaNum}/${chapterNum}/${v}`
                  : (bookInfo as any).hasSpecialStructure
                    ? `https://gitabase.com/ukr/${gitabaseBookSlug}/${v}` // NoI: /NoI/{v}
                    : `https://gitabase.com/ukr/${gitabaseBookSlug}/${chapterNum}/${v}`;
                console.log(`[Gitabase Fallback] URL: ${gitabaseUrl}`);
                requests.push(supabase.functions.invoke("fetch-html", { body: { url: gitabaseUrl } }));
              }

              const results = await Promise.allSettled(requests);
              const vedabaseRes = results[0];
              const gitabaseRes = bookInfo.hasGitabaseUA ? results[1] : null;

              console.log(`📊 [Fallback] Fetch results for verse ${v}:`, {
                vedabaseStatus: vedabaseRes.status,
                gitabaseStatus: gitabaseRes?.status || "N/A",
                vedabaseHasData: vedabaseRes.status === "fulfilled" && !!vedabaseRes.value?.data,
                gitabaseHasData: gitabaseRes?.status === "fulfilled" && !!gitabaseRes?.value?.data,
              });

              let parsedEN: any = null;
              let parsedUA: any = null;

              // ✅ NoI має спеціалізований парсер
              const useNoIParser = (bookInfo as any).hasSpecialStructure;

              if (vedabaseRes.status === "fulfilled" && vedabaseRes.value.data) {
                if (useNoIParser) {
                  parsedEN = parseNoIVedabase(vedabaseRes.value.data.html, vedabaseUrl);
                } else {
                  parsedEN = parseVedabaseCC(vedabaseRes.value.data.html, vedabaseUrl);
                }
              }

              // ✅ Парсимо UA тільки якщо робили запит
              if (bookInfo.hasGitabaseUA && gitabaseRes?.status === "fulfilled" && gitabaseRes.value.data) {
                // ⚠️ Для NoI (hasSpecialStructure): /NoI/{v} замість /NoI/{chapter}/{v}
                // ✅ FIX: Використовуємо bookInfo.gitabaseSlug для правильного регістру (NoI, не NOI)
                const gitabaseBookSlug = bookInfo.gitabaseSlug || vedabaseBook.toUpperCase();
                const gitabaseUrl = bookInfo.isMultiVolume
                  ? `https://gitabase.com/ukr/${gitabaseBookSlug}/${lilaNum}/${chapterNum}/${v}`
                  : (bookInfo as any).hasSpecialStructure
                    ? `https://gitabase.com/ukr/${gitabaseBookSlug}/${v}`
                    : `https://gitabase.com/ukr/${gitabaseBookSlug}/${chapterNum}/${v}`;
                console.log(`🇺🇦 [Fallback] Parsing Gitabase for ${v}:`, gitabaseUrl);

                if (useNoIParser) {
                  parsedUA = parseNoIGitabase(gitabaseRes.value.data.html, gitabaseUrl);
                } else {
                  parsedUA = parseGitabaseCC(gitabaseRes.value.data.html, gitabaseUrl);
                }
              } else {
                console.warn(`⚠️ [Fallback] Gitabase skipped for ${v}:`, {
                  hasGitabaseUA: bookInfo.hasGitabaseUA,
                  gitabaseResFulfilled: gitabaseRes?.status === "fulfilled",
                  gitabaseHasData: gitabaseRes?.status === "fulfilled" && !!gitabaseRes?.value?.data,
                });
              }

              // ✅ Використовуємо новий merger для об'єднання EN + UA
              const merged = mergeVedabaseAndGitabase(
                parsedEN,
                parsedUA,
                vedabaseCanto, // lila
                chapterNum,
                String(v), // verse number
                vedabaseUrl,
                bookInfo.hasGitabaseUA
                  ? // ⚠️ Для NoI (hasSpecialStructure): /NoI/{v} замість /NoI/{chapter}/{v}
                    // ✅ FIX: Використовуємо bookInfo.gitabaseSlug для правильного регістру (NoI, не NOI)
                    bookInfo.isMultiVolume
                    ? `https://gitabase.com/ukr/${gitabaseBookSlug}/${lilaNum}/${chapterNum}/${v}`
                    : (bookInfo as any).hasSpecialStructure
                      ? `https://gitabase.com/ukr/${gitabaseBookSlug}/${v}`
                      : `https://gitabase.com/ukr/${gitabaseBookSlug}/${chapterNum}/${v}`
                  : "",
              );

              if (merged) {
                verses.push({
                  verse_number: String(v),
                  sanskrit: merged.bengali || "",
                  transliteration_en: merged.transliteration_en || "",
                  transliteration_ua: merged.transliteration_ua || "",
                  synonyms_en: merged.synonyms_en || "",
                  synonyms_ua: merged.synonyms_ua || "",
                  translation_en: merged.translation_en || "",
                  translation_ua: merged.translation_ua || "",
                  commentary_en: merged.purport_en || "",
                  commentary_ua: merged.purport_ua || "",
                });
              }
            } catch (e: any) {
              console.warn(`⚠️ Failed verse ${v}:`, e.message);
            }
            setProgress(10 + ((v - start + 1) / (end - start + 1)) * 80);
          }
          console.log(`✅ Fallback parsed ${verses.length} verses`);
          result = { verses };
        }
      }

      console.log("📊 Final result:", {
        verses_count: result?.verses?.length,
        first_verse: result?.verses?.[0],
      });

      // 🔧 Дозаповнення EN блоків (synonyms/translation/purport) з Vedabase, якщо парсер їх не дав
      if (Array.isArray(result?.verses) && result.verses.length) {
        let idx = 0;
        for (const v of result.verses) {
          const missingEn = !(v?.translation_en || v?.synonyms_en || v?.commentary_en);
          if (missingEn) {
            try {
              const verseUrl = `${vedabase_base}${v.verse_number}`;
              const { data } = await supabase.functions.invoke("fetch-html", { body: { url: verseUrl } });
              const parsed = data?.html ? parseVedabaseCC(data.html, verseUrl) : null;
              if (parsed) {
                v.sanskrit = v.sanskrit || parsed.bengali || "";
                v.transliteration_en = v.transliteration_en || parsed.transliteration_en || "";
                v.synonyms_en = v.synonyms_en || parsed.synonyms_en || "";
                v.translation_en = v.translation_en || parsed.translation_en || "";
                v.commentary_en = v.commentary_en || parsed.purport_en || "";
              }
            } catch (e) {
              console.warn("EN fill fail for verse", v?.verse_number, e);
            }
          }
          idx++;
          setProgress(20 + Math.round((idx / result.verses.length) * 20));
        }
      }

      if (!result?.verses?.length) {
        console.error("❌ No verses in result:", result);
        throw new Error("Немає віршів у відповіді");
      }

      const siteSlug = bookInfo.our_slug;

      const newImport: ImportData = {
        ...importData,
        source: "vedabase",
        rawText: JSON.stringify(result.verses, null, 2),
        processedText: JSON.stringify(result, null, 2),
        chapters: [
          {
            chapter_number: chapterNum,
            // ✅ Передаємо назви (з дефолтними значеннями для БД NOT NULL constraint)
            title_ua: importData.metadata.title_ua?.trim() || undefined,
            title_en:
              importData.metadata.title_en?.trim() ||
              `${bookInfo?.name_ua || vedabaseBook.toUpperCase()} ${vedabaseCanto ? vedabaseCanto + " " : ""}${chapterNum}`,
            // ✅ Передаємо intro як content для глави
            ...(importData.chapters[0]?.intro_ua && { content_ua: importData.chapters[0].intro_ua }),
            ...(importData.chapters[0]?.intro_en && { content_en: importData.chapters[0].intro_en }),
            chapter_type: "verses" as const,
            verses: result.verses,
          },
        ],
        metadata: {
          ...importData.metadata,
          source_url: vedabase_base,
          book_slug: siteSlug,
          vedabase_slug: vedabaseBook,
          // ✅ Тільки для багатотомних книг додаємо canto
          ...(bookInfo?.isMultiVolume && {
            canto: lilaNum.toString(),
            volume: vedabaseCanto,
          }),
        },
      };

      setImportData(newImport);

      setProgress(100);
      await saveToDatabase(newImport);
      return;
    } catch (e: any) {
      toast({ title: "Помилка", description: e.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [vedabaseBook, vedabaseCanto, vedabaseChapter, vedabaseVerse, lilaNum]);

  /** Імпорт ВСІХ глав книги/канто */
  const handleVedabaseImportAllChapters = useCallback(async () => {
    const bookInfo = getBookConfigByVedabaseSlug(vedabaseBook)!;

    // Перевірка: для мультитомних книг потрібно вказати канто
    if (bookInfo.isMultiVolume && !vedabaseCanto) {
      toast({ title: "Помилка", description: "Вкажіть канто/ліла", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setProgress(5);

    try {
      // 1. Отримуємо список глав зі сторінки книги/канто
      toast({ title: "🔍 Завантаження...", description: "Визначення кількості глав..." });

      const indexUrl = bookInfo.isMultiVolume
        ? `https://vedabase.io/en/library/${vedabaseBook}/${vedabaseCanto}/`
        : `https://vedabase.io/en/library/${vedabaseBook}/`;

      const { data: indexData } = await supabase.functions.invoke("fetch-html", { body: { url: indexUrl } });

      if (!indexData?.html) {
        throw new Error("Не вдалося завантажити сторінку книги");
      }

      // Парсимо список глав
      const dp = new DOMParser();
      const doc = dp.parseFromString(indexData.html, "text/html");

      // Шукаємо посилання на глави
      const chapterLinks: number[] = [];
      const hrefPattern = bookInfo.isMultiVolume ? `/${vedabaseBook}/${vedabaseCanto}/` : `/${vedabaseBook}/`;

      const anchors = Array.from(doc.querySelectorAll(`a[href*="${hrefPattern}"]`));
      anchors.forEach((a) => {
        const href = a.getAttribute("href") || "";
        const segments = href.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1];

        // Перевіряємо чи це номер глави (тільки цифри)
        if (/^\d+$/.test(lastSegment)) {
          const chapterNum = parseInt(lastSegment, 10);
          if (!chapterLinks.includes(chapterNum)) {
            chapterLinks.push(chapterNum);
          }
        }
      });

      chapterLinks.sort((a, b) => a - b);

      if (chapterLinks.length === 0) {
        throw new Error("Не знайдено глав для імпорту");
      }

      toast({
        title: "📚 Знайдено глав",
        description: `Буде імпортовано ${chapterLinks.length} глав: ${chapterLinks.join(", ")}`,
      });

      // 2. Імпортуємо кожну главу послідовно
      const results = {
        success: 0,
        failed: 0,
        errors: [] as string[],
      };

      for (let i = 0; i < chapterLinks.length; i++) {
        const chapterNum = chapterLinks[i];
        const progressPercent = 5 + Math.round((i / chapterLinks.length) * 90);
        setProgress(progressPercent);

        try {
          toast({
            title: `📖 Глава ${chapterNum}`,
            description: `Імпорт ${i + 1} з ${chapterLinks.length}...`,
          });

          // Тимчасово встановлюємо номер глави
          const savedChapter = vedabaseChapter;
          setVedabaseChapter(String(chapterNum));

          // Викликаємо існуючу логіку імпорту (копіюємо код з handleVedabaseImport)
          // Автоматично визначаємо діапазон віршів
          let verseRanges = "";
          try {
            const chapterUrl = bookInfo.isMultiVolume
              ? `https://vedabase.io/en/library/${vedabaseBook}/${vedabaseCanto}/${chapterNum}/`
              : `https://vedabase.io/en/library/${vedabaseBook}/${chapterNum}/`;

            const { data: chapterData } = await supabase.functions.invoke("fetch-html", { body: { url: chapterUrl } });
            const maxVerse = getMaxVerseFromChapter(chapterData.html);
            verseRanges = maxVerse > 0 ? `1-${maxVerse}` : "1-500";
          } catch {
            verseRanges = "1-500";
          }

          // Парсимо та імпортуємо главу (спрощена версія з handleVedabaseImport)
          const vedabase_base = bookInfo.isMultiVolume
            ? `https://vedabase.io/en/library/${vedabaseBook}/${vedabaseCanto}/${chapterNum}/`
            : `https://vedabase.io/en/library/${vedabaseBook}/${chapterNum}/`;

          const gitabase_base = bookInfo.isMultiVolume
            ? `https://gitabase.com/ukr/${vedabaseBook.toUpperCase()}/${lilaNum}/${chapterNum}`
            : `https://gitabase.com/ukr/${vedabaseBook.toUpperCase()}/${chapterNum}`;

          let result: any = null;

          // Спробуємо Python parser якщо доступний
          if (USE_LOCAL_PARSER && bookInfo.hasGitabaseUA) {
            try {
              result = await parseChapterWithPythonServer({
                lila: lilaNum,
                chapter: chapterNum,
                verse_ranges: verseRanges,
                vedabase_base,
                gitabase_base,
              });

              const badResult =
                !Array.isArray(result?.verses) ||
                !result.verses.length ||
                result.verses.every(
                  (v: any) =>
                    !(
                      v?.translation_en ||
                      v?.translation_ua ||
                      v?.synonyms_en ||
                      v?.synonyms_ua ||
                      v?.commentary_en ||
                      v?.commentary_ua
                    ),
                );
              if (badResult) {
                throw new Error("Python result is empty/incomplete");
              }
            } catch {
              result = null; // Fallback на browser parsing
            }
          }

          // Fallback: browser парсинг (спрощена версія)
          if (!result) {
            // Тут мала б бути повна логіка browser парсингу
            // Для спрощення можемо пропустити або викликати спрощену версію
            throw new Error("Browser fallback not implemented for batch import");
          }

          // Нормалізуємо та зберігаємо
          if (!result?.chapter_number) result.chapter_number = chapterNum;
          if (!result?.chapter_type) result.chapter_type = "verses";

          const bookId = currentBookInfo?.our_slug || vedabaseBook;
          let cantoId: string | null = null;

          if (bookInfo.isMultiVolume) {
            const { data: existingCanto } = await supabase
              .from("cantos")
              .select("id")
              .eq("book_id", bookId)
              .eq("canto_number", lilaNum)
              .maybeSingle();

            cantoId = existingCanto?.id || null;
          }

          const isFallback = (s: string) => /\(English.*only\)|\(Eng\)/.test(s);
          const chapterToImport: any = { ...result };
          if (isFallback(chapterToImport.title_ua)) delete chapterToImport.title_ua;
          if (isFallback(chapterToImport.title_en)) delete chapterToImport.title_en;

          await importSingleChapter(supabase, {
            bookId,
            cantoId: cantoId ?? null,
            chapter: chapterToImport,
            strategy: "upsert",
          });

          results.success++;

          // Відновлюємо попереднє значення
          setVedabaseChapter(savedChapter);
        } catch (err: any) {
          results.failed++;
          results.errors.push(`Глава ${chapterNum}: ${err.message}`);
          console.error(`Помилка імпорту глави ${chapterNum}:`, err);
        }

        // Невелика затримка між главами
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setProgress(100);

      // Показуємо результат
      if (results.success > 0) {
        toast({
          title: "✅ Імпорт завершено!",
          description: `Успішно: ${results.success}, Помилок: ${results.failed}`,
          duration: 10000,
        });
      }

      if (results.errors.length > 0) {
        console.error("Помилки імпорту:", results.errors);
        toast({
          title: "⚠️ Є помилки",
          description: `${results.errors.length} глав не імпортовано. Див. консоль.`,
          variant: "destructive",
          duration: 10000,
        });
      }

      // Навігуємо до першої імпортованої глави
      if (results.success > 0 && chapterLinks.length > 0) {
        const firstChapter = chapterLinks[0];
        const targetPath = bookInfo.isMultiVolume
          ? `/veda-reader/${bookInfo.our_slug}/canto/${lilaNum}/chapter/${firstChapter}`
          : `/veda-reader/${bookInfo.our_slug}/${firstChapter}`;

        navigate(targetPath);
      }
    } catch (e: any) {
      toast({ title: "Помилка", description: e.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [vedabaseBook, vedabaseCanto, vedabaseChapter, lilaNum, currentBookInfo, navigate]);

  /** Імпорт з Wisdomlib.org (Chaitanya Bhagavata) */
  const handleWisdomlibImport = useCallback(
    async (url?: string) => {
      const bookInfo = getBookConfigByVedabaseSlug(vedabaseBook)!;
      const sourceUrl = url || (bookInfo as any).khandaUrls?.[vedabaseCanto.toLowerCase()];

      if (!sourceUrl) {
        toast({
          title: "Помилка",
          description: "URL не вказано. Оберіть khaṇḍa (adi/madhya/antya)",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);
      setProgress(10);
      setSkippedUrls([]); // Reset skipped URLs for new import

      try {
        const importDesc = vedabaseChapter
          ? `Глава ${vedabaseChapter}${vedabaseVerse ? `, вірші ${vedabaseVerse}` : ""} з ${vedabaseCanto} khaṇḍa`
          : `Всі глави з ${vedabaseCanto} khaṇḍa`;

        toast({ title: "Завантаження...", description: importDesc });
        console.log(`[Wisdomlib] Import: ${importDesc}`);

        // Step 1: Fetch khaṇḍa page (list of chapters)
        const { data, error } = await supabase.functions.invoke("fetch-html", {
          body: { url: sourceUrl },
        });

        console.log(`[Wisdomlib] Fetch result:`, { hasData: !!data, hasHtml: !!data?.html, error });

        if (error) {
          console.error(`[Wisdomlib] Fetch error:`, error);
          throw new Error(`Edge Function помилка: ${JSON.stringify(error)}`);
        }

        if (!data?.html) {
          throw new Error(`Не вдалося отримати HTML. Response: ${JSON.stringify(data)}`);
        }

        setProgress(20);
        toast({ title: "Парсинг...", description: "Витягування посилань на глави..." });

        // Step 2: Extract chapter URLs from khaṇḍa page
        let chapterList = extractWisdomlibChapterUrls(data.html, sourceUrl);

        console.log(`[Wisdomlib] Found ${chapterList.length} chapters in ${vedabaseCanto}`);

        if (!chapterList || chapterList.length === 0) {
          throw new Error("Не знайдено жодної глави на сторінці khaṇḍa");
        }

        // Filter by specific chapter number if provided
        if (vedabaseChapter) {
          const targetChapter = parseInt(vedabaseChapter, 10);
          const filtered = chapterList.filter((ch) => ch.chapterNumber === targetChapter);

          if (filtered.length === 0) {
            throw new Error(
              `Глава ${targetChapter} не знайдена в ${vedabaseCanto} khaṇḍa. Доступні глави: ${chapterList.map((ch) => ch.chapterNumber).join(", ")}`,
            );
          }

          chapterList = filtered;
          console.log(`[Wisdomlib] Filtered to chapter ${targetChapter}`);
        }

        toast({
          title: `Знайдено глав: ${chapterList.length}`,
          description: vedabaseChapter
            ? `Глава ${vedabaseChapter} з ${vedabaseCanto} khaṇḍa`
            : `${vedabaseCanto} khaṇḍa (всі глави)`,
        });

        // Step 3: Fetch and parse all chapters
        const allChapters: WisdomlibChapter[] = [];
        const progressStep = 70 / chapterList.length;

        const khandaInfo = determineKhandaFromUrl(sourceUrl);

        for (let i = 0; i < chapterList.length; i++) {
          const chapterItem = chapterList[i];

          toast({
            title: `Глава ${i + 1}/${chapterList.length}`,
            description: `Завантаження: ${chapterItem.title}`,
          });

          // Fetch chapter page with retry logic
          const result = await invokeWithRetry(supabase, chapterItem.url, 3);

          if (result.notFound) {
            console.warn(`Глава не знайдена (404): ${chapterItem.url}`);
            setSkippedUrls((prev) => [...prev, { url: chapterItem.url, reason: "404 Not Found" }]);
            continue;
          }

          if (result.error || !result.html) {
            console.warn(`Не вдалося завантажити главу після 3 спроб: ${chapterItem.url}`, result.error);
            setSkippedUrls((prev) => [...prev, { url: chapterItem.url, reason: result.error || "No HTML" }]);
            continue;
          }

          // Parse chapter
          const chapter = parseWisdomlibChapterPage(result.html, chapterItem.url, khandaInfo.name);

          if (chapter) {
            chapter.chapter_number = chapterItem.chapterNumber;
            chapter.title_en = chapterItem.title;

            // Check if this chapter has individual verse URLs (e.g., Chaitanya Bhagavata)
            if (chapter.verseUrls && chapter.verseUrls.length > 0) {
              console.log(`[Wisdomlib] Chapter has ${chapter.verseUrls.length} individual verse pages`);

              // Filter verse URLs if specific range provided
              let verseUrlsToFetch = chapter.verseUrls;
              if (vedabaseVerse) {
                const [start, end] = vedabaseVerse.includes("-")
                  ? vedabaseVerse.split("-").map(Number)
                  : [parseInt(vedabaseVerse, 10), parseInt(vedabaseVerse, 10)];

                verseUrlsToFetch = chapter.verseUrls.filter((v) => {
                  const verseNum = parseInt(v.verseNumber, 10);
                  return verseNum >= start && verseNum <= end;
                });

                console.log(
                  `[Wisdomlib] Filtered verses ${start}-${end}: ${chapter.verseUrls.length} → ${verseUrlsToFetch.length}`,
                );
              }

              // Fetch each verse page
              for (let j = 0; j < verseUrlsToFetch.length; j++) {
                const verseItem = verseUrlsToFetch[j];

                try {
                  const verseResult = await invokeWithRetry(supabase, verseItem.url, 3);

                  if (verseResult.error || !verseResult.html) {
                    console.warn(`Failed to fetch verse ${verseItem.verseNumber}:`, verseResult.error);
                    continue;
                  }

                  const verse = parseWisdomlibVersePage(verseResult.html, verseItem.url);
                  if (verse) {
                    verse.verse_number = verseItem.verseNumber;
                    chapter.verses.push(verse);
                  }

                  // Throttle between verse requests
                  if (j < verseUrlsToFetch.length - 1) {
                    await sleep(wisdomlibThrottle);
                  }
                } catch (e) {
                  console.warn(`Error parsing verse ${verseItem.verseNumber}:`, e);
                }
              }

              console.log(
                `[Wisdomlib] Fetched ${chapter.verses.length} verses for chapter ${chapterItem.chapterNumber}`,
              );
            }

            // Only add chapter if it has verses
            if (chapter.verses.length > 0) {
              allChapters.push(chapter);
            } else if (!chapter.verseUrls) {
              // If no verses and no verseUrls, this is an error
              console.warn(`Chapter ${chapterItem.chapterNumber} has no verses`);
            }
          }

          setProgress(20 + Math.round((i + 1) * progressStep));

          // Throttle between requests to avoid overwhelming the server
          if (i < chapterList.length - 1) {
            await sleep(wisdomlibThrottle);
          }
        }

        if (allChapters.length === 0) {
          throw new Error("Не вдалося розпарсити жодної глави");
        }

        setProgress(95);

        // Convert to standard chapter format
        const chapters = allChapters.map((ch) => wisdomlibChapterToStandardChapter(ch));

        // Create import data
        const newImport: ImportData = {
          ...importData,
          source: "bhaktivinoda", // Використовуємо існуючий тип
          rawText: data.html.substring(0, 1000), // Preview
          processedText: JSON.stringify(allChapters, null, 2),
          chapters: chapters,
          metadata: {
            ...importData.metadata,
            title_en: `${bookInfo.name_en} - ${vedabaseCanto} khaṇḍa`,
            title_ua: `${bookInfo.name_ua} - ${vedabaseCanto}`,
            author: bookInfo.author || "Vrindavan Das Thakur",
            book_slug: bookInfo.our_slug,
            source_url: sourceUrl,
            canto: khandaInfo.number.toString(),
            volume: vedabaseCanto,
          },
        };

        setImportData(newImport);
        setProgress(100);

        toast({
          title: "✅ Успішно!",
          description: `Імпортовано ${chapters.length} глав (${chapters.reduce((acc, ch) => acc + ch.verses.length, 0)} віршів)`,
        });

        // Auto-save to database
        await saveToDatabase(newImport);
      } catch (e: any) {
        console.error("Wisdomlib import error:", e);
        toast({ title: "Помилка", description: e.message, variant: "destructive" });
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    },
    [vedabaseBook, vedabaseCanto, vedabaseChapter, vedabaseVerse, importData, wisdomlibThrottle],
  );

  /** Імпорт з Bhaktivinoda Institute */
  const handleBhaktivinodaImport = useCallback(
    async (url?: string) => {
      const bookInfo = getBookConfigByVedabaseSlug(vedabaseBook)!;
      const sourceUrl = url || bookInfo.sourceUrl;

      if (!sourceUrl) {
        toast({ title: "Помилка", description: "URL не вказано", variant: "destructive" });
        return;
      }

      setIsProcessing(true);
      setProgress(10);

      try {
        toast({ title: "Завантаження...", description: "Отримання кореневої сторінки..." });

        // Step 1: Fetch root page (list of songs)
        const { data, error } = await supabase.functions.invoke("fetch-html", {
          body: { url: sourceUrl },
        });

        if (error || !data?.html) {
          throw new Error(error?.message || "Не вдалося отримати HTML");
        }

        setProgress(20);
        toast({ title: "Парсинг...", description: "Витягування посилань на пісні..." });

        // Step 2: Extract individual song URLs from root page
        const isKKSongs = bookInfo.source === "kksongs";
        console.log(`[Import] Source type: ${isKKSongs ? "KKSongs" : "BhaktivinodaInstitute"}`);
        console.log(`[Import] Root URL: ${sourceUrl}`);

        const songUrls = isKKSongs ? extractKKSongUrls(data.html, sourceUrl) : extractSongUrls(data.html, sourceUrl);
        const pageTitle = getBhaktivinodaTitle(data.html);

        console.log(`[Import] Found ${songUrls.length} songs`);
        if (songUrls.length > 0) {
          console.log(`[Import] First 3 URLs:`, songUrls.slice(0, 3));
        }

        if (!songUrls || songUrls.length === 0) {
          throw new Error("Не знайдено жодного посилання на пісні на кореневій сторінці");
        }

        // Step 3: Group songs by cantos (sections)
        const cantoMap = groupSongUrlsByCantos(songUrls);
        const totalSongs = songUrls.length;
        const totalCantos = cantoMap.size;

        toast({
          title: `Знайдено структуру`,
          description: `${totalCantos} розділів, ${totalSongs} пісень загалом`,
        });

        // Step 4: Fetch and parse songs organized by cantos
        const allSongs: BhaktivinodaSong[] = [];
        const progressStep = 60 / totalSongs;
        let processedSongs = 0;

        // Sort cantos by number
        const sortedCantos = Array.from(cantoMap.entries()).sort((a, b) => a[0] - b[0]);

        for (const [cantoNumber, cantoData] of sortedCantos) {
          toast({
            title: `Розділ ${cantoNumber}/${totalCantos}: ${cantoData.name}`,
            description: `Завантаження ${cantoData.urls.length} пісень...`,
          });

          for (let songIndex = 0; songIndex < cantoData.urls.length; songIndex++) {
            const songUrl = cantoData.urls[songIndex];

            let song: BhaktivinodaSong | null = null;

            if (isKKSongs) {
              // KKSongs: fetch 3 pages (main, bengali, commentary)
              const { mainUrl, bengaliUrl, commentaryUrl } = deriveKKSongUrls(songUrl);

              console.log(`[KKSongs] Fetching song ${songIndex + 1}:`, { mainUrl, bengaliUrl, commentaryUrl });

              const [mainRes, bengaliRes, commentaryRes] = await Promise.all([
                supabase.functions.invoke("fetch-html", { body: { url: mainUrl } }),
                supabase.functions.invoke("fetch-html", { body: { url: bengaliUrl } }),
                supabase.functions.invoke("fetch-html", { body: { url: commentaryUrl } }),
              ]);

              console.log(`[KKSongs] Results:`, {
                main: { hasHtml: !!mainRes.data?.html, error: mainRes.error },
                bengali: { hasHtml: !!bengaliRes.data?.html, error: bengaliRes.error },
                commentary: { hasHtml: !!commentaryRes.data?.html, error: commentaryRes.error },
              });

              if (mainRes.error || !mainRes.data?.html) {
                console.error(
                  `[KKSongs] Помилка завантаження основної сторінки: ${mainUrl}`,
                  mainRes.error,
                  mainRes.data,
                );
                continue;
              }

              const mainHtml = mainRes.data.html;
              const bengaliHtml = bengaliRes.data?.html || "";
              const commentaryHtml = commentaryRes.data?.html || "";

              song = await parseKKSongComplete(mainHtml, bengaliHtml, commentaryHtml, songUrl);
            } else {
              // BhaktivinodaInstitute: fetch single page
              const { data: songData, error: songError } = await supabase.functions.invoke("fetch-html", {
                body: { url: songUrl },
              });

              if (songError || !songData?.html) {
                console.warn(`Не вдалося завантажити пісню: ${songUrl}`, songError);
                continue;
              }

              song = parseBhaktivinodaSongPage(songData.html, songUrl);
            }

            if (song && song.verses.length > 0) {
              song.song_number = songIndex + 1; // Song number within canto
              song.canto_number = cantoNumber; // Add canto number
              allSongs.push(song);
            }

            processedSongs++;
            setProgress(20 + Math.round(processedSongs * progressStep));
          }
        }

        if (allSongs.length === 0) {
          throw new Error("Не вдалося розпарсити жодної пісні");
        }

        setProgress(85);

        // Convert songs to chapters
        const chapters = allSongs.map((song, index) => bhaktivinodaSongToChapter(song, index + 1));

        // Create import data (EN ONLY - no UA from bhaktivinoda institute)
        const newImport: ImportData = {
          ...importData,
          source: "bhaktivinoda",
          rawText: data.html.substring(0, 1000), // Preview
          processedText: JSON.stringify(allSongs, null, 2),
          chapters: chapters,
          metadata: {
            ...importData.metadata,
            title_en: pageTitle.title_en || bookInfo.name_en,
            title_ua: bookInfo.name_ua, // Use book config for UA
            author: bookInfo.author || "Bhaktivinoda Thakur",
            book_slug: bookInfo.our_slug,
            source_url: sourceUrl,
          },
        };

        setImportData(newImport);
        setProgress(100);

        toast({
          title: "✅ Успішно!",
          description: `Імпортовано ${chapters.length} пісень (${chapters.reduce((acc, ch) => acc + ch.verses.length, 0)} віршів)`,
        });

        await saveToDatabase(newImport);
      } catch (e: any) {
        console.error("Bhaktivinoda import error:", e);
        toast({ title: "Помилка", description: e.message, variant: "destructive" });
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    },
    [vedabaseBook, importData],
  );

  /** Обробка файлу */
  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsProcessing(true);
      setProgress(10);

      try {
        let extractedText = "";
        const ext = file.name.split(".").pop()?.toLowerCase();

        if (file.type === "application/pdf" || ext === "pdf") {
          toast({ title: "Обробка PDF...", description: "Це може зайняти деякий час" });
          extractedText = await extractTextFromPDF(file);
        } else if (file.type === "application/epub+zip" || ext === "epub") {
          toast({ title: "Обробка EPUB..." });
          extractedText = await extractTextFromEPUB(file);
        } else if (
          ext === "docx" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          toast({ title: "Обробка DOCX..." });
          extractedText = await extractTextFromDOCX(file);
        } else if (ext === "md" || file.type === "text/plain" || ext === "txt") {
          toast({ title: "Читання тексту..." });
          extractedText = await file.text();
        } else {
          toast({
            title: "Помилка",
            description: "Непідтримуваний формат. Використайте PDF/DOCX/EPUB/TXT/MD.",
            variant: "destructive",
          });
          return;
        }

        if (!extractedText || !extractedText.trim()) {
          toast({
            title: "Помилка",
            description: "Файл порожній або не містить тексту",
            variant: "destructive",
          });
          return;
        }

        setFileText(extractedText);
        setProgress(50);

        // Автоматично парсимо текст після завантаження
        await parseFileText(extractedText);

        toast({ title: "✅ Файл завантажено", description: `${extractedText.length} символів` });
      } catch (err: any) {
        console.error(err);
        toast({
          title: "Помилка обробки файлу",
          description: err?.message || "Невідома помилка",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
        setProgress(0);
        e.target.value = "";
      }
    },
    [selectedTemplate],
  );

  /** Парсинг тексту з файлу */
  const parseFileText = useCallback(
    async (text?: string) => {
      const textToParse = text || fileText;
      if (!textToParse.trim()) {
        toast({ title: "Помилка", description: "Немає тексту для парсингу", variant: "destructive" });
        return;
      }

      setIsProcessing(true);
      setProgress(10);

      try {
        // Знайти шаблон
        const template = BOOK_TEMPLATES.find((t) => t.id === selectedTemplate) || BOOK_TEMPLATES[0];

        console.log("📖 Парсинг з шаблоном:", template.name);
        console.log("📝 Текст довжина:", textToParse.length);

        let chapters: any[] = [];

        // ✅ Спеціальна обробка для Raja Vidya (текстова книга з HTML структурою)
        if (template.id === "raja-vidya") {
          console.log("🔍 [Raja Vidya] Використовую спеціалізований парсер для EPUB HTML");
          const rajaVidyaChapters = parseRajaVidyaEPUB(textToParse);

          // Конвертуємо в стандартний формат ParsedChapter
          chapters = rajaVidyaChapters.map((ch) => ({
            chapter_number: ch.chapter_number,
            chapter_type: 'text' as const,
            title_ua: ch.title_ua,
            verses: [],
            content_ua: ch.content_ua,
          }));

          console.log(`✅ [Raja Vidya] Розпарсено ${chapters.length} глав`);
        } else {
          // Стандартний парсинг для інших книг
          chapters = splitIntoChapters(textToParse, template);
        }

        console.log("✅ Знайдено розділів:", chapters.length);

        if (chapters.length === 0) {
          toast({
            title: "Не знайдено розділів",
            description: "Спробуйте інший шаблон або перевірте формат тексту",
            variant: "destructive",
          });
          setParsedChapters([]);
          return;
        }

        setParsedChapters(chapters);
        setSelectedChapterIndex(0);

        // Для текстових глав - рахуємо символи замість віршів
        const totalVerses = chapters.reduce((sum, ch) => sum + ch.verses.length, 0);
        const totalChars = chapters.reduce((sum, ch) => sum + (ch.content_ua?.length || 0), 0);

        const description = totalVerses > 0
          ? `Знайдено ${chapters.length} розділ(ів), ${totalVerses} віршів`
          : `Знайдено ${chapters.length} розділ(ів), ${totalChars} символів`;

        toast({
          title: "✅ Парсинг завершено",
          description,
        });

        setProgress(100);
      } catch (err: any) {
        console.error("Помилка парсингу:", err);
        toast({
          title: "Помилка парсингу",
          description: err?.message || "Невідома помилка",
          variant: "destructive",
        });
        setParsedChapters([]);
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    },
    [fileText, selectedTemplate],
  );

  /** Імпорт Raja Vidya з двох мов (UA з файлу + EN з Vedabase) */
  const handleRajaVidyaDualImport = useCallback(async () => {
    if (parsedChapters.length === 0) {
      toast({ title: "Помилка", description: "Спочатку завантажте EPUB файл з українською версією", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      const bookInfo = getBookConfigByVedabaseSlug('rv');
      if (!bookInfo) {
        throw new Error("Конфігурація книги Raja Vidya не знайдена");
      }

      toast({ title: "📚 Raja Vidya", description: "Завантаження англійських глав з Vedabase..." });

      const mergedChapters: any[] = [];
      const totalChapters = parsedChapters.length;

      for (let i = 0; i < parsedChapters.length; i++) {
        const uaChapter = parsedChapters[i];
        const chapterNum = uaChapter.chapter_number;

        setProgress(10 + Math.round((i / totalChapters) * 40));
        toast({
          title: `Глава ${chapterNum}/${totalChapters}`,
          description: `Завантаження англійської версії...`
        });

        // Завантажуємо англійську версію з Vedabase
        const vedabaseUrl = `https://vedabase.io/en/library/rv/${chapterNum}/`;
        let enChapter = null;

        try {
          const { data, error } = await supabase.functions.invoke("fetch-html", {
            body: { url: vedabaseUrl }
          });

          if (error) {
            console.warn(`⚠️ Помилка завантаження EN для глави ${chapterNum}:`, error);
          } else if (data?.html) {
            enChapter = parseRajaVidyaVedabase(data.html, vedabaseUrl);
          }
        } catch (err) {
          console.warn(`⚠️ Виключення при завантаженні EN для глави ${chapterNum}:`, err);
        }

        // Об'єднуємо UA та EN
        const merged = mergeRajaVidyaChapters(
          {
            chapter_number: uaChapter.chapter_number,
            title_ua: uaChapter.title_ua,
            content_ua: uaChapter.content_ua || '',
          },
          enChapter
        );

        if (merged) {
          mergedChapters.push(merged);
          console.log(`✅ Глава ${chapterNum}: UA (${merged.content_ua?.length || 0} chars) + EN (${merged.content_en?.length || 0} chars)`);
        }

        // Невелика затримка між запитами
        if (i < parsedChapters.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      if (mergedChapters.length === 0) {
        throw new Error("Не вдалося об'єднати жодної глави");
      }

      setProgress(60);
      toast({
        title: "✅ Завантаження завершено",
        description: `Об'єднано ${mergedChapters.length} глав. Збереження...`
      });

      // Створюємо ImportData для збереження
      const newImport: ImportData = {
        source: "vedabase",
        rawText: "",
        processedText: JSON.stringify(mergedChapters, null, 2),
        chapters: mergedChapters,
        metadata: {
          title_ua: bookInfo.name_ua,
          title_en: bookInfo.name_en,
          author: bookInfo.author || 'A. C. Bhaktivedanta Swami Prabhupada',
          book_slug: bookInfo.our_slug,
          vedabase_slug: bookInfo.vedabaseSlug || 'rv',
          source_url: 'https://vedabase.io/en/library/rv/',
        },
      };

      setImportData(newImport);
      setProgress(80);

      // Зберігаємо в БД
      await saveToDatabase(newImport);

      setProgress(100);
      toast({
        title: "🎉 Імпорт завершено!",
        description: `Raja Vidya: ${mergedChapters.length} глав успішно імпортовано (UA + EN)`,
        duration: 5000,
      });

    } catch (err: any) {
      console.error("Помилка імпорту Raja Vidya:", err);
      toast({
        title: "Помилка імпорту",
        description: err?.message || "Невідома помилка",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [parsedChapters, importData, supabase]);

  /** Імпорт розділу з файлу */
  const handleFileChapterImport = useCallback(async () => {
    if (parsedChapters.length === 0) {
      toast({ title: "Помилка", description: "Немає розділів для імпорту", variant: "destructive" });
      return;
    }

    const chapter = parsedChapters[selectedChapterIndex];
    if (!chapter) {
      toast({ title: "Помилка", description: "Розділ не знайдено", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      const slug = importData.metadata.book_slug || currentBookInfo?.our_slug || "imported-book";
      const { data: existing } = await supabase.from("books").select("id").eq("slug", slug).maybeSingle();

      let bookId = existing?.id;
      if (!bookId) {
        const { data: created, error } = await supabase
          .from("books")
          .insert({
            slug,
            title_ua: importData.metadata.title_ua || currentBookInfo?.name || "Імпортована книга",
            title_en: importData.metadata.title_en || currentBookInfo?.name || "Imported Book",
            is_published: true,
          })
          .select("id")
          .single();
        if (error) throw error;
        bookId = created.id;
      }

      // Resolve canto if needed
      let cantoId: string | null = null;
      if (vedabaseCanto && currentBookInfo?.isMultiVolume) {
        // ✅ FIX: Use lilaNum which correctly maps lila names (adi/madhya/antya) to numbers (1/2/3)
        const cantoNum = lilaNum;
        const { data: canto } = await supabase
          .from("cantos")
          .select("id")
          .eq("book_id", bookId)
          .eq("canto_number", cantoNum)
          .maybeSingle();
        cantoId = canto?.id || null;

        console.log("🔍 Canto resolution:", { vedabaseCanto, lilaNum, cantoNum, cantoId, found: !!canto });
      }

      // Не передаємо fallback-назви, щоб не перезаписувати існуючі
      const isFallback = (t?: string) => {
        const s = (t || "").trim();
        const n = chapter.chapter_number;
        if (!s) return true;
        const re = new RegExp(`^(Глава|Розділ|Chapter|Song|Пісня)\\s*${n}(?:\\s*[.:—-])?$`, "i");
        return re.test(s);
      };
      const chapterToImport: any = { ...chapter };
      if (isFallback(chapterToImport.title_ua)) delete chapterToImport.title_ua;
      if (isFallback(chapterToImport.title_en)) delete chapterToImport.title_en;

      await importSingleChapter(supabase, {
        bookId,
        cantoId: cantoId ?? null,
        chapter: chapterToImport,
        strategy: "upsert",
      });

      toast({
        title: "✅ Імпорт завершено",
        description: `Розділ ${chapter.chapter_number}: ${chapter.verses?.length || 0} віршів збережено`,
      });

      setProgress(100);

      // Навігація до розділу
      const targetPath = cantoId
        ? `/veda-reader/${slug}/canto/${vedabaseCanto}/chapter/${chapter.chapter_number}`
        : `/veda-reader/${slug}/${chapter.chapter_number}`;

      navigate(targetPath);
    } catch (err: any) {
      console.error("Помилка імпорту:", err);
      toast({
        title: "Помилка збереження",
        description: err?.message || "Невідома помилка",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [parsedChapters, selectedChapterIndex, importData, vedabaseBook, vedabaseCanto, currentBookInfo, navigate]);

  /** Збереження у базу */
  const saveToDatabase = useCallback(
    async (dataOverride?: ImportData) => {
      const data = dataOverride ?? importData;
      if (!data.chapters.length) {
        toast({ title: "Немає даних", variant: "destructive" });
        return;
      }

      setIsProcessing(true);
      setProgress(10);
      try {
        const slug = data.metadata.book_slug || "imported-book";
        const { data: existing } = await supabase.from("books").select("id").eq("slug", slug).maybeSingle();

        let bookId = existing?.id;
        if (!bookId) {
          const { data: created, error } = await supabase
            .from("books")
            .insert({
              slug,
              title_ua: data.metadata.title_ua,
              title_en: data.metadata.title_en,
              is_published: true,
            })
            .select("id")
            .single();
          if (error) throw error;
          bookId = created.id;
        }

        // Resolve canto (volume) if provided to link chapters correctly
        let cantoId: string | null = null;
        if (data.metadata.canto) {
          const cantoNum = parseInt(data.metadata.canto, 10);
          const { data: canto } = await supabase
            .from("cantos")
            .select("id")
            .eq("book_id", bookId)
            .eq("canto_number", cantoNum)
            .maybeSingle();
          cantoId = canto?.id || null;
        }

        // Import chapters safely: UPSERT (never delete existing verses)
        const total = data.chapters.length;
        for (let i = 0; i < total; i++) {
          const ch = data.chapters[i];

          // Не передаємо fallback-назви, щоб не перезаписувати існуючі
          const isFallback = (t?: string) => {
            const s = (t || "").trim();
            const n = ch.chapter_number;
            if (!s) return true;
            const re = new RegExp(`^(Глава|Розділ|Chapter|Song|Пісня)\\s*${n}(?:\\s*[.:—-])?$`, "i");
            return re.test(s);
          };
          const chapterToImport: any = { ...ch };
          if (isFallback(chapterToImport.title_ua)) delete chapterToImport.title_ua;
          if (isFallback(chapterToImport.title_en)) delete chapterToImport.title_en;

          await importSingleChapter(supabase, {
            bookId,
            cantoId: cantoId ?? null,
            chapter: chapterToImport,
            strategy: "upsert",
          });
          setProgress(10 + Math.round(((i + 1) / total) * 80));
        }

        const totalVerses = data.chapters.reduce((sum, ch) => sum + (ch.verses?.length || 0), 0);
        toast({
          title: "✅ Імпорт завершено",
          description: `${totalVerses} віршів збережено.`,
        });

        // Автоперехід до сторінки розділу після імпорту
        const chapterNum = data.chapters[0]?.chapter_number;
        const slugForPath = data.metadata.book_slug || "library";
        const cantoNum = data.metadata.canto;
        const targetPath = cantoNum
          ? `/veda-reader/${slugForPath}/canto/${cantoNum}/chapter/${chapterNum}`
          : `/veda-reader/${slugForPath}/${chapterNum}`;

        setCurrentStep("save");
        navigate(targetPath);
      } catch (e: any) {
        toast({ title: "Помилка збереження", description: e.message, variant: "destructive" });
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    },
    [importData],
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <CardTitle>Universal Book Import (Fixed)</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <ParserStatus />
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Вийти
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isProcessing && (
            <div className="mb-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-1">Обробка... {progress}%</p>
            </div>
          )}

          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="source" onClick={() => setCurrentStep("source")}>
                <Globe className="w-4 h-4 mr-2" />
                Vedabase
              </TabsTrigger>
              <TabsTrigger value="file" onClick={() => setCurrentStep("file")}>
                <Upload className="w-4 h-4 mr-2" />
                Файл
              </TabsTrigger>
              <TabsTrigger value="intro">Intro</TabsTrigger>
              <TabsTrigger value="normalize">Norm</TabsTrigger>
              <TabsTrigger value="preview">Перегляд</TabsTrigger>
              <TabsTrigger value="save">Збереження</TabsTrigger>
            </TabsList>

            <TabsContent value="source" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Книга</Label>
                  <select
                    value={vedabaseBook}
                    onChange={(e) => setVedabaseBook(e.target.value)}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  >
                    {VEDABASE_BOOKS.map((book) => (
                      <option key={book.slug} value={book.slug}>
                        {book.name_ua} ({book.slug.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
                {currentBookInfo?.isMultiVolume && (
                  <div>
                    <Label>{currentBookInfo?.volumeLabel}</Label>
                    <select
                      value={vedabaseCanto}
                      onChange={(e) => setVedabaseCanto(e.target.value)}
                      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                    >
                      <option value="">Оберіть...</option>
                      {currentBookInfo.cantos?.map((c) => (
                        <option key={c} value={String(c)}>
                          {String(c)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Глава</Label>
                  <Input value={vedabaseChapter} onChange={(e) => setVedabaseChapter(e.target.value)} />
                </div>
                <div>
                  <Label>Вірші (опціонально)</Label>
                  <Input value={vedabaseVerse} onChange={(e) => setVedabaseVerse(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Назва глави (UA)</Label>
                  <Input
                    value={importData.metadata.title_ua}
                    onChange={(e) =>
                      setImportData((prev) => ({
                        ...prev,
                        metadata: { ...prev.metadata, title_ua: e.target.value },
                      }))
                    }
                    placeholder={`${currentBookInfo?.name_ua} ${vedabaseCanto} ${vedabaseChapter}`}
                  />
                </div>
                <div>
                  <Label>Назва глави (EN)</Label>
                  <Input
                    value={importData.metadata.title_en}
                    onChange={(e) =>
                      setImportData((prev) => ({
                        ...prev,
                        metadata: { ...prev.metadata, title_en: e.target.value },
                      }))
                    }
                    placeholder={`${vedabaseBook.toUpperCase()} ${vedabaseCanto} ${vedabaseChapter}`}
                  />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={handleVedabaseImport}
                  disabled={
                    isProcessing ||
                    currentBookInfo?.source === "bhaktivinodainstitute" ||
                    currentBookInfo?.source === "kksongs"
                  }
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Імпортувати главу
                </Button>

                <Button
                  onClick={handleVedabaseImportAllChapters}
                  disabled={
                    isProcessing ||
                    currentBookInfo?.source === "bhaktivinodainstitute" ||
                    currentBookInfo?.source === "kksongs"
                  }
                  variant="secondary"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Імпортувати всі глави
                </Button>

                {(currentBookInfo?.source === "bhaktivinodainstitute" || currentBookInfo?.source === "kksongs") && (
                  <Button onClick={() => handleBhaktivinodaImport()} disabled={isProcessing} variant="secondary">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {currentBookInfo?.source === "kksongs"
                      ? "Імпортувати з KKSongs"
                      : "Імпортувати з Bhaktivinoda Institute"}
                  </Button>
                )}

                {currentBookInfo?.source === "wisdomlib" && (
                  <Button onClick={() => handleWisdomlibImport()} disabled={isProcessing} variant="secondary">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Імпортувати з WisdomLib.org
                  </Button>
                )}
              </div>

              {/* Інфо про масовий імпорт */}
              {currentBookInfo?.source !== "bhaktivinodainstitute" &&
                currentBookInfo?.source !== "kksongs" &&
                currentBookInfo?.source !== "wisdomlib" && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-900 dark:text-green-100">
                      <strong>💡 Порада:</strong> Кнопка "Імпортувати всі глави" автоматично визначить кількість глав
                      {currentBookInfo?.isMultiVolume ? ` у вказаному канто/ліла` : ` у книзі`} та імпортує їх
                      послідовно. Прогрес буде відображатися в реальному часі. Для CC потрібно вказати ліла
                      (adi/madhya/antya).
                    </p>
                  </div>
                )}

              {currentBookInfo?.source === "kksongs" && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>ℹ️ KKSongs (kksongs.org):</strong> Імпортується <strong>Bengali</strong>, transliteration,
                    translation та commentary. Кожна пісня завантажується з 3 окремих сторінок.
                  </p>
                </div>
              )}

              {currentBookInfo?.source === "bhaktivinodainstitute" && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>ℹ️ Bhaktivinoda Institute:</strong> Імпортується тільки <strong>EN</strong> сторона
                    (transliteration + translation). Sanskrit, word-for-word та commentary можна додати пізніше вручну.
                  </p>
                  {currentBookInfo?.sourceUrl && (
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                      Джерело: {currentBookInfo.sourceUrl}
                    </p>
                  )}
                </div>
              )}

              {currentBookInfo?.source === "wisdomlib" && (
                <>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-sm text-purple-900 dark:text-purple-100">
                      <strong>ℹ️ WisdomLib.org:</strong> Імпортується <strong>Bengali</strong> текст, транслітерація з
                      бенгалі, переклад англійською та Gaudiya-bhāṣya коментарі. Оберіть khaṇḍa (adi/madhya/antya) для
                      імпорту всіх глав.
                    </p>
                    {currentBookInfo?.sourceUrl && (
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
                        Джерело: {currentBookInfo.sourceUrl}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
                    <Label htmlFor="wisdomlib-throttle" className="text-sm font-medium mb-2 block">
                      ⏱️ Затримка між запитами (мс)
                    </Label>
                    <Input
                      id="wisdomlib-throttle"
                      type="number"
                      value={wisdomlibThrottle}
                      onChange={(e) => setWisdomlibThrottle(Number(e.target.value))}
                      min={500}
                      max={3000}
                      step={100}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Рекомендовано: 1000-1500 мс для уникнення timeout. Більше значення = повільніше, але надійніше.
                    </p>
                  </div>

                  {skippedUrls.length > 0 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                        ⚠️ Пропущено {skippedUrls.length} глав
                      </h4>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {skippedUrls.map((item, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="text-yellow-700 dark:text-yellow-300 font-mono">{item.url}</span>
                            <span className="text-yellow-600 dark:text-yellow-400 ml-2">({item.reason})</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => {
                          toast({
                            title: "Функція у розробці",
                            description: "Повтор пропущених URL буде додано в наступній версії",
                          });
                        }}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        disabled
                      >
                        Повторити пропущені
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="file" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Крок 1: Оберіть книгу та шаблон</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Книга</Label>
                      <select
                        value={vedabaseBook}
                        onChange={(e) => {
                          setVedabaseBook(e.target.value);
                          const book = getBookConfigByVedabaseSlug(e.target.value);
                          if (book?.templateId) {
                            setSelectedTemplate(book.templateId);
                          }
                        }}
                        className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                      >
                        {VEDABASE_BOOKS.map((book) => (
                          <option key={book.slug} value={book.slug}>
                            {book.name_ua} ({book.slug.toUpperCase()})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Шаблон розпізнавання</Label>
                      <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                      >
                        {BOOK_TEMPLATES.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">Автоматично обрано для вибраної книги</p>
                    </div>
                  </div>

                  {currentBookInfo?.isMultiVolume && (
                    <div className="mt-4">
                      <Label>{currentBookInfo?.volumeLabel}</Label>
                      <select
                        value={vedabaseCanto}
                        onChange={(e) => setVedabaseCanto(e.target.value)}
                        className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                      >
                        <option value="">Оберіть...</option>
                        {currentBookInfo.cantos?.map((c) => (
                          <option key={c} value={String(c)}>
                            {String(c)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Крок 2: Завантажте файл</h3>
                  <div className="rounded-lg border-2 border-dashed p-8 text-center">
                    <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <label className="cursor-pointer">
                      <span className="text-primary hover:underline font-medium">Натисніть для вибору файлу</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.epub,.txt,.md,.docx"
                        onChange={handleFileUpload}
                        disabled={isProcessing}
                      />
                    </label>
                    <p className="mt-2 text-sm text-muted-foreground">Підтримувані формати: PDF, EPUB, DOCX, TXT, MD</p>
                  </div>
                  {fileText && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm">
                        📄 Завантажено: <strong>{fileText.length.toLocaleString()}</strong> символів
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => parseFileText()}
                        className="mt-2"
                        disabled={isProcessing}
                      >
                        🔄 Перепарсити з поточним шаблоном
                      </Button>
                    </div>
                  )}
                </div>

                {parsedChapters.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Крок 3: Оберіть розділ для імпорту</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Розділ ({parsedChapters.length} знайдено)</Label>
                        <select
                          value={selectedChapterIndex}
                          onChange={(e) => setSelectedChapterIndex(parseInt(e.target.value))}
                          className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                        >
                          {parsedChapters.map((ch, idx) => (
                            <option key={idx} value={idx}>
                              Розділ {ch.chapter_number}: {ch.title_ua || ch.title_en || "Без назви"} (
                              {ch.verses?.length || 0} віршів, тип: {ch.chapter_type})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">Попередній перегляд</h4>
                        {parsedChapters[selectedChapterIndex] && (
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Номер:</strong> {parsedChapters[selectedChapterIndex].chapter_number}
                            </p>
                            <p>
                              <strong>Назва (UA):</strong>{" "}
                              {parsedChapters[selectedChapterIndex].title_ua || "Не вказано"}
                            </p>
                            <p>
                              <strong>Тип:</strong> {parsedChapters[selectedChapterIndex].chapter_type}
                            </p>
                            <p>
                              <strong>Віршів:</strong> {parsedChapters[selectedChapterIndex].verses?.length || 0}
                            </p>
                            {parsedChapters[selectedChapterIndex].verses?.length > 0 && (
                              <div className="mt-3 p-3 bg-background rounded border">
                                <p className="font-semibold text-xs mb-2">Перший вірш:</p>
                                <p className="text-xs">
                                  <strong>№:</strong> {parsedChapters[selectedChapterIndex].verses[0].verse_number}
                                </p>
                                {parsedChapters[selectedChapterIndex].verses[0].sanskrit && (
                                  <p className="text-xs mt-1">
                                    <strong>Санскрит:</strong>{" "}
                                    {parsedChapters[selectedChapterIndex].verses[0].sanskrit.substring(0, 100)}...
                                  </p>
                                )}
                                {parsedChapters[selectedChapterIndex].verses[0].translation_ua && (
                                  <p className="text-xs mt-1">
                                    <strong>Переклад:</strong>{" "}
                                    {parsedChapters[selectedChapterIndex].verses[0].translation_ua.substring(0, 150)}
                                    ...
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Назва розділу (UA) - необов'язково</Label>
                          <Input
                            value={importData.metadata.title_ua}
                            onChange={(e) =>
                              setImportData((prev) => ({
                                ...prev,
                                metadata: { ...prev.metadata, title_ua: e.target.value },
                              }))
                            }
                            placeholder={parsedChapters[selectedChapterIndex]?.title_ua || "Залишити як є"}
                          />
                        </div>
                        <div>
                          <Label>Назва розділу (EN) - необов'язково</Label>
                          <Input
                            value={importData.metadata.title_en}
                            onChange={(e) =>
                              setImportData((prev) => ({
                                ...prev,
                                metadata: { ...prev.metadata, title_en: e.target.value },
                              }))
                            }
                            placeholder={parsedChapters[selectedChapterIndex]?.title_en || "Залишити як є"}
                          />
                        </div>
                      </div>

                      <Button onClick={handleFileChapterImport} disabled={isProcessing} className="w-full">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Імпортувати обраний розділ
                      </Button>

                      {/* ✨ Спеціальна кнопка для Raja Vidya - двомовний імпорт */}
                      {selectedTemplate === "raja-vidya" && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            📚 Raja Vidya: Двомовний імпорт
                          </h4>
                          <p className="text-xs text-blue-800 dark:text-blue-200 mb-3">
                            Автоматично завантажить англійські версії всіх глав з Vedabase та об'єднає з українським
                            перекладом з файлу.
                          </p>
                          <Button
                            onClick={handleRajaVidyaDualImport}
                            disabled={isProcessing}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            Імпортувати ВСІ глави (UA з файлу + EN з Vedabase)
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Додаткові імпортери: Лекції та Листи (без зміни існуючого UI) */}
              <div className="mt-8 space-y-8">
                <LectureImporter />
                <LetterImporter />
              </div>
            </TabsContent>

            <TabsContent value="intro" className="space-y-4">
              <div className="space-y-3">
                <Label>Intro (EN) — з Vedabase</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        setIsProcessing(true);
                        const chapterNum = parseInt(vedabaseChapter || "0", 10);
                        const bookInfo = getBookConfigByVedabaseSlug(vedabaseBook)!;

                        // ✅ Формуємо URL залежно від типу книги
                        const vedabase_base = bookInfo.isMultiVolume
                          ? `https://vedabase.io/en/library/${vedabaseBook}/${vedabaseCanto}/${chapterNum}/`
                          : `https://vedabase.io/en/library/${vedabaseBook}/${chapterNum}/`;
                        const res = await fetch(vedabase_base);
                        const html = await res.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, "text/html");
                        // Грубий хак: беремо перші параграфи перед списком віршів
                        const allP = Array.from(doc.querySelectorAll("main p, .entry-content p"));
                        const introParas: string[] = [];
                        for (const p of allP) {
                          const txt = p.textContent?.trim() || "";
                          if (!txt) continue;
                          if (/[0-9]+\s*:\s*[0-9]+/.test(txt)) break; // зупиняємось, якщо схоже на посилання
                          if (p.querySelector("a[href*='/cc/']")) break; // список віршів
                          introParas.push(`<p>${txt}</p>`);
                          if (introParas.length >= 6) break; // обмежимося
                        }
                        const introHtml = introParas.join("\n");
                        setImportData((prev) => {
                          const chapters = prev.chapters.length
                            ? [...prev.chapters]
                            : [{ chapter_number: chapterNum, chapter_type: "verses", verses: [] }];
                          chapters[0] = { ...chapters[0], intro_en: introHtml };
                          return { ...prev, chapters };
                        });
                        toast({ title: "Intro додано", description: `${introParas.length} абзаців` });
                      } catch (e: any) {
                        toast({ title: "Intro помилка", description: e.message, variant: "destructive" });
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                  >
                    Завантажити Intro EN
                  </Button>
                </div>
                <Label>Intro (UA)</Label>
                <Textarea
                  value={importData.chapters[0]?.intro_ua || ""}
                  onChange={(e) =>
                    setImportData((prev) => {
                      const ch = [...prev.chapters];
                      if (!ch.length)
                        ch.push({
                          chapter_number: parseInt(vedabaseChapter || "0", 10) || 1,
                          chapter_type: "verses",
                          verses: [],
                        });
                      ch[0] = { ...ch[0], intro_ua: e.target.value };
                      return { ...prev, chapters: ch };
                    })
                  }
                  placeholder="Вставте український вступ (за потреби)"
                />
                <Label>Intro (EN)</Label>
                <Textarea
                  value={importData.chapters[0]?.intro_en || ""}
                  onChange={(e) =>
                    setImportData((prev) => {
                      const ch = [...prev.chapters];
                      if (!ch.length)
                        ch.push({
                          chapter_number: parseInt(vedabaseChapter || "0", 10) || 1,
                          chapter_type: "verses",
                          verses: [],
                        });
                      ch[0] = { ...ch[0], intro_en: e.target.value };
                      return { ...prev, chapters: ch };
                    })
                  }
                  placeholder="Відредагуйте англійський вступ"
                />
              </div>
            </TabsContent>

            <TabsContent value="normalize" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Нормалізація послівних термінів (UA)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Застосувати технічну нормалізацію діакритики (ı̄ тощо) до поля "synonyms_ua" у поточних даних
                    імпорту.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setImportData((prev) => {
                        const chapters = prev.chapters.map((ch) => ({
                          ...ch,
                          verses: ch.verses.map((v: any) => ({
                            ...v,
                            synonyms_ua: v.synonyms_ua ? normalizeTransliteration(v.synonyms_ua) : v.synonyms_ua,
                          })),
                        }));
                        return { ...prev, chapters };
                      });
                      toast({ title: "Нормалізовано", description: "Символи в послівних виправлено у даних імпорту" });
                    }}
                  >
                    Нормалізувати зараз
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Результат парсингу</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Глав: {importData.chapters.length}</p>
                  <p>Символів JSON: {importData.processedText.length}</p>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button onClick={() => saveToDatabase()}>
                  <Download className="w-4 h-4 mr-2" />
                  Зберегти в базу
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
