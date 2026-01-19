/**
 * VaishnavEventFastingTimes - Universal component for displaying fasting times
 *
 * Supports all Vaishnava events:
 * - Ekadashi (with Padma Purana descriptions)
 * - Appearance days (of the Lord and devotees)
 * - Disappearance days (of devotees)
 * - Festivals
 */

import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Clock,
  MapPin,
  Info,
  AlertCircle,
  UtensilsCrossed,
  Timer,
  RefreshCw,
  Star,
  User,
  BookOpen,
  CalendarDays,
} from "lucide-react";
import type { VaishnavEventFastingTimes as EventFastingTimesType } from "@/services/ekadashiCalculator";
import type { CalendarLocation, EkadashiInfo, AppearanceDay, VaishnaFestival } from "@/types/calendar";

// Icon mapping for event types
const eventTypeIcons = {
  ekadashi: Moon,
  appearance: Star,
  disappearance: User,
  festival: CalendarDays,
};

// Color mapping for event types
const eventTypeColors = {
  ekadashi: "purple",
  appearance: "amber",
  disappearance: "slate",
  festival: "green",
} as const;

interface VaishnavEventFastingTimesProps {
  fastingTimes: EventFastingTimesType | null;
  location?: CalendarLocation | null;
  language: "uk" | "en";
  isLoading?: boolean;
  error?: Error | null;
  onRecalculate?: () => void;
  compact?: boolean;

  // Optional event details from database (for rich display)
  ekadashiInfo?: EkadashiInfo | null;
  appearanceDay?: AppearanceDay | null;
  festival?: VaishnaFestival | null;
}

