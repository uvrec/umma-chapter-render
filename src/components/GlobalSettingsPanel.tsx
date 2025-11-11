import { useEffect, useState } from "react";
import { Settings, Globe, Palette, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/ThemeProvider";

const MIN_FONT = 12;
const MAX_FONT = 24;
const MIN_LH = 1.3;
const MAX_LH = 2.0;

// Початкові значення
const DEFAULTS = {
  fontSize: 18,
  lineHeight: 1.6,
  dualMode: false,
  showNumbers: true,
  flowMode: false,
  blocks: {
    sanskrit: true,
    translit: true,
    synonyms: true,
    translation: true,
    commentary: true,
  },
  continuousReading: {
    enabled: false,
    showSanskrit: false,
    showTransliteration: false,
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
  } catch {}
  return { sanskrit: true, translit: true, synonyms: true, translation: true, commentary: true };
}

function readContinuousReading(): ContinuousReadingState {
  try {
    const raw = localStorage.getItem(LS_KEYS.continuousReading);
    if (raw) return { ...DEFAULTS.continuousReading, ...JSON.parse(raw) };
  } catch {}
  return DEFAULTS.continuousReading;
}

export const GlobalSettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [fontSize, setFontSize] = useState<number>(() => {
    const s = localStorage.getItem(LS_KEYS.fontSize);
    return s ? Number(s) : DEFAULTS.fontSize;
  });
  const [lineHeight, setLineHeight] = useState<number>(() => {
    const s = localStorage.getItem(LS_KEYS.lineHeight);
    return s ? Number(s) : DEFAULTS.lineHeight;
  });
  const [dualMode, setDualMode] = useState<boolean>(() => localStorage.getItem(LS_KEYS.dual) === "true");
  const [blocks, setBlocks] = useState<BlocksState>(() => readBlocks());
  const [showNumbers, setShowNumbers] = useState<boolean>(() => localStorage.getItem(LS_KEYS.showNumbers) !== "false");
  const [flowMode, setFlowMode] = useState<boolean>(() => localStorage.getItem(LS_KEYS.flowMode) === "true");
  const [continuousReading, setContinuousReading] = useState<ContinuousReadingState>(() => readContinuousReading());

  const bumpReader = () => {
    window.dispatchEvent(new CustomEvent("vv-reader-prefs-changed"));
  };

  // Об'єднаний useEffect для збереження всіх налаштувань
  useEffect(() => {
    localStorage.setItem(LS_KEYS.fontSize, String(fontSize));
    localStorage.setItem(LS_KEYS.lineHeight, String(lineHeight));
    localStorage.setItem(LS_KEYS.dual, String(dualMode));
    localStorage.setItem(LS_KEYS.blocks, JSON.stringify(blocks));
    localStorage.setItem(LS_KEYS.showNumbers, String(showNumbers));
    localStorage.setItem(LS_KEYS.flowMode, String(flowMode));
    localStorage.setItem(LS_KEYS.continuousReading, JSON.stringify(continuousReading));
    bumpReader();
  }, [fontSize, lineHeight, dualMode, blocks, showNumbers, flowMode, continuousReading]);

  // Функція скидання до початкових значень
  const resetToDefaults = () => {
    setFontSize(DEFAULTS.fontSize);
    setLineHeight(DEFAULTS.lineHeight);
    setDualMode(DEFAULTS.dualMode);
    setBlocks(DEFAULTS.blocks);
    setShowNumbers(DEFAULTS.showNumbers);
    setFlowMode(DEFAULTS.flowMode);
    setContinuousReading(DEFAULTS.continuousReading);
  };

  const decreaseFont = () => setFontSize((v) => Math.max(MIN_FONT, v - 1));
  const increaseFont = () => setFontSize((v) => Math.min(MAX_FONT, v + 1));
  const decreaseLH = () => setLineHeight((v) => Math.max(MIN_LH, Math.round((v - 0.05) * 100) / 100));
  const increaseLH = () => setLineHeight((v) => Math.min(MAX_LH, Math.round((v + 0.05) * 100) / 100));

  const craftSwitchChecked = theme === "craft";

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 z-40 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        aria-label="Open settings"
      >
        <Settings className="h-6 w-6" />
      </Button>

      {/* Settings Panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-96 overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>{t("Налаштування", "Settings")}</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 pb-6">
            {/* Тема */}
            <div>
              <Label className="text-base font-semibold mb-3 block">{t("Тема оформлення", "Theme")}</Label>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                  variant={craftSwitchChecked ? "default" : "outline"}
                  onClick={() => setTheme("craft")}
                  className="gap-2"
                >
                  <Palette className="h-4 w-4" />
                  Крафт
                </Button>
              </div>
            </div>

            {/* Мова інтерфейсу */}
            <div>
              <Label className="text-base font-semibold mb-3 block">{t("Мова інтерфейсу", "Interface Language")}</Label>
              <div className="flex gap-2">
                <Button
                  variant={language === "ua" ? "default" : "outline"}
                  onClick={() => setLanguage("ua")}
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t("Розмір шрифта", "Font Size")}</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={decreaseFont}
                      disabled={fontSize <= MIN_FONT}
                      aria-label="Зменшити"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-10 text-center text-sm tabular-nums">{fontSize}px</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={increaseFont}
                      disabled={fontSize >= MAX_FONT}
                      aria-label="Збільшити"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t("Міжряддя", "Line Height")}</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={decreaseLH}
                      disabled={lineHeight <= MIN_LH}
                      aria-label="Зменшити"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center text-sm tabular-nums">{lineHeight.toFixed(2)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={increaseLH}
                      disabled={lineHeight >= MAX_LH}
                      aria-label="Збільшити"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="dual-language">{t("Двомовний режим", "Dual Language Mode")}</Label>
                  <Switch id="dual-language" checked={dualMode} onCheckedChange={(v) => setDualMode(v)} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-numbers">{t("Показувати номери віршів", "Show Verse Numbers")}</Label>
                  <Switch id="show-numbers" checked={showNumbers} onCheckedChange={(v) => setShowNumbers(v)} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="flow-mode">{t("Суцільний текст (без рамок)", "Continuous Text (No Borders)")}</Label>
                  <Switch id="flow-mode" checked={flowMode} onCheckedChange={(v) => setFlowMode(v)} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t("Елементи тексту", "Text Elements")}</h3>
              <div className="space-y-3">
                <RowToggle
                  label={t("Санскрит / Деванагарі", "Sanskrit / Devanagari")}
                  checked={blocks.sanskrit}
                  onChange={(v) => setBlocks({ ...blocks, sanskrit: v })}
                />
                <RowToggle
                  label={t("Транслітерація", "Transliteration")}
                  checked={blocks.translit}
                  onChange={(v) => setBlocks({ ...blocks, translit: v })}
                />
                <RowToggle
                  label={language === "ua" ? "Послівний переклад" : "Synonyms"}
                  checked={blocks.synonyms}
                  onChange={(v) => setBlocks({ ...blocks, synonyms: v })}
                />
                <RowToggle
                  label={language === "ua" ? "Літературний переклад" : "Translation"}
                  checked={blocks.translation}
                  onChange={(v) => setBlocks({ ...blocks, translation: v })}
                />
                <RowToggle
                  label={language === "ua" ? "Пояснення" : "Purport"}
                  checked={blocks.commentary}
                  onChange={(v) => setBlocks({ ...blocks, commentary: v })}
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
                    checked={continuousReading.enabled}
                    onCheckedChange={(v) => setContinuousReading({ ...continuousReading, enabled: v })}
                  />
                </div>

                {continuousReading.enabled && (
                  <div className="ml-4 space-y-3 border-l-2 border-muted pl-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cont-sanskrit">{t("Санскрит", "Sanskrit")}</Label>
                      <Switch
                        id="cont-sanskrit"
                        checked={continuousReading.showSanskrit}
                        onCheckedChange={(v) => setContinuousReading({ ...continuousReading, showSanskrit: v })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="cont-transliteration">{t("Транслітерація", "Transliteration")}</Label>
                      <Switch
                        id="cont-transliteration"
                        checked={continuousReading.showTransliteration}
                        onCheckedChange={(v) => setContinuousReading({ ...continuousReading, showTransliteration: v })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="cont-translation">{t("Переклад", "Translation")}</Label>
                      <Switch
                        id="cont-translation"
                        checked={continuousReading.showTranslation}
                        onCheckedChange={(v) => setContinuousReading({ ...continuousReading, showTranslation: v })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="cont-commentary">{t("Пояснення", "Purport")}</Label>
                      <Switch
                        id="cont-commentary"
                        checked={continuousReading.showCommentary}
                        onCheckedChange={(v) => setContinuousReading({ ...continuousReading, showCommentary: v })}
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
          </div>
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
