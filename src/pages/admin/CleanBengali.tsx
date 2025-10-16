import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

/**
 * Інструмент для очищення бенгалі тексту
 * Видаляє все, крім бенгалі символів та розділових знаків
 */
export default function CleanBengali() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<{
    total: number;
    cleaned: number;
    errors: number;
  } | null>(null);

  const cleanBengaliText = (text: string): string => {
    if (!text) return text;

    // Регулярний вираз для бенгалі символів та потрібних розділових знаків
    // \u0980-\u09FF - бенгалі блок Unicode (включає бенгальські цифри \u09E6-\u09EF)
    // \u09E6-\u09EF - бенгальські цифри (০১২৩৪৫৬৭৮৯)
    // । - danda (розділовий знак)
    // ॥ - double danda
    // \s - пробіли
    // Виключаємо арабські цифри 0-9
    const bengaliPattern = /[\u0980-\u09FF।॥\s]/g;
    
    // Витягуємо тільки бенгалі символи (без арабських цифр)
    const cleaned = text.match(bengaliPattern)?.join('') || '';
    
    // Видаляємо зайві пробіли
    return cleaned.replace(/\s+/g, ' ').trim();
  };

  const processVerses = async () => {
    setIsProcessing(true);
    setStats({ total: 0, cleaned: 0, errors: 0 });

    try {
      // Отримуємо ID книги "Шрі Чайтанья-чарітамріта"
      const { data: book } = await supabase
        .from("books")
        .select("id")
        .eq("slug", "scc")
        .single();

      if (!book) {
        toast.error("Книгу не знайдено");
        return;
      }

      // Отримуємо вірші з першої пісні, першої глави
      const { data: verses, error: fetchError } = await supabase
        .from("verses")
        .select(`
          id,
          verse_number,
          sanskrit,
          chapters!inner(
            chapter_number,
            cantos!inner(
              canto_number,
              book_id
            )
          )
        `)
        .eq("chapters.cantos.book_id", book.id)
        .eq("chapters.cantos.canto_number", 1)
        .eq("chapters.chapter_number", 1);

      if (fetchError) throw fetchError;
      if (!verses || verses.length === 0) {
        toast.error("Вірші не знайдено");
        return;
      }

      setStats({ total: verses.length, cleaned: 0, errors: 0 });

      // Обробляємо кожен вірш
      let cleaned = 0;
      let errors = 0;

      for (const verse of verses) {
        try {
          const originalSanskrit = verse.sanskrit || "";
          const cleanedSanskrit = cleanBengaliText(originalSanskrit);

          // Оновлюємо тільки якщо текст змінився
          if (originalSanskrit !== cleanedSanskrit) {
            const { error: updateError } = await supabase
              .from("verses")
              .update({ sanskrit: cleanedSanskrit })
              .eq("id", verse.id);

            if (updateError) {
              console.error(`Помилка оновлення вірша ${verse.verse_number}:`, updateError);
              errors++;
            } else {
              cleaned++;
            }
          }

          setStats((prev) => prev ? { ...prev, cleaned: cleaned, errors } : null);
        } catch (err) {
          console.error(`Помилка обробки вірша ${verse.verse_number}:`, err);
          errors++;
          setStats((prev) => prev ? { ...prev, errors } : null);
        }
      }

      toast.success(`Очищення завершено! Оброблено: ${cleaned} віршів`);
    } catch (error) {
      console.error("Помилка очищення:", error);
      toast.error("Помилка під час очищення текстів");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад до панелі
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Очищення бенгалі тексту</CardTitle>
            <CardDescription>
              Автоматичне видалення всіх символів, крім бенгалі, з віршів першої глави
              "Чайтанья-чарітамріти" (Аді-ліла, глава 1)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Що буде зроблено:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Видалення всіх символів, крім бенгалі (Unicode: \u0980-\u09FF)</li>
                <li>Збереження бенгальських цифр (০১২৩৪৫৬৭৮৯)</li>
                <li>Видалення арабських цифр (0-9)</li>
                <li>Збереження розділових знаків: । та ॥</li>
                <li>Очищення зайвих пробілів</li>
                <li>
                  Формат: текст до "। " (верхня стрічка) + текст після "। " з "॥ номер ॥" (нижня
                  стрічка)
                </li>
              </ul>
            </div>

            {stats && (
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Статистика обробки:</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Всього віршів</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Очищено</div>
                    <div className="text-2xl font-bold text-green-600">{stats.cleaned}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Помилок</div>
                    <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={processVerses}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isProcessing ? "Обробка..." : "Почати очищення"}
              </Button>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                ⚠️ Увага
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Ця операція оновить санскритські тексти у базі даних. Переконайтеся, що у вас є
                резервна копія даних перед виконанням.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
