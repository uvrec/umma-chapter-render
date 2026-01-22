/**
 * CalendarEventCard - Картка події календаря
 *
 * Features:
 * - Парана (час переривання посту)
 * - Рівень посту (nirjala, full, half, none)
 * - Тітхі та пакша
 * - Hari Vasara
 * - Екадаші часи
 */

import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CalendarEventDisplay, FastingLevel } from "@/types/calendar";
import {
  Moon,
  Sunrise,
  Sunset,
  Star,
  Calendar,
  Clock,
  Utensils,
  AlertCircle,
  CircleDot,
} from "lucide-react";

// Fasting level labels and colors
const fastingLevelInfo: Record<
  FastingLevel,
  { uk: string; en: string; color: string; bgColor: string }
> = {
  nirjala: {
    uk: "Ніржала (без води)",
    en: "Nirjala (no water)",
    color: "text-red-700 dark:text-red-300",
    bgColor: "bg-red-100 dark:bg-red-900/50",
  },
  full: {
    uk: "Повний піст",
    en: "Full fast",
    color: "text-orange-700 dark:text-orange-300",
    bgColor: "bg-orange-100 dark:bg-orange-900/50",
  },
  half: {
    uk: "Половинний піст",
    en: "Half fast",
    color: "text-yellow-700 dark:text-yellow-300",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
  },
  none: {
    uk: "Без посту",
    en: "No fasting",
    color: "text-green-700 dark:text-green-300",
    bgColor: "bg-green-100 dark:bg-green-900/50",
  },
};

interface CalendarEventCardProps {
  event: CalendarEventDisplay;
  language: "uk" | "en";
  showDate?: boolean;
  compact?: boolean;
}

