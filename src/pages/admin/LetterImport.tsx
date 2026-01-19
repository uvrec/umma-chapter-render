/**
 * Admin сторінка для імпорту листів Прабгупади з Vedabase
 *
 * Маршрут: /admin/letter-import
 *
 * ВАЖЛИВО: Потрібна міграція 20251107000002_create_letters_tables.sql
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { LetterImporter } from "@/components/admin/LetterImporter";
import { BulkVedabaseImporter } from "@/components/admin/BulkVedabaseImporter";
import {
  ArrowLeft,
  Mail,
  Settings,
  FileText,
  Info,
  ExternalLink,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function LetterImport() {
  const { user, isAdmin } = useAuth();
  const { getLocalizedPath } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const [activeTab, setActiveTab] = useState("import");

  // Статистика листів (після міграції)
  const { data: stats } = useQuery({
    queryKey: ["letter-stats"],
    queryFn: async () => {
      // NOTE: Це буде працювати тільки після застосування міграції
      try {
        const { count: totalLetters } = await (supabase as any)
          .from("letters")
          .select("*", { count: "exact", head: true });

        const { data: recipients } = await (supabase as any)
          .from("letters")
          .select("recipient_en")
          .order("recipient_en");

        const { data: locations } = await (supabase as any)
          .from("letters")
          .select("location_en")
          .order("location_en");

        const { data: years } = await (supabase as any)
          .from("letters")
          .select("letter_date")
          .order("letter_date");

        const uniqueRecipients = new Set(recipients?.map((r: any) => r.recipient_en));
        const uniqueLocations = new Set(locations?.map((l: any) => l.location_en));

        // Підрахувати діапазон років
        const dates = years?.map((y: any) => new Date(y.letter_date).getFullYear()) || [];
        const minYear = dates.length > 0 ? Math.min(...dates) : null;
        const maxYear = dates.length > 0 ? Math.max(...dates) : null;
        const yearRange = minYear && maxYear ? `${minYear}-${maxYear}` : "N/A";

        return {
          totalLetters: totalLetters || 0,
          uniqueRecipients: uniqueRecipients.size,
          uniqueLocations: uniqueLocations.size,
          yearRange,
        };
      } catch (error) {
        // Таблиця ще не існує
        return null;
      }
    },
    retry: false,
  });

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Навігація */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад до панелі адміністратора
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(getLocalizedPath("/library/letters"))}
          >
            <Mail className="w-4 h-4 mr-2" />
            Переглянути листи
          </Button>
        </div>

        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Імпорт листів з Vedabase</h1>
          <p className="text-muted-foreground">
            Інструменти для імпорту та управління листами Шріли Прабгупади
          </p>
        </div>

        {/* Статистика */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Всього листів
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalLetters}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Отримувачів
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.uniqueRecipients}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Локацій
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.uniqueLocations}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Період
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{stats.yearRange}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Попередження про міграцію */}
        {!stats && (
          <Alert variant="destructive" className="mb-8">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>⚠️ Міграцію не застосовано!</strong>
              <br />
              Таблиця <code>letters</code> не знайдена в базі даних.
              <br />
              Застосуйте міграцію{" "}
              <code>20251107000002_create_letters_tables.sql</code> через Supabase
              Dashboard або CLI.
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="import">
              <FileText className="w-4 h-4 mr-2" />
              Імпорт JSON
            </TabsTrigger>
            <TabsTrigger value="bulk">
              <Download className="w-4 h-4 mr-2" />
              Масовий імпорт
            </TabsTrigger>
            <TabsTrigger value="docs">
              <Mail className="w-4 h-4 mr-2" />
              Документація
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Налаштування
            </TabsTrigger>
          </TabsList>

          {/* Tab: Імпорт JSON */}
          <TabsContent value="import" className="mt-6">
            <LetterImporter />
          </TabsContent>

          {/* Tab: Масовий імпорт */}
          <TabsContent value="bulk" className="mt-6">
            <BulkVedabaseImporter type="letters" />
          </TabsContent>

          {/* Tab: Документація */}
          <TabsContent value="docs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Документація по імпорту листів</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    1. Підготовка середовища
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>Встановіть необхідні Python бібліотеки:</p>
                    <pre className="bg-muted p-3 rounded overflow-x-auto">
                      pip install requests beautifulsoup4 lxml
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    2. Завантаження листа з Vedabase
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>Використовуйте скрипт для завантаження листа:</p>
                    <pre className="bg-muted p-3 rounded overflow-x-auto">
                      python tools/letters_importer.py --slug letter-to-mahatma-gandhi
                    </pre>
                    <p className="text-muted-foreground">
                      Де <code>letter-to-mahatma-gandhi</code> - це slug листа з
                      vedabase.io/en/library/letters/
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    3. Переклад на українську
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>Застосуйте транслітерацію та переклад:</p>
                    <pre className="bg-muted p-3 rounded overflow-x-auto">
                      python tools/letter_translator.py \{"\n"}  --input
                      tools/outputs/letters/letter-to-mahatma-gandhi.json
                    </pre>
                    <p className="text-muted-foreground">
                      Скрипт створить файл з суфіксом <code>_ua.json</code>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    4. Імпорт в базу даних
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>Завантажте згенерований JSON через вкладку "Імпорт" вгорі</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    5. Масовий імпорт
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      Для імпорту багатьох листів створіть bash скрипт з циклом:
                    </p>
                    <pre className="bg-muted p-3 rounded overflow-x-auto text-xs">
                      {`#!/bin/bash
SLUGS=(
  "letter-to-mahatma-gandhi"
  "letter-to-jawaharlal-nehru"
  "letter-to-sardar-patel"
)

for slug in "\${SLUGS[@]}"; do
  python tools/letters_importer.py --slug "$slug"
  python tools/letter_translator.py --input "tools/outputs/letters/\${slug}.json"
  sleep 3
done`}
                    </pre>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-3">
                    Посилання на ресурси
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="https://vedabase.io/en/library/letters/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Vedabase Letters
                    </a>
                    <div className="flex items-center text-sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Детальна документація:{" "}
                      <code className="ml-1">tools/LETTERS_IMPORT_README.md</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Налаштування */}
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Налаштування імпорту</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Формат slug</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Slug формат: <code>letter-to-[recipient-name]</code>
                  </p>
                  <div className="space-y-1 text-sm">
                    <div>
                      <Badge variant="outline" className="mr-2">
                        letter-to-mahatma-gandhi
                      </Badge>
                      Лист Махатмі Ґанді
                    </div>
                    <div>
                      <Badge variant="outline" className="mr-2">
                        letter-to-jawaharlal-nehru
                      </Badge>
                      Лист Джавахарлалу Неру
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Відмінності від лекцій</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Немає параграфів - суцільний текст</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Є отримувач (recipient)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Є reference ID (напр. 47-07-12)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Є адреса отримувача</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600">❌</span>
                      <span>Немає аудіо</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Структура JSON</h3>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(
                      {
                        metadata: {
                          slug: "letter-to-mahatma-gandhi",
                          recipient_en: "Mahatma Gandhi",
                          recipient_ua: "Махатма Ґанді",
                          letter_date: "1947-07-12",
                          location_en: "Cawnpore",
                          location_ua: "Канпур",
                          reference: "47-07-12",
                          address_block: "Mahatma Gandhijee\nBhangi Colony\nNew Delhi.",
                        },
                        content_en: "Dear Friend Mahatmajee, ...",
                        content_ua: "Шановний друже Махатмаджі, ...",
                        sanskrit_terms: ["Bhagavad-gītā", "dharma"],
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
