// src/pages/admin/FixRLSPolicies.tsx
// Простий компонент для показу SQL міграції RLS политик
import { useState } from 'react';
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

-- Simple policies for authenticated users
CREATE POLICY "Authenticated can manage tracks" 
ON public.audio_tracks 
FOR ALL 
TO authenticated 
WITH CHECK (true)
USING (true);

CREATE POLICY "Authenticated can manage playlists" 
ON public.audio_playlists 
FOR ALL 
TO authenticated 
WITH CHECK (true)
USING (true);`;

export const FixRLSPolicies = () => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

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
      setMessage('Тестуємо доступ до audio_tracks...');
      
      const { data, error } = await supabase
        .from('audio_tracks')
        .select('id')
        .limit(1);

      if (error) {
        setMessage(`Помилка доступу: ${error.message}`);
        setStatus('error');
      } else {
        setMessage(`Доступ працює! Знайдено записів: ${data?.length || 0}`);
        setStatus('success');
      }
    } catch (error: any) {
      setMessage(`Помилка тестування: ${error.message}`);
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
                Цей SQL код виправляє RLS політики для дозволу завантаження аудіо файлів 
                всім authenticated користувачам замість тільки admin'ам.
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
            <div className="flex gap-2">
              <Button onClick={copySQLToClipboard} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Копіювати SQL
              </Button>
              
              <Button onClick={testAudioAccess} variant="outline">
                Тестувати доступ
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
              <p><strong>Інструкції:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Скопіюйте SQL код кнопкою вище</li>
                <li>Відкрийте Supabase Dashboard → SQL Editor</li>
                <li>Вставте і виконайте SQL код</li>
                <li>Поверніться і натисніть "Тестувати доступ"</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FixRLSPolicies;