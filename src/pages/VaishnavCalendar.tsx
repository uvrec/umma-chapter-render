/**
 * VaishnavCalendar - Вайшнавський календар
 * Mobile-first дизайн, стиль NotePlan
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Locate,
  Loader2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday } from "date-fns";
import { uk } from "date-fns/locale";

export default function VaishnavCalendar() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { settings, saveLocalSettings } = useCalendarSettings();
  const { formattedLocations, locations } = useCalendarLocations();

  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>(
    settings.location_id || undefined
  );
  const [showCalendar, setShowCalendar] = useState(false);

  const handleLocationChange = (locationId: string) => {
    setSelectedLocationId(locationId);
    saveLocalSettings({ ...settings, location_id: locationId });
  };

  const { detectLocation, isLoading: isDetectingLocation, isSupported: isGeolocationSupported, error: geoError } = useAutoLocation(
    locations,
    handleLocationChange
  );

  const handleDetectLocation = async () => {
    const nearest = await detectLocation();
    if (nearest) {
      toast({
        title: language === "uk" ? "Місце визначено" : "Location detected",
        description: language === "uk" ? nearest.name_uk : nearest.name_en,
      });
    } else if (geoError) {
      toast({
        title: language === "uk" ? "Помилка" : "Error",
        description: language === "uk" ? "Не вдалося визначити" : "Failed to detect",
        variant: "destructive",
      });
    }
  };

  const {
    monthData,
    isLoading: isLoadingMonth,
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

  const { events: todayEvents } = useTodayEvents(selectedLocationId);
  const { nextEkadashi, daysUntil } = useNextEkadashi(selectedLocationId);

  const selectedLocation = useMemo(
    () => locations.find((loc) => loc.id === selectedLocationId) || null,
    [locations, selectedLocationId]
  );
  const geoLocation = useLocationToGeo(selectedLocation);

  const nextEkadashiDate = useMemo(() => {
    if (!nextEkadashi) return null;
    const dateStr = nextEkadashi.event.event_date;
    if (!dateStr) return null;
    return new Date(dateStr);
  }, [nextEkadashi]);

  const { fastingTimes: nextEkadashiFastingTimes } = useEkadashiFastingForDate(
    nextEkadashiDate,
    geoLocation
  );

  const { panchang: selectedDayPanchang } = useDailyPanchang(selectedDate, geoLocation);

  // Міні-календар
  const currentViewDate = new Date(year, month);
  const monthStart = startOfMonth(currentViewDate);
  const monthEnd = endOfMonth(currentViewDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const today = new Date();
  const todayFormatted = format(today, "EEEE, d MMMM", { locale: language === "uk" ? uk : undefined });

  const daysWithEvents = useMemo(() => {
    if (!monthData?.days) return new Set<number>();
    return new Set(
      monthData.days
        .filter(d => d.events && d.events.length > 0)
        .map(d => new Date(d.date).getDate())
    );
  }, [monthData]);

  const weekDaysShort = language === "uk"
    ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]
    : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const handleDaySelect = (day: Date) => {
    selectDate(day);
    setShowCalendar(false);
  };

  // Компонент міні-календаря
  const MiniCalendar = () => (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium capitalize">
          {monthName} {year}
        </h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0 text-xs text-muted-foreground mb-1">
        {weekDaysShort.map((day) => (
          <div key={day} className="text-center py-1">
            {day}
          </div>
        ))}
      </div>

      {isLoadingMonth ? (
        <div className="h-32 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-0 text-sm">
          {Array.from({ length: adjustedStartDay }).map((_, i) => (
            <div key={`empty-${i}`} className="p-1.5" />
          ))}
          {daysInMonth.map((day) => {
            const dayNum = day.getDate();
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isTodayDay = isToday(day);
            const hasEvent = daysWithEvents.has(dayNum);

            return (
              <button
                key={dayNum}
                onClick={() => handleDaySelect(day)}
                className={`
                  p-1.5 text-center relative rounded-md transition-colors
                  active:bg-muted
                  ${isSelected ? "bg-primary text-primary-foreground" : ""}
                  ${isTodayDay && !isSelected ? "font-bold text-primary" : ""}
                `}
              >
                {dayNum}
                {hasEvent && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          goToToday();
          setShowCalendar(false);
        }}
        className="w-full mt-2 text-xs"
      >
        {language === "uk" ? "Сьогодні" : "Today"}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-4 sm:py-6 max-w-6xl">
        {/* Шапка */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="text-base sm:text-lg font-medium capitalize">{todayFormatted}</h1>
            {/* Кнопка показу календаря на мобільних */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 lg:hidden"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 text-sm">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
            <Select value={selectedLocationId} onValueChange={handleLocationChange}>
              <SelectTrigger className="w-auto h-8 text-xs border-0 bg-transparent p-0 gap-1">
                <SelectValue placeholder={language === "uk" ? "Місто" : "City"} />
              </SelectTrigger>
              <SelectContent>
                {formattedLocations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id} className="text-sm">
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isGeolocationSupported && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
              >
                {isDetectingLocation ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Locate className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Мобільний календар */}
        {showCalendar && (
          <div className="lg:hidden mb-6 pb-4 border-b">
            <MiniCalendar />
          </div>
        )}

        <div className="flex gap-8">
          {/* Основний контент */}
          <div className="flex-1 min-w-0">
            {/* Сьогодні */}
            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                {language === "uk" ? "Сьогодні" : "Today"}
              </h2>

              {todayEvents.length > 0 ? (
                <div className="space-y-3">
                  {todayEvents.map((event, idx) => (
                    <div key={idx} className="border-l-2 border-primary pl-3">
                      <p className="font-medium text-sm sm:text-base">
                        {language === "uk" ? event.name_uk : event.name_en}
                      </p>
                      {event.short_description_uk && (
                        <p className="text-xs sm:text-sm text-muted-foreground italic">
                          {language === "uk" ? event.short_description_uk : event.short_description_en}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {language === "uk" ? "Звичайний день" : "Ordinary day"}
                </p>
              )}
            </section>

            {/* Наступний екадаші */}
            {nextEkadashi && (
              <section className="mb-6 sm:mb-8">
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                  {language === "uk" ? "Наступний екадаші" : "Next Ekadashi"}
                </h3>
                <div className="border-l-2 border-primary pl-3">
                  <p className="font-medium text-sm sm:text-base">{nextEkadashi.event.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {nextEkadashi.formattedDate}
                    {daysUntil !== undefined && daysUntil > 0 && (
                      <span className="ml-1">
                        ({language === "uk" ? `через ${daysUntil} дн.` : `in ${daysUntil} days`})
                      </span>
                    )}
                  </p>
                  {nextEkadashiFastingTimes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === "uk" ? "Піст:" : "Fast:"} {nextEkadashiFastingTimes.ekadashiSunriseFormatted} •{" "}
                      {language === "uk" ? "Парана:" : "Break:"} {nextEkadashiFastingTimes.paranaStartFormatted}—{nextEkadashiFastingTimes.paranaEndFormatted}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Вибраний день */}
            {selectedDate && selectedDateEvents.length > 0 && !isSameDay(selectedDate, today) && (
              <section className="mb-6 sm:mb-8">
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                  {format(selectedDate, "d MMMM", { locale: language === "uk" ? uk : undefined })}
                </h3>
                {selectedDayPanchang && (
                  <p className="text-xs text-muted-foreground mb-2">
                    ☀ {selectedDayPanchang.sunriseFormatted} — {selectedDayPanchang.sunsetFormatted}
                  </p>
                )}
                <div className="space-y-2">
                  {selectedDateEvents.map((event) => (
                    <div key={event.event_id} className="border-l-2 border-primary pl-3">
                      <p className="font-medium text-sm sm:text-base">
                        {language === "uk" ? event.name_uk : event.name_en}
                      </p>
                      {(event.description_uk || event.description_en) && (
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {language === "uk" ? event.description_uk : event.description_en}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Посилання */}
            <section className="pt-4 sm:pt-6 border-t">
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                <Link to="/calendar/ekadashi" className="text-primary active:opacity-70">
                  {language === "uk" ? "Усі екадаші" : "All Ekadashis"}
                </Link>
                <Link to="/calendar/festivals" className="text-primary active:opacity-70">
                  {language === "uk" ? "Свята" : "Festivals"}
                </Link>
                <Link to="/calendar/appearances" className="text-primary active:opacity-70">
                  {language === "uk" ? "Явлення" : "Appearances"}
                </Link>
              </div>
            </section>
          </div>

          {/* Десктопний міні-календар */}
          <aside className="w-52 flex-shrink-0 hidden lg:block">
            <div className="sticky top-4">
              <MiniCalendar />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
