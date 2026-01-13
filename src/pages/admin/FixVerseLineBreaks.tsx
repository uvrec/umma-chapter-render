import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { processVerseLineBreaks } from "@/utils/import/lineBreaker";

const PAGE_SIZE = 200; // скільки віршів тягнемо за один раз
const UPDATE_BATCH = 25; // скільки оновлень послідовно в межах однієї сторінки

export default function FixVerseLineBreaks() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const processVerses = async () => {
    setIsProcessing(true);
    setProgress(0);
    setProcessed(0);
    setErrors([]);
    setCompleted(false);

    try {
      // 1) Порахуємо загальну кількість віршів БЕЗ розривів рядків
      const { count: totalToFix, error: countErr } = await supabase
        .from("verses")
        .select("id", { count: "exact", head: true })
        // sanskrit не порожній і НЕ містить \n
        .not("sanskrit", "is", null)
        .not("sanskrit", "like", "%\n%");

      if (countErr) throw countErr;

      const totalCount = totalToFix || 0;
      setTotal(totalCount);

      if (totalCount === 0) {
        toast.info("Нічого виправляти — усі вірші вже мають розриви рядків.");
        setCompleted(true);
        setIsProcessing(false);
        return;
      }

      const errorMessages: string[] = [];
      let processedSoFar = 0;

      // 2) Пагінація: ідемо сторінками по PAGE_SIZE
      for (let page = 0; ; page++) {
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        console.log(`📄 Завантаження сторінки ${page + 1} (вірші ${from + 1}-${to + 1})...`);

        const { data: pageVerses, error: fetchErr } = await supabase
          .from("verses")
          .select("id, verse_number, sanskrit, transliteration, chapters!inner(chapter_number)", { count: "exact" })
          .not("sanskrit", "is", null)
          .not("sanskrit", "like", "%\n%")
          .order("id", { ascending: true })
          .range(from, to);

        if (fetchErr) {
          console.error(`❌ Помилка завантаження сторінки ${page + 1}:`, fetchErr);
          throw fetchErr;
        }

        if (!pageVerses || pageVerses.length === 0) {
          console.log(`✅ Завершено - більше віршів немає (сторінка ${page + 1})`);
          break;
        }

        console.log(`✅ Завантажено ${pageVerses.length} віршів на сторінці ${page + 1}`);

        // 3) У межах сторінки — оброблюємо невеликими "підпакетами"
        for (let i = 0; i < pageVerses.length; i += UPDATE_BATCH) {
          const slice = pageVerses.slice(i, i + UPDATE_BATCH);

          // послідовні оновлення (надiйно для RLS/триггерів)
          for (const verse of slice) {
            const chapterNum = (verse as any).chapters?.chapter_number || '?';

            try {
              // ще одна локальна перевірка (на випадок, якщо текст змінився між запитами)
              if (verse.sanskrit && !verse.sanskrit.includes("\n")) {
                console.log(`🔄 Обробка вірша ${chapterNum}:${verse.verse_number}, ID: ${verse.id}`);
                console.log(`📝 Sanskrit (перші 100 символів): ${verse.sanskrit.substring(0, 100)}`);

                let fixed;
                try {
                  fixed = processVerseLineBreaks({
                    sanskrit: verse.sanskrit,
                    transliteration: verse.transliteration,
                  });
                  console.log(`✅ Успішно оброблено вірш ${chapterNum}:${verse.verse_number}`);
                } catch (processErr) {
                  console.error(`❌ ПОМИЛКА при обробці вірша ${chapterNum}:${verse.verse_number}:`, processErr);
                  console.error(`📄 Повний sanskrit:`, verse.sanskrit);
                  console.error(`📄 Повний transliteration:`, verse.transliteration);
                  throw processErr;
                }

                const { error: updateErr } = await supabase
                  .from("verses")
                  .update({
                    sanskrit: fixed.sanskrit,
                    transliteration: fixed.transliteration,
                  })
                  .eq("id", verse.id);

                if (updateErr) {
                  console.error(`❌ ПОМИЛКА БД для вірша ${chapterNum}:${verse.verse_number}:`, updateErr);
                  errorMessages.push(`Вірш ${chapterNum}:${verse.verse_number}: ${updateErr.message}`);
                }
              }
            } catch (err) {
              const errorMsg = `Вірш ${chapterNum}:${verse.verse_number} (ID: ${verse.id}): ${err instanceof Error ? err.message : "Помилка обробки"}`;
              console.error('❌ ЗАГАЛЬНА ПОМИЛКА:', errorMsg);
              console.error('Стек:', err);
              console.error('Дані вірша:', {
                id: verse.id,
                verse_number: verse.verse_number,
                sanskrit_length: verse.sanskrit?.length,
                sanskrit_preview: verse.sanskrit?.substring(0, 200),
              });
              errorMessages.push(errorMsg);
            }

            processedSoFar += 1;
            setProcessed((prev) => prev + 1);
            setProgress((processedSoFar / totalCount) * 100);

            // Логування прогресу кожних 50 віршів
            if (processedSoFar % 50 === 0) {
              console.log(`✅ Оброблено ${processedSoFar} з ${totalCount} віршів (${Math.round((processedSoFar / totalCount) * 100)}%)`);
            }
          }
        }
      }

      setErrors(errorMessages);
      setCompleted(true);

      if (errorMessages.length === 0) {
        toast.success(`Успішно оброблено ${processedSoFar} віршів`);
      } else {
        toast.warning(
          `Оброблено з помилками. Успішно: ${processedSoFar - errorMessages.length}, Помилок: ${errorMessages.length}`,
        );
      }
    } catch (error) {
      console.error("Error processing verses:", error);
      toast.error("Помилка під час обробки віршів");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Повернутися
          </Button>

          <h1 className="text-3xl font-bold mb-2">Виправлення розривів рядків у віршах</h1>
          <p className="text-muted-foreground mb-8">
            Інструмент додає правильні розриви рядків у санскриті/транслітерації за дандами (।, ॥). Обробляємо лише ті
            вірші, де ще немає перенесень.
          </p>

          {!isProcessing && !completed && (
            <Card className="p-6">
              <div className="text-center">
                <Play className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Готові розпочати?</h3>
                <p className="text-muted-foreground mb-6">
                  Натисніть кнопку нижче, щоб обробити всі релевантні вірші. Це може зайняти певний час.
                </p>
                <Button onClick={processVerses} size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Розпочати обробку
                </Button>
              </div>
            </Card>
          )}

          {isProcessing && (
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Обробка віршів...</span>
                    <span className="text-sm text-muted-foreground">
                      {processed} / {total}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Будь ласка, не закривайте сторінку під час обробки
                </p>
              </div>
            </Card>
          )}

          {completed && (
            <Card className="p-6">
              <div className="text-center mb-6">
                {errors.length === 0 ? (
                  <>
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold mb-2">Готово!</h3>
                    <p className="text-muted-foreground">Оброблено {processed} віршів без помилок.</p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                    <h3 className="text-lg font-semibold mb-2">Завершено з попередженнями</h3>
                    <p className="text-muted-foreground mb-4">
                      Успішно: {processed - errors.length}, Помилок: {errors.length}
                    </p>
                  </>
                )}
              </div>

              {errors.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Помилки ({errors.length}):</h4>
                  <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                    <ul className="space-y-2 text-sm font-mono">
                      {errors.map((err, i) => (
                        <li key={i} className="text-destructive border-b border-border pb-2">
                          {err}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Порада: Відкрийте консоль браузера (F12) для детальної інформації про кожну помилку
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
                  Повернутися до панелі
                </Button>
                <Button onClick={() => window.location.reload()}>Запустити знову</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
