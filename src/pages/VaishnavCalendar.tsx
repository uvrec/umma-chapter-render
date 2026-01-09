/**
 * VaishnavCalendar - Вайшнавський календар
 *
 * Features:
 * - Місячний календар з подіями
 * - Екадаші з описами з Падма Пурани
 * - Свята та явлення/відходи
 * - Налаштування локації
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useCalendar,
  useTodayEvents,
  useNextEkadashi,
  useCalendarLocations,
  useCalendarSettings,
} from "@/hooks/useCalendar";
import { useAutoLocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import { CalendarMonthView } from "@/components/calendar/CalendarMonthView";
import { CalendarEventCard } from "@/components/calendar/CalendarEventCard";
import { TodayEventsCard } from "@/components/calendar/TodayEventsCard";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Moon,
  Sun,
  MapPin,
  Settings,
  Star,
  BookOpen,
  Locate,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

export default function VaishnavCalendar() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { settings, saveLocalSettings } = useCalendarSettings();
  const { formattedLocations, locations } = useCalendarLocations();

  // Стан локації
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>(
    settings.location_id || undefined
  );

  // Обробка зміни локації
  const handleLocationChange = (locationId: string) => {
    setSelectedLocationId(locationId);
    saveLocalSettings({ ...settings, location_id: locationId });
  };

  // Геолокація
  const { detectLocation, isLoading: isDetectingLocation, isSupported: isGeolocationSupported, error: geoError } = useAutoLocation(
    locations,
    handleLocationChange
  );

  const handleDetectLocation = async () => {
    const nearest = await detectLocation();
    if (nearest) {
      const locationName = language === "ua" ? nearest.name_ua : nearest.name_en;
      toast({
        title: language === "ua" ? "Місце визначено" : "Location detected",
        description: language === "ua"
          ? `Найближче місто: ${locationName}`
          : `Nearest city: ${locationName}`,
      });
    } else if (geoError) {
      toast({
        title: language === "ua" ? "Помилка" : "Error",
        description: geoError,
        variant: "destructive",
      });
    }
  };

  // Hooks календаря
  const {
    monthData,
    isLoading: isLoadingMonth,
    currentDate,
    selectedDate,
    selectedDateEvents,
    year,
    month,
    monthName,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    selectDate,
  } = useCalendar({ locationId: selectedLocationId });

  const { events: todayEvents, nextEkadashi: todayNextEkadashi } =
    useTodayEvents(selectedLocationId);

  const { nextEkadashi, daysUntil } = useNextEkadashi(selectedLocationId);

  // Локалізовані назви днів тижня
  const weekDays = language === "ua"
    ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {language === "ua" ? "Вайшнавський календар" : "Vaishnava Calendar"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "ua"
              ? "Екадаші, свята та особливі дні"
              : "Ekadashi, festivals and special days"}
          </p>
        </div>

        {/* Вибір локації */}
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedLocationId} onValueChange={handleLocationChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={language === "ua" ? "Оберіть місто" : "Select city"}
              />
            </SelectTrigger>
            <SelectContent>
              {formattedLocations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isGeolocationSupported && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
              title={language === "ua" ? "Визначити місце автоматично" : "Detect location automatically"}
            >
              {isDetectingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Locate className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Верхня панель з сьогоднішніми подіями */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Сьогодні */}
        <TodayEventsCard
          events={todayEvents}
          language={language}
        />

        {/* Наступний екадаші */}
        {nextEkadashi && (
          <Card className="border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Moon className="h-4 w-4 text-purple-600" />
                {language === "ua" ? "Наступний екадаші" : "Next Ekadashi"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-semibold text-purple-900 dark:text-purple-100">
                  {nextEkadashi.event.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {nextEkadashi.formattedDate}
                </p>
                {daysUntil !== undefined && (
                  <Badge variant="secondary" className="mt-2">
                    {daysUntil === 0
                      ? language === "ua"
                        ? "Сьогодні"
                        : "Today"
                      : daysUntil === 1
                      ? language === "ua"
                        ? "Завтра"
                        : "Tomorrow"
                      : language === "ua"
                      ? `Через ${daysUntil} днів`
                      : `In ${daysUntil} days`}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Швидкі посилання */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {language === "ua" ? "Дізнатись більше" : "Learn More"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              to="/calendar/ekadashi"
              className="block text-sm text-primary hover:underline"
            >
              {language === "ua" ? "Усі екадаші та їх слава" : "All Ekadashis and Their Glory"}
            </Link>
            <Link
              to="/calendar/festivals"
              className="block text-sm text-primary hover:underline"
            >
              {language === "ua" ? "Вайшнавські свята" : "Vaishnava Festivals"}
            </Link>
            <Link
              to="/calendar/appearances"
              className="block text-sm text-primary hover:underline"
            >
              {language === "ua" ? "Явлення та відходи" : "Appearances & Disappearances"}
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Основний календар */}
      <Card>
        <CardHeader className="pb-2">
          {/* Навігація по місяцях */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPreviousMonth}
              aria-label={language === "ua" ? "Попередній місяць" : "Previous month"}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold capitalize">
                {monthName} {year}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="hidden md:flex"
              >
                <CalendarDays className="h-4 w-4 mr-1" />
                {language === "ua" ? "Сьогодні" : "Today"}
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextMonth}
              aria-label={language === "ua" ? "Наступний місяць" : "Next month"}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoadingMonth ? (
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            </div>
          ) : monthData ? (
            <CalendarMonthView
              monthData={monthData}
              selectedDate={selectedDate}
              onSelectDate={selectDate}
              language={language}
              weekDays={weekDays}
            />
          ) : null}
        </CardContent>
      </Card>

      {/* Події вибраної дати */}
      {selectedDate && selectedDateEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, "d MMMM yyyy", {
                locale: language === "ua" ? uk : undefined,
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedDateEvents.map((event) => (
              <CalendarEventCard
                key={event.event_id}
                event={event}
                language={language}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Легенда */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              {language === "ua" ? "Легенда:" : "Legend:"}
            </span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>{language === "ua" ? "Екадаші" : "Ekadashi"}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>{language === "ua" ? "Явлення" : "Appearance"}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span>{language === "ua" ? "Відхід" : "Disappearance"}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>{language === "ua" ? "Головне свято" : "Major Festival"}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>{language === "ua" ? "Піст" : "Fasting"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
