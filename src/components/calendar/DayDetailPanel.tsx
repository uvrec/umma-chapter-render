/**
 * DayDetailPanel - Детальна інформація про обраний день
 *
 * Features:
 * - Тітхі та пакша
 * - Вайшнавський місяць
 * - Схід/захід сонця
 * - Фаза місяця
 * - Всі події дня
 * - Парана для екадаші
 */

import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { DayData, Paksha, CalendarEventDisplay } from "@/types/calendar";
import { CalendarEventCard } from "./CalendarEventCard";
import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Calendar,
  CircleDot,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DayDetailPanelProps {
  day: DayData;
  language: "uk" | "en";
  onClose?: () => void;
}

// Paksha display info
const pakshaInfo: Record<Paksha, { uk: string; en: string; description_ua: string; description_en: string }> = {
  shukla: {
    ua: "Шукла пакша",
    en: "Shukla Paksha",
    description_ua: "Світла половина місяця (зростаючий)",
    description_en: "Bright fortnight (waxing moon)",
  },
  krishna: {
    ua: "Крішна пакша",
    en: "Krishna Paksha",
    description_ua: "Темна половина місяця (спадаючий)",
    description_en: "Dark fortnight (waning moon)",
  },
};

// Tithi names
const tithiNames: Record<number, { uk: string; en: string; sanskrit: string }> = {
  1: { uk: "Пратіпада", en: "Pratipada", sanskrit: "प्रतिपदा" },
  2: { uk: "Двітія", en: "Dvitiya", sanskrit: "द्वितीया" },
  3: { uk: "Трітія", en: "Tritiya", sanskrit: "तृतीया" },
  4: { uk: "Чатуртхі", en: "Chaturthi", sanskrit: "चतुर्थी" },
  5: { uk: "Панчамі", en: "Panchami", sanskrit: "पञ्चमी" },
  6: { uk: "Шаштхі", en: "Shashthi", sanskrit: "षष्ठी" },
  7: { uk: "Саптамі", en: "Saptami", sanskrit: "सप्तमी" },
  8: { uk: "Аштамі", en: "Ashtami", sanskrit: "अष्टमी" },
  9: { uk: "Навамі", en: "Navami", sanskrit: "नवमी" },
  10: { uk: "Дашамі", en: "Dashami", sanskrit: "दशमी" },
  11: { uk: "Екадаші", en: "Ekadashi", sanskrit: "एकादशी" },
  12: { uk: "Двадаші", en: "Dvadashi", sanskrit: "द्वादशी" },
  13: { uk: "Трайодаші", en: "Trayodashi", sanskrit: "त्रयोदशी" },
  14: { uk: "Чатурдаші", en: "Chaturdashi", sanskrit: "चतुर्दशी" },
  15: { uk: "Пурніма", en: "Purnima", sanskrit: "पूर्णिमा" },
  30: { uk: "Амавас'я", en: "Amavasya", sanskrit: "अमावस्या" },
};

// Moon phase emoji based on percentage
function getMoonPhaseEmoji(phase: number): string {
  if (phase > 95) return "🌕"; // Full moon
  if (phase > 80) return "🌔"; // Waxing gibbous
  if (phase > 55) return "🌓"; // First quarter
  if (phase > 30) return "🌒"; // Waxing crescent
  if (phase > 5) return "🌑"; // New moon area
  return "🌑"; // New moon
}