export function VaishnavEventFastingTimes({
  fastingTimes,
  location,
  language,
  isLoading = false,
  error = null,
  onRecalculate,
  compact = false,
  ekadashiInfo,
  appearanceDay,
  festival,
}: VaishnavEventFastingTimesProps) {
  // Loading state
  if (isLoading) {
    return <VaishnavEventFastingTimesSkeleton compact={compact} />;
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {language === "uk"
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
              {language === "uk" ? "Спробувати знову" : "Try again"}
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
          {language === "uk"
            ? "Виберіть локацію для розрахунку часів посту"
            : "Select a location to calculate fasting times"}
        </AlertDescription>
      </Alert>
    );
  }

  const eventType = fastingTimes.eventType;
  const Icon = eventTypeIcons[eventType];
  const colorName = eventTypeColors[eventType];

  // Get event title
  const getEventTitle = () => {
    if (fastingTimes.eventName) return fastingTimes.eventName;

    const titles = {
      ekadashi: { uk: "Екадаші", en: "Ekadashi" },
      appearance: { uk: "День явлення", en: "Appearance Day" },
      disappearance: { uk: "День відходу", en: "Disappearance Day" },
      festival: { uk: "Свято", en: "Festival" },
    };
    return titles[eventType][language];
  };

  // Get glory text for ekadashi
  const gloryText = ekadashiInfo
    ? language === "uk"
      ? ekadashiInfo.glory_text_uk
      : ekadashiInfo.glory_text_en
    : null;

  const gloryTitle = ekadashiInfo
    ? language === "uk"
      ? ekadashiInfo.glory_title_uk
      : ekadashiInfo.glory_title_en
    : null;

  // Get description for appearance/disappearance
  const eventDescription = appearanceDay
    ? language === "uk"
      ? appearanceDay.description_uk
      : appearanceDay.description_en
    : festival
    ? language === "uk"
      ? festival.description_uk
      : festival.description_en
    : null;

  // Compact version
  if (compact) {
    return (
      <VaishnavEventFastingTimesCompact
        fastingTimes={fastingTimes}
        language={language}
      />
    );
  }

  // Get color classes based on event type
  const getBorderColor = () => {
    const colors = {
      purple: "border-purple-200 dark:border-purple-900",
      amber: "border-amber-200 dark:border-amber-900",
      slate: "border-slate-200 dark:border-slate-700",
      green: "border-green-200 dark:border-green-900",
    };
    return colors[colorName];
  };

  const getBgColor = () => {
    const colors = {
      purple: "bg-purple-50/30 dark:bg-purple-950/20",
      amber: "bg-amber-50/30 dark:bg-amber-950/20",
      slate: "bg-slate-50/30 dark:bg-slate-900/20",
      green: "bg-green-50/30 dark:bg-green-950/20",
    };
    return colors[colorName];
  };

  const getIconColor = () => {
    const colors = {
      purple: "text-purple-600",
      amber: "text-amber-600",
      slate: "text-slate-600",
      green: "text-green-600",
    };
    return colors[colorName];
  };

  return (
    <Card className={`${getBorderColor()} ${getBgColor()}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className={`h-5 w-5 ${getIconColor()}`} />
          {getEventTitle()}
        </CardTitle>
        {location && (
          <CardDescription className="flex items-center gap-1 text-sm">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {language === "uk" ? location.name_uk : location.name_en}
            </span>
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Date */}
        <div className="text-sm text-muted-foreground">
          {fastingTimes.eventDateFormatted}
        </div>

        {/* Fasting Level Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getBorderColor()}>
            {language === "uk"
              ? fastingTimes.fastingLevelDescription_uk
              : fastingTimes.fastingLevelDescription_en}
          </Badge>
        </div>

        {/* Fasting Start */}
        {fastingTimes.fastingLevel !== 'none' && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Timer className="h-4 w-4 text-amber-500" />
              {language === "uk" ? "Початок посту" : "Fasting Start"}
            </h4>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Sunrise className="h-5 w-5 text-amber-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {language === "uk" ? "Схід сонця" : "Sunrise"}
                    </div>
                    <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                      {fastingTimes.sunriseFormatted}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-l pl-3">
                  <Sunset className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {language === "uk" ? "Захід сонця" : "Sunset"}
                    </div>
                    <div className="text-lg font-medium text-orange-600 dark:text-orange-400">
                      {fastingTimes.sunsetFormatted}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Solar Noon (for half-day fasts) */}
        {fastingTimes.fastingLevel === 'half' && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2 text-green-700 dark:text-green-300">
                <Sun className="h-4 w-4" />
                {language === "uk" ? "Полудень (переривання посту)" : "Noon (Breaking Fast)"}
              </h4>
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-900">
                <Clock className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <div className="text-xs text-green-700 dark:text-green-300 font-medium">
                    {language === "uk" ? "Сонячний полудень" : "Solar Noon"}
                  </div>
                  <div className="text-lg font-bold text-green-700 dark:text-green-300">
                    {fastingTimes.solarNoonFormatted}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {language === "uk"
                  ? fastingTimes.breakFastDescription_uk
                  : fastingTimes.breakFastDescription_en}
              </p>
            </div>
          </>
        )}

        {/* Next Day Sunrise (for full/nirjala fasts) */}
        {(fastingTimes.fastingLevel === 'full' || fastingTimes.fastingLevel === 'nirjala') && fastingTimes.nextDaySunriseFormatted && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2 text-green-700 dark:text-green-300">
                <UtensilsCrossed className="h-4 w-4" />
                {language === "uk" ? "Переривання посту" : "Breaking Fast"}
              </h4>
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-900">
                <Sunrise className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <div className="text-xs text-green-700 dark:text-green-300 font-medium">
                    {language === "uk" ? "Схід сонця наступного дня" : "Next Day Sunrise"}
                  </div>
                  <div className="text-lg font-bold text-green-700 dark:text-green-300">
                    {fastingTimes.nextDaySunriseFormatted}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {language === "uk"
                  ? fastingTimes.breakFastDescription_uk
                  : fastingTimes.breakFastDescription_en}
              </p>
            </div>
          </>
        )}

        {/* Glory Text for Ekadashi */}
        {ekadashiInfo && gloryTitle && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-500" />
                {language === "uk" ? "Слава Екадаші" : "Glory of Ekadashi"}
              </h4>
              <div className="bg-white dark:bg-slate-900 rounded-lg p-3">
                <h5 className="font-medium text-purple-700 dark:text-purple-300 mb-2">
                  {gloryTitle}
                </h5>
                {gloryText && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                    {gloryText}
                  </p>
                )}
                {ekadashiInfo.glory_source && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    — {ekadashiInfo.glory_source}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Description for Appearance/Disappearance/Festival */}
        {eventDescription && !ekadashiInfo && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                {language === "uk" ? "Опис" : "Description"}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {eventDescription}
              </p>
            </div>
          </>
        )}

        {/* Notes */}
        {(fastingTimes.notes_uk || fastingTimes.notes_en) && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                {language === "uk" ? "Примітки" : "Notes"}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === "uk" ? fastingTimes.notes_uk : fastingTimes.notes_en}
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
              {language === "uk" ? "Перерахувати" : "Recalculate"}
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
interface VaishnavEventFastingTimesCompactProps {
  fastingTimes: EventFastingTimesType;
  language: "uk" | "en";
}

function VaishnavEventFastingTimesCompact({
  fastingTimes,
  language,
}: VaishnavEventFastingTimesCompactProps) {
  const eventType = fastingTimes.eventType;
  const Icon = eventTypeIcons[eventType];
  const colorName = eventTypeColors[eventType];

  const getBgColor = () => {
    const colors = {
      purple: "bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900",
      amber: "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900",
      slate: "bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700",
      green: "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900",
    };
    return colors[colorName];
  };

  const getIconColor = () => {
    const colors = {
      purple: "text-purple-700 dark:text-purple-300",
      amber: "text-amber-700 dark:text-amber-300",
      slate: "text-slate-700 dark:text-slate-300",
      green: "text-green-700 dark:text-green-300",
    };
    return colors[colorName];
  };

  return (
    <div className={`space-y-3 p-3 ${getBgColor()} rounded-lg border`}>
      {fastingTimes.eventName && (
        <div className={`flex items-center gap-2 font-medium ${getIconColor()}`}>
          <Icon className="h-4 w-4" />
          {fastingTimes.eventName}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        {/* Fasting start */}
        {fastingTimes.fastingLevel !== 'none' && (
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Sunrise className="h-3 w-3" />
              {language === "uk" ? "Схід" : "Sunrise"}
            </div>
            <div className="font-medium text-amber-600 dark:text-amber-400">
              {fastingTimes.sunriseFormatted}
            </div>
          </div>
        )}

        {/* Breaking fast */}
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            {fastingTimes.fastingLevel === 'half' ? (
              <Sun className="h-3 w-3" />
            ) : (
              <UtensilsCrossed className="h-3 w-3" />
            )}
            {language === "uk"
              ? fastingTimes.fastingLevel === 'half' ? "Полудень" : "Парана"
              : fastingTimes.fastingLevel === 'half' ? "Noon" : "Break fast"}
          </div>
          <div className="font-medium text-green-600 dark:text-green-400">
            {fastingTimes.fastingEndFormatted}
          </div>
        </div>
      </div>

      {/* Fasting level */}
      <div className="text-xs text-muted-foreground">
        {language === "uk"
          ? fastingTimes.fastingLevelDescription_uk
          : fastingTimes.fastingLevelDescription_en}
      </div>
    </div>
  );
}

/**
 * Skeleton loading state
 */
function VaishnavEventFastingTimesSkeleton({ compact }: { compact?: boolean }) {
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
          <Skeleton className="h-20 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
