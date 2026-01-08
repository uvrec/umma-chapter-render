/**
 * CalendarMonthView - Місячне подання календаря
 */

import { cn } from "@/lib/utils";
import type { MonthData, DayData, CalendarEventDisplay } from "@/types/calendar";
import { format, isSameDay } from "date-fns";

interface CalendarMonthViewProps {
  monthData: MonthData;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  language: "ua" | "en";
  weekDays: string[];
}

export function CalendarMonthView({
  monthData,
  selectedDate,
  onSelectDate,
  language,
  weekDays,
}: CalendarMonthViewProps) {
  // Отримуємо колір події
  const getEventColor = (event: CalendarEventDisplay): string => {
    if (event.category_color) return event.category_color;
    if (event.is_ekadashi) return "#8B5CF6"; // purple
    if (event.event_type === "appearance") return "#F59E0B"; // amber
    if (event.event_type === "disappearance") return "#6B7280"; // gray
    return "#3B82F6"; // blue
  };

  // Отримуємо пріоритетну подію для відображення
  const getPrimaryEvent = (events: CalendarEventDisplay[]): CalendarEventDisplay | null => {
    if (events.length === 0) return null;

    // Спочатку екадаші, потім головні свята, потім решта
    const ekadashi = events.find((e) => e.is_ekadashi);
    if (ekadashi) return ekadashi;

    const major = events.find((e) => e.is_major);
    if (major) return major;

    return events[0];
  };

  return (
    <div className="space-y-1">
      {/* Заголовки днів тижня */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={cn(
              "text-center text-sm font-medium py-2",
              i >= 5 ? "text-red-500 dark:text-red-400" : "text-muted-foreground"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Сітка днів */}
      <div className="grid grid-cols-7 gap-1">
        {monthData.days.map((day, index) => {
          const isSelected = selectedDate && isSameDay(day.date, selectedDate);
          const primaryEvent = getPrimaryEvent(day.events);
          const hasMultipleEvents = day.events.length > 1;

          return (
            <button
              key={index}
              onClick={() => onSelectDate(day.date)}
              className={cn(
                "min-h-[80px] md:min-h-[100px] p-1 md:p-2 rounded-lg border text-left transition-all",
                "hover:bg-accent hover:border-accent-foreground/20",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                day.is_current_month
                  ? "bg-background"
                  : "bg-muted/30 text-muted-foreground",
                day.is_today && "ring-2 ring-primary ring-offset-2",
                isSelected && "bg-accent border-primary"
              )}
            >
              {/* Номер дня */}
              <div
                className={cn(
                  "text-sm font-medium mb-1",
                  day.is_today &&
                    "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center"
                )}
              >
                {day.day_of_month}
              </div>

              {/* Події */}
              <div className="space-y-0.5">
                {primaryEvent && (
                  <div
                    className={cn(
                      "text-xs px-1 py-0.5 rounded truncate",
                      "text-white font-medium"
                    )}
                    style={{ backgroundColor: getEventColor(primaryEvent) }}
                    title={
                      language === "ua"
                        ? primaryEvent.name_ua
                        : primaryEvent.name_en
                    }
                  >
                    {language === "ua"
                      ? primaryEvent.name_ua
                      : primaryEvent.name_en}
                  </div>
                )}

                {/* Індикатор додаткових подій */}
                {hasMultipleEvents && (
                  <div className="flex gap-0.5">
                    {day.events.slice(1, 4).map((event, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getEventColor(event) }}
                        title={
                          language === "ua" ? event.name_ua : event.name_en
                        }
                      />
                    ))}
                    {day.events.length > 4 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{day.events.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Фаза місяця (якщо є) */}
              {day.moon_phase !== undefined && day.moon_phase !== null && (
                <div
                  className="absolute top-1 right-1 text-[10px] text-muted-foreground"
                  title={`${Math.round(day.moon_phase)}%`}
                >
                  {day.moon_phase > 90 ? "🌕" : day.moon_phase > 40 ? "🌓" : "🌑"}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
