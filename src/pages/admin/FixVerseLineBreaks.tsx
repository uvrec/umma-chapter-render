import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { processVerseLineBreaks } from '@/utils/import/lineBreaker';

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
      // Fetch all verses
      const { data: verses, error: fetchError } = await supabase
        .from('verses')
        .select('id, sanskrit, transliteration, verse_number')
        .order('id');

      if (fetchError) throw fetchError;
      if (!verses || verses.length === 0) {
        toast.error('Не знайдено віршів для обробки');
        setIsProcessing(false);
        return;
      }

      setTotal(verses.length);
      const errorMessages: string[] = [];

      // Process each verse
      for (let i = 0; i < verses.length; i++) {
        const verse = verses[i];
        
        try {
          // Only process if verse has Sanskrit text without line breaks
          if (verse.sanskrit && !verse.sanskrit.includes('\n')) {
            const processed = processVerseLineBreaks({
              sanskrit: verse.sanskrit,
              transliteration: verse.transliteration
            });

            // Update the verse
            const { error: updateError } = await supabase
              .from('verses')
              .update({
                sanskrit: processed.sanskrit,
                transliteration: processed.transliteration
              })
              .eq('id', verse.id);

            if (updateError) {
              errorMessages.push(`Вірш ${verse.verse_number}: ${updateError.message}`);
            }
          }
        } catch (err) {
          errorMessages.push(`Вірш ${verse.verse_number}: ${err instanceof Error ? err.message : 'Помилка обробки'}`);
        }

        setProcessed(i + 1);
        setProgress(((i + 1) / verses.length) * 100);
      }

      setErrors(errorMessages);
      setCompleted(true);

      if (errorMessages.length === 0) {
        toast.success(`Успішно оброблено ${verses.length} віршів`);
      } else {
        toast.warning(`Оброблено з помилками. Успішно: ${verses.length - errorMessages.length}, Помилок: ${errorMessages.length}`);
      }
    } catch (error) {
      console.error('Error processing verses:', error);
      toast.error('Помилка під час обробки віршів');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Повернутися
          </Button>

          <h1 className="text-3xl font-bold mb-2">Виправлення розривів рядків у віршах</h1>
          <p className="text-muted-foreground mb-8">
            Цей інструмент автоматично додає правильні розриви рядків до санскриту та транслітерації
            на основі пунктуації деванагарі (।, ॥).
          </p>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Що робить цей інструмент?</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Розділяє інвокації (ॐ) на окремі рядки</li>
              <li>Додає розриви рядків після одинарної данди (।)</li>
              <li>Зберігає подвійну данду (॥) з номерами віршів разом</li>
              <li>Вирівнює транслітерацію з санскритом</li>
              <li>Обробляє лише вірші, які ще не мають розривів рядків</li>
            </ul>
          </Card>

          {!isProcessing && !completed && (
            <Card className="p-6">
              <div className="text-center">
                <Play className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Готові розпочати?</h3>
                <p className="text-muted-foreground mb-6">
                  Натисніть кнопку нижче, щоб обробити всі вірші в базі даних.
                  Це може зайняти кілька хвилин залежно від кількості віршів.
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
                  Будь ласка, не закривайте цю сторінку під час обробки
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
                    <h3 className="text-lg font-semibold mb-2">Обробка завершена успішно!</h3>
                    <p className="text-muted-foreground">
                      Оброблено {processed} віршів без помилок.
                    </p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                    <h3 className="text-lg font-semibold mb-2">Обробка завершена з попередженнями</h3>
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
                      {errors.map((error, index) => (
                        <li key={index} className="text-destructive">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
                  Повернутися до панелі
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Запустити знову
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
