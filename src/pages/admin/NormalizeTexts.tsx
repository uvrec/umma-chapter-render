import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, AlertCircle, CheckCircle, Search, Wrench } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EncodingRemnant {
  table_name: string;
  column_name: string;
  affected_count: number;
  sample_id: string;
  sample_verse_number: string;
  sample_text: string;
}

export default function NormalizeTexts() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [isNormalizingUK, setIsNormalizingUA] = useState(false);
  const [isNormalizingEN, setIsNormalizingEN] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [encodingRemnants, setEncodingRemnants] = useState<EncodingRemnant[]>([]);
  const [scanCompleted, setScanCompleted] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const handleNormalizeUA = async () => {
    if (!confirm('⚠️ Це оновить ВСІ українські тексти Чайтанья-чарітамріти (послівний переклад, літературний переклад та пояснення).\n\nПродовжити?')) {
      return;
    }

    setIsNormalizingUA(true);
    try {
      // @ts-ignore - SQL function will be created in Supabase
      const { error } = await supabase.rpc('normalize_ukrainian_cc_texts');
      if (error) throw error;
      toast.success('✅ Українські тексти успішно нормалізовано!', {
        description: 'Застосовано всі правила нормалізації'
      });
    } catch (error: any) {
      console.error(error);
      toast.error('❌ Помилка нормалізації', {
        description: error.message || 'Спробуйте ще раз'
      });
    } finally {
      setIsNormalizingUA(false);
    }
  };

  const handleNormalizeEN = async () => {
    if (!confirm('⚠️ Це видалить всі повторювані слова з англійських Synonyms Чайтанья-чарітамріти.\n\nПродовжити?')) {
      return;
    }

    setIsNormalizingEN(true);
    try {
      // @ts-ignore - SQL function will be created in Supabase
      const { error } = await supabase.rpc('remove_duplicate_words_in_synonyms');
      if (error) throw error;
      toast.success('✅ Англійські synonyms очищено від дублів!', {
        description: 'Видалено всі повторювані слова'
      });
    } catch (error: any) {
      console.error(error);
      toast.error('❌ Помилка очищення', {
        description: error.message || 'Спробуйте ще раз'
      });
    } finally {
      setIsNormalizingEN(false);
    }
  };

  // Scan for HTML encoding remnants
  const handleScanEncodingRemnants = async () => {
    setIsScanning(true);
    setScanCompleted(false);
    setEncodingRemnants([]);
    try {
      const { data, error } = await supabase.rpc('find_html_encoding_remnants');
      if (error) throw error;
      const rows = (data as EncodingRemnant[] | null) ?? [];
      setEncodingRemnants(rows);
      setScanCompleted(true);
      if (rows.length > 0) {
        toast.warning(`Знайдено ${rows.length} полів з проблемами кодування`, {
          description: 'Перегляньте деталі нижче та запустіть виправлення'
        });
      } else {
        toast.success('✅ База даних чиста!', {
          description: 'Залишків HTML кодування не знайдено'
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.error('❌ Помилка сканування', {
        description: error.message || 'Переконайтеся що SQL функція створена в Supabase'
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Fix HTML encoding remnants
  const handleFixEncodingRemnants = async () => {
    if (!confirm('⚠️ Це декодує всі HTML ентіті (&lt;p&gt; → <p>) у всіх текстових полях.\n\nРезервна копія буде створена автоматично.\n\nПродовжити?')) {
      return;
    }

    setIsFixing(true);
    try {
      const { data, error } = await supabase.rpc('fix_html_encoding_remnants');
      if (error) throw error;

      const fixRows = (data as Array<{ fixed_count?: number }> | null) ?? [];
      const totalFixed = fixRows.reduce((sum, row) => sum + (row.fixed_count ?? 0), 0);

      if (totalFixed > 0) {
        toast.success(`✅ Виправлено ${totalFixed} записів!`, {
          description: 'Резервну копію збережено в таблиці html_encoding_cleanup_backup'
        });
        // Re-scan to show updated status
        await handleScanEncodingRemnants();
      } else {
        toast.info('Нічого виправляти', {
          description: 'Всі записи вже чисті'
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.error('❌ Помилка виправлення', {
        description: error.message || 'Спробуйте ще раз'
      });
    } finally {
      setIsFixing(false);
    }
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6 space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Нормалізація текстів</h1>
          <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
            ← Назад до адмінки
          </Button>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Увага!</strong> Ці операції змінюють дані в базі даних безповоротно. 
            Переконайтеся що SQL функції створені в Supabase перед використанням.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>📝 Українські тексти (Чайтанья-чарітамріта)</CardTitle>
            <CardDescription>
              Застосувати всі правила нормалізації до послівного перекладу, 
              літературного перекладу та пояснень
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-semibold mb-2">Правила нормалізації:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Апостроф після "н" → м'який знак (н' → нь)</li>
                <li>Санн'ясі → Санньясі (та всі похідні форми)</li>
                <li>проджджгіта → проджджхіта</li>
                <li>джджг → джджх</li>
                <li>джг → джх</li>
              </ul>
            </div>
            <Button 
              onClick={handleNormalizeUA} 
              disabled={isNormalizingUK}
              size="lg"
              className="w-full"
            >
              {isNormalizingUK && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isNormalizingUK ? 'Нормалізація...' : 'Нормалізувати українські тексти'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔤 Англійські Synonyms (Чайтанья-чарітамріта)</CardTitle>
            <CardDescription>
              Видалити повторювані слова з блоку Synonyms (залишаючи тільки унікальні слова)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-semibold mb-2">Що буде зроблено:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Видалення дублікатів слів з synonyms_en</li>
                <li>Збереження порядку слів</li>
                <li>Видалення зайвих пробілів</li>
              </ul>
            </div>
            <Button 
              onClick={handleNormalizeEN} 
              disabled={isNormalizingEN}
              variant="outline"
              size="lg"
              className="w-full"
            >
              {isNormalizingEN && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isNormalizingEN ? 'Очищення...' : 'Очистити англійські synonyms від дублів'}
            </Button>
          </CardContent>
        </Card>

        {/* HTML Encoding Remnants Card */}
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🔍</span>
              HTML Encoding Remnants
            </CardTitle>
            <CardDescription>
              Знайти та виправити закодовані HTML ентіті (&lt;p&gt; замість &lt;p&gt;),
              які відображаються як видимі теги в режимі редагування
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-semibold mb-2">Що шукаємо:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><code>&amp;lt;p&amp;gt;</code> → <code>&lt;p&gt;</code></li>
                <li><code>&amp;lt;/p&amp;gt;</code> → <code>&lt;/p&gt;</code></li>
                <li><code>&amp;nbsp;</code> → пробіл</li>
                <li>Подвійне кодування: <code>&amp;amp;lt;</code> → <code>&lt;</code></li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleScanEncodingRemnants}
                disabled={isScanning}
                variant="outline"
                className="flex-1"
              >
                {isScanning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isScanning && <Search className="mr-2 h-4 w-4" />}
                {isScanning ? 'Сканування...' : 'Сканувати базу даних'}
              </Button>

              <Button
                onClick={handleFixEncodingRemnants}
                disabled={isFixing || !scanCompleted || encodingRemnants.length === 0}
                variant="destructive"
                className="flex-1"
              >
                {isFixing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isFixing && <Wrench className="mr-2 h-4 w-4" />}
                {isFixing ? 'Виправлення...' : 'Виправити все'}
              </Button>
            </div>

            {/* Scan Results */}
            {scanCompleted && (
              <div className="space-y-2">
                {encodingRemnants.length === 0 ? (
                  <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      База даних чиста! Залишків HTML кодування не знайдено.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 dark:text-amber-200">
                        Знайдено {encodingRemnants.reduce((sum, r) => sum + r.affected_count, 0)} записів
                        з проблемами кодування в {encodingRemnants.length} полях.
                      </AlertDescription>
                    </Alert>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Таблиця</TableHead>
                            <TableHead>Поле</TableHead>
                            <TableHead className="text-right">Кількість</TableHead>
                            <TableHead>Приклад</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {encodingRemnants.map((remnant, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">{remnant.table_name}</TableCell>
                              <TableCell>{remnant.column_name}</TableCell>
                              <TableCell className="text-right">{remnant.affected_count}</TableCell>
                              <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                                {remnant.sample_text?.substring(0, 80)}...
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader>
            <CardTitle>⚠️ Інструкція для створення SQL функцій</CardTitle>
            <CardDescription>
              Ці функції потрібно створити в Supabase SQL Editor один раз
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">1. Відкрийте Supabase SQL Editor</p>
              <p className="text-sm font-medium">2. Виконайте наступні SQL команди:</p>
              <div className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto">
                <pre>{`-- 1. Застосуйте міграцію для HTML encoding remnants:
-- supabase/migrations/20260113120000_fix_html_encoding_remnants.sql

-- 2. Функція для нормалізації українських текстів
CREATE OR REPLACE FUNCTION normalize_ukrainian_cc_texts()
RETURNS void AS $$
-- (повний код функції з документації)
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Функція для видалення дублів у synonyms
CREATE OR REPLACE FUNCTION remove_duplicate_words_in_synonyms()
RETURNS void AS $$
-- (повний код функції з документації)
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Функції для HTML encoding remnants (вже в міграції):
-- find_html_encoding_remnants() - діагностика
-- fix_html_encoding_remnants() - виправлення`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
