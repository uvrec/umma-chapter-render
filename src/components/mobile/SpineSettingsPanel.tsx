// src/components/mobile/SpineSettingsPanel.tsx
// Settings panel for Spine Navigation (Neu Bible-style)
// Панель налаштувань: мова, блоки тексту, про застосунок
// Updated: 2026-01-19 - removed react-icons dependency, using lucide-react only

import { useState, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Maximize,
  Smartphone,
  Square,
  Info,
  FileText,
  Shield,
  HelpCircle,
  ChevronRight,
  Leaf,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SpineSettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

// Translation source definitions for VedaVoice
const TRANSLATION_SOURCES = [
  {
    id: "uk",
    code: "UK",
    title_uk: "Український переклад",
    title_en: "Ukrainian Translation",
    description_uk: "Переклад українською мовою творів Шріли Прабгупади для україномовних читачів.",
    description_en: "Ukrainian translation of Srila Prabhupada's works for Ukrainian-speaking readers.",
    bgColor: "bg-gradient-to-br from-blue-500 to-yellow-400",
    textColor: "text-white",
    abbr: "УКР",
  },
  {
    id: "en",
    code: "EN",
    title_uk: "Англійський оригінал",
    title_en: "English Original",
    description_uk: "Оригінальні твори Шріли Прабгупади англійською мовою - класичні переклади Vedabase.",
    description_en: "Original works by Srila Prabhupada in English - classic Vedabase translations.",
    bgColor: "bg-gradient-to-br from-slate-800 to-slate-900",
    textColor: "text-white",
    abbr: "ENG",
  },
  {
    id: "dual",
    code: "DUAL",
    title_uk: "Двомовний режим",
    title_en: "Dual Language",
    description_uk: "Український та англійський переклади поруч для порівняння та вивчення.",
    description_en: "Ukrainian and English translations side by side for comparison and study.",
    bgColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
    textColor: "text-white",
    abbr: "UK/EN",
  },
] as const;

// Reading reminders localStorage key
const REMINDERS_STORAGE_KEY = "vv_reading_reminders";

type ReminderSettings = {
  enabled: boolean;
  days: boolean[]; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  time: string; // "HH:MM" format
};

const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: false,
  days: [false, true, true, true, true, true, false], // Mon-Fri by default
  time: "07:00",
};

