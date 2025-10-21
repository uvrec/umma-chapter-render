// ДІАГНОСТИЧНА версія VedabaseImportV3 - показує що відбувається
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play } from "lucide-react";
import { toast } from "sonner";

export default function VedabaseImportV3() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([]);
  const [isTestng, setIsTesting] = useState(false);

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const testProxies = async () => {
    setIsTesting(true);
    setLogs([]);

    const testUrl = "https://vedabase.io/en/library/bg/1/1/";

    addLog("🧪 Тест 1: Supabase Edge Function...");
    try {
      const response = await fetch(
        "https://caf8c97b-0aea-4eba-8bd0-7e77e5a22197.supabase.co/functions/v1/fetch-proxy",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: testUrl }),
        },
      );
      const data = await response.json();
      if (data.html && data.html.length > 100) {
        addLog(`✅ Supabase працює! (${data.html.length} символів)`);
      } else {
        addLog(`❌ Supabase: порожня відповідь`);
      }
    } catch (e) {
      addLog(`❌ Supabase: ${e instanceof Error ? e.message : "помилка"}`);
    }

    await new Promise((r) => setTimeout(r, 1000));

    addLog("🧪 Тест 2: AllOrigins...");
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(testUrl)}`;
      const response = await fetch(proxyUrl);
      const html = await response.text();
      if (html.length > 100) {
        addLog(`✅ AllOrigins працює! (${html.length} символів)`);

        // Перевірка чи є Sanskrit
        if (html.includes("sanskrit") || /[\u0980-\u09FF]/.test(html)) {
          addLog(`✅ Знайдено санскрит в HTML!`);
        } else {
          addLog(`⚠️ Санскрит НЕ знайдено в HTML`);
        }

        // Перевірка структури
        if (html.includes("transliteration")) {
          addLog(`✅ Знайдено транслітерацію`);
        }
        if (html.includes("SYNONYMS") || html.includes("synonyms")) {
          addLog(`✅ Знайдено синоніми`);
        }
        if (html.includes("TRANSLATION") || html.includes("translation")) {
          addLog(`✅ Знайдено переклад`);
        }
      } else {
        addLog(`❌ AllOrigins: порожня відповідь`);
      }
    } catch (e) {
      addLog(`❌ AllOrigins: ${e instanceof Error ? e.message : "помилка"}`);
    }

    await new Promise((r) => setTimeout(r, 1000));

    addLog("🧪 Тест 3: CORSProxy...");
    try {
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(testUrl)}`;
      const response = await fetch(proxyUrl);
      const html = await response.text();
      if (html.length > 100) {
        addLog(`✅ CORSProxy працює! (${html.length} символів)`);
      } else {
        addLog(`❌ CORSProxy: порожня відповідь`);
      }
    } catch (e) {
      addLog(`❌ CORSProxy: ${e instanceof Error ? e.message : "помилка"}`);
    }

    addLog("✅ Тести завершені!");
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
          <CardTitle>Діагностика імпорту V3</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Цей тест перевірить чи працюють CORS проксі та чи можна отримати HTML з Vedabase
          </p>

          <Button onClick={testProxies} disabled={isTesting} className="w-full">
            <Play className="w-4 h-4 mr-2" />
            {isTesting ? "Тестування..." : "Запустити діагностику"}
          </Button>

          {logs.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-auto max-h-96">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}

          <div className="bg-muted p-4 rounded text-sm">
            <strong>Що тестується:</strong>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Supabase Edge Function fetch-proxy</li>
              <li>AllOrigins публічний proxy</li>
              <li>CORSProxy публічний proxy</li>
              <li>Чи є санскрит/переклад в отриманому HTML</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
