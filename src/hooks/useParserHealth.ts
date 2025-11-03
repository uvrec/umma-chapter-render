import { useCallback, useState } from 'react';

type ParserStatus = 'online' | 'offline' | 'unknown';

export const useParserHealth = () => {
  const PARSER_URL = import.meta.env.VITE_PARSER_URL;
  const [status, setStatus] = useState<ParserStatus>(PARSER_URL ? 'unknown' : 'offline');
  const [checking, setChecking] = useState(false);

  const check = useCallback(async () => {
    // Не перевіряємо якщо парсер не налаштований
    if (!PARSER_URL) {
      setStatus('offline');
      return;
    }

    try {
      setChecking(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${PARSER_URL}/health`, {
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
      setStatus('offline');
    } finally {
      setChecking(false);
    }
  }, [PARSER_URL]);

  return { status, checking, check };
};
