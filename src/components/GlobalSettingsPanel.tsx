import { useEffect, useMemo, useState } from "react";
import { Settings, X, Globe, Type, AlignJustify, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";

/**
 * ЗМІННІ, які читають стилі читалки:
 *  --vv-reader-font-size   (px)
 *  --vv-reader-line-height (число)
 *  --vv-reader-max-width   (ch)
 *
 * Ми встановлюємо їх на <html> через style.setProperty,
 * а також кешуємо у localStorage, щоб не "злітало" при переходах.
 */

const LS_KEYS = {
  fontSize: "vv.reader.fontSize",
  lineHeight: "vv.reader.lineHeight",
  maxWidth: "vv.reader.maxWidth",
} as const;

const DEFAULTS = {
  fontSize: 20, // px
  lineHeight: 1.6,
  maxWidth: 68, // ch
};

export const GlobalSettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // --- INIT з локалстоража або дефолтів ---
  const [fontSize, setFontSize] = useState<number>(() => {
    const v = Number(localStorage.getItem(LS_KEYS.fontSize));
    return Number.isFinite(v) && v > 10 && v < 40 ? v : DEFAULTS.fontSize;
  });
  const [lineHeight, setLineHeight] = useState<number>(() => {
    const v = Number(localStorage.getItem(LS_KEYS.lineHeight));
    return Number.isFinite(v) && v > 1 && v < 2.4 ? v : DEFAULTS.lineHeight;
  });
  const [maxWidth, setMaxWidth] = useState<number>(() => {
    const v = Number(localStorage.getItem(LS_KEYS.maxWidth));
    return Number.isFinite(v) && v >= 50 && v <= 90 ? v : DEFAULTS.maxWidth;
  });

  // --- застосувати CSS custom props на <html> ---
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--vv-reader-font-size", `${fontSize}px`);
    root.style.setProperty("--vv-reader-line-height", String(lineHeight));
    root.style.setProperty("--vv-reader-max-width", `${maxWidth}ch`);
    localStorage.setItem(LS_KEYS.fontSize, String(fontSize));
    localStorage.setItem(LS_KEYS.lineHeight, String(lineHeight));
    localStorage.setItem(LS_KEYS.maxWidth, String(maxWidth));
  }, [fontSize, lineHeight, maxWidth]);

  // --- кнопка "скинути" ---
  const canReset = useMemo(
    () => fontSize !== DEFAULTS.fontSize || lineHeight !== DEFAULTS.lineHeight || maxWidth !== DEFAULTS.maxWidth,
    [fontSize, lineHeight, maxWidth],
  );

  const handleReset = () => {
    setFontSize(DEFAULTS.fontSize);
    setLineHeight(DEFAULTS.lineHeight);
    setMaxWidth(DEFAULTS.maxWidth);
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        aria-label={t("Відкрити налаштування", "Open settings")}
      >
        <Settings className="h-6 w-6" />
      </Button>

      {/* Settings Panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-80">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle>{t("Налаштування", "Settings")}</SheetTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} aria-label={t("Закрити", "Close")}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="space-y-6">
            {/* Theme */}
            <section>
              <Label className="text-base font-semibold mb-3 block">{t("Тема оформлення", "Theme")}</Label>
              <div className="flex items-center justify-between">
                <ThemeToggle />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // швидкий перехід у craft, якщо треба
                    const root = document.documentElement;
                    root.classList.remove("light", "dark");
                    root.classList.add("craft");
                    localStorage.setItem("veda-ui-theme", "craft");
                  }}
                >
                  {t("Крафт-папір", "Craft paper")}
                </Button>
              </div>
            </section>

            {/* Language */}
            <section>
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
            </section>

            {/* Reader controls */}
            <section className="space-y-4">
              <Label className="text-base font-semibold block">{t("Налаштування читалки", "Reader settings")}</Label>

              {/* Font size */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    {t("Розмір шрифту", "Font size")}
                  </span>
                  <span className="text-sm text-muted-foreground">{fontSize}px</span>
                </div>
                <Slider value={[fontSize]} min={14} max={30} step={1} onValueChange={([v]) => setFontSize(v)} />
              </div>

              {/* Line height */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2">
                    <AlignJustify className="w-4 h-4" />
                    {t("Міжряддя", "Line height")}
                  </span>
                  <span className="text-sm text-muted-foreground">{lineHeight.toFixed(1)}</span>
                </div>
                <Slider
                  value={[lineHeight]}
                  min={1.2}
                  max={2.2}
                  step={0.1}
                  onValueChange={([v]) => setLineHeight(Number(v.toFixed(1)))}
                />
              </div>

              {/* Max text width */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2">
                    <AlignJustify className="w-4 h-4 rotate-90" />
                    {t("Ширина колонки", "Column width")}
                  </span>
                  <span className="text-sm text-muted-foreground">{maxWidth}ch</span>
                </div>
                <Slider value={[maxWidth]} min={50} max={90} step={1} onValueChange={([v]) => setMaxWidth(v)} />
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleReset}
                  disabled={!canReset}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t("Скинути до стандартних", "Reset to defaults")}
                </Button>
              </div>
            </section>

            {/* Підказка */}
            <p className="text-xs text-muted-foreground">
              {t(
                "Порада: значення зберігаються у вашому браузері та застосовуються на всіх сторінках читання.",
                "Tip: values persist in your browser and apply across reading pages.",
              )}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