export function CalendarEventCard({
  event,
  language,
  showDate = false,
  compact = false,
}: CalendarEventCardProps) {
  // Отримати назву події
  const name = language === "uk" ? event.name_uk : event.name_en;
  const description = language === "uk" ? event.description_uk : event.description_en;

  // Визначити іконку за типом
  const getIcon = () => {
    if (event.is_ekadashi) return <Moon className="h-4 w-4" />;
    if (event.event_type === "appearance") return <Sunrise className="h-4 w-4" />;
    if (event.event_type === "disappearance") return <Sunset className="h-4 w-4" />;
    if (event.is_major) return <Star className="h-4 w-4" />;
    return <Calendar className="h-4 w-4" />;
  };

  // Отримати посилання на деталі
  const getDetailLink = (): string | null => {
    if (event.is_ekadashi) {
      // Потрібно знати slug екадаші - поки що null
      return null;
    }
    if (event.event_type === "appearance" || event.event_type === "disappearance") {
      return null;
    }
    return null;
  };

  // Отримати мітку типу
  const getTypeBadge = () => {
    if (event.is_ekadashi) {
      return (
        <Badge
          variant="secondary"
          className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
        >
          {language === "uk" ? "Екадаші" : "Ekadashi"}
        </Badge>
      );
    }
    if (event.event_type === "appearance") {
      return (
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200"
        >
          {language === "uk" ? "Явлення" : "Appearance"}
        </Badge>
      );
    }
    if (event.event_type === "disappearance") {
      return (
        <Badge variant="secondary">
          {language === "uk" ? "Відхід" : "Disappearance"}
        </Badge>
      );
    }
    if (event.is_major) {
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
        >
          {language === "uk" ? "Свято" : "Festival"}
        </Badge>
      );
    }
    return null;
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md",
          "hover:bg-accent transition-colors"
        )}
        style={{
          borderLeft: `3px solid ${event.category_color || "#8B5CF6"}`,
        }}
      >
        <span
          className="flex-shrink-0"
          style={{ color: event.category_color || "#8B5CF6" }}
        >
          {getIcon()}
        </span>
        <span className="text-sm truncate">{name}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-4 rounded-lg border bg-card",
        "hover:shadow-md transition-shadow"
      )}
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: event.category_color || "#8B5CF6",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex-shrink-0"
            style={{ color: event.category_color || "#8B5CF6" }}
          >
            {getIcon()}
          </span>
          <div className="space-y-1">
            <h3 className="font-semibold">{name}</h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}

            {/* Тітхі та Вайшнавський місяць */}
            {(event.tithi_name_uk || event.vaishnava_month_name_uk) && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                {event.tithi_name_uk && (
                  <span className="flex items-center gap-1">
                    <CircleDot className="h-3 w-3" />
                    {language === "uk" ? event.tithi_name_uk : event.tithi_name_en}
                    {event.paksha && (
                      <span className="text-muted-foreground/60">
                        ({event.paksha === "shukla"
                          ? language === "uk" ? "Шукла" : "Shukla"
                          : language === "uk" ? "Крішна" : "Krishna"})
                      </span>
                    )}
                  </span>
                )}
                {event.vaishnava_month_name_uk && (
                  <span>
                    • {language === "uk"
                      ? event.vaishnava_month_name_uk
                      : event.vaishnava_month_name_en}
                  </span>
                )}
              </div>
            )}

            {/* Час сходу/заходу */}
            {(event.sunrise_time || event.sunset_time) && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                {event.sunrise_time && (
                  <span className="flex items-center gap-1">
                    <Sunrise className="h-3 w-3 text-amber-500" />
                    {event.sunrise_time}
                  </span>
                )}
                {event.sunset_time && (
                  <span className="flex items-center gap-1">
                    <Sunset className="h-3 w-3 text-orange-500" />
                    {event.sunset_time}
                  </span>
                )}
              </div>
            )}

            {/* Екадаші часи */}
            {event.is_ekadashi && (event.ekadashi_start || event.ekadashi_end) && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                {event.ekadashi_start && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-purple-500" />
                    {language === "uk" ? "Початок:" : "Start:"} {event.ekadashi_start}
                  </span>
                )}
                {event.ekadashi_end && (
                  <span>
                    {language === "uk" ? "Кінець:" : "End:"} {event.ekadashi_end}
                  </span>
                )}
              </div>
            )}

            {/* Парана (час переривання посту) */}
            {event.is_ekadashi && (event.parana_start || event.parana_end) && (
              <div className="mt-3 p-2 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-sm">
                  <Utensils className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-700 dark:text-green-300">
                    {language === "uk" ? "Парана" : "Parana"}
                    {event.parana_next_day && (
                      <span className="text-xs ml-1">
                        ({language === "uk" ? "наступного дня" : "next day"})
                      </span>
                    )}
                  </span>
                </div>
                <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                  {event.parana_start && event.parana_end ? (
                    <span>
                      {event.parana_start} — {event.parana_end}
                    </span>
                  ) : event.parana_start ? (
                    <span>
                      {language === "uk" ? "після" : "after"} {event.parana_start}
                    </span>
                  ) : null}
                </div>
                {event.hari_vasara_end && (
                  <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {language === "uk"
                      ? `Hari Vasara до ${event.hari_vasara_end} (не переривати піст)`
                      : `Hari Vasara until ${event.hari_vasara_end} (do not break fast)`}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {getTypeBadge()}

          {/* Fasting level badge */}
          {event.fasting_level && event.fasting_level !== "none" && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                fastingLevelInfo[event.fasting_level].color,
                fastingLevelInfo[event.fasting_level].bgColor
              )}
            >
              <Utensils className="h-3 w-3 mr-1" />
              {fastingLevelInfo[event.fasting_level][language]}
            </Badge>
          )}

          {showDate && (
            <span className="text-xs text-muted-foreground">
              {event.event_date}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Компактний список подій
 */
interface CalendarEventListProps {
  events: CalendarEventDisplay[];
  language: "uk" | "en";
  maxItems?: number;
}

export function CalendarEventList({
  events,
  language,
  maxItems = 5,
}: CalendarEventListProps) {
  const displayEvents = maxItems ? events.slice(0, maxItems) : events;
  const hasMore = events.length > displayEvents.length;

  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        {language === "uk" ? "Немає подій" : "No events"}
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {displayEvents.map((event) => (
        <CalendarEventCard
          key={event.event_id}
          event={event}
          language={language}
          compact
        />
      ))}
      {hasMore && (
        <p className="text-xs text-muted-foreground text-center pt-1">
          {language === "uk"
            ? `+ ще ${events.length - displayEvents.length}`
            : `+ ${events.length - displayEvents.length} more`}
        </p>
      )}
    </div>
  );
}
