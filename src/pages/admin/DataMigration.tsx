// src/pages/admin/DataMigration.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { verses } from "@/data/verses";
import { useToast } from "@/hooks/use-toast";

export default function DataMigration() {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const { toast } = useToast();

  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [imported, setImported] = useState(false);

  // Константи для джерела
  const BOOK_SLUG = "srimad-bhagavatam";
  const CHAPTER_NUMBER = 1;
  const BATCH_SIZE = 10;

  // щоб не оновлювати стан після анмаунту під час імпорту
  const mountedRef = useRef(true);
  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  // коректний редірект по правам
  useEffect(() => {
    if (user && !isAdmin) navigate("/");
    if (!user) navigate("/auth");
  }, [user, isAdmin, navigate]);

  const totalVerses = useMemo(() => verses.length, []);
  const setSafeProgress = (cur: number) => {
    if (!mountedRef.current) return;
    setProgress({ current: cur, total: totalVerses });
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImported(false);
    setSafeProgress(0);

    try {
      // 1) Перевіряємо книгу
      const { data: book, error: bookErr } = await supabase.from("books").select("id").eq("slug", BOOK_SLUG).single();

      if (bookErr || !book?.id) {
        throw new Error('Книгу не знайдено. Перевірте, що існує book зі slug "srimad-bhagavatam".');
      }

      // 2) Перевіряємо главу
      const { data: chapter, error: chErr } = await supabase
        .from("chapters")
        .select("id")
        .eq("book_id", book.id)
        .eq("chapter_number", CHAPTER_NUMBER)
        .single();

      if (chErr || !chapter?.id) {
        throw new Error(`Глава №${CHAPTER_NUMBER} для цієї книги не знайдена. Створіть її перед імпортом.`);
      }

      // 3) Пакетний upsert (щоб не дублювати): унікальність очікуємо по (chapter_id, verse_number)
      // Працює, якщо у БД є унікальний індекс на (chapter_id, verse_number).
      for (let i = 0; i < totalVerses; i += BATCH_SIZE) {
        const batch = verses.slice(i, i + BATCH_SIZE);

        const payload = batch.map((v) => ({
          chapter_id: chapter.id,
          verse_number: v.number,
          sanskrit: v.sanskrit || null,
          transliteration: v.transliteration || null,
          synonyms_ua: v.synonyms || null,
          synonyms_en: null,
          translation_ua: v.translation || null,
          translation_en: null,
          commentary_ua: v.commentary || null,
          commentary_en: null,
          audio_url: v.audioUrl || null,
          is_published: true,
        }));

        // Використовуємо UPSERT, щоб уникати дублікатів
        const { error: insErr } = await supabase.from("verses").upsert(payload, {
          onConflict: "chapter_id,verse_number",
          ignoreDuplicates: true, // якщо рядок вже існує — пропускаємо
        });

        if (insErr) {
          // дружнє повідомлення для найтиповіших причин
          if (insErr.message?.toLowerCase().includes("violates unique constraint")) {
            throw new Error("Деякі вірші вже існують (унікальність за chapter_id + verse_number). Імпорт зупинено.");
          }
          throw insErr;
        }

        setSafeProgress(Math.min(i + batch.length, totalVerses));
      }

      if (mountedRef.current) {
        setImported(true);
        toast({
          title: "Готово!",
          description: `Імпортовано ${totalVerses} віршів`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Помилка імпорту",
        description: error?.message || "Невідома помилка",
        variant: "destructive",
      });
      // лог у консоль для дебагу
      // eslint-disable-next-line no-console
      console.error("Import error:", error);
    } finally {
      if (mountedRef.current) setIsImporting(false);
    }
  };

  // Поки перевіряються права — нічого не рендеримо
  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Data Migration</h1>
        </div>

        <Card className="p-6 max-w-2xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Import Verses from Data File</h2>
              <p className="text-muted-foreground">
                Це імпортує всі {totalVerses} віршів з локального файлу даних у базу. Операція ідемпотентна (upsert).
              </p>
            </div>

            {imported ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span>Успішно імпортовано {totalVerses} віршів!</span>
              </div>
            ) : (
              <>
                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Імпорт триває…</span>
                      <span>
                        {progress.current} / {progress.total}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width:
                            progress.total > 0 ? `${Math.round((progress.current / progress.total) * 100)}%` : "0%",
                        }}
                      />
                    </div>
                  </div>
                )}

                <Button onClick={handleImport} disabled={isImporting} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  {isImporting ? "Імпорт…" : "Почати імпорт"}
                </Button>
              </>
            )}

            <div className="flex items-start gap-2 p-4 bg-muted rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Перед імпортом переконайтесь, що:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Існує книга зі <code>slug</code> "<strong>{BOOK_SLUG}</strong>"
                  </li>
                  <li>Для неї існує глава №{CHAPTER_NUMBER}</li>
                  <li>Українські поля будуть заповнені, англійські — залишаться порожніми</li>
                  <li>Повторний запуск не створить дублі — використовується upsert</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
