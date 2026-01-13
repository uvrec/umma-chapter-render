/**
 * Admin сторінка для імпорту лекцій з Vedabase
 *
 * Маршрут: /admin/lecture-import
 *
 * ВАЖЛИВО: Потрібна міграція 20251107000001_create_lectures_tables.sql
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { LectureImporter } from "@/components/admin/LectureImporter";
import { BulkVedabaseImporter } from "@/components/admin/BulkVedabaseImporter";
import {
  ArrowLeft,
  BookOpen,
  Settings,
  FileText,
  Info,
  ExternalLink,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function LectureImport() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const [activeTab, setActiveTab] = useState("import");

  // Статистика лекцій (після міграції)
  const { data: stats } = useQuery({
    queryKey: ["lecture-stats"],
    queryFn: async () => {
      // NOTE: Це буде працювати тільки після застосування міграції
      try {
        const { count: totalLectures } = await (supabase as any)
          .from("lectures")
          .select("*", { count: "exact", head: true });

        const { count: totalParagraphs } = await (supabase as any)
          .from("lecture_paragraphs")
          .select("*", { count: "exact", head: true });

        const { data: types } = await (supabase as any)
          .from("lectures")
          .select("lecture_type")
          .order("lecture_type");

        const { data: locations } = await (supabase as any)
          .from("lectures")
          .select("location_en")
          .order("location_en");

        const uniqueTypes = new Set(types?.map((t: any) => t.lecture_type));
        const uniqueLocations = new Set(locations?.map((l: any) => l.location_en));

        return {
          totalLectures: totalLectures || 0,
          totalParagraphs: totalParagraphs || 0,
          uniqueTypes: uniqueTypes.size,
          uniqueLocations: uniqueLocations.size,
        };
      } catch (error) {
        // Таблиці ще не існують
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
            onClick={() => navigate("/library/lectures")}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Переглянути лекції
          </Button>
        </div>

        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Імпорт лекцій з Vedabase</h1>
          <p className="text-muted-foreground">
            Інструменти для імпорту та управління лекціями Шріли Прабгупади
          </p>
        </div>

        {/* Статистика */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Всього лекцій
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalLectures}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Всього параграфів
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalParagraphs}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Типів лекцій
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.uniqueTypes}</div>
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
          </div>
        )}

        {/* Попередження про міграцію */}
        {!stats && (
          <Alert variant="destructive" className="mb-8">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>⚠️ Міграцію не застосовано!</strong>
              <br />
              Таблиці <code>lectures</code> та <code>lecture_paragraphs</code> не
              знайдено в базі даних.
              <br />
              Застосуйте міграцію{" "}
              <code>20251107000001_create_lectures_tables.sql</code> через Supabase
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
              <BookOpen className="w-4 h-4 mr-2" />
              Документація
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Налаштування
            </TabsTrigger>
          </TabsList>

          {/* Tab: Імпорт JSON */}
          <TabsContent value="import" className="mt-6">
            <LectureImporter />
          </TabsContent>

          {/* Tab: Масовий імпорт */}
          <TabsContent value="bulk" className="mt-6">
            <BulkVedabaseImporter type="lectures" />
          </TabsContent>

          {/* Tab: Документація */}
          <TabsContent value="docs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Документація по імпорту лекцій</CardTitle>
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
                    2. Завантаження лекції з Vedabase
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>Використовуйте скрипт для завантаження лекції:</p>
                    <pre className="bg-muted p-3 rounded overflow-x-auto">
                      python tools/lectures_importer.py --slug 660307bg-new-york
                    </pre>
                    <p className="text-muted-foreground">
                      Де <code>660307bg-new-york</code> - це slug лекції з
                      vedabase.io/en/library/transcripts/
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
                      python tools/lecture_translator.py \{"\n"}  --input
                      tools/outputs/lectures/660307bg-new-york.json
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
                      Для імпорту багатьох лекцій створіть bash скрипт з циклом:
                    </p>
                    <pre className="bg-muted p-3 rounded overflow-x-auto text-xs">
                      {`#!/bin/bash
SLUGS=(
  "660219bg-new-york"
  "660302bg-new-york"
  "660307bg-new-york"
)

for slug in "\${SLUGS[@]}"; do
  python tools/lectures_importer.py --slug "$slug"
  python tools/lecture_translator.py --input "tools/outputs/lectures/$\{slug\}.json"
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
                      href="https://vedabase.io/en/library/transcripts/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Vedabase Transcripts
                    </a>
                    <div className="flex items-center text-sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Детальна документація:{" "}
                      <code className="ml-1">tools/LECTURES_IMPORT_README.md</code>
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
                    Slug формат: <code>YYMMDD[book]-[location]</code>
                  </p>
                  <div className="space-y-1 text-sm">
                    <div>
                      <Badge variant="outline" className="mr-2">
                        YY
                      </Badge>
                      Рік (66 = 1966)
                    </div>
                    <div>
                      <Badge variant="outline" className="mr-2">
                        MM
                      </Badge>
                      Місяць (03 = березень)
                    </div>
                    <div>
                      <Badge variant="outline" className="mr-2">
                        DD
                      </Badge>
                      День (07)
                    </div>
                    <div>
                      <Badge variant="outline" className="mr-2">
                        book
                      </Badge>
                      Книга (bg, sb, cc)
                    </div>
                    <div>
                      <Badge variant="outline" className="mr-2">
                        location
                      </Badge>
                      Локація (new-york, london)
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Типи лекцій</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Conversation",
                      "Walk",
                      "Morning Walk",
                      "Lecture",
                      "Bhagavad-gita",
                      "Srimad-Bhagavatam",
                      "Initiation",
                    ].map((type) => (
                      <Badge key={type} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Структура JSON</h3>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(
                      {
                        metadata: {
                          slug: "660307bg-new-york",
                          title_en: "Bhagavad-gītā 2.12",
                          title_ua: "Бгаґавад-ґіта 2.12",
                          lecture_date: "1966-03-07",
                          location_en: "New York",
                          location_ua: "Нью-Йорк",
                          lecture_type: "Bhagavad-gita",
                          audio_url: "https://...",
                          book_slug: "bg",
                          chapter_number: 2,
                          verse_number: "12",
                        },
                        paragraphs: [
                          {
                            paragraph_number: 1,
                            content_en: "Prabhupāda: ...",
                            content_ua: "Прабгупада: ...",
                            audio_timecode: 0,
                          },
                        ],
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
