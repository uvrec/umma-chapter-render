/**
 * TodayEventsCard - Картка сьогоднішніх подій
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CalendarEventDisplay } from "@/types/calendar";
import { Calendar, Moon, Star } from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

interface TodayEventsCardProps {
  events: CalendarEventDisplay[];
  language: "uk" | "en";
}

export function TodayEventsCard({ events, language }: TodayEventsCardProps) {
  const today = new Date();
  const formattedDate = format(today, "d MMMM", {
    locale: language === "uk" ? uk : undefined,
  });

  const dayOfWeek = format(today, "EEEE", {
    locale: language === "uk" ? uk : undefined,
  });

  // Знайти екадаші серед подій
  const ekadashiEvent = events.find((e) => e.is_ekadashi);

  return (
    <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          {language === "uk" ? "Сьогодні" : "Today"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Дата */}
          <div>
            <p className="text-lg font-semibold capitalize">{dayOfWeek}</p>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>

          {/* Події */}
          {events.length > 0 ? (
            <div className="space-y-1.5 pt-2 border-t">
              {events.map((event) => {
                const name = language === "uk" ? event.name_ua : event.name_en;
                return (
                  <div
                    key={event.event_id}
                    className="flex items-center gap-2"
                  >
                    {event.is_ekadashi ? (
                      <Moon
                        className="h-3.5 w-3.5 text-purple-600"
                      />
                    ) : event.is_major ? (
                      <Star className="h-3.5 w-3.5 text-amber-600" />
                    ) : (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: event.category_color || "#8B5CF6",
                        }}
                      />
                    )}
                    <span className="text-sm">{name}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground pt-2">
              {language === "uk"
                ? "Звичайний день"
                : "Regular day"}
            </p>
          )}

          {/* Якщо сьогодні екадаші - показати мітку */}
          {ekadashiEvent && (
            <Badge className="mt-2 bg-purple-600 hover:bg-purple-700">
              {language === "uk" ? "День екадаші" : "Ekadashi Day"}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
