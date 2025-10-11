import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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

        const { data: pageVerses, error: fetchErr } = await supabase
          .from("verses")
          .select("id, verse_number, sanskrit, transliteration", { count: "exact" })
          .not("sanskrit", "is", null)
          .not("sanskrit", "like", "%\n%")
          .order("id", { ascending: true })
          .range(from, to);

        if (fetchErr) throw fetchErr;

        if (!pageVerses || pageVerses.length === 0) break;

        // 3) У межах сторінки — оброблюємо невеликими "підпакетами"
        for (let i = 0; i < pageVerses.length; i += UPDATE_BATCH) {
          const slice = pageVerses.slice(i, i + UPDATE_BATCH);

          // послідовні оновлення (надiйно для RLS/триггерів)
          for (const verse of slice) {
            try {
              // ще одна локальна перевірка (на випадок, якщо текст змінився між запитами)
              if (verse.sanskrit && !verse.sanskrit.includes("\n")) {
                const fixed = processVerseLineBreaks({
                  sanskrit: verse.sanskrit,
                  transliteration: verse.transliteration,
                });

                const { error: updateErr } = await supabase
                  .from("verses")
                  .update({
                    sanskrit: fixed.sanskrit,
                    transliteration: fixed.transliteration,
                  })
                  .eq("id", verse.id);

                if (updateErr) {
                  errorMessages.push(`Вірш ${verse.verse_number}: ${updateErr.message}`);
                }
              }
            } catch (err) {
              errorMessages.push(
                `Вірш ${verse.verse_number}: ${err instanceof Error ? err.message : "Помилка обробки"}`,
              );
            }

            processedSoFar += 1;
            setProcessed((prev) => prev + 1);
            setProgress((processedSoFar / totalCount) * 100);
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
                  <h4 className="font-semibold mb-2">Помилки:</h4>
                  <div className="bg-muted p-4 rounded-lg max-h-60 overflow-y-auto">
                    <ul className="space-y-1 text-sm">
                      {errors.map((err, i) => (
                        <li key={i} className="text-destructive">
                          {err}
                        </li>
                      ))}
                    </ul>
                  </div>
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
