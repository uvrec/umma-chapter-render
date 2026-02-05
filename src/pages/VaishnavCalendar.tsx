/**
 * VaishnavCalendar - Вайшнавський календар
 *
 * Minimalist redesign - clean, flat design without heavy cards/borders
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
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
} from "@/hooks/useEkadashiFasting";
import { CalendarMonthView } from "@/components/calendar/CalendarMonthView";
import { CalendarMobileView } from "@/components/calendar/CalendarMobileView";
import { CalendarEventCard } from "@/components/calendar/CalendarEventCard";
import { DayView } from "@/components/calendar/DayView";
import { DailyRoutines } from "@/components/calendar/DailyRoutines";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Moon,
  MapPin,
  Locate,
  Loader2,
  Sunrise,
  Sunset,
  Clock,
  LayoutGrid,
  List,
} from "lucide-react";

export default function VaishnavCalendar() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { settings, saveLocalSettings } = useCalendarSettings();
  const { formattedLocations, locations } = useCalendarLocations();
  const isMobile = useIsMobile();

  // Location state
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>(
    settings.location_id || undefined
  );

  // View mode (month/day)
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');

  const handleLocationChange = (locationId: string) => {
    setSelectedLocationId(locationId);
    saveLocalSettings({ ...settings, location_id: locationId });
  };

  // Geolocation
  const { detectLocation, isLoading: isDetectingLocation, isSupported: isGeolocationSupported, error: geoError } = useAutoLocation(
    locations,
    handleLocationChange
  );

  const selectedLocation = useMemo(
    () => locations.find((loc) => loc.id === selectedLocationId) || null,
    [locations, selectedLocationId]
  );
  const geoLocation = useLocationToGeo(selectedLocation);

  const getGeoErrorMessage = (errorCode: string) => {
    const messages: Record<string, { uk: string; en: string }> = {
      PERMISSION_DENIED: {
        uk: "Доступ до геолокації заборонено",
        en: "Location access denied",
      },
      POSITION_UNAVAILABLE: {
        uk: "Місцезнаходження недоступне",
        en: "Location unavailable",
      },
      TIMEOUT: {
        uk: "Час очікування вичерпано",
        en: "Location request timed out",
      },
      UNKNOWN: {
        uk: "Не вдалося визначити місце",
        en: "Failed to get location",
      },
    };
    const msg = messages[errorCode] || messages.UNKNOWN;
    return language === "uk" ? msg.uk : msg.en;
  };

  const handleDetectLocation = async () => {
    const nearest = await detectLocation();
    if (nearest) {
      const locationName = language === "uk" ? nearest.name_uk : nearest.name_en;
      toast({
        title: language === "uk" ? "Місце визначено" : "Location detected",
        description: locationName,
      });
    } else if (geoError) {
      toast({
        title: language === "uk" ? "Помилка" : "Error",
        description: getGeoErrorMessage(geoError),
        variant: "destructive",
      });
    }
  };

  // Calendar hooks
  const {
    monthData,
    isLoading: isLoadingMonth,
    selectedDate,
    selectedDateEvents,
    year,
    monthName,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    selectDate,
  } = useCalendar({ locationId: selectedLocationId, geoLocation });

  const { events: todayEvents } = useTodayEvents(selectedLocationId, geoLocation);
  const { nextEkadashi, daysUntil } = useNextEkadashi(selectedLocationId);

  // Fasting times for next ekadashi
  const nextEkadashiDate = useMemo(() => {
    if (!nextEkadashi) return null;
    const dateStr = nextEkadashi.event.event_date;
    if (!dateStr) return null;
    return new Date(dateStr);
  }, [nextEkadashi]);

  const {
    fastingTimes: nextEkadashiFastingTimes,
    isLoading: isLoadingFastingTimes,
  } = useEkadashiFastingForDate(nextEkadashiDate, geoLocation);

  // Panchang for selected day (sunrise/sunset, tithi, moon)
  const {
    panchang: selectedDayPanchang,
    moonIllumination: selectedDayMoon,
  } = useDailyPanchang(selectedDate, geoLocation);

  const weekDays = language === "uk"
    ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Get today info
  const today = new Date();
  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const todayDayName = language === "uk"
    ? ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"][today.getDay()]
    : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today.getDay()];

  const locationName = selectedLocation
    ? (language === "uk" ? selectedLocation.name_uk : selectedLocation.name_en)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-6">

        {/* Header - Clean, minimal */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {language === "uk" ? "Вайшнавський календар" : "Vaishnava Calendar"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {language === "uk"
                  ? "Екадаші, свята та особливі дні"
                  : "Ekadashi, festivals and special days"}
              </p>
            </div>

            {/* Location selector - compact */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedLocationId} onValueChange={handleLocationChange}>
                <SelectTrigger className="w-[160px] h-9 text-sm border-none bg-muted/50 hover:bg-muted">
                  <SelectValue placeholder={language === "uk" ? "Місто" : "City"} />
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
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
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
        </header>

        {/* Top info bar - Today + Next Ekadashi - flat, no cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Today */}
          <div className="p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {language === "uk" ? "Сьогодні" : "Today"}
            </div>
            <div className="font-semibold">{todayDayName}</div>
            <div className="text-sm text-muted-foreground">
              {today.getDate()} {language === "uk"
                ? ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"][today.getMonth()]
                : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][today.getMonth()]
              }
            </div>
            {todayEvents.length > 0 ? (
              <div className="mt-2 text-sm text-primary font-medium">
                {todayEvents[0].name}
              </div>
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">
                {language === "uk" ? "Звичайний день" : "Regular day"}
              </div>
            )}
          </div>

          {/* Next Ekadashi */}
          {nextEkadashi && (
            <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20">
              <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 mb-1">
                <Moon className="h-3.5 w-3.5" />
                {language === "uk" ? "Наступний екадаші" : "Next Ekadashi"}
              </div>
              <div className="font-semibold text-purple-900 dark:text-purple-100">
                {nextEkadashi.event.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {nextEkadashi.formattedDate}
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Badge variant="secondary" className="text-xs font-normal">
                  {daysUntil === 0
                    ? language === "uk" ? "Сьогодні" : "Today"
                    : daysUntil === 1
                    ? language === "uk" ? "Завтра" : "Tomorrow"
                    : language === "uk" ? `Через ${daysUntil} днів` : `In ${daysUntil} days`}
                </Badge>
                {selectedLocation && nextEkadashiFastingTimes && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sunrise className="h-3 w-3 text-amber-500" />
                    {nextEkadashiFastingTimes.ekadashiSunriseFormatted}
                    <Clock className="h-3 w-3 text-green-500 ml-2" />
                    {nextEkadashiFastingTimes.paranaStartFormatted}—{nextEkadashiFastingTimes.paranaEndFormatted}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="p-4 rounded-xl bg-muted/30">
            <div className="text-xs text-muted-foreground mb-2">
              {language === "uk" ? "Дізнатись більше" : "Learn More"}
            </div>
            <div className="space-y-1.5">
              <Link to="/calendar/ekadashi" className="block text-sm text-primary hover:underline">
                {language === "uk" ? "Усі екадаші та їх слава" : "All Ekadashis"}
              </Link>
              <Link to="/calendar/festivals" className="block text-sm text-primary hover:underline">
                {language === "uk" ? "Вайшнавські свята" : "Vaishnava Festivals"}
              </Link>
              <Link to="/calendar/appearances" className="block text-sm text-primary hover:underline">
                {language === "uk" ? "Явлення та відходи" : "Appearances"}
              </Link>
            </div>
          </div>
        </div>

        {/* Main Calendar - clean, no card wrapper */}
        {isMobile ? (
          monthData && (
            <CalendarMobileView
              monthData={monthData}
              selectedDate={selectedDate}
              onSelectDate={selectDate}
              language={language}
              weekDays={weekDays}
              onPreviousMonth={goToPreviousMonth}
              onNextMonth={goToNextMonth}
              onGoToToday={goToToday}
              monthName={monthName}
              year={year}
              selectedDateEvents={selectedDateEvents}
            />
          )
        ) : (
          <div>
            {/* Calendar navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousMonth}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold capitalize">
                  {monthName} {year}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToToday}
                  className="text-xs"
                >
                  <CalendarDays className="h-3.5 w-3.5 mr-1" />
                  {language === "uk" ? "Сьогодні" : "Today"}
                </Button>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'month' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('month')}
                    className="h-8 w-8 p-0 rounded-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'day' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('day')}
                    className="h-8 w-8 p-0 rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextMonth}
                className="h-9 w-9"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Calendar content */}
            {viewMode === 'month' ? (
              isLoadingMonth ? (
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
              ) : null
            ) : (
              <DayView
                initialDate={selectedDate}
                events={selectedDateEvents}
                onDateChange={selectDate}
              />
            )}
          </div>
        )}

        {/* Selected date details - always shown when date selected */}
        {!isMobile && selectedDate && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {selectedDate.toLocaleDateString(language === "uk" ? "uk-UA" : "en-US", {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </h3>

              {/* Sunrise/Sunset info */}
              {selectedDayPanchang && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Sunrise className="h-4 w-4 text-amber-500" />
                    {selectedDayPanchang.sunriseFormatted}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sunset className="h-4 w-4 text-orange-500" />
                    {selectedDayPanchang.sunsetFormatted}
                  </span>
                  {selectedDayMoon !== null && (
                    <span className="flex items-center gap-1.5">
                      <Moon className="h-4 w-4 text-slate-400" />
                      {selectedDayMoon}%
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Events for selected date */}
            {selectedDateEvents.length > 0 && (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-6">
                {selectedDateEvents.map((event) => (
                  <CalendarEventCard
                    key={event.event_id}
                    event={event}
                    language={language}
                  />
                ))}
              </div>
            )}

            {/* Daily Routines (Sadhana) */}
            <DailyRoutines selectedDate={selectedDate} />
          </div>
        )}

        {/* Legend - minimal, inline */}
        <div className="mt-8 pt-4 border-t">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>{language === "uk" ? "Легенда:" : "Legend:"}</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              {language === "uk" ? "Екадаші" : "Ekadashi"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {language === "uk" ? "Явлення" : "Appearance"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-500" />
              {language === "uk" ? "Відхід" : "Disappearance"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              {language === "uk" ? "Головне свято" : "Major Festival"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {language === "uk" ? "Піст" : "Fasting"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
