/**
 * VaishnavCalendar - Вайшнавський календар
 *
 * Features:
 * - Місячний календар з подіями
 * - Екадаші з описами з Падма Пурани
 * - Свята та явлення/відходи
 * - Налаштування локації
 */

import { useState, useMemo } from "react";
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
import {
  useEkadashiFastingForDate,
  useLocationToGeo,
  useDailyPanchang,
  useVaishnavEventFasting,
} from "@/hooks/useEkadashiFasting";
import type { VaishnavEventType, FastingLevel } from "@/services/ekadashiCalculator";
import { CalendarMonthView } from "@/components/calendar/CalendarMonthView";
import { CalendarEventCard } from "@/components/calendar/CalendarEventCard";
import { TodayEventsCard } from "@/components/calendar/TodayEventsCard";
import { EkadashiFastingTimes } from "@/components/calendar/EkadashiFastingTimes";
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
  Sunrise,
  Sunset,
  Clock,
  Timer,
  UtensilsCrossed,
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

  // Поточна локація для калькулятора (moved before useCalendar to avoid temporal dead zone)
  const selectedLocation = useMemo(
    () => locations.find((loc) => loc.id === selectedLocationId) || null,
    [locations, selectedLocationId]
  );
  const geoLocation = useLocationToGeo(selectedLocation);

  // Переклад помилок геолокації
  const getGeoErrorMessage = (errorCode: string) => {
    const messages: Record<string, { ua: string; en: string }> = {
      PERMISSION_DENIED: {
        ua: "Доступ до геолокації заборонено. Увімкніть дозвіл у налаштуваннях браузера.",
        en: "Location access denied. Please enable location permissions.",
      },
      POSITION_UNAVAILABLE: {
        ua: "Інформація про місцезнаходження недоступна.",
        en: "Location information unavailable.",
      },
      TIMEOUT: {
        ua: "Час очікування геолокації вичерпано.",
        en: "Location request timed out.",
      },
      UNKNOWN: {
        ua: "Не вдалося визначити місцезнаходження.",
        en: "Failed to get location.",
      },
    };
    const msg = messages[errorCode] || messages.UNKNOWN;
    return language === "ua" ? msg.ua : msg.en;
  };

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
        description: getGeoErrorMessage(geoError),
        variant: "destructive",
      });
    }
  };

  // Hooks календаря (з підтримкою розрахованих екадаші через ?calc=true)
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
  } = useCalendar({ locationId: selectedLocationId, geoLocation });

  const { events: todayEvents, nextEkadashi: todayNextEkadashi } =
    useTodayEvents(selectedLocationId);

  const { nextEkadashi, daysUntil } = useNextEkadashi(selectedLocationId);

  // Розрахунок часів посту для наступного екадаші
  const nextEkadashiDate = useMemo(() => {
    if (!nextEkadashi) return null;
    const dateStr = nextEkadashi.event.event_date;
    if (!dateStr) return null;
    return new Date(dateStr);
  }, [nextEkadashi]);

  const {
    fastingTimes: nextEkadashiFastingTimes,
    isLoading: isLoadingFastingTimes,
    error: fastingTimesError,
  } = useEkadashiFastingForDate(nextEkadashiDate, geoLocation);

  // Розрахунок часів для вибраного дня
  const {
    panchang: selectedDayPanchang,
    tithi: selectedDayTithi,
    moonIllumination: selectedDayMoon,
  } = useDailyPanchang(selectedDate, geoLocation);

  // Знайти подію з постом серед вибраних подій дня
  const selectedEventWithFasting = useMemo(() => {
    if (!selectedDateEvents.length) return null;
    // Пріоритет: екадаші > явлення > відхід > свято
    const ekadashi = selectedDateEvents.find(e => e.is_ekadashi || e.event_type === 'ekadashi');
    if (ekadashi) return { event: ekadashi, type: 'ekadashi' as VaishnavEventType };

    const appearance = selectedDateEvents.find(e => e.event_type === 'appearance');
    if (appearance) return { event: appearance, type: 'appearance' as VaishnavEventType };

    const disappearance = selectedDateEvents.find(e => e.event_type === 'disappearance');
    if (disappearance) return { event: disappearance, type: 'disappearance' as VaishnavEventType };

    const festival = selectedDateEvents.find(e => e.fasting_level && e.fasting_level !== 'none');
    if (festival) return { event: festival, type: 'festival' as VaishnavEventType };

    return null;
  }, [selectedDateEvents]);

  // Розрахунок часів посту для вибраної події
  const selectedEventFastingLevel = useMemo((): FastingLevel => {
    if (!selectedEventWithFasting) return 'half';
    const level = selectedEventWithFasting.event.fasting_level;
    if (level === 'nirjala') return 'nirjala';
    if (level === 'full') return 'full';
    if (level === 'half') return 'half';
    if (level === 'none') return 'none';
    return 'half';
  }, [selectedEventWithFasting]);

  const {
    fastingTimes: selectedEventFastingTimes,
    isLoading: isLoadingSelectedEventFasting,
  } = useVaishnavEventFasting(
    selectedDate,
    geoLocation,
    selectedEventWithFasting?.type || 'festival',
    selectedEventFastingLevel,
    language === 'ua'
      ? selectedEventWithFasting?.event.name_ua
      : selectedEventWithFasting?.event.name_en,
    { enabled: !!selectedEventWithFasting && selectedEventWithFasting.type !== 'ekadashi' }
  );

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
              <div className="space-y-2">
                <p className="font-semibold text-purple-900 dark:text-purple-100">
                  {nextEkadashi.event.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {nextEkadashi.formattedDate}
                </p>
                {daysUntil !== undefined && (
                  <Badge variant="secondary">
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

                {/* Часи посту */}
                {selectedLocation && nextEkadashiFastingTimes && (
                  <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Sunrise className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-muted-foreground">
                        {language === "ua" ? "Початок посту:" : "Fast starts:"}
                      </span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        {nextEkadashiFastingTimes.ekadashiSunriseFormatted}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3.5 w-3.5 text-green-500" />
                      <span className="text-muted-foreground">
                        {language === "ua" ? "Парана:" : "Parana:"}
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {nextEkadashiFastingTimes.paranaStartFormatted}—{nextEkadashiFastingTimes.paranaEndFormatted}
                      </span>
                    </div>
                  </div>
                )}
                {isLoadingFastingTimes && selectedLocation && (
                  <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800">
                    <Skeleton className="h-8 w-full" />
                  </div>
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
      {selectedDate && (selectedDateEvents.length > 0 || selectedDayPanchang) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, "d MMMM yyyy", {
                locale: language === "ua" ? uk : undefined,
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Схід/захід для вибраного дня */}
            {selectedDayPanchang && (
              <div className="flex flex-wrap items-center gap-4 text-sm p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sunrise className="h-4 w-4 text-amber-500" />
                  <span className="text-muted-foreground">
                    {language === "ua" ? "Схід:" : "Sunrise:"}
                  </span>
                  <span className="font-medium">{selectedDayPanchang.sunriseFormatted}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sunset className="h-4 w-4 text-orange-500" />
                  <span className="text-muted-foreground">
                    {language === "ua" ? "Захід:" : "Sunset:"}
                  </span>
                  <span className="font-medium">{selectedDayPanchang.sunsetFormatted}</span>
                </div>
                {selectedDayMoon !== null && (
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-slate-400" />
                    <span className="text-muted-foreground">
                      {language === "ua" ? "Місяць:" : "Moon:"}
                    </span>
                    <span className="font-medium">{selectedDayMoon}%</span>
                  </div>
                )}
              </div>
            )}

            {/* Події дня */}
            {selectedDateEvents.length > 0 && (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <CalendarEventCard
                    key={event.event_id}
                    event={event}
                    language={language}
                  />
                ))}
              </div>
            )}

            {/* Часи посту для події (явлення/відхід) */}
            {selectedEventWithFasting &&
              selectedEventWithFasting.type !== 'ekadashi' &&
              selectedLocation &&
              selectedEventFastingTimes && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    {language === "ua" ? "Часи посту" : "Fasting Times"}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm p-2 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-1.5">
                      <Sunrise className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-muted-foreground text-xs">
                        {language === "ua" ? "Схід:" : "Start:"}
                      </span>
                      <span className="font-medium">
                        {selectedEventFastingTimes.sunriseFormatted}
                      </span>
                    </div>
                    {selectedEventFastingTimes.fastingLevel === 'half' && (
                      <div className="flex items-center gap-1.5">
                        <Sun className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-muted-foreground text-xs">
                          {language === "ua" ? "До:" : "Until:"}
                        </span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {selectedEventFastingTimes.solarNoonFormatted}
                        </span>
                      </div>
                    )}
                    {(selectedEventFastingTimes.fastingLevel === 'full' ||
                      selectedEventFastingTimes.fastingLevel === 'nirjala') &&
                      selectedEventFastingTimes.nextDaySunriseFormatted && (
                        <div className="flex items-center gap-1.5">
                          <UtensilsCrossed className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-muted-foreground text-xs">
                            {language === "ua" ? "Парана:" : "Break:"}
                          </span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {selectedEventFastingTimes.nextDaySunriseFormatted}
                          </span>
                        </div>
                      )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === "ua"
                      ? selectedEventFastingTimes.fastingLevelDescription_ua
                      : selectedEventFastingTimes.fastingLevelDescription_en}
                  </p>
                </div>
              )}

            {selectedDateEvents.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                {language === "ua"
                  ? "Немає особливих подій цього дня"
                  : "No special events on this day"}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Детальна інформація про часи посту наступного екадаші */}
      {nextEkadashi && selectedLocation && (
        <EkadashiFastingTimes
          fastingTimes={nextEkadashiFastingTimes}
          ekadashiName={nextEkadashi.event.name}
          location={selectedLocation}
          language={language}
          isLoading={isLoadingFastingTimes}
          error={fastingTimesError}
        />
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
