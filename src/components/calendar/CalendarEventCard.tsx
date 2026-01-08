/**
 * CalendarEventCard - Картка події календаря
 */

import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CalendarEventDisplay } from "@/types/calendar";
import { Moon, Sunrise, Sunset, Star, Calendar, User } from "lucide-react";

interface CalendarEventCardProps {
  event: CalendarEventDisplay;
  language: "ua" | "en";
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
  const name = language === "ua" ? event.name_ua : event.name_en;
  const description = language === "ua" ? event.description_ua : event.description_en;

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
          {language === "ua" ? "Екадаші" : "Ekadashi"}
        </Badge>
      );
    }
    if (event.event_type === "appearance") {
      return (
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200"
        >
          {language === "ua" ? "Явлення" : "Appearance"}
        </Badge>
      );
    }
    if (event.event_type === "disappearance") {
      return (
        <Badge variant="secondary">
          {language === "ua" ? "Відхід" : "Disappearance"}
        </Badge>
      );
    }
    if (event.is_major) {
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
        >
          {language === "ua" ? "Свято" : "Festival"}
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

            {/* Час сходу/заходу */}
            {(event.sunrise_time || event.sunset_time) && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                {event.sunrise_time && (
                  <span className="flex items-center gap-1">
                    <Sunrise className="h-3 w-3" />
                    {event.sunrise_time}
                  </span>
                )}
                {event.sunset_time && (
                  <span className="flex items-center gap-1">
                    <Sunset className="h-3 w-3" />
                    {event.sunset_time}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {getTypeBadge()}
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
  language: "ua" | "en";
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
        {language === "ua" ? "Немає подій" : "No events"}
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
          {language === "ua"
            ? `+ ще ${events.length - displayEvents.length}`
            : `+ ${events.length - displayEvents.length} more`}
        </p>
      )}
    </div>
  );
}
