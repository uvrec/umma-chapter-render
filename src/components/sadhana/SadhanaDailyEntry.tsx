/**
 * SadhanaDailyEntry - Daily sadhana entry form
 * Tracks: wake up, japa rounds, reading, kirtan, service, yoga, lections, bed time
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSadhana } from '@/hooks/useSadhana';
import { SadhanaDaily } from '@/services/sadhanaService';
import {
  Sun,
  Moon,
  Book,
  Music,
  Heart,
  Dumbbell,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Check,
  LogIn,
} from 'lucide-react';

interface SadhanaDailyEntryProps {
  selectedDate?: string; // YYYY-MM-DD format
  onDateChange?: (date: string) => void;
  compact?: boolean;
}

export function SadhanaDailyEntry({
  selectedDate,
  onDateChange,
  compact = false,
}: SadhanaDailyEntryProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { todayEntry, updateDailyEntry, getDailyEntries, config, isLoading } = useSadhana();

  // State
  const [currentDate, setCurrentDate] = useState(
    selectedDate || new Date().toISOString().split('T')[0]
  );
  const [entry, setEntry] = useState<Partial<SadhanaDaily>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Get today's date for comparison
  const today = new Date().toISOString().split('T')[0];
  const isToday = currentDate === today;

  // Load entry for selected date
  useEffect(() => {
    if (isToday && todayEntry) {
      setEntry(todayEntry);
      setHasChanges(false);
    } else if (!isToday && user?.id) {
      // Load entry for selected date
      getDailyEntries(currentDate, currentDate).then(entries => {
        if (entries.length > 0) {
          setEntry(entries[0]);
        } else {
          setEntry({});
        }
        setHasChanges(false);
      });
    }
  }, [currentDate, todayEntry, isToday, user?.id, getDailyEntries]);

  // Navigate dates
  const goToPreviousDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    const newDate = date.toISOString().split('T')[0];
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const goToNextDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    if (date <= new Date()) {
      const newDate = date.toISOString().split('T')[0];
      setCurrentDate(newDate);
      onDateChange?.(newDate);
    }
  };

  const goToToday = () => {
    setCurrentDate(today);
    onDateChange?.(today);
  };

  // Update field
  const updateField = <K extends keyof SadhanaDaily>(field: K, value: SadhanaDaily[K]) => {
    setEntry(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Save entry
  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      await updateDailyEntry({
        ...entry,
        entryDate: currentDate,
      });
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const weekDay = date.toLocaleDateString('uk-UA', { weekday: 'short' });
    const month = date.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
    return { day, weekDay, month };
  };

  const { day, weekDay, month } = formatDateDisplay(currentDate);

  // If not logged in
  if (!user) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <LogIn className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('Увійдіть для трекінгу садгани', 'Sign in to track sadhana')}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {t(
              'Щоденний графік садгани доступний для авторизованих користувачів',
              'Daily sadhana tracking is available for authenticated users'
            )}
          </p>
          <Button asChild>
            <a href="/auth">{t('Увійти', 'Sign In')}</a>
          </Button>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header with date navigation */}
      <div className="bg-brand-600 text-white p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousDay}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <div className="text-3xl font-bold">{day}</div>
            <div className="text-sm opacity-90">{weekDay}</div>
            <div className="text-xs opacity-75">{month}</div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextDay}
            disabled={isToday}
            className="text-white hover:bg-white/20 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {!isToday && (
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="w-full mt-2 text-white hover:bg-white/20"
          >
            {t('Сьогодні', 'Today')}
          </Button>
        )}
      </div>

      {/* Entry form */}
      <div className="p-4 space-y-6">
        {/* Wake Up Time */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Sun className="w-4 h-4 text-brand-500" />
            {t('Підйом', 'Wake Up')}
          </label>
          <div className="flex gap-2">
            <Input
              type="time"
              value={entry.wakeUpTime || ''}
              onChange={(e) => updateField('wakeUpTime', e.target.value)}
              className="w-32"
            />
          </div>
        </div>

        {/* Japa Rounds */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            {t('Джапа (кругів)', 'Japa Rounds')}
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground text-center">
                {t('до 7:30', 'before 7:30')}
              </div>
              <Input
                type="number"
                min="0"
                max="64"
                value={entry.japaBefore730 || 0}
                onChange={(e) => updateField('japaBefore730', parseInt(e.target.value) || 0)}
                className="text-center text-lg font-semibold"
              />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground text-center">
                {t('до 10:00', 'before 10:00')}
              </div>
              <Input
                type="number"
                min="0"
                max="64"
                value={entry.japaBefore1000 || 0}
                onChange={(e) => updateField('japaBefore1000', parseInt(e.target.value) || 0)}
                className="text-center text-lg font-semibold"
              />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground text-center">
                {t('до 18:00', 'before 18:00')}
              </div>
              <Input
                type="number"
                min="0"
                max="64"
                value={entry.japaBefore1800 || 0}
                onChange={(e) => updateField('japaBefore1800', parseInt(e.target.value) || 0)}
                className="text-center text-lg font-semibold"
              />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground text-center">
                {t('після 18:00', 'after 18:00')}
              </div>
              <Input
                type="number"
                min="0"
                max="64"
                value={entry.japaAfter1800 || 0}
                onChange={(e) => updateField('japaAfter1800', parseInt(e.target.value) || 0)}
                className="text-center text-lg font-semibold"
              />
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {t('Всього:', 'Total:')}{' '}
            <span className="font-semibold text-foreground">
              {(entry.japaBefore730 || 0) +
                (entry.japaBefore1000 || 0) +
                (entry.japaBefore1800 || 0) +
                (entry.japaAfter1800 || 0)}
            </span>{' '}
            {t('з', 'of')} {config?.japaRoundsTarget || 16}
          </div>
        </div>

        {/* Reading Books */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Book className="w-4 h-4 text-brand-500" />
            {t('Читання', 'Reading Books')}
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              value={Math.floor((entry.readingMinutes || 0) / 60)}
              onChange={(e) => {
                const hours = parseInt(e.target.value) || 0;
                const mins = (entry.readingMinutes || 0) % 60;
                updateField('readingMinutes', hours * 60 + mins);
              }}
              className="w-20 text-center"
            />
            <span className="text-sm text-muted-foreground">{t('год', 'hrs')}</span>
            <Input
              type="number"
              min="0"
              max="59"
              value={(entry.readingMinutes || 0) % 60}
              onChange={(e) => {
                const mins = parseInt(e.target.value) || 0;
                const hours = Math.floor((entry.readingMinutes || 0) / 60);
                updateField('readingMinutes', hours * 60 + mins);
              }}
              className="w-20 text-center"
            />
            <span className="text-sm text-muted-foreground">{t('хв', 'min')}</span>
          </div>
        </div>

        {/* Kirtan */}
        {(config?.trackKirtan ?? true) && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Music className="w-4 h-4 text-brand-500" />
              {t('Кіртан', 'Kirtan')}
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                value={Math.floor((entry.kirtanMinutes || 0) / 60)}
                onChange={(e) => {
                  const hours = parseInt(e.target.value) || 0;
                  const mins = (entry.kirtanMinutes || 0) % 60;
                  updateField('kirtanMinutes', hours * 60 + mins);
                }}
                className="w-20 text-center"
              />
              <span className="text-sm text-muted-foreground">{t('год', 'hrs')}</span>
              <Input
                type="number"
                min="0"
                max="59"
                value={(entry.kirtanMinutes || 0) % 60}
                onChange={(e) => {
                  const mins = parseInt(e.target.value) || 0;
                  const hours = Math.floor((entry.kirtanMinutes || 0) / 60);
                  updateField('kirtanMinutes', hours * 60 + mins);
                }}
                className="w-20 text-center"
              />
              <span className="text-sm text-muted-foreground">{t('хв', 'min')}</span>
            </div>
          </div>
        )}

        {/* Boolean toggles */}
        <div className="space-y-3">
          {(config?.trackService ?? true) && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Heart className="w-4 h-4 text-brand-500" />
                {t('Служіння', 'Service')}
              </label>
              <Switch
                checked={entry.serviceDone || false}
                onCheckedChange={(checked) => updateField('serviceDone', checked)}
              />
            </div>
          )}

          {(config?.trackYoga ?? false) && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Dumbbell className="w-4 h-4 text-brand-500" />
                {t('Йога', 'Yoga')}
              </label>
              <Switch
                checked={entry.yogaDone || false}
                onCheckedChange={(checked) => updateField('yogaDone', checked)}
              />
            </div>
          )}

          {(config?.trackLections ?? true) && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium">
                <GraduationCap className="w-4 h-4 text-brand-500" />
                {t('Лекції', 'Lections')}
              </label>
              <Switch
                checked={entry.lectionsAttended || false}
                onCheckedChange={(checked) => updateField('lectionsAttended', checked)}
              />
            </div>
          )}
        </div>

        {/* Bed Time */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Moon className="w-4 h-4 text-brand-500" />
            {t('Відбій', 'Bed Time')}
          </label>
          <Input
            type="time"
            value={entry.bedTime || ''}
            onChange={(e) => updateField('bedTime', e.target.value)}
            className="w-32"
          />
        </div>

        {/* Notes */}
        {!compact && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('Нотатки', 'Notes')}
            </label>
            <Textarea
              value={entry.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder={t('Додаткові нотатки...', 'Additional notes...')}
              rows={2}
            />
          </div>
        )}

        {/* Save button */}
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="w-full"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              {t('Зберегти', 'Save')}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
