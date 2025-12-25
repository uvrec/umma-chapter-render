/**
 * BulkVedabaseImporter
 *
 * Компонент для масового імпорту лекцій/листів з Vedabase через Edge Function
 */

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Loader2,
  List,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BulkVedabaseImporterProps {
  type: "lectures" | "letters";
}

interface ImportState {
  status: "idle" | "fetching" | "importing" | "paused" | "done" | "error";
  totalSlugs: number;
  imported: number;
  failed: number;
  currentOffset: number;
  errors: string[];
  slugs: string[];
}

const BATCH_SIZE = 10;

export function BulkVedabaseImporter({ type }: BulkVedabaseImporterProps) {
  const [state, setState] = useState<ImportState>({
    status: "idle",
    totalSlugs: 0,
    imported: 0,
    failed: 0,
    currentOffset: 0,
    errors: [],
    slugs: [],
  });

  const [year, setYear] = useState<number>(1966);
  const [limit, setLimit] = useState<number>(100);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  // Виклик Edge Function
  const callEdgeFunction = useCallback(async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("vedabase-import", {
      body,
    });

    if (error) throw error;
    return data;
  }, []);

  // Отримати список років (для листів)
  const fetchYears = useCallback(async () => {
    try {
      const data = await callEdgeFunction({ type: "letters", action: "years" });
      if (data.years) {
        setAvailableYears(data.years);
        if (data.years.length > 0) {
          setYear(data.years[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch years:", error);
    }
  }, [callEdgeFunction]);

  // Отримати список slug'ів
  const fetchSlugs = useCallback(async () => {
    setState((prev) => ({ ...prev, status: "fetching", errors: [] }));

    try {
      const body: Record<string, unknown> = {
        type,
        action: "list",
        limit,
        offset: 0,
      };

      if (type === "letters") {
        body.year = year;
      }

      const data = await callEdgeFunction(body);

      setState((prev) => ({
        ...prev,
        status: "idle",
        totalSlugs: data.total,
        slugs: data.slugs || [],
        currentOffset: 0,
        imported: 0,
        failed: 0,
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setState((prev) => ({
        ...prev,
        status: "error",
        errors: [errorMsg],
      }));
    }
  }, [type, year, limit, callEdgeFunction]);

  // Імпортувати один батч
  const importBatch = useCallback(async () => {
    if (isPaused) return;

    setState((prev) => ({ ...prev, status: "importing" }));

    try {
      const slugsToImport = state.slugs.slice(
        state.currentOffset,
        state.currentOffset + BATCH_SIZE
      );

      if (slugsToImport.length === 0) {
        setState((prev) => ({ ...prev, status: "done" }));
        return;
      }

      const body: Record<string, unknown> = {
        type,
        action: "import",
        slugs: slugsToImport,
      };

      if (type === "letters") {
        body.year = year;
      }

      const data = await callEdgeFunction(body);

      setState((prev) => ({
        ...prev,
        imported: prev.imported + (data.imported || 0),
        failed: prev.failed + (data.failed || 0),
        currentOffset: prev.currentOffset + slugsToImport.length,
        errors: [...prev.errors, ...(data.errors || [])].slice(-20),
      }));

      // Продовжити якщо є ще
      if (state.currentOffset + BATCH_SIZE < state.slugs.length && !isPaused) {
        setTimeout(() => importBatch(), 500);
      } else if (state.currentOffset + BATCH_SIZE >= state.slugs.length) {
        setState((prev) => ({ ...prev, status: "done" }));
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setState((prev) => ({
        ...prev,
        status: "error",
        errors: [...prev.errors, errorMsg],
      }));
    }
  }, [type, year, state.slugs, state.currentOffset, isPaused, callEdgeFunction]);

  // Старт імпорту
  const startImport = useCallback(() => {
    setIsPaused(false);
    if (state.slugs.length === 0) {
      // Спочатку отримати slug'и
      fetchSlugs().then(() => {
        setTimeout(() => importBatch(), 100);
      });
    } else {
      importBatch();
    }
  }, [state.slugs.length, fetchSlugs, importBatch]);

  // Пауза
  const pauseImport = useCallback(() => {
    setIsPaused(true);
    setState((prev) => ({ ...prev, status: "paused" }));
  }, []);

  // Продовжити
  const resumeImport = useCallback(() => {
    setIsPaused(false);
    importBatch();
  }, [importBatch]);

  // Скинути
  const resetImport = useCallback(() => {
    setIsPaused(false);
    setState({
      status: "idle",
      totalSlugs: 0,
      imported: 0,
      failed: 0,
      currentOffset: 0,
      errors: [],
      slugs: [],
    });
  }, []);

  const progress =
    state.totalSlugs > 0
      ? Math.round(((state.imported + state.failed) / state.slugs.length) * 100)
      : 0;

  const isRunning = state.status === "importing" || state.status === "fetching";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Масовий імпорт з Vedabase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Налаштування */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {type === "letters" && (
            <div className="space-y-2">
              <Label>Рік</Label>
              <Select
                value={year.toString()}
                onValueChange={(v) => setYear(parseInt(v))}
                disabled={isRunning}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Виберіть рік" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.length > 0
                    ? availableYears.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))
                    : Array.from({ length: 31 }, (_, i) => 1947 + i).map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
              {availableYears.length === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchYears}
                  disabled={isRunning}
                >
                  <List className="w-4 h-4 mr-1" />
                  Завантажити роки
                </Button>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>Ліміт</Label>
            <Input
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 100)}
              min={1}
              max={1000}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <Label>Дії</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={fetchSlugs}
                disabled={isRunning}
              >
                <List className="w-4 h-4 mr-1" />
                Список
              </Button>
            </div>
          </div>
        </div>

        {/* Статус */}
        {state.slugs.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    state.status === "done"
                      ? "default"
                      : state.status === "error"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {state.status === "idle" && "Готово"}
                  {state.status === "fetching" && "Завантаження списку..."}
                  {state.status === "importing" && "Імпортування..."}
                  {state.status === "paused" && "Пауза"}
                  {state.status === "done" && "Завершено"}
                  {state.status === "error" && "Помилка"}
                </Badge>

                <span className="text-sm text-muted-foreground">
                  {state.slugs.length} елементів знайдено
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  {state.imported}
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <XCircle className="w-4 h-4" />
                  {state.failed}
                </span>
              </div>
            </div>

            <Progress value={progress} className="h-2" />

            <div className="flex gap-2">
              {state.status === "idle" && (
                <Button onClick={startImport}>
                  <Play className="w-4 h-4 mr-1" />
                  Почати імпорт
                </Button>
              )}

              {state.status === "importing" && (
                <Button variant="outline" onClick={pauseImport}>
                  <Pause className="w-4 h-4 mr-1" />
                  Пауза
                </Button>
              )}

              {state.status === "paused" && (
                <Button onClick={resumeImport}>
                  <Play className="w-4 h-4 mr-1" />
                  Продовжити
                </Button>
              )}

              {(state.status === "done" || state.status === "error") && (
                <Button variant="outline" onClick={resetImport}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Скинути
                </Button>
              )}

              {isRunning && (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>
        )}

        {/* Помилки */}
        {state.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <div className="font-semibold mb-2">
                Останні помилки ({state.errors.length}):
              </div>
              <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
                {state.errors.slice(-5).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Інформація */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            • Імпорт відбувається батчами по {BATCH_SIZE} елементів
          </p>
          <p>
            • Існуючі записи автоматично пропускаються
          </p>
          <p>
            • Затримка між запитами: 1.5 секунди (для уникнення блокування)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
