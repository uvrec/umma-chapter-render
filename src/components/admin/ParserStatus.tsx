import { Button } from "@/components/ui/button";
import { useParserHealth } from "@/hooks/useParserHealth";
import { useEffect } from "react";

export function ParserStatus({ className }: { className?: string }) {
  const { status, checking, check } = useParserHealth();
  
  // Auto-check on mount
  useEffect(() => {
    check();
  }, [check]);

  return (
    <div className={`flex items-center gap-2 p-3 bg-muted/50 rounded-lg border ${className ?? ''}`}>
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm font-medium">Playwright сервер:</span>
        {checking ? (
          <span className="text-xs text-muted-foreground">Перевірка...</span>
        ) : (
          <span className={`text-xs font-semibold ${status === 'online' ? 'text-green-600' : status === 'offline' ? 'text-amber-600' : 'text-gray-500'}`}>
            {status === 'online' ? '🟢 Онлайн' : status === 'offline' ? '🟡 Офлайн (використовується fallback)' : '⚪ Невідомо'}
          </span>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={check} disabled={checking}>
        {checking ? 'Перевірка...' : 'Оновити'}
      </Button>
    </div>
  );
}
