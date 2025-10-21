// Тестова версія з покращеним парсером
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play } from "lucide-react";

// Вбудований парсер (скопіюй це потім в окремий файл)
function extractVedabaseContent(html: string) {
  const result = {
    sanskrit: "",
    transliteration: "",
    synonyms: "",
    translation: "",
    commentary: "",
  };

  try {
    // САНСКРИТ - шукаємо Devanagari/Bengali
    const devanagariMatch = html.match(/[\u0900-\u097F।॥\s]+/g);
    const bengaliMatch = html.match(/[\u0980-\u09FF।॥\s]+/g);

    const allMatches = [...(devanagariMatch || []), ...(bengaliMatch || [])];
    const longest = allMatches
      .map((s) => s.trim())
      .filter((s) => s.length > 10)
      .sort((a, b) => b.length - a.length)[0];

    if (longest) {
      result.sanskrit = longest;
    }

    // ТРАНСЛІТЕРАЦІЯ - IAST з діакритикою
    const iastPattern = /\b[a-zA-Zāīūṛṝḷḹēōṃḥśṣṇṭḍñṅ\s\-']+\b/g;
    const iastMatches = html.match(iastPattern);

    if (iastMatches) {
      const withDiacritics = iastMatches.filter(
        (text) => /[āīūṛṝḷḹēōṃḥśṣṇṭḍñṅ]/.test(text) && text.trim().split(/\s+/).length > 3,
      );

      if (withDiacritics.length > 0) {
        result.transliteration = withDiacritics.sort((a, b) => b.length - a.length)[0].trim();
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

    // КОМЕНТАР
    const commentaryMatch = html.match(/(?:PURPORT|COMMENTARY)[:\s]*(.*?)$/is);
    if (commentaryMatch) {
      result.commentary = commentaryMatch[1]
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

export default function VedabaseImportV3() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const testParser = async () => {
    setIsTesting(true);
    setLogs([]);
    setParsedData(null);

    const testUrl = "https://vedabase.io/en/library/bg/1/1/";

    addLog("🧪 Завантаження HTML з AllOrigins...");
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(testUrl)}`;
      const response = await fetch(proxyUrl);
      const html = await response.text();

      addLog(`✅ Завантажено ${html.length} символів`);

      addLog("🔍 Парсинг контенту...");
      const parsed = extractVedabaseContent(html);

      setParsedData(parsed);

      if (parsed.sanskrit) {
        addLog(`✅ Санскрит: "${parsed.sanskrit.substring(0, 50)}..."`);
      } else {
        addLog(`⚠️ Санскрит не знайдено`);
      }

      if (parsed.transliteration) {
        addLog(`✅ Транслітерація: "${parsed.transliteration.substring(0, 50)}..."`);
      } else {
        addLog(`⚠️ Транслітерація не знайдена`);
      }

      if (parsed.synonyms) {
        addLog(`✅ Синоніми: ${parsed.synonyms.length} символів`);
      } else {
        addLog(`⚠️ Синоніми не знайдені`);
      }

      if (parsed.translation) {
        addLog(`✅ Переклад: ${parsed.translation.length} символів`);
      } else {
        addLog(`⚠️ Переклад не знайдений`);
      }

      if (parsed.commentary) {
        addLog(`✅ Коментар: ${parsed.commentary.length} символів`);
      } else {
        addLog(`⚠️ Коментар не знайдений`);
      }

      addLog("✅ Парсинг завершено!");
    } catch (e) {
      addLog(`❌ Помилка: ${e instanceof Error ? e.message : "unknown"}`);
    }

    setIsTesting(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Тест парсера V3</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Тестує новий парсер який витягує санскрит з JavaScript</p>

          <Button onClick={testParser} disabled={isTesting} className="w-full">
            <Play className="w-4 h-4 mr-2" />
            {isTesting ? "Тестування..." : "Протестувати парсер"}
          </Button>

          {logs.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-auto max-h-96">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}

          {parsedData && (
            <div className="space-y-4 mt-6">
              <h3 className="font-semibold">Розпарсені дані:</h3>

              {parsedData.sanskrit && (
                <div className="bg-muted p-3 rounded">
                  <div className="text-xs font-bold mb-1">САНСКРИТ:</div>
                  <div className="font-sanskrit text-lg">{parsedData.sanskrit}</div>
                </div>
              )}

              {parsedData.transliteration && (
                <div className="bg-muted p-3 rounded">
                  <div className="text-xs font-bold mb-1">ТРАНСЛІТЕРАЦІЯ:</div>
                  <div className="italic">{parsedData.transliteration}</div>
                </div>
              )}

              {parsedData.synonyms && (
                <div className="bg-muted p-3 rounded">
                  <div className="text-xs font-bold mb-1">СИНОНІМИ:</div>
                  <div className="text-sm">{parsedData.synonyms.substring(0, 200)}...</div>
                </div>
              )}

              {parsedData.translation && (
                <div className="bg-muted p-3 rounded">
                  <div className="text-xs font-bold mb-1">ПЕРЕКЛАД:</div>
                  <div>{parsedData.translation}</div>
                </div>
              )}

              {parsedData.commentary && (
                <div className="bg-muted p-3 rounded">
                  <div className="text-xs font-bold mb-1">КОМЕНТАР:</div>
                  <div className="text-sm">{parsedData.commentary.substring(0, 300)}...</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
