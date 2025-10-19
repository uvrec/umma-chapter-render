import { useCallback, useEffect, useState } from "react";

export type ParserStatus = "unknown" | "online" | "offline";

export function useParserHealth(healthUrl = "http://localhost:5003/health", timeoutMs = 2000) {
  const [status, setStatus] = useState<ParserStatus>("unknown");
  const [checking, setChecking] = useState(false);

  const check = useCallback(async () => {
    setChecking(true);
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(healthUrl, { method: "GET", signal: controller.signal });
      clearTimeout(id);
      setStatus(res.ok ? "online" : "offline");
    } catch {
      setStatus("offline");
    } finally {
      setChecking(false);
    }
  }, [healthUrl, timeoutMs]);

  useEffect(() => { check(); }, [check]);

  return { status, checking, check };
}
