/**
 * EkadashiFastingTimes - Displays calculated fasting times for Ekadashi
 *
 * Features:
 * - Shows fasting start time (sunrise on Ekadashi)
 * - Shows parana window (when to break fast on Dvadashi)
 * - Shows Hari Vasara period to avoid
 * - Sunrise/sunset times for both days
 * - Location-based calculations
 */

import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Moon,
  Sunrise,
  Sunset,
  Clock,
  MapPin,
  Info,
  AlertCircle,
  UtensilsCrossed,
  Timer,
  RefreshCw,
} from "lucide-react";
import type { EkadashiFastingTimes as FastingTimesType } from "@/services/ekadashiCalculator";
import type { CalendarLocation } from "@/types/calendar";

interface EkadashiFastingTimesProps {
  fastingTimes: FastingTimesType | null;
  ekadashiName?: string;
  location?: CalendarLocation | null;
  language: "ua" | "en";
  isLoading?: boolean;
  error?: Error | null;
  onRecalculate?: () => void;
  compact?: boolean;
}

export function EkadashiFastingTimes({
  fastingTimes,
  ekadashiName,
  location,
  language,
  isLoading = false,
  error = null,
  onRecalculate,
  compact = false,
}: EkadashiFastingTimesProps) {
  // Loading state
  if (isLoading) {
    return <EkadashiFastingTimesSkeleton compact={compact} />;
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {language === "ua"
            ? "Помилка розрахунку часів посту. Перевірте геолокацію."
            : "Failed to calculate fasting times. Check your location."}
          {onRecalculate && (
            <Button
              variant="link"
              size="sm"
              onClick={onRecalculate}
              className="ml-2 h-auto p-0"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              {language === "ua" ? "Спробувати знову" : "Try again"}
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // No data state
  if (!fastingTimes) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {language === "ua"
            ? "Виберіть локацію для розрахунку часів посту"
            : "Select a location to calculate fasting times"}
        </AlertDescription>
      </Alert>
    );
  }

  // Compact version for small displays
  if (compact) {
    return (
      <EkadashiFastingTimesCompact
        fastingTimes={fastingTimes}
        ekadashiName={ekadashiName}
        language={language}
      />
    );
  }

  // Format dates for display
  const ekadashiDateFormatted = format(
    fastingTimes.fastingStart,
    "d MMMM yyyy",
    { locale: language === "ua" ? uk : undefined }
  );
  const dvadashiDateFormatted = format(
    fastingTimes.paranaDate,
    "d MMMM yyyy",
    { locale: language === "ua" ? uk : undefined }
  );

  return (
    <Card className="border-purple-200 dark:border-purple-900 bg-purple-50/30 dark:bg-purple-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Moon className="h-5 w-5 text-purple-600" />
          {ekadashiName || (language === "ua" ? "Часи посту" : "Fasting Times")}
        </CardTitle>
        {location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {language === "ua" ? location.name_ua : location.name_en}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Fasting Start - Ekadashi Day */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <Timer className="h-4 w-4" />
            {language === "ua" ? "Початок посту" : "Fasting Start"}
          </h4>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-3 space-y-2">
            <div className="text-sm text-muted-foreground">
              {language === "ua" ? "Екадаші" : "Ekadashi"}: {ekadashiDateFormatted}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sunrise className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="text-xs text-muted-foreground">
                    {language === "ua" ? "Схід сонця" : "Sunrise"}
                  </div>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {fastingTimes.ekadashiSunriseFormatted}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 border-l pl-3">
                <Sunset className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-xs text-muted-foreground">
                    {language === "ua" ? "Захід сонця" : "Sunset"}
                  </div>
                  <div className="text-lg font-medium text-orange-600 dark:text-orange-400">
                    {fastingTimes.ekadashiSunsetFormatted}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {language === "ua"
                ? "Піст починається зі сходом сонця в день Екадаші"
                : "Fasting begins at sunrise on Ekadashi day"}
            </p>
          </div>
        </div>

        <Separator />

        {/* Parana - Breaking the fast on Dvadashi */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2 text-green-700 dark:text-green-300">
            <UtensilsCrossed className="h-4 w-4" />
            {language === "ua" ? "Парана (переривання посту)" : "Parana (Breaking Fast)"}
          </h4>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-3 space-y-3">
            <div className="text-sm text-muted-foreground">
              {language === "ua" ? "Двадаші" : "Dvadashi"}: {dvadashiDateFormatted}
            </div>

            {/* Parana window */}
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-900">
              <Clock className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <div className="text-xs text-green-700 dark:text-green-300 font-medium">
                  {language === "ua" ? "Рекомендований час парани" : "Recommended Parana Time"}
                </div>
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {fastingTimes.paranaStartFormatted} — {fastingTimes.paranaEndFormatted}
                </div>
              </div>
            </div>

            {/* Hari Vasara warning */}
            {fastingTimes.hariVasaraEndFormatted && (
              <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-xs">
                  <div className="font-medium text-amber-700 dark:text-amber-300">
                    {language === "ua" ? "Hari Vasara" : "Hari Vasara"}
                  </div>
                  <div className="text-amber-600 dark:text-amber-400">
                    {language === "ua"
                      ? `Уникайте парани до ${fastingTimes.hariVasaraEndFormatted} (перша чверть Двадаші)`
                      : `Avoid breaking fast before ${fastingTimes.hariVasaraEndFormatted} (first quarter of Dvadashi)`}
                  </div>
                </div>
              </div>
            )}

            {/* Dvadashi sunrise */}
            <div className="flex items-center gap-2 text-sm">
              <Sunrise className="h-4 w-4 text-amber-500" />
              <span className="text-muted-foreground">
                {language === "ua" ? "Схід на Двадаші:" : "Dvadashi sunrise:"}
              </span>
              <span className="font-medium">{fastingTimes.dvadashiSunriseFormatted}</span>
            </div>
          </div>
        </div>

        {/* Additional notes */}
        {(fastingTimes.notes_ua || fastingTimes.notes_en) && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                {language === "ua" ? "Примітки" : "Notes"}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === "ua" ? fastingTimes.notes_ua : fastingTimes.notes_en}
              </p>
            </div>
          </>
        )}

        {/* Recalculate button */}
        {onRecalculate && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRecalculate}
              className="w-full"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              {language === "ua" ? "Перерахувати" : "Recalculate"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Compact version for small displays or inline use
 */
interface EkadashiFastingTimesCompactProps {
  fastingTimes: FastingTimesType;
  ekadashiName?: string;
  language: "ua" | "en";
}

function EkadashiFastingTimesCompact({
  fastingTimes,
  ekadashiName,
  language,
}: EkadashiFastingTimesCompactProps) {
  return (
    <div className="space-y-3 p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
      {ekadashiName && (
        <div className="flex items-center gap-2 font-medium text-purple-700 dark:text-purple-300">
          <Moon className="h-4 w-4" />
          {ekadashiName}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        {/* Fasting start */}
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Timer className="h-3 w-3" />
            {language === "ua" ? "Початок посту" : "Fast starts"}
          </div>
          <div className="font-medium text-amber-600 dark:text-amber-400">
            {fastingTimes.ekadashiSunriseFormatted}
          </div>
        </div>

        {/* Parana */}
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <UtensilsCrossed className="h-3 w-3" />
            {language === "ua" ? "Парана" : "Parana"}
          </div>
          <div className="font-medium text-green-600 dark:text-green-400">
            {fastingTimes.paranaStartFormatted}–{fastingTimes.paranaEndFormatted}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loading state
 */
function EkadashiFastingTimesSkeleton({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
        <Skeleton className="h-4 w-32" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-24 mt-1" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-32 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Inline badge showing parana time
 */
interface ParanaBadgeProps {
  paranaStart: string;
  paranaEnd: string;
  language: "ua" | "en";
}

export function ParanaBadge({ paranaStart, paranaEnd, language }: ParanaBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="bg-green-50 dark:bg-green-950/50 border-green-300 dark:border-green-800 text-green-700 dark:text-green-300"
    >
      <UtensilsCrossed className="h-3 w-3 mr-1" />
      {language === "ua" ? "Парана:" : "Parana:"} {paranaStart}–{paranaEnd}
    </Badge>
  );
}

/**
 * Sunrise/sunset display badge
 */
interface SunTimesBadgeProps {
  sunrise: string;
  sunset: string;
  language: "ua" | "en";
}

export function SunTimesBadge({ sunrise, sunset, language }: SunTimesBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <Sunrise className="h-3 w-3 text-amber-500" />
        {sunrise}
      </span>
      <span className="flex items-center gap-1">
        <Sunset className="h-3 w-3 text-orange-500" />
        {sunset}
      </span>
    </div>
  );
}
