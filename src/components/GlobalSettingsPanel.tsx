import { useState } from "react";
import { Settings, Globe, Palette, RotateCcw, Smartphone, Maximize, Square, Sun, Moon, Leaf, Snowflake, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { AdminTypographyPanel } from "@/components/AdminTypographyPanel";
import { errorLogger } from "@/utils/errorLogger";

const MIN_FONT = 12;
const MAX_FONT = 24;
const MIN_LH = 1.3;
const MAX_LH = 2.0;

// Початкові значення
const DEFAULTS = {
  fontSize: 18,
  lineHeight: 1.6,
  dualLanguageMode: false,
  showNumbers: true,
  flowMode: false,
  mobileSafeMode: false,
  showVerseContour: true,
  fullscreenMode: false,
  blocks: {
    showSanskrit: true,
    showTransliteration: true,
    showSynonyms: true,
    showTranslation: true,
    showCommentary: true,
  },
  continuousReading: {
    enabled: false,
    showVerseNumbers: true,
    showSanskrit: false,
    showTransliteration: false,
    showSynonyms: true,
    showTranslation: true,
    showCommentary: false,
  },
};

const LS_KEYS = {
  fontSize: "vv_reader_fontSize",
  lineHeight: "vv_reader_lineHeight",
  dual: "vv_reader_dualMode",
  blocks: "vv_reader_blocks",
  showNumbers: "vv_reader_showNumbers",
  flowMode: "vv_reader_flowMode",
  continuousReading: "vv_reader_continuousReading",
};

type BlocksState = {
  sanskrit: boolean;
  translit: boolean;
  synonyms: boolean;
  translation: boolean;
  commentary: boolean;
};

export type ContinuousReadingState = {
  enabled: boolean;
  showSanskrit: boolean;
  showTransliteration: boolean;
  showTranslation: boolean;
  showCommentary: boolean;
};

function readBlocks(): BlocksState {
  try {
    const raw = localStorage.getItem(LS_KEYS.blocks);
    if (raw)
      return {
        sanskrit: true,
        translit: true,
        synonyms: true,
        translation: true,
        commentary: true,
        ...JSON.parse(raw),
      };
  } catch (e) {
    errorLogger.logSilent(e, 'localStorage read - blocks settings');
  }
  return { sanskrit: true, translit: true, synonyms: true, translation: true, commentary: true };
}

function readContinuousReading(): ContinuousReadingState {
  try {
    const raw = localStorage.getItem(LS_KEYS.continuousReading);
    if (raw) return { ...DEFAULTS.continuousReading, ...JSON.parse(raw) };
  } catch (e) {
    errorLogger.logSilent(e, 'localStorage read - continuous reading settings');
  }
  return DEFAULTS.continuousReading;
}

export const GlobalSettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { isAdmin } = useAuth();

  // ✅ Використовуємо централізовану responsive систему
  const {
    fontSize,
    baseFontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    resetTypography,
    dualLanguageMode,
    setDualLanguageMode,
    textDisplaySettings,
    setTextDisplaySettings,
    continuousReadingSettings,
    setContinuousReadingSettings,
    showNumbers,
    setShowNumbers,
    flowMode,
    setFlowMode,
    mobileSafeMode,
    setMobileSafeMode,
    showVerseContour,
    setShowVerseContour,
    fullscreenMode,
    setFullscreenMode,
  } = useReaderSettings();

  // Handle font size slider change
  const handleFontSizeChange = (values: number[]) => {
    const newSize = values[0];
    const adjustment = newSize - baseFontSize;
    setFontSize(adjustment);
  };

  // Handle line height slider change
  const handleLineHeightChange = (values: number[]) => {
    setLineHeight(values[0]);
  };

  // Функція скидання до початкових значень
  const resetToDefaults = () => {
    // Скидаємо типографіку через хук
    resetTypography();

    // Скидаємо інші налаштування
    setDualLanguageMode(DEFAULTS.dualLanguageMode);
    setTextDisplaySettings(DEFAULTS.blocks);
    setShowNumbers(DEFAULTS.showNumbers);
    setFlowMode(DEFAULTS.flowMode);
    setMobileSafeMode(DEFAULTS.mobileSafeMode);
    setShowVerseContour(DEFAULTS.showVerseContour);
    setFullscreenMode(DEFAULTS.fullscreenMode);
    setContinuousReadingSettings(DEFAULTS.continuousReading);
  };

  // ✅ Функції increaseFont, decreaseFont, increaseLH, decreaseLH тепер з хука useReaderSettings

  // Масив всіх доступних тем
  const themes = [
    { id: "light" as const, label: t("Світла", "Light"), icon: Sun },
    { id: "dark" as const, label: t("Темна", "Dark"), icon: Moon },
    { id: "craft" as const, label: t("Крафт", "Craft"), icon: Palette },
    { id: "sepia" as const, label: t("Сепія", "Sepia"), icon: Palette },
    { id: "solarized-light" as const, label: "Solarized Light", icon: Sun },
    { id: "solarized-dark" as const, label: "Solarized Dark", icon: Moon },
    { id: "nord" as const, label: "Nord", icon: Snowflake },
    { id: "high-contrast" as const, label: t("Контраст", "High Contrast"), icon: Eye },
  ];

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="global-settings-btn fixed bottom-32 right-6 z-40 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        aria-label="Open settings"
      >
        <Settings className="h-6 w-6" />
      </Button>

      {/* Settings Panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:w-96 max-w-[100vw] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>{t("Налаштування", "Settings")}</SheetTitle>
          </SheetHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <TabsTrigger value="general">{t("Загальні", "General")}</TabsTrigger>
              {isAdmin && <TabsTrigger value="admin">{t("Стилі (Admin)", "Styles (Admin)")}</TabsTrigger>}
            </TabsList>

            <TabsContent value="general" className="space-y-6 pb-6 mt-6">
            {/* Тема */}
            <div>
              <Label className="text-base font-semibold mb-3 block">{t("Тема оформлення", "Theme")}</Label>
              <div className="grid grid-cols-4 gap-2">
                {themes.map((t) => {
                  const Icon = t.icon;
                  return (
                    <Button
                      key={t.id}
                      variant={theme === t.id ? "default" : "outline"}
                      onClick={() => setTheme(t.id)}
                      className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
                      title={t.label}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate w-full text-center">{t.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Мова інтерфейсу */}
            <div>
              <Label className="text-base font-semibold mb-3 block">{t("Мова інтерфейсу", "Interface Language")}</Label>
              <div className="flex gap-2">
                <Button
                  variant={language === "uk" ? "default" : "outline"}
                  onClick={() => setLanguage("uk")}
                  className="flex-1"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Українська
                </Button>
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  onClick={() => setLanguage("en")}
                  className="flex-1"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  English
                </Button>
              </div>
            </div>

            <Separator />

            {/* Налаштування читання */}
            <div>
              <h3 className="text-lg font-semibold mb-2">{t("Відображення тексту", "Text Display")}</h3>
              <div className="space-y-5">
                {/* Kindle-style Font Size Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{t("Розмір шрифта", "Font Size")}</Label>
                    <span className="text-sm text-muted-foreground tabular-nums">{fontSize}px</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-serif select-none" style={{ fontSize: '12px' }}>Aa</span>
                    <Slider
                      value={[fontSize]}
                      min={MIN_FONT}
                      max={MAX_FONT}
                      step={1}
                      onValueChange={handleFontSizeChange}
                      className="flex-1"
                      aria-label={t("Розмір шрифта", "Font Size")}
                    />
                    <span className="text-xl font-serif select-none" style={{ fontSize: '20px' }}>Aa</span>
                  </div>
                </div>

                {/* Kindle-style Line Height Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{t("Міжряддя", "Line Height")}</Label>
                    <span className="text-sm text-muted-foreground tabular-nums">{lineHeight.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                    <Slider
                      value={[lineHeight]}
                      min={MIN_LH}
                      max={MAX_LH}
                      step={0.05}
                      onValueChange={handleLineHeightChange}
                      className="flex-1"
                      aria-label={t("Міжряддя", "Line Height")}
                    />
                    <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="4" y1="4" x2="20" y2="4" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="20" x2="20" y2="20" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="dual-language">{t("Двомовний режим", "Dual Language Mode")}</Label>
                  <Switch id="dual-language" checked={dualLanguageMode} onCheckedChange={(v) => setDualLanguageMode(v)} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-numbers">{t("Показувати номери віршів", "Show Verse Numbers")}</Label>
                  <Switch id="show-numbers" checked={showNumbers} onCheckedChange={(v) => setShowNumbers(v)} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="flow-mode">{t("Суцільний текст (без рамок)", "Continuous Text (No Borders)")}</Label>
                  <Switch id="flow-mode" checked={flowMode} onCheckedChange={(v) => setFlowMode(v)} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Square className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="verse-contour">{t("Контур навколо тексту", "Text Contour")}</Label>
                  </div>
                  <Switch id="verse-contour" checked={showVerseContour} onCheckedChange={(v) => setShowVerseContour(v)} />
                </div>

                <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Maximize className="h-4 w-4 text-primary" />
                    <div>
                      <Label htmlFor="fullscreen-mode">{t("Повноекранне читання", "Fullscreen Reading")}</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t("Ховає меню та іконки", "Hides menu and icons")}
                      </p>
                    </div>
                  </div>
                  <Switch id="fullscreen-mode" checked={fullscreenMode} onCheckedChange={(v) => setFullscreenMode(v)} />
                </div>

                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor="mobile-safe-mode">{t("Мобільний safe mode", "Mobile Safe Mode")}</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t("Вимикає blur/складні ефекти", "Disables blur/complex effects")}
                      </p>
                    </div>
                  </div>
                  <Switch id="mobile-safe-mode" checked={mobileSafeMode} onCheckedChange={(v) => setMobileSafeMode(v)} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t("Елементи тексту", "Text Elements")}</h3>
              <div className="space-y-3">
                <RowToggle
                  label={t("Санскрит / Деванагарі", "Sanskrit / Devanagari")}
                  checked={textDisplaySettings.showSanskrit}
                  onChange={(v) => setTextDisplaySettings({ ...textDisplaySettings, showSanskrit: v })}
                />
                <RowToggle
                  label={t("Транслітерація", "Transliteration")}
                  checked={textDisplaySettings.showTransliteration}
                  onChange={(v) => setTextDisplaySettings({ ...textDisplaySettings, showTransliteration: v })}
                />
                <RowToggle
                  label={language === "uk" ? "Послівний переклад" : "Synonyms"}
                  checked={textDisplaySettings.showSynonyms}
                  onChange={(v) => setTextDisplaySettings({ ...textDisplaySettings, showSynonyms: v })}
                />
                <RowToggle
                  label={language === "uk" ? "Літературний переклад" : "Translation"}
                  checked={textDisplaySettings.showTranslation}
                  onChange={(v) => setTextDisplaySettings({ ...textDisplaySettings, showTranslation: v })}
                />
                <RowToggle
                  label={language === "uk" ? "Пояснення" : "Purport"}
                  checked={textDisplaySettings.showCommentary}
                  onChange={(v) => setTextDisplaySettings({ ...textDisplaySettings, showCommentary: v })}
                />
              </div>
            </div>

            <Separator />

            {/* Continuous Reading Mode */}
            <div>
              <h3 className="text-lg font-semibold mb-2">{t("Режим неперервного читання", "Continuous Reading Mode")}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="continuous-enabled">{t("Увімкнути режим", "Enable Mode")}</Label>
                  <Switch
                    id="continuous-enabled"
                    checked={continuousReadingSettings.enabled}
                    onCheckedChange={(v) => setContinuousReadingSettings({ ...continuousReadingSettings, enabled: v })}
                  />
                </div>

                {continuousReadingSettings.enabled && (
                  <div className="ml-4 space-y-3 border-l-2 border-muted pl-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cont-sanskrit">{t("Санскрит", "Sanskrit")}</Label>
                      <Switch
                        id="cont-sanskrit"
                        checked={continuousReadingSettings.showSanskrit}
                        onCheckedChange={(v) => setContinuousReadingSettings({ ...continuousReadingSettings, showSanskrit: v })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="cont-transliteration">{t("Транслітерація", "Transliteration")}</Label>
                      <Switch
                        id="cont-transliteration"
                        checked={continuousReadingSettings.showTransliteration}
                        onCheckedChange={(v) => setContinuousReadingSettings({ ...continuousReadingSettings, showTransliteration: v })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="cont-translation">{t("Переклад", "Translation")}</Label>
                      <Switch
                        id="cont-translation"
                        checked={continuousReadingSettings.showTranslation}
                        onCheckedChange={(v) => setContinuousReadingSettings({ ...continuousReadingSettings, showTranslation: v })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="cont-commentary">{t("Пояснення", "Purport")}</Label>
                      <Switch
                        id="cont-commentary"
                        checked={continuousReadingSettings.showCommentary}
                        onCheckedChange={(v) => setContinuousReadingSettings({ ...continuousReadingSettings, showCommentary: v })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Скидання налаштувань */}
            <div>
              <Button
                variant="outline"
                onClick={resetToDefaults}
                className="w-full gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {t("Скинути до початкових", "Reset to Defaults")}
              </Button>
            </div>
            </TabsContent>

            {/* Admin Typography Panel */}
            {isAdmin && (
              <TabsContent value="admin" className="mt-6">
                <AdminTypographyPanel language={language} />
              </TabsContent>
            )}
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
};

function RowToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
