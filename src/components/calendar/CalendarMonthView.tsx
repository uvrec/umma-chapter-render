/**
 * CalendarMonthView - Місячне подання календаря
 *
 * Features:
 * - Тітхі та пакша для кожного дня
 * - Схід/захід сонця
 * - Фаза місяця
 * - Події з кольоровим кодуванням
 */

import { cn } from "@/lib/utils";
import type { MonthData, DayData, CalendarEventDisplay, Paksha } from "@/types/calendar";
import { format, isSameDay } from "date-fns";
import { Sun, Sunrise, Sunset } from "lucide-react";

interface CalendarMonthViewProps {
  monthData: MonthData;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  language: "uk" | "en";
  weekDays: string[];
  showSunTimes?: boolean;
  showTithi?: boolean;
}

// Paksha display helpers
const pakshaLabels: Record<Paksha, { uk: string; en: string; symbol: string }> = {
  shukla: { uk: "Шукла", en: "Shukla", symbol: "☽" },
  krishna: { uk: "Крішна", en: "Krishna", symbol: "☾" },
};

// Tithi names
const tithiNames: Record<number, { uk: string; en: string }> = {
  1: { uk: "Пратіпада", en: "Pratipada" },
  2: { uk: "Двітія", en: "Dvitiya" },
  3: { uk: "Трітія", en: "Tritiya" },
  4: { uk: "Чатуртхі", en: "Chaturthi" },
  5: { uk: "Панчамі", en: "Panchami" },
  6: { uk: "Шаштхі", en: "Shashthi" },
  7: { uk: "Саптамі", en: "Saptami" },
  8: { uk: "Аштамі", en: "Ashtami" },
  9: { uk: "Навамі", en: "Navami" },
  10: { uk: "Дашамі", en: "Dashami" },
  11: { uk: "Екадаші", en: "Ekadashi" },
  12: { uk: "Двадаші", en: "Dvadashi" },
  13: { uk: "Трайодаші", en: "Trayodashi" },
  14: { uk: "Чатурдаші", en: "Chaturdashi" },
  15: { uk: "Пурніма", en: "Purnima" }, // Full moon (shukla)
  30: { uk: "Амавас'я", en: "Amavasya" }, // New moon (krishna 15)
};

// Get tithi name with paksha
function getTithiDisplay(
  tithi: number | undefined,
  paksha: Paksha | undefined,
  language: "uk" | "en"
): string | null {
  if (!tithi) return null;

  // Handle Amavasya (new moon) - krishna paksha 15th tithi
  if (paksha === "krishna" && tithi === 15) {
    return tithiNames[30]?.[language] || null;
  }

  const tithiName = tithiNames[tithi]?.[language];
  if (!tithiName) return null;

  return tithiName;
}

export function CalendarMonthView({
  monthData,
  selectedDate,
  onSelectDate,
  language,
  weekDays,
  showSunTimes = false,
  showTithi = true,
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
          const tithiDisplay = day.tithi
            ? getTithiDisplay(day.tithi.tithi_number, day.paksha, language)
            : null;
          const pakshaInfo = day.paksha ? pakshaLabels[day.paksha] : null;

          return (
            <button
              key={index}
              onClick={() => onSelectDate(day.date)}
              className={cn(
                "relative min-h-[90px] md:min-h-[110px] p-1 md:p-2 rounded-lg border text-left transition-all",
                "hover:bg-accent hover:border-accent-foreground/20",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                day.is_current_month
                  ? "bg-background"
                  : "bg-muted/30 text-muted-foreground",
                day.is_today && "ring-2 ring-primary ring-offset-2",
                isSelected && "bg-accent border-primary"
              )}
            >
              {/* Верхній рядок: номер дня + пакша/місяць */}
              <div className="flex items-start justify-between mb-1">
                <div
                  className={cn(
                    "text-sm font-medium",
                    day.is_today &&
                      "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center"
                  )}
                >
                  {day.day_of_month}
                </div>

                {/* Paksha indicator + moon phase */}
                <div className="flex items-center gap-0.5">
                  {pakshaInfo && (
                    <span
                      className="text-[10px] text-muted-foreground"
                      title={pakshaInfo[language]}
                    >
                      {pakshaInfo.symbol}
                    </span>
                  )}
                  {day.moon_phase !== undefined && day.moon_phase !== null && (
                    <span
                      className="text-[10px]"
                      title={`${Math.round(day.moon_phase)}%`}
                    >
                      {day.moon_phase > 90
                        ? "🌕"
                        : day.moon_phase > 75
                        ? "🌔"
                        : day.moon_phase > 50
                        ? "🌓"
                        : day.moon_phase > 25
                        ? "🌒"
                        : "🌑"}
                    </span>
                  )}
                </div>
              </div>

              {/* Тітхі */}
              {showTithi && tithiDisplay && (
                <div
                  className={cn(
                    "text-[10px] text-muted-foreground mb-0.5 truncate",
                    day.tithi?.is_ekadashi && "text-purple-600 dark:text-purple-400 font-medium"
                  )}
                  title={`${pakshaInfo?.[language] || ""} ${tithiDisplay}`}
                >
                  {tithiDisplay}
                </div>
              )}

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
                      language === "uk"
                        ? primaryEvent.name_ua
                        : primaryEvent.name_en
                    }
                  >
                    {language === "uk"
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
                          language === "uk" ? event.name_ua : event.name_en
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

              {/* Схід/захід сонця */}
              {showSunTimes && (day.sunrise || day.sunset) && (
                <div className="absolute bottom-1 left-1 right-1 flex justify-between text-[9px] text-muted-foreground">
                  {day.sunrise && (
                    <span className="flex items-center gap-0.5" title={language === "uk" ? "Схід" : "Sunrise"}>
                      <Sunrise className="h-2.5 w-2.5 text-amber-500" />
                      {day.sunrise}
                    </span>
                  )}
                  {day.sunset && (
                    <span className="flex items-center gap-0.5" title={language === "uk" ? "Захід" : "Sunset"}>
                      <Sunset className="h-2.5 w-2.5 text-orange-500" />
                      {day.sunset}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
