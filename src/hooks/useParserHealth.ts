// src/hooks/useParserHealth.ts
import { useCallback, useState } from 'react';

export const useParserHealth = () => {
  const [status, setStatus] = useState<'online' | 'offline' | 'unknown'>('unknown');
  const [checking, setChecking] = useState(false);

  const check = useCallback(async () => {
    try {
      setChecking(true);
      // Імітація перевірки (можна замінити на реальний endpoint)
      await new Promise((r) => setTimeout(r, 600));
      // Якщо маєте реальний бекенд — спробуйте fetch('http://localhost:8000/health')
      setStatus('online');
    } catch {
      setStatus('offline');
    } finally {
      setChecking(false);
    }
  }, []);

  return { status, checking, check };
};
