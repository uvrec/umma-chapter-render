/**
 * Sadhana Tracker - Персональний графік садхани
 *
 * Функціональний мінімалізм:
 * - Чистий інтерфейс без карток
 * - iOS-style time picker для часу
 * - Фокус на контенті, не на декораціях
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { TimePickerButton } from '@/components/ui/ios-time-picker';
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
  Flame,
  ChevronLeft,
  ChevronRight,
  Check,
  LogIn,
  Loader2,
} from 'lucide-react';

export default function SadhanaTracker() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { todayEntry, updateDailyEntry, getDailyEntries, config, isLoading, streak } = useSadhana();

  // State
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [entry, setEntry] = useState<Partial<SadhanaDaily>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const isToday = currentDate === today;

  // Load entry for selected date
  useEffect(() => {
    if (isToday && todayEntry) {
      setEntry(todayEntry);
      setHasChanges(false);
    } else if (!isToday && user?.id) {
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
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    if (date <= new Date()) {
      setCurrentDate(date.toISOString().split('T')[0]);
    }
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
      await updateDailyEntry({ ...entry, entryDate: currentDate });
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate totals
  const totalJapa = (entry.japaBefore730 || 0) + (entry.japaBefore1000 || 0) +
    (entry.japaBefore1800 || 0) + (entry.japaAfter1800 || 0);
  const japaTarget = config?.japaRoundsTarget || 16;
  const japaProgress = Math.min(100, (totalJapa / japaTarget) * 100);

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      weekDay: date.toLocaleDateString('uk-UA', { weekday: 'long' }),
      monthYear: date.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' }),
    };
  };

  const { day, weekDay, monthYear } = formatDate(currentDate);

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 max-w-lg text-center">
          <LogIn className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-3">
            {t('Графік Садхани', 'Sadhana Tracker')}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t(
              'Увійдіть, щоб вести щоденний графік духовної практики',
              'Sign in to track your daily spiritual practice'
            )}
          </p>
          <Button onClick={() => navigate('/auth')}>
            {t('Увійти', 'Sign In')}
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-lg">
        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <div className="text-5xl font-bold text-primary">{day}</div>
            <div className="text-sm text-muted-foreground capitalize">{weekDay}</div>
            <div className="text-xs text-muted-foreground">{monthYear}</div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextDay}
            disabled={isToday}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Streak indicator */}
        {streak && streak.current > 0 && (
          <div className="flex items-center justify-center gap-2 mb-8 text-sm">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-medium">{streak.current}</span>
            <span className="text-muted-foreground">
              {t('днів поспіль', 'day streak')}
            </span>
          </div>
        )}

        {/* Main form */}
        <div className="space-y-10">
          {/* Wake Up */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-5 h-5 text-amber-500" />
              <h2 className="font-medium">{t('Підйом', 'Wake Up')}</h2>
            </div>
            <TimePickerButton
              value={entry.wakeUpTime || ''}
              onChange={(val) => updateField('wakeUpTime', val)}
              title={t('Час підйому', 'Wake Up Time')}
              placeholder="--:--"
            />
            {config?.wakeUpTarget && (
              <p className="text-xs text-muted-foreground mt-2">
                {t('Ціль:', 'Target:')} {config.wakeUpTarget}
              </p>
            )}
          </section>

          {/* Japa */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">{t('Джапа', 'Japa')}</h2>
              <span className="text-sm text-muted-foreground">
                {totalJapa} / {japaTarget}
              </span>
            </div>

            <Progress value={japaProgress} className="h-2 mb-6" />

            <div className="grid grid-cols-4 gap-4">
              {[
                { key: 'japaBefore730', label: t('до 7:30', '< 7:30'), field: 'japaBefore730' as const },
                { key: 'japaBefore1000', label: t('до 10:00', '< 10:00'), field: 'japaBefore1000' as const },
                { key: 'japaBefore1800', label: t('до 18:00', '< 18:00'), field: 'japaBefore1800' as const },
                { key: 'japaAfter1800', label: t('після 18', '> 18:00'), field: 'japaAfter1800' as const },
              ].map(({ key, label, field }) => (
                <div key={key} className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">{label}</div>
                  <Input
                    type="number"
                    min="0"
                    max="64"
                    value={entry[field] || 0}
                    onChange={(e) => updateField(field, parseInt(e.target.value) || 0)}
                    className="text-center text-xl font-semibold h-12"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Reading */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Book className="w-5 h-5 text-emerald-600" />
              <h2 className="font-medium">{t('Читання', 'Reading')}</h2>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="0"
                value={Math.floor((entry.readingMinutes || 0) / 60)}
                onChange={(e) => {
                  const hours = parseInt(e.target.value) || 0;
                  const mins = (entry.readingMinutes || 0) % 60;
                  updateField('readingMinutes', hours * 60 + mins);
                }}
                className="w-16 text-center text-lg"
              />
              <span className="text-muted-foreground">{t('год', 'h')}</span>
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
                className="w-16 text-center text-lg"
              />
              <span className="text-muted-foreground">{t('хв', 'm')}</span>
            </div>
          </section>

          {/* Kirtan */}
          {(config?.trackKirtan ?? true) && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-5 h-5 text-purple-500" />
                <h2 className="font-medium">{t('Кіртан', 'Kirtan')}</h2>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min="0"
                  value={Math.floor((entry.kirtanMinutes || 0) / 60)}
                  onChange={(e) => {
                    const hours = parseInt(e.target.value) || 0;
                    const mins = (entry.kirtanMinutes || 0) % 60;
                    updateField('kirtanMinutes', hours * 60 + mins);
                  }}
                  className="w-16 text-center text-lg"
                />
                <span className="text-muted-foreground">{t('год', 'h')}</span>
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
                  className="w-16 text-center text-lg"
                />
                <span className="text-muted-foreground">{t('хв', 'm')}</span>
              </div>
            </section>
          )}

          {/* Service toggle */}
          {(config?.trackService ?? true) && (
            <section className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <span className="font-medium">{t('Служіння', 'Service')}</span>
              </div>
              <Switch
                checked={entry.serviceDone || false}
                onCheckedChange={(checked) => updateField('serviceDone', checked)}
              />
            </section>
          )}

          {/* Bed Time */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-5 h-5 text-indigo-400" />
              <h2 className="font-medium">{t('Відбій', 'Bed Time')}</h2>
            </div>
            <TimePickerButton
              value={entry.bedTime || ''}
              onChange={(val) => updateField('bedTime', val)}
              title={t('Час відбою', 'Bed Time')}
              placeholder="--:--"
            />
            {config?.bedTimeTarget && (
              <p className="text-xs text-muted-foreground mt-2">
                {t('Ціль:', 'Target:')} {config.bedTimeTarget}
              </p>
            )}
          </section>

          {/* Notes */}
          <section>
            <h2 className="font-medium mb-4">{t('Нотатки', 'Notes')}</h2>
            <Textarea
              value={entry.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder={t('Як пройшов день...', 'How was your day...')}
              rows={3}
              className="resize-none"
            />
          </section>

          {/* Save button */}
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="w-full h-12 text-base"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                {t('Зберегти', 'Save')}
              </>
            )}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
