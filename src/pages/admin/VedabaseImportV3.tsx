// ВИПРАВЛЕНА ВЕРСІЯ - Імпорт з Vedabase без JS в тексті
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

// ============================================================================
// CRITICAL FIX: Clean JavaScript BEFORE parsing
// ============================================================================
function cleanHTML(html: string): string {
  // Remove script tags and their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  // Remove style tags
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  // Remove inline JS
  html = html.replace(/on\w+="[^"]*"/gi, "");
  return html;
}

// ============================================================================
// Vedabase Parser (English)
// ============================================================================
function extractVedabaseContent(html: string) {
  html = cleanHTML(html); // CLEAN FIRST!

  const result = {
    sanskrit: "",
    transliteration: "",
    synonyms: "",
    translation: "",
    purport: "",
  };

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const bodyText = doc.body.textContent || "";

    // 1. Sanskrit
    const devanagariMatch = bodyText.match(/[\u0900-\u097F।॥\s]+/g);
    const bengaliMatch = bodyText.match(/[\u0980-\u09FF।॥\s]+/g);
    const allMatches = [...(devanagariMatch || []), ...(bengaliMatch || [])];
    const longest = allMatches
      .map((s) => s.trim())
      .filter((s) => s.length > 15)
      .sort((a, b) => b.length - a.length)[0];

    if (longest) result.sanskrit = longest;

    // 2. Transliteration (IAST with diacritics)
    const iastMatches = bodyText.match(/[a-zA-Zāīūṛṝḷḹēōṃḥśṣṇṭḍñṅ\s\-']{30,}/g);
    if (iastMatches) {
      const withDiacritics = iastMatches
        .filter((t) => /[āīūṛṝḷḹēōṃḥśṣṇṭḍñṅ]/.test(t) && t.split(/\s+/).length > 4)
        .sort((a, b) => b.length - a.length);

      if (withDiacritics.length > 0) {
        result.transliteration = withDiacritics[0].trim();
      }
    }

    // 3. Synonyms
    const synonymsMatch = doc.body.innerHTML.match(/(?:SYNONYMS|Word for word)[:\s]*(.*?)(?=TRANSLATION|$)/is);
    if (synonymsMatch) {
      result.synonyms = synonymsMatch[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\\/g, "") // Remove backslashes
        .replace(/["']/g, "") // Remove quotes
        .trim()
        .substring(0, 3000);
    }

    // 4. Translation
    const translationMatch = doc.body.innerHTML.match(/TRANSLATION[:\s]*(.*?)(?=PURPORT|COMMENTARY|$)/is);
    if (translationMatch) {
      result.translation = translationMatch[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\\/g, "")
        .replace(/["']/g, "")
        .trim()
        .substring(0, 1500);
    }

    // 5. Purport
    const purportMatch = doc.body.innerHTML.match(/(?:PURPORT|COMMENTARY)[:\s]*(.*?)$/is);
    if (purportMatch) {
      result.purport = purportMatch[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\\/g, "")
        .replace(/["']/g, "")
        .trim()
        .substring(0, 15000);
    }
  } catch (error) {
    console.error("Parse error:", error);
  }

  console.log("✅ Vedabase parsed:", {
    sanskrit: result.sanskrit.substring(0, 30) + "...",
    transliteration: result.transliteration.substring(0, 30) + "...",
    synonyms: result.synonyms.substring(0, 50) + "...",
    translation: result.translation.substring(0, 50) + "...",
    purport: result.purport.length + " chars",
  });

  return result;
}

// ============================================================================
// Gitabase Parser (Ukrainian)
// ============================================================================
function extractGitabaseContent(html: string) {
  html = cleanHTML(html);

  const result = {
    transliteration: "",
    synonyms: "",
    translation: "",
    purport: "",
  };

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // 1. Transliteration - first italic
    const italics = doc.querySelectorAll("i");
    if (italics.length > 0) {
      const first = italics[0].textContent?.trim() || "";
      if (first.length > 10) result.transliteration = first;
    }

    // 2. Synonyms - word pairs
    const wordMap = new Map<string, string>();
    italics.forEach((italic) => {
      const word = italic.textContent?.trim() || "";
      if (word.length < 3 || word.length > 50) return;

      let nextNode = italic.nextSibling;
      let translation = "";
      let found = false;

      while (nextNode && !found) {
        const text = nextNode.textContent || "";
        if (text.includes(" — ") || text.includes(" – ")) {
          const parts = text.split(/\s+[—–]\s+/);
          if (parts.length > 1) {
            translation = parts[1].split(/[;,]/)[0].trim();
            found = true;
          }
        }
        nextNode = nextNode.nextSibling;
        if (nextNode?.nodeType === Node.ELEMENT_NODE) {
          if ((nextNode as Element).tagName === "I") break;
        }
      }

      if (translation) wordMap.set(word, translation);
    });

    const pairs: string[] = [];
    wordMap.forEach((trans, word) => pairs.push(`${word} — ${trans}`));
    if (pairs.length > 0) result.synonyms = pairs.join("; ");

    // 3. Translation - after "Текст"
    const blocks = Array.from(doc.querySelectorAll("p, div"));
    let foundText = false;

    for (const block of blocks) {
      const text = block.textContent?.trim() || "";
      if (text === "Текст" || text.startsWith("Текст:")) {
        foundText = true;
        continue;
      }

      if (foundText && text.length > 30 && text.length < 2000) {
        result.translation = text.replace(/^["«]/, "").replace(/[»"]$/, "").trim();
        break;
      }
    }

    // 4. Purport - after "Комментарий"
    let foundCommentary = false;
    const purportParts: string[] = [];

    for (const block of blocks) {
      const text = block.textContent?.trim() || "";

      if (text === "Комментарий" || text.startsWith("Комментарий")) {
        foundCommentary = true;
        continue;
      }

      if (foundCommentary) {
        if (
          text.includes("function(") ||
          text.includes("GoogleAnalytics") ||
          text.includes("След. >>") ||
          text.includes("gitabase.com")
        ) {
          continue;
        }

        if (text.length > 50) purportParts.push(text);
      }
    }

    if (purportParts.length > 0) {
      result.purport = purportParts.join("\n\n").replace(/\s+/g, " ").trim();
    }
  } catch (error) {
    console.error("Gitabase parse error:", error);
  }

  console.log("✅ Gitabase parsed:", {
    transliteration: result.transliteration.substring(0, 30) + "...",
    synonyms: result.synonyms.split(";").length + " pairs",
    translation: result.translation.substring(0, 50) + "...",
    purport: result.purport.length + " chars",
  });

  return result;
}

// ============================================================================
// COMPONENT
// ============================================================================
export default function VedabaseImportFixed() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState("");

  const [bookCode, setBookCode] = useState("bs");
  const [chapterNum, setChapterNum] = useState("5");
  const [verseNum, setVerseNum] = useState("2");
  const [vedabaseURL, setVedabaseURL] = useState("https://vedabase.io/en/library/bs/5/2/");
  const [gitabaseURL, setGitabaseURL] = useState("");

  const [stats, setStats] = useState({ imported: 0, errors: [] as string[] });

  const fetchHTML = async (url: string): Promise<string> => {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  };

  const handleImport = async () => {
    setIsProcessing(true);
    setCurrentStep("Завантаження...");
    setStats({ imported: 0, errors: [] });

    try {
      // 1. Get book
      const { data: book } = await supabase.from("books").select("id").eq("code", bookCode).single();

      if (!book) throw new Error("Книга не знайдена");

      // 2. Get/create chapter
      let { data: chapter } = await supabase
        .from("chapters")
        .select("id")
        .eq("book_id", book.id)
        .eq("chapter_number", parseInt(chapterNum))
        .maybeSingle();

      if (!chapter) {
        const { data: newChapter, error } = await supabase
          .from("chapters")
          .insert({
            book_id: book.id,
            chapter_number: parseInt(chapterNum),
            title_ua: `Глава ${chapterNum}`,
            title_en: `Chapter ${chapterNum}`,
            is_published: true,
          })
          .select("id")
          .single();

        if (error) throw error;
        chapter = newChapter;
      }

      // 3. Parse Vedabase
      setCurrentStep("Парсинг Vedabase...");
      const vedabaseHTML = await fetchHTML(vedabaseURL);
      const vedabaseData = extractVedabaseContent(vedabaseHTML);

      // 4. Parse Gitabase
      let gitabaseData = { transliteration: "", synonyms: "", translation: "", purport: "" };
      if (gitabaseURL) {
        setCurrentStep("Парсинг Gitabase...");
        const gitabaseHTML = await fetchHTML(gitabaseURL);
        gitabaseData = extractGitabaseContent(gitabaseHTML);
      }

      // 5. Save to DB
      setCurrentStep("Збереження...");
      const displayBlocks = {
        sanskrit: !!vedabaseData.sanskrit,
        transliteration: !!(vedabaseData.transliteration || gitabaseData.transliteration),
        synonyms: !!(vedabaseData.synonyms || gitabaseData.synonyms),
        translation: !!(vedabaseData.translation || gitabaseData.translation),
        commentary: !!(vedabaseData.purport || gitabaseData.purport),
      };

      const { error } = await supabase.from("verses").upsert(
        {
          chapter_id: chapter.id,
          verse_number: verseNum,
          sanskrit: vedabaseData.sanskrit,
          transliteration: gitabaseData.transliteration || vedabaseData.transliteration,
          synonyms_en: vedabaseData.synonyms,
          translation_en: vedabaseData.translation,
          commentary_en: vedabaseData.purport,
          synonyms_ua: gitabaseData.synonyms,
          translation_ua: gitabaseData.translation,
          commentary_ua: gitabaseData.purport,
          display_blocks: displayBlocks,
          is_published: true,
        },
        { onConflict: "chapter_id,verse_number" },
      );

      if (error) throw error;

      setStats({ imported: 1, errors: [] });
      toast.success("✅ Імпорт успішний!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Помилка";
      setStats((prev) => ({ ...prev, errors: [...prev.errors, msg] }));
      toast.error(`❌ ${msg}`);
    } finally {
      setIsProcessing(false);
      setCurrentStep("");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            Імпорт з Vedabase (ВИПРАВЛЕНИЙ)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Код книги</Label>
                <Input value={bookCode} onChange={(e) => setBookCode(e.target.value)} />
              </div>
              <div>
                <Label>Глава</Label>
                <Input value={chapterNum} onChange={(e) => setChapterNum(e.target.value)} />
              </div>
              <div>
                <Label>Вірш</Label>
                <Input value={verseNum} onChange={(e) => setVerseNum(e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Vedabase URL</Label>
              <Input value={vedabaseURL} onChange={(e) => setVedabaseURL(e.target.value)} />
            </div>

            <div>
              <Label>Gitabase URL (optional)</Label>
              <Input value={gitabaseURL} onChange={(e) => setGitabaseURL(e.target.value)} />
            </div>
          </div>

          <Button onClick={handleImport} disabled={isProcessing} className="w-full">
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {currentStep}
              </>
            ) : (
              "Імпортувати"
            )}
          </Button>

          {stats.imported > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700">
              ✅ Імпортовано: {stats.imported}
            </div>
          )}

          {stats.errors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
              ❌ Помилки: {stats.errors.join(", ")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
