import { useCallback, useState } from 'react';

type ParserStatus = 'online' | 'offline' | 'unknown';

export const useParserHealth = () => {
  const [status, setStatus] = useState<ParserStatus>('unknown');
  const [checking, setChecking] = useState(false);

  const check = useCallback(async () => {
    try {
      setChecking(true);
      // Реальна перевірка парсер сервера з timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sec timeout
      
      const response = await fetch('http://127.0.0.1:5003/health', {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setStatus('online');
      } else {
        setStatus('offline');
      }
    } catch (error) {
      console.warn('Parser health check failed:', error);
      setStatus('offline');
    } finally {
      setChecking(false);
    }
  }, []);

  return { status, checking, check };
};
