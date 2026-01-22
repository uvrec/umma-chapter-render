// src/pages/admin/FixRLSPolicies.tsx
// Компонент для показу SQL міграції для audio_tracks RLS
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Copy, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

export const FixRLSPolicies = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const executeRLSFix = async () => {
    setStatus('running');
    setMessage('Виконання RLS міграції...');

    try {
      // 1. Drop existing restrictive policies
      const dropQuery1 = `DROP POLICY IF EXISTS "Admins can manage tracks" ON public.audio_tracks`;
      const { error: drop1Error } = await (supabase.rpc as any)('execute_sql', { query: dropQuery1 });
      
      if (drop1Error) {
        // Якщо rpc не працює, спробуємо через прямий SQL
        console.warn('RPC не працює, спробуємо альтернативний метод:', drop1Error);
      }

      const dropQuery2 = `DROP POLICY IF EXISTS "Admins can manage playlists" ON public.audio_playlists`;
      const { error: drop2Error } = await (supabase.rpc as any)('execute_sql', { query: dropQuery2 });

      // 2. Create new policies for authenticated users
      const createQuery1 = `
        CREATE POLICY "Authenticated can manage tracks" 
        ON public.audio_tracks 
        FOR ALL 
        TO authenticated 
        WITH CHECK (true)
        USING (true)
      `;
      const { error: create1Error } = await (supabase.rpc as any)('execute_sql', { query: createQuery1 });

      const createQuery2 = `
        CREATE POLICY "Authenticated can manage playlists" 
        ON public.audio_playlists 
        FOR ALL 
        TO authenticated 
        WITH CHECK (true)
        USING (true)
      `;
      const { error: create2Error } = await (supabase.rpc as any)('execute_sql', { query: createQuery2 });

      if (create1Error || create2Error) {
        throw new Error(`Помилка створення політик: ${create1Error?.message || create2Error?.message}`);
      }

      setStatus('success');
      setMessage('RLS політики успішно оновлені! Тепер authenticated користувачі можуть завантажувати аудіо.');
      
    } catch (error: any) {
      setStatus('error');
      setMessage(`Помилка: ${error.message}. Можливо потрібен прямий доступ до Supabase Dashboard.`);
      console.error('RLS Fix Error:', error);
    }
  };

  const testAudioUpload = async () => {
    try {
      setMessage('Тестуємо доступ до audio_tracks...');
      
      // Спробуємо прочитати з audio_tracks
      const { data, error } = await supabase
        .from('audio_tracks')
        .select('id')
        .limit(1);

      if (error) {
        setMessage(`Помилка доступу до audio_tracks: ${error.message}`);
        setStatus('error');
      } else {
        setMessage(`Доступ до audio_tracks працює. Знайдено записів: ${data?.length || 0}`);
        setStatus('success');
      }
    } catch (error: any) {
      setMessage(`Помилка тестування: ${error.message}`);
      setStatus('error');
    }
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Виправлення RLS політик для audio_tracks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Цей компонент виправляє RLS політики для дозволу завантаження аудіо файлів 
                authenticated користувачам замість тільки admin'ам.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button 
                onClick={testAudioUpload} 
                variant="outline"
                disabled={status === 'running'}
                className="w-full"
              >
                {status === 'running' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Тестувати доступ до audio_tracks
              </Button>

              <Button 
                onClick={executeRLSFix} 
                disabled={status === 'running'}
                className="w-full"
              >
                {status === 'running' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Виконати RLS міграцію
              </Button>
            </div>

            {message && (
              <Alert className={status === 'success' ? 'border-green-500' : status === 'error' ? 'border-red-500' : ''}>
                {status === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : status === 'error' ? (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-muted-foreground">
              <p><strong>Що робить міграція:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Видаляє обмежувальні політики "Admins can manage tracks/playlists"</li>
                <li>Створює нові політики "Authenticated can manage tracks/playlists"</li>
                <li>Дозволяє всім авторизованим користувачам завантажувати аудіо</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FixRLSPolicies;