function loadReminders(): ReminderSettings {
  try {
    const saved = localStorage.getItem(REMINDERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_REMINDERS;
  } catch {
    return DEFAULT_REMINDERS;
  }
}

function saveReminders(settings: ReminderSettings) {
  try {
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore
  }
}

export function SpineSettingsPanel({ open, onClose }: SpineSettingsPanelProps) {
  const { language, setLanguage, t, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();
  const [showTranslationsModal, setShowTranslationsModal] = useState(false);
  const [selectedTranslationIndex, setSelectedTranslationIndex] = useState(0);
  const [showRemindersSheet, setShowRemindersSheet] = useState(false);
  const [reminders, setReminders] = useState<ReminderSettings>(loadReminders);
  const carouselRef = useRef<HTMLDivElement>(null);

  const {
    textDisplaySettings,
    setTextDisplaySettings,
    dualLanguageMode,
    setDualLanguageMode,
    mobileSafeMode,
    setMobileSafeMode,
    showVerseContour,
    setShowVerseContour,
    fullscreenMode,
    setFullscreenMode,
    zenMode,
    setZenMode,
  } = useReaderSettings();

  const handleNavigate = (path: string) => {
    navigate(getLocalizedPath(path));
    onClose();
  };

  // Get current active translation based on settings
  const getActiveTranslationId = () => {
    if (dualLanguageMode) return "dual";
    return language;
  };

  const handleSelectTranslation = (id: string) => {
    if (id === "dual") {
      setDualLanguageMode(true);
    } else {
      setDualLanguageMode(false);
      setLanguage(id as "uk" | "en");
    }
  };

  const handleTranslationCardClick = (index: number) => {
    setSelectedTranslationIndex(index);
    setShowTranslationsModal(true);
  };

  const handleRemindersToggle = (enabled: boolean) => {
    if (enabled) {
      setShowRemindersSheet(true);
    } else {
      const newSettings = { ...reminders, enabled: false };
      setReminders(newSettings);
      saveReminders(newSettings);
    }
  };

  const handleSaveReminders = (settings: ReminderSettings) => {
    setReminders(settings);
    saveReminders(settings);
    setShowRemindersSheet(false);
  };

  // About section links
  const aboutLinks = [
    {
      id: "about",
      label: t("Про застосунок", "About"),
      icon: Info,
      path: "/about",
    },
    {
      id: "terms",
      label: t("Умови використання", "Terms of Service"),
      icon: FileText,
      path: "/terms",
    },
    {
      id: "privacy",
      label: t("Політика конфіденційності", "Privacy Policy"),
      icon: Shield,
      path: "/privacy",
    },
    {
      id: "help",
      label: t("Допомога", "Help"),
      icon: HelpCircle,
      path: "/help",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="left"
        className="w-[calc(100%-4rem)] sm:w-80 mr-16 p-0 overflow-y-auto"
      >
        <SheetHeader className="px-4 py-4 border-b">
          <SheetTitle className="text-lg">{t("Налаштування", "Settings")}</SheetTitle>
        </SheetHeader>

        <div className="px-4 py-4 space-y-6">
          {/* GENERAL Section */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Загальне", "General")}
            </Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="reading-reminders" className="cursor-pointer">
                {t("Нагадування про читання", "Reading Reminders")}
              </Label>
              <Switch
                id="reading-reminders"
                checked={reminders.enabled}
                onCheckedChange={handleRemindersToggle}
              />
            </div>
            {reminders.enabled && (
              <button
                onClick={() => setShowRemindersSheet(true)}
                className="text-sm text-muted-foreground mt-2 hover:text-foreground"
              >
                {reminders.days.filter(Boolean).length > 0
                  ? `${reminders.time} • ${reminders.days.filter(Boolean).length} ${t("днів", "days")}`
                  : t("Налаштувати", "Configure")}
              </button>
            )}
          </div>

          <Separator />

          {/* Language Selection */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Мова", "Language")}
            </Label>
            <div className="flex gap-2">
              <Button
                variant={language === "uk" ? "default" : "outline"}
                onClick={() => setLanguage("uk")}
                className={cn(
                  "flex-1 h-12",
                  language === "uk" && "bg-brand-500 hover:bg-brand-600"
                )}
              >
                <Globe className="w-4 h-4 mr-2" />
                Українська
              </Button>
              <Button
                variant={language === "en" ? "default" : "outline"}
                onClick={() => setLanguage("en")}
                className={cn(
                  "flex-1 h-12",
                  language === "en" && "bg-brand-500 hover:bg-brand-600"
                )}
              >
                <Globe className="w-4 h-4 mr-2" />
                English
              </Button>
            </div>
          </div>

          <Separator />

          {/* Translations Section */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Переклади", "Translations")}
            </Label>

            {/* See All Translations link */}
            <button
              onClick={() => setShowTranslationsModal(true)}
              className="text-brand-500 font-medium mb-4 hover:underline"
            >
              {t("Всі переклади", "See All Translations")}
            </button>

            {/* Horizontal carousel of translation cards */}
            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {TRANSLATION_SOURCES.map((source, index) => {
                const isActive = getActiveTranslationId() === source.id;
                return (
                  <button
                    key={source.id}
                    onClick={() => handleTranslationCardClick(index)}
                    className={cn(
                      "flex-shrink-0 w-32 h-44 rounded-lg overflow-hidden relative",
                      "transition-transform active:scale-95",
                      source.bgColor,
                      "shadow-md"
                    )}
                    style={{ scrollSnapAlign: "start" }}
                  >
                    {/* Abbreviation/Logo */}
                    <div className={cn(
                      "absolute inset-0 flex flex-col items-center justify-center",
                      source.textColor
                    )}>
                      <span className="text-3xl font-bold tracking-tight opacity-30">
                        {source.abbr}
                      </span>
                      <span className="text-xs font-medium mt-2 px-2 text-center">
                        {language === "uk" ? source.title_uk : source.title_en}
                      </span>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Reading Options */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Читання", "Reading")}
            </Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dual-lang" className="cursor-pointer">
                  {t("Двомовний режим", "Dual Language")}
                </Label>
                <Switch
                  id="dual-lang"
                  checked={dualLanguageMode}
                  onCheckedChange={(v) => setDualLanguageMode(v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="verse-contour" className="cursor-pointer">
                    {t("Контур тексту", "Text Contour")}
                  </Label>
                </div>
                <Switch
                  id="verse-contour"
                  checked={showVerseContour}
                  onCheckedChange={(v) => setShowVerseContour(v)}
                />
              </div>

              <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg -mx-3">
                <div className="flex items-center gap-2">
                  <Maximize className="h-4 w-4 text-brand-500" />
                  <div>
                    <Label htmlFor="fullscreen" className="cursor-pointer">
                      {t("Повний екран", "Fullscreen")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("Ховає меню", "Hides menus")}
                    </p>
                  </div>
                </div>
                <Switch
                  id="fullscreen"
                  checked={fullscreenMode}
                  onCheckedChange={(v) => setFullscreenMode(v)}
                />
              </div>

              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg -mx-3">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <div>
                    <Label htmlFor="zen" className="cursor-pointer">
                      {t("Zen режим", "Zen Mode")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("Мінімум відволікань", "Minimal distractions")}
                    </p>
                  </div>
                </div>
                <Switch
                  id="zen"
                  checked={zenMode}
                  onCheckedChange={(v) => setZenMode(v)}
                />
              </div>

              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg -mx-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="mobile-safe" className="cursor-pointer">
                      {t("Safe режим", "Safe Mode")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("Вимикає blur ефекти", "Disables blur effects")}
                    </p>
                  </div>
                </div>
                <Switch
                  id="mobile-safe"
                  checked={mobileSafeMode}
                  onCheckedChange={(v) => setMobileSafeMode(v)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Text Blocks */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Блоки тексту", "Text Blocks")}
            </Label>
            <div className="space-y-3">
              <RowToggle
                label={t("Санскрит", "Sanskrit")}
                checked={textDisplaySettings.showSanskrit}
                onChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showSanskrit: v }))}
              />
              <RowToggle
                label={t("Транслітерація", "Transliteration")}
                checked={textDisplaySettings.showTransliteration}
                onChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showTransliteration: v }))}
              />
              <RowToggle
                label={t("Послівний переклад", "Synonyms")}
                checked={textDisplaySettings.showSynonyms}
                onChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showSynonyms: v }))}
              />
              <RowToggle
                label={t("Переклад", "Translation")}
                checked={textDisplaySettings.showTranslation}
                onChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showTranslation: v }))}
              />
              <RowToggle
                label={t("Пояснення", "Commentary")}
                checked={textDisplaySettings.showCommentary}
                onChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showCommentary: v }))}
              />
            </div>
          </div>

          <Separator />

          {/* About Section */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Про застосунок", "About")}
            </Label>
            <div className="space-y-1">
              {aboutLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavigate(link.path)}
                    className="w-full flex items-center justify-between px-2 py-3
                      hover:bg-muted/50 active:bg-muted rounded-lg transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span>{link.label}</span>
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center text-xs text-muted-foreground pt-4">
            <p>VedaVoice v{import.meta.env.VITE_APP_VERSION || "1.0.0"}</p>
          </div>
        </div>
      </SheetContent>

      {/* Full-screen Translations Modal */}
      {showTranslationsModal && (
        <TranslationsCarouselModal
          open={showTranslationsModal}
          onClose={() => setShowTranslationsModal(false)}
          translations={TRANSLATION_SOURCES}
          initialIndex={selectedTranslationIndex}
          activeId={getActiveTranslationId()}
          onSelect={handleSelectTranslation}
          language={language}
        />
      )}

      {/* Reading Reminders Sheet */}
      {showRemindersSheet && (
        <ReadingRemindersSheet
          open={showRemindersSheet}
          onClose={() => setShowRemindersSheet(false)}
          initialSettings={reminders}
          onSave={handleSaveReminders}
          language={language}
        />
      )}
    </Sheet>
  );
}

function RowToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="cursor-pointer">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

// Full-screen translations carousel modal (like Neu Bible)
interface TranslationsCarouselModalProps {
  open: boolean;
  onClose: () => void;
  translations: typeof TRANSLATION_SOURCES;
  initialIndex: number;
  activeId: string;
  onSelect: (id: string) => void;
  language: "uk" | "en";
}

function TranslationsCarouselModal({
  open,
  onClose,
  translations,
  initialIndex,
  activeId,
  onSelect,
  language,
}: TranslationsCarouselModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const currentTranslation = translations[currentIndex];
  const isActive = activeId === currentTranslation.id;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentIndex < translations.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (deltaX < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }

    touchStartX.current = null;
  };

  const handleSelect = () => {
    onSelect(currentTranslation.id);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
      {/* Carousel area */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center px-8"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous card preview */}
        {currentIndex > 0 && (
          <div
            className={cn(
              "absolute left-2 w-20 h-32 rounded-lg opacity-30",
              translations[currentIndex - 1].bgColor
            )}
          />
        )}

        {/* Current card */}
        <div className="flex flex-col items-center max-w-xs">
          <div
            className={cn(
              "w-48 h-72 rounded-xl shadow-2xl flex items-center justify-center",
              currentTranslation.bgColor,
              currentTranslation.textColor
            )}
          >
            <span className="text-5xl font-bold opacity-40">
              {currentTranslation.abbr}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-white text-xl font-semibold mt-6 text-center italic">
            {language === "uk" ? currentTranslation.title_uk : currentTranslation.title_en}
          </h2>

          {/* Description */}
          <p className="text-white/70 text-sm text-center mt-3 px-4 leading-relaxed">
            {language === "uk" ? currentTranslation.description_uk : currentTranslation.description_en}
          </p>

          {/* Select button or active indicator */}
          <div className="mt-6">
            {isActive ? (
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
            ) : (
              <button
                onClick={handleSelect}
                className="px-6 py-2 border border-white/30 rounded-full text-white/80
                  hover:bg-white/10 transition-colors"
              >
                {language === "uk" ? "Обрати" : "Select"}
              </button>
            )}
          </div>
        </div>

        {/* Next card preview */}
        {currentIndex < translations.length - 1 && (
          <div
            className={cn(
              "absolute right-2 w-20 h-32 rounded-lg opacity-30",
              translations[currentIndex + 1].bgColor
            )}
          />
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 pb-4">
        {translations.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === currentIndex ? "bg-white" : "bg-white/30"
            )}
          />
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white"
      >
        <X className="w-8 h-8" />
      </button>
    </div>
  );
}

// Reading Reminders Sheet (swipe up from bottom)
interface ReadingRemindersSheetProps {
  open: boolean;
  onClose: () => void;
  initialSettings: ReminderSettings;
  onSave: (settings: ReminderSettings) => void;
  language: "uk" | "en";
}

const DAYS_SHORT = {
  uk: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  en: ["S", "M", "T", "W", "T", "F", "S"],
};

function ReadingRemindersSheet({
  open,
  onClose,
  initialSettings,
  onSave,
  language,
}: ReadingRemindersSheetProps) {
  const [days, setDays] = useState<boolean[]>(initialSettings.days);
  const [time, setTime] = useState(initialSettings.time);

  const handleDayToggle = (index: number) => {
    const newDays = [...days];
    newDays[index] = !newDays[index];
    setDays(newDays);
  };

  const handleSave = () => {
    onSave({ enabled: true, days, time });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Sheet content */}
      <div className="relative bg-background rounded-t-2xl animate-in slide-in-from-bottom duration-300">
        {/* Days selector */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex justify-between">
            {DAYS_SHORT[language].map((day, index) => (
              <button
                key={index}
                onClick={() => handleDayToggle(index)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "font-medium transition-colors",
                  days[index]
                    ? "bg-brand-500 text-white"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Time picker */}
        <div className="px-6 py-8 flex justify-center">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={cn(
              "text-5xl font-light text-center bg-transparent",
              "border-0 focus:outline-none focus:ring-0",
              "appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
            )}
            style={{ colorScheme: "dark" }}
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className={cn(
            "w-full py-5 bg-brand-500 text-white font-medium text-lg",
            "hover:bg-brand-600 transition-colors",
            "safe-bottom"
          )}
        >
          {language === "uk" ? "Зберегти" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default SpineSettingsPanel;