export function DayDetailPanel({
  day,
  language,
  onClose,
}: DayDetailPanelProps) {
  // Format date
  const formattedDate = format(day.date, "EEEE, d MMMM yyyy", {
    locale: language === "uk" ? uk : undefined,
  });

  // Get tithi info
  const tithiNumber = day.tithi?.tithi_number;
  const tithiInfo = tithiNumber
    ? day.paksha === "krishna" && tithiNumber === 15
      ? tithiNames[30] // Amavasya
      : tithiNames[tithiNumber]
    : null;

  // Get paksha info
  const paksha = day.paksha ? pakshaInfo[day.paksha] : null;

  // Check for ekadashi
  const ekadashiEvent = day.events.find((e) => e.is_ekadashi);

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg capitalize">{formattedDate}</CardTitle>
            {day.is_today && (
              <Badge variant="default" className="mt-1">
                {language === "uk" ? "Сьогодні" : "Today"}
              </Badge>
            )}
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tithi and Paksha */}
        {(tithiInfo || paksha) && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <CircleDot className="h-4 w-4 text-purple-500" />
              {language === "uk" ? "Тітхі" : "Tithi"}
            </h4>
            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
              {tithiInfo && (
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">
                    {tithiInfo[language]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({tithiInfo.sanskrit})
                  </span>
                  {day.tithi?.is_ekadashi && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 ml-2">
                      {language === "uk" ? "День посту" : "Fasting day"}
                    </Badge>
                  )}
                </div>
              )}
              {paksha && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{paksha[language]}</span>
                  <span className="text-xs ml-2">
                    — {language === "uk" ? paksha.description_ua : paksha.description_en}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vaishnava Month */}
        {day.vaishnava_month && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              {language === "uk" ? "Вайшнавський місяць" : "Vaishnava Month"}
            </h4>
            <div className="bg-muted/50 rounded-lg p-3">
              <span className="font-medium">
                {language === "uk"
                  ? day.vaishnava_month.name_ua
                  : day.vaishnava_month.name_en}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                ({day.vaishnava_month.name_sanskrit})
              </span>
            </div>
          </div>
        )}

        {/* Sun Times */}
        {(day.sunrise || day.sunset) && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" />
              {language === "uk" ? "Сонце" : "Sun"}
            </h4>
            <div className="flex gap-4 bg-muted/50 rounded-lg p-3">
              {day.sunrise && (
                <div className="flex items-center gap-2">
                  <Sunrise className="h-4 w-4 text-amber-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {language === "uk" ? "Схід" : "Sunrise"}
                    </div>
                    <div className="font-medium">{day.sunrise}</div>
                  </div>
                </div>
              )}
              {day.sunset && (
                <div className="flex items-center gap-2">
                  <Sunset className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {language === "uk" ? "Захід" : "Sunset"}
                    </div>
                    <div className="font-medium">{day.sunset}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Moon Phase */}
        {day.moon_phase !== undefined && day.moon_phase !== null && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Moon className="h-4 w-4 text-slate-400" />
              {language === "uk" ? "Місяць" : "Moon"}
            </h4>
            <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
              <span className="text-2xl">{getMoonPhaseEmoji(day.moon_phase)}</span>
              <div>
                <div className="font-medium">
                  {Math.round(day.moon_phase)}%{" "}
                  {language === "uk" ? "освітлення" : "illumination"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {day.paksha === "shukla"
                    ? language === "uk"
                      ? "Зростаючий місяць"
                      : "Waxing moon"
                    : language === "uk"
                    ? "Спадаючий місяць"
                    : "Waning moon"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events */}
        {day.events.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                {language === "uk"
                  ? `Події (${day.events.length})`
                  : `Events (${day.events.length})`}
              </h4>
              <div className="space-y-3">
                {day.events.map((event) => (
                  <CalendarEventCard
                    key={event.event_id}
                    event={event}
                    language={language}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* No events message */}
        {day.events.length === 0 && (
          <>
            <Separator />
            <p className="text-sm text-muted-foreground text-center py-4">
              {language === "uk"
                ? "Немає особливих подій цього дня"
                : "No special events on this day"}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Компактна версія для мобільних
 */
interface DayDetailCompactProps {
  day: DayData;
  language: "uk" | "en";
}

export function DayDetailCompact({ day, language }: DayDetailCompactProps) {
  const tithiNumber = day.tithi?.tithi_number;
  const tithiInfo = tithiNumber
    ? day.paksha === "krishna" && tithiNumber === 15
      ? tithiNames[30]
      : tithiNames[tithiNumber]
    : null;

  return (
    <div className="p-3 bg-muted/30 rounded-lg space-y-2">
      {/* Date */}
      <div className="font-medium">
        {format(day.date, "d MMMM", {
          locale: language === "uk" ? uk : undefined,
        })}
        {day.is_today && (
          <Badge variant="default" className="ml-2 text-xs">
            {language === "uk" ? "Сьогодні" : "Today"}
          </Badge>
        )}
      </div>

      {/* Quick info row */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {tithiInfo && (
          <span className={cn(day.tithi?.is_ekadashi && "text-purple-600 font-medium")}>
            {tithiInfo[language]}
          </span>
        )}
        {day.sunrise && (
          <span className="flex items-center gap-1">
            <Sunrise className="h-3 w-3 text-amber-500" />
            {day.sunrise}
          </span>
        )}
        {day.sunset && (
          <span className="flex items-center gap-1">
            <Sunset className="h-3 w-3 text-orange-500" />
            {day.sunset}
          </span>
        )}
        {day.moon_phase !== undefined && (
          <span>{getMoonPhaseEmoji(day.moon_phase)}</span>
        )}
      </div>

      {/* Events count */}
      {day.events.length > 0 && (
        <div className="text-xs">
          {day.events.length === 1
            ? day.events[0].is_ekadashi
              ? language === "uk"
                ? "Екадаші"
                : "Ekadashi"
              : language === "uk"
              ? "1 подія"
              : "1 event"
            : language === "uk"
            ? `${day.events.length} подій`
            : `${day.events.length} events`}
        </div>
      )}
    </div>
  );
}
