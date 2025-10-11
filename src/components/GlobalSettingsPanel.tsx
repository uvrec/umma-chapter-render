import { useEffect, useState } from "react";
import { Settings, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const LS_KEY = "veda-reader-prefs";

type ReaderPrefs = {
  fontSizePx: number; // 16..28
  lineHeight: number; // 1.2..2.0
  maxWidthCh: number; // 60..80
};

const DEFAULT_PREFS: ReaderPrefs = { fontSizePx: 20, lineHeight: 1.6, maxWidthCh: 68 };

export const GlobalSettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [prefs, setPrefs] = useState<ReaderPrefs>(DEFAULT_PREFS);

  // load from LS
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  // apply CSS vars + persist
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--vv-reader-font-size", `${prefs.fontSizePx}px`);
    root.style.setProperty("--vv-reader-line-height", String(prefs.lineHeight));
    root.style.setProperty("--vv-reader-max-width", `${prefs.maxWidthCh}ch`);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(prefs));
    } catch {}
  }, [prefs]);

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
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle>{t("Налаштування", "Settings")}</SheetTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="space-y-6">
            {/* Theme */}
            <div>
              <Label className="text-base font-semibold mb-3 block">{t("Тема оформлення", "Theme")}</Label>
              <ThemeToggle />
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

            {/* Reader typography */}
            <div className="space-y-3">
              <Label className="text-base font-semibold block">{t("Текст у читачі", "Reader text")}</Label>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("Розмір шрифту", "Font size")}</span>
                  <span className="text-xs text-muted-foreground">{prefs.fontSizePx}px</span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={28}
                  step={1}
                  value={prefs.fontSizePx}
                  onChange={(e) => setPrefs((p) => ({ ...p, fontSizePx: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("Міжряддя", "Line height")}</span>
                  <span className="text-xs text-muted-foreground">{prefs.lineHeight.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={1.2}
                  max={2.0}
                  step={0.1}
                  value={prefs.lineHeight}
                  onChange={(e) => setPrefs((p) => ({ ...p, lineHeight: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("Ширина тексту", "Text width")}</span>
                  <span className="text-xs text-muted-foreground">{prefs.maxWidthCh}ch</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={80}
                  step={1}
                  value={prefs.maxWidthCh}
                  onChange={(e) => setPrefs((p) => ({ ...p, maxWidthCh: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
