import { useEffect, useState } from "react";
import { Settings, X, Globe, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/ThemeProvider";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider"; // якщо немає — заміни на свій інпут range

const LS_KEYS = {
  fontSize: "vv-reader-font-size",
  lineHeight: "vv-reader-line-height",
};

export const GlobalSettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  // локальні стани читання
  const [fontSize, setFontSize] = useState<number>(() => {
    const v = localStorage.getItem(LS_KEYS.fontSize);
    return v ? parseFloat(v) : 20;
  });
  const [lineHeight, setLineHeight] = useState<number>(() => {
    const v = localStorage.getItem(LS_KEYS.lineHeight);
    return v ? parseFloat(v) : 1.6;
  });

  // застосовуємо у :root → працює на всіх сторінках/роутах
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--vv-reader-font-size", `${fontSize}px`);
    localStorage.setItem(LS_KEYS.fontSize, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--vv-reader-line-height", String(lineHeight));
    localStorage.setItem(LS_KEYS.lineHeight, String(lineHeight));
  }, [lineHeight]);

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <Settings className="h-6 w-6" />
      </Button>

      {/* Settings Panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-80">
          <SheetHeader className="pb-2">
            <div className="flex items-center justify-between">
              <SheetTitle>{t("Налаштування", "Settings")}</SheetTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="space-y-6 py-2">
            {/* Theme */}
            <div>
              <Label className="text-base font-semibold mb-3 block">{t("Тема оформлення", "Theme")}</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>
                  Світла
                </Button>
                <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>
                  Темна
                </Button>
                <Button
                  variant={theme === "craft" ? "default" : "outline"}
                  onClick={() => setTheme("craft")}
                  className="gap-1"
                >
                  <Palette className="w-4 h-4" /> Крафт
                </Button>
              </div>
            </div>

            {/* Language */}
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

            {/* Reader: font size */}
            <div>
              <Label className="text-base font-semibold mb-3 block">{t("Розмір тексту", "Font size")}</Label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={14}
                  max={28}
                  step={1}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="w-12 text-right text-sm tabular-nums">{fontSize}px</div>
              </div>
            </div>

            {/* Reader: line height */}
            <div>
              <Label className="text-base font-semibold mb-3 block">{t("Міжряддя", "Line height")}</Label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1.2}
                  max={2}
                  step={0.05}
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-full"
                />
                <div className="w-12 text-right text-sm tabular-nums">{lineHeight.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
