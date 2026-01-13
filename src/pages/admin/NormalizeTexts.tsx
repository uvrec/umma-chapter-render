import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function NormalizeTexts() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [isNormalizingUA, setIsNormalizingUA] = useState(false);
  const [isNormalizingEN, setIsNormalizingEN] = useState(false);

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
              disabled={isNormalizingUA}
              size="lg"
              className="w-full"
            >
              {isNormalizingUA && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isNormalizingUA ? 'Нормалізація...' : 'Нормалізувати українські тексти'}
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
                <pre>{`-- Функція для нормалізації українських текстів
CREATE OR REPLACE FUNCTION normalize_ukrainian_cc_texts()
RETURNS void AS $$
-- (повний код функції з документації)
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функція для видалення дублів у synonyms
CREATE OR REPLACE FUNCTION remove_duplicate_words_in_synonyms()
RETURNS void AS $$
-- (повний код функції з документації)
$$ LANGUAGE plpgsql SECURITY DEFINER;`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
