/**
 * SleepTimerDialog - UI for setting sleep timer
 *
 * Options:
 * - Preset times: 5, 10, 15, 30, 45, 60 minutes
 * - End of current track
 * - End of X tracks
 * - Cancel/Off
 */

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio, SleepTimerMode } from "@/contexts/ModernAudioContext";
import { Moon, Clock, Music2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SleepTimerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Preset time options in minutes
const TIME_PRESETS = [5, 10, 15, 30, 45, 60];

// Track count options
const TRACK_PRESETS = [1, 2, 3, 5];

export function SleepTimerDialog({ isOpen, onClose }: SleepTimerDialogProps) {
  const { t } = useLanguage();
  const { sleepTimer, sleepTimerRemaining, setSleepTimer, cancelSleepTimer } = useAudio();
  const [activeTab, setActiveTab] = useState<'time' | 'tracks'>('time');

  const handleSetTimer = (mode: SleepTimerMode) => {
    setSleepTimer(mode);
    onClose();
  };

  const handleCancel = () => {
    cancelSleepTimer();
    onClose();
  };

  // Format remaining time
  const formatRemaining = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
  };

  // Get current timer description
  const getTimerDescription = (): string | null => {
    if (!sleepTimer) return null;

    if (sleepTimer.type === 'minutes' && sleepTimerRemaining) {
      return `${t("Залишилось", "Remaining")}: ${formatRemaining(sleepTimerRemaining)}`;
    }
    if (sleepTimer.type === 'endOfTrack') {
      return t("Після цього треку", "After current track");
    }
    if (sleepTimer.type === 'tracks') {
      return `${t("Ще", "Remaining")}: ${sleepTimer.value} ${t("треків", "tracks")}`;
    }
    return null;
  };

  const timerDescription = getTimerDescription();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            {t("Таймер сну", "Sleep Timer")}
          </DialogTitle>
        </DialogHeader>

        {/* Current timer status */}
        {sleepTimer && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">{timerDescription}</span>
            </div>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab('time')}
            className={cn(
              "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "flex items-center justify-center gap-2",
              activeTab === 'time'
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Clock className="h-4 w-4" />
            {t("Час", "Time")}
          </button>
          <button
            onClick={() => setActiveTab('tracks')}
            className={cn(
              "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "flex items-center justify-center gap-2",
              activeTab === 'tracks'
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Music2 className="h-4 w-4" />
            {t("Треки", "Tracks")}
          </button>
        </div>

        {/* Time options */}
        {activeTab === 'time' && (
          <div className="grid grid-cols-3 gap-2">
            {TIME_PRESETS.map((mins) => (
              <Button
                key={mins}
                variant="outline"
                className={cn(
                  "h-auto py-3 flex-col gap-1",
                  sleepTimer?.type === 'minutes' && sleepTimer.value === mins && "border-primary bg-primary/5"
                )}
                onClick={() => handleSetTimer({ type: 'minutes', value: mins })}
              >
                <span className="text-lg font-bold">{mins}</span>
                <span className="text-xs text-muted-foreground">{t("хв", "min")}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Track options */}
        {activeTab === 'tracks' && (
          <div className="space-y-2">
            {/* End of current track */}
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start gap-3 h-auto py-3",
                sleepTimer?.type === 'endOfTrack' && "border-primary bg-primary/5"
              )}
              onClick={() => handleSetTimer({ type: 'endOfTrack' })}
            >
              <Music2 className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">
                  {t("Після цього треку", "After current track")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("Зупинити після завершення поточного треку", "Stop when current track ends")}
                </div>
              </div>
              {sleepTimer?.type === 'endOfTrack' && (
                <Check className="h-4 w-4 text-primary ml-auto" />
              )}
            </Button>

            {/* X tracks remaining */}
            <div className="grid grid-cols-4 gap-2">
              {TRACK_PRESETS.map((count) => (
                <Button
                  key={count}
                  variant="outline"
                  className={cn(
                    "h-auto py-3 flex-col gap-1",
                    sleepTimer?.type === 'tracks' && sleepTimer.value === count && "border-primary bg-primary/5"
                  )}
                  onClick={() => handleSetTimer({ type: 'tracks', value: count })}
                >
                  <span className="text-lg font-bold">{count}</span>
                  <span className="text-xs text-muted-foreground">
                    {count === 1 ? t("трек", "track") : t("треки", "tracks")}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Cancel button */}
        <div className="flex gap-2 pt-2">
          {sleepTimer && (
            <Button variant="destructive" className="flex-1" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              {t("Вимкнути таймер", "Turn off timer")}
            </Button>
          )}
          <Button variant="outline" className={sleepTimer ? "" : "flex-1"} onClick={onClose}>
            {t("Закрити", "Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Compact sleep timer indicator for player UI
 */
export function SleepTimerIndicator({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  const { t } = useLanguage();
  const { sleepTimer, sleepTimerRemaining } = useAudio();

  if (!sleepTimer) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "p-2 rounded-full hover:bg-muted transition-colors",
          "text-muted-foreground hover:text-foreground",
          className
        )}
        title={t("Таймер сну", "Sleep Timer")}
      >
        <Moon className="h-4 w-4" />
      </button>
    );
  }

  // Format time remaining
  const formatTime = (): string => {
    if (sleepTimer.type === 'minutes' && sleepTimerRemaining) {
      const mins = Math.floor(sleepTimerRemaining / 60);
      const secs = sleepTimerRemaining % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    if (sleepTimer.type === 'endOfTrack') {
      return '1';
    }
    if (sleepTimer.type === 'tracks') {
      return String(sleepTimer.value);
    }
    return '';
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full",
        "bg-primary/20 text-primary hover:bg-primary/30 transition-colors",
        className
      )}
      title={t("Таймер сну активний", "Sleep timer active")}
    >
      <Moon className="h-3.5 w-3.5 animate-pulse" />
      <span className="text-xs font-mono font-medium">{formatTime()}</span>
    </button>
  );
}

export default SleepTimerDialog;
