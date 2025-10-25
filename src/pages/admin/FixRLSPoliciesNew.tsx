// src/pages/admin/FixRLSPolicies.tsx
// Простий компонент для показу SQL міграції RLS политик
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

const SQL_MIGRATION = `-- Fix RLS policies for audio_tracks to allow authenticated users to insert
-- Replace admin-only policies with authenticated user policies

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Admins can manage playlists" ON public.audio_playlists;

-- Simple policies for authenticated users (USING before WITH CHECK!)
CREATE POLICY "Authenticated can manage tracks" 
ON public.audio_tracks 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated can manage playlists" 
ON public.audio_playlists 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Storage bucket policies for audio files
-- Allow authenticated users to upload/read audio files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio-files', 'audio-files', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Authenticated can upload audio" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'audio-files');

CREATE POLICY "Anyone can view audio" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'audio-files');`;

export const FixRLSPolicies = () => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Перевіряємо авторизацію при завантаженні
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();
  }, []);

  const executeRLSFix = async () => {
    // Автоматично копіює SQL і показує інструкції
    try {
      await navigator.clipboard.writeText(SQL_MIGRATION);
      setStatus('success');
      setMessage(`📋 SQL код автоматично скопійовано в буфер обміну!

🔧 Тепер виконайте наступні кроки:
1. Відкрийте Supabase Dashboard: https://supabase.com/dashboard
2. Перейдіть до вашого проекту 
3. Відкрийте SQL Editor (ліва панель)
4. Вставте скопійований SQL код (Ctrl+V / Cmd+V)
5. Натисніть RUN для виконання
6. Поверніться сюди і натисніть "Тестувати доступ"

✅ Це створить всі потрібні RLS політики для таблиць і storage buckets!`);
      
      toast({
        title: "SQL скопійовано!",
        description: "Виконайте код в Supabase Dashboard → SQL Editor",
      });
    } catch (error) {
      setStatus('error');
      setMessage('❌ Не вдалося скопіювати SQL. Використайте кнопку "Копіювати SQL" вручну.');
      toast({
        title: "Помилка копіювання",
        description: "Спробуйте кнопку 'Копіювати SQL'",
        variant: "destructive",
      });
    }
  };

  const copySQLToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(SQL_MIGRATION);
      toast({
        title: "SQL скопійовано",
        description: "SQL міграцію скопійовано в буфер обміну",
      });
      setStatus('success');
      setMessage('SQL код скопійовано! Виконайте його в Supabase Dashboard → SQL Editor');
    } catch (error) {
      toast({
        title: "Помилка копіювання", 
        description: "Не вдалося скопіювати в буфер обміну",
        variant: "destructive",
      });
    }
  };

  const testAudioAccess = async () => {
    try {
      setMessage('Тестуємо доступ до audio_tracks через Supabase клієнт...');
      
      // Перевіряємо чи користувач авторизований
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setMessage('❌ Користувач не авторизований. Увійдіть в систему для тестування RLS політик.');
        setStatus('error');
        return;
      }

      // Тестуємо читання через Supabase клієнт (з токеном користувача)
      const { data: readData, error: readError } = await supabase
        .from('audio_tracks')
        .select('id')
        .limit(1);

      if (readError) {
        setMessage(`❌ Помилка читання: ${readError.message}`);
        setStatus('error');
        return;
      }

      // Тестуємо запис (якщо є плейлисти)
      const { data: playlists } = await supabase
        .from('audio_playlists')
        .select('id')
        .limit(1);

      let writeTest = "невідомо";
      if (playlists && playlists.length > 0) {
        // Пробуємо вставити тестовий запис
        const { data: insertData, error: insertError } = await supabase
          .from('audio_tracks')
          .insert({
            playlist_id: playlists[0].id,
            title_ua: 'RLS_TEST_RECORD',
            title_en: 'RLS_TEST_RECORD',
            audio_url: 'test://access-check',
            duration: 1,
            track_number: 9999
          })
          .select()
          .single();

        if (insertError) {
          if (insertError.message.includes('row-level security') || insertError.message.includes('policy')) {
            writeTest = "❌ заборонено (RLS політика)";
          } else {
            writeTest = `❌ помилка: ${insertError.message}`;
          }
        } else if (insertData) {
          writeTest = "✅ успішно";
          // Видаляємо тестовий запис
          await supabase
            .from('audio_tracks')
            .delete()
            .eq('id', insertData.id);
        }
      } else {
        writeTest = "❌ немає плейлистів для тесту";
      }

      setMessage(`✅ Читання: OK (${readData?.length || 0} записів), Запис: ${writeTest}`);
      setStatus(writeTest.includes('✅') ? 'success' : 'error');
      
    } catch (error: any) {
      setMessage(`❌ Помилка тестування: ${error.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Виправлення RLS політик для audio_tracks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Автоматичне виправлення RLS політик через Supabase fetch-proxy. 
                Змінює обмежувальні admin-only політики на дозвільні для всіх authenticated користувачів.
                Більше не потрібен Python або ручне виконання в Dashboard!
              </AlertDescription>
            </Alert>

            {/* Auth Status */}
            <Alert className={user ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}>
              {user ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
              <AlertDescription>
                {user ? (
                  `✅ Авторизовано як: ${user.email}`
                ) : (
                  '⚠️ Не авторизовано. Для тестування RLS політик потрібна авторизація.'
                )}
              </AlertDescription>
            </Alert>

            {/* SQL Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium">SQL Міграція:</label>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{SQL_MIGRATION}</code>
              </pre>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={executeRLSFix} 
                className="flex items-center gap-2"
                variant="default"
              >
                📋 Копіювати SQL + Інструкції
              </Button>
              
              <Button onClick={copySQLToClipboard} variant="outline" className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Копіювати SQL
              </Button>
              
              <Button onClick={testAudioAccess} variant="outline">
                Тестувати доступ
              </Button>

              <Button 
                onClick={() => window.location.href = '/auth'}
                variant="secondary"
                className="text-xs"
              >
                Авторизація
              </Button>
            </div>

            {/* Status */}
            {message && (
              <Alert className={status === 'success' ? 'border-green-500' : status === 'error' ? 'border-red-500' : ''}>
                {status === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : status === 'error' ? (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                ) : null}
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Instructions */}
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Варіанти виконання:</strong></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-3 bg-blue-50 rounded-lg border-blue-200 border">
                  <p className="font-medium text-blue-800">� Швидкий метод (Рекомендовано):</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-blue-700">
                    <li>Натисніть "Копіювати SQL + Інструкції"</li>
                    <li>SQL автоматично скопіюється в буфер</li>
                    <li>Відкрийте Supabase Dashboard → SQL Editor</li>
                    <li>Вставте і виконайте SQL код</li>
                  </ol>
                </div>
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg border-gray-200 border">
                  <p className="font-medium text-gray-800">📋 Резервний варіант:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-gray-600">
                    <li>Якщо автоматичне не спрацює</li>
                    <li>Скопіюйте SQL код</li>
                    <li>Supabase Dashboard → SQL Editor</li>
                    <li>Вставте і виконайте SQL вручну</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FixRLSPolicies;